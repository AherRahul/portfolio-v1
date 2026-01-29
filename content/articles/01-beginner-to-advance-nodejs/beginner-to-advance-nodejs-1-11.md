---
title: "Create a http server using Node JS"
description: "We covered a lot of theory, investigating NodeJs from its beginnings to 2025, and now it’s time to take action. But be patient — we'll start with some theory to set the context of what a server is, and then write something. Today, your VS Code or code editor won’t be alone. NodeJs will be part of your code base, and we will write something. So, what are we waiting for? Let's begin! We'll read about servers, what development means, what a proxy server is, and what DNS is. Then, we’ll create a server"
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-04-15"
datePublished: "2026-04-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
  - javascript
resources:
  - title: "HTTP module"
    type: "documentation"
    url: "https://nodejs.org/api/http.html"
    description: "Create basic servers with Node’s built-in http module"
  - title: "TCP, sockets and ports"
    type: "article"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/TCP"
    description: "Networking concepts behind HTTP servers"
  - title: "DNS basics"
    type: "article"
    url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_DNS"
    description: "Why we use domain names instead of IP addresses"
  - title: "HTTP/1.1 semantics"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP"
    description: "Methods, status codes and headers you’ll return from servers"
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1757930710/Portfolio/nodeJsCourse/11.png)

<!-- # 📖 My Personal Notes – Create an HTTP server using NodeJs -->

We covered a lot of theory, investigating NodeJs from its beginnings to 2025, and now it’s time to take action. But be patient — we'll start with some theory to set the context of what a server is, and then write something. Today, your VS Code or code editor won’t be alone. NodeJs will be part of your code base, and we will write something. So, what are we waiting for? Let's begin! We'll read about servers, what development means, what a proxy server is, and what DNS is. Then, we’ll create a server

### What is a server (and why we care here)

When someone says "deploy to the server," it means we're referring to the hardware where the operating system and processors are. It means we're running our application, the one we've coded, on that machine. This hardware allows us to save something to the system and retrieve it. That’s what a server does. Deployment is all about saving and running our code on that hardware machine

### Can we use our system as a server?

The answer is yes, but the question is: will you be able to provide what a server from AWS offers? No, because you have limited RAM, limited memory, and no 24/7 access. So, while it's possible, it’s not practical. AWS and other servers run 24/7, have large-scale RAM and memory, and their processors are very powerful. Internet connection is also a concern.

### IP Address

A system can be identified by one address. For your computer, this address might change, but for servers, it does not. Servers have a dedicated IP address that never changes, which is why they are called servers. They are designed to serve, and they also have multiple hardware servers running in different locations. For example, when you create a Firebase server, it will ask where you want your server, such as Singapore. To create a real-time database server, you just click, and you’ll be asked to choose the physical location where you want to connect.

### Node server (what we’re actually building)

What we do now and in the future is create servers that can handle requests from the outside world. That’s what NodeJs is all about. Now, let’s discuss the architecture and dive deeper into it.

### Client–server architecture (the request/response loop)

