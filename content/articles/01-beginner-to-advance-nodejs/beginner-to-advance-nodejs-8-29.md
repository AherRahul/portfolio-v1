---
title: "Memory Leaks & Profiling"
description: "Detect and fix memory leaks: heap snapshots, allocation profiling, common leak patterns (global refs, caches), and safe patterns."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-15"
datePublished: "2026-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
resources:
  - title: "Heap Snapshots"
    type: "documentation"
    url: "https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot"
    description: "Debug memory usage in NodeJs"
  - title: "Chrome DevTools Memory"
    type: "documentation"
    url: "https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots/"
    description: "Analyze heap snapshots and leaks"
---

![Memory Leaks & Profiling](https://res.cloudinary.com/duojkrgue/image/upload/v1757930700/Portfolio/nodeJsCourse/29_hjtwky.png)

<!-- # 📖 My Personal Notes – Memory Leaks & Profiling -->

Memory leaks killed my production apps until I learned to hunt them down systematically. Here's how I find and fix memory issues before they crash my servers.

## Common Memory Leak Patterns I've Fixed

### 1. Growing Global Collections
```javascript
// ❌ BAD - Grows forever
const userSessions = new Map()
const requestLogs = []

app.post('/login', (req, res) => {
  userSessions.set(req.body.userId, { /* session data */ })
  requestLogs.push({ timestamp: Date.now(), userId: req.body.userId })
})

// ✅ GOOD - With cleanup
const userSessions = new Map()
const requestLogs = []
const MAX_LOGS = 10000

app.post('/login', (req, res) => {
  userSessions.set(req.body.userId, { 
    data: {}, 
    lastAccess: Date.now() 
  })
  
  requestLogs.push({ timestamp: Date.now(), userId: req.body.userId })
  
  // Cleanup old logs
  if (requestLogs.length > MAX_LOGS) {
    requestLogs.splice(0, requestLogs.length - MAX_LOGS)
  }
  
  // Cleanup old sessions
  cleanupOldSessions()
})

function cleanupOldSessions() {
  const oneHourAgo = Date.now() - 3600000
  for (const [userId, session] of userSessions) {
    if (session.lastAccess < oneHourAgo) {
      userSessions.delete(userId)
    }
  }
}
```

### 2. Event Listener Leaks
```javascript
// ❌ BAD - Listeners never removed
class DataProcessor {
  constructor() {
    this.emitter = new EventEmitter()
    this.emitter.on('data', this.handleData.bind(this))
    setInterval(this.cleanup.bind(this), 5000)
  }
  
  handleData(data) {
    // Process data
  }
}

// ✅ GOOD - Proper cleanup
class DataProcessor {
  constructor() {
    this.emitter = new EventEmitter()
    this.dataHandler = this.handleData.bind(this)
    this.cleanupInterval = null
    
    this.emitter.on('data', this.dataHandler)
    this.cleanupInterval = setInterval(this.cleanup.bind(this), 5000)
  }
  
  handleData(data) {
    // Process data
  }
  
  destroy() {
    this.emitter.removeListener('data', this.dataHandler)
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}
```

## 🔍 Memory Profiling Tools

### Heap Snapshot Analysis
```javascript
// heap-profiler.js
import v8 from 'v8'
import fs from 'fs'

class MemoryProfiler {
  constructor() {
    this.snapshots = []
  }

  takeSnapshot(label = '') {
    const snapshot = v8.getHeapSnapshot()
    const filename = `heap-${Date.now()}-${label}.heapsnapshot`
    
    const fileStream = fs.createWriteStream(filename)
    snapshot.pipe(fileStream)
    
    snapshot.on('end', () => {
      console.log(`Heap snapshot saved: ${filename}`)
      this.snapshots.push({ filename, label, timestamp: Date.now() })
    })
  }

  getMemoryStats() {
    const usage = process.memoryUsage()
    return {
      rss: this.formatBytes(usage.rss),
      heapTotal: this.formatBytes(usage.heapTotal),
      heapUsed: this.formatBytes(usage.heapUsed),
      external: this.formatBytes(usage.external),
      heapUsagePercent: ((usage.heapUsed / usage.heapTotal) * 100).toFixed(2)
    }
  }

  formatBytes(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }
}

const profiler = new MemoryProfiler()

// API endpoints for profiling
app.get('/memory/snapshot', (req, res) => {
  const label = req.query.label || 'manual'
  profiler.takeSnapshot(label)
  res.json({ message: 'Snapshot taken', label })
})

app.get('/memory/stats', (req, res) => {
  res.json(profiler.getMemoryStats())
})
```

### Real-time Memory Monitoring
```javascript
// memory-monitor.js
class MemoryMonitor {
  constructor(options = {}) {
    this.threshold = options.threshold || 200 * 1024 * 1024 // 200MB
    this.alertThreshold = options.alertThreshold || 500 * 1024 * 1024 // 500MB
    this.checkInterval = options.checkInterval || 10000 // 10 seconds
    this.history = []
    this.maxHistory = 100
    
    this.startMonitoring()
  }

  startMonitoring() {
    setInterval(() => {
      const stats = this.collectStats()
      this.history.push(stats)
      
      if (this.history.length > this.maxHistory) {
        this.history.shift()
      }
      
      this.checkForLeaks(stats)
    }, this.checkInterval)
  }

  collectStats() {
    const usage = process.memoryUsage()
    return {
      timestamp: Date.now(),
      rss: usage.rss,
      heapTotal: usage.heapTotal,
      heapUsed: usage.heapUsed,
      external: usage.external,
      uptime: process.uptime()
    }
  }

  checkForLeaks(stats) {
    // Alert on high memory usage
    if (stats.heapUsed > this.alertThreshold) {
      this.sendAlert('HIGH_MEMORY', stats)
    }

    // Check for memory growth trend
    if (this.history.length >= 10) {
      const recent = this.history.slice(-10)
      const trend = this.calculateTrend(recent)
      
      if (trend > 0.1) { // Growing by 10% per measurement
        this.sendAlert('MEMORY_LEAK_SUSPECTED', { trend, recent })
      }
    }
  }

  calculateTrend(data) {
    if (data.length < 2) return 0
    
    const first = data[0].heapUsed
    const last = data[data.length - 1].heapUsed
    
    return (last - first) / first
  }

  sendAlert(type, data) {
    console.warn(`MEMORY ALERT [${type}]:`, {
      type,
      data,
      current: this.formatBytes(data.heapUsed || 0)
    })
    
    // Force garbage collection in development
    if (global.gc && process.env.NODE_ENV === 'development') {
      console.log('Forcing garbage collection...')
      global.gc()
    }
  }

  formatBytes(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }
}

const monitor = new MemoryMonitor()

app.get('/memory/report', (req, res) => {
  res.json(monitor.getReport())
})
```

## 🛠️ Memory Leak Detection

### LRU Cache Implementation
```javascript
// lru-cache.js
class LRUCache {
  constructor(maxSize = 1000) {
    this.maxSize = maxSize
    this.cache = new Map()
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return null
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, value)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

// Usage
const userCache = new LRUCache(500) // Max 500 users

app.get('/users/:id', async (req, res) => {
  const userId = req.params.id
  
  let user = userCache.get(userId)
  if (!user) {
    user = await getUserFromDatabase(userId)
    userCache.set(userId, user)
  }
  
  res.json({ user })
})
```

### WeakMap for Metadata
```javascript
// Using WeakMap to avoid memory leaks
const userMetadata = new WeakMap()

class UserService {
  attachMetadata(user, metadata) {
    userMetadata.set(user, metadata)
  }

  getMetadata(user) {
    return userMetadata.get(user)
  }

  // When user object is garbage collected,
  // metadata is automatically removed
}
```

## 💡 Memory Best Practices

### 1. Regular Profiling
```javascript
// Automated memory health checks
setInterval(() => {
  const usage = process.memoryUsage()
  const heapUsed = usage.heapUsed / 1024 / 1024

  if (heapUsed > 200) { // More than 200MB
    console.warn('High memory usage detected:', heapUsed.toFixed(2), 'MB')
    
    // Take snapshot for analysis
    if (profiler) {
      profiler.takeSnapshot(`high-usage-${heapUsed.toFixed(0)}MB`)
    }
  }
}, 30000) // Check every 30 seconds
```

### 2. Resource Cleanup
```javascript
// Always clean up resources
class ResourceManager {
  constructor() {
    this.resources = new Set()
    
    // Cleanup on process exit
    process.on('SIGTERM', () => this.cleanup())
    process.on('SIGINT', () => this.cleanup())
    process.on('uncaughtException', () => this.cleanup())
  }

  register(resource) {
    this.resources.add(resource)
  }

  unregister(resource) {
    this.resources.delete(resource)
  }

  cleanup() {
    console.log('Cleaning up resources...')
    for (const resource of this.resources) {
      try {
        if (resource.destroy) resource.destroy()
        if (resource.close) resource.close()
        if (resource.end) resource.end()
      } catch (error) {
        console.error('Error cleaning up resource:', error)
      }
    }
    this.resources.clear()
  }
}

const resourceManager = new ResourceManager()
```

---

Memory management in NodeJs is about being proactive. Monitor regularly, clean up resources, use appropriate data structures, and always test under load. A small leak in development becomes a big problem in production!


