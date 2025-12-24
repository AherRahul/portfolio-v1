---
title: "First Repeating Element using Hashing"
description: "Find the first repeating element with smallest index using hash maps. Learn to track element occurrences while maintaining order information, and master the technique of finding first duplicates efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## First Repeating Element using Hashing

## 2. Problem Statement

Given an integer array **A** of size **N**, find the **first repeating element** in it.

The first repeating element is the element that **occurs more than once** and whose **index of the first occurrence is smallest**.

If there is no repeating element, return **-1**.

**Input:**
- Array `A` of size N (1 ≤ N ≤ 10^5)

**Output:**
- The first repeating element, or -1 if none exists

## 3. Examples

### Example 1:
```
Input: A = [10, 5, 3, 4, 3, 5, 6]
Output: 5
Explanation:
- 5 first appears at index 1, repeats at index 5
- 3 first appears at index 2, repeats at index 4
- First occurrence: 5 (index 1) < 3 (index 2)
- Answer: 5
```

### Example 2:
```
Input: A = [6, 10, 5, 4, 9, 120]
Output: -1
Explanation: No element repeats
```

### Example 3:
```
Input: A = [1, 2, 3, 1]
Output: 1
Explanation: 1 repeats, first occurrence at index 0
```

### Example 4:
```
Input: A = [5, 5, 5, 5]
Output: 5
Explanation: 5 repeats, first occurrence at index 0
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `1 ≤ A[i] ≤ 10^6`
- Find element with smallest first occurrence index
- Return -1 if no repeating element

## 5. Important Points

### Understanding "First Repeating"

**Two conditions must be met:**
1. Element must appear **more than once**
2. Among all repeating elements, return one with **smallest first occurrence index**

**Example:**
```
A = [10, 5, 3, 4, 3, 5, 6]
     0   1  2  3  4  5  6  (indices)

Repeating elements:
- 5: first at index 1, repeats at 5
- 3: first at index 2, repeats at 4

Answer: 5 (index 1 < index 2)
```

### Approaches
1. **Brute Force:** Check each element against all following elements
2. **Hash Map:** Track first occurrence and check for repeats
3. **Two-Pass:** Count frequencies, then find first repeating

## 6. Brute Force Approach

For each element, check if it appears again later in the array.

## 7. Brute Force Code

```javascript
function firstRepeatingBruteForce(A) {
    const n = A.length;
    
    for (let i = 0; i < n; i++) {
        // Check if A[i] appears after index i
        for (let j = i + 1; j < n; j++) {
            if (A[i] === A[j]) {
                return A[i];
            }
        }
    }
    
    return -1;
}

console.log(firstRepeatingBruteForce([10, 5, 3, 4, 3, 5, 6])); // 5
console.log(firstRepeatingBruteForce([6, 10, 5, 4, 9, 120])); // -1
```

## 8. Dry Run of Brute Force

```
A = [10, 5, 3, 4, 3, 5, 6]

i=0, A[0]=10:
  Check j=1 to 6: [5,3,4,3,5,6]
  No match found

i=1, A[1]=5:
  Check j=2 to 6: [3,4,3,5,6]
  Match at j=5! A[5]=5
  Return 5 ✓

Result: 5
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²) - nested loops  
**Space:** O(1) - no extra space

## 10. Visualization

```
A = [10, 5, 3, 4, 3, 5, 6]

Check 10: → [5,3,4,3,5,6] → No repeat
Check 5:  → [3,4,3,5,6] → Found 5! ✓

Answer: 5 (first to repeat)
```

## 11. Optimized Approach Description

**Use Hash Map to track occurrences:**

**Two-Pass Approach:**
1. **First pass:** Count frequency of each element
2. **Second pass:** Find first element with frequency > 1

**Time:** O(N)  
**Space:** O(N)

## 12. Optimized Approach Algorithm

```
1. Create frequency map
2. Scan array once, count each element
3. Scan array again from left:
   - If freq[element] > 1, return element
4. If no element found, return -1
```

## 13. Optimized Code