A client is simply a person or system trying to access your server. For example, if someone opens a browser on their laptop and tries to access a file, whenever a client hits a URL (e.g., [www.heyashu.com](http://www.heyashu.com/)), the browser (the client) wants to access files from Heyashu. A socket connection is opened, and there is something on the server side listening to these requests. An application deployed somewhere listens for these requests, and that machine or app is called the server. There might be multiple clients making similar requests to the server's assets. As we've seen with libuv and NodeJs, the server handles these requests by receiving data through the socket connection and sending it back to the client. And that's the whole process.

![image.png](https://heyashu.in/images/blogs/e11p2.png)

### TCP/IP in one minute (rules of communication)

Whenever data is sent, it uses the **Transfer Control Protocol (TCP)**. Again, this falls under the academic side of computer networking, so you can learn more about it by looking up **TCP/IP connections** on the internet. Multiple computers are connected to each other using the internet, which is why it’s called the web, and each has an address. But what does "protocol" mean? It means rules. Communication must follow some rules, that’s all. For example, if I start writing these notes in Chinese, you wouldn’t understand. By the way, I’m writing digital notes on NodeJs in **Hinglish** — check here. So, rules are set, and that’s how communication works.

### Other common protocols

HTTP, FTP, SMTP are different types of request protocols. Depending on the type of request, different rules are used to transfer data. It's like getting things from a shop — different items have different rules. For example, water needs a bottle, but vegetables need a packet. The same applies to requests in a server; the protocol defines the rules. For normal web requests, we use the **HTTP protocol** (Hypertext Transfer Protocol).

![image.png](https://heyashu.in/images/blogs/e11p3.png)

### How data is sent to the client (packets, streams, buffers)

Data is not sent in bulk; it is sent in chunks, which in computer network language are called **packets**.

There is also the concept of **streams** and **buffers**. A stream means a continuous connection, and a buffer means chunks of data. We will learn more about this later, but for now, just remember that **TCP/IP** is the protocol used to send data from server to client. In NodeJs, the concept of **streams and buffers** is important, so go and learn it!

### Domain names and DNS (why not just IPs)

Whenever you visit a server, you use something like a web address. For example, for these notes, you might type **[www.heyashu.in](http://www.heyashu.in/)**. You also know that the data is sent from a server because I’m not running my system 24/7 to serve these notes. I’m using a server, and that server has a unique IP address. If you type that IP address, you will get the same website. But **heyashu.in** is called a **DNS** (Domain Name System). **Google.com** is a DNS, and **namastedev** is a DNS. Got it? Now, try hitting this IP: **8.8.4.4** or this one: **142.250.217.78**. These are IP addresses, and if you hit **142.250.217.78**, you will get **google.com**.

![image.png](https://heyashu.in/images/blogs/e11p4.png)

It means **google.com** is mapped to this IP address. Got it? You are using domain names because it's tough for humans to remember these IP addresses. So, remember: first, the browser contacts the **DNS server**, which gives you the IP address, and then you connect to that IP. Got it?

### Can we have multiple HTTP servers?

Can we create multiple applications on the same server? Multiple servers on multiple machines? Confusing, right? Haha, I mean, is it possible to have multiple servers running to handle different things? Yes, it's possible! Now, suppose you have two HTTP servers, meaning two NodeJs instances. Which server will handle the incoming request? It will be decided based on the **port**

### Ports in IP addresses (who handles the request)

A **port** decides which server will take the request. Now, suppose you're requesting **142.250.217.78:3000**—3000 is the port number. The server that listens on port 3000 will handle the request. The port is the decider, okay?

So, **a port is a number that identifies a specific application or service on a network-connected device and is used in conjunction with an IP address to send and receive messages.** For more, you can read up on computer networks, haha!

![image.png](https://heyashu.in/images/blogs/e11p5.png)

```jsx
 heyashu.in        /digital-garden 
 142.250.217.78:      3000 
  [IP Address]       [NodeJS app handling digital-garden code/ page]
```

So, actually, a proper website has different things hosted on different servers. For example, files might be hosted on one server, another server might handle images, and yet another one handles databases. You get it, right? This makes things faster, with one server dedicated to images, another for files, etc. We’ll be building all of this, so stay tuned!

### Socket vs WebSocket (request/response vs two‑way)

![image.png](https://heyashu.in/images/blogs/e11p6.png)

When we request something, a socket connection is opened, and data is received, involving the opening and closing of sockets. WebSocket connections are different—they stay open and allow two-way communication. You can explore different types of sockets. Normally, socket connections are made and closed, but WebSockets remain open, which makes them resource-heavy. Read more about it!

### Let’s create a server (and why start with the built-in http module)

We’ll use Node’s built-in `http` module first because it shows the core building blocks clearly: listening on a port, reading the request, and writing a response. Frameworks like Express make this easier, but it’s worth seeing the primitives.

NodeJs has multiple built-in modules. **https** is one of them, and it's used to create a server. The **https** module has a function called `createServer`. Here’s a list of modules — whatever you see in this list are called **native modules** of NodeJs. Sometimes, they are imported like `node:http` in the code. Wait and see!

```jsx
const http = require('http')
// or: const http = require('node:http')

// create a basic HTTP server that responds to every request
const server = http.createServer((req, res) => {
  // req contains method, url, headers
  // res is how we write headers/body back to the client
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello from my Node server')
})

// start listening on a TCP port
server.listen(7777, () => {
  console.log('Server listening on http://localhost:7777')
})
```

Why this works: `listen(7777)` tells the OS “deliver TCP connections on port 7777 to this process.” The callback confirms the socket is open. When a browser requests `http://localhost:7777`, Node invokes our handler and we write a response.

![image.png](https://heyashu.in/images/blogs/e11p7.png)

What if you need to handle different URLs? We can branch on `req.url` and return different content. This is the foundation of routing that frameworks provide.

```jsx
const server = http.createServer((req, res) => {
  if (req.url === '/seed-a-plant') {
    res.statusCode = 200
    return res.end('🌱 Plant seeded!')
  }
  res.statusCode = 200
  res.end('Default route')
})

server.listen(7777)
```

![image.png](https://heyashu.in/images/blogs/e11p8.png)

Creating servers with the bare `http` module gets verbose as requirements grow (routing, middleware, error handling). That’s where **Express.js** helps: it layers convenient API on top of these primitives so you can focus on application logic.

### Express JS

It’s a framework for **NodeJs**. We will discuss it later.

### Things to Learn

1. **Socket connections**
2. **HTTPS vs HTTP**
3. **FTP**
4. **SMTP**
5. **TCP**
6. **Streams and buffers**
7. **Data packets**
8. **Load balancers**


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
