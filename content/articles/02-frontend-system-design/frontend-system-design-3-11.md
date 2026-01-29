---
title: "Feature Policy | Permissions-Policy"
description: "Explore Feature Policy and Permissions-Policy for enhanced web security. Learn to control browser feature access, implement granular permission management, and build secure, policy-driven web applications."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-03-21"
datePublished: "2026-03-21"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048333/Portfolio/FrontendSystemDesignCourse/titleImages/21_pienpj.png)

Feature Policy | Permissions-Policy – Controlling Browser Capabilities for Enhanced Security
-----------------------------------------------------------------------------------------------

Imagine having the ability to precisely control which browser features your web application can access—blocking camera access on pages that don't need it, preventing autoplay videos from consuming bandwidth, or ensuring that third-party iframes cannot access sensitive APIs. This level of granular control is exactly what Feature Policy (now evolved into Permissions-Policy) provides: a powerful mechanism to define and enforce security boundaries for web applications.

**Feature Policy and Permissions-Policy** represent advanced browser security mechanisms that allow web developers to explicitly control which browser features and APIs can be used by their applications and any embedded content. These policies act as a security contract between your application and the browser, defining what capabilities are allowed, what's blocked, and under what conditions features can be accessed.

In modern web applications where third-party content, advertising networks, and social media embeds create complex security boundaries, implementing comprehensive permission policies becomes critical for maintaining security, privacy, and performance. These policies not only protect users from malicious content but also help applications comply with privacy regulations and optimize resource usage.

In this comprehensive guide, we'll explore Feature Policy and Permissions-Policy implementation, from understanding browser capability control and policy syntax to building comprehensive permission management systems that secure web applications while maintaining functionality and user experience.

## Understanding Feature Policy Architecture

Feature Policy provides a framework for controlling browser features at both the document level and within embedded content, creating layered security boundaries that protect users and applications.

### The Theoretical Foundation of Browser Feature Control

**What Are Browser Features and Why Control Them?**
Modern browsers expose hundreds of APIs and features—from camera and microphone access to geolocation, payment APIs, and experimental features. While these capabilities enable rich user experiences, they also create privacy and security risks when misused or accessed by malicious content.

**The Security Problem:**
Without feature controls, any script on your page (including third-party content) can potentially:
- Access sensitive APIs like camera, microphone, or geolocation
- Consume device resources through features like vibration or screen wake locks
- Create unwanted user experiences through autoplay media or fullscreen takeovers
- Exploit experimental or deprecated APIs that may have security vulnerabilities

**How Feature Policy Solves This:**
Feature Policy acts as a declarative security mechanism that:
1. **Explicitly Allows**: Only specified features are available
2. **Granular Control**: Different policies for different origins
3. **Inheritance Rules**: Child frames inherit and can further restrict policies
4. **Default Blocking**: Unknown or unspecified features are blocked

### Feature Policy vs Permissions-Policy Evolution

**Feature Policy (Legacy):**
```http
Feature-Policy: camera 'self'; microphone 'none'; geolocation 'self' https://maps.example.com
```

**Permissions-Policy (Current):**
```http
Permissions-Policy: camera=(self), microphone=(), geolocation=(self "https://maps.example.com")
```

**Why the Evolution?**
- **Clearer Syntax**: More readable and less ambiguous
- **Better Standards**: W3C standardization and broader browser support
- **Enhanced Control**: More granular permission management
- **Future-Proof**: Designed to handle new browser features

### Permission Policy Categories

```
🛡️ Browser Feature Categories

📷 Privacy-Sensitive Features
   • camera - Camera access
   • microphone - Microphone access
   • geolocation - Location data
   • ambient-light-sensor - Light sensor data
   • accelerometer - Motion sensor data

📱 Device Features
   • usb - USB device access
   • bluetooth - Bluetooth connectivity
   • serial - Serial port access
   • hid - Human Interface Device access
   • payment - Payment Request API

🎵 Media and Presentation
   • autoplay - Media autoplay
   • fullscreen - Fullscreen mode
   • picture-in-picture - PiP mode
   • screen-wake-lock - Prevent screen sleep
   • vibrate - Device vibration

🔧 Performance and Resource
   • execution-while-out-of-viewport - Background execution
   • execution-while-not-rendered - Hidden execution
   • cross-origin-isolated - Cross-origin isolation
   • shared-array-buffer - SharedArrayBuffer access

🌐 Network and Communication
   • clipboard-read - Clipboard reading
   • clipboard-write - Clipboard writing
   • web-share - Web Share API
   • interest-cohort - FLoC cohort calculation
```

## Advanced Permissions-Policy Implementation

