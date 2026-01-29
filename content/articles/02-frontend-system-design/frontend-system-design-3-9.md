---
title: "Server-Side Request Forgery (SSRF)"
description: "Understand Server-Side Request Forgery attacks and prevention strategies. Learn how SSRF exploits server functionality, identify vulnerable patterns, and implement comprehensive protection mechanisms in modern web architectures."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-03-19"
datePublished: "2026-03-19"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048331/Portfolio/FrontendSystemDesignCourse/titleImages/19_mloj7u.png)

Server-Side Request Forgery (SSRF) – Defending Against Network-Level Attacks
--------------------------------------------------------------------------------

Imagine your web server being turned into an unwitting accomplice that makes requests on behalf of an attacker, accessing internal systems, cloud metadata services, or external resources that should be off-limits. This is the essence of Server-Side Request Forgery (SSRF)—a vulnerability that exploits the trust relationship between your server and other network resources, potentially exposing sensitive data, internal services, and cloud infrastructure.

**Server-Side Request Forgery (SSRF)** is a web security vulnerability that allows attackers to abuse server functionality to access or manipulate information in the realm of the server that hosts the application. SSRF attacks can be used to access internal services, read local files, perform port scanning, or interact with cloud metadata services—all by manipulating the server into making requests that appear legitimate but serve malicious purposes.

In modern cloud-native applications where services communicate across networks, access cloud APIs, and interact with internal microservices, SSRF vulnerabilities become particularly dangerous. They can expose internal infrastructure, cloud credentials, database connections, and administrative interfaces that were never intended to be accessible from external sources.

In this comprehensive guide, we'll explore SSRF attack vectors and prevention strategies, from understanding how SSRF exploits server-side request functionality to implementing robust validation, network segmentation, and security controls that protect against sophisticated SSRF attacks in modern web architectures.

## Understanding SSRF Attack Architecture

SSRF attacks exploit the server's ability to make HTTP requests to arbitrary URLs, turning legitimate server functionality into a tool for reconnaissance, data exfiltration, and internal system access.

### The Theoretical Foundation of SSRF Attacks

**What is Server-Side Request Forgery?**
SSRF is like giving an attacker the ability to use your server as their personal web browser. Instead of making requests from their own machine (which might be blocked or monitored), they trick your server into making requests on their behalf. This is particularly dangerous because your server likely has access to internal networks and services that external attackers cannot reach directly.

**The Trust Boundary Problem:**
Modern applications often need to fetch external resources—APIs, images, webhooks, etc. This legitimate functionality becomes a vulnerability when:

1. **Internal Network Access**: Your server can access internal services (databases, admin panels, monitoring systems)
2. **Cloud Metadata Services**: Cloud instances have special endpoints (like 169.254.169.254) that provide credentials and configuration
3. **Trust Relationships**: Your server is trusted by other internal services and may bypass authentication

**Common SSRF Attack Scenarios:**

**Scenario 1: URL Fetching Features**
```javascript
// Vulnerable code example
app.post('/fetch-url', (req, res) => {
  const url = req.body.url; // User-controlled input
  fetch(url) // Direct request without validation
    .then(response => response.text())
    .then(data => res.send(data));
});
```

**What the attacker can do:**
- `http://localhost:8080/admin` - Access internal admin panel
- `http://169.254.169.254/latest/meta-data/` - Get AWS credentials
- `http://192.168.1.100:3306` - Port scan internal database

**Scenario 2: Webhook/Callback URLs**
When users can specify callback URLs for notifications, these become SSRF vectors if not properly validated.

**Scenario 3: Image/File Processing**
Features that fetch images or files from URLs can be exploited to access internal resources.

### SSRF Attack Vectors

```
🎯 Server-Side Request Forgery Attack Surface

📡 External Service Interactions
   • URL validation bypasses
   • Redirect chain exploitation
   • DNS rebinding attacks
   • Protocol smuggling techniques

🏢 Internal Network Access
   • Private network enumeration (192.168.x.x, 10.x.x.x)
   • Localhost service probing (127.0.0.1)
   • Internal API discovery and exploitation
   • Database and admin interface access

☁️ Cloud Infrastructure Attacks
   • AWS metadata service access (169.254.169.254)
   • Azure Instance Metadata Service exploitation
   • Google Cloud metadata endpoint abuse
   • Container orchestration API access

🔍 Information Disclosure
   • File system access via file:// protocol
   • Port scanning and service fingerprinting
   • Configuration file exposure
   • Credential and token extraction

⚡ Advanced SSRF Techniques
   • Time-based blind SSRF detection
   • DNS exfiltration methods
   • HTTP parameter pollution
   • Encoding and obfuscation bypasses
```

## Advanced SSRF Prevention Implementation

