---
title: Continuous Subarray Sum
description: Master Continuous Subarray Sum in the Prefix Sum module.
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

Given an integer array nums and an integer k, return `true` _if_ `nums` _has a_ _**good subarray**_ _or_ `false` _otherwise_\.

A **good subarray** is a subarray where:

*   its length is **at least two**, and
*   the sum of the elements of the subarray is a multiple of `k`\.

**Note** that:

*   A **subarray** is a contiguous part of the array\.
*   An integer `x` is a multiple of `k` if there exists an integer `n` such that `x = n * k`\. `0` is **always** a multiple of `k`\.

##### **Example 1:**

**Input:** nums = \[23,2,4,6,7\], k = 6

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">23</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">7</span></div>
  </div>
</div>

**Output:** true

**Explanation:** \[2, 4\] is a continuous subarray of size 2 whose elements sum up to 6\.

##### **Example 2:**

**Input:** nums = \[23,2,6,4,7\], k = 6

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">23</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">7</span></div>
  </div>
</div>

**Output:** true

**Explanation:** \[23, 2, 6, 4, 7\] is an continuous subarray of size 5 whose elements sum up to 42\.

42 is a multiple of 6 because 42 = 7 \* 6 and 7 is an integer\.

##### **Example 3:**

**Input:** nums = \[23,2,6,4,7\], k = 13

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">23</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">7</span></div>
  </div>
</div>

**Output:** false

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **0 <= nums\[i\] <= 10****9**
*   **0 <= sum\(nums\[i\]\) <= 2****31** **\- 1**
*   **1 <= k <= 2****31** **\- 1**


## Approaches

### 1\. Brute Force

#### **Intuition**:

The brute force approach involves considering all subarrays and calculating their sum to see if it's a multiple of `k`\. We can iterate over each start index, then from that start index, iterate through possible end indices, maintaining the sum of the subarray and checking it against `k`\.

#### Code:

```java
class Solution {
   public boolean checkSubarraySum(int[] nums, int k) {
       int n = nums.length;
       // Traverse the array to consider all subarrays
       for (int start = 0; start < n; start++) {
           int sum = 0;
           // Check subarray from 'start' to 'end'
           for (int end = start; end < n; end++) {
               sum += nums[end]; // Add current number to the subarray sum
               // Check whether the sum is a multiple of k (and subarray has at least 2 elements)
               if (end - start > 0 && sum % k == 0) {
                   return true;
               }
           }
       }
       return false; // No subarray found with required property
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to the nested loops checking all subarrays\.
*   **Space Complexity:** O\(1\) as only a few integer variables are used\.

### 2\. Prefix Sum with Modulo HashMap

#### **Intuition**:

Instead of checking every subarray, use a hashmap to store the remainder of the prefix sum when divided by `k`\. If the same remainder appears again \(and the subarray length between these points is greater than 1\), it indicates a subarray sum which is a multiple of `k`\.

#### Code:

```java
class Solution {
   public boolean checkSubarraySum(int[] nums, int k) {
       // HashMap to store the first occurrence of each modulo value.
       HashMap<Integer, Integer> modMap = new HashMap<>();
       modMap.put(0, -1); // Initial heuristic to handle edge case

       int runningSum = 0;
       for (int i = 0; i < nums.length; i++) {
           runningSum += nums[i]; // Increment the running sum
           int mod = runningSum % k; // Compute modulo with k
           
           // If mod is negative, adjust it to be positive
           if (mod < 0) mod += k;

           // Check if this mod has appeared before
           if (modMap.containsKey(mod)) {
               // Verify the subarray is longer than size 1
               if (i - modMap.get(mod) > 1) {
                   return true;
               }
           } else {
               // Store the index of the first time we see this mod
               modMap.put(mod, i);
           }
       }
       return false; // No valid subarray found
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) as we only traversed the array once\.
*   **Space Complexity:** O\(min\(n, k\)\) due to the map storing at most `k` different mod values\. In scenarios where many duplicates exist, the space can potentially approach `n`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/continuous-subarray-sum)
