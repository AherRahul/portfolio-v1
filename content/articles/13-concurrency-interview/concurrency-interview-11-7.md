---
title: "Design Task Scheduler with Dependencies"
description: "Design Task Scheduler with Dependencies - Concurrency Interview Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Task Scheduler with Dependencies

What is a Task Scheduler with Dependencies?

A task scheduler with dependencies is a system that executes tasks in the correct order based on their dependency relationships. If Task B depends on Task A, the scheduler guarantees that A completes before B starts. When tasks have no dependencies between them, they can run concurrently.

#### **Why do we need it?**

*   **Build systems:** Compiling source files where headers must be processed before files that include them.
*   **CI/CD pipelines:** Running lint, then tests, then deployment, with some steps parallelizable.
*   **Workflow engines:** Processing data pipelines where transformations depend on earlier stages.
*   **Game loading:** Loading textures before models that reference them, shaders before materials.

We'll design a thread-safe scheduler that handles the core concurrency challenges: tracking dependency completion across threads, executing independent tasks concurrently, and propagating failures to dependent tasks. Let's start by defining exactly what we need to build.

# 1\. Problem Definition

Question

**Design a thread-safe task scheduler that executes tasks concurrently while respecting dependency constraints, where a task only runs after all its dependencies have completed successfully.**

At first glance, the requirement sounds like a topological sort: order the tasks and execute them in sequence. But once multiple worker threads compete to execute tasks and mark them complete, the problem becomes a real concurrency challenge.

Consider what happens when two tasks depend on the same upstream task. When that upstream task completes, both dependent tasks become ready simultaneously. Without proper synchronization, both workers might try to execute the same dependent task, or worse, neither might notice it became ready.

Core Requirements

*   **Submit tasks with dependencies:** Register a task along with the list of tasks it depends on. The scheduler tracks these relationships.
*   **Execute when ready:** A task executes only after all its dependencies complete successfully. Tasks with no dependencies (or whose dependencies are all complete) can run immediately.
*   **Concurrent execution:** Multiple independent tasks should run in parallel on worker threads to maximize throughput.
*   **Failure propagation:** When a task fails, all tasks that depend on it (directly or transitively) should be marked as failed without executing.
*   **Graceful shutdown:** When signaled to stop, workers should complete their current tasks and exit cleanly.

Non-functional requirements

*   **Thread-safety:** All operations must be safe under concurrent access
*   **No duplicate execution:** Each task must execute exactly once
*   **Correct ordering:** Dependencies must complete before dependents start
*   **Failure isolation:** A failed task should not corrupt scheduler state

In short, the system must guarantee that tasks execute in dependency order, independent tasks run concurrently, failures propagate correctly, and no task runs twice or gets lost.

# 2\. System Overview

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
