---
title: "Building H2O Molecule"
description: "Building H2O Molecule - Concurrency Interview Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Building H2O Molecule

The Building H2O Problem is a beautiful synchronization puzzle. Hydrogen and oxygen threads arrive in arbitrary order and must combine in groups of exactly two hydrogens and one oxygen to form water molecules.

What makes this problem compelling is its precision requirement. Two hydrogen threads must wait for exactly one oxygen thread, and vice versa.

This pattern appears throughout computing: batch processing systems that need fixed group sizes, request aggregation that combines exactly N requests, and resource allocation that requires specific resource combinations.

# Problem Statement

There are two kinds of threads: hydrogen and oxygen. Your goal is to form water molecules by combining them. Each water molecule requires exactly two hydrogen atoms and one oxygen atom. Threads arrive concurrently and must synchronize to form complete molecules.

The challenge is making sure no thread proceeds until its molecule partners are ready. You can't have a hydrogen wandering off alone, and you can't have two oxygens trying to share the same hydrogens.

#### The Setup

Let's understand the entities involved in this problem.

1.  **Hydrogen threads:** Each represents one hydrogen atom. They're plentiful, arriving frequently. Two must combine with each oxygen to form water.
2.  **Oxygen threads:** Each represents one oxygen atom. They're less frequent (in real chemistry, we need twice as many hydrogens). One oxygen combines with two hydrogens.
3.  **Molecule formation:** Exactly 2H + 1O must synchronize before any can proceed. This is the key constraint. Not 1H + 1O. Not 3H + 1O. Exactly 2H + 1O, every single time.

The analogy to real systems is direct: hydrogens are like individual requests waiting to be batched, oxygens are like batch coordinators, and molecule formation is like batch processing where exactly N items must be ready.

#### The Rules

These constraints define correct behavior.

1.  Threads arrive in arbitrary order. You might get HHOOHH or OHOHOH or any other sequence.
2.  A hydrogen must wait until it can pair with another hydrogen and one oxygen.
3.  An oxygen must wait until it can pair with two hydrogens.
4.  Once a group of 2H + 1O is formed, all three proceed simultaneously.
5.  The next molecule can only form after the current one is complete.

That last rule deserves emphasis. We're forming molecules one at a time. If 10 hydrogens and 5 oxygens arrive, we form 5 molecules sequentially, not simultaneously. Some variations allow parallel molecule formation, but the basic problem is sequential.

### The Goal

With setup and rules clear, here's what our solution must achieve.

*   **Correct grouping:** Exactly 2H + 1O proceed together, every time.
*   **No deadlock:** System never freezes regardless of arrival order.
*   **No starvation:** Every thread eventually becomes part of a molecule.
*   **Efficiency:** Minimal unnecessary blocking.

Hydrogen and oxygen threads wait in a pool. When two hydrogens and one oxygen are available, they combine to form a molecule. The remaining threads (H3, O2) wait for more atoms to arrive before forming the next molecule.

### Real-World Analogies

The H2O problem exemplifies barrier-based synchronization with ratio constraints. Many real-world systems need to group items in specific ratios before processing.

Think about these scenarios:

*   **Batch processing:** Combine exactly N requests before sending to a backend.
*   **Database transactions:** Commit requires M writes and 1 coordinator acknowledgment.
*   **Assembly lines:** A product requires specific counts of different components.
*   **Gaming:** Form teams with exactly 5 players before starting a match.
*   **Parallel algorithms:** Divide work into groups of fixed size before reducing.

In all these cases, progress requires precise grouping. One missing element means everyone waits.

# Synchronization Challenges

Before jumping into solutions, let's understand what makes this problem hard.

### Challenge 1: Ratio Enforcement

We need exactly 2H + 1O. Not "at least" but "exactly." If only 1H and 1O arrive, neither should proceed. They must wait for the second hydrogen. If 3H and 1O arrive, only 2H should proceed with that O. The third H waits for future atoms.

The challenge is tracking these counts accurately and releasing exactly the right threads when the ratio is satisfied. Too many, and we've broken the molecule formula. Too few, and we have leftover atoms.

### Challenge 2: No Partial Molecules

This is subtle but critical. Suppose 2H arrive and start "forming" a molecule, but O hasn't arrived yet. We can't have those 2H declare themselves part of a molecule and proceed. All three must synchronize at the same point before any can claim to have formed a molecule.

**Why does this matter?** Because the molecule formation isn't just about counting. It's about ensuring all three threads pass through a synchronization point together. If H1 runs ahead, it might interfere with the next molecule's formation.

