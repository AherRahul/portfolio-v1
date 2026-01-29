---
title: "Security Headers"
description: "Master essential HTTP security headers that protect web applications from common attacks. Learn about Content-Security-Policy, X-XSS-Protection, Strict-Transport-Security, X-Content-Type-Options, and how to implement comprehensive header security strategies."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-03-13"
datePublished: "2026-03-13"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048349/Portfolio/FrontendSystemDesignCourse/titleImages/13_yjshgl.png)

Security Headers – Fortifying Web Applications Through HTTP Headers
------------------------------------------------------------------------------------

Imagine you're the security architect for a major financial institution that processes millions of transactions daily. Your web application handles sensitive user data, financial transfers, and confidential business information. Despite implementing robust authentication and authorization systems, you discover that your application is still vulnerable to various attacks - XSS injections are bypassing your input validation, sensitive data is being leaked through referrer headers, and malicious sites are embedding your application in iframes for clickjacking attacks.

The solution lies not just in application code, but in the foundational HTTP layer itself. **Security headers** are HTTP response headers that instruct browsers on how to behave when handling your website's content. They serve as the first line of defense, providing security controls that are enforced at the browser level before any application code even executes. In this comprehensive guide, we'll explore the essential security headers that can transform your web application from vulnerable to fortress-like in security.

## Understanding Security Headers

Security headers are HTTP response headers that provide instructions to browsers about how to handle various security aspects of your web application. Unlike application-level security measures that can be bypassed or disabled, security headers are enforced by the browser itself, creating an additional security layer that's difficult for attackers to circumvent.

### Why Security Headers Matter

**Browser-Level Enforcement**: Security headers are processed and enforced by the browser before any JavaScript executes or content is rendered, providing protection even against sophisticated attacks.

**Defense in Depth**: They complement application-level security measures, creating multiple layers of protection that attackers must bypass.

**Standardized Protection**: Security headers follow web standards, ensuring consistent behavior across different browsers and platforms.

**Zero Code Changes**: Most security headers can be implemented at the server level without requiring changes to application code.

**Real-world Impact**: According to OWASP, proper implementation of security headers can prevent up to 80% of common web application attacks.

## Core Security Headers

### 1. Content Security Policy (CSP)

Content Security Policy is arguably the most powerful security header, providing fine-grained control over resource loading and execution.

**Basic CSP Implementation:**

```javascript
// Express.js CSP implementation
const express = require('express');
const helmet = require('helmet');
const app = express();

// Basic CSP configuration
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Avoid in production
      'https://trusted-cdn.com',
      'https://analytics.google.com'
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Sometimes necessary for CSS frameworks
      'https://fonts.googleapis.com'
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://*.cloudinary.com',
      'https://images.unsplash.com'
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com'
    ],
    connectSrc: [
      "'self'",
      'https://api.yourservice.com',
      'wss://websocket.yourservice.com'
    ],
    mediaSrc: ["'self'"],
    objectSrc: ["'none'"], // Disable plugins
    childSrc: ["'none'"], // Disable frames
    frameAncestors: ["'none'"], // Prevent framing
    formAction: ["'self'"], // Restrict form submissions
    baseUri: ["'self'"], // Prevent base tag injection
    manifestSrc: ["'self'"] // PWA manifest
  },
  reportOnly: false // Set to true for testing
}));
```

**Advanced CSP with Nonce Strategy:**

```javascript
// CSP with nonce for inline scripts
const crypto = require('crypto');

// Middleware to generate nonce for each request
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// CSP with nonce
app.use((req, res, next) => {
  const nonce = res.locals.nonce;
  
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `font-src 'self' https://fonts.gstatic.com`,
    `connect-src 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  next();
});

// In your HTML template
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Secure App</title>
    </head>
    <body>
        <h1>Welcome</h1>
        <!-- Inline script with nonce -->
        <script nonce="${res.locals.nonce}">
            console.log('This script is allowed by CSP');
            
            // Dynamic script loading (allowed by strict-dynamic)
            const script = document.createElement('script');
            script.src = '/js/dynamic-content.js';
            document.head.appendChild(script);
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});
```

**CSP Violation Reporting:**

