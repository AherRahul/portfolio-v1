---
title: "Classic DP Problems"
description: "Master fundamental DP patterns. Learn to solve Fibonacci sequence, climbing stairs, coin change, and longest common subsequence problems with optimal efficiency."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
  - classic-dp
resources:
  - title: "Classic DP Problems Visualizer"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Interactive visualization of classic dynamic programming problems"
  - title: "DP Problem Patterns"
    type: "reference"
    url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns"
    description: "Comprehensive guide to DP problem patterns and solutions"
  - title: "Classic DP Practice"
    type: "practice"
    url: "https://leetcode.com/tag/dynamic-programming/"
    description: "Essential DP problems for mastering classic patterns"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/33/classic_dp.png)

Classic DP Problems – The Essential Problem-Solving Arsenal
-------------------------------------------------------------

Imagine you're a **master chess player** ♟️ preparing for the **World Championship**, where **knowing classic opening patterns** determines your **strategic foundation** for handling **any complex game situation**:

**🏆 The Chess Mastery Challenge:**

**⚡ Scenario 1: Unprepared Player (Naive Approach)**
```
Challenge: Face complex middle game without knowing fundamentals
Approach: Try to calculate every move from scratch
Problems: 
- No pattern recognition
- Waste time on basic positions  
- Make suboptimal moves due to lack of foundation
Result: Overwhelmed by complexity, lose to prepared opponents
```

**🧠 Scenario 2: Master Player (Classic Pattern Knowledge)**
```
Strength: Mastered all classic openings and fundamental patterns
Approach: Instantly recognize familiar positions and apply proven strategies
Advantages:
- Immediate pattern recognition
- Optimal moves from established theory
- Mental energy saved for novel situations
- Strong foundation enables advanced creativity
Result: Dominate games, handle complex positions with confidence
```

**💎 Scenario 3: Advanced Applications**
```
Power: Classic patterns combine into sophisticated strategies
Examples:
- Sicilian Defense principles apply to endgame technique
- King and pawn knowledge enhances middle game planning
- Opening theory informs positional understanding
Outcome: Master-level play built on unshakeable foundations
```

**💡 The Classic DP Mastery Principle:**
**Classic DP problems** are the **fundamental patterns** of algorithmic problem-solving. Just as chess masters must know **essential openings**, programmers must master **core DP patterns** to **recognize problem structures instantly** and **apply optimal solutions efficiently** in **complex real-world scenarios**.


## The Theoretical Foundation

### Why Classic Problems Matter

**Pattern Recognition Development:**
Classic DP problems train your brain to **recognize problem structures** instantly:
- **State representation patterns**: How to model problem states effectively
- **Transition patterns**: Common ways states relate to each other
- **Optimization patterns**: Standard approaches to finding optimal solutions
- **Base case patterns**: How to identify and handle boundary conditions

**Cognitive Framework Building:**
- **Template library**: Mental repository of proven solution approaches
- **Debugging intuition**: Understanding what can go wrong and why
- **Complexity analysis**: Automatic recognition of time/space tradeoffs
- **Scalability assessment**: Knowing when solutions will work for larger instances

### The Classic DP Problem Categories

**1. Linear DP (1D problems):**
- **Fibonacci sequences**: Foundation of recurrence relations
- **Climbing stairs**: Choice-based decision problems
- **House robber**: Constraint-based optimization
- **Coin change**: Unbounded choice problems

**2. Grid DP (2D problems):**
- **Unique paths**: Path counting fundamentals
- **Minimum path sum**: Optimization with constraints
- **Dungeon game**: Backward DP and survival constraints

**3. Sequence DP:**
- **Longest common subsequence**: String/array alignment
- **Maximum subarray**: Kadane's algorithm and variants
- **Longest increasing subsequence**: Ordering and optimization

**4. Decision DP:**
- **Jump games**: Reachability and optimization
- **Buy/sell stock**: State machine patterns
- **Partition problems**: Subset optimization


