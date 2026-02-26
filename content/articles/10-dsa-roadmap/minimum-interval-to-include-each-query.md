---
title: Minimum Interval to Include Each Query
description: Master Minimum Interval to Include Each Query in the Advanced
  Topics module. Comprehensive guide and algorithmic problem solving.
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

You are given a 2D integer array `intervals`, where **intervals\[i\] = \[left****i****, right****i****\]** describes the **i****th** interval starting at **left****i** and ending at `right``i` **\(inclusive\)**\. The **size** of an interval is defined as the number of integers it contains, or more formally **right****i** **\- left****i** **\+ 1**\.

You are also given an integer array `queries`\. The answer to the **j****th** query is the **size of the smallest interval** `i` such that **left****i** **<= queries\[j\] <= right****i**\. If no such interval exists, the answer is `-1`\.

Return _an array containing the answers to the queries_\.

##### **Example 1:**

**Input:** intervals = \[\[1,4\],\[2,4\],\[3,6\],\[4,4\]\], queries = \[2,3,4,5\]

**Output:** \[3,3,1,4\]

**Explanation:** The queries are processed as follows:

\- Query = 2: The interval \[2,4\] is the smallest interval containing 2\. The answer is 4 \- 2 \+ 1 = 3\.

\- Query = 3: The interval \[2,4\] is the smallest interval containing 3\. The answer is 4 \- 2 \+ 1 = 3\.

\- Query = 4: The interval \[4,4\] is the smallest interval containing 4\. The answer is 4 \- 4 \+ 1 = 1\.

\- Query = 5: The interval \[3,6\] is the smallest interval containing 5\. The answer is 6 \- 3 \+ 1 = 4\.

##### **Example 2:**

**Input:** intervals = \[\[2,3\],\[2,5\],\[1,8\],\[20,25\]\], queries = \[2,19,5,22\]

**Output:** \[2,\-1,4,6\]

**Explanation:** The queries are processed as follows:

\- Query = 2: The interval \[2,3\] is the smallest interval containing 2\. The answer is 3 \- 2 \+ 1 = 2\.

\- Query = 19: None of the intervals contain 19\. The answer is \-1\.

\- Query = 5: The interval \[2,5\] is the smallest interval containing 5\. The answer is 5 \- 2 \+ 1 = 4\.

\- Query = 22: The interval \[20,25\] is the smallest interval containing 22\. The answer is 25 \- 20 \+ 1 = 6\. 

##### **Constraints:**

*   **1 <= intervals\.length <= 10****5**
*   **1 <= queries\.length <= 10****5**
*   **intervals\[i\]\.length == 2**
*   **1 <= left****i** **<= right****i** **<= 10****7**
*   **1 <= queries\[j\] <= 10****7**

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-interval-to-include-each-query)

# Approaches

## 1\. Brute Force

#### Intuition:

In the brute force approach, we will iterate over each query and for each query, traverse through all the intervals to check which interval can contain the query, then select the smallest interval among those that can accommodate the query\.

#### Steps:

1.  For each query, iterate through each interval\.
2.  For each query, find all intervals \[start, end\] where `start <= query <= end`\.
3.  Out of these suitable intervals, select the interval of minimum length `(end - start + 1)`\.
4.  Store the result for each query\.

#### Code:

Complexity Analysis

*   **Time Complexity:** O\(n \* m\), where n is the number of queries and m is the number of intervals\.
*   **Space Complexity:** O\(1\), as we are using a fixed amount of space regardless of input size\.

## 2\. Sorting and Two Pointers with Priority Queue

#### Intuition:

The brute force solution is not efficient enough for larger inputs\. To optimize, we can use a combination of sorting and priority queue:

*   Sort the intervals and queries\.
*   Use a priority queue to keep track of interval sizes as we move through the intervals and handle queries\.

#### Steps:

1.  Sort intervals by their start points\.
2.  Sort queries along with their indices so that we can retrieve the result in original order\.
3.  Use a min\-heap \(priority queue\) to store intervals based on their end points while processing queries\.
4.  For each query, filter intervals that can cover the query and add them to the priority queue\.
5.  Remove the intervals from the priority queue which can no longer cover future queries\.
6.  The smallest element in the priority queue will be the minimum interval for the current query\.

#### Code:

#### Complexity Analysis:

*   **Time Complexity:** \(O\(m \+ n\) log m\), where n is the number of queries and m is the number of intervals\. This includes sorting intervals, queries and operations related to priority queue\.
*   **Space Complexity:** O\(m\), for storing intervals that are currently being considered in the priority queue\.