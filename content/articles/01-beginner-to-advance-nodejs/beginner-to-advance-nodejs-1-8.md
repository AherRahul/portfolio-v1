---
title: "Deep dive into v8 JS Engine"
description: "Now, let's focus on one of NodeJs's best friends, the V8 Engine. It takes the code and runs it. Before doing anything, I just want you to read this carefully."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-04-12"
datePublished: "2026-04-12"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
resources:
  - title: "V8 – Ignition and Turbofan"
    type: "documentation"
    url: "https://v8.dev/blog/launching-ignition-and-turbofan"
    description: "How V8 interprets, optimizes, and deoptimizes JavaScript"
  - title: "V8 Bytecode"
    type: "article"
    url: "https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775"
    description: "Readable intro to V8 bytecode"
  - title: "You Don’t Know JS – Scope & Closures"
    type: "book"
    url: "https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md"
    description: "Foundational mental models for how JS runs"
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930704/Portfolio/nodeJsCourse/8.png)


Now, let's focus on one of NodeJs's best friends, the V8 engine. V8 turns your JavaScript into something the CPU can execute efficiently. The big idea: V8 first interprets code into bytecode (Ignition), then optimizes hot paths into fast machine code (Turbofan), and sometimes deoptimizes when assumptions break. Understanding this explains “why did my snippet suddenly get slow?” moments.

![image.png](https://heyashu.in/images/blogs/eoi82.png)

Alright, let’s move on to the session now. When the V8 engine processes the code, it happens in a few steps:

1. **Tokenizing/Lexing**: Your code is broken down into smaller tokens. You can explore this further by visiting [AST Explorer](http://astexplorer.net/). This is more on the academic side, so if you're interested in the details, you can check out the subject of Compiler Design (or just take a look at the screenshot provided). Also, read this article for more insight: [What are syntax and expressions in JavaScript](https://heyashu.in/digital-garden/blog/what-are-syntax-and-expressions-in-javascript).

![image.png](https://heyashu.in/images/blogs/epi83.png)

![image.png](https://heyashu.in/images/blogs/epi84.png)

![image.png](https://heyashu.in/images/blogs/epi85.png)

![](https://heyashu.in/images/blogs/epi86.png)

### Interpreted language vs. compiled language (and where V8 fits)

An interpreter reads and executes code line by line, while a compiler reads the entire code, compiles it, and then passes it to the engine for execution. JavaScript uses both a compiler and an interpreter to run the code, along with several optimizations like **JIT (Just-in-Time Compiler)**.

The compiler used by V8 is called **Turbofan**, and its job is to optimize the code so that it runs faster, especially if the same section of code is executed multiple times. If code changes shape (e.g., objects with different hidden classes), V8 may deopt and re-optimize—this is why consistent shapes and predictable types matter for performance.

Also, remember that **Garbage Collection** happens in parallel to free up memory. Below, I’ve listed the names of some garbage collectors used in the V8 engine—make sure to look them up and read about them.

### How Byte code looks like ?

![image.png](https://heyashu.in/images/blogs/epi87.png)

https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775



### Search These Keywords

1. Turbofan
2. Ignition Interpreter
3. Bytecode
4. Optimized Code
5. JIT (Just-in-Time Compilation)
6. Deoptimization in Compilation
7. Inline Caching
8. Copy Elision
9. Orinoco Garbage Collector
10. Oilpan Garbage Collector
11. MCompact Garbage Collector
12. Scavenger Garbage Collector
13. Mark-and-Sweep Algorithm
14. [V8 Crankshaft Compiler](https://github.com/thlorenz/v8-perf/blob/master/crankshaft/compiler.md)

### Questions

1. How does the compiler optimize the code, and in what situations does it fail to optimize?
2. Research other algorithms similar to the **Mark-and-Sweep** algorithm. What do they do, and how do they differ?
3. Find out byte code in v8 engine github repo

### Useful Links

1. [AST Explorer](http://astexplorer.com/)
2. [V8 Turbofan Documentation](https://v8.dev/docs/turbofan)
3. https://github.com/thlorenz/v8-perf/blob/master/crankshaft/compiler.md
4. https://v8.dev/blog/launching-ignition-and-turbofan

### Tips

1. JavaScript is both an interpreted and compiled language, benefiting from various optimizations.
2. Read blogs of v8 website

And thats all for this session, I'm **Ashutosh Anand Tiwari,** and I'm writing digital notes on NodeJs. If you enjoy these notes, please share them with your friends. If you find any errors or have improvements, feel free to contribute by clicking edit icon on top bar of this page[.](https://heyashu.in/admin) If you're interested in writing the next episode's notes, [visit this link](https://heyashu.in/admin). Let's learn together! Also, please consider giving a star to [this repo](https://github.com/ashumsd7/heyashu/tree/main/src/data). For any queries, [let's connect here](https://topmate.io/aat/1148709/pay). Thank you…


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
