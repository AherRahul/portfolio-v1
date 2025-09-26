---
title: "Factory Pattern & Builder Pattern"
description: "Master creational design patterns for flexible object creation. Learn factory methods, abstract factories, and builder patterns for constructing complex objects with clean, maintainable code."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: "Factory Pattern - GoF Design Patterns"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Factory_method_pattern"
    description: "Classical Factory pattern definition and theory"
  - title: "Builder Pattern - GoF Design Patterns"  
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Builder_pattern"
    description: "Builder pattern for complex object construction"
  - title: "JavaScript Factory Functions"
    type: "article"
    url: "https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e"
    description: "Modern approaches to object creation in JavaScript"
  - title: "Fluent Interface Design"
    type: "article"
    url: "https://martinfowler.com/bliki/FluentInterface.html"
    description: "Martin Fowler's guide to fluent interfaces"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811626/Portfolio/javaScriptCourse/images/all%20title%20images/39_qbdpup.png)

Factory Pattern & Builder Pattern – Mastering Object Creation
=============================================================

Imagine you're designing a **sophisticated manufacturing system** 🏭 for a company that creates custom products:

- **Factory Assembly Lines** 🤖 - Specialized production lines that know how to create specific types of products without the client needing to understand the manufacturing process
- **Product Specifications** 📋 - Abstract blueprints that define what products should be created, but not the specific details of how
- **Flexible Manufacturing** 🔧 - Ability to create different product variations using the same interface and processes
- **Complex Assembly Systems** 🏗️ - Step-by-step construction processes for intricate products that require careful orchestration of many components
- **Quality Control** ✅ - Ensuring every product meets specifications before leaving the factory
- **Modular Construction** 🧩 - Building products piece by piece with the ability to customize each component independently

**Factory and Builder patterns work exactly like this manufacturing system.** They solve fundamental problems in object creation by providing:

- **Abstraction of Creation Logic** - Hide complex instantiation details behind simple interfaces
- **Flexible Product Creation** - Support for multiple product types through common interfaces
- **Encapsulation of Construction** - Separate object creation from business logic
- **Consistent Object Assembly** - Ensure objects are properly initialized and valid
- **Extensible Architecture** - Easy to add new product types without modifying existing code
- **Complex Construction Management** - Handle multi-step object creation with validation and customization

Understanding these creational patterns is essential for building maintainable, flexible applications where object creation needs are complex or likely to change. They form the foundation for dependency injection, plugin architectures, and configuration-driven systems.

## The Theoretical Foundation: Creational Design Patterns and Object Instantiation 📐

### Understanding Creational Pattern Theory

**Creational design patterns abstract the instantiation process** and make systems independent of how objects are created, composed, and represented. They become important when systems need to be flexible about what gets created, who creates it, how it gets created, and when.

**Core Problems Creational Patterns Solve:**

1. **Coupling to Concrete Classes**: Direct instantiation creates tight coupling to specific implementations
2. **Complex Object Creation**: Objects requiring multiple steps or validation during construction
3. **Conditional Creation**: Different objects based on runtime conditions or configuration
4. **Resource Management**: Controlling object creation for performance or resource constraints
5. **Consistency Guarantees**: Ensuring objects are properly initialized before use

**Theoretical Benefits:**
- **Encapsulation**: Hide creation complexity behind simple interfaces
- **Flexibility**: Change object creation without modifying client code
- **Reusability**: Common creation patterns can be reused across different contexts
- **Maintainability**: Centralize creation logic for easier modification and testing

### Factory Pattern Theory: Polymorphic Creation

**The Factory Pattern implements polymorphism at the creation level** - allowing a class to defer instantiation to subclasses or separate factory methods.

**Types of Factory Patterns:**

1. **Simple Factory**: Static method that creates objects based on parameters
2. **Factory Method**: Virtual constructor that lets subclasses decide which class to instantiate
3. **Abstract Factory**: Interface for creating families of related objects
4. **Parameterized Factory**: Factory that accepts configuration to customize creation

**Why Factory Patterns Matter:**
- **Decoupling**: Clients don't depend on concrete classes
- **Single Responsibility**: Creation logic separated from business logic
- **Open/Closed Principle**: Easy to add new product types without modifying existing code
- **Dependency Inversion**: Depend on abstractions, not concretions

### Builder Pattern Theory: Complex Object Assembly

**The Builder Pattern separates the construction of complex objects from their representation** so that the same construction process can create different representations.

**Builder Pattern Concepts:**

1. **Step-by-Step Construction**: Build objects through a series of method calls
2. **Fluent Interface**: Method chaining that reads like natural language
3. **Validation During Construction**: Ensure objects are valid at each step
4. **Immutable Results**: Builders often create immutable objects
5. **Configuration Over Constructor**: Replace complex constructors with expressive builders

**When Builder Pattern Excels:**
- **Many Constructor Parameters**: When objects need numerous optional parameters
- **Complex Validation**: When object validity depends on multiple interdependent properties
- **Immutable Objects**: When you want to create immutable objects with many properties
- **Fluent APIs**: When you want to provide an expressive, readable construction API

### Object Lifecycle Management Theory

**Understanding object lifecycle is crucial for effective creation patterns:**

1. **Creation Phase**: Object instantiation and initial property setting
2. **Initialization Phase**: Complex setup, validation, and relationship establishment
3. **Configuration Phase**: Runtime customization and dependency injection
4. **Usage Phase**: Normal object operation and method invocation
5. **Cleanup Phase**: Resource release and garbage collection preparation

