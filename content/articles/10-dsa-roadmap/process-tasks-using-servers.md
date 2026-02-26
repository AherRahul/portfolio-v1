---
title: Process Tasks Using Servers
description: Master Process Tasks Using Servers in the Heaps module.
  Comprehensive guide and algorithmic problem solving.
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

You are given two **0\-indexed** integer arrays `servers` and `tasks` of lengths `n`​​​​​​ and `m`​​​​​​ respectively\. `servers[i]` is the **weight** of the **i****​​​​​​th**​​​​ server, and `tasks[j]` is the **time needed** to process the **j****​​​​​​th**​​​​ task **in seconds**\.

Tasks are assigned to the servers using a **task queue**\. Initially, all servers are free, and the queue is **empty**\.

At second `j`, the **j****th** task is **inserted** into the queue \(starting with the **0****th** task being inserted at second `0`\)\. As long as there are free servers and the queue is not empty, the task in the front of the queue will be assigned to a free server with the **smallest weight**, and in case of a tie, it is assigned to a free server with the **smallest index**\.

If there are no free servers and the queue is not empty, we wait until a server becomes free and immediately assign the next task\. If multiple servers become free at the same time, then multiple tasks from the queue will be assigned **in order of insertion** following the weight and index priorities above\.

A server that is assigned task `j` at second `t` will be free again at second `t + tasks[j]`\.

Build an array `ans`​​​​ of length `m`, where `ans[j]` is the **index** of the server the **j****​​​​​​th** task will be assigned to\.

Return _the array_ `ans`​​​​\.

##### **Example 1:**

**Input:** servers = \[3,3,2\], tasks = \[1,2,3,2,1,2\]

**Output:** \[2,2,0,2,1,2\]

**Explanation:** Events in chronological order go as follows:

\- At second 0, task 0 is added and processed using server 2 until second 1\.

\- At second 1, server 2 becomes free\. Task 1 is added and processed using server 2 until second 3\.

\- At second 2, task 2 is added and processed using server 0 until second 5\.

\- At second 3, server 2 becomes free\. Task 3 is added and processed using server 2 until second 5\.

\- At second 4, task 4 is added and processed using server 1 until second 5\.

\- At second 5, all servers become free\. Task 5 is added and processed using server 2 until second 7\.

##### **Example 2:**

**Input:** servers = \[5,1,4,3,2\], tasks = \[2,1,2,4,5,2,1\]

**Output:** \[1,4,1,4,1,3,2\]

**Explanation:** Events in chronological order go as follows:

\- At second 0, task 0 is added and processed using server 1 until second 2\.

\- At second 1, task 1 is added and processed using server 4 until second 2\.

\- At second 2, servers 1 and 4 become free\. Task 2 is added and processed using server 1 until second 4\.

\- At second 3, task 3 is added and processed using server 4 until second 7\.

\- At second 4, server 1 becomes free\. Task 4 is added and processed using server 1 until second 9\.

\- At second 5, task 5 is added and processed using server 3 until second 7\.

\- At second 6, task 6 is added and processed using server 2 until second 7\. 

##### **Constraints:**

*   **servers\.length == n**
*   **tasks\.length == m**
*   **1 <= n, m <= 2 \* 10****5**
*   **1 <= servers\[i\], tasks\[j\] <= 2 \* 10****5**

#### [Solve it on LeetCode](https://leetcode.com/problems/process-tasks-using-servers)

# Approaches

## 1\. Brute\-force Simulation

#### Intuition:

In a brute\-force simulation approach, we can use an array to keep track of each server's availability\. For each task, we iterate through the list of servers to find an available one\. If none are available, we hold off the task until a server becomes free\. This direct simulation is simple but not efficient because checking each server for availability takes linear time\.

#### Steps:

1.  Use an array to represent available servers\. Initialize it all to zero, representing that all servers are initially free\.
2.  Iterate over each task:

*   Check all servers to find an available one\. Mark the server as busy for the duration of the task\.
*   If no server is free, wait until the earliest available server becomes free\.

4.  Summarize the task allocation to servers\.

#### Code:

Java

```java
class Solution {
   public int[] assignTasks(int[] servers, int[] tasks) {
       int numServers = servers.length;
       int numTasks = tasks.length;
       
       // Save the completion time of servers
       int[] serverEnds = new int[numServers];
       int[] result = new int[numTasks];
       
       for (int i = 0; i < numTasks; i++) {
           int task = tasks[i];
           int availableServerIndex = -1;
           
           // Find the earliest available server
           for (int j = 0; j < numServers; j++) {
               if (i >= serverEnds[j]) {
                   if (availableServerIndex == -1 || servers[j] < servers[availableServerIndex] ||
                       (servers[j] == servers[availableServerIndex] && j < availableServerIndex)) {
                       availableServerIndex = j;
                   }
               }
           }
           
           // No server is available, need to wait
           if (availableServerIndex == -1) {
               int earliestServerEndTime = Integer.MAX_VALUE;
               for (int j = 0; j < numServers; j++) {
                   if (serverEnds[j] < earliestServerEndTime) {
                       earliestServerEndTime = serverEnds[j];
                       availableServerIndex = j;
                   }
               }
           }
           
           // Assign the task to the selected server
           result[i] = availableServerIndex;
           serverEnds[availableServerIndex] = Math.max(serverEnds[availableServerIndex], i) + task;
       }
       
       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \* k\) where n is the number of tasks and k is the number of servers\.
*   **Space Complexity:** O\(k\) for keeping track of the state of each server\.

## 2\. Priority Queues for Efficient Assignment

#### Intuition:

The brute\-force approach makes a key observation: it often checks all servers unnecessarily\. We can optimize this using two priority queues:

*   One for free servers, sorted by their weight and index\.
*   Another for busy servers, including when they become available again\.

With these queues, tasks can be assigned more efficiently by popping from the priority queue\.

#### Steps:

1.  Create two priority queues: one for available servers and one for busy servers\.
2.  Iterate over tasks, and for each task, update the queue of busy servers to free any that have completed their tasks\.
3.  Check the available servers queue\. Assign the task to the server with the smallest weight and index\.
4.  If no servers are free, update the next server that becomes available by waiting\.

#### Code:

Java

```java
class Solution {
   public int[] assignTasks(int[] servers, int[] tasks) {
       int n = servers.length;
       int m = tasks.length;
       int[] result = new int[m];

       // PriorityQueue for available and busy servers
       PriorityQueue<int[]> available = new PriorityQueue<>(Comparator.comparingInt((int[] a) -> a[0]).thenComparingInt(a -> a[1]));
       PriorityQueue<int[]> busy = new PriorityQueue<>(Comparator.comparingInt((int[] a) -> a[0]));

       for (int i = 0; i < n; i++) {
           available.offer(new int[] {servers[i], i});
       }

       int time = 0;
       for (int i = 0; i < m; i++) {
           time = Math.max(time, i);

           // Release servers that are no longer busy
           while (!busy.isEmpty() && busy.peek()[0] <= time) {
               int[] server = busy.poll();
               available.offer(new int[] {servers[server[1]], server[1]});
           }

           // If no servers are available, jump the time to the next server free time
           if (available.isEmpty()) {
               time = busy.peek()[0];
               while (!busy.isEmpty() && busy.peek()[0] <= time) {
                   int[] server = busy.poll();
                   available.offer(new int[] {servers[server[1]], server[1]});
               }
           }

           int[] server = available.poll();
           result[i] = server[1];
           busy.offer(new int[] {time + tasks[i], server[1]});
       }

       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** **O\(\(n \+ k\) \* log k\)**, as each task may involve operations in the priority queue\.
*   **Space Complexity:** **O\(k\)**, for maintaining server state\.