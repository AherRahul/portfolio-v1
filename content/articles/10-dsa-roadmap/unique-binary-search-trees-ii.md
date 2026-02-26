---
title: Unique Binary Search Trees II
description: Master Unique Binary Search Trees II in the Dynamic Programming
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

Given an integer `n`, return _all the structurally unique_ _**BST'**__s \(binary search trees\), which has exactly_ `n` _nodes of unique values from_ `1` _to_ `n`\. Return the answer in **any order**\.

##### **Example 1:**

**Input:** n = 3

**Output:** \[\[1,null,2,null,3\],\[1,null,3,2\],\[2,1,3\],\[3,1,null,null,2\],\[3,2,null,1\]\]

##### **Example 2:**

**Input:** n = 1

**Output:** \[\[1\]\]

##### **Constraints:**

*   `1 <= n <= 8`

#### [Solve it on LeetCode](https://leetcode.com/problems/unique-binary-search-trees-ii)

# Approaches

## 1\. Recursive Approach

#### Intuition:

The problem requires generating all unique binary search trees \(BSTs\) that store values 1 to `n`\. The strategy hinges on picking each number as a root and recursively constructing all possible left and right subtrees\.

The problem can be divided as follows:

*   Choose each number `i` from 1 to `n` to serve as the root\.
*   The left subtree will consist of nodes from 1 to `i-1`\.
*   The right subtree will consist of nodes from `i+1` to `n`\.
*   Recursively generate all unique BSTs for these left and right subtrees, and combine them to form the required trees\.

#### Code:

Java

```java
class Solution {
   public List<TreeNode> generateTrees(int n) {
       if (n == 0) return new ArrayList<TreeNode>();
       return generateTrees(1, n);
   }

   private List<TreeNode> generateTrees(int start, int end) {
       List<TreeNode> allTrees = new ArrayList<>();
       // If there is no number to form a tree
       if (start > end) {
           allTrees.add(null);
           return allTrees;
       }
       
       // Pick a root
       for (int i = start; i <= end; i++) {
           // Recursively find all left subtrees with nodes less than i
           List<TreeNode> leftTrees = generateTrees(start, i - 1);
           // Recursively find all right subtrees with nodes greater than i
           List<TreeNode> rightTrees = generateTrees(i + 1, end);
           
           // Connect each left and right subtree to the current root i
           for (TreeNode left : leftTrees) {
               for (TreeNode right : rightTrees) {
                   TreeNode currentTree = new TreeNode(i);
                   currentTree.left = left;
                   currentTree.right = right;
                   allTrees.add(currentTree);
               }
           }
       }
       return allTrees;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(4^n / sqrt\{n\}\) \- There can be an exponential number of trees\.
*   **Space Complexity:** O\(4^n / sqrt\{n\}\) \- For the storage of trees\.

## 2\. Dynamic Programming Approach

#### Intuition:

Instead of recalculating solutions for the same subproblems multiple times, we can use a dynamic programming strategy to store results of previously solved problems in a memoization form\. This helps reduce redundant computations but is more complex to set up and typically provides similar time complexity benefits for this specific problem\.

#### Code:

Java

```java
class Solution {
   public List<TreeNode> generateTrees(int n) {
       if (n == 0) return new ArrayList<TreeNode>();
       return generateTrees(1, n, new ArrayList[n+1][n+1]);
   }

   private List<TreeNode> generateTrees(int start, int end, List<TreeNode>[][] memo) {
       List<TreeNode> allTrees = new ArrayList<>();
       if(start > end) {
           allTrees.add(null);
           return allTrees;
       }
       
       if(memo[start][end] != null) return memo[start][end];
       
       for(int i = start; i <= end; i++) {
           List<TreeNode> leftTrees = generateTrees(start, i - 1, memo);
           List<TreeNode> rightTrees = generateTrees(i + 1, end, memo);
           
           for(TreeNode left : leftTrees) {
               for(TreeNode right : rightTrees) {
                   TreeNode currentTree = new TreeNode(i);
                   currentTree.left = left;
                   currentTree.right = right;
                   allTrees.add(currentTree);
               }
           }
       }
       
       memo[start][end] = allTrees;
       return allTrees;
   }
}

```

Complexity Analysis

*   **Time Complexity:** O\(4^n / sqrt\{n\}\) \- Results are stored for repeated subproblems\.
*   **Space Complexity:** O\(n ^ 2\) \- Due to the memoization matrix\.