---
title: Next Greater Element I
description: Master Next Greater Element I in the Stacks module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

The **next greater element** of some element `x` in an array is the **first greater** element that is **to the right** of `x` in the same array\.

You are given two **distinct 0\-indexed** integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`\.

For each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the **next greater element** of `nums2[j]` in `nums2`\. If there is no next greater element, then the answer for this query is `-1`\.

Return _an array_ `ans` _of length_ `nums1.length` _such that_ `ans[i]` _is the_ _**next greater element**_ _as described above\._ 

##### **Example 1:**

**Input:** nums1 = \[4,1,2\], nums2 = \[1,3,4,2\]

**Output:** \[\-1,3,\-1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">-1</span></div>
  </div>
</div>

**Explanation:** The next greater element for each value of nums1 is as follows:

\- 4 is underlined in nums2 = \[1,3,4,2\]\. There is no next greater element, so the answer is \-1\.

\- 1 is underlined in nums2 = \[1,3,4,2\]\. The next greater element is 3\.

\- 2 is underlined in nums2 = \[1,3,4,2\]\. There is no next greater element, so the answer is \-1\.

##### **Example 2:**

**Input:** nums1 = \[2,4\], nums2 = \[1,2,3,4\]

**Output:** \[3,\-1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">-1</span></div>
  </div>
</div>

**Explanation:** The next greater element for each value of nums1 is as follows:

\- 2 is underlined in nums2 = \[1,2,3,4\]\. The next greater element is 3\.

\- 4 is underlined in nums2 = \[1,2,3,4\]\. There is no next greater element, so the answer is \-1\.

##### **Constraints:**

*   **1 <= nums1\.length <= nums2\.length <= 1000**
*   **0 <= nums1\[i\], nums2\[i\] <= 10****4**
*   All integers in `nums1` and `nums2` are **unique**\.
*   All the integers of `nums1` also appear in `nums2`\.

**Follow up:** Could you find an `O(nums1.length + nums2.length)` solution?


## Approaches

### 1\. Brute Force

The brute force approach is straightforward: For each element in `nums1`, search for its next greater element in `nums2`\.

#### Intuition:

*   For each element in `nums1`, iterate over `nums2` to find the index of that element\.
*   From that index, search for the first element greater than the current element\.
*   If a greater element is found, add it to the result, otherwise, append \-1 \(indicating no greater element found\)\.

#### Code:

```java
class Solution {
   public int[] nextGreaterElement(int[] nums1, int[] nums2) {
       int[] result = new int[nums1.length];
       for (int i = 0; i < nums1.length; i++) {
           // Assume no greater element exists
           result[i] = -1;
           // Find the current element in nums2
           boolean found = false;
           for (int j = 0; j < nums2.length; j++) {
               if (nums2[j] == nums1[i]) {
                   found = true;
               }
               // If the number is found, find the next greater element
               if (found && nums2[j] > nums1[i]) {
                   result[i] = nums2[j];
                   break;
               }
           }
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \* m\), where n is the length of `nums1` and m is the length of `nums2`\. For each element in `nums1`, we do a potentially full scan of `nums2`\.
*   **Space Complexity:** O\(1\), apart from the space used to store the result\.

### 2\. Using a Stack and HashMap

This approach leverages a stack and hashmap to efficiently find the next greater element for all elements in `nums2` in a single pass\.

#### Intuition:

*   Use a stack to track elements for which we are finding the next greater element\.
*   As we iterate `nums2`, for each element, pop elements from the stack if the current element is greater because the current element is the "next greater" for those popped elements\.
*   Map each popped element to the current element in a hashmap\.
*   After processing, for each element in `nums1`, retrieve the next greater element directly from the hashmap\.

#### Code:

```java
class Solution { 
   public int[] nextGreaterElement(int[] nums1, int[] nums2) {
       Map<Integer, Integer> map = new HashMap<>();
       Stack<Integer> stack = new Stack<>();

       // Iterate over nums2
       for (int num : nums2) {
           // While stack is not empty and current num is greater than stack's top element
           while (!stack.isEmpty() && stack.peek() < num) {
               map.put(stack.pop(), num);  // map the last element to the current as its next greater
           }
           stack.push(num); // Push current element
       }
       
       // For the remaining elements in stack, no greater element found, thus they map to -1 by default

       int[] result = new int[nums1.length];
       for (int i = 0; i < nums1.length; i++) {
           result[i] = map.getOrDefault(nums1[i], -1);  // Retrieve next greater element from the map
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \+ m\), iterating nums2 once O\(m\), and checking each nums1 element in O\(1\) using the hashmap\.
*   **Space Complexity:** O\(m\), for storing the hashmap and the stack\.

#### [Solve it on LeetCode](https://leetcode.com/problems/next-greater-element-i)
