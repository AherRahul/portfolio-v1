---
title: Stock Price Fluctuation
description: Master Stock Price Fluctuation in the BST / Ordered Set module.
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

You are given a stream of **records** about a particular stock\. Each record contains a **timestamp** and the corresponding **price** of the stock at that timestamp\.

Unfortunately due to the volatile nature of the stock market, the records do not come in order\. Even worse, some records may be incorrect\. Another record with the same timestamp may appear later in the stream **correcting** the price of the previous wrong record\.

Design an algorithm that:

*   **Updates** the price of the stock at a particular timestamp, **correcting** the price from any previous records at the timestamp\.
*   Finds the **latest price** of the stock based on the current records\. The **latest price** is the price at the latest timestamp recorded\.
*   Finds the **maximum price** the stock has been based on the current records\.
*   Finds the **minimum price** the stock has been based on the current records\.

Implement the `StockPrice` class:

*   `StockPrice()` Initializes the object with no price records\.
*   `void update(int timestamp, int price)` Updates the `price` of the stock at the given `timestamp`\.
*   `int current()` Returns the **latest price** of the stock\.
*   `int maximum()` Returns the **maximum price** of the stock\.
*   `int minimum()` Returns the **minimum price** of the stock\.

##### **Example 1:**

**Input**

\["StockPrice", "update", "update", "current", "maximum", "update", "maximum", "update", "minimum"\]

\[\[\], \[1, 10\], \[2, 5\], \[\], \[\], \[1, 3\], \[\], \[4, 2\], \[\]\]

**Output**

\[null, null, null, 5, 10, null, 5, null, 2\]

**Explanation**

```java
StockPrice stockPrice = new StockPrice();
stockPrice.update(1, 10); // Timestamps are [1] with corresponding prices [10].
stockPrice.update(2, 5);  // Timestamps are [1,2] with corresponding prices [10,5].
stockPrice.current();     // return 5, the latest timestamp is 2 with the price being 5.
stockPrice.maximum();     // return 10, the maximum price is 10 at timestamp 1.
stockPrice.update(1, 3);  // The previous timestamp 1 had the wrong price, so it is updated to 3.
                          // Timestamps are [1,2] with corresponding prices [3,5].
stockPrice.maximum();     // return 5, the maximum price is 5 after the correction.
stockPrice.update(4, 2);  // Timestamps are [1,2,4] with corresponding prices [3,5,2].
stockPrice.minimum();     // return 2, the minimum price is 2 at timestamp 4.
```

##### **Constraints:**

*   **1 <= timestamp, price <= 10****9**
*   At most **10****5** calls will be made **in total** to `update`, `current`, `maximum`, and `minimum`\.
*   `current`, `maximum`, and `minimum` will be called **only after** `update` has been called **at least once**\.

#### [Solve it on LeetCode](https://leetcode.com/problems/stock-price-fluctuation/)

# Approaches

## 1\. Brute Force with List

#### Intuition:

The brute force approach is fairly straightforward\. We maintain a list of pairs and simply update or query the list as required\. This approach will straightforwardly tackle the problem but will have inefficiencies especially given the constraints\.

#### Code:

Java

```java
class StockPrice {
   private List<int[]> prices;
   private int maxTimestamp;
   
   public StockPrice() {
       prices = new ArrayList<>();
       maxTimestamp = 0;
   }
   
   public void update(int timestamp, int price) {
       maxTimestamp = Math.max(maxTimestamp, timestamp);
       boolean found = false;
       for (int[] entry : prices) {
           if (entry[0] == timestamp) {
               entry[1] = price;
               found = true;
               break;
           }
       }
       if (!found) {
           prices.add(new int[]{timestamp, price});
       }
   }
   
   public int current() {
       for (int[] entry : prices) {
           if (entry[0] == maxTimestamp) {
               return entry[1];
           }
       }
       return -1; // This line should never be reached.
   }

   public int maximum() {
       int maxPrice = Integer.MIN_VALUE;
       for (int[] entry : prices) {
           maxPrice = Math.max(maxPrice, entry[1]);
       }
       return maxPrice;
   }

   public int minimum() {
       int minPrice = Integer.MAX_VALUE;
       for (int[] entry : prices) {
           minPrice = Math.min(minPrice, entry[1]);
       }
       return minPrice;
   }
}
```

