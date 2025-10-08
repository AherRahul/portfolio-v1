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

Diving Deep into the Node.js GitHub Repository
--------------------------------------------------

This comprehensive guide combines and expands upon previous notes to help you understand how **Node.js modules** work internally, how `require()` and `module.exports` function, and what magic happens inside the **Node.js GitHub source code**.


## Why Each File in Node.js Has Its Own Scope

Before diving into the code, it’s crucial to understand **why Node.js isolates each module** into its own scope. This design follows the **Principle of Least Privilege (PoLP)** — the idea that code should only have access to what it truly needs.

Without this isolation, variables and functions could easily leak between files, creating hard-to-debug conflicts and security issues.

When you write JavaScript like this:

```js
var x = 10;
console.log('value is:', x);
// Still accessible globally
console.log(x); // 10 ✅
```

You can still access `x` outside its intended area — which is unsafe. To prevent this, you can use a function scope (IIFE):

```js
(function() {
  var x = 10;
  console.log('value is:', x);
})();

console.log(x); // ❌ ReferenceError: x is not defined
```

By wrapping code in an **Immediately Invoked Function Expression (IIFE)**, variables remain private. Node.js applies this same concept automatically to every module you create.

![IIFE Example Diagram](https://i.ibb.co/3TtmWXs/2.png)


## How Node.js Wraps Modules (Behind the Scenes)

When you run a Node.js file, the system doesn’t just execute it directly. It first **wraps your module’s code** in an IIFE that looks like this:

```js
(function (exports, require, module, __filename, __dirname) {
  // Your actual code lives here
});
```

This function provides:
- A private scope for the file.
- Useful parameters like `exports`, `require`, and `module`.
- A way to safely export variables or functions.

This is implemented inside the Node.js source code — you can see it in the [Node.js GitHub Repository (CJS Loader)](https://github1s.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js#L324-L331):

```js
let wrap = function(script) {
  return Module.wrapper[0] + script + Module.wrapper[1];
};

const wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});',
];
```

Essentially, every time you use `require()`, Node.js wraps and executes your module within this function context.


## Step-by-Step: How `require()` Works Internally

Whenever you use `require('./myModule')`, Node.js performs a five-step process to load and execute that module efficiently:

**1. Resolve the Module Path**
Node.js determines where your file is located. It looks for the module in the following order:
- Core modules (like `fs`, `path`, etc.)
- Local files (`./localModule.js`)
- Node modules in `node_modules`

**2. Load the Module**
Once resolved, Node.js reads the file contents. Depending on the type (`.js`, `.json`, `.node`), it uses the correct loader.

**3. Wrap in IIFE**
Node.js then wraps the file’s content in the IIFE we saw earlier, isolating the scope and injecting useful arguments.

**4. Evaluate the Code**
The wrapped code is sent to the **V8 engine**, which executes it. During this step, any exported values are attached to `module.exports`.

**5. Cache the Result**
Once executed, the result of `module.exports` is cached. Subsequent calls to `require()` for the same file will use the cached version.

This caching mechanism significantly improves performance.

```js
// Example
const sum = require('./sum'); // Loaded and cached
const again = require('./sum'); // Retrieved from cache ✅
```

Without caching, Node.js would re-read and re-execute the file every time, which would be inefficient.


## Example: Module Caching in Action

Imagine you have three files — `sum.js`, `app.js`, and `multiply.js` — all requiring the same `xyz.js` module.

1. When `sum.js` first requires `xyz`, Node.js:
   - Resolves the path
   - Loads and wraps the code
   - Evaluates and caches the result

2. When `app.js` and `multiply.js` also require `xyz`, Node.js simply retrieves the cached version — it doesn’t repeat the expensive steps.

This optimization is part of why Node.js is so fast and memory-efficient.

![Node.js Module Caching](https://i.ibb.co/whvQcYC/3.png)


## The Superpowers of Node.js — `libuv`

When we talk about Node.js being fast and asynchronous, we’re really talking about **libuv** — a powerful C library integrated into Node.

`libuv` provides the event loop, handles file I/O, networking, and manages asynchronous tasks behind the scenes. Without it, Node.js wouldn’t be able to perform non-blocking operations efficiently.

### y Responsibilities of `libuv`:
- Manages the **Event Loop**
- Handles **thread pools** for asynchronous tasks
- Provides **cross-platform abstractions** (Windows, macOS, Linux)

Explore the library here: [LibUV in Node.js Repository](https://github.com/nodejs/node/tree/main/deps/uv)


## Where `require()` is Implemented in Node.js Source

The actual code for how `require()` works is found in the [helpers.js file](https://github1s.com/nodejs/node/blob/main/lib/internal/modules/helpers.js#L128).

Inside, the function `makeRequireFunction()` dynamically creates a custom require function for each module:

```js
function makeRequireFunction(mod) {
  function require(path) {
    return mod.require(path);
  }
  require.resolve = function(request) {
    return Module._resolveFilename(request, mod);
  };
  require.cache = Module._cache;
  return require;
}
```

Each module gets its own version of `require`, ensuring isolation and consistent module resolution.


## Common Questions

### 1️. How are variables and functions private in Node.js modules?
Because Node.js wraps each module’s code in an IIFE, every module has its **own function scope**. Nothing leaks into the global scope unless explicitly exported using `module.exports`.

### 2️. Where does `module` come from?
It’s passed automatically as a parameter to the function that wraps your code:

```js
(function (exports, require, module, __filename, __dirname) {
  // module object is available here
})();
```

### 3️. Why is caching so important?
Caching prevents duplicate loading and evaluation of the same file, improving both **speed** and **memory efficiency**.


## Summary

- Every Node.js file is automatically wrapped in an IIFE.
- `module.exports` defines what’s exposed to other files.
- `require()` loads modules through a five-step process.
- Node.js caches modules after the first load.
- The **V8 engine** executes JavaScript.
- **libuv** handles async operations, I/O, and the event loop.

Together, these layers make Node.js the performant, non-blocking runtime that powers servers, APIs, and developer tools worldwide.


## Recommended Reading

- [Node.js GitHub Repository](https://github.com/nodejs/node)
- [Node.js V8 Integration Code](https://github.com/nodejs/node/tree/main/deps/v8)
- [LibUV Documentation](https://github.com/libuv/libuv)
- [StackOverflow on PoLP](https://stackoverflow.com/questions/6010211/in-node-js-how-would-i-follow-the-principle-of-least-privilege)


✅ **Pro Tip:** Press `.` (period) on any GitHub repo to open it in a VS Code-like editor. Or, prepend `1s` to the URL — e.g., `https://github1s.com/nodejs/node` — to browse the Node.js source interactively!

