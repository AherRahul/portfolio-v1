---
title: "Performance Monitoring"
description: "Master performance monitoring for web applications. Learn Real User Monitoring (RUM), synthetic monitoring, performance analytics, alerting systems, and building comprehensive performance observability."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-03-20"
datePublished: "2026-03-20"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048335/Portfolio/FrontendSystemDesignCourse/titleImages/32_oeiuwe.png)

Performance Monitoring – Building Observability into Web Applications
----------------------------------------------------------------------

Imagine discovering that your carefully optimized e-commerce site, which performs perfectly in your development environment, is actually loading slowly for users in Southeast Asia, causing a 40% drop in conversions for that region. Or picture finding out that a recent deployment broke the checkout flow for users on older mobile devices, but only after thousands of potential customers abandoned their carts.

These scenarios highlight a critical truth: **you can't improve what you don't measure, and you can't measure what you don't monitor**. Performance monitoring transforms abstract metrics into actionable insights, enabling data-driven optimization decisions that directly impact user experience and business outcomes.

**Performance Monitoring** is the practice of continuously collecting, analyzing, and alerting on website and application performance metrics from both real users and synthetic tests. It provides the observability needed to understand how your applications perform in the real world, identify performance regressions quickly, and optimize for actual user conditions.

In this comprehensive guide, we'll explore the complete spectrum of performance monitoring—from Real User Monitoring (RUM) and synthetic testing to advanced analytics, alerting strategies, and building performance-driven culture within development teams.

## Understanding Performance Monitoring Fundamentals

Performance monitoring encompasses multiple approaches, each providing different insights into application performance:

```
📊 Real User Monitoring (RUM): Actual user experiences
  ↗ Collects data from real users in production
  ↗ Provides authentic performance insights
  ↗ Captures diverse device/network conditions

🤖 Synthetic Monitoring: Controlled performance tests
  ↗ Runs automated tests from various locations
  ↗ Provides consistent baseline measurements
  ↗ Detects issues before users experience them

📈 Performance Analytics: Data analysis and insights
  ↗ Identifies trends and patterns
  ↗ Correlates performance with business metrics
  ↗ Provides actionable optimization recommendations

🚨 Alerting Systems: Proactive issue notification
  ↗ Notifies teams of performance degradations
  ↗ Enables rapid response to critical issues
  ↗ Prevents small problems from becoming major incidents
```

### The Monitoring Spectrum

**Reactive Monitoring**: Discovering issues after they impact users
- User complaints and support tickets
- Post-incident analysis and debugging
- Historical performance reviews

**Proactive Monitoring**: Identifying potential issues before user impact
- Automated performance testing in CI/CD pipelines
- Continuous synthetic monitoring from multiple locations
- Real-time alerting on performance regressions

**Predictive Monitoring**: Anticipating future performance issues
- Trend analysis and capacity planning
- Machine learning-based anomaly detection
- Performance forecasting based on usage patterns

## Comprehensive Real User Monitoring Implementation

Real User Monitoring provides authentic insights into how actual users experience your application across diverse conditions.

### Building a Complete RUM System

