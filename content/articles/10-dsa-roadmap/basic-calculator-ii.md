---
title: Basic Calculator II
description: Master Basic Calculator II in the Stacks module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a string `s` which represents an expression, _evaluate this expression and return its value_\. 

The integer division should truncate toward zero\.

You may assume that the given expression is always valid\. All intermediate results will be in the range of **\[\-2****31****, 2****31** **\- 1\]**\.

**Note:** You are not allowed to use any built\-in function which evaluates strings as mathematical expressions, such as `eval()`\. 

##### **Example 1:**

**Input:** s = "3\+2\*2"

**Output:** 7

##### **Example 2:**

**Input:** s = " 3/2 "

**Output:** 1

##### **Example 3:**

**Input:** s = " 3\+5 / 2 "

**Output:** 5

##### **Constraints:**

*   **1 <= s\.length <= 3 \* 10****5**
*   `s` consists of integers and operators `('+', '-', '*', '/')` separated by some number of spaces\.
*   `s` represents **a valid expression**\.
*   All the integers in the expression are non\-negative integers in the range **\[0, 2****31** **\- 1\]**\.
*   The answer is **guaranteed** to fit in a **32\-bit integer**\.


## Approaches

### 1\. Two Stacks

#### Intuition:

The problem requires us to evaluate a string containing a mathematical expression with `+`, `-`, `*`, and `/`\. A straightforward approach is to use two stacks: one for numbers and another for operators\. This is similar to the standard method used for evaluating expressions\.

#### Steps:

1.  Use two stacks: one for operands \(numbers\) and one for operators\.
2.  Traverse each character in the string:

*   If it's a digit, build the number\.
*   If it's an operator, push the current number to the operands stack, then push the operator to the operators stack\.
*   Evaluate whenever necessary \(`*` and `/` have higher precedence\)\.

4.  Pop remaining operators and operands to calculate the result using a simple post\-fix evaluation\.
5.  Return the result\.

#### Code:

```java
class BasicCalculatorII {
   public int calculate(String s) {
       if (s == null || s.length() == 0) return 0;

       Stack<Integer> operands = new Stack<>();
       Stack<Character> operators = new Stack<>();

       char[] chars = s.toCharArray();
       int num = 0;
       char lastSign = '+';

       for (int i = 0; i < chars.length; i++) {
           char c = chars[i];
           if (Character.isDigit(c)) {
               num = num * 10 + (c - '0');
           }
           if (!Character.isDigit(c) && c != ' ' || i == chars.length - 1) {
               if (lastSign == '+') {
                   operands.push(num);
               } else if (lastSign == '-') {
                   operands.push(-num);
               } else {
                   int top = operands.pop();
                   if (lastSign == '*') {
                       operands.push(top * num);
                   } else if (lastSign == '/') {
                       operands.push(top / num);
                   }
               }
               lastSign = c;
               num = 0;
           }
       }

       int result = 0;
       for (int number : operands) {
           result += number;
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string\.
*   **Space Complexity:** O\(n\), due to the space used by the stacks\.

### 2\. One Stack

#### Intuition:

By recognizing the fact that `*` and `/` operations are executed immediately and have higher precedence, we can simplify our approach by using only one stack\. We can optimize by directly evaluating the immediate `*` and `/` results on the numbers residing in the stack\.

#### Steps:

1.  Initialize one stack to store evaluated values\.
2.  Traverse the string similarly and calculate results on the fly based on operator priorities\.
3.  Append intermediate results computed by `*` and `/` into the stack\.
4.  Sum up the stack to get the final result\.

#### Code:

```java
class BasicCalculatorII {
   public int calculate(String s) {
       if (s == null || s.length() == 0) return 0;

       Stack<Integer> stack = new Stack<>();
       int num = 0;
       char lastSign = '+';
       
       for (int i = 0; i < s.length(); i++) {
           char c = s.charAt(i);
           if (Character.isDigit(c)) {
               num = num * 10 + (c - '0');
           }
           if (!Character.isDigit(c) && c != ' ' || i == s.length() - 1) {
               if (lastSign == '+') {
                   stack.push(num);
               } else if (lastSign == '-') {
                   stack.push(-num);
               } else if (lastSign == '*') {
                   stack.push(stack.pop() * num);
               } else if (lastSign == '/') {
                   stack.push(stack.pop() / num);
               }
               lastSign = c;
               num = 0;
           }
       }
       
       int result = 0;
       for (int number : stack) {
           result += number;
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string\.
*   **Space Complexity:** O\(n\), due to the space used by the stack\.

### 3\. In\-Place Calculation Using Single Pass and Single Stack

#### Intuition:

We can make this more efficient by minimizing stack use to only necessary intermediate results\. We can modify the processed result in place using a single pass through the string\. By evaluating high\-priority operations as soon as possible, only results of addition/subtraction need to be stored\.

#### Steps:

1.  Use a single stack to store previous evaluated results and only nums needed for adjusting the result from unfinished operations when needed\.
2.  Track running total adjusted with prior operations\.
3.  Evaluate high\-precedence operations \(`*`, `/`\) immediately and push intermediate results into the stack\.
4.  Perform addition and subtraction on accumulated results from the stack at the end\.

#### Code:

```java
class BasicCalculatorII {
   public int calculate(String s) {
       int num = 0;
       char lastSign = '+';
       int lastNumber = 0;
       int result = 0;

       for (int i = 0; i < s.length(); i++) {
           char c = s.charAt(i);
           if (Character.isDigit(c)) {
               num = num * 10 + (c - '0');
           }
           if (!Character.isDigit(c) && c != ' ' || i == s.length() - 1) {
               if (lastSign == '+') {
                   result += lastNumber;
                   lastNumber = num;
               } else if (lastSign == '-') {
                   result += lastNumber;
                   lastNumber = -num;
               } else if (lastSign == '*') {
                   lastNumber = lastNumber * num;
               } else if (lastSign == '/') {
                   lastNumber = lastNumber / num;
               }
               lastSign = c;
               num = 0;
           }
       }
       
       result += lastNumber;
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string\.
*   **Space Complexity:** O\(1\), due to constant space use\.

#### [Solve it on LeetCode](https://leetcode.com/problems/basic-calculator-ii)
