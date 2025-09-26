---
title: "Advanced DP Patterns"
description: "Master sophisticated DP techniques. Learn interval DP, digit DP, tree DP, and bitmask DP for solving complex algorithmic challenges."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
  - advanced-dp
resources:
  - title: "Advanced DP Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Interactive visualization of advanced dynamic programming techniques"
  - title: "DP State Compression"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Dynamic_programming"
    description: "Mathematical foundations of advanced DP state representation"
  - title: "Competitive Programming DP"
    type: "practice"
    url: "https://codeforces.com/problemset?tags=dp"
    description: "Advanced DP problems for algorithmic mastery"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/36/advanced_dp.png)

Advanced DP Patterns – Mastering Sophisticated Optimization
--------------------------------------------------------------

Imagine you're the **Chief Systems Architect** 🏗️ at a **quantum computing research facility** where **traditional optimization approaches** fail catastrophically with **exponential state spaces**, and only **advanced algorithmic patterns** can **compress complex multi-dimensional problems** into **tractable solutions**:

**🔬 The Quantum Optimization Challenge:**

**⚛️ Scenario 1: Quantum Circuit Optimization (Interval DP)**
```
Problem: Optimize quantum gate sequence for minimum error propagation
Challenge: Gates interact in complex ranges - optimal subsequence affects global performance
Example: 100 quantum gates, any contiguous range can be optimized together
Traditional approach: 2^100 possible gate combinations = impossible
Interval DP insight: Optimal arrangement of gates [i,j] depends on optimal sub-arrangements
Result: O(n³) solution for exponential problem space
```

**💾 Scenario 2: Quantum State Compression (Bitmask DP)**
```
Problem: Track 20 qubit states through computation pipeline
Challenge: Each qubit can be in superposition - 2^20 = 1,048,576 possible states
Memory limit: Cannot store full state transition table
Bitmask DP solution: Represent all qubit states as single integer (bitwise operations)
Result: Compress complex multi-dimensional states into efficient representation
```

**🌳 Scenario 3: Quantum Network Topology (Tree DP)**
```
Problem: Optimize quantum entanglement distribution across network hierarchy
Challenge: Tree-structured quantum network with parent-child dependencies
Constraint: Optimal solution at each node depends on optimal child configurations
Tree DP approach: Bottom-up optimization from leaves to root
Result: Global optimum through local optimizations with dependency management
```

**💡 The Advanced DP Mastery Principle:**
**Advanced DP patterns** represent the **pinnacle of algorithmic sophistication** - transforming **intractable exponential problems** into **polynomial solutions** through **intelligent state compression, dimensional reduction, and dependency modeling**. These techniques enable solving **previously impossible optimization challenges** in **real-world complex systems**.


## The Theoretical Foundation

### Advanced DP Complexity Management

**State Space Explosion Problem:**
Traditional DP often faces exponential state spaces:
- **Multi-dimensional problems**: States grow as product of all dimensions
- **Subset problems**: 2ⁿ possible subsets to consider
- **Tree structures**: Exponential branching in complex hierarchies
- **Range problems**: Quadratic or cubic interactions between ranges

**Advanced Solutions:**
- **Interval DP**: Reduce range problems to manageable sub-ranges
- **Bitmask DP**: Compress subset states using bitwise operations
- **Tree DP**: Leverage hierarchical structure for efficient computation
- **Digit DP**: Handle number constraints through digit-by-digit processing

### Mathematical Complexity Analysis

**Interval DP Complexity:**
- **Time**: O(n³) for most problems (vs O(n!) brute force)
- **Space**: O(n²) for storing interval states
- **Pattern**: dp[i][j] represents optimal solution for range [i,j]

**Bitmask DP Complexity:**
- **Time**: O(2ⁿ × n) for n-element sets (vs O(n! × n) brute force)
- **Space**: O(2ⁿ) for storing subset states
- **Pattern**: dp[mask] represents optimal solution for subset represented by mask


## 1. Interval DP - Range Optimization Mastery

### The Matrix Chain Multiplication Foundation

