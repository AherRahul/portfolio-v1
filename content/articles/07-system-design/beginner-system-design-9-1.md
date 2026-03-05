---
title: "Database Types"
description: "Database Types - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Database Types

Every application needs to store data somewhere. But not all data is the same, and not all storage needs are equal. A social media app storing billions of posts has very different requirements from a banking system tracking account balances.

This diversity in data and access patterns has led to a rich ecosystem of database types, each optimized for specific use cases. Understanding these types is not just academic. The database you choose fundamentally shapes your application's architecture, performance characteristics, and operational complexity.

In this chapter, you will learn:

*   The major categories of databases and what makes each unique
*   Key characteristics and trade-offs of different database types
*   How to match database types to specific use cases
*   Real-world examples of where each type excels
*   How to think about database selection in system design interviews

This chapter provides the landscape. The following chapters will dive deeper into specific comparisons and concepts like ACID transactions and data modeling that cut across database types.

# Why Different Database Types Exist

In the early days of computing, relational databases dominated. Oracle, MySQL, PostgreSQL, SQL Server. They handled everything from inventory systems to websites. For many use cases, they still do.

But as the internet scaled, new problems emerged that relational databases struggled with:

*   **Massive scale:** Social networks with billions of users could not fit on a single machine
*   **Flexible schemas:** Agile development needed databases that did not require schema migrations for every change
*   **Specialized access patterns:** Full-text search, graph traversals, and time-series analytics needed specialized data structures
*   **Geographic distribution:** Global applications needed data replicated across continents with low latency

These pressures birthed the NoSQL movement and a proliferation of specialized databases. Today, the question is not "which database" but "which databases" since many systems use multiple types together.

Interview Insight

When asked about database selection, do not jump to a specific technology. First, understand the data model, access patterns, scale requirements, and consistency needs. The right database type emerges from these requirements.

# The Database Landscape

Let us explore each category in detail.

# Relational Databases (RDBMS)

Relational databases store data in tables with rows and columns. They use SQL (Structured Query Language) for queries and enforce schemas that define the structure of data. Relationships between tables are expressed through foreign keys.

### Key Characteristics

Characteristic

Description

**Data Model**

Tables with rows and columns, strict schema

**Query Language**

SQL with powerful joins, aggregations, subqueries

**Consistency**

Strong consistency with ACID transactions

**Schema**

Schema-on-write (enforced at insert time)

**Scaling**

Primarily vertical, horizontal via read replicas or sharding

### How Data is Organized

### Strengths

*   **ACID guarantees:** Transactions ensure data integrity, critical for financial systems
*   **Complex queries:** Joins across tables enable sophisticated analytics
*   **Mature ecosystem:** Decades of tooling, optimization, and operational knowledge
*   **Strong consistency:** Reads always return the latest committed data

### Weaknesses

*   **Scaling limitations:** Sharding relational databases is complex and often sacrifices some SQL features
*   **Schema rigidity:** Schema changes can be painful and require migrations
*   **Not ideal for:** Hierarchical data, sparse data, or highly variable schemas

### Popular Relational Databases

Scroll

Database

Best For

Notable Users

**PostgreSQL**

Complex queries, extensibility, JSON support

Apple, Instagram, Spotify

**MySQL**

Web applications, read-heavy workloads

Facebook, Twitter, Netflix

**SQL Server**

Enterprise Windows environments

Stack Overflow, many Fortune 500

**Oracle**

Large enterprises, complex transactions

Banks, governments, airlines

### When to Choose Relational

*   Your data has clear relationships and benefits from joins
*   You need ACID transactions (financial systems, inventory)
*   Your schema is relatively stable
*   You need complex queries with aggregations and subqueries
*   Your scale fits on one server or a few replicas

# Key-Value Stores

Key-value stores are the simplest database type. They store data as a collection of key-value pairs, like a giant hash map. You look up values by their key, and that is basically it.

### Key Characteristics

Characteristic

Description

**Data Model**

Key-value pairs, value can be anything (string, JSON, binary)

**Query Language**

Simple GET, PUT, DELETE operations by key

**Consistency**

Varies (Redis: strong on single node, DynamoDB: configurable)

**Schema**

Schema-less, value is opaque to the database

**Scaling**

Excellent horizontal scaling through partitioning

### How Data is Organized

### Strengths

*   **Blazing fast:** O(1) lookups, often sub-millisecond latency
*   **Simple operations:** Easy to understand and use
*   **Horizontal scaling:** Partition by key for near-linear scalability
*   **Flexible values:** Store whatever you need in the value

### Weaknesses

