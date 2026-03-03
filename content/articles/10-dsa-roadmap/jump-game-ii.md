---
title: Jump Game II
description: Master Jump Game II in the Greedy module. Comprehensive guide and
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

You are given a **0\-indexed** array of integers `nums` of length `n`\. You are initially positioned at index 0\.

Each element `nums[i]` represents the maximum length of a forward jump from index `i`\. In other words, if you are at index `i`, you can jump to any index `(i + j)` where:

*   `0 <= j <= nums[i]` and
*   `i + j < n`

Return _the minimum number of jumps to reach index_ `n - 1`\. The test cases are generated such that you can reach index `n - 1`\.

##### **Example 1:**

**Input:** nums = \[2,3,1,1,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">4</span></div>
  </div>
</div>

**Output:** 2

**Explanation:** The minimum number of jumps to reach the last index is 2\. Jump 1 step from index 0 to 1, then 3 steps to the last index\.

##### **Example 2:**

**Input:** nums = \[2,3,0,1,4\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">4</span></div>
  </div>
</div>

**Output:** 2

##### **Constraints:**

*   **1 <= nums\.length <= 10****4**
*   `0 <= nums[i] <= 1000`
*   It's guaranteed that you can reach `nums[n - 1]`\.


## Approaches

### 1\. Greedy Approach

#### **Intuition:**

The first solution is a simple greedy approach\. The idea is to make the best move we can at each index\. We traverse the array and at each step, we jump to the farthest position possible within the range of our current jump\. By making the best move at each step \(jumping the farthest possible\), we ensure that we reach the end in the minimum number of jumps\.

#### **Approach:**

*   Start from the first position of the array and attempt to reach the last position with the minimum number of jumps\.
*   Use variables:

*   `jumps` to count the number of jumps\.
*   `curEnd` to track the farthest index that can be reached with the current number of jumps\.
*   `curFarthest` to track the farthest index that we could reach with an additional jump within the range of `curEnd`\.

*   Whenever we move beyond `curEnd`, it means we need to make a jump, so update `jumps` and `curEnd`\.

#### Code:

```java
class Solution {
   public int jump(int[] nums) {
       // Number of jumps needed to reach the end
       int jumps = 0;
       // Farthest index that can be reached with current number of jumps
       int curEnd = 0;
       // Farthest index that can be reached with an additional jump
       int curFarthest = 0;
       for (int i = 0; i < nums.length - 1; i++) {
           // Update the farthest we can reach
           curFarthest = Math.max(curFarthest, i + nums[i]);
           // If we have reached the end of what we could jump with current `jumps`
           if (i == curEnd) {
               // Increment number of jumps
               jumps++;
               // Update the `curEnd` to the `farthest` we can reach with current number of jumps
               curEnd = curFarthest;
           }
       }
       return jumps;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), since we are making a single pass through the array\.
*   **Space Complexity:** O\(1\), as no extra space is used\.

### 2\. Optimized Greedy Approach

#### **Intuition:**

In the optimized version of the greedy approach, we maintain only necessary variables to track the farthest reachable point and leverage this to calculate the minimum jumps on the go\. By focusing on optimizing jump increments logically with conditions, this approach refines the previous solution for simplicity without affecting time complexity\.

#### **Approach:**

*   Similar to the first approach but is less explicitly managed with retained focus on optimal point reachability only\.

#### **Code:**

```java
class Solution {
   public int jump(int[] nums) {
       if (nums.length < 2) return 0;  // No jump needed if there's only one element.

       int jumps = 0, maxReach = 0, currentEnd = 0;

       for (int i = 0; i < nums.length - 1; i++) {
           // Always try to update the farthest we can reach
           maxReach = Math.max(maxReach, i + nums[i]);

           // If we have come to the end of our possible reach with current number of jumps
           if (i == currentEnd) {
               jumps++;  // We need an additional jump
               currentEnd = maxReach;  // Update current end to max reach
           }

           // Break if the maxReach exceeds or reaches the last node
           if (currentEnd >= nums.length - 1) {
               return jumps;
           }
       }
       
       return jumps;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), iterating through the array once as before\.
*   **Space Complexity:** O\(1\), no extra space apart from variables\.

#### [Solve it on LeetCode](https://leetcode.com/problems/jump-game-ii)
