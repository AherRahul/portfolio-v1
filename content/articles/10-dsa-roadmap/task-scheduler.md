---
title: Task Scheduler
description: Master Task Scheduler in the Greedy module. Comprehensive guide and
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

You are given an array of CPU `tasks`, each labeled with a letter from A to Z, and a number `n`\. Each CPU interval can be idle or allow the completion of one task\. Tasks can be completed in any order, but there's a constraint: there has to be a gap of **at least** `n` intervals between two tasks with the same label\.

Return the **minimum** number of CPU intervals required to complete all tasks\.

##### **Example 1:**

**Input:** tasks = \["A","A","A","B","B","B"\], n = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">B</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">B</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">B</span></div>
  </div>
</div>

**Output:** 8

**Explanation:** A possible sequence is: A \-> B \-> idle \-> A \-> B \-> idle \-> A \-> B\.

After completing task A, you must wait two intervals before doing A again\. The same applies to task B\. In the 3rd interval, neither A nor B can be done, so you idle\. By the 4th interval, you can do A again as 2 intervals have passed\.

##### **Example 2:**

**Input:** tasks = \["A","C","A","B","D","B"\], n = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">C</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">B</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">D</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">B</span></div>
  </div>
</div>

**Output:** 6

**Explanation:** A possible sequence is: A \-> B \-> C \-> D \-> A \-> B\.

With a cooling interval of 1, you can repeat a task after just one other task\.

##### **Example 3:**

**Input:** tasks = \["A","A","A", "B","B","B"\], n = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">A</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">B</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">B</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">B</span></div>
  </div>
</div>

**Output:** 10

**Explanation:** A possible sequence is: A \-> B \-> idle \-> idle \-> A \-> B \-> idle \-> idle \-> A \-> B\.

There are only two types of tasks, A and B, which need to be separated by 3 intervals\. This leads to idling twice between repetitions of these tasks\.

##### **Constraints:**

*   **1 <= tasks\.length <= 10****4**
*   `tasks[i]` is an uppercase English letter\.
*   `0 <= n <= 100`


## Approaches

### 1\. Greedy Scheduling with Priority Queue

#### **Intuition:**

The problem can be visualized as filling slots in a schedule but ensuring that there are enough cooldown periods between the same tasks\. The most basic approach involves using a priority queue to always schedule the task that is left with the highest frequency\. This strategy simulates the task execution by tracking time and rearranging tasks based on cooldowns\.

1.  **Frequency Counting:** First, calculate the frequency of each task\.
2.  **Priority Queue:** Use a max heap \(priority queue\) to always schedule the most frequent task available, as this task contributes the most to minimizing the idle intervals\.
3.  **Cooldown Management:** Use a cooldown queue to track tasks that are in cooldown periods and need to be paused before they can be scheduled again\.
4.  **Time Simulation:** Iterate over time units and use steps 2 and 3 above to decide what task, if any, to execute at each time step\.

#### Code:

```java
class Solution {
   public int leastInterval(char[] tasks, int n) {
       Map<Character, Integer> frequencyMap = new HashMap<>();
       
       // Step 1: Count the frequency of each task
       for (char task : tasks) {
           frequencyMap.put(task, frequencyMap.getOrDefault(task, 0) + 1);
       }

       // Step 2: Initialize a max heap based on task frequencies
       PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
       maxHeap.addAll(frequencyMap.values());

       // This map will track tasks in their cooldown period
       Queue<Map.Entry<Integer, Integer>> cooldownQueue = new LinkedList<>();
       
       int time = 0;

       // Step 3: Simulate the time units
       while (!maxHeap.isEmpty() || !cooldownQueue.isEmpty()) {
           time++;
           
           if (!maxHeap.isEmpty()) {
               int currentTaskFreq = maxHeap.poll() - 1; // Execute task with max frequency
               
               if (currentTaskFreq > 0) {
                   // Task needs to cool down before re-invoking
                   cooldownQueue.offer(new AbstractMap.SimpleEntry<>(currentTaskFreq, time + n));
               }
           }

           // Step 4: Check cooldown queue if any task is ready to re-enter the max heap
           if (!cooldownQueue.isEmpty() && cooldownQueue.peek().getValue() == time) {
               maxHeap.offer(cooldownQueue.poll().getKey());
           }
       }

       return time;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log k\), where N is the number of tasks and k is the number of unique tasks\.
*   **Space Complexity:** O\(N\), as we are storing the frequencies and cooldown tasks\.

### 2\. Greedy Scheduling with Frequency Calculations

#### **Intuition:**

The most optimal solution to this problem is to directly calculate the least interval based on the required cooling periods and the frequencies of the most often appearing tasks\. We can use a mathematical approach to determine how to place the tasks efficiently\.

1.  **Find Maximum Frequency:** Determine the maximum frequency tasks need to be repeated\.
2.  **Slots Calculation:** Calculate the possible slots needed to place the most frequent tasks and any additional tasks that fit in the gaps\.
3.  **Calculate Idle Units:** Calculate exactly how many idle units are needed after placing other tasks between the maximum frequency tasks\.
4.  **Total Time Calculation:** Determine the total required time by summing filled slots and idle time\.

#### Code:

```java
class Solution {
   public int leastInterval(char[] tasks, int n) {
       int[] frequencies = new int[26];

       // Step 1: Count the frequency of each task
       for (char task : tasks) {
           frequencies[task - 'A']++;
       }

       // Step 2: Find the maximum frequency
       Arrays.sort(frequencies);
       int maxFreq = frequencies[25];
       int maxCount = 0;
       
       for (int freq : frequencies) {
           if (freq == maxFreq) {
               maxCount++;
           }
       }

       // Step 3: Calculate the total intervals
       int partCount = maxFreq - 1;
       int partLength = n - (maxCount - 1);
       int emptySlots = partCount * partLength;
       int availableTasks = tasks.length - maxFreq * maxCount;
       int idles = Math.max(0, emptySlots - availableTasks);

       return tasks.length + idles;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of tasks\.
*   **Space Complexity:** O\(1\), only constant extra space is utilized \(e\.g\. for counting frequencies\)\.

#### [Solve it on LeetCode](https://leetcode.com/problems/task-scheduler)
