---
title: "Count Unique Elements with Frequency 1"
description: "Count elements with frequency 1 using hash maps. Learn to filter unique occurrences, understand frequency-based counting, and master techniques for identifying singleton elements efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Count Unique Elements with Frequency 1

## 2. Problem Statement

You are given an array **A** of **N** integers. Return the **count of elements with frequency 1** in the given array.

**Input:**
- Array `A` of size N (1 ≤ N ≤ 10^5)

**Output:**
- Count of elements that appear exactly once

## 3. Examples

### Example 1:
```
Input: A = [1, 2, 2, 3, 3, 3, 4]
Output: 2
Explanation: Elements 1 and 4 appear exactly once
```

### Example 2:
```
Input: A = [5, 5, 5, 5]
Output: 0
Explanation: No element appears exactly once
```

### Example 3:
```
Input: A = [1, 2, 3, 4, 5]
Output: 5
Explanation: All elements appear exactly once
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ A[i] ≤ 10^9`
- Must handle large numbers
- Count only elements with frequency exactly 1

## 5. Important Points

### Difference: Unique vs Distinct
- **Distinct:** Different values (no duplicates)
- **Unique (frequency 1):** Appears exactly once

**Example:**
```
A = [1, 2, 2, 3]
Distinct elements: 3 (values: 1, 2, 3)
Unique elements: 2 (values: 1, 3 with freq=1)
```

### Solution Pattern
1. Build frequency map
2. Count elements where frequency == 1

## 6. Brute Force Approach

For each element, count its occurrences in the array.

## 7. Brute Force Code

```javascript
function countUniqueBrute(A) {
    let count = 0;
    
    for (let i = 0; i < A.length; i++) {
        let freq = 0;
        for (let j = 0; j < A.length; j++) {
            if (A[i] === A[j]) {
                freq++;
            }
        }
        
        // If frequency is 1 and not counted before
        if (freq === 1) {
            count++;
        }
    }
    
    return count;
}
```

**Problem:** Counts same element multiple times!

## 8. Dry Run of Brute Force

```
A = [1, 2, 2, 3]

Check each element's frequency:
1: appears 1 time → count++
2: appears 2 times → skip
2: appears 2 times → skip (but might count again!)
3: appears 1 time → count++

Result: 2 (but implementation flawed)
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
A = [1, 2, 2, 3, 3, 3, 4]

Count occurrences:
1: | → freq=1 ✓
2: || → freq=2 ✗
3: ||| → freq=3 ✗
4: | → freq=1 ✓

Unique count: 2
```

## 11. Optimized Approach Description

**Use Hash Map:**
1. Count frequency of each element
2. Count how many elements have frequency == 1

## 12. Optimized Approach Algorithm

```
1. Build frequency map
2. Count elements where freq[element] == 1
3. Return count
```

## 13. Optimized Code

```javascript
function countUniqueElements(A) {
    const freq = new Map();
    
    // Build frequency map
    for (const num of A) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    // Count elements with frequency 1
    let count = 0;
    for (const [num, frequency] of freq) {
        if (frequency === 1) {
            count++;
        }
    }
    
    return count;
}

// Test cases
console.log(countUniqueElements([1, 2, 2, 3, 3, 3, 4])); // 2
console.log(countUniqueElements([5, 5, 5, 5])); // 0
console.log(countUniqueElements([1, 2, 3, 4, 5])); // 5
```

### One-liner Version

```javascript
function countUniqueOneLine(A) {
    const freq = new Map();
    A.forEach(x => freq.set(x, (freq.get(x) || 0) + 1));
    return [...freq.values()].filter(f => f === 1).length;
}
```

## 14. Dry Run of Optimized

```
A = [1, 2, 2, 3, 3, 3, 4]

Step 1: Build frequency map
freq = {
  1: 1,
  2: 2,
  3: 3,
  4: 1
}

Step 2: Count frequency==1
Check 1: freq=1 → count=1
Check 2: freq=2 → skip
Check 3: freq=3 → skip
Check 4: freq=1 → count=2

Result: 2
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
Frequency Map:
┌───┬────┐
│ 1 │ 1 │ ✓
│ 2 │ 2 │
│ 3 │ 3 │
│ 4 │ 1 │ ✓
└───┴────┘

Count where freq=1: 2
```

## 17. Edge Cases

```javascript
// All unique
countUniqueElements([1, 2, 3]); // 3

// No unique
countUniqueElements([1, 1, 2, 2]); // 0

// Single element
countUniqueElements([5]); // 1

// All same
countUniqueElements([7, 7, 7]); // 0
```

## 18. Key Takeaways

### a. Applications
- Data analysis
- Anomaly detection
- Singleton pattern
- Unique record counting

### b. Interview Strategy
- Clarify "unique" means frequency 1
- Use hash map for O(N)
- Count frequency==1 elements

### c. Common Mistakes
- Confusing unique with distinct
- Not building frequency map first
- Counting duplicates multiple times

### d. Related Problems
- First Unique Character
- Single Number
- Find All Unique Elements
- Frequency Analysis

### e. Performance
- Hash map is optimal
- Two-pass solution
- Cannot do better than O(N)

## Summary

✅ **Frequency 1:** Elements appearing exactly once  
✅ **Hash Map:** Two-pass solution  
✅ **O(N) Time:** Optimal approach  

Happy Coding! 🚀

