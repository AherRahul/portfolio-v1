---
title: "Bubble Sort Implementation and Analysis"
description: "Master Bubble Sort algorithm with optimizations. Learn swap-based sorting, implement early termination, and understand when to use bubble sort in practice."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Bubble Sort

## 2. Problem Statement

Implement **Bubble Sort** algorithm to sort an array in **ascending order**. Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

**Input:**
- Array `A` of N integers

**Output:**
- Sorted array in ascending order

## 3. Examples

```
Input: [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]

Input: [5, 1, 4, 2, 8]
Output: [1, 2, 4, 5, 8]

Input: [1, 2, 3, 4, 5]
Output: [1, 2, 3, 4, 5]
```

## 4. Constraints

- `1 ≤ N ≤ 10^3`
- `-10^6 ≤ A[i] ≤ 10^6`

## 5. Important Points

**Bubble Sort Properties:**
```
- Comparison-based sorting
- In-place algorithm
- Stable sorting
- Best for small or nearly sorted arrays
```

**Key Concepts:**
- Each pass bubbles largest element to end
- After i passes, last i elements are sorted
- Can optimize with swap flag

## 6. Brute Force Approach

Basic bubble sort without optimizations.

## 7. Brute Force Code

```javascript
function bubbleSortBasic(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return arr;
}
```

## 8. Dry Run

```
arr = [64, 34, 25, 12, 22]

Pass 1:
  64 > 34 → [34, 64, 25, 12, 22]
  64 > 25 → [34, 25, 64, 12, 22]
  64 > 12 → [34, 25, 12, 64, 22]
  64 > 22 → [34, 25, 12, 22, 64] ✓

Pass 2:
  34 > 25 → [25, 34, 12, 22, 64]
  34 > 12 → [25, 12, 34, 22, 64]
  34 > 22 → [25, 12, 22, 34, 64] ✓

Pass 3:
  25 > 12 → [12, 25, 22, 34, 64]
  25 > 22 → [12, 22, 25, 34, 64] ✓

Pass 4:
  12 < 22 → [12, 22, 25, 34, 64] ✓

Result: [12, 22, 25, 34, 64]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²) - all cases  
**Space:** O(1)

## 10. Visualization

```
Initial: [5, 1, 4, 2, 8]

Pass 1: 5 1 4 2 8
        ↓ ↓
        1 5 4 2 8
          ↓ ↓
        1 4 5 2 8
            ↓ ↓
        1 4 2 5 8
              ↓ ↓
        1 4 2 5 8 ✓

Pass 2: 1 4 2 5 8
        ↓ ↓
        1 4 2 5 8
          ↓ ↓
        1 2 4 5 8 ✓

Already sorted!
```

## 11. Optimized Approach Description

Add a flag to detect if any swaps occurred. If no swaps in a pass, array is sorted and we can terminate early.

## 12. Optimized Approach Algorithm

```
1. For i from 0 to n-1:
   - Set swapped = false
   - For j from 0 to n-1-i:
       If arr[j] > arr[j+1]:
           Swap them
           swapped = true
   - If not swapped: break (array is sorted)
2. Return array
```

## 13. Optimized Code

```javascript
function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // Early termination if no swaps
        if (!swapped) break;
    }
    
    return arr;
}

// Test cases
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// [11, 12, 22, 25, 34, 64, 90]

console.log(bubbleSort([5, 1, 4, 2, 8]));
// [1, 2, 4, 5, 8]

console.log(bubbleSort([1, 2, 3, 4, 5]));
// [1, 2, 3, 4, 5] (one pass only)
```

## 14. Dry Run

```
arr = [1, 2, 3, 4, 5] (already sorted)

Pass 1:
  swapped = false
  1 < 2 → no swap
  2 < 3 → no swap
  3 < 4 → no swap
  4 < 5 → no swap
  swapped still false → BREAK

Result: [1, 2, 3, 4, 5]
Only 1 pass instead of 4!
```

## 15. Time and Space Complexity

**Time:**  
- Best: O(N) - already sorted
- Average: O(N²)
- Worst: O(N²) - reverse sorted

**Space:** O(1)

## 16. Visualization

```
Optimization benefit on sorted array:

Without optimization:
[1, 2, 3, 4, 5]
Pass 1, 2, 3, 4 → Total: 4 passes

With optimization:
[1, 2, 3, 4, 5]
Pass 1 (no swaps) → STOP
Total: 1 pass ✓

Performance gain: 4x faster
```

## 17. Edge Cases

```javascript
// Single element
bubbleSort([1]); // [1]

// Two elements
bubbleSort([2, 1]); // [1, 2]

// Already sorted
bubbleSort([1, 2, 3, 4]); // [1, 2, 3, 4]

// Reverse sorted
bubbleSort([5, 4, 3, 2, 1]); // [1, 2, 3, 4, 5]

// Duplicates
bubbleSort([3, 1, 3, 2, 1]); // [1, 1, 2, 3, 3]

// All same
bubbleSort([5, 5, 5, 5]); // [5, 5, 5, 5]
```

## 18. Key Takeaways

### a. Applications
- Educational purposes
- Small datasets
- Nearly sorted data
- Embedded systems (simple code)

### b. Interview Strategy
- Mention optimization flag
- Explain stability property
- Discuss time complexity
- Compare with other sorts

### c. Common Mistakes
- Wrong loop boundaries
- Not using optimization flag
- Forgetting in-place swap
- Off-by-one errors

### d. Related Problems
- Selection Sort
- Insertion Sort
- Cocktail Shaker Sort
- Odd-Even Sort

### e. Performance
- Not recommended for large datasets
- Good for teaching sorting concepts
- Stable sorting algorithm
- Simple implementation

## Summary

✅ **Adjacent Swaps:** Bubble largest to end  
✅ **Early Termination:** Stop if no swaps  
✅ **Stable Sort:** Maintains relative order  

Happy Coding! 🚀

