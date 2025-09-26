---
title: "Code Splitting & Lazy Loading"
description: "Master code splitting and lazy loading techniques to optimize application startup time. Learn dynamic imports, route-based splitting, component lazy loading, and intelligent resource management for better performance."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: "Dynamic Imports - MDN"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports"
    description: "Official documentation for dynamic imports"
  - title: "Code Splitting - Webpack"
    type: "reference"
    url: "https://webpack.js.org/guides/code-splitting/"
    description: "Webpack's guide to code splitting strategies"
  - title: "Intersection Observer API"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
    description: "API for lazy loading based on element visibility"
  - title: "Web Performance - Lazy Loading"
    type: "article"
    url: "https://web.dev/lazy-loading/"
    description: "Best practices for lazy loading resources"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811611/Portfolio/javaScriptCourse/images/all%20title%20images/45_dmgmu1.png)

Code Splitting & Lazy Loading – Intelligent Resource Management
===============================================================

Imagine you're designing a **smart streaming service** 📺 that needs to deliver content efficiently to millions of users worldwide:

- **Content Segmentation** 🎬 - Instead of downloading entire movies upfront, the service splits content into small chunks and loads only what's currently being watched, plus a small buffer for smooth playback.

- **Predictive Loading** 🔮 - The system analyzes user behavior: if someone watches action movies, it pre-loads action movie thumbnails and trailers, but doesn't waste bandwidth on romantic comedy content.

- **Progressive Enhancement** 📈 - Users can start watching immediately with basic quality, while higher quality streams load in the background. Additional features like subtitles, audio tracks, and bonus content load only when requested.

- **Geographic Optimization** 🌍 - Different regions get different content packages. European users don't download content restricted to Asia, and mobile users get optimized packages different from desktop users.

- **Intelligent Caching** 🧠 - Frequently accessed content stays readily available, while rarely used content (like settings pages or help documentation) loads only when needed.

- **Resource Priorities** 🎯 - Critical playback functionality loads first, social features load when the user interacts with them, and administrative features load only for premium users.

- **Adaptive Loading** 📱 - The system adjusts loading strategies based on device capability, network speed, and user preferences. Slow connections get smaller chunks, powerful devices get enhanced features.

**Code splitting and lazy loading work exactly like this intelligent streaming service.** Instead of loading entire applications upfront, you strategically divide and load code:

- **Dynamic Imports** - Load JavaScript modules only when needed, not at application startup
- **Route-based Splitting** - Load page components only when users navigate to them
- **Component Lazy Loading** - Load UI components when they become visible or interactive
- **Resource Prioritization** - Load critical functionality first, enhancements later
- **Intelligent Bundling** - Group related functionality together while keeping bundles optimally sized
- **Progressive Loading** - Start with core functionality, enhance experience as more code loads

Understanding these techniques is essential for building fast-loading applications that scale gracefully across different devices, network conditions, and user scenarios.

## The Theoretical Foundation: Resource Loading Strategy 📐

### Understanding Bundle Optimization Theory

**Code splitting is based on principles from systems optimization and resource management:**

**Load Time Distribution:**
- **Critical Path**: Essential code needed for initial functionality
- **Above-the-fold**: Code needed for visible content
- **Below-the-fold**: Code for content that requires user interaction
- **Progressive Enhancement**: Optional features that improve experience

**Bundle Theory:**
- **Monolithic Bundle**: Single large file containing all code
- **Split Bundles**: Multiple smaller files loaded as needed
- **Shared Dependencies**: Common code extracted into separate bundles
- **Entry Points**: Different starting points for different user flows

### Cache Optimization and HTTP/2

**Modern loading strategies leverage browser and network capabilities:**

**Browser Caching:**
- **Static Assets**: Long-term caching for unchanging code
- **Versioning**: Cache invalidation through filename hashing
- **Incremental Updates**: Only download changed code parts
- **Cache Hierarchies**: Different caching strategies for different asset types

**HTTP/2 Advantages:**
- **Multiplexing**: Multiple concurrent requests without blocking
- **Server Push**: Proactive resource delivery
- **Header Compression**: Reduced overhead for many small files
- **Stream Prioritization**: Critical resources delivered first

