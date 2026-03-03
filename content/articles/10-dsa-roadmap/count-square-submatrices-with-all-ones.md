---
title: Count Square Submatrices with All Ones
description: Master Count Square Submatrices with All Ones in the Dynamic
  Programming module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a `m * n` matrix of ones and zeros, return how many **square** submatrices have all ones\.

##### **Example 1:**

**Input:**

Input:matrix=\[\[0,1,1,1\], \[1,1,1,1\], \[0,1,1,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** 15

**Explanation:**

There are **10** squares of side 1\.

There are **4** squares of side 2\.

There is **1** square of side 3\.

Total number of squares = 10 \+ 4 \+ 1 = **15**\.

##### **Example 2:**

**Input:**

Input:matrix=\[\[1,0,1\], \[1,1,0\], \[1,1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Output:** 7

**Explanation:**

There are **6** squares of side 1\.

There is **1** square of side 2\.

Total number of squares = 6 \+ 1 = **7**\.

##### **Constraints:**

*   `1 <= arr.length <= 300`
*   `1 <= arr[0].length <= 300`
*   `0 <= arr[i][j] <= 1`


## Approaches

### 1\. Brute Force Solution

#### **Intuition:**

The basic idea is to count all possible square submatrices in the matrix that have all ones\. The brute force approach involves iterating over every potential square submatrix and checking if it consists entirely of ones\.

*   Start at every element in the matrix, try expanding it into a square submatrix\.
*   Check each submatrix to see if every entry is `1`\.
*   If a square is valid, increase the count\.

This approach checks every possible square matrix, and hence can be quite inefficient for larger matrices\.

#### **Code:**

```java
class Solution {
   public int countSquares(int[][] matrix) {
       int m = matrix.length;
       int n = matrix[0].length;
       int count = 0;

       // iterate over each potential top-left corner of a square
       for (int i = 0; i < m; i++) {
           for (int j = 0; j < n; j++) {
               // maximum size of square that can be possibly formed with (i, j) as top-left corner
               int maxSize = Math.min(m - i, n - j);
               // consider all squares from size 1 to maxSize
               for (int size = 1; size <= maxSize; size++) {
                   if (isAllOnes(matrix, i, j, size)) {
                       count++;
                   } else {
                       break;  // no need to check larger squares if current one is not valid
                   }
               }
           }
       }

       return count;
   }

   // Check if all elements in the submatrix of given size starting at (startX, startY) are ones
   private boolean isAllOnes(int[][] matrix, int startX, int startY, int size) {
       for (int i = startX; i < startX + size; i++) {
           for (int j = startY; j < startY + size; j++) {
               if (matrix[i][j] != 1) {
                   return false;
               }
           }
       }
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n \* min\(m, n\)^2\), where m and n are the dimensions of the matrix\. We check each submatrix for validity up to the possible maximum size\.
*   **Space Complexity:** O\(1\), since we are using no extra space apart from variables\.

### 2\. Dynamic Programming

#### **Intuition:**

The dynamic programming approach incrementally builds a solution using previous results\. The key insight is recognizing that the size of the square submatrix ending at position `(i, j)` can be determined by the smallest square ending at positions `(i-1, j)`, `(i, j-1)`, and `(i-1, j-1)`, if `(i, j)` itself is `1`\.

*   Create a DP table where `dp[i][j]` represents the size of the largest square submatrix with all ones ending at `(i, j)`\.
*   Update this table iteratively based on the above relation\.
*   Sum up all the entries in the DP table to get the total count of squares\.

#### **Code:**

```java
class Solution {
   public int countSquares(int[][] matrix) {
       int m = matrix.length;
       int n = matrix[0].length;
       int[][] dp = new int[m][n];
       int count = 0;

       for (int i = 0; i < m; i++) {
           for (int j = 0; j < n; j++) {
               // Base case: First row or first column
               if (i == 0 || j == 0) {
                   dp[i][j] = matrix[i][j];
               } else if (matrix[i][j] == 1) {
                   // Determine min square size possible
                   dp[i][j] = Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1])) + 1;
               }
               // Add to total count
               count += dp[i][j];
           }
       }

       return count;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where m and n are the dimensions of the matrix\. Each cell is processed once\.
*   **Space Complexity:** O\(1\), since we are using no extra space apart from variables\.

#### [Solve it on LeetCode](https://leetcode.com/problems/count-square-submatrices-with-all-ones)
