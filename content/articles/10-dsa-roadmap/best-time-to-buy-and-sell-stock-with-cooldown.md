---
title: Best Time to Buy and Sell Stock with Cooldown
description: Master Best Time to Buy and Sell Stock with Cooldown in the Dynamic
  Programming module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i``th` day\.

Find the maximum profit you can achieve\. You may complete as many transactions as you like \(i\.e\., buy one and sell one share of the stock multiple times\) with the following restrictions:

*   After you sell your stock, you cannot buy stock on the next day \(i\.e\., cooldown one day\)\.

**Note:** You may not engage in multiple transactions simultaneously \(i\.e\., you must sell the stock before you buy again\)\.

##### **Example 1:**

**Input:** prices = \[1,2,3,0,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
  </div>
</div>

**Output:** 3

**Explanation:** transactions = \[buy, sell, cooldown, buy, sell\]

##### **Example 2:**

**Input:** prices = \[1\]**Output:** 0

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Constraints:**

*   `1 <= prices.length <= 5000`
*   `0 <= prices[i] <= 1000`


## Approaches

### 1\. Recursive Brute Force

#### Intuition:

*   The idea here is to simulate each possible action \(buy, sell, cooldown\) at each day and keep track of the maximum profit\.
*   For each day, we can either:

1.  Not make any transaction \(cooldown\)\.
2.  Buy a stock \(if currently not holding one\)\.
3.  Sell a stock \(only if currently holding a stock\)\.

*   We solve this using recursion by exploring each decision for each day and computing the maximum profit\.

#### Code:

```java
class Solution {
   public int maxProfit(int[] prices) {
       return maxProfitRecursive(prices, 0, false);
   }
   
   private int maxProfitRecursive(int[] prices, int index, boolean holding) {
       // Base case - no more days to trade
       if (index >= prices.length) return 0;
       
       // Cooldown (do nothing)
       int cooldown = maxProfitRecursive(prices, index + 1, holding);
       
       if (holding) {
           // If holding, we can sell
           int sell = prices[index] + maxProfitRecursive(prices, index + 2, false);
           return Math.max(cooldown, sell);
       } else {
           // If not holding, we can buy
           int buy = -prices[index] + maxProfitRecursive(prices, index + 1, true);
           return Math.max(cooldown, buy);
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(2^n\), where n is the number of days\. We branch into two recursive calls for each day\.
*   **Space Complexity:** O\(n\), the stack space used for recursion\.

### 2\. Memoization

#### Intuition:

*   The recursive solution computes the same subproblems multiple times, which increases time complexity\.
*   We can store the results of subproblems in a 2D array to avoid recalculating them, turning our approach into a dynamic programming solution\.

#### Code:

```java
class Solution {
   public int maxProfit(int[] prices) {
       int[][] memo = new int[prices.length][2];
       for (int i = 0; i < memo.length; i++) {
           Arrays.fill(memo[i], -1);
       }
       return maxProfitMemo(prices, 0, 0, memo);
   }

   private int maxProfitMemo(int[] prices, int index, int holding, int[][] memo) {
       if (index >= prices.length) return 0;
       if (memo[index][holding] != -1) return memo[index][holding];
       
       int cooldown = maxProfitMemo(prices, index + 1, holding, memo);

       if (holding == 1) {
           int sell = prices[index] + maxProfitMemo(prices, index + 2, 0, memo);
           memo[index][holding] = Math.max(cooldown, sell);
       } else {
           int buy = -prices[index] + maxProfitMemo(prices, index + 1, 1, memo);
           memo[index][holding] = Math.max(cooldown, buy);
       }
       
       return memo[index][holding];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), because each subproblem is solved at most once\.
*   **Space Complexity:** O\(n\), for the memo array\.

### 3\. Dynamic Programming

#### Intuition:

*   Instead of recursion, we use dynamic programming arrays to keep track of the profits\.
*   We define two arrays: `sell[i]` which is the maximum profit we can have up to day `i` \(inclusive\) and must sell on `i`, and `buy[i]` for transactions where max profit up to `i` and must buy on `i`\.

#### Code:

```java
class Solution {
   public int maxProfit(int[] prices) {
       if (prices == null || prices.length <= 1) return 0;
       
       int n = prices.length;
       int[] sell = new int[n];
       int[] buy = new int[n];
       
       // Initial state
       buy[0] = -prices[0]; // Buy on the first day
       sell[0] = 0;         // Can't sell on the first day
       
       for (int i = 1; i < n; i++) {
           sell[i] = Math.max(sell[i - 1], buy[i - 1] + prices[i]);
           buy[i] = Math.max(buy[i - 1], (i >= 2 ? sell[i - 2] - prices[i] : -prices[i]));
       }
       
       return sell[n - 1];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), because we iterate over the prices once\.
*   **Space Complexity:** O\(n\), due to the `buy` and `sell` arrays\.

### 4\. Space Optimized Dynamic Programming

#### Intuition:

*   We can notice that to compute `buy[i]` and `sell[i]`, we only need the values for `i-1` and `i-2`\.
*   Therefore, instead of maintaining arrays for `buy` and `sell`, we maintain only variables for the last two and current states\.

#### Code:

```java
class Solution {
   public int maxProfit(int[] prices) {
       if (prices == null || prices.length == 0) return 0;

       int n = prices.length;
       int sellPrev = 0, sellPrevPrev = 0;
       int buyPrev = -prices[0];
       
       for (int i = 1; i < n; i++) {
           int sellCurr = Math.max(sellPrev, buyPrev + prices[i]);
           int buyCurr = Math.max(buyPrev, sellPrevPrev - prices[i]);

           // Update previous states
           sellPrevPrev = sellPrev;
           sellPrev = sellCurr;
           buyPrev = buyCurr;
       }
       
       return sellPrev;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), since we iterate through the prices once\.
*   **Space Complexity:** O\(1\), as we are using a fixed number of variables instead of arrays\.

#### [Solve it on LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown)
