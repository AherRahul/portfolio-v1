---
title: "Key-Value Stores"
description: "Key-Value Stores - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Key-Value Stores

In the previous chapter, we explored document databases and their flexible JSON-based data model.

While document databases offer rich query capabilities over nested structures, sometimes you do not need any of that. Sometimes you just need to store a value and retrieve it later by a key. No queries. No indexes. No schema. Just pure, fast storage and retrieval.

This is the domain of **key-value stores**. They are the simplest database type: give it a key and a value, get the value back when you provide the key.

By doing less, key-value stores can be incredibly fast. We are talking sub-millisecond latency for reads and writes. Redis, the most popular key-value store, can handle over a million operations per second on a single server.

Think of a key-value store like a hash map that persists to disk. You have used hash maps in your code: constant-time lookups, simple API, no complex queries. Key-value stores bring that model to the database layer, with the addition of persistence, replication, and distributed scaling.

# The Key-Value Model

A key-value store is, at its core, a giant hash map. You store data as key-value pairs:

*   **Key:** A unique identifier, typically a string. Keys are often structured with prefixes for organization (e.g., `user:123:profile`, `session:abc123`).
*   **Value:** The data associated with the key. Can be a string, number, JSON blob, binary data, or in some stores, structured data types.

### Operations

The API is minimal:

Operation

Description

Complexity

`GET key`

Retrieve the value for a key

O(1)

`SET key value`

Store a key-value pair

O(1)

`DELETE key`

Remove a key-value pair

O(1)

`EXISTS key`

Check if a key exists

O(1)

Some stores add variations:

*   `SETNX` (set if not exists)
*   `SETEX` (set with expiration)
*   `MGET/MSET` (multi-key operations)
*   `INCR/DECR` (atomic increment/decrement)

### What Makes Key-Value Stores Fast

Several design choices contribute to sub-millisecond performance:

**1\. Simple data access pattern.** There is no query parsing, query planning, or index traversal. The key hashes directly to a memory location.

**2\. In-memory storage.** Many key-value stores (Redis, Memcached) keep all data in RAM. Memory access is orders of magnitude faster than disk.

**3\. No schema overhead.** Values are opaque blobs. The database does not parse, validate, or index them.

**4\. Minimal coordination.** Single-key operations do not need locks or transaction coordination in most cases.

### Key Design Best Practices

Keys are your only access path.

#### **Use meaningful prefixes**

#### **Keep keys reasonably short**

Keys consume memory. A key like `user:1001` uses 10 bytes. A key like `application:production:user:profile:identifier:1001` uses 51 bytes. At millions of keys, this adds up.

#### **Use consistent separators**

Colons (`:`) are conventional, but be consistent. Some tools use dots or slashes.

#### **Avoid special characters**

Stick to alphanumeric characters and simple separators for compatibility.

# Common Use Cases

Key-value stores solve specific problems exceptionally well. Understanding these patterns helps you recognize when to reach for them.

### Caching

The most common use case. Place a key-value store in front of your primary database to cache frequently accessed data:

#### **Cache-aside pattern (most common):**

1.  Application checks cache first
2.  If hit, return cached value
3.  If miss, fetch from database
4.  Store result in cache
5.  Return to caller

#### **Benefits:**

*   Reduces database load by 10x-100x for read-heavy workloads
*   Sub-millisecond response times for cached data
*   Protects database from traffic spikes

### Session Storage

User sessions need fast access on every request. Storing them in a key-value store is ideal:

#### **Why key-value for sessions:**

*   Every request needs to validate the session (high frequency)
*   Sessions are accessed by a known key (session ID)
*   Sessions have a natural expiration (TTL support)
*   No need for complex queries on session data

### Rate Limiting

Limit API requests per user or IP address:

#### **Why key-value for rate limiting:**

*   Needs atomic increment (INCR command)
*   Natural TTL for sliding windows
*   Very high frequency (checked on every request)
*   Simple access pattern (single key per user/window)

### Real-Time Leaderboards

Sorted sets in Redis make leaderboards trivial:

#### **Why key-value (Redis) for leaderboards:**