```javascript
/**
 * Matrix Chain Multiplication - Classic Interval DP
 * Find optimal way to parenthesize matrix chain for minimum multiplications
 */

function matrixChainMultiplication(dimensions) {
    console.log(`=== Matrix Chain Multiplication ===`);
    console.log("Matrix dimensions:", dimensions);
    
    const n = dimensions.length - 1;  // Number of matrices
    console.log(`Number of matrices: ${n}`);
    
    // Display matrices
    for (let i = 0; i < n; i++) {
        console.log(`Matrix ${i}: ${dimensions[i]} × ${dimensions[i+1]}`);
    }
    
    // dp[i][j] = minimum multiplications for matrices i to j (inclusive)
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    const split = Array.from({ length: n }, () => Array(n).fill(0));
    
    console.log("\nBuilding DP table by chain length:");
    
    // Length 1 chains have 0 cost (single matrix)
    console.log("Length 1: No multiplication needed");
    
    // Fill for chain lengths 2 to n
    for (let len = 2; len <= n; len++) {
        console.log(`\nLength ${len}:`);
        
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = Infinity;
            
            console.log(`  Matrices [${i}, ${j}]:`);
            
            // Try all possible split points
            for (let k = i; k < j; k++) {
                // Cost = left chain + right chain + cost to multiply results
                const leftCost = dp[i][k];
                const rightCost = dp[k + 1][j];
                const multiplyCost = dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
                const totalCost = leftCost + rightCost + multiplyCost;
                
                console.log(`    Split at ${k}: ${leftCost} + ${rightCost} + ${multiplyCost} = ${totalCost}`);
                
                if (totalCost < dp[i][j]) {
                    dp[i][j] = totalCost;
                    split[i][j] = k;
                    console.log(`      New minimum: ${totalCost}`);
                }
            }
            
            console.log(`    dp[${i}][${j}] = ${dp[i][j]}`);
        }
    }
    
    console.log("\nFinal DP table:");
    printMatrixDP(dp, n);
    
    console.log(`\nMinimum multiplications: ${dp[0][n-1]}`);
    
    // Reconstruct optimal parenthesization
    console.log("\nOptimal parenthesization:");
    const parenthesization = getOptimalParentheses(split, 0, n - 1);
    console.log(parenthesization);
    
    return dp[0][n - 1];
}

function printMatrixDP(dp, n) {
    console.log("  i\\j:", Array.from({ length: n }, (_, i) => i.toString().padStart(6)).join(""));
    
    for (let i = 0; i < n; i++) {
        const row = dp[i].map(val => val === 0 ? "-" : val.toString().padStart(6)).join("");
        console.log(`${i.toString().padStart(4)}: ${row}`);
    }
}

function getOptimalParentheses(split, i, j) {
    if (i === j) {
        return `M${i}`;
    }
    
    const k = split[i][j];
    const left = getOptimalParentheses(split, i, k);
    const right = getOptimalParentheses(split, k + 1, j);
    
    return `(${left} × ${right})`;
}

// Palindrome partitioning using interval DP
function palindromePartitioningInterval(s) {
    console.log(`\n=== Palindrome Partitioning (Interval DP) ===`);
    console.log(`String: "${s}"`);
    
    const n = s.length;
    
    // Precompute palindrome check
    const isPalindrome = Array.from({ length: n }, () => Array(n).fill(false));
    
    // Single characters
    for (let i = 0; i < n; i++) {
        isPalindrome[i][i] = true;
    }
    
    // Two characters
    for (let i = 0; i < n - 1; i++) {
        isPalindrome[i][i + 1] = (s[i] === s[i + 1]);
    }
    
    // Longer palindromes
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            isPalindrome[i][j] = (s[i] === s[j]) && isPalindrome[i + 1][j - 1];
        }
    }
    
    // dp[i][j] = minimum cuts for substring s[i..j]
    const dp = Array.from({ length: n }, () => Array(n).fill(Infinity));
    
    console.log("\nComputing minimum cuts using interval DP:");
    
    for (let len = 1; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (isPalindrome[i][j]) {
                dp[i][j] = 0;  // No cuts needed for palindrome
                console.log(`"${s.substring(i, j + 1)}" is palindrome - 0 cuts`);
            } else {
                // Try all possible cuts
                for (let k = i; k < j; k++) {
                    const cuts = dp[i][k] + dp[k + 1][j] + 1;
                    dp[i][j] = Math.min(dp[i][j], cuts);
                }
                console.log(`"${s.substring(i, j + 1)}" needs ${dp[i][j]} cuts`);
            }
        }
    }
    
    return dp[0][n - 1];
}

// Burst balloons - advanced interval DP
function burstBalloons(nums) {
    console.log(`\n=== Burst Balloons (Interval DP) ===`);
    console.log("Balloon values:", nums);
    
    // Add boundary balloons with value 1
    const balloons = [1, ...nums, 1];
    const n = balloons.length;
    
    console.log("With boundaries:", balloons);
    
    // dp[i][j] = maximum coins from bursting balloons in open interval (i, j)
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    
    console.log("\nBuilding DP table for burst order:");
    
    // Length of interval (excluding boundaries)
    for (let len = 2; len < n; len++) {
        console.log(`\nInterval length ${len - 1}:`);
        
        for (let i = 0; i <= n - len - 1; i++) {
            const j = i + len;
            
            console.log(`  Interval (${i}, ${j}) - values between ${balloons[i]} and ${balloons[j]}:`);
            
            // Try bursting each balloon k last in interval (i, j)
            for (let k = i + 1; k < j; k++) {
                const coins = balloons[i] * balloons[k] * balloons[j];
                const total = dp[i][k] + dp[k][j] + coins;
                
                console.log(`    Burst ${balloons[k]} last: ${balloons[i]}×${balloons[k]}×${balloons[j]} + ${dp[i][k]} + ${dp[k][j]} = ${total}`);
                
                dp[i][j] = Math.max(dp[i][j], total);
            }
            
            console.log(`    dp[${i}][${j}] = ${dp[i][j]}`);
        }
    }
    
    console.log(`\nMaximum coins: ${dp[0][n-1]}`);
    return dp[0][n - 1];
}

// Run examples
console.log("=== Interval DP Examples ===");

console.log("--- Matrix Chain Multiplication ---");
matrixChainMultiplication([40, 20, 30, 10, 30]);

console.log("--- Palindrome Partitioning ---");
palindromePartitioningInterval("abcba");

console.log("--- Burst Balloons ---");
burstBalloons([3, 1, 5, 8]);
```


