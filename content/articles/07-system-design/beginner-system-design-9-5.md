---
title: "Document Databases"
description: "Document Databases - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Document Databases

In the previous chapter, we explored relational databases and their powerful guarantees around data integrity and transactions.

But that power comes with a cost: **rigidity**. Every row in a table must conform to the same schema. Every change to that schema requires a migration. And when your data is naturally hierarchical, you must flatten it into multiple tables and reassemble it with joins on every read.

Document databases emerged as a response to these constraints. Instead of storing data in rows and columns, they store it in documents, typically JSON or a binary equivalent like BSON.

Each document is a self-contained unit that can have a different structure from other documents in the same collection. There are no joins because related data is embedded directly within the document.

This flexibility fundamentally changes how applications are built.

# The Document Model

A document database stores data as documents. A document is a self-describing data structure, typically JSON, that can contain nested objects, arrays, and scalar values.

Unlike relational rows, which must all have the same columns, documents in the same collection can have completely different structures.

### Document Structure

Here is a typical document representing a blog post:

Several things to notice about this document:

*   **Nested objects.** The `author` and `stats` fields contain objects with their own properties.
*   **Arrays.** The `tags` field is an array of strings. The `comments` field is an array of objects.
*   **Self-contained.** Everything about this post, including its comments, is in one document. No joins required.
*   **Flexible structure.** Another post could have additional fields like `featured_image` or `series`, or lack fields like `comments`.

### Collections

Documents are grouped into collections, which are roughly analogous to tables in relational databases. However, there is a key difference: collections do not enforce a schema. You can store documents with completely different structures in the same collection.

Relational Concept

Document Concept

Database

Database

Table

Collection

Row

Document

Column

Field

Schema

Optional (schema validation available)

In practice, documents in a collection typically share a similar structure because they represent the same type of entity. But the flexibility to have variations is valuable during development and for handling edge cases.

### Document IDs

Every document has a unique identifier. In MongoDB, this is the `_id` field, which is automatically generated if not provided. The default ID is an ObjectId, a 12-byte value that encodes:

*   4 bytes: Unix timestamp
*   5 bytes: Random value (unique per machine/process)
*   3 bytes: Incrementing counter

This structure means ObjectIds are roughly chronologically sorted, which can be useful for range queries on creation time. However, you can also use any unique value as the ID: UUIDs, natural keys like email addresses, or application-generated identifiers.

# Embedding vs Referencing

The most important decision in document database design is choosing between embedding related data and referencing it. This is fundamentally different from relational databases, where you always normalize and join.

### Embedding

Embedding stores related data directly within the document:

### Advantages of embedding

*   **Single read**: All related data is retrieved in one database operation.
*   **Atomic writes**: Updates to the document are atomic, no transactions needed.
*   **Data locality**: Related data is stored together on disk, improving read performance.
*   **Simpler queries**: No joins or multiple queries to assemble the data.

### Disadvantages of embedding

*   **Data duplication**: If Alice places 100 orders, her name and address are stored 100 times.
*   **Update anomalies**: If Alice changes her email, you must update it in every order.
*   **Document size limits**: MongoDB limits documents to 16 MB. Large embedded arrays can hit this limit.
*   **Unbounded growth**: Arrays that grow without limit (like comments) can cause performance issues.

### Referencing

Referencing stores only the ID of related data:

To display this order, the application must make additional queries to fetch the customer and product details:

### Advantages of referencing

*   **No duplication**: Each piece of data is stored once.
*   **Easy updates**: Changing a customer's email is a single update.
*   **Smaller documents**: References are just IDs, keeping documents compact.
*   **Flexibility**: The same customer can be referenced from many contexts.

### Disadvantages of referencing

*   **Multiple queries**: Fetching related data requires additional database operations.
*   **No joins**: Unlike SQL, there is no single query that retrieves the order with customer and product details.
*   **Consistency**: If you delete a referenced document, you must handle the dangling reference.

### When to Embed vs Reference

Factor

Favor Embedding

Favor Referencing

Access pattern

Always accessed together

Accessed independently

Relationship

One-to-one or one-to-few

One-to-many or many-to-many

Update frequency

Rarely updated

Frequently updated

Data size

Small, bounded

Large or unbounded

Consistency needs

Can tolerate duplication

Must be authoritative

#### **Practical guidelines:**

