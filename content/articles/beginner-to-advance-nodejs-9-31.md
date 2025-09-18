---
title: "Debugging & Inspecting Nodejs"
description: "Use Node inspector, Chrome DevTools, VS Code debugger; breakpoints, watch expressions, CPU profiling, and memory tools."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - debugging
resources:
  - title: "Debugging Nodejs"
    type: "documentation"
    url: "https://nodejs.org/en/learn/getting-started/debugging"
    description: "Official debugging guide"
  - title: "DevTools Guide"
    type: "documentation"
    url: "https://developer.chrome.com/docs/devtools/"
    description: "Chrome DevTools reference"
---

![Debugging & Inspecting Nodejs](https://res.cloudinary.com/duojkrgue/image/upload/v1757930700/Portfolio/nodeJsCourse/31_tfmesl.png)

<!-- # 📖 My Personal Notes – Debugging & Inspecting Nodejs -->

Debugging used to be my biggest frustration until I learned the right tools and techniques. Here's how I debug Nodejs apps efficiently, from simple console.log to advanced profiling.

## 🔍 Debugging Fundamentals

### Beyond console.log
```javascript
// ❌ Basic but limited
console.log('User:', user)

// ✅ Better debugging output
console.log('🔍 Debug - User data:', JSON.stringify(user, null, 2))
console.table(users) // Great for arrays of objects
console.time('api-call')
// ... some operation
console.timeEnd('api-call')

// Group related logs
console.group('User Processing')
console.log('Validating user...')
console.log('Saving to database...')
console.groupEnd()

// Conditional logging
const DEBUG = process.env.NODE_ENV === 'development'
if (DEBUG) console.log('Debug info:', data)

// Stack traces
console.trace('How did we get here?')
```

### Smart Logging with debug module
```javascript
import debug from 'debug'

// Create different debug channels
const debugApp = debug('app')
const debugDB = debug('app:database')
const debugAPI = debug('app:api')
const debugAuth = debug('app:auth')

// Usage
debugApp('Application starting')
debugDB('Connecting to database: %s', process.env.DB_HOST)
debugAPI('Handling request: %s %s', req.method, req.url)
debugAuth('User %s attempting login', req.body.email)

// Run with specific debug channels
// DEBUG=app:* node server.js
// DEBUG=app:database,app:auth node server.js
```

## 🛠️ Nodejs Inspector

### Starting the Inspector
```bash
# Start with inspector
node --inspect server.js

# Debug from the start
node --inspect-brk server.js

# Custom port
node --inspect=0.0.0.0:9229 server.js

# For production debugging (be careful!)
node --inspect=127.0.0.1:9229 server.js
```

### Programmatic Debugging
```javascript
// Enable inspector programmatically
import inspector from 'inspector'

if (process.env.NODE_ENV === 'development') {
  inspector.open(9229, '127.0.0.1', true)
  console.log('Debugger listening on ws://127.0.0.1:9229')
}

// Debug specific conditions
function debugOnError(error) {
  if (process.env.DEBUG_ON_ERROR && inspector.url()) {
    console.log('Triggering debugger on error:', error.message)
    debugger // Breakpoint in code
  }
}
```

## 🔧 VS Code Debugging Setup

### Launch Configuration
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Program",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/server.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "app:*"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeArgs": ["--nolazy"],
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Attach to Process",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "localRoot": "${workspaceFolder}",
      "remoteRoot": ".",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "env": {
        "NODE_ENV": "test"
      }
    }
  ]
}
```

### Advanced Debugging Features
```javascript
// Conditional breakpoints
function processUser(user) {
  // Set breakpoint with condition: user.role === 'admin'
  console.log('Processing user:', user.name)
  
  if (user.role === 'admin') {
    // This will only break for admin users
    handleAdminUser(user)
  }
  
  return user
}

// Logpoints (instead of console.log)
function calculateTotal(items) {
  let total = 0
  
  for (const item of items) {
    // Logpoint: "Item: {item.name}, Price: {item.price}"
    total += item.price
  }
  
  return total
}
```

## 🌐 Chrome DevTools Integration

### Remote Debugging Setup
```javascript
// server.js
import express from 'express'

const app = express()