```javascript
// CSP violation reporting endpoint
app.post('/csp-violation-report', (req, res) => {
  const report = req.body;
  
  console.log('CSP Violation Report:', {
    blockedURI: report['blocked-uri'],
    documentURI: report['document-uri'],
    effectiveDirective: report['effective-directive'],
    originalPolicy: report['original-policy'],
    referrer: report.referrer,
    statusCode: report['status-code'],
    violatedDirective: report['violated-directive'],
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  // Store violation in database for analysis
  db.cspViolations.insert({
    blockedURI: report['blocked-uri'],
    documentURI: report['document-uri'],
    violatedDirective: report['violated-directive'],
    timestamp: new Date(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  res.status(204).send();
});

// CSP with report-uri
const cspWithReporting = [
  `default-src 'self'`,
  `script-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `report-uri /csp-violation-report`
].join('; ');

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', cspWithReporting);
  next();
});
```

### 2. Strict Transport Security (HSTS)

HSTS forces browsers to use HTTPS connections and prevents downgrade attacks.

**HSTS Implementation:**

```javascript
// HSTS header implementation
app.use((req, res, next) => {
  // Only set HSTS on HTTPS connections
  if (req.secure || req.get('X-Forwarded-Proto') === 'https') {
    res.setHeader('Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// Using helmet for HSTS
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true,
  preload: true // Submit to HSTS preload list
}));

// Conditional HSTS based on environment
const hstsConfig = {
  production: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  staging: {
    maxAge: 86400, // 1 day
    includeSubDomains: false,
    preload: false
  },
  development: {
    maxAge: 0, // Disable HSTS in development
    includeSubDomains: false,
    preload: false
  }
};

const currentConfig = hstsConfig[process.env.NODE_ENV] || hstsConfig.development;

if (process.env.NODE_ENV !== 'development') {
  app.use(helmet.hsts(currentConfig));
}
```

**HTTPS Redirection with HSTS:**

```javascript
// Force HTTPS redirection
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    // Check if request is coming through a proxy (like Cloudflare)
    const forwardedProto = req.get('X-Forwarded-Proto');
    
    if (forwardedProto !== 'https') {
      return res.redirect(301, `https://${req.get('Host')}${req.url}`);
    }
  }
  next();
});

// Set HSTS header after HTTPS verification
app.use((req, res, next) => {
  if (req.secure || req.get('X-Forwarded-Proto') === 'https') {
    res.setHeader('Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload');
  }
  next();
});
```

### 3. X-Content-Type-Options

Prevents MIME type sniffing attacks by ensuring browsers respect declared content types.

```javascript
// X-Content-Type-Options implementation
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Using helmet
app.use(helmet.noSniff());

// File upload with proper content type validation
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      // Generate secure filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    // Strict MIME type validation
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Set proper content type for file serving
  res.setHeader('Content-Type', req.file.mimetype);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    mimetype: req.file.mimetype
  });
});

// Serve files with proper headers
app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Detect MIME type
  const mimetype = mime.lookup(filepath) || 'application/octet-stream';
  
  res.setHeader('Content-Type', mimetype);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  
  res.sendFile(filepath);
});
```

### 4. X-Frame-Options

Prevents clickjacking attacks by controlling iframe embedding.

```javascript
// X-Frame-Options implementation
app.use((req, res, next) => {
  // Default: deny all framing
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Route-specific frame options
const frameOptionsMiddleware = (action) => (req, res, next) => {
  res.setHeader('X-Frame-Options', action);
  next();
};

// Admin pages: always deny
app.use('/admin/*', frameOptionsMiddleware('DENY'));

// Embeddable content: allow same origin
app.use('/embed/*', frameOptionsMiddleware('SAMEORIGIN'));

// Public API documentation: allow same origin
app.use('/docs/*', frameOptionsMiddleware('SAMEORIGIN'));

// Using helmet with conditional logic
app.use(helmet.frameguard({
  action: (req) => {
    if (req.path.startsWith('/admin')) {
      return 'deny';
    } else if (req.path.startsWith('/embed')) {
      return 'sameorigin';
    }
    return 'deny';
  }
}));
```

### 5. X-XSS-Protection

Enables browser's built-in XSS filtering (note: being deprecated in favor of CSP).

```javascript
// X-XSS-Protection implementation
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Using helmet
app.use(helmet.xssFilter());

// Custom XSS protection with reporting
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block; report=/xss-report');
  next();
});

