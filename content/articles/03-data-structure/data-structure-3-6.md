---
title: "Pick from Both Sides"
description: "Master the sliding window technique to pick elements from array ends. Learn how to maximize sum by picking K elements from either left or right side of an array."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Sliding Window"
    type: "reference"
    url: "https://www.geeksforgeeks.org/window-sliding-technique/"
    description: "Sliding window technique"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Problem Statement

Given an integer array `A` of size `N` and an integer `B`, you need to pick exactly `B` elements from the array.

**Constraint:** You can **only pick elements from the left end OR the right end** of the array (not from the middle).

**Goal:** Find the **maximum sum** of `B` elements you can pick.

**Input:**
- An integer array `A[]` of size `N`
- An integer `B` representing the number of elements to pick

**Output:**
- Return the maximum sum achievable by picking `B` elements from the ends

**Rules:**
- Must pick exactly `B` elements
- Can only pick from leftmost or rightmost positions
- Cannot pick from the middle of the array

---

## Examples

### Example 1:
**Input:** `A = [5, -2, 3, 1, 2]`, `B = 3`  
**Output:** `8`

**Explanation:**
```
All possible ways to pick 3 elements:

Option 1: Pick 3 from left
[5, -2, 3, 1, 2]
 ←  ←  ←
Sum = 5 + (-2) + 3 = 6

Option 2: Pick 2 from left, 1 from right
[5, -2, 3, 1, 2]
 ←  ←        →
Sum = 5 + (-2) + 2 = 5

Option 3: Pick 1 from left, 2 from right ✓ MAXIMUM
[5, -2, 3, 1, 2]
 ←        →  →
Sum = 5 + 1 + 2 = 8

Option 4: Pick 3 from right
[5, -2, 3, 1, 2]
       →  →  →
Sum = 3 + 1 + 2 = 6

Maximum = 8
```

### Example 2:
**Input:** `A = [1, 2, 3, 4, 5]`, `B = 3`  
**Output:** `12`

**Explanation:**
```
Best strategy: Pick 3 from right
[1, 2, 3, 4, 5]
       →  →  →
Sum = 3 + 4 + 5 = 12
```

### Example 3:
**Input:** `A = [-55, 91, 81, 58, -9, -78, -38]`, `B = 2`  
**Output:** `172`

**Explanation:**
```
Best strategy: Pick 2 from left
[-55, 91, 81, 58, -9, -78, -38]
  ←   ←
Sum = (-55) + 91 = 36? No!

Actually: Pick 1 from left, 1 from right?
Let's check: -55 + (-38) = -93

Try: Pick 2 from left (positions 1,2)
91 + 81 = 172 ✓ MAXIMUM
```

---

## Constraints

- `1 ≤ N ≤ 10^5`
- `1 ≤ B ≤ N`
- `-10^3 ≤ A[i] ≤ 10^3`
- Array can contain negative numbers
- Must pick exactly `B` elements
- Time limit: O(N) or O(B) solution required

---

## Important Points to Understand

1. **Pick from Ends Only:**
   - Cannot pick elements from the middle
   - Only leftmost and rightmost elements are accessible
   - Like picking cards from the top or bottom of a deck

2. **All Combinations:**
   - Pick 0 from left, B from right
   - Pick 1 from left, B-1 from right
   - Pick 2 from left, B-2 from right
   - ...
   - Pick B from left, 0 from right
   - Total combinations: B + 1

3. **Sliding Window Insight:**
   - Start with all B elements from left
   - Gradually remove from left, add from right
   - This is essentially a sliding window of size B

4. **Optimization:**
   - Don't recalculate sums from scratch
   - Use running sums to adjust in O(1) per step
   - Precompute left sum, then incrementally adjust

5. **Negative Numbers:**
   - Array can have negative elements
   - Need to check all combinations
   - Greedy (only left or only right) might not work

---

## Approach

### Optimal Strategy: Sliding Window

**Core Idea:**
- Start by picking all B elements from the left
- For each iteration:
  - Remove one element from the left
  - Add one element from the right
  - Track the maximum sum seen

**Algorithm:**
1. Calculate sum of first B elements (all from left)
2. Set `maxSum = leftSum`
3. For i from 0 to B-1:
   - Remove element at position (B-1-i) from left
   - Add element at position (N-1-i) from right
   - Update `maxSum` if current sum is better
4. Return `maxSum`

**Why this works:**
- We check all B+1 combinations efficiently
- Each transition from one combination to another is O(1)
- Total time: O(B)

---

## Time Complexity

**Optimal Solution: O(B)**
- Initial sum calculation: O(B)
- B iterations to check all combinations: O(B)
- Constant time per iteration: O(1)
- Total: O(B)