```javascript
/**
 * Comprehensive Real User Monitoring (RUM) Implementation
 * Collects performance data from real users across all devices and conditions
 */

class PerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      apiEndpoint: config.apiEndpoint || '/api/performance',
      sampleRate: config.sampleRate || 1.0, // Sample 100% by default
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 30000, // 30 seconds
      enableLongTaskMonitoring: config.enableLongTaskMonitoring !== false,
      enableNavigationTiming: config.enableNavigationTiming !== false,
      enableResourceTiming: config.enableResourceTiming !== false,
      enableUserAgentInfo: config.enableUserAgentInfo !== false,
      enableConnectionInfo: config.enableConnectionInfo !== false,
      enableMemoryInfo: config.enableMemoryInfo !== false,
      customMetrics: config.customMetrics || {},
      ...config
    };

    this.metrics = [];
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.pageLoadStartTime = performance.now();
    
    this.initialize();
  }

  initialize() {
    // Wait for page to be fully loaded before starting monitoring
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.startMonitoring();
      });
    } else {
      this.startMonitoring();
    }
  }

  startMonitoring() {
    // Only monitor based on sample rate
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    this.collectPageLoadMetrics();
    this.setupCoreWebVitalsMonitoring();
    this.setupNavigationTimingMonitoring();
    this.setupResourceTimingMonitoring();
    this.setupLongTaskMonitoring();
    this.setupUserInteractionMonitoring();
    this.setupErrorMonitoring();
    this.setupCustomMetricsMonitoring();
    this.setupPeriodicReporting();
    this.setupVisibilityChangeHandling();
  }

  collectPageLoadMetrics() {
    /**
     * Collect comprehensive page load performance data
     */
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        const paintEntries = performance.getEntriesByType('paint');
        
        if (navigationEntry) {
          this.addMetric('page_load', {
            // Navigation Timing API metrics
            dns_time: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
            connection_time: navigationEntry.connectEnd - navigationEntry.connectStart,
            ssl_time: navigationEntry.secureConnectionStart > 0 ? 
              navigationEntry.connectEnd - navigationEntry.secureConnectionStart : 0,
            ttfb: navigationEntry.responseStart - navigationEntry.fetchStart,
            response_time: navigationEntry.responseEnd - navigationEntry.responseStart,
            dom_interactive: navigationEntry.domInteractive - navigationEntry.fetchStart,
            dom_content_loaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart,
            load_complete: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
            
            // Additional computed metrics
            total_page_size: this.calculatePageSize(),
            resource_count: performance.getEntriesByType('resource').length,
            
            // Paint timing
            first_paint: this.getPaintTime(paintEntries, 'first-paint'),
            first_contentful_paint: this.getPaintTime(paintEntries, 'first-contentful-paint'),
            
            // Page context
            url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            
            // Device and connection info
            device_info: this.getDeviceInfo(),
            connection_info: this.getConnectionInfo(),
            memory_info: this.getMemoryInfo(),
            
            timestamp: Date.now()
          });
        }
      }, 0); // Allow paint events to complete
    });
  }

  setupCoreWebVitalsMonitoring() {
    /**
     * Monitor Core Web Vitals using PerformanceObserver
     */
    
    // Largest Contentful Paint (LCP)
    this.observePerformanceEntries('largest-contentful-paint', (entries) => {
      entries.forEach(entry => {
        this.addMetric('lcp', {
          value: entry.startTime,
          element: this.getElementInfo(entry.element),
          size: entry.size,
          render_time: entry.renderTime,
          load_time: entry.loadTime,
          url: entry.url,
          timestamp: Date.now()
        });
      });
    });

    // First Input Delay (FID)
    this.observePerformanceEntries('first-input', (entries) => {
      entries.forEach(entry => {
        this.addMetric('fid', {
          value: entry.processingStart - entry.startTime,
          input_delay: entry.processingStart - entry.startTime,
          processing_time: entry.processingEnd - entry.processingStart,
          total_time: entry.duration,
          event_type: entry.name,
          target: this.getElementInfo(entry.target),
          timestamp: Date.now()
        });
      });
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    let clsEntries = [];
    
    this.observePerformanceEntries('layout-shift', (entries) => {
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push({
            value: entry.value,
            sources: entry.sources.map(source => ({
              node: this.getElementInfo(source.node),
              current_rect: source.currentRect,
              previous_rect: source.previousRect
            })),
            timestamp: entry.startTime
          });
        }
      });
    });

    // Report CLS on page unload
    this.addUnloadHandler(() => {
      if (clsValue > 0) {
        this.addMetric('cls', {
          value: clsValue,
          total_shifts: clsEntries.length,
          shift_details: clsEntries,
          timestamp: Date.now()
        });
      }
    });
  }

  setupNavigationTimingMonitoring() {
    if (!this.config.enableNavigationTiming) return;

    /**
     * Monitor navigation timing for detailed page load analysis
     */
    window.addEventListener('load', () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      
      if (navigationEntry) {
        this.addMetric('navigation_timing', {
          redirect_time: navigationEntry.redirectEnd - navigationEntry.redirectStart,
          cache_time: navigationEntry.domainLookupStart - navigationEntry.fetchStart,
          dns_time: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
          tcp_time: navigationEntry.connectEnd - navigationEntry.connectStart,
          ssl_time: navigationEntry.secureConnectionStart > 0 ? 
            navigationEntry.connectEnd - navigationEntry.secureConnectionStart : 0,
          request_time: navigationEntry.responseStart - navigationEntry.requestStart,
          response_time: navigationEntry.responseEnd - navigationEntry.responseStart,
          processing_time: navigationEntry.loadEventStart - navigationEntry.responseEnd,
          load_event_time: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          
          // Derived metrics
          backend_time: navigationEntry.responseEnd - navigationEntry.fetchStart,
          frontend_time: navigationEntry.loadEventEnd - navigationEntry.responseEnd,
          network_time: navigationEntry.responseStart - navigationEntry.fetchStart,
          
          timestamp: Date.now()
        });
      }
    });
  }

  setupResourceTimingMonitoring() {
    if (!this.config.enableResourceTiming) return;

    /**
     * Monitor resource loading performance
     */
    const processResourceEntries = () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(resource => resource.duration > 1000); // > 1 second
      
      if (slowResources.length > 0) {
        this.addMetric('slow_resources', {
          count: slowResources.length,
          resources: slowResources.map(resource => ({
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
            type: this.getResourceType(resource),
            cache_status: this.getCacheStatus(resource),
            initiator_type: resource.initiatorType,
            protocol: resource.nextHopProtocol
          })),
          timestamp: Date.now()
        });
      }

      // Track resource type performance
      const resourceStats = this.aggregateResourceStats(resources);
      this.addMetric('resource_stats', {
        ...resourceStats,
        timestamp: Date.now()
      });
    };

    // Process resources after page load
    window.addEventListener('load', () => {
      setTimeout(processResourceEntries, 2000);
    });
  }

  setupLongTaskMonitoring() {
    if (!this.config.enableLongTaskMonitoring) return;

    /**
     * Monitor long tasks that block the main thread
     */
    this.observePerformanceEntries('longtask', (entries) => {
      entries.forEach(entry => {
        this.addMetric('long_task', {
          duration: entry.duration,
          start_time: entry.startTime,
          attribution: entry.attribution ? entry.attribution.map(attr => ({
            name: attr.name,
            container_type: attr.containerType,
            container_src: attr.containerSrc,
            container_id: attr.containerId,
            container_name: attr.containerName
          })) : [],
          blocking_time: entry.duration - 50, // Time over 50ms threshold
          timestamp: Date.now()
        });

        // Alert for very long tasks
        if (entry.duration > 500) {
          console.warn(`Very long task detected: ${entry.duration}ms`);
        }
      });
    });
  }

  setupUserInteractionMonitoring() {
    /**
     * Monitor user interactions and their response times
     */
    let interactionCount = 0;
    const interactions = [];

    // Monitor click interactions
    document.addEventListener('click', (event) => {
      const startTime = performance.now();
      interactionCount++;

      // Measure time to visual update
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        interactions.push({
          type: 'click',
          duration,
          target: this.getElementInfo(event.target),
          timestamp: Date.now()
        });

        // Report slow interactions immediately
        if (duration > 100) {
          this.addMetric('slow_interaction', {
            type: 'click',
            duration,
            target: this.getElementInfo(event.target),
            timestamp: Date.now()
          });
        }
      });
    });

    // Monitor input interactions
    document.addEventListener('input', (event) => {
      const inputType = event.target.type;
      const value = event.target.value;

      this.addMetric('input_interaction', {
        input_type: inputType,
        value_length: value.length,
        target: this.getElementInfo(event.target),
        timestamp: Date.now()
      });
    });

    // Report interaction summary periodically
    setInterval(() => {
      if (interactions.length > 0) {
        this.addMetric('interaction_summary', {
          total_interactions: interactionCount,
          avg_response_time: interactions.reduce((sum, i) => sum + i.duration, 0) / interactions.length,
          slow_interactions: interactions.filter(i => i.duration > 100).length,
          interaction_types: this.groupBy(interactions, 'type'),
          timestamp: Date.now()
        });
        
        interactions.length = 0; // Clear processed interactions
      }
    }, 30000);
  }

  setupErrorMonitoring() {
    /**
     * Monitor JavaScript errors and their impact on performance
     */
    window.addEventListener('error', (event) => {
      this.addMetric('javascript_error', {
        message: event.message,
        filename: event.filename,
        line_number: event.lineno,
        column_number: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.addMetric('unhandled_rejection', {
        reason: event.reason,
        promise: event.promise,
        timestamp: Date.now(),
        url: window.location.href
      });
    });

    // Monitor resource loading errors
    document.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.addMetric('resource_error', {
          resource_url: event.target.src || event.target.href,
          resource_type: event.target.tagName,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  setupCustomMetricsMonitoring() {
    /**
     * Enable custom business metrics monitoring
     */
    Object.keys(this.config.customMetrics).forEach(metricName => {
      const metricConfig = this.config.customMetrics[metricName];
      
      if (metricConfig.type === 'timing') {
        // Custom timing metrics
        window.addEventListener(metricConfig.startEvent, () => {
          const startTime = performance.now();
          
          window.addEventListener(metricConfig.endEvent, () => {
            const duration = performance.now() - startTime;
            this.addMetric(`custom_timing_${metricName}`, {
              duration,
              timestamp: Date.now()
            });
          }, { once: true });
        });
      } else if (metricConfig.type === 'counter') {
        // Custom counter metrics
        let count = 0;
        window.addEventListener(metricConfig.event, () => {
          count++;
          this.addMetric(`custom_counter_${metricName}`, {
            count,
            increment: 1,
            timestamp: Date.now()
          });
        });
      }
    });
  }

  setupPeriodicReporting() {
    /**
     * Set up periodic metric reporting
     */
    setInterval(() => {
      this.flushMetrics();
    }, this.config.flushInterval);
  }

  setupVisibilityChangeHandling() {
    /**
     * Handle page visibility changes for accurate session tracking
     */
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Page became hidden, flush metrics
        this.flushMetrics();
      } else {
        // Page became visible, track engagement
        this.addMetric('page_visibility', {
          state: 'visible',
          timestamp: Date.now()
        });
      }
    });
  }

  // Utility Methods
  observePerformanceEntries(entryType, callback) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries());
        });
        observer.observe({ type: entryType, buffered: true });
      } catch (error) {
        console.error(`Failed to observe ${entryType}:`, error);
      }
    }
  }

  addMetric(type, data) {
    this.metrics.push({
      type,
      session_id: this.sessionId,
      user_id: this.userId,
      page_url: window.location.href,
      ...data
    });

    // Flush if batch size reached
    if (this.metrics.length >= this.config.batchSize) {
      this.flushMetrics();
    }
  }

  flushMetrics() {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    // Send metrics to backend
    this.sendMetrics(metricsToSend);
  }

  sendMetrics(metrics) {
    const payload = {
      metrics,
      session_info: {
        session_id: this.sessionId,
        user_id: this.userId,
        page_url: window.location.href,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    // Use sendBeacon for reliability, fallback to fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.config.apiEndpoint,
        JSON.stringify(payload)
      );
    } else {
      fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(error => {
        console.error('Failed to send metrics:', error);
      });
    }
  }

  addUnloadHandler(callback) {
    window.addEventListener('beforeunload', callback);
    window.addEventListener('pagehide', callback);
  }

  // Helper methods
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserId() {
    // Try to get user ID from various sources
    return localStorage.getItem('userId') || 
           sessionStorage.getItem('userId') || 
           'anonymous_' + Math.random().toString(36).substr(2, 9);
  }

  getPaintTime(paintEntries, paintType) {
    const entry = paintEntries.find(entry => entry.name === paintType);
    return entry ? entry.startTime : null;
  }

  getElementInfo(element) {
    if (!element) return null;
    
    return {
      tag_name: element.tagName?.toLowerCase(),
      id: element.id,
      class_name: element.className,
      text_content: element.textContent?.substring(0, 100),
      attributes: this.getElementAttributes(element)
    };
  }

  getElementAttributes(element) {
    const attrs = {};
    if (element.attributes) {
      Array.from(element.attributes).forEach(attr => {
        if (['data-', 'aria-'].some(prefix => attr.name.startsWith(prefix))) {
          attrs[attr.name] = attr.value;
        }
      });
    }
    return attrs;
  }

  getDeviceInfo() {
    return {
      screen_width: screen.width,
      screen_height: screen.height,
      screen_color_depth: screen.colorDepth,
      device_pixel_ratio: window.devicePixelRatio,
      is_mobile: /Mobi|Android/i.test(navigator.userAgent),
      is_tablet: /Tablet|iPad/i.test(navigator.userAgent),
      platform: navigator.platform,
      language: navigator.language
    };
  }

  getConnectionInfo() {
    if (!this.config.enableConnectionInfo) return null;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      return {
        effective_type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        save_data: connection.saveData
      };
    }
    
    return null;
  }

  getMemoryInfo() {
    if (!this.config.enableMemoryInfo) return null;
    
    if (performance.memory) {
      return {
        used_js_heap_size: performance.memory.usedJSHeapSize,
        total_js_heap_size: performance.memory.totalJSHeapSize,
        js_heap_size_limit: performance.memory.jsHeapSizeLimit
      };
    }
    
    return null;
  }

  calculatePageSize() {
    const resources = performance.getEntriesByType('resource');
    return resources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
  }

  getResourceType(resource) {
    const name = resource.name.toLowerCase();
    
    if (name.includes('.js')) return 'script';
    if (name.includes('.css')) return 'stylesheet';
    if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(name)) return 'image';
    if (/\.(woff|woff2|ttf|otf)/.test(name)) return 'font';
    if (name.includes('.json')) return 'xhr';
    
    return resource.initiatorType || 'other';
  }

  getCacheStatus(resource) {
    if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
      return 'cache';
    } else if (resource.transferSize > 0) {
      return 'network';
    }
    return 'unknown';
  }

  aggregateResourceStats(resources) {
    const stats = {
      total_resources: resources.length,
      total_size: 0,
      by_type: {},
      by_cache_status: { cache: 0, network: 0, unknown: 0 }
    };

    resources.forEach(resource => {
      const type = this.getResourceType(resource);
      const cacheStatus = this.getCacheStatus(resource);
      const size = resource.transferSize || 0;

      stats.total_size += size;
      
      if (!stats.by_type[type]) {
        stats.by_type[type] = { count: 0, size: 0, avg_duration: 0 };
      }
      
      stats.by_type[type].count++;
      stats.by_type[type].size += size;
      stats.by_type[type].avg_duration += resource.duration;
      
      stats.by_cache_status[cacheStatus]++;
    });

    // Calculate averages
    Object.keys(stats.by_type).forEach(type => {
      const typeStats = stats.by_type[type];
      typeStats.avg_duration = typeStats.avg_duration / typeStats.count;
    });

    return stats;
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }
}

/**
 * Performance Monitoring API - Backend Integration
 */
class PerformanceAPI {
  constructor(apiConfig = {}) {
    this.config = {
      baseUrl: apiConfig.baseUrl || '/api/performance',
      apiKey: apiConfig.apiKey,
      enableCaching: apiConfig.enableCaching !== false,
      cacheTimeout: apiConfig.cacheTimeout || 300000, // 5 minutes
      ...apiConfig
    };

    this.cache = new Map();
  }

  async getMetrics(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const url = `${this.config.baseUrl}/metrics?${queryParams}`;
    
    return this.makeRequest(url);
  }

  async getWebVitals(timeRange = '24h') {
    const url = `${this.config.baseUrl}/web-vitals?timeRange=${timeRange}`;
    return this.makeRequest(url);
  }

  async getPagePerformance(pageUrl, timeRange = '24h') {
    const url = `${this.config.baseUrl}/page-performance?url=${encodeURIComponent(pageUrl)}&timeRange=${timeRange}`;
    return this.makeRequest(url);
  }

  async getUserJourneyAnalysis(userId) {
    const url = `${this.config.baseUrl}/user-journey/${userId}`;
    return this.makeRequest(url);
  }

  async getPerformanceTrends(metric, timeRange = '7d') {
    const url = `${this.config.baseUrl}/trends?metric=${metric}&timeRange=${timeRange}`;
    return this.makeRequest(url);
  }

  async createAlert(alertConfig) {
    const url = `${this.config.baseUrl}/alerts`;
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(alertConfig)
    });
  }

  async makeRequest(url, options = {}) {
    const cacheKey = url + JSON.stringify(options);
    
    // Check cache
    if (this.config.enableCaching && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.config.cacheTimeout) {
        return cached.data;
      }
    }

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      ...options
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache successful responses
      if (this.config.enableCaching) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }
      
      return data;
    } catch (error) {
      console.error('Performance API request failed:', error);
      throw error;
    }
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor({
  apiEndpoint: '/api/rum-metrics',
  sampleRate: 0.1, // Monitor 10% of users
  customMetrics: {
    'checkout_completion': {
      type: 'timing',
      startEvent: 'checkout_started',
      endEvent: 'checkout_completed'
    },
    'search_usage': {
      type: 'counter',
      event: 'search_performed'
    }
  }
});

// Performance API instance for dashboard usage
const performanceAPI = new PerformanceAPI({
  baseUrl: '/api/performance',
  apiKey: 'your-api-key-here'
});

// Export for use in other modules
export { PerformanceMonitor, PerformanceAPI };
```

