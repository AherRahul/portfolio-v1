---
title: "Coarse-grained vs Fine-grained Locking"
description: "Coarse-grained vs Fine-grained Locking - Concurrency Interview Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Coarse-grained vs Fine-grained Locking

Imagine a hash table serving thousands of concurrent requests. You protect it with a single lock, and suddenly your 16-core server behaves like a single-core machine. Every thread trying to read or write must wait in line, even though they're accessing completely different keys.

This bottleneck has a name: **lock contention**. And the solution lies in understanding lock granularity.

Lock granularity is the spectrum between protecting everything with one lock (coarse-grained) and protecting each tiny piece with its own lock (fine-grained). Get it wrong in either direction and you pay a price: too coarse and you serialize operations that could run in parallel; too fine and you drown in lock overhead and risk complex bugs.

This chapter covers how to think about lock granularity, when to use each approach, and how production systems strike the right balance.

# What is Lock Granularity?

Lock granularity refers to the size of the data or code region protected by a single lock.

Real-World Analogy

Think of it like security checkpoints at different scales. A single checkpoint at a building entrance (coarse-grained) is simple but creates a bottleneck when many people arrive at once.

Separate checkpoints for each floor (medium granularity) allow more parallel flow. Individual office door locks (fine-grained) maximize parallelism but require more infrastructure and coordination.

The diagram below illustrates this spectrum, showing how the same hash table can be protected at different granularities:

At the coarse end, one lock guards the entire structure. In the middle, you divide the table into segments (called "stripes"), each with its own lock. At the fine end, every individual bucket has its own lock.

Loading simulation...

Granularity

Description

Example

**Coarse-grained**

One lock protects entire data structure

Single lock for whole hash table

**Medium**

Locks protect logical components

Lock per segment (striping)

**Fine-grained**

Locks protect individual elements

Lock per bucket or per node

The key insight is that finer granularity allows more parallelism but introduces more complexity and overhead. Coarser granularity is simpler but creates bottlenecks under contention. There's no universally "correct" choice; the right granularity depends on your workload, contention levels, and complexity tolerance.

### The Contention Problem

When multiple threads compete for the same lock, they serialize. Even on a 64-core machine, if all threads need the same lock, only one makes progress at a time. The following sequence diagram shows this serialization in action:

Let's walk through what's happening here. Thread 1 acquires the lock first and performs its operation on `key1`. Meanwhile, Threads 2 and 3 both arrive and request the lock. They have to wait, even though Thread 2 wants to access `key2` and Thread 3 wants `key3`, keys that are completely unrelated to what Thread 1 is doing.

This is the core problem with coarse-grained locking: operations on completely independent data become serialized. If each operation takes 1ms, three operations on different keys take 3ms total instead of potentially completing in parallel in just 1ms.

### The Scalability Impact

The impact becomes dramatic as concurrency increases. Consider a cache accessed by 100 threads:

Lock Granularity

Max Throughput

Why

Single lock

1x

All threads serialize

16 stripes

~16x

16 parallel groups

Per-bucket

~100x

Nearly full parallelism

With a single lock, adding more threads doesn't increase throughput; it just increases queue length. With 16 stripes, up to 16 threads can make progress simultaneously if they happen to access different stripes. With per-bucket locking, you approach the theoretical maximum where nearly every thread can work independently.

For read-heavy workloads, the difference is even more pronounced. Coarse locking can reduce throughput by 10-100x compared to fine-grained approaches, turning a capable multi-core server into an expensive single-threaded machine.

# How Lock Granularity Works

Now that we understand why granularity matters, let's examine how each approach works in practice.

## Coarse-Grained Locking

With coarse-grained locking, one lock protects the entire data structure. Every operation, regardless of which part of the data it touches, must acquire the same lock.

In this diagram, the red "Global Lock" sits above the entire table. All three threads (shown in orange) must go through this single lock to access any of the four buckets (shown in cyan). Even if Thread 1 wants Bucket 0 and Thread 2 wants Bucket 3, they still contend for the same lock.

#### **Characteristics:**

*   **Simple to implement and reason about:** One lock, one critical section, no complex coordination
*   **No risk of deadlock:** With only one lock, there's no possibility of circular wait
*   **Poor scalability under contention:** High contention leads to threads spending more time waiting than working
*   **Good for low-contention scenarios:** When threads rarely access the structure simultaneously, the simplicity wins

## Fine-Grained Locking

