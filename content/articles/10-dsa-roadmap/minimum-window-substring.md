---
title: Minimum Window Substring
description: Master Minimum Window Substring in the Sliding Window module.
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

Given two strings `s` and `t` of lengths `m` and `n` respectively, return _the_ _**minimum window**_ _**substring**_ _of_ `s` _such that every character in_ `t` _\(__**including duplicates**__\) is included in the window_\. If there is no such substring, return _the empty string_ `""`\.

The testcases will be generated such that the answer is **unique**\. 

##### **Example 1:**

**Input:** s = "ADOBECODEBANC", t = "ABC"

**Output:** "BANC"

**Explanation:** The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t\.

##### **Example 2:**

**Input:** s = "a", t = "a"

**Output:** "a"

**Explanation:** The entire string s is the minimum window\.

##### **Example 3:**

**Input:** s = "a", t = "aa"**Output:** ""**Explanation:** Both 'a's from t must be included in the window\.Since the largest window of s only has one 'a', return empty string\. 

##### **Constraints:**

*   **m == s\.length**
*   **n == t\.length**
*   **1 <= m, n <= 10****5**
*   `s` and `t` consist of uppercase and lowercase English letters\.

**Follow up:** Could you find an algorithm that runs in `O(m + n)` time?

#### [Solve it on LeetCode](https://leetcode.com/problems/minimum-window-substring)

# Approaches

## 1\. Brute Force

The most straightforward solution is to generate all possible substrings of `s`, and check if they contain all characters of `t`\. However, this will be highly inefficient due to the large number of potential substrings, especially for long input strings\.

#### Intuition:

1.  Generate all possible substrings of `s`\.
2.  For each substring, count its characters and check if they match those in `t`\.
3.  Track the minimum\-length substring that contains all characters of `t`\.

#### Code:

Java

```java
class Solution {
   public String minWindow(String s, String t) {
       if (s.length() == 0 || t.length() == 0) return "";

       String result = "";
       int minLength = Integer.MAX_VALUE;

       for (int start = 0; start < s.length(); start++) {
           for (int end = start + 1; end <= s.length(); end++) {
               String substring = s.substring(start, end);
               if (containsAll(substring, t) && substring.length() < minLength) {
                   minLength = substring.length();
                   result = substring;
               }
           }
       }
       return result;
   }

   private boolean containsAll(String s, String t) {
       int[] countT = new int[128];
       int[] countS = new int[128];

       for (char c : t.toCharArray()) countT[c]++;
       for (char c : s.toCharArray()) countS[c]++;

       for (char c : t.toCharArray()) {
           if (countS[c] < countT[c]) return false;
       }
       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^3\) due to the checking of all substrings and counting of characters\.
*   **Space Complexity:** O\(1\), no additional data structures are used aside from fixed\-size arrays for counting characters\.

## 2\. Sliding Window using HashMap

The sliding window technique optimizes the process of finding the minimum window by maintaining two pointers to represent a window and expanding or shrinking it as needed\.

#### Intuition:

1.  Use two pointers: one to expand the window \(`right`\), and one to contract it \(`left`\)\.
2.  Use a HashMap to keep track of characters' frequencies in the current window\.
3.  When the window contains all characters of `t`, try to shrink it by moving the `left` pointer to minimize the window size\.
4.  Record the smallest window found\.

#### Code:

Java

```java
class Solution {
   public String minWindow(String s, String t) {
       if (s.length() == 0 || t.length() == 0) return "";
       
       HashMap<Character, Integer> tFreq = new HashMap<>();
       HashMap<Character, Integer> windowFreq = new HashMap<>();
       
       // Store frequency of characters in t
       for (char c : t.toCharArray()) {
           tFreq.put(c, tFreq.getOrDefault(c, 0) + 1);
       }
       
       int left = 0, right = 0;
       int matched = 0;
       int minLength = Integer.MAX_VALUE;
       int start = 0;
       
       // Expand the window with the right pointer
       while (right < s.length()) {
           char c = s.charAt(right);
           windowFreq.put(c, windowFreq.getOrDefault(c, 0) + 1);
           
           if (tFreq.containsKey(c) && windowFreq.get(c).intValue() == tFreq.get(c).intValue()) {
               matched++;
           }
           
           // If all characters are matched, try to shrink the window
           while (matched == tFreq.size()) {
               if (right - left + 1 < minLength) {
                   minLength = right - left + 1;
                   start = left;
               }
               
               // Remove the character at the left pointer from the window
               char leftChar = s.charAt(left);
               if (windowFreq.containsKey(leftChar)) {
                   windowFreq.put(leftChar, windowFreq.get(leftChar) - 1);
                   if (tFreq.containsKey(leftChar) && windowFreq.get(leftChar) < tFreq.get(leftChar)) {
                       matched--;
                   }
               }
               left++;
           }
           
           right++;
       }
       
       return minLength == Integer.MAX_VALUE ? "" : s.substring(start, start + minLength);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \+ m\), where `n` is the length of `s`, and `m` is the length of `t`\. This is because each character is processed at most twice \(once when `right` traverses `s`, and once when `left` increments\)\.
*   **Space Complexity:** O\(m \+ k\), where `m` is the size of the `tFreq` HashMap that stores character frequencies of `t`, and `k` is the maximum number of unique characters in `s`\.

View Animation