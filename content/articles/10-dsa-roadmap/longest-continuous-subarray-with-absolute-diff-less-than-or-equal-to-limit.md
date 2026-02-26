---
title: Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
description: Master Longest Continuous Subarray With Absolute Diff Less Than or
  Equal to Limit in the Queues module. Comprehensive guide and algorithmic
  problem solving.
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

Given an array of integers `nums` and an integer `limit`, return the size of the longest **non\-empty** subarray such that the absolute difference between any two elements of this subarray is less than or equal to `limit`_\._

##### **Example 1:**

**Input:** nums = \[8,2,4,7\], limit = 4

**Output:** 2

**Explanation:** All subarrays are:

\[8\] with maximum absolute diff |8\-8| = 0 <= 4\.

\[8,2\] with maximum absolute diff |8\-2| = 6 > 4\.

\[8,2,4\] with maximum absolute diff |8\-2| = 6 > 4\.

\[8,2,4,7\] with maximum absolute diff |8\-2| = 6 > 4\.

\[2\] with maximum absolute diff |2\-2| = 0 <= 4\.

\[2,4\] with maximum absolute diff |2\-4| = 2 <= 4\.

\[2,4,7\] with maximum absolute diff |2\-7| = 5 > 4\.

\[4\] with maximum absolute diff |4\-4| = 0 <= 4\.

\[4,7\] with maximum absolute diff |4\-7| = 3 <= 4\.

\[7\] with maximum absolute diff |7\-7| = 0 <= 4\. Therefore, the size of the longest subarray is 2\.

##### **Example 2:**

**Input:** nums = \[10,1,2,4,7,2\], limit = 5

**Output:** 4

**Explanation:** The subarray \[2,4,7,2\] is the longest since the maximum absolute diff is |2\-7| = 5 <= 5\.

##### **Example 3:**

**Input:** nums = \[4,2,2,2,4,4,2,2\], limit = 0

**Output:** 3

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **1 <= nums\[i\] <= 10****9**
*   **0 <= limit <= 10****9**

#### [Solve it on LeetCode](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit)

# Approaches

## 1\. Brute Force

#### Intuition:

The simplest way to solve this problem is by checking every possible subarray and verifying if it meets the condition, i\.e\., its maximum and minimum difference is less than or equal to the given limit\. This involves calculating the max and min for all subarrays which can be computationally expensive but forms the foundation of understanding the problem\.

#### Steps:

1.  Iterate over each starting index of a subarray\.
2.  For each starting index, iterate over each possible ending index, maintaining the current maximum and minimum in the subarray\.
3.  If at any point the difference between the maximum and minimum exceeds the limit, move to the next starting index\.
4.  Keep track of the length of the longest valid subarray found\.

#### Code:

Java

```java
class Solution {
   public int longestSubarray(int[] nums, int limit) {
       int n = nums.length;
       int maxLen = 0;
       
       // Check every possible subarray
       for (int start = 0; start < n; start++) {
           int max = nums[start];
           int min = nums[start];
           for (int end = start; end < n; end++) {
               // Update max and min in the current subarray
               max = Math.max(max, nums[end]);
               min = Math.min(min, nums[end]);
               
               // Check if the condition is met
               if (max - min <= limit) {
                   maxLen = Math.max(maxLen, end - start + 1);
               } else {
                   break;
               }
           }
       }
       return maxLen;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N^2\) \- All possible subarrays are considered, each requiring potentially a scan from start to end\.
*   **Space Complexity:** O\(1\) \- Only a few integer variables utilized for computation\.

## 2\. Optimized Sliding Window with Two Deques

#### Intuition:

The brute force solution is inefficient due to redundant checks for the max and min\. A more optimal solution can maintain a sliding window of elements, while keeping the current maximum and minimum within this window through deques\. As the sliding window expands, the deques are used to update and maintain the max and min efficiently\.

#### Steps:

1.  Use two deques to store the indices of the elements\. One deque stores indices in decreasing order to get the minimum, and another in increasing order for the maximum\.
2.  Initialize your window's start pointer `left` to zero\.
3.  Expand the window by moving the `right` pointer and update deques\.
4.  Check the condition by comparing the max and min using the front of both deques\.
5.  If the condition is not met \(max \- min > limit\), increment the `left` pointer\.
6.  Calculate the maximum length of the window that satisfies the condition\.
7.  Return the result\.

#### Code:

Java

```java
class Solution {
   public int longestSubarray(int[] nums, int limit) {
       Deque<Integer> maxDeque = new LinkedList<>();
       Deque<Integer> minDeque = new LinkedList<>();
       int left = 0, right;
       int maxLen = 0;
       
       for (right = 0; right < nums.length; right++) {
           // Maintain decreasing order for maxDeque
           while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right])
               maxDeque.pollLast();
           maxDeque.offerLast(right);

           // Maintain increasing order for minDeque
           while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right])
               minDeque.pollLast();
           minDeque.offerLast(right);

           // If the current window doesn't satisfy the condition, slide the window
           while (nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > limit) {
               left++;
               // Remove elements outside the window
               if (maxDeque.peekFirst() < left)
                   maxDeque.pollFirst();
               if (minDeque.peekFirst() < left)
                   minDeque.pollFirst();
           }
           
           // Update max length of satisfying subarray
           maxLen = Math.max(maxLen, right - left + 1);
       }
       
       return maxLen;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\) \- Each element is added and removed from the deque at most once\.
*   **Space Complexity:** O\(N\) \- Space for the two deques holding indices\.