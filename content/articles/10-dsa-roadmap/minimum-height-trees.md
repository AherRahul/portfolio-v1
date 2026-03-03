---
title: Minimum Height Trees
description: Master Minimum Height Trees in the Graphs module. Comprehensive
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

A tree is an undirected graph in which any two vertices are connected by _exactly_ one path\. In other words, any connected graph without simple cycles is a tree\.

Given a tree of `n` nodes labelled from `0` to `n - 1`, and an array of `n - 1` `edges` where **edges\[i\] = \[a****i****, b****i****\]** indicates that there is an undirected edge between the two nodes `a``i` and `b``i` in the tree, you can choose any node of the tree as the root\. When you select a node `x` as the root, the result tree has height `h`\. Among all possible rooted trees, those with minimum height \(i\.e\. `min(h)`\)  are called **minimum height trees** \(MHTs\)\.

Return _a list of all_ _**MHTs'**_ _root labels_\. You can return the answer in **any order**\.

The **height** of a rooted tree is the number of edges on the longest downward path between the root and a leaf\.

##### **Example 1:**

**Input:** n = 4, edges = \[\[1,0\],\[1,2\],\[1,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Output:** \[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Explanation:** As shown, the height of the tree is 1 when the root is the node with label 1 which is the only MHT\.

##### **Example 2:**

**Input:** n = 6, edges = \[\[3,0\],\[3,1\],\[3,2\],\[3,4\],\[5,4\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
  </div>
</div>

**Output:** \[3,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">4</span></div>
  </div>
</div>

##### **Constraints:**

*   **1 <= n <= 2 \* 10****4**
*   **edges\.length == n \- 1**
*   **0 <= a****i****, b****i** **< n**
*   **a****i** **\!= b****i**
*   All the pairs **\(a****i****, b****i****\)** are distinct\.
*   The given input is **guaranteed** to be a tree and there will be **no repeated** edges\.


## Approaches

### 1\. BFS with Degree Count

#### Intuition:

The problem of finding the minimum height trees \(MHTs\) in an undirected graph can be tackled by understanding that the roots of MHTs are the central nodes in the longest path of a tree\. For trees, the diameter path has a central point/points which split the path into equal or nearly equal parts, minimizing height from these nodes\.

The key is to iteratively remove leaf nodes \(nodes with only one connection\) layer by layer until only one or two nodes are left\. These final nodes represent the root of the minimum height trees\.

#### Steps:

1.  **Graph Representation**

*   We first create an adjacency list to represent the graph as this will help us easily find neighbors of each node\.

1.  **Initial Setup:**

*   Identify nodes with only one connection \(leaves\)\.
*   Use a queue to perform a Breadth\-First Search \(BFS\) starting from these leaves\.

3.  **Iterative Leaf Removal:**

*   Repeatedly remove leaves level by level until one or two nodes remain\.
*   For each leaf removed, reduce the degree of its neighbor and if the degree becomes one, it becomes a leaf for the next level\.

5.  **Identify MHT Roots:**

*   When we can't remove any more edges \(when the remaining pending nodes are 1 or 2\), these nodes are the desired roots of MHTs\.

#### Code:

```java
class Solution {
   public List<Integer> findMinHeightTrees(int n, int[][] edges) {
       if (n == 1) return Collections.singletonList(0);
       
       // Step 1: Build the graph using adjacency list
       List<Set<Integer>> graph = new ArrayList<>();
       for (int i = 0; i < n; i++) graph.add(new HashSet<>());
       for (int[] edge : edges) {
           graph.get(edge[0]).add(edge[1]);
           graph.get(edge[1]).add(edge[0]);
       }
       
       // Step 2: Initialize the first layer of leaves
       List<Integer> leaves = new ArrayList<>();
       for (int i = 0; i < n; i++) {
           if (graph.get(i).size() == 1) leaves.add(i);
       }
       
       // Step 3: Trim the leaves until reaching the centroids
       int remainingNodes = n;
       while (remainingNodes > 2) {
           remainingNodes -= leaves.size();
           List<Integer> newLeaves = new ArrayList<>();
           for (int leaf : leaves) {
               int neighbor = graph.get(leaf).iterator().next();
               graph.get(neighbor).remove(leaf);
               if (graph.get(neighbor).size() == 1) newLeaves.add(neighbor);
           }
           leaves = newLeaves;
       }
       
       return leaves;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where \(n\) is the number of nodes\. Each node and edge is added and removed at most once from the list\.
*   **Space Complexity:** O\(n\)\. The space mainly depends on the graph structure and any auxiliary space used for tracking nodes and leaves\.

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-height-trees)
