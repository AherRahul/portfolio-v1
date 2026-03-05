---
title: "Block vs File vs Object Storage"
description: "Block vs File vs Object Storage - System Design Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Block vs File vs Object Storage

The storage industry has evolved three fundamentally different paradigms, each optimized for different problems.

Block storage provides raw disk-like access where speed matters most. File storage organizes data into hierarchies that humans and applications can navigate together. Object storage treats data as discrete units designed to scale to billions of items across the globe.

This chapter breaks down all three storage types from the ground up. You'll understand how each works internally, their key characteristics and when to reach for one over another.

# At a Glance

Before diving deep into each storage type, here's a reference table that captures the essential differences. Keep this in mind as we explore the details. Each difference you see here has real engineering implications that affect performance, cost, and architecture decisions.

Aspect

Block Storage

File Storage

Object Storage

**Data Unit**

Fixed-size blocks

Files in folders

Objects with metadata

**Access Method**

Block address

File path hierarchy

Unique object ID/key

**Protocol**

iSCSI, Fibre Channel, NVMe

NFS, SMB/CIFS

HTTP/REST API

**Metadata**

None (raw bytes)

Limited (name, size, date)

Rich, custom metadata

**Modification**

Modify individual blocks

In-place edits

Replace entire object

**Latency**

Lowest (<1ms)

Medium (1-10ms)

Higher (10-100ms)

**Scalability**

Limited per volume

Limited by metadata

Virtually unlimited

**Best For**

Databases, VMs, boot volumes

Shared documents, home directories

Media, backups, data lakes

**Examples**

EBS, SAN, local disk

NFS, EFS, Azure Files

S3, GCS, Azure Blob

If you need a quick decision framework, here's the simplest way to think about it:

*   **Need a database or boot disk?** Block storage. Nothing else comes close on performance.
*   **Need files that multiple servers access simultaneously?** File storage. It's the only type that natively supports shared access with locking.
*   **Need to store images, videos, or backups at scale?** Object storage. It's built for exactly this scenario.

But these rules of thumb only scratch the surface. The real value comes from understanding why these recommendations hold, what trade-offs you're making, and when the exceptions apply. Let's start with the foundation: block storage.

# 1\. Block Storage

Block storage is where it all begins. When you think about how a physical hard drive or SSD works, you're thinking about block storage. It's the most primitive form of data storage, operating at a level of abstraction so low that the storage device has no idea what you're storing.

This simplicity is exactly what makes block storage so powerful. With no interpretation overhead, no metadata lookups, and no path resolution, block storage delivers the lowest latency and highest throughput of any storage type.

### 1.1 How Block Storage Works

At its core, block storage divides all data into fixed-size chunks called blocks. These blocks are typically small, ranging from 512 bytes to 4 KB depending on the device and file system. Each block gets a unique address, essentially a number that identifies where the block lives on the storage device.

The diagram below shows this structure. Notice how the storage device is just a sequence of numbered blocks. The operating system interacts with the device through simple commands that reference specific block addresses.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The key insight here is what the storage device doesn't know. It has no concept of files, directories, or data formats. It doesn't know whether block 47 contains part of a JPEG image, a database index page, or the middle of a log file. The only operations it understands are primitive: "Give me the contents of block 47" or "Write this data to block 128."

This intentional ignorance is the source of block storage's performance advantage. Every other storage type adds abstraction layers on top, each layer adding latency.

Block storage operates at the bottom of the stack, as close to the hardware as you can get without writing device drivers.

### 1.2 The Block-to-File Translation

Here's where things get interesting. If block storage only understands numbered blocks, how do applications work with files? When you open `/data/report.pdf`, something has to translate that human-readable path into a series of block addresses.

That something is the file system. When you format a block device with a file system like ext4, XFS, or NTFS, you're installing a translation layer that bridges the gap between how humans think about data (files with names in folders) and how the hardware thinks about data (numbered blocks).

The diagram below illustrates this layered architecture. Notice how each layer has a specific responsibility, and the application never needs to know which physical blocks contain its data.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

When you create a file, the file system performs several operations behind the scenes:

1.  **Allocates free blocks** to store the file's content. If the file is larger than one block, multiple blocks are allocated. These blocks don't need to be contiguous, though the file system tries to keep them close together for performance.
2.  **Records the mapping** between the file and its blocks. The file system maintains metadata structures (like inodes in ext4) that track which blocks belong to which file and in what order.
3.  **Tracks file attributes** including the name, permissions, timestamps, and size. This metadata lives in dedicated blocks on the device.

When you later read that file, the file system consults its metadata to find which blocks contain the data, then issues the appropriate block-level read commands. This translation happens transparently, millions of times per second on a busy system.

The translation does add overhead compared to raw block access, but the overhead is minimal on modern systems. The file system's metadata structures are optimized for fast lookups, and the operating system caches frequently accessed metadata in RAM.

### 1.3 Key Characteristics

Now that we understand how block storage works, let's examine the characteristics that make it unique. These features are the direct consequences of block storage's architecture, and understanding them helps you reason about when block storage is the right choice.

*   **Raw performance.** Because block storage operates at the lowest level with minimal abstraction, it delivers performance that other storage types simply cannot match:
*   **Sub-millisecond latency:** Modern NVMe SSDs deliver read latencies in the tens of microseconds. Even network-attached block storage like AWS EBS achieves single-digit millisecond latencies for most operations.
*   **High IOPS:** A single NVMe SSD can sustain hundreds of thousands of I/O operations per second. This matters enormously for databases doing random reads across many small records.
*   **Direct memory mapping:** Applications can map block storage directly into their address space, enabling zero-copy I/O that eliminates data copying through kernel buffers.

#### **Single attachment constraint**

A block storage volume typically attaches to one server at a time. Think of it like plugging a USB drive into a computer. You cannot plug the same drive into two computers simultaneously without causing data corruption.

The diagram below illustrates this constraint. The standard pattern on the left works well. The problematic pattern on the right leads to data corruption because both servers think they have exclusive access to the blocks.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

**Why does this happen?**

File systems assume they have exclusive control over their blocks. When Server C writes to a block and updates its cached metadata, Server D has no way to know the block changed. The two servers end up with inconsistent views of the data, leading to corruption.

Specialized cluster file systems like GFS2, OCFS2, and GPFS exist to handle shared block access, but they add significant complexity and are typically only used in high-performance computing environments.

#### **File system required**

This follows directly from how block storage works. Raw block storage is just numbered blocks. To use it with files, you must format it with a file system that provides the translation layer we discussed earlier.

Without a file system, applications would need to manage block addresses directly, which is impractical for anything except low-level database engines.

### 1.4 Cloud Block Storage

In the cloud, block storage takes on a slightly different form. Instead of physical disks attached to your server, you get network-attached volumes that behave like local disks. The cloud provider handles all the complexity of replication, redundancy, and physical hardware management.

Every major cloud provider offers managed block storage services:

Provider

Service

Description

AWS

EBS (Elastic Block Store)

Persistent block storage for EC2

GCP

Persistent Disk

Block storage for Compute Engine

Azure

Managed Disks

Block storage for Azure VMs

Note

Cloud block storage volumes are typically replicated within a single availability zone for durability, but they don't automatically replicate across zones. If you need disaster recovery, you need to implement snapshot strategies or use features like EBS cross-region replication.

### 1.5 When to Use Block Storage

With this understanding of how block storage works, let's look at the scenarios where it's the clear winner. These aren't arbitrary recommendations. Each use case follows directly from block storage's unique characteristics.

#### **Databases require block storage**

This is perhaps the most common use case. Databases like PostgreSQL, MySQL, and MongoDB perform random reads and writes across their data files constantly. A single query might touch dozens of different pages scattered across the storage volume.

Block storage's sub-millisecond latency makes these operations fast. Object storage's 50-100ms latency would make the same query 100x slower.

#### **Virtual machines need boot volumes**

When you start a VM, the hypervisor presents block storage to the guest operating system as a physical disk. The guest OS then formats this "disk" with its own file system and boots from it. This illusion only works because block storage behaves exactly like a physical disk. Object storage cannot provide this interface.

#### **Applications expecting POSIX file semantics**

Most server software assumes it can open files, seek to arbitrary positions, read a few bytes, write a few bytes, and close the file. These POSIX file operations require a file system, which requires block storage. Legacy applications, development tools, and many modern applications all depend on these semantics.

