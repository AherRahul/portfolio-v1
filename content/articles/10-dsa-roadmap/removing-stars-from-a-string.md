---
title: Removing Stars From a String
description: Master Removing Stars From a String in the Stacks module.
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

You are given a string `s`, which contains stars `*`\.

In one operation, you can:

*   Choose a star in `s`\.
*   Remove the closest **non\-star** character to its **left**, as well as remove the star itself\.

Return _the string after_ _**all**_ _stars have been removed_\.

**Note:**

*   The input will be generated such that the operation is always possible\.
*   It can be shown that the resulting string will always be unique\. 

##### **Example 1:**

**Input:** s = "leet\*\*cod\*e"

**Output:** "lecoe"

**Explanation:** Performing the removals from left to right:

\- The closest character to the 1st star is 't' in "lee**t**\*\*cod\*e"\. s becomes "lee\*cod\*e"\.

\- The closest character to the 2nd star is 'e' in "le**e**\*cod\*e"\. s becomes "lecod\*e"\.

\- The closest character to the 3rd star is 'd' in "leco**d**\*e"\. s becomes "lecoe"\.

There are no more stars, so we return "lecoe"\.

**Example 2:**

**Input:** s = "erase\*\*\*\*\*"

**Output:** ""

**Explanation:** The entire string is removed, so we return an empty string\.

##### **Constraints:**

*   **1 <= s\.length <= 10****5**
*   `s` consists of lowercase English letters and stars `*`\.
*   The operation above can be performed on `s`\.


## Approaches

### 1\. Using a Stack

We can solve this problem using a stack to handle the character additions and star removals efficiently\.

#### Intuition:

*   Traverse the string character by character\.
*   Use a stack to keep track of characters that have been added\.
*   When encountering a star \('\*'\), pop the top element from the stack if it's not empty\. This simulates the action of the star removing the preceding character\.
*   Continue this process until the entire string is traversed\.
*   Finally, convert the stack back to a string which represents the transformed version of the original string without the stars and the characters removed by them\.

#### Steps:

1.  Initialize a stack to hold characters\.
2.  Traverse each character in the string\.

*   If the character is not '\*', push it onto the stack\.
*   If the character is '\*', pop the top character from the stack if the stack is not empty\.

4.  Convert the stack to a string and return it\.

#### Code:

```java
class Solution {
   public String removeStars(String s) {
       Stack<Character> stack = new Stack<>();
       
       for (char ch : s.toCharArray()) {
           if (ch != '*') {
               // Push the character to the stack if it's not a star
               stack.push(ch);
           } else {
               // Pop the stack to remove the last character when a star is encountered
               if (!stack.isEmpty()) {
                   stack.pop();
               }
           }
       }
       
       // Construct the final string from the stack contents
       StringBuilder result = new StringBuilder();
       for (char ch : stack) {
           result.append(ch);
       }
       
       return result.toString();
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- We iterate through the string once, where n is the number of characters in the string\.
*   **Space Complexity:** O\(n\) \- In the worst case, all characters \(except stars\) are stored in the stack\.

### 2\. In\-place Modification

We can enhance the efficiency by using a similar logic to sweep through the array, using in\-place modifications to reduce the auxiliary space\.

#### Intuition:

*   Instead of using a data structure like stack, use a characteristic of a string where stars remove characters\.
*   Traverse the string while maintaining an index to record the position at which the current non\-star character should be placed\.
*   For each non\-star character, place it at the current index and increment the index\.
*   For a star \('\*'\), decrement the index to account for removing the previous character\.

#### Steps:

1.  Convert the string into a character array\.
2.  Use variable `index` to track the write position for valid characters\.
3.  Iterate over the character array:

*   For non\-star characters, place the character at the current `index` and then increment `index`\.
*   For a star, decrement `index`\.

5.  Construct the resultant string using the valid portion of the character array up to `index`\.

#### Code:

```java
class Solution {
   public String removeStars(String s) {
       char[] result = s.toCharArray();
       int index = 0;

       for (char ch : result) {
           if (ch != '*') {
               // Place the character at the current index
               result[index++] = ch;
           } else {
               // A star means we need to "remove" the last character
               if (index > 0) {
                   index--;
               }
           }
       }

       // Build the final string with valid characters up to `index`
       return new String(result, 0, index);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- We make a single pass over the string\.
*   **Space Complexity:** O\(1\) \- No additional space is required beyond a few variables\.

#### [Solve it on LeetCode](https://leetcode.com/problems/removing-stars-from-a-string)
