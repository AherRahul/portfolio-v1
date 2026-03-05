---
title: "Service Discovery"
description: "Service Discovery - System Design Module 17"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Service Discovery

In a monolithic application, components call each other through function calls or local method invocations. The address is simple: it is the same process, the same memory space.

When you break a monolith into microservices, those components become separate processes running on different machines with different IP addresses. Suddenly, calling another component requires knowing where it lives on the network.

This sounds straightforward until you consider the reality of modern deployments. Services scale up and down dynamically. Containers spin up on different hosts with different IPs each time. Instances fail and get replaced.

In a Kubernetes cluster, a service might have dozens of pods, each with its own IP, changing every few minutes. Hardcoding addresses does not work when addresses are not stable.

Service discovery solves this problem. It provides a mechanism for services to find each other dynamically, regardless of where they are running or how often they move.

# The Problem: Where Are My Services?

Consider a simple e-commerce application with three services: Order Service, Inventory Service, and Payment Service. The Order Service needs to call both Inventory and Payment to complete an order.

In a static deployment, you might configure Order Service with the addresses of its dependencies:

This works until it does not.

### Why Static Configuration Fails

In the "After Scaling" scenario, new instances of Inventory and Payment were added to handle increased load. But Order Service does not know about them. It keeps sending all traffic to the original instances while the new ones sit idle.

The problems compound:

Scenario

What Happens

**Scaling out**

New instances are invisible to clients

**Scaling in**

Clients still call removed instances, getting errors

**Instance failure**

Clients call dead instances until config is updated

**Rolling deployment**

New versions get different IPs, breaking clients

**Container orchestration**

IPs change on every container restart

Static configuration requires manual updates every time topology changes. In a dynamic environment where changes happen constantly, this is unmanageable.

# Service Discovery: The Solution

Service discovery provides three core capabilities:

1.  **Registration:** Services announce themselves when they start
2.  **Discovery:** Services query for the locations of their dependencies
3.  **Health Monitoring:** The system tracks which instances are healthy

With service discovery, adding a new Inventory instance is automatic. The new instance registers itself, and Order Service discovers it on the next lookup.

# Service Registry

The service registry is the central database that tracks all service instances. It stores:

*   Service name (logical identifier)
*   Instance addresses (IP and port)
*   Health status
*   Metadata (version, environment, capabilities)

### Registration Process

When a service starts, it registers with the registry:

### Registration Patterns

There are two ways services can register:

**Self-Registration:** The service registers itself directly with the registry.

*   **Pros:** Simple, service controls its own registration
*   **Cons:** Registration logic coupled to business logic, must be implemented in every service

**Third-Party Registration:** A separate component (registrar) monitors services and registers them.

*   **Pros:** Services do not need registration logic, works with any service
*   **Cons:** Additional component to manage, registrar can be a single point of failure

Kubernetes uses third-party registration. The kubelet monitors pods and updates the endpoints object, which acts as the service registry.

# Client-Side Discovery

In client-side discovery, the client queries the registry directly and chooses which instance to call.

### How It Works

1.  Client queries the registry for a service name
2.  Registry returns all healthy instances
3.  Client selects an instance using a load balancing algorithm
4.  Client makes the request directly to the selected instance

### Load Balancing Algorithms

Since the client chooses which instance to call, it implements load balancing:

Algorithm

Description

Best For

**Round Robin**

Cycle through instances in order

Equal capacity instances

**Random**

Pick randomly

Simple, good distribution

**Least Connections**

Pick instance with fewest active connections

Varying request durations

**Weighted**

Assign weights based on capacity

Mixed instance sizes

**Consistent Hashing**

Same key goes to same instance

Caching, session affinity

### Client-Side Discovery Example: Netflix Eureka

Netflix's Eureka is the canonical example of client-side discovery.

With Netflix Ribbon (client-side load balancer):

1.  Service registers with Eureka on startup
2.  Clients periodically fetch the full registry
3.  Ribbon selects instances and handles failover
4.  If an instance fails, Ribbon retries on another

### Advantages of Client-Side Discovery

*   **No extra network hop:** Client calls the service directly
*   **Flexible load balancing:** Each client can use different strategies
*   **Offline operation:** Cached registry allows discovery even if registry is temporarily down
*   **Service-specific routing:** Client can make intelligent routing decisions

### Disadvantages of Client-Side Discovery

*   **Client complexity:** Every client needs discovery logic and a load balancer
*   **Language coupling:** Must implement for each programming language
*   **Registry dependency:** Clients tightly coupled to specific registry implementation
*   **Stale data:** Cached registry can serve outdated information

# Server-Side Discovery

In server-side discovery, the client makes requests to a load balancer or router, which handles discovery and routing.

### How It Works

1.  Client sends request to a known endpoint (load balancer)
2.  Load balancer queries the registry for available instances
3.  Load balancer selects an instance and forwards the request
4.  Response returns through the load balancer

### Server-Side Discovery Example: Kubernetes

Kubernetes provides built-in server-side discovery through its Service abstraction.

In Kubernetes:

*   Services get a stable ClusterIP that never changes
*   kube-dns provides DNS resolution for service names
*   kube-proxy maintains iptables rules that route to healthy pods
*   Clients just call the service name, infrastructure handles everything

### Advantages of Server-Side Discovery