#### **Transactional consistency requirements**

When data integrity matters more than anything else, block storage with a journaling file system (ext4, XFS, NTFS) provides guarantees that other storage types cannot. The database can call `fsync()` and know with certainty that the data has been durably written. This is the foundation of ACID transactions.

The diagram below summarizes these decision paths. Notice that all roads lead to block storage when performance and consistency are primary concerns.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

With block storage covered, let's move to the next paradigm. What happens when multiple servers need to access the same files simultaneously? Block storage's single-attachment constraint becomes a problem. This is exactly the gap that file storage fills.

# 2\. File Storage

File storage solves a problem that block storage cannot: shared access.

When you have a fleet of web servers that all need to read the same configuration files, or a Kubernetes cluster where multiple pods need to write to the same persistent volume, block storage's single-attachment constraint becomes a showstopper.

File storage takes a different approach. Instead of exposing raw blocks to a single server, it presents a hierarchical file system accessible over the network.

Multiple servers connect to the same file system simultaneously, reading and writing files as if they were on a local disk. The file server handles all the complexity of coordinating access, managing locks, and ensuring data consistency.

This comes at a cost. Network overhead adds latency. Coordination adds complexity. But for workloads that need shared access, these trade-offs are worth it.

### 2.1 How File Storage Works

File storage presents data through a familiar hierarchy: directories containing files and subdirectories. This is the same structure you see on your laptop when you open a file browser. The difference is that this structure lives on a remote server, accessible to any machine on the network that has permission to connect.

The diagram below shows a typical file system hierarchy. Notice the tree structure, directories contain other directories and files, forming a path from the root to any piece of data.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

You access files by path: `/home/user/documents/report.pdf`. The storage system handles locating where that file's data actually lives on the underlying storage. You never need to think about block addresses or physical locations.

This abstraction is powerful because it separates the logical organization of data (how you think about files) from the physical organization (where bytes actually live). The file system can reorganize data for performance without changing how applications access it.

### 2.2 Shared Access

Here's where file storage shines. Unlike block storage, which attaches to one server at a time, file storage can be accessed by multiple servers simultaneously. This single capability drives the majority of file storage use cases.

Multiple application servers all connect to the same file system over the network. From each server's perspective, the files look local, but they're actually stored on a central file server.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Network file protocols make this sharing possible. These protocols define how clients communicate with file servers over the network, how locks are managed, and how caching works:

Protocol

Platform

Description

NFS (Network File System)

Unix/Linux

Standard for Unix environments, now at version 4.2 with improved security and performance

SMB/CIFS

Windows

Windows file sharing protocol, also well-supported on Linux and macOS

AFP

macOS

Apple File Protocol, largely replaced by SMB in modern macOS

When Server A opens a file over NFS, several things happen behind the scenes. The request travels over the network to the file server. The file server checks permissions, acquires any necessary locks, and returns the file data. If Server B tries to write to the same file, the file server coordinates access to prevent corruption.

This coordination is the magic of file storage. Applications on different servers can collaborate on shared data without custom synchronization code. The file server handles all the complexity.

### 2.3 Key Characteristics

File storage's characteristics stem from its design goal: make network storage behave like local storage. Let's examine what this means in practice.

#### **POSIX semantics preserved**

File storage supports the full range of standard file operations: create, open, read, write, seek, close, rename, delete. This compatibility is crucial because it means applications written for local file systems work without modification when pointed at a network file share.

You don't need to rewrite your application to use file storage. You just mount the network share and update the file path.

#### **File locking for coordination**

When multiple processes need to access the same file, locking prevents chaos. A process can acquire an exclusive lock to write safely, or a shared lock to read while preventing writes. The file server mediates these locks, ensuring that concurrent access doesn't corrupt data.

However, file locking has subtleties. Advisory locks (the default on Unix) only work if all processes respect them. A misbehaving process can ignore locks entirely. Mandatory locks exist but have performance implications. In distributed systems, you often need additional coordination beyond file locks.

#### **Limited metadata capabilities**

