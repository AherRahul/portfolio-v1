---
title: "Count Distinct Elements using Hashing"
description: "Count unique elements in an array using hash sets. Learn to use Set data structure for O(N) time complexity, understand the difference between frequency and uniqueness, and master distinct counting techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "JavaScript Set"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set"
    description: "MDN Set documentation"
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Count Distinct Elements using Hashing

## 2. Problem Statement

Given an array **A** of **N** integers, return the **number of unique elements** in the array.

**Input:**
- Array `A` of size N (1 ≤ N ≤ 10^5)
- Elements can be any integer

**Output:**
- Count of distinct/unique elements

## 3. Examples

### Example 1:
```
Input: A = [1, 2, 3, 2, 1, 4]
Output: 4
Explanation: Unique elements are {1, 2, 3, 4}
```

### Example 2:
```
Input: A = [5, 5, 5, 5]
Output: 1
Explanation: Only one unique element: 5
```

### Example 3:
```
Input: A = [1, 2, 3, 4, 5]
Output: 5
Explanation: All elements are unique
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^9 ≤ A[i] ≤ 10^9`
- Efficient O(N) solution required
- Handle negative numbers
- Handle large numbers

## 5. Important Points

### Set Data Structure

**Set Properties:**
- Stores only **unique** elements
- No duplicates allowed
- **O(1)** average time for add/check
- Automatically handles uniqueness

**Set vs Map:**
- **Set:** Only keys, no values (for uniqueness)
- **Map:** Key-value pairs (for frequency)

### Use Cases
- Remove duplicates
- Check membership
- Find unique elements
- Set operations (union, intersection)

## 6. Brute Force Approach

Count unique by checking each element against all previous elements.

## 7. Brute Force Code

```javascript
function countDistinctBruteForce(A) {
    let count = 0;
    
    for (let i = 0; i < A.length; i++) {
        let isUnique = true;
        
        // Check if element seen before
        for (let j = 0; j < i; j++) {
            if (A[j] === A[i]) {
                isUnique = false;
                break;
            }
        }
        
        if (isUnique) {
            count++;
        }
    }
    
    return count;
}

console.log(countDistinctBruteForce([1, 2, 3, 2, 1, 4])); // 4
```

## 8. Dry Run of Brute Force

```
A = [1, 2, 3, 2, 1, 4]

i=0, A[0]=1: Check previous (none) → Unique! count=1
i=1, A[1]=2: Check [1] → Not found → Unique! count=2
i=2, A[2]=3: Check [1,2] → Not found → Unique! count=3
i=3, A[3]=2: Check [1,2,3] → Found 2! → Not unique
i=4, A[4]=1: Check [1,2,3,2] → Found 1! → Not unique
i=5, A[5]=4: Check [1,2,3,2,1] → Not found → Unique! count=4

Result: 4
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²) - nested loops  
**Space:** O(1) - no extra space

Too slow for large arrays!

## 10. Visualization

```
Array: [1, 2, 3, 2, 1, 4]

Checking each element:
1: NEW → count=1
2: NEW → count=2
3: NEW → count=3
2: SEEN → skip
1: SEEN → skip
4: NEW → count=4

Distinct: 4
```

## 11. Optimized Approach Description

**Use Set data structure:**
- Add all elements to Set
- Set automatically handles duplicates
- Return Set size

**Time:** O(N) - single pass  
**Space:** O(N) - Set storage

## 12. Optimized Approach Algorithm

```
1. Create empty Set
2. For each element in array:
     Add element to Set
3. Return Set.size
```

## 13. Optimized Code

```javascript
/**
 * Count distinct elements using Set
 * @param {number[]} A - Input array
 * @returns {number} - Count of unique elements
 */
function countDistinct(A) {
    const uniqueSet = new Set(A);
    return uniqueSet.size;
}

// Test cases
console.log(countDistinct([1, 2, 3, 2, 1, 4])); // 4
console.log(countDistinct([5, 5, 5, 5])); // 1
console.log(countDistinct([1, 2, 3, 4, 5])); // 5
console.log(countDistinct([])); // 0
console.log(countDistinct([1])); // 1
```

### Alternative: Manual Set Building

```javascript
function countDistinctManual(A) {
    const seen = new Set();
    
    for (const element of A) {
        seen.add(element);
    }
    
    return seen.size;
}
```

### With Negative Numbers

```javascript
function countDistinctAny(A) {
    return new Set(A).size;
}

console.log(countDistinctAny([-1, -1, 0, 1, 1])); // 3
```

## 14. Dry Run of Optimized

```
A = [1, 2, 3, 2, 1, 4]

Initialize Set: set = {}

Add 1: set = {1}
Add 2: set = {1, 2}
Add 3: set = {1, 2, 3}
Add 2: set = {1, 2, 3} (duplicate, ignored)
Add 1: set = {1, 2, 3} (duplicate, ignored)
Add 4: set = {1, 2, 3, 4}

Result: set.size = 4
```

## 15. Time and Space Complexity

**Time:** O(N) - single pass through array  
**Space:** O(K) where K = distinct elements (worst case O(N))

**Comparison:**
- Brute Force: O(N²) time, O(1) space
- Optimized: O(N) time, O(N) space

## 16. Visualization

```
Adding elements to Set:

Array: [1, 2, 3, 2, 1, 4]

Step 1: Add 1
Set: {1}

Step 2: Add 2
Set: {1, 2}

Step 3: Add 3
Set: {1, 2, 3}

Step 4: Add 2 (duplicate!)
Set: {1, 2, 3} ← no change

Step 5: Add 1 (duplicate!)
Set: {1, 2, 3} ← no change

Step 6: Add 4
Set: {1, 2, 3, 4}

Final size: 4
```

## 17. Edge Cases

```javascript
// Empty array
countDistinct([]); // 0

// Single element
countDistinct([5]); // 1

// All same
countDistinct([1, 1, 1, 1]); // 1

// All different
countDistinct([1, 2, 3, 4]); // 4

// Negative numbers
countDistinct([-5, -5, 0, 5]); // 3

// Large numbers
countDistinct([1000000000, 1000000000]); // 1
```

## 18. Key Takeaways

### a. Applications
- Remove duplicates from list
- Count unique users/items
- Database distinct queries
- Data deduplication

### b. Interview Strategy
- Start with Set solution (optimal)
- Explain O(1) add operation
- Mention space tradeoff
- Show one-liner: `new Set(A).size`

### c. Common Mistakes
```javascript
// ❌ Using array includes (O(N²))
const unique = [];
for (const x of A) {
    if (!unique.includes(x)) unique.push(x);
}

// ✓ Using Set (O(N))
const unique = new Set(A);
```

### d. Related Problems
- Remove Duplicates from Sorted Array
- Find First Repeating Element
- Intersection of Two Arrays
- Longest Consecutive Sequence

### e. Performance
- Set operations are O(1) average
- Very efficient for distinct counting
- Better than sorting approach O(N log N)

## Summary

✅ **Set Data Structure:** Perfect for uniqueness  
✅ **O(N) Time:** Single pass solution  
✅ **Simple & Elegant:** One-line solution possible  

Happy Coding! 🚀

