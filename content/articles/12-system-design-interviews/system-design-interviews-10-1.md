---
title: "Design Instagram"
description: "Design Instagram - System Design Interviews Module 10"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design Instagram

#### What is Instagram?

[Instagram](https://www.instagram.com/) is a social media platform focused on sharing photos and short videos. Users can upload media, apply filters, add captions, follow other users, and engage through likes, comments, and direct messages.

Instagram

JD

SD

sarah.designs

1.2K likes

sarah.designs New design project coming soon! Stay tuned for something amazing

View all 2 comments

2 hours ago

JD

ET

emma.travels

3.9K likes

emma.travels Golden hour in Santorini. Some moments are worth waiting for

View all 3 comments

5 hours ago

JD

MP

mike.photos

892 likes

mike.photos Simple moments, beautiful memories

View all 1 comments

8 hours ago

JD

DF

david.fitness

567 likes

david.fitness Morning workout done! Starting the day right

View all 1 comments

12 hours ago

JD

Over time, it has expanded to include features such as stories, reels, live streaming, and recommendations.

In this chapter, we will walk through the **high-level design of a photo-sharing platform like Instagram.**

While Instagram supports a wide range of features including direct messaging, Reels, and Stories, this article will primarily focus on **the core functionality of photo and video sharing**.

Let’s start by clarifying the requirements.

# 1\. Requirement Clarification

Before diving into the design, lets outline the functional and non-functional requirements.

### Functional Requirements

1.  Users can **upload** photos and videos.
2.  Users can add **captions** to their posts.
3.  Users can **follow/unfollow** other users.
4.  Users can **like**, **share**, and **comment** on posts.
5.  Support for multiple images/videos in a single post (carousel).
6.  Users can view a **personalized** **feed** consisting of posts from accounts they follow.
7.  Users can **search** by username and hashtag.

#### **Out of Scope**

1.  Direct messaging.
2.  Short-form video content (Reels).
3.  Push Notifications for likes, comments, and follows.

### Non Functional Requirements

1.  **Low Latency:** The feed should load fast (~100ms).
2.  **High Availability:** The system should be available 24/7 with minimal downtime.
3.  **Eventual Consistency:** A slight delay in users seeing the latest posts from accounts they follow is acceptable.
4.  **High Scalability:** Handle millions of concurrent users and billions of posts.
5.  **High Durability:** The uploaded photos/videos shouldn’t be lost.

# 2\. Capacity Estimation

### User Base

*   **Total Monthly Active Users (MAUs):** 2 billion
*   **Daily Active Users (DAUs):** → **500 million users/day**

### Estimating **Read & Write Requests**

#### **Post Uploads (Writes)**

*   100M media uploads/day
*   Each upload generates metadata writes (DB + cache)
*   **Total write requests:** 100M uploads + 100M metadata writes = 200M writes/day

#### **Feed Reads**

*   Assume an average user scrolls through 100 posts per session
*   500 million DAUs × 100 posts viewed = 50B feed requests/day
*   Assuming 80% of feed reads are served from cache, backend reads = 10B DB reads/day

### Estimating Storage Requirements

#### Assumptions

*   20% of DAUs (100M) upload media every day
*   80% of uploads are photos, 20% are videos
*   **Average photo size:** 1MB
*   **Average video size:** 10 MB

#### **Daily Storage Calculation**

*   **Photos:** (100M × 80%) × 1 MB = 80 TB/day
*   **Videos:** (100M × 20%) × 10 MB = 200 TB/day
*   **Total storage per day:** 280 TB/day

#### **Database Storage**

*   **Metadata per post:** ~500 bytes (caption, timestamp, author, engagement counts)
*   **Total posts in a year:** 100M × 365 = 36B posts
*   **Metadata storage per year:** 90 TB/year

#### Caching Requirements

*   **Hot cache size:** Store recent & popular 1 billion posts
*   Assume each cached post takes 2 KB (post data + engagement counts)
*   Cache size = 2 TB for active posts (Redis/Memcached)

# 3\. High Level Design

### Components:

#### 1\. Clients (Web, Mobile)

*   Users interact with the platform via web browsers or mobile apps.
*   The client applications handle video playback, user interactions (likes, comments), and UI rendering.
*   They communicate with backend services through an **API Gateway** or **Load Balancer**.

#### 2\. Load Balancer / API Gateway

*   Acts as the single entry point for all client requests.
*   Distributes incoming traffic across multiple service instances to ensure **high availability** and **scalability**.
*   Enforces **rate limiting**, **authentication**, and **authorization** before forwarding requests to downstream services.

#### 3\. User Service

*   Stores and manages **user authentication, profile data, and social connections** (follow/unfollow).

#### 4\. Post Service

*   Handles **photo/video uploads** and stores metadata (caption, user info, timestamps).
*   Coordinates the upload of media files from users device to **Object Storage (e.g., AWS S3)** and updates metadata in a **database**.
*   Uses a message queue (e.g., **Kafka) to notify the Feed Service** when a new post is created.

#### 5\. Feed Service

*   Precomputes and stores user feeds in a high-performance cache (e.g., Redis, Memcached) to enable fast retrieval.
*   Queries the database if a feed is not cached.

#### 6\. Engagement Service

*   Manages **likes, comments, and shares**.
*   Writes engagement data to a high-throughput database asynchronously via a message queue.

#### 7\. Search Service

*   Allows users to search for other users, hashtags, and posts.
*   Uses **Elasticsearch** to index and retrieve data quickly.
*   Supports **autocomplete and full-text search** for improved user experience.

#### 8\. Message Queue

*   Decouples services and ensures event-driven processing.
*   Notifies the **Feed Service** of new posts.
*   Updates engagement data asynchronously.

#### **9\. Object Storage & CDN**

*   Photos/videos are stored in a distributed object Storage (S3, Google Cloud Storage).
*   A **CDN (Cloudflare, AWS CloudFront)** ensures fast delivery globally.

# 4\. Database Design

A large-scale content platform like Instagram requires handling both **structured data** (e.g., user accounts, post metadata) and **unstructured/semistructured data** (e.g., photos, videos, search indexes).

Typically, you’ll combine multiple database solutions to handle different workloads.

Given the requirements, we will use a **relational database (e.g., PostgreSQL, MySQL)** for structured data and a **NoSQL database (Cassandra, DynamoDB, or Elasticsearch)** for feed storage and search indexing.

## 4.1 Relational Database for Structured Data

Given the structured nature of user profiles and posts metadata, a relational database (like **PostgreSQL** or **MySQL**) is often well-suited.

*   **Users Table:** Stores user account details.
*   **Posts Table:** Stores metadata related to posts.
*   **Media Table:** Stores photo/video metadata, but not the actual files.
*   **Comments Table:** Stores post comments.
*   **Shares Table:** Stores post shares.
*   **Followers Table:** Maintains the follow/unfollow relationship. Stores engagement score from followers to help with ranking posts in the feed.

## 4.2 NoSQL Databases for High-Volume Data

While relational databases are ideal for structured data, they struggle with high-velocity writes and large scale distributed workloads. NoSQL databases like **Cassandra, DynamoDB, or Redis** provide horizontal scalability and high availability.

To reduce **feed generation latency**, a **denormalized feed table** stores precomputed timelines:

Json

```json
1{
2  "user_id": 56789,
3  "feed": [
4    {"post_id": 111, "user_id": 123, "media_url": "s3://path1", "caption": "Hello world"},
5    {"post_id": 112, "user_id": 234, "media_url": "s3://path2", "caption": "Sunset view"}
6  ]
7}
```

*   Updated **asynchronously** via **Kafka** when a user posts.
*   Cached **in Redis for quick retrieval**.

#### **Using Graph Databases for Social Connections**

To support complex relationship queries, such as mutual friends, suggested followers, and influencer ranking, we can use a **graph database** like Neo4j or Amazon Neptune.

They efficiently model follower-following relationships with nodes and edges.

**Example Query: "People You May Know"**

```shell
MATCH (me:User {id:12345})-[:FOLLOWS]->(friend)-[:FOLLOWS]->(suggested)
WHERE NOT (me)-[:FOLLOWS]->(suggested)
RETURN suggested LIMIT 5
```

This allows **real-time friend suggestions** without complex SQL joins.

## 4.3 Search Indexes

To support fast and scalable search queries, we can leverage **Elasticsearch**, a distributed, real-time search engine optimized for full-text searches.

Each user profile and post metadata can be stored as a document in an Elasticsearch index, allowing quick lookups and advanced filtering.

**Example: Storing User Data in Elasticsearch**

Json

```json
1{
2  "user_id": 12345,
3  "username": "john_doe",
4  "full_name": "John Doe",
5  "bio": "Photographer | Traveler"
6}
```

To support trending hashtags and keyword searches, we can store **hashtags** in a separate Elasticsearch index.

**Example:**

Json

```json
1{
2  "hashtag": "#travel",
3  "post_count": 1500000,
4  "last_used": "2025-03-20T12:00:00Z"
5}
```

## 4.4 Media Storage

Instagram handles **petabytes of photos/videos**, requiring a **durable and low-latency storage solution**.

A **distributed object storage system**, such as **Amazon S3**, is well-suited for storing media files. It supports **pre-signed URLs**, enabling users to upload media directly without routing through application servers, reducing load and latency.

To ensure **high durability**, media files are stored in multiple replicas across different data centers, protecting against data loss.

To further optimize read latency, content can be cached closer to users using a **Content Delivery Network (CDN)** like **Cloudflare or Amazon CloudFront**. This reduces load times and improves the user experience, especially for frequently accessed media.

# 5\. API Design

### **5.1 Get User Profile**

```shell
GET /api/v1/users/{user_id}
Authorization: Bearer JWT_TOKEN
```

**Response:**

Json

```json
1{
2  "user_id": 12345,
3  "username": "john_doe",
4  "full_name": "John Doe",
5  "profile_pic": "https://cdn.example.com/profile.jpg",
6  "followers_count": 200,
7  "following_count": 150
8}
```

### **5.2** Follow a User

```shell
POST /api/v1/users/{user_id}/follow
Authorization: Bearer JWT_TOKEN
```

### **5.3 Create a New Post**

```shell
POST /api/v1/posts
Authorization: Bearer JWT_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**

```shell
caption: "Sunset at the beach"
media: [image1.jpg, video1.mp4]
```

**Response:**

```json
{
  "post_id": 98765,
  "message": "Post uploaded successfully"
}
```

### **5.4 Get a Post by ID**

```shell
GET /api/v1/posts/{post_id}
```

**Response:**

Json

```json
1{
2  "post_id": 98765,
3  "user_id": 12345,
4  "caption": "Sunset at the beach",
5  "media": [
6    "https://cdn.example.com/photo1.jpg",
7    "https://cdn.example.com/video1.mp4"
8  ],
9  "likes_count": 500,
10  "comments_count": 120
11}
```

### **5.5 Get User Feed**

Shell

```shell
1GET /api/v1/feed?page=1&limit=10
2Authorization: Bearer JWT_TOKEN
```

**Response:**

Json

```json
1[
2  {
3    "post_id": 123,
4    "user": {
5      "user_id": 56789,
6      "username": "travel_lover"
7    },
8    "caption": "Exploring the mountains!",
9    "media": ["https://cdn.example.com/photo123.jpg"],
10    "likes_count": 1200,
11    "comments_count": 85
12  },
13  {
14    "post_id": 124,
15    "user": {
16      "user_id": 98765,
17      "username": "foodie_dude"
18    },
19    "caption": "Delicious sushi!",
20    "media": ["https://cdn.example.com/photo124.jpg"],
21    "likes_count": 980
22  }
23]
```

### **5.6** Like a Post

```shell
POST /api/v1/posts/{post_id}/like
Authorization: Bearer JWT_TOKEN
```

### **5.7 Comment on a Post**

```shell
POST /api/v1/posts/{post_id}/comment
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

```json
{
  "content": "Amazing shot!"
}
```

### **5.8 Get Comments for a Post**

```shell
GET /api/v1/posts/{post_id}/comments?page=1&limit=10
```

**Response:**

Json

```json
1[
2  {
3    "comment_id": 65432,
4    "user": {
5      "user_id": 12345,
6      "username": "john_doe"
7    },
8    "content": "Amazing shot!",
9    "created_at": "2025-03-18T12:34:56Z"
10  },
11  {
12    "comment_id": 65433,
13    "user": {
14      "user_id": 67890,
15      "username": "nature_lover"
16    },
17    "content": "Breathtaking view!"
18  }
19]
```

### **5.9 Search Users**

```shell
GET /api/v1/search/users?q=john
```

**Response:**

Json

```json
1[
2  {
3    "user_id": 12345,
4    "username": "john_doe",
5    "full_name": "John Doe",
6    "profile_pic": "https://cdn.example.com/profile.jpg"
7  }
8]
```

# 6\. Design Deep Dive

## **6.1 Photo/Video Upload**

1.  **User Initiates the Upload**

1.  The user selects one or more photos or videos and enters a caption.
2.  The client (mobile app/web browser) sends an upload request to the API Gateway.

3.  **API Gateway Handles the Request**

1.  The API gateway authenticates and validates the request.
2.  Routes the request to the Post Service.

5.  **Post Service Generates a Pre-signed URL**

1.  Instead of uploading media directly through the backend, the Post Service generates pre-signed URLs from Object Storage (one per media file).
2.  It sends the pre-signed URLs back to the client.

7.  **Client Uploads Media to Object Storage**

1.  The client directly uploads each file in parallel to Object Storage via the pre-signed URLs.
2.  This reduces backend load and enables faster parallel uploads.
3.  Once all uploads are complete, the client sends a confirmation request to the backend with all media URLs.

9.  **Post Service Saves Metadata in the Database**

1.  The Post Service stores post metadata (caption, timestamp, user ID) in the Posts table and stores each media file separately in the Media Table.

11.  **Kafka Publishes a "New Post" Event**

1.  The Post Service sends an event to Kafka, notifying the Feed Service.

## **6.2 Newsfeed Generation**

Since users follow both normal users and celebrities, the system must mix posts efficiently.

### Fan-out-on-write (Push Model) for Normal Users

For **normal users** with a manageable number of followers, we use **fan-out-on-write**, meaning posts are **pushed** to followers’ feeds at the time of posting.

#### **How It Works**

1.  User A posts a new photo/video.
2.  The Post Service sends an event to Kafka, notifying the Feed Service.
3.  The Feed Service identifies the users followers (e.g., 500 followers).
4.  The post is immediately inserted into each follower’s timeline, stored in Redis (hot cache).
5.  When followers open their feeds, posts are instantly available, ensuring low-latency reads.

**Example: LPUSH - Add Post to Followers’ Feeds**

*   User `12345` (John Doe) posts a new photo
*   He has 500 followers
*   The Feed Service pushes this post to all 500 followers' feeds

```shell
LPUSH feed:56789 "{'post_id': 98765, 'author': 'john_doe', 'media_url': 'https://cdn.instagram.com/photo98765.jpg', 'caption': 'Sunset at the beach!', 'timestamp': '2025-03-20T14:30:00Z'}"

LPUSH feed:67890 "{'post_id': 98765, 'author': 'john_doe', 'media_url': 'https://cdn.instagram.com/photo98765.jpg', 'caption': 'Sunset at the beach!', 'timestamp': '2025-03-20T14:30:00Z'}"

LPUSH feed:78901 "{'post_id': 98765, 'author': 'john_doe', 'media_url': 'https://cdn.instagram.com/photo98765.jpg', 'caption': 'Sunset at the beach!', 'timestamp': '2025-03-20T14:30:00Z'}"

...
```

Here, John's post is pushed to the feeds of followers `56789`, `67890`, and `78901`, along with 497 other followers.

**Example: Fetching a User’s Feed (LRANGE - Get Recent Posts)**

```shell
LRANGE feed:56789 0 9  # Fetch the latest 10 posts from user 56789's feed
```

**Benefits**:

*   Super-fast reads since followers' feeds are pre-loaded.
*   Works efficiently for small and medium-sized accounts.

**Challenges**:

*   Becomes inefficient for users with millions of followers (e.g., celebrities).
*   Writing a post requires copying it to potentially millions of timelines, leading to high write amplification.

### Fan-out-on-read (Pull Model) for Celebrities

For **celebrities and influencers**, where a single post may need to reach **millions of followers**, preloading into every follower’s feed is impractical.

Instead, a **fan-out-on-read (pull model)** is used.

#### **How It Works**

1.  When a user requests their newsfeed, the Feed Service dynamically retrieves:

*   Normal users’ posts from Redis (precomputed feeds).
*   Celebrity posts from a hot cache (Redis) or a persistent store (PostgreSQL).

3.  The system merges both types of posts in real-time before serving the feed.

**Benefits**:

*   Avoids massive write operations, keeping the system scalable.
*   Ensures fresh data when users request feeds.

**Challenges**:

*   Slightly higher read latency than the push model.
*   Requires caching optimization to reduce database lookups.

## **6.3 Search**

### Indexing New Content

1.  **A New Post/User is Created**

1.  A user uploads a post or creates an account.
2.  The Post/User stores metadata in the database.
3.  The Post/User Service publishes an event to Kafka.

3.  **Search Service Updates Elasticsearch Index**

1.  The Search Service consumes Kafka events and adds new users, posts, or hashtags to Elasticsearch.

### Search Request

1.  **User Initiates a Search Request**

1.  The user types a query in the search bar (e.g., `"john_doe"` or `"#travel"`).
2.  The client (mobile/web) sends a request. The request is routed via the API Gateway to the Search Service.

3.  **Search Service Queries Elasticsearch**

1.  The Search Service first checks Redis Cache for recent searches. If not found, queries Elasticsearch for relevant results.
2.  Elasticsearch performs full-text search, prefix matching and ranking based on engagement/popularity.

5.  **Elasticsearch Returns Results**

1.  Elasticsearch returns ranked results matching the query.
2.  The Search Service formats the response.

7.  **Search Results are Cached in Redis**

1.  The Search Service caches frequent queries in Redis for faster lookups.
2.  Next time a user searches for the same query, the result is served from Redis instantly.

## **6.4 Like, Comments and Shares**

The **Engagement Service** processes like, comment and share requests.

It sends a Kafka event to update the DB asynchronously.

**Like event:**

Json

```json
1{
2  "event": "POST_LIKED",
3  "user_id": 12345,
4  "post_id": 67890
5}
```

**Share event:**

Json

```json
1{
2  "event": "POST_SHARED",
3  "user_id": 12345,
4  "post_id": 67890
5}
```

**Comment event:**

Json

```json
1{
2  "event": "POST_COMMENTED",
3  "user_id": 12345,
4  "post_id": 67890,
5  "comment_id": 99999,
6  "content": "Amazing shot!"
7}
```

To optimize the latency for popular posts, we can cache like / share count and top comments.

# 7\. Addressing Scalability, Availability and Durability

## 7.1 Scalability

Scalability ensures the system can handle increasing load without degrading performance.

#### **Horizontal Scaling (Scale Out)**

*   Use distributed databases (Cassandra, DynamoDB) to distribute data across nodes.
*   Deploy multiple instances of services behind a load balancer to handle user requests.

#### **Sharding**

*   Implement sharding to split large datasets.
*   User Data → Shard by `user_id mod N`
*   Posts → Shard by `post_id mod N`
*   Followers Table → Shard by `follower_id mod N`

#### Microservices Architecture

*   Break the system into independent services (e.g., Feed Service, Post Service, User Service) to improve maintainability and scalability.
*   Use message queues (Kafka, RabbitMQ) to handle high-throughput operations asynchronously (e.g., processing notifications, updates, and feed generation).

## 7.2 Availability

Availability ensures that Instagram remains accessible 24/7, even in the face of failures. Given its global user base, the platform must achieve atleast 99.99% uptime.

#### Redundancy & Replication

*   Maintain replicated databases across multiple regions (e.g., PostgreSQL replicas, Cassandra multi-region clusters).
*   Deploy multiple application servers across different availability zones (AZs).

#### Failover Mechanisms

*   Use automatic failover in databases (e.g., leader-follower setup in PostgreSQL, multi-leader Cassandra clusters).
*   Implement circuit breakers to gracefully degrade service if a dependency fails.

## 7.3 Durability

Durability ensures that data—especially user-generated content (photos, videos, comments, likes)—is never lost, even in case of system failures.

#### **Distributed Object Storage**

*   Store media in Amazon S3 / Google Cloud Storage, which replicates data across multiple locations to prevent loss.

#### Database Replication & Backups

*   Use multi-region replication (Cassandra, DynamoDB, PostgreSQL replicas) for disaster recovery.
*   Perform regular backups to prevent accidental data loss.

#### Write-Ahead Logging (WAL) & Event Sourcing

*   Implement WAL in databases to ensure changes are recorded before committing.
*   Use event sourcing to log user actions (e.g., new posts, likes) and rebuild state if necessary.

# Quiz

## Design Instagram Quiz

1 / 20

Multiple Choice

Which component is primarily responsible for serving photos/videos quickly to users worldwide?

ASearch index serving media bytesBCDN in front of object storageCFeed cache storing user timelinesDRelational database replicas

PreviousNext

Launching soon
