---
title: Hoisting
description: Hoisting is JavaScript's behavior of moving variable and function
  declarations to the top of their scope during the creation phase. It's not
  magic—it's a direct result of how execution contexts work. Understanding
  hoisting helps you predict how your code will behave and avoid common
  pitfalls.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-01-29
datePublished: 2026-09-25
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: JS course PDF - 3
    type: PDF
    url: https://res.cloudinary.com/duojkrgue/image/upload/v1758791650/Portfolio/javaScriptCourse/pdf/JavaScript-day-3_Hoisting_tj99ch.pdf
    description: A PDF Notes on Hoisting topic
  - title: MDN - Hoisting
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
    description: Official MDN documentation explaining hoisting behavior in JavaScript
  - title: You Don't Know JS - Hoisting
    type: article
    url: https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch5.md
    description: Deep dive into hoisting from the You Don't Know JS book series
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758809861/Portfolio/javaScriptCourse/images/4/4_zqjd0e.png)

JavaScript Hoisting and Variable Behavior
------------------------------------------------------

### Introduction to Hoisting

Hoisting is a concept which enables us to extract values of variables and functions even before initialising/assigning value without getting error and this is happening due to the 1st phase (memory creation phase) of the Execution Context.

So in previous lecture, we learnt that execution context gets created in two phase, so even before code execution, memory is created so in case of variable, it will be initialized as undefined while in case of function the whole function code is placed in the memory

Hoisting in JavaScript is a behavior where variable and function declarations are moved to the top (not physically but due to creation and execution phase) of their during the compilation phase, before code execution begins. This process is not magic but a systematic setup that allows certain variables and functions to be accessible before their actual declaration in the code.

Only declarations are hoisted, not initializations. This that variables declared with var are hoisted as undefined, and functions declared with function declarations are fully hoisted with their entire body available from the start. We will see that by example's.

### The Creation Phase (Pre- Setup)

Before execution, JavaScript performs a creation phase where it scans the code to allocate memory and set up the environment:

*   Variables declared with var are hoisted, i.e. initialized with *undefined*.
    
*   Variables declared with let and const are hoisted, but remain in the *Temporal Dead Zone (TDZ)* until initialized.
    
*   Function declarations are hoisted with their full code, making them callable from the start.
    
```   
console.log(magicNumber); // undefined  
var magicNumber = 42

function abracadabra() {    
  return "Magic!";  
}   
```

During the creation phase, JavaScript interprets this as:

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759229819/Portfolio/javaScriptCourse/images/03/c8077608-cba0-4461-bf03-fb8a5f1a13c8.png)


```   
var magicNumber; // hoisted as undefined  

function abracadabra() {} // fully hoisted   
```

The Theater Analogy: Three Acts of Hoisting
-----------------------------------------------

### Act 1: The var Performer

Similar to an showing up early but not knowing their lines, var variables are hoisted as undefined. They are declared but uninitialized until assignment occurs during execution.

```   
console.log(actor); // undefined

var actor = "Ready to perform!";  

console.log(actor); // "Ready to perform!"   
```

### Act 2: The let and const Method Actors
```   
console.log(mysterious) // ReferenceError  

let mysterious = "I'm here!";   
```
ReferenceError. We get reference error because let and const variable are in **Temoral Dead Zone** during the creation phase. 

#### What is the Temporal Dead Zone (TDZ)?
  - The TDZ is the time between when a block scope is entered and when a let or const variable is declared and initialized.
  - During this period, the variable exists in memory but cannot be accessed. Any attempt to read it throws a ReferenceError.


#### Where are let and const stored during TDZ?
  - When JavaScript executes code, it creates an Execution Context. In that context, there’s an **Environment Record** that keeps track of variables. 
  - **For var**: the variable is hoisted and initialized to undefined.
  - **For let and const**: They are also hoisted, but not initialized. Instead, they are placed in the Environment Record with a special state called “uninitialized”. They stay in this state until execution reaches the line where they are declared. So during TDZ, let and const do exist in memory (inside the Environment Record of that scope), but any access throws an error because initialization hasn’t occurred yet.

```
{
  console.log(x); // ❌ ReferenceError (TDZ)
  let x = 10;
  console.log(x); // ✅ 10
}
```

#### When the block scope starts:
  1. x is added to the Environment Record but marked as uninitialized.
  2. At the first console.log(x): accessing it before initialization → ReferenceError.
  3. At let x = 10;: x gets initialized with 10.
  4. At the second console.log(x): works fine.


