---
title: "Print Foo Bar Alternately"
description: "Print Foo Bar Alternately - Concurrency Interview Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Print Foo Bar Alternately

The **Print FooBar Alternately** problem is a simple concurrency challenge. Two threads must coordinate to print **"foo"** and **"bar"** in strict alternation: **foobarfoobarfoobar**.

Despite its simplicity, it tests your understanding of thread synchronization at a fundamental level. There's no complex resource sharing, no deadlock risk from circular dependencies, just two threads that need to take turns.

This makes it an excellent starting point for understanding synchronization primitives before tackling more complex problems like Dining Philosophers or the Bounded Buffer.

# Problem Statement

Two methods, `foo()` and `bar()`, are called by two separate threads. The `foo()` method prints "foo" and the `bar()` method prints "bar".

Design a mechanism so that the output is always "foobar" repeated n times.

#### The Setup

You have two threads running simultaneously, each with a simple job.

1.  **Thread 1:** Calls `foo()` in a loop n times. Each call should print "foo".
2.  **Thread 2:** Calls `bar()` in a loop n times. Each call should print "bar".
3.  **Output:** Must be exactly "foobarfoobar...foobar" (n repetitions).

The catch? These threads start concurrently and can be scheduled in any order by the operating system. Without synchronization, you might get "barfoo", "foofoofoobarbar", or any chaotic interleaving.

#### The Rules

With the setup clear, here are the ordering constraints that make this problem interesting.

1.  "foo" must always print before "bar" in each pair.
2.  "bar" must always print before the next "foo".
3.  Both threads run n iterations.
4.  The threads start concurrently and may be scheduled in any order.

These rules define a strict alternation: foo, bar, foo, bar, foo, bar. Any deviation, like two consecutive foos or bars printing, means your solution is broken.

### The Goal

So what does a correct solution look like?

We need to design a synchronization mechanism that achieves all of these properties.

*   **Correct ordering:** Output is exactly "foobar" repeated n times.
*   **No deadlock:** Both threads complete their n iterations.
*   **Efficient:** Threads don't busy-wait or waste CPU cycles.

The following diagram shows this ping-pong pattern in action.

Notice how each thread, after printing, explicitly hands off control to the other. Thread 1 prints, then signals Thread 2. Thread 2 prints, then signals Thread 1. This ping-pong continues for n iterations until both threads complete.

### Real-World Analogies

The FooBar problem distills synchronization to its essence: turn-taking. Many real-world systems require this exact pattern:

*   **Protocol handshakes:** Client sends request, waits for response, then sends next request.
*   **Pipeline stages:** Stage 1 produces output, Stage 2 consumes it, Stage 1 waits until Stage 2 is ready.
*   **GUI event loops:** UI thread updates display, worker thread processes, UI thread updates again.
*   **Game loops:** Physics step, then render step, alternating each frame.

# Synchronization Challenges

Before jumping into solutions, let's understand what makes this problem tricky.

### Challenge 1: Ordering Without Races

The most obvious approach is using a shared flag: `if (flag == FOO_TURN) print("foo"); flag = BAR_TURN;`. But this naive implementation has race conditions hiding in plain sight. Thread 2 might check the flag just as Thread 1 is modifying it, or both threads might read the old value simultaneously before either updates it.

The diagram below shows how this race can manifest.

The problem is that checking the flag and acting on it aren't atomic. Between the check and the action, the other thread might change things.

### Challenge 2: Busy Waiting

Even if we correctly use atomic operations to avoid the race, there's another issue. A spin loop wastes CPU cycles.

With two threads on a single-core CPU, this is particularly wasteful. While one thread spins checking the flag over and over, the other thread, which could actually make progress, can't run because the CPU is busy spinning. Even on multi-core systems, spinning wastes power and generates heat.

The question becomes: how do we make a thread _sleep_ until it's their turn, rather than constantly checking?

### Challenge 3: Lost Signal

This brings us to the trickiest challenge. With condition variables, we might signal before the other thread starts waiting. If Thread 1 signals "bar's turn" before Thread 2 calls `wait()`, the signal is lost. Thread 2 then waits forever for a signal that already happened.

This "lost wakeup" problem is subtle because it depends on timing. Your code might work 99% of the time in testing, then fail in production when thread scheduling is slightly different.

