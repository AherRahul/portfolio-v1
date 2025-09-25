---
title: "Execution Context"
description: "An Execution Context is the abstract environment where JavaScript code is evaluated and executed. Think of it as a container or a sandbox that manages all the variables, functions, and code that's currently running. It's the central concept that determines what a function can access and what the value of this is."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-25"
datePublished: "2025-09-25"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: "JS course PDF - 2"
    type: "PDF"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1758791683/Portfolio/javaScriptCourse/pdf/javascript-day2_Execution-Context_buwdmj.pdf"
    description: "A PDF Notes on Execution Context topic"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758785691/Portfolio/javaScriptCourse/images/02/Javascript_f1fl8c.png)

Execution Context in JavaScript – The Global Kitchen vs Function Kitchens 
-------------------------------------------------
An Execution Context is the abstract environment where JavaScript code is evaluated and executed. Think of it as a container or a "sandbox" that manages all the variables, functions, and code that's currently running. It's the central concept that determines what a function can access and what the value of this is.

Think of JavaScript as a **restaurant** that runs 24/7.This restaurant cannot cook a single dish unless a **kitchen** is open. So, These kitchens = **Execution Contexts**.

[Try this link for a visualization](https://ui.dev/javascript-visualizer)

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758788727/Portfolio/javaScriptCourse/images/02/ChatGPT_Image_Sep_25_2025_01_53_35_PM_zylzfw.png)


1️. The Global Kitchen (Global Execution Context)
-------------------------------------------------

When the restaurant first opens (when your JavaScript program starts), the **Global Kitchen** is created automatically. It’s the **biggest kitchen**, with all the basic tools and pantry items ready. So, In the **browser**:

*   Ingredients → window, document, global variables
    
*   Tools → built-in functions like setTimeout(), alert()
    

### Example

```   
var restaurant = "Code Cafe";  

function greetCustomer(name) {
  var message = "Welcome, " + name + "!";
  console.log(message);  
}  

greetCustomer("Rahul");   

```

### What happens in the Global Kitchen

#### Creation Phase -  (kitchen setup before cooking begins):

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758788241/Portfolio/javaScriptCourse/images/02/ChatGPT_Image_Sep_25_2025_01_47_09_PM_rhrctw.png)

*   A **Global Object** is created (window in browser, global in Node.js).
    
*   this is set to the Global Object.
    
*   Memory is allocated:
    
    *   Variables → set to undefined
        
    *   Functions → their full definitions are stored
        

#### Storage during creation:

```   
Global Kitchen  
---------------  

restaurant : undefined  
greetCustomer : function() {...}  
this : window   
```

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758790587/Portfolio/javaScriptCourse/images/02/99aa3159-162b-4460-8be1-6b5b6619d2cb.png)

#### Execution Phase (actual cooking):

*   restaurant = "Code Cafe" → now filled with value
    
*   greetCustomer("Rahul") → triggers a **Function Kitchen**
    

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758788887/Portfolio/javaScriptCourse/images/02/ChatGPT_Image_Sep_25_2025_01_57_14_PM_ija2zr.png)

Storage during execution:

```   
Global Kitchen  
---------------  

restaurant : "Code Cafe"  
greetCustomer : function() {...}  
this : window   
```

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758790749/Portfolio/javaScriptCourse/images/02/82bf0a3d-5e18-4e8b-80f4-750d8453f0be.png)


2️. The Function Kitchen (Function Execution Context)
-----------------------------------------------------

Whenever you **call a function**, a **new mini kitchen** opens.This kitchen is smaller, temporary, and has just the tools it needs. Inside the Function Kitchen, JavaScript sets up:

*   **Ingredients** → function arguments + local variables
    
*   **Chef** → this keyword
    
*   **Recipe Book** → Scope Chain (to borrow missing ingredients from parent kitchens)
    
    
![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758789000/Portfolio/javaScriptCourse/images/02/ChatGPT_Image_Sep_25_2025_01_59_46_PM_jaxsl3.png)

### Function Kitchen in action (greetCustomer("Rahul"))

#### Creation Phase

*   Creates arguments object → {0: "Rahul", length: 1}
    
*   Sets local variables → message = undefined
    
*   Sets up this (in non-strict mode, it’s window)
    

Function Kitchen storage:

