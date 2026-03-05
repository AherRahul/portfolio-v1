---
title: "Reentrant Locks"
description: "Reentrant Locks - Concurrency Interview Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Reentrant Locks

Imagine a recursive function that acquires a lock before processing a tree node, then calls itself to process child nodes. With a non-reentrant lock, the function deadlocks on itself the moment it tries to acquire the lock it already holds. The thread waits for itself to release the lock, which it never will because it's waiting.

This is a fundamental problem: sometimes a thread needs to acquire the same lock multiple times, and the lock must allow it.

A **reentrant lock** (also called a **recursive lock**) solves this by tracking which thread holds the lock and how many times it has been acquired. The same thread can acquire the lock multiple times without blocking, but it must release the lock the same number of times before other threads can acquire it.

This chapter covers how reentrancy works internally, the scenarios where you need it, and the subtle bugs that arise when you confuse reentrant and non-reentrant locks.

# What is Reentrancy?

A lock is **reentrant** (or **recursive**) if a thread that already holds the lock can acquire it again without blocking. Each acquisition increments an internal counter, and each release decrements it. The lock is truly released only when the counter reaches zero.

Real-World Analogy

Think of it like a hotel room with a keycard. Once you're checked in and inside your room, you can leave and re-enter as many times as you want using your card. The hotel system knows you're the legitimate guest, so it doesn't block you.

But someone else trying to enter your room would be denied until you check out. The room only becomes available to others when you've fully exited (checked out), not just when you step out momentarily.

The state diagram below shows how a reentrant lock transitions between states as the owning thread acquires and releases it multiple times:

Let's trace through this diagram. The lock starts in the "Unlocked" state (green). When Thread A acquires it, the lock transitions to "Locked\_1" with count=1. If Thread A acquires again (perhaps through a recursive call or method composition), the lock moves to "Locked\_2" with count=2, and so on.

The critical part is the release sequence. When Thread A calls unlock, it doesn't immediately free the lock. Instead, the count decrements: from 3 to 2, from 2 to 1. Only when Thread A's final unlock brings the count to 0 does the lock return to the "Unlocked" state. Until then, if Thread B tries to acquire (shown in red), it remains blocked, waiting for that count to reach zero.

### Reentrant vs Non-Reentrant

The following table summarizes the key differences between these two types of locks:

Aspect

Reentrant Lock

Non-Reentrant Lock

Same thread re-acquires

Succeeds (count++)

Deadlocks

Internal state

Owner thread + count

Owner thread only

Release requirement

Once per acquire

Once total

Use case

Recursive code, method composition

Simple critical sections

Overhead

Slightly higher

Slightly lower

The overhead difference is typically small (around 25%), but the behavioral difference is significant. A non-reentrant lock has no memory of how many times it was acquired; it simply tracks whether it's held. This means a single unlock releases it, regardless of how many times you tried to acquire it. With a reentrant lock, you must match every acquire with a release.

# Why Reentrancy Matters

Understanding when reentrancy saves you from deadlock is essential for writing correct concurrent code. Let's examine the three main scenarios where reentrancy becomes necessary.

### The Recursive Algorithm Problem

Consider a recursive tree traversal that needs synchronization. Every node must be processed atomically, but the traversal naturally calls itself for child nodes:

The first call to `processTree()` successfully acquires the lock. But when it recurses to process the first child, that recursive call tries to acquire the same lock. With a non-reentrant lock, the thread is now waiting for itself to release the lock. This is a classic self-deadlock.

With a reentrant lock, the recursive call recognizes that the current thread already owns the lock. Instead of blocking, it simply increments the hold count from 1 to 2 and proceeds. Each level of recursion increments the count, and each return decrements it. The lock only becomes available when the outermost call finally unlocks, bringing the count to zero.

### Method Composition

Even without explicit recursion, reentrancy is needed when methods call each other. Consider a bank account class where logging requires reading the balance:

