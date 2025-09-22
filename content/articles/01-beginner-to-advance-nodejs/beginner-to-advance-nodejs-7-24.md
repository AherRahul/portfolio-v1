---
title: "Integration Testing with Supertest"
description: "Test Express API end-to-end with Supertest. Learn setup, lifecycle hooks, test database strategies, and writing assertions for routes, status codes, and payloads."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - testing
  - supertest
resources:
  - title: "Supertest"
    type: "documentation"
    url: "https://github.com/ladjs/supertest"
    description: "HTTP assertions made easy for NodeJs"
  - title: "Jest Docs"
    type: "documentation"
    url: "https://jestjs.io/docs/getting-started"
    description: "Use Supertest with Jest"
  - title: "Testing Express Apps"
    type: "article"
    url: "https://expressjs.com/en/advanced/best-practice-performance.html#make-your-app-production-ready"
    description: "Express tips including testing guidance"
---

![Integration Testing with Supertest](https://res.cloudinary.com/duojkrgue/image/upload/v1757930699/Portfolio/nodeJsCourse/24_stv3gh.png)

<!-- # 📖 My Personal Notes – Integration Testing with Supertest -->

Integration tests give me confidence that my API actually works when all the pieces come together. Supertest makes testing Express apps feel natural—like using the API from a client's perspective. Here's how I test my API properly.

## Why Integration Tests Matter

Unit tests are great for individual functions, but integration tests ensure:
- Routes work with real middleware
- Database operations complete successfully  
- Authentication flows function correctly
- Error responses are properly formatted
- The entire request/response cycle works

Think of integration tests as testing your API the way a frontend or mobile app would use it.

## 🚀 Setting Up Supertest

### Installation
```bash
npm install --save-dev supertest @types/supertest
npm install --save-dev jest @types/jest
```

### Basic App Structure for Testing
```typescript
// src/app.ts - Separate app creation from server startup
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorHandler } from './middleware/errorHandler'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'

export function createApp() {
  const app = express()

  // Middleware
  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Routes
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)

  // Error handling
  app.use(errorHandler)

  return app
}

// src/server.ts - Actual server startup
import { createApp } from './app'

const app = createApp()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## 🧪 Basic Integration Tests

### Simple API Testing
```typescript
// __tests__/integration/health.test.ts
import request from 'supertest'
import { createApp } from '../../src/app'

const app = createApp()

describe('Health Endpoint', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toEqual({
        status: 'ok',
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      })
    })

    it('should have correct content type', async () => {
      await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
    })
  })
})
```

### Testing CRUD Operations
```typescript
// __tests__/integration/users.test.ts
import request from 'supertest'
import { createApp } from '../../src/app'
import { connectDB, disconnectDB, clearDB } from '../helpers/database'
import { createAuthToken } from '../helpers/auth'

const app = createApp()

describe('Users API', () => {
  beforeAll(async () => {
    await connectDB()
  })

  afterAll(async () => {
    await disconnectDB()
  })

  beforeEach(async () => {
    await clearDB()
  })

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Rahul Aher',
        email: 'rahul@example.com',
        password: 'SecurePass123'
      }

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)

      expect(response.body).toMatchObject({
        user: {
          id: expect.any(String),
          name: 'Rahul Aher',
          email: 'rahul@example.com'
        }
      })

      // Ensure password is not returned
      expect(response.body.user.password).toBeUndefined()
    })

    it('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)

      // Attempt to create duplicate
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400)

      expect(response.body).toEqual({
        error: 'User already exists'
      })
    })
  })

  describe('GET /api/users', () => {
    it('should return users for authenticated request', async () => {
      // Create a user first
      const user = await createTestUser()
      const token = createAuthToken(user.id)

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toMatchObject({
        users: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            email: expect.any(String)
          })
        ])
      })
    })

    it('should return 401 for unauthenticated request', async () => {
      await request(app)
        .get('/api/users')
        .expect(401)
    })
  })
})
```

## 🔧 Test Database Setup

### MongoDB Memory Server
```typescript
// tests/helpers/database.ts
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

export async function connectDB() {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  await mongoose.connect(mongoUri)
}

export async function disconnectDB() {
  await mongoose.disconnect()
  if (mongoServer) {
    await mongoServer.stop()
  }
}

export async function clearDB() {
  const collections = mongoose.connection.collections
  
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}
```

## 🔐 Testing Authentication

### Complete Auth Flow
```typescript
// __tests__/integration/auth.test.ts
import request from 'supertest'
import { createApp } from '../../src/app'

