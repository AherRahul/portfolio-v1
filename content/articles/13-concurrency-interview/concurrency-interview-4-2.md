---
title: "Java Memory Model"
description: "Java Memory Model - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Java Memory Model

Each CPU core has its own cache for speed, but this creates a visibility problem. The Java Memory Model (JMM) is the rulebook that defines how and when changes made by one thread become visible to others.

Understanding the JMM is essential for writing correct concurrent code in Java.

# Why the JMM Exists

Modern CPUs perform numerous optimizations to maximize performance:

**CPU Caches**: Each core has L1, L2, and sometimes L3 caches. Reading from cache is 10-100x faster than main memory, but cached values can become stale.

**Store Buffers**: Writes don't go directly to cache. They're queued in store buffers, allowing the CPU to continue executing while writes complete asynchronously.

**Compiler Reordering**: The JIT compiler rearranges instructions for better performance. It might execute later instructions before earlier ones if there's no apparent dependency.

**CPU Instruction Reordering**: Even if the compiler preserves order, the CPU itself can execute instructions out of order for pipeline efficiency.

The diagram below illustrates how each CPU core maintains its own cache and store buffer, creating the visibility problem that the JMM addresses.

Without the JMM, Java programs would behave unpredictably across different hardware. The same code might work on your laptop but fail on a server with a different CPU architecture. The JMM provides a contract: if you follow certain rules, your program will behave consistently regardless of the underlying hardware.

# The Visibility Problem

Now that we understand why the JMM exists, let's see what happens when you ignore it. Consider this innocent-looking code that demonstrates a classic visibility bug:

You might expect the worker thread to stop after one second. But on many systems, particularly multi-core servers, this thread may never stop. The JIT compiler sees that `running` is never modified within the loop and optimizes it to:

This is a legal optimization under the JMM because there's no synchronization establishing a happens-before relationship between the write in `stop()` and the read in `run()`.

So how do we fix this? We need to understand the core abstraction the JMM provides: the happens-before relationship.

# Happens-Before Relationship

The happens-before relationship is the foundation of the JMM. If action A happens-before action B, then:

1.  A is visible to B (B sees A's effects)
2.  A is ordered before B (from B's perspective, A has already occurred)

The JMM defines eight formal happens-before rules:

### Rule 1: Program Order Rule

Within a single thread, each action happens-before every subsequent action in program order.

This seems obvious, but it only applies within a single thread. A write in Thread 1 doesn't automatically happen-before a read in Thread 2.

### Rule 2: Monitor Lock Rule

An unlock on a monitor happens-before every subsequent lock on that same monitor.

### Rule 3: Volatile Variable Rule

A write to a volatile field happens-before every subsequent read of that same field.

### Rule 4: Thread Start Rule

A call to `Thread.start()` happens-before any action in the started thread.

### Rule 5: Thread Termination Rule

All actions in a thread happen-before any other thread successfully returns from `join()` on that thread.

### Rule 6: Interruption Rule

A thread calling `interrupt()` on another thread happens-before the interrupted thread detects the interrupt.

### Rule 7: Finalizer Rule

The end of a constructor happens-before the start of the finalizer for that object.

### Rule 8: Transitivity

If A happens-before B, and B happens-before C, then A happens-before C. This rule is what makes the JMM practical. You can chain guarantees together to reason about complex scenarios.

The diagram below shows how transitivity works in practice. Notice how the write to `data` becomes visible to the read of `data` through a chain of happens-before relationships.

The transitivity rule is powerful. In this example, the write to `data` happens-before the read of `data` through the chain: program order → volatile rule → program order.

With these rules in hand, let's look more closely at the two main tools for establishing happens-before: `volatile` and `synchronized`.

# Volatile Semantics

The `volatile` keyword provides two guarantees:

### 1\. Visibility

A volatile write is immediately flushed to main memory. A volatile read always fetches from main memory. No caching of volatile variables.

### 2\. Ordering

A volatile write prevents earlier writes from being reordered after it. A volatile read prevents later reads from being reordered before it.

The diagram below visualizes this ordering guarantee. All writes above the volatile write are guaranteed to be visible before any writes below it execute.

### What Volatile Does NOT Provide

Volatile does not provide atomicity for compound operations:

Even though `counter` is volatile, `counter++` involves three operations: read, increment, write. Another thread can interleave between these operations. For atomic increments, use `AtomicInteger`.

### Fixing the Visibility Problem

Our earlier example is fixed with volatile:

Now the worker thread will see the update to `running` and terminate properly.

But what about objects that never change after construction? For immutable objects, Java provides another mechanism that's both simpler and more efficient than `volatile`.

# Final Field Semantics

The `final` keyword provides special guarantees for safe publication of objects:

1.  If a field is final, other threads are guaranteed to see the fully initialized value after the constructor completes.
2.  The object reference itself must be safely published (not leaked during construction).

### The Freeze Action

At the end of a constructor, a "freeze" action occurs for all final fields. Think of it like hitting "save" before sharing a document. Until you freeze, other threads might see the object in an incomplete state.

The freeze ensures:

1.  All writes to final fields are visible
2.  All writes to objects reachable through final fields are visible (this includes array elements, list contents, map entries, and so on)

Here is a concrete before/after comparison showing what the freeze action guarantees.

**Without Freeze (Hypothetical):**

**With Freeze (Actual Java Behavior):**

The following diagram shows the timeline of how the freeze action orders memory operations across threads.

The key insight: the freeze creates a happens-before edge between all writes to final fields (and objects reachable from them) and any subsequent read of those fields through a properly published reference.

### Why Synchronized Doesn't Help in Constructors

You might wonder: "Can I use synchronized in the constructor to safely publish an object?" The short answer is no, and here's why.

Synchronizing the constructor doesn't help because:

1.  **No lock contention is possible**: The object doesn't exist yet, so no other thread can possibly have a reference to lock on. The synchronized keyword on the constructor only locks on `this`, but `this` isn't shared with anyone during construction.
2.  **The problem is publication, not construction**: The race happens when the reference is published, not during the constructor body. Synchronized in the constructor completes before any publication.
3.  **The reading thread doesn't synchronize**: Even if the constructor synchronized, the reading thread would need to synchronize on the same lock to establish a happens-before relationship.

The correct approach is to use `final` fields (which get the freeze action) or to synchronize the publication and all subsequent reads, not the constructor.

### Unsafe Construction Patterns

Final fields only work if you don't leak `this` during construction:

Another thread accessing the object through the registry might see `value = 0` because the freeze hasn't happened yet.

Understanding final fields is only half the story. The other half is how you actually share objects between threads, a concept called "publication."

# Publication and Safe Construction

Safe publication means making an object reference visible to other threads in a way that guarantees they see the fully constructed object.

### Safe Publication Idioms

**1\. Static Initializer**

Static initializers are guaranteed to complete before any thread can access the class.

**2\. Volatile Field**

**3\. Final Field**

**4\. Synchronized Block**

### Unsafe Publication Example

Another thread might see a partially constructed `Resource` object, with some fields at default values.

The following diagram shows exactly how this race condition unfolds. Notice how the CPU can reorder the reference store to happen before the field writes complete.

This race is subtle because Thread 2 does see a non-null reference. The object exists. It just isn't fully initialized yet.

# Common Visibility Bugs

Theory is helpful, but recognizing these bugs in real code is a practical skill. Here are the patterns you'll encounter most often.

### Bug 1: The Infinite Loop

**Fix:** Make `done` volatile.

### Bug 2: Stale Read with Double-Check

**Fix:** Make `instance` volatile or use initialization-on-demand holder.

### Bug 3: Reading Shared State Without Synchronization

**Fix:** Synchronize both read and write, or use volatile/atomic.

### Bug 4: Non-Atomic 64-bit Operations

On 32-bit JVMs, 64-bit reads and writes are not atomic. You might read bits from two different writes!

**Fix:** Use volatile (guarantees atomicity for long/double) or AtomicLong.

Now that we've covered correctness, let's talk about performance. Memory barriers aren't free.

# Performance Considerations

Memory barriers required by volatile and synchronized have real costs. The table below shows relative performance for common operations:

Operation

Relative Cost

Notes

Local variable read

1x

No barrier

Volatile read

1.5-2x

LoadLoad + LoadStore barriers

Volatile write

10-20x

StoreStore + StoreLoad barriers

Synchronized (uncontended)

20-50x

Biased locking helps

Synchronized (contended)

100-1000x

Thread parking/unparking

### Guidelines

1.  **Don't over-synchronize**: Only protect shared mutable state
2.  **Prefer volatile for simple flags**: Lower overhead than synchronized
3.  **Use AtomicXxx for counters**: Lock-free, better than volatile + synchronized
4.  **Immutable objects need no synchronization**: The ultimate optimization
5.  **Thread-local data needs no synchronization**: Each thread has its own copy

### Volatile vs Synchronized

The table below summarizes when to use each:

Aspect

Volatile

Synchronized

Atomicity

Single read/write only

Compound operations

Visibility

Yes

Yes

Ordering

Partial (around volatile access)

Full (within critical section)

Blocking

Never

Can block

Use case

Flags, published references

Complex state transitions

Choose `volatile` when you need simple visibility guarantees for a single variable. Choose `synchronized` when you need to protect compound operations or maintain invariants across multiple variables.

Launching soon
