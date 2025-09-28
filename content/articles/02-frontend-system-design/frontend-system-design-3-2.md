---
title: "iFrame Protection"
description: "Explore iframe security vulnerabilities and protection mechanisms. Learn about clickjacking attacks, X-Frame-Options header, Content Security Policy frame directives, and best practices for secure iframe implementation in modern web applications."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-03-12"
datePublished: "2025-03-12"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048349/Portfolio/FrontendSystemDesignCourse/titleImages/12_gcsiwh.png)

iFrame Protection – Defending Against Clickjacking and Frame-Based Attacks
---------------------------------------------------------------------------

Imagine you're running an online banking platform where users perform sensitive operations like fund transfers, account management, and investment decisions. One day, you notice unusual activity - users are reporting that they're clicking on what appears to be a "Play Video" button on a seemingly innocent entertainment website, but instead, they're unknowingly transferring money from their bank accounts. The entertainment site has embedded your banking interface in an invisible iframe, positioning it precisely where users click to play videos. This sophisticated attack is called **clickjacking**, and it's one of the most deceptive web security threats.

This scenario illustrates why **iframe protection** is crucial for modern web applications. Iframes can be powerful tools for embedding content, but they also create significant security vulnerabilities when not properly protected. In this comprehensive guide, we'll explore iframe-related security threats and learn how to implement robust protection mechanisms.

## Understanding iFrame Vulnerabilities

An **iframe (inline frame)** is an HTML element that allows embedding another HTML document within the current document. While iframes serve legitimate purposes like embedding videos, maps, or third-party widgets, they can be exploited by malicious actors to deceive users and compromise security.

### How iFrame Attacks Work

**The Basic Attack Vector:**
1. **Embedding**: Attacker embeds the victim's website in an iframe on their malicious site
2. **Concealment**: The iframe is made invisible or disguised as something else
3. **Deception**: Users are tricked into interacting with the hidden iframe
4. **Exploitation**: User actions are hijacked to perform unintended operations

**Real-world Example:**
In 2008, Adobe Flash settings were manipulated through clickjacking attacks where users thought they were clicking on innocuous content but were actually enabling microphone and camera access through an invisible Flash settings panel embedded in an iframe.

## Types of iFrame-Based Attacks

### 1. Clickjacking (UI Redressing)

Clickjacking is the most common iframe-based attack where malicious sites trick users into clicking on elements of a different website than what they perceive.

**Basic Clickjacking Example:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Win a Free iPhone!</title>
    <style>
        .fake-button {
            position: relative;
            background-color: #ff4444;
            color: white;
            padding: 20px 40px;
            font-size: 24px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            z-index: 1;
        }
        
        .hidden-iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0; /* Completely invisible */
            z-index: 2; /* Above the fake button */
        }
        
        .container {
            position: relative;
            display: inline-block;
        }
    </style>
</head>
<body>
    <h1>🎉 Congratulations! You've won a FREE iPhone! 🎉</h1>
    <p>Click the button below to claim your prize!</p>
    
    <div class="container">
        <button class="fake-button">Claim Your iPhone!</button>
        <!-- Invisible iframe with victim's delete account page -->
        <iframe 
            src="https://victim-bank.com/delete-account" 
            class="hidden-iframe"
            scrolling="no">
        </iframe>
    </div>
</body>
</html>
```

In this attack, users think they're claiming a prize, but they're actually clicking on a hidden banking interface that might delete their account or transfer funds.

### 2. Likejacking

A specific type of clickjacking targeting social media platforms, where users unknowingly like, share, or follow content.

**Likejacking Implementation:**

```html
<div style="position: relative;">
    <!-- Visible content that users want to interact with -->
    <div class="interesting-content">
        <h2>Amazing Cat Video - Click to Play!</h2>
        <img src="cat-thumbnail.jpg" alt="Cute cat">
    </div>
    
    <!-- Hidden Facebook Like button positioned over the play button -->
    <iframe 
        src="https://www.facebook.com/plugins/like.php?href=https://malicious-site.com"
        style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 999;
        "
        scrolling="no">
    </iframe>
