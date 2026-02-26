---
title: "Pub-Sub vs Message Queue vs Message Broker"
description: "When you’re working on a distributed system and need components to communicate asynchronously, you’ll hear terms like: “pub-sub”, “message queue”, and “message broker”."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/pub-sub-vs-message-queue-vs-message-broker.md"
dateModified: "2025-12-10"
datePublished: "2025-12-10"
showOnArticles: true
topics:
  - system-design
---

When you’re working on a distributed system and need components to  **communicate asynchronously** , you’ll hear terms like:  **“pub-sub”, “message queue”** , and  **“message broker”** .

Although they are used interchangeably sometimes, they’re not the same thing.

**Simply put:**

> A message broker is the  **infrastructure** . Message queues and pub-sub are  **messaging patterns**  that brokers implement.

In this article, we’ll explore:

- What each term means
- How they differ architecturally
- When to use each pattern
- Real-world examples and use cases
- How modern systems like Kafka, RabbitMQ, and Redis fit in

# 1. The Core Concepts

Before diving into comparisons, let’s define each term clearly.

## 1.1 Message Broker

A  **message broker**  is the middleware infrastructure that receives, stores, and routes messages between producers and consumers. It’s the “thing” that sits in the middle.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/174a1db8-0687-48b2-b2f7-e9e37a3ec1c6_1962x548.png)](https://substackcdn.com/image/fetch/$s_!VjPv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F174a1db8-0687-48b2-b2f7-e9e37a3ec1c6_1962x548.png)

Think of a message broker like a post office. It receives mail (messages), stores it temporarily, and delivers it to the right recipients based on addresses (routing rules).

**Examples:**  RabbitMQ, Apache Kafka, ActiveMQ

#### Key responsibilities:

- Accept messages from producers
- Store messages durably or transiently
- Route messages to appropriate consumers
- Handle delivery guarantees (at-least-once, exactly-once)
- Manage consumer acknowledgments

## 1.2 Message Queue

A  **message queue**  is a messaging pattern where messages are sent to a queue and consumed by exactly one consumer. Messages are typically processed in order and removed from the queue after consumption.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2726eea3-4c83-4894-8c3e-f1788fc9841e_1902x588.png)](https://substackcdn.com/image/fetch/$s_!SGXq!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2726eea3-4c83-4894-8c3e-f1788fc9841e_1902x588.png)

Message queues enable  **asynchronous service-to-service communication** , especially in serverless and microservices architectures. They allow you to build reliable background processing, work distribution, and decoupled systems.

**Examples:** SQS queues, RabbitMQ queues

When multiple consumers connect to the same queue, they compete for messages. Each message goes to exactly one consumer.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/ed34852e-2684-4403-b2b7-7270f92065ca_1810x904.png)](https://substackcdn.com/image/fetch/$s_!QzR0!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fed34852e-2684-4403-b2b7-7270f92065ca_1810x904.png)

#### Key Characteristics:

- **Delivery:** Exactly one consumer receives each message
- **Ordering:** First-In-First-Out (FIFO) ordering within a single queue
- **Persistence:** Messages stored until consumed and acknowledged
- **Acknowledgment:** Consumer must confirm successful processing
- **Retry:** Failed messages can be retried or dead-lettered

## 1.3 Pub-Sub (Publish-Subscribe)

**Pub-Sub**  is a messaging pattern where publishers send messages to topics, and all subscribers to that topic receive a copy of the message. Messages are broadcast, not consumed exclusively.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/9ef3ab1f-d1a7-4cfc-909b-5869cadc3265_1988x836.png)](https://substackcdn.com/image/fetch/$s_!ZveM!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9ef3ab1f-d1a7-4cfc-909b-5869cadc3265_1988x836.png)

Think of it like a radio broadcast. The station (publisher) broadcasts a signal (message), and everyone tuned to that frequency (subscribers) receives it simultaneously.

It’s an  **asynchronous communication**  model that decouples services, making it easier to build  **scalable, event-driven systems** . Pub/Sub is widely used in modern cloud architectures to deliver instant event notifications and enable reliable communication between independent components.

**Examples:** Redis Pub/Sub, SNS

Pub-sub naturally implements fan-out in event-drive architectures, where one event triggers multiple actions:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2056c392-d7ce-4dec-9945-3dcc47baf27f_1852x758.png)](https://substackcdn.com/image/fetch/$s_!ZdUz!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2056c392-d7ce-4dec-9945-3dcc47baf27f_1852x758.png)

#### Key Characteristics:

- **Delivery:** One-to-many. Each message delivered to all subscribers.
- **Decoupling:** Publishers and subscribers are decoupled
- **Scalability:** Easy to add new subscribers
- **Persistence:** Messages may or may not be removed after delivery (depends on implementation)

# 2. How Brokers Implement Both

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
