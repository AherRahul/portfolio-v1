---
title: "Aggressive Cows using Binary Search"
description: "Maximize minimum distance between cows. Master binary search on answer, implement greedy placement strategy, and solve optimization problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Searching Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Aggressive Cows

## 2. Problem Statement

Given **N** stalls at positions `x1, x2, ..., xN` and **C** aggressive cows, place the cows such that the **minimum distance** between any two cows is **as large as possible**.

Return the **largest minimum distance**.

**Input:**
- Array `A` (stall positions)
- Integer `C` (number of cows)

**Output:**
- Maximum of minimum distances

## 3. Examples

```
Input: A = [1, 2, 4, 8, 9], C = 3
Output: 3
Explanation: Place at 1, 4, 8 → min distance = 3

Input: A = [1, 2, 8, 4, 9], C = 3
Output: 3
Explanation: After sort [1,2,4,8,9], place at 1,4,9 → min = 3

Input: A = [5, 4, 3, 2, 1, 1000000000], C = 2
Output: 999999995
Explanation: Place at 1, 1000000000
```

## 4. Constraints

- `2 ≤ N ≤ 10^5`
- `2 ≤ C ≤ N`
- `1 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Key Insight:**
```
If we can place C cows with min distance D,
we can also place them with min distance < D
```

**Binary Search Range:**
```
Min distance: 1
Max distance: max(A) - min(A)
```

## 6. Brute Force Approach

Try all possible placements.

## 7. Brute Force Code

```javascript
function aggressiveCowsBrute(A, C) {
    A.sort((a, b) => a - b);
    // Try all combinations - exponential time
}
```

## 8. Dry Run

```
A = [1, 2, 4, 8, 9], C = 3

Try distance 4:
Place at 1, 5 (not exists), fail

Try distance 3:
Place at 1, 4, 8 ✓ success

Result: 3
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N^C)  
**Space:** O(1)

## 10. Visualization

```
Stalls: [1, 2, 4, 8, 9]
C = 3 cows

Placement:
1   2   4       8   9
C1      C2          C3

Distances: 4-1=3, 9-4=5
Minimum: 3
```

## 11. Optimized Approach Description

Binary search on answer (minimum distance). For each distance, check if we can place C cows greedily.

## 12. Optimized Approach Algorithm

```
1. Sort stall positions
2. left = 1, right = max(A) - min(A)
3. Binary search:
   - If canPlace(mid, C): 
       result = mid
       left = mid + 1
   - Else:
       right = mid - 1
4. Return result

canPlace(minDist, C):
  Place first cow at A[0]
  count = 1, lastPos = A[0]
  For each stall:
    If (stall - lastPos) >= minDist:
      count++
      lastPos = stall
  Return count >= C
```

## 13. Optimized Code

```javascript
function aggressiveCows(A, C) {
    A.sort((a, b) => a - b);
    
    let left = 1;
    let right = A[A.length - 1] - A[0];
    let result = 0;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canPlaceCows(A, C, mid)) {
            result = mid;
            left = mid + 1; // Try larger distance
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

function canPlaceCows(A, C, minDist) {
    let count = 1; // Place first cow
    let lastPos = A[0];
    
    for (let i = 1; i < A.length; i++) {
        if (A[i] - lastPos >= minDist) {
            count++;
            lastPos = A[i];
            
            if (count === C) {
                return true;
            }
        }
    }
    
    return count >= C;
}

// Test cases
console.log(aggressiveCows([1, 2, 4, 8, 9], 3)); // 3
console.log(aggressiveCows([1, 2, 8, 4, 9], 3)); // 3
console.log(aggressiveCows([5, 4, 3, 2, 1, 1000000000], 2)); // 999999995
console.log(aggressiveCows([1, 2, 3, 4, 5], 2)); // 4
```

## 14. Dry Run

```
A = [1, 2, 4, 8, 9], C = 3
After sort: [1, 2, 4, 8, 9]
left=1, right=8

Iteration 1:
mid=4
canPlace(4):
  C1 at 1
  2-1=1 < 4, skip
  4-1=3 < 4, skip
  8-1=7 >= 4, C2 at 8
  9-8=1 < 4, skip
  count=2 < 3 ✗
right=3

Iteration 2:
mid=2
canPlace(2):
  C1 at 1
  2-1=1 < 2, skip
  4-1=3 >= 2, C2 at 4
  8-4=4 >= 2, C3 at 8
  count=3 ✓
result=2, left=3

Iteration 3:
mid=3
canPlace(3):
  C1 at 1
  2-1=1 < 3, skip
  4-1=3 >= 3, C2 at 4
  8-4=4 >= 3, C3 at 8
  count=3 ✓
result=3, left=4

left > right → return 3
```

## 15. Time and Space Complexity

**Time:** O(N log N + N log(max-min))  
**Space:** O(1)

## 16. Visualization

```
Stalls: [1, 2, 4, 8, 9]
C = 3 cows

Binary search: [1, 8]

Try distance 3:
1 → place C1
2: 2-1=1 < 3 ✗
4: 4-1=3 ≥ 3 → place C2
8: 8-4=4 ≥ 3 → place C3 ✓

Placed 3 cows successfully!
Answer: 3
```

## 17. Edge Cases

```javascript
// Minimum cows
aggressiveCows([1, 2, 3, 4], 2); // 3

// All positions far apart
aggressiveCows([1, 1000, 2000, 3000], 2); // 2999

// Close positions
aggressiveCows([1, 2, 3], 3); // 1

// C = N (all stalls used)
aggressiveCows([1, 2, 4, 8], 4); // 1
```

## 18. Key Takeaways

### a. Applications
- Facility placement
- Network design
- Resource distribution
- Scheduling problems

### b. Interview Strategy
- Sort stalls first
- Binary search on distance
- Greedy placement check
- Maximize minimum pattern

### c. Common Mistakes
- Not sorting array
- Wrong search range
- Incorrect greedy logic
- Off-by-one errors

### d. Related Problems
- Magnetic Force Between Balls
- Minimize Max Distance to Gas Station
- Split Array Largest Sum
- Painter's Partition

### e. Performance
- O(N log N) sorting
- O(N log D) binary search
- Optimal greedy placement
- Handles large inputs

## Summary

✅ **Maximize Minimum:** Binary search on answer  
✅ **Greedy Placement:** First available position  
✅ **Sort First:** Essential preprocessing  

Happy Coding! 🚀