</div>
```

### 3. Drag and Drop Attacks

These attacks exploit the HTML5 drag and drop functionality within iframes to steal sensitive information.

**Drag and Drop Attack Example:**

```html
<style>
    .drop-zone {
        width: 300px;
        height: 200px;
        border: 2px dashed #ccc;
        text-align: center;
        padding: 50px;
        position: relative;
    }
    
    .hidden-sensitive-iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
    }
</style>

<div class="drop-zone" ondrop="stealData(event)" ondragover="allowDrop(event)">
    <p>Drop your files here to upload</p>
    
    <!-- Hidden iframe containing sensitive data -->
    <iframe 
        src="https://victim-site.com/confidential-document"
        class="hidden-sensitive-iframe">
    </iframe>
</div>

<script>
function allowDrop(ev) {
    ev.preventDefault();
}

function stealData(ev) {
    ev.preventDefault();
    // Malicious code to exfiltrate dragged data
    const data = ev.dataTransfer.getData("text");
    sendToMaliciousServer(data);
}
</script>
```

## iFrame Protection Mechanisms

### 1. X-Frame-Options Header

The **X-Frame-Options** HTTP header is the primary defense against clickjacking attacks. It tells browsers whether a page can be embedded in an iframe.

**X-Frame-Options Values:**

- **DENY**: The page cannot be embedded in any iframe
- **SAMEORIGIN**: The page can only be embedded in iframes from the same origin
- **ALLOW-FROM uri**: The page can only be embedded in iframes from the specified URI (deprecated in favor of CSP)

**Implementation in Node.js/Express:**

```javascript
const express = require('express');
const app = express();

// Method 1: Using helmet middleware (recommended)
const helmet = require('helmet');

app.use(helmet({
  frameguard: {
    action: 'deny' // Options: 'deny', 'sameorigin'
  }
}));

// Method 2: Manual implementation
app.use((req, res, next) => {
  // Protect all pages from being framed
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Or allow framing only from same origin
  // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  next();
});

// Method 3: Conditional frame protection
app.use((req, res, next) => {
  // Allow framing for specific routes (like embeddable widgets)
  if (req.path.startsWith('/embed/') || req.path.startsWith('/widget/')) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  } else {
    // Protect sensitive pages
    res.setHeader('X-Frame-Options', 'DENY');
  }
  
  next();
});

// Specific route-level protection
app.get('/admin/*', (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.get('/banking/*', (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Embeddable content
app.get('/embed/video/:id', (req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
}, (req, res) => {
  // Serve embeddable video content
  res.render('embed-video', { videoId: req.params.id });
});
```

**Implementation in Other Frameworks:**

```javascript
// Next.js implementation
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      },
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ];
  }
};

// Or in _document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    
    // Set X-Frame-Options header
    ctx.res.setHeader('X-Frame-Options', 'DENY');
    
    return initialProps;
  }
  
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

### 2. Content Security Policy (CSP) Frame Directives

CSP provides more flexible iframe protection through the **frame-ancestors** directive, which is the modern replacement for X-Frame-Options.

**CSP Frame Protection Implementation:**

```javascript
// Comprehensive CSP frame protection
app.use((req, res, next) => {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Be careful with unsafe-inline
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    // Frame protection directives
    "frame-ancestors 'none'", // Modern equivalent of X-Frame-Options: DENY
    "frame-src 'none'", // Prevent this page from embedding iframes
    "child-src 'none'" // Additional protection for web workers and nested contexts
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', cspDirectives);
  next();
});

// Granular frame protection for different routes
const getCSPForRoute = (route) => {
  const baseCSP = {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": ["'self'"]
  };
  
  if (route.startsWith('/admin')) {
    // Admin pages: complete frame protection
    return {
      ...baseCSP,
      "frame-ancestors": ["'none'"],
      "frame-src": ["'none'"],
      "child-src": ["'none'"]
    };
  } else if (route.startsWith('/embed')) {
    // Embeddable content: allow same-origin framing
    return {
      ...baseCSP,
      "frame-ancestors": ["'self'"],
      "frame-src": ["'self'"],
      "child-src": ["'self'"]
    };
  } else if (route.startsWith('/widget')) {
    // Public widgets: allow specific trusted domains
    return {
      ...baseCSP,
      "frame-ancestors": ["'self'", "https://trusted-partner.com", "https://*.trusted-cdn.com"],
      "frame-src": ["'self'"],
      "child-src": ["'self'"]
    };
  } else {
    // Default protection for regular pages
    return {
      ...baseCSP,
      "frame-ancestors": ["'none'"],
      "frame-src": ["'self'"],
      "child-src": ["'self'"]
    };
  }
};

// Apply route-specific CSP
app.use((req, res, next) => {
  const cspConfig = getCSPForRoute(req.path);
  const cspString = Object.entries(cspConfig)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
  
  res.setHeader('Content-Security-Policy', cspString);
  next();
});
```

