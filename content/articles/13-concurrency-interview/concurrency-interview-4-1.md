---
title: "Creating Threads"
description: "Creating Threads - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Creating Threads

Java was built with threading in mind from day one. Unlike languages that bolted on concurrency later, Java's thread support is woven into the JVM itself.

Every Java program starts with at least one thread (the main thread), and the JVM runs several background threads for garbage collection, finalization, and JIT compilation. Understanding how to create and manage threads is foundational to writing concurrent Java applications.

This chapter dives deep into creating threads in Java.

# The Thread Class

At the heart of Java's threading model is the `java.lang.Thread` class. Every thread in a Java program is represented by an instance of this class or one of its subclasses.

### Thread Constructors

The Thread class provides eight public constructors, though you'll primarily use just a few:

The `stackSize` parameter is a hint to the JVM about how much stack space to allocate for the thread. The JVM may ignore it, and behavior varies across platforms. On 64-bit systems, the default is typically 1MB. You might reduce it when creating many threads to save memory, or increase it for deeply recursive algorithms.

### Key Thread Properties

Every thread has several properties that affect its behavior:

#### **Name**

A human-readable identifier used for debugging. If you don't set one, Java generates names like "Thread-0", "Thread-1", etc.

#### **Priority**

An integer from 1 to 10 that hints to the scheduler how important this thread is. Higher priority threads may get more CPU time, but this is platform-dependent and not a guarantee.

#### **Daemon Status**

Determines whether the thread prevents JVM shutdown. Daemon threads are killed when all user threads complete.

#### **Thread ID**

A unique positive long number generated when the thread is created. Unlike names, IDs are guaranteed unique.

### Thread States

A Java thread can be in one of six states, defined in the `Thread.State` enum:

State

Description

NEW

Thread created but `start()` not yet called

RUNNABLE

Executing or ready to execute (waiting for CPU)

BLOCKED

Waiting to acquire a monitor lock (synchronized block)

WAITING

Waiting indefinitely for another thread

TIMED\_WAITING

Waiting with a timeout

TERMINATED

Completed execution (normally or via exception)

You can query a thread's state at any time:

The RUNNABLE state includes both threads that are actually running on a CPU and threads that are ready to run but waiting for a CPU. Java doesn't distinguish between "running" and "ready" because this is an OS-level detail that changes constantly.

# Three Ways to Create Threads

Java provides three fundamental approaches to defining what a thread should do: extending Thread, implementing Runnable, and implementing Callable.

### Extending Thread

The most direct approach is to create a subclass of Thread and override the `run()` method:

This approach works but has significant drawbacks:

1.  **Single inheritance limitation**: Java allows only one superclass. If your class extends Thread, it can't extend anything else.
2.  **Tight coupling**: The task logic is bound to the Thread class, making it harder to test and reuse.
3.  **Poor separation of concerns**: Mixes "what to do" with "how to run it."

**When to use:** Almost never. There are rare cases where you need to customize Thread behavior itself (custom scheduling, specialized cleanup), but these are uncommon.

### Implementing Runnable

The preferred approach separates the task from the execution mechanism:

With Java 8's lambda expressions, simple tasks become one-liners:

The Runnable approach is preferred because:

1.  **Flexibility**: The same Runnable can be used with raw threads, executors, thread pools, or any other execution mechanism.
2.  **Inheritance freedom**: Your class can extend whatever it needs.
3.  **Testability**: You can test the run() method directly without threading concerns.
4.  **Clarity**: It's obvious that you're defining a task, not a special kind of thread.

### Implementing Callable

What if your task needs to return a result or throw a checked exception? That's where Callable comes in:

Unlike Runnable, you can't pass a Callable directly to a Thread constructor. Instead, use an ExecutorService:

The diagram below shows how Runnable and Callable differ in their interaction with the execution framework:

### Comparison: Runnable vs Callable

Aspect

Runnable

Callable

Method signature

`void run()`

`V call() throws Exception`

Return value

None

Generic type V

Checked exceptions

Cannot throw

Can throw

Use with Thread

Direct

Must wrap in FutureTask

Use with Executor

`execute()` or `submit()`

`submit()` only

Result retrieval

Shared variables, manual sync

Future.get()

Introduced in

Java 1.0

Java 5

**When to use each:**

*   **Runnable**: Fire-and-forget tasks, tasks that communicate results via shared state
*   **Callable**: Tasks that produce results, tasks that may throw checked exceptions

# Thread Configuration

Beyond the basics, Java provides several configuration options that affect how threads behave.

### Naming Conventions

Good thread names are invaluable for debugging. When you're looking at a thread dump from a production server with hundreds of threads, meaningful names are the difference between finding the problem in minutes versus hours.

Common patterns:

*   `{Component}-{Function}-{Number}`: "PaymentService-Processor-1"
*   `{Pool}-{Number}`: "HTTP-Worker-5"
*   `{Feature}-{ID}`: "UserSession-abc123"

