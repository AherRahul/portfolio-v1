---
title: "Web Storage & IndexedDB"
description: "Explore client-side storage options from simple localStorage to powerful IndexedDB. Learn when to use each storage method and how to build offline-capable applications."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
  - storage
resources:
  - title: "MDN - Web Storage API"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API"
    description: "Complete guide to localStorage and sessionStorage"
  - title: "MDN - IndexedDB API"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
    description: "Comprehensive IndexedDB reference and tutorials"
  - title: "Storage Quotas and Eviction"
    type: "article"
    url: "https://web.dev/storage-for-the-web/"
    description: "Understanding browser storage limits and management"
  - title: "Offline-First Applications"
    type: "article"
    url: "https://web.dev/offline-cookbook/"
    description: "Patterns for building robust offline experiences"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811625/Portfolio/javaScriptCourse/images/all%20title%20images/35_rcxzgq.png)

Web Storage & IndexedDB – Building Offline-Capable Applications
===============================================================

Imagine you're designing a **sophisticated personal vault system** 🏦 for storing valuables in your home:

- **Quick Access Safe** 🗝️ - A small, fast safe by your desk for items you need frequently (keys, wallet, phone)
- **Session Safe** 📦 - A temporary storage box that automatically empties when you leave the house
- **Master Vault** 🏛️ - A large, secure vault in your basement that can store vast amounts of organized treasures, documents, and collections
- **Offline Access** 🔌 - All storage works even when the power is out or internet is down
- **Smart Organization** 📚 - Advanced cataloging system with search, indexing, and relationships between items
- **Automatic Backup** ♻️ - Intelligent sync when connectivity returns

**Web storage technologies work exactly like this sophisticated vault system.** They provide different storage solutions for different needs:

- **localStorage** - The quick access safe for persistent, frequently used data
- **sessionStorage** - The session safe for temporary data that clears when the tab closes  
- **IndexedDB** - The master vault for large amounts of structured data with advanced querying
- **Offline functionality** - All work without network connectivity
- **Smart data management** - Powerful APIs for organizing, searching, and manipulating data
- **Progressive enhancement** - Graceful fallbacks and intelligent sync strategies

Understanding client-side storage is essential for building modern web applications that work reliably offline, provide instant user experiences, and handle large amounts of local data efficiently.

## The Theoretical Foundation: Storage Architecture and Data Persistence 📐

### Understanding Data Persistence Models

**Client-side storage implements different persistence models** based on computer science principles:

1. **Volatile Storage**: Data exists only in memory (variables, session state)
2. **Session Persistence**: Data survives page reloads but not browser closure
3. **Local Persistence**: Data survives browser restarts but may be evicted
4. **Permanent Persistence**: Data guaranteed to persist (requires user permission)

**Storage Hierarchy Theory:**
Like computer memory hierarchy (registers → cache → RAM → disk), web storage has layers:
- **JavaScript Variables**: Fastest access, lost on page reload
- **sessionStorage**: Tab-scoped, lost on tab close
- **localStorage**: Origin-scoped, persistent across sessions
- **IndexedDB**: Structured, large-scale, transactional storage

### Database Theory in the Browser

**IndexedDB implements fundamental database concepts:**

1. **ACID Properties**: 
   - **Atomicity**: Transactions either complete fully or not at all
   - **Consistency**: Database remains in valid state after transactions
   - **Isolation**: Concurrent transactions don't interfere
   - **Durability**: Committed changes persist even after browser crashes

2. **Indexing Theory**: B-tree indexes for fast key-based lookups
3. **Query Optimization**: Cursor-based iteration for large datasets
4. **Concurrency Control**: Multiple tabs can access same database safely

### Storage Quota Management

**Browser storage implements resource management principles:**

**Quota Systems**: Prevent any single origin from consuming all storage
- **Temporary Storage**: Subject to eviction under storage pressure
- **Persistent Storage**: Protected from eviction (with user permission)
- **Usage Monitoring**: Browsers track storage consumption per origin

