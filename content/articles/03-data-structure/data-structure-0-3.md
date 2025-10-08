---
title: "Problem - Loops - 2"
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

Problem - Loops - 2
----------------------

### Loops Problems – Negative Count, Smallest, and Largest Number

### Problem 1: Count Negative Numbers
Write a function that returns the number of negative numbers in an array.

### Approach
1. Initialize a counter to `0`.
2. Loop through the array.
3. If the element is less than `0`, increment the counter.
4. Return the final count after the loop ends.

### Example
**Input:** `arr = [2, -6, 4, 8, 1, -9]`  
**Output:** `2`

### Time & Space Complexity
- **Time Complexity:** O(n) — where *n* is the number of elements in the array.  
- **Space Complexity:** O(1) — Only a counter variable is used.

### Visualization
![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759924407/Portfolio/dsa/images/00/8e32a025-205a-4ba0-ba7e-d71aa22aaba0.png)


### Code (JavaScript)
```javascript
function countNegativeNumbers(arr) {
  let count = 0;
  
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) {
      count++;
    }
  }
  
  return count;
}

let arr = [2, -6, 4, 8, 1, -9];
let result = countNegativeNumbers(arr);
console.log("Result:", result); // Output: 2
```

---

### Problem 2: Find Smallest Number
Write a function that returns the smallest number in an array.

### Approach
1. Initialize a variable `smallest` to `Infinity`.
2. Loop through the array.
3. If the current element is less than `smallest`, update `smallest`.
4. Return `smallest` after the loop ends.

### Example
**Input:** `arr = [2, -6, 4, 8, 1, -9]`  
**Output:** `-9`

### Time & Space Complexity
- **Time Complexity:** O(n) — where *n* is the number of elements in the array.  
- **Space Complexity:** O(1) — Only a single variable is used.

### Visualization
![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759924462/Portfolio/dsa/images/00/b9eb4fb6-7257-4bb4-b783-c86c655555bd.png)


### Code (JavaScript)
```javascript
function findSmallest(arr) {
  let smallest = Infinity;
  
  for (let i = 0; i < arr.length; i++) {
    
    if (arr[i] < smallest) {
      smallest = arr[i];
    }
  }
  
  return smallest;
}

let arr = [2, -6, 4, 8, 1, -9];
let result = findSmallest(arr);
console.log("Result:", result); // Output: -9
```

---

### Problem 3: Find Largest Number
Write a function that returns the largest number in an array.

### Approach
1. Initialize a variable `largest` to `-Infinity`.
2. Loop through the array.
3. If the current element is greater than `largest`, update `largest`.
4. Return `largest` after the loop ends.

### Example
**Input:** `arr = [2, -6, 4, 8, 1, -9]`  
**Output:** `8`

### Time & Space Complexity
- **Time Complexity:** O(n) — where *n* is the number of elements in the array.  
- **Space Complexity:** O(1) — Only a counter variable is used.

### Visualization
![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759924497/Portfolio/dsa/images/00/e7bbd40b-14d8-4437-849b-be4b02a1e235.png)


### Code (JavaScript)
```javascript
function findLargest(arr) {
  let largest = -Infinity;
  
  for (let i = 0; i < arr.length; i++) {
    
    if (arr[i] > largest) {
      largest = arr[i];
    }
  }
  
  return largest;
}

let arr = [2, -6, 4, 8, 1, -9];
let result = findLargest(arr);
console.log("Result:", result); // Output: 8
```