## 2. Bitmask DP - State Compression Mastery

### The Traveling Salesman Foundation

```javascript
/**
 * Traveling Salesman Problem using Bitmask DP
 * Find shortest route visiting all cities exactly once
 */

function travelingSalesman(distances) {
    console.log(`=== Traveling Salesman Problem (Bitmask DP) ===`);
    const n = distances.length;
    console.log(`Cities: ${n}`);
    
    console.log("Distance matrix:");
    distances.forEach((row, i) => {
        console.log(`City ${i}: [${row.join(', ')}]`);
    });
    
    // dp[mask][i] = minimum cost to visit cities in mask, ending at city i
    const VISITED_ALL = (1 << n) - 1;
    const dp = Array.from({ length: 1 << n }, () => Array(n).fill(Infinity));
    
    // Start at city 0
    dp[1][0] = 0;  // mask = 1 (only city 0 visited), end at city 0
    
    console.log("\nBuilding DP table by visited cities:");
    console.log("Starting at city 0, mask = 1");
    
    for (let mask = 1; mask <= VISITED_ALL; mask++) {
        const visitedCities = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) visitedCities.push(i);
        }
        
        if (visitedCities.length <= 1) continue;
        
        console.log(`\nMask ${mask.toString(2).padStart(n, '0')} (cities: [${visitedCities.join(', ')}]):`);
        
        for (let current = 0; current < n; current++) {
            if (!(mask & (1 << current))) continue;  // current city not in mask
            
            const prevMask = mask ^ (1 << current);  // Remove current city
            
            for (let prev = 0; prev < n; prev++) {
                if (prev === current || !(prevMask & (1 << prev))) continue;
                
                const newCost = dp[prevMask][prev] + distances[prev][current];
                
                if (newCost < dp[mask][current]) {
                    dp[mask][current] = newCost;
                    console.log(`  To city ${current} from ${prev}: cost = ${newCost}`);
                }
            }
        }
    }
    
    // Find minimum cost to visit all cities and return to start
    let minCost = Infinity;
    let bestLastCity = -1;
    
    console.log("\nFinding minimum cost to return to start:");
    
    for (let i = 1; i < n; i++) {
        const returnCost = dp[VISITED_ALL][i] + distances[i][0];
        console.log(`From city ${i}: ${dp[VISITED_ALL][i]} + ${distances[i][0]} = ${returnCost}`);
        
        if (returnCost < minCost) {
            minCost = returnCost;
            bestLastCity = i;
        }
    }
    
    console.log(`\nMinimum TSP cost: ${minCost}`);
    console.log(`Best last city before returning: ${bestLastCity}`);
    
    return minCost;
}

// Assignment problem using bitmask DP
function assignmentProblem(cost) {
    console.log(`\n=== Assignment Problem (Bitmask DP) ===`);
    const n = cost.length;
    console.log(`Workers: ${n}, Tasks: ${n}`);
    
    console.log("Cost matrix:");
    cost.forEach((row, i) => {
        console.log(`Worker ${i}: [${row.join(', ')}]`);
    });
    
    // dp[mask] = minimum cost to assign tasks in mask
    const dp = new Array(1 << n).fill(Infinity);
    dp[0] = 0;  // No tasks assigned
    
    console.log("\nAssigning tasks optimally:");
    
    for (let mask = 0; mask < (1 << n); mask++) {
        if (dp[mask] === Infinity) continue;
        
        const assignedTasks = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) assignedTasks.push(i);
        }
        
        const worker = assignedTasks.length;  // Next worker to assign
        
        if (worker >= n) continue;
        
        console.log(`Assigning worker ${worker} (tasks assigned: [${assignedTasks.join(', ')}]):`);
        
        for (let task = 0; task < n; task++) {
            if (mask & (1 << task)) continue;  // Task already assigned
            
            const newMask = mask | (1 << task);
            const newCost = dp[mask] + cost[worker][task];
            
            if (newCost < dp[newMask]) {
                dp[newMask] = newCost;
                console.log(`  Task ${task}: cost ${cost[worker][task]}, total = ${newCost}`);
            }
        }
    }
    
    const allTasksMask = (1 << n) - 1;
    console.log(`\nMinimum assignment cost: ${dp[allTasksMask]}`);
    
    return dp[allTasksMask];
}

// Subset sum using bitmask DP
function subsetSumBitmask(nums, target) {
    console.log(`\n=== Subset Sum (Bitmask DP) ===`);
    console.log(`Numbers: [${nums.join(', ')}]`);
    console.log(`Target: ${target}`);
    
    const n = nums.length;
    
    // For each subset, compute its sum
    console.log("\nEnumerating all subsets:");
    
    let validSubsets = [];
    
    for (let mask = 0; mask < (1 << n); mask++) {
        let sum = 0;
        const subset = [];
        
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                sum += nums[i];
                subset.push(nums[i]);
            }
        }
        
        if (subset.length > 0) {
            const maskBinary = mask.toString(2).padStart(n, '0');
            console.log(`Mask ${maskBinary}: [${subset.join(', ')}] = ${sum}`);
            
            if (sum === target) {
                validSubsets.push({ mask, subset, sum });
            }
        }
    }
    
    console.log(`\nSubsets with sum ${target}:`);
    validSubsets.forEach((valid, idx) => {
        const maskBinary = valid.mask.toString(2).padStart(n, '0');
        console.log(`${idx + 1}. Mask ${maskBinary}: [${valid.subset.join(', ')}]`);
    });
    
    return validSubsets.length > 0;
}

// Run examples
console.log("=== Bitmask DP Examples ===");

console.log("--- Traveling Salesman ---");
const tspDistances = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
];
travelingSalesman(tspDistances);

console.log("--- Assignment Problem ---");
const assignmentCost = [
    [9, 2, 7, 8],
    [6, 4, 3, 7],
    [5, 8, 1, 8],
    [7, 6, 9, 4]
];
assignmentProblem(assignmentCost);

console.log("--- Subset Sum ---");
subsetSumBitmask([3, 34, 4, 12, 5, 2], 9);
```


