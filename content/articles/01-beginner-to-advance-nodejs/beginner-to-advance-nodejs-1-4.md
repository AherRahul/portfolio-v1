---
title: "Module.exports & require"
description: "As you saw in the last episode, we wrote our first line of code in NodeJs. Now, we could just keep adding whatever we want to app.js, and technically, it would work. But that's not the best way to do things because the file would get cluttered and hard to manage. Instead, we need multiple files.So, you'll use require to include different modules into your main file."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-04-08"
datePublished: "2026-04-08"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
resources:
  - title: "Namaste Dev - NodeJS course PDF - 4"
    type: "PDF"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1759758282/Portfolio/nodeJsCourse/PDF-Notes/Episode-04_compressed_o6ddgj.pdf"
    description: "A PDF Notes on Module.exports & require"
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930702/Portfolio/nodeJsCourse/4.png)

Node.js Modules — `require` & `module.exports` Explained
-----------------------------------------------------------

When you start writing Node.js applications, you’ll quickly realize that putting everything into one file becomes chaotic. Node.js solves this problem beautifully with its **module system**, which lets you split your code into separate files, each with its **own private scope**.


### Why Modules?

Modules help you:

- Keep code **organized and reusable**
- Avoid **naming conflicts**
- Define clear **boundaries** between different parts of your application

Think of each file as a **mini-universe** where your variables and functions live safely — invisible to other files unless you explicitly choose to share them.


### The Role of `require` and `module.exports`

When you include a file using `require('./sum.js')`, Node.js runs that file **inside a special function wrapper** that gives it its own scope. That’s why your variables from `sum.js` aren’t directly visible to the file that required it.

To share data, functions, or objects with other files, you use `module.exports`.

```
// sum.js
console.log('I am sum module');

function calculateSum(a, b) {
  console.log('Sum is', a + b);
}

module.exports = calculateSum; // Exporting a single function
```

Node.js will:
- Locate the file (sum.js).
- Execute it **once**.
- Return whatever is assigned to module.exports.
    
So you don’t get _everything_ from that file — only what’s explicitly exported.


### Why Not Everything is Exposed by Default?
Node keeps each file in a **private scope** to prevent conflicts and accidental overwrites. Internally, Node wraps your code like this:

```   
(function (exports, require, module, __filename, __dirname) {
  // Your module code lives here  
});   
```

That’s why you can use require, exports, and module inside your file without declaring them — they’re passed automatically by Node.

### Visual: Module Wrapping in Action

Each file → its own “container.”Variables inside one module can’t leak into another. ✅

#### Example: Exporting a Single Function

**sum.js**

```   
console.log('I am the sum module');  

function calculateSum(a, b) {    
  console.log('Sum is', a + b);  
}  

module.exports = calculateSum; // note: export*s*   
```


**app.js**
```   
const calculateSum = require('./sum.js');  

console.log('I am the entry file');  
calculateSum(4, 5); // Output: Sum is 9   
```

- app.js imports the function from sum.js.  
- Only the exported function is accessible — not any other variable in that file.
    

### Visual: How require() Works

Think of require() as asking,

> “Hey, what do you want to share?” And the other module responds with only what’s exported.

#### Exporting Multiple Things

You can export multiple values by using an **object**.

**multipleExports.js**

```   
const name = 'Albert';  

function sayHello(person) {    
  console.log(`Hello ${person}!`);  
}  

module.exports = { sayHello, name };   
```

**app.js**

```   
const { sayHello, name } = require('./multipleExports.js');  

sayHello('Jhon'); // Hello Jhon  

console.log('Exported name is', name); // Albert   
```

If you log module.exports before assigning anything: You’ll get {} — an empty object.

```  
console.log(module.exports);   
```


#### Creating a Folder as a Module

You can make a **folder act as a module**.Node will automatically look for an index.js inside that folder.

Example:

```   
math/   
  ├── index.js   
  ├── sum.js   
  └── multiply.js   
```

**math/index.js**
```   
const sum = require('./sum');  
const multiply = require('./multiply');  

module.exports = { sum, multiply };   
```

Now:
```   
const math = require('./math');  

math.sum(2, 3); // 5   
```
This approach is common in npm packages — where a folder serves as a “module package.”

### Visual: Folder as a Module

Node looks for:

- index.js
- or "main" field in package.json
    

#### What Happens Internally When You Require a Module?
Here’s the behind-the-scenes breakdown:

- Node locates the file.
- Wraps it in a private function.
- Passes exports, require, module, etc.
- Executes the file.
- Returns whatever’s assigned to module.exports.
- Caches the result — next require() is instant.
    

This is why you can log module and see metadata like:

```   
{    
  id: '.',    
  exports: {},    
  filename: '/path/app.js',    
  loaded: false,    
  ...  
}   
```

#### How Modules Protect Variables
Because each module runs inside its own closure:

- Local variables are private.  
- Only exported items are public.
    

Example:

```   
// sum.js  
let secret = 'abc123';  

function add(a, b) { 
  return a + b; 
}  

module.exports = add;  

// app.js  
const add = require('./sum');  

console.log(secret); // ❌ ReferenceError   
```

This keeps your code **safe from external modification** — like private properties in OOP.

#### CommonJS vs ES Modules (CJS vs ESM)
Node originally used **CommonJS** (require, module.exports).Modern JS uses **ES Modules** (import, export).

### CommonJS (CJS)

```   
// sum.js  
module.exports = function(a, b) { 
  return a + b; 
};  // app.js  

const sum = require('./sum');   
```

### ES Modules (ESM)

```   
// package.json  
{    
  "type": "module"  
}     


// sum.js  
export function sum(a, b) { 
  return a + b; 
}  

// app.js  
import { sum } from './sum.js';   
```

### Key Differences

| Feature | CommonJS (CJS) | ES Modules (ESM) |
|----------|----------------|------------------|
| **Syntax** | `require`, `module.exports` | `import`, `export` |
| **Execution** | Synchronous | Asynchronous |
| **Mode** | Non-strict by default | Strict mode by default |
| **File Type** | `.js` | `.mjs` or `"type": "module"` in `package.json` |
| **Used In** | Node.js (legacy / libraries) | Modern JavaScript & hybrid (Node + Browser) apps |

> **Tip:** Use **CommonJS (CJS)** for older Node.js projects and libraries.  
> Use **ES Modules (ESM)** for modern, full-stack, or browser-compatible applications.


#### Example: console.log(module.exports)

If you log it inside any file before exporting:

```   
console.log(module.exports);   
```

You’ll see:
```   
{}   
```

Every module starts with an empty object.As you attach properties, they become part of your exported interface.

#### Modules and OOP Concept

Modules naturally support OOP principles like **encapsulation**.

Example:

```   
// counter.js  
let count = 0;  
function increment() {
  count++;
  console.log(count);  
}  

function reset() {    
  count = 0;  
}  

module.exports = { increment, reset };   
```
- count is private.  
- increment and reset are public.
- The module behaves like a class with private and public members.
    

### Visual: OOP Encapsulation with Module Pattern

Modules = Classes with hidden properties and exposed methods.

### Node.js Built-in Modules

Node ships with powerful built-in modules that you can use instantly — no installation needed.

```   
const fs = require('fs');          // File system  
const path = require('path');      // Path utilities  
const os = require('os');          // Operating system info  
const http = require('http');      // HTTP server  
const events = require('events');  // Event emitter   
```

Each of these modules is structured the same way — they export functions, classes, or objects that you can directly use.

### Visual: Node Built-in Modules

What Files Can You Require?

#### You can require():

- **.js** → JavaScript files  
- **.json** → Parsed into an object  
- **.node** → Compiled C++ add-ons  
- **Folders** → If they contain index.js or "main" entry  

#### Key Takeaways

- Every file in Node.js is a **module** with a private scope.  
- You **export** functionality using module.exports.  
- You **import** it using require().  
- Node wraps each file in a function to isolate variables.  
- CommonJS and ES Modules are two systems — don’t mix them carelessly.  
- Modules promote clean, reusable, and secure code organization.  

#### Questions to Explore

- Why are modules protected by default?  
- What’s the difference between require vs import, and module.exports vs export?  
- What happens internally when Node loads a module?  
- Why does console.log(module.exports) show {} initially?  

> **Final Thought:**Each module is like a self-contained “mini program.”It runs privately, shares selectively, and keeps your app modular and safe.That’s the beauty of Node.js — **organized, maintainable, and scalable** from the ground up.