---
title: Move Zeroes
description: Master Move Zeroes in the Arrays module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

> #### Question: Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non\-zero elements\.
> 
> **Note** that you must do this in\-place without making a copy of the array\.

#### Example 1:

**Input: nums = \[ 0, 1, 0, 3, 12 \]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">12</span></div>
  </div>
</div>

**Output: \[1, 3, 12, 0, 0 \]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
  </div>
</div>

#### Example 2:

**Input:nums=\[0\]**    

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
  </div>
</div>

**Output: \[0\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
  </div>
</div>

#### Constraints:

*   **1 <= nums\.length <= 10^4**
*   **\-2^31 <= nums\[i\] <= 2^31 \- 1**

**Follow up:** Could you minimize the total number of operations done?

## Understanding the Problem

At first glance, this problem seems trivial: just find the zeros and move them to the end\. But there are several constraints that make it interesting:

1.  **In\-place requirement:** We cannot create a new array and copy elements over\. We must modify the original array\.
2.  **Maintain relative order:** The non\-zero elements must appear in the same order they originally had\. We cannot just swap zeros with non\-zeros from the end, as that would disrupt the order\.
3.  **Minimize operations \(follow\-up\):** The optimal solution should avoid unnecessary writes to the array\.

Let's visualize what we need to achieve:

```plaintext
Before: [0, 1, 0, 3, 12]
        ↓  ↓  ↓  ↓   ↓
After:  [1, 3, 12, 0, 0]
```

The non\-zero elements `[1, 3, 12]` maintain their relative order\. The zeros have been pushed to the end\.

A key observation is that we need to "shift" all non\-zero elements to the front of the array\. Once all non\-zeros are in their correct positions at the front, whatever remains at the back will naturally be zeros\.

## Approaches

### 1\. Brute Force with Extra Space

#### **Intuition**

The most intuitive approach is to create a temporary array, copy all non\-zero elements first, then fill the remaining positions with zeros\. While this violates the in\-place constraint, it helps us understand the core logic before optimizing\.

#### **Algorithm**

1.  Create a temporary array of the same size
2.  Iterate through the original array and copy all non\-zero elements to the temp array
3.  Fill the remaining positions in temp array with zeros
4.  Copy the temp array back to the original array

#### **Code**

```java
class Solution {
   public void moveZeroes(int[] nums) {
       int n = nums.length;
       int[] result = new int[n];
       int j = 0;

       // First pass: accumulate non-zero elements
       for (int i = 0; i < n; i++) {
           if (nums[i] != 0) {
               result[j] = nums[i];
               j++;
           }
       }

       // Second pass: fill remaining positions with zeroes
       for (; j < n; j++) {
           result[j] = 0;
       }

       // Copy back to original array
       System.arraycopy(result, 0, nums, 0, n);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the array\.
*   **Space Complexity:** O\(n\), due to the use of additional array\.

#### **Example Walkthrough:**

**Input:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">12</span></div>
  </div>
  <p class="arr-caption">nums</p>
</div>


After the first pass \(collect non\-zeroes into `result`\):

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-caption">result</p>
</div>


The second pass fills the remaining positions with zero \(they may already be zero, but that's fine\):

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-caption">result</p>
</div>


Finally, we copy `result` back into `nums`:

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-caption">nums</p>
</div>


This approach works correctly but uses extra space\. Let's improve it\.

### 2\. Two\-Pass In\-Place Solution

#### Intuition

We can achieve an in\-place solution by breaking the problem into two phases:

1.  **First pass:** Move all non\-zero elements to the front, keeping track of where to place the next non\-zero element\.
2.  **Second pass:** Fill all remaining positions with zeros\.

Think of it like compacting a file system: first, move all the "used" blocks to the front, then mark the rest as "free" \(zeros\)\.

#### Algorithm

1.  Initialize a pointer `writePos` at 0 to track where the next non\-zero element should go
2.  Iterate through the array:

*   When we find a non\-zero element, place it at `writePos` and increment `writePos`

4.  After the first pass, `writePos` tells us where the zeros should start
5.  Fill all positions from `writePos` to the end with zeros

#### Code:

```java
class Solution {
   public void moveZeroes(int[] nums) {
       int writePos = 0; // next position for a non-zero

       // Pass 1: compact non-zeros to the front (stable)
       for (int i = 0; i < nums.length; i++) {
           if (nums[i] != 0) {
               nums[writePos++] = nums[i];
           }
       }

       // Pass 2: fill the remainder with zeros
       while (writePos < nums.length) {
           nums[writePos++] = 0;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the array\.
*   **Space Complexity:** O\(1\), since we are modifying the array in place without using additional storage\.

#### Example Walkthrough:

**Input:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">12</span></div>
  </div>
  <p class="arr-caption">nums</p>
</div>


**After first pass:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">12</span></div>
  </div>
  <p class="arr-caption">nums</p>
</div>


**After second pass:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-caption">nums</p>
</div>


### 3\. Optimal Two\-Pointer with Swapping

#### Intuition

We can fine\-tune our previous two\-pointer approach by swapping in place\.

Maintain two indices:

*   **writePos** points to the next position where a non\-zero should live\.
*   **readPos** scans the array left to right\.

Whenever `nums[readPos]` is non\-zero, swap it with `nums[writePos]` \(only if `readPos != writePos`\) and advance `writePos`\. This compacts non\-zeros in a **single pass** and leaves zeros behind naturally\.

#### Code

```java
class Solution {
   public void moveZeroes(int[] nums) {
       int writePos = 0; // next slot for a non-zero
       for (int readPos = 0; readPos < nums.length; readPos++) {
           if (nums[readPos] != 0) {
               if (readPos != writePos) {
                   int tmp = nums[readPos];
                   nums[readPos] = nums[writePos];
                   nums[writePos] = tmp;
               }
               writePos++;
           }
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), as the array is traversed once\.
*   **Space Complexity:** O\(1\), no additional data structures are used\.

### [Solve it on LeetCode](https://leetcode.com/problems/move-zeroes/)
