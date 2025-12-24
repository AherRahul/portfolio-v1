---
title: "Insertion Sort Implementation"
description: "Master Insertion Sort with card-sorting analogy. Learn efficient sorting for small arrays, understand adaptive behavior, and implement stable sorting."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Insertion Sort

## 2. Problem Statement

Implement **Insertion Sort** algorithm to sort an array in ascending order. Insertion Sort builds the final sorted array one item at a time, similar to sorting playing cards in your hands.

**Input:**
- Array `A` of N integers

**Output:**
- Sorted array in ascending order

## 3. Examples

```
Input: [12, 11, 13, 5, 6]
Output: [5, 6, 11, 12, 13]

Input: [5, 2, 4, 6, 1, 3]
Output: [1, 2, 3, 4, 5, 6]

Input: [1, 2, 3]
Output: [1, 2, 3]
```

## 4. Constraints

- `1 ≤ N ≤ 10^3`
- `-10^6 ≤ A[i] ≤ 10^6`

## 5. Important Points

**Insertion Sort Properties:**
```
- Comparison-based sorting
- In-place algorithm
- Stable sorting
- Adaptive (efficient for nearly sorted)
```

**Key Analogy:**
Like sorting playing cards - pick one, insert at right position.

## 6. Brute Force Approach

For each element, find its correct position and shift elements.

## 7. Brute Force Code

```javascript
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        
        // Shift elements greater than key
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Insert key at correct position
        arr[j + 1] = key;
    }
    
    return arr;
}
```

## 8. Dry Run

```
arr = [12, 11, 13, 5, 6]

i=1, key=11:
  12 > 11 → shift
  [11, 12, 13, 5, 6]

i=2, key=13:
  12 < 13 → no shift
  [11, 12, 13, 5, 6]

i=3, key=5:
  13 > 5 → shift
  12 > 5 → shift
  11 > 5 → shift
  [5, 11, 12, 13, 6]

i=4, key=6:
  13 > 6 → shift
  12 > 6 → shift
  11 > 6 → shift
  [5, 6, 11, 12, 13]

Result: [5, 6, 11, 12, 13]
```

## 9. Time and Space Complexity of Brute Force

**Time:**  
- Best: O(N) - already sorted
- Average: O(N²)
- Worst: O(N²) - reverse sorted

**Space:** O(1)

## 10. Visualization

```
Initial: [12, 11, 13, 5, 6]

Pass 1: Pick 11
[12 | 11, 13, 5, 6]
      ↓
[11, 12 | 13, 5, 6]

Pass 2: Pick 13
[11, 12 | 13, 5, 6]
          ↓
[11, 12, 13 | 5, 6]

Pass 3: Pick 5
[11, 12, 13 | 5, 6]
               ↓
[5, 11, 12, 13 | 6]

Pass 4: Pick 6
[5, 11, 12, 13 | 6]
                  ↓
[5, 6, 11, 12, 13]
```

## 11. Optimized Approach Description

The standard insertion sort is already optimal for its class. We can add minor optimizations like binary search for finding position, but shifting still requires O(N).

## 12. Optimized Approach Algorithm

```
1. Start from second element (index 1)
2. For each element (key):
   - Store key in temporary variable
   - Start from previous element
   - While current > key:
       Shift current one position right
       Move to previous element
   - Insert key at found position
3. Return sorted array
```

## 13. Optimized Code

```javascript
function insertionSort(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
    
    return arr;
}

// Test cases
console.log(insertionSort([12, 11, 13, 5, 6]));
// [5, 6, 11, 12, 13]

console.log(insertionSort([5, 2, 4, 6, 1, 3]));
// [1, 2, 3, 4, 5, 6]

console.log(insertionSort([1, 2, 3]));
// [1, 2, 3]

// With binary search for position (optimization)
function insertionSortBinary(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        
        // Find position using binary search
        let left = 0, right = i - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] > key) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        // Shift elements and insert
        for (let j = i - 1; j >= left; j--) {
            arr[j + 1] = arr[j];
        }
        arr[left] = key;
    }
    
    return arr;
}
```

## 14. Dry Run

```
arr = [5, 2, 4, 6, 1, 3]

i=1, key=2:
  j=0: 5 > 2
  arr = [5, 5, 4, 6, 1, 3]
  arr = [2, 5, 4, 6, 1, 3]

i=2, key=4:
  j=1: 5 > 4
  arr = [2, 5, 5, 6, 1, 3]
  arr = [2, 4, 5, 6, 1, 3]

i=3, key=6:
  j=2: 5 < 6 (stop)
  arr = [2, 4, 5, 6, 1, 3]

i=4, key=1:
  j=3: 6 > 1, 5 > 1, 4 > 1, 2 > 1
  arr = [1, 2, 4, 5, 6, 3]

i=5, key=3:
  j=4: 6 > 3, 5 > 3, 4 > 3
  arr = [1, 2, 3, 4, 5, 6]

Result: [1, 2, 3, 4, 5, 6]
```

## 15. Time and Space Complexity

**Time:**  
- Best: O(N) - already sorted
- Average: O(N²)
- Worst: O(N²) - reverse sorted

**Space:** O(1) - in-place

## 16. Visualization

```
Card sorting analogy:

Hand: [3, 8]
Pick: 5

Compare 5 with 8: 5 < 8 (move left)
Compare 5 with 3: 5 > 3 (stop)
Insert: [3, 5, 8]

Sorted portion grows with each insertion:
[3] | 8, 5, 2
[3, 8] | 5, 2
[3, 5, 8] | 2
[2, 3, 5, 8]
```

## 17. Edge Cases

```javascript
// Single element
insertionSort([1]); // [1]

// Two elements
insertionSort([2, 1]); // [1, 2]

// Already sorted
insertionSort([1, 2, 3, 4]); // [1, 2, 3, 4] (O(N))

// Reverse sorted
insertionSort([5, 4, 3, 2, 1]); // [1, 2, 3, 4, 5] (O(N²))

// Duplicates
insertionSort([3, 1, 3, 2, 1]); // [1, 1, 2, 3, 3]

// All same
insertionSort([5, 5, 5, 5]); // [5, 5, 5, 5]

// Negative numbers
insertionSort([-5, 3, -1, 7, -10]); // [-10, -5, -1, 3, 7]
```

## 18. Key Takeaways

### a. Applications
- Small datasets
- Nearly sorted data
- Online sorting (streaming data)
- Hybrid algorithms (TimSort uses it)

### b. Interview Strategy
- Explain card sorting analogy
- Mention adaptive behavior
- Discuss stability
- Compare with selection/bubble sort

### c. Common Mistakes
- Wrong loop boundaries
- Not storing key in temp
- Incorrect shift logic
- Off-by-one errors

### d. Related Problems
- Sort Colors (Dutch Flag)
- Insertion in Sorted Array
- Merge Sorted Arrays
- Sort Linked List

### e. Performance
- Efficient for small arrays
- Adaptive (O(N) for sorted)
- Stable sorting
- Low overhead

## Summary

✅ **Card Sorting:** Pick and insert strategy  
✅ **Adaptive:** Fast for nearly sorted  
✅ **Stable:** Maintains relative order  

Happy Coding! 🚀