### Analysis Criteria

When evaluating solutions, we'll check each approach against these properties.

Property

Definition

Why It Matters

**Correct ordering**

Output is exactly "foobar" n times

Functional correctness

**Deadlock-free**

Both threads complete

System liveness

**No busy waiting**

Threads sleep when blocked

CPU efficiency

**Simple**

Easy to understand and maintain

Engineering practicality

Now let's see how different approaches stack up against these criteria.

# Solution 1: Naive Approach (Busy Waiting with Flag)

Let's start with the simplest possible approach: use a shared flag and spin until it's your turn.

### Approach

The idea is straightforward. We maintain a boolean flag indicating whose turn it is. Each thread spins in a loop, checking the flag. When it becomes your turn, you print and flip the flag.

1.  Shared boolean flag indicates whose turn it is.
2.  Each thread spins checking the flag.
3.  When it's your turn, print and flip the flag.

The state machine below shows this simple alternation.

Now let's see what this looks like in code.

### Implementation

### Analysis

Property

Status

Explanation

Correct ordering

Yes

Flag ensures strict alternation

Deadlock-free

Yes

No circular dependencies

No busy waiting

No

Spin loop wastes CPU

Simple

Yes

Easy to understand

### The Problem

This solution is correct but inefficient. The issue is that while one thread is waiting for its turn, it's constantly checking the flag in a tight loop. This is called "busy waiting" or "spinning."

On a single-core machine, the spinning thread prevents the other thread from running. Thread 1 spins, consuming the CPU. Thread 2, which could actually make progress and flip the flag, can't get scheduled. The OS eventually preempts Thread 1, but we've wasted a lot of CPU time.

Even on multi-core machines, spinning wastes power and generates heat. For n = 1000, we might waste millions of CPU cycles just checking a flag. In a production system, this would show up as high CPU usage for no useful work.

The solution works, and it's worth understanding, but interviewers will expect you to recognize its limitations. That's where our next solution comes in.

# Solution 2: Semaphore-Based Solution

The busy-wait solution wastes CPU because threads spin instead of sleeping. Semaphores solve this by letting threads block efficiently. The OS puts a blocked thread to sleep, freeing the CPU for other work, and wakes it when the semaphore is released.

### Key Insight

Think of semaphores as tickets or permits. A thread that calls `acquire()` needs a permit to proceed. If none is available, the thread sleeps. A thread that calls `release()` adds a permit, potentially waking a sleeping thread.

For FooBar, imagine a single baton being passed back and forth. Foo starts with the baton, prints, hands it to bar. Bar prints, hands it back to foo. We model this with two semaphores: foo starts with one permit, bar starts with zero.

### Approach

Here's how the semaphore handoff works.

1.  **fooSemaphore:** Initialized to 1 (foo can proceed immediately).
2.  **barSemaphore:** Initialized to 0 (bar must wait).
3.  Foo acquires fooSemaphore, prints, releases barSemaphore.
4.  Bar acquires barSemaphore, prints, releases fooSemaphore.

Why these specific initial values? Think about it: we want foo to go first. If fooSemaphore starts at 1, foo can acquire it immediately. If barSemaphore starts at 0, bar blocks immediately and waits for foo to release it. This exactly models "foo goes first."

### Implementation

### Analysis

Property

Status

Explanation

Correct ordering

Yes

Semaphore handoff ensures alternation

Deadlock-free

Yes

Linear dependency, no cycle

No busy waiting

Yes

Semaphores block efficiently

Simple

Yes

Elegant ping-pong pattern

### Why This Works

The semaphore solution is elegant because it directly models the turn-taking. At any moment, the sum of `fooSemaphore.permits + barSemaphore.permits` is always 1. Exactly one thread can proceed at any time. There's no possibility of both threads printing simultaneously or either thread printing twice in a row.

There's also no risk of lost signals. Unlike condition variables, semaphore permits are "sticky." If foo releases barSemaphore before bar calls acquire, the permit is stored. When bar eventually calls acquire, it gets the permit immediately. This solves the lost wakeup problem elegantly.

# Solution 3: Condition Variable Solution

