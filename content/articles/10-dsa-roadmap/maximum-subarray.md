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

## Problem Description

Given an integer array `nums`, find the **subarray** with the **largest sum**, and return its sum\.

#### Example 1:

**Input: nums = \[-2, 1, -3, 4, -1, 2, 1, -5, 4\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">-5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">4</span></div>
  </div>
</div>

**Output: 6** &nbsp;&nbsp;— subarray \[4, -1, 2, 1\] \(indices 3–6\) has the largest sum = 6\.

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
  </div>
</div>

#### Example 2:

**Input: nums = \[1\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output: 1**

#### Example 3:

**Input: nums = \[5, 4, -1, 7, 8\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">8</span></div>
  </div>
</div>

**Output: 23** &nbsp;&nbsp;— the entire array sums to 23\.

#### Constraints:

*   **1 <= nums\.length <= 10^5**
*   **\-10^4 <= nums\[i\] <= 10^4**

**Follow up:** If you have figured out the `O(n)` solution, try coding another solution using the **divide and conquer** approach, which is more subtle\.

## Approaches

### 1\. Brute Force

The brute force approach involves checking every possible subarray and computing the sum of each one\. This method is straightforward but inefficient for larger arrays due to its high time complexity\.

#### Intuition:

Check every possible subarray, compute its sum, and track the maximum\. Simple but O\(n²\)\.

*   Iterate through each element as the subarray start\.
*   For each start, explore all possible end points\.
*   Track the maximum sum encountered\.

#### Code:

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

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- We have a nested loop where for each element, we compute sums up to the end of the array\.
*   **Space Complexity:** O\(1\) \- We only use a constant amount of extra space for variables\.

### 2\. Kadane's Algorithm

Kadane's Algorithm provides an efficient way of finding the maximum subarray sum in linear time\.

#### Intuition:

Kadane's Algorithm finds the maximum subarray sum in **O\(n\) time**\.

The key insight: if your running sum becomes negative, there's no point extending it — start fresh from the current element instead\.

*   **currentSum**: running sum of the current subarray\.
*   **maxSum**: best sum seen so far\.

At each element: `currentSum = max(nums[i], currentSum + nums[i])`

If `currentSum + nums[i]` is less than `nums[i]` alone, it's better to discard the previous subarray and start fresh\.

#### Walkthrough: \[-2, 1, -3, 4, -1, 2, 1, -5, 4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="i">↓</span><span class="arr-idx">0</span><span class="arr-val">-2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
  <p class="arr-step-label">i=0 → current=-2, max=-2. Negative start.</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-ptr" data-label="i">↓</span><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
  <p class="arr-step-label">i=1 → max(-2+1, 1)=1. Fresh start. current=1, max=1.</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-ptr" data-label="i">↓</span><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
  <p class="arr-step-label">i=3..6 → [4,-1,2,1] builds up current=6, max=6 ← winner!</p>
</div>


#### Code:

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

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- We traverse the array once, updating the running sum and maximum\.
*   **Space Complexity:** O\(1\) \- We use a constant amount of extra space for variables \(`currentSum` and `maxSum`\)\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-subarray)
