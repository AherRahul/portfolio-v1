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
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

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

### Important Points to Understand:

**1. Single Transaction:**
* Can only buy once and sell once.
* Must buy before selling (can't sell then buy).

**2. Greedy Approach:**
* Track minimum price seen so far.
* At each day, calculate profit if sold today.
* Update maximum profit if current profit is higher.

**3. One Pass Solution:**
* Don't need to check all pairs (would be O(N²)).
* Single pass with tracking minPrice gives O(N).

**4. Profit Calculation:**
* Profit = Selling Price - Buying Price
* If no profit possible, return 0.

### Multiple Optimized Approaches:

**Approach 1: Track Min Price (Optimal)**
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

**Time:** O(N) ✓
**Space:** O(1) ✓

**Approach 2: Kadane's Algorithm Style**
```javascript
function maxProfit(prices) {
    let maxProfit = 0;
    let minPrice = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else {
            const profit = prices[i] - minPrice;
            maxProfit = Math.max(maxProfit, profit);
        }
    }
    
    return maxProfit;
}
```

### Edge Cases to Consider:

**1. Empty Array:**
* Input: prices = []
* Output: 0 (no transactions possible)

**2. Single Day:**
* Input: prices = [5]
* Output: 0 (need at least 2 days)

**3. Strictly Decreasing:**
* Input: prices = [7, 6, 4, 3, 1]
* Output: 0 (no profit possible)

**4. Strictly Increasing:**
* Input: prices = [1, 2, 3, 4, 5]
* Output: 4 (buy at 1, sell at 5)

**5. All Same Price:**
* Input: prices = [5, 5, 5, 5]
* Output: 0 (no profit)

**6. Maximum Profit at End:**
* Input: prices = [2, 1, 2, 1, 0, 1, 2]
* Output: 2 (buy at 0, sell at 2)

**7. Maximum Profit in Middle:**
* Input: prices = [3, 1, 4, 1]
* Output: 3 (buy at 1, sell at 4)

### Key Takeaways:

1. **Greedy algorithm** works perfectly for this single-transaction problem.

2. **Track minimum:** Always track the minimum price seen so far.

3. **Calculate at each step:** For each price, calculate what profit would be if sold today.

4. **One pass solution:** O(N) time is optimal.

5. **No sorting:** Don't sort! Would lose the time ordering.

6. **Applications:**
   * Stock trading algorithms
   * Timing optimization
   * Peak-valley finding
   * Time series analysis

7. **Interview strategy:**
   * Start with brute force (nested loops) explanation.
   * Optimize to single pass with min tracking.
   * Explain why we track minimum.
   * Walk through an example.
   * Discuss edge cases (decreasing prices).

8. **Common mistakes:**
   * Sorting the array (loses time information).
   * Not handling decreasing prices.
   * Selling before buying (checking wrong direction).
   * Not initializing minPrice properly.

9. **Related problems:**
   * Best Time to Buy and Sell Stock II (multiple transactions).
   * Best Time to Buy and Sell Stock III (at most 2 transactions).
   * Best Time to Buy and Sell Stock with Cooldown.
   * Best Time to Buy and Sell Stock with Transaction Fee.

10. **Extension:** This is foundation for more complex stock problems with multiple transactions or constraints.