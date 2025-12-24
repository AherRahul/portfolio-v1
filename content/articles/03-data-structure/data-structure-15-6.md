---
title: "Count Inversions in Array"
description: "Count inversions using modified merge sort. Master divide-and-conquer counting, understand array disorder measurement, and achieve O(N log N) solution."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Inversion Count in Array

## 2. Problem Statement

Given an array **A**, count the number of **inversions** in it. An inversion is a pair of indices **(i, j)** such that **i < j** and **A[i] > A[j]**.

**Input:**
- Array `A` of N integers

**Output:**
- Count of inversions

## 3. Examples

```
Input: [2, 4, 1, 3, 5]
Output: 3
Explanation: (2,1), (4,1), (4,3)

Input: [5, 3, 2, 4, 1]
Output: 8
Explanation: (5,3), (5,2), (5,4), (5,1), (3,2), (3,1), (4,1), (2,1)

Input: [1, 2, 3, 4, 5]
Output: 0
Explanation: No inversions (sorted)
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `1 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Inversion Definition:**
```
For indices i < j:
If A[i] > A[j], it's an inversion
```

**Key Insights:**
- Sorted array has 0 inversions
- Reverse sorted has N*(N-1)/2 inversions
- Measure of "sortedness"

## 6. Brute Force Approach

Check all pairs (i, j) where i < j.

## 7. Brute Force Code

```javascript
function countInversionsBrute(arr) {
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                count++;
            }
        }
    }
    
    return count;
}
```

## 8. Dry Run

```
arr = [2, 4, 1, 3, 5]

i=0 (2): j=1(4)✗, j=2(1)✓, j=3(3)✗, j=4(5)✗ → count=1
i=1 (4): j=2(1)✓, j=3(3)✓, j=4(5)✗ → count=3
i=2 (1): j=3(3)✗, j=4(5)✗ → count=3
i=3 (3): j=4(5)✗ → count=3

Result: 3
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
Array: [2, 4, 1, 3, 5]

Inversions:
2 > 1 ✓ (index 0, 2)
4 > 1 ✓ (index 1, 2)
4 > 3 ✓ (index 1, 3)

Total: 3
```

## 11. Optimized Approach Description

Use modified merge sort. While merging, count inversions:
- If element from right subarray is picked, it means all remaining elements in left are inversions.

## 12. Optimized Approach Algorithm

```
mergeAndCount(arr, left, mid, right):
  Create temp arrays L and R
  inversions = 0
  
  While merging:
    If L[i] <= R[j]:
      Add L[i] to result
    Else:
      Add R[j] to result
      inversions += (mid - i + 1) // All remaining in L
  
  Return inversions

mergeSortAndCount(arr, left, right):
  If left >= right: return 0
  
  mid = (left + right) / 2
  inv = mergeSortAndCount(arr, left, mid)
  inv += mergeSortAndCount(arr, mid+1, right)
  inv += mergeAndCount(arr, left, mid, right)
  
  Return inv
```

## 13. Optimized Code

```javascript
function countInversions(arr) {
    return mergeSortAndCount(arr, 0, arr.length - 1);
}

function mergeSortAndCount(arr, left, right) {
    let invCount = 0;
    
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        invCount += mergeSortAndCount(arr, left, mid);
        invCount += mergeSortAndCount(arr, mid + 1, right);
        invCount += mergeAndCount(arr, left, mid, right);
    }
    
    return invCount;
}

function mergeAndCount(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left, invCount = 0;
    
    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
            // All remaining elements in left are inversions
            invCount += (leftArr.length - i);
        }
    }
    
    while (i < leftArr.length) {
        arr[k++] = leftArr[i++];
    }
    
    while (j < rightArr.length) {
        arr[k++] = rightArr[j++];
    }
    
    return invCount;
}

// Test cases
console.log(countInversions([2, 4, 1, 3, 5])); // 3
console.log(countInversions([5, 3, 2, 4, 1])); // 8
console.log(countInversions([1, 2, 3, 4, 5])); // 0
console.log(countInversions([5, 4, 3, 2, 1])); // 10
```

## 14. Dry Run

```
arr = [2, 4, 1, 3]

Split: [2, 4] and [1, 3]

Left [2, 4]:
  Split: [2] and [4]
  Merge: [2, 4], inv=0

Right [1, 3]:
  Split: [1] and [3]
  Merge: [1, 3], inv=0

Merge [2, 4] and [1, 3]:
  Compare 2 and 1:
    1 < 2 → pick 1
    inversions += 2 (both 2 and 4 > 1)
    
  Compare 2 and 3:
    2 < 3 → pick 2
    
  Compare 4 and 3:
    3 < 4 → pick 3
    inversions += 1 (4 > 3)
    
  Pick 4

Total inversions: 0 + 0 + 3 = 3
```

## 15. Time and Space Complexity

**Time:** O(N log N)  
**Space:** O(N) - temporary arrays

## 16. Visualization

```
[2, 4, 1, 3]
      ↓
  [2, 4]  [1, 3]
   ↓ ↓    ↓ ↓
  [2][4] [1][3]
   ↓          ↓
  [2,4]  [1,3]
    inv=0  inv=0

Merge [2,4] and [1,3]:
Step 1: Pick 1 (smaller)
  2,4 > 1 → 2 inversions
  
Step 2: Pick 2 (smaller)
  No new inversions
  
Step 3: Pick 3 (smaller)
  4 > 3 → 1 inversion

Total: 3 inversions
```

## 17. Edge Cases

```javascript
// Single element
countInversions([1]); // 0

// Two elements sorted
countInversions([1, 2]); // 0

// Two elements inverted
countInversions([2, 1]); // 1

// Already sorted
countInversions([1, 2, 3, 4, 5]); // 0

// Reverse sorted
countInversions([5, 4, 3, 2, 1]); // 10 (n*(n-1)/2)

// All same
countInversions([3, 3, 3, 3]); // 0

// Large inversions
countInversions([6, 5, 4, 3, 2, 1]); // 15
```

## 18. Key Takeaways

### a. Applications
- Sorting similarity measure
- Collaborative filtering
- Kendall Tau distance
- Data analysis

### b. Interview Strategy
- Explain modified merge sort
- Count during merge phase
- Mention O(N log N) complexity
- Handle edge cases

### c. Common Mistakes
- Wrong inversion count formula
- Not counting all inversions
- Incorrect merge logic
- Missing split inversions

### d. Related Problems
- Count Smaller After Self
- Reverse Pairs
- Global Inversions
- Kendall Tau Distance

### e. Performance
- O(N log N) optimal solution
- Better than brute force O(N²)
- Uses merge sort framework
- Sorts array as side effect

## Summary

✅ **Modified Merge Sort:** Count during merge  
✅ **O(N log N):** Optimal time complexity  
✅ **Cross Inversions:** Count when picking from right  

Happy Coding! 🚀

