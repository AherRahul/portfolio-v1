---
title: House Robber
description: Master House Robber in the Dynamic Programming module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Problem Description

Question

You are a professional robber planning to rob houses along a street\. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**\.

Given an integer array `nums` representing the amount of money of each house, return _the maximum amount of money you can rob tonight_ _**without alerting the police**_\.

##### **Example 1:**

**Input:** nums = \[1,2,3,1\]

**Output:** 4

**Explanation:** Rob house 1 \(money = 1\) and then rob house 3 \(money = 3\)\.

Total amount you can rob = 1 \+ 3 = 4\.

##### **Example 2:**

**Input:** nums = \[2,7,9,3,1\]

**Output:** 12

**Explanation:** Rob house 1 \(money = 2\), rob house 3 \(money = 9\) and rob house 5 \(money = 1\)\.

Total amount you can rob = 2 \+ 9 \+ 1 = 12\.

##### **Constraints:**

*   `1 <= nums.length <= 100`
*   `0 <= nums[i] <= 400`

#### [Solve it on LeetCode](https://leetcode.com/problems/house-robber)

# Approaches

## 1\. Recursive Approach

The problem of robbing houses can be thought of as making a choice at each house: either you rob it or you skip it\. The base problem is that you cannot rob two consecutive houses\.

We can define a recursive function `robFrom(int i)` which returns the maximum amount of money that can be robbed starting from house `i`\. The decision at each house will be:

1.  Rob the current house `i` and skip the next house `i+1`\.
2.  Do not rob the current house `i` and try to rob from house `i+1`\.

This will be a naive solution with exponential time complexity, but it establishes the foundation of the problem\.

#### Code:

Java

```java
class Solution {
   public int rob(int[] nums) {
       return robFrom(0, nums);
   }
   
   // Recursive function to decide the maximum sum of money
   private int robFrom(int i, int[] nums) {
       // Base case: no more houses to examine
       if (i >= nums.length) return 0;
       
       // Recursive cases
       // Rob current house and move to house after the next
       int rob = nums[i] + robFrom(i + 2, nums);
       // Skip current house and move to the next house
       int skip = robFrom(i + 1, nums);
       
       // Return the maximum of both choices
       return Math.max(rob, skip);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(2^n\) — In the worst case, where `n` is the number of houses\.
*   **Space Complexity:** O\(n\) — The depth of the recursion tree can go up to `n`\.

## 2\. Memoization \(Top\-Down DP\)

To optimize the recursive approach, we can use memoization to store the results of the subproblems that we've already solved, preventing re\-calculation and reducing the time complexity from exponential to linear\.

#### Code:

Java

```java
class Solution {
   public int rob(int[] nums) {
       int[] memo = new int[nums.length];
       Arrays.fill(memo, -1);
       return robFrom(0, nums, memo);
   }
   
   // Recursive function with memoization
   private int robFrom(int i, int[] nums, int[] memo) {
       // Base condition
       if (i >= nums.length) return 0;
       
       // Return the stored value if the subproblem is already calculated
       if (memo[i] != -1) return memo[i];
       
       // Recursive cases with memoization
       int rob = nums[i] + robFrom(i + 2, nums, memo);
       int skip = robFrom(i + 1, nums, memo);
       
       // Store the result before returning
       memo[i] = Math.max(rob, skip);
       
       return memo[i];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) — Each house is visited at most once\.
*   **Space Complexity:** O\(n\) — Due to recursion and memo array\.

## 3\. Bottom\-Up Dynamic Programming

We can reformulate the problem iteratively using a bottom\-up dynamic programming approach\. We'll systematically determine the best choice at each house leading up to the final decision\.

#### Code:

Java

```java
class Solution {
   public int rob(int[] nums) {
       // Edge case: no houses
       if (nums.length == 0) return 0;
       
       int[] dp = new int[nums.length + 1];
       // Base case initialization
       dp[0] = 0;
       dp[1] = nums[0];
       
       for (int i = 1; i < nums.length; i++) {
           // Choose to rob the current house or skip it
           dp[i + 1] = Math.max(dp[i], dp[i - 1] + nums[i]);
       }
       
       return dp[nums.length];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) — Only one pass through the list is needed\.
*   **Space Complexity:** O\(n\) — For the DP array\.

View Animation

## 4\. Optimized Space Dynamic Programming

We can further optimize the space complexity by realizing that at any point, we only need the last two states to make our decision\.

#### Code:

Java

```java
class Solution {
   public int rob(int[] nums) {
       // Edge case: no houses
       if (nums.length == 0) return 0;
       
       int prev1 = 0; // dp[i-1]
       int prev2 = 0; // dp[i-2]
       
       for (int num : nums) {
           int temp = prev1;
           // Max of skipping the current house or robbing it 12            prev1 = Math.max(prev1, prev2 + num);
           prev2 = temp;
       }
       
       return prev1;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) — Once through the list\.
*   **Space Complexity:** O\(1\) — Constant space usage\.