---
title: "Test-Driven Development Overview"
description: "Explore Test-Driven Development (TDD) practices for frontend development. Learn the red-green-refactor cycle, TDD benefits, implementation strategies, and building maintainable codebases through test-first development approaches."
publishedAt: 2025-03-29
image: "https://res.cloudinary.com/duojkrgue/image/upload/v1759048334/Portfolio/FrontendSystemDesignCourse/titleImages/29_btltbr.png"
category: "Frontend System Design"
author: "Rahul Aher"
tags: ["testing", "tdd", "development", "methodology", "best-practices"]
series: "Frontend System Design Course"
courseName: 02-frontend-system-design
series_order: 29
topics:
  - nodejs
  - javascript
  - frontend
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048333/Portfolio/FrontendSystemDesignCourse/titleImages/29_btltbr.png)

Test-Driven Development Overview
----------------------------------

### Introduction

Test-Driven Development (TDD) is a software development methodology that revolutionizes how we approach writing code by inverting the traditional development process. Instead of writing code first and then testing it, TDD requires us to write tests first, watch them fail, then write the minimal code necessary to make them pass, and finally refactor for optimal design. This seemingly backward approach leads to more robust, maintainable, and well-designed software.

**TDD** follows a strict cycle: Red (write a failing test), Green (make the test pass with minimal code), Refactor (improve the code while keeping tests green). **Test-first development** ensures that every piece of code has a clear purpose and specification before it's written, while **behavior-driven development (BDD)** extends TDD by focusing on the behavior and business value of the system.

Think of TDD as being like building with blueprints that you create as you go—each test is a specification that describes exactly what the next piece should do, ensuring every component fits perfectly with the rest of the system.

## The Theoretical Foundation

### Understanding the TDD Philosophy

TDD operates on several fundamental principles that challenge traditional development approaches:

**1. Specification Through Examples**
Tests in TDD serve as executable specifications:
```
Traditional Approach:
Requirements → Design → Code → Tests → Debugging

TDD Approach:
Requirements → Test (Specification) → Code → Refactor → Next Feature
```

**2. Fail Fast, Fail Cheap**
TDD catches errors immediately when they're introduced:
- **Immediate Feedback**: Tests run continuously during development
- **Clear Error Context**: Failing tests pinpoint exactly what's broken
- **Prevention vs. Detection**: Prevents bugs rather than finding them later
- **Reduced Debugging Time**: Clear test failures eliminate guesswork

**3. Emergent Design**
Code design emerges naturally from the testing process:
- **YAGNI Principle**: You Ain't Gonna Need It - write only what's needed
- **Simple Design**: Start simple, add complexity only when tests demand it
- **Interface-First Thinking**: Tests define how code should be used
- **Refactoring Safety**: Tests provide confidence for design improvements

### The Red-Green-Refactor Cycle

The TDD cycle is the heartbeat of test-driven development:

```
🔴 RED: Write a failing test
     ↓
🟢 GREEN: Write minimal code to pass
     ↓
🔵 REFACTOR: Improve code quality
     ↓
  Repeat for next feature
```

**Red Phase (Write a Failing Test)**
- Write the smallest possible test that describes the next piece of functionality
- The test should fail because the functionality doesn't exist yet
- Failing tests confirm that tests actually work and catch real issues

**Green Phase (Make it Pass)**
- Write the minimal amount of code to make the test pass
- Don't worry about perfect design yet - just make it work
- Resist the urge to write more functionality than the test requires

**Refactor Phase (Improve the Design)**
- Clean up the code while keeping all tests green
- Improve naming, extract methods, eliminate duplication
- Refactor both production code and test code

### TDD Framework Implementation

