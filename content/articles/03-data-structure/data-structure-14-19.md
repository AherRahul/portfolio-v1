---
title: "Longest Consecutive Sequence using Hashing"
description: "Find longest consecutive sequence in unsorted array using hash sets. Master sequence detection pattern, handle duplicates efficiently, and achieve O(N) solution."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Longest Consecutive Sequence

## 2. Problem Statement

Given an **unsorted** array of integers, find the **length** of the longest consecutive elements sequence.

Your algorithm should run in **O(N)** time complexity.

**Input:**
- Array `A` of integers

**Output:**
- Length of longest consecutive sequence

## 3. Examples

```
Input: [100, 4, 200, 1, 3, 2]
Output: 4
Explanation: [1, 2, 3, 4] is the longest consecutive sequence

Input: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
Output: 9
Explanation: [0, 1, 2, 3, 4, 5, 6, 7, 8]

Input: [9, 1, 4, 7, 3, 2, 8, 5, 6]
Output: 9
Explanation: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## 4. Constraints

- `0 ≤ N ≤ 10^6`
- `-10^9 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Key Insight:**
```
Only start counting from the beginning of a sequence
A number is start of sequence if (num - 1) doesn't exist
```

**Strategy:**
- Use Set for O(1) lookup
- Find sequence starts only
- Count consecutive numbers from start

## 6. Brute Force Approach

Sort the array and find longest consecutive run.

## 7. Brute Force Code

```javascript
function longestConsecutiveBrute(A) {
    if (A.length === 0) return 0;
    
    A.sort((a, b) => a - b);
    
    let maxLength = 1;
    let currentLength = 1;
    
    for (let i = 1; i < A.length; i++) {
        if (A[i] === A[i-1]) {
            continue; // Skip duplicates
        }
        if (A[i] === A[i-1] + 1) {
            currentLength++;
        } else {
            maxLength = Math.max(maxLength, currentLength);
            currentLength = 1;
        }
    }
    
    return Math.max(maxLength, currentLength);
}
```

## 8. Dry Run

```
A = [100, 4, 200, 1, 3, 2]
After sort: [1, 2, 3, 4, 100, 200]

1→2: consecutive, length=2
2→3: consecutive, length=3
3→4: consecutive, length=4
4→100: not consecutive, reset

Max: 4
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N log N) - sorting  
**Space:** O(1) or O(N) depending on sort

## 10. Visualization

```
Array: [100, 4, 200, 1, 3, 2]

After sorting: [1, 2, 3, 4, 100, 200]

Sequence: 1 → 2 → 3 → 4
Length: 4 ✓
```

## 11. Optimized Approach Description

Use hash set to store all numbers. For each number, check if it's the start of a sequence (num-1 not in set). If yes, count consecutive numbers from there.

## 12. Optimized Approach Algorithm

```
1. Add all numbers to Set
2. Initialize maxLength = 0
3. For each num in Set:
   - If (num - 1) not in Set:
       // num is start of sequence
       currentNum = num
       currentLength = 1
       While (currentNum + 1) in Set:
           currentNum++
           currentLength++
       maxLength = max(maxLength, currentLength)
4. Return maxLength
```

## 13. Optimized Code

```javascript
function longestConsecutive(A) {
    if (A.length === 0) return 0;
    
    const numSet = new Set(A);
    let maxLength = 0;
    
    for (const num of numSet) {
        // Only start counting if this is the start of a sequence
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;
            
            // Count consecutive numbers
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }
            
            maxLength = Math.max(maxLength, currentLength);
        }
    }
    
    return maxLength;
}

// Test cases
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutive([9, 1, 4, 7, 3, 2, 8, 5, 6])); // 9
console.log(longestConsecutive([])); // 0
console.log(longestConsecutive([1])); // 1
```

## 14. Dry Run

```
A = [100, 4, 200, 1, 3, 2]
numSet = {100, 4, 200, 1, 3, 2}
maxLength = 0

Process 100:
  99 not in set → start of sequence
  Check 101: not in set
  currentLength = 1
  maxLength = 1

Process 4:
  3 in set → skip (not start)

Process 200:
  199 not in set → start of sequence
  Check 201: not in set
  currentLength = 1
  maxLength = 1

Process 1:
  0 not in set → start of sequence
  Check 2: in set, count=2
  Check 3: in set, count=3
  Check 4: in set, count=4
  Check 5: not in set
  currentLength = 4
  maxLength = 4

Process 3:
  2 in set → skip (not start)

Process 2:
  1 in set → skip (not start)

Result: 4
```

## 15. Time and Space Complexity

**Time:** O(N)  
- Each number visited at most twice
**Space:** O(N) - hash set

## 16. Visualization

```
Array: [100, 4, 200, 1, 3, 2]

Set: {1, 2, 3, 4, 100, 200}

Find sequence starts:
1 → start (0 not in set)
  1 → 2 → 3 → 4 (length = 4) ✓

100 → start (99 not in set)
  100 (length = 1)

200 → start (199 not in set)
  200 (length = 1)

Maximum: 4
```

## 17. Edge Cases

```javascript
// Empty array
longestConsecutive([]); // 0

// Single element
longestConsecutive([1]); // 1

// All duplicates
longestConsecutive([1, 1, 1]); // 1

// No consecutive
longestConsecutive([1, 3, 5, 7]); // 1

// Entire array consecutive
longestConsecutive([1, 2, 3, 4, 5]); // 5

// Negative numbers
longestConsecutive([-1, -2, 0, 1]); // 4

// Large gaps
longestConsecutive([1, 1000000000, -1000000000]); // 1
```

## 18. Key Takeaways

### a. Applications
- Data analysis
- Range detection
- Gap analysis
- Time series analysis

### b. Interview Strategy
- Check if sequence start
- Use Set for O(1) lookup
- Avoid processing middle elements
- Handle duplicates with Set

### c. Common Mistakes
- Checking every number
- Not identifying sequence start
- Wrong sequence detection
- Sorting (ruins O(N))

### d. Related Problems
- Binary Tree Longest Consecutive
- Longest Increasing Subsequence
- Missing Number
- Find Missing Positive

### e. Performance
- O(N) optimal solution
- Each element processed once
- Smart sequence start detection

## Summary

✅ **Sequence Start:** Check if (num-1) exists  
✅ **Hash Set:** O(1) lookups  
✅ **Linear Time:** Visit each number once  

Happy Coding! 🚀

