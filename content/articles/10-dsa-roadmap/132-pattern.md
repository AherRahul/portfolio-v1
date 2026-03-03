---
title: 132 Pattern
description: Master 132 Pattern in the Stacks module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an array of `n` integers `nums`, a **132 pattern** is a subsequence of three integers `nums[i]`, `nums[j]` and `nums[k]` such that `i < j < k` and `nums[i] < nums[k] < nums[j]`\.

Return `true` _if there is a_ _**132 pattern**_ _in_ `nums`_, otherwise, return_ `false`_\._

##### **Example 1:**

**Input:** nums = \[1,2,3,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
  </div>
</div>

**Output:** false

**Explanation:** There is no 132 pattern in the sequence\.

##### **Example 2:**

**Input:** nums = \[3,1,4,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
  </div>
</div>

**Output:** true

**Explanation:** There is a 132 pattern in the sequence: \[1, 4, 2\]\.

##### **Example 3:**

**Input:** nums = \[\-1,3,2,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
  </div>
</div>

**Output:** true**Explanation:** There are three 132 patterns in the sequence: \[\-1, 3, 2\], \[\-1, 3, 0\] and \[\-1, 2, 0\]\.

##### **Constraints:**

*   **n == nums\.length**
*   **1 <= n <= 2 \* 10****5**
*   **\-10****9** **<= nums\[i\] <= 10****9**


## Approaches

### 1\. Brute Force

#### Intuition:

The brute force approach involves checking every possible triplet to see if it forms a 132 pattern\. The 132 pattern means finding three indices `i, j, k` such that `i < j < k` and `nums[i] < nums[k] < nums[j]`\.

#### Steps:

1.  Loop over the array and fix `i`\.
2.  For every fixed `i`, fix `j` and ensure `j > i`\.
3.  For every fixed `j`, loop over the array to find an element `k`, where `k > j` and `nums[i] < nums[k] < nums[j]`\.
4.  If such a triplet is found, return true\.
5.  If after checking all possibilities, no triplet is found, return false\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n^3\), where `n` is the length of the array, due to the three nested loops\.
*   **Space Complexity:** O\(1\), no extra space used\.

### 2\. Using Stacks

#### Intuition:

To optimize, we can use a stack to maintain candidates for the second largest number \(`nums[j]`\) in the pattern 132 by iterating from the right\. We will also maintain a variable `nums[k]` as the second number in the 132 pattern\.

#### Steps:

1.  Traverse the array from the right\.
2.  Keep a variable `third` to track the maximum number less than `nums[j]` which can be a candidate for `nums[k]`\.
3.  Use a stack to maintain the numbers which can potentially be `nums[j]`\.
4.  For each element `nums[i]`, check:

*   If `nums[i]` is less than `third`, a valid 132 pattern is found\.

6.  If no 132 pattern is found by the end of the loop, return false\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n\), since each element is pushed and popped from the stack at most once\.
*   **Space Complexity:** O\(n\), for the stack used to store potential `nums[j]` candidates\.

#### [Solve it on LeetCode](https://leetcode.com/problems/132-pattern)
