---
title: Number of Ways to Arrive at Destination
description: Master Number of Ways to Arrive at Destination in the Dynamic
  Programming module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are in a city that consists of `n` intersections numbered from `0` to `n - 1` with **bi\-directional** roads between some intersections\. The inputs are generated such that you can reach any intersection from any other intersection and that there is at most one road between any two intersections\.

You are given an integer `n` and a 2D integer array `roads` where **roads\[i\] = \[u****i****, v****i****, time****i****\]** means that there is a road between intersections **u****i** and **v****i** that takes **time****i** minutes to travel\. You want to know in how many ways you can travel from intersection `0` to intersection `n - 1` in the **shortest amount of time**\.

Return _the_ _**number of ways**_ _you can arrive at your destination in the_ _**shortest amount of time**_\. Since the answer may be large, return it **modulo** **10****9** **\+ 7**\.

##### **Example 1:**

**Input:** n = 7, roads = \[\[0,6,7\],\[0,1,2\],\[1,2,3\],\[1,3,3\],\[6,3,3\],\[3,5,1\],\[6,5,1\],\[2,5,1\],\[0,4,5\],\[4,6,2\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
  </div>
</div>

**Output:** 4

**Explanation:** The shortest amount of time it takes to go from intersection 0 to intersection 6 is 7 minutes\.

The four ways to get there in 7 minutes are:

\- 0 ➝ 6

\- 0 ➝ 4 ➝ 6

\- 0 ➝ 1 ➝ 2 ➝ 5 ➝ 6

\- 0 ➝ 1 ➝ 3 ➝ 5 ➝ 6

##### **Example 2:**

**Input:** n = 2, roads = \[\[1,0,10\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
    </div>
  </div>
</div>

**Output:** 1

**Explanation:** There is only one way to go from intersection 0 to intersection 1, and it takes 10 minutes\.

##### **Constraints:**

*   **1 <= n <= 200**
*   **n \- 1 <= roads\.length <= n \* \(n \- 1\) / 2**
*   **roads\[i\]\.length == 3**
*   **0 <= u****i****, v****i** **<= n \- 1**
*   **1 <= time****i** **<= 10****9**
*   **u****i** **\!= v****i**
*   There is at most one road connecting any two intersections\.
*   You can reach any intersection from any other intersection\.


## Approaches

### 1\. Dijkstra's Algorithm with DFS

#### Intuition:

In this approach, we'll use the famous Dijkstra's Algorithm to find the shortest path from the source to the destination\. After finding the shortest path, we can perform a DFS from the destination to the source to count all the possible paths matching this shortest path length\. This approach is still efficient for the input size allowed by the problem constraints\.

#### Algorithm:

1.  Utilize Dijkstra's Algorithm to ensure all minimum weights from the source to all other nodes\.
2.  Once the shortest path weights are captured, use DFS from the destination to the source counting all possible paths that equal this shortest path weight\.
3.  Ensure to mod the result by \(10^9 \+ 7\)\.

#### Code:

```java
class Solution {
   private static final int MOD = 1_000_000_007;

   public int countPaths(int n, int[][] roads) {
       List<List<int[]>> graph = new ArrayList<>();
       for (int i = 0; i < n; i++) {
           graph.add(new ArrayList<>());
       }
       for (int[] road : roads) {
           int u = road[0], v = road[1], w = road[2];
           graph.get(u).add(new int[]{v, w});
           graph.get(v).add(new int[]{u, w});
       }

       long[] dist = new long[n];
       Arrays.fill(dist, Long.MAX_VALUE);
       dist[0] = 0;
       PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[1]));
       pq.offer(new int[]{0, 0});

       while (!pq.isEmpty()) {
           int[] pair = pq.poll();
           int node = pair[0];
           long currDist = pair[1];

           if (currDist > dist[node]) continue;

           for (int[] nei : graph.get(node)) {
               int neighbor = nei[0];
               long time = nei[1];

               if (dist[node] + time < dist[neighbor]) {
                   dist[neighbor] = dist[node] + time;
                   pq.offer(new int[]{neighbor, (int) dist[neighbor]});
               }
           }
       }

       return dfs(n - 1, graph, new long[n], dist, dist[n - 1]);
   }

   private int dfs(int node, List<List<int[]>> graph, long[] dp, long[] dist, long targetDist) {
       if (node == 0) return 1;
       if (dp[node] != 0) return (int) dp[node];

       long count = 0;
       for (int[] nei : graph.get(node)) {
           int neighbor = nei[0], time = nei[1];
           if (dist[node] == dist[neighbor] + time) {
               count = (count + dfs(neighbor, graph, dp, dist, targetDist)) % MOD;
           }
       }

       dp[node] = count;
       return (int) count;
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(E log V\), where E is the number of roads and V is the number of cities\.
*   **Space Complexity**: O\(V \+ E\) due to the adjacency list and other data structures used\.

### 2\. Dijkstra's Algorithm with Dynamic Programming

#### Intuition:

In this approach, instead of using DFS to count paths after Dijkstra's, we integrate the counting mechanism into Dijkstra’s Algorithm itself\. This involves maintaining a separate array to count the number of ways to reach each node, updating it as we discover the shortest paths\.

#### Algorithm:

1.  Use Dijkstra's Algorithm to compute both the shortest distances and count ways dynamically\.
2.  Maintain an array to track the number of ways to reach a node when processing its neighbors in the priority queue\.
3.  If a shorter path found to a node, update the path count to that node as that of the current node\.
4.  If another equal shortest path found, add the current node's path count to that node's path count\.

#### Code:

```java
class Solution {    
   private static final int MOD = 1_000_000_007;

   public int countPaths(int n, int[][] roads) {
       List<List<int[]>> graph = new ArrayList<>();
       for (int i = 0; i < n; i++) {
           graph.add(new ArrayList<>());
       }
       for (int[] road : roads) {
           int u = road[0], v = road[1], w = road[2];
           graph.get(u).add(new int[]{v, w});
           graph.get(v).add(new int[]{u, w});
       }

       long[] dist = new long[n];
       int[] ways = new int[n];
       Arrays.fill(dist, Long.MAX_VALUE);
       dist[0] = 0;
       ways[0] = 1;
       
       PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[1]));
       pq.offer(new int[]{0, 0});

       while (!pq.isEmpty()) {
           int[] pair = pq.poll();
           int node = pair[0];
           long currDist = pair[1];

           if (currDist > dist[node]) continue;

           for (int[] nei : graph.get(node)) {
               int neighbor = nei[0];
               long time = nei[1];

               if (dist[node] + time < dist[neighbor]) {
                   dist[neighbor] = dist[node] + time;
                   pq.offer(new int[]{neighbor, (int) dist[neighbor]});
                   ways[neighbor] = ways[node];
               } else if (dist[node] + time == dist[neighbor]) {
                   ways[neighbor] = (ways[neighbor] + ways[node]) % MOD;
               }
           }
       }

       return ways[n - 1];
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(E log V\), where E is the number of roads and V is the number of cities\. The performance is similar to standard Dijkstra due to the priority queue\.
*   **Space Complexity**: O\(V \+ E\), stemming from the adjacency list representation and extra counting array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination)
