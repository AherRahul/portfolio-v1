---
title: "Service Workers and Offline Functionality"
description: "Master Service Workers to create robust offline experiences. Learn how to implement caching strategies, background sync, and offline-first architecture for web applications that work reliably regardless of network conditions."
image: "https://res.cloudinary.com/duojkrgue/image/upload/v1759048332/Portfolio/FrontendSystemDesignCourse/titleImages/55_cqoxgb.png"
publishedAt: "2026-01-13"
is_on_youtube: false
courseName: "02-frontend-system-design"
id: 71
auther_name: "Rahul Aher"
topics:
  - frontend
---



![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048332/Portfolio/FrontendSystemDesignCourse/titleImages/55_cqoxgb.png)

Service Workers are the foundation of modern offline-capable web applications, acting as a programmable network proxy between your web app and the network. They enable sophisticated caching strategies, background data synchronization, and push notifications, creating app-like experiences that work reliably regardless of connectivity.

## The Theoretical Foundation

### Understanding Service Workers Architecture

Service Workers operate on the principle of **intercepting and controlling network requests**. Think of them as a **smart intermediary** that sits between your web application and the network, similar to how a postal service sorts and routes mail based on addresses and delivery preferences.

The Service Worker operates in its own **separate thread** from the main JavaScript execution context, which means:
- It runs independently of your web pages
- It persists even when your web app is closed
- It can respond to events even when no pages are open
- It has access to advanced APIs like push notifications and background sync

### Service Worker Lifecycle

The Service Worker lifecycle consists of several phases:

1. **Registration**: The main thread registers the Service Worker
2. **Installation**: The Service Worker downloads and installs
3. **Waiting**: The Service Worker waits to become active (if an old version exists)
4. **Activation**: The Service Worker becomes active and can control pages
5. **Redundant**: The Service Worker is replaced by a newer version

### Offline-First Architecture

Offline-first architecture flips traditional thinking: instead of treating offline as an edge case, it **designs for offline by default** and treats online connectivity as an enhancement. This approach creates more resilient applications that provide consistent user experiences.

The core principles include:
- **Local-first storage**: Store data locally first, sync to server later
- **Progressive enhancement**: Layer online features on top of offline functionality
- **Graceful degradation**: Degrade functionality smoothly when offline
- **User feedback**: Clear communication about connectivity status

## Building a Comprehensive Service Worker Framework

Let's create an advanced Service Worker system that implements multiple caching strategies and offline capabilities:

