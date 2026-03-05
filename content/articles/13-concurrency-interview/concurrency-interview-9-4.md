---
title: "Reader-Writer Pattern"
description: "Reader-Writer Pattern - Concurrency Interview Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Reader-Writer Pattern

Many systems are read-heavy: lots of threads read shared data, while writes are relatively rare. Treating every access the same with a single mutex forces reads to run one at a time, wasting concurrency and hurting throughput.

The **reader-writer pattern** solves this by allowing **multiple readers** to access the data simultaneously, while still ensuring **writers get exclusive access**.

In this chapter, we'll explore how reader-writer locks work, implement them from scratch, and understand the subtle fairness problems that can cause starvation.

# What is the Reader-Writer Pattern?

Real-World Analogy

Imagine a library reading room with a single rare reference book.

*   Many people can sit and **read** the book at the same time without causing problems.
*   But if someone needs to **edit** the book (a librarian updating pages), everyone else must stop reading and the editor must have exclusive access.

So the rule is:

*   Multiple readers are allowed together.
*   A writer requires the room to be empty and blocks new readers until the update is done.

That’s the reader-writer pattern: maximize concurrency for reads, but enforce exclusivity for writes to keep the data consistent.

**The key insight:** reading is non-destructive. Ten people reading a book don't interfere with each other. But writing is destructive. Someone making changes while others read creates chaos. So we allow multiple readers OR a single writer, never both.

The diagram shows three readers all accessing the shared resource concurrently through a shared lock. The writer is waiting because readers are currently active. Once all readers finish, the writer can acquire the exclusive lock.

The key properties of reader-writer locks:

*   **Shared access:** Multiple readers can hold the lock simultaneously
*   **Exclusive access:** Writers have sole access, blocking all readers and other writers
*   **No mixing:** Reads and writes never happen at the same time
*   **Higher throughput:** When reads dominate, parallelism is preserved

### The Problem: Unnecessary Serialization

A regular mutex serializes all access. If you have 100 threads trying to read and 1 thread trying to write, a mutex makes all 101 threads take turns, even though the 100 reads could happen simultaneously.

Consider the math. With a mutex, if each read takes 1ms and each write takes 10ms, 100 reads + 1 write takes 110ms (everyone waits for everyone). With a reader-writer lock, the 100 reads can happen in parallel (1ms if we have enough cores), then the write takes 10ms, total around 11ms. That's 10x faster for read-heavy workloads.

### Real Systems Using This Pattern

System

How It Uses Reader-Writer Locks

Database MVCC

PostgreSQL, MySQL InnoDB use Multi-Version Concurrency Control. Readers see a snapshot, writers create new versions. Conceptually similar to reader-writer, but even more permissive.

Linux kernel

`rwlock_t` protects many kernel data structures. Process lists, routing tables, file system metadata.

Java `ReadWriteLock`

`ReentrantReadWriteLock` provides reader-writer semantics. Used in caches, configuration stores, lookup tables.

C++ `shared_mutex`

`std::shared_mutex` (C++17) allows multiple readers via `shared_lock`, single writer via `unique_lock`.

Redis

Single-threaded, but client-facing concurrency. `WATCH` command enables optimistic reader-writer semantics.

# Core Components

A reader-writer lock has four essential components that work together to manage concurrent access.

### Read Lock (Shared Lock)

The read lock grants shared access. Multiple threads can hold the read lock simultaneously. A thread holding the read lock can only read, not write.

#### **Key Responsibilities**

*   Allow multiple readers to acquire concurrently
*   Block if a writer holds the lock or is waiting (depends on policy)
*   Track the number of active readers
*   Release and potentially wake waiting writers

### Write Lock (Exclusive Lock)

The write lock grants exclusive access. Only one thread can hold the write lock, and no readers can be active. A thread holding the write lock can both read and write.

#### **Key Responsibilities**

*   Block until all readers release
*   Block other writers
*   Release and wake waiting readers or writers

