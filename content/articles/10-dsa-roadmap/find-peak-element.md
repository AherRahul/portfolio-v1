---
title: Find Peak Element
description: Master Find Peak Element in the Binary Search module. Comprehensive
  guide and algorithmic problem solving.
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

A peak element is an element that is strictly greater than its neighbors\.

Given a **0\-indexed** integer array `nums`, find a peak element, and return its index\. If the array contains multiple peaks, return the index to **any of the peaks**\.

You may imagine that `nums[-1] = nums[n] = -∞`\. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array\.

You must write an algorithm that runs in `O(log n)` time\.

##### **Example 1:**

**Input:** nums = \[1,2,3,1\]

0

1

1

2

2

3

3

1

**Output:** 2

**Explanation:** 3 is a peak element and your function should return the index number 2\.

##### **Example 2:**

**Input:** nums = \[1,2,1,3,5,6,4\]

0

1

1

2

2

1

3

3

4

5

5

6

6

4

**Output:** 5

**Explanation:** Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6\.

#### **Constraints:**

*   **1 <= nums\.length <= 1000**
*   **\-2****31** **<= nums\[i\] <= 2****31** **\- 1**
*   `nums[i] != nums[i + 1]` for all valid `i`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/find-peak-element)

# Approaches

## 1\. Linear Scan

#### **Intuition:**

The simplest approach to find a peak element is to iterate through the array and look for an element that is greater than its neighbors\. This is a straightforward solution where we check each element to see if it meets the peak condition\.

#### Steps:

*   Iterate through the array\.
*   For each element `nums[i]`, check if it is greater than its neighbors\.
*   Return the index of the first peak element found\.

#### Code:

Java

```java
class Solution {
   public int findPeakElement(int[] nums) {
       for (int i = 0; i < nums.length - 1; i++) {
           // Check if current element is greater than the next one, indicating a peak
           if (nums[i] > nums[i + 1]) {
               return i;
           }
       }
       // If end of loop is reached, last element is also a peak
       return nums.length - 1;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\.
*   **Space Complexity:** O\(1\), since we only use a constant amount of additional space\.

## 2\. Binary Search

#### **Intuition:**

To achieve a more efficient solution, use a modified binary search\. Since we know that a peak exists and elements decrease at the peak \(or reach the end of the array\), we can utilize this fact to efficiently find a peak in logarithmic time\.

#### Steps:

*   Utilize a binary search approach where you check the middle element\.
*   If the middle element is greater than the next element, then a peak must exist on the left side \(including mid\)\.
*   If it is less than the next element, then a peak must exist on the right side\.
*   Narrow the search to the half where the peak is more probable\.

#### Code:

Java

```java
class Solution {
   public int findPeakElement(int[] nums) {
       int left = 0, right = nums.length - 1;
       while (left < right) {
           int mid = left + (right - left) / 2;
           // Compare mid element with the next element
           if (nums[mid] > nums[mid + 1]) {
               // Peak is on the left side including mid
               right = mid;
           } else {
               // Peak is on the right side
               left = mid + 1;
           }
       }
       // left and right will converge to a peak
       return left;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(log n\), due to the binary search approach\.
*   **Space Complexity:** O\(1\), since we only use a constant amount of additional space\.

View Animation