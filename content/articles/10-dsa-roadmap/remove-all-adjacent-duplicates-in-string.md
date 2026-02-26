---
title: Remove All Adjacent Duplicates In String
description: Master Remove All Adjacent Duplicates In String in the Stacks
  module. Comprehensive guide and algorithmic problem solving.
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

You are given a string `s` consisting of lowercase English letters\. A **duplicate removal** consists of choosing two **adjacent** and **equal** letters and removing them\.

We repeatedly make **duplicate removals** on `s` until we no longer can\.

Return _the final string after all such duplicate removals have been made_\. It can be proven that the answer is **unique**\. 

**Example 1:**

**Input:** s = "abbaca"

**Output:** "ca"

**Explanation:**

For example, in "abbaca" we could remove "bb" since the letters are adjacent and equal, and this is the only possible move\. The result of this move is that the string is "aaca", of which only "aa" is possible, so the final string is "ca"\.

##### **Example 2:**

**Input:** s = "azxxzy"

**Output:** "ay"

##### **Constraints:**

*   **1 <= s\.length <= 10****5**
*   `s` consists of lowercase English letters\.

#### [Solve it on LeetCode](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string)

# Approaches

## 1\. Using a Stack

#### **Intuition:**

The problem requires removal of adjacent duplicates in the given string `s`\. This can be efficiently solved using a stack\. The basic idea is to iterate over each character of the string, and use a stack to keep track of characters, ensuring that whenever two consecutive characters are the same, we pop them from the stack, effectively removing those duplicates\.

#### **Algorithm:**

1.  Initialize an empty stack to store characters\.
2.  Iterate through each character `c` in the string `s`\.
3.  For each character, check if the stack is not empty and the top of the stack is equal to `c`\.

*   If true, pop the top element \(this means we've found a duplicate\)\.
*   Else, push the current character `c` onto the stack\.

5.  Finally, construct the resulting string from the characters left in the stack\.

#### **Code:**

Java

```java
class Solution {
   public String removeDuplicates(String s) {
       // Use a StringBuilder as a stack to keep track of characters
       StringBuilder stack = new StringBuilder();

       // Iterate over each character in the input string
       for (char c : s.toCharArray()) {
           // If the stack is not empty and the last character in the stack is the same as the current one
           if (stack.length() > 0 && stack.charAt(stack.length() - 1) == c) {
               // Pop the character from the stack
               stack.deleteCharAt(stack.length() - 1);
           } else {
               // Push the current character to the stack
               stack.append(c);
           }
       }

       // Return the remaining characters as the result string
       return stack.toString();
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string `s`\. Each character is pushed and popped from the stack at most once\.
*   **Space Complexity:** O\(n\) in the worst case where there are no adjacent duplicates, and the stack contains all characters of the string\.

View Animation