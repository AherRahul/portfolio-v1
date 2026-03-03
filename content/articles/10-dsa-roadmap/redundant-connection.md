---
title: Redundant Connection
description: Master Redundant Connection in the Graphs module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

In this problem, a tree is an **undirected graph** that is connected and has no cycles\.

You are given a graph that started as a tree with `n` nodes labeled from `1` to `n`, with one additional edge added\. The added edge has two **different** vertices chosen from `1` to `n`, and was not an edge that already existed\. The graph is represented as an array `edges` of length `n` where **edges\[i\] = \[a****i****, b****i****\]** indicates that there is an edge between nodes **a****i** and **b****i** in the graph\.

Return _an edge that can be removed so that the resulting graph is a tree of_ `n` _nodes_\. If there are multiple answers, return the answer that occurs last in the input\.

##### **Example 1:**

**Input:** edges = \[\[1,2\],\[1,3\],\[2,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Output:** \[2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
  </div>
</div>

##### **Example 2:**

**Input:** edges = \[\[1,2\],\[2,3\],\[3,4\],\[1,4\],\[1,5\]\]**Output:** \[1,4\]

##### **Constraints:**

*   **n == edges\.length**
*   **3 <= n <= 1000**
*   **edges\[i\]\.length == 2**
*   **1 <= a****i** **< b****i** **<= edges\.length**
*   **a****i** **\!= b****i**
*   **There are no repeated edges\.**
*   **The given graph is connected\.**


## Approaches

### 1\. Union\-Find \(Disjoint Set\)

#### Intuition:

The goal of this problem is to identify an edge that, when added, creates a cycle in a graph that otherwise forms a tree\. Trees have N nodes with exactly N\-1 edges and no cycles, whereas adding an additional edge creates exactly one cycle\.

The Union\-Find data structure is ideal for this type of problem because it helps efficiently manage and detect the connected components of a graph\. The idea is to iterate over each edge and try to union its two nodes\. If the two nodes are already in the same connected component \(same parent/root in Union\-Find terms\), adding the edge would create a cycle, and that's the redundant connection\.

The steps are:

1.  Initialize a Union\-Find structure for `n` elements\.
2.  Iterate through each edge\.
3.  For each edge, check if the two endpoints are in the same component using `find`\.
4.  If they are not, union them\.
5.  If they are, this edge is the redundant one\.

#### Code:

```java
class Solution {
   public int[] findRedundantConnection(int[][] edges) {
       int n = edges.length;
       
       // Initialize DSU data structure
       DSU dsu = new DSU(n);
       
       // Iterate through each edge
       for (int[] edge : edges) {
           // Check for redundant connection
           if (!dsu.union(edge[0] - 1, edge[1] - 1)) {
               // If union fails, edge[0] to edge[1] is causing a cycle
               return edge;
           }
       }
       
       // Default return for function structure (should not reach this)
       return new int[2];
   }
   
   // DSU: Disjoint Set Union with Path Compression and Union by Rank
   class DSU {
       private int[] parent;
       private int[] rank;
       
       public DSU(int size) {
           parent = new int[size];
           rank = new int[size];
           for (int i = 0; i < size; i++) {
               parent[i] = i;
               rank[i] = 1;  // Initialize rank
           }
       }
       
       public int find(int u) {
           // Path Compression: flatten the tree
           if (parent[u] != u) {
               parent[u] = find(parent[u]);
           }
           return parent[u];
       }
       
       public boolean union(int u, int v) {
           int rootU = find(u);
           int rootV = find(v);
           
           // If they have the same root, the edge forms a cycle
           if (rootU == rootV) {
               return false;
           }
           
           // Union by rank
           if (rank[rootU] > rank[rootV]) {
               parent[rootV] = rootU;
           } else if (rank[rootU] < rank[rootV]) {
               parent[rootU] = rootV;
           } else {
               parent[rootV] = rootU;
               rank[rootU]++;
           }
           
           return true;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of edges\. Each `find` and `union` operation runs in near constant time thanks to the path compression and union by rank heuristics\.
*   **Space Complexity:** O\(N\), for storing parent and rank arrays in the DSU structure\.

#### [Solve it on LeetCode](https://leetcode.com/problems/redundant-connection)
