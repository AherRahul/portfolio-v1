---
title: Module Pattern & Namespace Management
description: Learn classical design patterns for organizing code into reusable
  modules. Master techniques for creating clean namespaces and avoiding global
  scope pollution in large applications.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: JavaScript Design Patterns
    type: book
    url: https://addyosmani.com/resources/essentialjsdesignpatterns/book/
    description: Comprehensive guide to JavaScript design patterns
  - title: MDN - Modules
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
    description: Modern module system in JavaScript
  - title: Module Pattern Examples
    type: article
    url: https://coryrylan.com/blog/javascript-module-pattern-basics
    description: Practical examples of the module pattern
  - title: Namespace Patterns
    type: article
    url: https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/
    description: Effective namespacing strategies
published: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811628/Portfolio/javaScriptCourse/images/all%20title%20images/37_wk5qdw.png)

Module Pattern & Namespace Management – Organizing Code Architecture
=====================================================================

Imagine you're designing a **sophisticated corporate office building** 🏢 where every department needs to work efficiently while maintaining clear boundaries:

- **Department Isolation** 🚪 - Each department (HR, Finance, Engineering) has its own secure space with controlled access
- **Shared Resources** 📚 - Common areas like meeting rooms, libraries, and cafeterias that departments can access when needed
- **Clear Hierarchies** 🏗️ - Organizational structure with floors, wings, and departments that everyone understands
- **Communication Protocols** 📞 - Standardized ways for departments to collaborate without interfering with each other
- **Resource Management** 💼 - Efficient sharing of tools, equipment, and utilities across the organization
- **Security Boundaries** 🔐 - Sensitive information stays within appropriate departments while allowing necessary collaboration

**The Module Pattern and Namespace Management work exactly like this well-organized office building.** They provide:

- **Encapsulation** - Private variables and functions that can't be accidentally accessed
- **Public APIs** - Carefully designed interfaces for external interaction
- **Namespace Organization** - Hierarchical structure to prevent naming conflicts
- **Dependency Management** - Clear relationships between different code modules
- **Global Scope Protection** - Preventing pollution of the global namespace
- **Scalable Architecture** - Structure that grows cleanly as applications expand

Understanding these patterns is essential for building maintainable, scalable JavaScript applications. They form the foundation of modern JavaScript architecture and are the precursors to ES6 modules.

## The Theoretical Foundation: Encapsulation and Information Hiding 📐

### Understanding Encapsulation Theory

**Encapsulation is one of the four fundamental principles of object-oriented programming** (along with inheritance, polymorphism, and abstraction). It's the practice of bundling data and methods that operate on that data into a single unit, while hiding the internal implementation details.

**Core Encapsulation Concepts:**

1. **Information Hiding**: Internal state is not accessible from outside the module
2. **Interface Design**: Only expose what clients need to use
3. **Implementation Independence**: Internal changes don't affect external code
4. **State Protection**: Prevent invalid state modifications from external code

**Why Encapsulation Matters:**
- **Reliability**: Prevents accidental corruption of internal state
- **Maintainability**: Changes to implementation don't break external code
- **Testing**: Clear interfaces make unit testing straightforward
- **Complexity Management**: Hide complex implementation behind simple interfaces

### The Computer Science of Namespaces

**Namespaces solve the "name collision" problem** in computer science - ensuring that identifiers (variable names, function names) don't accidentally conflict when combining code from different sources.

**Namespace Theory:**
- **Scope Resolution**: How programming languages determine which identifier to use
- **Hierarchical Organization**: Tree-like structure for organizing related functionality
- **Name Binding**: Association between names and their definitions
- **Lexical Scoping**: Scope determined by where variables are declared in code

### Design Pattern Theory: Module Pattern

**The Module Pattern implements several fundamental design patterns:**

1. **Facade Pattern**: Provides simplified interface to complex subsystem
2. **Factory Pattern**: Creates objects without exposing instantiation logic
3. **Singleton Pattern**: Ensures only one instance of a module exists
4. **Template Method**: Defines skeleton of algorithm in base structure

