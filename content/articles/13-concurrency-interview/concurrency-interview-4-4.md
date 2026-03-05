---
title: "java.util.concurrent Package Tour"
description: "java.util.concurrent Package Tour - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# java.util.concurrent Package Tour

Think of `java.util.concurrent` (j.u.c) as a professional toolkit for concurrent programming. Before this package existed in Java 5, developers had to build their own thread pools, concurrent data structures, and synchronization utilities.

Doug Lea and his team designed j.u.c to provide battle-tested, highly-optimized implementations of common concurrency patterns.

# Package Overview and Design Philosophy

The j.u.c package is organized around several key concepts:

**Design Philosophy:**

1.  **Scalability first**: Algorithms chosen for performance under high concurrency
2.  **Non-blocking when possible**: CAS-based operations over locks where feasible
3.  **Composability**: Components work well together
4.  **Safety**: Hard to misuse, fail-fast when misused
5.  **Standard patterns**: Thread pools, producer-consumer, fork-join all built-in

# Concurrent Collections

### ConcurrentHashMap

The most important concurrent collection. It's not just a synchronized HashMap; it's a completely different design optimized for concurrent access.

**Pre-Java 8: Segment-based Locking**

The map was divided into segments (default 16), each with its own lock. Threads accessing different segments never contend.

**Java 8+: Node-based Locking with CAS**

Java 8 redesigned ConcurrentHashMap with finer-grained locking:

Key improvements:

1.  **CAS for empty buckets**: Inserting into an empty bucket uses CAS, no lock needed
2.  **Lock on first node**: When bucket is occupied, lock only that bucket's head node
3.  **Tree bins**: When chains exceed 8 nodes, convert to red-black trees (O(log n) instead of O(n))
4.  **Lock-free reads**: Most reads require no locking due to volatile semantics

**Common Pitfall: Check-then-Act**

### CopyOnWriteArrayList

A thread-safe List that creates a new copy of the underlying array on every mutation. Reads never block.

**When to use:**

*   Read-heavy, write-rare scenarios
*   Event listener lists (add/remove listeners infrequently)
*   Configuration that changes rarely

**When NOT to use:**

*   Frequent modifications (each modification copies entire array)
*   Large collections (copy cost is O(n))

### ConcurrentLinkedQueue

A lock-free, non-blocking FIFO queue based on Michael-Scott algorithm.

The queue uses CAS for both enqueue and dequeue operations. Multiple threads can add and remove concurrently without blocking each other.

# Blocking Queues

ConcurrentLinkedQueue is fast and non-blocking, but it has a limitation: `poll()` returns null when the queue is empty. What if you want consumers to wait for new items instead of busy-polling? This is where blocking queues come in.

Blocking queues add the ability to wait: producers block when the queue is full, consumers block when it is empty. They are the foundation of producer-consumer patterns and provide natural flow control between threads.

### BlockingQueue Operations

Operation

Throws

Returns Special Value

Blocks

Times Out

Insert

add(e)

offer(e) → false

put(e)

offer(e, time, unit)

Remove

remove()

poll() → null

take()

poll(time, unit)

Examine

element()

peek() → null

N/A

N/A

### ArrayBlockingQueue

A bounded queue backed by an array. Fixed capacity at creation.

**Characteristics:**

*   Single lock for both ends (less concurrent than LinkedBlockingQueue)
*   Bounded: prevents memory exhaustion
*   Fair mode available: `new ArrayBlockingQueue<>(100, true)`
*   Array-based: predictable memory footprint

### LinkedBlockingQueue

Optionally bounded queue backed by linked nodes.

**Characteristics:**

*   Two locks: one for put, one for take (higher concurrency than ArrayBlockingQueue)
*   Linked nodes: slightly higher memory overhead per element
*   Unbounded version can cause OutOfMemoryError if producers outpace consumers

### PriorityBlockingQueue

An unbounded priority queue that orders elements by natural order or Comparator.

