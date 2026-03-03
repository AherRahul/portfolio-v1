---
title: Zigzag Conversion
description: Master Zigzag Conversion in the Strings module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

The string `"PAYPALISHIRING"` is written in a zigzag pattern on a given number of rows like this:

```shell
P   A   H   N
A P L S I I G
Y   I   R
```

And then read line by line: `"PAHNAPLSIIGYIR"`

##### **Example 1:**

**Input:** s = "PAYPALISHIRING", numRows = 3

**Output:** "PAHNAPLSIIGYIR"

##### **Example 2:**

**Input:** s = "PAYPALISHIRING", numRows = 4

**Output:** "PINALSIGYAHRPI"

**Explanation:**

```shell
P     I    N
A   L S  I G
Y A   H R
P     I
```

##### **Example 3:**

**Input:** s = "A", numRows = 1

**Output:** "A"

##### **Constraints:**

*   `1 <= s.length <= 1000`
*   `s` consists of English letters \(lower\-case and upper\-case\), `','` and `'.'`\.
*   `1 <= numRows <= 1000`


## Approaches

### 1\. Zigzag Pattern Simulation

#### **Intuition:**

The problem asks to reorder the given string in a specified zigzag pattern across multiple rows\. The basic idea here is direct simulation by creating an array of strings, each representing a row in the zigzag pattern\.

#### Steps:

*   We iterate over each character in the string and decide which row of the zigzag it belongs to\.
*   This is determined by moving up and down the rows in a sequential pattern\.
*   Once the pattern is built, we can concatenate all the rows to get the final string\.

#### **Code:**

```java
class Solution {
   public String convert(String s, int numRows) {
       // Edge case: if the zigzag has only one row, the result is the string itself.
       if (numRows == 1) return s;
       
       // Create an array of StringBuilder for each row.
       StringBuilder[] rows = new StringBuilder[numRows];
       for (int i = 0; i < numRows; i++) {
           rows[i] = new StringBuilder();
       }
       
       // Current position and direction of traversal.
       int currentRow = 0;
       boolean goingDown = false;
       
       // Traverse the string and fill each row in the zigzag pattern.
       for (char c : s.toCharArray()) {
           // Append current character to the current row.
           rows[currentRow].append(c);
           
           // If we're at the first or the last row, change direction.
           if (currentRow == 0 || currentRow == numRows - 1) goingDown = !goingDown;
           
           // Move to the next row in the current direction.
           currentRow += goingDown ? 1 : -1;
       }
       
       // Combine all rows into one string.
       StringBuilder result = new StringBuilder();
       for (StringBuilder row : rows) {
           result.append(row);
       }
       
       return result.toString();
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\) where \(n\) is the length of the input string\. Each character is processed once\.
*   **Space Complexity:** O\(n\) to store the strings\.

#### [Solve it on LeetCode](https://leetcode.com/problems/zigzag-conversion/)