Protecting against SSRF requires comprehensive input validation, network security controls, and architectural design that assumes internal network compromise while maintaining application functionality.

### Enterprise-Grade SSRF Protection System

```javascript
/**
 * Advanced Server-Side Request Forgery (SSRF) Prevention Framework
 * Comprehensive solution for validating and securing server-side HTTP requests
 */

class SSRFProtectionFramework {
  constructor(config = {}) {
    this.config = {
      // URL validation settings
      allowedProtocols: config.allowedProtocols || ['http', 'https'],
      allowedDomains: config.allowedDomains || [],
      blockedDomains: config.blockedDomains || [],
      allowedPorts: config.allowedPorts || [80, 443, 8080, 8443],
      
      // IP address restrictions
      allowPrivateIPs: config.allowPrivateIPs || false,
      allowLoopback: config.allowLoopback || false,
      allowLinkLocal: config.allowLinkLocal || false,
      allowMulticast: config.allowMulticast || false,
      
      // Request limitations
      maxRequestSize: config.maxRequestSize || 1024 * 1024, // 1MB
      requestTimeout: config.requestTimeout || 10000, // 10 seconds
      maxRedirects: config.maxRedirects || 3,
      followRedirects: config.followRedirects !== false,
      
      // Security features
      enableDNSResolution: config.enableDNSResolution !== false,
      enableUserAgentFiltering: config.enableUserAgentFiltering !== false,
      enableRequestLogging: config.enableRequestLogging !== false,
      enableRateLimiting: config.enableRateLimiting !== false,
      
      // Cloud security
      blockCloudMetadata: config.blockCloudMetadata !== false,
      cloudMetadataEndpoints: config.cloudMetadataEndpoints || [
        '169.254.169.254', // AWS, Google Cloud
        '169.254.169.253', // AWS IMDSv2
        '100.64.0.200',    // Oracle Cloud
        '192.0.0.192'      // DigitalOcean
      ],
      
      ...config
    };

    // Internal state
    this.requestCache = new Map();
    this.rateLimitMap = new Map();
    this.blockedIPs = new Set();
    this.allowedIPRanges = [];
    this.dnsCache = new Map();
    
    // Statistics
    this.stats = {
      requestsProcessed: 0,
      requestsBlocked: 0,
      ssrfAttemptsDetected: 0,
      cloudMetadataBlocked: 0
    };

    this.initializeIPRanges();
  }

  // Initialize IP address ranges for validation
  initializeIPRanges() {
    this.privateIPRanges = [
      { start: this.ipToNumber('10.0.0.0'), end: this.ipToNumber('10.255.255.255') },
      { start: this.ipToNumber('172.16.0.0'), end: this.ipToNumber('172.31.255.255') },
      { start: this.ipToNumber('192.168.0.0'), end: this.ipToNumber('192.168.255.255') }
    ];
    
    this.loopbackRange = {
      start: this.ipToNumber('127.0.0.0'),
      end: this.ipToNumber('127.255.255.255')
    };
    
    this.linkLocalRange = {
      start: this.ipToNumber('169.254.0.0'),
      end: this.ipToNumber('169.254.255.255')
    };
    
    this.multicastRange = {
      start: this.ipToNumber('224.0.0.0'),
      end: this.ipToNumber('239.255.255.255')
    };
  }

  // Main SSRF validation method
  async validateRequest(url, options = {}) {
    try {
      this.stats.requestsProcessed++;
      
      // Parse and validate URL
      const parsedUrl = this.parseURL(url);
      if (!parsedUrl.isValid) {
        this.stats.requestsBlocked++;
        return {
          allowed: false,
          reason: 'Invalid URL format',
          details: parsedUrl.errors
        };
      }
      
      // Protocol validation
      const protocolCheck = this.validateProtocol(parsedUrl.protocol);
      if (!protocolCheck.allowed) {
        this.stats.requestsBlocked++;
        return protocolCheck;
      }
      
      // Domain and IP validation
      const addressCheck = await this.validateAddress(parsedUrl.hostname);
      if (!addressCheck.allowed) {
        this.stats.requestsBlocked++;
        if (addressCheck.reason.includes('metadata') || 
            addressCheck.reason.includes('private') || 
            addressCheck.reason.includes('loopback')) {
          this.stats.ssrfAttemptsDetected++;
        }
        return addressCheck;
      }
      
      // Port validation
      const portCheck = this.validatePort(parsedUrl.port || this.getDefaultPort(parsedUrl.protocol));
      if (!portCheck.allowed) {
        this.stats.requestsBlocked++;
        return portCheck;
      }
      
      // Rate limiting check
      const rateLimitCheck = this.checkRateLimit(parsedUrl.hostname);
      if (!rateLimitCheck.allowed) {
        this.stats.requestsBlocked++;
        return rateLimitCheck;
      }
      
      // Additional security checks
      const securityCheck = this.performSecurityChecks(parsedUrl, options);
      if (!securityCheck.allowed) {
        this.stats.requestsBlocked++;
        return securityCheck;
      }
      
      return {
        allowed: true,
        sanitizedUrl: this.sanitizeURL(parsedUrl),
        requestOptions: this.buildSecureRequestOptions(options)
      };
      
    } catch (error) {
      this.stats.requestsBlocked++;
      return {
        allowed: false,
        reason: 'Validation error',
        details: error.message
      };
    }
  }

  // URL parsing with comprehensive validation
  parseURL(url) {
    try {
      // Basic format validation
      if (typeof url !== 'string' || url.length === 0) {
        return { isValid: false, errors: ['Empty or invalid URL'] };
      }
      
      if (url.length > 2048) {
        return { isValid: false, errors: ['URL too long'] };
      }
      
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /@/g // Potential user info
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          return { 
            isValid: false, 
            errors: [`Suspicious URL pattern detected: ${pattern}`) 
          };
        }
      }
      
      const parsedUrl = new URL(url);
      
      return {
        isValid: true,
        protocol: parsedUrl.protocol.slice(0, -1),
        hostname: parsedUrl.hostname.toLowerCase(),
        port: parsedUrl.port,
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        href: parsedUrl.href
      };
      
    } catch (error) {
      return { 
        isValid: false, 
        errors: [`URL parsing failed: ${error.message}`] 
      };
    }
  }

  // Protocol validation
  validateProtocol(protocol) {
    if (!this.config.allowedProtocols.includes(protocol)) {
      return {
        allowed: false,
        reason: 'Protocol not allowed',
        details: `Protocol '${protocol}' is not in allowed list: ${this.config.allowedProtocols.join(', ')}`
      };
    }
    
    return { allowed: true };
  }

  // Address validation (domain/IP)
  async validateAddress(hostname) {
    // Check domain allowlist/blocklist first
    if (this.config.allowedDomains.length > 0) {
      const isDomainAllowed = this.config.allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
      
      if (!isDomainAllowed) {
        return {
          allowed: false,
          reason: 'Domain not in allowlist',
          details: `Domain '${hostname}' is not in allowed domains`
        };
      }
    }
    
    if (this.config.blockedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain))) {
      return {
        allowed: false,
        reason: 'Domain blocked',
        details: `Domain '${hostname}' is in blocked list`
      };
    }
    
    // Resolve hostname to IP address
    let resolvedIPs = [];
    try {
      if (this.config.enableDNSResolution) {
        resolvedIPs = await this.resolveDNS(hostname);
      } else {
        // If DNS resolution is disabled, check if it's already an IP
        if (this.isIPAddress(hostname)) {
          resolvedIPs = [hostname];
        }
      }
    } catch (error) {
      return {
        allowed: false,
        reason: 'DNS resolution failed',
        details: error.message
      };
    }
    
    // Validate each resolved IP
    for (const ip of resolvedIPs) {
      const ipCheck = this.validateIP(ip);
      if (!ipCheck.allowed) {
        return ipCheck;
      }
    }
    
    return { allowed: true, resolvedIPs };
  }

  // IP address validation
  validateIP(ip) {
    if (!this.isValidIPv4(ip)) {
      return {
        allowed: false,
        reason: 'Invalid IP address format',
        details: `IP '${ip}' is not a valid IPv4 address`
      };
    }
    
    // Check cloud metadata endpoints
    if (this.config.blockCloudMetadata && 
        this.config.cloudMetadataEndpoints.includes(ip)) {
      this.stats.cloudMetadataBlocked++;
      return {
        allowed: false,
        reason: 'Cloud metadata endpoint blocked',
        details: `IP '${ip}' is a cloud metadata service endpoint`
      };
    }
    
    const ipNum = this.ipToNumber(ip);
    
    // Check private IP ranges
    if (!this.config.allowPrivateIPs && this.isPrivateIP(ipNum)) {
      return {
        allowed: false,
        reason: 'Private IP address blocked',
        details: `IP '${ip}' is in private address range`
      };
    }
    
    // Check loopback addresses
    if (!this.config.allowLoopback && this.isLoopbackIP(ipNum)) {
      return {
        allowed: false,
        reason: 'Loopback IP address blocked',
        details: `IP '${ip}' is a loopback address`
      };
    }
    
    // Check link-local addresses
    if (!this.config.allowLinkLocal && this.isLinkLocalIP(ipNum)) {
      return {
        allowed: false,
        reason: 'Link-local IP address blocked',
        details: `IP '${ip}' is a link-local address`
      };
    }
    
    // Check multicast addresses
    if (!this.config.allowMulticast && this.isMulticastIP(ipNum)) {
      return {
        allowed: false,
        reason: 'Multicast IP address blocked',
        details: `IP '${ip}' is a multicast address`
      };
    }
    
    // Check explicitly blocked IPs
    if (this.blockedIPs.has(ip)) {
      return {
        allowed: false,
        reason: 'IP explicitly blocked',
        details: `IP '${ip}' is in blocked IP list`
      };
    }
    
    return { allowed: true };
  }

  // Port validation
  validatePort(port) {
    const portNum = parseInt(port, 10);
    
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return {
        allowed: false,
        reason: 'Invalid port number',
        details: `Port '${port}' is not a valid port number`
      };
    }
    
    if (this.config.allowedPorts.length > 0 && 
        !this.config.allowedPorts.includes(portNum)) {
      return {
        allowed: false,
        reason: 'Port not allowed',
        details: `Port ${portNum} is not in allowed ports list`
      };
    }
    
    return { allowed: true };
  }

  // Rate limiting check
  checkRateLimit(hostname) {
    if (!this.config.enableRateLimiting) {
      return { allowed: true };
    }
    
    const now = Date.now();
    const windowSize = 60000; // 1 minute
    const maxRequests = 100; // Max requests per window
    
    if (!this.rateLimitMap.has(hostname)) {
      this.rateLimitMap.set(hostname, {
        requests: 1,
        windowStart: now
      });
      return { allowed: true };
    }
    
    const rateData = this.rateLimitMap.get(hostname);
    
    if (now - rateData.windowStart > windowSize) {
      // Reset window
      rateData.requests = 1;
      rateData.windowStart = now;
      return { allowed: true };
    }
    
    if (rateData.requests >= maxRequests) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        details: `Too many requests to ${hostname}`
      };
    }
    
    rateData.requests++;
    return { allowed: true };
  }

  // Additional security checks
  performSecurityChecks(parsedUrl, options) {
    // Check for URL encoding bypasses
    const decodedPath = decodeURIComponent(parsedUrl.pathname);
    if (decodedPath !== parsedUrl.pathname) {
      // Look for suspicious patterns in decoded path
      const suspiciousPatterns = [
        /\.\.\//g, // Path traversal
        /127\.0\.0\.1/g, // Localhost
        /localhost/gi,
        /192\.168\./g, // Private IP
        /10\./g,
        /172\.1[6-9]\./g,
        /172\.2[0-9]\./g,
        /172\.3[0-1]\./g
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(decodedPath)) {
          return {
            allowed: false,
            reason: 'URL encoding bypass detected',
            details: 'Suspicious pattern found in decoded URL path'
          };
        }
      }
    }
    
    // Check for suspicious headers
    if (options.headers) {
      const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'host'];
      for (const header of suspiciousHeaders) {
        if (header in options.headers) {
          return {
            allowed: false,
            reason: 'Suspicious header detected',
            details: `Header '${header}' not allowed in SSRF context`
          };
        }
      }
    }
    
    return { allowed: true };
  }

  // DNS resolution with caching
  async resolveDNS(hostname) {
    // Check cache first
    if (this.dnsCache.has(hostname)) {
      const cached = this.dnsCache.get(hostname);
      if (Date.now() - cached.timestamp < 300000) { // 5 minute cache
        return cached.ips;
      }
    }
    
    // Resolve DNS (Note: In actual implementation, use proper DNS library)
    return new Promise((resolve, reject) => {
      // This is a simplified example - use dns.lookup in Node.js
      try {
        const dns = require('dns');
        dns.lookup(hostname, { all: true }, (err, addresses) => {
          if (err) {
            reject(err);
          } else {
            const ips = addresses.map(addr => addr.address);
            
            // Cache result
            this.dnsCache.set(hostname, {
              ips,
              timestamp: Date.now()
            });
            
            resolve(ips);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Secure request wrapper
  async makeSecureRequest(url, options = {}) {
    const validation = await this.validateRequest(url, options);
    
    if (!validation.allowed) {
      throw new SSRFError(validation.reason, validation.details);
    }
    
    const secureOptions = {
      ...validation.requestOptions,
      timeout: this.config.requestTimeout,
      maxRedirects: this.config.maxRedirects,
      followRedirect: this.config.followRedirects
    };
    
    // Log request if enabled
    if (this.config.enableRequestLogging) {
      console.log(`SSRF-Protected Request: ${validation.sanitizedUrl}`, {
        timestamp: new Date().toISOString(),
        options: secureOptions
      });
    }
    
    try {
      // Use appropriate HTTP client (axios, fetch, etc.)
      const response = await this.httpClient(validation.sanitizedUrl, secureOptions);
      return response;
    } catch (error) {
      if (this.config.enableRequestLogging) {
        console.error('SSRF-Protected Request Failed:', error.message);
      }
      throw error;
    }
  }

  // Build secure request options
  buildSecureRequestOptions(userOptions) {
    const secureOptions = {
      timeout: this.config.requestTimeout,
      maxRedirects: this.config.maxRedirects,
      headers: {
        'User-Agent': 'SecureRequestBot/1.0',
        ...userOptions.headers
      }
    };
    
    // Remove potentially dangerous headers
    const dangerousHeaders = [
      'authorization',
      'x-forwarded-for',
      'x-real-ip',
      'x-forwarded-proto',
      'host'
    ];
    
    dangerousHeaders.forEach(header => {
      delete secureOptions.headers[header];
      delete secureOptions.headers[header.toLowerCase()];
    });
    
    return secureOptions;
  }

  // Utility methods
  isIPAddress(str) {
    return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(str);
  }

  isValidIPv4(ip) {
    const parts = ip.split('.');
    return parts.length === 4 && parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255 && part === num.toString();
    });
  }

  ipToNumber(ip) {
    return ip.split('.').reduce((acc, part) => (acc << 8) + parseInt(part, 10), 0) >>> 0;
  }

  isPrivateIP(ipNum) {
    return this.privateIPRanges.some(range => 
      ipNum >= range.start && ipNum <= range.end
    );
  }

  isLoopbackIP(ipNum) {
    return ipNum >= this.loopbackRange.start && ipNum <= this.loopbackRange.end;
  }

  isLinkLocalIP(ipNum) {
    return ipNum >= this.linkLocalRange.start && ipNum <= this.linkLocalRange.end;
  }

  isMulticastIP(ipNum) {
    return ipNum >= this.multicastRange.start && ipNum <= this.multicastRange.end;
  }

  getDefaultPort(protocol) {
    const defaultPorts = {
      'http': 80,
      'https': 443,
      'ftp': 21,
      'ssh': 22
    };
    return defaultPorts[protocol] || 80;
  }

  sanitizeURL(parsedUrl) {
    // Reconstruct URL with validated components
    return `${parsedUrl.protocol}://${parsedUrl.hostname}${parsedUrl.port ? ':' + parsedUrl.port : ''}${parsedUrl.pathname}${parsedUrl.search}`;
  }

  // Statistics and monitoring
  getStats() {
    return {
      ...this.stats,
      cacheStats: {
        dnsCache: this.dnsCache.size,
        rateLimitEntries: this.rateLimitMap.size
      }
    };
  }

  // Configuration management
  addBlockedDomain(domain) {
    this.config.blockedDomains.push(domain);
  }

  addAllowedDomain(domain) {
    this.config.allowedDomains.push(domain);
  }

  blockIP(ip) {
    this.blockedIPs.add(ip);
  }

  clearCaches() {
    this.dnsCache.clear();
    this.rateLimitMap.clear();
  }
}

