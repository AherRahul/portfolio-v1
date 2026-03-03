---
title: Max Value of Equation
description: Master Max Value of Equation in the Queues module. Comprehensive
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

You are given an array `points` containing the coordinates of points on a 2D plane, sorted by the x\-values, where **points\[i\] = \[x****i****, y****i****\]** such that **x****i** **< x****j** for all `1 <= i < j <= points.length`\. You are also given an integer `k`\.

Return _the maximum value of the equation_ **y****i** **\+ y****j** **\+ |x****i** **\- x****j****|** where **|x****i** **\- x****j****| <= k** and `1 <= i < j <= points.length`\.

It is guaranteed that there exists at least one pair of points that satisfy the constraint **|x****i** **\- x****j****| <= k**\.

##### **Example 1:**

**Input:** points = \[\[1,3\],\[2,0\],\[5,10\],\[6,\-10\]\], k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">-10</span></div>
    </div>
  </div>
</div>

**Output:** 4

**Explanation:** The first two points satisfy the condition |xi \- xj| <= 1 and if we calculate the equation we get 3 \+ 0 \+ |1 \- 2| = 4\. Third and fourth points also satisfy the condition and give a value of 10 \+ \-10 \+ |5 \- 6| = 1\.

No other pairs satisfy the condition, so we return the max of 4 and 1\.

##### **Example 2:**

**Input:** points = \[\[0,0\],\[3,0\],\[9,2\]\], k = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">9</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
  </div>
</div>

**Output:** 3

**Explanation:** Only the first two points have an absolute difference of 3 or less in the x\-values, and give the value of 0 \+ 0 \+ |0 \- 3| = 3\.

##### **Constraints:**

*   **2 <= points\.length <= 10****5**
*   **points\[i\]\.length == 2**
*   **\-10****8** **<= x****i****, y****i** **<= 10****8**
*   **0 <= k <= 2 \* 10****8**
*   **x****i** **< x****j** **for all 1 <= i < j <= points\.length**
*   **x****i** **form a strictly increasing sequence\.**


## Approaches

### 1\. Brute Force Approach

The brute force approach involves iterating through each pair of points and calculating the possible equation values directly\. This results in a time\-consuming solution, but it's a good starting point to understand the problem\.

#### Intuition:

1.  Iterate over every possible pair of points `(i, j)` where `i < j`\.
2.  Check if the condition `|xi - xj| <= k` holds\.
3.  If it holds, compute the equation value `(yi + yj + |xi - xj|)`\.
4.  Track the maximum equation value found\.

#### Code:

```java
class Solution {
   public int findMaxValueOfEquation(int[][] points, int k) {
       int maxValue = Integer.MIN_VALUE;
       for (int i = 0; i < points.length; i++) {
           for (int j = i + 1; j < points.length; j++) {
               int x1 = points[i][0];
               int y1 = points[i][1];
               int x2 = points[j][0];
               int y2 = points[j][1];
               // Check if the condition is satisfied
               if (x2 - x1 <= k) {
                   // Calculate the equation value
                   maxValue = Math.max(maxValue, y1 + y2 + x2 - x1);
               }
           }
       }
       return maxValue;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where n is the number of points, as we are checking every pair\.
*   **Space Complexity:** O\(1\), no extra space is used apart from variables\.

### 2\. Optimized Approach using Priority Queue

To improve on the brute force approach, we can use a priority queue to help us find pairs that maximize the expression efficiently\.

#### Intuition:

1.  Use a max heap \(priority queue\) to maintain the maximum values of `yi - xi` pairs\.
2.  Iterate over points while maintaining only valid points in the heap \(those satisfying `xj - xi <= k`\)\.
3.  For each point, calculate the potential value using the max in the priority queue\.
4.  Update the priority queue with the current point\.

#### Code:

```java
class Solution {
   public int findMaxValueOfEquation(int[][] points, int k) {
       PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
       int maxValue = Integer.MIN_VALUE;

       for (int[] point : points) {
           int xj = point[0];
           int yj = point[1];

           // Remove elements from the heap where the condition is not met
           while (!maxHeap.isEmpty() && xj - maxHeap.peek()[1] > k) {
               maxHeap.poll();
           }

           // If the heap is not empty, calculate the equation value
           if (!maxHeap.isEmpty()) {
               maxValue = Math.max(maxValue, yj + xj + maxHeap.peek()[0]);
           }

           // Add the current point (yj - xj) to the heap
           maxHeap.offer(new int[]{yj - xj, xj});
       }
       return maxValue;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\), because each point is inserted and removed from the heap\.
*   **Space Complexity:** O\(n\), due to the space needed for the heap\.

### 3\. Optimal Approach using Deque

To achieve even better time efficiency, we can use a deque data structure that allows insertion and deletions at both ends efficiently\.

#### Intuition:

1.  Use a deque to maintain indices of elements such that the potential maximum calculation `(yi - xi)` remains at the front\.
2.  For each point, first, clean the deque of elements that do not satisfy `|xi - xj| <= k`\.
3.  Calculate maximum potential value using the front of the deque\.
4.  Maintain the deque such that it stores only necessary indices for upcoming iterations\.

#### Code:

```java
class Solution {
   public int findMaxValueOfEquation(int[][] points, int k) {
       Deque<int[]> deque = new LinkedList<>();
       int maxValue = Integer.MIN_VALUE;

       for (int[] point : points) {
           int xj = point[0];
           int yj = point[1];

           // Remove outdated points from the deque
           while (!deque.isEmpty() && xj - deque.peekFirst()[1] > k) {
               deque.pollFirst();
           }

           // Calculate potential max with the deque's first element
           if (!deque.isEmpty()) {
               maxValue = Math.max(maxValue, yj + xj + deque.peekFirst()[0]);
           }

           // Maintain deque in a descending order of yi - xi
           while (!deque.isEmpty() && yj - xj >= deque.peekLast()[0]) {
               deque.pollLast();
           }

           // Add current point to the deque
           deque.offerLast(new int[]{yj - xj, xj});
       }

       return maxValue;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), since each element is inserted and removed from the deque at most once\.
*   **Space Complexity:** O\(n\), space required for the deque\.

#### [Solve it on LeetCode](https://leetcode.com/problems/max-value-of-equation)
