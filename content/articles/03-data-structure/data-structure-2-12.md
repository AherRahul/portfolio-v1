---
title: "Reverse Array in a Range"
description: "Master the technique of reversing a portion of an array within a given range. Learn in-place array manipulation, two-pointer technique, and understand how partial array reversal works efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Array Manipulation Techniques"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    description: "JavaScript array methods and operations"
  - title: "Two Pointer Technique"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Visualize array operations and two-pointer technique"
  - title: "Array Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/array/"
    description: "Practice array manipulation problems"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Reverse Array in a Range
----------------------------

### Problem Statement:

Given an array `arr` of `N` integers and two indices `start` and `end`, reverse the elements of the array **only within the range** from index `start` to index `end` (inclusive).

Perform the operation **in-place** without using extra space for another array.

**Note:** The array uses **0-based indexing**.

### Examples:

#### Example 1:

**Input:** arr = [1, 2, 3, 4, 5, 6], start = 1, end = 4

**Output:** [1, 5, 4, 3, 2, 6]

**Explanation:** 
* Original array: [1, 2, 3, 4, 5, 6]
* Elements from index 1 to 4: [2, 3, 4, 5]
* After reversing: [5, 4, 3, 2]
* Final array: [1, 5, 4, 3, 2, 6]

#### Example 2:

**Input:** arr = [10, 20, 30, 40, 50], start = 0, end = 4

**Output:** [50, 40, 30, 20, 10]

**Explanation:** 
* Reversing from index 0 to 4 means reversing the entire array.
* Original: [10, 20, 30, 40, 50]
* Reversed: [50, 40, 30, 20, 10]

#### Example 3:

**Input:** arr = [7, 8, 9, 10], start = 1, end = 2

**Output:** [7, 9, 8, 10]

**Explanation:** 
* Only reverse elements at indices 1 and 2.
* Original: [7, 8, 9, 10]
* Elements at 1-2: [8, 9]
* After reversing: [9, 8]
* Final: [7, 9, 8, 10]

### Constraints:

* `1 ≤ N ≤ 10^5`
* `0 ≤ start ≤ end < N`
* `-10^9 ≤ arr[i] ≤ 10^9`

### Important Points to Understand:

**1. In-Place Reversal:**
* Modify the original array without creating a new array.
* Use O(1) extra space (only variables for swapping).

**2. Two-Pointer Technique:**
* Use two pointers: one at `start`, one at `end`.
* Swap elements and move pointers toward each other.
* Stop when pointers meet or cross.

**3. Partial Reversal:**
* Only the elements within the specified range are reversed.
* Elements outside the range remain unchanged.

**4. Edge Cases:**
* When `start === end`, no reversal needed (single element).
* When `start === 0` and `end === N-1`, reverse entire array.

### Approach:

**Two-Pointer Approach (Optimal):**
1. Initialize two pointers: `left = start` and `right = end`.
2. While `left < right`:
   * Swap `arr[left]` and `arr[right]`.
   * Increment `left` by 1.
   * Decrement `right` by 1.
3. Return the modified array.

### Time Complexity:

* **Time Complexity = O(K)** where K = (end - start + 1) / 2
  * In the worst case (reversing entire array): O(N/2) ≈ O(N)
  * We iterate through half the elements in the range.

### Space Complexity:

* **Space Complexity = O(1)** 
  * We only use a few variables for swapping.
  * No additional data structures are created.

### Dry Run:

```
Input: arr = [1, 2, 3, 4, 5, 6], start = 1, end = 4

Initial state:
    arr = [1, 2, 3, 4, 5, 6]
    left = 1
    right = 4

Iteration 1:
    left = 1, right = 4
    arr[1] = 2, arr[4] = 5
    Swap: arr = [1, 5, 3, 4, 2, 6]
    left = 2, right = 3

Iteration 2:
    left = 2, right = 3
    arr[2] = 3, arr[3] = 4
    Swap: arr = [1, 5, 4, 3, 2, 6]
    left = 3, right = 2

Loop ends (left >= right)

Final array: [1, 5, 4, 3, 2, 6]

Output: [1, 5, 4, 3, 2, 6]
```

### Brute Force Approach:

**Using Extra Array:**
```javascript
function reverseInRangeBruteForce(arr, start, end) {
    // Create a temporary array to store reversed elements
    const temp = [];
    
    // Store elements in reverse order
    for (let i = end; i >= start; i--) {
        temp.push(arr[i]);
    }
    
    // Copy back to original array
    let j = 0;
    for (let i = start; i <= end; i++) {
        arr[i] = temp[j];
        j++;
    }
    
    return arr;
}
```