**Bundle Size vs Request Count:**
- **HTTP/1.1**: Fewer, larger bundles (reduce round trips)
- **HTTP/2**: Many smaller bundles (better caching and parallelism)
- **Optimal Size**: Balance between cache efficiency and loading speed

### Lazy Loading Theory: Demand-Driven Loading

**Lazy loading implements just-in-time resource management:**

**Visibility-Based Loading:**
- **Intersection Observer**: Efficient detection of element visibility
- **Viewport Awareness**: Load content as it approaches visible area
- **Progressive Disclosure**: Reveal functionality as users need it

**Interaction-Based Loading:**
- **Event-Driven**: Load on user actions (click, hover, focus)
- **Predictive Loading**: Anticipate user intentions
- **Context-Aware**: Load based on user behavior patterns

**Performance Considerations:**
- **Loading Priorities**: Critical vs nice-to-have functionality
- **Waterfall Prevention**: Avoid sequential loading dependencies
- **Preloading Strategies**: Balance between performance and bandwidth usage

### Modern JavaScript Module System

**ES6 modules enable sophisticated loading strategies:**

**Static Imports:**
- **Build-Time Analysis**: Bundlers can analyze dependencies
- **Tree Shaking**: Remove unused code automatically
- **Dependency Graphs**: Understand relationships between modules

**Dynamic Imports:**
- **Runtime Loading**: Load modules based on conditions
- **Code Splitting Points**: Define where bundles should split
- **Lazy Evaluation**: Execute code only when needed

**Module Federation:**
- **Micro-frontends**: Independent applications sharing code
- **Runtime Integration**: Combine modules from different sources
- **Version Management**: Handle different versions of shared dependencies

## The Problem: Monolithic Loading and Poor Resource Management 😤

### Massive Bundle Problems

**Without code splitting, applications become slow and inefficient:**

