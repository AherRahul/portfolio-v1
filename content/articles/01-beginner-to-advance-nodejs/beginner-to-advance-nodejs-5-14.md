---
title: "Introduction to Express.js Framework"
description: "Express.js is the most popular, minimal, and flexible web framework for NodeJs. These notes cover what Express.js is, why we need it over vanilla NodeJs, how it simplifies server development, and the fundamental concepts like routing, middleware, and the request/response lifecycle."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-15"
datePublished: "2026-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
resources:
  - title: "Express.js Official Documentation"
    type: "documentation"
    url: "https://expressjs.com/"
    description: "Complete guide with examples and API reference"
  - title: "Express.js Crash Course by Traversy Media"
    type: "video"
    url: "https://www.youtube.com/watch?v=L72fhGm1tfE"
    description: "Comprehensive 1-hour Express.js tutorial"
    duration: "1:11:54"
  - title: "Express.js Fundamentals - MDN"
    type: "article"
    url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs"
    description: "Mozilla's comprehensive Express.js guide"
  - title: "Express Generator"
    type: "tool"
    url: "https://expressjs.com/en/starter/generator.html"
    description: "Quick project scaffolding tool for Express apps"
  - title: "Express in Action"
    type: "book"
    url: "https://www.amazon.com/Express-Action-Writing-building-applications/dp/1617292427"
    description: "Comprehensive Express.js guide by Evan Hahn"
    author: "Evan Hahn"
---

![Express.js Introduction](https://res.cloudinary.com/duojkrgue/image/upload/v1757931579/Portfolio/nodeJsCourse/14_te0pyp.png)

# 📖 Notes – Introduction to Express.js Framework

## What is Express.js?

Express.js is a **minimal and flexible web application framework for NodeJs**. Think of it as a layer on top of NodeJs that makes building web servers and API much easier and faster than using vanilla NodeJs.

While NodeJs gives us the capability to create HTTP servers, doing everything manually can be quite tedious. Express.js provides a set of tools and features that simplify common web development tasks like:
- **Routing** - Handling different URL paths
- **Middleware** - Processing requests before they reach your handlers  
- **Request/Response helpers** - Easier ways to send JSON, handle forms, etc.
- **Static file serving** - Serving CSS, JS, images, etc.

***My takeaway: Express.js is to NodeJs what React is to JavaScript - it makes development faster and more organized!***

## Why Do We Need Express.js?

Let me show you the difference with a simple example.

### Creating a Server with Vanilla NodeJs:
```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  const method = req.method;
  
  // Set headers manually
  res.setHeader('Content-Type', 'application/json');
  
  // Handle different routes manually
  if (pathname === '/' && method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Home page' }));
  } else if (pathname === '/users' && method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ users: ['John', 'Jane'] }));
  } else if (pathname === '/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Parse and handle POST data
      res.statusCode = 201;
      res.end(JSON.stringify({ message: 'User created' }));
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### The Same Server with Express.js:
```javascript
const express = require('express');
const app = express();

// Middleware to parse JSON automatically
app.use(express.json());

// Clean and simple routing
app.get('/', (req, res) => {
  res.json({ message: 'Home page' });
});

app.get('/users', (req, res) => {
  res.json({ users: ['John', 'Jane'] });
});

app.post('/users', (req, res) => {
  // req.body is automatically parsed
  res.status(201).json({ message: 'User created' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**See the difference?** Express.js reduces the code by 70% and makes it much more readable!

## Key Features of Express.js

### 1. **Robust Routing System**
Express provides an intuitive way to handle different HTTP methods and URL patterns:

```javascript
// Different HTTP methods
app.get('/users', getAllUsers);
app.post('/users', createUser);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);

// Route parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId });
});

// Query parameters automatically parsed
app.get('/search', (req, res) => {
  const { q, limit } = req.query; // ?q=nodejs&limit=10
  res.json({ query: q, limit });
});
```

### 2. **Middleware System**
Middleware functions execute during the request-response cycle:

```javascript
// Application-level middleware (runs for every request)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date()}`);
  next(); // Pass control to next middleware
});

// Route-specific middleware
app.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'Protected content' });
});