## 1. Fibonacci and Staircase Problems

### The Foundation Pattern: Linear Recurrence

**Problem**: Climbing Stairs with Variations

```javascript
/**
 * Climbing Stairs - The Gateway DP Problem
 * You can climb 1 or 2 steps at a time. How many ways to reach the top?
 */

function climbStairs(n) {
    console.log(`=== Climbing Stairs: ${n} steps ===`);
    
    if (n <= 2) return n;
    
    // Bottom-up tabulation
    const dp = new Array(n + 1);
    dp[1] = 1;  // 1 way to climb 1 step
    dp[2] = 2;  // 2 ways to climb 2 steps: (1,1) or (2)
    
    console.log("Building solution step by step:");
    console.log(`dp[1] = ${dp[1]} (base case)`);
    console.log(`dp[2] = ${dp[2]} (base case)`);
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        console.log(`dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`);
    }
    
    return dp[n];
}

// Variation: Climb with 1, 2, or 3 steps
function climbStairsWithThreeSteps(n) {
    console.log(`=== Climbing Stairs (1,2,3 steps): ${n} steps ===`);
    
    if (n === 0) return 1;
    if (n < 0) return 0;
    
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;  // 1 way to stay at ground (do nothing)
    
    for (let i = 1; i <= n; i++) {
        if (i >= 1) dp[i] += dp[i - 1];  // From 1 step back
        if (i >= 2) dp[i] += dp[i - 2];  // From 2 steps back  
        if (i >= 3) dp[i] += dp[i - 3];  // From 3 steps back
        
        console.log(`dp[${i}] = ${dp[i]} ways`);
    }
    
    return dp[n];
}

// Variation: Minimum cost climbing stairs
function minCostClimbingStairs(cost) {
    console.log(`=== Min Cost Climbing Stairs ===`);
    console.log("Costs:", cost);
    
    const n = cost.length;
    const dp = new Array(n + 1);
    
    // Base cases: can start from step 0 or step 1
    dp[0] = 0;
    dp[1] = 0;
    
    console.log("Computing minimum cost to reach each step:");
    console.log(`dp[0] = ${dp[0]} (can start here for free)`);
    console.log(`dp[1] = ${dp[1]} (can start here for free)`);
    
    for (let i = 2; i <= n; i++) {
        // Choose cheaper of: coming from step i-1 or step i-2
        const fromPrev = dp[i - 1] + cost[i - 1];
        const fromPrevPrev = dp[i - 2] + cost[i - 2];
        
        dp[i] = Math.min(fromPrev, fromPrevPrev);
        
        console.log(`dp[${i}] = min(${fromPrev}, ${fromPrevPrev}) = ${dp[i]}`);
    }
    
    return dp[n];
}

// Space-optimized version
function climbStairsOptimized(n) {
    console.log(`=== Space-Optimized Climbing Stairs: ${n} steps ===`);
    
    if (n <= 2) return n;
    
    let prev2 = 1;  // dp[i-2]
    let prev1 = 2;  // dp[i-1]
    
    console.log("Space-optimized computation:");
    console.log(`Initial: prev2=${prev2}, prev1=${prev1}`);
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        console.log(`Step ${i}: current = ${prev1} + ${prev2} = ${current}`);
        
        prev2 = prev1;
        prev1 = current;
        
        console.log(`  Updated: prev2=${prev2}, prev1=${prev1}`);
    }
    
    return prev1;
}

// Run examples
console.log("=== Staircase Problem Examples ===");

console.log("\n--- Basic Climbing Stairs ---");
console.log("Result:", climbStairs(5));

console.log("\n--- Three Steps Variation ---");
console.log("Result:", climbStairsWithThreeSteps(4));

console.log("\n--- Minimum Cost Climbing ---");
const costs = [10, 15, 20];
console.log("Result:", minCostClimbingStairs(costs));

console.log("\n--- Space Optimized ---");
console.log("Result:", climbStairsOptimized(5));
```


