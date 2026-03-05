---
title: "Relational Databases"
description: "Relational Databases - System Design Module 9"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Relational Databases

If you have ever logged into a website, placed an order online, or checked your bank balance, you have interacted with a relational database.

These systems have been the backbone of data storage for over four decades, and despite the rise of newer database types, they remain the default choice for most applications.

**What makes relational databases so enduring?**

It comes down to a set of guarantees that no other database type matches as comprehensively.

Your bank cannot afford to lose a transaction. An e-commerce site cannot sell the same inventory item twice. An airline cannot overbook a seat and discover it only when passengers board. Relational databases were designed from the ground up to prevent exactly these kinds of problems.

But relational databases are not just about safety. They are also about expressiveness. The query language they use, SQL, lets you ask complex questions about your data without worrying about how to compute the answer.

# The Relational Model

In 1970, Edgar F. Codd, a researcher at IBM, published a paper that would change computing forever. He proposed organizing data into "relations," which we now call tables. Each table has rows (records) and columns (attributes), and relationships between tables are expressed through shared values rather than physical pointers.

This might seem obvious today, but it was revolutionary. Before Codd, databases stored data in hierarchical or network structures where you had to know the physical layout to retrieve anything.

Codd's insight was that you could separate the logical structure of data from its physical storage, allowing the database system to optimize storage and retrieval independently.

### Tables, Rows, and Columns

A relational database organizes data into tables. Each table represents a type of entity: users, orders, products, payments.

Each row in a table represents one instance of that entity. Each column represents an attribute of that entity.

##### **Users Table**

Scroll

id

name

email

created\_at

1

Alice Chen

alice@example.com

2024-01-15

2

Bob Smith

bob@example.com

2024-02-20

3

Carol Wu

carol@example.com

2024-03-10

Several important properties emerge from this structure:

*   **Column types are fixed.** The `id` column always contains integers, `email` always contains strings. The database enforces this, rejecting inserts that violate the schema.
*   **Each row is independent.** You can retrieve, update, or delete any row without affecting others.
*   **Column order does not matter.** You reference columns by name, not position.
*   **Row order is undefined.** Unless you explicitly specify an ORDER BY, the database makes no guarantees about the sequence of returned rows.

### Primary Keys

Every table needs a way to uniquely identify each row. This is the primary key. In the Users table above, the `id` column serves this purpose. No two rows can have the same primary key value, and the value cannot be NULL.

Primary keys can be:

Scroll

Type

Example

Pros

Cons

**Auto-increment integer**

1, 2, 3, ...

Simple, compact, fast

Predictable, doesn't work across distributed systems

**UUID**

550e8400-e29b-41d4-a716-446655440000

Globally unique, works distributed

Large (128 bits), random access patterns

**Natural key**

email, SSN

Meaningful, no extra column

Can change, may have privacy concerns

**Composite key**

(user\_id, product\_id)

Models many-to-many naturally

More complex joins and indexes

Most modern applications use auto-incrementing integers for simplicity or UUIDs when distributed generation is needed.

### Foreign Keys and Relationships

The power of relational databases comes from connecting tables through relationships. A foreign key is a column (or set of columns) in one table that references the primary key of another table.

### Users Table

id

name

email

1

Alice

[alice@example.com](mailto:alice@example.com)

2

Bob

[bob@example.com](mailto:bob@example.com)

### Orders Table

id

user\_id

total

status

101

1

$150.00

shipped

102

1

$75.50

pending

103

2

$200.00

delivered

### Foreign Key Relationship

*   `orders.user_id` → `users.id`

The `user_id` column in the Orders table is a foreign key referencing the `id` column in the Users table. This establishes a one-to-many relationship: one user can have many orders.

Foreign keys provide two critical benefits:

1.  **Referential integrity.** The database prevents you from creating an order for a user that does not exist. If you try to insert an order with `user_id = 999` and no such user exists, the database rejects the operation.
2.  **Cascade behaviors.** You can configure what happens when a referenced row is deleted. Should the orders be deleted too (CASCADE)? Should the delete be blocked (RESTRICT)? Should the foreign key be set to NULL (SET NULL)?

### Types of Relationships