#### Key Difference Between let and const
  - Both behave the same way in TDZ.
  - Difference: const must be initialized at declaration, while let can be initialized later.

```
const y; // ❌ SyntaxError: Missing initializer
```

#### So in summary:
  - During TDZ, let and const are stored in the Environment Record of the current Execution Context in an uninitialized state.
  - They exist in memory, but you can’t access them until the declaration line is executed.

### Act 3: The Function Stars

Function declarations are the main actors, arriving fully prepared and available from the start. Function expressions, however behave like variables and follow var hoisting rules, resulting in undefined if called before assignment.

```   
performMagic(); // "Abracadabra!"  

function performMagic() {    
  return Abracadabra!";  
}

tryMagic(); // TypeError  

var tryMagic = function() {
  return "Maybe magic?";  
};   
```

### Real-World Examples of Hoisting

*   **Variable Shadowing:** Inside a function, a local var variable shadows a global variable, leading to undefined during the initial console.log.
    
*   Function declarations are hoisted fully, but function expressions assigned to variables are hoisted as undefined.
    
*   **Let and Const:** These are hoisted but until initialized, causing ReferenceError if accessed prematurely.
    

### Best Practices to Avoid Hoisting Confusion

1.  **Declare variables before use:**
    
2.  **Prefer** let and const over var: They provide block scope and reduceisting issues.
    
3.  **Use function declarations for main functions:** They are fully hoisted and accessible throughout their scope.
    
4.  **Understand the Temporal Dead Zone:** Variables declared with let and const, because they are hoisted but not initialized, leading to errors if accessed too early.
    

### Common Interview Questions & Clarifications

#### Q1 What does this code output?

```   
var a = 1;  

function test() {    
  console.log(a); // ?    
  var a = 2;    
  console.log(a); // ?  
}  

test();   
```

Answer First console.log outputs undefined because var a inside test is hoisted as undefined. The second outputs .

#### Q2: Difference between function declaration and expression?

```   
// Function declaration  
console.log(add(2, 3)); // 5  

function add(a, b) { 
  return a + b; 
}

// Function expression  
console.log(subtract(5, 2)); // Error  
var subtract = function(a, b) { 
  return a - b; 
};   
```

Function declarations are fully hoisted, but function expressions are hoisted undefined, leading to errors if called before assignment.

### Understanding Variable Environments and Execution Contexts

JavaScript's execution involves creating a global execution context (GEC) and local execution for functions. During creation:

  - Variables are hoisted: var as undefined, let and const in TDZ.
  - Function declarations are fully hoisted.
    
During execution, code runs line by line, and assignments happen at runtime. Local contexts are created for functions, with their own scope and variables. Global Environment and the window Object. Even an empty JavaScript program creates the global execution context, which includes the window object in browsers. This object contains all variables and functions, accessible via window or this at the global level. Variables declared globally with var are attached to window. example:

```   
var x = 10;  
console.log(this.x); // 10  
console.log(window.x); // 10   
```

### Difference Between undefined and not
When a variable is declared but not assigned a value, it is undefined. If a variable is not declared at all, trying to access it results in a ReferenceError with message "not defined".

```   
console.log(x); // undefined  
var x = 25;  
console.log(a); // ReferenceError: a is not defined   
```
JavaScript is loosely typed, so variables change types dynamically. Never manually assign undefined to variables; let JavaScript handle it.

### Additional Notes on let and const
let and const are hoisted but in the Temporal Dead Zone until initialized. Accessing them before initialization causes ReferenceError.

```   
console.log(a); // ReferenceError  

let a = 10;  
console.log(b); // undefined  
var b = 15;   
```

Attempting to redeclare let or const in same scope results in syntax errors. const must be initialized at declaration and cannot be reassigned.

### Summary of Key Points
  - Hoisting moves declarations to the top during creation phase.
  - Only declarations are hoisted; initializations are not.
  - var variables are hoisted as undefined.
  - and const are hoisted but in the TDZ until initialized.
  - Function declarations are fully hoisted; function expressions are not.
  - Understanding hoisting helps write predictable, bug-free code and simplifies debugging.
    

### Personal Insight
Initially, hoisting seemed like a confusing JavaScript quirk. However, recognizing it as part of the creation phase of execution clarifies that JavaScript systematically sets up the environment before running code. The "magic" is just JavaScript showing you how it prepares everything in advance.