```javascript
// Service Worker Implementation (sw.js)
class AdvancedServiceWorker {
    constructor() {
        this.CACHE_NAME = 'app-cache-v1';
        this.RUNTIME_CACHE = 'runtime-cache-v1';
        this.OFFLINE_PAGE = '/offline.html';
        this.OFFLINE_IMAGE = '/images/offline-fallback.png';
        
        // Cache strategies configuration
        this.cacheStrategies = {
            // Static assets - Cache First
            static: {
                pattern: /\.(js|css|html|png|jpg|jpeg|gif|svg|woff2?)$/,
                strategy: 'CacheFirst',
                cacheName: 'static-assets-v1',
                maxAge: 30 * 24 * 60 * 60, // 30 days
                maxEntries: 100
            },
            
            // API requests - Network First with background sync
            api: {
                pattern: /\/api\//,
                strategy: 'NetworkFirst',
                cacheName: 'api-cache-v1',
                maxAge: 5 * 60, // 5 minutes
                backgroundSync: true
            },
            
            // Images - Stale While Revalidate
            images: {
                pattern: /\.(png|jpg|jpeg|gif|svg|webp)$/,
                strategy: 'StaleWhileRevalidate',
                cacheName: 'images-cache-v1',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                maxEntries: 50
            },
            
            // Pages - Network First with offline fallback
            pages: {
                pattern: /^https:\/\/yourapp\.com\/[^?]*$/,
                strategy: 'NetworkFirst',
                cacheName: 'pages-cache-v1',
                maxAge: 24 * 60 * 60, // 24 hours
                offlineFallback: true
            }
        };

        this.backgroundSyncQueue = [];
        this.pendingRequests = new Map();
        
        this.init();
    }

    init() {
        self.addEventListener('install', this.handleInstall.bind(this));
        self.addEventListener('activate', this.handleActivate.bind(this));
        self.addEventListener('fetch', this.handleFetch.bind(this));
        self.addEventListener('sync', this.handleBackgroundSync.bind(this));
        self.addEventListener('message', this.handleMessage.bind(this));
        
        // Push notification support
        self.addEventListener('push', this.handlePush.bind(this));
        self.addEventListener('notificationclick', this.handleNotificationClick.bind(this));
    }

    // Installation Phase
    async handleInstall(event) {
        console.log('Service Worker installing...');
        
        event.waitUntil(
            this.precacheAssets().then(() => {
                console.log('Assets precached successfully');
                return self.skipWaiting(); // Force activation
            })
        );
    }

    async precacheAssets() {
        const cache = await caches.open(this.CACHE_NAME);
        
        const essentialAssets = [
            '/',
            '/index.html',
            '/offline.html',
            '/css/main.css',
            '/js/app.js',
            '/js/offline.js',
            '/images/logo.png',
            '/images/offline-fallback.png',
            '/manifest.json'
        ];

        try {
            await cache.addAll(essentialAssets);
            console.log('Essential assets cached');
        } catch (error) {
            console.error('Failed to precache assets:', error);
            // Cache assets individually to identify problematic resources
            for (const asset of essentialAssets) {
                try {
                    await cache.add(asset);
                } catch (assetError) {
                    console.error(`Failed to cache ${asset}:`, assetError);
                }
            }
        }
    }

    // Activation Phase
    async handleActivate(event) {
        console.log('Service Worker activating...');
        
        event.waitUntil(
            Promise.all([
                this.cleanupOldCaches(),
                this.claimClients()
            ])
        );
    }

    async cleanupOldCaches() {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name !== this.CACHE_NAME && 
            name !== this.RUNTIME_CACHE &&
            !Object.values(this.cacheStrategies).some(strategy => strategy.cacheName === name)
        );

        return Promise.all(
            oldCaches.map(cacheName => {
                console.log('Deleting old cache:', cacheName);
                return caches.delete(cacheName);
            })
        );
    }

    async claimClients() {
        return self.clients.claim();
    }

    // Fetch Handler - Core Request Interception
    handleFetch(event) {
        const { request } = event;
        const url = new URL(request.url);

        // Skip non-GET requests for background sync handling
        if (request.method !== 'GET') {
            return this.handleNonGetRequest(event);
        }

        // Skip cross-origin requests (except for specific allowed origins)
        if (!this.shouldHandleRequest(url)) {
            return;
        }

        // Find matching cache strategy
        const strategy = this.findCacheStrategy(url);
        
        if (strategy) {
            event.respondWith(this.executeStrategy(request, strategy));
        }
    }

    handleNonGetRequest(event) {
        const { request } = event;
        
        // Handle POST/PUT/DELETE requests with background sync
        if (this.shouldQueueForBackgroundSync(request)) {
            event.respondWith(this.queueForBackgroundSync(request));
        }
    }

    shouldHandleRequest(url) {
        // Handle same-origin requests and specific allowed origins
        return url.origin === self.location.origin ||
               this.isAllowedOrigin(url.origin);
    }

    isAllowedOrigin(origin) {
        const allowedOrigins = [
            'https://api.yourapp.com',
            'https://cdn.yourapp.com',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];
        return allowedOrigins.includes(origin);
    }

    findCacheStrategy(url) {
        for (const [name, strategy] of Object.entries(this.cacheStrategies)) {
            if (strategy.pattern.test(url.href)) {
                return { ...strategy, name };
            }
        }
        return null;
    }

    // Cache Strategy Implementations
    async executeStrategy(request, strategy) {
        switch (strategy.strategy) {
            case 'CacheFirst':
                return this.cacheFirst(request, strategy);
            case 'NetworkFirst':
                return this.networkFirst(request, strategy);
            case 'StaleWhileRevalidate':
                return this.staleWhileRevalidate(request, strategy);
            case 'NetworkOnly':
                return this.networkOnly(request, strategy);
            case 'CacheOnly':
                return this.cacheOnly(request, strategy);
            default:
                return fetch(request);
        }
    }

    async cacheFirst(request, strategy) {
        const cache = await caches.open(strategy.cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            // Check if cache entry is expired
            if (this.isCacheEntryExpired(cachedResponse, strategy.maxAge)) {
                // Try to update in background, but return cached version
                this.updateCacheInBackground(request, cache);
            }
            return cachedResponse;
        }

        // Not in cache, fetch from network
        try {
            const networkResponse = await fetch(request);
            
            if (networkResponse.ok) {
                // Clone before caching (response can only be used once)
                const responseToCache = networkResponse.clone();
                await this.addToCache(cache, request, responseToCache, strategy);
            }
            
            return networkResponse;
        } catch (error) {
            // Network failed, return offline fallback if available
            return this.getOfflineFallback(request, strategy);
        }
    }

    async networkFirst(request, strategy) {
        const cache = await caches.open(strategy.cacheName);

        try {
            const networkResponse = await this.fetchWithTimeout(request, 3000);
            
            if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                await this.addToCache(cache, request, responseToCache, strategy);
            }
            
            return networkResponse;
        } catch (error) {
            console.log('Network failed, trying cache:', error);
            
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                // Add stale indicator header
                const staleResponse = new Response(cachedResponse.body, {
                    status: cachedResponse.status,
                    statusText: cachedResponse.statusText,
                    headers: {
                        ...Object.fromEntries(cachedResponse.headers),
                        'X-Served-From': 'cache',
                        'X-Cache-Status': 'stale'
                    }
                });
                return staleResponse;
            }

            // Return offline fallback for pages
            if (strategy.offlineFallback) {
                return this.getOfflineFallback(request, strategy);
            }

            throw error;
        }
    }

    async staleWhileRevalidate(request, strategy) {
        const cache = await caches.open(strategy.cacheName);
        const cachedResponse = await cache.match(request);

        // Update cache in background
        const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                this.addToCache(cache, request, responseToCache, strategy);
            }
            return networkResponse;
        });

        // Return cached version immediately if available
        return cachedResponse || fetchPromise;
    }

    async networkOnly(request, strategy) {
        return fetch(request);
    }

    async cacheOnly(request, strategy) {
        const cache = await caches.open(strategy.cacheName);
        return cache.match(request);
    }

    // Background Sync Implementation
    shouldQueueForBackgroundSync(request) {
        const url = new URL(request.url);
        return this.cacheStrategies.api.backgroundSync && 
               this.cacheStrategies.api.pattern.test(url.href);
    }

    async queueForBackgroundSync(request) {
        // Store request data for background sync
        const requestData = {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers),
            body: request.method === 'GET' ? null : await request.clone().text(),
            timestamp: Date.now(),
            id: this.generateRequestId()
        };

        this.backgroundSyncQueue.push(requestData);
        
        // Store in IndexedDB for persistence
        await this.storeQueuedRequest(requestData);

        // Register for background sync
        await this.registerBackgroundSync();

        // Return immediate response
        return new Response(JSON.stringify({ 
            success: false,
            queued: true,
            message: 'Request queued for background sync'
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 202 // Accepted
        });
    }

    async registerBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            try {
                await self.registration.sync.register('background-sync');
                console.log('Background sync registered');
            } catch (error) {
                console.error('Background sync registration failed:', error);
            }
        }
    }

    async handleBackgroundSync(event) {
        if (event.tag === 'background-sync') {
            event.waitUntil(this.processBackgroundSyncQueue());
        }
    }

    async processBackgroundSyncQueue() {
        const queuedRequests = await this.getQueuedRequests();
        
        for (const requestData of queuedRequests) {
            try {
                const response = await this.retryRequest(requestData);
                
                if (response.ok) {
                    await this.removeQueuedRequest(requestData.id);
                    
                    // Notify clients of successful sync
                    this.notifyClients('sync-success', { 
                        requestId: requestData.id,
                        url: requestData.url
                    });
                } else {
                    console.error('Background sync failed for request:', requestData.url);
                }
            } catch (error) {
                console.error('Background sync error:', error);
            }
        }
    }

    async retryRequest(requestData) {
        const { url, method, headers, body } = requestData;
        
        const requestInit = {
            method,
            headers,
            body: body && method !== 'GET' ? body : undefined
        };

        return fetch(url, requestInit);
    }

    // Cache Management Utilities
    async addToCache(cache, request, response, strategy) {
        // Check cache size limits
        if (strategy.maxEntries) {
            await this.enforceCacheLimit(cache, strategy.maxEntries);
        }

        // Add cache timestamp for expiration checking
        const responseWithTimestamp = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                ...Object.fromEntries(response.headers),
                'X-Cache-Timestamp': Date.now().toString()
            }
        });

        await cache.put(request, responseWithTimestamp);
    }

    async enforceCacheLimit(cache, maxEntries) {
        const requests = await cache.keys();
        
        if (requests.length >= maxEntries) {
            // Remove oldest entries
            const entriesToRemove = requests.length - maxEntries + 1;
            
            // Sort by cache timestamp (oldest first)
            const sortedRequests = requests.sort(async (a, b) => {
                const responseA = await cache.match(a);
                const responseB = await cache.match(b);
                
                const timestampA = parseInt(responseA.headers.get('X-Cache-Timestamp') || '0');
                const timestampB = parseInt(responseB.headers.get('X-Cache-Timestamp') || '0');
                
                return timestampA - timestampB;
            });

            // Remove oldest entries
            for (let i = 0; i < entriesToRemove; i++) {
                await cache.delete(sortedRequests[i]);
            }
        }
    }

    isCacheEntryExpired(response, maxAge) {
        if (!maxAge) return false;
        
        const cacheTimestamp = response.headers.get('X-Cache-Timestamp');
        if (!cacheTimestamp) return true;
        
        const age = (Date.now() - parseInt(cacheTimestamp)) / 1000;
        return age > maxAge;
    }

    async updateCacheInBackground(request, cache) {
        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                await this.addToCache(cache, request, responseToCache, {});
            }
        } catch (error) {
            console.log('Background cache update failed:', error);
        }
    }

    async fetchWithTimeout(request, timeout = 5000) {
        return Promise.race([
            fetch(request),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    async getOfflineFallback(request, strategy) {
        const url = new URL(request.url);
        
        // Return appropriate fallback based on request type
        if (request.destination === 'document' || 
            request.headers.get('Accept')?.includes('text/html')) {
            return caches.match(this.OFFLINE_PAGE);
        } else if (request.destination === 'image') {
            return caches.match(this.OFFLINE_IMAGE);
        } else {
            return new Response('Offline', { 
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    }

    // IndexedDB Operations for Background Sync
    async storeQueuedRequest(requestData) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('BackgroundSyncDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['requests'], 'readwrite');
                const store = transaction.objectStore('requests');
                
                store.add(requestData);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('requests')) {
                    const store = db.createObjectStore('requests', { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async getQueuedRequests() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('BackgroundSyncDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['requests'], 'readonly');
                const store = transaction.objectStore('requests');
                
                store.getAll().onsuccess = (event) => {
                    resolve(event.target.result || []);
                };
            };
        });
    }

    async removeQueuedRequest(id) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('BackgroundSyncDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['requests'], 'readwrite');
                const store = transaction.objectStore('requests');
                
                store.delete(id);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            };
        });
    }

    // Client Communication
    async notifyClients(type, data) {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({ type, data });
        });
    }

    handleMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'GET_CACHE_STATUS':
                this.sendCacheStatus(event.ports[0]);
                break;
            case 'CLEAR_CACHE':
                this.clearCache(data.cacheName);
                break;
            case 'FORCE_UPDATE':
                this.forceUpdate();
                break;
        }
    }

    async sendCacheStatus(port) {
        const cacheNames = await caches.keys();
        const status = {};
        
        for (const name of cacheNames) {
            const cache = await caches.open(name);
            const requests = await cache.keys();
            status[name] = requests.length;
        }
        
        port.postMessage({ type: 'CACHE_STATUS', data: status });
    }

    // Push Notifications
    handlePush(event) {
        if (!event.data) return;
        
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon || '/images/icon-192x192.png',
            badge: data.badge || '/images/badge-72x72.png',
            tag: data.tag,
            requireInteraction: data.requireInteraction || false,
            actions: data.actions || []
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }

    handleNotificationClick(event) {
        event.notification.close();

        const action = event.action;
        const data = event.notification.data;
        
        // Handle notification actions
        if (action === 'open-app') {
            event.waitUntil(
                clients.openWindow(data.url || '/')
            );
        } else if (action === 'dismiss') {
            // Just close the notification
        } else {
            // Default action - open the app
            event.waitUntil(
                clients.openWindow(data.url || '/')
            );
        }
    }

    // Utility Methods
    generateRequestId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    async forceUpdate() {
        // Force update by clearing all caches and reloading
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        
        this.notifyClients('force-reload', {});
    }
}

// Initialize Service Worker
new AdvancedServiceWorker();
```

