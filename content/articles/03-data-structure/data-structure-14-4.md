---
title: "Sub-array with 0 Sum using Hashing"
description: "Detect if a subarray exists with sum zero using prefix sum and hashing. Learn the powerful technique of using cumulative sums with hash sets, optimize from O(N²) to O(N), and master subarray sum problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Sub-array with 0 Sum using Hashing

## 2. Problem Statement

Given an array of integers **A**, find and return whether the given array **contains a non-empty subarray with a sum equal to 0**.

If the given array contains a sub-array with sum zero return **1**, else return **0**.

**Input:**
- Array `A` of size N (1 ≤ N ≤ 10^5)
- Elements can be positive, negative, or zero

**Output:**
- Return 1 if subarray with sum 0 exists, else 0

## 3. Examples

### Example 1:
```
Input: A = [1, 2, 3, 4, 5]
Output: 0
Explanation: No subarray has sum 0
```

### Example 2:
```
Input: A = [4, -1, 1]
Output: 1
Explanation: Subarray [-1, 1] has sum 0
```

### Example 3:
```
Input: A = [1, 2, -2, 3]
Output: 1
Explanation: Subarray [2, -2] has sum 0
```

### Example 4:
```
Input: A = [0, 1, 2]
Output: 1
Explanation: Subarray [0] has sum 0
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ A[i] ≤ 10^9`
- Can contain negative numbers
- Can contain zero
- Must handle large numbers

## 5. Important Points

### Key Insight: Prefix Sum

**If prefix sum repeats, subarray sum is zero!**

**Why?**
```
prefixSum[i] = A[0] + A[1] + ... + A[i]
prefixSum[j] = A[0] + A[1] + ... + A[j]

If prefixSum[i] == prefixSum[j] (i < j):
Sum of subarray [i+1...j] = prefixSum[j] - prefixSum[i] = 0
```

**Special Case:**
- If prefixSum itself becomes 0, subarray [0...i] has sum 0

### Real-World Applications
- Balance checking (credits/debits)
- Signal processing (zero-crossings)
- Financial analysis
- Data validation

## 6. Brute Force Approach

Check all possible subarrays and calculate their sums.

## 7. Brute Force Code

```javascript
function hasZeroSumSubarrayBrute(A) {
    const n = A.length;
    
    // Check all subarrays
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = i; j < n; j++) {
            sum += A[j];
            if (sum === 0) {
                return 1;
            }
        }
    }
    
    return 0;
}

console.log(hasZeroSumSubarrayBrute([4, -1, 1])); // 1
console.log(hasZeroSumSubarrayBrute([1, 2, 3, 4, 5])); // 0
```

## 8. Dry Run of Brute Force

```
A = [4, -1, 1]

Subarrays starting at i=0:
  [4]: sum=4 ✗
  [4,-1]: sum=3 ✗
  [4,-1,1]: sum=4 ✗

Subarrays starting at i=1:
  [-1]: sum=-1 ✗
  [-1,1]: sum=0 ✓ Found!

Return 1
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²) - nested loops  
**Space:** O(1)

## 10. Visualization

```
A = [4, -1, 1]

Check all subarrays:
[4] = 4
[4,-1] = 3
[4,-1,1] = 4
[-1] = -1
[-1,1] = 0 ✓ Found!

Result: 1
```

## 11. Optimized Approach Description

**Use Prefix Sum + Hash Set:**

**Algorithm:**
1. Calculate prefix sum while iterating
2. Store each prefix sum in a Set
3. If prefix sum is 0 OR already in Set → return 1
4. If no match found → return 0

**Why it works:**
- Prefix sum = 0 → subarray from start has sum 0
- Prefix sum repeats → subarray between repeats has sum 0

## 12. Optimized Approach Algorithm

```
1. Initialize: prefixSum = 0, set = {}
2. For each element:
     a. Add element to prefixSum
     b. If prefixSum == 0: return 1
     c. If prefixSum in set: return 1
     d. Add prefixSum to set
3. Return 0
```

## 13. Optimized Code

```javascript
/**
 * Check if subarray with sum 0 exists
 * @param {number[]} A - Input array
 * @returns {number} - 1 if exists, 0 otherwise
 */
function hasZeroSumSubarray(A) {
    const seen = new Set();
    let prefixSum = 0;
    
    for (const num of A) {
        prefixSum += num;
        
        // If prefix sum is 0 or repeats
        if (prefixSum === 0 || seen.has(prefixSum)) {
            return 1;
        }
        
        seen.add(prefixSum);
    }
    
    return 0;
}