### 3. JavaScript-Based Frame Protection (Frame Busting)

While HTTP headers are the preferred method, JavaScript-based protection can provide additional defense layers.

**Advanced Frame Busting Implementation:**

```javascript
// Sophisticated frame busting script
(function() {
    'use strict';
    
    // Configuration
    const config = {
        allowedOrigins: [
            window.location.origin,
            'https://trusted-partner.com'
        ],
        redirectOnDetection: true,
        reportEndpoint: '/api/security/frame-detection'
    };
    
    // Check if page is framed
    function isFramed() {
        try {
            return window !== window.top;
        } catch (e) {
            // If we can't access window.top due to cross-origin, we're likely framed
            return true;
        }
    }
    
    // Get parent window origin safely
    function getParentOrigin() {
        try {
            return window.parent.location.origin;
        } catch (e) {
            // Cross-origin parent, return null
            return null;
        }
    }
    
    // Check if parent origin is allowed
    function isAllowedOrigin(origin) {
        if (!origin) return false;
        return config.allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                // Wildcard matching
                const pattern = allowed.replace(/\*/g, '.*');
                return new RegExp(pattern).test(origin);
            }
            return allowed === origin;
        });
    }
    
    // Report frame detection attempt
    function reportFrameDetection() {
        if (config.reportEndpoint) {
            fetch(config.reportEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer,
                    parentOrigin: getParentOrigin(),
                    currentUrl: window.location.href
                })
            }).catch(err => console.error('Frame detection report failed:', err));
        }
    }
    
    // Break out of frame
    function breakFrame() {
        try {
            if (config.redirectOnDetection) {
                // Redirect parent window to our page
                window.top.location.href = window.location.href;
            } else {
                // Just make our window the top window
                window.top.location.replace(window.location.href);
            }
        } catch (e) {
            // If we can't redirect parent, try other methods
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: red;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    z-index: 999999;
                ">
                    <div>
                        <h1>Security Warning</h1>
                        <p>This page has been embedded in an unauthorized frame.</p>
                        <a href="${window.location.href}" style="color: white;">
                            Click here to view this page safely
                        </a>
                    </div>
                </div>
            `;
        }
    }
    
    // Continuous monitoring
    function monitorFraming() {
        if (isFramed()) {
            const parentOrigin = getParentOrigin();
            
            if (!isAllowedOrigin(parentOrigin)) {
                console.warn('Unauthorized framing detected from:', parentOrigin);
                reportFrameDetection();
                breakFrame();
            }
        }
        
        // Re-check every second
        setTimeout(monitorFraming, 1000);
    }
    
    // Initialize protection
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', monitorFraming);
    } else {
        monitorFraming();
    }
    
    // Prevent frame manipulation
    Object.defineProperty(window, 'top', {
        get: function() {
            return window;
        },
        set: function() {
            return window;
        },
        configurable: false
    });
    
    // Additional protection against frame manipulation
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'message') {
            // Filter potentially malicious postMessage events
            const wrappedListener = function(event) {
                if (config.allowedOrigins.includes(event.origin)) {
                    listener(event);
                }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
})();
```

### 4. Secure iframe Implementation for Legitimate Use Cases

When you need to embed content in iframes legitimately, implement proper security measures:

**Secure iframe Embedding:**

```html
<!-- Secure iframe implementation -->
<iframe 
    src="https://trusted-content.com/embed/video/123"
    
    <!-- Security attributes -->
    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    
    <!-- Referrer policy -->
    referrerpolicy="strict-origin-when-cross-origin"
    
    <!-- Loading optimization -->
    loading="lazy"
    
    <!-- Accessibility -->
    title="Embedded Video Player"
    
    <!-- Dimensions -->
    width="560" 
    height="315"
    
    <!-- Additional security -->
    allow="accelerometer 'none'; camera 'none'; microphone 'none'; geolocation 'none'"
    
    <!-- CSP for iframe content -->
    csp="default-src 'self' https://trusted-cdn.com; script-src 'self' 'unsafe-inline'"
