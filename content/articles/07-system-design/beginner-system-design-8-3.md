---
title: "Read-Through vs Write-Through"
description: "Read-Through vs Write-Through - System Design Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Read-Through vs Write-Through

In the cache-aside pattern, your application is the orchestrator. It checks the cache, queries the database on misses, populates the cache, and handles invalidation. Every service touching the data needs to implement this logic correctly. Miss one spot, and you have stale data.

Read-through and write-through patterns flip this model. The cache becomes the orchestrator. Your application talks only to the cache. The cache handles database interaction behind the scenes. This simplifies application code but requires a cache layer that understands how to reach your database.

These two patterns often work together: read-through handles fetching data, write-through handles persisting changes. Together, they create a unified data access layer where the cache and database appear as a single system.

# Read-Through Cache

In a read-through cache, the application only interacts with the cache. When data is not in the cache, the cache itself fetches it from the database.

### How It Works

**Step-by-step (cache miss scenario):**

1.  Application requests data from the cache: `cache.get("user:123")`
2.  Cache checks if data exists
3.  Data not found, cache queries the database itself
4.  Database returns the data to the cache
5.  Cache stores the data and returns it to the application

The application code is simple:

### Cache Loader

For read-through to work, the cache needs a way to fetch data. This is typically configured through a "loader" function:

### Advantages of Read-Through

Advantage

Explanation

**Simplified application code**

No cache miss handling logic in every service

**Consistent loading logic**

One place defines how data is fetched

**Reduced bugs**

Cannot forget to populate cache after a miss

**Easier testing**

Application code has no database dependencies

### Disadvantages of Read-Through

Disadvantage

Explanation

**Cache layer complexity**

Cache must understand your data model

**Tight coupling**

Cache configuration tied to database schema

**Cold start latency**

First access to any key hits database

**Limited flexibility**

Harder to have key-specific caching logic

# Write-Through Cache

Write-through caching ensures that every write goes to both the cache and the database synchronously. The write is only considered complete when both have been updated.

### How It Works

**Step-by-step:**

1.  Application writes data to the cache: `cache.set("user:123", userData)`
2.  Cache writes the data to the database
3.  Database confirms the write
4.  Cache stores the data locally
5.  Cache confirms completion to the application

The key property: the cache and database are always in sync after a write completes.

### Write-Through Configuration

Like read-through, write-through requires a "writer" function:

# Read-Through + Write-Through Combined

These patterns work well together, creating a unified data access layer:

**Benefits of combining:**

*   Applications interact only with the cache
*   Reads automatically populate on miss (read-through)
*   Writes automatically persist (write-through)
*   Cache is always consistent with database after writes
*   Single point of configuration for data access patterns

# Comparing the Patterns

Aspect

Cache-Aside

Read-Through

Write-Through

**Who manages cache population?**

Application

Cache

N/A (for reads)

**Who manages database writes?**

Application

N/A (for writes)

Cache

**Application complexity**

Higher

Lower

Lower

**Cache layer complexity**

Lower

Higher

Higher

**Write latency**

Database only

N/A

Database + cache

**Consistency model**

Eventual (with TTL)

Depends on write pattern

Strong (after write)

**Cold cache performance**

Application handles

Cache handles

N/A

### When to Use Each Pattern

**Use cache-aside when:**

*   You need fine-grained control over caching logic
*   Different data types need different caching strategies
*   You want cache to be optional (fail-open design)
*   Your cache does not support read-through/write-through

**Use read-through when:**

*   You want to simplify application code
*   Cache population logic is consistent across data types
*   Your cache layer supports it (e.g., Hazelcast, Apache Ignite, some Redis configurations)

**Use write-through when:**

*   You need strong consistency between cache and database
*   Write latency increase is acceptable
*   You want to guarantee cache is always fresh after writes

# Write-Through Latency Impact

Write-through adds latency to every write operation:

The latency is similar, but write-through is strictly sequential. If your cache latency is low, this rarely matters. If your database is slow, every write feels it.

**Interview Insight:** When asked about write-through latency, acknowledge the sequential nature but note that for most applications the difference is negligible compared to network and database latency. The consistency guarantee is often worth the small overhead.

# Handling Failures

Each pattern handles failures differently:

### Read-Through Failure Handling

If the database is unavailable during a read-through miss, the error propagates to the application. The cache cannot serve what it does not have.

**Strategies:**

*   Return cached data even if stale (if available)
*   Return a default/fallback value
*   Propagate the error and let application handle it

### Write-Through Failure Handling

Write-through failures are trickier because you have two systems to update:

# Practical Implementation Patterns

### In-Memory Cache Libraries

Libraries like Caffeine (Java), Guava (Java), and python-cachetools support read-through:

### Redis with Application Logic

Redis itself does not support read-through natively, but you can build it:

### Distributed Cache Systems

Some distributed caches support read-through and write-through natively:

System

Read-Through

Write-Through

Hazelcast

Yes (MapLoader)

Yes (MapStore)

Apache Ignite

Yes (CacheLoader)

Yes (CacheWriter)

Oracle Coherence

Yes

Yes

Redis

No (needs wrapper)

No (needs wrapper)

Memcached

No

No

# Read-Through and Data Warming

A challenge with read-through is cold cache performance. On startup or cache clear, every key results in a database query.

### Warming Strategies

**Passive warming:** Accept slow initial performance. Each miss populates the cache. Performance improves over time.

**Active warming:** Preload frequently accessed keys before traffic arrives.

**Interview Insight:** When discussing read-through, interviewers may ask about cold start scenarios. Explain warming strategies and how to protect the database during the warming period (rate limiting, gradual traffic increase).

# Write-Through vs Cache-Aside Invalidation

A key difference in write handling:

Aspect

Cache-Aside

Write-Through

After write completes

Cache is empty (invalidated)

Cache has new value

Next read

Cache miss, fetch from DB

Cache hit

Consistency

Eventual (next read gets fresh)

Immediate

Write complexity

Two operations (DB + invalidate)

One operation (to cache)

Write-through eliminates the cache miss after a write:

This is beneficial for read-after-write patterns where users immediately see their changes.

# Consistency Considerations

Write-through provides stronger consistency but is not perfect:

### The Race Condition

**Mitigation:** Use optimistic locking or versioning:

### Database Triggers and Side Effects

If the database has triggers that modify data, write-through may cache pre-trigger values:

**Mitigation:** Have the cache fetch the final state from the database after write, or avoid triggers that modify data.

# Summary

Read-through and write-through patterns move cache management from the application to the cache layer:

*   **Read-through** automatically loads data on cache miss. The application only calls `cache.get()`, and the cache handles database queries. This simplifies application code but requires configuring a loader function.
*   **Write-through** writes to both cache and database synchronously. After a write completes, the cache is guaranteed to be current. This increases write latency but eliminates cache misses after updates.
*   **Combined**, these patterns create a unified data access layer where the cache and database appear as one system.
*   **Trade-offs:** Simpler application code but more complex cache configuration. Write-through adds latency but improves consistency. Read-through has cold-start challenges that may require warming.
*   **Use when:** You want to centralize caching logic, need strong consistency after writes, or want to simplify services that access cached data.

Both read-through and write-through are synchronous patterns. The application waits for all operations to complete.

But what if write latency is critical and you can tolerate some delay in persistence? This is where write-behind caching comes in, trading immediate consistency for better write performance, which we will cover next.

Launching soon
