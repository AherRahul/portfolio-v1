---
title: Generate Parentheses
description: Master Generate Parentheses in the Recursion & Backtracking module.
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

Given `n` pairs of parentheses, write a function to _generate all combinations of well\-formed parentheses_\.

##### **Example 1:**

**Input:** n = 3

**Output:** \["\(\(\(\)\)\)","\(\(\)\(\)\)","\(\(\)\)\(\)","\(\)\(\(\)\)","\(\)\(\)\(\)"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">((()))</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">(()())</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">(())()</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">()(())</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">()()()</span></div>
  </div>
</div>

##### **Example 2:**

**Input:** n = 1

**Output:** \["\(\)"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">()</span></div>
  </div>
</div>

##### **Constraints:**

*   `1 <= n <= 8`


## Approaches

### 1\. Recursive Approach

#### **Intuition:**

The problem asks us to generate all combinations of well\-formed parentheses for a given number n, where n denotes the number of pairs of parentheses\. A recursive approach can be used by considering two main constraints:

*   The number of '\(' should be less than or equal to n\.
*   The number of '\)' should be less than or equal to the number of '\('\.

This approach uses a helper function to form parentheses while adhering to these constraints\.

#### **Steps:**

1.  Define a helper function that takes the current string, the number of open parentheses, the number of close parentheses, and the result list\.
2.  If the current string's length is equal to 2 \* n, add the current string to the result list since we have a valid combination\.
3.  If the number of open parentheses is less than n, append '\(' to the current string and recursively call the helper function\.
4.  If the number of close parentheses is less than the number of open parentheses, append '\)' to the current string and recursively call the helper function\.

#### Code:

```java
class Solution {
   public List<String> generateParenthesis(int n) {
       List<String> result = new ArrayList<>();
       generate(result, "", n, 0, 0);
       return result;
   }
   
   private void generate(List<String> result, String current, int n, int open, int close) {
       // If the constructed string has reached the maximum possible length
       if (current.length() == n * 2) {
           result.add(current);
           return;
       }
       
       // Add an open parenthesis if we can
       if (open < n) {
           generate(result, current + "(", n, open + 1, close);
       }
       
       // Add a closing parenthesis if we can
       if (close < open) {
           generate(result, current + ")", n, open, close + 1);
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(4^n / √n\) \- This complexity is derived from the nth Catalan number, which is asymptotically equivalent to 4^n / √n\.
*   **Space Complexity:** O\(n\) \- The recursive stack has at most n stacks due to the maximum depth of recursion for valid combinations\.

### 2\. Backtracking Approach

#### **Intuition:**

Backtracking is a smart way of pruning unnecessary paths early\. This approach is similar to the recursive solution but takes advantage of backtracking by maintaining the valid string generation condition\. We use an accumulator to build partial solutions and explore candidates\.

#### **Steps:**

1.  Use a backtrack function to handle the creation of each string\.
2.  At every call, utilize auxiliary variables to ensure the number of opening and closing brackets adheres to the constraints\.
3.  Build the string incrementally and choose to either continue adding '\(' or '\)'\.
4.  Whenever the conditions are violated, undo the previous step and attempt the next candidate\.

#### Code:

```java
class Solution {
   public List<String> generateParenthesis(int n) {
       List<String> result = new ArrayList<>();
       backtrack(result, new StringBuilder(), 0, 0, n);
       return result;
   }

   private void backtrack(List<String> result, StringBuilder current, int open, int close, int max) {
       // If the current string represents a valid combination
       if (current.length() == max * 2) {
           result.add(current.toString());
           return;
       }

       // Try to add '(' and backtrack
       if (open < max) {
           current.append('(');
           backtrack(result, current, open + 1, close, max);
           current.deleteCharAt(current.length() - 1); // Undo the last step (backtrack)
       }

       // Try to add ')' and backtrack
       if (close < open) {
           current.append(')');
           backtrack(result, current, open, close + 1, max);
           current.deleteCharAt(current.length() - 1); // Undo the last step (backtrack)
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** Same as the recursive approach O\(4^n / √n\)
*   **Space Complexity:** O\(n\) space due to recursion stack\.

#### [Solve it on LeetCode](https://leetcode.com/problems/generate-parentheses)