```javascript
// tdd-framework.js - Comprehensive TDD Framework and Utilities

class TDDFramework {
  constructor(config = {}) {
    this.config = {
      testRunner: config.testRunner || 'jest',
      watchMode: config.watchMode !== false,
      coverage: config.coverage !== false,
      verbose: config.verbose || false,
      testPattern: config.testPattern || '**/*.test.js',
      setupFiles: config.setupFiles || [],
      ...config
    };

    this.testSuites = new Map();
    this.testResults = new Map();
    this.watcher = null;
    this.cycleMeter = new TDDCycleMeter();
  }

  // Create a new test suite following TDD principles
  createTestSuite(suiteName, description) {
    const suite = new TDDTestSuite(suiteName, description, this.config);
    this.testSuites.set(suiteName, suite);
    return suite;
  }

  // Start TDD development session with watch mode
  startTDDSession(options = {}) {
    console.log('🚀 Starting TDD development session...');
    
    this.cycleMeter.startSession();
    
    if (this.config.watchMode) {
      this.startWatchMode(options);
    }
    
    return {
      runTests: () => this.runAllTests(),
      stopSession: () => this.stopTDDSession(),
      getCycleMetrics: () => this.cycleMeter.getMetrics()
    };
  }

  startWatchMode(options) {
    const chokidar = require('chokidar');
    
    this.watcher = chokidar.watch([
      'src/**/*.js',
      'src/**/*.jsx',
      'src/**/*.ts',
      'src/**/*.tsx',
      '**/*.test.js',
      '**/*.spec.js'
    ], {
      ignored: ['node_modules/**', 'dist/**', 'build/**'],
      persistent: true
    });

    this.watcher.on('change', (path) => {
      console.log(`\n📝 File changed: ${path}`);
      this.runTestsForFile(path);
    });

    console.log('👀 Watch mode enabled - tests will run automatically on file changes');
  }

  async runTestsForFile(filePath) {
    const startTime = Date.now();
    
    try {
      // Determine which tests to run based on changed file
      const testFiles = this.getRelatedTestFiles(filePath);
      const results = await this.runSpecificTests(testFiles);
      
      const duration = Date.now() - startTime;
      
      // Track TDD cycle metrics
      this.cycleMeter.recordTestRun(results, duration);
      
      // Display results
      this.displayTestResults(results, filePath);
      
      // Provide TDD guidance
      this.provideTDDGuidance(results);
      
    } catch (error) {
      console.error('❌ Test run failed:', error.message);
    }
  }

  provideTDDGuidance(results) {
    const guidance = this.analyzeTDDCycleState(results);
    
    if (guidance.phase === 'red') {
      console.log('\n🔴 RED PHASE: Write a failing test');
      console.log('   ✅ Good! You have failing tests');
      console.log('   ➡️  Next: Write minimal code to make tests pass');
    } else if (guidance.phase === 'green') {
      console.log('\n🟢 GREEN PHASE: Make the test pass');
      console.log('   ✅ Great! Tests are passing');
      console.log('   ➡️  Next: Refactor to improve code quality');
    } else if (guidance.phase === 'refactor') {
      console.log('\n🔵 REFACTOR PHASE: Improve code quality');
      console.log('   ✅ Tests still passing after changes');
      console.log('   ➡️  Next: Write the next failing test');
    }

    if (guidance.suggestions.length > 0) {
      console.log('\n💡 Suggestions:');
      guidance.suggestions.forEach(suggestion => {
        console.log(`   • ${suggestion}`);
      });
    }
  }

  analyzeTDDCycleState(results) {
    const failingTests = results.failedTests || 0;
    const passingTests = results.passedTests || 0;
    const totalTests = failingTests + passingTests;
    
    const analysis = {
      phase: 'unknown',
      suggestions: []
    };

    if (failingTests > 0 && failingTests === totalTests) {
      // All tests failing - likely in RED phase
      analysis.phase = 'red';
      if (failingTests > 1) {
        analysis.suggestions.push('Consider writing smaller, more focused tests');
      }
    } else if (failingTests === 0 && passingTests > 0) {
      // All tests passing - could be GREEN or REFACTOR phase
      const recentChanges = this.cycleMeter.getRecentActivity();
      
      if (recentChanges.lastCodeChange < recentChanges.lastTestChange) {
        analysis.phase = 'green';
        analysis.suggestions.push('Consider refactoring to improve code design');
      } else {
        analysis.phase = 'refactor';
        analysis.suggestions.push('Write the next failing test for new functionality');
      }
    } else if (failingTests > 0 && passingTests > 0) {
      // Mixed results - might indicate regression
      analysis.phase = 'red';
      analysis.suggestions.push('Fix failing tests before adding new functionality');
      analysis.suggestions.push('Check if recent changes broke existing functionality');
    }

    return analysis;
  }
}

// TDD Test Suite with Cycle-Aware Testing
class TDDTestSuite {
  constructor(name, description, config) {
    this.name = name;
    this.description = description;
    this.config = config;
    this.tests = [];
    this.beforeEachHooks = [];
    this.afterEachHooks = [];
    this.beforeAllHooks = [];
    this.afterAllHooks = [];
  }

  // Red Phase: Write a failing test
  describe(description, testFn) {
    const testContext = {
      name: description,
      tests: [],
      currentPhase: 'red'
    };

    // Execute test definition
    const originalIt = global.it;
    global.it = (testDescription, testImplementation) => {
      testContext.tests.push({
        description: testDescription,
        implementation: testImplementation,
        expectedToFail: testContext.currentPhase === 'red'
      });
    };

    testFn();
    global.it = originalIt;

    this.tests.push(testContext);
    return testContext;
  }

  // Helper for writing behavior-driven tests
  given(context, setupFn) {
    return {
      when: (action, actionFn) => {
        return {
          then: (expectation, assertionFn) => {
            this.describe(`Given ${context}, when ${action}, then ${expectation}`, () => {
              beforeEach(() => setupFn());
              
              it(expectation, async () => {
                await actionFn();
                await assertionFn();
              });
            });
          }
        };
      }
    };
  }

  // Test doubles factory for TDD
  createTestDouble(type, name) {
    switch (type) {
      case 'spy':
        return this.createSpy(name);
      case 'stub':
        return this.createStub(name);
      case 'mock':
        return this.createMock(name);
      case 'fake':
        return this.createFake(name);
      default:
        throw new Error(`Unknown test double type: ${type}`);
    }
  }

  createSpy(name) {
    const spy = jest.fn();
    spy.displayName = name;
    spy.wasCalled = () => spy.mock.calls.length > 0;
    spy.wasCalledWith = (...args) => 
      spy.mock.calls.some(call => JSON.stringify(call) === JSON.stringify(args));
    spy.callCount = () => spy.mock.calls.length;
    return spy;
  }

  createStub(name) {
    const stub = jest.fn();
    stub.displayName = name;
    stub.returns = (value) => { stub.mockReturnValue(value); return stub; };
    stub.throws = (error) => { stub.mockImplementation(() => { throw error; }); return stub; };
    stub.resolves = (value) => { stub.mockResolvedValue(value); return stub; };
    stub.rejects = (error) => { stub.mockRejectedValue(error); return stub; };
    return stub;
  }

  createMock(name) {
    const mock = {
      name,
      expectations: [],
      calls: []
    };

    mock.expects = (methodName) => {
      const expectation = {
        method: methodName,
        args: null,
        returnValue: undefined,
        times: 1
      };

      expectation.withArgs = (...args) => {
        expectation.args = args;
        return expectation;
      };

      expectation.returns = (value) => {
        expectation.returnValue = value;
        return expectation;
      };

      expectation.times = (count) => {
        expectation.expectedCalls = count;
        return expectation;
      };

      mock.expectations.push(expectation);
      return expectation;
    };

    mock.verify = () => {
      for (const expectation of mock.expectations) {
        const matchingCalls = mock.calls.filter(call => 
          call.method === expectation.method &&
          (expectation.args === null || 
           JSON.stringify(call.args) === JSON.stringify(expectation.args))
        );

        if (matchingCalls.length !== expectation.expectedCalls) {
          throw new Error(
            `Mock ${name}: Expected ${expectation.method} to be called ${expectation.expectedCalls} times, but was called ${matchingCalls.length} times`
          );
        }
      }
    };

    return mock;
  }

  createFake(name) {
    return {
      name,
      behavior: new Map(),
      setBehavior: function(methodName, implementation) {
        this.behavior.set(methodName, implementation);
      },
      [Symbol.toPrimitive]: () => name
    };
  }
}

// TDD Cycle Metrics and Analysis
class TDDCycleMeter {
  constructor() {
    this.session = null;
    this.cycles = [];
    this.currentCycle = null;
  }

  startSession() {
    this.session = {
      startTime: new Date(),
      totalCycles: 0,
      averageCycleTime: 0,
      redTime: 0,
      greenTime: 0,
      refactorTime: 0
    };
  }

  recordTestRun(results, duration) {
    const cycleData = {
      timestamp: new Date(),
      results,
      duration,
      phase: this.determineCyclePhase(results)
    };

    if (!this.currentCycle || this.shouldStartNewCycle(cycleData)) {
      this.startNewCycle(cycleData);
    } else {
      this.updateCurrentCycle(cycleData);
    }
  }

  determineCyclePhase(results) {
    if (results.failedTests > 0) {
      return 'red';
    } else if (results.passedTests > 0) {
      return this.currentCycle?.phase === 'green' ? 'refactor' : 'green';
    }
    return 'unknown';
  }

  shouldStartNewCycle(cycleData) {
    if (!this.currentCycle) return true;
    
    // Start new cycle when we go from refactor back to red
    return this.currentCycle.phase === 'refactor' && cycleData.phase === 'red';
  }

  startNewCycle(cycleData) {
    if (this.currentCycle) {
      this.completeCycle();
    }

    this.currentCycle = {
      startTime: cycleData.timestamp,
      phases: [cycleData],
      currentPhase: cycleData.phase,
      redTime: cycleData.phase === 'red' ? cycleData.duration : 0,
      greenTime: cycleData.phase === 'green' ? cycleData.duration : 0,
      refactorTime: cycleData.phase === 'refactor' ? cycleData.duration : 0
    };
  }

  updateCurrentCycle(cycleData) {
    this.currentCycle.phases.push(cycleData);
    this.currentCycle.currentPhase = cycleData.phase;

    switch (cycleData.phase) {
      case 'red':
        this.currentCycle.redTime += cycleData.duration;
        break;
      case 'green':
        this.currentCycle.greenTime += cycleData.duration;
        break;
      case 'refactor':
        this.currentCycle.refactorTime += cycleData.duration;
        break;
    }
  }

  completeCycle() {
    if (!this.currentCycle) return;

    this.currentCycle.endTime = new Date();
    this.currentCycle.totalTime = this.currentCycle.endTime - this.currentCycle.startTime;
    
    this.cycles.push(this.currentCycle);
    this.session.totalCycles++;
    
    this.updateSessionMetrics();
    this.currentCycle = null;
  }

  updateSessionMetrics() {
    const totalTime = this.cycles.reduce((sum, cycle) => sum + cycle.totalTime, 0);
    this.session.averageCycleTime = totalTime / this.cycles.length;
    
    this.session.redTime = this.cycles.reduce((sum, cycle) => sum + cycle.redTime, 0);
    this.session.greenTime = this.cycles.reduce((sum, cycle) => sum + cycle.greenTime, 0);
    this.session.refactorTime = this.cycles.reduce((sum, cycle) => sum + cycle.refactorTime, 0);
  }

  getMetrics() {
    return {
      session: this.session,
      cycles: this.cycles,
      currentCycle: this.currentCycle,
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.cycles.length === 0) {
      return ['Start writing your first failing test to begin TDD cycle'];
    }

    const avgCycleTime = this.session.averageCycleTime;
    const redRatio = this.session.redTime / (this.session.redTime + this.session.greenTime + this.session.refactorTime);
    const refactorRatio = this.session.refactorTime / (this.session.redTime + this.session.greenTime + this.session.refactorTime);

    if (avgCycleTime > 10 * 60 * 1000) { // More than 10 minutes
      recommendations.push('Consider smaller, more focused test cases for faster cycles');
    }

    if (redRatio > 0.5) {
      recommendations.push('Spending too much time in red phase - write simpler tests');
    }

    if (refactorRatio < 0.2) {
      recommendations.push('Not enough refactoring - remember to clean up code regularly');
    }

    const stuckInRed = this.cycles.filter(c => c.currentPhase === 'red' && c.redTime > 5 * 60 * 1000).length;
    if (stuckInRed > this.cycles.length * 0.3) {
      recommendations.push('Consider breaking down complex functionality into smaller steps');
    }

    return recommendations;
  }

  getRecentActivity() {
    const now = Date.now();
    return {
      lastTestChange: now - 1000, // Mock implementation
      lastCodeChange: now - 2000  // Mock implementation
    };
  }
}

export { TDDFramework, TDDTestSuite, TDDCycleMeter };
```

