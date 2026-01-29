---
title: "Check Array with Consecutive Elements"
description: "Verify if array elements are consecutive integers. Learn range-based validation, handle duplicates, and master the consecutive sequence detection pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Array with Consecutive Elements

## 2. Problem Statement

Given an array of distinct integers, determine if the array elements are **consecutive integers** (can be arranged to form consecutive numbers).

Return **1** if consecutive, **0** otherwise.

**Input:**
- Array `A` of N distinct integers

**Output:**
- 1 if consecutive, 0 otherwise

## 3. Examples

```
Input: [5, 2, 3, 1, 4]
Output: 1
Explanation: Can be arranged as [1, 2, 3, 4, 5]

Input: [83, 78, 80, 81, 79, 82]
Output: 1
Explanation: [78, 79, 80, 81, 82, 83]

Input: [1, 3, 5]
Output: 0
Explanation: Missing 2 and 4
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ A[i] ≤ 10^9`
- All elements are distinct

## 5. Important Points

**Consecutive Property:**
```
If array has consecutive integers:
max - min = N - 1
```

**Validation Steps:**
1. Find min and max
2. Check if max - min = N - 1
3. Verify no duplicates (given)

## 6. Brute Force Approach

Sort the array and check if each element is previous + 1.

## 7. Brute Force Code

```javascript
function areConsecutiveBrute(A) {
    if (A.length === 0) return 0;
    
    A.sort((a, b) => a - b);
    
    for (let i = 1; i < A.length; i++) {
        if (A[i] !== A[i-1] + 1) {
            return 0;
        }
    }
    
    return 1;
}
```

## 8. Dry Run

```
A = [5, 2, 3, 1, 4]

After sort: [1, 2, 3, 4, 5]

Check:
2 = 1+1 ✓
3 = 2+1 ✓
4 = 3+1 ✓
5 = 4+1 ✓

Result: 1
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N log N) - sorting  
**Space:** O(1) or O(N) depending on sort

## 10. Visualization

```
Array: [5, 2, 3, 1, 4]

After sorting: [1, 2, 3, 4, 5]
                ↓  ↓  ↓  ↓  ↓
Differences:     1  1  1  1 ✓

All differences are 1 → Consecutive
```

## 11. Optimized Approach Description

Use the mathematical property: for consecutive integers from min to max, `max - min = N - 1`.

Find min and max in single pass, then verify this property.

## 12. Optimized Approach Algorithm

```
1. Find min and max in array
2. Check if max - min = N - 1
3. Return 1 if true, 0 otherwise
```

## 13. Optimized Code

```javascript
function areConsecutive(A) {
    if (A.length === 0) return 0;
    
    let min = A[0];
    let max = A[0];
    
    // Find min and max
    for (const num of A) {
        min = Math.min(min, num);
        max = Math.max(max, num);
    }
    
    // Check consecutive property
    return (max - min === A.length - 1) ? 1 : 0;
}

// Test cases
console.log(areConsecutive([5, 2, 3, 1, 4])); // 1
console.log(areConsecutive([83, 78, 80, 81, 79, 82])); // 1
console.log(areConsecutive([1, 3, 5])); // 0
console.log(areConsecutive([10])); // 1
console.log(areConsecutive([7, 8, 9, 10, 11])); // 1
```

## 14. Dry Run

```
A = [5, 2, 3, 1, 4]
N = 5

Find min and max:
min = 1
max = 5

Check property:
max - min = 5 - 1 = 4
N - 1 = 5 - 1 = 4
4 === 4 ✓

Result: 1
```

## 15. Time and Space Complexity

**Time:** O(N) - single pass  
**Space:** O(1)

## 16. Visualization

```
Array: [83, 78, 80, 81, 79, 82]
N = 6

min = 78, max = 83
Range: [78 ... 83] = 6 numbers

max - min = 83 - 78 = 5
N - 1 = 6 - 1 = 5
5 === 5 ✓ Consecutive!

Visual:
78 79 80 81 82 83
└──────────────┘
   6 elements
```

## 17. Edge Cases

```javascript
// Single element
areConsecutive([5]); // 1 (always consecutive)

// Two consecutive
areConsecutive([10, 11]); // 1

// Two non-consecutive
areConsecutive([1, 3]); // 0

// Negative numbers
areConsecutive([-2, -1, 0, 1]); // 1

// Large range, missing element
areConsecutive([1, 3, 4, 5, 6]); // 0 (missing 2)

// Reverse order but consecutive
areConsecutive([5, 4, 3, 2, 1]); // 1
```

## 18. Key Takeaways

### a. Applications
- Data validation
- Sequence verification
- Gap detection
- Range validation

### b. Interview Strategy
- Use mathematical property
- Explain min-max relationship
- Mention O(N) optimization
- Handle edge cases

### c. Common Mistakes
- Not considering unsorted input
- Forgetting single element case
- Wrong formula (max - min + 1)
- Not handling negatives

### d. Related Problems
- Longest Consecutive Sequence
- Missing Number
- Find Duplicate
- First Missing Positive

### e. Performance
- O(N) optimal solution
- No sorting required
- Single pass sufficient
- Constant space

## Summary

✅ **Math Property:** max - min = N - 1  
✅ **Single Pass:** O(N) time complexity  
✅ **No Sorting:** More efficient approach  

Happy Coding! 🚀