**Characteristics:**

*   Unbounded: never blocks on put
*   Ordering only guaranteed for take/poll, not iteration
*   Uses binary heap internally

### SynchronousQueue

A queue with zero capacity. Each put must wait for a take, and vice versa. It's a direct handoff.

**Use cases:**

*   Direct handoff in thread pools (Executors.newCachedThreadPool uses this)
*   Rendezvous point between threads
*   When you want tasks executed immediately or rejected

# Executors Framework

We have covered concurrent collections and blocking queues, but there is still a missing piece: who actually runs the code that uses these collections?

Creating and managing threads manually is tedious and error-prone. The Executors framework provides standardized thread pools that handle thread lifecycle, resource management, and task scheduling.

Think of it this way: blocking queues handle the "what" (the tasks), while executors handle the "who" (the threads that process them).

### ThreadPoolExecutor

The core implementation that all standard executors use:

**Task Submission Flow:**

1.  If fewer than corePoolSize threads are running, create a new thread
2.  If core threads are busy, add task to the queue
3.  If queue is full and fewer than maximumPoolSize threads exist, create a new thread
4.  If everything is full, apply the rejection policy

**Core Parameters:**

Parameter

Purpose

Tuning Guidance

corePoolSize

Threads always kept alive

CPU cores for CPU-bound, more for I/O-bound

maximumPoolSize

Maximum threads allowed

Consider memory and context-switch overhead

keepAliveTime

Idle time before non-core threads die

60 seconds is common default

workQueue

Buffer for pending tasks

Bounded prevents memory exhaustion

threadFactory

Creates new threads

Name threads for debugging

rejectedExecutionHandler

What to do when pool is saturated

See handlers below

**Rejection Handlers:**

### Standard Executors

**Why avoid unbounded queues:**

### Executor Lifecycle

# Fork/Join Framework

ThreadPoolExecutor works great for independent tasks, but what about tasks that spawn sub-tasks?

Consider sorting a large array: you could split it in half, sort each half in parallel, then merge. Each half could split further. Standard thread pools are not optimized for this pattern because idle threads sit around while others are overloaded with sub-tasks.

Fork/Join is designed specifically for divide-and-conquer algorithms. It introduces a clever optimization called work-stealing that keeps all threads busy even when task sizes vary.

### Work-Stealing Algorithm

The key innovation is work stealing. Each thread has its own deque (double-ended queue). Threads steal from others when idle.

**Why LIFO for own work, FIFO for stealing?**

*   LIFO for own work: Better cache locality, work on most recently created (smaller) tasks
*   FIFO for stealing: Get larger tasks that will generate more sub-tasks, reducing future stealing

### RecursiveTask and RecursiveAction

**RecursiveAction for void operations:**

### ForkJoinPool.commonPool()

Java 8 introduced a shared pool for all Fork/Join operations:

# Synchronizers

Now that we have covered collections, queues, executors, and Fork/Join, there is one more critical piece of the concurrency puzzle: how do you coordinate threads at specific points in their execution? This is where synchronizers come in.

Synchronizers provide higher-level coordination primitives that go beyond simple locking. Instead of manually managing wait/notify or condition variables, you get purpose-built tools for common coordination patterns. Each synchronizer solves a specific problem, and picking the right one can make your concurrent code dramatically simpler.

### CountDownLatch

**Why this matters:** Imagine you are starting a web application that depends on three services: database connection pool, cache warm-up, and configuration loading. You cannot serve requests until all three are ready. How do you wait for all of them without busy-waiting or complex flag-checking? This is exactly what CountDownLatch solves.

A CountDownLatch is a one-shot barrier that allows one or more threads to wait until a set of operations in other threads completes. You initialize it with a count, threads call `countDown()` to decrement, and waiting threads unblock when the count reaches zero.

The key insight is that CountDownLatch separates "who waits" from "who signals". Any number of threads can wait on the latch, and any threads (not necessarily the same ones) can count down.