*   Sorted sets maintain order automatically
*   O(log N) insert, O(log N + M) range query
*   Atomic score updates handle concurrent plays
*   No complex queries or joins needed

### Shopping Carts

Shopping carts are temporary, per-user, and accessed frequently:

#### **Why key-value for carts:**

*   Always accessed by user ID (known key)
*   Modified frequently during shopping
*   Temporary data (does not need durability guarantees of primary DB)
*   Can be lost without catastrophic consequences (vs. orders)

### Pub/Sub Messaging

Redis supports publish/subscribe messaging:

#### **Why key-value (Redis) for pub/sub:**

*   Low-latency message delivery
*   Simple channel-based routing
*   No persistence needed for ephemeral notifications
*   Handles thousands of connections

# Redis Deep Dive

Redis is the most popular key-value store, powering critical systems at Twitter, GitHub, Snapchat, and countless others. While it started as a simple key-value cache, it has evolved into a "data structure server" with rich capabilities.

### Data Types

Redis goes beyond simple strings. Each data type has specialized commands:

Type

Description

Use Cases

**String**

Binary-safe string up to 512MB

Caching, counters, simple values

**List**

Linked list of strings

Queues, recent activity, timelines

**Set**

Unordered unique strings

Tags, unique visitors, set operations

**Sorted Set**

Set with scores

Leaderboards, priority queues, range queries

**Hash**

Field-value pairs

Objects, user profiles, counters per field

**Stream**

Append-only log

Event sourcing, message queues

### String Operations

Beyond GET/SET, strings support:

### List Operations

Lists are doubly-linked lists, efficient for push/pop at either end:

**Use case: Job queue**

### Hash Operations

Hashes store objects without serialization overhead:

**Why hashes vs. JSON strings:**

*   Update individual fields without re-serializing entire object
*   Memory-efficient for small objects
*   Atomic operations on individual fields

### Sorted Set Operations

Sorted sets maintain elements ordered by score:

### Expiration (TTL)

Keys can have automatic expiration:

TTL is essential for:

*   Cache invalidation
*   Session expiration
*   Rate limiting windows
*   Temporary data cleanup

### Transactions

Redis transactions group commands to execute atomically:

Commands are queued during MULTI and executed atomically on EXEC. However, Redis transactions are not rollback-safe. If a command fails, others still execute.

For true atomicity, use Lua scripts:

# In-Memory vs Persistent

Key-value stores fall into two categories:

### In-Memory (Redis, Memcached)

Data lives primarily in RAM with optional persistence to disk.

Aspect

Characteristic

**Speed**

Sub-millisecond (memory access)

**Capacity**

Limited by RAM (typically 10s-100s GB)

**Persistence**

Optional (RDB snapshots, AOF log)

**Use case**

Caching, sessions, real-time features

#### **Redis persistence options:**

1.  **RDB (Redis Database):** Point-in-time snapshots at intervals. Fast recovery, but may lose recent data.
2.  **AOF (Append-Only File):** Log every write operation. More durable, but larger files and slower recovery.
3.  **RDB + AOF:** Combine both for durability with faster recovery.

### Persistent (DynamoDB, etcd)

Data is durably stored to disk with replication for fault tolerance.

Aspect

Characteristic

**Speed**

Low milliseconds (SSD access, network)

**Capacity**

Virtually unlimited (distributed storage)

**Persistence**

Always durable

**Use case**

Primary data store, configuration, coordination

### Comparison

Feature

Redis/Memcached

DynamoDB

etcd

Primary storage

RAM

SSD

SSD

Latency

< 1ms

1-10ms

1-10ms

Max size

RAM limit

Unlimited

Small (recommended < 8GB)

Durability

Optional

Guaranteed

Guaranteed

Scaling

Cluster mode

Automatic

Raft consensus

Best for

Cache, real-time

Primary KV store

Config, coordination

# Distributed Key-Value Stores

For scale beyond a single server, key-value stores can be distributed across multiple nodes.

### Redis Cluster

Redis Cluster automatically partitions data across multiple nodes:

#### **How it works:**

