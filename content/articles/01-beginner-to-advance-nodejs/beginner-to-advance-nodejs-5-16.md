---
title: "Middleware in Express.js"
description: "Understanding Express.js middleware - the heart of Express applications. Learn about different types of middleware, execution order, built-in middleware, third-party options, and how to create custom middleware for logging, validation, authentication, and error handling."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
resources:
  - title: "Express Middleware Guide"
    type: "documentation"
    url: "https://expressjs.com/en/guide/using-middleware.html"
    description: "Official Express guide to using middleware"
  - title: "Writing Middleware"
    type: "documentation"
    url: "https://expressjs.com/en/guide/writing-middleware.html"
    description: "How to write custom middleware in Express"
  - title: "Morgan"
    type: "tool"
    url: "https://github.com/expressjs/morgan"
    description: "HTTP request logger middleware"
  - title: "Helmet"
    type: "tool"
    url: "https://helmetjs.github.io/"
    description: "Security middleware to set various HTTP headers"
  - title: "Express Rate Limit"
    type: "tool"
    url: "https://github.com/nfriedly/express-rate-limit"
    description: "Rate limiting middleware to protect your API"
---

![Middleware in Express.js](https://res.cloudinary.com/duojkrgue/image/upload/v1757930697/Portfolio/nodeJsCourse/16_dtvljr.png)

# 📖 Notes – Middleware in Express.js

## What is Middleware?

**Middleware** is the heart of Express.js. Think of middleware as a series of functions that execute during the request-response cycle. Each middleware function has access to:
- `req` (request object)  
- `res` (response object)
- `next` (function to pass control to next middleware)

Imagine middleware as **security checkpoints at an airport**:
1. Check-in counter (authentication)
2. Security screening (validation)  
3. Passport control (authorization)
4. Gate (your route handler)

Each checkpoint can either **let you pass** (call `next()`) or **stop you** (send a response).

***My takeaway: Middleware is like a pipeline where each function can examine, modify, or stop the request before it reaches your route handler.***

## How Middleware Works

```javascript
const express = require('express');
const app = express();

// Middleware function
app.use((req, res, next) => {
  console.log('🔄 Middleware executed!');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Time:', new Date().toISOString());
  
  // MUST call next() to continue to next middleware/route
  next();
});

// Route handler
app.get('/', (req, res) => {
  res.send('Hello from route handler!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**What happens when you visit `http://localhost:3000/`:**
1. Middleware logs request details
2. Calls `next()` to pass control
3. Route handler sends response

## Types of Middleware

### 1. **Application-Level Middleware**
Runs for all routes or specific paths:

```javascript
// Runs for ALL requests
app.use((req, res, next) => {
  console.log('📝 Global middleware');
  next();
});

// Runs for specific path
app.use('/api', (req, res, next) => {
  console.log('🔐 API middleware');
  next();
});

// Multiple middleware for same path
app.use('/admin', 
  authenticateUser,
  checkAdminRole,
  (req, res, next) => {
    console.log('✅ Admin access granted');
    next();
  }
);
```

### 2. **Router-Level Middleware**
Works the same as application-level but bound to `express.Router()`:

```javascript
const router = express.Router();

// Router-specific middleware
router.use((req, res, next) => {
  console.log('🛣️ Router middleware');
  next();
});

router.get('/users', (req, res) => {
  res.json({ users: [] });
});

app.use('/api', router);
```

### 3. **Route-Specific Middleware**
Runs only for specific routes:

```javascript
// Single middleware
app.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'Protected content' });
});

// Multiple middleware
app.post('/admin/users', 
  authenticateUser,
  validateInput,
  checkPermissions,
  (req, res) => {
    res.json({ message: 'User created' });
  }
);
```

### 4. **Error-Handling Middleware**
Special middleware with 4 parameters (`err`, `req`, `res`, `next`):

```javascript
// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
```

### 5. **Built-in Middleware**
Express provides some built-in middleware:

```javascript
// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded forms
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Alternative with options
app.use('/static', express.static('public', {
  maxAge: '1d',
  etag: false
}));
```

## Middleware Execution Order

**Order matters!** Middleware executes in the order you define it:

```javascript
const express = require('express');
const app = express();

// 1. First middleware
app.use((req, res, next) => {
  console.log('1️⃣ First middleware');
  next();
});

// 2. Second middleware
app.use((req, res, next) => {
  console.log('2️⃣ Second middleware');
  next();
});

// 3. Route-specific middleware
app.get('/', 
  (req, res, next) => {
    console.log('3️⃣ Route middleware');
    next();
  },
  (req, res) => {
    console.log('4️⃣ Route handler');
    res.send('Response sent!');
  }
);

// 5. Error middleware (if error occurs)
app.use((err, req, res, next) => {
  console.log('5️⃣ Error middleware');
  res.status(500).send('Something broke!');
});
```

## Custom Middleware Examples

### 1. **Logger Middleware**

```javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent');
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  // Log response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`✅ Response sent in ${duration}ms`);
  });
  
  next();
};

app.use(logger);
```

### 2. **Authentication Middleware**

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  try {
    // In real app, verify JWT token
    if (token === 'valid-token') {
      req.user = { id: 1, name: 'John Doe' };
      next();
    } else {
      throw new Error('Invalid token');
    }
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Use in routes
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

### 3. **Validation Middleware**

```javascript
const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  
  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Valid email is required');
  }
  
  // Age validation
  if (!age || !Number.isInteger(age) || age < 1 || age > 120) {
    errors.push('Age must be a number between 1 and 120');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  // Sanitize data
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  
  next();
};

app.post('/users', validateUser, (req, res) => {
  // req.body is now validated and sanitized
  res.json({ message: 'User created', data: req.body });
});
```

### 4. **Rate Limiting Middleware**

```javascript
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean old entries
    for (const [id, data] of requests.entries()) {
      if (now - data.firstRequest > windowMs) {
        requests.delete(id);
      }
    }
    
    // Check current client
    if (!requests.has(clientId)) {
      requests.set(clientId, {
        count: 1,
        firstRequest: now
      });
      return next();
    }
    
    const clientData = requests.get(clientId);
    
    if (now - clientData.firstRequest < windowMs) {
      if (clientData.count >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later'
        });
      }
      clientData.count++;
    } else {
      // Reset window
      clientData.count = 1;
      clientData.firstRequest = now;
    }
    
    next();
  };
};

// Apply rate limiting
app.use('/api', rateLimit(50, 15 * 60 * 1000)); // 50 requests per 15 minutes
```

### 5. **CORS Middleware**

```javascript
const cors = (options = {}) => {
  const defaultOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  };
  
  const settings = { ...defaultOptions, ...options };
  
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', settings.origin);
    res.header('Access-Control-Allow-Methods', settings.methods.join(','));
    res.header('Access-Control-Allow-Headers', settings.allowedHeaders.join(','));
    
    if (settings.credentials) {
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  };
};

// Use CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  credentials: true
}));
```

## Popular Third-Party Middleware

### 1. **Morgan (HTTP Logging)**

```bash
npm install morgan
```

```javascript
const morgan = require('morgan');

// Built-in formats
app.use(morgan('combined')); // Apache combined log format
app.use(morgan('common'));   // Apache common log format
app.use(morgan('dev'));      // Colored output for development

// Custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
```

### 2. **Helmet (Security)**

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');

// Use all default protections
app.use(helmet());

// Or configure specific protections
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```

### 3. **Express-Rate-Limit**

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### 4. **Compression**

```bash
npm install compression
```

```javascript
const compression = require('compression');

app.use(compression({
  level: 6,
  threshold: 1024, // Only compress if > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

## Middleware Error Handling

### 1. **Async Middleware Wrapper**

```javascript
// Utility to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Use with async middleware
const databaseMiddleware = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  req.user = user;
  next();
});

app.get('/users/:id', databaseMiddleware, (req, res) => {
  res.json({ user: req.user });
});
```

### 2. **Custom Error Classes**

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage in middleware
const checkPermission = (permission) => (req, res, next) => {
  if (!req.user.permissions.includes(permission)) {
    return next(new AppError('Permission denied', 403));
  }
  next();
};

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
});
```

## Complete Middleware Example

```javascript
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Built-in middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Routes
app.get('/api/users', (req, res) => {
  res.json({
    message: 'Users endpoint',
    requestTime: req.requestTime
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!'
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## My Key Learnings

- **Middleware is the core of Express** - Almost everything in Express is middleware
- **Order matters** - Middleware executes in the order you define it
- **Always call `next()`** - Unless you're sending a response, always call `next()`
- **Error middleware is special** - It has 4 parameters and must be defined last
- **Middleware can modify req/res** - Add properties, validate data, check permissions
- **Async middleware needs error handling** - Use try-catch or wrapper functions
- **Third-party middleware saves time** - Don't reinvent the wheel for common tasks

---

Awesome! Now I understand how middleware powers Express.js applications! 🔧

I'm Rahul Aher, and these are my learning notes on NodeJs. If you find these notes helpful, please share them with your friends. If you spot any errors or have improvements, feel free to contribute by [forking the repo](https://github.com/AherRahul/portfolio-v1). Let's learn together! Also, please consider giving a star ⭐ to [this repo](https://github.com/AherRahul/portfolio-v1). For any queries, [let's connect here](https://rahulaher.netlify.app/contact/).

Take care, see you in the next lesson! 😊
