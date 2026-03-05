---
title: "Write-Behind Cache"
description: "Write-Behind Cache - System Design Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Write-Behind Cache

Write-through caching gives you consistency: every write is immediately persisted to the database before confirming to the application. The price is latency. Every write waits for the database.

But what if your database is slow? Or geographically distant? Or you have a write-heavy workload where users expect instant responses? Waiting 50ms for every write adds up quickly.

**Write-behind caching**, also called **write-back caching**, takes a different approach: write to the cache immediately, persist to the database later. The application gets a fast response while a background process handles the slow database write asynchronously.

This pattern dramatically improves write latency and throughput. It also introduces significant complexity and risk. Data exists only in the cache until the background write completes. If the cache fails before that, data is lost.

# How Write-Behind Works

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
