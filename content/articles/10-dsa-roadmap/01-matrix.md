---
title: 01 Matrix
description: Master 01 Matrix in the Graphs module. Comprehensive guide and
  algorithmic problem solving.
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

Given an `m x n` binary matrix `mat`, return _the distance of the nearest_ `0` _for each cell_\.

The distance between two cells sharing a common edge is `1`\.

##### **Example 1:**

Input:mat=\[\[0,0,0\],\[0,1,0\],\[0,0,0\]\]

0

1

2

0

0

0

0

1

0

1

0

2

0

0

0

Output:\[\[0,0,0\],\[0,1,0\],\[0,0,0\]\]

0

1

2

0

0

0

0

1

0

1

0

2

0

0

0

##### **Example 2:**

Input:mat=\[\[0,0,0\],\[0,1,0\],\[1,1,1\]\]

0

1

2

0

0

0

0

1

0

1

0

2

1

1

1

Output:\[\[0,0,0\],\[0,1,0\],\[1,2,1\]\]

0

1

2

0

0

0

0

1

0

1

0

2

1

2

1

##### **Constraints:**

*   `m == mat.length`
*   `n == mat[i].length`
*   **1 <= m, n <= 10****4**
*   **1 <= m \* n <= 10****4**
*   `mat[i][j]` is either `0` or `1`\.
*   There is at least one `0` in `mat`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/01-matrix)

# Approaches

## 1\. Breadth\-First Search \(BFS\) from Zeros

#### **Intuition:**

*   The problem requires finding the shortest distance from each cell containing `1` to the nearest cell containing `0`\.
*   A natural way to explore distances outward from source points \(0's\) is via a BFS, as BFS by nature explores equally in all directions level\-by\-level\.
*   Initialize the distance to `0` for all cells containing `0`\.
*   Enqueue all `0` cells initially and start the BFS\.
*   For each dequeued cell, update its neighboring cells if a shorter distance is discovered\.

#### **Steps:**

1.  Initialize a queue structure and set distances according to the input matrix — zero for `0` cells, infinity for `1` cells\.
2.  Add all zeros to a queue\.
3.  Perform a BFS where each cell updates its neighbors with its distance plus one, provided the neighbor's current value is greater than the newly proposed distance\.
4.  Continue until processing for all cells is complete\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where `m` and `n` are the matrix dimensions\. Each cell is processed at most once\.
*   **Space Complexity:** O\(m \* n\), needed for the distance matrix and the BFS queue\.

## 2\. Dynamic Programming Approach

#### **Intuition:**

*   The idea is to use DP to find optimal substructure — checking paths dynamically based on previously computed paths\.
*   Since BFS from each zero can be suboptimal and cumbersome for large inputs, consider updating the distances recursively based on dynamic programming\.
*   Traverse the matrix two times: once from top\-left to bottom\-right, and again from bottom\-right to top\-left, to ensure that the shortest path from any direction is captured\.

#### **Steps:**

1.  Initialize the distance array with infinite places for `1` initially\.
2.  Traverse the matrix from the top\-left, filling out shortest distances leveraging known zero positions and dynamic table values\.
3.  Traverse again from the bottom\-right, updating the table further to reflect any shorter distances by considering the bottom\-right\-to\-top\-left direction\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(m \* n\), the matrix is traversed twice\.
*   **Space Complexity:** O\(1\), only a fixed amount of extra space used, modifying the input\.