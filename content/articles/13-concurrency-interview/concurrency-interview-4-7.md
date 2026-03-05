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

Python's threading history is unique among major programming languages. The `threading` module has been part of Python since version 1.5.2, released in 1999.

But there's a famous caveat: the Global Interpreter Lock (GIL). The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode simultaneously.

This means Python threads don't speed up CPU-bound work on multi-core machines. However, they remain incredibly useful for I/O-bound tasks where threads spend most of their time waiting for external resources, as the GIL is released during I/O operations.

This chapter dives deep into Python-specific thread creation.

We'll explore the `threading.Thread` API, all the ways to create threads (function references, subclassing, callables), configuration options, lifecycle management, and patterns you'll encounter in production code.

# The Thread Class

At the heart of Python's threading model is `threading.Thread`. Every thread in a Python program is represented by an instance of this class or one of its subclasses.

### Thread Constructor

The Thread class constructor accepts several parameters:

The `group` parameter is reserved for future extension when ThreadGroup is implemented (similar to Java's ThreadGroup). For now, it must always be `None`.

### Key Thread Properties

Every thread exposes several properties that affect its behavior and help with debugging:

#### **name**

A human-readable identifier for debugging. If not set, Python generates names like "Thread-1", "Thread-2", etc.

#### **ident**

A unique integer identifier assigned when the thread starts. This is the thread's identifier from the OS. Returns `None` for threads that haven't started.

#### **native\_id**

The native integral thread ID assigned by the kernel (Python 3.8+). Unlike `ident`, this matches what you'd see in system tools like `top` or `ps`.

#### **daemon**

A boolean indicating whether this is a daemon thread. Daemon threads are automatically terminated when all non-daemon threads have completed.

#### **is\_alive()**

Returns `True` if the thread has started and hasn't terminated yet.

### Thread States

Unlike Java or C#, Python doesn't expose thread states through an enum. The thread lifecycle is simpler:

State

How to Check

Description

Created

`ident is None`

Thread instantiated but `start()` not called

Running

`is_alive() == True`

Thread is executing or ready to execute

Waiting

(Not directly queryable)

Blocked on I/O, lock, sleep, or join

Terminated

`is_alive() == False` after start

Thread completed execution

You can check a thread's state at any time:

# Three Ways to Create Threads

In Python, a thread is just a “worker” that runs some callable. The `threading` module gives you three clean ways to define what that worker should execute:

1.  **Pass a target function (preferred)**
2.  **Subclass** `**Thread**` **and override** `**run()**`
3.  **Use a callable object (**`**__call__**`**)**

All three end up doing the same thing: they supply a callable that the thread runs. The difference is how you package the work and state.

### Passing a Target Function (Preferred)

This is the most common and usually the best approach: pass a callable via `target`, and arguments via `args` / `kwargs`.

This approach is preferred because:

1.  **Separation of concerns**: The task logic isn't coupled to Thread.
2.  **Reusability**: The same function can be called directly or in a thread.
3.  **Testability**: Test the function without threading concerns.
4.  **Clarity**: It's obvious what the thread will execute.

Lambda expressions are handy for simple inline logic:

But avoid lambdas when the logic is non-trivial. The moment you need multiple steps, error handling, or logging, a named function is clearer and easier to debug.

### Subclassing Thread

You can subclass `threading.Thread` and override `run()`. This bundles the “task” into a thread-shaped object.

This approach is useful when:

1.  You need to store state in the thread object itself.
2.  You want to access results through the thread instance.
3.  You're building a framework where threads have specific behaviors.

The downsides:

1.  **Coupling**: Logic is tied to the Thread class.
2.  **Single inheritance**: Python allows multiple inheritance, but it can get messy.
3.  **Less flexible**: Harder to reuse the logic outside of threading.

### Using Callable Objects

A callable object is an object that behaves like a function because it implements `__call__`. This gives you a nice middle ground:

This combines the flexibility of the target approach with the statefulness of subclassing. The callable object holds state, but isn't coupled to Thread.

### Comparison Flowchart

### Comparison Table

Approach

State Access

Reusability

Testability

Use Case

Target function

Via args/kwargs

High

Excellent

Most tasks (preferred)

Lambda

Via closure

Medium

Limited

Simple inline logic

Subclass Thread

Instance attributes

Low

Moderate

Custom thread behavior

Callable object

Instance attributes

High

Good

Stateful tasks without subclassing

**When to use each:**

*   **Target function**: Almost always the best choice for new code.
*   **Lambda**: Quick one-liners with captured variables.
*   **Subclass**: When you need custom Thread behavior or integration with frameworks.
*   **Callable**: Stateful operations where you want results stored in the object.

# Thread Configuration

Python provides limited thread configuration compared to Java or C#. Notably, there's no way to set thread priority from Python, as this is managed by the OS scheduler.

### Naming Conventions

Good thread names are invaluable for debugging. When analyzing logs from a multi-threaded application, meaningful names help identify which thread logged what:

Common naming patterns:

*   `{Component}-{Function}-{Number}`: "PaymentService-Processor-1"
*   `{Pool}-{Number}`: "HTTP-Worker-5"
*   `{Feature}-{ID}`: "UserSession-abc123"

Unlike C#, Python lets you change thread names at any time:

### Daemon Threads

Daemon threads are background threads that don't prevent the Python interpreter from exiting. When all non-daemon threads have finished, Python terminates all daemon threads and exits.

#### **Rules for daemon threads:**

1.  Set `daemon` before calling `start()`. Setting it after raises `RuntimeError`.
2.  Child threads inherit daemon status from their parent by default.
3.  Never use daemons for tasks that must complete (file writes, database transactions).
4.  Daemon threads are terminated abruptly, so cleanup code may not run.
5.  The main thread is never a daemon.

### No Priority Control

Unlike Java and C#, Python's threading module doesn't provide thread priority control. Thread scheduling is entirely managed by the operating system. If you need priority control, you'd need to:

1.  Use `os.nice()` to adjust process priority (Unix-only).
2.  Use platform-specific APIs via `ctypes` or extensions.
3.  Implement application-level priority with priority queues.

# Thread Lifecycle Management

Understanding how to properly start, wait for, and stop threads is essential for writing correct concurrent programs.

### The start() Method

Calling `start()` tells Python to begin executing the thread's `run()` method in a new thread of control:

**Critical:** You can only call `start()` once. Calling it again raises `RuntimeError`:

If you need to run the same task again, create a new Thread instance:

### start() vs run(): A Classic Interview Question

This is one of the most common threading interview questions.

When you call `run()` directly, you're just calling a regular method on the Thread object. No new thread is created. The code executes synchronously in the calling thread.

When you call `start()`, Python creates a new OS thread and schedules `run()` to execute on that new thread, running concurrently with the calling thread.

### join() and Timeouts

The `join()` method blocks the calling thread until the target thread terminates:

The `join()` method signature:

**Important:** Unlike Java's `join()` which returns a boolean, Python's `join()` returns `None`. Check `is_alive()` after a timeout to determine if the thread finished:

### There's No interrupt() in Python

Unlike Java, Python's Thread class doesn't have an `interrupt()` method. You cannot forcibly interrupt a thread that's sleeping or blocked. Instead, Python uses cooperative cancellation with threading primitives like `Event`.

The `Event.wait(timeout)` is key here. It allows the thread to respond to the stop signal while sleeping, without busy-waiting. Compare this to a naive approach:

### Checking Thread Status

Several methods help you monitor thread status:

For the main thread and current thread:

# Returning Results from Threads

Getting results back from threads is a common requirement. Python provides several approaches, each with trade-offs.

### Shared Variables with Locks

The traditional approach uses shared variables with proper synchronization:

This works but requires careful synchronization and is error-prone.

### Queue-Based Communication

The `queue.Queue` class provides thread-safe communication between threads:

### Using concurrent.futures (Preferred)

The `concurrent.futures` module provides a high-level interface for asynchronous execution:

For simpler cases, use `executor.map()`:

### Thread-Local Storage

When each thread needs its own copy of a variable:

Thread-local storage is useful for:

*   Database connections per thread
*   User context in web applications
*   Request-specific state

### Comparison: Result Retrieval Methods

Method

Thread Safety

Complexity

Use Case

Shared variables + Lock

Manual

High

Simple shared state

Queue

Built-in

Medium

Producer-consumer patterns

concurrent.futures

Built-in

Low

Task-based parallelism

Thread-local

Built-in

Low

Per-thread state

# Exception Handling in Threads

Exceptions in threads don't propagate to the parent thread. They must be handled within the thread:

For more sophisticated exception handling, use `concurrent.futures`:

### Global Exception Handler

You can set a global exception handler for uncaught exceptions in threads:

Launching soon
