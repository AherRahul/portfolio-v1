---
title: "Types of System Design Questions"
description: "Types of System Design Questions - System Design Interviews Module 2"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Types of System Design Questions

Not all system design questions are the same.

"Design Instagram" requires different skills than "Design a Rate Limiter." One focuses on user-facing features and data modeling. The other focuses on algorithms and distributed systems primitives.

Understanding the different types of system design questions helps you prepare more effectively. Each type emphasizes different concepts and requires a different approach.

In this chapter, I'll break down the four main categories of system design questions: what each type looks like, what it actually tests, where candidates typically struggle, and how to approach each one effectively.

# Overview of Question Types

System design questions generally fall into four main categories:

The mental model you need for each type is different. Product design is about understanding users and features. Infrastructure design is about algorithms and guarantees. Data system design is about throughput and storage. API design is about contracts and developer experience.

Type

What It Tests

Examples

Where Candidates Struggle

**Product Design**

Feature prioritization, data modeling, scale

Twitter, Uber, WhatsApp

Trying to design too many features

**Infrastructure Design**

Algorithms, distributed systems, failure handling

Rate limiter, cache, queue

Not knowing the underlying algorithms

**Data System Design**

Data pipelines, storage optimization, query patterns

Search, logging, analytics

Underestimating data volumes

**API Design**

Interface contracts, versioning, developer experience

Payment API, webhooks

Ignoring edge cases and errors

Let's dig into each one.

# 1\. Product Design Questions

Product design questions are what most people think of when they hear "system design interview." Design Twitter. Design Uber. Design Netflix. These are the classics.

### What Makes Them Different

The advantage of product design questions is shared context. Both you and the interviewer know what Instagram does. You don't need to spend time explaining the product; you can focus entirely on how to build it.

But this shared context is also a trap. Because you know Instagram has posts, likes, comments, DMs, stories, notifications, search, trending, bookmarks, and a dozen other features, you might try to design all of them. That's a mistake.

In 45 minutes, you can design maybe 2-3 features well. Trying to cover everything means covering nothing deeply.

### Common Product Design Questions

*   Design Twitter / X
*   Design Instagram
*   Design WhatsApp
*   Design Uber / Lyft
*   Design Netflix / YouTube
*   Design Airbnb
*   Design Dropbox / Google Drive
*   Design Slack / Discord
*   Design Amazon / E-commerce platform
*   Design Spotify

### What Interviewers Are Looking For

Product design questions test whether you can translate product requirements into technical architecture:

**Feature prioritization:** When given a complex product, can you identify the 2-3 features that define its core value? Twitter without the feed isn't Twitter. Everything else is secondary.

**Data modeling:** Can you design schemas that support the product's functionality? How do you model the relationship between users, tweets, and followers? What indexes do you need for common queries?

**Scale intuition:** When I tell you Twitter has 500 million tweets per day, does that change your design? It should. That's 5,800 tweets per second. Your single PostgreSQL instance won't cut it.

**Trade-off reasoning:** Should you pre-compute feeds or compute them on demand? There's no right answer, but you need to understand why you'd choose one over the other.

### The Concepts You Need

Product design questions draw from a consistent set of building blocks:

*   **Database design:** SQL vs NoSQL, schema design, indexing
*   **Caching strategies:** What to cache, cache invalidation, CDNs
*   **Feed generation:** Push vs pull, fan-out strategies
*   **Real-time features:** WebSockets, long polling, server-sent events
*   **Media handling:** Image/video storage, transcoding, streaming
*   **Search:** Full-text search, indexing, relevance ranking

### How to Approach Product Design Questions

Most products have dozens of features. You can’t design all of them in a 45-minute interview, so start by clarifying the requirements and narrowing the scope.

Example Discussion

"Instagram has feed, stories, reels, DMs, search, explore, shopping, and more. For this interview, should I focus on the core photo-sharing experience: posting photos, following users, and viewing the feed? Or is there a specific feature you'd like me to prioritize?"

This isn't just being polite. It's showing that you understand the impossibility of designing everything and that you know how to prioritize.

