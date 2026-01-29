---
title: "Best Time to Buy and Sell Stocks I"
description: "Master the single transaction stock problem using carry forward technique. Learn how to find maximum profit with one buy and one sell operation efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
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

## Problem Statement

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.

You want to maximize your profit by choosing a **single day to buy** one stock and choosing a **different day in the future to sell** that stock.

Return the **maximum profit** you can achieve from this transaction. If you cannot achieve any profit, return `0`.

**Important:** You cannot sell a stock before you buy one (must buy first, then sell).

**Input:**
- An integer array `prices[]` where `prices[i]` represents stock price on day `i`

**Output:**
- Return the maximum profit achievable from one buy + one sell transaction
- Return `0` if no profit is possible

---

## Examples

### Example 1:
**Input:** `prices = [7, 1, 5, 3, 6, 4]`  
**Output:** `5`

**Explanation:**
```
Buy on day 2 (price = 1)
Sell on day 5 (price = 6)
Profit = 6 - 1 = 5

Day:    1  2  3  4  5  6
Price:  7  1  5  3  6  4
        ↓  ↑        ↑
      Skip Buy    Sell
```

### Example 2:
**Input:** `prices = [7, 6, 4, 3, 1]`  
**Output:** `0`

**Explanation:**
```
Prices are strictly decreasing
No profitable transaction possible
Any buy-sell would result in loss

Day:    1  2  3  4  5
Price:  7  6  4  3  1
        ↓  ↓  ↓  ↓  ↓
      Continuously decreasing
```

### Example 3:
**Input:** `prices = [2, 4, 1, 7, 5]`  
**Output:** `6`

**Explanation:**
```
Buy on day 3 (price = 1)
Sell on day 4 (price = 7)
Profit = 7 - 1 = 6

Day:    1  2  3  4  5
Price:  2  4  1  7  5
              ↑  ↑
            Buy Sell
```

---

## Constraints

- `1 ≤ prices.length ≤ 10^5`
- `0 ≤ prices[i] ≤ 10^4`
- Only **one transaction** allowed (one buy + one sell)
- Must buy before selling
- Time limit: O(N) solution required
- Space limit: O(1) auxiliary space expected

---

## Important Points to Understand

1. **Single Transaction Only:**
   - Can only buy once and sell once
   - Cannot buy multiple times or sell multiple times
   - Must complete the cycle: buy → sell

2. **Temporal Constraint:**
   - Must buy BEFORE selling
   - Cannot sell on the same day or before buying
   - Sell day index must be > buy day index

3. **Profit Calculation:**
   - Profit = Selling Price - Buying Price
   - Want to maximize: Sell High - Buy Low
   - Minimum buy price and maximum future sell price

4. **Greedy Insight:**
   - Track the minimum price seen so far
   - At each day, check if selling today gives better profit
   - Don't need to remember exact buy/sell days, just max profit

5. **Carry Forward Technique:**
   - Carry forward the minimum price
   - This avoids nested loops (O(N²) → O(N))

---

## Approach

### Optimal Strategy: Carry Forward Minimum Price

**Core Idea:**
- As we traverse the array, maintain the minimum price seen so far
- At each position, calculate potential profit if we sell today
- Track the maximum profit achievable

**Algorithm:**
1. Initialize `minPrice = Infinity` and `maxProfit = 0`
2. For each price in the array:
   - Update `minPrice` if current price is lower
   - Calculate profit if selling today: `profit = currentPrice - minPrice`
   - Update `maxProfit` if this profit is better
3. Return `maxProfit`

**Why this works:**
- We always know the cheapest buying price up to current day
- We can calculate the best profit if we sell on current day
- By checking every day, we find the global maximum profit

---

## Time Complexity

**Optimal Solution: O(N)**
- Single pass through the array: O(N)
- Constant time operations at each step: O(1)
- Total: O(N)

**Brute Force: O(N²)**
- For each day i, check all future days j where j > i
- Nested loops: O(N²)
- Not acceptable for large inputs (10^5 elements)

---

## Space Complexity

**Optimal Solution: O(1)**
- Only two variables: `minPrice` and `maxProfit`
- No additional data structures needed
- Constant auxiliary space

---

## Dry Run

Let's trace through **prices = [7, 1, 5, 3, 6, 4]**:

```
Initialize: minPrice = ∞, maxProfit = 0

Day 1: price = 7
  minPrice = min(∞, 7) = 7
  profit = 7 - 7 = 0
  maxProfit = max(0, 0) = 0

Day 2: price = 1
  minPrice = min(7, 1) = 1
  profit = 1 - 1 = 0
  maxProfit = max(0, 0) = 0

Day 3: price = 5
  minPrice = min(1, 5) = 1
  profit = 5 - 1 = 4
  maxProfit = max(0, 4) = 4  ← Profit improved!

Day 4: price = 3
  minPrice = min(1, 3) = 1
  profit = 3 - 1 = 2
  maxProfit = max(4, 2) = 4

Day 5: price = 6
  minPrice = min(1, 6) = 1
  profit = 6 - 1 = 5
  maxProfit = max(4, 5) = 5  ← Profit improved!

Day 6: price = 4
  minPrice = min(1, 4) = 1
  profit = 4 - 1 = 3
  maxProfit = max(5, 3) = 5

Final: maxProfit = 5
```

---

## Brute Force Approach

**Naive Solution:** Check all possible buy-sell pairs

