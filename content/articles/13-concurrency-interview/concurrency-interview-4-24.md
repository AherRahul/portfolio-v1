---
title: "Go Memory Model"
description: "Go Memory Model - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Go Memory Model

Go makes concurrency easy with goroutines and channels, but this ease can be deceptive. Behind the scenes, modern CPUs and compilers perform aggressive optimizations that can reorder memory operations. Without understanding the memory model, you'll write code that works on your laptop but fails mysteriously in production under load.

Consider this innocent-looking code:

You might expect this to print "00", "02", "12", or even "01" if `g()` runs between the two assignments in `f()`. But it can also print "20", seeing `b = 2` before `a = 1`. The compiler or CPU can reorder the writes in `f()` because there's no dependency between them within that goroutine.

The Go Memory Model gives you the rules to avoid these surprises. Follow the rules, and your program behaves predictably across all platforms and Go versions.

# The Happens-Before Relationship

The core concept in Go's memory model is the **happens-before** relationship. If event A happens-before event B, then:

1.  A is guaranteed to be visible to B
2.  A is ordered before B from B's perspective

If neither A happens-before B nor B happens-before A, then A and B are **concurrent**, and there are no guarantees about which one sees the effects of the other.

Go defines several happens-before rules. Mastering these is essential for writing correct concurrent code.

### Rule 1: Within a Single Goroutine

Within a single goroutine, the happens-before order matches program order. If statement A comes before statement B in your code, A happens-before B.

This rule only applies within a single goroutine. It says nothing about how other goroutines see these operations.

### Rule 2: Package Initialization

Package initialization has a strict order:

1.  If package A imports package B, then B's `init()` functions complete before A's `init()` functions start.
2.  All `init()` functions complete before `main()` starts.
3.  Within a package, variable initialization and `init()` functions run in the order they appear (across multiple files, alphabetically by filename).

### Rule 3: Goroutine Creation

The `go` statement that starts a new goroutine happens-before the goroutine's execution begins.

The write to `msg` happens-before the `go` statement, and the `go` statement happens-before the goroutine starts. By transitivity, the write to `msg` happens-before the read in the goroutine.

### Rule 4: Goroutine Exit

A goroutine's exit is not guaranteed to happen-before any event in the program. This is a common source of bugs:

You must use explicit synchronization (channels, sync primitives) to observe a goroutine's effects.

### Rule 5: Channel Operations

This is where Go's memory model shines. Channels provide strong synchronization guarantees:

**A send on a channel happens-before the corresponding receive completes.**

The send (B) happens-before the receive completes (C). Combined with program order (A happens-before B, C happens-before D), we get A happens-before D by transitivity.

**The close of a channel happens-before a receive that returns a zero value because the channel is closed.**

**For buffered channels: a receive from a channel happens-before the corresponding send completes (if the buffer was full).**

This enables a common pattern for limiting concurrency:

**The kth receive on a channel with capacity C happens-before the (k+C)th send completes.**

This generalizes the previous rule and is the foundation for using buffered channels as semaphores.

### Rule 6: Lock Operations

For `sync.Mutex` and `sync.RWMutex`:

**For any call to \`l.Unlock()\`, there is a later call to \`l.Lock()\` (on the same mutex) that happens-after the unlock.**

**For \`sync.RWMutex\`: a call to \`l.RUnlock()\` happens-before a later \`l.Lock()\` (but RLock/RUnlock pairs don't synchronize with each other).**

### Rule 7: sync.Once

For `sync.Once`, the single call to `f()` from `once.Do(f)` happens-before any call to `once.Do(f)` returns.

This rule has an important subtlety: even if the function panics, subsequent calls won't retry. The "once" refers to execution attempts, not successful completions:

**When to use sync.Once:**

*   Lazy initialization of expensive resources (database connections, caches)
*   One-time setup that must complete before other operations
*   Singleton patterns where `init()` won't work (need runtime parameters)

**Edge case:** If you need retryable initialization, use a mutex with a boolean flag instead:

### Rule 8: sync.WaitGroup

`wg.Done()` happens-before `wg.Wait()` returns (when the counter reaches zero).

The key insight: `Wait()` only returns after all `Done()` calls have completed. This means all the writes that happened before each `Done()` are visible after `Wait()` returns.

**Critical ordering: Add before Go**

The `Add()` call must happen before the goroutine starts, not inside it:

**When to use WaitGroup:**

*   Waiting for a known set of concurrent operations to complete
*   Fan-out/fan-in patterns where you spawn workers and collect results
*   Graceful shutdown: wait for all handlers to finish

**When NOT to use WaitGroup:**

*   When you need error propagation (use `errgroup` instead)
*   When tasks can fail and cancel others (use context + errgroup)
*   When the number of tasks is unbounded (consider worker pools)

### Rule 9: sync.Cond

`cond.Broadcast()` and `cond.Signal()` happen-before the corresponding `cond.Wait()` returns.

**When to use sync.Cond:** Use it when multiple goroutines need to wait for a complex condition involving multiple variables. For simple "wait for completion" scenarios, channels are usually cleaner. Cond shines when you need `Broadcast()` to wake all waiters simultaneously, something channels can only do once with `close()`.

The channel rules we've covered (Rules 5-6) handle most synchronization needs elegantly. But sometimes you need finer-grained control over memory visibility without the overhead of channel communication. That's where atomic operations come in.

# Atomic Operations and Memory Ordering

The `sync/atomic` package provides low-level atomic operations. These operations are indivisible, meaning no other goroutine can observe a partial state.

### Basic Atomic Operations

### Memory Ordering with Atomics

Atomic operations in Go provide **sequentially consistent** ordering. This means:

1.  All atomic operations appear to execute in some global total order
2.  This order is consistent with the program order of each goroutine

This is stronger than what many languages provide by default (like C++'s relaxed atomics) and makes reasoning about correctness easier.

### atomic.Value for Complex Types

For storing and loading interface values atomically:

# Common Memory Model Violations

### Violation 1: Unsynchronized Flag

The compiler might hoist the `done` read outside the loop (seeing it never changes within the loop), creating an infinite loop. Even if it doesn't, there's no happens-before relationship guaranteeing `result` is visible.

**Fix: Use a channel or atomic:**

### Violation 2: Double-Checked Locking

This classic anti-pattern from other languages fails in Go too:

The first read of `instance` is unsynchronized. Another goroutine might see a non-nil pointer to a partially constructed `Singleton`. Here's how this can fail:

**Step-by-step trace showing partial initialization:**

The compiler or CPU might reorder operations so that the pointer assignment becomes visible before the struct fields are fully initialized. Goroutine 2 races past the nil check and gets a pointer to memory that hasn't been fully constructed yet.

**Why sync.Once fixes this:** The fix isn't just about preventing double initialization. `sync.Once` provides two critical guarantees:

1.  **Mutual exclusion:** The initialization function runs exactly once, even with concurrent callers
2.  **Memory visibility:** All writes within `Do(f)` happen-before `Do(f)` returns for any caller

This second guarantee is key. When `once.Do()` returns, you're guaranteed to see all the writes that happened inside the function, regardless of which goroutine actually executed it.

**Fix: Use sync.Once:**

### Violation 3: Racy Map Access

Maps are not safe for concurrent access. Go will panic with "concurrent map read and map write" (if you're lucky) or silently corrupt data.

**Fix: Use sync.Map or protect with mutex:**

### Violation 4: Slice/Struct Field Races

Even though `append` looks atomic, it isn't. One goroutine might read the slice header while another is writing it.

# Detecting Race Conditions

Go provides a built-in race detector. Use it during development and testing:

The race detector instruments memory accesses and reports races:

# Memory Model Best Practices

### 1\. Prefer Channels Over Shared Memory

Go's mantra is "Don't communicate by sharing memory; share memory by communicating." Channels make synchronization explicit and less error-prone.

**Why this works:** The channel send happens-before the receive completes (Rule 5). This single operation both transfers the data and synchronizes the goroutines. No separate "done" flag needed, no race conditions possible.

**Trade-offs:** Channels have higher overhead than atomics or mutexes (~50-100ns vs ~25ns). For performance-critical code with millions of operations per second, the overhead matters. But for most applications, the safety and clarity of channels outweigh the performance cost.

**When to break this rule:** Use shared memory with mutexes when you have true shared state that multiple goroutines read and modify (like a cache). Channels are for transferring ownership, not for protecting shared state.

### 2\. Use sync Package for Shared State

When you do need shared memory, use the sync package:

**Why mutexes work:** Rule 6 guarantees that `Unlock()` happens-before any subsequent `Lock()`. All writes protected by the mutex are visible to any goroutine that later acquires the same mutex.

**Trade-offs:** Mutexes can cause contention when many goroutines compete for the same lock. Solutions include:

*   **Sharding:** Split one lock into many (e.g., 256 locks keyed by hash)
*   **RWMutex:** Multiple readers, single writer for read-heavy workloads
*   **Copy-on-write:** Replace entire data structure atomically

### 3\. Use Atomics for Simple Counters/Flags

For simple values where you don't need complex invariants:

**Why atomics work:** Atomic operations are indivisible and provide sequential consistency. No goroutine can observe a "partial" atomic operation, and the ordering is globally consistent.

**Trade-offs:**

*   Atomics only work on single values (integers, pointers via `atomic.Value`)
*   Can't maintain invariants across multiple values (use mutex for that)
*   Still need careful design; atomic reads and writes to different variables don't synchronize with each other unless you design for it

**When to use each:**

Scenario

Use

Simple counter

`atomic.AddInt64`

Boolean flag

`atomic.Bool` (Go 1.19+) or `atomic.Int32`

Multiple related fields

`sync.Mutex`

Replace entire config

`atomic.Value`

Read-heavy, rarely updated

`sync.RWMutex`

### 4\. Document Synchronization Requirements

Make it clear which fields need synchronization:

**Why this matters:** The race detector can find races during testing, but it can't find races that don't occur in your test scenarios. Documentation helps reviewers and future maintainers understand the synchronization design.

**Trade-off:** Documentation can drift from code. Complement comments with struct organization: group protected fields together after the mutex that protects them.

### 5\. Run the Race Detector in CI

Add race detection to your continuous integration pipeline:

**Why this is essential:** Races are timing-dependent and may not manifest on your development machine but will appear in production under load. The race detector instruments memory accesses and catches races as they happen during tests.

**Trade-offs:**

*   2-10x slowdown and 5-10x memory overhead
*   Doesn't find races that don't execute during tests
*   Not suitable for production (use it in CI and development only)

**Complement with:** Stress testing (`go test -count=100 -race`), fuzzing, and code review. The race detector finds races that occur; good design prevents races from being possible.

# Choosing the Right Synchronization Primitive

With channels, mutexes, and atomics all providing synchronization, how do you choose? Here's a decision framework.

### Comparison Table

Aspect

Channel

Mutex

Atomic

**Use case**

Transfer data between goroutines

Protect shared state

Single-value operations

**Overhead**

~50-100ns

~25ns (uncontended)

~1-5ns

**Can block**

Yes (unbuffered)

Yes (contended)

No

**Deadlock risk**

Yes (circular waits)

Yes (lock ordering)

No

**Multiple values**

Yes (struct in channel)

Yes (protected section)

No (one value)

**Composable**

Yes (select)

Harder

No

**Cancellation**

Built-in (close)

Manual

N/A

### Decision Flowchart

### Quick Reference Examples

**Channel: Passing work to workers**

**Mutex: Shared cache**

**RWMutex: Read-heavy config**

**Atomic: Metrics counter**

Launching soon
