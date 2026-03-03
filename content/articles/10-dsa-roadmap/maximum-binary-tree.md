---
title: Maximum Binary Tree
description: Master Maximum Binary Tree in the Divide and Conquer module.
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

You are given an integer array `nums` with no duplicates\. A **maximum binary tree** can be built recursively from `nums` using the following algorithm:

1.  Create a root node whose value is the maximum value in `nums`\.
2.  Recursively build the left subtree on the **subarray prefix** to the **left** of the maximum value\.
3.  Recursively build the right subtree on the **subarray suffix** to the **right** of the maximum value\.

Return _the_ _**maximum binary tree**_ _built from_ `nums`\.

##### **Example 1:**

**Input:** nums = \[3,2,1,6,0,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">5</span></div>
  </div>
</div>

**Output:** \[6,3,5,null,2,0,null,null,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">7</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">8</span><span class="arr-val">1</span></div>
  </div>
</div>

##### **Example 2:**

**Input:** nums = \[3,2,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \[3,null,2,null,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
  </div>
</div>

##### **Constraints:**

*   `1 <= nums.length <= 1000`
*   `0 <= nums[i] <= 1000`
*   All integers in `nums` are **unique**\.


## Approaches

### 1\. Recursive Divide and Conquer

#### Intuition:

The problem requires constructing a binary tree where the root is the maximum number in the list, the left subtree is constructed from the elements before this maximum number, and the right subtree is from the elements after this maximum number\. This naturally suggests a recursive approach where at each step, we select the maximum element as the root and recursively construct the left and right subtrees from the remaining elements\.

#### Steps:

1.  **Base Case**: If the input list is empty, return `null` since there's no tree to be constructed\.
2.  **Find Maximum**: Locate the maximum value in the array and identify its index\.
3.  **Construct Node**: Create a tree node with the maximum value\.
4.  **Recursive Construction**:

*   Recursively construct the left subtree using the elements to the left of the maximum value\.
*   Recursively construct the right subtree using elements to the right\.

6.  **Link Subtrees**: Assign the resulting subtrees to the left and right of the current node\.

#### Code:

```java
/**
* Definition for a binary tree node.
* public class TreeNode {
*     int val;
*     TreeNode left;
*     TreeNode right;
*     TreeNode() {}
*     TreeNode(int val) { this.val = val; }
*     TreeNode(int val, TreeNode left, TreeNode right) {
*         this.val = val;
*         this.left = left;
*         this.right = right;
*     }
* }
*/

class Solution {
   public TreeNode constructMaximumBinaryTree(int[] nums) {
       // Start the recursive tree construction.
       return construct(nums, 0, nums.length);
   }
   
   private TreeNode construct(int[] nums, int left, int right) {
       // If the array slice is empty, return null.
       if (left == right) {
           return null;
       }
       
       // Find the index of the maximum element.
       int maxIndex = maxIndex(nums, left, right);
       
       // Create the root node with the maximum value.
       TreeNode root = new TreeNode(nums[maxIndex]);
       
       // Recursively construct the left subtree.
       root.left = construct(nums, left, maxIndex);
       
       // Recursively construct the right subtree.
       root.right = construct(nums, maxIndex + 1, right);
       
       // Return the constructed node.
       return root;
   }
   
   private int maxIndex(int[] nums, int left, int right) {
       int maxIndex = left;
       for (int i = left + 1; i < right; i++) {
           if (nums[i] > nums[maxIndex]) {
               maxIndex = i;
           }
       }
       return maxIndex;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) in the worst case where the array is sorted and each recursive call will scan through the array slice to find the max\. However, in average cases, this is closer to O\(n log n\)\.
*   **Space Complexity:** O\(n\) to keep the recursion stack due to the depth of the recursion\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-binary-tree)
