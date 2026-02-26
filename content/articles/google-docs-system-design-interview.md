---
title: "Design Google Docs - System Design Interview"
description: "Google Docs is a cloud-based word processor that allows multiple users to create, edit, and share documents in real-time via a web or mobile interface."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/google-docs-system-design-interview.md"
dateModified: "2025-05-08"
datePublished: "2025-05-08"
showOnArticles: true
topics:
  - system-design
---

Google Docs is a  **cloud-based word processor**  that allows multiple users to  **create, edit, and share documents in real-time**  via a web or mobile interface.

[![Generated image](https://substack-post-media.s3.amazonaws.com/public/images/2ac506e1-f620-4e47-97c9-66795cfa4870_1435x914.png)](https://substackcdn.com/image/fetch/$s_!oAwk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2ac506e1-f620-4e47-97c9-66795cfa4870_1435x914.png)

To design a system like Google Docs, we must solve several complex challenges like:

- Real-time editing with low latency
- Consistent document state across multiple users
- Conflict resolution when edits overlap
- Efficiently storing the documents
- Version history support
- and fine-grained access control

And all of this needs to scale to  **millions of users**  and  **thousands of concurrent document edits**  without sacrificing performance.

In this article, we will explore the  **high-level architecture** ,  **low-level details,** and the  **database and API design**  of a real-time collaborative editing system that supports all these features.

# 1. Requirements

Before diving into the architecture, let's summarize the core functional and non-functional requirements:

## 1.1 Functional Requirements

- **Create & Retrieve Documents:**  Users should be able to create new documents and retrieve them instantly.
- **Collaborative Editing:**  Multiple users should be able to edit the same document simultaneously, and view each other’s changes in real-time.
- **Rich Text Formatting:**  The system should support full document structure and formatting including headings, bold/italic text, lists, hyperlinks, etc.
- **Live Cursors & Presence:** Users should be able to see the cursor positions and presence of others.
- **Offline Access and Sync:**  Users should be able to edit documents offline (e.g. without internet), and the system should automatically sync changes once they reconnect.
- **Access Control and Sharing:**  Users should be able to share documents with specific permissions (view-only, comment, or edit).

## 1.2 Non-Functional Requirements

- **Real-Time Collaboration:** Edits should be reflected to all participants within milliseconds **.**
- **Scalability:**  The system should handle millions of users, and thousands of documents being edited concurrently.
- **Version History:**  The system should keep a history of changes for each document, allowing users to view or revert to earlier versions.
- **Data Consistency:**  Despite concurrent edits, all users should eventually see the same final document state.

# 2. Capacity Estimation

### Users and Documents

- **Monthly Active Users (MAU)** : 100 million
- **Daily Active Users (DAU)** : ~50 million
- **Peak Concurrent Users** : ~1 million
- **Average Documents per User** : 20
- **Total Documents** : 100M users × 20 docs = 2 billion documents

### Document Characteristics

- **Average Document Size** : 100 KB (structured text with formatting, comments, metadata)
- **Total Document Storage** : 2B docs × 100 KB = ~200 TB (Terabytes)
- **Version History Storage** : Assume 50 versions per document, and each version is a delta of ~1 KB: 2B docs × 50 × 1 KB = ~100 TB

### Real-Time Edits

- **Active Collaborative Sessions at Peak** : ~100K
- **Keystrokes per User per Minute** : 100
- **Total Keystrokes/sec at Peak** : 100K × 100 / 60 = ~167K operations/sec

Each of these keystrokes is typically sent as a separate operation to the server and then broadcast to all other collaborators on the same document.

# 3. High-Level Architecture

The architecture can be broken into several key components, as illustrated below:

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
