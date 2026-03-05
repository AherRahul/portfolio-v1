---
title: "Global Interpreter Lock (GIL)"
description: "Global Interpreter Lock (GIL) - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Global Interpreter Lock (GIL)

The GIL is arguably the most misunderstood feature of Python. Some developers avoid threads entirely because of it. Others ignore it completely and wonder why their parallel code is slow.

This chapter explains what the GIL is, why it exists, how it affects your code, and most importantly, how to work around it when you need real parallelism.

# What is the GIL?

Think of the Python interpreter as a kitchen with one stove. Multiple chefs (threads) can work in the kitchen, but only one can use the stove at a time. When a chef needs to cook something, they grab the stove key. Other chefs can prep ingredients, wash dishes, or wait, but nobody else cooks until the key is returned. The GIL is that key.

In technical terms, the Global Interpreter Lock is a mutex that protects access to Python objects. It ensures that only one thread executes Python bytecode at any given time. Even on a machine with 16 cores, only one thread runs Python code at once. The others wait.

The diagram shows the GIL lifecycle from a thread's perspective. A thread starts by acquiring the GIL and enters the **Holding** state (green), where it can execute Python bytecode. While holding, it loops back to itself as it runs your code. Eventually, it releases the GIL, either voluntarily (I/O operation, sleep) or because the interpreter forces it (check interval).

The GIL then enters the **Released** state (yellow), and waiting threads compete for it. One thread wins and transitions back to Holding, while others remain in **Waiting** (orange).

The key insight: the GIL does not prevent multithreading. Python threads can exist and run concurrently. It prevents parallel execution of Python bytecode. Two threads cannot simultaneously execute `x = x + 1` even if you have multiple CPUs.

# Why Does Python Have a GIL?

The GIL exists because of how CPython manages memory. Python uses reference counting for garbage collection. Every object has a counter tracking how many references point to it. When the count reaches zero, Python frees the memory.

To see reference counting in action, you can use the `sys.getrefcount()` function. Watch how the count changes as you create and delete references:

Notice that `getrefcount()` reports 3 instead of 2 because passing the object to the function creates a temporary reference. The important point is that every assignment, every function call, every attribute access potentially modifies these reference counts.

The problem is that incrementing and decrementing reference counts is not atomic. Without protection, two threads could simultaneously modify a reference count:

If refcounts become corrupted, Python either frees objects still in use (crash) or never frees objects that should be freed (memory leak). The GIL prevents this by ensuring only one thread manipulates Python objects at a time.

### Why Not Fine-Grained Locks?

A natural question: why not add a lock to every object instead of one global lock? This approach was tried. The results were not good.

Fine-grained locking adds overhead to every object operation. Creating an object, accessing an attribute, calling a method, all would require acquiring and releasing locks. Benchmarks showed single-threaded code running 2x slower. Since most Python programs are single-threaded or I/O-bound, this trade-off was rejected.

The GIL also simplifies C extension development. Extension authors can assume their code runs with exclusive access to Python objects. Without this guarantee, every C extension would need careful thread-safety analysis.

### Historical Context

Guido van Rossum, Python's creator, made this decision in the early 1990s when single-core machines were the norm. The GIL was a reasonable trade-off: simple implementation, fast single-threaded performance, easy C extensions. Parallel computing was niche.

Today, with ubiquitous multi-core processors, the GIL is increasingly problematic. But removing it while maintaining backward compatibility has proven extremely difficult. Every attempt so far has either slowed single-threaded code significantly or broken existing C extensions.

# How the GIL Works

The GIL is not acquired once and held forever. Python releases and reacquires it periodically, giving other threads a chance to run.

### The Check Interval

In Python 3.2+, the interpreter uses a time-based switching mechanism. By default, a thread can hold the GIL for at most 5 milliseconds before the interpreter sets a flag requesting release. When the running thread checks this flag (at bytecode boundaries), it releases the GIL.

You can inspect and modify the switch interval using the `sys` module:

The default 5ms interval works well for most applications. Lowering it increases thread responsiveness but adds context-switching overhead. Raising it reduces overhead but can make threads feel sluggish. In practice, you rarely need to touch this setting.

One important caveat: the switch interval is a hint, not a guarantee. A thread releases the GIL only at safe points between bytecode instructions. A single complex bytecode operation might hold the GIL longer.

### GIL Release Points

The GIL is released in several situations:

1.  **I/O operations:** Reading from files, network sockets, or pipes
2.  **Sleep:** `time.sleep()` releases the GIL while waiting
3.  **C extensions:** Many C extensions release the GIL during computation
4.  **Check interval:** After approximately 5ms of execution