### Closure Theory and Lexical Scoping

**The Module Pattern relies on JavaScript's closure mechanism** - one of the most powerful features in functional programming.

**Closure Concepts:**
- **Lexical Environment**: Variables available in the scope where function was defined
- **Variable Capture**: Functions "remember" variables from their creation context
- **Lifetime Extension**: Variables live longer than their original scope
- **Memory Management**: Closures keep references to captured variables

Understanding closures is crucial for understanding how the Module Pattern achieves true privacy in JavaScript.

## The Global Scope Problem 😱

### Why Global Scope is Dangerous 💣

```javascript
// The nightmare of global scope pollution
var userName = "Alice";
var isLoggedIn = false;
var userPreferences = {};
var currentPage = "home";
var ajaxRequests = [];
var utilityFunctions = {};

// Another developer adds more globals
var userName = "Bob"; // Oops! Overwrote the previous value
var API_URL = "https://api.example.com";
var cache = {};
var helpers = {};

// Third-party library adds even more
var $ = function() { /* jQuery-like library */ };
var _ = function() { /* Lodash-like library */ };
var moment = function() { /* Date library */ };

// Your code breaks because variables were overwritten
console.log(userName); // "Bob" instead of "Alice"!

// Even worse: accidental global creation
function calculateTotal(items) {
    // Forgot 'var', 'let', or 'const' - creates global!
    total = 0;
    for (item of items) {
        total += item.price;
    }
    return total;
}

calculateTotal([{price: 10}, {price: 20}]);
console.log(window.total); // 30 - global pollution!

// Problems this creates:
// 1. Name collisions between different parts of code
// 2. Accidental overwrites of important variables
// 3. Memory leaks from variables that can't be garbage collected
// 4. Testing difficulties due to global state
// 5. Code coupling - everything depends on global state
// 6. Deployment issues when combining multiple scripts

// Debugging nightmare - where did this variable come from?
function debugGlobalScope() {
    console.log('Global variables:', Object.keys(window));
    // Returns hundreds of properties including your accidental globals
}
```

### Traditional Solutions and Their Limitations 🔧

```javascript
// Solution 1: Immediate Function wrapper (IIFE)
(function() {
    var userName = "Alice";
    var isLoggedIn = false;
    
    function login(username) {
        userName = username;
        isLoggedIn = true;
    }
    
    // Problem: No way to access these from outside!
    // login() is not accessible globally
})();

// Solution 2: Simple namespace object
var MyApp = {
    userName: "Alice",
    isLoggedIn: false,
    
    login: function(username) {
        this.userName = username;
        this.isLoggedIn = true;
    }
};

// Problems with simple namespace:
// 1. All properties are public (no real encapsulation)
MyApp.userName = "Hacker"; // Anyone can modify this!

// 2. Internal implementation is exposed
console.log(MyApp.userName); // Can access internal state

// 3. No way to have truly private variables or methods

// Solution 3: Constructor pattern
function User(name) {
    this.name = name;
    this.isLoggedIn = false;
}

User.prototype.login = function() {
    this.isLoggedIn = true;
};

var user = new User("Alice");

// Problems:
// 1. Still exposes all properties
user.name = "Hacker"; // Still modifiable

// 2. Prototype pollution possible
User.prototype.hack = function() { /* malicious code */ };

// 3. No shared private state between instances
```

## The Module Pattern: True Encapsulation 🏛️

### Classic Module Pattern Implementation 💎

