---
title: Validate Binary Search Tree
description: Master Validate Binary Search Tree in the Binary Tree module.
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

Given the `root` of a binary tree, _determine if it is a valid binary search tree \(BST\)_\.

A **valid BST** is defined as follows:

*   The left subtree of a node contains only nodes with keys **strictly less than** the node's key\.
*   The right subtree of a node contains only nodes with keys **strictly greater than** the node's key\.
*   Both the left and right subtrees must also be binary search trees\.

##### **Example 1:**

Input:root=\[2,1,3\]

213

**Output:** true

##### **Example 2:**

Input:root=\[5,1,4,null,null,3,6\]

51436

**Output:** false

**Explanation:** The root node's value is 5 but its right child's value is 4\.

##### **Constraints:**

*   The number of nodes in the tree is in the range **\[1, 10****4****\]\.**
*   **\-2****31** **<= Node\.val <= 2****31** **\- 1**

#### [Solve it on LeetCode](https://leetcode.com/problems/validate-binary-search-tree)

# Approaches

## 1\. Inorder Traversal Recursively

#### Intuition:

A Binary Search Tree \(BST\) has the property that for each node, all the nodes in its left subtree have smaller values and all the nodes in its right subtree have larger values\. Performing an inorder traversal of a BST should produce a sorted array of values\. If the inorder traversal yields a sorted sequence without any repeated values, then the tree is a valid BST\.

#### Steps:

1.  Perform an inorder traversal to check if each node value matches a sorted sequence\.
2.  Use a helper function to perform the inorder traversal recursively\.
3.  Keep track of the last seen value during the traversal to ensure that each current node's value is greater\.

#### Code:

Java

```java
class Solution {
   private Integer lastSeenValue = null;

   public boolean isValidBST(TreeNode root) {
       return inorderTraversal(root);
   }

   private boolean inorderTraversal(TreeNode node) {
       if (node == null) {
           return true;
       }

       // Traverse the left subtree
       if (!inorderTraversal(node.left)) {
           return false;
       }

       // Ensure current node's value is greater than the last seen value
       if (lastSeenValue != null && node.val <= lastSeenValue) {
           return false;
       }
       lastSeenValue = node.val;

       // Traverse the right subtree
       return inorderTraversal(node.right);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\) where N is the number of nodes in the BST because each node is visited exactly once\.
*   **Space Complexity:** O\(N\) for the recursion stack\.

## 2\. Inorder Traversal Iteratively

#### Intuition:

We can simulate the recursive inorder traversal using a stack to achieve an iterative solution\. We push nodes to the stack while moving left, and then pop them to process each as we move right\. This allows us to validate the BST properties without a recursive helper function\.

#### Steps:

1.  Use a stack to simulate the inorder traversal\.
2.  Push nodes onto the stack while traversing left\.
3.  As nodes are popped from the stack, check the sequence order similar to the recursive approach\.
4.  Store the last visited node value to validate the sorted order\.

#### Code:

Java

```java
class Solution {
   public boolean isValidBST(TreeNode root) {
       Stack<TreeNode> stack = new Stack<>();
       Integer lastSeenValue = null;
       TreeNode currentNode = root;

       while (!stack.isEmpty() || currentNode != null) {
           // Push all nodes from the left subtree
           while (currentNode != null) {
               stack.push(currentNode);
               currentNode = currentNode.left;
           }

           // Process current node
           currentNode = stack.pop();
           if (lastSeenValue != null && currentNode.val <= lastSeenValue) {
               return false;
           }
           lastSeenValue = currentNode.val;

           // Move to the right subtree
           currentNode = currentNode.right;
       }

       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\) due to visiting each node once\.
*   **Space Complexity:** O\(N\) due to stack usage\.

## 3\. Recursive Valid Range

#### Intuition:

Instead of relying on inorder traversal, directly utilize the properties of a BST\. For each node, determine a valid range it should lie within\. The left child must be less than the current node and the right child greater\. By passing down this valid range, you can recursively validate the entire tree\.

#### Steps:

1.  Use a helper function to pass down the minimum and maximum allowable values for each node\.
2.  Check if the current node's value lies within the valid range\.
3.  Recursively check the left subtree with an updated max value and the right subtree with an updated min value\.

#### Code:

Java

```java
class Solution {
   public boolean isValidBST(TreeNode root) {
       return validate(root, null, null);
   }

   private boolean validate(TreeNode node, Integer min, Integer max) {
       if (node == null) {
           return true;
       }

       // Validate current node's value
       if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
           return false;
       }

       // Check the left subtree and right subtree
       return validate(node.left, min, node.val) && validate(node.right, node.val, max);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), as each node is checked once\.
*   **Space Complexity:** O\(N\) in the worst case due to the recursion stack using space\.