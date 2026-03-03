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

## Problem Description

You are given an integer array `height` of length `n`\. There are `n` vertical lines drawn such that the two endpoints of the `i``th` line are `(i, 0)` and `(i, height[i])`\.

Find two lines that together with the x\-axis form a container, such that the container contains the most water\.

Return _the maximum amount of water a container can store_\.

**Notice** that you may not slant the container\. 

The area of water between lines at indices `i` and `j` is: `min(height[i], height[j]) × (j - i)`

#### Example 1:

**Input: height = \[1, 8, 6, 2, 5, 4, 8, 3, 7\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">7</span></div>
  </div>
</div>

  <p class="arr-caption">Best pair: indices 1 and 6 (heights 8 and 8). Area = min(8,8) × (6−1) = 7 × 7 = 49</p>

**Output: 49**

#### Example 2:

**Input: height = \[1, 1\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
  </div>
</div>

  <p class="arr-caption">Area = min(1,1) × (1−0) = 1</p>

**Output: 1**

#### Constraints:

*   **n == height\.length**
*   **2 <= n <= 10^5**
*   **0 <= height\[i\] <= 10^4**

## Approaches

### 1\. Brute Force

In the brute force approach, we'll iterate over all possible pairs of lines and calculate the area of water that it can contain\. This involves a nested loop where the outer loop picks the first line and the inner loop tries all possible second lines\. For each pair of lines, we calculate the minimum of these two heights \(as water can only be stored up to the shorter line\) and multiply it by the distance between them \(their indices difference\) to get the area\. We keep track of the maximum area we've found so far\.

#### Intuition:

*   Check all pairs of lines \(i, j\), compute the container area they define\.
*   The area is determined by `H[i]` and `H[j]`, taking the smaller one, and the distance between walls `(j - i)`\.

#### Code:

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

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to the nested loop through the list\.
*   **Space Complexity:** O\(1\) as we're only using a few extra variables\.

### 2\. Two\-Pointer

In this more optimal approach, we use two pointers, one at the beginning and one at the end of the array\. In every step, we calculate the area formed by the lines at these two pointers\. Then, we move the pointer pointing to the shorter line inward because moving the taller one wouldn't possibly increase the area\.

#### Intuition:

Start with `left = 0` and `right = n - 1` \(the widest possible container\)\. At each step:

*   Compute the area\.
*   Move the **shorter** line inward — only by doing so can we possibly find a taller line to increase the area\.
*   Moving the **taller** line inward never helps \(width decreases AND the height is bounded by the shorter line\)\.

#### Walkthrough: \[1, 8, 6, 2, 5, 4, 8, 3, 7\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L">↓</span><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="R">↓</span><span class="arr-idx">8</span><span class="arr-val">7</span></div>
  </div>
  <p class="arr-step-label">Initial — left=0 (h=1), right=8 (h=7). Area = min(1,7)×8 = 8</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-ptr" data-label="L">↓</span><span class="arr-idx">1</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-ptr" data-label="R">↓</span><span class="arr-idx">8</span><span class="arr-val">7</span></div>
  </div>
  <p class="arr-step-label">h[left]=1 < h[right]=7 → move left. left=1 (h=8). Area = min(8,7)×7 = 49 ✓</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">7</span></div>
  </div>
  <p class="arr-step-label">Pointers continue converging... best area = 49 at indices (1,6)</p>
</div>


#### Code:

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

#### Complexity Analysis

*   **Time Complexity:** O\(n\) since we go through the list at most twice in a single pass\.
*   **Space Complexity:** O\(1\) as no additional space is used apart from some variables for storage\.

#### [Solve it on LeetCode](https://leetcode.com/problems/container-with-most-water)