Files have standard attributes: name, size, creation time, modification time, and permissions. But you cannot attach arbitrary metadata to files the way you can with objects. If you need to store "uploaded by user 12345" or "processing status: complete" with a file, you need a separate database or embed the metadata in the filename.

This limitation becomes painful at scale. When you have millions of files and need to find all files uploaded by a specific user, you cannot query the file system directly. You need external indexes.

#### **Hierarchical organization**

The directory tree provides logical organization that humans understand. You can browse, search, and navigate the structure using familiar tools. This organization also enables permission management, you can set permissions on directories that apply to all contents.

### 2.4 Cloud File Storage

Cloud providers offer managed file storage services that eliminate the operational burden of running your own file servers. These services handle replication, scaling, and maintenance automatically.

Provider

Service

Protocol

Description

AWS

EFS (Elastic File System)

NFS v4.1

Managed NFS for Linux workloads

AWS

FSx for Windows

SMB

Managed Windows file server

AWS

FSx for Lustre

Lustre

High-performance computing

GCP

Filestore

NFS

Managed file storage

Azure

Azure Files

SMB, NFS

Managed file shares

AWS EFS deserves special attention because it's the most commonly used cloud file storage for Linux workloads. Several characteristics make it unique:

*   **Elastic capacity:** EFS grows and shrinks automatically as you add and remove files. You don't provision capacity upfront. You pay for what you use. This is fundamentally different from block storage where you provision a fixed size.
*   **Multi-AZ replication:** Data is automatically replicated across multiple Availability Zones within a region. This provides 99.999999999% (11 nines) durability and high availability without any configuration.
*   **Massive concurrent access:** Thousands of EC2 instances or containers can mount the same EFS file system simultaneously. This makes it ideal for horizontally scaled applications.
*   **Performance modes:** EFS offers General Purpose (default) and Max I/O modes. General Purpose provides lower latency. Max I/O handles higher throughput and operations per second at the cost of slightly higher latencies.

The latency story is worth understanding. EFS delivers single-digit millisecond latency for most operations, which is slower than local block storage but fast enough for most applications. The latency comes from network round trips and the coordination required for shared access.

### 2.5 When to Use File Storage

File storage occupies a specific niche: workloads that need shared access with POSIX semantics. Let's examine the scenarios where this combination matters.

#### **Multiple servers accessing the same files**

This is the canonical use case. Web server farms serving static content from a shared directory. Application servers reading shared configuration files. Kubernetes pods that all need to read and write to the same persistent volume.

Without file storage, you'd need to build your own synchronization layer or accept that each server has its own separate copy of the data.

#### **Applications expecting POSIX file semantics**

Many applications assume they can open files, seek to positions, read partial content, and write in place. Content management systems like WordPress store uploads as files. Legacy applications written decades ago expect file paths. CI/CD systems clone repositories and run builds in file-based working directories.

These applications cannot use object storage without significant rewrites.

#### **In-place file modifications**

Unlike object storage where you must replace entire objects, file storage allows editing files in place. Append a line to a log file. Update a single configuration value without rewriting the entire file. These operations are natural and efficient with file storage.

#### **Home directories and shared workspaces**

When users or processes need personal storage accessible from anywhere on the network, file storage provides the familiar experience of a home directory that follows you regardless of which server you're on.

### 2.6 Limitations of File Storage

File storage is powerful, but it's not without significant limitations. Understanding these helps you know when to reach for object storage instead.

#### **Scalability ceiling**

File systems have practical limits that stem from their hierarchical architecture. A single file server can handle millions of files reasonably well, but as you approach billions of files, performance degrades.

Deep directory hierarchies compound the problem because accessing `/level1/level2/level3/level4/level5/file.txt` requires six separate metadata lookups.

The metadata structure itself doesn't scale infinitely. Every file operation requires consulting the metadata store, and as the metadata grows, these operations slow down. This is fundamentally different from object storage, which uses distributed metadata and scales horizontally.

#### **Centralized metadata bottleneck**

In traditional file storage, a central server (or small cluster) maintains all metadata: which files exist, where they're located, their permissions, and so on.

Every client operation must coordinate with this metadata service. At high request rates, the metadata service becomes the bottleneck, regardless of how much storage capacity you have.

