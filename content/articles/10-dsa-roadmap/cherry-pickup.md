---
title: Cherry Pickup
description: Master Cherry Pickup in the Dynamic Programming module.
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

You are given an `n x n` `grid` representing a field of cherries, each cell is one of three possible integers\.

*   `0` means the cell is empty, so you can pass through,
*   `1` means the cell contains a cherry that you can pick up and pass through, or
*   `-1` means the cell contains a thorn that blocks your way\.

Return _the maximum number of cherries you can collect by following the rules below_:

*   Starting at the position `(0, 0)` and reaching `(n - 1, n - 1)` by moving right or down through valid path cells \(cells with value `0` or `1`\)\.
*   After reaching `(n - 1, n - 1)`, returning to `(0, 0)` by moving left or up through valid path cells\.
*   When passing through a path cell containing a cherry, you pick it up, and the cell becomes an empty cell `0`\.
*   If there is no valid path between `(0, 0)` and `(n - 1, n - 1)`, then no cherries can be collected\.

##### **Example 1:**

Input:grid=\[\[0,1,\-1\],\[1,0,\-1\],\[1,1,1\]\]

0

1

2

0

0

1

\-1

1

1

0

\-1

2

1

1

1

**Output:** 5

**Explanation:** The player started at \(0, 0\) and went down, down, right right to reach \(2, 2\)\.

4 cherries were picked up during this single trip, and the matrix becomes \[\[0,1,\-1\],\[0,0,\-1\],\[0,0,0\]\]\.

Then, the player went left, up, up, left to return home, picking up one more cherry\.

The total number of cherries picked up is 5, and this is the maximum possible\.

##### **Example 2:**

Input:grid=\[\[1,1,\-1\],\[1,\-1,1\],\[\-1,1,1\]\]

0

1

2

0

1

1

\-1

1

1

\-1

1

2

\-1

1

1

**Output:** 0

##### **Constraints:**

*   `n == grid.length`
*   `n == grid[i].length`
*   `1 <= n <= 50`
*   `grid[i][j]` is `-1`, `0`, or `1`\.
*   `grid[0][0] != -1`
*   `grid[n - 1][n - 1] != -1`

#### [Solve it on LeetCode](https://leetcode.com/problems/cherry-pickup)

# Approaches

## 1\. Recursive Approach

The idea is to use a recursive approach, trying to solve the problem by walking from the top\-left to the bottom\-right and then back again\. Since there are two distinct paths \(forward and backward\), the problem can be visualized like two people moving simultaneously across the grid\.

#### Intuition:

*   You start at the top\-left of the grid and try to reach the bottom\-right corner\.
*   Think of this problem as having two people start at \(0, 0\) and both try to end at \(n\-1, n\-1\)\.
*   The task is to collect the maximum number of cherries from the top left to the bottom right and back to the top left\.

#### Pseudocode:

1.  Define a recursive function `maxCherries(r1, c1, r2, c2)` where `r1, c1` are the row and column for the first person, and `r2, c2` for the second person\.
2.  If either of the two paths is out of the grid or hits a thorn, return a large negative number because it’s not a valid path\.
3.  When we reach the bottom\-right corner, return the value of the point \(they add the cherry picked\) except if it's the last point\.
4.  Otherwise, try all possible moves for both persons, and accumulate the maximum cherries possible\.

#### Code:

Java

