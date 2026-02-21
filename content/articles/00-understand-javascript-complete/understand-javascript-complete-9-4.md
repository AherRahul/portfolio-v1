---
title: Strategy Pattern & State Pattern
description: Master behavioral design patterns for managing algorithms and
  state-dependent behavior. Learn to build flexible, maintainable systems that
  can change behavior dynamically at runtime.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: Strategy Pattern - GoF Design Patterns
    type: reference
    url: https://en.wikipedia.org/wiki/Strategy_pattern
    description: Classical Strategy pattern definition and theory
  - title: State Pattern - GoF Design Patterns
    type: reference
    url: https://en.wikipedia.org/wiki/State_pattern
    description: State pattern for state-dependent behavior
  - title: State Machines in JavaScript
    type: article
    url: https://statecharts.github.io/
    description: Advanced state machine concepts and implementations
  - title: Behavioral Design Patterns
    type: article
    url: https://refactoring.guru/design-patterns/behavioral-patterns
    description: Overview of behavioral patterns and their applications
published: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811626/Portfolio/javaScriptCourse/images/all%20title%20images/40_fhahlc.png)

Strategy Pattern & State Pattern – Dynamic Behavior Management
=============================================================

Imagine you're designing a **sophisticated navigation system** 🗺️ for a modern vehicle that can adapt to different situations:

- **Multiple Route Algorithms** 🛣️ - Different strategies for finding the best path: fastest route, scenic route, fuel-efficient route, avoiding tolls
- **Dynamic Algorithm Selection** 🔄 - Switch between strategies based on conditions: traffic, weather, time of day, user preferences  
- **Contextual Behavior** 📍 - Same navigation request produces different results based on current strategy
- **State-Dependent Operations** 🚦 - Vehicle behavior changes based on current state: parked, driving, emergency mode, maintenance mode
- **Automatic Transitions** ⚡ - System automatically transitions between states based on conditions and events
- **State-Specific Actions** 🎯 - Each state enables different operations and restricts others appropriately

**Strategy and State patterns work exactly like this adaptive navigation system.** They provide sophisticated approaches to managing dynamic behavior:

- **Strategy Pattern** - Encapsulates interchangeable algorithms and makes them selectable at runtime
- **State Pattern** - Allows objects to alter their behavior when their internal state changes  
- **Behavioral Flexibility** - Change how objects behave without changing their structure
- **Runtime Adaptability** - Modify behavior based on conditions, user input, or system state
- **Clean Separation** - Keep different behaviors organized and independent
- **Extensible Design** - Easy to add new strategies or states without modifying existing code

Understanding these behavioral patterns is essential for building applications that need to adapt their behavior dynamically - from game AI and workflow systems to user interfaces and business rule engines.

## The Theoretical Foundation: Behavioral Patterns and Dynamic Polymorphism 📐

### Understanding Behavioral Design Patterns

**Behavioral design patterns focus on communication between objects and the assignment of responsibilities.** They describe not just patterns of objects or classes but also the patterns of communication between them.

**Core Behavioral Pattern Concepts:**

1. **Encapsulation of Behavior**: Different algorithms or behaviors are encapsulated in separate objects
2. **Dynamic Behavior Selection**: The specific behavior can be chosen at runtime
3. **Loose Coupling**: The context using the behavior doesn't depend on specific implementations
4. **Single Responsibility**: Each behavior class has one reason to change
5. **Open/Closed Principle**: Easy to add new behaviors without modifying existing code

**Why Behavioral Patterns Matter:**
- **Maintainability**: Changes to one behavior don't affect others
- **Testability**: Each behavior can be tested in isolation
- **Reusability**: Behaviors can be reused in different contexts
- **Extensibility**: New behaviors can be added easily

### Strategy Pattern Theory: Algorithm Encapsulation

**The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.** It lets the algorithm vary independently from clients that use it.

**Key Strategy Pattern Concepts:**

1. **Strategy Interface**: Common interface for all concrete strategies
2. **Concrete Strategies**: Specific implementations of different algorithms
3. **Context**: The class that uses a Strategy object
4. **Runtime Selection**: Strategy can be selected or changed at runtime

**Strategy Pattern vs Inheritance:**
- **Inheritance**: "IS-A" relationship, compile-time binding
- **Strategy**: "HAS-A" relationship, runtime binding
- **Flexibility**: Strategy allows changing behavior without changing class hierarchy

### State Pattern Theory: State-Dependent Behavior

**The State Pattern allows an object to alter its behavior when its internal state changes.** The object appears to change its class.

**State Pattern Foundations:**

1. **Finite State Machines**: Mathematical model of computation with finite states
2. **State Transitions**: Rules governing how states change
3. **State-Dependent Behavior**: Different states enable different operations
4. **State Encapsulation**: Each state's behavior is encapsulated in a separate class

**State Machine Theory:**
- **States**: Distinct modes of operation
- **Transitions**: Triggers that cause state changes
- **Actions**: What happens during transitions or while in states
- **Guards**: Conditions that must be met for transitions

### The Psychology of Behavioral Patterns

**These patterns mirror how humans naturally organize complex behaviors:**

