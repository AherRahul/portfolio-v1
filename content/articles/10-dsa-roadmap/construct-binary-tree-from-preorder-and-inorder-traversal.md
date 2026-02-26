---
title: Construct Binary Tree from Preorder and Inorder Traversal
description: Master Construct Binary Tree from Preorder and Inorder Traversal in
  the Binary Tree module. Comprehensive guide and algorithmic problem solving.
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

Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return _the binary tree_\.

##### **Example 1:**

**Input:** preorder = \[3,9,20,15,7\], inorder = \[9,3,15,20,7\]

Output:\[3,9,20,null,null,15,7\]

3920157

##### **Example 2:**

**Input:** preorder = \[\-1\], inorder = \[\-1\]

**Output:** \[\-1\]

**Constraints:**

*   `1 <= preorder.length <= 3000`
*   `inorder.length == preorder.length`
*   `-3000 <= preorder[i], inorder[i] <= 3000`
*   `preorder` and `inorder` consist of **unique** values\.
*   Each value of `inorder` also appears in `preorder`\.
*   `preorder` is **guaranteed** to be the preorder traversal of the tree\.
*   `inorder` is **guaranteed** to be the inorder traversal of the tree\.

#### [Solve it on LeetCode](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal)

# Approaches

## 1\. Recursive Construction \(Naive\)

#### **Intuition:**

The main idea is to understand the properties of preorder and inorder traversal:

*   In preorder traversal, the first element is always the root of the tree\.
*   In inorder traversal, the elements left of the root belong to the left subtree and the elements right of the root belong to the right subtree\.

We can recursively construct the tree by following these steps:

1.  Identify the root from the preorder list\.
2.  Find the index of this root in the inorder list\.
3.  Split the inorder list into left and right subtrees\.
4.  Recursively build the left and right subtrees\.

#### Code:

Java

```java
class Solution {
   public TreeNode buildTree(int[] preorder, int[] inorder) {
       // Call the helper function with initial indices
       return buildTree(preorder, inorder, 0, preorder.length - 1, 0, inorder.length - 1);
   }

   private TreeNode buildTree(int[] preorder, int[] inorder, 
                              int preStart, int preEnd, int inStart, int inEnd) {
       // Base case: if there are no elements to construct the tree
       if (preStart > preEnd || inStart > inEnd) {
           return null;
       }

       // The first element in preorder is the root
       TreeNode root = new TreeNode(preorder[preStart]);

       // Find the root element index in inorder array
       int inRootIndex = 0;
       for (int i = inStart; i <= inEnd; i++) {
           if (inorder[i] == root.val) {
               inRootIndex = i;
               break;
           }
       }

       // Calculate the size of the left subtree
       int leftTreeSize = inRootIndex - inStart;

       // Recursive construction of left and right subtrees
       root.left = buildTree(preorder, inorder, preStart + 1, preStart + leftTreeSize, inStart, inRootIndex - 1);
       root.right = buildTree(preorder, inorder, preStart + leftTreeSize + 1, preEnd, inRootIndex + 1, inEnd);

       return root;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N^2\), where N is the number of nodes\. This is because for each node, we potentially scan the entire inorder array\.
*   **Space Complexity:** O\(N\), for the recursion call stack\.

## 2\. Optimized Recursive Construction using HashMap

#### **Intuition:**

The inefficiency in the previous approach is due to scanning the inorder array to find the root index\. We can use a HashMap to store the index of each value in the inorder array, allowing O\(1\) lookup for the root index\.

#### Code:

Java

```java
class Solution {
   public TreeNode buildTree(int[] preorder, int[] inorder) {
       // Map to store the indices of inorder elements for O(1) access
       Map<Integer, Integer> inorderMap = new HashMap<>();
       for (int i = 0; i < inorder.length; i++) {
           inorderMap.put(inorder[i], i);
       }
       // Call helper function
       return buildTree(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1, inorderMap);
   }

   private TreeNode buildTree(int[] preorder, int preStart, int preEnd,
                              int[] inorder, int inStart, int inEnd,
                              Map<Integer, Integer> inorderMap) {
       // Base case: no elements left to construct the tree
       if (preStart > preEnd || inStart > inEnd) {
           return null;
       }

       // First element in preorder is the root
       TreeNode root = new TreeNode(preorder[preStart]);

       // Find the index of the root in inorder array using the map
       int inRootIndex = inorderMap.get(root.val);
       int leftTreeSize = inRootIndex - inStart;

       // Recursive construction of left and right subtrees
       root.left = buildTree(preorder, preStart + 1, preStart + leftTreeSize, inorder, inStart, inRootIndex - 1, inorderMap);
       root.right = buildTree(preorder, preStart + leftTreeSize + 1, preEnd, inorder, inRootIndex + 1, inEnd, inorderMap);

       return root;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes\. We avoid repeated scanning of inorder by using HashMap\.
*   **Space Complexity:** O\(N\), for the recursion call stack and the HashMap\.