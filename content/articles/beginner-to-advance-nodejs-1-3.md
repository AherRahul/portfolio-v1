---
title: "Let's write code"
description: "Systems Design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. It involves translating user requirements into a detailed blueprint that guides the implementation phase. The goal is to create a well-organized and efficient structure that meets the intended purpose while considering factors like scalability, maintainability, and performance."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-04-07"
datePublished: "2025-04-07"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930702/Portfolio/nodeJsCourse/3_xveryy.png)

<!-- # 📖 My Personal Notes – Let’s write code -->

This session is about getting something working end‑to‑end: installing Nodejs, verifying your setup, trying the REPL, and running a file with `node`. Each step includes a short explanation so you understand not only what to do, but why it works.

### Install Nodejs (once)

Download the LTS installer from the official site: [nodejs.org](https://nodejs.org/). The installer adds two things:
- the Nodejs runtime (`node`) used to execute JavaScript outside the browser
- the Node Package Manager (`npm`) used to install and manage dependencies

### Verify your installation

Open your terminal (or VS Code terminal) and check the versions. Seeing versions confirms your PATH is set correctly.

```jsx
node -v                //v18.12.0
npm -v                 //9.x.x
```


### Let’s write code (REPL first)

Node ships with a REPL (Read–Eval–Print–Loop). It’s a quick sandbox where you can run JavaScript line by line—perfect for testing expressions and small snippets before putting them into files.

Type `node` and press Enter to enter the REPL. Try simple expressions like `2 + 2` or `['a','b'].join('-')`. This is similar to the browser console, but instead of the browser’s Web API, you have Node’s API available.

![image.png](https://i.ibb.co/fDHCd6p/3.jpg)

### Run a file with node

Create a folder, add a file named `app.js`, and write some JavaScript. Then run it using the Node runtime:

```jsx
node app.js
```

![image.png](https://i.ibb.co/vHyGmq6/4.jpg)

### The global object: server vs browser (why `window` is undefined)

In the browser, the global object is `window`. On the server with Nodejs, there is no `window`—instead, the global object is `global`. These objects come from their environments (browser vs Node), not from the JavaScript engine (V8) itself. That’s why functions like `setTimeout` are provided by the environment and attached to the global object, not part of the ECMAScript language spec.

If you will try to access window in node js you will get an error, same you will write global in chrome’s console you will get error , here is the screenshot when you type window in node js

![image.png](https://i.ibb.co/Ykr7dy2/5.jpg)

But if you will write global you will get something like yoyou get when you console window in browsers , I am pasting both screenshots you can visualize for you reference. the first screenshot below is from the terminal of vs code and 2nd one is from the browsers console what yoyou get from inspect mode.

![image.png](https://i.ibb.co/5sySj04/6.jpg)

![image.png](https://i.ibb.co/47PH8Ch/7.jpg)

### `this` in Nodejs and `globalThis`

At the top level of a Nodejs module, `this` is an empty object (`{}`), not the global object. To avoid confusion across environments, use `globalThis`. It’s a standard alias that points to the global object everywhere: `window` in the browser and `global` in Node.

### Explore further

If you want to go deeper, look up these terms:

- REPL (Read–Eval–Print–Loop)
- `globalThis`
- Web Workers (browser)
- Nodejs source on GitHub


That’s it—you’ve run your first Nodejs code and learned how the environment differs from the browser. In the next session, we’ll split code into modules and import/export properly.