**Design the core APIs and data model**

Before drawing boxes, define the foundation:

*   What are the core entities?
*   What are the core APIs the system should expose?
*   How do entities relate with each other?
*   What are the most common queries and access patterns?

**Then build the architecture around the data.** Now you can draw the components:

**Dive deep on the interesting problem**

Every product has one or two genuinely hard problems. For Instagram, it's feed generation. For Uber, it's matching drivers to riders. For Netflix, it's video streaming and recommendations.

This is where you show depth. Don't just say "we'll generate the feed." Explain the trade-offs between fan-out-on-write (pre-compute feeds when someone posts) and fan-out-on-read (compute feeds when someone opens the app). Discuss how you'd handle celebrities with millions of followers.

# 2\. Infrastructure Design Questions

Infrastructure design questions are where the rubber meets the road. They ask you to design foundational systems that other applications depend on. Rate limiters. Caches. Message queues. ID generators.

They're not user-facing products but critical components that enable products to function reliably and efficiently.

### What Makes Them Different

Infrastructure questions have a fundamentally different character than product questions. When you design Instagram, there's room for interpretation. You can make product decisions. With a rate limiter, there's less ambiguity. A rate limiter has to limit rates. It has to be fast. It has to work in a distributed environment.

This means infrastructure questions are more algorithmic. You need to know specific algorithms: token bucket for rate limiting, consistent hashing for distributed caches, sliding windows for time-based counting. If you don't know these algorithms, you'll struggle to make progress.

### **Common** Infrastructure Design Questions

*   Design a Rate Limiter
*   Design a URL Shortener
*   Design a Distributed Cache
*   Design a Message Queue
*   Design a Task Scheduler
*   Design a Load Balancer
*   Design a Distributed Lock
*   Design a Unique ID Generator
*   Design a Web Crawler
*   Design a Notification System

### What Interviewers Are Looking For

Infrastructure questions reveal whether you understand how systems actually work under the hood:

**Algorithm knowledge:** When I ask you to design a rate limiter, I expect you to know about token bucket, leaky bucket, and sliding window algorithms. Not necessarily every detail, but enough to discuss trade-offs. If you've never heard of these, you're going to struggle.

**Distributed systems thinking:** A rate limiter on a single machine is trivial. The challenge is making it work across 100 machines while maintaining accuracy. How do you count requests across servers? What happens when a node fails? This is what separates junior from senior thinking.

**Failure handling:** Infrastructure components can't just crash and restart. If your rate limiter goes down, either everyone gets blocked or everyone gets unlimited access. Neither is acceptable. What's your strategy?

**Performance intuition:** A rate limiter that adds 100ms to every request is useless. You need to understand that this component sits in the critical path and must be fast. That shapes your entire design.

### The Concepts You Need

Infrastructure design questions require deeper algorithmic knowledge than product design:

*   **Hashing:** Consistent hashing, hash functions, collision handling
*   **Consensus:** Leader election, distributed coordination
*   **Replication:** Primary-replica, multi-leader, leaderless
*   **Partitioning:** Range partitioning, hash partitioning
*   **Rate limiting algorithms:** Token bucket, leaky bucket, sliding window
*   **Queue semantics:** At-least-once, at-most-once, exactly-once delivery
*   **Caching patterns:** Write-through, write-back, cache-aside

### How to Approach Infrastructure Design Questions

**Start with the single-machine case**

Before you worry about distribution, make sure you understand the core algorithm. A rate limiter on one machine is just a counter with a time window. Get that right first.

**Then introduce distribution**

Now the interesting problems appear. How do you count across machines? Do you need strong consistency (every request sees the exact same count) or is eventual consistency acceptable (counts might be slightly off)?

**Design for failure**

What happens when a node goes down? What happens when the network partitions? For infrastructure components, "it crashes" isn't an answer. These systems need to fail gracefully.

# 3\. Data System Design Questions

Data system design questions deal with a different kind of scale: not millions of users, but billions of events. These systems ingest, process, store, and query massive amounts of data. Logging systems. Analytics platforms. Search engines. Recommendation systems.

