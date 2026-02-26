---
title: "Design a Web Crawler - System Design Interview"
description: "A web crawler (also known as a spider) is an automated bot that systematically browses the internet, following links from page to page to discover and collect web content."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-a-web-crawler-system-design-interview.md"
dateModified: "2025-06-08"
datePublished: "2025-06-08"
showOnArticles: true
topics:
  - system-design
---

A  **web crawler**  (also known as a  **spider** ) is an automated bot that systematically browses the internet, following links from page to page to discover and collect web content.

Traditionally, web crawlers have been used by  **search engines**  to discover and index web pages. In recent years, they’ve also become essential for training  **large language models (LLMs)**  by collecting massive amounts of publicly available text data from across the internet.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1b3ede6b-b56b-4b5d-b893-44aed38b9d1d_624x408.png)](https://substackcdn.com/image/fetch/$s_!rJLC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1b3ede6b-b56b-4b5d-b893-44aed38b9d1d_624x408.png)

At its core, crawling seems simple:

1. Start with a list of known URLs (called  **seed URLs** )
2. Fetch each page
3. Extract hyperlinks
4. Add new URLs to the list
5. Repeat

However, designing a crawler that can operate at  **internet scale** , processing billions or even trillions of pages, is anything but simple. It introduces several complex engineering challenges like:

- How do we prioritize which pages to crawl first?
- How do we ensure we don’t overload the target servers?
- How do we avoid redundant crawling of the same URL or content?
- How do we split the work across hundreds or thousands of crawler nodes?

In this article, we’ll walk through the end-to-end design of a  **scalable, distributed web crawler** . We’ll start with the requirements, map out the high-level architecture, explore database and storage options, and dive deep into the core components.

# 1. Requirements

Before we start drawing boxes and arrows, let's define what our crawler needs to do.

### 1.1 Functional Requirements

1. **Fetch Web Pages:**  Given a URL, the crawler should be able to download the corresponding content.
2. **Store Content:**  Save the fetched content for downstream use.
3. **Extract Links:**  Parse the HTML to discover hyperlinks and identify new URLs to crawl.
4. **Avoid Duplicates:**  Prevent redundant crawling and storage of the same URL or content. Both URL-level and content-level deduplication should be supported.
5. **Respect robots.txt:**  Follow site-specific crawling rules defined in robots.txt files, including disallowed paths and crawl delays.
6. **Handle Diverse Content Types:**  Support HTML as a primary format, but also be capable of recognizing and handling other formats such as PDFs, XML, images, and scripts.
7. **Freshness:**  Support recrawling of pages based on content volatility. Frequently updated pages should be revisited more often than static ones.

### 1.2 Non-Functional Requirements

1. **Scalability:**  The system should scale horizontally to crawl billions of pages across a large number of domains.
2. **Politeness:**  The crawler should avoid overwhelming target servers by limiting the rate of requests to each domain.
3. **Extensibility:**  The architecture should allow for easy integration of new modules, such as custom parsers, content filters, storage backends, or processing pipelines.
4. **Robustness & Fault Tolerance:**  The crawler should gracefully handle failures whether it's a bad URL, a timeout, or a crashing worker node without disrupting the overall system.
5. **Performance:**  The crawler should maintain high throughput (pages per second), while also minimizing fetch latency.

> **Note:** In a real system design interview, you may only be expected to address a subset of these requirements. Focus on what’s relevant to the problem you’re asked to solve, and clarify assumptions early in the discussion.

# 2. Scale Estimation

### 2.1 Number of Pages to Crawl

Assume we aim to crawl a subset of the web, not the entire internet, but a meaningful slice. This includes pages across blogs, news sites, e-commerce platforms, documentation pages, and forums.

> **Target** : 1 billion pages

### 2.2 Data Volume

- **HTML Content** : ~100 KB
- **Additional Metadata (headers, timestamps, etc.)** : ~10 KB
- **Total per page** : ~110 KB

> **Total Data Volume = 1 billion pages × 110 KB = ~110 TB**

This estimate covers only the raw HTML and metadata. If we store additional data like structured metadata, embedded files, or full-text search indexes, the storage requirements could grow meaningfully.

### 2.3 Bandwidth

Let’s assume we want to complete the crawl in  **10 days** .

- **Pages per day**  = 1 billion / 10 ≈  **100 million pages/day**
- **Pages per second**  ≈ 1150 pages/sec

> **Bandwidth requirements =**  110 KB/page × 1150 pages/sec = ~126 MB/sec

This means our system must be capable of:

- Making over  **1150 HTTP requests per second**
- Parsing and storing content at the same rate

### 2.4 URL Frontier Size

Every page typically contains several outbound links, many of which are unique. This causes the  **URL frontier**  (queue of URLs to visit) to grow rapidly.

Lets assume:

- **Average outbound links per page:**  5
- **New links discovered per second =**  1150 (pages per second) * 5 = 5750

The URL Frontier's needs to handle thousands of new URL submissions per second. We’ll need efficient  **URL deduplication** ,  **prioritization** , and  **persistence**  to handle this at scale.

# 3. High-Level Architecture



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
