---
title: "10 Must-Know Database Types for System Design Interviews"
description: "Choosing the right database is one of the most critical decisions you’ll make in a system design interview."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/database-types-for-system-design-interviews.md"
dateModified: "2025-05-27"
datePublished: "2025-05-27"
showOnArticles: true
topics:
  - system-design
---

**Choosing the right database**  is one of the most critical decisions you’ll make in a  **system design interview** .

The database you pick often dictates how well your system performs under load, how easily it scales, and how gracefully it handles complexity in real-world scenarios.

That’s why a strong understanding of different database types and  **when to use each**  is a key part of acing system design interviews.

In this article, we’ll walk through the  **10 must-know database types**  for system design interviews. For each one, we’ll explain:

- What it is
- When to use it (with examples)
- Key design considerations
- Popular databases you can mention in interviews

# 1. Relational

> A  **Relational Database**  stores data in structured tables with rows and columns. It’s like an Excel sheet, but much more powerful.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/7f28bea1-f1d4-4cc1-bf82-cbbd60acb3b7_2016x544.png)](https://substackcdn.com/image/fetch/$s_!ZRIw!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f28bea1-f1d4-4cc1-bf82-cbbd60acb3b7_2016x544.png)

Each table represents an entity (like Users, Orders, or Products), and relationships between tables are defined using  **foreign keys** . It uses  **SQL (Structured Query Language)**  to query and manipulate data.

## When to use it

#### Your data is structured and relational

Relational databases are ideal when your data consists of clearly defined entities with strong relationships.

**Example -** In an  **e-commerce platform** :

- Users places an Order
- Order can contain multiple Products
- Products have associated Reviews and belong to a Category

A relational schema with foreign keys makes it easy to model and enforce these relationships, and SQL allows efficient querying via joins.

#### You need strong consistency

Relational databases provide full [ACID](https://blog.algomaster.io/p/what-are-acid-transactions-in-databases) compliance, ensuring reliable transactions.

**Example -** In a digital payments system, transferring money between accounts requires atomic updates. If one step fails, the entire transaction rolls back, preserving data integrity.

This level of  **data integrity and transactional safety**  is what relational databases excel at.

#### You require complex queries and reporting

Relational databases provide  **SQL,** a powerful and expressive query language. SQL supports filtering, aggregation, grouping, and multi-table joins.

## Design Considerations

#### Indexing

Indexes speed up  **read-heavy queries**  by allowing the database to quickly locate rows.

Create indexes on frequently queried columns (e.g., user_id, email). Use composite indexes for multi-column filters. Avoid  **over-indexing**  in write-heavy systems, as it can slow down inserts and updates.

#### Normalization vs Denormalization

Normalize to reduce redundancy and ensure consistency. Denormalize in read-heavy systems to reduce join overhead.

#### Joins

Joins are powerful for analytics and reporting. However,  **avoid excessive joins**  on large tables as they can become performance bottlenecks. Never design for  **cross-shard joins**  unless absolutely necessary.

#### Sharding

Sharding enables  **horizontal scaling**  but introduces complexity.

Choose high-cardinality shard keys (e.g., user_id) to distribute load evenly. Be mindful that cross-shard queries and transactions are difficult to implement.

#### Scaling

- **Vertical scaling**  (adding more CPU/RAM to a single machine): Easy but limited.
- H **orizontal scaling** : Add read replicas, partition large tables, and use caching (e.g., Redis) for frequently accessed data

## Example databases

- **PostgreSQL**  – Open-source, feature-rich, ACID-compliant
- **MySQL**  – Widely used, especially in LAMP stack applications
- **Oracle DB**  – Enterprise-grade RDBMS

# 2. In-Memory

> An  **In-Memory Database**  stores data directly in RAM instead of disk. This makes it  **blazingly fast**  for read and write operations

[![image](https://substack-post-media.s3.amazonaws.com/public/images/7cacbdb2-c0bf-4ec1-a8cc-7d595eb8c281_966x344.png)](https://substackcdn.com/image/fetch/$s_!Bswk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7cacbdb2-c0bf-4ec1-a8cc-7d595eb8c281_966x344.png)

## When to use it

#### You need ultra-low latency

In-memory databases are ideal for applications that demand  **near-instantaneous responses** .

**Example:**  A real-time leaderboard in a gaming app where scores are updated and ranked instantly.

#### The data is temporary or can be regenerated

In-memory databases are great for storing data that can be recomputed if lost.

**Example** : Caching trending search results to reduce repeated computation and speed up queries.

#### You want to reduce load on your main database

In-memory stores can act as a  **high-speed caching layer**  to offload frequent reads from your primary database.

**Example** : Caching  **user profile data**  in a social media platform to avoid repeated lookups in the main DB.

## Design Considerations

#### Volatility

Since RAM is volatile, data is lost on crash or restart unless persistence is enabled.

Tools like  **Redis**  offer optional persistence via:

- **RDB (snapshotting)** : Saves data at intervals
- **AOF (Append Only File)** : Logs each write operation

#### Eviction Policies

RAM is fast, but limited. When memory runs out,  **older or less-used data**  is evicted. Common  **[eviction policies](https://blog.algomaster.io/p/7-cache-eviction-strategies)**  include  **LRU** ,  **LFU**  and  **TTL.**

#### Keep It Lean

Avoid storing large files or infrequently accessed data. Store  **only hot** and **frequently accessed data**  such as user sessions and recent activity.

#### Replication

Replication can improve  **read performance**  and provide  **failover support**  in case the primary instance goes down. Redis supports  **replica nodes**  and automatic failover using Sentinel or Cluster mode.

However, replication is typically  **asynchronous** , so there's a risk of data loss if the primary fails before sync. Always persist critical data in a durable system like a relational database.

## Example databases

- **Redis**  – Lightning fast, supports data structures like lists, sets, sorted sets, and pub-sub
- **Memcached**  – Simple key-value store for caching
- **Apache Ignite**  – Distributed in-memory store with SQL support
- **Hazelcast**  – Often used in Java-based enterprise applications

# 3. Key-Value

> A  **Key-Value Database**  is the simplest type of database. It stores data as a collection of  **key-value pairs** , where each key is unique and maps directly to a value. Think of it like a giant, distributed HashMap.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0a9cdf75-aeba-4081-b701-3ede60761860_834x572.png)](https://substackcdn.com/image/fetch/$s_!MmPG!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0a9cdf75-aeba-4081-b701-3ede60761860_834x572.png)

There are no tables, schemas, or relationships—just keys and values. This makes key-value stores extremely fast and highly scalable.

## When to use it

#### You need fast lookups by unique key

Key-value stores offer  **constant-time (O(1))**  reads and writes, making them ideal for quick access using a unique identifier.

**Examples:**

- Storing user sessions as userId → sessionInfo in a web application.
- Storing shortURL → fullURL mappings in a URL shortener service.

#### You don’t need complex queries or relationships

If your data doesn't require joins, filtering, or relational constraints, a key-value store is a simple and scalable choice.

#### You’re dealing with high-volume, low-latency workloads

Key-value stores are designed for  **massive throughput**  and are often used in systems that demand  **millions of reads/writes per second**  with minimal latency.

## Design Considerations

#### Lookup-only access

You can only retrieve values by key. They typically don’t provide filtering, sorting, or joining. Secondary indexes are typically  **not supported** .

#### No enforced schema

Key-value databases are  **schema-less** . Values can be strings, JSON, or binary blobs.

This gives you flexibility but also puts the burden on your application to handle serialization/deserialization and versioning of the data model.

#### Easy horizontal scaling

**Key-based partitioning**  enables seamless distribution across nodes using  **consistent hashing**  or  **range-based partitioning.**

To distribute keys evenly, choose  **high-cardinality keys**  (avoid country_code if most users are from one region)

## Example databases

- **Redis**  – Also acts as a key-value store with rich data types
- **Amazon DynamoDB**  – Managed, horizontally scalable key-value store
- **Riak KV**  – Distributed, fault-tolerant key-value system
- **Aerospike**  – High performance for low-latency read/write at scale

# 4. Document




Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