// Custom SSRF Error class
class SSRFError extends Error {
  constructor(reason, details) {
    super(`SSRF Protection: ${reason}`);
    this.name = 'SSRFError';
    this.reason = reason;
    this.details = details;
  }
}

// Usage Examples
const ssrfProtection = new SSRFProtectionFramework({
  allowedDomains: ['api.example.com', 'cdn.example.com'],
  blockedDomains: ['malicious.com'],
  allowPrivateIPs: false,
  allowLoopback: false,
  maxRedirects: 2,
  requestTimeout: 5000
});

// Example 1: Validate a URL before making request
async function fetchExternalData(userProvidedUrl) {
  try {
    const validation = await ssrfProtection.validateRequest(userProvidedUrl);
    
    if (!validation.allowed) {
      throw new Error(`Request blocked: ${validation.reason}`);
    }
    
    // Make the request using validated URL
    const response = await ssrfProtection.makeSecureRequest(userProvidedUrl);
    return response.data;
    
  } catch (error) {
    console.error('SSRF protection prevented request:', error.message);
    throw error;
  }
}

// Example 2: Webhook URL validation
async function validateWebhookUrl(webhookUrl) {
  const result = await ssrfProtection.validateRequest(webhookUrl);
  
  if (!result.allowed) {
    return {
      valid: false,
      error: result.reason,
      details: result.details
    };
  }
  
  return { valid: true, sanitizedUrl: result.sanitizedUrl };
}

