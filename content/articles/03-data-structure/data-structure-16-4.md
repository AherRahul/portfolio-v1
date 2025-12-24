---
title: "Find Ceiling in Sorted Array"
description: "Find ceiling (smallest element >= target) in sorted array. Master upper bound concept, handle exact matches, and optimize with binary search."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Ceiling in Sorted Array

## 2. Problem Statement

Given a **sorted array** A and a value **x**, find the **ceiling** of x (smallest element in A greater than or equal to x).

Return **-1** if ceiling doesn't exist.

**Input:**
- Sorted array `A` of size N
- Target integer `x`

**Output:**
- Ceiling value or -1

## 3. Examples

```
Input: A = [1, 2, 8, 10, 10, 12, 19], x = 5
Output: 8
Explanation: Smallest element >= 5 is 8

Input: A = [1, 2, 8, 10, 10, 12, 19], x = 20
Output: -1
Explanation: No element >= 20

Input: A = [1, 2, 8, 10, 10, 12, 19], x = 10
Output: 10
Explanation: 10 exists
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i], x ≤ 10^9`

## 5. Important Points

**Ceiling Definition:**
```
Smallest element >= x
```

**Cases:**
1. x <= min(A): return min(A)
2. x > max(A): return -1
3. x exists: return x
4. x between elements: return next larger

## 6. Brute Force Approach

Linear scan to find first element >= x.

## 7. Brute Force Code

```javascript
function ceilingBrute(A, x) {
    for (let i = 0; i < A.length; i++) {
        if (A[i] >= x) {
            return A[i];
        }
    }
    return -1;
}
```

## 8. Dry Run

```
A = [1, 2, 8, 10, 10, 12, 19], x = 5

i=0: A[0]=1 < 5
i=1: A[1]=2 < 5
i=2: A[2]=8 >= 5 → return 8
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N)  
**Space:** O(1)

## 10. Visualization

```
Array: [1, 2, 8, 10, 10, 12, 19]
Target: 5

1 < 5
2 < 5
8 >= 5 ← ceiling found

Result: 8
```

## 11. Optimized Approach Description

Use binary search to find smallest element >= x.

## 12. Optimized Approach Algorithm

```
1. left = 0, right = N-1, result = -1
2. While left <= right:
   - mid = (left + right) / 2
   - If A[mid] >= x:
       result = A[mid]
       right = mid - 1  // Search for smaller ceiling
   - Else:
       left = mid + 1
3. Return result
```

## 13. Optimized Code

```javascript
function findCeiling(A, x) {
    let left = 0;
    let right = A.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] >= x) {
            result = A[mid];
            right = mid - 1; // Try to find smaller ceiling
        } else {
            left = mid + 1;
        }
    }
    
    return result;
}

// Test cases
console.log(findCeiling([1, 2, 8, 10, 10, 12, 19], 5)); // 8
console.log(findCeiling([1, 2, 8, 10, 10, 12, 19], 20)); // -1
console.log(findCeiling([1, 2, 8, 10, 10, 12, 19], 10)); // 10
console.log(findCeiling([1, 2, 8, 10, 10, 12, 19], 0)); // 1
```

## 14. Dry Run

```
A = [1, 2, 8, 10, 10, 12, 19], x = 5
left=0, right=6, result=-1

Iteration 1:
mid=3, A[3]=10
10 >= 5 → result=10, right=2

Iteration 2:
mid=1, A[1]=2
2 < 5 → left=2

Iteration 3:
mid=2, A[2]=8
8 >= 5 → result=8, right=1

left > right → return 8
```

## 15. Time and Space Complexity

**Time:** O(log N)  
**Space:** O(1)

## 16. Visualization

```
Array: [1, 2, 8, 10, 10, 12, 19]
Target: 5

Binary search for ceiling:
[1, 2, 8, 10, 10, 12, 19]
       ↑ mid=3, 10>=5 (possible ceiling)

Search left for smaller:
[1, 2, 8]
    ↑ mid=1, 2<5

[8]
 ↑ mid=2, 8>=5 (better ceiling)

Final ceiling: 8
```

## 17. Edge Cases

```javascript
// Target smaller than all
findCeiling([5, 6, 8, 9], 1); // 5

// Target larger than all
findCeiling([5, 6, 8, 9], 10); // -1

// Target exists
findCeiling([5, 6, 8, 9], 6); // 6

// Single element
findCeiling([5], 3); // 5
findCeiling([5], 5); // 5
findCeiling([5], 6); // -1

// Duplicates
findCeiling([1, 2, 2, 2, 3], 2); // 2
```

## 18. Key Takeaways

### a. Applications
- Range queries
- Scheduling problems
- Database queries
- Time-based search

### b. Interview Strategy
- Explain ceiling concept
- Use binary search
- Handle edge cases
- Compare with floor

### c. Common Mistakes
- Confusing with floor
- Wrong comparison
- Not handling -1 case
- Off-by-one errors

### d. Related Problems
- Floor in Sorted Array
- Next Greater Element
- Search Insert Position
- Kth Smallest Element

### e. Performance
- O(log N) optimal
- Binary search standard
- Handle duplicates correctly
- Efficient for large arrays

## Summary

✅ **Ceiling:** Smallest element >= target  
✅ **Binary Search:** O(log N) solution  
✅ **Edge Cases:** Handle not found scenario  

Happy Coding! 🚀