**Creation patterns primarily focus on the first three phases**, ensuring objects enter the usage phase in a valid, properly configured state.

## The Problem: Complex Object Creation 😤

### Why Simple Constructors Fail

**As applications grow, simple constructors become inadequate** for handling complex object creation requirements:

```javascript
// The problem with simple constructors
class DatabaseConnection {
    constructor(host, port, database, username, password, ssl, timeout, retries, poolSize, maxConnections) {
        // Too many parameters - error prone and hard to remember
        this.host = host;
        this.port = port;
        this.database = database;
        this.username = username;
        this.password = password;
        this.ssl = ssl;
        this.timeout = timeout;
        this.retries = retries;
        this.poolSize = poolSize;
        this.maxConnections = maxConnections;
        
        // Complex validation logic mixed with construction
        if (!host || !database) {
            throw new Error('Host and database are required');
        }
        
        if (port < 1 || port > 65535) {
            throw new Error('Port must be between 1 and 65535');
        }
        
        // What order do parameters go in?
        // Which parameters are optional?
        // How do we handle default values?
    }
}

// Usage is confusing and error-prone
const db1 = new DatabaseConnection('localhost', 5432, 'mydb', 'user', 'pass', true, 5000, 3, 10, 100);
const db2 = new DatabaseConnection('localhost', 5432, 'mydb', 'user', 'pass', false, null, null, null, null); // Many nulls

// Problems:
// 1. Parameter order is hard to remember
// 2. Many optional parameters lead to null/undefined values
// 3. Validation logic clutters the constructor
// 4. Hard to create variations (development vs production configs)
// 5. No way to validate complex interdependencies
// 6. Constructor does too much (violates SRP)
```

### Tight Coupling and Inflexibility

```javascript
// Tight coupling example - hard to modify or test
class EmailService {
    constructor() {
        // Directly coupled to specific implementations
        this.transporter = new SMTPTransporter('smtp.gmail.com', 587);
        this.templater = new HandlebarsTemplater();
        this.logger = new ConsoleLogger();
        this.queue = new RedisQueue('localhost', 6379);
    }
    
    sendEmail(to, subject, template, data) {
        try {
            const html = this.templater.compile(template, data);
            const message = {
                to: to,
                subject: subject,
                html: html
            };
            
            this.queue.add(message);
            this.logger.log(`Email queued for ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
        }
    }
}

// Problems with this approach:
// 1. Can't use different email providers (SendGrid, AWS SES, etc.)
// 2. Can't use different templating engines (Mustache, EJS, etc.)
// 3. Can't use different logging strategies (file, database, etc.)
// 4. Can't use different queuing systems (RabbitMQ, AWS SQS, etc.)
// 5. Hard to test - need real SMTP server, Redis, etc.
// 6. Configuration is hardcoded
// 7. Can't create multiple instances with different configs
```

### Complex Object Hierarchies

```javascript
// Complex object creation without patterns
function createUserInterface(userType, permissions, theme, language) {
    let ui;
    
    // Complex conditional logic for object creation
    if (userType === 'admin') {
        if (permissions.includes('user-management')) {
            ui = new AdminUserManagementUI();
        } else if (permissions.includes('content-management')) {
            ui = new AdminContentManagementUI();
        } else {
            ui = new BasicAdminUI();
        }
    } else if (userType === 'moderator') {
        ui = new ModeratorUI();
    } else if (userType === 'premium-user') {
        ui = new PremiumUserUI();
    } else {
        ui = new BasicUserUI();
    }
    
    // More configuration logic
    if (theme === 'dark') {
        ui.setDarkTheme();
    } else if (theme === 'high-contrast') {
        ui.setHighContrastTheme();
    }
    
    if (language !== 'en') {
        ui.setLanguage(language);
    }
    
    // Even more setup...
    ui.configure({
        animations: userType !== 'basic-user',
        notifications: permissions.includes('notifications'),
        analytics: permissions.includes('analytics')
    });
    
    return ui;
}

// Problems:
// 1. Creation logic is complex and centralized in one function
// 2. Adding new user types requires modifying this function
// 3. Complex conditional logic is hard to test and maintain
// 4. No separation between object creation and configuration
// 5. Difficult to reuse parts of the creation logic
// 6. Hard to extend without breaking existing functionality
```

## Factory Pattern Implementation 🏭

### Simple Factory: Centralized Object Creation

**The Simple Factory encapsulates object creation in a single method** but doesn't use inheritance or polymorphism.

```javascript
// Simple Factory Pattern implementation
class Logger {
    constructor(level = 'info') {
        this.level = level;
    }
    
    log(level, message) {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        if (levels[level] >= levels[this.level]) {
            this.doLog(level, message);
        }
    }
    
    doLog(level, message) {
        throw new Error('Subclasses must implement doLog method');
    }
}

class ConsoleLogger extends Logger {
    doLog(level, message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
}

class FileLogger extends Logger {
    constructor(filename, level = 'info') {
        super(level);
        this.filename = filename;
    }
    
    doLog(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        
        // In a real implementation, this would write to a file
        console.log(`Writing to ${this.filename}: ${logEntry.trim()}`);
    }
}

class DatabaseLogger extends Logger {
    constructor(connectionString, level = 'info') {
        super(level);
        this.connectionString = connectionString;
    }
    