// Example 3: Image proxy validation
async function proxyImage(imageUrl) {
  // Validate the image URL
  const validation = await ssrfProtection.validateRequest(imageUrl);
  
  if (!validation.allowed) {
    throw new SSRFError(validation.reason, validation.details);
  }
  
  // Additional checks for image URLs
  if (!validation.sanitizedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    throw new SSRFError('Invalid image format', 'URL does not end with valid image extension');
  }
  
  return ssrfProtection.makeSecureRequest(validation.sanitizedUrl, {
    headers: { 'Accept': 'image/*' }
  });
}

// Example 4: Configuration for different environments
const productionSSRFConfig = new SSRFProtectionFramework({
  allowedDomains: [
    'api.company.com',
    'cdn.company.com',
    'partners.company.com'
  ],
  allowPrivateIPs: false,
  allowLoopback: false,
  blockCloudMetadata: true,
  enableRequestLogging: true,
  maxRedirects: 1,
  requestTimeout: 3000
});

const developmentSSRFConfig = new SSRFProtectionFramework({
  allowPrivateIPs: true,
  allowLoopback: true,
  blockCloudMetadata: false,
  enableRequestLogging: true,
  maxRedirects: 3,
  requestTimeout: 10000
});

// Monitoring SSRF attempts
setInterval(() => {
  const stats = ssrfProtection.getStats();
  if (stats.ssrfAttemptsDetected > 0) {
    console.warn('SSRF attempts detected:', stats);
    // Send alerts, update security monitoring, etc.
  }
}, 60000);

