---
title: Singleton Pattern & Proxy Pattern
description: Master advanced design patterns for controlling object
  instantiation and access. Learn to implement global state management, lazy
  initialization, access control, and sophisticated object interaction
  mechanisms.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: Singleton Pattern - GoF Design Patterns
    type: reference
    url: https://en.wikipedia.org/wiki/Singleton_pattern
    description: Classical Singleton pattern definition and implementation
  - title: Proxy Pattern - GoF Design Patterns
    type: reference
    url: https://en.wikipedia.org/wiki/Proxy_pattern
    description: Proxy pattern for controlling access to objects
  - title: JavaScript Proxy Object
    type: reference
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    description: Native JavaScript Proxy API documentation
  - title: ES6 Proxy Deep Dive
    type: article
    url: https://ponyfoo.com/articles/es6-proxy-introduction
    description: Comprehensive guide to JavaScript Proxy features
published: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811608/Portfolio/javaScriptCourse/images/all%20title%20images/41_tpbsvz.png)

Singleton Pattern & Proxy Pattern – Controlled Object Access & Meta-Programming
===============================================================================

Imagine you're designing the **control system for a smart building** 🏢 that needs sophisticated access control and resource management:

- **Single Point of Control** 🎯 - There's exactly one building management system that coordinates everything: HVAC, security, elevators, lighting
- **Global Access** 🌐 - Every system in the building needs access to this central controller, but there can only be one instance
- **Lazy Initialization** ⏱️ - The expensive building management system only starts up when first needed
- **Access Proxy** 🛡️ - Security layer that controls who can access what: visitors get limited access, maintenance gets specific permissions, administrators get full access
- **Transparent Intermediary** 👻 - Users interact with the building systems as if directly, but the proxy invisibly manages permissions, logging, and optimization
- **Smart Caching** 🧠 - Frequently requested information (like temperature) is cached and served instantly without hitting the actual sensors
- **Automatic Logging** 📊 - Every interaction is logged for security and optimization without users knowing

**Singleton and Proxy patterns work exactly like this smart building system.** They provide powerful mechanisms for controlling object creation and access:

- **Singleton Pattern** - Ensures a class has only one instance and provides global access to it
- **Proxy Pattern** - Provides a placeholder or surrogate that controls access to another object
- **Meta-Programming** - Both patterns enable programming that manipulates programs themselves
- **Access Control** - Fine-grained control over how objects are created, accessed, and modified
- **Transparent Enhancement** - Add functionality without changing the original object's interface
- **Performance Optimization** - Lazy loading, caching, and resource management

Understanding these patterns is essential for building sophisticated applications that need global state management, access control, performance optimization, and advanced meta-programming capabilities.

## The Theoretical Foundation: Object Lifecycle Control and Meta-Programming 📐

### Understanding Creational vs Structural Patterns

**Design patterns fall into different categories based on their primary purpose:**

1. **Creational Patterns** (like Singleton): Control object creation and instantiation
2. **Structural Patterns** (like Proxy): Deal with object composition and relationships
3. **Behavioral Patterns**: Focus on communication between objects and responsibility assignment

**Why This Categorization Matters:**
- **Singleton** solves creation problems (ensuring single instance)
- **Proxy** solves access problems (controlling how objects are used)
- **Together**: They provide comprehensive control over object lifecycle

### Singleton Pattern Theory: Controlled Instantiation

**The Singleton Pattern ensures a class has only one instance while providing global access to that instance.** It's one of the most controversial patterns because of potential misuse.

**Core Singleton Concepts:**

1. **Single Instance**: Only one object of the class can exist
2. **Global Access**: Instance is accessible from anywhere in the application
3. **Lazy Initialization**: Instance created only when first needed
4. **Instance Control**: Class itself controls instantiation process

**When Singleton Is Appropriate:**
- **System-wide Resources**: Database connections, file managers, loggers
- **Configuration Objects**: Application settings that need consistency
- **Hardware Interfaces**: Printer drivers, device controllers
- **Caches**: Global cache that needs coordinated access

**When to Avoid Singleton:**
- **Testing**: Makes unit testing difficult due to global state
- **Coupling**: Creates implicit dependencies throughout codebase
- **Concurrency**: Can create bottlenecks in multi-threaded environments
- **Flexibility**: Hard to extend or replace with different implementations

### Proxy Pattern Theory: Access Control and Delegation

**The Proxy Pattern provides a surrogate or placeholder for another object to control access to it.** It acts as an intermediary that can add functionality without changing the original object.

**Types of Proxies:**

1. **Virtual Proxy**: Controls access to expensive-to-create objects (lazy loading)
2. **Protection Proxy**: Controls access based on permissions
3. **Remote Proxy**: Represents objects in different address spaces
4. **Smart Proxy**: Adds additional behavior (logging, caching, reference counting)

**Proxy Pattern Benefits:**
- **Transparent Access**: Client code doesn't know it's using a proxy
- **Lazy Loading**: Expensive operations deferred until needed
- **Access Control**: Fine-grained permission management
- **Enhancement**: Add functionality without modifying original object
- **Caching**: Store results to improve performance

### JavaScript's Native Proxy API

**JavaScript provides a native Proxy object that enables meta-programming:**

```javascript
const proxy = new Proxy(target, handler);
```

**Key Proxy Traps (Handler Methods):**
- `get(target, property, receiver)`: Intercept property access
- `set(target, property, value, receiver)`: Intercept property assignment
- `has(target, property)`: Intercept `in` operator
- `deleteProperty(target, property)`: Intercept `delete` operator
- `construct(target, argumentsList, newTarget)`: Intercept `new` operator
- `apply(target, thisArg, argumentsList)`: Intercept function calls

**Why Native Proxies Are Powerful:**
- **No Interface Restrictions**: Can proxy any object type
- **Complete Interception**: Can intercept virtually any operation
- **Meta-Programming**: Can modify program behavior at runtime
- **Framework Building**: Foundation for reactive systems and ORMs