1. **Strategy Selection**: We choose different approaches based on context (like choosing transportation)
2. **State Awareness**: We behave differently based on our current situation (formal meeting vs casual conversation)
3. **Context Switching**: We adapt our behavior to match our environment
4. **Learning and Adaptation**: We can add new strategies and states based on experience

This natural alignment makes these patterns intuitive and powerful for modeling real-world systems.

## The Problem: Rigid Behavior and Complex Conditionals 😤

### Monolithic Behavior Implementation

**Without behavioral patterns, complex behavior logic becomes a maintenance nightmare:**

```javascript
// Monolithic approach - everything in one place
class PaymentProcessor {
    processPayment(amount, method, cardNumber, expiryDate, cvv, paypalEmail, bankAccount) {
        // Complex conditional logic mixed together
        if (method === 'credit-card') {
            // Credit card validation
            if (!this.isValidCardNumber(cardNumber)) {
                throw new Error('Invalid card number');
            }
            if (!this.isValidExpiryDate(expiryDate)) {
                throw new Error('Invalid expiry date');
            }
            if (!this.isValidCVV(cvv)) {
                throw new Error('Invalid CVV');
            }
            
            // Credit card processing logic
            const token = this.tokenizeCard(cardNumber, expiryDate, cvv);
            const result = this.chargeCreditCard(token, amount);
            
            if (result.success) {
                this.logTransaction('credit-card', amount, result.transactionId);
                this.sendReceiptEmail('credit-card', amount);
                return { success: true, transactionId: result.transactionId };
            } else {
                throw new Error(`Credit card payment failed: ${result.error}`);
            }
            
        } else if (method === 'paypal') {
            // PayPal validation
            if (!this.isValidEmail(paypalEmail)) {
                throw new Error('Invalid PayPal email');
            }
            
            // PayPal processing logic
            const paypalResult = this.processPayPal(paypalEmail, amount);
            
            if (paypalResult.success) {
                this.logTransaction('paypal', amount, paypalResult.transactionId);
                this.sendReceiptEmail('paypal', amount);
                return { success: true, transactionId: paypalResult.transactionId };
            } else {
                throw new Error(`PayPal payment failed: ${paypalResult.error}`);
            }
            
        } else if (method === 'bank-transfer') {
            // Bank transfer validation
            if (!this.isValidBankAccount(bankAccount)) {
                throw new Error('Invalid bank account');
            }
            
            // Bank transfer processing logic
            const bankResult = this.processBankTransfer(bankAccount, amount);
            
            if (bankResult.success) {
                this.logTransaction('bank-transfer', amount, bankResult.transactionId);
                this.sendReceiptEmail('bank-transfer', amount);
                return { success: true, transactionId: bankResult.transactionId };
            } else {
                throw new Error(`Bank transfer failed: ${bankResult.error}`);
            }
            
        } else {
            throw new Error(`Unsupported payment method: ${method}`);
        }
    }
    
    // More methods for validation, processing, etc...
    // This class becomes huge and hard to maintain
}

// Problems with this approach:
// 1. Single Responsibility Principle violated - class does too much
// 2. Open/Closed Principle violated - must modify class to add new payment methods
// 3. Hard to test - can't test payment methods in isolation
// 4. Complex conditional logic is hard to follow
// 5. Code duplication (logging, email sending, etc.)
// 6. Method signature becomes unwieldy with many parameters
// 7. Adding new payment methods requires understanding entire class
```

### State-Dependent Behavior Without State Pattern

```javascript
// Complex state management without State Pattern
class MediaPlayer {
    constructor() {
        this.state = 'stopped'; // 'stopped', 'playing', 'paused'
        this.currentTrack = null;
        this.volume = 50;
        this.position = 0;
    }
    
    play(track = null) {
        // Complex state-dependent logic
        if (this.state === 'stopped') {
            if (track) {
                this.currentTrack = track;
                this.position = 0;
            } else if (!this.currentTrack) {
                throw new Error('No track to play');
            }
            this.state = 'playing';
            this.startPlayback();
            
        } else if (this.state === 'paused') {
            this.state = 'playing';
            this.resumePlayback();
            
        } else if (this.state === 'playing') {
            if (track && track !== this.currentTrack) {
                this.stopPlayback();
                this.currentTrack = track;
                this.position = 0;
                this.startPlayback();
            }
            // If same track, do nothing
            
        } else {
            throw new Error(`Invalid state: ${this.state}`);
        }
    }
    
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.pausePlayback();
        } else if (this.state === 'paused') {
            // Already paused, do nothing
        } else if (this.state === 'stopped') {
            throw new Error('Cannot pause when stopped');
        }
    }
    
    stop() {
        if (this.state === 'playing' || this.state === 'paused') {
            this.state = 'stopped';
            this.position = 0;
            this.stopPlayback();
        } else if (this.state === 'stopped') {
            // Already stopped, do nothing
        }
    }
    
    next() {
        // Complex logic for each state
        if (this.state === 'stopped') {
            throw new Error('Cannot go to next track when stopped');
        } else if (this.state === 'playing') {
            this.stopPlayback();
            const nextTrack = this.getNextTrack();
            if (nextTrack) {
                this.currentTrack = nextTrack;
                this.position = 0;
                this.startPlayback();
            } else {
                this.state = 'stopped';
            }
        } else if (this.state === 'paused') {
            const nextTrack = this.getNextTrack();
            if (nextTrack) {
                this.currentTrack = nextTrack;
                this.position = 0;
                // Stay in paused state
            } else {
                this.state = 'stopped';
            }
        }
    }
    
    // Many more methods with complex state-dependent logic...
    // Each method needs to handle all possible states
    // Adding new states requires modifying every method
}

// Problems:
// 1. Each method contains complex conditional logic for all states
// 2. State transitions are scattered throughout the class
// 3. Adding new states requires modifying every method
// 4. State-dependent behavior is not encapsulated
// 5. Hard to visualize and validate state transitions
// 6. Error-prone - easy to forget to handle all states in all methods
```

