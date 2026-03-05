---
title: "Fizz Buzz Multithreaded"
description: "Fizz Buzz Multithreaded - Concurrency Interview Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Fizz Buzz Multithreaded

In the **Fizz Buzz Multithreaded** problem you have four threads: one for "fizz", one for "buzz", one for "fizzbuzz", and one for regular numbers. Only the correct thread should print for each number, and they must print in order.

What makes this problem fascinating is the conditional activation pattern. Unlike Zero-Even-Odd where the condition is simple alternation, here the condition depends on divisibility rules that interact in complex ways.

A number divisible by 15 shouldn't trigger the fizz or buzz threads, only fizzbuzz. Getting this dispatch logic right while maintaining strict ordering is the core challenge.

# Problem Statement

You're given four thread functions: `fizz()`, `buzz()`, `fizzbuzz()`, and `number()`. Your job is to design a synchronization mechanism so they cooperate to print the FizzBuzz sequence from 1 to n.

#### The Setup

Each thread has a specific responsibility in this printing relay. Here's what each one handles:

1.  **Thread 1 (fizz):** Prints "fizz" for numbers divisible by 3 but not 5. These are 3, 6, 9, 12, but notably NOT 15 or 30.
2.  **Thread 2 (buzz):** Prints "buzz" for numbers divisible by 5 but not 3. These are 5, 10, 20, 25, but notably NOT 15 or 30.
3.  **Thread 3 (fizzbuzz):** Prints "fizzbuzz" for numbers divisible by both 3 and 5, which means divisible by 15. These are 15, 30, 45, 60.
4.  **Thread 4 (number):** Prints the number itself when it's not divisible by either 3 or 5. These are 1, 2, 4, 7, 8, 11, 13, 14.
5.  **Output:** For n=15, the output must be exactly "1, 2, fizz, 4, buzz, fizz, 7, 8, fizz, buzz, 11, fizz, 13, 14, fizzbuzz".

Notice how the threads have vastly different workloads. For n=15, the number thread prints 8 times, fizz prints 4 times, buzz prints 2 times, and fizzbuzz prints just once. This asymmetry will matter when we think about termination.

#### The Rules

Understanding the rules helps clarify why this problem is trickier than it appears:

1.  **Sequential processing:** Numbers 1 to n must be processed in order. You can't have thread 2 print "buzz" for 5 while thread 1 is still thinking about 3.
2.  **Exclusive activation:** Each number activates exactly one thread. No two threads should try to print for the same number.
3.  **Priority in checks:** Here's the subtle part. You must check divisibility by 15 BEFORE checking 3 or 5. Why? Because 15 is divisible by 3. If you check 3 first, 15 would incorrectly trigger fizz.
4.  **Strict ordering:** Output must appear in ascending numerical order. This means each thread must wait its turn, even if it's ready to print.

The priority point deserves emphasis because it's the most common interview mistake.

#### The Goal

With those rules in mind, our synchronization mechanism needs to guarantee four properties:

*   **Correct output:** Each number prints from the correct thread.
*   **Correct ordering:** Output is in ascending order (1, 2, 3, ..., n).
*   **No deadlock:** All threads complete after processing n numbers.
*   **Efficient:** Minimal CPU waste from spinning or wrong wakeups.

The diagram below shows how the dispatch decision works for each number. Notice the check order: 15 first, then 3, then 5, then the catch-all for numbers.

The check order in the diagram is critical. For the number 15: checking `15 % 15 == 0` first correctly routes to fizzbuzz. If we checked `15 % 3 == 0` first, we'd incorrectly route to fizz. This is why the if-else chain must be ordered by specificity, with the most restrictive condition (divisible by 15) checked first.

The Fizz Buzz Multithreaded problem teaches condition-based thread dispatch, a pattern that appears throughout real systems:

*   **Event routing:** A message arrives, and based on its type, one of several handlers processes it.
*   **Load balancing:** Requests are routed to different server pools based on URL patterns.
*   **Protocol handlers:** Network packets go to different threads based on protocol type.
*   **Worker specialization:** Different workers handle different task types in a job queue.

### Real-World Analogies

Problem Element

Real-World Equivalent

Number to process

Incoming request/event

Divisibility check

Request classifier/router

Four threads

Specialized handlers

Strict ordering

Sequential event processing

# Synchronization Challenges

Before we jump into code, let's understand the specific obstacles that make this problem interesting. Each challenge builds on concepts we've seen before, but the combination creates unique difficulties.

### Challenge 1: Divisibility-Based Dispatch

Unlike the FooBar problem where threads simply alternate, or Zero-Even-Odd where the condition is "even or odd," FizzBuzz requires evaluating a mathematical property that has overlapping cases. The dispatch isn't just "which thread's turn is it?" but "given the current number, which of four conditions applies?"

The state machine below shows how this works. From a waiting state, the system evaluates the current number and transitions to exactly one of four active states:

The key insight here is that the transitions from WAIT are mutually exclusive. For any given number, exactly one transition fires. But implementing this requires a controller that evaluates the condition and signals the appropriate thread.