### Thread Priority

Thread priority is a hint to the scheduler, not a guarantee. The JVM maps Java's 1-10 scale to OS-specific priorities, and the mapping varies:

**Important caveats:**

1.  On Linux, you need root privileges to raise thread priority above normal.
2.  Priority differences matter mainly under CPU contention.
3.  Relying on priority for correctness is a design smell. Use proper synchronization instead.
4.  Starvation is possible if high-priority threads never yield.

### Daemon Threads

Daemon threads are service threads that run in the background and don't prevent JVM shutdown. The JVM exits when only daemon threads remain.

JVM's built-in daemon threads include:

*   Garbage collector
*   Finalizer thread
*   Reference handler
*   Signal dispatcher

**Rules for daemon threads:**

1.  Set daemon status before calling `start()`. After start, it throws `IllegalThreadStateException`.
2.  Child threads inherit daemon status from their parent.
3.  Never use daemons for tasks that must complete (file writes, transactions).
4.  Daemon threads are terminated abruptly without running finally blocks when JVM exits.

### Thread Groups (Legacy)

Thread groups were Java's original mechanism for organizing threads into hierarchies. They're now considered largely obsolete, replaced by executors and thread pools for most purposes.

Thread groups are still used in some frameworks and for security manager policies, but you shouldn't use them in new code. Use ExecutorService instead.

# Thread Lifecycle Management

Understanding how to properly start, wait for, and stop threads is essential for writing correct concurrent programs.

### The start() Method

Calling `start()` tells the JVM to create a new native thread and invoke the `run()` method on it. This involves:

1.  Allocating memory for the thread's stack
2.  Creating an OS-level thread
3.  Scheduling the thread for execution
4.  Eventually calling `run()` on the new thread

**Critical:** You can only call `start()` once on a thread. Calling it again throws `IllegalThreadStateException`:

If you need to run the same task again, create a new Thread instance.

### run() vs start(): A Classic Interview Question

This is one of the most common Java concurrency interview questions, and getting it wrong is an instant red flag.

When you call `run()` directly, you're just calling a regular method on the Thread object. No new thread is created. The code executes synchronously in the calling thread.

When you call `start()`, the JVM creates a new OS thread and schedules `run()` to execute on that new thread, running concurrently with the calling thread.

### join() and Timeouts

The `join()` method makes the current thread wait until the target thread terminates:

The overloaded versions accept milliseconds and nanoseconds:

`join()` can throw `InterruptedException`. If the waiting thread is interrupted, you should either propagate the exception or restore the interrupt status:

### Interrupts and InterruptedException

Java uses a cooperative interruption model. You can't forcibly stop a thread (the deprecated `stop()` method was dangerous). Instead, you ask a thread to stop, and it decides how and when to comply.

There are two ways to check for interruption:

**Important:** Many blocking methods throw `InterruptedException` when interrupted:

*   `Thread.sleep()`
*   `Object.wait()`
*   `BlockingQueue.take()`
*   `Future.get()`
*   `Lock.lockInterruptibly()`

When these methods throw `InterruptedException`, they clear the interrupt flag. This is why you should restore it with `Thread.currentThread().interrupt()` if you catch but don't rethrow the exception.

# Returning Results from Threads

Getting results back from threads is a common requirement. Java provides several approaches, each with trade-offs.

### The Old Way: Shared Variables with Synchronization

Before Callable and Future, you'd share results through instance variables:

This works but requires careful synchronization and is error-prone.

### The Better Way: Callable and Future

Java 5 introduced a cleaner pattern:

Future provides several useful methods:

### Using FutureTask with Raw Threads

If you need Callable semantics but can't use an ExecutorService:

FutureTask implements both `Runnable` and `Future<V>`, bridging the gap between raw threads and the Callable/Future pattern.

### The Modern Way: CompletableFuture

Java 8 introduced CompletableFuture, which provides a much richer API for asynchronous programming. We cover this in detail in the CompletableFuture chapter, but here's a taste:

# Thread Factories

When using thread pools or executors, you often want to customize how threads are created. This is where `ThreadFactory` comes in.

### The ThreadFactory Interface

A ThreadFactory is responsible for creating new threads. The default factory creates standard threads, but you can customize everything: names, priorities, daemon status, exception handlers, and more.

### Building a Custom ThreadFactory

### Production-Ready ThreadFactory

Here's a more complete example with logging and monitoring:

### Guava's ThreadFactoryBuilder

Google's Guava library provides a convenient builder for creating thread factories:

# Common Patterns

### One-Shot Execution Pattern

For tasks that run once and then the thread is done:

### Worker Thread Pattern

A long-lived thread that processes items from a queue:

### Background Cleanup Pattern

A daemon thread for periodic maintenance:

Launching soon
