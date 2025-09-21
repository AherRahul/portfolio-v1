---
title: "Building REST API with Express.js"
description: "Learn to create RESTful API with Express.js - handling JSON payloads, query parameters, route parameters, status codes, and CRUD operations. This comprehensive guide covers practical examples with proper API design principles and error handling."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - express
  - rest
  - api
resources:
  - title: "REST API Tutorial"
    type: "documentation"
    url: "https://restfulapi.net/"
    description: "Comprehensive REST API design guide and best practices"
  - title: "Building a REST API with NodeJs"
    type: "video"
    url: "https://www.youtube.com/watch?v=0oXYLzuucwE"
    description: "Complete REST API tutorial by Academind"
    duration: "3:24:59"
  - title: "Postman"
    type: "tool"
    url: "https://www.postman.com/"
    description: "Popular API testing and development tool"
  - title: "HTTP Status Codes Reference"
    type: "documentation"
    url: "https://httpstatuses.com/"
    description: "Complete reference for HTTP status codes"
  - title: "RESTful Web API"
    type: "book"
    url: "https://www.amazon.com/RESTful-Web-API-Leonard-Richardson/dp/1449358063"
    description: "In-depth guide to REST API design"
    author: "Leonard Richardson"
---

![Building REST API with Express.js](https://res.cloudinary.com/duojkrgue/image/upload/v1757930716/Portfolio/nodeJsCourse/15.png)

# 📖 Notes – Building REST API with Express.js

## What is a REST API?

**REST** stands for **REpresentational State Transfer**. It's an architectural style for designing networked applications, particularly web services. A RESTful API allows different systems to communicate over HTTP using standard methods.

Think of REST API as a **contract** between the client (like a React app) and server (Express.js app). The client makes requests to specific URLs with specific methods, and the server responds with data in a predictable format.

***My takeaway: REST API is like a restaurant menu - it tells you what's available (endpoints), how to order (HTTP methods), and what you'll get (response format).***

## REST Principles

### 1. **Stateless**
Each request from client to server must contain all the information needed to understand the request. The server doesn't store client state between requests.

### 2. **Client-Server Architecture**
Clear separation between client and server allows them to evolve independently.

### 3. **Uniform Interface**
Consistent way to interact with resources using standard HTTP methods.

### 4. **Resource-Based**
Everything is treated as a resource, identified by URLs.

## HTTP Methods in REST

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Retrieve data | `GET /users` - Get all users |
| **POST** | Create new resource | `POST /users` - Create a user |
| **PUT** | Update entire resource | `PUT /users/123` - Update user 123 |
| **PATCH** | Partial update | `PATCH /users/123` - Update some fields |
| **DELETE** | Remove resource | `DELETE /users/123` - Delete user 123 |

## Building a Complete REST API

Let's build a **Users API** step by step:

### 1. **Project Setup**

```bash
mkdir users-api
cd users-api
npm init -y
npm install express
```

### 2. **Basic Server Setup**

```javascript
// app.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory data store (in real apps, use a database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

let nextId = 4; // For generating new IDs

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Users API running on http://localhost:${PORT}`);
});
```

### 3. **GET Routes - Retrieving Data**

```javascript
// GET /users - Get all users
app.get('/users', (req, res) => {
  try {
    // Handle query parameters for filtering/pagination
    const { age, limit, page = 1 } = req.query;
    
    let filteredUsers = users;
    
    // Filter by age if provided
    if (age) {
      filteredUsers = users.filter(user => user.age == age);
    }
    
    // Pagination
    if (limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      filteredUsers = filteredUsers.slice(startIndex, endIndex);
    }
    
    res.status(200).json({
      success: true,
      count: filteredUsers.length,
      data: filteredUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET /users/:id - Get single user
app.get('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
```

### 4. **POST Route - Creating Data**

```javascript
// POST /users - Create new user
app.post('/users', (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    // Validation
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and age'
      });
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: nextId++,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      age: parseInt(age)
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
```

### 5. **PUT Route - Full Update**

```javascript
// PUT /users/:id - Update entire user
app.put('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, age } = req.body;
    
    // Find user index
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    // Validation
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and age'
      });
    }
    
    // Check if email already exists (exclude current user)
    const existingUser = users.find(u => u.email === email && u.id !== userId);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Update user (complete replacement)
    users[userIndex] = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      age: parseInt(age)
    };
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
```

### 6. **PATCH Route - Partial Update**

```javascript
// PATCH /users/:id - Partial update
app.patch('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    
    // Find user index
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    // Validate allowed fields
    const allowedFields = ['name', 'email', 'age'];
    const updateFields = Object.keys(updates);
    const isValidOperation = updateFields.every(field => allowedFields.includes(field));
    
    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fields in update'
      });
    }
    
    // Check email uniqueness if email is being updated
    if (updates.email) {
      const existingUser = users.find(u => u.email === updates.email && u.id !== userId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }
    
    // Apply updates
    const currentUser = users[userIndex];
    Object.keys(updates).forEach(key => {
      if (key === 'name' || key === 'email') {
        currentUser[key] = updates[key].trim();
        if (key === 'email') {
          currentUser[key] = currentUser[key].toLowerCase();
        }
      } else if (key === 'age') {
        currentUser[key] = parseInt(updates[key]);
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: currentUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
```

### 7. **DELETE Route - Removing Data**

```javascript
// DELETE /users/:id - Delete user
app.delete('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Find user index
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found`
      });
    }
    
    // Remove user
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
```

## Advanced Features

### 1. **Request Validation Middleware**

```javascript
const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (!age || age < 1 || age > 120) {
    errors.push('Age must be between 1 and 120');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors
    });
  }
  
  next();
};

// Use middleware in routes
app.post('/users', validateUser, (req, res) => {
  // Route handler code here
});
```

### 2. **Search and Filtering**

```javascript
// GET /users/search?q=john&sortBy=age&order=desc
app.get('/users/search', (req, res) => {
  try {
    const { q, sortBy = 'id', order = 'asc' } = req.query;
    
    let results = users;
    
    // Search functionality
    if (q) {
      const searchTerm = q.toLowerCase();
      results = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sorting
    results.sort((a, b) => {
      if (order === 'desc') {
        return b[sortBy] > a[sortBy] ? 1 : -1;
      }
      return a[sortBy] > b[sortBy] ? 1 : -1;
    });
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});
```

### 3. **Response Headers and CORS**

```javascript
// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Add metadata to responses
const addMetadata = (req, res, next) => {
  res.locals.timestamp = new Date().toISOString();
  res.locals.version = '1.0.0';
  next();
};

app.use(addMetadata);
```

## Testing Your API

### Using cURL:

```bash
# Get all users
curl http://localhost:3000/users

# Get user by ID
curl http://localhost:3000/users/1

# Create new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Brown","email":"alice@example.com","age":28}'

# Update user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated","email":"john.updated@example.com","age":31}'

# Delete user
curl -X DELETE http://localhost:3000/users/1
```

### Using Postman:
1. Import the requests into Postman collections
2. Test different scenarios (valid/invalid data)
3. Check response status codes and formats

## API Design Best Practices

### 1. **Use Proper HTTP Status Codes**
```javascript
// 200 - OK (successful GET, PUT, PATCH)
// 201 - Created (successful POST)
// 204 - No Content (successful DELETE with no return data)
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (authentication required)
// 403 - Forbidden (access denied)
// 404 - Not Found (resource doesn't exist)
// 500 - Internal Server Error (server problems)
```

### 2. **Consistent Response Format**
```javascript
// Success response
{
  "success": true,
  "message": "Operation successful",
  "data": { /* actual data */ },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0"
  }
}

// Error response
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific error details"],
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0"
  }
}
```

### 3. **RESTful URL Patterns**
```javascript
// Good patterns
GET    /users           // Get all users
GET    /users/123       // Get user 123
POST   /users           // Create new user
PUT    /users/123       // Update user 123 (full)
PATCH  /users/123       // Update user 123 (partial)
DELETE /users/123       // Delete user 123

// Nested resources
GET    /users/123/posts // Get posts by user 123
POST   /users/123/posts // Create post for user 123

// Avoid these patterns
GET    /getAllUsers
POST   /createUser
GET    /user/delete/123
```

## My Key Learnings

- **REST is about resources, not actions** - URLs should represent things (nouns), not verbs
- **HTTP methods define actions** - GET, POST, PUT, PATCH, DELETE tell you what to do
- **Status codes matter** - They communicate success/failure clearly to clients
- **Validation is crucial** - Always validate input data before processing
- **Consistent structure** - Use the same response format throughout your API
- **Error handling** - Provide meaningful error messages to help developers debug


---

Great! Now I understand how to build REST API with Express.js! 🎯

I'm Rahul Aher, and these are my learning notes on NodeJs. If you find these notes helpful, please share them with your friends. If you spot any errors or have improvements, feel free to contribute by [forking the repo](https://github.com/AherRahul/portfolio-v1). Let's learn together! Also, please consider giving a star ⭐ to [this repo](https://github.com/AherRahul/portfolio-v1). For any queries, [let's connect here](https://rahulaher.netlify.app/contact/).

Take care, see you in the next lesson! 😊
