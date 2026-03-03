---
title: House Robber II
description: Master House Robber II in the Dynamic Programming module.
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

You are a professional robber planning to rob houses along a street\. Each house has a certain amount of money stashed\. All houses at this place are **arranged in a circle\.** That means the first house is the neighbor of the last one\. Meanwhile, adjacent houses have a security system connected, and **it will automatically contact the police if two adjacent houses were broken into on the same night**\.

Given an integer array `nums` representing the amount of money of each house, return _the maximum amount of money you can rob tonight_ _**without alerting the police**_\.

##### **Example 1:**

**Input:** nums = \[2,3,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
  </div>
</div>

**Output:** 3

**Explanation:** You cannot rob house 1 \(money = 2\) and then rob house 3 \(money = 2\), because they are adjacent houses\.

##### **Example 2:**

**Input:** nums = \[1,2,3,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** 4

**Explanation:** Rob house 1 \(money = 1\) and then rob house 3 \(money = 3\)\.

Total amount you can rob = 1 \+ 3 = 4\.

##### **Example 3:**

**Input:** nums = \[1,2,3\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** 3

##### **Constraints:**

*   `1 <= nums.length <= 100`
*   `0 <= nums[i] <= 1000`


## Approaches

### 1\. Recursive Solution with Memoization

#### Intuition:

In this problem, houses are arranged in a circle\. This means the first house is a neighbor of the last house\. To avoid robbing adjacent houses, the problem can be broken down into two subproblems:

1.  Rob houses from index `0` to `n-2` \(excluding the last house\)\.
2.  Rob houses from index `1` to `n-1` \(excluding the first house\)\.

Use a helper function to recursively calculate the maximum money that can be robbed, while using memoization to avoid redundant calculations\.

#### Code:

```java
class Solution {
   public int rob(int[] nums) {
       if (nums.length == 1) return nums[0];
       return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
   }

   private int robRange(int[] nums, int start, int end) {
       int n = end - start + 1;
       int[] memo = new int[n];
       return robHelper(nums, start, end, memo);
   }

   private int robHelper(int[] nums, int start, int end, int[] memo) {
       if (start > end) return 0;
       if (memo[start] != 0) return memo[start];
       // Rob this house or skip to next one
       int rob = nums[start] + robHelper(nums, start + 2, end, memo);
       int skip = robHelper(nums, start + 1, end, memo);
       // Store the max value calculated
       memo[start] = Math.max(rob, skip);
       return memo[start];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the array because each house is calculated once\.
*   **Space Complexity:** O\(n\), due to the space used for the memoization array\.

### 2\. Dynamic Programming with Optimized Space

#### Intuition:

This approach uses the same two subproblems as the previous method\. However, we optimize the space complexity by storing only the last two results \(as we only need these to calculate the current house's decision\)\.

#### Code:

```java
class Solution {
   public int rob(int[] nums) {
       if (nums.length == 1) return nums[0];
       return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
   }

   private int robRange(int[] nums, int start, int end) {
       int prev1 = 0; // Store the result of i-1
       int prev2 = 0; // Store the result of i-2
       for (int i = start; i <= end; i++) {
           int temp = Math.max(prev1, prev2 + nums[i]);
           // Move previous results one step forward
           prev2 = prev1;
           prev1 = temp;
       }
       return prev1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), linear traversal of array\.
*   **Space Complexity:** O\(1\), space usage is constant due to only using fixed variables for calculations\.

#### [Solve it on LeetCode](https://leetcode.com/problems/house-robber-ii)
