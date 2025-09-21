---
title: "Unit Testing with Jest"
description: "Write fast unit tests for NodeJs apps with Jest: setup, test structure, assertions, mocks/spies, coverage, and practical patterns for pure functions and modules."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - testing
  - jest
resources:
  - title: "Jest Docs"
    type: "documentation"
    url: "https://jestjs.io/docs/getting-started"
    description: "Official Jest getting started and API"
  - title: "Expect API"
    type: "documentation"
    url: "https://jestjs.io/docs/expect"
    description: "Assertion API for Jest"
  - title: "Mock Functions"
    type: "documentation"
    url: "https://jestjs.io/docs/mock-functions"
    description: "Mocks, spies, and modules in Jest"
  - title: "ts-jest"
    type: "tool"
    url: "https://kulshekhar.github.io/ts-jest/"
    description: "TypeScript preprocessor for Jest"
---

![Unit Testing with Jest](https://res.cloudinary.com/duojkrgue/image/upload/v1757930698/Portfolio/nodeJsCourse/23_ztwhz3.png)

<!-- # 📖 My Personal Notes – Unit Testing with Jest -->

Testing used to feel like a chore until I realized it's my safety net for refactoring and my documentation for how code should behave. Jest makes testing in NodeJs actually enjoyable. Here's everything I've learned about writing effective unit tests.

## Why Jest Over Other Testing Frameworks?

Jest won me over because it's:
- **Zero config** for most NodeJs projects
- **Built-in mocking** without extra libraries
- **Snapshot testing** for UI components
- **Great error messages** that actually help debug
- **Parallel test execution** for speed
- **Coverage reports** out of the box

## 🚀 Setting Up Jest for NodeJs

### Basic Setup
```bash
# Install Jest and types
npm install --save-dev jest @types/jest

# For TypeScript projects
npm install --save-dev ts-jest typescript
npx ts-jest config:init
```

### package.json Configuration
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.{js,ts}",
      "!src/**/*.d.ts",
      "!src/index.ts"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Jest Configuration File (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.test.{js,ts}',
    '**/*.{test,spec}.{js,ts}'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/types/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  clearMocks: true,
  restoreMocks: true
}
```

## 📝 Writing Your First Tests

### Simple Function Testing
```typescript
// src/utils/math.ts
export function add(a: number, b: number): number {
  return a + b
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero')
  }
  return a / b
}

export function isEven(num: number): boolean {
  return num % 2 === 0
}

// __tests__/utils/math.test.ts
import { add, divide, isEven } from '../../src/utils/math'

describe('Math utilities', () => {
  describe('add()', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should handle negative numbers', () => {
      expect(add(-1, 1)).toBe(0)
      expect(add(-5, -3)).toBe(-8)
    })

    it('should handle decimal numbers', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3)
    })
  })

  describe('divide()', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5)
    })

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero')
    })

    it('should handle decimal results', () => {
      expect(divide(1, 3)).toBeCloseTo(0.333, 2)
    })
  })

  describe('isEven()', () => {
    test.each([
      [2, true],
      [4, true],
      [1, false],
      [3, false],
      [0, true]
    ])('isEven(%i) should return %s', (input, expected) => {
      expect(isEven(input)).toBe(expected)
    })
  })
})
```

## 🎭 Mocking and Spying

### Basic Mocks
```typescript
// src/services/emailService.ts
export class EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // In real implementation, this would send an email
    console.log(`Sending email to ${to}: ${subject}`)
  }
}

// src/services/userService.ts
import { EmailService } from './emailService'

export class UserService {
  constructor(private emailService: EmailService) {}

  async createUser(userData: { name: string; email: string }): Promise<{ id: string; name: string; email: string }> {
    // Create user logic here
    const user = {
      id: 'user-123',
      ...userData
    }

    // Send welcome email
    await this.emailService.sendEmail(
      user.email,
      'Welcome!',
      `Hello ${user.name}, welcome to our platform!`
    )

    return user
  }
}

// __tests__/services/userService.test.ts
import { UserService } from '../../src/services/userService'
import { EmailService } from '../../src/services/emailService'

// Mock the entire EmailService
jest.mock('../../src/services/emailService')

describe('UserService', () => {
  let userService: UserService
  let mockEmailService: jest.Mocked<EmailService>

  beforeEach(() => {
    // Create a mocked instance
    mockEmailService = new EmailService() as jest.Mocked<EmailService>
    userService = new UserService(mockEmailService)
  })

  describe('createUser()', () => {
    it('should create user and send welcome email', async () => {
      const userData = { name: 'Rahul', email: 'rahul@example.com' }

      const user = await userService.createUser(userData)

      expect(user).toEqual({
        id: 'user-123',
        name: 'Rahul',
        email: 'rahul@example.com'
      })

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        'rahul@example.com',
        'Welcome!',
        'Hello Rahul, welcome to our platform!'
      )
      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1)
    })
  })
})
```

### Manual Mocks with Jest Functions
```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string) => console.log(`INFO: ${message}`),
  error: (message: string) => console.error(`ERROR: ${message}`),
  warn: (message: string) => console.warn(`WARN: ${message}`)
}

