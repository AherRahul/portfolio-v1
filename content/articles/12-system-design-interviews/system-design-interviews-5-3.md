---
title: "MongoDB"
description: "MongoDB - System Design Interviews Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# MongoDB

MongoDB shows up in system design discussions for one simple reason: it makes it easy to scale and ship fast. When your data is naturally document-shaped (profiles, carts, activity feeds, content metadata), MongoDB can feel like the “default choice.”

MongoDB occupies a unique position in the database landscape. It offers the rich query capabilities that key-value stores lack, the schema flexibility that relational databases deny, and the horizontal scaling that single-node databases cannot provide.

But this middle ground comes with trade-offs: you cannot use it like a relational database and expect good results, and you cannot ignore data modeling and hope the flexibility saves you.

This chapter covers the practical MongoDB knowledge that matters in system design interviews: embedding versus referencing decisions, schema design patterns , shard key selection that prevents hot spots, and the consistency tuning that production systems require.

### MongoDB Architecture Overview

Application servers don’t talk to shard nodes directly. They connect to **mongos query routers** (M1/M2). `mongos` is the stateless front door of a sharded MongoDB cluster: it accepts client requests, consults cluster metadata, and routes each operation to the right shard(s).

That routing metadata lives on the **config servers**, which run as a **replica set** (C1/C2/C3) for high availability. Config servers store the cluster’s sharding configuration: which collections are sharded, the shard key ranges (chunks), and which shard owns which chunk. `mongos` reads this metadata to decide where a query or write should go.

Each shard (Shard 1 and Shard 2) is itself a **replica set**:

*   a **Primary** node handles all writes (and can serve reads, depending on read preference)
*   **Secondary** nodes replicate from the primary and can serve read traffic if configured
*   if the primary fails, the replica set elects a new primary automatically

For a request flow:

*   **Writes** go through `mongos` to the primary of the target shard (chosen by the shard key). The primary then replicates the operation to its secondaries.
*   **Reads** go through `mongos` as well. If the query includes the shard key (or is otherwise targeted), `mongos` routes it to the relevant shard. If not, it may do a **scatter-gather** across shards and merge results.
*   Replication within each shard provides **availability**, while sharding across shards provides **horizontal scale** for data size and throughput.

# 1\. When to Choose MongoDB

Every database makes trade-offs. MongoDB traded the rigid structure and transaction optimization of relational databases for schema flexibility and document-oriented storage. It traded the extreme simplicity of key-value stores for rich query capabilities.

Understanding exactly where these trade-offs pay off, and where they cost you, is essential for making defensible database choices in interviews.

### 1.1 Choose MongoDB When You Have

#### **Flexible or evolving schemas**

Your data structure changes frequently, or different records have different fields. MongoDB does not require schema migrations for adding new fields.

#### **Document-centric data**

Your data naturally forms self-contained documents (articles, products, user profiles) rather than highly normalized relations.

#### **Rich query requirements**

You need complex queries, aggregations, full-text search, or geospatial queries beyond simple key-value lookups.

#### **Rapid development**

You are building a prototype or MVP where schema flexibility accelerates iteration.

#### **Hierarchical or nested data**

Your data has natural nesting (comments within posts, items within orders) that would require multiple joins in SQL.

#### **Horizontal scaling needs**

You anticipate needing to scale beyond a single server with built-in sharding support.

### 1.2 Avoid MongoDB When You Need

#### **Complex multi-table transactions**

While MongoDB supports transactions, it is not optimized for workloads with frequent cross-collection transactions like banking systems.

#### **Highly relational data**

If your data requires many relationships and frequent joins across entities, a relational database with proper foreign keys is cleaner.

#### **Strong schema enforcement**

When data integrity is critical and you need strict validation, PostgreSQL's constraints are more robust.

#### **Simple key-value access**

If you only need primary key lookups at massive scale, DynamoDB or Redis is more efficient.

#### **Heavy analytics workloads**