## 2. Coin Change Problems

### The Choice-Based Optimization Pattern

```javascript
/**
 * Coin Change - Fundamental Optimization DP
 * Given coins and target amount, find minimum coins needed or count ways
 */

function coinChangeMinimum(coins, amount) {
    console.log(`=== Coin Change (Minimum): amount=${amount}, coins=[${coins}] ===`);
    
    // dp[i] = minimum coins needed to make amount i
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;  // 0 coins needed to make amount 0
    
    console.log("Building solution for each amount:");
    console.log(`dp[0] = ${dp[0]} (base case)`);
    
    for (let i = 1; i <= amount; i++) {
        console.log(`\nComputing dp[${i}]:`);
        
        for (const coin of coins) {
            if (coin <= i) {
                const option = dp[i - coin] + 1;
                console.log(`  Using coin ${coin}: dp[${i-coin}] + 1 = ${dp[i-coin]} + 1 = ${option}`);
                
                if (option < dp[i]) {
                    dp[i] = option;
                    console.log(`    New minimum: dp[${i}] = ${dp[i]}`);
                }
            } else {
                console.log(`  Coin ${coin} too large for amount ${i}`);
            }
        }
        
        console.log(`Final: dp[${i}] = ${dp[i] === Infinity ? 'impossible' : dp[i]}`);
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

function coinChangeWays(coins, amount) {
    console.log(`=== Coin Change (Count Ways): amount=${amount}, coins=[${coins}] ===`);
    
    // dp[i] = number of ways to make amount i
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;  // 1 way to make amount 0 (use no coins)
    
    console.log("Processing each coin type:");
    
    for (const coin of coins) {
        console.log(`\nProcessing coin ${coin}:`);
        
        for (let i = coin; i <= amount; i++) {
            const prevWays = dp[i];
            dp[i] += dp[i - coin];
            
            console.log(`  dp[${i}]: ${prevWays} + dp[${i-coin}] = ${prevWays} + ${dp[i-coin]} = ${dp[i]}`);
        }
        
        console.log(`After coin ${coin}:`, dp.slice(0, Math.min(amount + 1, 10)));
    }
    
    return dp[amount];
}

// Coin change with path reconstruction
function coinChangeWithPath(coins, amount) {
    console.log(`=== Coin Change with Path Reconstruction ===`);
    
    const dp = new Array(amount + 1).fill(Infinity);
    const parent = new Array(amount + 1).fill(-1);
    
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i && dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1;
                parent[i] = coin;  // Remember which coin was used
            }
        }
    }
    
    if (dp[amount] === Infinity) {
        return { minCoins: -1, path: [] };
    }
    
    // Reconstruct path
    const path = [];
    let current = amount;
    
    while (current > 0) {
        const coin = parent[current];
        path.push(coin);
        current -= coin;
    }
    
    console.log(`Minimum coins: ${dp[amount]}`);
    console.log(`Coins used: [${path.join(', ')}]`);
    
    return { minCoins: dp[amount], path };
}

// Unbounded knapsack variant
function coinChangeUnbounded(coins, amount) {
    console.log(`=== Unbounded Knapsack (Coin Change) ===`);
    
    // Each coin can be used unlimited times
    const dp = new Array(amount + 1).fill(0);
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.max(dp[i], dp[i - coin] + coin);
            }
        }
    }
    
    return dp[amount];
}

// Run examples
console.log("=== Coin Change Examples ===");

const coins1 = [1, 3, 4];
const amount1 = 6;

console.log("\n--- Minimum Coins ---");
console.log("Result:", coinChangeMinimum(coins1, amount1));

console.log("\n--- Count Ways ---");  
console.log("Result:", coinChangeWays(coins1, amount1));

console.log("\n--- With Path Reconstruction ---");
coinChangeWithPath(coins1, amount1);
```


