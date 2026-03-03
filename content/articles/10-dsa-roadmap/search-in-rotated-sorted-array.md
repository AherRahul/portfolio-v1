---
title: Search in Rotated Sorted Array
description: Master Search in Rotated Sorted Array in the Binary Search module.
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

There is an integer array `nums` sorted in ascending order \(with **distinct** values\)\.

Prior to being passed to your function, `nums` is **possibly left rotated** at an unknown index `k` \(`1 <= k < nums.length`\) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` \(**0\-indexed**\)\. For example, `[0,1,2,4,5,6,7]` might be left rotated by `3` indices and become `[4,5,6,7,0,1,2]`\.

Given the array `nums` **after** the possible rotation and an integer `target`, return _the index of_ `target` _if it is in_ `nums`_, or_ `-1` _if it is not in_ `nums`\.

You must write an algorithm with `O(log n)` runtime complexity\.

##### **Example 1:**

**Input:** nums = \[4,5,6,7,0,1,2\], target = 0

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
</div>

**Output:** 4

##### **Example 2:**

**Input:** nums = \[4,5,6,7,0,1,2\], target = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
</div>

**Output:** \-1

##### **Example 3:**

**Input:** nums = \[1\], target = 0

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \-1

##### **Constraints:**

*   **1 <= nums\.length <= 5000**
*   **\-10****4** **<= nums\[i\] <= 10****4**
*   All values of `nums` are **unique**\.
*   `nums` is an ascending array that is possibly rotated\.
*   **\-10****4** **<= target <= 10****4**


## Approaches

### 1\. Linear Search

#### Intuition:

The simplest approach to solve this problem is to iterate through the array and check each element if it matches the target\. This brute force approach is straightforward but not efficient\.

#### Code:

#### Complexity Analysis

*   **Time Complexity**: O\(n\), where n is the number of elements in the array\. This is because each element is checked linearly\.
*   **Space Complexity**: O\(1\), no additional space is used\.

### 2\. Binary Search \- Find Pivot, then Search

#### Intuition:

The array is rotated at some pivot, and this affects the normal binary search\. The idea is to first find this pivot point, then determine in which of the two sub\-arrays \(from 0 to pivot, or pivot to n\-1\) the target resides, and perform a binary search in the appropriate sub\-array\.

#### Code:

#### Complexity Analysis

*   **Time Complexity**: O\(log n\), finding the pivot and searching in the sub\-array both take logarithmic time\.
*   **Space Complexity**: O\(1\), no additional space is used\.

### 3\. Optimized Binary Search

#### Intuition:

Since the array is sorted and only rotated, a single pass binary search can be designed\. By checking the sorted property, we can decide which half to continue the search on\. This eliminates the need for a separate pivot finding step, thereby optimizing the binary search process\.

#### Code:

#### Complexity Analysis

*   **Time Complexity**: O\(log n\), executing binary search directly\.
*   **Space Complexity**: O\(1\), no additional space is used\.

#### [Solve it on LeetCode](https://leetcode.com/problems/search-in-rotated-sorted-array)
