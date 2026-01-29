---
title: "Search for Range using Binary Search"
description: "Find first and last position of target in sorted array. Master modified binary search, handle duplicates efficiently, and optimize with two binary searches."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Search for a Range

## 2. Problem Statement

Given a **sorted array** of integers **A** and a target value **B**, find the **starting and ending position** of **B** in the array.

If **B** is not found, return **[-1, -1]**.

**Input:**
- Sorted array `A` of size N
- Target integer `B`

**Output:**
- [start, end] positions or [-1, -1]

## 3. Examples

```
Input: A = [5, 7, 7, 8, 8, 10], B = 8
Output: [3, 4]
Explanation: 8 appears at indices 3 and 4

Input: A = [5, 7, 7, 8, 8, 10], B = 6
Output: [-1, -1]
Explanation: 6 not found

Input: A = [1], B = 1
Output: [0, 0]
```

## 4. Constraints

- `0 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i], B ≤ 10^9`
- Array is sorted in ascending order

## 5. Important Points

**Two Searches Required:**
```
1. Find first occurrence (leftmost)
2. Find last occurrence (rightmost)
```

**Binary Search Modification:**
- For first: continue searching left even after finding
- For last: continue searching right even after finding

## 6. Brute Force Approach

Linear scan to find first and last occurrence.

## 7. Brute Force Code

```javascript
function searchRangeBrute(A, B) {
    let first = -1, last = -1;
    
    for (let i = 0; i < A.length; i++) {
        if (A[i] === B) {
            if (first === -1) {
                first = i;
            }
            last = i;
        }
    }
    
    return [first, last];
}
```

## 8. Dry Run

```
A = [5, 7, 7, 8, 8, 10], B = 8

Scan:
i=0: 5≠8
i=1: 7≠8
i=2: 7≠8
i=3: 8=8 → first=3, last=3
i=4: 8=8 → last=4
i=5: 10≠8

Result: [3, 4]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N)  
**Space:** O(1)

## 10. Visualization

```
Array: [5, 7, 7, 8, 8, 10]
Index:  0  1  2  3  4  5
              ↓  ↓
           Target: 8

First occurrence: index 3
Last occurrence: index 4

Result: [3, 4]
```

## 11. Optimized Approach Description

Use two binary searches:
1. **Find first occurrence:** When target found, search left half
2. **Find last occurrence:** When target found, search right half

## 12. Optimized Approach Algorithm

```
findFirst(A, B):
  left = 0, right = N-1, result = -1
  While left <= right:
    mid = (left + right) / 2
    If A[mid] = B:
      result = mid
      right = mid - 1  // Continue left
    Else if A[mid] < B:
      left = mid + 1
    Else:
      right = mid - 1
  Return result

findLast(A, B):
  left = 0, right = N-1, result = -1
  While left <= right:
    mid = (left + right) / 2
    If A[mid] = B:
      result = mid
      left = mid + 1  // Continue right
    Else if A[mid] < B:
      left = mid + 1
    Else:
      right = mid - 1
  Return result
```

## 13. Optimized Code

```javascript
function searchRange(A, B) {
    const first = findFirst(A, B);
    const last = findLast(A, B);
    return [first, last];
}

function findFirst(A, target) {
    let left = 0;
    let right = A.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] === target) {
            result = mid;
            right = mid - 1; // Continue searching left
        } else if (A[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

function findLast(A, target) {
    let left = 0;
    let right = A.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] === target) {
            result = mid;
            left = mid + 1; // Continue searching right
        } else if (A[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// Test cases
console.log(searchRange([5, 7, 7, 8, 8, 10], 8)); // [3, 4]
console.log(searchRange([5, 7, 7, 8, 8, 10], 6)); // [-1, -1]
console.log(searchRange([1], 1)); // [0, 0]
console.log(searchRange([2, 2, 2, 2], 2)); // [0, 3]
```

## 14. Dry Run

```
A = [5, 7, 7, 8, 8, 10], B = 8

Find First:
left=0, right=5
mid=2: A[2]=7 < 8 → left=3
mid=4: A[4]=8 = 8 → result=4, right=3
mid=3: A[3]=8 = 8 → result=3, right=2
left > right → return 3

Find Last:
left=0, right=5
mid=2: A[2]=7 < 8 → left=3
mid=4: A[4]=8 = 8 → result=4, left=5
mid=5: A[5]=10 > 8 → right=4
left > right → return 4

Result: [3, 4]
```

## 15. Time and Space Complexity

**Time:** O(log N) - two binary searches  
**Space:** O(1)

## 16. Visualization

```
Array: [5, 7, 7, 8, 8, 10]

Find First (8):
[5, 7, 7, 8, 8, 10]
          ↑ mid=4 (found, search left)
[5, 7, 7, 8]
       ↑ mid=3 (found, search left)
[5, 7, 7]
   ↑ mid=1 (too small)
      [7]
       ↑ mid=2 (too small)
       
First = 3 ✓

Find Last (8):
[5, 7, 7, 8, 8, 10]
          ↑ mid=4 (found, search right)
             [8, 10]
              ↑ mid=5 (too large)
             
Last = 4 ✓
```

## 17. Edge Cases

```javascript
// Not found
searchRange([1, 2, 3], 5); // [-1, -1]

// Single element found
searchRange([1], 1); // [0, 0]

// Single element not found
searchRange([1], 2); // [-1, -1]

// All same elements
searchRange([2, 2, 2, 2], 2); // [0, 3]

// First element
searchRange([1, 2, 3], 1); // [0, 0]

// Last element
searchRange([1, 2, 3], 3); // [2, 2]

// Two occurrences
searchRange([1, 2, 2, 3], 2); // [1, 2]

// Empty array
searchRange([], 1); // [-1, -1]
```

## 18. Key Takeaways

### a. Applications
- Database range queries
- Log file analysis
- Time series data
- Duplicate handling

### b. Interview Strategy
- Explain two binary searches
- Mention continuing search after finding
- Discuss O(log N) efficiency
- Handle edge cases

### c. Common Mistakes
- Stopping search after first find
- Wrong boundary updates
- Not handling empty array
- Single element edge case

### d. Related Problems
- First Bad Version
- Find Peak Element
- Search Insert Position
- Count of Smaller/Greater

### e. Performance
- O(log N) optimal for sorted array
- Two independent searches
- Can parallelize
- Better than O(N) scan

## Summary

✅ **Two Binary Searches:** First and last position  
✅ **Continue Searching:** Don't stop at first find  
✅ **O(log N):** Optimal for sorted array  

Happy Coding! 🚀