## 3. Longest Common Subsequence (LCS)

### The Sequence Alignment Pattern

```javascript
/**
 * Longest Common Subsequence - Classic Sequence DP
 * Find longest subsequence common to two sequences
 */

function longestCommonSubsequence(text1, text2) {
    console.log(`=== Longest Common Subsequence ===`);
    console.log(`Text1: "${text1}"`);
    console.log(`Text2: "${text2}"`);
    
    const m = text1.length;
    const n = text2.length;
    
    // dp[i][j] = LCS length for text1[0..i-1] and text2[0..j-1]
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    console.log("\nBuilding DP table:");
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                // Characters match - extend LCS
                dp[i][j] = dp[i - 1][j - 1] + 1;
                console.log(`Match '${text1[i-1]}': dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`);
            } else {
                // Characters don't match - take best of excluding one character
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                console.log(`No match: dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`);
            }
        }
    }
    
    console.log("\nFinal DP table:");
    printDPTable(dp, text1, text2);
    
    return dp[m][n];
}

function printDPTable(dp, text1, text2) {
    const m = dp.length - 1;
    const n = dp[0].length - 1;
    
    // Print header
    console.log("    ", " ".repeat(3), text2.split("").map(c => c.padStart(3)).join(""));
    
    for (let i = 0; i <= m; i++) {
        const rowLabel = i === 0 ? " " : text1[i - 1];
        const row = dp[i].map(val => val.toString().padStart(3)).join("");
        console.log(`${rowLabel.padStart(3)} ${row}`);
    }
}

// LCS with path reconstruction
function lcsWithPath(text1, text2) {
    console.log(`\n=== LCS with Path Reconstruction ===`);
    
    const m = text1.length;
    const n = text2.length;
    
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    // Build DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Reconstruct LCS
    const lcs = [];
    let i = m, j = n;
    
    console.log("Reconstructing LCS path:");
    
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            lcs.unshift(text1[i - 1]);
            console.log(`Added '${text1[i-1]}' to LCS at position (${i}, ${j})`);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            console.log(`Moving up from (${i}, ${j}) to (${i-1}, ${j})`);
            i--;
        } else {
            console.log(`Moving left from (${i}, ${j}) to (${i}, ${j-1})`);
            j--;
        }
    }
    
    console.log(`LCS: "${lcs.join('')}"`);
    console.log(`Length: ${dp[m][n]}`);
    
    return { length: dp[m][n], sequence: lcs.join('') };
}

// LCS variants
function longestCommonSubstring(text1, text2) {
    console.log(`\n=== Longest Common Substring (Continuous) ===`);
    
    const m = text1.length;
    const n = text2.length;
    
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    let maxLength = 0;
    let endingPos = 0;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                
                if (dp[i][j] > maxLength) {
                    maxLength = dp[i][j];
                    endingPos = i;
                }
            } else {
                dp[i][j] = 0;  // Reset for substring (must be continuous)
            }
        }
    }
    
    const substring = text1.substring(endingPos - maxLength, endingPos);
    console.log(`Longest common substring: "${substring}"`);
    console.log(`Length: ${maxLength}`);
    
    return { length: maxLength, substring };
}

// Run examples
console.log("=== LCS Examples ===");

const text1 = "ABCDGH";
const text2 = "AEDFHR";

console.log("--- Basic LCS ---");
console.log("LCS length:", longestCommonSubsequence(text1, text2));

console.log("--- LCS with Path ---");
lcsWithPath(text1, text2);

console.log("--- Longest Common Substring ---");
longestCommonSubstring("GeeksforGeeks", "GeeksQuiz");
```


## 4. Maximum Subarray and House Robber

### The Optimization with Constraints Pattern