```javascript
function maxProfitBruteForce(prices) {
    const N = prices.length;
    let maxProfit = 0;
    
    // Try every possible buy day
    for (let buy = 0; buy < N - 1; buy++) {
        // Try every possible sell day after buy day
        for (let sell = buy + 1; sell < N; sell++) {
            const profit = prices[sell] - prices[buy];
            maxProfit = Math.max(maxProfit, profit);
        }
    }
    
    return maxProfit;
}

console.log(maxProfitBruteForce([7, 1, 5, 3, 6, 4])); 
// Output: 5
```

**Problems:**
- **Time Complexity:** O(N²) - nested loops
- **Space Complexity:** O(1)
- **Inefficient:** For N=10^5, this results in 10^10 operations
- **Timeout:** Will exceed time limit for large inputs

---

## Visualization

### Price Movement and Profit Calculation:

```
Prices: [7, 1, 5, 3, 6, 4]

 7 |●
 6 |          ●       Best Sell (6)
 5 |      ●              
 4 |                  ●
 3 |        ●
 2 |
 1 |  ●  ← Best Buy (1)
   +--+--+--+--+--+--
      1  2  3  4  5  6  (Days)

Maximum Profit = 6 - 1 = 5
```

### Carry Forward Minimum:

```
prices:   [7,  1,  5,  3,  6,  4]
minPrice: [7,  1,  1,  1,  1,  1]  ← Minimum price so far
profit:   [0,  0,  4,  2,  5,  3]  ← If we sell today
maxProfit:        ↑           ↑
                  4           5 (final answer)
```

---

## Multiple Optimized Approaches

### Approach 1: Carry Forward (Most Intuitive)

```javascript
function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (let i = 0; i < prices.length; i++) {
        // Update minimum price if we found a lower price
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        }
        // Calculate profit if we sell today
        else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
}
```

**Time:** O(N) | **Space:** O(1)

### Approach 2: Single Pass with Math.max/min

```javascript
function maxProfitConcise(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (const price of prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    
    return maxProfit;
}
```

**Time:** O(N) | **Space:** O(1)
**Note:** Most concise and elegant solution

### Approach 3: Track Buy Index (If indices needed)

```javascript
function maxProfitWithIndices(prices) {
    let minPrice = prices[0];
    let minIndex = 0;
    let maxProfit = 0;
    let buyDay = 0, sellDay = 0;
    
    for (let i = 1; i < prices.length; i++) {
        const profit = prices[i] - minPrice;
        
        if (profit > maxProfit) {
            maxProfit = profit;
            buyDay = minIndex;
            sellDay = i;
        }
        
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            minIndex = i;
        }
    }
    
    console.log(`Buy on day ${buyDay + 1}, Sell on day ${sellDay + 1}`);
    return maxProfit;
}
```

**Time:** O(N) | **Space:** O(1)
**Use when:** Need to return buy/sell days

---

## Edge Cases to Consider

1. **Single Day:**
   - Input: `prices = [5]`
   - Output: `0`
   - Cannot make any transaction

2. **Strictly Decreasing:**
   - Input: `prices = [5, 4, 3, 2, 1]`
   - Output: `0`
   - No profitable transaction

3. **Strictly Increasing:**
   - Input: `prices = [1, 2, 3, 4, 5]`
   - Output: `4` (buy on day 1, sell on day 5)
   - Maximum profit = 5 - 1 = 4

4. **All Same Prices:**
   - Input: `prices = [3, 3, 3, 3]`
   - Output: `0`
   - No profit opportunity

5. **Large Numbers:**
   - Input: `prices = [10000, 1, 10000]`
   - Output: `9999`
   - Handle large price differences

6. **Zero Prices:**
   - Input: `prices = [0, 5, 0, 5]`
   - Output: `5`
   - Buy at 0, sell at 5

---

## JavaScript Code

```javascript
/**
 * Best Time to Buy and Sell Stock - Optimal Solution
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
function maxProfit(prices) {
    // Edge case: empty or single element
    if (!prices || prices.length < 2) {
        return 0;
    }
    
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (const price of prices) {
        // Update minimum buying price
        minPrice = Math.min(minPrice, price);
        
        // Calculate profit if selling today
        const profit = price - minPrice;
        
        // Update maximum profit
        maxProfit = Math.max(maxProfit, profit);
    }
    
    return maxProfit;
}

// Example Usage:
console.log("Example 1:");
console.log(maxProfit([7, 1, 5, 3, 6, 4]));  // Output: 5

console.log("\nExample 2:");
console.log(maxProfit([7, 6, 4, 3, 1]));     // Output: 0

console.log("\nExample 3:");
console.log(maxProfit([2, 4, 1, 7, 5]));     // Output: 6

console.log("\nEdge Cases:");
console.log(maxProfit([5]));                  // Output: 0
console.log(maxProfit([1, 2, 3, 4, 5]));     // Output: 4
console.log(maxProfit([3, 3, 3, 3]));        // Output: 0
```

---

## Key Takeaways

1. **Carry Forward Pattern:** Track minimum value while traversing to avoid nested loops

2. **Greedy Works:** For single transaction, greedy approach gives optimal solution

3. **Time Optimization:** Reduced from O(N²) brute force to O(N) optimal

4. **Space Efficiency:** Only need two variables, achieving O(1) space

5. **Real-World Application:** Models many "buy low, sell high" optimization problems

6. **Related to Kadane's:** Similar pattern to maximum subarray sum problem

7. **LeetCode Classic:** One of the most common interview questions (#121)

8. **Foundation Problem:** Understanding this helps with multi-transaction variants

9. **Single Pass:** Can solve in one traversal without looking back

10. **Interview Tip:** Start with brute force, explain optimization, implement optimal solution

