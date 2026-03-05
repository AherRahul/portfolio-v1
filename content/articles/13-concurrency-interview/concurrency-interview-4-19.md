---
title: "Lock, Monitor, and Synchronization"
description: "Lock, Monitor, and Synchronization - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Lock, Monitor, and Synchronization

C# provides a rich toolkit for thread synchronization, from the simple `lock` statement to sophisticated primitives like `SemaphoreSlim` and `SpinLock`. Each has its place. Using `Mutex` for in-process synchronization wastes resources. Using `lock` when you need cross-process coordination fails silently.

# Why Synchronization Matters

The memory model chapter explained how writes become visible across threads. But visibility is only half the problem. Even if every write is instantly visible, you still face race conditions when multiple threads try to modify shared state.

Think about what happens when two threads both try to update a counter. Each reads the current value, adds one, and writes it back. If they interleave, both might read the same value, both add one, and both write, resulting in one lost update. The counter goes from 10 to 11 instead of 12. This is a race condition, and it happens regardless of memory visibility.

The check-then-act pattern above is broken. Between checking the balance and deducting, another thread can interleave. Synchronization primitives ensure that critical sections, regions of code that access shared state, execute atomically from the perspective of other threads.

# The lock Statement

The `lock` statement is C#'s simplest synchronization mechanism. It ensures that only one thread can execute a block of code at a time for a given lock object.

### Basic Syntax

The `lock` statement takes an object as a parameter. Any thread that wants to enter the locked region must acquire the lock on that object. If another thread holds it, the requesting thread blocks until the lock is released.

### What lock Really Does

The `lock` statement is syntactic sugar. The compiler transforms it into a `Monitor.Enter` / `Monitor.Exit` pattern with proper exception handling:

The `lockTaken` parameter, introduced in .NET 4, handles a subtle edge case. If a `ThreadAbortException` occurs between `Monitor.Enter` starting and completing, the lock might be acquired but `lockTaken` never set to `true`. The overload with `ref lockTaken` ensures the lock is only released if it was actually acquired.

**Interview Insight:** Interviewers love asking what `lock` compiles to. Knowing it's `Monitor.Enter`/`Monitor.Exit` with try-finally shows you understand the mechanics, not just the syntax.

### lock and Memory Visibility

Beyond mutual exclusion, `lock` also provides memory visibility guarantees. `Monitor.Enter` acts as an acquire barrier, and `Monitor.Exit` acts as a release barrier. This means:

1.  All reads inside the lock see the most recent values written by any previous lock holder
2.  All writes inside the lock become visible to subsequent lock holders

Without this guarantee, each thread might see stale cached values. The lock's memory barriers ensure that protected data is always consistent. This is why you don't need `volatile` on fields that are only accessed under a lock.

### Lock Object Best Practices

The object you lock on matters. Here are the rules:

**DO: Use a dedicated private readonly object**

**DON'T: Lock on \`this\`**

**DON'T: Lock on Type objects**

**DON'T: Lock on strings**

**DON'T: Lock on value types**

The reason for a dedicated object is isolation. If you lock on `this`, any external code holding a reference to your object can also acquire your lock, potentially causing deadlocks or unexpected serialization.

One thing worth noting: `lock` is reentrant, meaning the same thread can acquire the same lock multiple times without deadlocking. The runtime keeps a count and only releases the lock when the count returns to zero. This is convenient for recursive methods but can mask bugs where you accidentally hold a lock longer than intended.

# Monitor Class

The `lock` statement handles the common case well, but what if you need more control? What if you want to try to acquire a lock without blocking indefinitely? Or coordinate threads with a "wait until something changes" pattern?

This is where `Monitor` comes in. It's the class that `lock` is built on, and it exposes additional features for sophisticated synchronization patterns.

### Core Methods

Method

Description

`Enter(object)`

Acquires the lock, blocking if necessary

`Exit(object)`

Releases the lock

`TryEnter(object)`

Attempts to acquire without blocking (returns bool)

`TryEnter(object, timeout)`

Attempts to acquire with timeout

`Wait(object)`

Releases lock and blocks until pulsed

`Pulse(object)`

Wakes one waiting thread

`PulseAll(object)`

Wakes all waiting threads

### TryEnter: Non-Blocking Acquisition

Sometimes you don't want to block indefinitely. `TryEnter` lets you attempt acquisition with an immediate return or a timeout:

This pattern is essential for avoiding deadlocks and implementing responsive systems that don't hang indefinitely.

### Wait and Pulse: Thread Coordination

