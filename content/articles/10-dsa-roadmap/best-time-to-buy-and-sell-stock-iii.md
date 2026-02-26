---
title: Best Time to Buy and Sell Stock III
description: Master Best Time to Buy and Sell Stock III in the Dynamic
  Programming module. Comprehensive guide and algorithmic problem solving.
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

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i``th` day\.

Find the maximum profit you can achieve\. You may complete **at most two transactions**\.

**Note:** You may not engage in multiple transactions simultaneously \(i\.e\., you must sell the stock before you buy again\)\.

##### **Example 1:**

**Input:** prices = \[3,3,5,0,0,3,1,4\]

**Output:** 6

**Explanation:** Buy on day 4 \(price = 0\) and sell on day 6 \(price = 3\), profit = 3\-0 = 3\.

Then buy on day 7 \(price = 1\) and sell on day 8 \(price = 4\), profit = 4\-1 = 3\.

##### **Example 2:**

**Input:** prices = \[1,2,3,4,5\]

**Output:** 4

**Explanation:** Buy on day 1 \(price = 1\) and sell on day 5 \(price = 5\), profit = 5\-1 = 4\.

Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time\. You must sell before buying again\.

##### **Example 3:**

**Input:** prices = \[7,6,4,3,1\]

**Output:** 0

**Explanation:** In this case, no transaction is done, i\.e\. max profit = 0\.

##### **Constraints:**

*   **1 <= prices\.length <= 10****5**
*   **0 <= prices\[i\] <= 10****5**

#### [Solve it on LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii)

# Approaches

## 1\. Brute Force

The brute force approach would involve checking every possible combination of two transactions \(buy\-sell pairs\) to find the maximum profit\. However, this approach is highly inefficient since it would require iterating over all possible pairs of transactions\.

#### Complexity Analysis:

*   **Time Complexity:** O\(N^4\), where N is the number of days\. This is because the approach involves checking each pair of days for both transactions, resulting in a nested iteration\.
*   **Space Complexity:** O\(1\), no extra space is used aside from a few variables\.

### 2\. Dynamic Programming with State Machine

#### Intuition:

*   We need an optimal way to calculate profits with at most two transactions\.
*   We define states based on whether we have completed transactions or holding stocks\.

#### State Definitions:

*   `0`: before any transaction,
*   `1`: holding stock after the first buy,
*   `2`: completed the first sell,
*   `3`: holding stock after the second buy,
*   `4`: completed the second sell\.

Each day, we determine the best action based on states defined above\.

#### Code:

Java

```java
class Solution {
   public int maxProfit(int[] prices) {
       if (prices == null || prices.length < 2) return 0;
       
       int n = prices.length;
       int[][] dp = new int[n][5];
       
       // Initial state assignment
       dp[0][0] = 0;                // No action
       dp[0][1] = -prices[0];       // Buy first stock
       dp[0][2] = 0;                // After first sell
       dp[0][3] = -prices[0];       // Buy second stock
       dp[0][4] = 0;                // After second sell

       for (int i = 1; i < n; i++) {
           dp[i][0] = dp[i-1][0];
           dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] - prices[i]);
           dp[i][2] = Math.max(dp[i-1][2], dp[i-1][1] + prices[i]);
           dp[i][3] = Math.max(dp[i-1][3], dp[i-1][2] - prices[i]);
           dp[i][4] = Math.max(dp[i-1][4], dp[i-1][3] + prices[i]);
       }
       
       // The answer will be in state 4, with highest profit after second sell
       return dp[n-1][4];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), iterating over prices array once\.
*   **Space Complexity:** O\(N\), space used by dp array to store intermediate results\.

## 3\. Optimized Dynamic Programming

#### Intuition:

*   We can reduce the space complexity by using only two variables for each state since each state depends only on the previous day\.

#### Code:

Java

```java
class Solution {
   public int maxProfit(int[] prices) {
       if (prices == null || prices.length < 2) return 0;

       int hold1 = Integer.MIN_VALUE;
       int hold2 = Integer.MIN_VALUE;
       int release1 = 0;
       int release2 = 0;

       for (int price: prices) {
           release2 = Math.max(release2, hold2 + price); // Max profit after second sell
           hold2 = Math.max(hold2, release1 - price);    // Max profit after second buy
           release1 = Math.max(release1, hold1 + price); // Max profit after first sell
           hold1 = Math.max(hold1, -price);              // Max profit after first buy
       }

       return release2; // Max profit after completing at most two transactions
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), single iteration through the prices array\.
*   **Space Complexity:** O\(1\), space used is constant as we only store state for the previous day\.