Now let's create the main application code that registers and communicates with the Service Worker:

```javascript
// Main Application Service Worker Manager (app.js)
class ServiceWorkerManager {
    constructor() {
        this.registration = null;
        this.isOnline = navigator.onLine;
        this.isUpdateAvailable = false;
        
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            this.setupEventListeners();
            await this.registerServiceWorker();
            this.setupBackgroundSync();
            this.setupPushNotifications();
        }
    }

    setupEventListeners() {
        // Network status monitoring
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleOnline();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleOffline();
        });

        // Service Worker messages
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));
        }
    }

    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered:', this.registration);

            // Handle updates
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration.installing;
                console.log('Service Worker update found');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.isUpdateAvailable = true;
                        this.showUpdateNotification();
                    }
                });
            });

            // Check for existing updates
            await this.registration.update();

        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    handleOnline() {
        console.log('App came online');
        this.updateUI({ online: true });
        
        // Trigger background sync
        if (this.registration && 'sync' in window.ServiceWorkerRegistration.prototype) {
            this.registration.sync.register('background-sync');
        }
    }

    handleOffline() {
        console.log('App went offline');
        this.updateUI({ online: false });
    }

    handleSWMessage(event) {
        const { type, data } = event.data;

        switch (type) {
            case 'sync-success':
                this.handleSyncSuccess(data);
                break;
            case 'force-reload':
                window.location.reload();
                break;
            case 'cache-updated':
                this.handleCacheUpdated(data);
                break;
        }
    }

    handleSyncSuccess(data) {
        console.log('Background sync successful:', data);
        this.showNotification('Data synchronized', 'Your changes have been saved.');
    }

    // Update UI based on connectivity and cache status
    updateUI({ online }) {
        const statusElement = document.getElementById('connection-status');
        const offlineIndicator = document.getElementById('offline-indicator');
        
        if (statusElement) {
            statusElement.textContent = online ? 'Online' : 'Offline';
            statusElement.className = online ? 'status-online' : 'status-offline';
        }

        if (offlineIndicator) {
            offlineIndicator.style.display = online ? 'none' : 'block';
        }

        // Update form behavior for offline
        this.updateFormBehavior(online);
    }

    updateFormBehavior(online) {
        const forms = document.querySelectorAll('form[data-sync]');
        
        forms.forEach(form => {
            const submitButton = form.querySelector('[type="submit"]');
            const statusElement = form.querySelector('.form-status');
            
            if (!online) {
                if (statusElement) {
                    statusElement.textContent = 'Changes will be saved when you\'re back online';
                    statusElement.className = 'form-status offline';
                }
            } else {
                if (statusElement) {
                    statusElement.textContent = '';
                    statusElement.className = 'form-status online';
                }
            }
        });
    }

    // Background Sync Setup
    setupBackgroundSync() {
        // Intercept form submissions for background sync
        document.addEventListener('submit', async (event) => {
            const form = event.target;
            
            if (form.hasAttribute('data-sync')) {
                event.preventDefault();
                await this.handleSyncableFormSubmission(form);
            }
        });
    }

    async handleSyncableFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(form.action, {
                method: form.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('Success', 'Your data has been saved.');
                form.reset();
            } else if (response.status === 202) {
                // Queued for background sync
                this.showNotification('Queued', 'Your data will be saved when you\'re back online.');
                form.reset();
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            this.showNotification('Error', 'Failed to save data. Please try again.');
        }
    }

    // Cache Management
    async getCacheStatus() {
        if (!this.registration) return {};

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            
            messageChannel.port1.onmessage = (event) => {
                if (event.data.type === 'CACHE_STATUS') {
                    resolve(event.data.data);
                }
            };

            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_CACHE_STATUS' },
                [messageChannel.port2]
            );
        });
    }

    async clearCache(cacheName) {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CLEAR_CACHE',
                data: { cacheName }
            });
        }
    }

    // Update Management
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p>A new version of the app is available!</p>
                <div class="notification-actions">
                    <button onclick="serviceWorkerManager.applyUpdate()">Update Now</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Later</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
    }

    async applyUpdate() {
        if (this.registration && this.registration.waiting) {
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    // Push Notifications
    async setupPushNotifications() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            return;
        }

        let permission = Notification.permission;
        
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }

        if (permission === 'granted' && this.registration) {
            await this.subscribeToPush();
        }
    }

    async subscribeToPush() {
        try {
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlB64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });

            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
            
            console.log('Push notification subscription successful');
        } catch (error) {
            console.error('Push subscription failed:', error);
        }
    }

    async sendSubscriptionToServer(subscription) {
        return fetch('/api/push-subscriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });
    }

    urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Utility Methods
    showNotification(title, message) {
        // Create a simple toast notification
        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.innerHTML = `
            <div class="toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Offline Data Management
    async saveOfflineData(key, data) {
        if ('indexedDB' in window) {
            return this.saveToIndexedDB(key, data);
        } else {
            return this.saveToLocalStorage(key, data);
        }
    }

    async loadOfflineData(key) {
        if ('indexedDB' in window) {
            return this.loadFromIndexedDB(key);
        } else {
            return this.loadFromLocalStorage(key);
        }
    }

    async saveToIndexedDB(key, data) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OfflineDataDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['data'], 'readwrite');
                const store = transaction.objectStore('data');
                
                store.put({ key, data, timestamp: Date.now() });
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data', { keyPath: 'key' });
                }
            };
        });
    }

    async loadFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OfflineDataDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['data'], 'readonly');
                const store = transaction.objectStore('data');
                
                store.get(key).onsuccess = (event) => {
                    const result = event.target.result;
                    resolve(result ? result.data : null);
                };
            };
        });
    }

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`offline-${key}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    loadFromLocalStorage(key) {
        try {
            const stored = localStorage.getItem(`offline-${key}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                return Promise.resolve(parsed.data);
            }
            return Promise.resolve(null);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

