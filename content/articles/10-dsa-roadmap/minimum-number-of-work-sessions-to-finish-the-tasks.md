---
title: Minimum Number of Work Sessions to Finish the Tasks
description: Master Minimum Number of Work Sessions to Finish the Tasks in the
  Dynamic Programming module. Comprehensive guide and algorithmic problem
  solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

There are `n` tasks assigned to you\. The task times are represented as an integer array `tasks` of length `n`, where the `i``th` task takes `tasks[i]` hours to finish\. A **work session** is when you work for **at most** `sessionTime` consecutive hours and then take a break\.

You should finish the given tasks in a way that satisfies the following conditions:

*   If you start a task in a work session, you must complete it in the **same** work session\.
*   You can start a new task **immediately** after finishing the previous one\.
*   You may complete the tasks in **any order**\.

Given `tasks` and `sessionTime`, return _the_ _**minimum**_ _number of_ _**work sessions**_ _needed to finish all the tasks following the conditions above\._

The tests are generated such that `sessionTime` is **greater** than or **equal** to the **maximum** element in `tasks[i]`\.

##### **Example 1:**

**Input:** tasks = \[1,2,3\], sessionTime = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** 2

**Explanation:** You can finish the tasks in two work sessions\.

\- First work session: finish the first and the second tasks in 1 \+ 2 = 3 hours\.

\- Second work session: finish the third task in 3 hours\.

##### **Example 2:**

**Input:** tasks = \[3,1,3,1,1\], sessionTime = 8

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** 2

**Explanation:** You can finish the tasks in two work sessions\.

\- First work session: finish all the tasks except the last one in 3 \+ 1 \+ 3 \+ 1 = 8 hours\.

\- Second work session: finish the last task in 1 hour\.

##### **Example 3:**

**Input:** tasks = \[1,2,3,4,5\], sessionTime = 15

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
  </div>
</div>

**Output:** 1

**Explanation:** You can finish all the tasks in one work session\.

##### **Constraints:**

*   `n == tasks.length`
*   `1 <= n <= 14`
*   `1 <= tasks[i] <= 10`
*   `max(tasks[i]) <= sessionTime <= 15`


## Approaches

### 1\. Backtracking

In this approach, we will use simple backtracking\. The basic idea is to try all possible ways to assign tasks to work sessions and keep track of the minimum number of sessions needed\.

#### Intuition:

1.  We initially start with an empty assignment of tasks to work sessions\.
2.  For each task, we have several options:

*   Start a new session and assign the task to this session\.
*   Assign the task to an existing session if its duration plus this task's duration does not exceed the session's limit\.

4.  We explore all possibilities using backtracking, and at each step, we attempt to assign a task either to a new session or a suitable existing session\.
5.  Base Case: When all the tasks are assigned, count the number of sessions used and record the result if it's the minimum so far\.

#### Code:

```java
class Solution {
   private int minSessions = Integer.MAX_VALUE;
   
   public int minSessions(int[] tasks, int sessionTime) {
       backtrack(tasks, sessionTime, new ArrayList<>(), 0);
       return minSessions;
   }
   
   private void backtrack(int[] tasks, int sessionTime, List<Integer> sessions, int taskIndex) {
       if (taskIndex == tasks.length) {
           minSessions = Math.min(minSessions, sessions.size());
           return;
       }
       
       for (int i = 0; i < sessions.size(); i++) {
           if (sessions.get(i) + tasks[taskIndex] <= sessionTime) {
               // Assign task to an existing session
               sessions.set(i, sessions.get(i) + tasks[taskIndex]);
               backtrack(tasks, sessionTime, sessions, taskIndex + 1);
               // Backtrack, remove the task from the session
               sessions.set(i, sessions.get(i) - tasks[taskIndex]);
           }
       }
       
       // Start a new session with the current task
       sessions.add(tasks[taskIndex]);
       backtrack(tasks, sessionTime, sessions, taskIndex + 1);
       // Backtrack by removing the new session
       sessions.remove(sessions.size() - 1);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\!\), where n is the number of tasks\. This is because of all the possible permutations of task assignments\.
*   **Space Complexity:** O\(n\), for the recursive call stack and additional space used by the `sessions`\.

### 2\. Dynamic Programming with State Compression

This approach improves efficiency by using dynamic programming combined with bitmasking to represent task assignments in sessions\.

#### Intuition:

1.  Use a bitmask to represent subsets of tasks and dynamic programming to store the minimum sessions required for each subset\.
2.  For a given state \(submask of tasks\), split it into two parts representing assignments to two different groups of sessions\.
3.  Calculate the minimum sessions required for each group and update the state\.
4.  Iterate all subsets and use previously computed results to find the minimum sessions needed\.

#### Code:

```java
class Solution {
   public int minSessions(int[] tasks, int sessionTime) {
       int n = tasks.length;
       int maxMask = (1 << n);
       int[] minSessions = new int[maxMask];
       
       // Initialize with a large value
       Arrays.fill(minSessions, Integer.MAX_VALUE);
       minSessions[0] = 0; // Base case: no tasks need zero sessions
       
       for (int mask = 0; mask < maxMask; mask++) {
           int workSessionTime = 0;
           for (int i = 0; i < n; i++) {
               if ((mask & (1 << i)) != 0) {
                   workSessionTime += tasks[i];
               }
           }

           if (workSessionTime <= sessionTime) {
               // Calculate new states
               for (int submask = mask; submask != 0; submask = (submask - 1) & mask) {
                   int subWorkTime = 0;
                   for (int i = 0; i < n; i++) {
                       if ((submask & (1 << i)) != 0) {
                           subWorkTime += tasks[i];
                       }
                   }
                   if (subWorkTime <= sessionTime) {
                       minSessions[mask] = Math.min(minSessions[mask], minSessions[mask ^ submask] + 1);
                   }
               }
           }
       }
       return minSessions[maxMask - 1];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(2^n \* n\), where n is the number of tasks\. Each state is visited, and for each state, we explore its subsets\.
*   **Space Complexity:** O\(2^n\), for storing results of each submask in the dynamic programming array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks)
