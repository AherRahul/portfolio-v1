---
title: "libuv & async IO in Node.js"
description: "If you read Node.js's definition, it mentions an event-driven architecture and its ability to handle asynchronous I/O. These two concepts are crucial to understand, so take your time to read and grasp them thoroughly. We know JavaScript is a synchronous, single-threaded language, meaning the code runs in one direction like a one-way road, with one task executing at a time."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-04-10"
datePublished: "2025-04-10"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
resources:
  - title: "Event loop, timers, and nextTick"
    type: "documentation"
    url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"
    description: "Official overview of Node’s event loop and async primitives"
  - title: "libuv design"
    type: "documentation"
    url: "https://github.com/libuv/libuv"
    description: "C library powering Node’s async I/O and thread pool"
  - title: "Jake Archibald: In The Loop"
    type: "video"
    url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0"
    description: "Great mental model for event loops"
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930703/Portfolio/nodeJsCourse/6.png)

If you read Node.js's definition, it mentions an event-driven architecture and its ability to handle asynchronous I/O. These two ideas explain why Node can handle thousands of requests with minimal resources. The mental model: JavaScript runs on one main thread (simple and predictable), while libuv handles the waiting (timers, files, sockets) off the main thread.

![](/public/images/blogs/2.png)



### Synchronous vs Asynchronous Code (why async matters)

Imagine a restaurant where you can get Coke, pizza, and noodles, which take 0 minutes, 10 minutes, and 5 minutes to prepare, respectively. Now, picture a line of 5 people (A, B, C, D, E) waiting to order. In a synchronous way, Person A orders Coke and gets it instantly. Person B orders noodles, taking 5 minutes. Person C, who wants pizza, has to wait 5 minutes before even placing the order, then waits another 10 minutes for the pizza. Meanwhile, Person D, who only wants a Coke, ends up waiting unnecessarily. This is how synchronous code works: one task at a time, causing delays.

### Asynchronous Way of Running Things (what Node actually does)

In an asynchronous way, tasks that take time (like preparing pizza or noodles) are handled separately, allowing the restaurant to serve quick orders (like Coke) immediately. So, A gets Coke instantly, while B and C (who ordered pizza and noodles) are moved to a different queue to wait. Meanwhile, D, who also wants Coke, gets served right away. This prevents unnecessary waiting. The completion of B and C's orders depends on the preparation time. Asynchronous operations in Node.js prevent blocking, improving efficiency, especially for quick tasks. JS Engines loves synchronous code because it can run that code in milliseconds. we will see some examples soon.

### How synchronous code runs in the JS engine (what V8 handles)

The JS engine has components like the Call Stack, Garbage Collector, and Memory Heap. These aren't machines or hardware; they are just C++ code. When you run a code like `var a = 10;`, it executes in the Global Execution Context, which is created in a synchronous, single-threaded manner. When a function is called, a new execution context is created for that function, and the code runs. Let me give you an example to explain it further.



```jsx
var a=102;
var b=209;

function multiply(x,y){
  const  result= x*y
  return result;
}

var c= multiply(a,b)
```

When the JS engine executes code, it goes through several steps, such as parsing and tokenization. The compiler and scope work together during this phase. For example, when the compiler sees variables `a` and `b`, it checks with the scope if they exist. If not, they are declared and assigned values. This process occurs in the Global Execution Context within the Call Stack. When a function is called, a new execution context is created, runs, and then is popped off the stack. For more details, you can learn from blogs or videos by Akshay Saini on YouTube.

![image.png](https://heyashu.in/images/blogs/4.png)

### How asynchronous work returns to JavaScript

![image.png](https://heyashu.in/images/blogs/5.png)

Let me tell you something: JavaScript isn't just limited to running code. As a scripting language, it has many tasks it's not inherently capable of handling, such as interacting with the outside world, accessing files, or databases. A great example is managing time with `setTimeout`—this isn't actually a feature of JavaScript itself. Really? Yes! The JS engine can't inherently wait; it's not designed for that. The JS engine's responsibility is simply to take JavaScript code and convert it, that's it—no time management or other logic involved.

That's where Node.js comes into play with its superpowers. Node asks libuv to handle timers, file I/O, networking, and crypto. When those complete, the results come back to JavaScript as callbacks or promise resolutions. V8 only runs JavaScript; libuv talks to the OS.

In simple terms, this is how Node.js operates.

![image.png](https://heyashu.in/images/blogs/6.png)

### What is libuv (and why I care)

libuv is a C library that provides Node.js with an event-driven, asynchronous I/O model. It helps manage tasks like file reading, writing, networking, and timers in a non-blocking way, making it possible for Node.js to handle many tasks simultaneously without slowing down. Essentially, Libuv is what enables Node.js to be fast and efficient, handling multiple operations at once without waiting for each to finish. Libuv acts as a middleware b/w JS engine and Operating System. Libuv has thread pool and event loop will discuss in later blogs. just know if anything comes async or engine can’t handle it ask libuv to do it. find the libuv exact link to check the code of it written in c for your reference. actually libuv does so many things.

### Node.js is asynchronous (precisely stated)

If someone asks about Node.js behavior, tell them Node.js is overall asynchronous. However, V8, which is its JavaScript engine, operates synchronously. Node.js gains its asynchronous nature from superpowers like `libuv`, which enables non-blocking I/O operations. This is why Node.js is known for its non-blocking behavior, allowing I/O operations to be performed asynchronously. And don't forget to give a shoutout to the creator of Node.js, Ryan Dahl!



And that's all for this episode!

I'm Ashutosh Anand Tiwari, and I'm writing digital notes on Node.js. If you enjoy these notes, please share them with your friends. If you find any errors or have improvements, feel free to contribute by [visiting this link.](https://heyashu.in/admin) If you're interested in writing the next episode's notes, [visit this link](https://heyashu.in/admin). Let's learn together! Also, please consider giving a star to [this repo](https://github.com/ashumsd7/heyashu/tree/main/src/data). For any queries, [let's connect here](https://topmate.io/aat/1148709/pay).



### New words to search

1. IO
2. Async and sync
3. Garbage collector
4. Libuv

### Questions / Queries to research

1. Read the C code of libuv
2. How garbage collector works in JavaScript ?
3. Find the code of Garbage collector in Node Js github repo.

### Useful Tips

1. Node Js is asynchronousd and Js engine in syncronous,

### Useful links

1. https://github.com/nodejs/node/tree/main/deps/uv


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
