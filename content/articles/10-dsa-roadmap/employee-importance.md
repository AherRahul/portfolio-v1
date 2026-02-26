---
title: Employee Importance
description: Master Employee Importance in the Graphs module. Comprehensive
  guide and algorithmic problem solving.
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

You have a data structure of employee information, including the employee's unique ID, importance value, and direct subordinates' IDs\.

You are given an array of employees `employees` where:

*   `employees[i].id` is the ID of the **i****th** employee\.
*   `employees[i].importance` is the importance value of the **i****th** employee\.
*   `employees[i].subordinates` is a list of the IDs of the direct subordinates of the **i****th** employee\.

Given an integer `id` that represents an employee's ID, return _the_ _**total**_ _importance value of this employee and all their direct and indirect subordinates_\.

##### **Example 1:**

**Input:** employees = \[\[1,5,\[2,3\]\],\[2,3,\[\]\],\[3,3,\[\]\]\], id = 1

**Output:** 11

**Explanation:** Employee 1 has an importance value of 5 and has two direct subordinates: employee 2 and employee 3\.

They both have an importance value of 3\.

Thus, the total importance value of employee 1 is 5 \+ 3 \+ 3 = 11\.

##### **Example 2:**

**Input:** employees = \[\[1,2,\[5\]\],\[5,\-3,\[\]\]\], id = 5

**Output:** \-3

**Explanation:** Employee 5 has an importance value of \-3 and has no direct subordinates\.

Thus, the total importance value of employee 5 is \-3\.

##### **Constraints:**

*   `1 <= employees.length <= 2000`
*   `1 <= employees[i].id <= 2000`
*   All `employees[i].id` are **unique**\.
*   `-100 <= employees[i].importance <= 100`
*   One employee has at most one direct leader and may have several subordinates\.
*   The IDs in `employees[i].subordinates` are valid IDs\.

#### [Solve it on LeetCode](https://leetcode.com/problems/employee-importance)

# Approaches

## 1\. Depth\-First Search \(DFS\) Recursion

#### **Intuition:**

The main idea is to recursively calculate the total importance by summing up the importance of the given employee and recursively adding the importance of all subordinates\. We will use a hashmap to quickly access an employee using their id\.

#### **Approach:**

1.  Use a hashmap to store the employee id and the related `Employee` object for quick retrieval\.
2.  Write a recursive helper function `dfs` that takes the id of the employee whose total importance is to be calculated\.
3.  The `dfs` function will retrieve the employee using the hashmap, start the sum with the employee's importance, and recursively add the importance of all subordinates by calling `dfs` for each subordinate id\.
4.  Call the `dfs` function starting with the given employee id\.

#### **Code:**

Complexity Analysis

*   **Time Complexity:** `O(N)`, where `N` is the number of employees\. We visit each employee once\.
*   **Space Complexity:** `O(N)`, due to the recursion stack in the worst case and the space used by the hashmap\.

## 2\. Breadth\-First Search \(BFS\)

#### **Intuition:**

Instead of using recursion, we can implement an iterative version using a queue, which will help us traverse through the employees in a level\-order approach \(breadth\-first search\)\.

#### **Approach:**

1.  Similar to DFS, use a hashmap to store employees by their id for quick access\.
2.  Use a queue to help in the BFS approach, starting by adding the main employee id to the queue\.
3.  While the queue is not empty, get the next id, add its importance, and add all its subordinates to the queue\.
4.  Continue summing up the importance until the queue is empty and return the total importance\.

#### **Code:**

Complexity Analysis

*   **Time Complexity:** `O(N)`, where `N` is the number of employees\. We visit each employee once\.
*   **Space Complexity:** `O(N)`, due to the space used by the hashmap and the queue\.