Some distributed file systems like HDFS and GlusterFS address this with distributed metadata, but they add complexity and are typically reserved for specialized use cases like big data processing.

#### **Cost at scale**

File storage costs significantly more per GB than object storage:

Storage Type

Service

Cost per GB/month

File

EFS Standard

$0.30

Block

EBS gp3

$0.08

Object

S3 Standard

$0.023

This cost differential drives the architectural pattern of using file storage only where you genuinely need POSIX semantics or shared access, and using object storage for everything else.

These limitations point toward a question: what if you're storing data that doesn't need shared access, doesn't need POSIX semantics, and doesn't need in-place modification?

What if you're storing billions of images, or petabytes of video, or years of log archives?

This is where **object storage** becomes not just an option, but the only sensible choice.

# 3\. Object Storage

Object storage represents a fundamental departure from how we traditionally think about storing data. It abandons the familiar hierarchies of files and folders in favor of something simpler and more scalable: a flat collection of objects, each identified by a unique key.

This might sound like a step backward. After all, hierarchies help us organize things. But the hierarchical model creates scalability problems. Each directory lookup adds latency. The metadata tree becomes a bottleneck. Deep paths mean more operations to reach your data.

Object storage sidesteps these problems entirely. By treating each piece of data as an independent unit with its own identifier, object storage can scale to trillions of objects distributed across thousands of servers worldwide.

Amazon S3, the most famous object store, handles over 100 million requests per second and stores more than 350 trillion objects. No hierarchical file system comes close to this scale.

### 3.1 How Object Storage Works

Object storage treats each piece of data as an independent object. Think of it as a giant hash map where keys are strings and values are arbitrary byte sequences. Each object consists of three parts:

Each object is self-contained, carrying everything needed to identify and describe its contents.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

*   **Key:** A unique identifier string that names the object. This can be any UTF-8 string up to 1024 bytes. You design the key structure to suit your access patterns.
*   **Data:** The actual bytes you're storing. This can range from a few bytes to 5 TB in a single object. For larger data, you use multipart uploads.
*   **Metadata:** Key-value pairs that describe the object. System metadata (like Content-Type and Last-Modified) is managed automatically. Custom metadata (prefixed with `x-amz-meta-` in S3) lets you attach application-specific information.

There are no folders. When you see a key like `users/123/photos/vacation.jpg`, you might think "users" is a folder containing "123" which contains "photos" which contains the file.

But that's not how object storage works. The entire string `users/123/photos/vacation.jpg` is the key. The "/" characters are just characters in the name, no different from any other character.

Object storage UIs and SDKs often render keys with "/" as a folder hierarchy for convenience, creating the illusion of directories. But it's purely a presentation layer trick. Internally, the object store doesn't know or care about the slashes.

### 3.2 HTTP/REST Access

One of the most important differences between object storage and traditional storage is the access protocol. Block storage uses low-level protocols like iSCSI or NVMe. File storage uses protocols like NFS or SMB. Object storage uses HTTP.

This choice seems simple but has profound implications. You interact with objects through standard HTTP methods:

Shell

```shell
1PUT https://bucket.s3.amazonaws.com/users/123/avatar.jpg
2    Body: [image bytes]
3    Headers: Content-Type: image/jpeg
4
5GET https://bucket.s3.amazonaws.com/users/123/avatar.jpg
6    → Returns: [image bytes] with headers
7
8DELETE https://bucket.s3.amazonaws.com/users/123/avatar.jpg
9    → Object deleted
```

Why does HTTP matter? Consider the implications:

#### **Universal accessibility**

Any programming language with an HTTP client can access object storage. Python, Java, JavaScript, Go, Rust, even shell scripts with `curl`. You don't need special drivers or libraries.

#### **Browser-native**

Web browsers can fetch objects directly from object storage (with proper CORS configuration). This enables patterns like direct-to-storage uploads where your application server generates a presigned URL and the browser uploads directly to S3, never sending the file bytes through your servers.

#### **CDN integration**

Content Delivery Networks already speak HTTP. Putting a CDN like CloudFront or Cloudflare in front of object storage requires minimal configuration because the protocols are already aligned. The CDN caches objects at edge locations, serving them with millisecond latency to users worldwide.

#### **Load balancer compatibility**

