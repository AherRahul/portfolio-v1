---
title: "Knapsack & Optimization Problems"
description: "Solve complex optimization challenges. Master 0/1 knapsack, unbounded knapsack, and subset sum problems using dynamic programming approaches."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
  - knapsack
resources:
  - title: "Knapsack Problem Visualizer"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Interactive visualization of knapsack algorithm execution"
  - title: "Optimization Theory"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Knapsack_problem"
    description: "Mathematical foundations of knapsack and optimization problems"
  - title: "Knapsack Practice Problems"
    type: "practice"
    url: "https://leetcode.com/tag/dynamic-programming/"
    description: "Comprehensive collection of knapsack and optimization challenges"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/34/knapsack.png)

Knapsack & Optimization Problems – The Art of Resource Maximization
--------------------------------------------------------------------

Imagine you're the **Chief Resource Officer** 💼 at a **global exploration company** preparing for a **critical expedition** where **every decision about what to carry** could mean the **difference between mission success and catastrophic failure**:

**🎯 The Ultimate Resource Challenge:**

**🏔️ Scenario 1: Space Mission Equipment Selection (0/1 Knapsack)**
```
Mission: Mars exploration with 500kg weight limit
Challenge: Select from 50 critical items, each with specific weight and importance
Constraint: Each item can be taken at most once (binary choice)
Examples:
- Oxygen generator: 100kg, value = 1000 (life critical)
- Scientific instruments: 50kg, value = 300 (mission objective)
- Communication equipment: 30kg, value = 500 (safety)
- Food supplies: 80kg, value = 200 (survival)

Goal: Maximize mission success value within weight constraints
```

**🏭 Scenario 2: Factory Production Optimization (Unbounded Knapsack)**
```
Mission: Maximize profit with unlimited raw materials
Challenge: Decide how many of each product type to manufacture
Constraint: Limited factory capacity (time/space)
Examples:
- Product A: 2 hours, profit = $50 (can make multiple)
- Product B: 5 hours, profit = $120 (can make multiple)  
- Product C: 3 hours, profit = $70 (can make multiple)

Goal: Maximize total profit within capacity constraints
```

**💰 Scenario 3: Investment Portfolio Selection (Subset Sum)**
```
Mission: Achieve exact target investment amount
Challenge: Select investments that sum to precise budget
Constraint: Each investment is indivisible (binary choice)
Examples: 
- Investments: [$5000, $3000, $8000, $2000, $1000]
- Target budget: $10,000
- Question: Can we achieve exactly $10,000?

Goal: Determine feasibility and find optimal combination
```

**💡 The Optimization Mastery Principle:**
**Knapsack problems** represent the **fundamental pattern** of **resource optimization** - making **optimal choices under constraints**. Mastering these patterns provides the **analytical framework** for solving **complex real-world optimization challenges** from **logistics to finance to engineering**.


## The Theoretical Foundation

### Understanding Optimization Problems

**Core Optimization Components:**
1. **Decision Variables**: What choices can we make?
2. **Objective Function**: What are we trying to optimize?
3. **Constraints**: What limits our choices?
4. **Feasible Region**: What combinations are valid?

**Knapsack Problem Classification:**
- **0/1 Knapsack**: Each item can be selected at most once
- **Unbounded Knapsack**: Items can be selected multiple times  
- **Bounded Knapsack**: Each item has a specific quantity limit
- **Multi-dimensional**: Multiple constraints (weight, volume, cost)

### Mathematical Formulation

**0/1 Knapsack:**
```
Maximize: Σ(vᵢ × xᵢ) where xᵢ ∈ {0, 1}
Subject to: Σ(wᵢ × xᵢ) ≤ W
```

**Why DP Works:**
- **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
- **Overlapping Subproblems**: Same subproblems appear multiple times in recursion
- **State Definition**: dp[i][w] = optimal value using first i items with capacity w


## 1. Classic 0/1 Knapsack Problem

