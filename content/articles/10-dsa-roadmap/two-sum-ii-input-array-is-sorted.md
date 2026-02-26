---
title: Two Sum II - Input Array Is Sorted
description: Master Two Sum II - Input Array Is Sorted in the Two Pointers
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

Given a **1\-indexed** array of integers `numbers` that is already _**sorted in non\-decreasing order**_, find two numbers such that they add up to a specific `target` number\. Let these two numbers be **numbers\[index****1****\]** and **numbers\[index****2****\]** where **1 <= index****1** **< index****2** **<= numbers\.length**\.

Return _the indices of the two numbers,_ **index****1** _and_ **index****2**_,_ _**added by one**_ _as an integer array_ **\[index****1****, index****2****\]** _of length 2\._

The tests are generated such that there is **exactly one solution**\. You **may not** use the same element twice\.

Your solution must use only constant extra space\.

##### **Example 1:**

**Input:** numbers = \[2,7,11,15\], target = 9

2

7

11

15

**Output:** \[1,2\]

**Explanation:** The sum of 2 and 7 is 9\. Therefore, index1 = 1, index2 = 2\. We return \[1, 2\]\.

##### **Example 2:**

**Input:** numbers = \[2,3,4\], target = 6

2

3

4

**Output:** \[1,3\]

**Explanation:** The sum of 2 and 4 is 6\. Therefore index1 = 1, index2 = 3\. We return \[1, 3\]\.

##### **Example 3:**

**Input:** numbers = \[\-1,0\], target = \-1

\-1

0

**Output:** \[1,2\]

**Explanation:** The sum of \-1 and 0 is \-1\. Therefore index1 = 1, index2 = 2\. We return \[1, 2\]\. 

##### **Constraints:**

*   **2 <= numbers\.length <= 3 \* 10****4**
*   **\-1000 <= numbers\[i\] <= 1000**
*   `numbers` is sorted in **non\-decreasing order**\.
*   **\-1000 <= target <= 1000**
*   The tests are generated such that there is **exactly one solution**\.

#### [Solve it on LeetCode](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)

# Approaches

## 1\. Brute Force

#### Intuition:

The simplest way to solve this problem is by checking every possible pair in the array to see if it adds up to the target\. Since the array is sorted, once the sum exceeds the target, we can stop checking further elements with the current element\.

#### Code:

Java

```java
class Solution {
   public int[] twoSumBruteForce(int[] numbers, int target) {
       // Iterate over each element in the array
       for (int i = 0; i < numbers.length; i++) {
           // For the current 'i', iterate over every element greater than 'i'
           for (int j = i + 1; j < numbers.length; j++) {
               // If the pair adds up to the target, return their indices (1-indexed)
               if (numbers[i] + numbers[j] == target) {
                   return new int[]{i + 1, j + 1};
               }
               // Since the array is sorted, no need to further check if sum exceeds target
               if (numbers[i] + numbers[j] > target) {
                   break;
               }
           }
       }
       // Return an empty array if no solution is found, although the problem guarantees a solution
       return new int[]{};
   }
}
```

Complexity Analysis

*   **Time Complexity:**  O\(n^2\) \- We are checking every possible pair\.
*   **Space Complexity:** O\(1\) \- No additional space is used\.

## 2\. Two Pointers

#### Intuition:

Since the array is sorted, we can use a two\-pointer technique\. Start with one pointer at the beginning and the other at the end of the array\. Check the sum of the values at these pointers:

*   If the sum equals the target, return the 1\-indexed positions\.
*   If the sum is less than the target, move the left pointer to the right to increase the sum\.
*   If the sum is more than the target, move the right pointer to the left to decrease the sum\.

#### Code:

Java

```java
class Solution {
   public int[] twoSumTwoPointer(int[] numbers, int target) {
       int left = 0;
       int right = numbers.length - 1;

       while (left < right) {
           int sum = numbers[left] + numbers[right];
           // Check if the current sum equals the target
           if (sum == target) {
               return new int[]{left + 1, right + 1}; // Return 1-indexed positions
           }
           // Move the left pointer right to increase sum
           else if (sum < target) {
               left++;
           }
           // Move the right pointer left to decrease sum
           else {
               right--;
           }
       }
       // It is guaranteed that there will always be one solution, so this line will not be reached
       return new int[]{};
   }
}
```

Complexity Analysis

*   **Time Complexity:**  O\(n\) \- Each element is visited at most once by either of the pointers\.
*   **Space Complexity:** O\(1\) \- No additional space is used\.

View Animation