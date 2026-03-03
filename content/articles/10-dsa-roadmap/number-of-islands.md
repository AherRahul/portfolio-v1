---
title: Number of Islands
description: Master Number of Islands in the Graphs module. Comprehensive guide
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

Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s \(land\) and `'0'`s \(water\), return _the number of islands_\.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically\. You may assume all four edges of the grid are all surrounded by water\.

##### **Example 1:**

**Input:** grid

**Output:** 1

##### **Example 2:**

**Input:** grid

**Output:** 3

##### **Constraints:**

*   `m == grid.length`
*   `n == grid[i].length`
*   `1 <= m, n <= 300`
*   `grid[i][j]` is `'0'` or `'1'`\.


## Approaches

### 1\. DFS Approach

#### Intuition:

The problem can be effectively solved by considering the grid as a graph\. Here each '1' is a land and '0' is water\. An island is simply a connected component of '1's, thus our goal is to count these connected components\. Depth First Search \(DFS\) can be used to traverse each island starting from an unexplored piece of land \('1'\) and marking all the connected lands to avoid multiple counting\.

#### Steps:

*   Traverse each cell in the grid\.
*   When a '1' is found, initiate a DFS \(or flood fill\) from there, marking all connected '1's as visited by changing them to '0'\.
*   Each DFS initiation indicates a new island\.

#### Code:

```java
class Solution {
   public int numIslands(char[][] grid) {
       if (grid == null || grid.length == 0) {
           return 0;
       }
       
       int numIslands = 0;
       int rows = grid.length;
       int cols = grid[0].length;
       
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               // If we find an unvisited land
               if (grid[r][c] == '1') {
                   // We found a new island
                   numIslands++;
                   // Mark the entire island as visited
                   dfs(grid, r, c);
               }
           }
       }
       
       return numIslands;
   }

   // Recursive method to mark connected lands
   private void dfs(char[][] grid, int r, int c) {
       int rows = grid.length;
       int cols = grid[0].length;

       // Return if out of bounds or a water cell
       if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] == '0') {
           return;
       }

       // Mark the cell as visited
       grid[r][c] = '0';

       // Explore all four directions
       dfs(grid, r - 1, c); // Up
       dfs(grid, r + 1, c); // Down
       dfs(grid, r, c - 1); // Left
       dfs(grid, r, c + 1); // Right
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(M \* N\) where M is the number of rows and N is the number of columns\.
*   **Space Complexity:** O\(M \* N\) in worst case for the recursion stack\.

### 2\. BFS Approach

#### Intuition:

Similar to DFS, the Breadth First Search \(BFS\) approach is another way to traverse the islands\. Instead of traversing deeply through each piece of land, BFS explores all the neighbors of a current land and queues them for further exploration\.

#### Steps:

*   Traverse the grid to identify an unvisited '1'\.
*   Use a queue to process all adjacent lands to explore the whole island\.
*   Mark all visited lands to ensure no double counting\.

#### Code:

```java
class Solution {
   public int numIslands(char[][] grid) {
       if (grid == null || grid.length == 0) {
           return 0;
       }
       
       int numIslands = 0;
       int rows = grid.length;
       int cols = grid[0].length;
       int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}}; // Down, up, right, left
       
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               if (grid[r][c] == '1') {
                   numIslands++;
                   Queue<int[]> queue = new LinkedList<>();
                   queue.add(new int[]{r, c});
                   grid[r][c] = '0'; // Mark as visited

                   while (!queue.isEmpty()) {
                       int[] current = queue.poll();
                       for (int[] dir : directions) {
                           int newRow = current[0] + dir[0];
                           int newCol = current[1] + dir[1];

                           // Check boundaries and if the land is unvisited
                           if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && grid[newRow][newCol] == '1') {
                               queue.add(new int[]{newRow, newCol});
                               grid[newRow][newCol] = '0'; // Mark as visited
                           }
                       }
                   }
               }
           }
       }
       return numIslands;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(M \* N\) where M is the number of rows and N is the number of columns\.
*   **Space Complexity:** O\(min\(M, N\)\) for the BFS queue\.

### 3\. Union\-Find Approach

#### Intuition:

This approach uses the Union\-Find \(Disjoint Set Union\) data structure which is optimal when working with connected components problems\. Each cell containing a '1' can be initially thought of as its own island, and then we connect lands that are adjacent, effectively reducing the island count when we union two lands\.

#### Steps:

*   Initialize each '1' as its own set\.
*   Union adjacent lands thereby reducing the total number of islands\.
*   The final number of unique parent sets represents the number of islands\.

#### Code:

```java
class Solution {
   public int numIslands(char[][] grid) {
       if (grid == null || grid.length == 0) {
           return 0;
       }
       
       int rows = grid.length;
       int cols = grid[0].length;
       UnionFind uf = new UnionFind(grid);
       
       int[][] directions = {{1, 0}, {0, 1}}; // We just need to check bottom and right to avoid redundancy
       
       for (int r = 0; r < rows; r++) {
           for (int c = 0; c < cols; c++) {
               if (grid[r][c] == '1') {
                   for (int[] dir : directions) {
                       int newRow = r + dir[0];
                       int newCol = c + dir[1];
                       
                       if (newRow < rows && newCol < cols && grid[newRow][newCol] == '1') {
                           uf.union(r * cols + c, newRow * cols + newCol);
                       }
                   }
               }
           }
       }
       
       return uf.getCount();
   }
   
   class UnionFind {
       int[] parent;
       int[] rank;
       int count;
       
       public UnionFind(char[][] grid) {
           int rows = grid.length;
           int cols = grid[0].length;
           parent = new int[rows * cols];
           rank = new int[rows * cols];
           count = 0;
           
           for (int r = 0; r < rows; r++) {
               for (int c = 0; c < cols; c++) {
                   if (grid[r][c] == '1') {
                       int id = r * cols + c;
                       parent[id] = id; // Each node is its own parent
                       count++;
                   }
               }
           }
       }
       
       public int find(int i) {
           if (parent[i] != i) {
               parent[i] = find(parent[i]); // Path compression
           }
           return parent[i];
       }
       
       public void union(int x, int y) {
           int rootX = find(x);
           int rootY = find(y);
           
           if (rootX != rootY) {
               if (rank[rootX] > rank[rootY]) {
                   parent[rootY] = rootX;
               } else if (rank[rootX] < rank[rootY]) {
                   parent[rootX] = rootY;
               } else {
                   parent[rootY] = rootX;
                   rank[rootX]++;
               }
               count--; // Reduce the island count as we union
           }
       }
       
       public int getCount() {
           return count;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(M \* N \* alpha\(M \* N\)\) where **alpha** is the Inverse Ackermann function, which is nearly constant for all practical purposes\.
*   **Space Complexity:** O\(M \* N\) due to the parent and rank arrays\.

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-islands)
