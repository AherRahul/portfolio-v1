---
title: "ETL Pipelines"
description: "ETL Pipelines - System Design Module 18"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# ETL Pipelines

Data rarely lives in the format you need it. Your production database stores normalized rows optimized for transactions. Your analytics team needs denormalized tables optimized for queries. Your machine learning models need clean, feature-engineered datasets. Your data warehouse needs aggregated historical data.

Getting data from where it is to where it needs to be, in the format it needs to be in, is the job of **ETL: Extract, Transform, Load**. ETL pipelines are the plumbing of data infrastructure. They run silently in the background, moving terabytes of data every night, and only get attention when something breaks.

Understanding ETL is essential for system design. Almost every data architecture involves moving data between systems, and the patterns you learn here apply whether you are using batch processing, streaming, or hybrid approaches.

# What is ETL?

ETL stands for Extract, Transform, Load. It describes the process of moving data from source systems to destination systems while changing its format.

### The Three Phases

Phase

Purpose

Example

**Extract**

Read data from source systems

Query production database, call APIs, read files

**Transform**

Convert data to desired format

Clean, validate, aggregate, join, denormalize

**Load**

Write data to destination system

Insert into warehouse, update tables

### Why ETL Matters

Without ETL, every system would need to:

*   Understand every source system's format
*   Handle all data quality issues itself
*   Maintain connections to all data sources
*   Compete with production systems for resources

ETL centralizes these concerns:

# Extract Phase

The Extract phase reads data from source systems. This sounds simple but involves significant complexity.

### Common Data Sources

Source Type

Examples

Challenges

**Relational databases**

MySQL, PostgreSQL, Oracle

Connection limits, query impact on production

**NoSQL databases**

MongoDB, Cassandra, DynamoDB

No standard query language, denormalized data

**APIs**

REST, GraphQL, SOAP

Rate limits, pagination, authentication

**Files**

CSV, JSON, Parquet, logs

Schema variations, encoding issues

**Message queues**

Kafka, RabbitMQ

Ordering, exactly-once processing

**SaaS platforms**

Salesforce, Stripe, HubSpot

API limits, data access restrictions

### Full Extract vs Incremental Extract

Method

Pros

Cons

**Full extract**

Simple, always consistent

Slow, wastes resources, strains source

**Incremental extract**

Fast, minimal source impact

Requires change tracking, can miss deletes

### Incremental Extract Strategies

**Timestamp-based:** Query rows where `updated_at > last_run_time`

**Sequence-based:** Track a monotonically increasing ID

**Change Data Capture (CDC):** Read from database transaction log

CDC is the most reliable for incremental extraction because it captures all changes, including deletes, without modifying the source schema.

### Handling Source System Impact

Extracting data should not degrade production performance:

Strategy

How It Works

**Read replicas**

Query a replica instead of primary

**Off-peak scheduling**

Run extracts during low-traffic hours

**Rate limiting**

Limit query concurrency and batch size

**Snapshots**

Extract from database snapshots

**CDC**

Read from log without querying tables

# Transform Phase

The Transform phase converts raw data into the format needed by destination systems. This is where most of the business logic lives.

### Common Transformations

### Transformation Types

Type

Description

Example

**Cleaning**

Fix data quality issues

Remove nulls, fix encoding, trim whitespace

**Validation**

Ensure data meets requirements

Check required fields, validate formats

**Standardization**

Make data consistent

Convert dates to UTC, normalize phone numbers

**Enrichment**

Add derived data

Calculate age from birthdate, add geo data from IP

**Aggregation**

Summarize data

Sum daily sales, count monthly users

**Joining**

Combine data sources

Join orders with customers

**Filtering**

Remove unwanted data

Exclude test accounts, filter by date range

**Deduplication**

Remove duplicates

Dedupe by user email

**Denormalization**

Flatten for analytics

Embed customer data in order records

### Data Quality Checks

Transform is where you enforce data quality:

Common quality checks:

*   **Null checks:** Critical fields must have values
*   **Type checks:** Dates are dates, numbers are numbers
*   **Range checks:** Values within expected bounds
*   **Format checks:** Email, phone, postal code formats
*   **Referential checks:** Foreign keys exist in parent tables
*   **Uniqueness checks:** Primary keys are unique
*   **Business rules:** Order total matches line items sum

# Load Phase

The Load phase writes transformed data to destination systems. The strategy depends on the destination type and use case.

### Load Strategies

Strategy

When to Use

How It Works

**Full load**

Small tables, complete refresh needed

Truncate and reload

**Incremental append**

Event/transaction tables

Insert new rows only

**Upsert (merge)**

Dimension tables

Insert new, update existing

**SCD Type 2**

Need historical tracking

New row for each change, track valid dates

### Bulk Loading Techniques

For large data volumes, row-by-row inserts are too slow:

Technique

Description

Speed

**Batch INSERT**

Multi-row INSERT statements

10x faster than single

**COPY command**

Load from files (Postgres, Redshift)

100x faster

**Bulk loader**

Native database utilities

Fastest

**Parallel loading**

Multiple concurrent loaders

Scales with connections

### Staging Tables

A common pattern is to load into staging tables first:

Benefits:

*   Validate before affecting target
*   Atomic swap (rename tables)
*   Rollback if issues found
*   Target table always consistent

# ETL vs ELT

Modern data platforms have shifted from ETL to ELT.

### ETL: Transform Before Load

