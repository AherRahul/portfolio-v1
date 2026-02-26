---
title: Convert Sorted Array to Binary Search Tree
description: Master Convert Sorted Array to Binary Search Tree in the Binary
  Tree module. Comprehensive guide and algorithmic problem solving.
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

Given an integer array `nums` where the elements are sorted in **ascending order**, convert _it to a_ _**height\-balanced**_ _binary search tree_\.

##### **Example 1:**

Input:nums=\[\-10,\-3,0,5,9\]

0

\-10

1

\-3

2

0

3

5

4

9

Output:\[0,\-3,9,\-10,null,5\]

0\-3\-1095

**Explanation:** \[0,\-10,5,null,\-3,null,9\] is also accepted\.

0\-10\-359

##### **Example 2:**

Input:nums=\[1,3\]

0

1

1

3

Output:\[3,1\]

31

**Explanation:** \[1,null,3\] and \[3,1\] are both height\-balanced BSTs\.

##### **Constraints:**

*   **1 <= nums\.length <= 10****4**
*   **\-10****4** **<= nums\[i\] <= 10****4**
*   `nums` is sorted in a **strictly increasing** order\.

#### [Solve it on LeetCode](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree)

# Approaches

## 1\. Divide and Conquer

#### Intuition:

The problem requires us to convert a sorted array into a height\-balanced binary search tree \(BST\)\. The key observation here is that for the BST to be height\-balanced, the middle of the array should be selected as the root\. This condition ensures that the heights of the subtrees do not vary by more than one\. The left half of the array would then form the left subtree, and the right half would form the right subtree\. This naturally suggests a recursive divide\-and\-conquer algorithm:

1.  Base Case: If the current subarray is empty, return `null`\.
2.  Calculate the middle index of the current subarray\.
3.  Create a root node using the middle element of the subarray\.
4.  Recursively build the left and right subtrees using the left and right halves of the array, respectively\.

#### Code:

Java

```java
class Solution {
   public TreeNode sortedArrayToBST(int[] nums) {
       if (nums == null || nums.length == 0) return null;
       return helper(nums, 0, nums.length - 1);
   }
   
   private TreeNode helper(int[] nums, int left, int right) {
       if (left > right) {
           return null; // base case
       }
       
       int mid = left + (right - left) / 2; // find middle element
       
       TreeNode node = new TreeNode(nums[mid]); // create the root node
       
       node.left = helper(nums, left, mid - 1); // recursively create left subtree
       node.right = helper(nums, mid + 1, right); // recursively create right subtree
       
       return node; // return the constructed node
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(n\), where n is the number of elements in the array\. Each element is processed exactly once to construct the tree\.
*   **Space Complexity**: O\(log n\), which is the space complexity due to the recursion stack in the worst case of a balanced binary tree \(height is log n\)\.

## 2\. Recursive approach using Divide and Conquer

#### Intuition:

While the recursive approach is intuitive, using an iterative approach can help us manage large input sizes or environments where stack depth is limited\. For an iterative solution, we can use a stack to simulate the recursive calls\. The stack will store not only the array indices but also pointers to the parent nodes to connect the newly created nodes as either left or right children\.

1.  Use a stack to maintain a tuple of \(node, left, right\) where `node` is the parent node, and `left`, `right` are the current subarray bounds\.
2.  Pop from the stack and use the middle of the current subarray to create a new TreeNode\.
3.  Attach this new TreeNode to its parent node based on the side it was derived from \(left or right\)\.
4.  Push the bounds of the left and right subarrays along with references to the current TreeNode onto the stack\.

#### Code:

Java

```java
class Solution {
   public TreeNode sortedArrayToBST(int[] nums) {
       if (nums == null || nums.length == 0) return null;

       Stack<Bound> stack = new Stack<>();
       int mid = nums.length / 2;
       TreeNode root = new TreeNode(nums[mid]);
       stack.push(new Bound(root, 0, mid - 1, true)); // left side
       stack.push(new Bound(root, mid + 1, nums.length - 1, false)); // right side

       while (!stack.isEmpty()) {
           Bound b = stack.pop();
           if (b.left > b.right) continue;

           int m = b.left + (b.right - b.left) / 2;
           TreeNode node = new TreeNode(nums[m]);
           if (b.isLeft) {
               b.parent.left = node; // connect to the left
           } else {
               b.parent.right = node; // connect to the right
           }

           // push next bounds onto the stack
           stack.push(new Bound(node, b.left, m - 1, true)); // left side
           stack.push(new Bound(node, m + 1, b.right, false)); // right side
       }
       return root;
   }

   private static class Bound {
       TreeNode parent;
       int left, right;
       boolean isLeft;

       Bound(TreeNode p, int l, int r, boolean left) {
           parent = p;
           left = l;
           right = r;
           isLeft = left;
       }
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(n\), as we process each element of the array exactly once\.
*   **Space Complexity**: O\(n\), because the space used by the stack could be proportional to the number of elements in the worst case\.