---
title: "Threading vs Multiprocessing"
description: "Threading vs Multiprocessing - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Threading vs Multiprocessing

The `threading` and `multiprocessing` modules have intentionally similar APIs. This makes switching between them relatively easy.

But their underlying behavior is fundamentally different, and understanding that difference is crucial for writing performant Python code.

# Threading Basics

The `threading` module creates lightweight execution units within a single process. All threads share the same memory space and Python interpreter. Let's start with a simple example.

Both threads run concurrently, finishing in about 1 second total instead of 2 seconds sequentially. The `Thread` class takes a `target` function and `args` tuple. Calling `start()` begins execution. Calling `join()` blocks until the thread completes.

### Thread Class Subclassing

For more complex scenarios where threads need to maintain state or return results, you can subclass `Thread` directly. Override the `run()` method to define what the thread does, and store results as instance attributes.

After `join()` returns, you can safely access `thread.result` because you know the thread has finished. This pattern is cleaner than passing result containers around.

### Thread Synchronization Primitives

When threads share memory, they can step on each other's toes. One thread might read a value while another is halfway through updating it. The `threading` module provides several synchronization primitives to coordinate access to shared resources. Let's look at the most common ones.

**Lock** is the simplest primitive. It provides mutual exclusion, meaning only one thread can hold the lock at a time. Other threads block until the lock is released.

**RLock** (reentrant lock) allows the same thread to acquire the lock multiple times. This is useful when a method that holds a lock calls another method that also needs the lock.

**Event** provides simple signaling between threads. One thread can wait for a signal, and another can set it.

**Condition** allows threads to wait for arbitrary conditions to become true. It combines a lock with the ability to wait and notify.

**Semaphore** limits the number of threads that can access a resource simultaneously. Think of it as a lock with a counter.

Each primitive serves a different coordination pattern. Locks handle basic mutual exclusion, events handle signaling, conditions handle complex waiting scenarios, and semaphores limit concurrency.

# Multiprocessing Basics

The `multiprocessing` module creates separate processes, each with its own Python interpreter and GIL. This enables true parallelism. The API mirrors threading closely, so switching between them is straightforward.

Notice the different PIDs, these are truly separate processes. The API mirrors `threading`: create with `Process`, call `start()`, wait with `join()`.

The `if __name__ == "__main__"` guard is mandatory on Windows and recommended everywhere. Without it, spawning a new process would re-import the module and spawn more processes recursively.

# Key Differences

Understanding the fundamental differences helps you choose correctly. The diagram below illustrates the core architectural difference between the two approaches.

The diagram contrasts the two approaches. In threading, all threads share one memory space and contend for one GIL. In multiprocessing, each process has its own isolated memory and its own GIL. This isolation is why multiprocessing achieves true parallelism: no single GIL bottleneck.

### Comparison Table

The following table summarizes the key differences at a glance.

Aspect

threading

multiprocessing

Memory model

Shared

Isolated

GIL impact

Limits CPU parallelism

No impact (separate GILs)

Startup overhead

Low (~1ms)

High (~100ms)

Memory overhead

Low

High (process duplication)

Data sharing

Direct (same memory)

Explicit (IPC)

Best for

I/O-bound tasks

CPU-bound tasks

Crash isolation

None (crash affects all)

Full (crash affects one)

### Memory Model

The memory model difference has profound implications for how you write concurrent code. Let's see both in action.

With threads, one thread's variable is visible to all. Modifications are immediately shared.

Both threads appended to the same list, and the main thread sees all the items. This is convenient but requires care. Without proper synchronization, two threads modifying the same data can corrupt it.

Now compare this with processes. Changes in one process are completely invisible to others.