For OLAP queries over large datasets, data warehouses like Redshift or BigQuery are better suited.

### 1.3 Common Interview Systems Using MongoDB

System

Why MongoDB Works

Content Management System

Flexible schema for diverse content types

E-commerce Product Catalog

Products with varying attributes

Social Network

User profiles, posts, comments with nested data

Real-time Analytics Dashboard

Aggregation framework, time-series support

Mobile App Backend

Schema flexibility, offline sync with Realm

Gaming User Profiles

Complex nested data, frequent schema changes

**In practice:** Database selection should be justified by specific requirements, not general preferences. When proposing MongoDB for a content management system, explain that articles have varying structures (some have videos, some have galleries, some have interactive elements) and that the aggregation pipeline enables complex content queries without external search infrastructure.

When proposing it for an e-commerce catalog, note that products across categories have fundamentally different attributes, and the document model handles this heterogeneity naturally. The strength of the answer comes from matching MongoDB's specific capabilities to the problem's specific needs.

# 2\. Data Modeling: Embedding vs Referencing

If you approach MongoDB with relational database thinking, you will end up with the worst of both worlds: the operational complexity of a document database without the query flexibility of a relational one.

The fundamental modeling decision in MongoDB is whether to embed related data within a document or reference it in a separate collection. This choice affects query performance, data consistency, and application complexity. There is no universally correct answer, only trade-offs that favor different access patterns.

### 2.1 Embedding (Denormalization)

Store related data together in a single document.

#### **Advantages:**

*   Single read retrieves all data (no joins)
*   Atomic updates on the entire document
*   Better read performance for common access patterns
*   Simpler application code

#### **Disadvantages:**

*   Data duplication if embedded data is shared
*   Document size limit (16 MB)
*   Updates to shared data require updating multiple documents

### 2.2 Referencing (Normalization)

Store related data in separate collections with references.

#### **Advantages:**

*   No data duplication
*   Smaller document sizes
*   Easier to update shared data
*   Better for many-to-many relationships

#### **Disadvantages:**

*   Requires multiple queries or $lookup
*   No atomic operations across collections (without transactions)
*   More complex application code

### 2.3 Decision Framework

#### **Embed when:**

*   Data is accessed together (1:1 or 1:few relationships)
*   Child data does not make sense outside parent context
*   Data does not change frequently
*   Array will not grow unbounded

#### **Reference when:**

*   Data is accessed independently
*   Many-to-many relationships exist
*   Child collection can grow unbounded
*   Data is frequently updated across many parents

### 2.4 Hybrid Approach

Often the best solution combines both strategies:

This approach:

*   Embeds data needed for display (customer\_snapshot)
*   References canonical data that might change (customer\_id)
*   Keeps related items together for atomic updates

**In practice:** Embedding and referencing decisions should be justified by specific access patterns, not abstract rules. For an order management system, explain that you embed line items because they are always fetched with the order, never queried independently, and the order total calculation benefits from having all items in one document.

For a user and address relationship, note that you reference addresses because users may have many addresses, addresses change independently of user profiles, and the same address might be shared across family members. This kind of reasoning demonstrates that you understand the trade-offs, not just the syntax.

# 3\. Schema Design Patterns

The embedding versus referencing decision provides the foundation, but real-world data modeling requires more nuanced patterns. Over years of production usage, the MongoDB community has developed patterns that solve recurring problems: handling documents with wildly varying attributes, managing time-series data at scale, dealing with outliers that would otherwise blow up your document sizes.

Knowing these patterns, and when each applies, demonstrates practical experience beyond textbook knowledge.

### 3.1 Attribute Pattern

**Problem:** Documents have many similar fields, or fields vary between documents.

**Solution:** Move sparse attributes to an array of key-value pairs.

**Benefits:**

*   Index on `attributes.key` and `attributes.value` covers all attributes
*   No null fields wasting space
*   Easy to add new attributes

**Use case:** Product catalogs with varying specifications.

