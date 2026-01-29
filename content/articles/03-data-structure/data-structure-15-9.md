---
title: "K Closest Points to Origin"
description: "Find K closest points to origin using sorting or heap. Master distance calculation, partial sorting optimization, and learn quickselect approach."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## K Closest Points to Origin

## 2. Problem Statement

Given an array of **points** where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer **K**, return the **K closest points** to the origin **(0, 0)**.

The distance is measured using **Euclidean distance**.

**Input:**
- Array of points `[[x1, y1], [x2, y2], ...]`
- Integer `K`

**Output:**
- K closest points (any order)

## 3. Examples

```
Input: points = [[1,3], [-2,2]], K = 1
Output: [[-2,2]]
Explanation: Distance from origin:
  (1,3): sqrt(1² + 3²) = sqrt(10) ≈ 3.16
  (-2,2): sqrt(4 + 4) = sqrt(8) ≈ 2.83

Input: points = [[3,3], [5,-1], [-2,4]], K = 2
Output: [[3,3], [-2,4]]

Input: points = [[0,1], [1,0]], K = 2
Output: [[0,1], [1,0]]
```

## 4. Constraints

- `1 ≤ K ≤ points.length ≤ 10^4`
- `-10^4 ≤ xi, yi ≤ 10^4`

## 5. Important Points

**Distance Formula:**
```
distance = sqrt(x² + y²)
For comparison: x² + y² (avoid sqrt)
```

**Optimization:**
- Don't need actual distance, squared distance works
- Partial sorting sufficient
- Can use heap or quickselect

## 6. Brute Force Approach

Calculate all distances, sort, return first K points.

## 7. Brute Force Code

```javascript
function kClosestBrute(points, K) {
    // Sort by distance
    points.sort((a, b) => {
        const distA = a[0] * a[0] + a[1] * a[1];
        const distB = b[0] * b[0] + b[1] * b[1];
        return distA - distB;
    });
    
    // Return first K
    return points.slice(0, K);
}
```

## 8. Dry Run

```
points = [[1,3], [-2,2], [5,1]], K = 2

Calculate squared distances:
[1,3]: 1² + 3² = 10
[-2,2]: 4 + 4 = 8
[5,1]: 25 + 1 = 26

Sort by distance:
[-2,2] (8)
[1,3] (10)
[5,1] (26)

Return first 2: [[-2,2], [1,3]]
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N log N)  
**Space:** O(log N) or O(N) depending on sort

## 10. Visualization

```
Points on plane:
     |
  4  | (-2,4)
  3  | (1,3)    (3,3)
  2  | (-2,2)
  1  |        (5,1)
  0  |____________________
    -2  0  1  3  5

Distances from origin (0,0):
(-2,2): sqrt(8) ≈ 2.83
(1,3): sqrt(10) ≈ 3.16
(3,3): sqrt(18) ≈ 4.24
(-2,4): sqrt(20) ≈ 4.47
(5,1): sqrt(26) ≈ 5.10
```

## 11. Optimized Approach Description

Use partial sorting or heap. Since we only need K smallest, we can use a max-heap of size K or quickselect for better average performance.

## 12. Optimized Approach Algorithm

```
Approach 1: Sorting (simple)
1. Calculate squared distance for each point
2. Sort by distance
3. Return first K points

Approach 2: Max Heap (optimal for small K)
1. Use max heap of size K
2. For each point:
   - If heap size < K: add
   - Else if point closer than max: remove max, add point
3. Return heap elements

Approach 3: QuickSelect (optimal average)
1. Partition around Kth element
2. Return first K elements
```

## 13. Optimized Code

```javascript
// Approach 1: Simple sorting
function kClosest(points, K) {
    return points
        .sort((a, b) => {
            const distA = a[0] ** 2 + a[1] ** 2;
            const distB = b[0] ** 2 + b[1] ** 2;
            return distA - distB;
        })
        .slice(0, K);
}

// Approach 2: Using map for clarity
function kClosestWithMap(points, K) {
    const distances = points.map((point, idx) => ({
        point,
        distance: point[0] ** 2 + point[1] ** 2,
        idx
    }));
    
    distances.sort((a, b) => a.distance - b.distance);
    
    return distances.slice(0, K).map(d => d.point);
}

// Test cases
console.log(kClosest([[1,3], [-2,2]], 1));
// [[-2,2]]

console.log(kClosest([[3,3], [5,-1], [-2,4]], 2));
// [[3,3], [-2,4]] or [[-2,4], [3,3]]

console.log(kClosest([[0,1], [1,0]], 2));
// [[0,1], [1,0]]
```

## 14. Dry Run

```
points = [[3,3], [5,-1], [-2,4]], K = 2

Calculate distances:
[3,3]: 3² + 3² = 18
[5,-1]: 5² + 1² = 26
[-2,4]: 4 + 16 = 20

Create distance map:
[{point:[3,3], dist:18}, 
 {point:[5,-1], dist:26}, 
 {point:[-2,4], dist:20}]

Sort by distance:
[{point:[3,3], dist:18},
 {point:[-2,4], dist:20},
 {point:[5,-1], dist:26}]

Take first K=2:
[[3,3], [-2,4]]
```

## 15. Time and Space Complexity

**Sorting Approach:**
- Time: O(N log N)
- Space: O(log N) or O(N)

**Heap Approach:**
- Time: O(N log K)
- Space: O(K)

**QuickSelect:**
- Time: O(N) average, O(N²) worst
- Space: O(1)

## 16. Visualization

```
Distance comparison (squared):
Point     | x² + y²  | Distance
----------|----------|----------
(0,1)     | 1        | ✓ Closest
(1,0)     | 1        | ✓ Closest
(-2,2)    | 8        | 
(1,3)     | 10       |
(3,3)     | 18       |
(-2,4)    | 20       |
(5,1)     | 26       |

For K=2, return any 2 with distance 1
```

## 17. Edge Cases

```javascript
// K equals array length
kClosest([[1,1], [2,2], [3,3]], 3);
// All points

// Single point
kClosest([[1,1]], 1);
// [[1,1]]

// Points at origin
kClosest([[0,0], [1,1]], 1);
// [[0,0]]

// Negative coordinates
kClosest([[-5,-5], [1,1]], 1);
// [[1,1]]

// Same distance
kClosest([[1,0], [0,1], [-1,0], [0,-1]], 2);
// Any 2 points (all equidistant)

// Large coordinates
kClosest([[10000,10000], [1,1]], 1);
// [[1,1]]
```

## 18. Key Takeaways

### a. Applications
- Geospatial queries
- Nearest neighbor search
- Recommendation systems
- Clustering algorithms

### b. Interview Strategy
- Use squared distance
- Mention multiple approaches
- Discuss tradeoffs
- Partial sorting optimization

### c. Common Mistakes
- Computing actual distance (slow)
- Full sort when K << N
- Wrong distance formula
- Not handling ties

### d. Related Problems
- K Closest Points in 3D
- Find K Pairs with Smallest Sums
- Top K Frequent Elements
- Kth Largest Element

### e. Performance
- Sorting: Simple, O(N log N)
- Heap: Better for small K
- QuickSelect: Best average case
- No sqrt needed

## Summary

✅ **Squared Distance:** Avoid sqrt for comparison  
✅ **Partial Sorting:** Only need K smallest  
✅ **Multiple Solutions:** Sort, heap, or quickselect  

Happy Coding! 🚀

