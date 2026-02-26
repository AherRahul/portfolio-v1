---
title: Non-overlapping Intervals
description: Master Non-overlapping Intervals in the Intervals module.
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

Given an array of intervals `intervals` where **intervals\[i\] = \[start****i****, end****i****\]**, return _the minimum number of intervals you need to remove to make the rest of the intervals non\-overlapping_\.

**Note** that intervals which only touch at a point are **non\-overlapping**\. For example, `[1, 2]` and `[2, 3]` are non\-overlapping\.

##### **Example 1:**

**Input:** intervals = \[\[1,2\],\[2,3\],\[3,4\],\[1,3\]\]

**Output:** 1

**Explanation:** \[1,3\] can be removed and the rest of the intervals are non\-overlapping\.

##### **Example 2:**

**Input:** intervals = \[\[1,2\],\[1,2\],\[1,2\]\]

**Output:** 2

**Explanation:** You need to remove two \[1,2\] to make the rest of the intervals non\-overlapping\.

##### **Example 3:**

**Input:** intervals = \[\[1,2\],\[2,3\]\]

**Output:** 0**Explanation:** You don't need to remove any of the intervals since they're already non\-overlapping\.

##### **Constraints:**

*   **1 <= intervals\.length <= 10****5**
*   **intervals\[i\]\.length == 2**
*   **\-5 \* 10****4** **<= start****i** **< end****i** **<= 5 \* 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/non-overlapping-intervals)

# Approaches

## 1\. Brute Force Approach

#### Intuition:

The initial approach involves checking each pair of intervals to determine if they overlap\. If an overlap is detected, remove one of the intervals and continue\. This method, while straightforward, is not efficient, especially for large inputs, as it involves comparing each interval with every other interval\.

#### Steps:

1.  Sort the intervals based on the starting point\.
2.  Use two nested loops\. The outer loop picks an interval, and the inner loop checks for overlaps with subsequent intervals\.
3.  If an overlap is found, increment a counter to indicate a removal\.
4.  Remove the interval that ends later to increase the chance of allowing future intervals to fit without overlap\.

#### Code:

Java

```java
class Solution {
   public int eraseOverlapIntervals(int[][] intervals) {
       if (intervals.length == 0) return 0;

       // Sort intervals based on the start time
       Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

       int count = 0;

       // Compare each interval with the next
       for (int i = 0; i < intervals.length - 1; i++) {
           // If the current interval ends before the next one starts, they do not overlap
           if (intervals[i][1] > intervals[i + 1][0]) {
               count++;
               // Remove interval with the larger end time
               intervals[i + 1] = new int[] {intervals[i][0], Math.min(intervals[i][1], intervals[i + 1][1])};
           }
       }

       return count;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\), as we may compare each pair of intervals\.
*   **Space Complexity:** O\(n\) due to sorting and temporary data structures\.

## 2\. Optimized Greedy Approach

#### Intuition:

An improved approach leverages a greedy algorithm\. By sorting intervals by their end time and then iterating through them, we can quickly identify and count needs for removal, aiming to minimize the number of intervals removed while maximizing the number of non\-overlapping intervals\.

#### Steps:

1.  Sort the intervals by the end time to efficiently find the optimal position to 'cut' the intervals\.
2.  Initialize a counter for removals and set a variable for the end of the last added interval\.
3.  Traverse the sorted intervals and check if the current interval overlaps with the last non\-overlapping interval\.
4.  If overlapped, increment the removal counter; otherwise, update the end point to the current interval’s end time\.

#### Code:

Java

```java
class Solution {
   public int eraseOverlapIntervals(int[][] intervals) {
       // Edge case
       if (intervals.length == 0) return 0;
       
       // Sort intervals by end time
       Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
       
       int end = intervals[0][1];
       int count = 0;
       
       for (int i = 1; i < intervals.length; i++) {
           // If the current interval starts before the last non-overlapping interval ends
           if (intervals[i][0] < end) {
               count++;  // It overlaps, increment the remover counter
           } else {
               end = intervals[i][1];  // No overlap, update end to current interval's end
           }
       }
       
       return count;  // Minimum number of intervals needed to remove
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n log n\), mainly due to the sorting step\.
*   **Space Complexity:** O\(1\), as we are using only a constant amount of extra space\.