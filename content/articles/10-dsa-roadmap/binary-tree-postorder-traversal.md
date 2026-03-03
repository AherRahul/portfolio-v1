---
title: Binary Tree Postorder Traversal
description: Master Binary Tree Postorder Traversal in the Binary Tree module.
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

Given the `root` of a binary tree, return _the postorder traversal of its nodes' values_\.

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

**Output:** \[3,2,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
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

**Output:** \[4,6,7,5,2,9,8,3,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">8</span><span class="arr-val">1</span></div>
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

#### **Constraints:**

*   The number of the nodes in the tree is in the range `[0, 100]`\.
*   `-100 <= Node.val <= 100`

**Follow up:** Recursive solution is trivial, could you do it iteratively?


## Approaches

### 1\. Recursive Approach

#### Intuition:

The simplest way to perform a postorder traversal on a binary tree is by using recursion\. The nature of postorder traversal is to access children nodes before their parent nodes \(Left\-Right\-Root\)\. Recursion naturally takes care of this backtracking for us\.

#### Code:

```java
class Solution {
   public List<Integer> postorderTraversal(TreeNode root) {
       List<Integer> result = new ArrayList<>();
       postorder(root, result);
       return result;
   }
   
   // Helper function to perform postorder traversal
   private void postorder(TreeNode node, List<Integer> result) {
       if (node == null) return; // Base case: If the node is null, return
       postorder(node.left, result);  // Recursively visit left subtree
       postorder(node.right, result); // Recursively visit right subtree
       result.add(node.val);          // Add node's value after children
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree\.
*   **Space Complexity:** O\(N\) due to the recursion call stack\.

### 2\. Iterative Approach using Two Stacks

#### Intuition:

The iterative approach using two stacks mimics the recursive postorder traversal process by using stacks to explore nodes\. We can push nodes into the first stack to manage depth, and the second stack to reverse the traversal order temporarily\.

#### Code:

```java
class Solution {
   public List<Integer> postorderTraversal(TreeNode root) {
       List<Integer> result = new ArrayList<>();
       if (root == null) return result;

       Stack<TreeNode> stack1 = new Stack<>();
       Stack<TreeNode> stack2 = new Stack<>();
       stack1.push(root);

       while (!stack1.isEmpty()) {
           TreeNode node = stack1.pop();
           stack2.push(node);
           if (node.left != null) stack1.push(node.left); // Push left child to stack1
           if (node.right != null) stack1.push(node.right); // Push right child to stack1
       }

       while (!stack2.isEmpty()) {
           result.add(stack2.pop().val); // Pop from stack2 to get the postorder traversal
       }

       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), because we process each node twice \(pushed into two stacks\)\.
*   **Space Complexity:** O\(N\) due to the extra space used by the two stacks\.

### 3\. Iterative Approach with One Stack

#### Intuition:

Using one stack to mimic the backtracking operations needed for postorder traversal is more efficient\. We need to keep track of previously visited nodes to correctly process the right subtrees after finishing the left subtrees\.

#### Code:

```java
class Solution {
   public List<Integer> postorderTraversal(TreeNode root) {
       List<Integer> result = new ArrayList<>();
       Stack<TreeNode> stack = new Stack<>();
       TreeNode lastVisited = null; // Keep track of the last visited node
       TreeNode current = root;
       
       while (!stack.isEmpty() || current != null) {
           if (current != null) {
               stack.push(current); // Explore left depth
               current = current.left;
           } else {
               TreeNode peekNode = stack.peek(); // Check the top of the stack
               if (peekNode.right != null && lastVisited != peekNode.right) {
                   current = peekNode.right; // Explore the right subtree
               } else {
                   result.add(peekNode.val); // Add the root node's value
                   lastVisited = stack.pop(); // Mark last visited
               }
           }
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), since each node is visited exactly once\.
*   **Space Complexity:** O\(N\) in the worst case, elements in the stack might be as large as the height of the tree\.

#### [Solve it on LeetCode](https://leetcode.com/problems/binary-tree-postorder-traversal)
