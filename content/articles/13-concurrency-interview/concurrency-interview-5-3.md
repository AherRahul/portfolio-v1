---
title: "Condition Variables"
description: "Condition Variables - Concurrency Interview Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Condition Variables

Picture this: you have a thread that needs to process data, but the data isn't ready yet. What do you do?

The naive approach is to keep checking in a loop: "Is the data ready? No. Is it ready now? Still no. How about now?"

This busy-waiting approach burns CPU cycles doing absolutely nothing useful. It's like refreshing your email inbox every second waiting for an important message, instead of just letting your phone notify you when it arrives.

Condition variables offer an elegant solution to this problem. They let a thread go to sleep and wait until another thread explicitly wakes it up, signaling that the condition it was waiting for has changed. The waiting thread consumes zero CPU while asleep, and wakes up exactly when needed.

This chapter explores how condition variables work under the hood, why they must always be paired with a mutex, and how to avoid the subtle bugs that can turn condition variable code into a debugging nightmare.

# What is a Condition Variable?

A condition variable is a synchronization primitive that allows threads to wait until a particular condition becomes true. Unlike a semaphore, which signals when a resource counter becomes non-zero, a condition variable signals when any arbitrary predicate, any boolean condition you define, becomes true.

The fundamental insight behind condition variables is the separation of two distinct concerns:

1.  **Protecting shared state** (handled by the mutex)
2.  **Waiting for state changes** (handled by the condition variable)

This separation matters more than it might seem at first. The mutex ensures that only one thread can read or modify the shared state at a time. The condition variable provides an efficient way to wait for that state to change, without burning CPU cycles in a polling loop. Neither primitive alone solves the coordination problem.

A mutex alone would require busy-waiting; waiting alone without mutual exclusion leads to race conditions. Together, they form a complete solution.

To visualize how this works, consider the following diagram. Multiple consumer threads can add themselves to a wait queue, sleeping until a producer thread signals the condition variable. When the producer signals, one of the waiting threads wakes up and can proceed with its work.

In this scenario, Thread 2 and Thread 3 are consumers waiting for data. They've called `wait()` and are now sleeping in the condition variable's wait queue, consuming no CPU time.

Thread 1, the producer, generates data and signals the condition variable. The signal wakes up Thread 2 (chosen arbitrarily from the wait queue), which can then process the data. Thread 3 remains sleeping until another signal arrives.

Notice that the signal doesn't transfer data directly. It simply says "something changed, wake up and check." The woken thread must then examine the shared state to see what changed.

At the API level, a condition variable provides three core operations:

Operation

Description

**wait()**

Release the mutex, sleep until signaled, then reacquire the mutex

**signal() / notify()**

Wake one waiting thread

**broadcast() / notifyAll()**

Wake all waiting threads

Here's the critical point to keep in mind: `wait()` is always called while holding a mutex, and it atomically releases that mutex before sleeping. When the thread wakes up, it reacquires the mutex before returning from `wait()`.

This atomicity is not just a convenience feature. It's fundamental to correctness. Without it, there would be a gap between checking the condition and going to sleep where a signal could arrive and be lost forever. We'll explore exactly why this matters shortly, but for now, remember: the atomic release-and-wait behavior is what makes condition variables safe to use.

# Use-Cases of Condition Variables

Now that we know what condition variables are, let's understand why they're indispensable. The best way to appreciate their value is to see what happens without them.

### The Busy-Wait Problem

Without condition variables, you might write code like this to wait for data:

This looks innocent enough. The logic is correct: keep checking until the condition is true, then proceed. But the execution is disastrous:

*   **CPU waste**: The thread runs at 100% CPU doing nothing useful. On a laptop, this drains battery. On a server, it steals cycles from threads that have actual work to do. The CPU could be running other threads, handling I/O, or simply saving power.
*   **Poor scalability**: If you have 1000 threads all spinning like this, your system grinds to a halt. Each spinning thread consumes a full CPU core's worth of scheduling time.
*   **Priority inversion**: On some systems, this spinning thread might starve the very thread that would set `dataReady = true`, creating a paradoxical deadlock. The producer can't run because the consumer is monopolizing the CPU waiting for the producer.
*   **Heat and power**: In data centers, unnecessary CPU usage translates directly to higher electricity bills and cooling costs. Multiply a few spinning threads across thousands of servers, and you're burning real money.

### The Proper Solution

Condition variables eliminate busy-waiting entirely. Instead of spinning in a loop, the thread tells the operating system "wake me when something changes."

Look at what this code does differently. The thread acquires the mutex, checks the condition, and if the condition is false, calls `wait()`. This is where the magic happens. The `wait()` call releases the mutex (allowing other threads to modify the shared state) and puts the thread to sleep in a single atomic operation.

