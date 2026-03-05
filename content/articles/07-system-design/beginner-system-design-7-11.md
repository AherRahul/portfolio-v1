---
title: "Dead Letter Queues"
description: "Dead Letter Queues - System Design Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Dead Letter Queues

In the previous chapter, we learned about delivery semantics and how at-least-once delivery retries failed messages. But what happens when a message keeps failing?

If a message has a bug, missing data, or references a resource that does not exist, no amount of retrying will help. Without a solution, these "poison" messages would either block the queue forever or consume resources with infinite retries.

**Dead letter queues (DLQs)** solve this problem.

A dead letter queue is a special queue that stores messages that cannot be successfully processed. Instead of retrying forever or losing the message, the system moves it to the DLQ after a configured number of attempts.

In this chapter, you will learn:

*   What dead letter queues are and why they matter
*   How to configure DLQs in different messaging systems
*   Common reasons messages end up in DLQs
*   How to handle and recover messages from DLQs
*   Best practices for DLQ design and monitoring

# What is a Dead Letter Queue?

A dead letter queue is a queue that stores messages that could not be processed successfully. It acts as a holding area for problematic messages that need investigation.

### The Flow

1.  Message arrives in main queue
2.  Consumer attempts to process
3.  If processing fails, message returns to queue for retry
4.  After max retries, message moves to dead letter queue
5.  Main queue continues processing other messages

# Why Messages End Up in DLQs

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
