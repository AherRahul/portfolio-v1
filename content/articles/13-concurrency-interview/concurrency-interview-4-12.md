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

C++ threading has undergone a dramatic transformation. Before C++11, writing portable multithreaded code was nearly impossible. You'd use pthreads on Linux, Windows threads on Windows, and hope your code behaved similarly on both. Compilers weren't even aware that other threads existed, so they'd happily optimize away the synchronization patterns you carefully wrote.

C++11 changed everything by introducing `<thread>` and a formal memory model. For the first time, you could write concurrent code that was guaranteed to work correctly across platforms.

This chapter dives deep into C++ thread creation. We'll explore the full `std::thread` API, all the ways to create threads (function pointers, functors, lambdas, member functions), lifecycle management, and the critical RAII patterns that prevent resource leaks.

# The std::thread Class

At the heart of C++11's threading model is `std::thread` from the `<thread>` header. Every thread in a C++ program is represented by an instance of this class, which wraps the underlying OS thread.

### Thread Constructors

The `std::thread` class provides several constructors:

Unlike Java or C#, `std::thread` has no constructor that takes a name. Thread naming is platform-specific and requires calling into OS APIs directly.

**Critical Point:** Threads in C++ are move-only, not copyable. This makes sense because each `std::thread` represents a unique execution context. Copying it would mean two objects trying to manage the same OS thread.

### Key Thread Properties and Functions

Every thread provides several ways to query its state and identity:

#### **get\_id()**

Returns a `std::thread::id` that uniquely identifies the thread. For threads that don't represent an execution context (default-constructed or moved-from), this returns a default-constructed `id` that compares equal to all other non-executing thread IDs.

#### **joinable()**

Returns `true` if the thread represents an active execution context that can be joined or detached. A thread is not joinable if it was default-constructed, moved from, or already joined/detached.

#### **hardware\_concurrency()**

A static function returning a hint about the number of concurrent threads the hardware supports. Returns 0 if the information is unavailable.

#### **native\_handle()**

Returns the implementation-defined native handle type. On POSIX systems, this is `pthread_t`. On Windows, it's a `HANDLE`. Use this when you need platform-specific thread operations.

### Thread ID Type

`std::thread::id` is a copyable, comparable type that uniquely identifies threads:

The default-constructed `std::thread::id{}` represents "no thread" and compares equal only to other default-constructed IDs:

# Thread States

A C++ thread has a simpler state model than Java or C#. The `std::thread` object itself is either associated with an active execution context (joinable) or not. The actual thread states (running, blocked, sleeping) are managed by the OS and not directly visible through the standard library.

State

Description

joinable()

Not-a-Thread

Default-constructed or moved-from

`false`

Joinable

Running and must be joined or detached

`true`

Joined

`join()` was called, thread completed

`false`

Detached

`detach()` was called, runs independently

`false`

### Comparison with Java and C# States

Concept

C++

Java

C#

Created but not started

Not-a-Thread

NEW

Unstarted

Running/Ready

Joinable

RUNNABLE

Running

Waiting for lock

(OS-level)

BLOCKED

WaitSleepJoin

Waiting indefinitely

(OS-level)

WAITING

WaitSleepJoin

Sleeping with timeout

(OS-level)

TIMED\_WAITING

WaitSleepJoin

Completed

Joined/Detached

TERMINATED

Stopped

Fire-and-forget

Detached

Daemon thread

Background thread

C++ doesn't expose OS thread states through the standard library. If you need to know whether a thread is blocked on I/O or waiting for a mutex, you'll need platform-specific debugging tools.

# Four Ways to Create Threads

C++ provides four main approaches to defining what a thread executes: function pointers, functors (function objects), lambda expressions, and member functions. Each has its place, though lambdas are generally preferred for new code.

### Function Pointers

The simplest approach passes a regular function to the thread constructor:

Arguments are copied into the thread's internal storage by default. This is important because the calling function might return before the thread starts executing:

**When to use:** Simple utility functions, C-style callbacks, interoperating with C libraries.

### Functors (Function Objects)

A functor is a class with `operator()` defined. This allows threads to have state:

The "most vexing parse" is a C++ gotcha where `std::thread t(OrderProcessor())` is parsed as a function declaration, not a thread construction. Use extra parentheses or brace initialization to avoid it.

**When to use:** When you need stateful callable objects, complex initialization, or need to query results after the thread completes.

### Lambda Expressions (Preferred)

Lambda expressions are the modern, preferred way to create threads. They're concise, flexible, and clearly show what data the thread captures:

**Capture Semantics:**

Capture

Syntax

Behavior

By value

`[x]`

Copies x; safe for detached threads

By reference

`[&x]`

References x; dangerous if x's lifetime ends

All by value

`[=]`

Copies all used variables

All by reference

`[&]`

References all used variables

Mixed

`[=, &x]`

All by value except x by reference

This pointer

`[this]`

Captures this by pointer

This by value

`[*this]`

Copies the entire object (C++17)

**Critical Warning:** Capture by reference with detached threads is a recipe for disaster:

**When to use:** Almost always. Lambdas are the default choice for modern C++.

### Member Functions

To call a member function on an object, pass a pointer to the member function and the object:

The syntax `std::thread(&Class::method, &object, args...)` passes:

1.  A pointer to the member function
2.  A pointer (or reference wrapper) to the object
3.  Any additional arguments

**When to use:** When integrating threads with existing class hierarchies, or when the class method encapsulates all the thread logic.

