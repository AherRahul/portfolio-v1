---
title: "Design Locking Service"
description: "Design Locking Service - System Design Interviews Module 16"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design Locking Service

What is a Distributed Locking Service?

A **Distributed Locking Service** is a coordination mechanism used in **distributed systems** to ensure that **only one process or node at a time can access or modify a shared resource,** even when that resource is spread across multiple machines or data centers.

In large-scale systems, this is essential to maintain **consistency** and **prevent conflicts** when multiple components operate concurrently.

Distributed locking is crucial for scenarios such as:

*   **Job schedulers:** preventing the same job from running multiple times.
*   **Database writes:** avoiding race conditions during concurrent updates.
*   **Shared file systems:** ensuring only one node updates a file at a time.
*   **Distributed transactions:** enforcing exclusive access to critical resources.

In this chapter, we’ll explore how to **design a Distributed Locking Service** discussing multiple design approaches used in real-world systems.

Lets start by clarifying the requirements.

# 1\. Clarifying Requirements

A system design interview should always start with a conversation to scope the problem. Here’s an example of how a candidate–interviewer discussion might flow:

Discussion

**Interviewer:** "Let's design a distributed locking service"

**Candidate:** "Okay. The primary goal is to provide mutual exclusion. A client should be able to `acquire` a lock for a specific resource, and no other client should be able to acquire the same lock until it's `released`. What happens if a client acquires a lock and then crashes?"

**Interviewer:** "That's a critical point. The system must handle that. A crashed client can't hold a lock indefinitely."

**Candidate:** "That implies locks must have a **timeout** or a **lease**. We should also consider high availability and fault tolerance. The lock service itself can't be a single point of failure."

After gathering the details, we can summarize the key system requirements.

### 1.1 Functional Requirements

*   **Acquire Lock:** A client can request a lock on a resource. The call should be blocking or return immediately if the lock is unavailable.
*   **Release Lock:** A client can explicitly release a lock it holds.
*   **Lock with TTL (Lease):** Locks must have an associated Time-to-Live (TTL) to prevent deadlocks from client crashes. The lock is automatically released after the TTL expires.
*   **Lock Renewal:** A client holding a lock should be able to extend its lease.

### 1.2 Non-Functional Requirements

*   **High Availability:** The service must remain operational even if some of its nodes fail.
*   **Correctness:** Under no circumstances should two clients believe they hold the same lock.
*   **Low Latency:** Acquiring and releasing locks should be fast.
*   **Deadlock Freedom:** The system should never enter a state where locks can’t be acquired again.

# 2\. Key Challenges and Design Goals

### Challenges

Building a correct distributed locking service is notoriously difficult due to the inherent challenges of distributed systems.

*   **Network Partitions:** The network can split, isolating nodes. During a partition, two different parts of the cluster might think the other has failed, potentially leading to two clients being granted the same lock (split-brain).
*   **Process Crashes:** A client holding a lock can crash. The system must have a way to detect this and release the lock.
*   **Clock Drift:** Nodes' clocks are never perfectly synchronized. Relying on timestamps for lease expiration can be risky if clocks drift significantly.
*   **Race Conditions:** Multiple clients might try to acquire a lock at the exact same moment. The service must serialize these requests correctly.

#### **Example**

Lets say, the system has two lock nodes, `Lock Node 1` and `Lock Node 2`, that coordinate with each other to maintain a consistent lock state across the cluster. When **Client A** acquires a lock through `Lock Node 1`, all nodes agree that the resource is locked, preventing others from acquiring it.

Due to a network failure, **Partition A** and **Partition B** lose communication. The cluster is now divided into two isolated groups that can’t exchange state or heartbeat messages.

In **Partition A**, `Lock Node 1` still believes Client A holds the lock. Meanwhile, in **Partition B**, `Lock Node 2` doesn’t see Client A’s lock and may allow **Client B** to acquire the same lock.

This results in **two clients holding the same lock simultaneously**, violating **mutual exclusion**. This situation is known as a **split-brain scenario**.

If not designed carefully, a temporary network glitch can cause **data corruption**, **double updates**, or **duplicate job executions**.

### Design Goals

To overcome above challenges, our design must prioritize four key goals:

1.  **Safety (Correctness):** At any given moment, only one client can hold a lock for a given resource.
2.  **Liveness (Deadlock Freedom):** All clients must eventually be able to acquire a lock (as long as it's not held forever). A crashed client must not be able to hold a lock indefinitely.
3.  **Fault Tolerance:** The service must remain available and correct as long as a majority of its servers are running and can communicate.

# 3\. API Design

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
