---
title: "Count Pair Difference using Hashing"
description: "Count pairs with given difference using hash maps. Learn frequency-based pair counting for differences, handle edge cases with modulo, and master the difference counting pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Count Pair Difference

## 2. Problem Statement

You are given an array **A** of **N** integers and an integer **B**. Count the number of pairs **(i, j)** such that **A[i] - A[j] = B** and **i ≠ j**.

Return the remainder after dividing the count with **10^9 + 7**.

**Input:**
- Array `A` of size N
- Integer `B` (target difference)

**Output:**
- Count of pairs (mod 10^9+7)

## 3. Examples

```
Input: A = [1, 5, 3, 4, 2], B = 3
Output: 2
Explanation: (5,2) and (4,1) have difference 3

Input: A = [1, 2, 1, 2], B = 1
Output: 4
Explanation: (2,1) pairs: indices (1,0), (1,2), (3,0), (3,2)

Input: A = [1, 1, 1], B = 0
Output: 3
Explanation: C(3,2) = 3 pairs of same elements
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^6 ≤ A[i] ≤ 10^6`
- `-10^6 ≤ B ≤ 10^6`

## 5. Important Points

**Difference Formula:**
```
A[i] - A[j] = B means:
A[i] = A[j] + B
```

**Counting Strategy:**
- If B = 0: Count pairs of same elements
- If B ≠ 0: Count freq[x] * freq[x+B]

## 6. Brute Force Approach

```javascript
function countPairDiffBrute(A, B) {
    const MOD = 1000000007;
    let count = 0;
    
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A.length; j++) {
            if (i !== j && A[i] - A[j] === B) {
                count = (count + 1) % MOD;
            }
        }
    }
    
    return count;
}
```

## 7. Brute Force Code

See above.

## 8. Dry Run

```
A = [1, 5, 3, 4, 2], B = 3
Check all pairs where A[i] - A[j] = 3:
5-2=3 ✓, 4-1=3 ✓
Count: 2
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
Target difference: 3
Array: [1, 5, 3, 4, 2]

5-2=3 ✓
4-1=3 ✓

Count: 2
```

## 11. Optimized Approach Description

Use frequency map to count occurrences.

## 12. Optimized Approach Algorithm

```
1. Build frequency map
2. If B = 0: 
     For each freq: count += freq*(freq-1)
3. Else:
     For each x: count += freq[x] * freq[x+B]
4. Return count % MOD
```

## 13. Optimized Code

```javascript
function countPairDifference(A, B) {
    const MOD = 1000000007;
    const freq = new Map();
    
    for (const num of A) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    let count = 0;
    
    if (B === 0) {
        for (const f of freq.values()) {
            count = (count + f * (f - 1)) % MOD;
        }
    } else {
        for (const [num, f] of freq) {
            if (freq.has(num + B)) {
                count = (count + f * freq.get(num + B)) % MOD;
            }
        }
    }
    
    return count;
}

console.log(countPairDifference([1, 5, 3, 4, 2], 3)); // 2
console.log(countPairDifference([1, 2, 1, 2], 1)); // 4
console.log(countPairDifference([1, 1, 1], 0)); // 3
```

## 14. Dry Run

```
A = [1, 5, 3, 4, 2], B = 3
freq = {1:1, 5:1, 3:1, 4:1, 2:1}

For 1: Check 1+3=4 → freq[4]=1 → count += 1*1 = 1
For 2: Check 2+3=5 → freq[5]=1 → count += 1*1 = 2

Result: 2
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
freq map: {1:1, 2:1, 3:1, 4:1, 5:1}
B = 3

1 + 3 = 4 → 1*1 = 1
2 + 3 = 5 → 1*1 = 1

Total: 2
```

## 17. Edge Cases

```javascript
// Zero difference
countPairDifference([1, 1, 1], 0); // 3

// No pairs
countPairDifference([1, 2, 3], 10); // 0

// Negative difference
countPairDifference([5, 2], -3); // 1 (2-5=-3)
```

## 18. Key Takeaways

### a. Applications
- Gap analysis
- Distance calculations

### b. Interview Strategy
- Handle B=0 separately
- Use frequency map
- Check num+B exists

### c. Common Mistakes
- Not handling B=0
- Wrong direction of difference

### d. Related Problems
- Pair with Sum
- K-Diff Pairs
- Count Pairs

### e. Performance
- O(N) optimal solution
- Hash map essential

## Summary

✅ **Frequency Map:** Count occurrences  
✅ **Special Case:** B=0 needs different formula  
✅ **O(N) Solution:** Optimal approach  

Happy Coding! 🚀

