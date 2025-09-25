---
title: "Web Workers & Concurrency"
description: "Master Web Workers and concurrent programming in JavaScript. Learn to move intensive computations off the main thread, implement parallel processing, and build responsive applications that never block the UI."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
  - performance
  - concurrency
resources:
  - title: "Web Workers API - MDN"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API"
    description: "Comprehensive Web Workers API documentation"
  - title: "SharedArrayBuffer - MDN"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer"
    description: "Shared memory between workers and main thread"
  - title: "OffscreenCanvas API"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas"
    description: "Canvas rendering in Web Workers"
  - title: "Comlink Library"
    type: "article"
    url: "https://github.com/GoogleChromeLabs/comlink"
    description: "Simplified communication with Web Workers"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811614/Portfolio/javaScriptCourse/images/all%20title%20images/46_uyspil.png)

Web Workers & Concurrency – Parallel Processing in JavaScript
=============================================================

Imagine you're managing a **modern restaurant kitchen** 👨‍🍳 with multiple specialized stations working simultaneously:

- **Head Chef (Main Thread)** 🍽️ - Coordinates orders, manages customer service, handles final plating, and ensures smooth restaurant operation. Must always be available to respond to customer needs and manage the dining experience.

- **Prep Cooks (Web Workers)** 🥕 - Work independently in the background on time-consuming tasks: chopping vegetables, marinating meat, preparing sauces, baking bread. They don't interact with customers but do essential work that would otherwise slow down service.

- **Specialized Stations (Dedicated Workers)** 🍝 - Pasta station, grill station, dessert station each have dedicated workers who focus on specific types of intensive work. They operate independently but coordinate through the head chef.

- **Shared Resources (SharedArrayBuffer)** 📋 - Common ingredient storage, shared prep lists, inventory systems that all workers can access and update simultaneously while maintaining consistency.

- **Communication System (Message Passing)** 📞 - Orders flow from head chef to workers, completed dishes come back, status updates keep everyone coordinated. Clear protocols prevent confusion and ensure efficiency.

- **Parallel Processing** ⚡ - While one worker prepares appetizers, another grills main courses, and a third makes desserts. Multiple complex tasks happen simultaneously without blocking each other.

- **Load Balancing** ⚖️ - During busy periods, workers can be reassigned to handle bottlenecks. If dessert orders surge, extra workers help the dessert station while maintaining other operations.

**Web Workers operate exactly like this professional kitchen system.** They enable true parallel processing in JavaScript applications:

- **Main Thread Protection** - Keep the UI responsive by moving heavy computations to background workers
- **Parallel Processing** - Run multiple intensive tasks simultaneously across different worker threads
- **Specialized Workers** - Create dedicated workers for specific types of computation (image processing, data analysis, etc.)
- **Shared Memory** - Use SharedArrayBuffer for efficient data sharing between threads
- **Message-Based Communication** - Coordinate between main thread and workers through structured message passing
- **Resource Management** - Distribute workload efficiently across available CPU cores

Understanding Web Workers is essential for building performant applications that handle intensive computations while maintaining smooth, responsive user interfaces.

## The Theoretical Foundation: Concurrency and Parallel Processing 📐

### Understanding JavaScript's Threading Model

**JavaScript has evolved from single-threaded to concurrent processing:**

**Single-threaded Event Loop:**
- **Main Thread**: Executes JavaScript, handles DOM manipulation, manages events
- **Call Stack**: Function execution context stack
- **Event Queue**: Asynchronous operations waiting to execute
- **Blocking Problem**: Long-running operations freeze the entire application

**Web Workers Concurrency Model:**
- **Separate Thread**: Independent JavaScript execution context
- **Isolated Memory**: No shared memory with main thread (except SharedArrayBuffer)
- **Message Passing**: Communication through serialized messages
- **Parallel Execution**: True concurrency for CPU-intensive tasks

### Concurrency vs Parallelism Theory

**Understanding the distinction between concurrent and parallel execution:**

**Concurrency:**
- **Definition**: Multiple tasks making progress simultaneously through time slicing
- **Implementation**: Single core switching between tasks rapidly
- **JavaScript Example**: Event loop handling multiple async operations
- **Benefit**: Better responsiveness and resource utilization

**Parallelism:**
- **Definition**: Multiple tasks executing simultaneously on different cores
- **Implementation**: Multiple CPU cores working independently
- **Web Workers Example**: Different threads running on different cores
- **Benefit**: True performance improvement for CPU-bound tasks

**Why This Matters:**
- **UI Responsiveness**: Parallelism prevents main thread blocking
- **Performance Scaling**: Utilize multi-core processors effectively
- **Resource Optimization**: Distribute computational load across available hardware

