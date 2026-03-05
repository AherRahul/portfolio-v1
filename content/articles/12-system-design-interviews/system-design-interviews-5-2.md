---
title: "MySQL"
description: "MySQL - System Design Interviews Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# MySQL

MySQL is one of the most widely deployed databases in the world, which means you’ll run into it everywhere: early-stage startups, massive enterprise systems, and plenty of system design interviews.

But most engineers only learn the surface area (tables, indexes, and a few SQL queries) until something breaks in production: a deadlock during a sale, replication lag during peak traffic, or a query that suddenly goes from milliseconds to minutes.

This chapter covers the practical MySQL knowledge that matters in system design interviews: InnoDB internals, indexing strategies, replication architectures for availability, and sharding approaches for scale.

### MySQL Architecture Overview

Client applications (Web Server 1..N) don’t connect to MySQL directly. They go through **ProxySQL**, which manages connection pooling, routing, and load balancing. This prevents “connection storms” and gives you a single place to enforce policies like read/write splitting and query rules.

From ProxySQL:

*   **Writes** are routed to the **MySQL Primary**.
*   **Reads** are routed to **read replicas** (Replica 1/2) to scale read throughput.

Inside the primary, each query flows through MySQL’s execution pipeline:

1.  **SQL Parser** parses the SQL text, validates syntax, and builds an internal query representation.
2.  **Query Optimizer** chooses an execution plan (which index to use, join order, access paths, etc.).
3.  **Execution Engine** runs that plan and calls into the storage engine to read/write rows.

For transactional workloads, the storage engine is typically **InnoDB**. InnoDB handles the core durability and consistency mechanics:

*   The **Buffer Pool** is the in-memory cache for table and index pages. A healthy buffer pool turns random disk I/O into memory hits.
*   The **Redo Log** records physical changes so MySQL can recover quickly after a crash. The primary can acknowledge commits once the redo is durable (depending on settings), even if data pages haven’t been flushed yet.

For replication and read scaling, the primary ships changes to replicas using the **binary log (binlog)** stream (shown as flowing from the log component to Replica 1/2). Replicas apply these events to stay in sync, enabling you to offload read traffic—while keeping the primary as the source of truth for writes.

# 1\. When to Choose MySQL

Every database makes trade-offs. MySQL traded some advanced features for operational simplicity and read performance. Understanding exactly where these trade-offs pay off, and where they do not, allows you to make defensible choices in interviews.

### 1.1 Choose MySQL When You Have

#### **Read-heavy web applications**

The classic MySQL use case. A typical web application reads data far more than it writes. User profiles are written once and read thousands of times. Product catalogs change rarely but are browsed constantly.

MySQL's replication model excels here: add read replicas to scale reads linearly while keeping a single primary for writes.

#### **Need for operational simplicity**

MySQL has been running in production for decades. Its failure modes are well understood. Tools for backup, monitoring, and migration are mature. Engineers know how to operate it.

This operational maturity matters more than feature lists when your system needs to run reliably at 3 AM.

#### **Structured data with relationships**

Users have orders. Orders have items. Items have products. When your data naturally forms relationships, relational databases like MySQL let you query across those relationships efficiently.

The alternative, denormalizing everything for a document store, creates consistency headaches.

#### **ACID transaction requirements**

InnoDB provides full ACID compliance. A transfer from one account to another either completes fully or rolls back entirely. An order either reserves inventory and creates the order record, or neither happens.

These guarantees are built into the storage engine, not bolted on.

#### **Existing ecosystem investment**

Your ORM supports MySQL. Your monitoring dashboards understand MySQL metrics. Your team has MySQL expertise.

Switching databases has hidden costs beyond code changes: training, tooling, and operational knowledge. Sometimes the best database is the one your team knows.

### 1.2 When MySQL Is Not the Right Fit

Understanding MySQL's limitations matters as much as knowing its strengths. Proposing MySQL for the wrong problem signals inexperience.

#### **Advanced SQL features**

If your queries rely heavily on CTEs, window functions, or complex JSONB operations, PostgreSQL provides a more capable query engine.

MySQL's window function support arrived late (8.0) and remains less comprehensive. Its JSON support, while functional, lacks PostgreSQL's JSONB indexing capabilities.

#### **Extreme write throughput**

MySQL's replication was designed around a single-threaded SQL applier (improved in recent versions, but still a consideration).

