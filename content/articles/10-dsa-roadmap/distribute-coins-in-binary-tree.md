---
title: Distribute Coins in Binary Tree
description: Master Distribute Coins in Binary Tree in the Binary Tree module.
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

You are given the `root` of a binary tree with `n` nodes where each `node` in the tree has `node.val` coins\. There are `n` coins in total throughout the whole tree\.

In one move, we may choose two adjacent nodes and move one coin from one node to another\. A move may be from parent to child, or from child to parent\.

Return _the_ _**minimum**_ _number of moves required to make every node have_ _**exactly**_ _one coin_\.

##### **Example 1:**

**Input:** root = \[3,0,0\]

**Output:** 2

**Explanation:** From the root of the tree, we move one coin to its left child, and one coin to its right child\.

##### **Example 2:**

**Input:** root = \[0,3,0\]

**Output:** 3

**Explanation:** From the left child of the root, we move two coins to the root \[taking two moves\]\. Then, we move one coin from the root of the tree to the right child\.

##### **Constraints:**

*   The number of nodes in the tree is `n`\.
*   `1 <= n <= 100`
*   `0 <= Node.val <= n`
*   The sum of all `Node.val` is `n`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/distribute-coins-in-binary-tree)

# Approaches

## 1\. Depth First Search

#### **Intuition:**

The problem involves distributing coins in order to reach a state where each node in the binary tree \(including the root\) holds exactly one coin\. If a node has more than one coin, it can give some of them to adjacent nodes\. If a node lacks a coin, it can request one from its adjacent nodes\.

You'll need to use Depth First Search \(DFS\) to explore this tree, using the property that you can calculate how many moves you need by considering the number of excess or deficit coins each node must balance with its parent\.

*   Each node's "excess" is calculated by the number of coins present minus 1 \(since one is needed to stay at the node\)\.
*   This excess or deficit is propagated upwards as you return from recursive DFS calls, making it possible to compute the number of moves required at each step\.

Here's how you can implement this:

#### Code:

Java

```java
class Solution {
   private int moves;

   public int distributeCoins(TreeNode root) {
       moves = 0;
       dfs(root);
       return moves;
   }

   private int dfs(TreeNode node) {
       if (node == null) return 0;

       // Perform postorder traversal: first process left subtree, then right subtree
       int leftExcess = dfs(node.left);
       int rightExcess = dfs(node.right);

       // Calculate the total excess coins at the current node
       int excess = node.val + leftExcess + rightExcess - 1;

       // Accumulate the number of moves needed: absolute value of excess at left and right children
       moves += Math.abs(leftExcess) + Math.abs(rightExcess);

       // Return the excess at this node to the parent call
       return excess;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree\. The DFS touches each node exactly once\.
*   **Space Complexity:** O\(H\), where H is the height of the tree\. The space is used by the recursion stack\. In the worst case \(unbalanced tree\), H could be as large as N\. In the best case \(balanced tree\), H is log\(N\)\.

View Animation