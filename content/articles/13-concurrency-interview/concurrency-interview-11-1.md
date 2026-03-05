---
title: "Design Thread-Safe Cache with TTL"
description: "Design Thread-Safe Cache with TTL - Concurrency Interview Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Thread-Safe Cache with TTL

What is a Cache with TTL?

A cache is a fast in-memory storage layer that holds frequently accessed data to avoid expensive operations like database queries or network calls. TTL (Time-To-Live) adds an expiration dimension: each cached entry automatically becomes invalid after a specified duration.

#### **Why do we need it?**

*   **Performance:** Avoid repeated expensive computations or I/O operations by storing results temporarily.
*   **Freshness:** TTL ensures data doesn't become stale. A cached user profile from 2 hours ago might have outdated information.
*   **Resource management:** Automatic expiration prevents the cache from growing indefinitely and consuming all available memory.

#### **Real-world examples**

System

How it uses TTL Cache

Session stores

User sessions expire after 30 minutes of inactivity

DNS resolvers

DNS records cached with TTL from DNS response

API response caches

Cache external API responses for 5 minutes to reduce calls

Database query caches

Cache query results, invalidate on TTL or data change

Rate limiters

Track request counts per user with sliding time windows

Authentication tokens

Cache validated JWT tokens until their expiration

We'll design an in-memory cache that handles the core concurrency challenges: safe concurrent reads and writes, proper expiration checking, and cleanup of expired entries.

Let's start by defining exactly what we need to build.

# 1\. Problem Definition

Question

**Design a thread-safe in-memory cache that supports get/put operations with per-entry TTL, where expired entries are never returned and eventually cleaned up.**

At first glance, the requirement sounds simple: store key-value pairs and check timestamps before returning values. But once multiple threads read, write, and compete with an expiration mechanism, the problem becomes a real concurrency challenge.

Consider what happens when a thread reads an entry at the exact moment it expires. Or when one thread puts a fresh entry while a cleanup thread is removing the old version of that same key. Or when two threads simultaneously try to put different values for the same key.

Core Requirements

*   **Get operation:** Return the value for a key if it exists and hasn't expired. Must never return an expired value.
*   **Put operation:** Store a key-value pair with a specified TTL. If the key already exists, replace it with the new value and TTL.
*   **Per-entry TTL:** Each entry has its own expiration time, not a global TTL for the entire cache.
*   **Thread-safety:** Multiple threads can call get and put simultaneously without data corruption or race conditions.
*   **Memory cleanup:** Expired entries must eventually be removed to prevent memory leaks. The cache shouldn't grow unbounded with dead entries.

Non-functional requirements

*   **Thread-safety:** All operations must be safe under concurrent access
*   **No stale reads:** Expired entries must never be returned, even under race conditions
*   **Memory efficiency:** Expired entries should be cleaned up, not accumulated forever
*   **Low latency:** Read operations should be O(1), not blocked by cleanup

In short, the system must guarantee that expired data is never returned, while allowing high-throughput concurrent access and preventing memory leaks from accumulated expired entries.

# 2\. System Overview

A real caching system would include eviction policies (LRU, LFU), size limits, persistence options, and distributed coordination. Here we focus only on the components that require thread-safe coordination: managing entry state across concurrent requests and expiration.

Let's think through what components we need.

The fundamental problem is storing key-value pairs where each pair has an expiration time. A plain hash map gives us O(1) lookups, but we need to attach metadata (expiration timestamp) to each value. This is the **CacheEntry**: a wrapper that holds the actual value plus its expiration time.

Next, we need a place to store these entries. We need fast lookups by key, and we need the storage itself to be thread-safe since multiple threads will read and write simultaneously. This is the **Entry Storage**: a concurrent hash map that maps keys to CacheEntry objects.

But storage alone isn't enough. How do we handle expiration? There are two approaches. The first is **lazy cleanup**: check if an entry is expired every time someone tries to read it, and if so, don't return it (and optionally remove it). This is simple but means expired entries sit in memory until someone happens to read them. The second is **eager cleanup**: a background thread periodically scans the cache and removes expired entries. This keeps memory tight but adds complexity.

The **Cache Manager** coordinates all of this. It handles get and put requests from client threads, checks expiration on reads, and either performs lazy cleanup or coordinates with the cleanup thread.

