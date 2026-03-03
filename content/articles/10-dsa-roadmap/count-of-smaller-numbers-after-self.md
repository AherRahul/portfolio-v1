---
title: Count of Smaller Numbers After Self
description: Master Count of Smaller Numbers After Self in the Advanced Topics
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an integer array `nums`, return _an integer array_ `counts` _where_ `counts[i]` _is the number of smaller elements to the right of_ `nums[i]`\.

##### **Example 1:**

**Input:** nums = \[5,2,6,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \[2,1,1,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
  </div>
</div>

**Explanation:**

To the right of 5 there are **2** smaller elements \(2 and 1\)\.

To the right of 2 there is only **1** smaller element \(1\)\.

To the right of 6 there is **1** smaller element \(1\)\.

To the right of 1 there is **0** smaller element\.

##### **Example 2:**

**Input:** nums = \[\-1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-1</span></div>
  </div>
</div>

**Output:** \[0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
  </div>
</div>

##### **Example 3:**

**Input:** nums = \[\-1,\-1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">-1</span></div>
  </div>
</div>

**Output:** \[0,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
  </div>
</div>

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **\-10****4** **<= nums\[i\] <= 10****4**


## Approaches

### 1\. Brute Force

#### Intuition:

The simplest approach is to check each element and count how many numbers after it are smaller\. This involves iterating over each element and then iterating over subsequent elements to count the smaller numbers\.

#### Code:

```java
class Solution {
   public List<Integer> countSmaller(int[] nums) {
       List<Integer> result = new ArrayList<>();
       if (nums == null || nums.length == 0) {
           return result;
       }

       for (int i = 0; i < nums.length; i++) {
           int count = 0;
           for (int j = i + 1; j < nums.length; j++) {
               // Count the number of smaller elements after current element
               if (nums[j] < nums[i]) {
                   count++;
               }
           }
           result.add(count);
       }

       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where n is the number of elements in the array\.
*   **Space Complexity:** O\(1\), since we are using only a fixed amount of extra space\.

### 2\. Binary Search Tree \(BST\)

#### Intuition:

By using a BST, where each node contains the number of times it and all its left descendants have been inserted, we can efficiently insert each number in reverse order and count how many smaller elements have already been inserted\.

#### Code:

```java
class Solution {
   class TreeNode {
       int val, leftCount;
       TreeNode left, right;

       public TreeNode(int val) {
           this.val = val;
           this.leftCount = 0;
       }
   }

   public List<Integer> countSmaller(int[] nums) {
       Integer[] result = new Integer[nums.length];
       TreeNode root = null;

       for (int i = nums.length - 1; i >= 0; i--) {
           root = insert(root, nums[i], result, i, 0);
       }

       return Arrays.asList(result);
   }

   private TreeNode insert(TreeNode node, int val, Integer[] result, int index, int preSum) {
       if (node == null) {
           node = new TreeNode(val);
           result[index] = preSum;
       } else if (val <= node.val) {
           node.leftCount++;
           node.left = insert(node.left, val, result, index, preSum);
       } else {
           node.right = insert(node.right, val, result, index, preSum + node.leftCount + 1);
       }

       return node;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\), assuming the BST is balanced\.
*   **Space Complexity:** O\(n\), due to the space needed for the BST\.

### 3\. Fenwick Tree \(or Binary Indexed Tree\)

#### Intuition:

Fenwick Tree is useful for maintaining prefix sums efficiently\. We can translate the problem into finding the frequency of numbers, querying this frequency with a Fenwick Tree while iterating the array backwards\.

#### Code:

```java
class Solution {
   public List<Integer> countSmaller(int[] nums) {
       List<Integer> res = new ArrayList<>();
       if (nums == null || nums.length == 0) return res;
       
       int offset = 10000; // offset to handle negative numbers
       int size = 2 * 10000 + 1; // total range of (-10000 to 10000) + offset
       int[] tree = new int[size];
       
       for (int i = nums.length - 1; i >= 0; i--) {
           int smallerCount = query(nums[i] + offset, tree);
           res.add(0, smallerCount);
           update(nums[i] + offset, 1, size, tree);
       }
       
       return res;
   }

   private int query(int index, int[] tree) {
       int sum = 0;
       while (index > 0) {
           sum += tree[index];
           index -= index & -index;
       }
       return sum;
   }

   private void update(int index, int delta, int size, int[] tree) {
       while (index < size) {
           tree[index] += delta;
           index += index & -index;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\), due to the operations on the Fenwick Tree\.
*   **Space Complexity:** O\(n\), for the Fenwick Tree\.

### 4\. Merge Sort

#### Intuition:

This is a modification of merge sort\. What we can do is keep track of how many elements are moved after an item in the merge process\.

#### Code:

```java
class Solution {
   private int[] count;
   private int[] indices;

   public List<Integer> countSmaller(int[] nums) {
       count = new int[nums.length];
       indices = new int[nums.length];
       
       for (int i = 0; i < nums.length; i++) {
           indices[i] = i;  // store the index of elements
       }
       
       mergeSort(nums, 0, nums.length - 1);
       List<Integer> result = new ArrayList<>();
       
       for (int i : count) {
           result.add(i);
       }
       
       return result;
   }

   private void mergeSort(int[] nums, int left, int right) {
       if (left >= right) return;
       
       int mid = left + (right - left) / 2;
       mergeSort(nums, left, mid);
       mergeSort(nums, mid + 1, right);
       
       merge(nums, left, mid, right);
   }

   private void merge(int[] nums, int left, int mid, int right) {
       int[] newIndices = new int[right - left + 1];
       int l = left, r = mid + 1, k = 0, rightCount = 0;
       
       while (l <= mid && r <= right) {
           if (nums[indices[r]] < nums[indices[l]]) {
               newIndices[k++] = indices[r++];
               rightCount++; // count right elements that are less than left elements
           } else {
               count[indices[l]] += rightCount;
               newIndices[k++] = indices[l++];
           }
       }
       
       while (l <= mid) {
           count[indices[l]] += rightCount;
           newIndices[k++] = indices[l++];
       }
       
       while (r <= right) {
           newIndices[k++] = indices[r++];
       }
       
       for (int i = left; i <= right; i++) {
           indices[i] = newIndices[i - left];
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\), due to the sorting process\.
*   **Space Complexity:** O\(n\), due to the helper arrays used in merge sort\.

#### [Solve it on LeetCode](https://leetcode.com/problems/count-of-smaller-numbers-after-self)