### Memory Models and Data Sharing

**Web Workers implement different memory sharing strategies:**

**Isolated Memory (Default):**
- **Separate Heap**: Each worker has independent memory space
- **Message Cloning**: Data copied when passed between threads
- **Safety**: No race conditions or memory corruption
- **Overhead**: Data serialization/deserialization costs

**Shared Memory (SharedArrayBuffer):**
- **Shared Heap**: Multiple threads access same memory region
- **Direct Access**: No copying overhead for large datasets
- **Synchronization**: Requires careful coordination to prevent race conditions
- **Performance**: Extremely efficient for large data processing

**Transferable Objects:**
- **Ownership Transfer**: Move data between threads without copying
- **Zero-Copy**: Efficient transfer of large binary data
- **Use Cases**: Images, audio data, large typed arrays
- **Limitation**: Original thread loses access to transferred data

### Worker Types and Use Cases

**Different worker types serve different purposes:**

**Dedicated Workers:**
- **One-to-One**: Single worker per main thread
- **Persistent**: Long-lived for ongoing computations
- **Use Cases**: Image processing, data analysis, encryption

**Shared Workers:**
- **Many-to-One**: Multiple pages/tabs share one worker
- **Cross-Context**: Communication between different browser contexts
- **Use Cases**: Shared caches, real-time data synchronization

**Service Workers:**
- **Background Processing**: Run independently of web pages
- **Lifecycle Management**: Persist beyond page lifecycle
- **Use Cases**: Offline functionality, push notifications, background sync

## The Problem: Main Thread Blocking and Poor Concurrency 😤

### CPU-Intensive Operations Blocking UI

**Without Web Workers, heavy computations freeze the entire application:**