*   **Limited queries:** Cannot query by value, only by exact key
*   **No relationships:** No joins or references between entries
*   **No complex operations:** Aggregations require reading all data

### Popular Key-Value Stores

Scroll

Database

Best For

Notable Features

**Redis**

Caching, sessions, real-time leaderboards

In-memory, rich data types, pub/sub

**Amazon DynamoDB**

Serverless, auto-scaling workloads

Fully managed, consistent performance

**Memcached**

Simple caching

Distributed memory caching

**etcd**

Configuration, service discovery

Strong consistency, used by Kubernetes

### When to Choose Key-Value

*   Caching frequently accessed data
*   Session storage
*   User preferences and settings
*   Shopping carts
*   Real-time leaderboards and counters
*   Any use case where you always know the key

Interview Insight

Key-value stores are often the first line of defense before hitting a database. When discussing system design, consider adding a caching layer with Redis or Memcached to reduce load on your primary database.

# Document Databases

Document databases store data as semi-structured documents, typically JSON or BSON. Each document is self-contained and can have a different structure from other documents in the same collection.

### Key Characteristics

Characteristic

Description

**Data Model**

JSON-like documents with nested structures

**Query Language**

Rich query language on document fields

**Consistency**

Configurable, often eventual consistency for distributed setups

**Schema**

Schema-flexible (schema-on-read)

**Scaling**

Horizontal scaling via sharding

### How Data is Organized

Notice how each document can have different fields. The laptop has `cpu` and `ram`, while the phone has `screen` and `colors`. This flexibility is a core strength of document databases.

### Strengths

*   **Flexible schema:** Add fields without migrations, great for evolving data models
*   **Natural mapping:** Documents map directly to objects in most programming languages
*   **Nested data:** Embed related data in a single document, avoiding joins
*   **Developer productivity:** Less impedance mismatch between code and database

### Weaknesses

*   **No joins:** Cross-document queries require multiple round trips or denormalization
*   **Potential data duplication:** Embedding data leads to redundancy
*   **Schema management:** Flexibility can become chaos without discipline

### Popular Document Databases

Scroll

Database

Best For

Notable Features

**MongoDB**

General purpose, flexible schemas

Aggregation pipeline, change streams

**CouchDB**

Offline-first apps, sync

Multi-master replication

**Amazon DocumentDB**

MongoDB-compatible, AWS managed

MongoDB API compatibility

**Firestore**

Mobile and web apps

Real-time sync, offline support

### When to Choose Document

*   Your data is naturally hierarchical or nested
*   Schema evolves frequently
*   You want to avoid complex joins by embedding related data
*   Building content management systems, catalogs, or user profiles
*   Rapid prototyping where schema is not finalized

# Wide-Column Stores

Wide-column stores organize data by columns rather than rows. They excel at handling massive amounts of data across many servers with high write throughput.

### Key Characteristics

Characteristic

Description

**Data Model**

Rows with dynamic columns, column families

**Query Language**

CQL (Cassandra), HBase API

**Consistency**

Tunable consistency (eventual to strong)

**Schema**

Flexible columns within column families

**Scaling**

Exceptional horizontal scaling, designed for it

### How Data is Organized

Notice that `user_1` has `email`, `last_login`, and `pref_theme`, while `user_2` only has `name` and `phone`. Each row can have different columns.

### Strengths

*   **Massive scale:** Built for petabytes of data across thousands of nodes
*   **High write throughput:** Append-only writes, no read-before-write
*   **Flexible columns:** Rows can have different columns without schema changes
*   **Geographic distribution:** Multi-datacenter replication built-in

### Weaknesses

*   **Limited query flexibility:** Queries must follow primary key patterns
*   **No joins:** Data must be denormalized
*   **Operational complexity:** Running at scale requires expertise
*   **Eventual consistency:** Reads may return stale data

### Popular Wide-Column Stores

Scroll

Database

Best For

Notable Features

**Apache Cassandra**

High availability, write-heavy

Peer-to-peer, no single point of failure

**Apache HBase**

Hadoop integration, analytics

Strong consistency, HDFS backend

**ScyllaDB**

Cassandra-compatible, lower latency

C++ implementation, better performance

**Google Bigtable**

Google-scale workloads

Managed service, inspiration for HBase

### When to Choose Wide-Column

*   Massive scale (billions of rows, petabytes of data)
*   High write throughput requirements
*   Time-series data, event logging, audit trails
*   Multi-datacenter deployments with tunable consistency
*   IoT data ingestion at scale

Interview Insight

Wide-column stores like Cassandra are often mentioned for time-series data and messaging systems. If the interviewer mentions "millions of writes per second" or "multi-region availability," consider wide-column stores.