// XSS violation reporting endpoint
app.post('/xss-report', (req, res) => {
  console.log('XSS Protection Triggered:', {
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  // Log to security monitoring system
  securityLogger.warn('XSS protection triggered', {
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    ip: req.ip
  });
  
  res.status(204).send();
});
```

### 6. Referrer-Policy

Controls how much referrer information is shared with external sites.

```javascript
// Referrer-Policy implementation
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Route-specific referrer policies
const referrerPolicyMap = {
  '/admin': 'no-referrer', // No referrer for admin pages
  '/payment': 'no-referrer', // No referrer for payment pages
  '/api': 'same-origin', // Same origin only for API
  '/public': 'strict-origin-when-cross-origin' // Default for public content
};

app.use((req, res, next) => {
  let policy = 'strict-origin-when-cross-origin'; // Default
  
  for (const [path, pathPolicy] of Object.entries(referrerPolicyMap)) {
    if (req.path.startsWith(path)) {
      policy = pathPolicy;
      break;
    }
  }
  
  res.setHeader('Referrer-Policy', policy);
  next();
});

// Using helmet
app.use(helmet.referrerPolicy({
  policy: ['no-referrer', 'strict-origin-when-cross-origin']
}));
```

### 7. Permissions-Policy (formerly Feature-Policy)

Controls which browser features and APIs can be used.

```javascript
// Permissions-Policy implementation
app.use((req, res, next) => {
  const permissions = [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
    'interest-cohort=()' // Disable FLoC
  ].join(', ');
  
  res.setHeader('Permissions-Policy', permissions);
  next();
});

// Conditional permissions based on route
const getPermissionsForRoute = (path) => {
  if (path.startsWith('/video-call')) {
    return [
      'camera=(self)',
      'microphone=(self)',
      'accelerometer=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'payment=()',
      'usb=()'
    ];
  } else if (path.startsWith('/maps')) {
    return [
      'geolocation=(self)',
      'camera=()',
      'microphone=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'payment=()',
      'usb=()'
    ];
  } else {
    // Default: disable all sensitive features
    return [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()',
      'interest-cohort=()' // Disable FLoC tracking
    ];
  }
};

app.use((req, res, next) => {
  const permissions = getPermissionsForRoute(req.path);
  res.setHeader('Permissions-Policy', permissions.join(', '));
  next();
});
```

## Advanced Security Header Configurations

### 1. Comprehensive Security Header Suite

```javascript
// Complete security headers middleware
const securityHeaders = (req, res, next) => {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "child-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "manifest-src 'self'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);
  
  // HSTS (only on HTTPS)
  if (req.secure || req.get('X-Forwarded-Proto') === 'https') {
    res.setHeader('Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload');
  }
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent framing
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Disable potentially harmful browser features
  res.setHeader('Permissions-Policy', [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=()',
    'usb=()',
    'interest-cohort=()'
  ].join(', '));
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  res.setHeader('Server', 'WebServer');
  
  // Prevent caching of sensitive content
  if (req.path.includes('/admin') || req.path.includes('/account')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

app.use(securityHeaders);
```

### 2. Dynamic Security Headers Based on Content Type

```javascript
// Content-type specific security headers
const contentTypeHeaders = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  
  res.send = function(body) {
    applyContentSecurityHeaders(this, 'html');
    return originalSend.call(this, body);
  };
  
  res.json = function(obj) {
    applyContentSecurityHeaders(this, 'json');
    return originalJson.call(this, obj);
  };
  
  next();
};

const applyContentSecurityHeaders = (res, contentType) => {
  switch (contentType) {
    case 'html':
      // HTML responses need full CSP
      res.setHeader('Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'");
      res.setHeader('X-Frame-Options', 'DENY');
      break;
      
    case 'json':
      // API responses need CORS and cache control
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'no-store');
      break;
      
    case 'image':
      // Image responses
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      break;
  }
};

app.use(contentTypeHeaders);
```

### 3. Security Headers Testing and Validation

```javascript
// Security headers validation middleware
const validateSecurityHeaders = (req, res, next) => {
  const originalSetHeader = res.setHeader;
  const headers = {};
  
  res.setHeader = function(name, value) {
    headers[name.toLowerCase()] = value;
    return originalSetHeader.call(this, name, value);
  };
  
  const originalSend = res.send;
  res.send = function(body) {
    // Validate security headers before sending response
    const validationResults = validateHeaders(headers, req);
    
    if (validationResults.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn('Security Header Warnings:', validationResults);
    }
    
    return originalSend.call(this, body);
  };
  
  next();
};

const validateHeaders = (headers, req) => {
  const warnings = [];
  
  // Check for CSP
  if (!headers['content-security-policy'] && !headers['content-security-policy-report-only']) {
    warnings.push('Missing Content-Security-Policy header');
  }
  
  // Check for HSTS on HTTPS
  if ((req.secure || req.get('X-Forwarded-Proto') === 'https') && 
      !headers['strict-transport-security']) {
    warnings.push('Missing HSTS header on HTTPS connection');
  }
  
  // Check for X-Frame-Options or CSP frame-ancestors
  if (!headers['x-frame-options'] && 
      !headers['content-security-policy']?.includes('frame-ancestors')) {
    warnings.push('Missing clickjacking protection');
  }
  
  // Check for X-Content-Type-Options
  if (!headers['x-content-type-options']) {
    warnings.push('Missing X-Content-Type-Options header');
  }
  
  // Check for dangerous CSP directives
  const csp = headers['content-security-policy'];
  if (csp) {
    if (csp.includes("'unsafe-eval'")) {
      warnings.push("CSP contains 'unsafe-eval' - security risk");
    }
    if (csp.includes("'unsafe-inline'") && !csp.includes('nonce-')) {
      warnings.push("CSP contains 'unsafe-inline' without nonce - consider using nonce");
    }
  }
  
  return warnings;
};

if (process.env.NODE_ENV === 'development') {
  app.use(validateSecurityHeaders);
}
```

### 4. Security Headers Monitoring and Reporting

```javascript
// Security monitoring system
class SecurityHeadersMonitor {
  constructor() {
    this.violations = [];
    this.headerStats = {};
  }
  
  logViolation(type, details) {
    const violation = {
      type,
      details,
      timestamp: new Date(),
      userAgent: details.userAgent,
      ip: details.ip,
      url: details.url
    };
    
    this.violations.push(violation);
    console.log('Security violation logged:', violation);
    
    // Send to external monitoring service
    this.sendToMonitoringService(violation);
  }
  
  async sendToMonitoringService(violation) {
    try {
      await fetch('https://monitoring-service.com/api/security-violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violation)
      });
    } catch (error) {
      console.error('Failed to send violation to monitoring service:', error);
    }
  }
  
  generateSecurityReport() {
    const now = Date.now();
    const last24Hours = this.violations.filter(v => 
      now - v.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    
    return {
      totalViolations: this.violations.length,
      last24Hours: last24Hours.length,
      violationTypes: this.groupBy(last24Hours, 'type'),
      topUserAgents: this.getTopUserAgents(last24Hours),
      topIPs: this.getTopIPs(last24Hours)
    };
  }
  
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key];
      result[group] = result[group] || [];
      result[group].push(item);
      return result;
    }, {});
  }
  
  getTopUserAgents(violations) {
    const counts = {};
    violations.forEach(v => {
      counts[v.userAgent] = (counts[v.userAgent] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  }
  
  getTopIPs(violations) {
    const counts = {};
    violations.forEach(v => {
      counts[v.ip] = (counts[v.ip] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  }
}

const monitor = new SecurityHeadersMonitor();

// CSP violation reporting
app.post('/csp-violation-report', (req, res) => {
  monitor.logViolation('csp', {
    blockedURI: req.body['blocked-uri'],
    documentURI: req.body['document-uri'],
    violatedDirective: req.body['violated-directive'],
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    url: req.body['document-uri']
  });
  
  res.status(204).send();
});

// Security dashboard
app.get('/admin/security-report', requireAuth, (req, res) => {
  const report = monitor.generateSecurityReport();
  res.json(report);
});
```

## Security Headers Testing Tools

### 1. Automated Header Testing

```javascript
// Automated security header testing suite
class SecurityHeadersTester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.tests = [
      { name: 'Content-Security-Policy', test: this.testCSP },
      { name: 'Strict-Transport-Security', test: this.testHSTS },
      { name: 'X-Frame-Options', test: this.testFrameOptions },
      { name: 'X-Content-Type-Options', test: this.testContentTypeOptions },
      { name: 'X-XSS-Protection', test: this.testXSSProtection },
      { name: 'Referrer-Policy', test: this.testReferrerPolicy },
      { name: 'Permissions-Policy', test: this.testPermissionsPolicy }
    ];
  }
  
  async runAllTests(paths = ['/']) {
    const results = {};
    
    for (const path of paths) {
      const url = `${this.baseUrl}${path}`;
      console.log(`Testing security headers for: ${url}`);
      
      try {
        const response = await fetch(url);
        const headers = response.headers;
        
        results[path] = {
          url,
          status: response.status,
          tests: await this.runTestsForHeaders(headers)
        };
      } catch (error) {
        results[path] = {
          url,
          error: error.message,
          tests: []
        };
      }
    }
    
    return this.generateTestReport(results);
  }
  
  async runTestsForHeaders(headers) {
    const testResults = [];
    
    for (const { name, test } of this.tests) {
      const result = await test.call(this, headers);
      testResults.push({ name, ...result });
    }
    
    return testResults;
  }
  
  testCSP(headers) {
    const csp = headers.get('content-security-policy') || 
                headers.get('content-security-policy-report-only');
    
    if (!csp) {
      return { passed: false, message: 'CSP header missing' };
    }
    
    const issues = [];
    
    if (csp.includes("'unsafe-eval'")) {
      issues.push("Contains 'unsafe-eval'");
    }
    
    if (csp.includes("'unsafe-inline'") && !csp.includes('nonce-')) {
      issues.push("Contains 'unsafe-inline' without nonce");
    }
    
    if (!csp.includes('frame-ancestors')) {
      issues.push("Missing 'frame-ancestors' directive");
    }
    
    return {
      passed: issues.length === 0,
      message: issues.length > 0 ? issues.join(', ') : 'CSP properly configured',
      value: csp
    };
  }
  
  testHSTS(headers) {
    const hsts = headers.get('strict-transport-security');
    
    if (!hsts) {
      return { passed: false, message: 'HSTS header missing' };
    }
    
    const issues = [];
    
    if (!hsts.includes('max-age=')) {
      issues.push('Missing max-age directive');
    } else {
      const maxAge = hsts.match(/max-age=(\d+)/);
      if (maxAge && parseInt(maxAge[1]) < 31536000) { // 1 year
        issues.push('max-age should be at least 1 year (31536000 seconds)');
      }
    }
    
    if (!hsts.includes('includeSubDomains')) {
      issues.push('Consider adding includeSubDomains');
    }
    
    return {
      passed: issues.length === 0,
      message: issues.length > 0 ? issues.join(', ') : 'HSTS properly configured',
      value: hsts
    };
  }
  
  testFrameOptions(headers) {
    const frameOptions = headers.get('x-frame-options');
    const csp = headers.get('content-security-policy');
    
    if (!frameOptions && (!csp || !csp.includes('frame-ancestors'))) {
      return { 
        passed: false, 
        message: 'No clickjacking protection (X-Frame-Options or CSP frame-ancestors)' 
      };
    }
    
    if (frameOptions && !['DENY', 'SAMEORIGIN'].includes(frameOptions.toUpperCase())) {
      return { 
        passed: false, 
        message: 'X-Frame-Options should be DENY or SAMEORIGIN',
        value: frameOptions
      };
    }
    
    return {
      passed: true,
      message: 'Clickjacking protection enabled',
      value: frameOptions || 'Protected by CSP'
    };
  }
  
  testContentTypeOptions(headers) {
    const contentTypeOptions = headers.get('x-content-type-options');
    
    if (!contentTypeOptions) {
      return { passed: false, message: 'X-Content-Type-Options header missing' };
    }
    
    if (contentTypeOptions.toLowerCase() !== 'nosniff') {
      return { 
        passed: false, 
        message: 'X-Content-Type-Options should be "nosniff"',
        value: contentTypeOptions
      };
    }
    
    return {
      passed: true,
      message: 'Content type sniffing protection enabled',
      value: contentTypeOptions
    };
  }
  
  testXSSProtection(headers) {
    const xssProtection = headers.get('x-xss-protection');
    
    // X-XSS-Protection is being deprecated in favor of CSP
    const csp = headers.get('content-security-policy');
    
    if (!xssProtection && !csp) {
      return { 
        passed: false, 
        message: 'No XSS protection (X-XSS-Protection or CSP)' 
      };
    }
    
    if (xssProtection && !xssProtection.startsWith('1')) {
      return { 
        passed: false, 
        message: 'X-XSS-Protection should be enabled (1; mode=block)',
        value: xssProtection
      };
    }
    
    return {
      passed: true,
      message: csp ? 'Protected by CSP' : 'XSS protection enabled',
      value: xssProtection || 'Protected by CSP'
    };
  }
  
  testReferrerPolicy(headers) {
    const referrerPolicy = headers.get('referrer-policy');
    
    if (!referrerPolicy) {
      return { passed: false, message: 'Referrer-Policy header missing' };
    }
    
    const secureValues = [
      'no-referrer',
      'no-referrer-when-downgrade',
      'strict-origin',
      'strict-origin-when-cross-origin',
      'same-origin'
    ];
    
    if (!secureValues.includes(referrerPolicy)) {
      return { 
        passed: false, 
        message: 'Referrer-Policy should use a secure value',
        value: referrerPolicy
      };
    }
    
    return {
      passed: true,
      message: 'Referrer policy properly configured',
      value: referrerPolicy
    };
  }
  
  testPermissionsPolicy(headers) {
    const permissionsPolicy = headers.get('permissions-policy');
    
    if (!permissionsPolicy) {
      return { 
        passed: false, 
        message: 'Permissions-Policy header missing - consider adding for enhanced security' 
      };
    }
    
    const issues = [];
    
    // Check for commonly problematic permissions
    const dangerousFeatures = ['camera', 'microphone', 'geolocation', 'payment'];
    
    dangerousFeatures.forEach(feature => {
      if (!permissionsPolicy.includes(`${feature}=()`) && 
          !permissionsPolicy.includes(`${feature}=(self)`)) {
        issues.push(`Consider restricting ${feature} permission`);
      }
    });
    
    return {
      passed: issues.length === 0,
      message: issues.length > 0 ? issues.join(', ') : 'Permissions policy properly configured',
      value: permissionsPolicy
    };
  }
  
  generateTestReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPaths: Object.keys(results).length,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
      },
      details: results,
      recommendations: []
    };
    
    // Calculate summary statistics
    Object.values(results).forEach(pathResult => {
      if (pathResult.tests) {
        pathResult.tests.forEach(test => {
          report.summary.totalTests++;
          if (test.passed) {
            report.summary.passedTests++;
          } else {
            report.summary.failedTests++;
          }
        });
      }
    });
    
    // Generate recommendations
    const commonIssues = {};
    Object.values(results).forEach(pathResult => {
      if (pathResult.tests) {
        pathResult.tests.forEach(test => {
          if (!test.passed) {
            commonIssues[test.name] = (commonIssues[test.name] || 0) + 1;
          }
        });
      }
    });
    
    Object.entries(commonIssues).forEach(([header, count]) => {
      report.recommendations.push(`${header} issues found in ${count} path(s)`);
    });
    
    return report;
  }
}