// Debug endpoint for DevTools
if (process.env.NODE_ENV === 'development') {
  app.get('/debug', (req, res) => {
    res.json({
      message: 'Debug endpoint',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      version: process.version,
      debuggerUrl: inspector.url()
    })
  })
}

app.listen(3000, () => {
  console.log('Server running on port 3000')
  console.log('Chrome DevTools URL:', inspector.url())
})
```

## 🧪 Advanced Debugging Techniques

### Memory Debugging
```javascript
// Memory leak detector
class MemoryDebugger {
  constructor() {
    this.baselines = new Map()
    this.intervals = new Map()
  }

  startMonitoring(label, intervalMs = 5000) {
    const interval = setInterval(() => {
      const usage = process.memoryUsage()
      console.log(`[${label}] Memory: ${this.formatBytes(usage.heapUsed)}`)
      
      // Alert on high usage
      if (usage.heapUsed > 100 * 1024 * 1024) { // 100MB
        console.warn(`⚠️ High memory usage: ${this.formatBytes(usage.heapUsed)}`)
      }
    }, intervalMs)
    
    this.intervals.set(label, interval)
  }

  takeSnapshot(label) {
    const usage = process.memoryUsage()
    this.baselines.set(label, usage)
    console.log(`📸 Snapshot [${label}]:`, this.formatMemory(usage))
  }

  formatBytes(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }
}

const memDebugger = new MemoryDebugger()

// Usage
memDebugger.takeSnapshot('start')
memDebugger.startMonitoring('api-requests')
```

### Request Tracing
```javascript
// Request tracer middleware
import { randomUUID } from 'crypto'

function requestTracer(req, res, next) {
  req.traceId = randomUUID()
  req.startTime = Date.now()
  
  // Enhanced logging
  const originalLog = console.log
  console.log = (...args) => {
    originalLog(`[${req.traceId}]`, ...args)
  }
  
  // Trace response
  const originalSend = res.send
  res.send = function(data) {
    const duration = Date.now() - req.startTime
    console.log(`Request completed: ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`)
    return originalSend.call(this, data)
  }
  
  next()
}

app.use(requestTracer)
```

## 🔧 Production Debugging

### Safe Production Debugging
```javascript
// Production debug helper
class ProductionDebugger {
  constructor() {
    this.enabled = process.env.NODE_ENV !== 'production'
    this.safeMode = process.env.DEBUG_SAFE_MODE === 'true'
  }

  debug(message, data = {}) {
    if (!this.enabled) return
    
    if (this.safeMode) {
      // Sanitize sensitive data
      const sanitized = this.sanitizeData(data)
      console.log(`🔍 ${message}`, sanitized)
    } else {
      console.log(`🔍 ${message}`, data)
    }
  }

  sanitizeData(data) {
    const sanitized = { ...data }
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization']
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    }
    
    return sanitized
  }
}

const prodDebug = new ProductionDebugger()

// Usage
app.use((req, res, next) => {
  prodDebug.debug('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    authorization: req.get('Authorization') // Will be sanitized
  })
  
  next()
})
```

## 💡 Debugging Best Practices

### My Debugging Workflow
1. **Reproduce the issue** consistently
2. **Add strategic logging** around the problem area
3. **Use breakpoints** to inspect state
4. **Check assumptions** with assertions
5. **Test the fix** thoroughly

### Debugging Checklist
```javascript
// Debug checklist helper
class DebugChecklist {
  static checkEnvironment() {
    console.log('🔍 Environment Check:')
    console.log('Node version:', process.version)
    console.log('Platform:', process.platform)
    console.log('Memory:', process.memoryUsage())
    console.log('Working directory:', process.cwd())
    console.log('Environment:', process.env.NODE_ENV)
  }

  static async checkConnections() {
    console.log('🔍 Connection Check:')
    
    // Database
    try {
      await db.raw('SELECT 1')
      console.log('✅ Database connection: OK')
    } catch (error) {
      console.log('❌ Database connection: FAILED', error.message)
    }
  }
}

// Run checks on startup
if (process.env.DEBUG_STARTUP) {
  DebugChecklist.checkEnvironment()
  DebugChecklist.checkConnections()
}
```

---

Debugging is a skill that improves with practice. Start with simple techniques like enhanced logging, then gradually work up to advanced profiling and tracing. The key is having the right tools ready when problems arise.

Remember: the best debugging session is the one you don't need because you prevented the bug in the first place!


