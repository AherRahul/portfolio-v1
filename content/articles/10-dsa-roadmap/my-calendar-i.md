---
title: My Calendar I
description: Master My Calendar I in the BST / Ordered Set module. Comprehensive
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

You are implementing a program to use as your calendar\. We can add a new event if adding the event will not cause a **double booking**\.

A **double booking** happens when two events have some non\-empty intersection \(i\.e\., some moment is common to both events\.\)\.

The event can be represented as a pair of integers `startTime` and `endTime` that represents a booking on the half\-open interval `[startTime, endTime)`, the range of real numbers `x` such that `startTime <= x < endTime`\.

Implement the `MyCalendar` class:

*   `MyCalendar()` Initializes the calendar object\.
*   `boolean book(int startTime, int endTime)` Returns `true` if the event can be added to the calendar successfully without causing a **double booking**\. Otherwise, return `false` and do not add the event to the calendar\.

##### **Example 1:**

**Input**

\["MyCalendar", "book", "book", "book"\]

\[\[\], \[10, 20\], \[15, 25\], \[20, 30\]\]

**Output**

\[null, true, false, true\]

**Explanation**

```java
MyCalendar myCalendar = new MyCalendar();
myCalendar.book(10, 20); // return True
myCalendar.book(15, 25); // return False, It can not be booked because time 15 is already booked by another event.
myCalendar.book(20, 30); // return True, The event can be booked, as the first event takes every time less than 20, but not including 20.
```

##### **Constraints:**

*   **0 <= start < end <= 10****9**
*   At most `1000` calls will be made to `book`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/my-calendar-i)

# Approaches

## 1\. Brute Force Approach

#### Intuition:

The brute force approach involves storing every booked interval and iterating through the list whenever a new booking request comes in\. This approach checks for conflicts by iterating through each previously booked interval and ensuring no overlap\.

#### Code:

Java

```java
class MyCalendar {
   // We will keep a list to store the intervals
   private List<int[]> calendar;

   public MyCalendar() {
       // Initialize the list
       calendar = new ArrayList<>();
   }
   
   public boolean book(int start, int end) {
       // Iterate through each booked interval
       for (int[] interval : calendar) {
           // If there is an overlap, return false
           if (interval[0] < end && start < interval[1]) {
               return false;
           }
       }
       // If no overlaps, add the new booking and return true
       calendar.add(new int[]{start, end});
       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the number of bookings so far\. In the worst case, for each new booking, we are checking against all previously stored intervals\.
*   **Space Complexity:** O\(n\) due to storing all booked intervals\.

## 2\. Optimized Using TreeMap

#### Intuition:

To reduce the time complexity for checking overlaps, we can use a TreeMap\. The TreeMap data structure maintains the sorted order of starts, which allows faster lookups\. We can utilize its floor and ceiling functions to efficiently check for overlaps with neighboring intervals\.

#### Code:

Java

```java
class MyCalendar {
   // TreeMap to store the intervals with key as the start time and value as end time
   private TreeMap<Integer, Integer> calendar;

   public MyCalendar() {
       // Initialize the TreeMap
       calendar = new TreeMap<>();
   }
   
   public boolean book(int start, int end) {
       // Find the entry with largest key less than or equal to the start of the new interval
       Integer prev = calendar.floorKey(start);
       // Find the entry with the smallest key greater than the start
       Integer next = calendar.ceilingKey(start);

       // If the new interval overlaps with previous or next interval, return false
       if ((prev != null && calendar.get(prev) > start) || (next != null && next < end)) {
           return false;
       }
       
       // Otherwise, add the new interval
       calendar.put(start, end);
       return true;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(log n\) due to the TreeMap operations \(floor, ceiling, and put\)\.
*   **Space Complexity:** O\(n\) for storing the intervals in the TreeMap\.