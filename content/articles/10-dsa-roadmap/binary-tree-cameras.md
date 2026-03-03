---
title: Binary Tree Cameras
description: Master Binary Tree Cameras in the Dynamic Programming module.
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

You are given the `root` of a binary tree\. We install cameras on the tree nodes where each camera at a node can monitor its parent, itself, and its immediate children\.

Return _the minimum number of cameras needed to monitor all nodes of the tree_\.

##### **Example 1:**

**Input:** root = \[0,0,null,0,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
  </div>
</div>

0000

**Output:** 1

**Explanation:** One camera is enough to monitor all nodes if placed as shown\.

##### **Example 2:**

**Input:** root = \[0,0,null,0,null,0,null,null,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">6</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">7</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">8</span><span class="arr-val">0</span></div>
  </div>
</div>

00000

**Output:** 2

**Explanation:** At least two cameras are needed to monitor all nodes of the tree\. The above image shows one of the valid configurations of camera placement\.

##### **Constraints:**

*   The number of nodes in the tree is in the range `[1, 1000]`\.
*   `Node.val == 0`


## Approaches

### 1\. Recursive DFS Approach

#### Intuition:

In this problem, we need to cover all nodes of a binary tree with the minimum number of cameras\. A straightforward brute force approach would be to consider placing a camera at every node, which clearly isn't efficient\. Instead, we can use a recursive approach where we attempt to minimize the number of cameras required by deciding the optimal placement of each camera during the traversal of the tree\.

We third introduce states for nodes:

*   `0` if the node is covered
*   `1` if the node is monitored by a camera placed at one of its children
*   `2` if the node has a camera

The base idea is:

*   A leaf node would need a camera at its parent\.
*   A parent of a leaf can cover itself and the leaf if it has a camera\.
*   Each node decides whether it needs a camera based on whether its children are covered or need a camera\.

#### Code:

```java
class Solution {
   private int numCameras = 0;

   public int minCameraCover(TreeNode root) {
       // If the root itself is not covered, we need an additional camera
       if (dfs(root) == 0) {
           numCameras++;
       }
       return numCameras;
   }

   private int dfs(TreeNode node) {
       if (node == null) {
           // If node is null, it's considered to be covered
           return 1;
       }

       int left = dfs(node.left);
       int right = dfs(node.right);

       // If any child is not covered, we need to place a camera at this node
       if (left == 0 || right == 0) {
           numCameras++;
           return 2;
       }
       
       // If any child has a camera, this node is considered to be covered
       if (left == 2 || right == 2) {
           return 1;
       }

       // If both the children are covered but do not have a camera, this node is currently not covered.
       return 0;
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(N\), where N is the number of nodes in the tree\. Each node is visited once\.
*   **Space Complexity**: O\(H\), where H is the height of the tree due to the recursion stack\.

#### [Solve it on LeetCode](https://leetcode.com/problems/binary-tree-cameras/description/)