### The Foundation: Binary Choice Optimization

```javascript
/**
 * 0/1 Knapsack Problem - Each item can be taken at most once
 * Classic optimization DP with binary choices
 */

function knapsack01(items, capacity) {
    console.log(`=== 0/1 Knapsack Problem ===`);
    console.log(`Capacity: ${capacity}`);
    console.log("Items:");
    items.forEach((item, i) => {
        console.log(`  ${i}: weight=${item.weight}, value=${item.value}, ratio=${(item.value/item.weight).toFixed(2)}`);
    });
    
    const n = items.length;
    
    // dp[i][w] = maximum value using first i items with capacity w
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    
    console.log("\nBuilding DP table:");
    
    for (let i = 1; i <= n; i++) {
        const currentItem = items[i - 1];
        console.log(`\nProcessing item ${i-1}: weight=${currentItem.weight}, value=${currentItem.value}`);
        
        for (let w = 0; w <= capacity; w++) {
            // Option 1: Don't take current item
            const exclude = dp[i - 1][w];
            
            // Option 2: Take current item (if it fits)
            let include = 0;
            if (currentItem.weight <= w) {
                include = currentItem.value + dp[i - 1][w - currentItem.weight];
            }
            
            dp[i][w] = Math.max(exclude, include);
            
            if (w % 5 === 0 || w === capacity) {  // Print key capacities
                console.log(`  w=${w}: exclude=${exclude}, include=${include}, dp[${i}][${w}]=${dp[i][w]}`);
            }
        }
    }
    
    console.log("\nFinal DP table (last few rows):");
    printKnapsackTable(dp, items, Math.max(0, n - 3), capacity);
    
    return dp[n][capacity];
}

function printKnapsackTable(dp, items, startRow, capacity) {
    const n = dp.length - 1;
    
    // Print header
    console.log("    w:", Array.from({ length: Math.min(capacity + 1, 11) }, (_, i) => i.toString().padStart(4)).join(""));
    
    for (let i = startRow; i <= n; i++) {
        const itemLabel = i === 0 ? "none" : `i${i-1}`;
        const row = Array.from({ length: Math.min(capacity + 1, 11) }, (_, w) => dp[i][w].toString().padStart(4)).join("");
        console.log(`${itemLabel.padStart(4)}: ${row}`);
    }
    
    if (capacity > 10) {
        console.log("... (showing first 11 columns)");
    }
}

// Knapsack with path reconstruction
function knapsack01WithPath(items, capacity) {
    console.log(`\n=== 0/1 Knapsack with Path Reconstruction ===`);
    
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    
    // Build DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            const exclude = dp[i - 1][w];
            let include = 0;
            
            if (items[i - 1].weight <= w) {
                include = items[i - 1].value + dp[i - 1][w - items[i - 1].weight];
            }
            
            dp[i][w] = Math.max(exclude, include);
        }
    }
    
    // Reconstruct solution
    const selectedItems = [];
    let w = capacity;
    
    console.log("Reconstructing optimal solution:");
    
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            // Item i-1 was included
            selectedItems.unshift(i - 1);
            w -= items[i - 1].weight;
            console.log(`Item ${i-1} included: weight=${items[i-1].weight}, value=${items[i-1].value}`);
        } else {
            console.log(`Item ${i-1} excluded`);
        }
    }
    
    const totalWeight = selectedItems.reduce((sum, idx) => sum + items[idx].weight, 0);
    const totalValue = selectedItems.reduce((sum, idx) => sum + items[idx].value, 0);
    
    console.log(`\nOptimal solution:`);
    console.log(`Selected items: [${selectedItems.join(', ')}]`);
    console.log(`Total weight: ${totalWeight}/${capacity}`);
    console.log(`Total value: ${totalValue}`);
    
    return {
        maxValue: dp[n][capacity],
        selectedItems,
        totalWeight,
        totalValue
    };
}

// Space-optimized version
function knapsack01Optimized(items, capacity) {
    console.log(`\n=== Space-Optimized 0/1 Knapsack ===`);
    
    // Only need current and previous row
    let prev = new Array(capacity + 1).fill(0);
    let curr = new Array(capacity + 1).fill(0);
    
    console.log("Space-optimized computation:");
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`\nProcessing item ${i}: weight=${item.weight}, value=${item.value}`);
        
        for (let w = 0; w <= capacity; w++) {
            const exclude = prev[w];
            let include = 0;
            
            if (item.weight <= w) {
                include = item.value + prev[w - item.weight];
            }
            
            curr[w] = Math.max(exclude, include);
        }
        
        // Swap arrays for next iteration
        [prev, curr] = [curr, prev];
        
        console.log(`Current state: [${prev.slice(0, Math.min(11, capacity + 1)).join(', ')}]${capacity > 10 ? '...' : ''}`);
    }
    
    return prev[capacity];
}

// Run examples
console.log("=== 0/1 Knapsack Examples ===");

const items = [
    { weight: 2, value: 3 },   // Item 0
    { weight: 3, value: 4 },   // Item 1  
    { weight: 4, value: 5 },   // Item 2
    { weight: 5, value: 6 },   // Item 3
    { weight: 1, value: 2 }    // Item 4
];
const capacity = 8;

console.log("--- Standard DP ---");
const result1 = knapsack01(items, capacity);
console.log("Maximum value:", result1);

console.log("--- With Path Reconstruction ---");
const result2 = knapsack01WithPath(items, capacity);

console.log("--- Space Optimized ---");
const result3 = knapsack01Optimized(items, capacity);
console.log("Maximum value:", result3);
```


