---
title: "Thread Lifecycle and States"
description: "Thread Lifecycle and States - Concurrency Interview Module 3"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Thread Lifecycle and States

A thread doesn't just run from start to finish in one continuous burst. It moves through different states: waiting to start, actively running, blocked on I/O, waiting for a lock, and eventually terminating.

When your multi-threaded application hangs or behaves unexpectedly, understanding these states is often the key to diagnosing what went wrong.

# What is Thread Lifecycle?

A thread's lifecycle is the sequence of states it passes through from creation to termination. Think of it like the lifecycle of an employee at a company: hired (created), onboarding (ready), actively working (running), waiting for resources or approvals (blocked/waiting), and eventually leaving the company (terminated).

At any given moment, a thread exists in exactly one state. External events and method calls cause transitions between states. The operating system's scheduler decides which runnable threads actually get CPU time.

### Universal Thread States (OS Level)

At the operating system level, threads have these fundamental states:

State

Description

**Ready**

Thread can run, waiting for CPU time

**Running**

Actively executing on a CPU core

**Blocked**

Waiting for I/O, lock, or external event

**Terminated**

Finished execution, cannot run again

Every language's thread states map to these OS-level concepts, but the granularity of exposure varies dramatically. The diagram below shows the complete state model that we'll reference throughout this chapter:

# How Different Languages Model Thread States

Before diving into each state, it's important to understand that languages take fundamentally different approaches to exposing thread states. This isn't just an implementation detail, it reflects different design philosophies.

### Java: The Gold Standard for Introspection

Java provides `Thread.State`, an enum with six values: NEW, RUNNABLE, BLOCKED, WAITING, TIMED\_WAITING, and TERMINATED. You can query any thread's state at any time with `thread.getState()`.

This makes Java excellent for debugging concurrency issues. You can programmatically detect deadlocks by finding threads in BLOCKED state waiting for each other's locks.

### C#: Flags-Based Flexibility

C#'s `ThreadState` is a flags enum, meaning a thread can be in multiple states simultaneously. For example, a background thread that's sleeping might have `ThreadState.WaitSleepJoin | ThreadState.Background`. This is more flexible but requires bitwise operations to check states properly.

### Python and C++: Minimal Exposure

Python's threading module only tells you if a thread `is_alive()`. C++ only tells you if a thread is `joinable()` (started but not yet joined). For detailed state analysis, you need external tools or platform-specific APIs.

### Go: Deliberate Abstraction

Go takes the most radical approach: goroutine states simply aren't exposed. There's no `getState()` method, no state enum, nothing. This is intentional.

Go's philosophy is that if you need to check a goroutine's state, you're probably doing something wrong. Instead of inspecting state, you should:

*   Use channels to communicate completion
*   Use `sync.WaitGroup` to wait for goroutines
*   Use `context.Context` for cancellation

This design pushes you toward patterns that are inherently safer and more composable.

# The Thread States

Now let's examine each state in detail, with code examples showing how to observe or trigger that state in each language.

### State 1: NEW (Created)

A thread in the **NEW** state has been created as an object in memory, but hasn't started executing yet. The operating system hasn't allocated resources for its execution.

In this state:

*   The thread object exists in your program's heap
*   No OS-level thread has been created
*   The thread cannot run any code yet
*   Calling most thread methods will fail or have no effect

### State 2: RUNNABLE (Ready to Run)

Once `start()` is called, the thread moves to the **RUNNABLE** state. The OS has created the thread and it's eligible to run, but it might not be running right now. The scheduler decides which runnable threads get CPU time.

In this state:

*   The OS thread exists and is scheduled
*   The thread may or may not be currently executing
*   It's competing with other threads for CPU time
*   The scheduler can preempt it at any time

### State 3: RUNNING (Executing)

A thread is **RUNNING** when it's actively executing instructions on a CPU core. This is a sub-state of RUNNABLE in most models. The thread has been selected by the scheduler and is consuming CPU cycles.

