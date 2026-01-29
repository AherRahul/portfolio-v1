---
title: "Single Element in Sorted Array"
description: "Find single non-duplicate element in sorted array. Master XOR and binary search approaches, leverage sorted property, and achieve O(log N) solution."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Single Element in Sorted Array

## 2. Problem Statement

You are given a **sorted array** where every element appears **twice** except for one element which appears **once**. Find that single element.

Your solution must run in **O(log N)** time.

**Input:**
- Sorted array `A` where all elements appear twice except one

**Output:**
- The single element

## 3. Examples

```
Input: [1, 1, 2, 3, 3, 4, 4, 8, 8]
Output: 2

Input: [3, 3, 7, 7, 10, 11, 11]
Output: 10

Input: [1]
Output: 1
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `0 ≤ A[i] ≤ 10^6`
- N is always odd

## 5. Important Points

**Key Observations:**
```
- Before single element: pairs start at even index
- After single element: pairs start at odd index
- Use binary search on index parity
```

**XOR Property:**
```
a ^ a = 0
a ^ 0 = a
```

## 6. Brute Force Approach

XOR all elements (works but O(N)).

## 7. Brute Force Code

```javascript
function singleElementBrute(A) {
    let result = 0;
    for (const num of A) {
        result ^= num;
    }
    return result;
}
```

## 8. Dry Run

```
A = [1, 1, 2, 3, 3]

0 ^ 1 = 1
1 ^ 1 = 0
0 ^ 2 = 2
2 ^ 3 = 1
1 ^ 3 = 2

Return: 2
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N)  
**Space:** O(1)

## 10. Visualization

```
Array: [1, 1, 2, 3, 3, 4, 4]
Pairs:  ✓  ✓  X  ✓  ✓  ✓  ✓
              ↑
        Single element: 2
```

## 11. Optimized Approach Description

Use binary search on index parity:
- If mid is even and A[mid] = A[mid+1]: single is on right
- If mid is even and A[mid] ≠ A[mid+1]: single is on left or at mid
- Similar logic for odd indices

## 12. Optimized Approach Algorithm

```
1. left = 0, right = N-1
2. While left < right:
   - mid = left + (right - left) / 2
   - Make mid even: if mid is odd, mid--
   - If A[mid] = A[mid+1]:
       left = mid + 2  // Single on right
   - Else:
       right = mid  // Single on left or at mid
3. Return A[left]
```

## 13. Optimized Code

```javascript
function singleElement(A) {
    let left = 0;
    let right = A.length - 1;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        
        // Make mid even
        if (mid % 2 === 1) {
            mid--;
        }
        
        // Check if pair is intact
        if (A[mid] === A[mid + 1]) {
            // Single element is on the right
            left = mid + 2;
        } else {
            // Single element is on the left or at mid
            right = mid;
        }
    }
    
    return A[left];
}

// Alternative approach checking parity differently
function singleElementAlt(A) {
    let left = 0;
    let right = A.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Check if mid is the single element
        if (mid > 0 && A[mid] !== A[mid - 1] && 
            mid < A.length - 1 && A[mid] !== A[mid + 1]) {
            return A[mid];
        }
        
        // Determine which half to search
        const isEven = mid % 2 === 0;
        
        if (A[mid] === A[mid - 1]) {
            // Pair starts at mid-1
            if (!isEven) {
                // Normal: left side is complete
                left = mid + 1;
            } else {
                // Disrupted: single is on left
                right = mid - 2;
            }
        } else {
            // Pair starts at mid
            if (isEven) {
                // Normal: left side is complete
                left = mid + 2;
            } else {
                // Disrupted: single is on left
                right = mid - 1;
            }
        }
    }
    
    return A[left];
}

// Test cases
console.log(singleElement([1, 1, 2, 3, 3, 4, 4, 8, 8])); // 2
console.log(singleElement([3, 3, 7, 7, 10, 11, 11])); // 10
console.log(singleElement([1])); // 1
console.log(singleElement([1, 1, 2])); // 2
```

## 14. Dry Run

```
A = [1, 1, 2, 3, 3, 4, 4]
left=0, right=6

Iteration 1:
mid=3 (odd) → make even: mid=2
A[2]=2, A[3]=3
2≠3 → right=2

Iteration 2:
left=0, right=2
mid=1 (odd) → make even: mid=0
A[0]=1, A[1]=1
1=1 → left=2

left=right=2 → return A[2]=2
```

## 15. Time and Space Complexity

**Time:** O(log N)  
**Space:** O(1)

## 16. Visualization

```
Array: [1, 1, 2, 3, 3, 4, 4]
Index:  0  1  2  3  4  5  6

Pairs before single:
[1,1] at [0,1] ✓

Single:
[2] at [2] ✓

Pairs after single:
[3,3] at [3,4] ✗ (starts at odd)
[4,4] at [5,6] ✗ (starts at odd)

Binary search finds disruption point
```

## 17. Edge Cases

```javascript
// Single element
singleElement([1]); // 1

// At beginning
singleElement([1, 2, 2]); // 1

// At end
singleElement([1, 1, 2]); // 2

// In middle
singleElement([1, 1, 2, 3, 3]); // 2

// Large array
singleElement([1, 1, 3, 3, 5, 5, 7, 8, 8]); // 7
```

## 18. Key Takeaways

### a. Applications
- Duplicate detection
- Data integrity
- Error detection
- Signal processing

### b. Interview Strategy
- Explain XOR approach (O(N))
- Then optimize to binary search
- Discuss index parity
- Handle edge cases

### c. Common Mistakes
- Not leveraging sorted property
- Wrong parity logic
- Boundary issues
- Not handling odd/even mid

### d. Related Problems
- Single Number
- Single Number II
- Single Number III
- Find the Duplicate

### e. Performance
- O(log N) required
- Binary search on structure
- Clever use of parity
- Better than XOR for sorted

## Summary

✅ **Index Parity:** Key to binary search  
✅ **Pair Disruption:** Find where pattern breaks  
✅ **O(log N):** Optimal for sorted array  

Happy Coding! 🚀

