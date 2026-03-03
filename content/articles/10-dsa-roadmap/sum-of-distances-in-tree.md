---
title: Sum of Distances in Tree
description: Master Sum of Distances in Tree in the Dynamic Programming module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

There is an undirected connected tree with `n` nodes labeled from `0` to `n - 1` and `n - 1` edges\.

You are given the integer `n` and the array `edges` where **edges\[i\] = \[a****i****, b****i****\]** indicates that there is an edge between nodes **a****i** and **b****i** in the tree\.

Return an array `answer` of length `n` where `answer[i]` is the sum of the distances between the **i****th** node in the tree and all other nodes\.

##### **Example 1:**

**Input:** n = 6, edges = \[\[0,1\],\[0,2\],\[2,3\],\[2,4\],\[2,5\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
    </div>
  </div>
</div>

**Output:** \[8,12,6,10,10,10\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">10</span></div>
  </div>
</div>

**Explanation:** The tree is shown above\.

We can see that dist\(0,1\) \+ dist\(0,2\) \+ dist\(0,3\) \+ dist\(0,4\) \+ dist\(0,5\) equals 1 \+ 1 \+ 2 \+ 2 \+ 2 = 8\.Hence, answer\[0\] = 8, and so on\.

##### **Example 2:**

**Input:** n = 1, edges = \[\]

**Output:** \[0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
  </div>
</div>

##### **Example 3:**

**Input:** n = 2, edges = \[\[1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Output:** \[1,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
  </div>
</div>

##### **Constraints:**

*   **1 <= n <= 3 \* 10****4**
*   **edges\.length == n \- 1**
*   **edges\[i\]\.length == 2**
*   **0 <= a****i****, b****i** **< n**
*   **a****i** **\!= b****i**
*   The given input represents a valid tree\.


## Approaches

### 1\. Brute Force using DFS

#### **Intuition:**

The brute force approach calculates the distance for each node by performing a Depth First Search \(DFS\) from each node to every other node\. This gives a clear idea of the problem but is inefficient due to repeatedly traversing the tree for each node\.

#### **Steps:**

1.  For each node in the tree, calculate the sum of distances to all other nodes by performing a DFS traversal\.
2.  Maintain a graph representation using adjacency lists for bi\-directional traversal\.
3.  After computing the distance sum for one node, repeat the procedure for all nodes\.

This approach is clear but inefficient due to repeated calculations, making it not suitable for larger trees\.

#### Code:

```java
class Solution {
   private List<Set<Integer>> graph;
   private int[] answer;
   private boolean[] visited;
   
   public int[] sumOfDistancesInTree(int N, int[][] edges) {
       graph = new ArrayList<>();
       answer = new int[N];
       
       // Initialize graph as adjacency list
       for (int i = 0; i < N; i++) {
           graph.add(new HashSet<>());
       }
       
       // Fill the graph
       for (int[] edge : edges) {
           graph.get(edge[0]).add(edge[1]);
           graph.get(edge[1]).add(edge[0]);
       }
       
       // Calculate distance sums for each node as the root
       for (int i = 0; i < N; i++) {
           visited = new boolean[N];
           answer[i] = dfs(i, visited);
       }
       
       return answer;
   }
   
   private int dfs(int node, boolean[] visited) {
       visited[node] = true;
       int result = 0;
       
       for (int neighbor : graph.get(node)) {
           if (!visited[neighbor]) {
               result += dfs(neighbor, visited) + 1;
           }
       }
       
       return result;
   }
}

```

#### Complexity Analysis

*   **Time Complexity:** O\(N^2\) due to DFS from each node\.
*   **Space Complexity:** O\(N\) for storing graph as adjacency list and visited array\.

### 2\. Optimized DFS with DP and Precomputation

#### **Intuition:**

To optimize, we use dynamic programming and precompute sub\-tree information to reuse calculations efficiently\. We perform two DFS traversals, where the first one calculates the sum of distances from an arbitrary root \(e\.g\., node 0\) to all its sub\-nodes, and the second adjusts these values from the root to other nodes using precomputed information\.

#### **Steps:**

1.  Perform a first DFS to calculate:

*   `count[node]`: number of nodes in the subtree rooted at `node`\.
*   `answer[0]`: initial sum of distances from root node to all other nodes\.

3.  Execute a second DFS to propagate these sums effectively to the rest of the nodes and adjust them using the precomputed values:

*   For each node transitioning from parent, calculate its sum based on the child's distance by subtracting its distance contributed and adding distances from non\-subtree nodes\.

#### **Code:**

```java
class Solution {
   private List<Set<Integer>> graph;
   private int[] answer;
   private int[] count;
   
   public int[] sumOfDistancesInTree(int N, int[][] edges) {
       graph = new ArrayList<>();
       answer = new int[N];
       count = new int[N];
       
       // Initialize graph representation
       for (int i = 0; i < N; i++) {
           graph.add(new HashSet<>());
       }
       
       // Fill the graph
       for (int[] edge : edges) {
           graph.get(edge[0]).add(edge[1]);
           graph.get(edge[1]).add(edge[0]);
       }
       
       // First DFS to calculate initial distance sum and count nodes
       dfs(0, -1);
       // Second DFS to calculate the result for all nodes based on the root
       dfs2(0, -1);
       
       return answer;
   }
   
   private void dfs(int node, int parent) {
       for (int neighbor : graph.get(node)) {
           if (neighbor == parent) continue;
           dfs(neighbor, node);
           count[node] += count[neighbor];
           answer[node] += answer[neighbor] + count[neighbor];
       }
       count[node]++;
   }
   
   private void dfs2(int node, int parent) {
       for (int neighbor : graph.get(node)) {
           if (neighbor == parent) continue;
           answer[neighbor] = answer[node] - count[neighbor] + (count.length - count[neighbor]);
           dfs2(neighbor, node);
       }
   }
}

```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), as each edge and node is traversed a constant number of times\.
*   **Space Complexity:** O\(N\) for graph storage and arrays to store results and counts\.

#### [Solve it on LeetCode](https://leetcode.com/problems/sum-of-distances-in-tree)