Transformations happen on ETL servers before loading.

### ELT: Transform After Load

Raw data is loaded first, transformations happen in the warehouse.

### Comparison

Aspect

ETL

ELT

**Transform location**

ETL server

Data warehouse

**Compute cost**

ETL infrastructure

Warehouse compute

**Raw data**

Not preserved

Preserved in warehouse

**Flexibility**

Changes require ETL updates

Transform with SQL anytime

**Best for**

Structured, well-defined transformations

Exploration, evolving requirements

**Tools**

Informatica, Talend, SSIS

dbt, Dataform, warehouse SQL

### Why ELT is Gaining Popularity

Modern cloud warehouses (Snowflake, BigQuery, Redshift) have:

*   Virtually unlimited compute
*   Columnar storage for fast analytics
*   SQL-based transformations
*   Lower cost than maintaining ETL servers

With ELT:

1.  Load raw data quickly (minimal processing)
2.  Transform using warehouse SQL
3.  Re-transform anytime without re-extracting
4.  Keep raw data for audit and new use cases

# ETL Pipeline Patterns

### The Medallion Architecture

A popular pattern for organizing data in lakes and warehouses:

Layer

Purpose

Users

**Bronze (Raw)**

Exact copy of source

Data engineers, debugging

**Silver (Cleaned)**

Validated, standardized

Data scientists, analysts

**Gold (Aggregated)**

Business metrics, KPIs

Dashboards, reports

### Change Data Capture Pipeline

For real-time or near-real-time data sync:

CDC captures every insert, update, and delete from the source database's transaction log, enabling near-real-time replication.

### Dependency DAG

Complex ETL involves many interdependent jobs:

Orchestration tools (Airflow, Dagster, Prefect) manage these dependencies.

# Handling Failures

ETL pipelines fail. Networks drop, sources become unavailable, data has unexpected formats. Robust pipelines handle failures gracefully.

### Failure Points

### Failure Handling Strategies

Strategy

Description

**Retry with backoff**

Retry transient failures with increasing delays

**Dead letter queue**

Send failed records to separate storage for investigation

**Checkpointing**

Save progress so jobs can resume from last success

**Idempotency**

Design jobs to be safely re-run without side effects

**Partial success**

Allow job to complete with some failures, report issues

**Circuit breaker**

Stop trying after repeated failures to prevent cascade

### Idempotent Loads

An idempotent operation produces the same result whether run once or many times:

Making ETL idempotent allows safe retries:

*   Use upserts instead of inserts
*   Process by date partition (reload entire day on retry)
*   Track processed records externally
*   Use unique constraints to prevent duplicates

# ETL Tools

### Traditional ETL Tools

Tool

Description

Best For

**Informatica**

Enterprise ETL, drag-and-drop

Large enterprises, complex mappings

**Talend**

Open source + enterprise

Cost-conscious organizations

**SSIS**

Microsoft SQL Server

Microsoft ecosystem

**DataStage**

IBM enterprise ETL

IBM shops

### Modern ELT Tools

Tool

Description

Best For

**dbt**

SQL-based transformations

Warehouse-centric, version control

**Dataform**

SQL transformations (Google)

BigQuery users

**Fivetran**

Managed data ingestion

Quick setup, SaaS sources

**Airbyte**

Open source data integration

Custom connectors, self-hosted

**Stitch**

Managed data pipelines

Simple SaaS to warehouse

### Orchestration Tools

Tool

Description

Best For

**Apache Airflow**

DAG-based workflow orchestration

Complex dependencies, Python

**Dagster**

Data-aware orchestration

Modern data platform

**Prefect**

Dynamic workflows

Python, simpler than Airflow

**AWS Step Functions**

AWS-native orchestration

AWS infrastructure

# Best Practices

### 1\. Design for Failure

Assume every component will fail:

*   Implement retries with exponential backoff
*   Make jobs idempotent
*   Log extensively for debugging
*   Alert on failures immediately

### 2\. Monitor Data Quality

Track metrics over time:

*   Row counts per table
*   Null rates per column
*   Value distribution changes
*   Schema drift detection

### 3\. Version Control Everything

Treat ETL code like application code:

*   Store in Git
*   Code review changes
*   Test before deploying
*   Track who changed what when

### 4\. Document Lineage

Know where data comes from:

*   Source system and table
*   Transformations applied
*   Business logic embedded
*   Downstream dependencies

### 5\. Use Incremental Processing

Avoid full refreshes when possible:

*   Track high watermarks
*   Process only new/changed data
*   Partition by date for efficient reloads

# Summary

ETL pipelines are the backbone of data infrastructure:

*   **Extract** pulls data from sources while minimizing impact. Use incremental extraction and CDC for efficiency.
*   **Transform** converts data to the required format while enforcing quality. Validate early and quarantine bad data.
*   **Load** writes to destinations using bulk loading for performance. Use staging tables for safe, atomic loads.
*   **ELT** inverts the pattern, loading raw data first and transforming in the warehouse. Modern warehouses make this practical.
*   **Failure handling** is critical. Design for idempotency, checkpoint progress, and monitor continuously.
*   **Quality monitoring** prevents bad data from reaching consumers. Track metrics and detect drift.

ETL moves data between systems, but where does all this data ultimately live? The next chapter explores Data Lakes, the foundational storage layer for modern big data architectures, where raw data lands before being refined for analytics.

Launching soon
