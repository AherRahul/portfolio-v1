---
title: "Answering Framework"
description: "Answering Framework - System Design Interviews Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Answering Framework

You walk into a system design interview. The interviewer says, "Design Instagram." Where do you even start?

Most candidates fall into one of two traps. Some freeze, paralyzed by the open-ended nature of the problem. Others dive straight into drawing boxes and arrows, confident they know what Instagram needs. Both approaches lead to the same outcome: a design that misses the mark.

The candidate who freezes burns precious minutes staring at a blank whiteboard.

The candidate who jumps in builds the wrong system because they never stopped to ask what "Instagram" actually means in this context. Is it the photo sharing? The stories? The messaging? The recommendation engine?

In this chapter, I'll walk you through a framework for answering any system design question.

You'll learn:

*   The seven phases of a system design interview
*   How to allocate your time across each phase
*   What to say (and what not to say) at each step
*   How to handle curveballs and deep dives
*   Common mistakes and how to avoid them

# Why You Need a Framework

System design interviews are fundamentally different from coding interviews. There's no single correct answer. No test cases to validate your solution. No compiler to tell you whether you're right or wrong.

The interviewer gives you an ambiguous problem and 45-60 minutes to demonstrate that you can think through it systematically. This ambiguity is precisely what makes these interviews challenging. But it's also what makes a framework invaluable.

### Benefits of Using a Framework

#### **1\. Reduces Cognitive Load**

When you have a mental checklist, you don't waste brainpower deciding what to do next. Your working memory stays focused on the actual problem instead of meta-questions like "should I talk about the database now or later?"

#### **2\. Ensures Complete Coverage**

Without a structure to follow, candidates routinely forget critical aspects of the design. They'll spend 40 minutes on a beautiful architecture diagram, then realize they never asked about scale. Or they'll nail the happy path but forget to discuss what happens when things fail. A framework acts as a safety net, ensuring you touch on all the areas interviewers expect to see.

#### **3\. Demonstrates Senior-Level Thinking**

Interviewers want to see how you approach ambiguous problems. Jumping straight to solutions signals inexperience. A structured approach shows that you know how to gather context, define scope, and make informed decisions, the exact skills required for senior and staff-level roles.

#### **4\. Manages Time Effectively**

45-60 minutes disappears faster than you expect. I've seen countless candidates spend 25 minutes on requirements clarification, leaving them 10 minutes to rush through an incomplete design. A framework helps you pace yourself and know when to move on.

#### **5\. Handles Nerves**

Interview anxiety is real, even for experienced engineers. When your mind wants to blank out, having a familiar structure keeps you moving forward. You might not remember the exact details of consistent hashing in the moment, but you'll remember "okay, I've done requirements, now I need to estimate scale."

# The Seven-Phase Framework

Here's the framework I recommend for system design interviews. Each phase serves a specific purpose and has a time allocation designed to keep you on track.

Phase

Duration

Purpose

1\. Requirements

5-7 min

Define what to build

2\. Estimation

3-5 min

Understand the scale

3\. API Design

3-5 min

Define system interfaces

4\. High-Level Design

8-10 min

Draw the architecture

5\. Database Design

5-7 min

Model the data

6\. Deep Dives

12-18 min

Detail critical components

7\. Wrap-Up

3-5 min

Discuss bottlenecks and improvements

The phases build on each other. Requirements inform your estimation. Estimation guides your architecture. Your architecture determines your data model. And the data model often becomes the focus of your deep dives.

Let me walk through each phase in detail.

# Phase 1: Requirements Clarification (5-7 minutes)

This is the foundation of everything that follows. Get the requirements wrong, and you'll spend 40 minutes building the wrong system.

Real systems exist within constraints. A messaging app for 1,000 users requires a completely different architecture than one designed for 1 billion users. A payment system that can tolerate 5 seconds of latency has different requirements than one that needs sub-100ms response times.

Interviewers deliberately keep the problem vague. "Design Twitter" could mean a hundred different things. They're testing whether you can navigate ambiguity and extract the information you need before committing to a solution.

The best candidates treat this phase as a conversation, not an interrogation. You're working with the interviewer to define the problem together.

### What to Clarify

