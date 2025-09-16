---
title: "Password Hashing with bcrypt in Node.js"
description: "Learn how to securely store and verify passwords using bcrypt in Node.js applications. Understand salting, cost factors, password verification, migration strategies, and best practices for password security in production applications."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - security
  - bcrypt
  - authentication
resources:
  - title: "bcryptjs"
    type: "documentation"
    url: "https://github.com/dcodeIO/bcrypt.js"
    description: "Pure JavaScript bcrypt implementation"
  - title: "bcrypt (native)"
    type: "documentation"
    url: "https://github.com/kelektiv/node.bcrypt.js"
    description: "Native bcrypt bindings for Node.js"
  - title: "OWASP Password Storage"
    type: "article"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
    description: "Password storage best practices"
  - title: "Password Hashing with bcrypt"
    type: "video"
    url: "https://www.youtube.com/watch?v=O6cmuiTBZVs"
    description: "Step-by-step bcrypt tutorial"
    duration: "23:41"
---

![Password Hashing with bcrypt](https://res.cloudinary.com/duojkrgue/image/upload/v1757930699/Portfolio/nodeJsCourse/20_saq9rh.png)

# 📖 Notes – Password Hashing with bcrypt in Node.js

## Why Never Store Plain Text Passwords

Storing passwords in plain text is like **leaving your house keys under the doormat with a sign saying "Keys Here!"** 🔑

If someone gains access to your database, they immediately have all user passwords. This leads to:
- **Account takeovers** - Attackers can log in as any user
- **Cross-platform attacks** - Users often reuse passwords across sites
- **Legal issues** - Violates data protection regulations (GDPR, CCPA)
- **Reputation damage** - Users lose trust in your application

***My takeaway: Never, EVER store passwords in plain text. Always hash them using a strong, slow hashing algorithm like bcrypt.***

## What is bcrypt?

**bcrypt** is a password hashing function based on the Blowfish cipher. It's specifically designed to be **slow and computationally expensive**, making it difficult for attackers to crack passwords through brute force attacks.

### Key Features:
- **Adaptive** - You can increase the cost factor as computers get faster
- **Salt included** - Each hash includes a unique salt to prevent rainbow table attacks
- **Time-tested** - Used in production by millions of applications
- **Cross-platform** - Available in most programming languages

## Installing and Basic Usage

### 1. **Installation**

```bash
npm install bcryptjs
# or for native bcrypt (faster but requires compilation)
npm install bcrypt
```

### 2. **Basic Hashing and Verification**

```javascript
const bcrypt = require('bcryptjs');

async function demonstrateBasics() {
  const plainPassword = 'mySecretPassword123!';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Original:', plainPassword);
  console.log('Hashed:', hashedPassword);
  
  // Verify the password
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password valid:', isValid); // true
  
  // Try with wrong password
  const isInvalid = await bcrypt.compare('wrongPassword', hashedPassword);
  console.log('Wrong password valid:', isInvalid); // false
}

demonstrateBasics();
```

**Output:**
```
Original: mySecretPassword123!
Hashed: $2a$10$CwTycUXWue0Thq9StjUM0uJ8/9Z8QT2LUGgRgdRFr9YSbT4QF7ybK
Password valid: true
Wrong password valid: false
```

## Understanding Salt Rounds (Cost Factor)

The **salt rounds** parameter determines how many times the hashing algorithm runs. Higher numbers = more security but slower performance.

```javascript
const bcrypt = require('bcryptjs');

async function compareSaltRounds() {
  const password = 'testPassword123';
  
  console.time('Salt rounds: 10');
  await bcrypt.hash(password, 10);
  console.timeEnd('Salt rounds: 10');
  
  console.time('Salt rounds: 12');
  await bcrypt.hash(password, 12);
  console.timeEnd('Salt rounds: 12');
  
  console.time('Salt rounds: 15');
  await bcrypt.hash(password, 15);
  console.timeEnd('Salt rounds: 15');
}

compareSaltRounds();
```

**Example Output:**
```
Salt rounds: 10: 65.123ms
Salt rounds: 12: 256.789ms
Salt rounds: 15: 2.1s
```

### Choosing the Right Salt Rounds

| Salt Rounds | Time (approx) | Use Case |
|-------------|---------------|----------|
| 10 | ~65ms | Development, testing |
| 12 | ~250ms | **Production (recommended)** |
| 14 | ~1s | High-security applications |
| 15+ | ~2s+ | Maximum security (may impact UX) |

## Complete Authentication System

### 1. **User Registration with Password Hashing**

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());