```javascript
// Problematic: Everything loaded upfront in a massive bundle
import React from 'react';
import ReactDOM from 'react-dom';

// Heavy data visualization libraries (1MB+)
import * as D3 from 'd3';
import * as Plotly from 'plotly.js';
import * as Three from 'three';

// Heavy UI component libraries
import { DatePicker, Table, Modal, Charts } from 'heavy-ui-library';

// Analytics and tracking
import GoogleAnalytics from 'analytics-library';
import HotjarTracking from 'hotjar-library';
import FullstoryRecording from 'fullstory-library';

// Admin-only functionality loaded for all users!
import AdminPanel from './admin/AdminPanel';
import UserManagement from './admin/UserManagement';
import SystemSettings from './admin/SystemSettings';
import DatabaseTools from './admin/DatabaseTools';

// Rarely used utilities
import PDFGenerator from 'pdf-generation-library';
import ExcelExporter from 'excel-export-library';
import ImageEditor from 'image-editing-library';
import VideoProcessor from 'video-processing-library';

// International features for all users
import TranslationEngine from 'translation-library';
import CurrencyConverter from 'currency-library';
import TimezoneHandler from 'timezone-library';

// Development and debugging tools in production!
import DevTools from 'development-tools';
import PerformanceProfiler from 'performance-profiler';
import MemoryAnalyzer from 'memory-analyzer';

class MonolithicApplication extends React.Component {
    constructor(props) {
        super(props);
        
        // Initialize ALL features upfront
        this.state = {
            user: null,
            currentPage: 'home',
            data: [],
            visualizations: {},
            adminMode: false,
            
            // Heavy initialization for features that might never be used
            chartEngine: new Plotly.PlotlyRenderer(),
            threeDEngine: new Three.WebGLRenderer(),
            pdfGenerator: new PDFGenerator(),
            imageEditor: new ImageEditor(),
            videoProcessor: new VideoProcessor(),
            translationEngine: new TranslationEngine(),
            
            // Analytics loaded for everyone
            analytics: new GoogleAnalytics(),
            tracking: new HotjarTracking(),
            recording: new FullstoryRecording()
        };
        
        // Load massive datasets upfront
        this.loadAllData();
        this.initializeAllFeatures();
        
        console.log('Monolithic app initialized with bundle size: ~15MB');
    }
    
    async loadAllData() {
        try {
            // Load data that 90% of users never see
            const [
                userData,
                adminData,
                analyticsData,
                reportingData,
                systemData
            ] = await Promise.all([
                fetch('/api/users').then(r => r.json()),
                fetch('/api/admin/all-data').then(r => r.json()), // Heavy admin data
                fetch('/api/analytics/full-report').then(r => r.json()), // Massive analytics
                fetch('/api/reports/all').then(r => r.json()), // All historical reports
                fetch('/api/system/diagnostics').then(r => r.json()) // System diagnostics
            ]);
            
            this.setState({
                userData,
                adminData,
                analyticsData,
                reportingData,
                systemData
            });
            
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }
    
    initializeAllFeatures() {
        // Initialize features most users never use
        this.initializeAdminFeatures();
        this.initializeDataVisualization();
        this.initializeMediaProcessing();
        this.initializeInternationalization();
        this.initializeDevTools();
    }
    
    initializeAdminFeatures() {
        // Heavy admin initialization for ALL users
        this.adminPanel = new AdminPanel({
            userManagement: new UserManagement(),
            systemSettings: new SystemSettings(),
            databaseTools: new DatabaseTools()
        });
        
        console.log('Admin features initialized (even for non-admin users)');
    }
    
    initializeDataVisualization() {
        // Heavy visualization engines loaded for everyone
        this.visualizationEngines = {
            d3: D3,
            plotly: this.state.chartEngine,
            three: this.state.threeDEngine
        };
        
        // Pre-render expensive default charts
        this.defaultCharts = this.generateDefaultCharts();
        
        console.log('All visualization engines loaded');
    }
    
    generateDefaultCharts() {
        // Expensive chart generation happens for everyone
        const charts = {};
        
        // Generate complex 3D visualizations
        charts.threeDChart = this.state.threeDEngine.generateComplexScene();
        
        // Generate heavy statistical charts
        charts.statisticalCharts = this.state.chartEngine.generateFullSuite();
        
        return charts;
    }
    
    initializeMediaProcessing() {
        // Heavy media processing libraries loaded for all
        this.mediaProcessors = {
            pdf: this.state.pdfGenerator,
            image: this.state.imageEditor,
            video: this.state.videoProcessor
        };
        
        // Pre-load processing templates
        this.mediaTemplates = this.loadAllMediaTemplates();
        
        console.log('Media processing engines loaded');
    }
    
    loadAllMediaTemplates() {
        // Load massive template files
        return {
            pdfTemplates: this.loadPDFTemplates(), // 2MB of templates
            imageFilters: this.loadImageFilters(), // 1MB of filters
            videoEffects: this.loadVideoEffects()  // 3MB of effects
        };
    }
    
    initializeInternationalization() {
        // Load ALL language packs for everyone
        this.translations = this.state.translationEngine.loadAllLanguages();
        
        // Load ALL currency data
        this.currencies = this.loadAllCurrencyData();
        
        // Load ALL timezone data
        this.timezones = this.loadAllTimezoneData();
        
        console.log('All internationalization data loaded');
    }
    
    initializeDevTools() {
        // Load development tools in production!
        if (process.env.NODE_ENV === 'production') {
            // This shouldn't happen but it does in monolithic apps
            this.devTools = new DevTools();
            this.profiler = new PerformanceProfiler();
            this.memoryAnalyzer = new MemoryAnalyzer();
            
            console.log('Dev tools loaded in production (mistake!)');
        }
    }
    
    // Component that tries to do everything
    render() {
        const { currentPage, user, adminMode } = this.state;
        
        return (
            <div className="monolithic-app">
                {/* Always render heavy admin UI components */}
                {adminMode && (
                    <AdminPanel
                        userManagement={this.adminPanel.userManagement}
                        systemSettings={this.adminPanel.systemSettings}
                        databaseTools={this.adminPanel.databaseTools}
                    />
                )}
                
                {/* Heavy components always in DOM */}
                <div style={{ display: currentPage === 'charts' ? 'block' : 'none' }}>
                    <div ref={this.state.threeDEngine.domElement} />
                    <div ref={this.state.chartEngine.domElement} />
                </div>
                
                {/* All page components always mounted */}
                <HomePage style={{ display: currentPage === 'home' ? 'block' : 'none' }} />
                <ProfilePage style={{ display: currentPage === 'profile' ? 'block' : 'none' }} />
                <SettingsPage style={{ display: currentPage === 'settings' ? 'block' : 'none' }} />
                <ReportsPage style={{ display: currentPage === 'reports' ? 'block' : 'none' }} />
                <AdminPage style={{ display: currentPage === 'admin' ? 'block' : 'none' }} />
                
                {/* Heavy always-present features */}
                <div className="heavy-features">
                    <PDFGenerator ref={this.state.pdfGenerator} />
                    <ImageEditor ref={this.state.imageEditor} />
                    <VideoProcessor ref={this.state.videoProcessor} />
                </div>
                
                {/* Analytics components always active */}
                <div className="tracking">
                    {this.state.analytics.component}
                    {this.state.tracking.component}
                    {this.state.recording.component}
                </div>
            </div>
        );
    }
    
    // Methods that reference all the heavy imports
    exportToPDF() {
        return this.state.pdfGenerator.generate(this.state.userData);
    }
    
    processImage(imageData) {
        return this.state.imageEditor.process(imageData);
    }
    
    createVisualization(data) {
        return this.visualizationEngines.plotly.create(data);
    }
    
    switchLanguage(language) {
        return this.state.translationEngine.switch(language);
    }
}

// Helper components that are always loaded
const HomePage = () => (
    <div>
        <h1>Home Page</h1>
        {/* Even simple pages reference heavy dependencies */}
        <Chart data={[]} engine={window.heavyChartEngine} />
    </div>
);

const ProfilePage = () => (
    <div>
        <h1>Profile Page</h1>
        <ImageEditor /> {/* Heavy component always loaded */}
    </div>
);

const SettingsPage = () => (
    <div>
        <h1>Settings</h1>
        <InternationalSettings /> {/* All i18n data loaded */}
    </div>
);

const ReportsPage = () => (
    <div>
        <h1>Reports</h1>
        <DataVisualization /> {/* Heavy viz engines loaded */}
        <PDFExport /> {/* PDF generation ready */}
    </div>
);

const AdminPage = () => (
    <div>
        <h1>Admin Panel</h1>
        <UserManagement /> {/* Heavy admin tools */}
        <SystemDiagnostics /> {/* System tools */}
    </div>
);

// Application bootstrap that loads everything
ReactDOM.render(<MonolithicApplication />, document.getElementById('root'));

console.log('Application started with 15MB bundle size');
console.log('Time to interactive: 8+ seconds on average devices');
console.log('First meaningful paint: 4+ seconds');

// Problems with this approach:
// 1. Massive initial bundle size (15MB+)
// 2. Long loading times (8+ seconds to interactive)
// 3. Wasted bandwidth (90% of features never used by typical user)
// 4. Poor mobile performance (bundle too large for slow connections)
// 5. Memory consumption (all features initialized upfront)
// 6. Cache inefficiency (one change invalidates entire bundle)
// 7. Development complexity (hard to optimize specific features)
// 8. User experience (long wait before any functionality available)

// Real-world impact:
// - 40% of users abandon the site during loading
// - Mobile users especially affected
// - SEO penalties for slow loading
// - High server bandwidth costs
// - Poor Core Web Vitals scores
// - Reduced conversion rates
```

