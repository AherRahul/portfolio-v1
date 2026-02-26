---
title: Number of Provinces
description: Master Number of Provinces in the Graphs module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Problem Description

Question

There are `n` cities\. Some of them are connected, while some are not\. If city `a` is connected directly with city `b`, and city `b` is connected directly with city `c`, then city `a` is connected indirectly with city `c`\.

A **province** is a group of directly or indirectly connected cities and no other cities outside of the group\.

You are given an `n x n` matrix `isConnected` where `isConnected[i][j] = 1` if the `i``th` city and the `j``th` city are directly connected, and `isConnected[i][j] = 0` otherwise\.

Return _the total number of_ _**provinces**_\.

##### **Example 1:**

**Input:** isConnected = \[\[1,1,0\],\[1,1,0\],\[0,0,1\]\]

**Output:** 2

##### **Example 2:**

**Input:** isConnected = \[\[1,0,0\],\[0,1,0\],\[0,0,1\]\]

**Output:** 3

##### **Constraints:**

*   `1 <= n <= 200`
*   `n == isConnected.length`
*   `n == isConnected[i].length`
*   `isConnected[i][j]` is `1` or `0`\.
*   `isConnected[i][i] == 1`
*   `isConnected[i][j] == isConnected[j][i]`

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-provinces)

# Approaches

## 1\. Depth\-First Search \(DFS\)

#### Intuition:

The problem can be conceptualized as finding connected components in an undirected graph\. Each city is a node, and a direct road between two cities is an edge\. Using Depth\-First Search, we can explore all nodes \(i\.e\., cities\) connected to a starting node, marking them as visited\. Each new unvisited node indicates the start of a new province\.

#### Code:

Java

```java
class Solution {
   public int findCircleNum(int[][] isConnected) {
       int n = isConnected.length;
       boolean[] visited = new boolean[n];
       int numProvinces = 0;
       
       for (int i = 0; i < n; i++) {
           if (!visited[i]) {
               dfs(isConnected, visited, i);
               numProvinces++;
           }
       }
       
       return numProvinces;
   }
   
   private void dfs(int[][] isConnected, boolean[] visited, int city) {
       visited[city] = true; // Mark the city as visited
       for (int i = 0; i < isConnected.length; i++) {
           // If there is a road from `city` to `i` and `i` hasn't been visited
           if (isConnected[city][i] == 1 && !visited[i]) {
               dfs(isConnected, visited, i); // Explore city `i`
           }
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\): We visit each cell in the matrix isConnected exactly once\.
*   **Space Complexity:** O\(n\): The space for the visited array and the call stack in the worst case \(when the graph is a single connected component\)\.

## 2\. Breadth\-First Search \(BFS\)

#### Intuition:

Similar to the DFS approach, we aim to find connected components\. However, BFS uses a queue to explore all nodes extensively level by level\. Whenever we find a new city that hasn't been visited, we add it to the queue and mark it as part of the same province\.

#### Code:

Java

```java
class Solution {
   public int findCircleNum(int[][] isConnected) {
       int n = isConnected.length;
       boolean[] visited = new boolean[n];
       int numProvinces = 0;
       
       Queue<Integer> queue = new LinkedList<>();
       
       for (int i = 0; i < n; i++) {
           if (!visited[i]) {
               queue.add(i);
               while (!queue.isEmpty()) {
                   int city = queue.poll();
                   visited[city] = true;
                   for (int j = 0; j < n; j++) {
                       if (isConnected[city][j] == 1 && !visited[j]) {
                           queue.add(j);
                       }
                   }
               }
               numProvinces++;
           }
       }
       
       return numProvinces;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- Every city and every possible connection \(road\) is considered\.
*   **Space Complexity:** O\(n\) \- The space for the visited array and the queue\.

## 3\. Union\-Find

#### Intuition:

Union\-Find efficiently tracks and merges disjoint sets, or connected components, which suits this problem perfectly\. Initially, each city is its own province\. As we process direct roads between cities, we union their sets\. The number of unique roots in the Union\-Find structure at the end will give us the number of provinces\.

#### Code:

Java

```java
class Solution {
   class UnionFind {
       private int[] parent;
       private int count;

       UnionFind(int n) {
           parent = new int[n];
           count = n;
           for (int i = 0; i < n; i++) {
               parent[i] = i;
           }
       }

       public int find(int x) {
           if (parent[x] != x) {
               parent[x] = find(parent[x]); // Path compression
           }
           return parent[x];
       }

       public void union(int x, int y) {
           int rootX = find(x);
           int rootY = find(y);
           if (rootX != rootY) {
               parent[rootX] = rootY; // Union by rank could improve this
               count--;
           }
       }

       public int getCount() {
           return count;
       }
   }

   public int findCircleNum(int[][] isConnected) {
       int n = isConnected.length;
       UnionFind uf = new UnionFind(n);
       
       for (int i = 0; i < n; i++) {
           for (int j = i + 1; j < n; j++) {
               if (isConnected[i][j] == 1) {
                   uf.union(i, j);
               }
           }
       }
       
       return uf.getCount();
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\): Iterate through the upper triangle of the matrix\.
*   **Space Complexity:** O\(n\): Additional space used by the Union\-Find structure\.