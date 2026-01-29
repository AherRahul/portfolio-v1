---
title: "Search in Rotated Sorted Array"
description: "Find element in rotated sorted array. Master pivot detection, modified binary search, and handle rotation with O(log N) solution."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Rotated Sorted Array Search

## 2. Problem Statement

Suppose an array sorted in ascending order is **rotated** at some unknown pivot. Given this rotated array and a target value, search for the target.

Return the **index** if found, otherwise return **-1**.

**Input:**
- Rotated sorted array `A`
- Target integer `B`

**Output:**
- Index of B or -1

## 3. Examples

```
Input: A = [4, 5, 6, 7, 0, 1, 2], B = 0
Output: 4

Input: A = [4, 5, 6, 7, 0, 1, 2], B = 3
Output: -1

Input: A = [1], B = 0
Output: -1
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i], B ≤ 10^9`
- All elements are distinct

## 5. Important Points

**Rotation:**
```
Original: [0, 1, 2, 4, 5, 6, 7]
Rotated:  [4, 5, 6, 7, 0, 1, 2]
          └─sorted─┘ └─sorted─┘
```

**Key Insight:**
At least one half is always sorted.

## 6. Brute Force Approach

Linear search.

## 7. Brute Force Code

```javascript
function searchRotatedBrute(A, B) {
    for (let i = 0; i < A.length; i++) {
        if (A[i] === B) {
            return i;
        }
    }
    return -1;
}
```

## 8. Dry Run

```
A = [4, 5, 6, 7, 0, 1, 2], B = 0

Scan: 4,5,6,7,0✓

Return: 4
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N)  
**Space:** O(1)

## 10. Visualization

```
Rotated array: [4, 5, 6, 7, 0, 1, 2]

Original:  0 1 2 3 4 5 6
Rotated:   4 5 6 7 0 1 2
Indices:   0 1 2 3 4 5 6

Target 0 at index 4
```

## 11. Optimized Approach Description

Modified binary search:
1. Find which half is sorted
2. Check if target is in sorted half
3. Search accordingly

## 12. Optimized Approach Algorithm

```
1. left = 0, right = N-1
2. While left <= right:
   - mid = (left + right) / 2
   - If A[mid] = target: return mid
   
   - If left half sorted (A[left] <= A[mid]):
       If target in [A[left], A[mid]]:
           right = mid - 1
       Else:
           left = mid + 1
   
   - Else right half sorted:
       If target in [A[mid], A[right]]:
           left = mid + 1
       Else:
           right = mid - 1
3. Return -1
```

## 13. Optimized Code

```javascript
function searchRotated(A, B) {
    let left = 0;
    let right = A.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] === B) {
            return mid;
        }
        
        // Determine which half is sorted
        if (A[left] <= A[mid]) {
            // Left half is sorted
            if (B >= A[left] && B < A[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (B > A[mid] && B <= A[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}

// Test cases
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log(searchRotated([1], 0)); // -1
console.log(searchRotated([1, 3], 3)); // 1
```

## 14. Dry Run

```
A = [4, 5, 6, 7, 0, 1, 2], B = 0
left=0, right=6

Iteration 1:
mid=3, A[3]=7
A[0]=4 <= A[3]=7 → left half sorted
0 not in [4,7] → left=4

Iteration 2:
left=4, right=6
mid=5, A[5]=1
A[4]=0 <= A[5]=1 → left half sorted
0 in [0,1] → right=4

Iteration 3:
left=4, right=4
mid=4, A[4]=0
0 = 0 → return 4
```

## 15. Time and Space Complexity

**Time:** O(log N)  
**Space:** O(1)

## 16. Visualization

```
Array: [4, 5, 6, 7, 0, 1, 2]
Target: 0

Step 1:
[4, 5, 6, 7] | [0, 1, 2]
   ↑ sorted     
Target not in [4,7], search right

Step 2:
[0, 1, 2]
 ↑ sorted
Target in [0,1], search left

Step 3:
[0] Found! ✓
```

## 17. Edge Cases

```javascript
// Single element
searchRotated([1], 1); // 0
searchRotated([1], 2); // -1

// Two elements
searchRotated([3, 1], 1); // 1
searchRotated([1, 3], 3); // 1

// No rotation
searchRotated([1, 2, 3, 4], 3); // 2

// Full rotation (same as original)
searchRotated([1, 2, 3, 4], 4); // 3

// Target at pivot
searchRotated([4, 5, 6, 7, 0, 1, 2], 7); // 3
```

## 18. Key Takeaways

### a. Applications
- Circular buffer search
- Shifted data structures
- Time-series with rollover
- Cache systems

### b. Interview Strategy
- Identify sorted half
- Range check for target
- Binary search modification
- Handle edge cases

### c. Common Mistakes
- Not checking which half is sorted
- Wrong range comparison
- Boundary issues
- Not handling no rotation

### d. Related Problems
- Find Minimum in Rotated Array
- Search in Rotated Array II (duplicates)
- Rotate Array
- Find Rotation Count

### e. Performance
- O(log N) optimal
- Modified binary search
- One pass solution
- Handles all rotation amounts

## Summary

✅ **Sorted Half:** Always exists  
✅ **Range Check:** Determine search direction  
✅ **O(log N):** Binary search maintained  

Happy Coding! 🚀

