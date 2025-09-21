---
title: "JWT Authentication in NodeJs"
description: "Master JWT (JSON Web Tokens) authentication in NodeJs applications. Learn how to create, verify, and refresh tokens, implement secure token storage, protect routes with middleware, and build role-based access control systems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - authentication
  - jwt
  - security
resources:
  - title: "JWT.io"
    type: "tool"
    url: "https://jwt.io/"
    description: "Decode, verify, and learn about JSON Web Tokens"
  - title: "jsonwebtoken"
    type: "documentation"
    url: "https://github.com/auth0/node-jsonwebtoken"
    description: "Popular JWT library for NodeJs"
  - title: "JWT Authentication Tutorial"
    type: "video"
    url: "https://www.youtube.com/watch?v=mbsmsi7l3r4"
    description: "Full JWT setup walkthrough"
    duration: "2:00:12"
  - title: "JWT Security Best Practices"
    type: "article"
    url: "https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/"
    description: "Best practices and pitfalls to avoid"
---

![JWT Authentication in NodeJs](https://res.cloudinary.com/duojkrgue/image/upload/v1757930697/Portfolio/nodeJsCourse/19_jnchd1.png)

# 📖 Notes – JWT Authentication in NodeJs

## What is JWT Authentication?

**JWT (JSON Web Token)** is a compact, URL-safe way to represent claims between two parties. Think of it as a **digital passport** that contains information about the user and can be verified without storing session data on the server.

Unlike traditional session-based authentication where the server stores session data, JWT is **stateless** - all the information needed is contained within the token itself.

***My takeaway: JWT is like a tamper-proof ID card that contains user information and can be verified anywhere without checking a central database.***

## How JWT Works

### JWT Structure
A JWT consists of three parts separated by dots (`.`):

```
header.payload.signature
```

**Example JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 1. **Header**
Contains the algorithm and token type:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. **Payload**
Contains the claims (user data):
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "iat": 1516239022,
  "exp": 1516325422
}
```

### 3. **Signature**
Verifies the token hasn't been tampered with:
```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

## Setting Up JWT in Express.js

### 1. **Installation**

```bash
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken # For TypeScript
```

### 2. **Basic JWT Implementation**

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// Mock user database
const users = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8/9Z8QT2LUGgRgdRFr9YSbT4QF7ybK', // 'password123'
    role: 'user'
  },
  {
    id: 2,
    username: 'admin_user',
    email: 'admin@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8/9Z8QT2LUGgRgdRFr9YSbT4QF7ybK', // 'password123'
    role: 'admin'
  }
];

// Environment variables (use .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';

// Helper function to generate JWT
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'my-app',
    audience: 'my-app-users'
  });
};

// Helper function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );
};
```

### 3. **User Registration**

```javascript
// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: 'user'
    };
    
    users.push(newUser);
    
    // Generate tokens
    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    
    // Remove password from response
    const userResponse = { ...newUser };
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

### 4. **User Login**

```javascript
// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## JWT Middleware for Route Protection

### 1. **Authentication Middleware**

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      let message = 'Invalid token';
      
      if (err.name === 'TokenExpiredError') {
        message = 'Token has expired';
      } else if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token format';
      }
      
      return res.status(403).json({
        success: false,
        message
      });
    }
    
    // Add user info to request object
    req.user = decoded;
    next();
  });
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
      }
    });
  }
  
  next();
};
```

### 2. **Authorization Middleware (Role-Based Access)**

```javascript
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Usage examples
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
      message: 'Profile accessed successfully'
    }
  });
});

app.get('/api/admin/users', 
  authenticateToken, 
  authorizeRoles('admin'), 
  (req, res) => {
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      success: true,
      data: usersWithoutPasswords
    });
  }
);

app.get('/api/admin/dashboard', 
  authenticateToken, 
  authorizeRoles('admin', 'moderator'), 
  (req, res) => {
    res.json({
      success: true,
      data: {
        message: 'Admin dashboard access granted',
        userRole: req.user.role
      }
    });
  }
);
```

## Token Refresh Implementation

### 1. **Refresh Token Endpoint**

```javascript
// Store refresh tokens (in production, use Redis or database)
const refreshTokens = new Set();

// POST /api/auth/refresh
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }
  
  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
  
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Remove invalid token
      refreshTokens.delete(refreshToken);
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    // Find user
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      refreshTokens.delete(refreshToken);
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate new tokens
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // Replace old refresh token
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);
    
    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  });
});

// Update login to store refresh token
app.post('/api/auth/login', async (req, res) => {
  // ... existing login logic ...
  
  // After successful authentication:
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Store refresh token
  refreshTokens.add(refreshToken);
  
  // ... rest of response ...
});
```