```javascript
// Problematic: Heavy computations on main thread
class MainThreadBlockingOperations {
    constructor() {
        this.setupUI();
        this.bindEvents();
        
        console.log('Application started - all operations on main thread');
    }
    
    setupUI() {
        // Create UI elements that should remain responsive
        const container = document.createElement('div');
        container.innerHTML = `
            <div id="ui-container">
                <h1>Heavy Computation Demo</h1>
                <button id="fibonacci-btn">Calculate Fibonacci (45)</button>
                <button id="prime-btn">Find Large Primes</button>
                <button id="image-btn">Process Image (CPU intensive)</button>
                <button id="matrix-btn">Matrix Multiplication</button>
                <button id="animation-btn">Start Animation</button>
                
                <div id="status">Ready</div>
                <div id="progress">0%</div>
                <div id="result">No results yet</div>
                
                <!-- Animation element to test responsiveness -->
                <div id="spinner" style="
                    width: 50px; 
                    height: 50px; 
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
            </div>
            
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(container);
    }
    
    bindEvents() {
        document.getElementById('fibonacci-btn').addEventListener('click', () => {
            this.calculateFibonacci(45);
        });
        
        document.getElementById('prime-btn').addEventListener('click', () => {
            this.findPrimes(1000000);
        });
        
        document.getElementById('image-btn').addEventListener('click', () => {
            this.processImage();
        });
        
        document.getElementById('matrix-btn').addEventListener('click', () => {
            this.multiplyMatrices(500);
        });
        
        document.getElementById('animation-btn').addEventListener('click', () => {
            this.startAnimation();
        });
    }
    
    // Fibonacci calculation - blocks main thread for ~10 seconds
    calculateFibonacci(n) {
        console.log(`Starting Fibonacci calculation for n=${n}`);
        this.updateStatus('Calculating Fibonacci...');
        
        const startTime = performance.now();
        
        // Recursive Fibonacci - extremely inefficient and blocking
        const fibonacci = (num) => {
            if (num <= 1) return num;
            return fibonacci(num - 1) + fibonacci(num - 2);
        };
        
        try {
            // This BLOCKS the main thread for several seconds!
            const result = fibonacci(n);
            
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            
            this.updateResult(`Fibonacci(${n}) = ${result} (${duration}ms)`);
            this.updateStatus('Fibonacci complete');
            
            console.log(`Fibonacci calculation completed: ${result}`);
            
        } catch (error) {
            this.updateStatus('Fibonacci calculation failed');
            console.error('Fibonacci error:', error);
        }
        
        // Problems during this calculation:
        // 1. UI completely frozen for 10+ seconds
        // 2. No user interaction possible
        // 3. Animations stop
        // 4. Browser may show "page unresponsive" warning
        // 5. No progress updates possible
    }
    
    // Prime number finding - intensive computation
    findPrimes(limit) {
        console.log(`Finding primes up to ${limit}`);
        this.updateStatus('Finding primes...');
        
        const startTime = performance.now();
        const primes = [];
        
        // Inefficient prime finding algorithm
        for (let num = 2; num <= limit; num++) {
            let isPrime = true;
            
            // Check divisibility (inefficient method)
            for (let i = 2; i <= Math.sqrt(num); i++) {
                if (num % i === 0) {
                    isPrime = false;
                    break;
                }
            }
            
            if (isPrime) {
                primes.push(num);
            }
            
            // Attempt to update progress - but UI is blocked!
            if (num % 10000 === 0) {
                const progress = (num / limit * 100).toFixed(1);
                this.updateProgress(`${progress}%`);
                // This won't actually update the UI until computation finishes!
            }
        }
        
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        this.updateResult(`Found ${primes.length} primes up to ${limit} (${duration}ms)`);
        this.updateStatus('Prime calculation complete');
        
        // Problems:
        // 1. UI frozen during entire calculation
        // 2. Progress updates don't work
        // 3. User can't cancel operation
        // 4. Browser becomes unresponsive
    }
    
    // Image processing simulation - CPU intensive
    processImage() {
        console.log('Processing large image');
        this.updateStatus('Processing image...');
        
        const startTime = performance.now();
        
        // Simulate large image data
        const width = 2000;
        const height = 2000;
        const imageData = new Uint8ClampedArray(width * height * 4); // RGBA
        
        // Fill with random pixel data
        for (let i = 0; i < imageData.length; i++) {
            imageData[i] = Math.floor(Math.random() * 256);
        }
        
        // Apply expensive image filters
        const processedData = this.applyImageFilters(imageData, width, height);
        
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        this.updateResult(`Processed ${width}x${height} image (${duration}ms)`);
        this.updateStatus('Image processing complete');
        
        // Problems:
        // 1. Massive memory allocation on main thread
        // 2. Heavy computation blocks UI
        // 3. No cancellation possible
        // 4. Memory pressure affects entire application
    }
    
    applyImageFilters(imageData, width, height) {
        // Simulate expensive image processing
        const filtered = new Uint8ClampedArray(imageData.length);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                // Apply edge detection filter (expensive computation)
                let r = 0, g = 0, b = 0;
                
                // 3x3 kernel convolution
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const kidx = ((y + ky) * width + (x + kx)) * 4;
                        r += imageData[kidx];
                        g += imageData[kidx + 1];
                        b += imageData[kidx + 2];
                    }
                }
                
                filtered[idx] = Math.abs(r / 9);
                filtered[idx + 1] = Math.abs(g / 9);
                filtered[idx + 2] = Math.abs(b / 9);
                filtered[idx + 3] = 255;
            }
        }
        
        return filtered;
    }
    
    // Matrix multiplication - mathematical computation
    multiplyMatrices(size) {
        console.log(`Multiplying ${size}x${size} matrices`);
        this.updateStatus('Multiplying matrices...');
        
        const startTime = performance.now();
        
        // Create random matrices
        const matrixA = this.createRandomMatrix(size);
        const matrixB = this.createRandomMatrix(size);
        
        // Perform multiplication (O(n³) complexity)
        const result = this.matrixMultiply(matrixA, matrixB, size);
        
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        this.updateResult(`Multiplied ${size}x${size} matrices (${duration}ms)`);
        this.updateStatus('Matrix multiplication complete');
        
        // Problems:
        // 1. Cubic time complexity blocks UI
        // 2. Large memory allocation
        // 3. No parallelization of independent calculations
        // 4. Cannot utilize multiple CPU cores
    }
    
    createRandomMatrix(size) {
        const matrix = [];
        for (let i = 0; i < size; i++) {
            matrix[i] = [];
            for (let j = 0; j < size; j++) {
                matrix[i][j] = Math.random() * 100;
            }
        }
        return matrix;
    }
    
    matrixMultiply(a, b, size) {
        const result = [];
        
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                let sum = 0;
                for (let k = 0; k < size; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        
        return result;
    }
    
    startAnimation() {
        // Try to start smooth animation
        const spinner = document.getElementById('spinner');
        spinner.style.animationPlayState = 'running';
        
        // Animation will be jerky during heavy computations
        console.log('Animation started - will be choppy during computations');
    }
    
    updateStatus(status) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = status;
        }
        console.log(`Status: ${status}`);
    }
    
    updateProgress(progress) {
        const progressEl = document.getElementById('progress');
        if (progressEl) {
            progressEl.textContent = progress;
        }
        // This update won't be visible until main thread is free!
    }
    
    updateResult(result) {
        const resultEl = document.getElementById('result');
        if (resultEl) {
            resultEl.textContent = result;
        }
        console.log(`Result: ${result}`);
    }
}

