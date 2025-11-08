---
title: "Best Time to Buy and Sell Stocks I"
description: "Master the single transaction stock problem using carry forward technique. Learn how to find maximum profit with one buy and one sell operation efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Stock Problems"
    type: "reference"
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
    description: "Classic stock trading problem"
  - title: "Greedy Algorithms"
    type: "tool"
    url: "https://visualgo.net/en"
    description: "Visualize greedy approaches"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Best Time to Buy and Sell Stocks I
----------------------------

### Problem Statement:

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.

You want to maximize your profit by choosing a **single day to buy** one stock and choosing a **different day in the future to sell** that stock.

Return the **maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return `0`.

**Note:** You cannot sell a stock before you buy one.

### Examples:

#### Example 1:

**Input:** prices = [7, 1, 5, 3, 6, 4]

**Output:** 5

**Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.

#### Example 2:

**Input:** prices = [7, 6, 4, 3, 1]

**Output:** 0

**Explanation:** No profit possible as prices are strictly decreasing.

### Constraints:

* `1 ≤ prices.length ≤ 10^5`
* `0 ≤ prices[i] ≤ 10^4`

### Approach:

**Carry Forward (Optimal):**
Track minimum price seen so far and calculate profit at each step.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (const price of prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    
    return maxProfit;
}
```

### Key Takeaways:

1. **Carry forward minimum price** to find best selling opportunity.
2. **Single pass solution** with O(N) time complexity.
3. **Greedy approach** works for single transaction.
4. Must buy before selling (check future prices only).
5. Related to Kadane's algorithm pattern.

