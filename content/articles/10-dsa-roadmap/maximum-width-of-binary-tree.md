---
title: Maximum Width of Binary Tree
description: Master Maximum Width of Binary Tree in the Binary Tree module.
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

Given the `root` of a binary tree, return _the_ _**maximum width**_ _of the given tree_\.

The **maximum width** of a tree is the maximum **width** among all levels\.

The **width** of one level is defined as the length between the end\-nodes \(the leftmost and rightmost non\-null nodes\), where the null nodes between the end\-nodes that would be present in a complete binary tree extending down to that level are also counted into the length calculation\.

It is **guaranteed** that the answer will in the range of a **32\-bit** signed integer\.

##### **Example 1:**

Input:root=\[1,3,2,5,3,null,9\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">9</span></div>
  </div>
</div>

135329

**Output:** 4

**Explanation:** The maximum width exists in the third level with length 4 \(5,3,null,9\)\.

##### **Example 2:**

Input:root=\[1,3,2,5,null,null,9,6,null,7\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">8</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">9</span><span class="arr-val">7</span></div>
  </div>
</div>

1356297

**Output:** 7

**Explanation:** The maximum width exists in the fourth level with length 7 \(6,null,null,null,null,null,7\)\.

##### **Example 3:**

Input:root=\[1,3,2,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
  </div>
</div>

1352

**Output:** 2

**Explanation:** The maximum width exists in the second level with length 2 \(3,2\)\.

##### **Constraints:**

*   The number of nodes in the tree is in the range `[1, 3000]`\.
*   `-100 <= Node.val <= 100`


## Approaches

### 1\. BFS with Index Tracking

#### Intuition:

To determine the maximum width of the binary tree, one intuitive method is to perform a level\-wise traversal while keeping track of the indices of nodes if they were part of a "complete" binary tree\. The idea here is that if two nodes are on the same level, the difference between their indices can give us the width at that level\. The maximum width found across all levels is the answer\.

#### Steps:

1.  Use a breadth\-first search \(BFS\) approach to visit all nodes level by level, using a queue to store each node along with its index as if it were in a complete binary tree\.
2.  For each level:

*   Compute the width as the difference between the index of the first and last nodes at that level plus one\.
*   Keep track of the maximum width encountered\.

4.  Continue until all levels have been processed\.

#### Code:

```java
class Solution {
   public int widthOfBinaryTree(TreeNode root) {
       if (root == null) return 0;

       int maxWidth = 0;
       Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
       queue.offer(new Pair<>(root, 0)); // Start with the root at index 0

       while (!queue.isEmpty()) {
           int size = queue.size();
           int minIndex = queue.peek().getValue(); // Minimum index at the current level
           int firstIndex = 0, lastIndex = 0;

           for (int i = 0; i < size; i++) {
               Pair<TreeNode, Integer> pair = queue.poll();
               TreeNode node = pair.getKey();
               int currentIndex = pair.getValue() - minIndex; // Normalize index to avoid overflow

               // Update the first and last index at this level
               if (i == 0) firstIndex = currentIndex;
               if (i == size - 1) lastIndex = currentIndex;

               if (node.left != null) {
                   queue.offer(new Pair<>(node.left, 2 * currentIndex + 1));
               }
               if (node.right != null) {
                   queue.offer(new Pair<>(node.right, 2 * currentIndex + 2));
               }
           }
           maxWidth = Math.max(maxWidth, lastIndex - firstIndex + 1);
       }

       return maxWidth;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes since each node is processed exactly once\.
*   **Space Complexity:** O\(N\), due to the queue storing at most the maximum number of nodes in a given level\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-width-of-binary-tree)
