---
title: Unique Paths II
description: Master Unique Paths II in the Dynamic Programming module.
  Comprehensive guide and algorithmic problem solving.
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

You are given an `m x n` integer array `grid`\. There is a robot initially located at the **top\-left corner** \(i\.e\., `grid[0][0]`\)\. The robot tries to move to the **bottom\-right corner** \(i\.e\., `grid[m - 1][n - 1]`\)\. The robot can only move either down or right at any point in time\.

An obstacle and space are marked as `1` or `0` respectively in `grid`\. A path that the robot takes cannot include **any** square that is an obstacle\.

Return _the number of possible unique paths that the robot can take to reach the bottom\-right corner_\.

The testcases are generated so that the answer will be less than or equal to `2 * 10``9`\.

##### **Example 1:**

**Input:** obstacleGrid = \[\[0,0,0\],\[0,1,0\],\[0,0,0\]\]

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

**Output:** 2

**Explanation:** There is one obstacle in the middle of the 3x3 grid above\.

There are two ways to reach the bottom\-right corner:

1\. Right \-> Right \-> Down \-> Down

2\. Down \-> Down \-> Right \-> Right

##### **Example 2:**

**Input:** obstacleGrid = \[\[0,1\],\[0,0\]\]

**Output:** 1

##### **Constraints:**

*   `m == obstacleGrid.length`
*   `n == obstacleGrid[i].length`
*   `1 <= m, n <= 100`
*   `obstacleGrid[i][j]` is `0` or `1`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/unique-paths-ii)

# Approaches

## 1\. Recursive Backtracking

#### **Intuition**:

The recursive backtracking approach is a brute force method where we explore every possible path from the starting point to the destination, taking into account obstacles\. This involves trying to move right and down at each step recursively\.

#### Code:

Java

```java
class Solution {
   public int uniquePathsWithObstacles(int[][] obstacleGrid) {
       return countPaths(0, 0, obstacleGrid);
   }
   
   // Helper method to recursively explore paths
   private int countPaths(int row, int col, int[][] grid) {
       // Base cases
       if (row >= grid.length || col >= grid[0].length || grid[row][col] == 1) {
           return 0; // Out of bounds or hit an obstacle
       }
       if (row == grid.length - 1 && col == grid[0].length - 1) {
           return 1; // Reached destination
       }
       // Explore both directions: right and down
       int rightPaths = countPaths(row, col + 1, grid);
       int downPaths = countPaths(row + 1, col, grid);
       return rightPaths + downPaths; // Total paths from current position
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(2^\(m\+n\)\) — Each point can either move right or down, resulting in exponential time\.
*   **Space Complexity:** O\(m\+n\) — Recursive stack space\.

## 2\. Memoization

#### **Intuition**:

Memoization will be used to store results of already computed paths for each grid cell to avoid redundant calculations\. This is an optimization to the recursive approach\.

#### Code:

Java

```java
class Solution {
   public int uniquePathsWithObstacles(int[][] obstacleGrid) {
       int[][] memo = new int[obstacleGrid.length][obstacleGrid[0].length];
       for (int[] row : memo) {
           Arrays.fill(row, -1);
       }
       return countPaths(0, 0, obstacleGrid, memo);
   }
   
   private int countPaths(int row, int col, int[][] grid, int[][] memo) {
       if (row >= grid.length || col >= grid[0].length || grid[row][col] == 1) {
           return 0;
       }
       if (row == grid.length - 1 && col == grid[0].length - 1) {
           return 1;
       }
       if (memo[row][col] != -1) {
           return memo[row][col];
       }
       int rightPaths = countPaths(row, col + 1, grid, memo);
       int downPaths = countPaths(row + 1, col, grid, memo);
       memo[row][col] = rightPaths + downPaths;
       return memo[row][col];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(m\*n\) — Each cell is computed once\.
*   **Space Complexity:** O\(m\*n\) \+ O\(m\+n\) — Space for memo array and recursion stack\.

## 3\. Dynamic Programming

#### **Intuition**:

Using a table to systematically compute the number of unique paths to each cell, considering obstacles\.

#### Code:

Java

```java
class Solution {
   public int uniquePathsWithObstacles(int[][] obstacleGrid) {
       int m = obstacleGrid.length;
       int n = obstacleGrid[0].length;
       int[][] dp = new int[m][n];

       // Initialize the first cell
       dp[0][0] = obstacleGrid[0][0] == 0 ? 1 : 0;

       // Fill the first column
       for (int i = 1; i < m; i++) {
           dp[i][0] = obstacleGrid[i][0] == 0 ? dp[i-1][0] : 0;
       }
       
       // Fill the first row
       for (int j = 1; j < n; j++) {
           dp[0][j] = obstacleGrid[0][j] == 0 ? dp[0][j-1] : 0;
       }

       // Fill the rest of the dp table
       for (int i = 1; i < m; i++) {
           for (int j = 1; j < n; j++) {
               if (obstacleGrid[i][j] == 0) {
                   dp[i][j] = dp[i-1][j] + dp[i][j-1];
               }
           }
       }

       return dp[m-1][n-1];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(m\*n\) — We iterate through each cell once\.
*   **Space Complexity:** O\(m\*n\) — Space for the dp array\.

## 4\. Dynamic Programming with Space Optimization

#### **Intuition**:

By leveraging the fact that we only need the previous row and previous column to calculate the current cell's paths, we can optimize the space to O\(n\) using a single array\.

#### Code:

Java

```java
class Solution {
   public int uniquePathsWithObstacles(int[][] obstacleGrid) {
       int m = obstacleGrid.length;
       int n = obstacleGrid[0].length;
       int[] dp = new int[n];
       
       // Initialize the first cell
       dp[0] = obstacleGrid[0][0] == 0 ? 1 : 0;
       
       for (int i = 0; i < m; i++) {
           for (int j = 0; j < n; j++) {
               if (obstacleGrid[i][j] == 1) {
                   dp[j] = 0;
               } else if (j > 0) {
                   dp[j] += dp[j-1];
               }
           }
       }
       
       return dp[n-1];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(m\*n\) — We iterate through each cell once\.
*   **Space Complexity:** O\(n\) — Space for the 1\-D dp array\.