Notice the tension between components. Client threads want fast reads. The cleanup thread wants to remove expired entries. But what if a client is reading an entry at the exact moment the cleanup thread decides to remove it? What if a client puts a fresh entry for a key while cleanup is removing the old expired entry for that same key? These conflicts are the core concurrency challenge.

### Thread Boundaries

Understanding which threads perform which operations helps us reason about race conditions.

Operation

Executed By

Shared State Accessed

`get(key)`

User thread

Entry map (read), entry expiration (read)

`put(key, value, ttl)`

User thread

Entry map (write)

`remove(key)`

User thread

Entry map (write)

Expiration check

User thread (on get) or Cleanup thread

Entry expiration time

Cleanup scan

Background cleanup thread

Entry map (iterate + delete)

**Key insight:** The entry map is accessed by all threads. User threads perform get/put operations. The cleanup thread iterates and removes. Without proper synchronization, these operations can interfere with each other in subtle ways.

# 3\. Concurrency Challenges

Before diving into solutions, let's understand what makes this problem difficult. The challenge isn't any single operation; it's how they interact when happening simultaneously.

Every cache operation touches shared state: the map from keys to entries, and the expiration timestamp within each entry. When multiple threads read and write this state simultaneously, we face the classic problems of concurrent programming: lost updates, stale reads, and inconsistent state.

Getting it wrong means returning expired data to users (correctness violation), losing freshly written entries (data loss), or accumulating expired entries forever (memory leak). In a session cache, returning an expired session could mean authenticating a user who should be logged out. In a rate limiter, losing updates could allow users to exceed their quota.

## Challenge 1: Stale Read Race

This is the most dangerous race condition. A thread checks if an entry is expired, determines it's valid, but by the time it reads the value, the entry has been removed by the cleanup thread.

#### **What goes wrong**

The reader checks expiration and sees a valid entry. But between that check and reading the value, the cleanup thread removes the entry. This is a classic **TOCTOU (Time-Of-Check to Time-Of-Use)** bug. At the CPU level, another thread can execute thousands of instructions between these two steps. Even on a single-core machine, a context switch can happen at any point.

#### **How we solve it**

We make the cache entry immutable. Once we retrieve an entry reference from the map, that reference points to an object whose value and expiration time never change. Even if the cleanup thread removes the entry from the map, we still hold a valid reference to the complete entry object. We can safely check expiration and then read the value because the entry itself cannot be modified, only replaced in the map.

## Challenge 2: Put-Cleanup Race

A thread puts a fresh entry for a key, but the cleanup thread was iterating over the map and decides to remove that key based on the old expired entry it saw earlier.

The cleanup thread found an expired entry for "session:abc" and queued it for removal. Meanwhile, a writer puts a fresh entry for the same key. The cleanup thread then removes the key, destroying the fresh entry. The cleanup decision was correct when made, but the situation changed before execution.

#### **Root cause**

 Iteration and removal are not atomic. When iterating over a thread-safe map, we get a "weakly consistent" snapshot that may or may not reflect concurrent modifications. There's a gap between seeing an expired entry during iteration and executing the removal, during which another thread can replace the entry entirely.

#### **How we solve it**

Instead of unconditionally removing by key, we use conditional removal: only remove if the current value matches the expired entry we observed. Better yet, we use an atomic compute operation that locks the bucket for that key and lets us check expiration and remove in one operation. If a writer put a fresh entry between iteration and compute, we see the fresh entry, find it's not expired, and leave it alone.

## Challenge 3: Concurrent Put Race

Two threads simultaneously try to put different values for the same key. Without proper synchronization, one write can be lost.

#### **What goes wrong**

Both threads create their entry objects, then race to store them. With a thread-safe map, you won't get corruption, but results are non-deterministic. With a regular map, the internal structure could become corrupted.

#### **How we solve it**

For simple caches, "last writer wins" semantics are usually acceptable. For read-modify-write operations (like incrementing a counter), we use an atomic compute operation that reads the old value, calculates the new value, and stores it while holding the bucket lock. For a rate limiter where losing an increment means allowing users to exceed their limits, this atomicity is essential.

## Challenge 4: Read During Modification

A thread reads an entry while another thread is modifying it. Without proper visibility guarantees, the reader might see partially constructed state.

#### **What goes wrong**

The reader sees the entry in an intermediate state: new value but old expiration time. This violates the invariant that value and expiration should be consistent.

#### **Why this happens**

