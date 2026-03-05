---
title: "HyperLogLog"
description: "HyperLogLog - System Design Module 15"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# HyperLogLog

**"How many unique users visited our site today?"**

This seems like a straightforward question. Store every user ID in a set, count the set. Done.

But what happens when you have 100 million daily visitors? Each user ID might be 8 bytes. That's 800 MB just for one day's user IDs. Now multiply by every page, every geographic region, every hour of the day. You're looking at terabytes of storage just to answer simple counting questions.

This is where **HyperLogLog** changes everything. It answers "how many unique items?" using just 12 KB of memory, regardless of whether you're counting a thousand items or a billion.

The trade-off? It's an estimate. But with a standard error of only 0.81%, "100 million plus or minus 810,000" is more than accurate enough for analytics.

Introduced by Flajolet et al. in 2007, HyperLogLog has become the go-to solution for cardinality estimation in production systems. Redis, BigQuery, Presto, Spark, and countless analytics platforms use it under the hood.

Understanding how it works will help you design systems that handle massive scale without massive memory bills.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