## Understanding the TDD Framework Architecture

Let me explain how each component of our TDD framework guides developers through effective test-driven development:

### 1. **TDD Session Management**
```javascript
const tddFramework = new TDDFramework({
  watchMode: true,        // Automatically run tests on file changes
  coverage: true,         // Track test coverage
  verbose: true          // Detailed feedback and guidance
});

const session = tddFramework.startTDDSession();
```

**What's happening here:**
- **Watch Mode**: Automatically detects file changes and runs relevant tests
- **Immediate Feedback**: Provides instant results and TDD guidance
- **Cycle Tracking**: Monitors Red-Green-Refactor progression
- **Learning Support**: Offers suggestions for better TDD practices

### 2. **Phase-Aware Testing**
```javascript
const suite = tddFramework.createTestSuite('UserAuthentication', 'User login and signup functionality');

suite.describe('User login process', () => {
  it('should authenticate user with valid credentials', () => {
    // This test is expected to fail initially (RED phase)
    expect(authService.login('user@test.com', 'password123')).toBeTruthy();
  });
});
```

**TDD guidance provided:**
- **Red Phase Detection**: Framework knows when tests should fail
- **Green Phase Transition**: Guides toward minimal implementation
- **Refactor Phase Recognition**: Suggests when to improve code quality
- **Cycle Completion**: Tracks complete Red-Green-Refactor cycles

