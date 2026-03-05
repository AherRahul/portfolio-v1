---
title: "Backend for Frontend (BFF)"
description: "Backend for Frontend (BFF) - System Design Module 17"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Backend for Frontend (BFF)

In the previous chapter, we explored the API Gateway pattern, which provides a single entry point for all clients.

But consider the diverse needs of different client types. A mobile app running on a slow network needs compact responses with minimal data. A web application on a desktop can handle richer payloads and multiple parallel requests. A third-party integration might need entirely different data formats and authentication schemes.

Forcing all clients through a single gateway creates a tension.

The **Backend for Frontend (BFF)** pattern solves this by creating separate gateway layers for each client type. Each BFF is tailored to the specific needs of its client, providing optimized APIs that make sense for that platform.

In this chapter, you will learn:

*   Why a single API Gateway often is not enough
*   How the BFF pattern works
*   When to use BFF versus a general-purpose gateway
*   Strategies for organizing and managing BFFs
*   Common pitfalls and how to avoid them

The BFF pattern is particularly relevant for organizations with multiple client applications serving different user experiences.

# The Problem: One Size Does Not Fit All

Consider an e-commerce platform with three client types: a web application, a mobile app, and a partner API.

Each client needs different data for the same conceptual screen:

### Different Interaction Patterns

### Different Release Cycles

When all clients share one gateway, changes must accommodate the slowest-moving client. A web team wanting to add a field must wait until mobile apps can handle it.

### Single Gateway Becomes Overloaded

The gateway accumulates client-specific logic, becoming harder to maintain. Changes for one client risk breaking others.

# The Solution: Backend for Frontend

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