```javascript
/**
 * Find first repeating element
 * @param {number[]} A - Input array
 * @returns {number} - First repeating element or -1
 */
function firstRepeating(A) {
    // Build frequency map
    const freq = new Map();
    
    for (const num of A) {
        freq.set(num, (freq.get(num) || 0) + 1);
    }
    
    // Find first element with frequency > 1
    for (const num of A) {
        if (freq.get(num) > 1) {
            return num;
        }
    }
    
    return -1;
}

// Test cases
console.log(firstRepeating([10, 5, 3, 4, 3, 5, 6])); // 5
console.log(firstRepeating([6, 10, 5, 4, 9, 120])); // -1
console.log(firstRepeating([1, 2, 3, 1])); // 1
console.log(firstRepeating([5, 5, 5, 5])); // 5
```

### Alternative: Single Pass with Set

```javascript
function firstRepeatingSet(A) {
    const seen = new Set();
    let firstRepeating = -1;
    
    // Scan from right to left
    for (let i = A.length - 1; i >= 0; i--) {
        if (seen.has(A[i])) {
            firstRepeating = A[i];
        }
        seen.add(A[i]);
    }
    
    return firstRepeating;
}
```

## 14. Dry Run of Optimized

```
A = [10, 5, 3, 4, 3, 5, 6]

Pass 1: Build Frequency Map
freq = {
  10: 1,
  5: 2,
  3: 2,
  4: 1,
  6: 1
}

Pass 2: Find First Repeating
Check 10: freq[10]=1 → Not repeating
Check 5: freq[5]=2 → Repeating! ✓
Return 5

Result: 5
```

### Right-to-Left Approach:
```
A = [10, 5, 3, 4, 3, 5, 6]
Scan right to left:

i=6, A[6]=6: seen={} → Add 6 → seen={6}
i=5, A[5]=5: seen={6} → Add 5 → seen={6,5}
i=4, A[4]=3: seen={6,5} → Add 3 → seen={6,5,3}
i=3, A[3]=4: seen={6,5,3} → Add 4 → seen={6,5,3,4}
i=2, A[2]=3: seen={6,5,3,4} → Found! → firstRepeating=3
i=1, A[1]=5: seen has 5 → Found! → firstRepeating=5
i=0, A[0]=10: seen={6,5,3,4} → Add 10

Result: 5 (last found = leftmost repeating)
```

## 15. Time and Space Complexity

**Time:** O(N) - two passes  
**Space:** O(N) - frequency map

**Comparison:**
- Brute Force: O(N²), O(1)
- Optimized: O(N), O(N)

## 16. Visualization

```
Two-Pass Approach:

A = [10, 5, 3, 4, 3, 5, 6]

Pass 1: Count Frequencies
┌────┬───┐
│ 10 │ 1 │
│ 5  │ 2 │ ← Repeating
│ 3  │ 2 │ ← Repeating
│ 4  │ 1 │
│ 6  │ 1 │
└────┴───┘

Pass 2: Find First
10 → freq=1 → Skip
5  → freq=2 → Found! ✓

Result: 5
```

## 17. Edge Cases

```javascript
// No repeating elements
firstRepeating([1, 2, 3, 4]); // -1

// All same elements
firstRepeating([5, 5, 5]); // 5

// First element repeats
firstRepeating([1, 2, 1]); // 1

// Last element repeats
firstRepeating([1, 2, 3, 2]); // 2

// Single element
firstRepeating([1]); // -1

// Two elements, both same
firstRepeating([1, 1]); // 1
```

## 18. Key Takeaways

### a. Applications
- Duplicate detection in data streams
- Finding duplicate entries
- Validation systems
- Data integrity checks

### b. Interview Strategy
- Clarify "first" means leftmost occurrence
- Show both brute force and optimized
- Explain two-pass vs single-pass tradeoffs
- Handle edge cases clearly

### c. Common Mistakes
```javascript
// ❌ Returning first duplicate found (wrong)
// Should return leftmost first occurrence

// ✓ Correct: Check order in second pass
for (const num of A) {
    if (freq.get(num) > 1) return num;
}
```

### d. Related Problems
- First Non-Repeating Element
- Find All Duplicates
- Remove Duplicates
- Longest Substring Without Repeating

### e. Performance
- Two-pass O(N) is optimal
- Right-to-left single pass is clever
- Hash set/map essential for O(N)

## Summary

✅ **Two conditions:** Repeating + Leftmost  
✅ **Hash Map:** O(N) solution  
✅ **Two strategies:** Two-pass or right-to-left  

Happy Coding! 🚀