#### Complexity Analysis:

Complexity Analysis

*   **Time Complexity:** 

*   `update`: O\(n\) where n is the number of prices, as we might need to traverse the entire list to update a price\.
*   `current`: O\(n\) to find the current price matching the maximum timestamp\.
*   `maximum` and `minimum`: O\(n\) each to find the maximum and minimum prices\.

*   **Space Complexity:** O\(n\) since we store up to n timestamps and prices\.

## 2\. Using HashMap for Tracking Prices

#### Intuition:

Using a HashMap allows for more efficient updates\. By keeping track of the prices with their timestamps in a map, the update and current operations become more efficient\. However, we still need list\-like structures to calculate max and min in a straightforward method or employ further structures to maintain these values efficiently\.

#### Code:

Java

```java
class StockPrice {
   private HashMap<Integer, Integer> priceMap;
   private int maxTimestamp;
   
   public StockPrice() {
       priceMap = new HashMap<>();
       maxTimestamp = 0;
   }
   
   public void update(int timestamp, int price) {
       priceMap.put(timestamp, price);
       maxTimestamp = Math.max(maxTimestamp, timestamp);
   }
   
   public int current() {
       return priceMap.get(maxTimestamp);
   }

   public int maximum() {
       int maxPrice = Integer.MIN_VALUE;
       for (int price : priceMap.values()) {
           maxPrice = Math.max(maxPrice, price);
       }
       return maxPrice;
   }

   public int minimum() {
       int minPrice = Integer.MAX_VALUE;
       for (int price : priceMap.values()) {
           minPrice = Math.min(minPrice, price);
       }
       return minPrice;
   }
}
```

Complexity Analysis

*   **Time Complexity**:

*   `update` and `current`: O\(1\) due to HashMap operations\.
*   `maximum` and `minimum`: O\(n\) because we still have to possibly traverse all prices\.

*   **Space Complexity**: O\(n\) for storing n entries in the map\.

## 3\. Using TreeMap for Efficient Ordering

#### Intuition:

TreeMap inherently sorts its keys, providing a way to efficiently find min and max along with an easy way to get the current price using the highest timestamp\. This allows all operations to be more efficient except adding or removing, which are logarithmic due to the properties of the TreeMap\.

#### Code:

Java

```java
class StockPrice {
   private TreeMap<Integer, Integer> prices;
   private TreeMap<Integer, Integer> count;
   private int maxTimestamp;
   
   public StockPrice() {
       prices = new TreeMap<>();
       count = new TreeMap<>();
       maxTimestamp = 0;
   }
   
   public void update(int timestamp, int price) {
       if (prices.containsKey(timestamp)) {
           int oldPrice = prices.get(timestamp);
           count.put(oldPrice, count.get(oldPrice) - 1);
           if (count.get(oldPrice) == 0) {
               count.remove(oldPrice);
           }
       }
       prices.put(timestamp, price);
       count.put(price, count.getOrDefault(price, 0) + 1);
       maxTimestamp = Math.max(maxTimestamp, timestamp);
   }
   
   public int current() {
       return prices.get(maxTimestamp);
   }

   public int maximum() {
       return count.lastKey();
   }

   public int minimum() {
       return count.firstKey();
   }
}
```

Complexity Analysis

*   **Time Complexity**:

*   `update`: O\(log n\) for both adding the new timestamp\-price pair and updating counting in the `count` map\.
*   `current`: O\(1\) using TreeMap's floor function\.
*   `maximum` and `minimum`: O\(1\) to directly access the max and min keys in the `count` TreeMap\.

*   **Space Complexity**: O\(n\) as we store prices and counts for up to n different timestamps\.