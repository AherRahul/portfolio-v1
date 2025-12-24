---
title: "Count Pair Sum using Hashing"
description: "Count pairs with given sum using hash maps. Learn to count valid pairs while avoiding duplicates, handle frequency-based counting, and master the pair counting pattern with modulo operations."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Count Pair Sum using Hashing

## 2. Problem Statement

You are given an array **A** of **N** integers and an integer **B**. Count the number of pairs **(i, j)** such that **A[i] + A[j] = B** and **i ≠ j**.

Since the answer can be very large, return the remainder after dividing the count with **10^9 + 7**.

**Note:** The pair (i, j) is same as the pair (j, i) and we need to count it only once.

**Input:**
- Array `A` of size N
- Integer `B` (target sum)

**Output:**
- Count of pairs with sum B (mod 10^9+7)

## 3. Examples

### Example 1:
```
Input: A = [1, 2, 3, 4, 3], B = 6
Output: 2
Explanation: Pairs: (2, 4) and (3, 3)
- A[1] + A[3] = 2 + 4 = 6
- A[2] + A[4] = 3 + 3 = 6
```

### Example 2:
```
Input: A = [1, 2, 1, 2], B = 3
Output: 4
Explanation: All pairs (1, 2) count
- (0, 1), (0, 3), (2, 1), (2, 3)
```

### Example 3:
```
Input: A = [1, 1, 1, 1], B = 2
Output: 6
Explanation: C(4, 2) = 6 pairs of 1+1=2
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `1 ≤ A[i], B ≤ 10^9`
- Return answer modulo 10^9+7
- Count unordered pairs (i, j) where i < j

## 5. Important Points

### Counting Strategy

**Two Cases:**

**Case 1: Different elements** (A[i] ≠ A[j])
```
If x + y = B where x ≠ y:
count = freq[x] * freq[y]
```

**Case 2: Same element** (A[i] = A[j] = B/2)
```
If x + x = B:
count = C(freq[x], 2) = freq[x] * (freq[x] - 1) / 2
```

**Example:**
```
A = [1, 2, 3, 4, 3], B = 6

freq = {1:1, 2:1, 3:2, 4:1}

Pairs:
- (2, 4): freq[2] * freq[4] = 1 * 1 = 1
- (3, 3): C(2, 2) = 2 * 1 / 2 = 1

Total: 2
```

### Avoiding Double Counting

Process each unique pair only once:
- For x + y = B where x < y: count once
- For x + x = B: use combination formula

## 6. Brute Force Approach

Check all pairs and count those summing to B.

## 7. Brute Force Code

```javascript
function countPairSumBrute(A, B) {
    const MOD = 1000000007;
    let count = 0;
    
    for (let i = 0; i < A.length; i++) {
        for (let j = i + 1; j < A.length; j++) {
            if (A[i] + A[j] === B) {
                count = (count + 1) % MOD;
            }
        }
    }
    
    return count;
}

console.log(countPairSumBrute([1, 2, 3, 4, 3], 6)); // 2
```

## 8. Dry Run of Brute Force

```
A = [1, 2, 3, 4, 3], B = 6

Check all pairs:
(0,1): 1+2=3 ✗
(0,2): 1+3=4 ✗
(0,3): 1+4=5 ✗
(0,4): 1+3=4 ✗
(1,2): 2+3=5 ✗
(1,3): 2+4=6 ✓ count=1
(1,4): 2+3=5 ✗
(2,3): 3+4=7 ✗
(2,4): 3+3=6 ✓ count=2
(3,4): 4+3=7 ✗

Result: 2
```

## 9. Time and Space Complexity of Brute Force

**Time Complexity:** O(N²)  
**Space Complexity:** O(1)

**Problem:** Too slow for large arrays (N = 10^5 → 10^10 operations)

## 10. Visualization (Brute Force)

```
A = [1, 2, 3, 4, 3], B = 6

All pairs:
1+2=3, 1+3=4, 1+4=5, 1+3=4
2+3=5, 2+4=6 ✓, 2+3=5
3+4=7, 3+3=6 ✓
4+3=7

Count: 2
```

## 11. Optimized Approach Description

**Use Frequency Map:**

1. Count frequency of each element
2. For each unique element x:
   - If x * 2 = B: Add C(freq[x], 2)
   - If x < B-x and (B-x) exists: Add freq[x] * freq[B-x]

**Key:** Process each pair only once to avoid double counting.

## 12. Optimized Approach Algorithm

```
1. Build frequency map
2. Initialize count = 0
3. For each unique element x:
   a. complement = B - x
   b. If x == complement:
      count += freq[x] * (freq[x] - 1) / 2
   c. Else if x < complement and complement in map:
      count += freq[x] * freq[complement]
4. Return count % MOD
```

## 13. Optimized Code

```javascript
/**
 * Count pairs with given sum using hashing
 * @param {number[]} A - Input array
 * @param {number} B - Target sum
 * @returns {number} - Count of pairs (mod 10^9+7)
 */