```javascript
// The Module Pattern: Encapsulation with Public API
var UserModule = (function() {
    // Private variables - truly private!
    var users = [];
    var currentUser = null;
    var sessionTimeout = 30 * 60 * 1000; // 30 minutes
    var lastActivity = Date.now();
    
    // Private methods - internal implementation
    function validateUser(username, password) {
        return users.find(user => 
            user.username === username && user.password === password
        );
    }
    
    function hashPassword(password) {
        // Simple hash for demo (use proper hashing in production)
        return btoa(password + 'salt');
    }
    
    function updateLastActivity() {
        lastActivity = Date.now();
    }
    
    function isSessionValid() {
        return (Date.now() - lastActivity) < sessionTimeout;
    }
    
    function logActivity(action) {
        console.log(`[${new Date().toISOString()}] ${action}`);
    }
    
    // Public API - only these are accessible from outside
    return {
        // User registration
        register: function(username, email, password) {
            if (!username || !email || !password) {
                throw new Error('All fields are required');
            }
            
            // Check if user already exists
            if (users.find(user => user.username === username)) {
                throw new Error('Username already exists');
            }
            
            var newUser = {
                id: users.length + 1,
                username: username,
                email: email,
                password: hashPassword(password),
                createdAt: new Date(),
                isActive: true
            };
            
            users.push(newUser);
            logActivity(`User registered: ${username}`);
            
            return {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }; // Return safe object without password
        },
        
        // User login
        login: function(username, password) {
            var user = validateUser(username, hashPassword(password));
            
            if (!user) {
                logActivity(`Failed login attempt: ${username}`);
                throw new Error('Invalid credentials');
            }
            
            if (!user.isActive) {
                throw new Error('Account is disabled');
            }
            
            currentUser = user;
            updateLastActivity();
            logActivity(`User logged in: ${username}`);
            
            return {
                id: user.id,
                username: user.username,
                email: user.email
            };
        },
        
        // User logout
        logout: function() {
            if (currentUser) {
                logActivity(`User logged out: ${currentUser.username}`);
                currentUser = null;
            }
        },
        
        // Get current user
        getCurrentUser: function() {
            if (!currentUser || !isSessionValid()) {
                if (currentUser) {
                    logActivity(`Session expired for: ${currentUser.username}`);
                    currentUser = null;
                }
                return null;
            }
            
            updateLastActivity();
            return {
                id: currentUser.id,
                username: currentUser.username,
                email: currentUser.email
            };
        },
        
        // Check if user is logged in
        isLoggedIn: function() {
            return this.getCurrentUser() !== null;
        },
        
        // Update session timeout
        setSessionTimeout: function(minutes) {
            sessionTimeout = minutes * 60 * 1000;
            logActivity(`Session timeout updated: ${minutes} minutes`);
        },
        
        // Get user count (public statistic)
        getUserCount: function() {
            return users.length;
        }
    };
})();

// Usage examples - clean public API
try {
    // Register users
    UserModule.register('alice', 'alice@example.com', 'password123');
    UserModule.register('bob', 'bob@example.com', 'password456');
    
    console.log('Total users:', UserModule.getUserCount());
    
    // Login
    var user = UserModule.login('alice', 'password123');
    console.log('Logged in user:', user);
    
    // Check current user
    console.log('Current user:', UserModule.getCurrentUser());
    console.log('Is logged in:', UserModule.isLoggedIn());
    
    // Try to access private data (impossible!)
    console.log('Private users array:', UserModule.users); // undefined!
    console.log('Private currentUser:', UserModule.currentUser); // undefined!
    
    // Logout
    UserModule.logout();
    console.log('After logout:', UserModule.getCurrentUser()); // null
    
} catch (error) {
    console.error('Error:', error.message);
}
```

### Advanced Module Pattern Variations 🎨

