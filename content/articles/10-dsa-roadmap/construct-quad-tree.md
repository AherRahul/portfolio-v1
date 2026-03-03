---
title: Construct Quad Tree
description: Master Construct Quad Tree in the Divide and Conquer module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a `n * n` matrix `grid` of `0's` and `1's` only\. We want to represent `grid` with a Quad\-Tree\.

Return _the root of the Quad\-Tree representing_ `grid`\.

A Quad\-Tree is a tree data structure in which each internal node has exactly four children\. Besides, each node has two attributes:

*   `val`: True if the node represents a grid of 1's or False if the node represents a grid of 0's\. Notice that you can assign the `val` to True or False when `isLeaf` is False, and both are accepted in the answer\.
*   `isLeaf`: True if the node is a leaf node on the tree or False if the node has four children\.

```java
class Node {
    public boolean val;
    public boolean isLeaf;
    public Node topLeft;
    public Node topRight;
    public Node bottomLeft;
    public Node bottomRight;
}
```

We can construct a Quad\-Tree from a two\-dimensional area using the following steps:

1.  If the current grid has the same value \(i\.e all `1's` or all `0's`\) set `isLeaf` True and set `val` to the value of the grid and set the four children to Null and stop\.
2.  If the current grid has different values, set `isLeaf` to False and set `val` to any value and divide the current grid into four sub\-grids as shown in the photo\.
3.  Recurse for each of the children with the proper sub\-grid\.

If you want to know more about the Quad\-Tree, you can refer to the [wiki](https://en.wikipedia.org/wiki/Quadtree)\.

**Quad\-Tree format:**

You don't need to read this section for solving the problem\. This is only if you want to understand the output format here\. The output represents the serialized format of a Quad\-Tree using level order traversal, where `null` signifies a path terminator where no node exists below\.

It is very similar to the serialization of the binary tree\. The only difference is that the node is represented as a list `[isLeaf, val]`\.

If the value of `isLeaf` or `val` is True we represent it as **1** in the list `[isLeaf, val]` and if the value of `isLeaf` or `val` is False we represent it as **0**\.

##### **Example 1:**

**Input:** grid = \[\[0,1\],\[1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Output:** \[\[0,1\],\[1,0\],\[1,1\],\[1,1\],\[1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Explanation:** The explanation of this example is shown below:

Notice that 0 represents False and 1 represents True in the photo representing the Quad\-Tree\.

##### **Example 2:**

**Input:** grid = \[\[1,1,1,1,0,0,0,0\],\[1,1,1,1,0,0,0,0\],\[1,1,1,1,1,1,1,1\],\[1,1,1,1,1,1,1,1\],\[1,1,1,1,0,0,0,0\],\[1,1,1,1,0,0,0,0\],\[1,1,1,1,0,0,0,0\],\[1,1,1,1,0,0,0,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Output:** \[\[0,1\],\[1,1\],\[0,1\],\[1,1\],\[1,0\],null,null,null,null,\[1,0\],\[1,0\],\[1,1\],\[1,1\]\]

**Explanation:** All values in the grid are not the same\. We divide the grid into four sub\-grids\.

The topLeft, bottomLeft and bottomRight each has the same value\.

The topRight have different values so we divide it into 4 sub\-grids where each has the same value\.

Explanation is shown in the photo below:

##### **Constraints:**

*   `n == grid.length == grid[i].length`
*   `n == 2``x` where `0 <= x <= 6`


## Approaches

### 1\. Recursive Approach

#### Intuition:

The quad tree is a specialized tree used to partition a two\-dimensional space by recursively subdividing it into four quadrants or regions\. To construct a quad tree from a grid, we recursively divide the grid into four quadrants until each quadrant is a uniform section\. If a section is not uniform \(contains both 0s and 1s\), we continue dividing it; otherwise, we create a leaf node\.

#### Code:

```java
class Node {
   public boolean val;
   public boolean isLeaf;
   public Node topLeft;
   public Node topRight;
   public Node bottomLeft;
   public Node bottomRight;

   public Node(boolean val, boolean isLeaf) {
       this.val = val;
       this.isLeaf = isLeaf;
   }

   public Node(boolean val, boolean isLeaf, Node topLeft, Node topRight, Node bottomLeft, Node bottomRight) {
       this.val = val;
       this.isLeaf = isLeaf;
       this.topLeft = topLeft;
       this.topRight = topRight;
       this.bottomLeft = bottomLeft;
       this.bottomRight = bottomRight;
   }
}

class Solution {
   public Node construct(int[][] grid) {
       return construct(grid, 0, 0, grid.length);
   }

   private Node construct(int[][] grid, int row, int col, int size) {
       // Check if the entire grid section is uniform
       if (isUniform(grid, row, col, size)) {
           return new Node(grid[row][col] == 1, true);
       }

       int mid = size / 2;
       // Recursively divide into four quadrants
       Node topLeft = construct(grid, row, col, mid);
       Node topRight = construct(grid, row, col + mid, mid);
       Node bottomLeft = construct(grid, row + mid, col, mid);
       Node bottomRight = construct(grid, row + mid, col + mid, mid);

       // Create a parent node for the 4 quadrants
       return new Node(false, false, topLeft, topRight, bottomLeft, bottomRight);
   }

   private boolean isUniform(int[][] grid, int row, int col, int size) {
       int val = grid[row][col];
       for (int i = row; i < row + size; i++) {
           for (int j = col; j < col + size; j++) {
               if (grid[i][j] != val) {
                   return false;
               }
           }
       }
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N^2\), where N is the length of the grid's side\. In the worst case, we might check each cell to determine if a section is uniform\.
*   **Space Complexity:** O\(log\(N\)\), as the stack space used by the recursive calls at worst will be log of N due to the depth of the recursive tree\.

### 2\. Recursive Approach with Optimization

#### Intuition:

To optimize, instead of checking for uniform sections separately, integrate this directly into the recursive logic to avoid redundant checks\. If during recursive splitting, all four quadrants return leaf nodes with the same value, we can merge them into a single leaf node\.

#### Code:

```java
class Solution {
   public Node construct(int[][] grid) {
       return construct(grid, 0, 0, grid.length);
   }

   private Node construct(int[][] grid, int row, int col, int size) {
       if (size == 1) {
           return new Node(grid[row][col] == 1, true);
       }

       int mid = size / 2;
       Node topLeft = construct(grid, row, col, mid);
       Node topRight = construct(grid, row, col + mid, mid);
       Node bottomLeft = construct(grid, row + mid, col, mid);
       Node bottomRight = construct(grid, row + mid, col + mid, mid);

       // Optimize by directly merging the nodes if they are all leaves and have the same value
       if (topLeft.isLeaf && topRight.isLeaf && bottomLeft.isLeaf && bottomRight.isLeaf
               && topLeft.val == topRight.val && topRight.val == bottomLeft.val && bottomLeft.val == bottomRight.val) {
           return new Node(topLeft.val, true);
       }

       return new Node(false, false, topLeft, topRight, bottomLeft, bottomRight);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N^2\), similar to the basic approach, but avoids redundant checks\.
*   **Space Complexity:** O\(log\(N\)\), due to recursive stack similar to the basic approach\.

#### [Solve it on LeetCode](https://leetcode.com/problems/construct-quad-tree)
