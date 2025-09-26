---
title: "Streams & Buffers"
description: "Efficiently process large data with NodeJs streams: readable/writable/duplex/transform, backpressure, piping, and Buffer usage."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
resources:
  - title: "Stream API"
    type: "documentation"
    url: "https://nodejs.org/api/stream.html"
    description: "Official NodeJs Stream API"
  - title: "Buffer"
    type: "documentation"
    url: "https://nodejs.org/api/buffer.html"
    description: "Binary data handling"
---

![Streams & Buffers](https://res.cloudinary.com/duojkrgue/image/upload/v1757930697/Portfolio/nodeJsCourse/26_rhaomt.png)

<!-- # 📖 My Personal Notes – Streams & Buffers -->

Streams confused me at first until I realized they're like pipes in your house—data flows through them chunk by chunk instead of dumping everything at once. Here's how I learned to work with large data efficiently in NodeJs.

## Why Streams Matter

### The Problem with Loading Everything
```javascript
// ❌ BAD - Loads entire file into memory
import { readFile } from 'fs/promises'

async function processLargeFile() {
  const data = await readFile('massive-file.json') // Could be 1GB!
  const parsed = JSON.parse(data)
  // Your server just ate 1GB of RAM
  return parsed
}
```

### The Stream Solution
```javascript
// ✅ GOOD - Processes file chunk by chunk
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'

async function processLargeFileWithStreams() {
  const readStream = createReadStream('massive-file.json')
  
  let processed = 0
  const processStream = new Transform({
    transform(chunk, encoding, callback) {
      processed += chunk.length
      console.log(`Processed ${processed} bytes so far`)
      // Process chunk here
      callback(null, chunk)
    }
  })
  
  await pipeline(readStream, processStream, writeStream)
  // Memory usage stays constant!
}
```

## 🚰 Understanding NodeJs Streams

### The Four Types of Streams
1. **Readable**: You can read data from it (like a file)
2. **Writable**: You can write data to it (like a database)
3. **Duplex**: Both readable and writable (like a socket)
4. **Transform**: Duplex stream that modifies data (like compression)

### Basic File Operations
```javascript
import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

// Simple file copy - handles backpressure automatically
async function copyFile(source, destination) {
  try {
    await pipeline(
      createReadStream(source),
      createWriteStream(destination)
    )
    console.log('File copied successfully')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

// Copy a 10GB file without using 10GB of RAM
await copyFile('huge-video.mp4', 'backup-video.mp4')
```

## 🔄 Transform Streams - The Power Tools

### Text Processing Stream
```javascript
import { Transform } from 'stream'

class UpperCaseTransform extends Transform {
  constructor(options) {
    super(options)
  }

  _transform(chunk, encoding, callback) {
    // Convert chunk to uppercase
    const upperChunk = chunk.toString().toUpperCase()
    callback(null, upperChunk)
  }
}

// Usage
const upperCaseStream = new UpperCaseTransform()

pipeline(
  process.stdin,
  upperCaseStream,
  process.stdout
)
```

### JSON Processing Stream
```javascript
import { Transform } from 'stream'

class JSONLineProcessor extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true })
    this.buffer = ''
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString()
    const lines = this.buffer.split('\n')
    
    // Keep the last partial line in buffer
    this.buffer = lines.pop()
    
    // Process complete lines
    for (const line of lines) {
      if (line.trim()) {
        try {
          const obj = JSON.parse(line)
          this.push(obj)
        } catch (error) {
          console.error('Invalid JSON line:', line)
        }
      }
    }
    
    callback()
  }

  _flush(callback) {
    // Process any remaining data
    if (this.buffer.trim()) {
      try {
        const obj = JSON.parse(this.buffer)
        this.push(obj)
      } catch (error) {
        console.error('Invalid JSON in buffer:', this.buffer)
      }
    }
    callback()
  }
}

// Process a file with one JSON object per line
const processor = new JSONLineProcessor()
processor.on('data', (obj) => {
  console.log('Processed object:', obj)
})

pipeline(
  createReadStream('data.jsonl'),
  processor
)
```

### CSV Processing Stream
```javascript
import { Transform } from 'stream'

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true })
    this.headers = null
    this.buffer = ''
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString()
    const lines = this.buffer.split('\n')
    this.buffer = lines.pop() // Keep partial line

    for (const line of lines) {
      if (!this.headers) {
        this.headers = line.split(',').map(h => h.trim())
      } else {
        const values = line.split(',').map(v => v.trim())
        const obj = {}
        
        this.headers.forEach((header, index) => {
          obj[header] = values[index] || ''
        })
        
        this.push(obj)
      }
    }
    
    callback()
  }

  _flush(callback) {
    if (this.buffer.trim() && this.headers) {
      const values = this.buffer.split(',').map(v => v.trim())
      const obj = {}
      
      this.headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })
      
      this.push(obj)
    }
    callback()
  }
}

// Usage
const csvParser = new CSVParser()

csvParser.on('data', (row) => {
  console.log('Row:', row)
})

pipeline(
  createReadStream('data.csv'),
  csvParser
)
```

## 📦 Buffers - Working with Binary Data

### Buffer Basics
```javascript
// Creating buffers
const buf1 = Buffer.from('Hello World', 'utf8')
const buf2 = Buffer.from([72, 101, 108, 108, 111]) // H-e-l-l-o
const buf3 = Buffer.alloc(10) // 10 bytes of zeros
const buf4 = Buffer.allocUnsafe(10) // 10 bytes of random data (faster)

console.log(buf1.toString()) // 'Hello World'
console.log(buf1.toString('hex')) // '48656c6c6f20576f726c64'
console.log(buf1.toString('base64')) // 'SGVsbG8gV29ybGQ='

// Buffer operations
console.log(buf1.length) // 11 bytes
console.log(buf1[0]) // 72 (ASCII for 'H')

// Concatenating buffers
const combined = Buffer.concat([buf1, buf2])
```

### Working with Binary Files
```javascript
import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'

class BinaryAnalyzer extends Transform {
  constructor() {
    super()
    this.byteCounts = new Array(256).fill(0)
    this.totalBytes = 0
  }

  _transform(chunk, encoding, callback) {
    // Analyze byte frequency
    for (let i = 0; i < chunk.length; i++) {
      this.byteCounts[chunk[i]]++
      this.totalBytes++
    }
    
    // Pass through unchanged
    callback(null, chunk)
  }

  _flush(callback) {
    console.log('Binary Analysis Results:')
    console.log(`Total bytes: ${this.totalBytes}`)
    
    // Find most common bytes
    const sorted = this.byteCounts
      .map((count, byte) => ({ byte, count }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    console.log('Most common bytes:')
    sorted.forEach(item => {
      console.log(`  0x${item.byte.toString(16).padStart(2, '0')}: ${item.count} times`)
    })
    
    callback()
  }
}

// Analyze a binary file
pipeline(
  createReadStream('image.jpg'),
  new BinaryAnalyzer(),
  createWriteStream('image-copy.jpg')
)
```

## 🌊 Advanced Stream Patterns

### HTTP Request/Response Streaming
```javascript
import http from 'http'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'

// Download large file without loading into memory
async function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, async (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`))
        return
      }

      try {
        await pipeline(
          response,
          createWriteStream(filename)
        )
        resolve()
      } catch (error) {
        reject(error)
      }
    })

    request.on('error', reject)
  })
}

