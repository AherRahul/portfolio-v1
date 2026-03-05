---
title: "Two-Phase Locking"
description: "Two-Phase Locking - Concurrency Interview Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Two-Phase Locking

Consider a bank transfer: debit account A, credit account B. You need locks on both accounts, but when should you release them?

If you release A's lock after debiting and before crediting B, another transaction could read A's debited balance alongside B's original balance, seeing an inconsistent state where money has vanished.

The solution turns out to be surprisingly simple: don't release any lock until you've acquired all the locks you need. Hold everything until you're done with everything.

This principle is the foundation of **Two-Phase Locking**, and it's the algorithm that runs inside virtually every relational database you've ever used.

Two-Phase Locking is a concurrency control protocol that guarantees serializability, meaning concurrent transactions produce the same result as if they executed one at a time, in some order.

It's the standard approach in relational databases like PostgreSQL, MySQL, and SQL Server. Understanding it is essential for database internals interviews, debugging transaction issues, and reasoning about why your application occasionally sees strange data or deadlocks.

# What is Two-Phase Locking?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
