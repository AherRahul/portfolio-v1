---
title: "Accessibility Testing Tools"
description: "Master automated and manual accessibility testing tools and methodologies. Learn how to integrate accessibility testing into your development workflow and catch issues early in the development process."
image: "https://res.cloudinary.com/duojkrgue/image/upload/v1744108709/Portfolio/FrontendSystemDesignCourse/39_xm74k9.png"
publishedAt: "2026-01-13"
is_on_youtube: false
courseName: "02-frontend-system-design"
id: 69
auther_name: "Rahul Aher"
topics:
  - frontend
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048331/Portfolio/FrontendSystemDesignCourse/titleImages/53_jqomcq.png)

Accessibility testing is crucial for ensuring that web applications are usable by everyone, regardless of their abilities. A comprehensive testing strategy combines automated tools, manual testing techniques, and real user feedback to create truly accessible digital experiences.

## The Theoretical Foundation

### Understanding Accessibility Testing Approaches

Accessibility testing operates on multiple levels, similar to a **quality assurance factory** with different inspection stations:

1. **Automated Testing**: Catches obvious violations quickly (like spell-check for code)
2. **Manual Testing**: Identifies complex usability issues (like human proofreading)
3. **Assistive Technology Testing**: Real-world usage scenarios (like test-driving a car)
4. **User Testing**: Actual user feedback (like customer reviews)

### The Testing Pyramid for Accessibility

Think of accessibility testing as a **multi-layered security system**:
- **Unit Tests**: Individual component accessibility (door locks)
- **Integration Tests**: Component interaction accessibility (alarm system)
- **E2E Tests**: Full user journey accessibility (security guards)
- **Manual Tests**: Human verification (security audit)

### Testing Methodologies

Different testing approaches serve different purposes:

1. **Shift-Left Testing**: Catching issues early in development
2. **Continuous Testing**: Ongoing validation throughout development
3. **Regression Testing**: Ensuring fixes don't break other features
4. **Performance Testing**: Accessibility under different conditions

## Building a Comprehensive Accessibility Testing Framework

Let's create an advanced testing system that integrates multiple tools and approaches:

