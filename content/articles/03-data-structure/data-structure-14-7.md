---
title: "K Occurrences Problem using Hashing"
description: "Find and sum heights with exactly B occurrences. Learn to filter by frequency, apply modulo operations, and master the technique of aggregating values based on occurrence count."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## K Occurrences Problem

## 2. Problem Statement

Groot has **N trees** lined up where the height of the i-th tree is **H[i]**. He wants uniformity and picks only those trees whose heights have frequency **B**.

He sums up the heights that occur **B times** (adds the height only once, not B times).

The sum is printed modulo **10^9 + 7**. If no such cluster exists, print **-1**.

**Input:**
- Array `H` of N tree heights
- Integer `B` (target frequency)

**Output:**
- Sum of heights with frequency B (mod 10^9+7), or -1

## 3. Examples

### Example 1:
```
Input: H = [5, 3, 5, 4, 3, 4, 5], B = 2
Output: 7
Explanation: 
- 5 appears 3 times (skip)
- 3 appears 2 times (add 3)
- 4 appears 2 times (add 4)
Sum = 3 + 4 = 7
```

### Example 2:
```
Input: H = [1, 1, 1, 1], B = 4
Output: 1
Explanation: 1 appears 4 times, sum = 1
```

### Example 3:
```
Input: H = [1, 2, 3], B = 2
Output: -1
Explanation: No height appears exactly 2 times
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `1 ≤ H[i] ≤ 10^9`
- `1 ≤ B ≤ N`
- Return result modulo 10^9+7

## 5. Important Points

### Key Understanding
- Find heights with **exactly** B occurrences
- Add each unique height **once** (not B times)
- Apply modulo to prevent overflow

**Example:**
```
H = [5, 5, 3, 3, 3], B = 2
5 appears 2 times → Add 5 once
3 appears 3 times → Skip
Sum = 5
```

## 6. Brute Force Approach

Count frequency for each unique height, then sum those with frequency B.

## 7. Brute Force Code

```javascript
function sumKOccurrencesBrute(H, B) {
    const MOD = 1000000007;
    const seen = new Set();
    let sum = 0;
    
    for (let i = 0; i < H.length; i++) {
        if (seen.has(H[i])) continue;
        
        let count = 0;
        for (let j = 0; j < H.length; j++) {
            if (H[i] === H[j]) count++;
        }
        
        if (count === B) {
            sum = (sum + H[i]) % MOD;
        }
        seen.add(H[i]);
    }
    
    return sum === 0 ? -1 : sum;
}
```

## 8. Dry Run of Brute Force

```
H = [5, 3, 5, 4, 3, 4, 5], B = 2

Check 5: count=3, B=2 → Skip
Check 3: count=2, B=2 → sum=3
Check 4: count=2, B=2 → sum=3+4=7

Result: 7
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(N) for set

## 10. Visualization

```
H = [5, 3, 5, 4, 3, 4, 5], B = 2

Frequencies:
5 → |||  (3) ✗
3 → ||   (2) ✓ Add 3
4 → ||   (2) ✓ Add 4

Sum = 3 + 4 = 7
```

## 11. Optimized Approach Description

**Hash Map for O(N) solution:**
1. Count all frequencies
2. Sum heights where frequency == B
3. Apply modulo

## 12. Optimized Approach Algorithm

```
1. Build frequency map
2. Initialize sum = 0
3. For each (height, freq) in map:
   If freq == B:
      sum = (sum + height) % MOD
4. Return sum if sum > 0, else -1
```

## 13. Optimized Code

```javascript
function sumKOccurrences(H, B) {
    const MOD = 1000000007;
    const freq = new Map();
    
    // Build frequency map
    for (const height of H) {
        freq.set(height, (freq.get(height) || 0) + 1);
    }
    
    // Sum heights with frequency B
    let sum = 0;
    for (const [height, count] of freq) {
        if (count === B) {
            sum = (sum + height) % MOD;
        }
    }
    
    return sum === 0 ? -1 : sum;
}

// Test cases
console.log(sumKOccurrences([5, 3, 5, 4, 3, 4, 5], 2)); // 7
console.log(sumKOccurrences([1, 1, 1, 1], 4)); // 1
console.log(sumKOccurrences([1, 2, 3], 2)); // -1
```

## 14. Dry Run of Optimized

```
H = [5, 3, 5, 4, 3, 4, 5], B = 2

Step 1: Build frequency map
freq = {5: 3, 3: 2, 4: 2}

Step 2: Sum where freq == B
Check 5: freq=3 ≠ 2 → Skip
Check 3: freq=2 == 2 → sum=3
Check 4: freq=2 == 2 → sum=7

Result: 7
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(K) where K = unique elements

## 16. Visualization

```
Frequency Map:
┌────┬────┐
│ 5  │ 3  │ ✗
│ 3  │ 2  │ ✓ +3
│ 4  │ 2  │ ✓ +4
└────┴────┘

Sum = 3 + 4 = 7
```

## 17. Edge Cases

```javascript
// All same frequency
sumKOccurrences([1, 2, 3], 1); // 1+2+3 = 6

// No match
sumKOccurrences([1, 2, 3], 2); // -1

// Large numbers
sumKOccurrences([1000000000, 1000000000], 2); // 1000000000

// Single element
sumKOccurrences([5], 1); // 5
```

## 18. Key Takeaways

### a. Applications
- Frequency-based filtering
- Data clustering
- Uniformity checking
- Statistical analysis

### b. Interview Strategy
- Build frequency map first
- Filter by target frequency
- Handle modulo for large sums
- Return -1 for no matches

### c. Common Mistakes
- Adding height B times instead of once
- Forgetting modulo operation
- Not handling -1 case

### d. Related Problems
- Top K Frequent Elements
- Group by Frequency
- Frequency Sort
- Count Elements with Frequency K

### e. Performance
- Hash map: O(N) optimal
- Modulo prevents overflow
- Single pass after frequency counting

## Summary

✅ **Frequency Filtering:** Find heights with exact count  
✅ **Sum Once:** Add each height only once  
✅ **Modulo:** Prevent overflow with large sums  

Happy Coding! 🚀