## Strategy Pattern Implementation 🎯

### Basic Strategy Pattern

**The Strategy Pattern encapsulates algorithms in separate objects** and makes them interchangeable at runtime.

```javascript
// Strategy Pattern implementation

// Strategy interface (implicit in JavaScript)
class PaymentStrategy {
    validate(paymentData) {
        throw new Error('Subclasses must implement validate method');
    }
    
    processPayment(amount, paymentData) {
        throw new Error('Subclasses must implement processPayment method');
    }
    
    getPaymentType() {
        throw new Error('Subclasses must implement getPaymentType method');
    }
}

// Concrete Strategy implementations
class CreditCardStrategy extends PaymentStrategy {
    validate(paymentData) {
        const { cardNumber, expiryDate, cvv, holderName } = paymentData;
        
        const errors = [];
        
        if (!this.isValidCardNumber(cardNumber)) {
            errors.push('Invalid card number');
        }
        
        if (!this.isValidExpiryDate(expiryDate)) {
            errors.push('Invalid expiry date');
        }
        
        if (!this.isValidCVV(cvv)) {
            errors.push('Invalid CVV');
        }
        
        if (!holderName || holderName.trim().length < 2) {
            errors.push('Invalid cardholder name');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    async processPayment(amount, paymentData) {
        console.log('Processing credit card payment...');
        
        // Tokenize sensitive card data
        const token = await this.tokenizeCard(paymentData);
        
        // Process payment with tokenized data
        const result = await this.chargeCreditCard(token, amount);
        
        return {
            success: result.success,
            transactionId: result.transactionId,
            method: 'credit-card',
            amount: amount,
            timestamp: new Date(),
            details: {
                lastFourDigits: paymentData.cardNumber.slice(-4),
                cardType: this.getCardType(paymentData.cardNumber)
            }
        };
    }
    
    getPaymentType() {
        return 'credit-card';
    }
    
    // Helper methods specific to credit card processing
    isValidCardNumber(cardNumber) {
        // Luhn algorithm validation
        const digits = cardNumber.replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(digits)) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    isValidExpiryDate(expiryDate) {
        const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;
        
        const month = parseInt(match[1]);
        const year = parseInt('20' + match[2]);
        
        if (month < 1 || month > 12) return false;
        
        const now = new Date();
        const expiry = new Date(year, month - 1);
        
        return expiry > now;
    }
    
    isValidCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }
    
    async tokenizeCard(paymentData) {
        // Simulate tokenization process
        return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    async chargeCreditCard(token, amount) {
        // Simulate credit card charging
        await this.delay(1000);
        return {
            success: Math.random() > 0.1, // 90% success rate
            transactionId: `cc_${Date.now()}`,
            error: Math.random() > 0.9 ? 'Insufficient funds' : null
        };
    }
    
    getCardType(cardNumber) {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(cardNumber)) {
                return type;
            }
        }
        
        return 'unknown';
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class PayPalStrategy extends PaymentStrategy {
    validate(paymentData) {
        const { email, password } = paymentData;
        const errors = [];
        
        if (!this.isValidEmail(email)) {
            errors.push('Invalid email address');
        }
        
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    async processPayment(amount, paymentData) {
        console.log('Processing PayPal payment...');
        
        // Authenticate with PayPal
        const authResult = await this.authenticatePayPal(paymentData);
        
        if (!authResult.success) {
            throw new Error('PayPal authentication failed');
        }
        
        // Process payment
        const result = await this.processPayPalPayment(authResult.token, amount);
        
        return {
            success: result.success,
            transactionId: result.transactionId,
            method: 'paypal',
            amount: amount,
            timestamp: new Date(),
            details: {
                email: paymentData.email,
                paypalTransactionId: result.paypalId
            }
        };
    }
    
    getPaymentType() {
        return 'paypal';
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    async authenticatePayPal(paymentData) {
        // Simulate PayPal authentication
        await this.delay(800);
        return {
            success: Math.random() > 0.05, // 95% success rate
            token: `paypal_token_${Date.now()}`,
            error: Math.random() > 0.95 ? 'Invalid credentials' : null
        };
    }
    
    async processPayPalPayment(token, amount) {
        // Simulate PayPal payment processing
        await this.delay(1200);
        return {
            success: Math.random() > 0.08, // 92% success rate
            transactionId: `pp_${Date.now()}`,
            paypalId: `PAY-${Math.random().toString(36).substr(2, 20).toUpperCase()}`,
            error: Math.random() > 0.92 ? 'Payment declined by PayPal' : null
        };
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class BankTransferStrategy extends PaymentStrategy {
    validate(paymentData) {
        const { routingNumber, accountNumber, accountHolderName } = paymentData;
        const errors = [];
        
        if (!this.isValidRoutingNumber(routingNumber)) {
            errors.push('Invalid routing number');
        }
        
        if (!this.isValidAccountNumber(accountNumber)) {
            errors.push('Invalid account number');
        }
        
        if (!accountHolderName || accountHolderName.trim().length < 2) {
            errors.push('Invalid account holder name');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    async processPayment(amount, paymentData) {
        console.log('Processing bank transfer payment...');
        
        // Verify bank account
        const verificationResult = await this.verifyBankAccount(paymentData);
        
        if (!verificationResult.success) {
            throw new Error('Bank account verification failed');
        }
        
        // Process bank transfer
        const result = await this.processBankTransfer(paymentData, amount);
        
        return {
            success: result.success,
            transactionId: result.transactionId,
            method: 'bank-transfer',
            amount: amount,
            timestamp: new Date(),
            details: {
                bankName: verificationResult.bankName,
                accountLastFour: paymentData.accountNumber.slice(-4),
                processingTime: '3-5 business days'
            }
        };
    }
    
    getPaymentType() {
        return 'bank-transfer';
    }
    
    isValidRoutingNumber(routingNumber) {
        return /^\d{9}$/.test(routingNumber);
    }
    
    isValidAccountNumber(accountNumber) {
        return /^\d{8,17}$/.test(accountNumber);
    }
    
    async verifyBankAccount(paymentData) {
        // Simulate bank account verification
        await this.delay(2000);
        return {
            success: Math.random() > 0.15, // 85% success rate
            bankName: 'Example Bank',
            error: Math.random() > 0.85 ? 'Account not found' : null
        };
    }
    
    async processBankTransfer(paymentData, amount) {
        // Simulate bank transfer processing
        await this.delay(1500);
        return {
            success: Math.random() > 0.12, // 88% success rate
            transactionId: `bt_${Date.now()}`,
            error: Math.random() > 0.88 ? 'Insufficient funds' : null
        };
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Context class that uses strategies
class PaymentProcessor {
    constructor() {
        this.strategy = null;
        this.strategies = new Map();
        
        // Register available strategies
        this.registerStrategy('credit-card', new CreditCardStrategy());
        this.registerStrategy('paypal', new PayPalStrategy());
        this.registerStrategy('bank-transfer', new BankTransferStrategy());
    }
    
    registerStrategy(name, strategy) {
        this.strategies.set(name, strategy);
    }
    
    setStrategy(strategyName) {
        const strategy = this.strategies.get(strategyName);
        if (!strategy) {
            throw new Error(`Unknown payment strategy: ${strategyName}`);
        }
        this.strategy = strategy;
    }
    
    getAvailableStrategies() {
        return Array.from(this.strategies.keys());
    }
    
    validatePaymentData(paymentData) {
        if (!this.strategy) {
            throw new Error('No payment strategy selected');
        }
        
        return this.strategy.validate(paymentData);
    }
    
    async processPayment(amount, paymentData) {
        if (!this.strategy) {
            throw new Error('No payment strategy selected');
        }
        
        // Validate payment data first
        const validation = this.validatePaymentData(paymentData);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
        
        try {
            // Process payment using selected strategy
            const result = await this.strategy.processPayment(amount, paymentData);
            
            // Log transaction
            this.logTransaction(result);
            
            // Send confirmation
            await this.sendConfirmation(result);
            
            return result;
        } catch (error) {
            console.error('Payment processing failed:', error.message);
            throw error;
        }
    }
    
    logTransaction(result) {
        console.log(`Transaction logged: ${result.transactionId} - ${result.method} - $${result.amount}`);
    }
    
    async sendConfirmation(result) {
        // Simulate sending confirmation email
        console.log(`Confirmation sent for transaction: ${result.transactionId}`);
    }
}

// Usage demonstration
console.log('=== Strategy Pattern Demo ===');

const processor = new PaymentProcessor();

// Credit card payment
console.log('\n--- Credit Card Payment ---');
processor.setStrategy('credit-card');

const creditCardData = {
    cardNumber: '4532015112830366',
    expiryDate: '12/25',
    cvv: '123',
    holderName: 'John Doe'
};

try {
    const result = await processor.processPayment(100.00, creditCardData);
    console.log('Payment successful:', result);
} catch (error) {
    console.error('Payment failed:', error.message);
}

// PayPal payment
console.log('\n--- PayPal Payment ---');
processor.setStrategy('paypal');

const paypalData = {
    email: 'user@example.com',
    password: 'securepassword123'
};

try {
    const result = await processor.processPayment(75.50, paypalData);
    console.log('Payment successful:', result);
} catch (error) {
    console.error('Payment failed:', error.message);
}

// Bank transfer payment
console.log('\n--- Bank Transfer Payment ---');
processor.setStrategy('bank-transfer');

const bankData = {
    routingNumber: '021000021',
    accountNumber: '1234567890',
    accountHolderName: 'Jane Smith'
};

try {
    const result = await processor.processPayment(250.00, bankData);
    console.log('Payment successful:', result);
} catch (error) {
    console.error('Payment failed:', error.message);
}

console.log('\nAvailable payment strategies:', processor.getAvailableStrategies());
```