Building comprehensive permission management requires understanding policy syntax, inheritance rules, and integration with both server-side headers and client-side meta tags.

### Enterprise-Grade Permissions Policy Framework

```javascript
/**
 * Advanced Permissions Policy Management System
 * Comprehensive framework for controlling browser features and capabilities
 */

class PermissionsPolicyManager {
  constructor(config = {}) {
    this.config = {
      // Policy enforcement mode
      enforcementMode: config.enforcementMode || 'strict', // 'strict', 'report', 'permissive'
      
      // Default policy settings
      defaultPolicy: config.defaultPolicy || 'restrictive', // 'restrictive', 'permissive', 'custom'
      
      // Feature classifications
      sensitiveFeatures: config.sensitiveFeatures || [
        'camera', 'microphone', 'geolocation', 'payment', 'usb', 'bluetooth'
      ],
      
      performanceFeatures: config.performanceFeatures || [
        'autoplay', 'execution-while-out-of-viewport', 'screen-wake-lock'
      ],
      
      // Origin management
      trustedOrigins: config.trustedOrigins || [],
      blockedOrigins: config.blockedOrigins || [],
      
      // Dynamic policy updates
      enableDynamicPolicies: config.enableDynamicPolicies || false,
      policyUpdateInterval: config.policyUpdateInterval || 300000, // 5 minutes
      
      // Monitoring and reporting
      enableReporting: config.enableReporting !== false,
      reportingEndpoint: config.reportingEndpoint || '/api/policy-violations',
      enableMetrics: config.enableMetrics !== false,
      
      ...config
    };

    // Internal state
    this.activePolicies = new Map();
    this.policyViolations = [];
    this.featureUsageStats = new Map();
    this.originTrustLevels = new Map();
    
    // Policy templates
    this.policyTemplates = this.initializePolicyTemplates();
    this.featureDefinitions = this.initializeFeatureDefinitions();
    
    // Statistics
    this.stats = {
      policiesGenerated: 0,
      violationsReported: 0,
      featuresBlocked: 0,
      dynamicUpdates: 0
    };

    this.initialize();
  }

  // Initialize policy templates for different security levels
  initializePolicyTemplates() {
    return {
      // High security - block most features
      restrictive: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        usb: [],
        bluetooth: [],
        autoplay: ['self'],
        fullscreen: ['self'],
        'picture-in-picture': [],
        vibrate: [],
        'clipboard-read': [],
        'clipboard-write': ['self'],
        'web-share': ['self']
      },
      
      // Medium security - allow self, block third-party
      balanced: {
        camera: ['self'],
        microphone: ['self'],
        geolocation: ['self'],
        payment: ['self'],
        usb: [],
        bluetooth: [],
        autoplay: ['self'],
        fullscreen: ['self'],
        'picture-in-picture': ['self'],
        vibrate: ['self'],
        'clipboard-read': ['self'],
        'clipboard-write': ['self'],
        'web-share': ['self']
      },
      
      // Standard security - reasonable defaults
      standard: {
        camera: ['self'],
        microphone: ['self'],
        geolocation: ['self'],
        payment: ['self'],
        usb: [],
        bluetooth: [],
        autoplay: ['self'],
        fullscreen: ['self', 'https://video.example.com'],
        'picture-in-picture': ['self'],
        vibrate: ['self'],
        'clipboard-read': ['self'],
        'clipboard-write': ['self'],
        'web-share': ['self']
      }
    };
  }

  // Initialize feature definitions with security implications
  initializeFeatureDefinitions() {
    return {
      // Privacy-sensitive features
      camera: {
        category: 'privacy',
        riskLevel: 'high',
        description: 'Access to camera for video capture',
        requiredPermissions: ['camera'],
        securityImplications: ['Privacy invasion', 'Unauthorized recording'],
        recommendedPolicy: []
      },
      
      microphone: {
        category: 'privacy',
        riskLevel: 'high',
        description: 'Access to microphone for audio capture',
        requiredPermissions: ['microphone'],
        securityImplications: ['Audio eavesdropping', 'Voice recording'],
        recommendedPolicy: []
      },
      
      geolocation: {
        category: 'privacy',
        riskLevel: 'high',
        description: 'Access to device location',
        requiredPermissions: ['geolocation'],
        securityImplications: ['Location tracking', 'Privacy violation'],
        recommendedPolicy: ['self']
      },
      
      // Device access features
      payment: {
        category: 'financial',
        riskLevel: 'critical',
        description: 'Payment Request API access',
        requiredPermissions: ['payment-handler'],
        securityImplications: ['Financial fraud', 'Payment hijacking'],
        recommendedPolicy: ['self']
      },
      
      usb: {
        category: 'device',
        riskLevel: 'high',
        description: 'USB device access',
        requiredPermissions: ['usb'],
        securityImplications: ['Hardware access', 'Device exploitation'],
        recommendedPolicy: []
      },
      
      // Media features
      autoplay: {
        category: 'media',
        riskLevel: 'medium',
        description: 'Autoplay media content',
        requiredPermissions: [],
        securityImplications: ['Bandwidth abuse', 'User experience disruption'],
        recommendedPolicy: ['self']
      },
      
      fullscreen: {
        category: 'presentation',
        riskLevel: 'medium',
        description: 'Enter fullscreen mode',
        requiredPermissions: [],
        securityImplications: ['UI spoofing', 'Phishing attacks'],
        recommendedPolicy: ['self']
      }
    };
  }

  // Main policy generation method
  generatePolicy(options = {}) {
    this.stats.policiesGenerated++;
    
    const policyOptions = {
      template: options.template || this.config.defaultPolicy,
      customFeatures: options.customFeatures || {},
      trustedOrigins: options.trustedOrigins || this.config.trustedOrigins,
      context: options.context || 'main-document',
      ...options
    };
    
    let basePolicy = this.getBasePolicy(policyOptions.template);
    
    // Apply custom feature overrides
    basePolicy = this.applyCustomFeatures(basePolicy, policyOptions.customFeatures);
    
    // Apply origin-specific rules
    basePolicy = this.applyOriginRules(basePolicy, policyOptions.trustedOrigins);
    
    // Apply context-specific rules
    basePolicy = this.applyContextRules(basePolicy, policyOptions.context);
    
    // Validate policy
    const validation = this.validatePolicy(basePolicy);
    if (!validation.valid) {
      throw new PolicyError('Invalid policy configuration', validation.errors);
    }
    
    return {
      policy: basePolicy,
      headerString: this.generateHeaderString(basePolicy),
      metaString: this.generateMetaString(basePolicy),
      violations: validation.warnings
    };
  }

  // Get base policy from template
  getBasePolicy(template) {
    if (typeof template === 'string') {
      return { ...this.policyTemplates[template] };
    } else if (typeof template === 'object') {
      return { ...template };
    }
    
    throw new PolicyError('Invalid policy template');
  }

  // Apply custom feature configurations
  applyCustomFeatures(basePolicy, customFeatures) {
    const policy = { ...basePolicy };
    
    for (const [feature, allowlist] of Object.entries(customFeatures)) {
      // Validate feature name
      if (!this.isValidFeature(feature)) {
        console.warn(`Unknown feature: ${feature}`);
        continue;
      }
      
      // Validate allowlist
      const validatedAllowlist = this.validateAllowlist(allowlist);
      policy[feature] = validatedAllowlist;
    }
    
    return policy;
  }

  // Apply origin-specific rules
  applyOriginRules(basePolicy, trustedOrigins) {
    const policy = { ...basePolicy };
    
    // Add trusted origins to appropriate features
    for (const feature in policy) {
      const featureInfo = this.featureDefinitions[feature];
      
      if (featureInfo && featureInfo.riskLevel === 'low') {
        // Low-risk features can include trusted origins
        const currentAllowlist = policy[feature] || [];
        policy[feature] = [...new Set([...currentAllowlist, ...trustedOrigins])];
      }
    }
    
    return policy;
  }

  // Apply context-specific rules
  applyContextRules(basePolicy, context) {
    const policy = { ...basePolicy };
    
    switch (context) {
      case 'iframe':
        // More restrictive for iframes
        for (const feature in policy) {
          const featureInfo = this.featureDefinitions[feature];
          if (featureInfo && featureInfo.riskLevel === 'high') {
            policy[feature] = []; // Block high-risk features in iframes
          }
        }
        break;
        
      case 'worker':
        // Service worker context
        const workerFeatures = ['camera', 'microphone', 'geolocation', 'payment'];
        workerFeatures.forEach(feature => {
          if (policy[feature]) {
            policy[feature] = []; // Block in workers
          }
        });
        break;
        
      case 'popup':
        // Popup window context
        policy.fullscreen = []; // Prevent fullscreen in popups
        policy.payment = []; // No payments in popups
        break;
    }
    
    return policy;
  }

  // Generate HTTP header string
  generateHeaderString(policy) {
    const headerParts = [];
    
    for (const [feature, allowlist] of Object.entries(policy)) {
      if (Array.isArray(allowlist)) {
        const formattedAllowlist = this.formatAllowlistForHeader(allowowlist);
        headerParts.push(`${feature}=(${formattedAllowlist})`);
      }
    }
    
    return headerParts.join(', ');
  }

  // Generate meta tag string
  generateMetaString(policy) {
    return this.generateHeaderString(policy);
  }

  // Format allowlist for header
  formatAllowlistForHeader(allowlist) {
    if (allowlist.length === 0) {
      return ''; // Empty allowlist = blocked
    }
    
    return allowlist.map(origin => {
      if (origin === 'self') {
        return 'self';
      } else if (origin === '*') {
        return '*';
      } else {
        return `"${origin}"`;
      }
    }).join(' ');
  }

  // Dynamic policy management
  createDynamicPolicy(features, options = {}) {
    if (!this.config.enableDynamicPolicies) {
      throw new PolicyError('Dynamic policies are disabled');
    }
    
    const policyId = this.generatePolicyId();
    const policy = this.generatePolicy({
      customFeatures: features,
      ...options
    });
    
    this.activePolicies.set(policyId, {
      policy: policy.policy,
      created: Date.now(),
      context: options.context,
      violations: []
    });
    
    this.stats.dynamicUpdates++;
    return { policyId, ...policy };
  }

  // Policy validation
  validatePolicy(policy) {
    const errors = [];
    const warnings = [];
    
    for (const [feature, allowlist] of Object.entries(policy)) {
      // Check if feature is known
      if (!this.featureDefinitions[feature]) {
        warnings.push(`Unknown feature: ${feature}`);
      }
      
      // Validate allowlist format
      if (!Array.isArray(allowlist)) {
        errors.push(`Invalid allowlist for ${feature}: must be array`);
        continue;
      }
      
      // Validate origins in allowlist
      for (const origin of allowlist) {
        if (!this.isValidOrigin(origin)) {
          errors.push(`Invalid origin in ${feature} allowlist: ${origin}`);
        }
      }
      
      // Security recommendations
      const featureInfo = this.featureDefinitions[feature];
      if (featureInfo && featureInfo.riskLevel === 'high' && allowlist.includes('*')) {
        warnings.push(`High-risk feature ${feature} allows all origins`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Feature usage monitoring
  trackFeatureUsage(feature, origin, allowed) {
    const key = `${feature}:${origin}`;
    
    if (!this.featureUsageStats.has(key)) {
      this.featureUsageStats.set(key, {
        requests: 0,
        allowed: 0,
        blocked: 0,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      });
    }
    
    const stats = this.featureUsageStats.get(key);
    stats.requests++;
    stats.lastSeen = Date.now();
    
    if (allowed) {
      stats.allowed++;
    } else {
      stats.blocked++;
      this.stats.featuresBlocked++;
    }
  }

  // Violation reporting
  reportViolation(violation) {
    if (!this.config.enableReporting) {
      return;
    }
    
    this.stats.violationsReported++;
    
    const violationReport = {
      id: this.generateViolationId(),
      timestamp: Date.now(),
      feature: violation.feature,
      origin: violation.origin,
      disposition: violation.disposition,
      policy: violation.policy,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.policyViolations.push(violationReport);
    
    // Send to reporting endpoint
    if (this.config.reportingEndpoint) {
      this.sendViolationReport(violationReport);
    }
    
    // Log locally
    console.warn('Permissions Policy Violation:', violationReport);
  }

  // Send violation report to server
  async sendViolationReport(report) {
    try {
      await fetch(this.config.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.error('Failed to send violation report:', error);
    }
  }

  // Security analysis
  analyzeSecurityPosture() {
    const analysis = {
      overallRisk: 'low',
      risks: [],
      recommendations: [],
      featureAnalysis: new Map()
    };
    
    // Analyze each active policy
    for (const [policyId, policyData] of this.activePolicies) {
      for (const [feature, allowlist] of Object.entries(policyData.policy)) {
        const featureInfo = this.featureDefinitions[feature];
        if (!featureInfo) continue;
        
        const featureRisk = this.assessFeatureRisk(feature, allowlist, featureInfo);
        analysis.featureAnalysis.set(feature, featureRisk);
        
        if (featureRisk.riskLevel === 'high') {
          analysis.overallRisk = 'high';
          analysis.risks.push(featureRisk.description);
        }
      }
    }
    
    // Generate recommendations
    analysis.recommendations = this.generateSecurityRecommendations(analysis);
    
    return analysis;
  }

  // Assess risk for individual features
  assessFeatureRisk(feature, allowlist, featureInfo) {
    let riskLevel = featureInfo.riskLevel;
    let riskFactors = [];
    
    // Increase risk for wildcard allowlists
    if (allowlist.includes('*')) {
      riskLevel = this.increaseRiskLevel(riskLevel);
      riskFactors.push('Allows all origins');
    }
    
    // Check for suspicious origins
    const suspiciousOrigins = allowlist.filter(origin => 
      this.isSuspiciousOrigin(origin)
    );
    
    if (suspiciousOrigins.length > 0) {
      riskLevel = this.increaseRiskLevel(riskLevel);
      riskFactors.push(`Suspicious origins: ${suspiciousOrigins.join(', ')}`);
    }
    
    return {
      feature,
      riskLevel,
      riskFactors,
      description: featureInfo.description,
      securityImplications: featureInfo.securityImplications
    };
  }

  // Policy optimization suggestions
  generateOptimizationSuggestions() {
    const suggestions = [];
    
    // Analyze feature usage vs policy
    for (const [featureOrigin, stats] of this.featureUsageStats) {
      const [feature] = featureOrigin.split(':');
      
      if (stats.blocked > stats.allowed * 0.9) {
        suggestions.push({
          type: 'unused_permission',
          feature,
          message: `Feature ${feature} is mostly blocked - consider removing from allowlist`,
          priority: 'low'
        });
      }
      
      if (stats.allowed > 1000 && stats.blocked === 0) {
        suggestions.push({
          type: 'overused_feature',
          feature,
          message: `Feature ${feature} heavily used - ensure proper security controls`,
          priority: 'medium'
        });
      }
    }
    
    return suggestions;
  }

  // Utility methods
  isValidFeature(feature) {
    return this.featureDefinitions.hasOwnProperty(feature);
  }

  isValidOrigin(origin) {
    if (origin === 'self' || origin === '*') {
      return true;
    }
    
    try {
      new URL(origin);
      return true;
    } catch {
      return false;
    }
  }

  validateAllowlist(allowlist) {
    if (!Array.isArray(allowlist)) {
      return [];
    }
    
    return allowlist.filter(origin => this.isValidOrigin(origin));
  }

  increaseRiskLevel(currentLevel) {
    const levels = ['low', 'medium', 'high', 'critical'];
    const currentIndex = levels.indexOf(currentLevel);
    const nextIndex = Math.min(currentIndex + 1, levels.length - 1);
    return levels[nextIndex];
  }

  isSuspiciousOrigin(origin) {
    // Check against known suspicious patterns
    const suspiciousPatterns = [
      /\.tk$/, /\.ml$/, /\.ga$/, // Free domains
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // Raw IPs
      /localhost/, /127\.0\.0\.1/ // Local addresses
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(origin));
  }

  generatePolicyId() {
    return 'policy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateViolationId() {
    return 'violation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateSecurityRecommendations(analysis) {
    const recommendations = [];
    
    // High-risk features recommendations
    for (const [feature, riskData] of analysis.featureAnalysis) {
      if (riskData.riskLevel === 'high' || riskData.riskLevel === 'critical') {
        recommendations.push({
          priority: 'high',
          category: 'feature_security',
          message: `Review ${feature} permissions - ${riskData.riskFactors.join(', ')}`
        });
      }
    }
    
    return recommendations;
  }

  initialize() {
    // Set up policy violation listener
    if (typeof window !== 'undefined' && this.config.enableReporting) {
      window.addEventListener('securitypolicyviolation', (event) => {
        if (event.violatedDirective.startsWith('permissions-policy')) {
          this.reportViolation({
            feature: event.violatedDirective.split(' ')[1],
            origin: event.sourceFile || event.documentURI,
            disposition: event.disposition,
            policy: event.violatedDirective
          });
        }
      });
    }
    
    // Start monitoring if enabled
    if (this.config.enableMetrics) {
      this.startMetricsCollection();
    }
  }

  startMetricsCollection() {
    setInterval(() => {
      this.collectMetrics();
    }, this.config.policyUpdateInterval);
  }

  collectMetrics() {
    // Collect and analyze metrics
    const metrics = {
      timestamp: Date.now(),
      activePolicies: this.activePolicies.size,
      recentViolations: this.policyViolations.filter(v => 
        Date.now() - v.timestamp < 3600000 // Last hour
      ).length,
      featureUsage: Object.fromEntries(this.featureUsageStats),
      stats: this.stats
    };
    
    // Send metrics to monitoring system
    this.sendMetrics(metrics);
  }

  async sendMetrics(metrics) {
    if (this.config.metricsEndpoint) {
      try {
        await fetch(this.config.metricsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metrics)
        });
      } catch (error) {
        console.error('Failed to send metrics:', error);
      }
    }
  }

  // Public API methods
  getPolicy(template = 'balanced', options = {}) {
    return this.generatePolicy({ template, ...options });
  }

  checkPermission(feature, origin) {
    // Check if feature is allowed for origin based on active policies
    for (const [policyId, policyData] of this.activePolicies) {
      const allowlist = policyData.policy[feature];
      if (allowlist) {
        const allowed = allowlist.includes('*') || 
                       allowlist.includes('self') || 
                       allowlist.includes(origin);
        
        this.trackFeatureUsage(feature, origin, allowed);
        return allowed;
      }
    }
    
    // Default deny
    this.trackFeatureUsage(feature, origin, false);
    return false;
  }

  updatePolicy(policyId, updates) {
    if (!this.activePolicies.has(policyId)) {
      throw new PolicyError('Policy not found');
    }
    
    const policyData = this.activePolicies.get(policyId);
    const updatedPolicy = { ...policyData.policy, ...updates };
    
    const validation = this.validatePolicy(updatedPolicy);
    if (!validation.valid) {
      throw new PolicyError('Invalid policy update', validation.errors);
    }
    
    policyData.policy = updatedPolicy;
    this.stats.dynamicUpdates++;
    
    return this.generateHeaderString(updatedPolicy);
  }

  getSecurityReport() {
    return {
      timestamp: Date.now(),
      stats: this.stats,
      securityAnalysis: this.analyzeSecurityPosture(),
      optimizationSuggestions: this.generateOptimizationSuggestions(),
      recentViolations: this.policyViolations.slice(-10),
      featureUsage: Object.fromEntries(this.featureUsageStats)
    };
  }
}

// Custom error class
class PolicyError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'PolicyError';
    this.details = details;
  }
}

// Usage Examples
const policyManager = new PermissionsPolicyManager({
  defaultPolicy: 'balanced',
  trustedOrigins: ['https://cdn.example.com', 'https://api.example.com'],
  enableReporting: true,
  reportingEndpoint: '/api/policy-violations'
});

// Example 1: Generate a restrictive policy
const restrictivePolicy = policyManager.getPolicy('restrictive');
console.log('Restrictive Policy Header:', restrictivePolicy.headerString);

// Example 2: Custom policy for media-heavy page
const mediaPolicy = policyManager.getPolicy('standard', {
  customFeatures: {
    autoplay: ['self', 'https://video.example.com'],
    fullscreen: ['self', 'https://video.example.com'],
    'picture-in-picture': ['self']
  }
});

// Example 3: Dynamic policy creation
const dynamicPolicy = policyManager.createDynamicPolicy({
  camera: ['self'],
  microphone: ['self'],
  geolocation: []
}, {
  context: 'video-call'
});

// Example 4: Check if feature is allowed
const cameraAllowed = policyManager.checkPermission('camera', 'https://video.example.com');
console.log('Camera allowed:', cameraAllowed);

// Example 5: Security monitoring
const securityReport = policyManager.getSecurityReport();
console.log('Security Report:', securityReport);

// Example 6: Express.js middleware
function permissionsPolicyMiddleware(req, res, next) {
  const policy = policyManager.getPolicy('standard', {
    customFeatures: req.policyOverrides || {}
  });
  
  res.setHeader('Permissions-Policy', policy.headerString);
  next();
}

// Example 7: HTML meta tag generation
function generatePolicyMetaTag() {
  const policy = policyManager.getPolicy('restrictive');
  return `<meta http-equiv="Permissions-Policy" content="${policy.metaString}">`;
}

export { PermissionsPolicyManager, PolicyError };
```

