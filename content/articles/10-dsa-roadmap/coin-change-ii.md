---
title: Coin Change II
description: Master Coin Change II in the Dynamic Programming module.
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

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money\.

Return _the number of combinations that make up that amount_\. If that amount of money cannot be made up by any combination of the coins, return `0`\.

You may assume that you have an infinite number of each kind of coin\.

The answer is **guaranteed** to fit into a signed **32\-bit** integer\.

##### **Example 1:**

**Input:** amount = 5, coins = \[1,2,5\]

**Output:** 4

**Explanation:** there are four ways to make up the amount:

5=5

5=2\+2\+1

5=2\+1\+1\+1

5=1\+1\+1\+1\+1

##### **Example 2:**

**Input:** amount = 3, coins = \[2\]

**Output:** 0

**Explanation:** the amount of 3 cannot be made up just with coins of 2\.

##### **Example 3:**

**Input:** amount = 10, coins = \[10\]

**Output:** 1

##### **Constraints:**

*   `1 <= coins.length <= 300`
*   `1 <= coins[i] <= 5000`
*   All the values of `coins` are **unique**\.
*   `0 <= amount <= 5000`

#### [Solve it on LeetCode](https://leetcode.com/problems/coin-change-ii)

# Approaches

## Approach 1: Recursion

#### Intuition:

Use recursion to explore all possible ways to make up the amount using combinations of the coins\. The idea is to traverse each coin and either take it \(reduce the amount\) or skip it and move to the next coin\. This basic approach generates all combinations but is not efficient due to repeated computations\.

#### Code:

Java

```java
class Solution {
   // Recursive function to count the number of ways to make up the amount
   public int change(int amount, int[] coins) {
       return countWays(coins, amount, 0);
   }

   private int countWays(int[] coins, int remaining, int index) {
       // Base case: If the remaining amount is 0, we've found a valid combination
       if (remaining == 0) return 1;
       // If remaining amount is negative or no more coins to use, return 0
       if (remaining < 0 || index == coins.length) return 0;
       
       // Count the number of ways excluding the current coin
       int excludeCurrent = countWays(coins, remaining, index + 1);
       // Count the number of ways including the current coin
       int includeCurrent = countWays(coins, remaining - coins[index], index);
       
       // Return the sum of both choices
       return excludeCurrent + includeCurrent;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(2^n\), where n is the number of coins\. This is because each coin can be taken or not, leading to a binary decision at each step\.
*   **Space Complexity:** O\(n\), due to the recursion stack\.

## 2\. Dynamic Programming \- 2D Array

#### Intuition:

To avoid the repetition in the recursive approach, use a 2D DP table\. Here, `dp[i][j]` represents the number of ways to get the amount `j` using first `i` coin types\. The table is filled in a bottom\-up manner\.

#### Code:

Java

```java
class Solution {
   public int change(int amount, int[] coins) {
       int n = coins.length;
       int[][] dp = new int[n + 1][amount + 1];
       
       // Base case: There's 1 way to make the amount 0 (use no coins)
       for (int i = 0; i <= n; i++) {
           dp[i][0] = 1;
       }
       
       for (int i = 1; i <= n; i++) {
           for (int j = 1; j <= amount; j++) {
               // Ways to make j without current coin
               dp[i][j] = dp[i - 1][j];
               // Ways to make j with the current coin (if possible)
               if (j >= coins[i - 1])
                   dp[i][j] += dp[i][j - coins[i - 1]];
           }
       }
       
       return dp[n][amount];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \* amount\), where n is the number of coins\.
*   **Space Complexity:** O\(n \* amount\), for storing the entire DP table\.

## 3\. Dynamic Programming \- 1D Array

#### Intuition:

Further optimize the space usage by using a 1D DP array\. Instead of maintaining a 2D array, keep track of number of ways to achieve different sums using a single 1D DP array\. Here, `dp[j]` represents the number of ways to get the amount `j`\.

#### Code:

Java

```java
class Solution {
   public int change(int amount, int[] coins) {
       // DP array to store the number of ways to make each amount
       int[] dp = new int[amount + 1];
       
       // Base case: Only one way to make the amount 0
       dp[0] = 1;
       
       for (int coin : coins) {
           for (int j = coin; j <= amount; j++) {
               // Update dp[j] with the number of ways including current coin
               dp[j] += dp[j - coin];
           }
       }
       
       return dp[amount];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \* amount\), where n is the number of coins\.
*   **Space Complexity:** O\(amount\), optimal space usage with a 1D array\.

View Animation