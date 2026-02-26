---
title: "Design a URL Shortener - System Design Interview"
description: "A URL shortener is a service that takes a long URL and returns a shorter, unique alias that redirects to the original URL."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-a-url-shortener.md"
dateModified: "2024-08-11"
datePublished: "2024-08-11"
showOnArticles: true
topics:
  - system-design
---

A URL shortener is a service that takes a long URL and returns a  **shorter** ,  **unique alias**  that redirects to the original URL.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/6fd33d17-c20b-4c0d-b56c-daebb20c6d39_940x1008.png)](https://substackcdn.com/image/fetch/$s_!lubU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6fd33d17-c20b-4c0d-b56c-daebb20c6d39_940x1008.png)Source: https://tinyurl.com

These services have become increasingly popular with the rise of social media platforms with character limits and the need for  **cleaner** , more  **shareable links** .

In this article, we will walk through the process of designing a scalable and efficient URL shortener service that can handle millions of URLs, provide fast redirections, and ensure high availability:

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# 1. Requirements Gathering

Before diving into the design, lets outline the functional and non-functional requirements.

## **1.1 Functional Requirements:**

- Generate a unique short URL for a given long URL
- Redirect the user to the original URL when the short URL is accessed
- Allow users to customize their short URLs (optional)
- Support link expiration where URLs are no longer accessible after a certain period
- Provide analytics on link usage (optional)

## **1.2 Non-Functional Requirements:**

- High availability (the service should be up 99.9% of the time)
- Low latency (url shortening and redirects should happen in milliseconds)
- Scalability (the system should handle millions of requests per day)
- Durability (shortened URLs should work for years)
- Security to prevent malicious use, such as phishing.

# 2. Capacity Estimation

Let’s assume the following traffic characteristics:

> **Daily URL Shortening Requests** : 1 million requests per day **Read:Write ratio:**  100:1 (for every URL creation, we expect 100 redirects) **Peak Traffic** : 10x the average load **URL Lengths** : Average original URL length of 100 characters

## **2.1 Throughput Requirements**

- **Average Writes Per Second (WPS):**  (1,000,000 requests / 86,400 seconds) ≈ 12
- **Peak WPS:**  12 ×10 = 120

Since Read:Write ratio is 100:1

- **Average Redirects per second (RPS):**   12 * 100 = 1,200
- **Peak RPS:**  120 * 100 = 12,000

## **2.2 Storage Estimation**

For each shortened URL, we need to store the following information:

- **Short URL** : 7 characters (Base62 encoded)
- **Original URL** : 100 characters (on average)
- **Creation Date** : 8 bytes (timestamp)
- **Expiration Date** : 8 bytes (timestamp)
- **Click Count** : 4 bytes (integer)

Total storage per URL:

- **Storage per URL** : 7 + 100 + 8 + 8 + 4 =127 bytes

Storage requirements for one year:

- **Total URLs per Year** : 1,000,000 × 365 = 365,000,000
- **Total Storage per Year** : 365,000,000 × 127 bytes ≈ 46.4 GB

## **2.3 Bandwidth Estimation**

Assuming the HTTP 301 redirect response size is about 500 bytes (includes headers and the short URL).

- **Total Read Bandwidth per Day** : 100,000,000 × 500 bytes = 50 GB / day
- **Peak Bandwidth** : If peak traffic is 10x average, the peak bandwidth could be as high as 500 bytes × 12,000 RPS = 6 MB/s

## 2.4 Caching Estimation

Since it’s a read-heavy system, caching can significantly reduce the latency for read requests.

If we want to cache some of the hot URLs, we can follow the  **80-20 rule**  where 20% of the URLs generate 80% of the read traffic.

Since we have 1 million writes per day, if we only cache 20% of the hot urls in a day,  **Total cache memory required**  = 1M * 0.2 * 127 Bytes = 25.4 MB.

Assuming a cache hit ratio of 90%, we only need to handle 10% of the redirect requests directly from the database.

**Requests hitting the DB** : 1,200 × 0.10 ≈ 120 RPS

This is well within the capabilities of most distributed databases like DynamoDB or Cassandra, especially with sharding and partitioning.

## **2.5 Infrastructure Sizing**

To handle the above estimations:

- **API Servers** : Start with 4-6 instances behind a load balancer, each capable of handling 200-300 RPS.
- **Database** : A distributed database with 10-20 nodes to handle both storage and high read/write throughput.
- **Cache Layer** : A distributed cache with 3-4 nodes, depending on the load and cache hit ratio.

# 3. High Level Design

On a high level, we would need following components in our design:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/57794829-95e3-4e38-a615-34527d6cecdd_2374x1370.png)](https://substackcdn.com/image/fetch/$s_!QCw7!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F57794829-95e3-4e38-a615-34527d6cecdd_2374x1370.png)

1. **Load Balancer** : Distributes incoming requests across multiple application servers.
2. **Application Servers** : Handles incoming requests for shortening URLs and redirecting users.
3. **URL Generation Service:**  Generates short URLs, handles custom aliases, and manages link expirations.
4. **Redirection Service:** Redirects the users to the original URL.
5. **Database** : Stores mappings between short URLs and long URLs.
6. **Cache** : Stores frequently accessed URL mappings for faster retrieval.
7. **Analytics Service (optional)** : Tracks usage statistics like the number of clicks, geographic location, etc.

# 4. Database Design

## 4.1 SQL vs NoSQL

To choose the right database for our needs, let's consider some factors that can affect our choice:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c41c4f22-c3df-4515-926a-0f2f1f03dcf8_1312x512.png)](https://substackcdn.com/image/fetch/$s_!d8I8!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc41c4f22-c3df-4515-926a-0f2f1f03dcf8_1312x512.png)

Given these points, a  **NoSQL database**  like  **DynamoDB**  or  **Cassandra**  is a better option due to their ability to efficiently handle billions of simple key-value lookups and provide high scalability and availability.

## 4.2 Database Schema

We would need two tables: one for storing url mappings and one for storing user related information.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/eda47435-0ebb-4426-9a17-c125dbe2b551_2496x1600.png)](https://substackcdn.com/image/fetch/$s_!YlcI!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Feda47435-0ebb-4426-9a17-c125dbe2b551_2496x1600.png)

# 5. API Design

We'll design RESTful APIs that are intuitive, efficient, and scalable.

Let's break down our API design into several key endpoints:

## 5.1 URL Shortening API

#### Endpoint: POST /shorten

This endpoint creates a new short URL for a given long URL.

**Sample Request:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/6f1e779f-6493-4a00-adec-5d203a02169b_1354x312.png)](https://substackcdn.com/image/fetch/$s_!lAhZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6f1e779f-6493-4a00-adec-5d203a02169b_1354x312.png)

**Sample Response:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/3485f63d-72bd-4584-af4e-1634188c12e5_1354x312.png)](https://substackcdn.com/image/fetch/$s_!E0jc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3485f63d-72bd-4584-af4e-1634188c12e5_1354x312.png)

## 5.2 URL Redirection API

#### Endpoint: GET /{short_url_key}

This endpoint redirects the user to the original long URL.

**Sample Response:**

```
HTTP/1.1 301 Moved Permanently Location: https://www.example.com/some/very/long/url
```

# 6. Diving Deep into Key Components

## 6.1  **URL Generator Service**

The primary function of the service is to generate a short, unique URL for each long URL provided by the user.

Here are some things to think about when picking an algorithm to shorten the URL:

- **URL Length** : Shorter is generally better, but it limits the number of possible distinct URLs you can generate.
- **Scalability** : The algorithm should work well even with billions of URLs.
- **Collision Handling** : The algorithm should be able to handle duplicate url generations.

#### **Approach 1: Hashing and Encoding**

A common approach for generating short URLs is to use a  **hash function** , such as  **MD5**  or  **SHA-256**  to generate a fixed-length hash of the original URL.

This hash is then encoded into a shorter form using  **Base62** .

Base62 uses alphanumeric characters (A-Z, a-z, 0-9), which are URL-friendly and provide a dense encoding space.

The length of the short URL is determined by the number of characters in the Base62 encoded string.

> A  **7-character Base62**  string can represent approximately  **3.5 billion unique URLs**   **(62^7)** .

**Example Workflow** :

1. User submits a request to generate short url for the long url: https://www.example.com/some/very/long/url/that/needs/to/be/shortened
2. Generate an MD5 hash of the long URL. MD5 produces a 128-bit hash, typically a 32-character hexadecimal string: 1b3aabf5266b0f178f52e45f4bb430eb
3. Instead of encoding the entire 128-bit hash, we typically use a portion of the hash (e.g., the first few bytes) to create a more manageable short URL.First 6 bytes of the hash: 1b3aabf5266b
4. First 6 bytes of the hash: 1b3aabf5266b
5. Convert these bytes to decimal: 1b3aabf5266b (hexadecimal) → 47770830013755 (decimal)
6. Encode the result into a Base62 encoded string: DZFbb43

The specific choice of 6 bytes (48 bits) is important because it produces a decimal number that typically converts to a Base62 string of approximately 7 characters.

Although this solution works for most cases, it has few  **issues** :

- It can generate the same shortened url for the identical long url requests.
- Although rare, collisions can happen, where two different URLs generate the same hash.

**Collision Resolution Strategies** :

- **Re-Hashing** : If a collision is detected, the service can re-hash the original URL with a different seed or use additional bits from the original hash to generate a unique short URL.
- **Incremental Suffix** : Another approach is to append an incremental suffix (e.g., "-1", "-2") to the short URL until a unique key is found.

#### **Approach 2: Unique ID Generation**

Instead of hashing, another method to generate short URLs is to use  **incremental IDs.**

In this approach, each new URL that is added to the system is assigned a unique,  **auto-incrementing ID** .

> For example, the first URL might be assigned ID 1, the second URL 2, and so on.

Once the ID is generated, it is converted into a shorter, URL-friendly format using Base62 encoding. This encoded string becomes the short URL.

Because the IDs are generated incrementally, each new ID is unique and sequential. There is no possibility that two different URLs will receive the same ID, as long as the ID generation mechanism (e.g., a database with an auto-incrementing primary key) is functioning correctly.

While the incremental ID approach is straightforward and collision-free, there are a few considerations:

- **Predictability:**  Incremental IDs are predictable, which means that someone could potentially infer the number of URLs shortened by your service or guess other users' URLs by simply incrementing the short URL. **Mitigation** : You can add a layer of obfuscation by encoding the ID with a random seed or shuffling the ID before encoding it with Base62.
- **Mitigation** : You can add a layer of obfuscation by encoding the ID with a random seed or shuffling the ID before encoding it with Base62.
- **Scalability** : If not designed properly, a single point of ID generation (like a centralized database) can become a scalability bottleneck. **Mitigation** : Distributed ID generation strategies (like Twitter’s Snowflake) can be used to maintain scalability while preserving uniqueness.
- **Mitigation** : Distributed ID generation strategies (like Twitter’s Snowflake) can be used to maintain scalability while preserving uniqueness.

#### **Custom Aliasing**

Custom aliasing allows users to specify their own short URL instead of accepting a system-generated one.

This feature is especially useful for branding or memorable URLs.

**Custom Alias Validation** :

- **Uniqueness Check** : The service must ensure that the custom alias provided by the user is unique and not already in use. This requires a lookup in the database to verify that the alias does not exist.
- **Character Validation** : Custom aliases should be validated to ensure they contain only allowed characters (e.g., alphanumeric characters, hyphens). This prevents the creation of problematic or non-URL-friendly aliases.
- **Reserved Aliases** : Some aliases might be reserved for internal use (e.g., "help", "admin", "about"). The Service Layer should check against a list of reserved words to prevent users from using these.

**Custom Alias Storage** :

- **Alias Mapping** : Once validated, the custom alias is mapped to the original URL and stored in the database, similar to system-generated short URLs.
- **Conflict Resolution** : If the requested custom alias is already taken, the Service Layer should return an appropriate error message or suggest alternatives.

#### **Link Expiration**

Link expiration allows URLs to be valid only for a specified period, after which they become inactive.

**Expiration Date Handling** :

- **User-Specified Expiration** : Users can specify an expiration date when creating the short URL. The service should validate this date to ensure it's in the future and within allowable limits (e.g., not exceeding a maximum expiration period).
- **Default Expiration** : If no expiration date is provided, the service can assign a default expiration period (e.g., 1 year) or keep the link active indefinitely.

**Expiration Logic** :

- **Background Jobs** : A background job or cron job can be scheduled to periodically check for expired URLs and mark them as inactive or delete them from the database.
- **Real-Time Expiration** : During the redirection process, the service checks whether the URL has expired. If expired, the service can return an error message or redirect the user to a default page.

## 6.2  **Redirection Service**

When a user accesses a short URL, this service is responsible for redirecting the user to the original URL.

This involves two key steps:

- **Database Lookup** : The Service Layer queries the database to retrieve the original URL associated with the short URL. This lookup needs to be optimized for speed, as it directly impacts user experience.
- **Redirection** : Once the long URL is retrieved, the service issues an HTTP redirect response, sending the user to the original URL.

**Example Workflow** :

1. A user clicks on https://short.ly/abc123.
2. The Redirection Service receives the request and extracts the short URL identifier (abc123).
3. The service looks up abc123 in the database or cache to find the associated long URL.
4. The service issues a 301 or 302 HTTP redirect response with the Location header set to the long URL (e.g., https://www.example.com/long-url).
5. The user's browser follows the redirect and lands on the original URL.

#### Caching for Performance

To reduce database load and improve latency, frequently accessed short URLs can be cached in an  **in-memory store like Redis** .

> The Redirection Service should first check the cache before querying the database.

## 6.3  **Analytics Service**

If the service needs to track analytics, such as the number of times a short URL is clicked, a separate analytics service can be introduced:

- **Event Logging** : Use a  **message queue (e.g., Kafka)**  to log each click event. This decouples the analytics from the core redirection service, ensuring that it doesn’t introduce latency.
- **Batch Processing** : Process logs in batches for aggregation and storage in a  **data warehouse**  for later analysis.

# 7. Addressing Key Issues and Bottlenecks

## 7.1 Scalability

#### **API Layer**

Deploy the API layer across multiple instances behind a load balancer to distribute incoming requests evenly.

#### **Sharding**

Implement sharding to distribute data across multiple database nodes.

- **Range-Based Sharding:**  If you are using an auto-incrementing ID as the shard key, the first shard might store IDs 1 to 1,000,000, the second shard 1,000,001 to 2,000,000, and so on. **Limitations:**  If your data isn’t evenly distributed, one shard may become much larger than others, leading to uneven load distribution (known as a "hotspot").
- **Limitations:**  If your data isn’t evenly distributed, one shard may become much larger than others, leading to uneven load distribution (known as a "hotspot").
- **Hash-Based Sharding:**  It involves applying a hash function to the shard key to determine which shard the data should go to. For example, you might hash the short URL identifier and then take the modulo with the number of shards to determine the shard (e.g., hash(short_url) % N where N is the number of shards). **Limitations:** When scaling out (adding new shards), re-hashing and redistributing data can be challenging and requires  **consistent hashing**  techniques to minimize data movement when adding or removing shards.
- **Limitations:** When scaling out (adding new shards), re-hashing and redistributing data can be challenging and requires  **consistent hashing**  techniques to minimize data movement when adding or removing shards.

#### **Caching**

Store frequently accessed short URL-to-long URL mappings in an  **in-memory cache**  like Redis or Memcached. This reduces the need to query the database on every request, significantly improving response times.

## 7.2 Availability

#### **Replication**

Use database replication to ensure that data is available even if some nodes fail.

#### **Failover**

Implement automated failover mechanisms for the API and data store layers to switch to backup servers in case of failure.

#### **Geo-Distributed Deployment**

Deploy the service across multiple geographical regions to reduce latency and improve availability.

## 7.3 Handling Edge Cases

#### **Expired URLs**

If the short URL has expired, the service should return a meaningful response (eg.. HTTP 410) rather than attempting to redirect.

#### **Non-Existent URLs**

If the short URL does not exist in the database, the service should handle this gracefully (eg.. HTTP 404 Not Found status code).

#### **URL Conflicts**

If a conflict arises where multiple long URLs could map to the same short URL (due to a hash collision or manual alias conflict), the service should have a strategy to resolve this.

> Implement collision detection during URL creation to prevent conflicts, and ensure that the Redirection Service always resolves to the correct long URL.

## 7.4 Security

#### **Rate Limiting**

To prevent abuse (e.g., spamming the service with thousands of URLs), implement rate limiting at the API layer.

#### **Input Validation**

Ensure that the URLs being shortened do not contain malicious content.

#### **HTTPS**

All communication between clients and the service should be encrypted using HTTPS to prevent eavesdropping and man-in-the-middle attacks.

#### **Monitoring and Alerts**

Set up monitoring for unusual activity patterns and trigger alerts for potential DDoS attacks or misuse.



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
