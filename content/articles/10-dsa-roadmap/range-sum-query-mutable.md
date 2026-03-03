---
title: Range Sum Query - Mutable
description: Master Range Sum Query - Mutable in the Advanced Topics module.
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

Given an integer array `nums`, handle multiple queries of the following types:

1.  **Update** the value of an element in `nums`\.
2.  Calculate the **sum** of the elements of `nums` between indices `left` and `right` **inclusive** where `left <= right`\.

Implement the `NumArray` class:

*   `NumArray(int[] nums)` Initializes the object with the integer array `nums`\.
*   `void update(int index, int val)` **Updates** the value of `nums[index]` to be `val`\.
*   `int sumRange(int left, int right)` Returns the **sum** of the elements of `nums` between indices `left` and `right` **inclusive** \(i\.e\. `nums[left] + nums[left + 1] + ... + nums[right]`\)\. 

##### **Example 1:**

**Input**

\["NumArray", "sumRange", "update", "sumRange"\]

\[\[\[1, 3, 5\]\], \[0, 2\], \[1, 2\], \[0, 2\]\]

**Output**

\[null, 9, null, 8\]

**Explanation**

```java
NumArray numArray = new NumArray([1, 3, 5]);
numArray.sumRange(0, 2); // return 1 + 3 + 5 = 9
numArray.update(1, 2);   // nums = [1, 2, 5]
numArray.sumRange(0, 2); // return 1 + 2 + 5 = 8
```

##### **Constraints:**

*   **1 <= nums\.length <= 3 \* 10****4**
*   **\-100 <= nums\[i\] <= 100**
*   **0 <= index < nums\.length**
*   **\-100 <= val <= 100**
*   **0 <= left <= right < nums\.length**
*   **At most 3 \* 10****4** **calls will be made to update and sumRange\.**


## Approaches

### 1\. Brute Force

#### Intuition:

*   Each update or sumRange query operates in constant time when using a brute force method\.
*   On `update` operation, we simply change the value at the designated index\.
*   On `sumRange(i, j)` operation, we iterate through the array from index `i` to `j` and calculate the sum\.

This approach sacrifices performance for simplicity, offering an easy\-to\-understand solution at the cost of increased time complexity for range queries\.

#### Code:

```java
class NumArray {
   private int[] nums;
   
   public NumArray(int[] nums) {
       this.nums = nums; // Store the input array
   }
   
   public void update(int index, int val) {
       nums[index] = val; // Directly update the value at index
   }
   
   public int sumRange(int left, int right) {
       int sum = 0;
       // Accumulate the sum from left to right index
       for (int i = left; i <= right; i++) {
           sum += nums[i];
       }
       return sum;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:**

*   `update`: O\(1\)
*   `sumRange`: O\(n\), where n is the number of elements between `left` and `right`\.

*   **Space Complexity:** O\(1\) beyond the input storage, as we do not use any additional data structures besides a simple array\.

### 2\. Segment Tree

#### Intuition:

*   A Segment Tree is designed specifically to solve range query problems efficiently\.
*   It pre\-computes the range sums and supports efficient update and range sum operations\.
*   With Segment Trees, both `update` and `sumRange` operations can be conducted in O\(log n\) time, balancing between brute force direct access and high efficiency\.

#### Code:

```java
class NumArray {
   private int[] segmentTree;
   private int n;

   public NumArray(int[] nums) {
       if (nums.length == 0) return;
       this.n = nums.length;
       segmentTree = new int[n * 4];
       buildSegmentTree(nums, 0, 0, n - 1);
   }

   private void buildSegmentTree(int[] nums, int treeIndex, int lo, int hi) {
       if (lo == hi) {
           segmentTree[treeIndex] = nums[lo];
           return;
       }
       
       int mid = lo + (hi - lo) / 2;
       int leftChild = 2 * treeIndex + 1;
       int rightChild = 2 * treeIndex + 2;
       buildSegmentTree(nums, leftChild, lo, mid);
       buildSegmentTree(nums, rightChild, mid + 1, hi);
       segmentTree[treeIndex] = segmentTree[leftChild] + segmentTree[rightChild];
   }

   public void update(int index, int val) {
       updateSegmentTree(0, 0, n - 1, index, val);
   }

   private void updateSegmentTree(int treeIndex, int lo, int hi, int arrIndex, int val) {
       if (lo == hi) {
           segmentTree[treeIndex] = val;
           return;
       }
       
       int mid = lo + (hi - lo) / 2;
       int leftChild = 2 * treeIndex + 1;
       int rightChild = 2 * treeIndex + 2;
       
       if (arrIndex <= mid) {
           updateSegmentTree(leftChild, lo, mid, arrIndex, val);
       } else {
           updateSegmentTree(rightChild, mid + 1, hi, arrIndex, val);
       }
       segmentTree[treeIndex] = segmentTree[leftChild] + segmentTree[rightChild];
   }

   public int sumRange(int left, int right) {
       return querySegmentTree(0, 0, n - 1, left, right);
   }

   private int querySegmentTree(int treeIndex, int lo, int hi, int left, int right) {
       if (lo > right || hi < left) return 0;
       if (lo >= left && hi <= right) return segmentTree[treeIndex];
       
       int mid = lo + (hi - lo) / 2;
       int leftChild = 2 * treeIndex + 1;
       int rightChild = 2 * treeIndex + 2;
       if (right <= mid) return querySegmentTree(leftChild, lo, mid, left, right);
       else if (left > mid) return querySegmentTree(rightChild, mid + 1, hi, left, right);
       
       int leftSum = querySegmentTree(leftChild, lo, mid, left, right);
       int rightSum = querySegmentTree(rightChild, mid + 1, hi, left, right);
       return leftSum + rightSum;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:**

*   `update`: O\(log n\)
*   `sumRange`: O\(log n\)

*   **Space Complexity:** O\(n\), used by the segment tree structure\.

### 3\. Binary Indexed Tree \(Fenwick Tree\)

#### Intuition:

*   A Binary Indexed Tree \(or Fenwick Tree\) is another advanced data structure that supports prefix sum operations efficiently, similar to Segment Trees\.
*   Fenwick Trees provide a simpler, more compact structure that allows both updates and prefix sum retrievals in O\(log n\) time\.

#### Code:

```java
class NumArray {
   private int[] nums;
   private int[] BIT;
   private int n;
   
   public NumArray(int[] nums) {
       this.n = nums.length;
       this.nums = new int[n];
       System.arraycopy(nums, 0, this.nums, 0, n); // Copy the nums array
       BIT = new int[n + 1];
       for (int i = 0; i < n; i++) {
           init(i, nums[i]);
       }
   }
   
   private void init(int index, int val) {
       index++;
       while (index <= n) {
           BIT[index] += val;
           index += index & -index;
       }
   }
   
   public void update(int index, int val) {
       int diff = val - nums[index];
       nums[index] = val;
       init(index, diff);
   }
   
   public int sumRange(int left, int right) {
       return getSum(right) - getSum(left - 1);
   }
   
   private int getSum(int index) {
       int sum = 0;
       index++;
       while (index > 0) {
           sum += BIT[index];
           index -= index & -index;
       }
       return sum;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:**

*   `update`: O\(log n\)
*   `sumRange`: O\(log n\)

*   **Space Complexity:** O\(n\), used by the Binary Indexed Tree structure\.

#### [Solve it on LeetCode](https://leetcode.com/problems/range-sum-query-mutable)
