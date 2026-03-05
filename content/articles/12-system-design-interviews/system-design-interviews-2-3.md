---
title: "Expectations by Level/YoE"
description: "Expectations by Level/YoE - System Design Interviews Module 2"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Expectations by Level/YoE

A common question candidates ask is: "How deep should I go in a system design interview?"

The answer depends on your experience level.

What's expected from a junior engineer is very different from what's expected from a staff engineer. A junior candidate who gives a staff-level answer might seem like they memorized solutions. A senior candidate who gives a junior-level answer will likely get rejected.

Understanding these expectations helps you calibrate your preparation and performance. You'll know what to focus on and how to demonstrate the right signals for your level.

In this chapter, I'll break down what interviewers expect at each level, from entry-level to staff and beyond.

# Overview: How Expectations Scale

The fundamental question changes at each level.

*   For a junior candidate, the interviewer is asking: "Can this person learn to design systems?"
*   For a senior candidate: "Can this person independently own a system?"
*   For a staff candidate: "Can this person make technical decisions that shape the organization?"

Same interview format. Completely different evaluation criteria.

Here's how the interview weight and expectations shift:

Level

YoE

Interview Weight

Core Question

**Junior**

0-2

Low (often skipped)

Can they learn?

**Mid-Level**

2-5

Medium

Can they build?

**Senior**

5-8

High (must pass)

Can they own?

**Staff+**

8+

Very High

Can they lead?

The years of experience are rough guidelines. I've seen 3-year engineers perform at senior level and 10-year engineers struggle with mid-level expectations. What matters is demonstrated capability, not time served.

Let's explore what each level actually looks like in practice.

# Junior / Entry Level (0-2 Years)

### Do Juniors Get System Design Interviews?

Many companies skip system design interviews for junior candidates entirely. The focus is on coding ability, problem-solving, and potential to learn.

However, some companies do include a "lite" version of system design, especially for:

*   Candidates with relevant internship experience
*   Companies that want to assess architectural thinking early
*   Roles that involve backend or infrastructure work

If you're a junior candidate facing a system design interview, don't panic. The bar is significantly lower than for senior roles.

### What Interviewers Expect

**Basic component awareness**

You should know what these things are and roughly when to use them: load balancers, web servers, databases, caches, message queues. You don't need to know how Redis implements LRU eviction. You need to know that caches make reads faster and that you might want one when your database is slow.

**Problem decomposition**

Can you take a vague problem and break it into concrete pieces? If I ask you to design a URL shortener, can you identify that you need to store URLs, generate short codes, and handle redirects? This skill matters more than knowing any specific technology.

**Foundational knowledge**

HTTP request/response cycle. What a database table looks like. The difference between a client and a server. Basic stuff, but you'd be surprised how many candidates struggle here.

**Learning potential**

This is the big one. When I give you a hint, do you run with it or get confused? When I point out a flaw in your design, can you adapt?

### What Will Get You Rejected

**Over-engineering**

If you start talking about consistent hashing, multi-region replication, or Kafka before we've even established basic requirements, it signals that you memorized solutions without understanding when they're needed. Keep it simple.

**Buzzword soup**

Throwing around terms like "microservices," "eventual consistency," or "sharding" without being able to explain what they mean. If you mention something, be ready to explain it in simple terms.

**Not asking questions**

Jumping straight into a solution without clarifying requirements. Even at the junior level, asking "How many users should this support?" shows good instincts.

**Freezing up**

Some nervousness is expected, but if you can't draw a single box and arrow after several minutes, that's a problem. Practice enough that you can at least start.

### What a Passing Answer Looks Like

**Question: Design a URL Shortener**

Here's what a junior-level passing answer sounds like:

"Okay, so we need a service where users give us a long URL and we give them back a short one. When someone visits the short URL, they get redirected to the original.

Let me think about the main pieces. We need some way to store the mapping between short codes and original URLs. I'd use a database for that, probably a simple table with columns for the short code, the original URL, and maybe when it was created.

For generating the short codes, I could generate random strings, maybe 6-7 characters using letters and numbers. I'd need to check if the code already exists in the database to avoid collisions.

