---
title: "Semaphores"
description: "Semaphores - Concurrency Interview Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Semaphores

Imagine you're managing a parking lot with 50 spaces. Cars can enter freely as long as spaces are available.

As the lot fills up, the sign at the entrance updates: “45 spaces available”, “12 spaces available”, and eventually “LOT FULL.” Once it is full, new cars cannot enter. They wait at the gate until a car leaves and a space opens up.

This is exactly how a **semaphore** works.

A semaphore maintains a counter of available **permits**. Each thread must acquire a permit before it can proceed. When the thread finishes, it releases the permit back to the semaphore. If the counter reaches zero, any new thread that asks for a permit must wait until another thread releases one.

Loading simulation...

This is the key difference from a mutex:

*   A **mutex** is binary: locked or unlocked, so only one thread can enter at a time.
*   A **semaphore** generalizes the idea: it allows up to **N** threads to enter concurrently.

This makes semaphores the right tool when you need to limit concurrent access to a pool of resources, like database connections, API rate limits, or bounded buffers.

In this chapter, we'll explore how semaphores work internally, understand the difference between binary and counting semaphores, and see practical implementations.

# What is a Semaphore?

A semaphore is a synchronization primitive built around a simple idea: maintain an integer count representing available "permits," and provide atomic operations to acquire and release those permits.

Real-World Analogy

The best way to understand this is through a concrete analogy.

Picture a nightclub with a strict capacity limit of 100 people. A bouncer stands at the door with a clicker counter. Every time someone enters, the bouncer clicks "in" (decrementing the count). Every time someone leaves, the bouncer clicks "out" (incrementing the count).

When the count hits zero, new guests must wait in line outside until someone leaves and frees up a spot.

The diagram below shows this in action. Three threads have successfully acquired permits from a semaphore initialized with 3 permits. Thread 4 arrives and wants to acquire, but no permits remain, so it must wait until one of the other threads releases.

When Thread 1, 2, or 3 finishes its work and calls `release()`, the permit returns to the pool. At that point, Thread 4 wakes up, acquires the newly available permit, and proceeds.

### The Two Core Operations

Formally, a semaphore supports two atomic operations:

*   **acquire() / wait() / P():** Attempt to decrement the counter. If the counter is greater than zero, decrement it and return immediately. If the counter is zero, block the calling thread until another thread releases a permit.
*   **release() / signal() / V():** Increment the counter. If any threads are blocked waiting for permits, wake one of them up.

The letters P and V come from Dutch: "proberen" (to try/test) and "verhogen" (to increment). These names come from Edsger Dijkstra's original 1965 paper that introduced semaphores as a synchronization primitive. You'll see all three naming conventions (acquire/release, wait/signal, P/V) used in different languages and textbooks, but they all mean the same thing.

The key insight is that both operations are atomic. Between checking the counter and modifying it, no other thread can intervene. This atomicity is what makes semaphores safe for coordination.

# Binary vs Counting Semaphores

Semaphores come in two flavors, distinguished by how many permits they manage.

### Binary Semaphore (permits = 1)

A binary semaphore has only two states: available (1) or taken (0). When a thread acquires the single permit, the semaphore transitions to the "taken" state. When that thread (or any thread) releases, it transitions back to "available."

The state diagram below illustrates these two states and the transitions between them:

Starting in the "Available" state, a thread calling `acquire()` moves the semaphore to "Taken." While taken, any other thread calling `acquire()` will block. When any thread calls `release()`, the semaphore returns to "Available" and a waiting thread (if any) can proceed.

Binary semaphores can be used for mutual exclusion (only one thread at a time), but as we'll see later, they differ from mutexes in important ways.

### Counting Semaphore (permits = N)

A counting semaphore allows up to N threads to hold permits simultaneously. As threads acquire permits, the count decreases. When the count reaches zero, additional threads must wait.

The state diagram below shows a counting semaphore initialized with 3 permits:

Following the diagram from left to right: the semaphore starts with 3 permits (green). Each `acquire()` decrements the count. After three acquires, we reach zero (red). A fourth `acquire()` enters the "Waiting" state, blocked until a `release()` occurs. When a thread releases, the count increments. If threads are waiting, one is woken to acquire the newly available permit.

### When to Use Each

The choice between binary and counting semaphores depends on what you're trying to accomplish:

Type

Permits

Best For

Binary

1

Signaling between threads, simple synchronization gates

Counting

N

Connection pools, rate limiting, bounded buffers, limiting concurrent operations

Binary semaphores shine when you need one thread to signal another that something has happened, like "data is ready" or "initialization complete." Counting semaphores shine when you have a pool of interchangeable resources and want to limit how many threads can use them simultaneously.

# Use-Cases of Semaphores

Semaphores are worth learning for three practical reasons. They solve real engineering problems, they unlock common coordination patterns, and they show up frequently in technical interviews.

At a high level, a semaphore is a tool for **controlling how many things can happen at the same time**. That makes it useful in two broad categories: **resource limiting** and **producer-consumer coordination**.

### Resource Pool Management