## 3. Tree DP - Hierarchical Optimization

### The Tree Structure Foundation

```javascript
/**
 * Tree DP - Dynamic Programming on Tree Structures
 * Optimal solutions considering parent-child relationships
 */

class TreeNode {
    constructor(val) {
        this.val = val;
        this.children = [];
        this.parent = null;
    }
    
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
}

function createSampleTree() {
    //       1
    //     / | \
    //    2  3  4
    //   /|  |  |\
    //  5 6  7  8 9
    
    const nodes = Array.from({ length: 10 }, (_, i) => new TreeNode(i));
    
    nodes[1].addChild(nodes[2]);
    nodes[1].addChild(nodes[3]);
    nodes[1].addChild(nodes[4]);
    
    nodes[2].addChild(nodes[5]);
    nodes[2].addChild(nodes[6]);
    
    nodes[3].addChild(nodes[7]);
    
    nodes[4].addChild(nodes[8]);
    nodes[4].addChild(nodes[9]);
    
    return nodes[1];  // Return root
}

// Tree diameter using Tree DP
function treeDiameter(root) {
    console.log(`=== Tree Diameter (Tree DP) ===`);
    
    let maxDiameter = 0;
    
    function dfs(node) {
        if (!node || node.children.length === 0) {
            return 0;  // Leaf node height
        }
        
        console.log(`Processing node ${node.val}:`);
        
        // Get heights of all subtrees
        const childHeights = [];
        for (const child of node.children) {
            const height = dfs(child);
            childHeights.push(height);
            console.log(`  Child ${child.val} has height ${height}`);
        }
        
        // Sort heights in descending order
        childHeights.sort((a, b) => b - a);
        
        // Diameter through this node = sum of two largest heights + 2
        let diameterThroughNode = 0;
        if (childHeights.length >= 2) {
            diameterThroughNode = childHeights[0] + childHeights[1] + 2;
        } else if (childHeights.length === 1) {
            diameterThroughNode = childHeights[0] + 1;
        }
        
        console.log(`  Diameter through node ${node.val}: ${diameterThroughNode}`);
        maxDiameter = Math.max(maxDiameter, diameterThroughNode);
        
        // Return height of this subtree
        const subtreeHeight = childHeights.length > 0 ? childHeights[0] + 1 : 0;
        console.log(`  Subtree height at node ${node.val}: ${subtreeHeight}`);
        
        return subtreeHeight;
    }
    
    dfs(root);
    
    console.log(`\nMaximum tree diameter: ${maxDiameter}`);
    return maxDiameter;
}

// Tree node deletion problem
function maxSumWithoutAdjacentNodes(root, values) {
    console.log(`\n=== Maximum Sum Without Adjacent Nodes ===`);
    console.log("Node values:", values);
    
    // dp[node][0] = max sum in subtree excluding node
    // dp[node][1] = max sum in subtree including node
    const dp = new Map();
    
    function solve(node) {
        if (!node) return [0, 0];
        
        console.log(`Processing node ${node.val} (value: ${values[node.val]}):`);
        
        let excludeSum = 0;  // Don't include current node
        let includeSum = values[node.val];  // Include current node
        
        for (const child of node.children) {
            const [childExclude, childInclude] = solve(child);
            
            console.log(`  Child ${child.val}: exclude=${childExclude}, include=${childInclude}`);
            
            // If we exclude current node, we can take max from child
            excludeSum += Math.max(childExclude, childInclude);
            
            // If we include current node, we must exclude all children
            includeSum += childExclude;
        }
        
        console.log(`  Node ${node.val}: exclude=${excludeSum}, include=${includeSum}`);
        
        dp.set(node, [excludeSum, includeSum]);
        return [excludeSum, includeSum];
    }
    
    const [excludeRoot, includeRoot] = solve(root);
    const maxSum = Math.max(excludeRoot, includeRoot);
    
    console.log(`\nMaximum sum without adjacent nodes: ${maxSum}`);
    return maxSum;
}

// Tree rerooting DP
function treeRerooting(root) {
    console.log(`\n=== Tree Rerooting DP ===`);
    console.log("Computing optimal values for each node as root");
    
    const subtreeSize = new Map();
    const subtreeSum = new Map();
    const totalNodes = countNodes(root);
    
    // First DFS: compute subtree information
    function dfsDown(node, parent = null) {
        subtreeSize.set(node, 1);
        subtreeSum.set(node, node.val);
        
        for (const child of node.children) {
            if (child !== parent) {
                dfsDown(child, node);
                subtreeSize.set(node, subtreeSize.get(node) + subtreeSize.get(child));
                subtreeSum.set(node, subtreeSum.get(node) + subtreeSum.get(child));
            }
        }
    }
    
    // Second DFS: reroot and compute answers
    const answer = new Map();
    
    function dfsUp(node, parent = null, parentContrib = 0) {
        // Total sum when this node is root
        answer.set(node, subtreeSum.get(node) + parentContrib);
        
        console.log(`Node ${node.val} as root: sum = ${answer.get(node)}`);
        
        for (const child of node.children) {
            if (child !== parent) {
                // Contribution from parent direction when child becomes root
                const upContrib = answer.get(node) - subtreeSum.get(child);
                dfsUp(child, node, upContrib);
            }
        }
    }
    
    dfsDown(root);
    dfsUp(root);
    
    // Find best root
    let bestRoot = root;
    let bestSum = answer.get(root);
    
    for (const [node, sum] of answer) {
        if (sum > bestSum) {
            bestSum = sum;
            bestRoot = node;
        }
    }
    
    console.log(`Best root: node ${bestRoot.val} with sum ${bestSum}`);
    return { bestRoot, bestSum, allAnswers: answer };
}

function countNodes(root) {
    if (!root) return 0;
    let count = 1;
    for (const child of root.children) {
        count += countNodes(child);
    }
    return count;
}

// Run examples
console.log("=== Tree DP Examples ===");

const tree = createSampleTree();

console.log("--- Tree Diameter ---");
treeDiameter(tree);

console.log("--- Max Sum Without Adjacent ---");
const nodeValues = [0, 5, 2, 8, 3, 1, 4, 6, 7, 9];  // Values for nodes 0-9
maxSumWithoutAdjacentNodes(tree, nodeValues);

console.log("--- Tree Rerooting ---");
treeRerooting(tree);
```


