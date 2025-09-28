---
title: "Compliance & Regulation"
description: "Navigate compliance and regulatory requirements for modern web applications. Understand GDPR, CCPA, COPPA, accessibility compliance, data protection requirements, and implementing compliance-ready frontend architectures."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-03-17"
datePublished: "2025-03-17"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
  - frontend

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048331/Portfolio/FrontendSystemDesignCourse/titleImages/17_fds8iy.png)

Compliance & Regulation – Building Privacy-First Applications
------------------------------------------------------------------------------------

Imagine you're the CTO of a rapidly growing SaaS platform that serves users across multiple continents. Your application handles personal data from EU citizens, California residents, children under 13, and users with disabilities. One morning, you receive simultaneous notices: a €20 million GDPR fine for inadequate consent mechanisms, a CCPA violation complaint for failing to honor deletion requests, a COPPA investigation for collecting children's data without parental consent, and an ADA lawsuit for inaccessible web interfaces. What seemed like a successful global expansion has turned into a regulatory nightmare that threatens your company's existence.

This scenario illustrates the complex regulatory landscape that modern web applications must navigate. **Compliance and regulation** are no longer optional considerations - they're fundamental requirements that shape how we design, build, and operate digital services. From privacy laws like GDPR and CCPA to accessibility standards like WCAG, regulatory compliance affects every aspect of frontend development.

In this comprehensive guide, we'll explore the major regulatory frameworks affecting web applications and provide practical strategies for building compliance into your development processes from day one.

## Understanding the Regulatory Landscape

Modern web applications operate in a complex regulatory environment where multiple laws and standards may apply simultaneously. The key regulatory frameworks include:

### Privacy and Data Protection Laws

**GDPR (General Data Protection Regulation)** - EU
**CCPA (California Consumer Privacy Act)** - California, USA
**PIPEDA (Personal Information Protection and Electronic Documents Act)** - Canada
**LGPD (Lei Geral de Proteção de Dados)** - Brazil
**PDPA (Personal Data Protection Act)** - Singapore

### Accessibility Standards

**WCAG 2.1 (Web Content Accessibility Guidelines)**
**ADA (Americans with Disabilities Act)** - USA
**AODA (Accessibility for Ontarians with Disabilities Act)** - Canada
**EN 301 549** - European Accessibility Standard

### Sector-Specific Regulations

