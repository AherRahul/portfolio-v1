---
title: Set Matrix Zeroes
description: Master Set Matrix Zeroes in the Matrix module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`'s\.

You must do it [in place](https://en.wikipedia.org/wiki/In-place_algorithm)\. 

##### **Example 1:**

Input:matrix=\[\[1,1,1\],\[1,0,1\],\[1,1,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

Output:\[\[1,0,1\],\[0,0,0\],\[1,0,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

##### **Example 2:**

Input:matrix=\[\[0,1,2,0\],\[3,4,5,2\],\[1,3,1,5\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
    </div>
  </div>
</div>

Output:\[\[0,0,0,0\],\[0,4,5,0\],\[0,3,1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

#### **Constraints:**

*   **m == matrix\.length**
*   **n == matrix\[0\]\.length**
*   **1 <= m, n <= 200**
*   **\-2****31** **<= matrix\[i\]\[j\] <= 2****31** **\- 1**

#### **Follow up:**

*   A straightforward solution using `O(mn)` space is probably a bad idea\.
*   A simple improvement uses `O(m + n)` space, but still not the best solution\.
*   Could you devise a constant space solution?


## Approaches

### 1\. Brute Force

#### **Intuition:**

The brute force method involves identifying which rows and columns should be set to zero by iterating over the matrix\. We first create a copy of the matrix\. Using this copy, we iterate over the entire original matrix\. If an element is zero, we set all the elements in the corresponding row and column in the copied matrix to zero\. After processing, the original matrix is updated to match the copied matrix\.

#### **Steps:**

1.  Create a copy of the original matrix\.
2.  Iterate over each element\. If an element is 0, mark the entire row and column in the copied matrix as 0\.
3.  Finally, copy the values from the new matrix to the original matrix\.

#### **Code:**

```java
class Solution {
   public void setZeroes(int[][] matrix) {
       int rows = matrix.length;
       int cols = matrix[0].length;
       int[][] copy = new int[rows][cols];
       
       // Copy the original matrix
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               copy[r][c] = matrix[r][c];
           }
       }
       
       // Process the matrix using copy
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               if (matrix[r][c] == 0) {
                   // Set entire row to zero
                   for (int rc = 0; rc < cols; rc++) {
                       copy[r][rc] = 0;
                   }
                   // Set entire column to zero
                   for (int rr = 0; rr < rows; rr++) {
                       copy[rr][c] = 0;
                   }
               }
           }
       }
       
       // Copy back the zeroed matrix
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               matrix[r][c] = copy[r][c];
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where m is the number of rows and n is the number of columns\.
*   **Space Complexity:** O\(m \* n\), due to the additional matrix copy\.

### 2\. Using Additional Arrays

#### **Intuition:**

Instead of using a complete matrix to keep track of which rows and columns need to be zeroed, we can use two separate arrays\. One for rows and another for columns that need to be zeroed\. This makes the algorithm more space efficient\.

#### **Steps:**

1.  Use two arrays `zeroRows` and `zeroCols` to track rows and columns with zeroes\.
2.  First, iterate through the original matrix to fill `zeroRows` and `zeroCols`\.
3.  Iterate again through the matrix, using `zeroRows` and `zeroCols` to set the appropriate rows and columns to zero\.

#### **Code:**

```java
class Solution {
   public void setZeroes(int[][] matrix) {
       int rows = matrix.length;
       int cols = matrix[0].length;
       boolean[] zeroRows = new boolean[rows];
       boolean[] zeroCols = new boolean[cols];

       // First pass to record zero rows and columns
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               if (matrix[r][c] == 0) {
                   zeroRows[r] = true;
                   zeroCols[c] = true;
               }
           }
       }

       // Second pass to set zero rows and columns
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               if (zeroRows[r] || zeroCols[c]) {
                   matrix[r][c] = 0;
               }
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where m is the number of rows and n is the number of columns\.
*   **Space Complexity:** O\(m \+ n\) for the row and column arrays\.

### 3\. In\-Place

#### **Intuition:**

To achieve O\(1\) additional space complexity, we can use the input matrix itself to store the required information\. We mark the first cell of the respective row and column as zero if we encounter a zero during our matrix traversal\. We should be careful while marking to save the state of the first row and column initially because they will be modified during the marking process\.

#### **Steps:**

1.  Determine if the first row and first column need to be zeroed for later reference\.
2.  Use the first row and first column to mark whether a row or column should be zero\.
3.  Iterate over the matrix starting from `[1][1]`, and use the markers in the first row and column to set zeroes\.
4.  Finally, handle zeroing of the first row and column based on the stored state in step 1\.

#### **Code:**

```java
class Solution {
   public void setZeroes(int[][] matrix) {
       int rows = matrix.length;
       int cols = matrix[0].length;

       // Determine if first row and column will need zeroing
       boolean firstRowZero = false, firstColZero = false;

       for (int c = 0; c < cols; c++) {
           if (matrix[0][c] == 0) {
               firstRowZero = true;
               break;
           }
       }

       for (int r = 0; r < rows; r++) {
           if (matrix[r][0] == 0) {
               firstColZero = true;
               break;
           }
       }

       // Use first row and column as markers
       for (int r = 1; r < rows; r++) {
           for (int c = 1; c < cols; c++) {
               if (matrix[r][c] == 0) {
                   matrix[r][0] = 0;
                   matrix[0][c] = 0;
               }
           }
       }

       // Set matrix zeroes using markers
       for (int r = 1; r < rows; r++) {
           for (int c = 1; c < cols; c++) {
               if (matrix[r][0] == 0 || matrix[0][c] == 0) {
                   matrix[r][c] = 0;
               }
           }
       }

       // Zero first row if needed
       if (firstRowZero) {
           for (int c = 0; c < cols; c++) {
               matrix[0][c] = 0;
           }
       }

       // Zero first column if needed
       if (firstColZero) {
           for (int r = 0; r < rows; r++) {
               matrix[r][0] = 0;
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where m is the number of rows and n is the number of columns\.
*   **Space Complexity:** O\(1\), utilizing the matrix itself for storage\.

#### [Solve it on LeetCode](https://leetcode.com/problems/set-matrix-zeroes)