## 4. Digit DP - Number Theory Mastery

### The Digit-by-Digit Construction

```javascript
/**
 * Digit DP - Handle number constraints digit by digit
 * Useful for counting numbers with specific properties
 */

function countNumbersWithSumOfDigits(n, sum) {
    console.log(`=== Count Numbers with Sum of Digits ===`);
    console.log(`Up to ${n} digits, sum = ${sum}`);
    
    // dp[pos][currentSum][tight][started]
    const memo = new Map();
    
    function solve(pos, currentSum, tight, started, maxDigits) {
        // Base case
        if (pos === maxDigits) {
            return (started && currentSum === sum) ? 1 : 0;
        }
        
        const key = `${pos}_${currentSum}_${tight}_${started}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        let limit = tight ? parseInt(n.toString()[pos] || '0') : 9;
        let result = 0;
        
        for (let digit = 0; digit <= limit; digit++) {
            const newTight = tight && (digit === limit);
            const newStarted = started || (digit > 0);
            const newSum = newStarted ? currentSum + digit : currentSum;
            
            if (newSum <= sum) {  // Pruning: don't exceed target sum
                result += solve(pos + 1, newSum, newTight, newStarted, maxDigits);
            }
        }
        
        memo.set(key, result);
        return result;
    }
    
    const maxDigits = n.toString().length;
    const count = solve(0, 0, true, false, maxDigits);
    
    console.log(`Numbers ≤ ${n} with digit sum ${sum}: ${count}`);
    return count;
}

