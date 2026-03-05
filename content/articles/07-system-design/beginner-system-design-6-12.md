---
title: "Session vs Token Based Auth"
description: "Session vs Token Based Auth - System Design Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Session vs Token Based Auth

Every web application needs to answer one fundamental question: "Is this request coming from a user who has already proven their identity?"

The user logs in once, providing their username and password. But HTTP is stateless. Each request is independent, with no memory of previous requests. So how does the server know that the request to view your dashboard is coming from you, the same person who logged in 5 minutes ago?

This is the problem authentication solves. And there are two dominant approaches: **session-based authentication** and **token-based authentication**.

Session-based authentication has been around since the early days of the web. It is battle-tested and works well for traditional server-rendered applications. Token-based authentication emerged later, driven by the rise of single-page applications, mobile apps, and microservices.

The choice affects scalability, security, user experience, and architectural flexibility. There is no universally correct answer, only the right choice for your specific requirements.

# 1\. The Authentication Problem

Before diving into solutions, let us understand the problem clearly.

When a user logs in, they prove their identity, usually with a username and password. The server verifies these credentials against its database. But what happens next? The user should not have to enter their password for every single page they visit.

HTTP does not help here. It is a stateless protocol. Each request is independent. The server has no built-in way to know that request #47 is from the same user as request #46.

We need a way to:

1.  **Remember** that a user has authenticated
2.  **Identify** which user is making each subsequent request
3.  **Expire** this "memory" after some time for security
4.  **Invalidate** it when the user logs out

Both session-based and token-based authentication solve these problems, but in fundamentally different ways.

# 2\. Session-Based Authentication

Session-based authentication is the traditional approach. The server keeps track of logged-in users by storing session data on the server side.

### 2.1 How It Works

When a user logs in successfully:

1.  The server creates a **session** and stores it (in memory, database, or cache)
2.  The server sends back a **session ID** in a cookie
3.  The browser automatically includes this cookie in every subsequent request
4.  The server looks up the session ID to identify the user

### 2.2 The Session Object

A session typically contains:

Field

Description

Session ID

Unique identifier (random, unguessable string)

User ID

Reference to the authenticated user

Created At

When the session was created

Last Accessed

When the session was last used

Expiration

When the session expires

IP Address

Optional, for additional security

User Agent

Optional, to detect session hijacking

The session itself is stored server-side. Only the session ID travels to the client.

### 2.3 Session Storage Options

Sessions need to be stored somewhere. The choice affects scalability and performance:

Storage

Pros

Cons

**In-Memory**

Fastest, simple

Lost on restart, doesn't scale

**Database**

Persistent, searchable

Slower, adds DB load

**Redis/Memcached**

Fast, scales horizontally

Additional infrastructure

**File System**

Simple, persistent

Slow, doesn't scale

For production systems, **Redis** is the most common choice. It offers sub-millisecond lookups, built-in expiration, and horizontal scaling through clustering.

### 2.4 The Cookie

The session ID is typically stored in an HTTP cookie:

Attribute

Purpose

`HttpOnly`

Prevents JavaScript access (XSS protection)

`Secure`

Only sent over HTTPS

`SameSite=Strict`

Prevents CSRF attacks

`Path=/`

Cookie sent for all paths

`Max-Age`

Expiration time in seconds

The cookie is automatically included in every request to the same domain. No client-side code is required.

### 2.5 Characteristics

*   **Stateful:** The server maintains state for every logged-in user. It must remember all active sessions.
*   **Server-side storage:** Session data lives on the server. The client only holds a reference (the session ID).
*   **Automatic transmission:** Browsers handle cookies automatically. No JavaScript code needed to include credentials.
*   **Domain-bound:** Cookies are tied to a domain. They don't work well across different domains.

# 3\. Token-Based Authentication

Token-based authentication takes a different approach. Instead of storing state on the server, the server issues a self-contained token that the client stores and presents with each request.

### 3.1 How It Works

When a user logs in successfully:

1.  The server creates a **token** containing user information
2.  The server signs the token cryptographically
3.  The server sends the token to the client
4.  The client stores the token and includes it in subsequent requests
5.  The server validates the token signature to trust its contents

Notice the key difference: **there is no session lookup.** The server does not need to store anything. All the information it needs is embedded in the token itself.

### 3.2 JSON Web Tokens (JWT)

The most common token format is **JWT** (JSON Web Token). A JWT has three parts separated by dots:

**Header:** Specifies the algorithm used for signing

**Payload:** Contains claims (statements about the user and token)

**Signature:** Cryptographic signature that proves the token was issued by the server and has not been tampered with

### 3.3 Standard JWT Claims

Claim

Name

Description

`sub`

Subject

The user identifier

`iat`

Issued At

When the token was created

`exp`

Expiration

When the token expires

`nbf`

Not Before

Token is not valid before this time

`iss`

Issuer

Who issued the token

`aud`

Audience

Who the token is intended for

`jti`

JWT ID

Unique identifier for the token

You can also add custom claims like `role`, `permissions`, `email`, or any other data you need.

