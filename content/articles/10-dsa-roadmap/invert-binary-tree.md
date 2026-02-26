---
title: Invert Binary Tree
description: Master Invert Binary Tree in the Binary Tree module. Comprehensive
  guide and algorithmic problem solving.
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

Given the `root` of a binary tree, invert the tree, and return _its root_\.

##### **Example 1:**

Input:root=\[4,2,7,1,3,6,9\]

4213769

Output:\[4,7,2,9,6,3,1\]

4796231

##### **Example 2:**

Input:root=\[2,1,3\]

213

Output:\[2,3,1\]

231

##### **Example 3:**

**Input:** root = \[\]

**Output:** \[\]

#### **Constraints:**

*   The number of nodes in the tree is in the range `[0, 100]`\.
*   `-100 <= Node.val <= 100`

#### [Solve it on LeetCode](https://leetcode.com/problems/invert-binary-tree)

# Approaches

## 1\. Recursive Approach

#### **Intuition**:

The recursive approach is elegant and leverages the natural recursive structure of trees\. The idea is to swap the left and right children of a node recursively\. For each node, invert the left subtree and the right subtree\. This results in a mirrored version of the original tree\.

#### Code:

Java

```java
class Solution {
   public TreeNode invertTree(TreeNode root) {
       // Base case: if the tree is empty, return null
       if (root == null) {
           return null;
       }
       
       // Recursively invert the left and right subtrees
       TreeNode left = invertTree(root.left);
       TreeNode right = invertTree(root.right);
       
       // Swap the left and right children
       root.left = right;
       root.right = left;
       
       // Return the root node which now represents the root of the inverted subtree
       return root;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) \- We visit each node exactly once\.
*   **Space Complexity:** O\(h\) \- The recursion stack space is proportional to the height of the tree `h`\.

## 2\. Iterative Approach Using BFS

#### **Intuition**:

We can also solve this problem iteratively using a breadth\-first search \(BFS\) approach\. The idea is to use a queue to perform a level\-order traversal of the tree\. At each node, swap the left and right children\.

#### Code:

Java

```java
class Solution {
   public TreeNode invertTree(TreeNode root) {
       if (root == null) {
           return null;
       }
       
       Queue<TreeNode> queue = new LinkedList<>();
       queue.offer(root);
       
       while (!queue.isEmpty()) {
           TreeNode current = queue.poll();
           
           // Swap the left and right children
           TreeNode temp = current.left;
           current.left = current.right;
           current.right = temp;
           
           // If the left child is not null, add it to the queue for further processing
           if (current.left != null) {
               queue.offer(current.left);
           }
           // If the right child is not null, add it to the queue for further processing
           if (current.right != null) {
               queue.offer(current.right);
           }
       }
       
       return root;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) \- Each node is visited once\.
*   **Space Complexity:** O\(n\) \- In the worst case, the queue will hold all the nodes in a level of the tree\.

## 3\. Iterative Approach Using DFS with Stack

#### **Intuition**:

Another iterative method is using depth\-first search \(DFS\) with a stack\. Similar to BFS, traverse the tree and swap left and right children for each node encountered\.

#### Code:

Java

```java
class Solution {
   public TreeNode invertTree(TreeNode root) {
       if (root == null) {
           return null;
       }
       
       Stack<TreeNode> stack = new Stack<>();
       stack.push(root);
       
       while (!stack.isEmpty()) {
           TreeNode node = stack.pop();
           
           // Swap the left and right children
           TreeNode temp = node.left;
           node.left = node.right;
           node.right = temp;
           
           // If the left child is not null, add it to the stack for further processing
           if (node.left != null) {
               stack.push(node.left);
           }
           // If the right child is not null, add it to the stack for further processing
           if (node.right != null) {
               stack.push(node.right);
           }
       }
       
       return root;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) \- Every node is pushed and popped from the stack once\.
*   **Space Complexity:** O\(n\) \- In the worst case, the stack will hold all nodes in a path from root to a leaf\.

View Animation