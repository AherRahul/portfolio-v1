---
title: Pacific Atlantic Water Flow
description: Master Pacific Atlantic Water Flow in the Graphs module.
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

There is an `m x n` rectangular island that borders both the **Pacific Ocean** and **Atlantic Ocean**\. The **Pacific Ocean** touches the island's left and top edges, and the **Atlantic Ocean** touches the island's right and bottom edges\.

The island is partitioned into a grid of square cells\. You are given an `m x n` integer matrix `heights` where `heights[r][c]` represents the **height above sea level** of the cell at coordinate `(r, c)`\.

The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is **less than or equal to** the current cell's height\. Water can flow from any cell adjacent to an ocean into the ocean\.

Return _a_ _**2D list**_ _of grid coordinates_ `result` _where_ `result[i] = [r``i``, c``i``]` _denotes that rain water can flow from cell_ `(r``i``, c``i``)` _to_ _**both**_ _the Pacific and Atlantic oceans_\.

##### **Example 1:**

**Input:** heights = \[\[1,2,2,3,5\],\[3,2,3,4,4\],\[2,4,5,3,1\],\[6,7,1,4,5\],\[5,1,1,2,4\]\]

0

1

2

3

4

0

1

2

2

3

5

1

3

2

3

4

4

2

2

4

5

3

1

3

6

7

1

4

5

4

5

1

1

2

4

**Output:** \[\[0,4\],\[1,3\],\[1,4\],\[2,2\],\[3,0\],\[3,1\],\[4,0\]\]

**Explanation:** The following cells can flow to the Pacific and Atlantic oceans, as shown below:

```shell
[0,4]: [0,4] -> Pacific Ocean       [0,4] -> Atlantic Ocean
[1,3]: [1,3] -> [0,3] -> Pacific Ocean       [1,3] -> [1,4] -> Atlantic Ocean
[1,4]: [1,4] -> [1,3] -> [0,3] -> Pacific Ocean       [1,4] -> Atlantic Ocean
[2,2]: [2,2] -> [1,2] -> [0,2] -> Pacific Ocean       [2,2] -> [2,3] -> [2,4] -> Atlantic Ocean
[3,0]: [3,0] -> Pacific Ocean       [3,0] -> [4,0] -> Atlantic Ocean
[3,1]: [3,1] -> [3,0] -> Pacific Ocean       [3,1] -> [4,1] -> Atlantic Ocean
[4,0]: [4,0] -> Pacific Ocean       [4,0] -> Atlantic Ocean
Note that there are other possible paths for these cells to flow to the Pacific and Atlantic oceans.
```

##### **Example 2:**

**Input:** heights = \[\[1\]\]

**Output:** \[\[0,0\]\]

**Explanation:** The water can flow from the only cell to the Pacific and Atlantic oceans\.

##### **Constraints:**

*   **m == heights\.length**
*   **n == heights\[r\]\.length**
*   **1 <= m, n <= 200**
*   **0 <= heights\[r\]\[c\] <= 10****5**

#### [Solve it on LeetCode](https://leetcode.com/problems/pacific-atlantic-water-flow)

# Approaches

## 1\. Brute Force Approach

The brute force approach involves considering each cell, checking if water can flow to both the Pacific and Atlantic oceans\. We typically simulate water flow from each ocean and ensure they meet at every cell\.

#### Intuition:

We try simulating water flow backwards, from the ocean to each cell, rather than from every cell to the ocean:

*   For each cell in the matrix, check if a path exists to both oceans from that cell by simulating water flow\.
*   This involves invoking a recursive or iterative simulation for each cell\.

However, this approach is inefficient in time complexity and not practical for larger matrices\.

#### Approach:

1.  Iterate over each cell of the matrix\.
2.  For each cell, perform a BFS or DFS to check if it can reach both oceans\.
3.  Store the result and return all cells that satisfy the condition\.

#### Code:

Java

