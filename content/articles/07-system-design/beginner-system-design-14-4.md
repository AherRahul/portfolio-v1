---
title: "SAGA Pattern"
description: "SAGA Pattern - System Design Module 14"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# SAGA Pattern

Imagine you’re building a travel booking website. A user wants to book a complete package: a **flight**, a **hotel**, and a **rental car**.

Each of these is managed by a **different microservice**. The flight is booked, the hotel is confirmed, but then the car rental service fails.

What happens now?

You can't leave the user with a partial booking. You need to undo the previous steps, but how do you coordinate this across independent services, each with its own database?

This is the classic distributed transaction problem, and the **SAGA pattern** is the modern solution.

In this chapter, we will walk you through the SAGA pattern, explaining how it ensures data consistency in a world of distributed systems without the bottlenecks of traditional approaches.

# 1\. What Is the SAGA Pattern?

The **SAGA Pattern** is a design approach to maintain data consistency across distributed services by breaking down a large, long-lived transaction into a sequence of smaller, independent **local transactions**.

Each local transaction updates the database within a single service and then triggers the next step in the process, usually by publishing an event or sending a command.

The crucial part of the pattern is what happens when something goes wrong.

If any local transaction fails, the saga executes a series of **compensating transactions** to undo the work of the previously completed transactions.

### SAGA Flow Diagram

*   **Happy path:** Each service commits locally and hands off to the next.
*   **Failure path:** On error, each prior service runs its **compensation** to undo its part.

### Compensating Transactions

A **compensating transaction** is an operation that logically reverses the action of a previous local transaction. It's crucial to understand that it's not a simple database rollback. You can't just "un-send" an email.

**Design**: A compensating action must be **idempotent** (safe to retry) and can never fail (or must have a robust retry mechanism).

**Examples**:

*   **Forward Action**: Debit account. **Compensating Action**: Credit account.
*   **Forward Action**: Reserve inventory. **Compensating Action**: Release inventory.
*   **Forward Action**: Send notification. **Compensating Action**: Send "cancellation" notification.

The goal of SAGA is **eventual consistency**, not the immediate, all-or-nothing atomicity of a traditional transaction. This means there will be a brief period where the system is in an inconsistent state before the compensation completes.

# 2\. Why We Need SAGA in Microservices

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