The thread is now completely dormant, consuming essentially zero CPU. The operating system removes it from the scheduler's run queue entirely.

When the producer sets `dataReady = true` and signals the condition variable, the consumer wakes up, reacquires the mutex, verifies the condition is actually true (more on why this verification is necessary later), and proceeds with its work. The thread went from waiting to working with no wasted cycles in between.

### Common Use Cases

Condition variables appear throughout concurrent programming, often in places you might not immediately recognize. Here are some scenarios where they're the natural choice:

*   **Producer-consumer queues**: Consumers wait for items to appear in a queue, rather than polling it repeatedly. This is perhaps the most common use case and one we'll explore in depth later.
*   **Bounded buffers**: Producers wait when the buffer is full; consumers wait when it's empty. Both directions need coordination, making this a two-condition-variable problem.
*   **Thread pools**: Worker threads sleep until tasks arrive, then wake up to process them. Without condition variables, worker threads would either spin-wait (wasteful) or sleep for fixed intervals (unresponsive).
*   **Barriers**: A group of threads waits until all participants reach a synchronization point before any proceed. The last thread to arrive signals everyone else.
*   **One-time initialization**: Multiple threads might need a resource that takes time to initialize. All wait until initialization completes, then all proceed together.
*   **Resource availability**: Threads wait for a specific resource (like a database connection from a pool) to become free. When a connection is returned to the pool, a waiting thread wakes up to use it.

# How Condition Variables Work

Understanding what happens inside `wait()` and `signal()` is crucial for using condition variables correctly. These operations seem simple on the surface, but their implementation involves careful coordination between the condition variable, the mutex, and the operating system's scheduler.

Let's trace through the lifecycle step by step.

#### **When a thread calls \`wait()\`:**

1.  The thread atomically releases the mutex and adds itself to the condition variable's wait queue. These two operations happen as a single indivisible action. This atomicity is the key to avoiding lost wakeups.
2.  The thread blocks (sleeps) and is removed from the scheduler's run queue. At this point, the thread consumes no CPU time.
3.  When another thread signals, this thread moves from the wait queue to the ready queue, making it eligible to run again.
4.  The thread reacquires the mutex. This might involve waiting if another thread currently holds it. The thread won't proceed until it has the mutex.
5.  Finally, `wait()` returns and the thread continues execution, now holding the mutex.

#### **When a thread calls \`signal()\`:**

1.  If threads are waiting in the condition variable's queue, one is selected. The selection policy varies by implementation; some use FIFO ordering, others don't guarantee any particular order.
2.  That thread moves from the wait queue to the ready queue.
3.  The signaled thread will compete for the mutex when the scheduler runs it. Importantly, the signaling thread might still hold the mutex, in which case the awakened thread will block on the mutex.

The following state diagram shows the lifecycle of a thread using a condition variable.

The diagram shows how a thread starts by acquiring the mutex (green state), then enters the waiting state (orange) when it calls `wait()`. A signal moves it to the signaled state (blue), but it must reacquire the mutex before returning to active execution. This mutex reacquisition is automatic but might involve waiting if other threads hold the mutex.

One subtle point: the signaled state is transient. The thread doesn't do any work there; it's just waiting to reacquire the mutex. Only after successfully reacquiring the mutex does the thread return from `wait()` and continue executing user code. This means there's always a window between being signaled and actually running where other things can happen, which is why the while loop is essential.

### Why use the Mutex?

This is one of the most important concepts to understand, and one that often confuses newcomers. Condition variables must always be used with a mutex. This isn't just a convention or a best practice; it's a fundamental requirement for correctness.

**Without a mutex, you get a race condition.**

To understand why, consider what happens when a consumer checks the condition and then waits, without holding a lock.

Between step 1 (checking the condition) and step 4 (waiting), the producer ran, set the data, and signaled. But the consumer wasn't in the wait queue yet when the signal arrived. This is the critical window: the consumer has decided it needs to wait, but hasn't actually started waiting yet. The signal arrives during this gap and vanishes into the void.

Signals don't queue up or persist. They're like shouting into a room: if no one is listening, the message is lost. Signals only wake threads that are already waiting. So the consumer misses the signal entirely and sleeps forever, waiting for a signal that already happened.

This is called the **lost wakeup problem**, and it's a classic concurrency bug. Programs with lost wakeups often work fine under light load (the timing doesn't align to expose the bug) but hang mysteriously under heavy load or in production.

**With a mutex, this race cannot happen:**

The key is step 3. The `wait()` operation atomically releases the mutex and adds the thread to the wait queue. "Atomically" means these two things happen as an inseparable unit. There's no window between releasing the mutex and being in the wait queue where a signal could slip through unnoticed.

