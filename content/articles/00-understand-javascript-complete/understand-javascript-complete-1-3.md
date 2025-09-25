---
title: "Hoisting"
description: "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during the creation phase. It's not magic—it's a direct result of how execution contexts work. Understanding hoisting helps you predict how your code will behave and avoid common pitfalls."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-25"
datePublished: "2025-09-25"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: "JS course PDF - 3"
    type: "PDF"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1758792130/Portfolio/javaScriptCourse/pdf/JavaScript-day3_Hoisting_compressed.pdf"
    description: "A PDF Notes on Hoisting topic"
  - title: "MDN - Hoisting"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting"
    description: "Official MDN documentation explaining hoisting behavior in JavaScript"
  - title: "You Don't Know JS - Hoisting"
    type: "article"
    url: "https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch5.md"
    description: "Deep dive into hoisting from the You Don't Know JS book series"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758809861/Portfolio/javaScriptCourse/images/4/4_zqjd0e.png)

Hoisting – The Magic Trick That's Not Really Magic
===================================================

Imagine you're a **stage magician** preparing for a big show. Before the audience arrives, you carefully set up all your props behind the curtain – placing cards in specific positions, arranging mirrors, and positioning your assistant. When the show begins and the curtain opens, it looks like magic when you instantly produce a rabbit from a hat that "wasn't there before."

This is exactly what **hoisting** is like in JavaScript. It's not actually magic – it's just the **setup phase** happening before the execution show begins.

## What is Hoisting?

**Hoisting** is JavaScript's behavior of moving variable and function declarations to the "top" of their scope during compilation. But here's the important part: **only the declarations are hoisted, not the initializations**.

Think of it as JavaScript doing a **pre-scan** of your code, like a director reading through the entire script before filming begins.

### The Pre-Show Setup (Creation Phase)

Remember our kitchen analogy from the Execution Context lesson? Before the chef starts cooking, there's a **setup phase** where:

- All the ingredients (variables) are labeled and placed on shelves, marked as `undefined`
- All the recipes (functions) are written down completely and stored in the recipe book
- The kitchen is organized and ready for cooking

```javascript
// What you write
console.log(magicNumber); // undefined (not an error!)
var magicNumber = 42;

function abracadabra() {
  return "✨ Magic!";
}

console.log(abracadabra()); // "✨ Magic!" (works perfectly!)
```

### Behind the Scenes (How JavaScript Sees It)

During the creation phase, JavaScript internally reorganizes your code like this:

```javascript
// How JavaScript interprets it during setup
var magicNumber; // Declaration hoisted, value = undefined

function abracadabra() { // Entire function hoisted
  return "✨ Magic!";
}

// Execution phase begins
console.log(magicNumber); // undefined (setup phase already declared it)
magicNumber = 42; // Now assignment happens
console.log(abracadabra()); // Function was fully available from the start
```

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758801567/Portfolio/javaScriptCourse/images/03/hoisting_phases.png)

## The Theater Analogy – Three Acts of Hoisting

### Act 1: The `var` Performer 🎭

`var` is like an **optimistic actor** who shows up early to rehearsal but doesn't know their lines yet.

```javascript
console.log(actor); // undefined (actor is present but unprepared)
var actor = "Ready to perform!";
console.log(actor); // "Ready to perform!" (now they know their lines)
```

**What happens:**
1. **Setup Phase**: `var actor` is declared and set to `undefined`
2. **Execution Phase**: `actor = "Ready to perform!"` assignment happens

### Act 2: The `let` and `const` Method Actors 🎬

`let` and `const` are **method actors** – they're technically present during setup, but they refuse to perform until their official entrance (initialization).

```javascript
console.log(mysterious); // ReferenceError: Cannot access 'mysterious' before initialization
let mysterious = "I'm here but not ready!";

console.log(secretAgent); // ReferenceError: Cannot access 'secretAgent' before initialization  
const secretAgent = "Agent 007";
```

This creates what's called the **"Temporal Dead Zone"** – the time between hoisting and initialization where the variable exists but can't be accessed.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758801789/Portfolio/javaScriptCourse/images/03/temporal_dead_zone.png)

### Act 3: The Function Stars ⭐

Functions are the **lead actors** – they arrive fully prepared with their complete performance memorized.

```javascript
// This works perfectly!
performMagic(); // "Abracadabra! 🎩✨"

function performMagic() {
  return "Abracadabra! 🎩✨";
}
```

**But wait!** Function expressions behave differently:

```javascript
// This throws an error!
tryMagic(); // TypeError: tryMagic is not a function

var tryMagic = function() {
  return "Maybe magic? 🤷‍♂️";
};
```

Why? Because `var tryMagic` gets hoisted as `undefined`, so calling `tryMagic()` is like trying to call `undefined()`.

## Real-World Examples – Hoisting in Action

### Example 1: The Quiz Question That Trips Everyone Up

```javascript
var score = 1;

function checkScore() {
  console.log(score); // What gets printed?
  var score = 5;
  console.log(score); // What about this?
}

checkScore();
```

**Answer**: 
- First `console.log`: `undefined` 
- Second `console.log`: `5`

**Why?** The function creates its own scope, and `var score` inside the function gets hoisted to the top of that function scope, shadowing the global `score`.

### Example 2: The Function Declaration vs Expression Showdown

```javascript
// This works
console.log(add(2, 3)); // 5

function add(a, b) {
  return a + b;
}

// This doesn't work
console.log(subtract(5, 2)); // TypeError: subtract is not a function

var subtract = function(a, b) {
  return a - b;
};
```

### Example 3: The `let` and `const` Reality Check

```javascript
function modernJavaScript() {
  console.log(x); // ReferenceError
  console.log(y); // ReferenceError
  
  let x = 1;
  const y = 2;
}
```

Unlike `var`, `let` and `const` are hoisted but remain inaccessible until their declaration line is reached.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758802001/Portfolio/javaScriptCourse/images/03/var_vs_let_const.png)

## Best Practices – Avoiding the Hoisting Traps

### 1. Declare Before You Use
```javascript
// Good practice
let userName = "Alice";
console.log(userName); // "Alice"

// Avoid this confusion
console.log(userName); // undefined or error
var userName = "Alice";
```

### 2. Prefer `let` and `const` Over `var`
```javascript
// Modern approach
const PI = 3.14159;
let radius = 5;
let area = PI * radius * radius;

// Old-school approach (avoid)
var PI = 3.14159;
var radius = 5;
var area = PI * radius * radius;
```

### 3. Use Function Declarations for Main Functions
```javascript
// This reads clearly and works due to hoisting
function calculateTotal(price, tax) {
  return price + (price * tax);
}

let total = calculateTotal(100, 0.08);
```

### 4. Understand the Temporal Dead Zone
```javascript
// This throws an error
console.log(newVariable); // ReferenceError
let newVariable = "Hello";

// This is safe
let safeVariable = "Hello";
console.log(safeVariable); // "Hello"
```

## Common Interview Questions & Answers

### Q1: What will this code output?
```javascript
var a = 1;
function test() {
  console.log(a); // ?
  var a = 2;
  console.log(a); // ?
}
test();
```

**Answer**: `undefined`, then `2`. The local `var a` declaration is hoisted to the top of the function, shadowing the global `a`.

### Q2: Explain the difference between these two:
```javascript
// Version A
foo(); // Works
function foo() { console.log("A"); }

// Version B  
bar(); // Error
var bar = function() { console.log("B"); };
```

**Answer**: Function declarations are fully hoisted, but function expressions follow `var` hoisting rules (declared as `undefined` first).

## Summary

Hoisting is JavaScript's **two-phase process**:

1. **Creation Phase**: Declarations are processed and memory is allocated
   - `var`: Declared and initialized with `undefined`
   - `let`/`const`: Declared but not initialized (Temporal Dead Zone)
   - Functions: Fully hoisted with their complete definition

2. **Execution Phase**: Code runs line by line, assignments happen

### Key Takeaways

- **Hoisting is not magic** – it's a result of how JavaScript's execution context works
- **Only declarations are hoisted**, not initializations  
- **`var` hoists to `undefined`**, `let`/`const` create a Temporal Dead Zone
- **Function declarations are fully hoisted**, function expressions follow variable hoisting rules
- **Understanding hoisting helps you** write more predictable code and debug issues faster

### My Personal Insight
When I first learned about hoisting, I thought it was a weird JavaScript quirk. But once I understood it's just the **creation phase of execution contexts**, everything clicked. It's not JavaScript being weird – it's JavaScript being systematic about setting up the environment before executing code.

The magic trick isn't the hoisting itself – it's understanding that JavaScript has been showing you exactly how it works all along! 🎩✨

### Next Up
Now that you understand how JavaScript sets up variables and functions during the creation phase, we'll explore **Scope and Lexical Environment** – how JavaScript decides which variables your functions can access and when.
