---
title: "Pub/Sub"
description: "Pub/Sub - System Design Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Pub/Sub

In the previous chapter, we explored message queues where each message is delivered to exactly one consumer. But what happens when multiple services need to react to the same event?

Consider what happens when a user places an order. The inventory service needs to reserve stock. The notification service needs to send a confirmation email. The analytics service needs to log the event. The fraud detection service needs to check for suspicious patterns.

If we used a traditional queue, only one of these services would receive the message.

This is where **publish-subscribe**, or **pub/sub**, comes in. In the pub/sub model, messages are broadcast to all interested subscribers. The publisher does not know or care who is listening. It simply announces that something happened, and anyone interested can react.

Pub/sub is foundational to event-driven architecture and enables loose coupling between services at scale.

In this chapter, you will learn:

*   How pub/sub differs from point-to-point messaging
*   The core concepts: publishers, subscribers, topics, and subscriptions
*   Message fanout and filtering patterns
*   Popular pub/sub technologies
*   When to use pub/sub and common patterns
*   Designing event-driven systems with pub/sub

# What is Publish-Subscribe?

Publish-subscribe is a messaging pattern where publishers send messages to a topic (or channel), and all subscribers to that topic receive a copy of the message.

Key differences from message queues:

Aspect

Message Queue

Pub/Sub

**Delivery**

One message → one consumer

One message → all subscribers

**Coupling**

Producer may know about consumer

Publisher does not know about subscribers

**Purpose**

Task distribution, work queues

Event notification, fanout

**Consumption**

Consuming removes message

Each subscriber gets a copy

# Core Concepts

Every Pub/Sub system has four essential components.

### Publishers

Publishers are the message producers. They create events and send them to topics. A publisher doesn't care who consumes the message or how many consumers there are.

### Topics

Topics are named channels that organize messages. They:

*   Have a unique name (e.g., `orders`, `user-events`)
*   Receive messages from publishers
*   Deliver copies to all subscribers
*   May support filtering or partitioning

### Subscribers

Subscribers express interest in one or more topics. When a message arrives on a topic, the system delivers it to all interested subscribers.

### Messages

Messages are the data packets flowing through the system. They typically contain:

*   **Payload:** The actual data (JSON, protobuf, etc.)
*   **Metadata:** Timestamp, message ID, headers
*   **Topic:** Which topic this message belongs to
*   **Attributes:** Key-value pairs for filtering

**Example message:**

# How Pub/Sub Works

### The Basic Flow

1.  Publisher sends a message to the topic
2.  Topic acknowledges receipt
3.  Topic delivers a copy to each subscriber
4.  Each subscriber processes and acknowledges independently

### Push vs Pull Delivery

**Push delivery:** The pub/sub system pushes messages to subscribers as they arrive.

**Pull delivery:** Subscribers poll the topic for new messages.

Aspect

Push

Pull

**Latency**

Lower (immediate delivery)

Higher (polling interval)

**Control**

Broker controls delivery rate

Subscriber controls fetch rate

**Complexity**

Subscriber needs endpoint

Subscriber manages polling

**Backpressure**

Harder to manage

Natural (subscriber pulls when ready)

**Use case**

Real-time, webhooks

Batch processing, rate control

# Message Fanout

Fanout is the core capability of pub/sub: one message reaches multiple subscribers.

### Simple Fanout

Every subscriber gets every message:

### Filtered Fanout

Subscribers only receive messages matching their filter:

Inventory only sees `OrderPlaced`. Notification only sees `OrderShipped`. Analytics sees everything.

# Topic Structures

### Flat Topics

Simple, single-level topic names:

Good for simple systems but can become unwieldy at scale.

### Hierarchical Topics

Topics organized in a tree structure:

Subscribers can subscribe to patterns:

*   `orders/*` - all order events
*   `orders/placed` - only order placed events
*   `#` - all events (in some systems)

### Event Types

Another approach: single topic with event types in the message:

Subscribers filter by message content rather than topic name.

# Subscriber Patterns

### Exclusive Subscription

Each subscription has exactly one subscriber. Common for stateful services:

### Shared Subscription

Multiple subscribers share a subscription. Messages are load-balanced:

This combines pub/sub fanout with competing consumers:

*   Multiple services subscribe (fanout)
*   Each service has multiple instances (load balancing)

### Durable vs Ephemeral Subscriptions

**Durable:** Messages are stored until acknowledged. If subscriber disconnects, messages accumulate and are delivered when it reconnects.

**Ephemeral:** Messages only delivered to currently connected subscribers. Miss messages while disconnected.

# Popular Pub/Sub Implementations

Different technologies implement Pub/Sub with varying trade-offs.

### Apache Kafka

Kafka works differently. It is a distributed log where messages persist and consumers track their position:

#### **Key characteristics:**

*   Messages persist on disk (configurable retention)
*   Consumers can replay from any offset
*   Partitions enable parallelism
*   Consumer groups provide load balancing within a subscription

**Best for:** High-throughput event streaming, event sourcing, data pipelines

### Amazon SNS (Simple Notification Service)

SNS (Simple Notification Service) is a fully managed Pub/Sub service from AWS.

#### **Key characteristics:**

*   Serverless, fully managed
*   Multiple subscription protocols (SQS, Lambda, HTTP, email, SMS)
*   Message filtering by attributes
*   No message persistence (fire and forget)

**Best for:** AWS-native applications, fan-out to multiple services, notifications

### Google Cloud Pub/Sub

Google's managed Pub/Sub service with global message delivery.

Feature