// Mock database
const users = [];

// Password validation rules
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
};

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }
    
    // Password strength validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordErrors
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
    
    // Hash password with salt rounds 12
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null
    };
    
    users.push(newUser);
    
    // Return user without password
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
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

### 2. **Login with Brute Force Protection**

```javascript
// Login configuration
const LOGIN_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_TIME: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  FAILED_ATTEMPT_DELAY: 1000 // 1 second delay after failed attempt
};

// Helper function to check if account is locked
const isAccountLocked = (user) => {
  return user.lockedUntil && user.lockedUntil > Date.now();
};

// Helper function to handle failed login attempt
const handleFailedLogin = (user) => {
  user.loginAttempts = (user.loginAttempts || 0) + 1;
  
  if (user.loginAttempts >= LOGIN_CONFIG.MAX_LOGIN_ATTEMPTS) {
    user.lockedUntil = Date.now() + LOGIN_CONFIG.LOCK_TIME;
    console.log(`Account locked for user: ${user.email}`);
  }
};

// Helper function to handle successful login
const handleSuccessfulLogin = (user) => {
  user.loginAttempts = 0;
  user.lockedUntil = null;
  user.lastLogin = new Date().toISOString();
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      // Prevent username enumeration by using same timing
      await bcrypt.hash('dummy-password', 12);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if account is locked
    if (isAccountLocked(user)) {
      const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 1000 / 60);
      return res.status(423).json({
        success: false,
        message: `Account is locked. Try again in ${remainingTime} minutes.`
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      handleFailedLogin(user);
      
      // Add delay to slow down brute force attacks
      await new Promise(resolve => setTimeout(resolve, LOGIN_CONFIG.FAILED_ATTEMPT_DELAY));
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        attemptsRemaining: Math.max(0, LOGIN_CONFIG.MAX_LOGIN_ATTEMPTS - user.loginAttempts)
      });
    }
    
    // Successful login
    handleSuccessfulLogin(user);
    
    // Return user without password
    const { password: _, ...userResponse } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: userResponse
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

### 3. **Password Change with Old Password Verification**

```javascript
app.put('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    // Input validation
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'User ID, current password, and new password are required'
      });
    }
    
    // Find user
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Validate new password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet requirements',
        errors: passwordErrors
      });
    }
    
    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update user password
    user.password = hashedNewPassword;
    user.lastPasswordChange = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## Advanced Security Features

### 1. **Password Reset with Secure Tokens**

```javascript
const crypto = require('crypto');

// Store reset tokens (in production, use Redis or database)
const resetTokens = new Map();

// Generate secure reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Request password reset
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const user = users.find(u => u.email === email);
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes
    
    resetTokens.set(resetToken, {
      userId: user.id,
      expiresAt: resetExpiry
    });
    
    // In a real app, send email with reset link
    console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
    
    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });
    
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset password with token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }
    
    // Validate token
    const tokenData = resetTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Find user
    const user = users.find(u => u.id === tokenData.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Validate new password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordErrors
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update user
    user.password = hashedPassword;
    user.lastPasswordChange = new Date().toISOString();
    user.loginAttempts = 0; // Reset login attempts
    user.lockedUntil = null; // Unlock account
    
    // Remove used token
    resetTokens.delete(token);
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

### 2. **Password History and Policies**

```javascript
// Enhanced user model with password history
const createUserWithHistory = (userData) => {
  return {
    ...userData,
    passwordHistory: [], // Store last 5 password hashes
    lastPasswordChange: new Date().toISOString(),
    passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  };
};

// Check if password was used recently
const isPasswordReused = async (newPassword, passwordHistory) => {
  for (const oldHash of passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, oldHash);
    if (isMatch) {
      return true;
    }
  }
  return false;
};

