---
title: "std::atomic and Memory Orders"
description: "std::atomic and Memory Orders - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# std::atomic and Memory Orders

This chapter dives deep into `std::atomic`, the six memory orders, and the trade-offs between them. You'll learn not just what each option does, but when and why to choose each one, and equally important, when to stick with the simple default.

# What is std::atomic?

`std::atomic<T>` is a template class that provides atomic operations on type T. An atomic operation is indivisible: other threads see either the old value or the new value, never a partially written intermediate state.

The following code shows the three most common atomic types you'll encounter. Notice that you can make integers, booleans, and pointers atomic.

Unlike regular variables, atomic operations are guaranteed to be free from data races. Reading and writing an atomic variable from multiple threads without additional synchronization is well-defined behavior.

The diagram below shows the key difference between regular variables and atomics. With a regular variable, concurrent access leads to undefined behavior. With an atomic, you always get a well-defined result.

The key insight here: with atomics, you might see 0 or 1, but you'll never see garbage or crash. That's a fundamental guarantee. But what types can actually be made atomic?

# Type Requirements

Not every type can be made atomic. `std::atomic<T>` requires T to be:

1.  **Trivially copyable**: No user-defined copy constructor, destructor, or copy assignment. Plain data types work. Types with virtual functions or pointers to dynamically allocated memory don't.
2.  **Copy-assignable**: The type must support assignment.

The code below demonstrates what works and what doesn't. Pay attention to why `std::string` fails, since it manages heap memory internally.

An important subtlety: just because something compiles as `std::atomic<T>` doesn't mean it uses hardware atomic instructions. Larger types might use a hidden mutex internally. Here's how to check:

With the basics covered, let's explore the operations you can perform on atomics.

# Core Atomic Operations

### Load and Store

The most basic operations. `load()` reads the current value. `store()` writes a new value.

The explicit versions let you specify memory ordering, which we'll cover shortly. The implicit versions always use the strongest (and safest) ordering.

### Exchange

Atomically replaces the value and returns the old value:

This is useful when you need to know what you're replacing, like taking ownership of a resource or implementing certain lock-free algorithms.

### Compare-and-Exchange

This is the most powerful atomic operation and the foundation of most lock-free algorithms. It compares the current value with an expected value. If they're equal, it writes the desired value. If not, it updates expected with the current value.

There are two variants, and understanding the difference is crucial for interviews:

**compare\_exchange\_strong**: Only fails if the values don't actually match.

**compare\_exchange\_weak**: May fail spuriously even when values match (on some architectures). Use in a loop; slightly more efficient on ARM.

The classic pattern is a compare-exchange loop for lock-free updates:

The diagram below traces this loop through a successful and failed attempt. Notice how on failure, `old` is automatically updated, so you can retry immediately.

### Fetch Operations

Atomic read-modify-write operations that return the old value:

These are more efficient than compare-exchange loops for simple operations because they're a single hardware instruction on most architectures.

### Operators

For convenience, atomic integers support operators that mirror the fetch operations:

Here's something that trips people up: these operators always use `memory_order_seq_cst`. If you need different memory orders, you must use the `fetch_*` functions explicitly.

Now that you understand the operations, let's tackle the most nuanced part of atomics: memory ordering.

# The Six Memory Orders

Every atomic operation can take a memory order parameter. This controls what ordering guarantees the operation provides, which directly affects both correctness and performance.

Why does this matter? Because modern CPUs and compilers aggressively reorder instructions for performance. Memory orders tell them which reorderings are allowed and which would break your code.

### memory\_order\_relaxed

The weakest order. Provides only atomicity, no ordering guarantees:

With relaxed ordering:

*   Reads and writes to this atomic are atomic (no torn reads/writes)
*   No synchronization with other threads
*   Other memory operations can be reordered freely around it
*   The modification order is still consistent (all threads agree on the order of writes to this atomic)

**When to use:** Statistics, counters, progress indicators, anything where you don't need the atomic's value to synchronize other data.

The diagram below shows what relaxed ordering allows. Notice that operations can be reordered freely, and there's no synchronization between threads.

This raises an important question: if relaxed provides no ordering, how do you safely communicate between threads? That's where acquire and release come in.

### memory\_order\_acquire

Used for load operations. Prevents subsequent reads and writes from being reordered before this load:

Acquire creates a one-way barrier: operations after can't move before, but operations before can still move after. Think of it as "acquire the data that was prepared for me."

### memory\_order\_release

Used for store operations. Prevents preceding reads and writes from being reordered after this store:

Release creates the opposite one-way barrier: operations before can't move after, but operations after can still move before. Think of it as "release the data I've prepared."

### memory\_order\_acq\_rel

Combines acquire and release. Used for read-modify-write operations:

The read part has acquire semantics. The write part has release semantics. This is common in lock implementations and reference counting, where you need to both see previous writes and publish your own.

### memory\_order\_seq\_cst

The strongest order. Provides a single total order that all threads agree on.

Sequential consistency means there's one global order of operations that all threads observe. This is what you'd intuitively expect from "correct" concurrent code. It's the default because it's the easiest to reason about.

### memory\_order\_consume

Intended for dependency-ordered reads. In practice, **all major compilers treat consume as acquire** because the semantics are difficult to implement correctly without being overly conservative.

The standard committee has been working on revising this for years. Don't use `memory_order_consume` in new code.

# Memory Order Comparison

Let's compare all the orders side by side

Order

Provides

Cost (x86)

Cost (ARM)

Typical Use

`relaxed`

Atomicity only

Free

Free

Counters, flags (no sync needed)

`acquire`

Load barrier

Free

DMB/LDAR