```java
class Solution {
   public List<List<Integer>> pacificAtlantic(int[][] heights) {
       int numRows = heights.length;
       int numCols = heights[0].length;
       
       List<List<Integer>> result = new ArrayList<>();
       
       for (int i = 0; i < numRows; i++) {
           for (int j = 0; j < numCols; j++) {
               boolean canFlowToPacific = canFlow(heights, i, j, new boolean[numRows][numCols], true);
               boolean canFlowToAtlantic = canFlow(heights, i, j, new boolean[numRows][numCols], false);
               
               if (canFlowToPacific && canFlowToAtlantic) {
                   result.add(Arrays.asList(i, j));
               }
           }
       }
       
       return result;
   }

   private boolean canFlow(int[][] heights, int r, int c, boolean[][] visited, boolean isPacific) {
       // Base cases and recursive exploration to check for water flow.
       return false; // Placeholder for recursion logic.
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(MN\)^2\) due to checking each cell and simulating the BFS/DFS for all cells\.
*   **Space Complexity:** O\(MN\) for the visited matrix used in each BFS/DFS\.

## 2\. DFS Approach

Instead of simulating water flow from every cell, simulate it from the oceans onto the grid and determine where flows intersect\.

#### Intuition:

1.  Simulate water flowing from the oceans to the cells\.
2.  Use DFS from the borders and mark which cells can reach each ocean\.
3.  Cells reached by both DFS simulations represent meeting points\.

#### Approach:

1.  Create two boolean matrices to track cells reachable by the Pacific and Atlantic oceans\.
2.  Perform DFS from the Pacific\-edge cells \(top and left edges\)\.
3.  Perform DFS from the Atlantic\-edge cells \(bottom and right edges\)\.
4.  Collect all cells that are reachable by both sets of DFS calls\.

#### Code:

Java

```java
class Solution {
   public List<List<Integer>> pacificAtlantic(int[][] heights) {
       int numRows = heights.length;
       int numCols = heights[0].length;
       
       boolean[][] pacificReachable = new boolean[numRows][numCols];
       boolean[][] atlanticReachable = new boolean[numRows][numCols];
       
       for (int i = 0; i < numRows; i++) {
           dfs(heights, pacificReachable, i, 0);
           dfs(heights, atlanticReachable, i, numCols - 1);
       }
       
       for (int j = 0; j < numCols; j++) {
           dfs(heights, pacificReachable, 0, j);
           dfs(heights, atlanticReachable, numRows - 1, j);
       }
       
       List<List<Integer>> result = new ArrayList<>();
       for (int i = 0; i < numRows; i++) {
           for (int j = 0; j < numCols; j++) {
               if (pacificReachable[i][j] && atlanticReachable[i][j]) {
                   result.add(Arrays.asList(i, j));
               }
           }
       }
       
       return result;
   }

   private void dfs(int[][] heights, boolean[][] reachable, int r, int c) {
       int numRows = heights.length;
       int numCols = heights[0].length;
       int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
       
       reachable[r][c] = true;
       
       for (int[] dir : dirs) {
           int newRow = r + dir[0], newCol = c + dir[1];
           if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols) continue;
           if (reachable[newRow][newCol]) continue;
           if (heights[newRow][newCol] < heights[r][c]) continue;
           
           dfs(heights, reachable, newRow, newCol);
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(MN\), since each cell is processed twice \(once for each ocean\)\.
*   **Space Complexity:** O\(MN\) for the space used by the two ocean\-reachability matrices\.

## 3\. BFS Approach

We can use a BFS strategy instead of DFS by initializing queues with the coastal cells and expanding outwards\.

#### Intuition:

1.  Start BFS from both borders simultaneously\.
2.  Use queues to manage cells being processed for each ocean\.
3.  A cell can flow to both oceans if it is found reachable by both BFS traversals\.

#### Approach:

1.  Initialize two queues; one for each ocean’s border cells\.
2.  Process each queue, marking cells as reachable if they meet the criteria\.
3.  End conditions and new cells are appended based on water flowing constraints\.
4.  Collect meeting points of both BFS traversals\.

#### Code:

Java

```java
class Solution {
   public List<List<Integer>> pacificAtlantic(int[][] heights) {
       int numRows = heights.length;
       int numCols = heights[0].length;

       boolean[][] pacificReachable = new boolean[numRows][numCols];
       boolean[][] atlanticReachable = new boolean[numRows][numCols];

       Queue<int[]> pacificQueue = new LinkedList<>();
       Queue<int[]> atlanticQueue = new LinkedList<>();

       for (int i = 0; i < numRows; i++) {
           pacificQueue.offer(new int[]{i, 0});
           atlanticQueue.offer(new int[]{i, numCols - 1});
       }

       for (int j = 0; j < numCols; j++) {
           pacificQueue.offer(new int[]{0, j});
           atlanticQueue.offer(new int[]{numRows - 1, j});
       }

       bfs(heights, pacificQueue, pacificReachable);
       bfs(heights, atlanticQueue, atlanticReachable);

       List<List<Integer>> result = new ArrayList<>();
       for (int i = 0; i < numRows; i++) {
           for (int j = 0; j < numCols; j++) {
               if (pacificReachable[i][j] && atlanticReachable[i][j]) {
                   result.add(Arrays.asList(i, j));
               }
           }
       }

       return result;
   }

   private void bfs(int[][] heights, Queue<int[]> queue, boolean[][] reachable) {
       int numRows = heights.length;
       int numCols = heights[0].length;
       int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

       while (!queue.isEmpty()) {
           int[] cell = queue.poll();
           int r = cell[0], c = cell[1];
           reachable[r][c] = true;

           for (int[] dir : dirs) {
               int newRow = r + dir[0], newCol = c + dir[1];
               if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols) continue;
               if (reachable[newRow][newCol]) continue;
               if (heights[newRow][newCol] < heights[r][c]) continue;

               queue.offer(new int[]{newRow, newCol});
           }
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(MN\), as every cell is being processed twice using BFS\.
*   **Space Complexity:** O\(MN\) due to the storage requirements for the reachability matrices and queues\.