Each process has its own copy of `shared_data`. The main process's list remains empty. This is not a bug, it's by design. Process isolation prevents accidental data corruption but means you need explicit IPC mechanisms to share data (we'll cover those later in this chapter).

# When to Use Threading

Use threading when your code is I/O-bound: waiting for network responses, file operations, database queries, or user input. The key insight is that threads release the GIL while waiting for I/O, so multiple threads can wait simultaneously even though only one can run Python code at a time.

### Example: Concurrent Web Requests

Let's see this in practice with a common scenario: fetching multiple web pages. We'll compare sequential fetching with threaded fetching.

**Output:**

Threading shines here. The sequential version waits for each response before starting the next request. The threaded version fires all requests simultaneously, and while one thread waits for its response, others can proceed. The total time approaches the duration of the slowest single request rather than the sum of all requests.

### Threading Use Cases

Threading works well for any task that spends most of its time waiting rather than computing.

*   Web scraping and API clients
*   File I/O operations (reading/writing multiple files)
*   Database operations (waiting for query results)
*   GUI applications (keeping UI responsive)
*   Chat servers (handling multiple connections)

# When to Use Multiprocessing

Use multiprocessing when your code is CPU-bound: number crunching, data processing, image manipulation, or any computation that keeps the CPU busy. Threading won't help here because the GIL prevents true parallel execution of Python bytecode. You need separate processes to utilize multiple CPU cores.

### Example: Parallel Computation

Let's demonstrate with a CPU-intensive task: counting prime numbers. This computation keeps the CPU busy with arithmetic, making it ideal for multiprocessing.

**Output:**

Real parallelism. Four processes on four cores, each crunching numbers independently. The speedup is nearly linear with the number of workers because the work divides evenly and there's minimal coordination overhead.

Notice the use of `Pool.starmap()` which applies a function to each tuple of arguments and returns results. The Pool manages worker processes automatically, including restarting any that crash.

### Multiprocessing Use Cases

Multiprocessing excels when you have work that can be divided into independent chunks.

*   Image/video processing
*   Scientific computing
*   Data transformation pipelines
*   Machine learning training
*   Monte Carlo simulations
*   Batch processing large datasets

# Inter-Process Communication (IPC)

Since processes have isolated memory, sharing data requires explicit mechanisms. You cannot just modify a shared variable like you can with threads. Instead, you need to pass messages between processes or set up shared memory regions.

Python's multiprocessing module provides several IPC mechanisms, each suited to different scenarios. Let's explore them from simplest to most specialized.

### Queue: Message Passing for Multiple Processes

The Queue is the most versatile IPC mechanism. It works like a thread-safe mailbox where processes can drop messages and pick them up. Any number of processes can send to or receive from the same queue.

Here's a classic producer-consumer example where one process generates items and another processes them.

Notice how the producer uses `None` as a sentinel value to signal completion. This is a common pattern. The consumer knows to stop when it receives `None`. Without some termination signal, the consumer would block forever on `queue.get()`.

Queues are ideal when you have multiple producers, multiple consumers, or both. They handle all the synchronization internally.

### Pipe: Direct Two-Way Communication

Sometimes you just need two processes to talk to each other directly. A Pipe creates a connection with two endpoints, one for each process. Unlike a Queue, a Pipe is limited to exactly two participants, but it has lower overhead.

The following example shows two processes exchanging messages through a pipe.

The sender and receiver each get one end of the pipe. Each can both send and receive (it's bidirectional by default), but you need to be careful about ordering. If both ends call `recv()` simultaneously, you have a deadlock.

Pipes shine in request-response patterns where two processes need to coordinate closely. For anything more complex, use a Queue.

### Shared Memory: High-Performance Data Sharing

Both Queue and Pipe work by copying data between processes. For small messages, that's fine. But what if you need to share a large NumPy array? Copying gigabytes of data would be painfully slow.

Shared memory solves this by creating a memory region that multiple processes can access directly. No copying required. The child process can read and modify the same bytes that the parent sees.

Here's an example where a worker process doubles every element in a shared array.

**Output:**

The worker attached to the existing shared memory by name, modified the array in place, then closed its reference. The parent sees the changes immediately because both are looking at the same memory.

Important: you must call `shm.close()` when done and `shm.unlink()` to actually free the memory. Failing to unlink leaves orphaned shared memory segments on your system.

Shared memory is powerful but requires careful coordination. If two processes write to the same location simultaneously, you get race conditions, just like with threads. You'll often need to combine shared memory with locks.

### IPC Comparison

Each IPC mechanism has its sweet spot. The table below summarizes when to use each.

Method

Best For

Overhead

Bidirectional

Queue

Multiple producers/consumers

Medium

N/A (FIFO)

Pipe

Two processes

Low

Yes

Value/Array

Simple shared data

Low

N/A

shared\_memory

Large arrays

Very low

N/A

Manager

Complex shared objects

High

N/A

# Decision Tree: Which to Choose?

Still not sure which to use? The following decision tree walks through the key questions.

This decision tree captures the core logic. Start by identifying your workload type. I/O-bound? Use threading. CPU-bound? Use multiprocessing. Mixed? Determine the dominant factor, or use a hybrid approach.

Launching soon
