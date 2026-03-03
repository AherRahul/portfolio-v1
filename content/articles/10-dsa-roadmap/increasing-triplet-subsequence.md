---
title: Increasing Triplet Subsequence
description: Master Increasing Triplet Subsequence in the Arrays module.
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

Given an integer array `nums`, return `true` _if there exists a triple of indices_ `(i, j, k)` _such that_ `i < j < k` _and_ `nums[i] < nums[j] < nums[k]`\. If no such indices exists, return `false`\. 

##### **Example 1:**

Input:nums=\[1,2,3,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
  </div>
</div>

Output:true

true

**Explanation:** Any triplet where i < j < k is valid\.

##### **Example 2:**

Input:nums=\[5,4,3,2,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
  </div>
</div>

Output:false

false

**Explanation:** No triplet exists\.

##### **Example 3:**

Input:nums=\[2,1,5,0,4,6\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
  </div>
</div>

Output:true

true

**Explanation:** One of the valid triplet is index \(3, 4, 5\), because nums\[3\] == 0 < nums\[4\] == 4 < nums\[5\] == 6\.

##### **Constraints:**

*   **1 <= nums\.length <= 5 \* 10****5**
*   **\-2****31** **<= nums\[i\] <= 2****31** **\- 1**

**Follow up:** Could you implement a solution that runs in `O(n)` time complexity and `O(1)` space complexity?


## Approaches

### 1\. Brute Force Approach

#### Intuition:

The simplest approach to find an increasing triplet subsequence is to use three nested loops to check all possible triplets in the array\.

This is a naive solution but helps to understand the underlying concept\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n^3\), due to the three nested loops over the array\.
*   **Space Complexity:** O\(1\), since we are not using any additional data structures\.

### 2\. Linear Scan using Two Variables

#### Intuition:

The goal is to find three increasing numbers a, b, c such that a < b < c\. We can achieve this in linear time with two variables:

*   **first**: This will keep track of the smallest number found so far\.
*   **second**: This will keep track of a number larger than **first**\.

As we scan through the array, the goal is to gradually refine these candidates\. If at any point we encounter a number **greater than both** `first` and `second`, it becomes our `third`, and the triplet exists\.

### Why This Works

The key idea is that we’re not trying to find the actual triplet, we’re trying to prove that one _exists_\.

The algorithm maintains the strongest possible candidates for forming an increasing triplet:

1.  **first**: We always keep `first` as small as possible\. A smaller `first` increases our chances of finding a valid `second` and `third`\.
2.  **second:** Once we have a good `first`, we look for the smallest number greater than `first`\. This ensures the widest possible margin for finding a future `third`\.
3.  **Encountering third**: If we ever see a number greater than both `first` and `second`, we are guaranteed to have: first < second < num \(this num is our c\)\.

The moment this happens, we can immediately return `true`\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\. We only require one pass through the array\.
*   **Space Complexity:** O\(1\), since we are using only a constant amount of additional space\.

#### Example Walkthrough:

first = ∞, second = ∞

#### [Solve it on LeetCode](https://leetcode.com/problems/increasing-triplet-subsequence)
