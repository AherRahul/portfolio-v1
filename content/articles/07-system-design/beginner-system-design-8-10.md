---
title: "Cache Stampede"
description: "Cache Stampede - System Design Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Cache Stampede

Your cache is working perfectly. Hit rates are above 95%, latency is consistently low, and your database is humming along at a comfortable load.

Then a single popular cache entry expires, and within milliseconds, your database is drowning in thousands of identical queries. Response times spike. Timeouts cascade. Users start seeing errors.

This is a **cache stampede**, also known as the **thundering herd** problem. It happens when many requests simultaneously try to rebuild the same cache entry, overwhelming your database with redundant work.

The irony is that caching is supposed to protect your database, but a stampede turns the cache into a weapon against it.

In this chapter, we will explore:

*   What is a cache stampede?
*   Why does it happen?
*   The impact on your system
*   Prevention strategies
*   Monitoring and detection

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
