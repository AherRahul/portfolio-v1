---
title: "Design Concurrent Priority Queue"
description: "Design Concurrent Priority Queue - Concurrency Interview Module 12"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Concurrent Priority Queue

Priority queues are fundamental to systems that need ordering: thread pool schedulers, event-driven systems, Dijkstra's algorithm, A\* pathfinding, network packet scheduling. Unlike regular queues where you just grab the next item, priority queues must maintain a global ordering. This global ordering is what makes concurrency challenging.

A heap's structure depends on the relative priorities of all elements. When you insert or extract, elements bubble up or down, potentially touching many nodes along the way. Multiple threads racing through these bubble operations can corrupt the heap invariant.

This chapter explores three approaches to building a thread-safe priority queue: coarse-grained locking (simple but slow), fine-grained locking (complex but faster), and a skip-list-based alternative that sidesteps heap concurrency challenges entirely. Each approach has its place depending on your contention level and performance requirements.

# Problem Statement

### What We're Building

A thread-safe priority queue that allows multiple threads to insert and extract elements concurrently while maintaining priority ordering. Elements with lower priority values should be extracted before elements with higher values (min-heap semantics). The implementation should maximize throughput under concurrent access.

### Required Operations

Operation

Description

Expected Complexity

`insert(item, priority)`

Add item with given priority

O(log n)

`extractMin()`

Remove and return highest-priority item

O(log n)

`peek()`

View highest-priority item without removal

O(1)

`size()`

Return current number of elements

O(1)

`isEmpty()`

Check if queue is empty

O(1)

### Thread-Safety Requirements

*   Multiple threads can call `insert()` simultaneously without losing items
*   Multiple threads can call `extractMin()` simultaneously without duplicate extraction
*   An item is extracted exactly once
*   The extracted item is always the current minimum (linearizability)
*   The queue never enters an invalid state regardless of thread interleaving
*   Blocking operations should support interruption

# Data Structure Fundamentals

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
