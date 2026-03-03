---
title: Maximum Profit in Job Scheduling
description: Master Maximum Profit in Job Scheduling in the Dynamic Programming
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

We have `n` jobs, where every job is scheduled to be done from `startTime[i]` to `endTime[i]`, obtaining a profit of `profit[i]`\.

You're given the `startTime`, `endTime` and `profit` arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range\.

If you choose a job that ends at time `X` you will be able to start another job that starts at time `X`\.

##### **Example 1:**

**Input:** startTime = \[1,2,3,3\], endTime = \[3,4,5,6\], profit = \[50,10,40,70\]

**Output:** 120

**Explanation:** The subset chosen is the first and fourth job\.

Time range \[1\-3\]\+\[3\-6\] , we get profit of 120 = 50 \+ 70\.

##### **Example 2:**

**Input:** startTime = \[1,2,3,4,6\], endTime = \[3,5,10,6,9\], profit = \[20,20,100,70,60\]

**Output:** 150

**Explanation:** The subset chosen is the first, fourth and fifth job\.

Profit obtained 150 = 20 \+ 70 \+ 60\.

##### **Example 3:**

**Input:** startTime = \[1,1,1\], endTime = \[2,3,4\], profit = \[5,6,4\]

**Output:** 6

##### **Constraints:**

*   **1 <= startTime\.length == endTime\.length == profit\.length <= 5 \* 10****4**
*   **1 <= startTime\[i\] < endTime\[i\] <= 10****9**
*   **1 <= profit\[i\] <= 10****4**


## Approaches

### 1\. Recursion with Memoization \(Dynamic Programming\)

#### Intuition:

The problem can be broken down into deciding which jobs to take to maximize the profit\. For each job, you have a choice of either taking the job or skipping it\. If you take the job, you cannot take any other jobs overlapping with it\. Dynamic programming with memoization helps avoid recalculating results of overlapping subproblems\.

#### Steps:

1.  **Sort Jobs by End Time**: This will allow us to process jobs in a logical order \(left to right in scheduling terms\)\.
2.  **Use Dynamic Programming with Recursion**:

*   Define a recursive function `maxProfit(index)` that returns the maximum profit starting from the job at `index`\.
*   Check two cases:

1.  Skip the current job and call `maxProfit(index + 1)`\.
2.  Include the current job, find the next job that can start after the current job ends using binary search, and call `maxProfit(nextIndex)`\.

*   Use memoization to store and reuse results for each `index`\.

#### Code:

```java
class Job {
   int start, end, profit;
   
   Job(int start, int end, int profit) {
       this.start = start;
       this.end = end;
       this.profit = profit;
   }
}

class Solution {
   public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
       int n = startTime.length;
       Job[] jobs = new Job[n];
       
       // Create job objects for easy handling
       for (int i = 0; i < n; i++) {
           jobs[i] = new Job(startTime[i], endTime[i], profit[i]);
       }
       
       // Sort jobs based on their ending time for easy scheduling
       Arrays.sort(jobs, Comparator.comparingInt(job -> job.end));
       
       // Memoization array for storing maximum profit at each position
       int[] memo = new int[n];
       Arrays.fill(memo, -1);
       
       return maxProfit(0, jobs, memo);
   }
   
   private int maxProfit(int index, Job[] jobs, int[] memo) {
       if (index >= jobs.length) return 0;
       
       if (memo[index] != -1) return memo[index];
       
       // Find next non-conflicting job using binary search
       int nextIndex = findNextJob(index, jobs);
       
       // Calculate max profit if we take or skip current job
       int takeJob = jobs[index].profit + maxProfit(nextIndex, jobs, memo);
       int skipJob = maxProfit(index + 1, jobs, memo);
       
       // Memoize the result for current index
       return memo[index] = Math.max(takeJob, skipJob);
   }
   
   private int findNextJob(int index, Job[] jobs) {
       int low = index + 1, high = jobs.length;
       while (low < high) {
           int mid = low + (high - low) / 2;
           if (jobs[mid].start < jobs[index].end) {
               low = mid + 1;
           } else {
               high = mid;
           }
       }
       return low;
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(n log n\) due to sorting and binary search for each job\.
*   **Space Complexity**: O\(n\) for the memoization array\.

### 2\. Iterative Dynamic Programming Using Sorting and Binary Search

#### Intuition:

Instead of using recursion, this approach uses an iterative method to build up solutions for every job from left to right\. The addition of binary search helps in quickly finding the next available job that doesn't overlap with the current job\.

#### Steps**:**

1.  **Sort Jobs by End Time**: Same as before, sort jobs to handle them in scheduling order\.
2.  **Dynamic Array** `**dp**`: `dp[i]` holds the maximum profit considering jobs up to `i`\.
3.  **Iterate Over Each Job**:

*   Use binary search to find the maximum profit of the non\-overlapping job\.
*   Update `dp[i]` by comparing the addition of the current job's profit and the maximum profit of the last non\-overlapping job with `dp[i-1]`\.

#### Code:

```java
class Solution {
   public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
       int n = startTime.length;
       Job[] jobs = new Job[n];
       
       for (int i = 0; i < n; i++) {
           jobs[i] = new Job(startTime[i], endTime[i], profit[i]);
       }
       
       Arrays.sort(jobs, (a, b) -> a.end - b.end);
       
       int[] dp = new int[n];
       dp[0] = jobs[0].profit;
       
       for (int i = 1; i < n; i++) {
           int includeProfit = jobs[i].profit;
           int l = binarySearch(jobs, i);
           if (l != -1) {
               includeProfit += dp[l];
           }
           dp[i] = Math.max(includeProfit, dp[i - 1]);
       }
       
       return dp[n - 1];
   }
   
   private int binarySearch(Job[] jobs, int index) {
       int low = 0, high = index - 1;
       while (low <= high) {
           int mid = low + (high - low) / 2;
           if (jobs[mid].end <= jobs[index].start) {
               if (jobs[mid + 1].end <= jobs[index].start) {
                   low = mid + 1;
               } else {
                   return mid;
               }
           } else {
               high = mid - 1;
           }
       }
       return -1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(n log n\) due to sorting and binary search for each job\.
*   **Space Complexity**: O\(n\) for maintaining the dynamic programming table\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-profit-in-job-scheduling)