## 2. Unbounded Knapsack Problem

### The Unlimited Choice Pattern

```javascript
/**
 * Unbounded Knapsack - Items can be taken multiple times
 * Classic optimization with unlimited availability
 */

function knapsackUnbounded(items, capacity) {
    console.log(`=== Unbounded Knapsack Problem ===`);
    console.log(`Capacity: ${capacity}`);
    console.log("Items (unlimited quantities):");
    items.forEach((item, i) => {
        console.log(`  ${i}: weight=${item.weight}, value=${item.value}, ratio=${(item.value/item.weight).toFixed(2)}`);
    });
    
    // dp[w] = maximum value with capacity w
    const dp = new Array(capacity + 1).fill(0);
    const itemUsed = new Array(capacity + 1).fill(-1);  // For path reconstruction
    
    console.log("\nBuilding solution for each capacity:");
    console.log(`dp[0] = ${dp[0]} (base case)`);
    
    for (let w = 1; w <= capacity; w++) {
        console.log(`\nCapacity ${w}:`);
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            if (item.weight <= w) {
                const newValue = dp[w - item.weight] + item.value;
                console.log(`  Item ${i}: dp[${w-item.weight}] + ${item.value} = ${dp[w-item.weight]} + ${item.value} = ${newValue}`);
                
                if (newValue > dp[w]) {
                    dp[w] = newValue;
                    itemUsed[w] = i;
                    console.log(`    New best: dp[${w}] = ${dp[w]} using item ${i}`);
                }
            } else {
                console.log(`  Item ${i}: too heavy (${item.weight} > ${w})`);
            }
        }
        
        console.log(`Final: dp[${w}] = ${dp[w]}`);
    }
    
    // Reconstruct solution
    console.log("\nReconstructing optimal solution:");
    const solution = [];
    let w = capacity;
    
    while (w > 0 && itemUsed[w] !== -1) {
        const item = itemUsed[w];
        solution.push(item);
        console.log(`At capacity ${w}, used item ${item} (weight=${items[item].weight}, value=${items[item].value})`);
        w -= items[item].weight;
    }
    
    // Count item frequencies
    const itemCount = {};
    solution.forEach(item => {
        itemCount[item] = (itemCount[item] || 0) + 1;
    });
    
    console.log("\nSolution summary:");
    Object.entries(itemCount).forEach(([item, count]) => {
        console.log(`Item ${item}: ${count} times`);
    });
    
    const totalWeight = solution.reduce((sum, item) => sum + items[item].weight, 0);
    console.log(`Total weight: ${totalWeight}/${capacity}`);
    console.log(`Total value: ${dp[capacity]}`);
    
    return dp[capacity];
}

// Coin change as unbounded knapsack
function coinChangeAsKnapsack(coins, amount) {
    console.log(`\n=== Coin Change as Unbounded Knapsack ===`);
    console.log(`Amount: ${amount}, Coins: [${coins.join(', ')}]`);
    
    // Minimize number of coins (maximize "efficiency")
    // Transform to maximization: maximize (amount - coins_used)
    
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    console.log("Computing minimum coins for each amount:");
    
    for (let i = 1; i <= amount; i++) {
        console.log(`\nAmount ${i}:`);
        
        for (const coin of coins) {
            if (coin <= i && dp[i - coin] !== Infinity) {
                const newCoins = dp[i - coin] + 1;
                console.log(`  Using coin ${coin}: dp[${i-coin}] + 1 = ${dp[i-coin]} + 1 = ${newCoins}`);
                
                if (newCoins < dp[i]) {
                    dp[i] = newCoins;
                    console.log(`    New minimum: dp[${i}] = ${dp[i]}`);
                }
            }
        }
        
        console.log(`Final: dp[${i}] = ${dp[i] === Infinity ? 'impossible' : dp[i]}`);
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// Rod cutting problem
function rodCutting(prices, length) {
    console.log(`\n=== Rod Cutting Problem ===`);
    console.log(`Rod length: ${length}`);
    console.log("Prices by length:", prices.map((price, i) => `${i+1}:$${price}`).join(', '));
    
    // dp[i] = maximum revenue from rod of length i
    const dp = new Array(length + 1).fill(0);
    const cut = new Array(length + 1).fill(0);  // Track optimal cuts
    
    console.log("\nComputing optimal revenue for each length:");
    
    for (let i = 1; i <= length; i++) {
        console.log(`\nLength ${i}:`);
        
        for (let j = 1; j <= i && j <= prices.length; j++) {
            const revenue = prices[j - 1] + dp[i - j];
            console.log(`  Cut ${j}: $${prices[j-1]} + dp[${i-j}] = $${prices[j-1]} + $${dp[i-j]} = $${revenue}`);
            
            if (revenue > dp[i]) {
                dp[i] = revenue;
                cut[i] = j;
                console.log(`    New best: dp[${i}] = $${dp[i]} with cut ${j}`);
            }
        }
    }
    
    // Reconstruct cutting solution
    console.log("\nOptimal cutting strategy:");
    const cuts = [];
    let remaining = length;
    
    while (remaining > 0) {
        const cutLength = cut[remaining];
        cuts.push(cutLength);
        console.log(`Cut piece of length ${cutLength}, remaining: ${remaining - cutLength}`);
        remaining -= cutLength;
    }
    
    console.log(`Cuts: [${cuts.join(', ')}]`);
    console.log(`Maximum revenue: $${dp[length]}`);
    
    return dp[length];
}

// Run examples
console.log("=== Unbounded Knapsack Examples ===");

const unboundedItems = [
    { weight: 1, value: 1 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 }
];

console.log("--- Basic Unbounded Knapsack ---");
knapsackUnbounded(unboundedItems, 7);

console.log("--- Coin Change Variant ---");
coinChangeAsKnapsack([1, 3, 4], 6);

console.log("--- Rod Cutting ---");
rodCutting([1, 5, 8, 9, 10, 17, 17, 20], 8);
```


