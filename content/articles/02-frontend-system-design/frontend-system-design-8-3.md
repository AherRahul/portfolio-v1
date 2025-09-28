---
title: "Focus Management Techniques"
description: "Master advanced focus management patterns for complex UI components. Learn how to create predictable, intuitive focus behavior that enhances user experience and accessibility across all interaction methods."
image: "https://res.cloudinary.com/duojkrgue/image/upload/v1759048378/Portfolio/FrontendSystemDesignCourse/titleImages/51_zcxw7s.png"
publishedAt: "2025-01-13"
is_on_youtube: false
courseName: "02-frontend-system-design"
id: 67
auther_name: "Rahul Aher"
topics:
  - frontend
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048378/Portfolio/FrontendSystemDesignCourse/titleImages/51_zcxw7s.png)


Focus management is the art of controlling where keyboard focus goes and when, ensuring users can navigate through complex interfaces predictably and efficiently. Proper focus management creates a seamless experience that feels natural and intuitive, regardless of how users interact with your application.

## The Theoretical Foundation

### Understanding Focus in Web Applications

Focus in web applications works like a **spotlight on a stage** - only one element can be "lit up" (focused) at a time, and this spotlight moves according to user actions. The browser maintains a **focus order** (tab sequence) that determines where the spotlight moves when users press Tab or Shift+Tab.

In traditional documents, focus moves linearly through focusable elements. However, modern web applications contain complex components like modals, dropdown menus, carousels, and data grids that require **sophisticated focus choreography** to maintain usability.

### The Focus Management Architecture

Think of focus management as a **traffic control system**:

1. **Focus Indicators**: Visual signals showing the current focus location (like traffic lights)
2. **Focus Paths**: Defined routes through the interface (like road networks)
3. **Focus Traps**: Temporary containment areas (like construction zones)
4. **Focus Restoration**: Return routes to previous locations (like GPS recalculation)

### Focus States and Transitions

Focus management involves several states:
- **Natural Focus**: System-determined focus order
- **Managed Focus**: Programmatically controlled focus
- **Trapped Focus**: Focus contained within a component
- **Restored Focus**: Focus returned to a previous element

## Building an Advanced Focus Management System

Let's create a comprehensive focus management framework that handles complex scenarios:

```javascript
class AdvancedFocusManager {
    constructor(options = {}) {
        this.config = {
            // Focus behavior settings
            respectReducedMotion: true,
            announceChanges: true,
            debugMode: false,
            
            // Focus indicator settings
            showFocusRings: true,
            customFocusStyle: null,
            
            // Focus restoration settings
            enableFocusHistory: true,
            historyLimit: 10,
            
            // Performance settings
            debounceDelay: 16, // ~60fps
            
            ...options
        };

        // Focus state management
        this.focusHistory = [];
        this.focusTraps = new Map();
        this.managedComponents = new Set();
        this.customFocusHandlers = new Map();
        this.focusObservers = [];
        
        // Focus restoration points
        this.restorePoints = new Map();
        
        // Performance optimization
        this.debouncedHandlers = new Map();
        
        this.init();
    }

    init() {
        this.setupFocusTracking();
        this.setupFocusIndicators();
        this.setupGlobalKeyHandlers();
        this.setupFocusObserver();
        this.setupCustomFocusStyles();
        this.setupPerformanceOptimizations();
    }

    // Focus Tracking and History Management
    setupFocusTracking() {
        let lastFocusedElement = null;
        let focusChangeTime = Date.now();

        const handleFocusIn = (event) => {
            const element = event.target;
            const currentTime = Date.now();

            // Ignore rapid focus changes (likely programmatic)
            if (currentTime - focusChangeTime < 50 && lastFocusedElement) {
                return;
            }

            // Record focus history
            if (this.config.enableFocusHistory && lastFocusedElement && lastFocusedElement !== element) {
                this.addToFocusHistory(lastFocusedElement, element, 'user');
            }

            lastFocusedElement = element;
            focusChangeTime = currentTime;

            // Notify observers
            this.notifyFocusObservers(element, 'focus');

            // Debug logging
            if (this.config.debugMode) {
                console.log('Focus moved to:', element, {
                    role: element.getAttribute('role'),
                    label: this.getAccessibleName(element),
                    coordinates: this.getElementPosition(element)
                });
            }
        };

        const handleFocusOut = (event) => {
            const element = event.target;
            
            // Check if focus is leaving the document
            setTimeout(() => {
                if (!document.activeElement || document.activeElement === document.body) {
                    this.handleFocusLoss(element);
                }
            }, 0);

            this.notifyFocusObservers(element, 'blur');
        };

        document.addEventListener('focusin', handleFocusIn, true);
        document.addEventListener('focusout', handleFocusOut, true);

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveCurrentFocus();
            } else {
                this.restorePageFocus();
            }
        });
    }

    // Advanced Focus History Management
    addToFocusHistory(fromElement, toElement, trigger) {
        const historyEntry = {
            from: {
                element: fromElement,
                selector: this.getElementSelector(fromElement),
                position: this.getElementPosition(fromElement),
                timestamp: Date.now()
            },
            to: {
                element: toElement,
                selector: this.getElementSelector(toElement),
                position: this.getElementPosition(toElement)
            },
            trigger, // 'user', 'programmatic', 'trap', 'restore'
            context: this.getCurrentContext()
        };

        this.focusHistory.push(historyEntry);

        // Maintain history limit
        if (this.focusHistory.length > this.config.historyLimit) {
            this.focusHistory.shift();
        }
    }

    // Enhanced Focus Trap System
    createFocusTrap(container, options = {}) {
        const trapConfig = {
            // Behavior options
            initialFocus: options.initialFocus || 'first',
            returnFocus: options.returnFocus !== false,
            allowOutsideClick: options.allowOutsideClick || false,
            
            // Escape behavior
            escapeDeactivates: options.escapeDeactivates !== false,
            clickOutsideDeactivates: options.clickOutsideDeactivates || false,
            
            // Advanced options
            preventScroll: options.preventScroll || false,
            setReturnFocus: options.setReturnFocus,
            
            ...options
        };

        const focusableElements = this.getFocusableElements(container);
        
        if (focusableElements.length === 0) {
            console.warn('Focus trap created with no focusable elements:', container);
            return this.createEmptyFocusTrap(container, trapConfig);
        }

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        let previouslyFocused = document.activeElement;

        const trap = {
            container,
            config: trapConfig,
            isActive: false,
            
            // Core trap functionality
            handleKeyDown: (event) => {
                if (event.key === 'Tab') {
                    this.handleTrapTabbing(event, focusableElements, firstFocusable, lastFocusable);
                } else if (event.key === 'Escape' && trapConfig.escapeDeactivates) {
                    event.preventDefault();
                    trap.deactivate();
                }
            },

            handleClickOutside: (event) => {
                if (trapConfig.clickOutsideDeactivates && 
                    !container.contains(event.target) && 
                    !trapConfig.allowOutsideClick) {
                    trap.deactivate();
                }
            },

            // Activation
            activate: (focusOptions = {}) => {
                if (trap.isActive) return;

                // Store previous focus for restoration
                previouslyFocused = trapConfig.setReturnFocus || document.activeElement;
                
                // Add event listeners
                container.addEventListener('keydown', trap.handleKeyDown);
                
                if (trapConfig.clickOutsideDeactivates) {
                    document.addEventListener('mousedown', trap.handleClickOutside, true);
                }

                // Set initial focus
                this.setInitialFocus(container, trapConfig.initialFocus, focusOptions);
                
                trap.isActive = true;
                this.focusTraps.set(container, trap);

                // Announce activation
                if (this.config.announceChanges) {
                    this.announceToScreenReader('Dialog opened, press Escape to close', 'assertive');
                }

                // Debug logging
                if (this.config.debugMode) {
                    console.log('Focus trap activated:', container);
                }
            },

            // Deactivation
            deactivate: () => {
                if (!trap.isActive) return;

                // Remove event listeners
                container.removeEventListener('keydown', trap.handleKeyDown);
                document.removeEventListener('mousedown', trap.handleClickOutside, true);

                // Restore focus
                if (trapConfig.returnFocus && previouslyFocused && document.contains(previouslyFocused)) {
                    this.focusElement(previouslyFocused, { 
                        preventScroll: trapConfig.preventScroll,
                        source: 'trap-deactivation'
                    });
                }

                trap.isActive = false;
                this.focusTraps.delete(container);

                // Announce deactivation
                if (this.config.announceChanges) {
                    this.announceToScreenReader('Dialog closed', 'assertive');
                }

                // Debug logging
                if (this.config.debugMode) {
                    console.log('Focus trap deactivated:', container);
                }
            },

            // Update trap when content changes
            update: () => {
                if (!trap.isActive) return;
                
                const newFocusableElements = this.getFocusableElements(container);
                focusableElements.splice(0, focusableElements.length, ...newFocusableElements);
                
                // Update first and last elements
                if (newFocusableElements.length > 0) {
                    Object.assign(trap, {
                        firstFocusable: newFocusableElements[0],
                        lastFocusable: newFocusableElements[newFocusableElements.length - 1]
                    });
                }
            },

            // Check if element is within trap
            contains: (element) => {
                return container.contains(element) || container === element;
            }
        };

        return trap;
    }

    // Tab Navigation Handler for Traps
    handleTrapTabbing(event, focusableElements, firstFocusable, lastFocusable) {
        const currentElement = document.activeElement;
        const currentIndex = focusableElements.indexOf(currentElement);

        if (event.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex <= 0 || currentElement === firstFocusable) {
                event.preventDefault();
                this.focusElement(lastFocusable, { source: 'trap-tab' });
            }
        } else {
            // Tab (forward)
            if (currentIndex === -1 || currentIndex >= focusableElements.length - 1 || currentElement === lastFocusable) {
                event.preventDefault();
                this.focusElement(firstFocusable, { source: 'trap-tab' });
            }
        }
    }

    // Enhanced Focus Setting with Options
    focusElement(element, options = {}) {
        if (!element || !document.contains(element)) {
            console.warn('Cannot focus element:', element);
            return false;
        }

        const config = {
            preventScroll: options.preventScroll || false,
            source: options.source || 'programmatic',
            announce: options.announce !== false,
            ...options
        };

        try {
            // Record the focus change
            if (config.source !== 'user') {
                this.addToFocusHistory(document.activeElement, element, config.source);
            }

            // Focus the element
            if (config.preventScroll) {
                element.focus({ preventScroll: true });
            } else {
                element.focus();
                
                // Smooth scroll to element if needed
                if (this.isElementOutsideViewport(element) && !this.config.respectReducedMotion) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }

            // Announce focus change if configured
            if (config.announce && this.config.announceChanges) {
                const announcement = this.createFocusAnnouncement(element);
                if (announcement) {
                    this.announceToScreenReader(announcement, 'polite');
                }
            }

            return true;
        } catch (error) {
            console.error('Error focusing element:', error);
            return false;
        }
    }

    // Smart Focus Restoration
    restoreLastFocus(options = {}) {
        const config = {
            fallbackToBody: true,
            skipTraps: false,
            ...options
        };

        // Get the most recent valid focus target
        for (let i = this.focusHistory.length - 1; i >= 0; i--) {
            const entry = this.focusHistory[i];
            const element = entry.from.element;

            // Skip if element is no longer in DOM
            if (!document.contains(element)) continue;

            // Skip if element is inside an active focus trap
            if (!config.skipTraps && this.isInsideActiveTrap(element)) continue;

            // Skip if element is not focusable
            if (!this.isElementFocusable(element)) continue;

            return this.focusElement(element, { 
                source: 'restore',
                ...options 
            });
        }

        // Fallback to body if no valid target found
        if (config.fallbackToBody) {
            document.body.focus();
            return true;
        }

        return false;
    }

    // Component-Specific Focus Management
    registerComponent(component, focusHandler) {
        if (typeof focusHandler !== 'object') {
            throw new Error('Focus handler must be an object with focus management methods');
        }

        const requiredMethods = ['handleFocusIn', 'handleFocusOut', 'handleKeyDown'];
        const missingMethods = requiredMethods.filter(method => 
            typeof focusHandler[method] !== 'function'
        );

        if (missingMethods.length > 0) {
            throw new Error(`Focus handler missing required methods: ${missingMethods.join(', ')}`);
        }

        this.managedComponents.add(component);
        this.customFocusHandlers.set(component, focusHandler);

        // Setup component event listeners
        component.addEventListener('focusin', focusHandler.handleFocusIn);
        component.addEventListener('focusout', focusHandler.handleFocusOut);
        component.addEventListener('keydown', focusHandler.handleKeyDown);

        return () => {
            // Cleanup function
            component.removeEventListener('focusin', focusHandler.handleFocusIn);
            component.removeEventListener('focusout', focusHandler.handleFocusOut);
            component.removeEventListener('keydown', focusHandler.handleKeyDown);
            
            this.managedComponents.delete(component);
            this.customFocusHandlers.delete(component);
        };
    }

    // Advanced Focus Indicators
    setupFocusIndicators() {
        if (!this.config.showFocusRings) return;

        const style = document.createElement('style');
        style.id = 'advanced-focus-styles';
        
        const focusStyles = this.config.customFocusStyle || this.getDefaultFocusStyles();
        style.textContent = focusStyles;
        
        document.head.appendChild(style);

        // Dynamic focus ring enhancement
        this.setupDynamicFocusRings();
    }

    getDefaultFocusStyles() {
        return `
            /* Enhanced focus indicators */
            :focus {
                outline: 2px solid #4285f4;
                outline-offset: 2px;
                border-radius: 2px;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                :focus {
                    outline: 3px solid currentColor;
                    outline-offset: 3px;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: no-preference) {
                :focus {
                    transition: outline-color 0.2s ease, box-shadow 0.2s ease;
                }
            }

            /* Different focus styles for different input methods */
            .focus-via-keyboard :focus {
                outline: 2px solid #4285f4;
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.2);
            }

            .focus-via-mouse :focus {
                outline: 1px solid #4285f4;
                outline-offset: 1px;
            }

            .focus-via-touch :focus {
                outline: 3px solid #4285f4;
                outline-offset: 3px;
            }

            /* Component-specific focus styles */
            button:focus,
            [role="button"]:focus {
                background-color: rgba(66, 133, 244, 0.1);
                outline: 2px solid #4285f4;
                outline-offset: 2px;
            }

            input:focus,
            textarea:focus,
            select:focus {
                border-color: #4285f4;
                box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
                outline: none;
            }

            [role="tab"]:focus {
                background-color: rgba(66, 133, 244, 0.1);
                outline: 2px solid #4285f4;
                outline-offset: -2px;
            }

            [role="gridcell"]:focus,
            [role="cell"]:focus {
                background-color: rgba(66, 133, 244, 0.1);
                outline: 2px solid #4285f4;
                outline-offset: -1px;
            }

            /* Skip link focus */
            .skip-link:focus {
                position: fixed !important;
                top: 10px !important;
                left: 10px !important;
                z-index: 10000 !important;
                background: #000 !important;
                color: #fff !important;
                padding: 8px 16px !important;
                text-decoration: none !important;
                border-radius: 4px !important;
                outline: 2px solid #4285f4 !important;
                outline-offset: 2px !important;
            }
        `;
    }

    // Dynamic Focus Ring Enhancement
    setupDynamicFocusRings() {
        let lastInputMethod = 'keyboard';

        // Track input method
        document.addEventListener('mousedown', () => {
            lastInputMethod = 'mouse';
            document.body.className = document.body.className.replace(/focus-via-\w+/g, '') + ' focus-via-mouse';
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
                lastInputMethod = 'keyboard';
                document.body.className = document.body.className.replace(/focus-via-\w+/g, '') + ' focus-via-keyboard';
            }
        });

        document.addEventListener('touchstart', () => {
            lastInputMethod = 'touch';
            document.body.className = document.body.className.replace(/focus-via-\w+/g, '') + ' focus-via-touch';
        });

        // Initial state
        document.body.classList.add('focus-via-keyboard');
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Debounced focus change handler
        this.debouncedHandlers.set('focus-change', this.debounce((element) => {
            this.handleOptimizedFocusChange(element);
        }, this.config.debounceDelay));

        // Throttled scroll handler for focus visibility
        this.debouncedHandlers.set('scroll', this.throttle((event) => {
            this.handleFocusVisibilityChange();
        }, this.config.debounceDelay));

        window.addEventListener('scroll', this.debouncedHandlers.get('scroll'), { passive: true });
    }

    // Advanced Component Examples

    // Roving Tabindex Implementation
    createRovingTabindex(container, options = {}) {
        const config = {
            selector: '[role="option"], [role="tab"], [role="menuitem"]',
            orientation: 'horizontal', // 'horizontal', 'vertical', 'both'
            wrap: true,
            homeEndKeys: true,
            ...options
        };

        const items = Array.from(container.querySelectorAll(config.selector));
        let currentIndex = 0;

        // Set initial tabindex values
        items.forEach((item, index) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        const navigate = (direction) => {
            items[currentIndex].setAttribute('tabindex', '-1');
            
            let newIndex = currentIndex;
            
            switch (direction) {
                case 'next':
                    newIndex = config.wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
                    break;
                case 'previous':
                    newIndex = config.wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
                    break;
                case 'first':
                    newIndex = 0;
                    break;
                case 'last':
                    newIndex = items.length - 1;
                    break;
            }

            currentIndex = newIndex;
            items[currentIndex].setAttribute('tabindex', '0');
            this.focusElement(items[currentIndex], { source: 'roving-tabindex' });
        };

        const keyHandler = (event) => {
            let handled = false;
            
            switch (event.key) {
                case 'ArrowRight':
                    if (config.orientation === 'horizontal' || config.orientation === 'both') {
                        navigate('next');
                        handled = true;
                    }
                    break;
                case 'ArrowLeft':
                    if (config.orientation === 'horizontal' || config.orientation === 'both') {
                        navigate('previous');
                        handled = true;
                    }
                    break;
                case 'ArrowDown':
                    if (config.orientation === 'vertical' || config.orientation === 'both') {
                        navigate('next');
                        handled = true;
                    }
                    break;
                case 'ArrowUp':
                    if (config.orientation === 'vertical' || config.orientation === 'both') {
                        navigate('previous');
                        handled = true;
                    }
                    break;
                case 'Home':
                    if (config.homeEndKeys) {
                        navigate('first');
                        handled = true;
                    }
                    break;
                case 'End':
                    if (config.homeEndKeys) {
                        navigate('last');
                        handled = true;
                    }
                    break;
            }

            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        container.addEventListener('keydown', keyHandler);

        // Update current index when items are focused externally
        items.forEach((item, index) => {
            item.addEventListener('focus', () => {
                if (currentIndex !== index) {
                    items[currentIndex].setAttribute('tabindex', '-1');
                    currentIndex = index;
                    item.setAttribute('tabindex', '0');
                }
            });
        });

        return {
            navigate,
            getCurrentIndex: () => currentIndex,
            getCurrentItem: () => items[currentIndex],
            update: () => {
                // Refresh items list
                const newItems = Array.from(container.querySelectorAll(config.selector));
                items.splice(0, items.length, ...newItems);
                
                // Ensure current index is valid
                if (currentIndex >= items.length) {
                    currentIndex = Math.max(0, items.length - 1);
                }
                
                // Reset tabindex values
                items.forEach((item, index) => {
                    item.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
                });
            },
            destroy: () => {
                container.removeEventListener('keydown', keyHandler);
                items.forEach(item => {
                    item.removeAttribute('tabindex');
                });
            }
        };
    }

    // Utility Methods
    getFocusableElements(container = document) {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]',
            'details > summary',
            'audio[controls]',
            'video[controls]'
        ].join(', ');

        return Array.from(container.querySelectorAll(focusableSelectors))
            .filter(element => this.isElementFocusable(element));
    }

    isElementFocusable(element) {
        // Check if element is visible and not disabled
        if (!element || element.disabled) return false;
        
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        
        // Check if element has negative tabindex
        const tabindex = element.getAttribute('tabindex');
        if (tabindex === '-1') return false;
        
        return true;
    }

    isElementOutsideViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom < 0 ||
            rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.top > window.innerHeight
        );
    }

    getAccessibleName(element) {
        // Implementation similar to previous examples
        return element.getAttribute('aria-label') || 
               element.textContent?.trim() || 
               element.getAttribute('title') || 
               'unlabeled element';
    }

    getCurrentContext() {
        return {
            url: window.location.href,
            activeTraps: this.focusTraps.size,
            managedComponents: this.managedComponents.size,
            timestamp: Date.now()
        };
    }

    // Helper methods for debouncing and throttling
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Debug and monitoring methods
    getDebugInfo() {
        return {
            focusHistory: this.focusHistory.length,
            activeTraps: Array.from(this.focusTraps.keys()),
            managedComponents: this.managedComponents.size,
            currentFocus: document.activeElement,
            accessibleName: this.getAccessibleName(document.activeElement)
        };
    }
}

// Enhanced Modal Component with Advanced Focus Management
class AccessibleModal {
    constructor(element, options = {}) {
        this.element = element;
        this.focusManager = new AdvancedFocusManager();
        this.focusTrap = null;
        this.options = {
            closeOnEscape: true,
            closeOnOverlayClick: true,
            returnFocus: true,
            initialFocus: 'first',
            ...options
        };

        this.init();
    }

    init() {
        this.setupModal();
        this.setupTriggers();
        this.focusTrap = this.focusManager.createFocusTrap(this.element, {
            initialFocus: this.options.initialFocus,
            returnFocus: this.options.returnFocus,
            escapeDeactivates: this.options.closeOnEscape,
            clickOutsideDeactivates: this.options.closeOnOverlayClick
        });
    }

    setupModal() {
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');
        this.element.setAttribute('aria-hidden', 'true');
        
        if (!this.element.hasAttribute('aria-labelledby')) {
            const title = this.element.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
            if (title) {
                const titleId = title.id || `modal-title-${Date.now()}`;
                title.id = titleId;
                this.element.setAttribute('aria-labelledby', titleId);
            }
        }
    }

    open() {
        this.element.style.display = 'block';
        this.element.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Activate focus trap
        this.focusTrap.activate();
        
        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent('modal:opened', {
            detail: { modal: this }
        }));
    }

    close() {
        this.element.style.display = 'none';
        this.element.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Deactivate focus trap
        this.focusTrap.deactivate();
        
        // Dispatch custom event
        this.element.dispatchEvent(new CustomEvent('modal:closed', {
            detail: { modal: this }
        }));
    }
}

// Usage Example
document.addEventListener('DOMContentLoaded', () => {
    const focusManager = new AdvancedFocusManager({
        debugMode: window.location.search.includes('debug=focus'),
        announceChanges: true,
        showFocusRings: true
    });

    // Setup modals
    document.querySelectorAll('[data-modal]').forEach(modalElement => {
        const modal = new AccessibleModal(modalElement);
        
        // Setup trigger buttons
        const triggerId = modalElement.getAttribute('data-modal');
        const triggers = document.querySelectorAll(`[data-modal-trigger="${triggerId}"]`);
        
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => modal.open());
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    modal.open();
                }
            });
        });
    });

    // Setup roving tabindex for toolbars
    document.querySelectorAll('[role="toolbar"]').forEach(toolbar => {
        focusManager.createRovingTabindex(toolbar, {
            orientation: 'horizontal',
            wrap: true
        });
    });

    // Setup roving tabindex for tab lists
    document.querySelectorAll('[role="tablist"]').forEach(tablist => {
        focusManager.createRovingTabindex(tablist, {
            orientation: 'horizontal',
            wrap: false,
            homeEndKeys: true
        });
    });
});
```