```javascript
/**
 * Maximum Subarray (Kadane's Algorithm) - Classic Linear DP
 * Find contiguous subarray with maximum sum
 */

function maxSubarray(nums) {
    console.log(`=== Maximum Subarray (Kadane's Algorithm) ===`);
    console.log("Array:", nums);
    
    let maxEndingHere = nums[0];  // Max sum ending at current position
    let maxSoFar = nums[0];       // Global maximum
    
    console.log("\nStep-by-step computation:");
    console.log(`Index 0: maxEndingHere=${maxEndingHere}, maxSoFar=${maxSoFar}`);
    
    for (let i = 1; i < nums.length; i++) {
        // Choice: extend previous subarray or start new one
        const extendPrevious = maxEndingHere + nums[i];
        const startNew = nums[i];
        
        maxEndingHere = Math.max(extendPrevious, startNew);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
        
        console.log(`Index ${i}: element=${nums[i]}`);
        console.log(`  Extend: ${maxEndingHere - nums[i]} + ${nums[i]} = ${extendPrevious}`);
        console.log(`  Start new: ${startNew}`);
        console.log(`  Choice: maxEndingHere = ${maxEndingHere}`);
        console.log(`  Global: maxSoFar = ${maxSoFar}`);
    }
    
    return maxSoFar;
}

// Maximum subarray with indices
function maxSubarrayWithIndices(nums) {
    console.log(`\n=== Maximum Subarray with Indices ===`);
    
    let maxEndingHere = nums[0];
    let maxSoFar = nums[0];
    let start = 0, end = 0, tempStart = 0;
    
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > maxEndingHere + nums[i]) {
            // Start new subarray
            maxEndingHere = nums[i];
            tempStart = i;
        } else {
            // Extend current subarray
            maxEndingHere = maxEndingHere + nums[i];
        }
        
        if (maxEndingHere > maxSoFar) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }
    }
    
    const subarray = nums.slice(start, end + 1);
    console.log(`Maximum subarray: [${subarray.join(', ')}]`);
    console.log(`Indices: [${start}, ${end}]`);
    console.log(`Sum: ${maxSoFar}`);
    
    return { sum: maxSoFar, start, end, subarray };
}

/**
 * House Robber - Constraint-based Optimization DP
 * Rob houses to maximize money without robbing adjacent houses
 */

function houseRobber(nums) {
    console.log(`\n=== House Robber ===`);
    console.log("House values:", nums);
    
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    const dp = new Array(nums.length);
    dp[0] = nums[0];                           // Rob first house
    dp[1] = Math.max(nums[0], nums[1]);        // Best of first two
    
    console.log("\nDP computation:");
    console.log(`dp[0] = ${dp[0]} (rob house 0)`);
    console.log(`dp[1] = max(${nums[0]}, ${nums[1]}) = ${dp[1]}`);
    
    for (let i = 2; i < nums.length; i++) {
        // Choice: rob current house + best up to i-2, or don't rob (best up to i-1)
        const robCurrent = nums[i] + dp[i - 2];
        const skipCurrent = dp[i - 1];
        
        dp[i] = Math.max(robCurrent, skipCurrent);
        
        console.log(`House ${i}: value=${nums[i]}`);
        console.log(`  Rob: ${nums[i]} + dp[${i-2}] = ${nums[i]} + ${dp[i-2]} = ${robCurrent}`);
        console.log(`  Skip: dp[${i-1}] = ${skipCurrent}`);
        console.log(`  Choice: dp[${i}] = ${dp[i]}`);
    }
    
    return dp[nums.length - 1];
}