**Eviction Policies**: Based on operating system memory management
- **LRU (Least Recently Used)**: Remove oldest unused data first
- **Storage Pressure**: Evict when device storage is low
- **Origin Prioritization**: Protect storage for frequently used sites

### Offline-First Architecture Theory

**Client-side storage enables "offline-first" architecture:**

1. **Cache-First Strategy**: Check local storage before network
2. **Background Sync**: Update local data when connectivity returns
3. **Conflict Resolution**: Merge changes when local and server data differ
4. **Progressive Enhancement**: Application works offline, enhanced online

This represents a fundamental shift from "online-first" to "offline-first" thinking.

## The Storage Landscape: From Cookies to IndexedDB 📊

### Evolution of Client-Side Storage 📈

```javascript
// The progression of web storage solutions

// 1. Cookies (1994) - Limited and sent with every request
document.cookie = "username=alice; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/";

// Problems with cookies:
// - Only 4KB of storage
// - Sent with every HTTP request (performance impact)
// - Complex API for manipulation
// - Security concerns with XSS

// 2. Web Storage (2009) - localStorage and sessionStorage
localStorage.setItem('user', JSON.stringify({ name: 'Alice', id: 123 }));
sessionStorage.setItem('tempData', 'session-specific-info');

// Benefits over cookies:
// - 5-10MB storage per origin
// - Not sent with HTTP requests
// - Simple key-value API
// - Better security model

// 3. IndexedDB (2015) - Full database in the browser
// - Unlimited storage (subject to quota)
// - Advanced querying with indexes
// - Transaction support
// - Asynchronous API

// 4. Modern Storage APIs (2020+)
// - Storage API for quota management
// - Cache API for request/response caching
// - Origin Private File System API

// Storage comparison matrix
const storageComparison = {
    cookies: {
        capacity: '4KB',
        persistence: 'Until expires/deleted',
        scope: 'Origin + path',
        httpRequests: true,
        api: 'String manipulation',
        useCase: 'Authentication tokens'
    },
    localStorage: {
        capacity: '5-10MB',
        persistence: 'Until explicitly deleted',
        scope: 'Origin',
        httpRequests: false,
        api: 'Key-value',
        useCase: 'User preferences, cached data'
    },
    sessionStorage: {
        capacity: '5-10MB',
        persistence: 'Until tab closes',
        scope: 'Origin + tab',
        httpRequests: false,
        api: 'Key-value',
        useCase: 'Temporary form data, session state'
    },
    indexedDB: {
        capacity: 'Large (quota-based)',
        persistence: 'Until explicitly deleted',
        scope: 'Origin',
        httpRequests: false,
        api: 'Database with transactions',
        useCase: 'Large datasets, offline apps'
    }
};

console.table(storageComparison);
```

### Storage Quotas and Management 📏

```javascript
// Understanding storage quotas and usage
class StorageManager {
    static async getStorageInfo() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            
            return {
                quota: estimate.quota,
                usage: estimate.usage,
                available: estimate.quota - estimate.usage,
                usagePercentage: (estimate.usage / estimate.quota) * 100,
                usageByType: estimate.usageDetails || {}
            };
        }
        
        return {
            quota: 'Unknown',
            usage: 'Unknown',
            available: 'Unknown',
            usagePercentage: 'Unknown',
            supported: false
        };
    }
    
    static async requestPersistentStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
            const granted = await navigator.storage.persist();
            console.log(`Persistent storage ${granted ? 'granted' : 'denied'}`);
            return granted;
        }
        
        console.warn('Persistent storage not supported');
        return false;
    }
    
    static async isPersistent() {
        if ('storage' in navigator && 'persisted' in navigator.storage) {
            return await navigator.storage.persisted();
        }
        return false;
    }
    
    static formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    static async displayStorageInfo() {
        const info = await this.getStorageInfo();
        const isPersistent = await this.isPersistent();
        
        console.group('Storage Information');
        console.log('Quota:', this.formatBytes(info.quota));
        console.log('Usage:', this.formatBytes(info.usage));
        console.log('Available:', this.formatBytes(info.available));
        console.log('Usage Percentage:', info.usagePercentage.toFixed(2) + '%');
        console.log('Persistent:', isPersistent);
        
        if (info.usageByType) {
            console.log('Usage by type:', info.usageByType);
        }
        
        console.groupEnd();
        
        return info;
    }
}

// Check storage information
StorageManager.displayStorageInfo();

// Request persistent storage for critical applications
StorageManager.requestPersistentStorage().then(granted => {
    if (granted) {
        console.log('Data will persist even under storage pressure');
    } else {
        console.log('Data may be evicted under storage pressure');
    }
});
```

