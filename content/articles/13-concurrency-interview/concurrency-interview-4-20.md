---
title: "Task Parallel Library (TPL)"
description: "Task Parallel Library (TPL) - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Task Parallel Library (TPL)

Before .NET 4.0, writing concurrent code in C# meant wrestling directly with the ThreadPool, managing callbacks, and carefully coordinating thread lifecycles. You would queue work items with `ThreadPool.QueueUserWorkItem`, pass state through object parameters, and handle exceptions with nested try-catch blocks that made code unreadable. Want to know when a batch of operations completed? You had to manage `ManualResetEvent` arrays and `WaitHandle.WaitAll` calls yourself.

The Task Parallel Library changed everything. It introduced `Task` and `Task<T>` as first-class abstractions for asynchronous operations, giving you composable primitives that could be chained, combined, and reasoned about. TPL is not just a convenience layer over ThreadPool. It is a fundamentally different programming model that enables cleaner code, better error handling, and more efficient resource utilization.

Understanding TPL deeply matters for three reasons. First, async/await (introduced in C# 5.0) is built entirely on top of TPL, so understanding Tasks means understanding async. Second, TPL provides the building blocks for CPU-bound parallelism through `Parallel.For`, `Parallel.ForEach`, and PLINQ. Third, every .NET interview involving concurrency will touch on Tasks, continuations, and cancellation patterns.

# Task and Task<T> Fundamentals

A `Task` represents an asynchronous operation that may or may not have completed. Think of it as a promise that work will be done, along with mechanisms to check completion, get results, handle errors, and attach continuations. `Task` represents operations without a return value, while `Task<T>` represents operations that produce a result of type `T`.

### Creating Tasks

There are several ways to create and start tasks, each suited to different scenarios.

**Task.Run: The Modern Approach**

`Task.Run` is the simplest and most common way to offload work to the ThreadPool:

`Task.Run` internally calls `Task.Factory.StartNew` with specific options optimized for common scenarios. It uses `TaskCreationOptions.DenyChildAttach` by default, preventing unexpected parent-child task relationships.

**Task.Factory.StartNew: Fine-Grained Control**

When you need more control over task creation, use `TaskFactory.StartNew`:

The `TaskCreationOptions` flags give you significant control over how tasks behave. Let's walk through each one:

**\`None\`** is the default. The scheduler decides everything, which is usually what you want.

**\`LongRunning\`** is a hint that says "this task will run for a while, don't use a thread pool thread." Without this, a long-running task occupies a thread pool thread, potentially starving other work. With it, the runtime typically creates a dedicated thread. Use this for tasks that run for seconds or longer, or that block on I/O that isn't async-aware.

**\`AttachedToParent\`** creates a parent-child relationship. The parent task won't complete until all attached children complete. This is useful for hierarchical decomposition, but it's also a common source of confusion and bugs, which is why `Task.Run` disables it by default.

**\`DenyChildAttach\`** explicitly prevents child tasks from attaching. This is the default for `Task.Run` and is generally what you want for independent operations.

**\`PreferFairness\`** hints that tasks should be processed in FIFO order. Normally the scheduler optimizes for throughput, which might reorder tasks. Use this when order matters, but note that it's just a hint.

**\`RunContinuationsAsynchronously\`** forces continuations to run on a different stack frame. Without this, completing a task might run continuations synchronously, leading to deep call stacks (stack dives) in pathological cases. This is especially important when building libraries.

Option

Purpose

When to Use

`None`

Default behavior

Most scenarios

`LongRunning`

Hints to scheduler to use dedicated thread

Operations running for seconds or longer

`AttachedToParent`

Creates parent-child relationship

Hierarchical task structures

`DenyChildAttach`

Prevents child attachment

Default for Task.Run

`PreferFairness`

FIFO scheduling preference

When task ordering matters

`RunContinuationsAsynchronously`

Forces continuations to run asynchronously

Preventing stack dives

**Creating Pre-Completed Tasks**

Sometimes you need to return a Task from a method without actually doing async work:

These are useful in caching scenarios, interface implementations, and testing.

### Task States and Lifecycle

A Task moves through a well-defined state machine:

You can check task status through several properties:

A common gotcha: `IsCompleted` returns `true` for faulted and canceled tasks, not just successful ones.

### Waiting for Tasks

Several mechanisms exist to wait for task completion:

The key difference between synchronous and asynchronous waiting is exception handling. `Wait()` and `Result` wrap exceptions in `AggregateException`, while `await` unwraps and throws the first inner exception directly.

# Task Continuations

Continuations let you chain operations that execute when a task completes. This is the foundation of composable asynchronous programming.

### ContinueWith

The `ContinueWith` method schedules a delegate to run when a task finishes:

`ContinueWith` returns a new Task, enabling chaining:

You can control when continuations run with `TaskContinuationOptions`:

Option

Behavior

`OnlyOnRanToCompletion`

Run only if antecedent succeeded

`OnlyOnFaulted`

Run only if antecedent threw exception

`OnlyOnCanceled`

Run only if antecedent was canceled

`NotOnRanToCompletion`

Run unless antecedent succeeded

`ExecuteSynchronously`

Try to run on same thread as antecedent

`LazyCancellation`

Delay cancellation check until execution

Modern C# code should prefer `async/await` over `ContinueWith` for most scenarios. However, `ContinueWith` is still valuable when you need fine-grained control over continuation options or when building infrastructure code.

### WhenAll and WhenAny

These combinators create tasks that complete based on multiple input tasks.

**Task.WhenAll: Wait for All**

If any input task faults, `WhenAll` waits for all tasks to complete and then throws an `AggregateException` containing all exceptions. This ensures you can inspect all failures, not just the first one.

**Task.WhenAny: First to Complete**

A subtle point about `WhenAny`: the returned task completes successfully even if the winning task faulted. You must await the winning task to observe its exception.

### Practical Continuation Patterns

**Fan-Out/Fan-In Pattern**

Process multiple items in parallel, then combine results:

**First-Success Pattern**

Try multiple strategies, use the first successful result:

# TaskScheduler

A `TaskScheduler` determines how and where tasks execute. The default scheduler uses the ThreadPool, but custom schedulers enable specialized execution strategies.

### Default Scheduler

`TaskScheduler.Default` queues tasks to the .NET ThreadPool:

The ThreadPool scheduler implements work-stealing for efficient load balancing. Each thread has a local queue, and idle threads steal work from busy threads.

This diagram shows work-stealing in action. Each thread has its own local queue for efficiency (no contention when pushing/popping your own work). When a thread finishes its work, it can "steal" from another thread's queue. Thread 2 is idle and steals Task B from Thread 1's local queue.

Why does this matter? Work-stealing provides automatic load balancing. If one portion of your data takes longer to process, other threads help out by stealing work. This is especially powerful for recursive algorithms where the work distribution isn't known upfront, like parallel quicksort or tree traversals.

The stealing happens from the opposite end of the queue (LIFO for local, FIFO for stealing). This maximizes cache efficiency: the thread working on its own queue accesses recently-added items (likely still in cache), while the thief takes older items (likely out of cache anyway).

### SynchronizationContext Integration

In UI applications (WPF, WinForms) and ASP.NET (pre-Core), a `SynchronizationContext` captures the current execution context. `TaskScheduler.FromCurrentSynchronizationContext()` creates a scheduler that posts work to this context:

Understanding `SynchronizationContext` is crucial for avoiding deadlocks. When you call `.Result` or `.Wait()` on a task in a context with a single-threaded `SynchronizationContext` (like the UI thread), and the task's continuation needs that same context, you get a deadlock.

### Custom Task Schedulers

You can create custom schedulers for specialized scenarios. Let's build one that limits how many tasks run concurrently, which is useful for throttling access to a limited resource.

The scheduler needs to:

1.  Queue incoming tasks
2.  Track how many tasks are currently running
3.  Only start new tasks when we're below the limit
4.  Handle task completion by starting the next queued task

Here's the implementation with detailed comments:

Usage:

# Parallel Class

The `Parallel` class provides high-level constructs for data parallelism. Unlike manual task management, it handles partitioning, scheduling, and load balancing automatically.

### Parallel.For

Executes a for loop where iterations may run in parallel:

The local state pattern is crucial for performance. Without it, you would need locks or `Interlocked` operations on every iteration. With local state, each thread accumulates independently and merges only at the end.

### Parallel.ForEach

Processes a collection in parallel with automatic partitioning:

### Parallel.Invoke

Executes multiple actions in parallel:

### Partitioning Strategies

The Parallel class uses sophisticated partitioning to balance load:

Strategy

Description

Best For

Range Partitioning

Divides range into fixed chunks

Known, uniform work

Chunk Partitioning

Dynamic chunks requested on demand

Variable work per item

Hash Partitioning

Items with same hash go to same partition

Grouped processing

Striped Partitioning

Round-robin assignment

Unknown work distribution

For `IEnumerable<T>` sources, TPL uses chunk partitioning by default, requesting small batches of items to process. This handles variable iteration costs well but adds overhead for simple iterations.

For arrays and `IList<T>`, TPL uses range partitioning, dividing the collection into contiguous ranges. This is more efficient for uniform work but can cause load imbalance if work varies.

# PLINQ (Parallel LINQ)

`Parallel.For` and `Parallel.ForEach` are great, but they require you to think about indices and explicit loops. If you're already using LINQ, wouldn't it be nice to just add "parallel" and have it work?

That's exactly what PLINQ provides. Add `.AsParallel()` to a LINQ query and PLINQ automatically parallelizes operations across available cores. It handles partitioning, scheduling, and merging, letting you write declarative parallel code.

### Basic Usage

What happens behind `.AsParallel()`? PLINQ:

1.  **Partitions** the source data into chunks (one per core, roughly)
2.  **Distributes** those chunks to worker threads
3.  **Executes** the query operators (Where, Select, etc.) in parallel on each chunk
4.  **Merges** the partial results back together

The merging strategy depends on the final operator. For `Sum`, each thread computes a partial sum, and those are added together. For `ToList`, results are collected into a shared buffer. For `ForAll`, there's no merge at all, each thread just executes its side effects.

### Controlling Parallelism

Merge Option

Behavior

Use When

`Default`

Automatic buffering

Most scenarios

`NotBuffered`

Stream results as produced

Processing results incrementally

`FullyBuffered`

Wait for all results

Need sorted output

`AutoBuffered`

Partial buffering

Balance latency and throughput

### AsOrdered

By default, PLINQ does not preserve the order of elements. If order matters, use `AsOrdered()`:

`AsOrdered()` adds overhead because PLINQ must track original positions and reorder results. Only use it when order genuinely matters.

### ForAll vs foreach

This is a subtle but important distinction that trips up many developers. PLINQ queries return `ParallelQuery<T>`, which can be enumerated with `foreach` or processed with `ForAll`:

Here's the key insight: `foreach` defeats much of the parallelism. Even though the query executes in parallel, the results are funneled back to the calling thread for sequential processing. You pay the parallelization overhead but only get parallel filtering, not parallel processing.

`ForAll` keeps processing parallel. Each worker thread that produces a result also processes it. No synchronization, no merging, maximum throughput. But this means `ProcessItem` must be thread-safe and the order of processing is undefined.

`foreach`

`ForAll`

Execution

Single-threaded enumeration

Multi-threaded processing

Order

Preserved (with `AsOrdered`)

Undefined

Thread safety

Consumer doesn't need it

Consumer must be thread-safe

Use case

Displaying results

Side effects (logging, saving)

### When PLINQ Helps (and When It Hurts)

PLINQ is not always faster. It adds partitioning, synchronization, and merge overhead.

**PLINQ excels when:**

*   Work per element is significant (computation, I/O)
*   Data set is large (thousands or millions of items)
*   Operations are independent (no shared state)
*   You have available CPU cores

**PLINQ hurts when:**

*   Work per element is trivial (simple comparisons)
*   Data set is small (hundreds of items)
*   Sequential algorithms exist (some aggregations)
*   Memory pressure is high (PLINQ buffers data)

# TaskCompletionSource<T>

So far, we've created Tasks either by starting work (`Task.Run`) or by using `async/await`. But what if you need to integrate with code that uses callbacks or events? Or what if you want to create a Task whose completion is controlled externally?

`TaskCompletionSource<T>` fills this gap. It lets you create a Task that you complete manually. You create the TCS, hand out its `.Task` property to consumers, and later call `SetResult`, `SetException`, or `SetCanceled` when the operation finishes. The consumers' awaits complete at that moment.

This is essential for bridging callback-based APIs to Task-based code:

### Basic Usage

The TaskCompletionSource acts as a "promise" that you fulfill later:

### Wrapping Event-Based Patterns

Many older APIs use events rather than callbacks:

Note the use of `TrySet*` methods instead of `Set*`. The `Try` variants return false instead of throwing if the task is already completed. This prevents exceptions when events fire multiple times or in unexpected orders.

### Creating Timers and Delays

### TaskCompletionSource Options

.NET 5+ added `TaskCreationOptions` to control continuation behavior:

The `RunContinuationsAsynchronously` option prevents "stack dives" where deeply nested continuations overflow the stack. It is recommended for most scenarios.

# Cancellation

Cooperative cancellation in TPL uses two types: `CancellationTokenSource` (the controller) and `CancellationToken` (the signal).

### CancellationToken Basics

### Cancellation Patterns

**Polling Pattern**

Check the token periodically in loops:

**Registration Pattern**

Register callbacks to execute on cancellation:

**Linked Tokens**

Combine multiple cancellation sources:

### Graceful Cancellation

Cancellation should be cooperative, not forceful:

Cancellation in TPL is cooperative, not preemptive. A task must actively check its token and respond. This prevents the data corruption and resource leaks that occur with forceful thread termination.

# Exception Handling

Cancellation is one way an operation can end abnormally. Exceptions are another, and they're more complex in parallel scenarios. When multiple tasks run concurrently, multiple tasks can fail. How do you represent multiple exceptions from one logical operation?

TPL's answer is `AggregateException`, a wrapper that can contain multiple inner exceptions. Understanding how it works and when you encounter it is critical for correct error handling.

### AggregateException Structure

When multiple tasks fail, their exceptions are collected:

`AggregateException` can nest, creating a tree of exceptions:

### Flattening and Handling

The `Flatten()` method unwinds nested `AggregateException` instances into a single level. The `Handle()` method lets you selectively process exceptions, rethrowing unhandled ones.

### await vs Wait/Result Exception Behavior

This is a critical distinction that often confuses developers:

Why the difference? The async/await pattern was designed to make async code feel synchronous. When you write synchronous code and call a method that throws, you catch the actual exception. The await machinery unwraps `AggregateException` and throws the first inner exception to match that intuition.

But this means information is lost. If you're awaiting a `Task.WhenAll` that had multiple failures, only the first exception gets thrown. To get all of them, you need to catch, access the task, and inspect its `Exception` property:

This is why `await` is preferred for most code: it provides a natural exception handling experience. But when you need all exceptions from a parallel operation, you need to handle the task explicitly.

### Parallel.For/ForEach Exception Handling

When one iteration throws, other iterations already in progress may complete before the exception propagates. Always handle `AggregateException` for parallel loops.

Launching soon