export { SSRFProtectionFramework, SSRFError };
```

### Understanding the SSRF Protection Framework Code

Let's break down how this comprehensive SSRF protection system works and why each security layer is critical for preventing server-side request forgery attacks.

#### 1. Framework Architecture and Defense Strategy

**The Multi-Layer Defense Philosophy:**
The `SSRFProtectionFramework` implements a defense-in-depth approach with multiple validation layers that each address different aspects of SSRF attacks.

**Core Protection Layers:**

**Layer 1: URL Structure Validation**
```javascript
parseURL(url) {
  // Basic format validation
  if (typeof url !== 'string' || url.length === 0) {
    return { isValid: false, errors: ['Empty or invalid URL'] };
  }
  
  if (url.length > 2048) {
    return { isValid: false, errors: ['URL too long'] };
  }
}
```

**Why This Matters:**
- **Input Type Safety**: Ensures we're working with valid string input
- **Length Protection**: Prevents buffer overflow attempts and DoS attacks
- **Early Rejection**: Fails fast for obviously malicious input

**Layer 2: Protocol Restriction**
```javascript
validateProtocol(protocol) {
  if (!this.config.allowedProtocols.includes(protocol)) {
    return {
      allowed: false,
      reason: 'Protocol not allowed',
      details: `Protocol '${protocol}' is not in allowed list`
    };
  }
}
```

**Protocol Security Logic:**
- **Allowlist Approach**: Only permit specific protocols (usually HTTP/HTTPS)
- **Attack Prevention**: Blocks dangerous protocols like `file://`, `ftp://`, `gopher://`
- **Bypass Prevention**: Stops protocol-based SSRF bypass attempts