    doLog(level, message) {
        const timestamp = new Date().toISOString();
        
        // In a real implementation, this would write to a database
        console.log(`Saving to database: ${this.connectionString}`, {
            timestamp,
            level,
            message
        });
    }
}

// Simple Factory for logger creation
class LoggerFactory {
    static createLogger(type, options = {}) {
        const { level = 'info', ...typeSpecificOptions } = options;
        
        switch (type.toLowerCase()) {
            case 'console':
                return new ConsoleLogger(level);
                
            case 'file':
                if (!typeSpecificOptions.filename) {
                    throw new Error('File logger requires filename option');
                }
                return new FileLogger(typeSpecificOptions.filename, level);
                
            case 'database':
                if (!typeSpecificOptions.connectionString) {
                    throw new Error('Database logger requires connectionString option');
                }
                return new DatabaseLogger(typeSpecificOptions.connectionString, level);
                
            default:
                throw new Error(`Unknown logger type: ${type}`);
        }
    }
    
    // Factory method with validation
    static createLoggerWithValidation(type, options = {}) {
        // Validate common options
        if (options.level && !['debug', 'info', 'warn', 'error'].includes(options.level)) {
            throw new Error(`Invalid log level: ${options.level}`);
        }
        
        // Use main factory method
        return this.createLogger(type, options);
    }
    
    // Factory method that supports multiple loggers
    static createMultiLogger(configs) {
        const loggers = configs.map(config => 
            this.createLogger(config.type, config.options)
        );
        
        return new MultiLogger(loggers);
    }
}

// Multi-logger implementation
class MultiLogger extends Logger {
    constructor(loggers) {
        super();
        this.loggers = loggers;
    }
    
    doLog(level, message) {
        this.loggers.forEach(logger => {
            logger.log(level, message);
        });
    }
}

// Usage examples
console.log('=== Simple Factory Pattern Demo ===');

// Create different types of loggers
const consoleLogger = LoggerFactory.createLogger('console', { level: 'debug' });
const fileLogger = LoggerFactory.createLogger('file', { 
    level: 'warn', 
    filename: 'app.log' 
});
const dbLogger = LoggerFactory.createLogger('database', { 
    level: 'error',
    connectionString: 'mongodb://localhost:27017/logs'
});

// Test the loggers
consoleLogger.log('info', 'This is a console log message');
fileLogger.log('warn', 'This is a file log warning');
dbLogger.log('error', 'This is a database log error');

// Create multi-logger
const multiLogger = LoggerFactory.createMultiLogger([
    { type: 'console', options: { level: 'debug' } },
    { type: 'file', options: { level: 'info', filename: 'combined.log' } }
]);

multiLogger.log('info', 'This goes to both console and file');

// Demonstrate validation
try {
    LoggerFactory.createLoggerWithValidation('console', { level: 'invalid' });
} catch (error) {
    console.log('Validation caught error:', error.message);
}
```

### Factory Method Pattern: Polymorphic Creation

**The Factory Method pattern uses inheritance to let subclasses decide which concrete class to instantiate.**

```javascript
// Factory Method Pattern implementation
// Abstract Creator class
class ConnectionFactory {
    // Factory method - subclasses will override this
    createConnection(config) {
        throw new Error('Subclasses must implement createConnection method');
    }
    
    // Template method that uses the factory method
    establishConnection(config) {
        console.log('Preparing to establish connection...');
        
        // Use factory method to create appropriate connection
        const connection = this.createConnection(config);
        
        // Common post-creation logic
        this.validateConnection(connection);
        this.logConnectionCreated(connection);
        
        return connection;
    }
    
    validateConnection(connection) {
        if (!connection.connect || typeof connection.connect !== 'function') {
            throw new Error('Invalid connection: missing connect method');
        }
    }
    
    logConnectionCreated(connection) {
        console.log(`Created connection of type: ${connection.constructor.name}`);
    }
}

// Abstract Connection class
class Connection {
    constructor(config) {
        this.config = config;
        this.isConnected = false;
    }
    
    connect() {
        throw new Error('Subclasses must implement connect method');
    }
    
    disconnect() {
        throw new Error('Subclasses must implement disconnect method');
    }
    
    query(sql) {
        throw new Error('Subclasses must implement query method');
    }
}

// Concrete Connection implementations
class MySQLConnection extends Connection {
    connect() {
        console.log(`Connecting to MySQL at ${this.config.host}:${this.config.port}`);
        this.isConnected = true;
        return Promise.resolve();
    }
    
    disconnect() {
        console.log('Disconnecting from MySQL');
        this.isConnected = false;
        return Promise.resolve();
    }
    
    query(sql) {
        if (!this.isConnected) {
            throw new Error('Not connected to MySQL');
        }
        console.log(`Executing MySQL query: ${sql}`);
        return Promise.resolve([]);
    }
}

class PostgreSQLConnection extends Connection {
    connect() {
        console.log(`Connecting to PostgreSQL at ${this.config.host}:${this.config.port}`);
        this.isConnected = true;
        return Promise.resolve();
    }
    
    disconnect() {
        console.log('Disconnecting from PostgreSQL');
        this.isConnected = false;
        return Promise.resolve();
    }
    
    query(sql) {
        if (!this.isConnected) {
            throw new Error('Not connected to PostgreSQL');
        }
        console.log(`Executing PostgreSQL query: ${sql}`);
        return Promise.resolve([]);
    }
}

class MongoDBConnection extends Connection {
    connect() {
        console.log(`Connecting to MongoDB at ${this.config.host}:${this.config.port}`);
        this.isConnected = true;
        return Promise.resolve();
    }
    
    disconnect() {
        console.log('Disconnecting from MongoDB');
        this.isConnected = false;
        return Promise.resolve();
    }
    