## Code Splitting Implementation 🎯

### Advanced Code Splitting with Dynamic Imports

**Implementing sophisticated code splitting strategies:**

```javascript
// Advanced Code Splitting with Intelligent Loading
class SmartApplicationLoader {
    constructor(options = {}) {
        this.options = {
            prefetchStrategy: options.prefetchStrategy || 'hover', // 'hover', 'viewport', 'idle'
            chunkPriority: options.chunkPriority || 'high',
            cacheStrategy: options.cacheStrategy || 'aggressive',
            ...options
        };
        
        this.loadedModules = new Map();
        this.pendingLoads = new Map();
        this.loadStats = {
            totalLoads: 0,
            successfulLoads: 0,
            failedLoads: 0,
            cacheHits: 0,
            averageLoadTime: 0
        };
        
        this.setupIntersectionObserver();
        this.setupPreloadStrategies();
        
        console.log('Smart Application Loader initialized');
    }
    
    // Dynamic import with intelligent caching and error handling
    async loadModule(modulePath, options = {}) {
        const {
            priority = 'normal',
            timeout = 10000,
            retries = 3,
            fallback = null,
            preload = false
        } = options;
        
        const startTime = performance.now();
        this.loadStats.totalLoads++;
        
        // Check cache first
        if (this.loadedModules.has(modulePath)) {
            this.loadStats.cacheHits++;
            console.log(`📦 Cache hit: ${modulePath}`);
            return this.loadedModules.get(modulePath);
        }
        
        // Check if already loading
        if (this.pendingLoads.has(modulePath)) {
            console.log(`⏳ Waiting for pending load: ${modulePath}`);
            return this.pendingLoads.get(modulePath);
        }
        
        // Create loading promise with retry logic
        const loadPromise = this.loadWithRetry(modulePath, timeout, retries, fallback);
        this.pendingLoads.set(modulePath, loadPromise);
        
        try {
            const module = await loadPromise;
            
            // Cache successful load
            this.loadedModules.set(modulePath, module);
            this.pendingLoads.delete(modulePath);
            
            // Update stats
            this.loadStats.successfulLoads++;
            const loadTime = performance.now() - startTime;
            this.updateAverageLoadTime(loadTime);
            
            console.log(`✅ Loaded: ${modulePath} (${loadTime.toFixed(2)}ms)`);
            
            // Setup prefetching for related modules
            if (!preload) {
                this.setupRelatedModulePrefetch(module, modulePath);
            }
            
            return module;
            
        } catch (error) {
            this.pendingLoads.delete(modulePath);
            this.loadStats.failedLoads++;
            
            console.error(`❌ Failed to load: ${modulePath}`, error);
            
            // Try fallback if available
            if (fallback) {
                console.log(`🔄 Using fallback for: ${modulePath}`);
                return this.loadModule(fallback, { ...options, fallback: null });
            }
            
            throw error;
        }
    }
    
    async loadWithRetry(modulePath, timeout, retries, fallback) {
        let lastError;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`📥 Loading: ${modulePath} (attempt ${attempt}/${retries})`);
                
                // Create promise with timeout
                const modulePromise = import(/* webpackChunkName: "[request]" */ modulePath);
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Timeout loading ${modulePath}`)), timeout);
                });
                
                const module = await Promise.race([modulePromise, timeoutPromise]);
                return module;
                
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Load attempt ${attempt} failed for ${modulePath}:`, error.message);
                
                if (attempt < retries) {
                    // Exponential backoff
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`⏱️ Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
    }
    
    // Prefetch modules based on user behavior
    async prefetchModule(modulePath, strategy = 'idle') {
        if (this.loadedModules.has(modulePath) || this.pendingLoads.has(modulePath)) {
            return; // Already loaded or loading
        }
        
        console.log(`🔮 Prefetching: ${modulePath} (strategy: ${strategy})`);
        
        const prefetchOptions = {
            priority: 'low',
            timeout: 5000,
            retries: 1,
            preload: true
        };
        
        try {
            if (strategy === 'idle') {
                // Use requestIdleCallback if available
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(() => {
                        this.loadModule(modulePath, prefetchOptions);
                    });
                } else {
                    setTimeout(() => {
                        this.loadModule(modulePath, prefetchOptions);
                    }, 100);
                }
            } else {
                await this.loadModule(modulePath, prefetchOptions);
            }
        } catch (error) {
            console.log(`🤷 Prefetch failed for ${modulePath} (not critical):`, error.message);
        }
    }
    
    // Setup intersection observer for viewport-based loading
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver not supported');
            return;
        }
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const modulePath = entry.target.dataset.lazyModule;
                    if (modulePath) {
                        this.loadModule(modulePath);
                        this.observer.unobserve(entry.target);
                    }
                }
            });
        }, {
            rootMargin: '100px', // Start loading 100px before element is visible
            threshold: 0.1
        });
    }
    
    // Setup various preload strategies
    setupPreloadStrategies() {
        // Hover preloading
        document.addEventListener('mouseover', (event) => {
            const lazyModule = event.target.dataset.hoverModule;
            if (lazyModule) {
                this.prefetchModule(lazyModule, 'hover');
            }
        });
        
        // Focus preloading for keyboard navigation
        document.addEventListener('focusin', (event) => {
            const lazyModule = event.target.dataset.focusModule;
            if (lazyModule) {
                this.prefetchModule(lazyModule, 'focus');
            }
        });
        
        // Idle preloading for commonly accessed modules
        this.scheduleIdlePrefetch();
    }
    
    scheduleIdlePrefetch() {
        // Common modules to prefetch during idle time
        const commonModules = [
            './components/UserProfile',
            './components/SearchModal',
            './components/NotificationCenter'
        ];
        
        const prefetchNextModule = () => {
            if (commonModules.length > 0) {
                const modulePath = commonModules.shift();
                this.prefetchModule(modulePath, 'idle').finally(() => {
                    if (commonModules.length > 0) {
                        setTimeout(prefetchNextModule, 2000);
                    }
                });
            }
        };
        
        // Start prefetching after initial load
        setTimeout(prefetchNextModule, 3000);
    }
    
    setupRelatedModulePrefetch(module, modulePath) {
        // Analyze module to find related dependencies
        if (module.relatedModules && Array.isArray(module.relatedModules)) {
            module.relatedModules.forEach(relatedPath => {
                setTimeout(() => {
                    this.prefetchModule(relatedPath, 'related');
                }, 1000);
            });
        }
    }
    
    updateAverageLoadTime(loadTime) {
        const successfulLoads = this.loadStats.successfulLoads;
        const currentAverage = this.loadStats.averageLoadTime;
        
        this.loadStats.averageLoadTime = 
            (currentAverage * (successfulLoads - 1) + loadTime) / successfulLoads;
    }
    
    // Create lazy-loaded component wrapper
    createLazyComponent(modulePath, options = {}) {
        const {
            fallback = null,
            errorBoundary = true,
            preloadTrigger = 'mount'
        } = options;
        
        return class LazyComponent extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    Component: null,
                    loading: false,
                    error: null
                };
                
                this.loader = this;
            }
            
            async componentDidMount() {
                if (preloadTrigger === 'mount') {
                    await this.loadComponent();
                }
            }
            
            async loadComponent() {
                if (this.state.loading || this.state.Component) {
                    return;
                }
                
                this.setState({ loading: true, error: null });
                
                try {
                    const module = await this.loader.loadModule(modulePath);
                    const Component = module.default || module;
                    
                    this.setState({ 
                        Component, 
                        loading: false 
                    });
                    
                } catch (error) {
                    this.setState({ 
                        error, 
                        loading: false 
                    });
                }
            }
            
            render() {
                const { Component, loading, error } = this.state;
                
                if (error && errorBoundary) {
                    return (
                        <div className="lazy-load-error">
                            <p>Failed to load component</p>
                            <button onClick={() => this.loadComponent()}>
                                Retry
                            </button>
                        </div>
                    );
                }
                
                if (loading) {
                    return fallback || <div className="lazy-loading">Loading...</div>;
                }
                
                if (Component) {
                    return <Component {...this.props} />;
                }
                
                // Trigger loading on render if not mounted trigger
                if (preloadTrigger === 'render') {
                    this.loadComponent();
                    return fallback || <div className="lazy-loading">Loading...</div>;
                }
                
                return null;
            }
        };
    }
    
    // Progressive loading for heavy features
    async loadFeatureSet(featureName, features = []) {
        console.log(`🎯 Loading feature set: ${featureName}`);
        
        const results = {};
        const errors = [];
        
        // Load features in priority order
        for (const feature of features) {
            try {
                const { path, name, priority = 'normal' } = feature;
                
                console.log(`📦 Loading feature: ${name}`);
                const module = await this.loadModule(path, { priority });
                
                results[name] = module.default || module;
                
            } catch (error) {
                console.error(`❌ Failed to load feature: ${feature.name}`, error);
                errors.push({ feature: feature.name, error });
            }
        }
        
        return {
            features: results,
            errors: errors,
            loadedCount: Object.keys(results).length,
            totalCount: features.length
        };
    }
    
    // Conditional loading based on device capabilities
    async loadConditional(conditions) {
        const results = {};
        
        for (const [condition, modulePath] of Object.entries(conditions)) {
            if (this.evaluateCondition(condition)) {
                try {
                    console.log(`✅ Condition met: ${condition}, loading ${modulePath}`);
                    results[condition] = await this.loadModule(modulePath);
                } catch (error) {
                    console.error(`❌ Conditional load failed: ${condition}`, error);
                }
            } else {
                console.log(`⏭️ Condition not met: ${condition}, skipping ${modulePath}`);
            }
        }
        
        return results;
    }
    
    evaluateCondition(condition) {
        switch (condition) {
            case 'highPerformance':
                return navigator.hardwareConcurrency >= 4 && 
                       navigator.deviceMemory >= 4;
            
            case 'fastNetwork':
                return navigator.connection && 
                       navigator.connection.effectiveType === '4g';
            
            case 'desktopDevice':
                return window.innerWidth >= 1024 && 
                       !('ontouchstart' in window);
            
            case 'modernBrowser':
                return 'IntersectionObserver' in window && 
                       'requestIdleCallback' in window;
            
            default:
                return true;
        }
    }
    
    // Get comprehensive loading statistics
    getStats() {
        return {
            ...this.loadStats,
            successRate: (this.loadStats.successfulLoads / this.loadStats.totalLoads * 100).toFixed(2) + '%',
            cacheHitRate: (this.loadStats.cacheHits / this.loadStats.totalLoads * 100).toFixed(2) + '%',
            modulesLoaded: this.loadedModules.size,
            pendingLoads: this.pendingLoads.size,
            averageLoadTime: this.loadStats.averageLoadTime.toFixed(2) + 'ms'
        };
    }
    
    // Cleanup
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        this.loadedModules.clear();
        this.pendingLoads.clear();
        
        console.log('Smart Application Loader cleaned up');
    }
}

