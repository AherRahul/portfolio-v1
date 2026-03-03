---
title: Count Complete Tree Nodes
description: Master Count Complete Tree Nodes in the Binary Tree module.
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

Given the `root` of a **complete** binary tree, return the number of the nodes in the tree\.

According to [**Wikipedia**](http://en.wikipedia.org/wiki/Binary_tree#Types_of_binary_trees), every level, except possibly the last, is completely filled in a complete binary tree, and all nodes in the last level are as far left as possible\. It can have between `1` and `2``h` nodes inclusive at the last level `h`\.

Design an algorithm that runs in less than `O(n)` time complexity\.

##### **Example 1:**

Input:root=\[1,2,3,4,5,6\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
  </div>
</div>

124536

**Output:** 6

##### **Example 2:**

**Input:** root = \[\]

**Output:** 0

##### **Example 3:**

**Input:** root = \[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** 1

##### **Constraints:**

*   The number of nodes in the tree is in the range **\[0, 5 \* 10****4****\]**\.
*   **0 <= Node\.val <= 5 \* 10****4**
*   The tree is guaranteed to be **complete**\.


## Approaches

### 1\. Simple Tree Traversal

#### **Intuition:**

The most straightforward method to count all the nodes in a tree is to traverse the tree and count each node\. In a normal binary tree, this approach works perfectly fine\.

#### Steps:

1.  Use Depth\-First Search \(DFS\) to traverse each node starting from the root\.
2.  For every node visited, increment a count\.
3.  The total count after the complete traversal will give the number of nodes in the tree\.

#### Code:

```java
class Solution {
   public int countNodes(TreeNode root) {
       // Base case, if tree is empty
       if (root == null) return 0;

       // Count is 1 for the current node + left subtree + right subtree
       return 1 + countNodes(root.left) + countNodes(root.right);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of nodes in the tree\. We visit each node exactly once\.
*   **Space Complexity:** O\(h\), where h is the height of the tree\. This is due to the recursion stack\.

### 2\. Binary Search and Depth Calculation

#### **Intuition:** 

Given the properties of a complete tree, we can use a more efficient method leveraging the structure\. The idea is to take advantage of the depth of the tree and binary search to determine missing nodes in the last level\.

#### Steps:

1.  Calculate the depth \(measured by the number of edges\) of the tree using the left\-most path\.
2.  If the tree is empty, return 0\.
3.  Otherwise, perform binary search on the last level to check if nodes exist:

*   Half of the potential nodes can be skipped at each level of the last row, providing savings\.

5.  Calculate the total number of nodes using full levels and the nodes you've confirmed in the last level\.

#### Code:

```java
class Solution {
   // Function to compute tree depth
   private int computeDepth(TreeNode node) {
       int depth = 0;
       while (node.left != null) {
           node = node.left;
           depth++;
       }
       return depth;
   }
   
   // Function to check if a node exists given the index and depth
   private boolean exists(int idx, int depth, TreeNode node) {
       int left = 0, right = (int)Math.pow(2, depth) - 1;
       for (int i = 0; i < depth; ++i) {
           int pivot = left + (right - left) / 2;
           if (idx <= pivot) {
               node = node.left;
               right = pivot;
           } else {
               node = node.right;
               left = pivot + 1;
           }
       }
       return node != null;
   }
   
   public int countNodes(TreeNode root) {
       // If tree is empty
       if (root == null) return 0;

       int depth = computeDepth(root);
       // If the tree has only one level
       if (depth == 0) return 1;

       // Binary search on last level
       int left = 0, right = (int)Math.pow(2, depth) - 1;
       while (left <= right) {
           int pivot = left + (right - left) / 2;
           if (exists(pivot, depth, root)) {
               left = pivot + 1;
           } else {
               right = pivot - 1;
           }
       }

       // Total nodes = nodes of full levels + nodes in the last level
       return (int)Math.pow(2, depth) - 1 + left;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(log^2\(n\)\), where n is the number of nodes\. We perform a log\(n\) depth computation and an additional log\(n\) binary search for each depth level\.
*   **Space Complexity:** O\(1\), as it uses constant extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/count-complete-tree-nodes)
