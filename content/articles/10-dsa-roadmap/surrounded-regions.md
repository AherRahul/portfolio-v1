---
title: Surrounded Regions
description: Master Surrounded Regions in the Graphs module. Comprehensive guide
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

You are given an `m x n` matrix `board` containing **letters** `'X'` and `'O'`, **capture regions** that are **surrounded**:

*   **Connect**: A cell is connected to adjacent cells horizontally or vertically\.
*   **Region**: To form a region **connect every** `'O'` cell\.
*   **Surround**: The region is surrounded with `'X'` cells if you can **connect the region** with `'X'` cells and none of the region cells are on the edge of the `board`\.

To capture a **surrounded region**, replace all `'O'`s with `'X'`s **in\-place** within the original board\. You do not need to return anything\.

##### **Example 1:**

**Input:** board = \[\["X","X","X","X"\],\["X","O","O","X"\],\["X","X","O","X"\],\["X","O","X","X"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">O</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">O</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">O</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">O</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
    </div>
  </div>
</div>

X

X

X

X

X

O

O

X

X

X

O

X

X

O

X

X

**Output:**

X

X

X

X

X

X

X

X

X

X

X

X

X

O

X

X

**Explanation:**

In the above diagram, the bottom region is not captured because it is on the edge of the board and cannot be surrounded\.

##### **Example 2:**

**Input:** board = \[\["X"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">X</span></div>
    </div>
  </div>
</div>

**Output:** \[\["X"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">X</span></div>
    </div>
  </div>
</div>

##### **Constraints:**

*   `m == board.length`
*   `n == board[i].length`
*   `1 <= m, n <= 200`
*   `board[i][j]` is `'X'` or `'O'`\.


## Approaches

### 1\. Simple DFS Approach

#### **Intuition**:

The problem can be approached using DFS to explore connected regions\. The idea is to identify regions of 'O's connected to the boundary, which cannot be surrounded\. All other 'O's can be flipped to 'X' as they are enclosed\.

#### **Steps**:

1.  Traverse all boundary cells and run a DFS for each cell containing 'O'\.
2.  In the DFS, mark every 'O' connected directly or indirectly as a safe entity \(for example, temporarily replace 'O' with another character like '\#'\)\.
3.  After marking, traverse the matrix again:

*   Convert the safe '\#'' back to 'O'\.
*   Change remaining 'O's to 'X'\.

#### Code:

```java
class Solution {
   public void solve(char[][] board) {
       if (board == null || board.length == 0) return;

       int rows = board.length;
       int cols = board[0].length;

       // Step 1 & 2: Perform DFS for each O on the boundary
       for (int i = 0; i < rows; i++) {
           if (board[i][0] == 'O') dfs(board, i, 0);
           if (board[i][cols - 1] == 'O') dfs(board, i, cols - 1);
       }
       for (int j = 0; j < cols; j++) {
           if (board[0][j] == 'O') dfs(board, 0, j);
           if (board[rows - 1][j] == 'O') dfs(board, rows - 1, j);
       }

       // Step 3: Flip the cells
       for (int i = 0; i < rows; i++) {
           for (int j = 0; j < cols; j++) {
               if (board[i][j] == 'O') board[i][j] = 'X';
               else if (board[i][j] == '#') board[i][j] = 'O';
           }
       }
   }

   private void dfs(char[][] board, int i, int j) {
       // Boundary conditions
       if (i < 0 || j < 0 || i >= board.length || j >= board[0].length || board[i][j] != 'O') {
           return;
       }
       // Mark the cell as safe
       board[i][j] = '#';

       // Check all four directions
       dfs(board, i + 1, j);
       dfs(board, i - 1, j);
       dfs(board, i, j + 1);
       dfs(board, i, j - 1);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where m is the number of rows and n is the number of columns, as we might need to visit every cell\.
*   **Space Complexity:** O\(m \* n\) due to the recursion stack\.

### 2\. Optimized BFS Approach

#### **Intuition**:

Instead of using DFS to solve the problem, we can use BFS\. Using BFS helps to avoid the potential maximum recursion depth reached issue seen with DFS, especially with large matrices\.

#### **Steps**:

1.  Use a queue data structure to implement BFS for boundary 'O's\.
2.  Process in the same manner as DFS\.
3.  At the end, convert '\#' back to 'O' and rest 'O' to 'X'\.

#### Code:

```java
class Solution {
   public void solve(char[][] board) {
       if (board == null || board.length == 0) return;

       int rows = board.length;
       int cols = board[0].length;

       Queue<int[]> queue = new LinkedList<>();
       // Add all boundary 'O's to the queue
       for (int i = 0; i < rows; i++) {
           if (board[i][0] == 'O') queue.offer(new int[]{i, 0});
           if (board[i][cols - 1] == 'O') queue.offer(new int[]{i, cols - 1});
       }
       for (int j = 0; j < cols; j++) {
           if (board[0][j] == 'O') queue.offer(new int[]{0, j});
           if (board[rows - 1][j] == 'O') queue.offer(new int[]{rows - 1, j});
       }

       // Directions for moving in the maze (up, down, left, right)
       int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

       // Perform BFS
       while (!queue.isEmpty()) {
           int[] cell = queue.poll();
           int x = cell[0], y = cell[1];

           if (x < 0 || y < 0 || x >= rows || y >= cols || board[x][y] != 'O') continue;

           board[x][y] = '#';
           for (int[] dir : directions) {
               queue.offer(new int[]{x + dir[0], y + dir[1]});
           }
       }

       // Flip the cells
       for (int i = 0; i < rows; i++) {
           for (int j = 0; j < cols; j++) {
               if (board[i][j] == 'O') board[i][j] = 'X';
               else if (board[i][j] == '#') board[i][j] = 'O';
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\), where m is the number of rows and n is the number of columns\.
*   **Space Complexity:** O\(min\(m, n\)\), which is the queue operational space for BFS\.

### 3\. Union\-Find \(Disjoint Set Union\) Approach

#### **Intuition**:

Union\-Find can be applied to efficiently manage connections\. We can think of each cell as a node, and connect boundary 'O's to a dummy node as they can't be surrounded\. All other unconnected 'O's are converted to 'X'\.

#### **Steps**:

1.  Create a parent array for union\-find\.
2.  Connect every boundary 'O' to a dummy node\.
3.  Connect internal 'O's with their neighbors if they are also 'O'\.
4.  Finally, iterate over the board and change any 'O' not connected to the dummy node to 'X'\.

#### Code:

```java
class Solution {
   private int[] parent;
   private int rows, cols;
   private int dummyNode;

   public void solve(char[][] board) {
       if (board == null || board.length == 0) return;

       rows = board.length;
       cols = board[0].length;
       dummyNode = rows * cols;
       parent = new int[rows * cols + 1];

       // Initialize Union-Find structure
       for (int i = 0; i <= dummyNode; i++) {
           parent[i] = i;
       }

       // Connect boundaries to the dummyNode
       for (int i = 0; i < rows; i++) {
           for (int j = 0; j < cols; j++) {
               if (board[i][j] == 'O') {
                   if (i == 0 || i == rows - 1 || j == 0 || j == cols - 1) {
                       union(i * cols + j, dummyNode);
                   } else {
                       if (i > 0 && board[i - 1][j] == 'O') union(i * cols + j, (i - 1) * cols + j);
                       if (i < rows - 1 && board[i + 1][j] == 'O') union(i * cols + j, (i + 1) * cols + j);
                       if (j > 0 && board[i][j - 1] == 'O') union(i * cols + j, i * cols + j - 1);
                       if (j < cols - 1 && board[i][j + 1] == 'O') union(i * cols + j, i * cols + j + 1);
                   }
               }
           }
       }

       // Flip the unconnected O's
       for (int i = 0; i < rows; i++) {
           for (int j = 0; j < cols; j++) {
               if (board[i][j] == 'O' && find(i * cols + j) != find(dummyNode)) {
                   board[i][j] = 'X';
               }
           }
       }
   }

   private void union(int x, int y) {
       int rootX = find(x);
       int rootY = find(y);
       if (rootX != rootY) {
           parent[rootX] = rootY;
       }
   }

   private int find(int x) {
       if (parent[x] != x) {
           parent[x] = find(parent[x]); // Path compression
       }
       return parent[x];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n \* α\(m \* n\)\), where α is the Inverse Ackermann function, which is practically constant\.
*   **Space Complexity:** O\(m \* n\) for the parent array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/surrounded-regions)
