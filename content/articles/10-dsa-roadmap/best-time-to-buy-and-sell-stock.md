---
title: Best Time to Buy and Sell Stock
description: Master Best Time to Buy and Sell Stock in the Arrays module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Question

You are given an array `prices` where `prices[i]` is the price of a given stock on the **i****th** day\.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock\.

Return _the maximum profit you can achieve from this transaction_\. If you cannot achieve any profit, return `0`\.

#### Example 1:

**Input: prices = \[7, 1, 5, 3, 6, 4\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
  </div>
</div>

  <p class="arr-caption">Buy at index 1 (price=1) → Sell at index 4 (price=6)</p>

**Output: 5** &nbsp;&nbsp;— profit = 6 − 1 = 5

#### Example 2:

**Input: prices = \[7, 6, 4, 3, 1\]**

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
  </div>
</div>

  <p class="arr-caption">Prices only decrease — no profitable trade possible</p>

**Output: 0** &nbsp;&nbsp;— always decreasing, cannot make profit\.

#### Constraints:

*   **1 <= prices\.length <= 10^5**
*   **0 <= prices\[i\] <= 10^4**

## Approaches

### 1\. Brute Force

#### Intuition:

Try all possible pairs of \(buy day, sell day\) where sell day > buy day\. Compute profit for each and track the max\. O\(n²\) — works for small inputs\.

#### Steps:

1.  Iterate through the list of prices with two nested loops\.
2.  The outer loop will represent the buying day\.
3.  The inner loop will represent the selling day\.
4.  For each combination of buying and selling days, calculate the profit\.
5.  Maintain a variable to keep track of the maximum profit observed\.

#### Code:

```java
class Solution {
   public int maxProfit(int[] prices) {
       int maxProfit = 0;

       // Iterate through each day as buy day
       for (int i = 0; i < prices.length; i++) {
           // Iterate through each day after the buy day as sell day
           for (int j = i + 1; j < prices.length; j++) {
               // Calculate the profit by selling on the jth day after buying on ith day
               int profit = prices[j] - prices[i];
               // Update maxProfit if this profit is greater than seen before
               if (profit > maxProfit) {
                   maxProfit = profit;
               }
           }
       }

       return maxProfit;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to the two nested loops\.
*   **Space Complexity:** O\(1\) as no extra space is used\.

### 2\. One Pass Approach

#### **Intuition:**

Instead of trying all possible pairs of buy and sell days, we can iterate through the list of prices once while keeping track of the minimum price encountered so far\. At each step, we calculate what the profit would be if we sold at the current price, and update the maximum profit correspondingly\.

#### Intuition:

Scan left to right while tracking:

*   **minPrice**: the lowest price seen so far \(best day to have bought before or on today\)\.
*   **maxProfit**: the best profit achievable if we must **sell on or after** that minPrice day and **on or before** today\.

At each price `p`:
1.  Update `minPrice = min(minPrice, p)`\.
2.  Update `maxProfit = max(maxProfit, p - minPrice)`\.

#### Why this works?

*   Any valid trade is an ordered pair `(buyDay < sellDay)`\. When you stand on `sellDay = i`, the **best** buy day is simply the cheapest price among days `0..i`\. That’s exactly `minPrice` after scanning up to `i`\.
*   So the optimal profit that ends at day `i` is `prices[i] - minPrice`\. By checking this at **every** `i`, we consider the best “sell\-today” profit for every possible sell day\.
*   The global optimum is the maximum over all these per\-day profits, which we maintain as `maxProfit`\.

#### Code:

```java
class Solution {
   public int maxProfit(int[] prices) {
       int minPrice = Integer.MAX_VALUE;
       int maxProfit = 0;

       for (int price : prices) {
           // Update the minimum price so far
           if (price < minPrice) {
               minPrice = price;
           }
           // Calculate the potential profit
           int profit = price - minPrice;
           // Update the maximum profit found so far
           if (profit > maxProfit) {
               maxProfit = profit;
           }
       }

       return maxProfit;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) — single pass\.
*   **Space Complexity:** O\(1\) — no extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)
