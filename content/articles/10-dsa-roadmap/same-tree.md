---
title: Same Tree
description: Master Same Tree in the Binary Tree module. Comprehensive guide and
  algorithmic problem solving.
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

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not\.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value\.

##### **Example 1:**

**Input:** p = \[1,2,3\], q = \[1,2,3\]

**Output:** true

##### **Example 2:**

**Input:** p = \[1,2\], q = \[1,null,2\]

**Output:** false

##### **Example 3:**

**Input:** p = \[1,2,1\], q = \[1,1,2\]

**Output:** false

#### **Constraints:**

*   The number of nodes in both trees is in the range `[0, 100]`\.
*   **\-10****4** **<= Node\.val <= 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/same-tree)

# Approaches

## 1\. Recursive Depth\-First Search \(DFS\)

#### **Intuition:**

The basic idea is to recursively compare the two trees' nodes\. If both trees' nodes have the same value, then we recursively check their left children and their right children\. If all corresponding nodes in the two trees are equal, then the trees are the same\.

1.  Base Cases:

*   If both nodes we're comparing are null, they are identical at this subtree level\.
*   If only one of them is null, they're not identical\.
*   If both nodes are not null but have different values, they're not identical\.

3.  Recursive Case:

*   Compare the left subtree of both nodes\.
*   Compare the right subtree of both nodes\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the total number of nodes in both trees\. Each node is visited once\.
*   **Space Complexity:** O\(H\), where H is the height of the tree\. This is due to the recursion stack space\. In the best case \(balanced tree\), H = log N, and in the worst case \(skewed tree\), H = N\.

## 2\. Iterative Breadth\-First Search \(BFS\)

#### **Intuition:**

Instead of doing it recursively, we can use an iterative method to traverse both trees level by level using a queue\. At each node, we check if both nodes are null or if one is null\. If both nodes are non\-null, we compare their values and enqueue their children\.

1.  Use a queue to keep track of nodes from both trees\.
2.  Start by adding the root nodes of both trees to the queue\.
3.  While the queue is not empty, process each pair of nodes:

*   If both nodes are null, continue\.
*   If one node is null, the trees are not identical\.
*   If values of the nodes are different, the trees are not identical\.
*   Otherwise, enqueue left and right children of both nodes\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the total number of nodes in both trees\. We traverse each node once\.
*   **Space Complexity:** O\(N\), where N is the maximum number of nodes at any level in the queue\. In the worst case \(full binary tree\), there can be up to N/2 nodes at the last level\.