### The Computer Science Behind These Patterns

**These patterns embody fundamental computer science concepts:**

1. **Singleton**: Implements the mathematical concept of a singleton set (set with exactly one element)
2. **Proxy**: Implements delegation and forwarding patterns from distributed systems
3. **Meta-Programming**: Programs that manipulate programs, enabling higher-order abstractions
4. **Aspect-Oriented Programming**: Cross-cutting concerns (logging, security) separated from business logic

## The Problem: Uncontrolled Object Creation and Access 😤

### Multiple Instance Problems

**Without Singleton pattern, critical resources can be duplicated inappropriately:**

```javascript
// Multiple database connections - resource waste and inconsistency
class DatabaseConnection {
    constructor(config) {
        this.config = config;
        this.connection = null;
        this.isConnected = false;
        
        // Expensive connection setup
        console.log('Creating new database connection...');
        this.connect();
    }
    
    connect() {
        // Simulate expensive connection process
        console.log('Connecting to database...');
        this.connection = { 
            id: Math.random().toString(36).substr(2, 9),
            connectedAt: new Date()
        };
        this.isConnected = true;
        console.log(`Connected with ID: ${this.connection.id}`);
    }
    
    query(sql) {
        if (!this.isConnected) {
            throw new Error('Not connected to database');
        }
        console.log(`Executing: ${sql} on connection ${this.connection.id}`);
        return { result: `Results for: ${sql}` };
    }
    
    disconnect() {
        if (this.isConnected) {
            console.log(`Disconnecting connection ${this.connection.id}`);
            this.isConnected = false;
            this.connection = null;
        }
    }
}

// Problems without Singleton:
// 1. Multiple connections created wastefully
const db1 = new DatabaseConnection({ host: 'localhost', port: 5432 });
const db2 = new DatabaseConnection({ host: 'localhost', port: 5432 }); // Another connection!
const db3 = new DatabaseConnection({ host: 'localhost', port: 5432 }); // Yet another!

// 2. Inconsistent state across instances
db1.query('SELECT * FROM users');
db2.query('SELECT * FROM products'); // Different connection, potential consistency issues

// 3. Resource exhaustion
// Each connection consumes memory, file descriptors, network sockets
// Database server may limit concurrent connections

// 4. Coordination problems
// If we need to close all connections, we need to track every instance
// No centralized way to manage database state
```

### Direct Object Access Problems

```javascript
// Expensive object that should be created lazily and cached
class ImageProcessor {
    constructor() {
        console.log('Loading expensive image processing libraries...');
        
        // Simulate loading heavy dependencies
        this.filters = this.loadImageFilters();
        this.codecs = this.loadImageCodecs();
        this.gpuAcceleration = this.initializeGPU();
        
        console.log('Image processor fully loaded');
    }
    
    loadImageFilters() {
        // Simulate expensive filter loading
        console.log('Loading image filters (5MB library)...');
        return ['blur', 'sharpen', 'edge-detect', 'noise-reduction'];
    }
    
    loadImageCodecs() {
        // Simulate expensive codec loading
        console.log('Loading image codecs (10MB library)...');
        return ['jpeg', 'png', 'webp', 'tiff', 'raw'];
    }
    
    initializeGPU() {
        // Simulate GPU initialization
        console.log('Initializing GPU acceleration...');
        return { accelerated: true, cores: 1024 };
    }
    
    processImage(imagePath, operations) {
        console.log(`Processing ${imagePath} with operations: ${operations.join(', ')}`);
        return { 
            outputPath: `processed_${imagePath}`,
            operations: operations,
            processedAt: new Date()
        };
    }
}

// Problems with direct access:
// 1. Always loads expensive resources even if not needed
const processor1 = new ImageProcessor(); // Heavy loading happens immediately
const processor2 = new ImageProcessor(); // Loads again! Wasteful duplication

// 2. No access control
// Anyone can create instances, no permission checking

// 3. No caching or optimization
// Same image might be processed multiple times

// 4. No logging or monitoring
// Can't track usage patterns or performance

// 5. Tight coupling
// Client code directly depends on implementation details
```

### Uncontrolled Access and Missing Cross-Cutting Concerns

```javascript
// Sensitive data object that needs protection
class UserAccountManager {
    constructor() {
        this.users = new Map();
        this.sensitiveData = new Map();
    }
    
    createUser(userId, userData) {
        this.users.set(userId, {
            ...userData,
            createdAt: new Date(),
            lastModified: new Date()
        });
        
        // Store sensitive data separately
        this.sensitiveData.set(userId, {
            ssn: userData.ssn,
            creditCard: userData.creditCard,
            password: userData.password
        });
        
        return userId;
    }
    
    getUser(userId) {
        return this.users.get(userId);
    }
    
    getSensitiveData(userId) {
        // No access control! Anyone can access sensitive data
        return this.sensitiveData.get(userId);
    }
    
    updateUser(userId, updates) {
        const user = this.users.get(userId);
        if (user) {
            Object.assign(user, updates, { lastModified: new Date() });
        }
        return user;
    }
    
    deleteUser(userId) {
        this.users.delete(userId);
        this.sensitiveData.delete(userId);
    }
}

// Problems without Proxy protection:
const accountManager = new UserAccountManager();

// 1. No access control
accountManager.createUser('user1', { 
    name: 'John Doe', 
    ssn: '123-45-6789',
    creditCard: '4532-1234-5678-9012' 
});

// Anyone can access sensitive data directly!
const sensitiveData = accountManager.getSensitiveData('user1'); // Security breach!

// 2. No logging or auditing
// Can't track who accessed what data and when

// 3. No validation
accountManager.updateUser('user1', { age: -50 }); // Invalid age allowed

// 4. No caching
// Expensive operations repeated unnecessarily

// 5. No method interception
// Can't add middleware-like functionality

// 6. Direct property access
console.log(accountManager.users); // Can access internal data structures directly
accountManager.sensitiveData.clear(); // Can modify internal state directly!
```