### Understanding the Permissions Policy Framework Code

Now let's dive deep into how this comprehensive permissions policy system works and why each component is essential for controlling browser features securely.

#### 1. Framework Architecture and Policy Management

**The Core Policy Philosophy:**
The `PermissionsPolicyManager` implements a template-based approach where different security levels (restrictive, balanced, standard) provide baseline configurations that can be customized for specific use cases.

**Template System Design:**
```javascript
initializePolicyTemplates() {
  return {
    restrictive: {
      camera: [],           // Block all camera access
      microphone: [],       // Block all microphone access
      geolocation: [],      // Block location access
      payment: [],          // Block payment APIs
    },
    balanced: {
      camera: ['self'],     // Allow only same-origin
      microphone: ['self'], // Allow only same-origin
      geolocation: ['self'], // Allow only same-origin
    }
  };
}
```

**Why Templates Matter:**
- **Consistency**: Standardized security levels across applications
- **Flexibility**: Base templates can be customized per use case
- **Maintainability**: Centralized policy management
- **Security Gradation**: Different levels for different risk tolerances

#### 2. Feature Risk Assessment System

**Feature Classification:**
```javascript
camera: {
  category: 'privacy',
  riskLevel: 'high',
  description: 'Access to camera for video capture',
  securityImplications: ['Privacy invasion', 'Unauthorized recording'],
  recommendedPolicy: []
}
```