### Comparison Flowchart

### Comparison Table

Approach

Type Safety

Captures State

Readability

Use Case

Function Pointer

Good

No (use args)

Clear

Simple callbacks

Functor

Good

Yes

Verbose

Complex stateful tasks

Lambda

Best

Yes (captures)

Best

Almost everything

Member Function

Good

Yes (object)

Moderate

OOP integration

# Thread Configuration

C++ provides limited thread configuration through the standard library. Many properties like names and priorities require platform-specific APIs.

### Thread Naming (Platform-Specific)

The C++ standard doesn't provide thread naming. You must use native handles:

**Interview Insight:** When asked about thread naming in C++, explain that it's not part of the standard and requires platform-specific code. Good thread names are invaluable for debugging, so production code typically includes this platform-specific logic.

### Thread Priority (Platform-Specific)

C++ provides no standard way to set thread priority:

On most systems, you need elevated privileges to set high priorities. Relying on priority for correctness is generally a design smell.

### Hardware Concurrency

The only thread "configuration" the standard provides is querying hardware capabilities:

This function returns a hint, not a guarantee. On some systems, it might return the number of physical cores, logical processors (with hyperthreading), or 0 if the information is unavailable.

# Thread Lifecycle Management

Understanding thread lifecycle is critical in C++ because mismanaging it leads to program termination.

### join() - Wait for Completion

`join()` blocks the calling thread until the target thread finishes execution:

You can only call `join()` once. Calling it on a non-joinable thread throws `std::system_error`:

### detach() - Fire-and-Forget

`detach()` separates the thread of execution from the `std::thread` object. The thread continues running independently:

Once detached, you have no way to join the thread or check if it's still running. The thread becomes a "daemon" that continues until it finishes or the program exits.

**Warning:** Detached threads are dangerous:

*   You can't wait for them to complete
*   They may access destroyed objects
*   Resources they hold might never be cleaned up
*   Program termination kills them abruptly

### joinable() - Check Before Acting

Always check `joinable()` before calling `join()` or `detach()`:

### The Destructor Problem

Here's the critical C++ rule that trips up many developers: **if a joinable thread's destructor runs, \`std::terminate()\` is called**.

This behavior is intentional. The committee decided that silently detaching (like Java) or silently joining (blocking) would hide bugs. Crashing forces you to make an explicit decision.

The following diagram illustrates the thread lifecycle and the critical destructor behavior:

# RAII Thread Guard Pattern

Because `std::thread`'s destructor behavior is dangerous, C++ programmers use RAII (Resource Acquisition Is Initialization) to ensure threads are properly managed.

### Basic Thread Guard

### Owning Thread Guard (Scoped Thread)

A better pattern takes ownership of the thread:

### Joining vs Detaching Guard

You might want a choice between joining and detaching:

The RAII guard pattern is so common that C++20 formalized it with `std::jthread`, which we'll cover later.

# Passing Arguments to Threads

Understanding how arguments are passed to threads is crucial for avoiding subtle bugs.

### Pass by Value (Default)

By default, arguments are copied into the thread's internal storage:

This copy behavior is intentional and safe: the thread has its own copy, immune to the calling function's variables going out of scope.

### Pass by Reference (std::ref)

To pass by reference, use `std::ref` or `std::cref`:

Without `std::ref`, the code might compile but behave unexpectedly. The thread receives a copy of the reference wrapper, which refers to the original variable.

**Common Pitfall:** Forgetting `std::ref` when you intend to pass by reference:

### Move Semantics (std::move)

For move-only types or to avoid copying large objects, use `std::move`:

The following diagram illustrates the three argument passing methods:

### Dangling Reference Pitfall

The most dangerous bug with thread arguments is dangling references:

**Rules to avoid dangling references:**

1.  For detached threads, capture/pass by value or move
2.  For joined threads, ensure referenced objects outlive the join
3.  When in doubt, copy

# Returning Results from Threads

Unlike functions, threads can't simply return values. C++ provides several patterns for getting results back.

### The Old Way: Shared Variables with Mutex

This works but is verbose and error-prone. You must remember to lock, handle "not ready" states, and coordinate between threads manually.

### The Better Way: std::promise and std::future

C++11 introduced `std::promise` and `std::future` for cleaner result passing:

A `promise` is the "write end" where you put the result. A `future` is the "read end" where you get it. They form a one-shot communication channel between threads.

### std::packaged\_task

`std::packaged_task` wraps a callable and automatically handles the promise/future pair:

### std::async (Recommended)

For most cases, `std::async` is the simplest approach (covered in detail in chapter c4):

`std::async` handles thread creation, result storage, and exception propagation automatically. It's the recommended approach unless you need fine-grained control.

# Exception Handling in Threads

Exceptions thrown in a thread don't propagate to the thread that started it. If an exception escapes a thread's top-level function, `std::terminate()` is called.

### Catching Exceptions Within the Thread

### Propagating Exceptions with std::exception\_ptr

To pass exceptions to another thread:

### Exceptions with Promise/Future

The cleanest pattern uses promises, which can transport exceptions:

# Thread-Safe Initialization

C++ provides several mechanisms for safely initializing data that multiple threads might access.

### std::call\_once and std::once\_flag

For one-time initialization that might be triggered from multiple threads:

### Static Local Variables (Meyers' Singleton)

C++11 guarantees thread-safe initialization of static local variables:

This is the simplest and recommended pattern for singletons in modern C++. The compiler generates the synchronization code automatically.

Launching soon