## 3. Subset Sum Problem

### The Decision Variant Pattern

```javascript
/**
 * Subset Sum Problem - Can we achieve exact target sum?
 * Boolean DP for feasibility problems
 */

function subsetSum(nums, target) {
    console.log(`=== Subset Sum Problem ===`);
    console.log(`Numbers: [${nums.join(', ')}]`);
    console.log(`Target sum: ${target}`);
    
    const n = nums.length;
    
    // dp[i][sum] = can we achieve sum using first i numbers
    const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
    
    // Base case: sum 0 is always achievable (empty subset)
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true;
    }
    
    console.log("\nBuilding DP table:");
    console.log("Base case: dp[i][0] = true for all i (empty subset)");
    
    for (let i = 1; i <= n; i++) {
        const num = nums[i - 1];
        console.log(`\nProcessing number ${num} (index ${i-1}):`);
        
        for (let sum = 1; sum <= target; sum++) {
            // Option 1: Don't include current number
            const exclude = dp[i - 1][sum];
            
            // Option 2: Include current number (if possible)
            let include = false;
            if (num <= sum) {
                include = dp[i - 1][sum - num];
            }
            
            dp[i][sum] = exclude || include;
            
            if (sum <= 10 || sum === target || dp[i][sum]) {  // Print key sums
                console.log(`  sum=${sum}: exclude=${exclude}, include=${include} → dp[${i}][${sum}]=${dp[i][sum]}`);
            }
        }
    }
    
    console.log(`\nCan achieve target ${target}: ${dp[n][target]}`);
    
    if (dp[n][target]) {
        console.log("\nReconstructing subset:");
        const subset = [];
        let i = n, sum = target;
        
        while (i > 0 && sum > 0) {
            // If current cell came from including the number
            if (sum >= nums[i - 1] && dp[i - 1][sum - nums[i - 1]]) {
                subset.unshift(nums[i - 1]);
                console.log(`Include ${nums[i-1]}, remaining sum: ${sum - nums[i-1]}`);
                sum -= nums[i - 1];
            } else {
                console.log(`Exclude ${nums[i-1]}`);
            }
            i--;
        }
        
        console.log(`Subset: [${subset.join(', ')}]`);
        console.log(`Sum verification: ${subset.reduce((sum, num) => sum + num, 0)}`);
    }
    
    return dp[n][target];
}

// Space-optimized subset sum
function subsetSumOptimized(nums, target) {
    console.log(`\n=== Space-Optimized Subset Sum ===`);
    
    // Only need previous row
    let prev = new Array(target + 1).fill(false);
    prev[0] = true;  // Base case
    
    console.log("Space-optimized computation:");
    console.log(`Initial: [${prev.slice(0, Math.min(11, target + 1)).join(', ')}]${target > 10 ? '...' : ''}`);
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const curr = new Array(target + 1).fill(false);
        curr[0] = true;  // Always can achieve sum 0
        
        console.log(`\nProcessing ${num}:`);
        
        for (let sum = 1; sum <= target; sum++) {
            curr[sum] = prev[sum];  // Exclude current number
            
            if (num <= sum) {
                curr[sum] = curr[sum] || prev[sum - num];  // Include if possible
            }
        }
        
        prev = curr;
        console.log(`After ${num}: [${prev.slice(0, Math.min(11, target + 1)).join(', ')}]${target > 10 ? '...' : ''}`);
    }
    
    return prev[target];
}

// Count subset sums
function countSubsetSums(nums, target) {
    console.log(`\n=== Count Subset Sums ===`);
    console.log(`Count ways to achieve target ${target}`);
    
    // dp[i][sum] = number of ways to achieve sum using first i numbers
    const dp = Array.from({ length: nums.length + 1 }, () => Array(target + 1).fill(0));
    
    // Base case: 1 way to achieve sum 0 (empty subset)
    for (let i = 0; i <= nums.length; i++) {
        dp[i][0] = 1;
    }
    
    for (let i = 1; i <= nums.length; i++) {
        const num = nums[i - 1];
        
        for (let sum = 0; sum <= target; sum++) {
            // Ways without including current number
            dp[i][sum] = dp[i - 1][sum];
            
            // Ways including current number
            if (num <= sum) {
                dp[i][sum] += dp[i - 1][sum - num];
            }
        }
    }
    
    console.log(`Number of ways to achieve ${target}: ${dp[nums.length][target]}`);
    return dp[nums.length][target];
}

// Run examples
console.log("=== Subset Sum Examples ===");

const subsetNums = [3, 34, 4, 12, 5, 2];
const subsetTarget = 9;

console.log("--- Basic Subset Sum ---");
subsetSum(subsetNums, subsetTarget);

console.log("--- Space Optimized ---");
const optimizedResult = subsetSumOptimized(subsetNums, subsetTarget);
console.log("Result:", optimizedResult);

console.log("--- Count Ways ---");
countSubsetSums([1, 1, 2, 3], 4);
```


