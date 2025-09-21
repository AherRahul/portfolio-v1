---
title: "JavaScript on Server"
description: "Discover how JavaScript powers server-side development with NodeJs, transforming the way web applications are built. NodeJs is a fast, scalable runtime that enables asynchronous, event-driven programming, making it ideal for real-time applications like chat apps and streaming services. You'll also learn to build server-side applications from scratch, manage dependencies with npm, and use frameworks like Express.js."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-04-06"
datePublished: "2025-04-06"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
resources:
  - title: "Official NodeJs Documentation"
    type: "documentation"
    url: "https://nodejs.org/en/docs"
    description: "The official reference for NodeJs API, guides, and usage examples."
  - title: "Chrome V8 Engine Documentation"
    type: "documentation"
    url: "https://v8.dev/docs"
    description: "Comprehensive technical details about the V8 JavaScript engine."
  - title: "How V8 Works Internally"
    type: "article"
    url: "https://deepu.tech/memory-management-in-v8/"
    description: "An in-depth article explaining how Google’s V8 engine executes and optimizes JavaScript."
  - title: "JavaScript Engines Overview"
    type: "article"
    url: "https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Introduction_to_the_SpiderMonkey_JavaScript_engine"
    description: "MDN article introducing JavaScript engines, using SpiderMonkey as an example."
  - title: "Ryan Dahl’s NodeJs Introduction (JSConf 2009)"
    type: "video"
    url: "https://www.youtube.com/watch?v=ztspvPYybIY"
    description: "The original presentation where NodeJs was introduced to the developer community."
    duration: "27:29"
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930701/Portfolio/nodeJsCourse/2_zzsbpy.png)


## Understanding Server-Side JavaScript with NodeJs

As we’ve learned, NodeJs allows JavaScript to run outside of the browser—specifically on a server. But what does this actually mean in practice? To answer this, let’s explore the fundamental concepts of server-side JavaScript and the technologies that make it possible.


## What is a Server?

At its core, a **server is simply a computer that provides a service**. When you open an application on your own machine and it responds to your inputs, your machine is effectively acting as a server—sometimes called a **local server**.  

Servers can range from a standard desktop computer in your home to powerful machines housed in large-scale data centers. When these computers are located remotely, possibly even in a different country, they are commonly referred to as **remote servers** or **cloud servers**.  

The essential role of a server is to **serve**—whether that means delivering a web page, processing an API request, or making a file available to a client. In simple terms, a server exists to respond to requests and provide the requested resource.


## Understanding Client-Server Communication

Whenever you type a URL like `https://www.example.com` into your browser, you are acting as the **client**. Your browser sends an **HTTP request** across the internet to a server.  

But how does your request know which server to reach? This is where the **Domain Name System (DNS)** comes in. Think of DNS as the internet’s phonebook. It translates the human-friendly domain name (like `www.example.com`) into a unique **IP address** (e.g., `54.161.234.33`). The request is then routed to the correct server using this IP address.  

The server receives your request, processes it, and responds with the appropriate resource—often an HTML page, a JSON response, or some other form of data.  

This client-server interaction forms the backbone of the modern internet. With NodeJs, JavaScript can participate in this communication not only in the browser (client side) but also on the server. This unification of frontend and backend development makes it possible for developers to become **full-stack engineers**, using a single language across the entire stack.

![Client-Server Model](https://i.ibb.co/brf7D7h/1.jpg)


## The Role of the JavaScript Engine

The ability to run JavaScript—whether in a browser or on a server—depends on the presence of a **JavaScript engine**. A JavaScript engine is a program that takes JavaScript code and translates it into a form the computer can understand and execute.  

Every browser has its own engine:  
- Chrome, Edge, Opera, and Vivaldi use **V8**  
- Firefox uses **SpiderMonkey**  
- Safari uses **JavaScriptCore**  

These engines are not themselves written in JavaScript. Instead, they are typically implemented in **C++**, a language chosen for its speed and efficiency. For example, Google’s **V8 engine**—which powers both Chrome and NodeJs—has over 70% of its implementation written in C++.

![JavaScript Engine Overview](https://i.ibb.co/w7kyPnm/2.jpg)


## The Story of V8 and NodeJs

The **V8 engine** plays a critical role in modern JavaScript execution. Written in C++, it follows the official **ECMAScript standards**, ensuring consistency across platforms. V8 is designed to compile high-level JavaScript directly into **machine code**, enabling extremely fast execution.  

Importantly, V8 is not tied to browsers alone—it is a **standalone library**. This means it can be embedded into any C++ application to add JavaScript execution capabilities.  

This is where **NodeJs** enters the picture. NodeJs is essentially a **C++ application that embeds the V8 engine**, giving it the ability to execute JavaScript outside of the browser. But NodeJs goes further—it adds powerful API for server-side operations like handling HTTP requests, reading and writing files, or connecting to databases.  

In other words:  
- **V8** makes JavaScript execution possible.  
- **NodeJs** builds on V8 and equips it with the tools required for backend development.  

Thus, the **NodeJs runtime** is the combination of the V8 engine and additional C++ and JavaScript code that together provide the features developers need to build full server-side applications.

![NodeJs and V8](https://i.ibb.co/J5M4TNX/4.jpg)

> **Note:** While NodeJs is built on C++, many of its built-in modules and API are written in JavaScript. This hybrid nature ensures that developers can work in JavaScript while benefiting from the performance and system-level capabilities of C++.


## Why C++? Understanding the Language Hierarchy

The choice of **C++** for building JavaScript engines and the NodeJs runtime is deliberate. To understand why, consider the hierarchy of programming languages:  

- At the **lowest level**, computers only understand **binary code (0s and 1s)**—also called **machine code**.  
- Slightly higher are **assembly languages**, which are closer to machine code but slightly more human-readable.  
- At the **highest level**, we have languages like **JavaScript**, **Python**, and **Java**, which are designed to be easy for humans to read and write.  

JavaScript engines like V8 act as the **bridge** between high-level JavaScript and low-level machine code. For this bridge to be efficient, the engine itself must be written in a **fast, low-level language**. C++ is a natural fit because it combines performance with the ability to manage system-level resources directly.

![Language Hierarchy](https://i.ibb.co/BCSK3VF/5.jpg)


## Browsers and Their Engines

Here’s a quick reference table of browsers and the JavaScript engines they use:

- **Chrome, Edge, Opera, Vivaldi:** V8  
- **Firefox:** SpiderMonkey  
- **Safari:** JavaScriptCore  

Each of these engines implements the same ECMAScript standard, but their internal optimizations differ, which is why the same JavaScript code can sometimes perform differently across browsers.

![Browser Engines](https://i.ibb.co/vLZWXVD/6.jpg)


## Further Exploration and Key Terms

If you want to go deeper into this subject, here are some key concepts to research further:

- **WebAssembly (Wasm):** A low-level binary format that runs alongside JavaScript in the browser, delivering near-native performance for web apps.  
- **ECMAScript (ES6 and beyond):** The standardized specification for JavaScript that defines its features and syntax.  
- **Cross-Platform Development:** The ability of NodeJs to run seamlessly on Windows, macOS, and Linux, making applications portable.  
- **Processor Architectures (ARM vs. x86):** Understanding how different hardware architectures influence performance and compatibility of software.  

These concepts not only deepen your understanding of NodeJs but also provide valuable insights into the broader world of software engineering.