// Usage demonstration
console.log('=== Code Splitting Demo ===');

const appLoader = new SmartApplicationLoader({
    prefetchStrategy: 'hover',
    chunkPriority: 'high',
    cacheStrategy: 'aggressive'
});

// Example: Load dashboard components based on user role
async function loadDashboard(userRole) {
    console.log(`Loading dashboard for role: ${userRole}`);
    
    // Define role-based feature sets
    const roleFeatures = {
        admin: [
            { path: './admin/UserManagement', name: 'userManagement', priority: 'high' },
            { path: './admin/SystemSettings', name: 'systemSettings', priority: 'normal' },
            { path: './admin/Analytics', name: 'analytics', priority: 'normal' },
            { path: './admin/AuditLogs', name: 'auditLogs', priority: 'low' }
        ],
        manager: [
            { path: './manager/TeamDashboard', name: 'teamDashboard', priority: 'high' },
            { path: './manager/Reports', name: 'reports', priority: 'normal' },
            { path: './manager/ProjectTools', name: 'projectTools', priority: 'low' }
        ],
        user: [
            { path: './user/Profile', name: 'profile', priority: 'high' },
            { path: './user/Tasks', name: 'tasks', priority: 'normal' },
            { path: './user/Calendar', name: 'calendar', priority: 'low' }
        ]
    };
    
    const features = roleFeatures[userRole] || roleFeatures.user;
    const result = await appLoader.loadFeatureSet(`${userRole}Dashboard`, features);
    
    console.log(`Dashboard loaded: ${result.loadedCount}/${result.totalCount} features`);
    return result;
}

