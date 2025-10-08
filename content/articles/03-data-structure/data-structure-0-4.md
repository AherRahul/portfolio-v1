---
title: "Problem: Second Largest Number in an Array"
description: "Understanding the importance of data structures and algorithms in programming. Learn systematic problem-solving approaches, algorithmic thinking, and how DSA impacts software performance and efficiency."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Introduction to Algorithms - MIT"
    type: "book"
    url: "https://mitpress.mit.edu/books/introduction-algorithms-third-edition"
    description: "The definitive textbook on algorithms and data structures"
  - title: "Algorithm Visualizations"
    type: "tool"
    url: "https://visualgo.net/"
    description: "Interactive visualizations of algorithms and data structures"
  - title: "LeetCode Practice"
    type: "practice"
    url: "https://leetcode.com/"
    description: "Platform for practicing algorithmic problem solving"
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Problem: Find the Second Largest Distinct Number in an Array
------------------------------------------------------------------------------

### Problem Statement
Write a function `secondLargest(arr)` that returns the **second largest distinct number** in a given array of numbers.

### Requirements

1. The array must contain **at least two elements**.  
2. If **all elements are equal**, return:  
   `"No second largest found"`  
3. If the array has **fewer than two elements**, return:  
   `"Array should have at least two numbers"`

### Examples

| Input | Output | Explanation |
|--------|---------|-------------|
| `[0, 3, 5, 2, 7, 9]` | `7` | 9 is the largest, 7 is the second largest |
| `[4, 4, 4, 4]` | `No second largest found` | All elements are equal |
| `[5]` | `Array should have at least two numbers` | Only one element present |
| `[10, 20]` | `10` | 20 is largest, 10 is second largest |

### Constraints

- **Time Complexity:** `O(n)` — Single pass through the array.  
- **Space Complexity:** `O(1)` — Constant extra space.

### Approach (Step-by-Step Explanation)

1. **Check Array Length:**  
   If the array has fewer than 2 elements, return `"Array should have at least two numbers"`.

2. **Initialize Variables:**  
   - `first` → stores the largest number (initially `-Infinity`).  
   - `second` → stores the second largest number (initially `-Infinity`).

3. **Iterate through the array:**  
   For each number `num` in the array:
   - If `num > first`, update both `first` and `second`:
     ```
     second = first;
     first = num;
     ```
   - Else if `num` is not equal to `first` **and** greater than `second`, update `second`:
     ```
     second = num;
     ```

4. **Return Result:**  
   - If `second` remains `-Infinity`, it means no distinct second largest number was found.  
     Return `"No second largest found"`.  
   - Otherwise, return the `second` number.

### Visualization Example

For `arr = [0, 3, 5, 2, 7, 9]`

| Step | num | first | second |
|------|-----|--------|---------|
| 1 | 0 | 0 | -∞ |
| 2 | 3 | 3 | 0 |
| 3 | 5 | 5 | 3 |
| 4 | 2 | 5 | 3 |
| 5 | 7 | 7 | 5 |
| 6 | 9 | 9 | 7 |

✅ Final Answer → `7`

### JavaScript Implementation

```javascript
function secondLargest(arr) {
  if (arr.length < 2) return "Array should have at least two numbers";
  
  let first = -Infinity, second = -Infinity;
  
  for (let num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }
  
  return second === -Infinity ? "No second largest found" : second;
}

// Example usage
console.log(secondLargest([0, 3, 5, 2, 7, 9])); // Output: 7
console.log(secondLargest([4, 4, 4, 4]));       // Output: No second largest found
console.log(secondLargest([5]));                // Output: Array should have at least two numbers
console.log(secondLargest([10, 20]));           // Output: 10

```

### Key Takeaways
- This approach avoids sorting (which is O(n log n)).
- Works efficiently in a single traversal (O(n)).
- Handles duplicates gracefully.