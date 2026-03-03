---
title: The Skyline Problem
description: Master The Skyline Problem in the Advanced Topics module.
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

A city's **skyline** is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance\. Given the locations and heights of all the buildings, return _the_ _**skyline**_ _formed by these buildings collectively_\.

The geometric information of each building is given in the array `buildings` where **buildings\[i\] = \[left****i****, right****i****, height****i****\]**:

*   **left****i** is the x coordinate of the left edge of the **i****th** building\.
*   **right****i** is the x coordinate of the right edge of the **i****th** building\.
*   **height****i** is the height of the **i****th** building\.

You may assume all buildings are perfect rectangles grounded on an absolutely flat surface at height `0`\.

The **skyline** should be represented as a list of "key points" **sorted by their x\-coordinate** in the form **\[\[x****1****,y****1****\],\[x****2****,y****2****\],\.\.\.\]**\. Each key point is the left endpoint of some horizontal segment in the skyline except the last point in the list, which always has a y\-coordinate `0` and is used to mark the skyline's termination where the rightmost building ends\. Any ground between the leftmost and rightmost buildings should be part of the skyline's contour\.

**Note:** There must be no consecutive horizontal lines of equal height in the output skyline\. For instance, **\[\.\.\.,\[2 3\],\[4 5\],\[7 5\],\[11 5\],\[12 7\],\.\.\.\]** is not acceptable; the three lines of height 5 should be merged into one in the final output as such: **\[\.\.\.,\[2 3\],\[4 5\],\[12 7\],\.\.\.\]**

##### **Example 1:**

**Input:** buildings = \[\[2,9,10\],\[3,7,15\],\[5,12,12\],\[15,20,10\],\[19,24,8\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">9</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">15</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">12</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">12</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">20</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">19</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">24</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">8</span></div>
    </div>
  </div>
</div>

**Output:** \[\[2,10\],\[3,15\],\[7,12\],\[12,0\],\[15,10\],\[20,8\],\[24,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">15</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">12</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">12</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">10</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">20</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">8</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">24</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Explanation:**

Figure A shows the buildings of the input\.

Figure B shows the skyline formed by those buildings\. The red points in figure B represent the key points in the output list\.

##### **Example 2:**

**Input:** buildings = \[\[0,2,3\],\[2,5,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Output:** \[\[0,3\],\[5,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

##### **Constraints:**

*   **1 <= buildings\.length <= 10****4**
*   **0 <= left****i** **< right****i** **<= 2****31** **\- 1**
*   **1 <= height****i** **<= 2****31** **\- 1**
*   **buildings is sorted by left****i** **in non\-decreasing order\.**


## Approaches

### 1\. Sorted Edges \+ Priority Queue

#### Intuition:

The Skyline problem is essentially about managing the heights of buildings as you move from left to right across the plane\. The key idea is to focus on the "critical points" where the height changes\. These critical points are either the start or end of a building\. By sorting these events and using a priority queue to track current buildings, we can determine the skyline at each step\.

#### Steps:

1.  **Extract critical points** from the input buildings\. Each building provides two points: its starting event and its end event\. The start of a building contributes a positive height and the end contributes a negative height\.
2.  **Sort the events**:

*   By the x\-coordinate \(starting position\)\.
*   In case of ties, prioritize by height\. If it's a start point, sort from high to low; if it's an end point, sort from low to high\.

4.  **Use a max\-heap \(priority queue\)** to keep track of all active building heights\. The maximum height in the heap represents the current tallest building that influences the skyline\.
5.  **Iterate through the sorted events**:

*   When adding a start event, add its height to the heap\.
*   When processing an end event, remove its height from the heap\.
*   Check if the current max height \(top of the heap\) changes before and after processing the event\. If it does, add the new key point to the result\.

7.  **Return the list of key points** as the skyline\.

#### Code:

```java
class Solution {
   public List<List<Integer>> getSkyline(int[][] buildings) {
       List<List<Integer>> result = new ArrayList<>();
       List<int[]> events = new ArrayList<>();
       
       // Step 1: Create start and end events
       for (int[] building : buildings) {
           // Start event has negative height
           events.add(new int[] { building[0], -building[2] });
           // End event has positive height
           events.add(new int[] { building[1], building[2] });
       }
       
       // Step 2: Sort events
       Collections.sort(events, (a, b) -> {
           if (a[0] != b[0]) 
               return a[0] - b[0]; // Sort by x coordinate
           return a[1] - b[1]; // In tie, sort by height
       });
       
       // Step 3: Use max-heap to manage the height
       PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
       maxHeap.add(0); // Add a ground line height (0)
       int previousHeight = 0;
       
       // Step 4: Iterate over each event
       for (int[] event : events) {
           int x = event[0];
           int height = event[1];
           
           if (height < 0) { // Start of a building
               maxHeap.add(-height);
           } else { // End of a building
               maxHeap.remove(height);
           }
           
           int currentHeight = maxHeap.peek();
           if (currentHeight != previousHeight) {
               result.add(Arrays.asList(x, currentHeight));
               previousHeight = currentHeight;
           }
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(n log n\), where n is the number of critical points\. Sorting the events takes O\(n log n\), and each insertion and deletion from the heap takes O\(log n\)\.
*   **Space Complexity**: O\(n\), as we store up to n events and heights in the heap and list\.

#### [Solve it on LeetCode](https://leetcode.com/problems/the-skyline-problem)