### Challenge 2: The Controller Pattern

In simpler problems like FooBar, each thread knows when it's their turn based on simple state. Thread A prints when `turn == 0`, thread B when `turn == 1`. But in FizzBuzz, threads can't easily determine their own eligibility. The fizz thread would need to check `current % 3 == 0 && current % 5 != 0`, but what prevents multiple threads from reading `current` simultaneously and racing?

There are two approaches to this controller dilemma:

**Approach 1: Distributed Control.** Each thread spins, reads the current number, evaluates its own condition, and prints if matched. This is simple but wasteful. All four threads are constantly checking, and we need careful synchronization to prevent races on the increment.

**Approach 2: Centralized Control.** One entity (either a dedicated coordinator or the thread that just printed) evaluates the condition and explicitly signals the next thread. Only the signaled thread wakes up. This is more efficient but requires careful design to ensure the signal chain never breaks.

Most elegant solutions use Approach 2, where each thread after printing evaluates which thread should go next and signals it directly.

### Challenge 3: Asymmetric Iteration Counts

Here's a subtlety that catches many candidates. For n=15:

*   The fizzbuzz thread prints 1 time (just 15)
*   The fizz thread prints 4 times (3, 6, 9, 12)
*   The buzz thread prints 2 times (5, 10)
*   The number thread prints 8 times (1, 2, 4, 7, 8, 11, 13, 14)

So the fizzbuzz thread finishes its work after just one print, while the number thread is still going strong. If fizzbuzz exits its loop early, who signals the remaining threads? If it stays in its loop waiting, it needs to wake up when the sequence is complete to terminate cleanly.

This asymmetry means we can't give each thread a fixed iteration count. Each thread must loop until `current > n` and must be signaled even when there's no more work for it, just so it can check the termination condition and exit.

### Challenge 4: Termination Signaling

Termination is where many solutions fail. When the last number (n) is printed, the printing thread increments the counter to n+1. At this point, three threads are waiting on their semaphores or conditions. If we don't signal them, they wait forever, and the program hangs.

The solution is elegant but easy to forget: when `current > n`, release all semaphores (or signal all conditions). Each waiting thread wakes up, checks `current > n`, and exits its loop. Without this "everyone wake up and go home" signal, deadlock is guaranteed.

### Analysis Criteria

With these challenges in mind, here's how we'll evaluate each solution:

Property

Definition

Why It Matters

**Correct output**

Right thread prints for each number

Functional correctness

**Correct ordering**

Numbers printed in sequence

FizzBuzz definition

**Deadlock-free**

All threads complete

System liveness

**Efficient dispatch**

Only the right thread wakes

Performance

# Solution 1: Naive Approach (Busy Waiting with Shared Counter)

Let's start with the simplest possible approach to understand why it doesn't work well. The idea is straightforward: all threads spin on a shared counter, and each thread checks if the current number matches its condition.

### Approach

1.  Shared counter `current` starts at 1.
2.  Each thread spins until `current` matches its condition.
3.  When matched, print and increment `current`.
4.  Use atomic operations to prevent races on increment.

### Implementation

### Analysis

Property

Status

Explanation

Correct output

Yes

Each thread checks its condition

Correct ordering

Yes

Shared counter ensures sequence

Deadlock-free

Yes

No blocking, just spinning

Efficient dispatch

No

All threads spin constantly

### The Problem

The code looks reasonable, but it has two fundamental problems.

#### **Problem 1: Race Condition**

check-then-act pattern isn't atomic. Between reading `current.get()` and calling `current.incrementAndGet()`, another thread might also read the same value. Both threads could see `current == 3`, both check `3 % 3 == 0`, and both try to print. The atomic increment doesn't help because the decision was made on a stale read.

#### **Problem 2: Efficiency**

Even if we fix the race condition, we still have four threads constantly spinning. For each number, three threads waste CPU cycles checking a condition that's guaranteed to be false. If n is 1,000,000, that's roughly 3 million wasted checks.

# Solution 2: Semaphore-Based with Controller

The key insight for an efficient solution is that we can use semaphores as "permission slips." Each thread waits on its own semaphore. After any thread prints, it figures out which thread should go next and releases that thread's semaphore.

This creates a chain where exactly one semaphore has a permit at any time.

### Key Insight

One approach is to have the "number" thread act as a controller. It determines which thread should act for each number and releases the appropriate semaphore. But this has a problem: what if the current number should be printed by number itself? We need a different design.

Better approach: use semaphores where each thread waits, and after any thread prints, it determines and signals the next thread.

### Approach

1.  Four semaphores, one per thread, all initialized to 0.
2.  Start by signaling the appropriate semaphore for number 1 (which is the number thread).
3.  Each thread, after printing, increments the counter and signals the next appropriate thread.
4.  Use a helper method to determine which semaphore to signal.

The diagram shows that initially, only numberSem has a permit (because 1 is not divisible by 3 or 5). As the number thread prints and signals, the permit moves to whichever semaphore should go next.

### Implementation

#### Walking Through the Execution

