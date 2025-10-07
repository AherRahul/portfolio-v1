---
title: "Problem - Functions, if-else"
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

Problem - Functions, if-else
-----------------------------

###  Problem Statement

Write a program that defines a **function** to calculate the **sum of two integers** and prints the result.  
Then, call this function by passing two integer values as arguments.

## Approach

1. **Define a function** that takes two numbers as inputs.  
2. **Perform addition** of those two numbers inside the function.  
3. **Store** the result in a variable.  
4. **Print** the result to display the output.  
5. **Call the function** by passing two integers (for example, `5` and `3`).


## Example

**Input:** 5, 3
**Process:** a + b = 5 + 3 = 8
**Output:** 8

##  Visualization

Imagine two input numbers — **a = 5** and **b = 3**.  
The function `sum(a, b)` takes both inputs, adds them, and prints the result.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759838765/Portfolio/dsa/images/00/62532d21-3537-440d-ab8e-7c34d8486d88.png)

## Explanation

- `sum(a, b)` is a function that takes two arguments.  
- It adds them and stores the result in a variable named `add`.  
- The function then prints the result using `console.log()`.  
- When we call `sum(5, 3)`, the function executes and prints **8**.


## JavaScript Code

```javascript
function sum(a, b) {
  let add = a + b;
  console.log(add);
}

sum(5, 3); // Output: 8
```
## Summary
- Define a function with two parameters
- Add the two numbers
- Store the result in a variable 
- Print the result 
- Call the function with given inputs
