---
title: "How the Web Works"
description: "Network is a core part of software, as the frontend needs data and the backend sends it. All of this happens through the network. How is data transferred over the internet? How does it reach the client, and what protocols are required? These are essential concepts for software development. We need to understand what happens when we type 'google.com,'' what DNS is, and its role in the process."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-03-01"
datePublished: "2025-03-01"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1744045763/Portfolio/FrontendSystemDesignCourse/1_lxnuab.png)

## Understanding the Web: A Journey from Your Browser to the World Wide Web

Imagine you're an explorer, and your quest is to retrieve a precious scroll of information. Every time you open your web browser, you're embarking on a similar adventure! In the world of software, the "network" is the grand highway that connects everything, allowing your browser (the "frontend") to ask for data and the powerful servers (the "backend") to deliver it. This guide will take you on a journey through this digital landscape, explaining how your requests travel the internet, what protocols govern this exchange, and how the magic of the web unfolds right before your eyes.

The Client-Server Story: A Request and a Response
-------------------------------------------------

Our journey begins with a fundamental concept: the **client-server model**. Think of it like ordering food at a restaurant. You, as the customer, are the **client** – you make a request (e.g., "I'd like a pizza!"). The chef and waitstaff, working in the kitchen, are the **server** – they prepare and deliver your order.

In the digital realm, your web browser is the client, making requests for information (like a webpage or an image). A server, a powerful computer dedicated to storing and delivering this information, then "serves" you what you asked for. It's a continuous dance of asking and providing, forming the backbone of all web interactions. [Read more about client-server](https://rahulaher.netlify.app/articles/01-beginner-to-advance-nodejs/beginner-to-advance-nodejs-1-2/)

![image.png](https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQOOvor0161WPprVjpPISitx0s8WTNLcrM9LfQRtJ6triWAtsKeCwrBez1BXG5jFKthb8dfndfFyTISnQdLqryqekeAV0Sxq3sPin8_GgCxsciWVTQ)




Finding Your Way: IP Addresses and Domain Names
-----------------------------------------------

Now, imagine our explorer needs to send a letter. To ensure it reaches the correct recipient, a unique address is crucial. On the internet, every device—from your smartphone to a colossal server—has its own unique identifier: an **IP Address**.

*   **IP Address: The Digital Home Address** An IP address is like a specific home address for devices connected to the internet. It's a numerical label that allows them to locate and communicate with each other. Without it, data wouldn't know where to go!
    
    *   **IPv4:** (e.g., 192.168.1.1) – The classic, four-part numerical address.
        
    *   **IPv6:** (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334) – A newer, more complex address designed to handle the ever-growing number of internet-connected devices.
        

However, remembering a string of numbers for every website you want to visit would be incredibly difficult. This is where **Domain Names** come into play!

