---
title: Maximum Gap
description: Master Maximum Gap in the Sorting module. Comprehensive guide and
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

Given an integer array `nums`, return _the maximum difference between two successive elements in its sorted form_\. If the array contains less than two elements, return `0`\.

You must write an algorithm that runs in linear time and uses linear extra space\.

##### **Example 1:**

**Input:** nums = \[3,6,9,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** 3

**Explanation:** The sorted form of the array is \[1,3,6,9\], either \(3,6\) or \(6,9\) has the maximum difference 3\.

##### **Example 2:**

**Input:** nums = \[10\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">10</span></div>
  </div>
</div>

**Output:** 0

**Explanation:** The array contains less than 2 elements, therefore return 0\.

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **0 <= nums\[i\] <= 10****9**


## Approaches

### 1\. Simple Sort and Compare

#### Intuition:

The simplest way to solve this problem is to sort the array and then find the maximum gap between successive elements\. Although this is not the most optimal solution in terms of time complexity, it is straightforward to implement and understand\.

#### Steps:

1.  Sort the given array\.
2.  Initialize a variable `maxGap` to store the maximum difference found\.
3.  Iterate through the sorted array and calculate the difference between successive elements\.
4.  Update `maxGap` if a larger difference is found\.

#### Code:

```java
class MaximumGap {
   public int maximumGap(int[] nums) {
       if (nums.length < 2) return 0;

       // Step 1: Sort the array
       Arrays.sort(nums);

       // Step 2: Initialize maxGap as minimum possible value
       int maxGap = 0;

       // Step 3: Iterate over the array to find the maximum gap
       for (int i = 1; i < nums.length; i++) {
           // Calculate the gap between successive elements
           int gap = nums[i] - nums[i - 1];
           // Update maxGap if the current gap is larger
           maxGap = Math.max(maxGap, gap);
       }

       return maxGap;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log N\) due to sorting the array\.
*   **Space Complexity:** O\(1\) if the sort is done in place\.

### 2\. Bucket Sort

#### Intuition:

To achieve a better time complexity, we can use a bucket sort method\. The core idea is distributing the numbers into buckets such that each bucket holds a range of numbers\. We calculate the maximum possible difference, which ensures that the maximum gap cannot be confined within a single bucket but must be between the maximum of one bucket and the minimum of the next\.

#### Steps:

1.  Find the minimum and maximum elements in the array\.
2.  Calculate the gap size, which is the ceiling value of `(max - min) / (n - 1)`\.
3.  Create buckets that will store only the minimum and maximum values that fall into them\.
4.  Iterate through each number to place it in the right bucket by calculating the appropriate index\.
5.  Finally, iterate through the buckets to calculate the maximum gap between the maximum value of the current non\-empty bucket and the minimum value of the next non\-empty bucket\.

#### Code:

```java
class MaximumGap {
   public int maximumGap(int[] nums) {
       if (nums.length < 2) return 0;
       
       // Find minimum and maximum values in the array
       int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
       for (int num : nums) {
           min = Math.min(min, num);
           max = Math.max(max, num);
       }

       // If all numbers are identical, the maximum gap is zero
       if (min == max) return 0;

       int n = nums.length;
       // Step 2: Calculate the bucket size using the gap
       int bucketSize = Math.max(1, (max - min) / (n - 1));
       int bucketCount = (max - min) / bucketSize + 1;
       
       // Step 3: Create buckets
       int[] bucketMin = new int[bucketCount];
       int[] bucketMax = new int[bucketCount];
       Arrays.fill(bucketMin, Integer.MAX_VALUE);
       Arrays.fill(bucketMax, Integer.MIN_VALUE);
       
       // Step 4: Place numbers in the appropriate buckets
       for (int num : nums) {
           int bucketIndex = (num - min) / bucketSize;
           bucketMin[bucketIndex] = Math.min(bucketMin[bucketIndex], num);
           bucketMax[bucketIndex] = Math.max(bucketMax[bucketIndex], num);
       }

       // Step 5: Calculate the maximum gap
       int maxGap = 0, prevMax = min;
       for (int i = 0; i < bucketCount; i++) {
           // Ignore empty buckets
           if (bucketMin[i] == Integer.MAX_VALUE) continue;
           // Update the maximum gap
           maxGap = Math.max(maxGap, bucketMin[i] - prevMax);
           prevMax = bucketMax[i];
       }

       return maxGap;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\) for both average and worst case due to the linear pass to fill buckets and the linear pass to find the maximum gap\.
*   **Space Complexity:** O\(N\) due to the space used for the buckets\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-gap)