### 3. **Behavior-Driven Test Structure**
```javascript
suite.given('a user with valid credentials')
  .when('they attempt to login')
  .then('they should be authenticated', () => {
    // Test implementation
  });
```

**Benefits of this structure:**
- **Clear Intent**: Tests read like business requirements
- **Stakeholder Communication**: Non-technical stakeholders can understand tests
- **Comprehensive Coverage**: Ensures all scenarios are considered
- **Maintainable Tests**: Easy to update when requirements change

## Practical TDD Implementation

Here's how to apply TDD principles in real-world frontend development:

```javascript
// TDDExample.test.js - Complete TDD Example: Shopping Cart

import { TDDFramework } from './tdd-framework';

describe('Shopping Cart TDD Example', () => {
  let tddFramework;
  let cart;

  beforeEach(() => {
    tddFramework = new TDDFramework();
    // Start with undefined - TDD will drive the implementation
    cart = undefined;
  });

  // RED PHASE: Write failing tests first
  describe('Creating a shopping cart', () => {
    it('should create an empty cart', () => {
      // This will fail - ShoppingCart doesn't exist yet
      cart = new ShoppingCart();
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
    });

    it('should have a method to add items', () => {
      cart = new ShoppingCart();
      // This will fail - addItem method doesn't exist
      expect(typeof cart.addItem).toBe('function');
    });
  });

  // After implementing minimal ShoppingCart class...
  
  describe('Adding items to cart', () => {
    beforeEach(() => {
      cart = new ShoppingCart();
    });

    it('should add item to cart', () => {
      const item = { id: 1, name: 'Laptop', price: 999.99 };
      cart.addItem(item);
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual(item);
    });

    it('should update total when item is added', () => {
      const item = { id: 1, name: 'Laptop', price: 999.99 };
      cart.addItem(item);
      
      expect(cart.total).toBe(999.99);
    });

    it('should handle multiple items', () => {
      const laptop = { id: 1, name: 'Laptop', price: 999.99 };
      const mouse = { id: 2, name: 'Mouse', price: 29.99 };
      
      cart.addItem(laptop);
      cart.addItem(mouse);
      
      expect(cart.items).toHaveLength(2);
      expect(cart.total).toBe(1029.98);
    });
  });

  describe('Removing items from cart', () => {
    beforeEach(() => {
      cart = new ShoppingCart();
      cart.addItem({ id: 1, name: 'Laptop', price: 999.99 });
      cart.addItem({ id: 2, name: 'Mouse', price: 29.99 });
    });

    it('should remove item by id', () => {
      cart.removeItem(1);
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].id).toBe(2);
      expect(cart.total).toBe(29.99);
    });

    it('should handle removing non-existent item', () => {
      cart.removeItem(999);
      
      expect(cart.items).toHaveLength(2);
      expect(cart.total).toBe(1029.98);
    });
  });

  describe('Quantity management', () => {
    beforeEach(() => {
      cart = new ShoppingCart();
    });

    it('should handle item quantities', () => {
      const item = { id: 1, name: 'Laptop', price: 999.99 };
      cart.addItem(item, 2);
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.total).toBe(1999.98);
    });

    it('should update quantity when same item added', () => {
      const item = { id: 1, name: 'Laptop', price: 999.99 };
      cart.addItem(item);
      cart.addItem(item);
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.total).toBe(1999.98);
    });

    it('should update total when quantity changes', () => {
      const item = { id: 1, name: 'Laptop', price: 999.99 };
      cart.addItem(item);
      cart.updateQuantity(1, 3);
      
      expect(cart.items[0].quantity).toBe(3);
      expect(cart.total).toBe(2999.97);
    });
  });

  describe('Cart validation', () => {
    beforeEach(() => {
      cart = new ShoppingCart();
    });

    it('should validate item before adding', () => {
      expect(() => cart.addItem(null)).toThrow('Item cannot be null');
      expect(() => cart.addItem({})).toThrow('Item must have id and price');
      expect(() => cart.addItem({ id: 1 })).toThrow('Item must have id and price');
    });

    it('should validate quantity', () => {
      const item = { id: 1, name: 'Laptop', price: 999.99 };
      expect(() => cart.addItem(item, -1)).toThrow('Quantity must be positive');
      expect(() => cart.addItem(item, 0)).toThrow('Quantity must be positive');
    });
  });
});

// Implementation guided by TDD
// This would be built incrementally, test by test

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  get total() {
    return this.items.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
  }

  addItem(item, quantity = 1) {
    // Validation driven by tests
    if (!item) {
      throw new Error('Item cannot be null');
    }

    if (!item.id || typeof item.price !== 'number') {
      throw new Error('Item must have id and price');
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    // Check if item already exists
    const existingItem = this.items.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
      this.items.push({ ...item, quantity });
    }
  }

  removeItem(itemId) {
    const index = this.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = newQuantity;
    }
  }
}

export { ShoppingCart };
```