// Example: Conditional loading based on device capabilities
async function loadOptionalFeatures() {
    console.log('Loading optional features based on device capabilities...');
    
    const conditionalModules = {
        'highPerformance': './features/AdvancedVisualization',
        'fastNetwork': './features/RealTimeSync',
        'desktopDevice': './features/KeyboardShortcuts',
        'modernBrowser': './features/WebWorkerTasks'
    };
    
    const loadedFeatures = await appLoader.loadConditional(conditionalModules);
    
    console.log('Conditionally loaded features:', Object.keys(loadedFeatures));
    return loadedFeatures;
}

// Example: Create lazy components
const LazyUserProfile = appLoader.createLazyComponent('./components/UserProfile', {
    fallback: <div>Loading profile...</div>,
    preloadTrigger: 'mount'
});

const LazyDataVisualization = appLoader.createLazyComponent('./components/DataVisualization', {
    fallback: <div>Loading charts...</div>,
    preloadTrigger: 'render'
});

// Demo the loading system
async function demonstrateCodeSplitting() {
    try {
        // Load dashboard features
        await loadDashboard('admin');
        
        // Load optional features
        await loadOptionalFeatures();
        
        // Show stats
        console.log('\n📊 Loading Statistics:', appLoader.getStats());
        
    } catch (error) {
        console.error('Demo failed:', error);
    }
}

