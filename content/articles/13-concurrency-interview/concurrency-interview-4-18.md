---
title: "C# Memory Model"
description: "C# Memory Model - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# C# Memory Model

When you write `x = 42;` in your code, you probably assume this write happens immediately and is visible to all other threads. In reality, multiple layers of optimization can delay, reorder, or even eliminate this write.

**Compiler Reordering**: The JIT compiler can reorder instructions for better performance. If two operations don't depend on each other (from a single-threaded perspective), the compiler might execute them in a different order.

**CPU Reordering**: Even if the compiler preserves your intended order, the CPU itself can execute instructions out of order. Modern processors use out-of-order execution, store buffers, and speculative execution to maximize throughput.

**CPU Caches**: Each processor core has its own cache hierarchy (L1, L2, sometimes L3). A write to memory might sit in one core's store buffer or cache, invisible to other cores.

Without a memory model, programs would behave unpredictably across different hardware. The same code might work on your development machine (x86, which has a relatively strong memory model) but fail on a server with ARM processors (which have a weaker model). The memory model provides a contract: if you follow certain rules, your program will behave consistently regardless of the underlying hardware.

# C# Memory Model Basics

The C# memory model is defined in the ECMA-335 CLI (Common Language Infrastructure) specification. Here's the critical thing to understand: **the CLI memory model is weaker than Java's JMM**. This has real implications for how you write concurrent code.

If you're coming from Java, this might surprise you. Java's memory model, formalized in JSR-133, provides stronger guarantees around volatile variables and final fields. The CLI specification takes a more minimalist approach, giving the runtime more freedom to optimize but placing more burden on you to get synchronization right.

### What the CLI Specification Guarantees