### 3.2 Bucket Pattern

**Problem:** High-frequency time-series data creates too many documents.

**Solution:** Group multiple data points into time-based buckets.

**Benefits:**

*   Fewer documents (better index efficiency)
*   Pre-computed aggregates for common queries
*   Controlled document size

**Use case:** IoT sensor data, application metrics, time-series analytics.

### 3.3 Outlier Pattern

**Problem:** Most documents are small, but a few are extremely large.

**Solution:** Handle outliers separately with overflow documents.

**Benefits:**

*   Most queries work on compact documents
*   Outliers handled without penalizing normal cases
*   Avoids 16 MB document limit

**Use case:** Social media posts with viral engagement, products with many reviews.

### 3.4 Computed Pattern

**Problem:** Expensive computations run repeatedly on the same data.

**Solution:** Pre-compute and store results, update on writes.

**Benefits:**

*   Reads are instant (no aggregation needed)
*   Trade write complexity for read performance
*   Can be updated incrementally or periodically

**Use case:** Dashboards, product ratings, leaderboards.

### 3.5 Extended Reference Pattern

**Problem:** Frequent joins to fetch commonly needed fields from referenced documents.

**Solution:** Copy frequently accessed fields into the referencing document.

**Benefits:**

*   Avoids joins for common queries
*   Canonical data still in referenced collection
*   Trade consistency for read performance

**Caveat:** Must update copies when source changes (eventual consistency).

**Use case:** Order history display, activity feeds, denormalized views.

# 4\. Shard Key Selection Strategies

The shard key is the most consequential decision in a sharded MongoDB deployment. It determines how data distributes across shards, which queries can target specific shards, and whether your cluster remains balanced under load.

Unlike most schema decisions that can be adjusted over time, the shard key is effectively immutable. Changing it requires migrating data to a new collection. Getting this decision wrong can mean living with performance problems for the lifetime of your application or undertaking a painful migration.

### 4.1 Shard Key Requirements

A good shard key should have:

**High cardinality:** Many distinct values to distribute data across shards.

**Even distribution:** Values appear with similar frequency to avoid hot spots.

**Query isolation:** Common queries include the shard key to target specific shards.

**Write distribution:** Writes spread across shards rather than concentrating on one.

### 4.2 Common Shard Key Strategies

#### **1\. Hashed Shard Key**

**Pros:**

*   Even distribution regardless of key pattern
*   Good for monotonically increasing keys (ObjectId, timestamp)

**Cons:**

*   Range queries become scatter-gather (must hit all shards)
*   Cannot use targeted queries for ranges

**Best for:** Write-heavy workloads with point queries.

#### **2\. Ranged Shard Key**

**Pros:**

*   Range queries on shard key are targeted
*   Related data stays together

**Cons:**

*   Can create hot spots if distribution is uneven
*   Monotonically increasing keys cause "hot shard" at the end

**Best for:** Read-heavy workloads with range queries.

#### **3\. Compound Shard Key**

**Pros:**

*   Combines distribution (tenant\_id) with ordering (timestamp)
*   Queries on prefix are targeted

**Cons:**

*   More complex to design
*   Must include leading fields in queries

**Best for:** Multi-tenant applications with time-based data.

### 4.3 Shard Key Anti-Patterns

Anti-Pattern

Problem

Solution

Low cardinality

Few values limit max shards

Use compound key or hash

Monotonically increasing

All writes hit one shard

Use hashed key or add random prefix

Highly mutable

Shard key changes require document migration

Choose immutable field

Query mismatch

Common queries do not include shard key

Redesign key to match access patterns

### 4.4 Shard Key Example: E-commerce Orders

**Requirements:**

*   Query orders by customer
*   Query orders by date range
*   High write volume during sales

**Option 1: customer\_id (ranged)**

*   Good for: "Get all orders for customer X"
*   Bad for: "Get all orders from last hour" (scatter-gather)

**Option 2: order\_date (ranged)**

