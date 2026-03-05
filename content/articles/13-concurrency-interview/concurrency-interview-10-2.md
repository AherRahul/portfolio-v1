---
title: "Print Zero Even Odd"
description: "Print Zero Even Odd - Concurrency Interview Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Print Zero Even Odd

The **Print Zero Even Odd** problem takes the simple alternation pattern we saw in FooBar and adds a twist: three threads instead of two, with one thread acting as an interleaver.

What makes this problem interesting is the asymmetry. In FooBar, both threads had the same behavior, just alternating. Here, one thread (zero) runs twice as often as the others, and the odd and even threads must alternate between themselves while both depending on zero.

This mirrors real-world patterns like multiplexing, where one coordinator thread services multiple worker threads in a specific order.

# Problem Statement

Three threads are given: `zero()`, `even()`, and `odd()`. Design a mechanism so they cooperate to print the sequence "0102030405...0n" for a given n.

#### The Setup

Here's what each thread does.

1.  **Thread 1 (zero):** Calls `zero()` in a loop. Each call should print "0".
2.  **Thread 2 (even):** Calls `even()` in a loop. Each call should print an even number (2, 4, 6, ...).
3.  **Thread 3 (odd):** Calls `odd()` in a loop. Each call should print an odd number (1, 3, 5, ...).
4.  **Output:** For n=5, the output must be exactly "0102030405".

Notice the asymmetry: the zero thread runs n times, but odd and even together also run n times, alternating. For n=5, zero prints 5 times, odd prints 3 times (1, 3, 5), and even prints 2 times (2, 4). This uneven distribution adds complexity to loop bounds and termination.

#### The Rules

With the roles clear, here are the ordering constraints that define correctness.

1.  "0" is printed before every non-zero number.
2.  Odd numbers (1, 3, 5, ...) and even numbers (2, 4, 6, ...) alternate.
3.  The sequence is: 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, ... up to n.
4.  Thread zero runs n times, thread odd runs ceil(n/2) times, thread even runs floor(n/2) times.

The pattern becomes clear when you trace through it: zero always goes, then odd or even takes a turn, then back to zero. The tricky part is that zero must know whether to wake odd or even after each print.

#### The Goal

Design a synchronization mechanism that:

*   **Correct ordering:** Output is exactly "0102030405...0n".
*   **No deadlock:** All threads complete their iterations.
*   **Efficient:** Threads don't busy-wait or waste CPU cycles.

The diagram shows the three-way coordination. Zero prints, then signals either odd or even depending on which number comes next. After odd or even prints, they signal back to zero. The pattern continues until all numbers are printed.

The Zero-Even-Odd problem teaches multi-party synchronization where threads have different roles and frequencies. This pattern appears throughout systems programming:

*   **I/O multiplexing:** A single selector thread dispatches to multiple handler threads based on the event type.
*   **Producer-consumer with routing:** One producer, multiple consumers, where the producer decides which consumer gets each item.
*   **Round-robin schedulers:** A coordinator cycles through workers in a specific order.
*   **Protocol state machines:** Different handlers for different message types, with a central dispatcher.

### Real-World Analogies

Problem Element

Real-World Equivalent

Thread zero

Traffic light controller

Thread odd/even

Vehicles from two directions

Alternation pattern

Green light alternates between directions

Zero before each number

Every vehicle waits for green before crossing

# Synchronization Challenges

Before jumping into solutions, let's understand what makes this problem tricky. The challenges here are more subtle than in FooBar.

### Challenge 1: Three-Way Ordering

Unlike FooBar's simple back-and-forth, this problem has a specific state machine. Zero always goes after odd or even, but zero must decide whether odd or even goes next. This creates four distinct states, not two.

The state machine below shows how the system transitions between states.

Notice that zero has two states: "before odd" and "before even." This is the key complexity. After printing, zero must check which state it's in to know who to signal.

### Challenge 2: Conditional Dispatch

After printing "0", thread zero must wake up either odd or even, not both, not neither. Using a single condition variable or semaphore for both odd and even would create a race: both might try to proceed, or the wrong one might win.

Imagine using a single `numSemaphore` for both odd and even. When zero releases it, either thread might acquire it. If even acquires it when odd should print, the output is wrong. This is why we need separate signaling mechanisms for odd and even.