const app = createApp()

describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'SecurePass123'
        })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123'
        })
        .expect(200)

      expect(response.body).toMatchObject({
        user: {
          id: expect.any(String),
          name: 'Test User',
          email: 'test@example.com'
        },
        token: expect.any(String)
      })
    })

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401)

      expect(response.body).toEqual({
        error: 'Invalid credentials'
      })
    })
  })
})
```

## 🎯 Testing Error Handling

### Comprehensive Error Cases
```typescript
describe('Error Handling', () => {
  it('should handle malformed JSON', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }')
      .expect(400)

    expect(response.body.error).toMatch(/invalid json/i)
  })

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app)
      .get('/api/non-existent')
      .expect(404)

    expect(response.body).toEqual({
      error: 'Route not found'
    })
  })

  it('should handle internal server errors gracefully', async () => {
    // Mock a service to throw an error
    jest.spyOn(UserService.prototype, 'findAll').mockRejectedValueOnce(
      new Error('Database connection failed')
    )

    const token = createAuthToken('valid-user-id')
    
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(500)

    expect(response.body).toEqual({
      error: 'Internal server error'
    })
  })
})
```

## 🧩 Test Helpers

### Reusable Utilities
```typescript
// tests/helpers/testHelpers.ts
import { User } from '../../src/models/User'
import jwt from 'jsonwebtoken'

export async function createTestUser(overrides = {}) {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePass123',
    ...overrides
  }

  const user = new User(userData)
  await user.save()
  return user
}

export function createAuthToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h'
  })
}

export async function createAuthenticatedUser() {
  const user = await createTestUser()
  const token = createAuthToken(user._id.toString())
  
  return { user, token }
}

// API Client Helper
export class ApiClient {
  constructor(private app: any, private token?: string) {}

  setAuth(token: string) {
    this.token = token
    return this
  }

  private addAuth(req: any) {
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`)
    }
    return req
  }

  get(path: string) {
    return this.addAuth(request(this.app).get(path))
  }

  post(path: string, data?: any) {
    const req = this.addAuth(request(this.app).post(path))
    return data ? req.send(data) : req
  }
}
```

## 📊 Testing File Uploads

### Multipart Form Testing
```typescript
describe('File Upload API', () => {
  it('should upload image successfully', async () => {
    const response = await request(app)
      .post('/api/upload/avatar')
      .attach('avatar', 'tests/fixtures/test-image.jpg')
      .expect(200)

    expect(response.body).toMatchObject({
      message: 'File uploaded successfully',
      file: {
        filename: expect.stringMatching(/\d+-test-image\.jpg/),
        size: expect.any(Number),
        mimetype: 'image/jpeg'
      }
    })
  })

  it('should reject non-image files', async () => {
    const response = await request(app)
      .post('/api/upload/avatar')
      .attach('avatar', 'tests/fixtures/test.txt')
      .expect(400)

    expect(response.body.error).toMatch(/only image files/i)
  })
})
```

## 🎪 Advanced Patterns

### Testing Middleware
```typescript
describe('Authentication Middleware', () => {
  it('should pass through valid token', async () => {
    const { token } = await createAuthenticatedUser()

    await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it('should reject expired token', async () => {
    const expiredToken = jwt.sign(
      { userId: 'some-id' }, 
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '-1h' }
    )

    await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401)
  })
})

describe('Rate Limiting', () => {
  it('should block requests after limit exceeded', async () => {
    // Exhaust rate limit
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' })
    }

    // Next request should be rate limited
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(429)
  })
})
```

## 💡 My Testing Best Practices

### Test Organization
```
__tests__/
├── integration/
│   ├── auth.test.ts
│   ├── users.test.ts
│   └── products.test.ts
├── helpers/
│   ├── database.ts
│   ├── auth.ts
│   └── testHelpers.ts
└── fixtures/
    ├── test-image.jpg
    └── sample-data.json
```

### Key Principles I Follow

1. **Isolate Tests**: Each test should be independent
2. **Test Real Scenarios**: Use actual HTTP requests, not mocked ones
3. **Test Error Cases**: Don't just test the happy path
4. **Use Test Databases**: Never test against production data
5. **Clean Up**: Reset state between tests
6. **Test Authentication**: Verify both success and failure cases

---

Integration testing with Supertest gives me the confidence to ship code knowing that my API work as expected. The key is testing the happy path, error cases, and edge conditions while keeping tests fast and isolated.

Remember: integration tests are your safety net for refactoring and your documentation for how the API should behave!