*   Good for: "Get orders from date range"
*   Bad for: Hot shard during active hours

**Option 3: Compound key (recommended)**

*   Distributes writes across shards (hashed customer\_id)
*   Supports customer queries (targeted)
*   Date queries are scatter-gather (acceptable trade-off)

# 5\. Indexing for Performance

Schema design determines what data you store together. Indexing determines how fast you can find it. Without indexes, MongoDB performs collection scans, reading every document to find matches. This works fine for hundreds of documents but becomes catastrophic at scale.

A query that takes 5 milliseconds with a proper index might take 5 seconds without one. Understanding index types, compound index ordering, and the trade-off between read performance and write overhead is essential for building performant MongoDB applications.

### 5.1 Index Types and When to Use Them

**Single Field Index**

Use for: Simple queries on one field.

**Compound Index**

Use for: Queries filtering/sorting on multiple fields. Order matters.

**Multikey Index (Arrays)**

Use for: Searching within array fields.

**Text Index**

Use for: Full-text search.

**Geospatial Index**

Use for: Location-based queries.

**TTL Index**

Use for: Automatic document expiration.

### 5.2 Compound Index Order (ESR Rule)

For compound indexes, follow the **Equality, Sort, Range** order:

**Why this order?**

1.  **Equality** narrows down candidates immediately
2.  **Sort** uses index order (no in-memory sort)
3.  **Range** filters remaining documents

### 5.3 Covered Queries

A **covered query** returns results directly from the index without accessing documents.

### 5.4 Index Intersection

MongoDB can combine multiple indexes for a single query:

However, a compound index is usually more efficient than intersection.

### 5.5 Index Strategy Guidelines

Scenario

Strategy

High-frequency query

Dedicated compound index

Ad-hoc queries

Multiple single-field indexes

Text search

Text index with weights

Geospatial

2dsphere index

Time-based expiration

TTL index

Unique constraint

Unique index

**In practice:** Index discussions should balance read optimization against write overhead. For a product catalog with frequent searches but infrequent updates, explain that you would create compound indexes for each major query pattern and accept the storage overhead. For an IoT system ingesting thousands of sensor readings per second, note that you would minimize indexes to avoid write bottlenecks, perhaps indexing only the sensor\_id and timestamp needed for retrieval.

The key is demonstrating that you understand indexes as a trade-off, not a free performance boost: each index speeds up certain reads but slows down every write and consumes memory.

# 6\. Read and Write Concerns

MongoDB does not force you into a single consistency model. Unlike databases that offer only strong consistency or only eventual consistency, MongoDB lets you choose per operation.

A write concern controls how many replicas must acknowledge a write before it is considered successful. A read concern controls what consistency guarantees apply to reads. A read preference controls which nodes can serve reads.

Together, these settings let you tune the consistency-latency trade-off for each operation based on its requirements.

### 6.1 Write Concern

Write concern specifies the acknowledgment level for write operations.

Level

Meaning

Durability

Latency

`w: 0`

Fire and forget

None

Lowest

`w: 1`

Primary acknowledges

Primary only

Low

`w: "majority"`

Majority acknowledges

Survives failover

Medium

`w: <number>`

N nodes acknowledge

Custom

Varies

**Adding Journal:**

### 6.2 Read Concern

Read concern specifies the consistency level for read operations.

Level

Meaning

Use Case

`local`

Returns latest data on queried node

Default, fastest

`available`

Returns data without checking replication

Sharded clusters

`majority`

Returns data acknowledged by majority

Consistent reads

`linearizable`

Returns most recent majority-committed data

Strongest consistency

`snapshot`

Returns data from a consistent snapshot

Transactions

### 6.3 Read Preference

Read preference determines which nodes can serve reads.

Mode

Reads From

Trade-off

`primary`

Primary only

Consistent, higher load on primary

`primaryPreferred`

Primary, fallback secondary

Balanced

`secondary`

Secondaries only

