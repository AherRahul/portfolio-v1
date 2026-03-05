---
title: "Concepts"
description: "Concepts - System Design Interviews Module 3"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Concepts

System design interviews test your knowledge of how large-scale systems work. Without a solid foundation in core concepts, you'll struggle to design systems or explain your decisions.

The good news is that the same concepts appear across almost every system design problem. Master these fundamentals, and you'll have the building blocks to tackle any question.

This chapter covers the essential concepts you need to know, organized by category. For each concept, I'll explain what it is, why it matters, and when to use it.

# 1\. Scalability

Every system design interview eventually comes down to one question: "How does this handle more traffic?"

You might start with a simple design, but the interviewer will push you to scale it up. That's where scalability concepts become essential.

Definition

Scalability is your system's ability to handle growth, whether that's more users, more data, or more requests per second.

There are two fundamental approaches to scale a system.

### Vertical vs Horizontal Scaling

**Vertical Scaling (Scale Up)** means adding more power to your existing machine: faster CPU, more RAM, bigger disks. It's the "buy a bigger server" approach.

**Horizontal Scaling (Scale Out)** means adding more machines. Instead of one powerful server, you distribute the load across many smaller ones.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Aspect

Vertical Scaling

Horizontal Scaling

**Simplicity**

Simple, no code changes

Complex, requires distributed design

**Cost**

Expensive at high end

Cost-effective with commodity hardware

**Limits**

Hardware limits

Nearly unlimited

**Downtime**

Often requires downtime

Can scale without downtime

**Failure**

Single point of failure

Fault tolerant

In practice, you'll start with vertical scaling because it's simpler. Your application code doesn't need to change. Just upgrade the server. But eventually you hit a ceiling: there's only so much RAM you can add to a single machine, and those high-end servers get extremely expensive.

That's when you shift to horizontal scaling. It requires more architectural work (your application needs to be stateless, you need load balancers, etc.), but it gives you practically unlimited growth potential. Every large-scale system you've heard of, from Google to Netflix, uses horizontal scaling as their primary approach.

### Load Balancing

Once you have multiple servers, you need something to distribute traffic between them. That's your load balancer. It sits in front of your servers, receives all incoming requests, and decides which server should handle each one.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The interesting question is: how does the load balancer decide where to send each request? There are several algorithms, each suited for different situations.

##### **Load balancing algorithms:**

Algorithm

How It Works

Best For

**Round Robin**

Rotate through servers sequentially

Equal server capacity

**Weighted Round Robin**

More requests to higher-capacity servers

Mixed server capacity

**Least Connections**

Send to server with fewest active connections

Variable request duration

**IP Hash**

Hash client IP to determine server

Session persistence

**Least Response Time**

Send to fastest responding server

Performance optimization

Round Robin is the simplest and often good enough. But if your requests vary wildly in how long they take to process, Least Connections works better. It accounts for the fact that some servers might be bogged down with slow requests.

#### **A few things to keep in mind:**

Load balancers constantly ping your servers to check if they're healthy. If a server stops responding, the load balancer removes it from rotation, which is how you get automatic failover.

Sometimes you need "sticky sessions," where the same user always hits the same server. This happens when you store session data locally instead of in a shared cache. **IP Hash** gives you this, though a better solution is usually to make your servers stateless.

Load balancers can work at **Layer 4 (TCP)** or **Layer 7 (HTTP)**. Layer 7 is more flexible since you can route based on URL paths or headers, but Layer 4 is faster since it doesn't need to inspect the packet contents.

Most load balancers also handle **SSL termination**. Instead of every server dealing with encryption overhead, the load balancer decrypts incoming traffic and communicates with backend servers over plain HTTP within your trusted network.

### Auto Scaling

Traffic isn't constant. You might have 10x more users at noon than at 3 AM. Auto scaling lets you automatically add servers when traffic spikes and remove them when things calm down. You pay for what you use.

Auto scaling works by monitoring metrics and applying rules. Typical triggers include:

*   CPU utilization exceeds 70%
*   Memory usage crosses a threshold
*   Request queue grows too long
*   Custom application metrics (like orders per minute)

The key is setting good thresholds. Scale out too aggressively and you waste money. Scale out too slowly and your users see degraded performance during traffic spikes.

Most teams set both minimum and maximum instance counts. The minimum ensures you always have enough capacity for baseline traffic (and protects against scaling bugs that could bring you to zero). The maximum caps your spending and prevents runaway scaling.

# 2\. Databases

Your database choice shapes everything else in your design. Pick the wrong one and you'll spend the whole interview explaining workarounds. Pick the right one and the rest of your design falls into place naturally.