For workloads with millions of writes per second, databases designed for write-heavy patterns like Cassandra or ScyllaDB handle the load more naturally.

#### **Native horizontal scaling**

MySQL scales vertically well and handles read scaling through replicas, but write scaling requires sharding.

Unlike databases that handle sharding internally (CockroachDB, TiDB, Cassandra), MySQL sharding requires external coordination through tools like Vitess or application-level logic.

#### **Complex data types**

PostgreSQL's support for arrays, ranges, and custom types is more mature. If your domain naturally includes these types (scheduling with ranges, tagging with arrays), PostgreSQL provides better primitives.

#### **Sophisticated geospatial queries**

MySQL has spatial extensions, but PostGIS with PostgreSQL offers a more complete geospatial toolkit. For applications where location queries are central rather than incidental, PostGIS is the stronger choice.

### 1.3 Common Interview Systems Using MySQL

System

Why MySQL Works

Social Network (Facebook)

Read-heavy, mature replication

E-commerce (Shopify)

ACID for orders, read replicas for catalog

Content Management

Simple CRUD, easy scaling

User Authentication

Reliable, ACID transactions

URL Shortener

Simple schema, high read volume

Chat Metadata

User profiles, relationships

**In practice:** When proposing MySQL in an interview, connect your choice to the specific requirements. For a social network with high read volume, mention that MySQL's replication model allows you to scale reads by adding replicas.

For an e-commerce platform, emphasize InnoDB's ACID transactions for order processing. The strength of the answer comes from matching MySQL's capabilities to the problem, not from claiming MySQL is always the best choice.

# 2\. Storage Engines: InnoDB vs MyISAM

One of MySQL's distinctive architectural choices is its pluggable storage engine layer. The SQL parser, optimizer, and connection handling are separate from the component that actually stores and retrieves data. This means different tables can use different storage engines, each with different characteristics.

In practice, this flexibility mostly matters for understanding MySQL's history and the occasional legacy system. For modern applications, the answer is simple: use InnoDB. But understanding why requires knowing what InnoDB provides that alternatives do not.

### 2.1 InnoDB (Default, Recommended)

InnoDB became the default storage engine in MySQL 5.5 (2010), reflecting its maturity and the industry's need for transactional guarantees. Today, there is rarely a reason to choose anything else.

**Key features:**

*   **ACID compliant**: Full transaction support with commit, rollback, and crash recovery
*   **Row-level locking**: High concurrency for mixed read/write workloads
*   **Foreign keys**: Referential integrity enforcement
*   **MVCC**: Multi-Version Concurrency Control for consistent reads without locking
*   **Crash recovery**: Automatic recovery from redo logs
*   **Clustered index**: Data stored in primary key order

### 2.2 MyISAM (Legacy)

MyISAM was the default before MySQL 5.5. Still used for specific cases.

**Key features:**

*   **Table-level locking**: Simple but limits concurrency
*   **Full-text search**: Native full-text indexing (InnoDB now has this too)
*   **Compressed tables**: Read-only compressed storage
*   **No transactions**: No ACID support
*   **No crash recovery**: Data corruption possible on crash

### 2.3 When to Use Each

Factor

InnoDB

MyISAM

Transactions

Yes

No

Locking

Row-level

Table-level

Foreign keys

Yes

No

Crash recovery

Yes

No

Full-text search

Yes (5.6+)

Yes

Concurrency

High

Low

Use case

Production systems

Read-only analytics, legacy

**Modern recommendation:** Use InnoDB for everything. MyISAM's advantages have been eliminated in recent MySQL versions.

# 3\. InnoDB Deep Dive

Understanding how InnoDB works internally is not just academic knowledge. It explains why certain configurations matter, why some queries are fast and others slow, and what happens when things go wrong.

This understanding demonstrates depth that separates senior engineers from those who just use MySQL without understanding it.

### 3.1 Buffer Pool

The buffer pool is InnoDB's most important component for performance. It is an in-memory cache that holds data pages, index pages, and other metadata. When MySQL reads a row, it first checks the buffer pool. If the page is there (a "hit"), no disk I/O is needed. If not (a "miss"), it must read from disk, which is orders of magnitude slower.

**Configuration:**

**Sizing guideline:**

*   Dedicated server: 70-80% of RAM
*   Shared server: 50% of RAM
*   Minimum: Enough to fit working set

**Monitoring:**

### 3.2 Redo Log (Write-Ahead Log)

