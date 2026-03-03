---
title: Path Sum III
description: Master Path Sum III in the Binary Tree module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given the `root` of a binary tree and an integer `targetSum`, return _the number of paths where the sum of the values along the path equals_ `targetSum`\.

The path does not need to start or end at the root or a leaf, but it must go downwards \(i\.e\., traveling only from parent nodes to child nodes\)\.

##### **Example 1:**

**Input:** root = \[10,5,\-3,3,2,null,11,3,\-2,null,1\], targetSum = 8

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">11</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">-2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">9</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">10</span><span class="arr-val">1</span></div>
  </div>
</div>

10533\-221\-311

**Output:** 3

##### **Example 2:**

**Input:** root = \[5,4,8,11,null,13,4,7,2,null,null,5,1\], targetSum = 22

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">11</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">13</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">9</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">10</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">11</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">12</span><span class="arr-val">1</span></div>
  </div>
</div>

541172813451

**Output:** 3

##### **Constraints:**

*   The number of nodes in the tree is in the range `[0, 1000]`\.
*   **\-10****9** **<= Node\.val <= 10****9**
*   **\-1000 <= targetSum <= 1000**


## Approaches

### 1\. Brute Force Approach

#### Intuition:

The brute force approach involves iterating over each node and trying to find all paths starting from each node that sum up to the given `targetSum`\. For each node, we perform a DFS traversal while counting paths that result in the `targetSum`\.

#### Steps:

1.  For each node, you calculate path sums starting from the node itself\.
2.  Use a helper function to recursively calculate path sums from the current node\.
3.  Use another function to iterate over each node and treat it as a starting point\.

#### Code:

```java
class Solution {
   // Main function to call to count paths summing to targetSum
   public int pathSum(TreeNode root, int targetSum) {
       if (root == null) return 0;

       // Count paths starting from the current node
       int countFromRoot = pathSumFrom(root, targetSum);
       
       // Recursively check for paths starting from the left and right children
       int countLeft = pathSum(root.left, targetSum);
       int countRight = pathSum(root.right, targetSum);
       
       // Return total count of paths from current node, left child, and right child
       return countFromRoot + countLeft + countRight;
   }
   
   // Helper function to count paths with sum equal to target from given node
   private int pathSumFrom(TreeNode node, int targetSum) {
       if (node == null) return 0;
       
       int count = 0;
       
       // Check if the current node's value is equal to targetSum
       if (node.val == targetSum) count++;
       
       // Continue checking for sum with the left child and right child
       count += pathSumFrom(node.left, targetSum - node.val);
       count += pathSumFrom(node.right, targetSum - node.val);
       
       return count;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) where \(n\) is the number of nodes in the tree\. In the worst case, each node is visited \(n\) times\.
*   **Space Complexity:** O\(n\) for the recursion stack in the worst case if the tree is completely unbalanced\.

### 2\. Prefix Sum Approach

#### Intuition:

This optimized approach uses a hashmap to store the prefix sum frequencies encountered so far while traversing the tree\. The idea is to leverage the prefix sum technique to quickly find if there exists a subpath ending in the current node that sums up to the `targetSum`\.

#### Steps:

1.  Use a recursive function to traverse the tree\.
2.  For each node, calculate its prefix sum\.
3.  Use a hashmap to check whether there exists a prefix sum such that removing it from the current prefix sum would give us the `targetSum`\.
4.  Update the prefix sum count in the hashmap while going deeper into the recursion and undo changes when backtracking\.

#### Code:

```java
class Solution {
   public int pathSum(TreeNode root, int targetSum) {
       Map<Long, Integer> prefixSumCount = new HashMap<>();
       prefixSumCount.put(0L, 1);  // Initialize with base case
       return dfs(root, 0, targetSum, prefixSumCount);
   }

   private int dfs(TreeNode node, long currentSum, int targetSum, Map<Long, Integer> prefixSumCount) {
       if (node == null) return 0;
       
       // Update the current prefix sum
       currentSum += node.val;
       
       // Calculate the number of valid paths ending at the current node
       int numPathsToCurrent = prefixSumCount.getOrDefault(currentSum - targetSum, 0);
       
       // Update the map for the current prefix sum
       prefixSumCount.put(currentSum, prefixSumCount.getOrDefault(currentSum, 0) + 1);
       
       // Recur for left and right subtrees and accumulate results
       int result = numPathsToCurrent + 
                    dfs(node.left, currentSum, targetSum, prefixSumCount) +
                    dfs(node.right, currentSum, targetSum, prefixSumCount);
       
       // Backtrack to ensure the prefixSumCount is correctly maintained
       prefixSumCount.put(currentSum, prefixSumCount.get(currentSum) - 1);
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) since each node is visited once\.
*   **Space Complexity:** O\(n\) for the hashmap storing the prefix sums and for the recursion stack in the worst case\.

#### [Solve it on LeetCode](https://leetcode.com/problems/path-sum-iii)