## Advanced TDD Patterns and Techniques

### Test Doubles in TDD

```javascript
// TestDoubles.test.js - Using Test Doubles Effectively in TDD

describe('User Service TDD with Test Doubles', () => {
  let userService;
  let mockUserRepository;
  let mockEmailService;
  let mockLogger;

  beforeEach(() => {
    // Create test doubles before implementation exists
    mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn()
    };

    mockEmailService = {
      sendWelcomeEmail: jest.fn()
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    };

    // This will drive the constructor interface
    userService = new UserService(mockUserRepository, mockEmailService, mockLogger);
  });

  describe('Creating a new user', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'securePassword123'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null); // User doesn't exist
      mockUserRepository.save.mockResolvedValue({ id: 1, ...userData });
      mockEmailService.sendWelcomeEmail.mockResolvedValue(true);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.id).toBe(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name,
          hashedPassword: expect.any(String) // Password should be hashed
        })
      );
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(userData.email, userData.name);
      expect(mockLogger.info).toHaveBeenCalledWith('User created successfully', { userId: 1 });
    });

    it('should reject duplicate email addresses', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'securePassword123'
      };

      mockUserRepository.findByEmail.mockResolvedValue({ id: 2, email: userData.email });

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should handle email service failures gracefully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'securePassword123'
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue({ id: 1, ...userData });
      mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('Email service unavailable'));

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.id).toBe(1); // User still created
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to send welcome email',
        expect.objectContaining({
          userId: 1,
          error: 'Email service unavailable'
        })
      );
    });
  });

  describe('User authentication', () => {
    it('should authenticate user with correct credentials', async () => {
      // Arrange
      const email = 'user@example.com';
      const password = 'correctPassword';
      const hashedPassword = await hashPassword(password); // Assume this function exists

      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email,
        hashedPassword,
        isActive: true
      });

      // Act
      const result = await userService.authenticate(email, password);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user.id).toBe(1);
      expect(result.user.email).toBe(email);
      expect(mockLogger.info).toHaveBeenCalledWith('User authenticated successfully', { userId: 1 });
    });

    it('should reject authentication for inactive users', async () => {
      // Arrange
      const email = 'inactive@example.com';
      const password = 'correctPassword';

      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email,
        hashedPassword: await hashPassword(password),
        isActive: false
      });

      // Act
      const result = await userService.authenticate(email, password);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Account is inactive');
      expect(mockLogger.info).toHaveBeenCalledWith('Authentication rejected - inactive account', { email });
    });
  });
});

// Implementation that emerges from TDD
class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    // Check for existing user
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const user = await this.userRepository.save({
      email: userData.email,
      name: userData.name,
      hashedPassword,
      isActive: true,
      createdAt: new Date()
    });

    this.logger.info('User created successfully', { userId: user.id });

    // Send welcome email (non-blocking)
    try {
      await this.emailService.sendWelcomeEmail(userData.email, userData.name);
    } catch (error) {
      this.logger.error('Failed to send welcome email', {
        userId: user.id,
        error: error.message
      });
    }

    return user;
  }

  async authenticate(email, password) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      this.logger.info('Authentication failed - user not found', { email });
      return { success: false, error: 'Invalid credentials' };
    }

    if (!user.isActive) {
      this.logger.info('Authentication rejected - inactive account', { email });
      return { success: false, error: 'Account is inactive' };
    }

    const passwordValid = await this.verifyPassword(password, user.hashedPassword);
    
    if (!passwordValid) {
      this.logger.info('Authentication failed - invalid password', { email });
      return { success: false, error: 'Invalid credentials' };
    }

    this.logger.info('User authenticated successfully', { userId: user.id });
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async hashPassword(password) {
    // Implementation would use bcrypt or similar
    const bcrypt = require('bcrypt');
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password, hashedPassword) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, hashedPassword);
  }
}

export { UserService };
```