The CLI specification provides a few fundamental guarantees, and understanding exactly what they cover (and what they don't) is essential for writing correct lock-free code.

**1\. Read and Write Atomicity for Certain Types**

The specification guarantees atomic reads and writes for:

*   Reference types (pointers)
*   Value types of 32 bits or less (int, float, bool, char)
*   Enums

What does "atomic" mean here? It means you'll never see a "torn read" for an `int`, where you read half of one value and half of another. If one thread writes `0x12345678` to an int while another thread reads it, the reader will see either the old value or the new value, never a garbage combination like `0x12340000`.

However, `long` and `double` (64-bit types) are NOT guaranteed to be atomic on 32-bit systems. This catches many developers off guard.

**2\. Writes to Volatile Fields Are Release Operations**

A write to a volatile field has "release" semantics. All writes that precede the volatile write in program order are guaranteed to complete before the volatile write.

**3\. Reads from Volatile Fields Are Acquire Operations**

A read from a volatile field has "acquire" semantics. All reads that follow the volatile read in program order are guaranteed to occur after the volatile read.

### What Is NOT Guaranteed

Here's where things get tricky. The CLI specification does NOT guarantee:

*   **Ordering of non-volatile reads and writes**: The JIT and CPU can freely reorder them.
*   **Visibility of writes without synchronization**: A write on one thread might never become visible to another thread.
*   **That regular writes complete before any subsequent operation**: They can be buffered indefinitely.

A common mistake is assuming that C# provides the same guarantees as Java. In Java, there's a happens-before relationship for final fields and for volatile variables that's stronger than what the CLI guarantees. C# code that would work in Java might fail in C#, especially on ARM processors.

### The Visibility Problem in Action

Consider this innocent-looking code:

If you call `Run()` on one thread and `Stop()` on another, the worker thread might never stop. The JIT compiler sees that `_running` is never modified within the loop and can legally optimize it to:

This is a legal optimization because there's no synchronization between the write in `Stop()` and the read in `Run()`.

# The volatile Keyword

The `volatile` keyword tells the compiler and runtime that a field can be accessed by multiple threads. But what does that actually mean at a low level, and why does it work?

### 1\. Acquire-Release Semantics

To understand volatile, you need to understand how modern CPUs work. Processors don't just execute instructions in order. They have store buffers that queue up writes, and they speculatively execute instructions out of order. This is great for performance on single-threaded code, but it means writes can become visible to other cores in a different order than your program specified.

A volatile write acts as a "release fence": it tells the CPU "flush everything I've written so far before making this write visible." All writes before the volatile write are guaranteed to complete before the volatile write becomes visible to other threads.

A volatile read acts as an "acquire fence": it tells the CPU "don't speculatively read anything else until this read completes." All reads after the volatile read are guaranteed to happen after the volatile read.

### 2\. No Caching

The compiler won't cache volatile variables in registers or reorder reads/writes to them past other volatile accesses.

### Fixing the Visibility Problem

Now the compiler cannot hoist the read of `_running` out of the loop, and the write from `Stop()` will become visible.

### Critical Limitation: volatile Is NOT Atomic for 64-bit Types

Here's a trap that catches many developers:

Even with `volatile`, the increment is not atomic because it involves three operations: read, add, write. Another thread can interleave between these operations.

But there's an even more subtle issue. On 32-bit systems, even a simple read or write of a `volatile long` is not atomic:

The `volatile` keyword guarantees ordering and visibility, but it cannot make a 64-bit operation atomic on a 32-bit CPU. For 64-bit atomicity, you need `Interlocked.Read` and `Interlocked.Exchange`.

### When to Use volatile

Use `volatile` when:

*   You have a simple flag that signals between threads (like a stop flag)
*   You're publishing a reference that other threads will read (but not modify)
*   You need visibility guarantees but not atomicity

Don't use `volatile` when:

*   You need atomic increments or compound operations (use `Interlocked`)
*   You're working with 64-bit values on potentially 32-bit systems (use `Interlocked`)
*   You need more complex synchronization (use locks)

# The Interlocked Class

So `volatile` handles visibility, but what about atomicity? Consider incrementing a counter: `_counter++`. This looks like one operation but it's actually three: read the value, add one, write it back. Between those steps, another thread can interleave, leading to lost updates.

The `Interlocked` class solves this by providing true atomic read-modify-write operations. These operations happen in a single, uninterruptible step at the CPU level. They also provide full memory fences, so they handle both atomicity and visibility.

### Core Operations

Let's walk through each method and when you'd use it:

### CompareExchange: The Foundation of Lock-Free Programming

`CompareExchange` (often called CAS, for Compare-And-Swap) is the building block of most lock-free algorithms. Understanding it deeply is essential for writing high-performance concurrent code.

The operation works in three atomic steps:

1.  Reads the current value
2.  If it matches what you expected, replaces it with your new value
3.  Returns what was actually there (so you know if you succeeded)

Why is this useful? Because it lets you implement "optimistic" updates. You read a value, compute a new value, then try to write it back. If someone else modified it while you were computing, the CAS fails and you can retry with the new value. No locks needed.

Here's the key insight: the return value tells you whether you succeeded. If the returned value equals your "comparand", the swap happened. If it doesn't match, someone else modified the value first, and you need to retry.

This stack is elegantly simple, but it has a subtle issue called the **ABA problem**. Imagine this sequence:

1.  Thread 1 reads head = A (which points to B)
2.  Thread 1 is suspended
3.  Thread 2 pops A, pops B, pushes A back (maybe with different data)
4.  Thread 1 resumes, sees head is still A, CAS succeeds
5.  But A->Next is no longer B! Thread 1 has corrupted the stack.

The CAS only checks if the value is the same, not if it was unchanged all along. For reference types like our stack nodes, this usually isn't a problem because .NET's garbage collector won't reuse the same address while we hold a reference. But for value types or in unmanaged scenarios, you might need a versioned CAS pattern (combining the value with a counter that increments on each modification).

### Memory Ordering of Interlocked Operations

All `Interlocked` operations provide full memory fences. This means they:

*   Act as both acquire and release barriers
*   Prevent reordering of memory operations across them
*   Ensure visibility of prior writes to other threads

If Thread 2's `Interlocked.Read` sees the value 1, it's guaranteed to also see `data = 42`.

# Memory Barriers

Sometimes you need explicit control over memory ordering without using `volatile` fields or `Interlocked` operations. C# provides several mechanisms for this.

### Thread.MemoryBarrier()

`Thread.MemoryBarrier()` is a full memory fence. It prevents all reordering across it, both at the compiler and CPU level.

A full memory barrier guarantees that:

*   All loads and stores before the barrier complete before any loads and stores after it
*   The executing processor's writes are visible to other processors

### Volatile.Read() and Volatile.Write()

The `Volatile` class provides static methods for acquire-read and release-write semantics without declaring fields as `volatile`:

This is equivalent to making `_ready` a volatile field, but allows more flexibility since you control exactly which accesses need volatile semantics.

### When to Use Each

Mechanism

Semantics

Use Case

`volatile` field

Acquire on read, Release on write

Simple flags, published references

`Volatile.Read()`

Acquire only

Reading shared state

`Volatile.Write()`

Release only

Publishing shared state

`Thread.MemoryBarrier()`

Full fence

When you need both, or for debugging

`Interlocked` operations

Full fence + atomicity

Atomic updates, lock-free algorithms

The diagram below shows these options arranged by strength. On the left, regular accesses have no ordering guarantees. As you move right, you get stronger guarantees but also more overhead. The key insight is that you should use the weakest barrier that provides the correctness you need, since stronger barriers have higher performance costs, especially on ARM processors.

### ARM vs x86: Why Your Code Works on Your Machine but Fails in Production

Here's something that bites many developers: x86 processors have a relatively strong memory model. Most reads and writes happen in order, and writes become visible to other cores quickly. So your code might work perfectly on your development machine but fail mysteriously on ARM-based servers (like AWS Graviton instances).

ARM has a much weaker memory model. Writes can be reordered with other writes, reads can be reordered with other reads, and without explicit barriers, there's no guarantee about when writes become visible. Code that relies on implicit ordering on x86 will break on ARM.

This is why the C# memory model matters: it defines what you can rely on regardless of the underlying hardware. If you follow the rules (use `volatile`, `Interlocked`, or locks for cross-thread communication), your code will work on both x86 and ARM. If you cut corners because "it works on my machine," you're playing with fire.

### Practical Example: Double-Checked Locking

The classic double-checked locking pattern requires careful attention to memory ordering:

Without `Volatile.Read` and `Volatile.Write` (or a volatile field), a thread might see a non-null reference before the constructor has completed, returning a partially initialized object.

# Comparison with Java's JMM

If you're coming from Java, or if you're asked to compare memory models in an interview, here are the key differences:

### Java Has Stronger Guarantees

Aspect

C# (CLI)

Java (JMM)

volatile 64-bit atomicity

No (32-bit systems)

Yes

final field semantics

No equivalent

Strong guarantees

Volatile piggybacking

Not guaranteed

Guaranteed

Data race semantics

Defined but weak

Defined

### Final Fields vs readonly

Java's `final` fields have special memory model semantics. If a field is final and the object reference is safely published, other threads are guaranteed to see the fully initialized value. C#'s `readonly` provides no such guarantee.

In C#, you need explicit synchronization (volatile reference, lock, or Interlocked) to safely publish objects.

### Volatile Piggybacking

In Java, if you write to variables A and B, then write to volatile V, another thread that reads volatile V will see both A and B. This is called "piggybacking" on the volatile.

The CLI specification provides similar semantics for volatile writes (release) and reads (acquire), but the guarantees are less formally specified. In practice, C# implementations on .NET Framework and .NET Core follow similar behavior, but the specification is less precise than Java's.

### Practical Implications

When porting Java concurrent code to C#:

1.  **Replace final with volatile references or Interlocked for safe publication**
2.  **Be extra careful with 64-bit types**, especially if targeting 32-bit systems
3.  **Don't assume readonly provides thread-safety**
4.  **Test on ARM processors** (like in some Azure instances), which have a weaker memory model than x86

Launching soon