How can MySQL acknowledge a commit immediately while data pages are still only in memory?

The answer is the redo log, also known as the write-ahead log (WAL). Instead of writing changed pages to their final locations on disk (which requires random I/O), MySQL writes a compact description of the change to the redo log (sequential I/O).

**Why redo logs?**

*   Sequential writes to redo log are fast
*   Random writes to data files can happen later
*   On crash, replay redo log to recover committed transactions

**Configuration:**

**innodb\_flush\_log\_at\_trx\_commit options:**

Value

Behavior

Durability

Performance

1

Flush to disk on every commit

Full

Slowest

2

Flush to OS buffer on commit

OS crash = data loss

Medium

0

Flush every second

Up to 1s data loss

Fastest

### 3.3 Undo Log and MVCC

A common database problem: if one transaction is reading a row while another is modifying it, what should the reader see? Locking the row until the writer commits would work but kills concurrency. Letting the reader see uncommitted changes creates inconsistent reads.

InnoDB solves this with MVCC (Multi-Version Concurrency Control). When a transaction modifies a row, InnoDB keeps the old version in the undo log. Readers see the version that was committed when their transaction started, regardless of concurrent modifications. Writers see their own uncommitted changes. Neither blocks the other.

**How MVCC works:**

*   Readers do not block writers
*   Writers do not block readers
*   Each transaction sees a consistent snapshot
*   Old versions stored in undo log until no longer needed

### 3.4 Clustered Index

One of InnoDB's most important architectural decisions is the clustered index: the table data itself is stored as a B+tree, ordered by primary key. This is not just an index pointing to data stored elsewhere. The leaf nodes of the primary key index contain the actual row data.

**Implications:**

*   Primary key lookups are fastest (data is right there)
*   Range scans on primary key are efficient (data is contiguous)
*   Secondary indexes store primary key, not row pointer
*   Choose primary key wisely (impacts all queries)

**Primary key best practices:**

Approach

Pros

Cons

Auto-increment INT

Compact, sequential inserts

Hotspot on last page

UUID

No hotspot, globally unique

Large (16 bytes), random inserts

Ordered UUID

Unique, sequential

Still 16 bytes

Natural key

Meaningful

May change, often large

**In practice:** Primary key choice has performance implications that go beyond uniqueness. Auto-increment integers provide compact keys and sequential inserts, which minimize page splits and keep the clustered index efficient. UUIDs spread inserts randomly across the index, causing more page splits and fragmentation.

However, UUIDs may be necessary for distributed systems where generating sequential IDs requires coordination. Ordered UUIDs (like ULIDs) offer a middle ground: globally unique but roughly sequential.

# 4\. Indexing Strategies

The difference between a query taking 50 milliseconds and 5 seconds often comes down to indexing. A missing index forces MySQL to scan every row in a table. The right index lets MySQL jump directly to the relevant rows.

But indexes are not free. Each index slows down writes because MySQL must update both the table and every affected index. Each index consumes storage. The skill lies in creating indexes that support your query patterns without creating unnecessary overhead.

### 4.1 B+Tree Index Structure

MySQL uses B+Tree indexes for all standard indexes, both primary and secondary. Understanding this structure explains why some queries use indexes and others do not.

**Key properties:**

*   Leaf nodes contain all values and are linked
*   Range scans follow leaf node links
*   O(log N) lookups
*   Efficient for equality and range queries

### 4.2 Primary vs Secondary Indexes

Because InnoDB stores table data in the clustered primary key index, secondary indexes work differently than you might expect. A secondary index does not contain a pointer to the row's physical location. Instead, it contains the primary key value.

Looking up a row through a secondary index requires two steps: find the primary key in the secondary index, then find the row in the primary index.

This two-step lookup explains why covering indexes (discussed below) are valuable: they eliminate the second step by including all needed columns in the secondary index itself.

### 4.3 Composite Indexes

When queries filter on multiple columns, a composite index on those columns can be far more effective than separate indexes. But column order matters critically.

Think of a composite index like a phone book sorted by last name, then first name. You can find all Smiths. You can find all Smiths named John. But you cannot efficiently find all Johns regardless of last name, because the data is not organized that way.

**Leftmost prefix rule:**

*   Index on (A, B, C) can be used for queries on:
*   A
*   A, B
*   A, B, C
*   Cannot be used for queries filtering only on B or C

### 4.4 Covering Indexes

Include all columns needed by query to avoid table lookup.

