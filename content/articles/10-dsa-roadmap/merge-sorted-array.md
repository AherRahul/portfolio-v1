---
title: Merge Sort
description: Master Merge Sort in the Sorting module. Comprehensive guide and
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

You are given two integer arrays `nums1` and `nums2`, sorted in **non\-decreasing order**, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively\.

**Merge** `nums1` and `nums2` into a single array sorted in **non\-decreasing order**\.

The final sorted array should not be returned by the function, but instead be _stored inside the array_ `nums1`\. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored\. `nums2` has a length of `n`\. 

#### Example 1:

**Input: nums1 = \[1, 2, 3, 0, 0, 0\], m = 3 &nbsp;&nbsp;nums2 = \[2, 5, 6\], n = 3**

  <p class="arr-caption">nums1 &nbsp;(m = 3, extra capacity = 3)</p>

  <p class="arr-caption">nums2 &nbsp;(n = 3)</p>

**Output: \[1, 2, 2, 3, 5, 6\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
  </div>
</div>

  <p class="arr-caption">nums1 after merge</p>

#### Example 2:

**Input: nums1 = \[1\], m = 1, nums2 = \[\], n = 0**

  <p class="arr-caption">nums1</p>

**Output: \[1\]** — nothing to merge\.

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

#### Example 3:

**Input: nums1 = \[0\], m = 0, nums2 = \[1\], n = 1**

  <p class="arr-caption">nums1 &nbsp;(m = 0, placeholder only)</p>

  <p class="arr-caption">nums2</p>

**Output: \[1\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

  <p class="arr-caption">nums1 after merge</p>

#### Constraints:

*   **nums1\.length == m \+ n**
*   **nums2\.length == n**
*   **0 <= m, n <= 200**
*   **1 <= m \+ n <= 200**
*   **\-10^9 <= nums1\[i\], nums2\[j\] <= 10^9**

**Follow up:** Can you come up with an algorithm that runs in `O(m + n)` time?

## Approaches

### 1\. Merge Then Sort

#### Intuition:

The simplest approach to solve the problem is to first merge the elements of `nums2` into `nums1` and then sort `nums1`\. Although it is not the most efficient solution, it works for small inputs and provides an easy starting point\.

#### Steps:

1.  Copy all elements from `nums2` into `nums1` starting from index `m`\.
2.  Sort the array `nums1`\.

#### Code:

```java
class Solution {
   public void merge(int[] nums1, int m, int[] nums2, int n) {
       // Copy nums2 to nums1 from index m to m+n
       for (int i = 0; i < n; i++) {
           nums1[m + i] = nums2[i];
       }
       // Sort nums1
       Arrays.sort(nums1);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(\(m\+n\)log\(m\+n\)\), due to sorting\.
*   **Space Complexity:** O\(1\), as we are modifying nums1 in place\.

### 2\. Two-Pointer

#### Intuition:

Both arrays `nums1` and `nums2` are sorted, thus we can use a two\-pointer technique to merge them efficiently\. Create a new array to store the merged sorted elements\.

#### Steps:

1.  Initialize three pointers: `p1` for `nums1`, `p2` for `nums2`, and `p` for the new array\.
2.  Compare elements at `p1` and `p2`, placing the smaller one in `sorted`\.
3.  Append any remaining elements\.
4.  Copy `sorted` back into `nums1`\.

#### Code:

```java
class Solution {
   public void merge(int[] nums1, int m, int[] nums2, int n) {
       // New array to store merged result
       int[] sorted = new int[m + n];
       // Pointers for nums1, nums2, and sorted array
       int p1 = 0, p2 = 0, p = 0;

       // Compare and merge
       while (p1 < m && p2 < n) {
           if (nums1[p1] <= nums2[p2]) {
               sorted[p++] = nums1[p1++];
           } else {
               sorted[p++] = nums2[p2++];
           }
       }

       // Append remaining elements
       while (p1 < m) {
           sorted[p++] = nums1[p1++];
       }
       while (p2 < n) {
           sorted[p++] = nums2[p2++];
       }
       
       // Copy sorted array back to nums1
       System.arraycopy(sorted, 0, nums1, 0, m + n);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \+ n\), as we iterate through both arrays once\.
*   **Space Complexity:** O\(m \+ n\), due to the extra array\.

### 3\. In-place Two-Pointer \(Optimal\)

#### Intuition:

Since `nums1` has extra capacity after index `m`, we can fill it **backwards**: start from the end and write the largest element there\. This avoids overwriting values we still need\.

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="p1">↓</span><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-ptr" data-label="p">↓</span><span class="arr-idx">5</span><span class="arr-val">0</span></div>
  </div>
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="p2">↓</span><span class="arr-idx">2</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">Initial — p1 at m-1, p2 at n-1, p at end</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="p1">↓</span><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--ptr"><span class="arr-ptr" data-label="p">↓</span><span class="arr-idx">4</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">Step 1 — 6 > 3, place 6 at p=5</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">Step 2 — 5 > 3, place 5 at p=4. Result: [_, _, 3, _, 5, 6]</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">Done — [1, 2, 2, 3, 5, 6]</p>
</div>


#### Steps:

1.  Use `p1 = m - 1`, `p2 = n - 1`, `p = m + n - 1`\.
2.  Compare `nums1[p1]` and `nums2[p2]`; place the larger at `nums1[p]`, then decrement that pointer and `p`\.
3.  If any remain in `nums2`, copy them \(`nums1` elements are already in place\)\.

#### Code:

```java
class Solution {
   public void merge(int[] nums1, int m, int[] nums2, int n) {
       // Pointers for nums1, nums2 and the end of merged array
       int p1 = m - 1, p2 = n - 1, p = m + n - 1;

       // Merge arrays starting from the end
       while (p1 >= 0 && p2 >= 0) {
           if (nums1[p1] > nums2[p2]) {
               nums1[p] = nums1[p1];
               p1--;
           } else {
               nums1[p] = nums2[p2];
               p2--;
           }
           p--;
       }

       // If there are any remaining elements in nums2, move them to nums1
       while (p2 >= 0) {
           nums1[p--] = nums2[p2--];
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \+ n\), as we process each element exactly once\.
*   **Space Complexity:** O\(1\), since we are merging in-place without extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/merge-sorted-array)
