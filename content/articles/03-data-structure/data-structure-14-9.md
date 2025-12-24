---
title: "Longest Subarray with Zero Sum"
description: "Find the longest subarray with sum zero using prefix sum and hashing. Learn to track first occurrence of prefix sums, calculate maximum length efficiently, and master the longest subarray pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Longest Subarray with Zero Sum

## 2. Problem Statement

Given an array **A** of **N** integers, find the **length of the longest subarray** which sums to zero.

If there is no subarray which sums to zero, return **0**.

**Input:**
- Array `A` of size N

**Output:**
- Length of longest zero-sum subarray

## 3. Examples

### Example 1:
```
Input: A = [1, -1, 3, 2, -2, -8, 1, 7, 10, 23]
Output: 5
Explanation: Subarray [3, 2, -2, -8, 1] has sum 0 and length 5
```

### Example 2:
```
Input: A = [15, -2, 2, -8, 1, 7, 10, 23]
Output: 0
Explanation: No zero-sum subarray
```

### Example 3:
```
Input: A = [1, 2, -2, 1, -1]
Output: 4
Explanation: [2, -2, 1, -1] or [1, 2, -2, 1] both have length 4
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ A[i] ≤ 10^9`
- Find maximum length

## 5. Important Points

### Key Insight

Store **first occurrence** of each prefix sum.

When same prefix appears again:
- Length = current index - first occurrence

**Example:**
```
A = [1, -1, 3, -3]
Index:  0   1  2   3
Prefix: 1   0  3   0

Prefix 0 at indices 1 and 3
Length = 3 - 1 = 2
Subarray [3, -3]
```

## 6. Brute Force Approach

Check all subarrays, calculate sum, track max length.

## 7. Brute Force Code

```javascript
function longestZeroSumBrute(A) {
    let maxLen = 0;
    
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = i; j < A.length; j++) {
            sum += A[j];
            if (sum === 0) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }
    
    return maxLen;
}
```

## 8. Dry Run of Brute Force

```
A = [1, -1, 3, -3]

i=0: [1,-1]=0(len=2), [1,-1,3,-3]=0(len=4)
i=1: [-1,1]=0? No
i=2: [3,-3]=0(len=2)

Max length: 4
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
A = [1, -1, 3, -3]

Check subarrays:
[1,-1] = 0, len=2
[1,-1,3,-3] = 0, len=4 ← Maximum

Result: 4
```

## 11. Optimized Approach Description

**Use Prefix Sum + Hash Map:**

Store **first occurrence index** of each prefix sum.

When prefix repeats:
- Calculate length = current index - stored index

## 12. Optimized Approach Algorithm

```
1. Initialize: prefixSum=0, map={0: -1}, maxLen=0
2. For each index i:
   a. Add A[i] to prefixSum
   b. If prefixSum in map:
      len = i - map[prefixSum]
      maxLen = max(maxLen, len)
   c. Else: map[prefixSum] = i
3. Return maxLen
```

## 13. Optimized Code

```javascript
function longestZeroSumSubarray(A) {
    const map = new Map();
    let prefixSum = 0;
    let maxLen = 0;
    
    // Initialize for subarrays starting from index 0
    map.set(0, -1);
    
    for (let i = 0; i < A.length; i++) {
        prefixSum += A[i];
        
        if (map.has(prefixSum)) {
            // Found same prefix sum before
            const length = i - map.get(prefixSum);
            maxLen = Math.max(maxLen, length);
        } else {
            // Store first occurrence
            map.set(prefixSum, i);
        }
    }
    
    return maxLen;
}

// Test cases
console.log(longestZeroSumSubarray([1, -1, 3, 2, -2, -8, 1, 7, 10, 23])); // 5
console.log(longestZeroSumSubarray([15, -2, 2, -8, 1, 7, 10, 23])); // 0
console.log(longestZeroSumSubarray([1, 2, -2, 1, -1])); // 4
```

## 14. Dry Run of Optimized

```
A = [1, -1, 3, -3]

Initialize: prefixSum=0, map={0:-1}, maxLen=0

i=0, A[0]=1:
  prefixSum = 1
  Not in map → map = {0:-1, 1:0}

i=1, A[1]=-1:
  prefixSum = 0
  Found at index -1 → len = 1-(-1) = 2
  maxLen = 2
  
i=2, A[2]=3:
  prefixSum = 3
  Not in map → map = {0:-1, 1:0, 3:2}

i=3, A[3]=-3:
  prefixSum = 0
  Found at index -1 → len = 3-(-1) = 4
  maxLen = 4

Result: 4
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
A = [1, -1, 3, -3]
Index: 0   1  2   3
Prefix: 1  0  3   0
        ↑      ↑
        Same prefix!

Length = 3 - (-1) = 4
Subarray [1,-1,3,-3]
```

## 17. Edge Cases

```javascript
// No zero-sum
longestZeroSumSubarray([1, 2, 3]); // 0

// Entire array
longestZeroSumSubarray([1, -1]); // 2

// Single zero
longestZeroSumSubarray([0]); // 1

// Multiple zeros
longestZeroSumSubarray([0, 0, 0]); // 3
```

## 18. Key Takeaways

### a. Applications
- Maximum balance period
- Longest neutral zone
- Time series analysis

### b. Interview Strategy
- Store FIRST occurrence only
- Calculate length when prefix repeats
- Initialize map with {0: -1}

### c. Common Mistakes
- Not storing first occurrence
- Wrong length calculation
- Missing initial {0: -1}

### d. Related Problems
- Max Length Subarray Sum K
- Longest Subarray with Equal 0s and 1s
- Contiguous Array

### e. Performance
- O(N) time optimal
- Cannot do better
- Hash map essential

## Summary

✅ **First Occurrence:** Store index, not count  
✅ **Length Calculation:** current - first  
✅ **O(N) Solution:** Single pass  

Happy Coding! 🚀