    query(operation) {
        if (!this.isConnected) {
            throw new Error('Not connected to MongoDB');
        }
        console.log(`Executing MongoDB operation: ${JSON.stringify(operation)}`);
        return Promise.resolve([]);
    }
}

// Concrete Factory implementations
class MySQLConnectionFactory extends ConnectionFactory {
    createConnection(config) {
        const mysqlConfig = {
            host: config.host || 'localhost',
            port: config.port || 3306,
            database: config.database,
            username: config.username,
            password: config.password,
            ...config
        };
        
        return new MySQLConnection(mysqlConfig);
    }
}

class PostgreSQLConnectionFactory extends ConnectionFactory {
    createConnection(config) {
        const pgConfig = {
            host: config.host || 'localhost',
            port: config.port || 5432,
            database: config.database,
            username: config.username,
            password: config.password,
            ...config
        };
        
        return new PostgreSQLConnection(pgConfig);
    }
}

class MongoDBConnectionFactory extends ConnectionFactory {
    createConnection(config) {
        const mongoConfig = {
            host: config.host || 'localhost',
            port: config.port || 27017,
            database: config.database,
            username: config.username,
            password: config.password,
            ...config
        };
        
        return new MongoDBConnection(mongoConfig);
    }
}

// Usage demonstration
console.log('\n=== Factory Method Pattern Demo ===');

const dbConfig = {
    host: 'localhost',
    database: 'myapp',
    username: 'user',
    password: 'password'
};

// Client code doesn't need to know about specific connection types
const mysqlFactory = new MySQLConnectionFactory();
const pgFactory = new PostgreSQLConnectionFactory();
const mongoFactory = new MongoDBConnectionFactory();

// Same interface, different implementations
const mysqlConn = mysqlFactory.establishConnection(dbConfig);
const pgConn = pgFactory.establishConnection(dbConfig);
const mongoConn = mongoFactory.establishConnection(dbConfig);

// All connections have the same interface
mysqlConn.connect().then(() => mysqlConn.query('SELECT * FROM users'));
pgConn.connect().then(() => pgConn.query('SELECT * FROM users'));
mongoConn.connect().then(() => mongoConn.query({ collection: 'users', operation: 'find' }));
```

### Abstract Factory Pattern: Families of Related Objects

**The Abstract Factory provides an interface for creating families of related or dependent objects.**

```javascript
// Abstract Factory Pattern implementation
// Abstract UI Component classes
class Button {
    constructor(text) {
        this.text = text;
    }
    
    render() {
        throw new Error('Subclasses must implement render method');
    }
    
    onClick(handler) {
        this.clickHandler = handler;
    }
}

class Input {
    constructor(placeholder) {
        this.placeholder = placeholder;
        this.value = '';
    }
    
    render() {
        throw new Error('Subclasses must implement render method');
    }
    
    onInput(handler) {
        this.inputHandler = handler;
    }
}

class Modal {
    constructor(title, content) {
        this.title = title;
        this.content = content;
        this.isVisible = false;
    }
    
    render() {
        throw new Error('Subclasses must implement render method');
    }
    
    show() {
        this.isVisible = true;
    }
    
    hide() {
        this.isVisible = false;
    }
}

// Concrete Material Design implementations
class MaterialButton extends Button {
    render() {
        return `<button class="mdc-button mdc-button--raised">${this.text}</button>`;
    }
}

class MaterialInput extends Input {
    render() {
        return `
            <div class="mdc-text-field">
                <input class="mdc-text-field__input" placeholder="${this.placeholder}">
                <div class="mdc-line-ripple"></div>
            </div>
        `;
    }
}

class MaterialModal extends Modal {
    render() {
        return `
            <div class="mdc-dialog ${this.isVisible ? 'mdc-dialog--open' : ''}">
                <div class="mdc-dialog__container">
                    <div class="mdc-dialog__surface">
                        <h2 class="mdc-dialog__title">${this.title}</h2>
                        <div class="mdc-dialog__content">${this.content}</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Concrete Bootstrap implementations
class BootstrapButton extends Button {
    render() {
        return `<button class="btn btn-primary">${this.text}</button>`;
    }
}

class BootstrapInput extends Input {
    render() {
        return `<input class="form-control" placeholder="${this.placeholder}">`;
    }
}

class BootstrapModal extends Modal {
    render() {
        return `
            <div class="modal ${this.isVisible ? 'show' : ''}" style="display: ${this.isVisible ? 'block' : 'none'}">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.title}</h5>
                        </div>
                        <div class="modal-body">${this.content}</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Concrete Ant Design implementations
class AntButton extends Button {
    render() {
        return `<button class="ant-btn ant-btn-primary">${this.text}</button>`;
    }
}

class AntInput extends Input {
    render() {
        return `<input class="ant-input" placeholder="${this.placeholder}">`;
    }
}

class AntModal extends Modal {
    render() {
        return `
            <div class="ant-modal ${this.isVisible ? 'ant-modal-open' : ''}" style="display: ${this.isVisible ? 'block' : 'none'}">
                <div class="ant-modal-content">
                    <div class="ant-modal-header">
                        <div class="ant-modal-title">${this.title}</div>
                    </div>
                    <div class="ant-modal-body">${this.content}</div>
                </div>
            </div>
        `;
    }
}

// Abstract Factory interface
class UIComponentFactory {
    createButton(text) {
        throw new Error('Subclasses must implement createButton method');
    }
    
    createInput(placeholder) {
        throw new Error('Subclasses must implement createInput method');
    }
    
    createModal(title, content) {
        throw new Error('Subclasses must implement createModal method');
    }
    