A thread leaves the RUNNING state when:

*   Its time slice expires (preemption)
*   It voluntarily yields
*   It blocks on I/O or synchronization
*   It terminates

The scheduler continuously moves threads between RUNNABLE and RUNNING. On a 4-core machine, at most 4 threads can be RUNNING simultaneously. Others wait in the runnable queue.

In this example:

*   **Threads X and Y** are RUNNING (assigned to cores, shown in green)
*   **Threads A-E** are RUNNABLE (waiting in queue, shown in orange)
*   **Cores 3-4** are idle (shown in gray)

Why can't most languages distinguish RUNNING from RUNNABLE?

The distinction between "ready to run" and "actually running" exists at the OS level, but user-space programs typically can't observe it reliably.

By the time you query a thread's state and receive the answer, the thread may have been preempted or resumed multiple times. Java, C#, Python, and Go all combine these into a single "alive and not blocked" concept.

### State 4: BLOCKED (Waiting for Lock)

A thread enters the **BLOCKED** state when it tries to acquire a lock (monitor) that another thread holds. It cannot proceed until the lock becomes available.

This is different from WAITING. BLOCKED specifically means "waiting to enter a synchronized block or method." The thread isn't waiting for a signal; it's waiting for exclusive access to a resource.

### State 5: WAITING (Indefinite Wait)

A thread enters the **WAITING** state when it explicitly waits for another thread to perform an action. Unlike BLOCKED, the thread isn't competing for a lock; it's parked until signaled.

Common triggers for WAITING:

*   Java: `Object.wait()`, `Thread.join()`, `LockSupport.park()`
*   C#: `Monitor.Wait()`, `Thread.Join()`, `ManualResetEvent.WaitOne()`
*   Python: `Condition.wait()`, `Thread.join()`, `Event.wait()`
*   C++: `condition_variable.wait()`, `thread.join()`
*   Go: Blocking channel receive, `sync.WaitGroup.Wait()`

The thread will stay in WAITING forever unless another thread wakes it up.

### State 6: TIMED\_WAITING (Bounded Wait)

**TIMED\_WAITING** is similar to WAITING, but with a timeout. The thread will wake up either when signaled or when the timeout expires, whichever comes first.

Common triggers:

*   Java: `Thread.sleep(millis)`, `Object.wait(millis)`, `Thread.join(millis)`
*   C#: `Thread.Sleep(millis)`, `Monitor.Wait(obj, millis)`, `Thread.Join(millis)`
*   Python: `time.sleep(secs)`, `Condition.wait(timeout)`, `Thread.join(timeout)`
*   C++: `sleep_for()`, `wait_for()`, `join()` doesn't have native timeout
*   Go: `time.Sleep()`, `select` with timeout, `context.WithTimeout()`

### State 7: TERMINATED (Dead)

A thread enters the **TERMINATED** state when its execution completes, either normally or by throwing an uncaught exception. The thread can never run again. Its resources are released.

In this state:

*   The thread has finished executing
*   The OS thread no longer exists
*   `isAlive()` returns false
*   The Thread object may still exist in memory
*   Calling `start()` again throws an exception

# State Transitions Summary

From State

To State

Trigger

NEW

RUNNABLE

`start()` / `Start()` called

RUNNABLE

RUNNING

Scheduler assigns CPU

RUNNING

RUNNABLE

Time slice expires, `yield()`

RUNNING

BLOCKED

Attempt to acquire held lock

RUNNING

WAITING

Indefinite wait call (`wait()`, `join()`, channel receive)

RUNNING

TIMED\_WAITING

Bounded wait call (`sleep()`, `wait(timeout)`)

RUNNING

TERMINATED

Execution completes or exception

BLOCKED

RUNNABLE

Lock acquired

WAITING

RUNNABLE

Signaled (`notify()`, channel send, `Pulse()`)

TIMED\_WAITING

RUNNABLE

Timeout expires or signaled

Launching soon