### SQL vs NoSQL

This is probably the most common decision you'll make in a system design interview. Let me break down when to reach for each.

**SQL (Relational) Databases** like MySQL or PostgreSQL give you:

*   A structured schema that enforces data integrity
*   ACID transactions for reliable multi-step operations
*   Powerful queries with JOINs across related data
*   Strong consistency by default

**NoSQL Databases** like MongoDB, Cassandra, or DynamoDB offer:

*   Flexible schemas that can evolve easily
*   Better horizontal scaling out of the box
*   Higher throughput for simple access patterns
*   Different data models depending on the database (document, key-value, wide-column, graph)

When to Choose SQL

When to Choose NoSQL

Data has clear relationships (users, orders, products)

Data structure varies or evolves frequently

You need complex transactions (money transfers, inventory)

You need massive scale (millions of writes/second)

Complex queries and ad-hoc reporting

Simple lookups by key (user profiles, session data)

Strong consistency is required (banking, e-commerce)

Eventual consistency is acceptable (social feeds, analytics)

Here's my rule of thumb for interviews: **start with SQL unless you have a specific reason not to**. It's the safer default. You can always explain that you'd move to NoSQL if you hit scaling limits, but most interviewers want to see you understand relational modeling first.

The specific reasons to choose NoSQL are: you need to handle massive write throughput (Cassandra), you have document-shaped data with no relationships (MongoDB), you need sub-millisecond key-value lookups (DynamoDB or Redis), or you're modeling graph relationships (Neo4j).

Note

In interviews, **SQL vs NoSQL** is often framed as a strict choice. In real systems, the line is getting blurry.

*   Modern **SQL** databases now support many “NoSQL” needs: **JSON columns**, flexible indexing, partitioning/sharding options, and strong performance at scale.
*   Many **NoSQL** databases have moved toward “SQL” features: richer query languages, **secondary indexes**, and even **transactions** and stronger consistency modes.

So the real question isn’t the label. It’s the trade-off: **data model + access patterns + consistency needs + scaling/latency goals + operational complexity**.

### Database Indexing