### Advanced RUM Analytics and Insights

```javascript
/**
 * Advanced Performance Analytics Engine
 * Processes RUM data to generate actionable insights
 */

class PerformanceAnalytics {
  constructor(apiClient) {
    this.api = apiClient;
    this.insights = [];
    this.benchmarks = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 }
    };
  }

  async generatePerformanceReport(timeRange = '7d') {
    /**
     * Generate comprehensive performance report with insights
     */
    const [webVitals, trends, userJourneys, errors] = await Promise.all([
      this.api.getWebVitals(timeRange),
      this.api.getPerformanceTrends('all', timeRange),
      this.api.getUserJourneyAnalysis('all'),
      this.api.getMetrics({ type: 'javascript_error', timeRange })
    ]);

    const report = {
      summary: this.generatePerformanceSummary(webVitals),
      trends: this.analyzeTrends(trends),
      insights: this.generateInsights(webVitals, trends),
      recommendations: this.generateRecommendations(webVitals, trends),
      userImpact: this.analyzeUserImpact(userJourneys),
      errorAnalysis: this.analyzeErrors(errors),
      competitiveAnalysis: await this.getCompetitiveAnalysis(),
      timestamp: Date.now()
    };

    return report;
  }

  generatePerformanceSummary(webVitals) {
    /**
     * Generate performance summary with scores and ratings
     */
    const metrics = ['lcp', 'fid', 'cls'];
    const summary = {};

    metrics.forEach(metric => {
      const data = webVitals[metric];
      if (data && data.length > 0) {
        const values = data.map(d => d.value);
        const p75 = this.percentile(values, 75);
        const p95 = this.percentile(values, 95);
        
        summary[metric] = {
          p50: this.percentile(values, 50),
          p75,
          p95,
          rating: this.getRating(metric, p75),
          sample_size: values.length,
          distribution: this.getDistribution(values, metric)
        };
      }
    });

    // Calculate overall performance score (0-100)
    const overallScore = this.calculateOverallScore(summary);
    summary.overall_score = overallScore;
    summary.overall_rating = this.getOverallRating(overallScore);

    return summary;
  }

  analyzeTrends(trends) {
    /**
     * Analyze performance trends and identify patterns
     */
    const analysis = {
      improving: [],
      degrading: [],
      stable: [],
      volatile: []
    };

    Object.keys(trends).forEach(metric => {
      const trend = this.calculateTrend(trends[metric]);
      const volatility = this.calculateVolatility(trends[metric]);
      
      const trendAnalysis = {
        metric,
        trend_direction: trend.direction,
        trend_magnitude: trend.magnitude,
        volatility: volatility,
        confidence: trend.confidence,
        data_points: trends[metric].length
      };

      if (Math.abs(trend.magnitude) < 0.05) {
        analysis.stable.push(trendAnalysis);
      } else if (trend.direction === 'improving') {
        analysis.improving.push(trendAnalysis);
      } else if (trend.direction === 'degrading') {
        analysis.degrading.push(trendAnalysis);
      }

      if (volatility > 0.3) {
        analysis.volatile.push(trendAnalysis);
      }
    });

    return analysis;
  }

  generateInsights(webVitals, trends) {
    /**
     * Generate actionable insights from performance data
     */
    const insights = [];

    // Core Web Vitals insights
    if (webVitals.lcp && this.getRating('lcp', this.percentile(webVitals.lcp.map(d => d.value), 75)) !== 'good') {
      insights.push({
        type: 'critical',
        metric: 'lcp',
        title: 'Largest Contentful Paint needs improvement',
        description: 'Your LCP is above the recommended threshold, impacting user experience and SEO rankings.',
        impact: 'high',
        recommendations: [
          'Optimize above-the-fold images with modern formats (WebP, AVIF)',
          'Implement resource preloading for critical assets',
          'Reduce server response time (TTFB)',
          'Remove unused CSS and JavaScript'
        ]
      });
    }

    // Trend-based insights
    const degradingTrends = this.analyzeTrends(trends).degrading;
    degradingTrends.forEach(trend => {
      insights.push({
        type: 'warning',
        metric: trend.metric,
        title: `${trend.metric.toUpperCase()} performance is degrading`,
        description: `${trend.metric.toUpperCase()} has shown ${trend.trend_magnitude * 100}% degradation over the analysis period.`,
        impact: 'medium',
        trend_data: trend
      });
    });

    // Device-specific insights
    insights.push(...this.generateDeviceInsights(webVitals));
    
    // Connection-specific insights
    insights.push(...this.generateConnectionInsights(webVitals));

    return insights;
  }

  generateRecommendations(webVitals, trends) {
    /**
     * Generate specific optimization recommendations
     */
    const recommendations = [];

    // LCP optimization recommendations
    if (webVitals.lcp) {
      const lcpElements = this.analyzeLCPElements(webVitals.lcp);
      if (lcpElements.images > 0.6) {
        recommendations.push({
          priority: 'high',
          category: 'images',
          title: 'Optimize LCP images',
          actions: [
            'Implement responsive images with appropriate sizes',
            'Use modern image formats (WebP, AVIF)',
            'Add preload hints for above-the-fold images',
            'Consider using blur-up technique for perceived performance'
          ],
          estimated_impact: '20-30% LCP improvement'
        });
      }
    }

    // JavaScript optimization recommendations
    if (trends.long_task && trends.long_task.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'javascript',
        title: 'Reduce JavaScript execution time',
        actions: [
          'Split large bundles using code splitting',
          'Implement lazy loading for non-critical components',
          'Use web workers for heavy computations',
          'Optimize third-party script loading'
        ],
        estimated_impact: '15-25% FID improvement'
      });
    }

    return recommendations;
  }

  analyzeUserImpact(userJourneys) {
    /**
     * Analyze how performance impacts user behavior
     */
    const impact = {
      bounce_rate_correlation: this.calculateBounceRateCorrelation(userJourneys),
      conversion_rate_impact: this.calculateConversionImpact(userJourneys),
      engagement_metrics: this.calculateEngagementMetrics(userJourneys),
      device_performance_gaps: this.analyzeDevicePerformanceGaps(userJourneys)
    };

    return impact;
  }

  analyzeErrors(errors) {
    /**
     * Analyze JavaScript errors and their performance impact
     */
    if (!errors || errors.length === 0) {
      return { total_errors: 0, error_rate: 0 };
    }

    const errorAnalysis = {
      total_errors: errors.length,
      error_rate: this.calculateErrorRate(errors),
      top_errors: this.getTopErrors(errors),
      error_trends: this.calculateErrorTrends(errors),
      performance_impact: this.calculateErrorPerformanceImpact(errors)
    };

    return errorAnalysis;
  }

  // Utility methods for calculations
  percentile(values, p) {
    const sorted = values.sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    
    if (Math.floor(index) === index) {
      return sorted[index];
    } else {
      const lower = sorted[Math.floor(index)];
      const upper = sorted[Math.ceil(index)];
      return lower + (upper - lower) * (index - Math.floor(index));
    }
  }

  getRating(metric, value) {
    const thresholds = this.benchmarks[metric];
    if (!thresholds) return 'unknown';
    
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-work';
    return 'poor';
  }

  calculateOverallScore(summary) {
    const weights = { lcp: 0.4, fid: 0.3, cls: 0.3 };
    let totalScore = 0;
    let totalWeight = 0;

    Object.keys(weights).forEach(metric => {
      if (summary[metric]) {
        const rating = summary[metric].rating;
        let score = 0;
        
        switch (rating) {
          case 'good': score = 100; break;
          case 'needs-work': score = 60; break;
          case 'poor': score = 20; break;
        }
        
        totalScore += score * weights[metric];
        totalWeight += weights[metric];
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  getOverallRating(score) {
    if (score >= 80) return 'good';
    if (score >= 60) return 'needs-work';
    return 'poor';
  }

  calculateTrend(dataPoints) {
    if (dataPoints.length < 2) return { direction: 'insufficient-data', magnitude: 0, confidence: 0 };

    // Simple linear regression for trend analysis
    const n = dataPoints.length;
    const x = dataPoints.map((_, i) => i);
    const y = dataPoints.map(d => d.value);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumXX = x.reduce((total, xi) => total + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const confidence = Math.min(n / 10, 1); // Higher confidence with more data points
    
    return {
      direction: slope > 0.05 ? 'degrading' : slope < -0.05 ? 'improving' : 'stable',
      magnitude: Math.abs(slope),
      confidence
    };
  }

  calculateVolatility(dataPoints) {
    if (dataPoints.length < 3) return 0;
    
    const values = dataPoints.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev / mean; // Coefficient of variation
  }

  // Additional analysis methods would be implemented here...
  generateDeviceInsights(webVitals) { return []; }
  generateConnectionInsights(webVitals) { return []; }
  analyzeLCPElements(lcpData) { return { images: 0.8, text: 0.2 }; }
  calculateBounceRateCorrelation(userJourneys) { return 0.75; }
  calculateConversionImpact(userJourneys) { return { slow_pages: 0.3, fast_pages: 0.8 }; }
  calculateEngagementMetrics(userJourneys) { return { avg_session_duration: 120 }; }
  analyzeDevicePerformanceGaps(userJourneys) { return {}; }
  calculateErrorRate(errors) { return errors.length / 1000; }
  getTopErrors(errors) { return []; }
  calculateErrorTrends(errors) { return []; }
  calculateErrorPerformanceImpact(errors) { return {}; }
  async getCompetitiveAnalysis() { return {}; }
}

// Usage example
const analytics = new PerformanceAnalytics(performanceAPI);

// Generate and display performance report
analytics.generatePerformanceReport('7d').then(report => {
  console.log('Performance Report:', report);
  
  // Display critical insights
  report.insights.filter(insight => insight.type === 'critical').forEach(insight => {
    console.warn(`Critical Issue: ${insight.title}`);
    console.log(`Impact: ${insight.impact}`);
    console.log(`Recommendations:`, insight.recommendations);
  });
});
```