// Initialize Service Worker Manager
const serviceWorkerManager = new ServiceWorkerManager();

// Export for global access
window.serviceWorkerManager = serviceWorkerManager;
```

## Detailed Code Analysis: Understanding Service Worker Implementation

### Service Worker Lifecycle Management

The Service Worker lifecycle implementation handles all phases systematically:

1. **Installation Phase**: Precaches essential assets and skips waiting for immediate activation
2. **Activation Phase**: Cleans up old caches and claims all clients
3. **Update Management**: Handles version updates gracefully with user notification
4. **Error Recovery**: Provides fallbacks when operations fail

### Advanced Caching Strategies

The framework implements multiple caching strategies for different resource types:

1. **Cache First**: For static assets that rarely change (CSS, JS, images)
2. **Network First**: For API data that should be fresh when possible
3. **Stale While Revalidate**: For images that can be served immediately while updating in background
4. **Runtime Caching**: Dynamic caching based on user behavior and resource usage

### Background Sync Implementation

The background sync system provides robust offline functionality:

1. **Request Queuing**: Failed network requests are stored for later retry
2. **Automatic Retry**: Queued requests are automatically retried when connectivity returns
3. **Persistent Storage**: Uses IndexedDB to persist queued requests across browser sessions
4. **User Feedback**: Clear communication about queued vs successful operations

### Client-Service Worker Communication

The bidirectional communication system enables:

1. **Status Updates**: Real-time connectivity and sync status
2. **Cache Management**: Manual cache clearing and status checking
3. **Update Notifications**: User-controlled app updates
4. **Background Sync Results**: Feedback on queued operation completion

## Real-World Implementation Strategies

### Progressive Enhancement Approach
```javascript
// Enhance existing forms with offline capabilities
const enhanceFormWithOfflineSupport = (form) => {
    form.setAttribute('data-sync', '');
    
    const statusElement = document.createElement('div');
    statusElement.className = 'form-status';
    form.appendChild(statusElement);
    
    // Add visual feedback for offline state
    if (!navigator.onLine) {
        statusElement.textContent = 'Changes will be saved when back online';
        statusElement.className = 'form-status offline';
    }
};