## Detailed Code Analysis: Understanding Advanced Focus Management

### Focus History and Tracking

The focus tracking system works like a **navigation GPS**:

1. **History Recording**: Every focus change is recorded with context (user-initiated vs programmatic)
2. **Smart Filtering**: Rapid focus changes (likely programmatic) are filtered out to avoid noise
3. **Context Awareness**: Each history entry includes surrounding context for better restoration decisions

### Advanced Focus Trap System

The enhanced focus trap implementation provides:

1. **Flexible Configuration**: Multiple options for initial focus, return behavior, and interaction patterns
2. **Dynamic Updates**: Ability to refresh trap contents when DOM changes
3. **Performance Optimization**: Event delegation and efficient DOM queries
4. **Error Handling**: Graceful degradation when no focusable elements exist

### Roving Tabindex Pattern

The roving tabindex system creates **arrow-key navigation** within component groups:

1. **Single Tab Stop**: Only one item in the group is in the tab sequence
2. **Arrow Navigation**: Arrow keys move focus between items within the group
3. **Memory**: The component remembers which item was last focused
4. **Dynamic Updates**: Handles content changes gracefully

## Real-World Implementation Patterns

### Modal Dialog Focus Flow
```javascript
// Complete modal focus management
const modalFocusFlow = {
    open: () => {
        // 1. Store current focus
        // 2. Move to modal
        // 3. Set initial focus
        // 4. Activate trap
    },
    close: () => {
        // 1. Deactivate trap
        // 2. Restore previous focus
        // 3. Announce closure
    }
};
```