## Singleton Pattern Implementation 🎯

### Basic Singleton Pattern

**The Singleton Pattern ensures only one instance exists and provides global access to it.**

```javascript
// Classic Singleton implementation
class DatabaseManager {
    constructor() {
        // Prevent multiple instantiation
        if (DatabaseManager.instance) {
            return DatabaseManager.instance;
        }
        
        // Initialize instance
        this.connections = new Map();
        this.config = null;
        this.isInitialized = false;
        
        // Store instance reference
        DatabaseManager.instance = this;
        
        console.log('DatabaseManager singleton created');
        return this;
    }
    
    // Alternative getInstance method (more explicit)
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    
    initialize(config) {
        if (this.isInitialized) {
            console.log('DatabaseManager already initialized');
            return this;
        }
        
        this.config = config;
        this.isInitialized = true;
        
        console.log('DatabaseManager initialized with config:', config);
        return this;
    }
    
    createConnection(name, connectionConfig) {
        if (!this.isInitialized) {
            throw new Error('DatabaseManager must be initialized first');
        }
        
        if (this.connections.has(name)) {
            console.log(`Connection '${name}' already exists`);
            return this.connections.get(name);
        }
        
        const connection = {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            config: connectionConfig,
            createdAt: new Date(),
            isActive: true,
            queryCount: 0
        };
        
        this.connections.set(name, connection);
        console.log(`Created connection '${name}' with ID: ${connection.id}`);
        
        return connection;
    }
    
    getConnection(name) {
        return this.connections.get(name);
    }
    
    getAllConnections() {
        return Array.from(this.connections.values());
    }
    
    closeConnection(name) {
        const connection = this.connections.get(name);
        if (connection) {
            connection.isActive = false;
            console.log(`Closed connection '${name}'`);
            return true;
        }
        return false;
    }
    
    closeAllConnections() {
        for (const [name, connection] of this.connections) {
            connection.isActive = false;
        }
        console.log(`Closed all ${this.connections.size} connections`);
    }
    
    getStats() {
        return {
            totalConnections: this.connections.size,
            activeConnections: Array.from(this.connections.values()).filter(c => c.isActive).length,
            config: this.config,
            isInitialized: this.isInitialized
        };
    }
}

// Usage demonstration
console.log('=== Basic Singleton Demo ===');

// Multiple instantiation attempts return same instance
const db1 = new DatabaseManager();
const db2 = new DatabaseManager();
const db3 = DatabaseManager.getInstance();

console.log('db1 === db2:', db1 === db2); // true
console.log('db2 === db3:', db2 === db3); // true
console.log('Same instance:', db1 === db2 && db2 === db3); // true

// Initialize once, use everywhere
db1.initialize({
    host: 'localhost',
    port: 5432,
    maxConnections: 10
});

// Create connections through singleton
db1.createConnection('main', { database: 'app_db' });
db2.createConnection('analytics', { database: 'analytics_db' });

// Access from any reference
console.log('Connections from db1:', db1.getAllConnections().length);
console.log('Connections from db2:', db2.getAllConnections().length); // Same count
console.log('Stats:', db3.getStats());
```

### Advanced Singleton with Lazy Initialization

