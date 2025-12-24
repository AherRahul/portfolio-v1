---
title: "Find Factorial using Recursion"
description: "Calculate factorial of a number using recursion. Learn how to break down mathematical problems recursively, understand the relationship between factorial and recursion, and master the classic recursive pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Factorial Visualization"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Interactive factorial recursion visualization"
  - title: "Understanding Factorials"
    type: "article"
    url: "https://www.mathsisfun.com/numbers/factorial.html"
    description: "Mathematical explanation of factorials"
  - title: "Recursion Practice"
    type: "practice"
    url: "https://leetcode.com/tag/recursion/"
    description: "Practice recursive problems"

---

![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)
## Calculate Factorial of a Number Using Recursion


## 2. Problem Statement

Write a program to find the **factorial** of a given number **A** using **recursion**.

**Note:** The factorial of a number N is defined as the product of all positive integers from 1 to N.

**Mathematical Definition:**
```
N! = N × (N-1) × (N-2) × ... × 2 × 1
0! = 1 (by definition)
1! = 1
```

**Input:**
- An integer `A` (0 ≤ A ≤ 20)

**Output:**
- Return the factorial of A


## 3. Examples

### Example 1:
```
Input: A = 5
Output: 120
Explanation: 5! = 5 × 4 × 3 × 2 × 1 = 120
```

### Example 2:
```
Input: A = 0
Output: 1
Explanation: 0! = 1 (by mathematical definition)
```

### Example 3:
```
Input: A = 1
Output: 1
Explanation: 1! = 1
```

### Example 4:
```
Input: A = 10
Output: 3628800
Explanation: 10! = 10 × 9 × 8 × 7 × 6 × 5 × 4 × 3 × 2 × 1 = 3,628,800
```

### Example 5:
```
Input: A = 3
Output: 6
Explanation: 3! = 3 × 2 × 1 = 6
```


## 4. Constraints

- `0 ≤ A ≤ 20`
- Must use recursion
- Handle the special case of 0! = 1
- Result should be returned as an integer
- For A > 20, factorial exceeds JavaScript's safe integer limit

**Important:** Factorial grows extremely fast:
- 10! = 3,628,800
- 15! = 1,307,674,368,000
- 20! = 2,432,902,008,176,640,000
- 21! exceeds Number.MAX_SAFE_INTEGER in JavaScript


## 5. Important Points

### Understanding Factorial

**Mathematical Definition:**
- Factorial of N (written as N!) is the product of all positive integers ≤ N
- 0! = 1 (special case, by definition)
- N! = N × (N-1)!

**Recursive Nature:**
- Factorial is naturally recursive
- Each factorial depends on the previous one
- Perfect problem for learning recursion

### Key Concepts

1. **Base Cases:**
   - factorial(0) = 1
   - factorial(1) = 1

2. **Recursive Formula:**
   - factorial(N) = N × factorial(N-1)

3. **Call Stack:**
   - Each call waits for the next to return
   - Results multiply on the way back up

4. **Growth Rate:**
   - Factorial grows faster than exponential
   - Limited by integer overflow

### Real-World Applications

- **Combinatorics:** Calculating permutations and combinations
- **Probability:** Computing probabilities in statistics
- **Series Expansion:** Taylor series and mathematical analysis
- **Algorithms:** Complexity analysis (O(N!) time complexity)


## 6. Brute Force Approach

### Concept

The iterative approach uses a loop to multiply numbers from 1 to N. While efficient, it doesn't utilize recursion.

### Algorithm

1. Initialize result = 1
2. Loop from i = 1 to A
3. Multiply result by i in each iteration
4. Return final result

### Why It's Brute Force

- Uses iteration instead of recursion
- Doesn't demonstrate recursive thinking
- Doesn't meet the problem requirement
- Misses the elegance of recursive solution


## 7. Brute Force Code (Iterative - Not Meeting Requirements)

```javascript
function factorialIterative(A) {
    // Handle base case
    if (A === 0 || A === 1) {
        return 1;
    }
    
    // Initialize result
    let result = 1;
    
    // Multiply all numbers from 2 to A
    for (let i = 2; i <= A; i++) {
        result *= i;
    }
    
    return result;
}

// Test cases
console.log(factorialIterative(5));  // 120
console.log(factorialIterative(0));  // 1
console.log(factorialIterative(10)); // 3628800
```