// House robber with path reconstruction
function houseRobberWithPath(nums) {
    console.log(`\n=== House Robber with Path ===`);
    
    if (nums.length === 0) return { maxMoney: 0, robbedHouses: [] };
    if (nums.length === 1) return { maxMoney: nums[0], robbedHouses: [0] };
    
    const dp = new Array(nums.length);
    const choice = new Array(nums.length);  // Track whether we robbed each house
    
    dp[0] = nums[0];
    choice[0] = true;
    
    dp[1] = Math.max(nums[0], nums[1]);
    choice[1] = nums[1] > nums[0];
    
    for (let i = 2; i < nums.length; i++) {
        const robCurrent = nums[i] + dp[i - 2];
        const skipCurrent = dp[i - 1];
        
        if (robCurrent > skipCurrent) {
            dp[i] = robCurrent;
            choice[i] = true;
        } else {
            dp[i] = skipCurrent;
            choice[i] = false;
        }
    }
    
    // Reconstruct which houses were robbed
    const robbedHouses = [];
    let i = nums.length - 1;
    
    while (i >= 0) {
        if (choice[i]) {
            robbedHouses.unshift(i);
            i -= 2;  // Skip next house (can't rob adjacent)
        } else {
            i--;     // Move to previous house
        }
    }
    
    console.log(`Maximum money: ${dp[nums.length - 1]}`);
    console.log(`Houses robbed: [${robbedHouses.join(', ')}]`);
    console.log(`Values: [${robbedHouses.map(idx => nums[idx]).join(', ')}]`);
    
    return { maxMoney: dp[nums.length - 1], robbedHouses };
}

// Space-optimized house robber
function houseRobberOptimized(nums) {
    console.log(`\n=== House Robber (Space Optimized) ===`);
    
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = nums[0];                    // dp[i-2]
    let prev1 = Math.max(nums[0], nums[1]); // dp[i-1]
    
    console.log(`Initial: prev2=${prev2}, prev1=${prev1}`);
    
    for (let i = 2; i < nums.length; i++) {
        const current = Math.max(nums[i] + prev2, prev1);
        console.log(`House ${i}: current = max(${nums[i]} + ${prev2}, ${prev1}) = ${current}`);
        
        prev2 = prev1;
        prev1 = current;
        
        console.log(`  Updated: prev2=${prev2}, prev1=${prev1}`);
    }
    
    return prev1;
}

// Run examples
console.log("=== Maximum Subarray Examples ===");

const subarrayNums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("Result:", maxSubarray(subarrayNums));
maxSubarrayWithIndices(subarrayNums);

console.log("\n=== House Robber Examples ===");

const houseValues = [2, 7, 9, 3, 1];
console.log("Result:", houseRobber(houseValues));
houseRobberWithPath(houseValues);
console.log("Optimized result:", houseRobberOptimized(houseValues));
```


## 5. Jump Game Problems

### The Reachability and Optimization Pattern

```javascript
/**
 * Jump Game - Reachability DP
 * Determine if you can reach the last index
 */

function canJump(nums) {
    console.log(`=== Jump Game (Reachability) ===`);
    console.log("Array:", nums);
    
    const n = nums.length;
    const dp = new Array(n).fill(false);
    dp[0] = true;  // Can always reach starting position
    
    console.log("\nChecking reachability:");
    console.log(`dp[0] = ${dp[0]} (starting position)`);
    
    for (let i = 0; i < n; i++) {
        if (!dp[i]) {
            console.log(`Position ${i}: unreachable, skipping`);
            continue;
        }
        
        console.log(`\nFrom position ${i} (value=${nums[i]}):`);
        
        // From position i, we can jump 1 to nums[i] steps
        for (let jump = 1; jump <= nums[i] && i + jump < n; jump++) {
            const nextPos = i + jump;
            
            if (!dp[nextPos]) {
                dp[nextPos] = true;
                console.log(`  Can reach position ${nextPos} with jump of ${jump}`);
            }
        }
    }
    
    console.log("\nReachability array:", dp.map((val, idx) => `${idx}:${val}`));
    console.log(`Can reach last index: ${dp[n - 1]}`);
    
    return dp[n - 1];
}