```javascript
// Revealing Module Pattern - more explicit public API
var CalculatorModule = (function() {
    // Private state
    var history = [];
    var currentValue = 0;
    var precision = 2;
    
    // Private methods
    function round(value) {
        return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    
    function addToHistory(operation, operand, result) {
        history.push({
            operation: operation,
            operand: operand,
            result: result,
            timestamp: new Date()
        });
        
        // Keep only last 100 operations
        if (history.length > 100) {
            history.shift();
        }
    }
    
    function validateNumber(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error('Invalid number');
        }
    }
    
    // Public methods (but defined as private functions)
    function add(value) {
        validateNumber(value);
        var result = round(currentValue + value);
        addToHistory('add', value, result);
        currentValue = result;
        return result;
    }
    
    function subtract(value) {
        validateNumber(value);
        var result = round(currentValue - value);
        addToHistory('subtract', value, result);
        currentValue = result;
        return result;
    }
    
    function multiply(value) {
        validateNumber(value);
        var result = round(currentValue * value);
        addToHistory('multiply', value, result);
        currentValue = result;
        return result;
    }
    
    function divide(value) {
        validateNumber(value);
        if (value === 0) {
            throw new Error('Division by zero');
        }
        var result = round(currentValue / value);
        addToHistory('divide', value, result);
        currentValue = result;
        return result;
    }
    
    function getValue() {
        return currentValue;
    }
    
    function setValue(value) {
        validateNumber(value);
        var oldValue = currentValue;
        currentValue = round(value);
        addToHistory('setValue', value, currentValue);
        return currentValue;
    }
    
    function clear() {
        currentValue = 0;
        addToHistory('clear', null, 0);
        return 0;
    }
    
    function getHistory() {
        return [...history]; // Return copy to prevent external modification
    }
    
    function clearHistory() {
        history = [];
    }
    
    function setPrecision(digits) {
        if (typeof digits !== 'number' || digits < 0 || digits > 10) {
            throw new Error('Precision must be between 0 and 10');
        }
        precision = digits;
    }
    
    // Reveal public API - very explicit about what's public
    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide,
        getValue: getValue,
        setValue: setValue,
        clear: clear,
        getHistory: getHistory,
        clearHistory: clearHistory,
        setPrecision: setPrecision
    };
})();

// Usage
CalculatorModule.setValue(10);
CalculatorModule.add(5);
CalculatorModule.multiply(2);
console.log('Result:', CalculatorModule.getValue()); // 30

console.log('History:', CalculatorModule.getHistory());

CalculatorModule.setPrecision(4);
CalculatorModule.divide(3);
console.log('Result with precision:', CalculatorModule.getValue()); // 10.0000
```

### Module Pattern with Configuration 🔧

