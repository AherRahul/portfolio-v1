---
title: "Merge Two Sorted Arrays"
description: "Efficiently merge two sorted arrays into one. Master the two-pointer technique, handle different array sizes, and learn the foundation of merge sort."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Merge Two Sorted Arrays

## 2. Problem Statement

Given two **sorted arrays** A and B of sizes M and N respectively, merge them into a **single sorted array**.

**Input:**
- Array `A` of size M (sorted)
- Array `B` of size N (sorted)

**Output:**
- Merged sorted array of size M+N

## 3. Examples

```
Input: A = [1, 3, 5], B = [2, 4, 6]
Output: [1, 2, 3, 4, 5, 6]

Input: A = [1, 5, 9], B = [2, 3, 4, 10]
Output: [1, 2, 3, 4, 5, 9, 10]

Input: A = [1, 2], B = []
Output: [1, 2]
```

## 4. Constraints

- `0 ≤ M, N ≤ 10^6`
- `-10^9 ≤ A[i], B[i] ≤ 10^9`
- Both arrays are sorted in ascending order

## 5. Important Points

**Key Strategy:**
```
Use two pointers to compare elements
Always pick smaller element
```

**Properties:**
- Linear time complexity
- Foundation of merge sort
- Stable merge

## 6. Brute Force Approach

Concatenate arrays and sort the result.

## 7. Brute Force Code

```javascript
function mergeBrute(A, B) {
    return [...A, ...B].sort((a, b) => a - b);
}
```

## 8. Dry Run

```
A = [1, 3, 5]
B = [2, 4, 6]

Concatenate: [1, 3, 5, 2, 4, 6]
Sort: [1, 2, 3, 4, 5, 6]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O((M+N) log(M+N))  
**Space:** O(M+N)

## 10. Visualization

```
A = [1, 3, 5]
B = [2, 4, 6]

After concatenation:
[1, 3, 5, 2, 4, 6]
        ↓ sort
[1, 2, 3, 4, 5, 6]
```

## 11. Optimized Approach Description

Use two-pointer technique. Compare elements at both pointers, add smaller to result, move that pointer forward.

## 12. Optimized Approach Algorithm

```
1. Initialize i=0, j=0, result=[]
2. While i < M and j < N:
   - If A[i] <= B[j]:
       Add A[i] to result
       i++
   - Else:
       Add B[j] to result
       j++
3. Add remaining elements from A (if any)
4. Add remaining elements from B (if any)
5. Return result
```

## 13. Optimized Code

```javascript
function mergeSortedArrays(A, B) {
    const result = [];
    let i = 0, j = 0;
    
    // Compare and merge
    while (i < A.length && j < B.length) {
        if (A[i] <= B[j]) {
            result.push(A[i]);
            i++;
        } else {
            result.push(B[j]);
            j++;
        }
    }
    
    // Add remaining elements from A
    while (i < A.length) {
        result.push(A[i]);
        i++;
    }
    
    // Add remaining elements from B
    while (j < B.length) {
        result.push(B[j]);
        j++;
    }
    
    return result;
}

// Test cases
console.log(mergeSortedArrays([1, 3, 5], [2, 4, 6]));
// [1, 2, 3, 4, 5, 6]

console.log(mergeSortedArrays([1, 5, 9], [2, 3, 4, 10]));
// [1, 2, 3, 4, 5, 9, 10]

console.log(mergeSortedArrays([1, 2], []));
// [1, 2]

console.log(mergeSortedArrays([], [3, 4]));
// [3, 4]
```

## 14. Dry Run

```
A = [1, 3, 5], B = [2, 4, 6]
i=0, j=0, result=[]

Compare A[0]=1, B[0]=2:
  1 < 2 → result=[1], i=1

Compare A[1]=3, B[0]=2:
  3 > 2 → result=[1,2], j=1

Compare A[1]=3, B[1]=4:
  3 < 4 → result=[1,2,3], i=2

Compare A[2]=5, B[1]=4:
  5 > 4 → result=[1,2,3,4], j=2

Compare A[2]=5, B[2]=6:
  5 < 6 → result=[1,2,3,4,5], i=3

i=3 (out of bounds)
Add remaining B: result=[1,2,3,4,5,6]

Result: [1, 2, 3, 4, 5, 6]
```

## 15. Time and Space Complexity

**Time:** O(M + N)  
**Space:** O(M + N) for result array

## 16. Visualization

```
A: [1, 3, 5]
    ↑
B: [2, 4, 6]
    ↑
Result: []

Step 1: 1 < 2 → [1]
A: [1, 3, 5]
       ↑
B: [2, 4, 6]
    ↑

Step 2: 3 > 2 → [1, 2]
A: [1, 3, 5]
       ↑
B: [2, 4, 6]
       ↑

Step 3: 3 < 4 → [1, 2, 3]
A: [1, 3, 5]
          ↑
B: [2, 4, 6]
       ↑

Step 4: 5 > 4 → [1, 2, 3, 4]
A: [1, 3, 5]
          ↑
B: [2, 4, 6]
          ↑

Step 5: 5 < 6 → [1, 2, 3, 4, 5]
A: [1, 3, 5] ✓
B: [2, 4, 6]
          ↑

Step 6: Add remaining → [1, 2, 3, 4, 5, 6]
```

## 17. Edge Cases

```javascript
// Empty arrays
mergeSortedArrays([], []); // []
mergeSortedArrays([1, 2], []); // [1, 2]
mergeSortedArrays([], [3, 4]); // [3, 4]

// Single elements
mergeSortedArrays([1], [2]); // [1, 2]

// All elements in A smaller
mergeSortedArrays([1, 2], [5, 6]); // [1, 2, 5, 6]

// All elements in B smaller
mergeSortedArrays([5, 6], [1, 2]); // [1, 2, 5, 6]

// Duplicates
mergeSortedArrays([1, 3, 3], [2, 3, 4]); // [1, 2, 3, 3, 3, 4]

// Different sizes
mergeSortedArrays([1, 5, 9, 10, 15], [2, 3]); // [1, 2, 3, 5, 9, 10, 15]
```

## 18. Key Takeaways

### a. Applications
- Merge sort algorithm
- External sorting
- Database operations
- File merging

### b. Interview Strategy
- Mention two-pointer technique
- Handle edge cases (empty arrays)
- Explain time complexity
- Discuss stability

### c. Common Mistakes
- Forgetting remaining elements
- Wrong pointer increment
- Not handling empty arrays
- Using wrong comparison

### d. Related Problems
- Merge Sorted Lists
- Merge K Sorted Arrays
- Merge Intervals
- Sort Colors

### e. Performance
- Optimal O(M+N) solution
- Linear time complexity
- Single pass through both arrays

## Summary

✅ **Two Pointers:** Compare and pick smaller  
✅ **Linear Time:** O(M+N) optimal  
✅ **Handle Remainders:** Add leftover elements  

Happy Coding! 🚀

