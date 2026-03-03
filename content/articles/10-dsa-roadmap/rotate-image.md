---
title: Rotate Image
description: Master Rotate Image in the Matrix module. Comprehensive guide and
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

You are given an `n x n` 2D `matrix` representing an image, rotate the image by **90** degrees \(clockwise\)\.

You have to rotate the image [**in\-place**](https://en.wikipedia.org/wiki/In-place_algorithm), which means you have to modify the input 2D matrix directly\. **DO NOT** allocate another 2D matrix and do the rotation\.

##### **Example 1:**

Input:matrix=\[\[1,2,3\],\[4,5,6\],\[7,8,9\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">9</span></div>
    </div>
  </div>
</div>

Output:\[\[7,4,1\],\[8,5,2\],\[9,6,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">9</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

##### **Example 2:**

Input:matrix=\[\[5,1,9,11\],\[2,4,8,10\],\[13,3,6,7\],\[15,14,12,16\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">9</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">11</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">13</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">14</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">12</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">16</span></div>
    </div>
  </div>
</div>

11

10

13

15

14

12

16

**Output:**

Output:\[\[15,13,2,5\],\[14,3,4,1\],\[12,6,8,9\],\[16,7,10,11\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">13</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">5</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">14</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">12</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">9</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">16</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">11</span></div>
    </div>
  </div>
</div>

15

13

14

12

16

10

11

##### **Constraints:**

*   **n == matrix\.length == matrix\[i\]\.length**
*   **1 <= n <= 20**
*   **\-1000 <= matrix\[i\]\[j\] <= 1000**


## Approaches

### 1\. Brute Force with Extra Space

#### **Intuition:**

To rotate a matrix clockwise by 90 degrees, we can utilize an auxiliary matrix\. The idea is to iterate through each element of the matrix and place it appropriately in the new matrix\. Specifically, each element at position `(i, j)` in the original matrix will be placed at position `(j, n-1-i)` in the rotated matrix\.

#### **Steps:**

1.  Create an auxiliary matrix of the same size as the input matrix\.
2.  For each element in the original matrix, calculate its new position in the auxiliary matrix using the formula: `rotated[j][n-1-i] = original[i][j]`\.
3.  Copy the rotated matrix back to the original matrix\.

#### **Code:**

```java
class Solution {
   public void rotate(int[][] matrix) {
       int n = matrix.length;
       // Create an auxiliary matrix to hold the rotated form
       int[][] rotated = new int[n][n];
       
       // Fill the rotated matrix by rotating elements clockwise
       for (int i = 0; i < n; i++) {
           for (int j = 0; j < n; j++) {
               rotated[j][n - 1 - i] = matrix[i][j];
           }
       }
       
       // Copy the rotated matrix back to the original matrix
       for (int i = 0; i < n; i++) {
           for (int j = 0; j < n; j++) {
               matrix[i][j] = rotated[i][j];
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where `n` is the number of rows \(or columns\) in the matrix\.
*   **Space Complexity:** O\(n^2\) for the auxiliary matrix\.

### 2\. In\-Place Transpose and Reverse

#### **Intuition:**

A more efficient solution is to perform the transformation in place by first transposing the matrix \(flipping it over its diagonal\) and then reversing each row\. Transposing by itself will reorder the elements diagonally, while reversing will yield the required 90\-degree clockwise rotation\.

#### **Steps:**

1.  **Transpose the Matrix:** Swap each element `(i, j)` with the element `(j, i)`\.
2.  **Reverse Each Row:** For each row in the transposed matrix, reverse the elements of the row\.

#### **Code:**

```java
class Solution {
   public void rotate(int[][] matrix) {
       int n = matrix.length;
       
       // Transpose the matrix
       for (int i = 0; i < n; i++) {
           for (int j = i; j < n; j++) {
               // Swap elements on the diagonal
               int temp = matrix[i][j];
               matrix[i][j] = matrix[j][i];
               matrix[j][i] = temp;
           }
       }
       
       // Reverse each row
       for (int i = 0; i < n; i++) {
           int start = 0;
           int end = n - 1;
           while (start < end) {
               // Swap elements to reverse the row
               int temp = matrix[i][start];
               matrix[i][start] = matrix[i][end];
               matrix[i][end] = temp;
               start++;
               end--;
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where `n` is the number of rows \(or columns\) in the matrix\.
*   **Space Complexity:** O\(1\), since we are doing the operations in place without using extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/rotate-image)