## 8. Dry Run of Brute Force Approach

Let's trace `factorialIterative(5)`:

```
Initial State:
  A = 5
  result = 1

Iteration 1: i = 2
  result = 1 × 2 = 2

Iteration 2: i = 3
  result = 2 × 3 = 6

Iteration 3: i = 4
  result = 6 × 4 = 24

Iteration 4: i = 5
  result = 24 × 5 = 120

Loop ends (i = 6, condition i <= 5 is false)
Return: 120
```

**Trace Table:**

| Iteration | i | result | Calculation |
|-----------|---|--------|-------------|
| Initial | - | 1 | - |
| 1 | 2 | 2 | 1 × 2 |
| 2 | 3 | 6 | 2 × 3 |
| 3 | 4 | 24 | 6 × 4 |
| 4 | 5 | 120 | 24 × 5 |
| End | 6 | 120 | Return |


## 9. Time and Space Complexity of Brute Force

### Time Complexity: **O(A)**

- Loop runs A-1 times (from 2 to A)
- Each iteration performs one multiplication: O(1)
- Total: (A-1) × O(1) = O(A)

### Space Complexity: **O(1)**

- Only uses two variables: `result` and `i`
- No additional data structures
- Constant space regardless of input size

**Efficiency:** While this approach is space-efficient, it doesn't use recursion as required.


## 10. Visualization (Iterative Approach)

```
factorialIterative(5)

Execution Flow:
┌─────────────────────────────────────────┐
│ Start: result = 1                       │
├─────────────────────────────────────────┤
│ i = 2: result = 1 × 2 = 2               │
│ i = 3: result = 2 × 3 = 6               │
│ i = 4: result = 6 × 4 = 24              │
│ i = 5: result = 24 × 5 = 120            │
├─────────────────────────────────────────┤
│ Return: 120                             │
└─────────────────────────────────────────┘

Visual Multiplication:
1 → 2 → 6 → 24 → 120
    ×2  ×3  ×4   ×5
```


## 11. Optimized Approach Description (Recursive Solution)

### The Recursive Strategy

Factorial has a natural recursive definition:
```
factorial(N) = N × factorial(N-1)
factorial(0) = 1 (base case)
```

### How It Works

1. **Base Case:** If A is 0 or 1, return 1
2. **Recursive Case:** Return A × factorial(A-1)
3. **Trust the Recursion:** Each call solves a smaller subproblem

### Recursive Breakdown

```
factorial(5)
= 5 × factorial(4)
= 5 × (4 × factorial(3))
= 5 × (4 × (3 × factorial(2)))
= 5 × (4 × (3 × (2 × factorial(1))))
= 5 × (4 × (3 × (2 × 1)))
= 5 × (4 × (3 × 2))
= 5 × (4 × 6)
= 5 × 24
= 120
```

### Why Recursion is Elegant

- **Natural Fit:** Factorial definition is inherently recursive
- **Readable:** Code mirrors mathematical definition
- **Conceptual:** Easier to understand the logic
- **Educational:** Demonstrates recursive thinking


## 12. Optimized Approach (Recursive Implementation)

### Algorithm Steps

1. **Check Base Case:**
   - If A ≤ 1, return 1
   - This handles both 0! and 1!

2. **Recursive Case:**
   - Return A × factorial(A-1)
   - This builds the product as calls return

3. **Trust the Process:**
   - Each call solves a smaller problem
   - Base case stops the recursion
   - Results multiply on the way back

### Pseudocode

```
function factorial(A):
    if A <= 1:
        return 1  // Base case
    
    return A * factorial(A - 1)  // Recursive case
```


## 13. Optimized Code (Recursive Solution)

```javascript
/**
 * Calculates factorial of A using recursion
 * @param {number} A - The number to find factorial of
 * @returns {number} - The factorial of A
 */
function factorial(A) {
    // Base case: 0! = 1 and 1! = 1
    if (A <= 1) {
        return 1;
    }
    
    // Recursive case: A! = A × (A-1)!
    return A * factorial(A - 1);
}

// Test Case 1
console.log("5! =", factorial(5));  // 120

// Test Case 2
console.log("0! =", factorial(0));  // 1

// Test Case 3
console.log("1! =", factorial(1));  // 1

// Test Case 4
console.log("10! =", factorial(10));  // 3628800

// Test Case 5
console.log("3! =", factorial(3));  // 6
```

