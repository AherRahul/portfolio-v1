---
title: "Shaggy and Distances using Hashing"
description: "Find minimum distance between same elements. Master distance tracking with hash maps, handle multiple occurrences efficiently, and learn window-based distance patterns."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Shaggy and Distances

## 2. Problem Statement

Shaggy has an array **A** consisting of **N** elements. He wants to find the **minimum distance** between two elements that have the same value. Distance is defined as **|i - j|** where **i** and **j** are indices of the two elements.

Return **-1** if no such pair exists.

**Input:**
- Array `A` of size N

**Output:**
- Minimum distance or -1

## 3. Examples

```
Input: A = [7, 1, 3, 4, 1, 7]
Output: 3
Explanation: Distance between 1's = |4-1| = 3

Input: A = [1, 1]
Output: 1
Explanation: Distance = |1-0| = 1

Input: A = [1, 2, 3, 4, 5]
Output: -1
Explanation: No duplicate elements
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `1 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Distance Formula:**
```
Distance = |current_index - previous_index|
```

**Strategy:**
- Track last seen index for each element
- Update minimum distance on duplicate
- Return -1 if no duplicates

## 6. Brute Force Approach

Check all pairs and find minimum distance between same elements.

## 7. Brute Force Code

```javascript
function shaggyDistancesBrute(A) {
    let minDist = Infinity;
    
    for (let i = 0; i < A.length; i++) {
        for (let j = i + 1; j < A.length; j++) {
            if (A[i] === A[j]) {
                minDist = Math.min(minDist, j - i);
            }
        }
    }
    
    return minDist === Infinity ? -1 : minDist;
}
```

## 8. Dry Run

```
A = [7, 1, 3, 4, 1, 7]

i=0 (7): j=5 (7) → dist=5
i=1 (1): j=4 (1) → dist=3

Minimum: 3
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(1)

## 10. Visualization

```
Array: [7, 1, 3, 4, 1, 7]
Index:  0  1  2  3  4  5

7 appears at: 0, 5 → distance = 5
1 appears at: 1, 4 → distance = 3 ✓ (minimum)
```

## 11. Optimized Approach Description

Use hash map to track last seen index for each element. On encountering duplicate, calculate distance and update minimum.

## 12. Optimized Approach Algorithm

```
1. Initialize lastIndex map and minDist = Infinity
2. For each element at index i:
   - If element seen before:
       distance = i - lastIndex[element]
       minDist = min(minDist, distance)
   - Update lastIndex[element] = i
3. Return minDist if found, else -1
```

## 13. Optimized Code

```javascript
function shaggyDistances(A) {
    const lastIndex = new Map();
    let minDist = Infinity;
    
    for (let i = 0; i < A.length; i++) {
        if (lastIndex.has(A[i])) {
            const dist = i - lastIndex.get(A[i]);
            minDist = Math.min(minDist, dist);
        }
        lastIndex.set(A[i], i);
    }
    
    return minDist === Infinity ? -1 : minDist;
}

// Test cases
console.log(shaggyDistances([7, 1, 3, 4, 1, 7])); // 3
console.log(shaggyDistances([1, 1])); // 1
console.log(shaggyDistances([1, 2, 3, 4, 5])); // -1
console.log(shaggyDistances([2, 5, 3, 5, 1, 2])); // 2
```

## 14. Dry Run

```
A = [7, 1, 3, 4, 1, 7]
lastIndex = {}
minDist = Infinity

i=0, A[0]=7: lastIndex={7:0}
i=1, A[1]=1: lastIndex={7:0, 1:1}
i=2, A[2]=3: lastIndex={7:0, 1:1, 3:2}
i=3, A[3]=4: lastIndex={7:0, 1:1, 3:2, 4:3}
i=4, A[4]=1: dist=4-1=3, minDist=3, lastIndex={7:0, 1:4, 3:2, 4:3}
i=5, A[5]=7: dist=5-0=5, minDist=3, lastIndex={7:5, 1:4, 3:2, 4:3}

Result: 3
```

## 15. Time and Space Complexity

**Time:** O(N) - single pass  
**Space:** O(N) - hash map

## 16. Visualization

```
Index:  0  1  2  3  4  5
Array: [7, 1, 3, 4, 1, 7]

Process:
7 → Store index 0
1 → Store index 1
3 → Store index 2
4 → Store index 3
1 → Found! Distance = 4-1 = 3 ✓
7 → Found! Distance = 5-0 = 5

Minimum: 3
```

## 17. Edge Cases

```javascript
// All same elements
shaggyDistances([5, 5, 5, 5]); // 1

// No duplicates
shaggyDistances([1, 2, 3]); // -1

// Two elements
shaggyDistances([1, 1]); // 1

// Large gap then small gap
shaggyDistances([1, 2, 3, 4, 5, 1, 1]); // 1
```

## 18. Key Takeaways

### a. Applications
- Duplicate detection
- Distance analysis
- Proximity search

### b. Interview Strategy
- Use last seen index pattern
- Single pass solution
- Handle no duplicates case

### c. Common Mistakes
- Not tracking last index
- Wrong distance calculation
- Forgetting -1 return

### d. Related Problems
- Remove Duplicates
- Contains Duplicate II
- Repeated DNA Sequences

### e. Performance
- O(N) optimal
- Space efficient tracking

## Summary

✅ **Last Index Tracking:** Efficient duplicate detection  
✅ **Single Pass:** O(N) solution  
✅ **Distance Calculation:** Current - Last Index  

Happy Coding! 🚀