**EXPLAIN shows "Using index" for covered queries:**

### 4.5 Index Hints and FORCE INDEX

When MySQL chooses wrong index, you can hint:

**Use sparingly.** Usually indicates a statistics problem or schema issue.

### 4.6 Full-Text Indexes

For text search within columns:

### 4.7 Index Selection Guidelines

Choosing the right index approach comes down to understanding your query patterns:

Query Pattern

Index Strategy

Equality (WHERE a = ?)

Index on (a)

Equality + Range (a = ? AND b > ?)

Index on (a, b)

Multiple equalities (a = ? AND b = ?)

Index on (a, b) or (b, a)

ORDER BY

Include sort columns in index

GROUP BY

Index on grouped columns

JOIN

Index on join columns

SELECT specific columns

Covering index

### 4.8 Indexing Anti-Patterns

Anti-Pattern

Problem

Solution

Too many indexes

Slow writes

Remove unused indexes

Indexes on low-cardinality

Not selective

Use for high-cardinality

Function on indexed column

Index not used

Rewrite query

Leading wildcard LIKE

Full scan

Full-text search

Over-indexing

Maintenance overhead

Index for actual queries

**In practice:** When discussing database design, tie your indexing strategy to specific query patterns. If the primary access pattern is "get all orders for a user, sorted by date," explain that you would create an index on (user\_id, created\_at). If the query also selects only order\_id and status, mention that including those columns creates a covering index that eliminates the table lookup entirely.

This level of specificity demonstrates that you understand indexing as targeted optimization, not a generic checkbox

# 5\. Transactions and Locking

Concurrency is where database systems get hard. As soon as multiple transactions touch the same rows at the same time, you risk lost updates, inconsistent reads, or overselling inventory. **Locks prevent these conflicts**, but locking too aggressively can destroy throughput and increase tail latency.

InnoDB sits in the middle: it offers strong correctness guarantees while still enabling high concurrency through **MVCC + fine-grained locks**. Understanding how InnoDB locks work is essential if you want to design systems that behave correctly under real-world contention.

### 5.1 Isolation Levels

Isolation levels define **what one transaction is allowed to observe** about another transaction’s work. Stronger isolation reduces anomalies but can increase locking and reduce concurrency.

#### Common anomalies

*   **Dirty read**: reading uncommitted changes from another transaction
*   **Non-repeatable read**: the same query returns different results within the same transaction
*   **Phantom read**: new rows appear that match a previously-run query

Level

Dirty Read

Non-Repeatable Read

Phantom Read

READ UNCOMMITTED

Yes

Yes

Yes

READ COMMITTED

No

Yes

Yes

REPEATABLE READ (default)

No

No

Yes\*

SERIALIZABLE

No

No

No

\* InnoDB’s REPEATABLE READ prevents most phantom reads by using **gap / next-key locks** on range queries.

### 5.2 InnoDB Locking Types

InnoDB doesn’t only lock “rows.” It can also lock **gaps between rows** to prevent conflicting inserts.

**Record Lock:** Locks a single index record.

**Gap Lock:** Locks the gap between index records. Prevents inserts in the range.

**Next-Key Lock:** A next-key lock combines both behaviors: it locks the matching records **and** the gaps around them. This is one of the mechanisms InnoDB uses to reduce phantom-like anomalies in REPEATABLE READ.

### 5.3 Locking Reads

MySQL gives you explicit control over whether reads should acquire locks.

These are foundational tools for building correct systems: inventory deduction, job processing, seat booking, wallet transfers, and more.

### 5.4 Deadlock Handling

A **deadlock** happens when two transactions each hold locks the other needs, so neither can progress.

InnoDB handles deadlocks well:

*   it detects deadlocks automatically
*   it chooses a “victim” transaction to roll back
*   it returns an error like: `ERROR 1213: Deadlock found when trying to get lock`

To inspect deadlocks:

**How to reduce deadlocks in practice:**

*   access tables/rows in a consistent order across transactions
*   keep transactions short (do less work between BEGIN and COMMIT)
*   use the lowest isolation level that still preserves correctness
*   add indexes so locks cover fewer rows (smaller lock footprint)

### 5.5 Optimistic vs Pessimistic Locking

There are two broad approaches to handling write conflicts.

**Pessimistic Locking:** Lock the row first, then update it.

**Optimistic Locking:** Allow concurrent reads, then detect conflicts at update time using a version column.

Approach

Best For

