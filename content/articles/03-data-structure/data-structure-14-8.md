---
title: "Count Subarray with Zero Sum using Hashing"
description: "Count all subarrays with sum zero using prefix sum hashing. Learn to use hash maps to track prefix sum frequencies, optimize counting from O(N²) to O(N), and master the advanced subarray counting pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Count Subarrays with Zero Sum

## 2. Problem Statement

Given an array **A** of **N** integers, find the **count of subarrays** which sum to zero.

Return the remainder after dividing the result with **10^9 + 7**.

**Input:**
- Array `A` of size N

**Output:**
- Count of zero-sum subarrays (mod 10^9+7)

## 3. Examples

### Example 1:
```
Input: A = [1, -1, 1, -1]
Output: 4
Explanation: Subarrays with sum 0:
[1,-1], [-1,1], [1,-1,1,-1], [1,-1]
```

### Example 2:
```
Input: A = [0, 0, 0]
Output: 6
Explanation: All subarrays have sum 0
```

### Example 3:
```
Input: A = [1, 2, 3]
Output: 0
Explanation: No zero-sum subarray
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ A[i] ≤ 10^9`
- Return answer modulo 10^9+7

## 5. Important Points

### Prefix Sum Formula

If `prefixSum[i] == prefixSum[j]` (where i < j):  
Subarray [i+1...j] has sum 0

**Counting Logic:**
If prefix sum X appears **k** times:
- Number of zero-sum subarrays = **C(k, 2) = k*(k-1)/2**

**Example:**
```
A = [1, -1, 2, -2]
Prefix: [1, 0, 2, 0]

Prefix 0 appears 2 times (indices 1, 3)
Count = C(2,2) = 1 subarray
```

### Formula for Counting
```
For each prefix sum with frequency f:
  count += f * (f - 1) / 2
  
Also add: frequency of prefix sum 0
(subarrays from start)
```

## 6. Brute Force Approach

Check all subarrays and count those with sum 0.

## 7. Brute Force Code

```javascript
function countZeroSumBrute(A) {
    const MOD = 1000000007;
    let count = 0;
    
    for (let i = 0; i < A.length; i++) {
        let sum = 0;
        for (let j = i; j < A.length; j++) {
            sum += A[j];
            if (sum === 0) {
                count = (count + 1) % MOD;
            }
        }
    }
    
    return count;
}
```

## 8. Dry Run of Brute Force

```
A = [1, -1, 1, -1]

i=0: [1]=1, [1,-1]=0✓, [1,-1,1]=1, [1,-1,1,-1]=0✓
i=1: [-1]=-1, [-1,1]=0✓, [-1,1,-1]=-1
i=2: [1]=1, [1,-1]=0✓
i=3: [-1]=-1

Count = 4
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
A = [1, -1, 1, -1]

All subarrays:
[1,-1] = 0 ✓
[-1,1] = 0 ✓
[1,-1,1,-1] = 0 ✓
[1,-1] (indices 2,3) = 0 ✓

Count: 4
```

## 11. Optimized Approach Description

**Use Prefix Sum + Hash Map:**

1. Track frequency of each prefix sum
2. For each prefix sum frequency f:
   - Add C(f, 2) = f*(f-1)/2 pairs
3. Also count subarrays starting from index 0

## 12. Optimized Approach Algorithm

```
1. Initialize prefixSum = 0, freq map
2. Add freq[0] = 1 (for subarrays from start)
3. For each element:
   a. Add to prefixSum
   b. count += freq[prefixSum]
   c. Increment freq[prefixSum]
4. Return count
```

## 13. Optimized Code

```javascript
function countZeroSumSubarrays(A) {
    const MOD = 1000000007;
    const freq = new Map();
    let prefixSum = 0;
    let count = 0;
    
    // Initialize for subarrays starting from index 0
    freq.set(0, 1);
    
    for (const num of A) {
        prefixSum += num;
        
        // If this prefix sum seen before,
        // all previous occurrences form zero-sum subarrays
        if (freq.has(prefixSum)) {
            count = (count + freq.get(prefixSum)) % MOD;
        }
        
        // Update frequency
        freq.set(prefixSum, (freq.get(prefixSum) || 0) + 1);
    }
    
    return count;
}

// Test cases
console.log(countZeroSumSubarrays([1, -1, 1, -1])); // 4
console.log(countZeroSumSubarrays([0, 0, 0])); // 6
console.log(countZeroSumSubarrays([1, 2, 3])); // 0
```

## 14. Dry Run of Optimized

```
A = [1, -1, 1, -1]

Initialize: prefixSum=0, freq={0:1}, count=0

i=0, A[0]=1:
  prefixSum = 1
  freq[1] not present → count=0
  freq = {0:1, 1:1}

i=1, A[1]=-1:
  prefixSum = 0
  freq[0] = 1 → count += 1 = 1
  freq = {0:2, 1:1}

i=2, A[2]=1:
  prefixSum = 1
  freq[1] = 1 → count += 1 = 2
  freq = {0:2, 1:2}

i=3, A[3]=-1:
  prefixSum = 0
  freq[0] = 2 → count += 2 = 4
  freq = {0:3, 1:2}

Result: 4
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
A = [1, -1, 1, -1]
Prefix: [1, 0, 1, 0]

Prefix sum frequency:
0 appears at indices: -1(initial), 1, 3
1 appears at indices: 0, 2

Count pairs:
- Prefix 0: (initial,1), (initial,3), (1,3) = 3
- Prefix 1: (0,2) = 1
Total: 4
```

## 17. Edge Cases

```javascript
// All zeros
countZeroSumSubarrays([0, 0, 0]); // 6

// No zero-sum
countZeroSumSubarrays([1, 2, 3]); // 0

// Single element
countZeroSumSubarrays([0]); // 1

// Alternating
countZeroSumSubarrays([1, -1, 1, -1]); // 4
```

## 18. Key Takeaways

### a. Applications
- Signal processing
- Financial data analysis
- Balance point detection
- Statistical analysis

### b. Interview Strategy
- Explain prefix sum concept
- Show frequency counting
- Use combination formula
- Handle mod operations

### c. Common Mistakes
- Not initializing freq[0] = 1
- Wrong combination formula
- Forgetting modulo

### d. Related Problems
- Subarray Sum Equals K
- Longest Zero-Sum Subarray
- Max Length Zero-Sum
- Continuous Subarray Sum

### e. Performance
- O(N) time optimal
- Hash map essential
- Classic prefix sum pattern

## Summary

✅ **Prefix Sum + Frequency:** Powerful combination  
✅ **Count Pairs:** Use combination formula  
✅ **O(N) Solution:** Single pass with hash map  

Happy Coding! 🚀

