---
title: "Best Time to Buy and Sell Stocks"
description: "Master the Last-In-First-Out (LIFO) principle. Learn stack operations, expression evaluation, backtracking algorithms, and real-world applications of stack data structures."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Stack Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive stack operations visualization"
  - title: "Stack Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/stack/"
    description: "Practice problems for mastering stack algorithms"
  - title: "Call Stack Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack"
    description: "Understanding function call stacks in JavaScript"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


Best Time to Buy and Sell Stocks 
-------------------------------------

### Problem Statement:
You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.

<br />

#### Example 1:

**Input:** prices = \[7, 1, 5, 3, 6, 4\]

**Output:** 5

`Explanation:` Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 – 1 = 5.

<br />

#### Example 2:

**Input:** prices = \[7,6,4,3,1\]

**Output:** 0

`Explanation:` Explanation: In this case, no transactions are done and the max profit = 0.

### Constraints:

*   1 <= prices.length <= 105
*   0 <= prices\[i\] <= 104

### Approach: Brute Force

*   Initialize `maxProfit = 0`.
*   Use two nested loops.
*   Outer loop picks a day `i`to buy the stock.
*   Inner loop picks a day `j > i` to sell the stock.
*   For every pair `(i, j)`, calculate the profit: `prices[j] - prices[i]`.
*   If this profit is greater than `maxProfit`, update `maxProfit`.

### Time Complexity:

*   **Time Complexity = O(n2)** Two nested loops. For every element i, check all j > i. Total comparisons = n(n-1)/2 → O(n²)
    

### Space Complexity:

*   **Space Complexity = O(1)** No extra data structures used. Only uses a variable maxProfit.
    

### Dry Run

```
Input: prices = [7, 1, 5, 3, 6, 4]

i = 0, prices[i] = 7
   j = 1 → 1 - 7 = -6 → maxProfit = 0
   j = 2 → 5 - 7 = -2 → maxProfit = 0
   j = 3 → 3 - 7 = -4 → maxProfit = 0
   j = 4 → 6 - 7 = -1 → maxProfit = 0
   j = 5 → 4 - 7 = -3 → maxProfit = 0

i = 1, prices[i] = 1
   j = 2 → 5 - 1 = 4 → maxProfit = 4
   j = 3 → 3 - 1 = 2 → maxProfit = 4
   j = 4 → 6 - 1 = 5 → maxProfit = 5
   j = 5 → 4 - 1 = 3 → maxProfit = 5

i = 2, prices[i] = 5
   j = 3 → 3 - 5 = -2 → maxProfit = 5
   j = 4 → 6 - 5 = 1 → maxProfit = 5
   j = 5 → 4 - 5 = -1 → maxProfit = 5

... and so on.

Final maxProfit = 5 (buy at 1, sell at 6)
  

Output: 5
```

## Visualisation:

![Stocks](https://namastedev.com/blog/wp-content/uploads/2025/06/Screenshot-2025-06-27-at-12.58.36 PM.png)

### JavaScript Code

```javascript

function maxProfit(prices) {
  let minPrice = Infinity;  // Track the minimum price so far
  let maxProfit = 0;        // Track the maximum profit possible

  for (let price of prices) {
    // Update minPrice if a lower price is found
    if (price < minPrice) {
      minPrice = price;
    }

    // Calculate potential profit at this price
    const profit = price - minPrice;

    // Update maxProfit if this profit is higher
    if (profit > maxProfit) {
      maxProfit = profit;
    }
  }

  return maxProfit;
}
    
```

### Key Insight

* Keep track of the lowest price so far (minPrice).
* At each step, calculate the profit if sold today.
* Keep the maximum profit seen so far.