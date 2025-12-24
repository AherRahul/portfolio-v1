---
title: "Pair With Given Difference using Hashing"
description: "Find pairs with specific difference using hash sets. Learn to search for target differences efficiently, understand the difference pattern vs sum pattern, and master variation of the two-pointer technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Pair With Given Difference

## 2. Problem Statement

Given an **one-dimensional unsorted array A** containing **N integers** and an integer **B**, find if there exists a pair of elements in the array whose **difference is B**.

Return **1** if any such pair exists else return **0**.

**Input:**
- Array `A` of size N
- Integer `B` (target difference)

**Output:**
- 1 if pair exists, 0 otherwise

## 3. Examples

```
Input: A = [5, 10, 3, 2, 50, 80], B = 78
Output: 1
Explanation: 80 - 2 = 78

Input: A = [-10, 20], B = 30
Output: 1
Explanation: 20 - (-10) = 30

Input: A = [1, 2, 3], B = 10
Output: 0
Explanation: No pair with difference 10
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^6 ≤ A[i] ≤ 10^6`
- `-10^6 ≤ B ≤ 10^6`
- Handle negative numbers

## 5. Important Points

### Difference vs Sum

**For difference B:**
```
If A[j] - A[i] = B, then:
A[j] = A[i] + B (look for x + B)
OR
A[i] = A[j] - B (look for x - B)
```

**Example:**
```
Find difference 78
If element is 2:
  Need 2+78=80 OR 2-78=-76
```

### Two Targets
For each element x, check:
- x + B (larger element)
- x - B (smaller element)

## 6. Brute Force Approach

Check all pairs.

## 7. Brute Force Code

```javascript
function hasPairDifferenceBrute(A, B) {
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A.length; j++) {
            if (i !== j && Math.abs(A[i] - A[j]) === Math.abs(B)) {
                return 1;
            }
        }
    }
    return 0;
}
```

## 8. Dry Run

```
A = [5, 10, 3, 2, 50, 80], B = 78

Check pairs:
|5-10|=5, |5-3|=2, ..., |5-80|=75
...continue checking...
|2-80|=78 ✓ Found!
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
Target difference: 78
Array: [5, 10, 3, 2, 50, 80]

Check all pairs → Found: 80-2=78
```

## 11. Optimized Approach Description

Use hash set to check if (x+B) or (x-B) exists.

## 12. Optimized Approach Algorithm

```
1. Add all elements to set
2. For each element x:
   a. If (x+B) in set: return 1
   b. If (x-B) in set: return 1
3. Return 0
```

## 13. Optimized Code

```javascript
function hasPairDifference(A, B) {
    const set = new Set(A);
    
    for (const num of A) {
        if (set.has(num + B) || set.has(num - B)) {
            return 1;
        }
    }
    
    return 0;
}

// Test cases
console.log(hasPairDifference([5, 10, 3, 2, 50, 80], 78)); // 1
console.log(hasPairDifference([-10, 20], 30)); // 1
console.log(hasPairDifference([1, 2, 3], 10)); // 0
```

### Alternative: Check During Building

```javascript
function hasPairDifferenceAlt(A, B) {
    const seen = new Set();
    
    for (const num of A) {
        if (seen.has(num + B) || seen.has(num - B)) {
            return 1;
        }
        seen.add(num);
    }
    
    return 0;
}
```

## 14. Dry Run

```
A = [5, 10, 3, 2, 50, 80], B = 78
set = {5, 10, 3, 2, 50, 80}

Check 5: Need 83 or -73? No
Check 10: Need 88 or -68? No
Check 3: Need 81 or -75? No
Check 2: Need 80? Yes! ✓ Return 1
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
set = {5, 10, 3, 2, 50, 80}
B = 78

For element 2:
  Check 2+78=80 → Found in set! ✓
  
Result: 1
```

## 17. Edge Cases

```javascript
// Zero difference
hasPairDifference([5, 5], 0); // 1 (5-5=0)

// Negative difference
hasPairDifference([10, 20], -10); // 1 (10-20=-10)

// Single element
hasPairDifference([5], 1); // 0

// All same
hasPairDifference([3, 3, 3], 0); // 1
```

## 18. Key Takeaways

### a. Applications
- Distance calculations
- Gap analysis
- Threshold checking

### b. Interview Strategy
- Check both x+B and x-B
- Use hash set for O(N)
- Handle negative numbers

### c. Common Mistakes
- Only checking x+B
- Not handling negative B
- Using wrong data structure

### d. Related Problems
- Pair with Sum
- K-Diff Pairs
- Find Peak Element
- Two Sum Variants

### e. Performance
- Hash set optimal
- O(N) time solution
- Better than sorting O(N log N)

## Summary

✅ **Check Both Directions:** x+B and x-B  
✅ **Hash Set:** O(1) lookup  
✅ **Handle Negatives:** Important edge case  

Happy Coding! 🚀