## localStorage and sessionStorage Mastery 🗄️

### Enhanced Web Storage Utility 💡

```javascript
// Advanced Web Storage utility with JSON support, expiration, and encryption
class EnhancedStorage {
    constructor(storage = localStorage) {
        this.storage = storage;
        this.isStorageAvailable = this.checkStorageAvailability();
    }
    
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            this.storage.setItem(test, test);
            this.storage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('Storage not available:', e);
            return false;
        }
    }
    
    // Basic operations with automatic JSON handling
    set(key, value, options = {}) {
        if (!this.isStorageAvailable) return false;
        
        try {
            const item = {
                value,
                timestamp: Date.now(),
                expires: options.expires ? Date.now() + options.expires : null,
                encrypted: options.encrypt || false
            };
            
            if (options.encrypt && options.secretKey) {
                item.value = this.encrypt(JSON.stringify(value), options.secretKey);
            }
            
            this.storage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }
    
    get(key, options = {}) {
        if (!this.isStorageAvailable) return null;
        
        try {
            const itemStr = this.storage.getItem(key);
            if (!itemStr) return null;
            
            const item = JSON.parse(itemStr);
            
            // Check expiration
            if (item.expires && Date.now() > item.expires) {
                this.remove(key);
                return null;
            }
            
            // Decrypt if needed
            if (item.encrypted && options.secretKey) {
                return JSON.parse(this.decrypt(item.value, options.secretKey));
            }
            
            return item.value;
        } catch (error) {
            console.error('Storage get error:', error);
            this.remove(key); // Remove corrupted data
            return null;
        }
    }
    
    remove(key) {
        if (!this.isStorageAvailable) return false;
        
        try {
            this.storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
    
    clear() {
        if (!this.isStorageAvailable) return false;
        
        try {
            this.storage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
    
    // Advanced operations
    has(key) {
        return this.get(key) !== null;
    }
    
    keys() {
        if (!this.isStorageAvailable) return [];
        
        const keys = [];
        for (let i = 0; i < this.storage.length; i++) {
            keys.push(this.storage.key(i));
        }
        return keys;
    }
    
    getAllItems() {
        const items = {};
        this.keys().forEach(key => {
            items[key] = this.get(key);
        });
        return items;
    }
    
    size() {
        return this.keys().length;
    }
    
    // Batch operations
    setMultiple(items, options = {}) {
        const results = {};
        Object.entries(items).forEach(([key, value]) => {
            results[key] = this.set(key, value, options);
        });
        return results;
    }
    
    getMultiple(keys, options = {}) {
        const results = {};
        keys.forEach(key => {
            results[key] = this.get(key, options);
        });
        return results;
    }
    
    removeMultiple(keys) {
        const results = {};
        keys.forEach(key => {
            results[key] = this.remove(key);
        });
        return results;
    }
    
    // Search and filter
    search(predicate) {
        const results = {};
        this.keys().forEach(key => {
            const value = this.get(key);
            if (predicate(key, value)) {
                results[key] = value;
            }
        });
        return results;
    }
    
    // Cleanup expired items
    cleanup() {
        const expiredKeys = [];
        this.keys().forEach(key => {
            const itemStr = this.storage.getItem(key);
            try {
                const item = JSON.parse(itemStr);
                if (item.expires && Date.now() > item.expires) {
                    expiredKeys.push(key);
                }
            } catch (error) {
                // Remove corrupted data
                expiredKeys.push(key);
            }
        });
        
        expiredKeys.forEach(key => this.remove(key));
        return expiredKeys.length;
    }
    
    // Simple encryption (for demo - use proper encryption in production)
    encrypt(text, secretKey) {
        // This is a simple XOR cipher for demonstration
        // In production, use a proper encryption library
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
            );
        }
        return btoa(result);
    }
    
    decrypt(encryptedText, secretKey) {
        const text = atob(encryptedText);
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(
                text.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length)
            );
        }
        return result;
    }
    
    // Storage events (only for localStorage)
    onChange(callback) {
        if (this.storage === localStorage) {
            window.addEventListener('storage', (event) => {
                if (event.storageArea === localStorage) {
                    callback({
                        key: event.key,
                        oldValue: event.oldValue,
                        newValue: event.newValue,
                        url: event.url
                    });
                }
            });
        }
    }
    
    // Namespace support
    namespace(prefix) {
        return new NamespacedStorage(this, prefix);
    }
}

// Namespaced storage for better organization
class NamespacedStorage {
    constructor(storage, prefix) {
        this.storage = storage;
        this.prefix = prefix + ':';
    }
    
    _prefixKey(key) {
        return this.prefix + key;
    }
    
    _unprefixKey(key) {
        return key.startsWith(this.prefix) ? key.slice(this.prefix.length) : key;
    }
    
    set(key, value, options = {}) {
        return this.storage.set(this._prefixKey(key), value, options);
    }
    
    get(key, options = {}) {
        return this.storage.get(this._prefixKey(key), options);
    }
    
    remove(key) {
        return this.storage.remove(this._prefixKey(key));
    }
    
    has(key) {
        return this.storage.has(this._prefixKey(key));
    }
    
    keys() {
        return this.storage.keys()
            .filter(key => key.startsWith(this.prefix))
            .map(key => this._unprefixKey(key));
    }
    
    clear() {
        const keysToRemove = this.keys();
        return this.storage.removeMultiple(keysToRemove.map(key => this._prefixKey(key)));
    }
}

// Usage examples
const localStorage = new EnhancedStorage(window.localStorage);
const sessionStorage = new EnhancedStorage(window.sessionStorage);

// Basic usage
localStorage.set('user', { name: 'Alice', id: 123 });
const user = localStorage.get('user');
console.log('User:', user);

// With expiration (1 hour)
localStorage.set('tempData', { token: 'abc123' }, { expires: 60 * 60 * 1000 });

// With encryption
localStorage.set('sensitive', { ssn: '123-45-6789' }, { 
    encrypt: true, 
    secretKey: 'mySecretKey' 
});
const sensitive = localStorage.get('sensitive', { secretKey: 'mySecretKey' });

// Namespaced storage
const userStorage = localStorage.namespace('user');
const appStorage = localStorage.namespace('app');

userStorage.set('preferences', { theme: 'dark', language: 'en' });
appStorage.set('config', { version: '1.0.0', debug: false });

// Search functionality
const darkThemeItems = localStorage.search((key, value) => {
    return value && value.theme === 'dark';
});

// Listen for storage changes (localStorage only)
localStorage.onChange((event) => {
    console.log('Storage changed:', event);
});

// Cleanup expired items
const cleanedCount = localStorage.cleanup();
console.log(`Cleaned up ${cleanedCount} expired items`);
```