`Wait`, `Pulse`, and `PulseAll` enable threads to coordinate beyond simple mutual exclusion. They implement the monitor pattern from concurrent programming theory.

When a thread calls `Monitor.Wait`:

1.  It releases the lock (so other threads can enter)
2.  It enters the waiting queue
3.  It blocks until another thread calls `Pulse` or `PulseAll`
4.  When pulsed, it moves to the ready queue to re-acquire the lock
5.  Once it re-acquires the lock, `Wait` returns

### Producer-Consumer with Monitor

Here's a bounded buffer implementation using `Wait` and `Pulse`:

**Why \`while\` instead of \`if\`?** This is critical and catches many developers off guard. There are two reasons to use a loop:

1.  **Spurious wakeups**: On some platforms, a thread can wake up from `Wait` even without a `Pulse`. This is rare but allowed by the runtime. Without a loop, you'd proceed with an empty queue and crash.
2.  **Lost wakeups**: Even with a legitimate `Pulse`, the condition might no longer hold by the time you re-acquire the lock. Imagine: Consumer 1 is waiting, Producer pulses, Consumer 2 (which wasn't waiting) grabs the lock first and takes the item. Consumer 1 wakes up, gets the lock, but the queue is empty again.

Always use `while`, never `if`. This pattern is so common it has a name: the "guarded suspension" pattern.

**Why \`PulseAll\` instead of \`Pulse\`?** `Pulse` wakes only one thread, and you can't control which one. If you have multiple producers and consumers sharing the same lock, a producer's `Pulse` might wake another producer instead of a consumer. That producer checks its condition (is the buffer full?), finds it's still full, and goes back to sleep. Your intended consumer never wakes up.

`PulseAll` wakes everyone, letting them all re-check their conditions. It's less efficient (more threads wake up and compete for the lock) but safer. Some developers use separate lock objects for producers and consumers to avoid this, but that adds complexity.

# ReaderWriterLockSlim

So far we've looked at mutual exclusion: only one thread at a time. But consider a cache or configuration store where reads happen constantly but writes are rare. Using `lock` means every read blocks every other read, even though reads don't conflict with each other. That's unnecessarily restrictive.

`ReaderWriterLockSlim` solves this by distinguishing between readers and writers. Multiple readers can hold the lock simultaneously, but a writer needs exclusive access. This can dramatically improve throughput for read-heavy workloads.

### When to Use

*   Read-heavy workloads (caches, configuration, lookup tables)
*   Multiple readers, few writers
*   Reads don't need to block each other

### Basic Usage

### Lock Modes

Mode

Allows Concurrent

Blocks

Read

Other reads, upgradeable reads

Writes

Upgradeable Read

Reads only

Other upgradeable, writes

Write

Nothing

Everything

The **upgradeable read lock** deserves special attention because it solves a subtle but common problem. Consider a cache: you want to check if a key exists (read), and if not, compute and store a value (write). The naive approach is:

1.  Acquire read lock, check if key exists
2.  Release read lock
3.  Acquire write lock, check again, compute, store

The problem? Between steps 2 and 3, another thread might have added the same key. You need to check again after acquiring the write lock (double-check locking pattern).

The upgradeable read lock lets you:

1.  Acquire upgradeable read lock, check if key exists
2.  If not found, upgrade to write lock (atomically, without releasing)
3.  Double-check (another upgradeable reader might have upgraded first)
4.  Compute and store

Only one thread can hold an upgradeable read lock, which prevents two threads from both deciding to upgrade simultaneously (which would deadlock, since both would be waiting for the other to release their read lock).

### Why ReaderWriterLockSlim, Not ReaderWriterLock?

The older `ReaderWriterLock` class (no "Slim") has issues:

*   5-7x slower than `ReaderWriterLockSlim`
*   Doesn't support recursion policy configuration
*   Has subtle bugs in certain edge cases
*   Microsoft recommends avoiding it

Always use `ReaderWriterLockSlim` for new code.

# Mutex

A `Mutex` (mutual exclusion) provides locking that works across processes. This is its key differentiator from `lock` and `Monitor`, which only work within a single process.

### When to Use Mutex

*   Coordinating between multiple processes
*   Ensuring only one instance of an application runs
*   Protecting system-wide resources

### Named Mutex for Single Instance Application

The `Global\` prefix makes the mutex visible across all sessions on the machine. Without it, each terminal session would have its own mutex namespace.

### Mutex vs lock

Aspect

lock / Monitor

Mutex

Scope

Single process

Cross-process

Performance

Fast (~20ns uncontended)

Slow (~1000ns, kernel call)

Named

No

Yes

Inheritance

N/A

Can be inherited by child processes

Release

Auto on scope exit

Manual (must call ReleaseMutex)

**Rule of thumb:** Use `lock` for in-process synchronization, `Mutex` only when you need cross-process coordination.

# Semaphore and SemaphoreSlim

So far, all our synchronization primitives have been binary: one thread at a time. But what if you want to limit concurrency to, say, 10 threads? Maybe you're calling an API with rate limits, or you have a database connection pool with a fixed size.

Semaphores solve this by maintaining a count of available "permits." A thread acquires a permit to proceed, and releases it when done. If no permits are available, the thread waits. Think of it as a bouncer letting N people into a club: you wait until someone leaves before you can enter.

### SemaphoreSlim: Lightweight In-Process Semaphore

### Async Support

`SemaphoreSlim.WaitAsync()` is a game-changer for async code. Unlike `Monitor` or `lock`, which have no async equivalents, `SemaphoreSlim` integrates cleanly with async/await:

This is the idiomatic way to create an "async lock" in C#. Using `lock` inside an async method is dangerous because the thread that enters the lock might not be the thread that exits (after an await).

### Semaphore: Cross-Process

The full `Semaphore` class (not "Slim") supports named semaphores for cross-process coordination, similar to `Mutex`:

### Throttling Pattern

A common use of semaphores is throttling concurrent operations:

Even if you call `FetchManyAsync` with 1000 URLs, only 10 requests execute concurrently. The semaphore provides backpressure without blocking the caller.

# SpinLock and SpinWait

Sometimes blocking is overkill. If a lock is held for just a few nanoseconds, the overhead of a context switch (10,000+ nanoseconds) dwarfs the wait time. In these cases, spinning, burning CPU cycles while checking if the lock is free, is more efficient.

### SpinLock

`SpinLock` is a low-level primitive that spins instead of blocking:

**Critical warning:** `SpinLock` is a struct, not a class. Passing it by value copies it, creating a separate lock. Always pass by reference or store in a field.

### SpinLock is NOT Reentrant

Unlike `lock`, `SpinLock` does not support reentrant acquisition. If the same thread tries to acquire a SpinLock it already holds, it deadlocks:

You can enable thread-owner tracking for debugging with `new SpinLock(enableThreadOwnerTracking: true)`, which will throw an exception instead of deadlocking. But this adds overhead, so it's typically only for debug builds.

### When to Use SpinLock

*   Lock is held for very short durations (tens of nanoseconds)
*   Contention is expected to be brief
*   You're on a multi-core system (spinning on single-core wastes the only CPU)
*   The protected operation doesn't block (no I/O, no other locks)
*   You're certain about no reentrancy (no recursive calls)

### SpinWait: Adaptive Spinning

Raw spinning (a tight while loop checking a condition) has a problem: if the wait is longer than expected, you burn CPU cycles for nothing. But context switching to sleep and wake up has overhead too. What you really want is to spin for a bit, and if that doesn't work, fall back to sleeping.

`SpinWait` provides exactly this adaptive behavior:

`SpinOnce()` uses a sophisticated strategy based on how many times you've called it:

Iteration

Action

Why

1-10

CPU spin with `Thread.SpinWait(n)`

Lock might be released any moment

11-20

`Thread.Yield()`

Let other threads on same core run

21+

`Thread.Sleep(0)` then `Thread.Sleep(1)`

We've waited too long, yield CPU entirely

The iteration thresholds are tuned based on typical context switch times. The idea is: if spinning 10 times didn't help, the lock holder is probably doing real work, not just finishing up. Yielding lets them run.

The `NextSpinWillYield` property tells you if the next spin will yield. This is useful for deciding whether to bail out entirely:

This prevents burning CPU indefinitely if the wait is longer than expected.

### SpinWait.SpinUntil

For condition-based waiting with a timeout:

# Choosing the Right Primitive

With all these options, how do you choose? Here's a decision framework:

### Quick Reference Table

Primitive

Scope

Async Support

When to Use

`lock` / `Monitor`

In-process

No

Default choice for simple mutual exclusion

`ReaderWriterLockSlim`

In-process

No

Read-heavy workloads, many readers few writers

`SemaphoreSlim`

In-process

Yes

Async code, throttling, counting semaphores

`Semaphore`

Cross-process

No

Cross-process throttling

`Mutex`

Cross-process

No

Cross-process mutual exclusion, single-instance apps

`SpinLock`

In-process

No

Very short critical sections, high-performance code

Launching soon
