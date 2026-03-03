---
title: Trapping Rain Water
description: Master Trapping Rain Water in the Two Pointers module.
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

Given `n` non\-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining\.

##### **Example 1:**

Input:height=\[0,1,0,2,1,0,1,3,2,1,2,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">9</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">10</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">11</span><span class="arr-val">1</span></div>
  </div>
</div>

Output:6

##### **Example 2:**

Input:height=\[4,2,0,3,2,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">5</span></div>
  </div>
</div>

**Output: 9**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-val">9</span></div>
  </div>
</div>


##### **Constraints:**

*   **n == height\.length**
*   **1 <= n <= 2 \* 10****4**
*   **0 <= height\[i\] <= 10****5**


## Approaches

### 1\. Brute Force

The brute force approach involves iterating over each element in the height array and for each element, calculating the maximum water that can be trapped above it by determining the highest bars to its left and right\. This is done in three loops: one for the current index, and two for finding the left and right max bars\.

#### Intuition:

*   For each bar, calculate the maximum height of the bars to the left and right\.
*   The water level on top of the current bar is the minimum of these two heights minus the height of the current bar\.
*   Sum this for each bar\.

#### Code:

```java
class Solution {
   public int trapBruteForce(int[] height) {
       int n = height.length;
       int trappedWater = 0;
       for (int i = 0; i < n; i++) {
           int leftMax = 0, rightMax = 0;
           
           // Find the maximum height to the left of the current element
           for (int j = 0; j <= i; j++) {
               leftMax = Math.max(leftMax, height[j]);
           }
           
           // Find the maximum height to the right of the current element
           for (int j = i; j < n; j++) {
               rightMax = Math.max(rightMax, height[j]);
           }
           
           // Calculate trapped water over current element
           trappedWater += Math.min(leftMax, rightMax) - height[i];
       }
       return trappedWater;
   }   
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) because of the nested loops for calculating left and right max heights for each element\.
*   **Space Complexity:** O\(1\) since we are using constant extra space\.

### 2\. Dynamic Programming

The dynamic programming approach involves precomputing the maximum height to the left and right of each element using separate arrays\. This eliminates the need for nested loops, as in the brute force approach\.

#### Intuition:

*   Use two arrays, `leftMax` and `rightMax`\.
*   `leftMax[i]` stores the maximum height from the start to index `i`\.
*   `rightMax[i]` stores the maximum height from index `i` to the end\.
*   Calculate the trapped water for each element as before, but use precomputed arrays\.

#### Code:

```java
class Solution {
   public int trapDynamicProgramming(int[] height) {
       int n = height.length;
       if (n == 0) return 0;
       
       int[] leftMax = new int[n];
       int[] rightMax = new int[n];
       int trappedWater = 0;
       
       // Fill leftMax array
       leftMax[0] = height[0];
       for (int i = 1; i < n; i++) {
           leftMax[i] = Math.max(leftMax[i - 1], height[i]);
       }
       
       // Fill rightMax array
       rightMax[n - 1] = height[n - 1];
       for (int i = n - 2; i >= 0; i--) {
           rightMax[i] = Math.max(rightMax[i + 1], height[i]);
       }
       
       // Calculate trapped water
       for (int i = 0; i < n; i++) {
           trappedWater += Math.min(leftMax[i], rightMax[i]) - height[i];
       }
       
       return trappedWater;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) because we are making three separate passes over the array\.
*   **Space Complexity:** O\(n\) due to the additional `leftMax` and `rightMax` arrays used\.

### 3\. Two Pointers

The two\-pointers technique improves upon the dynamic programming solution by using two pointers that traverse the height array from both ends\. It uses variables to store current left and right max heights, allowing us to calculate the trapped water more efficiently without additional space\.

#### Intuition:

*   Initialize two pointers, `left` at the start and `right` at the end of the array\.
*   Maintain two variables `leftMax` and `rightMax` for the maximum heights encountered from the left and right, respectively\.
*   Move the pointers towards each other, updating trapped water based on which of `leftMax` and `rightMax` is smaller\.

#### Code:

```java
class Solution {
   public int trapTwoPointers(int[] height) {
       int n = height.length;
       if (n == 0) return 0;
       
       int left = 0, right = n - 1;
       int leftMax = 0, rightMax = 0;
       int trappedWater = 0;
       
       while (left < right) {
           // Move the pointer with the smaller height
           if (height[left] < height[right]) {
               // If left is smaller, check against leftMax
               if (height[left] > leftMax) {
                   leftMax = height[left];
               } else {
                   trappedWater += leftMax - height[left];
               }
               left++;
           } else {
               // If right is smaller, check against rightMax
               if (height[right] > rightMax) {
                   rightMax = height[right];
               } else {
                   trappedWater += rightMax - height[right];
               }
               right--;
           }
       }
       
       return trappedWater;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) as we traverse the height array only once with the two pointers\.
*   **Space Complexity:** O\(1\) because we use only constant extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/trapping-rain-water)