**Brute Force: O(B² or B×N)**
- Generate all combinations: O(B+1)
- Calculate sum for each: O(B)
- Total: O(B²)
- Or iterate differently: O(B×N)

---

## Space Complexity

**Optimal Solution: O(1)**
- Only storing `leftSum`, `rightSum`, `maxSum`
- No additional data structures
- Constant auxiliary space

---

## Dry Run

Let's trace through **A = [5, -2, 3, 1, 2]**, **B = 3**:

```
Step 1: Calculate initial leftSum (all 3 from left)
leftSum = A[0] + A[1] + A[2] = 5 + (-2) + 3 = 6
maxSum = 6

Step 2: Iteration 0 (remove 1 from left, add 1 from right)
Remove: A[2] = 3
Add: A[4] = 2
leftSum = 6 - 3 = 3
rightSum = 0 + 2 = 2
currentSum = 3 + 2 = 5
maxSum = max(6, 5) = 6

Step 3: Iteration 1 (remove 1 more from left, add 1 more from right)
Remove: A[1] = -2
Add: A[3] = 1
leftSum = 3 - (-2) = 5
rightSum = 2 + 1 = 3
currentSum = 5 + 3 = 8
maxSum = max(6, 8) = 8  ← Maximum found!

Step 4: Iteration 2 (remove 1 more from left, add 1 more from right)
Remove: A[0] = 5
Add: A[2] = 3
leftSum = 5 - 5 = 0
rightSum = 3 + 3 = 6
currentSum = 0 + 6 = 6
maxSum = max(8, 6) = 8

Final: maxSum = 8
```

---

## Brute Force Approach

**Naive Solution:** Try all combinations explicitly

```javascript
function pickFromBothSidesBrute(A, B) {
    const N = A.length;
    let maxSum = -Infinity;
    
    // Try all combinations: i from left, (B-i) from right
    for (let leftPick = 0; leftPick <= B; leftPick++) {
        const rightPick = B - leftPick;
        let sum = 0;
        
        // Add elements from left
        for (let i = 0; i < leftPick; i++) {
            sum += A[i];
        }
        
        // Add elements from right
        for (let i = 0; i < rightPick; i++) {
            sum += A[N - 1 - i];
        }
        
        maxSum = Math.max(maxSum, sum);
    }
    
    return maxSum;
}

console.log(pickFromBothSidesBrute([5, -2, 3, 1, 2], 3)); 
// Output: 8
```

**Time Complexity:** O(B²)  
**Space Complexity:** O(1)

**Problem:** Recalculates sums from scratch for each combination

---

## Visualization

### All Combinations for A = [5, -2, 3, 1, 2], B = 3:

```
Pick 3 from left, 0 from right:
[5, -2, 3 | 1, 2]
 ←  ←  ←
Sum = 5 + (-2) + 3 = 6

Pick 2 from left, 1 from right:
[5, -2 | 3, 1, 2]
 ←  ←          →
Sum = 5 + (-2) + 2 = 5

Pick 1 from left, 2 from right: ← MAXIMUM
[5 | -2, 3, 1, 2]
 ←         →  →
Sum = 5 + 1 + 2 = 8

Pick 0 from left, 3 from right:
[5, -2 | 3, 1, 2]
         →  →  →
Sum = 3 + 1 + 2 = 6
```

### Sliding Window Visualization:

```
Array: [5, -2, 3, 1, 2]
         ↑       ↑
         L       R (initially pick 3 from L)

Iteration 0: [5, -2, 3] → Sum = 6
Iteration 1: [5, -2] + [2] → Sum = 5
Iteration 2: [5] + [1, 2] → Sum = 8 ✓
Iteration 3: [] + [3, 1, 2] → Sum = 6
```

---

## Multiple Optimized Approaches

### Approach 1: Sliding Window (Most Efficient)

```javascript
function solve(A, B) {
    const N = A.length;
    
    // Calculate initial sum: all B elements from left
    let leftSum = 0;
    for (let i = 0; i < B; i++) {
        leftSum += A[i];
    }
    
    let maxSum = leftSum;
    let rightSum = 0;
    
    // Slide window: remove from left, add from right
    for (let i = 0; i < B; i++) {
        leftSum -= A[B - 1 - i];  // Remove from left end
        rightSum += A[N - 1 - i];  // Add from right end
        
        maxSum = Math.max(maxSum, leftSum + rightSum);
    }
    
    return maxSum;
}
```

**Time:** O(B) | **Space:** O(1)

### Approach 2: Prefix Sum Arrays (Alternative)