Relationships between tables come in three flavors:

**One-to-One:** Each row in Table A relates to at most one row in Table B, and vice versa. Example: Users and UserProfiles, where profile details are stored separately.

**One-to-Many:** Each row in Table A can relate to many rows in Table B, but each row in Table B relates to only one row in Table A. Example: Users and Orders.

**Many-to-Many:** Rows in Table A can relate to multiple rows in Table B, and vice versa. This requires a junction table (also called a join table or bridge table).

The Enrollments table has no data of its own other than the two foreign keys. Its sole purpose is to represent which students are enrolled in which courses.

# Schema and Data Integrity

One of the defining characteristics of relational databases is the schema: a formal definition of the structure of your data. Before you can store any data, you must declare what tables exist, what columns they have, and what types those columns accept.

### Schema Definition

A schema is created using Data Definition Language (DDL):

This schema enforces several constraints automatically:

Constraint

Purpose

Violation Result

`NOT NULL`

Column must have a value

Insert/update rejected

`UNIQUE`

No duplicate values in column

Insert/update rejected

`PRIMARY KEY`

Unique identifier for row

Insert rejected

`REFERENCES` (FK)

Value must exist in referenced table

Insert/update rejected

`CHECK`

Custom validation rule

Insert/update rejected

`DEFAULT`

Value used when not specified

Default applied

### Schema-on-Write vs Schema-on-Read

Relational databases use **schema-on-write**: data is validated against the schema when it is written. If the data does not conform, the write fails.

This is different from many NoSQL databases that use **schema-on-read**, where any data can be written and structure is interpreted when reading.

Scroll

Approach

Validation Time

Pros

Cons

**Schema-on-write**

At insert/update

Data quality guaranteed, queries predictable

Migrations required for changes, less flexible

**Schema-on-read**

At query time

Flexible, no migrations

Bad data can accumulate, queries must handle variations

The schema-on-write approach means that every row in a relational database conforms to the declared structure. You never have to wonder "does this row have an email field?" because the schema guarantees it.

### Normalization

Normalization is the process of organizing data to minimize redundancy. The goal is to ensure that each piece of information is stored in exactly one place.

Consider a denormalized orders table:

Scroll

order\_id

customer\_name

customer\_email

product\_name

product\_price

1

Alice Chen

alice@ex.com

Widget

$25.00

2

Alice Chen

alice@ex.com

Gadget

$50.00

3

Bob Smith

bob@ex.com

Widget

$25.00

Orders (denormalized)

Problems with this structure:

*   **Update anomaly:** If Alice changes her email, you must update multiple rows.
*   **Delete anomaly:** If you delete order 3, you lose the only record that Bob exists.
*   **Insert anomaly:** You cannot add a new customer until they place an order.

The normalized version separates customers, products, and orders into their own tables:

Now each piece of information lives in one place. Updating Alice's email is a single-row update. You can add customers without orders. You can delete orders without losing customer information.

Normalization has levels (1NF, 2NF, 3NF, BCNF, etc.), but for practical purposes, most applications aim for Third Normal Form (3NF), which eliminates most redundancy without overcomplicating the schema.

# ACID Transactions

Transactions are the mechanism by which relational databases guarantee data consistency even in the face of failures.

ACID is an acronym for the four properties that transactions provide:

### Atomicity

A transaction is all-or-nothing. Either all operations in the transaction complete successfully, or none of them do. There is no partial state.

Consider a bank transfer:

If the second UPDATE fails (maybe account 2 does not exist), the first UPDATE is rolled back. The $100 is never "lost" between accounts. Atomicity guarantees that you will never see a state where account 1 is debited but account 2 is not credited.

### Consistency

Transactions move the database from one valid state to another. All constraints (foreign keys, unique constraints, check constraints) are enforced. If any operation would violate a constraint, the entire transaction is rolled back.

### Isolation

Concurrent transactions do not interfere with each other. Each transaction sees the database as if it were the only one running. This prevents problems like:

*   **Dirty reads:** Reading data that another transaction has modified but not yet committed
*   **Non-repeatable reads:** Getting different values when reading the same row twice in a transaction
*   **Phantom reads:** Getting different rows when running the same query twice in a transaction