## 4. Partition and Target Sum Problems

### Advanced Subset Optimization Patterns

```javascript
/**
 * Partition Problem - Can array be divided into two equal sum subsets?
 * Advanced application of subset sum
 */

function canPartition(nums) {
    console.log(`=== Equal Sum Partition Problem ===`);
    console.log(`Numbers: [${nums.join(', ')}]`);
    
    const totalSum = nums.reduce((sum, num) => sum + num, 0);
    console.log(`Total sum: ${totalSum}`);
    
    // If total sum is odd, cannot partition equally
    if (totalSum % 2 !== 0) {
        console.log("Total sum is odd - cannot partition equally");
        return false;
    }
    
    const target = totalSum / 2;
    console.log(`Target sum for each partition: ${target}`);
    
    // Reduce to subset sum problem: can we find subset with sum = target?
    console.log("\nReducing to subset sum problem...");
    return subsetSumOptimized(nums, target);
}

/**
 * Target Sum Problem - Assign +/- to each number to reach target
 * Transform to subset sum variant
 */

function findTargetSumWays(nums, target) {
    console.log(`\n=== Target Sum Problem ===`);
    console.log(`Numbers: [${nums.join(', ')}]`);
    console.log(`Target: ${target}`);
    
    const totalSum = nums.reduce((sum, num) => sum + num, 0);
    console.log(`Total sum: ${totalSum}`);
    
    // Mathematical transformation:
    // Let P = positive subset, N = negative subset
    // P + N = totalSum
    // P - N = target
    // Solving: P = (totalSum + target) / 2
    
    if ((totalSum + target) % 2 !== 0 || target > totalSum || target < -totalSum) {
        console.log("No solution exists (mathematical impossibility)");
        return 0;
    }
    
    const positiveSum = (totalSum + target) / 2;
    console.log(`Positive subset target: ${positiveSum}`);
    console.log("Transforming to: count subsets with sum = " + positiveSum);
    
    return countSubsetSums(nums, positiveSum);
}

/**
 * Minimum Subset Sum Difference - Minimize |sum1 - sum2|
 * Find partition that minimizes difference between subset sums
 */

function minimumSubsetSumDifference(nums) {
    console.log(`\n=== Minimum Subset Sum Difference ===`);
    console.log(`Numbers: [${nums.join(', ')}]`);
    
    const totalSum = nums.reduce((sum, num) => sum + num, 0);
    const halfSum = Math.floor(totalSum / 2);
    
    console.log(`Total sum: ${totalSum}`);
    console.log(`Half sum (max possible for smaller subset): ${halfSum}`);
    
    // Find all possible subset sums up to halfSum
    const dp = new Array(halfSum + 1).fill(false);
    dp[0] = true;
    
    console.log("\nFinding all achievable subset sums:");
    
    for (const num of nums) {
        console.log(`Processing ${num}:`);
        
        // Traverse backwards to avoid using same element twice
        for (let sum = halfSum; sum >= num; sum--) {
            if (dp[sum - num]) {
                dp[sum] = true;
            }
        }
        
        const achievable = [];
        for (let i = 0; i <= halfSum; i++) {
            if (dp[i]) achievable.push(i);
        }
        console.log(`  Achievable sums: [${achievable.slice(0, 10).join(', ')}]${achievable.length > 10 ? '...' : ''}`);
    }
    
    // Find the largest achievable sum ≤ halfSum
    let maxAchievable = 0;
    for (let sum = halfSum; sum >= 0; sum--) {
        if (dp[sum]) {
            maxAchievable = sum;
            break;
        }
    }
    
    const subset1Sum = maxAchievable;
    const subset2Sum = totalSum - subset1Sum;
    const difference = Math.abs(subset1Sum - subset2Sum);
    
    console.log(`\nOptimal partition:`);
    console.log(`Subset 1 sum: ${subset1Sum}`);
    console.log(`Subset 2 sum: ${subset2Sum}`);
    console.log(`Minimum difference: ${difference}`);
    
    return difference;
}

/**
 * Perfect Sum Problem - Count subsets with exact sum
 * Handle zeros and multiple solutions
 */

function perfectSum(nums, target) {
    console.log(`\n=== Perfect Sum Problem (with zeros) ===`);
    console.log(`Numbers: [${nums.join(', ')}]`);
    console.log(`Target: ${target}`);
    
    // Count zeros separately
    let zeroCount = 0;
    const nonZeroNums = [];
    
    for (const num of nums) {
        if (num === 0) {
            zeroCount++;
        } else {
            nonZeroNums.push(num);
        }
    }
    
    console.log(`Zeros: ${zeroCount}, Non-zeros: [${nonZeroNums.join(', ')}]`);
    
    // Find ways using non-zero numbers
    const dp = new Array(target + 1).fill(0);
    dp[0] = 1;  // One way to make sum 0
    
    for (const num of nonZeroNums) {
        for (let sum = target; sum >= num; sum--) {
            dp[sum] += dp[sum - num];
        }
    }
    
    // Each zero can either be included or excluded (2^zeroCount ways)
    const waysWithNonZeros = dp[target];
    const totalWays = waysWithNonZeros * Math.pow(2, zeroCount);
    
    console.log(`Ways using non-zeros: ${waysWithNonZeros}`);
    console.log(`Zero multiplier: 2^${zeroCount} = ${Math.pow(2, zeroCount)}`);
    console.log(`Total ways: ${totalWays}`);
    
    return totalWays;
}

// Run examples
console.log("=== Advanced Subset Problems ===");

console.log("--- Equal Partition ---");
canPartition([1, 5, 11, 5]);

console.log("--- Target Sum ---");
findTargetSumWays([1, 1, 1, 1, 1], 3);

console.log("--- Minimum Difference ---");
minimumSubsetSumDifference([1, 6, 11, 5]);

console.log("--- Perfect Sum with Zeros ---");
perfectSum([2, 3, 5, 6, 8, 10], 10);
```


