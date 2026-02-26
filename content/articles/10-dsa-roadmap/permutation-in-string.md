---
title: Permutation in String
description: Master Permutation in String in the Sliding Window module.
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

Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise\.

In other words, return `true` if one of `s1`'s permutations is the substring of `s2`\. 

##### **Example 1:**

**Input:** s1 = "ab", s2 = "eidbaooo"

**Output:** true

**Explanation:** s2 contains one permutation of s1 \("ba"\)\.

##### **Example 2:**

**Input:** s1 = "ab", s2 = "eidboaoo"

**Output:** false 

##### **Constraints:**

*   **1 <= s1\.length, s2\.length <= 10****4**
*   `s1` and `s2` consist of lowercase English letters\.

#### [Solve it on LeetCode](https://leetcode.com/problems/permutation-in-string)

# Approaches

## 1\. Brute Force

#### **Intuition**:

The brute\-force approach involves checking all permutations of `s1` and seeing if any of them is a substring of `s2`\. Although not efficient, it helps build understanding of the problem\.

1.  Generate all permutations of the string `s1`\.
2.  Check each permutation to see if it exists as a substring in `s2`\.

#### **Code**:

Java

```java
class Solution {
   public boolean checkInclusion(String s1, String s2) {
       return permute("", s1, s2);
   }
   
   private boolean permute(String prefix, String str, String s2) {
       int n = str.length();
       if (n == 0) {
           if (s2.contains(prefix)) {
               return true;
           }
       } else {
           for (int i = 0; i < n; i++) {
               if (permute(prefix + str.charAt(i), str.substring(0, i) + str.substring(i+1, n), s2)) {
                   return true;
               }
           }
       }
       return false;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\! \* m\) where `n` is the length of `s1` and `m` is the length of `s2`\.
*   **Space Complexity:** O\(n\), due to recursion stack and storing permutations\.

## 2\. Sorting Each Substring

#### **Intuition**:

Since a permutation of `s1` should have the same characters with the same frequency, for each substring of `s2` with length `s1`, we check if its sorted version matches the sorted `s1`\.

1.  Sort `s1`\.
2.  For each possible substring of `s2` with the length of `s1`, sort it and compare with sorted `s1`\.

#### **Code**:

Java

```java
public class Solution {
   public boolean checkInclusion(String s1, String s2) {
       char[] s1Sorted = s1.toCharArray();
       Arrays.sort(s1Sorted);
       
       for (int i = 0; i <= s2.length() - s1.length(); i++) {
           String substr = s2.substring(i, i + s1.length());
           char[] substrSorted = substr.toCharArray();
           Arrays.sort(substrSorted);
           if (Arrays.equals(s1Sorted, substrSorted)) {
               return true;
           }
       }
       return false;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(m \* n log n\), where `m` is the size of `s2` and `n` is the size of `s1`\.
*   **Space Complexity:** O\(n\), space needed to store the sorted version of `s1` and each substring\.

## 3\. Sliding Window

#### **Intuition**:

The optimized approach uses a sliding window technique with two arrays \(or maps\) to keep track of character counts\. If at any point the character counts between the current window in `s2` and `s1` match, we found a permutation\.

1.  Use two counts arrays of size 26 \(for each letter in the alphabet\) for `s1` and the current window\.
2.  Slide over `s2` with a window of the size of `s1`, updating the counts\.
3.  If the counts match, return true\.

#### **Code**:

Java

```java
class Solution {
   public boolean checkInclusion(String s1, String s2) {
       if (s1.length() > s2.length()) return false;
       
       int[] s1Count = new int[26];
       int[] s2Count = new int[26];
       
       for (int i = 0; i < s1.length(); i++) {
           s1Count[s1.charAt(i) - 'a']++;
           s2Count[s2.charAt(i) - 'a']++;
       }
       
       for (int i = 0; i < s2.length() - s1.length(); i++) {
           if (matches(s1Count, s2Count)) return true;
           
           s2Count[s2.charAt(i + s1.length()) - 'a']++;
           s2Count[s2.charAt(i) - 'a']--;
       }
       
       return matches(s1Count, s2Count);
   }
   
   private boolean matches(int[] s1Count, int[] s2Count) {
       for (int i = 0; i < 26; i++) {
           if (s1Count[i] != s2Count[i]) return false;
       }
       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(m\), where `m` is the length of `s2`\.
*   **Space Complexity:** O\(1\), constant space for the count arrays\.

View Animation