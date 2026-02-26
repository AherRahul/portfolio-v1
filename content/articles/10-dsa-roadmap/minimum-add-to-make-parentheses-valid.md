---
title: Minimum Add to Make Parentheses Valid
description: Master Minimum Add to Make Parentheses Valid in the Greedy module.
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

A parentheses string is valid if and only if:

*   It is the empty string,
*   It can be written as `AB` \(`A` concatenated with `B`\), where `A` and `B` are valid strings, or
*   It can be written as `(A)`, where `A` is a valid string\.

You are given a parentheses string `s`\. In one move, you can insert a parenthesis at any position of the string\.

*   For example, if `s = "()))"`, you can insert an opening parenthesis to be `"(``**(**``)))"` or a closing parenthesis to be `"())``**)**``)"`\.

Return _the minimum number of moves required to make_ `s` _valid_\.

##### **Example 1:**

**Input:** s = "\(\)\)"

**Output:** 1

##### **Example 2:**

**Input:** s = "\(\(\("

**Output:** 3

##### **Constraints:**

*   `1 <= s.length <= 1000`
*   `s[i]` is either `'('` or `')'`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid)

# Approaches

## 1\. Stack Based Solution

#### **Intuition:**

The problem is to ensure that each open parenthesis '\(' has a corresponding closing parenthesis '\)'\. A simple approach involves using a stack data structure to keep track of unmatched parentheses\. We iterate through the string, pushing open parentheses onto the stack and popping when we encounter a closing parenthesis that matches\. If a closing parenthesis has no matching open parenthesis \(the stack is empty\), it indicates an unmatched closing parenthesis\. By the end of the string traversal, the size of the stack plus any unmatched closing parentheses encountered gives the minimum additions needed to make the string valid\.

#### **Code:**

Java

```java
class Solution {
   public int minAddToMakeValid(String s) {
       Stack<Character> stack = new Stack<>();
       int unmatchedClose = 0;

       for (char c : s.toCharArray()) {
           if (c == '(') {
               stack.push(c);
           } else { // c == ')'
               if (!stack.isEmpty()) {
                   stack.pop();
               } else {
                   unmatchedClose++;
               }
           }
       }

       // Stack contains unmatched open parentheses
       return stack.size() + unmatchedClose;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the input string, since we pass through the string once\.
*   **Space Complexity:** O\(n\), as we may store all the characters in the stack in the worst case\.

## 2\. Counting Unmatched Parentheses

#### **Intuition:**

Instead of using a stack, we can optimize the space by simply counting the number of unmatched open and close parentheses\. We maintain two counters: one for unmatched open parentheses \(`open`\) and another for unmatched closing parentheses \(`close`\)\. As we iterate through the string, for every `(` encountered, we increment the `open` counter\. For every `)`, if there is a corresponding unmatched open parenthesis, we decrement the `open` counter \(effectively "matching" them\)\. Otherwise, we increment the `close` counter indicating an unmatched `)`\.

#### **Code:**

Java

```java
class Solution {
   public int minAddToMakeValid(String s) {
       int open = 0, close = 0;

       for (char c : s.toCharArray()) {
           if (c == '(') {
               open++;
           } else { // c == ')'
               if (open > 0) {
                   open--; // Match the current ')' with a previous '('
               } else {
                   close++; // No matching '(' for this ')'
               }
           }
       }

       // Total unmatched parentheses is sum of unmatched open and close
       return open + close;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the input string, as we scan through the string once\.
*   **Space Complexity:** O\(1\), since we only use a fixed amount of extra space for the `open` and `close` counters\.