Modern CPUs use store buffers, cache hierarchies, and out-of-order execution. When one thread writes the value then the expiration, the CPU might reorder these writes, or they might sit in a store buffer without being flushed to main memory. Another thread on a different core reads from its own cache which might have stale data. Memory models define "happens-before" relationships that guarantee visibility, but only when proper synchronization is used.

#### **How we solve it**

We make the cache entry immutable and store references atomically. When we put a new entry into the thread-safe map, the map ensures that the reference write is visible to other threads. Since the entry is immutable, by the time another thread can see the reference, all the entry's fields were already set during construction. There's no window where a reader can see a partially constructed entry.

## State Machine

Each cache entry follows a simple lifecycle. Understanding this helps us identify which transitions are dangerous.

#### **Dangerous transitions**

1.  **PRESENT → EXPIRED:** This transition is unusual because it happens due to time passing, not an explicit operation. The entry doesn't "know" it's expired until something checks. In practice, the transition happens when code calls `isExpired()`. This means an entry can be conceptually expired (past its TTL) but still sitting in the map. Any thread checking the entry must handle this transition atomically with their read. The key insight: we don't need to synchronize the transition itself since we always check expiration before using the value.
2.  **EXPIRED → ABSENT (by cleanup) vs EXPIRED → PRESENT (by put):** Both cleanup and put want to act on an expired entry. The cleanup thread wants to remove it. A writer wants to replace it with a fresh entry. These operations must not interfere. If cleanup removes the key unconditionally, it might destroy a fresh entry that was just put. We solve this by making cleanup conditional: only remove if the entry is still the expired one we observed.
3.  **PRESENT → PRESENT (update):** Multiple threads might try to update simultaneously. With a thread-safe map, individual put operations are atomic, so we won't get corruption. But "last writer wins" might not be the desired semantic. For read-modify-write operations, use an atomic compute operation to read the old value and write the new one atomically.

Now that we understand the challenges, let's explore synchronization strategies.

# 4\. Synchronization Strategy

Now that we understand the challenges, let's explore how to solve them. We'll examine three approaches, starting simple and progressively optimizing.

## Approach 1: Coarse-Grained Locking

The simplest approach: one lock protects all cache operations.

#### **How it works**

1.  Every operation (get, put, remove, cleanup) acquires the global lock first
2.  Only one thread can access the cache at a time
3.  Simple to reason about, impossible to have race conditions

#### **Analysis**

Property

Status

Explanation

Correctness

Yes

Single lock serializes all access

Deadlock-free

Yes

Only one lock, can't deadlock

No stale reads

Yes

Check and read are atomic

Concurrency

Low

One thread at a time, all others wait

Throughput

Poor

Bottleneck under high load

#### **When to use**

Prototyping, low-throughput scenarios, when correctness matters more than performance, or as a baseline to compare against.

## Approach 2: Thread-Safe Map with Lazy Cleanup

Use a thread-safe map that handles concurrent access internally. Check expiration on every read and remove expired entries lazily.

#### **How it works**

1.  Thread-safe maps allow concurrent reads and writes to different segments/buckets
2.  On `get()`: retrieve entry, check if expired, return value or null
3.  If expired on read, remove it (lazy cleanup)
4.  No background thread needed
5.  Expired entries stay in memory until someone reads them

#### **Why this works**

Thread-safe maps provide atomic operations like conditional removal and atomic compute. These operations let us avoid TOCTOU bugs. For example, we can atomically check if an entry is expired AND remove it in one operation.

#### **How ConcurrentHashMap achieves concurrency**

Internally, these maps divide the data into segments or buckets, each with its own lock. When you access a key, only that key's bucket is locked, allowing other threads to access different buckets simultaneously. For read operations, many implementations use lock-free techniques to avoid locking entirely in most cases. This design gives us O(1) operations with minimal contention when keys are distributed across buckets.

#### **Analysis**

Property

Status

Explanation

Correctness

Yes

ConcurrentHashMap handles concurrent access

Deadlock-free

Yes

No explicit locks held

No stale reads

Yes

Always check expiration before returning

Concurrency

High

Different keys accessed in parallel

Memory efficiency

Poor

Expired entries linger until read

#### **When to use**

