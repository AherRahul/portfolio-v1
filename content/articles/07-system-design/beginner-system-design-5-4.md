---
title: "Anycast Routing"
description: "Anycast Routing - System Design Module 5"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Anycast Routing

When you query Cloudflare's DNS resolver at 1.1.1.1, your request doesn't travel to a single server somewhere in the world. It goes to one of over 300 data centers spread across the globe, whichever is closest to you. Yet they all share the same IP address: 1.1.1.1.

How is this possible? The answer is **anycast routing**.

Traditional networking assumes each IP address belongs to exactly one device. Anycast breaks this assumption by allowing the same IP address to be announced from multiple locations simultaneously. The network itself figures out which location is "closest" and routes your traffic there automatically.

This technique powers some of the most critical infrastructure on the internet: DNS root servers, major CDNs, and DDoS protection services. Understanding anycast is essential for designing globally distributed, highly available systems.

# 1\. Understanding IP Addressing Models

Before diving into anycast, let's understand the four IP addressing models: unicast, broadcast, multicast, and anycast.

### 1.1 Unicast: One-to-One

**Unicast** is the standard model. One IP address maps to exactly one destination. When you connect to 93.184.216.34 (example.com), your packets travel to that specific server.

### 1.2 Broadcast: One-to-All

**Broadcast** sends packets to all devices on a network segment. Used for discovery protocols like ARP and DHCP, but doesn't work across routers.

### 1.3 Multicast: One-to-Many (Subscribers)

**Multicast** sends packets to a group of interested receivers. Used for video streaming and real-time data distribution. Receivers must subscribe to a multicast group.

### 1.4 Anycast: One-to-Nearest

**Anycast** sends packets to the topologically nearest destination among a group of potential receivers sharing the same IP address. The network routing infrastructure decides which destination is "nearest."

The key difference: with anycast, **the network decides** which server receives your traffic based on routing metrics, not the application or DNS.

### 1.5 Comparison Table

Model

Destinations

Who Decides

Use Case

**Unicast**

One specific host

Sender

Normal web traffic

**Broadcast**

All hosts on segment

Network

ARP, DHCP

**Multicast**

Subscribed group

Receivers

Live streaming

**Anycast**

Nearest of many

Network routers

DNS, CDN, DDoS

# 2\. How Anycast Routing Works

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
