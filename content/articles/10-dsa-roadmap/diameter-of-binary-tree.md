---
title: Diameter of Binary Tree
description: Master Diameter of Binary Tree in the Binary Tree module.
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

Given the `root` of a binary tree, return _the length of the_ _**diameter**_ _of the tree_\.

The **diameter** of a binary tree is the **length** of the longest path between any two nodes in a tree\. This path may or may not pass through the `root`\.

The **length** of a path between two nodes is represented by the number of edges between them\.

##### **Example 1:**

Input:root=\[1,2,3,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
  </div>
</div>

12453

**Output:** 3

**Explanation:** 3 is the length of the path \[4,2,1,3\] or \[5,2,1,3\]\.

##### **Example 2:**

Input:root=\[1,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
  </div>
</div>

12

**Output:** 1

#### **Constraints:**

*   The number of nodes in the tree is in the range **\[1, 10****4****\]**\.
*   `-100 <= Node.val <= 100`


## Approaches

### 1\. Recursive Approach

The naive idea here is to consider each node of the binary tree, calculate the maximum path length traversing through it, and then take the largest of these lengths\. The maximum path of a node is calculated as the sum of the heights of its left and right subtrees\.

#### Intuition:

1.  **Definition of Diameter**: For every node we consider, its diameter is defined as the number of nodes on the longest path between two leaves\.
2.  **Height Calculation**: The height of a node in this approach is determined by calculating the height of its left and right subtrees recursively\.
3.  **Brute Force Calculation**: For each node, calculate the diameter \(left height \+ right height\), and update the maximum diameter found so far\.

#### Code:

```java
class Solution {
   public int diameterOfBinaryTree(TreeNode root) {
       if (root == null) return 0;
       // The diameter through root node
       int diameterThroughRoot = height(root.left) + height(root.right);
       // Recursively compute diameters of left and right subtrees
       int leftDiameter = diameterOfBinaryTree(root.left);
       int rightDiameter = diameterOfBinaryTree(root.right);
       // The final diameter is the maximum of these three
       return Math.max(diameterThroughRoot, Math.max(leftDiameter, rightDiameter));
   }

   // Compute the height of the tree
   private int height(TreeNode node) {
       if (node == null) return 0;
       return 1 + Math.max(height(node.left), height(node.right));
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N^2\), since for every node, we calculate the height of the tree, a O\(N\) operation\.
*   **Space Complexity:** O\(N\), space required for recursion stack in the worst case \(skewed tree\)\.

### 2\. Optimized Recursive Approach

To optimize the naive approach, we can calculate the height of the tree while computing the diameter at the same time\. This prevents re\-calculation of the height, reducing redundant operations\.

#### Intuition:

1.  **Postorder Traversal**: Utilize postorder traversal, where we calculate the height of subtrees and the diameter while backtracking\.
2.  **Passing the Max Diameter**: Use a global or wrapper object to store the maximum diameter found during the traversal\.

#### Code:

```java
class Solution {
   private int maxDiameter = 0;

   public int diameterOfBinaryTree(TreeNode root) {
       calculateHeightAndDiameter(root);
       return maxDiameter;
   }

   private int calculateHeightAndDiameter(TreeNode node) {
       if (node == null) return 0;
       // Calculate the heights of left and right subtrees
       int leftHeight = calculateHeightAndDiameter(node.left);
       int rightHeight = calculateHeightAndDiameter(node.right);

       // Calculate the diameter passing through this node
       int diameterThroughNode = leftHeight + rightHeight;
       
       // Update the maximum diameter
       maxDiameter = Math.max(maxDiameter, diameterThroughNode);

       // Return height of the current node
       return 1 + Math.max(leftHeight, rightHeight);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), since we only pass through each node once\.
*   **Space Complexity:** O\(N\), due to recursion call stack \(worst case for skewed tree\)\.

#### [Solve it on LeetCode](https://leetcode.com/problems/diameter-of-binary-tree)