## Synthetic Monitoring Implementation

Synthetic monitoring provides controlled, consistent performance measurements by running automated tests from multiple locations and conditions.

### Building a Comprehensive Synthetic Monitoring System

```javascript
/**
 * Synthetic Monitoring System
 * Automated performance testing from multiple locations and conditions
 */

class SyntheticMonitor {
  constructor(config = {}) {
    this.config = {
      testLocations: config.testLocations || ['us-east', 'us-west', 'europe', 'asia'],
      testDevices: config.testDevices || ['desktop', 'mobile', 'tablet'],
      testFrequency: config.testFrequency || 300000, // 5 minutes
      alertThresholds: config.alertThresholds || {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        availability: 0.99
      },
      testUrls: config.testUrls || [],
      ...config
    };

    this.testResults = [];
    this.alerting = new AlertingSystem(this.config.alerting || {});
    this.setupMonitoring();
  }

  setupMonitoring() {
    // Start periodic monitoring
    setInterval(() => {
      this.runAllTests();
    }, this.config.testFrequency);

    // Run initial tests
    this.runAllTests();
  }

  async runAllTests() {
    const testPromises = [];

    this.config.testUrls.forEach(url => {
      this.config.testLocations.forEach(location => {
        this.config.testDevices.forEach(device => {
          testPromises.push(this.runSyntheticTest(url, location, device));
        });
      });
    });

    try {
      const results = await Promise.allSettled(testPromises);
      this.processTestResults(results);
    } catch (error) {
      console.error('Synthetic monitoring failed:', error);
    }
  }

  async runSyntheticTest(url, location, device) {
    /**
     * Run a single synthetic test using Puppeteer or similar
     */
    const testConfig = {
      url,
      location,
      device,
      timestamp: Date.now(),
      testId: this.generateTestId()
    };

    try {
      // In a real implementation, this would use Puppeteer, Playwright, or a service like WebPageTest
      const result = await this.performWebTest(testConfig);
      
      return {
        ...testConfig,
        status: 'success',
        metrics: result,
        duration: Date.now() - testConfig.timestamp
      };
    } catch (error) {
      return {
        ...testConfig,
        status: 'failed',
        error: error.message,
        duration: Date.now() - testConfig.timestamp
      };
    }
  }

  async performWebTest(config) {
    /**
     * Simulate web performance test
     * In production, this would integrate with actual testing tools
     */
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Generate realistic test data based on location and device
    const baseMetrics = this.getBaseMetrics(config.device);
    const locationMultiplier = this.getLocationMultiplier(config.location);
    
    return {
      // Core Web Vitals
      lcp: baseMetrics.lcp * locationMultiplier * (0.8 + Math.random() * 0.4),
      fid: baseMetrics.fid * locationMultiplier * (0.8 + Math.random() * 0.4),
      cls: baseMetrics.cls * (0.5 + Math.random() * 1.0),
      
      // Navigation Timing
      ttfb: baseMetrics.ttfb * locationMultiplier * (0.8 + Math.random() * 0.4),
      dom_content_loaded: baseMetrics.domContentLoaded * locationMultiplier,
      load_complete: baseMetrics.loadComplete * locationMultiplier,
      
      // Resource metrics
      total_requests: baseMetrics.totalRequests + Math.floor(Math.random() * 10),
      total_size: baseMetrics.totalSize * (0.9 + Math.random() * 0.2),
      
      // Additional metrics
      first_paint: baseMetrics.firstPaint * locationMultiplier,
      first_contentful_paint: baseMetrics.fcp * locationMultiplier,
      speed_index: baseMetrics.speedIndex * locationMultiplier,
      
      // Availability
      availability: Math.random() > 0.05 ? 1 : 0, // 95% availability simulation
      
      // Network simulation
      connection_type: this.simulateConnectionType(config.location),
      bandwidth_kbps: this.simulateBandwidth(config.location, config.device)
    };
  }

  getBaseMetrics(device) {
    const metrics = {
      desktop: {
        lcp: 1800,
        fid: 50,
        cls: 0.05,
        ttfb: 400,
        domContentLoaded: 1200,
        loadComplete: 2500,
        firstPaint: 800,
        fcp: 1000,
        speedIndex: 1500,
        totalRequests: 45,
        totalSize: 2500000
      },
      mobile: {
        lcp: 2800,
        fid: 80,
        cls: 0.08,
        ttfb: 600,
        domContentLoaded: 2200,
        loadComplete: 4500,
        firstPaint: 1200,
        fcp: 1800,
        speedIndex: 2800,
        totalRequests: 42,
        totalSize: 2200000
      },
      tablet: {
        lcp: 2200,
        fid: 60,
        cls: 0.06,
        ttfb: 500,
        domContentLoaded: 1800,
        loadComplete: 3200,
        firstPaint: 1000,
        fcp: 1400,
        speedIndex: 2100,
        totalRequests: 44,
        totalSize: 2350000
      }
    };

    return metrics[device] || metrics.desktop;
  }

  getLocationMultiplier(location) {
    const multipliers = {
      'us-east': 1.0,
      'us-west': 1.1,
      'europe': 1.3,
      'asia': 1.8,
      'australia': 2.0,
      'south-america': 1.6
    };

    return multipliers[location] || 1.0;
  }

  simulateConnectionType(location) {
    const connectionTypes = {
      'us-east': ['4g', '5g', 'broadband'],
      'us-west': ['4g', '5g', 'broadband'],
      'europe': ['4g', 'broadband', '3g'],
      'asia': ['4g', '3g', 'broadband'],
      'australia': ['4g', 'broadband'],
      'south-america': ['3g', '4g']
    };

    const types = connectionTypes[location] || ['4g'];
    return types[Math.floor(Math.random() * types.length)];
  }

  simulateBandwidth(location, device) {
    const baseSpeed = {
      'desktop': 50000, // 50 Mbps
      'tablet': 25000,  // 25 Mbps
      'mobile': 15000   // 15 Mbps
    };

    const locationFactor = {
      'us-east': 1.0,
      'us-west': 0.9,
      'europe': 0.8,
      'asia': 0.6,
      'australia': 0.7,
      'south-america': 0.5
    };

    return (baseSpeed[device] || baseSpeed.desktop) * (locationFactor[location] || 0.8);
  }

  processTestResults(results) {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const testResult = result.value;
        this.testResults.push(testResult);
        
        // Check for alerts
        this.checkAlertThresholds(testResult);
        
        // Store results
        this.storeTestResult(testResult);
      } else {
        console.error('Synthetic test failed:', result.reason);
      }
    });

    // Clean up old results
    this.cleanupOldResults();
  }

  checkAlertThresholds(testResult) {
    if (testResult.status !== 'success') {
      this.alerting.sendAlert({
        type: 'availability',
        severity: 'critical',
        message: `Synthetic test failed for ${testResult.url}`,
        details: testResult,
        timestamp: Date.now()
      });
      return;
    }

    const metrics = testResult.metrics;
    const thresholds = this.config.alertThresholds;

    // Check Core Web Vitals thresholds
    if (metrics.lcp > thresholds.lcp) {
      this.alerting.sendAlert({
        type: 'performance',
        metric: 'lcp',
        severity: 'warning',
        message: `LCP threshold exceeded: ${metrics.lcp}ms > ${thresholds.lcp}ms`,
        details: testResult,
        timestamp: Date.now()
      });
    }

    if (metrics.fid > thresholds.fid) {
      this.alerting.sendAlert({
        type: 'performance',
        metric: 'fid',
        severity: 'warning',
        message: `FID threshold exceeded: ${metrics.fid}ms > ${thresholds.fid}ms`,
        details: testResult,
        timestamp: Date.now()
      });
    }

    if (metrics.cls > thresholds.cls) {
      this.alerting.sendAlert({
        type: 'performance',
        metric: 'cls',
        severity: 'warning',
        message: `CLS threshold exceeded: ${metrics.cls} > ${thresholds.cls}`,
        details: testResult,
        timestamp: Date.now()
      });
    }

    // Check availability
    if (metrics.availability < thresholds.availability) {
      this.alerting.sendAlert({
        type: 'availability',
        severity: 'critical',
        message: `Availability below threshold: ${metrics.availability} < ${thresholds.availability}`,
        details: testResult,
        timestamp: Date.now()
      });
    }
  }

  storeTestResult(testResult) {
    // Send to backend for storage and analysis
    fetch('/api/synthetic-monitoring/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testResult)
    }).catch(error => {
      console.error('Failed to store synthetic test result:', error);
    });
  }

  cleanupOldResults() {
    // Keep only last 1000 results in memory
    if (this.testResults.length > 1000) {
      this.testResults = this.testResults.slice(-1000);
    }
  }

  generateTestId() {
    return 'synthetic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Analysis methods
  getAverageMetrics(timeRange = '24h', filters = {}) {
    const filteredResults = this.filterResults(timeRange, filters);
    
    if (filteredResults.length === 0) return null;

    const metrics = ['lcp', 'fid', 'cls', 'ttfb', 'load_complete'];
    const averages = {};

    metrics.forEach(metric => {
      const values = filteredResults
        .filter(result => result.status === 'success' && result.metrics[metric])
        .map(result => result.metrics[metric]);
      
      if (values.length > 0) {
        averages[metric] = {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          p95: this.percentile(values, 95),
          count: values.length
        };
      }
    });

    return averages;
  }

  getPerformanceTrends(metric, timeRange = '7d') {
    const filteredResults = this.filterResults(timeRange);
    
    // Group by hour or day depending on time range
    const groupBy = timeRange.includes('h') ? 'hour' : 'day';
    const grouped = this.groupResultsByTime(filteredResults, groupBy);
    
    return Object.keys(grouped).map(timeKey => ({
      timestamp: timeKey,
      value: this.calculateAverageMetric(grouped[timeKey], metric),
      count: grouped[timeKey].length
    }));
  }

  filterResults(timeRange, filters = {}) {
    const now = Date.now();
    const timeMs = this.parseTimeRange(timeRange);
    const startTime = now - timeMs;

    return this.testResults.filter(result => {
      if (result.timestamp < startTime) return false;
      
      if (filters.location && result.location !== filters.location) return false;
      if (filters.device && result.device !== filters.device) return false;
      if (filters.url && result.url !== filters.url) return false;
      
      return true;
    });
  }

  parseTimeRange(timeRange) {
    const match = timeRange.match(/(\d+)([hd])/);
    if (!match) return 24 * 60 * 60 * 1000; // Default to 24 hours
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    if (unit === 'h') return value * 60 * 60 * 1000;
    if (unit === 'd') return value * 24 * 60 * 60 * 1000;
    
    return 24 * 60 * 60 * 1000;
  }

  groupResultsByTime(results, groupBy) {
    return results.reduce((groups, result) => {
      const date = new Date(result.timestamp);
      let key;
      
      if (groupBy === 'hour') {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      } else {
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(result);
      
      return groups;
    }, {});
  }

  calculateAverageMetric(results, metric) {
    const values = results
      .filter(result => result.status === 'success' && result.metrics[metric])
      .map(result => result.metrics[metric]);
    
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
  }

  percentile(values, p) {
    const sorted = values.sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    
    if (Math.floor(index) === index) {
      return sorted[index];
    } else {
      const lower = sorted[Math.floor(index)];
      const upper = sorted[Math.ceil(index)];
      return lower + (upper - lower) * (index - Math.floor(index));
    }
  }
}

/**
 * Alerting System for Performance Monitoring
 */
class AlertingSystem {
  constructor(config = {}) {
    this.config = {
      webhookUrl: config.webhookUrl,
      emailEndpoint: config.emailEndpoint,
      slackWebhook: config.slackWebhook,
      alertCooldown: config.alertCooldown || 300000, // 5 minutes
      enabledChannels: config.enabledChannels || ['console'],
      ...config
    };

    this.sentAlerts = new Map(); // Track recent alerts to prevent spam
  }

  sendAlert(alert) {
    const alertKey = `${alert.type}_${alert.metric || 'general'}_${alert.severity}`;
    const now = Date.now();
    
    // Check cooldown
    if (this.sentAlerts.has(alertKey)) {
      const lastSent = this.sentAlerts.get(alertKey);
      if (now - lastSent < this.config.alertCooldown) {
        console.log('Alert suppressed due to cooldown:', alertKey);
        return;
      }
    }

    // Send to configured channels
    this.config.enabledChannels.forEach(channel => {
      switch (channel) {
        case 'console':
          this.sendConsoleAlert(alert);
          break;
        case 'webhook':
          this.sendWebhookAlert(alert);
          break;
        case 'email':
          this.sendEmailAlert(alert);
          break;
        case 'slack':
          this.sendSlackAlert(alert);
          break;
      }
    });

    // Update cooldown tracker
    this.sentAlerts.set(alertKey, now);
  }

  sendConsoleAlert(alert) {
    const severity = alert.severity.toUpperCase();
    const message = `[${severity}] ${alert.message}`;
    
    switch (alert.severity) {
      case 'critical':
        console.error(message, alert.details);
        break;
      case 'warning':
        console.warn(message, alert.details);
        break;
      default:
        console.log(message, alert.details);
    }
  }

  sendWebhookAlert(alert) {
    if (!this.config.webhookUrl) return;
    
    fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.timestamp,
        details: alert.details
      })
    }).catch(error => {
      console.error('Failed to send webhook alert:', error);
    });
  }

  sendEmailAlert(alert) {
    if (!this.config.emailEndpoint) return;
    
    const emailData = {
      to: this.config.alertEmails || [],
      subject: `Performance Alert: ${alert.type} - ${alert.severity}`,
      body: this.formatEmailAlert(alert)
    };

    fetch(this.config.emailEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    }).catch(error => {
      console.error('Failed to send email alert:', error);
    });
  }

  sendSlackAlert(alert) {
    if (!this.config.slackWebhook) return;
    
    const color = this.getSlackColor(alert.severity);
    const slackMessage = {
      text: `Performance Alert: ${alert.message}`,
      attachments: [{
        color: color,
        fields: [
          { title: 'Type', value: alert.type, short: true },
          { title: 'Severity', value: alert.severity, short: true },
          { title: 'Timestamp', value: new Date(alert.timestamp).toISOString(), short: true }
        ]
      }]
    };

    fetch(this.config.slackWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    }).catch(error => {
      console.error('Failed to send Slack alert:', error);
    });
  }

  formatEmailAlert(alert) {
    return `
      Performance Alert Details:
      
      Type: ${alert.type}
      Severity: ${alert.severity}
      Message: ${alert.message}
      Timestamp: ${new Date(alert.timestamp).toISOString()}
      
      Additional Details:
      ${JSON.stringify(alert.details, null, 2)}
    `;
  }

  getSlackColor(severity) {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'warning': return '#ffaa00';
      case 'info': return '#00aaff';
      default: return '#666666';
    }
  }
}

// Initialize synthetic monitoring
const syntheticMonitor = new SyntheticMonitor({
  testUrls: [
    'https://example.com',
    'https://example.com/products',
    'https://example.com/checkout'
  ],
  testLocations: ['us-east', 'europe', 'asia'],
  testDevices: ['desktop', 'mobile'],
  testFrequency: 300000, // 5 minutes
  alertThresholds: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    availability: 0.95
  },
  alerting: {
    webhookUrl: process.env.ALERT_WEBHOOK_URL,
    enabledChannels: ['console', 'webhook', 'slack']
  }
});
```

