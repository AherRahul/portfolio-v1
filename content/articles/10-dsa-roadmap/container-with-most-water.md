---
title: Container With Most Water
description: Master Container With Most Water in the Two Pointers module.
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

You are given an integer array `height` of length `n`\. There are `n` vertical lines drawn such that the two endpoints of the `i``th` line are `(i, 0)` and `(i, height[i])`\.

Find two lines that together with the x\-axis form a container, such that the container contains the most water\.

Return _the maximum amount of water a container can store_\.

**Notice** that you may not slant the container\. 

##### **Example 1:**

Input:height=\[1,8,6,2,5,4,8,3,7\]

0

1

1

8

2

6

3

2

4

5

5

4

6

8

7

3

8

7

Output:49

49

##### **Example 2:**

Input:height=\[1,1\]

0

1

1

1

Output:1

1

##### **Constraints:**

*   **n == height\.length**
*   **2 <= n <= 10****5**
*   **0 <= height\[i\] <= 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/container-with-most-water)

# Approaches

## 1\. Brute Force

In the brute force approach, we'll iterate over all possible pairs of lines and calculate the area of water that it can contain\. This involves a nested loop where the outer loop picks the first line and the inner loop tries all possible second lines\. For each pair of lines, we calculate the minimum of these two heights \(as water can only be stored up to the shorter line\) and multiply it by the distance between them \(their indices difference\) to get the area\. We keep track of the maximum area we've found so far\.

#### Intuition:

*   Check all pairs of lines \(i, j\), compute the container area they define\.
*   The area is determined by `H[i]` and `H[j]`, taking the smaller one, and the distance between walls `(j - i)`\.

#### Code:

Java

```java
class Solution {
   public int maxArea(int[] height) {
       int maxArea = 0;
       for (int i = 0; i < height.length; i++) {
           for (int j = i + 1; j < height.length; j++) {
               // Calculate area between lines i and j
               int area = Math.min(height[i], height[j]) * (j - i);
               // Update maxArea if we find a bigger one
               maxArea = Math.max(maxArea, area);
           }
       }
       return maxArea;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to the nested loop through the list\.
*   **Space Complexity:** O\(1\) as we're only using a few extra variables\.

## 2\. Two\-Pointer

In this more optimal approach, we use two pointers, one at the beginning and one at the end of the array\. In every step, we calculate the area formed by the lines at these two pointers\. Then, we move the pointer pointing to the shorter line inward because moving the taller one wouldn't possibly increase the area\.

#### Intuition:

*   Start with the widest container possible\. Move the shorter line inwards step by step\.
*   By closing in the pointers, we seek better maximum areas because even though the width reduces, we might have taller lines\.

#### Code:

Java

```java
class Solution {
   public int maxArea(int[] height) {
       int maxArea = 0;
       int left = 0;
       int right = height.length - 1;
       while (left < right) {
           // Calculate area with current left and right pointer
           int area = Math.min(height[left], height[right]) * (right - left);
           // Update maxArea if current area is larger
           maxArea = Math.max(maxArea, area);

           // Move pointers inward from shorter height
           if (height[left] < height[right]) {
               left++;
           } else {
               right--;
           }
       }
       return maxArea;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) since we go through the list at most twice in a single pass\.
*   **Space Complexity:** O\(1\) as no additional space is used apart from some variables for storage\.

View Animation