#### 2. IP Address and Network Security

**The Critical IP Validation System:**

**Private Network Protection:**
```javascript
isPrivateIP(ipNum) {
  return this.privateIPRanges.some(range => 
    ipNum >= range.start && ipNum <= range.end
  );
}
```

**IP Range Analysis:**
- **10.0.0.0/8**: Private corporate networks (16.7 million addresses)
- **172.16.0.0/12**: Private medium networks (1 million addresses)  
- **192.168.0.0/16**: Private small networks (65,536 addresses)

**Why These Ranges Matter:**
- **Internal Services**: These IPs often host databases, admin panels, APIs
- **No Internet Routing**: These addresses aren't routable on the public internet
- **Trust Assumptions**: Internal services often trust requests from these ranges

**Cloud Metadata Protection:**
```javascript
// Check cloud metadata endpoints
if (this.config.blockCloudMetadata && 
    this.config.cloudMetadataEndpoints.includes(ip)) {
  this.stats.cloudMetadataBlocked++;
  return {
    allowed: false,
    reason: 'Cloud metadata endpoint blocked',
    details: `IP '${ip}' is a cloud metadata service endpoint`
  };
}
```

**Critical Cloud Endpoints:**
- **169.254.169.254**: AWS, Google Cloud metadata service
- **169.254.169.253**: AWS IMDSv2 endpoint
- **100.64.0.200**: Oracle Cloud metadata
- **192.0.0.192**: DigitalOcean metadata

**What Attackers Can Get:**
- Instance credentials and API keys
- Environment variables and configuration
- Network information and security groups
- Service account tokens

#### 3. DNS Resolution Security

**The DNS Security Challenge:**
Attackers can use DNS to bypass IP-based restrictions through various techniques.

**DNS Resolution with Security:**
```javascript
async validateAddress(hostname) {
  // Resolve hostname to IP address
  let resolvedIPs = [];
  try {
    if (this.config.enableDNSResolution) {
      resolvedIPs = await this.resolveDNS(hostname);
    }
  } catch (error) {
    return {
      allowed: false,
      reason: 'DNS resolution failed',
      details: error.message
    };
  }
  
  // Validate each resolved IP
  for (const ip of resolvedIPs) {
    const ipCheck = this.validateIP(ip);
    if (!ipCheck.allowed) {
      return ipCheck;
    }
  }
}
```

