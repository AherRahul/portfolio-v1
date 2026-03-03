---
title: Cheapest Flights Within K Stops
description: Master Cheapest Flights Within K Stops in the Graphs module.
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

There are `n` cities connected by some number of flights\. You are given an array `flights` where **flights\[i\] = \[from****i****, to****i****, price****i****\]** indicates that there is a flight from city **from****i** to city **to****i** with cost **price****i**\.

You are also given three integers `src`, `dst`, and `k`, return _**the cheapest price**_ _from_ `src` _to_ `dst` _with at most_ `k` _stops\._ If there is no such route, return `-1`\.

##### **Example 1:**

**Input:** n = 4, flights = \[\[0,1,100\],\[1,2,100\],\[2,0,100\],\[1,3,600\],\[2,3,200\]\], src = 0, dst = 3, k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">600</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">200</span></div>
    </div>
  </div>
</div>

**Output:** 700

**Explanation:**

The graph is shown above\.

The optimal path with at most 1 stop from city 0 to 3 is marked in red and has cost 100 \+ 600 = 700\.

Note that the path through cities \[0,1,2,3\] is cheaper but is invalid because it uses 2 stops\.

##### **Example 2:**

**Input:** n = 3, flights = \[\[0,1,100\],\[1,2,100\],\[0,2,500\]\], src = 0, dst = 2, k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">500</span></div>
    </div>
  </div>
</div>

**Output:** 200

**Explanation:**

The graph is shown above\.

The optimal path with at most 1 stop from city 0 to 2 is marked in red and has cost 100 \+ 100 = 200\.

##### **Example 3:**

**Input:** n = 3, flights = \[\[0,1,100\],\[1,2,100\],\[0,2,500\]\], src = 0, dst = 2, k = 0

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">500</span></div>
    </div>
  </div>
</div>

**Output:** 500

**Explanation:**

The graph is shown above\.

The optimal path with no stops from city 0 to 2 is marked in red and has cost 500\.

##### **Constraints:**

*   **1 <= n <= 100**
*   **0 <= flights\.length <= \(n \* \(n \- 1\) / 2\)**
*   **flights\[i\]\.length == 3**
*   **0 <= from****i****, to****i** **< n**
*   **from****i** **\!= to****i**
*   **1 <= price****i** **<= 10****4**
*   **There will not be any multiple flights between two cities\.**
*   **0 <= src, dst, k < n**
*   **src \!= dst**


## Approaches

### 1\. Modified Depth\-First Search with Pruning

#### Intuition:

This approach involves using a modified DFS algorithm to explore all possible routes from the source to the destination, while pruning unnecessary paths based on constraints \(i\.e\., the number of stops\)\.

1.  Use a recursive DFS method to visit all nodes\.
2.  If the number of stops exceeds `K`, return as we cannot make more stops\.
3.  Track the currently accumulated cost; if it exceeds the known minimum cost for reaching the destination, prune that path\.
4.  Use the adjacency list to explore every neighboring node recursively\.
5.  Update the result whenever a valid path with a cost lower than the current known minimum is found\.

#### Code:

