---
title: Gas Station
description: Master Gas Station in the Greedy module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

There are `n` gas stations along a circular route, where the amount of gas at the `i``th` station is `gas[i]`\.

You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i``th` station to its next `(i + 1)``th` station\. You begin the journey with an empty tank at one of the gas stations\.

Given two integer arrays `gas` and `cost`, return _the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return_ `-1`\. If there exists a solution, it is **guaranteed** to be **unique**\.

##### **Example 1:**

**Input:** gas = \[1,2,3,4,5\], cost = \[3,4,5,1,2\]

**Output:** 3

**Explanation:**

Start at station 3 \(index 3\) and fill up with 4 unit of gas\. Your tank = 0 \+ 4 = 4

Travel to station 4\. Your tank = 4 \- 1 \+ 5 = 8

Travel to station 0\. Your tank = 8 \- 2 \+ 1 = 7

Travel to station 1\. Your tank = 7 \- 3 \+ 2 = 6

Travel to station 2\. Your tank = 6 \- 4 \+ 3 = 5

Travel to station 3\. The cost is 5\. Your gas is just enough to travel back to station 3\.

Therefore, return 3 as the starting index\.

##### **Example 2:**

**Input:** gas = \[2,3,4\], cost = \[3,4,3\]

**Output:** \-1

**Explanation:**

You can't start at station 0 or 1, as there is not enough gas to travel to the next station\.

Let's start at station 2 and fill up with 4 unit of gas\. Your tank = 0 \+ 4 = 4

Travel to station 0\. Your tank = 4 \- 3 \+ 2 = 3

Travel to station 1\. Your tank = 3 \- 3 \+ 3 = 3

You cannot travel back to station 2, as it requires 4 unit of gas but you only have 3\.

Therefore, you can't travel around the circuit once no matter where you start\.

##### **Constraints:**

*   `n == gas.length == cost.length`
*   **1 <= n <= 10****5**
*   **0 <= gas\[i\], cost\[i\] <= 10****4**
*   The input is generated such that the answer is unique\.


## Approaches

### 1\. Brute Force

#### Intuition:

The Gas Station problem requires us to find a starting gas station, if it exists, from which we can complete a circular route\. The brute force solution involves trying every gas station as a starting point and checking if a circular journey can be completed\. This involves calculating the remaining gas from each station, updating the current gas as you proceed, and checking if you can reach back to the starting station\.

#### Code:

```java
class Solution {
   public int canCompleteCircuit(int[] gas, int[] cost) {
       int n = gas.length;
       
       // Try to start from each gas station
       for (int start = 0; start < n; start++) {
           int tank = 0;
           int count = 0;
           int i = start;
           boolean canComplete = true;
           
           // Traverse around the circuit starting from 'start'
           while (count < n) {
               tank += gas[i] - cost[i];
               
               // If at any point the tank is negative, break and try next starting point
               if (tank < 0) {
                   canComplete = false;
                   break;
               }
               
               // Move to the next station, circling back if necessary
               i = (i + 1) % n;
               count++;
           }
           
           // If we managed to complete the circuit, return the starting point
           if (canComplete) {
               return start;
           }
       }
       
       // If no valid starting point is found, return -1
       return -1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) because for each starting gas station, we potentially traverse the entire circuit\.
*   **Space Complexity:** O\(1\), no additional space is used apart from variables\.

### 2\. Improved Efficient Solution

#### Intuition:

The improved solution takes advantage of certain observations:

1.  If the total gas is greater than the total cost, then a solution must exist\.
2.  If at any station, the current gas becomes negative, it indicates this station cannot be a starting point, and all stations before it are also not viable\.

We traverse through each station once, keeping track of the total surplus and current surplus\. Whenever the current surplus becomes negative, we reset the potential start point to the next station\.

#### Code:

```java
class Solution {
   public int canCompleteCircuit(int[] gas, int[] cost) {
       int totalSurplus = 0;
       int currentSurplus = 0;
       int start = 0;

       for (int i = 0; i < gas.length; i++) {
           totalSurplus += gas[i] - cost[i];
           currentSurplus += gas[i] - cost[i];
           
           // If current surplus drops below 0, the start is not valid, move to next station
           if (currentSurplus < 0) {
               start = i + 1;
               currentSurplus = 0;
           }
       }
       
       // If the total surplus is non-negative, the circuit can be completed
       return totalSurplus >= 0 ? start : -1;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) because we make a single pass through the gas stations and costs\.
*   **Space Complexity:** O\(1\), no additional space is used other than basic variables\.

#### [Solve it on LeetCode](https://leetcode.com/problems/gas-station)
