---
title: "01 Networking - How the Web Works: Understanding the Architecture of the Web"
description: "'Networking - How Web Works?' provides an in-depth understanding of how the internet facilitates communication between users and servers. It begins with the basics of web browsers sending HTTP/HTTPS requests to servers and receiving responses. The role of DNS (Domain Name System) in translating domain names into IP addresses, which act as unique identifiers for devices on a network, is crucial.The topic delves into protocols like TCP/IP, which ensure reliable data transmission across networks, and explores concepts such as request-response cycles and status codes that define server interactions. "
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/how-web-works.md"
dateModified: "2025-01-11"
datePublished: "2025-01-10"
showOnArticles: false
courseName: ''
topics:
  - system-design
---

## How the Web Works: Understanding the Architecture of the Web
The Client-Server relationship is the most common way for a webpage to be shared across multiple computers. 
The client sends requests for the webpage, which is then loaded and displayed by the server.

<img src= "https://res.cloudinary.com/duojkrgue/image/upload/v1736690721/Portfolio/simple-client-server_bixd8p.png" alt = "" width ="700" height = "350">


For Example: When we go to any restaurant, Whatever food we want to order we tell it to waiter or waitress 
of the restaurant, Then waiter goes to the chef & tell him to prepare our food. When our food is ready the 
waiter brings food to our table, Similar things happen in web. Here we are the "client" & waiter act as a 
"server". when we order something it means we are sending a HTTP request. when waiter brings us food it 
can be related to "200 OK " message from the server.

<img src= "https://res.cloudinary.com/duojkrgue/image/upload/v1736690721/Portfolio/watiter-customer_orjvoq.avif" alt = "" width ="700" height = "350">

Below are Important components which plays vital role in communication between client & server
### Internet connection:

Internet is a string of ones and zeroes that moves from one computer to another. When someone says 'the 
internet', they're referring to a network of computers that connect people to each other, allowing them 
to send and receive information without human intervention. Most users access the internet via broadband.

### TCP/IP:

Transmission Control Protocol and Internet Protocol are the core messaging protocols for TCP/IP, the most 
common networking protocol in use today. You've probably heard of it: It's the protocol that phone numbers,
 domain names, email addresses, chat conversations, and all other bits of data -- from your computer to a 
 website to every other device on earth -- travel through on their way from Point A to Point B.

### DNS:

We need to locate the website's IP address before we can access the website. This means we'll look up the 
address of the shop in a directory (like an address book) and then type in the relevant web address together 
with the 'port' (which tells browsers where to send HTTP requests). The browser will then look up that IP 
address using DNS, find out which server you want to connect to and retrieve it.

### HTTP:

Hypertext Transfer Protocol (HTTP) is the language that clients and servers use to communicate and exchange 
data over a network.

### Component files:

A website is made up of many different files. These files come in two main types: code (HTML, CSS, and 
JavaScript) and assets (all the other stuff that makes up your website).

### So how web works?

The browser goes to the DNS server, and finds the real address of the server that the website lives on 
(you find the address of the shop). The browser sends an HTTP request message to the server, asking it 
to send a copy of the website to the client (you go to the shop and order your goods). This message, 
and all other data sent between the client and the server, is sent across your internet connection using 
TCP/IP. If the server approves the client's request, it sends a "200 OK" message telling you that you 
can look at that website! Here it is," and then starts sending file chunks or files as a series of small 
packets or messages called data packets. The browser assembles these small messages into different web 
pages which it displays to you.

## How does the internet work?

#### How did it all start?

- During the Cold War, the United States and the Soviet Union competed to be the best.
- In 1957, the Soviet Union surprised everyone by launching Sputnik 1, the first man-made satellite.
- To keep up, the U.S. created ARPA (Advanced Research Project Agency) to stay ahead in science.
- ARPA made ARPANET, the first big computer network using packet switching.
- ARPANET laid the foundation for the internet we use today, changing how we connect and work together.
- The U.S. Advanced Research Projects Agency Network (ARPANET) was the first big computer network. It 
started in 1969 and stopped in 1989. ARPANET was mainly for academics and research.

<img src= "https://res.cloudinary.com/duojkrgue/image/upload/v1736700516/Portfolio/how-internet-started_m2jart.avif" alt = "" width ="700" height = "350">

### WWW came into the picture:
We wanted to easily share research papers, but couldn't because there was no automatic way to do it.

Then, Mr. Tim Berners-Lee created the World Wide Web (www). It lets us store and access documents online. 
However, back then, we couldn't search for things on the website.

This is the world's first **website**
- The World Wide Web, also called the Web, is a place on the Internet where we find documents and other 
stuff. Each thing has its special address called a URL, like https://example.com/. These things can link 
to each other, and we can access them through the internet.

The Internet is the backbone of the Web, the technical infrastructure that makes the Web possible. At its 
most basic, the Internet is a large network of computers which communicate all together.
