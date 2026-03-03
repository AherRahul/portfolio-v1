---
title: Maximum Difference Between Node and Ancestor
description: Master Maximum Difference Between Node and Ancestor in the Binary
  Tree module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given the `root` of a binary tree, find the maximum value `v` for which there exist **different** nodes `a` and `b` where `v = |a.val - b.val|` and `a` is an ancestor of `b`\.

A node `a` is an ancestor of `b` if either: any child of `a` is equal to `b` or any child of `a` is an ancestor of `b`\.

**Example 1:**

Input:root=\[8,3,10,1,6,null,14,null,null,4,7,13\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">14</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">7</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">8</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">9</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">10</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">11</span><span class="arr-val">13</span></div>
  </div>
</div>

831647101413

**Output:** 7

**Explanation:** We have various ancestor\-node differences, some of which are given below :

```shell
|8 - 3| = 5
|3 - 7| = 4
|8 - 1| = 7
|10 - 13| = 3
```

Among all possible differences, the maximum value of 7 is obtained by |8 \- 1| = 7\.

##### **Example 2:**

Input:root=\[1,null,2,null,0,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
  </div>
</div>

1203

**Output:** 3

##### **Constraints:**

*   The number of nodes in the tree is in the range `[2, 5000]`\.
*   **0 <= Node\.val <= 10****5**


## Approaches

### 1\. Recursive DFS Approach

#### **Intuition:**

The problem is asking us to find the maximum difference between a node and its ancestor\. This suggests a tree traversal technique where we either calculate the max difference for each node recursively or store the maximum/minimum value as we traverse\.

Let's start by using a Depth\-First Search \(DFS\) approach where for each node, we compute the maximum difference using its direct ancestors \(i\.e\., the nodes along its path to the root\)\.

#### **Steps:**

1.  Perform a DFS traversal starting from the root node\.
2.  For each node, calculate the maximum difference between the node's value and the maximum and minimum values observed so far in the DFS path\.
3.  Store and update the global maximum difference if it's greater than the previously recorded difference\.
4.  Traverse both left and right children, updating the path's maximum and minimum values accordingly\.

#### **Code:**

```java
class Solution {
   public int maxAncestorDiff(TreeNode root) {
       // Start DFS from the root node with its own value as both min and max.
       return dfs(root, root.val, root.val);
   }
   
   private int dfs(TreeNode node, int minVal, int maxVal) {
       if (node == null) {
           // If node is null, return the difference between max and min values found so far.
           return maxVal - minVal;
       }
       
       // Update min and max values on this path as we go deeper into the tree.
       minVal = Math.min(minVal, node.val);
       maxVal = Math.max(maxVal, node.val);
       
       // Travel down both children and get their max differences.
       int leftMaxDiff = dfs(node.left, minVal, maxVal);
       int rightMaxDiff = dfs(node.right, minVal, maxVal);
       
       // Return the maximum difference obtained from either subtree.
       return Math.max(leftMaxDiff, rightMaxDiff);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree, as we visit each node once\.
*   **Space Complexity:** O\(H\), where H is the height of the tree, representing the maximum depth of the recursive call stack\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-difference-between-node-and-ancestor)
