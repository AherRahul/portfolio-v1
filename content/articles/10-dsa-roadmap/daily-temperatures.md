---
title: Daily Temperatures
description: Master Daily Temperatures in the Stacks module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given an array of integers `temperatures` represents the daily temperatures, return _an array_ `answer` _such that_ `answer[i]` _is the number of days you have to wait after the_ `i``th` _day to get a warmer temperature_\. If there is no future day for which this is possible, keep `answer[i] == 0` instead\. 

##### **Example 1:**

**Input:** temperatures = \[73,74,75,71,69,72,76,73\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">73</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">74</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">75</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">71</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">69</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">72</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">76</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">73</span></div>
  </div>
</div>

**Output:** \[1,1,4,2,1,1,0,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">7</span><span class="arr-val">0</span></div>
  </div>
</div>

##### **Example 2:**

**Input:** temperatures = \[30,40,50,60\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">30</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">40</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">50</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">60</span></div>
  </div>
</div>

**Output:** \[1,1,1,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">0</span></div>
  </div>
</div>

##### **Example 3:**

**Input:** temperatures = \[30,60,90\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">30</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">60</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">90</span></div>
  </div>
</div>

**Output:** \[1,1,0\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">0</span></div>
  </div>
</div>

##### **Constraints:**

*   **1 <= temperatures\.length <= 10****5**
*   **30 <= temperatures\[i\] <= 100**


## Approaches

### 1\. Brute Force

#### **Intuition**:

We can start with a straightforward approach by simply checking each temperature against all the following temperatures to see when a warmer day occurs\. This involves traversing every pair of days, which can be inefficient\.

#### Steps:

1.  For each day in the list of temperatures, we need to find the number of days until a warmer temperature appears\.
2.  We'll make a nested iteration, fixing one element from the start and iterating through the following temperatures to find the first one greater than our fixed element\.
3.  If we find such a day, we calculate how many days ahead it is and store that in our result list\.

#### Code:

```java
class Solution {
   public int[] dailyTemperaturesBruteForce(int[] T) {
       int n = T.length;
       int[] result = new int[n];
       
       for (int i = 0; i < n; i++) {
           // Check each following day for a warmer temperature
           for (int j = i + 1; j < n; j++) {
               if (T[j] > T[i]) {
                   result[i] = j - i;
                   break;
               }
           }
           // If no warmer day found, result[i] stays 0
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to nested for loops\.
*   **Space Complexity:** O\(1\), aside from the output array\.

### 2\. Using a Stack

#### **Intuition**:

By utilizing a stack, we can reduce the repeated comparisons to gain an optimal solution\. We will use a stack to keep track of indices of the temperatures that need to find a warmer temperature\.

#### Steps:

1.  We will maintain a stack to store indices of the temperatures\.
2.  As we iterate over each day's temperature, we compare it with the temperatures corresponding to the indices in our stack\.
3.  If the current day's temperature is warmer than the temperature at the index stored at the top of the stack, we pop the index from the stack and update our result with the number of days we've moved forward to find a warmer temperature\.
4.  We push the current index onto the stack if we don't find a warmer temperature\.
5.  This way, each temperature is processed once, ensuring efficiency\.

#### Code:

```java
class Solution {
   public int[] dailyTemperaturesStack(int[] T) {
       int n = T.length;
       int[] result = new int[n];
       Stack<Integer> stack = new Stack<>();
       
       for (int i = 0; i < n; i++) {
           // Check if the stack is not empty and the current temperature is greater than that at stack's top index
           while (!stack.isEmpty() && T[i] > T[stack.peek()]) {
               int index = stack.pop();
               result[index] = i - index; // The difference in days
           }
           // Push the current index onto the stack
           stack.push(i);
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), each element is pushed and popped at most once\.
*   **Space Complexity:** O\(n\), due to the stack storing up to n indices\.

#### [Solve it on LeetCode](https://leetcode.com/problems/daily-temperatures)