*   **Domain Name: The Friendly Street Name** A domain name is a human-friendly label that corresponds to a unique IP address. Instead of typing 172.217.160.142 (Google's IP address), you type google.com. It's much easier to remember, right?
    

Think of https://www.google.com as a structured address:

![dns-hierarchy](https://knowledgeacademy.io/wp-content/uploads/2020/08/dns-hierarchy.jpg)


*   **Root Level Domain**: The invisible "dot" at the very end of every domain name, representing the highest level of the internet's naming hierarchy.
    
*   **Top-Level Domain (TLD)**: The last part of the domain name, like .com, .org, .edu, or .gov. These often indicate the purpose or origin of the website.
    
*   **Second-Level Domain**: The unique name you choose, like google in google.com.
    
*   **Third-Level Domain (Subdomain)**: Additional prefixes, like www in www.google.com, which often denote specific sections or services of a website.
    

The Global Network: Data Centers and ISPs
-----------------------------------------

Our explorer needs to send their letter, but where are all these "addresses" located? They're housed in massive digital warehouses known as **Data Centers**.

![Data-centers](https://heyashu.in/images/blogs/web_works_3.jpg)

*   **Data Centers: The Digital Libraries of the Internet** A data center is a specialized facility packed with powerful computing equipment, storing vast amounts of digital data. Imagine a giant library, but instead of books, it's filled with servers, hard drives, and network gear, all working tirelessly to manage incoming requests. These aren't just single buildings; they are often vast complexes designed for efficiency and reliability.
    

These data centers aren't isolated. They are interconnected across continents and oceans by a sprawling web of **optical fibers**, forming the true backbone of the global internet. These tiny glass strands transmit data at incredible speeds using light pulses, allowing information to travel almost instantaneously around the world.

So, how does your device connect to this global network? Through an **Internet Service Provider (ISP)**.

*   **ISP: Your Gateway to the Internet** An ISP is a company that provides you with access to the internet. They are your local guides to the digital world. When you subscribe to an internet plan (like Jio, Airtel, or your local broadband provider), your ISP connects your home or business to the vast internet backbone. They assign your devices IP addresses and ensure your data requests are routed to the correct servers.
    

ISPs operate at different scales:

*   **Local ISPs**: Connect homes and small businesses in a specific area.
    
*   **Regional ISPs**: Serve larger geographical areas, connecting local ISPs.
    
*   **Global ISPs**: Form the core of the internet, connecting regional ISPs and data centers worldwide.


![Service Workers](https://heyashu.in/images/blogs/web_works_4.jpg)
    

These layers of ISPs, governed by national and international regulations, work in concert to ensure seamless internet connectivity for everyone.

The Journey of a URL: What Happens When You Type google.com?
------------------------------------------------------------

Let's trace our explorer's exact steps when they type google.com into their browser and press Enter. It's not a direct leap to the internet; there are several crucial stops along the way:

![google.com](https://assets.bytebytego.com/diagrams/0410-what-happens-when-you-type-google-in-your-browser.png)

1.  **Local Checks (The Browser's Memory)**:Before anything leaves your computer, your browser performs some quick checks:
    
    *   **Cache Check**: Has it seen this request before? If the requested resource (like an image or a page) is already stored in its local memory (cache), it can serve it instantly, saving time and bandwidth.
        
    *   **Service Workers**: If a "service worker" (a clever script running in your browser) is registered for the website, it can intercept the request. Service workers are like personal assistants for your browser, capable of caching content, enabling offline access, and speeding up future interactions.
        
2.  **To the Router and Beyond (Your Home's Gateway)**:If the browser can't fulfill the request locally, it sends it to your **router**. Your router acts as the traffic controller for your home network, directing requests out to your ISP. Some advanced routers can even cache frequently accessed content to further speed things up!
    
3.  **The ISP Layer (Navigating the Digital Highways)**:Your request now enters the ISP's network. It might travel through multiple layers of ISPs—local, regional, and even global—to reach its destination. Big companies like Netflix and Google strategically place their data centers closer to users (sometimes even within regional ISP networks) to minimize travel time and provide a faster experience. This is like placing popular books in many local libraries instead of just one central archive.

    

To check details related to any domain, visit [https://www.whois.com/](https://www.whois.com/).

The Grand Handshake: Establishing a Secure Connection
-----------------------------------------------------

Before any actual data is exchanged between your browser and the server, a series of digital "handshakes" occur, ensuring both parties are ready and the communication is secure.

![TCP connection handshake](https://afteracademy.com/images/what-is-a-tcp-3-way-handshake-process-three-way-handshaking-establishing-connection-6a724e77ba96e241.jpg)

1.  **DNS Lookup: The Address Book Query**Your ISP needs to know the IP address corresponding to google.com. It queries a **DNS (Domain Name System) server**, which is like the internet's phonebook. The DNS server translates the human-readable domain name into its numerical IP address.
    
2.  **TCP Handshake: "Are You There?" "I Am!"** Once the IP address is known, your browser initiates a **Three-Way Handshake** using the **Transmission Control Protocol (TCP)**. This is like two people agreeing to talk:
    
    *   **SYN (Synchronize)**: Your browser sends a "hello, are you there?" message to the server.
        
    *   **SYN-ACK (Synchronize-Acknowledge)**: The server responds with "yes, I'm here, and I received your message."
        
    *   **ACK (Acknowledge)**: Your browser replies, "Great, I'm ready to talk."This establishes a reliable connection.
        
3.  **SSL Handshake: "Let's Talk Secretly!" (For HTTPS)** If the website uses HTTPS (notice the 'S' for secure), an additional **SSL/TLS Handshake** occurs. This is vital for secure communication:
    
    *   **Certificate Exchange**: Your browser and the server exchange digital certificates to verify each other's identity and ensure the connection hasn't been tampered with.
        
    *   **Encryption Key Agreement**: They then agree on a secret key to encrypt all subsequent communication. This means all the data exchanged between your browser and the server is scrambled and unreadable to anyone else, protecting your privacy and security.
        
4.  **HTTP GET Request: "Show Me the Page!"** With a secure and established connection, your browser finally sends the actual **HTTP GET request**, asking the server for the google.com webpage. The server, now fully prepared, responds by sending back the requested HTML, CSS, JavaScript, and any other resources like images.

![TCP connection handshake](https://heyashu.in/images/blogs/web_works_77.jpg)
    


Bringing the Web to Life: How Your Browser Renders a Page
---------------------------------------------------------

Imagine your web browser as a master chef, and the HTML, CSS, and JavaScript it receives from the server are the raw ingredients. The browser's job is to meticulously prepare and present these ingredients as a beautifully rendered webpage. This entire process is often referred to as the **Critical Rendering Path**.


![image.png](https://heyashu.in/images/blogs/web_works_9.jpg)

### Step 1: Building the Skeleton (The DOM Tree)
The first crucial step is for the browser to understand the structure of the webpage. It does this by parsing the **HTML (HyperText Markup Language)**. Parsing is like reading a recipe line by line and understanding what each instruction means. As the browser reads the HTML, it constructs the **Document Object Model (DOM) tree**.

Think of the DOM as the structural blueprint or skeleton of the webpage. Every HTML element **(like < p >, < h1 >, < img >, < div >)** becomes a "node" in this tree. It defines the relationships between elements – which elements are inside others, and in what order. This tree-like structure allows JavaScript to interact with and manipulate the page's content, structure, and style dynamically.

For example, a simple HTML snippet like:

```
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>Hello, world!</p>
  </body>
</html>
```

![image.png](https://www.tutorialspoint.com/html/images/html_dom.jpg)


### Step 2: Styling the Outfit (The CSSOM Tree)
While the HTML provides the structure, the CSS (Cascading Style Sheets) dictates how that structure should look. The browser parses the CSS rules (either embedded in the HTML, in < style > tags, or linked external .css files) to create the CSS Object Model (CSSOM).

The CSSOM is another tree-like structure, similar to the DOM, but it focuses on all the styling information. It contains all the style rules applicable to the elements in the DOM – colors, fonts, sizes, positions, margins, padding, etc.

Consider the previous HTML with some CSS:

```
h1 {
  color: blue;
  font-size: 2em;
}
p {
  color: gray;
}
```
The browser would combine this with default browser styles and user agent stylesheets to build a CSSOM that describes the computed styles for each element.

![image.png](https://heyashu.in/images/blogs/web_works_10.jpg)

## Important Note: CSS is Render-Blocking
The browser needs to know how the entire page will look before it can start drawing anything substantial. Because CSS rules can affect the layout and appearance of virtually any element, the browser generally pauses rendering the page until all the CSS is loaded and parsed. This is why well-optimized CSS delivery is crucial for perceived page load speed.

### Step 3: Adding Interactivity and Life (JavaScript Execution)
Finally, **JavaScript (JS)** code is processed. JavaScript is the dynamic engine of the web, adding interactivity, animations, and complex functionalities to pages. It allows elements to respond to user actions, fetch new data, update content dynamically, and much more.


* **Parser-Blocking by Default:**
   By default, when the browser encounters a < script > tag in the HTML without specific attributes, it takes a crucial pause. It stops parsing the HTML, downloads the JavaScript file (if it's external), and then executes the code. Only after the JavaScript has finished executing will the HTML parsing resume. This is because JavaScript can potentially modify the DOM and CSSOM, so the browser needs to process it before continuing to build the page structure. This "parser-blocking" behavior can significantly delay the initial rendering of a page if large JavaScript files are loaded synchronously in the < head > of the document.


* **Optimizing JS Loading:**
   To mitigate parser-blocking, developers use special attributes with the <script> tag:

   *  defer attribute: Tells the browser to download the script in the background while HTML parsing continues. The script is then executed only after the HTML has been fully parsed and the DOM is ready. This ensures    that the script runs after the document structure is complete, making it ideal for scripts that depend on the DOM.

   *  async attribute: Also tells the browser to download the script in the background while HTML parsing continues. However, an async script executes as soon as it's downloaded and ready, potentially before the HTML parsing is complete. This is suitable for independent scripts that don't rely on or modify the DOM structure significantly.

### Step 4: The Grand Merging: Rendering and Painting
Once the browser has built the DOM (the page structure), the CSSOM (the page styles), and executed any necessary JavaScript (for interactivity or dynamic changes), it enters the **Rendering Phase**. This is where the virtual models are transformed into actual pixels on your screen.

1. Layouting (Creating the Render Tree):
The browser merges the DOM tree and the CSSOM tree to create the Render Tree. This tree contains only the visible elements on the page (elements like <head> or display: none elements are excluded), along with their computed styles and geometric positions. It's like taking the architectural blueprint (DOM) and interior design plan (CSSOM) and creating a detailed, ready-to-build layout plan for a house. At this stage, the browser calculates the exact size and position of every visible element on the page.

2. Painting:
Finally, using the information from the Render Tree, the browser "paints" the pixels onto your screen. This involves drawing all the elements, text, backgrounds, borders, and images in their correct positions and styles. The browser's rendering engine (often using underlying computer graphics libraries and C++ code) converts these calculations into what you visually perceive as the webpage


How browsers handle parallel requests? 
---------------------------------------------------------

When your browser loads a webpage, it needs to download multiple resources (HTML, CSS, JS, images, fonts, etc.). These are fetched over HTTP(S) connections. However, browsers place a limit on how many parallel (concurrent) requests they can make to a single domain (host).

### Typical limits

* Most modern browsers allow ~6 parallel requests per domain (some allow up to 8).
* Any extra requests to the same domain get queued until one of the active requests completes.
* This limit is per domain (host), not per entire browser. If your page loads assets from multiple domains (e.g., CDN, APIs, images), each domain gets its own connection pool.

### Example scenario

Suppose your webpage needs 20 images from the same server:

1. The browser can fetch 6 images at once (parallel).
2. The remaining 14 requests wait in a queue.
3. As soon as one of the first 6 finishes, the next queued request starts.
4. This continues until all 20 are fetched.

### Why this rule exists

1. **Fairness** → Prevents a single website from hogging all network bandwidth.
2. **Performance balance** → Too many connections per site can slow things down due to TCP/TLS handshake overhead.
3. **Spec compliance** → It’s part of the HTTP/1.1 spec to avoid overload.

### HTTP/2 and HTTP/3 changed this
* With HTTP/1.1: Browsers needed multiple TCP connections to fetch many files in parallel, so the per-domain connection limit mattered a lot.
* With HTTP/2: Multiplexing allows many requests (hundreds) to share a single connection, removing the need for domain sharding.
* With HTTP/3: Same multiplexing benefits, but faster because it’s built on QUIC instead of TCP.

So in modern setups (where your site and server support HTTP/2/3), you don’t hit the 6–8 request bottleneck anymore.

### Practical impact

* Old strategy: Websites used to load assets from multiple subdomains (img1.example.com, img2.example.com) just to bypass the 6–8 request rule (called domain sharding).
* New strategy: With HTTP/2/3, best practice is to use fewer domains so multiplexing works efficiently.

### In short:
- With HTTP/1.1 → Browsers limit parallel requests to ~6–8 per domain, extra ones are queued.
- With HTTP/2/3 → Multiplexing allows many parallel requests over one connection, so the old limits don’t apply.