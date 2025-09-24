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
resources:
  - title: "Window VS Global Object in Node JS | Node JS Tutorial"
    type: "video"
    url: "https://www.youtube.com/watch?v=AHXbmB_-7Vw"
    description: "This video further explores the difference between the window and global objects in Node.js."
    duration: "2:21"
  - title: "Global object - MDN Web Docs"
    type: "Article"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Global_object"
    description: "A comprehensive explanation of the global object in JavaScript, its variations across different environments (browser, Node.js, Web Workers), and its importance."
  - title: "globalThis - MDN Web Docs"
    type: "Article"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis"
    description: "Details on the globalThis property, why it was introduced, and how it provides a standardized way to access the global object in any JavaScript environment."
  - title: "What is the 'this' keyword in JavaScript?"
    type: "Article"
    url: "https://javascript.info/object-methods#this"
    description: "An in-depth guide to understanding the this keyword in JavaScript, its context, and how it behaves differently in various scenarios, including the global scope."
  - title: "Namaste Dev - NodeJS course PDF - 3"
    type: "PDF"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1758694684/Portfolio/nodeJsCourse/PDF-Notes/Episode-03_compressed_qc6s1a.pdf"
    description: "A PDF Notes on Let's write code"
  
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930702/Portfolio/nodeJsCourse/3_xveryy.png)


A Developer's First Quest: Setting Up Node.js
---------------------------------------------

Welcome, future Node.js master! This session is your first quest: to set up your environment and run your very first piece of code. Think of this as preparing your workshop. We won't just tell you what to do, but why you're doing it, because every great hero understands their tools. Let's begin!

### Step 1: Installing the Tools (The Apprentice's Gear)

Before you can craft anything, you need the right gear. Our main tool is **Node.js**, which is the special runtime that lets you use JavaScript outside of a web browser. It's like a forge for your code.

*   **Download Node.js**: Head to the official [Node.js website](https://nodejs.org/) and download the **LTS (Long-Term Support)** installer. The LTS version is stable and recommended for most users.
    
*   **The Two Tools**: The installer gives you two powerful tools:
    
    *   node: This is the Node.js runtime itself. It's the engine that will execute your JavaScript code.
        
    *   npm: This is the **Node Package Manager**. It's like a library catalog for JavaScript, allowing you to easily download and manage pre-written code from other developers (called "packages" or "dependencies").
        

### Step 2: Verifying Your Setup (Testing the Gear)

Now that you have your tools, let's make sure they're in the right place and ready to go. Open your terminal (or the integrated terminal in a code editor like VS Code) and type in a couple of commands.

*   To check the Node.js version, type node -v and press Enter.
    
*   To check the npm version, type npm -v and press Enter.
    

Seeing a version number for both commands confirms that the installers did their job correctly and added the programs to your system's **PATH**, which is the list of directories your terminal searches for commands.

```   
$ node -v  
v18.12.0  


$ npm -v  
9.x.x
```

### Step 3: A Quick Sandbox (The Practice Room)

Every apprentice needs a place to practice. Node.js comes with a built-in sandbox called the **REPL** (Read-Eval-Print-Loop). It's a quick, interactive environment where you can type a line of JavaScript and see the result immediately.

To enter the REPL, just type node in your terminal and press Enter.

Bash

```
$ node
> 2 + 2
4
> ['a', 'b'].join('-')
'a-b'
>   
```

This feels a lot like the browser's developer console. The key difference is that while the browser console gives you access to the **Web APIs** (like document and window), the Node.js REPL gives you access to **Node's APIs** (for things like file system and network operations).

### Step 4: Running Your First File (The First Creation)

Practice is over; it's time to build something for real. Let's create a simple JavaScript file and run it using the node command.

1.  **Create a Folder**: Make a new folder for your project.
    
2.  **Create a File**: Inside that folder, create a new file and name it app.js.
    
3.  **Write Code**: Add some JavaScript to your app.js file.
    
4.  **Run the File**: Go back to your terminal, navigate to your new folder, and run your file with the node command followed by the filename:
    
```   
$ node app.js
```

Node.js will execute all the code in that file from top to bottom.


### The Global Object: Your Code's Environment

Think of the global object as the main hub or central control room for your code's environment. It's the top-level container where all the built-in functions, variables, and objects live, making them accessible from anywhere in your code. The key takeaway is that the name of this control room changes depending on where your JavaScript is running.

Imagine you're a spy with different gadgets for different missions. Your tools for a mission on a boat will be different from those you use in a desert. In the same way, the **JavaScript global object** is the set of tools available to your code, and these tools are determined by the environment it runs in.

The Browser's Control Room: 'window' 🌐:
---------------------------------------------
- In a web browser, the global object is called window. This object is your direct connection to everything related to the browser. It holds all the web-specific APIs   that let you manipulate the web page, handle events, and interact with the user. Things like document (which represents the entire HTML page), alert() for pop-up messages, and localStorage are all properties of the window object. If you're in a browser and type console.log(window.document), you're essentially asking the control room for the document tool.
    
Node.js's Control Room: 'global' 💻 :
---------------------------------------------
- On the server, with Node.js, there is no web page or a user interface. Therefore, the global object is not window. Instead, it's a different object called global. This object gives you access to APIs for server-side tasks like working with the file system (fs), managing child processes, and handling network requests. If you tried to use window.document in Node.js, you'd get an error because the global object doesn't have a document property. The window and global objects are distinct control rooms for different jobs.
    

### this vs. globalThis: Finding the Right Reference

This difference in global objects has historically created confusion, especially when trying to write code that works in both environments. This is where globalThis comes in.

*   **The Problem with this**:The behavior of the this keyword can be inconsistent. In a web browser's global scope, this refers to the window object. However, in a Node.js module, this is often an empty object ({}). This difference means that a single line of code using this can behave unexpectedly depending on the environment.
    
*   **The Universal Key: globalThis** 🔑 To solve this, a new, universal property called **globalThis** was introduced in modern JavaScript. It is a standardized way to access the global object, regardless of the environment your code is running in. It's like a master key that works on any control room door. globalThis will always point to window in a browser and global in Node.js. By using globalThis, you can write more consistent and portable code that works seamlessly across different platforms.
    

### Your Adventure Continues!

Congratulations, you've completed your first quest! You've successfully installed and run Node.js, learned the difference between the browser and server environments, and understood the role of the global object. In the next session, we'll learn how to organize our code by splitting it into modules and sharing functionality.