    // Template method for creating a complete form
    createLoginForm() {
        const usernameInput = this.createInput('Username');
        const passwordInput = this.createInput('Password');
        const loginButton = this.createButton('Login');
        const cancelButton = this.createButton('Cancel');
        
        return {
            usernameInput,
            passwordInput,
            loginButton,
            cancelButton,
            render() {
                return `
                    <form class="login-form">
                        ${usernameInput.render()}
                        ${passwordInput.render()}
                        <div class="button-group">
                            ${loginButton.render()}
                            ${cancelButton.render()}
                        </div>
                    </form>
                `;
            }
        };
    }
}

// Concrete Factory implementations
class MaterialUIFactory extends UIComponentFactory {
    createButton(text) {
        return new MaterialButton(text);
    }
    
    createInput(placeholder) {
        return new MaterialInput(placeholder);
    }
    
    createModal(title, content) {
        return new MaterialModal(title, content);
    }
}

class BootstrapUIFactory extends UIComponentFactory {
    createButton(text) {
        return new BootstrapButton(text);
    }
    
    createInput(placeholder) {
        return new BootstrapInput(placeholder);
    }
    
    createModal(title, content) {
        return new BootstrapModal(title, content);
    }
}

class AntUIFactory extends UIComponentFactory {
    createButton(text) {
        return new AntButton(text);
    }
    
    createInput(placeholder) {
        return new AntInput(placeholder);
    }
    
    createModal(title, content) {
        return new AntModal(title, content);
    }
}

// Factory registry for dynamic factory selection
class UIFactoryRegistry {
    static factories = {
        'material': MaterialUIFactory,
        'bootstrap': BootstrapUIFactory,
        'antd': AntUIFactory
    };
    
    static getFactory(theme) {
        const FactoryClass = this.factories[theme];
        if (!FactoryClass) {
            throw new Error(`Unknown UI theme: ${theme}`);
        }
        return new FactoryClass();
    }
    
    static registerFactory(theme, factoryClass) {
        this.factories[theme] = factoryClass;
    }
    
    static getAvailableThemes() {
        return Object.keys(this.factories);
    }
}

// Usage demonstration
console.log('\n=== Abstract Factory Pattern Demo ===');

// Client code that works with any UI framework
function createApplicationUI(theme) {
    const factory = UIFactoryRegistry.getFactory(theme);
    
    // Create individual components
    const saveButton = factory.createButton('Save');
    const searchInput = factory.createInput('Search...');
    const helpModal = factory.createModal('Help', 'This is the help content');
    
    // Create complete forms using template method
    const loginForm = factory.createLoginForm();
    
    console.log(`\n--- ${theme.toUpperCase()} UI Components ---`);
    console.log('Save Button:', saveButton.render());
    console.log('Search Input:', searchInput.render());
    console.log('Help Modal:', helpModal.render());
    console.log('Login Form:', loginForm.render());
    
    return {
        saveButton,
        searchInput,
        helpModal,
        loginForm
    };
}

// Create UIs with different themes
const materialUI = createApplicationUI('material');
const bootstrapUI = createApplicationUI('bootstrap');
const antdUI = createApplicationUI('antd');

console.log('\nAvailable themes:', UIFactoryRegistry.getAvailableThemes());

// Demonstrate dynamic theme switching
function switchTheme(newTheme) {
    console.log(`\nSwitching to ${newTheme} theme...`);
    return createApplicationUI(newTheme);
}

const currentUI = switchTheme('bootstrap');
```

## Builder Pattern Implementation 🏗️

### Basic Builder: Step-by-Step Construction

**The Builder Pattern constructs complex objects step by step**, providing fine control over the construction process.

```javascript
// Builder Pattern implementation
class DatabaseConfig {
    constructor() {
        // Private properties - only accessible through builder
        this._host = null;
        this._port = null;
        this._database = null;
        this._username = null;
        this._password = null;
        this._ssl = false;
        this._connectionPool = null;
        this._timeout = 30000;
        this._retries = 3;
        this._maxConnections = 10;
        
        // Mark as built to prevent modifications
        this._isBuilt = false;
    }
    
    // Getters to access the configuration
    get host() { return this._host; }
    get port() { return this._port; }
    get database() { return this._database; }
    get username() { return this._username; }
    get password() { return this._password; }
    get ssl() { return this._ssl; }
    get connectionPool() { return this._connectionPool; }
    get timeout() { return this._timeout; }
    get retries() { return this._retries; }
    get maxConnections() { return this._maxConnections; }
    
    // Validation method
    validate() {
        const errors = [];
        
        if (!this._host) errors.push('Host is required');
        if (!this._database) errors.push('Database name is required');
        if (!this._username) errors.push('Username is required');
        if (!this._password) errors.push('Password is required');
        if (this._port && (this._port < 1 || this._port > 65535)) {
            errors.push('Port must be between 1 and 65535');
        }
        if (this._timeout < 1000) errors.push('Timeout must be at least 1000ms');
        if (this._retries < 0) errors.push('Retries cannot be negative');
        if (this._maxConnections < 1) errors.push('Max connections must be at least 1');
        
        return errors;
    }
    
    // Mark as built and freeze the object
    _markAsBuilt() {
        this._isBuilt = true;
        Object.freeze(this);
    }
    
    toString() {
        return `DatabaseConfig(${this._host}:${this._port}/${this._database})`;
    }
}

class DatabaseConfigBuilder {
    constructor() {
        this.config = new DatabaseConfig();
    }
    
