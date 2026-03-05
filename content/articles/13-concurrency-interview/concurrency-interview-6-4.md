---
title: "Optimistic vs Pessimistic Locking"
description: "Optimistic vs Pessimistic Locking - Concurrency Interview Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Optimistic vs Pessimistic Locking

Picture a system where 95% of operations are reads and only 5% are writes. You could grab a lock before every operation, making threads wait in line even when they're just reading data that no one is modifying.

That works, but it's wasteful. Most of the time, there's no conflict, yet every thread pays the cost of locking.

This tension sits at the heart of concurrent system design. Do you assume the worst and prevent conflicts upfront? Or do you assume the best and only deal with conflicts when they actually happen?

These two philosophies have names. **Pessimistic locking** assumes conflicts will happen and prevents them by acquiring locks before touching shared data. **Optimistic locking** assumes conflicts are rare and only checks for them at commit time.

Neither approach is universally better. The right choice depends on your workload's characteristics: how often conflicts actually occur, how expensive it is to retry failed operations, and whether you're optimizing for throughput or predictability.

Understanding when to use each approach is crucial for building efficient concurrent systems.

This chapter explores both strategies, their implementations, and how to choose between them.

# What is Pessimistic Locking?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
