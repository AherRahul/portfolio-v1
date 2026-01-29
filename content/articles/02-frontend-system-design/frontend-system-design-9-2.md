---
title: "Progressive Web Apps (PWAs)"
description: "Master the complete PWA development stack including web app manifests, installation prompts, app shell architecture, and native-like features. Learn how to create web applications that deliver app-store-quality experiences."
image: "https://res.cloudinary.com/duojkrgue/image/upload/v1759048332/Portfolio/FrontendSystemDesignCourse/titleImages/56_dnoqdc.png"
publishedAt: "2026-01-13"
is_on_youtube: false
courseName: "02-frontend-system-design"
id: 72
auther_name: "Rahul Aher"
topics:
  - frontend
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048332/Portfolio/FrontendSystemDesignCourse/titleImages/56_dnoqdc.png)

Progressive Web Apps (PWAs) bridge the gap between web and native applications by leveraging modern web technologies to deliver app-like experiences. PWAs combine the reach and accessibility of the web with the engagement and functionality traditionally associated with native mobile applications.

## The Theoretical Foundation

### Understanding Progressive Web Apps

PWAs operate on the principle of **progressive enhancement** - they start as regular web applications and progressively unlock native-like capabilities based on device and browser support. Think of PWAs as **chameleons** that adapt their appearance and behavior to match the capabilities of their environment.

The core philosophy involves three pillars:
1. **Progressive**: Works for every user, regardless of browser choice
2. **Responsive**: Fits any form factor (desktop, mobile, tablet)
3. **Connectivity Independent**: Works offline or with poor connectivity

### PWA Architecture Patterns

PWAs typically implement several architectural patterns:

1. **App Shell Architecture**: Separates application infrastructure from content
2. **PRPL Pattern**: Push, Render, Pre-cache, Lazy-load critical resources
3. **Offline-First**: Design for offline functionality as the baseline
4. **Performance-First**: Prioritize loading speed and runtime performance

### PWA Technology Stack

The PWA ecosystem consists of several key technologies:
- **Service Workers**: Background processing and caching
- **Web App Manifest**: Installation and app metadata
- **Responsive Design**: Cross-device compatibility
- **HTTPS**: Secure context requirement
- **Modern APIs**: Camera, geolocation, push notifications, etc.

## Building a Comprehensive PWA Framework

Let's create a complete PWA implementation that covers all essential features:

