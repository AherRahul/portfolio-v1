---
title: Best Time to Buy and Sell Stock II
description: Master Best Time to Buy and Sell Stock II in the Arrays module.
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

You are given an integer array `prices` where `prices[i]` is the price of a given stock on the **i****th** day\.

On each day, you may decide to buy and/or sell the stock\. You can only hold **at most one** share of the stock at any time\. However, you can buy it then immediately sell it on the **same day**\.

Find and return _the_ _**maximum**_ _profit you can achieve_\.

##### **Example 1:**

Input:prices=\[7,1,5,3,6,4\]

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

Output:7

**Explanation:**

*   Buy on day 2 \(price = 1\) and sell on day 3 \(price = 5\), profit = 5\-1 = 4\.
*   Then buy on day 4 \(price = 3\) and sell on day 5 \(price = 6\), profit = 6\-3 = 3\.
*   Total profit is 4 \+ 3 = 7\.

##### **Example 2:**

Input:prices=\[1,2,3,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
  </div>
</div>

**Output:** 4

Output:4

**Explanation:** Buy on day 1 \(price = 1\) and sell on day 5 \(price = 5\), profit = 5\-1 = 4\. Total profit is 4\.

##### **Example 3:**

Input:prices=\[7,6,4,3,1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
  </div>
</div>

Output:0

**Explanation:** There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0\.

##### **Constraints:**

*   **1 <= prices\.length <= 3 \* 10****4**
*   **0 <= prices\[i\] <= 10****4**


## Approaches

### 1\. Greedy Approach

#### Intuition:

The problem is essentially about finding opportunities to make as much profit as possible by buying stocks on one day and selling them on another\. This can be achieved by making transactions whenever there's a profit to be made, without concern for a future decrement in prices\.

In a simplified manner, the problem reduces to accumulating all positive differences between consecutive days\. By always projecting into the future and accumulating possible gains daily, we capitalize on every rising curve of the stock price graph\.

#### Code:

```java
class Solution {
   public int maxProfit(int[] prices) {
       int maxProfit = 0;
       
       for (int i = 1; i < prices.length; i++) {
           // If the current price is higher than the previous day's price, we have a profit opportunity:
           if (prices[i] > prices[i - 1]) {
               // Accumulate the profit by subtracting yesterday's price from today's price.
               maxProfit += prices[i] - prices[i - 1];
           }
       }
       
       // At the end, maxProfit holds the total profit accrued through all transactions.
       return maxProfit;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) since iterating through the prices array once\.
*   **Space Complexity:** O\(1\) since uses constant space\.

#### Example Walkthrough:

maxProfit = 0

### 2\. Peak Valley Approach

Another way to look at this problem is to find every consecutive pair of peaks and valleys\. A peak\-to\-valley traversal adds the difference from each peak to its preceding valley to determine the overall profit through multiple transactions\.

#### Intuition:

This approach mimics the real\-world scenario of buying stock at valleys \(local minimums\) and selling it at peaks \(local maximums\)\. This enables capturing every increasing sequence even if the overall curve spans over several days\.

#### Code:

```java
public class Solution {
   public int maxProfit(int[] prices) {
       int i = 0;
       int maxProfit = 0;
       int valley = prices[0];
       int peak = prices[0];
       
       while (i < prices.length - 1) {
           // Move the index to the valley/local minimum
           while (i < prices.length - 1 && prices[i] >= prices[i + 1]) {
               i++;
           }
           valley = prices[i];
           
           // Move the index to the peak/local maximum
           while (i < prices.length - 1 && prices[i] <= prices[i + 1]) {
               i++;
           }
           peak = prices[i];
           
           // Add the difference between peak and valley
           maxProfit += peak - valley;
       }
       
       // maxProfit now contains the total profit from valley to peak differences
       return maxProfit;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) since iterating through the prices array once\.
*   **Space Complexity:** O\(1\) since uses constant space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/description/)
