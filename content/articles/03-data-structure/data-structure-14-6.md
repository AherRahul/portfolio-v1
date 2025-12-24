---
title: "Common Elements Between Two Arrays"
description: "Find common elements between two arrays using hash maps. Learn intersection operations, handle duplicate counting, and master the technique of finding shared elements with proper frequency handling."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Common Elements Between Two Arrays

## 2. Problem Statement

Given two integer arrays **A** and **B** of size **N** and **M** respectively, your task is to find **all the common elements** in both arrays.

**NOTE:**
1. Each element in the result should appear **as many times as it appears in both arrays**
2. The result can be in any order

**Input:**
- Array `A` of size N
- Array `B` of size M

**Output:**
- Array of common elements with proper frequency

## 3. Examples

### Example 1:
```
Input: 
A = [1, 2, 2, 1]
B = [2, 2]

Output: [2, 2]
Explanation: 2 appears twice in both arrays
```

### Example 2:
```
Input:
A = [4, 9, 5]
B = [9, 4, 9, 8, 4]

Output: [4, 9] or [9, 4]
Explanation: 4 and 9 are common (order doesn't matter)
```

### Example 3:
```
Input:
A = [1, 2, 3]
B = [4, 5, 6]

Output: []
Explanation: No common elements
```

## 4. Constraints

- `1 ≤ N, M ≤ 10^5`
- `-10^9 ≤ A[i], B[i] ≤ 10^9`
- Include duplicates based on frequency
- Order doesn't matter

## 5. Important Points

### Understanding Intersection with Frequency

**Key Rule:** Take minimum frequency from both arrays

**Example:**
```
A = [1, 2, 2, 2, 3]
B = [2, 2, 3, 3, 4]

Frequency in A: {1:1, 2:3, 3:1}
Frequency in B: {2:2, 3:2, 4:1}

Common with frequency:
- 2: min(3, 2) = 2 → [2, 2]
- 3: min(1, 2) = 1 → [3]

Result: [2, 2, 3]
```

### Approaches
1. Hash Map of frequencies
2. Sort and two pointers
3. Use one array as set, check other

## 6. Brute Force Approach

For each element in A, check if it exists in B and hasn't been used.

## 7. Brute Force Code

```javascript
function intersectionBrute(A, B) {
    const result = [];
    const usedB = new Array(B.length).fill(false);
    
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B.length; j++) {
            if (A[i] === B[j] && !usedB[j]) {
                result.push(A[i]);
                usedB[j] = true;
                break;
            }
        }
    }
    
    return result;
}
```

## 8. Dry Run of Brute Force

```
A = [1, 2, 2, 1]
B = [2, 2]

Check A[0]=1: Not in B
Check A[1]=2: Found B[0]=2, mark used
Check A[2]=2: Found B[1]=2, mark used
Check A[3]=1: Not in B

Result: [2, 2]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N × M)  
**Space:** O(M) for used array

## 10. Visualization

```
A = [1, 2, 2, 1]
B = [2, 2]

Match A[1]=2 with B[0]=2 ✓
Match A[2]=2 with B[1]=2 ✓

Common: [2, 2]
```

## 11. Optimized Approach Description

**Use Hash Map for Frequency:**
1. Count frequency of elements in one array
2. For each element in second array, check if in map
3. If found and count > 0, add to result and decrement count

## 12. Optimized Approach Algorithm

```
1. Build frequency map from array A
2. For each element in B:
   a. If element in map and count > 0:
      - Add to result
      - Decrement count in map
3. Return result
```

## 13. Optimized Code

```javascript
function intersection(A, B) {
    const freqA = new Map();
    const result = [];
    
    // Count frequency in A
    for (const num of A) {
        freqA.set(num, (freqA.get(num) || 0) + 1);
    }
    
    // Find common elements
    for (const num of B) {
        if (freqA.has(num) && freqA.get(num) > 0) {
            result.push(num);
            freqA.set(num, freqA.get(num) - 1);
        }
    }
    
    return result;
}

// Test cases
console.log(intersection([1, 2, 2, 1], [2, 2])); // [2, 2]
console.log(intersection([4, 9, 5], [9, 4, 9, 8, 4])); // [9, 4]
console.log(intersection([1, 2, 3], [4, 5, 6])); // []
```

### Alternative: Two Maps

```javascript
function intersectionTwoMaps(A, B) {
    const freqA = new Map();
    const freqB = new Map();
    const result = [];
    
    // Count frequencies
    A.forEach(x => freqA.set(x, (freqA.get(x) || 0) + 1));
    B.forEach(x => freqB.set(x, (freqB.get(x) || 0) + 1));
    
    // Find common with min frequency
    for (const [num, countA] of freqA) {
        if (freqB.has(num)) {
            const minCount = Math.min(countA, freqB.get(num));
            for (let i = 0; i < minCount; i++) {
                result.push(num);
            }
        }
    }
    
    return result;
}
```

## 14. Dry Run of Optimized

```
A = [1, 2, 2, 1]
B = [2, 2]

Step 1: Build frequency map from A
freqA = {1: 2, 2: 2}

Step 2: Process B
Process B[0]=2:
  2 in freqA? Yes, count=2
  Add 2 to result: [2]
  Decrement: freqA = {1: 2, 2: 1}

Process B[1]=2:
  2 in freqA? Yes, count=1
  Add 2 to result: [2, 2]
  Decrement: freqA = {1: 2, 2: 0}

Result: [2, 2]
```

## 15. Time and Space Complexity

**Time:** O(N + M)  
**Space:** O(min(N, M)) for hash map

## 16. Visualization

```
A = [1, 2, 2, 1]
B = [2, 2]

Frequency in A:
┌───┬───┐
│ 1 │ 2 │
│ 2 │ 2 │
└───┴───┘

Process B:
2 → Found! Count 2→1 → Add to result
2 → Found! Count 1→0 → Add to result

Result: [2, 2]
```

## 17. Edge Cases

```javascript
// No common elements
intersection([1, 2], [3, 4]); // []

// All common
intersection([1, 2], [1, 2]); // [1, 2]

// Different frequencies
intersection([1, 1, 1], [1]); // [1]

// Empty arrays
intersection([], [1, 2]); // []
intersection([1, 2], []); // []
```

## 18. Key Takeaways

### a. Applications
- Set intersection
- Data comparison
- Common records finding
- Database joins

### b. Interview Strategy
- Clarify frequency handling
- Use hash map for O(N+M)
- Consider sorting approach O(N log N)
- Handle empty arrays

### c. Common Mistakes
- Not handling frequency correctly
- Not decrementing count
- Adding all occurrences instead of min

### d. Related Problems
- Union of Two Arrays
- Intersection of Multiple Arrays
- Three Sum
- Array Intersection II (LeetCode)

### e. Performance
- Hash map: O(N+M) time
- Sorting: O(N log N + M log M) time
- Choose based on constraints

## Summary

✅ **Frequency matters:** Take minimum from both  
✅ **Hash Map:** O(N+M) solution  
✅ **Decrement counts:** As you find matches  

Happy Coding! 🚀

