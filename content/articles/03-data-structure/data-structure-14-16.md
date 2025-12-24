---
title: "Subarray Sum Equals K using Hashing"
description: "Count subarrays with sum K using prefix sum frequency map. Master the prefix sum counting pattern with negative numbers and learn frequency-based subarray counting."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Subarray Sum Equals K

## 2. Problem Statement

Given an array of integers **A** and an integer **K**, find the **total number of continuous subarrays** whose sum equals **K**.

**Input:**
- Array `A` of size N
- Integer `K` (target sum)

**Output:**
- Count of subarrays

## 3. Examples

```
Input: A = [1, 1, 1], K = 2
Output: 2
Explanation: [1,1] at indices (0,1) and (1,2)

Input: A = [1, 2, 3], K = 3
Output: 2
Explanation: [1,2] and [3]

Input: A = [1, -1, 1, -1], K = 0
Output: 4
Explanation: [1,-1], [-1,1], [1,-1,1,-1], [-1,1]
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ A[i] ≤ 10^9`
- `-10^9 ≤ K ≤ 10^9`

## 5. Important Points

**Key Insight:**
```
If prefix[j] - prefix[i] = K
Then we need: prefix[i] = prefix[j] - K
```

**Strategy:**
- Track frequency of prefix sums
- For each prefix, add count of (currentSum - K)
- Handle negative numbers correctly

## 6. Brute Force Approach

Check all subarrays and count those with sum K.

## 7. Brute Force Code

```javascript
function subarraySumBrute(A, K) {
    let count = 0;
    
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = i; j < A.length; j++) {
            sum += A[j];
            if (sum === K) {
                count++;
            }
        }
    }
    
    return count;
}
```

## 8. Dry Run

```
A = [1, 1, 1], K = 2

i=0: 1, 2✓, 3
i=1: 1, 2✓
i=2: 1

Count: 2
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
Array: [1, 1, 1]
Target: 2

Subarray [1,1] at (0,1): 1+1=2 ✓
Subarray [1,1] at (1,2): 1+1=2 ✓

Total: 2
```

## 11. Optimized Approach Description

Use prefix sum with frequency map. Store how many times each prefix sum occurs. For each element, check how many times (currentSum - K) has occurred before.

## 12. Optimized Approach Algorithm

```
1. Initialize prefixFreq map with {0: 1}
2. Initialize currentSum = 0, count = 0
3. For each element:
   - Add to currentSum
   - Add frequency of (currentSum - K) to count
   - Increment frequency of currentSum
4. Return count
```

## 13. Optimized Code

```javascript
function subarraySum(A, K) {
    const prefixFreq = new Map([[0, 1]]);
    let currentSum = 0;
    let count = 0;
    
    for (const num of A) {
        currentSum += num;
        
        // Check if (currentSum - K) exists
        if (prefixFreq.has(currentSum - K)) {
            count += prefixFreq.get(currentSum - K);
        }
        
        // Update frequency of currentSum
        prefixFreq.set(currentSum, (prefixFreq.get(currentSum) || 0) + 1);
    }
    
    return count;
}

// Test cases
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, 2, 3], 3)); // 2
console.log(subarraySum([1, -1, 1, -1], 0)); // 4
console.log(subarraySum([1, 2, 3, 4, 5], 9)); // 2
```

## 14. Dry Run

```
A = [1, 1, 1], K = 2
prefixFreq = {0: 1}
currentSum = 0, count = 0

i=0, num=1:
  currentSum = 1
  Check: 1-2=-1 → not in map
  prefixFreq = {0:1, 1:1}

i=1, num=1:
  currentSum = 2
  Check: 2-2=0 → found 1 time
  count = 1
  prefixFreq = {0:1, 1:1, 2:1}

i=2, num=1:
  currentSum = 3
  Check: 3-2=1 → found 1 time
  count = 2
  prefixFreq = {0:1, 1:1, 2:1, 3:1}

Result: 2
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
Array:  [1,  1,  1]
Index:   0   1   2
Prefix: [1,  2,  3]
K = 2

At index 1:
  prefix[1] = 2
  Looking for: 2-2 = 0
  Found 1 time (initial state)
  Subarray: [0,1] = [1,1] ✓

At index 2:
  prefix[2] = 3
  Looking for: 3-2 = 1
  Found 1 time (at index 0)
  Subarray: [1,2] = [1,1] ✓

Total: 2
```

## 17. Edge Cases

```javascript
// Negative numbers
subarraySum([1, -1, 1, -1], 0); // 4

// Single element
subarraySum([5], 5); // 1

// All zeros
subarraySum([0, 0, 0], 0); // 6 (C(3,1) + C(3,2) + C(3,3))

// No solution
subarraySum([1, 2, 3], 10); // 0

// Multiple occurrences
subarraySum([1, 2, 1, 2, 1], 3); // 4
```

## 18. Key Takeaways

### a. Applications
- Pattern finding
- Signal processing
- Financial analysis

### b. Interview Strategy
- Initialize map with {0: 1}
- Use frequency, not just existence
- Handle negative numbers

### c. Common Mistakes
- Not initializing map with 0
- Using set instead of map
- Wrong order of operations

### d. Related Problems
- Subarray with 0 Sum
- Continuous Subarray Sum
- Make Sum Divisible by P

### e. Performance
- O(N) optimal solution
- Frequency map crucial

## Summary

✅ **Prefix Frequency:** Count occurrences of sums  
✅ **Initialize {0:1}:** Handle entire array case  
✅ **Add Before Update:** Avoid counting same element  

Happy Coding! 🚀