Condition variables offer more flexibility when the synchronization condition is complex. For FooBar, they're overkill, but understanding this solution helps with harder problems where conditions can't be modeled as simple permit counts.

### Key Insight

A condition variable lets a thread wait until some condition is true, and another thread signals when the condition changes. The pattern is always: acquire lock, check condition in a loop, if false then wait (which releases the lock and sleeps), when woken re-check the condition.

For FooBar, we combine a condition variable with a boolean flag indicating whose turn it is. Each thread waits until the flag says it's their turn.

### Approach

Here's how the pieces fit together.

1.  **Lock + Condition:** Protects and signals turn changes.
2.  **fooTurn flag:** Boolean indicating whose turn it is.
3.  Each thread waits on the condition until it's their turn.
4.  After printing, flip the flag and signal the other thread.

The critical insight is the `while` loop around the wait. We check the condition, and if it's not our turn, we wait. When we wake up, we check again. This handles spurious wakeups, where a thread might wake without being signaled.

Notice the loop: if `fooTurn` is false, we wait. When signaled, we loop back and check again. Only when `fooTurn` is true do we proceed to print.

### Implementation

#### Code Walkthrough

Let's look at the key synchronization points in this solution, because they're easy to get wrong.

1.  **while loop for wait:** We use `while`, not `if`, because of spurious wakeups. A thread might wake up even when it's not its turn. The while loop ensures we re-check the condition after every wakeup.
2.  **Lock held during check and modify:** The lock protects both the condition check and the flag modification. This ensures atomicity: no thread can see a partially-updated state.
3.  **Signal after flip:** We signal after changing the flag so the other thread sees the updated value when it wakes. If we signaled before flipping, the woken thread might see the old value and go back to waiting.

### Analysis

Property

Status

Explanation

Correct ordering

Yes

Flag and condition ensure alternation

Deadlock-free

Yes

Linear dependency, no cycle

No busy waiting

Yes

Condition variables block efficiently

Simple

Medium

More verbose than semaphores

### Correctness Argument

Why does this solution work? Let's trace through the logic.

1.  **Mutual Exclusion:** Only one thread holds the lock at a time, so only one can print.
2.  **Progress:** After each print, the flag flips and a signal is sent, guaranteeing the other thread can proceed.
3.  **No Lost Wakeup:** The while loop re-checks the condition after waking. Even if a signal is missed, the thread will check the flag on the next iteration.

The condition variable solution is more verbose than semaphores for this problem, but it demonstrates understanding of the wait-notify pattern. For more complex problems where the condition isn't a simple permit count, condition variables become essential.

# Solution Comparison

We've seen three approaches to the FooBar problem. Here's how they compare across our evaluation criteria.

Approach

Correct

No Busy Wait

Efficiency

Complexity

Best For

Naive (flag + spin)

Yes

No

Low

Simple

Quick prototype

Semaphore-based

Yes

Yes

High

Simple

Interview answer

Condition variable

Yes

Yes

High

Medium

Complex conditions

Recommendation

Use the semaphore solution for interviews. It's elegant, efficient, and shows mastery of semaphore semantics. The condition variable solution is equally valid and demonstrates understanding of the wait-notify pattern, which is useful for more complex problems where the condition can't be expressed as a permit count.

If time permits in an interview, mention that you know both approaches and explain when you'd choose each. This shows depth of understanding.

# Alternative Solutions

Beyond the main three approaches, there are variations worth knowing for interviews. Let's explore two useful alternatives.

### Alternative 1: Using Lock-Free with Yield

For situations where you want to avoid the overhead of semaphores but can't accept pure spinning, you can use yield. This gives up the CPU instead of spinning in a tight loop.

**When to prefer:** When you need lock-free behavior and can tolerate some CPU overhead. Better than pure spinning but not as efficient as semaphores. This is a good middle ground when blocking primitives aren't available or are too expensive.

### Alternative 2: Using Barrier (for extension to N threads)

The barrier-based solution is elegant, but what if we need to extend the problem to more threads? That's where barriers shine. If the problem extends to N threads printing in sequence, a barrier-based approach generalizes better.

**When to prefer:** When extending to more threads (FooBarBaz with 3 threads) or when all threads need to synchronize at each step. Barriers ensure all participants reach the synchronization point before any can proceed.

Launching soon
