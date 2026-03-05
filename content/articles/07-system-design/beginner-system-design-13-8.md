---
title: "Lamport Timestamps"
description: "Lamport Timestamps - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Lamport Timestamps

The previous chapter introduced logical clocks as a concept: counters that track causality rather than physical time. Now we turn to the first and simplest implementation of this concept, Lamport timestamps, introduced by Leslie Lamport in his 1978 paper "Time, Clocks, and the Ordering of Events in a Distributed System."

Lamport timestamps are elegantly simple. Each process maintains a single integer counter. The counter increments with each event. When sending a message, the sender includes its current counter. When receiving a message, the receiver advances its counter to be greater than both its current value and the received timestamp. That is the entire algorithm.

This simplicity made Lamport timestamps the foundation for countless distributed systems. They appear in database replication, distributed locks, consensus protocols, and event ordering systems. Understanding Lamport timestamps is essential for any distributed systems engineer.

In this chapter, you will learn:

*   The complete Lamport timestamp algorithm
*   How to trace timestamp propagation through distributed executions
*   The total ordering property and how to achieve it
*   Where Lamport timestamps excel and where they fall short
*   Practical applications in distributed databases and consensus

The core limitation of Lamport timestamps is that they cannot distinguish causality from concurrency. If timestamp A < timestamp B, we know A might have happened before B, but we cannot tell if it actually did. The next chapter on vector clocks addresses this limitation, but Lamport timestamps remain valuable for their simplicity and efficiency.

# The Algorithm

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