// Stream response in Express
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename
  const filepath = path.join(__dirname, 'files', filename)
  
  // Set headers
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Content-Type', 'application/octet-stream')
  
  // Stream file to response
  const fileStream = createReadStream(filepath)
  
  fileStream.on('error', (error) => {
    res.status(404).json({ error: 'File not found' })
  })
  
  fileStream.pipe(res)
})
```

### Database Streaming
```javascript
import { Readable, pipeline } from 'stream'

class DatabaseStream extends Readable {
  constructor(query, options = {}) {
    super({ objectMode: true, ...options })
    this.query = query
    this.offset = 0
    this.batchSize = options.batchSize || 1000
    this.finished = false
  }

  async _read() {
    if (this.finished) {
      this.push(null) // End stream
      return
    }

    try {
      const results = await this.query
        .limit(this.batchSize)
        .offset(this.offset)

      if (results.length === 0) {
        this.finished = true
        this.push(null)
        return
      }

      for (const row of results) {
        this.push(row)
      }

      this.offset += this.batchSize
    } catch (error) {
      this.destroy(error)
    }
  }
}

// Export all users as JSON stream
class JSONLinesTransform extends Transform {
  constructor() {
    super({ objectMode: true })
  }

  _transform(obj, encoding, callback) {
    const line = JSON.stringify(obj) + '\n'
    callback(null, line)
  }
}

