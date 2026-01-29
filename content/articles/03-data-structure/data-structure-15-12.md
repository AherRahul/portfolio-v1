---
title: "QuickSort Implementation and Optimization"
description: "Master QuickSort with partition strategies. Learn divide-and-conquer sorting, optimize pivot selection, and understand practical performance considerations."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## QuickSort

## 2. Problem Statement

Implement **QuickSort** algorithm to sort an array in ascending order using the **divide-and-conquer** approach with **partitioning**.

QuickSort picks a pivot element and partitions the array around it.

**Input:**
- Array `A` of N integers

**Output:**
- Sorted array in ascending order

## 3. Examples

```
Input: [10, 7, 8, 9, 1, 5]
Output: [1, 5, 7, 8, 9, 10]

Input: [64, 34, 25, 12, 22, 11, 90]
Output: [11, 12, 22, 25, 34, 64, 90]

Input: [1, 2, 3]
Output: [1, 2, 3]
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i] ≤ 10^9`

## 5. Important Points

**QuickSort Properties:**
```
- Divide and Conquer
- In-place sorting
- Not stable
- Average O(N log N), Worst O(N²)
```

**Key Concepts:**
- Pivot selection crucial
- Partition around pivot
- Recursively sort subarrays

## 6. Brute Force Approach

Use simple pivot (last element) without optimization.

## 7. Brute Force Code

```javascript
function quickSortBasic(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSortBasic(arr, low, pi - 1);
        quickSortBasic(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}
```

## 8. Dry Run

```
arr = [10, 7, 8, 9, 1, 5]
Pivot = 5 (last element)

Partition:
10 > 5 → skip
7 > 5 → skip
8 > 5 → skip
9 > 5 → skip
1 < 5 → swap with 10: [1, 7, 8, 9, 10, 5]

Place pivot: [1, 5, 8, 9, 10, 7]

Recursively sort [1] and [8, 9, 10, 7]
...
Result: [1, 5, 7, 8, 9, 10]
```

## 9. Time and Space Complexity of Brute Force

**Time:**  
- Best/Average: O(N log N)
- Worst: O(N²) - when array already sorted

**Space:** O(log N) - recursion stack

## 10. Visualization

```
Initial: [10, 7, 8, 9, 1, 5]

Choose pivot = 5:
[10, 7, 8, 9, 1] | 5
 ↑              ↑
elements > 5   < 5

After partition:
[1] | 5 | [10, 7, 8, 9]

Recursively sort:
Left: [1] ✓
Right: [10, 7, 8, 9]
  Pivot = 9
  [7, 8] | 9 | [10]
  ...

Final: [1, 5, 7, 8, 9, 10]
```

## 11. Optimized Approach Description

Optimize with:
1. **Random pivot** - avoid worst case
2. **Median-of-three** - better pivot choice
3. **Tail recursion** - reduce stack space
4. **Insertion sort** for small subarrays

## 12. Optimized Approach Algorithm

```
quickSort(arr, low, high):
  If low >= high: return
  
  # Choose pivot (random or median)
  pivot = choosePivot(arr, low, high)
  
  # Partition
  pi = partition(arr, low, high, pivot)
  
  # Recursively sort
  quickSort(arr, low, pi - 1)
  quickSort(arr, pi + 1, high)

partition(arr, low, high, pivot):
  i = low
  For j from low to high-1:
    If arr[j] < pivot:
      swap(arr[i], arr[j])
      i++
  swap(arr[i], arr[high])
  Return i
```

## 13. Optimized Code

```javascript
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partitionOptimized(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partitionOptimized(arr, low, high) {
    // Median of three pivot selection
    const mid = Math.floor((low + high) / 2);
    
    // Sort low, mid, high
    if (arr[mid] < arr[low]) {
        [arr[low], arr[mid]] = [arr[mid], arr[low]];
    }
    if (arr[high] < arr[low]) {
        [arr[low], arr[high]] = [arr[high], arr[low]];
    }
    if (arr[mid] < arr[high]) {
        [arr[mid], arr[high]] = [arr[high], arr[mid]];
    }
    
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// With random pivot
function quickSortRandom(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partitionRandom(arr, low, high);
        quickSortRandom(arr, low, pi - 1);
        quickSortRandom(arr, pi + 1, high);
    }
    return arr;
}

function partitionRandom(arr, low, high) {
    // Random pivot
    const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
    [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];
    
    return partition(arr, low, high);
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Test cases
console.log(quickSort([10, 7, 8, 9, 1, 5]));
// [1, 5, 7, 8, 9, 10]

console.log(quickSort([64, 34, 25, 12, 22, 11, 90]));
// [11, 12, 22, 25, 34, 64, 90]

console.log(quickSort([1, 2, 3]));
// [1, 2, 3]
```

## 14. Dry Run

```
arr = [10, 7, 8, 9, 1, 5]
low=0, high=5

Partition (pivot=5):
i=-1

j=0: 10>5 → skip
j=1: 7>5 → skip
j=2: 8>5 → skip
j=3: 9>5 → skip
j=4: 1<5 → i=0, swap arr[0],arr[4]: [1,7,8,9,10,5]

Place pivot: swap arr[1],arr[5]: [1,5,8,9,10,7]
pi=1

Sort left [1]: base case
Sort right [8,9,10,7]:
  Partition (pivot=7):
    [7,8,9,10]
    pi=0
  Sort [8,9,10]:
    [8,9,10]

Result: [1,5,7,8,9,10]
```

## 15. Time and Space Complexity

**Time:**  
- Best: O(N log N) - balanced partitions
- Average: O(N log N)
- Worst: O(N²) - unbalanced partitions

**Space:**  
- Best: O(log N) - balanced
- Worst: O(N) - unbalanced

## 16. Visualization

```
Partition process:
[10, 7, 8, 9, 1, 5]
              ↑ pivot

Scan and partition:
< pivot: [1]
= pivot: [5]
> pivot: [10, 7, 8, 9]

Recursion tree:
        [10,7,8,9,1,5]
           /      \
       [1]      [10,7,8,9]
                  /      \
              [7,8]      [10]
               / \
             [7] [8]

Height: O(log N) average
```

## 17. Edge Cases

```javascript
// Empty array
quickSort([]); // []

// Single element
quickSort([1]); // [1]

// Two elements
quickSort([2, 1]); // [1, 2]

// Already sorted (worst case for naive)
quickSort([1, 2, 3, 4, 5]); // [1, 2, 3, 4, 5]

// Reverse sorted
quickSort([5, 4, 3, 2, 1]); // [1, 2, 3, 4, 5]

// All duplicates
quickSort([5, 5, 5, 5]); // [5, 5, 5, 5]

// Mix of duplicates
quickSort([3, 1, 3, 2, 1, 3]); // [1, 1, 2, 3, 3, 3]
```

## 18. Key Takeaways

### a. Applications
- General purpose sorting
- Used in std libraries
- External sorting
- Kth element selection

### b. Interview Strategy
- Explain partitioning clearly
- Mention pivot strategies
- Discuss time complexity
- Compare with merge sort

### c. Common Mistakes
- Poor pivot selection
- Wrong partition logic
- Not handling duplicates
- Stack overflow on sorted

### d. Related Problems
- Kth Largest Element
- Sort Colors (3-way partition)
- Partition Array
- QuickSelect

### e. Performance
- In-place sorting
- Cache-friendly
- Practical fastest sort
- Randomization helps

## Summary

✅ **Partition Logic:** Core of QuickSort  
✅ **Pivot Selection:** Critical for performance  
✅ **In-place:** O(1) extra space (excluding stack)  

Happy Coding! 🚀