// Usage
const tester = new SecurityHeadersTester('https://your-website.com');
tester.runAllTests(['/', '/admin', '/api/users'])
  .then(report => {
    console.log('Security Headers Test Report:', report);
    
    // Save report to file
    fs.writeFileSync(
      `security-headers-report-${Date.now()}.json`,
      JSON.stringify(report, null, 2)
    );
  });
```

## Security Headers Best Practices

### 1. Development vs Production Configuration

```javascript
// Environment-specific security configurations
const getSecurityConfig = (env) => {
  const configs = {
    development: {
      csp: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "ws://localhost:*"]
        },
        reportOnly: true
      },
      hsts: {
        maxAge: 0 // Disabled in development
      }
    },
    
    staging: {
      csp: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "wss://staging-api.yoursite.com"]
        },
        reportOnly: false
      },
      hsts: {
        maxAge: 86400, // 1 day
        includeSubDomains: false
      }
    },
    
    production: {
      csp: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://trusted-cdn.com"],
          styleSrc: ["'self'", "https://fonts.googleapis.com"],
          imgSrc: ["'self'", "https:", "data:"],
          connectSrc: ["'self'", "wss://api.yoursite.com"],
          reportUri: ["/csp-violation-report"]
        },
        reportOnly: false
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      }
    }
  };
  
  return configs[env] || configs.development;
};

