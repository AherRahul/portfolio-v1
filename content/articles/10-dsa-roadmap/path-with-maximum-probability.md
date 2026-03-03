---
title: Path with Maximum Probability
description: Master Path with Maximum Probability in the Graphs module.
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

You are given an undirected weighted graph of `n` nodes \(0\-indexed\), represented by an edge list where `edges[i] = [a, b]` is an undirected edge connecting the nodes `a` and `b` with a probability of success of traversing that edge `succProb[i]`\.

Given two nodes `start` and `end`, find the path with the maximum probability of success to go from `start` to `end` and return its success probability\.

If there is no path from `start` to `end`, **return 0**\. Your answer will be accepted if it differs from the correct answer by at most **1e\-5**\.

##### **Example 1:**

**Input:** n = 3, edges = \[\[0,1\],\[1,2\],\[0,2\]\], succProb = \[0\.5,0\.5,0\.2\], start = 0, end = 2

**Output:** 0\.25000

**Explanation:** There are two paths from start to end, one having a probability of success = 0\.2 and the other has 0\.5 \* 0\.5 = 0\.25\.

##### **Example 2:**

**Input:** n = 3, edges = \[\[0,1\],\[1,2\],\[0,2\]\], succProb = \[0\.5,0\.5,0\.3\], start = 0, end = 2

**Output:** 0\.30000

##### **Example 3:**

**Input:** n = 3, edges = \[\[0,1\]\], succProb = \[0\.5\], start = 0, end = 2

**Output:** 0\.00000

**Explanation:** There is no path between 0 and 2\.

##### **Constraints:**

*   `2 <= n <= 10^4`
*   `0 <= start, end < n`
*   `start != end`
*   `0 <= a, b < n`
*   `a != b`
*   `0 <= succProb.length == edges.length <= 2*10^4`
*   `0 <= succProb[i] <= 1`
*   There is at most one edge between every two nodes\.


## Approaches

### 1\. Breadth\-First Search \(BFS\)

In this approach, we will utilize a queue to explore all possible paths from the start node, keeping track of the maximum probability of reaching each node\. This is similar to BFS, but we focus on maximizing probability \(a multiplicative metric\) rather than minimizing distance or edges\.

#### Intuition:

We start from the given starting node and try to explore its neighbors, iteratively updating the maximum probability to reach each neighbor node\. We continue this process until we either visit all nodes or exhaust all possibilities, aiming to find the path to the target node with the highest probability\.

#### Code:

```java
class Solution {
   public double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
       // Creating an adjacency list to store graph.
       List<double[]>[] graph = new List[n];
       for (int i = 0; i < n; i++) {
           graph[i] = new ArrayList<>();
       }
       
       // Populating the graph with given edges and their success probabilities
       for (int i = 0; i < edges.length; i++) {
           int u = edges[i][0], v = edges[i][1];
           graph[u].add(new double[]{v, succProb[i]});
           graph[v].add(new double[]{u, succProb[i]});
       }

       // Array to track maximum probability to reach each node.
       double[] prob = new double[n];
       prob[start] = 1.0;

       // Queue for BFS traversal.
       Queue<Integer> queue = new LinkedList<>();
       queue.offer(start);

       while (!queue.isEmpty()) {
           int current = queue.poll();
           for (double[] neighbor : graph[current]) {
               int nextNode = (int)neighbor[0];
               double newProb = prob[current] * neighbor[1];

               // Update the probability of reaching nextNode if we found a path with a higher probability
               if (newProb > prob[nextNode]) {
                   prob[nextNode] = newProb;
                   queue.offer(nextNode);
               }
           }
       }
       
       return prob[end];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(V \+ E\), where V is the number of vertices and E is the number of edges\. The algorithm explores all edges once\.
*   **Space Complexity:** O\(V \+ E\), mainly for storing the graph and probability tracking\.

### 2\. Dijkstra's Algorithm

Dijkstra's Algorithm can be adapted to find the path with maximum probability by using a priority queue \(max\-heap\) to ensure that we always expand the node with the highest accumulated probability\.

#### Intuition:

Similar to finding the shortest path, where we keep track of minimum distances, here we keep track of maximum probabilities\. We utilize a priority queue to explore nodes in the order of their maximum current path probabilities\.

#### Code:

```java
class Solution {
   public double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
       // Graph initialization
       List<double[]>[] graph = new List[n];
       for (int i = 0; i < n; i++) {
           graph[i] = new ArrayList<>();
       }

       // Filling the graph with edges and their success probabilities
       for (int i = 0; i < edges.length; i++) {
           int u = edges[i][0], v = edges[i][1];
           graph[u].add(new double[]{v, succProb[i]});
           graph[v].add(new double[]{u, succProb[i]});
       }

       // Maximum probabilities array
       double[] prob = new double[n];
       prob[start] = 1.0;

       // Max-heap priority queue to process nodes based on the highest current path probability
       PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> Double.compare(b[1], a[1]));
       maxHeap.offer(new int[]{start, 1});

       while (!maxHeap.isEmpty()) {
           int[] curr = maxHeap.poll();
           int node = curr[0];
           double curProb = curr[1];

           if (node == end) {
               return curProb;
           }

           // Explore neighbors
           for (double[] neighbor : graph[node]) {
               int nextNode = (int)neighbor[0];
               double newProb = curProb * neighbor[1];

               // Update the probability if we found a better path
               if (newProb > prob[nextNode]) {
                   prob[nextNode] = newProb;
                   maxHeap.offer(new int[]{nextNode, newProb});
               }
           }
       }

       return 0.0;  // If there is no path to the end node
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(\(E \+ V\) log V\), using a priority queue gives a log\-factor overhead for each of the operations\.
*   **Space Complexity:** O\(V \+ E\), primarily for the storage of the graph and data structures needed for Dijkstra's algorithm\.

#### [Solve it on LeetCode](https://leetcode.com/problems/path-with-maximum-probability)