```javascript
// Configurable Module Pattern
function createAPIModule(config) {
    // Default configuration
    var defaultConfig = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
        retries: 3,
        apiKey: null,
        version: 'v1'
    };
    
    // Merge configuration
    var settings = Object.assign({}, defaultConfig, config);
    
    // Private state
    var requestCache = new Map();
    var requestHistory = [];
    var isOnline = navigator.onLine;
    
    // Private methods
    function buildURL(endpoint) {
        return `${settings.baseURL}/${settings.version}/${endpoint}`;
    }
    
    function getHeaders() {
        var headers = {
            'Content-Type': 'application/json'
        };
        
        if (settings.apiKey) {
            headers['Authorization'] = `Bearer ${settings.apiKey}`;
        }
        
        return headers;
    }
    
    function logRequest(method, endpoint, success) {
        requestHistory.push({
            method: method,
            endpoint: endpoint,
            success: success,
            timestamp: new Date(),
            online: isOnline
        });
        
        // Keep only last 50 requests
        if (requestHistory.length > 50) {
            requestHistory.shift();
        }
    }
    
    async function makeRequest(method, endpoint, data, useCache) {
        var cacheKey = `${method}:${endpoint}:${JSON.stringify(data)}`;
        
        // Check cache for GET requests
        if (method === 'GET' && useCache && requestCache.has(cacheKey)) {
            var cached = requestCache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) { // 5 minutes
                return cached.data;
            }
        }
        
        try {
            var response = await fetch(buildURL(endpoint), {
                method: method,
                headers: getHeaders(),
                body: data ? JSON.stringify(data) : undefined,
                timeout: settings.timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            var result = await response.json();
            
            // Cache successful GET requests
            if (method === 'GET' && useCache) {
                requestCache.set(cacheKey, {
                    data: result,
                    timestamp: Date.now()
                });
            }
            
            logRequest(method, endpoint, true);
            return result;
            
        } catch (error) {
            logRequest(method, endpoint, false);
            throw error;
        }
    }
    
    // Monitor online status
    window.addEventListener('online', function() {
        isOnline = true;
    });
    
    window.addEventListener('offline', function() {
        isOnline = false;
    });
    
    // Public API
    return {
        // HTTP methods
        get: function(endpoint, useCache = true) {
            return makeRequest('GET', endpoint, null, useCache);
        },
        
        post: function(endpoint, data) {
            return makeRequest('POST', endpoint, data, false);
        },
        
        put: function(endpoint, data) {
            return makeRequest('PUT', endpoint, data, false);
        },
        
        delete: function(endpoint) {
            return makeRequest('DELETE', endpoint, null, false);
        },
        
        // Configuration
        updateConfig: function(newConfig) {
            Object.assign(settings, newConfig);
        },
        
        getConfig: function() {
            return Object.assign({}, settings); // Return copy
        },
        
        // Cache management
        clearCache: function() {
            requestCache.clear();
        },
        
        getCacheSize: function() {
            return requestCache.size;
        },
        
        // Request history
        getRequestHistory: function() {
            return [...requestHistory]; // Return copy
        },
        
        clearHistory: function() {
            requestHistory = [];
        },
        
        // Status
        isOnline: function() {
            return isOnline;
        },
        
        getStats: function() {
            var total = requestHistory.length;
            var successful = requestHistory.filter(req => req.success).length;
            
            return {
                totalRequests: total,
                successfulRequests: successful,
                successRate: total > 0 ? (successful / total) * 100 : 0,
                cacheSize: requestCache.size,
                isOnline: isOnline
            };
        }
    };
}

// Create configured API modules
var mainAPI = createAPIModule({
    baseURL: 'https://api.myapp.com',
    apiKey: 'your-api-key-here',
    timeout: 10000
});

var analyticsAPI = createAPIModule({
    baseURL: 'https://analytics.myapp.com',
    version: 'v2',
    timeout: 3000
});

// Usage
mainAPI.get('users').then(users => {
    console.log('Users:', users);
    console.log('API Stats:', mainAPI.getStats());
}).catch(error => {
    console.error('API Error:', error);
});
```

## Namespace Management Strategies 🏗️

### Hierarchical Namespace Organization 📚

