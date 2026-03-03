---
title: K Closest Points to Origin
description: Master K Closest Points to Origin in the Heaps module.
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

Given an array of `points` where **points\[i\] = \[x****i****, y****i****\]** represents a point on the **X\-Y** plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`\.

The distance between two points on the **X\-Y** plane is the Euclidean distance \(i\.e\., **√\(x****1** **\- x****2****\)****2** **\+ \(y****1** **\- y****2****\)****2**\)\.

You may return the answer in **any order**\. The answer is **guaranteed** to be **unique** \(except for the order that it is in\)\.

##### **Example 1:**

**Input:** points = \[\[1,3\],\[\-2,2\]\], k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">-2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
  </div>
</div>

**Output:** \[\[\-2,2\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">-2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
    </div>
  </div>
</div>

**Explanation:**

The distance between \(1, 3\) and the origin is sqrt\(10\)\.

The distance between \(\-2, 2\) and the origin is sqrt\(8\)\.

Since sqrt\(8\) < sqrt\(10\), \(\-2, 2\) is closer to the origin\.

We only want the closest k = 1 points from the origin, so the answer is just \[\[\-2,2\]\]\.

##### **Example 2:**

**Input:** points = \[\[3,3\],\[5,\-1\],\[\-2,4\]\], k = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">-1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">-2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
  </div>
</div>

**Output:** \[\[3,3\],\[\-2,4\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">-2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
  </div>
</div>

**Explanation:** The answer \[\[\-2,4\],\[3,3\]\] would also be accepted\.

##### **Constraints:**

*   **1 <= k <= points\.length <= 10****4**
*   **\-10****4** **<= x****i****, y****i** **<= 10****4**


## Approaches

### 1\. Naive Approach: Sorting

#### Intuition:

The most straightforward way to solve this problem is to calculate the distance of each point from the origin and then sort the points based on these distances\.

#### Steps:

1.  Calculate the Euclidean distance for each point from the origin\.
2.  Store the distances along with their respective points\.
3.  Sort the points based on the calculated distances\.
4.  Return the first `K` points from the sorted list\.

#### Code:

```java
class Solution {
   public int[][] kClosest(int[][] points, int K) {
       Arrays.sort(points, (a, b) -> {
           // Compare based on distance from origin
           return (a[0] * a[0] + a[1] * a[1]) - (b[0] * b[0] + b[1] * b[1]);
       });
       
       // Return the first K points
       return Arrays.copyOfRange(points, 0, K);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log N\), where N is the number of points\. This is due to the sorting step\.
*   **Space Complexity:** O\(1\), as we are sorting the array in place\.

### 2\. Optimized Approach: Heap/Priority Queue

#### Intuition:

Instead of sorting the entire array, we can maintain a max heap of size `K` to keep track of the `K` closest points\. This allows for more efficient insertion and removal operations as we process each point\.

#### Steps:

1.  Create a max heap \(priority queue\) that will store the points based on their distance from the origin\.
2.  Iterate through each point and calculate its distance from the origin\.
3.  Maintain the heap to only contain the `K` closest points by removing the farthest point when the heap size exceeds `K`\.
4.  Convert the result from the heap to an array and return it\.

#### Code:

```java
class Solution {
   public int[][] kClosest(int[][] points, int K) {
       // Max-heap with a custom comparator for negative distance
       PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> 
           (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1])
       );
       
       for (int[] point : points) {
           maxHeap.add(point);
           
           // If heap size exceeds K, remove the point with the maximum distance
           if (maxHeap.size() > K) {
               maxHeap.poll();
           }
       }
       
       // Convert the result from heap to array
       int[][] result = new int[K][2];
       for (int i = 0; i < K; i++) {
           result[i] = maxHeap.poll();
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log K\), where N is the number of points and K is the number of closest points required\. This is due to the priority queue operations\.
*   **Space Complexity:** O\(K\), for storing the `K` closest points in the heap\.

### 3\. Optimal Approach: Quickselect

#### Intuition:

Quickselect is an optimization over quicksort that allows us to partition the array and only focus on the `K` closest elements\. It can achieve an average time complexity better than sorting or using a heap\.

#### Steps:

1.  Implement a partitioning method to organize points relative to a pivot such that all points closer than the pivot appear before all points farther than the pivot\.
2.  Recursively adjust the partitioning based on the position of K relative to the pivot's final index until the partition yielding the closest K points is achieved\.

#### Code:

```java
class Solution {
   public int[][] kClosest(int[][] points, int K) {
       quickSelect(points, 0, points.length - 1, K);
       return Arrays.copyOfRange(points, 0, K);
   }
   
   private void quickSelect(int[][] points, int left, int right, int K) {
       if (left >= right) return;
       
       // Random pivot selection for improved average performance
       Random rand = new Random();
       int pivotIdx = left + rand.nextInt(right - left);
       
       // Partition the array around the pivot
       int pivotFinalIdx = partition(points, left, right, pivotIdx);
       
       // Recurse into the left or right half based on pivot position
       if (K < pivotFinalIdx) {
           quickSelect(points, left, pivotFinalIdx - 1, K);
       } else if (K > pivotFinalIdx) {
           quickSelect(points, pivotFinalIdx + 1, right, K);
       }
   }
   
   private int partition(int[][] points, int left, int right, int pivotIdx) {
       int pivotDist = distance(points[pivotIdx]);
       swap(points, pivotIdx, right);
       
       int storeIdx = left;
       for (int i = left; i < right; i++) {
           if (distance(points[i]) < pivotDist) {
               swap(points, storeIdx, i);
               storeIdx++;
           }
       }
       
       swap(points, storeIdx, right);
       return storeIdx;
   }
   
   private int distance(int[] point) {
       return point[0] * point[0] + point[1] * point[1];
   }
   
   private void swap(int[][] points, int i, int j) {
       int[] temp = points[i];
       points[i] = points[j];
       points[j] = temp;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\) on average, but O\(N^2\) in the worst case due to the recursive partitioning process\.
*   **Space Complexity:** O\(1\), as it is an in\-place sorting algorithm\.

#### [Solve it on LeetCode](https://leetcode.com/problems/k-closest-points-to-origin)
