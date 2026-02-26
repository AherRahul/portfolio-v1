---
title: Largest Rectangle in Histogram
description: Master Largest Rectangle in Histogram in the Stacks module.
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

Given an array of integers `heights` representing the histogram's bar height where the width of each bar is `1`, return _the area of the largest rectangle in the histogram_\.

##### **Example 1:**

**Input:** heights = \[2,1,5,6,2,3\]

**Output:** 10

**Explanation:** The above is a histogram where width of each bar is 1\.

The largest rectangle is shown in the red area, which has an area = 10 units\.

##### **Example 2:**

**Input:** heights = \[2,4\]

**Output:** 4

##### **Constraints:**

*   **1 <= heights\.length <= 10****5**
*   **0 <= heights\[i\] <= 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/largest-rectangle-in-histogram)

# Approaches

## 1\. Brute Force

#### **Intuition:**

The simplest way to solve this problem is by considering each bar as the smallest \(shortest\) bar in the rectangle and expanding outwards\. For each bar, we try to find the maximum possible rectangle by expanding to the left and right until we can no longer keep the height of that rectangle as the current bar\.

#### Code:

Java

```java
class Solution {
   public int largestRectangleAreaBF(int[] heights) {
       int maxArea = 0;
       // Consider each bar as the smallest bar in the rectangle
       for (int i = 0; i < heights.length; i++) {
           int minHeight = heights[i];
           // Expand to the right
           for (int j = i; j < heights.length; j++) {
               // Update the minHeight for the current range
               minHeight = Math.min(minHeight, heights[j]);
               // Calculate area with minHeight as the height
               int currentArea = minHeight * (j - i + 1);
               maxArea = Math.max(maxArea, currentArea);
           }
       }
       return maxArea;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to nested for loops
*   **Space Complexity:** O\(1\) since no extra space is used apart from few variables\.

## 2\. Better Brute Force with Pruning

#### **Intuition:**

This builds on the idea of the simple brute force but introduces a pruning step by stopping earlier when the heights decrease and thus cannot extend the rectangle further in a beneficial way\.

#### Code:

Java

```java
class Solution {
   public int largestRectangleAreaBetter(int[] heights) {
       int maxArea = 0;
       for (int i = 0; i < heights.length; i++) {
           if (i < heights.length - 1 && heights[i] <= heights[i + 1]) {
               continue; // skip if the next bar is the same or taller, to avoid redundancy
           }
           int minHeight = heights[i];
           for (int j = i; j >= 0; j--) {
               minHeight = Math.min(minHeight, heights[j]);
               int currentArea = minHeight * (i - j + 1);
               maxArea = Math.max(maxArea, currentArea);
           }
       }
       return maxArea;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to nested for loops
*   **Space Complexity:** O\(1\) since no extra space is used apart from few variables\.

## 3\. Using Stack \(Optimal\)

#### **Intuition:**

The most optimal solution involves using a stack to store indices of the histogram's bars\. By utilizing a stack, we can ensure that we always process these histogram bars in an order where we have the necessary information to calculate the maximum rectangle as we proceed\. When a lower height is encountered, we process and calculate areas for all bars taller than the current one by treating them as the smallest bar of their respective rectangles\.

#### Code:

Java

```java
class Solution {
   public int largestRectangleAreaOptimal(int[] heights) {
       Stack<Integer> stack = new Stack<>();
       int maxArea = 0;
       int index = 0;
       while (index < heights.length) {
           // If this bar is higher than the bar at the stack's top index, push it to the stack
           if (stack.isEmpty() || heights[index] >= heights[stack.peek()]) {
               stack.push(index++);
           } else {
               // Pop the top
               int top = stack.pop();
               // Calculate the area with heights[top] as the smallest (height)
               int area = heights[top] * (stack.isEmpty() ? index : index - stack.peek() - 1);
               maxArea = Math.max(maxArea, area);
           }
       }

       // Remaining bars in stack
       while (!stack.isEmpty()) {
           int top = stack.pop();
           int area = heights[top] * (stack.isEmpty() ? index : index - stack.peek() - 1);
           maxArea = Math.max(maxArea, area);
       }

       return maxArea;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\) since iterating through the array once
*   **Space Complexity:** O\(n\) due to stack\.

View Animation