function authenticateUser(req, res, next) {
  // Check authentication
  if (req.headers.authorization) {
    next(); // User is authenticated, continue
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

### 3. **Built-in Middleware**
Express comes with useful built-in middleware:

```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
```

### 4. **Template Engine Support**
Easily render dynamic HTML:

```javascript
app.set('view engine', 'ejs');

app.get('/profile/:name', (req, res) => {
  res.render('profile', { 
    username: req.params.name,
    title: 'User Profile'
  });
});
```

## Request-Response Lifecycle in Express

Understanding how Express handles requests is crucial:

```
1. Client Request → 
2. Express App → 
3. Middleware Stack → 
4. Route Handler → 
5. Response → 
6. Client
```

Here's a practical example:

```javascript
const express = require('express');
const app = express();

// 1. Logger middleware (runs first)
app.use((req, res, next) => {
  console.log('🚀 Request received:', req.method, req.path);
  next();
});

// 2. JSON parser middleware
app.use(express.json());

// 3. Authentication middleware (conditional)
const authMiddleware = (req, res, next) => {
  if (req.path.startsWith('/api/protected')) {
    // Check for auth token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  }
  next();
};

app.use(authMiddleware);

// 4. Route handlers
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is public' });
});

app.get('/api/protected/data', (req, res) => {
  res.json({ data: 'This is protected data' });
});

// 5. Error handling middleware (runs last)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
```

## Project Structure Best Practices

As your Express app grows, organize it properly:

```
my-express-app/
├── app.js              # Main application file
├── package.json        # Dependencies
├── routes/            # Route handlers
│   ├── index.js
│   ├── users.js
│   └── auth.js
├── middleware/        # Custom middleware
│   ├── auth.js
│   └── logger.js
├── controllers/       # Business logic
│   ├── userController.js
│   └── authController.js
├── models/           # Database models
│   └── User.js
├── utils/            # Utility functions
│   └── helpers.js
├── public/           # Static files
│   ├── css/
│   ├── js/
│   └── images/
└── views/            # Template files
    ├── index.ejs
    └── profile.ejs
```

## Common Express.js Patterns

### 1. **Router Module Pattern**
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

router.post('/', (req, res) => {
  res.json({ message: 'User created' });
});

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
```

### 2. **Controller Pattern**
```javascript
// controllers/userController.js
const userController = {
  getAllUsers: (req, res) => {
    // Business logic here
    res.json({ users: [] });
  },
  
  createUser: (req, res) => {
    // Business logic here
    res.status(201).json({ message: 'User created' });
  }
};

module.exports = userController;

// routes/users.js
const { getAllUsers, createUser } = require('../controllers/userController');
router.get('/', getAllUsers);
router.post('/', createUser);
```

## My Key Learnings

- **Express.js simplifies NodeJs development** by providing a clean, organized way to handle routes and middleware
- **Middleware is powerful** - it's like a pipeline where each function can modify the request/response or stop the chain
- **Organization matters** - As apps grow, proper structure with routes, controllers, and middleware separation is crucial
- **Express is minimal** - You add only what you need, keeping applications lightweight
- **It's just JavaScript** - All NodeJs capabilities are still available when using Express


---

And that's my introduction to Express.js! 🚀

I'm Rahul Aher, and these are my learning notes on NodeJs. If you find these notes helpful, please share them with your friends. If you spot any errors or have improvements, feel free to contribute by [forking the repo](https://github.com/AherRahul/portfolio-v1). Let's learn together! Also, please consider giving a star ⭐ to [this repo](https://github.com/AherRahul/portfolio-v1). For any queries, [let's connect here](https://rahulaher.netlify.app/contact/).

Take care, see you in the next lesson! 😊
