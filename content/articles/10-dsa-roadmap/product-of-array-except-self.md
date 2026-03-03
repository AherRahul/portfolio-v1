---
title: Product of Array Except Self
description: Master Product of Array Except Self in the Prefix Sum module.
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

Given an integer array `nums`, return _an array_ `answer` _such that_ `answer[i]` _is equal to the product of all the elements of_ `nums` _except_ `nums[i]`\.

The product of any prefix or suffix of `nums` is **guaranteed** to fit in a **32\-bit** integer\.

You must write an algorithm that runs in `O(n)` time and without using the division operation\.

##### **Example 1:**

Input:nums=\[1,2,3,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
  </div>
</div>

Output:\[24,12,8,6\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">24</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
  </div>
</div>

##### **Example 2:**

Input:nums=\[\-1,1,0,\-3,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">-3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">3</span></div>
  </div>
</div>

Output:\[0,0,9,0,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
  </div>
</div>

**Constraints:**

*   **2 <= nums\.length <= 10****5**
*   **\-30 <= nums\[i\] <= 30**
*   The input is generated such that `answer[i]` is **guaranteed** to fit in a **32\-bit** integer\.

**Follow up:** Can you solve the problem in `O(1)` extra space complexity? \(The output array **does not** count as extra space for space complexity analysis\.\)


## Approaches

### 1\. Brute Force

#### Intuition:

The brute force approach is to calculate the product of all elements in the array except the one at the current index\. We can achieve this by iterating over each element and using an inner loop to calculate the product of all elements except the current one\.

#### Steps:

1.  Initialize an output array of length `n` with all elements set to 1\.
2.  For each element in the input array, iterate over the input array again to calculate the product of all elements except the current one\.
3.  Assign this product to the corresponding index in the output array\.

#### Code:

```java
class Solution {
   public int[] productExceptSelf(int[] nums) {
       int n = nums.length;
       int[] output = new int[n];

       for (int i = 0; i < n; i++) {
           output[i] = 1;  // Initialize each element as 1 for multiplication
           for (int j = 0; j < n; j++) {
               if (i != j) {
                   output[i] *= nums[j];
               }
           }
       }

       return output;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) because for each element, we loop through the array again\.
*   **Space Complexity:** O\(1\) except for the output array, which does not count as extra space by convention\.

### 2\. Prefix and Suffix Products

#### Intuition:

To improve efficiency, we can use two auxiliary arrays to store the product of all elements to the left and to the right of each index\. This way, we can construct the result array by multiplying the prefix and suffix products\.

#### Steps:

1.  Create two arrays `prefix` and `suffix`, both of size `n`\.
2.  Fill the `prefix` array such that `prefix[i]` holds the product of all elements to the left of `i`\.
3.  Fill the `suffix` array such that `suffix[i]` holds the product of all elements to the right of `i`\.
4.  For the result array, multiply the corresponding values of `prefix` and `suffix`\.

#### Code:

```java
class Solution {
   public int[] productExceptSelf(int[] nums) {
       int n = nums.length;
       int[] output = new int[n];
       int[] prefix = new int[n];
       int[] suffix = new int[n];

       prefix[0] = 1;
       for (int i = 1; i < n; i++) {
           prefix[i] = prefix[i - 1] * nums[i - 1];
       }

       suffix[n - 1] = 1;
       for (int i = n - 2; i >= 0; i--) {
           suffix[i] = suffix[i + 1] * nums[i + 1];
       }

       for (int i = 0; i < n; i++) {
           output[i] = prefix[i] * suffix[i];
       }

       return output;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) because we are traversing the input array three times\.
*   **Space Complexity:** O\(n\) for the prefix and suffix arrays\.

### 3\. Single Pass

#### Intuition:

To optimize our space usage, we can eliminate the suffix array and calculate the right product on the fly while filling up the result array\. Compute **left products** into the output first, then sweep from right to left while maintaining a single variable **right** that accumulates the **product of elements to the right** of the current index\.

*   The answer at index `i` is `(product of elements left of i) × (product of elements right of i)`\.
*   We can precompute the left part in one forward pass\.
*   We don’t need a whole suffix array: a single running multiplier `right` can supply the right part during a backward pass\.

#### Steps:

1.  Initialize the result array by computing the prefix \(left\) products as in approach 2\.
2.  Use a single variable `right` to iterate from the end of the array, updating the result by multiplying with `right`\.
3.  Update `right` in each iteration as you progress from right to left\.

#### Code:

```java
class Solution {
   public int[] productExceptSelf(int[] nums) {
       int n = nums.length;
       int[] output = new int[n];

       // Initialize the output array with left products
       output[0] = 1;
       for (int i = 1; i < n; i++) {
           output[i] = output[i - 1] * nums[i - 1];
       }

       // Calculate and multiply the right products
       int right = 1;
       for (int i = n - 1; i >= 0; i--) {
           output[i] *= right;
           right *= nums[i];
       }

       return output;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) because it involves two passes over the array\.
*   **Space Complexity:** O\(1\) extra space apart from the output array\.

#### Example Walkthrough:

**Input:** `nums = [1, 2, 3, 4]`

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
  </div>
  <p class="arr-caption">nums</p>
</div>

**Pass 1:** Build left products (stored in `output`)

`output[i] = output[i - 1] * nums[i - 1]`

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">1</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-step-label">output[0] = 1</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-step-label">output[1] = 1 * nums[0] = 1 * 1 = 1</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
  </div>
  <p class="arr-step-label">output[2] = 1 * nums[1] = 1 * 2 = 2</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">output[3] = 2 * nums[2] = 2 * 3 = 6</p>
</div>

**Pass 2:** Sweep from right, multiply by running right product

`output[i] *= right`, `right *= nums[i]`

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">Initial: right = 1</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">output[3] = 6 * 1 = 6, right = 1 * 4 = 4</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">output[2] = 2 * 4 = 8, right = 4 * 3 = 12</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">output[1] = 1 * 12 = 12, right = 12 * 2 = 24</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">24</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">12</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">8</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">6</span></div>
  </div>
  <p class="arr-step-label">output[0] = 1 * 24 = 24, right = 24 * 1 = 24</p>
</div>

#### [Solve it on LeetCode](https://leetcode.com/problems/product-of-array-except-self)
