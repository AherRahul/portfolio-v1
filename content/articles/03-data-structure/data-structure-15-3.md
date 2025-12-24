---
title: "Merge Sort Algorithm Implementation"
description: "Master Merge Sort with divide-and-conquer approach. Learn recursive sorting, efficient merging, and understand one of the most efficient comparison-based sorting algorithms."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Merge Sort

## 2. Problem Statement

Implement **Merge Sort** algorithm to sort an array in ascending order using the **divide-and-conquer** approach.

Merge Sort divides the array into two halves, recursively sorts them, and then merges the sorted halves.

**Input:**
- Array `A` of N integers

**Output:**
- Sorted array in ascending order

## 3. Examples

```
Input: [38, 27, 43, 3, 9, 82, 10]
Output: [3, 9, 10, 27, 38, 43, 82]

Input: [5, 2, 4, 7, 1, 3, 2, 6]
Output: [1, 2, 2, 3, 4, 5, 6, 7]

Input: [1]
Output: [1]
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Merge Sort Properties:**
```
- Divide and Conquer algorithm
- Stable sorting
- Guaranteed O(N log N)
- Not in-place (requires O(N) space)
```

**Key Concepts:**
- Divide: Split array into halves
- Conquer: Recursively sort halves
- Combine: Merge sorted halves

## 6. Brute Force Approach

Use built-in sort (comparison-based).

## 7. Brute Force Code

```javascript
function sortBrute(arr) {
    return arr.sort((a, b) => a - b);
}
```

## 8. Dry Run

```
arr = [38, 27, 43, 3]

Split: [38, 27] | [43, 3]
Split: [38] [27] | [43] [3]
Merge: [27, 38] | [3, 43]
Merge: [3, 27, 38, 43]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N log N) - most implementations  
**Space:** O(log N) - recursion stack

## 10. Visualization

```
Original: [38, 27, 43, 3]

        [38, 27, 43, 3]
           /        \
     [38, 27]      [43, 3]
      /    \        /    \
    [38]  [27]    [43]  [3]
      \    /        \    /
     [27, 38]      [3, 43]
           \        /
        [3, 27, 38, 43]
```

## 11. Optimized Approach Description

Implement merge sort with divide-and-conquer:
1. Divide array into two halves
2. Recursively sort each half
3. Merge the sorted halves

## 12. Optimized Approach Algorithm

```
mergeSort(arr, left, right):
  If left >= right: return
  
  mid = (left + right) / 2
  mergeSort(arr, left, mid)
  mergeSort(arr, mid+1, right)
  merge(arr, left, mid, right)

merge(arr, left, mid, right):
  Create temp arrays L and R
  Copy data to L[0..n1] and R[0..n2]
  Merge L and R back into arr[left..right]
```

## 13. Optimized Code

```javascript
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    // Compare and merge
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    // Add remaining elements
    return result.concat(left.slice(i)).concat(right.slice(j));
}

// Test cases
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]

console.log(mergeSort([5, 2, 4, 7, 1, 3, 2, 6]));
// [1, 2, 2, 3, 4, 5, 6, 7]

console.log(mergeSort([1]));
// [1]
```

## 14. Dry Run

```
mergeSort([38, 27, 43, 3])

Split into [38, 27] and [43, 3]

Left: mergeSort([38, 27])
  Split into [38] and [27]
  merge([38], [27]) → [27, 38]

Right: mergeSort([43, 3])
  Split into [43] and [3]
  merge([43], [3]) → [3, 43]

merge([27, 38], [3, 43]):
  Compare 27 and 3: 3 < 27 → [3]
  Compare 27 and 43: 27 < 43 → [3, 27]
  Compare 38 and 43: 38 < 43 → [3, 27, 38]
  Add remaining: [3, 27, 38, 43]

Result: [3, 27, 38, 43]
```

## 15. Time and Space Complexity

**Time:**  
- All cases: O(N log N)
- Dividing: O(log N) levels
- Merging: O(N) per level

**Space:** O(N) - temporary arrays

## 16. Visualization

```
Detailed merge process:
[38, 27, 43, 3, 9, 82, 10]
            ↓
    [38, 27, 43, 3] | [9, 82, 10]
          ↓                ↓
    [38, 27] [43, 3]   [9, 82] [10]
      ↓  ↓    ↓  ↓       ↓  ↓    ↓
    [38][27][43][3]    [9][82] [10]
      ↓                     ↓
   [27,38][3,43]        [9,82][10]
         ↓                   ↓
   [3,27,38,43]         [9,10,82]
            ↓            ↓
        [3,9,10,27,38,43,82]

Tree height: log₂(7) ≈ 3 levels
Work per level: O(N)
Total: O(N log N)
```

## 17. Edge Cases

```javascript
// Empty array
mergeSort([]); // []

// Single element
mergeSort([5]); // [5]

// Two elements
mergeSort([2, 1]); // [1, 2]

// Already sorted
mergeSort([1, 2, 3, 4]); // [1, 2, 3, 4]

// Reverse sorted
mergeSort([5, 4, 3, 2, 1]); // [1, 2, 3, 4, 5]

// Duplicates
mergeSort([3, 1, 3, 2, 1]); // [1, 1, 2, 3, 3]

// All same
mergeSort([5, 5, 5, 5]); // [5, 5, 5, 5]

// Negative numbers
mergeSort([-5, 3, -1, 7, -10]); // [-10, -5, -1, 3, 7]
```

## 18. Key Takeaways

### a. Applications
- Large datasets
- External sorting
- Linked list sorting
- Parallel processing
- Inversion count

### b. Interview Strategy
- Explain divide-and-conquer
- Mention stability
- Discuss time/space complexity
- Compare with quicksort

### c. Common Mistakes
- Wrong mid calculation
- Not handling base case
- Memory issues with large arrays
- Incorrect merge logic

### d. Related Problems
- Count Inversions
- Sort Linked List
- Merge K Sorted Arrays
- External Sorting

### e. Performance
- Guaranteed O(N log N)
- Stable sorting
- Predictable performance
- Good for linked lists

## Summary

✅ **Divide and Conquer:** Split, sort, merge  
✅ **O(N log N):** Guaranteed time complexity  
✅ **Stable Sort:** Maintains relative order  

Happy Coding! 🚀