>
    <!-- Fallback content -->
    <p>Your browser does not support iframes. 
    <a href="https://trusted-content.com/video/123">View content directly</a></p>
</iframe>
```

**JavaScript iframe Security Wrapper:**

```javascript
class SecureIFrameManager {
    constructor() {
        this.trustedDomains = [
            'https://youtube.com',
            'https://vimeo.com',
            'https://maps.google.com'
        ];
        
        this.defaultSandboxAttributes = [
            'allow-scripts',
            'allow-same-origin',
            'allow-popups',
            'allow-forms'
        ];
    }
    
    createSecureIFrame(config) {
        const {
            src,
            container,
            width = 560,
            height = 315,
            title = 'Embedded Content',
            sandbox = this.defaultSandboxAttributes,
            allowAttributes = {},
            onLoad = () => {},
            onError = () => {}
        } = config;
        
        // Validate source URL
        if (!this.isValidSource(src)) {
            throw new Error(`Untrusted iframe source: ${src}`);
        }
        
        // Create iframe element
        const iframe = document.createElement('iframe');
        
        // Set secure attributes
        iframe.src = src;
        iframe.width = width;
        iframe.height = height;
        iframe.title = title;
        iframe.sandbox = sandbox.join(' ');
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.loading = 'lazy';
        
        // Set allow attributes for permissions policy
        const allowString = Object.entries(allowAttributes)
            .map(([feature, policy]) => `${feature} ${policy}`)
            .join('; ');
        if (allowString) {
            iframe.allow = allowString;
        }
        
        // Add event listeners
        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);
        
        // Security monitoring
        this.monitorIFrame(iframe);
        
        // Add to container
        if (typeof container === 'string') {
            document.getElementById(container).appendChild(iframe);
        } else {
            container.appendChild(iframe);
        }
        
        return iframe;
    }
    
    isValidSource(src) {
        try {
            const url = new URL(src);
            return this.trustedDomains.some(domain => {
                return url.origin === new URL(domain).origin;
            });
        } catch (e) {
            return false;
        }
    }
    
    monitorIFrame(iframe) {
        // Monitor for suspicious behavior
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'src') {
                        const newSrc = iframe.getAttribute('src');
                        if (!this.isValidSource(newSrc)) {
                            console.warn('Iframe source changed to untrusted URL:', newSrc);
                            iframe.remove();
                        }
                    }
                }
            });
        });
        
        observer.observe(iframe, {
            attributes: true,
            attributeFilter: ['src', 'sandbox', 'allow']
        });
        
        return observer;
    }
    
    // Method to safely communicate with iframe
    postMessageToFrame(iframe, message, targetOrigin) {
        if (!this.isValidSource(targetOrigin)) {
            throw new Error('Cannot post message to untrusted origin');
        }
        
        iframe.contentWindow.postMessage(message, targetOrigin);
    }
    
    // Method to handle messages from iframe
    setupMessageListener(allowedOrigins, handler) {
        window.addEventListener('message', (event) => {
            if (!allowedOrigins.includes(event.origin)) {
                console.warn('Received message from untrusted origin:', event.origin);
                return;
            }
            
            handler(event);
        });
    }
}

// Usage example
const iframeManager = new SecureIFrameManager();

// Create a secure YouTube embed
iframeManager.createSecureIFrame({
    src: 'https://youtube.com/embed/dQw4w9WgXcQ',
    container: 'video-container',
    title: 'YouTube Video',
    allowAttributes: {
        'accelerometer': "'none'",
        'camera': "'none'",
        'microphone': "'none'",
        'gyroscope': "'none'"
    },
    onLoad: () => console.log('Video loaded successfully'),
    onError: () => console.error('Failed to load video')
});
```

## Advanced Protection Techniques

### 1. Dynamic Frame Protection Based on User Context

```javascript
// Context-aware frame protection
class ContextualFrameProtector {
    constructor() {
        this.userContext = this.getUserContext();
        this.protectionLevel = this.calculateProtectionLevel();
    }
    
