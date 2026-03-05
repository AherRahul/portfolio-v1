---
title: "Deadlock"
description: "Deadlock - Concurrency Interview Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Deadlock

Deadlock is one of the most dangerous concurrency bugs because it's silent. There's no exception, no error message, no crash. The system just stops making progress.

In this chapter, we will build a clear mental model of what deadlock is, why it happens, how to detect it, and most importantly, how to prevent it.

# What is Deadlock?

Real-World Analogy

Imagine a narrow one-lane bridge where cars can enter from both ends, but there’s no space to pass or reverse once you’re on it.

*   Car A enters from the left and reaches the middle.
*   Car B enters from the right and also reaches the middle.
*   Now they face each other.

Neither car can move forward because the other blocks the path. Neither can reverse because cars behind them have already entered and are blocking the exit. Everyone is stuck, and the bridge is effectively unusable until someone manually intervenes.

That’s a deadlock: each “car” holds a position it won’t give up, while waiting for the other to move, creating a cycle where no progress is possible.

Deadlock in multi-threading is a situation where two or more threads are blocked forever, each waiting for a resource held by another thread in the cycle.

In this diagram, Thread 1 holds Lock A and wants Lock B. Thread 2 holds Lock B and wants Lock A. Neither can proceed. This circular wait is the essence of deadlock.

The formal definition

A deadlock is a state where a set of threads is blocked because each thread is holding a resource and waiting for a resource held by another thread in the set.

Key characteristics of deadlock:

*   **Permanent:** Unlike a temporary block, deadlock never resolves on its own
*   **Silent:** No exceptions are thrown; threads just stop making progress
*   **Mutual:** All threads in the deadlock are both victims and perpetrators
*   **Cyclic:** There's always a cycle in the wait-for graph

# Coffman's Four Conditions

In 1971, Edward Coffman identified four conditions that must ALL hold simultaneously for deadlock to occur. Understanding these conditions is crucial because breaking any one of them prevents deadlock.

### 1\. Mutual Exclusion

At least one resource must be held in a non-shareable mode. Only one thread can use the resource at a time. If another thread requests it, the requesting thread must wait.

**Example:** A mutex, by definition, can only be held by one thread. A database row lock in exclusive mode. A file opened for exclusive write access.

**How to break it:** Use shareable resources where possible. Read-write locks allow multiple readers. Immutable data needs no locking.

### 2\. Hold and Wait

A thread must be holding at least one resource while waiting to acquire additional resources held by other threads.

**Example:** Thread holds Lock A and then tries to acquire Lock B (which is held by another thread).

**How to break it:** Acquire all resources atomically before proceeding. If you can't get all locks, release everything and retry. This is the "all-or-nothing" approach.

### 3\. No Preemption

Resources cannot be forcibly taken away from threads. A thread holding a resource keeps it until it voluntarily releases it.

**Example:** Once a thread acquires a mutex, no other thread or the OS can force it to release the mutex.

**How to break it:** Use try-lock with timeout. If you can't acquire a lock within a deadline, back off and release the locks you already hold.

### 4\. Circular Wait

A cycle exists in the wait-for graph. Thread 1 waits for Thread 2, which waits for Thread 3, which waits for Thread 1.

**Example:** Thread A holds Lock 1 and wants Lock 2. Thread B holds Lock 2 and wants Lock 1.

**How to break it:** Impose a total ordering on all locks. Always acquire locks in a consistent order. If every thread acquires locks in the same order, cycles cannot form.

Condition

Meaning

How to Break It

Mutual Exclusion

Resource held exclusively by one thread

Use shareable resources, read-write locks

Hold and Wait

Hold one resource while waiting for another

Acquire all locks atomically or release all before retrying

No Preemption

Resources can't be forcibly taken

Use try-lock with timeout, back off on failure

Circular Wait

Cycle exists in wait-for graph

Impose total lock ordering, always acquire in same order

# Why Deadlock Happens

Deadlock doesn't happen in simple programs with one lock. It emerges from the interaction of multiple locks, often spread across different parts of a codebase.

### Common Causes

#### **1\. Inconsistent Lock Ordering**

The most common cause. Different code paths acquire locks in different orders.

If Thread 1 runs path A and Thread 2 runs path B simultaneously, deadlock can occur.

#### **2\. Nested Locks Across Modules**

Module A calls Module B while holding a lock. Module B tries to acquire a lock that's held by someone waiting for Module A.

This is particularly insidious because the developers of Module A and Module B might not even know about each other's locks.

#### **3\. Lock in Callback**

You hold a lock and call a user-provided callback. The callback tries to acquire a lock that creates a cycle.

#### **4\. Database Transactions**

Database deadlocks are common. Transaction A updates rows 1, 2. Transaction B updates rows 2, 1. Classic deadlock.

Why Deadlocks are Hard to Detect During Development

Deadlocks are timing-dependent. They only occur when threads interleave in a specific way. During development:

*   You often test with a single thread
*   Even with multiple threads, the "bad" interleaving might never happen
*   Adding debug logging changes timing and can make deadlocks disappear
*   Deadlocks often appear first in production under load

# How to Detect Deadlock

### Thread Dumps

The most common detection method. A thread dump shows what each thread is doing and what locks it holds or waits for.

JavaPythonC++C#Go

**Deadlock in thread dump:**

The JVM actually detects the deadlock and tells you exactly which threads are involved and where.

### Resource Allocation Graphs

A resource allocation graph visualizes which threads hold and wait for which resources. A cycle in the graph means deadlock.

Solid arrows indicate "holds." Dashed arrows indicate "wants." A cycle through both types of arrows indicates deadlock.

### Programmatic Detection

JavaC#Go

You can run this periodically in a monitoring thread to detect deadlocks before they're reported by users.

# How to Prevent Deadlock

### Strategy 1: Lock Ordering (Most Common)

Assign a global order to all locks. Always acquire locks in ascending order. This breaks the circular wait condition.

The key insight: no matter which two accounts are involved, locks are always acquired in the same order (lower ID first). This makes cycles impossible.

### Strategy 2: Try-Lock with Timeout

Instead of blocking forever, try to acquire locks with a timeout. If you can't acquire all locks, release everything and retry (possibly with backoff).

This approach breaks the "no preemption" condition. If we can't get all locks, we release what we have.

### Strategy 3: All-or-Nothing Acquisition

Acquire all required locks at once, or none at all. This breaks the "hold and wait" condition.

# Deadlock in Practice

Let's see a complete example of deadlock and its fix.

### The Bug: Classic Two-Lock Deadlock

### The Fix: Consistent Lock Ordering

# Quiz

## Quiz: Deadlock

1 / 7

Multiple Choice

What is deadlock?

PreviousNext

Launching soon