The flow would be: user sends a POST request with their URL, my server generates a short code, saves it to the database, and returns the short URL. When someone visits the short URL, my server looks up the code in the database and returns a redirect to the original.

_\[Interviewer: What if the database becomes slow because you have millions of URLs?\]_

I could add a cache in front of the database. Something like Redis that stores the most frequently accessed URL mappings. When a redirect request comes in, I check the cache first. If it's there, I return immediately. If not, I check the database and then add it to the cache for next time."

This answer demonstrates basic understanding, responds well to hints, and doesn't over-complicate things.

### Preparation Strategy

1.  **Prioritize coding interviews.** For junior roles, system design is a nice-to-have. Coding is the must-pass. Spend 80% of your time on coding.
2.  **Understand the building blocks.** Know what load balancers, databases, caches, and queues are for. Not the internals, just the purpose.
3.  **Practice explaining simple systems.** Draw a basic web application architecture. Walk through how a request flows from browser to server to database and back.
4.  **Learn to ask questions.** Practice clarifying requirements before designing. "How many users?" "Do we need real-time updates?" "What happens if this fails?"
5.  **Stay calm and simple.** When in doubt, keep it basic. A simple, correct design beats a complex, half-baked one every time.

# Mid-Level (2-5 Years)

### Where System Design Becomes Real

Mid-level is the transition point. At this level, you've built real things. You've felt the pain of a slow database query in production. You've debugged a caching issue at 2 AM. System design interviews start testing whether you can apply that experience to new problems.

The questions you'll get are often the same as senior-level questions. The difference is in depth and independence. As a mid-level candidate, you'll receive more guidance. Interviewers will nudge you toward important areas. You're expected to take those hints and run with them.

The trap at this level is staying too shallow. Many mid-level candidates draw a reasonable high-level design and then stop. They can't go deeper when asked. That's a red flag. You don't need to know everything, but you need to demonstrate real understanding of the components you've chosen.

### What Interviewers Expect

**Solid High-Level Design**

You should be able to draw an architecture with all the major pieces: clients, load balancers, API servers, databases, caches, message queues, workers.

More importantly, you should be able to explain why each piece is there. "We need a cache because reads are 100x more frequent than writes and we want sub-100ms latency."

**Database d**esign skills

You should design reasonable schemas, choose between SQL and NoSQL with justification, and understand basic indexing. If you say "we'll use PostgreSQL," be ready to sketch the tables and explain what indexes you'd add for your main queries.

**Knowledge of Standard Patterns**

Standard patterns should be second nature. Caching strategies (cache-aside, write-through). Load balancing approaches. Database replication. Async processing with queues. You don't need to have implemented all of these, but you should know when and why to use them.

**Ability to go deeper**

When the interviewer says "tell me more about the caching layer," you should have something to say. What eviction policy? How do you handle cache invalidation? What's your cache-miss strategy? Some hints are fine, but you should be able to engage meaningfully.

### What Will Get You Rejected

**Shallow designs with no depth**

Drawing boxes and arrows is easy. Explaining how those boxes actually work is harder. If every follow-up question gets "I'm not sure" or "I'd need to research that," you're not demonstrating mid-level capability.

**Missing key components**

If you're designing a read-heavy system and don't mention caching, that's a problem. If you're designing something with async requirements and don't mention queues, that's a problem. The basics should be automatic.

**Rigid thinking**

When the interviewer suggests a different approach or points out a problem, can you adapt? Candidates who defend clearly flawed designs instead of adjusting raise red flags.

### What a Passing Answer Looks Like

**Question: Design Twitter/X**

Here's what a mid-level passing answer sounds like:

"Let me clarify requirements first. We're building the core Twitter experience: posting tweets, following users, and viewing a home feed. What scale should I design for?

_\[Interviewer: Assume 100 million daily active users, read-heavy workload.\]_

Got it. Let me do some quick math. 100 million DAU, maybe each user views their feed 10 times a day and posts once, so roughly a billion feed views and 100 million tweets per day. That's about 12,000 feed reads per second at peak.

For the high-level architecture, clients connect through a load balancer to API servers. We'll need databases for users, tweets, and follow relationships. Given the read-heavy nature, we definitely need a caching layer.