Without indexes, every query scans the entire table. With a million rows, that's a million comparisons. Add an index and you're down to about 20 comparisons (that's log₂ of 1 million). Indexes are how databases go from slow to fast.

Under the hood, most indexes use a **B-tree** structure. Think of it like a phone book: instead of reading every name from A to Z, you jump to the right section, then the right page, then find the entry. That's **O(log n)** instead of **O(n)**.

#### **Types of indexes you should know:**

*   **Primary index:** Automatically created on your primary key. Every table should have one.
*   **Secondary index:** Created on columns you frequently query by. If you're always looking up users by email, index the email column.
*   **Composite index:** Covers multiple columns. Useful when you query by combinations, like `WHERE status = 'active' AND created_at > '2024-01-01'`.
*   **Unique index:** Enforces that no two rows can have the same value. Your email column should probably have one.

#### **When to add an index:**

*   Columns you filter by (WHERE clauses)
*   Columns you join on (JOIN conditions)
*   Columns you sort by (ORDER BY)
*   Columns with many distinct values (high cardinality)

Tradeoff

Every index speeds up reads but slows down writes. When you INSERT or UPDATE a row, the database must also update every index on that table. For read-heavy workloads, index liberally. For write-heavy workloads, be more conservative.

### Database Replication

A single database is a single point of failure. If it dies, your application dies. Replication solves this by keeping copies of your data on multiple servers. If one goes down, another can take over.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The typical setup is one primary (handles all writes) and multiple replicas (handle reads). All writes go to the primary, which then propagates changes to the replicas.

The key question is: when does the primary consider a write "done"?

Replication Type

How It Works

Trade-off

Synchronous

Primary waits until replicas confirm the write

Guaranteed durability, but higher latency

Asynchronous

Primary confirms immediately, replicas catch up later

Fast writes, but risk of data loss if primary fails

Semi-synchronous

Primary waits for one replica, others catch up async

Middle ground

Most production systems use asynchronous replication because the latency of waiting for multiple replicas is too high. But this means your replicas might be slightly behind the primary.

This "replication lag" can cause surprising bugs. A user writes something, the write goes to the primary, but then the user's next read hits a replica that hasn't caught up yet. They don't see their own update. This is why you'll often see "read-your-writes" consistency mentioned, where you ensure a user's reads go to a replica that has their latest writes.

**Replication gives you three things:**

*   **High availability:** If the primary fails, promote a replica
*   **Read scalability:** Spread read traffic across multiple replicas
*   **Geographic distribution:** Put replicas closer to users in different regions

### Database Sharding (Partitioning)

Replication helps with read scalability, but every write still goes to one server. What if you have more writes than a single server can handle? Or more data than fits on one machine?

That's where sharding comes in. Instead of putting all your data on one database, you split it across multiple databases, each holding a portion of the data.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The critical decision is: how do you decide which shard holds which data?

Strategy

How It Works

Pros

Cons

**Range-based**

Shard by value ranges (A-H, I-P, Q-Z)

Simple to understand, range queries stay on one shard

Hot spots if data isn't evenly distributed

**Hash-based**

Hash the key and mod by number of shards

Even distribution across shards

Range queries must hit all shards

**Directory-based**

Lookup table maps each key to its shard

Maximum flexibility

Extra lookup on every query

Hash-based sharding is the most common choice because it naturally distributes data evenly. But it makes adding new shards painful since changing the number of shards changes where everything goes.

This is where **consistent hashing** becomes important. It's a clever technique that minimizes how much data moves when you add or remove a shard. Instead of rehashing everything, only a fraction of keys need to relocate. You'll see this in systems like Cassandra, DynamoDB, and distributed caches.

**Sharding comes with real costs:**

*   **Cross-shard queries are expensive.** A JOIN across two shards means coordinating between databases. If possible, design your sharding key so related data stays together.
*   **Transactions get complicated.** ACID transactions across shards require distributed transaction protocols, which are slow and complex.
*   **Rebalancing is painful.** Moving data between shards takes time and careful coordination.
*   **Hot spots can form.** If one shard key value is much more popular than others (think a celebrity's user\_id), that shard becomes a bottleneck.

Because of these challenges, sharding is typically a last resort. First, try vertical scaling, read replicas, and caching. Only shard when you've exhausted other options.

# 3\. Caching

Databases are slow. Even with indexes, a database query might take 10-100 milliseconds. A cache lookup? Under a millisecond. When you're handling thousands of requests per second, that difference matters.

Caching stores frequently accessed data in memory so you don't have to hit the database every time. Redis and Memcached are the most common choices.

### Cache Strategies

The first question is: how do you keep the cache and database in sync? There are several patterns, each with different trade-offs.

**Cache-Aside (Lazy Loading)** is the most common pattern. Your application code manages the cache directly:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The application checks the cache first. If the data is there (cache hit), return it immediately. If not (cache miss), read from the database, store the result in the cache, then return it. Simple and effective.

**Write-Through** writes to both cache and database on every write. The cache always has fresh data, but writes are slower since you're waiting for both operations.

**Write-Back (Write-Behind)** writes only to the cache and asynchronously flushes to the database later. This gives you fast writes, but if the cache crashes before flushing, you lose data. Use this only when speed matters more than durability.

**Write-Around** bypasses the cache entirely on writes. Data only enters the cache when it's read. Good for data that's written once and rarely read.

Strategy

Consistency

Read Performance

Write Performance

Risk

**Cache-Aside**

Eventually consistent

Fast (on hit)

Normal

Stale reads possible

**Write-Through**

Strong

Fast

Slower

None

**Write-Back**

Eventually consistent

Fast

Fastest

Data loss if cache fails

**Write-Around**

Eventually consistent

First read is slow

Fast

Cache may have stale data

For most interview problems, **cache-aside is the default choice**. It's simple, widely understood, and works well for read-heavy workloads.

### Cache Eviction Policies

Memory is finite. When the cache fills up, you need to decide what to remove. This is your eviction policy.

Policy

How It Works

Best For

**RU (Least Recently Used)**

Remove the item accessed longest ago

General purpose, most common

**LFU (Least Frequently Used)**

Remove the item accessed fewest times

Data with stable popularity patterns

**FIFO (First In First Out)**

Remove the oldest item

Simple, deterministic behavior

**TTL (Time To Live)**

Remove items after a set time

Data that has a natural expiration

**LRU is the default choice for most systems.** It's based on a reasonable assumption: if you haven't accessed something recently, you probably won't need it soon. Redis uses LRU by default.

LFU can be better when some items are consistently popular. Think product catalog data: some products get viewed constantly, others rarely. LFU keeps the popular ones in cache even if they weren't accessed in the last few seconds.

### Cache Invalidation

There's a famous quote: "There are only two hard things in Computer Science: cache invalidation and naming things."

The problem is simple to state: how do you ensure the cache doesn't serve stale data? But in practice, it's full of edge cases.

#### **Common approaches:**

**TTL-based expiration** is the simplest. Every cache entry has a time-to-live. After that time passes, the entry is automatically removed. This doesn't guarantee freshness, but it puts a bound on how stale data can be. A 5-minute TTL means you might serve data that's up to 5 minutes old.

**Event-based invalidation** is more precise. When data changes in the database, you explicitly delete or update the cache entry. This requires your application to know when changes happen and remember to invalidate.

**Version-based keys** embed a version in the cache key itself. When data changes, you increment the version. Old cache entries become orphaned and eventually evicted. This avoids explicit invalidation but wastes cache space.

#### **Watch out for cache stampedes**

When a popular cache entry expires, hundreds of requests might simultaneously hit the database to refresh it. Solutions include: lock the cache entry while refreshing (only one request hits the database), add jitter to TTLs (entries don't all expire at once), or proactively refresh entries before they expire.

### Content Delivery Network (CDN)

A CDN is a globally distributed caching layer. Instead of everyone fetching content from your origin server, requests go to the nearest "edge" server, which might be in the same city as the user.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

A user in Tokyo requesting an image doesn't need to make a round trip to your server in Virginia. The Tokyo edge server has a cached copy and returns it in milliseconds.

#### **What belongs on a CDN:**

*   Static assets: images, CSS, JavaScript, fonts
*   Video content (especially important since video files are large)
*   API responses that don't change often (with appropriate cache headers)

#### **What doesn't belong on a CDN:**

*   User-specific data (unless you're careful about cache keys)
*   Rapidly changing data
*   Authenticated content (though edge computing is changing this)

#### **The benefits are substantial:**

*   **Latency drops dramatically.** A user 10,000 miles from your server might have 150ms network latency. With a CDN edge nearby, that could be 10ms.
*   **Your origin server handles less traffic.** Most requests never reach it.
*   **Built-in DDoS protection.** CDN providers have massive infrastructure to absorb attack traffic.
*   **Higher availability.** Even if your origin goes down, the CDN can serve cached content.

For any system with global users and static content, CDN is essentially mandatory. Cloudflare, CloudFront, and Akamai are the major players.

# 4\. Messaging and Asynchronous Communication

When a user places an order, what needs to happen? Update inventory, send a confirmation email, notify the warehouse, update analytics.

Do all of these need to complete before the user sees "Order Placed"? Of course not.

Asynchronous processing is about doing work later or in parallel. The user gets a fast response while background systems handle the rest. This is how you build systems that stay responsive under load.

### Message Queues

A message queue is a buffer between services. One service produces messages, the queue holds them, and another service consumes them when ready.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

This decoupling is powerful. The producer doesn't need to know who consumes the message or when. The consumer can process at its own pace. If the consumer is temporarily down, messages wait in the queue instead of being lost.

#### **When to use message queues:**

*   **Decoupling services:** The order service doesn't need a direct connection to the email service.
*   **Absorbing traffic spikes:** A sudden surge in orders goes into the queue; workers process them steadily.
*   **Background jobs:** Anything that can happen later (sending emails, generating reports, image processing).
*   **Retries:** If processing fails, the message goes back in the queue for another attempt.

Common choices include **RabbitMQ** (feature-rich, supports complex routing), **Amazon SQS** (fully managed, integrates with AWS), and **Redis** (can work as a lightweight queue).

### Publish/Subscribe (Pub/Sub)

What if multiple services need to react to the same event? When an order is placed, the inventory service, notification service, and analytics service all need to know.

With a traditional queue, only one consumer gets each message. Pub/Sub solves this: the message goes to a topic, and every subscriber to that topic receives a copy.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The order service publishes an "Order Created" event. It doesn't know or care who's listening. The inventory, notification, and analytics services each subscribe to the topic and handle the event in their own way. You can add new subscribers without changing the publisher.

#### **Queue vs Pub/Sub:**

*   **Queue:** Each message processed by exactly one consumer. Use for distributing work.
*   **Pub/Sub:** Each message delivered to all subscribers. Use for broadcasting events.

**Apache Kafka**, **Google Pub/Sub**, and **Amazon SNS** are the common choices. Kafka is particularly popular because it combines pub/sub with durable storage, letting you replay messages.

### Message Delivery Guarantees

Networks fail. Servers crash. How do you ensure messages actually get delivered?

Guarantee

What It Means

Trade-off

**At-most-once**

Message might be lost, but never duplicated

Fastest, simplest

**At-least-once**

Message will arrive, possibly multiple times

Requires idempotent consumers

**Exactly-once**

Message delivered exactly once

Complex to implement correctly

**At-least-once is the practical default.** You accept that duplicates might happen and design your consumers to handle them safely. This is called idempotency: processing the same message twice has the same effect as processing it once.

For example, "set user email to X" is idempotent. Doing it twice gives the same result. But "increment counter by 1" is not. To make it idempotent, you'd track which messages you've already processed, perhaps by including a unique ID with each message.

Exactly-once semantics are hard to achieve in distributed systems. Kafka claims to support it under specific conditions, but in practice, designing for at-least-once with idempotent consumers is more reliable.

### Event Streaming (Kafka)

Traditional message queues delete messages once they're consumed. Kafka takes a different approach: messages are written to a durable, ordered log and retained for a configurable time (or forever).

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

This changes what's possible:

*   **Replay:** A new consumer can read from the beginning and catch up on all history.
*   **Multiple consumer groups:** Different systems can read the same topic independently at their own pace.
*   **Event sourcing:** Use Kafka as the source of truth. Reconstruct state by replaying events.

Kafka partitions topics for parallelism. Within a partition, messages are strictly ordered. Across partitions, there's no ordering guarantee. Choose your partition key carefully based on what ordering you need.

#### **Reach for Kafka when you need:**

*   High throughput (millions of messages per second)
*   Message replay or event sourcing
*   Stream processing pipelines
*   Multiple independent consumers reading the same data

# 5\. Networking Fundamentals

You don't need to be a networking expert for system design interviews, but you do need to understand how clients talk to servers and what options exist for real-time communication.

### DNS (Domain Name System)

Humans remember domain names; computers need IP addresses. DNS bridges the gap.

When you type "google.com" into a browser:

1.  Your browser checks its local DNS cache
2.  If not found, it asks your OS, which checks its cache
3.  If still not found, a DNS resolver queries authoritative DNS servers
4.  The IP address comes back and gets cached for future use

For system design, DNS matters in a few ways:

**Load balancing at DNS level:** A single domain can resolve to multiple IP addresses. The DNS server rotates through them (round-robin) or returns the closest one based on the user's location (geographic routing).

**Failover:** If a server dies, update DNS to point to a healthy one. The catch: DNS changes take time to propagate due to caching. A 60-second TTL means some users might still hit the old IP for up to a minute.

**Low TTL trade-off:** Shorter TTLs give you faster failover but increase DNS query load. Most production systems use TTLs between 60 seconds and 5 minutes.

### HTTP and REST

REST APIs are the backbone of most modern systems. You'll design them in almost every system design interview.

#### **HTTP methods you need to know:**

Method

Purpose

Idempotent?

Safe?

**GET**

Retrieve a resource

Yes

Yes

**POST**

Create a new resource

No

No

**PUT**

Replace a resource entirely

Yes

No

**PATCH**

Partial update

Yes

No

**DELETE**

Remove a resource

Yes

No

Understanding idempotency matters for retries. If a network glitch causes a PUT request to be sent twice, no harm done. The same PUT twice gives the same result. But POST is different: two identical POSTs might create two resources.

#### **Status codes to know:**

*   2xx means success (200 OK, 201 Created, 204 No Content)
*   3xx means redirect (301 Moved Permanently, 304 Not Modified)
*   4xx means client error (400 Bad Request, 401 Unauthorized, 404 Not Found, 429 Too Many Requests)
*   5xx means server error (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable)

When designing APIs, be thoughtful about which codes you return. A 503 tells clients to retry later; a 400 tells them to fix their request.

### Real-Time Communication

Standard HTTP is request-response: the client asks, the server answers. But what if the server needs to push updates to the client? There are several approaches, each with trade-offs.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

**Polling** is the simplest approach. The client repeatedly asks "any updates?" every few seconds. It works but wastes bandwidth and adds latency. If you poll every 5 seconds and an update happens right after a poll, you wait nearly 5 seconds to see it.

**Long Polling** improves on this. The server holds the request open until there's an update (or a timeout). The client immediately reconnects after each response. Lower latency, but still creates repeated connections.

**WebSockets** establish a persistent, bidirectional connection. Once connected, both client and server can send messages at any time. This is what chat applications, multiplayer games, and trading platforms use. The downside: WebSocket connections are stateful, which makes scaling harder. You need sticky sessions or a shared pub/sub layer so messages reach the right server.

**Server-Sent Events (SSE)** are simpler than WebSockets but only support server-to-client communication. The server pushes updates; the client can't send through the same connection. Good for notification feeds, live scores, or stock tickers.

Technique

Latency

Efficiency

Scaling Complexity

Best For

**Polling**

High

Low

Simple

Infrequent updates, simple systems

**Long Polling**

Medium

Medium

Medium

Moderate update frequency

**WebSockets**

Low

High

Complex

Real-time chat, games, collaboration

**SSE**

Low

High

Medium

Live feeds, notifications, dashboards

# 6\. Reliability and Fault Tolerance

Servers crash. Networks fail. Disks corrupt. The question isn't if your system will experience failures, but how it behaves when they happen. A well-designed system keeps running even when individual components fail.

### Redundancy

The fundamental principle: don't depend on any single component. If something matters, have at least two of it.

#### **Redundancy at every layer:**

*   Multiple application servers behind a load balancer
*   Database replicas ready to take over if the primary fails
*   Multiple data centers in case one goes offline
*   Redundant network paths between components

There are two approaches to redundancy:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

**Active-Active:** All instances handle traffic simultaneously. If one fails, the others absorb its load. More efficient since you're using all your capacity.

**Active-Passive:** One primary handles traffic while backups wait idle. If the primary fails, a backup takes over. Simpler but wastes resources during normal operation.

### Failover

Redundancy only helps if you can actually switch to the backup when needed. That's failover.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#### **Key questions for failover design:**

**How fast can you detect failure?** Health checks typically run every few seconds. Too frequent and you waste resources; too infrequent and users experience longer downtime.

**How fast can you switch over?** DNS-based failover might take minutes due to caching. An automated database failover might take seconds. A load balancer removing a dead server is nearly instant.

**Is the backup actually ready?** If you're failing over to a database replica, is it caught up with the primary? If there's replication lag, you might lose recent data.

### Circuit Breaker

Imagine Service A calls Service B, and Service B is slow or unresponsive. Without protection, Service A waits (blocking a thread), eventually times out, and might retry. Multiply this by thousands of concurrent requests, and Service A exhausts its resources waiting for a service that's already struggling.

A circuit breaker prevents this cascade. It monitors calls to a downstream service and "trips" when failures exceed a threshold.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#### **Three states:**

**Closed:** Normal operation. Requests flow through. The circuit breaker counts failures. If failures exceed a threshold (say 5 in 10 seconds), it trips open.

**Open:** The circuit is broken. Requests fail immediately without even trying to reach the downstream service. This gives the failing service time to recover and prevents your service from wasting resources on doomed requests.

**Half-Open:** After a timeout (maybe 30 seconds), the circuit breaker allows one test request through. If it succeeds, the circuit closes and normal operation resumes. If it fails, the circuit opens again.

The key insight: **failing fast is better than failing slow**. A timeout might take 30 seconds; a circuit breaker rejection takes milliseconds.

### Rate Limiting

Rate limiting protects your service from being overwhelmed, whether by accident (a buggy client retrying too fast), by attack (denial of service), or by legitimate traffic spikes that exceed your capacity.

#### **Common algorithms:**

**Token Bucket:** Imagine a bucket that fills with tokens at a steady rate. Each request consumes a token. If the bucket is empty, the request is rejected. This allows short bursts (you can empty the bucket quickly) while enforcing a long-term average rate.

**Sliding Window:** Count requests in a rolling time window. If you allow 100 requests per minute, and the user has made 100 in the last 60 seconds, reject the next one.

#### **Where to apply rate limits:**

*   **API gateway:** Protect your entire system from external traffic
*   **Per-user:** Fair usage limits (1000 API calls per hour)
*   **Per-IP:** Block abusive clients
*   **Per-endpoint:** Different limits for expensive vs cheap operations

When a request is rate-limited, return a 429 (Too Many Requests) status with a Retry-After header telling the client when to try again.

# 7\. Consistency and CAP Theorem

As soon as you have data on more than one machine, you face a fundamental question: what happens when those machines disagree, or can't talk to each other?

### CAP Theorem

The CAP theorem states that a distributed system can only guarantee two of three properties simultaneously:

*   **Consistency:** Every read receives the most recent write. All nodes see the same data at the same time.
*   **Availability:** Every request receives a response (even if it's not the latest data).
*   **Partition Tolerance:** The system continues operating despite network failures between nodes.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Here's the key insight: **network partitions are not optional**. Networks fail. Cables get cut. Data centers lose connectivity. You can't choose to avoid partitions. They happen.

So in practice, you're choosing between CP and AP:

**CP (Consistency + Partition Tolerance):** When a partition occurs, the system refuses to serve requests rather than return stale data. A banking system might choose this. Better to show an error than to display the wrong account balance.

**AP (Availability + Partition Tolerance):** When a partition occurs, the system continues serving requests, even if some nodes have stale data. A social media feed might choose this. Showing a slightly outdated post is better than showing nothing.

The choice depends on your use case. Ask: "What's worse, showing stale data or showing nothing?"

### Consistency Models

Consistency isn't binary. There's a spectrum between "always perfectly up-to-date" and "eventually catches up."

Model

What It Means

Example

**Strong Consistency**

Every read sees the latest write

Bank balance: you must see your deposit immediately

**Eventual Consistency**

Reads eventually return the latest write (delay is bounded but not zero)

Social media likes: it's OK if the count is a few seconds behind

**Causal Consistency**

Operations that are causally related are seen in order

If I reply to your comment, everyone sees your comment before my reply

**Read-Your-Writes**

A user always sees their own writes

After updating my profile, I see the change immediately

Strong consistency requires coordination between nodes, which adds latency. Eventual consistency is faster but means you might read stale data.

For many applications, **read-your-writes consistency is a practical middle ground**. Users see their own updates immediately (the experience feels consistent), but they might see other users' updates with a slight delay.

### ACID vs BASE

These acronyms describe two philosophies for data management.

**ACID** is what traditional relational databases provide:

*   **Atomicity:** A transaction either fully completes or fully fails. No partial updates.
*   **Consistency:** Transactions move the database from one valid state to another. Constraints are never violated.
*   **Isolation:** Concurrent transactions don't interfere with each other. It's as if they ran sequentially.
*   **Durability:** Once a transaction commits, the data is permanently saved, even if the system crashes.

**BASE** is the typical model for distributed NoSQL databases:

*   **Basically Available:** The system responds to every request, though responses might not reflect the latest state.
*   **Soft state:** Data may change over time as the system converges to consistency.
*   **Eventually consistent:** Given enough time without new updates, all replicas converge to the same state.

ACID gives you strong guarantees but limits scalability. BASE trades some guarantees for better scalability and availability. Most real systems use a combination: ACID for transactions that must be correct (payments), BASE for data where slight staleness is acceptable (view counts).

# 8\. API Design

You'll design APIs in almost every system design interview. A well-designed API communicates intent clearly and handles edge cases gracefully.

### REST Best Practices

**Resource naming matters.** Good APIs are intuitive to use.

```shell
1# Good - uses nouns, plural, and hierarchy
2GET /users                    # List users
3GET /users/123                # Get specific user
4GET /users/123/orders         # User's orders
5POST /users                   # Create user
6PUT /users/123                # Update user
7
8# Bad - uses verbs, inconsistent
9GET /getUser?id=123
10POST /createNewUser
11GET /user/123/getOrders
```

**Versioning keeps old clients working** when you make breaking changes.

The simplest approach is version in the URL path: `/v1/users`, `/v2/users`. It's explicit and easy to understand. Some prefer header-based versioning (`Accept: application/vnd.myapi.v1+json`), but URL versioning is more debuggable.

**Pagination prevents returning millions of records at once.**

```shell
1# Offset-based (simple but problematic for large datasets)
2GET /posts?offset=20&limit=10
3
4# Cursor-based (more robust for live data)
5GET /posts?cursor=eyJpZCI6MTAwfQ&limit=10
```

Cursor-based pagination is more reliable when data changes frequently. With offset-based pagination, if new items are inserted while paginating, you might see duplicates or miss items. Cursors track a stable position in the result set.

### Idempotency

Network requests fail and get retried. What happens if a payment request is sent twice because of a timeout? Without protection, the customer might be charged twice.

Idempotency keys solve this. The client generates a unique key for each operation and includes it in the request:

```shell
1POST /payments
2Idempotency-Key: abc-123-def-456
3Content-Type: application/json
4
5{
6  "amount": 100,
7  "currency": "USD",
8  "recipient": "user_789"
9}
```

The server stores the key and the result. If it sees the same key again, it returns the stored result instead of processing again. The client can retry safely without fear of duplicate side effects.

This is essential for any operation that shouldn't happen twice: payments, order creation, sending notifications.

# 9\. Back-of-Envelope Estimation

Interviewers don't expect precise calculations, but they do expect you to think about scale. "How much storage do we need?" "How many servers?" These questions require quick math.

The goal isn't precision. It's demonstrating that you understand the order of magnitude and can reason about capacity.

### Key Numbers to Memorize

You don't need many numbers, but these come up constantly:

Time Conversions

Rounded Value

Seconds in a day

~100,000 (actually 86,400)

Seconds in a month

~2.5 million

Seconds in a year

~30 million

Data Sizes

Size

UUID

16 bytes

Typical JSON object

1-5 KB

Average image (compressed)

200 KB - 1 MB

Average video (1 min, compressed)

50-100 MB

Latency

Time

Memory access (RAM)

100 ns

SSD random read

100 μs (0.1 ms)

Network within datacenter

0.5 ms

Network cross-continent

100-150 ms

Database query (indexed)

1-10 ms

Database query (full scan)

100+ ms

### Common Calculations

Here's how to approach typical estimation problems:

**Calculating QPS (Queries Per Second):**

```shell
1Given:
2- 100 million daily active users
3- Each user makes 10 requests per day
4
5Total daily requests = 100M × 10 = 1 billion
6Average QPS = 1 billion / 100,000 seconds = 10,000 QPS
7Peak QPS = 3x average = 30,000 QPS
```

The 3x multiplier for peak accounts for daily patterns. Traffic isn't uniform; there are spikes.

**Calculating Storage:**

```shell
1Given:
2- 10 million new posts per day
3- Each post is 1 KB (text + metadata)
4- Store for 5 years
5
6Daily storage = 10M × 1 KB = 10 GB
7Yearly storage = 10 GB × 365 = 3.65 TB
85-year storage = 3.65 TB × 5 ≈ 18 TB
```

For interviews, round liberally. 365 ≈ 400, 86,400 ≈ 100,000. Simpler math, same order of magnitude.

**Calculating Bandwidth:**

```shell
1Given:
2- 10,000 requests per second
3- Average response size: 10 KB
4
5Bandwidth = 10,000 × 10 KB = 100 MB/s = 800 Mbps
```

These calculations help you answer questions like "do we need to shard?" or "how many servers?" If your math shows 1 million QPS and each server handles 1,000 QPS, you need roughly 1,000 servers.

# Quick Reference Table

When you're in an interview, this table helps you quickly identify which concepts apply:

Problem

Reach For

Why

System is slow

Caching, CDN, database indexing

Reduce latency for common operations

Too much traffic for one server

Horizontal scaling, load balancer

Distribute load across machines

Need high availability

Replication, redundancy, failover

Eliminate single points of failure

Database can't handle the load

Read replicas, caching, sharding

Scale reads, then scale writes

Services affecting each other when failing

Circuit breakers, message queues

Isolate failures, decouple systems

Need real-time updates

WebSockets, SSE, pub/sub

Push data instead of polling

Traffic spikes overwhelming system

Message queues, auto-scaling, rate limiting

Buffer and absorb bursts

Global users experiencing latency

CDN, geographic replication

Move data closer to users

Complex data relationships

SQL database

JOINs, transactions, referential integrity

Simple key-value access at scale

NoSQL, Redis

High throughput, flexible schema

# Key Takeaways

These concepts appear in almost every system design interview. If you understand them well, you'll have the vocabulary and mental models to tackle any problem.

**Start simple, then scale.** Begin with the simplest design that could work. Add complexity only when you have a reason: more traffic, stricter requirements, bigger data.

**Every choice is a trade-off.** There's no "best" database or "correct" architecture. SQL gives you consistency but limits scale. Caching speeds reads but complicates consistency. Your job is to understand these trade-offs and choose based on the specific requirements.

**Think about failure modes.** What happens when this component dies? How does the system behave during a network partition? Interviewers love asking "what if X fails?" and strong candidates have answers ready.

**Numbers matter.** Back-of-envelope calculations transform vague designs into concrete ones. "We need sharding" is weak. "We have 10 million writes per day, which is ~100 writes per second, which a single PostgreSQL instance can handle easily" is strong.

**Communicate your reasoning.** The interview isn't just about knowing these concepts. It's about explaining why you chose one approach over another. Practice articulating trade-offs out loud.

We’ve covered the **concepts**—the core trade-offs behind scalable systems: caching, replication, sharding, queues, consistency, and more.

Next, we translate those ideas into **real tools**. In interviews, “add a cache” becomes **Redis**. “Use a queue” becomes **Kafka/SQS** with clear reasoning about guarantees, failure modes, and scaling.

In the next chapter, we’ll map each concept to the technologies engineers actually use and learn how to justify those choices confidently.

# Quiz

## Concepts Quiz

1 / 20

Multiple Choice

What is the main goal of scalability in system design?

AGuarantee zero downtime during every deploymentBHandle growth in users, data, or requests without breakingCStore all data in a single place for simplicityDEliminate all network latency between services

PreviousNext

Launching soon
