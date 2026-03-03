---
title: Decode String
description: Master Decode String in the Recursion & Backtracking module.
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

Given an encoded string, return its decoded string\.

The encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times\. Note that `k` is guaranteed to be a positive integer\.

You may assume that the input string is always valid; there are no extra white spaces, square brackets are well\-formed, etc\. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, `k`\. For example, there will not be input like `3a` or `2[4]`\.

The test cases are generated so that the length of the output will never exceed `10``5`\.

##### **Example 1:**

**Input:** s = "3\[a\]2\[bc\]"

**Output:** "aaabcbc"

##### **Example 2:**

**Input:** s = "3\[a2\[c\]\]"

**Output:** "accaccacc"

##### **Example 3:**

**Input:** s = "2\[abc\]3\[cd\]ef"

**Output:** "abcabccdcdcdef"

##### **Constraints:**

*   `1 <= s.length <= 30`
*   `s` consists of lowercase English letters, digits, and square brackets `'[]'`\.
*   `s` is guaranteed to be **a valid** input\.
*   All the integers in `s` are in the range `[1, 300]`\.


## Approaches

### 1\. Recursive Approach

#### **Intuition:**

In this approach, we use recursion to decode the string\. The idea is to iterate through the string and whenever an opening bracket '\[' is encountered, we recursively decode the string within the brackets and repeat it the specified number of times\. This is tracked via a counter\. Each recursive call handles a part of the string enclosed in square brackets\.

#### **Steps:**

1.  Initialize a global index to track the position in the string\.
2.  Iterate over the string and for each character:

*   If it's a digit, build the multiplier \(k=2 or 12, etc\.\)\.
*   If it's '\[', recursively decode the substring that follows\.
*   If it’s '\]', return the accumulated string up to this point\.
*   If it's a letter, append it to the result string\.

4.  This approach is accomplished by a helper method that performs the recursion and returns the decoded substring\.

#### **Code:**

```java
class Solution {
   private int index = 0; // Global index for tracking current position
   
   public String decodeString(String s) {
       StringBuilder result = new StringBuilder();
       
       // Iterate and process until end of the string or ']' is encountered
       while (index < s.length() && s.charAt(index) != ']') {
           char currentChar = s.charAt(index);
           if (Character.isDigit(currentChar)) {
               int k = 0;
               
               // Decode the multiplier
               while (index < s.length() && Character.isDigit(s.charAt(index))) {
                   k = k * 10 + (s.charAt(index) - '0');
                   index++;
               }
               
               // Encounter '[', move past it
               index++;
               String decodedSubstring = decodeString(s);
               
               // Repeat the decoded string as required by k
               while (k > 0) {
                   result.append(decodedSubstring);
                   k--;
               }
               
               // At this point the index would have moved past ']'
               index++; // Move past ']'

           } else {
               // Add letters directly to the result
               result.append(currentChar);
               index++;
           }
       }
       
       return result.toString();
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string\. Each character is processed once\.
*   **Space Complexity:** O\(n\), used for the recursion stack and output string\.

### 2\. Iterative Approach using Stacks

#### **Intuition:**

Instead of using recursion, you can use stacks to simulate the process\. Use two stacks: one to store numbers \(multiplier\) and another to store current encoded string segments\. Traverse through the string, upon encountering '\[', push the current result and multiplier onto the stacks and reset them\. When '\]' is encountered, pop from the stacks to get the last string and multiplier, concatenate the result\.

#### **Steps:**

1.  Traverse through the input string and perform the following:

*   If a number is found, compute the full number \(multiplier\) using a loop\.
*   If '\[', push the current string and multiplier on stacks\.
*   If '\]', pop from the stacks and append the current string\.
*   If it's a character, append it to the current result string\.

3.  Concatenate results as needed upon encountering '\]' and continue until end\.

#### **Code:**

```java
class Solution {
   public String decodeString(String s) {
       Stack<Integer> countStack = new Stack<>();
       Stack<String> resultStack = new Stack<>();
       
       StringBuilder currentString = new StringBuilder();
       int index = 0, k = 0;
       
       while (index < s.length()) {
           char currentChar = s.charAt(index);
           
           if (Character.isDigit(currentChar)) {
               // Decode multiplier
               k = 0;
               while (index < s.length() && Character.isDigit(s.charAt(index))) {
                   k = k * 10 + (s.charAt(index) - '0');
                   index++;
               }
               
           } else if (currentChar == '[') {
               // Push current state to stacks
               countStack.push(k);
               resultStack.push(currentString.toString());
               
               // Reset for next encoded string segment
               currentString = new StringBuilder();
               k = 0;
               index++;
               
           } else if (currentChar == ']') {
               // Repeat and append decoded string
               StringBuilder temp = new StringBuilder(resultStack.pop());
               
               int repeatTimes = countStack.pop();
               for (int i = 0; i < repeatTimes; i++) {
                   temp.append(currentString);
               }
               
               // Current string becomes updated string so far
               currentString = temp;
               index++;
               
           } else {
               // Collect characters to current string
               currentString.append(currentChar);
               index++;
           }
       }
       
       return currentString.toString();
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string\. Each character is processed once\.
*   **Space Complexity:** O\(n\), for the stacks and output string\.

#### [Solve it on LeetCode](https://leetcode.com/problems/decode-string)