**Risk Level Analysis:**
- **Critical**: Payment APIs, financial transactions
- **High**: Camera, microphone, geolocation, USB access
- **Medium**: Autoplay, fullscreen, clipboard access
- **Low**: Basic presentation features

**Security Implications Understanding:**
Each feature is analyzed for its potential security impact:
- **Privacy Features**: Can access personal data
- **Device Features**: Can interact with hardware
- **Financial Features**: Can process payments
- **Presentation Features**: Can affect user interface

#### 3. Dynamic Policy Generation

**Context-Aware Policy Creation:**
```javascript
applyContextRules(basePolicy, context) {
  const policy = { ...basePolicy };
  
  switch (context) {
    case 'iframe':
      // More restrictive for iframes
      for (const feature in policy) {
        const featureInfo = this.featureDefinitions[feature];
        if (featureInfo && featureInfo.riskLevel === 'high') {
          policy[feature] = []; // Block high-risk features in iframes
        }
      }
      break;
  }
  
  return policy;
}
```

**Context Types and Their Security Requirements:**
- **Main Document**: Full feature access as configured
- **iframe**: Restricted access to prevent embedded content abuse
- **Worker**: Limited feature set for background execution
- **Popup**: Minimal features to prevent malicious popups

#### 4. Origin Trust Management

