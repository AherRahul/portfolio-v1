---
title: "Race Conditions and Critical Sections"
description: "Race Conditions and Critical Sections - Concurrency Interview Module 3"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Race Conditions and Critical Sections

Imagine two threads both incrementing a shared counter. Each runs `counter++` a thousand times. You'd expect the final value to be 2,000.

But when you run it, you get 1,847. Run it again: 1,923. Again: 1,756. The result is different every time, and always wrong.

This is a **race condition**, one of the most insidious bugs in concurrent programming.

Race conditions don't crash your program or throw exceptions. They silently corrupt your data, and they only appear under specific timing conditions that are nearly impossible to reproduce in testing.

This chapter explains what race conditions are, why they happen, and how to prevent them using critical sections.

# What is a Race Condition?

A race condition occurs when the behavior of a program depends on the relative timing of events, such as the order in which threads are scheduled. When two or more threads access shared data concurrently, and at least one modifies it, the final result depends on who "wins the race" to access the data first.

Think of a bank transfer. You have $500 in your account. Two transactions happen simultaneously: a $100 withdrawal and a $200 deposit. The correct final balance should be $600. But if both transactions read the balance ($500) before either writes, you might end up with $300 (withdrawal wrote last) or $700 (deposit wrote last). Neither is correct.

The formal definition

A race condition exists when the program's correctness depends on the interleaving of operations from multiple threads, and at least one of those operations is a write.

In this diagram, both threads read 0, both add 1, and both write 1. The second increment is lost entirely.

Race conditions are dangerous because they're silent and non-deterministic. Unlike a null pointer exception that crashes immediately, a race condition corrupts data quietly.

### Real-World Examples

**Inventory overselling:** Two customers buy the last item simultaneously. Both threads check stock (1 available), both proceed with purchase, both decrement stock. Result: stock is -1, and you've sold an item you don't have.

**Lost database updates:** Two users edit the same record. Both load the current version, both make changes, both save. The second save overwrites the first user's changes completely.

**Double spending:** A user submits a payment twice quickly. Both requests check the balance, both see sufficient funds, both deduct the amount. The user pays once but the account is debited twice, or vice versa.

# How Race Conditions Happen

Race conditions require three ingredients:

1.  **Shared state:** Multiple threads access the same variable or data structure
2.  **Mutability:** At least one thread modifies the shared state
3.  **Concurrent access:** Access happens without proper synchronization

Remove any one of these, and you eliminate the race condition. Immutable data can't have races. Data that isn't shared can't have races. Properly synchronized access prevents races.

### The Non-Atomic Operation Problem

The classic race condition involves operations that look atomic but aren't. Consider `count++`. In your head, this is one operation: increment the counter. But at the machine level, it's three operations:

1.  **Read:** Load the current value from memory into a register
2.  **Modify:** Add 1 to the register
3.  **Write:** Store the new value back to memory

Any other thread can execute between any of these steps. This is called a **read-modify-write** race.

### The Check-Then-Act Problem

Another common pattern is **check-then-act**: you check a condition, then act based on the result. But between the check and the act, another thread can change the condition.

JavaPythonC++C#Go

Two threads call `getInstance()` simultaneously. Both see `instance == null`, both create a new object. Now you have two instances of what should be a singleton, and one is orphaned.

# Critical Sections Explained

A **critical section** is a region of code that reads or writes **shared state** (for example: a counter, a map, a queue, a file, or a database row). Because multiple threads can reach that code at the same time, we must ensure the shared state is updated **atomically** and **consistently**.

A critical section solution provides: **mutual exclusion**. At any instant, at most one thread is allowed to execute that protected region. Everyone else must wait until the current thread leaves.

#### Properties of a Good Critical Section Solution

1.  **Mutual exclusion:** Only one thread executes the critical section at a time
2.  **Progress:** If no thread is in the critical section, a waiting thread can enter
3.  **Bounded waiting:** No thread waits forever (no starvation)
4.  **No assumptions about speed:** Works regardless of how fast threads run

# Solutions: Protecting Critical Sections

### Solution 1: Mutex/Locks

The most common solution is a **mutex** (mutual exclusion lock). Before entering a critical section, acquire the lock. After leaving, release it. If another thread holds the lock, you wait.

### Solution 2: Atomic Operations

For simple variables like counters and flags, **atomic operations** provide lock-free thread safety. The hardware guarantees the operation completes without interruption.

### Solution 3: Immutability

If data never changes, it can't have race conditions. Immutable objects are inherently thread-safe.

# Quiz

## Quiz: Race Conditions and Critical Sections

1 / 8

Multiple Choice

What is a race condition?

PreviousNext

Launching soon
