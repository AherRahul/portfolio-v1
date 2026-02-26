---
title: "Rate Limiting Algorithms Explained with Code"
description: "Rate limiting helps protects services from being overwhelmed by too many requests from a single user or client."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/rate-limiting-algorithms-explained-with-code.md"
dateModified: "2024-07-17"
datePublished: "2024-07-17"
showOnArticles: true
topics:
  - system-design
---

Rate limiting helps protects services from being overwhelmed by too many requests from a single user or client.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/9f62ee63-ccfd-40b9-b1d2-5be4d20395bf_278x344.png)](https://substackcdn.com/image/fetch/$s_!tIoU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9f62ee63-ccfd-40b9-b1d2-5be4d20395bf_278x344.png)

In this article we will dive into 5 of the most common rate limiting algorithms, their pros and cons and learn how to implement them in code.

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# 1. Token Bucket

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2955cacb-e76f-4606-b257-84718268524d_1132x956.png)](https://substackcdn.com/image/fetch/$s_!B6c-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2955cacb-e76f-4606-b257-84718268524d_1132x956.png)

The Token Bucket algorithm is one of the most popular and widely used rate limiting approaches due to its simplicity and effectiveness.

#### **How It Works** :

- Imagine a bucket that holds tokens.
- The bucket has a maximum capacity of tokens.
- Tokens are added to the bucket at a fixed rate (e.g., 10 tokens per second).
- When a request arrives, it must obtain a token from the bucket to proceed.
- If there are enough tokens, the request is allowed and tokens are removed.
- If there aren't enough tokens, the request is dropped.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/99b5890f-d100-416a-9948-b704daba4d47_3568x3068.png)](https://substackcdn.com/image/fetch/$s_!UyUO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F99b5890f-d100-416a-9948-b704daba4d47_3568x3068.png)

#### Pros:

- Relatively straightforward to implement and understand.
- Allows bursts of requests up to the bucket's capacity, accommodating short-term spikes.

#### Cons:

- The memory usage scales with the number of users if implemented per-user.
- It doesn’t guarantee a perfectly smooth rate of requests.

# 2. Leaky Bucket

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0815d30e-dc9c-4ff4-9eb8-ac76d21ba52d_1048x684.png)](https://substackcdn.com/image/fetch/$s_!vVHH!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0815d30e-dc9c-4ff4-9eb8-ac76d21ba52d_1048x684.png)

The Leaky Bucket algorithm is similar to Token Bucket but focuses on smoothing out bursty traffic.

#### How it works:

1. Imagine a bucket with a small hole in the bottom.
2. Requests enter the bucket from the top.
3. The bucket processes ("leaks") requests at a constant rate through the hole.
4. If the bucket is full, new requests are discarded.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/d07bb981-33a2-48f1-960b-8fb94f7220a4_3532x3516.png)](https://substackcdn.com/image/fetch/$s_!2d9c!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd07bb981-33a2-48f1-960b-8fb94f7220a4_3532x3516.png)

#### Pros:

- Processes requests at a steady rate, preventing sudden bursts from overwhelming the system.
- Provides a consistent and predictable rate of processing requests.

#### Cons:

- Does not handle sudden bursts of requests well; excess requests are immediately dropped.
- Slightly more complex to implement compared to Token Bucket.

# 3. Fixed Window Counter

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f6683da4-8b67-4bbf-bf95-8289d640e1b3_1236x832.png)](https://substackcdn.com/image/fetch/$s_!LeEy!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6683da4-8b67-4bbf-bf95-8289d640e1b3_1236x832.png)

The Fixed Window Counter algorithm divides time into fixed windows and counts requests in each window.

#### How it works:

1. Time is divided into fixed windows (e.g., 1-minute intervals).
2. Each window has a counter that starts at zero.
3. New requests increment the counter for the current window.
4. If the counter exceeds the limit, requests are denied until the next window.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/643a169a-b6c9-4130-b68e-3fe805df4865_3532x3248.png)](https://substackcdn.com/image/fetch/$s_!z3UI!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F643a169a-b6c9-4130-b68e-3fe805df4865_3532x3248.png)

#### Pros:

- Easy to implement and understand.
- Provides clear and easy-to-understand rate limits for each time window.

#### Cons:

- Does not handle bursts of requests at the boundary of windows well. Can allow twice the rate of requests at the edges of windows.

# 4. Sliding Window Log

[![image](https://substack-post-media.s3.amazonaws.com/public/images/b4db0d4a-77b4-44b1-b5c9-50c02d4764ec_950x622.png)](https://substackcdn.com/image/fetch/$s_!zeZh!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb4db0d4a-77b4-44b1-b5c9-50c02d4764ec_950x622.png)

The Sliding Window Log algorithm keeps a log of timestamps for each request and uses this to determine if a new request should be allowed.

#### How it works:

1. Keep a log of request timestamps.
2. When a new request comes in, remove all entries older than the window size.
3. Count the remaining entries.
4. If the count is less than the limit, allow the request and add its timestamp to the log.
5. If the count exceeds the limit, request is denied.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1d45128c-2c85-4158-8731-f7c3893ec994_3532x3068.png)](https://substackcdn.com/image/fetch/$s_!Qy78!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1d45128c-2c85-4158-8731-f7c3893ec994_3532x3068.png)

#### Pros:

- Very accurate, no rough edges between windows.
- Works well for low-volume APIs.

#### Cons:

- Can be memory-intensive for high-volume APIs.
- Requires storing and searching through timestamps.

# 5. Sliding Window Counter

[![image](https://substack-post-media.s3.amazonaws.com/public/images/80181659-e4fa-4398-bd12-bef659174e81_972x686.png)](https://substackcdn.com/image/fetch/$s_!KT3o!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F80181659-e4fa-4398-bd12-bef659174e81_972x686.png)

This algorithm combines the Fixed Window Counter and Sliding Window Log approaches for a more accurate and efficient solution.

Instead of keeping track of every single request’s timestamp as the sliding log does, it focus on the number of requests from the last window.

So, if you are in 75% of the current window, 25% of the weight would come from the previous window, and the rest from the current one:

```
weight = (100 - 75)% * lastWindowRequests + currentWindowRequests
```

Now, when a new request comes, you add one to that weight (weight + 1). If this new total crosses our set limit, we have to reject the request.

#### How it works:

1. Keep track of request count for the current and previous window.
2. Calculate the weighted sum of requests based on the overlap with the sliding window.
3. If the weighted sum is less than the limit, allow the request.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a5bf707c-52e2-49ed-a9b6-c8deb4bfd409_3680x3876.png)](https://substackcdn.com/image/fetch/$s_!MNuT!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa5bf707c-52e2-49ed-a9b6-c8deb4bfd409_3680x3876.png)

#### Pros:

- More accurate than Fixed Window Counter.
- More memory-efficient than Sliding Window Log.
- Smooths out edges between windows.

#### Cons:

- Slightly more complex to implement.

When implementing rate limiting, consider factors such as the scale of your system, the nature of your traffic patterns, and the granularity of control you need.

Lastly, always communicate your rate limits clearly to your API users, preferably through response headers, so they can implement appropriate retry and backoff strategies in their clients.



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