// Create the problematic application
const app = new MainThreadBlockingOperations();

// Demonstrate the problems
console.log('\n🚨 Problems with main thread operations:');
console.log('1. Click any computation button');
console.log('2. Try to interact with the page during calculation');
console.log('3. Notice the spinner animation freezes');
console.log('4. Progress updates don\'t appear until completion');
console.log('5. Browser may warn about unresponsive page');

// Additional problems this approach creates:
console.log('\n💔 Real-world impact:');
console.log('- User experience degradation');
console.log('- Browser "page unresponsive" warnings');
console.log('- Cannot cancel long-running operations');
console.log('- Poor utilization of multi-core processors');
console.log('- Memory pressure affects entire application');
console.log('- No progress feedback during computations');
console.log('- Animations become choppy or freeze');
console.log('- Form inputs become unresponsive');
console.log('- SEO penalties for poor responsiveness metrics');
```

## Web Workers Implementation 🎯

### Advanced Web Workers with Intelligent Task Management

**Implementing sophisticated Web Workers system with parallel processing:**

```javascript
// Advanced Web Workers Implementation
class WorkerManager {
    constructor(options = {}) {
        this.options = {
            maxWorkers: options.maxWorkers || navigator.hardwareConcurrency || 4,
            workerTimeout: options.workerTimeout || 30000,
            enableSharedMemory: options.enableSharedMemory || false,
            autoTerminate: options.autoTerminate || true,
            ...options
        };
        
        this.workers = new Map();
        this.workerPool = [];
        this.taskQueue = [];
        this.activeJobs = new Map();
        this.workerStats = new Map();
        
        this.jobCounter = 0;
        this.poolInitialized = false;
        
        console.log(`WorkerManager initialized with ${this.options.maxWorkers} max workers`);
    }
    
    // Initialize worker pool
    async initializeWorkerPool() {
        if (this.poolInitialized) return;
        
        console.log('🏗️ Initializing worker pool...');
        
        for (let i = 0; i < this.options.maxWorkers; i++) {
            try {
                const worker = await this.createWorker(`worker-${i}`);
                this.workerPool.push(worker);
                
                console.log(`✅ Worker ${i} created and ready`);
            } catch (error) {
                console.error(`❌ Failed to create worker ${i}:`, error);
            }
        }
        
        this.poolInitialized = true;
        console.log(`🎯 Worker pool initialized with ${this.workerPool.length} workers`);
        
        // Process any queued tasks
        this.processTaskQueue();
    }
    
    // Create individual worker with error handling
    async createWorker(workerId) {
        return new Promise((resolve, reject) => {
            // Create worker from inline script or external file
            const workerScript = this.createWorkerScript();
            const blob = new Blob([workerScript], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);
            
            const worker = new Worker(workerUrl);
            
            // Setup worker communication
            worker.onmessage = (event) => this.handleWorkerMessage(workerId, event);
            worker.onerror = (error) => this.handleWorkerError(workerId, error);
            
            // Initialize worker with configuration
            worker.postMessage({
                type: 'init',
                workerId: workerId,
                config: {
                    enableSharedMemory: this.options.enableSharedMemory,
                    timeout: this.options.workerTimeout
                }
            });
            
            // Wait for worker to be ready
            const readyTimeout = setTimeout(() => {
                reject(new Error(`Worker ${workerId} initialization timeout`));
            }, 5000);
            
            const handleReady = (event) => {
                if (event.data.type === 'ready') {
                    clearTimeout(readyTimeout);
                    worker.removeEventListener('message', handleReady);
                    
                    // Store worker metadata
                    this.workers.set(workerId, {
                        worker: worker,
                        busy: false,
                        currentJob: null,
                        created: Date.now(),
                        tasksCompleted: 0
                    });
                    
                    this.workerStats.set(workerId, {
                        tasksCompleted: 0,
                        totalExecutionTime: 0,
                        averageExecutionTime: 0,
                        errors: 0
                    });
                    
                    resolve(worker);
                }
            };
            
            worker.addEventListener('message', handleReady);
            
            // Cleanup blob URL after worker creation
            setTimeout(() => URL.revokeObjectURL(workerUrl), 1000);
        });
    }
    