May read stale data

`secondaryPreferred`

Secondary, fallback primary

Analytics workloads

`nearest`

Lowest latency node

Best for geo-distributed

### 6.4 Combining for Consistency Levels

Requirement

Write Concern

Read Concern

Read Preference

Fire and forget

w: 0

local

primary

Acknowledge write

w: 1

local

primary

Survive failover

w: majority

majority

primary

Strongest consistency

w: majority, j: true

linearizable

primary

Read scalability

w: 1

local

secondaryPreferred

# 7\. Transactions and Consistency

MongoDB added multi-document ACID transactions in version 4.0, eliminating a major reason teams avoided it for transactional workloads. But transactions come with overhead: additional latency, lock contention, and operational complexity.

The best MongoDB applications minimize transaction usage by designing documents to be self-contained units of atomicity. When you do need transactions, understanding their limitations helps you use them effectively.

### 7.1 Single Document Atomicity

Operations on a single document are always atomic. This is often sufficient:

Design documents to keep related data together, avoiding the need for transactions.

### 7.2 Multi-Document Transactions

When you must update multiple documents atomically:

### 7.3 Transaction Limitations

Limitation

Value

Implication

Time limit

60 seconds default

Long transactions fail

Size limit

16 MB total changes

Large batch updates problematic

Lock contention

Write conflicts abort

Design to minimize conflicts

Performance

10-20% overhead

Use sparingly

Sharded clusters

Cross-shard transactions are slower

Consider shard key design

### 7.4 When to Use Transactions

**Use transactions for:**

*   Financial operations (transfers, payments)
*   Inventory management (stock decrements)
*   Multi-entity updates that must be atomic
*   Referential integrity enforcement

**Avoid transactions when:**

*   Single document updates suffice
*   High throughput is critical
*   Eventual consistency is acceptable
*   Operations can be idempotent

# 8\. Change Streams for Real-Time Features

Many applications need to react to data changes in real time: updating a dashboard when new orders arrive, invalidating a cache when products change, syncing data to a search index when documents update.

The traditional approach is polling: repeatedly querying the database for changes. Change streams provide a better alternative. They use MongoDB's oplog (the same replication mechanism that keeps secondaries in sync) to push changes to applications as they happen, eliminating polling overhead and reducing latency.

### 8.1 How Change Streams Work

Change streams use the oplog to notify applications of data changes:

### 8.2 Change Stream Examples

**Watch a collection:**

**Filter changes:**

### 8.3 Use Cases for Change Streams

Use Case

Implementation

Real-time notifications

Watch for new messages, trigger push

Cache invalidation

Watch for updates, invalidate Redis

Search sync

Watch for changes, update Elasticsearch

Audit logging

Watch all changes, write to audit collection

Event sourcing

Capture changes as domain events

Dashboard updates

Stream changes to WebSocket clients

### 8.4 Change Streams vs Polling

Aspect

Change Streams

Polling

Latency

Near real-time

Polling interval

Efficiency

Push-based

Repeated queries

Ordering

Guaranteed order

May miss or duplicate

Resume

Built-in resume tokens

Application logic

Complexity

Higher setup

Simple

# 9\. MongoDB vs Other Databases

Choosing between MongoDB and alternatives requires understanding the specific trade-offs each database makes. MongoDB sacrifices the rigid consistency of relational databases for schema flexibility and horizontal scaling.

PostgreSQL sacrifices some flexibility for transactional guarantees and SQL's expressive power. DynamoDB sacrifices query richness for operational simplicity and extreme scale. Cassandra sacrifices query flexibility for write throughput. The right choice depends on which trade-offs align with your requirements.

### 9.1 MongoDB vs PostgreSQL

Aspect

MongoDB

PostgreSQL

Data model

Document (JSON)

Relational (tables)

Schema

Flexible

Strict with migrations

Joins

$lookup (limited)

Full SQL joins

Transactions

Supported (overhead)

Optimized for transactions

