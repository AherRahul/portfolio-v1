---
title: Longest Common Prefix
description: Master Longest Common Prefix in the Strings module. Comprehensive
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

Write a function to find the longest common prefix string amongst an array of strings\.

If there is no common prefix, return an empty string `""`\.

##### **Example 1:**

Input:strs=\["flower","flow","flight"\]

0

flower

1

flow

2

flight

Output:"fl"

0

f

1

l

##### **Example 2:**

Input:strs=\["dog","racecar","car"\]

0

dog

1

racecar

2

car

Output:""

**Explanation:** There is no common prefix among the input strings\. 

##### **Constraints:**

*   `1 <= strs.length <= 200`
*   `0 <= strs[i].length <= 200`
*   `strs[i]` consists of only lowercase English letters if it is non\-empty\.

#### [Solve it on LeetCode](https://leetcode.com/problems/longest-common-prefix)

# Approaches

## Approach 1: Horizontal Scanning

#### **Intuition:**

This approach involves taking the first string in the array and comparing it with each subsequent string\. For each comparison, the common prefix is updated\. By the end of this systematic pairwise comparison of strings, we derive the overall longest common prefix\.

#### **Code:**

Java

```java
class Solution {
   public String longestCommonPrefix(String[] strs) {
       if (strs == null || strs.length == 0) return "";
       // Start with the prefix as the first string
       String prefix = strs[0];
       // Compare the chosen prefix with each string
       for (int i = 1; i < strs.length; i++) {
           // Find the common prefix between current prefix and strs[i]
           while (strs[i].indexOf(prefix) != 0) {
               // Reduce the prefix by one character from the end each time
               prefix = prefix.substring(0, prefix.length() - 1);
               // If prefix becomes empty, there is no common prefix
               if (prefix.isEmpty()) return "";
           }
       }
       return prefix;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(S\), where S is the sum of all characters in the input strings\.
*   **Space Complexity:** O\(1\), as we are only using a constant amount of extra space\.

## Approach 2: Vertical Scanning

#### **Intuition:**

This method works by checking each character position across all input strings, proceeding character by character\. This approach terminates when a mismatch is found or when one string is exhausted\.

#### **Code:**

Java

```java
class Solution {
   public String longestCommonPrefix(String[] strs) {
       if (strs == null || strs.length == 0) return "";
       // Traverse from the first character to the last character of the first string
       for (int i = 0; i < strs[0].length(); i++) {
           char c = strs[0].charAt(i);
           // Compare current character with the characters in the same position on other strings
           for (int j = 1; j < strs.length; j++) {
               // If the character exceeds the length of one of the strings or the character doesn't match
               if (i == strs[j].length() || strs[j].charAt(i) != c) {
                   return strs[0].substring(0, i);
               }
           }
       }
       return strs[0];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(S\), where S is the sum of all characters in all strings\.
*   **Space Complexity:** O\(1\), as we are only using a constant amount of extra space\.

## Approach 3: Divide and Conquer

#### **Intuition:**

The divide and conquer approach breaks the problem into smaller sub\-problems\. It recursively divides the array into two halves until it reduces to the smallest size, then it combines the results by finding a common prefix between two halves\.

#### **Code:**

Java

```java
class Solution {
   public String longestCommonPrefix(String[] strs) {
       if (strs == null || strs.length == 0) return ""; 
       return longestCommonPrefix(strs, 0, strs.length - 1);
   }

   private String longestCommonPrefix(String[] strs, int l, int r) {
       if (l == r) {
           return strs[l];
       } else {
           int mid = (l + r) / 2;
           String lcpLeft = longestCommonPrefix(strs, l, mid);
           String lcpRight = longestCommonPrefix(strs, mid + 1, r);
           return commonPrefix(lcpLeft, lcpRight);
       }
   }

   private String commonPrefix(String left, String right) {
       int min = Math.min(left.length(), right.length());
       for (int i = 0; i < min; i++) {
           if (left.charAt(i) != right.charAt(i)) {
               return left.substring(0, i);
           }
       }
       return left.substring(0, min);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(S\), where S is the sum of all characters in all strings\. In the worst case, we are dividing every string in two substrings\.
*   **Space Complexity:** O\(m log n\), where m is the number of strings\. This complexity arises due to the recursive call stack\.

## Approach 4: Binary Search

#### **Intuition:**

This approach uses binary search on the length of the common prefix\. It checks a middle value to see if all strings have a common prefix of that length\. If they do, the length is increased; otherwise, it is decreased, effectively narrowing down the range\.

#### **Code:**

Java

```java
class Solution {
   public String longestCommonPrefix(String[] strs) {
       if (strs == null || strs.length == 0) return "";
       int minLen = Integer.MAX_VALUE;
       // Find the minimum length string
       for (String str : strs) {
           minLen = Math.min(minLen, str.length());
       }

       int low = 1;
       int high = minLen;
       while (low <= high) {
           int middle = (low + high) / 2;
           if (isCommonPrefix(strs, middle)) {
               low = middle + 1;
           } else {
               high = middle - 1;
           }
       }
       return strs[0].substring(0, (low + high) / 2);
   }

   private boolean isCommonPrefix(String[] strs, int length) {
       String str1 = strs[0].substring(0, length);
       for (int i = 1; i < strs.length; i++) {
           if (!strs[i].startsWith(str1)) {
               return false;
           }
       }
       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(S log m\), where m is the length of the smallest string and S is the sum of all characters in all strings since checking if a prefix is common is O\(S\)\.
*   **Space Complexity:** O\(1\)\.