For the database, I'd use PostgreSQL for users and follow relationships since we need joins and consistency. For tweets, given the write volume, I might use Cassandra for better write throughput and horizontal scaling.

The interesting problem is generating the home feed. There are two main approaches.

With fan-out-on-read, when a user opens their feed, we query for all the people they follow, fetch their recent tweets, and merge them. This is slow for users following thousands of people.

With fan-out-on-write, when someone tweets, we immediately push it to all their followers' precomputed feeds. Fast reads, but expensive writes, especially for users with millions of followers.

I'd use a hybrid. Regular users get fan-out-on-write for fast reads. For celebrities, like anyone with over 100K followers, we skip the fan-out and merge their tweets at read time.

_\[Interviewer: How would you handle the cache layer?\]_

I'd use Redis for caching. We'd cache the precomputed home feeds, with maybe the last 100 tweets per user. For cache invalidation, when a new tweet is pushed to someone's feed, we either update the cached list or just invalidate it so the next read refreshes from the database.

The TTL would be short, maybe 5 minutes, since feeds change frequently. We'd also cache individual tweets and user profiles since those are fetched often for display."

This demonstrates solid understanding, does the math, discusses trade-offs, and engages meaningfully with follow-up questions.

### Preparation Strategy

1.  **Master the fundamentals thoroughly.** Caching, load balancing, database choices, queue patterns. These should require zero thought. If you hesitate explaining why you'd add a cache, you're not ready.
2.  **Practice 15-20 common problems.** Build pattern recognition. After enough practice, you'll see "oh, this is a feed generation problem" or "this is a fan-out problem" immediately.
3.  **Learn to estimate.** Practice back-of-envelope calculations until they're automatic. Users → requests per second → storage needs → bandwidth. This is expected at mid-level.
4.  **Study each component one level deeper.** Don't just know that Redis is a cache. Know that it's in-memory, supports data structures beyond key-value, has different persistence options, and when you'd use Redis vs Memcached.
5.  **Read engineering blogs.** How does Twitter actually do feed generation? How does Uber do location matching? Real-world context makes your answers more credible.

# Senior Level (5-8 Years)

### The Bar Rises Significantly

At the senior level, everything shifts. The interviewer is no longer guiding you. They're evaluating whether you can lead.

The questions might look similar to mid-level questions on the surface. But the evaluation is completely different. A mid-level candidate is expected to design a solid system with some guidance. A senior candidate is expected to drive the entire conversation, proactively identify problems, and demonstrate genuine expertise in the areas they touch.

The single biggest mistake senior candidates make is playing it safe. They give competent but shallow answers, waiting for the interviewer to push them deeper. That works at mid-level. At senior level, it signals that you can't operate independently.

### What Interviewers Expect

**You drive the requirements**

Don't wait for the interviewer to tell you the scale. Ask. "What's the expected read/write ratio? What latency is acceptable? Do we need strong consistency or can we tolerate eventual? What's the availability target?" These questions should come naturally because you know they shape the entire design.

**End-to-end ownership**

You should think about the complete system: API design, data models, core algorithms, failure handling, monitoring, deployment. Not just the happy path architecture. What happens when things go wrong? How do you know the system is healthy? How do you roll out changes safely?

**Genuine depth**

When you mention a technology, you should actually understand it. If you say "we'll use Kafka," be ready to explain how partitions work, what happens when a broker fails, how consumer groups handle rebalancing, and when Kafka isn't the right choice. Surface-level knowledge is immediately apparent.

**Trade-off awareness**

Every decision has trade-offs. At senior level, you should discuss them proactively. "I'm choosing eventual consistency here because our availability requirements are more important than perfect consistency for this use case. If we needed stronger guarantees, we could use X instead, but that would cost us Y."

**Experience signals**

Interviewers listen for signs that you've actually built and operated real systems. War stories about production incidents. Awareness of what looks good on paper versus what actually works. Opinions on specific tools based on real experience. These signals are hard to fake.

### What Will Get You Rejected

**Waiting for guidance**

If you sit and wait for the interviewer to tell you what to do next, you're demonstrating mid-level behavior. Senior candidates lead.

**Shallow depth everywhere**