### 3.4 Token Storage on the Client

Unlike cookies, tokens are not automatically included in requests. The client must store and transmit them explicitly:

Storage

XSS Risk

CSRF Risk

Notes

`localStorage`

High

None

Persistent, accessible to any JS

`sessionStorage`

High

None

Cleared when tab closes

Memory (variable)

Low

None

Lost on refresh

HttpOnly Cookie

None

Medium

Best security, needs CSRF protection

**The trade-off:** localStorage is convenient but vulnerable to XSS. HttpOnly cookies are more secure but reintroduce some session-like characteristics.

### 3.5 Characteristics

*   **Stateless:** The server does not store any session data. Each token is self-contained.
*   **Client-side storage:** The token lives on the client. The server only needs the secret key to validate tokens.
*   **Explicit transmission:** The client must explicitly include the token (usually in the Authorization header).
*   **Cross-domain friendly:** Tokens can be sent to any domain, making them suitable for APIs and microservices.

# 4\. Scalability and Performance

The architectural differences between these approaches have significant implications for how your system scales.

### 4.1 Session-Based Scalability Challenges

When you have multiple servers, sessions become complicated:

**Problem:** User logs in on Server 1, which creates the session. The next request is routed to Server 2, which has no knowledge of that session.

**Solutions:**

1.  **Sticky Sessions:** Load balancer always routes the same user to the same server

*   Con: Uneven load distribution, failover loses sessions

3.  **Centralized Session Store:** All servers share a session store (Redis)

*   Con: Additional infrastructure, network latency, single point of failure

5.  **Session Replication:** Sessions are copied across all servers

*   Con: Network overhead, consistency challenges

### 4.2 Token-Based Scalability

Token-based authentication scales horizontally with minimal friction:

*   Any server can validate any token
*   No shared state required
*   No session lookup latency
*   Servers can be added or removed freely
*   Perfect for containerized and serverless environments

### 4.3 Performance Characteristics

Aspect

Session-Based

Token-Based

**Authentication Check**

Network call to session store

CPU for signature verification

**Latency**

Depends on session store (1-5ms typical)

Very fast (<1ms typical)

**Server Memory**

Stores session data

No session data

**Network Overhead**

Small cookie (~50 bytes)

Larger token (500+ bytes)

**Scalability**

Requires shared state

Naturally stateless

For most applications, the performance difference is negligible. The architectural simplicity of token-based authentication is usually the deciding factor, not raw performance.

# 5\. When to Use Which

Neither approach is universally better. The right choice depends on your specific requirements.

### 5.1 Use Session-Based Authentication When

*   **Traditional server-rendered web applications:** If your server generates HTML pages and the browser just renders them, sessions work naturally. The cookie is included automatically, and you have full control over the session lifecycle.
*   **You need immediate logout capability:** When a user logs out or an admin revokes access, it should take effect immediately. Sessions can be deleted instantly from the session store.
*   **You need to track active sessions:** Showing users their active sessions ("You're logged in from 3 devices") and letting them terminate specific sessions requires server-side session storage.
*   **Your application is single-domain:** If everything runs on one domain, cookies work seamlessly without CORS complications.
*   **You want minimal client-side complexity:** With sessions, the browser handles everything. No JavaScript code needed to manage authentication state.

### 5.2 Use Token-Based Authentication When

*   **Single-page applications (SPAs):** The frontend (React, Vue, Angular) is separate from the backend API. Token-based auth fits naturally with API-first architectures.
*   **Mobile applications:** Cookies are awkward in native mobile apps. Tokens can be stored in secure platform storage and included in API requests easily.
*   **Microservices architecture:** Services need to authenticate requests from other services. Tokens can be validated independently without a centralized session store.
*   **Cross-domain or third-party APIs:** Tokens can be sent to any domain. APIs serving multiple frontends or third-party clients benefit from tokens.
*   **Serverless environments:** Functions spin up and down frequently. Maintaining session state in this environment is impractical. Stateless tokens are ideal.
*   **You need to scale horizontally:** Adding servers should not require session synchronization. Tokens eliminate this operational burden.

# Summary

Authentication is a fundamental requirement, and the choice between session-based and token-based approaches has real architectural implications.

**Session-based authentication** is stateful. The server remembers logged-in users by storing session data. It offers simple revocation and full control over active sessions. The trade-off is that scaling requires shared session storage, and it works best within a single domain.

**Token-based authentication** is stateless. The server stores nothing; tokens are self-contained. It scales horizontally without shared state and works naturally across domains and services. The trade-off is that revocation is difficult, and token security depends heavily on client-side storage choices.

**Neither is universally better.** Traditional server-rendered applications work well with sessions. SPAs, mobile apps, and microservices architectures benefit from tokens. Many production systems use hybrid approaches, combining short-lived tokens with revocable refresh tokens to get the benefits of both.

**Security requires attention in both cases.** Sessions need protection against CSRF and session hijacking. Tokens need protection against XSS and require careful attention to storage and expiration. Both need HTTPS.

Launching soon