### What Makes Them Different

The mental model for data systems is fundamentally about flow. Data comes in (ingestion), gets transformed (processing), lands somewhere (storage), and gets queried (serving). Each stage has different constraints and technologies.

Product design questions are about user experience. Infrastructure design questions are about algorithms and reliability. Data system questions are about throughput, storage costs, and query latency at massive scale. When you're dealing with 100,000 events per second and petabytes of storage, every design decision has cost implications.

### **Common** Data System Design Questions

*   Design a Search Engine / Autocomplete
*   Design a Logging System
*   Design a Metrics/Monitoring System
*   Design a Data Warehouse
*   Design a Real-time Analytics Dashboard
*   Design a Recommendation System
*   Design a Fraud Detection System
*   Design a Trending Topics System
*   Design an Ad Click Aggregator
*   Design a News Feed Ranking System

### What Interviewers Are Looking For

Data system questions reveal whether you understand how to handle data at scale:

**Data pipeline thinking:** Can you design the flow from data source to final query? This means understanding ingestion (how data gets in), processing (how it's transformed), storage (where it lives), and serving (how it's queried).

**Storage trade-offs:** Row stores vs column stores. Real-time indexes vs batch-optimized storage. Hot storage vs cold storage. Each has different performance characteristics and cost profiles. Do you know when to use each?

**Batch vs stream processing:** Some computations need to happen in real-time. Others can wait for a nightly batch job. The difference in architecture is massive. Do you know which is which?

**Approximation awareness:** At scale, exact answers are often impossible or prohibitively expensive. HyperLogLog for counting unique items. Bloom filters for membership tests. Count-Min Sketch for frequency estimation. Do you know these exist and when to use them?

### The Concepts You Need

Data system design requires understanding the data processing stack:

*   **Storage formats:** Row vs column storage, compression
*   **Indexing:** B-trees, LSM trees, inverted indexes
*   **Batch processing:** MapReduce, Spark, data pipelines
*   **Stream processing:** Kafka, Flink, real-time aggregation
*   **Time-series databases:** Efficient storage of timestamped data
*   **Approximate algorithms:** HyperLogLog, Count-Min Sketch, Bloom filters
*   **Data partitioning:** How to shard large datasets
*   **OLTP vs OLAP:** Transactional vs analytical workloads

### How to Approach Data System Design Questions

**Start with the numbers**

Data system design is all about scale. Before you draw any boxes, establish:

*   How much data per day/month/year?
*   How many events per second?
*   What queries need to be fast? What can be slow?
*   How long do you need to keep data?

These numbers drive everything else.

**Design the pipeline from left to right**

Follow the data:

**Choose storage based on query patterns**

This is critical. Different queries need different storage:

*   Point lookups → Key-value store (Redis, DynamoDB)
*   Full-text search → Inverted index (Elasticsearch)
*   Time-range queries → Time-series database (InfluxDB, TimescaleDB)
*   Analytical aggregations → Column store (ClickHouse, BigQuery)

**Consider the cost curve**

Data systems have ongoing storage costs. Design for data lifecycle: hot storage for recent data, warm for medium-term, cold for archives. Know when to sample, aggregate, or delete.

# 4\. API Design Questions

API design questions are less common than the other three types, but they're increasingly popular at companies that build platforms: Stripe, Twilio, Plaid, and similar developer-focused businesses. Instead of designing a system's internals, you're designing its interface.

### What Makes Them Different

API design flips the perspective. Instead of asking "how do we build this system?", the question becomes "how do developers interact with this system?" The internal implementation matters less. What matters is whether the interface is intuitive, consistent, and robust.

This requires a different kind of thinking. You need to put yourself in the shoes of a developer who has never seen your API before. Will they be able to figure out how to charge a customer without reading documentation? When something goes wrong, will the error message help them fix it?

### **Common** API Design Questions

*   Design a Payment API (like Stripe)
*   Design a Webhook System
*   Design a File Upload API
*   Design an Authentication API
*   Design a Notification API
*   Design a Search API
*   Design a Booking/Reservation API

