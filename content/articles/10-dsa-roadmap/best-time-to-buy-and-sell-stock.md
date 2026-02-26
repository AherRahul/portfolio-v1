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

# Problem Description

Question

You are given an array `prices` where `prices[i]` is the price of a given stock on the **i****th** day\.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock\.

Return _the maximum profit you can achieve from this transaction_\. If you cannot achieve any profit, return `0`\.

##### **Example 1:**

Input:prices=\[7,1,5,3,6,4\]

0

7

1

1

2

5

3

3

4

6

5

4

Output:5

5

**Explanation:** Buy on day 2 \(price = 1\) and sell on day 5 \(price = 6\), profit = 6 \- 1 = 5\.

Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell\.

##### **Example 2:**

Input:prices=\[7,6,4,3,1\]

0

7

1

6

2

4

3

3

4

1

Output:0

0

**Explanation:** In this case, no transactions are done and the max profit = 0\.

##### **Constraints:**

*   **1 <= prices\.length <= 10****5**
*   **0 <= prices\[i\] <= 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock)

# Approaches

## 1\. Brute Force

#### **Intuition:**

Using a brute force approach, we can try all possible combinations of buying and selling days and compute the profit for each combination\. The maximum of these profits will be our answer\.

#### **Steps:**

1.  Iterate through the list of prices with two nested loops\.
2.  The outer loop will represent the buying day\.
3.  The inner loop will represent the selling day\.
4.  For each combination of buying and selling days, calculate the profit\.
5.  Maintain a variable to keep track of the maximum profit observed\.

#### Code:

Java

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

Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to the two nested loops\.
*   **Space Complexity:** O\(1\) as no extra space is used\.

## 2\. One Pass Approach

#### **Intuition:**

Instead of trying all possible pairs of buy and sell days, we can iterate through the list of prices once while keeping track of the minimum price encountered so far\. At each step, we calculate what the profit would be if we sold at the current price, and update the maximum profit correspondingly\.

#### **Approach:**

Scan prices left to right while maintaining:

*   **minPrice**: the lowest price seen so far \(best day to have bought before or on today\)\.
*   **maxProfit**: the best profit achievable if we must **sell on or after** that minPrice day and **on or before** today\.

At each day’s price `p`:

1.  Update `minPrice = min(minPrice, p)`\. This locks in the cheapest buy seen so far\.
2.  Compute potential profit if we sell **today**: `p - minPrice`\.
3.  Update `maxProfit = max(maxProfit, p - minPrice)`\.

Return `maxProfit` after the scan\.

#### Why this works?

*   Any valid trade is an ordered pair `(buyDay < sellDay)`\. When you stand on `sellDay = i`, the **best** buy day is simply the cheapest price among days `0..i`\. That’s exactly `minPrice` after scanning up to `i`\.
*   So the optimal profit that ends at day `i` is `prices[i] - minPrice`\. By checking this at **every** `i`, we consider the best “sell\-today” profit for every possible sell day\.
*   The global optimum is the maximum over all these per\-day profits, which we maintain as `maxProfit`\.

#### Code:

Java

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

Complexity Analysis

*   **Time Complexity:** O\(n\) due to single loop\.
*   **Space Complexity:** O\(1\) as no extra space is used\.

#### Example Walkthrough:

0

7

1

1

2

5

3

3

4

6

5

4

minPrice = MAX, maxProfit = 0

Step 1 / 7

View Animation