Let's trace through n=5 to see how the chain works:

1.  **Constructor:** Calls `signalNext(1)`. Since 1 is not divisible by 3 or 5, `numberSem.release()` is called. The number thread now has a permit.
2.  **Number 1:** The number thread acquires its semaphore, prints 1, increments to 2, calls `signalNext(2)`. Since 2 is not divisible by 3 or 5, the number thread gets the permit again.
3.  **Number 2:** The number thread acquires, prints 2, increments to 3, calls `signalNext(3)`. Since 3 % 3 == 0, `fizzSem.release()` is called.
4.  **Number 3:** The fizz thread wakes up, prints "fizz", increments to 4, calls `signalNext(4)`. Since 4 is not divisible by 3 or 5, `numberSem.release()`.
5.  **Number 4:** The number thread prints 4, increments to 5, calls `signalNext(5)`. Since 5 % 5 == 0, `buzzSem.release()`.
6.  **Number 5:** The buzz thread prints "buzz", increments to 6, calls `signalNext(6)`. Since 6 > 5, all four semaphores are released.
7.  **Termination:** All threads wake up, check `current > n`, and exit their loops.

### Analysis

This solution nails all our criteria:

Property

Status

Explanation

Correct output

Yes

signalNext dispatches correctly

Correct ordering

Yes

Only one thread proceeds at a time

Deadlock-free

Yes

Always exactly one permit in the system

Efficient dispatch

Yes

Only the right thread wakes

The semaphore solution is efficient but requires careful tracking of which semaphore to signal. Let's look at an alternative that trades efficiency for simplicity.

# Solution 3: Condition Variable with Predicate

What if we don't want to manage four separate semaphores? We can use a single condition variable where all threads wait, and each thread specifies its own predicate. When the counter changes, we wake all threads and let each one check if it's their turn.

### Approach

All threads share one lock and one condition variable. Each thread has a while loop that waits until either (1) it's their turn based on divisibility, or (2) the sequence is complete. After printing, each thread increments the counter and broadcasts to all threads. Only one thread's predicate will be true, so only one proceeds.

The key difference from the semaphore solution is that we wake ALL threads, not just the right one. Each thread checks its predicate and either proceeds or goes back to waiting.

### Implementation

#### Understanding the Double While Loop

The structure of each thread method might look confusing at first. Let's break down what the nested loops are doing:

The outer loop continues while the sequence is incomplete. The inner loop is the wait condition: we wait as long as (1) the sequence isn't done AND (2) it's not our turn. When we wake up, we must re-check `current > n` because we might have been woken for termination, not because it's our turn.

The `signalAll` after printing wakes all four threads. Three of them will re-check their predicates, find them false, and go back to waiting. One will find its predicate true and proceed. This is less efficient than semaphores (three wasted wakeups per number) but simpler to understand and implement.

### Analysis

Property

Status

Explanation

Correct output

Yes

Predicates ensure correct thread prints

Correct ordering

Yes

Shared counter under lock ensures sequence

Deadlock-free

Yes

signalAll ensures progress

Efficient dispatch

Partial

All threads wake, only one proceeds

### Correctness Argument

1.  **Mutual Exclusion:** Only one thread holds the lock at a time.
2.  **Progress:** After each print, signalAll wakes all waiters. The one whose predicate is true proceeds.
3.  **Termination:** When `current > n`, all threads wake (signalAll), check the condition, and exit.

The condition variable approach has a clear trade-off: simplicity vs. efficiency. For small n, the wasted wakeups don't matter. For large n in a high-performance system, the semaphore approach is better.

# Solution Comparison

Both solutions work correctly, but they have different trade-offs worth understanding.

Approach

Correct

No Busy Wait

Efficiency

Complexity

Naive (spin)

Partial

No

Low

Simple

Semaphore-based

Yes

Yes

High

Medium

Condition variable

Yes

Yes

Medium

Medium

Recommendation

For interviews, I'd recommend starting with the semaphore solution because it demonstrates deeper understanding of synchronization. But be ready to fall back to condition variables if you're running out of time.

The semaphore solution also sets up better for follow-up questions. An interviewer might ask "what if we add a fifth rule?" With semaphores, you add one semaphore and extend signalNext. With condition variables, you add another predicate and hope you get the logic right.

# Alternative Solutions

### Alternative 1: Using Separate Condition Variables

What if we want the simplicity of condition variables but the efficiency of targeted wakeups? We can use four condition variables (one per thread) and a signalNext function that notifies only the right one:

This hybrid approach gives us targeted wakeups (efficient) while using condition variables. It's particularly useful when you want the semantics of conditions (wait with predicate, automatic re-check on spurious wakeup) but the performance of semaphores.

### Alternative 2: Barrier-Based Coordination

Another approach uses a CyclicBarrier where all four threads synchronize at each step, and a coordinator decides who prints:

This approach is conceptually clean: all threads synchronize, one prints, repeat. But it's overkill for this problem because we don't need all threads to coordinate, just one to act. Barriers are better suited for problems where multiple threads need to work in lockstep.

Launching soon
