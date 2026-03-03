---
title: Maximum Average Subarray I
description: Master Maximum Average Subarray I in the Sliding Window module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are given an integer array `nums` consisting of `n` elements, and an integer `k`\.

Find a contiguous subarray whose **length is equal to** `k` that has the maximum average value and return _this value_\. Any answer with a calculation error less than **10****\-5** will be accepted\. 

##### **Example 1:**

**Input:** nums = \[1,12,\-5,\-6,50,3\], k = 4

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">-6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">50</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** 12\.75000

**Explanation:** Maximum average is \(12 \- 5 \- 6 \+ 50\) / 4 = 51 / 4 = 12\.75

##### **Example 2:**

**Input:** nums = \[5\], k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
  </div>
</div>

**Output:** 5\.00000

##### **Constraints:**

*   **n == nums\.length**
*   **1 <= k <= n <= 10****5**
*   **\-10****4** **<= nums\[i\] <= 10****4**


## Approaches

### 1\. Brute Force

#### Intuition:

The basic idea behind the brute force approach is to calculate the sum of every possible subarray of length `k` and then find the one with the maximum sum\. This approach involves iterating over all the subarrays of length `k`, which can be computationally expensive for larger arrays\.

#### Code:

```java
class Solution {
   public double findMaxAverage(int[] nums, int k) {
       // Initialize 'maxSum' to minimum possible value
       int maxSum = Integer.MIN_VALUE;
       
       // Iterate through each starting point of subarray of length k
       for (int i = 0; i <= nums.length - k; i++) {
           int currentSum = 0;
           
           // Calculate the sum of subarray starting at index 'i' of length 'k'
           for (int j = i; j < i + k; j++) {
               currentSum += nums[j];
           }
           
           // Update 'maxSum' if 'currentSum' is greater
           maxSum = Math.max(maxSum, currentSum);
       }
       
       // Return the maximum average
       return (double) maxSum / k;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \* k\), where `n` is the length of `nums`\. We calculate the sum for each possible subarray starting from each index\.
*   **Space Complexity:** O\(1\), only a fixed amount of extra space is used\.

### 2\. Sliding Window

#### Intuition:

The sliding window approach optimizes the calculation of the subarray sum by re\-using the sum of the previous subarray\. Rather than recalculating the sum from scratch for each subarray, we adjust the sum by subtracting the element that slides out of the window and adding the new element that comes into the window\.

#### Code:

```java
class Solution {
   public double findMaxAverage(int[] nums, int k) {
       int currentSum = 0;
       
       // Calculate sum of the first 'k' elements
       for (int i = 0; i < k; i++) {
           currentSum += nums[i];
       }
       
       int maxSum = currentSum;
       
       // Slide the window over the rest of the elements
       for (int i = k; i < nums.length; i++) {
           // Update the current sum by sliding the window
           currentSum = currentSum - nums[i - k] + nums[i];
           
           // Update maxSum if the current sum is greater
           maxSum = Math.max(maxSum, currentSum);
       }
       
       // Return the maximum average
       return (double) maxSum / k;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where `n` is the length of `nums`\. We traverse the array once\.
*   **Space Complexity:** O\(1\), as we are using a constant amount of extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-average-subarray-i)