### Alternative Implementation with Validation

```javascript
function factorialSafe(A) {
    // Input validation
    if (typeof A !== 'number' || A < 0) {
        throw new Error("Input must be a non-negative number");
    }
    
    if (!Number.isInteger(A)) {
        throw new Error("Input must be an integer");
    }
    
    if (A > 20) {
        throw new Error("Input too large, result exceeds safe integer range");
    }
    
    // Base case
    if (A <= 1) {
        return 1;
    }
    
    // Recursive case
    return A * factorialSafe(A - 1);
}
```

### With Memoization (Optimization)

```javascript
function factorialMemo() {
    const cache = {};
    
    return function factorial(A) {
        // Check cache
        if (A in cache) {
            return cache[A];
        }
        
        // Base case
        if (A <= 1) {
            return 1;
        }
        
        // Recursive case with caching
        cache[A] = A * factorial(A - 1);
        return cache[A];
    };
}

const factorial = factorialMemo();
console.log(factorial(5));  // Calculates and caches
console.log(factorial(5));  // Returns from cache
```


## 14. Dry Run of Optimized Approach

Let's trace `factorial(5)` step by step:

### Call Stack Visualization

```
Step 1: factorial(5)
  - A = 5, A > 1, so continue
  - Return: 5 × factorial(4)
  - Need to calculate factorial(4) first

Step 2: factorial(4)
  - A = 4, A > 1, so continue
  - Return: 4 × factorial(3)
  - Need to calculate factorial(3) first

Step 3: factorial(3)
  - A = 3, A > 1, so continue
  - Return: 3 × factorial(2)
  - Need to calculate factorial(2) first

Step 4: factorial(2)
  - A = 2, A > 1, so continue
  - Return: 2 × factorial(1)
  - Need to calculate factorial(1) first

Step 5: factorial(1)
  - A = 1, A <= 1, BASE CASE
  - Return: 1

Step 6: Unwinding (calculating results)
  - factorial(1) returns 1
  - factorial(2) = 2 × 1 = 2
  - factorial(3) = 3 × 2 = 6
  - factorial(4) = 4 × 6 = 24
  - factorial(5) = 5 × 24 = 120
```

### Detailed Trace Table

| Step | Function Call | A Value | Action | Waiting For | Returns |
|------|--------------|---------|--------|-------------|---------|
| 1 | factorial(5) | 5 | Call factorial(4) | factorial(4) | - |
| 2 | factorial(4) | 4 | Call factorial(3) | factorial(3) | - |
| 3 | factorial(3) | 3 | Call factorial(2) | factorial(2) | - |
| 4 | factorial(2) | 2 | Call factorial(1) | factorial(1) | - |
| 5 | factorial(1) | 1 | Base case | - | 1 |
| 6 | factorial(2) | 2 | 2 × 1 | - | 2 |
| 7 | factorial(3) | 3 | 3 × 2 | - | 6 |
| 8 | factorial(4) | 4 | 4 × 6 | - | 24 |
| 9 | factorial(5) | 5 | 5 × 24 | - | 120 |

### Multiplication Flow

```
Going Down (Building Stack):
factorial(5) → needs factorial(4)
  factorial(4) → needs factorial(3)
    factorial(3) → needs factorial(2)
      factorial(2) → needs factorial(1)
        factorial(1) → returns 1 ✓

Coming Back Up (Calculating):
        factorial(1) = 1
      factorial(2) = 2 × 1 = 2
    factorial(3) = 3 × 2 = 6
  factorial(4) = 4 × 6 = 24
factorial(5) = 5 × 24 = 120 ✓
```


## 15. Time and Space Complexity of Optimized Solution

### Time Complexity: **O(A)**

**Analysis:**
- Function is called exactly A times (A, A-1, A-2, ..., 2, 1)
- Each call performs:
  - One comparison: `if (A <= 1)` → O(1)
  - One multiplication: `A * factorial(A-1)` → O(1)
  - One recursive call → O(1) for the call itself
- Total work per call: O(1)
- Total calls: A
- **Overall: A × O(1) = O(A)**

**Recurrence Relation:**
```
T(N) = T(N-1) + O(1)
T(1) = O(1)
Solution: T(N) = O(N)
```

### Space Complexity: **O(A)**

