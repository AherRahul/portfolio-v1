---
title: "Split Brain Problem"
description: "Split Brain Problem - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Split Brain Problem

In the previous chapter, we explored network partitions, situations where nodes in a distributed system cannot communicate even though they are still running. Partitions are dangerous, but the real disaster happens when both sides of a partition believe they are in charge. This is the split-brain problem.

Imagine a database cluster with a primary node and two replicas. The primary handles all writes, coordinating with replicas to maintain consistency. Now a network partition isolates the primary from the replicas. The replicas cannot see the primary, so they elect one of themselves as the new primary.

Meanwhile, the original primary is still running, still accepting writes, unaware that it has been replaced. You now have two primaries, both accepting writes, creating conflicting data that will be nearly impossible to reconcile.

Split-brain is one of the most feared failure modes in distributed systems. It can cause data corruption, duplicate transactions, and inconsistencies that persist long after the partition heals. Preventing split-brain requires careful design, and even then, it is not always possible to guarantee safety under all circumstances.

In this chapter, you will learn:

*   What split-brain is and why it is so dangerous
*   How split-brain occurs in different system architectures
*   Prevention strategies: quorums, fencing, and STONITH
*   Real-world split-brain disasters and lessons learned
*   Trade-offs between split-brain prevention and availability

# What Is Split-Brain?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
