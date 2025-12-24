---
title: "Wave Array Sorting Pattern"
description: "Arrange array in wave form with alternating peaks and valleys. Master swap-based wave formation, optimize without full sorting, and handle odd/even lengths."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Wave Array

## 2. Problem Statement

Given an unsorted array of integers, sort it into a **wave-like array**. An array is in wave form if:
```
arr[0] >= arr[1] <= arr[2] >= arr[3] <= arr[4] >= ...
```

Elements at even indices should be **greater than or equal** to their adjacent elements.

**Input:**
- Array `A` of N integers

**Output:**
- Array arranged in wave form

## 3. Examples

```
Input: [1, 2, 3, 4]
Output: [2, 1, 4, 3]
Explanation: 2>=1, 1<=4, 4>=3

Input: [10, 5, 6, 3, 2, 20, 100, 80]
Output: [10, 5, 20, 2, 100, 3, 80, 6]
or [20, 2, 100, 3, 80, 6, 10, 5]

Input: [1, 2, 3]
Output: [2, 1, 3]
```

## 4. Constraints

- `1 ≤ N ≤ 10^6`
- `1 ≤ A[i] ≤ 10^6`

## 5. Important Points

**Wave Pattern:**
```
Peak at even indices
Valley at odd indices

Visual: /\ /\ /\
```

**Key Property:**
- arr[0] >= arr[1]
- arr[1] <= arr[2]
- arr[2] >= arr[3]
- ...

## 6. Brute Force Approach

Sort the array, then swap adjacent elements.

## 7. Brute Force Code

```javascript
function waveArrayBrute(arr) {
    // Sort array
    arr.sort((a, b) => a - b);
    
    // Swap adjacent elements
    for (let i = 0; i < arr.length - 1; i += 2) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    }
    
    return arr;
}
```

## 8. Dry Run

```
arr = [10, 5, 6, 3, 2, 20, 100, 80]

Sort: [2, 3, 5, 6, 10, 20, 80, 100]

Swap pairs:
[3, 2, 5, 6, 10, 20, 80, 100]
[3, 2, 6, 5, 10, 20, 80, 100]
[3, 2, 6, 5, 20, 10, 80, 100]
[3, 2, 6, 5, 20, 10, 100, 80]

Result: [3, 2, 6, 5, 20, 10, 100, 80]
Verify: 3>=2, 2<=6, 6>=5, 5<=20, 20>=10, 10<=100, 100>=80 ✓
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N log N) - sorting  
**Space:** O(log N) or O(N) - sorting

## 10. Visualization

```
Original: [10, 5, 6, 3, 2, 20, 100, 80]

After sort: [2, 3, 5, 6, 10, 20, 80, 100]

Swap pairs:
[3, 2, 6, 5, 20, 10, 100, 80]
 ^  ^  ^  ^   ^   ^    ^   ^
peak valley peak valley...

Wave pattern:
  3   6    20     100
   \ / \  / \    /  \
    2   5   10  80
```

## 11. Optimized Approach Description

Without sorting: Traverse array and ensure wave property locally. For each even index, check if it's smaller than neighbors; if yes, swap with larger neighbor.

## 12. Optimized Approach Algorithm

```
1. For i from 0 to N-1 (step 2):
   - If i > 0 and arr[i] < arr[i-1]:
       swap arr[i] and arr[i-1]
   - If i < N-1 and arr[i] < arr[i+1]:
       swap arr[i] and arr[i+1]
2. Return array
```

## 13. Optimized Code

```javascript
function waveArray(arr) {
    const n = arr.length;
    
    // Process every even index
    for (let i = 0; i < n; i += 2) {
        // Check with previous element
        if (i > 0 && arr[i] < arr[i - 1]) {
            [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        }
        
        // Check with next element
        if (i < n - 1 && arr[i] < arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
    }
    
    return arr;
}

// Alternative: Using sorting
function waveArraySort(arr) {
    arr.sort((a, b) => a - b);
    
    for (let i = 0; i < arr.length - 1; i += 2) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    }
    
    return arr;
}

// Test cases
console.log(waveArray([1, 2, 3, 4]));
// [2, 1, 4, 3]

console.log(waveArray([10, 5, 6, 3, 2, 20, 100, 80]));
// Wave form (multiple valid answers)

console.log(waveArray([1, 2, 3]));
// [2, 1, 3]
```

## 14. Dry Run

```
arr = [10, 5, 6, 3, 2, 20, 100, 80]

i=0:
  Check with i-1: skip (i=0)
  Check with i+1: 10 > 5 ✓

i=2:
  Check with i-1: 6 > 5 ✓
  Check with i+1: 6 > 3 ✓

i=4:
  Check with i-1: 2 < 3 → swap: [10,5,6,3,3,20,100,80]
                                         wait, let me redo

arr = [10, 5, 6, 3, 2, 20, 100, 80]

i=0:
  i-1: skip
  i+1: 10>5 ✓

i=2:
  i-1: 6>5 ✓
  i+1: 6>3 ✓

i=4:
  i-1: 2<3 → swap: [10,5,6,2,3,20,100,80]
  i+1: 3>20? No! → swap: [10,5,6,2,20,3,100,80]

i=6:
  i-1: 100>3 ✓
  i+1: 100>80 ✓

Result: [10,5,6,2,20,3,100,80]
Verify: 10>=5, 5<=6, 6>=2, 2<=20, 20>=3, 3<=100, 100>=80 ✓
```

## 15. Time and Space Complexity

**Optimized (No Sort):**
- Time: O(N)
- Space: O(1)

**With Sorting:**
- Time: O(N log N)
- Space: O(log N)

## 16. Visualization

```
Original: [10, 5, 6, 3, 2, 20, 100, 80]

Process even indices:
i=0: 10 > 5 ✓
i=2: 6 > 3,5 ✓
i=4: 2 < 3,20 → fix
i=6: 100 > 3,80 ✓

Wave pattern formation:
  10  6    20      100
   \/ \   / \     /  \
   5   2 3   (adjust) 80

Final wave satisfies:
even >= neighbors
odd <= neighbors
```

## 17. Edge Cases

```javascript
// Single element
waveArray([1]); // [1]

// Two elements
waveArray([1, 2]); // [2, 1]

// Three elements
waveArray([1, 2, 3]); // [2, 1, 3]

// Already wave
waveArray([4, 1, 3, 2]); // [4, 1, 3, 2]

// All same
waveArray([5, 5, 5, 5]); // [5, 5, 5, 5]

// Descending
waveArray([5, 4, 3, 2, 1]); // [5, 3, 4, 1, 2]

// Ascending
waveArray([1, 2, 3, 4, 5]); // [2, 1, 4, 3, 5]
```

## 18. Key Takeaways

### a. Applications
- Signal processing
- Data visualization
- Pattern generation
- Array manipulation

### b. Interview Strategy
- Mention both approaches
- Explain local fix strategy
- Discuss time complexity
- Handle edge cases

### c. Common Mistakes
- Wrong index stepping
- Not checking boundaries
- Over-complicating logic
- Wrong comparison operators

### d. Related Problems
- Wiggle Sort
- Wiggle Sort II
- Peak Element
- Valley Element

### e. Performance
- O(N) optimal without sorting
- In-place swapping
- Simple local fixes
- Multiple valid answers

## Summary

✅ **Even Peaks:** Ensure even indices are local maxima  
✅ **Local Fix:** Swap with larger neighbor  
✅ **O(N) Solution:** No sorting required  

Happy Coding! 🚀

