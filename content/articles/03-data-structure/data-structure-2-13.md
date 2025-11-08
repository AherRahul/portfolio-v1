---
title: "Reverse the Array"
description: "Learn the fundamental technique of reversing an entire array. Master the two-pointer approach, understand in-place array manipulation, and explore multiple methods to reverse arrays efficiently."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Array Manipulation Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse"
    description: "JavaScript Array.reverse() documentation"
  - title: "Array Visualization"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Interactive array operations visualization"
  - title: "Array Practice Problems"
    type: "practice"
    url: "https://leetcode.com/tag/array/"
    description: "Practice array manipulation challenges"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Reverse the Array
----------------------------

### Problem Statement:

Given an array `arr` of `N` integers, reverse the array **in-place**.

Reversing an array means changing the order of elements such that the first element becomes the last, the second element becomes the second last, and so on.

**Note:** Modify the original array without using extra space for another array.

### Examples:

#### Example 1:

**Input:** arr = [1, 2, 3, 4, 5]

**Output:** [5, 4, 3, 2, 1]

**Explanation:** 
* Original array: [1, 2, 3, 4, 5]
* After reversing: [5, 4, 3, 2, 1]

#### Example 2:

**Input:** arr = [10, 20, 30]

**Output:** [30, 20, 10]

**Explanation:** 
* Original array: [10, 20, 30]
* After reversing: [30, 20, 10]

#### Example 3:

**Input:** arr = [7]

**Output:** [7]

**Explanation:** 
* Single element array remains the same after reversal.

#### Example 4:

**Input:** arr = [100, 200]

**Output:** [200, 100]

**Explanation:** 
* Two elements are simply swapped.

### Constraints:

* `1 ≤ N ≤ 10^5`
* `-10^9 ≤ arr[i] ≤ 10^9`

### Important Points to Understand:

**1. In-Place Operation:**
* Modify the original array directly.
* Do not create a new array.
* Use O(1) extra space (only variables for swapping).

**2. Two-Pointer Technique:**
* Place one pointer at the start (index 0).
* Place another pointer at the end (index N-1).
* Swap elements and move pointers toward center.
* Stop when pointers meet or cross.

**3. Symmetry:**
* The first element swaps with the last.
* The second element swaps with the second last.
* Continue until reaching the middle.

**4. Number of Swaps:**
* For an array of size N, we need N/2 swaps.
* Example: Array of 5 elements needs 2 swaps (indices 0↔4, 1↔3, middle stays).

### Approach:

**Two-Pointer Approach (Optimal):**
1. Initialize two pointers: `left = 0` and `right = N - 1`.
2. While `left < right`:
   * Swap `arr[left]` and `arr[right]`.
   * Increment `left` by 1.
   * Decrement `right` by 1.
3. Return the modified array.

### Time Complexity:

* **Time Complexity = O(N/2) ≈ O(N)**
  * We iterate through half of the array.
  * Each iteration performs a constant-time swap operation.

### Space Complexity:

* **Space Complexity = O(1)** 
  * We only use a few variables (left, right, temp).
  * No additional data structures are created.

### Dry Run:

```
Input: arr = [1, 2, 3, 4, 5]

Initial state:
    arr = [1, 2, 3, 4, 5]
    left = 0
    right = 4
    N = 5

Iteration 1:
    left = 0, right = 4
    arr[0] = 1, arr[4] = 5
    Swap: arr = [5, 2, 3, 4, 1]
    left = 1, right = 3

Iteration 2:
    left = 1, right = 3
    arr[1] = 2, arr[3] = 4
    Swap: arr = [5, 4, 3, 2, 1]
    left = 2, right = 2

Loop ends (left >= right)

Final array: [5, 4, 3, 2, 1]

Output: [5, 4, 3, 2, 1]
```

### Dry Run - Even Length Array:

```
Input: arr = [10, 20, 30, 40]

Initial state:
    arr = [10, 20, 30, 40]
    left = 0
    right = 3
    N = 4

Iteration 1:
    left = 0, right = 3
    arr[0] = 10, arr[3] = 40
    Swap: arr = [40, 20, 30, 10]
    left = 1, right = 2

Iteration 2:
    left = 1, right = 2
    arr[1] = 20, arr[2] = 30
    Swap: arr = [40, 30, 20, 10]
    left = 2, right = 1

Loop ends (left >= right)

Final array: [40, 30, 20, 10]

Output: [40, 30, 20, 10]
```

### Brute Force Approach:

**Using Extra Array:**
```javascript
function reverseArrayBruteForce(arr) {
    const N = arr.length;
    const reversed = [];
    
    // Copy elements in reverse order
    for (let i = N - 1; i >= 0; i--) {
        reversed.push(arr[i]);
    }
    
    // Copy back to original array
    for (let i = 0; i < N; i++) {
        arr[i] = reversed[i];
    }
    
    return arr;
}
```

**Time Complexity:** O(N) - two passes through the array
**Space Complexity:** O(N) - extra array for temporary storage ❌

### Visualization:

```
Example: arr = [1, 2, 3, 4, 5]

Step-by-step visualization:

Initial:
Index:  0  1  2  3  4
Array: [1, 2, 3, 4, 5]
        ↑           ↑
      left        right

After Swap 1:
Index:  0  1  2  3  4
Array: [5, 2, 3, 4, 1]
           ↑     ↑
         left  right

After Swap 2:
Index:  0  1  2  3  4
Array: [5, 4, 3, 2, 1]
              ↑
          left/right (stop)

Final: [5, 4, 3, 2, 1]
```

### Optimized Approach - JavaScript Code:

```javascript
function reverseArray(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        // Swap elements using array destructuring
        [arr[left], arr[right]] = [arr[right], arr[left]];
        
        // Move pointers toward center
        left++;
        right--;
    }
    
    return arr;
}
```

### Alternative Approach 1 (Using Temporary Variable):

```javascript
function reverseArray(arr) {
    let left = 0;
    let right = arr.length - 1;
    
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

### Alternative Approach 2 (Using For Loop):

```javascript
function reverseArray(arr) {
    const N = arr.length;
    
    // Only need to swap first half with second half
    for (let i = 0; i < Math.floor(N / 2); i++) {
        // Swap arr[i] with arr[N-1-i]
        const temp = arr[i];
        arr[i] = arr[N - 1 - i];
        arr[N - 1 - i] = temp;
    }
    
    return arr;
}
```

### Alternative Approach 3 (Using Built-in Method):

```javascript
function reverseArray(arr) {
    // JavaScript's built-in reverse() method
    return arr.reverse();
}
```

**Note:** While `arr.reverse()` is concise, understanding the manual implementation is crucial for interviews and for languages without built-in reverse methods.

### Alternative Approach 4 (Recursive):

```javascript
function reverseArrayRecursive(arr, left = 0, right = arr.length - 1) {
    // Base case: pointers have met or crossed
    if (left >= right) {
        return arr;
    }
    
    // Swap current elements
    [arr[left], arr[right]] = [arr[right], arr[left]];
    
    // Recursive call with updated pointers
    return reverseArrayRecursive(arr, left + 1, right - 1);
}
```

**Time Complexity:** O(N)
**Space Complexity:** O(N) due to recursion call stack ❌ (Not optimal)

### Edge Cases to Consider:

**1. Empty Array:**
* Input: arr = []
* Output: []
* No reversal needed.

**2. Single Element:**
* Input: arr = [5]
* Output: [5]
* Array remains unchanged.

**3. Two Elements:**
* Input: arr = [10, 20]
* Output: [20, 10]
* Simple swap.

**4. All Same Elements:**
* Input: arr = [7, 7, 7, 7]
* Output: [7, 7, 7, 7]
* Looks same but swaps still occur.

**5. Negative Numbers:**
* Input: arr = [-5, -10, 15, 20]
* Output: [20, 15, -10, -5]
* Works the same way.

**6. Large Array:**
* Input: arr of size 10^5
* Should handle efficiently with O(N) time.

**7. Mixed Positive and Negative:**
* Input: arr = [1, -2, 3, -4, 5]
* Output: [5, -4, 3, -2, 1]

### Key Takeaways:

1. **Two-pointer technique** is the standard approach for in-place array reversal.

2. **Space efficiency:** In-place reversal uses O(1) space, which is optimal.

3. **Understanding swapping:** Master different ways to swap elements:
   * Using temp variable
   * Using array destructuring
   * Using XOR (for integers)

4. **Half iterations:** We only need to iterate through half the array.

5. **Foundation for advanced problems:** Array reversal is used in:
   * Array rotation
   * Palindrome checking
   * String manipulation
   * Matrix rotation
   * Reversing linked lists

6. **Interview strategy:**
   * Start by explaining the two-pointer approach.
   * Mention time and space complexity.
   * Walk through an example.
   * Discuss edge cases (empty, single element).
   * Optionally mention built-in methods but show manual implementation.

7. **Built-in vs Manual:**
   * Use `arr.reverse()` in production code (optimized).
   * Understand manual implementation for interviews.
   * Manual implementation demonstrates algorithmic thinking.

8. **Related techniques:**
   * Reversing subarrays
   * Reversing words in a string
   * Rotating arrays
   * Two-pointer pattern

9. **Common mistakes:**
   * Going beyond N/2 iterations (causes double reversal).
   * Not handling empty arrays.
   * Creating unnecessary extra arrays.
   * Off-by-one errors in loop conditions.

10. **Optimization tricks:**
    * For very large arrays, consider:
      * SIMD (Single Instruction Multiple Data) operations
      * Parallel processing (for arrays > 10^6 elements)
      * Cache-friendly access patterns
    * But for interviews, the simple two-pointer approach is perfect!

11. **Applications in real-world:**
    * Undo operations in editors
    * Reversing history/timeline
    * Stack implementation (reversing order)
    * Image processing (horizontal flip)
    * Audio processing (reverse playback)

12. **Testing checklist:**
    * ✓ Empty array
    * ✓ Single element
    * ✓ Two elements
    * ✓ Odd length array
    * ✓ Even length array
    * ✓ Negative numbers
    * ✓ Large arrays
    * ✓ All same elements

