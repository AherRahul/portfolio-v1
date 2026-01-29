---
title: "Union of Two Arrays"
description: "Understand First-In-First-Out (FIFO) processing. Learn queue operations, circular queues, priority queues, deques, and queue applications in algorithms and system design."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Queue Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive queue operations visualization"
  - title: "Queue Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/queue/"
    description: "Practice problems for mastering queue algorithms"
  - title: "Priority Queue Implementation"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Priority_queue"
    description: "Understanding priority queue data structures"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Union of Two Arrays – Optimized Solution (JavaScript)
-----------------------

#### Problem Statement
You are given two arrays `a[]` and `b[]`.  
Return the **Union** of both arrays — meaning all **distinct elements** that appear in either array.

If an element appears more than once (in one or both arrays), it should appear **only once** in the result.

> **Note:**  
> The union can be returned in any order — but when printed, it’s typically shown in **sorted order**.


### **Example 1**

**Input:**:  `a = [1, 2, 3, 4, 5] b = [1, 2, 3]`

**Output:**: `[1, 2, 3, 4, 5]`


### **Example 2**

**Input:**: `a = [85, 25, 1, 32, 54, 6] b = [85, 2]`

**Output:**: `[1, 2, 6, 25, 32, 54, 85]`

**Explanation:**: All distinct elements from both arrays combined.


### Approach 1: Using a Set (Most Efficient & Clean)

**Time Complexity:** O(n + m)  
**Space Complexity:** O(n + m)

#### Logic

*   Combine both arrays using the **spread operator** (`[...a, ...b]`).
*   Create a **Set** from the combined array to automatically remove duplicates.
*   Convert back to an array if needed.
    

### JavaScript Code
```javascript 
function unionOfArrays(a, b) {   
  const union = new Set([...a, ...b]);   
  
  return Array.from(union); 
}  
  
console.log(unionOfArrays([85, 25, 1, 32, 54, 6], [85, 2])); // Output: [85, 25, 1, 32, 54, 6, 2]
```

**To get sorted result:**
```javascript 
return Array.from(union).sort((x, y) => x - y);
```

✅ **Pros:**

*   Simple one-liner.
*   Removes duplicates automatically.
*   Linear time complexity.
    

⚠️ **Cons:**

*   Uses O(n + m) extra space.
    

- - -

### Approach 2: Using Object / Hash Map (Manual Duplicate Check)

**Time Complexity:** O(n + m)  
**Space Complexity:** O(n + m)

#### Logic

*   Traverse both arrays.
*   Store each number as a key in an object.
*   Keys inherently remain unique.
    

#### JavaScript Code
```javascript
function unionOfArrays(a, b) {   
  const map = {};   
  const result = [];    
  
  for (const num of a) map[num] = true;   
  
  for (const num of b) map[num] = true;    
  
  for (const key in map) {     
    result.push(Number(key));   
  }    
  
  return result.sort((x, y) => x - y); 
}  

console.log(unionOfArrays([85, 25, 1, 32, 54, 6], [85, 2])); // Output: [1, 2, 6, 25, 32, 54, 85]
```

✅ **Pros:**

*   Works in linear time.
*   Easy to understand.    
*   No duplicate elements.
    

⚠️ **Cons:**

*   Slightly more verbose than the `Set` version.
*   Still needs extra space for map.
    

- - -

### Approach 3: Two-Pointer Technique (When Arrays Are Sorted)

**Time Complexity:** O(n + m)  
**Space Complexity:** O(1) additional space (excluding result array)

> ⚠️ Works only when both arrays are **sorted**.

#### Logic

*   Maintain two pointers `i` and `j` for arrays `a` and `b`.
*   Compare elements:
    *   If `a[i] < b[j]` → push `a[i]` and increment `i`.
    *   If `a[i] > b[j]` → push `b[j]` and increment `j`.
    *   If both equal → push one of them and move both pointers.
*   Continue until both arrays are exhausted.
*   Skip duplicates during the process.
    

### JavaScript Code
```javascript
function unionOfSortedArrays(a, b) {   
  let i = 0, j = 0;   
  const result = [];    
  while (i < a.length && j < b.length) {     
    // Avoid duplicates     
    if (i > 0 && a[i] === a[i - 1]) { 
      i++; continue; 
    }     
    
    if (j > 0 && b[j] === b[j - 1]) { 
      j++; continue; 
    }      
    
    if (a[i] < b[j]) result.push(a[i++]);     
    else if (a[i] > b[j]) result.push(b[j++]);    
    else {        
      result.push(a[i]);       
      i++; 
      j++;     
    }   
  }    
  // Add remaining elements  
  while (i < a.length) {     
    if (i === 0 || a[i] !== a[i - 1]) result.push(a[i]);     
    i++;   
  }    
  
  while (j < b.length) {     
    if (j === 0 || b[j] !== b[j - 1]) result.push(b[j]);     
    j++;   
  }    
  
  return result; 
}  

console.log(unionOfSortedArrays([1, 2, 2, 3, 4], [2, 3, 5])); // Output: [1, 2, 3, 4, 5]
```

✅ **Pros:**

*   O(1) extra space (apart from output).
*   Ideal when arrays are already sorted.
    

⚠️ **Cons:**

*   Requires pre-sorted arrays.
*   Slightly more logic-heavy.
    

- - -

### Approach 4: Brute Force (Naive Solution)

**Time Complexity:** O((n + m)²)  
**Space Complexity:** O(n + m)

#### Logic

*   Push all elements from both arrays into a result array.
*   For each element, check if it already exists — if not, push.
*   Very inefficient for large arrays.
    

#### JavaScript Code
```javascript
function unionOfArrays(a, b) {   
  const result = [];    
  
  for (const num of [...a, ...b]) {     
    if (!result.includes(num)) result.push(num);   
  }    
  
  return result.sort((x, y) => x - y); 
}  

console.log(unionOfArrays([85, 25, 1, 32, 54, 6], [85, 2])); // Output: [1, 2, 6, 25, 32, 54, 85]
```

⚠️ **Cons:**

*   `includes()` inside a loop makes it O(n²).  
*   Not suitable for large input sizes.
    

### Summary

| Approach | Time | Space | Sorted Needed | Notes |
| --- | --- | --- | --- | --- |
| **Set** | O(n + m) | O(n + m) |  ✅  | Simple, most efficient |
| **Hash Map/Object** | O(n + m) | O(n + m) | ❌   | Works same as Set |
| **Two Pointers** | O(n + m) | O(1) | ✅   | Best for sorted arrays |
| **Brute Force** | O((n + m)²) | O(n + m) | ❌   | Inefficient |

### Recommended Approach
Use the **Set-based solution** for simplicity and performance.  
If arrays are already sorted — the **Two-pointer method** is even better since it avoids extra space.