This sequence diagram shows how I/O enables concurrency. Thread 1 acquires the GIL and runs Python code. When it starts a file read, it releases the GIL and blocks on I/O. Thread 2 seizes the opportunity, acquires the GIL, and runs its code. When Thread 2 hits its check interval or does I/O of its own, it releases. Thread 1, now with data ready, can reacquire and continue. This is why threading works well for I/O-bound programs.

### GIL Acquisition Order

When multiple threads want the GIL, which one gets it? In Python 3.2+, the mechanism was redesigned to be fairer. A waiting thread sends a "drop request" to the holding thread. The holder must release within a short window. If it does not, the requester's priority increases.

This prevents the "convoy effect" where one aggressive thread could monopolize the GIL. But it is not strictly fair, there is still some variation in which thread wins.

# The Impact on Threading

The GIL's impact depends entirely on whether your code is CPU-bound or I/O-bound.

### CPU-Bound vs I/O-Bound

**CPU-bound** code spends most of its time computing: crunching numbers, processing data, running algorithms. The GIL kills parallelism here because all that computation needs the GIL.

**I/O-bound** code spends most of its time waiting: reading files, making HTTP requests, querying databases. The GIL has minimal impact because threads release it while waiting.

The flowchart contrasts two scenarios. On the left, a CPU-bound task runs compute operations back-to-back (red), holding the GIL the entire time. No room for other threads. On the right, an I/O-bound task makes a request (green), waits (orange), then processes (green). During that wait, the GIL is released, letting other threads run. This is why I/O-bound tasks parallelize well with threading.

### Demonstrating the GIL's Impact

Let us see the GIL in action with a benchmark comparing CPU-bound work with and without threading.

**Output:**

The threaded version is actually slower. With 4 threads on a multi-core machine, you might expect a 4x speedup. Instead, the threads compete for the GIL, adding overhead without parallelism. The GIL serializes their execution.

Now compare with an I/O-bound task:

**Output:**

Near-perfect speedup for I/O-bound work. The `sleep()` releases the GIL, allowing all threads to "sleep" concurrently. Real I/O (network requests, file reads) behaves similarly.

# Working Around the GIL

So far, we have established that the GIL limits CPU-bound parallelism. But this does not mean you are stuck. Python provides several ways to achieve true parallelism when you need it. Let us explore each option.

### Option 1: Multiprocessing

The most straightforward workaround is to stop fighting the GIL and use processes instead of threads. The `multiprocessing` module creates separate processes, each with its own Python interpreter and its own GIL. Since the GILs are independent, the processes run truly in parallel.

Let us revisit our CPU-bound benchmark using multiprocessing:

Now we see real speedup. Four processes, each with its own GIL, running on four cores. The trade-off: processes have higher overhead than threads, and sharing data between them requires explicit mechanisms (queues, shared memory, pipes).

### Option 2: C Extensions That Release the GIL

Many performance-critical libraries are written in C and release the GIL during computation. This is actually one of the most elegant solutions because you get parallelism without changing your programming model, you still use threads, but the heavy lifting happens in GIL-free C code.

NumPy is the classic example of this pattern. When you call NumPy's matrix operations, the underlying C code releases the GIL before crunching numbers and reacquires it only when returning to Python:

**Output:**

NumPy's C code releases the GIL during matrix multiplication, enabling real parallelism. This is why data science workflows often scale well with threads despite the GIL. Other libraries that release the GIL include SciPy, scikit-learn, pandas (for some operations), and most numerical computing libraries built on top of NumPy.

### Option 3: asyncio for I/O Concurrency

For I/O-bound code, there is another approach that sidesteps the GIL entirely: `asyncio`. Instead of using threads, asyncio uses a single thread that cooperatively switches between tasks at `await` points. Since there is only one thread, the GIL is never contended.

Here is a simple example showing how three 1-second tasks complete in just 1 second total:

**Output:**

All three tasks start immediately, sleep concurrently, and complete together. asyncio achieves this through cooperative multitasking. When a task hits `await`, it yields control, letting other tasks run. There are no GIL concerns because there is only one thread.

asyncio is ideal for network-heavy applications like web servers, API clients, and crawlers. However, it requires rewriting code to use `async`/`await` syntax, which may not be feasible for existing codebases.

### Option 4: Cython with `nogil`

For custom CPU-bound code where the standard library is not enough, Cython offers a way to write Python-like code that compiles to C and can release the GIL:

The `nogil` declaration tells Cython this function does not touch Python objects and can run without the GIL. This is advanced usage, requiring you to work with C types instead of Python types, but it is powerful when you need to parallelize custom algorithms that cannot leverage existing libraries.

Launching soon
