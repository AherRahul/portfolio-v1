---
title: Evaluate Reverse Polish Notation
description: Master Evaluate Reverse Polish Notation in the Stacks module.
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

You are given an array of strings `tokens` that represents an arithmetic expression in a [Reverse Polish Notation](http://en.wikipedia.org/wiki/Reverse_Polish_notation)\.

Evaluate the expression\. Return _an integer that represents the value of the expression_\.

**Note** that:

*   The valid operators are `'+'`, `'-'`, `'*'`, and `'/'`\.
*   Each operand may be an integer or another expression\.
*   The division between two integers always **truncates toward zero**\.
*   There will not be any division by zero\.
*   The input represents a valid arithmetic expression in a reverse polish notation\.
*   The answer and all the intermediate calculations can be represented in a **32\-bit** integer\.

##### **Example 1:**

**Input:** tokens = \["2","1","\+","3","\*"\]

**Output:** 9

**Explanation:** \(\(2 \+ 1\) \* 3\) = 9

##### **Example 2:**

**Input:** tokens = \["4","13","5","/","\+"\]

**Output:** 6

**Explanation:** \(4 \+ \(13 / 5\)\) = 6

##### **Example 3:**

**Input:** tokens = \["10","6","9","3","\+","\-11","\*","/","\*","17","\+","5","\+"\]

**Output:** 22

**Explanation:**

##### **Constraints:**

*   **1 <= tokens\.length <= 10****4**
*   `tokens[i]` is either an operator: `"+"`, `"-"`, `"*"`, or `"/"`, or an integer in the range `[-200, 200]`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/evaluate-reverse-polish-notation)

# Approaches

## 1\. Stack\-based Evaluation

#### **Intuition:**

The Reverse Polish Notation \(RPN\) is a mathematical notation in which every operator follows all of its operands\. This makes it very straightforward to evaluate using a stack, as stacks naturally follow the Last\-In\-First\-Out \(LIFO\) principle\.

Traverse the tokens:

*   If the token is a number, push it onto the stack\.
*   If the token is an operator, pop the necessary operands from the stack, perform the operation, and push the result back onto the stack\.

By the end of the process, the stack should contain just one element \- the result of the expression\.

#### **Steps:**

1.  Initialize an empty stack to hold integers\.
2.  Iterate over each token:

*   If it's a number, convert it to an integer and push onto the stack\.
*   If it's an operator \(`+`, `-`, `*`, `/`\), pop the top two operands from the stack, apply the operator, and push the result back onto the stack\.

4.  At the end of iteration, the stack will contain one element which is the result\.

#### **Code:**

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of tokens\. Each token is processed once\.
*   **Space Complexity:** O\(n\), in the worst case, if all tokens are numbers, the stack size could be n\.

View Animation