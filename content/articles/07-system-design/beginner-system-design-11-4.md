---
title: "Erasure Coding"
description: "Erasure Coding - System Design Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Erasure Coding

When we discussed object storage durability, we mentioned that Amazon S3 achieves **99.999999999%** (eleven 9s) durability. That means if you store 10 million objects, you might lose one every 10,000 years.

**How is this possible?**

The traditional answer is replication: store three copies of every piece of data on different servers. If one fails, two copies remain. But replication has a significant drawback: 3x replication means your storage overhead is 200%. For every 1 TB of actual data, you need 3 TB of storage.

**Erasure coding** is a different approach. It breaks data into fragments, adds redundancy through mathematical operations, and distributes the fragments across multiple locations.

The remarkable property is that you can lose several fragments and still reconstruct the original data, but with much lower storage overhead than replication.

In this chapter, we'll explore:

*   Why replication becomes prohibitively expensive at scale
*   How erasure coding works (with intuitive explanations)
*   Reed-Solomon encoding, the most widely used algorithm
*   The complete encoding and decoding process
*   Real-world implementations in S3, HDFS, and Ceph
*   Trade-offs between erasure coding and replication
*   When to use each approach
*   Interview questions and discussion points

# 1\. The Problem with Replication

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
