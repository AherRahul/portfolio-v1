---
title: "Cross-Site Request Forgery (CSRF)"
description: "Master Cross-Site Request Forgery (CSRF) attack prevention. Learn about CSRF tokens, SameSite cookies, double-submit cookies, origin validation, and building comprehensive CSRF protection strategies for modern web applications."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-03-24"
datePublished: "2026-03-24"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048333/Portfolio/FrontendSystemDesignCourse/titleImages/24_mvhpfz.png)

Cross-Site Request Forgery (CSRF) – Defending Against Unauthorized State-Changing Actions
-------------------------------------------------------------------------------------------

Imagine being logged into your online banking account in one browser tab while visiting a seemingly innocent website in another tab. Unknown to you, that malicious website contains hidden code that automatically transfers $1000 from your account to the attacker's account—all without your knowledge or consent. This is the devastating potential of Cross-Site Request Forgery (CSRF) attacks, which exploit the trust that web applications place in authenticated users.

**Cross-Site Request Forgery (CSRF)** is a web security vulnerability that allows an attacker to induce users to perform actions on a web application where they're authenticated without their knowledge or consent. CSRF attacks work by exploiting the fact that browsers automatically include credentials (cookies, HTTP authentication) with requests, allowing attackers to forge requests that appear to come from legitimate, authenticated users.

In modern web applications where users remain logged in across multiple sessions, perform sensitive actions like financial transactions, and interact with various third-party content, CSRF protection becomes critical for maintaining user trust and security. A single successful CSRF attack can lead to unauthorized transactions, data modification, account takeovers, and complete compromise of user accounts.

In this comprehensive guide, we'll explore CSRF attack vectors and prevention strategies, from understanding how request forgery works to implementing robust CSRF protection through tokens, SameSite cookies, origin validation, and comprehensive defense-in-depth security architectures.

## Understanding Cross-Site Request Forgery Architecture

CSRF attacks exploit the automatic inclusion of credentials in cross-origin requests, turning legitimate user authentication against them by allowing attackers to perform unauthorized actions.

### The Theoretical Foundation of CSRF Attacks

**What Makes CSRF Possible?**
CSRF attacks succeed because of how web browsers handle authentication credentials. When a user is authenticated to a website, browsers automatically include authentication credentials (cookies, HTTP auth headers) with every request to that domain, regardless of where the request originates.

**The CSRF Attack Chain:**
1. **User Authentication**: User logs into legitimate website (e.g., bank.com)
2. **Session Establishment**: Server sets authentication cookie
3. **Malicious Content**: User visits attacker's website or malicious content
4. **Forged Request**: Attacker's content triggers request to bank.com
5. **Automatic Authentication**: Browser includes authentication cookie
6. **Unauthorized Action**: Server processes request as legitimate user action

**CSRF Attack Examples:**

**Example 1: Simple Form-Based Attack**
```html
<!-- Malicious website contains hidden form -->
<html>
<body onload="document.getElementById('csrf-form').submit();">
  <form id="csrf-form" action="https://bank.com/transfer" method="POST" style="display:none;">
    <input name="amount" value="1000">
    <input name="recipient" value="attacker-account">
  </form>
</body>
</html>
```

**Example 2: JavaScript-Based Attack**
```javascript
// Attacker's script automatically sends requests
fetch('https://bank.com/api/transfer', {
  method: 'POST',
  credentials: 'include', // Include cookies
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 1000,
    recipient: 'attacker-account'
  })
});
```

**Example 3: Image-Based GET Attack**
```html
<!-- Simple GET request via image tag -->
<img src="https://bank.com/delete-account?confirm=yes" style="display:none;">
```

**Why These Attacks Work:**
- **Automatic Credentials**: Browsers automatically include cookies
- **Cross-Origin Requests**: Attacks originate from different domains
- **User Trust**: Servers trust authenticated requests
- **No User Interaction**: Attacks happen without user awareness

### CSRF Attack Vectors and Vulnerabilities

```
🎯 Cross-Site Request Forgery Attack Surface

📋 Form-Based Attacks
   • Hidden form auto-submission
   • Malicious form fields and actions
   • POST request forgery via forms
   • Multi-step form manipulation

🖼️ Image and Media Attacks
   • GET request via image src attributes
   • Video and audio source manipulation
   • CSS background image requests
   • Favicon and resource loading attacks

🔗 Link and Navigation Attacks
   • Malicious link manipulation
   • JavaScript-based navigation
   • Meta refresh redirects
   • Frame and iframe source attacks

📡 AJAX and Fetch Attacks
   • XMLHttpRequest with credentials
   • Fetch API with credentials: 'include'
   • WebSocket connection hijacking
   • Server-Sent Events manipulation

🔒 Advanced Attack Techniques
   • CSRF token bypass attempts
   • SameSite cookie bypass
   • JSON CSRF via content-type confusion
   • File upload CSRF attacks
   • Multi-step attack sequences

💥 High-Impact CSRF Targets
   • Financial transactions and transfers
   • Account settings and password changes
   • User privilege and permission changes
   • Data deletion and modification
   • Administrative actions and configurations
```

