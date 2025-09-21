---
title: "Clustering & Scaling"
description: "Scale NodeJs across CPU cores with cluster and worker threads; horizontal scaling patterns, sticky sessions, and stateless design."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - scaling
resources:
  - title: "Cluster"
    type: "documentation"
    url: "https://nodejs.org/api/cluster.html"
    description: "Built-in clustering module"
  - title: "Worker Threads"
    type: "documentation"
    url: "https://nodejs.org/api/worker_threads.html"
    description: "CPU-bound work off main thread"
---

![Clustering & Scaling](https://res.cloudinary.com/duojkrgue/image/upload/v1757930700/Portfolio/nodeJsCourse/27_q39y2j.png)

<!-- # 📖 My Personal Notes – Clustering & Scaling -->

Single-threaded NodeJs always bugged me until I learned about clustering. Here's how I scale NodeJs apps from one core to many cores, and from one server to many servers.

## Understanding NodeJs Single-Threading

NodeJs runs JavaScript on a single thread, but that doesn't mean it can't use multiple CPU cores. Here's the distinction:

- **Event Loop**: Single-threaded (your JavaScript code)
- **libuv Thread Pool**: Multi-threaded (file I/O, DNS, some crypto)
- **Cluster Module**: Creates multiple NodeJs processes

## 🖥️ Cluster Module - Multi-Core on One Machine

### Basic Clustering
```javascript
// server.js
import cluster from 'cluster'
import os from 'os'
import express from 'express'

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)
  
  // Fork workers equal to CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  // Replace crashed workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`)
    cluster.fork()
  })
  
} else {
  // Worker process
  const app = express()
  
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Hello from worker',
      pid: process.pid,
      worker: cluster.worker.id
    })
  })
  
  const server = app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`)
  })
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} shutting down`)
    server.close(() => {
      process.exit(0)
    })
  })
}
```

## 🧵 Worker Threads - CPU-Intensive Tasks

For CPU-heavy work, use worker threads instead of clustering:

```javascript
// cpu-intensive-service.js
import { Worker, isMainThread, parentPort } from 'worker_threads'
import os from 'os'

class WorkerPool {
  constructor(workerScript, poolSize = os.cpus().length) {
    this.workerScript = workerScript
    this.poolSize = poolSize
    this.workers = []
    this.queue = []
    this.init()
  }

  init() {
    for (let i = 0; i < this.poolSize; i++) {
      this.createWorker()
    }
  }

  createWorker() {
    const worker = new Worker(this.workerScript)
    worker.isAvailable = true
    
    worker.on('message', (result) => {
      worker.isAvailable = true
      worker.currentResolve(result)
      this.processQueue()
    })

    this.workers.push(worker)
    return worker
  }

  async execute(data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject })
      this.processQueue()
    })
  }

  processQueue() {
    if (this.queue.length === 0) return

    const availableWorker = this.workers.find(w => w.isAvailable)
    if (!availableWorker) return

    const { data, resolve, reject } = this.queue.shift()
    
    availableWorker.isAvailable = false
    availableWorker.currentResolve = resolve
    availableWorker.currentReject = reject
    
    availableWorker.postMessage(data)
  }
}

// fibonacci-worker.js (separate file)
if (!isMainThread) {
  parentPort.on('message', (n) => {
    function fibonacci(num) {
      if (num < 2) return num
      return fibonacci(num - 1) + fibonacci(num - 2)
    }
    
    const result = fibonacci(n)
    parentPort.postMessage({ input: n, result })
  })
}
```

## 🌐 Horizontal Scaling - Multiple Servers

### Load Balancer Configuration (Nginx)
```nginx
# nginx.conf
upstream nodejs_backend {
    least_conn;
    server 192.168.1.10:3000 weight=3;
    server 192.168.1.11:3000 weight=3;
    server 192.168.1.12:3000 weight=2;
}

server {
    listen 80;
    server_name myapp.com;

    location / {
        proxy_pass http://nodejs_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Health checks
        proxy_next_upstream error timeout invalid_header http_500;
        proxy_connect_timeout 5s;
    }
}
```

### Stateless Application Design
```javascript
// stateless-app.js
import express from 'express'
import redis from 'redis'
import session from 'express-session'
import RedisStore from 'connect-redis'

const app = express()
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
})

// Externalize sessions to Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}))
```

## 💡 Scaling Best Practices I Follow

### 1. Measure Before Scaling
```javascript
// benchmark.js
import autocannon from 'autocannon'

async function benchmark() {
  const result = await autocannon({
    url: 'http://localhost:3000',
    connections: 100,
    duration: 30
  })
  
  console.log('Requests/sec:', result.requests.average)
  console.log('Latency p99:', result.latency.p99)
}
```

### 2. Start Simple, Scale Gradually
```
1. Single NodeJs process
2. Add clustering (same machine)
3. Add load balancer + multiple servers
4. Add microservices (if needed)
```

### 3. Design for Failure
```javascript
// Circuit breaker pattern
class CircuitBreaker {
  constructor(options = {}) {
    this.threshold = options.threshold || 5
    this.timeout = options.timeout || 30000
    this.failures = 0
    this.state = 'CLOSED'
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN')
      }
      this.state = 'HALF_OPEN'
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  onSuccess() {
    this.failures = 0
    this.state = 'CLOSED'
  }

  onFailure() {
    this.failures++
    if (this.failures >= this.threshold) {
      this.state = 'OPEN'
      this.nextAttempt = Date.now() + this.timeout
    }
  }
}
```

---

Scaling is a journey, not a destination. Start with clustering to use all CPU cores, then move to horizontal scaling when you need more than one machine can provide. Always measure first, scale second, and design for the inevitable failures along the way.