### 2. **Logout Implementation**

```javascript
// POST /api/auth/logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Logout from all devices
app.post('/api/auth/logout-all', authenticateToken, (req, res) => {
  // In a real app, you'd remove all refresh tokens for this user
  // For this example, we'll just clear all tokens (not recommended for production)
  
  res.json({
    success: true,
    message: 'Logged out from all devices'
  });
});
```

## Advanced JWT Features

### 1. **Custom Claims and Permissions**

```javascript
const generateAdvancedToken = (user, permissions = []) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    permissions,
    // Custom claims
    department: user.department,
    isEmailVerified: user.isEmailVerified,
    lastLogin: new Date().toISOString()
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'my-app',
    audience: 'my-app-users',
    subject: user.id.toString()
  });
};

// Permission-based authorization
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`
      });
    }
    
    next();
  };
};

// Usage
app.delete('/api/users/:id', 
  authenticateToken, 
  requirePermission('user:delete'), 
  (req, res) => {
    res.json({ message: 'User deleted' });
  }
);
```

### 2. **Token Blacklisting**

```javascript
// In production, use Redis for better performance
const blacklistedTokens = new Set();

const checkBlacklist = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token && blacklistedTokens.has(token)) {
    return res.status(401).json({
      success: false,
      message: 'Token has been revoked'
    });
  }
  
  next();
};

// Enhanced authentication middleware with blacklist check
const authenticateWithBlacklist = (req, res, next) => {
  checkBlacklist(req, res, () => {
    authenticateToken(req, res, next);
  });
};

// Revoke token endpoint
app.post('/api/auth/revoke-token', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    blacklistedTokens.add(token);
  }
  
  res.json({
    success: true,
    message: 'Token revoked successfully'
  });
});
```

### 3. **JWT Security Best Practices**

```javascript
const secureJWTConfig = {
  // Use strong, random secrets
  secret: process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex'),
  
  // Shorter expiration times for access tokens
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  
  // Additional security options
  options: {
    algorithm: 'HS256',
    issuer: 'my-secure-app',
    audience: 'my-app-users',
    notBefore: 0, // Token not valid before this time
    clockTolerance: 30 // Allow 30 seconds clock skew
  }
};

// Enhanced token generation with security options
const generateSecureToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    // Don't include sensitive data in JWT payload
  };
  
  return jwt.sign(payload, secureJWTConfig.secret, {
    expiresIn: secureJWTConfig.accessTokenExpiry,
    ...secureJWTConfig.options
  });
};

// Rate limiting for auth endpoints
const loginRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/auth/login', loginRateLimit, async (req, res) => {
  // Login logic here
});
```

## Production Considerations

### 1. **Environment Configuration**

```javascript
// config/jwt.js
module.exports = {
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  
  // Validate required environment variables
  validate() {
    if (!this.secret || !this.refreshSecret) {
      throw new Error('JWT secrets must be defined in environment variables');
    }
    if (this.secret.length < 32) {
      throw new Error('JWT secret must be at least 32 characters long');
    }
  }
};
```

### 2. **Error Handling**

```javascript
const handleJWTError = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      expiredAt: err.expiredAt
    });
  }
  
  if (err.name === 'NotBeforeError') {
    return res.status(401).json({
      success: false,
      message: 'Token not active yet'
    });
  }
  
  next(err);
};

app.use(handleJWTError);
```

## My Key Learnings

- **JWT is stateless** - No need to store session data on the server
- **Short-lived access tokens** - Use refresh tokens for security
- **Never store sensitive data** - JWT payload is easily decoded
- **Always verify tokens** - Check signature, expiration, and claims
- **Use HTTPS** - JWT tokens should never be sent over HTTP
- **Implement token refresh** - Allows longer sessions without compromising security
- **Role-based access control** - Use claims for authorization decisions

---

Perfect! Now I understand JWT authentication completely! 🔐

I'm Rahul Aher, and these are my learning notes on NodeJs. If you find these notes helpful, please share them with your friends. If you spot any errors or have improvements, feel free to contribute by [forking the repo](https://github.com/AherRahul/portfolio-v1). Let's learn together! Also, please consider giving a star ⭐ to [this repo](https://github.com/AherRahul/portfolio-v1). For any queries, [let's connect here](https://rahulaher.netlify.app/contact/).

Take care, see you in the next lesson! 😊