**Trusted Origin Integration:**
```javascript
applyOriginRules(basePolicy, trustedOrigins) {
  const policy = { ...basePolicy };
  
  for (const feature in policy) {
    const featureInfo = this.featureDefinitions[feature];
    
    if (featureInfo && featureInfo.riskLevel === 'low') {
      const currentAllowlist = policy[feature] || [];
      policy[feature] = [...new Set([...currentAllowlist, ...trustedOrigins])];
    }
  }
  
  return policy;
}
```

**Trust Level Strategy:**
- **Low-Risk Features**: Can include trusted origins automatically
- **Medium-Risk Features**: Require explicit approval for trusted origins
- **High-Risk Features**: Never automatically include external origins
- **Critical Features**: Require manual configuration for each origin

#### 5. Policy Header Generation

**HTTP Header Format:**
```javascript
generateHeaderString(policy) {
  const headerParts = [];
  
  for (const [feature, allowlist] of Object.entries(policy)) {
    if (Array.isArray(allowlist)) {
      const formattedAllowlist = this.formatAllowlistForHeader(allowlist);
      headerParts.push(`${feature}=(${formattedAllowlist})`);
    }
  }
  
  return headerParts.join(', ');
}
```

**Header Format Examples:**
- `camera=()` - Block camera entirely
- `camera=(self)` - Allow camera for same origin only  
- `camera=(self "https://video.com")` - Allow for self and specific origin
- `camera=(*)` - Allow for all origins (not recommended for sensitive features)