### Advanced Strategy Pattern with Configuration

```javascript
// Advanced Strategy Pattern with runtime configuration
class SortingStrategy {
    sort(array, options = {}) {
        throw new Error('Subclasses must implement sort method');
    }
    
    getName() {
        throw new Error('Subclasses must implement getName method');
    }
    
    getComplexity() {
        throw new Error('Subclasses must implement getComplexity method');
    }
    
    getBestCase() {
        return 'N/A';
    }
    
    getWorstCase() {
        return 'N/A';
    }
}

class BubbleSortStrategy extends SortingStrategy {
    sort(array, options = {}) {
        const { ascending = true, compareFn } = options;
        const arr = [...array]; // Don't mutate original
        const compare = compareFn || ((a, b) => ascending ? a - b : b - a);
        
        console.log(`Sorting with Bubble Sort (${arr.length} elements)`);
        
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (compare(arr[j], arr[j + 1]) > 0) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
        
        return arr;
    }
    
    getName() {
        return 'Bubble Sort';
    }
    
    getComplexity() {
        return {
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)',
            space: 'O(1)'
        };
    }
}

class QuickSortStrategy extends SortingStrategy {
    sort(array, options = {}) {
        const { ascending = true, compareFn } = options;
        const compare = compareFn || ((a, b) => ascending ? a - b : b - a);
        
        console.log(`Sorting with Quick Sort (${array.length} elements)`);
        
        return this.quickSort([...array], compare);
    }
    
    quickSort(arr, compare) {
        if (arr.length <= 1) return arr;
        
        const pivot = arr[Math.floor(arr.length / 2)];
        const left = arr.filter((x, index) => index !== Math.floor(arr.length / 2) && compare(x, pivot) <= 0);
        const right = arr.filter((x, index) => index !== Math.floor(arr.length / 2) && compare(x, pivot) > 0);
        
        return [
            ...this.quickSort(left, compare),
            pivot,
            ...this.quickSort(right, compare)
        ];
    }
    
    getName() {
        return 'Quick Sort';
    }
    
    getComplexity() {
        return {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)',
            space: 'O(log n)'
        };
    }
}

class MergeSortStrategy extends SortingStrategy {
    sort(array, options = {}) {
        const { ascending = true, compareFn } = options;
        const compare = compareFn || ((a, b) => ascending ? a - b : b - a);
        
        console.log(`Sorting with Merge Sort (${array.length} elements)`);
        
        return this.mergeSort([...array], compare);
    }
    
    mergeSort(arr, compare) {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), compare);
        const right = this.mergeSort(arr.slice(mid), compare);
        
        return this.merge(left, right, compare);
    }
    
    merge(left, right, compare) {
        let result = [];
        let leftIndex = 0;
        let rightIndex = 0;
        
        while (leftIndex < left.length && rightIndex < right.length) {
            if (compare(left[leftIndex], right[rightIndex]) <= 0) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }
        
        return result
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));
    }
    
    getName() {
        return 'Merge Sort';
    }
    
    getComplexity() {
        return {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
            space: 'O(n)'
        };
    }
}

// Smart sorting context with strategy selection
class SmartSorter {
    constructor() {
        this.strategies = new Map();
        this.defaultStrategy = null;
        
        // Register sorting strategies
        this.registerStrategy('bubble', new BubbleSortStrategy());
        this.registerStrategy('quick', new QuickSortStrategy());
        this.registerStrategy('merge', new MergeSortStrategy());
        
        this.setDefaultStrategy('quick');
    }
    
    registerStrategy(name, strategy) {
        this.strategies.set(name, strategy);
    }
    
    setDefaultStrategy(name) {
        if (!this.strategies.has(name)) {
            throw new Error(`Strategy ${name} not found`);
        }
        this.defaultStrategy = name;
    }
    
    // Automatic strategy selection based on array characteristics
    selectOptimalStrategy(array) {
        const length = array.length;
        
        if (length <= 10) {
            return 'bubble'; // Bubble sort is fine for very small arrays
        } else if (length <= 1000) {
            return 'quick'; // Quick sort for medium arrays
        } else {
            return 'merge'; // Merge sort for large arrays (guaranteed O(n log n))
        }
    }
    
    sort(array, options = {}) {
        const { 
            strategy = null,
            autoSelect = false,
            ascending = true,
            compareFn = null,
            showComplexity = false
        } = options;
        
        let selectedStrategy;
        
        if (strategy) {
            selectedStrategy = strategy;
        } else if (autoSelect) {
            selectedStrategy = this.selectOptimalStrategy(array);
            console.log(`Auto-selected strategy: ${selectedStrategy} for array of length ${array.length}`);
        } else {
            selectedStrategy = this.defaultStrategy;
        }
        
        const sortStrategy = this.strategies.get(selectedStrategy);
        if (!sortStrategy) {
            throw new Error(`Unknown sorting strategy: ${selectedStrategy}`);
        }
        
        if (showComplexity) {
            console.log(`${sortStrategy.getName()} Complexity:`, sortStrategy.getComplexity());
        }
        
        const startTime = performance.now();
        const result = sortStrategy.sort(array, { ascending, compareFn });
        const endTime = performance.now();
        
        console.log(`Sorting completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        return result;
    }
    
    getAvailableStrategies() {
        return Array.from(this.strategies.keys()).map(key => ({
            name: key,
            displayName: this.strategies.get(key).getName(),
            complexity: this.strategies.get(key).getComplexity()
        }));
    }
    
    benchmark(array, iterations = 1) {
        const results = {};
        
        for (const [name, strategy] of this.strategies) {
            const times = [];
            
            for (let i = 0; i < iterations; i++) {
                const startTime = performance.now();
                strategy.sort(array);
                const endTime = performance.now();
                times.push(endTime - startTime);
            }
            
            results[name] = {
                strategy: strategy.getName(),
                averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
                minTime: Math.min(...times),
                maxTime: Math.max(...times),
                complexity: strategy.getComplexity()
            };
        }
        
        return results;
    }
}

