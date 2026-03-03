---
title: Find in Mountain Array
description: Master Find in Mountain Array in the Binary Search module.
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

You may recall that an array `arr` is a **mountain array** if and only if:

*   `arr.length >= 3`
*   There exists some `i` with `0 < i < arr.length - 1` such that:

*   `arr[0] < arr[1] < ... < arr[i - 1] < arr[i]`
*   `arr[i] > arr[i + 1] > ... > arr[arr.length - 1]`

Given a mountain array `mountainArr`, return the **minimum** `index` such that `mountainArr.get(index) == target`\. If such an `index` does not exist, return `-1`\.

**You cannot access the mountain array directly\.** You may only access the array using a `MountainArray` interface:

*   `MountainArray.get(k)` returns the element of the array at index `k` \(0\-indexed\)\.
*   `MountainArray.length()` returns the length of the array\.

Submissions making more than `100` calls to `MountainArray.get` will be judged _Wrong Answer_\. Also, any solutions that attempt to circumvent the judge will result in disqualification\. 

##### **Example 1:**

**Input:** mountainArr = \[1,2,3,4,5,3,1\], target = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** 2

**Explanation:** 3 exists in the array, at index=2 and index=5\. Return the minimum index, which is 2\.

##### **Example 2:**

**Input:** mountainArr = \[0,1,2,4,2,1\], target = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \-1

**Explanation:** 3 does not exist in `the array,` so we return \-1\.

##### **Constraints:**

*   **3 <= mountainArr\.length\(\) <= 10****4**
*   **0 <= target <= 10****9**
*   **0 <= mountainArr\.get\(index\) <= 10****9**


## Approaches

### 1\. Brute Force Linear Search

#### Intuition:

In a mountain array, there exists a peak element after which elements start decreasing\. For a brute force approach, one can simply iterate over the entire array to find the target\. This involves two phases:

1.  Traverse from the start to the peak \(increasing sequence\)\.
2.  Traverse from the peak to the end \(decreasing sequence\)\.

#### Steps:

1.  Iterate through the array from the start to the peak to look for the target\.
2.  If not found, iterate from the peak to the end\.

#### Code:

```java
class Solution {
   public int findInMountainArray(int target, MountainArray mountainArr) {
       int n = mountainArr.length();
       
       // Linear search on increasing part
       int peak = 0;
       for (int i = 0; i < n; i++) {
           if (mountainArr.get(i) > mountainArr.get(peak)) {
               peak = i;
           }
           if (mountainArr.get(i) == target) {
               return i;
           }
       }
       
       // Linear search on decreasing part.
       for (int i = n - 1; i > peak; i--) {
           if (mountainArr.get(i) == target) {
               return i;
           }
       }
       
       // If the target is not found
       return -1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), as we may have to look at each element in the worst case twice\.
*   **Space Complexity:** O\(1\) \- No additional space used apart from variables\.

### 2\. Optimized Binary Search

#### Intuition:

Utilizing the properties of the mountain array, we can apply binary search methods to efficiently find the peak and then search for the target in both increasing and decreasing sequences separately\.

#### Steps:

1.  Use a binary search to find the peak of the mountain array\.
2.  Perform a binary search on the increasing sequence from the start to the peak to find the target\.
3.  If the target is not found, perform a binary search on the decreasing sequence from the peak to the end\.

#### Code:

```java
class Solution {
   public int findInMountainArray(int target, MountainArray mountainArr) {
       int n = mountainArr.length();
       
       // Step 1: Find the peak index using binary search
       int left = 0, right = n - 1;
       while (left < right) {
           int mid = left + (right - left) / 2;
           if (mountainArr.get(mid) < mountainArr.get(mid + 1)) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       int peak = left;
       
       // Step 2: Binary search for target in the increasing part
       int index = binarySearch(mountainArr, target, 0, peak, true);
       if (index != -1) {
           return index;
       }
       
       // Step 3: Binary search for target in the decreasing part
       return binarySearch(mountainArr, target, peak + 1, n - 1, false);
   }
   
   private int binarySearch(MountainArray arr, int target, int left, int right, boolean isAsc) {
       while (left <= right) {
           int mid = left + (right - left) / 2;
           int midVal = arr.get(mid);
           if (midVal == target) {
               return mid;
           }
           if (isAsc) {
               if (midVal < target) {
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           } else {
               if (midVal > target) {
                   left = mid + 1;
               } else {
                   right = mid - 1;
               }
           }
       }
       return -1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(log n\), The binary search is applied three times \(once to find peak and twice to find target\)\.
*   **Space Complexity:** O\(1\) \- No additional space used apart from variables\.

#### [Solve it on LeetCode](https://leetcode.com/problems/find-in-mountain-array)