### Real-World Storage Applications 🌍

```javascript
// Application-specific storage managers
class UserPreferencesManager {
    constructor() {
        this.storage = new EnhancedStorage(localStorage).namespace('userPrefs');
        this.defaults = {
            theme: 'light',
            language: 'en',
            notifications: true,
            autoSave: true,
            fontSize: 'medium'
        };
    }
    
    getPreference(key) {
        return this.storage.get(key) ?? this.defaults[key];
    }
    
    setPreference(key, value) {
        this.storage.set(key, value);
        this.dispatchPreferenceChange(key, value);
    }
    
    getAllPreferences() {
        const prefs = { ...this.defaults };
        this.storage.keys().forEach(key => {
            prefs[key] = this.storage.get(key);
        });
        return prefs;
    }
    
    resetToDefaults() {
        this.storage.clear();
        this.dispatchPreferenceChange('*', this.defaults);
    }
    
    exportPreferences() {
        return {
            preferences: this.getAllPreferences(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }
    
    importPreferences(data) {
        if (data.version !== '1.0') {
            throw new Error('Unsupported preferences version');
        }
        
        Object.entries(data.preferences).forEach(([key, value]) => {
            if (key in this.defaults) {
                this.setPreference(key, value);
            }
        });
    }
    
    dispatchPreferenceChange(key, value) {
        window.dispatchEvent(new CustomEvent('preferenceChanged', {
            detail: { key, value }
        }));
    }
}

class FormDataManager {
    constructor() {
        this.storage = new EnhancedStorage(sessionStorage).namespace('formData');
        this.autoSaveInterval = 5000; // 5 seconds
        this.timers = new Map();
    }
    
    saveFormData(formId, data) {
        this.storage.set(formId, {
            data,
            savedAt: Date.now(),
            url: window.location.href
        });
    }
    
    getFormData(formId) {
        const stored = this.storage.get(formId);
        return stored ? stored.data : null;
    }
    
    clearFormData(formId) {
        this.storage.remove(formId);
        if (this.timers.has(formId)) {
            clearInterval(this.timers.get(formId));
            this.timers.delete(formId);
        }
    }
    
    autoSaveForm(formElement) {
        const formId = formElement.id || formElement.dataset.formId;
        if (!formId) {
            console.warn('Form must have an ID for auto-save');
            return;
        }
        
        // Load existing data
        const existingData = this.getFormData(formId);
        if (existingData) {
            this.populateForm(formElement, existingData);
        }
        
        // Setup auto-save
        const timer = setInterval(() => {
            const formData = this.extractFormData(formElement);
            this.saveFormData(formId, formData);
        }, this.autoSaveInterval);
        
        this.timers.set(formId, timer);
        
        // Clear on successful submit
        formElement.addEventListener('submit', () => {
            this.clearFormData(formId);
        });
    }
    
    extractFormData(formElement) {
        const data = {};
        const formData = new FormData(formElement);
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes, multi-select)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }
    
    populateForm(formElement, data) {
        Object.entries(data).forEach(([key, value]) => {
            const field = formElement.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    if (Array.isArray(value)) {
                        field.checked = value.includes(field.value);
                    } else {
                        field.checked = field.value === value;
                    }
                } else {
                    field.value = value;
                }
            }
        });
    }
}

class CacheManager {
    constructor() {
        this.storage = new EnhancedStorage(localStorage).namespace('cache');
        this.defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
    }
    
    set(key, data, ttl = this.defaultTTL) {
        this.storage.set(key, data, { expires: ttl });
    }
    
    get(key) {
        return this.storage.get(key);
    }
    
    invalidate(key) {
        this.storage.remove(key);
    }
    
    invalidatePattern(pattern) {
        const regex = new RegExp(pattern);
        const keysToRemove = this.storage.keys().filter(key => regex.test(key));
        this.storage.removeMultiple(keysToRemove);
        return keysToRemove.length;
    }
    
    getCacheInfo() {
        const keys = this.storage.keys();
        const info = {
            totalItems: keys.length,
            items: {}
        };
        
        keys.forEach(key => {
            const itemStr = localStorage.getItem(`cache:${key}`);
            try {
                const item = JSON.parse(itemStr);
                info.items[key] = {
                    size: new Blob([itemStr]).size,
                    created: new Date(item.timestamp),
                    expires: item.expires ? new Date(item.expires) : null
                };
            } catch (error) {
                info.items[key] = { error: 'Corrupted data' };
            }
        });
        
        return info;
    }
}

// Usage examples
const preferences = new UserPreferencesManager();
const formManager = new FormDataManager();
const cache = new CacheManager();

// User preferences
preferences.setPreference('theme', 'dark');
preferences.setPreference('language', 'es');
console.log('Current theme:', preferences.getPreference('theme'));

// Listen for preference changes
window.addEventListener('preferenceChanged', (event) => {
    const { key, value } = event.detail;
    console.log(`Preference ${key} changed to:`, value);
    
    // Apply theme change immediately
    if (key === 'theme') {
        document.body.className = `theme-${value}`;
    }
});

// Form auto-save
const form = document.querySelector('#myForm');
if (form) {
    formManager.autoSaveForm(form);
}

// Cache API responses
cache.set('userList', [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
const cachedUsers = cache.get('userList');
console.log('Cached users:', cachedUsers);

// Cache with custom TTL (1 hour)
cache.set('tempData', { token: 'abc123' }, 60 * 60 * 1000);
```