// Usage demonstration
console.log('\n=== Advanced Strategy Pattern Demo ===');

const sorter = new SmartSorter();

// Test data
const smallArray = [64, 34, 25, 12, 22, 11, 90];
const mediumArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
const largeArray = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 10000));

console.log('\nAvailable strategies:');
console.table(sorter.getAvailableStrategies());

// Manual strategy selection
console.log('\n--- Manual Strategy Selection ---');
const quickSorted = sorter.sort(smallArray, { strategy: 'quick', showComplexity: true });
console.log('Original:', smallArray);
console.log('Quick sorted:', quickSorted);

// Automatic strategy selection
console.log('\n--- Automatic Strategy Selection ---');
const autoSortedMedium = sorter.sort(mediumArray, { autoSelect: true });
console.log('Medium array sorted with auto-selected strategy');

const autoSortedLarge = sorter.sort(largeArray, { autoSelect: true });
console.log('Large array sorted with auto-selected strategy');

// Custom comparison function
console.log('\n--- Custom Comparison ---');
const people = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 }
];

const sortedByAge = sorter.sort(people, {
    strategy: 'merge',
    compareFn: (a, b) => a.age - b.age
});

console.log('Sorted by age:', sortedByAge);

// Benchmarking
console.log('\n--- Performance Benchmark ---');
const benchmarkArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
const benchmarkResults = sorter.benchmark(benchmarkArray, 5);