# Graph Databases

Graph databases model data as nodes (entities) and edges (relationships). They are optimized for traversing connections, making them ideal for social networks, recommendation engines, and fraud detection.

### Key Characteristics

Characteristic

Description

**Data Model**

Nodes and edges with properties

**Query Language**

Graph query languages (Cypher, Gremlin, SPARQL)

**Consistency**

Typically ACID within a single graph

**Schema**

Flexible, define node and edge types

**Scaling**

Challenging, graph partitioning is hard

### How Data is Organized

Queries naturally express traversals: "Find all friends of Alice who know Python and work at the same company."

### Strengths

*   **Relationship-centric:** Relationships are first-class citizens, not foreign keys
*   **Fast traversals:** Multi-hop queries are efficient, unlike SQL joins
*   **Intuitive modeling:** Matches how we think about connected data
*   **Pattern matching:** Find complex patterns in connected data

### Weaknesses

*   **Not for everything:** Simple CRUD without relationships does not benefit
*   **Scaling challenges:** Graph partitioning is an open research problem
*   **Learning curve:** Graph query languages are different from SQL

### Popular Graph Databases

Scroll

Database

Best For

Notable Features

**Neo4j**

General graph use cases

Cypher query language, mature ecosystem

**Amazon Neptune**

AWS managed graphs

SPARQL and Gremlin support

**TigerGraph**

Large-scale analytics

Parallel graph processing

**ArangoDB**

Multi-model (graph + document)

Flexible data model

### When to Choose Graph

*   Social networks (friends, followers, connections)
*   Recommendation engines (users who liked X also liked Y)
*   Fraud detection (find suspicious transaction patterns)
*   Knowledge graphs and semantic search
*   Network and IT operations (dependencies, impact analysis)
*   Supply chain and logistics optimization

# Specialized Databases

Beyond the main categories, specialized databases optimize for specific data types and access patterns.

### Time-Series Databases

Optimized for timestamped data points, common in monitoring, IoT, and financial applications.

Database

Best For

**InfluxDB**

Monitoring, metrics, IoT

**TimescaleDB**

PostgreSQL-compatible time-series

**Prometheus**

Kubernetes metrics, alerting

**QuestDB**

High-performance financial data

**Use when:** You are storing metrics, sensor data, stock prices, or any time-ordered data that needs time-based aggregations.

### Search Engines

Optimized for full-text search, relevance ranking, and faceted navigation.

**Use when:** Users need to search through text, you need faceted search (filter by category, price range), or you need log aggregation and analysis.

### Vector Databases

Store and search high-dimensional vectors, essential for AI applications like semantic search and recommendations.

Database

Best For

**Pinecone**

Managed vector search, serverless

**Milvus**

Open-source, large-scale

**Weaviate**

Semantic search with modules

**Qdrant**

High-performance, filtering

**Use when:** Building semantic search, recommendation systems, image similarity, or RAG (Retrieval-Augmented Generation) applications.

# Choosing the Right Database

### Decision Framework

### Quick Reference Table

Scroll

Database Type

Best For

Not Ideal For

**Relational**

ACID transactions, complex queries, structured data

Massive scale, schema flexibility

**Key-Value**

Caching, sessions, simple lookups

Complex queries, relationships

**Document**

Flexible schemas, nested data, rapid development

Heavy joins, strict consistency

**Wide-Column**

Massive scale, high writes, time-series

Complex queries, strong consistency

**Graph**

Relationship traversals, social networks

Simple CRUD, massive scale

**Time-Series**

Metrics, IoT, monitoring

General-purpose storage

**Search**

Full-text search, log analysis

Primary data storage

**Vector**

Semantic search, AI embeddings

Traditional queries

### Polyglot Persistence

Modern systems often use multiple database types, each for what it does best:

This approach is called **polyglot persistence**. It adds complexity but lets you use the right tool for each job.

# Summary

The database landscape has evolved from relational-database-for-everything to a rich ecosystem of specialized tools:

*   **Relational databases** remain the workhorse for structured data with complex queries and ACID requirements
*   **Key-value stores** provide blazing-fast lookups for caching and simple data
*   **Document databases** offer schema flexibility for evolving applications
*   **Wide-column stores** handle massive scale and high write throughput
*   **Graph databases** excel at relationship-heavy data and traversals
*   **Specialized databases** optimize for specific patterns like time-series, search, and vectors

The key insight is that database selection is not about finding the "best" database. It is about matching the database characteristics to your specific requirements. Often, the answer is multiple databases working together.

Launching soon