**DNS Security Techniques:**

**DNS Caching:**
```javascript
async resolveDNS(hostname) {
  // Check cache first
  if (this.dnsCache.has(hostname)) {
    const cached = this.dnsCache.get(hostname);
    if (Date.now() - cached.timestamp < 300000) { // 5 minute cache
      return cached.ips;
    }
  }
  
  // Cache result for performance and consistency
  this.dnsCache.set(hostname, {
    ips,
    timestamp: Date.now()
  });
}
```

**Why DNS Caching Helps:**
- **Consistency**: Same hostname always resolves to same IPs during cache period
- **Performance**: Avoid repeated DNS lookups
- **Attack Mitigation**: Prevents DNS rebinding attacks that rely on rapid DNS changes

#### 4. Advanced Bypass Prevention

**URL Encoding Bypass Detection:**
```javascript
performSecurityChecks(parsedUrl, options) {
  // Check for URL encoding bypasses
  const decodedPath = decodeURIComponent(parsedUrl.pathname);
  if (decodedPath !== parsedUrl.pathname) {
    // Look for suspicious patterns in decoded path
    const suspiciousPatterns = [
      /127\.0\.0\.1/g,    // localhost
      /192\.168\./g,      // Private IP
      /10\./g,           // Private IP
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(decodedPath)) {
        return {
          allowed: false,
          reason: 'URL encoding bypass detected',
          details: 'Suspicious pattern found in decoded URL path'
        };
      }
    }
  }
}
```

**Common Bypass Techniques:**
- **URL Encoding**: `127.0.0.1` → `%31%32%37%2e%30%2e%30%2e%31`
- **Decimal Notation**: `127.0.0.1` → `2130706433`
- **Octal Notation**: `127.0.0.1` → `0177.0.0.1`
- **Hexadecimal**: `127.0.0.1` → `0x7f.0.0.1`

#### 5. Rate Limiting and Abuse Prevention

**Request Rate Limiting:**
```javascript
checkRateLimit(hostname) {
  const now = Date.now();
  const windowSize = 60000; // 1 minute
  const maxRequests = 100; // Max requests per window
  
  if (!this.rateLimitMap.has(hostname)) {
    this.rateLimitMap.set(hostname, {
      requests: 1,
      windowStart: now
    });
    return { allowed: true };
  }
  
  const rateData = this.rateLimitMap.get(hostname);
  
  if (now - rateData.windowStart > windowSize) {
    // Reset window
    rateData.requests = 1;
    rateData.windowStart = now;
    return { allowed: true };
  }
  
  if (rateData.requests >= maxRequests) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded',
      details: `Too many requests to ${hostname}`
    };
  }
  
  rateData.requests++;
  return { allowed: true };
}
```

**Rate Limiting Benefits:**
- **DoS Prevention**: Stop attackers from overwhelming internal services
- **Resource Protection**: Limit impact on your server's resources
- **Attack Detection**: Identify suspicious activity patterns

#### 6. Secure Request Execution

**The Secure Request Wrapper:**
```javascript
async makeSecureRequest(url, options = {}) {
  const validation = await this.validateRequest(url, options);
  
  if (!validation.allowed) {
    throw new SSRFError(validation.reason, validation.details);
  }
  
  const secureOptions = {
    ...validation.requestOptions,
    timeout: this.config.requestTimeout,
    maxRedirects: this.config.maxRedirects,
    followRedirect: this.config.followRedirects
  };
  
  // Log request if enabled
  if (this.config.enableRequestLogging) {
    console.log(`SSRF-Protected Request: ${validation.sanitizedUrl}`);
  }
  
  try {
    const response = await this.httpClient(validation.sanitizedUrl, secureOptions);
    return response;
  } catch (error) {
    if (this.config.enableRequestLogging) {
      console.error('SSRF-Protected Request Failed:', error.message);
    }
    throw error;
  }
}
```

**Security Features:**
- **Validation First**: Never make requests without validation
- **Timeout Protection**: Prevent hanging requests
- **Redirect Limits**: Control redirect chains
- **Request Logging**: Monitor all outbound requests
- **Error Handling**: Graceful failure with logging

#### 7. Real-World Implementation Examples

**Example 1: URL Fetching Feature**
```javascript
// Before: Vulnerable implementation
app.post('/fetch-url', async (req, res) => {
  const url = req.body.url;
  const response = await fetch(url); // DANGEROUS!
  res.send(await response.text());
});

// After: Secure implementation
app.post('/fetch-url', async (req, res) => {
  try {
    const url = req.body.url;
    const validation = await ssrfProtection.validateRequest(url);
    
    if (!validation.allowed) {
      return res.status(400).json({
        error: 'URL not allowed',
        reason: validation.reason
      });
    }
    
    const response = await ssrfProtection.makeSecureRequest(url);
    res.send(response.data);
    
  } catch (error) {
    res.status(500).json({
      error: 'Request failed',
      message: error.message
    });
  }
});
```