The following diagram shows how CountDownLatch coordinates multiple workers with a main thread waiting for completion.

Here is a practical example showing how to wait for multiple services to initialize before accepting requests.

Notice that `countDown()` is in a finally block. This is important because if a service throws an exception, you still want to decrement the count. Otherwise, waiting threads would block forever.

**Starting gun pattern:** You can also use CountDownLatch as a starting gun to release multiple threads simultaneously.

This pattern is useful for benchmarking or testing concurrent behavior because all threads start their work at exactly the same moment.

**Timeout support:** You can also wait with a timeout to avoid blocking forever if something goes wrong.

**Key characteristics:**

*   One-shot: once the count reaches zero, it cannot be reset
*   Count can only go down, never up
*   Any thread can call countDown(), not just waiting threads
*   Multiple threads can await() on the same latch

### CyclicBarrier

While CountDownLatch is great for one-time coordination, what if you need threads to synchronize repeatedly across multiple phases? This is where CyclicBarrier shines.

**Why this matters:** Consider a parallel simulation where you divide a grid among multiple threads. Each thread computes values for its portion, but before moving to the next iteration, all threads must finish the current one because neighboring cells need updated values. You need a synchronization point that threads can hit repeatedly, and that is exactly what CyclicBarrier provides.

A CyclicBarrier waits for a fixed number of parties to arrive, then releases all of them and resets automatically for the next round. Unlike CountDownLatch where any thread can count down, with CyclicBarrier the waiting threads themselves are the parties.

The following diagram shows how three threads synchronize at a barrier before proceeding to the next phase.

Here is a practical example simulating a parallel grid computation where threads must synchronize between iterations.

Notice that the barrier action (the lambda passed to the constructor) runs after all threads arrive but before any are released. This is a convenient place to perform work that must happen between phases, like swapping buffers or aggregating results.

**BrokenBarrierException:** What happens if one thread times out or gets interrupted while others are waiting? The barrier becomes "broken", and all waiting threads receive a BrokenBarrierException. This prevents threads from waiting forever when something goes wrong.

**Manual reset:** You can also reset the barrier manually, which breaks it for any currently waiting threads.

**CountDownLatch vs CyclicBarrier:**

Feature

CountDownLatch

CyclicBarrier

Reusable

No, one-shot

Yes, automatic reset

Waiting threads

Any number can wait

Exactly N parties

Who counts

Any thread can countDown()

Only waiting threads (await)

Barrier action

No

Yes, runs between phases

Reset

Cannot reset

reset() or automatic on trip

Broken state

N/A

BrokenBarrierException

Use case

Wait for events

Coordinate peer threads

**When to use which:**

*   CountDownLatch: One thread (or few) waiting for many events to complete
*   CyclicBarrier: N peer threads that must synchronize at each step

### Semaphore

Both CountDownLatch and CyclicBarrier coordinate timing, but they do not limit concurrency. What if you need to restrict how many threads can access a resource simultaneously? This brings us to Semaphore.

**Why this matters:** Imagine you have an API that allows at most 10 concurrent requests to a downstream service. More than that and the service becomes overloaded. Or consider a database connection pool with 20 connections. You need a way to limit concurrent access to exactly N, blocking additional threads until a slot becomes available. Semaphore is designed precisely for this.

A Semaphore maintains a set of permits. Threads call `acquire()` to get a permit (blocking if none available) and `release()` to return one. Unlike CyclicBarrier where all threads must arrive, with Semaphore threads come and go independently. The limit is on concurrent holders, not on total threads.

The following diagram illustrates how a semaphore with 3 permits controls access to a limited resource.

Here is a practical example showing how to limit concurrent access to an external API.

**Acquiring multiple permits:** Sometimes you need to acquire more than one permit for heavy operations.

**Fair mode:** By default, semaphores do not guarantee FIFO ordering. A thread that requests a permit might get one before threads that were waiting longer. If fairness matters, use the fair mode.