```javascript
// PWA Manager - Main Application Controller
class PWAManager {
    constructor(config = {}) {
        this.config = {
            // App configuration
            appName: 'PWA Demo App',
            shortName: 'PWADemo',
            description: 'A comprehensive Progressive Web App',
            
            // Installation configuration
            enableInstallPrompt: true,
            installCriteria: {
                minVisits: 2,
                minEngagementTime: 30000, // 30 seconds
                daysToWaitBeforePrompt: 3
            },
            
            // Update configuration
            enableUpdateNotifications: true,
            updateCheckInterval: 60000, // 1 minute
            
            // Features configuration
            enablePushNotifications: true,
            enableBackgroundSync: true,
            enablePeriodicSync: true,
            
            // Analytics configuration
            trackInstallations: true,
            trackEngagement: true,
            trackOfflineUsage: true,
            
            ...config
        };

        this.state = {
            isInstalled: false,
            canInstall: false,
            isOnline: navigator.onLine,
            hasUpdate: false,
            installPromptDeferred: null,
            lastInstallPrompt: null
        };

        this.metrics = {
            installPromptShown: 0,
            installSuccessful: 0,
            installDeclined: 0,
            engagementTime: 0,
            offlineTime: 0,
            pageViews: 0
        };

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkInstallability();
        this.setupInstallPromptLogic();
        this.setupUpdateDetection();
        this.setupEngagementTracking();
        this.initializeFeatures();
        
        // Log initial state
        console.log('PWA Manager initialized:', {
            installed: this.state.isInstalled,
            installable: this.state.canInstall,
            online: this.state.isOnline
        });
    }

    setupEventListeners() {
        // Installation events
        window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this));
        window.addEventListener('appinstalled', this.handleAppInstalled.bind(this));

        // Network events
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));

        // Visibility events for engagement tracking
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Page navigation events
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // Service Worker messages
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));
        }
    }

    // Installation Management
    async checkInstallability() {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            this.state.isInstalled = true;
            this.handleAppInstalled();
            return;
        }

        // Check for installation criteria in storage
        const installData = this.getInstallData();
        const now = Date.now();
        
        // Track page view
        installData.pageViews = (installData.pageViews || 0) + 1;
        this.metrics.pageViews = installData.pageViews;
        
        // Track first visit
        if (!installData.firstVisit) {
            installData.firstVisit = now;
        }
        
        // Update last visit
        installData.lastVisit = now;
        
        this.saveInstallData(installData);
        
        // Check if meets install criteria
        this.evaluateInstallCriteria(installData);
    }

    evaluateInstallCriteria(installData) {
        const now = Date.now();
        const daysSinceFirstVisit = (now - installData.firstVisit) / (1000 * 60 * 60 * 24);
        const timeSinceLastPrompt = installData.lastInstallPrompt ? 
            (now - installData.lastInstallPrompt) / (1000 * 60 * 60 * 24) : Infinity;

        const criteria = this.config.installCriteria;
        
        const meetsCriteria = 
            installData.pageViews >= criteria.minVisits &&
            daysSinceFirstVisit >= criteria.daysToWaitBeforePrompt &&
            timeSinceLastPrompt >= criteria.daysToWaitBeforePrompt &&
            (installData.totalEngagement || 0) >= criteria.minEngagementTime;

        if (meetsCriteria && !this.state.isInstalled) {
            this.state.canInstall = true;
        }
    }

    handleBeforeInstallPrompt(event) {
        console.log('Install prompt available');
        
        // Prevent the default prompt
        event.preventDefault();
        
        // Store the event for later use
        this.state.installPromptDeferred = event;
        
        // Show custom install prompt if criteria are met
        if (this.state.canInstall && this.config.enableInstallPrompt) {
            this.showInstallPrompt();
        }
    }

    async showInstallPrompt() {
        if (!this.state.installPromptDeferred) return;

        const installData = this.getInstallData();
        const now = Date.now();
        
        // Update last prompt time
        installData.lastInstallPrompt = now;
        this.state.lastInstallPrompt = now;
        this.saveInstallData(installData);

        // Create and show custom install UI
        const installUI = this.createInstallUI();
        document.body.appendChild(installUI);
        
        // Track metrics
        this.metrics.installPromptShown++;
        this.trackEvent('install_prompt_shown', {
            pageViews: this.metrics.pageViews,
            engagementTime: this.metrics.engagementTime
        });
    }

    createInstallUI() {
        const installContainer = document.createElement('div');
        installContainer.className = 'pwa-install-prompt';
        installContainer.innerHTML = `
            <div class="install-prompt-overlay">
                <div class="install-prompt-modal">
                    <div class="install-prompt-header">
                        <img src="/icons/icon-72x72.png" alt="${this.config.appName}" class="app-icon">
                        <div class="app-info">
                            <h3>${this.config.appName}</h3>
                            <p>Install this app for a better experience</p>
                        </div>
                        <button class="close-prompt" aria-label="Close">×</button>
                    </div>
                    <div class="install-prompt-benefits">
                        <ul>
                            <li>✓ Works offline</li>
                            <li>✓ Fast loading</li>
                            <li>✓ Push notifications</li>
                            <li>✓ Home screen access</li>
                        </ul>
                    </div>
                    <div class="install-prompt-actions">
                        <button class="install-button primary">Install App</button>
                        <button class="cancel-button">Not Now</button>
                    </div>
                </div>
            </div>
        `;

        this.setupInstallUIEvents(installContainer);
        return installContainer;
    }

    setupInstallUIEvents(container) {
        const installButton = container.querySelector('.install-button');
        const cancelButton = container.querySelector('.cancel-button');
        const closeButton = container.querySelector('.close-prompt');

        const handleInstall = async () => {
            if (this.state.installPromptDeferred) {
                // Show the native install prompt
                this.state.installPromptDeferred.prompt();
                
                // Wait for the user's choice
                const { outcome } = await this.state.installPromptDeferred.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    this.metrics.installSuccessful++;
                    this.trackEvent('install_accepted');
                } else {
                    console.log('User dismissed the install prompt');
                    this.metrics.installDeclined++;
                    this.trackEvent('install_declined');
                }
                
                // Clear the deferred prompt
                this.state.installPromptDeferred = null;
            }
            
            container.remove();
        };

        const handleCancel = () => {
            this.metrics.installDeclined++;
            this.trackEvent('install_cancelled');
            container.remove();
        };

        installButton.addEventListener('click', handleInstall);
        cancelButton.addEventListener('click', handleCancel);
        closeButton.addEventListener('click', handleCancel);
        
        // Close on overlay click
        const overlay = container.querySelector('.install-prompt-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                handleCancel();
            }
        });
    }

    handleAppInstalled() {
        console.log('PWA was installed');
        this.state.isInstalled = true;
        this.state.canInstall = false;
        
        // Update install data
        const installData = this.getInstallData();
        installData.installed = true;
        installData.installDate = Date.now();
        this.saveInstallData(installData);
        
        // Track installation
        if (this.config.trackInstallations) {
            this.trackEvent('app_installed', {
                pageViews: this.metrics.pageViews,
                engagementTime: this.metrics.engagementTime
            });
        }
        
        // Show thank you message
        this.showInstallSuccessMessage();
        
        // Initialize installed app features
        this.initializeInstalledFeatures();
    }

    showInstallSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-install-success';
        message.innerHTML = `
            <div class="success-message">
                <h3>Thanks for installing ${this.config.appName}!</h3>
                <p>You can now access the app from your home screen.</p>
                <button class="success-close">Got it</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        message.querySelector('.success-close').addEventListener('click', () => {
            message.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.remove();
            }
        }, 5000);
    }

    // App Shell Management
    async initializeAppShell() {
        const appShell = {
            header: this.createAppHeader(),
            navigation: this.createAppNavigation(),
            main: this.createMainContent(),
            footer: this.createAppFooter()
        };

        // Apply app shell structure
        document.body.innerHTML = '';
        Object.values(appShell).forEach(component => {
            if (component) {
                document.body.appendChild(component);
            }
        });

        // Setup routing for SPA navigation
        this.setupSPARouting();
        
        return appShell;
    }

    createAppHeader() {
        const header = document.createElement('header');
        header.className = 'app-header';
        header.innerHTML = `
            <div class="header-content">
                <div class="app-title">
                    <img src="/icons/icon-192x192.png" alt="${this.config.appName}" class="app-logo">
                    <h1>${this.config.shortName}</h1>
                </div>
                <div class="header-actions">
                    <button class="menu-toggle" aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
            <div class="connection-status" id="connection-status">
                <span class="status-indicator ${this.state.isOnline ? 'online' : 'offline'}"></span>
                <span class="status-text">${this.state.isOnline ? 'Online' : 'Offline'}</span>
            </div>
        `;
        
        return header;
    }

    createAppNavigation() {
        const nav = document.createElement('nav');
        nav.className = 'app-navigation';
        nav.innerHTML = `
            <ul class="nav-menu">
                <li><a href="/" data-route="/">Home</a></li>
                <li><a href="/dashboard" data-route="/dashboard">Dashboard</a></li>
                <li><a href="/profile" data-route="/profile">Profile</a></li>
                <li><a href="/settings" data-route="/settings">Settings</a></li>
            </ul>
        `;
        
        return nav;
    }

    createMainContent() {
        const main = document.createElement('main');
        main.className = 'app-main';
        main.id = 'main-content';
        main.innerHTML = `
            <div class="content-container">
                <div id="page-content">
                    <!-- Dynamic content will be loaded here -->
                </div>
            </div>
        `;
        
        return main;
    }

    createAppFooter() {
        const footer = document.createElement('footer');
        footer.className = 'app-footer';
        footer.innerHTML = `
            <div class="footer-content">
                <p>&copy; 2023 ${this.config.appName}</p>
                <div class="footer-actions">
                    ${!this.state.isInstalled && this.state.canInstall ? 
                        '<button class="install-footer-btn">Install App</button>' : ''}
                </div>
            </div>
        `;
        
        return footer;
    }

    // SPA Routing
    setupSPARouting() {
        const routes = {
            '/': () => this.loadPage('home'),
            '/dashboard': () => this.loadPage('dashboard'),
            '/profile': () => this.loadPage('profile'),
            '/settings': () => this.loadPage('settings')
        };

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigateTo(route);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const route = window.location.pathname;
            if (routes[route]) {
                routes[route]();
            }
        });

        // Load initial route
        const currentRoute = window.location.pathname;
        if (routes[currentRoute]) {
            routes[currentRoute]();
        } else {
            this.navigateTo('/');
        }
    }

    navigateTo(route) {
        history.pushState({}, '', route);
        this.loadPage(route.substring(1) || 'home');
    }

    async loadPage(pageName) {
        const contentContainer = document.getElementById('page-content');
        if (!contentContainer) return;

        // Show loading state
        contentContainer.innerHTML = '<div class="loading">Loading...</div>';

        try {
            // Load page content (could be from cache or network)
            const content = await this.fetchPageContent(pageName);
            contentContainer.innerHTML = content;
            
            // Track page view
            this.trackEvent('page_view', { page: pageName });
        } catch (error) {
            console.error('Failed to load page:', error);
            contentContainer.innerHTML = `
                <div class="error">
                    <h2>Oops! Something went wrong</h2>
                    <p>Unable to load this page. Please try again.</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }

    async fetchPageContent(pageName) {
        // Try to fetch from network first, fallback to cache
        try {
            const response = await fetch(`/api/pages/${pageName}`);
            if (response.ok) {
                return await response.text();
            }
            throw new Error('Network response not ok');
        } catch (error) {
            // Fallback to cached content or static content
            return this.getOfflinePageContent(pageName);
        }
    }

    getOfflinePageContent(pageName) {
        const offlineContent = {
            home: `
                <div class="page-content">
                    <h2>Welcome to ${this.config.appName}</h2>
                    <p>This is the home page. You're currently ${this.state.isOnline ? 'online' : 'offline'}.</p>
                    ${this.state.isInstalled ? '' : 
                      '<p>Consider installing this app for the best experience!</p>'}
                </div>
            `,
            dashboard: `
                <div class="page-content">
                    <h2>Dashboard</h2>
                    <div class="dashboard-cards">
                        <div class="card">
                            <h3>Quick Stats</h3>
                            <p>Page Views: ${this.metrics.pageViews}</p>
                            <p>Engagement Time: ${Math.round(this.metrics.engagementTime / 1000)}s</p>
                        </div>
                        <div class="card">
                            <h3>App Status</h3>
                            <p>Installed: ${this.state.isInstalled ? 'Yes' : 'No'}</p>
                            <p>Online: ${this.state.isOnline ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            `,
            profile: `
                <div class="page-content">
                    <h2>Profile</h2>
                    <form class="profile-form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" value="John Doe">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" value="john@example.com">
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            `,
            settings: `
                <div class="page-content">
                    <h2>Settings</h2>
                    <div class="settings-options">
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" ${this.config.enablePushNotifications ? 'checked' : ''}>
                                Enable Push Notifications
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" ${this.config.enableBackgroundSync ? 'checked' : ''}>
                                Enable Background Sync
                            </label>
                        </div>
                        <div class="setting-item">
                            <button class="clear-cache-btn">Clear Cache</button>
                        </div>
                        ${!this.state.isInstalled && this.state.canInstall ? `
                            <div class="setting-item">
                                <button class="install-app-btn">Install App</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `
        };

        return offlineContent[pageName] || `
            <div class="page-content">
                <h2>Page Not Found</h2>
                <p>The requested page could not be found.</p>
                <a href="/" data-route="/">Go Home</a>
            </div>
        `;
    }

    // Feature Initialization
    async initializeFeatures() {
        if (this.config.enablePushNotifications) {
            await this.setupPushNotifications();
        }

        if (this.config.enableBackgroundSync) {
            this.setupBackgroundSync();
        }

        if (this.config.enablePeriodicSync) {
            await this.setupPeriodicSync();
        }

        // Initialize other PWA features
        this.setupBadging();
        this.setupSharing();
        this.setupFileHandling();
    }

    async initializeInstalledFeatures() {
        // Features that are only available when installed
        await this.setupShortcuts();
        this.setupAppBadging();
        this.handleInstalledAppSpecificFeatures();
    }

    // Update Management
    setupUpdateDetection() {
        if (!this.config.enableUpdateNotifications) return;

        // Check for updates periodically
        setInterval(() => {
            this.checkForUpdates();
        }, this.config.updateCheckInterval);

        // Check immediately
        setTimeout(() => this.checkForUpdates(), 5000);
    }

    async checkForUpdates() {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    await registration.update();
                }
            } catch (error) {
                console.error('Update check failed:', error);
            }
        }
    }

    handleSWMessage(event) {
        const { type, data } = event.data;

        switch (type) {
            case 'UPDATE_AVAILABLE':
                this.handleUpdateAvailable(data);
                break;
            case 'UPDATE_INSTALLED':
                this.handleUpdateInstalled(data);
                break;
            case 'OFFLINE_PAGE_LOADED':
                this.handleOfflinePageLoaded(data);
                break;
        }
    }

    handleUpdateAvailable(data) {
        this.state.hasUpdate = true;
        this.showUpdateNotification();
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-message">
                <div class="update-content">
                    <h4>Update Available</h4>
                    <p>A new version of ${this.config.appName} is ready to install.</p>
                </div>
                <div class="update-actions">
                    <button class="update-btn">Update Now</button>
                    <button class="dismiss-btn">Later</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        const updateBtn = notification.querySelector('.update-btn');
        const dismissBtn = notification.querySelector('.dismiss-btn');

        updateBtn.addEventListener('click', () => {
            this.applyUpdate();
            notification.remove();
        });

        dismissBtn.addEventListener('click', () => {
            notification.remove();
        });
    }

    async applyUpdate() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    // Engagement Tracking
    setupEngagementTracking() {
        this.engagementStartTime = Date.now();
        this.isEngaged = true;

        // Track engagement time
        this.engagementInterval = setInterval(() => {
            if (this.isEngaged) {
                this.metrics.engagementTime += 1000;
                
                // Save engagement time periodically
                const installData = this.getInstallData();
                installData.totalEngagement = (installData.totalEngagement || 0) + 1000;
                this.saveInstallData(installData);
            }
        }, 1000);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.isEngaged = false;
            this.trackEvent('page_hidden');
        } else {
            this.isEngaged = true;
            this.engagementStartTime = Date.now();
            this.trackEvent('page_visible');
        }
    }

    handleBeforeUnload() {
        // Save final engagement metrics
        const sessionTime = Date.now() - this.engagementStartTime;
        this.trackEvent('session_end', { sessionTime });
        
        // Clear interval
        if (this.engagementInterval) {
            clearInterval(this.engagementInterval);
        }
    }

    // Network Status Management
    handleOnline() {
        this.state.isOnline = true;
        this.updateConnectionStatus();
        this.trackEvent('came_online');
    }

    handleOffline() {
        this.state.isOnline = false;
        this.updateConnectionStatus();
        this.trackEvent('went_offline');
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            const indicator = statusElement.querySelector('.status-indicator');
            const text = statusElement.querySelector('.status-text');
            
            if (this.state.isOnline) {
                indicator.className = 'status-indicator online';
                text.textContent = 'Online';
            } else {
                indicator.className = 'status-indicator offline';
                text.textContent = 'Offline';
            }
        }
    }

    // Advanced PWA Features
    async setupPushNotifications() {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            console.log('Push notifications not supported');
            return;
        }

        let permission = Notification.permission;
        
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }

        if (permission === 'granted') {
            await this.subscribeToPush();
        }
    }

    async setupShortcuts() {
        // App shortcuts are defined in the manifest
        // This method could handle dynamic shortcut management
        console.log('App shortcuts configured in manifest');
    }

    setupBadging() {
        if ('setAppBadge' in navigator) {
            // Example: Set badge count
            this.setBadgeCount = (count) => {
                navigator.setAppBadge(count);
            };

            this.clearBadge = () => {
                navigator.clearAppBadge();
            };
        }
    }

    setupSharing() {
        if ('share' in navigator) {
            this.shareContent = async (data) => {
                try {
                    await navigator.share(data);
                    this.trackEvent('content_shared', { title: data.title });
                } catch (error) {
                    console.error('Sharing failed:', error);
                }
            };
        }
    }

    setupFileHandling() {
        if ('serviceWorker' in navigator && 'getRegistration' in navigator.serviceWorker) {
            // File handling registration would be done in manifest
            console.log('File handling configured in manifest');
        }
    }

    // Data Management
    getInstallData() {
        const stored = localStorage.getItem('pwa-install-data');
        return stored ? JSON.parse(stored) : {};
    }

    saveInstallData(data) {
        localStorage.setItem('pwa-install-data', JSON.stringify(data));
    }

    // Analytics and Tracking
    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            installed: this.state.isInstalled,
            online: this.state.isOnline,
            ...data
        };

        console.log('PWA Event:', eventData);

        // Send to analytics service
        if (this.config.analyticsEndpoint) {
            fetch(this.config.analyticsEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            }).catch(error => console.error('Analytics failed:', error));
        }
    }

    // Public API Methods
    async showInstallDialog() {
        if (this.state.installPromptDeferred) {
            await this.showInstallPrompt();
        }
    }

    getMetrics() {
        return { ...this.metrics };
    }

    getState() {
        return { ...this.state };
    }

    async clearAllData() {
        // Clear all stored data
        localStorage.removeItem('pwa-install-data');
        
        // Clear caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // Clear IndexedDB
        if ('indexedDB' in window) {
            // Implementation depends on specific databases used
        }

        this.trackEvent('data_cleared');
    }
}

