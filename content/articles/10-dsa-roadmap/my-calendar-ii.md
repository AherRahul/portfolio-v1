---
title: My Calendar II
description: Master My Calendar II in the BST / Ordered Set module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are implementing a program to use as your calendar\. We can add a new event if adding the event will not cause a **triple booking**\.

A **triple booking** happens when three events have some non\-empty intersection \(i\.e\., some moment is common to all the three events\.\)\.

The event can be represented as a pair of integers `startTime` and `endTime` that represents a booking on the half\-open interval `[startTime, endTime)`, the range of real numbers `x` such that `startTime <= x < endTime`\.

Implement the `MyCalendarTwo` class:

*   `MyCalendarTwo()` Initializes the calendar object\.
*   `boolean book(int startTime, int endTime)` Returns `true` if the event can be added to the calendar successfully without causing a **triple booking**\. Otherwise, return `false` and do not add the event to the calendar\. 

##### **Example 1:**

**Input**

\["MyCalendarTwo", "book", "book", "book", "book", "book", "book"\]

\[\[\], \[10, 20\], \[50, 60\], \[10, 40\], \[5, 15\], \[5, 10\], \[25, 55\]\]

**Output**

\[null, true, true, true, false, true, true\]

**Explanation**

```java
MyCalendarTwo myCalendarTwo = new MyCalendarTwo();
myCalendarTwo.book(10, 20); // return True, The event can be booked. myCalendarTwo.book(50, 60); // return True, The event can be booked. myCalendarTwo.book(10, 40); // return True, The event can be double booked.
myCalendarTwo.book(5, 15);  // return False, The event cannot be booked, because it would result in a triple booking.
myCalendarTwo.book(5, 10); // return True, The event can be booked, as it does not use time 10 which is already double booked.
myCalendarTwo.book(25, 55); // return True, The event can be booked, as the time in [25, 40) will be double booked with the third event, the time [40, 50) will be single booked, and the time [50, 55) will be double booked with the second event.
```

##### **Constraints:**

*   **0 <= start < end <= 10****9**
*   At most `1000` calls will be made to `book`\.


## Approaches

### 1\. Brute Force with Double Booking Check

#### Intuition:

The brute force approach involves checking if a new event can be added without causing a double booking\. This requires maintaining two lists: one for all booked events and another for overlaps of these events\. Every new event is checked against these lists, ensuring it doesn't add a triple booking\.

#### Code:

```java
class MyCalendarTwo {
   private List<int[]> bookings;
   private List<int[]> overlaps;

   public MyCalendarTwo() {
       bookings = new ArrayList<>();
       overlaps = new ArrayList<>();
   }

   public boolean book(int start, int end) {
       // Check for any triple booking that would result from this new event
       for (int[] overlap : overlaps) {
           if (start < overlap[1] && end > overlap[0]) {
               return false; // This means there would be a triple booking
           }
       }

       // Update overlaps list with new overlaps caused by the new event
       for (int[] booking : bookings) {
           if (start < booking[1] && end > booking[0]) {
               overlaps.add(new int[]{Math.max(start, booking[0]), Math.min(end, booking[1])});
           }
       }

       // Finally add this event to the list of bookings
       bookings.add(new int[]{start, end});
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), where \(n\) is the number of calls to the `book` method, because each booking may need to check against every other booking for overlap\.
*   **Space Complexity:** O\(n\), to store all bookings and potential overlaps\.

### 2\. Using ArrayList Overlap and Bookings

#### Intuition:

An optimization over the previous approach\. Instead of blindly checking and updating as in brute force, we focus on preventing any triple bookings by carefully maintaining only necessary overlaps\.

#### Code:

```java
class MyCalendarTwo {
   private List<int[]> bookings;
   private List<int[]> overlaps;

   public MyCalendarTwo() {
       bookings = new ArrayList<>();
       overlaps = new ArrayList<>();
   }

   public boolean book(int start, int end) {
       // Check for any double booking
       for (int[] overlap : overlaps) {
           if (start < overlap[1] && end > overlap[0]) {
               return false;
           }
       }

       // Account for new overlaps caused by new booking
       for (int[] booking : bookings) {
           if (start < booking[1] && end > booking[0]) {
               overlaps.add(new int[]{Math.max(start, booking[0]), Math.min(end, booking[1])});
           }
       }

       // Add current booking to bookings list
       bookings.add(new int[]{start, end});
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\), similar to the brute force approach\.
*   **Space Complexity:** O\(n\), to maintain lists of bookings and overlaps\.

### 3\. TreeMap for Optimized Time Complexity

#### Intuition:

Using a TreeMap allows us to efficiently track the number of active bookings at any point in time\. By incrementing at the start of a booking and decrementing at the end, we can determine double bookings through a sweep\-line algorithm\.

#### Code:

```java
class MyCalendarTwo {
   private TreeMap<Integer, Integer> calendar;

   public MyCalendarTwo() {
       calendar = new TreeMap<>();
   }

   public boolean book(int start, int end) {
       // Increment the count of ongoing events at 'start' and decrement at 'end'
       calendar.put(start, calendar.getOrDefault(start, 0) + 1);
       calendar.put(end, calendar.getOrDefault(end, 0) - 1);

       int activeBookings = 0;
       // Iterate through the times to check active bookings
       for (int delta : calendar.values()) {
           activeBookings += delta;
           if (activeBookings >= 3) {  // Triple booking occurs
               calendar.put(start, calendar.get(start) - 1);
               calendar.put(end, calendar.get(end) + 1);
               return false;
           }
       }
       return true;  // No triple booking, booking is successful
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\), due to TreeMap operations per booking\.
*   **Space Complexity:** O\(n\), holding start and end times in the map\.

#### [Solve it on LeetCode](https://leetcode.com/problems/my-calendar-ii)