// Greedy optimization (more efficient)
function canJumpGreedy(nums) {
    console.log(`\n=== Jump Game (Greedy Optimization) ===`);
    
    let maxReach = 0;
    
    console.log("Tracking maximum reachable position:");
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            console.log(`Position ${i} is unreachable (maxReach=${maxReach})`);
            return false;
        }
        
        const newReach = i + nums[i];
        if (newReach > maxReach) {
            console.log(`From position ${i}: can reach ${newReach} (was ${maxReach})`);
            maxReach = newReach;
        }
        
        if (maxReach >= nums.length - 1) {
            console.log(`Can reach end! (maxReach=${maxReach})`);
            return true;
        }
    }
    
    return maxReach >= nums.length - 1;
}

/**
 * Jump Game II - Minimum Jumps to Reach End
 */

function jumpGameMinimum(nums) {
    console.log(`\n=== Jump Game II (Minimum Jumps) ===`);
    console.log("Array:", nums);
    
    const n = nums.length;
    if (n <= 1) return 0;
    
    const dp = new Array(n).fill(Infinity);
    dp[0] = 0;  // 0 jumps to stay at start
    
    console.log("\nComputing minimum jumps:");
    console.log(`dp[0] = ${dp[0]} (starting position)`);
    
    for (let i = 0; i < n; i++) {
        if (dp[i] === Infinity) continue;
        
        console.log(`\nFrom position ${i} (${dp[i]} jumps to reach here):`);
        
        for (let jump = 1; jump <= nums[i] && i + jump < n; jump++) {
            const nextPos = i + jump;
            const newJumps = dp[i] + 1;
            
            if (newJumps < dp[nextPos]) {
                console.log(`  Reach ${nextPos} in ${newJumps} jumps (was ${dp[nextPos]})`);
                dp[nextPos] = newJumps;
            }
        }
    }
    
    console.log("\nFinal jumps array:", dp);
    return dp[n - 1];
}

// BFS approach for minimum jumps
function jumpGameBFS(nums) {
    console.log(`\n=== Jump Game II (BFS Approach) ===`);
    
    if (nums.length <= 1) return 0;
    
    let jumps = 0;
    let currentMaxReach = 0;
    let nextMaxReach = 0;
    
    console.log("BFS-style level processing:");
    
    for (let i = 0; i < nums.length - 1; i++) {
        nextMaxReach = Math.max(nextMaxReach, i + nums[i]);
        
        console.log(`Position ${i}: nextMaxReach = ${nextMaxReach}`);
        
        if (i === currentMaxReach) {
            // Completed current level, need another jump
            jumps++;
            currentMaxReach = nextMaxReach;
            
            console.log(`  End of level! Jumps = ${jumps}, new range = [${i+1}, ${currentMaxReach}]`);
            
            if (currentMaxReach >= nums.length - 1) {
                console.log(`  Can reach end!`);
                break;
            }
        }
    }
    
    return jumps;
}

// Run examples
console.log("=== Jump Game Examples ===");

const jumpArray1 = [2, 3, 1, 1, 4];
console.log("--- Can Jump ---");
console.log("Result:", canJump(jumpArray1));
console.log("Greedy result:", canJumpGreedy(jumpArray1));

console.log("\n--- Minimum Jumps ---");
console.log("DP result:", jumpGameMinimum(jumpArray1));
console.log("BFS result:", jumpGameBFS(jumpArray1));

