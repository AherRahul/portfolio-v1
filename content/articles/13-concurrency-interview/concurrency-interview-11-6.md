---
title: "Design Multithreaded Pub-Sub System"
description: "Design Multithreaded Pub-Sub System - Concurrency Interview Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Multithreaded Pub-Sub System

What is Pub-Sub?

Publish-Subscribe (Pub-Sub) is a messaging pattern where senders (publishers) don't send messages directly to receivers (subscribers). Instead, publishers categorize messages into topics, and subscribers express interest in specific topics.

When a publisher sends a message to a topic, the system delivers it to all subscribers of that topic.

#### **Why do we need it?**

*   **Decoupling:** Publishers don't need to know who the subscribers are, and subscribers don't need to know who the publishers are. This loose coupling makes systems easier to evolve and scale.
*   **One-to-many communication:** A single message can reach multiple consumers without the publisher explicitly managing the distribution.
*   **Asynchronous processing:** Subscribers can process messages at their own pace without blocking publishers.
*   **Event-driven architecture:** Enables reactive systems where components respond to events rather than polling for changes.

#### **Real-world examples**

System

How it uses Pub-Sub

**Apache Kafka**

Distributed event streaming with topics, partitions, and consumer groups

**Redis Pub/Sub**

Lightweight in-memory message broadcasting

**RabbitMQ**

Message broker with exchanges, queues, and bindings

**AWS SNS**

Cloud-native fan-out messaging to multiple subscribers

In this chapter, we'll design an in-memory concurrent Pub-Sub system that handles the core concurrency challenges. Let's start by defining exactly what we need to build.

# 1\. Problem Definition

Question

**Design a thread-safe publish-subscribe messaging system where multiple publishers can send messages to topics and multiple subscribers can receive messages from topics they've subscribed to.**

At first glance, Pub-Sub seems simple: maintain a list of subscribers per topic, and when a message arrives, iterate through the list and deliver. But once multiple threads are publishing, subscribing, and unsubscribing simultaneously, the problem becomes a real concurrency challenge.

Consider what happens when a publisher is iterating through subscribers to deliver a message at the exact moment a subscriber decides to unsubscribe. Or when two threads try to create the same topic simultaneously. Or when a slow subscriber can't keep up with a fast publisher, causing unbounded queue growth.

Core Requirements

*   **Topic management:** Create and delete topics dynamically. Multiple threads may attempt to create the same topic simultaneously.
*   **Subscriber management:** Subscribers can subscribe and unsubscribe at any time, even while messages are being delivered.
*   **Message publishing:** When a message is published to a topic, all current subscribers must receive it.
*   **Message ordering:** Messages published to a topic should be delivered to each subscriber in the order they were published.
*   **Backpressure handling:** Slow subscribers should not block publishers or cause unbounded memory growth.

Non-functional requirements

*   **Thread-safety:** All operations must be safe under concurrent access
*   **Deadlock-free:** System must never deadlock regardless of thread interleaving
*   **High throughput:** Publishers should not block waiting for subscribers to consume
*   **Fairness:** All subscribers should receive messages, none should starve

With these requirements in mind, let's design the system architecture.

# 2\. System Overview

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
