---
title: "Distinct Numbers in Window using Hashing"
description: "Count distinct elements in every window of size K. Master sliding window with hash map, handle window transitions efficiently, and learn the frequency tracking pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Distinct Numbers in Window

## 2. Problem Statement

You are given an array **A** of **N** integers and an integer **B**. Find and return an array of **distinct numbers** in all windows of size **B**.

Return an array of size **(N - B + 1)** where each element represents the count of distinct elements in that window.

**Input:**
- Array `A` of size N
- Integer `B` (window size)

**Output:**
- Array of distinct counts

## 3. Examples

```
Input: A = [1, 2, 1, 3, 4, 3], B = 3
Output: [2, 3, 3, 2]
Explanation:
  [1,2,1] → 2 distinct
  [2,1,3] → 3 distinct
  [1,3,4] → 3 distinct
  [3,4,3] → 2 distinct

Input: A = [1, 1, 2, 2], B = 1
Output: [1, 1, 1, 1]
Explanation: Each window has 1 element

Input: A = [1, 2, 3, 4, 5], B = 3
Output: [3, 3, 3]
Explanation: All windows have 3 distinct elements
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `1 ≤ B ≤ N`
- `1 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Sliding Window Pattern:**
```
1. Build initial window
2. Slide: Remove left, Add right
3. Track frequency with map
```

**Key Operations:**
- Add element: Increment frequency
- Remove element: Decrement frequency, delete if 0

## 6. Brute Force Approach

For each window, use a Set to count distinct elements.

## 7. Brute Force Code

```javascript
function distinctInWindowBrute(A, B) {
    const result = [];
    
    for (let i = 0; i <= A.length - B; i++) {
        const window = new Set();
        for (let j = i; j < i + B; j++) {
            window.add(A[j]);
        }
        result.push(window.size);
    }
    
    return result;
}
```

## 8. Dry Run

```
A = [1, 2, 1, 3, 4, 3], B = 3

Window [1,2,1]: Set{1,2} → size=2
Window [2,1,3]: Set{2,1,3} → size=3
Window [1,3,4]: Set{1,3,4} → size=3
Window [3,4,3]: Set{3,4} → size=2

Result: [2, 3, 3, 2]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N * B)  
**Space:** O(B)

## 10. Visualization

```
Array: [1, 2, 1, 3, 4, 3]
B = 3

[1, 2, 1] → {1, 2} = 2
   [2, 1, 3] → {2, 1, 3} = 3
      [1, 3, 4] → {1, 3, 4} = 3
         [3, 4, 3] → {3, 4} = 2
```

## 11. Optimized Approach Description

Use sliding window with frequency map. Build initial window, then slide by removing leftmost element and adding next element. Track size of map (distinct count).

## 12. Optimized Approach Algorithm

```
1. Build frequency map for first window
2. Add map.size to result
3. For i from B to N-1:
   - Remove A[i-B]: decrement freq, delete if 0
   - Add A[i]: increment freq
   - Add map.size to result
4. Return result
```

## 13. Optimized Code

```javascript
function distinctInWindow(A, B) {
    const result = [];
    const freqMap = new Map();
    
    // Build first window
    for (let i = 0; i < B; i++) {
        freqMap.set(A[i], (freqMap.get(A[i]) || 0) + 1);
    }
    result.push(freqMap.size);
    
    // Slide window
    for (let i = B; i < A.length; i++) {
        // Remove leftmost element of previous window
        const leftElement = A[i - B];
        freqMap.set(leftElement, freqMap.get(leftElement) - 1);
        if (freqMap.get(leftElement) === 0) {
            freqMap.delete(leftElement);
        }
        
        // Add new element
        freqMap.set(A[i], (freqMap.get(A[i]) || 0) + 1);
        
        result.push(freqMap.size);
    }
    
    return result;
}

// Test cases
console.log(distinctInWindow([1, 2, 1, 3, 4, 3], 3)); // [2, 3, 3, 2]
console.log(distinctInWindow([1, 1, 2, 2], 1)); // [1, 1, 1, 1]
console.log(distinctInWindow([1, 2, 3, 4, 5], 3)); // [3, 3, 3]
```

## 14. Dry Run

```
A = [1, 2, 1, 3, 4, 3], B = 3
freqMap = {}, result = []

Build first window (i=0 to 2):
  freqMap = {1:2, 2:1}
  result = [2]

Slide (i=3):
  Remove A[0]=1: freqMap = {1:1, 2:1}
  Add A[3]=3: freqMap = {1:1, 2:1, 3:1}
  result = [2, 3]

Slide (i=4):
  Remove A[1]=2: freqMap = {1:1, 3:1}
  Add A[4]=4: freqMap = {1:1, 3:1, 4:1}
  result = [2, 3, 3]

Slide (i=5):
  Remove A[2]=1: freqMap = {3:1, 4:1}
  Add A[5]=3: freqMap = {3:2, 4:1}
  result = [2, 3, 3, 2]
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(min(N, B))

## 16. Visualization

```
Window transitions:
[1, 2, 1] | 3, 4, 3  →  distinct: 2
   [2, 1, 3] | 4, 3  →  distinct: 3
      [1, 3, 4] | 3  →  distinct: 3
         [3, 4, 3]  →  distinct: 2

Frequency map tracks counts:
{1:2, 2:1} → size=2
{2:1, 1:1, 3:1} → size=3
{1:1, 3:1, 4:1} → size=3
{3:2, 4:1} → size=2
```

## 17. Edge Cases

```javascript
// Window size = 1
distinctInWindow([1, 1, 2, 2], 1); // [1, 1, 1, 1]

// Window size = array size
distinctInWindow([1, 2, 3], 3); // [3]

// All same elements
distinctInWindow([5, 5, 5, 5], 2); // [1, 1, 1]

// All distinct
distinctInWindow([1, 2, 3, 4], 2); // [2, 2, 2]
```

## 18. Key Takeaways

### a. Applications
- Stream processing
- Data analysis
- Moving window statistics

### b. Interview Strategy
- Use frequency map, not set
- Carefully handle removals
- Delete when frequency = 0

### c. Common Mistakes
- Not deleting zero-frequency entries
- Wrong window boundaries
- Using set instead of map

### d. Related Problems
- Max Sum Subarray of Size K
- Longest Substring K Distinct
- Sliding Window Maximum

### e. Performance
- O(N) optimal solution
- Efficient frequency tracking

## Summary

✅ **Sliding Window:** Efficient window processing  
✅ **Frequency Map:** Track element counts  
✅ **Delete Zero Entries:** Keep map size accurate  

Happy Coding! 🚀