```javascript
// Global namespace object
var MyApplication = MyApplication || {};

// Namespace creation utility
MyApplication.namespace = function(namespaceString) {
    var parts = namespaceString.split('.');
    var parent = MyApplication;
    
    // Remove global app name if included
    if (parts[0] === 'MyApplication') {
        parts = parts.slice(1);
    }
    
    for (var i = 0; i < parts.length; i++) {
        // Create property if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    
    return parent;
};

// Create hierarchical namespaces
MyApplication.namespace('UI.Components.Forms');
MyApplication.namespace('Data.Services.User');
MyApplication.namespace('Utils.Validation');
MyApplication.namespace('Config.Environment');

// Now populate the namespaces
MyApplication.UI.Components.Forms.InputField = (function() {
    // Private variables
    var defaultOptions = {
        type: 'text',
        required: false,
        placeholder: '',
        validation: null
    };
    
    // Constructor function
    function InputField(container, options) {
        this.container = container;
        this.options = Object.assign({}, defaultOptions, options);
        this.element = null;
        this.isValid = true;
        this.errorMessage = '';
        
        this.init();
    }
    
    // Private methods
    function validateInput(value, validation) {
        if (!validation) return { isValid: true };
        
        if (typeof validation === 'function') {
            return validation(value);
        }
        
        if (validation.required && !value.trim()) {
            return { isValid: false, message: 'This field is required' };
        }
        
        if (validation.minLength && value.length < validation.minLength) {
            return { isValid: false, message: `Minimum length is ${validation.minLength}` };
        }
        
        if (validation.pattern && !validation.pattern.test(value)) {
            return { isValid: false, message: validation.message || 'Invalid format' };
        }
        
        return { isValid: true };
    }
    
    // Public methods
    InputField.prototype.init = function() {
        this.createElement();
        this.attachEvents();
    };
    
    InputField.prototype.createElement = function() {
        this.element = document.createElement('input');
        this.element.type = this.options.type;
        this.element.placeholder = this.options.placeholder;
        this.element.required = this.options.required;
        
        this.container.appendChild(this.element);
    };
    
    InputField.prototype.attachEvents = function() {
        var self = this;
        
        this.element.addEventListener('blur', function() {
            self.validate();
        });
        
        this.element.addEventListener('input', function() {
            self.clearError();
        });
    };
    
    InputField.prototype.validate = function() {
        var result = validateInput(this.element.value, this.options.validation);
        this.isValid = result.isValid;
        this.errorMessage = result.message || '';
        
        if (!this.isValid) {
            this.showError(this.errorMessage);
        }
        
        return this.isValid;
    };
    
    InputField.prototype.showError = function(message) {
        this.element.classList.add('error');
        
        var errorElement = this.container.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            this.container.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    };
    
    InputField.prototype.clearError = function() {
        this.element.classList.remove('error');
        var errorElement = this.container.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    };
    
    InputField.prototype.getValue = function() {
        return this.element.value;
    };
    
    InputField.prototype.setValue = function(value) {
        this.element.value = value;
    };
    
    return InputField;
})();

// User service
MyApplication.Data.Services.User = (function() {
    var users = [];
    var currentUser = null;
    
    return {
        create: function(userData) {
            var user = Object.assign({
                id: Date.now(),
                createdAt: new Date()
            }, userData);
            
            users.push(user);
            return user;
        },
        
        findById: function(id) {
            return users.find(user => user.id === id);
        },
        
        findByEmail: function(email) {
            return users.find(user => user.email === email);
        },
        
        getAll: function() {
            return [...users];
        },
        
        setCurrentUser: function(user) {
            currentUser = user;
        },
        
        getCurrentUser: function() {
            return currentUser;
        }
    };
})();

// Validation utilities
MyApplication.Utils.Validation = (function() {
    return {
        email: function(email) {
            var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return {
                isValid: pattern.test(email),
                message: 'Please enter a valid email address'
            };
        },
        
        password: function(password) {
            if (password.length < 8) {
                return {
                    isValid: false,
                    message: 'Password must be at least 8 characters long'
                };
            }
            
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                return {
                    isValid: false,
                    message: 'Password must contain uppercase, lowercase, and number'
                };
            }
            
            return { isValid: true };
        },
        
        required: function(value) {
            return {
                isValid: value && value.trim().length > 0,
                message: 'This field is required'
            };
        }
    };
})();

// Usage of hierarchical namespaces
document.addEventListener('DOMContentLoaded', function() {
    var emailContainer = document.getElementById('email-container');
    var passwordContainer = document.getElementById('password-container');
    
    // Create form fields using namespaced components
    var emailField = new MyApplication.UI.Components.Forms.InputField(emailContainer, {
        type: 'email',
        placeholder: 'Enter your email',
        required: true,
        validation: MyApplication.Utils.Validation.email
    });
    
    var passwordField = new MyApplication.UI.Components.Forms.InputField(passwordContainer, {
        type: 'password',
        placeholder: 'Enter your password',
        required: true,
        validation: MyApplication.Utils.Validation.password
    });
    
    // Use user service
    var userService = MyApplication.Data.Services.User;
    
    console.log('Application namespaces loaded:');
    console.log('UI Components:', Object.keys(MyApplication.UI.Components));
    console.log('Data Services:', Object.keys(MyApplication.Data.Services));
    console.log('Utilities:', Object.keys(MyApplication.Utils));
});
```

### Modern Namespace Alternatives 🚀