Fair mode has lower throughput because it requires more bookkeeping, but it prevents starvation where some threads wait indefinitely.

**Binary semaphore vs mutex:** A semaphore with one permit acts like a mutex, but there is a subtle difference. With a mutex, only the thread that locked it can unlock it. With a semaphore, any thread can release a permit.

This flexibility can be useful (e.g., producer releases, consumer acquires) but can also lead to bugs if you accidentally release without acquiring.

**Use cases:**

*   **Connection pooling:** Limit concurrent database connections
*   **Rate limiting:** Cap requests to external APIs
*   **Resource limiting:** Limit concurrent file operations, memory usage
*   **Bounded parallelism:** Control how many tasks run simultaneously

### Phaser

CyclicBarrier works well when you know exactly how many threads will participate. But what if threads need to join or leave dynamically? What if you need to track which phase you are on? What if you want to terminate after a certain phase? This is where Phaser comes in.

**Why this matters:** Consider a multi-stage document processing pipeline where:

*   New documents may arrive and spawn new worker threads
*   Some workers may complete early and leave
*   You need to track progress through processing stages
*   After the final stage, everything should shut down cleanly

CyclicBarrier cannot handle this because the party count is fixed. Phaser provides the flexibility to handle all these scenarios.

**Understanding Phaser concepts:**

A Phaser is like a CyclicBarrier with superpowers:

*   **Dynamic registration:** Parties can register() to join and arriveAndDeregister() to leave at any time
*   **Phase tracking:** Each barrier trip advances the phase number (0, 1, 2, ...)
*   **Termination:** The phaser can terminate after a condition is met
*   **Tiering:** Multiple phasers can be organized in a tree for scalability

The following diagram shows the lifecycle of a Phaser with dynamic party registration.

Here is a practical example showing a multi-stage task processor where workers can join and leave dynamically.

This example demonstrates several Phaser features: dynamic registration with `register()`, early departure with `arriveAndDeregister()`, phase tracking with `getPhase()`, and termination control via `onAdvance()`.

**Key Phaser methods explained:**

Method

Description

`register()`

Add a new party (thread joins)

`arrive()`

Arrive at barrier but do not wait (for hand-off patterns)

`arriveAndAwaitAdvance()`

Arrive and wait for others (like CyclicBarrier.await())

`arriveAndDeregister()`

Arrive, do not wait, and leave the phaser

`awaitAdvance(phase)`

Wait for phase to advance (for observers)

`getPhase()`

Current phase number (negative if terminated)

`isTerminated()`

Check if phaser is terminated

`onAdvance(phase, parties)`

Override to control termination

**arrive() vs arriveAndAwaitAdvance():** The `arrive()` method signals arrival but does not wait. This is useful when a thread has finished its contribution but does not need to wait for others before proceeding to other work.

**Tiered phasers for scalability:** When you have many parties (hundreds or thousands), a single phaser becomes a bottleneck. Phaser supports tiering where child phasers synchronize with a parent.

**Phaser vs CyclicBarrier comparison:**

Feature

CyclicBarrier

Phaser

Party count

Fixed at creation

Dynamic (register/deregister)

Phase tracking

No (manual counting)

Yes (getPhase())

Early termination

No built-in support

Override onAdvance()

Non-waiting arrival

No

Yes (arrive())

Tiering

No

Yes (parent-child phasers)

Complexity

Simpler

More complex

Use case

Fixed peer threads

Dynamic workflows

**When to use Phaser:**

*   Number of participating threads is not known in advance
*   Threads may join or leave during execution
*   You need to track or control phase progression
*   You need termination after certain conditions
*   Very large number of parties (use tiering)

### Exchanger

The synchronizers we have covered so far coordinate multiple threads. But sometimes you have exactly two threads that need to swap data with each other. This is where Exchanger provides an elegant solution.