```java
class Solution {
   public int cherryPickup(int[][] grid) {
       int n = grid.length;
       return Math.max(0, dfs(grid, 0, 0, 0, n, new Integer[n][n][n]));
   }

   private int dfs(int[][] grid, int r1, int c1, int r2, int n, Integer[][][] dp) {
       int c2 = r1 + c1 - r2;
       
       if (r1 == n || r2 == n || c1 == n || c2 == n ||
           grid[r1][c1] == -1 || grid[r2][c2] == -1) {
           return Integer.MIN_VALUE;
       }
       
       if (r1 == n - 1 && c1 == n - 1) {
           return grid[r1][c1];
       }
       
       if (dp[r1][c1][r2] != null) {
           return dp[r1][c1][r2];
       }

       int cherryCount = grid[r1][c1];
       if (r1 != r2) {
           cherryCount += grid[r2][c2];
       }

       int next = Math.max(Math.max(dfs(grid, r1 + 1, c1, r2 + 1, n, dp), dfs(grid, r1, c1 + 1, r2, n, dp)),
                           Math.max(dfs(grid, r1 + 1, c1, r2, n, dp), dfs(grid, r1, c1 + 1, r2 + 1, n, dp)));
       
       cherryCount += next;
       dp[r1][c1][r2] = cherryCount;
       
       return cherryCount;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^3\), where n is the size of the grid\. This is because the recursive function is called for every possible \(r1, c1, r2\), which together represent the state\.
*   **Space Complexity:** O\(n^3\), for the memoization cache to save subproblem results\.

## 2\. Dynamic Programming Approach

The recursive method will be inefficient for larger grids due to redundant calculations\. Dynamic Programming \(DP\) allows us to break down the problem into smaller overlapping subproblems, caching results and reusing them\.

#### Intuition:

*   We'll use a 3D DP array where `dp[r1][c1][r2]` represents the maximum number of cherries both persons can pick starting from cell `(r1, c1)` and `(r2, c2)` respectively to cell `(n-1, n-1)` and back\.
*   The base case is reaching `(n-1, n-1)` where if both arrive together at this point, they can pick the cherries there only once\.

#### Code:

Java

```java
class Solution {
   public int cherryPickup(int[][] grid) {
       int n = grid.length;
       int[][][] dp = new int[n][n][n];

       for (int[][] mat : dp) {
           for (int[] row : mat) {
               Arrays.fill(row, Integer.MIN_VALUE);
           }
       }

       return Math.max(0, dp(0, 0, 0, grid, dp));
   }

   private int dp(int r1, int c1, int r2, int[][] grid, int[][][] dp) {
       int n = grid.length;
       int c2 = r1 + c1 - r2;
       
       if (r1 == n || r2 == n || c1 == n || c2 == n ||
           grid[r1][c1] == -1 || grid[r2][c2] == -1) {
           return Integer.MIN_VALUE;
       }

       if (r1 == n - 1 && c1 == n - 1) {
           return grid[r1][c1];
       }
       
       if (dp[r1][c1][r2] != Integer.MIN_VALUE) {
           return dp[r1][c1][r2];
       }

       int cherryCount = grid[r1][c1];
       if (r1 != r2) {
           cherryCount += grid[r2][c2];
       }

       int next = Math.max(Math.max(dp(r1 + 1, c1, r2 + 1, grid, dp), dp(r1, c1 + 1, r2, grid, dp)),
                           Math.max(dp(r1 + 1, c1, r2, grid, dp), dp(r1, c1 + 1, r2 + 1, grid, dp)));
       
       cherryCount += next;
       dp[r1][c1][r2] = cherryCount;

       return cherryCount;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^3\) due to the nested loops on the size of the grid\.
*   **Space Complexity:** O\(n^3\) due to the storage of the DP state table\.

## 3\. Dynamic Programming with State Compression

In this enhanced variation, we reduce the space complexity further by understanding that only the immediate previous row states are needed to compute the current row state in a 2D traversal\.

#### Intuition:

Use only a 2D DP array, reducing space complexity but altering our method to fit inline with computed states\.

#### Code:

Java

```java
class Solution {
   public int cherryPickup(int[][] grid) {
       int n = grid.length;
       int[][] dp = new int[n][n];
       
       for (int r = n - 1; r >= 0; r--) {
           for (int c1 = n - 1; c1 >= 0; c1--) {
               for (int c2 = n - 1; c2 >= 0; c2--) {
                   if (grid[r][c1] == -1 || grid[r][c2] == -1) {
                       dp[c1][c2] = Integer.MIN_VALUE;
                       continue;
                   }
                   
                   int result = grid[r][c1];
                   if (c1 != c2) {
                       result += grid[r][c2];
                   }
                   
                   if (r != n - 1) {
                       result += Math.max(Math.max(dp[c1][c2], dp[c1 + 1][c2]), 
                                          Math.max(dp[c1][c2 + 1], dp[c1 + 1][c2 + 1]));
                   }
                   
                   dp[c1][c2] = result;
               }
           }
       }

       return Math.max(0, dp[0][0]);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^3\), as it goes through the elements considering possible paths\.
*   **Space Complexity:** O\(n^2\), as it only considers states of two dimensions in a compressed fashion\.