```javascript
// ES6 Modules approach (modern alternative)
/*
// userService.js
export const UserService = (function() {
    // Private implementation
    let users = [];
    
    return {
        create(userData) {
            // Implementation
        },
        
        findById(id) {
            // Implementation
        }
    };
})();

// inputField.js
export class InputField {
    constructor(container, options) {
        // Implementation
    }
    
    validate() {
        // Implementation
    }
}

// main.js
import { UserService } from './userService.js';
import { InputField } from './inputField.js';
*/

// Namespace factory pattern
function createNamespace(name, dependencies = []) {
    var namespace = {
        name: name,
        modules: {},
        dependencies: dependencies,
        isInitialized: false
    };
    
    namespace.define = function(moduleName, factory) {
        if (this.modules[moduleName]) {
            throw new Error(`Module ${moduleName} already defined`);
        }
        
        this.modules[moduleName] = {
            factory: factory,
            instance: null,
            isLoaded: false
        };
        
        return this;
    };
    
    namespace.get = function(moduleName) {
        var module = this.modules[moduleName];
        if (!module) {
            throw new Error(`Module ${moduleName} not found`);
        }
        
        if (!module.instance) {
            // Lazy instantiation
            module.instance = module.factory();
            module.isLoaded = true;
        }
        
        return module.instance;
    };
    
    namespace.has = function(moduleName) {
        return !!this.modules[moduleName];
    };
    
    namespace.init = function() {
        if (this.isInitialized) {
            return this;
        }
        
        // Initialize all dependencies first
        this.dependencies.forEach(dep => {
            if (typeof dep.init === 'function') {
                dep.init();
            }
        });
        
        this.isInitialized = true;
        return this;
    };
    
    namespace.getLoadedModules = function() {
        return Object.keys(this.modules).filter(name => 
            this.modules[name].isLoaded
        );
    };
    
    return namespace;
}

// Create application namespaces
var AppCore = createNamespace('AppCore');
var AppUI = createNamespace('AppUI', [AppCore]);
var AppData = createNamespace('AppData', [AppCore]);

// Define core utilities
AppCore.define('EventEmitter', function() {
    return (function() {
        var events = {};
        
        return {
            on: function(event, callback) {
                if (!events[event]) events[event] = [];
                events[event].push(callback);
            },
            
            emit: function(event, data) {
                if (events[event]) {
                    events[event].forEach(callback => callback(data));
                }
            },
            
            off: function(event, callback) {
                if (events[event]) {
                    var index = events[event].indexOf(callback);
                    if (index > -1) {
                        events[event].splice(index, 1);
                    }
                }
            }
        };
    })();
});

AppCore.define('Logger', function() {
    return (function() {
        var logs = [];
        var logLevel = 'info';
        
        function formatMessage(level, message) {
            return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
        }
        
        return {
            setLevel: function(level) {
                logLevel = level;
            },
            
            debug: function(message) {
                if (logLevel === 'debug') {
                    console.log(formatMessage('debug', message));
                    logs.push({ level: 'debug', message: message, timestamp: new Date() });
                }
            },
            
            info: function(message) {
                console.log(formatMessage('info', message));
                logs.push({ level: 'info', message: message, timestamp: new Date() });
            },
            
            warn: function(message) {
                console.warn(formatMessage('warn', message));
                logs.push({ level: 'warn', message: message, timestamp: new Date() });
            },
            
            error: function(message) {
                console.error(formatMessage('error', message));
                logs.push({ level: 'error', message: message, timestamp: new Date() });
            },
            
            getLogs: function() {
                return [...logs];
            }
        };
    })();
});

// Define UI modules
AppUI.define('Modal', function() {
    var eventEmitter = AppCore.get('EventEmitter');
    var logger = AppCore.get('Logger');
    
    return (function() {
        var activeModals = [];
        
        function Modal(content, options) {
            this.content = content;
            this.options = Object.assign({
                closable: true,
                backdrop: true,
                size: 'medium'
            }, options);
            this.element = null;
            this.isVisible = false;
        }
        
        Modal.prototype.show = function() {
            this.createElement();
            document.body.appendChild(this.element);
            this.isVisible = true;
            activeModals.push(this);
            
            eventEmitter.emit('modal:shown', { modal: this });
            logger.info('Modal shown');
        };
        
        Modal.prototype.hide = function() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            this.isVisible = false;
            
            var index = activeModals.indexOf(this);
            if (index > -1) {
                activeModals.splice(index, 1);
            }
            
            eventEmitter.emit('modal:hidden', { modal: this });
            logger.info('Modal hidden');
        };
        
        Modal.prototype.createElement = function() {
            this.element = document.createElement('div');
            this.element.className = `modal modal-${this.options.size}`;
            this.element.innerHTML = this.content;
            
            if (this.options.closable) {
                var closeBtn = document.createElement('button');
                closeBtn.textContent = '×';
                closeBtn.className = 'modal-close';
                closeBtn.onclick = () => this.hide();
                this.element.appendChild(closeBtn);
            }
        };
        
        // Static methods
        Modal.getActiveModals = function() {
            return [...activeModals];
        };
        
        Modal.closeAll = function() {
            activeModals.forEach(modal => modal.hide());
        };
        
        return Modal;
    })();
});

// Initialize and use
AppCore.init();
AppUI.init();

var logger = AppCore.get('Logger');
var Modal = AppUI.get('Modal');

logger.info('Application modules loaded');

var modal = new Modal('<h2>Hello World!</h2><p>This is a modal.</p>');
// modal.show();

console.log('Loaded Core modules:', AppCore.getLoadedModules());
console.log('Loaded UI modules:', AppUI.getLoadedModules());
```