function countPairSum(A, B) {
    const MOD = 1000000007;
    const freq = new Map();
    
    // Build frequency map
    for (const num of A) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    let count = 0;
    
    // Count pairs
    for (const [num, frequency] of freq) {
        const complement = B - num;
        
        if (num === complement) {
            // Same element: C(freq, 2) = freq * (freq-1) / 2
            count = (count + (frequency * (frequency - 1)) / 2) % MOD;
        } else if (num < complement && freq.has(complement)) {
            // Different elements: freq[x] * freq[y]
            count = (count + frequency * freq.get(complement)) % MOD;
        }
    }
    
    return count;
}

// Test cases
console.log(countPairSum([1, 2, 3, 4, 3], 6)); // 2
console.log(countPairSum([1, 2, 1, 2], 3)); // 4
console.log(countPairSum([1, 1, 1, 1], 2)); // 6
```

### Alternative: Single Pass with Visited Set

```javascript
function countPairSumAlt(A, B) {
    const MOD = 1000000007;
    const freq = new Map();
    const visited = new Set();
    let count = 0;
    
    // Build frequency
    A.forEach(x => freq.set(x, (freq.get(x) || 0) + 1));
    
    for (const [num, f] of freq) {
        if (visited.has(num)) continue;
        
        const comp = B - num;
        visited.add(num);
        visited.add(comp);
        
        if (num === comp) {
            count = (count + (f * (f - 1)) / 2) % MOD;
        } else if (freq.has(comp)) {
            count = (count + f * freq.get(comp)) % MOD;
        }
    }
    
    return count;
}
```

## 14. Dry Run of Optimized Approach

```
A = [1, 2, 3, 4, 3], B = 6

Step 1: Build frequency map
freq = {
  1: 1,
  2: 1,
  3: 2,
  4: 1
}

Step 2: Count pairs

Process 1:
  complement = 6 - 1 = 5
  5 not in map → Skip

Process 2:
  complement = 6 - 2 = 4
  2 < 4 and 4 in map ✓
  count += 1 * 1 = 1

Process 3:
  complement = 6 - 3 = 3
  3 == 3 (same element)
  count += 2 * (2-1) / 2 = 2 * 1 / 2 = 1
  count = 1 + 1 = 2

Process 4:
  complement = 6 - 4 = 2
  4 > 2 → Already counted
  Skip (to avoid double counting)

Final Result: 2
```

### Detailed Trace Table:

| Element | Frequency | Complement | Condition | Calculation | Count |
|---------|-----------|------------|-----------|-------------|-------|
| 1 | 1 | 5 | Not in map | - | 0 |
| 2 | 1 | 4 | 2 < 4, exists | 1 × 1 | 1 |
| 3 | 2 | 3 | Same element | 2×1/2 | 2 |
| 4 | 1 | 2 | 4 > 2, skip | - | 2 |

## 15. Time and Space Complexity of Optimized

**Time Complexity:** O(N)
- Build frequency map: O(N)
- Iterate unique elements: O(K) where K ≤ N
- Total: **O(N)**

**Space Complexity:** O(K)
- Frequency map stores K unique elements
- K ≤ N, so **O(N)** worst case

**Comparison:**
- Brute Force: O(N²) time, O(1) space
- Optimized: O(N) time, O(N) space
- **Speedup: N times faster!**

For N = 100,000:
- Brute Force: ~10,000,000,000 operations (infeasible)
- Optimized: ~100,000 operations (instant)

## 16. Visualization

```
Frequency Map Approach:

A = [1, 2, 3, 4, 3], B = 6

Build map:
┌───┬────┐
│ 1 │ 1  │
│ 2 │ 1  │
│ 3 │ 2  │
│ 4 │ 1  │
└───┴────┘

Count pairs:
2 + 4 = 6 → freq[2] × freq[4] = 1 × 1 = 1
3 + 3 = 6 → C(2,2) = 2×1/2 = 1

Total: 1 + 1 = 2
```

### Visual Representation of Pairs:

```
A = [1, 2, 3, 4, 3]
     0  1  2  3  4  (indices)

Target sum = 6

Pair 1: indices (1, 3)
A[1]=2, A[3]=4 → 2+4=6 ✓

Pair 2: indices (2, 4)
A[2]=3, A[4]=3 → 3+3=6 ✓