Here's the call chain: `deposit()` acquires the lock, then calls `logTransaction()`, which calls `getBalance()`. Since `getBalance()` is a public method that might be called independently by other threads, it needs its own lock acquisition. But when called from within `deposit()`, the lock is already held.

Without reentrancy, `getBalance()` would block waiting for the lock that `deposit()` holds, and `deposit()` would wait for `logTransaction()` (and thus `getBalance()`) to complete. Neither can proceed. With reentrancy, `getBalance()` sees that the current thread already owns the lock, increments the count, does its work, decrements the count, and returns. The call chain completes successfully.

### Callback Patterns

Reentrancy becomes essential when code holding a lock invokes callbacks that might re-acquire the lock:

When `fireEvent()` notifies listeners, it holds the lock to protect the `listeners` list during iteration. But what if a listener's `onEvent()` handler wants to register another listener? It would call `addListener()`, which tries to acquire the same lock.

This pattern is common in event-driven systems, observer patterns, and plugin architectures. The code firing events has no control over what listeners do in their handlers. Reentrancy ensures that even if a listener calls back into the dispatcher, the system doesn't deadlock.

However, there's an important caveat here. While reentrancy prevents deadlock, modifying the list during iteration can cause `ConcurrentModificationException`. This is a separate issue from locking and requires additional design consideration (like iterating over a copy).

# How Reentrant Locks Work

Let's dive into the internal mechanics. Understanding how reentrant locks work helps you reason about their behavior and implement them if asked in an interview.

### Internal State

A reentrant lock maintains two pieces of information:

*   **Owner:** The thread currently holding the lock (or null/none if unlocked)
*   **Hold count:** The number of times the owner has acquired the lock

The owner field distinguishes reentrant locks from simple binary locks. When a thread tries to acquire, the lock can check "is this the same thread that already holds me?" Only by knowing the owner can it decide whether to block or allow reentrant acquisition.

### Acquisition Logic

The following flowchart shows the decision process when a thread attempts to acquire a reentrant lock:

Let's trace through each path:

1.  **Lock is free (owner is null):** The thread becomes the owner, and the count is set to 1. This is the normal acquisition path.
2.  **Lock is held by the same thread:** This is the reentrant case. The count increments (from 1 to 2, or 2 to 3, etc.), and the thread continues immediately without blocking. The green color indicates success.
3.  **Lock is held by a different thread:** The requesting thread must wait. It blocks until the owner releases the lock (count reaches 0). Then it loops back and tries again, potentially competing with other waiting threads.

The key insight is that checking `owner == current thread` is what makes reentrancy work. Without this check, the lock would just see "lock is held" and block, even though the requesting thread is the owner.

### Release Logic

The release process is equally important. Simply decrementing a count isn't enough; we need to handle errors and wake waiting threads:

Walking through this flowchart:

1.  **First check:** Is the calling thread the owner? If not, this is an error. You cannot unlock a lock you don't hold. Java throws `IllegalMonitorStateException`, Python raises `RuntimeError`.
2.  **Decrement count:** If you are the owner, the hold count decreases by one.
3.  **Check if truly released:** If count is now 0, the lock is fully released. Clear the owner and wake any waiting threads so they can compete for acquisition.
4.  **Still held:** If count is still positive (e.g., went from 2 to 1), the lock remains held. No threads are woken because the lock isn't available yet.

This is why mismatched lock/unlock counts are problematic. If you lock twice but only unlock once, the count goes from 2 to 1, and the lock is never fully released. Other threads wait forever.

### Sequence: Reentrant Acquisition

The following sequence diagram shows a complete example of reentrant acquisition and release, making the timing and state changes explicit:

Notice how each `lock()` call after the first is marked "(reentrant)" and "(no block)". The lock recognizes Thread A as the owner and immediately succeeds. The state notes show the count climbing from 1 to 3, then descending back to 0.

The final state is crucial: only when count reaches 0 does the lock become available. If Thread B had been waiting, it would be woken at this point to compete for acquisition.

# Implementing Reentrant Locks