*   **Simple clients:** No discovery logic needed in clients
*   **Language agnostic:** Any language can call HTTP/gRPC endpoints
*   **Centralized control:** Load balancing strategy managed in one place
*   **Additional features:** Gateway can add authentication, rate limiting, etc.

### Disadvantages of Server-Side Discovery

*   **Extra network hop:** All traffic goes through the load balancer
*   **Potential bottleneck:** Load balancer can become a single point of failure
*   **More infrastructure:** Another component to deploy and manage
*   **Less flexibility:** Clients cannot customize routing behavior

# Comparing Discovery Patterns

Aspect

Client-Side

Server-Side

**Client complexity**

High (discovery + load balancing)

Low (just HTTP calls)

**Network hops**

1 (direct to service)

2 (through load balancer)

**Infrastructure**

Registry only

Registry + load balancer

**Language support**

Need library per language

Language agnostic

**Flexibility**

High (client controls routing)

Lower (central policy)

**Failure modes**

Stale cache, smart retries

Load balancer failure

**Examples**

Netflix Eureka, Consul

Kubernetes, AWS ELB

**Interview Insight:** Know when to recommend each pattern. Client-side works well for internal microservices with sophisticated clients. Server-side is better for external clients or when you want to keep clients simple.

# Health Checking

Service discovery is only useful if it returns healthy instances. Health checking ensures the registry knows which instances are actually working.

### Health Check Types

Check Type

Purpose

Frequency

Action on Failure

**Liveness**

Detect crashed processes

Every 5-10s

Restart container

**Readiness**

Detect inability to serve

Every 5-10s

Remove from load balancer

**Deep**

Detect dependency issues

Every 30-60s

Alert, possibly remove

### Health Check Implementation

A typical health endpoint:

### Health Check Patterns

**Push-based (Heartbeat):** Service periodically sends heartbeats to the registry.

**Pull-based (Polling):** Registry or load balancer periodically checks services.

Most systems use a combination: services send heartbeats AND the infrastructure performs active health checks.

# Common Service Discovery Implementations

### Consul

HashiCorp Consul provides service discovery with additional features:

**Key features:**

*   Service discovery via DNS or HTTP API
*   Health checking with multiple check types
*   Key-value store for configuration
*   Multi-datacenter support
*   Service mesh capabilities (Consul Connect)

### etcd

etcd is a distributed key-value store often used for service discovery:

**Key features:**

*   Strong consistency (Raft consensus)
*   Watch API for real-time updates
*   TTL for automatic registration expiry
*   Used by Kubernetes for cluster state

### ZooKeeper

Apache ZooKeeper provides coordination services including discovery:

**Key features:**

*   Ephemeral nodes that disappear when connection closes
*   Watch notifications for changes
*   Strong consistency
*   Used by Kafka, Hadoop, and many distributed systems

### Kubernetes DNS

Kubernetes provides built-in discovery through DNS:

# Service Discovery Best Practices

### 1\. Use Meaningful Service Names

Choose names that are clear and consistent:

### 2\. Include Metadata

Register useful metadata with instances:

Clients can use metadata for intelligent routing, like sending crypto payments only to capable instances.

### 3\. Implement Graceful Shutdown

Deregister before shutting down to avoid routing to dying instances:

### 4\. Handle Discovery Failures

Registry being down should not bring down your services:

*   Cache discovery results locally
*   Use last known good addresses
*   Implement circuit breakers for registry calls
*   Consider fallback static configuration for critical paths

### 5\. Avoid Thundering Herd

When registry returns after an outage, all clients might refresh simultaneously:

Add random jitter to refresh intervals.

# Summary

Service discovery is the foundation of service-to-service communication in microservices:

*   **The problem:** In dynamic environments, service instances have changing addresses. Static configuration fails when topology changes frequently.
*   **The solution:** A service registry tracks all instances. Services register on startup and are removed when they fail health checks.
*   **Client-side discovery:** Clients query the registry and load balance themselves. More complex clients, but no extra network hop. Example: Netflix Eureka.
*   **Server-side discovery:** Clients call a load balancer that handles discovery. Simpler clients, but extra hop and infrastructure. Example: Kubernetes Services.
*   **Health checking:** Essential for keeping the registry accurate. Combine heartbeats with active health probes.
*   **Best practices:** Use meaningful names, include metadata, implement graceful shutdown, cache discovery results, and add jitter to prevent thundering herds.

Service discovery tells you where services are. But in a microservices architecture, you typically do not want every client talking to every service directly. You need a single entry point that handles cross-cutting concerns like authentication, rate limiting, and request routing.

This brings us to our next topic: the API Gateway pattern, which provides a unified interface for clients while managing the complexity of the underlying services.

### References

*   [Microservices Patterns](https://microservices.io/patterns/service-registry.html) by Chris Richardson - Comprehensive patterns for service discovery
*   [Netflix Eureka](https://github.com/Netflix/eureka/wiki) - Client-side discovery implementation
*   [HashiCorp Consul](https://developer.hashicorp.com/consul/docs/concepts/service-discovery) - Service discovery and service mesh
*   [Kubernetes Service Discovery](https://kubernetes.io/docs/concepts/services-networking/service/) - Built-in Kubernetes discovery mechanism
*   [etcd](https://etcd.io/docs/v3.5/learning/) - Distributed key-value store for service discovery

Launching soon
