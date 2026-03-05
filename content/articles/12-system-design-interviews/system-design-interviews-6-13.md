---
title: "Failure Detection"
description: "Failure Detection - System Design Interviews Module 6"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Failure Detection

In distributed systems, nodes fail all the time. Servers crash, networks partition, processes hang. The question isn't _if_ failures happen, but _how quickly_ you can detect them.

Consider a database cluster with three replicas. The primary node crashes. If your system takes 5 minutes to detect this failure, you have 5 minutes of downtime. If it detects it in 5 seconds, you have 5 seconds of downtime.

Failure detection is the foundation of fault tolerance. Without it, you can't trigger failovers, rebalance load, or alert operators. Every highly available system depends on some form of failure detection.

In this chapter, we'll explore:

*   What is failure detection?
*   Why is it hard?
*   How heartbeats work
*   Different failure detection strategies
*   The trade-offs you must consider
*   Real-world implementations

### Problems Where This Pattern is Useful

Failure detection and heartbeats appear in many system design interview problems:

Problem

How Failure Detection is Used

**Distributed Database**

Detecting failed replicas, triggering leader election

**Load Balancer**

Removing unhealthy servers from rotation

**Message Queue**

Detecting dead consumers, reassigning partitions

**Distributed Cache**

Detecting failed nodes, rebalancing data

**Service Discovery**

Marking services as unhealthy, updating registry

**Coordination Service**

Leader election, distributed locking

**Container Orchestration**

Restarting failed containers, rescheduling pods

**Chat/Messaging System**

Detecting offline users, presence indicators

When interviewers ask "How would you handle node failures?", they expect you to discuss heartbeats, timeouts, and the trade-offs involved.

# 1\. What is Failure Detection?

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