const config = getSecurityConfig(process.env.NODE_ENV);

// Apply configuration
app.use(helmet({
  contentSecurityPolicy: config.csp,
  hsts: config.hsts
}));
```

### 2. Security Headers Optimization

```javascript
// Performance-optimized security headers
const optimizedSecurityHeaders = (req, res, next) => {
  // Cache security headers object to avoid recreating
  if (!res.locals.securityHeaders) {
    res.locals.securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
    
    // Add HSTS only for HTTPS
    if (req.secure || req.get('X-Forwarded-Proto') === 'https') {
      res.locals.securityHeaders['Strict-Transport-Security'] = 
        'max-age=31536000; includeSubDomains; preload';
    }
    
    // Route-specific headers
    if (req.path.startsWith('/api/')) {
      res.locals.securityHeaders['Cache-Control'] = 'no-store';
    }
  }
  
  // Set all headers at once
  Object.entries(res.locals.securityHeaders).forEach(([name, value]) => {
    res.setHeader(name, value);
  });
  
  next();
};

app.use(optimizedSecurityHeaders);
```

## Summary

Security headers represent one of the most powerful and effective ways to protect web applications at the browser level. They provide a standardized, browser-enforced security layer that complements your application-level security measures and can prevent a wide range of attacks before they even reach your application code.

**Essential Headers for Every Application:**
- **Content Security Policy (CSP)**: Prevents XSS, code injection, and unauthorized resource loading through fine-grained control over content sources and execution context
- **Strict Transport Security (HSTS)**: Enforces HTTPS connections and prevents downgrade attacks by instructing browsers to only use secure connections
- **X-Content-Type-Options**: Prevents MIME sniffing attacks by ensuring browsers respect declared content types
- **X-Frame-Options**: Protects against clickjacking by controlling how your pages can be embedded in frames
- **Referrer-Policy**: Controls referrer information leakage to protect user privacy and prevent information disclosure

**Advanced Protection Through Headers:**
- **Permissions-Policy**: Provides granular control over browser features and APIs, preventing unauthorized access to sensitive capabilities like camera, microphone, and location services
- **X-XSS-Protection**: Enables browser-built XSS filtering as a fallback protection layer (being superseded by CSP)

**Implementation Best Practices:**
- **Environment-Specific Configuration**: Use different security policies for development, staging, and production environments to balance security with development needs
- **Progressive Enhancement**: Start with basic headers and gradually implement more sophisticated policies like CSP with nonce-based script execution
- **Monitoring and Reporting**: Implement CSP violation reporting and security header monitoring to detect attacks and misconfigurations
- **Regular Testing**: Use automated tools to regularly test your security header implementation and ensure it remains effective against new threats

**Performance Considerations:**
- Cache security header configurations to avoid repeated computations
- Use route-specific headers only when necessary to minimize processing overhead
- Implement headers at the reverse proxy level (nginx, Cloudflare) when possible for better performance

The investment in properly implementing security headers pays dividends in protection against common web application attacks. They're relatively simple to implement but provide robust protection that scales with your application. Most importantly, security headers are enforced at the browser level, making them difficult for attackers to bypass and providing consistent protection across different user environments.

By implementing comprehensive security headers, you create a strong foundation for web application security that protects your users and your business from a wide range of web-based attacks while maintaining good performance and user experience.


*Secure by default, protect by design. Security headers are your first line of defense in the browser battlefield.*
