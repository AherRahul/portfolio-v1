---
title: "10 Data Structures That Make Databases Fast and Scalable"
description: "Have you ever wondered why modern databases are so fast and efficient, even when managing terabytes of data?"
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/data-structures-that-make-databases-scalable.md"
dateModified: "2024-11-21"
datePublished: "2024-11-21"
showOnArticles: true
topics:
  - databases
  - system-design
---

Have you ever wondered why  **modern databases**  are so fast and efficient, even when managing  **terabytes of data** ?

The answer lies in their underlying  **data structures**  and  **indexing techniques**  that enable efficient storage, retrieval, and management of data.

In this article, we'll look at  **10 important data structures**  that make modern databases fast, reliable, and scalable.

## **1. Hash Indexes**

A  **hash index**  is a data structure that maps keys to values using a  **hash function** .

The hash function converts a key into an integer, which is used as an index in a  **hash table (buckets)**  to locate the corresponding value.

It is designed for  **fast insertion**  and **lookup** , such as:

- Insert/Find a new record with id = 123.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2f8dffb0-d5d4-4ab9-b7c5-b1fc68aa7dc9_743x262.png)](https://substackcdn.com/image/fetch/$s_!z7uV!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2f8dffb0-d5d4-4ab9-b7c5-b1fc68aa7dc9_743x262.png) **Visualized using [Multiplayer](https://dub.sh/mL1fb0m)**

This structure provides  **O(1) average-time complexity**  for insertions, deletions, and lookups.

> Hash indexes are widely used in  **key-value**   **stores**  (eg., DynamoDB), and  **caching systems**  (eg., Redis).

## 2. B-Trees

A  **B-tree**  is a  **self-balancing tree data structure**  designed to store  **sorted data**  in a way that optimizes reads, writes, and queries on large datasets.

It minimizes disk I/O by storing multiple keys in a single node and automatically balances itself during insertions and deletions.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c408716d-6795-4055-9c87-9eff17329c15_788x281.png)](https://substackcdn.com/image/fetch/$s_!QRaQ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc408716d-6795-4055-9c87-9eff17329c15_788x281.png) **Visualized using [Multiplayer](https://dub.sh/mL1fb0m)**

Unlike binary search trees, where each node has at most two children, B-Trees allow multiple children per node. The number of children is defined by the  **order**  of the B-Tree.

**Internal nodes**  contain keys and pointers to child nodes and  **leaf nodes**  contain keys and pointers to the actual data.

Keys in each node are stored in sorted order, enabling fast binary searches.

> **B-Trees**  are widely used for indexing in relational databases (eg., MySQL).While many NoSQL databases favor  **LSM Trees**  for write-heavy workloads, some use  **B-Trees**  for read-heavy scenarios or as part of their indexing strategy.

## **3. Skip Lists**



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
