---
title: "Unique Elements in Array"
description: "Find count of unique elements efficiently. Master hash set for uniqueness, compare with sorting approach, and handle large datasets optimally."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Count Unique Elements

## 2. Problem Statement

Given an array of integers **A**, return the **number of unique elements** in the array.

**Input:**
- Array `A` of N integers

**Output:**
- Count of unique elements

## 3. Examples

```
Input: [1, 2, 3, 2, 1]
Output: 3
Explanation: Unique elements are 1, 2, 3

Input: [5, 5, 5, 5]
Output: 1
Explanation: Only one unique element

Input: [1, 2, 3, 4, 5]
Output: 5
Explanation: All elements are unique
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Uniqueness:**
```
Element appears one or more times, count it once
```

**Two Main Approaches:**
1. Hash Set: O(N) time, O(N) space
2. Sorting: O(N log N) time, O(1) space

## 6. Brute Force Approach

Compare each element with all others to check uniqueness.

## 7. Brute Force Code

```javascript
function countUniqueBrute(arr) {
    const unique = [];
    
    for (let i = 0; i < arr.length; i++) {
        let isUnique = true;
        
        for (let j = 0; j < unique.length; j++) {
            if (arr[i] === unique[j]) {
                isUnique = false;
                break;
            }
        }
        
        if (isUnique) {
            unique.push(arr[i]);
        }
    }
    
    return unique.length;
}
```

## 8. Dry Run

```
arr = [1, 2, 3, 2, 1]
unique = []

Process 1: not in unique → [1]
Process 2: not in unique → [1, 2]
Process 3: not in unique → [1, 2, 3]
Process 2: found in unique → skip
Process 1: found in unique → skip

Result: 3
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(N)

## 10. Visualization

```
Array: [1, 2, 3, 2, 1]

Check each element:
1 → new → count=1
2 → new → count=2
3 → new → count=3
2 → seen → count=3
1 → seen → count=3

Unique count: 3
```

## 11. Optimized Approach Description

**Approach 1 (Hash Set):** Use Set to store unique elements. Set automatically handles duplicates.

**Approach 2 (Sorting):** Sort array, then count consecutive different elements.

## 12. Optimized Approach Algorithm

```
Approach 1: Hash Set
1. Create empty Set
2. Add all elements to Set
3. Return Set.size

Approach 2: Sorting
1. Sort array
2. Initialize count = 1
3. For i from 1 to N-1:
   - If arr[i] != arr[i-1]: count++
4. Return count
```

## 13. Optimized Code

```javascript
// Approach 1: Hash Set (Most efficient)
function countUnique(arr) {
    return new Set(arr).size;
}

// Approach 2: Sorting (Space efficient)
function countUniqueSorting(arr) {
    if (arr.length === 0) return 0;
    
    arr.sort((a, b) => a - b);
    let count = 1;
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1]) {
            count++;
        }
    }
    
    return count;
}

// Approach 3: Manual Set implementation
function countUniqueManual(arr) {
    const seen = new Map();
    
    for (const num of arr) {
        seen.set(num, true);
    }
    
    return seen.size;
}

// Test cases
console.log(countUnique([1, 2, 3, 2, 1])); // 3
console.log(countUnique([5, 5, 5, 5])); // 1
console.log(countUnique([1, 2, 3, 4, 5])); // 5
console.log(countUnique([])); // 0
console.log(countUnique([1])); // 1
```

## 14. Dry Run

```
Approach 1: Hash Set
arr = [1, 2, 3, 2, 1]

Add to Set:
Set = {1}
Set = {1, 2}
Set = {1, 2, 3}
Set = {1, 2, 3} (2 already exists)
Set = {1, 2, 3} (1 already exists)

Result: Set.size = 3

Approach 2: Sorting
arr = [1, 2, 3, 2, 1]
After sort: [1, 1, 2, 2, 3]
count = 1

i=1: arr[1]=1 = arr[0]=1 → skip
i=2: arr[2]=2 ≠ arr[1]=1 → count=2
i=3: arr[3]=2 = arr[2]=2 → skip
i=4: arr[4]=3 ≠ arr[3]=2 → count=3

Result: 3
```

## 15. Time and Space Complexity

**Hash Set Approach:**
- Time: O(N)
- Space: O(N)

**Sorting Approach:**
- Time: O(N log N)
- Space: O(1) or O(N) depending on sort

## 16. Visualization

```
Array: [1, 2, 3, 2, 1]

Hash Set approach:
1 → Set: {1}
2 → Set: {1, 2}
3 → Set: {1, 2, 3}
2 → Already in set
1 → Already in set

Final Set size: 3

Sorting approach:
[1, 2, 3, 2, 1]
      ↓ sort
[1, 1, 2, 2, 3]
 ↑  =  ↑  =  ↑
    skip   skip

Count transitions: 3
```

## 17. Edge Cases

```javascript
// Empty array
countUnique([]); // 0

// Single element
countUnique([5]); // 1

// All same
countUnique([1, 1, 1, 1]); // 1

// All unique
countUnique([1, 2, 3, 4]); // 4

// Two elements same
countUnique([1, 1]); // 1

// Two elements different
countUnique([1, 2]); // 2

// Negative numbers
countUnique([-1, -2, -1, 0, 1]); // 4

// Large range
countUnique([1, 1000000, 1, -1000000]); // 3
```

## 18. Key Takeaways

### a. Applications
- Data deduplication
- Cardinality estimation
- Database operations
- Statistics computation

### b. Interview Strategy
- Use Set for simplicity
- Mention sorting alternative
- Discuss tradeoffs
- Handle empty array

### c. Common Mistakes
- Not handling empty array
- Wrong duplicate detection
- Inefficient O(N²) approach
- Modifying original array

### d. Related Problems
- Remove Duplicates
- Find Duplicate
- Contains Duplicate
- Intersection of Arrays

### e. Performance
- Set approach: Optimal O(N)
- One-liner in JavaScript
- No sorting overhead
- Handles all data types

## Summary

✅ **Use Set:** Simplest and most efficient  
✅ **O(N) Time:** Optimal complexity  
✅ **Built-in Support:** Leverage Set data structure  

Happy Coding! 🚀