## Summary

### Knapsack & Optimization Mastery Achieved

**Complete Optimization Framework Mastered:**
- **0/1 Knapsack**: Binary choice optimization with capacity constraints
- **Unbounded Knapsack**: Unlimited choice optimization for production planning
- **Subset Sum**: Decision problems and feasibility analysis
- **Advanced Variants**: Partition, target sum, and minimization problems

**Strategic Problem-Solving Patterns:**

**Binary Choice Optimization (0/1 Knapsack):**
- **State Representation**: dp[i][w] for items and capacity tracking
- **Transition Logic**: Include vs exclude decision analysis
- **Path Reconstruction**: Backtracking through optimal decisions
- **Space Optimization**: Rolling array techniques for memory efficiency

**Unlimited Choice Optimization (Unbounded Knapsack):**
- **State Simplification**: dp[w] for capacity-only tracking
- **Choice Iteration**: Considering each item type at every capacity
- **Applications**: Coin change, rod cutting, and production optimization
- **Greedy Insights**: Understanding when greedy approaches work

**Decision and Feasibility Problems:**
- **Boolean DP**: Feasibility analysis with true/false states
- **Counting Variants**: Enumeration of all possible solutions
- **Mathematical Transformations**: Converting complex problems to subset sum
- **Zero Handling**: Special cases in counting problems