**Analysis:**
- **Call Stack Space:** Each recursive call adds a frame to the call stack
- Maximum stack depth: A frames (when we reach base case)
- Each frame stores:
  - Parameter A: O(1)
  - Return address: O(1)
  - Intermediate multiplication result: O(1)
- Total space: A × O(1) = **O(A)**

**Call Stack at Maximum Depth:**
```
factorial(5)  ← Frame 1: waiting for factorial(4)
  factorial(4)  ← Frame 2: waiting for factorial(3)
    factorial(3)  ← Frame 3: waiting for factorial(2)
      factorial(2)  ← Frame 4: waiting for factorial(1)
        factorial(1)  ← Frame 5: returns 1
```

### Comparison: Iterative vs Recursive

| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| Time Complexity | O(A) | O(A) |
| Space Complexity | O(1) | O(A) |
| Code Length | Longer | Shorter |
| Readability | Good | Excellent |
| Matches Math Definition | No | Yes |
| Stack Overflow Risk | No | Yes (large A) |
| Tail Call Optimization | N/A | Possible |


## 16. Visualization (Recursive Approach)

### Call Stack Evolution

```
factorial(5) execution:

Phase 1: Building the Stack (Going Down)
═══════════════════════════════════════════

Call 1:  factorial(5)
         ┌──────────────────────────┐
         │  A = 5                   │
         │  Return: 5 × f(4)        │
         │  Waiting for f(4)...     │
         └──────────────────────────┘

Call 2:  factorial(4)
         ┌──────────────────────────┐
         │  A = 5                   │
         ├──────────────────────────┤
         │  A = 4                   │
         │  Return: 4 × f(3)        │
         │  Waiting for f(3)...     │
         └──────────────────────────┘

Call 3:  factorial(3)
         ┌──────────────────────────┐
         │  A = 5                   │
         ├──────────────────────────┤
         │  A = 4                   │
         ├──────────────────────────┤
         │  A = 3                   │
         │  Return: 3 × f(2)        │
         │  Waiting for f(2)...     │
         └──────────────────────────┘

Call 4:  factorial(2)
         ┌──────────────────────────┐
         │  A = 5                   │
         ├──────────────────────────┤
         │  A = 4                   │
         ├──────────────────────────┤
         │  A = 3                   │
         ├──────────────────────────┤
         │  A = 2                   │
         │  Return: 2 × f(1)        │
         │  Waiting for f(1)...     │
         └──────────────────────────┘

Call 5:  factorial(1)
         ┌──────────────────────────┐
         │  A = 5                   │
         ├──────────────────────────┤
         │  A = 4                   │
         ├──────────────────────────┤
         │  A = 3                   │
         ├──────────────────────────┤
         │  A = 2                   │
         ├──────────────────────────┤
         │  A = 1                   │
         │  BASE CASE!              │
         │  Return: 1               │
         └──────────────────────────┘

Phase 2: Unwinding the Stack (Coming Back Up)
═══════════════════════════════════════════

Return 1:  factorial(1) = 1
         ┌──────────────────────────┐
         │  A = 5                   │
         ├──────────────────────────┤
         │  A = 4                   │
         ├──────────────────────────┤
         │  A = 3                   │
         ├──────────────────────────┤
         │  A = 2                   │
         │  Calculate: 2 × 1 = 2    │
         │  Return: 2               │
         └──────────────────────────┘

Return 2:  factorial(2) = 2
         ┌──────────────────────────┐
         │  A = 5                   │
         ├──────────────────────────┤
         │  A = 4                   │
         ├──────────────────────────┤
         │  A = 3                   │
         │  Calculate: 3 × 2 = 6    │
         │  Return: 6               │
         └──────────────────────────┘

Return 3:  factorial(3) = 6
         ┌──────────────────────────┐
         │  A = 5                   │
         ├──────────────────────────┤
         │  A = 4                   │
         │  Calculate: 4 × 6 = 24   │
         │  Return: 24              │
         └──────────────────────────┘

Return 4:  factorial(4) = 24
         ┌──────────────────────────┐
         │  A = 5                   │
         │  Calculate: 5 × 24 = 120 │
         │  Return: 120             │
         └──────────────────────────┘

Final Result: 120
```

### Tree Representation

