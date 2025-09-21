---
title: "Error Handling & Logging in Express.js"
description: "Master error handling and logging in Express.js applications. Learn about centralized error handling, custom error classes, structured logging, capturing stack traces, and integrating with popular logging libraries like Winston and Morgan for production-ready applications."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - express
  - logging
  - error-handling
resources:
  - title: "Express Error Handling"
    type: "documentation"
    url: "https://expressjs.com/en/guide/error-handling.html"
    description: "Official Express error handling patterns"
  - title: "Winston"
    type: "tool"
    url: "https://github.com/winstonjs/winston"
    description: "Popular logging library for NodeJs"
  - title: "Morgan"
    type: "tool"
    url: "https://github.com/expressjs/morgan"
    description: "HTTP request logger middleware"
  - title: "Pino"
    type: "tool"
    url: "https://github.com/pinojs/pino"
    description: "High-performance logger for NodeJs"
  - title: "80/20 Guide to Express Error Handling"
    type: "article"
    url: "https://thecodebarbarian.com/80-20-guide-to-express-error-handling"
    description: "Practical guide to handling errors in Express"
---

![Error Handling & Logging in Express.js](https://res.cloudinary.com/duojkrgue/image/upload/v1757930696/Portfolio/nodeJsCourse/17_wgo1tp.png)

# 📖 Notes – Error Handling & Logging in Express.js

## Why Error Handling & Logging Matter

Imagine you're building a house. Error handling is like having **smoke detectors** - they alert you when something goes wrong. Logging is like having **security cameras** - they record what happened so you can investigate later.

In Express.js applications:
- **Error Handling** prevents crashes and provides meaningful responses to clients
- **Logging** helps you understand what's happening in your application and debug issues

***My takeaway: Good error handling and logging are the difference between a professional application and a hobby project.***

## Types of Errors in Express.js

### 1. **Synchronous Errors**
Errors that happen immediately in your code:

```javascript
app.get('/sync-error', (req, res, next) => {
  try {
    // This will throw an error
    const data = JSON.parse('invalid json');
    res.json(data);
  } catch (error) {
    // Express automatically catches synchronous errors
    next(error); // Pass to error handler
  }
});
```

### 2. **Asynchronous Errors**
Errors from async operations (databases, API, file operations):

```javascript
app.get('/async-error', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    // Must manually pass async errors to Express
    next(error);
  }
});

// Or use an async wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
}));
```

### 3. **Operational Errors**
Expected errors that can happen during normal operation:

```javascript
// User not found
// Invalid input data
// Database connection failure
// External API timeout
```

### 4. **Programming Errors**
Bugs in your code:

```javascript
// Typos in variable names
// Calling undefined functions
// Type errors
// Logic errors
```

## Custom Error Classes

Create meaningful error classes for different scenarios:

```javascript
// Base error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

// Usage examples
const checkUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const validateInput = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];
  
  if (!name) errors.push('Name is required');
  if (!email) errors.push('Email is required');
  
  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }
  
  next();
};
```

## Centralized Error Handling

Create a centralized error handler that catches all errors:

```javascript
// Global error handling middleware (must be last)
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Log the error
  console.error('🚨 ERROR:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Different responses for development vs production
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming error: don't leak details to client
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

// Use the error handler
app.use(globalErrorHandler);
```

## Advanced Error Handling Patterns

### 1. **Error Factory Function**

```javascript
const createError = (message, statusCode, errors = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  error.isOperational = true;
  
  if (errors) {
    error.errors = errors;
  }
  
  return error;
};

// Usage
app.post('/users', (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return next(createError('Name and email are required', 400));
  }
  
  // Continue processing...
});
```

### 2. **Async Error Wrapper with Context**

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    // Add request context to error
    err.requestId = req.id || 'unknown';
    err.endpoint = req.originalUrl;
    err.method = req.method;
    next(err);
  });
};

