---
title: N-Queens
description: Master N-Queens in the Recursion & Backtracking module.
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

The **n\-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other\.

Given an integer `n`, return _all distinct solutions to the_ _**n\-queens puzzle**_\. You may return the answer in **any order**\.

Each solution contains a distinct board configuration of the n\-queens' placement, where `'Q'` and `'.'` both indicate a queen and an empty space, respectively\.

##### **Example 1:**

**Input:** n = 4

**Output:** \[\["\.Q\.\.","\.\.\.Q","Q\.\.\.","\.\.Q\."\],\["\.\.Q\.","Q\.\.\.","\.\.\.Q","\.Q\.\."\]\]

**Explanation:** There exist two distinct solutions to the 4\-queens puzzle as shown above

##### **Example 2:**

**Input:** n = 1

**Output:** \[\["Q"\]\]

##### **Constraints:**

*   `1 <= n <= 9`

#### [Solve it on LeetCode](https://leetcode.com/problems/n-queens)

# Approaches

## 1\. Backtracking Approach

The N\-Queens problem is a classic problem that can be solved using a backtracking approach\. The main idea is to place queens one by one in different rows, starting from the first row\. When placing a queen in a particular row, we must ensure that it does not attack any other previously placed queens\. For this, we can use three sets to track the columns and two diagonals \(positive and negative diagonals\)\.

#### Intuition:

*   Use a recursive function to place queens row by row\.
*   For each row, try placing the queen in each column and check if it leads to a valid solution\.
*   Use three sets to track if a queen is already placed in a column, positive diagonal, or negative diagonal\.
*   If we reach the last row and place all the queens successfully, add the board configuration to the result list\.
*   Backtrack: If placing a queen in a certain position doesn't lead to a solution, remove the queen \(backtrack\) and try the next position\.

#### Code:

Java

```java
class Solution {
   public List<List<String>> solveNQueens(int n) {
       List<List<String>> results = new ArrayList<>();
       Set<Integer> cols = new HashSet<>(); // To check if a column already has a queen
       Set<Integer> posDiags = new HashSet<>(); // (r + c) for positive diagonals
       Set<Integer> negDiags = new HashSet<>(); // (r - c) for negative diagonals
       char[][] board = new char[n][n]; // To store the current board configuration
       
       for (int i = 0; i < n; i++) {
           Arrays.fill(board[i], '.'); // Fill board with '.'
       }
       
       backtrack(0, cols, posDiags, negDiags, board, results, n);
       return results;
   }

   private void backtrack(int row, Set<Integer> cols, Set<Integer> posDiags, Set<Integer> negDiags,
                          char[][] board, List<List<String>> results, int n) {
       if (row == n) {
           results.add(construct(board)); // Add the constructed board to results
           return;
       }
       
       for (int col = 0; col < n; col++) {
           int posDiag = row + col;
           int negDiag = row - col;

           // Check if current position is under attack
           if (cols.contains(col) || posDiags.contains(posDiag) || negDiags.contains(negDiag)) {
               continue; // Position is not safe, move to next
           }

           // Place the queen
           cols.add(col);
           posDiags.add(posDiag);
           negDiags.add(negDiag);
           board[row][col] = 'Q';
           
           // Move to the next row
           backtrack(row + 1, cols, posDiags, negDiags, board, results, n);
           
           // Remove the queen (backtrack)
           cols.remove(col);
           posDiags.remove(posDiag);
           negDiags.remove(negDiag);
           board[row][col] = '.';
       }
   }

   private List<String> construct(char[][] board) {
       List<String> path = new ArrayList<>();
       for (char[] chars : board) {
           path.add(new String(chars)); // Convert char array to string
       }
       return path;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\!\) \- In the worst\-case scenario, every queen has N possible options to place\.
*   **Space Complexity:** O\(N\) \- Used for storing the sets and board state\.

## 2\. Optimized Backtracking with Bitmasking

For an even more optimized approach, we can use bitmasking to manage the columns and diagonals\. This reduces the overhead of using sets and improves lookup times to constant\.

#### Intuition:

*   Use bitmask integers to represent the columns, positive diagonals, and negative diagonals\.
*   The idea is similar to the above approach but uses bit manipulation for checking and setting the states of columns and diagonals\.

#### Code:

Java

```java
class Solution {
   public List<List<String>> solveNQueens(int n) {
       List<List<String>> results = new ArrayList<>();
       char[][] board = new char[n][n];
       
       for (int i = 0; i < n; i++) {
           Arrays.fill(board[i], '.');
       }
       
       backtrack(0, 0, 0, 0, board, results, n);
       return results;
   }

   private void backtrack(int row, int cols, int posDiags, int negDiags, char[][] board, List<List<String>> results, int n) {
       if (row == n) {
           results.add(construct(board));
           return;
       }

       for (int col = 0; col < n; col++) {
           int currentCol = 1 << col;
           int currentPosDiag = 1 << (row + col);
           int currentNegDiag = 1 << (row - col + n - 1);

           if ((cols & currentCol) != 0 || (posDiags & currentPosDiag) != 0 || (negDiags & currentNegDiag) != 0) {
               continue;
           }

           board[row][col] = 'Q';
           backtrack(row + 1, cols | currentCol, posDiags | currentPosDiag, negDiags | currentNegDiag, board, results, n);
           board[row][col] = '.';
       }
   }

   private List<String> construct(char[][] board) {
       List<String> path = new ArrayList<>();
       for (char[] chars : board) {
           path.add(new String(chars));
       }
       return path;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\!\) \- Similar to the traditional approach due to the nature of backtracking\.
*   **Space Complexity:** O\(N\) \- Used for storing the board state only as sets are replaced by integers\.