#### 6. Violation Monitoring and Reporting

**Violation Detection System:**
```javascript
reportViolation(violation) {
  const violationReport = {
    id: this.generateViolationId(),
    timestamp: Date.now(),
    feature: violation.feature,
    origin: violation.origin,
    disposition: violation.disposition,
    policy: violation.policy,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  this.policyViolations.push(violationReport);
  
  if (this.config.reportingEndpoint) {
    this.sendViolationReport(violationReport);
  }
}
```

**What Violations Tell Us:**
- **Attack Attempts**: Malicious scripts trying to access blocked features
- **Policy Misconfigurations**: Legitimate code being blocked unexpectedly
- **Third-Party Issues**: External libraries requiring features you didn't expect
- **User Behavior**: Features users are trying to use but are blocked

#### 7. Security Analysis and Optimization

**Risk Assessment Algorithm:**
```javascript
assessFeatureRisk(feature, allowlist, featureInfo) {
  let riskLevel = featureInfo.riskLevel;
  let riskFactors = [];
  
  // Increase risk for wildcard allowlists
  if (allowlist.includes('*')) {
    riskLevel = this.increaseRiskLevel(riskLevel);
    riskFactors.push('Allows all origins');
  }
  
  // Check for suspicious origins
  const suspiciousOrigins = allowlist.filter(origin => 
    this.isSuspiciousOrigin(origin)
  );
  
  if (suspiciousOrigins.length > 0) {
    riskLevel = this.increaseRiskLevel(riskLevel);
    riskFactors.push(`Suspicious origins: ${suspiciousOrigins.join(', ')}`);
  }
  
  return { feature, riskLevel, riskFactors };
}
```