## Summary

Performance monitoring transforms the abstract concept of "fast" into concrete, actionable data that drives meaningful improvements. By implementing comprehensive monitoring strategies—combining Real User Monitoring (RUM) for authentic user insights with Synthetic Monitoring for consistent baselines—teams gain the visibility needed to optimize performance proactively rather than reactively.

**The Strategic Value:**
- **Data-Driven Decisions**: Replace assumptions about performance with real user data and consistent synthetic measurements
- **Proactive Issue Detection**: Identify performance regressions before they impact large numbers of users
- **Business Impact Correlation**: Connect performance metrics directly to business outcomes like conversion rates and user engagement
- **Continuous Optimization**: Enable ongoing performance improvements through trend analysis and comparative benchmarking

**Real User Monitoring Benefits:**
- **Authentic Insights**: Capture actual user experiences across diverse devices, networks, and geographic locations
- **Comprehensive Coverage**: Monitor all aspects of user experience from page loads to interactions and errors
- **Segmentation Capabilities**: Analyze performance by user segments, device types, geographic regions, and business contexts
- **Real-World Validation**: Verify that optimizations actually improve the user experience in production environments

**Synthetic Monitoring Benefits:**
- **Consistent Baselines**: Establish reliable performance benchmarks that aren't affected by user behavior variations
- **Early Warning System**: Detect issues immediately after deployments or infrastructure changes
- **Competitive Analysis**: Compare your performance against competitors using standardized testing conditions
- **Global Visibility**: Monitor performance from multiple geographic locations to ensure global user experience quality

