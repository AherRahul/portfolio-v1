---
title: Burst Balloons
description: Master Burst Balloons in the Dynamic Programming module.
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

There are some spherical balloons taped onto a flat wall that represents the XY\-plane\. The balloons are represented as a 2D integer array `points` where **points\[i\] = \[x****start****, x****end****\]** denotes a balloon whose **horizontal diameter** stretches between **x****start** and **x****end**\. You do not know the exact y\-coordinates of the balloons\.

Arrows can be shot up **directly vertically** \(in the positive y\-direction\) from different points along the x\-axis\. A balloon with **x****start** and **x****end** is **burst** by an arrow shot at `x` if **x****start** **<= x <= x****end**\. There is **no limit** to the number of arrows that can be shot\. A shot arrow keeps traveling up infinitely, bursting any balloons in its path\.

Given the array `points`, return _the_ _**minimum**_ _number of arrows that must be shot to burst all balloons_\.

##### **Example 1:**

**Input:** points = \[\[10,16\],\[2,8\],\[1,6\],\[7,12\]\]

**Output:** 2

**Explanation:** The balloons can be burst by 2 arrows:

\- Shoot an arrow at x = 6, bursting the balloons \[2,8\] and \[1,6\]\.

\- Shoot an arrow at x = 11, bursting the balloons \[10,16\] and \[7,12\]\.

##### **Example 2:**

**Input:** points = \[\[1,2\],\[3,4\],\[5,6\],\[7,8\]\]

**Output:** 4

**Explanation:** One arrow needs to be shot for each balloon for a total of 4 arrows\.

##### **Example 3:**

**Input:** points = \[\[1,2\],\[2,3\],\[3,4\],\[4,5\]\]

**Output:** 2

**Explanation:** The balloons can be burst by 2 arrows:

\- Shoot an arrow at x = 2, bursting the balloons \[1,2\] and \[2,3\]\.

\- Shoot an arrow at x = 4, bursting the balloons \[3,4\] and \[4,5\]\.

##### **Constraints:**

*   **1 <= points\.length <= 10****5**
*   **points\[i\]\.length == 2**
*   **\-2****31** **<= x****start** **< x****end** **<= 2****31** **\- 1**

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons)

# Approaches

## 1\. Sorting and Greedy Approach

#### Intuition:

The problem can be visualized as an interval overlap problem\. Each balloon can be represented by an interval \(start, end\) based on its diameter\. The goal is to find the minimum number of arrows required to burst all balloons, which translates to finding the minimum number of non\-overlapping intervals required to cover all the intervals\.

A greedy approach is useful here:

1.  Sort the intervals by their ending values\.
2.  Start with the first interval and shoot an arrow at its end\. This arrow will cover all balloons that start before this end\.
3.  Move to the next interval that starts after the current arrow position\. Repeat until all balloons are covered\.

#### Algorithm:

1.  **Sort**: Sort the intervals by their end values in ascending order\.
2.  **Initialize**: Set the current arrow position to the end of the first interval and start counting arrows\.
3.  **Iterate**: Go through each balloon interval:

*   If the start of the current balloon is greater than the current arrow position, shoot a new arrow at the end of this current balloon\.
*   Update the current arrow position to this new end\.

#### Code:

Java

```java
class Solution {
   public int findMinArrowShots(int[][] points) {
       // Sorting the balloon intervals by their end position
       Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));

       int arrows = 0;
       Integer currentArrowPosition = null;

       for (int[] balloon : points) {
           // If currentArrowPosition is null or if the current balloon starts after the last arrow
           if (currentArrowPosition == null || balloon[0] > currentArrowPosition) {
               // Need to use a new arrow, so increase the arrow count
               arrows++;
               // Update the current arrow position to the end of this balloon
               currentArrowPosition = balloon[1];
           }
           // Else, the current balloon is within the range of the last arrow so no need for a new one
       }

       return arrows;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n log n\), where n is the number of balloons\. This comes mainly from sorting the intervals\.
*   **Space Complexity:** O\(1\), aside from input storage since we are sorting in place\.

View Animation