## TDD for React Components

```javascript
// ReactTDD.test.jsx - TDD for React Component Development

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TDDFramework } from './tdd-framework';

describe('User Registration Form TDD', () => {
  let tddFramework;

  beforeEach(() => {
    tddFramework = new TDDFramework();
  });

  // RED PHASE: Write failing tests first
  describe('Form rendering', () => {
    it('should render registration form with required fields', () => {
      // This will fail - UserRegistrationForm doesn't exist yet
      render(<UserRegistrationForm />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('should display form title', () => {
      render(<UserRegistrationForm />);
      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    });
  });

  // After implementing basic form structure...
  
  describe('Form validation', () => {
    beforeEach(() => {
      render(<UserRegistrationForm />);
    });

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      const emailInput = screen.getByLabelText(/email/i);
      
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur event

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText(/^password$/i);
      
      await user.type(passwordInput, '123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup();
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'different123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should disable submit button when form is invalid', async () => {
      const submitButton = screen.getByRole('button', { name: /register/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is valid', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'securePassword123');
      await user.type(screen.getByLabelText(/confirm password/i), 'securePassword123');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /register/i })).toBeEnabled();
      });
    });
  });

  describe('Form submission', () => {
    let mockOnSubmit;

    beforeEach(() => {
      mockOnSubmit = jest.fn().mockResolvedValue({ success: true });
      render(<UserRegistrationForm onSubmit={mockOnSubmit} />);
    });

    it('should call onSubmit with form data when submitted', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'securePassword123');
      await user.type(screen.getByLabelText(/confirm password/i), 'securePassword123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'securePassword123'
        });
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'securePassword123');
      await user.type(screen.getByLabelText(/confirm password/i), 'securePassword123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    });

    it('should handle submission errors', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Registration failed'));
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password$/i), 'securePassword123');
      await user.type(screen.getByLabelText(/confirm password/i), 'securePassword123');
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
      });
    });
  });
});

// Implementation driven by TDD - built incrementally
const UserRegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field) => () => {
    // Validate individual field on blur
    const newErrors = { ...errors };

    if (field === 'email' && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (field === 'password' && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (field === 'confirmPassword' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit({
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      setSubmitError(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = validateEmail(formData.email) && 
                     validatePassword(formData.password) && 
                     formData.password === formData.confirmPassword;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          onBlur={handleBlur('email')}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          onBlur={handleBlur('password')}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>

      {submitError && <div className="error">{submitError}</div>}

      <button 
        type="submit" 
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
};

export { UserRegistrationForm };
```