    // Create worker script with comprehensive functionality
    createWorkerScript() {
        return `
            // Worker script with advanced capabilities
            let workerId = null;
            let config = {};
            
            // Import additional libraries if needed
            if (typeof importScripts === 'function') {
                // Example: importScripts('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js');
            }
            
            // Handle messages from main thread
            self.onmessage = function(event) {
                const { type, data, jobId } = event.data;
                
                try {
                    switch (type) {
                        case 'init':
                            workerId = event.data.workerId;
                            config = event.data.config;
                            self.postMessage({ type: 'ready', workerId });
                            break;
                            
                        case 'fibonacci':
                            const result = calculateFibonacci(data.n);
                            self.postMessage({ 
                                type: 'result', 
                                jobId, 
                                result, 
                                workerId 
                            });
                            break;
                            
                        case 'primes':
                            const primes = findPrimes(data.limit, data.start, data.end, jobId);
                            self.postMessage({ 
                                type: 'result', 
                                jobId, 
                                result: primes, 
                                workerId 
                            });
                            break;
                            
                        case 'matrix':
                            const matrixResult = multiplyMatrices(data.matrixA, data.matrixB);
                            self.postMessage({ 
                                type: 'result', 
                                jobId, 
                                result: matrixResult, 
                                workerId 
                            });
                            break;
                            
                        case 'image':
                            const processedImage = processImage(data.imageData, data.width, data.height, data.filter);
                            self.postMessage({ 
                                type: 'result', 
                                jobId, 
                                result: processedImage, 
                                workerId 
                            });
                            break;
                            
                        case 'custom':
                            // Dynamic function execution
                            const customResult = executeCustomFunction(data.functionCode, data.params);
                            self.postMessage({ 
                                type: 'result', 
                                jobId, 
                                result: customResult, 
                                workerId 
                            });
                            break;
                            
                        default:
                            throw new Error('Unknown task type: ' + type);
                    }
                } catch (error) {
                    self.postMessage({ 
                        type: 'error', 
                        jobId, 
                        error: error.message, 
                        workerId 
                    });
                }
            };
            
            // Optimized Fibonacci with memoization
            function calculateFibonacci(n) {
                const memo = {};
                
                function fib(num) {
                    if (num in memo) return memo[num];
                    if (num <= 1) return num;
                    
                    memo[num] = fib(num - 1) + fib(num - 2);
                    return memo[num];
                }
                
                return fib(n);
            }
            
            // Prime finding with progress updates
            function findPrimes(limit, start, end, jobId) {
                const primes = [];
                let lastProgress = 0;
                
                for (let num = start; num <= end; num++) {
                    if (isPrime(num)) {
                        primes.push(num);
                    }
                    
                    // Send progress updates
                    const progress = ((num - start) / (end - start) * 100);
                    if (progress - lastProgress >= 10) {
                        self.postMessage({ 
                            type: 'progress', 
                            jobId, 
                            progress: progress.toFixed(1),
                            workerId 
                        });
                        lastProgress = progress;
                    }
                }
                
                return primes;
            }
            
            function isPrime(num) {
                if (num < 2) return false;
                if (num === 2) return true;
                if (num % 2 === 0) return false;
                
                for (let i = 3; i <= Math.sqrt(num); i += 2) {
                    if (num % i === 0) return false;
                }
                return true;
            }
            
            // Matrix multiplication
            function multiplyMatrices(matrixA, matrixB) {
                const rowsA = matrixA.length;
                const colsA = matrixA[0].length;
                const colsB = matrixB[0].length;
                
                const result = [];
                
                for (let i = 0; i < rowsA; i++) {
                    result[i] = [];
                    for (let j = 0; j < colsB; j++) {
                        let sum = 0;
                        for (let k = 0; k < colsA; k++) {
                            sum += matrixA[i][k] * matrixB[k][j];
                        }
                        result[i][j] = sum;
                    }
                }
                
                return result;
            }
            
            // Image processing
            function processImage(imageData, width, height, filter) {
                const data = new Uint8ClampedArray(imageData);
                const result = new Uint8ClampedArray(data.length);
                
                switch (filter) {
                    case 'grayscale':
                        return applyGrayscale(data);
                    case 'blur':
                        return applyBlur(data, width, height);
                    case 'edge':
                        return applyEdgeDetection(data, width, height);
                    default:
                        return data;
                }
            }
            
            function applyGrayscale(data) {
                const result = new Uint8ClampedArray(data.length);
                
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    result[i] = gray;
                    result[i + 1] = gray;
                    result[i + 2] = gray;
                    result[i + 3] = data[i + 3];
                }
                
                return result;
            }
            
            function applyBlur(data, width, height) {
                const result = new Uint8ClampedArray(data.length);
                
                for (let y = 1; y < height - 1; y++) {
                    for (let x = 1; x < width - 1; x++) {
                        const idx = (y * width + x) * 4;
                        
                        let r = 0, g = 0, b = 0, a = 0;
                        
                        // 3x3 blur kernel
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const pidx = ((y + dy) * width + (x + dx)) * 4;
                                r += data[pidx];
                                g += data[pidx + 1];
                                b += data[pidx + 2];
                                a += data[pidx + 3];
                            }
                        }
                        
                        result[idx] = r / 9;
                        result[idx + 1] = g / 9;
                        result[idx + 2] = b / 9;
                        result[idx + 3] = a / 9;
                    }
                }
                
                return result;
            }
            
            function applyEdgeDetection(data, width, height) {
                const result = new Uint8ClampedArray(data.length);
                
                // Sobel edge detection kernel
                const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
                const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
                
                for (let y = 1; y < height - 1; y++) {
                    for (let x = 1; x < width - 1; x++) {
                        const idx = (y * width + x) * 4;
                        
                        let pixelX = 0, pixelY = 0;
                        
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                const pidx = ((y + dy) * width + (x + dx)) * 4;
                                const gray = data[pidx] * 0.299 + data[pidx + 1] * 0.587 + data[pidx + 2] * 0.114;
                                
                                pixelX += gray * sobelX[dy + 1][dx + 1];
                                pixelY += gray * sobelY[dy + 1][dx + 1];
                            }
                        }
                        
                        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
                        const value = Math.min(255, magnitude);
                        
                        result[idx] = value;
                        result[idx + 1] = value;
                        result[idx + 2] = value;
                        result[idx + 3] = 255;
                    }
                }
                
                return result;
            }
            
            // Execute custom function code
            function executeCustomFunction(functionCode, params) {
                try {
                    const func = new Function('params', functionCode);
                    return func(params);
                } catch (error) {
                    throw new Error('Custom function execution failed: ' + error.message);
                }
            }
        `;
    }
    