// Web App Manifest Generator
class ManifestGenerator {
    static generate(config) {
        const manifest = {
            name: config.appName || 'PWA App',
            short_name: config.shortName || 'PWA',
            description: config.description || 'A Progressive Web App',
            start_url: config.startUrl || '/',
            display: config.display || 'standalone',
            orientation: config.orientation || 'portrait-primary',
            theme_color: config.themeColor || '#000000',
            background_color: config.backgroundColor || '#ffffff',
            scope: config.scope || '/',
            
            icons: config.icons || [
                {
                    src: '/icons/icon-72x72.png',
                    sizes: '72x72',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: '/icons/icon-96x96.png',
                    sizes: '96x96',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: '/icons/icon-128x128.png',
                    sizes: '128x128',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: '/icons/icon-144x144.png',
                    sizes: '144x144',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: '/icons/icon-152x152.png',
                    sizes: '152x152',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: '/icons/icon-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: '/icons/icon-384x384.png',
                    sizes: '384x384',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: '/icons/icon-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable any'
                }
            ],

            shortcuts: config.shortcuts || [
                {
                    name: 'New Post',
                    short_name: 'New',
                    description: 'Create a new post',
                    url: '/new',
                    icons: [{ src: '/icons/new-post.png', sizes: '192x192' }]
                },
                {
                    name: 'Dashboard',
                    short_name: 'Dashboard',
                    description: 'View dashboard',
                    url: '/dashboard',
                    icons: [{ src: '/icons/dashboard.png', sizes: '192x192' }]
                }
            ],

            categories: config.categories || ['productivity', 'utilities'],
            lang: config.lang || 'en',
            dir: config.dir || 'ltr',

            // Protocol handlers
            protocol_handlers: config.protocolHandlers || [],

            // File handlers
            file_handlers: config.fileHandlers || [],

            // Share target
            share_target: config.shareTarget || {
                action: '/share',
                method: 'POST',
                enctype: 'multipart/form-data',
                params: {
                    title: 'title',
                    text: 'text',
                    url: 'url',
                    files: [
                        {
                            name: 'files',
                            accept: ['image/*', 'text/*']
                        }
                    ]
                }
            }
        };

        return manifest;
    }

