---
title: Network Delay Time
description: Master Network Delay Time in the Graphs module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are given a network of `n` nodes, labeled from `1` to `n`\. You are also given `times`, a list of travel times as directed edges **times\[i\] = \(u****i****, v****i****, w****i****\)**, where **u****i** is the source node, **v****i** is the target node, and **w****i** is the time it takes for a signal to travel from source to target\.

We will send a signal from a given node `k`\. Return _the_ _**minimum**_ _time it takes for all the_ `n` _nodes to receive the signal_\. If it is impossible for all the `n` nodes to receive the signal, return `-1`\.

##### **Example 1:**

**Input:** times = \[\[2,1,1\],\[2,3,1\],\[3,4,1\]\], n = 4, k = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** 2

##### **Example 2:**

**Input:** times = \[\[1,2,1\]\], n = 2, k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** 1

##### **Example 3:**

**Input:** times = \[\[1,2,1\]\], n = 2, k = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** \-1

##### **Constraints:**

*   **1 <= k <= n <= 100**
*   **1 <= times\.length <= 6000**
*   **times\[i\]\.length == 3**
*   **1 <= u****i****, v****i** **<= n**
*   **u****i** **\!= v****i**
*   **0 <= w****i** **<= 100**
*   **All the pairs \(u****i****, v****i****\) are unique\. \(i\.e\., no multiple edges\.\)**


## Approaches

### 1\. Dijkstra's Algorithm

#### Intuition:

Dijkstra’s algorithm is a classic approach to find the shortest paths from a single source node to all other nodes in a graph with non\-negative edge weights\. By using a priority queue, we can efficiently choose the next node to process based on the smallest known distance\.

#### Steps:

1.  **Graph Representation**: We first represent the graph using an adjacency list where each node points to its neighbors along with the time taken to reach them\.
2.  **Priority Queue \(Min\-Heap\)**: Initialize a min\-heap that will store elements as pairs of \(time, node\)\. The heap will prioritize nodes with smaller times\.
3.  **Distance Table**: Create a distance table initialized with infinity \(`Integer.MAX_VALUE`\) values to represent the shortest time \(distance\) from source `K` to each node\. Set the distance to the source node `K` as 0\.
4.  **Processing Nodes**:

*   While the priority queue is not empty, remove the node with the smallest time\.
*   For each neighbor of the current node, calculate the new time to reach that neighbor\.
*   If this new time is smaller than the previously recorded time in the distance table, update the table and add the neighbor to the priority queue\.

6.  **Finding the Result**: The result is the maximum value from the distance table\. If there's any node that remains at infinity, it means it's unreachable from the source `K`\.

#### Code:

```java
class Solution {
   public int networkDelayTime(int[][] times, int N, int K) {
       Map<Integer, List<int[]>> graph = new HashMap<>();
       for (int[] time : times) {
           graph.computeIfAbsent(time[0], k -> new ArrayList<>()).add(new int[]{time[1], time[2]});
       }

       // Priority queue: (time, node)
       PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
       pq.add(new int[]{0, K});
       
       // Distance table
       Map<Integer, Integer> dist = new HashMap<>();
       dist.put(K, 0);
       
       while (!pq.isEmpty()) {
           int[] current = pq.poll();
           int currentTime = current[0];
           int currentNode = current[1];
           
           if (!graph.containsKey(currentNode)) {
               continue;
           }
           
           // Process neighbors
           for (int[] neighbor : graph.get(currentNode)) {
               int nextNode = neighbor[0];
               int timeToNext = neighbor[1];
               int newTime = currentTime + timeToNext;
               
               if (newTime < dist.getOrDefault(nextNode, Integer.MAX_VALUE)) {
                   dist.put(nextNode, newTime);
                   pq.add(new int[]{newTime, nextNode});
               }
           }
       }
       
       int maxDelay = 0;
       for (int delay : dist.values()) {
           maxDelay = Math.max(maxDelay, delay);
       }
       
       return dist.size() == N ? maxDelay : -1; // If not all nodes are reachable, return -1
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** `O(E log V)`, where `E` is the number of edges and `V` is the number of vertices, due to the heap operations\.
*   **Space Complexity:** `O(V + E)`, for storing the graph and the distance table\.

### 2\. Bellman\-Ford Algorithm

#### Intuition:

The Bellman\-Ford algorithm is another method to compute the shortest paths from a single source node to all other nodes in a graph, and it can handle negative weights\. It repetitively relaxes all edges, updating the shortest paths\.

#### Steps:

1.  **Initialize Distance Array**: Create a distance array with all nodes initially set to infinity \(`Integer.MAX_VALUE`\), except for the source node `K` which is set to 0\.
2.  **Relax Edges N\-1 Times**:

*   For each edge from `u` to `v` with weight `w`, if the current distance to `u` plus `w` is less than the distance to `v`, update the distance to `v`\.

4.  **Checking for Negative Cycles**: \(Not required for this problem since edge weights are non\-negative\)

*   Run the relaxation step once more to check for improvements, which indicate negative cycles\. For this problem, it can be skipped as all weights are positive\.

6.  **Determine the Result**: Find the maximum time in the distance array\. If all nodes are reachable, return this maximum time; otherwise, return `-1`\.

#### Code:

```java
class Solution {
   public int networkDelayTime(int[][] times, int N, int K) {
       int[] dist = new int[N + 1];
       Arrays.fill(dist, Integer.MAX_VALUE);
       dist[K] = 0;
       
       // Relax edges N-1 times
       for (int i = 0; i < N - 1; ++i) {
           for (int[] edge : times) {
               int u = edge[0];
               int v = edge[1];
               int w = edge[2];
               if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                   dist[v] = dist[u] + w;
               }
           }
       }
       
       // Find the maximum time to reach any node
       int maxDelay = Integer.MIN_VALUE;
       for (int i = 1; i <= N; ++i) {
           maxDelay = Math.max(maxDelay, dist[i]);
       }
       
       return maxDelay == Integer.MAX_VALUE ? -1 : maxDelay;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** `O(V * E)`, as each of the `V` vertices requires `E` edge relaxations\.
*   **Space Complexity:** `O(V)`, as we only maintain a simple distance array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/network-delay-time)
