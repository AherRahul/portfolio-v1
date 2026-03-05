---
title: "WebRTC"
description: "WebRTC - System Design Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# WebRTC

Every real-time technology we have covered so far routes traffic through servers. Long polling, WebSockets, and SSE all require a server in the middle. For chat messages and notifications, that is fine.

**But what about video calls?**

When you are on a video call with someone across the world, routing every video frame through a server adds latency and costs a fortune in bandwidth.

**WebRTC (Web Real-Time Communication)** solves this by enabling direct peer-to-peer connections between browsers. Once the connection is established, audio and video flow directly from one browser to another without touching a server.

This dramatically reduces latency and server costs for real-time media applications.

But peer-to-peer is not simple. Browsers sit behind firewalls and NATs. They do not have public IP addresses. Establishing a connection requires a dance of signaling, ICE candidates, and STUN/TURN servers.

Understanding this complexity is essential for building video calling, screen sharing, and other peer-to-peer applications.

In this chapter, you will learn:

*   How WebRTC establishes peer-to-peer connections
*   The role of signaling servers, STUN, and TURN
*   The WebRTC APIs for media and data channels
*   When to use WebRTC versus server-mediated communication
*   Architecture patterns for production WebRTC applications

### Premium Content

Subscribe to unlock full access to this content and more premium articles.

[Subscribe Now](/premium)

Launching soon