console.log('Benchmark results (5 iterations):');
console.table(benchmarkResults);
```

## State Pattern Implementation 🔄

### Basic State Pattern: Media Player

**The State Pattern allows an object to change its behavior when its internal state changes**, appearing as if the object changed its class.

```javascript
// State Pattern implementation for Media Player

// Abstract State class
class MediaPlayerState {
    constructor(player) {
        this.player = player;
    }
    
    play(track = null) {
        this.invalidOperation('play');
    }
    
    pause() {
        this.invalidOperation('pause');
    }
    
    stop() {
        this.invalidOperation('stop');
    }
    
    next() {
        this.invalidOperation('next');
    }
    
    previous() {
        this.invalidOperation('previous');
    }
    
    seek(position) {
        this.invalidOperation('seek');
    }
    
    setVolume(volume) {
        // Volume can be changed in any state
        this.player.volume = Math.max(0, Math.min(100, volume));
        this.player.notifyObservers('volumeChanged', this.player.volume);
    }
    
    getStateName() {
        throw new Error('Subclasses must implement getStateName method');
    }
    
    onEnter() {
        // Called when entering this state
        console.log(`Entering ${this.getStateName()} state`);
    }
    
    onExit() {
        // Called when leaving this state
        console.log(`Exiting ${this.getStateName()} state`);
    }
    
    invalidOperation(operation) {
        console.warn(`Cannot ${operation} in ${this.getStateName()} state`);
        throw new Error(`Invalid operation: ${operation} not allowed in ${this.getStateName()} state`);
    }
}

// Concrete State implementations
class StoppedState extends MediaPlayerState {
    play(track = null) {
        if (track) {
            this.player.currentTrack = track;
        } else if (!this.player.currentTrack) {
            throw new Error('No track to play');
        }
        
        this.player.position = 0;
        this.player.startPlayback();
        this.player.setState(new PlayingState(this.player));
    }
    
    next() {
        const nextTrack = this.player.getNextTrack();
        if (nextTrack) {
            this.player.currentTrack = nextTrack;
            this.player.notifyObservers('trackChanged', nextTrack);
        }
    }
    
    previous() {
        const previousTrack = this.player.getPreviousTrack();
        if (previousTrack) {
            this.player.currentTrack = previousTrack;
            this.player.notifyObservers('trackChanged', previousTrack);
        }
    }
    
    getStateName() {
        return 'Stopped';
    }
}

class PlayingState extends MediaPlayerState {
    play(track = null) {
        if (track && track !== this.player.currentTrack) {
            // Switch to new track
            this.player.stopPlayback();
            this.player.currentTrack = track;
            this.player.position = 0;
            this.player.startPlayback();
            this.player.notifyObservers('trackChanged', track);
        }
        // If same track or no track specified, continue playing
    }
    