## IndexedDB Mastery 🗃️

### IndexedDB Wrapper for Easy Usage 💪

```javascript
// Comprehensive IndexedDB wrapper for easier usage
class IndexedDBManager {
    constructor(dbName, version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
        this.stores = new Map();
    }
    
    // Define object stores before opening
    defineStore(storeName, options = {}) {
        this.stores.set(storeName, {
            keyPath: options.keyPath || 'id',
            autoIncrement: options.autoIncrement || true,
            indexes: options.indexes || []
        });
        return this;
    }
    
    // Open database connection
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => {
                reject(new Error(`Failed to open database: ${request.error}`));
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                
                // Handle unexpected close
                this.db.onclose = () => {
                    console.log('Database connection closed');
                };
                
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                for (let [storeName, config] of this.stores) {
                    if (db.objectStoreNames.contains(storeName)) {
                        db.deleteObjectStore(storeName);
                    }
                    
                    const store = db.createObjectStore(storeName, {
                        keyPath: config.keyPath,
                        autoIncrement: config.autoIncrement
                    });
                    
                    // Create indexes
                    config.indexes.forEach(index => {
                        store.createIndex(index.name, index.keyPath, {
                            unique: index.unique || false,
                            multiEntry: index.multiEntry || false
                        });
                    });
                }
            };
        });
    }
    
    // Generic transaction wrapper
    async transaction(storeNames, mode = 'readonly', callback) {
        if (!this.db) {
            throw new Error('Database not opened');
        }
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeNames, mode);
            const stores = {};
            
            // Get object stores
            if (Array.isArray(storeNames)) {
                storeNames.forEach(name => {
                    stores[name] = transaction.objectStore(name);
                });
            } else {
                stores[storeNames] = transaction.objectStore(storeNames);
            }
            
            transaction.oncomplete = () => {
                resolve();
            };
            
            transaction.onerror = () => {
                reject(new Error(`Transaction failed: ${transaction.error}`));
            };
            
            transaction.onabort = () => {
                reject(new Error('Transaction aborted'));
            };
            
            // Execute callback with stores
            try {
                const result = callback(stores, transaction);
                if (result instanceof Promise) {
                    result.catch(reject);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // CRUD operations
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readwrite', (stores) => {
                const request = stores[storeName].add(data);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to add data: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    async put(storeName, data) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readwrite', (stores) => {
                const request = stores[storeName].put(data);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to put data: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readonly', (stores) => {
                const request = stores[storeName].get(key);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to get data: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readwrite', (stores) => {
                const request = stores[storeName].delete(key);
                
                request.onsuccess = () => {
                    resolve(true);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to delete data: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readwrite', (stores) => {
                const request = stores[storeName].clear();
                
                request.onsuccess = () => {
                    resolve(true);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to clear store: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    async getAll(storeName, query = null, count = null) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readonly', (stores) => {
                const request = stores[storeName].getAll(query, count);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to get all data: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    async count(storeName, query = null) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readonly', (stores) => {
                const request = stores[storeName].count(query);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to count: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    // Index-based queries
    async getByIndex(storeName, indexName, key) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readonly', (stores) => {
                const index = stores[storeName].index(indexName);
                const request = index.get(key);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to get by index: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    async getAllByIndex(storeName, indexName, query = null) {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readonly', (stores) => {
                const index = stores[storeName].index(indexName);
                const request = index.getAll(query);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to get all by index: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    // Cursor-based iteration for large datasets
    async iterate(storeName, callback, direction = 'next') {
        return new Promise((resolve, reject) => {
            this.transaction(storeName, 'readonly', (stores) => {
                const request = stores[storeName].openCursor(null, direction);
                const results = [];
                
                request.onsuccess = async (event) => {
                    const cursor = event.target.result;
                    
                    if (cursor) {
                        try {
                            const continueIteration = await callback(cursor.value, cursor.key);
                            if (continueIteration !== false) {
                                cursor.continue();
                            } else {
                                resolve(results);
                            }
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        resolve(results);
                    }
                };
                
                request.onerror = () => {
                    reject(new Error(`Failed to iterate: ${request.error}`));
                };
            }).catch(reject);
        });
    }
    
    // Batch operations
    async bulkAdd(storeName, items) {
        return this.transaction(storeName, 'readwrite', (stores) => {
            const promises = items.map(item => {
                return new Promise((resolve, reject) => {
                    const request = stores[storeName].add(item);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
            
            return Promise.all(promises);
        });
    }
    
    async bulkPut(storeName, items) {
        return this.transaction(storeName, 'readwrite', (stores) => {
            const promises = items.map(item => {
                return new Promise((resolve, reject) => {
                    const request = stores[storeName].put(item);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
            
            return Promise.all(promises);
        });
    }
    
    // Close database
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
    
    // Delete database
    static async deleteDatabase(dbName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbName);
            
            request.onsuccess = () => {
                resolve(true);
            };
            
            request.onerror = () => {
                reject(new Error(`Failed to delete database: ${request.error}`));
            };
            
            request.onblocked = () => {
                console.warn('Database deletion blocked');
            };
        });
    }
}

// Usage example: Task Management App
class TaskManager {
    constructor() {
        this.db = new IndexedDBManager('TaskManagerDB', 1);
        this.initializeDatabase();
    }
    
    async initializeDatabase() {
        // Define stores
        this.db
            .defineStore('tasks', {
                keyPath: 'id',
                autoIncrement: true,
                indexes: [
                    { name: 'status', keyPath: 'status' },
                    { name: 'priority', keyPath: 'priority' },
                    { name: 'category', keyPath: 'category' },
                    { name: 'dueDate', keyPath: 'dueDate' },
                    { name: 'createdAt', keyPath: 'createdAt' }
                ]
            })
            .defineStore('categories', {
                keyPath: 'id',
                autoIncrement: true,
                indexes: [
                    { name: 'name', keyPath: 'name', unique: true }
                ]
            });
        
        await this.db.open();
        console.log('Task Manager database initialized');
    }
    
    async createTask(taskData) {
        const task = {
            ...taskData,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: taskData.status || 'pending'
        };
        
        const id = await this.db.add('tasks', task);
        return { ...task, id };
    }
    
    async updateTask(id, updates) {
        const existingTask = await this.db.get('tasks', id);
        if (!existingTask) {
            throw new Error('Task not found');
        }
        
        const updatedTask = {
            ...existingTask,
            ...updates,
            updatedAt: new Date()
        };
        
        await this.db.put('tasks', updatedTask);
        return updatedTask;
    }
    
    async deleteTask(id) {
        return this.db.delete('tasks', id);
    }
    
    async getTask(id) {
        return this.db.get('tasks', id);
    }
    
    async getAllTasks() {
        return this.db.getAll('tasks');
    }
    
    async getTasksByStatus(status) {
        return this.db.getAllByIndex('tasks', 'status', status);
    }
    
    async getTasksByCategory(category) {
        return this.db.getAllByIndex('tasks', 'category', category);
    }
    
    async searchTasks(query) {
        const allTasks = await this.db.getAll('tasks');
        const searchTerm = query.toLowerCase();
        
        return allTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
    }
    
    async getTaskStats() {
        const all = await this.db.count('tasks');
        const pending = await this.db.count('tasks', IDBKeyRange.only('pending'));
        const completed = await this.db.count('tasks', IDBKeyRange.only('completed'));
        
        return { all, pending, completed };
    }
    
    async exportTasks() {
        const tasks = await this.db.getAll('tasks');
        const categories = await this.db.getAll('categories');
        
        return {
            tasks,
            categories,
            exportDate: new Date(),
            version: '1.0'
        };
    }
    
    async importTasks(data) {
        if (data.version !== '1.0') {
            throw new Error('Unsupported export version');
        }
        
        // Import categories first
        if (data.categories.length > 0) {
            await this.db.bulkPut('categories', data.categories);
        }
        
        // Import tasks
        if (data.tasks.length > 0) {
            await this.db.bulkPut('tasks', data.tasks);
        }
        
        return {
            tasksImported: data.tasks.length,
            categoriesImported: data.categories.length
        };
    }
}

// Usage
const taskManager = new TaskManager();

// Wait for initialization, then use
setTimeout(async () => {
    try {
        // Create a task
        const task = await taskManager.createTask({
            title: 'Learn IndexedDB',
            description: 'Study client-side database patterns',
            category: 'Education',
            priority: 'high',
            dueDate: new Date('2025-12-31')
        });
        
        console.log('Created task:', task);
        
        // Get all tasks
        const allTasks = await taskManager.getAllTasks();
        console.log('All tasks:', allTasks);
        
        // Update task
        const updatedTask = await taskManager.updateTask(task.id, {
            status: 'in-progress'
        });
        console.log('Updated task:', updatedTask);
        
        // Get task statistics
        const stats = await taskManager.getTaskStats();
        console.log('Task stats:', stats);
        
    } catch (error) {
        console.error('Task manager error:', error);
    }
}, 1000);
```

