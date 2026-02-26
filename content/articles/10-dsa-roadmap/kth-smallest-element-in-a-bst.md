---
title: Kth Smallest Element in a BST
description: Master Kth Smallest Element in a BST in the Binary Tree module.
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

Given the `root` of a binary search tree, and an integer `k`, return _the_ `k``th` _smallest value \(__**1\-indexed**__\) of all the values of the nodes in the tree_\.

##### **Example 1:**

**Input:** root = \[3,1,4,null,2\], k = 1

3124

**Output:** 1

##### **Example 2:**

**Input:** root = \[5,3,6,2,4,null,null,1\], k = 3

532146

**Output:** 3

##### **Constraints:**

*   The number of nodes in the tree is `n`\.
*   **1 <= k <= n <= 10****4**
*   **0 <= Node\.val <= 10****4**

**Follow up:** If the BST is modified often \(i\.e\., we can do insert and delete operations\) and you need to find the kth smallest frequently, how would you optimize?

#### [Solve it on LeetCode](https://leetcode.com/problems/kth-smallest-element-in-a-bst)

# Approaches

## 1\. Inorder Traversal with List

#### Intuition:

A Binary Search Tree \(BST\) has the property that an inorder traversal \(left\-root\-right\) of the tree gives the nodes in non\-decreasing order\. By performing an inorder traversal and storing the elements in a list, we can easily access the kth smallest element by retrieving the element at index `k-1` from the list\.

#### Code:

Java

```java
class Solution {
   public int kthSmallest(TreeNode root, int k) {
       List<Integer> inorderList = new ArrayList<>();
       inorderTraversal(root, inorderList);
       return inorderList.get(k - 1);
   }
   
   private void inorderTraversal(TreeNode node, List<Integer> inorderList) {
       if (node == null) return;
       // Traverse left subtree
       inorderTraversal(node.left, inorderList);
       // Visit node
       inorderList.add(node.val);
       // Traverse right subtree
       inorderTraversal(node.right, inorderList);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree\. We visit each node exactly once\.
*   **Space Complexity:** O\(N\) for the list used to store inorder traversal\.

## 2\. Inorder Traversal with Counter

#### Intuition:

By maintaining a counter while doing the inorder traversal, we can stop the traversal as soon as the kth element is found\. This avoids storing all elements, thereby saving space\.

#### Code:

Java

```java
class Solution {
   private int count = 0;
   private int result = -1;
   
   public int kthSmallest(TreeNode root, int k) {
       inorderTraversal(root, k);
       return result;
   }
   
   private void inorderTraversal(TreeNode node, int k) {
       if (node == null) return;
       // Traverse left subtree
       inorderTraversal(node.left, k);
       // Process the current node
       count++;
       // Check if current node is the kth smallest
       if (count == k) {
           result = node.val;
           return;
       }
       // Traverse right subtree
       inorderTraversal(node.right, k);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree\. In the worst case, we visit each node once\.
*   **Space Complexity:** O\(H\), where H is the height of the tree\. This accounts for the recursive stack space\.

## 3\. Iterative Inorder Traversal

#### Intuition:

We can simulate the recursive inorder traversal using an explicit stack\. This allows us to handle trees iteratively, which can be more space efficient in specific scenarios\.

#### Code:

Java

```java
class Solution {
   public int kthSmallest(TreeNode root, int k) {
       Stack<TreeNode> stack = new Stack<>();
       TreeNode current = root;
       
       while (current != null || !stack.isEmpty()) {
           // Reach the leftmost node of the current subtree
           while (current != null) {
               stack.push(current);
               current = current.left;
           }
           
           // Process the node
           current = stack.pop();
           k--;
           if (k == 0) return current.val;
           
           // Move to the right subtree
           current = current.right;
       }
       
       return -1; // This line should never be reached if the tree size is larger than k
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree\. We simulate the inorder traversal iteratively\.
*   **Space Complexity:** O\(H\), where H is the height of the tree, due to the stack used in the iterative approach\.

View Animation