### Challenge 3: Fairness Between Molecules

With many threads arriving (e.g., 10H and 5O), we need to form 5 molecules. We can't have all 10H trying to participate in the first molecule. After 2H join a molecule, the next 2H should form the next molecule.

This requires some form of admission control. We limit how many H and O can be "actively trying" to form a molecule at once. Semaphores are perfect for this.

### Analysis Criteria

With these challenges in mind, here's how we'll evaluate each solution.

Property

Definition

Why It Matters

**Correct ratio**

Exactly 2H + 1O per molecule

Functional correctness

**Deadlock-free**

System never freezes

Liveness

**Starvation-free**

Every thread eventually proceeds

Fairness

**Efficient**

Minimal unnecessary blocking

Performance

Now let's see how different approaches handle these challenges.

# Solution 1: Naive Approach (Counters Without Proper Sync)

The intuitive approach: use counters to track waiting hydrogens and oxygens. When counts reach 2H and 1O, form a molecule.

### Approach

The idea seems straightforward.

1.  Increment hydrogen counter when H arrives.
2.  Increment oxygen counter when O arrives.
3.  If hydrogenCount >= 2 and oxygenCount >= 1, form molecule.
4.  Decrement counters.

### Implementation

### Analysis

Property

Status

Explanation

Correct ratio

No

Race condition on counter decrement

Deadlock-free

Maybe

Depends on thread interleaving

Starvation-free

No

No fairness guarantee

Efficient

Low

notifyAll wakes all threads

### The Problem

This solution has a critical flaw: when 2H and 1O all wake up, they each try to decrement their counters and proceed. But there's no coordination to ensure exactly 2H and exactly 1O proceed.

Imagine this scenario:

1.  H1 arrives, increments hydrogenCount to 1.
2.  H2 arrives, increments hydrogenCount to 2.
3.  O1 arrives, increments oxygenCount to 1.
4.  All three wake up, see hydrogenCount >= 2 && oxygenCount >= 1.
5.  H1 decrements hydrogenCount to 1.
6.  O1 decrements oxygenCount to 0.
7.  H2 tries to proceed but now the condition is false again!

Or worse: multiple oxygens might all see the condition as true and all decrement, leading to more than one O per molecule.

The fundamental issue is that checking and decrementing aren't atomic across all three threads. We need a synchronization point where all three arrive before any proceed. That's what barriers are for.

# Solution 2: Barrier-Based Solution

The key insight is that molecule formation is a synchronization barrier: all three threads (2H + 1O) must arrive at the barrier before any can pass. Combined with semaphores to control who can reach the barrier, this gives us a clean solution.

### Key Insight

We need two mechanisms working together.

**Semaphores for admission control:** Allow only 2H and 1O to try forming a molecule at a time. Initialize hydrogen semaphore to 2, oxygen semaphore to 1. Each thread acquires its semaphore before proceeding.

**Barrier for synchronization:** Requires 3 threads to proceed. When 2H + 1O arrive at the barrier, all three pass simultaneously. The barrier callback releases new semaphore permits for the next molecule.

Why does this combination work?

Semaphores ensure the right ratio (2H + 1O). The barrier ensures they all proceed together. The callback ensures the next molecule waits for fresh permits.

### Approach

Here's the flow.

1.  **H semaphore:** Initialized to 2. Each H acquires one permit. Only 2 H can be "in flight" at once.
2.  **O semaphore:** Initialized to 1. Each O acquires one permit. Only 1 O can be "in flight" at once.
3.  **Barrier:** Requires 3 threads. When 3 arrive, all proceed together.
4.  **Barrier callback:** After barrier breaks, release semaphore permits for next molecule.

Notice the layered approach. Semaphores filter who can try (admission). Barrier synchronizes who can proceed (coordination). Together they give us exact 2H + 1O grouping.

Now let's implement this properly.

### Implementation

#### Code Walkthrough

Let's trace through exactly what happens when we have H1, H2, and O1 arriving.

1.  **H1 arrives:** Acquires from hydrogenSem (permits drop from 2 to 1). Calls releaseHydrogen. Waits at barrier.
2.  **H2 arrives:** Acquires from hydrogenSem (permits drop from 1 to 0). Calls releaseHydrogen. Waits at barrier.
3.  **H3 arrives:** Tries to acquire from hydrogenSem but blocks (no permits left).
4.  **O1 arrives:** Acquires from oxygenSem (permits drop from 1 to 0). Calls releaseOxygen. Waits at barrier.
5.  **Barrier breaks:** All three threads (H1, H2, O1) are at the barrier. The barrier callback runs, releasing 2 H permits and 1 O permit.
6.  **All three proceed:** H1, H2, O1 return from their respective methods.
7.  **H3 unblocks:** Now has a permit available. It joins the next molecule.