Scaling

Native sharding

Manual sharding/Citus

Query language

MQL

SQL

Best for

Flexible schemas, rapid dev

Complex queries, strong consistency

**Choose MongoDB:** Document-centric data, evolving schemas, horizontal scaling needs.

**Choose PostgreSQL:** Complex relationships, heavy transactions, SQL familiarity.

### 9.2 MongoDB vs DynamoDB

Aspect

MongoDB

DynamoDB

Data model

Rich documents

Key-value/simple documents

Query capability

Rich (aggregation, joins)

Limited (key-based + filters)

Schema design

Query later possible

Query first required

Scaling

Manual sharding setup

Automatic

Management

Self-managed or Atlas

Fully managed

Cost model

Infrastructure

Pay per request/capacity

Best for

Flexible queries

Known access patterns at scale

**Choose MongoDB:** Need rich queries, aggregations, or flexible access patterns.

**Choose DynamoDB:** Known access patterns, massive scale, operational simplicity.

### 9.3 MongoDB vs Cassandra

Aspect

MongoDB

Cassandra

Architecture

Primary-secondary

Masterless ring

Consistency

Tunable (default: strong)

Tunable (default: eventual)

Query model

Rich queries

Partition key focused

Write performance

Good

Excellent

Use case

General purpose

Write-heavy, time-series

Operations

Simpler

More complex

**Choose MongoDB:** General purpose document storage with rich queries.

**Choose Cassandra:** Extreme write throughput, always-on availability requirements.

### 9.4 Decision Matrix

# Summary

MongoDB works because it occupies a practical middle ground in the database landscape. It offers richer queries than key-value stores, more flexibility than relational databases, and simpler scaling than many alternatives. But this middle ground requires understanding the trade-offs. You cannot use MongoDB like a relational database and expect good results. You cannot ignore schema design and hope the flexibility saves you.

The embedding versus referencing decision is the foundation of MongoDB data modeling. Embed data that is accessed together, has a bounded size, and does not make sense outside its parent context. Reference data that is accessed independently, grows unbounded, or participates in many-to-many relationships. The hybrid approach, combining embedding with references, often provides the best of both worlds.

Schema design patterns solve recurring problems that simple embedding and referencing cannot address. The attribute pattern handles documents with wildly varying fields. The bucket pattern manages high-frequency time-series data. The outlier pattern prevents viral content from bloating your typical documents. The computed pattern trades write complexity for read performance. Knowing these patterns, and when to apply each one, demonstrates practical experience.

The shard key deserves obsessive attention because it is effectively permanent. A poor choice creates hot spots that throttle your entire cluster or forces scatter-gather queries that negate the benefits of sharding. High cardinality, even distribution, and alignment with query patterns are the requirements. The compound shard key, combining distribution with ordering, often provides the best balance.

Consistency tuning transforms MongoDB from a single-consistency database into whatever your application needs. Write concern "majority" for durability, read concern "majority" for consistency, read preference "secondaryPreferred" for scaling, and the combination of all three for different operations based on their specific requirements. Change streams enable real-time reactions to data changes without polling. Transactions provide atomicity across documents when needed, but designing documents to be self-contained units of atomicity remains the preferred approach.

# References

*   [MongoDB Manual](https://www.mongodb.com/docs/manual/) - Official MongoDB documentation covering all features and best practices
*   [MongoDB Schema Design Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary) - Official guide to schema design patterns
*   [MongoDB University](https://learn.mongodb.com/) - Free courses on MongoDB data modeling and performance
*   [Data Modeling in MongoDB](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/) - Official data modeling guide with embedding vs referencing guidelines
*   [Sharding Best Practices](https://www.mongodb.com/docs/manual/sharding/) - Official sharding documentation and shard key selection strategies

# Quiz

## MongoDB Quiz

1 / 19

Multiple Choice

In a sharded MongoDB cluster, what component do application servers typically connect to?

PreviousNext

Launching soon
