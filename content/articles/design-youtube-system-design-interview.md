---
title: "Design YouTube - System Design Interview"
description: "With over 2.5 billion monthly active users, YouTube is the second most visited website in the world—trailing only Google."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-youtube-system-design-interview.md"
dateModified: "2025-01-30"
datePublished: "2025-01-30"
showOnArticles: true
topics:
  - system-design
---

With over  **2.5 billion**  monthly active users,  **YouTube**  is the second most visited website in the world—trailing only Google.

[![YouTube Community Guidelines & Policies ...](https://substack-post-media.s3.amazonaws.com/public/images/dd6ebc95-a2e6-48f1-b19c-2006706fef63_310x163.png)](https://substackcdn.com/image/fetch/$s_!15zT!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdd6ebc95-a2e6-48f1-b19c-2006706fef63_310x163.png)

As a  **video-sharing platform** , it enables users to upload, watch, and interact with video content, while handling hundreds of millions of daily visitors, managing petabytes of data, and ensuring real-time video delivery across the globe.

In this article, we’ll explore the  **system design of a large-scale video streaming service like YouTube**  that can accommodate hundreds of millions of daily users and billions of views, all while maintaining low latency and high availability.

We’ll walk through every step of the design—from requirements and high-level architecture to database and API design—before diving deep into core use cases.

The concepts covered here are equally applicable to other large-scale video platforms such as  **Netflix**  and  **Prime Video** .

# 1. Requirements Gathering

Before diving into the design, lets outline the functional and non-functional requirements.

### **Functional Requirements**

- Users should be able to  **upload**  video files.
- Uploaded videos must be  **transcoded**  into multiple resolutions (e.g., 240p, 360p, 720p, 1080p) to support different network conditions and devices.

- Users should be able to  **stream**  videos in real-time with  **adaptive bitrate streaming**  to adjust quality based on network conditions.

- Users can  **search**  for videos by title, tags, or description.
- Users can  **like**  and  **comment**  on videos.
- Users should be able to create and subscribe to  **channels** .

### **Non-Functional Requirements:**

1. **Scalability:**  The system should support millions of concurrent users and thousands of video uploads per minute.
2. **High Availability:**  Core features like video upload, playback, and search should have minimal downtime.
3. **Low Latency:**  Fast video streaming with minimal buffering and near-instantaneous search results.
4. **Durability:**  Video files must be stored reliably, with redundancy mechanisms to prevent data loss due to hardware failures.
5. **Cost Efficiency:**  Optimize storage and bandwidth costs.

# 2. Capacity Estimation

#### **Assumptions:**

- **Daily Active Users (DAU):**  10 million
- **Upload Rate:**  ~100,000 videos/day
- **Average Videos Watched per User per Day:**  5 videos
- **Average Video Size:**  500 MB.
- **Metadata Size per Video:**  1 KB.

#### **Storage Estimation:**

- **Daily Storage for Videos** : 100,000 videos / day * 500 MB / video = 50 TB / day
- **Daily Video Metadata Storage** : 100,000 * 1KB = 100MB / day

#### **Network Bandwidth Estimation:**

- **Daily Video Consumption:** 10 million users × 5 videos/user = 50 million views/day
- **Daily Bandwidth Requirements (without compression & caching)** : 50 million views * 500 MB / day = 25 PB / day

Given the high storage and bandwidth requirements, leveraging  **cloud-based services**  is the most practical approach:

1. **Content Delivery Network (CDN):**  To cache frequently accessed videos closer to users and reduce latency.
2. **Blob Storage (e.g., AWS S3):**  To store video files reliably with redundancy.

# 3. High Level Design

We can break the architecture of YouTube into two primary components:

- **Video Streaming**  – Handles video playback, and delivery.
- **Video Upload & Processing**  – Manages user uploads, transcoding, and metadata storage.

## 3.1 Video Streaming Architecture

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