    // Required parameters with validation
    host(host) {
        if (typeof host !== 'string' || host.trim().length === 0) {
            throw new Error('Host must be a non-empty string');
        }
        this.config._host = host.trim();
        return this; // Enable method chaining
    }
    
    port(port) {
        if (typeof port !== 'number' || port < 1 || port > 65535) {
            throw new Error('Port must be a number between 1 and 65535');
        }
        this.config._port = port;
        return this;
    }
    
    database(database) {
        if (typeof database !== 'string' || database.trim().length === 0) {
            throw new Error('Database must be a non-empty string');
        }
        this.config._database = database.trim();
        return this;
    }
    
    credentials(username, password) {
        if (typeof username !== 'string' || username.trim().length === 0) {
            throw new Error('Username must be a non-empty string');
        }
        if (typeof password !== 'string' || password.length === 0) {
            throw new Error('Password must be a non-empty string');
        }
        this.config._username = username.trim();
        this.config._password = password;
        return this;
    }
    
    // Optional parameters with defaults
    enableSSL(enabled = true) {
        this.config._ssl = Boolean(enabled);
        return this;
    }
    
    connectionPool(config) {
        this.config._connectionPool = {
            min: config.min || 1,
            max: config.max || this.config._maxConnections,
            acquireTimeoutMillis: config.acquireTimeoutMillis || 60000,
            createTimeoutMillis: config.createTimeoutMillis || 30000,
            destroyTimeoutMillis: config.destroyTimeoutMillis || 5000,
            idleTimeoutMillis: config.idleTimeoutMillis || 30000,
            reapIntervalMillis: config.reapIntervalMillis || 1000,
            createRetryIntervalMillis: config.createRetryIntervalMillis || 200
        };
        return this;
    }
    
    timeout(milliseconds) {
        if (typeof milliseconds !== 'number' || milliseconds < 1000) {
            throw new Error('Timeout must be a number >= 1000 milliseconds');
        }
        this.config._timeout = milliseconds;
        return this;
    }
    
    retries(count) {
        if (typeof count !== 'number' || count < 0) {
            throw new Error('Retries must be a non-negative number');
        }
        this.config._retries = count;
        return this;
    }
    
    maxConnections(count) {
        if (typeof count !== 'number' || count < 1) {
            throw new Error('Max connections must be a positive number');
        }
        this.config._maxConnections = count;
        return this;
    }
    
    // Predefined configurations for common scenarios
    forDevelopment() {
        return this
            .host('localhost')
            .port(5432)
            .timeout(5000)
            .retries(1)
            .maxConnections(5)
            .enableSSL(false);
    }
    
    forProduction() {
        return this
            .timeout(30000)
            .retries(3)
            .maxConnections(20)
            .enableSSL(true)
            .connectionPool({
                min: 2,
                max: 20,
                acquireTimeoutMillis: 60000
            });
    }
    
    forTesting() {
        return this
            .host('localhost')
            .port(5432)
            .database('test_db')
            .timeout(1000)
            .retries(0)
            .maxConnections(1)
            .enableSSL(false);
    }
    
    // Build method with validation
    build() {
        // Validate the configuration
        const errors = this.config.validate();
        if (errors.length > 0) {
            throw new Error(`Invalid configuration: ${errors.join(', ')}`);
        }
        
        // Mark as built and return immutable object
        this.config._markAsBuilt();
        return this.config;
    }
    
    // Build without validation (for testing)
    buildUnsafe() {
        this.config._markAsBuilt();
        return this.config;
    }
}

// Usage examples
console.log('\n=== Builder Pattern Demo ===');

// Basic usage with method chaining
const prodConfig = new DatabaseConfigBuilder()
    .host('prod-db.company.com')
    .port(5432)
    .database('production_app')
    .credentials('prod_user', 'secure_password_123')
    .forProduction()
    .build();

console.log('Production config:', prodConfig.toString());
console.log('SSL enabled:', prodConfig.ssl);
console.log('Connection pool:', prodConfig.connectionPool);

// Development configuration
const devConfig = new DatabaseConfigBuilder()
    .database('dev_app')
    .credentials('dev_user', 'dev_password')
    .forDevelopment()
    .build();

console.log('\nDevelopment config:', devConfig.toString());

// Testing configuration
const testConfig = new DatabaseConfigBuilder()
    .credentials('test_user', 'test_password')
    .forTesting()
    .build();

console.log('Test config:', testConfig.toString());

// Custom configuration
const customConfig = new DatabaseConfigBuilder()
    .host('custom-host.com')
    .port(3306)
    .database('custom_db')
    .credentials('custom_user', 'custom_pass')
    .enableSSL(true)
    .timeout(45000)
    .retries(5)
    .maxConnections(15)
    .connectionPool({
        min: 3,
        max: 15,
        acquireTimeoutMillis: 45000
    })
    .build();

console.log('Custom config:', customConfig.toString());

// Demonstrate validation
try {
    const invalidConfig = new DatabaseConfigBuilder()
        .host('') // Invalid empty host
        .build();
} catch (error) {
    console.log('\nValidation error caught:', error.message);
}

// Demonstrate immutability
try {
    prodConfig.host = 'hacker-host.com'; // This should fail
} catch (error) {
    console.log('Immutability enforced - cannot modify built config');
}
```

### Fluent Builder: Natural Language APIs

**Fluent Builders create APIs that read like natural language**, making complex object construction intuitive and expressive.

```javascript
// Fluent Builder for Query Construction
class QueryBuilder {
    constructor() {
        this.reset();
    }
    
