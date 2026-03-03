---
title: Search a 2D Matrix
description: Master Search a 2D Matrix in the Binary Search module.
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

You are given an `m x n` integer matrix `matrix` with the following two properties:

*   Each row is sorted in non\-decreasing order\.
*   The first integer of each row is greater than the last integer of the previous row\.

Given an integer `target`, return `true` _if_ `target` _is in_ `matrix` _or_ `false` _otherwise_\.

You must write a solution in `O(log(m * n))` time complexity\.

##### **Example 1:**

**Input:** matrix = \[\[1,3,5,7\],\[10,11,16,20\],\[23,30,34,60\]\], target = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">11</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">16</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">20</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">23</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">30</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">34</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">60</span></div>
    </div>
  </div>
</div>

10

11

16

20

23

30

34

60

**Output:** true

##### **Example 2:**

**Input:** matrix = \[\[1,3,5,7\],\[10,11,16,20\],\[23,30,34,60\]\], target = 13

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">11</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">16</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">20</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">23</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">30</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">34</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">60</span></div>
    </div>
  </div>
</div>

10

11

16

20

23

30

34

60

**Output:** false

##### **Constraints:**

*   m == matrix\.length
*   n == matrix\[i\]\.length
*   1 <= m, n <= 100
*   \-104 <= matrix\[i\]\[j\], target <= 104


## Approaches

### 1\. Brute Force: Linear Search

#### Intuition:

The simplest way to search for a target in a 2D matrix is to iterate through each element until we find the target or exhaust all possibilities\. This approach mimics a direct linear search, which is straightforward but inefficient for large matrices\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where m is the number of rows and n is the number of columns in the matrix\.
*   **Space Complexity:** O\(1\), as we are not using any extra space besides a few variables\.

### 2\. Binary Search on 2D Matrix

#### Intuition:

Given that the rows of the matrix are sorted in non\-decreasing order and each first integer of a row is greater than the last integer of the previous row, each row can independently be subjected to a binary search to determine if the target exists therein\. This approach capitalizes on this sorted property, reducing the search space more efficiently than a linear scan\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(m \* log\(n\)\), since we do a binary search \(logarithmic time complexity\) across each of the m rows\.
*   **Space Complexity:** O\(1\), as no additional space is used besides vars\.

### 3\. Treat 2D Matrix as 1D Array

#### Intuition:

By treating the 2D matrix as a sorted 1D array, we can perform a single binary search to find the target\. The index conversion between the 1D and 2D matrix can be done using simple row and column calculations\. This method fully utilizes the sorted property of the entire matrix, leading to an extremely efficient solution\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(log\(m \* n\)\), which simplifies to O\(log\(mn\)\) due to the single binary search on the entire matrix\.
*   **Space Complexity:** O\(1\), as the solution uses only a fixed amount of extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/search-a-2d-matrix)