    getUserContext() {
        return {
            isAuthenticated: !!localStorage.getItem('auth_token'),
            userRole: localStorage.getItem('user_role'),
            isAdminPage: window.location.pathname.includes('/admin'),
            isSensitivePage: this.checkSensitivePage(),
            sessionId: this.getSessionId()
        };
    }
    
    checkSensitivePage() {
        const sensitivePatterns = [
            '/account',
            '/payment',
            '/settings',
            '/profile',
            '/admin',
            '/transfer',
            '/delete'
        ];
        
        return sensitivePatterns.some(pattern => 
            window.location.pathname.includes(pattern)
        );
    }
    
    calculateProtectionLevel() {
        let level = 'basic';
        
        if (this.userContext.isAuthenticated) {
            level = 'authenticated';
        }
        
        if (this.userContext.isSensitivePage) {
            level = 'sensitive';
        }
        
        if (this.userContext.isAdminPage || this.userContext.userRole === 'admin') {
            level = 'maximum';
        }
        
        return level;
    }
    
    applyProtection() {
        switch (this.protectionLevel) {
            case 'maximum':
                this.applyMaximumProtection();
                break;
            case 'sensitive':
                this.applySensitiveProtection();
                break;
            case 'authenticated':
                this.applyAuthenticatedProtection();
                break;
            default:
                this.applyBasicProtection();
        }
    }
    
    applyMaximumProtection() {
        // Immediate frame breaking for admin pages
        if (window !== window.top) {
            window.top.location.href = window.location.href;
        }
        
        // Disable right-click context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // Disable text selection
        document.body.style.userSelect = 'none';
        
        // Monitor for developer tools
        this.detectDevTools();
    }
    
    applySensitiveProtection() {
        if (window !== window.top) {
            this.showSecurityWarning();
        }
        
        // Enhanced monitoring
        this.enableEnhancedMonitoring();
    }
    
    applyAuthenticatedProtection() {
        if (window !== window.top) {
            this.logSecurityEvent();
        }
    }
    
    applyBasicProtection() {
        // Basic frame busting
        if (window !== window.top) {
            console.warn('Page loaded in frame');
        }
    }
    
    showSecurityWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(255, 0, 0, 0.95);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-family: Arial, sans-serif;
            ">
                <div style="text-align: center; padding: 40px;">
                    <h1>🚨 Security Alert</h1>
                    <p>This page contains sensitive information and cannot be displayed in a frame.</p>
                    <button onclick="window.top.location.href='${window.location.href}'" 
                            style="
                                background: white;
                                color: red;
                                border: none;
                                padding: 15px 30px;
                                font-size: 16px;
                                cursor: pointer;
                                margin-top: 20px;
                            ">
                        Open in New Window
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(warningDiv);
    }
    
    enableEnhancedMonitoring() {
        // Monitor for suspicious frame manipulation
        const observer = new MutationObserver(() => {
            if (window !== window.top) {
                this.logSecurityEvent('Frame manipulation detected');
            }
        });
        
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
    
    logSecurityEvent(event = 'Framing detected') {
        fetch('/api/security/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                sessionId: this.userContext.sessionId
            })
        });
    }
    
    detectDevTools() {
        // Simple developer tools detection
        setInterval(() => {
            const startTime = performance.now();
            debugger;
            const endTime = performance.now();
            
            if (endTime - startTime > 100) {
                this.logSecurityEvent('Developer tools detected');
            }
        }, 3000);
    }
    
    getSessionId() {
        return localStorage.getItem('session_id') || 'anonymous';
    }
}

