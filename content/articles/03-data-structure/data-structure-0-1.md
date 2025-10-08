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

## Problem: 1. Sum of Two Integers

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

---

## Poblem: 2. Find the Square of a Number

## Problem Statement
Write a function that takes an **integer** and returns its **square**.  
Call this function and print the result.

> `square(x)` is a function that computes the square of a number and **returns** the result instead of printing it.


### Example

**Input:** `3`  
**Process:** `square(3) = 3 × 3 = 9`  
**Output:** `The square is: 9`


## Approach

1. Define a function that takes **one integer** as input.  
2. Compute the square of the number (`x * x`).  
3. Return the result from the function.  
4. Call the function and print the returned value.


## Visualization

```
   Input (x): 3
        ↓
   Compute: 3 × 3 = 9
        ↓
   Output: The square is 9
```


## Explanation

- `square(x)` is a function that takes an integer as input.  
- It calculates the square using `x * x`.  
- Instead of printing the result **inside** the function, it **returns** the value.  
- The result is printed **outside** by calling the function.


## Code Examples

### JavaScript
```javascript
function square(x) {
  return x * x;
}
let result = square(3);
console.log("The square is:", result);
```


>  **Key Takeaway:**  
> Returning values from functions makes them **reusable** and **modular**, allowing flexible output handling.

---

## Problem: 3. Check Voting Eligibility

### Problem Statement
Write a program that accepts a number (**age**) and checks whether the person is **eligible to vote**.  A person is eligible if their **age is 18 or more**.


### Example
**Input:** `20`  
**Process:** Check if `20 ≥ 18 → Eligible`  
**Output:** `You are eligible to vote.`


## Approach
1. Take input from the user (or define a variable).  
2. Use a conditional statement to check if `age >= 18`.  
3. If yes → print **"You are eligible to vote."**  
4. Otherwise → print **"You are not eligible to vote."**


## Visualization
```
   Input (age): 20
        ↓
   Check: Is 20 ≥ 18?
        ↓
   Yes → Output: "You are eligible to vote."
```


## Explanation
- Accept **age** as input.  
- Use condition `if age >= 18` to check eligibility.  
- Show the appropriate message based on the condition.  
- The same logic works across all programming languages.


## Code Examples

### JavaScript
```javascript
let age = 20;

if (age >= 18) {
  console.log("You are eligible to vote.");
} else {
  console.log("You are not eligible to vote.");
}
```

> **Key Takeaway:**  
> Conditional statements are used to make **decisions** in programs — they help control **program flow** based on conditions.

---
## Problem: 4. Even or Odd

### Problem Statement:
Write a function that accepts a number and checks whether it is **Even or Odd**. If the number is divisble by 2, it’s an Even number. Otherwise, it’s an Odd number. Test the function with inputs **18 and 5**.

### Example
- Input: 18 → Output: Even Number
- Input: 5 → Output: Odd Number

### Approach
- Create a function that takes a number.
- If **number % 2 === 0**, return **“Even”**.
- Else return **“Odd”**.

### Visualisation:
Even Odd Visual

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759922900/Portfolio/dsa/images/00/e1203f35-595b-41dd-abac-dc7f61d7f032.png)


### Explanation:
- Accept the input number in the function.
- Check if the number modulo 2 equals 0.
- If yes, print or return “Even”.
- Otherwise, print or return “Odd”.
- Test the function with different numbers to verify correctness.

```js
function checkEvenOrOdd(number) {
  if (number % 2 === 0) {
    console.log("Even Number");
  } else {
    console.log("Odd Number");
  }
}
checkEvenOrOdd(18);
checkEvenOrOdd(5);
```