## Advanced CSRF Prevention Implementation

Building comprehensive CSRF protection requires multiple layers of defense including token-based validation, cookie security, origin verification, and request validation mechanisms.

### Enterprise-Grade CSRF Protection Framework

```javascript
/**
 * Advanced Cross-Site Request Forgery (CSRF) Protection System
 * Comprehensive framework for preventing unauthorized cross-origin state changes
 */

class CSRFProtectionManager {
  constructor(config = {}) {
    this.config = {
      // Token management
      tokenSecret: config.tokenSecret || this.generateSecret(),
      tokenLength: config.tokenLength || 32,
      tokenExpiry: config.tokenExpiry || 3600000, // 1 hour
      enableTokenRotation: config.enableTokenRotation !== false,
      
      // Protection methods
      enableSyncTokens: config.enableSyncTokens !== false,
      enableDoubleSubmitCookies: config.enableDoubleSubmitCookies || false,
      enableOriginValidation: config.enableOriginValidation !== false,
      enableRefererValidation: config.enableRefererValidation || false,
      enableSameSiteCookies: config.enableSameSiteCookies !== false,
      
      // Cookie configuration
      cookieName: config.cookieName || '__csrf-token',
      cookieSecure: config.cookieSecure !== false,
      cookieHttpOnly: config.cookieHttpOnly !== false,
      cookieSameSite: config.cookieSameSite || 'Strict',
      cookieMaxAge: config.cookieMaxAge || 86400000, // 24 hours
      
      // Security settings
      strictMode: config.strictMode !== false,
      allowedOrigins: config.allowedOrigins || [],
      allowedReferers: config.allowedReferers || [],
      trustedUserAgents: config.trustedUserAgents || [],
      
      // Request validation
      validateContentType: config.validateContentType !== false,
      allowedMethods: config.allowedMethods || ['POST', 'PUT', 'DELETE', 'PATCH'],
      skipValidationRoutes: config.skipValidationRoutes || [],
      
      // Monitoring and logging
      enableViolationReporting: config.enableViolationReporting !== false,
      reportingEndpoint: config.reportingEndpoint || '/api/csrf-violations',
      enableRequestLogging: config.enableRequestLogging || false,
      
      // Performance optimization
      enableTokenCaching: config.enableTokenCaching !== false,
      cacheSize: config.cacheSize || 1000,
      cleanupInterval: config.cleanupInterval || 300000, // 5 minutes
      
      ...config
    };

    // Internal state
    this.tokenStore = new Map();
    this.violationLog = [];
    this.sessionTokens = new Map();
    
    // Statistics
    this.stats = {
      tokensGenerated: 0,
      tokensValidated: 0,
      requestsProtected: 0,
      attacksBlocked: 0,
      violationsReported: 0
    };

    this.initialize();
  }

  // Initialize CSRF protection system
  initialize() {
    // Set up token cleanup
    this.startTokenCleanup();
    
    // Initialize token store
    this.setupTokenStore();
    
    // Set up violation monitoring
    if (this.config.enableViolationReporting) {
      this.setupViolationReporting();
    }
  }

  // Generate cryptographically secure token
  generateToken(sessionId = null) {
    this.stats.tokensGenerated++;
    
    const crypto = require('crypto');
    const randomBytes = crypto.randomBytes(this.config.tokenLength);
    const token = randomBytes.toString('base64url');
    
    const tokenData = {
      token,
      sessionId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.config.tokenExpiry,
      used: false
    };
    
    // Store token
    if (this.config.enableTokenCaching) {
      this.tokenStore.set(token, tokenData);
    }
    
    // Associate with session if provided
    if (sessionId) {
      if (!this.sessionTokens.has(sessionId)) {
        this.sessionTokens.set(sessionId, new Set());
      }
      this.sessionTokens.get(sessionId).add(token);
    }
    
    return tokenData;
  }

  // Validate CSRF token
  async validateToken(token, sessionId = null) {
    this.stats.tokensValidated++;
    
    if (!token) {
      return {
        valid: false,
        reason: 'Missing CSRF token'
      };
    }
    
    // Retrieve token data
    const tokenData = this.tokenStore.get(token);
    if (!tokenData) {
      return {
        valid: false,
        reason: 'Invalid or unknown CSRF token'
      };
    }
    
    // Check expiration
    if (Date.now() > tokenData.expiresAt) {
      this.tokenStore.delete(token);
      return {
        valid: false,
        reason: 'Expired CSRF token'
      };
    }
    
    // Check if token was already used (for one-time tokens)
    if (this.config.strictMode && tokenData.used) {
      return {
        valid: false,
        reason: 'CSRF token already used'
      };
    }
    
    // Validate session association
    if (sessionId && tokenData.sessionId !== sessionId) {
      return {
        valid: false,
        reason: 'CSRF token session mismatch'
      };
    }
    
    // Mark token as used
    if (this.config.strictMode) {
      tokenData.used = true;
    }
    
    return {
      valid: true,
      tokenData
    };
  }

  // Main CSRF protection middleware
  async protectRequest(request, response, options = {}) {
    this.stats.requestsProtected++;
    
    const method = request.method.toUpperCase();
    const url = request.url || request.path;
    
    // Skip validation for safe methods and excluded routes
    if (!this.shouldValidateRequest(method, url)) {
      return { protected: true, skipped: true, reason: 'Method or route excluded' };
    }
    
    // Perform multiple validation layers
    const validations = [];
    
    // 1. Synchronizer Token validation
    if (this.config.enableSyncTokens) {
      validations.push(await this.validateSynchronizerToken(request, options));
    }
    
    // 2. Double Submit Cookie validation
    if (this.config.enableDoubleSubmitCookies) {
      validations.push(this.validateDoubleSubmitCookie(request));
    }
    
    // 3. Origin validation
    if (this.config.enableOriginValidation) {
      validations.push(this.validateOrigin(request));
    }
    
    // 4. Referer validation
    if (this.config.enableRefererValidation) {
      validations.push(this.validateReferer(request));
    }
    
    // 5. Content-Type validation
    if (this.config.validateContentType) {
      validations.push(this.validateContentType(request));
    }
    
    // Evaluate validation results
    const failedValidations = validations.filter(v => !v.valid);
    
    if (failedValidations.length > 0) {
      this.stats.attacksBlocked++;
      
      // Record violation
      const violation = {
        timestamp: Date.now(),
        method,
        url,
        origin: request.headers.origin,
        referer: request.headers.referer,
        userAgent: request.headers['user-agent'],
        failures: failedValidations,
        sessionId: options.sessionId
      };
      
      this.recordViolation(violation);
      
      return {
        protected: false,
        blocked: true,
        reason: 'CSRF protection failed',
        failures: failedValidations,
        violation
      };
    }
    
    return { protected: true, validations };
  }

  // Synchronizer Token Pattern validation
  async validateSynchronizerToken(request, options = {}) {
    const token = this.extractTokenFromRequest(request);
    const sessionId = options.sessionId;
    
    const validation = await this.validateToken(token, sessionId);
    
    return {
      method: 'synchronizer-token',
      valid: validation.valid,
      reason: validation.reason,
      details: validation.tokenData
    };
  }

  // Double Submit Cookie Pattern validation
  validateDoubleSubmitCookie(request) {
    const cookieToken = this.extractTokenFromCookie(request);
    const requestToken = this.extractTokenFromRequest(request);
    
    if (!cookieToken || !requestToken) {
      return {
        method: 'double-submit-cookie',
        valid: false,
        reason: 'Missing cookie or request token'
      };
    }
    
    const tokensMatch = this.secureCompare(cookieToken, requestToken);
    
    return {
      method: 'double-submit-cookie',
      valid: tokensMatch,
      reason: tokensMatch ? 'Tokens match' : 'Token mismatch'
    };
  }

  // Origin header validation
  validateOrigin(request) {
    const origin = request.headers.origin;
    const host = request.headers.host;
    
    if (!origin) {
      return {
        method: 'origin-validation',
        valid: false,
        reason: 'Missing Origin header'
      };
    }
    
    // Check if origin matches host
    try {
      const originUrl = new URL(origin);
      const expectedOrigin = `${request.protocol || 'https'}://${host}`;
      
      if (origin === expectedOrigin) {
        return {
          method: 'origin-validation',
          valid: true,
          reason: 'Origin matches host'
        };
      }
      
      // Check against allowed origins
      if (this.config.allowedOrigins.includes(origin)) {
        return {
          method: 'origin-validation',
          valid: true,
          reason: 'Origin in allowed list'
        };
      }
      
    } catch (error) {
      return {
        method: 'origin-validation',
        valid: false,
        reason: 'Invalid Origin header format'
      };
    }
    
    return {
      method: 'origin-validation',
      valid: false,
      reason: 'Origin not allowed'
    };
  }

  // Referer header validation
  validateReferer(request) {
    const referer = request.headers.referer;
    const host = request.headers.host;
    
    if (!referer) {
      return {
        method: 'referer-validation',
        valid: false,
        reason: 'Missing Referer header'
      };
    }
    
    try {
      const refererUrl = new URL(referer);
      
      // Check if referer hostname matches request hostname
      if (refererUrl.hostname === host) {
        return {
          method: 'referer-validation',
          valid: true,
          reason: 'Referer matches host'
        };
      }
      
      // Check against allowed referers
      if (this.config.allowedReferers.some(allowed => referer.startsWith(allowed))) {
        return {
          method: 'referer-validation',
          valid: true,
          reason: 'Referer in allowed list'
        };
      }
      
    } catch (error) {
      return {
        method: 'referer-validation',
        valid: false,
        reason: 'Invalid Referer header format'
      };
    }
    
    return {
      method: 'referer-validation',
      valid: false,
      reason: 'Referer not allowed'
    };
  }

  // Content-Type validation
  validateContentType(request) {
    const contentType = request.headers['content-type'];
    
    if (!contentType) {
      return {
        method: 'content-type-validation',
        valid: false,
        reason: 'Missing Content-Type header'
      };
    }
    
    // CSRF attacks often have trouble setting custom Content-Type headers
    const allowedTypes = [
      'application/json',
      'application/xml',
      'text/xml',
      'application/x-protobuf'
    ];
    
    const baseType = contentType.split(';')[0].toLowerCase();
    
    return {
      method: 'content-type-validation',
      valid: allowedTypes.includes(baseType),
      reason: allowedTypes.includes(baseType) ? 
        'Content-Type allowed' : 
        'Content-Type not secure against CSRF'
    };
  }

  // Token extraction utilities
  extractTokenFromRequest(request) {
    // Try multiple sources for token
    const sources = [
      request.headers['x-csrf-token'],
      request.headers['csrf-token'],
      request.body && request.body._csrf,
      request.body && request.body.csrf_token,
      request.query && request.query._csrf
    ];
    
    return sources.find(token => token && typeof token === 'string');
  }

  extractTokenFromCookie(request) {
    const cookies = this.parseCookies(request.headers.cookie || '');
    return cookies[this.config.cookieName];
  }

  parseCookies(cookieHeader) {
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  }

  // Security utilities
  secureCompare(a, b) {
    if (a.length !== b.length) return false;
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }

  generateSecret() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  // Request filtering
  shouldValidateRequest(method, url) {
    // Skip safe methods
    if (!this.config.allowedMethods.includes(method)) {
      return false;
    }
    
    // Skip excluded routes
    if (this.config.skipValidationRoutes.some(route => url.startsWith(route))) {
      return false;
    }
    
    return true;
  }

  // Token management
  setupTokenStore() {
    if (!this.config.enableTokenCaching) return;
    
    // Initialize with empty store
    this.tokenStore.clear();
  }

  startTokenCleanup() {
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, this.config.cleanupInterval);
  }

  cleanupExpiredTokens() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [token, tokenData] of this.tokenStore.entries()) {
      if (now > tokenData.expiresAt) {
        this.tokenStore.delete(token);
        cleaned++;
        
        // Remove from session tokens
        if (tokenData.sessionId && this.sessionTokens.has(tokenData.sessionId)) {
          this.sessionTokens.get(tokenData.sessionId).delete(token);
        }
      }
    }
    
    if (cleaned > 0) {
      console.log(`CSRF: Cleaned up ${cleaned} expired tokens`);
    }
  }

  invalidateSessionTokens(sessionId) {
    const sessionTokenSet = this.sessionTokens.get(sessionId);
    if (sessionTokenSet) {
      for (const token of sessionTokenSet) {
        this.tokenStore.delete(token);
      }
      this.sessionTokens.delete(sessionId);
    }
  }

  // Violation handling
  recordViolation(violation) {
    this.violationLog.push(violation);
    this.stats.violationsReported++;
    
    if (this.config.enableRequestLogging) {
      console.warn('CSRF Violation:', violation);
    }
    
    if (this.config.enableViolationReporting) {
      this.reportViolation(violation);
    }
  }

  async reportViolation(violation) {
    if (!this.config.reportingEndpoint) return;
    
    try {
      await fetch(this.config.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'csrf-violation',
          violation,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to report CSRF violation:', error);
    }
  }

  setupViolationReporting() {
    // Set up periodic violation analysis
    setInterval(() => {
      this.analyzeViolationPatterns();
    }, 300000); // Every 5 minutes
  }

  analyzeViolationPatterns() {
    const recentViolations = this.violationLog.filter(v => 
      Date.now() - v.timestamp < 3600000 // Last hour
    );
    
    if (recentViolations.length > 10) {
      console.warn(`High CSRF violation rate: ${recentViolations.length} in the last hour`);
      
      // Analyze common patterns
      const originCounts = {};
      const failureTypes = {};
      
      recentViolations.forEach(v => {
        if (v.origin) {
          originCounts[v.origin] = (originCounts[v.origin] || 0) + 1;
        }
        
        v.failures.forEach(f => {
          failureTypes[f.method] = (failureTypes[f.method] || 0) + 1;
        });
      });
      
      console.warn('Violation analysis:', { originCounts, failureTypes });
    }
  }

  // Express.js middleware factory
  createMiddleware(options = {}) {
    return async (req, res, next) => {
      try {
        // Add token generation method to request
        req.generateCSRFToken = (sessionId) => {
          const tokenData = this.generateToken(sessionId);
          
          // Set double-submit cookie if enabled
          if (this.config.enableDoubleSubmitCookies) {
            res.cookie(this.config.cookieName, tokenData.token, {
              httpOnly: this.config.cookieHttpOnly,
              secure: this.config.cookieSecure,
              sameSite: this.config.cookieSameSite,
              maxAge: this.config.cookieMaxAge
            });
          }
          
          return tokenData.token;
        };
        
        // Add token validation to request
        req.validateCSRFToken = (token, sessionId) => {
          return this.validateToken(token, sessionId);
        };
        
        // Perform protection check
        const protection = await this.protectRequest(req, res, options);
        
        if (protection.blocked) {
          return res.status(403).json({
            error: 'CSRF protection violation',
            reason: protection.reason,
            details: protection.failures
          });
        }
        
        next();
      } catch (error) {
        console.error('CSRF middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  }

  // Token generation helpers for templates
  generateTokenForForm(sessionId = null) {
    const tokenData = this.generateToken(sessionId);
    return `<input type="hidden" name="_csrf" value="${tokenData.token}">`;
  }

  generateTokenForMeta(sessionId = null) {
    const tokenData = this.generateToken(sessionId);
    return `<meta name="csrf-token" content="${tokenData.token}">`;
  }

  // Security analysis
  analyzeSecurityPosture() {
    const analysis = {
      protectionLevel: 'medium',
      enabledProtections: [],
      recommendations: [],
      riskFactors: []
    };
    
    // Analyze enabled protections
    if (this.config.enableSyncTokens) analysis.enabledProtections.push('Synchronizer Tokens');
    if (this.config.enableDoubleSubmitCookies) analysis.enabledProtections.push('Double Submit Cookies');
    if (this.config.enableOriginValidation) analysis.enabledProtections.push('Origin Validation');
    if (this.config.enableSameSiteCookies) analysis.enabledProtections.push('SameSite Cookies');
    
    // Determine protection level
    if (analysis.enabledProtections.length >= 3) {
      analysis.protectionLevel = 'high';
    } else if (analysis.enabledProtections.length >= 2) {
      analysis.protectionLevel = 'medium';
    } else {
      analysis.protectionLevel = 'low';
      analysis.recommendations.push('Enable additional CSRF protection methods');
    }
    
    // Check for risk factors
    if (!this.config.strictMode) {
      analysis.riskFactors.push('Strict mode disabled');
      analysis.recommendations.push('Enable strict mode for enhanced security');
    }
    
    if (this.config.cookieSameSite === 'None') {
      analysis.riskFactors.push('SameSite cookies set to None');
      analysis.recommendations.push('Use Strict or Lax SameSite cookie setting');
    }
    
    return analysis;
  }

  // Public API methods
  getStats() {
    return {
      ...this.stats,
      activeTokens: this.tokenStore.size,
      activeSessions: this.sessionTokens.size,
      recentViolations: this.violationLog.filter(v => 
        Date.now() - v.timestamp < 3600000
      ).length
    };
  }

  getSecurityReport() {
    return {
      timestamp: Date.now(),
      stats: this.getStats(),
      securityAnalysis: this.analyzeSecurityPosture(),
      recentViolations: this.violationLog.slice(-10),
      configuration: {
        enabledMethods: Object.keys(this.config).filter(key => 
          key.startsWith('enable') && this.config[key]
        ),
        strictMode: this.config.strictMode,
        cookieSettings: {
          sameSite: this.config.cookieSameSite,
          secure: this.config.cookieSecure,
          httpOnly: this.config.cookieHttpOnly
        }
      }
    };
  }

  // Cleanup
  destroy() {
    this.tokenStore.clear();
    this.sessionTokens.clear();
    this.violationLog = [];
  }
}

// Custom error class
class CSRFError extends Error {
  constructor(message, violation) {
    super(message);
    this.name = 'CSRFError';
    this.violation = violation;
  }
}

// Usage Examples
const csrfManager = new CSRFProtectionManager({
  enableSyncTokens: true,
  enableDoubleSubmitCookies: true,
  enableOriginValidation: true,
  enableSameSiteCookies: true,
  cookieSameSite: 'Strict',
  strictMode: true
});

// Example 1: Express.js middleware setup
const express = require('express');
const app = express();

// Use CSRF protection middleware
app.use(csrfManager.createMiddleware());

// Generate token for forms
app.get('/form', (req, res) => {
  const token = req.generateCSRFToken(req.session.id);
  res.render('form', { csrfToken: token });
});

// Example 2: Manual token generation for AJAX
app.get('/api/csrf-token', (req, res) => {
  const token = csrfManager.generateToken(req.session.id);
  res.json({ csrfToken: token.token });
});

// Example 3: Custom validation in routes
app.post('/sensitive-action', async (req, res) => {
  const protection = await csrfManager.protectRequest(req, res, {
    sessionId: req.session.id
  });
  
  if (protection.blocked) {
    return res.status(403).json({
      error: 'CSRF protection failed',
      reason: protection.reason
    });
  }
  
  // Proceed with sensitive action
  res.json({ success: true });
});

// Example 4: HTML form with CSRF protection
function generateProtectedForm(sessionId) {
  const csrfInput = csrfManager.generateTokenForForm(sessionId);
  
  return `
    <form method="POST" action="/transfer">
      ${csrfInput}
      <input name="amount" type="number" required>
      <input name="recipient" type="text" required>
      <button type="submit">Transfer</button>
    </form>
  `;
}

// Example 5: AJAX with CSRF token
function setupAjaxCSRF() {
  // Get CSRF token
  fetch('/api/csrf-token')
    .then(response => response.json())
    .then(data => {
      // Store token for use in requests
      window.csrfToken = data.csrfToken;
      
      // Set up axios defaults
      if (window.axios) {
        window.axios.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
      }
      
      // Set up jQuery AJAX defaults
      if (window.$) {
        $.ajaxSetup({
          beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRF-Token', window.csrfToken);
          }
        });
      }
    });
}

// Example 6: Security monitoring
setInterval(() => {
  const report = csrfManager.getSecurityReport();
  if (report.stats.recentViolations > 5) {
    console.warn('High CSRF violation rate detected:', report);
    // Send alert to security team
  }
}, 300000); // Every 5 minutes

export { CSRFProtectionManager, CSRFError };
```

### Understanding the CSRF Protection Framework Code

Let's explore how this comprehensive CSRF protection system works and why each defensive layer is critical for preventing cross-site request forgery attacks.

#### 1. Framework Architecture and Multi-Layer Defense

**The Core CSRF Protection Philosophy:**
The `CSRFProtectionManager` implements a defense-in-depth approach using multiple complementary protection mechanisms that work together to prevent CSRF attacks.

**Protection Layer Integration:**
```javascript
async protectRequest(request, response, options = {}) {
  const validations = [];
  
  // 1. Synchronizer Token validation
  if (this.config.enableSyncTokens) {
    validations.push(await this.validateSynchronizerToken(request, options));
  }
  
  // 2. Double Submit Cookie validation
  if (this.config.enableDoubleSubmitCookies) {
    validations.push(this.validateDoubleSubmitCookie(request));
  }
  
  // 3. Origin validation
  if (this.config.enableOriginValidation) {
    validations.push(this.validateOrigin(request));
  }
  
  // Multiple validation layers ensure robust protection
  const failedValidations = validations.filter(v => !v.valid);
  
  if (failedValidations.length > 0) {
    return { protected: false, blocked: true, failures: failedValidations };
  }
  
  return { protected: true, validations };
}
```

**Why Multi-Layer Defense Works:**
- **Redundancy**: Multiple protections provide backup if one fails
- **Attack Complexity**: Attackers must bypass multiple mechanisms
- **Context Adaptation**: Different protections work better in different scenarios
- **Evolution**: New attack techniques may bypass single protections

#### 2. Synchronizer Token Pattern

**Token Generation and Management:**
```javascript
generateToken(sessionId = null) {
  const crypto = require('crypto');
  const randomBytes = crypto.randomBytes(this.config.tokenLength);
  const token = randomBytes.toString('base64url');
  
  const tokenData = {
    token,
    sessionId,
    createdAt: Date.now(),
    expiresAt: Date.now() + this.config.tokenExpiry,
    used: false
  };
  
  // Store token for validation
  if (this.config.enableTokenCaching) {
    this.tokenStore.set(token, tokenData);
  }
  
  // Associate with session
  if (sessionId) {
    if (!this.sessionTokens.has(sessionId)) {
      this.sessionTokens.set(sessionId, new Set());
    }
    this.sessionTokens.get(sessionId).add(token);
  }
  
  return tokenData;
}
```

**Token Security Features:**
- **Cryptographic Randomness**: Uses crypto.randomBytes for unpredictability
- **Session Association**: Links tokens to specific user sessions
- **Expiration**: Tokens automatically expire to limit exposure
- **One-Time Use**: Optional single-use tokens for maximum security

#### 3. Double Submit Cookie Pattern

**Cookie-Based Validation:**
```javascript
validateDoubleSubmitCookie(request) {
  const cookieToken = this.extractTokenFromCookie(request);
  const requestToken = this.extractTokenFromRequest(request);
  
  if (!cookieToken || !requestToken) {
    return {
      method: 'double-submit-cookie',
      valid: false,
      reason: 'Missing cookie or request token'
    };
  }
  
  const tokensMatch = this.secureCompare(cookieToken, requestToken);
  
  return {
    method: 'double-submit-cookie',
    valid: tokensMatch,
    reason: tokensMatch ? 'Tokens match' : 'Token mismatch'
  };
}
```

**Why Double Submit Works:**
- **Same-Origin Requirement**: Attackers can't read cookies from other origins
- **Token Comparison**: Both cookie and request must contain same token
- **No Server State**: Doesn't require server-side token storage
- **SameSite Protection**: Modern browsers prevent cross-site cookie access

#### 4. Origin and Referer Validation

**Origin Header Validation:**
```javascript
validateOrigin(request) {
  const origin = request.headers.origin;
  const host = request.headers.host;
  
  if (!origin) {
    return { valid: false, reason: 'Missing Origin header' };
  }
  
  try {
    const originUrl = new URL(origin);
    const expectedOrigin = `${request.protocol || 'https'}://${host}`;
    
    if (origin === expectedOrigin) {
      return { valid: true, reason: 'Origin matches host' };
    }
    
    // Check against allowed origins
    if (this.config.allowedOrigins.includes(origin)) {
      return { valid: true, reason: 'Origin in allowed list' };
    }
  } catch (error) {
    return { valid: false, reason: 'Invalid Origin header format' };
  }
  
  return { valid: false, reason: 'Origin not allowed' };
}
```

**Header-Based Protection Benefits:**
- **Browser Enforcement**: Browsers automatically send these headers
- **Cross-Origin Detection**: Easy to identify requests from other domains
- **Simple Implementation**: No complex token management required
- **Attack Difficulty**: Attackers cannot easily spoof these headers

#### 5. Content-Type Validation

**CSRF-Resistant Content Types:**
```javascript
validateContentType(request) {
  const contentType = request.headers['content-type'];
  
  // CSRF attacks often have trouble setting custom Content-Type headers
  const allowedTypes = [
    'application/json',
    'application/xml',
    'text/xml',
    'application/x-protobuf'
  ];
  
  const baseType = contentType.split(';')[0].toLowerCase();
  
  return {
    method: 'content-type-validation',
    valid: allowedTypes.includes(baseType),
    reason: allowedTypes.includes(baseType) ? 
      'Content-Type allowed' : 
      'Content-Type not secure against CSRF'
  };
}
```

**Why Content-Type Validation Helps:**
- **CORS Preflight**: Custom content types trigger preflight requests
- **Attack Limitation**: Simple forms can't easily set custom content types
- **API Protection**: JSON APIs are naturally more protected
- **Defense Layer**: Additional barrier for sophisticated attacks

#### 6. Secure Token Comparison

**Timing Attack Prevention:**
```javascript
secureCompare(a, b) {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}
```

**Security Benefits:**
- **Constant Time**: Prevents timing attacks on token comparison
- **Side-Channel Resistance**: No early return based on character differences
- **Cryptographic Security**: Proper comparison for sensitive values
- **Attack Prevention**: Stops information leakage through timing

#### 7. Express.js Integration and Usage

**Middleware Integration:**
```javascript
createMiddleware(options = {}) {
  return async (req, res, next) => {
    // Add token generation method to request
    req.generateCSRFToken = (sessionId) => {
      const tokenData = this.generateToken(sessionId);
      
      // Set double-submit cookie if enabled
      if (this.config.enableDoubleSubmitCookies) {
        res.cookie(this.config.cookieName, tokenData.token, {
          httpOnly: this.config.cookieHttpOnly,
          secure: this.config.cookieSecure,
          sameSite: this.config.cookieSameSite,
          maxAge: this.config.cookieMaxAge
        });
      }
      
      return tokenData.token;
    };
    
    // Perform protection check
    const protection = await this.protectRequest(req, res, options);
    
    if (protection.blocked) {
      return res.status(403).json({
        error: 'CSRF protection violation',
        reason: protection.reason
      });
    }
    
    next();
  };
}
```

**Usage Examples:**
```javascript
// Basic setup
app.use(csrfManager.createMiddleware());

// Form rendering with token
app.get('/form', (req, res) => {
  const token = req.generateCSRFToken(req.session.id);
  res.render('form', { csrfToken: token });
});

// AJAX token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = csrfManager.generateToken(req.session.id);
  res.json({ csrfToken: token.token });
});
```

#### 8. Attack Detection and Monitoring

**Violation Analysis:**
```javascript
analyzeViolationPatterns() {
  const recentViolations = this.violationLog.filter(v => 
    Date.now() - v.timestamp < 3600000 // Last hour
  );
  
  if (recentViolations.length > 10) {
    console.warn(`High CSRF violation rate: ${recentViolations.length} in the last hour`);
    
    // Analyze common patterns
    const originCounts = {};
    const failureTypes = {};
    
    recentViolations.forEach(v => {
      if (v.origin) {
        originCounts[v.origin] = (originCounts[v.origin] || 0) + 1;
      }
      
      v.failures.forEach(f => {
        failureTypes[f.method] = (failureTypes[f.method] || 0) + 1;
      });
    });
    
    console.warn('Violation analysis:', { originCounts, failureTypes });
  }
}
```

**Attack Pattern Recognition:**
- **Volume Analysis**: Detect attack campaigns through violation rates
- **Origin Tracking**: Identify attacking domains and sources
- **Method Analysis**: Understand which protections are being bypassed
- **Temporal Patterns**: Recognize coordinated attack attempts

This comprehensive CSRF protection framework provides enterprise-grade defense against cross-site request forgery through multiple complementary protection mechanisms, intelligent token management, comprehensive attack detection, and seamless integration with modern web applications.

## Summary

Cross-Site Request Forgery (CSRF) represents a critical web security vulnerability that exploits the trust between users and web applications by forcing authenticated users to perform unintended actions. By implementing comprehensive CSRF protection through synchronizer tokens, double-submit cookies, origin validation, and sophisticated monitoring systems, applications can effectively prevent unauthorized state changes while maintaining usability and functionality.

**CSRF Protection Excellence Benefits:**
- **Unauthorized Action Prevention**: Block attackers from performing actions on behalf of authenticated users
- **Multi-Layer Defense**: Comprehensive protection through multiple complementary security mechanisms
- **Attack Detection**: Real-time monitoring and analysis of CSRF attack attempts for security intelligence
- **User Trust**: Maintain user confidence through robust protection of sensitive operations

**Advanced CSRF Defense Capabilities:**
- **Token-Based Protection**: Cryptographically secure tokens with session association and expiration management
- **Cookie Security**: SameSite cookie attributes and double-submit cookie patterns for enhanced protection
- **Header Validation**: Origin and Referer header verification to detect cross-origin attacks
- **Content-Type Security**: Protection against simple form-based attacks through content type validation

**Security Architecture Patterns:**
- **Defense in Depth**: Multiple protection layers that complement each other for robust security
- **Fail-Safe Design**: Security mechanisms that block requests when validation fails or is uncertain
- **Performance Optimization**: Efficient token management and validation with minimal performance impact
- **Integration Simplicity**: Seamless integration with existing web application frameworks and architectures

CSRF protection transforms web applications from vulnerable targets of cross-origin attacks into secure platforms that maintain strict control over state-changing operations while providing legitimate users with seamless, protected interactions.


*Effective CSRF protection doesn't just prevent unauthorized actions—it creates a trust framework where authenticated users can safely interact with applications while maintaining complete assurance that their authentication cannot be exploited by malicious third parties.*
