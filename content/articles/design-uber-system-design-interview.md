---
title: "Design Uber - System Design Interview"
description: "The concept of ride-hailing has transformed how we travel. Platforms like Uber, Lyft, and Ola seamlessly connect riders with drivers through intuitive smartphone apps."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-uber-system-design-interview.md"
dateModified: "2025-02-27"
datePublished: "2025-02-27"
showOnArticles: true
topics:
  - system-design
---

The concept of  **ride-hailing**  has transformed how we travel. Platforms like  **Uber** ,  **Lyft** , and  **Ola**  seamlessly connect riders with drivers through intuitive smartphone apps.

By simply entering a destination and tapping a button, users can summon a nearby vehicle and monitor its arrival in real time.

[![Uber rolls out new safety, payment features for drivers - Express Mobility  News | The Financial Express](https://substack-post-media.s3.amazonaws.com/public/images/7f3887c1-b01e-46e5-85a4-1bc5dd65676b_1200x675.jpeg)](https://substackcdn.com/image/fetch/$s_!pGZB!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f3887c1-b01e-46e5-85a4-1bc5dd65676b_1200x675.jpeg)

However, building such a service at scale involves more than just connecting drivers and riders. Behind every “Request Ride” tap lies a sophisticated system coordinating  **real-time driver matching** ,  **efficiently**   **finding nearby drivers** ,  **high-throughput data processing** ,  **dynamic pricing** , and  **payment workflows** .

In this article, we will explore how to  **design an Uber-like system** that can handle millions of rides every day **.**

We’ll walk through every step of the design—from  **requirements**  and  **high-level architecture**  to  **database**  and  **API design** . Finally, we'll take a deep dive into  **core use cases**  like how to efficiently find nearby drivers.

# 1. Requirement Gathering

Before diving into the design, lets outline the functional and non-functional requirements.

### **Functional Requirements** :

1. **Ride requests:** Riders should be able to input their pickup and destination locations and request a ride.
2. **ETA/Fare Estimation:** The system should provide an estimated time of arrival (ETA) and estimated fare to riders before they confirm the booking.
3. **Driver-rider matching:** The system should match riders with available drivers who are in close proximity.
4. **Accept/Decline** : Drivers should be able to accept or decline incoming ride requests.
5. **Driver tracking** : Once a rider is matched with a driver, the rider should be able to track the driver’s location and view the estimated time of arrival (ETA).
6. **Ratings** : Both riders and drivers should have the ability to rate each other after a ride is completed.
7. **Payments** : The user should be able to complete the payment after the ride is completed.

### **Non-Functional Requirements** :

1. **Low latency** : The system should provide real-time location updates and fast driver-rider matching.
2. **High availability** : The system should be up 24/7 with minimal downtime.
3. **Scalability** : The system must handle peak loads (e.g., New Year’s Eve, sporting events).

# 2. Capacity Estimation

### **Assumptions**

- **Total Users:** 50 million riders, 5 million drivers
- **Daily Active Users (DAU):** 10 million riders, 1 million drivers
- **Peak concurrent users** : 1 million riders,  ~100,000 drivers (assuming 10% of DAUs are active at peak hours)
- **Average Daily Ride Requests:**  10 million globally
- **Peak rides per second (RPS):** ~5,000

### **Location Updates**

- A driver sends a location update  **every 3 seconds**  while active.
- Assuming  **100,000 active drivers**  at peak time: **Location updates per second** : 100,000 / 3 ≈ 33,333 updates/sec
- **Location updates per second** : 100,000 / 3 ≈ 33,333 updates/sec

### Data Storage Estimation

#### **User & Driver Profiles**

- **Rider profile** : ~2 KB per user (name, email, phone, payment method, preferences)
- **Driver profile** : ~5 KB per driver (vehicle details, license, payment details, ratings)
- **Total storage for 50M users** : (50M × 2 KB) + (5M × 5 KB) = ( **100 + 25) GB = 125 GB**

#### **Ride Data**

Each ride stores:

- Ride ID (UUID) → 16 bytes
- Rider ID, Driver ID → 8 bytes each
- Start & end location (lat/lon) → 16 bytes
- Fare, pickup/dropoff time → 24 bytes
- Status → 8 bytes

**Total ride entry size:**  ~80 bytes

- **Total daily rides:**  10M
- **Storage per day:**  10M × 80 Bytes =  **800 MB**
- **Storage per year (365 days):**   **~300 GB**

### Network Bandwidth Estimation

Each API call (ride request, driver update, fare estimation, etc.) contributes to network usage.

- **Ride requests per second** : ~5,000 RPS
- **Driver location updates per second** : ~33,333 RPS
- **Total peak API requests** : ~40,000 RPS

Assuming an  **average API payload size**  of  **5 KB** , network bandwidth usage at peak:

- **40,000 RPS × 5 KB = 200 MB/sec**

# 3. High-Level Design

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
