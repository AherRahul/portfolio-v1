---
title: House Robber III
description: Master House Robber III in the Dynamic Programming module.
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

The thief has found himself a new place for his thievery again\. There is only one entrance to this area, called `root`\.

Besides the `root`, each house has one and only one parent house\. After a tour, the smart thief realized that all houses in this place form a binary tree\. It will automatically contact the police if **two directly\-linked houses were broken into on the same night**\.

Given the `root` of the binary tree, return _the maximum amount of money the thief can rob_ _**without alerting the police**_\.

##### **Example 1:**

**Input:** root = \[3,2,3,null,3,null,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
</div>

32331

**Output:** 7

**Explanation:** Maximum amount of money the thief can rob = 3 \+ 3 \+ 1 = 7\.

##### **Example 2:**

**Input:** root = \[3,4,5,1,3,null,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
</div>

341351

**Output:** 9

**Explanation:** Maximum amount of money the thief can rob = 4 \+ 5 = 9\.

##### **Constraints:**

*   The number of nodes in the tree is in the range **\[1, 10****4****\]**\.
*   **0 <= Node\.val <= 10****4**


## Approaches

### 1\. Recursive DFS \(Depth\-First Search\)

#### Intuition:

The problem is an extension of the House Robber problem\. Here, the houses are in the form of a binary tree, and the rule is the same: we cannot rob two directly\-linked houses\. A straightforward way to solve this problem is to use DFS and recursion to consider all possible combinations of robbing/not robbing a node and calculate the maximum amount\.

The basic idea is:

*   For each node, we have two choices: rob this house or not\.
*   If we rob this house, we cannot rob its children but can consider its grandchildren\.
*   If we do not rob this house, we can move to its children freely\.

#### Code:

```java
class Solution {
   public int rob(TreeNode root) {
       return robDFS(root);
   }
   
   private int robDFS(TreeNode node) {
       if (node == null) return 0;
       
       int money = node.val;
       
       // Option 1: Rob this node
       if (node.left != null) {
           money += robDFS(node.left.left) + robDFS(node.left.right);
       }
       if (node.right != null) {
           money += robDFS(node.right.left) + robDFS(node.right.right);
       }
       
       // Option 2: Do not rob this node
       int notRobbing = robDFS(node.left) + robDFS(node.right);
       
       return Math.max(money, notRobbing);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(2^n\) \- For each node, two recursive calls are made, leading to an exponential number of calls\.
*   **Space Complexity:** O\(n\) \- In the worst case, the depth of the recursion tree can go up to N, the number of nodes in the tree\.

### 2\. DFS with Memoization

#### Intuition:

To optimize the above approach, we implement memoization\. The recursive approach recalculates the same values multiple times\. Instead, we can store the results for each subtree for a node, which saves computation time\.

We use a HashMap to store the result for each node so we don't compute the value of a node more than once\.

#### Code:

```java
class Solution {
   Map<TreeNode, Integer> memo = new HashMap<>();

   public int rob(TreeNode root) {
       return robDFS(root);
   }
   
   private int robDFS(TreeNode node) {
       if (node == null) return 0;
       
       // Check if result already exists for this node
       if (memo.containsKey(node)) return memo.get(node);

       int money = node.val;
       
       // Option 1: Rob this node
       if (node.left != null) {
           money += robDFS(node.left.left) + robDFS(node.left.right);
       }
       if (node.right != null) {
           money += robDFS(node.right.left) + robDFS(node.right.right);
       }
       
       // Option 2: Do not rob this node
       int notRobbing = robDFS(node.left) + robDFS(node.right);
       
       // Store result in memo
       int result = Math.max(money, notRobbing);
       memo.put(node, result);
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- Each node is visited once, and results are stored and reused\.
*   **Space Complexity:** O\(n\) \- The extra space needed for the memo map as well as the recursion stack\.

### 3\. Optimized DFS with Return Values \(Most Optimal\)

#### Intuition:

Rather than relying solely on memoization, we can optimize further by using a pair of values returned for each node:

*   The maximum money that can be robbed if the current node is not robbed\.
*   The maximum money that can be robbed if the current node is robbed\.

This approach allows us to eliminate the use of an external hashmap by encompassing all information in a succinct recursive return\.

#### Code:

```java
class Solution {
   public int rob(TreeNode root) {
       int[] result = robDFS(root);
       return Math.max(result[0], result[1]);
   }
   
   // Returns an array of two elements:
   // [0] - Maximum money if `node` is not robbed
   // [1] - Maximum money if `node` is robbed
   private int[] robDFS(TreeNode node) {
       if (node == null) return new int[2];
       
       int[] left = robDFS(node.left);
       int[] right = robDFS(node.right);
       
       int[] res = new int[2];
       
       res[0] = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
       res[1] = node.val + left[0] + right[0];
       
       return res;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- Each node is visited once, and each node provides instantaneous information for further computations\.
*   **Space Complexity:** O\(h\) \- The depth of the recursion stack, where `h` is the height of the tree, due to recursion\.

#### [Solve it on LeetCode](https://leetcode.com/problems/house-robber-iii)