### Complex Form Navigation
```javascript
// Multi-step form focus management
const formFocusFlow = {
    nextStep: () => {
        // 1. Validate current step
        // 2. Move to next step
        // 3. Focus first field
        // 4. Update progress announcement
    },
    previousStep: () => {
        // 1. Move to previous step
        // 2. Restore last focused field
        // 3. Update progress announcement
    }
};
```

## Focus Management Testing

### Manual Testing Checklist
- Tab order is logical and matches visual layout
- Focus indicators are clearly visible
- Focus traps work correctly in modals
- Arrow key navigation works in components
- Focus restoration works after modal closure
- Skip links function properly

### Automated Testing
```javascript
// Test focus management
describe('Focus Management', () => {
    test('should maintain focus order', () => {
        const elements = getFocusableElements();
        elements.forEach((element, index) => {
            element.focus();
            expect(document.activeElement).toBe(element);
        });
    });

    test('should trap focus in modals', () => {
        const modal = createModal();
        const trap = createFocusTrap(modal);
        trap.activate();
        
        // Test that focus stays within modal
        simulateTabKey();
        expect(modal.contains(document.activeElement)).toBe(true);
    });
});
```

## Summary

Advanced focus management is essential for creating accessible, user-friendly web applications. This comprehensive framework provides:

- **Smart Focus Tracking**: Intelligent history and context-aware restoration
- **Advanced Focus Traps**: Flexible, configurable containment for modal dialogs
- **Component Integration**: Support for complex navigation patterns like roving tabindex
- **Performance Optimization**: Debounced event handling and efficient DOM queries
- **Visual Enhancement**: Input-method-aware focus indicators
- **Debug Support**: Comprehensive logging and monitoring tools

The framework ensures that focus moves predictably and logically through your interface, creating a seamless experience for keyboard users while maintaining excellent usability for all interaction methods.

Remember: Good focus management is invisible to users when done right - it should feel natural and predictable, never confusing or jarring. Focus on creating consistent patterns that users can learn and rely on throughout your application.