## Summary

### Core Concepts
- **Storage Types:** localStorage, sessionStorage, IndexedDB, and their use cases
- **Storage Quotas:** Understanding browser storage limits and management
- **Data Persistence:** Different persistence levels and eviction policies
- **Cross-Tab Communication:** Storage events and data synchronization

### Advanced Features
- **Enhanced Storage:** JSON handling, expiration, encryption, and namespaces
- **IndexedDB Mastery:** Transactions, indexes, cursors, and batch operations
- **Application Patterns:** Preferences, form auto-save, caching, and offline data
- **Performance Optimization:** Efficient queries, bulk operations, and memory management

### Best Practices
- **Data Validation:** Always validate stored data and handle corruption gracefully
- **Security:** Encrypt sensitive data and be aware of storage limitations
- **Performance:** Use appropriate storage type for your use case
- **User Experience:** Provide feedback for storage operations and quota issues

### Storage Strategy Guidelines
- **localStorage:** User preferences, cached API responses, application state
- **sessionStorage:** Form data, temporary UI state, session-specific information
- **IndexedDB:** Large datasets, offline applications, complex data relationships
- **Cookies:** Authentication tokens, small cross-request data (legacy)

### Offline-First Patterns
- **Progressive Enhancement:** Start with offline-capable storage
- **Sync Strategies:** Background sync, conflict resolution, and data merging
- **Cache Management:** Intelligent caching and invalidation strategies
- **Error Handling:** Graceful degradation when storage is unavailable

### My Personal Insight
Client-side storage transformed how I approach web application architecture. The realization that **modern web apps can function as sophisticated offline applications** was a paradigm shift.

**IndexedDB** especially opened up possibilities I hadn't considered - building rich, data-intensive applications that work reliably offline. The key insight is that **storage isn't just about persistence - it's about creating resilient, user-centric experiences** that work regardless of network conditions.

Understanding storage quotas and management became crucial for building applications that scale with user data and provide transparent experiences around storage limitations.

### Next Up
Now that you've mastered client-side storage, we'll explore **Service Workers & Progressive Web Apps** - the technologies that enable truly offline-capable applications with background processing, push notifications, and app-like experiences.

Remember: Storage isn't just about saving data - it's about building resilient, offline-capable applications that provide consistent user experiences! 🚀✨
