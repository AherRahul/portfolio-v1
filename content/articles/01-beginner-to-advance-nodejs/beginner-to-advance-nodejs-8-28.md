---
title: "Performance Optimization"
description: "Find and fix hot paths: profiling, event loop lag, caching, streaming, logging costs, and efficient data access patterns."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - performance
resources:
  - title: "NodeJs Profiling"
    type: "documentation"
    url: "https://nodejs.org/en/learn/getting-started/profiling"
    description: "CPU profiles and heap snapshots"
  - title: "clinic.js"
    type: "tool"
    url: "https://clinicjs.org/"
    description: "Performance analysis toolkit for NodeJs"
---

![Performance Optimization](https://res.cloudinary.com/duojkrgue/image/upload/v1757930700/Portfolio/nodeJsCourse/28_mladc3.png)

<!-- # 📖 My Personal Notes – Performance Optimization -->

Performance problems used to frustrate me until I learned to measure first, optimize second. Here's my systematic approach to making NodeJs apps fast and efficient.

## Why Performance Matters

Slow apps lose users:
- **100ms delay** = 1% conversion drop
- **1 second delay** = 7% conversion drop  
- **3+ seconds** = 40% users abandon

Fast apps make money and happy users.

## 🔍 Measuring Performance

### Essential Metrics I Track
```javascript
// Basic performance monitoring
import prometheus from 'prom-client'

// Request duration histogram
const httpDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
})

// Request counter
const httpRequests = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

// Middleware to collect metrics
export function metricsMiddleware(req, res, next) {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    const route = req.route?.path || req.path
    
    httpDuration.labels(req.method, route, res.statusCode).observe(duration)
    httpRequests.labels(req.method, route, res.statusCode).inc()
  })
  
  next()
}
```

## ⚡ Quick Performance Wins

### 1. Efficient Caching
```javascript
// multi-layer-cache.js
import NodeCache from 'node-cache'
import redis from 'redis'

class MultiLayerCache {
  constructor() {
    // L1: In-memory cache (fastest)
    this.l1Cache = new NodeCache({ 
      stdTTL: 60, // 1 minute
      maxKeys: 1000 
    })
    
    // L2: Redis cache (shared across instances)
    this.l2Cache = redis.createClient()
  }

  async get(key) {
    // Try L1 cache first
    let value = this.l1Cache.get(key)
    if (value !== undefined) {
      return value
    }

    // Try L2 cache
    const redisValue = await this.l2Cache.get(key)
    if (redisValue) {
      value = JSON.parse(redisValue)
      
      // Populate L1 cache
      this.l1Cache.set(key, value, 60)
      return value
    }

    return null
  }

  async set(key, value, ttl = 3600) {
    // Set in both caches
    this.l1Cache.set(key, value, Math.min(ttl, 60))
    await this.l2Cache.setex(key, ttl, JSON.stringify(value))
  }
}
```

### 2. Database Query Optimization
```javascript
// db-optimizer.js
class DatabaseOptimizer {
  constructor(db) {
    this.db = db
    this.slowQueries = []
  }

  async executeQuery(sql, params = []) {
    const start = Date.now()
    
    try {
      const result = await this.db.query(sql, params)
      const duration = Date.now() - start
      
      // Log slow queries
      if (duration > 1000) { // Slower than 1 second
        this.slowQueries.push({
          sql,
          params,
          duration,
          timestamp: new Date().toISOString()
        })
        
        console.warn(`Slow query (${duration}ms):`, sql)
      }
      
      return result
    } catch (error) {
      console.error(`Query failed:`, sql, error.message)
      throw error
    }
  }

  // Pagination helper
  async paginatedQuery(baseQuery, page = 1, limit = 20) {
    const offset = (page - 1) * limit
    
    // Get total count (cached)
    const countQuery = baseQuery.replace(/SELECT .* FROM/, 'SELECT COUNT(*) FROM')
    const countResult = await this.executeQuery(countQuery)
    const total = countResult[0]['COUNT(*)']
    
    // Get paginated results
    const paginatedQuery = `${baseQuery} LIMIT ${limit} OFFSET ${offset}`
    const results = await this.executeQuery(paginatedQuery)
    
    return {
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}
```

### 3. Response Optimization
```javascript
// response-optimizer.js
import compression from 'compression'
import { Readable } from 'stream'

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
  level: 6, // Good balance of speed vs compression
  threshold: 1024 // Only compress responses > 1KB
}))

// Streaming JSON responses for large datasets
class JSONStream extends Readable {
  constructor(data, options = {}) {
    super({ ...options, objectMode: false })
    this.data = data
    this.index = 0
    this.started = false
  }

  _read() {
    if (!this.started) {
      this.push('{"data":[')
      this.started = true
    }

    if (this.index < this.data.length) {
      const item = this.data[this.index]
      const prefix = this.index > 0 ? ',' : ''
      this.push(prefix + JSON.stringify(item))
      this.index++
    } else {
      this.push(']}')
      this.push(null) // End stream
    }
  }
}

// Stream large responses
app.get('/api/export/users', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Transfer-Encoding', 'chunked')
  
  const users = await getUsersInBatches()
  const stream = new JSONStream(users)
  
  stream.pipe(res)
})
```

## 🚀 Advanced Optimizations

### CPU Profiling
```javascript
// cpu-profiler.js
import { Session } from 'inspector'
import fs from 'fs'

class CPUProfiler {
  constructor() {
    this.session = new Session()
    this.session.connect()
  }

  async start() {
    await new Promise((resolve, reject) => {
      this.session.post('Profiler.enable', (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await new Promise((resolve, reject) => {
      this.session.post('Profiler.start', (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    console.log('CPU profiling started')
  }

  async stop(filename = 'cpu-profile.cpuprofile') {
    const profile = await new Promise((resolve, reject) => {
      this.session.post('Profiler.stop', (err, { profile }) => {
        if (err) reject(err)
        else resolve(profile)
      })
    })

    fs.writeFileSync(filename, JSON.stringify(profile))
    console.log(`CPU profile saved to ${filename}`)
    
    this.session.disconnect()
    return profile
  }
}
```

### Connection Pooling
```javascript
// connection-pool.js
import mysql from 'mysql2/promise'

class ConnectionPool {
  constructor(config) {
    this.pool = mysql.createPool({
      ...config,
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      
      // Connection management
      idleTimeout: 300000, // 5 minutes
      maxIdle: 5,
      
      // Performance tuning
      multipleStatements: false,
      namedPlaceholders: true
    })

    this.stats = {
      queries: 0,
      errors: 0,
      avgQueryTime: 0
    }
  }

  async query(sql, params = []) {
    const start = Date.now()
    
    try {
      const [results] = await this.pool.execute(sql, params)
      
      // Update stats
      const duration = Date.now() - start
      this.stats.queries++
      this.stats.avgQueryTime = (
        (this.stats.avgQueryTime * (this.stats.queries - 1) + duration) / 
        this.stats.queries
      )
      
      return results
    } catch (error) {
      this.stats.errors++
      throw error
    }
  }
}
```

## 💡 Performance Best Practices

### My Performance Checklist
- [ ] Enable compression
- [ ] Implement caching layers
- [ ] Optimize database queries
- [ ] Use connection pooling
- [ ] Stream large responses
- [ ] Monitor event loop lag
- [ ] Profile CPU and memory
- [ ] Set up proper logging

### Common Performance Killers I Avoid
1. **Synchronous operations** in request handlers
2. **Memory leaks** from unhandled events
3. **N+1 database queries** 
4. **Large JSON parsing** without streaming
5. **No connection pooling**
6. **Missing indexes** on database queries

---

Performance optimization is an ongoing process. Start with measuring, identify bottlenecks, fix the biggest issues first, then measure again. Small optimizations compound into significant improvements.