```
                    factorial(5)
                         │
                    5 × factorial(4)
                         │
                    4 × factorial(3)
                         │
                    3 × factorial(2)
                         │
                    2 × factorial(1)
                         │
                         1

Calculation on return:
                         1
                         ↓
                    2 × 1 = 2
                         ↓
                    3 × 2 = 6
                         ↓
                    4 × 6 = 24
                         ↓
                    5 × 24 = 120
```


## 17. Edge Cases to Consider

### 1. **A = 0**
```javascript
factorial(0);
// Output: 1
// Reason: 0! = 1 by mathematical definition
```

### 2. **A = 1**
```javascript
factorial(1);
// Output: 1
// Reason: 1! = 1
```

### 3. **Negative Input**
```javascript
factorial(-5);
// Issue: Factorial undefined for negative numbers
// Solution: Add validation
```

### 4. **Large Input (Stack Overflow)**
```javascript
factorial(100000);
// Issue: Stack overflow due to deep recursion
// Solution: Use iterative approach or tail recursion
```

### 5. **Non-Integer Input**
```javascript
factorial(5.5);
// Issue: Factorial only defined for integers
// Solution: Add integer validation
```

### 6. **Very Large Result**
```javascript
factorial(25);
// Issue: Result exceeds Number.MAX_SAFE_INTEGER
// Solution: Use BigInt or limit input
```

### Handling Edge Cases - Enhanced Version

```javascript
function factorialRobust(A) {
    // Type validation
    if (typeof A !== 'number') {
        throw new Error("Input must be a number");
    }
    
    // Integer validation
    if (!Number.isInteger(A)) {
        throw new Error("Input must be an integer");
    }
    
    // Range validation
    if (A < 0) {
        throw new Error("Factorial undefined for negative numbers");
    }
    
    // Overflow prevention
    if (A > 20) {
        throw new Error("Input too large, use BigInt for larger factorials");
    }
    
    // Base case
    if (A <= 1) {
        return 1;
    }
    
    // Recursive case
    return A * factorialRobust(A - 1);
}
```

### Using BigInt for Large Factorials

```javascript
function factorialBigInt(A) {
    if (A <= 1) {
        return 1n;  // BigInt literal
    }
    return BigInt(A) * factorialBigInt(A - 1);
}

console.log(factorialBigInt(25));
// Output: 15511210043330985984000000n
```


## 18. Key Takeaways

### a. Applications

1. **Combinatorics**
   - Permutations: P(n,r) = n! / (n-r)!
   - Combinations: C(n,r) = n! / (r! × (n-r)!)
   - Arranging objects in order

2. **Probability and Statistics**
   - Calculating probabilities
   - Binomial distribution
   - Statistical analysis

3. **Series Expansion**
   - Taylor series: e^x = Σ(x^n / n!)
   - Maclaurin series
   - Mathematical approximations

4. **Algorithm Analysis**
   - Worst-case complexity: O(N!)
   - Permutation generation
   - Backtracking problems

5. **Number Theory**
   - Wilson's theorem: (p-1)! ≡ -1 (mod p)
   - Factorial prime numbers
   - Mathematical proofs

### b. Interview Strategy

**When Asked This Problem:**

1. **Clarify Requirements**
   - "Should I use recursion or iteration?"
   - "What's the maximum value of A?"
   - "How should I handle overflow?"
   - "Do you want BigInt support?"

2. **Explain Your Approach**
   - Start with mathematical definition
   - Explain base case (0! = 1, 1! = 1)
   - Show recursive formula: N! = N × (N-1)!
   - Discuss call stack behavior

3. **Code Incrementally**
   - Write base case first
   - Add recursive case
   - Test with small examples (0, 1, 5)
   - Add validation if time permits

4. **Analyze Complexity**
   - Time: O(N) - linear recursive calls
   - Space: O(N) - call stack depth
   - Compare with iterative O(1) space

5. **Discuss Optimizations**
   - Memoization for repeated calls
   - Tail recursion (if language supports)
   - Iterative approach for production
   - BigInt for large numbers

**Follow-up Questions to Expect:**
- "Can you implement it iteratively?"
- "How would you handle very large numbers?"
- "What if we need to calculate many factorials?"
- "Can you optimize space complexity?"
- "How would you implement with memoization?"

### c. Common Mistakes

1. **Missing Base Case**
```javascript
// ❌ WRONG: Infinite recursion
function factorial(A) {
    return A * factorial(A - 1);  // Never stops!
}
```