**Time Complexity:** O(K) where K = end - start + 1
**Space Complexity:** O(K) - extra array for temporary storage

### Visualization:

```
Example: arr = [1, 2, 3, 4, 5, 6], start = 1, end = 4

Step-by-step visualization:

Initial:
Index:  0  1  2  3  4  5
Array: [1, 2, 3, 4, 5, 6]
            ↑        ↑
         left      right

After Swap 1:
Index:  0  1  2  3  4  5
Array: [1, 5, 3, 4, 2, 6]
               ↑  ↑
            left right

After Swap 2:
Index:  0  1  2  3  4  5
Array: [1, 5, 4, 3, 2, 6]
                  ↑↑
              left right (stop)

Final result: [1, 5, 4, 3, 2, 6]
```

### Optimized Approach - JavaScript Code:

```javascript
function reverseInRange(arr, start, end) {
    let left = start;
    let right = end;
    
    while (left < right) {
        // Swap elements at left and right
        [arr[left], arr[right]] = [arr[right], arr[left]];
        
        // Move pointers toward each other
        left++;
        right--;
    }
    
    return arr;
}
```

### Alternative Approach (Using Temporary Variable):

```javascript
function reverseInRange(arr, start, end) {
    let left = start;
    let right = end;
    
    while (left < right) {
        // Swap using temporary variable
        const temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        
        left++;
        right--;
    }
    
    return arr;
}
```

### Using Array Methods (Less Optimal):

```javascript
function reverseInRange(arr, start, end) {
    // Extract the range
    const reversedPart = arr.slice(start, end + 1).reverse();
    
    // Replace the range with reversed part
    for (let i = 0; i < reversedPart.length; i++) {
        arr[start + i] = reversedPart[i];
    }
    
    return arr;
}
```

**Note:** This approach uses O(K) extra space due to `slice()` and `reverse()`.

### Edge Cases to Consider:

**1. Single Element Range (start === end):**
* Input: arr = [1, 2, 3], start = 1, end = 1
* Output: [1, 2, 3] (no change)
* Reversal not needed.

**2. Entire Array (start = 0, end = N-1):**
* Input: arr = [1, 2, 3, 4], start = 0, end = 3
* Output: [4, 3, 2, 1]
* Complete array reversal.

**3. Two Elements:**
* Input: arr = [10, 20], start = 0, end = 1
* Output: [20, 10]
* Simple swap.

**4. First Half:**
* Input: arr = [1, 2, 3, 4, 5, 6], start = 0, end = 2
* Output: [3, 2, 1, 4, 5, 6]

**5. Second Half:**
* Input: arr = [1, 2, 3, 4, 5, 6], start = 3, end = 5
* Output: [1, 2, 3, 6, 5, 4]

**6. Adjacent Elements:**
* Input: arr = [5, 10, 15, 20], start = 1, end = 2
* Output: [5, 15, 10, 20]

**7. Negative Numbers:**
* Input: arr = [-5, -10, 15, 20], start = 0, end = 3
* Output: [20, 15, -10, -5]

### Key Takeaways:

1. **Two-pointer technique** is perfect for in-place array reversal problems.

2. **Space optimization:** In-place reversal uses O(1) space vs O(N) for creating new arrays.

3. **Symmetry concept:** Swapping elements symmetrically from both ends is efficient.

4. **Partial vs complete:** This pattern works for both partial and complete array reversal.

5. **Building block:** This technique is used in:
   * String reversal
   * Palindrome checking
   * Array rotation
   * Reversing words in a sentence

6. **Interview strategy:**
   * Explain the two-pointer approach clearly.
   * Mention in-place modification.
   * Walk through the swapping process.
   * Discuss edge cases.

7. **Common applications:**
   * Rotating arrays
   * Palindrome problems
   * Reversing linked lists
   * Image processing (mirror effects)

8. **Optimization note:** JavaScript destructuring `[arr[left], arr[right]] = [arr[right], arr[left]]` is clean but may be slightly slower than using a temp variable in performance-critical code.

9. **Testing strategy:**
   * Test with single element range.
   * Test with entire array.
   * Test with first/last elements.
   * Test with middle elements.
   * Test with negative numbers.

10. **Related problems:**
    * Reverse entire array
    * Rotate array by K positions
    * Reverse words in a string
    * Palindrome checking
    * Dutch National Flag problem (3-way partitioning)