Trade-off

Pessimistic

High contention

Blocks other transactions

Optimistic

Low contention

Retry overhead on conflict

A good rule of thumb: if you expect many users to compete for the same rows at the same time, **lock early** (pessimistic). If conflicts are rare, **avoid locks** and handle the occasional retry (optimistic).

**In practice:** The choice between pessimistic and optimistic locking depends on conflict frequency. For inventory deduction in a flash sale where many users compete for limited stock, pessimistic locking (SELECT FOR UPDATE) prevents overselling by blocking concurrent access.

For user profile updates where conflicts are rare, optimistic locking reduces database blocking at the cost of occasional retry overhead when conflicts do occur. Both approaches are valid; the context determines which is better.

# 6\. Replication Architectures

A single MySQL server is both a performance bottleneck and a single point of failure. Replication addresses both: replicas can serve read queries, distributing the read load, and if the primary fails, a replica can be promoted to take over.

MySQL's replication has been refined over two decades. It is one of MySQL's strongest selling points, with operational tooling and community knowledge that newer databases cannot match. Understanding the various replication configurations, their trade-offs, and when to use each is essential for system design discussions.

### 6.1 Replication Basics

MySQL replication works by recording changes on the primary server to a binary log, then replaying those changes on replica servers. The process involves three threads: the primary's binary log writer, the replica's I/O thread that reads from the primary, and the replica's SQL thread that applies the changes.

#### **Replication process**

At a high level, the flow looks like this:

1.  **Source writes** data and appends the change to the **binlog**
2.  Each replica’s **I/O thread** streams binlog events from the source
3.  The replica writes those events into a local **relay log**
4.  The replica’s **SQL thread** reads the relay log and applies changes to its own data

### 6.2 Replication Formats

Binlog events can be recorded in different formats:

Format

Content

Pros

Cons

Statement

SQL statements

Compact

Non-deterministic issues

Row

Actual row changes

Deterministic

Larger logs

Mixed

Combination

Balance

Complexity

In most production setups, **row-based replication** is the default choice because it avoids subtle correctness issues with functions like `NOW()`, `RAND()`, triggers, and non-deterministic execution paths.

### 6.3 Asynchronous vs Semi-Synchronous

**Asynchronous (default):** The source **does not wait** for replicas. It commits locally, acknowledges the client, and replicas catch up later.

*   **Pros:** best write latency and throughput
*   **Cons:** possible data loss if the source fails before replicas receive the binlog events

**Semi-synchronous:** The source waits until at least one replica confirms it has **received** the transaction’s binlog event (not necessarily applied it) before acknowledging commit.

*   **Pros:** reduces likelihood of data loss on primary failure
*   **Cons:** adds network round-trip latency to writes and can reduce throughput

### 6.4 Replication Topologies

Replication isn’t just “primary + replicas.” The topology determines scaling limits, failure behavior, and operational complexity.

#### **Single Source, Multiple Replicas**

Most common. Simple, effective for read scaling.

#### **Chain Replication**

Reduces load on the primary by having replicas replicate from replicas.

*   **Pros:** lowers primary fanout load
*   **Cons:** higher lag and more fragile failure chains

#### **Multi-Source Replication**

One replica pulls from multiple sources.

Useful for aggregation and specialized workflows, but it raises conflict/ordering complexity.

#### **Circular Replication (Active-Active)**

Two primaries accept writes and replicate to each other.

This is usually avoided unless you have a robust conflict-resolution strategy, because write conflicts are inevitable.

### 6.5 Group Replication

MySQL Group Replication provides a higher-level replication system with built-in **membership**, **failover**, and **consensus-based ordering**. It can run in:

*   **single-primary** mode (one writer at a time)
*   **multi-primary** mode (multiple writers, conflict detection required)

**Key characteristics:**

*   automatic failover
*   built into MySQL 8.0+
*   consensus-based coordination (often described as Paxos-like in behavior)
*   certification-based conflict detection

**Trade-offs:**

*   higher write latency (consensus/coordination on commit path)
*   requires **3+ nodes** for quorum
*   more operational complexity than classic async replication

### 6.6 Replication Lag

Replication is rarely truly “instant.” Lag happens for predictable reasons:

*   large transactions (long apply time)
*   sustained write load (replicas can’t keep up)
*   slower disks/CPU on replicas
*   network latency or throttling

Monitor lag on replicas:

Common strategies to deal with lag:

*   **Read-your-writes:** route a user’s reads to the primary briefly after a write
*   **Causal consistency:** track binlog position and wait until a replica catches up
*   **Accept staleness:** many feeds, analytics, and dashboards tolerate small delays

**In practice:** Replication configuration depends on your requirements. For a typical web application prioritizing performance, asynchronous replication with row-based format provides good throughput with acceptable durability (you might lose the last few transactions on primary failure).

For systems where losing any committed transaction is unacceptable, semi-synchronous replication ensures at least one replica has received the data before acknowledging the commit. For automatic failover without human intervention, Group Replication provides consensus-based high availability at the cost of write latency.

# 7\. Sharding Strategies

Vertical scaling eventually hits a wall. You can only add so much CPU, RAM, and I/O to a single machine before the gains flatten out or the price becomes unreasonable. Replication helps you scale **reads**, but it does almost nothing for **writes**, because every write still funnels through the primary.

When a single primary becomes your bottleneck, **sharding** is the next step.

Sharding splits data across multiple database instances (shards). Each shard owns a subset of the data and handles a subset of the traffic. This distributes **storage and write throughput**, but it introduces operational and application complexity that you should not accept lightly.

### 7.1 Why Shard?

Sharding is typically justified when at least one of these becomes true:

*   your dataset no longer fits comfortably on a single server (storage + indexes + working set)
*   write throughput is beyond what one primary can sustain
*   read replicas still can’t keep up (or replication lag becomes unacceptable)
*   you need geographic distribution (data residency, latency, regional isolation)

### 7.2 Sharding Approaches

#### **Range-Based Sharding**

Split by contiguous key ranges

**Pros**

*   easy to understand and debug
*   efficient range queries _within_ a shard
*   adding a new shard is conceptually simple (new range)

**Cons**

*   uneven distribution is common (some ranges are hotter than others)
*   hotspots can form (e.g., “recent” IDs get most traffic)
*   rebalancing ranges is operationally painful

#### **Hash-Based Sharding**

Choose shard by hashing the key

**Pros**

*   typically even distribution
*   avoids “newest ID is hottest” hotspots
*   simple routing logic

**Cons**

*   range queries across shards become expensive
*   adding shards often requires reshuffling keys (unless you use consistent hashing / indirection)
*   cross-shard joins are painful

#### **Directory-Based Sharding**

Use a lookup service/table to map keys to shards

**Pros**

*   flexible mapping (you can move one user/tenant at a time)
*   easier rebalancing without rehashing everything
*   supports custom routing rules (VIP tenants, geo placement)

**Cons**

*   the lookup layer becomes critical infrastructure (needs HA + caching)
*   extra latency on cache misses
*   more moving parts and more failure modes

### 7.3 Choosing a Shard Key

The shard key determines almost everything: distribution, routing, and query shape. A bad shard key can make sharding worse than a single database.

**Good shard key properties:**

*   High cardinality (many distinct values)
*   Even distribution
*   Frequently used in queries
*   Rarely changes

**Common shard keys:**

Entity

Good Shard Key

Why

Users

user\_id

Even distribution, used in most queries

Orders

user\_id (not order\_id)

Keeps user's orders together

Messages

conversation\_id

Messages grouped by conversation

Multi-tenant

tenant\_id

Isolates tenant data

A practical heuristic: shard by the key that your application most naturally routes by (“who owns this data?”).

### 7.4 Cross-Shard Operations

Sharding is easy when queries are “single-key, single-shard.” It gets expensive when queries need data from many shards.

#### **Strategies:**

*   Design schema to minimize cross-shard queries
*   Denormalize data to avoid joins
*   Use global tables for small, read-heavy data
*   Accept eventual consistency for aggregations

### 7.5 Vitess for MySQL Sharding

**Vitess** is a popular open-source system for scaling MySQL horizontally. It sits between the application and MySQL and provides a sharding-aware database layer.

#### **Vitess provides:**

*   Automatic query routing
*   Connection pooling
*   Schema management
*   Resharding without downtime
*   Used by YouTube, Slack, Square

It’s widely used in large-scale production environments (notably built at YouTube and adopted by many others) because it reduces how much sharding logic leaks into application code.

### 7.6 When NOT to Shard

Sharding is powerful, but it’s a “you own the complexity forever” decision. Exhaust simpler levers first:

1.  **Optimize queries** - Add indexes, rewrite queries
2.  **Vertical scaling** - Bigger server, more RAM
3.  **Read replicas** - Scale reads without sharding
4.  **Caching** - Redis for hot data
5.  **Archive old data** - Move cold data to separate storage

Shard only when the single-primary architecture is the hard blocker and you’re confident the access patterns justify the added complexity.

**In practice:** Sharding should be a last resort, not a first instinct. Before proposing sharding, explain that you would first optimize queries and indexes, then add read replicas for read scaling, then implement caching for hot data. Only when these approaches are insufficient should you consider sharding.

If sharding becomes necessary, the shard key choice is critical: it should align with your primary access patterns so that most queries hit a single shard. Cross-shard queries and transactions are expensive and should be exceptional, not normal.

# 8\. Query Optimization

When a system slows down, it’s rarely “the database” in the abstract. It’s usually **a small number of expensive queries** doing disproportionate damage—scanning too many rows, missing the right index, sorting huge result sets, or triggering a bad join plan. One poorly indexed query can spike CPU, saturate I/O, and cascade into timeouts across the entire application.

### 8.1 EXPLAIN and EXPLAIN ANALYZE

You can’t optimize what you don’t understand. Start by inspecting how MySQL plans to execute your query.

*   **EXPLAIN** shows the plan: join order, chosen indexes, and estimated rows.
*   **EXPLAIN ANALYZE** (MySQL 8.0.18+) runs the query and reports **actual execution timing**, which is far more reliable than estimates when you’re debugging real slowdowns.

#### **Key EXPLAIN columns**

Column

Meaning

type

Join type (const, ref, range, index, ALL)

possible\_keys

Indexes that could be used

key

Index actually used

rows

Estimated rows to examine

filtered

Percentage of rows filtered by condition

Extra

Additional information

#### **Type values (best to worst)**

Type

Meaning

Performance

const

Single row by primary key

Excellent

eq\_ref

One row per join

Excellent

ref

Multiple rows by index

Good

range

Index range scan

Good

index

Full index scan

Medium

ALL

Full table scan

Poor

As a first pass: **avoid** `**ALL**` **on large tables**, and be wary when `rows` is huge.

### 8.2 Common Query Optimizations

#### **Use covering indexes**

If the query can be answered entirely from an index, MySQL avoids extra table lookups.

A good signal in `EXPLAIN` is `Extra: Using index` (meaning the index covers the query).

#### Avoid `SELECT *`

`SELECT *` increases I/O and prevents some optimizations, especially when rows are wide.

#### Make ORDER BY + LIMIT index-friendly

If MySQL can walk an index in the needed order, it can stop early instead of sorting a large dataset.

#### **Batch operations**

Reduce round trips and transaction overhead.

### 8.3 Query Patterns to Avoid

These patterns often block index usage or force expensive scans:

### 8.4 Pagination Optimization

Offset pagination looks simple, but it gets slower as offsets grow because MySQL still has to walk past skipped rows.

For stable ordering with ties (common in feeds), use a composite cursor:

### 8.5 Query Performance Monitoring

Optimization starts with visibility. The goal is to identify slow queries, quantify impact, and track regressions.

**In practice:** A methodical approach to query optimization starts with identifying which queries matter. The slow query log reveals queries exceeding a time threshold. Performance Schema provides aggregate statistics showing which query patterns consume the most total time.

For the top offenders, EXPLAIN reveals the execution plan: look for type = ALL (full table scan), missing index usage, and row estimates far exceeding actual needs. Then add or modify indexes, rewrite queries, or add caching as appropriate.

# 9\. MySQL vs Other Databases

Interviewers frequently ask why you chose MySQL over alternatives. The answer should not be "it is what I know" or "it is the most popular." Instead, demonstrate understanding of how different databases make different trade-offs, and why those trade-offs align with your specific requirements.

### 9.1 MySQL vs PostgreSQL

This is the most common comparison. Both are mature, open-source relational databases with strong ecosystems. The choice often depends on specific requirements and team expertise.

Aspect

MySQL

PostgreSQL

Replication

Mature, simpler

More options, complex

JSON support

JSON type

JSONB (better indexing)

Full-text search

Basic

More powerful

Window functions

Basic (8.0+)

Comprehensive

Extensions

Limited

Rich ecosystem

Learning curve

Easier

Steeper

Performance

Faster for simple queries

Better for complex queries

**Choose MySQL:** Simpler setup, read-heavy web applications, existing MySQL expertise.