// Enhanced password change with history
app.put('/api/auth/change-password-advanced', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Check password reuse
    const passwordHistory = user.passwordHistory || [];
    const isReused = await isPasswordReused(newPassword, [...passwordHistory, user.password]);
    
    if (isReused) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reuse any of the last 6 passwords'
      });
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password history
    const updatedHistory = [...passwordHistory, user.password].slice(-5); // Keep last 5
    
    // Update user
    user.password = hashedNewPassword;
    user.passwordHistory = updatedHistory;
    user.lastPasswordChange = new Date().toISOString();
    user.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## Performance Optimization

### 1. **Async vs Sync Operations**

```javascript
const bcrypt = require('bcryptjs');

// ✅ Good: Async (non-blocking)
async function hashPasswordAsync(password) {
  return await bcrypt.hash(password, 12);
}

// ❌ Bad: Sync (blocking) - Only use for startup scripts
function hashPasswordSync(password) {
  return bcrypt.hashSync(password, 12);
}

// Example of proper async usage in Express
app.post('/register', async (req, res) => {
  try {
    const { password } = req.body;
    
    // This won't block other requests
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Save user...
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. **Batch Password Operations**

```javascript
// Efficiently hash multiple passwords
async function hashMultiplePasswords(passwords) {
  const promises = passwords.map(password => bcrypt.hash(password, 12));
  return await Promise.all(promises);
}

// Usage
const passwords = ['pass1', 'pass2', 'pass3'];
const hashedPasswords = await hashMultiplePasswords(passwords);
```

## Security Best Practices

### 1. **Environment Configuration**

```javascript
// config/security.js
module.exports = {
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    maxLength: 72 // bcrypt limitation
  },
  
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  login: {
    maxAttempts: 5,
    lockTime: 2 * 60 * 60 * 1000, // 2 hours
    delayAfterFailure: 1000
  }
};
```

### 2. **Input Sanitization**

```javascript
const validator = require('validator');

const sanitizeAndValidatePassword = (password) => {
  // Trim whitespace
  const trimmed = password.trim();
  
  // Check length (bcrypt has 72 character limit)
  if (trimmed.length > 72) {
    throw new Error('Password too long (max 72 characters)');
  }
  
  // Basic sanitization (remove null bytes)
  const sanitized = trimmed.replace(/\0/g, '');
  
  return sanitized;
};
```

## Migration Strategies

### 1. **Upgrading from Plain Text**

```javascript
// Migrate users from plain text to bcrypt
async function migratePlainTextPasswords() {
  for (const user of users) {
    if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
      // This is a plain text password
      const hashedPassword = await bcrypt.hash(user.password, 12);
      user.password = hashedPassword;
      user.requiresPasswordChange = true;
      console.log(`Migrated password for user: ${user.email}`);
    }
  }
}
```

### 2. **Upgrading Salt Rounds**

```javascript
// Check if password needs rehashing (lower salt rounds)
const needsRehashing = (hashedPassword, currentSaltRounds = 12) => {
  const rounds = bcrypt.getRounds(hashedPassword);
  return rounds < currentSaltRounds;
};

// Rehash during login if needed
app.post('/api/auth/login', async (req, res) => {
  // ... existing login logic ...
  
  if (isPasswordValid) {
    // Check if password needs rehashing
    if (needsRehashing(user.password)) {
      const newHash = await bcrypt.hash(password, 12);
      user.password = newHash;
      console.log(`Rehashed password for user: ${user.email}`);
    }
    
    // ... rest of login logic ...
  }
});
```

## My Key Learnings

- **Never store plain text passwords** - Always hash with bcrypt
- **Salt rounds matter** - Higher = more secure but slower (12 is recommended)
- **Use async operations** - Don't block the event loop
- **Implement brute force protection** - Lock accounts after failed attempts
- **Add password policies** - Enforce strong passwords and prevent reuse
- **Migrate carefully** - Upgrade existing systems gradually
- **Time attacks matter** - Use consistent timing for failed logins

---

Excellent! Now I know how to securely handle passwords in Node.js! 🔒

I'm Rahul Aher, and these are my learning notes on Node.js. If you find these notes helpful, please share them with your friends. If you spot any errors or have improvements, feel free to contribute by [forking the repo](https://github.com/AherRahul/portfolio-v1). Let's learn together! Also, please consider giving a star ⭐ to [this repo](https://github.com/AherRahul/portfolio-v1). For any queries, [let's connect here](https://rahulaher.netlify.app/contact/).

Take care, see you in the next lesson! 😊
