---
title: "Logical Clocks"
description: "Logical Clocks - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Logical Clocks

The previous chapter showed why physical clocks cannot be perfectly synchronized. Variable network latency, clock drift, and the fundamental limits of physics mean we cannot know exactly when events occurred across distributed machines.

Yet distributed systems constantly need to answer ordering questions: Did this read happen before or after that write? Which message arrived first? Whose update should win?

The insight that resolves this tension came from Leslie Lamport in 1978: we do not actually need to know when events happened. We need to know whether events could have influenced each other. If message A was sent before message B was received, then A could have influenced B. That causal relationship is what matters, not the physical timestamps.

Logical clocks capture this insight. Instead of synchronizing physical time, they track causality. A logical clock is a counter that increases with events and propagates between processes. When you see a logical timestamp, you do not know what time it was on a wall clock. You know what events must have happened before that point.

In this chapter, you will learn:

*   The concept of "happens-before" and causal ordering
*   How logical clocks differ from physical clocks
*   The fundamental properties logical clocks must satisfy
*   Where logical clocks succeed and where they fall short
*   How this foundation enables the specific implementations in later chapters

Understanding logical clocks as a concept is essential before diving into Lamport timestamps, vector clocks, and hybrid approaches. Each is a different implementation of the same core idea: tracking causality rather than physical time.

# The Happens-Before Relation

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