With fine-grained locking, multiple locks protect different parts of the data structure. Operations on different parts can proceed in parallel without waiting for each other.

Notice the difference from the coarse-grained diagram. Now each bucket has its own lock (shown in green). Thread 1 accesses Bucket 0 through Lock 0, Thread 2 accesses Bucket 2 through Lock 2, and Thread 3 accesses Bucket 3 through Lock 3. All three operations can proceed simultaneously because they're acquiring different locks.

#### **Characteristics:**

*   **Higher parallelism:** Independent operations truly run in parallel
*   **More complex implementation:** More locks to manage, more code to write
*   **Risk of deadlock if acquiring multiple locks:** If an operation needs two buckets, lock ordering becomes critical
*   **Memory overhead from multiple locks:** Each lock consumes memory for its internal state

## Lock Striping: The Practical Middle Ground

Pure per-element locking can be overkill. If your hash table has a million buckets, you'd need a million locks. Lock striping offers a practical compromise: divide the data structure into a fixed number of stripes, each with its own lock.

This is how Java's `ConcurrentHashMap` (pre-Java 8) achieved its scalability.

This diagram shows how 16 buckets are distributed across 4 stripes. Each stripe contains 4 buckets protected by a single lock. Buckets 0, 4, 8, and 12 share Lock 0. Buckets 1, 5, 9, and 13 share Lock 1. And so on.

The key formula that makes this work is:

When you want to access a key, you hash it and use modulo to determine which stripe (and thus which lock) you need. Keys with different stripe indices can be accessed in parallel. The probability of two random keys colliding on the same stripe is only 1/num\_stripes.

This approach gives you the best of both worlds: bounded memory overhead (only N locks regardless of how many elements), bounded complexity (N is typically small, like 16 or 32), yet significantly improved parallelism compared to a single lock.

# Lock Granularity in Practice

Let's see how these approaches translate into actual code. We'll examine three implementations: a simple coarse-grained list, a striped hash map, and a fine-grained linked list with per-node locking.

### Coarse-Grained: Thread-Safe List

The simplest approach wraps every operation in the same lock. This implementation demonstrates the pattern and highlights both its simplicity and its limitations.

JavaPythonC++C#Go

Every method follows the same pattern: acquire the lock, perform the operation, release the lock. The `synchronized (lock)` block ensures that only one thread can execute any of these methods at a time. Notice that even `size()` and `contains()`, which don't modify the list, still acquire the exclusive lock. This is necessary to ensure a consistent view of the data, but it means read operations block other readers.

This coarse-grained approach is appropriate when contention is low, operations are fast, or simplicity is paramount. However, under high contention, this becomes a bottleneck.

### Fine-Grained: Striped Hash Map

Now let's implement a hash map with lock striping. This is the pattern used by `ConcurrentHashMap` and demonstrates how to achieve much better concurrency while keeping complexity manageable.

JavaPythonC++C#Go

Let's break down the key design decisions in this code:

The `stripeFor()` method determines which stripe a key belongs to by hashing the key and taking modulo `NUM_STRIPES`. This ensures consistent stripe assignment: the same key always maps to the same stripe.

For `get()`, `put()`, and `remove()`, we only lock the specific stripe that contains our key. If two threads access keys in different stripes, they don't block each other at all. This is where the parallelism comes from.

The `size()` method is more complex. To get an accurate count, we need a consistent view of all stripes. We acquire all 16 locks in a fixed order (0 to 15), count all elements, then release locks in reverse order. The fixed acquisition order prevents deadlock, and holding all locks ensures the count is consistent.

### Per-Node Locking: Linked List

For linked data structures, we can go even finer: lock individual nodes. This technique, called "hand-over-hand" or "lock coupling," allows concurrent traversal and modification of different parts of the list.

The key insight is that when traversing a linked list, we only need to protect the link we're about to follow. By holding the lock on a predecessor node while acquiring the lock on the current node, we ensure that no other thread can modify the link between them.

JavaPythonC++C#Go

Let's trace through how `remove()` works, since it's the most complex operation:

1.  We start by locking the sentinel `head` node. This is our "predecessor" (`pred`).
2.  We look at `pred.next` to find the first real node (`curr`).
3.  We lock `curr` before examining it. Now we hold locks on both `pred` and `curr`.
4.  If `curr` contains our target value, we unlink it by setting `pred.next = curr.next`. This is safe because we hold both locks.
5.  If `curr` isn't our target, we release `pred`'s lock (we no longer need it), shift our positions forward (`pred = curr`, `curr = curr.next`), and repeat.

