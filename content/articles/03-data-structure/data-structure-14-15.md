---
title: "Subarray with Given Sum using Hashing"
description: "Find subarray with target sum using prefix sum and hashing. Master cumulative sum patterns, handle negative numbers, and learn the prefix sum technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Subarray with Given Sum

## 2. Problem Statement

Given an array **A** of **N** positive integers and a number **B**, find if there exists a **contiguous subarray** with sum equal to **B**.

Return **1** if such a subarray exists, otherwise return **0**.

**Input:**
- Array `A` of size N
- Integer `B` (target sum)

**Output:**
- 1 if exists, 0 otherwise

## 3. Examples

```
Input: A = [1, 2, 3, 7, 5], B = 12
Output: 1
Explanation: [2, 3, 7] = 12

Input: A = [1, 2, 3, 4, 5], B = 15
Output: 1
Explanation: [1, 2, 3, 4, 5] = 15

Input: A = [1, 2, 3], B = 10
Output: 0
Explanation: No subarray sums to 10
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `1 ≤ A[i] ≤ 10^9`
- `1 ≤ B ≤ 10^9`

## 5. Important Points

**Key Formula:**
```
If prefix[j] - prefix[i] = B
Then prefix[i] = prefix[j] - B
```

**Strategy:**
- Use prefix sum with hash set
- Check if (currentSum - B) exists
- Early return on match

## 6. Brute Force Approach

Generate all subarrays and check their sum.

## 7. Brute Force Code

```javascript
function subarrayWithSumBrute(A, B) {
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = i; j < A.length; j++) {
            sum += A[j];
            if (sum === B) {
                return 1;
            }
        }
    }
    return 0;
}
```

## 8. Dry Run

```
A = [1, 2, 3, 7, 5], B = 12

i=0: 1, 3, 6, 13 ✗
i=1: 2, 5, 12 ✓ [2,3,7]

Result: 1
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
Array: [1, 2, 3, 7, 5]
Target: 12

Subarray [2, 3, 7]:
2 + 3 + 7 = 12 ✓
```

## 11. Optimized Approach Description

Use prefix sum with hash set. Store all prefix sums and check if `currentSum - B` exists in set.

## 12. Optimized Approach Algorithm

```
1. Initialize prefixSet with 0 (empty prefix)
2. Initialize currentSum = 0
3. For each element:
   - Add to currentSum
   - Check if (currentSum - B) in prefixSet
   - If yes, return 1
   - Add currentSum to prefixSet
4. Return 0
```

## 13. Optimized Code

```javascript
function subarrayWithSum(A, B) {
    const prefixSet = new Set([0]);
    let currentSum = 0;
    
    for (const num of A) {
        currentSum += num;
        
        if (prefixSet.has(currentSum - B)) {
            return 1;
        }
        
        prefixSet.add(currentSum);
    }
    
    return 0;
}

// Test cases
console.log(subarrayWithSum([1, 2, 3, 7, 5], 12)); // 1
console.log(subarrayWithSum([1, 2, 3, 4, 5], 15)); // 1
console.log(subarrayWithSum([1, 2, 3], 10)); // 0
console.log(subarrayWithSum([5], 5)); // 1
```

## 14. Dry Run

```
A = [1, 2, 3, 7, 5], B = 12
prefixSet = {0}
currentSum = 0

i=0, num=1:
  currentSum = 1
  Check: 1-12=-11 not in set
  prefixSet = {0, 1}

i=1, num=2:
  currentSum = 3
  Check: 3-12=-9 not in set
  prefixSet = {0, 1, 3}

i=2, num=3:
  currentSum = 6
  Check: 6-12=-6 not in set
  prefixSet = {0, 1, 3, 6}

i=3, num=7:
  currentSum = 13
  Check: 13-12=1 in set ✓
  Return 1
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
Array:  [1, 2, 3, 7, 5]
Prefix: [1, 3, 6, 13, 18]
Target: 12

At index 3:
prefix[3] = 13
Looking for: 13 - 12 = 1
Found at index 0 ✓

Subarray: indices 1 to 3
[2, 3, 7] = 12
```

## 17. Edge Cases

```javascript
// Single element = target
subarrayWithSum([5], 5); // 1

// Entire array
subarrayWithSum([1, 2, 3], 6); // 1

// No solution
subarrayWithSum([5, 5, 5], 1); // 0

// Large sum
subarrayWithSum([1, 1000000], 1000000); // 1
```

## 18. Key Takeaways

### a. Applications
- Range sum queries
- Financial analysis
- Budget planning

### b. Interview Strategy
- Use prefix sum pattern
- Initialize set with 0
- Check before adding

### c. Common Mistakes
- Forgetting to add 0 to set
- Wrong difference calculation
- Not handling single element

### d. Related Problems
- Subarray Sum Equals K
- Longest Subarray Zero Sum
- Count Subarrays with Sum

### e. Performance
- O(N) optimal solution
- Hash set for O(1) lookup

## Summary

✅ **Prefix Sum:** Track cumulative sums  
✅ **Hash Set:** O(1) existence check  
✅ **Early Exit:** Return on first match  

Happy Coding! 🚀