**Risk Factors Identified:**
- **Wildcard Permissions**: Using '*' increases risk
- **Suspicious Origins**: Free domains, IP addresses, localhost
- **Over-Permissive Policies**: Too many origins for sensitive features
- **Unused Permissions**: Features allowed but never used

#### 8. Real-World Implementation Patterns

**Express.js Middleware Example:**
```javascript
function permissionsPolicyMiddleware(req, res, next) {
  const policy = policyManager.getPolicy('standard', {
    customFeatures: req.policyOverrides || {}
  });
  
  res.setHeader('Permissions-Policy', policy.headerString);
  next();
}

// Usage
app.use(permissionsPolicyMiddleware);

// Custom policy for specific routes
app.get('/video-chat', (req, res, next) => {
  req.policyOverrides = {
    camera: ['self'],
    microphone: ['self'],
    autoplay: ['self']
  };
  next();
}, permissionsPolicyMiddleware, (req, res) => {
  res.render('video-chat');
});
```

**HTML Meta Tag Integration:**
```javascript
function generatePolicyMetaTag() {
  const policy = policyManager.getPolicy('restrictive');
  return `<meta http-equiv="Permissions-Policy" content="${policy.metaString}">`;
}

// In your template
const policyMetaTag = generatePolicyMetaTag();
// Outputs: <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()">
```