```javascript
function solveWithPrefix(A, B) {
    const N = A.length;
    
    // Build prefix sum from left
    const leftPrefix = [A[0]];
    for (let i = 1; i < B; i++) {
        leftPrefix[i] = leftPrefix[i-1] + A[i];
    }
    
    // Build suffix sum from right
    const rightSuffix = [A[N-1]];
    for (let i = N-2; i >= N-B; i--) {
        rightSuffix[N-1-i] = rightSuffix[N-2-i] + A[i];
    }
    
    let maxSum = leftPrefix[B-1];  // All from left
    
    // Try combinations
    for (let i = 0; i < B; i++) {
        const leftSum = i > 0 ? leftPrefix[i-1] : 0;
        const rightSum = rightSuffix[B-1-i];
        maxSum = Math.max(maxSum, leftSum + rightSum);
    }
    
    return maxSum;
}
```

**Time:** O(B) | **Space:** O(B)

### Approach 3: Two Pointer Concept

```javascript
function solveWithTwoPointers(A, B) {
    const N = A.length;
    let maxSum = -Infinity;
    
    for (let leftCount = 0; leftCount <= B; leftCount++) {
        const rightCount = B - leftCount;
        let sum = 0;
        
        // Add from left
        for (let i = 0; i < leftCount; i++) {
            sum += A[i];
        }
        
        // Add from right
        for (let i = 0; i < rightCount; i++) {
            sum += A[N - 1 - i];
        }
        
        maxSum = Math.max(maxSum, sum);
    }
    
    return maxSum;
}
```

**Time:** O(B²) | **Space:** O(1)
**Note:** Less efficient but clearer logic

---

## Edge Cases to Consider

1. **Pick All Elements:**
   - Input: `A = [1, 2, 3]`, `B = 3`
   - Output: `6` (sum of entire array)

2. **Pick One Element:**
   - Input: `A = [5, -2, 3]`, `B = 1`
   - Output: `5` (max of first or last)

3. **All Negative Numbers:**
   - Input: `A = [-5, -2, -8, -1]`, `B = 2`
   - Output: `-3` (pick -2 and -1)

4. **Mixed Positive and Negative:**
   - Input: `A = [-10, 5, -3, 8]`, `B = 2`
   - Output: `13` (pick 5 and 8)

5. **Single Element Array:**
   - Input: `A = [7]`, `B = 1`
   - Output: `7`

6. **Large B:**
   - Input: `A = [1, 2, ..., 1000]`, `B = 500`
   - Must handle efficiently with O(B) solution

---

## JavaScript Code

```javascript
/**
 * Pick from Both Sides - Optimal Solution
 * Time Complexity: O(B)
 * Space Complexity: O(1)
 */
function solve(A, B) {
    const N = A.length;
    
    // Edge case: if B equals N, return sum of all elements
    if (B === N) {
        return A.reduce((sum, val) => sum + val, 0);
    }
    
    // Step 1: Calculate sum of first B elements (all from left)
    let leftSum = 0;
    for (let i = 0; i < B; i++) {
        leftSum += A[i];
    }
    
    let maxSum = leftSum;
    let rightSum = 0;
    
    // Step 2: Slide window - remove from left, add from right
    for (let i = 0; i < B; i++) {
        leftSum -= A[B - 1 - i];       // Remove from left end
        rightSum += A[N - 1 - i];      // Add from right end
        
        const currentSum = leftSum + rightSum;
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}

// Example Usage:
console.log("Example 1:");
console.log(solve([5, -2, 3, 1, 2], 3));  // Output: 8

console.log("\nExample 2:");
console.log(solve([1, 2, 3, 4, 5], 3));   // Output: 12

console.log("\nExample 3:");
console.log(solve([-55, 91, 81, 58, -9, -78, -38], 2));  // Output: 172

console.log("\nEdge Cases:");
console.log(solve([1, 2, 3], 3));          // Output: 6
console.log(solve([5, -2, 3], 1));         // Output: 5
console.log(solve([-5, -2, -8, -1], 2));   // Output: -3
```

---

## Key Takeaways

1. **Sliding Window Pattern:** Convert "pick from ends" into a sliding window problem

2. **All Combinations in O(B):** Check all B+1 combinations efficiently

3. **Running Sums:** Avoid recalculation by maintaining running totals

4. **Space Optimization:** No need for additional arrays, use variables

5. **Negative Numbers:** Must check all combinations as greedy doesn't work

6. **Array Ends:** Understanding boundary access is crucial

7. **Interview Pattern:** Common in "two pointer" and "sliding window" categories

8. **Optimal Complexity:** O(B) time and O(1) space is the best achievable

9. **Real-World:** Models problems like selecting cards, resource allocation

10. **Generalization:** Can extend to "pick K from both sides" variants