#### Functional Requirements

These define what the system should do. Start by proposing a scope and let the interviewer refine it:

*   What are the core features we need to support?
*   Who are the primary users?
*   What are the main use cases?
*   What should we explicitly exclude?

**Example for "Design Twitter/X":**

"Let me make sure we're aligned on scope. I'm thinking we should focus on the core Twitter experience: posting tweets, following users, and viewing a home timeline.

Should we also include features like direct messages, search, or trending topics? Or should we keep those out of scope for this discussion?"

Notice the difference from asking "What features do you want?" You're demonstrating that you already understand the product while giving the interviewer room to adjust the scope.

#### Non-Functional Requirements

These define the quality attributes your system must meet. The most important ones to clarify:

*   **Scale:** How many users? How many daily active users?
*   **Traffic patterns:** What's the read-to-write ratio? Any traffic spikes we should anticipate?
*   **Latency:** What response times are acceptable for different operations?
*   **Availability:** What uptime is required? Is this a system where five minutes of downtime costs millions?
*   **Consistency:** Can we tolerate eventual consistency, or do we need strong consistency?
*   **Data retention:** How long do we need to store data?

**Example dialogue:**

Discussion

**You:** "What scale should we design for? I want to make sure we're thinking about the right order of magnitude."

**Interviewer:** "Let's say 500 million daily active users."

**You:** "Got it, so we're definitely in the territory where we'll need sharding and caching. For the home timeline, what latency is acceptable? Sub-second? Sub-200ms?"

**Interviewer:** "Timeline should load within 200ms."

**You:** "That's tight but achievable with pre-computed timelines. One more question: is eventual consistency acceptable? Meaning if I post a tweet, it's okay if it takes a few seconds to appear in my followers' feeds?"

**Interviewer:** "Yes, that's fine."

### How to Document Requirements

Write down the requirements as you discuss them. This serves three purposes:

1.  Demonstrates to the interviewer that you're organized
2.  Creates a reference point you can return to when justifying design decisions
3.  Prevents scope creep during the interview

**Example summary:**

Keep this visible. You'll reference it throughout the interview.

### Common Mistakes in This Phase

**Not asking enough questions.** Jumping into design after one or two questions signals that you don't appreciate the complexity of the problem. It also means you'll likely make assumptions that don't match what the interviewer had in mind.

**Asking too many questions.** The opposite extreme. Some candidates treat this like a legal deposition, asking about every possible edge case. You don't need perfect information to start designing. If you're still asking questions after 7 minutes, you're behind schedule.

**Not stating assumptions.** Sometimes the interviewer won't give you a direct answer. That's intentional. When this happens, make a reasonable assumption and state it explicitly: "I'll assume we need to support 100 million messages per day. If that's off, we can adjust."

# Phase 2: Back-of-Envelope Estimation (3-5 minutes)

Note

Not every system design interview will require detailed capacity estimates. It's always a good idea to check with your interviewer if it's necessary.

Avoid going into too much detail. You don't want to waste your precious interview time doing math calculations without a calculator.

Estimation transforms vague requirements into concrete numbers that drive your design decisions. A system handling 100 requests per second needs a fundamentally different architecture than one handling 100,000.

### What to Estimate

#### **1\. Traffic (QPS)**

Calculate queries per second for both reads and writes. The distinction matters because reads and writes scale differently.

That 5:1 read-to-write ratio tells us something important: this is a read-heavy system. Caching will be critical.

#### **2\. Storage**

Estimate how much data you'll accumulate over time. This determines whether you can fit everything on a single machine or need distributed storage.

730 TB is well beyond what a single machine can handle. We'll need sharding.

#### **3\. Bandwidth**

Calculate network throughput requirements to understand if the network could become a bottleneck.

### Useful Formulas

Metric

Formula

Average QPS

Daily requests / 86,400

Peak QPS

Average QPS × 3

Storage

Records × Size × Retention period

Bandwidth

QPS × Data size per request

### How These Numbers Guide Your Design

The estimation phase isn't just arithmetic for the sake of arithmetic. Each number you calculate should influence a design decision:

*   **High read QPS** → You'll need caching, read replicas, or pre-computed results
*   **High write QPS** → Consider sharding, async processing, or write-behind caching
*   **Large storage** → Plan for distributed storage and data partitioning from the start
*   **High bandwidth** → CDN for static content, compression, and efficient serialization formats

When you present your high-level design, you should be able to point back to these numbers: "We calculated 175,000 read QPS at peak, which is why I'm putting a caching layer here."

### Tips for Estimation

**Round aggressively.** Use powers of 10. The goal is order of magnitude, not precision. 86,400 seconds per day? Just call it 100,000. You're trying to determine if you need one server or one thousand, not the exact count.

**State your assumptions.** Every calculation depends on assumptions. Make them explicit: "I'm assuming each user views their timeline 10 times per day. That might be low for active users, but it gives us a conservative baseline."

**Think out loud.** Walk through the calculation verbally. The interviewer wants to see your reasoning, not just the final number.

**Know your reference points.** Some useful numbers to have memorized:

*   1 day = 86,400 seconds ≈ 100,000 seconds
*   1 million seconds ≈ 12 days
*   1 billion seconds ≈ 32 years
*   A typical server handles 10,000-100,000 QPS depending on workload

# Phase 3: API Design (3-5 minutes)

Before drawing architecture diagrams, define the interfaces your system exposes. APIs clarify what the system does at its boundaries and establish the contract between clients and servers.

### Why Define APIs Early

**It forces clarity.** You can't design an endpoint without understanding exactly what operation it performs and what data it needs. If you're fuzzy on the API, you're fuzzy on the requirements.

**It guides the architecture.** APIs reveal what data flows through your system. When you define a "GET /timeline" endpoint that returns tweets, you've implicitly defined that your system needs to efficiently query and assemble tweet data.

**It demonstrates real-world thinking.** In actual engineering work, API design happens early. Teams can't build in parallel without agreeing on interfaces first. Showing this instinct signals maturity.

### How to Define APIs

For each core feature, specify:

*   HTTP method and endpoint
*   Request parameters
*   Response format
*   Key error cases

Don't go overboard with detail. You're not writing API documentation. Focus on the core operations that map to your functional requirements.

### **Example for Twitter/X:**

**1\. Post a Tweet**

**2\. Get Home Timeline**

**3\. Follow a User**

### Key Design Decisions to Mention

**Pagination.** For any endpoint returning lists, mention that you'd use cursor-based pagination rather than offset-based. Cursors handle real-time data better since they're stable even when new items are inserted.

**Idempotency.** For write operations like payments or orders, mention idempotency keys. This allows clients to safely retry requests without creating duplicates.

**Rate Limiting.** Briefly acknowledge that public-facing APIs need rate limiting to prevent abuse. You don't need to design the rate limiter here, just show awareness.

The goal of this phase is to have a clear picture of what your system does from the client's perspective. With APIs defined, you're ready to design the internals.

# Phase 4: High-Level Design (8-10 minutes)

Now you draw the architecture. This is where you show how different components work together to satisfy the requirements you defined earlier.

### Start Simple, Then Evolve

A common mistake is trying to draw the final architecture immediately. You'll end up with a confusing diagram that's hard to explain and easy to get lost in.

Instead, start with the simplest design that could possibly work, then add components incrementally as you identify problems.

This approach has two advantages: it's easier for the interviewer to follow your reasoning, and it demonstrates that you understand why each component is necessary.

**Step 1: Start with the basics**

This handles the happy path, but what happens when the server crashes? We lose everything.

**Step 2: Add load balancing for availability**

Now we have redundancy. But we calculated 175,000 read QPS at peak. Hitting the database for every read won't scale.

**Step 3: Add caching for performance**

Each addition solves a specific problem. The interviewer can see your thought process.

### Walk Through the Data Flow

For each core use case, explain how data flows through the system. This demonstrates that your architecture actually works and isn't just a collection of boxes.

**Example: Posting a Tweet**

1.  Client sends POST request to load balancer
2.  Load balancer routes to an available API server
3.  API server validates the request (content length, authentication)
4.  API server writes the tweet to the database
5.  API server publishes an event to the message queue
6.  Fan-out workers consume the event and update followers' timeline caches
7.  API server returns success to the client

