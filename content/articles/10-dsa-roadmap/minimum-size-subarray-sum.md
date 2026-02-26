---
title: Minimum Size Subarray Sum
description: Master Minimum Size Subarray Sum in the Sliding Window module.
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

Given an array of positive integers `nums` and a positive integer `target`, return _the_ _**minimal length**_ _of a subarray whose sum is greater than or equal to_ `target`\. If there is no such subarray, return `0` instead\.

##### **Example 1:**

**Input:** target = 7, nums = \[2,3,1,2,4,3\]

**Output:** 2

**Explanation:** The subarray \[4,3\] has the minimal length under the problem constraint\.

##### **Example 2:**

**Input:** target = 4, nums = \[1,4,4\]

**Output:** 1

##### **Example 3:**

**Input:** target = 11, nums = \[1,1,1,1,1,1,1,1\]

**Output:** 0

##### **Constraints:**

*   **1 <= target <= 10****9**
*   **1 <= nums\.length <= 10****5**
*   **1 <= nums\[i\] <= 10****4**

**Follow up:** If you have figured out the `O(n)` solution, try coding another solution of which the time complexity is `O(n log(n))`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-size-subarray-sum)

# Approaches

## 1\. Brute Force

#### **Intuition:**

The simplest way to solve this problem is to consider each possible subarray of the given array\. For each subarray, calculate the sum and check if it is greater than or equal to the given target sum `s`\. The length of such subarray should be noted, and at the end, we need the minimum of such lengths\.

#### **Code:**

Java

```java
class Solution {
   public int minSubArrayLen(int s, int[] nums) {
       int minLength = Integer.MAX_VALUE;
       // Iterate starting point of subarray
       for (int start = 0; start < nums.length; start++) {
           int sum = 0;
           // Iterate ending point of subarray
           for (int end = start; end < nums.length; end++) {
               sum += nums[end];
               // Check if current subarray sum is at least s
               if (sum >= s) {
                   // Update minLength if current length is smaller
                   minLength = Math.min(minLength, end - start + 1);
                   break; // Move to the next start point
               }
           }
       }
       return (minLength == Integer.MAX_VALUE) ? 0 : minLength;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\), where \(n\) is the number of elements in the array\. This is because for each starting index, we iterate over the remaining elements\.
*   **Space Complexity:** O\(n\), due to the use of additional array\.

## 2\. Sliding Window

#### **Intuition:**

A more optimal solution involves using a sliding window technique\. The main idea is to maintain a window that contains a sum greater than or equal to `s`\. We expand the window by moving the end pointer and keep shrinking it from the start as long as the desired sum condition is satisfied\. This helps in reducing the subarray size while maintaining the sum constraint\.

#### **Code:**

Java

```java
class Solution {
   public int minSubArrayLen(int s, int[] nums) {
       int minLength = Integer.MAX_VALUE;
       int start = 0, sum = 0;
       // Iterate through the array with the end pointer
       for (int end = 0; end < nums.length; end++) {
           sum += nums[end];
           // Shrink the window from the start as long as the sum is sufficiently large
           while (sum >= s) {
               minLength = Math.min(minLength, end - start + 1);
               sum -= nums[start++];
           }
       }
       return (minLength == Integer.MAX_VALUE) ? 0 : minLength;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where \(n\) is the number of elements in the array\. Each element is added and removed from the sum at most once, resulting in linear time complexity\.
*   **Space Complexity:** O\(1\), since we only use a constant amount of additional space\.

View Animation