*   Embed data that is always needed with the parent document
*   Embed data that has a one-to-one or one-to-few relationship
*   Reference data that is large, frequently updated, or accessed independently
*   Reference data when the array could grow without bound

# Query Capabilities

Document databases offer rich query capabilities, though they differ from SQL. Instead of declarative SQL, you typically use a query API or a query language specific to the database.

### Basic Queries

In MongoDB, queries use a JSON-like syntax:

### Projection

You can retrieve only specific fields:

### Array Queries

Document databases excel at querying within arrays:

### Aggregation Pipeline

For complex data transformations, MongoDB provides an aggregation pipeline:

The aggregation pipeline is surprisingly powerful, capable of joining collections (using $lookup), reshaping documents, performing statistical operations, and more.

### Query Limitations

Despite rich query capabilities, document databases have limitations compared to SQL:

Operation

SQL

Document DB

Join tables

Native, efficient

$lookup (less efficient)

Subquery

Native

Limited or requires application logic

Cross-collection transactions

Native

Supported but with overhead

Aggregations

Native

Aggregation pipeline

Window functions

Native

Limited support

The fundamental limitation is that document databases are optimized for operations within a single document. Cross-document operations are possible but less efficient.

# Indexing

Without indexes, every query would scan every document in a collection. Indexes make queries fast by creating sorted data structures that point to documents.

### Index Types

Document databases support various index types:

Index Type

Use Case

Example

**Single field**

Queries on one field

Index on `email`

**Compound**

Queries on multiple fields

Index on `{status, created_at}`

**Multikey**

Queries into arrays

Index on `tags` field

**Text**

Full-text search

Search within `content` field

**Geospatial**

Location-based queries

Find nearby restaurants

**Hashed**

Sharding distribution

Shard key index

### Creating Indexes

### Index Considerations

*   **Read vs write trade-off.** Indexes speed up reads but slow down writes because every insert and update must also update the indexes.
*   **Memory usage.** Indexes should fit in RAM for best performance. Large indexes that spill to disk significantly degrade performance.
*   **Compound index order.** The order of fields in a compound index matters. Put equality conditions first, then sort fields, then range conditions.
*   **Covered queries.** If an index contains all fields needed by a query, the database can return results without reading the actual documents.

# Schema Validation

While document databases are often called "schemaless," modern databases like MongoDB support optional schema validation. This gives you flexibility with guardrails.

Validation Setting

Behavior

`validationLevel: "strict"`

Validate all inserts and updates

`validationLevel: "moderate"`

Only validate inserts and updates to documents that already match

`validationAction: "error"`

Reject invalid documents

`validationAction: "warn"`

Allow invalid documents but log a warning

Schema validation provides a middle ground: flexibility for development and iteration, with constraints for production stability.

# Transactions

Historically, document databases only provided atomicity at the document level. Multi-document operations were not atomic, which was a significant limitation for certain use cases.

Modern document databases now support multi-document transactions:

However, there are important caveats:

Aspect

Single-Document

Multi-Document Transaction

Atomicity

Guaranteed

Guaranteed

Performance

Optimal

Overhead (locks, coordination)

Complexity

Simple

More complex error handling

Best practice

Prefer this

Use when necessary

The recommendation is to design your data model so that operations affecting related data can be performed on a single document. Use multi-document transactions when the data model cannot accommodate this or when you are migrating from a relational database.

# Scaling Document Databases

Document databases are designed for horizontal scaling from the ground up. Sharding distributes data across multiple servers.

### Sharding Architecture

#### **Components:**

*   **Shards:** Each shard holds a subset of the data. Shards are typically replica sets for high availability.
*   **Config servers:** Store metadata about which chunks of data are on which shards.
*   **Query routers (mongos):** Route queries to the appropriate shard(s) based on the shard key.

### Shard Key Selection

The shard key determines how data is distributed. This is the most important decision in sharding:

Shard Key Property

Good

Bad

Cardinality

High (many unique values)

Low (few values like status)

Frequency

Even distribution

Skewed (one value dominates)

Monotonicity

Random or hashed

Sequential (like timestamps)

Query pattern

Matches common queries

Doesn't match access patterns

**Good shard key examples:**

*   `user_id` for a multi-tenant application
*   Hashed `_id` for even distribution
*   Compound key `{tenant_id, created_at}` for time-series per tenant

**Bad shard key examples:**

