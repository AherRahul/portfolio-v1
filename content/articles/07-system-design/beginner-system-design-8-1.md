---
title: "What is Caching?"
description: "What is Caching? - System Design Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# What is Caching?

Caching is one of those ideas that feels almost too simple, until you realize it powers the speed of nearly every modern app you use.

At a high level, a cache is a fast storage layer that keeps copies of frequently used data so future requests can be served quickly, without repeatedly hitting slower systems like databases or external APIs.

Done well, caching can dramatically reduce latency, lower infrastructure cost, and improve reliability under traffic spikes.

# Why Caching Matters

Consider a social media application. When a user opens their feed, the application must:

1.  Authenticate the user (database query)
2.  Fetch the user's profile (database query)
3.  Retrieve the list of followed accounts (database query)
4.  Fetch recent posts from followed accounts (many database queries)
5.  Get like counts and comment counts for each post (more queries)
6.  Retrieve profile pictures for all post authors (even more queries)

Without caching, a single feed load might trigger 50+ database queries. Multiply by millions of users, and no database can keep up.

**Performance Impact:**

Metric

Without Cache

With Cache

Improvement

Response time

500ms

50ms

10x faster

Database queries/sec

500,000

50,000

10x reduction

Database CPU

95%

30%

Headroom for growth

Infrastructure cost

$50,000/month

$20,000/month

60% savings

# The Anatomy of a Cache

At its core, a cache is a key-value store optimized for fast lookups:

### Key Components

**Keys:** Unique identifiers for cached data. Good keys are:

*   Deterministic: The same request always produces the same key
*   Descriptive: You can understand what data the key represents
*   Collision-free: Different data should never share a key

**Values:** The cached data itself. Can be:

*   Serialized objects (JSON, Protocol Buffers, MessagePack)
*   Raw strings or binary data
*   Pre-computed results (HTML fragments, aggregated statistics)

**Metadata:** Information about the cached entry:

*   Creation timestamp
*   Expiration time (TTL)
*   Access count (for eviction decisions)
*   Size in bytes

# Cache Layers

Caching happens at multiple levels in a system. Each layer has different characteristics:

### Browser Cache

The closest cache to the user. Stores static assets and API responses based on HTTP headers.

Characteristic

Value

Location

User's device

Latency

~0ms

Size

50MB - 2GB typically

Control

HTTP headers (Cache-Control, ETag)

Best for

Static assets, infrequently changing data

### CDN Cache

Content Delivery Networks cache content at edge locations worldwide.

Characteristic

Value

Location

Edge servers globally

Latency

10-50ms (geographic proximity)

Size

Terabytes across the network

Control

HTTP headers, CDN configuration

Best for

Static content, media, public pages

### Application Cache

In-memory cache within the application process itself.

Characteristic

Value

Location

Application server memory

Latency

<1ms (in-process)

Size

Limited by server RAM

Control

Application code

Best for

Hot data, computed values, session state

The downside: each application instance has its own cache, leading to inconsistency and memory duplication across instances.

### Distributed Cache

A separate caching service shared by all application instances. Redis and Memcached are the most common choices.

Characteristic

Value

Location

Dedicated cache servers

Latency

1-5ms (network hop)

Size

Hundreds of GB to TB

Control

Application code, cache client

Best for

Shared state, session storage, database query results

### Database Buffer Pool

Databases maintain their own cache of frequently accessed pages in memory.

Characteristic

Value

Location

Database server memory

Latency

<1ms for cached pages

Size

Configured (often 70-80% of RAM)

Control

Database configuration

Best for

Transparent to application, automatic

# Cache Hit and Miss

When the application requests data from the cache, two things can happen:

**Cache Hit:** The data exists in the cache. Return it immediately.

**Cache Miss:** The data is not in the cache. Fetch from the source, optionally store in cache, then return.

### Cache Hit Ratio

The percentage of requests served from cache versus total requests:

Hit Ratio

Interpretation

\> 95%

Excellent. Cache is highly effective.

80-95%

Good. Normal for most applications.

50-80%

Moderate. May need tuning or different caching strategy.

< 50%

Poor. Cache may be undersized or data not cache-friendly.

A 90% hit ratio means 90% of requests avoid the database entirely. If your database can handle 10,000 QPS, a 90% hit ratio means your system can effectively handle 100,000 QPS.

