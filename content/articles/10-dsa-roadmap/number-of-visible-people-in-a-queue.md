---
title: Number of Visible People in a Queue
description: Master Number of Visible People in a Queue in the Stacks module.
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

There are `n` people standing in a queue, and they numbered from `0` to `n - 1` in **left to right** order\. You are given an array `heights` of **distinct** integers where `heights[i]` represents the height of the `i``th` person\.

A person can **see** another person to their right in the queue if everybody in between is **shorter** than both of them\. More formally, the `i``th` person can see the `j``th` person if `i < j` and `min(heights[i], heights[j]) > max(heights[i+1], heights[i+2], ..., heights[j-1])`\.

Return _an array_ `answer` _of length_ `n` _where_ `answer[i]` _is the_ _**number of people**_ _the_ `i``th` _person can_ _**see**_ _to their right in the queue_\. 

##### **Example 1:**

**Input:** heights = \[10,6,8,5,11,9\]

**Output:** \[3,1,2,1,1,0\]

**Explanation:**

Person 0 can see person 1, 2, and 4\.

Person 1 can see person 2\.

Person 2 can see person 3 and 4\.

Person 3 can see person 4\.

Person 4 can see person 5\.Person 5 can see no one since nobody is to the right of them\.

##### **Example 2:**

**Input:** heights = \[5,1,2,3,10\]

**Output:** \[4,1,1,1,0\]

##### **Constraints:**

*   **n == heights\.length**
*   **1 <= n <= 10****5**
*   **1 <= heights\[i\] <= 10****5**
*   All the values of `heights` are **unique**\.

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-visible-people-in-a-queue)

# Approaches

## 1\. Brute Force

#### Intuition:

The simplest way to solve this problem is to use a double loop\. For each person in the queue, we can look at each subsequent person and determine if they're visible\. A person is visible if all the people between them and the current person in the focus are shorter\. Once we find a taller person, all subsequent people are not visible\.

#### Algorithm:

1.  Initialize an array `result` to store the number of visible people for each person in the queue\.
2.  For each person in the queue located at index `i`, look at each subsequent person `j` \(where `j > i`\)\.
3.  If the person at `j` is taller than the person at `i`, they are visible, and we can break out of the loop since no one beyond them can be visible to person `i`\.
4.  Continue counting visible people for person `i` until a taller person is encountered\.
5.  Repeat for all people in the queue\.

#### Code:

Java

```java
class Solution {
   public int[] canSeePersonsCount(int[] heights) {
       int n = heights.length;
       int[] result = new int[n];

       // Loop through each person in the queue
       for (int i = 0; i < n; i++) {
           int count = 0;
           // Check visibility with each subsequent person
           for (int j = i + 1; j < n; j++) {
               if (heights[j] > heights[i]) {
                   count++;
                   break;  // A taller person, stop counting further
               }
               count++;
           }
           result[i] = count;  // Store the number of visible people
       }

       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\), where n is the number of people in the queue\. We use a double loop to check visibility\.
*   **Space Complexity:** O\(1\) extra space, apart from the output array `result`\.

## 2\. Monotonic Stack

#### Intuition:

To reduce the time complexity, we can use a stack to maintain a list of indices\. This stack helps us efficiently track the tallest visible people as we traverse the queue from right to left\. By using a stack, we can keep removing shorter people who are no longer visible whenever we encounter a taller person farther in the queue\.

#### Algorithm:

1.  Initialize a stack to keep indices and an array `result` to store answer\.
2.  Traverse the queue from right to left\.
3.  For each person encountered:

*   Pop persons from the stack while the current person is taller, since they won't be visible anymore\.
*   Count the popped persons as visible\.
*   If the stack isn't empty, it means there's a person who is taller than the current one, making them visible as well\.
*   Push the current person's index onto the stack\.

5.  Repeat until the whole queue is processed\.

#### Code:

Java

```java
class Solution {
   public int[] canSeePersonsCount(int[] heights) {
       int n = heights.length;
       int[] result = new int[n];
       Stack<Integer> stack = new Stack<>();

       // Traverse the queue from right to left
       for (int i = n - 1; i >= 0; i--) {
           int visibleCount = 0;

           // Remove people who are shorter and therefore not visible
           while (!stack.isEmpty() && heights[i] > heights[stack.peek()]) {
               stack.pop();
               visibleCount++;
           }

           // If any people remain, the current person's view will also include the next taller person
           if (!stack.isEmpty()) {
               visibleCount++;
           }
           
           result[i] = visibleCount;  // Store result for current person
           stack.push(i);  // Add current person to stack
       }

       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of people in the queue\. Each person is pushed and popped from the stack at most once\.
*   **Space Complexity:** O\(n\), for the stack that keeps track of indices\.

View Animation