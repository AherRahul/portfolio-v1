---
title: "Sync vs Async Communication"
description: "Sync vs Async Communication - System Design Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Sync vs Async Communication

When you click "Place Order" on an e-commerce website, something interesting happens behind the scenes. The order service needs to talk to the inventory service, the payment service, and the notification service.

**But how should these services communicate?**

The answer to this question shapes the entire architecture of your system. It affects latency, reliability, scalability, and how your system behaves when things go wrong.

There are two fundamental approaches: **synchronous** and **asynchronous communication**. In synchronous communication, a service sends a request and waits for a response before continuing. In asynchronous communication, a service sends a message and continues with its work without waiting for an immediate response.

Neither approach is universally better. The right choice depends on your specific requirements, and most real-world systems use both. Understanding when to use each is a core skill for system design.

In this chapter, you will learn:

*   How synchronous and asynchronous communication differ
*   The trade-offs of each approach
*   When to use synchronous vs asynchronous patterns
*   How these patterns apply in microservices architectures
*   Real-world examples of both approaches

This chapter sets the foundation for the rest of this section, where we will dive deep into async patterns like message queues, pub/sub, and more.

# Synchronous Communication

Synchronous communication is the request-response model you are probably most familiar with. A client sends a request, waits for the server to process it, and receives a response. The client is blocked during this time.

### How It Works

The flow is straightforward:

1.  Client sends a request to the server
2.  Client waits (blocks) for the response
3.  Server processes the request
4.  Server sends back the response
5.  Client receives the response and continues

This is how HTTP APIs, gRPC calls, and traditional database queries work. The caller expects an immediate answer.

### Real-World Example: REST API Call

Consider a mobile app checking a user's account balance:

Each service waits for its downstream dependency to respond. The total latency is the sum of all individual latencies.

### Advantages

*   **Simple mental model**: Request goes in, response comes out. Easy to understand and debug.
*   **Immediate feedback**: Caller knows right away if the operation succeeded or failed.
*   **Strong consistency**: After the call returns, both parties agree on the outcome.
*   **Easy error handling**: Errors propagate naturally through the call stack.
*   **Familiar tooling**: Most developers are experienced with REST, gRPC, and similar protocols.

### Disadvantages

*   **Tight coupling**: Caller must know about the callee. Changes to one may affect the other.
*   **Blocking**: Caller cannot do other work while waiting. Threads are tied up.
*   **Cascading failures**: If the callee is slow or down, the caller is also affected.
*   **Latency accumulation**: In a chain of calls, latencies add up.
*   **Reduced availability**: System availability is the product of all services' availabilities.

### The Availability Problem

Consider a system where Service A calls Service B, which calls Service C:

Each service has 99.9% availability (about 8.7 hours downtime per year). But the overall system availability is:

That is 26 hours of downtime per year, three times worse than any individual service. Add more services, and availability degrades further. This is the fundamental challenge of synchronous architectures.

# Asynchronous Communication

Asynchronous communication decouples the sender from the receiver. The sender publishes a message and immediately continues with its work. The message is stored in an intermediary (like a queue), and the receiver processes it when ready.

### How It Works

The flow introduces an intermediary:

1.  Sender publishes a message to a queue or topic
2.  Sender receives acknowledgment that the message was stored
3.  Sender continues with other work
4.  Receiver pulls messages when it is ready
5.  Receiver processes the message
6.  Receiver acknowledges successful processing

The sender and receiver do not need to be active at the same time. The queue acts as a buffer.

### Real-World Example: Order Processing

Consider the order placement scenario we mentioned earlier:

The user gets a response as soon as the order is saved. The inventory reservation, payment processing, and email notification happen asynchronously. If the notification service is slow, it does not affect the user's experience.

### Advantages

*   **Loose coupling**: Sender does not need to know about receivers.
*   **Improved availability**: If a receiver is down, messages queue up and are processed later.
*   **Better scalability**: Add more consumers to handle increased load.
*   **Load leveling**: Queue absorbs traffic spikes, smoothing demand.
*   **Resilience**: Failures in one service do not cascade to others.
*   **Parallel processing**: Multiple receivers can process messages concurrently.

### Disadvantages