## TDD Best Practices and Common Pitfalls

### TDD Best Practices

```javascript
// TDDBestPractices.js - Examples of TDD Best Practices

// ✅ GOOD: Small, focused test
test('should calculate area of rectangle', () => {
  const rectangle = new Rectangle(5, 3);
  expect(rectangle.getArea()).toBe(15);
});

// ❌ BAD: Test too large, testing multiple concepts
test('should create rectangle and calculate area and perimeter and validate dimensions', () => {
  // Too much in one test
});

// ✅ GOOD: Test describes behavior, not implementation
test('should notify user when order is placed', () => {
  const order = new Order();
  const notificationSpy = jest.spyOn(notificationService, 'notify');
  
  order.place();
  
  expect(notificationSpy).toHaveBeenCalledWith('Order placed successfully');
});

// ❌ BAD: Test knows too much about implementation
test('should call internal validateOrder method when placing order', () => {
  // Testing implementation details, not behavior
});

// ✅ GOOD: Clear arrange, act, assert structure
test('should apply discount to order total', () => {
  // Arrange
  const order = new Order();
  order.addItem({ price: 100 });
  const discount = new PercentageDiscount(10);
  
  // Act
  order.applyDiscount(discount);
  
  // Assert
  expect(order.getTotal()).toBe(90);
});

// ✅ GOOD: Tests are independent
describe('Order processing', () => {
  let order;
  
  beforeEach(() => {
    order = new Order(); // Fresh instance for each test
  });
  
  test('should add item to empty order', () => {
    order.addItem({ name: 'Laptop', price: 1000 });
    expect(order.getItemCount()).toBe(1);
  });
  
  test('should calculate correct total', () => {
    order.addItem({ name: 'Laptop', price: 1000 });
    expect(order.getTotal()).toBe(1000);
  });
});
```

### Common TDD Pitfalls and Solutions