2. **Wrong Base Case**
```javascript
// ❌ WRONG: Doesn't handle 0!
function factorial(A) {
    if (A === 1) return 1;  // 0! should also return 1
    return A * factorial(A - 1);
}
```

3. **Not Handling Negative Numbers**
```javascript
// ❌ WRONG: Infinite recursion with negative input
function factorial(A) {
    if (A <= 1) return 1;  // -5 passes this check
    return A * factorial(A - 1);  // Goes to -6, -7, ...
}
```

4. **Integer Overflow Not Considered**
```javascript
// ❌ WRONG: Doesn't warn about overflow
function factorial(A) {
    if (A <= 1) return 1;
    return A * factorial(A - 1);
}
factorial(100);  // Returns Infinity, no warning
```

5. **Incorrect Recursive Call**
```javascript
// ❌ WRONG: Doesn't reduce problem size
function factorial(A) {
    if (A <= 1) return 1;
    return A * factorial(A);  // Same value, infinite loop!
}
```

### d. Related Problems

**Beginner Level:**
1. **Sum of N Natural Numbers** - Similar recursive pattern
2. **Power Function** - Recursive multiplication
3. **Fibonacci Sequence** - Multiple recursive calls
4. **GCD (Greatest Common Divisor)** - Euclidean algorithm

**Intermediate Level:**
5. **Permutations** - Uses factorial in calculation
6. **Combinations** - nCr = n! / (r! × (n-r)!)
7. **Catalan Numbers** - Involves factorial computation
8. **Binomial Coefficient** - Factorial-based formula

**Advanced Level:**
9. **Stirling's Approximation** - Factorial approximation
10. **Factorial Prime** - Number theory problem
11. **Derangements** - Combinatorial problem
12. **Subfactorial** - !n = n! × Σ((-1)^k / k!)

### e. Performance

**Benchmarking Results (approximate):**

```javascript
// Test with A = 20

// Recursive Approach
console.time('Recursive');
console.log(factorial(20));
console.timeEnd('Recursive');
// Time: ~0.05-0.1ms
// Space: O(20) stack frames
// Result: 2432902008176640000

// Iterative Approach
console.time('Iterative');
console.log(factorialIterative(20));
console.timeEnd('Iterative');
// Time: ~0.03-0.08ms
// Space: O(1)
// Result: 2432902008176640000

// With Memoization (repeated calls)
const memoFactorial = factorialMemo();
console.time('Memoized First Call');
console.log(memoFactorial(20));
console.timeEnd('Memoized First Call');
// Time: ~0.05-0.1ms

console.time('Memoized Second Call');
console.log(memoFactorial(20));
console.timeEnd('Memoized Second Call');
// Time: ~0.001ms (from cache!)
```

**Performance Characteristics:**

| Metric | Recursive | Iterative | Memoized |
|--------|-----------|-----------|----------|
| First Call Time | ~0.05ms | ~0.03ms | ~0.05ms |
| Repeated Call Time | ~0.05ms | ~0.03ms | ~0.001ms |
| Memory Usage | O(N) | O(1) | O(N) cache |
| Code Readability | High | Moderate | Moderate |
| Stack Overflow Risk | Yes | No | Yes |

**When to Use Each:**

**Use Recursion When:**
- Problem naturally fits recursive structure
- Code clarity is priority
- Input size is small (< 1000)
- Teaching/learning recursion

**Use Iteration When:**
- Performance is critical
- Input size is large
- Memory is constrained
- Production code

**Use Memoization When:**
- Same values calculated repeatedly
- Can afford extra memory
- Performance is critical
- Dynamic programming scenarios


## Summary

Factorial is a **perfect introduction to recursion** because:

✅ **Natural Recursive Definition:** N! = N × (N-1)!  
✅ **Clear Base Case:** 0! = 1, 1! = 1  
✅ **Simple Implementation:** Few lines of code  
✅ **Real-World Applications:** Combinatorics, probability, series  
✅ **Foundation for Advanced Topics:** Dynamic programming, backtracking  

Master factorial recursion, and you'll understand the core principles that apply to all recursive problems!


**Next Steps:**
- Implement with memoization
- Try calculating permutations (nPr)
- Explore combinations (nCr)
- Practice Fibonacci sequence
- Study tail recursion optimization

Happy Coding! 🚀

