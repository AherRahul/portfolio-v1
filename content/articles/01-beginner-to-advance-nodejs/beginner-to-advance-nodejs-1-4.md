---
title: "Module.exports & require"
description: "As you saw in the last episode, we wrote our first line of code in NodeJs. Now, we could just keep adding whatever we want to app.js, and technically, it would work. But that's not the best way to do things because the file would get cluttered and hard to manage. Instead, we need multiple files.So, you'll use require to include different modules into your main file."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-04-08"
datePublished: "2025-04-08"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930702/Portfolio/nodeJsCourse/4.png)

<!-- # 📖 My Personal Notes – module.exports & require -->

Putting everything in one file becomes unmanageable fast. Node’s module system fixes that by giving every file its own private scope. You decide exactly what to expose via `module.exports`, and other files import that public surface using `require`. Below I explain what’s happening before each example so the “why” is clear.

![image.png](https://i.ibb.co/s567zyG/11.jpg)

### Why `require` doesn’t expose everything by default

When you `require('./sum.js')`, Node executes that file, but your current file can only access what `sum.js` explicitly exports. That’s because Node wraps every module in a function (private scope) and passes `module`, `exports`, and `require` to it. You opt‑in to sharing by writing to `module.exports`.

Modules protect their code by default. that one module be like: 

![image.png](https://i.ibb.co/j4bYskd/Capture.jpg)

Arey aise kaise nahi btayega, So to know variable and functions of that module, you have to export and import in the file you  want to import.

sum module (we expose one function)

```jsx
console.log('I am sum module');

 function calculateSum(a,b){
  console.log("Sum is", a+b);
}

module.exports =calculateSum  // the way you export  ( remember its export+s not export )
```

app.js (entry file)

```jsx
const calculateSum= require('./sum.js')  // the way you import
console.log("I am entry files");

calculateSum(4,5)   // 9 is the output
```

Now app.js be like

![image.png](https://i.ibb.co/gtXGg9j/2.jpg)

### Exporting multiple things

If you want to expose more than one item, export an object. Then import and use object destructuring on the other side.

```jsx
var name ='Mohan'

function sayHello(name){
    console.log(`Hello ${`name`}!`);
}

module.exports= {               // this is the way you export multiple things
  sayHello,
  name,
}
```

and this is the way you import in app.js

```jsx
// destructured : learn Destructuring
const {sayHello, name} = require('./multipleExport..js')   // this is the way you imported

sayHello('Ashutosh')    // Hello Ashutosh
console.log("Exported name is", name);   // Mohan

// what will you get if you print modile
console.log(module.export) // {}  emoty object 
```

### CommonJS vs ES Modules (when to use which)

Everything above uses CommonJS (CJS), Node’s classic module system: `require` + `module.exports`. Modern JavaScript also has ES Modules (ESM): `import`/`export`. You can enable ESM by adding `"type": "module"` in `package.json`.

```json
// package.json
{
  "type" : "module"
}
```

and now you can import/export like in frontend projects

```jsx
// in sum js
export function calculateSum(){....}

// in app js
import {calculateSum) from './sum.js'  or './sum'
```

Practical advice: libraries and older codebases still use CJS; new apps and tooling increasingly use ESM. Pick one per project to avoid interop headaches, unless you know the mixed setup you need.

![image.png](https://i.ibb.co/Ypv7mBL/3.jpg)

NodeJs also comes with built-in modules that you can require and import directly into your code. These modules are pre-installed with NodeJs and provide various functionalities like file handling, HTTP requests, and more. 

### What “module” means in practice

A module is just a file with its own private scope. Nothing leaks unless you export it. This keeps codebases maintainable by controlling boundaries and dependencies explicitly.

### Keys to learn

1. Object destructuring
2. Modules in JS
3. Strict mode
4. Difference between ES6 modules and CJS
5. In-built Modules

### Question to search

1. Reasons why modules are protected by default ?
2. Whats the difference between require and import and export vs module.exports

### Key findings

* Modules are protected by default after requiring it will run bu can't be access until you export
* These are protected to avoid conflicts from other modules
* Common Js, EJS  / ESModule , ESM,  MJS ES6 Modules are two module patterns to access data within modules
* In CJS code runs in non strict mode, but in ESM pattern code runs in strict mode


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.

