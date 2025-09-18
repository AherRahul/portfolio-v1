---
title: "Advanced Routing & Parameter Handling in Express.js"
description: "Master advanced routing patterns in Express.js including nested routers, route parameters, query string parsing, regular expressions in routes, route validation, and input sanitization strategies for building robust API."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - express
  - routing
  - parameters
resources:
  - title: "Express Routing Guide"
    type: "documentation"
    url: "https://expressjs.com/en/guide/routing.html"
    description: "Official Express routing documentation"
  - title: "Router API"
    type: "documentation"
    url: "https://expressjs.com/en/4x/api.html#router"
    description: "Complete Router API reference"
  - title: "Express Validator"
    type: "tool"
    url: "https://express-validator.github.io/docs/"
    description: "Validation and sanitization middleware"
  - title: "Joi"
    type: "tool"
    url: "https://joi.dev/"
    description: "Schema validation library"
  - title: "Express Performance Best Practices"
    type: "article"
    url: "https://expressjs.com/en/advanced/best-practice-performance.html"
    description: "Performance optimization tips for Express"
---

![Advanced Routing & Parameter Handling](https://res.cloudinary.com/duojkrgue/image/upload/v1757930697/Portfolio/nodeJsCourse/18_tfarkq.png)

# 📖 Notes – Advanced Routing & Parameter Handling in Express.js

## What is Advanced Routing?

While basic routing handles simple paths like `/users` or `/products`, **advanced routing** deals with complex scenarios like:
- Dynamic parameters (`/users/:id`)
- Query string parsing (`/search?q=nodejs&limit=10`)  
- Nested resources (`/users/:id/posts/:postId`)
- Route patterns with regex (`/files/*.txt`)
- Route validation and sanitization

Think of routing as the **GPS system** of your application - it needs to understand not just where to go, but how to handle different types of destinations and parameters.

***My takeaway: Advanced routing turns your Express app from a simple directory into a smart navigation system that can handle complex URL patterns and extract meaningful data from them.***

## Route Parameters

### 1. **Basic Route Parameters**

```javascript
const express = require('express');
const app = express();

// Single parameter
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ 
    message: `Getting user ${userId}`,
    userId: userId,
    type: typeof userId // Always string!
  });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({
    message: `Getting post ${postId} by user ${userId}`,
    userId,
    postId
  });
});

// Optional parameters with ?
app.get('/products/:id?', (req, res) => {
  if (req.params.id) {
    res.json({ message: `Product ${req.params.id}` });
  } else {
    res.json({ message: 'All products' });
  }
});
```

### 2. **Parameter Validation & Type Conversion**

```javascript
// Parameter validation middleware
const validateId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  
  // Check if ID is a valid number
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${paramName}. Must be a positive integer.`
    });
  }
  
  // Convert to number and add to req.params
  req.params[paramName] = parseInt(id, 10);
  next();
};

// Use validation middleware
app.get('/users/:id', validateId('id'), (req, res) => {
  const userId = req.params.id; // Now it's a number!
  res.json({ 
    userId,
    type: typeof userId // Now it's 'number'
  });
});

// UUID validation
const validateUUID = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${paramName}. Must be a valid UUID.`
    });
  }
  
  next();
};

app.get('/accounts/:accountId/users/:userId', 
  validateUUID('accountId'),
  validateId('userId'),
  (req, res) => {
    res.json({
      accountId: req.params.accountId,
      userId: req.params.userId
    });
  }
);
```

### 3. **Parameter Preprocessing with `app.param()`**

```javascript
// Automatically preprocess parameters
app.param('userId', async (req, res, next, userId) => {
  try {
    // Validate
    if (!/^\d+$/.test(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    // Convert to number
    const id = parseInt(userId, 10);
    
    // Fetch user from database (simulated)
    const user = await getUserById(id); // Your database function
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

// Now any route with :userId parameter will have req.user available
app.get('/users/:userId', (req, res) => {
  res.json({ user: req.user }); // User is already loaded!
});

app.get('/users/:userId/profile', (req, res) => {
  res.json({ profile: req.user.profile });
});

app.delete('/users/:userId', (req, res) => {
  // req.user is available here too
  res.json({ message: `User ${req.user.name} deleted` });
});

// Simulated database function
async function getUserById(id) {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  return users.find(user => user.id === id);
}
```

## Query String Parameters

### 1. **Basic Query Parameter Handling**

```javascript
// GET /search?q=nodejs&category=backend&limit=10&page=1
app.get('/search', (req, res) => {
  const {
    q,           // Search query
    category,    // Filter category
    limit = 10,  // Default limit
    page = 1,    // Default page
    sort = 'name' // Default sort
  } = req.query;
  
  res.json({
    searchQuery: q,
    category,
    pagination: {
      limit: parseInt(limit),
      page: parseInt(page),
      offset: (parseInt(page) - 1) * parseInt(limit)
    },
    sort
  });
});
```

