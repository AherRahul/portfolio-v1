---
title: "Count Unique 2D Points using Hashing"
description: "Count unique points in 2D space using hash sets. Master coordinate hashing, tuple representation, and learn efficient duplicate point detection."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Hashing Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Count Unique 2D Points

## 2. Problem Statement

Given an array of 2D points, count the number of **unique points**. Two points are considered the same if they have the same **x** and **y** coordinates.

**Input:**
- Array of points `[[x1, y1], [x2, y2], ...]`

**Output:**
- Count of unique points

## 3. Examples

```
Input: [[1, 2], [1, 2], [3, 4]]
Output: 2
Explanation: [1,2] appears twice, [3,4] once

Input: [[1, 1], [2, 2], [3, 3]]
Output: 3
Explanation: All points are unique

Input: [[0, 0], [0, 0], [0, 0]]
Output: 1
Explanation: All points are the same
```

## 4. Constraints

- `1 ≤ N ≤ 10^5`
- `-10^6 ≤ x, y ≤ 10^6`

## 5. Important Points

**Hashing Strategy:**
```
1. Convert point to string: "x,y"
2. Use Set for uniqueness
3. Handle negative coordinates
```

**Key Consideration:**
- String representation must be unambiguous
- Use separator to avoid collisions

## 6. Brute Force Approach

Compare each point with all others to check uniqueness.

## 7. Brute Force Code

```javascript
function countUniquePointsBrute(points) {
    const unique = [];
    
    for (const point of points) {
        let isUnique = true;
        for (const uniquePoint of unique) {
            if (point[0] === uniquePoint[0] && point[1] === uniquePoint[1]) {
                isUnique = false;
                break;
            }
        }
        if (isUnique) {
            unique.push(point);
        }
    }
    
    return unique.length;
}
```

## 8. Dry Run

```
points = [[1, 2], [1, 2], [3, 4]]

Check [1,2]: unique = [[1,2]]
Check [1,2]: found in unique, skip
Check [3,4]: unique = [[1,2], [3,4]]

Result: 2
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N²)  
**Space:** O(N)

## 10. Visualization

```
Points: [[1, 2], [1, 2], [3, 4]]

[1,2] → Add to unique set
[1,2] → Already exists, skip
[3,4] → Add to unique set

Unique: {[1,2], [3,4]} = 2
```

## 11. Optimized Approach Description

Use a Set with string representation of points. Convert each point to "x,y" format and add to set. Return set size.

## 12. Optimized Approach Algorithm

```
1. Initialize empty Set
2. For each point [x, y]:
   - Create string key: "x,y"
   - Add to Set
3. Return Set.size
```

## 13. Optimized Code

```javascript
function countUniquePoints(points) {
    const uniqueSet = new Set();
    
    for (const [x, y] of points) {
        uniqueSet.add(`${x},${y}`);
    }
    
    return uniqueSet.size;
}

// Alternative with JSON.stringify
function countUniquePointsJSON(points) {
    const uniqueSet = new Set(points.map(p => JSON.stringify(p)));
    return uniqueSet.size;
}

// Test cases
console.log(countUniquePoints([[1, 2], [1, 2], [3, 4]])); // 2
console.log(countUniquePoints([[1, 1], [2, 2], [3, 3]])); // 3
console.log(countUniquePoints([[0, 0], [0, 0], [0, 0]])); // 1
console.log(countUniquePoints([[-1, -1], [1, 1], [-1, 1]])); // 3
```

## 14. Dry Run

```
points = [[1, 2], [1, 2], [3, 4]]
uniqueSet = {}

Process [1, 2]:
  key = "1,2"
  uniqueSet = {"1,2"}

Process [1, 2]:
  key = "1,2"
  uniqueSet = {"1,2"} (no change)

Process [3, 4]:
  key = "3,4"
  uniqueSet = {"1,2", "3,4"}

Result: 2
```

## 15. Time and Space Complexity

**Time:** O(N)  
**Space:** O(N)

## 16. Visualization

```
Input Points:
(1,2) → "1,2" → Add to set
(1,2) → "1,2" → Already in set
(3,4) → "3,4" → Add to set

Set: {"1,2", "3,4"}
Size: 2

Visual representation:
    4 |     *
    3 |
    2 | *
    1 |
    0 +-------
      0 1 2 3 4
```

## 17. Edge Cases

```javascript
// Single point
countUniquePoints([[1, 1]]); // 1

// All same
countUniquePoints([[0, 0], [0, 0], [0, 0]]); // 1

// All different
countUniquePoints([[1, 1], [2, 2], [3, 3]]); // 3

// Negative coordinates
countUniquePoints([[-1, -2], [-1, -2], [1, 2]]); // 2

// Large coordinates
countUniquePoints([[1000000, 1000000], [1000000, 1000000]]); // 1

// Zero coordinates
countUniquePoints([[0, 1], [1, 0], [0, 0]]); // 3
```

## 18. Key Takeaways

### a. Applications
- Geometry problems
- Duplicate detection
- Coordinate systems
- Map/GPS applications

### b. Interview Strategy
- Use string representation
- Choose good separator
- Consider JSON.stringify
- Handle negative numbers

### c. Common Mistakes
- No separator (collision)
- Wrong separator choice
- Not handling negatives
- Array comparison issues

### d. Related Problems
- Valid Boomerang
- Max Points on Line
- K Closest Points
- Rectangle Overlap

### e. Performance
- O(N) optimal solution
- Set provides O(1) operations
- String hashing efficient

## Summary

✅ **String Representation:** Convert coordinates to string  
✅ **Use Separator:** Avoid hash collisions  
✅ **Set for Uniqueness:** O(1) operations  

Happy Coding! 🚀