// Enhanced error logging
const enhancedErrorHandler = (err, req, res, next) => {
  const errorInfo = {
    id: err.requestId || 'unknown',
    message: err.message,
    stack: err.stack,
    endpoint: err.endpoint || req.originalUrl,
    method: err.method || req.method,
    statusCode: err.statusCode || 500,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query
  };
  
  console.error('🔥 Enhanced Error:', JSON.stringify(errorInfo, null, 2));
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    requestId: errorInfo.id
  });
};
```

### 3. **404 Handler**

```javascript
// Handle unmatched routes (404)
app.all('*', (req, res, next) => {
  const err = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(err);
});
```

## Logging in Express.js

### 1. **Basic Console Logging**

```javascript
const basicLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Log response time
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms`);
  });
  
  next();
};

app.use(basicLogger);
```

### 2. **Morgan HTTP Logger**

```bash
npm install morgan
```

```javascript
const morgan = require('morgan');

// Development logging
app.use(morgan('dev')); // Colored output

// Production logging
app.use(morgan('combined')); // Apache combined format

// Custom format
const customFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

app.use(morgan(customFormat));

// Log to file
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

// Skip certain requests
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400
}));
```

### 3. **Winston Logger**

```bash
npm install winston
```

```javascript
const winston = require('winston');

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'express-app' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If not in production, log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Custom middleware to use Winston
const winstonLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    if (res.statusCode >= 400) {
      logger.error('HTTP Error', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

app.use(winstonLogger);

// Use Winston in error handler
const winstonErrorHandler = (err, req, res, next) => {
  logger.error('Application Error', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode: err.statusCode || 500
  });
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

app.use(winstonErrorHandler);
```

## Structured Logging

### 1. **Request ID Tracking**

```javascript
const { v4: uuidv4 } = require('uuid');

// Add request ID to all requests
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Enhanced logger with request ID
const requestLogger = (req, res, next) => {
  logger.info('Request started', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.on('finish', () => {
    logger.info('Request completed', {
      requestId: req.id,
      statusCode: res.statusCode,
      method: req.method,
      url: req.originalUrl
    });
  });
  
  next();
};
```

### 2. **Performance Monitoring**

```javascript
const performanceLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    const performanceData = {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };
    
    if (duration > 1000) { // Log slow requests
      logger.warn('Slow request detected', performanceData);
    } else {
      logger.info('Performance metrics', performanceData);
    }
  });
  
  next();
};

app.use(performanceLogger);
```

## Production-Ready Error & Logging Setup

```javascript
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Winston logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'my-express-app' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Morgan with Winston
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

app.use(morgan('combined', { stream: morganStream }));

// Body parser
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info('Request received', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Your routes here...
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint', requestId: req.id });
});

// 404 handler
app.all('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  error.isOperational = true;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  // Log error with context
  logger.error('Application error', {
    requestId: req.id,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query
  });
  
  // Send response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    requestId: req.id
  };
  
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(err.statusCode).json(errorResponse);
});

// Graceful shutdown
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

const server = app.listen(3000, () => {
  logger.info('Server started on port 3000');
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});
```

## My Key Learnings

- **Error handling prevents crashes** - Catch errors early and handle them gracefully
- **Centralized error handling** - Use global error middleware for consistency
- **Custom error classes** - Create meaningful error types for different scenarios
- **Logging is essential** - Log both successes and failures for debugging
- **Structured logging** - Use consistent log formats with context (request ID, timestamps)
- **Different environments need different handling** - Show stack traces in development, hide them in production
- **Monitor performance** - Log slow requests and resource usage

---

Excellent! Now I know how to handle errors and logging like a pro! 🛡️

I'm Rahul Aher, and these are my learning notes on NodeJs. If you find these notes helpful, please share them with your friends. If you spot any errors or have improvements, feel free to contribute by [forking the repo](https://github.com/AherRahul/portfolio-v1). Let's learn together! Also, please consider giving a star ⭐ to [this repo](https://github.com/AherRahul/portfolio-v1). For any queries, [let's connect here](https://rahulaher.netlify.app/contact/).

Take care, see you in the next lesson! 😊
