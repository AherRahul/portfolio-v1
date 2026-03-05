---
title: "Design Thread-Safe Rate Limiter"
description: "Design Thread-Safe Rate Limiter - Concurrency Interview Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Thread-Safe Rate Limiter

What is Rate Limiting?

Rate limiting is a technique to control how many requests a client can make to a service within a given time window. It protects services from being overwhelmed, ensures fair resource sharing among clients, and prevents abuse.

#### **Why do we need it?**

*   **Protect services from overload:** Without rate limiting, a single client (malicious or buggy) could flood your API with millions of requests, crashing your servers or degrading performance for everyone.
*   **Fair resource sharing:** In multi-tenant systems, rate limiting ensures one heavy user doesn't starve others of resources.
*   **Cost control:** Cloud services charge per request. Rate limiting caps costs for both providers and consumers.
*   **Security:** Slows down brute-force attacks, credential stuffing, and scraping.

#### **Common rate limiting algorithms**

Scroll

Algorithm

How it works

Pros

Cons

**Fixed Window**

Count requests in fixed time windows (e.g., 100 req/minute)

Simple to implement

Burst at window boundaries

**Sliding Window**

Rolling time window, smooths fixed window edges

Smoother limits

More complex, needs timestamped logs

**Leaky Bucket**

Requests "leak" out at constant rate

Smooths traffic perfectly

Can delay requests

**Token Bucket**

Tokens refill over time, consumed per request

Allows bursts, smooth sustained rate

Slightly more complex

For this problem, we'll implement the **Token Bucket** algorithm because it's widely used in production systems. It provides a good balance: it allows short bursts of traffic (up to bucket capacity) while enforcing a sustained average rate.

### Token Bucket Rate Limiter

Capacity: **10** | Refill: **2/sec** | Each request consumes 1 token

100

10.0

tokens

0

Allowed

0

Rejected

StartSend Request

Request Log

No requests yet

# 1\. Problem Definition

Question

**Design a thread-safe rate limiter that caps how many requests a client can make in a given time window.**

At first glance, the requirement sounds simple: track request counts and reject when limits are exceeded. But once your API server handles requests on dozens of threads simultaneously, the problem becomes a real concurrency challenge.

Two threads might check the same counter at the exact same moment, both see "1 token remaining," both proceed, and now you have allowed 2 requests when only 1 was permitted.

Core Requirements

*   **Per-client limits:** Each client (identified by API key, user ID, or IP) has its own quota that refills over time.
*   **Atomic check-and-decrement:** When a request arrives, checking available tokens and decrementing must happen atomically, or multiple threads can exceed the limit.
*   **Token refill:** Tokens replenish at a configured rate. A bucket with 100 tokens per second should smoothly allow bursts while enforcing the average rate.
*   **Efficient at scale:** The system must handle thousands of concurrent clients without becoming a bottleneck itself.

In short, the system must guarantee that no client exceeds their allowed rate, even under extreme concurrency, while maintaining low latency for legitimate requests.

# 2\. Token Bucket Algorithm Explained

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