Now let's see how different programming languages implement and expose reentrant locks. The concepts are the same, but the APIs and default behaviors differ significantly.

### Basic Usage

JavaPythonC++C#Go

Java provides two reentrant locking mechanisms: the `synchronized` keyword and the `ReentrantLock` class. Both are reentrant, but they differ in flexibility.

#### **Using synchronized (implicitly reentrant)**

In this example, `increment()` is synchronized on `this`. When it calls `logCount()`, which is also synchronized on `this`, reentrancy allows the call to proceed. Then `logCount()` calls `getCount()`, another synchronized method. Without reentrancy, this chain of calls would deadlock at the second synchronized method.

The `synchronized` keyword is convenient because lock release is automatic. Even if an exception occurs, the lock is released when the method exits.

#### **Using ReentrantLock (explicitly reentrant)**

`ReentrantLock` requires explicit lock/unlock calls, which means you must use try-finally to ensure the lock is released. The benefit is additional features like tryLock, timed waits, and fairness options that `synchronized` doesn't provide.

**Checking hold count**

The `getHoldCount()` method lets you observe the internal state, which is useful for debugging. This demonstrates how the count climbs with each acquisition and descends with each release.

# Example: Recursive Tree Traversal

To see reentrancy in a realistic context, let's implement a thread-safe tree that supports concurrent access. The `findNode` method demonstrates reentrant acquisition during recursive search:

JavaPythonC++C#Go

The `findNode` method is the interesting case here. It's called from `addChild`, which already holds the lock. Yet `findNode` also acquires the lock at every recursive level. This might seem redundant, but it's intentional: `findNode` could be called independently (perhaps as a public method), and in that case it needs its own locking.

With reentrancy, both scenarios work correctly. When called from `addChild`, each recursive `findNode` call increments the hold count (from 1 to 2, from 2 to 3, etc.), and each return decrements it. When called independently, it starts at count 1.

# Performance Considerations

Reentrant locks have measurable overhead compared to non-reentrant locks. Understanding when this matters helps you make informed choices.

### Overhead Comparison

The additional tracking required by reentrant locks has a cost:

Operation

Non-Reentrant

Reentrant

Overhead

Lock (uncontended)

~20ns

~25ns

~25%

Unlock

~20ns

~25ns

~25%

Reentrant lock

N/A

~5ns

\-

Memory per lock

~32 bytes

~48 bytes

~50%

The overhead comes from:

*   **Storing the owner thread ID:** Non-reentrant locks may not need to track who holds them
*   **Maintaining the hold count:** An additional integer field plus increment/decrement operations
*   **Checking ownership on every operation:** Additional conditional logic

Note that reentrant acquisition itself is fast (~5ns) because it only needs to check ownership and increment a counter, without any blocking or waking operations.

### When to Choose Non-Reentrant

Use non-reentrant locks when:

*   **Reentrancy is never needed:** Simple critical sections with no method calls
*   **Maximum performance is critical:** In extremely hot paths, 25% overhead matters
*   **You want bugs caught early:** Accidental re-acquisition becomes an obvious deadlock or error rather than silently succeeding

### When to Choose Reentrant

Use reentrant locks when:

*   **Methods call other methods that also need the lock:** The most common case
*   **Recursive algorithms need synchronization:** Tree traversals, graph algorithms
*   **Callbacks under a lock might re-acquire it:** Event dispatchers, observer patterns
*   **You're unsure:** Reentrant is the safer default. The overhead is small compared to the debugging cost of unexpected deadlocks

In practice, the 25% overhead on lock operations is rarely significant. Lock operations themselves are fast (nanoseconds), and most programs spend far more time in contention (waiting for locks held by other threads) than in the lock/unlock mechanics. Choose reentrant by default and optimize only if profiling shows lock overhead is significant.

# Quiz

## Quiz: Reentrant Locks

1 / 4

Multiple Choice

What makes a lock 'reentrant'?

PreviousNext

Launching soon