Notice how walking through the flow naturally reveals components you might have forgotten, like the message queue for async fan-out.

### Complete High-Level Design

For a Twitter-like system, the full design might look like this:

### Components to Consider

Component

When to Include

Load Balancer

Almost always (availability, horizontal scaling)

Cache

High read traffic, expensive computations

Message Queue

Async processing, decoupling services, handling spikes

CDN

Static content, global user base

Database Replicas

Read-heavy workloads

Sharding

Large data volumes, write scalability

Rate Limiter

Public APIs, protecting against abuse

### Tips for This Phase

**Think out loud.** Don't just draw boxes. Explain why each component exists: "We need a cache here because our estimation showed 175,000 reads per second, which is too much for the database alone."

**Draw clearly.** Use consistent shapes: boxes for services, cylinders for databases, arrows for data flow. A clean diagram is easier to discuss.

**Label everything.** Name your services, databases, and queues. "Cache" is fine; "Timeline Cache" is better.

**Acknowledge what's missing.** At this point, you'll have a working architecture but with some hand-waving. That's expected. "This design works, but we'll need to discuss how the fan-out handles celebrities with millions of followers in the deep dive."

# Phase 5: Database Design (5-7 minutes)

With your architecture sketched out, it's time to define how you'll store and organize your data. The database design often becomes the foundation for deep dive discussions, so getting this right matters.

### Why Database Design Gets Its Own Phase

Many candidates skip this step or treat it as an afterthought, discussing database schema only when the interviewer asks about it. That's a missed opportunity.

Your data model influences almost every other aspect of the system. Query patterns depend on how data is organized. Sharding strategies depend on your access patterns. Caching decisions depend on what data is read together. By explicitly designing your data layer, you're setting up the rest of your discussion to be coherent and grounded.

### The SQL vs NoSQL Decision

Start by choosing the right type of database for each data store in your system. This isn't about picking a specific product (PostgreSQL vs MySQL), it's about understanding the trade-offs between relational and non-relational approaches.

**Choose a relational database (SQL) when:**

*   You need ACID transactions (payments, inventory, bookings)
*   Your data has clear relationships that you'll query across
*   Data integrity is more important than write throughput
*   Your query patterns are well-defined and won't change dramatically

**Choose a NoSQL database when:**

*   You need horizontal write scalability
*   Your data structure varies or evolves frequently
*   You're optimizing for specific access patterns
*   You can tolerate eventual consistency

**Example for Twitter:**

For our Twitter design, we have three main entities:

Entity

Database Choice

Rationale

Users

PostgreSQL

Structured data, need transactions for follows

Tweets

Cassandra

High write volume, time-series access pattern

Timelines

Redis

Pre-computed lists, fast reads, can rebuild from tweets

### Designing Your Schema

For each data store, define the key tables or collections and their fields. Focus on the fields that matter for your queries.

**Users Table (PostgreSQL)**

**Tweets Table (Cassandra)**

The partition key (user\_id) means all tweets from one user are stored together, making "get user's tweets" efficient. The clustering key (tweet\_id, descending) keeps tweets sorted by recency.

**Timeline Cache (Redis)**

The timeline is a simple list of IDs. When a user loads their timeline, we fetch the IDs, then batch-fetch the tweet objects.

### Access Pattern Analysis

For each query your system needs to support, verify that your schema can handle it efficiently.

Query

How It's Served

Get home timeline

Read from Redis list, batch-fetch tweets

Post a tweet

Write to Cassandra, publish to queue

Get user's tweets

Query Cassandra by user\_id partition

Follow a user

Insert into follows table, update counts

Get followers

Query follows table by followee\_id

If an access pattern requires a full table scan or joining across shards, that's a red flag that your schema needs adjustment.

### Sharding Strategy

For large-scale systems, explain how you'd partition your data.

**Tweets:** Shard by user\_id. This keeps all of a user's tweets on the same partition, making user timeline queries efficient. The downside is potential hot spots for viral users, but we can handle that with replication.

**Users:** Shard by user\_id using consistent hashing. User data is relatively small and accessed by ID, making this straightforward.