// Count numbers with non-decreasing digits
function countNonDecreasingNumbers(limit) {
    console.log(`\n=== Count Non-Decreasing Numbers ===`);
    console.log(`Up to ${limit}`);
    
    const digits = limit.toString().split('').map(Number);
    const memo = new Map();
    
    function solve(pos, lastDigit, tight, started) {
        if (pos === digits.length) {
            return started ? 1 : 0;
        }
        
        const key = `${pos}_${lastDigit}_${tight}_${started}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        const maxDigit = tight ? digits[pos] : 9;
        let result = 0;
        
        for (let digit = 0; digit <= maxDigit; digit++) {
            const newTight = tight && (digit === maxDigit);
            const newStarted = started || (digit > 0);
            
            // Check non-decreasing constraint
            if (!newStarted || digit >= lastDigit) {
                const newLastDigit = newStarted ? digit : -1;
                result += solve(pos + 1, newLastDigit, newTight, newStarted);
            }
        }
        
        memo.set(key, result);
        return result;
    }
    
    const count = solve(0, -1, true, false);
    console.log(`Non-decreasing numbers ≤ ${limit}: ${count}`);
    
    // Show some examples
    console.log("Examples: 123, 1234, 1133, 2222, 3456, etc.");
    
    return count;
}

// Count numbers divisible by K with digit constraints
function countDivisibleByK(limit, k, digitConstraints) {
    console.log(`\n=== Count Numbers Divisible by ${k} ===`);
    console.log(`Up to ${limit}, with digit constraints:`, digitConstraints);
    
    const digits = limit.toString().split('').map(Number);
    const memo = new Map();
    
    function solve(pos, remainder, tight, started) {
        if (pos === digits.length) {
            return (started && remainder === 0) ? 1 : 0;
        }
        
        const key = `${pos}_${remainder}_${tight}_${started}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        const maxDigit = tight ? digits[pos] : 9;
        let result = 0;
        
        for (let digit = 0; digit <= maxDigit; digit++) {
            // Check digit constraints
            if (digitConstraints && !digitConstraints.includes(digit)) {
                continue;
            }
            
            const newTight = tight && (digit === maxDigit);
            const newStarted = started || (digit > 0);
            const newRemainder = newStarted ? (remainder * 10 + digit) % k : remainder;
            
            result += solve(pos + 1, newRemainder, newTight, newStarted);
        }
        
        memo.set(key, result);
        return result;
    }
    
    const count = solve(0, 0, true, false);
    console.log(`Numbers ≤ ${limit} divisible by ${k}: ${count}`);
    
    return count;
}

