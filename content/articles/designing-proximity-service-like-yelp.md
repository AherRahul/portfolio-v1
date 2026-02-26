---
title: "Designing a Proximity Service like Yelp"
description: "Services like Yelp, Zomato, or Google Maps have become an essential part of how we discover the world around us."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/designing-proximity-service-like-yelp.md"
dateModified: "2025-05-15"
datePublished: "2025-05-15"
showOnArticles: true
topics:
  - system-design
---

Services like  **Yelp** ,  **Zomato** , or  **Google Maps**  have become an essential part of how we discover the world around us.

Whether you're looking for the best coffee shop within walking distance, a nearby gym that’s open late, or the top-rated restaurant in your city—these platforms deliver location-aware results  **in milliseconds** , personalized and filtered to your needs.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f8ed91f2-248f-4bf2-a692-7ae831b50feb_1148x749.png)](https://substackcdn.com/image/fetch/$s_!tXpP!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff8ed91f2-248f-4bf2-a692-7ae831b50feb_1148x749.png)

**But how does such a system work under the hood?**

In this blog, we’ll walk through the  **system**   **design  of a proximity service like Yelp** —a platform that helps users search for nearby businesses, view detailed listings, read and write reviews, and save favorites for future visits.

We'll dive deep into the high-level architecture, database design, API design, indexing strategies, caching, scalability, and how to handle billions of data points with milli-seconds latency.

# 1. Requirements

Before diving into the architecture, lets clearly define  **what**  we’re building.

## 1.1 Functional Requirements

- **Search & Discovery:** Users can  **search for nearby places**  (restaurants, gyms, salons, etc.) using their  **current location** . Support filters like: **Distance**  (e.g., within 2 km, 5 km) **Category**  (e.g., cafe, spa, grocery store) **Ratings**  (e.g., 4 stars and above) **Open Hours**  (e.g., currently open)
- **Distance**  (e.g., within 2 km, 5 km)
- **Category**  (e.g., cafe, spa, grocery store)
- **Ratings**  (e.g., 4 stars and above)
- **Open Hours**  (e.g., currently open)
- **Business Listing Details:** Each place should have a detailed page showing:Name, address, contactPhotos, opening hours, servicesLocation on a mapUser reviews and ratings
- Name, address, contact
- Photos, opening hours, services
- Location on a map
- User reviews and ratings
- **Reviews & Ratings:** Users can leave  **ratings**  (1 to 5 stars) and  **written reviews** .
- **Business Management:** Business owners can create a new listing or update details
- **Favorites:** Users can  **bookmark**  or  **save**  favorite places for quick access later.

## 1.2 Non-Functional Requirements

- **Scalability:** The system should handle millions of users and tens of millions of listings and reviews
- **Low Latency:** Search results should be returned within <200ms
- **High Availability:** The service should remain operational even if individual components fail. Availability target:  **99.99% uptime**
- **Eventual Consistency:** For certain operations (e.g., newly posted reviews or updated listings), the system can be  **eventually consistent**  rather than strongly consistent.

# 2. Capacity Estimation

### Traffic Assumptions

Let’s assume this service operates at global scale:

- **Monthly Active Users (MAU):** 50 million
- **Daily Active Users (DAU):** ~10 million (20% of MAU)
- **Avg. searches/user/day:** 5
- **Reviews/day:** ~5 million
- **New businesses added/day:**  100,000

> Peak traffic may be  **2–3X average load** , especially during weekends, holidays, or lunch/dinner hours.

### Storage Estimation

#### Business Listings

- Assume 100 million listings
- Each listing ≈ 2 KB (name, category, address, etc.)
- **Total = ~200 GB**

> Relatively small footprint, fits well in relational or document DBs. Queryable fields (category, rating, location) should be indexed.

#### Reviews

- Assume 1 billion reviews (historical)
- Data per review ≈ 1 KB (text + metadata)
- **Total =** 1B x 1KB = **~1 TB**

#### Media (Photos)

- **Average photos/business** : 5
- **Size per photo** : ~200 KB (optimized JPEG or WebP)
- **Storage =** 100M listings × 5 × 200 KB =  **~100 TB**

> Stored in  **object storage**  like Amazon S3, not in databases. Backed by CDN for efficient global delivery.

#### Favorites

- Assume 100M total saved favorites
- Data per favorite ≈ 50 bytes (user_id, business_id, timestamp)
- **Total =** 100M × 50bytes  **= 5GB**

# 3. High-Level Architecture

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