// Test cases
console.log(hasZeroSumSubarray([1, 2, 3, 4, 5])); // 0
console.log(hasZeroSumSubarray([4, -1, 1])); // 1
console.log(hasZeroSumSubarray([1, 2, -2, 3])); // 1
console.log(hasZeroSumSubarray([0, 1, 2])); // 1
console.log(hasZeroSumSubarray([-1, 1])); // 1
```

### With Detailed Comments

```javascript
function hasZeroSumSubarrayDetailed(A) {
    const prefixSums = new Set();
    let currentSum = 0;
    
    for (let i = 0; i < A.length; i++) {
        // Add current element to prefix sum
        currentSum += A[i];
        
        // Case 1: Prefix sum from start is 0
        if (currentSum === 0) {
            return 1; // Subarray [0...i] has sum 0
        }
        
        // Case 2: Current prefix sum seen before
        if (prefixSums.has(currentSum)) {
            return 1; // Subarray between repeats has sum 0
        }
        
        // Store current prefix sum
        prefixSums.add(currentSum);
    }
    
    return 0; // No zero-sum subarray found
}
```

## 14. Dry Run of Optimized

```
A = [1, 2, -2, 3]

Initialize: prefixSum=0, seen={}

i=0, A[0]=1:
  prefixSum = 0+1 = 1
  prefixSum≠0, not in seen
  seen = {1}

i=1, A[1]=2:
  prefixSum = 1+2 = 3
  prefixSum≠0, not in seen
  seen = {1, 3}

i=2, A[2]=-2:
  prefixSum = 3+(-2) = 1
  prefixSum≠0, but 1 is in seen! ✓
  Return 1

Explanation: prefixSum[1]=3, prefixSum[2]=1
Same prefix (1) at indices 0 and 2
Subarray [1,2] = [2,-2] has sum 0
```

### Visual Trace:
```
A = [1, 2, -2, 3]
Prefix: [1, 3, 1, 4]
         ↑     ↑
         Same! → Subarray [2,-2] = 0
```

## 15. Time and Space Complexity

**Time:** O(N) - single pass  
**Space:** O(N) - prefix sum set

**Comparison:**
- Brute Force: O(N²), O(1)
- Optimized: O(N), O(N)

Massive speedup for large arrays!

## 16. Visualization

```
A = [4, -1, 1]

Prefix Sums:
Index:  0   1   2
Value:  4  -1   1
Prefix: 4   3   4
        ↑       ↑
        Same prefix!

prefixSum[0] = 4
prefixSum[2] = 4
Subarray [1,2] = [-1,1] = 0 ✓
```

### Another Example:
```
A = [1, 2, -2, 3]

Build prefix sums:
┌───────┬──────┬──────┐
│ Index │Value │Prefix│
├───────┼──────┼──────┤
│   0   │  1   │  1   │
│   1   │  2   │  3   │
│   2   │ -2   │  1   │← Repeat!
│   3   │  3   │  4   │
└───────┴──────┴──────┘

Prefix 1 appears twice → Zero-sum subarray exists!
```

## 17. Edge Cases

```javascript
// Single element zero
hasZeroSumSubarray([0]); // 1

// Entire array sums to 0
hasZeroSumSubarray([1, -1]); // 1

// Multiple zero-sum subarrays
hasZeroSumSubarray([1, -1, 2, -2]); // 1

// No zero-sum subarray
hasZeroSumSubarray([1, 2, 3]); // 0

// All zeros
hasZeroSumSubarray([0, 0, 0]); // 1

// Negative numbers
hasZeroSumSubarray([-1, -2, 3]); // 1
```

## 18. Key Takeaways

### a. Applications
- Financial balance validation
- Signal processing (zero-crossings)
- Game score tracking
- Resource allocation problems

### b. Interview Strategy
- Explain prefix sum concept clearly
- Draw visualization of repeating prefix sums
- Mention O(N) time with O(N) space tradeoff
- Handle zero element case explicitly

### c. Common Mistakes
```javascript
// ❌ Forgetting to check prefixSum == 0
if (seen.has(prefixSum)) return 1;

// ✓ Check both conditions
if (prefixSum === 0 || seen.has(prefixSum)) return 1;

// ❌ Adding to set before checking
seen.add(prefixSum);
if (seen.has(prefixSum)) return 1; // Wrong order!

// ✓ Check first, then add
if (seen.has(prefixSum)) return 1;
seen.add(prefixSum);
```

### d. Related Problems
- **Subarray Sum Equals K** - Find count
- **Longest Subarray with Sum 0** - Find length
- **Count Subarray with Sum 0** - Count all
- **Maximum Subarray Sum** - Kadane's algorithm

### e. Performance
- Prefix sum is powerful technique
- Hash set for O(1) lookup
- Essential pattern for subarray problems
- Applicable to many variations

## Summary

✅ **Prefix Sum + Hashing:** Powerful combination  
✅ **O(N) Solution:** Single pass with set  
✅ **Key Insight:** Repeating prefix → zero-sum subarray  
✅ **Two cases:** prefixSum==0 OR prefixSum repeats  

Master this pattern for all subarray sum problems!

Happy Coding! 🚀