You don't need to be an expert in everything, but you need to be an expert in something. If every component in your design gets the same surface-level treatment, you're not demonstrating senior capability.

**No trade-off discussion**

Every design decision has alternatives. If you present your choices as the only option without discussing what you're giving up, you're either overconfident or haven't thought deeply enough.

**Ignoring operational concerns**

"How do you deploy this?" "How do you know it's working?" "What happens when this component fails?" If these questions catch you off guard, you're not thinking like a senior engineer.

**No opinion on technologies**

Senior engineers have opinions. "We should use PostgreSQL" is fine, but you should have reasons. "I've worked with both PostgreSQL and MySQL, and for this use case PostgreSQL is better because..." shows real experience.

### What a Passing Answer Looks Like

**Question: Design a Distributed Cache**

Here's what a senior-level passing answer sounds like:

"Before I start designing, I need to understand the constraints. What's the expected cache size, both total and per-item? What's the hit rate we're targeting? Is strong consistency required, or is eventual okay? What's the read/write ratio? And what's our tolerance for data loss during failures?

_\[Interviewer provides requirements: 10TB total, eventual consistency fine, 95% hit rate target, 10:1 read/write ratio, can tolerate brief data loss during node failures\]_

Got it. With those requirements, I'll design a distributed cache using consistent hashing for partitioning, prioritizing availability over consistency.

Let me start with the architecture. Clients use a cache library that hashes the key to determine which node owns it. We'll have multiple cache nodes, each responsible for a portion of the key space.

For consistent hashing, I'll use virtual nodes. Each physical node gets maybe 100-200 positions on the hash ring. This serves two purposes: it ensures even key distribution, and when a node fails, its load spreads across many remaining nodes instead of all hitting one successor.

For replication, since we can tolerate brief data loss, I'll use asynchronous replication with a factor of 2. Writes go to the primary node and replicate asynchronously to the next node on the ring. We're trading durability for lower write latency.

Now, failure handling. This is where it gets interesting.

For failure detection, I'd use a gossip protocol. Each node periodically pings a random subset of other nodes and shares what it knows about cluster health. This gives us decentralized failure detection without a single point of failure.

When a node fails, the consistent hashing automatically routes requests to the next node on the ring, which has replicated data. But we need to be careful about split-brain scenarios. If a node is slow but not dead, we might have clients writing to both the 'dead' node and its successor. To handle this, I'd implement a lease system where ownership of a key range is explicit and time-bounded.

For hot keys, this is a real production concern. One popular key can overwhelm a single node. Solutions include: first, detect hot keys by tracking request rates per key; second, replicate hot keys to multiple nodes and distribute reads; third, use a local client-side cache with short TTL for the hottest keys.

Let me talk about the client library design because this matters more than people realize. The library needs to handle node failures gracefully, including retry logic, circuit breakers, and fallback to replica nodes. It should also pool connections to reduce overhead. I've seen systems where a poorly designed client caused more problems than the cache itself.

For eviction, LRU at each node, with TTL support for time-sensitive data. We'd need to handle the case where replicas have different eviction states, accepting that as part of our eventual consistency model.

On the operational side, we need metrics on hit rate, latency percentiles, memory usage, replication lag, and cluster health. I'd expose these via Prometheus and alert on deviations from baseline. For deployment, we'd need a way to add and remove nodes gracefully, rebalancing the hash ring and migrating data without impacting availability.

_\[Interviewer: What if we later need strong consistency?\]_

That would be a significant change. We'd need to switch to synchronous replication, which means writes don't complete until replicas confirm. We'd also need a consensus mechanism for handling network partitions, maybe using something like Raft for leadership election. The latency and availability trade-offs would be substantial. If strong consistency were a requirement from the start, I'd have designed this differently, probably looking at something closer to Memcached with mcrouter or even evaluating Redis Cluster."

This demonstrates deep knowledge, proactive trade-off discussion, operational awareness, and the ability to adapt when requirements change.

### Preparation Strategy

