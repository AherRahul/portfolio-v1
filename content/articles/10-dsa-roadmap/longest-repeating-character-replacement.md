---
title: Longest Repeating Character Replacement
description: Master Longest Repeating Character Replacement in the Sliding
  Window module. Comprehensive guide and algorithmic problem solving.
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

You are given a string `s` and an integer `k`\. You can choose any character of the string and change it to any other uppercase English character\. You can perform this operation at most `k` times\.

Return _the length of the longest substring containing the same letter you can get after performing the above operations_\. 

##### **Example 1:**

**Input:** s = "ABAB", k = 2

**Output:** 4

**Explanation:** Replace the two 'A's with two 'B's or vice versa\.

##### **Example 2:**

**Input:** s = "AABABBA", k = 1

**Output:** 4

**Explanation:** Replace the one 'A' in the middle with 'B' and form "AABBBBA"\.

The substring "BBBB" has the longest repeating letters, which is 4\.

There may exists other ways to achieve this answer too\. 

##### **Constraints:**

*   **1 <= s\.length <= 10****5**
*   `s` consists of only uppercase English letters\.
*   **0 <= k <= s\.length**

#### [Solve it on LeetCode](https://leetcode.com/problems/longest-repeating-character-replacement)

# Approaches

## 1\. Sliding Window

#### **Intuition:**

The problem requires us to determine the length of the longest substring that can be made up of the same character by replacing at most 'k' characters\. A naive approach would evaluate each substring, but that would be inefficient\. Instead, we utilize the sliding window technique for efficiency\.

A dynamic sliding window is ideal here as it allows us to explore parts of the string\. We'll adjust the window's size and location on the string to check potential substrings\.

We use a HashMap to keep track of the character frequency in the current window\. The main trick is to maintain a window where it is possible to replace at most 'k' characters\. If a window has more than 'k' characters that need replacing, it shrinks from the left\.

#### **Steps:**

1.  Initiate two pointers, left and right, and a HashMap for character frequency count\.
2.  Expand the window by moving the right pointer\.
3.  Calculate the maximum frequency of any character in the current window\.
4.  If the \(window size \- max frequency character\) exceeds 'k', it means we have to shift the left pointer rightward to potentially create a valid window\.
5.  Continue until the right pointer reaches the end of the string\.

#### Code:

Java

```java
class Solution {
   public int characterReplacement(String s, int k) {
       int left = 0, maxCount = 0, maxLength = 0;
       int[] count = new int[26];
       
       for (int right = 0; right < s.length(); right++) {
           // Increment character count for the character at 'right'
           maxCount = Math.max(maxCount, ++count[s.charAt(right) - 'A']);
           
           // Window size: right - left + 1
           // Calculate if replacements exceed k
           if (right - left + 1 - maxCount > k) {
               count[s.charAt(left) - 'A']--;
               left++;
           }
           
           // Update maximum length of the window
           maxLength = Math.max(maxLength, right - left + 1);
       }
       
       return maxLength;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\) \- where N is the length of the string\. We potentially examine each character once as we adjust our window\.
*   **Space Complexity:** O\(1\) \- Our frequency map is constant size\.