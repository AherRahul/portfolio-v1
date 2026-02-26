---
title: Isomorphic Strings
description: Master Isomorphic Strings in the Hash Tables module. Comprehensive
  guide and algorithmic problem solving.
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

Given two strings `s` and `t`, _determine if they are isomorphic_\.

Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`\.

All occurrences of a character must be replaced with another character while preserving the order of characters\. No two characters may map to the same character, but a character may map to itself\. 

##### **Example 1:**

**Input:** s = "egg", t = "add"

**Output:** true

**Explanation:**

The strings `s` and `t` can be made identical by:

*   Mapping `'e'` to `'a'`\.
*   Mapping `'g'` to `'d'`\.

##### **Example 2:**

**Input:** s = "foo", t = "bar"

**Output:** false

**Explanation:**

The strings `s` and `t` can not be made identical as `'o'` needs to be mapped to both `'a'` and `'r'`\.

##### **Example 3:**

**Input:** s = "paper", t = "title"

**Output:** true 

**Constraints:**

*   **1 <= s\.length <= 5 \* 10****4**
*   **t\.length == s\.length**
*   `s` and `t` consist of any valid ascii character\.

#### [Solve it on LeetCode](https://leetcode.com/problems/isomorphic-strings)

# Approaches

## 1\. Hash Maps

#### Intuition:

To better understand the character relationships, we'll use two hash maps\. This solution tracks mapping from both `s` to `t` and `t` to `s`, ensuring a one\-to\-one and onto mapping\.

*   Create two hash maps\.
*   For each character, ensure the mapping is unique and consistent in both directions\.

#### Code:

Java

```java
class Solution {
   public boolean isIsomorphic(String s, String t) {
       if (s.length() != t.length()) return false;
       
       Map<Character, Character> mapST = new HashMap<>();
       Map<Character, Character> mapTS = new HashMap<>();
       
       for (int i = 0; i < s.length(); i++) {
           char charS = s.charAt(i);
           char charT = t.charAt(i);
           
           // Check mapping from s to t
           if (mapST.containsKey(charS)) {
               if (mapST.get(charS) != charT) return false;
           } else {
               mapST.put(charS, charT);
           }
           
           // Check mapping from t to s
           if (mapTS.containsKey(charT)) {
               if (mapTS.get(charT) != charS) return false;
           } else {
               mapTS.put(charT, charS);
           }
       }
       
       return true;
   }    
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string\. We iterate through each character once\.
*   **Space Complexity:** O\(1\), specifically O\(26\) if considering distinct lowercase letters\. In practice, the space used by hash maps is relative to the character set\.

## 2\. Frequency Array

#### Intuition:

Since `s` and `t` are ascii characters, we can use frequency arrays of size 256 instead of using an explicit hash map \(which comes with overhead\)\.

*   For each character in the given strings, map them into a fixed\-size array based on ASCII values\.
*   Check if there is a consistent mapping from characters of `s` to `t` and `t` to `s`\.

#### Code:

Java

```java
class Solution {
   public boolean isIsomorphic(String s, String t) {
       if (s.length() != t.length()) return false;
       
       int[] mapS = new int[256];
       int[] mapT = new int[256];
       
       for (int i = 0; i < s.length(); i++) {
           char charS = s.charAt(i);
           char charT = t.charAt(i);
           
           // Check if previous mapped characters are same
           if (mapS[charS] != mapT[charT]) return false;
           
           // Map characters to index+1 to avoid default 0 confusion
           mapS[charS] = i + 1;
           mapT[charT] = i + 1;
       }
       
       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the string\. We iterate over the string once\.
*   **Space Complexity:** O\(1\)\. The space used by the arrays is constant due to the fixed size \(256\)\.