// Usage
const userQuery = db('users').select('*')
const dbStream = new DatabaseStream(userQuery)
const jsonTransform = new JSONLinesTransform()

pipeline(
  dbStream,
  jsonTransform,
  createWriteStream('users-export.jsonl')
)
```

### Compression Streaming
```javascript
import { createGzip, createGunzip } from 'zlib'
import { pipeline } from 'stream/promises'

// Compress a file
async function compressFile(inputPath, outputPath) {
  await pipeline(
    createReadStream(inputPath),
    createGzip({ level: 9 }), // Maximum compression
    createWriteStream(outputPath)
  )
}

// Decompress a file
async function decompressFile(inputPath, outputPath) {
  await pipeline(
    createReadStream(inputPath),
    createGunzip(),
    createWriteStream(outputPath)
  )
}

// Stream compression in HTTP response
app.get('/api/large-data', (req, res) => {
  res.setHeader('Content-Encoding', 'gzip')
  res.setHeader('Content-Type', 'application/json')
  
  const dataStream = new Readable({
    read() {
      // Generate large JSON data
      this.push(JSON.stringify({ data: 'huge dataset...' }))
      this.push(null)
    }
  })
  
  pipeline(
    dataStream,
    createGzip(),
    res
  ).catch(console.error)
})
```

## ⚡ Performance and Memory Management

### Monitoring Stream Performance
```javascript
import { Transform } from 'stream'

class PerformanceMonitor extends Transform {
  constructor(name, options = {}) {
    super(options)
    this.name = name
    this.startTime = Date.now()
    this.bytesProcessed = 0
    this.chunks = 0
  }

  _transform(chunk, encoding, callback) {
    this.bytesProcessed += chunk.length
    this.chunks++
    
    // Log progress every 1000 chunks
    if (this.chunks % 1000 === 0) {
      const elapsed = Date.now() - this.startTime
      const throughput = (this.bytesProcessed / elapsed * 1000).toFixed(2)
      console.log(`${this.name}: ${this.chunks} chunks, ${throughput} bytes/sec`)
    }
    
    callback(null, chunk)
  }

  _flush(callback) {
    const elapsed = Date.now() - this.startTime
    const throughput = (this.bytesProcessed / elapsed * 1000).toFixed(2)
    console.log(`${this.name} finished: ${this.bytesProcessed} bytes in ${elapsed}ms (${throughput} bytes/sec)`)
    callback()
  }
}

// Usage
pipeline(
  createReadStream('large-file.txt'),
  new PerformanceMonitor('File Processing'),
  new UpperCaseTransform(),
  createWriteStream('output.txt')
)
```

### Backpressure Handling
```javascript
import { Writable } from 'stream'

class SlowWriter extends Writable {
  constructor(options) {
    super(options)
    this.processedChunks = 0
  }