## Summary

### Core Concepts
- **Module Pattern:** Encapsulation with private variables and public APIs
- **Namespace Management:** Hierarchical organization to prevent naming conflicts
- **IIFE (Immediately Invoked Function Expression):** Foundation for module privacy
- **Revealing Module Pattern:** Explicit definition of public interfaces

### Key Benefits
- **True Encapsulation:** Private variables and methods that cannot be accessed externally
- **Clean APIs:** Well-defined public interfaces for module interaction
- **Global Scope Protection:** Prevention of namespace pollution
- **Dependency Management:** Clear module relationships and dependencies

### Advanced Patterns
- **Configurable Modules:** Modules that accept configuration parameters
- **Namespace Factories:** Dynamic namespace creation and management
- **Lazy Loading:** Modules instantiated only when first accessed
- **Event-Driven Architecture:** Modules communicating through events

### Best Practices
- **Single Responsibility:** Each module should have one clear purpose
- **Minimal Public API:** Expose only what's necessary for external use
- **Documentation:** Clear documentation of public interfaces
- **Testing:** Design modules for easy unit testing
- **Performance:** Consider memory usage and initialization costs

### Modern Evolution
- **ES6 Modules:** Native module system replacing classical patterns
- **Module Bundlers:** Tools like Webpack managing module dependencies
- **Tree Shaking:** Eliminating unused code in production builds
- **Dynamic Imports:** Loading modules on demand for performance

### When to Use Module Pattern
- **Legacy Environments:** When ES6 modules aren't available
- **Library Development:** Creating reusable libraries with clean APIs
- **Large Applications:** Organizing complex codebases with clear boundaries
- **Configuration Modules:** Creating configurable, reusable components

### My Personal Insight
The Module Pattern was my first introduction to **real software architecture** in JavaScript. Before understanding it, my code was a chaotic mix of global variables and functions. The pattern taught me that **good code isn't just about functionality - it's about organization, encapsulation, and intentional design**.

The key insight that transformed my development approach: **The way you organize your code is as important as the code itself**. Well-structured modules make applications scalable, maintainable, and pleasurable to work with.

While ES6 modules have largely replaced classical patterns, understanding the Module Pattern remains crucial for **appreciating the evolution of JavaScript architecture** and working with legacy codebases.

### Next Up
Now that you've mastered code organization with modules, we'll explore **Observer Pattern & Event Systems** - the foundation for building reactive, event-driven applications where components communicate through loose coupling.

Remember: The Module Pattern isn't just about hiding variables - it's about creating clean, maintainable, and scalable code architecture! 🚀✨