    pause() {
        this.player.pausePlayback();
        this.player.setState(new PausedState(this.player));
    }
    
    stop() {
        this.player.stopPlayback();
        this.player.position = 0;
        this.player.setState(new StoppedState(this.player));
    }
    
    next() {
        const nextTrack = this.player.getNextTrack();
        if (nextTrack) {
            this.player.stopPlayback();
            this.player.currentTrack = nextTrack;
            this.player.position = 0;
            this.player.startPlayback();
            this.player.notifyObservers('trackChanged', nextTrack);
        } else {
            this.stop(); // No more tracks
        }
    }
    
    previous() {
        if (this.player.position > 3) {
            // If more than 3 seconds into track, restart current track
            this.player.position = 0;
            this.player.seek(0);
        } else {
            // Go to previous track
            const previousTrack = this.player.getPreviousTrack();
            if (previousTrack) {
                this.player.stopPlayback();
                this.player.currentTrack = previousTrack;
                this.player.position = 0;
                this.player.startPlayback();
                this.player.notifyObservers('trackChanged', previousTrack);
            }
        }
    }
    
    seek(position) {
        if (position >= 0 && position <= this.player.currentTrack.duration) {
            this.player.position = position;
            this.player.seek(position);
        }
    }
    
    getStateName() {
        return 'Playing';
    }
    
    onEnter() {
        super.onEnter();
        this.player.notifyObservers('playbackStarted', this.player.currentTrack);
    }
}

class PausedState extends MediaPlayerState {
    play(track = null) {
        if (track && track !== this.player.currentTrack) {
            // Switch to new track
            this.player.currentTrack = track;
            this.player.position = 0;
            this.player.startPlayback();
            this.player.notifyObservers('trackChanged', track);
        } else {
            // Resume current track
            this.player.resumePlayback();
        }
        
        this.player.setState(new PlayingState(this.player));
    }
    
    stop() {
        this.player.position = 0;
        this.player.setState(new StoppedState(this.player));
    }
    
    next() {
        const nextTrack = this.player.getNextTrack();
        if (nextTrack) {
            this.player.currentTrack = nextTrack;
            this.player.position = 0;
            this.player.notifyObservers('trackChanged', nextTrack);
            // Stay in paused state
        } else {
            this.stop(); // No more tracks
        }
    }
    
    previous() {
        const previousTrack = this.player.getPreviousTrack();
        if (previousTrack) {
            this.player.currentTrack = previousTrack;
            this.player.position = 0;
            this.player.notifyObservers('trackChanged', previousTrack);
            // Stay in paused state
        }
    }
    
    seek(position) {
        if (position >= 0 && position <= this.player.currentTrack.duration) {
            this.player.position = position;
        }
    }
    
    getStateName() {
        return 'Paused';
    }
    
    onEnter() {
        super.onEnter();
        this.player.notifyObservers('playbackPaused', this.player.currentTrack);
    }
}

// Context class - MediaPlayer
class MediaPlayer {
    constructor() {
        this.state = new StoppedState(this);
        this.currentTrack = null;
        this.position = 0;
        this.volume = 50;
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.observers = [];
    }
    
    // State management
    setState(newState) {
        if (this.state) {
            this.state.onExit();
        }
        
        this.state = newState;
        this.state.onEnter();
        this.notifyObservers('stateChanged', this.state.getStateName());
    }
    
    getState() {
        return this.state.getStateName();
    }
    
    // Public interface - delegates to current state
    play(track = null) {
        this.state.play(track);
    }
    
    pause() {
        this.state.pause();
    }
    
    stop() {
        this.state.stop();
    }
    
    next() {
        this.state.next();
    }
    
    previous() {
        this.state.previous();
    }
    
    seek(position) {
        this.state.seek(position);
    }
    
    setVolume(volume) {
        this.state.setVolume(volume);
    }
    
    // Playlist management
    setPlaylist(tracks) {
        this.playlist = tracks;
        this.currentTrackIndex = 0;
        if (tracks.length > 0) {
            this.currentTrack = tracks[0];
        }
        this.notifyObservers('playlistChanged', tracks);
    }
    
    addToPlaylist(track) {
        this.playlist.push(track);
        if (this.playlist.length === 1) {
            this.currentTrack = track;
            this.currentTrackIndex = 0;
        }
        this.notifyObservers('playlistChanged', this.playlist);
    }
    
    getNextTrack() {
        if (this.currentTrackIndex < this.playlist.length - 1) {
            this.currentTrackIndex++;
            return this.playlist[this.currentTrackIndex];
        }
        return null;
    }
    
