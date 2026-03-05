---
title: "Design Deferred Callback Executor"
description: "Design Deferred Callback Executor - Concurrency Interview Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Deferred Callback Executor

What is a Deferred Callback Executor?

A deferred callback executor is a system that schedules callbacks to run after a specified delay. You tell it "run this function in 3 seconds," and it guarantees the function executes at or after that deadline.

#### **Why do we need it?**

*   **Timer services:** Retry backoff, request timeouts, session expiration.
*   **Connection pools:** Reclaim idle connections after a timeout.
*   **Rate limiters:** Reset token buckets at fixed intervals.
*   **Debounce/throttle:** Delay execution until a burst of events settles.
*   **Game engines:** Schedule delayed effects, cooldowns, and animation triggers.
*   **Cron-like schedulers:** Periodic tasks with fixed or computed intervals.

We'll design a thread-safe executor that handles the core concurrency challenges: safely scheduling callbacks from multiple threads, waking up at the right time, and handling cancellation races. Let's start by defining exactly what we need to build.

# 1\. Problem Definition

Question

**Design a thread-safe deferred callback executor that schedules callbacks to run after a specified delay, executing them at or after the deadline under concurrent registration.**

At first glance, the requirement sounds simple: store callbacks with timestamps and execute them when the time comes. But once multiple threads register callbacks concurrently while the executor sleeps waiting for the next deadline, the problem becomes a real concurrency challenge.

This pattern shows up in timer services, retry frameworks, connection pool management, and anywhere delayed execution is needed under concurrency.

Core Requirements

*   **Schedule with delay:** Accept a callback and a delay in milliseconds. Compute the absolute execution timestamp (`executeAt = now + delay`).
*   **Execute at or after deadline:** The callback must never run before its deadline, but should run as close to the deadline as possible.
*   **Concurrent registration:** Multiple threads can register callbacks simultaneously without corrupting internal state.
*   **Ordering by deadline:** When multiple callbacks are pending, the one with the earliest deadline executes first.
*   **Cancellation support:** A scheduled callback can be cancelled before execution. If it's already running, cancellation has no effect.

In short, the system must guarantee that callbacks execute in deadline order, never before their scheduled time, and that new registrations with earlier deadlines don't get stuck behind the executor's current wait.

# 2\. System Overview

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
