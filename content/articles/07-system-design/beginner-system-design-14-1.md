---
title: "The Problem with Distributed Transactions"
description: "The Problem with Distributed Transactions - System Design Module 14"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# The Problem with Distributed Transactions

In a monolithic application, handling transactions is straightforward. You start a transaction, perform multiple database operations, and either commit everything or roll it all back. The database guarantees ACID properties: atomicity, consistency, isolation, and durability. If anything fails, the whole operation is undone as if it never happened.

Distributed systems break this simplicity.

When your application is split across multiple services, each with its own database, a single business operation might span several services. Placing an order might involve the Order Service creating an order record, the Inventory Service reserving items, and the Payment Service charging the customer. Each service manages its own database. There is no single transaction that can wrap all these operations together.

This creates a fundamental problem: how do you ensure that either all services complete their part successfully, or none of them do? If the Payment Service charges the customer but the Inventory Service fails to reserve items, you have an inconsistent state where money was taken but no products are allocated.

In this chapter, you will learn:

*   Why traditional transactions do not work across services
*   The consistency challenges in distributed systems
*   Common failure scenarios and their consequences
*   Why this problem is harder than it appears

Understanding the problem deeply is essential before exploring solutions. The constraints of distributed systems shape every pattern we will discuss in the following chapters.

# The Simplicity of Local Transactions

In a single database, transactions are elegant and reliable.

The database guarantees ACID properties:

Property

Guarantee

**Atomicity**

All operations succeed or all fail together

**Consistency**

Database moves from one valid state to another

**Isolation**

Concurrent transactions do not interfere

**Durability**

Committed changes survive crashes

This works because the database has complete control over all the data involved. It can lock rows, track changes, and coordinate the commit or rollback of the entire transaction.

# Why Distributed Transactions Are Different

When operations span multiple services and databases, we lose the properties that make local transactions reliable.

Each service has its own database. There is no single transaction manager that controls all three databases. Each database only knows about its own local transaction.

### The Fundamental Challenge

Consider what happens when placing an order:

If any step fails after previous steps have committed, we have a problem. The Order Service has already committed its transaction. The Inventory Service has already committed its reservation. There is no way to roll them back.

### Why We Cannot Just Use One Database

A natural question: why not put everything in one database? Then we could use normal transactions.

**Reasons against a shared database:**

Reason

Explanation

**Independent scaling**

Services have different load patterns

**Technology freedom**

Different services need different databases

**Team autonomy**

Teams own their data and schema

**Fault isolation**

One database failure should not affect all services

**Performance**

Distributed load, no single bottleneck

The benefits of microservices come from service independence. Sharing a database undermines that independence. We accept the complexity of distributed transactions to gain the benefits of service autonomy.

# Failure Scenarios

Distributed systems have more failure modes than local systems. Any component can fail at any time, and the failures are often partial.

### Network Partitions

When network connectivity is lost between services, Order Service cannot tell if Payment Service is down or just unreachable. Did the payment succeed? Is it still processing? Should we retry?

### Partial Failures

Two services succeeded and committed their changes. One failed. The system is in an inconsistent state: we have an order and reserved inventory, but no payment.

### Timeout Ambiguity

One of the hardest problems in distributed systems: what does a timeout mean?

Scenario

What Happened

Our State

Request never arrived

Payment not processed

Safe to retry

Request arrived, processing failed

Payment not processed

Safe to retry

Request succeeded, response lost

Payment processed

Retry would double-charge

Without additional mechanisms, we cannot distinguish these cases. This is why idempotency becomes critical in distributed systems.

### Service Crashes

When a service crashes mid-operation, its local transaction rolls back automatically. But the calling service does not know what happened.

# Consistency Models in Distributed Systems

In local transactions, we get strong consistency. In distributed systems, we often have to choose between consistency and availability.

### Strong Consistency

All nodes see the same data at the same time. After a write completes, all readers see the new value.

**Trade-off:** Higher latency, reduced availability during partitions.

### Eventual Consistency

Updates propagate to all nodes eventually, but there may be a delay. During the delay, different nodes may return different values.

**Trade-off:** Lower latency, higher availability, but temporary inconsistency.

### The CAP Theorem Connection

The CAP theorem states that during a network partition, a distributed system must choose between consistency and availability.

Network partitions will happen. The question is how your system behaves when they do. Distributed transaction patterns represent different choices along this spectrum.

# Real-World Consequences of Inconsistency

Inconsistent state is not just a theoretical problem. It causes real business issues.

### Double Charging

### Lost Orders

### Orphaned Reservations

### Financial Discrepancies

# Why This Problem Is Hard

Several factors make distributed transactions fundamentally difficult.

### No Global Clock

Each service has its own clock, and clocks drift. We cannot rely on timestamps to determine event ordering across services.

### No Shared Memory

Services cannot share variables or locks. All coordination must happen through network messages, which can be lost, delayed, or duplicated.

### Independent Failures

Each service can fail independently. A service might be up for some callers and down for others. It might process some requests and fail on others.

### The Two Generals Problem

This thought experiment proves that two parties cannot reach certainty about agreement through an unreliable channel. This fundamental limitation affects all distributed coordination.

# What We Need from a Solution

Given these challenges, what properties should a distributed transaction solution provide?

Property

Description

**Atomicity**

All services commit or all roll back

**Consistency**

System moves between valid states

**Isolation**

Concurrent operations do not corrupt data

**Durability**

Committed changes persist

**Failure handling**

Graceful recovery from partial failures

**Performance**

Acceptable latency and throughput

**Availability**

System remains operational during failures

The challenge: we cannot have all properties perfectly. Every solution involves trade-offs. The patterns in the following chapters represent different points in this trade-off space.

# Preview of Solutions

We will explore several approaches to distributed transactions, each with different trade-offs:

Pattern

Consistency

Availability

Complexity

Use Case

**Two-Phase Commit**

Strong

Lower

Medium

Tightly coupled systems

**Three-Phase Commit**

Strong

Better

High

Critical consistency needs

**Saga**

Eventual

High

Medium

Microservices

**Outbox**

Eventual

High

Low

Event-driven systems

# Summary

Distributed transactions are fundamentally harder than local transactions:

*   **Local transactions** benefit from a single transaction manager that controls all data, providing ACID guarantees automatically.
*   **Distributed systems** have no single authority. Each service owns its data, and there is no built-in way to coordinate commits across services.
*   **Failures are partial.** Some services might succeed while others fail, leaving the system in an inconsistent state.
*   **Networks are unreliable.** Messages can be lost, delayed, or duplicated. Timeouts are ambiguous.
*   **Clocks are unreliable.** We cannot use timestamps to definitively order events across services.
*   **Trade-offs are unavoidable.** The CAP theorem means we must choose between consistency and availability during partitions.

The patterns in the following chapters address these challenges in different ways. Two-Phase Commit provides strong consistency through coordination. Three-Phase Commit improves on 2PC's availability limitations. Sagas embrace eventual consistency with compensating transactions. The Outbox Pattern ensures reliable event publishing.

In the next chapter, we will explore Two-Phase Commit, the classic protocol for achieving atomicity across distributed systems.

Launching soon
