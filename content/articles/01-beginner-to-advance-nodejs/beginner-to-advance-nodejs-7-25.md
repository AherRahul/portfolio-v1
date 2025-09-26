---
title: "Deploying NodeJs Apps (Heroku, Vercel/Netlify, AWS)"
description: "Deploy Express/Node apps: build outputs, env vars/secrets, process managers (PM2), health checks, logs, and basic CI/CD."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-15"
datePublished: "2025-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
resources:
  - title: "PM2"
    type: "tool"
    url: "https://pm2.keymetrics.io/"
    description: "Production process manager for NodeJs"
  - title: "12-Factor App"
    type: "article"
    url: "https://12factor.net/"
    description: "Best practices for cloud-native apps"
  - title: "Vercel Docs"
    type: "documentation"
    url: "https://vercel.com/docs"
    description: "Deploy Node and serverless apps"
  - title: "Netlify Docs"
    type: "documentation"
    url: "https://docs.netlify.com/"
    description: "Build, functions, redirects"
---

![Deploying NodeJs Apps](https://res.cloudinary.com/duojkrgue/image/upload/v1757930696/Portfolio/nodeJsCourse/25_xgwyej.png)

<!-- # 📖 My Personal Notes – Deploying NodeJs Apps -->

Deployment used to terrify me until I learned that it's just making your local app work somewhere else. Here's everything I've learned about getting NodeJs apps into production reliably.

## Why Deployment Strategy Matters

Bad deployments cause:
- Downtime during updates
- Lost user data
- Security vulnerabilities
- Performance issues
- Debugging nightmares

Good deployment gives you:
- Zero-downtime updates
- Easy rollbacks
- Scalable infrastructure
- Monitoring and alerting
- Confidence to ship often

## 🏗️ Preparing Your App for Production

### Environment Configuration
```javascript
// config/environment.js
export const config = {
  // Server
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10'),
    ssl: process.env.NODE_ENV === 'production'
  },
  
  // Security
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
}

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']

if (config.nodeEnv === 'production') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`)
      process.exit(1)
    }
  }
}
```

### Production-Ready Express Setup
```javascript
// src/app.js
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'

export function createApp() {
  const app = express()

  // Trust proxy for correct IP addresses behind load balancers
  if (config.nodeEnv === 'production') {
    app.set('trust proxy', 1)
  }

  // Security middleware
  app.use(helmet())
  app.use(compression())
  app.use(cors())

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: config.nodeEnv,
      uptime: process.uptime()
    })
  })

  return app
}
```

## ☁️ Platform-as-a-Service (PaaS) Deployment

### Vercel (Serverless)
```javascript
// api/users.js (Vercel function)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const users = await getUsersFromDatabase()
      return res.json({ users })
    }
    
    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

```json
// vercel.json
{
  "version": 2,
  "builds": [{ "src": "api/**/*.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/api/(.*)", "dest": "/api/$1" }]
}
```

### Railway (Simple PaaS)
```json
// package.json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "ts-node-dev src/server.ts"
  },
  "engines": {
    "node": "18.x"
  }
}
```

## 🐳 Container Deployment (Docker)

### Production Dockerfile
```dockerfile
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application
COPY dist ./dist

# Change ownership to nodejs user
CHOWN nodejs:nodejs /app
USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

## 🖥️ Traditional Server Deployment (VPS/EC2)

### PM2 Process Management
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './dist/server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M'
  }]
}
```

### Nginx Reverse Proxy
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: my-app
```

### Deployment Script
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Restart application
pm2 reload ecosystem.config.js --env production

# Health check
sleep 10
curl -f http://localhost:3000/health || exit 1

echo "✅ Deployment successful!"
```

## 📊 Monitoring and Health Checks

### Health Check Implementation
```javascript
// src/utils/healthCheck.js
export class HealthChecker {
  constructor() {
    this.checks = new Map()
  }

  addCheck(name, checkFunction) {
    this.checks.set(name, checkFunction)
  }

  async runChecks() {
    const results = {}

    for (const [name, checkFn] of this.checks) {
      try {
        await checkFn()
        results[name] = { status: 'healthy' }
      } catch (error) {
        results[name] = { status: 'unhealthy', error: error.message }
      }
    }

    const overallStatus = Object.values(results).every(r => r.status === 'healthy')
      ? 'healthy' : 'unhealthy'

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    }
  }
}

// Usage
const healthChecker = new HealthChecker()

healthChecker.addCheck('database', async () => {
  await db.raw('SELECT 1')
})

healthChecker.addCheck('redis', async () => {
  await redis.ping()
})

app.get('/health', async (req, res) => {
  const health = await healthChecker.runChecks()
  res.status(health.status === 'healthy' ? 200 : 503).json(health)
})
```

## 🚨 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit completed (`npm audit`)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created

### During Deployment
- [ ] Monitor application logs
- [ ] Check health endpoints
- [ ] Verify database connections
- [ ] Test critical user journeys

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Performance metrics normal
- [ ] No spike in error rates
- [ ] User-facing features working

## 💡 My Deployment Best Practices

### 1. Environment Parity
Keep development, staging, and production as similar as possible:
```bash
# Use exact NodeJs versions
echo "18.17.0" > .nvmrc

# Pin dependencies
npm ci  # instead of npm install

# Use same OS in containers
FROM node:18-alpine  # consistent base image
```

### 2. Graceful Shutdown
```javascript
// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`)
  
  server.close(() => {
    // Close database connections
    // Finish processing requests
    process.exit(0)
  })
}
```

### 3. Zero-Downtime Deployments
```bash
# Blue-green deployment with PM2
pm2 start app.js --name app-v2
# Test new version
pm2 delete app-v1
pm2 restart app-v2 --name app
```

### 4. Monitoring and Alerting
```javascript
// Basic metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    timestamp: Date.now()
  })
})
```

---

Deployment doesn't have to be scary. With proper preparation, automation, and monitoring, you can deploy confidently and frequently. Start simple and gradually add sophistication as your needs grow.

Remember: the best deployment is one you don't have to think about because it just works!