The most common use of counting semaphores is limiting access to a pool of limited resources. Consider these scenarios:

**Database connections:** Your application can hold at most 20 database connections. If 50 threads each try to open a connection simultaneously, you'll exhaust the pool and crash. A semaphore with 20 permits ensures only 20 threads can hold connections at once. The other 30 wait their turn.

**Thread pool sizing:** When processing tasks in parallel, you often want to limit concurrency to match your CPU cores. A semaphore with 8 permits ensures at most 8 tasks run simultaneously, preventing CPU thrashing from excessive context switching.

**API rate limiting:** External APIs often limit you to N requests per second. A semaphore helps enforce this limit locally before requests even leave your system, preventing expensive API errors.

**File handles:** Operating systems limit how many files a process can open simultaneously. A semaphore protects against hitting this limit when processing many files concurrently.

Without semaphores in these scenarios, you risk resource exhaustion, cascading failures, and degraded performance under load.

### Producer-Consumer Coordination

Semaphores excel at coordinating producers and consumers with a bounded buffer between them. This is one of the classic problems in concurrent programming:

*   Producers create items and add them to a buffer
*   Consumers remove items from the buffer and process them
*   The buffer has a fixed capacity (can't hold unlimited items)
*   Producers must wait when the buffer is full
*   Consumers must wait when the buffer is empty

Two semaphores solve this elegantly: one tracks empty slots (so producers know when they can add), and one tracks filled slots (so consumers know when they can take). We'll implement this pattern in detail later in the chapter.

# How Semaphores Work

Now that you understand what semaphores are for, let's look at how they actually work under the hood.

### The Core Mechanism

When a thread calls `acquire()` or `release()`, the semaphore performs a specific sequence of steps. Understanding this sequence helps you reason about semaphore behavior and avoid mistakes.

#### **The acquire() operation:**

1.  Atomically check if permits > 0
2.  If yes: decrement the permit count and return immediately (the thread now "holds" a permit)
3.  If no: add the calling thread to a wait queue and put it to sleep (the thread blocks)

#### **The release() operation:**

1.  Atomically increment the permit count
2.  Check if any threads are waiting in the queue
3.  If yes: wake one of them up (it will retry acquiring)
4.  If no: simply return (the permit is now available for future acquirers)

Notice that `release()` never blocks. It always completes immediately. Only `acquire()` can block, and only when no permits are available.

### Available Operations

Beyond the basic acquire and release, most semaphore implementations provide additional operations for flexibility:

Operation

What It Does

Blocks?

`acquire()` / `wait()` / `P()`

Acquire one permit, blocking if none available

Yes

`release()` / `signal()` / `V()`

Release one permit, waking a waiter if any

No

`tryAcquire()`

Try to acquire immediately; return true/false

No

`tryAcquire(timeout)`

Try to acquire, waiting up to timeout

Up to timeout

`availablePermits()`

Get current count (may be stale immediately)

No

The `tryAcquire()` variants are useful when you want to fall back to alternative behavior if permits aren't available, rather than blocking indefinitely.

### Sequence Example: Three Threads, Two Permits

Let's trace through a concrete scenario to see how acquire and release interact. We have a semaphore with 2 permits and three threads that want to use it. Follow along with the sequence diagram below:

Walking through this step by step:

1.  **Thread 1 acquires:** The semaphore has 2 permits. Thread 1 calls `acquire()`, the count drops to 1, and Thread 1 proceeds immediately.
2.  **Thread 2 acquires:** Thread 2 calls `acquire()`, the count drops to 0, and Thread 2 proceeds immediately.
3.  **Thread 3 tries to acquire:** Thread 3 calls `acquire()`, but the count is 0. Thread 3 cannot proceed; it gets added to the wait queue and goes to sleep.
4.  **Thread 1 releases:** Thread 1 finishes its work and calls `release()`. The count would increment to 1, but there's a waiter (Thread 3). The semaphore wakes Thread 3, which immediately acquires the permit, bringing the count back to 0. Thread 3 now proceeds with its work.
5.  **Thread 2 releases:** Thread 2 calls `release()`. No waiters exist, so the count simply increments to 1.
6.  **Thread 3 releases:** Thread 3 calls `release()`. The count increments to 2, returning to the initial state.

This sequence demonstrates the key behaviors: immediate acquisition when permits are available, blocking when they're not, and automatic waking of waiters when permits are released.

# Implementing Semaphores

Let's see how to use semaphores in real code. We'll cover basic usage patterns, then build a complete connection pool example.

### Basic Usage

JavaPythonC++C#Go

Java provides `java.util.concurrent.Semaphore` with a clean, well-designed API:

The key pattern here is `acquire()` followed by a `try-finally` block that guarantees `release()`. This pattern prevents permit leaks even when exceptions occur.

# Example: Connection Pool

A database connection pool is the classic semaphore use case. You have a fixed number of expensive connections, and many threads want to use them. The semaphore ensures no more threads use connections than exist in the pool.

The design works like this: we pre-create N connections and store them in a queue. A semaphore with N permits guards access. To get a connection, a thread acquires a permit (blocking if all connections are in use), then takes a connection from the queue. To return a connection, it puts the connection back in the queue and releases the permit.

Notice how connections 0, 1, and 2 are reused. The semaphore ensures only 3 tasks run concurrently, while the other 7 wait their turn.

# Semaphore vs Mutex

This comparison comes up frequently in interviews. While a binary semaphore (permits=1) and a mutex can both limit access to one thread at a time, they have fundamental differences that matter in practice.

A simple mental model:

*   A **mutex** answers: “Who is allowed to touch this shared state right now?”
*   A **semaphore** answers: “How many threads are allowed to proceed right now?” or “Has an event happened yet?”

### Key Differences

Aspect

Mutex

Semaphore

**Ownership**

Yes - only the thread that locked can unlock

No - any thread can signal

**Count**

Always 1 (binary)

Can be any N (counting)

**Primary purpose**

Protecting critical sections

Resource counting and signaling

**Priority inheritance**

Usually supported

Usually not supported

**Release by different thread**

Error or undefined behavior

Perfectly valid

### Why Ownership Matters

The ownership difference has significant practical implications.

**With a mutex**, the thread that locks it must be the one to unlock it. This enables:

*   **Priority inheritance:** If a low-priority thread holds a mutex that a high-priority thread needs, the OS can temporarily boost the low-priority thread's priority to avoid priority inversion. This requires knowing who owns the lock.
*   **Deadlock detection:** The system can track which thread holds which mutexes, enabling detection of circular wait conditions.
*   **Error checking:** The system can detect and report when a thread tries to unlock a mutex it doesn't own.

**With a semaphore**, any thread can call `release()`. This enables:

*   **Signaling between threads:** Thread A does work, then releases a semaphore that Thread B is waiting on. A produces, B consumes.
*   **Asymmetric acquire/release:** The thread that acquires a permit doesn't have to be the one that releases it. This is essential for producer-consumer patterns.

### When to Use Each

#### **Use a mutex when:**

*   Protecting a critical section (data access)
*   You need the lock holder to be the one who unlocks
*   You want priority inheritance
*   One thread should lock and unlock as a pair

#### **Use a semaphore when:**

*   Limiting concurrent access to N resources
*   Signaling between threads
*   Producer-consumer patterns
*   The acquirer and releaser may be different threads

Here's code illustrating both patterns:

In the signaling pattern, notice that Thread A releases without ever acquiring, and Thread B acquires without ever releasing. This would be an error with a mutex, but it's the correct pattern for semaphore-based signaling.

# Performance Considerations

Semaphores are heavily optimized, but they still have a cost, especially under contention. The key idea is similar to mutexes:

*   Uncontended operations are cheap.
*   Contention introduces queueing, blocking, and wakeups, which are expensive.

### Operation Costs

Operation

Typical Latency

What Happens

Uncontended acquire/release

20-100 nanoseconds

Fast atomic operations on the counter

Contended acquire (no wait)

100-500 nanoseconds

Atomic operation fails, retry loop

Contended acquire (must wait)

1-10 microseconds

Thread sleeps, later wakes up (context switch)

Timeout operations

Additional overhead

Timer management adds latency

Semaphores are heavier than raw atomics because they may maintain a wait queue and manage wakeups. But they are often simpler and cheaper than building the same behavior with ad-hoc condition variables.

### Choosing the Right Tool

Scenario

Best Choice

Why

Mutual exclusion

Mutex/Lock

Ownership, priority inheritance, lower overhead

Limit to exactly N

Counting Semaphore

Built for this exact purpose

Atomic counter (no blocking)

AtomicInteger

Much lower overhead when blocking isn't needed

One-time "wait for ready"

CountDownLatch

Simpler semantics for one-shot events

Cyclical barrier

CyclicBarrier

Reusable barrier with simpler API

Precise rate limiting

Token bucket

Better burst handling, smoother rate control

A useful rule: if your intent is “only one thread can enter,” reach for a mutex. If your intent is “only N threads can enter” or “wake someone when ready,” reach for a semaphore.

### Optimization Strategies

#### **1\. Choose the right permit count**

Too few permits causes unnecessary blocking and underutilization. Too many defeats the purpose of limiting. For connection pools, match the count to the actual pool size. For CPU-bound work, match the count to CPU cores.

#### **2\. Consider fairness trade-offs**

Fair semaphores guarantee FIFO ordering but have lower throughput. Non-fair semaphores allow "barging" (newly arriving threads can acquire before waiting threads) which improves throughput but can cause starvation.

Use fair semaphores when wait times are critical (user-facing operations) or starvation is a concern (high contention with many threads). Use non-fair semaphores (the default) when throughput matters more than individual latency.

#### **3\. Use tryAcquire() for fallback paths**

When you have an alternative to blocking, use non-blocking acquisition:

This is useful for graceful degradation: try the fast path, fall back to a slower alternative if resources are unavailable.

# Quiz

## Quiz: Semaphores

1 / 7

Multiple Choice

What is a semaphore?

PreviousNext

Launching soon