*   `status` (low cardinality, uneven distribution)
*   `created_at` alone (monotonically increasing, all writes go to one shard)
*   Rarely-queried field (every query becomes a scatter-gather)

### Targeted vs Scatter-Gather Queries

When the query includes the shard key, the router can send the query directly to the relevant shard (targeted query). When it does not, the router must query all shards and merge results (scatter-gather).

Targeted queries are efficient. Scatter-gather queries are expensive, especially as the cluster grows. Design your shard key and queries to maximize targeted operations.

# Popular Document Databases

### MongoDB

MongoDB is the most widely used document database. It has become nearly synonymous with the document model.

#### Key Features:

*   **Market leader:** Used by companies from startups to enterprises
*   **Rich features:** Aggregation pipeline, full-text search, geospatial queries, transactions
*   **Flexible deployment:** Self-hosted or Atlas (managed cloud service)
*   **Strong ecosystem:** Drivers for every major language, extensive tooling

### Amazon DocumentDB

AWS's managed document database service with MongoDB API compatibility.

#### Key Features:

*   **Fully managed:** No operational overhead
*   **AWS integration:** VPC, IAM, CloudWatch integration
*   **Compatibility:** Supports MongoDB 3.6-5.0 API (with some limitations)
*   **Scaling:** Automatic storage scaling, read replicas

### Firestore

Google's serverless document database, part of Firebase.

#### Key Features:

*   **Real-time sync:** Built-in listeners for real-time updates
*   **Offline support:** Automatic offline caching and sync
*   **Mobile-first:** Designed for mobile and web applications
*   **Serverless:** No server management, automatic scaling

### CouchDB

Apache's document database with unique features.

#### Key Features:

*   **HTTP API:** Pure REST interface, can be accessed directly from browsers
*   **Multi-master replication:** Bidirectional sync between nodes
*   **Offline-first:** Designed for occasionally connected applications
*   **Conflict resolution:** Built-in handling for concurrent edits

### Comparison

Feature

MongoDB

DocumentDB

Firestore

CouchDB

Hosting

Self/Cloud

AWS only

GCP only

Self-hosted

Real-time

Change streams

\-

Native

\-

Offline sync

\-

\-

Native

Native

Transactions

Multi-doc

Multi-doc

Multi-doc

Single-doc

Aggregation

Powerful

Compatible

Limited

MapReduce

# When to Choose Document Databases

Document databases are the right choice when:

*   **Data is naturally hierarchical.** Products with nested specifications, blog posts with embedded comments, user profiles with varied attributes.
*   **Schema evolves frequently.** During rapid development, the ability to add fields without migrations accelerates iteration.
*   **Developer velocity matters.** Storing data in the same shape as your application objects reduces impedance mismatch.
*   **Read patterns favor denormalization.** If you always need related data together, embedding it is more efficient than joining.
*   **Horizontal scaling is required.** Document databases are designed for sharding from day one.

### When to Consider Alternatives

Document databases may not be the best fit when:

*   **Strong ACID transactions are critical.** While modern document databases support transactions, they add overhead. Relational databases are still superior for transaction-heavy workloads.
*   **Complex relationships dominate.** Many-to-many relationships and multi-hop traversals are awkward in document databases. Consider graph databases.
*   **Data must be queried across collections.** If you frequently need to join data from multiple collections, you are fighting the document model.
*   **Strict data integrity is required.** Schema enforcement in document databases is optional. Relational databases enforce it by default.

# Summary

Document databases offer a fundamentally different approach to data storage compared to relational databases:

Aspect

Document DB Approach

**Data model**

JSON-like documents with nested objects and arrays

**Schema**

Flexible by default, optional validation available

**Relationships**

Embedding (denormalization) or referencing (application-level joins)

**Transactions**

Single-document atomic, multi-document with overhead

**Scaling**

Designed for horizontal scaling via sharding

**Query language**

Database-specific API or query language, not SQL

#### Key design decisions:

*   **Embed** data that is always accessed together, has bounded size, and updates infrequently
*   **Reference** data that is large, unbounded, or frequently updated independently
*   **Index** fields used in queries, especially the shard key
*   **Shard key** selection is critical: choose high cardinality, even distribution, and match query patterns

The next chapter explores key-value stores, which take simplicity to the extreme. Where document databases offer flexible structure, key-value stores offer almost no structure at all, trading it for raw speed and simplicity.

Launching soon
