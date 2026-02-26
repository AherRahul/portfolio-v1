---
title: Online Stock Span
description: Master Online Stock Span in the Stacks module. Comprehensive guide
  and algorithmic problem solving.
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

Design an algorithm that collects daily price quotes for some stock and returns **the span** of that stock's price for the current day\.

The **span** of the stock's price in one day is the maximum number of consecutive days \(starting from that day and going backward\) for which the stock price was less than or equal to the price of that day\.

*   For example, if the prices of the stock in the last four days is `[7,2,1,2]` and the price of the stock today is `2`, then the span of today is `4` because starting from today, the price of the stock was less than or equal `2` for `4` consecutive days\.
*   Also, if the prices of the stock in the last four days is `[7,34,1,2]` and the price of the stock today is `8`, then the span of today is `3` because starting from today, the price of the stock was less than or equal `8` for `3` consecutive days\.

Implement the `StockSpanner` class:

*   `StockSpanner()` Initializes the object of the class\.
*   `int next(int price)` Returns the **span** of the stock's price given that today's price is `price`\.

##### **Example 1:**

**Input**

\["StockSpanner", "next", "next", "next", "next", "next", "next", "next"\]

\[\[\], \[100\], \[80\], \[60\], \[70\], \[60\], \[75\], \[85\]\]

**Output**

\[null, 1, 1, 1, 2, 1, 4, 6\]

**Explanation**

```java
StockSpanner stockSpanner = new StockSpanner();
stockSpanner.next(100); // return 1
stockSpanner.next(80);  // return 1
stockSpanner.next(60);  // return 1
stockSpanner.next(70);  // return 2
stockSpanner.next(60);  // return 1
stockSpanner.next(75);  // return 4, because the last 4 prices (including today's price of 75) were less than or equal to today's price.stockSpanner.next(85);  // return 6
```

##### **Constraints:**

*   **1 <= price <= 10****5**
*   At most `10``4` calls will be made to `next`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/online-stock-span)

# Approaches

## 1\. Brute Force

#### Intuition:

The brute force approach involves keeping track of all the stock prices encountered so far and then, for each new price, iterating backwards through the stored prices to calculate the span directly\. This means, for each price, we need to traverse backwards until a price higher than the current price is found\.

#### Steps:

1.  Initialize a list to store the stock prices\.
2.  For each new price, traverse backwards in the list:

*   Increase the span as long as prices are less than or equal to the current price\.

4.  Return the span once a higher price is found or the list is exhausted\.

#### Code:

Java

```java
class StockSpanner {
   private List<Integer> prices;

   public StockSpanner() {
       prices = new ArrayList<>();
   }

   public int next(int price) {
       prices.add(price);
       int span = 1;
       int index = prices.size() - 2;

       // Traverse backwards through the list
       while (index >= 0 && prices.get(index) <= price) {
           span++;
           index--;
       }

       return span;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n^2\) in the worst case for `n` calls to the `next` method because we might need to traverse all previous prices for each call\.
*   **Space Complexity:** O\(n\) for storing all the prices\.

## 2\. Using Stack

#### Intuition:

To optimize the previous approach, we can utilize a stack to maintain a history of price indices that help in quickly determining the span\. We store prices along with their respective spans in a stack\. Each time a price is added, all prices less than or equal to the current price are popped from the stack, effectively calculating the span in constant amortized time\.

#### Steps:

1.  Use a stack to store pairs of prices and their spans\.
2.  For each incoming price:

*   Pop elements from the stack while they are less than or equal to the current price and accumulate their spans\.
*   The span for the current price is the accumulated span plus one \(for the current price itself\)\.

4.  Push the current price and its calculated span onto the stack\.

#### Code:

Java

```java
class StockSpanner {
   private Stack<int[]> stack;

   public StockSpanner() {
       stack = new Stack<>();
   }

   public int next(int price) {
       int span = 1;

       // Pop elements with a price less than or equal to the current price
       while (!stack.isEmpty() && stack.peek()[0] <= price) {
           span += stack.pop()[1];
       }

       stack.push(new int[]{price, span});

       return span;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(1\) on average for each call to `next`, because each element is pushed and popped from the stack at most once\.
*   **Space Complexity:** O\(n\) for storing elements in the stack where `n` is the number of prices recorded\.