HTTP load balancers can distribute object storage requests across multiple endpoints. This is how object storage achieves geographic distribution: requests from users in Europe route to European endpoints, requests from Asia route to Asian endpoints.

Tradeoff

**The trade-off is latency.**

HTTP adds overhead compared to lower-level protocols. Each request requires TCP connection setup (or reuse), TLS handshake, HTTP header parsing, and response formatting.

This is why object storage latencies are typically 10-100ms instead of the sub-millisecond latencies of block storage.

### 3.3 Flat Namespace vs Hierarchy

The flat namespace is what enables object storage to scale to trillions of objects. To understand why, let's compare how hierarchical and flat structures handle data access.

The diagram below shows both models side by side. Notice how the hierarchical model on the right requires traversing a tree structure, while the flat model on the left is just a collection of independent entries.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

In a hierarchical file system, accessing `/images/photo1.jpg` requires multiple operations:

1.  Look up root directory metadata
2.  Find "images" entry in the root
3.  Load the images directory metadata
4.  Find "photo1.jpg" entry in images
5.  Load the file's metadata (inode)
6.  Access the file data blocks

Each step involves a metadata lookup. With deep directory hierarchies, these lookups compound. A file at depth 10 requires at least 10 metadata operations before you can access the data.

In object storage, accessing `images/photo1.jpg` requires far fewer operations:

1.  Hash the key to determine which server partition owns it
2.  Look up the key in that partition's index
3.  Return the object

The flat structure eliminates directory traversal entirely. The key is the complete address. No matter how many objects exist or how "deep" the key path looks, access requires the same number of operations.

This architecture enables horizontal scaling. When you need more capacity or throughput, you add more servers and redistribute the key space. Each server is responsible for a range of keys, determined by consistent hashing. No single server needs to understand the entire namespace.

### 3.4 Key Characteristics

Object storage's characteristics flow directly from its architectural decisions. Understanding these helps you leverage object storage effectively and recognize its limitations.

#### **Immutable objects**

This is perhaps the most important characteristic to internalize. Objects are replaced entirely, not modified in place. If you want to change byte 1000 of a 1GB object, you must upload a completely new 1GB object. There's no "seek to position and write" operation.

This immutability might seem like a limitation, but it's actually a feature.

Immutable data is easier to cache (the cache never becomes stale), easier to replicate (no coordination needed for partial updates), and easier to version (each version is a complete snapshot).

#### **Rich, extensible metadata**

Unlike file systems with fixed metadata fields, object storage lets you attach arbitrary key-value pairs to each object.

This metadata isn't just for display. It can drive automation. S3 lifecycle policies use metadata to automatically transition objects to cheaper storage tiers or delete them after expiration. You can filter and query objects based on metadata using S3 Inventory or third-party tools.

#### **Massive scalability**

The flat namespace and distributed architecture enable scale that hierarchical systems cannot match. You can store petabytes without any configuration changes, capacity planning, or manual scaling.

This scalability is automatic. You don't provision capacity. You just store objects, and the system handles distribution, replication, and load balancing behind the scenes.

#### **Extreme durability**

S3 provides 99.999999999% (11 nines) durability. To put this in perspective: if you stored one million objects for 10,000 years, you would statistically expect to lose one object.

This durability comes from automatic replication. When you upload an object to S3 Standard, it's automatically replicated across at least three physically separated data centers (Availability Zones) within a region. If one data center burns down, your data survives in the others.

### 3.5 Cloud Object Storage

All major cloud providers offer object storage services with remarkably similar durability guarantees. The underlying technology differs, but the 11 nines durability has become an industry standard.

Provider

Service

Durability

Availability

AWS

S3

99.999999999%

99.99%

GCP

Cloud Storage

99.999999999%

99.95-99.99%

Azure

Blob Storage

99.999999999%

99.9-99.99%

Note the distinction between durability and availability. Durability measures the probability of data loss over a year. Availability measures the percentage of time the service accepts requests. Your data can be perfectly safe (high durability) even if the service is temporarily unreachable (lower availability).

### 3.6 When to Use Object Storage

Object storage has become the default choice for most unstructured data. Let's examine the scenarios where it excels.

#### **Storing unstructured data at scale**