    // Execute task using available worker
    async executeTask(taskType, data, options = {}) {
        const {
            priority = 'normal',
            timeout = this.options.workerTimeout,
            onProgress = null
        } = options;
        
        const jobId = ++this.jobCounter;
        
        return new Promise((resolve, reject) => {
            const job = {
                jobId,
                taskType,
                data,
                resolve,
                reject,
                onProgress,
                priority,
                timeout,
                created: Date.now()
            };
            
            // Try to assign to available worker immediately
            const availableWorker = this.getAvailableWorker();
            if (availableWorker) {
                this.assignJobToWorker(job, availableWorker);
            } else {
                // Queue task if no workers available
                console.log(`📥 Queueing task ${jobId} (${taskType}) - no workers available`);
                this.taskQueue.push(job);
                
                // Sort queue by priority
                this.taskQueue.sort((a, b) => {
                    const priorityOrder = { high: 3, normal: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                });
            }
        });
    }
    
    // Get available worker from pool
    getAvailableWorker() {
        for (const [workerId, workerInfo] of this.workers) {
            if (!workerInfo.busy) {
                return { workerId, workerInfo };
            }
        }
        return null;
    }
    
    // Assign job to specific worker
    assignJobToWorker(job, { workerId, workerInfo }) {
        workerInfo.busy = true;
        workerInfo.currentJob = job.jobId;
        
        this.activeJobs.set(job.jobId, {
            ...job,
            workerId,
            started: Date.now()
        });
        
        console.log(`🔄 Assigned job ${job.jobId} (${job.taskType}) to worker ${workerId}`);
        
        // Send task to worker
        workerInfo.worker.postMessage({
            type: job.taskType,
            data: job.data,
            jobId: job.jobId
        });
        
        // Setup timeout
        if (job.timeout > 0) {
            setTimeout(() => {
                if (this.activeJobs.has(job.jobId)) {
                    console.log(`⏰ Job ${job.jobId} timed out`);
                    this.handleJobTimeout(job.jobId);
                }
            }, job.timeout);
        }
    }
    
    // Handle worker messages
    handleWorkerMessage(workerId, event) {
        const { type, jobId, result, error, progress } = event.data;
        
        switch (type) {
            case 'result':
                this.handleJobCompletion(jobId, result, workerId);
                break;
                
            case 'error':
                this.handleJobError(jobId, error, workerId);
                break;
                
            case 'progress':
                this.handleJobProgress(jobId, progress);
                break;
                
            default:
                console.warn(`Unknown message type from worker ${workerId}:`, type);
        }
    }
    
    // Handle successful job completion
    handleJobCompletion(jobId, result, workerId) {
        const job = this.activeJobs.get(jobId);
        if (!job) return;
        
        const workerInfo = this.workers.get(workerId);
        const stats = this.workerStats.get(workerId);
        
        // Update statistics
        const executionTime = Date.now() - job.started;
        stats.tasksCompleted++;
        stats.totalExecutionTime += executionTime;
        stats.averageExecutionTime = stats.totalExecutionTime / stats.tasksCompleted;
        
        workerInfo.busy = false;
        workerInfo.currentJob = null;
        workerInfo.tasksCompleted++;
        
        // Clean up and resolve
        this.activeJobs.delete(jobId);
        job.resolve(result);
        
        console.log(`✅ Job ${jobId} completed by worker ${workerId} (${executionTime}ms)`);
        
        // Process next queued task
        this.processTaskQueue();
    }
    
    // Handle job errors
    handleJobError(jobId, errorMessage, workerId) {
        const job = this.activeJobs.get(jobId);
        if (!job) return;
        
        const workerInfo = this.workers.get(workerId);
        const stats = this.workerStats.get(workerId);
        
        stats.errors++;
        workerInfo.busy = false;
        workerInfo.currentJob = null;
        
        this.activeJobs.delete(jobId);
        job.reject(new Error(errorMessage));
        
        console.error(`❌ Job ${jobId} failed on worker ${workerId}: ${errorMessage}`);
        
        // Process next queued task
        this.processTaskQueue();
    }
    
    // Handle job progress updates
    handleJobProgress(jobId, progress) {
        const job = this.activeJobs.get(jobId);
        if (job && job.onProgress) {
            job.onProgress(progress);
        }
    }
    
    // Handle job timeout
    handleJobTimeout(jobId) {
        const job = this.activeJobs.get(jobId);
        if (!job) return;
        
        console.log(`⏰ Terminating job ${jobId} due to timeout`);
        
        // Terminate and restart worker
        const workerInfo = this.workers.get(job.workerId);
        if (workerInfo) {
            workerInfo.worker.terminate();
            this.recreateWorker(job.workerId);
        }
        
        this.activeJobs.delete(jobId);
        job.reject(new Error('Job timed out'));
        
        // Process next queued task
        this.processTaskQueue();
    }
    
    // Recreate terminated worker
    async recreateWorker(workerId) {
        try {
            console.log(`🔄 Recreating worker ${workerId}`);
            
            const newWorker = await this.createWorker(workerId);
            
            // Update worker pool
            const poolIndex = this.workerPool.findIndex(w => w === this.workers.get(workerId).worker);
            if (poolIndex !== -1) {
                this.workerPool[poolIndex] = newWorker;
            }
            
            console.log(`✅ Worker ${workerId} recreated successfully`);
            
        } catch (error) {
            console.error(`❌ Failed to recreate worker ${workerId}:`, error);
        }
    }
    
    // Process queued tasks
    processTaskQueue() {
        while (this.taskQueue.length > 0) {
            const availableWorker = this.getAvailableWorker();
            if (!availableWorker) break;
            
            const job = this.taskQueue.shift();
            this.assignJobToWorker(job, availableWorker);
        }
    }
    
    // Parallel task execution
    async executeParallel(tasks) {
        console.log(`🔀 Executing ${tasks.length} tasks in parallel`);
        
        const promises = tasks.map(task => 
            this.executeTask(task.type, task.data, task.options)
        );
        
        const results = await Promise.allSettled(promises);
        
        return results.map((result, index) => ({
            taskIndex: index,
            status: result.status,
            value: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason.message : null
        }));
    }
    
    // Get comprehensive statistics
    getStats() {
        const overallStats = {
            totalWorkers: this.workers.size,
            busyWorkers: Array.from(this.workers.values()).filter(w => w.busy).length,
            queuedTasks: this.taskQueue.length,
            activeTasks: this.activeJobs.size,
            totalTasksCompleted: 0,
            totalExecutionTime: 0,
            averageExecutionTime: 0,
            workerDetails: {}
        };
        
        for (const [workerId, stats] of this.workerStats) {
            overallStats.totalTasksCompleted += stats.tasksCompleted;
            overallStats.totalExecutionTime += stats.totalExecutionTime;
            overallStats.workerDetails[workerId] = { ...stats };
        }
        
        overallStats.averageExecutionTime = 
            overallStats.totalTasksCompleted > 0 
                ? overallStats.totalExecutionTime / overallStats.totalTasksCompleted 
                : 0;
        
        return overallStats;
    }
    
    // Terminate all workers
    async terminate() {
        console.log('🛑 Terminating all workers');
        
        // Cancel pending jobs
        for (const [jobId, job] of this.activeJobs) {
            job.reject(new Error('Worker manager terminated'));
        }
        
        // Reject queued tasks
        for (const job of this.taskQueue) {
            job.reject(new Error('Worker manager terminated'));
        }
        
        // Terminate workers
        for (const [workerId, workerInfo] of this.workers) {
            workerInfo.worker.terminate();
        }
        
        // Clear all data
        this.workers.clear();
        this.workerPool = [];
        this.taskQueue = [];
        this.activeJobs.clear();
        this.poolInitialized = false;
        
        console.log('✅ All workers terminated');
    }
}

// Usage demonstration
console.log('=== Web Workers Demo ===');

async function demonstrateWebWorkers() {
    const workerManager = new WorkerManager({
        maxWorkers: 4,
        workerTimeout: 30000,
        autoTerminate: true
    });
    
    // Initialize worker pool
    await workerManager.initializeWorkerPool();
    
    console.log('\n🧮 Testing Fibonacci calculation...');
    try {
        const fibResult = await workerManager.executeTask('fibonacci', { n: 40 });
        console.log(`Fibonacci(40) = ${fibResult}`);
    } catch (error) {
        console.error('Fibonacci calculation failed:', error.message);
    }
    
    console.log('\n🔍 Testing parallel prime finding...');
    const primeRanges = [
        { type: 'primes', data: { limit: 100000, start: 1, end: 25000 } },
        { type: 'primes', data: { limit: 100000, start: 25001, end: 50000 } },
        { type: 'primes', data: { limit: 100000, start: 50001, end: 75000 } },
        { type: 'primes', data: { limit: 100000, start: 75001, end: 100000 } }
    ];
    
    try {
        const startTime = performance.now();
        const primeResults = await workerManager.executeParallel(primeRanges);
        const endTime = performance.now();
        
        const totalPrimes = primeResults.reduce((sum, result) => {
            return sum + (result.value ? result.value.length : 0);
        }, 0);
        
        console.log(`Found ${totalPrimes} primes in parallel (${(endTime - startTime).toFixed(2)}ms)`);
    } catch (error) {
        console.error('Parallel prime finding failed:', error.message);
    }
    
    console.log('\n📊 Worker Statistics:');
    console.table(workerManager.getStats());
    
    // Cleanup
    setTimeout(() => {
        workerManager.terminate();
    }, 2000);
}

// Run demonstration
demonstrateWebWorkers();
```

## Summary

### Core Concepts
- **Web Workers**: Independent JavaScript execution contexts for parallel processing
- **Message Passing**: Communication between main thread and workers through serialized messages
- **Shared Memory**: Efficient data sharing using SharedArrayBuffer for large datasets
- **Transferable Objects**: Zero-copy transfer of binary data between threads

### Theoretical Foundation
- **Concurrency vs Parallelism**: Understanding task scheduling vs simultaneous execution
- **Threading Models**: Single-threaded event loop vs multi-threaded worker execution
- **Memory Models**: Isolated memory vs shared memory with synchronization
- **Task Distribution**: Load balancing and work partitioning strategies

### Worker Types
- **Dedicated Workers**: One-to-one relationship with main thread
- **Shared Workers**: Shared across multiple browser contexts
- **Service Workers**: Background processing independent of web pages
- **Worklets**: Specialized workers for specific browser subsystems

### Implementation Patterns
- **Worker Pools**: Managing multiple workers for load distribution
- **Task Queues**: Prioritized job scheduling and management
- **Error Handling**: Graceful failure recovery and worker restart
- **Performance Monitoring**: Statistics tracking and optimization

### Use Cases
- **CPU-Intensive Computations**: Mathematical calculations, data processing
- **Image/Video Processing**: Filters, transformations, compression
- **Data Analysis**: Large dataset processing, machine learning
- **Background Tasks**: File processing, data synchronization

### Performance Benefits
- **UI Responsiveness**: Main thread remains free for user interactions
- **Parallel Processing**: Utilize multiple CPU cores effectively
- **Scalability**: Handle larger datasets and more complex computations
- **Better Resource Utilization**: Distribute workload across available hardware

### My Personal Insight
Web Workers completely changed how I approach performance optimization. **The biggest insight was understanding that JavaScript's "single-threaded" limitation is actually just about the main thread.** You can have true parallelism for computations while keeping the UI thread responsive.

**Key realization: Not all code needs to run on the main thread.** Heavy computations, data processing, and complex algorithms can be moved to workers, dramatically improving user experience. The challenge is designing proper communication patterns and data flow.

**Worker pools and task management became essential** for real-world applications. Simple one-off workers are fine for demos, but production apps need sophisticated worker management, error recovery, and load balancing.

### Next Up
Congratulations! You've completed **Module 10: Performance & Optimization**! 🎉

You've now mastered the fundamental techniques for building high-performance JavaScript applications: memory management, profiling, rate limiting, code splitting, and parallel processing.

Remember: Performance optimization is about understanding bottlenecks, measuring improvements, and using the right technique for each specific problem! 🚀✨