#### 9. Feature Usage Analytics

**Usage Tracking System:**
```javascript
trackFeatureUsage(feature, origin, allowed) {
  const key = `${feature}:${origin}`;
  
  if (!this.featureUsageStats.has(key)) {
    this.featureUsageStats.set(key, {
      requests: 0,
      allowed: 0,
      blocked: 0,
      firstSeen: Date.now(),
      lastSeen: Date.now()
    });
  }
  
  const stats = this.featureUsageStats.get(key);
  stats.requests++;
  stats.lastSeen = Date.now();
  
  if (allowed) {
    stats.allowed++;
  } else {
    stats.blocked++;
    this.stats.featuresBlocked++;
  }
}
```

**Analytics Benefits:**
- **Usage Patterns**: Which features are actually being used
- **Policy Effectiveness**: How often features are blocked vs allowed
- **Optimization Opportunities**: Unused permissions that can be removed
- **Attack Detection**: Unusual patterns that might indicate attacks

This comprehensive Permissions Policy framework provides enterprise-grade browser feature control through template-based policies, dynamic policy generation, comprehensive violation monitoring, and intelligent security analysis for modern web applications.

## Summary

Feature Policy and Permissions-Policy represent powerful browser security mechanisms that provide granular control over web application capabilities, enabling developers to create secure boundaries around sensitive features while maintaining functionality and user experience. By implementing comprehensive permission management through policy templates, dynamic configuration, and continuous monitoring, applications can protect users from privacy violations, reduce attack surfaces, and ensure compliance with security standards.

**Permissions Policy Excellence Benefits:**
- **Granular Control**: Precise control over which browser features can be accessed by your application and embedded content
- **Privacy Protection**: Block unauthorized access to sensitive APIs like camera, microphone, and geolocation
- **Attack Surface Reduction**: Prevent malicious content from exploiting browser features for attacks
- **Compliance Support**: Meet privacy regulations and security standards through documented feature controls

**Advanced Policy Management Capabilities:**
- **Template-Based Configuration**: Standardized security levels that can be customized for specific use cases
- **Dynamic Policy Generation**: Runtime policy creation based on context, user roles, and security requirements
- **Comprehensive Monitoring**: Track feature usage, policy violations, and security incidents for continuous improvement
- **Risk-Based Analysis**: Automated security assessment and optimization recommendations

**Security Architecture Patterns:**
- **Defense in Depth**: Multiple layers of feature control from document-level to iframe-specific policies
- **Context-Aware Security**: Different permission levels for different execution contexts (main document, iframe, worker)
- **Trust-Based Management**: Graduated permissions based on origin trustworthiness and feature risk levels
- **Continuous Monitoring**: Real-time violation detection and security posture analysis

Feature Policy and Permissions-Policy transform web applications from feature-rich but potentially vulnerable platforms into secure, policy-driven environments that provide users with precise control over their privacy and security while enabling rich, interactive experiences within defined boundaries.


*Effective permissions policies don't just block dangerous features—they create a framework where applications can leverage browser capabilities safely while maintaining explicit control over what features are accessible to which origins under what conditions.*