Images, videos, documents, backups, logs, machine learning datasets. If you're storing files that don't need in-place modification and might scale to millions or billions of objects, object storage is the clear choice. No capacity planning. No scaling operations. Just store objects and the system handles the rest.

#### **Write-once, read-many workloads**

This access pattern aligns perfectly with object storage's immutable model. User uploads, media files, static website assets, archived documents. Once uploaded, the content rarely changes. When it does, you upload a new version rather than modifying in place. Object storage handles this naturally and efficiently.

#### **Extreme durability requirements**

For data that absolutely cannot be lost, object storage's 11 nines durability provides peace of mind that other storage types cannot match. Critical business data, compliance archives, master copies of media assets. The automatic cross-datacenter replication means you're protected against everything short of regional disasters.

#### **Cost optimization at scale**

At petabyte scale, storage costs dominate infrastructure budgets. The difference between object storage ($0.023/GB) and file storage ($0.30/GB) is 13x. The difference between S3 Standard and Glacier Deep Archive is another 23x. For large datasets, these differences translate to millions of dollars annually.

#### **Web-native access patterns**

Serving images to browsers, providing download links, integrating with CDNs, enabling direct uploads from mobile apps. Object storage's HTTP interface means everything just works. No custom protocols, no special client libraries, no firewall complications.

### 3.7 Limitations of Object Storage

Understanding object storage's limitations is just as important as understanding its strengths. These limitations determine when you should reach for block or file storage instead.

#### **No in-place modification**

This is the most fundamental limitation. You cannot edit byte 1000 of a 1GB file. You cannot append to a log file. You cannot update a configuration value. To make any change, you must re-upload the entire object.

For small objects, this is fine. Re-uploading a 10KB configuration file takes milliseconds. But for large objects that need frequent updates, it becomes prohibitive. A 100GB database file that needs random writes cannot live in object storage.

#### **Higher latency**

Object storage operations typically take 10-100ms. Compare this to block storage's sub-millisecond latencies. The difference is 100-1000x, which makes object storage unsuitable for latency-sensitive workloads like databases or real-time applications.

This latency comes from the HTTP protocol overhead, network round trips, and the distributed architecture that enables scale. It's a fundamental trade-off: you cannot have both unlimited scale and microsecond latency.

#### **No POSIX file semantics**

Applications expecting standard file operations, like opening a file, seeking to a position, reading some bytes, seeking to another position, and writing, cannot use object storage directly. There's no concept of "opening" an object and maintaining a position within it.

Many applications assume POSIX semantics. Legacy applications, some frameworks, and most development tools expect to work with files. These applications require either file or block storage, or a significant rewrite to use object storage's HTTP API.

#### **Request rate limits per prefix**

While object storage can handle enormous aggregate throughput, individual prefixes (key patterns) have limits. S3 supports 5,500 GET requests and 3,500 PUT requests per second per prefix. If all your objects share a prefix like `users/uploads/`, you'll hit this limit at scale.

The solution is to distribute objects across many prefixes, often by prepending a hash or randomized string to keys. But this breaks the "folder-like" organization that some applications expect.

## 4\. Choosing the Right Storage

Making the right storage choice requires understanding your workload's requirements and matching them to each storage type's strengths. This section provides frameworks for making these decisions systematically.

### 4.1 Decision Framework

The diagram below provides a decision tree for common scenarios. Start with your primary need and follow the branches to the recommended storage type.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

This framework encodes the key trade-offs we've discussed. Block storage wins on performance but requires single-server access. File storage provides shared access with POSIX semantics but at higher cost. Object storage offers the best cost and scale but sacrifices random access and in-place modification.

### 4.2 Use Case Matrix

For quick reference, here's a comprehensive matrix mapping common use cases to recommended storage types. The "Why" column explains the reasoning so you can apply similar logic to use cases not listed.

Use Case

Recommended

Why

Database (PostgreSQL, MySQL)

Block

Sub-ms latency, random I/O, ACID guarantees

VM boot volumes

Block

Direct disk access required

Docker volumes (single host)

Block

Performance, POSIX semantics

Kubernetes shared volumes

File

Multi-pod access with POSIX

Web server static files

Object

Scale, CDN integration, cost