    reset() {
        this._select = [];
        this._from = null;
        this._joins = [];
        this._where = [];
        this._groupBy = [];
        this._having = [];
        this._orderBy = [];
        this._limit = null;
        this._offset = null;
        this._parameters = {};
        return this;
    }
    
    // SELECT clauses
    select(...columns) {
        this._select.push(...columns);
        return this;
    }
    
    selectAll() {
        this._select = ['*'];
        return this;
    }
    
    selectCount(column = '*', alias = 'count') {
        this._select.push(`COUNT(${column}) AS ${alias}`);
        return this;
    }
    
    selectSum(column, alias = null) {
        const aliasClause = alias ? ` AS ${alias}` : '';
        this._select.push(`SUM(${column})${aliasClause}`);
        return this;
    }
    
    selectDistinct(...columns) {
        this._select.push(`DISTINCT ${columns.join(', ')}`);
        return this;
    }
    
    // FROM clauses
    from(table, alias = null) {
        this._from = alias ? `${table} AS ${alias}` : table;
        return this;
    }
    
    // JOIN clauses
    join(table, condition, type = 'INNER') {
        this._joins.push(`${type} JOIN ${table} ON ${condition}`);
        return this;
    }
    
    leftJoin(table, condition) {
        return this.join(table, condition, 'LEFT');
    }
    
    rightJoin(table, condition) {
        return this.join(table, condition, 'RIGHT');
    }
    
    innerJoin(table, condition) {
        return this.join(table, condition, 'INNER');
    }
    
    // WHERE clauses
    where(condition, parameters = {}) {
        this._where.push(condition);
        Object.assign(this._parameters, parameters);
        return this;
    }
    
    whereEquals(column, value) {
        const paramName = `param_${Object.keys(this._parameters).length}`;
        return this.where(`${column} = :${paramName}`, { [paramName]: value });
    }
    
    whereIn(column, values) {
        const paramNames = values.map((_, index) => `:in_${index}`);
        const params = {};
        values.forEach((value, index) => {
            params[`in_${index}`] = value;
        });
        return this.where(`${column} IN (${paramNames.join(', ')})`, params);
    }
    
    whereBetween(column, min, max) {
        const minParam = `min_${Object.keys(this._parameters).length}`;
        const maxParam = `max_${Object.keys(this._parameters).length}`;
        return this.where(
            `${column} BETWEEN :${minParam} AND :${maxParam}`,
            { [minParam]: min, [maxParam]: max }
        );
    }
    
    whereLike(column, pattern) {
        const paramName = `like_${Object.keys(this._parameters).length}`;
        return this.where(`${column} LIKE :${paramName}`, { [paramName]: pattern });
    }
    
    whereNull(column) {
        return this.where(`${column} IS NULL`);
    }
    
    whereNotNull(column) {
        return this.where(`${column} IS NOT NULL`);
    }
    
    and(condition, parameters = {}) {
        if (this._where.length > 0) {
            this._where.push(`AND ${condition}`);
        } else {
            this._where.push(condition);
        }
        Object.assign(this._parameters, parameters);
        return this;
    }
    
    or(condition, parameters = {}) {
        if (this._where.length > 0) {
            this._where.push(`OR ${condition}`);
        } else {
            this._where.push(condition);
        }
        Object.assign(this._parameters, parameters);
        return this;
    }
    
    // GROUP BY and HAVING
    groupBy(...columns) {
        this._groupBy.push(...columns);
        return this;
    }
    
    having(condition, parameters = {}) {
        this._having.push(condition);
        Object.assign(this._parameters, parameters);
        return this;
    }
    
    // ORDER BY
    orderBy(column, direction = 'ASC') {
        this._orderBy.push(`${column} ${direction.toUpperCase()}`);
        return this;
    }
    
    orderByAsc(column) {
        return this.orderBy(column, 'ASC');
    }
    
    orderByDesc(column) {
        return this.orderBy(column, 'DESC');
    }
    
    // LIMIT and OFFSET
    limit(count) {
        this._limit = count;
        return this;
    }
    
    offset(count) {
        this._offset = count;
        return this;
    }
    
    page(pageNumber, pageSize) {
        this._limit = pageSize;
        this._offset = (pageNumber - 1) * pageSize;
        return this;
    }
    
    // Build the SQL query
    toSQL() {
        const parts = [];
        
        // SELECT
        if (this._select.length === 0) {
            throw new Error('SELECT clause is required');
        }
        parts.push(`SELECT ${this._select.join(', ')}`);
        
        // FROM
        if (!this._from) {
            throw new Error('FROM clause is required');
        }
        parts.push(`FROM ${this._from}`);
        
        // JOIN
        if (this._joins.length > 0) {
            parts.push(...this._joins);
        }
        
        // WHERE
        if (this._where.length > 0) {
            parts.push(`WHERE ${this._where.join(' ')}`);
        }
        
        // GROUP BY
        if (this._groupBy.length > 0) {
            parts.push(`GROUP BY ${this._groupBy.join(', ')}`);
        }
        
        // HAVING
        if (this._having.length > 0) {
            parts.push(`HAVING ${this._having.join(' AND ')}`);
        }
        
        // ORDER BY
        if (this._orderBy.length > 0) {
            parts.push(`ORDER BY ${this._orderBy.join(', ')}`);
        }
        
        // LIMIT
        if (this._limit !== null) {
            parts.push(`LIMIT ${this._limit}`);
        }
        
        // OFFSET
        if (this._offset !== null) {
            parts.push(`OFFSET ${this._offset}`);
        }
        
        return parts.join(' ');
    }
    
    // Get parameters for prepared statements
    getParameters() {
        return { ...this._parameters };
    }
    