Details

**Type**

Fully managed, global

**Delivery**

At least once, push or pull

**Ordering**

Optional per-message key

**Retention**

Up to 7 days

**Best for**

GCP workloads, global scale

#### **Key characteristics:**

*   Global distribution with low latency
*   At-least-once delivery with acknowledgment deadlines
*   Message replay via Seek
*   Dead letter queues for failed messages

**Best for:** Global applications, GCP-native workloads, exactly-once processing needs

### Redis Pub/Sub

Redis provides lightweight in-memory Pub/Sub.

#### **Key characteristics:**

*   Fire and forget (no persistence)
*   Very fast (in-memory)
*   Simple to use
*   No acknowledgments or retries

**Best for:** Real-time features, cache invalidation, simple notifications where loss is acceptable

### Comparison

System

Persistence

Replay

Ordering

Managed

Best For

**Kafka**

Yes

Yes

Per-partition

Self/Managed

Event streaming

**AWS SNS**

No

No

No

Yes

Fan-out, notifications

**Google Pub/Sub**

Yes

Yes

Per-key

Yes

Global apps

**Redis**

No

No

No

Self/Managed

Real-time, simple cases

# Common Patterns

### Event Notification

The simplest pattern: publish an event to tell subscribers that something happened. Each subscriber decides what to do next.

This works well when subscribers are independent and you want loose coupling between services.

### Fan-Out to Queues

Use pub/sub for fan-out, then hand off to per-consumer queues for reliable processing and backpressure.

Each service has its own queue. The pub/sub layer handles fanout. The queues provide reliability and allow independent scaling.

### Event Sourcing

Store state as an append-only sequence of events. Pub/sub distributes those events so other services can build and maintain their own derived views (read models).

### CQRS (Command Query Responsibility Segregation)

Split writes and reads into separate models. Events become the bridge between the write side and the read side.

# Design Considerations

### Message Ordering

Most pub/sub systems do **not** guarantee global ordering. Two subscribers can see the same events in different sequences.

#### **If ordering matters**

*   **Partition the stream** (Kafka): events with the same key land in the same partition.
*   **Use ordering keys** (GCP Pub/Sub): preserve ordering per key.
*   **Assume ordering only within a partition/key**, not across the whole system.
*   **Design for out-of-order delivery**:

*   Include `eventTime`, `sequenceNumber`, or `version`
*   Buffer and reorder within a small window when feasible
*   Make handlers tolerant (ignore stale updates, use last-write-wins rules where appropriate)

### At-Least-Once Delivery

Most pub/sub systems provide at-least-once delivery. Subscribers may receive duplicates.

Message sent once → may be delivered **1, 2, or many** times.

#### **Subscribers must be idempotent**

*   **Track processed message IDs** (dedupe store with TTL)
*   **Use database upserts** (`INSERT ... ON CONFLICT DO UPDATE`)
*   **Make operations naturally idempotent**

*   “Set status = SHIPPED” (idempotent) instead of “increment shippedCount” (not idempotent)
*   Use idempotency keys for side effects (emails, payments, notifications)

### Subscriber Failure

Failures are inevitable. The question is what happens to the message when processing fails.

#### **Best practices**

*   Use **bounded retries** + **exponential backoff** to avoid retry storms.
*   Put poison messages into **DLQ** for manual inspection or automated repair.
*   Emit metrics: retry rate, DLQ rate, processing latency, consumer lag.
*   Keep retry behavior consistent: transient vs permanent failures should be treated differently.

### Schema Evolution

As events evolve, you need to handle:

*   Adding new fields (usually backward compatible)
*   Removing fields (may break old subscribers)
*   Changing field types (usually breaking)

#### Best practices:

*   Use schema registries (Confluent Schema Registry, AWS Glue)
*   Version your events
*   Prefer additive changes
*   Document breaking changes

# Real-World Architecture

Let us design a notification system using pub/sub:

**Design decisions:**

1.  **Single topic:** All notification-triggering events go to one topic
2.  **Router service:** Determines which channels each notification should use
3.  **Channel queues:** Each channel has its own queue for reliable delivery
4.  **Independent scaling:** Email, SMS, and push workers scale independently
5.  **Loose coupling:** Producers do not know about notification channels

# Summary

Publish-subscribe is a messaging pattern where messages are broadcast to all interested subscribers:

**Core concepts:**

*   **Publishers** send messages to topics
*   **Topics** are named channels that organize messages
*   **Subscribers** register interest and receive copies
*   **Subscriptions** link subscribers to topics with optional filtering

**Key patterns:**

*   **Fanout:** One message reaches all subscribers
*   **Filtering:** Subscribers receive only matching messages
*   **Fan-out to queues:** Combine pub/sub with queues for reliability
*   **Event sourcing:** Broadcast state changes to multiple read models

**Delivery modes:**

*   **Push:** Low latency, broker-controlled rate
*   **Pull:** Subscriber-controlled rate, higher latency
*   **Durable:** Messages persist until acknowledged
*   **Ephemeral:** Messages only delivered to connected subscribers

**Design considerations:**

*   Most systems provide at-least-once delivery
*   Subscribers must be idempotent
*   Ordering is typically per-partition, not global
*   Schema evolution requires planning

Pub/sub enables event-driven architectures where services react to events without tight coupling. Combined with message queues, it provides the foundation for scalable, resilient distributed systems.

Now that we understand both message queues and pub/sub, an obvious question arises: when should you use each? In the next chapter, we will directly compare these two patterns and provide guidance on choosing between them.

Launching soon