const jumpArray2 = [3, 2, 1, 0, 4];  // Cannot reach end
console.log("\n--- Impossible Case ---");
console.log("Can jump:", canJump(jumpArray2));
```


## Summary

### Classic DP Problems Mastery Achieved

**Essential Problem Patterns Mastered:**
- **Linear DP**: Fibonacci sequences, climbing stairs, and their optimization variants
- **Choice-Based DP**: Coin change problems with minimum/counting/path reconstruction
- **Sequence DP**: Longest common subsequence and substring alignment problems
- **Constraint Optimization**: Maximum subarray and house robber with adjacency constraints
- **Reachability DP**: Jump game problems and minimum path optimization

**Strategic Problem-Solving Frameworks:**

**Pattern Recognition Excellence:**
- **State Definition**: Ability to identify optimal state representations for diverse problems
- **Transition Identification**: Recognition of how states connect and transform
- **Base Case Recognition**: Systematic identification of boundary conditions
- **Optimization Focus**: Understanding when to minimize, maximize, or count solutions

**Implementation Mastery:**
- **Memoization Patterns**: Top-down recursive solutions with intelligent caching
- **Tabulation Techniques**: Bottom-up systematic construction of optimal solutions
- **Space Optimization**: Recognition and implementation of space-efficient variants
- **Path Reconstruction**: Tracking decisions to recover actual optimal solutions

**Algorithmic Optimization Skills:**
- **Complexity Analysis**: Deep understanding of time/space tradeoffs in different approaches
- **Greedy Insights**: Recognition when greedy approaches can replace DP for efficiency
- **BFS/DFS Connections**: Understanding relationships between DP and graph traversal
- **Mathematical Foundations**: Recurrence relation formulation and correctness proofs

### Real-World Applications Foundation

**Technical Interview Preparation:**
- **Core Problem Library**: Mastery of fundamental patterns appearing in 80% of DP interviews
- **Problem Variants**: Ability to adapt classic solutions to modified constraints
- **Optimization Techniques**: Knowledge of space/time optimizations for practical applications
- **Explanation Skills**: Clear understanding enabling effective problem communication

**Software Engineering Applications:**
- **Caching Strategies**: DP principles applied to memoization in software systems
- **Resource Optimization**: Minimum cost problems in scheduling and allocation
- **Sequence Processing**: Text processing, DNA analysis, and data alignment
- **Game Development**: Pathfinding optimization and AI decision-making

**Mathematical and Research Applications:**
- **Operations Research**: Foundation for complex optimization problems
- **Machine Learning**: Basis for sequence modeling and optimization algorithms
- **Bioinformatics**: Sequence alignment and protein folding problems
- **Financial Modeling**: Portfolio optimization and risk management

### Advanced Preparation Foundation

**Complex DP Readiness:**
- **Multi-dimensional States**: Ready for 2D/3D DP problems and state compression
- **Interval DP**: Prepared for range-based optimization problems
- **Tree/Graph DP**: Foundation for DP on non-linear structures
- **Probability DP**: Ready for expected value and probabilistic optimization

**Optimization Techniques:**
- **State Space Reduction**: Techniques for managing large state spaces
- **Approximation Algorithms**: When exact DP becomes intractable
- **Parallel DP**: Concepts for distributing DP computation
- **Advanced Data Structures**: Integration with segment trees, tries, etc.

### Strategic Problem Approach Framework

**Universal DP Solution Strategy:**
```
1. Problem Analysis:
   - Identify if optimal substructure exists
   - Confirm overlapping subproblems
   - Define state representation
   
2. Solution Design:
   - Write recursive relation
   - Identify base cases
   - Choose memoization vs tabulation
   
3. Implementation:
   - Code recursive solution first
   - Add memoization for optimization
   - Consider space optimizations
   
4. Verification:
   - Test with simple examples
   - Verify edge cases
   - Analyze complexity
   
5. Optimization:
   - Apply space optimizations
   - Consider alternative approaches
   - Benchmark performance
```

You now possess a **comprehensive arsenal of classic DP patterns** that form the **foundation for solving complex optimization problems**. This mastery of **fundamental DP problems** provides the **essential building blocks** for **recognizing and solving advanced dynamic programming challenges**.

The ability to **instantly recognize** these **classic patterns** and **adapt their solutions** to **novel constraints** represents a **fundamental advancement** in **algorithmic problem-solving capability** - transforming you from someone who **learns individual solutions** to someone who **masters universal problem-solving patterns**.

This foundation prepares you for **advanced DP topics** including **knapsack variations, string processing algorithms, and sophisticated optimization problems** that build upon these **essential patterns**.
