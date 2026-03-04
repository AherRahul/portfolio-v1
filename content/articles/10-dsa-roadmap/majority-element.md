---
title: Majority Element
description: Master Majority Element in the Arrays module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an array `nums` of size `n`, return _the majority element_\.

The majority element is the element that appears more than `⌊n / 2⌋` times\. You may assume that the majority element always exists in the array\.

#### Example 1:

**Input: nums = \[3, 2, 3\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output: 3** &nbsp;(appears 2 out of 3 times \> ⌊3/2⌋ = 1)

#### Example 2:

**Input: nums = \[2, 2, 1, 1, 1, 2, 2\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
</div>

**Output: 2** &nbsp;(appears 4 out of 7 times \> ⌊7/2⌋ = 3)

#### Constraints:

*   **n == nums\.length**
*   **1 <= n <= 5 \* 10^4**
*   **\-10^9 <= nums\[i\] <= 10^9**

**Follow-up:** Could you solve the problem in linear time and in `O(1)` space?

## Understanding the Problem

Before diving into solutions, let us make sure we understand what a "majority element" really means\.

An element is the majority if it appears **more than** `n/2` times\. This is a strict inequality\. For an array of size 5, a majority element must appear at least 3 times\. For an array of size 6, it must appear at least 4 times\.

This definition has a powerful implication: **there can be at most one majority element\.** Think about it\. If one element appears more than half the time, there simply are not enough positions left in the array for any other element to also appear more than half the time\.

The problem guarantees that a majority element always exists\. In a real interview, you might want to clarify this assumption\. Without it, you would need to verify that your candidate actually appears more than `n/2` times before returning it\.

Another key observation: since the majority element appears more than half the time, if you pair up each occurrence of the majority element with a non\-majority element, you would still have majority elements left over\. This insight becomes crucial when we discuss the Boyer\-Moore algorithm\.

## Approaches

### 1\. Brute Force

##### Intuition:

The brute\-force method checks each element in the array and counts how many times it appears\. If any element occurs more than `n/2` times \(where `n` is the length of the array\), that element is the majority element\.

This approach is simple to understand but inefficient because it performs a full scan for every element\.

#### Code:

```java
class Solution {
   public int majorityElement(int[] nums) {
       int n = nums.length;
       for (int i = 0; i < n; i++) {
           int count = 0;
           // Count occurrences of nums[i]
           for (int j = 0; j < n; j++) {
               if (nums[j] == nums[i]) {
                   count++;
               }
           }
           // If count exceed n/2, nums[i] is the majority element
           if (count > n / 2) {
               return nums[i];
           }
       }
       return -1; // Should never be reached if majority element assumption holds
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) because for each element, we are iterating through the list to count occurrences\.
*   **Space Complexity:** O\(1\) because no extra space is used aside from variables\.

### 2\. HashMap

#### Intuition:

We can optimize the brute force approach by using a HashMap to store the frequency of each element\.

Traverse the array, and increment the counter for each element encountered\. The element with a frequency greater than `n/2` will be the majority element\.

#### Code:

```java
class Solution {
   public int majorityElement(int[] nums) {
       HashMap<Integer, Integer> countMap = new HashMap<>();
       int n = nums.length;
       for (int num : nums) {
           countMap.put(num, countMap.getOrDefault(num, 0) + 1);
           // If an element's count exceeds n/2, return it
           if (countMap.get(num) > n / 2) {
               return num;
           }
       }
       return -1; // Shouldn't reach here if input is valid
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) because we iterate over the array once\.
*   **Space Complexity:** O\(n\) because we might store all elements in the map in the worst case\.

### 3\. Sorting

#### Intuition:

If we sort the array, the majority element must occupy the full middle region\. The element at index `n/2` is always the answer\.

**Input:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
</div>

**After sorting:**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row pb-8">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-ptr" data-label="Middle">Middle</span><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
</div>


`nums[3] = 2` → **majority element is 2** ✓

#### Code:

```java
class Solution {
   public int majorityElement(int[] nums) {
       Arrays.sort(nums);
       return nums[nums.length / 2];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\) due to sorting\.
*   **Space Complexity:** O\(1\)\.

### 4\. Boyer-Moore Voting Algorithm

#### Intuition:

The Boyer-Moore Voting Algorithm is the optimal solution: O\(n\) time, O\(1\) space\.

It maintains:

*   **candidate**: current guess for the majority
*   **count**: confidence in the candidate

As you scan:

*   If `count == 0`, adopt the current element as the new `candidate`\.
*   If current == `candidate`, increment `count`; otherwise decrement it\.

**Why it works:** Think *cancellation*\. Every non-candidate element cancels one candidate occurrence\. Since the majority element appears more than half the time, it cannot be fully cancelled — it always survives\.

#### Walkthrough: \[2, 2, 1, 1, 1, 2, 2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="num">↓</span><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Step 1 — num=2, count=0 → adopt 2 as candidate. count=1</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-ptr" data-label="num">↓</span><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Steps 2-4 — 2 matches → count=2; 1 mismatch → count=1; 1 mismatch → count=0</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Step 5 — count=0, adopt 1 as candidate. count=1</p>
</div>

<div class="arr-viz-wrapper">
  <div class="arr-viz-row pb-8">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-ptr" data-label="num">num</span><span class="arr-idx">6</span><span class="arr-val">2</span></div>
  </div>
  <p class="arr-step-label">Steps 6-7 — 2 mismatches → count=0; → re-adopt 2, count=1. Final candidate = 2 ✓</p>
</div>


#### Code:

```java
class Solution {
   public int majorityElement(int[] nums) {
       int candidate = nums[0];
       int count = 0;

       for (int num : nums) {
           if (count == 0) {
               candidate = num;
           }
           count += (num == candidate) ? 1 : -1;
       }
       return candidate;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) — single pass\.
*   **Space Complexity:** O\(1\) — only a few variables used\.

#### [Solve it on LeetCode](https://leetcode.com/problems/majority-element/)
