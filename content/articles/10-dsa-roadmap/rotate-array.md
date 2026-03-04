---
title: Rotate Array
description: Master Rotate Array in the Arrays module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non\-negative\.

#### Example 1:

**Input: nums = \[1, 2, 3, 4, 5, 6, 7\], k = 3**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">7</span></div>
  </div>
</div>

**Output: \[5, 6, 7, 1, 2, 3, 4\]** &nbsp;(last k=3 elements wrap to front)

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">4</span></div>
  </div>
</div>

**Explanation:**

*   rotate 1: \[7, 1, 2, 3, 4, 5, 6\]
*   rotate 2: \[6, 7, 1, 2, 3, 4, 5\]
*   rotate 3: \[5, 6, 7, 1, 2, 3, 4\] ✓

#### Example 2:

**Input: nums = \[-1, -100, 3, 99\], k = 2**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">-100</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">99</span></div>
  </div>
</div>

**Output: \[3, 99, -1, -100\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">99</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">-100</span></div>
  </div>
</div>

#### Constraints:

*   **1 <= nums\.length <= 10^5**
*   **\-2^31 <= nums\[i\] <= 2^31 \- 1**
*   **0 <= k <= 10^5**

**Follow up:** Try at least **three** different ways\. Can you do it in-place with O\(1\) extra space?

## Approaches

### 1\. Brute Force

#### Intuition:

The brute force approach involves rotating the array elements one step at a time\. For each rotation, we move all the elements to their next position, simulating the rotation `k` times\.

This matches the literal definition of “rotate right by k,” but it’s inefficient because elements are moved many times\.

#### Steps:

Do this **k** times:

*   Save the last element\.
*   Shift every element one step right\.
*   Put the saved element at the front\.

#### Code:

```java
class Solution {
   public void rotate(int[] nums, int k) {
       int n = nums.length;
       // Each rotation moves all elements 1 step to the right
       k = k % n; // Handle cases where k >= n
       for (int i = 0; i < k; i++) {
           // Store the last element
           int previous = nums[n - 1];
           // Shift all elements right
           for (int j = n - 1; j > 0; j--) {
               nums[j] = nums[j - 1];
           }
           // Place the stored element at the first position
           nums[0] = previous;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \* k\) \- Performing `k` rotations, each requiring O\(n\) time\.
*   **Space Complexity:** O\(1\) \- No additional space used apart from input array\.

### 2\. Extra Array

#### Intuition:

By using an additional array, you can directly place each element in its rotated position\. This avoids costly movement within the original array but requires additional space for storing the results\.

#### Steps:

1.  Create a new array to hold rotated elements\.
2.  Calculate and place each element in its final position\.
3.  Copy the result back into the original array\.

#### Code:

```java
class Solution {
   public void rotate(int[] nums, int k) {
       int n = nums.length;
       int[] rotated = new int[n];
       k = k % n; // Handle cases where k >= n
       
       // Place elements in the new positions
       for (int i = 0; i < n; i++) {
           rotated[(i + k) % n] = nums[i];
       }
       
       // Copy the content of rotated array to the original array
       for (int i = 0; i < n; i++) {
           nums[i] = rotated[i];
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- Each element is processed a constant number of times\.
*   **Space Complexity:** O\(n\) \- Additional array to hold rotated order\.

### 3\. Reverse the Array \(Optimal\)

#### Intuition:

Rotating right by `k` is equivalent to three reverse operations:

1.  Reverse the **whole** array\.
2.  Reverse the **first k** elements\.
3.  Reverse the **remaining n-k** elements\.

#### Walkthrough: \[1, 2, 3, 4, 5, 6, 7\], k = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">6</span><span class="arr-val">7</span></div>
  </div>
  <p class="arr-step-label">Original</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
  <p class="arr-step-label">Step 1 — Reverse whole array</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
  <p class="arr-step-label">Step 2 — Reverse first k=3 elements</p>
</div>


<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">4</span></div>
  </div>
  <p class="arr-step-label">Step 3 — Reverse remaining n-k=4 elements → Done</p>
</div>


#### Code:

```java
class Solution {
   public void rotate(int[] nums, int k) {
       int n = nums.length;
       k = k % n;
       reverse(nums, 0, n - 1);
       reverse(nums, 0, k - 1);
       reverse(nums, k, n - 1);
   }

   private void reverse(int[] nums, int start, int end) {
       while (start < end) {
           int temp = nums[start];
           nums[start] = nums[end];
           nums[end] = temp;
           start++;
           end--;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) — three reverse passes, each O\(n\)\.
*   **Space Complexity:** O\(1\) — in-place, no extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/rotate-array)
