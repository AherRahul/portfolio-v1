---
title: Reveal Cards In Increasing Order
description: Master Reveal Cards In Increasing Order in the Queues module.
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

You are given an integer array `deck`\. There is a deck of cards where every card has a unique integer\. The integer on the **i****th** card is `deck[i]`\.

You can order the deck in any order you want\. Initially, all the cards start face down \(unrevealed\) in one deck\.

You will do the following steps repeatedly until all cards are revealed:

1.  Take the top card of the deck, reveal it, and take it out of the deck\.
2.  If there are still cards in the deck then put the next top card of the deck at the bottom of the deck\.
3.  If there are still unrevealed cards, go back to step 1\. Otherwise, stop\.

Return _an ordering of the deck that would reveal the cards in increasing order_\.

**Note** that the first entry in the answer is considered to be the top of the deck\.

##### **Example 1:**

**Input:** deck = \[17,13,11,2,3,5,7\]

**Output:** \[2,13,3,11,5,17,7\]

**Explanation:**

We get the deck in the order \[17,13,11,2,3,5,7\] \(this order does not matter\), and reorder it\.

After reordering, the deck starts as \[2,13,3,11,5,17,7\], where 2 is the top of the deck\.

We reveal 2, and move 13 to the bottom\. The deck is now \[3,11,5,17,7,13\]\.

We reveal 3, and move 11 to the bottom\. The deck is now \[5,17,7,13,11\]\.

We reveal 5, and move 17 to the bottom\. The deck is now \[7,13,11,17\]\.

We reveal 7, and move 13 to the bottom\. The deck is now \[11,17,13\]\.

We reveal 11, and move 17 to the bottom\. The deck is now \[13,17\]\.

We reveal 13, and move 17 to the bottom\. The deck is now \[17\]\.

We reveal 17\.Since all the cards revealed are in increasing order, the answer is correct\.

##### **Example 2:**

**Input:** deck = \[1,1000\]

**Output:** \[1,1000\]

##### **Constraints:**

*   **1 <= deck\.length <= 1000**
*   **1 <= deck\[i\] <= 10****6**
*   All the values of `deck` are **unique**\.

#### [Solve it on LeetCode](https://leetcode.com/problems/reveal-cards-in-increasing-order)

# Approaches

## 1\. Simple Simulation

#### **Intuition:**

The core idea is to simulate the process as described in the problem:

*   Sort the deck to ensure that our cards are in increasing order\.
*   Use an additional array to reconstruct the sequence by following the steps outlined:

*   Take the top card and put it into a new deck\.
*   Move the next card to the bottom of the deck\.

*   This approach is straightforward but lacks efficiency due to manual simulation\.

#### **Code:**

Java

```java
class Solution {
   public int[] deckRevealedIncreasing(int[] deck) {
       // Sort the initial deck to process smallest to largest
       Arrays.sort(deck);
       int n = deck.length;
       LinkedList<Integer> index = new LinkedList<>();
       // Create a list of all indices in the deck
       for (int i = 0; i < n; i++) {
           index.add(i);
       }

       int[] result = new int[n];
       // Simulate the process
       for (int card : deck) {
           // Place the top card in the next available position
           result[index.poll()] = card;
           // Move the next topmost index to the bottom of the queue
           if (!index.isEmpty()) {
               index.add(index.poll());
           }
       }
       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N log N\) due to sorting where N is the number of cards\.
*   **Space Complexity:** O\(N\) for the auxiliary `index` list\.

## 2\. Optimized Approach Using Queue

#### **Intuition:**

The improved approach builds upon the simple simulation by efficiently managing indices using a queue:

*   First, the deck is sorted, so cards are processed from smallest to largest\.
*   Use a queue to track the order of indices based on the revelation process\.

*   This step mimics the effect of moving cards to the bottom after revealing\.

*   Place each card in the correct position using indices from the queue in a single pass\.

#### **Code:**

Java

```java
class Solution {
   public int[] deckRevealedIncreasing(int[] deck) {
       // Sort the deck so we can place cards from smallest to largest
       Arrays.sort(deck);
       int n = deck.length;
       Queue<Integer> indexQueue = new LinkedList<>();
       // Create a queue that holds indices from 0 to n-1
       for (int i = 0; i < n; i++) {
           indexQueue.add(i);
       }

       int[] result = new int[n];
       // For each card in the sorted deck, place it at the first index, then rotate the queue
       for (int card : deck) {
           // Place the current smallest card at the index popped from the queue
           result[indexQueue.poll()] = card;
           // Simulate rotation by moving the next index to the bottom of the queue
           if (!indexQueue.isEmpty()) {
               indexQueue.add(indexQueue.poll());
           }
       }
       return result;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N log N\) for sorting, and O\(N\) for queue operations, resulting in overall O\(N log N\)\.
*   **Space Complexity:** O\(N\) for maintaining the queue\.

View Animation