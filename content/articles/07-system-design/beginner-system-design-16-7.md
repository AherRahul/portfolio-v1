---
title: "Event Sourcing"
description: "Event Sourcing - System Design Module 16"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Event Sourcing

Traditional databases store the current state of data. When you update a customer's address, the old address is gone. The database tells you what is, but not how it got there.

Event sourcing takes a fundamentally different approach. Instead of storing current state, you store a sequence of events that describe everything that happened. The current state is derived by replaying these events. Nothing is ever deleted or updated in place. Every change is recorded as a new event.

In this chapter, you will learn:

*   How event sourcing differs from state-based storage
*   The structure and storage of event streams
*   How to rebuild state from events
*   Snapshots and performance optimization
*   Event schema evolution
*   When event sourcing is the right choice

# State-Based vs Event-Sourced

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