### 2. **Advanced Query Parameter Validation**

```javascript
const validateQueryParams = (schema) => (req, res, next) => {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = req.query[key];
    
    // Required validation
    if (rules.required && !value) {
      errors.push(`${key} is required`);
      continue;
    }
    
    // Skip validation if optional and not provided
    if (!value && !rules.required) continue;
    
    // Type validation
    if (rules.type === 'number') {
      const num = Number(value);
      if (isNaN(num)) {
        errors.push(`${key} must be a number`);
        continue;
      }
      
      // Range validation
      if (rules.min !== undefined && num < rules.min) {
        errors.push(`${key} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && num > rules.max) {
        errors.push(`${key} must be at most ${rules.max}`);
      }
      
      // Convert to number
      req.query[key] = num;
    }
    
    // String validation
    if (rules.type === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${key} must be at least ${rules.minLength} characters`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${key} must be at most ${rules.maxLength} characters`);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${key} format is invalid`);
      }
    }
    
    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${key} must be one of: ${rules.enum.join(', ')}`);
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter validation failed',
      errors
    });
  }
  
  next();
};

// Define validation schema
const searchSchema = {
  q: { 
    type: 'string', 
    required: true, 
    minLength: 2, 
    maxLength: 100 
  },
  limit: { 
    type: 'number', 
    min: 1, 
    max: 100 
  },
  page: { 
    type: 'number', 
    min: 1 
  },
  sort: { 
    type: 'string', 
    enum: ['name', 'date', 'popularity', 'price'] 
  },
  order: { 
    type: 'string', 
    enum: ['asc', 'desc'] 
  }
};

// Use validation middleware
app.get('/search', validateQueryParams(searchSchema), (req, res) => {
  const { q, limit = 10, page = 1, sort = 'name', order = 'asc' } = req.query;
  
  res.json({
    query: q,
    pagination: { limit, page },
    sorting: { sort, order },
    message: 'All parameters validated!'
  });
});
```

### 3. **Array and Object Query Parameters**

```javascript
// Handle array parameters: /api/users?tags=nodejs,express,api
app.get('/api/users', (req, res) => {
  let { tags, skills } = req.query;
  
  // Convert comma-separated strings to arrays
  if (tags) {
    tags = typeof tags === 'string' ? tags.split(',') : tags;
  }
  
  if (skills) {
    skills = typeof skills === 'string' ? skills.split(',') : skills;
  }
  
  res.json({
    filters: {
      tags: tags || [],
      skills: skills || []
    }
  });
});

// Handle object-like parameters: /api/products?filter[category]=electronics&filter[price][min]=100&filter[price][max]=500
app.get('/api/products', (req, res) => {
  const { filter = {} } = req.query;
  
  res.json({
    appliedFilters: filter,
    message: 'Complex filtering applied'
  });
});
```

## Regular Expressions in Routes

### 1. **Pattern Matching**

```javascript
// Match specific patterns
app.get('/files/:filename([\\w\\-. ]+\\.(jpg|jpeg|png|gif))', (req, res) => {
  const filename = req.params.filename;
  res.json({
    message: `Serving image: ${filename}`,
    type: 'image'
  });
});

// Match numeric IDs only
app.get('/orders/:orderId(\\d+)', (req, res) => {
  res.json({
    orderId: parseInt(req.params.orderId),
    message: 'Order found'
  });
});

// Match UUID format
const uuidPattern = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
app.get(`/accounts/:accountId(${uuidPattern})`, (req, res) => {
  res.json({
    accountId: req.params.accountId,
    message: 'Valid UUID account ID'
  });
});

// Wildcard routes
app.get('/docs/*', (req, res) => {
  const docPath = req.params[0]; // Everything after /docs/
  res.json({
    documentPath: docPath,
    message: `Serving documentation: ${docPath}`
  });
});
```

### 2. **Route Priority and Ordering**

```javascript
// Specific routes MUST come before general ones
app.get('/users/profile', (req, res) => {
  res.json({ message: 'User profile page' });
});

app.get('/users/settings', (req, res) => {
  res.json({ message: 'User settings page' });
});

// This must come AFTER specific routes
app.get('/users/:id', (req, res) => {
  res.json({ message: `User ${req.params.id}` });
});