1.  **Develop genuine depth in 5-6 areas.** Pick databases, caching, messaging, networking, and a couple others. Go deep. Read the source code. Understand the internals. Have opinions.
2.  **Practice driving interviews.** You should be talking 70% of the time. Practice with a friend where you lead the entire conversation. They shouldn't need to prompt you for next steps.
3.  **Prepare war stories.** Think of 3-4 significant technical challenges you've faced. What went wrong? What did you learn? How would you handle it differently now? These stories demonstrate real experience.
4.  **Study failure modes.** For every technology you mention, know how it fails. What happens when the network partitions? When a node runs out of memory? When a disk fills up?
5.  **Read post-mortems.** Engineering blogs from Google, AWS, Cloudflare, and others publish detailed analyses of outages. These teach you how systems fail in practice.
6.  **Form opinions.** Senior engineers have opinions. "I prefer PostgreSQL over MySQL for transactional workloads because..." Have reasons for your preferences.

# Staff / Principal Level (8+ Years)

### A Different Kind of Interview

Staff-level system design interviews don't look like senior interviews done harder. They're fundamentally different.

At senior level, you're asked to design a system. At staff level, you might be asked to design the architecture for a company's entire technical platform. Or you're given a vague problem and expected to figure out what the real question even is. Or you're asked how you'd migrate a legacy system to something new without disrupting a billion-dollar business.

The scope expands. The ambiguity increases. And critically, the organizational dimension becomes as important as the technical one. A technically brilliant design that requires 50 engineers when you have 10, or that can't be built incrementally, or that requires teams to coordinate in ways that don't match your org structure, isn't a good design.

### What Interviewers Are Actually Looking For

**Navigating ambiguity**

Staff-level problems are intentionally vague. "Help us scale our platform internationally" isn't a system design question in the traditional sense. Your first job is to figure out what the question actually is. What are the constraints? What matters most? What can we defer?

**Cross-system thinking**

You're not designing one system in isolation anymore. You're thinking about how multiple systems interact, where boundaries should be, and how data flows across an organization.

**Organizational awareness**

Technical decisions have organizational consequences. If you propose a microservices architecture, you're also proposing a team structure. If you suggest a shared platform, someone needs to own it. Staff engineers think about these implications proactively.

Questions you should be asking yourself:

*   How many teams will work on this? How will they coordinate?
*   What's the migration path from where we are today?
*   How do we sequence the work to deliver value incrementally?
*   What happens if this project gets cut in half, can we still ship something useful?
*   How do we balance the ideal architecture with the team we actually have?

**Technical strategy**

Senior engineers solve the problem in front of them. Staff engineers think about how the solution evolves over 2-5 years. Will this architecture still work when we're 10x bigger? Are we building in the right abstractions? What technical debt are we taking on, and is that intentional?

**Leadership signals**

At this level, much of your job is influencing without authority. Interviewers look for signs that you can communicate complex ideas clearly, build consensus, mentor others, and balance ideal solutions with pragmatic constraints.

### What a Passing Answer Looks Like

**Question: Design a Multi-Region E-Commerce Platform**

A staff-level answer engages with the full complexity:

Discussion

"This is a big problem, so let me start by understanding the constraints and priorities.

First, what's driving the multi-region requirement? Is it latency for customers, data residency regulations, disaster recovery, or all of the above?

