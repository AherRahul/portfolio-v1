---
title: Number of Recent Calls
description: Master Number of Recent Calls in the Queues module. Comprehensive
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

You have a `RecentCounter` class which counts the number of recent requests within a certain time frame\.

Implement the `RecentCounter` class:

*   `RecentCounter()` Initializes the counter with zero recent requests\.
*   `int ping(int t)` Adds a new request at time `t`, where `t` represents some time in milliseconds, and returns the number of requests that has happened in the past `3000` milliseconds \(including the new request\)\. Specifically, return the number of requests that have happened in the inclusive range `[t - 3000, t]`\.

It is **guaranteed** that every call to `ping` uses a strictly larger value of `t` than the previous call\.

##### **Example 1:**

**Input**

\["RecentCounter", "ping", "ping", "ping", "ping"\]

\[\[\], \[1\], \[100\], \[3001\], \[3002\]\]

**Output**

\[null, 1, 2, 3, 3\]

**Explanation**

```java
RecentCounter recentCounter = new RecentCounter();
recentCounter.ping(1);     // requests = [1], range is [-2999,1], return 1
recentCounter.ping(100);   // requests = [1, 100], range is [-2900,100], return 2
recentCounter.ping(3001);  // requests = [1, 100, 3001], range is [1,3001], return 3
recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002], range is [2,3002], return 3
```

##### **Constraints:**

*   **1 <= t <= 10****9**
*   Each test case will call `ping` with **strictly increasing** values of `t`\.
*   At most **10****4** calls will be made to `ping`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-recent-calls)

# Approaches

## 1\. Brute Force with List

#### **Intuition**:

The problem requires us to count the number of calls within a sliding window of 3000 milliseconds\. One straightforward approach is to maintain a list of timestamps and iterate over them to count how many fall within this range each time a new call is added\.

#### **Steps**:

1.  Maintain a list to store each call received in increasing order of time\.
2.  On each call to `ping`, calculate the time window `[t - 3000, t]`\.
3.  Iterate over the list and count how many timestamps fall within this window\.

#### Code:

Java

```java
class RecentCounter {
   private ArrayList<Integer> calls;

   public RecentCounter() {
       // Initialize the list to store timestamps
       calls = new ArrayList<>();
   }

   public int ping(int t) {
       calls.add(t); // Add the current timestamp
       // Define the time window
       int start = t - 3000; 
       int count = 0;
       // Count how many timestamps fall in this window
       for (int time : calls) { 
           if (time >= start && time <= t) {
               count++;
           }
       }
       return count;
   }
}
```

Complexity Analysis

*   **Time Complexity:** Every call takes `O(n)` where `n` is the number of timestamps stored\. This is because we may need to iterate over the list to count\.
*   **Space Complexity:** `O(n)` since we need to store all the timestamps\.

## 2\. Optimized with Queue

#### **Intuition**:

Instead of iterating over all past calls, we can use a queue to efficiently add new timestamps and remove old ones that fall out of the sliding window, maintaining only the relevant timestamps within the queue\.

#### **Steps**:

1.  Use a queue to store timestamps\.
2.  On each call to `ping`, add the current timestamp to the queue\.
3.  Remove timestamps from the front of the queue if they are older than the start of the sliding window `[t - 3000]`\.
4.  The size of the queue at any time will give the count of timestamps in the required range\.

#### Code:

Java

```java
class RecentCounter {
   private Queue<Integer> calls;

   public RecentCounter() {
       // Initialize the queue to store timestamps
       calls = new LinkedList<>();
   }

   public int ping(int t) {
       // Add current timestamp to the queue
       calls.offer(t);
       // Remove timestamps older than (t - 3000)
       while (calls.peek() < t - 3000) {
           calls.poll();
       }
       // The size of the queue represents the number of valid recent calls
       return calls.size();
   }
}
```

Complexity Analysis

*   **Time Complexity:** Each `ping` operation is `O(1)` on average since we are performing operations that affect only the current and the oldest timestamps\.
*   **Space Complexity:** `O(n)` where `n` is the number of timestamps in the last 3000 milliseconds\.