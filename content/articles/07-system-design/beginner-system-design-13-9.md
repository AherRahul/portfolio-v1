---
title: "Vector Clocks"
description: "Vector Clocks - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Vector Clocks

The previous chapter showed how Lamport timestamps capture causality with elegant simplicity. But they have a fundamental limitation: they cannot detect concurrency. If timestamp(A) < timestamp(B), you know A might have happened before B, but you cannot tell whether it actually did or whether the events are concurrent.

This limitation matters in practice. Consider a distributed database where two users edit the same document on different replicas. Both writes have timestamps. Are they concurrent (a conflict requiring resolution) or causally related (one supersedes the other)? Lamport timestamps cannot tell you.

Vector clocks solve this problem by maintaining not one counter, but one counter per process. Instead of asking "what time is it?" each process tracks "what do I know about every process's progress?"

This additional information enables exact determination of causal relationships. If A happened-before B, we can prove it. If they are concurrent, we can prove that too.

In this chapter, you will learn:

*   How vector clocks represent causal history
*   The algorithm for maintaining and comparing vector clocks
*   How to detect concurrent events and conflicts
*   Version vectors and their use in distributed databases
*   Trade-offs between expressiveness and overhead

Vector clocks are more powerful than Lamport timestamps but come with costs. The space overhead is O(n) where n is the number of processes, compared to O(1) for Lamport timestamps. Understanding when this trade-off is worthwhile is essential for designing distributed systems.

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
