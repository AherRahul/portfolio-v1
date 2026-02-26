---
title: Find Minimum in Rotated Sorted Array
description: Master Find Minimum in Rotated Sorted Array in the Binary Search
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

Suppose an array of length `n` sorted in ascending order is **rotated** between `1` and `n` times\. For example, the array `nums = [0,1,2,4,5,6,7]` might become:

*   `[4,5,6,7,0,1,2]` if it was rotated `4` times\.
*   `[0,1,2,4,5,6,7]` if it was rotated `7` times\.

Notice that **rotating** an array `[a[0], a[1], a[2], ..., a[n-1]]` 1 time results in the array `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`\.

Given the sorted rotated array `nums` of **unique** elements, return _the minimum element of this array_\.

You must write an algorithm that runs in `O(log n) time`\.

##### **Example 1:**

**Input:** nums = \[3,4,5,1,2\]

0

3

1

4

2

5

3

1

4

2

**Output:** 1

**Explanation:** The original array was \[1,2,3,4,5\] rotated 3 times\.

##### **Example 2:**

**Input:** nums = \[4,5,6,7,0,1,2\]

0

4

1

5

2

6

3

7

4

0

5

1

6

2

**Output:** 0

**Explanation:** The original array was \[0,1,2,4,5,6,7\] and it was rotated 4 times\.

##### **Example 3:**

**Input:** nums = \[11,13,15,17\]

0

11

1

13

2

15

3

17

**Output:** 11

**Explanation:** The original array was \[11,13,15,17\] and it was rotated 4 times\.

##### **Constraints:**

*   `n == nums.length`
*   `1 <= n <= 5000`
*   `-5000 <= nums[i] <= 5000`
*   All the integers of `nums` are **unique**\.
*   `nums` is sorted and rotated between `1` and `n` times\.

#### [Solve it on LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array)

# Approaches

## 1\. Linear Search

#### Intuition:

When thinking about finding the minimum value in a rotated sorted array, a brute\-force approach involves simply traversing the entire array and keeping track of the smallest element encountered\. This is because a linear scan would allow us to identify the minimum element without any additional logic, albeit not efficiently\.

#### Steps:

*   Traverse the array from the first to the last element\.
*   Maintain a variable to store the current minimum element, initially set to the first element of the array\.
*   For each element in the array, update the current minimum if the current element is less than the existing minimum\.
*   By the end of the loop, the stored minimum will be the smallest element in the array\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\. In the worst case, we need to scan each element once\.
*   **Space Complexity:** O\(1\)\. We use only a constant amount of additional space\.

## 2\. Binary Search

#### Intuition:

The rotated sorted array still retains some properties of a sorted array\. In a non\-rotated sorted array, the first element is the smallest\. Upon rotation, this property is only minimally affected\. Hence, a more efficient approach can leverage binary search, exploiting the array's semi\-sorted nature\.

#### Steps:

*   Use two pointers, `left` and `right`, initialized to the start and end of the array respectively\.
*   While `left` is less than `right`, calculate the middle index\.
*   If the middle element is greater than the element at `right`, it means the minimum is to the right of `mid`\.
*   If the middle element is less than or equal to the element at `right`, it means the minimum is at `mid` or to the left of `mid`\.
*   Adjust the `left` or `right` pointers accordingly\.
*   When the loop exits, `left` will point to the smallest element\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(log n\), where n is the number of elements in the array\. Binary search reduces the search space by half each time\.
*   **Space Complexity:** O\(1\)\. Similarly, only a constant amount of space is used\.

View Animation