Most common case. Good for caches where entries are read frequently, so lazy cleanup happens naturally. Not ideal if many entries expire without being read again (they'll accumulate).

## Approach 3: ConcurrentHashMap with Background Cleanup

Combine ConcurrentHashMap for thread-safe access with a scheduled background thread that periodically removes expired entries.

#### **How it works**

1.  User operations use a thread-safe map just like Approach 2
2.  A scheduled task runs cleanup every N seconds
3.  Cleanup iterates through entries and removes expired ones
4.  Use atomic check-and-remove to avoid the put-cleanup race

#### **Solving the put-cleanup race**

The key insight is that removal must be conditional. We don't just remove a key; we remove a key only if it still has the expired entry we saw. Thread-safe maps provide atomic compute operations that give us this check-and-modify atomicity:

If a writer puts a fresh entry between when we iterated and when we called `compute()`, the lambda sees the fresh entry, finds it's not expired, and keeps it. Race condition avoided.

#### **Why atomic compute works**

The atomic compute operation acquires the bucket lock for the given key before calling your function, and holds it until your function returns. No other thread can modify that key's entry while your function executes. This gives us atomicity without explicit locking. The function receives the current value (which might be different from what we saw during iteration), checks it, and returns either the same value (keep) or null (remove).

#### **Analysis**

Property

Status

Explanation

Correctness

Yes

Atomic compute prevents races

Deadlock-free

Yes

No explicit lock ordering issues

No stale reads

Yes

Check on read + background cleanup

Concurrency

High

ConcurrentHashMap + minimal contention

Memory efficiency

Good

Proactive cleanup prevents accumulation

#### **When to use**

Production systems where memory efficiency matters. Good for caches with many entries that may expire without being read again.

### Strategy Comparison

Aspect

Coarse-Grained

Lazy Cleanup

Background Cleanup

Complexity

Low

Low-Medium

Medium

Concurrency

Low

High

High

Memory efficiency

Medium (lazy)

Poor (no cleanup)

Good (proactive)

Latency predictability

Blocked by lock

Consistent

Occasional cleanup spikes

Code size

Small

Small

Larger (scheduler)

Best for

Prototypes

Read-heavy caches

Memory-sensitive apps

Recommendation

For interviews, **start with Approach 2 (thread-safe map with lazy cleanup)**. It demonstrates that you:

*   Understand concurrent data structures
*   Know to check expiration atomically with the read
*   Can reason about when lazy cleanup is sufficient

Then mention Approach 3 as an optimization: "If memory is a concern because many entries expire without being read, I'd add a background cleanup thread. The key is using atomic removal to avoid racing with put operations."

The key insight: thread-safe maps give us thread-safe basic operations, but we still need to think carefully about compound operations like "check if expired and remove."

# 5\. Implementation

Let's build a production-ready cache that implements Approach 2 (lazy cleanup) with an optional background cleanup (Approach 3).

### 5.1 Entity Classes

At the core of the cache is a small wrapper that stores the value along with its expiration metadata.

#### CacheEntry Design

`CacheEntry` is intentionally **immutable**. Once created, neither the value nor its expiration time can change. This single decision eliminates an entire class of concurrency bugs.

If entries were mutable, a reader thread could observe inconsistent state. For example, a thread might check that an entry is not expired and then read the value, while another thread updates the entry in between. The result could be a value that no longer matches the expiration logic the reader relied on.

With immutability, once a thread obtains a reference to a `CacheEntry`, that reference is guaranteed to represent a consistent snapshot. Expiration checks and value reads always align. Updates are handled by creating a **new entry** and atomically replacing the old one in the map.

#### Expiration Time Representation

The cache stores an **absolute expiration timestamp**, not a TTL duration. This makes expiration checks trivial: a single comparison between the current time and the stored deadline. The expiration moment is computed once during construction rather than recalculated on every read.

The implementation uses **monotonic time** rather than wall-clock time. Wall-clock time can jump forward or backward due to NTP synchronization, daylight saving changes, or manual adjustments. Monotonic time moves forward at a steady rate, ensuring entries expire predictably regardless of system clock changes.

#### **Memory considerations**

Each `CacheEntry` introduces some overhead beyond the value itself. For large cached objects, this overhead is negligible. For very small values such as primitives or short strings, it can become noticeable.

In memory-constrained scenarios, a more compact representation with separate expiration tracking may be appropriate.

### 5.2 Main Class: ThreadSafeCache

The main cache class coordinates storage, retrieval, and cleanup while remaining safe under concurrent access.

#### Configuration and Cleanup Strategy

The constructor allows optional background cleanup. When `cleanupIntervalMs` is zero, the cache relies entirely on lazy cleanup during reads. When a positive interval is provided, a background task periodically removes expired entries.

This flexibility lets users choose the right trade-off based on access patterns. Read-heavy systems may benefit from background cleanup, while simpler workloads can rely solely on lazy expiration.

#### Core Access Pattern

The `get()` method demonstrates the fundamental pattern used throughout the cache:

1.  Retrieve the entry
2.  Check whether it has expired
3.  Conditionally remove it if necessary

The key detail is the use of `remove(key, entry)`. This operation only succeeds if the entry in the map is still the same object. If another thread has already replaced it with a fresh value, the removal fails. This avoids the classic **put-cleanup race**, where a newly inserted entry could otherwise be removed incorrectly.

#### Size Semantics

The `size()` method reports the raw map size, which may include expired entries. The `activeSize()` method filters out expired entries to provide a point-in-time estimate. Because the cache is concurrent, this count may already be stale by the time it is returned. It is suitable for monitoring and diagnostics, not for correctness decisions.

#### Background Cleanup Thread

The cleanup thread is marked as a **daemon thread**, ensuring it does not prevent JVM shutdown. Without this, applications could hang on exit waiting for cleanup tasks to terminate.

### 5.3 Demo

Let's see the cache in action with multiple threads.

#### **Expected output**

The output shows the cache working correctly under concurrent access. Hits and misses depend on timing, but we see that:

1.  Multiple writers and readers operate concurrently without errors
2.  TTL expiration works correctly (session becomes null after 600ms)
3.  The cleanup thread keeps the cache from accumulating expired entries

# 6\. Sequence Diagram

The diagram below shows how a get operation handles expiration checking. Notice how the expiration check and potential removal happen atomically to prevent race conditions.

#### **Step-by-step walkthrough for get("session:abc"):**

1.  **User thread calls get("session:abc"):** The user's thread invokes the cache's get method with the key.
2.  **Cache retrieves entry from the map:** The cache calls the map's get method. With a thread-safe map, this is typically a lock-free or fine-grained locked read.
3.  **Map returns entry reference (or null):** The map returns a reference to the cache entry object if the key exists, or null if it doesn't. This is just a pointer/reference copy; the entry object itself is not copied.
4.  **If null, return null immediately:** No entry means cache miss. Return null to the caller.
5.  **Check expiration on the entry:** Compare the current monotonic time against the stored expiration time. Because the entry is immutable, this check is safe even if another thread is simultaneously putting a new entry for this key.
6.  **If not expired, return the value:** The entry is still valid. Return the value. The value reference is safe because the entry is immutable.
7.  **If expired, use conditional removal:** This is the critical step. We don't blindly remove whatever is at that key. Instead, we use conditional removal that only removes if the current value is still the same entry we checked. If another thread put a fresh entry between step 3 and now, the conditional remove does nothing, which is exactly what we want.
8.  **Return null for expired case:** Whether the remove succeeded or not, return null. The entry we found was expired.

### **Put operation with concurrent cleanup**

The diagram below shows what happens when a put() operation races with the cleanup thread.

#### **Step-by-step walkthrough for put() with concurrent cleanup:**

1.  **Cleanup thread finds expired entry:** During its periodic scan, the cleanup thread iterates over the map and finds that "session:abc" has an expired entry.
2.  **Cleanup marks key for removal:** The cleanup thread decides this key needs to be cleaned up. But it hasn't executed the removal yet.
3.  **Writer calls put():** Meanwhile, a writer thread wants to store a fresh value for the same key with a new TTL.
4.  **Writer creates new cache entry:** The writer creates a new immutable cache entry with the new value and expiration time.
5.  **Writer stores entry in map:** The writer atomically replaces whatever was there with the new entry.
6.  **Cleanup attempts atomic check-and-remove:** The cleanup thread finally gets to this key and performs an atomic check-and-remove operation.
7.  **Operation sees fresh entry:** The atomic operation retrieves the current value, which is now the fresh entry the writer just put. It checks expiration, finds it's not expired, and leaves the entry unchanged.
8.  **Fresh entry survives:** The cleanup thread's removal attempt has no effect because we used conditional removal. The fresh data is preserved.

**Key insight:** This is why we use atomic check-and-remove instead of unconditional removal in the cleanup thread. The atomic operation retrieves the current value and decides what to do with it. If the value changed between iteration and removal, we see the new value and make the right decision.

Launching soon
