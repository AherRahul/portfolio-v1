---
title: Trim a Binary Search Tree
description: Master Trim a Binary Search Tree in the BST / Ordered Set module.
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

Given the `root` of a binary search tree and the lowest and highest boundaries as `low` and `high`, trim the tree so that all its elements lies in `[low, high]`\. Trimming the tree should **not** change the relative structure of the elements that will remain in the tree \(i\.e\., any node's descendant should remain a descendant\)\. It can be proven that there is a **unique answer**\.

Return _the root of the trimmed binary search tree_\. Note that the root may change depending on the given bounds\.

##### **Example 1:**

**Input:** root = \[1,0,2\], low = 1, high = 2

102

Output:\[1,null,2\]

12

##### **Example 2:**

**Input:** root = \[3,0,4,null,2,null,null,1\], low = 1, high = 3

30214

Output:\[3,2,null,1\]

321

**Constraints:**

*   The number of nodes in the tree is in the range **\[1, 10****4****\]**\.
*   **0 <= Node\.val <= 10****4**
*   The value of each node in the tree is **unique**\.
*   `root` is guaranteed to be a valid binary search tree\.
*   **0 <= low <= high <= 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/trim-a-binary-search-tree)

# Approaches

## 1\. Recursive DFS

#### **Intuition:**

The idea is to recursively traverse the tree and rebuild it by considering the constraints of a binary search tree \(BST\)\. For each node:

*   If the node's value is less than `low`, then discard the left subtree \(because all values in the left subtree are also less than `low`\) and trim the right subtree\.
*   If the node's value is greater than `high`, discard the right subtree and trim the left subtree\.
*   If the node's value is within the range `[low, high]`, then keep the node and recursively trim both its left and right subtrees\.

The base case for the recursion is when a `null` node is encountered\.

#### Code:

Java

```java
class Solution {
   public TreeNode trimBST(TreeNode root, int low, int high) {
       // Base case: if the current node is null, return null
       if (root == null) {
           return null;
       }

       // If the current node's value is less than low,
       // we need to trim the left subtree and only consider the right subtree
       if (root.val < low) {
           return trimBST(root.right, low, high);
       }

       // If the current node's value is greater than high,
       // we need to trim the right subtree and only consider the left subtree
       if (root.val > high) {
           return trimBST(root.left, low, high);
       }

       // If the current node's value is within the range,
       // recursively trim both the left and right subtrees
       root.left = trimBST(root.left, low, high);
       root.right = trimBST(root.right, low, high);

       // Return the root, as it's within the range
       return root;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\) where N is the number of nodes in the tree\. Each node is visited once\.
*   **Space Complexity:** O\(N\) for the recursion stack in the worst\-case scenario, which is a completely unbalanced tree\.

## 2\. Iterative DFS with Stack

#### **Intuition:**

This approach uses an iterative Depth\-First Search \(DFS\) strategy with a stack to avoid the recursion overhead\. The idea is the same as the recursive approach, but maintains a stack to process the nodes iteratively\.

*   Initialize a stack and push the root node\.
*   Pop elements from the stack, check if the current node is within the range, and adjust its children nodes accordingly\.
*   Continue while the stack is not empty\.

#### Code:

Java

```java
class Solution {
   public TreeNode trimBST(TreeNode root, int low, int high) {
       // Edge case: if the tree is empty
       if (root == null) {
           return null;
       }

       // Adjust the root to be within range
       while (root != null && (root.val < low || root.val > high)) {
           if (root.val < low) {
               root = root.right;
           } else if (root.val > high) {
               root = root.left;
           }
       }

       // Use a stack to perform DFS iteratively
       Stack<TreeNode> stack = new Stack<>();
       stack.push(root);

       while (!stack.isEmpty()) {
           TreeNode node = stack.pop();

           if (node != null) {
               // Trim the left subtree if necessary
               while (node.left != null && node.left.val < low) {
                   node.left = node.left.right;
               }

               // Trim the right subtree if necessary
               while (node.right != null && node.right.val > high) {
                   node.right = node.right.left;
               }

               // Push children onto the stack to continue trimming other nodes
               stack.push(node.left);
               stack.push(node.right);
           }
       }

       return root;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\) since we process each node once\.
*   **Space Complexity:** O\(N\) due to the stack which in the worst case can grow as large as the number of nodes in the tree\.