Databases offer different isolation levels that trade off between correctness and performance:

Isolation Level

Dirty Reads

Non-Repeatable Reads

Phantom Reads

Performance

Read Uncommitted

Possible

Possible

Possible

Fastest

Read Committed

Prevented

Possible

Possible

Fast

Repeatable Read

Prevented

Prevented

Possible

Moderate

Serializable

Prevented

Prevented

Prevented

Slowest

Most databases default to Read Committed, which prevents the most egregious problems while maintaining good performance.

### Durability

Once a transaction is committed, it stays committed. Even if the server crashes immediately after, the data will be there when the system restarts.

Databases achieve this through write-ahead logging (WAL), where changes are written to a durable log before being applied to the main data files.

The key insight is that the WAL write happens before acknowledging the transaction. If the system crashes after ACK but before applying to data files, the WAL is replayed on recovery to complete the operation.

# SQL: The Query Language

SQL (Structured Query Language) is the standard language for interacting with relational databases. What makes SQL powerful is that it is declarative: you describe what data you want, not how to get it.

### Declarative vs Imperative

Consider finding all orders over $100 for users in California:

**Imperative (pseudocode):**

**Declarative (SQL):**

The SQL version describes the result set without specifying how to compute it. The database's query optimizer decides whether to:

*   Scan the users table first and filter by state, then find matching orders
*   Scan the orders table first and filter by total, then validate the user's state
*   Use indexes on any of these columns
*   Use hash joins, merge joins, or nested loop joins

This separation of "what" from "how" is powerful because the optimizer can make different decisions based on table sizes, available indexes, and data distribution.

### Common Query Patterns

**Aggregations** compute values across multiple rows:

**Joins** combine data from multiple tables:

**Subqueries** embed one query inside another:

**Window functions** compute values across related rows without collapsing them:

### The Query Optimizer

Behind every SQL query is a query optimizer that determines the execution plan. You can examine this plan using EXPLAIN:

A good execution plan uses indexes efficiently and avoids full table scans. Understanding how to read execution plans and create appropriate indexes is a key skill for database performance.

# Scaling Relational Databases

Relational databases were designed in an era when all data fit on a single machine. As applications grew, scaling became a challenge. There are several strategies, each with trade-offs.

### Vertical Scaling

The simplest approach: buy a bigger server. More CPU, more RAM, faster disks.

Metric

Small Server

Large Server

Limit

CPU Cores

4

128

~256

RAM

16 GB

4 TB

~12 TB

Storage IOPS

3,000

400,000

~1M

Cost/month

$200

$50,000

$

Vertical scaling is attractive because it requires no application changes. Your queries work exactly the same. But there are limits: eventually, you hit the ceiling of what a single machine can do, and costs grow non-linearly.

### Read Replicas

For read-heavy workloads, you can replicate data to multiple servers. Writes go to the primary, and reads can be served by any replica.

**Considerations:**

*   **Replication lag:** Replicas are slightly behind the primary. Your application must handle eventual consistency for reads.
*   **Failover complexity:** If the primary fails, you need to promote a replica. This can take seconds to minutes.
*   **Write scalability:** You have not solved the write bottleneck. All writes still go to one server.

Read replicas work well for applications with high read-to-write ratios (90%+ reads). A typical e-commerce site fits this pattern: many people browse products, few actually buy.

### Sharding

Sharding splits data across multiple database servers, each holding a subset. Unlike read replicas where each server has all the data, shards have different data.

Sharding provides true horizontal scale for both reads and writes. But it comes with significant costs:

Challenge

Description

**Cross-shard queries**

Joining data across shards requires querying multiple servers and combining results in the application

**Cross-shard transactions**

ACID transactions spanning shards require distributed transaction protocols (2PC)

**Rebalancing**

Moving data when shards become uneven is complex and risky

**Application complexity**

The application must know about sharding logic

**Feature limitations**

Some SQL features (aggregations, foreign keys) become difficult or impossible across shards

The sharding key choice is critical. A good sharding key:

*   Distributes data evenly across shards
*   Keeps related data together (user and their orders on the same shard)
*   Supports your most common query patterns

