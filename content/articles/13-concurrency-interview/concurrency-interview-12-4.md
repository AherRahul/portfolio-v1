---
title: "Design Lock-Free Queue"
description: "Design Lock-Free Queue - Concurrency Interview Module 12"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Lock-Free Queue

### What We're Building

A thread-safe unbounded queue that never blocks. Multiple threads can enqueue and dequeue simultaneously without locks. Progress is guaranteed: if threads keep trying, operations eventually complete.

### Required Operations

Operation

Description

Expected Complexity

`enqueue(item)`

Add item to the tail of the queue

O(1) amortized

`dequeue()`

Remove and return item from head

O(1) amortized

`isEmpty()`

Check if queue contains no items

O(1)

### Thread-Safety Requirements

*   Multiple threads can call `enqueue()` simultaneously without losing items
*   Multiple threads can call `dequeue()` simultaneously without duplicate consumption
*   A single item is delivered to exactly one consumer
*   No thread ever blocks waiting for another thread
*   The queue must never enter an invalid state regardless of thread interleaving

### Progress Guarantees

Lock-free algorithms provide different levels of progress guarantees:

Guarantee

Definition

Our Queue

**Wait-free**

Every operation completes in bounded steps

No

**Lock-free**

At least one thread makes progress

Yes

**Obstruction-free**

A thread makes progress if run in isolation

Yes

Our Michael-Scott queue is lock-free: even if some threads stall, at least one thread always makes progress. It's not wait-free because a single operation might retry indefinitely if constantly preempted by other threads (though this is rare in practice).

# Data Structure Fundamentals

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