// src/services/orderService.ts
import { logger } from '../utils/logger'

export class OrderService {
  async processOrder(orderId: string): Promise<{ success: boolean; orderId: string }> {
    try {
      logger.info(`Processing order ${orderId}`)
      
      // Simulate order processing
      if (orderId === 'invalid') {
        throw new Error('Invalid order ID')
      }

      logger.info(`Order ${orderId} processed successfully`)
      return { success: true, orderId }
    } catch (error) {
      logger.error(`Failed to process order ${orderId}: ${error.message}`)
      throw error
    }
  }
}

// __tests__/services/orderService.test.ts
import { OrderService } from '../../src/services/orderService'
import { logger } from '../../src/utils/logger'

// Mock the logger module
jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}))

const mockLogger = logger as jest.Mocked<typeof logger>

describe('OrderService', () => {
  let orderService: OrderService

  beforeEach(() => {
    orderService = new OrderService()
    jest.clearAllMocks()
  })

  describe('processOrder()', () => {
    it('should process valid order and log info', async () => {
      const result = await orderService.processOrder('order-123')

      expect(result).toEqual({ success: true, orderId: 'order-123' })
      expect(mockLogger.info).toHaveBeenCalledWith('Processing order order-123')
      expect(mockLogger.info).toHaveBeenCalledWith('Order order-123 processed successfully')
      expect(mockLogger.error).not.toHaveBeenCalled()
    })

    it('should handle invalid order and log error', async () => {
      await expect(orderService.processOrder('invalid')).rejects.toThrow('Invalid order ID')

      expect(mockLogger.info).toHaveBeenCalledWith('Processing order invalid')
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to process order invalid: Invalid order ID')
    })
  })
})
```

## 🕐 Testing Async Code

### Promises and Async/Await
```typescript
// src/services/apiService.ts
export class ApiService {
  async fetchUser(id: string): Promise<{ id: string; name: string }> {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`)
    }
    return response.json()
  }

  async fetchUsersWithRetry(maxRetries = 3): Promise<any[]> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch('/api/users')
        if (response.ok) {
          return response.json()
        }
        throw new Error(`HTTP ${response.status}`)
      } catch (error) {
        if (attempt === maxRetries) {
          throw error
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
    return []
  }
}

// __tests__/services/apiService.test.ts
import { ApiService } from '../../src/services/apiService'

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('ApiService', () => {
  let apiService: ApiService

  beforeEach(() => {
    apiService = new ApiService()
    jest.clearAllMocks()
  })

  describe('fetchUser()', () => {
    it('should fetch user successfully', async () => {
      const mockUser = { id: '123', name: 'Rahul' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUser)
      } as any)

      const result = await apiService.fetchUser('123')

      expect(result).toEqual(mockUser)
      expect(mockFetch).toHaveBeenCalledWith('/api/users/123')
    })

    it('should throw error for failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      } as any)

      await expect(apiService.fetchUser('999')).rejects.toThrow('Failed to fetch user: 404')
    })
  })

  describe('fetchUsersWithRetry()', () => {
    it('should succeed on first attempt', async () => {
      const mockUsers = [{ id: '1', name: 'User 1' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUsers)
      } as any)

      const result = await apiService.fetchUsersWithRetry()

      expect(result).toEqual(mockUsers)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const mockUsers = [{ id: '1', name: 'User 1' }]
      
      // First attempt fails
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 } as any)
      // Second attempt succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUsers)
      } as any)

      const result = await apiService.fetchUsersWithRetry(3)

      expect(result).toEqual(mockUsers)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    }, 10000) // Increase timeout for retry logic
  })
})
```

## ⏰ Testing Timers and Dates

### Using Jest Fake Timers
```typescript
// src/utils/scheduler.ts
export class TaskScheduler {
  private tasks: Map<string, NodeJS.Timeout> = new Map()

  scheduleTask(taskId: string, callback: () => void, delayMs: number): void {
    this.cancelTask(taskId) // Cancel existing task if any
    
    const timeoutId = setTimeout(callback, delayMs)
    this.tasks.set(taskId, timeoutId)
  }

  cancelTask(taskId: string): void {
    const timeoutId = this.tasks.get(taskId)
    if (timeoutId) {
      clearTimeout(timeoutId)
      this.tasks.delete(taskId)
    }
  }

  scheduleRecurring(taskId: string, callback: () => void, intervalMs: number): void {
    this.cancelTask(taskId)
    
    const intervalId = setInterval(callback, intervalMs)
    this.tasks.set(taskId, intervalId as any)
  }
}

// __tests__/utils/scheduler.test.ts
import { TaskScheduler } from '../../src/utils/scheduler'

describe('TaskScheduler', () => {
  let scheduler: TaskScheduler
  let mockCallback: jest.MockedFunction<() => void>

  beforeEach(() => {
    scheduler = new TaskScheduler()
    mockCallback = jest.fn()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('scheduleTask()', () => {
    it('should execute task after specified delay', () => {
      scheduler.scheduleTask('task1', mockCallback, 1000)

      expect(mockCallback).not.toHaveBeenCalled()

      jest.advanceTimersByTime(999)
      expect(mockCallback).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous task when scheduling new one with same ID', () => {
      const firstCallback = jest.fn()
      const secondCallback = jest.fn()

      scheduler.scheduleTask('task1', firstCallback, 1000)
      scheduler.scheduleTask('task1', secondCallback, 2000)

      jest.advanceTimersByTime(1000)
      expect(firstCallback).not.toHaveBeenCalled()
      expect(secondCallback).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1000)
      expect(firstCallback).not.toHaveBeenCalled()
      expect(secondCallback).toHaveBeenCalledTimes(1)
    })
  })

  describe('scheduleRecurring()', () => {
    it('should execute task repeatedly', () => {
      scheduler.scheduleRecurring('recurring1', mockCallback, 500)

      jest.advanceTimersByTime(499)
      expect(mockCallback).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(mockCallback).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(500)
      expect(mockCallback).toHaveBeenCalledTimes(2)

      jest.advanceTimersByTime(500)
      expect(mockCallback).toHaveBeenCalledTimes(3)
    })
  })
})
```

## 📊 Testing with Different Data Sets

### Parameterized Tests
```typescript
// src/utils/validation.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one digit')
  }

  return { valid: errors.length === 0, errors }
}

// __tests__/utils/validation.test.ts
import { validateEmail, validatePassword } from '../../src/utils/validation'

describe('Validation utilities', () => {
  describe('validateEmail()', () => {
    test.each([
      ['valid@example.com', true],
      ['user.name@domain.co', true],
      ['test+tag@example.org', true],
      ['invalid-email', false],
      ['@domain.com', false],
      ['user@', false],
      ['user@domain', false],
      ['', false]
    ])('validateEmail("%s") should return %s', (email, expected) => {
      expect(validateEmail(email)).toBe(expected)
    })
  })

  describe('validatePassword()', () => {
    test.each([
      ['Password123', { valid: true, errors: [] }],
      ['StrongP@ss1', { valid: true, errors: [] }],
      ['weak', { 
        valid: false, 
        errors: [
          'Password must be at least 8 characters long',
          'Password must contain at least one digit'
        ] 
      }],
      ['password123', { 
        valid: false, 
        errors: ['Password must contain at least one uppercase letter'] 
      }],
      ['PASSWORD123', { 
        valid: false, 
        errors: ['Password must contain at least one lowercase letter'] 
      }],
      ['PasswordABC', { 
        valid: false, 
        errors: ['Password must contain at least one digit'] 
      }]
    ])('validatePassword("%s") should return %j', (password, expected) => {
      expect(validatePassword(password)).toEqual(expected)
    })
  })
})
```

## 🏗️ Testing Classes and Complex Objects

### Testing with Setup and Teardown
```typescript
// src/models/shoppingCart.ts
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export class ShoppingCart {
  private items: Map<string, CartItem> = new Map()

  addItem(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
    const existingItem = this.items.get(item.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      this.items.set(item.id, { ...item, quantity })
    }
  }

  removeItem(itemId: string): void {
    this.items.delete(itemId)
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId)
      return
    }

    const item = this.items.get(itemId)
    if (item) {
      item.quantity = quantity
    }
  }

  getTotal(): number {
    return Array.from(this.items.values())
      .reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values())
  }

  clear(): void {
    this.items.clear()
  }
}

// __tests__/models/shoppingCart.test.ts
import { ShoppingCart, CartItem } from '../../src/models/shoppingCart'

describe('ShoppingCart', () => {
  let cart: ShoppingCart
  let sampleItem: Omit<CartItem, 'quantity'>

  beforeEach(() => {
    cart = new ShoppingCart()
    sampleItem = {
      id: 'item1',
      name: 'Test Product',
      price: 10.99
    }
  })

  describe('addItem()', () => {
    it('should add new item to cart', () => {
      cart.addItem(sampleItem, 2)

      const items = cart.getItems()
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual({
        id: 'item1',
        name: 'Test Product',
        price: 10.99,
        quantity: 2
      })
    })

    it('should increase quantity for existing item', () => {
      cart.addItem(sampleItem, 1)
      cart.addItem(sampleItem, 2)

      const items = cart.getItems()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(3)
    })

    it('should default to quantity 1 if not specified', () => {
      cart.addItem(sampleItem)

      const items = cart.getItems()
      expect(items[0].quantity).toBe(1)
    })
  })

  describe('getTotal()', () => {
    it('should return 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0)
    })

    it('should calculate total for single item', () => {
      cart.addItem(sampleItem, 2)
      expect(cart.getTotal()).toBeCloseTo(21.98, 2)
    })

    it('should calculate total for multiple items', () => {
      cart.addItem(sampleItem, 2)
      cart.addItem({
        id: 'item2',
        name: 'Another Product',
        price: 5.50
      }, 1)

      expect(cart.getTotal()).toBeCloseTo(27.48, 2)
    })
  })

  describe('updateQuantity()', () => {
    beforeEach(() => {
      cart.addItem(sampleItem, 3)
    })

    it('should update item quantity', () => {
      cart.updateQuantity('item1', 5)

      const items = cart.getItems()
      expect(items[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0', () => {
      cart.updateQuantity('item1', 0)

      expect(cart.getItems()).toHaveLength(0)
    })

    it('should remove item when quantity is negative', () => {
      cart.updateQuantity('item1', -1)

      expect(cart.getItems()).toHaveLength(0)
    })

    it('should do nothing for non-existent item', () => {
      cart.updateQuantity('non-existent', 5)

      expect(cart.getItems()).toHaveLength(1)
    })
  })
})
```

## 📈 Code Coverage and Quality

### Coverage Configuration
```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/types/**/*',
    '!src/**/*.interface.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/utils/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
```

### Test Quality Patterns I Follow

```typescript
// ✅ GOOD - Descriptive test names
describe('UserService.createUser()', () => {
  it('should create user with valid data and return user object', () => {})
  it('should throw ValidationError when email is invalid', () => {})
  it('should hash password before saving to database', () => {})
})

// ❌ BAD - Generic test names
describe('UserService', () => {
  it('should work', () => {})
  it('should fail', () => {})
})

// ✅ GOOD - Test one thing at a time
it('should send welcome email after creating user', async () => {
  const userData = { name: 'Test', email: 'test@example.com' }
  
  await userService.createUser(userData)
  
  expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
    'test@example.com',
    'Welcome!',
    expect.stringContaining('Test')
  )
})

// ❌ BAD - Testing multiple things
it('should create user and send email and log activity', async () => {
  // Too many assertions in one test
})

// ✅ GOOD - Arrange, Act, Assert pattern
it('should calculate discount for premium users', () => {
  // Arrange
  const user = { type: 'premium', purchaseAmount: 100 }
  const discountService = new DiscountService()
  
  // Act
  const discount = discountService.calculateDiscount(user)
  
  // Assert
  expect(discount).toBe(10)
})
```

## 🛠️ My Testing Best Practices

### 1. Test Structure and Organization
```
__tests__/
├── unit/
│   ├── utils/
│   ├── services/
│   └── models/
├── integration/
└── setup.ts
```

### 2. Test Setup File
```typescript
// tests/setup.ts
import 'dotenv/config'

// Global test configuration
beforeAll(() => {
  // Database setup, etc.
})

afterAll(() => {
  // Cleanup
})

// Mock console methods in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}

// Custom matchers
expect.extend({
  toBeValidEmail(received: string) {
    const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(received)
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid email`,
      pass
    }
  }
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidEmail(): R
    }
  }
}
```

### 3. Factory Functions for Test Data
```typescript
// tests/factories/userFactory.ts
export const createUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
  ...overrides
})

export const createUsers = (count: number): User[] => 
  Array.from({ length: count }, (_, i) => 
    createUser({ id: `user-${i}`, name: `User ${i}` })
  )

// Usage in tests
it('should handle multiple users', () => {
  const users = createUsers(3)
  const result = userService.processUsers(users)
  expect(result).toHaveLength(3)
})
```

### 4. Testing Error Conditions
```typescript
describe('Error handling', () => {
  it('should throw specific error for invalid input', () => {
    expect(() => processData(null)).toThrow('Input cannot be null')
    expect(() => processData(null)).toThrow(ValidationError)
  })

  it('should handle async errors', async () => {
    mockApiCall.mockRejectedValueOnce(new Error('Network error'))
    
    await expect(service.fetchData()).rejects.toThrow('Network error')
  })
})
```

---

Unit testing with Jest has transformed how I write code. I now write tests first (TDD style) for complex logic, and my code is more modular and easier to maintain. The key is starting small and building good habits around test organization and naming.

Remember: tests are documentation that never lies. Write them for your future self and your teammates!