    // Execute the query (placeholder - would integrate with actual database)
    async execute(database) {
        const sql = this.toSQL();
        const parameters = this.getParameters();
        
        console.log('Executing SQL:', sql);
        console.log('Parameters:', parameters);
        
        // In real implementation, this would execute against actual database
        return { sql, parameters, rows: [] };
    }
    
    // Create a copy of the builder for reuse
    clone() {
        const cloned = new QueryBuilder();
        cloned._select = [...this._select];
        cloned._from = this._from;
        cloned._joins = [...this._joins];
        cloned._where = [...this._where];
        cloned._groupBy = [...this._groupBy];
        cloned._having = [...this._having];
        cloned._orderBy = [...this._orderBy];
        cloned._limit = this._limit;
        cloned._offset = this._offset;
        cloned._parameters = { ...this._parameters };
        return cloned;
    }
}

// Usage examples - reads like natural language
console.log('\n=== Fluent Builder Pattern Demo ===');

// Basic query
const simpleQuery = new QueryBuilder()
    .select('id', 'name', 'email')
    .from('users')
    .whereEquals('active', true)
    .orderByDesc('created_at')
    .limit(10);

console.log('Simple query:');
console.log(simpleQuery.toSQL());
console.log('Parameters:', simpleQuery.getParameters());

// Complex query with joins and conditions
const complexQuery = new QueryBuilder()
    .select('u.name', 'u.email', 'p.title AS profile_title', 'COUNT(o.id) AS order_count')
    .from('users', 'u')
    .leftJoin('profiles p', 'u.id = p.user_id')
    .leftJoin('orders o', 'u.id = o.user_id')
    .where('u.created_at >= :start_date', { start_date: '2023-01-01' })
    .and('u.status = :status', { status: 'active' })
    .whereIn('u.role', ['admin', 'moderator', 'user'])
    .groupBy('u.id', 'u.name', 'u.email', 'p.title')
    .having('COUNT(o.id) > :min_orders', { min_orders: 5 })
    .orderByDesc('order_count')
    .page(1, 20);

console.log('\nComplex query:');
console.log(complexQuery.toSQL());
console.log('Parameters:', complexQuery.getParameters());

// Reusable base query
const baseUserQuery = new QueryBuilder()
    .select('id', 'name', 'email', 'created_at')
    .from('users')
    .whereEquals('active', true);

// Create variations by cloning
const recentUsers = baseUserQuery.clone()
    .where('created_at >= :week_ago', { week_ago: '2023-12-01' })
    .orderByDesc('created_at')
    .limit(50);

const adminUsers = baseUserQuery.clone()
    .whereEquals('role', 'admin')
    .orderByAsc('name');

console.log('\nRecent users query:');
console.log(recentUsers.toSQL());

console.log('\nAdmin users query:');
console.log(adminUsers.toSQL());

// Demonstrate search functionality
const searchQuery = new QueryBuilder()
    .selectAll()
    .from('products')
    .whereLike('name', '%laptop%')
    .or('description LIKE :desc', { desc: '%computer%' })
    .whereBetween('price', 500, 2000)
    .whereNotNull('image_url')
    .orderByAsc('price')
    .limit(25);

console.log('\nSearch query:');
console.log(searchQuery.toSQL());
```

## Summary

### Core Concepts
- **Factory Pattern**: Encapsulates object creation logic and provides flexible instantiation
- **Builder Pattern**: Constructs complex objects step-by-step with validation and fluent interfaces  
- **Creational Patterns**: Abstract the instantiation process to make systems independent of object creation
- **Separation of Concerns**: Keep object creation separate from business logic

### Theoretical Foundation
- **Polymorphic Creation**: Factory methods enable creation based on runtime conditions
- **Complex Construction**: Builder pattern handles multi-step object assembly
- **Encapsulation**: Hide creation complexity behind simple, consistent interfaces
- **Immutability**: Builders often create immutable objects with guaranteed validity

### Pattern Variations
- **Simple Factory**: Centralized creation logic in static methods
- **Factory Method**: Polymorphic creation through inheritance
- **Abstract Factory**: Creating families of related objects
- **Fluent Builder**: Natural language APIs for expressive object construction

### When to Use These Patterns
- **Factory Pattern**: When creation logic is complex or needs to be extensible
- **Builder Pattern**: When objects have many optional parameters or complex validation
- **Object Families**: When you need consistent creation of related object sets
- **Configuration-Driven**: When object creation depends on runtime configuration

### Benefits
- **Flexibility**: Easy to add new types without modifying existing code
- **Maintainability**: Centralized creation logic is easier to modify and test
- **Consistency**: Ensure objects are properly initialized and validated
- **Readability**: Fluent interfaces make complex construction self-documenting

### My Personal Insight
Factory and Builder patterns taught me that **object creation is often as important as the objects themselves**. Before understanding these patterns, my constructors were bloated with complex logic and my code was tightly coupled to specific implementations.

The key breakthrough was realizing that **good design isn't just about the objects you create - it's about how you create them**. These patterns enabled me to build systems that are flexible, extensible, and maintainable.

**Builder pattern especially changed how I think about APIs** - the fluent interface approach makes complex operations feel natural and self-documenting. It's like providing a domain-specific language for object construction.

### Next Up
Now that you've mastered object creation patterns, we'll explore **Strategy Pattern & State Pattern** - behavioral patterns that enable flexible algorithms and state-dependent behavior in your applications.

Remember: Creation patterns aren't just about making objects - they're about building flexible, maintainable systems that can evolve with changing requirements! 🚀✨
