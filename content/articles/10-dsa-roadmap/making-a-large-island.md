---
title: Making A Large Island
description: Master Making A Large Island in the Graphs module. Comprehensive
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

You are given an `n x n` binary matrix `grid`\. You are allowed to change **at most one** `0` to be `1`\.

Return _the size of the largest_ _**island**_ _in_ `grid` _after applying this operation_\.

An **island** is a 4\-directionally connected group of `1`s\.

##### **Example 1:**

**Input:** grid = \[\[1,0\],\[0,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** 3

**Explanation:** Change one 0 to 1 and connect two 1s, then we get an island with area = 3\.

##### **Example 2:**

**Input:** grid = \[\[1,1\],\[1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Output:** 4

**Explanation:** Change the 0 to 1 and make the island bigger, only one island with area = 4\.

##### **Example 3:**

**Input:** grid = \[\[1,1\],\[1,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** 4

**Explanation:** Can't change any 0 to 1, only one island with area = 4\.

##### **Constraints:**

*   `n == grid.length`
*   `n == grid[i].length`
*   `1 <= n <= 500`
*   `grid[i][j]` is either `0` or `1`\.


## Approaches

### 1\. Brute Force Approach

#### Intuition:

In this initial approach, the goal is to change each `0` in the grid to `1` one by one and calculate the size of the island it can form\. For each conversion, we calculate the potential size of the island and keep track of the maximum size encountered\. The key idea is to perform a depth\-first search \(DFS\) to calculate the size of each connected component \(island\)\.

#### Steps:

1.  For each cell in the grid that contains a `0`, temporarily change it to a `1`\.
2.  Use DFS to calculate the size of the island this change creates\.
3.  Restore the cell back to `0` and continue to the next `0`\.
4.  Return the maximum island size found\.

#### Code:

```java
class Solution {
   public int largestIsland(int[][] grid) {
       int n = grid.length;
       int maxSize = 0;
       
       for (int i = 0; i < n; i++) {
           for (int j = 0; j < n; j++) {
               if (grid[i][j] == 0) {
                   grid[i][j] = 1; // Temporarily change 0 to 1
                   boolean[][] visited = new boolean[n][n];
                   int size = getIslandSize(grid, visited, i, j);
                   maxSize = Math.max(maxSize, size);
                   grid[i][j] = 0; // Restore the cell back to 0
               }
           }
       }
       
       return maxSize == 0 ? n * n : maxSize; // If no 0 is found, the entire grid is 1s
   }

   private int getIslandSize(int[][] grid, boolean[][] visited, int i, int j) {
       // Out of bounds or already visited or water
       if (i < 0 || i >= grid.length || j < 0 || j >= grid.length ||
           visited[i][j] || grid[i][j] == 0) return 0;
       
       visited[i][j] = true;
       int size = 1; // Current cell
       
       // Explore 4 directions
       size += getIslandSize(grid, visited, i + 1, j);
       size += getIslandSize(grid, visited, i - 1, j);
       size += getIslandSize(grid, visited, i, j + 1);
       size += getIslandSize(grid, visited, i, j - 1);
       
       return size;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^4\), where n is the size of the grid\. For each `0` in the grid, a complete DFS traversal happens\.
*   **Space Complexity:** O\(n^2\), due to the visited matrix\.

### 2\. Optimized Approach with Connected Components

#### Intuition:

To optimize, pre\-calculate the sizes of all connected components \(islands\) and then analyze the potential contributions of each `0` within the grid\. We use different numeric IDs for different islands and store the size corresponding to each ID\. This approach reduces unnecessary recalculations\.

#### Steps:

1.  Assign unique IDs to each connected component using DFS and calculate their sizes\.
2.  Store these sizes in a map with the ID as the key\.
3.  For each `0`, check its 4 neighboring cells and sum the sizes of distinct islands formed by adjacent `1`s\.
4.  The maximum size achieved by flipping a `0` is stored as the result\.

#### Code:

```java
class Solution {
   public int largestIsland(int[][] grid) {
       int n = grid.length;
       int maxSize = 0;
       Map<Integer, Integer> sizeMap = new HashMap<>();
       int index = 2; // Start index at 2 to avoid confusion with 1 and 0
       
       // Label each connected component with a unique ID and calculate its size
       for (int i = 0; i < n; i++) {
           for (int j = 0; j < n; j++) {
               if (grid[i][j] == 1) {
                   int size = dfsLabel(grid, i, j, index);
                   sizeMap.put(index, size);
                   index++;
               }
           }
       }
       
       // Iterate over each 0 and calculate potential island size
       for (int i = 0; i < n; i++) {
           for (int j = 0; j < n; j++) {
               if (grid[i][j] == 0) {
                   Set<Integer> visitedIslands = new HashSet<>();
                   int potentialSize = 1; // Starting with the cell being flipped
                   for (int[] dir : new int[][]{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}) {
                       int ni = i + dir[0];
                       int nj = j + dir[1];
                       if (ni >= 0 && ni < n && nj >= 0 && nj < n && grid[ni][nj] > 1) {
                           int neighborId = grid[ni][nj];
                           if (!visitedIslands.contains(neighborId)) {
                               potentialSize += sizeMap.get(neighborId);
                               visitedIslands.add(neighborId);
                           }
                       }
                   }
                   maxSize = Math.max(maxSize, potentialSize);
               }
           }
       }
       
       return maxSize == 0 ? n * n : maxSize;
   }

   private int dfsLabel(int[][] grid, int i, int j, int index) {
       if (i < 0 || i >= grid.length || j < 0 || j >= grid.length || grid[i][j] != 1) return 0;
       
       grid[i][j] = index; // Mark visited with unique island ID
       int size = 1; // Current cell
       
       // Explore 4 directions
       size += dfsLabel(grid, i + 1, j, index);
       size += dfsLabel(grid, i - 1, j, index);
       size += dfsLabel(grid, i, j + 1, index);
       size += dfsLabel(grid, i, j - 1, index);
       
       return size;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where n is the size of the grid\. Each cell is part of a recursive DFS once\.
*   **Space Complexity:** O\(n^2\), due to storage in the size map and for visited routes\.

#### [Solve it on LeetCode](https://leetcode.com/problems/making-a-large-island)
