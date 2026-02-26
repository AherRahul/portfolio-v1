---
title: Number of Zero-Filled Subarrays
description: Master Number of Zero-Filled Subarrays in the Arrays module.
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

Given an integer array `nums`, return _the number of_ _**subarrays**_ _filled with_ `0`\.

A **subarray** is a contiguous non\-empty sequence of elements within an array\.

##### **Example 1:**

Input:nums=\[1,3,0,0,2,0,0,4\]

0

1

1

3

2

0

3

0

4

2

5

0

6

0

7

4

Output:6

6

**Explanation:**

*   There are 4 occurrences of \[0\] as a subarray\.
*   There are 2 occurrences of \[0,0\] as a subarray\.
*   There is no occurrence of a subarray with a size more than 2 filled with 0\. Therefore, we return 6\.

##### **Example 2:**

Input:nums=\[0,0,0,2,0,0\]

0

0

1

0

2

0

3

2

4

0

5

0

Output:9

9

**Explanation:**

*   There are 5 occurrences of \[0\] as a subarray\.
*   There are 3 occurrences of \[0,0\] as a subarray\.
*   There is 1 occurrence of \[0,0,0\] as a subarray\.
*   There is no occurrence of a subarray with a size more than 3 filled with 0\. Therefore, we return 9\.

##### **Example 3:**

Input:nums=\[2,10,2019\]

0

2

1

10

2

2019

Output:0

0

**Explanation:** There is no subarray filled with 0\. Therefore, we return 0\.

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **\-10****9** **<= nums\[i\] <= 10****9**

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-zero-filled-subarrays)

# Approaches

## 1\. Brute Force

#### **Intuition**:

The simplest approach to solve this problem is to consider all possible subarrays and count those filled entirely with zeroes\. While this method is straightforward, it can be inefficient for large arrays due to the sheer number of potential subarrays\.

#### **Steps**:

1.  Iterate over all possible starting points of subarrays\.
2.  For each starting point, extend the subarray endpoint till we are passing zeroes\.
3.  Count the subarrays when a complete run of zeroes is detected\.

#### **Code**:

Java

```java
class Solution {
   public long zeroFilledSubarray(int[] nums) {
       long count = 0;
       int n = nums.length;
       
       // Check each subarray starting at index `i`
       for (int i = 0; i < n; i++) {
           // Track contiguous zeroes starting from index `i`
           for (int j = i; j < n && nums[j] == 0; j++) {
               // Increment count each time a zero-filled subarray is found
               count++;
           }
       }
       
       return count;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- As we check each subarray which takes quadratic time\.
*   **Space Complexity:** O\(1\) \- No additional space is used beyond input size\.

## 2\. Optimized Linear Scan

#### **Intuition**:

We can achieve a more optimal solution by recognizing runs of zeroes as we iterate over the array\. For each segment of contiguous zeroes, the number of zero\-filled subarrays can be calculated using combinatorial arithmetic\.

Specifically, a contiguous run of `k` zeroes contributes `k * (k + 1) / 2` zero\-filled subarrays\.

#### **Steps**:

1.  Initialize a counter for zero segments \(`zeroCount`\) and the total result \(`result`\)\.
2.  Traverse the array\.
3.  For every zero encountered, increase the `zeroCount`\.
4.  If a non\-zero is encountered or the array ends, add the count of zero\-filled subarrays for the segment, i\.e\., `zeroCount * (zeroCount + 1) / 2` to the result, and reset `zeroCount`\.
5.  Return the result\.

#### **Code**:

Java

```java
class Solution {
   public long zeroFilledSubarray(int[] nums) {
       long result = 0;
       int zeroCount = 0;
       
       for (int num : nums) {
           // Check if the current number is zero
           if (num == 0) {
               // Extend the current zero sequence
               zeroCount++;
           } else {
               // Calculate subarrays for the zero sequence
               result += zeroCount * (zeroCount + 1L) / 2;
               // Reset zero sequence counter
               zeroCount = 0;
           }
       }
       
       // If the last element was part of a zero sequence, add its subarrays
       result += zeroCount * (zeroCount + 1L) / 2;
       
       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) \- We pass through the array a single time\.
*   **Space Complexity:** O\(1\) \- Only a constant amount of extra space is used\.

#### Example Walkthrough:

0

0

1

0

2

1

3

0

4

0

5

0

6

2

zeroCount = 0, result = 0

Step 1 / 9

View Animation