**Follows:** This is trickier. We need to query both "who does X follow?" and "who follows X?" Consider denormalizing into two tables, one partitioned by follower\_id and one by followee\_id.

### Tips for This Phase

**Match schema to access patterns.** In NoSQL especially, you design your schema around how you'll query it, not around entity relationships. If you need to query data a different way, you might need a second table with the same data organized differently.

**Denormalize deliberately.** Storing follower\_count on the user record means we don't have to count rows for every profile view. The trade-off is maintaining consistency when follows change. Be explicit about these choices.

**Don't over-specify.** You don't need every field. Focus on the ones that affect your design decisions: primary keys, partition keys, foreign keys, and any denormalized fields.

# Phase 6: Deep Dives (12-18 minutes)

This is where you demonstrate genuine expertise. You've built a working architecture and defined your data model. Now the interviewer wants to see how deep your understanding goes.

### How Deep Dives Work

The interviewer will typically pick 2-4 topics from your design and ask you to elaborate. Sometimes they'll choose; sometimes they'll ask what you'd like to discuss further. Either way, you should be ready to go deeper on any component you've drawn.

### What Interviewers Ask About

Common deep dive topics include:

*   Caching strategy and invalidation
*   Data partitioning and sharding
*   Consistency vs availability trade-offs
*   Failure handling and recovery
*   Specific algorithms (feed ranking, matching, deduplication)
*   Scaling bottlenecks
*   Security and access control

The topics that come up depend on your design. If you drew a cache, expect questions about cache invalidation. If you mentioned sharding, expect questions about partition strategies. The interviewer is testing whether you actually understand the components you included.

### How to Structure a Deep Dive

For any topic, follow this structure:

#### **1\. Acknowledge the Problem**

Start by stating what challenge you're solving. This confirms you understand why this is a deep dive topic.

"The challenge with fan-out is the celebrity problem. When someone with 10 million followers posts a tweet, we can't write to 10 million timeline caches synchronously."

#### **2\. Present Multiple Approaches**

Show that you know there are different ways to solve the problem. Naming 2-3 approaches demonstrates breadth.

"There are a few approaches we could take. We could use push-based fan-out where we write to followers' timelines immediately, pull-based fan-out where we compute timelines on read, or a hybrid approach."

#### **3\. Explain How Each Works**

Walk through the mechanics of each approach. Be concrete. Use your diagram to trace the flow.

#### **4\. Discuss Trade-offs**

Every approach has pros and cons. The interviewer wants to see that you understand these trade-offs and can reason about them. This is often what separates senior candidates from more junior ones.

#### **5\. Make a Recommendation**

Don't leave the decision hanging. State which approach you'd choose and why. Ground it in your requirements: "Given our latency requirement of 200ms for timeline loads, I'd choose the hybrid approach because..."

### Example Deep Dive: News Feed Fan-out

**The Problem:** When a user posts a tweet, how do we update the timelines of their followers?

**Approach 1: Push (Fan-out on Write)**

When a user posts a tweet, immediately write it to all followers' timeline caches.

**Pros:**

*   Timeline reads are fast (pre-computed)
*   Simple read path

**Cons:**

*   Celebrities with millions of followers cause massive write amplification
*   Wasted work if followers never check their timeline

**Approach 2: Pull (Fan-out on Read)**

When a user requests their timeline, fetch tweets from all followed users in real-time.

**Pros:**

*   No wasted writes
*   Works well for inactive users

**Cons:**

*   Slow reads (must query many users)
*   High latency for users following many accounts

**Approach 3: Hybrid**

Use push for regular users and pull for celebrities.

**Recommendation:** "I would use the hybrid approach. Regular users (under 10,000 followers) use push. Celebrities use pull. This gives us fast reads for most cases while avoiding the write amplification problem."

### Comparison Tables

For complex decisions, create a comparison table:

Approach

Write Latency

Read Latency

Storage

Best For

Push

High

Low

High

Active users

Pull

Low

High

Low

Inactive users

Hybrid

Medium

Low

Medium

Mixed workloads

### Other Common Deep Dives

Here are a few other topics that frequently come up, along with the key points to address:

**Data Sharding:**

