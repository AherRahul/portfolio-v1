---
title: Find K Pairs with Smallest Sums
description: Master Find K Pairs with Smallest Sums in the Heaps module.
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

You are given two integer arrays `nums1` and `nums2` sorted in **non\-decreasing order** and an integer `k`\.

Define a pair `(u, v)` which consists of one element from the first array and one element from the second array\.

Return _the_ `k` _pairs_ **\(u****1****, v****1****\), \(u****2****, v****2****\), \.\.\., \(u****k****, v****k****\)** _with the smallest sums_\.

##### **Example 1:**

**Input:** nums1 = \[1,7,11\], nums2 = \[2,4,6\], k = 3

**Output:** \[\[1,2\],\[1,4\],\[1,6\]\]

**Explanation:** The first 3 pairs are returned from the sequence: \[1,2\],\[1,4\],\[1,6\],\[7,2\],\[7,4\],\[11,2\],\[7,6\],\[11,4\],\[11,6\]

##### **Example 2:**

**Input:** nums1 = \[1,1,2\], nums2 = \[1,2,3\], k = 2

**Output:** \[\[1,1\],\[1,1\]\]**Explanation:** The first 2 pairs are returned from the sequence: \[1,1\],\[1,1\],\[1,2\],\[2,1\],\[1,2\],\[2,2\],\[1,3\],\[1,3\],\[2,3\]

##### **Constraints:**

*   **1 <= nums1\.length, nums2\.length <= 10****5**
*   **\-10****9** **<= nums1\[i\], nums2\[i\] <= 10****9**
*   **nums1 and nums2 both are sorted in non\-decreasing order\.**
*   **1 <= k <= 10****4**
*   **k <= nums1\.length \* nums2\.length**

#### [Solve it on LeetCode](https://leetcode.com/problems/find-k-pairs-with-smallest-sums)

# Approaches

## 1\. Brute Force Approach

#### Intuition:

In the brute force approach, we aim to calculate the sum of every possible pair from two arrays and sort these sums to find the k smallest sums\.

#### Steps:

1.  Iterate through every element in the first array `nums1`\.
2.  For each element in `nums1`, iterate through every element in the second array `nums2`\.
3.  Create all possible pairs and store them with their sums\.
4.  Sort the list of pairs based on the sum\.
5.  Return the first k pairs\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(m \* n \* log\(m \* n\)\), where m and n are the lengths of nums1 and nums2 respectively\. Sorting the pair sums is the most time\-consuming operation\.
*   **Space Complexity:** O\(m \* n\), since we need to store all m \* n possible pairs\.

## 2\. Heap Approach

#### Intuition:

We can improve our solution by using a max heap to maintain the k smallest pairs found so far while iterating through the array\.

#### Steps:

1.  Use a Max\-Heap to keep track of the smallest k sums\.
2.  Iterate through all pairs of the given arrays\.
3.  Maintain only k sums in the heap, and pop the largest if the heap size exceeds k\.
4.  Return the k pairs in the heap\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(m \* n \* log\(k\)\), the log\(k\) comes from maintaining a heap of size k\.
*   **Space Complexity:** O\(k\), since the heap only stores k pairs at any time\.

## 3\. Optimized Heap Approach using Min\-Heap

#### Intuition:

Instead of using a max heap, we can use a min heap \(priority queue\) to efficiently get the next smallest sum\.

#### Steps:

1.  Initiate a Min\-Heap to store potential pairs, starting with the smallest possible pairs \(first elements of `nums1` with first element of `nums2`\)\.
2.  Extract the smallest pair from the heap\.
3.  Push the next possible pairs incrementally from `nums1` and `nums2`\.
4.  Repeat until we find k pairs\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(k \* log\(min\(m, n, k\)\)\), where you might need to retrieve up to k pairs, and each operation in the heap is logarithmic to its size\.
*   **Space Complexity:** O\(min\(m, n, k\)\), due to the space needed for the priority queue storing potential pairs\.