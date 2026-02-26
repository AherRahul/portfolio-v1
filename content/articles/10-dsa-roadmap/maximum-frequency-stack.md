---
title: Maximum Frequency Stack
description: Master Maximum Frequency Stack in the Data Structure Design module.
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

Design a stack\-like data structure to push elements to the stack and pop the most frequent element from the stack\.

Implement the `FreqStack` class:

*   `FreqStack()` constructs an empty frequency stack\.
*   `void push(int val)` pushes an integer `val` onto the top of the stack\.
*   `int pop()` removes and returns the most frequent element in the stack\.

*   If there is a tie for the most frequent element, the element closest to the stack's top is removed and returned\.

**Example 1:**

**Input**

\["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"\]

\[\[\], \[5\], \[7\], \[5\], \[7\], \[4\], \[5\], \[\], \[\], \[\], \[\]\]

**Output**

\[null, null, null, null, null, null, null, 5, 7, 5, 4\]

**Explanation**

```java
FreqStack freqStack = new FreqStack();
freqStack.push(5); // The stack is [5]
freqStack.push(7); // The stack is [5,7]
freqStack.push(5); // The stack is [5,7,5]
freqStack.push(7); // The stack is [5,7,5,7]
freqStack.push(4); // The stack is [5,7,5,7,4]
freqStack.push(5); // The stack is [5,7,5,7,4,5]
freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,5,7,4].
freqStack.pop();   // return 7, as 5 and 7 is the most frequent, but 7 is closest to the top. The stack becomes [5,7,5,4].
freqStack.pop();   // return 5, as 5 is the most frequent. The stack becomes [5,7,4].
freqStack.pop();   // return 4, as 4, 5 and 7 is the most frequent, but 4 is closest to the top. The stack becomes [5,7].
```

#### **Constraints:**

*   **0 <= val <= 10****9**
*   At most `2 * 10``4` calls will be made to `push` and `pop`\.
*   It is guaranteed that there will be at least one element in the stack before calling `pop`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-frequency-stack)

# Approaches

## 1\. Brute\-force with Stack

#### **Intuition:**

The problem requires us to mimic a stack but with the constraint of popping the most frequent element\. If there is a tie in frequency, the most recently pushed element should be popped first\.

A basic approach is to maintain a simple stack and a frequency counter dictionary to keep track of the element count\. On popping, we traverse the stack from top to bottom to find the element with the maximum frequency\.

#### **Code:**

Java

```java
class FreqStack {
   private Stack<Integer> stack;
   private Map<Integer, Integer> freqCount;

   public FreqStack() {
       stack = new Stack<>();
       freqCount = new HashMap<>();
   }
   
   public void push(int val) {
       stack.push(val);
       freqCount.put(val, freqCount.getOrDefault(val, 0) + 1);
   }
   
   public int pop() {
       int mostFreq = 0;
       int val = 0;
       
       // find the element with the maximum frequency
       for (int i = stack.size() - 1; i >= 0; i--) {
           int element = stack.get(i);
           int count = freqCount.get(element);
           if (count > mostFreq) {
               mostFreq = count;
               val = element;
           }
       }
       
       // update the stack and frequency count
       stack.remove(stack.lastIndexOf(val));
       freqCount.put(val, mostFreq - 1);
       
       return val;
   }
}
```

Complexity Analysis

*   **Time Complexity:**

*   `push(val)`: O\(1\) each time we push an element\.
*   `pop()`: O\(n\) since we have to traverse the whole stack to find the element with the maximum frequency\.

*   **Space Complexity:** O\(n\) where n is the number of elements in the stack\.

## 2\. Frequency and Grouped Stacks

#### **Intuition:**

To optimize, we can use two hash maps:

*   `frequency` to keep track of the number of occurrences of each element\.
*   `group` to organize elements by their frequency, where each index in `group` represents a stack of elements with that frequency\.

This ensures that when we are popping, we can instantly retrieve the most frequent and recent element by looking at the top element of the stack at the current maximum frequency\.

#### **Code:**

Java

```java
class FreqStack {
   private Map<Integer, Integer> frequencyMap;
   private Map<Integer, Stack<Integer>> groupStackMap;
   private int maxFrequency;

   public FreqStack() {
       frequencyMap = new HashMap<>();
       groupStackMap = new HashMap<>();
       maxFrequency = 0;
   }
   
   public void push(int val) {
       int freq = frequencyMap.getOrDefault(val, 0) + 1;
       frequencyMap.put(val, freq);
       
       if (freq > maxFrequency) {
           maxFrequency = freq;
       }
       
       groupStackMap.computeIfAbsent(freq, z -> new Stack<>()).push(val);
   }
   
   public int pop() {
       Stack<Integer> stack = groupStackMap.get(maxFrequency);
       int val = stack.pop();
       
       frequencyMap.put(val, frequencyMap.get(val) - 1);
       
       if (stack.isEmpty()) {
           maxFrequency--;
       }
       
       return val;
   }
}
```

Complexity Analysis

*   **Time Complexity:**

*   `push(val)`: O\(1\) since we just increment counters and update stacks\.
*   `pop()`: O\(1\) for directly accessing and popping from the stack of the maximum frequency\.

*   **Space Complexity:** O\(n\) where n is the number of elements in the stack\.