_\[Interviewer: All of the above. We're expanding into EU and Asia. GDPR compliance is mandatory. We need sub-200ms latency for product browsing. And we need the ability to survive a regional outage.\]_

Got it. So we have regulatory, latency, and availability requirements. Let me identify the key challenges:

**Data residency:** GDPR means EU user data needs to stay in EU. This isn't just about where we store it; it's about where we process it. This fundamentally shapes our architecture.

**Consistency vs latency:** For product catalog, eventual consistency with regional read replicas is fine. For inventory and orders, we need to be more careful. You can't sell something you don't have.

**Migration complexity:** We have an existing system. We can't flip a switch. We need to migrate incrementally.

Let me propose an overall architecture:

**For the catalog service:** This is read-heavy and tolerates eventual consistency. Each region gets a full replica. Updates propagate asynchronously. This gives us low latency everywhere.

**For orders and inventory:** This is harder. We can't have two regions both selling the last item. I'd use a model where inventory is partitioned by fulfillment center, and each fulfillment center's inventory is owned by one region. When you order something, the request routes to the region that owns that inventory. This adds latency for cross-region orders but maintains consistency.

**For user data (GDPR):** EU user accounts, addresses, and order history live exclusively in EU. The EU is authoritative for EU users. If a US service needs EU user data, it requests it from EU, not from a local cache.

Now, the organizational dimension. This architecture implies:

**Team structure:** We need teams that own each service (catalog, orders, inventory) plus a platform team that owns the cross-region infrastructure (replication, traffic routing, observability). We can't have one team per region; that doesn't scale and creates coordination nightmares.

**Oncall complexity:** With three regions, we need follow-the-sun oncall or accept that US oncall is waking up for EU issues. I'd push for regional oncall with escalation paths, but this needs to be planned.

**Migration strategy:** This is critical. I'd propose:

1.  First, set up the infrastructure in EU (networking, base services, deployment pipeline)
2.  Second, move read-only services first (catalog). This is low risk and validates our setup.
3.  Third, migrate user accounts for new EU signups to the EU database. Existing users stay in US initially.
4.  Fourth, gradually migrate existing EU users with a careful switchover process.
5.  Fifth, inventory and orders come last because they're highest risk.

Each phase is independently valuable and can be rolled back. We're not betting the company on a big-bang migration.

**What I'm uncertain about:**

*   The exact consistency model for inventory. I'd want to prototype this and run simulations before committing.
*   The cost model. Running three regions fully staffed is expensive. We might start with two regions and add Asia later.
*   Specific GDPR requirements. I'd want legal review before finalizing the data residency design.

_\[Continues with monitoring strategy, rollout plan, success metrics...\]_"

This demonstrates cross-system thinking, organizational awareness, migration planning, and appropriate acknowledgment of uncertainty.

### Preparation Strategy

1.  **Study architectures at scale.** How does Google structure its infrastructure? How does Amazon organize services? Read about these not for specific technologies but for organizational and architectural patterns.
2.  **Practice open-ended problems.** Give yourself problems like "modernize a legacy monolith" or "expand a US product to global markets." Practice structuring your thinking before diving into solutions.
3.  **Develop organizational intuition.** Every technical decision has organizational consequences. Practice identifying them. "If we build a shared platform, who owns it? How does that team get prioritized?"
4.  **Think in migrations.** Almost nothing in the real world is greenfield. Practice thinking about how to get from A to B incrementally while keeping the lights on.
5.  **Practice communicating to different audiences.** A staff engineer explains the same architecture differently to executives, to peer engineers, and to junior team members. Practice all three.
6.  **Reflect on decisions you've influenced.** What cross-team technical decisions have you been part of? What went well? What would you do differently? These stories are powerful in interviews.

# Key Takeaways

System design interviews evaluate different things at different levels. The same technical answer can be a pass at one level and a fail at another. Understanding this is crucial for effective preparation.

#### **The core evaluation at each level:**

*   **Junior:** Can they learn? Focus on fundamentals and potential. Over-engineering is worse than under-engineering.
*   **Mid-Level:** Can they build? Solid designs with some guidance. Should know standard patterns cold.
*   **Senior:** Can they own? Must drive independently, show deep expertise, discuss trade-offs proactively.
*   **Staff+:** Can they lead? Navigate ambiguity, think cross-system, consider organizational implications.

#### **The biggest calibration mistakes:**

*   Juniors who over-engineer look like they memorized without understanding
*   Mid-levels who can't go deeper look like juniors who got lucky
*   Seniors who wait for guidance look like mid-levels who got promoted too early
*   Staff who get lost in details look like strong seniors, not staff

#### **How to prepare:**

1.  Honestly assess your demonstrated capability, not your title or years of experience
2.  Research what level the company actually expects for your role
3.  Practice at that level, with the appropriate amount of guidance
4.  Know what red flags look like at your level and avoid them

The meta-skill

The best candidates don't just know the material. They understand what the interview is evaluating and demonstrate the right signals for their level. This isn't about gaming the system. It's about recognizing that a junior who gives a brilliant but memorized staff-level answer hasn't demonstrated that they can learn and grow, which is what junior interviews actually assess.

Prepare for the interview you're actually facing, not the one you wish you were facing.

Launching soon