```javascript
// Lazy Singleton with advanced features
class ConfigurationManager {
    // Private static instance (using WeakMap for true privacy)
    static #instance = null;
    static #initialized = false;
    
    constructor() {
        // Prevent direct instantiation
        if (ConfigurationManager.#instance) {
            return ConfigurationManager.#instance;
        }
        
        // Private constructor pattern
        if (!ConfigurationManager.#initialized) {
            throw new Error('Use ConfigurationManager.getInstance() to create instance');
        }
        
        this.config = new Map();
        this.watchers = new Map();
        this.loadTimestamp = null;
        
        ConfigurationManager.#instance = this;
    }
    
    static getInstance() {
        if (!ConfigurationManager.#instance) {
            // Set flag to allow construction
            ConfigurationManager.#initialized = true;
            ConfigurationManager.#instance = new ConfigurationManager();
            ConfigurationManager.#initialized = false; // Reset flag
        }
        return ConfigurationManager.#instance;
    }
    
    // Lazy loading of configuration
    async loadConfiguration(source = 'default') {
        if (this.loadTimestamp && this.config.size > 0) {
            console.log('Configuration already loaded');
            return this.config;
        }
        
        console.log(`Loading configuration from ${source}...`);
        
        // Simulate async configuration loading
        await this.delay(1000);
        
        const defaultConfig = {
            app: {
                name: 'MyApp',
                version: '1.0.0',
                debug: false
            },
            database: {
                host: 'localhost',
                port: 5432,
                poolSize: 10
            },
            api: {
                baseUrl: 'https://api.example.com',
                timeout: 30000,
                retries: 3
            },
            features: {
                enableAnalytics: true,
                enableCaching: true,
                enableLogging: true
            }
        };
        
        // Load configuration
        for (const [section, values] of Object.entries(defaultConfig)) {
            this.config.set(section, values);
        }
        
        this.loadTimestamp = new Date();
        console.log('Configuration loaded successfully');
        
        // Notify watchers
        this.notifyWatchers('configLoaded', this.config);
        
        return this.config;
    }
    
    get(path) {
        const parts = path.split('.');
        let current = null;
        
        if (parts.length === 1) {
            current = this.config.get(parts[0]);
        } else if (parts.length === 2) {
            const section = this.config.get(parts[0]);
            current = section ? section[parts[1]] : undefined;
        } else {
            // Handle deeper nesting
            current = this.config.get(parts[0]);
            for (let i = 1; i < parts.length && current; i++) {
                current = current[parts[i]];
            }
        }
        
        return current;
    }
    
    set(path, value) {
        const parts = path.split('.');
        
        if (parts.length === 1) {
            this.config.set(parts[0], value);
        } else if (parts.length === 2) {
            let section = this.config.get(parts[0]);
            if (!section) {
                section = {};
                this.config.set(parts[0], section);
            }
            section[parts[1]] = value;
        } else {
            // Handle deeper nesting
            let current = this.config.get(parts[0]);
            if (!current) {
                current = {};
                this.config.set(parts[0], current);
            }
            
            for (let i = 1; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            
            current[parts[parts.length - 1]] = value;
        }
        
        // Notify watchers of change
        this.notifyWatchers('configChanged', { path, value });
    }
    
    // Watch for configuration changes
    watch(path, callback) {
        if (!this.watchers.has(path)) {
            this.watchers.set(path, new Set());
        }
        this.watchers.get(path).add(callback);
        
        return () => {
            // Return unsubscribe function
            const pathWatchers = this.watchers.get(path);
            if (pathWatchers) {
                pathWatchers.delete(callback);
                if (pathWatchers.size === 0) {
                    this.watchers.delete(path);
                }
            }
        };
    }
    
    notifyWatchers(event, data) {
        if (event === 'configChanged') {
            const { path } = data;
            const pathWatchers = this.watchers.get(path);
            if (pathWatchers) {
                pathWatchers.forEach(callback => callback(data));
            }
            
            // Also notify wildcard watchers
            const wildcardWatchers = this.watchers.get('*');
            if (wildcardWatchers) {
                wildcardWatchers.forEach(callback => callback(data));
            }
        } else {
            // Notify all watchers for other events
            for (const watchers of this.watchers.values()) {
                watchers.forEach(callback => callback({ event, data }));
            }
        }
    }
    
    // Reload configuration
    async reload() {
        this.config.clear();
        this.loadTimestamp = null;
        await this.loadConfiguration();
    }
    
    // Export configuration
    export() {
        const exported = {};
        for (const [key, value] of this.config) {
            exported[key] = value;
        }
        return exported;
    }
    
    getStats() {
        return {
            sectionsLoaded: this.config.size,
            loadTimestamp: this.loadTimestamp,
            watchersCount: this.watchers.size,
            totalWatchers: Array.from(this.watchers.values()).reduce((sum, set) => sum + set.size, 0)
        };
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage demonstration
console.log('\n=== Advanced Singleton Demo ===');

async function demoAdvancedSingleton() {
    // Get singleton instance (lazy creation)
    const config = ConfigurationManager.getInstance();
    
    // Watch for configuration changes
    const unsubscribe = config.watch('database.host', (data) => {
        console.log(`Database host changed to: ${data.value}`);
    });
    
    // Load configuration (lazy loading)
    await config.loadConfiguration();
    
    // Access configuration
    console.log('App name:', config.get('app.name'));
    console.log('Database host:', config.get('database.host'));
    console.log('API timeout:', config.get('api.timeout'));
    
    // Update configuration (triggers watchers)
    config.set('database.host', 'production-db.example.com');
    
    // Multiple instances return same object
    const config2 = ConfigurationManager.getInstance();
    console.log('Same instance:', config === config2); // true
    console.log('Host from config2:', config2.get('database.host')); // Updated value
    
    // Configuration stats
    console.log('Config stats:', config.getStats());
    
    // Export configuration
    console.log('Full config:', config.export());
    
    // Clean up
    unsubscribe();
}

await demoAdvancedSingleton();
```

## Proxy Pattern Implementation 🛡️

### Virtual Proxy: Lazy Loading

**Virtual Proxy defers expensive object creation until actually needed.**

```javascript
// Virtual Proxy for expensive image processing
class ImageProcessor {
    constructor() {
        console.log('ImageProcessor: Loading expensive libraries...');
        
        // Simulate loading heavy dependencies (synchronous for demo)
        this.loadLibraries();
        
        console.log('ImageProcessor: Fully loaded and ready');
    }
    
    loadLibraries() {
        // Simulate expensive library loading
        const start = Date.now();
        
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
            sum += Math.random();
        }
        
        this.filters = ['blur', 'sharpen', 'edge-detect', 'noise-reduction'];
        this.codecs = ['jpeg', 'png', 'webp', 'tiff'];
        this.loadTime = Date.now() - start;
        
        console.log(`Libraries loaded in ${this.loadTime}ms`);
    }
    
    processImage(imagePath, operations) {
        console.log(`Processing ${imagePath} with operations: ${operations.join(', ')}`);
        
        // Simulate processing time
        const processingTime = Math.random() * 1000 + 500;
        
        return {
            inputPath: imagePath,
            outputPath: `processed_${imagePath}`,
            operations: operations,
            processingTime: processingTime,
            processedAt: new Date(),
            filters: this.filters,
            codecs: this.codecs
        };
    }
    
    getAvailableFilters() {
        return [...this.filters];
    }
    
    getAvailableCodecs() {
        return [...this.codecs];
    }
    
    getStats() {
        return {
            loadTime: this.loadTime,
            filtersCount: this.filters.length,
            codecsCount: this.codecs.length,
            loadedAt: new Date(Date.now() - this.loadTime)
        };
    }
}

// Virtual Proxy implementation
class ImageProcessorProxy {
    constructor() {
        this._realProcessor = null; // Lazy initialization
        this._isLoading = false;
        console.log('ImageProcessorProxy: Created (real processor not loaded yet)');
    }
    
    // Ensure real processor is loaded
    _ensureLoaded() {
        if (!this._realProcessor && !this._isLoading) {
            console.log('ImageProcessorProxy: Loading real processor...');
            this._isLoading = true;
            this._realProcessor = new ImageProcessor();
            this._isLoading = false;
        } else if (this._isLoading) {
            console.log('ImageProcessorProxy: Processor is currently loading...');
        }
        return this._realProcessor;
    }
    
    processImage(imagePath, operations) {
        console.log('ImageProcessorProxy: Process image requested');
        const processor = this._ensureLoaded();
        return processor.processImage(imagePath, operations);
    }
    
    getAvailableFilters() {
        console.log('ImageProcessorProxy: Get filters requested');
        const processor = this._ensureLoaded();
        return processor.getAvailableFilters();
    }
    
    getAvailableCodecs() {
        console.log('ImageProcessorProxy: Get codecs requested');
        const processor = this._ensureLoaded();
        return processor.getAvailableCodecs();
    }
    
    getStats() {
        if (!this._realProcessor) {
            return {
                status: 'Not loaded yet',
                loadTime: null,
                filtersCount: null,
                codecsCount: null
            };
        }
        return this._realProcessor.getStats();
    }
    
    isLoaded() {
        return this._realProcessor !== null;
    }
}

// Usage demonstration
console.log('\n=== Virtual Proxy Demo ===');

// Create proxy (fast - no expensive loading yet)
const imageProxy = new ImageProcessorProxy();
console.log('Proxy created, loaded:', imageProxy.isLoaded());

// Check stats before loading
console.log('Stats before loading:', imageProxy.getStats());

// First operation triggers loading
console.log('\n--- First operation triggers loading ---');
const result1 = imageProxy.processImage('photo1.jpg', ['blur', 'sharpen']);
console.log('Result 1:', result1);
console.log('Now loaded:', imageProxy.isLoaded());

// Subsequent operations use cached processor
console.log('\n--- Subsequent operations use cached processor ---');
const filters = imageProxy.getAvailableFilters();
console.log('Available filters:', filters);

const result2 = imageProxy.processImage('photo2.jpg', ['edge-detect']);
console.log('Result 2:', result2);

console.log('Final stats:', imageProxy.getStats());
```

