---
title: "What is short polling? Learn with example"
description: "Dive into short polling methodologies. Explore the technique of frequent requests to servers at fixed intervals, enabling frontend applications to obtain recent data updates for dynamic content."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-03-01"
datePublished: "2025-03-01"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048345/Portfolio/FrontendSystemDesignCourse/titleImages/6_wuthq9.png)


Ah, I see! Let’s imagine this scenario: You’re super hungry, but the kitchen is closed. You can’t just go in and make something yourself, so you’ve ordered food, but you’re not sure when it’ll be ready. What do you do? You can’t wait forever, so you keep knocking on the kitchen door at regular intervals, hoping to see if your food is ready yet.

Every few seconds, you knock again, checking if it’s time to eat. It’s not constant—just a brief check, then you wait and knock again after a short while. This is exactly like short polling. You keep checking for an update (your food being ready) at small intervals, without establishing a long connection, just knocking (or requesting) repeatedly until you get the response.

In short polling, just like you keep knocking, the system repeatedly asks for data at regular intervals, waiting for a response each time.

So, here we are going to discuss short polling, including its interview perspective with examples and code. So, let's not wait anymore and start learning.

It is a methodology we generally use to connect the front end to the backend—a communication technique.

Generally, when we need data, the front end calls an API and uses it. If you need data again, you call the API, and it provides the data after each request.

![image.png](https://heyashu.in/images/blogs/sp_2.png)

But what if you need this data quickly, like loading a cricket score, checking notifications from the backend, or seeing if the delivery boy has arrived? This is called the short polling technique, where you repeatedly call or check for results in real-time and need constant updates.

It is not a persistent connection but retrieves data after each call. We are not increasing or establishing a new connection over an existing one. Instead, we call the API each time, but the calling frequency is very high, happening again and again.

![image.png](https://heyashu.in/images/blogs/sp_3.png)

So, to check real-time data, you can use short polling. But remember, calling an API repeatedly is not scalable. If the API has limited resources, you can use this method, but for large-scale applications, it is not recommended.

### Usage of Short Polling

1. Real-time systems
2. Notification data
3. Cricinfo (cricket updates)
4. Analytics
5. Checking anything you need in real-time
6. Normal chat applications (not the best approach, but possible)

### Let's Code

Now, it's time to code! Clone this repo if you want to see it live:

[GitHub Repo](https://github.com/ashumsd7/web-communication-techniques)

```jsx
git clone https://github.com/ashumsd7/web-communication-techniques.git
cd web-communication-techniques
npm i
npm run short-polling
-------------------
Open browser and type
http://localhost:3000/ // Observe API Calls in network tab
```

When you visit http://localhost:3000/, you will see an API being called every 5 seconds. That is short polling in action.

```jsx
    <script>
        function fetchData() {
            fetch('http://localhost:3000/getData')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('currentTime').textContent = data;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

        // Fetch data immediately and then every 2 seconds
        fetchData();
        // Do not forget to clear this interval 
        setInterval(fetchData, 5000);
    </script>
```

So, in the above example, you will see a function called `fetchData`, which is being called every 5 seconds. Each time it runs, it fetches data from `/getData` and updates the web page.

After closing the project, if you observe the API calls, you will notice that it is being called repeatedly at regular intervals. See the screenshot below for reference.

![image.png](https://heyashu.in/images/blogs/sp_4.png)

Zoom in on the page and observe the timing—it’s just 2, 4, 6, or 7 milliseconds, which is very low. The resources used are also minimal, just a few bytes.

So, short polling is only recommended when you need to load small amounts of data quickly on the web, and your requests are fast. For large-scale requirements, it is not recommended.

### Characteristics of Short Polling

1. Short-lived connection
2. No persistent data
3. Low resource usage
4. Scalability issues

That’s all for this topic! See you in long polling.

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.

I am waiting for your feedback, See you in next episode,


Thanks 👋🏻