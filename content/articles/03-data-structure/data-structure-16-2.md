---
title: "Find Peak Element using Binary Search"
description: "Find peak element in array using binary search. Master divide-and-conquer on unsorted data, handle boundary conditions, and achieve O(log N) solution."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Find a Peak Element

## 2. Problem Statement

A **peak element** is an element that is **strictly greater** than its neighbors. Given an array of integers **A**, find a peak element and return its **index**.

- Assume `A[-1] = A[N] = -∞` (elements outside are negative infinity)
- Array may contain multiple peaks, return any one
- Array is not necessarily sorted

**Input:**
- Array `A` of N integers

**Output:**
- Index of any peak element

## 3. Examples

```
Input: [1, 2, 3, 1]
Output: 2
Explanation: 3 is peak (3 > 2 and 3 > 1)

Input: [1, 2, 1, 3, 5, 6, 4]
Output: 5
Explanation: 6 is peak (multiple peaks possible, can return 1 or 5)

Input: [1, 2, 3, 4, 5]
Output: 4
Explanation: 5 is peak (last element)
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `-2^31 ≤ A[i] ≤ 2^31 - 1`

## 5. Important Points

**Peak Definition:**
```
A[i] > A[i-1] and A[i] > A[i+1]
```

**Key Insights:**
- Array always has at least one peak
- Can use binary search on unsorted array
- Move toward higher side

## 6. Brute Force Approach

Linear scan to find any element greater than neighbors.

## 7. Brute Force Code

```javascript
function findPeakBrute(A) {
    const n = A.length;
    
    // Single element
    if (n === 1) return 0;
    
    // Check first element
    if (A[0] > A[1]) return 0;
    
    // Check last element
    if (A[n-1] > A[n-2]) return n-1;
    
    // Check middle elements
    for (let i = 1; i < n - 1; i++) {
        if (A[i] > A[i-1] && A[i] > A[i+1]) {
            return i;
        }
    }
    
    return -1;
}
```

## 8. Dry Run

```
A = [1, 2, 3, 1]

i=0: 1 > 2? No
i=1: 2 > 1 and 2 > 3? No
i=2: 3 > 2 and 3 > 1? Yes ✓

Return: 2
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N)  
**Space:** O(1)

## 10. Visualization

```
Array: [1, 2, 3, 1]

Graph:
  3  ← peak
 / \
2   1
|
1

Peak at index 2
```

## 11. Optimized Approach Description

Use binary search. At each step:
- If `A[mid] < A[mid+1]`: peak must be on right (move left=mid+1)
- Else: peak is either mid or on left (move right=mid)

## 12. Optimized Approach Algorithm

```
1. left = 0, right = N-1
2. While left < right:
   - mid = (left + right) / 2
   - If A[mid] < A[mid+1]:
       left = mid + 1  // Peak on right
   - Else:
       right = mid  // Peak is mid or left
3. Return left (or right, they're equal)
```

## 13. Optimized Code

```javascript
function findPeak(A) {
    let left = 0;
    let right = A.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // If mid < mid+1, peak is on right
        if (A[mid] < A[mid + 1]) {
            left = mid + 1;
        } else {
            // Peak is mid or on left
            right = mid;
        }
    }
    
    return left;
}

// Alternative: Check both neighbors explicitly
function findPeakExplicit(A) {
    const n = A.length;
    
    if (n === 1) return 0;
    if (A[0] > A[1]) return 0;
    if (A[n-1] > A[n-2]) return n - 1;
    
    let left = 1;
    let right = n - 2;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Check if mid is peak
        if (A[mid] > A[mid-1] && A[mid] > A[mid+1]) {
            return mid;
        }
        
        // Move toward higher side
        if (A[mid] < A[mid+1]) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Test cases
console.log(findPeak([1, 2, 3, 1])); // 2
console.log(findPeak([1, 2, 1, 3, 5, 6, 4])); // 1 or 5
console.log(findPeak([1, 2, 3, 4, 5])); // 4
console.log(findPeak([5, 4, 3, 2, 1])); // 0
```

## 14. Dry Run

```
A = [1, 2, 1, 3, 5, 6, 4]
left=0, right=6

Iteration 1:
mid=3, A[3]=3
A[3]=3 < A[4]=5 → left=4

Iteration 2:
left=4, right=6
mid=5, A[5]=6
A[5]=6 > A[6]=4 → right=5

Iteration 3:
left=4, right=5
mid=4, A[4]=5
A[4]=5 < A[5]=6 → left=5

left=right=5 → return 5
```

## 15. Time and Space Complexity

**Time:** O(log N)  
**Space:** O(1)

## 16. Visualization

```
Array: [1, 2, 1, 3, 5, 6, 4]

        6  ← peak at index 5
       /\
      5  4
     /
    3
   / \
  2   1
 /
1

Binary search path:
Start: [1,2,1,3,5,6,4]
          ↑ mid=3, go right
Right: [5,6,4]
          ↑ mid=5, check neighbors
Peak found at 5!
```

## 17. Edge Cases

```javascript
// Single element
findPeak([1]); // 0

// Two elements ascending
findPeak([1, 2]); // 1

// Two elements descending
findPeak([2, 1]); // 0

// All ascending
findPeak([1, 2, 3, 4]); // 3

// All descending
findPeak([4, 3, 2, 1]); // 0

// Multiple peaks
findPeak([1, 3, 2, 4, 1]); // 1 or 3

// Plateau (not in problem definition)
// If equals allowed: [1, 2, 2, 1]
```

## 18. Key Takeaways

### a. Applications
- Signal processing
- Image processing (2D peaks)
- Data analysis
- Optimization problems

### b. Interview Strategy
- Explain binary search on unsorted array
- Mention multiple peaks possible
- Discuss boundary conditions
- Prove correctness

### c. Common Mistakes
- Not handling boundaries
- Wrong comparison logic
- Infinite loop with wrong updates
- Not considering multiple peaks

### d. Related Problems
- Find Peak Element II (2D)
- Mountain Array
- Local Minimum
- Bitonic Array Peak

### e. Performance
- O(log N) optimal
- Binary search on unsorted array
- Guaranteed to find peak
- Move toward increasing side

## Summary

✅ **Binary Search:** Works on unsorted array  
✅ **Move Uphill:** Always go toward higher neighbor  
✅ **O(log N):** Logarithmic time complexity  

Happy Coding! 🚀