```javascript
class AccessibilityTestingFramework {
    constructor(options = {}) {
        this.config = {
            // Testing levels
            runUnitTests: true,
            runIntegrationTests: true,
            runE2ETests: true,
            
            // Test coverage
            testCoverage: {
                wcagLevel: 'AA', // 'A', 'AA', 'AAA'
                includeAAA: false,
                customRules: []
            },
            
            // Tools configuration
            tools: {
                axe: { enabled: true, config: {} },
                pa11y: { enabled: true, config: {} },
                lighthouse: { enabled: true, config: {} },
                custom: { enabled: true, rules: [] }
            },
            
            // Reporting
            reporting: {
                format: 'json', // 'json', 'html', 'junit'
                output: './accessibility-report',
                includeScreenshots: true,
                severity: 'minor' // 'critical', 'serious', 'moderate', 'minor'
            },
            
            // CI/CD Integration
            ciIntegration: {
                failOnViolations: true,
                allowedViolations: 0,
                baselineFile: null
            },
            
            ...options
        };

        this.testResults = [];
        this.violationSummary = new Map();
        this.testHistory = [];
        this.knownIssues = new Set();

        this.init();
    }

    init() {
        this.setupTestEnvironment();
        this.loadTestingLibraries();
        this.setupReporting();
        this.loadKnownIssues();
    }

    // Test Environment Setup
    async setupTestEnvironment() {
        // Ensure testing environment is properly configured
        if (typeof window === 'undefined') {
            // Node.js environment - setup jsdom or similar
            await this.setupNodeTestEnvironment();
        } else {
            // Browser environment
            this.setupBrowserTestEnvironment();
        }
    }

    async setupNodeTestEnvironment() {
        try {
            const { JSDOM } = await import('jsdom');
            const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
            
            global.window = dom.window;
            global.document = dom.window.document;
            global.navigator = dom.window.navigator;
            
            // Setup accessibility testing environment
            this.testWindow = dom.window;
            this.testDocument = dom.window.document;
        } catch (error) {
            console.warn('JSDOM not available, some tests may not work in Node.js');
        }
    }

    setupBrowserTestEnvironment() {
        this.testWindow = window;
        this.testDocument = document;
        
        // Add test-specific styles and utilities
        this.injectTestHelpers();
    }

    injectTestHelpers() {
        const style = document.createElement('style');
        style.id = 'accessibility-test-helpers';
        style.textContent = `
            .a11y-test-highlight-violation {
                outline: 3px solid red !important;
                outline-offset: 2px !important;
            }
            
            .a11y-test-highlight-warning {
                outline: 2px solid orange !important;
                outline-offset: 2px !important;
            }
            
            .a11y-test-highlight-info {
                outline: 1px solid blue !important;
                outline-offset: 1px !important;
            }
            
            .a11y-test-marker {
                position: absolute;
                background: red;
                color: white;
                padding: 2px 4px;
                font-size: 10px;
                z-index: 10000;
                border-radius: 2px;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Automated Testing with Axe-core
    async runAxeTests(element = document.body, options = {}) {
        if (!this.config.tools.axe.enabled) return [];

        try {
            // Load axe-core dynamically if not already loaded
            if (typeof axe === 'undefined') {
                await this.loadAxeCore();
            }

            const axeConfig = {
                rules: {},
                tags: [],
                ...this.config.tools.axe.config,
                ...options
            };

            // Configure WCAG level
            if (this.config.testCoverage.wcagLevel) {
                axeConfig.tags.push(`wcag${this.config.testCoverage.wcagLevel.toLowerCase()}`);
            }

            // Run axe tests
            const results = await axe.run(element, axeConfig);
            
            // Process and store results
            const processedResults = this.processAxeResults(results);
            this.testResults.push({
                tool: 'axe-core',
                timestamp: Date.now(),
                element: element === document.body ? 'body' : this.getElementSelector(element),
                results: processedResults
            });

            return processedResults;
        } catch (error) {
            console.error('Error running Axe tests:', error);
            return [];
        }
    }

    async loadAxeCore() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/axe-core@4.7.0/axe.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    processAxeResults(results) {
        const violations = results.violations.map(violation => ({
            id: violation.id,
            description: violation.description,
            help: violation.help,
            helpUrl: violation.helpUrl,
            impact: violation.impact,
            tags: violation.tags,
            nodes: violation.nodes.map(node => ({
                html: node.html,
                target: node.target,
                failureSummary: node.failureSummary,
                element: document.querySelector(node.target[0])
            }))
        }));

        // Update violation summary
        violations.forEach(violation => {
            const key = `${violation.id}-${violation.impact}`;
            const current = this.violationSummary.get(key) || 0;
            this.violationSummary.set(key, current + violation.nodes.length);
        });

        return {
            violations,
            passes: results.passes.length,
            incomplete: results.incomplete.length,
            inapplicable: results.inapplicable.length,
            summary: {
                total: violations.length,
                critical: violations.filter(v => v.impact === 'critical').length,
                serious: violations.filter(v => v.impact === 'serious').length,
                moderate: violations.filter(v => v.impact === 'moderate').length,
                minor: violations.filter(v => v.impact === 'minor').length
            }
        };
    }

    // Custom Accessibility Tests
    async runCustomTests(element = document.body) {
        if (!this.config.tools.custom.enabled) return [];

        const customTests = [
            this.testFocusManagement.bind(this),
            this.testKeyboardNavigation.bind(this),
            this.testColorContrast.bind(this),
            this.testFormLabels.bind(this),
            this.testHeadingStructure.bind(this),
            this.testImageAltText.bind(this),
            this.testLandmarkUsage.bind(this),
            this.testLiveRegions.bind(this)
        ];

        const results = [];
        
        for (const test of customTests) {
            try {
                const result = await test(element);
                if (result) results.push(result);
            } catch (error) {
                console.error('Error running custom test:', test.name, error);
            }
        }

        this.testResults.push({
            tool: 'custom',
            timestamp: Date.now(),
            element: element === document.body ? 'body' : this.getElementSelector(element),
            results
        });

        return results;
    }

    // Individual Custom Tests
    async testFocusManagement(element) {
        const violations = [];
        
        // Test for focus traps in modals
        const modals = element.querySelectorAll('[role="dialog"], .modal');
        modals.forEach((modal, index) => {
            if (this.isVisible(modal)) {
                const focusableElements = this.getFocusableElements(modal);
                if (focusableElements.length === 0) {
                    violations.push({
                        rule: 'focus-trap-content',
                        description: 'Modal dialog should contain focusable elements',
                        element: modal,
                        impact: 'serious'
                    });
                }

                // Check if focus is properly trapped
                if (!this.hasFocusTrap(modal)) {
                    violations.push({
                        rule: 'focus-trap-implementation',
                        description: 'Modal dialog should implement focus trapping',
                        element: modal,
                        impact: 'serious'
                    });
                }
            }
        });

        // Test for proper focus restoration
        const triggers = element.querySelectorAll('[data-toggle="modal"], [data-target]');
        triggers.forEach(trigger => {
            if (!trigger.hasAttribute('data-restore-focus')) {
                violations.push({
                    rule: 'focus-restoration',
                    description: 'Modal triggers should implement focus restoration',
                    element: trigger,
                    impact: 'moderate'
                });
            }
        });

        return violations.length > 0 ? {
            id: 'custom-focus-management',
            description: 'Focus management issues',
            violations
        } : null;
    }

    async testKeyboardNavigation(element) {
        const violations = [];
        
        // Test for keyboard accessibility
        const interactiveElements = element.querySelectorAll(
            'button, a, input, select, textarea, [tabindex], [role="button"], [role="link"]'
        );

        interactiveElements.forEach(el => {
            // Check if element is keyboard accessible
            if (!this.isKeyboardAccessible(el)) {
                violations.push({
                    rule: 'keyboard-accessible',
                    description: 'Interactive element should be keyboard accessible',
                    element: el,
                    impact: 'serious'
                });
            }

            // Check for proper ARIA attributes
            if (el.hasAttribute('role') && el.getAttribute('role') === 'button') {
                if (!el.hasAttribute('tabindex') && el.tagName !== 'BUTTON') {
                    violations.push({
                        rule: 'button-tabindex',
                        description: 'Element with button role should be focusable',
                        element: el,
                        impact: 'serious'
                    });
                }
            }
        });

        // Test for skip links
        const skipLinks = element.querySelectorAll('a[href^="#"]');
        if (skipLinks.length === 0 && element === document.body) {
            violations.push({
                rule: 'skip-links',
                description: 'Page should provide skip links for keyboard navigation',
                element: document.body,
                impact: 'moderate'
            });
        }

        return violations.length > 0 ? {
            id: 'custom-keyboard-navigation',
            description: 'Keyboard navigation issues',
            violations
        } : null;
    }

    async testColorContrast(element) {
        const violations = [];
        
        // Find all text elements
        const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
        
        textElements.forEach(el => {
            if (!el.textContent.trim()) return;

            const styles = window.getComputedStyle(el);
            const foreground = styles.color;
            const background = this.getEffectiveBackgroundColor(el);
            
            const contrast = this.calculateContrastRatio(foreground, background);
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            
            const isLarge = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
            const requiredRatio = isLarge ? 3.0 : 4.5;

            if (contrast < requiredRatio) {
                violations.push({
                    rule: 'color-contrast',
                    description: `Insufficient color contrast: ${contrast.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
                    element: el,
                    impact: contrast < requiredRatio * 0.7 ? 'serious' : 'moderate',
                    details: {
                        contrast: contrast.toFixed(2),
                        required: requiredRatio,
                        foreground,
                        background,
                        fontSize,
                        fontWeight
                    }
                });
            }
        });

        return violations.length > 0 ? {
            id: 'custom-color-contrast',
            description: 'Color contrast issues',
            violations
        } : null;
    }

    async testFormLabels(element) {
        const violations = [];
        
        const formControls = element.querySelectorAll('input, select, textarea');
        
        formControls.forEach(control => {
            if (control.type === 'hidden') return;

            const hasLabel = this.hasAccessibleLabel(control);
            
            if (!hasLabel) {
                violations.push({
                    rule: 'form-label',
                    description: 'Form control should have an accessible label',
                    element: control,
                    impact: 'serious'
                });
            }

            // Check for required field indication
            if (control.hasAttribute('required')) {
                const hasRequiredIndicator = this.hasRequiredIndicator(control);
                if (!hasRequiredIndicator) {
                    violations.push({
                        rule: 'required-field-indicator',
                        description: 'Required fields should be clearly indicated',
                        element: control,
                        impact: 'moderate'
                    });
                }
            }

            // Check for error message association
            if (control.hasAttribute('aria-invalid') && control.getAttribute('aria-invalid') === 'true') {
                const hasErrorMessage = control.hasAttribute('aria-describedby');
                if (!hasErrorMessage) {
                    violations.push({
                        rule: 'error-message-association',
                        description: 'Invalid fields should have associated error messages',
                        element: control,
                        impact: 'moderate'
                    });
                }
            }
        });

        return violations.length > 0 ? {
            id: 'custom-form-labels',
            description: 'Form labeling issues',
            violations
        } : null;
    }

    async testHeadingStructure(element) {
        const violations = [];
        const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        
        if (headings.length === 0) {
            violations.push({
                rule: 'heading-structure',
                description: 'Page should have heading structure',
                element: element,
                impact: 'moderate'
            });
            return { id: 'custom-heading-structure', description: 'Heading structure issues', violations };
        }

        // Check for h1
        const h1s = headings.filter(h => h.tagName === 'H1');
        if (h1s.length === 0) {
            violations.push({
                rule: 'h1-required',
                description: 'Page should have exactly one h1 element',
                element: element,
                impact: 'moderate'
            });
        } else if (h1s.length > 1) {
            violations.push({
                rule: 'multiple-h1',
                description: 'Page should have only one h1 element',
                element: element,
                impact: 'minor'
            });
        }

        // Check heading hierarchy
        let previousLevel = 0;
        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.substring(1));
            if (currentLevel - previousLevel > 1) {
                violations.push({
                    rule: 'heading-hierarchy',
                    description: `Heading level ${currentLevel} follows heading level ${previousLevel} (skipped levels)`,
                    element: heading,
                    impact: 'moderate'
                });
            }
            previousLevel = currentLevel;
        });

        return violations.length > 0 ? {
            id: 'custom-heading-structure',
            description: 'Heading structure issues',
            violations
        } : null;
    }

    async testImageAltText(element) {
        const violations = [];
        const images = element.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                violations.push({
                    rule: 'img-alt-required',
                    description: 'Images should have alt attributes',
                    element: img,
                    impact: 'serious'
                });
            } else {
                const alt = img.getAttribute('alt');
                const src = img.getAttribute('src') || '';
                
                // Check for redundant alt text
                if (alt && src && alt.includes(src.split('/').pop().split('.')[0])) {
                    violations.push({
                        rule: 'img-alt-redundant',
                        description: 'Alt text should not repeat the filename',
                        element: img,
                        impact: 'minor'
                    });
                }

                // Check for suspicious alt text patterns
                const suspiciousPatterns = ['image', 'picture', 'photo', 'graphic', 'placeholder'];
                if (suspiciousPatterns.some(pattern => alt.toLowerCase().includes(pattern))) {
                    violations.push({
                        rule: 'img-alt-suspicious',
                        description: 'Alt text may not be descriptive enough',
                        element: img,
                        impact: 'minor'
                    });
                }
            }
        });

        return violations.length > 0 ? {
            id: 'custom-image-alt',
            description: 'Image alt text issues',
            violations
        } : null;
    }

    async testLandmarkUsage(element) {
        const violations = [];
        
        // Check for main landmark
        const main = element.querySelector('main, [role="main"]');
        if (!main && element === document.body) {
            violations.push({
                rule: 'main-landmark',
                description: 'Page should have a main landmark',
                element: document.body,
                impact: 'moderate'
            });
        }

        // Check for navigation landmark
        const nav = element.querySelector('nav, [role="navigation"]');
        if (!nav && element === document.body) {
            violations.push({
                rule: 'navigation-landmark',
                description: 'Page should have navigation landmarks',
                element: document.body,
                impact: 'minor'
            });
        }

        // Check for complementary content
        const aside = element.querySelector('aside, [role="complementary"]');
        const sections = element.querySelectorAll('section');
        if (sections.length > 3 && !aside && element === document.body) {
            violations.push({
                rule: 'complementary-landmark',
                description: 'Pages with multiple sections should consider using complementary landmarks',
                element: document.body,
                impact: 'minor'
            });
        }

        return violations.length > 0 ? {
            id: 'custom-landmark-usage',
            description: 'Landmark usage issues',
            violations
        } : null;
    }

    async testLiveRegions(element) {
        const violations = [];
        
        // Find elements that likely update dynamically
        const dynamicElements = element.querySelectorAll(
            '[data-dynamic], .alert, .notification, .status, .loading, [id*="status"], [class*="status"]'
        );
        
        dynamicElements.forEach(el => {
            const hasLiveRegion = el.hasAttribute('aria-live') || 
                                el.hasAttribute('role') && ['alert', 'status', 'log'].includes(el.getAttribute('role'));
            
            if (!hasLiveRegion) {
                violations.push({
                    rule: 'live-region-missing',
                    description: 'Dynamic content should use ARIA live regions',
                    element: el,
                    impact: 'moderate'
                });
            }
        });

        // Check for form validation messages
        const errorMessages = element.querySelectorAll('.error, .invalid, [class*="error"], [aria-invalid="true"] + *');
        errorMessages.forEach(el => {
            if (!el.hasAttribute('aria-live') && !el.hasAttribute('role')) {
                violations.push({
                    rule: 'error-message-live-region',
                    description: 'Error messages should be announced to screen readers',
                    element: el,
                    impact: 'moderate'
                });
            }
        });

        return violations.length > 0 ? {
            id: 'custom-live-regions',
            description: 'Live region issues',
            violations
        } : null;
    }

    // Integration Testing
    async runIntegrationTests() {
        if (!this.config.runIntegrationTests) return [];

        const integrationTests = [
            this.testModalInteractions.bind(this),
            this.testFormSubmission.bind(this),
            this.testNavigationFlow.bind(this),
            this.testSearchFunctionality.bind(this)
        ];

        const results = [];
        
        for (const test of integrationTests) {
            try {
                const result = await test();
                if (result) results.push(result);
            } catch (error) {
                console.error('Error running integration test:', test.name, error);
            }
        }

        return results;
    }

    // Modal interaction test
    async testModalInteractions() {
        const violations = [];
        const modals = document.querySelectorAll('[role="dialog"], .modal');
        
        for (const modal of modals) {
            const trigger = document.querySelector(`[data-target="#${modal.id}"], [aria-controls="${modal.id}"]`);
            if (!trigger) continue;

            // Simulate modal opening
            const openEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            trigger.dispatchEvent(openEvent);

            await this.wait(100);

            // Check if focus moved to modal
            if (!modal.contains(document.activeElement)) {
                violations.push({
                    rule: 'modal-focus-management',
                    description: 'Modal should receive focus when opened',
                    element: modal,
                    impact: 'serious'
                });
            }

            // Test escape key
            const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            modal.dispatchEvent(escapeEvent);

            await this.wait(100);

            // Check if modal closed and focus restored
            if (this.isVisible(modal)) {
                violations.push({
                    rule: 'modal-escape-key',
                    description: 'Modal should close when Escape key is pressed',
                    element: modal,
                    impact: 'serious'
                });
            }
        }

        return violations.length > 0 ? {
            id: 'integration-modal-interactions',
            description: 'Modal interaction issues',
            violations
        } : null;
    }

    // Performance Testing for Accessibility
    async testAccessibilityPerformance() {
        const startTime = performance.now();
        
        // Test screen reader performance
        const textContent = document.body.textContent.length;
        const images = document.querySelectorAll('img').length;
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea').length;
        
        const metrics = {
            textContentLength: textContent,
            imageCount: images,
            interactiveElementCount: interactiveElements,
            testDuration: performance.now() - startTime
        };

        const issues = [];
        
        // Check for performance issues that affect accessibility
        if (textContent > 50000) {
            issues.push({
                rule: 'excessive-text-content',
                description: 'Large amounts of text may be difficult for screen readers',
                impact: 'minor',
                details: { textLength: textContent }
            });
        }

        if (interactiveElements > 100) {
            issues.push({
                rule: 'excessive-interactive-elements',
                description: 'Too many interactive elements may be overwhelming',
                impact: 'minor',
                details: { elementCount: interactiveElements }
            });
        }

        return {
            metrics,
            issues
        };
    }

    // Reporting and Output
    generateReport(format = 'json') {
        const summary = this.generateSummary();
        const timestamp = new Date().toISOString();
        
        const report = {
            metadata: {
                timestamp,
                url: window.location.href,
                wcagLevel: this.config.testCoverage.wcagLevel,
                toolsUsed: Object.keys(this.config.tools).filter(tool => this.config.tools[tool].enabled)
            },
            summary,
            results: this.testResults,
            violationSummary: Object.fromEntries(this.violationSummary),
            recommendations: this.generateRecommendations()
        };

        switch (format) {
            case 'html':
                return this.generateHTMLReport(report);
            case 'junit':
                return this.generateJUnitReport(report);
            default:
                return JSON.stringify(report, null, 2);
        }
    }

    generateSummary() {
        let totalViolations = 0;
        let criticalViolations = 0;
        let seriousViolations = 0;
        let moderateViolations = 0;
        let minorViolations = 0;

        this.testResults.forEach(result => {
            if (result.results.violations) {
                result.results.violations.forEach(violation => {
                    totalViolations++;
                    switch (violation.impact) {
                        case 'critical': criticalViolations++; break;
                        case 'serious': seriousViolations++; break;
                        case 'moderate': moderateViolations++; break;
                        case 'minor': minorViolations++; break;
                    }
                });
            }
        });

        return {
            totalTests: this.testResults.length,
            totalViolations,
            breakdown: {
                critical: criticalViolations,
                serious: seriousViolations,
                moderate: moderateViolations,
                minor: minorViolations
            },
            passRate: totalViolations === 0 ? 100 : Math.max(0, 100 - (totalViolations / this.testResults.length * 100))
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Analyze violation patterns
        this.violationSummary.forEach((count, key) => {
            const [rule, impact] = key.split('-');
            
            if (count > 3) {
                recommendations.push({
                    priority: impact === 'critical' || impact === 'serious' ? 'high' : 'medium',
                    category: 'pattern',
                    rule,
                    description: `Multiple instances of ${rule} violations detected (${count} occurrences)`,
                    suggestion: this.getRecommendationForRule(rule)
                });
            }
        });

        return recommendations;
    }

    getRecommendationForRule(rule) {
        const recommendations = {
            'color-contrast': 'Review and adjust color schemes to meet WCAG contrast requirements',
            'form-label': 'Ensure all form controls have proper labels or ARIA attributes',
            'focus-management': 'Implement proper focus management for dynamic content',
            'heading-hierarchy': 'Maintain logical heading structure throughout the application',
            'img-alt': 'Provide meaningful alternative text for all images',
            'keyboard-accessible': 'Ensure all interactive elements are keyboard accessible'
        };
        
        return recommendations[rule] || 'Review accessibility best practices for this rule';
    }

    // Utility Methods
    getFocusableElements(container) {
        const selectors = [
            'a[href]', 'button:not([disabled])', 'input:not([disabled])',
            'select:not([disabled])', 'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]'
        ];
        
        return Array.from(container.querySelectorAll(selectors.join(', ')))
            .filter(el => this.isVisible(el) && !el.disabled);
    }

    isVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
    }

    isKeyboardAccessible(element) {
        return element.tabIndex >= 0 || 
               element.tagName === 'BUTTON' ||
               element.tagName === 'A' ||
               element.tagName === 'INPUT' ||
               element.tagName === 'SELECT' ||
               element.tagName === 'TEXTAREA';
    }

    hasAccessibleLabel(element) {
        return element.hasAttribute('aria-label') ||
               element.hasAttribute('aria-labelledby') ||
               element.id && document.querySelector(`label[for="${element.id}"]`) ||
               element.closest('label');
    }

    hasRequiredIndicator(element) {
        return element.hasAttribute('aria-required') ||
               element.closest('label')?.textContent.includes('*') ||
               element.hasAttribute('aria-describedby');
    }

    hasFocusTrap(modal) {
        // Simple check for focus trap implementation
        return modal.hasAttribute('data-focus-trap') ||
               modal.querySelector('[data-focus-trap]') ||
               modal.addEventListener; // Assumes event listeners are set up
    }

    calculateContrastRatio(color1, color2) {
        // Simplified contrast calculation - use proper implementation in production
        // This would need the full luminance calculation from the previous example
        return 4.5; // Placeholder
    }

    getEffectiveBackgroundColor(element) {
        let currentElement = element;
        while (currentElement && currentElement !== document.body) {
            const styles = window.getComputedStyle(currentElement);
            const bgColor = styles.backgroundColor;
            if (bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
                return bgColor;
            }
            currentElement = currentElement.parentElement;
        }
        return '#ffffff';
    }

    getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ').join('.')}`;
        return element.tagName.toLowerCase();
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // CI/CD Integration Methods
    shouldFailBuild() {
        if (!this.config.ciIntegration.failOnViolations) return false;
        
        const summary = this.generateSummary();
        return summary.totalViolations > this.config.ciIntegration.allowedViolations;
    }

    getExitCode() {
        return this.shouldFailBuild() ? 1 : 0;
    }
}

// Jest/Testing Framework Integration
class AccessibilityTestSuite {
    constructor(framework) {
        this.framework = framework;
    }

    // Jest test helpers
    async testPageAccessibility(page) {
        const axeResults = await this.framework.runAxeTests();
        const customResults = await this.framework.runCustomTests();
        
        expect(axeResults.summary.critical).toBe(0);
        expect(axeResults.summary.serious).toBe(0);
        
        return {
            axe: axeResults,
            custom: customResults
        };
    }

    async testComponentAccessibility(component, selector) {
        const element = document.querySelector(selector);
        expect(element).toBeTruthy();
        
        const results = await this.framework.runAxeTests(element);
        expect(results.violations).toHaveLength(0);
        
        return results;
    }

    // Playwright/Puppeteer integration
    async setupBrowserTesting(page) {
        await page.addScriptTag({
            url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
        });
        
        return page.evaluate(() => {
            window.accessibilityFramework = new AccessibilityTestingFramework();
            return true;
        });
    }
}

// Usage Examples
document.addEventListener('DOMContentLoaded', async () => {
    const testingFramework = new AccessibilityTestingFramework({
        debugMode: true,
        testCoverage: { wcagLevel: 'AA' },
        reporting: { format: 'json', includeScreenshots: true }
    });

    // Run comprehensive tests
    const axeResults = await testingFramework.runAxeTests();
    const customResults = await testingFramework.runCustomTests();
    const integrationResults = await testingFramework.runIntegrationTests();
    
    // Generate report
    const report = testingFramework.generateReport('json');
    console.log('Accessibility Test Report:', JSON.parse(report));
    
    // Check if build should fail
    if (testingFramework.shouldFailBuild()) {
        console.error('Accessibility tests failed - build should be rejected');
    }
});

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AccessibilityTestingFramework,
        AccessibilityTestSuite
    };
}
```

## Detailed Code Analysis: Understanding Accessibility Testing Framework

### Multi-Tool Integration

The testing framework integrates multiple accessibility testing approaches:

1. **Axe-core Integration**: Leverages the industry-standard automated testing library
2. **Custom Rule Engine**: Implements domain-specific accessibility tests
3. **Integration Testing**: Tests complex user interactions and workflows
4. **Performance Testing**: Evaluates accessibility impact on performance

### Test Coverage Strategy

The framework implements a **comprehensive coverage strategy**:

1. **Unit Level**: Individual component accessibility validation
2. **Integration Level**: Component interaction and workflow testing
3. **System Level**: Full page and application accessibility validation
4. **Performance Level**: Testing accessibility under load and stress conditions

### Custom Test Implementation

Custom tests focus on areas that automated tools often miss:

1. **Focus Management**: Complex focus flows and restoration patterns
2. **Keyboard Navigation**: Sequential and structural navigation patterns
3. **Dynamic Content**: Live regions and real-time updates
4. **User Experience**: Practical usability beyond compliance

## Real-World Testing Strategies

### Continuous Integration Pipeline
```javascript
// GitHub Actions example
const testAccessibility = async () => {
    const framework = new AccessibilityTestingFramework({
        ciIntegration: {
            failOnViolations: true,
            allowedViolations: 0
        }
    });
    
    const results = await framework.runAxeTests();
    
    if (framework.shouldFailBuild()) {
        process.exit(1);
    }
};
```

### Component Testing Pattern
```javascript
// React Testing Library example
describe('Button Component Accessibility', () => {
    test('should be keyboard accessible', async () => {
        render(<Button>Click me</Button>);
        
        const results = await framework.testComponentAccessibility(
            ButtonComponent, 
            'button'
        );
        
        expect(results.violations).toHaveLength(0);
    });
});
```

### E2E Testing Integration
```javascript
// Playwright example
test('form submission accessibility', async ({ page }) => {
    await page.goto('/contact-form');
    
    const accessibilityViolations = await page.evaluate(async () => {
        const results = await axe.run();
        return results.violations;
    });
    
    expect(accessibilityViolations).toHaveLength(0);
});
```

## Testing Tool Ecosystem

### Automated Tools
1. **Axe-core**: Comprehensive rule engine for WCAG compliance
2. **Pa11y**: Command-line tool for accessibility testing
3. **Lighthouse**: Google's accessibility auditing tool
4. **WAVE**: Web accessibility evaluation tool

### Manual Testing Tools
1. **Screen Readers**: NVDA, JAWS, VoiceOver
2. **Keyboard Testing**: Tab navigation, shortcut keys
3. **Color Testing**: Contrast analyzers, color blindness simulators
4. **Browser Extensions**: axe DevTools, WAVE extension

### Performance and Monitoring
1. **Real User Monitoring**: Track accessibility metrics in production
2. **Synthetic Testing**: Automated accessibility checks on schedules
3. **Error Tracking**: Monitor accessibility-related errors
4. **Analytics**: Usage patterns of assistive technology users

## Summary

Comprehensive accessibility testing requires a multi-faceted approach combining automated tools, custom tests, manual verification, and continuous monitoring. This advanced framework provides:

- **Multi-Tool Integration**: Combines axe-core, custom rules, and integration testing
- **Comprehensive Coverage**: Tests at unit, integration, and system levels
- **CI/CD Integration**: Automated testing in development pipelines
- **Detailed Reporting**: Actionable insights and recommendations
- **Performance Monitoring**: Accessibility impact on application performance
- **Custom Rule Engine**: Domain-specific accessibility requirements

The framework ensures that accessibility is not just a checkbox but an integral part of the development process. By implementing these testing strategies, you create applications that are truly accessible to all users while maintaining development velocity and code quality.

Remember: Automated testing catches obvious violations, but manual testing and real user feedback reveal the true accessibility experience. The best testing strategy combines all approaches for comprehensive coverage.