Lock acquisition, reading "ready" flag

`release`

Store barrier

Free

DMB/STLR

Lock release, setting "ready" flag

`acq_rel`

Both barriers

Free

DMB

RMW in locks, ref counting

`seq_cst`

Total order

MFENCE

DMB + STLR

Default, when unsure

On x86, most ordering is "free" because the hardware provides strong ordering by default. Only `seq_cst` stores require an explicit fence (MFENCE). On ARM and other weakly-ordered architectures, each level of ordering requires additional barrier instructions.

But when should you actually use these different orders? Let's look at a concrete example.

# Implementing a Spinlock

A spinlock is a simple lock that "spins" (busy-waits) until it becomes available. It's a great example of how to use atomics correctly because it requires both acquire and release semantics.

Why these specific memory orders? This is exactly the kind of reasoning interviewers expect:

*   **acquire on lock**: When we successfully acquire the lock, we need to see all the writes made by the previous holder before they released. The acquire prevents our critical section from "leaking" before the lock acquisition.
*   **release on unlock**: When we release, all our writes in the critical section must be visible to the next thread that acquires. The release prevents our critical section from "leaking" after the unlock.

### Improved Spinlock with Test-and-Test-and-Set

The basic spinlock has a performance problem: the `exchange` operation always writes to the cache line, even when the lock is held by someone else. This causes cache line bouncing between cores.

A better approach tests first with a read, only attempting the exchange when the lock appears free:

The inner loop uses `relaxed` because we're just polling. We don't need any synchronization guarantees until we actually attempt to acquire. This keeps the cache line in shared state across cores instead of constantly invalidating it.

# std::atomic\_flag

`std::atomic_flag` is the only type guaranteed to be lock-free on all platforms. It's more primitive than `std::atomic<bool>` and has a quirky interface:

In C++20, `atomic_flag` gained `test()` and `wait()/notify_*()` methods, making it much more useful:

These wait/notify operations are similar to condition variables but work directly on the atomic, avoiding the need for a separate mutex.

# std::atomic\_ref (C++20)

`std::atomic_ref` provides atomic operations on a non-atomic object. This is useful when you need atomic access only sometimes, or when you can't change the object's type:

There's a critical rule you must follow: while any `atomic_ref` to an object exists, all accesses to that object must be through `atomic_ref`. Mixing atomic and non-atomic access is undefined behavior:

This isn't just theoretical. The compiler might cache the non-atomic access in a register, completely missing the atomic update.

# Lock-Free Queue (SPSC)

A single-producer single-consumer (SPSC) queue is a classic lock-free data structure. It's simpler than multi-producer or multi-consumer variants because there's no contention, only coordination between exactly two threads.

Here's a simplified implementation. Pay attention to the memory orders, as I'll explain each choice afterward:

Now let's understand why each memory order was chosen:

**Producer's load of head (relaxed)**: The producer is the only writer to head, so it doesn't need synchronization to read its own position. Relaxed is sufficient.

**Producer's load of tail (acquire)**: The producer needs to see the consumer's most recent read position to know if there's space. The acquire ensures we see all the consumer's previous writes, including freeing up the slot.

**Producer's store to head (release)**: This is crucial. The release ensures that the data write (`buffer_[head] = value`) is visible before the head advances. Without this, the consumer might read garbage.

**Consumer's load of tail (relaxed)**: Same logic as the producer. The consumer owns tail, so it can read its own position without synchronization.

**Consumer's load of head (acquire)**: The consumer needs to see the producer's most recent write position and, critically, the data that was written. The acquire pairs with the producer's release.

**Consumer's store to tail (release)**: This signals to the producer that the slot is free. The release ensures the producer sees we've finished reading before considering the slot available.

# Performance Considerations

### Cache Line Bouncing

When multiple threads write to atomics on the same cache line, performance degrades dramatically. Each write invalidates the cache line on all other cores, forcing them to fetch it again. This is true even with `memory_order_relaxed`.

Consider this scenario with four threads incrementing their own counters:

Even though each thread writes to a different atomic, they all share the same cache line. Every increment by any thread invalidates the line for all others. On a benchmark with four threads doing 10 million increments each, this might take 5+ seconds.

The fix is to pad each counter to its own cache line:

With this change, the same benchmark might complete in 100ms, a 50x improvement.

### False Sharing

False sharing is the formal name for the cache line bouncing problem. It occurs whenever threads access different data that happens to share a cache line. The "false" part means the data isn't logically shared, just physically colocated.

### Choosing the Right Memory Order

Here's a practical rule of thumb:

1.  **Start with seq\_cst** (the default). It's correct by default and easiest to reason about.
2.  **Only weaken if profiling shows a hotspot.** Memory ordering rarely matters for performance except in extremely hot paths like inner loops.
3.  **When you weaken, understand exactly what guarantees you need.** Draw the happens-before relationships. Consider what reorderings are allowed.

The cost savings from weaker orders are real but often overstated. On x86, the difference between relaxed and seq\_cst is only noticeable in tight loops. On ARM, the gap is larger but still usually not the bottleneck.

# When NOT to Use Atomics

Atomics aren't always the right choice. Here's when a mutex is actually better:

**Complex invariants across multiple variables**: If you need to maintain consistency between multiple pieces of data, a mutex is simpler and often just as fast.

**Low contention scenarios**: Uncontended mutexes are extremely fast (20-50 nanoseconds on modern systems). If threads rarely collide, a mutex is simpler with negligible overhead.

**Operations that might fail and need rollback**: Compare-exchange loops can get complicated when failure requires undoing work. A mutex makes transaction-like semantics straightforward.

Launching soon
