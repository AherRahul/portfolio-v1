---
title: Binary Tree Right Side View
description: Master Binary Tree Right Side View in the Binary Tree module.
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

Given the `root` of a binary tree, imagine yourself standing on the **right side** of it, return _the values of the nodes you can see ordered from top to bottom_\.

##### **Example 1:**

Input:root=\[1,2,3,null,5,null,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">4</span></div>
  </div>
</div>

12534

**Output:** \[1,3,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
  </div>
</div>

##### **Example 2:**

Input:root=\[1,2,3,4,null,null,null,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">6</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">5</span></div>
  </div>
</div>

12453

**Output:** \[1,3,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
  </div>
</div>

##### **Example 3:**

Input:root=\[1,null,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

13

**Output:** \[1,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
  </div>
</div>

##### **Example 4:**

**Input:** root = \[\]

**Output:** \[\]

##### **Constraints:**

*   The number of nodes in the tree is in the range `[0, 100]`\.
*   `-100 <= Node.val <= 100`


## Approaches

### 1\. Level Order Traversal

#### Intuition:

The idea is to perform a level order traversal \(BFS\) of the tree\. During the traversal, record the last node you encounter at each level, as that is the node visible from the right side for that level\.

#### Code:

```java
class Solution {
   public List<Integer> rightSideView(TreeNode root) {
       List<Integer> result = new ArrayList<>();
       if (root == null) return result;

       Queue<TreeNode> queue = new LinkedList<>();
       queue.offer(root);

       while (!queue.isEmpty()) {
           int levelSize = queue.size();
           TreeNode rightMostNode = null;

           for (int i = 0; i < levelSize; i++) {
               TreeNode currentNode = queue.poll();
               rightMostNode = currentNode; // Keep updating to the last node at current level

               // Enqueue left and right children
               if (currentNode.left != null) {
                   queue.offer(currentNode.left);
               }
               if (currentNode.right != null) {
                   queue.offer(currentNode.right);
               }
           }
           // Add rightmost node of this level to the result
           if (rightMostNode != null) {
               result.add(rightMostNode.val);
           }
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree since each node is visited once\.
*   **Space Complexity:** O\(D\), where D is the diameter of the tree, because the queue will hold at most one level of nodes\.

### 2\. DFS Preorder Traversal

#### Intuition:

We can use a modified DFS where we always attempt to visit the right child before the left child\. This way, the first time we visit a new depth level, it's guaranteed to be the rightmost element\. Store the value of such a node if the current depth is equal to the size of the result list\.

#### Code:

```java
class Solution {
   private List<Integer> result = new ArrayList<>();

   public List<Integer> rightSideView(TreeNode root) {
       dfs(root, 0);
       return result;
   }

   private void dfs(TreeNode node, int depth) {
       if (node == null) return;

       // Checking if this is the first node of a new depth level
       if (depth == result.size()) {
           result.add(node.val);
       }

       // Prioritize going to the right
       dfs(node.right, depth + 1);
       dfs(node.left, depth + 1);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes because we are potentially visiting all nodes\.
*   **Space Complexity:** O\(H\), where H is the height of the tree due to the recursion stack\.

#### [Solve it on LeetCode](https://leetcode.com/problems/binary-tree-right-side-view)