  _write(chunk, encoding, callback) {
    // Simulate slow processing
    setTimeout(() => {
      this.processedChunks++
      console.log(`Processed chunk ${this.processedChunks}`)
      callback()
    }, 100) // 100ms delay per chunk
  }
}

// The stream will automatically handle backpressure
// If SlowWriter can't keep up, the pipeline will pause reading
pipeline(
  createReadStream('input.txt'),
  new SlowWriter()
)
```

## 🛠️ Practical Stream Applications

### Log File Processor
```javascript
class LogProcessor extends Transform {
  constructor() {
    super({ objectMode: true })
    this.stats = {
      total: 0,
      errors: 0,
      warnings: 0,
      info: 0
    }
  }

  _transform(line, encoding, callback) {
    this.stats.total++
    
    try {
      const logEntry = JSON.parse(line)
      
      // Count by level
      if (logEntry.level) {
        this.stats[logEntry.level] = (this.stats[logEntry.level] || 0) + 1
      }
      
      // Filter only errors and warnings
      if (logEntry.level === 'error' || logEntry.level === 'warning') {
        this.push(JSON.stringify(logEntry) + '\n')
      }
    } catch (error) {
      console.error('Invalid log line:', line)
    }
    
    callback()
  }

  _flush(callback) {
    console.log('Log processing stats:', this.stats)
    callback()
  }
}

// Process log files
pipeline(
  createReadStream('app.log'),
  split(), // Split by lines
  new LogProcessor(),
  createWriteStream('errors-and-warnings.log')
)
```

### Real-time Data Processing
```javascript
import { EventEmitter } from 'events'
import { Writable } from 'stream'

class RealTimeProcessor extends Writable {
  constructor(options) {
    super({ objectMode: true, ...options })
    this.window = []
    this.windowSize = options.windowSize || 100
    this.emitter = new EventEmitter()
  }

  _write(data, encoding, callback) {
    this.window.push(data)
    
    if (this.window.length > this.windowSize) {
      this.window.shift()
    }
    
    // Calculate metrics
    const avg = this.window.reduce((sum, val) => sum + val, 0) / this.window.length
    const max = Math.max(...this.window)
    const min = Math.min(...this.window)
    
    this.emitter.emit('metrics', { avg, max, min, count: this.window.length })
    
    callback()
  }
}

// Usage
const processor = new RealTimeProcessor({ windowSize: 50 })

processor.emitter.on('metrics', (metrics) => {
  console.log(`Avg: ${metrics.avg.toFixed(2)}, Max: ${metrics.max}, Min: ${metrics.min}`)
})

// Simulate real-time data
setInterval(() => {
  processor.write(Math.random() * 100)
}, 100)
```

## 💡 Stream Best Practices I Follow

### 1. Always Handle Errors
```javascript
// ❌ BAD - Errors can crash the app
readStream.pipe(writeStream)

// ✅ GOOD - Handle errors properly
pipeline(readStream, transformStream, writeStream)
  .catch(error => {
    console.error('Pipeline error:', error)
    // Clean up resources
  })
```

### 2. Use Object Mode for Non-Buffer Data
```javascript
// When working with objects, not buffers
const transform = new Transform({
  objectMode: true,
  transform(obj, encoding, callback) {
    // Process object
    callback(null, processedObj)
  }
})
```

### 3. Implement Proper Cleanup
```javascript
class CustomTransform extends Transform {
  constructor(options) {
    super(options)
    this.resources = new Map()
  }

  _destroy(error, callback) {
    // Clean up resources
    this.resources.clear()
    callback(error)
  }
}
```

### 4. Monitor Memory Usage
```javascript
// Check memory usage periodically
setInterval(() => {
  const usage = process.memoryUsage()
  console.log(`Memory: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`)
}, 5000)
```

---

Streams are one of NodeJs's superpowers. Once you understand them, you can process files of any size, handle real-time data, and build memory-efficient applications that scale beautifully.

The key is thinking in terms of data flow rather than data storage. Let the data stream through your application like water through pipes!