### Protection Proxy: Access Control

**Protection Proxy controls access to an object based on permissions.**

```javascript
// Sensitive resource that needs protection
class UserDataManager {
    constructor() {
        this.users = new Map();
        this.sensitiveData = new Map();
        this.auditLog = [];
    }
    
    createUser(userId, userData) {
        const user = {
            id: userId,
            ...userData,
            createdAt: new Date(),
            lastModified: new Date()
        };
        
        this.users.set(userId, user);
        
        // Store sensitive data separately
        if (userData.ssn || userData.creditCard) {
            this.sensitiveData.set(userId, {
                ssn: userData.ssn,
                creditCard: userData.creditCard,
                storedAt: new Date()
            });
        }
        
        this.logAction('CREATE_USER', userId, 'User created');
        return user;
    }
    
    getUser(userId) {
        this.logAction('GET_USER', userId, 'User data accessed');
        return this.users.get(userId);
    }
    
    getUserSensitiveData(userId) {
        this.logAction('GET_SENSITIVE', userId, 'Sensitive data accessed');
        return this.sensitiveData.get(userId);
    }
    
    updateUser(userId, updates) {
        const user = this.users.get(userId);
        if (user) {
            Object.assign(user, updates, { lastModified: new Date() });
            this.logAction('UPDATE_USER', userId, `User updated: ${Object.keys(updates).join(', ')}`);
        }
        return user;
    }
    
    deleteUser(userId) {
        const deleted = this.users.delete(userId);
        this.sensitiveData.delete(userId);
        if (deleted) {
            this.logAction('DELETE_USER', userId, 'User deleted');
        }
        return deleted;
    }
    
    getAllUsers() {
        this.logAction('GET_ALL_USERS', 'SYSTEM', 'All users accessed');
        return Array.from(this.users.values());
    }
    
    getAuditLog() {
        return [...this.auditLog];
    }
    
    logAction(action, userId, details) {
        this.auditLog.push({
            timestamp: new Date(),
            action: action,
            userId: userId,
            details: details
        });
    }
}

// Protection Proxy with role-based access control
class ProtectedUserDataManager {
    constructor(realManager, userRole, currentUserId) {
        this.realManager = realManager;
        this.userRole = userRole; // 'admin', 'manager', 'user', 'guest'
        this.currentUserId = currentUserId;
        this.accessLog = [];
        
        // Define permissions for each role
        this.permissions = {
            admin: ['create', 'read', 'update', 'delete', 'readSensitive', 'readAudit', 'readAll'],
            manager: ['create', 'read', 'update', 'readAudit', 'readAll'],
            user: ['read', 'update'], // Can only read/update their own data
            guest: ['read'] // Can only read non-sensitive data
        };
    }
    
    // Check if current user has permission for action
    hasPermission(action, targetUserId = null) {
        const userPermissions = this.permissions[this.userRole] || [];
        
        if (!userPermissions.includes(action)) {
            return false;
        }
        
        // Special rules for user role
        if (this.userRole === 'user') {
            // Users can only access their own data
            if (targetUserId && targetUserId !== this.currentUserId) {
                return false;
            }
        }
        
        return true;
    }
    
    logAccess(action, allowed, targetUserId, reason = '') {
        this.accessLog.push({
            timestamp: new Date(),
            userRole: this.userRole,
            currentUserId: this.currentUserId,
            action: action,
            targetUserId: targetUserId,
            allowed: allowed,
            reason: reason
        });
    }
    
    createUser(userId, userData) {
        if (!this.hasPermission('create')) {
            const reason = `Role '${this.userRole}' cannot create users`;
            this.logAccess('CREATE_USER', false, userId, reason);
            throw new Error(`Access denied: ${reason}`);
        }
        
        this.logAccess('CREATE_USER', true, userId);
        return this.realManager.createUser(userId, userData);
    }
    
    getUser(userId) {
        if (!this.hasPermission('read', userId)) {
            const reason = `Role '${this.userRole}' cannot read user '${userId}'`;
            this.logAccess('GET_USER', false, userId, reason);
            throw new Error(`Access denied: ${reason}`);
        }
        
        this.logAccess('GET_USER', true, userId);
        return this.realManager.getUser(userId);
    }
    
    getUserSensitiveData(userId) {
        if (!this.hasPermission('readSensitive', userId)) {
            const reason = `Role '${this.userRole}' cannot access sensitive data`;
            this.logAccess('GET_SENSITIVE', false, userId, reason);
            throw new Error(`Access denied: ${reason}`);
        }
        
        this.logAccess('GET_SENSITIVE', true, userId);
        return this.realManager.getUserSensitiveData(userId);
    }
    
    updateUser(userId, updates) {
        if (!this.hasPermission('update', userId)) {
            const reason = `Role '${this.userRole}' cannot update user '${userId}'`;
            this.logAccess('UPDATE_USER', false, userId, reason);
            throw new Error(`Access denied: ${reason}`);
        }
        
        this.logAccess('UPDATE_USER', true, userId);
        return this.realManager.updateUser(userId, updates);
    }
    
    deleteUser(userId) {
        if (!this.hasPermission('delete', userId)) {
            const reason = `Role '${this.userRole}' cannot delete users`;
            this.logAccess('DELETE_USER', false, userId, reason);
            throw new Error(`Access denied: ${reason}`);
        }
        
        this.logAccess('DELETE_USER', true, userId);
        return this.realManager.deleteUser(userId);
    }
    
    getAllUsers() {
        if (!this.hasPermission('readAll')) {
            const reason = `Role '${this.userRole}' cannot access all users`;
            this.logAccess('GET_ALL_USERS', false, null, reason);
            throw new Error(`Access denied: ${reason}`);
        }
        
        this.logAccess('GET_ALL_USERS', true);
        return this.realManager.getAllUsers();
    }
    
    getAuditLog() {
        if (!this.hasPermission('readAudit')) {
            const reason = `Role '${this.userRole}' cannot access audit log`;
            this.logAccess('GET_AUDIT_LOG', false, null, reason);
            throw new Error(`Access denied: ${reason}`);
        }
        
        this.logAccess('GET_AUDIT_LOG', true);
        return this.realManager.getAuditLog();
    }
    
    getAccessLog() {
        // Access log of the proxy itself
        return [...this.accessLog];
    }
    
    getPermissions() {
        return {
            userRole: this.userRole,
            permissions: this.permissions[this.userRole] || [],
            currentUserId: this.currentUserId
        };
    }
}

// Usage demonstration
console.log('\n=== Protection Proxy Demo ===');

const realManager = new UserDataManager();

// Create different proxy instances with different roles
const adminProxy = new ProtectedUserDataManager(realManager, 'admin', 'admin1');
const managerProxy = new ProtectedUserDataManager(realManager, 'manager', 'mgr1');
const userProxy = new ProtectedUserDataManager(realManager, 'user', 'user1');
const guestProxy = new ProtectedUserDataManager(realManager, 'guest', 'guest1');

console.log('Admin permissions:', adminProxy.getPermissions());
console.log('User permissions:', userProxy.getPermissions());

// Admin can do everything
console.log('\n--- Admin Operations ---');
adminProxy.createUser('user1', { name: 'John Doe', email: 'john@example.com', ssn: '123-45-6789' });
adminProxy.createUser('user2', { name: 'Jane Smith', email: 'jane@example.com' });

console.log('User created by admin:', adminProxy.getUser('user1'));
console.log('Sensitive data (admin):', adminProxy.getUserSensitiveData('user1'));

// User can only access their own data
console.log('\n--- User Operations ---');
try {
    console.log('User accessing their own data:', userProxy.getUser('user1')); // Allowed
    userProxy.updateUser('user1', { email: 'john.doe@example.com' }); // Allowed
    console.log('User updated their data');
} catch (error) {
    console.error(error.message);
}

try {
    userProxy.getUser('user2'); // Should fail - accessing other user's data
} catch (error) {
    console.error('Expected error:', error.message);
}

// Guest has very limited access
console.log('\n--- Guest Operations ---');
try {
    console.log('Guest accessing user data:', guestProxy.getUser('user1')); // Allowed - basic read
} catch (error) {
    console.error(error.message);
}

try {
    guestProxy.getUserSensitiveData('user1'); // Should fail - no sensitive access
} catch (error) {
    console.error('Expected error:', error.message);
}

try {
    guestProxy.createUser('user3', { name: 'Test User' }); // Should fail - no create permission
} catch (error) {
    console.error('Expected error:', error.message);
}

// Manager can access audit logs
console.log('\n--- Manager Operations ---');
try {
    const auditLog = managerProxy.getAuditLog();
    console.log(`Manager accessed audit log: ${auditLog.length} entries`);
} catch (error) {
    console.error(error.message);
}

// Show access logs from proxy
console.log('\n--- Access Logs ---');
console.log('Admin access log:', adminProxy.getAccessLog());
console.log('User access log:', userProxy.getAccessLog());
console.log('Guest access log:', guestProxy.getAccessLog());
```