**Choose PostgreSQL:** Complex queries, advanced SQL features, JSONB, geospatial.

### 9.2 MySQL vs MongoDB

Aspect

MySQL

MongoDB

Data model

Relational

Document

Schema

Fixed

Flexible

Transactions

Full ACID

ACID (since 4.0)

JOINs

Native

$lookup (limited)

Scaling

Manual sharding

Native sharding

Query language

SQL

MQL

**Choose MySQL:** Structured data, complex relationships, strong consistency.

**Choose MongoDB:** Flexible schema, document-oriented data, rapid iteration.

### 9.3 MySQL vs Cassandra

Aspect

MySQL

Cassandra

Model

Relational

Wide-column

Consistency

Strong

Tunable

Writes

Good

Excellent

Reads

Excellent

Good

Scaling

Manual

Native

Query flexibility

High

Low (query-first)

**Choose MySQL:** Complex queries, ACID transactions, moderate scale.

**Choose Cassandra:** Extreme write throughput, time-series, known access patterns.

### 9.4 MySQL vs TiDB

Aspect

MySQL

TiDB

Compatibility

Native

MySQL protocol

Scaling

Manual

Automatic horizontal

Consistency

Single node

Distributed ACID

Complexity

Lower

Higher

Operations

Mature

Newer

**Choose MySQL:** Data fits on one node, simpler operations.

**Choose TiDB:** Need horizontal scaling with MySQL compatibility.

# Summary

MySQL excels for read-heavy web applications where operational simplicity and reliability matter more than advanced SQL features. The depth of understanding you demonstrate about MySQL's architecture and trade-offs signals to interviewers that you can make sound database decisions under real-world constraints.

#### **Choose MySQL deliberately**

MySQL's sweet spot is read-heavy web applications with structured data: social networks, e-commerce catalogs, content management. Its mature replication makes read scaling straightforward, and its operational tooling reduces the 3 AM surprises. Acknowledge its limitations (write scaling requires sharding, advanced SQL features lag PostgreSQL) and explain how you would address them.

#### **Understand InnoDB internals**

The buffer pool determines read performance. The redo log enables durability without sacrificing speed. MVCC allows readers and writers to coexist. Clustered indexes mean primary key choice affects all queries. This understanding lets you explain why certain configurations matter and predict where bottlenecks will appear.

#### **Apply indexing strategically**

The leftmost prefix rule determines whether a composite index helps a query. Covering indexes eliminate the secondary-to-primary lookup. Understanding these mechanics lets you design indexes for specific query patterns rather than guessing.

#### **Choose locking approaches based on context**

Pessimistic locking (FOR UPDATE) prevents conflicts but reduces concurrency. Optimistic locking (version columns) allows concurrency but requires retry logic. Neither is universally better; the right choice depends on conflict frequency.

#### **Configure replication for your requirements**

Asynchronous replication provides performance at the cost of potential data loss. Semi-synchronous ensures durability at the cost of latency. Group Replication provides automatic failover at the cost of complexity. Match the configuration to the system's requirements.

#### **Exhaust simpler options before sharding**

Sharding adds complexity that is difficult to remove. Query optimization, read replicas, and caching solve many scaling problems without the operational burden of distributed data. When sharding becomes necessary, the shard key choice determines whether the system remains manageable.

When you propose MySQL in an interview, the strength of your answer lies not in claiming MySQL is always the best choice, but in articulating exactly why it fits this particular problem, what trade-offs you are accepting, and how you would operate it as the system grows.

# References

*   [MySQL Documentation](https://dev.mysql.com/doc/) - Official MySQL documentation covering all features
*   [High Performance MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781492080503/) - O'Reilly book on MySQL optimization and architecture
*   [MySQL Internals Manual](https://dev.mysql.com/doc/internals/en/) - Deep dive into MySQL internals
*   [Vitess Documentation](https://vitess.io/docs/) - Horizontal scaling for MySQL
*   [Percona Blog](https://www.percona.com/blog/) - Practical MySQL performance insights
*   [How Facebook Scaled MySQL](https://engineering.fb.com/2021/07/22/data-infrastructure/mysql/) - Real-world scaling case study

# Quiz

## MySQL Quiz

1 / 20

Multiple Choice

In a typical MySQL deployment with a proxy layer, what is a primary benefit of routing application connections through ProxySQL instead of connecting directly to MySQL?

PreviousNext

Launching soon