### What Interviewers Are Looking For

API design questions test your ability to create interfaces that other developers will use:

**Resource modeling:** Can you identify the right nouns in the system? A payment API has payments, customers, payment methods, and refunds. Getting this abstraction right is half the battle.

**HTTP semantics:** Do you know when to use POST vs PUT vs PATCH? What status code should a failed payment return? These conventions exist for a reason, and violating them makes your API harder to use.

**Error handling:** When something goes wrong, can the developer figure out why? "Error: Bad Request" is useless. "Error: The card was declined because it has insufficient funds" is actionable.

**Edge case awareness:** What happens if someone retries a payment and it goes through twice? What if they request page 10000 of results? API design is full of edge cases that require explicit handling.

**Backward compatibility:** APIs need to evolve without breaking existing clients. Do you know how to add fields, deprecate endpoints, and version your API?

### The Concepts You Need

API design has its own set of patterns and best practices:

*   **REST conventions:** Resources, HTTP methods, status codes
*   **Authentication:** API keys, OAuth, JWT
*   **Pagination:** Cursor-based vs offset-based
*   **Rate limiting:** Per-user limits, response headers
*   **Versioning strategies:** URL path, header, query parameter
*   **Idempotency keys:** Safe retries for non-idempotent operations
*   **Webhooks:** Event delivery, retry policies, signature verification
*   **Documentation:** OpenAPI/Swagger, examples, error codes

### How to Approach API Design Questions

**Start with resources, not endpoints**

Before you write any URLs, identify the nouns in your system. For a payment API:

*   Customers (the people paying)
*   Payment Methods (their cards, bank accounts)
*   Payments (the actual transactions)
*   Refunds (reversals of payments)

Each resource will have its own set of endpoints.

**Map operations to HTTP methods**

This is mostly mechanical once you have the resources:

Scroll

Operation

HTTP Method

Example

Create

POST

POST /payments

Read

GET

GET /payments/{id}

Update

PUT/PATCH

PATCH /payments/{id}

Delete

DELETE

DELETE /payments/{id}

List

GET

GET /payments

**Design the request and response formats**

Be consistent. If you use `snake_case` in one endpoint, use it everywhere. Include all the information a developer needs.

**Handle everything that can go wrong**

For every endpoint, ask: what if the input is invalid? What if the resource doesn't exist? What if the operation fails partway through? Design error responses for all of these.

**Think about developer experience**

Would you want to use this API? Is it discoverable? Are the names intuitive? Can you debug problems from error messages alone?

# How to Identify Question Types

In the first minute of an interview, you need to recognize what type of question you're facing. This shapes your entire approach.

**Watch for hybrid questions.** Some questions blend multiple types:

*   **"Design YouTube"** is primarily product design, but includes data system design (video storage, transcoding pipeline) and infrastructure design (CDN).
*   **"Design a notification system"** is infrastructure, but has API design aspects (how do clients configure notifications?) and data system aspects (storing billions of notification events).

When you recognize a hybrid, acknowledge it. **Example:** "This touches on both product design and data systems. Should I focus on the user-facing notification experience, or the infrastructure for delivering notifications at scale?"

# Key Takeaways

1.  **System design questions fall into four main categories:** Product Design, Infrastructure Design, Data System Design, and API Design. Each tests different skills.
2.  **Product design questions** focus on user-facing features, data models, and scaling consumer applications like Twitter or Uber.
3.  **Infrastructure design questions** focus on building blocks like rate limiters, caches, and queues. They test your understanding of distributed systems primitives.
4.  **Data system design questions** focus on storing, processing, and querying large volumes of data. They test your knowledge of data pipelines and storage systems.
5.  **API design questions** focus on creating clean interfaces for developers. They test your understanding of REST principles, error handling, and developer experience.
6.  **Identify the question type early** to apply the right approach. Some questions blend multiple types.
7.  **Tailor your preparation** to cover all four types. Each requires different concepts and practice problems.

Launching soon