    getPreviousTrack() {
        if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
            return this.playlist[this.currentTrackIndex];
        }
        return null;
    }
    
    // Playback simulation methods
    startPlayback() {
        console.log(`Starting playback: ${this.currentTrack.title}`);
        this.simulatePlayback();
    }
    
    pausePlayback() {
        console.log(`Pausing playback: ${this.currentTrack.title}`);
        if (this.playbackTimer) {
            clearInterval(this.playbackTimer);
        }
    }
    
    resumePlayback() {
        console.log(`Resuming playback: ${this.currentTrack.title}`);
        this.simulatePlayback();
    }
    
    stopPlayback() {
        console.log(`Stopping playback: ${this.currentTrack.title}`);
        if (this.playbackTimer) {
            clearInterval(this.playbackTimer);
        }
    }
    
    seek(position) {
        console.log(`Seeking to ${position}s in ${this.currentTrack.title}`);
    }
    
    simulatePlayback() {
        // Simulate playback progress
        this.playbackTimer = setInterval(() => {
            this.position++;
            this.notifyObservers('positionChanged', this.position);
            
            // Auto-advance to next track when current track ends
            if (this.position >= this.currentTrack.duration) {
                if (this.getNextTrack()) {
                    this.next();
                } else {
                    this.stop();
                }
            }
        }, 1000);
    }
    
    // Observer pattern for state change notifications
    addObserver(observer) {
        this.observers.push(observer);
    }
    
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    
    notifyObservers(event, data) {
        this.observers.forEach(observer => {
            if (typeof observer === 'function') {
                observer(event, data);
            } else if (observer.update) {
                observer.update(event, data);
            }
        });
    }
    
    // Status methods
    getCurrentStatus() {
        return {
            state: this.state.getStateName(),
            currentTrack: this.currentTrack,
            position: this.position,
            volume: this.volume,
            playlist: this.playlist,
            currentTrackIndex: this.currentTrackIndex
        };
    }
}

// Usage demonstration
console.log('\n=== State Pattern Demo ===');

const player = new MediaPlayer();

// Add observer to monitor state changes
player.addObserver((event, data) => {
    console.log(`Event: ${event}, Data:`, data);
});

// Create sample playlist
const playlist = [
    { title: 'Song 1', artist: 'Artist A', duration: 180 },
    { title: 'Song 2', artist: 'Artist B', duration: 210 },
    { title: 'Song 3', artist: 'Artist C', duration: 195 }
];

player.setPlaylist(playlist);

console.log('\nInitial state:', player.getState());
console.log('Status:', player.getCurrentStatus());

// Test state transitions
console.log('\n--- Testing State Transitions ---');

try {
    // Can't pause when stopped
    player.pause();
} catch (error) {
    console.log('Expected error:', error.message);
}

// Start playing
player.play();
console.log('After play - State:', player.getState());

// Pause
setTimeout(() => {
    player.pause();
    console.log('After pause - State:', player.getState());
    
    // Resume
    setTimeout(() => {
        player.play();
        console.log('After resume - State:', player.getState());
        
        // Stop
        setTimeout(() => {
            player.stop();
            console.log('After stop - State:', player.getState());
            
            // Clean up
            if (player.playbackTimer) {
                clearInterval(player.playbackTimer);
            }
        }, 1000);
    }, 1000);
}, 2000);
```

## Summary

### Core Concepts
- **Strategy Pattern**: Encapsulates algorithms in separate objects, making them interchangeable
- **State Pattern**: Allows objects to change behavior when their internal state changes
- **Behavioral Flexibility**: Both patterns enable dynamic behavior modification at runtime
- **Loose Coupling**: Context classes don't depend on specific implementations

### Theoretical Foundation
- **Algorithm Encapsulation**: Strategy pattern isolates different algorithms/behaviors
- **State Machine Theory**: State pattern implements finite state machines with encapsulated states
- **Polymorphism**: Both patterns use polymorphism to enable flexible behavior selection
- **Separation of Concerns**: Each strategy or state has single responsibility

### Pattern Comparison
- **Strategy**: Focus on interchangeable algorithms for the same problem
- **State**: Focus on state-dependent behavior and transitions
- **Usage**: Strategy is about "how to do something", State is about "what to do based on current situation"

### Implementation Benefits
- **Maintainability**: Easy to modify or add new behaviors/states
- **Testability**: Each strategy or state can be tested independently
- **Extensibility**: New strategies or states can be added without modifying existing code
- **Performance**: Can optimize strategy/state selection based on conditions

### When to Use These Patterns
- **Strategy Pattern**: Multiple ways to perform the same task, algorithm selection at runtime
- **State Pattern**: Objects that change behavior based on internal state, complex state transitions
- **Both**: When you need to eliminate complex conditional logic and enable runtime behavior changes

### My Personal Insight
Strategy and State patterns revolutionized how I handle complex behavior in applications. Before understanding these patterns, my code was full of giant switch statements and complex if-else chains that were hard to maintain and extend.

**The key insight: Instead of asking "what should I do in this situation?", these patterns let you ask "who knows what to do in this situation?"** This shift from procedural thinking to object-oriented responsibility delegation makes code much more maintainable.

**Strategy pattern** taught me that algorithms are first-class citizens that deserve their own classes. **State pattern** showed me how to model complex state machines elegantly, making state transitions explicit and manageable.

### Next Up
Now that you've mastered behavioral patterns for dynamic behavior, we'll explore **Singleton Pattern & Proxy Pattern** - structural and creational patterns that control object access and provide sophisticated object interaction mechanisms.

Remember: These patterns aren't about complexity - they're about organizing complexity in maintainable, extensible ways! 🚀✨