### Challenge 3: Different Iteration Counts

The threads don't run the same number of times. For n=5: zero prints 5 times (0,0,0,0,0), odd prints 3 times (1,3,5), even prints 2 times (2,4). Managing these different loop bounds adds complexity.

What happens when even finishes early? It shouldn't block zero or odd. What happens after the last number? Zero must know not to wait for a signal that will never come. These edge cases trip up many implementations.

### Analysis Criteria

When evaluating solutions, we'll check each approach against these properties.

Property

Definition

Why It Matters

**Correct ordering**

Output is exactly "010203...0n"

Functional correctness

**Deadlock-free**

All threads complete

System liveness

**No busy waiting**

Threads sleep when blocked

CPU efficiency

**Targeted wakeup**

Wake only the right thread

Avoid spurious work

Now let's see how different approaches handle these challenges.

# Solution 1: Naive Approach (Busy Waiting with State)

The simplest approach: use a shared state variable and have each thread spin until it's their turn.

### Approach

We use a state variable with four possible values, corresponding to our state machine: ZERO\_BEFORE\_ODD, ODD, ZERO\_BEFORE\_EVEN, EVEN. Each thread spins checking the state. When it matches their turn, they print and update the state.

1.  Shared state variable tracks whose turn it is: ZERO\_BEFORE\_ODD, ODD, ZERO\_BEFORE\_EVEN, or EVEN.
2.  Each thread spins checking the state.
3.  When it's your turn, print and update the state.

The diagram below shows how all three threads poll the shared state.

All threads constantly check the state variable, waiting for it to match their condition. This is simple but wasteful.

### Implementation

### Analysis

Property

Status

Explanation

Correct ordering

Yes

State machine ensures correct sequence

Deadlock-free

Yes

No circular dependencies

No busy waiting

No

All threads spin continuously

Targeted wakeup

N/A

No wakeups, just polling

### The Problem

Three threads spinning means at least two are always wasting CPU cycles. On a dual-core machine, this is catastrophic: two threads fight for CPU time while the third can't run at all. The spinning threads consume 100% of available cores doing nothing useful.

Even on multi-core systems, this approach generates heat and wastes power. For any non-trivial n, the wasted CPU cycles add up quickly. We need a solution where threads sleep when it's not their turn.

# Solution 2: Semaphore-Based Solution

The semaphore solution eliminates busy waiting by having threads block efficiently. The OS puts blocked threads to sleep and wakes them only when signaled.

### Key Insight

We need three semaphores, one for each thread. Thread zero needs to decide which semaphore to release after printing. Here's the key insight: we use the loop counter `i` in the zero thread to determine which semaphore to release.

When `i` is 1, 3, 5, ... (odd), the next number to print is odd, so we release oddSemaphore. When `i` is 2, 4, 6, ... (even), we release evenSemaphore. This simple parity check encodes the alternation pattern.

### Approach

Here's how the three semaphores coordinate the threads.

1.  **zeroSemaphore:** Initialized to 1 (zero goes first).
2.  **oddSemaphore:** Initialized to 0 (odd waits).
3.  **evenSemaphore:** Initialized to 0 (even waits).
4.  Zero acquires zeroSemaphore, prints "0", releases oddSemaphore or evenSemaphore based on which number is next.
5.  Odd/Even acquires its semaphore, prints its number, releases zeroSemaphore.

The diagram below shows this dispatch pattern for the first few iterations.

The conditional branch after printing "0" is the heart of this solution. Zero looks at `i`, checks if it's odd or even, and releases the appropriate semaphore.

### Implementation

### Analysis

Property

Status

Explanation

Correct ordering

Yes

Semaphore dispatch ensures correct sequence

Deadlock-free

Yes

Linear dependency chain, no cycles

No busy waiting

Yes

Semaphores block efficiently

Targeted wakeup

Yes

Zero releases exactly the right semaphore

### Why This Works

The solution uses the loop counter `i` in the zero thread to determine which semaphore to release. When `i` is 1, 3, 5, ... (odd), the next number to print is odd, so we release oddSemaphore. When `i` is 2, 4, 6, ... (even), we release evenSemaphore.