**Why this matters:** Consider a producer-consumer scenario with a twist: instead of a queue between them, you want them to swap buffers directly. The producer fills a buffer, the consumer processes a buffer, and then they exchange. This avoids the overhead of queue operations and provides natural flow control because both must rendezvous to swap.

An Exchanger is a rendezvous point where exactly two threads meet and exchange objects. When one thread calls `exchange()`, it blocks until another thread calls `exchange()`, then they swap their objects and both return.

The following diagram illustrates how two threads exchange buffers at a rendezvous point.

Here is a practical example showing a double-buffering pattern for efficient data processing.

Notice how both threads call `exchange()` with their current buffer. The first to call blocks until the second arrives. Then they swap and both continue. This creates a natural synchronization rhythm.

**Timeout support:** You can specify a timeout to avoid waiting forever if the other thread fails to arrive.

**Use cases:**

*   **Double buffering:** One thread fills while another processes
*   **Genetic algorithms:** Threads exchange populations for crossover
*   **Pipeline stages:** Pass data between exactly two processing stages
*   **Checkpointing:** Two threads exchange state snapshots

**Limitations:**

*   Works with exactly two threads. Using more threads leads to unpredictable pairing.
*   If one thread fails or is slow, the other blocks indefinitely (use timeout).
*   Not suitable when you need a queue or when thread counts vary.

**When to use Exchanger vs BlockingQueue:**

*   Use Exchanger when you have exactly two threads that need to swap objects
*   Use BlockingQueue when you have multiple producers/consumers or need decoupled timing

# Common Combination Patterns

Now that we have covered individual concurrent utilities, let us look at how they work together. Real-world concurrent systems often combine multiple utilities to achieve their goals. Understanding these patterns helps you design better concurrent applications.

### ThreadPoolExecutor + BlockingQueue + Semaphore

This pattern combines rate limiting with task execution. The semaphore limits concurrent external calls while the executor manages thread resources.

This combination lets you have many threads (for CPU work) while limiting how many call an external API simultaneously.

### CountDownLatch + ConcurrentHashMap (Memoizing Cache)

This pattern ensures expensive computations happen only once, even under concurrent requests.

The first thread to request a key creates a FutureTask and runs it. Concurrent requests for the same key get the same Future and wait for the result.

### CyclicBarrier + ConcurrentHashMap (Phased Processing)

This pattern coordinates multiple workers that process data in phases, aggregating results between phases.

Workers compute independently, store results in the concurrent map, then synchronize at the barrier where results are aggregated.

### Dangerous Combinations to Avoid

**Warning: Queues + Barriers can cause deadlock.** When threads waiting at a barrier also wait on a blocking queue, you can create a deadlock where no thread can proceed.

The problem: If Thread 1 processes a task and waits at the barrier, but Thread 2 and Thread 3 are blocked on `queue.take()` because there are no tasks, the barrier never trips. Thread 1 waits forever.

#### **Safe alternatives**

**Poll with timeout instead of blocking take:**

**Separate work fetching from barrier synchronization:**

**Use Phaser with dynamic registration instead:**

**Other dangerous patterns:**

*   **Nested synchronizers:** Acquiring multiple barriers/latches in different orders can deadlock
*   **Executor tasks waiting on each other:** Task A submits Task B and waits for its result, but no threads available
*   **Semaphore in try block without finally:** Forgetting to release permits in all code paths

### Pattern Selection Guide

Scenario

Recommended Combination

Rate-limited API calls from thread pool

ThreadPoolExecutor + Semaphore

Cache with guaranteed single computation

ConcurrentHashMap + FutureTask

Phased batch processing

CyclicBarrier + ConcurrentHashMap

Service initialization

CountDownLatch + ExecutorService

Producer-consumer with flow control

BlockingQueue + ThreadPoolExecutor

Dynamic parallel pipeline

Phaser + ConcurrentLinkedQueue

Double buffering

Exchanger (standalone)

Launching soon