# What to Cache

Not all data benefits equally from caching. Good candidates:

### High Cache Value

Data Type

Why It Works

**Read-heavy data**

Same data requested many times

**Expensive computations**

Aggregations, joins, transformations

**Slow data sources**

External APIs, legacy systems

**Stable data**

Configuration, reference data

### Poor Cache Candidates

Data Type

Why It Does Not Work

**Write-heavy data**

Cache invalidation overhead exceeds benefit

**Unique requests**

Each request needs different data

**Large objects**

Consume cache memory quickly

**Time-sensitive data**

Stale data is unacceptable

### The 80/20 Rule

In most applications, 20% of the data serves 80% of the requests. Focus caching efforts on that hot 20%:

# Cache Consistency

The hardest problem in caching is keeping cached data consistent with the source of truth. When the underlying data changes, the cache can become stale.

### Consistency Approaches

Approach

How It Works

Trade-off

**TTL-based**

Data expires after a time period

Simple but allows staleness up to TTL

**Invalidation**

Explicitly remove/update cache on changes

Consistent but complex to implement

**Write-through**

Update cache and database together

Consistent but higher write latency

**Eventual consistency**

Accept temporary staleness

High performance but requires tolerance

The right approach depends on your consistency requirements. A product price being stale for 5 minutes might be acceptable. A bank account balance being stale for 5 seconds is not.

# Caching Anti-Patterns

Caching is not free. These patterns often cause more problems than they solve:

### Cache Everything

Blindly caching all data leads to:

*   Memory exhaustion
*   Low hit ratios (cache filled with rarely accessed data)
*   Increased complexity without proportional benefit

### Infinite TTL

Data that never expires:

*   Becomes stale indefinitely
*   Requires explicit invalidation for every change
*   Creates subtle bugs when invalidation is missed

### Cache as Primary Storage

Treating the cache as the source of truth:

*   Data loss on cache failure or eviction
*   No durability guarantees
*   Recovery becomes impossible

### The Thundering Herd

When a popular cache entry expires, many requests simultaneously hit the database:

Solutions include locking (only one request fetches), probabilistic early expiration, and background refresh.

# Cache in Distributed Systems

In distributed systems, caching introduces additional considerations:

### Consistency Across Nodes

When multiple application servers share a cache, or when data is replicated:

Cache entries must be invalidated across all nodes. Replication introduces latency before all nodes are consistent.

### Data Partitioning

Large caches partition data across multiple nodes. Consistent hashing minimizes data movement when nodes are added or removed:

### Failure Handling

What happens when cache is unavailable?

Strategy

Behavior

Use Case

**Fail open**

Bypass cache, hit database directly

Cache is optional optimization

**Fail closed**

Return error to user

Cache data is critical

**Graceful degradation**

Serve stale data if available

Availability over consistency

# Measuring Cache Performance

Key metrics to monitor:

Metric

What It Tells You

**Hit ratio**

Cache effectiveness

**Latency (p50, p99)**

Response time impact

**Memory usage**

Capacity utilization

**Eviction rate**

Whether cache is undersized

**Miss latency**

Database impact on misses

A sudden drop in hit ratio or spike in evictions signals a problem: either traffic patterns changed, the cache is undersized, or keys are being invalidated too aggressively.

# Summary

Caching is fundamental to building scalable systems. Key takeaways:

*   **Caching stores frequently accessed data** in a faster storage layer to reduce latency and backend load.
*   **Multiple cache layers exist:** browser, CDN, application, distributed cache, and database buffer pool. Each has different characteristics and use cases.
*   **Hit ratio is the key metric.** A 90% hit ratio means 10x effective capacity improvement.
*   **Cache the right data:** read-heavy, expensive to compute, stable data. Avoid caching write-heavy or unique request data.
*   **Consistency is the hard problem.** Choose between TTL-based expiration, explicit invalidation, or write-through patterns based on your requirements.
*   **Watch for anti-patterns:** caching everything, infinite TTLs, treating cache as primary storage, and thundering herd.

Understanding what caching is and why it matters sets the stage for the next question: how exactly should your application interact with the cache? This brings us to caching patterns, starting with the most common one, the cache-aside pattern, where the application explicitly manages what goes in and out of the cache.

Launching soon
