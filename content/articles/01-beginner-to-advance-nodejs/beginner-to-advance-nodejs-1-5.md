---
title: "Diving into the NodeJS GitHub repo"
description: "As we know, each module in NodeJs has its own scope. How does NodeJs achieve this? In JavaScript, we follow the Principle of Least Privilege (PoLP), which is related to functions and scope. If you're unfamiliar, you can Google it. The idea is to only expose what is necessary to the global scope, keeping everything else private. To achieve PoLP, wrap your code in a function or immediately invoke it (IIFE)."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-04-09"
datePublished: "2025-04-09"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
resources:
  - title: "NodeJs Modules: CommonJS"
    type: "documentation"
    url: "https://nodejs.org/api/modules.html"
    description: "Official docs on how require/module.exports work"
  - title: "ES Modules in NodeJs"
    type: "documentation"
    url: "https://nodejs.org/api/esm.html"
    description: "Using import/export with Node (ESM)"
  - title: "IIFE (Immediately Invoked Function Expression)"
    type: "article"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/IIFE"
    description: "Why JavaScript uses function wrappers"
  - title: "NodeJs Source – Module Wrapper"
    type: "documentation"
    url: "https://github.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js"
    description: "See how Node wraps modules under the hood"
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930703/Portfolio/nodeJsCourse/5.png)

Before looking at code, it helps to understand why Node gives each file its own scope. Private-by-default modules prevent accidental leaks and hard-to-track bugs. You explicitly choose what to share with other files, which keeps boundaries clean as projects grow.

### The Principle of Least Privilege (PoLP)

As we know, each module in Node.js has its own scope. How does Node.js achieve this? In JavaScript, we follow the Principle of Least Privilege (PoLP), which is related to functions and scope. If you're unfamiliar, you can Google it. The idea is to only expose what is necessary to the global scope, keeping everything else private. To achieve PoLP, wrap your code in a function or immediately invoke it (IIFE). This is how modules in Node.js work. You can learn more about PoLP from [this Stack Overflow post](https://stackoverflow.com/questions/6010211/in-node-js-how-would-i-follow-the-principle-of-least-privilege) or watch [this YouTube video](https://www.youtube.com/watch?v=lW_erSjyMeM&t=10s&pp=ygUYYmxvY2sgc2NvcGUgYW5kIHNob2FkaW5n). 


### How modules and require work ?

Now you understand that when you `require` something in Node.js, the entire code is wrapped in a function (essentially an IIFE). This is how PoLP works, making the code private and inaccessible to other modules unless explicitly exported. The `module` keyword in your file is available because Node.js passes it as an object to the IIFE while converting your module code. Below are two examples: one without PoLP and one with PoLP. Remember, PoLP is just about hiding code from the outside environment.

Without PoLP

```jsx
var x=10;
 // do something with x
 console.log('value is : ', x)
//Suppose till this scope you need x 

console.log(x) // 10; but here also you are getting x access thats not good
```

So to hide this we can wrap it in a function

```jsx
function() {  // <--- Add this

 var x=10;
 // do something with x
  console.log('value is : ', x)
 //Suppose till this scope you need x 
 
 
 
 }()          // <----Add this ( thats it IIFE done)
 
 console.log(x)   // ERROR ( now you cant access because its hidden now,  private 
  )
```

Lets see how this works with modules in node js

```jsx
function() {  

 var x=10;
 // do something with x
  console.log('value is : ', x)
 //Suppose till this scope you need x 
 
 modules.export= { x }
 
 }(modules)          // node js passing modules in IIFE while calling it
 
 console.log(x)   // ERROR ( now you cant access because its hidden now private now
  )
```

Behind the scenes, Node.js uses its capabilities, like wrapping code in an IIFE, and then the V8 engine executes the code. When you `require('./sum.js')` in another module, Node.js performs several steps to load and execute the module. There are five key steps involved in this process to ensure the module is properly loaded, compiled, and executed. Let's explore what these five steps are.

### 5 Steps to Load and Execute a Module

1. Require a Module
   Identifies the source of the module, whether it's a local file, built-in module, or JSON file.
2. Load the Module
   Accesses the module's content but does not execute it yet.
3. Wrap in IIFE
   Wraps the module code in an Immediately Invoked Function Expression (IIFE), as previously discussed.
4. Evaluate the Code
   Executes the code, allowing `module.exports` to return the exposed content.
5. Caching
   Caches the module to avoid re-execution, improving performance by reusing the cached result in subsequent requires.

![image.png](https://i.ibb.co/3TtmWXs/2.png)

Let me introduce you with one of superpower of NodeJs, we will discuss it later.

![image.png](https://i.ibb.co/whvQcYC/3.png)

Its time to open [Github repo of  Node JS](https://github1s.com/nodejs/node/blob/main/lib/internal/modules/helpers.js#L135)  and read about it. Here below you can see how NodeJS wraps the module code in IIFE , you can find this [code here in node Js repo](https://github1s.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js#L324-L331)

```jsx
let wrap = function(script) { // eslint-disable-line func-style
  return Module.wrapper[0] + script + Module.wrapper[1];
};

const wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});',
];
```

### Search These Keywords

1. **IIFE** (Immediately Invoked Function Expression)
2. **PoLP** (Principle of Least Privilege)
3. **Caching in NodeJS**
4. **LibUV Library**

### Questions

1. How do you make a set of variables private?
2. What are the use cases for IIFEs?
3. Besides IIFEs, are there other methods to achieve the same functionality?
4. Find the code in the Node.js repository where modules are wrapped in IIFE.

### Useful Links

1. [NodeJS GitHub Repository (V8 Code)](https://github.com/nodejs/node/tree/main/deps/v8)
2. [LibUV Code - The Powerhouse of NodeJS](https://github.com/nodejs/node/tree/main/deps/uv)
3. [Require Function in Node.js Repository](https://github1s.com/nodejs/node/blob/main/lib/internal/modules/helpers.js#L128)

### Tips

1. Open any GitHub repository and press the . (full stop) key on your keyboard to open it in a VS Code-like editor directly in your browser.
2. Alternatively, add 1s before the URL in the repository link to open it in a browser-based editor. For example, https://github1s.com/.

And that's all for this episode!