// Initialize protection
const frameProtector = new ContextualFrameProtector();
frameProtector.applyProtection();
```

### 2. Server-Side Frame Detection and Logging

```javascript
// Server-side frame detection endpoint
app.post('/api/security/frame-detection', (req, res) => {
    const {
        timestamp,
        userAgent,
        referrer,
        parentOrigin,
        currentUrl
    } = req.body;
    
    // Log the security event
    console.log('Frame detection report:', {
        timestamp: new Date(timestamp),
        userAgent,
        referrer,
        parentOrigin,
        currentUrl,
        ip: req.ip,
        sessionId: req.sessionID
    });
    
    // Store in security database
    db.securityEvents.insert({
        type: 'frame_detection',
        timestamp: new Date(timestamp),
        details: {
            userAgent,
            referrer,
            parentOrigin,
            currentUrl,
            ip: req.ip,
            sessionId: req.sessionID
        },
        severity: 'medium'
    });
    
    // Check if this is a repeated attack
    const recentEvents = db.securityEvents.count({
        ip: req.ip,
        type: 'frame_detection',
        timestamp: { $gte: new Date(Date.now() - 3600000) } // Last hour
    });
    
    if (recentEvents > 5) {
        // Potential ongoing attack - enhance monitoring
        db.securityEvents.insert({
            type: 'potential_attack',
            timestamp: new Date(),
            details: {
                ip: req.ip,
                eventCount: recentEvents,
                description: 'Multiple frame detection events from same IP'
            },
            severity: 'high'
        });
    }
    
    res.json({ status: 'logged' });
});

// Security dashboard endpoint
app.get('/admin/security/frame-attacks', requireAdmin, (req, res) => {
    const frameAttacks = db.securityEvents.find({
        type: { $in: ['frame_detection', 'potential_attack'] }
    }).sort({ timestamp: -1 }).limit(100);
    
    res.json(frameAttacks);
});
```

## Testing iFrame Protection

### Automated Testing Suite

```javascript
// iFrame protection testing suite
class FrameProtectionTester {
    constructor(targetUrl) {
        this.targetUrl = targetUrl;
        this.results = [];
    }
    
    async runAllTests() {
        console.log(`Testing frame protection for: ${this.targetUrl}`);
        
        await this.testXFrameOptions();
        await this.testCSPFrameAncestors();
        await this.testBasicClickjacking();
        await this.testTransparentOverlay();
        await this.testJavaScriptFrameBusting();
        
        return this.generateReport();
    }
    
