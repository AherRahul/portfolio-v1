---
title: Time Needed to Buy Tickets
description: Master Time Needed to Buy Tickets in the Queues module.
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

There are `n` people in a line queuing to buy tickets, where the `0``th` person is at the **front** of the line and the `(n - 1)``th` person is at the **back** of the line\.

You are given a **0\-indexed** integer array `tickets` of length `n` where the number of tickets that the `i``th` person would like to buy is `tickets[i]`\.

Each person takes **exactly 1 second** to buy a ticket\. A person can only buy **1 ticket at a time** and has to go back to **the end** of the line \(which happens **instantaneously**\) in order to buy more tickets\. If a person does not have any tickets left to buy, the person will **leave** the line\.

Return the **time taken** for the person **initially** at position **k** \(0\-indexed\) to finish buying tickets\.

##### **Example 1:**

**Input:** tickets = \[2,3,2\], k = 2

**Output:** 6

**Explanation:**

*   The queue starts as \[2,3,2\], where the kth person is underlined\.
*   After the person at the front has bought a ticket, the queue becomes \[3,2,1\] at 1 second\.
*   Continuing this process, the queue becomes \[2,1,2\] at 2 seconds\.
*   Continuing this process, the queue becomes \[1,2,1\] at 3 seconds\.
*   Continuing this process, the queue becomes \[2,1\] at 4 seconds\. Note: the person at the front left the queue\.
*   Continuing this process, the queue becomes \[1,1\] at 5 seconds\.
*   Continuing this process, the queue becomes \[1\] at 6 seconds\. The kth person has bought all their tickets, so return 6\.

##### **Example 2:**

**Input:** tickets = \[5,1,1,1\], k = 0

**Output:** 8

**Explanation:**

*   The queue starts as \[5,1,1,1\], where the kth person is underlined\.
*   After the person at the front has bought a ticket, the queue becomes \[1,1,1,4\] at 1 second\.
*   Continuing this process for 3 seconds, the queue becomes \[4\] at 4 seconds\.
*   Continuing this process for 4 seconds, the queue becomes \[\] at 8 seconds\. The kth person has bought all their tickets, so return 8\.

##### **Constraints:**

*   `n == tickets.length`
*   `1 <= n <= 100`
*   `1 <= tickets[i] <= 100`
*   `0 <= k < n`

#### [Solve it on LeetCode](https://leetcode.com/problems/time-needed-to-buy-tickets)

# Approaches

## 1\. Simulation with a Queue

#### Intuition:

*   The problem can be solved using a simulation approach\. We process each person in the queue, decrementing their required tickets and tracking the number of rounds needed until the target person at the given index finishes purchasing tickets\.
*   A direct simulation using a queue data structure is intuitive, representing each person's tickets as nodes in the queue\.

#### Steps:

1.  Create a queue to simulate the people buying tickets one at a time\.
2.  For each tick of time, decrement the ticket count required by the person currently at the front of the queue\.
3.  If a person's ticket count is still more than zero, enque them at the end with their updated ticket count\.
4.  Track the total time and stop when the target person has finished buying tickets\.

#### Code:

Java

```java
class Solution {
   public int timeRequiredToBuy(int[] tickets, int k) {
       // Initialize a queue to simulate the buying process
       Queue<Integer> queue = new LinkedList<>();
       int time = 0;
       
       // Populate the queue with each person's tickets
       for (int ticketCount : tickets) {
           queue.offer(ticketCount);
       }
       
       // Process the queue until the k-th person finish buying their tickets
       while (true) {
           int currentTicket = queue.poll(); // Get the first person in the queue
           time++; // Increase time since you served one person
           
           // If this person had only one ticket, check if it was the k-th person
           if (--currentTicket == 0) {
               if (k == 0) {
                   break; // If k reaches zero when this person's tickets reach zero, we're done
               }
           } else {
               queue.offer(currentTicket); // Otherwise, place them back with remaining tickets
           }

           // Move the target index considering the circular nature of queue
           k--;
           if (k < 0) {
               k = queue.size() - 1;
           }
       }
       
       return time;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n \* m\), where `n` is the number of people and `m` is the maximum number of tickets\. Each person can be considered once per ticket they need\.
*   **Space Complexity:** O\(n\), because of the queue storing all people\.

## 2\. Optimized Simulation without Queue

#### Intuition:

*   Instead of simulating the queue movement explicitly, we can calculate the time directly by keeping track of the number of decrements each person can afford until the `k-th` person is done\.
*   We merely check how people in positions relative to `k` \(`i <= k` or `i > k`\) behave, as people cannot use more tickets than the `i-th` index allows before the `k-th` person is depleted\.

#### Steps:

1.  Iterate through each person\. For each person:

*   If they are before or at `k`, they need their tickets minus the greater of their need or the `k-th` person\.
*   If they are after `k`, they need their tickets but can only use as much as the `k-th` person allows\.

3.  Sum these time increments and return\.

#### Code:

Java

```java
class Solution {
   public int timeRequiredToBuy(int[] tickets, int k) {
       int time = 0;
       
       // Iterate over each person in the queue
       for (int i = 0; i < tickets.length; i++) {
           // Calculate time:
           // If this person is at or before k, consider that they can afford k decrements
           // if i > k they cannot use more than the number of the k-th ticket count
           time += (i <= k) ? Math.min(tickets[i], tickets[k]) : Math.min(tickets[i], tickets[k] - 1);
       }
       
       return time;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where `n` is the number of people, as we are simply iterating through the list once\.
*   **Space Complexity:** O\(1\), since we are not using any additional data structures\.