// Apply to all critical forms
document.querySelectorAll('form.critical').forEach(enhanceFormWithOfflineSupport);
```

### Performance Optimization
```javascript
// Optimize cache performance with size limits and TTL
const optimizeCacheStrategy = {
    static: {
        maxEntries: 50,     // Limit cache size
        maxAge: 86400,      // 24 hour TTL
        cleanupInterval: 3600 // Cleanup every hour
    },
    
    runtime: {
        maxEntries: 30,
        maxAge: 3600,       // 1 hour TTL
        strategy: 'least-recently-used'
    }
};
```

### Testing Strategy
```javascript
// Service Worker testing utilities
const testServiceWorker = {
    async simulateOffline() {
        // Programmatically go offline for testing
        await navigator.serviceWorker.ready;
        return navigator.serviceWorker.controller.postMessage({
            type: 'SIMULATE_OFFLINE'
        });
    },
    
    async testCacheStrategies() {
        const testUrls = ['/api/data', '/static/app.css', '/images/logo.png'];
        const results = {};
        
        for (const url of testUrls) {
            const startTime = performance.now();
            await fetch(url);
            const endTime = performance.now();
            
            results[url] = {
                responseTime: endTime - startTime,
                cached: await this.isUrlCached(url)
            };
        }
        
        return results;
    }
};
```

## Summary

Service Workers enable sophisticated offline functionality by acting as a programmable network proxy. This comprehensive implementation provides:

- **Multiple Caching Strategies**: Optimized approaches for different resource types
- **Background Sync**: Reliable data synchronization when connectivity returns
- **Offline Fallbacks**: Graceful degradation for unavailable resources  
- **Update Management**: Seamless app updates with user control
- **Push Notifications**: Engaging user experiences even when app isn't active
- **Performance Optimization**: Cache size limits, TTL, and cleanup strategies
- **Client Communication**: Real-time status updates and manual controls

The framework transforms web applications into robust, app-like experiences that work reliably regardless of network conditions. By implementing progressive enhancement and offline-first principles, you create applications that provide consistent user experiences while gracefully handling connectivity challenges.

Remember: Offline functionality is not just about caching - it's about rethinking your application architecture to be resilient, user-centric, and performant under all conditions. The best offline experiences feel seamless and natural to users, making network connectivity transparent to the core user workflow.
