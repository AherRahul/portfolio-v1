---
title: Flatten Binary Tree to Linked List
description: Master Flatten Binary Tree to Linked List in the Binary Tree
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

Given the `root` of a binary tree, flatten the tree into a "linked list":

*   The "linked list" should use the same `TreeNode` class where the `right` child pointer points to the next node in the list and the `left` child pointer is always `null`\.
*   The "linked list" should be in the same order as a [**pre\-order traversal**](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR) of the binary tree\.

##### **Example 1:**

Input:root=\[1,2,5,3,4,null,6\]

123456

Output:\[1,null,2,null,3,null,4,null,5,null,6\]

123456

##### **Example 2:**

**Input:** root = \[\]

**Output:** \[\]

##### **Example 3:**

**Input:** root = \[0\]

**Output:** \[0\]

##### **Constraints:**

*   The number of nodes in the tree is in the range `[0, 2000]`\.
*   `-100 <= Node.val <= 100`

**Follow up:** Can you flatten the tree in\-place \(with `O(1)` extra space\)?

#### [Solve it on LeetCode](https://leetcode.com/problems/flatten-binary-tree-to-linked-list)

# Approaches

## 1\. Preorder Traversal and Reconnection

#### Intuition:

The basic idea is to perform a preorder traversal of the tree and store the nodes in a list\. Then, modify the pointers of each node in the list to flatten the tree into a linked list\. This method is straightforward but uses extra space\.

#### Steps:

1.  Perform a preorder traversal using a recursive function\.
2.  Store each visited node in a list\.
3.  Iterate through the list and adjust the left and right pointers to flatten the tree\.

#### Code:

Java

```java
class Solution {
   public void flatten(TreeNode root) {
       if (root == null) return;
       List<TreeNode> nodes = new ArrayList<>();
       preorderTraversal(root, nodes);
       
       for (int i = 0; i < nodes.size() - 1; i++) {
           TreeNode current = nodes.get(i);
           TreeNode next = nodes.get(i + 1);
           current.left = null; // flatten to the right
           current.right = next;
       }
   }
   
   private void preorderTraversal(TreeNode node, List<TreeNode> nodes) {
       if (node == null) return;
       nodes.add(node); // Visit the root
       preorderTraversal(node.left, nodes); // Traverse the left subtree
       preorderTraversal(node.right, nodes); // Traverse the right subtree
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(N\), where N is the number of nodes\. Each node is visited once\.
*   **Space Complexity**: O\(N\), since we store all nodes in a list\.

## 2\. Iterative with Stack

#### Intuition:

This approach uses a stack to simulate the recursion stack used in preorder traversal\. By iterating with a stack, we can avoid using additional space for storing nodes\.

#### Steps:

1.  Use a stack to maintain the nodes to be processed\.
2.  Push the root node onto the stack\.
3.  While the stack is not empty, pop the node, process it, and push its children\.
4.  Adjust the left and right pointers as you traverse each node\.

#### Code:

Java

```java
class Solution {
   public void flatten(TreeNode root) {
       if (root == null) return;
       
       Stack<TreeNode> stack = new Stack<>();
       stack.push(root);
       
       while (!stack.isEmpty()) {
           TreeNode current = stack.pop();
           
           if (current.right != null) {
               stack.push(current.right); // Push the right child first
           }
           if (current.left != null) {
               stack.push(current.left); // Push the left child later
           }
           
           // If stack is not empty, set the current's right to the top of the stack
           if (!stack.isEmpty()) {
               current.right = stack.peek();
           }
           current.left = null; // Make sure the left is null as per problem statement
       }
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(N\), each node is visited once\.
*   **Space Complexity**: O\(N\), in the worst case, the stack can have all the nodes of a skewed tree\.

## 3\. Morris Traversal

#### Intuition:

Morris traversal modifies the tree structure during the traversal and is based on threaded binary trees\. It allows traversal without using extra space other than a few pointers\.

#### Steps:

1.  For each node, if it has a left child, find the rightmost node in its left subtree\.
2.  Redirect the rightmost node's right pointer to the current node's right child\.
3.  Move the current node to its left, then set the left to null\.
4.  Continue to the right of the current node\.

#### Code:

Java

```java
class Solution {
   public void flatten(TreeNode root) {
       TreeNode current = root;
       
       while (current != null) {
           if (current.left != null) {
               TreeNode rightmost = current.left;
               while (rightmost.right != null) {
                   rightmost = rightmost.right; // Find the rightmost node
               }
               rightmost.right = current.right; // Connect the rightmost node of left subtree to the right subtree
               current.right = current.left; // Make the left subtree the right subtree
               current.left = null; // Set the left child to null
           }
           current = current.right; // Move to the right node
       }
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(N\), every node is visited at most twice\.
*   **Space Complexity**: O\(1\), no additional data structures are used\.

View Animation