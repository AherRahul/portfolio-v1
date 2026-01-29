---
title: "Check Pair Sum using Hashing"
description: "Find if two elements sum to a target using hash sets. Learn the two-sum pattern with O(N) time complexity, understand complement searching, and master one of the most common interview patterns."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Check Pair Sum using Hashing

## 2. Problem Statement

Given an **array of integers B** and a **target sum A**, check if there exists a pair (i, j) such that **B[i] + B[j] = A** and **i ≠ j**.

**Input:**
- Integer `A` (target sum)
- Array `B` of integers

**Output:**
- Return 1 if such pair exists, else 0

## 3. Examples

```
Input: A = 9, B = [2, 4, 3, 5, 7]
Output: 1
Explanation: 2 + 7 = 9

Input: A = 10, B = [1, 2, 3, 4]
Output: 0
Explanation: No pair sums to 10

Input: A = 6, B = [3, 3]
Output: 1
Explanation: 3 + 3 = 6
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ B[i] ≤ 10^9`
- Different indices (i ≠ j)

## 5. Important Points

**Two-Sum Pattern:**
For each element x, check if (A - x) exists.

**Example:**
```
Target = 9, Array = [2, 4, 7]
Check 2: Need 7? → Found at end!
```

## 6. Brute Force Approach

Check all pairs.

## 7. Brute Force Code

```javascript
function hasPairSumBrute(A, B) {
    for (let i = 0; i < B.length; i++) {
        for (let j = i + 1; j < B.length; j++) {
            if (B[i] + B[j] === A) {
                return 1;
            }
        }
    }
    return 0;
}
```

## 8. Dry Run of Brute Force

```
A = 9, B = [2, 4, 3, 5, 7]
Check (2,4)=6, (2,3)=5, (2,5)=7, (2,7)=9 ✓
Found!
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
Target = 9
Array: [2, 4, 3, 5, 7]

Check all pairs → Found: 2+7=9
```

## 11. Optimized Approach Description

Use hash set to check complements in O(1).

## 12. Optimized Approach Algorithm

```
1. Create empty set
2. For each element x:
   a. If (A - x) in set: return 1
   b. Add x to set
3. Return 0
```

## 13. Optimized Code

```javascript
function hasPairSum(A, B) {
    const seen = new Set();
    
    for (const num of B) {
        const complement = A - num;
        if (seen.has(complement)) {
            return 1;
        }
        seen.add(num);
    }
    
    return 0;
}

// Test cases
console.log(hasPairSum(9, [2, 4, 3, 5, 7])); // 1
console.log(hasPairSum(10, [1, 2, 3, 4])); // 0
console.log(hasPairSum(6, [3, 3])); // 1
```

## 14. Dry Run of Optimized

```
A = 9, B = [2, 4, 3, 5, 7]

Check 2: Need 7? No → Add 2, seen={2}
Check 4: Need 5? No → Add 4, seen={2,4}
Check 3: Need 6? No → Add 3, seen={2,4,3}
Check 5: Need 4? Yes! → Return 1
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
Target = 9, Array = [2, 4, 3, 5, 7]

2 → Need 7? → Not yet → Add 2
4 → Need 5? → Not yet → Add 4  
3 → Need 6? → Not yet → Add 3
5 → Need 4? → Found 4! ✓
```

## 17. Edge Cases

```javascript
// Same element twice
hasPairSum(6, [3, 3]); // 1

// Single element
hasPairSum(5, [5]); // 0

// No pair
hasPairSum(100, [1, 2, 3]); // 0

// Negative numbers
hasPairSum(0, [-1, 1]); // 1
```

## 18. Key Takeaways

### a. Applications
- Two-sum problem
- Payment matching
- Resource allocation

### b. Interview Strategy
- Explain complement logic
- Use hash set for O(N)
- Handle edge cases

### c. Common Mistakes
- Not checking before adding
- Using same element twice
- Wrong complement calculation

### d. Related Problems
- Three Sum
- Four Sum
- Two Sum II (sorted)
- Pair with Difference

### e. Performance
- O(N) optimal
- Most common interview pattern
- Essential technique

## Summary

✅ **Complement Search:** Check (target - current)  
✅ **Hash Set:** O(1) lookup  
✅ **Classic Pattern:** Foundation for many problems  

Happy Coding! 🚀

