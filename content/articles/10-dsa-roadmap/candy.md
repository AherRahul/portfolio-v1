---
title: Candy
description: Master Candy in the Greedy module. Comprehensive guide and
  algorithmic problem solving.
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

There are `n` children standing in a line\. Each child is assigned a rating value given in the integer array `ratings`\.

You are giving candies to these children subjected to the following requirements:

*   Each child must have at least one candy\.
*   Children with a higher rating get more candies than their neighbors\.

Return _the minimum number of candies you need to have to distribute the candies to the children_\.

##### **Example 1:**

**Input:** ratings = \[1,0,2\]

**Output:** 5

**Explanation:** You can allocate to the first, second and third child with 2, 1, 2 candies respectively\.

##### **Example 2:**

**Input:** ratings = \[1,2,2\]

**Output:** 4

**Explanation:** You can allocate to the first, second and third child with 1, 2, 1 candies respectively\.

The third child gets 1 candy because it satisfies the above two conditions\.

##### **Constraints:**

*   **n == ratings\.length**
*   **1 <= n <= 2 \* 10****4**
*   **0 <= ratings\[i\] <= 2 \* 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/candy)

# Approaches

## 1\. Brute Force

#### Intuition:

The problem can be approached with a brute\-force method where we repeatedly iterate over the array to ensure all conditions are satisfied: each child gets at least one candy, and children with a higher rating than their neighbors get more candy than their neighbors\. This involves iteratively adjusting the candy values until we reach a stable state\.

#### Code:

Java

```java
class Solution {
   public int candy(int[] ratings) {
       int n = ratings.length;
       
       // Initial allocation of 1 candy for each child
       int[] candies = new int[n];
       for (int i = 0; i < n; i++) {
           candies[i] = 1;
       }
       
       boolean hasChanged = true;
       while (hasChanged) {
           hasChanged = false;
           
           // Traverse the array from left to right.
           for (int i = 0; i < n - 1; i++) {
               if (ratings[i] < ratings[i + 1] && candies[i] >= candies[i + 1]) {
                   candies[i + 1] = candies[i] + 1;
                   hasChanged = true;
               }
           }
           
           // Traverse the array from right to left.
           for (int i = n - 1; i > 0; i--) {
               if (ratings[i] < ratings[i - 1] && candies[i] >= candies[i - 1]) {
                   candies[i - 1] = candies[i] + 1;
                   hasChanged = true;
               }
           }
       }
       
       // Sum up candies
       int sum = 0;
       for (int candy : candies) {
           sum += candy;
       }
       return sum;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) in the worst case due to the repeated iteration over the array\.
*   **Space Complexity:** O\(n\) for the `candies` array\.

## 2\. Two\-pass Linear Greedy

#### Intuition:

This approach improves upon the brute force by using a two\-pass linear greedy strategy\. We handle conditions in a more organized manner:

1.  Make one pass from left to right, ensuring children with a higher rating than the previous one get more candies\.
2.  Make a second pass from right to left, doing similar adjustments but also ensuring not to disturb what was established in the first pass\.

#### Code:

Java

```java
class Solution {
   public int candy(int[] ratings) {
       int n = ratings.length;
       if (n <= 1) return n;
       
       // Create an array to store the number of candies each child should get
       int[] candies = new int[n];
       // Each child gets at least one candy.
       Arrays.fill(candies, 1);
       
       // Traverse the ratings from left to right.
       for (int i = 1; i < n; i++) {
           // If the current child has a higher rating than the previous one
           if (ratings[i] > ratings[i - 1]) {
               candies[i] = candies[i - 1] + 1;
           }
       }
       
       // Traverse the ratings from right to left.
       for (int i = n - 2; i >= 0; i--) {
           // If the current child has a higher rating than the next one
           if (ratings[i] > ratings[i + 1]) {
               candies[i] = Math.max(candies[i], candies[i + 1] + 1);
           }
       }
       
       // Sum up candies
       int sum = 0;
       for (int candy : candies) {
           sum += candy;
       }
       return sum;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of children, because each array is traversed twice\.
*   **Space Complexity:** O\(n\) for the `candies` array\.