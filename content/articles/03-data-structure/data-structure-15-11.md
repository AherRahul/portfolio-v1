---
title: "Max Chunks To Make Sorted Array"
description: "Find maximum chunks for independent sorting. Master partition detection, handle chunk boundaries, and learn optimal chunking strategy."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Max Chunks To Make Sorted

## 2. Problem Statement

Given an array **A** of integers (a permutation of **0 to N-1**), split it into some number of **chunks** such that after sorting each chunk individually and concatenating them, the result equals the sorted array.

Return the **maximum number** of chunks we can make.

**Input:**
- Array `A` (permutation of 0 to N-1)

**Output:**
- Maximum number of chunks

## 3. Examples

```
Input: [1, 0, 2, 3, 4]
Output: 4
Explanation: Split as [1,0] | [2] | [3] | [4]
After sorting: [0,1] | [2] | [3] | [4] = [0,1,2,3,4]

Input: [4, 3, 2, 1, 0]
Output: 1
Explanation: Must sort entire array

Input: [0, 1, 2, 3, 4]
Output: 5
Explanation: Already sorted, each element is chunk
```

## 4. Constraints

- `1 ≤ N ≤ 10`
- A is a permutation of [0, 1, ..., N-1]

## 5. Important Points

**Key Insight:**
```
Can create chunk at index i if:
max(A[0..i]) = i

This means all elements [0..i] are present in first i+1 positions
```

**Strategy:**
- Track maximum seen so far
- When max equals current index, create chunk

## 6. Brute Force Approach

Try all possible chunking combinations and verify each.

## 7. Brute Force Code

```javascript
function maxChunksBrute(arr) {
    let maxChunks = 0;
    
    function isValidChunking(chunks) {
        const sorted = [];
        for (const chunk of chunks) {
            const sortedChunk = [...chunk].sort((a, b) => a - b);
            sorted.push(...sortedChunk);
        }
        
        for (let i = 0; i < sorted.length; i++) {
            if (sorted[i] !== i) return false;
        }
        return true;
    }
    
    function tryChunking(arr, start, chunks) {
        if (start === arr.length) {
            if (isValidChunking(chunks)) {
                maxChunks = Math.max(maxChunks, chunks.length);
            }
            return;
        }
        
        // Try different chunk sizes
        for (let end = start + 1; end <= arr.length; end++) {
            chunks.push(arr.slice(start, end));
            tryChunking(arr, end, chunks);
            chunks.pop();
        }
    }
    
    tryChunking(arr, 0, []);
    return maxChunks;
}
```

## 8. Dry Run

```
arr = [1, 0, 2, 3, 4]

Try chunking:
i=0: max=1, index=0 → 1≠0 (can't chunk)
i=1: max=1, index=1 → 1=1 ✓ (chunk 1)
i=2: max=2, index=2 → 2=2 ✓ (chunk 2)
i=3: max=3, index=3 → 3=3 ✓ (chunk 3)
i=4: max=4, index=4 → 4=4 ✓ (chunk 4)

Chunks: [1,0] | [2] | [3] | [4]
Result: 4
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(2^N * N)  
**Space:** O(N)

## 10. Visualization

```
Array: [1, 0, 2, 3, 4]
Index:  0  1  2  3  4

Track max:
i=0: max=1 → need at least index 1
i=1: max=1 → equals index ✓ chunk!
i=2: max=2 → equals index ✓ chunk!
i=3: max=3 → equals index ✓ chunk!
i=4: max=4 → equals index ✓ chunk!

Chunks: 4
```

## 11. Optimized Approach Description

Track maximum element seen so far. Whenever max equals current index, we can create a chunk because all numbers from 0 to i must be in positions 0 to i.

## 12. Optimized Approach Algorithm

```
1. Initialize max = -1, chunks = 0
2. For i from 0 to N-1:
   - max = Math.max(max, A[i])
   - If max = i:
       chunks++
3. Return chunks
```

## 13. Optimized Code

```javascript
function maxChunks(arr) {
    let max = -1;
    let chunks = 0;
    
    for (let i = 0; i < arr.length; i++) {
        max = Math.max(max, arr[i]);
        
        // If max equals index, we can chunk here
        if (max === i) {
            chunks++;
        }
    }
    
    return chunks;
}

// Test cases
console.log(maxChunks([1, 0, 2, 3, 4])); // 4
console.log(maxChunks([4, 3, 2, 1, 0])); // 1
console.log(maxChunks([0, 1, 2, 3, 4])); // 5
console.log(maxChunks([2, 0, 1])); // 1
console.log(maxChunks([1, 2, 0, 3])); // 2
```

## 14. Dry Run

```
arr = [1, 0, 2, 3, 4]
max = -1, chunks = 0

i=0: arr[0]=1
  max = max(−1, 1) = 1
  max(1) ≠ i(0) → no chunk

i=1: arr[1]=0
  max = max(1, 0) = 1
  max(1) = i(1) → chunks=1

i=2: arr[2]=2
  max = max(1, 2) = 2
  max(2) = i(2) → chunks=2

i=3: arr[3]=3
  max = max(2, 3) = 3
  max(3) = i(3) → chunks=3

i=4: arr[4]=4
  max = max(3, 4) = 4
  max(4) = i(4) → chunks=4

Result: 4
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(1)

## 16. Visualization

```
Array: [1, 0, 2, 3, 4]

Position requirements:
0 must be in positions 0-0 ✗ (at position 1)
0,1 must be in positions 0-1 ✓ → CHUNK
2 must be in positions 0-2 ✓ → CHUNK
3 must be in positions 0-3 ✓ → CHUNK
4 must be in positions 0-4 ✓ → CHUNK

Visual:
[1, 0] | [2] | [3] | [4]
  ↓      ↓     ↓     ↓
[0, 1] | [2] | [3] | [4] ✓

4 chunks maximum
```

## 17. Edge Cases

```javascript
// Single element
maxChunks([0]); // 1

// Already sorted
maxChunks([0, 1, 2, 3]); // 4

// Reverse sorted
maxChunks([3, 2, 1, 0]); // 1

// Two elements swapped
maxChunks([1, 0]); // 1

// Partially sorted
maxChunks([0, 2, 1, 3]); // 2

// Complex pattern
maxChunks([2, 0, 1, 4, 3]); // 2
// [2,0,1] | [4,3]
```

## 18. Key Takeaways

### a. Applications
- Data partitioning
- Parallel sorting
- Chunk-based processing
- Array segmentation

### b. Interview Strategy
- Explain max = index condition
- Walk through example
- Mention O(N) efficiency
- Handle edge cases

### c. Common Mistakes
- Not tracking maximum correctly
- Wrong chunk condition
- Off-by-one errors
- Not handling single element

### d. Related Problems
- Max Chunks II (with duplicates)
- Split Array Largest Sum
- Partition Labels
- Divide Array in Sets of K

### e. Performance
- O(N) optimal solution
- Single pass through array
- Constant space
- Greedy approach

## Summary

✅ **Max Tracking:** Track maximum element seen  
✅ **Chunk Condition:** max = current index  
✅ **Greedy Optimal:** Maximize chunks greedily  

Happy Coding! 🚀