    async testXFrameOptions() {
        try {
            const response = await fetch(this.targetUrl);
            const xFrameOptions = response.headers.get('X-Frame-Options');
            
            this.results.push({
                test: 'X-Frame-Options Header',
                passed: !!xFrameOptions,
                value: xFrameOptions,
                recommendation: xFrameOptions ? 'Header present' : 'Add X-Frame-Options header'
            });
        } catch (error) {
            this.results.push({
                test: 'X-Frame-Options Header',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testCSPFrameAncestors() {
        try {
            const response = await fetch(this.targetUrl);
            const csp = response.headers.get('Content-Security-Policy');
            const hasFrameAncestors = csp && csp.includes('frame-ancestors');
            
            this.results.push({
                test: 'CSP frame-ancestors',
                passed: hasFrameAncestors,
                value: csp,
                recommendation: hasFrameAncestors ? 'CSP frame-ancestors present' : 'Add frame-ancestors directive to CSP'
            });
        } catch (error) {
            this.results.push({
                test: 'CSP frame-ancestors',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testBasicClickjacking() {
        return new Promise((resolve) => {
            const testFrame = document.createElement('iframe');
            testFrame.src = this.targetUrl;
            testFrame.style.display = 'none';
            
            const timeout = setTimeout(() => {
                this.results.push({
                    test: 'Basic Clickjacking Protection',
                    passed: false,
                    recommendation: 'Page loads in iframe - potential clickjacking vulnerability'
                });
                document.body.removeChild(testFrame);
                resolve();
            }, 3000);
            
            testFrame.onload = () => {
                clearTimeout(timeout);
                try {
                    // Try to access iframe content
                    const iframeDocument = testFrame.contentDocument;
                    if (iframeDocument) {
                        this.results.push({
                            test: 'Basic Clickjacking Protection',
                            passed: false,
                            recommendation: 'Page accessible in iframe - implement frame protection'
                        });
                    }
                } catch (e) {
                    this.results.push({
                        test: 'Basic Clickjacking Protection',
                        passed: true,
                        recommendation: 'Cross-origin restrictions prevent access'
                    });
                }
                document.body.removeChild(testFrame);
                resolve();
            };
            
            testFrame.onerror = () => {
                clearTimeout(timeout);
                this.results.push({
                    test: 'Basic Clickjacking Protection',
                    passed: true,
                    recommendation: 'Frame loading blocked'
                });
                document.body.removeChild(testFrame);
                resolve();
            };
            
            document.body.appendChild(testFrame);
        });
    }
    
    async testTransparentOverlay() {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: transparent;
                z-index: 999999;
                pointer-events: auto;
            `;
            
            const testFrame = document.createElement('iframe');
            testFrame.src = this.targetUrl;
            testFrame.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                opacity: 0.01;
                z-index: 999998;
            `;
            
            let clickDetected = false;
            
            overlay.addEventListener('click', () => {
                clickDetected = true;
            });
            
            document.body.appendChild(testFrame);
            document.body.appendChild(overlay);
            
            setTimeout(() => {
                this.results.push({
                    test: 'Transparent Overlay Attack',
                    passed: !clickDetected,
                    recommendation: clickDetected ? 
                        'Vulnerable to transparent overlay attacks' : 
                        'Protected against transparent overlay attacks'
                });
                
                document.body.removeChild(testFrame);
                document.body.removeChild(overlay);
                resolve();
            }, 2000);
        });
    }
    
    async testJavaScriptFrameBusting() {
        return new Promise((resolve) => {
            const testFrame = document.createElement('iframe');
            testFrame.src = this.targetUrl;
            testFrame.style.display = 'none';
            
            let frameBusted = false;
            
            const originalLocation = window.location.href;
            
            const checkFrameBusting = setInterval(() => {
                if (window.location.href !== originalLocation) {
                    frameBusted = true;
                    clearInterval(checkFrameBusting);
                    window.location.href = originalLocation; // Restore original URL
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(checkFrameBusting);
                this.results.push({
                    test: 'JavaScript Frame Busting',
                    passed: frameBusted,
                    recommendation: frameBusted ? 
                        'JavaScript frame busting active' : 
                        'Consider implementing JavaScript frame busting'
                });
                
                if (document.body.contains(testFrame)) {
                    document.body.removeChild(testFrame);
                }
                resolve();
            }, 3000);
            
            document.body.appendChild(testFrame);
        });
    }
    
    generateReport() {
        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;
        const score = Math.round((passed / total) * 100);
        
        return {
            url: this.targetUrl,
            score,
            summary: `${passed}/${total} tests passed`,
            grade: this.getGrade(score),
            results: this.results,
            recommendations: this.results
                .filter(r => !r.passed)
                .map(r => r.recommendation)
        };
    }
    
    getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }
}

// Usage
const tester = new FrameProtectionTester('https://your-website.com');
tester.runAllTests().then(report => {
    console.log('Frame Protection Test Report:', report);
});
```

## Summary

iFrame protection is a critical security measure that protects web applications from clickjacking and other frame-based attacks. The key to effective iframe protection lies in implementing multiple layers of defense:

**HTTP Headers**: Use `X-Frame-Options` and CSP `frame-ancestors` directives to control how your pages can be embedded. These server-side controls provide the strongest protection against framing attacks.

**Context-Aware Protection**: Implement different levels of protection based on page sensitivity, user authentication status, and content type. Administrative and sensitive pages should have the strongest protection, while embeddable content needs more flexible controls.

**JavaScript Frame Busting**: Add client-side frame detection and breaking scripts as an additional layer of defense. While not foolproof, they provide protection when HTTP headers might be bypassed or not supported.

**Secure iframe Implementation**: When you need to embed content, use proper security attributes like `sandbox`, implement CSP for iframe content, and validate all embedded sources against trusted domain lists.

**Monitoring and Detection**: Implement logging and monitoring systems to detect potential clickjacking attempts. This helps identify attack patterns and improve your security posture over time.

**Regular Testing**: Conduct automated and manual testing of your frame protection mechanisms to ensure they're working correctly and haven't been bypassed by new attack techniques.

**User Education**: Educate users about the risks of clicking suspicious links and train them to recognize potential clickjacking attempts, especially for high-value targets like financial services.

The most effective iframe protection strategy combines multiple approaches: strong HTTP headers for broad protection, context-aware JavaScript for specific scenarios, and continuous monitoring for threat detection. By implementing these comprehensive protection measures, you can defend your users against sophisticated clickjacking attacks while maintaining legitimate functionality where needed.

Remember that security is not a one-time implementation but an ongoing process that requires regular updates as new attack vectors emerge and web technologies evolve.


*Protect your frames, protect your users. Implement robust iframe protection to maintain trust and security in your web applications.*