**Advanced Optimization Techniques:**
- **Problem Reduction**: Converting complex problems to standard forms
- **Mathematical Insight**: Algebraic transformations for problem simplification
- **Constraint Analysis**: Understanding problem boundaries and impossibility conditions
- **Multiple Objectives**: Balancing competing optimization goals

### Real-World Applications Mastery

**Resource Allocation Systems:**
- **Project Management**: Task selection under budget and time constraints
- **Investment Planning**: Portfolio optimization with risk and return constraints
- **Supply Chain**: Inventory optimization and warehouse space utilization
- **Manufacturing**: Production planning with capacity and material constraints

**Operations Research Applications:**
- **Logistics Optimization**: Vehicle loading and route planning
- **Facility Planning**: Equipment selection and layout optimization
- **Energy Management**: Power generation scheduling and load balancing
- **Financial Engineering**: Risk management and capital allocation

**Computer Science Applications:**
- **Memory Management**: Cache optimization and buffer allocation
- **Network Design**: Bandwidth allocation and traffic optimization
- **Algorithm Design**: Optimization problems in graph algorithms
- **Machine Learning**: Feature selection and hyperparameter optimization

### Mathematical and Theoretical Foundations

**Optimization Theory:**
- **Linear Programming Connections**: Understanding continuous relaxations
- **Complexity Analysis**: NP-completeness and approximation algorithms
- **Duality Theory**: Relationship between primal and dual problems
- **Sensitivity Analysis**: Understanding parameter changes and robustness

