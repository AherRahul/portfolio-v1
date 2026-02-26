---
title: Maximum Sum Circular Subarray
description: Master Maximum Sum Circular Subarray in the Kadane's Algorithm
  module. Comprehensive guide and algorithmic problem solving.
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

Given a **circular integer array** `nums` of length `n`, return _the maximum possible sum of a non\-empty_ _**subarray**_ _of_ `nums`\.

A **circular array** means the end of the array connects to the beginning of the array\. Formally, the next element of `nums[i]` is `nums[(i + 1) % n]` and the previous element of `nums[i]` is `nums[(i - 1 + n) % n]`\.

A **subarray** may only include each element of the fixed buffer `nums` at most once\. Formally, for a subarray `nums[i], nums[i + 1], ..., nums[j]`, there does not exist `i <= k1`, `k2 <= j` with `k1 % n == k2 % n`\.

##### **Example 1:**

Input:nums=\[1,\-2,3,\-2\]

0

1

1

\-2

2

3

3

\-2

Output:3

3

**Explanation:** Subarray \[3\] has maximum sum 3\.

##### **Example 2:**

Input:nums=\[5,\-3,5\]

0

5

1

\-3

2

5

Output:10

10

**Explanation:** Subarray \[5,5\] has maximum sum 5 \+ 5 = 10\.

##### **Example 3:**

Input:nums=\[\-3,\-2,\-3\]

0

\-3

1

\-2

2

\-3

Output:\-2

\-2

**Explanation:** Subarray \[\-2\] has maximum sum \-2\.

##### **Constraints:**

*   **n == nums\.length**
*   **1 <= n <= 3 \* 10****4**
*   **\-3 \* 10****4** **<= nums\[i\] <= 3 \* 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-sum-circular-subarray)

# Approaches

## 1\. Kadane's Algorithm

#### Intuition:

The basic approach to solve the Maximum Subarray Sum problem can be achieved by using Kadane's Algorithm\. However, this problem introduces a circular array aspect: that is, the end of the array wraps around to the start\. We need to find the maximum subarray in two scenarios: one without the wrapping, and one where the subarray might wrap around the end of the array back to the beginning\.

#### Steps:

1.  **Without Circularity:** Use Kadane's algorithm to find the maximum subarray sum that does not wrap around \(the traditional approach\)\.
2.  **Handle Wrap\-around:** The other possible case is that the maximum subarray wraps around the circle\. This can be handled by considering the total array sum minus the minimum subarray sum \(found via Kadane's applied to the _negative_ values\)\.
3.  Handle the edge case where all numbers are negative: in this case, the maximum subarray is just a single \(least negative\) number, so we should not consider wrapping\.

#### Code:

Java

```java
class Solution {
   public int maxSubarraySumCircular(int[] nums) {
       int totalSum = 0; 
       int maxSumWithoutWrap = Integer.MIN_VALUE; 
       int currentMax = 0; 
       int minSumWithWrap = Integer.MAX_VALUE; 
       int currentMin = 0;
       
       for (int num : nums) {
           totalSum += num;
           
           // Calculate max without wrap using standard Kadane’s algorithm
           currentMax = Math.max(currentMax + num, num);
           maxSumWithoutWrap = Math.max(maxSumWithoutWrap, currentMax);
           
           // Calculate min sum using modified Kadane’s to find wrap-around
           currentMin = Math.min(currentMin + num, num);
           minSumWithWrap = Math.min(minSumWithWrap, currentMin);
       }
       
       // Edge case: All numbers are negative
       if (maxSumWithoutWrap < 0) {
           return maxSumWithoutWrap;
       }
       
       return Math.max(maxSumWithoutWrap, totalSum - minSumWithWrap);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of elements in the array, due to single pass traversal\.
*   **Space Complexity:** O\(1\), as no extra space is utilized\.