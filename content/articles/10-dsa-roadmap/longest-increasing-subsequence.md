---
title: Longest Increasing Subsequence
description: Master Longest Increasing Subsequence in the Dynamic Programming
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

Given an integer array `nums`, return _the length of the longest_ _**strictly increasing subsequence**_\.

##### **Example 1:**

**Input:** nums = \[10,9,2,5,3,7,101,18\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">101</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">18</span></div>
  </div>
</div>

10

101

18

**Output:** 4

**Explanation:** The longest increasing subsequence is \[2,3,7,101\], therefore the length is 4\.

##### **Example 2:**

**Input:** nums = \[0,1,0,3,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** 4

##### **Example 3:**

**Input:** nums = \[7,7,7,7,7,7,7\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">7</span></div>
  </div>
</div>

**Output:** 1

##### **Constraints:**

*   **1 <= nums\.length <= 2500**
*   **\-10****4** **<= nums\[i\] <= 10****4**

**Follow up:** Can you come up with an algorithm that runs in `O(n log(n))` time complexity?


## Approaches

### 1\. Dynamic Programming

#### **Intuition:**

The idea is to use a dynamic programming table to keep track of the length of the longest increasing subsequence that ends with the element at each position in the array\. At each element, we consider all previous elements and find the longest subsequence that this element can extend\.

#### **Steps:**

1.  Initialize a `dp` array where `dp[i]` represents the length of the longest increasing subsequence that ends at index `i`\.
2.  Iterate over each element in the array\. For each element, check all previous elements:

*   If the current element is greater than the previous element, then it can extend the subsequence ending at that previous element\.
*   Update `dp[i]` to be the maximum of its current value or `dp[j] + 1` where `j` is an index before `i`\.

4.  The answer is the maximum value in the `dp` array\.

#### **Code:**

```java
class Solution {
   public int lengthOfLIS(int[] nums) {
       if (nums == null || nums.length == 0) return 0;

       // dp[i] means the length of LIS ending with nums[i]
       int[] dp = new int[nums.length];
       Arrays.fill(dp, 1); // Each element is a subsequence of length 1
       
       int maxLength = 1; // At least one element in the array

       for (int i = 0; i < nums.length; i++) {
           for (int j = 0; j < i; j++) {
               // If nums[i] can extend the sequence ending with nums[j]
               if (nums[i] > nums[j]) {
                   dp[i] = Math.max(dp[i], dp[j] + 1);
               }
           }
           // Update max result as we go
           maxLength = Math.max(maxLength, dp[i]);
       }
       return maxLength;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where n is the length of the array\. We examine each pair of indices once\.
*   **Space Complexity:** O\(n\), used for the dp array\.

### 2\. Dynamic Programming with Binary Search

#### **Intuition:**

Instead of maintaining an array to find the longest increasing subsequence with a direct comparison which results in O\(n^2\) complexity, we can use a clever trick involving binary search\. The approach is to maintain an array that keeps the "minimal" possible tail for all increasing subsequences of various lengths\. This makes the time complexity significantly better\.

#### **Steps:**

1.  Create an array `tails` where `tails[i]` represents the smallest tail value of all increasing subsequences of length `i+1`\.
2.  For each number in the input array:

*   Use binary search \(or manual iteration\) to find the location it can replace in the `tails` array\.
*   Update the `tails` array: if the number is larger than the largest element in `tails`, append it\.

4.  The length of `tails` will be the length of the longest increasing subsequence\.

#### **Code:**

```java
class Solution {
   public int lengthOfLIS(int[] nums) {
       if (nums == null || nums.length == 0) return 0;

       int[] tails = new int[nums.length];
       int size = 0;

       for (int num : nums) {
           int left = 0, right = size;
           // Binary search for the location to replace in tails
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (tails[mid] < num) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           // Update tails or append to tails
           tails[left] = num;
           if (left == size) size++;
       }

       return size;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\), due to binary searching within tails for each of the n elements\.
*   **Space Complexity:** O\(n\), used for the tails array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/longest-increasing-subsequence)