The beauty is in the separation of concerns. Semaphores handle the ratio. Barrier handles the synchronization. Callback handles the reset.

### Analysis

Property

Status

Explanation

Correct ratio

Yes

Semaphores enforce 2H + 1O admission

Deadlock-free

Yes

Barrier guarantees all proceed together

Starvation-free

Depends

Depends on semaphore fairness

Efficient

High

Only 3 threads blocked per molecule

### Why This Works

The semaphores act as admission control: only 2H and 1O can acquire permits and reach the barrier. Once 3 threads (exactly 2H + 1O) are at the barrier, it breaks, all proceed, and the barrier callback releases permits for the next molecule. The CyclicBarrier resets automatically for reuse.

Note where the callbacks run: in the barrier completion action, not immediately after each thread passes. This ensures the next molecule only starts after the current one is fully complete.

The barrier-based solution is elegant, but what if you're in an environment without built-in barriers? That's where our next approach comes in.

# Solution 3: Semaphore-Only Solution

For environments without barriers, we can build the same logic using only semaphores. This solution is more portable and demonstrates deeper understanding of semaphore semantics.

### Key Insight

We can simulate a barrier using counting semaphores. The idea is that threads wait on a "proceed" semaphore. When the required count is reached, someone releases permits for all waiting threads.

The trick is deciding who triggers the release. We use a mutex-protected counter to track arrivals. Whichever thread brings the count to the required total releases permits for everyone (including itself).

### Approach

Here's how it works.

1.  Hydrogen: Increment H count under mutex, check if 2H and 1O are ready, signal all three to proceed if so.
2.  Oxygen: Increment O count under mutex, check if 2H and 1O are ready, signal all three to proceed if so.
3.  After signaling, reset counts for next molecule.
4.  If not enough atoms, release mutex and wait on queue semaphore.

The key insight is that the thread completing the group (bringing total to 2H + 1O) acts as the coordinator, releasing all three threads.

### Implementation

#### Code Walkthrough

Let's trace through the key synchronization points.

1.  **Mutex for count updates:** Protects hydrogenCount and oxygenCount from race conditions. Only one thread modifies counts at a time.
2.  **Queue semaphores:** Threads wait here until a molecule can form. Initialized to 0, so threads block by default when they call acquire.
3.  **Triggering molecule formation:** Whichever thread completes the 2H + 1O requirement releases permits for all three threads. This could be a hydrogen or an oxygen.
4.  **Release mutex before waiting:** Critical! If we hold the mutex while waiting on the queue, other threads can't arrive and update counts. This would cause deadlock.
5.  **The triggering thread doesn't wait:** Notice the logic. If we trigger formation, we release permits (including one for ourselves) but we also call releaseHydrogen/releaseOxygen without waiting. The released permit is "consumed" by the release call, not by an acquire.

### Analysis

Property

Status

Explanation

Correct ratio

Yes

Exactly 2H and 1O permits released

Deadlock-free

Yes

Mutex released before blocking wait

Starvation-free

Depends

FIFO semaphores help

Efficient

High

Only necessary threads blocked

### Correctness Argument

1.  **Ratio enforcement:** The triggering thread only releases permits when exactly 2H and 1O are counted. It decrements counts atomically before releasing. No partial molecules.
2.  **No deadlock:** The mutex is always released before waiting on queue semaphores. Threads can always arrive and update counts. The trigger condition will eventually be met if enough atoms arrive.
3.  **Progress:** When 2H + 1O are present, permits are released immediately. No waiting for external events.
4.  **No double-counting:** Each thread increments once, decrements once (when forming molecule). Counts stay consistent.

# Solution Comparison

Approach

Correct

Deadlock-free

Complexity

Best For

Naive (counters)

No

Risky

Simple

Understanding the problem

Barrier + Semaphore

Yes

Yes

Medium

Java (has CyclicBarrier)

Semaphore-only

Yes

Yes

Medium

Any language

Recommendation

Use the barrier-based solution in Java interviews as it's the most elegant and shows you know the right abstractions. For other languages without built-in barriers, the semaphore-only solution demonstrates deeper understanding of semaphore semantics.

Launching soon