# Popular Relational Databases

Each relational database has strengths that make it suitable for different use cases:

### PostgreSQL

PostgreSQL is often called "the most advanced open-source relational database." It combines rock-solid reliability with extensive features.

#### Key Features

*   **Extensibility:** Custom types, functions, operators, and indexes
*   **JSON support:** Native JSONB type with indexing and querying, bridging relational and document models
*   **Advanced features:** Full-text search, geospatial (PostGIS), window functions, CTEs, and more
*   **Concurrency:** MVCC (Multi-Version Concurrency Control) for high-concurrency workloads

**When to choose:** General-purpose workloads, complex queries, when you need advanced SQL features or JSON support.

### MySQL

MySQL is the most widely deployed open-source database, particularly popular for web applications.

#### Key Features

*   **Simplicity:** Easier to set up and operate than PostgreSQL
*   **Ecosystem:** Massive community, extensive tooling, and documentation
*   **Replication:** Excellent replication capabilities with multiple topologies
*   **Read performance:** Highly optimized for read-heavy web workloads

**When to choose:** Web applications, read-heavy workloads, when operational simplicity matters.

### SQL Server

Microsoft's flagship database, tightly integrated with the Windows and .NET ecosystem.

#### Key Features

*   **Enterprise features:** Built-in HA/DR, security, auditing, and compliance
*   **BI integration:** Tight integration with SSRS, SSIS, and Power BI
*   **T-SQL:** Extended SQL dialect with powerful procedural capabilities

**When to choose:** Microsoft-centric environments, enterprise applications with compliance requirements.

### Comparison

Feature

PostgreSQL

MySQL

SQL Server

License

Open source

Open source (GPL)

Commercial

JSON support

Excellent (JSONB)

Good (JSON)

Good

Full-text search

Built-in

Built-in

Built-in

Geospatial

PostGIS extension

Basic

Excellent

Replication

Streaming, logical

Multiple topologies

Always On

Max DB size

Unlimited

Unlimited

524 PB

Common use

General purpose

Web apps

Enterprise

# When to Choose Relational

Relational databases are the right choice when:

*   **Data has clear relationships.** Users have orders, orders have items, items belong to categories. The relational model expresses these relationships naturally.
*   **You need ACID transactions.** Financial systems, inventory management, booking systems, and anywhere that double-spending or data loss is unacceptable.
*   **Complex queries are required.** Reporting, analytics, and ad-hoc queries benefit from SQL's expressiveness and the optimizer's ability to find efficient execution plans.
*   **Data integrity is paramount.** Schema enforcement, foreign keys, and constraints prevent bad data from entering the system.
*   **The scale fits.** A single well-tuned relational database can handle millions of rows and thousands of queries per second. Only scale horizontally when you have exhausted vertical scaling options.

### When to Consider Alternatives

Relational databases may not be the best fit when:

*   **Schema changes frequently.** If you are iterating rapidly on data structure, schema migrations become painful.
*   **Data is naturally hierarchical.** Deeply nested objects are awkward to represent in tables. Document databases may fit better.
*   **Massive write throughput is needed.** Millions of writes per second requires horizontal scaling from day one.
*   **Relationships are the primary query pattern.** Graph databases are optimized for traversals that would require expensive recursive joins in SQL.
*   **Simple key-value access dominates.** If you always know the key and just need to retrieve the value, key-value stores are faster and simpler.

# Summary

Relational databases have earned their place as the default choice for data storage through a combination of powerful features:

Feature

Benefit

**Relational model**

Natural representation of entities and relationships

**Schema enforcement**

Data quality guaranteed at the database level

**ACID transactions**

Reliable operations even with concurrent access and failures

**SQL**

Declarative queries with optimizer-driven execution

**Mature ecosystem**

Decades of tooling, knowledge, and optimization techniques

Relational databases are not going away. They remain the foundation of most applications and the starting point for any new project. Understanding them deeply is essential because every other database type is, in some way, a response to their limitations.

The next chapter explores document databases, which emerged as an alternative when the relational model's schema rigidity and join-heavy nature became obstacles to developer velocity and horizontal scaling.

Launching soon
