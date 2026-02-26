---
title: Reverse Words in a String
description: Master Reverse Words in a String in the Strings module.
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

Given an input string `s`, reverse the order of the **words**\.

A **word** is defined as a sequence of non\-space characters\. The **words** in `s` will be separated by at least one space\.

Return _a string of the words in reverse order concatenated by a single space\._

**Note** that `s` may contain leading or trailing spaces or multiple spaces between two words\. The returned string should only have a single space separating the words\. Do not include any extra spaces\. 

##### **Example 1:**

**Input:** s = "the sky is blue"

**Output:** "blue is sky the"

##### **Example 2:**

**Input:** s = " hello world "

**Output:** "world hello"

**Explanation:** Your reversed string should not contain leading or trailing spaces\.

##### **Example 3:**

**Input:** s = "a good example"

**Output:** "example good a"

**Explanation:** You need to reduce multiple spaces between two words to a single space in the reversed string\. 

##### **Constraints:**

*   `1 <= s.length <= 10``4`
*   `s` contains English letters \(upper\-case and lower\-case\), digits, and spaces `' '`\.
*   There is **at least one** word in `s`\.

**Follow\-up:** If the string data type is mutable in your language, can you solve it **in\-place** with `O(1)` extra space?

#### [Solve it on LeetCode](https://leetcode.com/problems/reverse-words-in-a-string/)

# Understanding the Problem

Before diving into solutions, let's make sure we understand exactly what we are dealing with\. The problem has several nuances that will affect our implementation\.

#### **What we need to handle**

1.  **Multiple spaces between words:** The input `"a good example"` has three spaces between "good" and "example", but the output should have exactly one space: `"example good a"`\.
2.  **Leading spaces:** The input `" hello world"` starts with spaces\. The output should not: `"world hello"`\.
3.  **Trailing spaces:** Similarly, `"hello world "` has trailing spaces that should be removed in the output\.
4.  **Preserving word content:** The characters within each word must remain in their original order\. We only reverse the order of words, not the letters within them\.
5.  **Single word edge case:** If the input is just `"word"` \(possibly with surrounding spaces\), the output should simply be `"word"`\.

The core operation is straightforward: identify the words, collect them, and output them in reverse order with single spaces between them\. The challenge lies in doing this efficiently and handling all the spacing edge cases correctly\.

Let's think about the structure of the problem\. We can decompose it into steps:

1.  Parse the string to extract individual words \(ignoring extra spaces\)
2.  Reverse the order of these words
3.  Join them back together with single spaces

Different approaches handle these steps in different ways\. Some use language built\-ins, others manipulate characters directly, and some use auxiliary data structures like stacks\.

# Approaches

## 1\. Using Built\-in Split and Reverse

#### **Intuition**

Most programming languages provide powerful string manipulation functions\. In particular, the ability to split a string by whitespace and join elements with a delimiter makes this problem almost trivial\. The key insight is that split functions typically handle multiple consecutive delimiters and leading/trailing delimiters gracefully, giving us a clean list of words\.

This approach is the most practical for production code\. It's readable, concise, and leverages well\-tested library functions\. In an interview, you might mention this as your first instinct, then discuss whether the interviewer wants to see a more manual approach\.

#### **Algorithm**

1.  Split the string by whitespace to get an array of words \(most split functions handle multiple spaces and trim automatically\)
2.  Reverse the array of words
3.  Join the words with a single space delimiter
4.  Return the result

The beauty of this approach is that it handles all the edge cases, multiple spaces, leading spaces, trailing spaces, automatically through the split operation\.

#### Code

Java

```java
class Solution {
   public String reverseWords(String s) {
       // Step 1: Split the input string on spaces
       String[] words = s.trim().split("\s+");
       
       // Step 2: Use StringBuilder to construct the result efficiently
       StringBuilder reversed = new StringBuilder();
       for (int i = words.length - 1; i >= 0; i--) {
           reversed.append(words[i]);
           if (i != 0) {
               reversed.append(" ");
           }
       }
       
       return reversed.toString();
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the length of the input string, due to splitting and joining operations\.
*   **Space Complexity:** O\(N\), used by split\.

## 2\. Two Pointers with Deque

#### **Intuition:**

Using a two\-pointer approach along with a deque \(double\-ended queue\) can help manage space efficiently and avoid unnecessary memory allocation beyond what is required to store words\. This technique manually traverses the string and accumulates words in reverse order\.

#### **Steps:**

1.  Traverse the string from end to start using two pointers to find words\.
2.  Use a deque to efficiently manage the words that should appear first in the result\.
3.  Append words to the front of the deque and join them at the end\.

Java

```java
class Solution {
   public String reverseWords(String s) {
       int left = 0, right = s.length() - 1;
       // Step 1: Trim leading and trailing spaces
       while (left <= right && s.charAt(left) == ' ') left++;
       while (left <= right && s.charAt(right) == ' ') right--;

       Deque<String> d = new LinkedList<>();
       StringBuilder word = new StringBuilder();

       // Step 2: Go from the last character to the first
       while (left <= right) {
           char c = s.charAt(left);

           // If it's a space and a word has been completely read
           if ((word.length() != 0) && (c == ' ')) {
               d.offerFirst(word.toString());
               word.setLength(0); // Reset the word
           } else if (c != ' ') {
               word.append(c); // Add non-space characters to the current word
           }
           left++;
       }

       // Add the last word
       d.offerFirst(word.toString());

       // Return the joined words in the order they were added to deque
       return String.join(" ", d);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the length of the input string, as we traverse each character once\.
*   **Space Complexity:** O\(N\), used by the deque\.

## 3\. Two Pointers: In\-place Replacement

#### **Intuition:**

This method reverses the entire string first, then reverses each word in place\. This technique is more space efficient because the reversal occurs directly within the input string resorted to character arrays\.

#### **Steps:**

1.  Reverse the entire character array\.
2.  Reverse each word within the array\.
3.  Clean up any extra spaces resulting from the reversal process\.

#### Code:

Java

```java
class Solution {
   public String reverseWords(String s) {
       // Convert string to char array for in-place modifications
       char[] str = s.toCharArray();

       // Step 1: Reverse entire string
       reverse(str, 0, str.length - 1);

       // Step 2: Reverse each word
       reverseWords(str);

       // Step 3: Clean up spaces and return the cleaned string
       return cleanSpaces(str);
   }

   private void reverse(char[] str, int left, int right) {
       while (left < right) {
           char temp = str[left];
           str[left++] = str[right];
           str[right--] = temp;
       }
   }

   private void reverseWords(char[] s) {
       int n = s.length;
       int start = 0;
       for (int end = 0; end < n; end++) {
           // Find the end of the current word
           if (s[end] == ' ') {
               reverse(s, start, end - 1);
               start = end + 1; // Move to the start of the next word
           }
       }
       // Reverse the last word
       reverse(s, start, n - 1);
   }

   private String cleanSpaces(char[] str) {
       int n = str.length;
       int i = 0, j = 0;

       while (j < n) {
           // Skip spaces
           while (j < n && str[j] == ' ') j++;
           // Copy non-space characters
           while (j < n && str[j] != ' ') str[i++] = str[j++];
           // Skip spaces to reach the next word, add only one space if there's a next word
           while (j < n && str[j] == ' ') j++;
           if (j < n) str[i++] = ' ';
       }

       return new String(str, 0, i);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the length of the string, due to multiple in\-place passes\.
*   **Space Complexity:** O\(1\), as modifications are performed in\-place without extra space allocations outside of the input array\.