### Reader Count

An internal counter tracks how many readers currently hold the lock. When the count drops to zero and a writer is waiting, the writer can proceed.

#### **Design Decisions**

*   Should be atomic or protected by an internal mutex
*   Increment on acquire, decrement on release
*   Check for zero to allow waiting writers

### Fairness Policy

This is where things get complicated. Who gets priority when both readers and writers are waiting?

Policy

Behavior

Trade-off

Reader Preference

New readers can acquire even if a writer is waiting

Writers may starve

Writer Preference

Writers block new readers; writer gets priority

Readers may starve

Fair (FIFO)

Requests are served in order

Lower throughput, but no starvation

**Reader Preference** is simple but dangerous. Imagine a steady stream of readers. A writer requests access. Under reader preference, new readers keep jumping ahead of the writer because no writer is currently active. The writer waits forever. This is writer starvation.

**Writer Preference** flips the problem. When a writer is waiting, new readers must wait too. This can starve readers if writers are frequent.

**Fair locks** process requests in order. When a writer arrives, it joins the queue. New readers that arrive after must wait behind the writer. This prevents starvation but reduces throughput since readers can't batch together as easily.

# How It Works

Let's trace through the lifecycle of reader and writer access.

### **Scenario: Multiple Readers, Then a Writer**

#### **Step 1: First Reader Acquires**

Reader R1 calls `readLock()`. No one holds the lock. R1 acquires, reader count becomes 1.

#### **Step 2: More Readers Acquire**

R2 and R3 call `readLock()`. Since only readers are active, they acquire immediately. Reader count becomes 3.

#### **Step 3: Writer Requests Lock**

Writer W1 calls `writeLock()`. Readers are active, so W1 blocks. It registers itself as a waiting writer (important for writer-preference policies).

#### **Step 4: Readers Finish**

R1 finishes, calls `readUnlock()`. Reader count becomes 2. W1 still blocked. R2 finishes. Reader count becomes 1. W1 still blocked. R3 finishes. Reader count becomes 0. W1 is signaled.

#### **Step 5: Writer Acquires**

W1 wakes up, acquires the write lock. No readers or other writers can proceed.

#### **Step 6: Writer Finishes**

W1 calls `writeUnlock()`. Waiting readers (if any) are signaled. Next in queue proceeds.

#### **Example Trace**

# Implementation

Let's implement a reader-writer lock from scratch, then show standard library usage.

JavaPythonC++C#Go

**Key Points:**

*   Line 8: `writeRequests > 0` gives writers priority over new readers
*   Line 16-18: Only notify when last reader exits (optimization)
*   Line 22-29: `writeRequests` tracks waiting writers for priority
*   Line 33: `notifyAll()` because both readers and writers might be waiting

### Using Standard Library Implementations

# Practical Example

### Scenario: Configuration Store

You're building a configuration management system. Applications read configuration values constantly, but configuration updates are rare (deployments, operator changes). Reads must be fast and concurrent. Writes are infrequent but must be atomic.

#### **Requirements:**

*   High-throughput concurrent reads
*   Atomic configuration updates
*   No stale reads during updates
*   Support for configuration versioning

# When to Use / When Not to Use

Use When

Avoid When

Reads vastly outnumber writes (10:1 or more)

Reads and writes are balanced

Read operations are fast

Reads are slow (lock held too long)

Multiple threads read concurrently

Single-threaded access

Data structure is read-mostly

Data is frequently modified

Write operations are infrequent

Writes happen on every access

#### **Consider Instead:**

*   **Mutex:** When reads and writes are balanced, the RW lock overhead isn't worth it
*   **Copy-on-write:** When writes are very rare, copy the entire structure for each write
*   **Atomic references:** When the shared state is a single reference (swap atomically)
*   **MVCC:** When readers should never block, even during writes (use snapshots)
*   **Lock-free structures:** When maximum throughput is critical and you can use CAS

Launching soon