*   Hash-based vs range-based partitioning
*   Handling hot spots (celebrity accounts, viral content)
*   Cross-shard queries and their limitations
*   Rebalancing when adding/removing nodes

**Caching Strategy:**

*   What to cache (hot data, expensive computations, session data)
*   Cache invalidation (TTL, write-through, event-driven)
*   Cache-aside vs write-through patterns
*   Handling cache failures gracefully

**Consistency Models:**

*   When to use strong vs eventual consistency
*   Read-your-writes consistency for user experience
*   Conflict resolution in distributed systems
*   The role of consensus protocols

For each of these, the pattern is the same: acknowledge the problem, present approaches, discuss trade-offs, and make a grounded recommendation.

# Phase 7: Wrap-Up (3-5 minutes)

The final phase ties everything together. Many candidates skip this, running out of time or thinking the interview is over. That's a mistake. A strong wrap-up demonstrates self-awareness and maturity.

### What to Cover

**1\. Summarize the Design**

Spend 30 seconds recapping the key components and how they work together. This reinforces the coherence of your design.

"To summarize: we have a microservices architecture with separate Tweet, Timeline, and User services. We use a hybrid fan-out approach, pushing to regular users' timeline caches and pulling for celebrities at read time. Timeline data is stored in Redis for sub-200ms reads, and we use Kafka to decouple the write path from fan-out processing."

**2\. Identify Bottlenecks**

Show that you understand the limitations of your design. Every system has bottlenecks; acknowledging them shows maturity.

"The main bottlenecks I see are the fan-out workers during viral events, they'd need auto-scaling, and the timeline cache under high read load. We'd want monitoring on both, with alerts for cache hit rate drops or queue depth increases."

**3\. Discuss Future Improvements**

What would you build next if you had more time? This shows you can think beyond the immediate requirements.

"If we had more time, I'd add a search service backed by Elasticsearch for tweet search, implement rate limiting at the API gateway to protect against abuse, and add a recommendation system for the 'For You' feed using collaborative filtering."

**4\. Answer Follow-up Questions**

Be ready for curveball questions:

*   "How would you handle 10x the traffic?"
*   "What if this region goes down?"
*   "How would you migrate to this architecture from an existing system?"

These questions test your ability to think on your feet. You don't need a perfect answer, just a reasonable approach that shows you can adapt.

# Time Management

Time disappears faster than you expect in system design interviews. Here's how to stay on track:

### The 45-Minute Interview

Phase

Duration

Cumulative

Requirements

5-6 min

6 min

Estimation

3-4 min

10 min

API Design

3-4 min

14 min

High-Level Design

7-8 min

22 min

Database Design

4-5 min

27 min

Deep Dives

15-16 min

43 min

Wrap-Up

2 min

45 min

### The 60-Minute Interview

Phase

Duration

Cumulative

Requirements

5-7 min

7 min

Estimation

3-5 min

12 min

API Design

3-5 min

17 min

High-Level Design

8-10 min

27 min

Database Design

5-7 min

34 min

Deep Dives

18-20 min

54 min

Wrap-Up

4-6 min

60 min

### Tips for Managing Time

**Keep an eye on the clock.** Glance at the time periodically. You don't want to realize you've spent 25 minutes on requirements.

**Set internal checkpoints.** Know where you should be at each milestone: "By 15 minutes, I should be starting the high-level design."

**Don't go down rabbit holes.** If a topic is taking too long, consciously move on: "I could go deeper on caching here, but let me first complete the architecture and we can return to it in the deep dive."

**Follow the interviewer's lead.** If they want to spend more time on a particular topic, adapt. The framework is a guide, not a rigid script.

# Common Mistakes to Avoid

### 1\. Jumping Into the Solution

This is the most common mistake, and it's often fatal. Candidates hear "Design Twitter" and immediately start drawing load balancers and databases. But without understanding the requirements, you're designing blind. You might build a perfect read-heavy architecture when the interviewer wanted to focus on real-time messaging.

**The fix:** Spend 5-7 minutes on requirements before touching the whiteboard. It feels slow, but it prevents you from solving the wrong problem.

### 2\. Over-Engineering