1.  The key space is divided into 16,384 hash slots
2.  Each master node owns a subset of slots
3.  Keys are assigned to slots via CRC16 hash
4.  Client libraries know the slot-to-node mapping
5.  Each master can have replicas for fault tolerance

#### **Limitations:**

*   Multi-key operations must use keys in the same slot (use hash tags: `{user:1001}:profile`, `{user:1001}:settings`)
*   Transactions limited to single node
*   Some commands not available in cluster mode

### Amazon DynamoDB

DynamoDB is a fully managed key-value and document database:

#### **Key features:**

*   Automatic scaling (on-demand or provisioned capacity)
*   Single-digit millisecond latency at any scale
*   Global tables for multi-region replication
*   No infrastructure to manage

#### **Data model:**

*   Primary key: Partition key alone, or partition key + sort key
*   Attributes can vary between items (schemaless)
*   Secondary indexes for query flexibility

### etcd

etcd is a distributed key-value store designed for configuration and coordination:

#### **Use cases:**

*   Kubernetes stores all cluster state in etcd
*   Service discovery (register/lookup services)
*   Distributed locking (leader election)
*   Configuration management

#### **Characteristics:**

*   Strong consistency via Raft consensus
*   Watch API for change notifications
*   Optimized for small values (recommended < 1MB)
*   Not suitable for large datasets

### Consistency Models

Distributed key-value stores offer different consistency guarantees:

Model

Description

Examples

**Strong**

Reads always see latest write

etcd, DynamoDB (consistent read)

**Eventual**

Reads may see stale data temporarily

DynamoDB (default), Cassandra

**Read-your-writes**

You see your own writes immediately

Redis (single node)

# Key-Value Store Patterns

### Cache-Aside (Lazy Loading)

The application manages the cache explicitly:

**Pros:** Simple, cache only what is accessed, tolerant of cache failures. **Cons:** First request is slow (cache miss), potential stale data.

### Write-Through

Write to cache and database together:

**Pros:** Cache is always consistent with DB. **Cons:** Write latency includes both DB and cache, cache may store rarely-read data.

### Write-Behind (Write-Back)

Write to cache immediately, persist to database asynchronously:

**Pros:** Very fast writes, can batch database operations. **Cons:** Risk of data loss if cache fails before persist, complexity.

### Distributed Locking

Use Redis for distributed locks:

For production use, consider Redlock algorithm or Redis RedLock for multi-node scenarios.

# When to Choose Key-Value Stores

Key-value stores are the right choice when:

*   **Access pattern is key-based.** You always know the key and need to retrieve the value. No complex queries.
*   **Speed is critical.** Sub-millisecond latency matters for your use case.
*   **Data is simple.** No relationships, no complex queries, no aggregations needed.
*   **Caching is the goal.** You are accelerating access to data that lives elsewhere.
*   **Temporary data.** Sessions, rate limits, shopping carts, other data with natural expiration.

### When to Consider Alternatives

Key-value stores may not fit when:

*   **You need to query by value.** "Find all users in California" requires scanning every key. Use a database with indexes.
*   **Relationships matter.** If you need to traverse connections between entities, consider document or graph databases.
*   **Aggregations are common.** Counting, summing, averaging across many keys is expensive.
*   **Data must be strongly consistent.** In-memory caches can lose data. For critical data, use a durable database.

# Summary

Key-value stores offer the simplest data model and the fastest performance:

Aspect

Characteristic

**Data model**

Key-value pairs, no schema

**Operations**

GET, SET, DELETE, EXISTS

**Performance**

Sub-millisecond (in-memory)

**Scaling**

Sharding by key hash

**Trade-off**

Speed and simplicity vs query flexibility

#### Key use cases:

*   **Caching:** Reduce database load by caching frequently accessed data
*   **Sessions:** Fast session validation on every request
*   **Rate limiting:** Atomic counters with TTL
*   **Real-time features:** Leaderboards, pub/sub, queues
*   **Temporary data:** Shopping carts, job queues

The next chapter explores wide-column stores, which extend the key-value model with column families for handling massive scale and high write throughput.

Launching soon