**Advanced Analytics Benefits:**
- **Trend Identification**: Recognize performance patterns and predict future issues before they become critical
- **Root Cause Analysis**: Drill down from high-level metrics to specific elements, resources, or code causing performance issues
- **Optimization Prioritization**: Use data to focus optimization efforts on changes that will have the greatest user impact
- **Performance Culture**: Create organizational awareness and accountability around performance through shared metrics and insights

**Implementation Best Practices:**
- **Sampling Strategy**: Balance comprehensive data collection with performance impact through intelligent sampling
- **Data Quality**: Ensure monitoring doesn't negatively impact the performance it's meant to measure
- **Alert Tuning**: Configure alerts that are sensitive enough to catch real issues but specific enough to avoid false positives
- **Cross-Team Collaboration**: Make performance data accessible to developers, designers, product managers, and business stakeholders

**Monitoring Evolution:**
- **Modern Metrics**: Stay current with evolving standards like the transition from FID to Interaction to Next Paint (INP)
- **AI-Enhanced Analysis**: Leverage machine learning for anomaly detection, predictive analysis, and automated insights
- **Integration Ecosystem**: Connect performance monitoring with deployment pipelines, error tracking, business analytics, and user feedback systems
- **Privacy-First Monitoring**: Implement performance monitoring that respects user privacy and complies with data protection regulations

**Business Outcomes:**
- **Improved SEO**: Better Core Web Vitals scores lead to improved search rankings and organic traffic growth
- **Higher Conversions**: Faster, more stable sites convert visitors to customers at significantly higher rates
- **Reduced Costs**: Proactive monitoring prevents expensive emergency fixes and reduces support burden
- **Enhanced Reputation**: Consistently good performance builds user trust and brand loyalty
- **Competitive Advantage**: Superior performance becomes a differentiator that attracts and retains users

Performance monitoring is not a one-time setup but an ongoing practice that evolves with your application, user base, and business goals. The most successful teams treat monitoring as a continuous investment in user experience, using data to make informed decisions that balance performance, functionality, and business objectives.

The key to effective performance monitoring lies in choosing the right combination of monitoring approaches, implementing them thoroughly, and most importantly, acting on the insights they provide. Monitoring without action is merely data collection—true performance excellence comes from using monitoring data to drive systematic, user-focused improvements.

*Performance monitoring transforms the question "Is our site fast?" into actionable answers about where performance can be improved, how changes impact real users, and which optimizations deliver the greatest business value.*