// Run demonstration
demonstrateCodeSplitting();

// Cleanup after demo
setTimeout(() => {
    appLoader.cleanup();
}, 10000);
```

## Summary

### Core Concepts
- **Code Splitting**: Dividing applications into smaller bundles loaded on demand
- **Dynamic Imports**: Loading JavaScript modules at runtime using `import()`
- **Lazy Loading**: Deferring resource loading until needed
- **Progressive Enhancement**: Starting with core functionality, adding features incrementally

### Theoretical Foundation
- **Bundle Optimization**: Balancing bundle size, request count, and caching efficiency
- **Critical Path**: Identifying and prioritizing essential code for initial load
- **Resource Prioritization**: Loading high-impact features first, enhancements later
- **Cache Strategy**: Maximizing cache efficiency through intelligent code splitting

### Loading Strategies
- **Route-based Splitting**: Loading page components when users navigate
- **Component-based Splitting**: Loading UI components when they become visible
- **Feature-based Splitting**: Loading functionality sets based on user permissions or actions
- **Condition-based Loading**: Loading features based on device capabilities or network conditions

### Implementation Techniques
- **Dynamic Import API**: Modern JavaScript module loading at runtime
- **Intersection Observer**: Efficient visibility-based loading
- **Prefetching Strategies**: Anticipatory loading based on user behavior
- **Error Handling**: Graceful fallbacks and retry mechanisms

### Performance Benefits
- **Faster Initial Load**: Smaller initial bundles mean quicker time to interactive
- **Better Caching**: Smaller, focused bundles improve cache hit rates
- **Reduced Bandwidth**: Users only download code they actually use
- **Improved Mobile Experience**: Essential for devices with limited resources

### Modern Web Standards
- **HTTP/2 Optimization**: Leveraging multiplexing for efficient small file loading
- **Resource Hints**: Using `preload`, `prefetch`, and `preconnect` for optimization
- **Service Workers**: Advanced caching strategies for split bundles
- **Web Vitals**: Improving Core Web Vitals through intelligent loading

### My Personal Insight
Code splitting revolutionized how I think about application architecture. **The key insight was understanding that not all code is equally important.** Most applications have a small core of essential functionality and a large tail of optional features that only some users need.

**Progressive disclosure became a design principle** - start with the minimum viable experience and enhance progressively. This approach works for both code loading and user experience design.

**The biggest challenge is dependency management** - ensuring that dynamically loaded modules have their dependencies available. Modern bundlers handle this well, but it requires careful architecture planning.

### Next Up
Now that you understand intelligent code loading, we'll explore **Web Workers & Concurrency** - moving intensive computations off the main thread to keep your applications responsive and smooth.

Remember: The fastest code is code that never loads - be strategic about what your users actually need! 🚀✨