### Smart Proxy with JavaScript Proxy API

**JavaScript's native Proxy API enables sophisticated meta-programming.**

```javascript
// Smart Proxy using native JavaScript Proxy API
class SmartObjectProxy {
    constructor(target, options = {}) {
        this.target = target;
        this.options = {
            logAccess: options.logAccess || false,
            validateProperties: options.validateProperties || false,
            cacheResults: options.cacheResults || false,
            readOnly: options.readOnly || false,
            ...options
        };
        
        this.accessLog = [];
        this.cache = new Map();
        this.validators = new Map();
        
        // Setup default validators if requested
        if (this.options.validateProperties) {
            this.setupDefaultValidators();
        }
        
        return new Proxy(target, {
            get: this.getHandler.bind(this),
            set: this.setHandler.bind(this),
            has: this.hasHandler.bind(this),
            deleteProperty: this.deleteHandler.bind(this),
            ownKeys: this.ownKeysHandler.bind(this),
            defineProperty: this.definePropertyHandler.bind(this)
        });
    }
    
    setupDefaultValidators() {
        // Default validators for common property types
        this.validators.set('email', (value) => {
            return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        });
        
        this.validators.set('age', (value) => {
            return typeof value === 'number' && value >= 0 && value <= 150;
        });
        
        this.validators.set('phone', (value) => {
            return typeof value === 'string' && /^\d{10,15}$/.test(value.replace(/\D/g, ''));
        });
    }
    
    logAccess(operation, property, value = undefined) {
        if (this.options.logAccess) {
            this.accessLog.push({
                timestamp: new Date(),
                operation: operation,
                property: property,
                value: value
            });
        }
    }
    
    getHandler(target, property, receiver) {
        this.logAccess('GET', property);
        
        // Handle special proxy methods
        if (property === '__getAccessLog') {
            return () => [...this.accessLog];
        }
        
        if (property === '__clearCache') {
            return () => this.cache.clear();
        }
        
        if (property === '__addValidator') {
            return (prop, validator) => this.validators.set(prop, validator);
        }
        
        // Check cache first
        if (this.options.cacheResults && this.cache.has(property)) {
            console.log(`Cache hit for property: ${property}`);
            return this.cache.get(property);
        }
        
        const value = Reflect.get(target, property, receiver);
        
        // Cache the result if it's a method result or computed property
        if (this.options.cacheResults && typeof value === 'function') {
            // Cache method results
            return (...args) => {
                const cacheKey = `${property}_${JSON.stringify(args)}`;
                if (this.cache.has(cacheKey)) {
                    console.log(`Method cache hit: ${property}`);
                    return this.cache.get(cacheKey);
                }
                
                const result = value.apply(target, args);
                this.cache.set(cacheKey, result);
                console.log(`Method result cached: ${property}`);
                return result;
            };
        }
        
        // Cache simple property values
        if (this.options.cacheResults && property !== 'constructor') {
            this.cache.set(property, value);
        }
        
        return value;
    }
    
    setHandler(target, property, value, receiver) {
        this.logAccess('SET', property, value);
        
        // Check read-only mode
        if (this.options.readOnly) {
            console.warn(`Attempted to modify read-only property: ${property}`);
            throw new Error(`Cannot set property '${property}' on read-only object`);
        }
        
        // Validate property if validator exists
        if (this.validators.has(property)) {
            const validator = this.validators.get(property);
            if (!validator(value)) {
                throw new Error(`Invalid value for property '${property}': ${value}`);
            }
        }
        
        // Clear related cache entries
        if (this.options.cacheResults) {
            // Clear exact match
            this.cache.delete(property);
            
            // Clear method cache entries that might be affected
            for (const key of this.cache.keys()) {
                if (key.startsWith(property + '_')) {
                    this.cache.delete(key);
                }
            }
        }
        
        const result = Reflect.set(target, property, value, receiver);
        
        // Trigger change event if configured
        if (this.options.onChange && typeof this.options.onChange === 'function') {
            this.options.onChange(property, value, target);
        }
        
        return result;
    }
    
    hasHandler(target, property) {
        this.logAccess('HAS', property);
        return Reflect.has(target, property);
    }
    
    deleteHandler(target, property) {
        this.logAccess('DELETE', property);
        
        if (this.options.readOnly) {
            throw new Error(`Cannot delete property '${property}' from read-only object`);
        }
        
        // Clear from cache
        if (this.options.cacheResults) {
            this.cache.delete(property);
        }
        
        return Reflect.deleteProperty(target, property);
    }
    
    ownKeysHandler(target) {
        this.logAccess('KEYS');
        return Reflect.ownKeys(target);
    }
    
    definePropertyHandler(target, property, descriptor) {
        this.logAccess('DEFINE', property);
        
        if (this.options.readOnly) {
            throw new Error(`Cannot define property '${property}' on read-only object`);
        }
        
        return Reflect.defineProperty(target, property, descriptor);
    }
}

// Advanced reactive proxy example
class ReactiveProxy {
    constructor(target) {
        this.target = target;
        this.watchers = new Map();
        this.computedProperties = new Map();
        this.changeQueue = [];
        
        return new Proxy(target, {
            get: this.getHandler.bind(this),
            set: this.setHandler.bind(this),
        });
    }
    
    getHandler(target, property) {
        // Handle special reactive methods
        if (property === '$watch') {
            return (prop, callback) => this.watch(prop, callback);
        }
        
        if (property === '$computed') {
            return (prop, computeFn) => this.computed(prop, computeFn);
        }
        
        if (property === '$unwatch') {
            return (prop, callback) => this.unwatch(prop, callback);
        }
        
        // Check if it's a computed property
        if (this.computedProperties.has(property)) {
            const computeFn = this.computedProperties.get(property);
            return computeFn.call(target);
        }
        
        return Reflect.get(target, property);
    }
    
    setHandler(target, property, value) {
        const oldValue = target[property];
        const result = Reflect.set(target, property, value);
        
        if (oldValue !== value) {
            this.notifyWatchers(property, value, oldValue);
            this.scheduleComputedUpdates();
        }
        
        return result;
    }
    
    watch(property, callback) {
        if (!this.watchers.has(property)) {
            this.watchers.set(property, new Set());
        }
        this.watchers.get(property).add(callback);
        
        return () => this.unwatch(property, callback);
    }
    
    unwatch(property, callback) {
        const propertyWatchers = this.watchers.get(property);
        if (propertyWatchers) {
            propertyWatchers.delete(callback);
            if (propertyWatchers.size === 0) {
                this.watchers.delete(property);
            }
        }
    }
    
    computed(property, computeFn) {
        this.computedProperties.set(property, computeFn);
        
        // Initially compute the value
        this.target[property] = computeFn.call(this.target);
    }
    
    notifyWatchers(property, newValue, oldValue) {
        const propertyWatchers = this.watchers.get(property);
        if (propertyWatchers) {
            propertyWatchers.forEach(callback => {
                callback(newValue, oldValue, property);
            });
        }
    }
    
    scheduleComputedUpdates() {
        // Use microtask to batch computed property updates
        if (this.changeQueue.length === 0) {
            Promise.resolve().then(() => {
                this.updateComputedProperties();
                this.changeQueue = [];
            });
        }
    }
    
    updateComputedProperties() {
        for (const [property, computeFn] of this.computedProperties) {
            const oldValue = this.target[property];
            const newValue = computeFn.call(this.target);
            
            if (oldValue !== newValue) {
                this.target[property] = newValue;
                this.notifyWatchers(property, newValue, oldValue);
            }
        }
    }
}

// Usage demonstration
console.log('\n=== Smart Proxy Demo ===');

// Basic user object
const user = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    calculateBirthYear() {
        return new Date().getFullYear() - this.age;
    }
};

// Create smart proxy with various options
const smartUser = new SmartObjectProxy(user, {
    logAccess: true,
    validateProperties: true,
    cacheResults: true,
    onChange: (property, value) => {
        console.log(`Property changed: ${property} = ${value}`);
    }
});

console.log('--- Smart Proxy Operations ---');
console.log('Name:', smartUser.name); // Logged access
console.log('Birth year:', smartUser.calculateBirthYear()); // Cached method

// Try to set invalid email
try {
    smartUser.email = 'invalid-email'; // Should fail validation
} catch (error) {
    console.error('Validation error:', error.message);
}

// Valid update
smartUser.age = 31; // Triggers onChange callback

// Access cached method result
console.log('Birth year again:', smartUser.calculateBirthYear()); // Cache hit

// Check access log
const accessLog = smartUser.__getAccessLog();
console.log('Access log entries:', accessLog.length);
console.log('Recent accesses:', accessLog.slice(-3));

// Reactive proxy demo
console.log('\n--- Reactive Proxy Demo ---');
const reactiveData = new ReactiveProxy({
    firstName: 'John',
    lastName: 'Doe',
    age: 30
});

// Watch for changes
reactiveData.$watch('firstName', (newValue, oldValue) => {
    console.log(`First name changed from ${oldValue} to ${newValue}`);
});

// Add computed property
reactiveData.$computed('fullName', function() {
    return `${this.firstName} ${this.lastName}`;
});

reactiveData.$computed('isAdult', function() {
    return this.age >= 18;
});

console.log('Initial full name:', reactiveData.fullName);
console.log('Is adult:', reactiveData.isAdult);

// Change properties (triggers watchers and computed updates)
reactiveData.firstName = 'Jane';
reactiveData.lastName = 'Smith';

// Wait for computed properties to update
await new Promise(resolve => setTimeout(resolve, 0));

console.log('Updated full name:', reactiveData.fullName);
console.log('Still adult:', reactiveData.isAdult);
```