**Dynamic Programming Principles:**
- **Bellman Optimality**: Deep understanding of optimal substructure
- **State Space Design**: Efficient representation of problem states
- **Recurrence Relations**: Mathematical formulation of optimization problems
- **Boundary Conditions**: Proper handling of base cases and constraints

### Advanced Problem-Solving Framework

**Systematic Approach to Optimization Problems:**
```
1. Problem Analysis:
   - Identify decision variables and constraints
   - Define objective function clearly
   - Determine problem type (0/1, unbounded, decision)
   
2. Mathematical Modeling:
   - Formulate recurrence relations
   - Define state representation
   - Identify base cases and boundaries
   
3. Algorithm Selection:
   - Choose appropriate DP variant
   - Consider space/time tradeoffs
   - Plan for path reconstruction if needed
   
4. Implementation Strategy:
   - Start with recursive formulation
   - Add memoization for optimization
   - Apply space optimizations if beneficial
   
5. Validation and Optimization:
   - Test with known examples
   - Verify optimality conditions
   - Benchmark against alternative approaches
```

**Problem Recognition Patterns:**
- **Binary choices + capacity**: 0/1 Knapsack
- **Unlimited choices + capacity**: Unbounded Knapsack  
- **Exact target achievement**: Subset Sum
- **Minimize difference**: Partition problems
- **Count solutions**: Subset enumeration

You now possess the **complete arsenal of knapsack and optimization techniques** that form the **foundation for solving complex resource allocation problems**. This mastery enables you to **recognize optimization patterns instantly** and **apply the most appropriate algorithmic approach** for **real-world constraint satisfaction challenges**.

The progression from **simple binary choices to complex multi-objective optimization** represents a **fundamental advancement in problem-solving capability** - the ability to **model real-world constraints mathematically** and **find optimal solutions efficiently** using **dynamic programming principles**.

This expertise prepares you for **advanced optimization challenges** in **operations research, machine learning, and system design** where **knapsack patterns form the building blocks** for **sophisticated algorithmic solutions**.