While the consumer holds the mutex (steps 1-3), the producer can't acquire it (it blocks at step 4). Once the consumer enters the wait queue and releases the mutex, the producer can proceed. When the producer signals, the consumer is guaranteed to be waiting and will receive the signal.

### The Wait Internals

Let's look more closely at what `wait()` does internally. Understanding these mechanics helps you reason about timing, predict behavior under edge cases, and debug problems when they arise. The following flowchart breaks down the operation into its component steps:

First, adding to the wait queue and releasing the mutex (steps B and C) happen atomically, preventing lost wakeups. Second, after being signaled (step D), the thread doesn't immediately return from `wait()`. It must first reacquire the mutex (step F), which might involve additional waiting if other threads hold the mutex. Only after successfully reacquiring the mutex does `wait()` return.

This reacquisition requirement explains why you must use a while loop around `wait()`. After reacquiring the mutex, the condition might have changed again, so you must recheck it.

# Condition Variables in Practice

Now that we understand the mechanics, let's see how to use condition variables in real code. Each programming language has its own syntax and idioms, but the underlying pattern is always the same: acquire mutex, check condition in a while loop, wait if false, proceed if true.

### Basic Wait-Notify Pattern

Let's start with the simplest possible use case: one thread waits for another thread to produce some data. This forms the foundation for more complex patterns.

JavaPythonC++C#Go

Java provides two APIs for condition variables: the intrinsic `Object.wait()/notify()` mechanism that works with `synchronized`, and the explicit `Condition` interface that works with `Lock` objects.

#### **Using Object.wait() / notify()**

This approach ties the condition variable to an object's intrinsic lock. Any Java object can serve as both a lock (via `synchronized`) and a condition variable (via `wait()`/`notify()`).

Let's trace through what happens in this code:

1.  **Consumer calls \`waitForData()\`**: It enters the synchronized block, acquiring the intrinsic lock on the `lock` object.
2.  **Consumer checks \`dataReady\`**: If false, it calls `wait()`.
3.  **\`wait()\` releases the lock and sleeps**: Now other threads can acquire the lock.
4.  **Producer calls \`provideData()\`**: It acquires the lock, sets the data, sets `dataReady = true`, and calls `notify()`.
5.  **\`notify()\` wakes the consumer**: The consumer moves to the ready queue but still needs the lock.
6.  **Producer exits synchronized block**: This releases the lock.
7.  **Consumer reacquires the lock**: Now it can continue from where it left off in the while loop.
8.  **Consumer rechecks \`dataReady\`**: It's now true, so the loop exits and the consumer processes the data.

The key insight is that `wait()` always releases the lock before sleeping and reacquires it before returning. This all happens automatically within the `wait()` call.

#### **Using Condition interface (preferred for new code)**

The explicit `Condition` interface offers more flexibility, including the ability to have multiple conditions associated with a single lock.

The pattern is almost identical, but notice a few differences. The lock is explicitly created as a `ReentrantLock`, and the condition is created from the lock via `lock.newCondition()`. The try/finally block ensures the lock is always released, even if an exception occurs.

This explicit approach has a significant advantage: you can create multiple condition objects associated with the same lock. For instance, a bounded buffer might have `notEmpty` (for consumers to wait on) and `notFull` (for producers to wait on), both protected by the same lock.

# Example: Producer-Consumer with Bounded Buffer

The bounded buffer is the classic condition variable example, and for good reason: it elegantly demonstrates why you might need multiple conditions. A bounded buffer is a fixed-size queue where producers add items and consumers remove them.

The interesting constraint: producers must wait when the buffer is full, and consumers must wait when it's empty. This bidirectional waiting can't be elegantly solved with a single condition variable. You need two: one for "buffer has space" and one for "buffer has items."

JavaPythonC++C#Go

Let's examine the structure of this implementation:

**Two separate condition variables**: `notFull` for producers waiting for space, and `notEmpty` for consumers waiting for items. Both conditions share the same lock because they protect the same shared state (the buffer).

**The \`put()\` method**: A producer acquires the lock, checks if the buffer is at capacity, and waits on `notFull` if it is. Once space is available (either immediately or after waking), it adds the item and signals `notEmpty` to wake any waiting consumers.

**The \`take()\` method**: A consumer acquires the lock, checks if the buffer is empty, and waits on `notEmpty` if it is. Once an item is available, it removes it and signals `notFull` to wake any waiting producers.

With a slow consumer (the `Thread.sleep(100)`), the producer will quickly fill the buffer and then block on `notFull.await()`. Each time the consumer removes an item, it signals `notFull`, allowing the producer to add one more item. The flow self-regulates.

Why use two conditions instead of one?

Efficiency. When a producer adds an item, only consumers need to wake up. When a consumer removes an item, only producers need to wake up. If we used a single condition variable and called `signalAll()` after each operation, we'd potentially wake threads that still can't proceed.

For example, if the buffer is full and a consumer takes one item, waking all waiting producers just to have most of them go back to sleep is wasteful.

### Sequence Diagram: Producer-Consumer Flow

To solidify understanding, let's trace through a complete interaction between a producer, a bounded buffer, and a consumer. Reading code is one thing; seeing the temporal flow of operations is another. This sequence diagram shows the timeline of operations and how the threads coordinate, including what happens when both the "buffer empty" and "buffer full" conditions come into play.

Let's walk through this timeline:

1.  **Consumer arrives first**: The buffer is empty, so the consumer has nothing to take. It calls `take()`, sees the buffer is empty, and waits on `notEmpty`.
2.  **Producer adds item1**: The producer calls `put(item1)`. The buffer now has one item. The producer signals `notEmpty`, waking the consumer.
3.  **Consumer wakes and retrieves item1**: The consumer reacquires the lock, rechecks the condition (buffer is not empty), and returns item1.
4.  **Producer fills the buffer**: The producer adds items 2 through 5. The buffer reaches capacity (5 items).
5.  **Producer tries to add item6**: The buffer is full, so the producer waits on `notFull`.
6.  **Consumer takes an item**: The consumer removes an item, creating space. It signals `notFull`, waking the producer.
7.  **Producer wakes and adds item6**: The producer reacquires the lock, rechecks the condition (buffer is not full), and successfully adds item6.

This dance continues as long as producers and consumers are active, with the buffer serving as a shock absorber between different processing speeds.

# Performance Considerations

Condition variables are already far more efficient than busy-waiting, but there's still room for optimization. The main performance considerations involve choosing between `signal()` and `broadcast()`, and minimizing lock contention after wakeups.

### Signal vs Broadcast

Operation

Behavior

Use When

`signal()` / `notify()`

Wake one thread

Only one thread can proceed

`broadcast()` / `notifyAll()`

Wake all threads

Multiple threads might proceed, or using single condition for multiple predicates

**The Thundering Herd Problem:** If you use `broadcast()` when only one thread can proceed, N-1 threads wake up, check the condition, find it false, and go back to sleep. This wastes CPU cycles and creates lock contention. All N threads try to acquire the mutex one by one, only to find they have nothing to do. With hundreds of waiting threads, this can cause noticeable latency spikes.

**When to use broadcast/notifyAll:**

*   The condition change allows multiple threads to proceed (e.g., adding multiple items to a queue)
*   You're using a single condition variable for multiple predicates (not recommended, but sometimes unavoidable)
*   You're shutting down and all threads should wake to check a shutdown flag

### Lock Contention

Every thread that wakes up from a condition variable must reacquire the mutex before proceeding. With many waiters, this creates a serialization bottleneck. The following diagram shows what happens when multiple threads wake up simultaneously:

This diagram illustrates the serialization that occurs after a `notifyAll()`. Each thread must acquire the lock one at a time, check its condition, and either proceed or go back to waiting. With many threads, this serialization becomes a bottleneck.

Strategies to reduce contention:

*   Use `signal()` instead of `broadcast()` when only one thread can proceed
*   Use multiple condition variables to partition waiters
*   Consider lock-free alternatives for extremely high-performance scenarios

### Optimization: Unlock Before Notify (C++)

In C++, you can unlock the mutex before calling `notify_one()`:

This is a minor optimization. If you notify while holding the lock, the notified thread wakes up but immediately blocks trying to acquire the mutex (which you still hold). By unlocking first, the notified thread can acquire the mutex without this extra context switch.

The optimization is minor because modern schedulers handle this case efficiently, but it doesn't hurt and follows the principle of holding locks for the minimum necessary time.

# Implementing a Semaphore with Condition Variables

To demonstrate condition variables in action and reinforce the concepts, let's implement a semaphore from scratch. This exercise is valuable for two reasons: it shows how higher-level synchronization primitives can be built from lower-level ones, and it's a common interview question.

A semaphore maintains a permit count. `acquire()` decrements the count (waiting if it's zero), and `release()` increments it (waking a waiter if any exist). If you've followed the chapter so far, this implementation should feel natural.

The implementation is straightforward: `acquire()` waits while count is zero, then decrements; `release()` increments and signals. The while loop in `acquire()` handles spurious wakeups.

# Quiz

## Quiz: Condition Variables

1 / 8

Multiple Choice

What is a condition variable?

PreviousNext

Launching soon