## Summary

### Core Concepts
- **Singleton Pattern**: Ensures only one instance exists while providing global access
- **Proxy Pattern**: Provides surrogate that controls access to another object
- **Meta-Programming**: Both patterns enable programs to manipulate programs
- **Access Control**: Fine-grained control over object creation and usage

### Theoretical Foundation
- **Object Lifecycle Management**: Control when and how objects are created
- **Delegation Pattern**: Proxy forwards operations to real objects
- **Aspect-Oriented Programming**: Cross-cutting concerns separated from business logic
- **Resource Management**: Optimized creation and access patterns

### Pattern Comparison
- **Singleton**: Controls object creation (creational pattern)
- **Proxy**: Controls object access (structural pattern)
- **Together**: Comprehensive control over object lifecycle

### JavaScript-Specific Features
- **Native Proxy API**: Powerful meta-programming capabilities
- **Flexible Implementation**: Multiple ways to implement patterns
- **Runtime Modification**: Dynamic behavior changes at runtime

### Implementation Benefits
- **Resource Optimization**: Lazy loading and caching
- **Security**: Access control and permission management
- **Maintainability**: Cross-cutting concerns separated
- **Performance**: Optimized access patterns and resource usage

### When to Use These Patterns
- **Singleton**: Global resources, configuration management, system-wide coordination
- **Proxy**: Access control, lazy loading, caching, logging, validation
- **Both**: When you need sophisticated control over object behavior

### My Personal Insight
These patterns fundamentally changed how I think about object ownership and access control. **Singleton taught me that not every object needs multiple instances** - sometimes global coordination is exactly what you need, despite what purists say about global state.

**Proxy pattern opened up a world of meta-programming possibilities.** The ability to transparently intercept and modify object interactions is incredibly powerful. JavaScript's native Proxy API is especially elegant - it makes creating sophisticated object wrappers almost trivial.

**The key insight: These patterns are about control.** Singleton controls creation, Proxy controls access. Together, they give you complete authority over how objects behave in your system.

I've used these patterns to build everything from configuration systems and database connection pools (Singleton) to ORM layers and reactive frameworks (Proxy). They're not just academic concepts - they're practical tools for building better software.

### Next Up
Congratulations! You've completed **Module 9: JavaScript Design Patterns**! 🎉 

Next, we'll explore **Module 10: Performance & Optimization** - where we'll learn to build lightning-fast JavaScript applications through memory management, profiling techniques, debouncing, throttling, and advanced optimization strategies.

Remember: Design patterns aren't about showing off - they're about solving real problems with proven, maintainable solutions! 🚀✨