Adding Kubernetes, service mesh, event sourcing, and CQRS to every design doesn't impress anyone. It signals that you don't understand when complexity is warranted. Every component has operational costs, and experienced engineers know that simplicity has value.

**The fix:** Start with the simplest design that meets the requirements. Only add complexity when you can articulate the specific problem it solves.

### 3\. Under-Engineering

The opposite problem: designing a system that can't meet the stated requirements. If you calculated 100,000 QPS and your design shows a single database with no caching, that's a problem. It suggests you're not connecting your estimation to your architecture.

**The fix:** After drawing each component, mentally verify it can handle the scale you estimated. Your numbers should drive your design.

### 4\. Ignoring Trade-offs

Presenting your solution as if it has no downsides is a red flag. Every design decision involves trade-offs. Choosing Cassandra means accepting eventual consistency. Choosing a cache means accepting stale data. Pretending otherwise suggests you don't fully understand your choices.

**The fix:** For every major decision, explicitly state the trade-off: "We're choosing availability over consistency here, which means users might see slightly stale data. Given our use case, that's acceptable."

### 5\. Designing in Silence

Some candidates go quiet while thinking, scribbling on the whiteboard without explanation. This makes it impossible for the interviewer to evaluate your thought process. They can only see the final result, not the reasoning that got you there.

**The fix:** Think out loud. Explain what you're considering, what options you see, and why you're making each choice. The interviewer is evaluating your reasoning, not just your diagram.

### 6\. Getting Stuck on Details

Spending 10 minutes debating whether to use PostgreSQL or MySQL, or whether to use JSON or Protobuf, misses the point. These decisions rarely affect the overall design. Time spent on them is time not spent on what matters.

**The fix:** Make a reasonable choice, state your rationale briefly, and move on. "I'll use PostgreSQL for its strong ACID guarantees. MySQL would work too, but the choice doesn't significantly affect our architecture."

### 7\. Not Drawing Diagrams

A verbal description of your architecture is hard to follow. The interviewer is tracking multiple components, data flows, and interactions in their head. Without a visual, it's easy to get confused.

**The fix:** Draw as you explain. Use consistent shapes (boxes for services, cylinders for databases), clear labels, and arrows showing data flow. A clean diagram is worth a thousand words.

### 8\. Forgetting Non-Functional Requirements

Some candidates design a system that handles the happy path perfectly but ignores availability, latency, security, or failure handling. A system that works but goes down for hours isn't a good design.

**The fix:** Periodically check your design against your non-functional requirements. "We said we need 99.99% availability. What happens when this service dies?"

# Key Takeaways

1.  **Use a repeatable framework.** The seven phases (Requirements, Estimation, API Design, High-Level Design, Database Design, Deep Dives, Wrap-Up) give you a structure that works for any problem. When you're nervous, the framework keeps you moving forward.
2.  **Requirements come first.** Never start designing without understanding what you're building and at what scale. Five minutes spent clarifying can save you from 40 minutes of building the wrong system.
3.  **Let numbers guide your architecture.** Back-of-envelope estimation isn't just arithmetic. Each number should inform a design decision. High QPS means caching. Large storage means sharding. Make these connections explicit.
4.  **Start simple, then add complexity.** Begin with the simplest design that could work, then add components as you identify specific problems. This makes your reasoning transparent and prevents over-engineering.
5.  **Design your data layer thoughtfully.** Your database schema affects everything else: query patterns, scaling strategies, caching decisions. Make SQL vs NoSQL choices based on your access patterns, not habit.
6.  **Deep dives separate good from great.** Present multiple approaches, explain the trade-offs, and make grounded recommendations. This is where you demonstrate genuine expertise, not just textbook knowledge.
7.  **Communicate constantly.** Think out loud. Draw diagrams. Explain your reasoning. The interviewer is evaluating your thought process, not just your final diagram.
8.  **Every decision has trade-offs.** Presenting a solution as if it's perfect raises red flags. Acknowledge what you're giving up with each choice. That's what senior engineers do.

The framework isn't magic. It takes practice, ideally by working through problems end-to-end until the structure becomes automatic. But with deliberate preparation, you can walk into any system design interview knowing exactly how to approach it. The problem might be unfamiliar, but your process won't be.

Launching soon
