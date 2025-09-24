---
title: "A quick overview of gRPC"
description: "It's kind of like a sibling to REST API or GraphQL, enabling communication with the server in a unique way. RPC stands for Remote Procedure Call, and the 'g' in gRPC stands for Google, as it was created by Google."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-05-22"
datePublished: "2025-05-22"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1744045783/Portfolio/FrontendSystemDesignCourse/5_uc5xlf.png)

It's kind of like a sibling to REST API or GraphQL, enabling communication with the server in a unique way. RPC stands for **Remote Procedure Call**, and the "g" in gRPC stands for **Google**, as it was created by Google.

Let's understand it now:

Suppose there are two machines—one is the client (any machine) and the other is the server (another machine). In the end, when we call an API, it executes a function on the server. With RPC, instead of making a traditional API request, the client can directly call a function on the server. Below is the architecture diagram, and we will discuss each terminology in detail.

![image.png](https://heyashu.in/images/blogs/grpc_2.jpg)

In REST API, data is transferred in **JSON** format, but in gRPC, it happens using **Protocol Buffers (Protobuf)**, which is an **IDL (Interface Definition Language)**. To use gRPC, we need **HTTP/2**.

Just like REST API send **serialized data** over the network, gRPC also transmits **protocol-serialized data**. However, gRPC maintains a **single long-lived connection** and supports **bidirectional streaming**.

![image.png](https://heyashu.in/images/blogs/grpc_3.jpg)

So, referring to the screenshot above, once an **HTTP/2 request** is made using gRPC, **bidirectional data flow** happens. Each time we call a **server function**, a **bidirectional data flow** occurs, and the connection ends after the response.

We already discussed that gRPC uses **Protocol Buffers (Protobuf)** instead of **JSON**. Now, let’s understand **Protocol Buffers** and how **encoding and decoding** take place.

![image.png](https://heyashu.in/images/blogs/grpoc_4.jpg)

**Protocol Buffer (ProtoBuf)** is developed by Google.

* ProtoBuf is an **IDL (Interface Definition Language)** and also provides **serialization and deserialization**.
* It supports **binary data transfer**, unlike REST API, where we use `.json()`, in gRPC, we use `.proto` (also called **proto3**).
* The **.proto file** defines the request and response structure. This file enables **code conversion**, making it compatible with multiple languages.
* The response can be **deserialized in any language**, which makes gRPC highly flexible.

Honestly, this concept is a bit confusing, but we’ll explore it further to understand it better.

### **Benefits of gRPC**

* Requires **less CPU resources**.
* **Faster** on mobile devices due to efficient serialization.

gRPC is **mainly used for server-to-server communication**, but we will also see how to use it in a **browser**. Since a browser acts as a **client machine**, we need a **gRPC client** that interacts with a **gRPC server** to call functions.

![image.png](https://heyashu.in/images/blogs/grpc_5.jpg)

### **Let's Code**

Here is the repo link: [gRPC-first-setup](https://github.com/ashumsd7/gRPC-first-setup)

You can either **clone the repo** or **follow the documentation** to set up the client and server. If you haven’t used gRPC before, it might feel a bit **complex** at first, but at least **try it once**, as I did. **Something is better than nothing** 🙂


### **Comparison with REST API**

* In **REST API**, we use **HTTP/HTTPS**, but in **gRPC**, we use **HTTP/2** as the default transport protocol.
* REST API use **JSON**, whereas gRPC uses **Protocol Buffers**.
* **No standard language** is required for REST API, but gRPC enforces **ProtoBuf IDL** as a standard.
* REST API transfer data in **JSON/XML/Text**, while gRPC uses **binary serialization** for efficiency.
* **JSON is more flexible**, but **ProtoBuf ensures a strict contract** between the client and server.
* REST API often rely on **third-party code generation tools**, whereas gRPC provides **automatic code generation**.


### **Advantages and Disadvantages**

### **Advantages**

✅ **10x faster** compared to REST API calls

✅ **Better security** since it uses **HTTP/2**

✅ **Bidirectional streaming** support

✅ **Automatic code generation**

✅ **Language-agnostic** (Define proto once and use it in any language)

✅ **Service discovery support**

✅ **More secure communication**

### **Disadvantages**

❌ **Not human-readable** (Uses binary data instead of JSON)

❌ **Limited browser support**

❌ **No edge caching** (Due to the use of POST requests)

❌ **Steeper learning curve** compared to REST API

Hey your feedback is required for me , please give  [this repo](https://github.com/aherrahul/portfolio-v1/) a star 🌟 if you liked the blog
if you want to contribute in it please feel free to fork , You can see github link on top right corner of top bar or  [click here](https://github.com/aherrahul/portfolio-v1/)


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.

I am waiting for your feedback, See you in next episode,


Thanks 👋🏻