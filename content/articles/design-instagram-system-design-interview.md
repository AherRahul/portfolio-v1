---
title: "Design Instagram - System Design Interview"
description: "With over 2 billion monthly active users, Instagram is the 3rd most popular social network after Facebook and YouTube."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-instagram-system-design-interview.md"
dateModified: "2025-03-20"
datePublished: "2025-03-20"
showOnArticles: true
topics:
  - system-design
---

With over  **2 billion**  monthly active users,  **Instagram**  is the 3rd most popular social network after Facebook and YouTube.

[![What Are Instagram Highlights? Here's How I Make the Most of Them](https://substack-post-media.s3.amazonaws.com/public/images/c5014a9d-8b68-4408-acc9-70dd79976073_2100x1400.jpeg)](https://substackcdn.com/image/fetch/$s_!4umq!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc5014a9d-8b68-4408-acc9-70dd79976073_2100x1400.jpeg)source: https://www.makeuseof.com/tag/what-are-instagram-highlights/

It enables users to upload photos and videos, interact with content, while handling hundreds of millions of daily visitors, managing petabytes of data, billions of views, all while maintaining  **low latency**  and  **high availability** .

Given its scale and complexity, designing Instagram is a popular system design interview question.

While Instagram supports a wide range of features including direct messaging, Reels, and Stories—this article will primarily focus on  **the core functionality of photo and video sharing** .

We’ll walk through every step of the design—from requirements and high-level architecture to database and API design—before diving deep into core use cases.

# 1. Requirement Clarification

Before diving into the design, lets outline the functional and non-functional requirements.

### Functional Requirements

1. Users can  **upload**  photos and videos.
2. Users can add  **captions**  to their posts.
3. Users can  **follow/unfollow**  other users.
4. Users can  **like** ,  **share** , and  **comment**  on posts.
5. Support for multiple images/videos in a single post (carousel).
6. Users can view a  **personalized**   **feed**  consisting of posts from accounts they follow.
7. Users can  **search**  by username and hashtag.

#### **Out of Scope**

1. Direct messaging.
2. Short-form video content (Reels).
3. Push Notifications for likes, comments, and follows.

### Non Functional Requirements

1. **Low Latency:** The feed should load fast (~100ms).
2. **High Availability:** The system should be available 24/7 with minimal downtime.
3. **Eventual Consistency:** A slight delay in users seeing the latest posts from accounts they follow is acceptable.
4. **High Scalability:** Handle millions of concurrent users and billions of posts.
5. **High Durability:** The uploaded photos/videos shouldn’t be lost.

# 2. Capacity Estimation

### User Base

- **Total Monthly Active Users (MAUs):**  2 billion
- **Daily Active Users (DAUs):**  →  **500 million users/day**

### Estimating  **Read & Write Requests**

#### **Post Uploads (Writes)**

- 100M media uploads/day
- Each upload generates metadata writes (DB + cache)
- **Total write requests:**  100M uploads + 100M metadata writes = 200M writes/day

#### **Feed Reads**

- Assume an average user scrolls through 100 posts per session
- 500 million DAUs × 100 posts viewed = 50B feed requests/day
- Assuming 80% of feed reads are served from cache, backend reads = 10B DB reads/day

### Estimating Storage Requirements

#### Assumptions

- 20% of DAUs (100M) upload media every day
- 80% of uploads are photos, 20% are videos
- **Average photo size:**  1MB
- **Average video size:**  10 MB

#### **Daily Storage Calculation**

- **Photos:**  (100M × 80%) × 1 MB = 80 TB/day
- **Videos:**  (100M × 20%) × 10 MB = 200 TB/day
- **Total storage per day:**  280 TB/day

#### **Database Storage**

- **Metadata per post:**  ~500 bytes (caption, timestamp, author, engagement counts)
- **Total posts in a year:**  100M × 365 = 36B posts
- **Metadata storage per year:**  90 TB/year

#### Caching Requirements

- **Hot cache size:**  Store recent & popular 1 billion posts
- Assume each cached post takes 2 KB (post data + engagement counts)
- Cache size = 2 TB for active posts (Redis/Memcached)

# 3. High Level Design



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
