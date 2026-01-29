---
title: "Search in Bitonic Array"
description: "Find element in bitonic (mountain) array. Master two-phase binary search, identify peak efficiently, and search in ascending and descending parts."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Search in Bitonic Array

## 2. Problem Statement

A **bitonic array** is an array that first increases and then decreases. Given a bitonic array **A** and a target value **B**, find the index of **B**.

Return **-1** if not found.

**Input:**
- Bitonic array `A` of N integers
- Target integer `B`

**Output:**
- Index of B or -1

## 3. Examples

```
Input: A = [1, 3, 8, 12, 4, 2], B = 4
Output: 4

Input: A = [3, 9, 10, 20, 17, 5, 1], B = 20
Output: 3

Input: A = [5, 6, 7, 8, 9, 10, 3, 2, 1], B = 30
Output: -1
```

## 4. Constraints

- `3 ≤ N ≤ 10^5`
- `-10^6 ≤ A[i], B ≤ 10^6`

## 5. Important Points

**Bitonic Array:**
```
Increases: A[0] < A[1] < ... < A[peak]
Decreases: A[peak] > A[peak+1] > ... > A[N-1]
```

**Strategy:**
1. Find peak element
2. Binary search in ascending part
3. Binary search in descending part

## 6. Brute Force Approach

Linear scan.

## 7. Brute Force Code

```javascript
function searchBitonicBrute(A, B) {
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
A = [1, 3, 8, 12, 4, 2], B = 4

Scan: 1,3,8,12,4✓

Return: 4
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N)  
**Space:** O(1)

## 10. Visualization

```
Array: [1, 3, 8, 12, 4, 2]

    12 ← peak
   /  \
  8    4 ← target
 /      \
3        2
|
1
```

## 11. Optimized Approach Description

Three-step binary search:
1. Find peak
2. Binary search left of peak (ascending)
3. Binary search right of peak (descending)

## 12. Optimized Approach Algorithm

```
1. Find peak index using binary search
2. Search in [0, peak] with ascending order
3. If not found, search in [peak+1, N-1] with descending order
4. Return result
```

## 13. Optimized Code

```javascript
function searchBitonic(A, B) {
    const peak = findPeak(A);
    
    // Search in ascending part
    const leftResult = binarySearchAsc(A, 0, peak, B);
    if (leftResult !== -1) return leftResult;
    
    // Search in descending part
    return binarySearchDesc(A, peak + 1, A.length - 1, B);
}

function findPeak(A) {
    let left = 0;
    let right = A.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] < A[mid + 1]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}

function binarySearchAsc(A, left, right, target) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] === target) {
            return mid;
        } else if (A[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

function binarySearchDesc(A, left, right, target) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] === target) {
            return mid;
        } else if (A[mid] > target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Test cases
console.log(searchBitonic([1, 3, 8, 12, 4, 2], 4)); // 4
console.log(searchBitonic([3, 9, 10, 20, 17, 5, 1], 20)); // 3
console.log(searchBitonic([5, 6, 7, 8, 9, 10, 3, 2, 1], 30)); // -1
```

## 14. Dry Run

```
A = [1, 3, 8, 12, 4, 2], B = 4

Step 1: Find peak
peak = 3 (value 12)

Step 2: Search [0,3] ascending
1<4, 3<4, 8>4, 12>4 → not found

Step 3: Search [4,5] descending
4=4 → found at index 4

Return: 4
```

## 15. Time and Space Complexity

**Time:** O(log N)  
**Space:** O(1)

## 16. Visualization

```
Bitonic array: [1, 3, 8, 12, 4, 2]

Step 1: Find peak
        12 ← peak at index 3

Step 2: Search left (ascending)
   1 3 8 12
Target 4 not in [1,12]

Step 3: Search right (descending)
         4 2
Target 4 found! ✓
```

## 17. Edge Cases

```javascript
// Target at peak
searchBitonic([1, 3, 8, 12, 4, 2], 12); // 3

// Target at start
searchBitonic([1, 3, 8, 12, 4, 2], 1); // 0

// Target at end
searchBitonic([1, 3, 8, 12, 4, 2], 2); // 5

// Minimum size bitonic
searchBitonic([1, 3, 2], 3); // 1
searchBitonic([1, 3, 2], 1); // 0
searchBitonic([1, 3, 2], 2); // 2
```

## 18. Key Takeaways

### a. Applications
- Mountain data analysis
- Peak detection
- Signal processing
- Temperature patterns

### b. Interview Strategy
- Explain bitonic property
- Three-step approach
- Different binary search for descending
- Mention O(log N) complexity

### c. Common Mistakes
- Wrong descending binary search
- Not finding peak correctly
- Searching wrong halves
- Off-by-one in ranges

### d. Related Problems
- Find Peak Element
- Search in Rotated Array
- Mountain Array
- Bitonic Subsequence

### e. Performance
- O(log N) optimal
- Three binary searches
- Efficient peak finding
- Better than linear scan

## Summary

✅ **Find Peak:** First binary search  
✅ **Two Searches:** Ascending and descending parts  
✅ **O(log N):** Three logarithmic searches  

Happy Coding! 🚀