```java
class Solution {
   private int minCost = Integer.MAX_VALUE;
   
   public int findCheapestPrice(int n, int[][] flights, int src, int dst, int K) {
       Map<Integer, List<int[]>> graph = new HashMap<>();
       for (int[] flight : flights) {
           graph.putIfAbsent(flight[0], new ArrayList<>());
           graph.get(flight[0]).add(new int[]{flight[1], flight[2]});
       }
       
       dfs(graph, src, dst, K + 1, 0);
       return minCost == Integer.MAX_VALUE ? -1 : minCost;
   }
   
   private void dfs(Map<Integer, List<int[]>> graph, int node, int dst, int stops, int cost) {
       if (node == dst) {  // If destination is reached
           minCost = cost;
           return;
       }
       if (stops == 0) return; // No more stops allowed
       
       if (!graph.containsKey(node)) return;
       for (int[] neighbor : graph.get(node)) {
           // Pruning
           if (cost + neighbor[1] > minCost) continue;
           dfs(graph, neighbor[0], dst, stops - 1, cost + neighbor[1]);
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(K \* E\)\) where E is the number of flights, as for every node we are exploring up to K\+1 times\.
*   **Space Complexity:** O\(V \+ E\) where V is the number of vertices\. Storage for the graph and call stack for recursion\.

### 2\. Bellman\-Ford Algorithm \(Dynamic Programming\)

#### Intuition:

Bellman\-Ford is a classic dynamic programming algorithm that can be adapted to this problem with modifications to accommodate the stop constraint\.

1.  Use a 2D DP array `dp` where `dp[i][j]` represents the minimum cost to reach city `j` using at most `i` stops\.
2.  Initialize `dp[0][src]` to 0 because starting at the source requires no cost, and the rest to infinity\.
3.  Update costs for flights up to `K+1` times to ensure the number of stops doesn't exceed `K`\.

#### Code:

```java
class Solution {
   public int findCheapestPrice(int n, int[][] flights, int src, int dst, int K) {
       int[][] dp = new int[K + 2][n];
       for (int i = 0; i <= K + 1; i++) {
           Arrays.fill(dp[i], Integer.MAX_VALUE);
       }
       dp[0][src] = 0;
       
       for (int i = 1; i <= K + 1; i++) {
           for (int j = 0; j < n; j++) {
               dp[i][j] = dp[i - 1][j]; // carry forward previous values
           }
           for (int[] flight : flights) {
               int u = flight[0], v = flight[1], w = flight[2];
               if (dp[i - 1][u] != Integer.MAX_VALUE) {
                   dp[i][v] = Math.min(dp[i][v], dp[i - 1][u] + w);
               }
           }
       }
       return dp[K + 1][dst] == Integer.MAX_VALUE ? -1 : dp[K + 1][dst];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(K \* E\) where E is the number of flights, iterating through flights for `K+1` times\.
*   **Space Complexity:** O\(K \* V\) for storing DP table\.

### 3\. Dijkstra's Algorithm

#### Intuition:

A priority queue \(min\-heap\) can help us always extend the least costly current flight path using a variant of Dijkstra's algorithm that's modified to account for the maximum number of allowed stops\.

1.  Use a priority queue to always select the current minimum cost path\.
2.  Keep track of costs and number of stops made\.
3.  If we reach a destination before exceeding `K` stops, we found the solution\.
4.  Use an array to store the minimum cost to reach each city within a certain number of stops\.

#### Code:

```java
class Solution {
   public int findCheapestPrice(int n, int[][] flights, int src, int dst, int K) {
       // PriorityQueue element format {cost, city, stops}
       PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
       Map<Integer, List<int[]>> graph = new HashMap<>();
       
       for (int[] flight : flights) {
           graph.putIfAbsent(flight[0], new ArrayList<>());
           graph.get(flight[0]).add(new int[]{flight[1], flight[2]});
       }
       
       int[] minCost = new int[n];
       Arrays.fill(minCost, Integer.MAX_VALUE);
       pq.offer(new int[]{0, src, 0}); // {cost, city, stops}
       
       while (!pq.isEmpty()) {
           int[] current = pq.poll();
           int cost = current[0];
           int city = current[1];
           int stops = current[2];
           
           // If destination reached with allowed stops
           if (city == dst) return cost;
           
           if (stops <= K) {
               for (int[] next : graph.getOrDefault(city, new ArrayList<>())) {
                   int newCost = cost + next[1];
                   if (newCost < minCost[next[0]]) {
                       minCost[next[0]] = newCost;
                       pq.offer(new int[]{newCost, next[0], stops + 1});
                   }
               }
           }
       }
       return -1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(E log V\)\) where E is the number of flights\. The log factor comes from the priority queue\.
*   **Space Complexity:** O\(V \* E\) due to adjacency list and priority queue\.

#### [Solve it on LeetCode](https://leetcode.com/problems/cheapest-flights-within-k-stops)
