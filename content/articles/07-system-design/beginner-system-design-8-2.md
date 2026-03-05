---
title: "Cache-Aside Pattern"
description: "Cache-Aside Pattern - System Design Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Cache-Aside Pattern

You have decided to add caching to your application. The obvious question is: who manages the cache? Does your application explicitly control what goes in and out? Does the cache automatically sync with your database? Does the database itself handle caching?

The **cache-aside pattern**, also known as lazy loading, is the most common answer: your application code explicitly manages the cache. When reading data, the application checks the cache first. On a miss, it fetches from the database and populates the cache. On writes, the application updates the database and invalidates the cache.

This pattern gives you complete control. It also gives you complete responsibility.

Cache-aside is the foundation for understanding other caching patterns. The read-through and write-through patterns we cover next automate parts of what cache-aside does manually.

# How Cache-Aside Works

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
