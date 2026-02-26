---
title: Koko Eating Bananas
description: Master Koko Eating Bananas in the Binary Search module.
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

Koko loves to eat bananas\. There are `n` piles of bananas, the `i``th` pile has `piles[i]` bananas\. The guards have gone and will come back in `h` hours\.

Koko can decide her bananas\-per\-hour eating speed of `k`\. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile\. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour\.

Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return\.

Return _the minimum integer_ `k` _such that she can eat all the bananas within_ `h` _hours_\.

##### **Example 1:**

**Input:** piles = \[3,6,7,11\], h = 8

**Output:** 4

##### **Example 2:**

**Input:** piles = \[30,11,23,4,20\], h = 5

**Output:** 30

##### **Example 3:**

**Input:** piles = \[30,11,23,4,20\], h = 6

**Output:** 23

##### **Constraints:**

*   **1 <= piles\.length <= 10****4**
*   **piles\.length <= h <= 10****9**
*   **1 <= piles\[i\] <= 10****9**

#### [Solve it on LeetCode](https://leetcode.com/problems/koko-eating-bananas)

# Approaches

## 1\. Brute Force Solution

#### Intuition:

In this approach, we try every possible eating speed `k` starting from 1 until we find a speed that allows Koko to eat all the bananas within `h` hours\. For each speed, we simulate the eating process and check if Koko can finish all bananas within `h` hours\.

#### Code:

Java

```java
class Solution {
   public int minEatingSpeed(int[] piles, int h) {
       int maxPile = 0;
       for (int pile : piles) {
           maxPile = Math.max(maxPile, pile); // Find the maximum number of bananas in a pile
       }
       
       // Try each possible speed from 1 to maxPile
       for (int speed = 1; speed <= maxPile; speed++) {
           if (canEatAllBananas(piles, h, speed)) {
               return speed; // Return the first speed where Koko can eat all bananas in time
           }
       }
       
       return maxPile; // In the worst case, return maxPile which is 1 hour per pile
   }
   
   private boolean canEatAllBananas(int[] piles, int h, int k) {
       int hoursNeeded = 0;
       for (int pile : piles) {
           hoursNeeded += (int) Math.ceil((double) pile / k); // Calculate hours needed at this speed
       }
       return hoursNeeded <= h;
   }
}
```

Complexity Analysis

*   **Time Complexity:** We may have to try all speeds from 1 to the maximum pile size, leading to `O(max(piles) * n)`, where `n` is the number of piles\.
*   **Space Complexity:** `O(1)`, no additional space other than input and local variables\.

## 2\. Binary Search Solution

#### Intuition:

Using binary search, we efficiently narrow down the range of Koko's possible eating speeds\. Instead of checking each speed one by one, we continuously adjust our search range based on whether the current mid speed allows Koko to eat all bananas in `h` hours\. The goal is to find the minimal speed `k` that works\.

#### Code:

Java

```java
class Solution {
   public int minEatingSpeed(int[] piles, int h) {
       int maxPile = 0;
       for (int pile : piles) {
           maxPile = Math.max(maxPile, pile); // Determine the biggest pile for upper bound of search
       }
       
       int left = 1; // Minimum possible speed
       int right = maxPile; // Maximum possible speed
       int result = maxPile;
       
       while (left <= right) {
           int mid = left + (right - left) / 2; // Mid-point speed
           if (canEatAllBananas(piles, h, mid)) {
               result = mid; // If Koko can eat all, try a smaller speed
               right = mid - 1;
           } else {
               left = mid + 1; // Otherwise, increase the speed
           }
       }
       
       return result;
   }
   
   private boolean canEatAllBananas(int[] piles, int h, int k) {
       int hoursNeeded = 0;
       for (int pile : piles) {
           hoursNeeded += (int) Math.ceil((double) pile / k); // Calculate hours needed at this speed
       }
       return hoursNeeded <= h;
   }
}
```

Complexity Analysis

*   **Time Complexity:** `O(n log(max(piles)))`, where `log(max(piles))` is for the binary search and `n` for each check of `canEatAllBananas`\.
*   **Space Complexity:** `O(1)`, using only a constant amount of extra space\.