    static injectManifest(manifest, linkId = 'app-manifest') {
        // Remove existing manifest link
        const existingLink = document.getElementById(linkId);
        if (existingLink) {
            existingLink.remove();
        }

        // Create blob URL for manifest
        const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
            type: 'application/json'
        });
        const manifestUrl = URL.createObjectURL(manifestBlob);

        // Create and inject manifest link
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'manifest';
        link.href = manifestUrl;
        document.head.appendChild(link);
    }
}

// Initialize PWA
document.addEventListener('DOMContentLoaded', async () => {
    // Generate and inject manifest
    const manifest = ManifestGenerator.generate({
        appName: 'Demo PWA App',
        shortName: 'DemoPWA',
        description: 'A comprehensive Progressive Web App demo',
        themeColor: '#2196f3',
        backgroundColor: '#ffffff'
    });
    
    ManifestGenerator.injectManifest(manifest);

    // Initialize PWA Manager
    const pwaManager = new PWAManager({
        appName: 'Demo PWA App',
        shortName: 'DemoPWA',
        enableInstallPrompt: true,
        enableUpdateNotifications: true,
        enablePushNotifications: true,
        trackInstallations: true
    });

    // Make PWA manager globally accessible
    window.pwaManager = pwaManager;

    // Initialize app shell for SPA mode
    if (window.location.search.includes('spa=true')) {
        await pwaManager.initializeAppShell();
    }
});