```   
Function Kitchen: greetCustomer  
-------------------------------  

arguments : ["Rahul"]  
name : "Rahul"  
message : undefined  
this : window   
```
    
![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758790833/Portfolio/javaScriptCourse/images/02/d874b0ae-55cc-476b-84e6-fbb320db0ca1.png)


#### Execution Phase

*   message = "Welcome, Rahul!"
    
*   console.log(message) → prints "Welcome, Rahul!"
    
![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758790922/Portfolio/javaScriptCourse/images/02/bdd89d1a-d170-4d77-8088-7be8528a2e28.png)

Once done, the **Function Kitchen is destroyed**.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758790983/Portfolio/javaScriptCourse/images/02/d9058e80-d531-4c76-ba20-b67b198af521.png)

3️. The Stack of Kitchens (Call Stack)
--------------------------------------

Execution contexts aren’t floating around randomly — they’re stacked. Think of them like trays in a cafeteria.

* At the start:
  ``` 
  [ Global Kitchen] 
  ```

* When **greetCustomer("Rahul")** runs:  
  ``` 
    [ Global Kitchen] 
    [ greetCustomer Kitchen] 
  ```
    
* When **greetCustomer** finishes:
  ``` 
  [ Global Kitchen] 
  ```
    

This stack of kitchens = **Call Stack** in JavaScript.

Full Story Analogy
---------------------

*   The **Global Kitchen** is like the **main kitchen** of the restaurant — always open, with a huge pantry and all tools.
    
*   Each **Function Kitchen** is like a **pop-up kitchen** that opens when a new order (function call) comes in.
    
*   If the Function Kitchen runs out of ingredients (variables), it can borrow from the main kitchen via the **scope chain**.
    
*   Once a dish (function execution) is done, the pop-up kitchen is cleaned up and removed from the stack.
    

Why This Matters
------------------

By visualizing Execution Contexts as kitchens:

*   You understand **hoisting** (variables start as undefined in the setup phase).
    
*   You see why **functions can be called before they’re defined** (functions are fully stored in the setup phase).
    
*   You understand how **closures** work (mini kitchens keep recipes from parent kitchens).
    
*   You see how the **call stack** manages multiple function calls.
    

So every piece of JavaScript you write is either cooked in the **Global Kitchen** or inside a temporary **Function Kitchen** stacked above it.


### Summary Notes

The provided article, "Execution Context in JavaScript," uses a **restaurant kitchen analogy** to explain how JavaScript code is executed. It breaks down the process into three main concepts: **Execution Context**, **Phases of Execution**, and the **Call Stack**.

*   **Execution Context**: This is the environment where JavaScript code runs. The article compares it to a "kitchen." There are two main types:
    
    *   **Global Execution Context**: The "main kitchen" that's created automatically when a JavaScript program starts. It contains global objects (like window in a browser), this, and global variables/functions.
        
    *   **Function Execution Context**: A temporary "mini kitchen" created every time a function is called. It has its own local variables, arguments, and this keyword.
        
*   **Phases of Execution**: Both global and function contexts go through two phases:
    
    *   **Creation Phase**: This is the "kitchen setup" where memory is allocated. Variables are initialized to undefined (explaining **hoisting**), and function definitions are fully stored.
        
    *   **Execution Phase**: This is the "actual cooking" where variables are assigned their final values and code is run line by line.
        
*   **The Call Stack**: This is a "stack of kitchens" or "trays in a cafeteria." It's a data structure that manages the order of execution contexts. When a function is called, its context is pushed onto the stack. When the function finishes, its context is popped off the stack. This mechanism governs the flow of execution in JavaScript.
    

### Key Takeaways

*   **Execution Context is the core of JavaScript's runtime behavior.** Every piece of code runs within a specific context—either global or functional.
    
*   **The process of hoisting is a result of the creation phase.** Variables are hoisted (or "lifted") to the top of their scope, but they're only initialized with undefined during the setup phase, not their final value. Functions, however, are fully stored, which is why you can call them before their declaration.
    
*   **The Call Stack is crucial for managing function calls.** It's a last-in, first-out (LIFO) stack that dictates which function runs and when, and it's what throws an error like "Maximum call stack size exceeded" in case of infinite recursion.
    
*   **The kitchen analogy provides an excellent mental model for understanding complex concepts** like hoisting, closures, and the call stack, making them more intuitive and easier to grasp.