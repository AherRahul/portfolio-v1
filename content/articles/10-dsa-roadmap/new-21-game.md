---
title: New 21 Game
description: Master New 21 Game in the Dynamic Programming module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Alice plays the following game, loosely based on the card game **"21"**\.

Alice starts with `0` points and draws numbers while she has less than `k` points\. During each draw, she gains an integer number of points randomly from the range `[1, maxPts]`, where `maxPts` is an integer\. Each draw is independent and the outcomes have equal probabilities\.

Alice stops drawing numbers when she gets `k` **or more points**\.

Return the probability that Alice has `n` or fewer points\.

Answers within `10``-5` of the actual answer are considered accepted\.

##### **Example 1:**

**Input:** n = 10, k = 1, maxPts = 10

**Output:** 1\.00000

**Explanation:** Alice gets a single card, then stops\.

##### **Example 2:**

**Input:** n = 6, k = 1, maxPts = 10

**Output:** 0\.60000

**Explanation:** Alice gets a single card, then stops\. In 6 out of 10 possibilities, she is at or below 6 points\.

##### **Example 3:**

**Input:** n = 21, k = 17, maxPts = 10**Output:** 0\.73278

##### **Constraints:**

*   `0 <= k <= n <= 10``4`
*   `1 <= maxPts <= 10``4`


## Approaches

### 1\. Brute Force Approach

In this initial approach, we simulate every possible game outcome up to the maximum point\. The idea is to use recursion to try every possible draw of cards and compute the probability of reaching the target score\.

#### **Intuition**:

*   We simulate each turn by drawing a card from 1 to `K`\.
*   Recursively calculate the probabilities of reaching a score greater than or equal to `N`\.
*   This recursion depth can get very large and become inefficient for larger values of `N` and `K`\.

#### Code:

```java
class Solution {
   public double new21Game(int N, int K, int maxPts) {
       return helper(N, K, 0, new Double[K + maxPts]);
   }

   private double helper(int N, int K, int currentSum, Double[] memo) {
       if (currentSum >= K) {
           return currentSum <= N ? 1.0 : 0.0;
       }
       if (memo[currentSum] != null) {
           return memo[currentSum];
       }
       double probability = 0.0;
       for (int i = 1; i <= maxPts; i++) {
           probability += helper(N, K, currentSum + i, memo);
       }
       probability /= maxPts;
       memo[currentSum] = probability;
       return probability;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(\(K \+ maxPts\)^maxPts\)
*   **Space Complexity:** O\(K \+ maxPts\)

### 2\. Dynamic Programming Approach

To improve efficiency, we switch to a Dynamic Programming technique, utilizing a DP array to store probabilities\.

#### **Intuition**:

*   Define `dp[x]` as the probability of getting exactly `x` points\.
*   Iteratively calculate probabilities for each score from 0 up to `K`\.
*   For scores greater than `K`, if the score is within the range `[K, N]`, then it contributes to the total probability outcome\.

#### Code:

```java
class Solution {
   public double new21Game(int N, int K, int maxPts) {
       if (K == 0 || N >= K + maxPts) {
           return 1.0;
       }
       double[] dp = new double[N + 1];
       dp[0] = 1.0;
       double sum = 1.0, result = 0.0;
       for (int i = 1; i <= N; i++) {
           dp[i] = sum / maxPts;
           if (i < K) {
               sum += dp[i];
           } else {
               result += dp[i];
           }
           if (i >= maxPts) {
               sum -= dp[i - maxPts];
           }
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\)
*   **Space Complexity:** O\(N\)

### 3\. Optimized DP Approach

The optimized DP approach reduces space usage by using a sliding window over the DP array, effectively reducing it from O\(N\) to O\(maxPts\)\.

#### **Intuition**:

*   Instead of maintaining a whole DP array, keep a rolling sum of probabilities that will be averaged out\.
*   This rolling window approach ensures that we only maintain necessary elements from the DP array within the range `[i-maxPts, i]`\.

#### Code:

```java
class Solution {
   public double new21Game(int N, int K, int maxPts) {
       if (K == 0 || N >= K + maxPts) {
           return 1.0;
       }
       double[] dp = new double[K + maxPts];
       dp[0] = 1.0;
       double sum = 1.0;
       double result = 0.0;
       for (int i = 1; i < K + maxPts; i++) {
           dp[i] = sum / maxPts;
           if (i < K) {
               sum += dp[i];
           } else {
               result += dp[i];
           }
           if (i >= maxPts) {
               sum -= dp[i - maxPts];
           }
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(K \+ maxPts\)
*   **Space Complexity:** O\(maxPts\)

#### [Solve it on LeetCode](https://leetcode.com/problems/new-21-game)