// CSS Styles for PWA Components
const pwaStyles = `
    <style>
    .pwa-install-prompt {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .install-prompt-modal {
        background: white;
        border-radius: 12px;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .install-prompt-header {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
        position: relative;
    }

    .app-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        margin-right: 15px;
    }

    .app-info h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }

    .app-info p {
        margin: 5px 0 0;
        color: #666;
        font-size: 14px;
    }

    .close-prompt {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
    }

    .install-prompt-benefits {
        padding: 20px;
    }

    .install-prompt-benefits ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .install-prompt-benefits li {
        margin: 8px 0;
        color: #4caf50;
        font-size: 14px;
    }

    .install-prompt-actions {
        padding: 20px;
        display: flex;
        gap: 10px;
    }

    .install-button {
        flex: 1;
        padding: 12px 24px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
    }

    .cancel-button {
        padding: 12px 24px;
        background: none;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
    }

    .pwa-update-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        z-index: 9999;
    }

    .update-message {
        padding: 16px;
    }

    .update-content h4 {
        margin: 0 0 8px;
        font-size: 16px;
    }

    .update-content p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }

    .update-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
    }

    .update-btn, .dismiss-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
    }

    .update-btn {
        background: #2196f3;
        color: white;
    }

    .dismiss-btn {
        background: #f5f5f5;
        color: #333;
    }

    .connection-status {
        padding: 8px 16px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .status-indicator.online {
        background: #4caf50;
    }

    .status-indicator.offline {
        background: #f44336;
    }

    .app-header {
        background: #2196f3;
        color: white;
        padding: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
    }

    .app-title {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .app-logo {
        width: 32px;
        height: 32px;
        border-radius: 4px;
    }

    .loading {
        text-align: center;
        padding: 40px;
        color: #666;
    }

    .error {
        text-align: center;
        padding: 40px;
    }

    .error h2 {
        color: #f44336;
        margin-bottom: 16px;
    }

    .error button {
        padding: 10px 20px;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 16px;
    }
    </style>
`;

