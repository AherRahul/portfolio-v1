---
title: Minimum Distance Between BST Nodes
description: Master Minimum Distance Between BST Nodes in the Binary Tree
  module. Comprehensive guide and algorithmic problem solving.
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

Given the `root` of a Binary Search Tree \(BST\), return _the minimum difference between the values of any two different nodes in the tree_\.

##### **Example 1:**

Input:root=\[4,2,6,1,3\]

42136

**Output:** 1

##### **Example 2:**

Input:root=\[1,0,48,null,null,12,49\]

10481249

**Output:** 1

##### **Constraints:**

*   The number of nodes in the tree is in the range `[2, 100]`\.
*   **0 <= Node\.val <= 10****5**

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-distance-between-bst-nodes)

# Approaches

## 1\. Brute Force with Inorder Traversal

#### Intuition:

A binary search tree \(BST\) has the property that for any node, the value of all the nodes in its left subtree are less and all the nodes in its right subtree are greater\. Thus, an inorder traversal of a BST will yield the nodes in sorted order\.

The brute force approach is to perform an inorder traversal of the BST to obtain a sorted list of node values\. We then compute the minimum difference between consecutive values in this sorted list\.

#### Steps:

1.  Perform an inorder traversal to extract values in sorted order\.
2.  Calculate the minimum difference between consecutive elements in this sorted list\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(N\) where N is the number of nodes in the tree\. We visit each node exactly once\.
*   **Space Complexity:** O\(N\) for the auxiliary space used to store the values of nodes\.

## 2\. Optimized Inorder Traversal

#### Intuition:

We can optimize the space usage by calculating the minimum difference on\-the\-fly during the inorder traversal, rather than maintaining a list of values\. This way, we only need to keep track of the last visited node's value\.

#### Steps:

1.  Perform an inorder traversal\.
2.  During traversal, calculate the difference between the current node value and the previous node value \(i\.e\., last node visited in inorder traversal\)\.
3.  Update the minimum difference accordingly\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(N\) where N is the number of nodes\. Still, we visit each node exactly once\.
*   **Space Complexity:** O\(H\) where H is the height of the tree\. This accounts for the recursion stack during the depth\-first traversal which, in the worst case, is the height of the tree\.

## 3\. Iterative Inorder Traversal

#### **Intuition:**

Instead of storing all node values, we can compute the minimum difference on the fly during inorder traversal\. Since inorder gives nodes in sorted order, we only need to compare each node with the previously visited one\.

#### Steps:

*   Perform an inorder traversal\.
*   Keep track of the value of the previously visited node\.
*   For each visited node, compute the difference between its value and the previous value\.
*   Update the minimum difference whenever a smaller gap is found\.

Complexity Analysis

*   **Time Complexity:** O\(N\) where N is the number of nodes\. We visit each node exactly once\.
*   **Space Complexity:** O\(H\) where H is the height of the tree\.

View Animation