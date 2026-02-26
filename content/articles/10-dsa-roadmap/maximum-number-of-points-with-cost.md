---
title: Maximum Number of Points with Cost
description: Master Maximum Number of Points with Cost in the Dynamic
  Programming module. Comprehensive guide and algorithmic problem solving.
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

You are given an `m x n` integer matrix `points` \(**0\-indexed**\)\. Starting with `0` points, you want to **maximize** the number of points you can get from the matrix\.

To gain points, you must pick one cell in **each row**\. Picking the cell at coordinates `(r, c)` will **add** `points[r][c]` to your score\.

However, you will lose points if you pick a cell too far from the cell that you picked in the previous row\. For every two adjacent rows `r` and `r + 1` \(where `0 <= r < m - 1`\), picking cells at coordinates **\(r, c****1****\)** and **\(r \+ 1, c****2****\)** will **subtract** **abs\(c****1** **\- c****2****\)** from your score\.

Return _the_ _**maximum**_ _number of points you can achieve_\.

`abs(x)` is defined as:

*   `x` for `x >= 0`\.
*   `-x` for `x < 0`\.

##### **Example 1:**

Input:points=\[\[1,2,3\],\[1,5,1\],\[3,1,1\]\]

0

1

2

0

1

2

3

1

1

5

1

2

3

1

1

**Output:** 9

**Explanation:**

The blue cells denote the optimal cells to pick, which have coordinates \(0, 2\), \(1, 1\), and \(2, 0\)\.

You add 3 \+ 5 \+ 3 = 11 to your score\.

However, you must subtract abs\(2 \- 1\) \+ abs\(1 \- 0\) = 2 from your score\.

Your final score is 11 \- 2 = 9\.

##### **Example 2:**

Input:points=\[\[1,5\],\[2,3\],\[4,2\]\]

0

1

0

1

5

1

2

3

2

4

2

**Output:** 11

**Explanation:**

The blue cells denote the optimal cells to pick, which have coordinates \(0, 1\), \(1, 1\), and \(2, 0\)\.

You add 5 \+ 3 \+ 4 = 12 to your score\.

However, you must subtract abs\(1 \- 1\) \+ abs\(1 \- 0\) = 1 from your score\.

Your final score is 12 \- 1 = 11\.

##### **Constraints:**

*   m == points\.length
*   n == points\[r\]\.length
*   1 <= m, n <= 105
*   1 <= m \* n <= 105
*   0 <= points\[r\]\[c\] <= 105

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-number-of-points-with-cost)

# Approaches

## 1\. Brute Force

#### Intuition:

The Brute Force approach for this problem involves considering every possible path through the matrix, calculating the cost for each path, and then returning the maximum cost found\. This is achieved by iterating over the matrix in a row\-wise manner, and for each cell in a given row, calculating the cost based on all possible previous cells from the row above, accounting for their respective penalties\.

#### Explanation:

The naive way to solve this problem is to iterate over each row and for every cell in the current row, consider every possible previous cell in the row above\. For each combination, we calculate the cost using the given formula, and we keep track of the maximum cost encountered thus far\.

#### Code:

Java

```java
class Solution {
   public long maxPoints(int[][] points) {
       int m = points.length;
       int n = points[0].length;

       // dp array to hold the maximum points until the current row
       long[] dp = new long[n];
       
       // Initialize dp with the first row points
       for (int j = 0; j < n; j++) {
           dp[j] = points[0][j];
       }

       for (int i = 1; i < m; i++) {
           // Temporary array to store the new dp values for the current row
           long[] newDp = new long[n];
           for (int j = 0; j < n; j++) {
               // Look at every k from the previous row to calculate the maximum points
               for (int k = 0; k < n; k++) {
                   newDp[j] = Math.max(newDp[j], dp[k] + points[i][j] - Math.abs(j - k));
               }
           }
           dp = newDp;
       }

       long maxPoints = 0;
       for (long val : dp) {
           maxPoints = Math.max(maxPoints, val);
       }

       return maxPoints;
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(m \* n^2\), as we are iterating through each cell of the matrix and comparing it with every cell of the row above\.
*   **Space Complexity**: O\(n\), using a temporary array for dynamic programming storage\.

## 2\. Optimized Dynamic Programming

#### Intuition:

We can optimize the brute\-force solution by utilizing dynamic programming to progressively build up the solution\. We will keep a record of the maximum costs achievable for each cell, using information from the previous row\. The idea is to avoid recalculating penalties for non\-optimal choices by using pre\-computed maximum values from the left and right neighbors\.

#### Explanation:

To optimize our solution, we can pass through the matrix twice for each row\. The first pass calculates the maximum possible score for each cell considering penalties from the left neighbor direction\. The second pass does the same from the right neighbor direction\. Thus, each cell will have the maximum score via the least penalized neighbor direction\. By maintaining efficient transitions between computations, the solution is achieved more rapidly than the naive method\.

#### Code:

Java

```java
class Solution {
   public long maxPoints(int[][] points) {
       int m = points.length;
       int n = points[0].length;
       
       long[] dp = new long[n];
       
       // Initialize dp with the first row points
       for (int j = 0; j < n; j++) {
           dp[j] = points[0][j];
       }
       
       for (int i = 1; i < m; i++) {
           long[] newDp = new long[n];

           // Calculate the maximum from the left
           long[] leftMax = new long[n];
           leftMax[0] = dp[0];
           for (int j = 1; j < n; j++) {
               leftMax[j] = Math.max(leftMax[j - 1] - 1, dp[j]);
           }
           
           // Calculate the maximum from the right
           long[] rightMax = new long[n];
           rightMax[n - 1] = dp[n - 1];
           for (int j = n - 2; j >= 0; j--) {
               rightMax[j] = Math.max(rightMax[j + 1] - 1, dp[j]);
           }
           
           // Calculate the new dp based on leftMax, rightMax, and points
           for (int j = 0; j < n; j++) {
               newDp[j] = points[i][j] + Math.max(leftMax[j], rightMax[j]);
           }
           
           dp = newDp;
       }

       long maxPoints = 0;
       for (long val : dp) {
           maxPoints = Math.max(maxPoints, val);
       }
       
       return maxPoints;
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(m \* n\), a significant improvement since we take advantage of linear computations for each row\.
*   **Space Complexity**: O\(n\), as we use additional space for temporary storage in dynamic programming approach\.