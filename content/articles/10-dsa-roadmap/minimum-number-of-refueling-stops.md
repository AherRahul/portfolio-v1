---
title: Minimum Number of Refueling Stops
description: Master Minimum Number of Refueling Stops in the Greedy module.
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

A car travels from a starting position to a destination which is `target` miles east of the starting position\.

There are gas stations along the way\. The gas stations are represented as an array `stations` where `stations[i] = [position``i``, fuel``i``]` indicates that the `i``th` gas station is `position``i` miles east of the starting position and has `fuel``i` liters of gas\.

The car starts with an infinite tank of gas, which initially has `startFuel` liters of fuel in it\. It uses one liter of gas per one mile that it drives\. When the car reaches a gas station, it may stop and refuel, transferring all the gas from the station into the car\.

Return _the minimum number of refueling stops the car must make in order to reach its destination_\. If it cannot reach the destination, return `-1`\.

Note that if the car reaches a gas station with `0` fuel left, the car can still refuel there\. If the car reaches the destination with `0` fuel left, it is still considered to have arrived\.

##### **Example 1:**

**Input:** target = 1, startFuel = 1, stations = \[\]

**Output:** 0

**Explanation:** We can reach the target without refueling\.

##### **Example 2:**

**Input:** target = 100, startFuel = 1, stations = \[\[10,100\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">100</span></div>
    </div>
  </div>
</div>

**Output:** \-1

**Explanation:** We can not reach the target \(or even the first gas station\)\.

##### **Example 3:**

**Input:** target = 100, startFuel = 10, stations = \[\[10,60\],\[20,30\],\[30,30\],\[60,40\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">60</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">20</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">30</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">30</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">30</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">60</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">40</span></div>
    </div>
  </div>
</div>

**Output:** 2

**Explanation:** We start with 10 liters of fuel\.

We drive to position 10, expending 10 liters of fuel\. We refuel from 0 liters to 60 liters of gas\.

Then, we drive from position 10 to position 60 \(expending 50 liters of fuel\), and refuel from 10 liters to 50 liters of gas\. We then drive to and reach the target\.We made 2 refueling stops along the way, so we return 2\.

##### **Constraints:**

*   **1 <= target, startFuel <= 10****9**
*   **0 <= stations\.length <= 500**
*   **1 <= position****i** **< position****i\+1** **< target**
*   **1 <= fuel****i** **< 10****9**


## Approaches

### 1\. Brute Force Recursive Approach

#### **Intuition:**

The brute\-force approach involves trying all possible combinations of using the available fuel stops to reach the target\. We can implement a recursive function that explores each possible stopping point and decides whether to refuel there or not\.

While a possible solution, this approach is highly inefficient and not feasible for large input sizes due to its exponential time complexity\.

#### **Code:**

```java
class Solution {    
   public int minRefuelStops(int target, int startFuel, int[][] stations) {
       int result = refuel(target, startFuel, stations, 0, 0);
       return result == Integer.MAX_VALUE ? -1 : result;
   }

   private int refuel(int target, int currentFuel, int[][] stations, int currentPosition, int numOfStops) {
       // Base case: If currentFuel is already enough to reach the target
       if(currentFuel >= target) return numOfStops;

       // If we have exhausted all stations and cannot reach the target
       if(currentPosition >= stations.length) return Integer.MAX_VALUE;
       
       // Option 1: Do not refuel at the current station
       int skipCurrent = refuel(target, currentFuel, stations, currentPosition + 1, numOfStops);

       int refuelCurrent = Integer.MAX_VALUE;
       
       if(currentFuel >= stations[currentPosition][0]) {
           // Option 2: Refuel at current station
           refuelCurrent = refuel(
               target, 
               currentFuel + stations[currentPosition][1], 
               stations, 
               currentPosition + 1, 
               numOfStops + 1
           );
       }
       
       return Math.min(skipCurrent, refuelCurrent);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** Exponential due to exploring all combinations: O\(2^N\), where \(N\) is the number of stations\.
*   **Space Complexity:** Depth of recursion: O\(N\)\.

### 2\. Dynamic Programming Approach

#### **Intuition:**

We can reduce the time complexity by using dynamic programming\. Create an array `dp` where `dp[i]` is the maximum distance we can reach with `i` refueling stops\. Our goal is to find the smallest `i` such that `dp[i] >= target`\.

#### **Code:**

```java
class Solution {
   public int minRefuelStops(int target, int startFuel, int[][] stations) {
       int n = stations.length;
       long[] dp = new long[n + 1];
       dp[0] = startFuel;

       for (int i = 0; i < n; i++) {
           // Traverse backwards to prevent using this station more than once
           for (int t = i; t >= 0; t--) {
               if (dp[t] >= stations[i][0]) {
                   dp[t + 1] = Math.max(dp[t + 1], dp[t] + stations[i][1]);
               }
           }
       }

       for (int i = 0; i <= n; i++) {
           if (dp[i] >= target) {
               return i;
           }
       }
       
       return -1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N^2\), iterating over stations and stops\.
*   **Space Complexity:** O\(N\) for the dp array\.

### 3\. Greedy Approach with Max\-Heap

#### **Intuition:**

The most optimal solution involves using a max\-heap to prioritize the largest fuel available at each decision point\. This approach picks the station with the most fuel capacity reachable based on the current fuel status at each step\.

#### **Code:**

```java
class Solution {
   public int minRefuelStops(int target, int startFuel, int[][] stations) {
       PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
       int fuel = startFuel;
       int stops = 0;
       int i = 0;

       while (fuel < target) {
           // Add all reachable stations to the heap
           while (i < stations.length && stations[i][0] <= fuel) {
               maxHeap.offer(stations[i++][1]);
           }
           
           // If no more stations can be reached and target not achieved
           if (maxHeap.isEmpty()) return -1;
           
           // Refuel with the station having maximum gas
           fuel += maxHeap.poll();
           stops++;
       }
       return stops;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log N\)\), primarily due to heap operations\.
*   **Space Complexity:** O\(N\) for the heap structure\.

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-number-of-refueling-stops)