*   **Eventual consistency**: Data is not immediately consistent across services.
*   **Complexity**: Harder to trace and debug distributed message flows.
*   **No immediate response**: Sender does not know if processing succeeded.
*   **Message ordering**: Messages may arrive out of order.
*   **Duplicate handling**: Messages may be delivered more than once.
*   **Infrastructure**: Requires a message broker, adding operational complexity.

### The Eventual Consistency Challenge

When you use async communication, you accept that different parts of the system may temporarily have different views of the data.

During the time between sending and processing, the system is in an inconsistent state. This is acceptable for many use cases but must be carefully managed.

# When to Use Each Approach

### Use Synchronous When:

1.  **You need an immediate answer.** The user is waiting for the result, and there is no way to proceed without it.
2.  **Strong consistency is required.** Financial transactions, inventory checks before purchase, authentication.
3.  **The operation is simple and fast.** If the downstream call takes 50ms, synchronous is fine.
4.  **You are building a simple system.** Not every system needs async complexity.

#### Examples of synchronous operations:

*   User login (need authentication result)
*   Check account balance (user is waiting)
*   Validate credit card (before proceeding)
*   Fetch user profile (to display on page)
*   Search results (user expects immediate response)

### Use Asynchronous When:

1.  **The operation can be deferred.** Sending emails, generating reports, data processing.
2.  **You need resilience.** If a downstream service fails, you want to retry later rather than fail the entire request.
3.  **You are dealing with spiky traffic.** Queues smooth out load spikes.
4.  **Multiple services need to react.** Events that trigger multiple downstream actions.
5.  **The operation is slow.** Video encoding, PDF generation, batch processing.

#### Examples of asynchronous operations:

*   Send order confirmation email
*   Update search index after product change
*   Generate monthly report
*   Process uploaded video
*   Sync data between systems
*   Trigger analytics events

### The Hybrid Approach

Most real systems use both. The user-facing request path is often synchronous for immediate feedback, while background processing is asynchronous.

The user gets a fast response. Everything else happens in the background.

# Common Patterns

### Request-Response (Synchronous)

The classic pattern. Client sends a request, server sends a response.

**Protocols:** HTTP, gRPC, GraphQL, database queries

### Fire and Forget (Asynchronous)

Sender publishes a message and moves on. Does not care about the result.

**Use case:** Logging events, analytics, audit trails

### Request-Async Response

Sender publishes a request message and later receives a response on a different channel.

**Use case:** Long-running operations where client needs the result eventually

### Publish-Subscribe

Publisher emits events. Multiple subscribers receive them.

**Use case:** Event notification, fanout, real-time updates

We will explore message queues and pub/sub in depth in the next chapters.

# Real-World Architecture: E-Commerce

Let us see how a real e-commerce system might combine both approaches:

#### **Synchronous path (user-facing):**

1.  User clicks checkout
2.  API validates cart and prices synchronously
3.  Order is created and saved
4.  User gets order confirmation with order ID

#### **Asynchronous path (background):**

1.  Order event is published
2.  Multiple services process independently
3.  If email service is slow, it does not affect the user

This pattern gives users fast responses while ensuring all backend processing eventually completes.

# Summary

Synchronous and asynchronous communication represent two fundamentally different approaches to service interaction:

#### **Synchronous communication:**

*   Request-response model where the caller waits
*   Simple mental model and immediate feedback
*   Tight coupling between services
*   Availability is the product of all services' availabilities
*   Best for user-facing queries and operations requiring immediate results

#### **Asynchronous communication:**

*   Message-based model where the caller continues without waiting
*   Decoupling through a message broker
*   Improved availability and resilience
*   Eventual consistency is the trade-off
*   Best for background processing, event propagation, and spike handling

**Most systems use both.** The user-facing path is often synchronous for immediate feedback, while background processing is asynchronous for resilience and scalability.

Key numbers to remember:

*   Three services at 99.9% availability give 99.7% overall in sync systems
*   Async systems can maintain availability even when downstream services are temporarily down
*   Message queues can buffer traffic spikes, smoothing demand over time

In the next chapter, we will dive into message queues, the fundamental building block of asynchronous communication. You will learn how they work, when to use them, and how to design systems around them.

Launching soon
