---
title: Number of Good Ways to Split a String
description: Master Number of Good Ways to Split a String in the Hash Tables
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are given a string `s`\.

A split is called **good** if you can split `s` into two non\-empty strings **s****left** and **s****right** where their concatenation is equal to `s` \(i\.e\., **s****left** **\+ s****right** **= s**\) and the number of distinct letters in **s****left** and **s****right** is the same\.

Return _the number of_ _**good splits**_ _you can make in_ `_s_`\. 

##### **Example 1:**

**Input:** s = "aacaba"

**Output:** 2

**Explanation:** There are 5 ways to split `"aacaba"` and 2 of them are good\.

\("a", "acaba"\) Left string and right string contains 1 and 3 different letters respectively\.

\("aa", "caba"\) Left string and right string contains 1 and 3 different letters respectively\.

\("aac", "aba"\) Left string and right string contains 2 and 2 different letters respectively \(good split\)\.

\("aaca", "ba"\) Left string and right string contains 2 and 2 different letters respectively \(good split\)\.\("aacab", "a"\) Left string and right string contains 3 and 1 different letters respectively\.

##### **Example 2:**

**Input:** s = "abcd"

**Output:** 1

**Explanation:** Split the string as follows \("ab", "cd"\)\. 

**Constraints:**

*   **1 <= s\.length <= 10****5**
*   `s` consists of only lowercase English letters\.


## Approaches

### 1\. Brute Force

#### Intuition:

The brute force approach involves using a nested loop to try every possible split point and count unique characters on both sides of the split\. While this method is straightforward, it is inefficient because it involves recalculating the unique character count for both substrings at every possible split point\.

#### Steps:

1.  Initialize a counter to keep track of good splits\.
2.  Loop over possible split points from 1 to n\-1 \(where n is the length of the string\)\.
3.  For each split point, split the string into two parts and count the unique characters in each part\.
4.  If the number of unique characters in both parts is equal, increment the good split counter\.

#### Code:

```java
class Solution {
   public int numSplits(String s) {
       int goodSplits = 0;
       
       // Try each possible split point
       for (int i = 1; i < s.length(); i++) {
           String left = s.substring(0, i);
           String right = s.substring(i);
           
           // Count distinct characters on both sides
           int leftUnique = countUnique(left);
           int rightUnique = countUnique(right);
           
           // If both have the same number of unique characters, it's a good split
           if (leftUnique == rightUnique) {
               goodSplits++;
           }
       }
       
       return goodSplits;
   }
   
   private int countUnique(String s) {
       boolean[] seen = new boolean[26];
       int count = 0;
       for (char c : s.toCharArray()) {
           if (!seen[c - 'a']) {
               count++;
               seen[c - 'a'] = true;
           }
       }
       return count;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) \- For each split point, counting unique characters can take up to O\(n\) time\.
*   **Space Complexity:** O\(1\) \- The space used by the boolean array is constant in size\.

### 2\. Optimized Approach using Frequency Maps

#### Intuition:

To improve efficiency, we can use two frequency maps to track character counts on both sides of the split\. We start with all characters in the 'right' map, and as we process each character, we move it from the 'right' map to the 'left' map until the split point is found\. This allows maintaining constant time complexity for adjusting character counts and only recalculates the number of unique characters at each split\.

#### Steps:

1.  Initialize two integer arrays `leftFreq` and `rightFreq` to keep track of character occurrences on both sides\.
2.  Traverse the string once to populate the `rightFreq` array\.
3.  As we iterate over possible split points, adjust the counts in `leftFreq` and `rightFreq` as characters move from right to left\.
4.  Use two counters `leftUnique` and `rightUnique` to track the number of unique characters in each partition as they evolve\.
5.  Whenever these two counters are equal, it is a good split\.

#### Code:

```java
class Solution {
   public int numSplits(String s) {
       int n = s.length();
       int[] leftFreq = new int[26];
       int[] rightFreq = new int[26];
       
       // Initialize right frequency table
       for (char c : s.toCharArray()) {
           rightFreq[c - 'a']++;
       }
       
       int leftUnique = 0;
       int rightUnique = 0;
       
       // Count initial unique characters in right part
       for (int count : rightFreq) {
           if (count > 0) {
               rightUnique++;
           }
       }
       
       int goodSplits = 0;

       // Process each split point
       for (int i = 0; i < n; i++) {
           char c = s.charAt(i);
           
           // Move character from right to left
           if (leftFreq[c - 'a'] == 0) {
               leftUnique++;
           }
           leftFreq[c - 'a']++;
           
           rightFreq[c - 'a']--;
           if (rightFreq[c - 'a'] == 0) {
               rightUnique--;
           }
           
           // Check for good split
           if (leftUnique == rightUnique) {
               goodSplits++;
           }
       }
       return goodSplits;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) \- We traverse the string a constant number of times\.
*   **Space Complexity:** O\(1\) \- Frequency arrays use constant extra space\.

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-good-ways-to-split-a-string)
