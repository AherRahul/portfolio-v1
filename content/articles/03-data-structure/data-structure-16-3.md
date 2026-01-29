---
title: "Sorted Insert Position using Binary Search"
description: "Find insert position in sorted array. Master lower bound binary search, handle duplicates, and learn position finding for insertion."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Sorted Insert Position

## 2. Problem Statement

Given a **sorted array** of distinct integers and a **target** value, return the **index** if the target is found. If not, return the index where it would be if it were inserted in order.

**Input:**
- Sorted array `A` of N integers (distinct)
- Target integer `B`

**Output:**
- Index to insert or existing position

## 3. Examples

```
Input: A = [1, 3, 5, 6], B = 5
Output: 2
Explanation: 5 found at index 2

Input: A = [1, 3, 5, 6], B = 2
Output: 1
Explanation: Insert 2 at index 1

Input: A = [1, 3, 5, 6], B = 7
Output: 4
Explanation: Insert 7 at index 4
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i], B ≤ 10^9`
- All elements are distinct

## 5. Important Points

**Lower Bound:**
```
Find smallest index i where A[i] >= target
```

**Cases:**
1. Target exists: return its index
2. Target < all: return 0
3. Target > all: return N
4. Target between: return insert position

## 6. Brute Force Approach

Linear scan to find first element >= target.

## 7. Brute Force Code

```javascript
function searchInsertBrute(A, B) {
    for (let i = 0; i < A.length; i++) {
        if (A[i] >= B) {
            return i;
        }
    }
    return A.length;
}
```

## 8. Dry Run

```
A = [1, 3, 5, 6], B = 2

i=0: A[0]=1 < 2
i=1: A[1]=3 >= 2 → return 1
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N)  
**Space:** O(1)

## 10. Visualization

```
Array: [1, 3, 5, 6]
Target: 2

1 < 2
3 >= 2 ← insert here (index 1)

Result array: [1, 2, 3, 5, 6]
```

## 11. Optimized Approach Description

Use binary search to find the lower bound (first position where element >= target).

## 12. Optimized Approach Algorithm

```
1. left = 0, right = N
2. While left < right:
   - mid = (left + right) / 2
   - If A[mid] < B:
       left = mid + 1
   - Else:
       right = mid
3. Return left
```

## 13. Optimized Code

```javascript
function searchInsert(A, B) {
    let left = 0;
    let right = A.length;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (A[mid] < B) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}

// Test cases
console.log(searchInsert([1, 3, 5, 6], 5)); // 2
console.log(searchInsert([1, 3, 5, 6], 2)); // 1
console.log(searchInsert([1, 3, 5, 6], 7)); // 4
console.log(searchInsert([1, 3, 5, 6], 0)); // 0
```

## 14. Dry Run

```
A = [1, 3, 5, 6], B = 2
left=0, right=4

Iteration 1:
mid=2, A[2]=5
5 >= 2 → right=2

Iteration 2:
mid=1, A[1]=3
3 >= 2 → right=1

Iteration 3:
mid=0, A[0]=1
1 < 2 → left=1

left=right=1 → return 1
```

## 15. Time and Space Complexity

**Time:** O(log N)  
**Space:** O(1)

## 16. Visualization

```
Array: [1, 3, 5, 6]
Target: 2

Binary search:
[1, 3, 5, 6]
    ↑ mid=2, 5>2, search left
[1, 3]
    ↑ mid=1, 3>2, search left
[1]
 ↑ mid=0, 1<2, search right
 
Position: 1
Insert: [1, 2, 3, 5, 6]
```

## 17. Edge Cases

```javascript
// Target at beginning
searchInsert([1, 3, 5], 0); // 0

// Target at end
searchInsert([1, 3, 5], 6); // 3

// Target exists
searchInsert([1, 3, 5], 3); // 1

// Single element array
searchInsert([5], 3); // 0
searchInsert([5], 5); // 0
searchInsert([5], 7); // 1

// Two elements
searchInsert([1, 3], 2); // 1
```

## 18. Key Takeaways

### a. Applications
- Insertion in sorted array
- Lower bound finding
- Database indexing
- Maintaining sorted data

### b. Interview Strategy
- Explain lower bound concept
- Handle all edge cases
- Mention O(log N) efficiency
- Compare with linear search

### c. Common Mistakes
- Wrong boundary conditions
- Not handling equal case
- Off-by-one errors
- Wrong initial right value

### d. Related Problems
- Search Range
- First Bad Version
- Find Smallest Letter
- Ceiling/Floor in Sorted Array

### e. Performance
- O(log N) optimal
- Standard binary search
- Lower bound pattern
- Foundation for many problems

## Summary

✅ **Lower Bound:** First position >= target  
✅ **Binary Search:** O(log N) efficiency  
✅ **Handle All Cases:** Found, not found, boundaries  

Happy Coding! 🚀

