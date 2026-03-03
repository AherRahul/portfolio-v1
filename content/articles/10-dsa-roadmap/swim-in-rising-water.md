---
title: Swim in Rising Water
description: Master Swim in Rising Water in the Graphs module. Comprehensive
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

You are given an `n x n` integer matrix `grid` where each value `grid[i][j]` represents the elevation at that point `(i, j)`\.

It starts raining, and water gradually rises over time\. At time `t`, the water level is `t`, meaning **any** cell with elevation less than equal to `t` is submerged or reachable\.

You can swim from a square to another 4\-directionally adjacent square if and only if the elevation of both squares individually are at most `t`\. You can swim infinite distances in zero time\. Of course, you must stay within the boundaries of the grid during your swim\.

Return _the minimum time until you can reach the bottom right square_ `(n - 1, n - 1)` _if you start at the top left square_ `(0, 0)`\.

##### **Example 1:**

**Input:** grid = \[\[0,2\],\[1,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Output:** 3

**Explanation:**

At time 0, you are in grid location \(0, 0\)\.

You cannot go anywhere else because 4\-directionally adjacent neighbors have a higher elevation than t = 0\.

You cannot reach point \(1, 1\) until time 3\.

When the depth of water is 3, we can swim anywhere inside the grid\.

##### **Example 2:**

**Input:** grid = \[\[0,1,2,3,4\],\[24,23,22,21,5\],\[12,13,14,15,16\],\[11,17,18,19,20\],\[10,9,8,7,6\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">24</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">23</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">22</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">21</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">12</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">13</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">14</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">16</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">11</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">17</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">18</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">19</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">20</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">9</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">8</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
    </div>
  </div>
</div>

**Output:** 16

**Explanation:** The final route is shown\. We need to wait until time 16 so that \(0, 0\) and \(4, 4\) are connected\.

##### **Constraints:**

*   `n == grid.length`
*   `n == grid[i].length`
*   `1 <= n <= 50`
*   `0 <= grid[i][j] < n``2`
*   Each value `grid[i][j]` is **unique**\.


## Approaches

### 1\. Brute Force

#### Intuition:

The first approach is a brute force method, where we simulate the water level increasing over time and check if a path exists from the top\-left to the bottom\-right of the grid for each water level\. This approach can be implemented using a BFS or DFS to explore the reachability of the target cell at each possible water level\.

#### Steps:

1.  Start iterating over water levels from 0 to the maximum possible water level in the grid\.
2.  For each water level, use a BFS or DFS to determine if there is a path from the top\-left corner to the bottom\-right corner where all visited cells are less than or equal to the current water level\.
3.  The first water level at which a path exists is the minimum time required to swim from the top left to the bottom right of the grid\.

#### Code:

```java
class Solution {
   public int swimInWater(int[][] grid) {
       int N = grid.length;
       int left = grid[0][0], right = N * N - 1;
       while (left < right) {
           int mid = (left + right) / 2;
           if (canSwim(mid, grid, N)) {
               right = mid;
           } else {
               left = mid + 1;
           }
       }
       return left;
   }

   private boolean canSwim(int T, int[][] grid, int N) {
       boolean[][] visited = new boolean[N][N];
       return dfs(grid, visited, 0, 0, T);
   }

   private boolean dfs(int[][] grid, boolean[][] visited, int x, int y, int T) {
       int N = grid.length;
       if (x < 0 || y < 0 || x >= N || y >= N || visited[x][y] || grid[x][y] > T) {
           return false;
       }
       visited[x][y] = true;
       if (x == N - 1 && y == N - 1) return true;
       return dfs(grid, visited, x - 1, y, T) || dfs(grid, visited, x + 1, y, T)
               || dfs(grid, visited, x, y - 1, T) || dfs(grid, visited, x, y + 1, T);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N^4\), where N is the edge length of the grid\. This is because we check each water level separately and perform a graph search on an N x N grid\.
*   **Space Complexity:** O\(N^2\) for the visited matrix and the queue used in BFS\.

### 2\. Binary Search with BFS/DFS

#### Intuition:

This approach improves upon the brute force method by applying binary search on the possible time value\. For each middle value, we determine if the path can be formed using BFS/DFS as before\. This significantly reduces the time complexity since we're not iterating through every possible water level but rather narrowing down the possibilities using binary search\.

#### Steps:

1.  Use binary search to find the minimum time required for the water level so a path exists\.
2.  For a middle point in the binary search range, use BFS/DFS to check for path existence\.
3.  Adjust the binary search range based on whether a path was successful or blocked\.

#### Code:

```java
class Solution {
   public int swimInWater(int[][] grid) {
       int N = grid.length;
       int left = grid[0][0], right = N * N - 1;
       while (left < right) {
           int mid = (left + right) / 2;
           if (canSwim(grid, mid)) {
               right = mid;
           } else {
               left = mid + 1;
           }
       }
       return left;
   }

   private boolean canSwim(int[][] grid, int T) {
       int N = grid.length;
       boolean[][] visited = new boolean[N][N];
       return dfs(grid, visited, 0, 0, T);
   }

   private boolean dfs(int[][] grid, boolean[][] visited, int x, int y, int T) {
       int N = grid.length;
       if (x < 0 || y < 0 || x >= N || y >= N || visited[x][y] || grid[x][y] > T) {
           return false;
       }
       visited[x][y] = true;
       if (x == N - 1 && y == N - 1) return true;
       int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
       for (int[] dir : directions) {
           if (dfs(grid, visited, x + dir[0], y + dir[1], T)) {
               return true;
           }
       }
       return false;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N^2 \* log\(MaxVal\)\), where MaxVal is the maximum value \(N \* N \- 1\)\.
*   **Space Complexity:** O\(N^2\) for visited structures\.

### 3\. Dijkstra's Algorithm

#### Intuition:

The optimal approach for this problem is to use a priority queue \(min\-heap\) to simulate Dijkstra's algorithm, which efficiently finds the minimum\-path to the destination as the constraints evolve\. Here, the priority queue helps in efficiently computing which cell to visit next based on the minimum possible water level encountered on the path\.

#### Steps:

1.  Use a priority queue to store cells along with their corresponding water level, starting from the top\-left corner\.
2.  At each step, pop the least val cell from the queue, and mark it visited\.
3.  Push neighboring cells into the queue only if they are not visited\.
4.  Track the maximum water level on the current path, and if you reach the target cell \(bottom\-right\), return that value as the result\.

#### Code:

```java
class Solution {
   public int swimInWater(int[][] grid) {
       int N = grid.length;
       boolean[][] visited = new boolean[N][N];
       PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
       pq.offer(new int[]{grid[0][0], 0, 0}); // {water_level, x, y}
       int[] directions = {-1, 0, 1, 0, -1};
       
       while (!pq.isEmpty()) {
           int[] curr = pq.poll();
           int time = curr[0], x = curr[1], y = curr[2];
           
           if (visited[x][y]) continue;
           visited[x][y] = true;

           // If the bottom-right corner is reached
           if (x == N - 1 && y == N - 1) {
               return time;
           }

           // Look in the 4 possible directions
           for (int i = 0; i < 4; i++) {
               int nx = x + directions[i], ny = y + directions[i + 1];
               if (nx >= 0 && nx < N && ny >= 0 && ny < N && !visited[nx][ny]) {
                   pq.offer(new int[]{Math.max(time, grid[nx][ny]), nx, ny});
               }
           }
       }
       return -1; // Just a fallback, logically unreachable
}
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N^2 \* log\(N\)\), where N is the number of cells\. The priority queue operations are logarithmic\.
*   **Space Complexity:** O\(N^2\) for visited structures and the priority queue storage\.

#### [Solve it on LeetCode](https://leetcode.com/problems/swim-in-rising-water)