// Inject PWA styles
document.head.insertAdjacentHTML('beforeend', pwaStyles);
```

## Detailed Code Analysis: Understanding PWA Implementation

### PWA Manager Architecture

The PWA Manager orchestrates all PWA functionality through several key systems:

1. **Installation Management**: Handles app installation prompts, criteria evaluation, and user experience
2. **App Shell Architecture**: Creates the foundational structure for single-page application behavior
3. **Update Management**: Manages Service Worker updates and notifies users of new versions
4. **Feature Integration**: Coordinates advanced PWA features like push notifications and background sync

### Installation Strategy

The installation system implements intelligent criteria-based prompting:

1. **Engagement Tracking**: Monitors page views, session duration, and user interaction
2. **Timing Strategy**: Waits for optimal moments to show install prompts
3. **Custom UI**: Provides branded installation experience instead of browser defaults
4. **Success Tracking**: Monitors installation success rates and user feedback

### App Shell Pattern Implementation

The app shell architecture separates application infrastructure from content:

1. **Static Shell**: Header, navigation, and footer cached for instant loading
2. **Dynamic Content**: Page content loaded on-demand with caching strategy
3. **SPA Routing**: Client-side navigation without full page reloads
4. **Offline Fallbacks**: Cached content when network requests fail

### Manifest Generation

The dynamic manifest generator creates compliant PWA manifests:

1. **Icon Management**: Comprehensive icon sizes for all platforms
2. **App Shortcuts**: Quick actions accessible from app launcher
3. **File Handling**: Integration with system file associations
4. **Share Targets**: Allows app to receive shared content from other apps

## Real-World PWA Implementation

### Progressive Enhancement Strategy
```javascript
// Enhance existing website with PWA features
const enhanceWithPWA = {
    basic: () => {
        // Add manifest and basic caching
        addManifest();
        registerServiceWorker();
    },
    
    intermediate: () => {
        // Add install prompts and offline pages
        setupInstallPrompts();
        createOfflinePages();
    },
    
    advanced: () => {
        // Add push notifications and background sync
        enablePushNotifications();
        setupBackgroundSync();
    }
};
```

### Performance Optimization
```javascript
// PWA performance optimization
const pwaPerformance = {
    preloadCriticalResources() {
        // Preload essential resources
        const criticalResources = ['/css/critical.css', '/js/app.js'];
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            document.head.appendChild(link);
        });
    },
    
    lazyLoadNonCritical() {
        // Lazy load non-critical features
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadNonCriticalFeature(entry.target);
                }
            });
        });
        
        document.querySelectorAll('[data-lazy]').forEach(el => {
            observer.observe(el);
        });
    }
};
```

### Analytics and Monitoring
```javascript
// PWA analytics tracking
const pwaAnalytics = {
    trackInstallFunnel() {
        // Track installation funnel
        const events = [
            'install_prompt_shown',
            'install_prompt_clicked', 
            'install_completed',
            'first_launch_after_install'
        ];
        
        events.forEach(event => {
            window.addEventListener(event, (data) => {
                this.sendAnalytics(event, data);
            });
        });
    },
    
    trackOfflineUsage() {
        // Monitor offline behavior
        window.addEventListener('offline', () => {
            this.startOfflineSession();
        });
        
        window.addEventListener('online', () => {
            this.endOfflineSession();
        });
    }
};
```

## Testing PWA Features

### Installation Testing
```javascript
// Test PWA installation flow
const testInstallation = {
    async simulateInstallCriteria() {
        // Simulate meeting install criteria
        localStorage.setItem('pwa-install-data', JSON.stringify({
            pageViews: 5,
            firstVisit: Date.now() - (4 * 24 * 60 * 60 * 1000), // 4 days ago
            totalEngagement: 60000 // 1 minute
        }));
        
        // Trigger criteria evaluation
        await pwaManager.checkInstallability();
        
        expect(pwaManager.state.canInstall).toBe(true);
    },
    
    async testInstallPrompt() {
        // Mock beforeinstallprompt event
        const mockEvent = new CustomEvent('beforeinstallprompt');
        mockEvent.prompt = jest.fn().mockResolvedValue({ outcome: 'accepted' });
        mockEvent.userChoice = Promise.resolve({ outcome: 'accepted' });
        
        window.dispatchEvent(mockEvent);
        
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    }
};
```

### Offline Testing
```javascript
// Test offline functionality
const testOfflineFeatures = {
    async simulateOffline() {
        // Override navigator.onLine
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: false
        });
        
        // Dispatch offline event
        window.dispatchEvent(new Event('offline'));
        
        // Test offline page loading
        const response = await fetch('/test-page');
        expect(response.status).toBe(503); // Service Worker offline response
    }
};
```

## Summary

Progressive Web Apps represent the future of web application development by combining the reach of the web with the engagement of native apps. This comprehensive PWA framework provides:

- **Installation Management**: Intelligent install prompts with engagement-based criteria
- **App Shell Architecture**: Fast-loading, offline-capable application structure  
- **Update Management**: Seamless updates with user notification and control
- **Advanced Features**: Push notifications, background sync, file handling, and more
- **Performance Optimization**: Resource preloading, lazy loading, and caching strategies
- **Analytics Integration**: Comprehensive tracking of PWA-specific metrics
- **Cross-Platform Compatibility**: Works across desktop, mobile, and tablet devices

PWAs enable web applications to compete directly with native apps while maintaining the fundamental advantages of the web platform: discoverability, linkability, and universal access. By implementing progressive enhancement and offline-first principles, PWAs create resilient, engaging user experiences that work reliably across all devices and network conditions.

Remember: The best PWAs feel indistinguishable from native apps while retaining the web's core strengths. Focus on performance, reliability, and user engagement to create truly compelling progressive web experiences.