The sentinel node simplifies the code significantly. Without it, we'd need special cases for removing the first element. The sentinel ensures there's always a valid predecessor for any node.

# Trade-offs Comparison

Now that we've seen all three approaches in code, let's compare them systematically. The following table summarizes the trade-offs:

Aspect

Coarse-Grained

Fine-Grained (Striped)

Fine-Grained (Per-Element)

**Concurrency**

Low (1 thread)

Medium (N stripes)

High (per element)

**Complexity**

Simple

Moderate

High

**Deadlock risk**

None

Low (if ordered)

Higher

**Memory overhead**

1 lock

N locks

Many locks

**Lock acquisition cost**

1 acquire

1 acquire

Multiple acquires

**Global operations**

Fast

Slow (all locks)

Very slow

**Best for**

Low contention

High contention, simple ops

Highly concurrent traversal

The "global operations" row is particularly important. With coarse-grained locking, operations like `size()` are trivial since you hold the only lock. With striping, you need to acquire all N stripe locks. With per-element locking, you'd need to traverse and lock every element, which is prohibitively expensive.

This is why many real-world concurrent data structures offer "weakly consistent" iterators and approximate sizes rather than exact ones. The cost of strong consistency for global operations often outweighs the benefits.

# When to Use Each Approach

Choosing the right granularity isn't a matter of "finer is better." The decision depends on your specific context. The following flowchart walks through the key questions:

Let's walk through this decision tree:

1.  **Is contention high?** If threads rarely access the data structure simultaneously, coarse-grained locking is the right choice. The simplicity wins when you're not paying the serialization penalty.
2.  **Do you need global operations often?** If you frequently call `size()`, iterate over all elements, or need consistent snapshots, fine-grained locking becomes expensive. Consider alternative designs like copy-on-write (make a copy for reads) or immutable snapshots.
3.  **Is the number of elements bounded?** For hash-based structures with a fixed number of buckets, lock striping is ideal. You get most of the parallelism benefits with bounded complexity.
4.  **Is traversal the main operation?** For linked structures where threads frequently traverse and modify different parts, per-node locking pays off. Hand-over-hand locking allows different threads to work on different sections simultaneously.

### Decision Guide

**Use coarse-grained when:**

*   Low contention (few threads, infrequent access)
*   Operations are fast (critical section is brief)
*   Simplicity is paramount (prototype, low-risk code)
*   Global operations are common (frequent `size()` calls)

**Use lock striping when:**

*   High contention on hash-based structures
*   Operations are mostly independent (different keys)
*   You want bounded lock count (predictable memory)
*   Production systems (proven, well-understood pattern)

**Use per-element locking when:**

*   Need maximum concurrency
*   Traversal-based operations dominate
*   Can afford complexity and thorough testing
*   Memory overhead is acceptable

# Performance Considerations

Understanding performance characteristics helps you make informed decisions about granularity.

### Contention Profiles

The relationship between contention and granularity benefit isn't linear.

At low contention, all approaches perform similarly because threads rarely wait. At medium contention, the differences emerge but aren't dramatic. At high contention, coarse-grained locking becomes a severe bottleneck (shown in red) while striped and fine-grained approaches maintain reasonable throughput.

### Benchmark Considerations

When choosing lock granularity, measure:

1.  **Throughput:** Operations per second under realistic load
2.  **Latency:** P50, P99, P99.9 response times (tail latency often matters more than average)
3.  **Scalability:** How throughput changes as you add threads
4.  **Memory:** Lock overhead per element

**Example benchmark results (hash map, 80% reads, 20% writes):**

Threads

Coarse (ops/s)

16-Stripe (ops/s)

Speedup

1

1,000,000

900,000

0.9x

4

400,000

2,500,000

6.3x

8

200,000

4,000,000

20x

16

100,000

5,500,000

55x

Notice the pattern: with 1 thread, coarse is actually faster because there's no contention and no striping overhead. But as thread count increases, coarse-grained throughput drops (more waiting) while striped throughput increases (more parallelism). The crossover point where striping wins depends on your workload.

# Quiz

## Quiz: Coarse-Grained vs Fine-Grained Locking

1 / 6

Multiple Choice

What does lock granularity refer to?

PreviousNext

Launching soon
