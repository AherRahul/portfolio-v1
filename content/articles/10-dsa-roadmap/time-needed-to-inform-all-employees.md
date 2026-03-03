---
title: Time Needed to Inform All Employees
description: Master Time Needed to Inform All Employees in the Graphs module.
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

A company has `n` employees with a unique ID for each employee from `0` to `n - 1`\. The head of the company is the one with `headID`\.

Each employee has one direct manager given in the `manager` array where `manager[i]` is the direct manager of the `i-th` employee, `manager[headID] = -1`\. Also, it is guaranteed that the subordination relationships have a tree structure\.

The head of the company wants to inform all the company employees of an urgent piece of news\. He will inform his direct subordinates, and they will inform their subordinates, and so on until all employees know about the urgent news\.

The `i-th` employee needs `informTime[i]` minutes to inform all of his direct subordinates \(i\.e\., After informTime\[i\] minutes, all his direct subordinates can start spreading the news\)\.

Return _the number of minutes_ needed to inform all the employees about the urgent news\.

#### **Example 1:**

**Input:** n = 1, headID = 0, manager = \[\-1\], informTime = \[0\]

**Output:** 0

**Explanation:** The head of the company is the only employee in the company\.

##### **Example 2:**

**Input:** n = 6, headID = 2, manager = \[2,2,\-1,2,2,2\], informTime = \[0,0,1,0,0,0\]

**Output:** 1

**Explanation:** The head of the company with id = 2 is the direct manager of all the employees in the company and needs 1 minute to inform them all\.The tree structure of the employees in the company is shown\.

##### **Constraints:**

*   **1 <= n <= 10****5**
*   **0 <= headID < n**
*   **manager\.length == n**
*   **0 <= manager\[i\] < n**
*   **manager\[headID\] == \-1**
*   **informTime\.length == n**
*   **0 <= informTime\[i\] <= 1000**
*   `informTime[i] == 0` if employee `i` has no subordinates\.
*   It is **guaranteed** that all the employees can be informed\.


## Approaches

### 1\. BFS

#### **Intuition:**

Convert the organizational structure into a tree where each node represents an employee\. The CEO's id is `headID`\. Using a Breadth First Search \(BFS\), calculate the total time needed for all direct and indirect employees to receive the information from the CEO\.

In a BFS approach, we use a queue to traverse each level of the organization, propagating the information and accumulating the time needed\.

#### **Steps:**

1.  Create a list of lists where `subordinates[i]` holds all employees directly reporting to employee `i`\.
2.  Initialize a queue and start from the head of the organization \(CEO\)\.
3.  At each employee, traverse their subordinates, adding the time taken to fetch the information and update the maximum time needed\.

#### Code:

```java
class Solution {
   public int numOfMinutes(int n, int headID, int[] manager, int[] informTime) {
       // Build the tree structure of employees
       List<List<Integer>> subordinates = new ArrayList<>();
       for (int i = 0; i < n; i++) {
           subordinates.add(new ArrayList<>());
       }
       for (int i = 0; i < n; i++) {
           if (manager[i] != -1) {
               subordinates.get(manager[i]).add(i);
           }
       }
       
       Queue<int[]> queue = new LinkedList<>();
       queue.offer(new int[] {headID, 0});
       int maxTime = 0;
       
       // Begin BFS
       while (!queue.isEmpty()) {
           int[] current = queue.poll();
           int currentId = current[0];
           int currentTime = current[1];
           maxTime = Math.max(maxTime, currentTime);
           
           // Traverse subordinates
           for (int sub : subordinates.get(currentId)) {
               queue.offer(new int[] {sub, currentTime + informTime[currentId]});
           }
       }
       return maxTime;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of employees since each employee is visited once\.
*   **Space Complexity:** O\(N\) for storing the subordinates list and the queue\.

### 2\. DFS

#### **Intuition:**

Similar to BFS, DFS also helps us traverse the structure of employees, but instead of using a queue, we use recursion\. For each employee, we traverse deeper into their subordinates before moving on to the next sibling\.

#### **Steps:**

1.  Build a tree representation using adjacency lists for subordinates\.
2.  Use DFS to recursively traverse from the head of the organization\.
3.  At each recursive call, add the inform time particular to an employee and update the maximum time\.

#### Code:

```java
class Solution {
   int maxTime = 0;
   
   public int numOfMinutes(int n, int headID, int[] manager, int[] informTime) {
       // Build the tree structure of employees
       List<List<Integer>> subordinates = new ArrayList<>();
       for (int i = 0; i < n; i++) {
           subordinates.add(new ArrayList<>());
       }
       for (int i = 0; i < n; i++) {
           if (manager[i] != -1) {
               subordinates.get(manager[i]).add(i);
           }
       }

       // Call DFS from the head of the organization
       dfs(headID, 0, subordinates, informTime);
       return maxTime;
   }
   
   private void dfs(int currentId, int currentTime, List<List<Integer>> subordinates, int[] informTime) {
       // Update maxTime
       maxTime = Math.max(maxTime, currentTime);
       
       // Depth-first search into subordinates
       for (int sub : subordinates.get(currentId)) {
           dfs(sub, currentTime + informTime[currentId], subordinates, informTime);
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), since each employee is visited once\.
*   **Space Complexity:** O\(N\), which is the recursion stack depth in the worst case\.

### 3\. DFS with Memoization

#### **Intuition:**

This approach recognizes that a problem needs to calculate the time involved recursively but instead of recalculating the time each time, it stores \(memoizes\) the computed time for each employee to save computational steps\.

#### **Steps:**

1.  Same as previous DFS approach, but maintain a memoization array to store the time required to inform each subtree\.
2.  Benefits arise when subtrees are visited multiple times through different paths\.

#### Code:

```java
class Solution {
   public int numOfMinutes(int n, int headID, int[] manager, int[] informTime) {
       List<List<Integer>> subordinates = new ArrayList<>();
       for (int i = 0; i < n; i++) {
           subordinates.add(new ArrayList<>());
       }
       for (int i = 0; i < n; i++) {
           if (manager[i] != -1) {
               subordinates.get(manager[i]).add(i);
           }
       }

       int[] memo = new int[n];
       Arrays.fill(memo, -1);

       return dfs(headID, subordinates, informTime, memo);
   }
   
   private int dfs(int currentId, List<List<Integer>> subordinates, int[] informTime, int[] memo) {
       if (memo[currentId] != -1) {
           return memo[currentId];
       }

       int max = 0;
       for (int sub : subordinates.get(currentId)) {
           max = Math.max(max, dfs(sub, subordinates, informTime, memo));
       }
       
       memo[currentId] = informTime[currentId] + max;
       return memo[currentId];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), as we compute each subtree's time once\.
*   **Space Complexity:** O\(N\), owing to recursion space and additional space for the memo array\.

#### [Solve it on LeetCode](https://leetcode.com/problems/time-needed-to-inform-all-employees)
