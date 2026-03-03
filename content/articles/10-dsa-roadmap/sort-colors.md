---
title: Sort Colors
description: Master Sort Colors in the Sorting module. Comprehensive guide and
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

Given an array `nums` with `n` objects colored red, white, or blue, sort them [**in\-place**](https://en.wikipedia.org/wiki/In-place_algorithm) so that objects of the same color are adjacent, with the colors in the order red, white, and blue\.

We will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively\.

You must solve this problem without using the library's sort function\.

#### Example 1:

**Input: nums = \[2, 0, 2, 1, 1, 0\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">0</span></div>
  </div>
</div>

**Output: \[0, 0, 1, 1, 2, 2\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
</div>

  <p class="arr-caption">🔴 red = 0 (zinc) &nbsp; ⬜ white = 1 (red) &nbsp; 🔵 blue = 2 (blue)</p>

#### Example 2:

**Input: nums = \[2, 0, 1\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output: \[0, 1, 2\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
  </div>
</div>

#### Constraints:

*   `n == nums.length`
*   `1 <= n <= 300`
*   `nums[i]` is either `0`, `1`, or `2`\.

**Follow up:** Could you come up with a one-pass algorithm using only constant extra space?

## Approaches

### 1\. Counting Sort

#### Intuition:

The problem can be solved by first counting the number of occurrences of each color \(0s, 1s, and 2s\)\. This information can be used to overwrite the original array by placing the colors consecutively as per the number of occurrences\. Although this is not done in one\-pass, it is straightforward and efficient\.

#### Steps:

1.  Count the number of `0s`, `1s`, and `2s` in the array\.
2.  Overwrite the array with the correct number of each color\.

#### Code:

```java
class Solution {
   public void sortColors(int[] nums) {
       int count0 = 0, count1 = 0, count2 = 0;
       // Count the number of 0s, 1s, and 2s
       for (int num : nums) {
           if (num == 0) count0++;
           else if (num == 1) count1++;
           else count2++;
       }

       // Overwrite the nums array with appropriate number of 0s, 1s, and 2s
       int index = 0;
       while (count0-- > 0) nums[index++] = 0;
       while (count1-- > 0) nums[index++] = 1;
       while (count2-- > 0) nums[index++] = 2;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\. We iterate over the array twice \(once to count and once to overwrite\), so it's linear\.
*   **Space Complexity:** O\(1\), since we are only using a fixed amount of extra space \(three counters and an index\)\.

### 2\. One-pass Dutch National Flag \(Three Pointers\)

#### Intuition:

The classic **Dutch National Flag** algorithm by Dijkstra\. Maintain three pointers:

*   `low` — boundary between 0s and 1s
*   `mid` — current element being processed
*   `high` — boundary between 1s and 2s

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L,M">↓</span><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="H">↓</span><span class="arr-idx">5</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-step-label">Initial state — low=0, mid=0, high=5</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="L,M">↓</span><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--ptr"><span class="arr-ptr" data-label="H">↓</span><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Step 1 — nums[mid]=2 → swap with high, high--. mid stays.</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--ptr"><span class="arr-ptr" data-label="L,M">↓</span><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--ptr"><span class="arr-ptr" data-label="H">↓</span><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Step 2 — nums[mid]=0 → swap with low. low++, mid++.</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Done — [0, 0, 1, 1, 2, 2]</p>
</div>


#### Steps:

1.  Initialize `low = 0`, `mid = 0`, `high = n - 1`\.
2.  While `mid <= high`:
    *   `nums[mid] == 0` → swap with `nums[low]`, increment both `low` and `mid`\.
    *   `nums[mid] == 1` → increment `mid` only\.
    *   `nums[mid] == 2` → swap with `nums[high]`, decrement `high` \(don't increment `mid`\)\.

#### Code:

```java
class Solution {
   public void sortColors(int[] nums) {
       int low = 0, mid = 0, high = nums.length - 1;
       // Process all elements in the array
       while (mid <= high) {
           if (nums[mid] == 0) {
               // Swap nums[low] and nums[mid], increment low and mid
               int temp = nums[low];
               nums[low] = nums[mid];
               nums[mid] = temp;
               low++;
               mid++;
           } else if (nums[mid] == 1) {
               // Just increment mid, no need to swap
               mid++;
           } else {
               // Swap nums[mid] and nums[high], decrement high
               int temp = nums[mid];
               nums[mid] = nums[high];
               nums[high] = temp;
               high--;
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of elements in the array\. We perform a single linear scan of the array\.
*   **Space Complexity:** O\(1\), as we are using only constant extra space for the pointers\.

#### [Solve it on LeetCode](https://leetcode.com/problems/sort-colors)
