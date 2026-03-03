---
title: Triangle
description: Master Triangle in the Dynamic Programming module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a `triangle` array, return _the minimum path sum from top to bottom_\.

For each step, you may move to an adjacent number of the row below\. More formally, if you are on index `i` on the current row, you may move to either index `i` or index `i + 1` on the next row\.

##### **Example 1:**

**Input:** triangle = \[\[2\],\[3,4\],\[6,5,7\],\[4,1,8,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Output:** 11

**Explanation:** The triangle looks like: 2 3 4 6 5 74 1 8 3

The minimum path sum from top to bottom is 2 \+ 3 \+ 5 \+ 1 = 11 \(underlined above\)\.

**Example 2:**

**Input:** triangle = \[\[\-10\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">-10</span></div>
    </div>
  </div>
</div>

**Output:** \-10

##### **Constraints:**

*   **1 <= triangle\.length <= 200**
*   **triangle\[0\]\.length == 1**
*   **triangle\[i\]\.length == triangle\[i \- 1\]\.length \+ 1**
*   **\-10****4** **<= triangle\[i\]\[j\] <= 10****4**

**Follow up:** Could you do this using only `O(n)` extra space, where `n` is the total number of rows in the triangle?


## Approaches

### 1\. Recursive Brute Force

#### **Intuition**:

Start from the top of the triangle, at each step, move to one of the two adjacent numbers on the row below\. Sum the paths and return the minimum path sum recursively\.

#### Code:

```java
class Solution {
   public int minimumTotal(List<List<Integer>> triangle) {
       return helper(triangle, 0, 0);
   }

   // Recursive helper function to find minimum path sum
   private int helper(List<List<Integer>> triangle, int row, int col) {
       // Base case: If we are at the last row, return the current element
       if (row == triangle.size() - 1) {
           return triangle.get(row).get(col);
       }
       
       // Calculate the minimum path sum including the current element
       int leftPath = helper(triangle, row + 1, col);
       int rightPath = helper(triangle, row + 1, col + 1);
       
       return triangle.get(row).get(col) + Math.min(leftPath, rightPath);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(2^n\) \- each element can lead to two possibilities\.
*   **Space Complexity:** O\(n\) \- recursion depth\.

### 2\. Memoization

#### **Intuition**:

To avoid recalculating the same values, we store the results of subproblems in a memoization table\.

#### Code:

```java
class Solution {
   public int minimumTotal(List<List<Integer>> triangle) {
       // Initialize a memoization array with -1 (indicating uncomputed)
       int[][] memo = new int[triangle.size()][triangle.size()];
       for (int[] row : memo) {
           Arrays.fill(row, -1);
       }
       return helper(triangle, 0, 0, memo);
   }

   private int helper(List<List<Integer>> triangle, int row, int col, int[][] memo) {
       // Base case
       if (row == triangle.size() - 1) {
           return triangle.get(row).get(col);
       }

       // If the result is already computed, return it
       if (memo[row][col] != -1) {
           return memo[row][col];
       }

       // Calculate the minimum path sum using memoization
       int leftPath = helper(triangle, row + 1, col, memo);
       int rightPath = helper(triangle, row + 1, col + 1, memo);

       // Store the result in the memo array
       memo[row][col] = triangle.get(row).get(col) + Math.min(leftPath, rightPath);
       return memo[row][col];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- all cells are computed once\.
*   **Space Complexity:** O\(n^2\) \- memoization table storage\.

### 3\. Bottom\-Up Dynamic Programming

#### **Intuition**:

Start filling the DP table from the bottom of the triangle towards the top, by considering the potential next moves in the row below\.

#### Code:

```java
class Solution {
   public int minimumTotal(List<List<Integer>> triangle) {
       int n = triangle.size();
       int[][] dp = new int[n][n];

       // Initialize the last row of DP table
       for (int i = 0; i < n; i++) {
           dp[n - 1][i] = triangle.get(n - 1).get(i);
       }

       // Fill the DP table from bottom to top
       for (int row = n - 2; row >= 0; row--) {
           for (int col = 0; col <= row; col++) {
               dp[row][col] = triangle.get(row).get(col) + Math.min(dp[row + 1][col], dp[row + 1][col + 1]);
           }
       }

       // The answer is at the top of the triangle
       return dp[0][0];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- each cell is computed once\.
*   **Space Complexity:** O\(n^2\) \- DP table storage\.

### 4\. Space Optimized Dynamic Programming

#### **Intuition**:

Instead of keeping a full DP table, keep a single array representing the current row computations, reducing space usage\.

#### Code:

```java
class Solution {
   public int minimumTotal(List<List<Integer>> triangle) {
       int n = triangle.size();
       int[] dp = new int[n];

       // Initialize the dp array with the last row of the triangle
       for (int i = 0; i < n; i++) {
           dp[i] = triangle.get(n - 1).get(i);
       }

       // Update dp array from bottom to top
       for (int row = n - 2; row >= 0; row--) {
           for (int col = 0; col <= row; col++) {
               dp[col] = triangle.get(row).get(col) + Math.min(dp[col], dp[col + 1]);
           }
       }

       // The answer is at the first element representing the top of the triangle
       return dp[0];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- each cell is computed once\.
*   **Space Complexity:** O\(n\) \- reused single array storage\.

#### [Solve it on LeetCode](https://leetcode.com/problems/triangle)