// Magic numbers (sum of digits equals product of digits)
function countMagicNumbers(limit) {
    console.log(`\n=== Count Magic Numbers ===`);
    console.log(`Numbers where sum of digits = product of digits, up to ${limit}`);
    
    const digits = limit.toString().split('').map(Number);
    const memo = new Map();
    
    function solve(pos, sum, product, tight, started) {
        if (pos === digits.length) {
            return (started && sum === product) ? 1 : 0;
        }
        
        const key = `${pos}_${sum}_${product}_${tight}_${started}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        const maxDigit = tight ? digits[pos] : 9;
        let result = 0;
        
        for (let digit = 0; digit <= maxDigit; digit++) {
            const newTight = tight && (digit === maxDigit);
            const newStarted = started || (digit > 0);
            
            let newSum = sum;
            let newProduct = product;
            
            if (newStarted) {
                newSum += digit;
                newProduct *= digit;
                
                // Pruning: if product becomes too large compared to possible sum
                if (newProduct > newSum + (digits.length - pos - 1) * 9) {
                    continue;
                }
            }
            
            result += solve(pos + 1, newSum, newProduct, newTight, newStarted);
        }
        
        memo.set(key, result);
        return result;
    }
    
    const count = solve(0, 0, 1, true, false);
    console.log(`Magic numbers ≤ ${limit}: ${count}`);
    
    // Find and display some magic numbers
    const magicNumbers = [];
    for (let i = 1; i <= Math.min(limit, 1000); i++) {
        const str = i.toString();
        const sum = str.split('').reduce((s, d) => s + parseInt(d), 0);
        const product = str.split('').reduce((p, d) => p * parseInt(d), 1);
        
        if (sum === product) {
            magicNumbers.push(i);
        }
    }
    
    console.log(`Examples: [${magicNumbers.slice(0, 10).join(', ')}]${magicNumbers.length > 10 ? '...' : ''}`);
    
    return count;
}

// Run examples
console.log("=== Digit DP Examples ===");

console.log("--- Sum of Digits ---");
countNumbersWithSumOfDigits(100, 9);

console.log("--- Non-Decreasing Numbers ---");
countNonDecreasingNumbers(1000);

console.log("--- Divisible by K ---");
countDivisibleByK(100, 7, [1, 2, 3, 4, 5]);  // Only digits 1-5 allowed

console.log("--- Magic Numbers ---");
countMagicNumbers(200);
```


## Summary

### Advanced DP Patterns Mastery Achieved

**Sophisticated Algorithm Arsenal:**
- **Interval DP**: Range-based optimization for complex subsequence problems
- **Bitmask DP**: State compression for exponential subset and permutation problems  
- **Tree DP**: Hierarchical optimization leveraging parent-child relationships
- **Digit DP**: Number theory problems with digit-by-digit constraint handling

**Pattern Recognition Excellence:**

**Interval DP Mastery:**
- **Range Optimization**: Breaking complex problems into optimal subrange solutions
- **Matrix Chain Patterns**: Understanding multiplication order optimization principles
- **Palindrome Decomposition**: Advanced string partitioning with optimality constraints
- **Burst Patterns**: Last-operation DP for complex interaction modeling

**Bitmask DP Sophistication:**
- **State Compression**: Representing exponential states as efficient bit patterns
- **Subset Enumeration**: Systematic exploration of all possible combinations
- **Assignment Problems**: Optimal matching with constraint satisfaction
- **Traveling Salesman**: Classic exponential problem solved in polynomial space

**Tree DP Excellence:**
- **Hierarchical Optimization**: Bottom-up and top-down tree traversal strategies
- **Rerooting Techniques**: Computing optimal solutions for multiple root configurations
- **Diameter Algorithms**: Path optimization in tree structures
- **Subtree Independence**: Leveraging tree structure for efficient computation

**Digit DP Innovation:**
- **Constraint Propagation**: Handling number formation with complex digit constraints
- **Tight Bound Management**: Efficient pruning while maintaining correctness
- **Mathematical Properties**: Exploiting number theory for optimization
- **Position-Based States**: Systematic digit-by-digit construction

### Real-World Applications Mastery

**Computational Optimization:**
- **Resource Scheduling**: Interval DP for optimal task sequencing and resource allocation
- **Network Design**: Bitmask DP for optimal network topology and routing
- **Hierarchical Systems**: Tree DP for organizational optimization and decision trees
- **Constraint Satisfaction**: Digit DP for configuration problems with complex rules

**Operations Research:**
- **Production Planning**: Matrix chain optimization for manufacturing sequences
- **Assignment Problems**: Optimal worker-task allocation using bitmask techniques
- **Supply Chain**: Tree-based optimization for distribution networks
- **Quality Control**: Digit-based constraints for process validation

**Computer Science Applications:**
- **Compiler Optimization**: Interval DP for optimal instruction scheduling
- **Database Systems**: Bitmask DP for query optimization and join ordering
- **System Architecture**: Tree DP for hierarchical cache and memory optimization
- **Security Systems**: Digit DP for password and key generation with constraints

### Mathematical and Theoretical Foundations

**Complexity Theory:**
- **State Space Reduction**: Transforming exponential problems to polynomial solutions
- **Dynamic Programming Principles**: Advanced applications of optimal substructure
- **Combinatorial Optimization**: Systematic exploration of solution spaces
- **Approximation Algorithms**: When exact solutions become computationally prohibitive

**Advanced Algorithm Design:**
- **Memory Optimization**: Techniques for managing large state spaces efficiently
- **Pruning Strategies**: Intelligent search space reduction without losing optimality
- **Parallel Processing**: Opportunities for distributed computation in DP problems
- **Hybrid Approaches**: Combining multiple DP patterns for complex problems

### Strategic Problem-Solving Framework

**Advanced DP Problem Analysis:**
```
1. Problem Structure Recognition:
   - Range-based optimization → Interval DP
   - Subset/permutation problems → Bitmask DP  
   - Hierarchical dependencies → Tree DP
   - Number constraints → Digit DP
   
2. State Space Design:
   - Identify minimal sufficient state representation
   - Apply compression techniques where possible
   - Design efficient transition functions
   
3. Implementation Strategy:
   - Choose appropriate memoization approach
   - Implement pruning for efficiency
   - Plan for path reconstruction if needed
   
4. Optimization:
   - Apply space compression techniques
   - Implement iterative versions where beneficial
   - Consider parallel processing opportunities
```

**Performance Optimization Guidelines:**
- **State Compression**: Use bitwise operations for subset representations
- **Memory Management**: Implement rolling arrays and space-efficient storage
- **Computational Pruning**: Early termination when bounds are exceeded
- **Cache Optimization**: Design memory access patterns for efficiency

You now possess **mastery of the most sophisticated dynamic programming techniques** that enable solving **previously intractable optimization problems**. This expertise represents the **pinnacle of algorithmic sophistication** - the ability to **compress exponential complexity into polynomial solutions** through **intelligent state representation and mathematical insight**.

The progression from **basic DP patterns to advanced state compression techniques** represents a **fundamental transformation in problem-solving capability** - the ability to **recognize complex mathematical structures** and **apply sophisticated algorithmic patterns** to **real-world optimization challenges**.

This advanced DP mastery prepares you for **cutting-edge applications** in **operations research, artificial intelligence, and computational optimization** where **traditional approaches fail** and only **sophisticated algorithmic techniques** can **provide tractable solutions** to **complex real-world problems**.
