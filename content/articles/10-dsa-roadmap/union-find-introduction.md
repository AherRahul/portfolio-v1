---
title: Union Find
description: Master Union Find in the Graphs module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Union\-Find, also known as **Disjoint Set Union \(DSU\)** is a powerful data structure for solving **graph connectivity problems** like checking whether two nodes are connected, detecting cycles, or grouping elements efficiently\.

Using union find, we can easily tell whether two elements belong to the same group and if not, it lets us merge groups together\.

In this chapter, I’ll cover:

*   What Union\-Find is and how it works
*   The two core operations: **find** and **union**
*   Key Optimizations like **path compression** and **union by rank/size** that make union find operations nearly O\(1\)

# What is Union Find?

Union\-Find is a data structure that helps us manage a collection of elements divided into **disjoint sets** meaning no two sets overlap\.

0root12

3root4

5root

Every element belongs to exactly one set, and sets can be **merged** when a connection is discovered\.

Think of it like tracking friend groups:

*   Everyone is in **one and only one** friend circle
*   If two people from different groups become friends, the two groups can merge into one

Union\-Find supports two fundamental operations:

1.  **Find**

*   This operation tells us which set an element belongs to by returning the **root representative** of that set\.
*   For example, if Alice and Bob are in the same friend circle, `find(Alice)` and `find(Bob)` will return the same root\.

3.  **Union**

*   This operation merges two sets into a single set\.
*   If Alice’s group and Charlie’s group are separate but they become friends, the **union** operation connects them into one larger group\.

These two operations make Union\-Find extremely powerful for solving **graph connectivity problems**, such as:

*   Are two nodes connected?
*   Do two elements belong to the same component?
*   Can we merge without forming a cycle?

# Basic Implementation

Now that we understand what Union\-Find does, let’s see how to implement it\.

The simplest way to represent Union\-Find is with an **array called** `**parent**`\.

*   We start by initializing the `parent` array\. Initially, **every node is its own parent**, meaning each element is its own set
*   The **find** operation walks up the parent chain until it reaches the root\. That root represents the set that the element belongs to\.
*   The **union** operation find the roots of each element\. If they’re different, it means they’re in different sets, so we merge them by pointing one root to the other\.

```java
class UnionFind {
   int[] parent;

   public UnionFind(int n) {
       parent = new int[n];
       for (int i = 0; i < n; i++) {
           parent[i] = i; // each node is its own parent
       }
   }
}
```

**Step 2: Find Operation**

```java
public int find(int x) {
   while (x != parent[x]) {
       x = parent[x];
   }
   return x;
}
```

**Step 3: Union Operation**

```java
public void union(int x, int y) {
   int rootX = find(x);
   int rootY = find(y);

   if (rootX != rootY) {
       parent[rootY] = rootX; // merge the sets
   }
}
```

### Example Walkthrough

Let’s say we start with 5 elements: `[0, 1, 2, 3, 4]`\.

*   Initially, each is its own parent\.
*   After `union(0, 1)`, elements `0` and `1` share the same root\.
*   After `union(2, 3)`, elements `2` and `3` share the same root\.
*   If we now call `find(1)` and `find(0)`, they’ll both return `0`, meaning they’re in the same set\.

In this basic version:

*   **Find** is O\(h\), where _h_ is the height of the tree formed by parent pointers\.
*   **Union** is also O\(h\), since it calls find\.

The basic implementation of Union\-Find works — but it can get slow if the parent pointers form tall chains\. In the worst case, operations can take **O\(n\)** time\.

# Optimizations

To fix this, we use two powerful optimizations: **Path Compression** and **Union by Rank \(or Size\)**\.

With both applied, all operations run in **almost constant time — O\(α\(n\)\)**, where α is the inverse Ackermann function \(effectively constant for all practical input sizes\)\.

Lets start with path compression\.

### **1\. Path Compression**

Path compression flattens the structure of the tree whenever we call **find**\.

*   Normally, `find(x)` climbs one parent at a time until it reaches the root\.
*   With path compression, we make every visited node point **directly to the root**\.
*   This way, future queries become much faster\.

```java
public int find(int x) {
   if (x != parent[x]) {
       parent[x] = find(parent[x]); // path compression
   }
   return parent[x];
}
```

Imagine a long chain of 10 nodes\. Without path compression, you’d walk through all 10 nodes every time\. With path compression, after just one find, all 10 point directly to the root — making future finds O\(1\)\.

Next optimization is Union by rank\.

### **2\. Union by Rank \(or Size\)**

This optimization helps keep the tree shallow when merging sets\.

*   **Rank** means the “approximate height” of the tree\.
*   When uniting two roots, attach the **shorter tree under the taller one**\.
*   If both have the same rank, choose one as root and increase its rank\.
*   By always attaching the smaller tree to the larger one, the tree height stays very small\.

```java
class UnionFind {
   int[] parent;
   int[] rank;

   public UnionFind(int n) {
       parent = new int[n];
       rank = new int[n];
       for (int i = 0; i < n; i++) {
           parent[i] = i;
           rank[i] = 1;
       }
   }

   public int find(int x) {
       if (x != parent[x]) {
           parent[x] = find(parent[x]);
       }
       return parent[x];
   }

   public void union(int x, int y) {
       int rootX = find(x);
       int rootY = find(y);

       if (rootX != rootY) {
           if (rank[rootX] < rank[rootY]) {
               parent[rootX] = rootY;
           } else if (rank[rootX] > rank[rootY]) {
               parent[rootY] = rootX;
           } else {
               parent[rootY] = rootX;
               rank[rootX]++;
           }
       }
   }
}
```

When path compression and union by rank are used together, Union\-Find operations \(find and union\) run in near O\(1\) time\.