---
title: "Design Ticket Booking System"
description: "Design Ticket Booking System - Concurrency Interview Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Design Ticket Booking System

Question

**Design a thread-safe ticket booking system that prevents double-booking under high concurrency.**

At first glance, the requirement sounds simple: **never sell the same seat twice**. But once thousands of users compete for a limited set of seats, the problem becomes a real concurrency challenge.

This scenario shows up in many real-world systems: **movie and event ticketing**, **train and flight seat reservations**, **stadium bookings**, and even **limited-inventory flash sales** where “items” behave like seats.

Core Requirements

*   **Temporary holds:** A user should be able to hold seats while entering payment details.
*   **Hold expiration:** If payment is not completed within a time window, the hold must expire and the seats should become available again.
*   **Group booking:** Multiple users may want to reserve adjacent seats together as a single atomic action, either the whole block is held or nothing is.
*   **Race conditions at the millisecond level:** If two users click “Book Now” for the same seat at the same moment, **exactly one** booking must succeed. The other request must fail cleanly, not produce a second confirmation email or leave the system in an inconsistent state.

The system must guarantee **correctness first**, even under extreme concurrency, while still providing a smooth user experience for holds, expiry, and group reservations.

# 1\. System Overview

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