// Otherwise, /users/profile would match /users/:id with id='profile'
```

## Router Modules and Organization

### 1. **Modular Router Structure**

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// Middleware specific to this router
router.use((req, res, next) => {
  console.log('User routes middleware');
  next();
});

// Parameter preprocessing for this router
router.param('id', (req, res, next, id) => {
  // Validate and load user
  req.user = { id: parseInt(id), name: 'User Name' };
  next();
});

// Routes
router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.get('/:id', (req, res) => {
  res.json({ user: req.user });
});

router.post('/', (req, res) => {
  res.json({ message: 'User created' });
});

module.exports = router;

// routes/posts.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ posts: [] });
});

router.get('/:id', (req, res) => {
  res.json({ post: { id: req.params.id } });
});

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
```

### 2. **Nested Routers**

```javascript
// routes/api.js - Main API router
const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');

// API-level middleware
router.use((req, res, next) => {
  // Check API key, rate limiting, etc.
  next();
});

// Mount sub-routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'My API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      comments: '/api/comments'
    }
  });
});

module.exports = router;

// app.js
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
```

### 3. **Advanced Router Patterns**

```javascript
// routes/resourceRouter.js - Generic CRUD router factory
const express = require('express');

const createResourceRouter = (resourceName, controller) => {
  const router = express.Router();
  
  // GET /resource - List all
  router.get('/', controller.getAll);
  
  // GET /resource/:id - Get one
  router.get('/:id', controller.getOne);
  
  // POST /resource - Create
  router.post('/', controller.create);
  
  // PUT /resource/:id - Update
  router.put('/:id', controller.update);
  
  // DELETE /resource/:id - Delete
  router.delete('/:id', controller.delete);
  
  return router;
};

// controllers/userController.js
const userController = {
  getAll: (req, res) => res.json({ users: [] }),
  getOne: (req, res) => res.json({ user: { id: req.params.id } }),
  create: (req, res) => res.json({ message: 'User created' }),
  update: (req, res) => res.json({ message: 'User updated' }),
  delete: (req, res) => res.json({ message: 'User deleted' })
};

// Usage
const userRouter = createResourceRouter('users', userController);
app.use('/api/users', userRouter);
```

## Input Sanitization and Security

### 1. **Input Sanitization Middleware**

```javascript
const validator = require('validator');
const xss = require('xss');

const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove XSS attacks
        req.body[key] = xss(req.body[key]);
        // Trim whitespace
        req.body[key] = req.body[key].trim();
      }
    }
  }
  
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key].trim());
      }
    }
  }
  
  // Sanitize route parameters
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = validator.escape(req.params[key].trim());
      }
    }
  }
  
  next();
};

app.use(sanitizeInput);
```

### 2. **Route-Specific Validation**

```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation chains
const userValidation = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  
  body('age')
    .isInt({ min: 18, max: 120 })
    .withMessage('Age must be between 18 and 120'),
  
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Use validation in routes
app.post('/users', userValidation, handleValidationErrors, (req, res) => {
  // req.body is now validated and sanitized
  res.json({ message: 'User created successfully' });
});

app.put('/users/:id', userValidation, handleValidationErrors, (req, res) => {
  res.json({ message: `User ${req.params.id} updated` });
});
```

## Performance Optimization for Routes

### 1. **Route Caching**

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const cacheMiddleware = (duration = 600) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  
  if (cachedResponse) {
    return res.json(cachedResponse);
  }
  
  // Store original json method
  const originalJson = res.json;
  
  // Override json method to cache response
  res.json = function(data) {
    cache.set(key, data, duration);
    originalJson.call(this, data);
  };
  
  next();
};

// Use caching for specific routes
app.get('/api/posts', cacheMiddleware(300), (req, res) => {
  // This response will be cached for 5 minutes
  res.json({ posts: [] });
});
```

### 2. **Route Compression**

```javascript
const compression = require('compression');

// Compress only large responses
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

app.use(compression({ filter: shouldCompress }));
```

## My Key Learnings

- **Route parameters are always strings** - Convert to numbers/dates when needed
- **Validation is crucial** - Never trust user input, validate everything
- **Order matters** - Specific routes must come before general patterns
- **Use express.Router()** - Organize complex routing into modules
- **Parameter preprocessing** - Use `app.param()` for common parameter handling
- **Sanitize input** - Prevent XSS and injection attacks
- **Cache when possible** - Cache responses to improve performance
- **Regular expressions** - Use them for pattern matching in routes

---

Perfect! Now I'm a routing master! 🛣️

I'm Rahul Aher, and these are my learning notes on Nodejs. If you find these notes helpful, please share them with your friends. If you spot any errors or have improvements, feel free to contribute by [forking the repo](https://github.com/AherRahul/portfolio-v1). Let's learn together! Also, please consider giving a star ⭐ to [this repo](https://github.com/AherRahul/portfolio-v1). For any queries, [let's connect here](https://rahulaher.netlify.app/contact/).

Take care, see you in the next lesson! 😊
