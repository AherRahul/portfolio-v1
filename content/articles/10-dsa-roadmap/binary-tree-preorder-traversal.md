---
title: Binary Tree Preorder Traversal
description: Master Binary Tree Preorder Traversal in the Binary Tree module.
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

Given the `root` of a binary tree, return _the preorder traversal of its nodes' values_\.

##### **Example 1:**

Input:root=\[1,null,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
  </div>
</div>

123

**Output:** \[1,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

##### **Example 2:**

Input:root=\[1,2,3,4,5,null,8,null,null,6,7,9\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">7</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">8</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">9</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">10</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">11</span><span class="arr-val">9</span></div>
  </div>
</div>

124567389

**Output:** \[1,2,4,5,6,7,3,8,9\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">7</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">8</span><span class="arr-val">9</span></div>
  </div>
</div>

##### **Example 3:**

**Input:** root = \[\]

**Output:** \[\]

##### **Example 4:**

**Input:** root = \[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

##### **Constraints:**

*   The number of nodes in the tree is in the range `[0, 100]`\.
*   `-100 <= Node.val <= 100`

**Follow up:** Recursive solution is trivial, could you do it iteratively?


## Approaches

### 1\. Recursive Approach

#### Intuition:

The recursive approach is the most straightforward way to perform a preorder traversal of a binary tree\. In a preorder traversal, the root node is visited first, followed by the left subtree, and finally the right subtree\. The recursive implementation mimics this order naturally by recursively calling the preorder function for each subtree\.

#### Approach:

*   Visit the root node first\.
*   Recursively traverse the left subtree\.
*   Recursively traverse the right subtree\.

#### Code:

```java
class Solution {
   public List<Integer> preorderTraversal(TreeNode root) {
       List<Integer> result = new ArrayList<>();
       preorder(root, result);
       return result;
   }
   
   private void preorder(TreeNode node, List<Integer> result) {
       if (node == null) {
           return;
       }
       // Add the root node to the result list
       result.add(node.val);
       // Recur on the left child
       preorder(node.left, result);
       // Recur on the right child
       preorder(node.right, result);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of nodes in the binary tree, as we visit each node once\.
*   **Space Complexity:** O\(n\) in the worst case due to the recursion stack, and O\(log n\) for a balanced tree\.

### 2\. Iterative Approach using Stack

#### Intuition:

An iterative approach using a stack is a common way to avoid recursion and control the function call behavior explicitly\. The idea is to mimic the system's call stack with an explicit stack data structure to store nodes yet to be processed\.

#### Approach:

*   Use a stack to keep track of nodes\. Initially, push the root node to the stack\.
*   While the stack is not empty, pop a node from the stack, add its value to the result list, and then push its right and left children to the stack \(in that order\)\.
*   This ensures that nodes are processed in preorder sequence\.

#### Code:

```java
class Solution {
   public List<Integer> preorderTraversal(TreeNode root) {
       List<Integer> result = new ArrayList<>();
       if (root == null) {
           return result;
       }
       
       Stack<TreeNode> stack = new Stack<>();
       stack.push(root);
       
       while (!stack.isEmpty()) {
           TreeNode current = stack.pop();
           result.add(current.val);
           
           // Push right child first so that left child is processed first
           if (current.right != null) {
               stack.push(current.right);
           }
           if (current.left != null) {
               stack.push(current.left);
           }
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), since each node is processed \(visited and added to the result list\) once\.
*   **Space Complexity:** O\(n\), in the worst case, due to the stack holding all nodes \(in the case of a skewed tree\)\. In the best case of a balanced tree, it's O\(log n\)\.

### 3\. Morris Traversal \(Most Optimal\)

#### Intuition:

Morris Traversal modifies the tree structure temporarily to allow traversal of the tree without using additional space or a stack\. It uses the concept of threading a binary tree\.

#### Approach:

1.  Start with the root node and initialize the `current` node to root\.
2.  While the current node is not null:

*   If the current node has no left child, add its value to the result and move to its right child\.
*   If the current node has a left child, find the rightmost node in the left subtree \(inorder predecessor\)\.
*   If the rightmost node's right child is null, set its right child to the current node, and move to the left child\.
*   If the rightmost node's right child is the current node \(thread already exists\), set it back to null \(restoring tree structure\), add the current node's value to result, and move to its right child\.

#### Code:

```java
class Solution {
   public List<Integer> preorderTraversal(TreeNode root) {
       List<Integer> result = new ArrayList<>();
       TreeNode current = root;
       
       while (current != null) {
           if (current.left == null) {
               // If no left child, add current node's value to result
               result.add(current.val);
               // Move to right child
               current = current.right;
           } else {
               // Find the inorder predecessor of current
               TreeNode predecessor = current.left;
               while (predecessor.right != null && predecessor.right != current) {
                   predecessor = predecessor.right;
               }
               
               if (predecessor.right == null) {
                   // Establish thread for redirecting back from left subtree
                   predecessor.right = current;
                   // Add current not to the result before going to left child
                   result.add(current.val);
                   current = current.left;
               } else {
                   // Remove the thread
                   predecessor.right = null;
                   // Move to right child
                   current = current.right;
               }
           }
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), as each edge and node is visited at most twice \(the second time goes without child links\)\.
*   **Space Complexity:** O\(1\), as no additional data structures or recursion stacks are used beyond the result list\.

#### [Solve it on LeetCode](https://leetcode.com/problems/binary-tree-preorder-traversal)