User file uploads

Object

Scale, durability, direct browser upload

Video streaming

Object

Scale, CDN integration, lifecycle policies

Backups and archives

Object

Durability, lifecycle policies, Glacier tiers

Data lake

Object

Scale, analytics tool integration

ML training datasets

Object

Scale, versioning, multi-region

Application logs

Object

Cost, retention policies, analytics

Shared configuration files

File

POSIX semantics, immediate visibility

Session storage

Block or Redis

Performance (or skip storage entirely)

A few entries deserve elaboration. Kubernetes shared volumes use file storage because Kubernetes' ReadWriteMany access mode requires a storage type that supports concurrent access from multiple pods. Object storage cannot mount as a volume. Block storage can only be ReadWriteOnce.

Application logs might seem like a file storage use case, since we traditionally write logs to files. But at scale, logs are written once and rarely modified. Object storage is cheaper, more durable, and integrates well with log analytics services. The pattern is to buffer logs locally and ship them to object storage in batches.

Session storage is interesting because the right answer might be "neither." In-memory stores like Redis often handle sessions better than any persistent storage. If you need persistence, block storage provides the lowest latency.

### 4.3 Hybrid Architectures

Real production systems rarely use just one storage type. Instead, they combine multiple types, each serving the role it's best suited for. Understanding these hybrid patterns helps you design systems that leverage each storage type's strengths.

#### **Web Application Pattern**

A typical web application uses all three storage types. The diagram below shows how they fit together.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

In this architecture, EBS provides the high-performance storage that the database needs for random reads and writes. EFS provides shared storage for configuration files that all web servers need to read, with changes visible immediately across the fleet. S3 stores user uploads and static assets at low cost with high durability.

#### **Video Platform Pattern**

A video platform illustrates a more specialized hybrid architecture.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

The video content flows through object storage from upload to delivery. S3's scalability handles petabytes of video. CloudFront caches popular videos at edge locations for low-latency streaming.

Meanwhile, the metadata, video titles, descriptions, view counts, user information, lives in PostgreSQL on block storage. The database needs fast random access for queries like "show me all videos from this creator" or "get the next 10 videos in this playlist."

This separation is deliberate. Video bytes are write-once, read-many, and can tolerate higher latency. Metadata changes frequently and requires fast access. Each data type goes to the storage system optimized for its access pattern.

# 7\. Summary

We've covered a lot of ground. Let's consolidate the key points into actionable guidance.

**Block storage** delivers maximum performance for single-server workloads. It operates at the lowest abstraction level, providing sub-millisecond latency and hundreds of thousands of IOPS. Use it for databases, VMs, and anything requiring fast random access. The limitation is single-server attachment. Cost is moderate at $0.08-0.125/GB/month, but you pay for provisioned capacity whether you use it or not.

**File storage** provides shared access with familiar file system semantics. Multiple servers can read and write the same files simultaneously, with locking protocols handling coordination. Use it when applications need POSIX operations or when multiple hosts need shared access. It's the most expensive option at $0.30/GB/month, so reserve it for use cases that genuinely require its capabilities.

**Object storage** scales to exabytes at the lowest cost per GB. The flat namespace and HTTP interface enable virtually unlimited scale with 11 nines durability. Use it for unstructured data like media, backups, and data lakes. Accept the trade-off of higher latency (10-100ms) and immutable objects. At $0.023/GB/month for frequent access and as low as $0.001/GB/month for archives, it's dramatically cheaper than alternatives.

**Most production systems use all three.** A typical architecture has databases on block storage for performance, shared configuration on file storage for accessibility, and user content on object storage for scale and cost. Each storage type serves the workloads it's best suited for.

**Cost compounds at scale.** The numbers bear repeating: at 100 TB, S3 costs $2,300/month while EFS costs $30,000/month. That's $27,700 per month in potential savings. At petabyte scale, wrong storage choices cost millions of dollars annually. Always consider whether you're paying for capabilities you actually need.

**Latency determines capability.** You cannot run a transactional database on 100ms object storage latency, no amount of optimization changes this fundamental constraint. You cannot cost-effectively store petabytes on $0.08/GB block storage. Match the storage type to the access pattern, and the architecture will follow.

Launching soon
