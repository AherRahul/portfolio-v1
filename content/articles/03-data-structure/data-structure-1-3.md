---
title: "Problem - Loops - 1"
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

Problem - Loops - 1
---------------------------------------------------

### Problem: 1. Print All Even Numbers from an Array
Write a program to print all even numbers from an array.

### Example
**Input:** \[ 10, 3, 5, 2, 7, 6, 9 \]  
**Output:** 10 2 6


### Approach
1. Iterate through each element in the array.  
2. Check if the element is divisible by 2.  
3. If yes, print the element (it’s even).


### Visualisation
![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759923502/Portfolio/dsa/images/00/ebad9c40-25b2-4eef-ae71-eb384f0d8c23.png)

### Code Implementation
```js
let arr = [10, 3, 5, 2, 7, 6, 9];

// Iterate through each element in the array.
for (let i = 0; i < arr.length; i++) {
  
  // Check if the element is divisible by 2. 
  if (arr[i] % 2 === 0) {

    // print the element
    console.log(arr[i]);
  }
}
```
