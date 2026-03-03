---
title: Time Based Key-Value Store
description: Master Time Based Key-Value Store in the Data Structure Design
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

Design a time\-based key\-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp\.

Implement the `TimeMap` class:

*   `TimeMap()` Initializes the object of the data structure\.
*   `void set(String key, String value, int timestamp)` Stores the key `key` with the value `value` at the given time `timestamp`\.
*   `String get(String key, int timestamp)` Returns a value such that `set` was called previously, with `timestamp_prev <= timestamp`\. If there are multiple such values, it returns the value associated with the largest `timestamp_prev`\. If there are no values, it returns `""`\.

##### **Example 1:**

**Input**

\["TimeMap", "set", "get", "get", "set", "get", "get"\]

\[\[\], \["foo", "bar", 1\], \["foo", 1\], \["foo", 3\], \["foo", "bar2", 4\], \["foo", 4\], \["foo", 5\]\]

**Output**

\[null, null, "bar", "bar", null, "bar2", "bar2"\]

**Explanation**

```java
TimeMap timeMap = new TimeMap();
timeMap.set("foo", "bar", 1);  // store the key "foo" and value "bar" along with timestamp = 1.
timeMap.get("foo", 1);         // return "bar"
timeMap.get("foo", 3);         // return "bar", since there is no value corresponding to foo at timestamp 3 and timestamp 2, then the only value is at
timestamp 1 is "bar".
timeMap.set("foo", "bar2", 4); // store the key "foo" and value "bar2" along with timestamp = 4.
timeMap.get("foo", 4);         // return "bar2"
timeMap.get("foo", 5);         // return "bar2"
```

##### **Constraints:**

*   `1 <= key.length, value.length <= 100`
*   `key` and `value` consist of lowercase English letters and digits\.
*   **1 <= timestamp <= 10****7**
*   All the timestamps `timestamp` of `set` are strictly increasing\.
*   At most **2 \* 10****5** calls will be made to `set` and `get`\.


## Approaches

### 1\. Using HashMap with Linear Search \(Basic\)

#### Intuition:

The simplest approach to solve this problem is to use a `HashMap` where the keys are strings and the values are lists of pairs \(timestamp, value\)\. To perform the `get` operation, we can iterate over the list for a particular key and find the largest timestamp that is less than or equal to the given timestamp\.

#### Steps:

1.  We'll use a `HashMap<String, List<Pair<Integer, String>>>` to store keys with their associated timestamp\-value pairs\.
2.  For the `set` operation, we'll add a pair of `(timestamp, value)` to the list corresponding to the key\.
3.  For the `get` operation, we'll iterate through the list associated with the given key and check for the largest timestamp that is less than or equal to the given timestamp\.

#### Code:

```java
class TimeMap {
   private Map<String, List<Pair>> map;

   public TimeMap() {
       map = new HashMap<>();
   }

   public void set(String key, String value, int timestamp) {
       // Store the (timestamp, value) pair in the map
       map.computeIfAbsent(key, k -> new ArrayList<>()).add(new Pair(timestamp, value));
   }

   public String get(String key, int timestamp) {
       // If the key does not exist, return an empty string
       if (!map.containsKey(key)) return "";
       
       List<Pair> pairs = map.get(key);
       
       // Linear search to find the largest timestamp <= given timestamp
       String result = "";
       for (Pair pair : pairs) {
           if (pair.timestamp <= timestamp) {
               result = pair.value;
           } else {
               break;
           }
       }

       return result;
   }

   private static class Pair {
       int timestamp;
       String value;
       
       Pair(int t, String v) {
           timestamp = t;
           value = v;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:**

*   `set`: O\(1\) amortized time complexity\.
*   `get`: O\(n\) where n is the number of timestamp\-value pairs for the key\.

*   **Space Complexity:** O\(n\) to store all timestamp\-value pairs\.

### 2\. Using HashMap with Binary Search \(Optimal\)

#### Intuition:

An optimized approach improves the `get` operation by using binary search\. Given that the timestamps are stored in sorted order by insertion, we can utilize binary search to quickly locate the largest timestamp that is less than or equal to the given timestamp\.

#### Steps:

1.  Similar to the previous approach, we'll use a `HashMap` with lists of pairs for each key\.
2.  For the `set` operation, the implementation remains the same\.
3.  For the `get` operation, use binary search on the list of pairs for the given key instead of linear search\.

#### Code:

```java
class TimeMap {
   private Map<String, List<Pair>> map;

   public TimeMap() {
       map = new HashMap<>();
   }

   public void set(String key, String value, int timestamp) {
       // Store the (timestamp, value) pair in the map
       map.computeIfAbsent(key, k -> new ArrayList<>()).add(new Pair(timestamp, value));
   }

   public String get(String key, int timestamp) {
       // If the key does not exist, return an empty string
       if (!map.containsKey(key)) return "";
       
       List<Pair> pairs = map.get(key);
       
       // Binary search to find the largest timestamp <= given timestamp
       int left = 0, right = pairs.size() - 1;
       String result = "";
       
       while (left <= right) {
           int mid = left + (right - left) / 2;
           if (pairs.get(mid).timestamp <= timestamp) {
               result = pairs.get(mid).value; // Potential result
               left = mid + 1; // Look in the right half for a closer match
           } else {
               right = mid - 1; // Look in the left half
           }
       }

       return result;
   }

   private static class Pair {
       int timestamp;
       String value;
       
       Pair(int t, String v) {
           timestamp = t;
           value = v;
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:**

*   `set`: O\(1\) amortized time complexity\.
*   `get`: O\(log n\), where n is the number of timestamp\-value pairs for the key due to binary search\.

*   **Space Complexity:** O\(n\) to store all timestamp\-value pairs\.

#### [Solve it on LeetCode](https://leetcode.com/problems/time-based-key-value-store)
