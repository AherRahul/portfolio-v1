---
title: Bus Routes
description: Master Bus Routes in the Graphs module. Comprehensive guide and
  algorithmic problem solving.
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

You are given an array `routes` representing bus routes where `routes[i]` is a bus route that the `i``th` bus repeats forever\.

*   For example, if `routes[0] = [1, 5, 7]`, this means that the `0``th` bus travels in the sequence `1 -> 5 -> 7 -> 1 -> 5 -> 7 -> 1 -> ...` forever\.

You will start at the bus stop `source` \(You are not on any bus initially\), and you want to go to the bus stop `target`\. You can travel between bus stops by buses only\.

Return _the least number of buses you must take to travel from_ `source` _to_ `target`\. Return `-1` if it is not possible\.

##### **Example 1:**

**Input:** routes = \[\[1,2,7\],\[3,6,7\]\], source = 1, target = 6

**Output:** 2

**Explanation:** The best strategy is take the first bus to the bus stop 7, then take the second bus to the bus stop 6\.

##### **Example 2:**

**Input:** routes = \[\[7,12\],\[4,5,15\],\[6\],\[15,19\],\[9,12,13\]\], source = 15, target = 12**Output:** \-1

##### **Constraints:**

*   **1 <= routes\.length <= 500\.**
*   **1 <= routes\[i\]\.length <= 10****5**
*   All the values of `routes[i]` are **unique**\.
*   **sum\(routes\[i\]\.length\) <= 10****5**
*   **0 <= routes\[i\]\[j\] < 10****6**
*   **0 <= source, target < 10****6**

#### [Solve it on LeetCode](https://leetcode.com/problems/bus-routes)

# Approaches

## 1\. Breadth\-First Search \(BFS\)

#### Intuition:

This problem can be visualized as finding the shortest path in an unweighted graph\. Each route can be considered as a node, and there is an edge between two nodes if they share at least one bus stop\. The task is to determine the minimum number of buses needed to travel from the `source` to the `target`\. Here’s the breakdown:

1.  **Graph Representation**: Use each route as a node\. Routes are connected if they share a common bus stop\.
2.  **BFS Traversal**: Utilize BFS to ensure the minimum transfer path is found\.
3.  **Starting Points**: Begin from all the routes that contain the `source`\.
4.  **Destination Condition**: Stop when any route containing the `target` is reached in the BFS traversal\.

#### Code:

Java

```java
class Solution {
   public int numBusesToDestination(int[][] routes, int source, int target) {
       if (source == target) return 0;

       // Map to track which bus routes are available for each stop
       Map<Integer, List<Integer>> stopToRoutesMap = new HashMap<>();
       
       // Fill the map with stop to routes associations
       for (int i = 0; i < routes.length; i++) {
           for (int stop : routes[i]) {
               if (!stopToRoutesMap.containsKey(stop)) {
                   stopToRoutesMap.put(stop, new ArrayList<>());
               }
               stopToRoutesMap.get(stop).add(i);
           }
       }

       // Use a queue for BFS, each entry is a pair of route index and buses taken so far
       Queue<int[]> queue = new LinkedList<>();
       // Track visited routes to avoid cycles
       boolean[] visited = new boolean[routes.length];

       // Add all routes starting with the source stop
       for (int route : stopToRoutesMap.getOrDefault(source, new ArrayList<>())) {
           queue.offer(new int[]{route, 1});
           visited[route] = true;
       }

       // Begin BFS
       while (!queue.isEmpty()) {
           int[] curr = queue.poll();
           int routeIndex = curr[0];
           int busesTaken = curr[1];

           // Inspect each stop in current route
           for (int stop : routes[routeIndex]) {
               // Check if we've reached the target
               if (stop == target) return busesTaken;

               // Check all neighboring routes of the current stop
               for (int nextRoute : stopToRoutesMap.getOrDefault(stop, new ArrayList<>())) {
                   if (!visited[nextRoute]) {
                       queue.offer(new int[]{nextRoute, busesTaken + 1});
                       visited[nextRoute] = true;
                   }
               }
           }
       }

       return -1; // Target is unreachable
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N \+ S\) where N is the total number of bus routes and S is the total number of bus stops\. Each stop to route association is examined once\.
*   **Space Complexity:** O\(N \+ S\)\. We store mappings for each stop to their corresponding routes and a visited list for routes\.