```javascript
// TDDPitfalls.js - Common Mistakes and How to Avoid Them

class TDDPitfallsExample {
  
  // ❌ PITFALL 1: Writing too many tests at once
  // Instead of following Red-Green-Refactor, writing multiple failing tests
  avoidWritingTooManyTestsAtOnce() {
    // WRONG:
    // it('should validate email')
    // it('should validate password') 
    // it('should validate name')
    // it('should validate age')
    // ... (all failing at once)
    
    // RIGHT: Write one test, make it pass, then next test
    describe('User validation - TDD approach', () => {
      test('should validate email format', () => {
        const validator = new UserValidator();
        expect(() => validator.validate({ email: 'invalid' }))
          .toThrow('Invalid email format');
      });
      
      // Only write next test after previous one passes
    });
  }

  // ❌ PITFALL 2: Not refactoring regularly
  // Writing code to pass tests but never cleaning up
  rememberToRefactor() {
    // After making test pass with minimal code:
    class Calculator {
      add(a, b) {
        return a + b; // Simple implementation
      }
      
      // Later, refactor without changing behavior:
      addNumbers(...numbers) {
        return numbers.reduce((sum, num) => {
          if (typeof num !== 'number') {
            throw new Error('All arguments must be numbers');
          }
          return sum + num;
        }, 0);
      }
    }
  }

  // ❌ PITFALL 3: Testing implementation details
  // Tests that break when refactoring even if behavior unchanged
  focusOnBehaviorNotImplementation() {
    // WRONG: Testing internal method calls
    test('should call validatePassword when authenticating', () => {
      const authService = new AuthService();
      const spy = jest.spyOn(authService, 'validatePassword');
      
      authService.authenticate('user', 'pass');
      
      expect(spy).toHaveBeenCalled(); // Fragile - breaks if refactored
    });

    // RIGHT: Testing observable behavior
    test('should reject authentication with invalid password', () => {
      const authService = new AuthService();
      
      const result = authService.authenticate('user', 'wrongpass');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  }

  // ❌ PITFALL 4: Not using appropriate test doubles
  // Real dependencies making tests slow/unreliable
  useAppropriateTestDoubles() {
    // WRONG: Using real database in unit tests
    test('should save user to database', async () => {
      const userService = new UserService(realDatabase); // Slow, unreliable
      // ...
    });

    // RIGHT: Using mock for unit test
    test('should save user data', async () => {
      const mockRepository = {
        save: jest.fn().mockResolvedValue({ id: 1 })
      };
      const userService = new UserService(mockRepository);
      
      const result = await userService.createUser(userData);
      
      expect(mockRepository.save).toHaveBeenCalledWith(userData);
      expect(result.id).toBe(1);
    });
  }

  // ❌ PITFALL 5: Tests that are hard to understand
  // Unclear test names and complex setup
  writeReadableTests() {
    // WRONG: Unclear test name and complex setup
    test('test1', () => {
      const x = new Thing();
      x.a = 5;
      x.b = 3;
      const y = x.doStuff();
      expect(y).toBe(8);
    });

    // RIGHT: Clear name and intention
    test('should sum width and height when calculating rectangle area', () => {
      const rectangle = new Rectangle({ width: 5, height: 3 });
      
      const area = rectangle.calculateArea();
      
      expect(area).toBe(15);
    });
  }

  // ✅ SOLUTION: TDD Checklist for each cycle
  tddChecklist() {
    return {
      red: [
        'Write the smallest possible failing test',
        'Test describes desired behavior, not implementation',
        'Test name clearly explains what should happen',
        'Only one test fails at a time'
      ],
      green: [
        'Write minimal code to make test pass',
        'Don\'t add functionality not required by test',
        'It\'s okay if code is not perfect yet',
        'All tests should pass'
      ],
      refactor: [
        'Improve code design while keeping tests green',
        'Extract methods, improve naming, eliminate duplication',
        'Refactor both production code and test code',
        'All tests should still pass after refactoring'
      ]
    };
  }
}

export { TDDPitfallsExample };
```

## Summary

Test-Driven Development fundamentally changes how we approach software development by putting tests first, leading to better design, higher confidence, and more maintainable code. Our comprehensive TDD framework provides:

**Key Benefits:**
1. **Design Quality**: Tests drive better API design and cleaner interfaces
2. **Confidence**: Comprehensive test suite provides safety for refactoring and changes
3. **Documentation**: Tests serve as living documentation of system behavior
4. **Faster Development**: Immediate feedback reduces debugging time
5. **Regression Prevention**: Tests catch regressions before they reach production

**TDD Framework Features:**
- **Red-Green-Refactor Cycle Tracking**: Monitors and guides TDD progression
- **Watch Mode**: Automatic test running on file changes
- **Cycle Metrics**: Analyzes TDD patterns and provides improvement suggestions
- **Test Doubles Factory**: Easy creation of spies, stubs, mocks, and fakes
- **BDD Integration**: Behavior-driven test structure for better communication

**Real-World Applications:**
- Shopping cart functionality development
- User authentication system implementation
- React component development with testing
- API service creation with proper error handling
- Form validation and submission logic
- Complex business logic implementation

**Best Practices Enforced:**
- Small, focused tests that describe single behaviors
- Clear arrange-act-assert structure
- Independent tests that don't rely on each other
- Focus on behavior rather than implementation details
- Regular refactoring while maintaining green tests
- Appropriate use of test doubles for isolation

This TDD approach ensures that code is thoroughly tested, well-designed, and maintainable while providing developers with the confidence to make changes and improvements continuously.