**HIPAA (Health Insurance Portability and Accountability Act)** - Healthcare
**FERPA (Family Educational Rights and Privacy Act)** - Education
**COPPA (Children's Online Privacy Protection Act)** - Children's services
**SOX (Sarbanes-Oxley Act)** - Financial reporting
**PCI DSS (Payment Card Industry Data Security Standard)** - Payment processing

## GDPR Compliance Implementation

The GDPR is often considered the gold standard for privacy regulations and serves as a model for many other privacy laws.

### 1. Consent Management System

```javascript
// Comprehensive GDPR consent management
class GDPRConsentManager {
  constructor() {
    this.consentCategories = {
      necessary: {
        name: 'Strictly Necessary',
        description: 'These cookies are essential for the website to function',
        required: true,
        cookies: ['session_id', 'csrf_token', 'auth_token']
      },
      functional: {
        name: 'Functional',
        description: 'These cookies enable enhanced functionality and personalization',
        required: false,
        cookies: ['language_preference', 'theme_preference', 'accessibility_settings']
      },
      analytics: {
        name: 'Analytics',
        description: 'These cookies help us understand how visitors interact with our website',
        required: false,
        cookies: ['_ga', '_gid', '_gat', 'analytics_session']
      },
      marketing: {
        name: 'Marketing',
        description: 'These cookies are used to track visitors and display relevant advertisements',
        required: false,
        cookies: ['_fbp', '_fbc', 'marketing_id', 'retargeting_pixel']
      }
    };
    
    this.consentStatus = null;
    this.consentTimestamp = null;
    this.consentVersion = '1.2.0';
    
    this.initializeConsent();
  }
  
  initializeConsent() {
    // Load existing consent if available
    const storedConsent = this.loadStoredConsent();
    
    if (this.isValidConsent(storedConsent)) {
      this.consentStatus = storedConsent.preferences;
      this.consentTimestamp = storedConsent.timestamp;
      this.applyConsentPreferences();
    } else {
      this.showConsentBanner();
    }
  }
  
  loadStoredConsent() {
    try {
      const consent = localStorage.getItem('gdpr_consent');
      return consent ? JSON.parse(consent) : null;
    } catch (error) {
      console.error('Failed to load consent data:', error);
      return null;
    }
  }
  
  isValidConsent(consent) {
    if (!consent) return false;
    
    // Check if consent is expired (13 months for GDPR)
    const consentAge = Date.now() - new Date(consent.timestamp).getTime();
    const maxAge = 13 * 30 * 24 * 60 * 60 * 1000; // 13 months
    
    if (consentAge > maxAge) {
      console.log('Consent expired, requesting new consent');
      return false;
    }
    
    // Check if consent version matches current version
    if (consent.version !== this.consentVersion) {
      console.log('Consent version outdated, requesting new consent');
      return false;
    }
    
    // Validate consent structure
    return consent.preferences && 
           typeof consent.preferences === 'object' &&
           consent.timestamp &&
           consent.version;
  }
  
  showConsentBanner() {
    const banner = this.createConsentBanner();
    document.body.appendChild(banner);
    
    // Track consent banner display
    this.trackEvent('consent_banner_shown', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      language: navigator.language
    });
  }
  
  createConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'gdpr-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.setAttribute('aria-describedby', 'consent-description');
    
    banner.innerHTML = \`
      <div class="consent-banner" style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #ffffff;
        border-top: 1px solid #ddd;
        padding: 20px;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        max-height: 70vh;
        overflow-y: auto;
      ">
        <div class="consent-content" style="max-width: 1200px; margin: 0 auto;">
          <h2 id="consent-title" style="margin: 0 0 15px 0; font-size: 1.2em; color: #333;">
            🍪 Cookie Preferences
          </h2>
          <p id="consent-description" style="margin: 0 0 20px 0; line-height: 1.5; color: #666;">
            We use cookies to enhance your browsing experience, serve personalized content, 
            and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
            You can customize your preferences or learn more in our 
            <a href="/privacy-policy" style="color: #007bff;">Privacy Policy</a>.
          </p>
          
          <div class="consent-categories" style="margin: 20px 0;">
            \${this.renderConsentCategories()}
          </div>
          
          <div class="consent-actions" style="
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 20px;
          ">
            <button id="consent-accept-all" class="consent-btn consent-btn-primary" style="
              padding: 12px 24px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">
              Accept All
            </button>
            <button id="consent-accept-selected" class="consent-btn consent-btn-secondary" style="
              padding: 12px 24px;
              background: #6c757d;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">
              Accept Selected
            </button>
            <button id="consent-reject-all" class="consent-btn consent-btn-outline" style="
              padding: 12px 24px;
              background: transparent;
              color: #6c757d;
              border: 1px solid #6c757d;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">
              Reject All
            </button>
            <button id="consent-manage" class="consent-btn consent-btn-link" style="
              padding: 12px 24px;
              background: transparent;
              color: #007bff;
              border: none;
              text-decoration: underline;
              cursor: pointer;
              font-size: 14px;
            ">
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
    \`;
    
    this.attachConsentEventListeners(banner);
    
    return banner;
  }
  
  renderConsentCategories() {
    return Object.entries(this.consentCategories)
      .map(([key, category]) => \`
        <div class="consent-category" style="
          display: flex;
          align-items: flex-start;
          margin: 15px 0;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
        ">
          <div style="flex: 1;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input 
                type="checkbox" 
                id="consent-\${key}" 
                name="consent-\${key}"
                \${category.required ? 'checked disabled' : ''}
                style="margin-right: 10px;"
              />
              <div>
                <strong style="display: block; margin-bottom: 5px;">\${category.name}</strong>
                <span style="font-size: 12px; color: #666; line-height: 1.4;">
                  \${category.description}
                </span>
                \${category.required ? '<br><em style="font-size: 11px; color: #999;">Always active</em>' : ''}
              </div>
            </label>
          </div>
          <button 
            class="category-info" 
            onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'"
            style="
              background: none;
              border: 1px solid #ccc;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              cursor: pointer;
              font-size: 12px;
            "
          >?</button>
          <div style="display: none; margin-top: 10px; font-size: 12px; color: #666;">
            <strong>Cookies used:</strong><br>
            \${category.cookies.join(', ')}
          </div>
        </div>
      \`).join('');
  }
  
  attachConsentEventListeners(banner) {
    // Accept all cookies
    banner.querySelector('#consent-accept-all').addEventListener('click', () => {
      const preferences = {};
      Object.keys(this.consentCategories).forEach(key => {
        preferences[key] = true;
      });
      this.saveConsent(preferences);
    });
    
    // Accept selected cookies
    banner.querySelector('#consent-accept-selected').addEventListener('click', () => {
      const preferences = {};
      Object.keys(this.consentCategories).forEach(key => {
        const checkbox = banner.querySelector(\`#consent-\${key}\`);
        preferences[key] = checkbox.checked;
      });
      this.saveConsent(preferences);
    });
    
    // Reject all non-necessary cookies
    banner.querySelector('#consent-reject-all').addEventListener('click', () => {
      const preferences = {};
      Object.keys(this.consentCategories).forEach(key => {
        preferences[key] = this.consentCategories[key].required;
      });
      this.saveConsent(preferences);
    });
    
    // Manage preferences (show detailed view)
    banner.querySelector('#consent-manage').addEventListener('click', () => {
      this.showDetailedConsentManager();
    });
  }
  
  saveConsent(preferences) {
    const consentData = {
      preferences,
      timestamp: new Date().toISOString(),
      version: this.consentVersion,
      source: 'banner',
      ip_hash: this.hashIP(), // Store hashed IP for legal compliance
      user_agent_hash: this.hashUserAgent()
    };
    
    try {
      localStorage.setItem('gdpr_consent', JSON.stringify(consentData));
      this.consentStatus = preferences;
      this.consentTimestamp = consentData.timestamp;
      
      // Apply the preferences
      this.applyConsentPreferences();
      
      // Remove consent banner
      const banner = document.getElementById('gdpr-consent-banner');
      if (banner) {
        banner.remove();
      }
      
      // Track consent event
      this.trackEvent('consent_saved', {
        preferences,
        timestamp: consentData.timestamp,
        source: 'banner'
      });
      
      console.log('GDPR consent saved:', preferences);
      
    } catch (error) {
      console.error('Failed to save consent:', error);
    }
  }
  
  applyConsentPreferences() {
    if (!this.consentStatus) return;
    
    // Handle analytics consent
    if (this.consentStatus.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }
    
    // Handle marketing consent
    if (this.consentStatus.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }
    
    // Handle functional consent
    if (this.consentStatus.functional) {
      this.enableFunctional();
    } else {
      this.disableFunctional();
    }
    
    // Clean up non-consented cookies
    this.cleanupCookies();
  }
  
  enableAnalytics() {
    // Initialize Google Analytics or other analytics tools
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
    
    console.log('Analytics enabled');
  }
  
  disableAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    console.log('Analytics disabled');
  }
  
  enableMarketing() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
    
    // Load marketing pixels/scripts
    this.loadMarketingScripts();
    
    console.log('Marketing enabled');
  }
  
  disableMarketing() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
    
    console.log('Marketing disabled');
  }
  
  enableFunctional() {
    // Enable functional features like preferences, chat widgets, etc.
    console.log('Functional cookies enabled');
  }
  
  disableFunctional() {
    // Disable functional features
    console.log('Functional cookies disabled');
  }
  
  loadMarketingScripts() {
    // Load Facebook Pixel
    if (this.consentStatus.marketing && !window.fbq) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
    }
  }
  
  cleanupCookies() {
    Object.entries(this.consentCategories).forEach(([category, config]) => {
      if (!this.consentStatus[category] && !config.required) {
        // Remove cookies for non-consented categories
        config.cookies.forEach(cookieName => {
          this.deleteCookie(cookieName);
        });
      }
    });
  }
  
  deleteCookie(name) {
    document.cookie = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/\`;
    document.cookie = \`\${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.\${window.location.hostname}\`;
  }
  
  // Hash sensitive data for compliance
  hashIP() {
    // In a real implementation, this would be done server-side
    return 'hashed_ip_placeholder';
  }
  
  hashUserAgent() {
    return btoa(navigator.userAgent).slice(0, 16);
  }
  
  trackEvent(eventName, data) {
    // Only track if analytics consent is given or for necessary events
    if (this.consentStatus?.analytics || eventName.includes('consent')) {
      console.log('Event tracked:', eventName, data);
      
      // Send to analytics service
      if (typeof gtag !== 'undefined' && this.consentStatus?.analytics) {
        gtag('event', eventName, data);
      }
    }
  }
  
  // Show detailed consent manager
  showDetailedConsentManager() {
    const modal = this.createDetailedConsentModal();
    document.body.appendChild(modal);
  }
  
  createDetailedConsentModal() {
    const modal = document.createElement('div');
    modal.id = 'consent-preferences-modal';
    modal.innerHTML = \`
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          width: 90%;
        ">
          <h2>Privacy Preferences</h2>
          <p>Manage your cookie preferences below. You can change these settings at any time.</p>
          
          \${this.renderDetailedCategories()}
          
          <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: flex-end;">
            <button onclick="document.getElementById('consent-preferences-modal').remove()" style="
              padding: 10px 20px;
              background: #6c757d;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">Cancel</button>
            <button onclick="consentManager.saveDetailedPreferences()" style="
              padding: 10px 20px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">Save Preferences</button>
          </div>
        </div>
      </div>
    \`;
    
    return modal;
  }
  
  renderDetailedCategories() {
    return Object.entries(this.consentCategories)
      .map(([key, category]) => \`
        <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0;">\${category.name}</h3>
            <label style="display: flex; align-items: center;">
              <input 
                type="checkbox" 
                id="detailed-consent-\${key}" 
                \${this.consentStatus?.[key] || category.required ? 'checked' : ''}
                \${category.required ? 'disabled' : ''}
                style="margin-right: 8px;"
              />
              <span>\${category.required ? 'Always Active' : 'Enable'}</span>
            </label>
          </div>
          <p style="color: #666; font-size: 14px; margin-bottom: 10px;">\${category.description}</p>
          <details>
            <summary style="cursor: pointer; color: #007bff;">View Cookies</summary>
            <ul style="margin-top: 10px; font-size: 12px; color: #666;">
              \${category.cookies.map(cookie => \`<li>\${cookie}</li>\`).join('')}
            </ul>
          </details>
        </div>
      \`).join('');
  }
  
  saveDetailedPreferences() {
    const preferences = {};
    Object.keys(this.consentCategories).forEach(key => {
      const checkbox = document.getElementById(\`detailed-consent-\${key}\`);
      preferences[key] = checkbox ? checkbox.checked : this.consentCategories[key].required;
    });
    
    this.saveConsent(preferences);
    document.getElementById('consent-preferences-modal').remove();
    
    // Remove main banner if still visible
    const banner = document.getElementById('gdpr-consent-banner');
    if (banner) banner.remove();
  }
  
  // API for external consent status checks
  hasConsent(category) {
    return this.consentStatus?.[category] === true;
  }
  
  getConsentStatus() {
    return {
      status: this.consentStatus,
      timestamp: this.consentTimestamp,
      version: this.consentVersion
    };
  }
  
  revokeConsent() {
    localStorage.removeItem('gdpr_consent');
    this.consentStatus = null;
    this.consentTimestamp = null;
    
    // Clean up all cookies
    Object.values(this.consentCategories).forEach(category => {
      category.cookies.forEach(cookie => this.deleteCookie(cookie));
    });
    
    // Show consent banner again
    this.showConsentBanner();
    
    this.trackEvent('consent_revoked', {
      timestamp: new Date().toISOString()
    });
  }
}

// Initialize global consent manager
const consentManager = new GDPRConsentManager();

// Make it globally accessible for other scripts
window.consentManager = consentManager;

// Example usage in application code
function initializeAnalytics() {
  if (consentManager.hasConsent('analytics')) {
    // Initialize analytics
    console.log('Initializing analytics with consent');
  } else {
    console.log('Analytics consent not granted');
  }
}

// Wait for consent before initializing
document.addEventListener('DOMContentLoaded', () => {
  // Check if we already have consent
  if (consentManager.getConsentStatus().status) {
    initializeAnalytics();
  } else {
    // Wait for consent to be given
    const checkConsent = setInterval(() => {
      if (consentManager.getConsentStatus().status) {
        initializeAnalytics();
        clearInterval(checkConsent);
      }
    }, 500);
  }
});
```

### 2. Data Subject Rights Implementation

```javascript
// GDPR Data Subject Rights Management
class DataSubjectRightsManager {
  constructor() {
    this.apiEndpoint = '/api/gdpr';
    this.requestTypes = {
      ACCESS: 'access',
      RECTIFICATION: 'rectification',
      ERASURE: 'erasure',
      RESTRICTION: 'restriction',
      PORTABILITY: 'portability',
      OBJECTION: 'objection'
    };
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Handle data subject request forms
    document.addEventListener('submit', (e) => {
      if (e.target.matches('.gdpr-request-form')) {
        e.preventDefault();
        this.handleDataSubjectRequest(e.target);
      }
    });
  }
  
  async handleDataSubjectRequest(form) {
    const formData = new FormData(form);
    const requestData = {
      type: formData.get('request_type'),
      email: formData.get('email'),
      description: formData.get('description'),
      verification_data: this.collectVerificationData(),
      timestamp: new Date().toISOString()
    };
    
    try {
      const response = await this.submitDataSubjectRequest(requestData);
      this.showRequestConfirmation(response);
    } catch (error) {
      this.showRequestError(error);
    }
  }
  
  async submitDataSubjectRequest(requestData) {
    const response = await fetch(\`\${this.apiEndpoint}/data-subject-request\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(\`Request failed: \${response.status}\`);
    }
    
    return response.json();
  }
  
  collectVerificationData() {
    // Collect minimal data needed for identity verification
    return {
      user_agent_hash: btoa(navigator.userAgent).slice(0, 16),
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    };
  }
  
  showRequestConfirmation(response) {
    const notification = document.createElement('div');
    notification.className = 'gdpr-notification success';
    notification.innerHTML = \`
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 4px;
        border-left: 4px solid #28a745;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 9999;
        max-width: 400px;
      ">
        <strong>Request Submitted</strong><br>
        Your data subject request has been received.<br>
        Reference ID: <code>\${response.requestId}</code><br>
        <small>You will receive an email confirmation shortly.</small>
        <button onclick="this.parentElement.remove()" style="
          position: absolute;
          top: 5px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        ">×</button>
      </div>
    \`;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => notification.remove(), 10000);
  }
  
  showRequestError(error) {
    const notification = document.createElement('div');
    notification.className = 'gdpr-notification error';
    notification.innerHTML = \`
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 15px 20px;
        border-radius: 4px;
        border-left: 4px solid #dc3545;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 9999;
        max-width: 400px;
      ">
        <strong>Request Failed</strong><br>
        \${error.message}<br>
        <small>Please try again or contact support.</small>
        <button onclick="this.parentElement.remove()" style="
          position: absolute;
          top: 5px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        ">×</button>
      </div>
    \`;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => notification.remove(), 10000);
  }
  
  // Create data subject request forms
  createAccessRequestForm() {
    return \`
      <form class="gdpr-request-form" style="max-width: 500px; margin: 20px 0;">
        <h3>Request Access to Your Data</h3>
        <p>Under GDPR Article 15, you have the right to access your personal data.</p>
        
        <input type="hidden" name="request_type" value="access">
        
        <div style="margin: 15px 0;">
          <label for="access-email">Email Address:</label>
          <input 
            type="email" 
            id="access-email" 
            name="email" 
            required 
            style="
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
            "
          >
        </div>
        
        <div style="margin: 15px 0;">
          <label for="access-description">Additional Information (optional):</label>
          <textarea 
            id="access-description" 
            name="description" 
            rows="3"
            placeholder="Specify what data you'd like to access..."
            style="
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
              resize: vertical;
            "
          ></textarea>
        </div>
        
        <button type="submit" style="
          padding: 12px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Submit Request</button>
        
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
          We will respond to your request within 30 days as required by GDPR.
        </p>
      </form>
    \`;
  }
  
  createErasureRequestForm() {
    return \`
      <form class="gdpr-request-form" style="max-width: 500px; margin: 20px 0;">
        <h3>Request Erasure of Your Data</h3>
        <p>Under GDPR Article 17 (Right to be Forgotten), you can request deletion of your personal data.</p>
        
        <input type="hidden" name="request_type" value="erasure">
        
        <div style="margin: 15px 0;">
          <label for="erasure-email">Email Address:</label>
          <input 
            type="email" 
            id="erasure-email" 
            name="email" 
            required 
            style="
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
            "
          >
        </div>
        
        <div style="margin: 15px 0;">
          <label for="erasure-reason">Reason for Deletion:</label>
          <select 
            id="erasure-reason" 
            name="reason" 
            required
            style="
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
            "
          >
            <option value="">Select a reason</option>
            <option value="no_longer_necessary">Data no longer necessary</option>
            <option value="withdraw_consent">Withdraw consent</option>
            <option value="unlawful_processing">Unlawful processing</option>
            <option value="compliance_obligation">Legal compliance</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div style="margin: 15px 0;">
          <label for="erasure-description">Additional Details:</label>
          <textarea 
            id="erasure-description" 
            name="description" 
            rows="3"
            placeholder="Please explain your request in detail..."
            style="
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
              resize: vertical;
            "
          ></textarea>
        </div>
        
        <div style="margin: 15px 0;">
          <label>
            <input type="checkbox" required> 
            I understand that this action may be irreversible and could affect my ability to use certain services.
          </label>
        </div>
        
        <button type="submit" style="
          padding: 12px 24px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Submit Deletion Request</button>
        
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
          We will process your request within 30 days. Note that some data may need to be retained for legal or legitimate business purposes.
        </p>
      </form>
    \`;
  }
  
  createPortabilityRequestForm() {
    return \`
      <form class="gdpr-request-form" style="max-width: 500px; margin: 20px 0;">
        <h3>Request Data Portability</h3>
        <p>Under GDPR Article 20, you have the right to receive your personal data in a structured, commonly used format.</p>
        
        <input type="hidden" name="request_type" value="portability">
        
        <div style="margin: 15px 0;">
          <label for="portability-email">Email Address:</label>
          <input 
            type="email" 
            id="portability-email" 
            name="email" 
            required 
            style="
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
            "
          >
        </div>
        
        <div style="margin: 15px 0;">
          <label for="portability-format">Preferred Format:</label>
          <select 
            id="portability-format" 
            name="format"
            style="
              width: 100%;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-top: 5px;
            "
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
          </select>
        </div>
        
        <div style="margin: 15px 0;">
          <label>Data Categories (select all that apply):</label>
          <div style="margin-top: 5px;">
            <label><input type="checkbox" name="categories" value="profile" checked> Profile Information</label><br>
            <label><input type="checkbox" name="categories" value="activity"> Activity Data</label><br>
            <label><input type="checkbox" name="categories" value="preferences"> Preferences</label><br>
            <label><input type="checkbox" name="categories" value="communications"> Communications</label><br>
          </div>
        </div>
        
        <button type="submit" style="
          padding: 12px 24px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Request Data Export</button>
        
        <p style="font-size: 12px; color: #666; margin-top: 10px;">
          We will provide your data in the requested format within 30 days.
        </p>
      </form>
    \`;
  }
}

// Initialize data subject rights manager
const dataRightsManager = new DataSubjectRightsManager();
```

### 3. CCPA Compliance Implementation

```javascript
// California Consumer Privacy Act (CCPA) compliance
class CCPAComplianceManager {
  constructor() {
    this.isCaliforniaUser = this.detectCaliforniaUser();
    this.ccpaRights = {
      know: 'Right to Know',
      delete: 'Right to Delete',
      opt_out: 'Right to Opt-Out',
      non_discrimination: 'Right to Non-Discrimination'
    };
    
    if (this.isCaliforniaUser) {
      this.initializeCCPAFeatures();
    }
  }
  
  detectCaliforniaUser() {
    // This would typically be done server-side based on IP geolocation
    // For demo purposes, we'll use a simple check
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const californiaTimezones = [
      'America/Los_Angeles',
      'America/San_Francisco',
      'America/Pacific'
    ];
    
    return californiaTimezones.includes(timezone) ||
           localStorage.getItem('ccpa_applicable') === 'true';
  }
  
  initializeCCPAFeatures() {
    console.log('CCPA compliance features initialized');
    
    // Show "Do Not Sell My Personal Information" link
    this.addDoNotSellLink();
    
    // Initialize privacy dashboard
    this.initializePrivacyDashboard();
  }
  
  addDoNotSellLink() {
    // Add the required CCPA "Do Not Sell" link
    const footer = document.querySelector('footer') || document.body;
    
    const doNotSellLink = document.createElement('div');
    doNotSellLink.innerHTML = \`
      <div style="
        margin: 20px 0;
        padding: 15px;
        background: #f8f9fa;
        border-left: 4px solid #007bff;
      ">
        <strong>California Residents:</strong> 
        <a href="#" onclick="ccpaManager.showOptOutModal(); return false;" style="
          color: #007bff;
          text-decoration: underline;
        ">Do Not Sell My Personal Information</a>
      </div>
    \`;
    
    footer.appendChild(doNotSellLink);
  }
  
  showOptOutModal() {
    const modal = document.createElement('div');
    modal.id = 'ccpa-opt-out-modal';
    modal.innerHTML = \`
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 8px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          width: 90%;
        ">
          <h2>Do Not Sell My Personal Information</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), you have the right to opt-out 
            of the sale of your personal information. We respect your privacy choices.
          </p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px;">
            <h4>What does "sale" mean under CCPA?</h4>
            <p style="font-size: 14px; margin: 10px 0;">
              CCPA broadly defines "sale" to include sharing personal information with third parties 
              for valuable consideration, including sharing for advertising purposes.
            </p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 4px;">
            <h4>Current Status:</h4>
            <p id="ccpa-current-status" style="font-size: 14px; margin: 10px 0;">
              Checking current opt-out status...
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <label style="display: flex; align-items: center; font-size: 16px;">
              <input type="checkbox" id="ccpa-opt-out-checkbox" style="margin-right: 10px; transform: scale(1.2);">
              I do not want my personal information sold to third parties
            </label>
          </div>
          
          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px;">
            <button onclick="document.getElementById('ccpa-opt-out-modal').remove()" style="
              padding: 12px 24px;
              background: #6c757d;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">Cancel</button>
            <button onclick="ccpaManager.saveOptOutPreference()" style="
              padding: 12px 24px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            ">Save Preference</button>
          </div>
        </div>
      </div>
    \`;
    
    document.body.appendChild(modal);
    
    // Load current status
    this.loadCurrentOptOutStatus();
  }
  
  async loadCurrentOptOutStatus() {
    try {
      const response = await fetch('/api/ccpa/opt-out-status');
      const status = await response.json();
      
      const statusElement = document.getElementById('ccpa-current-status');
      const checkbox = document.getElementById('ccpa-opt-out-checkbox');
      
      if (status.opted_out) {
        statusElement.innerHTML = '✅ You are currently opted-out of personal information sales';
        statusElement.style.color = '#28a745';
        checkbox.checked = true;
      } else {
        statusElement.innerHTML = '⚠️ You have not opted-out of personal information sales';
        statusElement.style.color = '#ffc107';
        checkbox.checked = false;
      }
    } catch (error) {
      console.error('Failed to load opt-out status:', error);
      document.getElementById('ccpa-current-status').innerHTML = 
        '❌ Unable to load current status';
    }
  }
  
  async saveOptOutPreference() {
    const checkbox = document.getElementById('ccpa-opt-out-checkbox');
    const opted_out = checkbox.checked;
    
    try {
      const response = await fetch('/api/ccpa/opt-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          opted_out,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        })
      });
      
      if (response.ok) {
        // Show success message
        this.showOptOutConfirmation(opted_out);
        document.getElementById('ccpa-opt-out-modal').remove();
      } else {
        throw new Error('Failed to save preference');
      }
    } catch (error) {
      alert('Failed to save your preference. Please try again.');
      console.error('CCPA opt-out failed:', error);
    }
  }
  
  showOptOutConfirmation(opted_out) {
    const message = opted_out ? 
      'You have successfully opted-out of personal information sales.' :
      'You have opted back into personal information sharing.';
    
    const notification = document.createElement('div');
    notification.innerHTML = \`
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 4px;
        border-left: 4px solid #28a745;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 9999;
        max-width: 400px;
      ">
        <strong>Preference Saved</strong><br>
        \${message}
        <button onclick="this.parentElement.remove()" style="
          position: absolute;
          top: 5px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        ">×</button>
      </div>
    \`;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 8000);
  }
  
  initializePrivacyDashboard() {
    // Create a privacy dashboard for California users
    if (document.getElementById('privacy-dashboard')) return;
    
    const dashboard = document.createElement('div');
    dashboard.id = 'privacy-dashboard';
    dashboard.style.display = 'none'; // Hidden by default
    
    dashboard.innerHTML = \`
      <div style="
        position: fixed;
        right: 20px;
        bottom: 20px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        width: 300px;
        z-index: 10000;
      ">
        <div style="
          padding: 15px;
          background: #007bff;
          color: white;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <strong>Privacy Control</strong>
          <button onclick="document.getElementById('privacy-dashboard').style.display='none'" style="
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
          ">×</button>
        </div>
        <div style="padding: 15px;">
          <p style="font-size: 14px; margin: 0 0 15px 0;">
            Manage your California privacy rights:
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button onclick="ccpaManager.showOptOutModal()" style="
              padding: 8px 12px;
              background: #28a745;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            ">Do Not Sell My Info</button>
            <button onclick="ccpaManager.requestDataAccess()" style="
              padding: 8px 12px;
              background: #17a2b8;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            ">Access My Data</button>
            <button onclick="ccpaManager.requestDataDeletion()" style="
              padding: 8px 12px;
              background: #dc3545;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            ">Delete My Data</button>
          </div>
        </div>
      </div>
    \`;
    
    document.body.appendChild(dashboard);
    
    // Add toggle button
    this.addPrivacyToggle();
  }
  
  addPrivacyToggle() {
    const toggle = document.createElement('div');
    toggle.innerHTML = \`
      <button onclick="document.getElementById('privacy-dashboard').style.display='block'" style="
        position: fixed;
        right: 20px;
        bottom: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 9999;
      " title="Privacy Settings">🔒</button>
    \`;
    
    document.body.appendChild(toggle);
  }
  
  async requestDataAccess() {
    // Redirect to data access request form
    window.location.href = '/privacy/data-access-request';
  }
  
  async requestDataDeletion() {
    // Redirect to data deletion request form
    window.location.href = '/privacy/data-deletion-request';
  }
}

// Initialize CCPA compliance if applicable
const ccpaManager = new CCPAComplianceManager();
window.ccpaManager = ccpaManager;
```

## Accessibility Compliance (WCAG 2.1)

```javascript
// Web Content Accessibility Guidelines (WCAG) compliance
class AccessibilityComplianceManager {
  constructor() {
    this.wcagLevel = 'AA'; // AA is the legal standard for most jurisdictions
    this.issues = [];
    this.setupAccessibilityFeatures();
    this.runAccessibilityAudit();
  }
  
  setupAccessibilityFeatures() {
    // Skip links for keyboard navigation
    this.addSkipLinks();
    
    // High contrast mode support
    this.addHighContrastSupport();
    
    // Font size controls
    this.addFontSizeControls();
    
    // Focus management
    this.improveFocusManagement();
    
    // ARIA live regions for dynamic content
    this.setupLiveRegions();
  }
  
  addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.innerHTML = \`
      <div id="skip-links" style="
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 100000;
      ">
        <a href="#main-content" style="color: #fff;">Skip to main content</a>
        <a href="#navigation" style="color: #fff; margin-left: 10px;">Skip to navigation</a>
      </div>
    \`;
    
    // Show skip links when focused
    skipLinks.addEventListener('focusin', () => {
      skipLinks.style.top = '0';
    });
    
    skipLinks.addEventListener('focusout', () => {
      skipLinks.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }
  
  addHighContrastSupport() {
    const contrastToggle = document.createElement('button');
    contrastToggle.innerHTML = 'High Contrast';
    contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    contrastToggle.style.cssText = \`
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 10000;
      padding: 8px 12px;
      background: #000;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 4px;
      cursor: pointer;
    \`;
    
    contrastToggle.addEventListener('click', () => {
      this.toggleHighContrast();
    });
    
    document.body.appendChild(contrastToggle);
    
    // Check for saved preference
    if (localStorage.getItem('high-contrast') === 'true') {
      this.enableHighContrast();
    }
  }
  
  toggleHighContrast() {
    const isEnabled = document.body.classList.contains('high-contrast');
    
    if (isEnabled) {
      this.disableHighContrast();
    } else {
      this.enableHighContrast();
    }
  }
  
  enableHighContrast() {
    document.body.classList.add('high-contrast');
    localStorage.setItem('high-contrast', 'true');
    
    // Add high contrast styles
    const styles = document.createElement('style');
    styles.id = 'high-contrast-styles';
    styles.innerHTML = \`
      .high-contrast * {
        background: #000 !important;
        color: #ffff00 !important;
        border-color: #ffff00 !important;
      }
      
      .high-contrast a {
        color: #00ff00 !important;
      }
      
      .high-contrast button {
        background: #ffff00 !important;
        color: #000 !important;
      }
      
      .high-contrast input, 
      .high-contrast textarea, 
      .high-contrast select {
        background: #000 !important;
        color: #ffff00 !important;
        border: 2px solid #ffff00 !important;
      }
    \`;
    
    document.head.appendChild(styles);
  }
  
  disableHighContrast() {
    document.body.classList.remove('high-contrast');
    localStorage.setItem('high-contrast', 'false');
    
    const styles = document.getElementById('high-contrast-styles');
    if (styles) {
      styles.remove();
    }
  }
  
  addFontSizeControls() {
    const fontControls = document.createElement('div');
    fontControls.innerHTML = \`
      <div style="
        position: fixed;
        top: 50px;
        right: 10px;
        z-index: 10000;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 4px;
      ">
        <label style="display: block; margin-bottom: 5px;">Font Size:</label>
        <button onclick="accessibilityManager.changeFontSize('decrease')" aria-label="Decrease font size">A-</button>
        <button onclick="accessibilityManager.changeFontSize('reset')" aria-label="Reset font size">A</button>
        <button onclick="accessibilityManager.changeFontSize('increase')" aria-label="Increase font size">A+</button>
      </div>
    \`;
    
    document.body.appendChild(fontControls);
    
    // Load saved font size preference
    const savedFontSize = localStorage.getItem('font-size-preference');
    if (savedFontSize) {
      document.documentElement.style.fontSize = savedFontSize;
    }
  }
  
  changeFontSize(action) {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).fontSize) || 16;
    
    let newSize;
    
    switch (action) {
      case 'increase':
        newSize = Math.min(currentSize * 1.1, 24); // Max 24px
        break;
      case 'decrease':
        newSize = Math.max(currentSize * 0.9, 12); // Min 12px
        break;
      case 'reset':
        newSize = 16; // Default size
        break;
      default:
        return;
    }
    
    root.style.fontSize = newSize + 'px';
    localStorage.setItem('font-size-preference', newSize + 'px');
  }
  
  improveFocusManagement() {
    // Add visible focus indicators
    const focusStyles = document.createElement('style');
    focusStyles.innerHTML = \`
      *:focus {
        outline: 3px solid #005fcc !important;
        outline-offset: 2px !important;
      }
      
      .focus-trap {
        position: relative;
      }
    \`;
    document.head.appendChild(focusStyles);
    
    // Manage focus for modals and overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.manageFocusTrap(e);
      }
      
      if (e.key === 'Escape') {
        this.handleEscapeKey(e);
      }
    });
  }
  
  manageFocusTrap(e) {
    const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
  
  handleEscapeKey(e) {
    const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
    if (modal) {
      const closeButton = modal.querySelector('[aria-label*="close"], .close');
      if (closeButton) {
        closeButton.click();
      }
    }
  }
  
  setupLiveRegions() {
    // Create ARIA live regions for dynamic content updates
    const liveRegions = document.createElement('div');
    liveRegions.innerHTML = \`
      <div aria-live="polite" aria-atomic="true" id="status-messages" style="
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      "></div>
      <div aria-live="assertive" aria-atomic="true" id="error-messages" style="
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      "></div>
    \`;
    
    document.body.appendChild(liveRegions);
  }
  
  announceToScreenReader(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'error-messages' : 'status-messages';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }
  
  runAccessibilityAudit() {
    console.log('Running accessibility audit...');
    
    const issues = [];
    
    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push({
        type: 'missing_alt_text',
        severity: 'high',
        count: images.length,
        description: 'Images without alt text found',
        elements: Array.from(images)
      });
    }
    
    // Check for missing form labels
    const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]):not([title])');
    unlabeledInputs.forEach(input => {
      const label = document.querySelector(\`label[for="\${input.id}"]\`);
      if (!label) {
        issues.push({
          type: 'missing_form_label',
          severity: 'high',
          description: 'Form input without associated label',
          element: input
        });
      }
    });
    
    // Check color contrast (simplified)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
    textElements.forEach(element => {
      const contrast = this.checkColorContrast(element);
      if (contrast && contrast.ratio < 4.5) {
        issues.push({
          type: 'low_color_contrast',
          severity: 'medium',
          description: \`Low color contrast ratio: \${contrast.ratio.toFixed(2)}\`,
          element: element
        });
      }
    });
    
    // Check for keyboard accessibility
    const interactiveElements = document.querySelectorAll('div[onclick], span[onclick]');
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex') && !element.hasAttribute('role')) {
        issues.push({
          type: 'non_keyboard_accessible',
          severity: 'high',
          description: 'Interactive element not keyboard accessible',
          element: element
        });
      }
    });
    
    this.issues = issues;
    
    if (issues.length > 0) {
      console.warn(\`Found \${issues.length} accessibility issues:\`, issues);
      this.generateAccessibilityReport();
    } else {
      console.log('✅ No accessibility issues found');
    }
  }
  
  checkColorContrast(element) {
    try {
      const style = getComputedStyle(element);
      const bgColor = style.backgroundColor;
      const textColor = style.color;
      
      // Simplified contrast calculation
      // In a real implementation, you'd use a proper contrast calculation library
      const bgLuminance = this.getLuminance(bgColor);
      const textLuminance = this.getLuminance(textColor);
      
      const ratio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                    (Math.min(bgLuminance, textLuminance) + 0.05);
      
      return { ratio, bgColor, textColor };
    } catch (error) {
      return null;
    }
  }
  
  getLuminance(color) {
    // Simplified luminance calculation
    // Real implementation would handle all color formats properly
    if (color === 'rgb(255, 255, 255)' || color === '#ffffff') return 1;
    if (color === 'rgb(0, 0, 0)' || color === '#000000') return 0;
    return 0.5; // Default for complex colors
  }
  
  generateAccessibilityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      severityBreakdown: {
        high: this.issues.filter(i => i.severity === 'high').length,
        medium: this.issues.filter(i => i.severity === 'medium').length,
        low: this.issues.filter(i => i.severity === 'low').length
      },
      issues: this.issues,
      wcagLevel: this.wcagLevel,
      recommendations: this.generateRecommendations()
    };
    
    console.log('Accessibility Report:', report);
    return report;
  }
  
  generateRecommendations() {
    const recommendations = [];
    
    const highIssues = this.issues.filter(i => i.severity === 'high').length;
    if (highIssues > 0) {
      recommendations.push('Address high-severity accessibility issues immediately to ensure WCAG compliance');
    }
    
    if (this.issues.some(i => i.type === 'missing_alt_text')) {
      recommendations.push('Add descriptive alt text to all images');
    }
    
    if (this.issues.some(i => i.type === 'missing_form_label')) {
      recommendations.push('Associate all form inputs with descriptive labels');
    }
    
    if (this.issues.some(i => i.type === 'low_color_contrast')) {
      recommendations.push('Improve color contrast to meet WCAG AA standards (4.5:1 ratio)');
    }
    
    return recommendations;
  }
}

// Initialize accessibility compliance
const accessibilityManager = new AccessibilityComplianceManager();
window.accessibilityManager = accessibilityManager;
```

## Summary

Compliance and regulation in modern web development represents a fundamental shift from treating privacy and accessibility as afterthoughts to integrating them as core design principles. The regulatory landscape continues to evolve rapidly, with new laws and standards emerging globally, making compliance not just a legal requirement but a competitive advantage and ethical imperative.

**Key Regulatory Requirements:**
- **GDPR**: Comprehensive data protection with strict consent requirements, user rights, and significant penalties for non-compliance
- **CCPA**: California's privacy law providing consumers with rights to know, delete, and opt-out of personal information sales
- **WCAG 2.1**: Accessibility standards ensuring web content is usable by people with disabilities
- **Industry Standards**: Sector-specific regulations like HIPAA for healthcare and PCI DSS for payment processing

**Implementation Strategies:**
- **Privacy by Design**: Build privacy protection into systems from the ground up, not as an add-on
- **Consent Management**: Implement granular, informed consent mechanisms that respect user choices
- **Data Subject Rights**: Provide clear, accessible mechanisms for users to exercise their privacy rights
- **Accessibility First**: Design and develop with accessibility as a primary consideration, not a retrofit

**Technical Implementation:**
- **Consent Systems**: Sophisticated consent management with proper categorization, expiration, and user preference storage
- **Data Rights Automation**: Automated systems for handling access, rectification, erasure, and portability requests
- **Accessibility Features**: Skip links, high contrast modes, font controls, ARIA support, and keyboard navigation
- **Monitoring and Auditing**: Continuous compliance monitoring with automated issue detection and reporting

**Operational Excellence:**
- **Documentation**: Comprehensive privacy policies, accessibility statements, and compliance procedures
- **Training**: Regular staff training on compliance requirements and best practices
- **Incident Response**: Clear procedures for handling privacy breaches and accessibility complaints
- **Continuous Improvement**: Regular audits, user feedback integration, and proactive compliance updates

The cost of non-compliance can be severe - from GDPR fines reaching 4% of global annual revenue to accessibility lawsuits that can damage both finances and reputation. However, the benefits of proactive compliance extend far beyond avoiding penalties:

- **User Trust**: Transparent privacy practices and accessible design build customer confidence
- **Market Access**: Compliance enables global market expansion and business growth
- **Innovation Driver**: Privacy and accessibility constraints often lead to better, more innovative solutions
- **Competitive Advantage**: Strong compliance positioning differentiates your organization in the marketplace

The future of web compliance will likely see increased harmonization of privacy laws globally, stronger enforcement mechanisms, and expanded accessibility requirements. Organizations that invest early in comprehensive compliance frameworks will be better positioned to adapt to these evolving requirements while delivering superior user experiences.

Building compliance-ready applications requires a holistic approach that combines legal understanding, technical implementation, operational processes, and cultural commitment to privacy and accessibility. By treating compliance as a design principle rather than a checkbox exercise, organizations can create digital experiences that are not just legally compliant but genuinely respectful of user rights and needs.

*Privacy and accessibility aren't just legal requirements - they're fundamental human rights that should be built into every digital experience we create.*