This targeted dispatch ensures the correct thread always gets the signal. There's no ambiguity, no race condition, no chance of waking the wrong thread.

Notice that odd and even always release zeroSemaphore. They don't need to make decisions; after printing their number, they always hand control back to zero. The asymmetry is intentional: zero is the coordinator, odd and even are the workers.

# Solution 3: Condition Variable Solution

Condition variables offer flexibility when you want all threads to wait on a single condition with different predicates. This approach is more verbose than semaphores for this problem, but it demonstrates a pattern useful for more complex conditions.

### Key Insight

All threads wait on the same condition variable but with different predicates. Zero waits until it's in a "before" state, odd waits until state is ODD, even waits until state is EVEN. After each print, update the state and notify all.

Since we use a single condition variable for all three threads, we must use `signalAll()` (or `notifyAll()`) rather than `signal()`. When the state changes, we don't know which thread should proceed, so we wake them all. Each thread rechecks its predicate and either proceeds or goes back to waiting.

### Approach

Here's how the pieces fit together.

1.  **State enum:** ZERO\_BEFORE\_ODD, ODD, ZERO\_BEFORE\_EVEN, EVEN.
2.  **Single lock and condition:** All threads share them.
3.  Each thread waits with a predicate matching its state.
4.  After printing, transition to the next state and notifyAll.

The flow diagram below shows the zero thread's logic.

The zero thread checks if the state is one of its two "before" states. If not, it waits. When it wakes, it rechecks. This loop handles spurious wakeups correctly.

### Implementation

#### Code Walkthrough

Let's examine the key synchronization points that make this solution correct.

1.  **State enum:** Four states capture the full state machine. Zero has two states depending on what comes next, which encodes the alternation pattern.
2.  **Predicate in while loop:** Each thread waits only when the state doesn't match its turn. The while loop handles spurious wakeups, where a thread might wake without being signaled.
3.  **signalAll:** We wake all threads because we don't know which one should run next. Each thread rechecks its predicate. This is less efficient than targeted dispatch but simpler to implement.

### Analysis

Property

Status

Explanation

Correct ordering

Yes

State machine enforces sequence

Deadlock-free

Yes

State always advances after each print

No busy waiting

Yes

Condition variables block efficiently

Targeted wakeup

Partial

notifyAll wakes all, but only the right one proceeds

### Correctness Argument

Why does this solution work? Let's trace through the logic.

1.  **Mutual Exclusion:** Only one thread holds the lock at a time.
2.  **Progress:** After each print, the state transitions and signalAll ensures waiting threads re-check their predicates.
3.  **Correct Sequence:** The state machine guarantees zero always precedes the number, and odd/even alternate.

The trade-off compared to semaphores is efficiency: signalAll wakes all three threads, but only one can proceed. The other two wake up, check their predicate, find it false, and go back to sleep. For three threads, this overhead is minimal, but it would scale poorly to many threads.

# Solution Comparison

We've seen three approaches to the Zero-Even-Odd problem. Here's how they compare.

Approach

Correct

No Busy Wait

Efficiency

Targeted Wake

Complexity

Naive (spin)

Yes

No

Low

N/A

Simple

Semaphore-based

Yes

Yes

High

Yes

Medium

Condition variable

Yes

Yes

Medium

Partial

Medium

Recommendation

Use the semaphore solution for interviews. It has targeted wakeups (efficient), is deadlock-free by construction, and the code clearly shows the three-way coordination. The condition variable solution is equally correct but slightly less efficient due to waking all threads.

# Alternative Solutions

Beyond the main approaches, there are variations worth knowing. Let's look at an approach that combines the best of both worlds.

### Alternative 1: Using Separate Condition Variables

Instead of notifyAll with one condition, use three separate conditions for targeted wakeups with condition variables.

**When to prefer:** When you want the efficiency of targeted wakeups with the flexibility of condition variables. This approach combines the best of both worlds: each thread waits on its own condition, so you can use `signal()` instead of `signalAll()`.

### Alternative 2: Lock-Free with Atomics and Yield

For systems where semaphores are expensive, you can use atomics with yield:

**When to prefer:** When you're on a system with expensive thread blocking, or need lock-free guarantees. Still involves spinning but yields CPU.

Launching soon