**Security Improvements:**
- **Validation Gate**: All URLs must pass security checks
- **Error Handling**: Graceful failure instead of crashes
- **Attack Logging**: Failed attempts are recorded
- **User Feedback**: Clear error messages for legitimate failures

**Example 2: Webhook URL Validation**
```javascript
async function validateWebhookUrl(webhookUrl) {
  const result = await ssrfProtection.validateRequest(webhookUrl);
  
  if (!result.allowed) {
    return {
      valid: false,
      error: result.reason,
      details: result.details
    };
  }
  
  // Additional webhook-specific validation
  if (!webhookUrl.startsWith('https://')) {
    return {
      valid: false,
      error: 'Webhook URLs must use HTTPS',
      details: 'Only secure HTTPS webhooks are allowed'
    };
  }
  
  return { valid: true, sanitizedUrl: result.sanitizedUrl };
}
```

**Webhook Security Features:**
- **HTTPS Enforcement**: Ensure encrypted communication
- **URL Validation**: Apply SSRF protection to webhook URLs
- **User Guidance**: Clear validation error messages

#### 8. Security Monitoring and Alerting

**Attack Detection and Statistics:**
```javascript
getStats() {
  return {
    ...this.stats,
    cacheStats: {
      dnsCache: this.dnsCache.size,
      rateLimitEntries: this.rateLimitMap.size
    }
  };
}
```

**Key Metrics to Monitor:**
- **SSRF Attempts**: How many attacks were blocked
- **Cloud Metadata Blocks**: Attempts to access cloud credentials  
- **Private IP Blocks**: Internal network access attempts
- **Rate Limit Triggers**: Potential DoS or scanning attempts

**Example Security Monitoring:**
```javascript
setInterval(() => {
  const stats = ssrfProtection.getStats();
  if (stats.ssrfAttemptsDetected > 0) {
    console.warn('SSRF attempts detected:', stats);
    // Send alert to security team
    // Log to SIEM system
    // Update firewall rules if needed
  }
}, 60000);
```

This comprehensive SSRF protection framework provides enterprise-grade defense against Server-Side Request Forgery attacks through sophisticated URL validation, IP address filtering, DNS resolution security, and comprehensive request monitoring for modern web applications.

## Summary

Server-Side Request Forgery (SSRF) represents a critical security vulnerability that exploits server-side request functionality to access internal systems, cloud infrastructure, and sensitive resources that should remain protected. By implementing comprehensive SSRF protection through URL validation, IP filtering, DNS security controls, and network segmentation, applications can defend against sophisticated attacks while maintaining legitimate external service integration capabilities.

**SSRF Protection Excellence Benefits:**
- **Infrastructure Security**: Protect internal networks, cloud metadata services, and administrative interfaces from unauthorized access through server-side request manipulation
- **Data Loss Prevention**: Prevent attackers from accessing sensitive configuration files, credentials, and internal system information through SSRF exploitation
- **Network Segmentation**: Enforce network security boundaries and prevent lateral movement within infrastructure through compromised web applications
- **Compliance Assurance**: Meet security standards and regulatory requirements through comprehensive request validation and security monitoring

**Advanced SSRF Defense Capabilities:**
- **Intelligent Validation**: Detect and prevent sophisticated SSRF bypass techniques including URL encoding, DNS rebinding, and redirect chain exploitation
- **Cloud Security Integration**: Protect cloud infrastructure by blocking access to metadata services and container orchestration APIs
- **Real-Time Monitoring**: Track and analyze SSRF attempts for threat intelligence and security incident response
- **Zero-Trust Architecture**: Implement defense-in-depth strategies that assume network compromise and validate all server-side requests

**Security Architecture Patterns:**
- **Allowlist-Based Validation**: Implement strict allowlists for domains, IP addresses, and network resources to minimize attack surface
- **DNS Security Controls**: Validate DNS resolution results and implement DNS-based security policies for external resource access
- **Request Sanitization**: Clean and validate all aspects of server-side HTTP requests including URLs, headers, and parameters
- **Network Isolation**: Separate external-facing applications from internal services through proper network segmentation and access controls

SSRF protection transforms vulnerable applications into secure systems that can safely interact with external services while maintaining strict security boundaries and preventing unauthorized access to internal infrastructure and sensitive resources.


*Effective SSRF protection doesn't just block malicious requests—it creates a security framework that enables safe external integrations while maintaining complete control over what internal resources can be accessed through server-side functionality.*
