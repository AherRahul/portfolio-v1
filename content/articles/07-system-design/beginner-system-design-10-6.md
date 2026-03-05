---
title: "Connection Pooling"
description: "Connection Pooling - System Design Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Connection Pooling

Every time your application needs to talk to a database, it must first establish a **connection**.

Now imagine your app handles **500 concurrent user requests per second**. If each request creates a new database connection and tears it down immediately, your database will suffocate under connection overhead.

That’s where **connection pooling** steps in. Instead of creating a new connection every time, the app **reuses existing ones**.

# 1\. The Problem Without Pooling

Let's break down why creating new connections on demand is so problematic.

Imagine a web server handling **500 concurrent requests per second**. Without a connection pool, the lifecycle for each request looks like this:

1.  A user request arrives at the application server.
2.  The application opens a brand new connection to the database. This involves:

*   A **TCP handshake** over the network.
*   A **database-level handshake** (e.g., SSL negotiation).
*   **Authentication** with a username and password.

4.  The application executes a small query (e.g., `SELECT * FROM products WHERE id = 123`).
5.  The application closes the connection, tearing down the TCP and database sessions.

This process introduces several major bottlenecks:

*   **High Latency**: The setup and teardown overhead (steps 2 & 4) for each connection can take longer than the actual query execution. This adds significant delay to every user request.
*   **Database Overload**: Each new connection consumes memory and CPU on the database server. A sudden spike in traffic can easily overwhelm the database, causing it to run out of available connections or resources.
*   **Resource Leaks**: If connections are not closed properly due to application errors, they can be left dangling, consuming resources until they time out.

Databases like PostgreSQL or MySQL are designed to handle hundreds, not tens of thousands of concurrent connections. Each connection consumes memory, file descriptors, and CPU.

So, without pooling:

> Every request starts with overhead, leading to poor throughput and degraded user experience.

# 2\. The Solution: Connection Pooling

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