Count: 2
```

## 17. Edge Cases to Consider

### 1. All Same Elements
```javascript
countPairSum([1, 1, 1, 1], 2);
// freq[1] = 4
// C(4, 2) = 4×3/2 = 6
// Output: 6
```

### 2. No Valid Pairs
```javascript
countPairSum([1, 2, 3], 10);
// No two elements sum to 10
// Output: 0
```

### 3. Single Element
```javascript
countPairSum([5], 10);
// Only one element, can't form pair
// Output: 0
```

### 4. Two Elements (Valid)
```javascript
countPairSum([3, 3], 6);
// 3 + 3 = 6
// Output: 1
```

### 5. Large Numbers
```javascript
countPairSum([1000000000, 1000000000], 2000000000);
// freq[1000000000] = 2
// C(2, 2) = 1
// Output: 1
```

### 6. Multiple Frequencies
```javascript
countPairSum([1, 2, 1, 2, 1, 2], 3);
// freq[1] = 3, freq[2] = 3
// count = 3 × 3 = 9
// Output: 9
```

## 18. Key Takeaways

### a. Applications

1. **Statistics & Analytics**
   - Correlation analysis
   - Data pair matching
   - Pattern finding

2. **E-commerce**
   - Product bundling
   - Recommendation systems
   - Price matching

3. **Financial Systems**
   - Transaction matching
   - Balance verification
   - Fraud detection

4. **Gaming**
   - Team formation
   - Match making
   - Score pairing

### b. Interview Strategy

**When Asked This Problem:**

1. **Clarify Requirements**
   - "Should I count ordered or unordered pairs?"
   - "How to handle duplicates?"
   - "What about same element pairs?"
   - "Need to return actual pairs or just count?"

2. **Start with Brute Force**
   - Show O(N²) nested loop solution
   - Explain why it's slow
   - Identify optimization opportunity

3. **Introduce Hash Map**
   - Explain frequency counting
   - Show how to avoid double counting
   - Handle same element case separately

4. **Code Optimized Solution**
   - Build frequency map
   - Process each unique element
   - Apply correct formulas

5. **Analyze Complexity**
   - Time: O(N)
   - Space: O(N)
   - Explain modulo usage

**Follow-up Questions to Expect:**
- "What if we need to find actual pairs, not just count?"
- "Can you optimize space to O(1)?" (Not possible without sorting)
- "What about three-sum or k-sum?"
- "How would you handle negative numbers?"

### c. Common Mistakes

1. **Double Counting Pairs**
```javascript
// ❌ WRONG: Counts (i,j) and (j,i) separately
for (const x of uniqueElements) {
    const y = B - x;
    if (map.has(y)) {
        count += freq[x] * freq[y]; // Wrong!
    }
}

// ✓ CORRECT: Ensure x < y or handle same element
if (x === y) {
    count += freq[x] * (freq[x] - 1) / 2;
} else if (x < y && freq.has(y)) {
    count += freq[x] * freq[y];
}
```

2. **Wrong Combination Formula**
```javascript
// ❌ WRONG: For same element
count += freq[x]; // Only counts one occurrence

// ✓ CORRECT: Use combination formula
count += freq[x] * (freq[x] - 1) / 2;
```

3. **Not Handling Modulo**
```javascript
// ❌ WRONG: Can overflow for large counts
return count;

// ✓ CORRECT: Apply modulo
return count % MOD;
```

4. **Forgetting to Check Existence**
```javascript
// ❌ WRONG: Will error if complement doesn't exist
count += freq[x] * freq[B - x];

// ✓ CORRECT: Check existence first
if (freq.has(B - x)) {
    count += freq[x] * freq[B - x];
}
```

### d. Related Problems

**Beginner Level:**
1. **Two Sum** - Find pair with target sum
2. **Check Pair Sum** - Boolean version
3. **Valid Pair** - Check if valid pair exists
4. **Pair with Given Product** - Product instead of sum

**Intermediate Level:**
5. **Three Sum** - Find triplets with target sum
6. **Four Sum** - Find quadruplets
7. **Pair with Difference** - Target difference instead of sum
8. **Count Pairs with Specific Property** - Various constraints

**Advanced Level:**
9. **K-Sum Problem** - Generalize to K elements
10. **Pair Sum in BST** - On tree structure
11. **Pair Sum in Sorted Array** - Two-pointer optimization
12. **Minimum Pair Sum** - Optimization variant

### e. Performance

**Benchmarking:**

```javascript
const N = 100000;
const A = Array.from({length: N}, () => Math.floor(Math.random() * 1000));
const B = 500;

// Brute Force (DON'T RUN - too slow!)
// Would take several minutes

// Optimized
console.time('Optimized');
countPairSum(A, B);
console.timeEnd('Optimized');
// Time: ~10-20ms
```

**Performance Comparison:**

| Input Size | Brute Force | Optimized | Speedup |
|-----------|-------------|-----------|---------|
| N=100 | ~1ms | <1ms | ~10× |
| N=1,000 | ~100ms | ~2ms | ~50× |
| N=10,000 | ~10s | ~10ms | ~1000× |
| N=100,000 | ~15min | ~50ms | ~18000× |

**Space-Time Tradeoff:**
- Brute Force: No extra space, but O(N²) time
- Hash Map: O(N) space, but O(N) time
- Trade-off is **always worth it** for this problem

## Summary

Counting pairs with hash maps is an **essential interview pattern**!

✅ **Frequency Map:** Count occurrences first  
✅ **Two Cases:** Same element vs different elements  
✅ **Avoid Double Counting:** Process each pair once  
✅ **Combination Formula:** C(n,2) = n*(n-1)/2 for same elements  
✅ **O(N) Solution:** Optimal time complexity  

**Key Formulas:**
- Same element (x + x = B): `freq[x] * (freq[x] - 1) / 2`
- Different elements (x + y = B): `freq[x] * freq[y]`

Master this pattern, and you'll handle all pair-counting problems!

Happy Coding! 🚀

