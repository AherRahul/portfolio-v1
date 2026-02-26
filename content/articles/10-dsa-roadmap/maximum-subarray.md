---
title: Maximum Subarray
description: Master Maximum Subarray in the Kadane's Algorithm module.
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

Given an integer array `nums`, find the subarray with the largest sum, and return _its sum_\.

##### **Example 1:**

Input:nums=\[\-2,1,\-3,4,\-1,2,1,\-5,4\]

0

\-2

1

1

2

\-3

3

4

4

\-1

5

2

6

1

7

\-5

8

4

Output:6

6

**Explanation:** The subarray \[4,\-1,2,1\] has the largest sum 6\.

##### **Example 2:**

Input:nums=\[1\]

0

1

Output:1

1

**Explanation:** The subarray \[1\] has the largest sum 1\.

##### **Example 3:**

Input:nums=\[5,4,\-1,7,8\]

0

5

1

4

2

\-1

3

7

4

8

Output:23

23

**Explanation:** The subarray \[5,4,\-1,7,8\] has the largest sum 23\.

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **\-10****4** **<= nums\[i\] <= 10****4**

**Follow up:** If you have figured out the `O(n)` solution, try coding another solution using the **divide and conquer** approach, which is more subtle\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-subarray)

# Approaches

## 1\. Brute Force

The brute force approach involves checking every possible subarray and computing the sum of each one\. This method is straightforward but inefficient for larger arrays due to its high time complexity\.

#### Intuition:

1.  Iterate through each element of the array, treating it as the start of a subarray\.
2.  For each start point, explore all possible end points and compute the sum for each subarray\.
3.  Track the maximum sum encountered\.

#### Code:

Java

```java
class Solution {
   public int maxSubArray(int[] nums) {
       int maxSum = Integer.MIN_VALUE; // Initialize to the smallest integer value
       
       // Iterate over each element treating it as the start of a subarray
       for (int i = 0; i < nums.length; i++) {
           int currentSum = 0;
           // Explore subarrays ending at each subsequent element
           for (int j = i; j < nums.length; j++) {
               currentSum += nums[j]; // Add the current element to the current subarray sum
               if (currentSum > maxSum) {
                   maxSum = currentSum; // Update maxSum if current subarray sum is greater
               }
           }
       }
       return maxSum;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- We have a nested loop where for each element, we compute sums up to the end of the array\.
*   **Space Complexity:** O\(1\) \- We only use a constant amount of extra space for variables\.

## 2\. Kadane's Algorithm

Kadane's Algorithm provides an efficient way of finding the maximum subarray sum in linear time\.

#### Intuition:

1.  Traverse the array, maintaining a running maximum sum of contiguous elements \(`currentSum`\)\.
2.  If `currentSum` drops below zero, reset it to the current element, as a negative `currentSum` would decrease the sum of any subarray including it\.
3.  Track a global maximum \(`maxSum`\) across all encountered `currentSum` values\.

#### Code:

Java

```java
class Solution {
   public int maxSubArray(int[] nums) {
       int currentSum = nums[0]; // Start with the first element
       int maxSum = nums[0];     // Initialize maxSum with the first element

       // Traverse the array from the second element
       for (int i = 1; i < nums.length; i++) {
           // If currentSum is negative, reset to current element
           currentSum = Math.max(nums[i], currentSum + nums[i]);
           // Update maxSum if currentSum is greater
           maxSum = Math.max(maxSum, currentSum);
       }
       return maxSum;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) \- We traverse the array once, updating the running sum and maximum\.
*   **Space Complexity:** O\(1\) \- We use a constant amount of extra space for variables \(`currentSum` and `maxSum`\)\.

View Animation