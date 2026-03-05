---
title: "Design Spotify"
description: "Design Spotify - System Design Interviews Module 11"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 12-system-design-interviews
showOnArticles: false
featured: false
---

# Design Spotify

#### What is Spotify?

[Spotify](https://open.spotify.com/) is a music streaming platform that allows users to search, discover, and listen to millions of songs and podcasts on demand. It provides personalized recommendations, curated playlists, offline downloads, and features like shuffle, repeat, and cross-device syncing.

Spotify

HomeSearch

Your Library

Liked Songs

Playlist • 5 songs

Today's Top Hits

Playlist • 6 songs

Chill Vibes

Playlist • 6 songs

Playlist

# Today's Top Hits

The hottest tracks right now

Spotify • 6 songs

#TitleAlbum

1

Blinding Lights

The Weeknd

After Hours

3:23

2

Levitating

Dua Lipa, DaBaby

Future Nostalgia

3:23

3

Save Your Tears

The Weeknd

After Hours

3:35

4

Stay

Justin Bieber, The Kid LAROI

Justice

2:21

5

Peaches

Justin Bieber, Daniel Caesar

Justice

3:18

6

Montero

Lil Nas X

Montero

2:17

No song playing

0:00

0:00

Users can follow artists, share playlists, and explore trending or new releases.

With over **600 million** monthly active users (MAU) and **200 million** paid users, Spotify is the most popular music streaming platform in the world.

**Other Popular Examples:** [Apple Music](https://www.apple.com/apple-music/), [Amazon Music](https://music.amazon.com), [YouTube Music](https://music.youtube.com)

This system design problem touches on several fundamental concepts: content delivery at global scale, real-time streaming protocols, search infrastructure, recommendation systems, and high availability architecture.

In this chapter, we will walk through the **high-level design of a music streaming platform like Spotify.**

Let’s begin by clarifying the requirements.

# 1\. Requirements Gathering

Before jumping into architecture diagrams, we need to understand what we are building.

Music streaming might seem straightforward, but the requirements can vary significantly. Are we designing for millions or hundreds of millions of users? Do we need to support offline playback? How sophisticated should the recommendation engine be? These questions shape our design decisions.

Here is how a requirements discussion might unfold in an interview:

Discussion

**Candidate:** "How many users should the system support, and what does daily usage look like?"

**Interviewer:** "Let's design for 500 million total users, with about 200 million daily active users. On an average day, we see around 1 billion streams."

**Candidate:** "That's substantial scale. A billion streams per day means we are dealing with serious CDN and bandwidth requirements. Should I focus primarily on music, or do we need to handle podcasts and other audio formats as well?"

**Interviewer:** "Focus on music streaming for now. Podcasts have different characteristics like longer duration and less repeat listening, so you can mention them but don't need to design for them in detail."

**Candidate:** "Understood. What about the user experience around playback? I am thinking about latency requirements and whether users can download content for offline listening."

**Interviewer:** "Latency is critical. Users expect to hear audio within 200ms of pressing play. As for offline playback, yes, that's an important feature for premium subscribers, especially for people with limited data plans or unreliable connectivity."

**Candidate:** "Personalization is a big part of what makes these services sticky. Should I include the recommendation system in the design, or treat it as out of scope?"

**Interviewer:** "Cover the high-level approach to recommendations, though you don't need to dive deep into the ML algorithms."

**Candidate:** "One more question: should I design the content ingestion pipeline, meaning how artists upload music to the platform?"

**Interviewer:** "That's a separate system entirely. Focus on the consumer-facing streaming experience."

This conversation reveals several important constraints that will influence our design. Let's formalize these into functional and non-functional requirements.

## 1.1 Functional Requirements

Based on our discussion, here are the core features our system must support:

*   **Search:** Users can search for songs, albums, artists, and playlists. Search must be fast (under 100ms) and handle typos, partial matches, and multiple languages.
*   **Stream Music:** Users can play any song on-demand with minimal latency. The system should handle quality adaptation based on network conditions.
*   **Playlist Management:** Users can create, edit, delete, and share playlists. Playlists can contain thousands of songs and be collaborative.
*   **Personalized Recommendations:** The system provides personalized recommendations based on listening history, liked songs, and contextual signals like time of day.
*   **Offline Playback:** Premium users can download songs and playlists for offline listening, with appropriate DRM protection.

## 1.2 Non-Functional Requirements

Beyond features, we need to consider the qualities that make the system production-ready:

*   **High Availability:** The system should target 99.99% uptime (roughly 52 minutes of downtime per year). Users expect music to be accessible whenever they want it, and outages are highly visible.
*   **Low Latency:** Playback should start within 200ms of pressing play. Once playing, buffering should be rare even on variable network conditions.
*   **Scalability:** The system must handle 1 billion+ streams per day across 200 million daily active users, with traffic patterns that spike during commute hours and weekends.
*   **Global Reach:** Users expect low latency regardless of location. This requires edge infrastructure and CDN presence across major regions.
*   **Durability:** User data like playlists, liked songs, and listening history must never be lost. Losing a user's carefully curated playlist would be unacceptable.

# 2\. Back-of-the-Envelope Estimation

Before diving into the design, let's run some quick calculations to understand the scale we are dealing with. These numbers will guide our architectural decisions, particularly around CDN infrastructure, storage, and database selection.

### 2.1 Traffic Estimates

Starting with the numbers from our requirements discussion:

#### **Streaming Traffic**

We expect 1 billion streams per day. Let's convert this to queries per second (QPS):

```python
1Average stream QPS = 1,000,000,000 streams / 86,400 seconds ≈ 11,500 QPS
```

Traffic is rarely uniform throughout the day. Music streaming sees significant spikes during morning and evening commutes, lunch breaks, and weekends. During peak hours, we might see 3x the average load:

```python
1Peak stream QPS = 11,500 × 3 ≈ 35,000 QPS
```

#### **Metadata Traffic**

Every stream request triggers additional metadata lookups: song info, artist details, album art URLs, lyrics. Users also browse, search, and load playlists. This metadata traffic is typically 5-10x higher than the stream traffic:

```python
1Estimated metadata QPS: 50,000 - 100,000 QPS
```

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-6955482c8d8c4b01b6e1e073-1772709258503{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .error-icon{fill:#000000;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-thickness-normal{stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .marker.cross{stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 svg{font-family:inherit;font-size:16px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 p{margin:0;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .label{font-family:inherit;color:#f0fdf4;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .cluster-label text{fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .cluster-label span{color:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .cluster-label span p{background-color:transparent;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .label text,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node rect,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node circle,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node ellipse,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node polygon,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .rough-node .label text,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node .label text,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .image-shape .label,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .icon-shape .label{text-anchor:middle;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .rough-node .label,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node .label,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .image-shape .label,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .icon-shape .label{text-align:center;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node.clickable{cursor:pointer;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .arrowheadPath{fill:#0b0b0b;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edgeLabel p{background-color:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .cluster text{fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .cluster span{color:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 rect.text{fill:none;stroke-width:0;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .icon-shape,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .icon-shape p,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .icon-shape rect,#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 :root{--mermaid-font-family:inherit;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .primary tspan{fill:#000!important;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e073-1772709258503 .orange tspan{fill:#000!important;}

Peak Traffic (3x)

Daily Traffic

Streams  
1B per day  
11,500 QPS avg

Metadata  
50K-100K QPS  
searches, browses

35,000 QPS  
peak streams

~300K QPS  
peak metadata

These numbers are significant. At peak, we are handling over 300,000 requests per second across all services. This is why we need aggressive caching at multiple layers.

### 2.2 Storage Estimates

Music streaming has an interesting storage profile: a large catalog of audio files that rarely changes, combined with user data that grows continuously.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-6955482c8d8c4b01b6e1e074-1772709258507{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .error-icon{fill:#000000;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-thickness-normal{stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .marker.cross{stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 svg{font-family:inherit;font-size:16px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 p{margin:0;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .label{font-family:inherit;color:#f0fdf4;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .cluster-label text{fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .cluster-label span{color:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .cluster-label span p{background-color:transparent;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .label text,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node rect,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node circle,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node ellipse,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node polygon,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .rough-node .label text,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node .label text,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .image-shape .label,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .icon-shape .label{text-anchor:middle;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .rough-node .label,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node .label,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .image-shape .label,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .icon-shape .label{text-align:center;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node.clickable{cursor:pointer;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .arrowheadPath{fill:#0b0b0b;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edgeLabel p{background-color:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .cluster text{fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .cluster span{color:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 rect.text{fill:none;stroke-width:0;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .icon-shape,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .icon-shape p,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .icon-shape rect,#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 :root{--mermaid-font-family:inherit;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .primary tspan{fill:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .purple tspan{fill:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e074-1772709258507 .orange tspan{fill:#000!important;}

Storage Components

Audio Files  
1 PB total

Metadata  
200 GB

User Data  
7.5 TB

#### **Audio Files (The Big One)**

The audio catalog is where most of the storage goes:

*   Total songs in catalog: 100 million songs
*   Each song stored in multiple quality levels (64, 96, 160, 320 kbps)
*   Average total size per song across all qualities: ~10 MB

```python
1Total audio storage = 100,000,000 songs × 10 MB = 1 PB (Petabyte)
```

One petabyte is substantial but manageable with object storage services like S3. The key insight is that this data is mostly static. Songs don't change once uploaded, which makes caching highly effective.

#### **Metadata**

Song metadata is relatively small but needs to be fast:

Data Type

Estimate

Notes

Song metadata

100M × 2 KB = 200 GB

Title, artist, album, duration, genre

Artist profiles

10M × 5 KB = 50 GB

Bio, images, discography

Album data

20M × 3 KB = 60 GB

Track lists, artwork, release info

This comfortably fits in memory for caching, which is important for the response times we need.

#### **User Data**

User data grows continuously and needs different handling:

Data Type

Estimate

Notes

User profiles

500M × 2 KB = 1 TB

Preferences, settings, subscription

Playlists

500M × 5 KB = 2.5 TB

Average user has 5-10 playlists

Listening history

500M × 8 KB = 4 TB

Last 6 months of plays

### 2.3 Bandwidth Estimates

Bandwidth is where music streaming gets expensive. Each stream transfers significant data:

```python
1Average song: 4 minutes at 160 kbps = ~5 MB
2Daily data transfer: 1B streams × 5 MB = 5 PB per day
```

Five petabytes per day of bandwidth is massive. At typical cloud egress rates ($0.05-0.09 per GB), this would cost millions per month without optimization. This is exactly why CDN infrastructure is not optional for music streaming. It is essential for both performance and cost control.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-6955482c8d8c4b01b6e1e079-1772709258508{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .error-icon{fill:#000000;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-thickness-normal{stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .marker.cross{stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 svg{font-family:inherit;font-size:16px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 p{margin:0;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .label{font-family:inherit;color:#f0fdf4;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .cluster-label text{fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .cluster-label span{color:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .cluster-label span p{background-color:transparent;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .label text,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node rect,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node circle,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node ellipse,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node polygon,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .rough-node .label text,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node .label text,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .image-shape .label,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .icon-shape .label{text-anchor:middle;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .rough-node .label,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node .label,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .image-shape .label,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .icon-shape .label{text-align:center;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node.clickable{cursor:pointer;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .arrowheadPath{fill:#0b0b0b;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edgeLabel p{background-color:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .cluster text{fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .cluster span{color:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 rect.text{fill:none;stroke-width:0;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .icon-shape,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .icon-shape p,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .icon-shape rect,#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 :root{--mermaid-font-family:inherit;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .red tspan{fill:#000!important;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-6955482c8d8c4b01b6e1e079-1772709258508 .green tspan{fill:#000!important;}

Without CDN

Every request goes to origin

High latency for distant users

Massive bandwidth costs

With CDN

Popular songs cached at edge

~200ms latency globally

80%+ requests served from cache

### 2.4 Key Insights

These estimates reveal several important design implications:

1.  **CDN is critical:** With 5 PB of daily bandwidth, serving from origin is financially and technically impractical. Most streams must be served from edge caches.
2.  **Read-heavy workload:** For every song uploaded (which happens through a separate pipeline), there are millions of plays. We should invest heavily in caching and optimize for read performance.
3.  **Metadata fits in memory:** At 200 GB, song metadata can be cached aggressively. This enables the sub-100ms response times users expect.
4.  **Audio storage is static:** Unlike user-generated content platforms, the audio catalog changes slowly. This makes CDN caching straightforward.
5.  **User data is the scaling challenge:** While audio files are large but static, user listening history grows continuously and drives database scaling decisions.

# 3\. Core APIs

With our requirements and scale understood, let's define the API contract. A music streaming service needs APIs for search, playback, playlist management, and recommendations. Let's walk through each one.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .error-icon{fill:#000000;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-thickness-normal{stroke-width:1px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .marker.cross{stroke:#22c55e;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 svg{font-family:inherit;font-size:16px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 p{margin:0;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .label{font-family:inherit;color:#f0fdf4;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .cluster-label text{fill:#fafafa;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .cluster-label span{color:#fafafa;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .cluster-label span p{background-color:transparent;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .label text,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node rect,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node circle,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node ellipse,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node polygon,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .rough-node .label text,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node .label text,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .image-shape .label,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .icon-shape .label{text-anchor:middle;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .rough-node .label,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node .label,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .image-shape .label,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .icon-shape .label{text-align:center;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node.clickable{cursor:pointer;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .arrowheadPath{fill:#0b0b0b;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edgeLabel p{background-color:#0a0a0a;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .cluster text{fill:#fafafa;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .cluster span{color:#fafafa;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 rect.text{fill:none;stroke-width:0;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .icon-shape,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .icon-shape p,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .icon-shape rect,#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 :root{--mermaid-font-family:inherit;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .primary tspan{fill:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .green tspan{fill:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .orange tspan{fill:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-695548fb8d8c4b01b6e1e07a-1772709258509 .purple tspan{fill:#000!important;}

Core API Operations

GET /search  
Find content

GET /songs/.../stream  
Get audio URL

POST /playlists  
Manage playlists

GET /recommendations  
Get personalized picks

### 3.1 Search

#### **Endpoint:** `GET /search`

This is the entry point for discovery. Users type a query and expect relevant songs, artists, albums, and playlists back within milliseconds.

#### **Request Parameters:**

Parameter

Type

Required

Description

`query`

string

Yes

The search term (e.g., "bohemian rhapsody", "queen")

`type`

string

No

Filter by type: "song", "artist", "album", "playlist". Default: all types

`limit`

integer

No

Number of results per type. Default: 20

`offset`

integer

No

Pagination offset for results

#### **Example Response (200 OK):**

Json

```json
1{
2  "songs": [
3    {
4      "id": "song_123",
5      "title": "Bohemian Rhapsody",
6      "artist": "Queen",
7      "album": "A Night at the Opera",
8      "duration_ms": 354000,
9      "album_art_url": "https://cdn.example.com/art/album_456.jpg"
10    }
11  ],
12  "artists": [
13    {
14      "id": "artist_789",
15      "name": "Queen",
16      "image_url": "https://cdn.example.com/artist/queen.jpg",
17      "monthly_listeners": 45000000
18    }
19  ],
20  "albums": [...]
21}
```

#### **Error Responses:**

Status Code

Meaning

When It Occurs

`400 Bad Request`

Invalid input

Empty query or malformed parameters

`429 Too Many Requests`

Rate limited

Too many searches in short period

### 3.2 Get Stream URL

#### **Endpoint:** `GET /songs/{song_id}/stream`

This is the critical path for playback. Instead of streaming audio directly through our API servers, we return a signed URL that points to a CDN edge server. This approach offloads bandwidth from our application tier and ensures users get audio from a server close to them.

#### **Path Parameters:**

Parameter

Type

Description

`song_id`

string

The unique identifier for the song

#### **Query Parameters:**

Parameter

Type

Required

Description

`quality`

string

No

Preferred quality: "low" (96kbps), "medium" (160kbps), "high" (320kbps)

#### **Example Response (200 OK):**

Json

```json
1{
2  "stream_url": "https://cdn.example.com/audio/song_123/320.mp3?token=eyJhbGc...&expires=1705320000",
3  "expires_at": "2024-01-15T12:00:00Z",
4  "format": "mp3",
5  "bitrate": 320,
6  "duration_ms": 354000
7}
```

The signed URL includes an authentication token and expiration time. This prevents URL sharing (the token is tied to the user) and limits the window for unauthorized access.

#### **Error Responses:**

Status Code

Meaning

When It Occurs

`401 Unauthorized`

Not authenticated

Missing or invalid auth token

`403 Forbidden`

Access denied

Song unavailable in user's region, or subscription does not allow this quality

`404 Not Found`

Song not found

Invalid song\_id

### 3.3 Create Playlist

#### **Endpoint:** `POST /playlists`

Creates a new playlist for the authenticated user.

#### **Request Body:**

Parameter

Type

Required

Description

`name`

string

Yes

Playlist name (max 100 characters)

`description`

string

No

Playlist description

`is_public`

boolean

No

Whether the playlist is publicly visible. Default: true

#### **Example Request:**

Json

```json
1{
2  "name": "My Workout Mix",
3  "description": "High energy songs for the gym",
4  "is_public": true
5}
```

#### **Example Response (201 Created):**

Json

```json
1{
2  "playlist_id": "playlist_456",
3  "name": "My Workout Mix",
4  "description": "High energy songs for the gym",
5  "owner_id": "user_789",
6  "is_public": true,
7  "created_at": "2024-01-15T10:00:00Z",
8  "song_count": 0
9}
```

### 3.4 Add Songs to Playlist

#### **Endpoint:** `POST /playlists/{playlist_id}/songs`

Adds one or more songs to an existing playlist. Songs are added at the end of the playlist by default.

#### **Request Body:**

Json

```json
1{
2  "song_ids": ["song_123", "song_456", "song_789"],
3  "position": 0
4}
```

The optional `position` parameter allows inserting songs at a specific index. If omitted, songs are appended.

#### **Example Response (200 OK):**

Json

```json
1{
2  "playlist_id": "playlist_456",
3  "added_count": 3,
4  "song_count": 15
5}
```

#### **Error Responses:**

Status Code

Meaning

When It Occurs

`403 Forbidden`

Not owner

User does not own the playlist

`404 Not Found`

Not found

Playlist or one of the songs does not exist

### 3.5 Get Recommendations

#### **Endpoint:** `GET /recommendations`

Returns personalized song recommendations based on the user's listening history and optional seed inputs.

#### **Query Parameters:**

Parameter

Type

Required

Description

`seed_songs`

string

No

Comma-separated song IDs to base recommendations on

`seed_artists`

string

No

Comma-separated artist IDs

`limit`

integer

No

Number of recommendations (1-100). Default: 20

#### **Example Response (200 OK):**

Json

```json
1{
2  "songs": [
3    {
4      "id": "song_999",
5      "title": "Don't Stop Me Now",
6      "artist": "Queen",
7      "album": "Jazz",
8      "duration_ms": 210000,
9      "reason": "Because you listened to Bohemian Rhapsody"
10    },
11    {
12      "id": "song_888",
13      "title": "Under Pressure",
14      "artist": "Queen & David Bowie",
15      "album": "Hot Space",
16      "duration_ms": 248000,
17      "reason": "Popular with Queen fans"
18    }
19  ]
20}
```

The `reason` field provides transparency about why each song was recommended, which helps users understand and trust the recommendations.

# 4\. High-Level Design

Now we get to the interesting part: designing the system architecture. Rather than presenting a complex diagram upfront, we will build the design incrementally, starting with the core user journey (streaming music) and adding components as we address each requirement. This mirrors how you would approach the problem in an interview.

Our system needs to handle four core operations:

1.  **Stream Music:** Play any song with sub-200ms latency
2.  **Search:** Find songs, artists, and albums instantly
3.  **Manage Playlists:** Create, edit, and share playlists
4.  **Get Recommendations:** Surface personalized music discovery

The system is heavily read-intensive. For every song added to the catalog (which happens through a separate ingestion pipeline), there are millions of streams. This read-to-write asymmetry means we should optimize aggressively for read performance, and caching will be essential at every layer.

Let's visualize the two primary paths through our system:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554a658d8c4b01b6e1e08a-1772709258510{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .cluster-label text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .cluster-label span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .cluster-label span p{background-color:transparent;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .label text,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node rect,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node circle,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node ellipse,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node polygon,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .rough-node .label text,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node .label text,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .icon-shape .label{text-anchor:middle;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .rough-node .label,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node .label,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .icon-shape .label{text-align:center;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node.clickable{cursor:pointer;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .cluster text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .cluster span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 rect.text{fill:none;stroke-width:0;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .icon-shape,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .icon-shape p,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .icon-shape rect,#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 :root{--mermaid-font-family:inherit;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .primary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .secondary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .orange tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .purple tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .rose tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08a-1772709258510 .green tspan{fill:#000!important;}

Data Path (search, browse, playlists)

miss

Client

API Gateway

Application Services

Cache Layer

Databases

Stream Path (most traffic)

direct audio fetch

cache miss

Client

API Gateway

Playback Service

Generate Signed URL

CDN Edge

Object Storage

Notice how the stream path separates the control plane (getting a signed URL) from the data plane (actual audio delivery via CDN). This separation is key to handling billions of streams without our API servers becoming a bottleneck.

Let's build this architecture step by step.

## 4.1 Requirement 1: Music Streaming

This is the core functionality. When a user taps play, audio must start within 200ms. Once playing, buffering should be rare even on variable network conditions. Let's design for this critical path first.

When a user clicks play on a song, several things need to happen:

1.  Validate the user has permission to play this song (subscription, region)
2.  Generate a secure, time-limited URL for the audio file
3.  Return the URL so the client can fetch audio directly from a CDN edge server
4.  Track the play for analytics and royalty calculations

Let's introduce the components we need to make this work.

### Components for Streaming

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554a658d8c4b01b6e1e08b-1772709258511{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .cluster-label text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .cluster-label span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .cluster-label span p{background-color:transparent;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .label text,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node rect,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node circle,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node ellipse,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node polygon,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .rough-node .label text,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node .label text,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .icon-shape .label{text-anchor:middle;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .rough-node .label,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node .label,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .icon-shape .label{text-align:center;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node.clickable{cursor:pointer;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .cluster text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .cluster span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 rect.text{fill:none;stroke-width:0;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .icon-shape,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .icon-shape p,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .icon-shape rect,#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 :root{--mermaid-font-family:inherit;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .primary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .secondary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .purple tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .rose tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08b-1772709258511 .green tspan{fill:#000!important;}

Storage Layer

Edge Layer

Application Layer

Gateway Layer

1\. GET /songs/id/stream

2\. Validate + generate URL

3\. Return signed URL

4\. Return to client

5\. Fetch audio directly

6\. Cache miss? Fetch from origin

User

API Gateway

Playback Service

CDN Edge Servers  
Distributed Globally

Object Storage  
Audio Files

#### **API Gateway**

Every request enters through the API Gateway. Think of it as the front door to our system, handling concerns that are common across all requests.

The gateway terminates SSL connections, validates request format, enforces rate limits, authenticates users via tokens, and routes requests to the appropriate backend service. By handling these cross-cutting concerns at the edge, we keep our application services focused on business logic.

#### **Playback Service**

This service handles the critical decision: should this user be allowed to play this song? It checks:

*   Is the user authenticated with a valid session?
*   Does their subscription tier allow the requested quality (320kbps is premium-only)?
*   Is the song available in the user's geographic region (licensing varies by country)?
*   Has the user exceeded any rate limits?

If all checks pass, the service generates a signed URL that grants temporary access to the audio file on the CDN. The URL includes an authentication token and expiration time, typically 15-30 minutes. This prevents URL sharing and limits the window for unauthorized access.

#### **Content Delivery Network (CDN)**

This is where the magic happens for low-latency playback. A CDN is a network of edge servers distributed globally. When a user in Tokyo requests audio, instead of fetching from our origin in Virginia, they get it from a nearby edge server.

For popular songs (think Taylor Swift's latest release), the audio is already cached at edge locations worldwide. The CDN can serve millions of concurrent streams without touching our origin servers. This is essential given our bandwidth estimates of 5 PB per day.

#### **Object Storage**

The actual audio files live in object storage (S3, Google Cloud Storage, or Azure Blob). Files are organized by song ID and quality level:

```python
1s3://audio-bucket/
2  songs/
3    song_abc123/
4      320kbps.mp3    (high quality, ~10 MB)
5      160kbps.mp3    (standard, ~5 MB)
6      96kbps.mp3     (low bandwidth, ~3 MB)
7      manifest.json  (metadata about available formats)
```

Each song exists in multiple quality levels to support adaptive bitrate streaming and different subscription tiers.

### The Streaming Flow in Action

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Object StorageCDN EdgeRedis CachePlayback ServiceAPI GatewayClientObject StorageCDN EdgeRedis CachePlayback ServiceAPI GatewayClient#mermaid-69554a658d8c4b01b6e1e08d-1772709258511{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .actor-line{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 #sequencenumber{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .labelText,#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .loopText,#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .noteText,#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .actorPopupMenu{position:absolute;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 .actor-man circle,#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554a658d8c4b01b6e1e08d-1772709258511 :root{--mermaid-font-family:inherit;}Validate auth tokenCheck subscription,region, entitlementsClient uses signed URL directlyCache for future requestsalt\[CDN Cache Hit\]\[CDN Cache Miss\]GET /songs/song\_123/streamForward with user contextGet song metadataReturn metadata (or cache miss)Generate signed URL(15 min expiry)Return stream\_url200 OK with signed URLGET /audio/song\_123/320.mp3?token=...Stream audio (fastest path)Fetch from originReturn audio fileStream audio

Let's trace through this step by step:

1.  **Client requests playback:** The user taps play. The client sends a request to our API Gateway with the song ID and the user's auth token.
2.  **Gateway validates and routes:** The API Gateway verifies the token is valid, checks rate limits, and forwards the request to the Playback Service with the user's context.
3.  **Playback Service checks entitlements:** The service looks up the song metadata (often from cache) and verifies the user can play this song. Premium-only songs require a premium subscription. Some songs are not available in certain countries due to licensing.
4.  **Generate signed URL:** If all checks pass, the service generates a signed URL. This URL includes a cryptographic signature that proves the user was authorized at this moment. The signature expires after 15-30 minutes.
5.  **Client fetches audio from CDN:** The client now has a URL pointing to a CDN edge server. It fetches the audio directly, bypassing our API entirely. This is crucial for scale.
6.  **CDN serves or fetches:** If the song is popular, it's already cached at the edge. If not, the CDN fetches from origin (S3), caches it, and serves. Either way, the audio streams to the client.

**Why this design works:** By separating the control plane (authorization and URL generation) from the data plane (audio delivery), we can handle billions of streams. Our API servers handle lightweight authorization requests while the heavy lifting of audio delivery is handled by CDN infrastructure designed for exactly this purpose.

## 4.2 Requirement 2: Music Search

Users need to find any song instantly. They type "bohemian" and expect to see Queen's Bohemian Rhapsody appear within milliseconds. Search must be fast (under 100ms), handle typos ("bohemain"), partial matches, and return results ranked by relevance.

### Components for Search

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554a658d8c4b01b6e1e08e-1772709258512{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .cluster-label text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .cluster-label span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .cluster-label span p{background-color:transparent;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .label text,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node rect,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node circle,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node ellipse,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node polygon,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .rough-node .label text,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node .label text,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .icon-shape .label{text-anchor:middle;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .rough-node .label,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node .label,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .icon-shape .label{text-align:center;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node.clickable{cursor:pointer;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .cluster text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .cluster span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 rect.text{fill:none;stroke-width:0;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .icon-shape,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .icon-shape p,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .icon-shape rect,#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 :root{--mermaid-font-family:inherit;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .primary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .secondary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .purple tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .orange tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e08e-1772709258512 .rose tspan{fill:#000!important;}

Cache Layer

Search Infrastructure

Application Layer

Gateway Layer

1\. GET /search?q=bohemian

2\. Route to search

3\. Check cache

4\. Query index

5\. Return results

User

API Gateway

Search Service

Elasticsearch Cluster

Redis

#### **Search Service**

This service handles all search queries. It does not query the primary database directly. Instead, it queries a dedicated search index optimized for text matching.

The Search Service parses queries, handles autocomplete requests, applies filters, and ranks results based on relevance and popularity. It also caches frequent queries since many users search for the same popular songs and artists.

#### **Elasticsearch Cluster**

We use Elasticsearch (or a similar search engine like OpenSearch) for full-text search. Elasticsearch is purpose-built for this use case:

*   **Inverted indexes** enable fast text matching across 100 million songs
*   **Fuzzy matching** handles typos ("bohemain" matches "bohemian")
*   **Relevance scoring** ranks results by how well they match the query
*   **Horizontal scalability** allows us to add nodes as the catalog grows

The search index contains denormalized data: song titles, artist names, album names, genres, and popularity scores. When a new song is added to the catalog, an indexing pipeline updates Elasticsearch.

### The Search Flow in Action

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

ElasticsearchRedisSearch ServiceAPI GatewayClientElasticsearchRedisSearch ServiceAPI GatewayClient#mermaid-69554a658d8c4b01b6e1e08f-1772709258513{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .actor-line{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 #sequencenumber{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .labelText,#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .loopText,#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .noteText,#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .actorPopupMenu{position:absolute;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 .actor-man circle,#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554a658d8c4b01b6e1e08f-1772709258513 :root{--mermaid-font-family:inherit;}Fuzzy match,rank by relevanceand popularityalt\[Cache Hit\]\[Cache Miss\]GET /search?q=bohemianForward search requestCheck if query cachedReturn cached resultsQuery: "bohemian"Return ranked resultsCache results (5 min TTL)Return search results200 OK with songs, artists, albums

**Why cache search results?** Popular searches are repeated constantly. "Taylor Swift", "Drake", and "Bohemian Rhapsody" are searched thousands of times per minute. Caching these results for even a few minutes dramatically reduces load on Elasticsearch.

## 4.3 Requirement 3: Playlist Management

Users create playlists to organize their music. A playlist can contain anywhere from a few songs to thousands. Users expect to add songs instantly and have changes sync across all their devices.

### Components for Playlists

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554a658d8c4b01b6e1e090-1772709258513{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .cluster-label text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .cluster-label span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .cluster-label span p{background-color:transparent;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .label text,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node rect,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node circle,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node ellipse,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node polygon,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .rough-node .label text,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node .label text,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .icon-shape .label{text-anchor:middle;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .rough-node .label,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node .label,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .icon-shape .label{text-align:center;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node.clickable{cursor:pointer;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .cluster text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .cluster span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 rect.text{fill:none;stroke-width:0;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .icon-shape,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .icon-shape p,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .icon-shape rect,#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 :root{--mermaid-font-family:inherit;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .primary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .secondary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .purple tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .orange tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e090-1772709258513 .rose tspan{fill:#000!important;}

Data Layer

Application Layer

Gateway Layer

1\. POST /playlists/id/songs

2\. Route request

3\. Verify ownership

4\. Add song

5\. Invalidate cache

6\. Confirm

User

API Gateway

Playlist Service

Playlist Database

Redis Cache

#### **Playlist Service**

Manages all playlist CRUD operations. Key responsibilities:

*   Create, update, and delete playlists
*   Add and remove songs (maintaining order)
*   Handle collaborative playlists where multiple users can edit
*   Manage sharing and privacy settings

#### **Playlist Database**

We need a database that handles:

*   High read volume (users constantly load their playlists)
*   Reasonable write volume (adding/removing songs)
*   Efficient queries by user\_id (show me all my playlists)
*   Efficient ordering (songs have a position in the playlist)

We will discuss the specific database choice in the Database Design section.

### The Playlist Flow in Action

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Playlist DBRedisPlaylist ServiceAPI GatewayClientPlaylist DBRedisPlaylist ServiceAPI GatewayClient#mermaid-69554a658d8c4b01b6e1e091-1772709258514{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .actor-line{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 #sequencenumber{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .labelText,#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .loopText,#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .noteText,#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .actorPopupMenu{position:absolute;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 .actor-man circle,#mermaid-69554a658d8c4b01b6e1e091-1772709258514 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554a658d8c4b01b6e1e091-1772709258514 :root{--mermaid-font-family:inherit;}Verify user ownsthis playlistPOST /playlists/pl\_123/songs{song\_ids: \["song\_456"\]}Forward with user contextGet playlist metadataInsert song at positionConfirm insertInvalidate playlist cacheReturn updated playlist200 OK

The cache invalidation is important: when a user adds a song on their phone, the change must appear immediately when they open the app on their laptop. By invalidating the cache, we ensure the next request fetches fresh data.

## 4.4 Requirement 4: Personalized Recommendations

This is what makes modern streaming services sticky. Users expect the app to know their taste and surface music they will love but haven't discovered yet. Features like "Discover Weekly" and "Daily Mix" drive significant engagement.

Recommendations combine two fundamentally different patterns: batch processing (generating recommendations offline) and real-time serving (delivering them instantly when requested).

### Components for Recommendations

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554a658d8c4b01b6e1e092-1772709258514{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .cluster-label text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .cluster-label span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .cluster-label span p{background-color:transparent;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .label text,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node rect,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node circle,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node ellipse,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node polygon,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .rough-node .label text,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node .label text,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .icon-shape .label{text-anchor:middle;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .rough-node .label,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node .label,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .icon-shape .label{text-align:center;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node.clickable{cursor:pointer;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .cluster text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .cluster span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 rect.text{fill:none;stroke-width:0;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .icon-shape,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .icon-shape p,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .icon-shape rect,#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 :root{--mermaid-font-family:inherit;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .primary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .green tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .purple tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .orange tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e092-1772709258514 .rose tspan{fill:#000!important;}

Serving Path (real-time)

Batch Path (runs daily/weekly)

miss

Listening Events

ML Pipeline

Feature Store

Pre-computed  
Recommendations

Client Request

Recommendation Service

Redis Cache

#### **ML Pipeline (Offline)**

This batch processing system runs periodically (daily or weekly) to:

*   Aggregate listening history across all users
*   Train collaborative filtering models (users who liked X also liked Y)
*   Generate user taste profiles from audio features
*   Pre-compute personalized recommendations for each user

The pipeline produces recommendations that are stored and ready to serve. This is how features like "Discover Weekly" work: they are generated once per week and cached.

#### **Feature Store**

Stores computed features about users and songs:

*   User taste vectors (what genres, moods, tempos they prefer)
*   Song embeddings (numerical representations of audio characteristics)
*   Contextual features (what users listen to in the morning vs evening)

#### **Recommendation Service**

Serves recommendations in real-time. For most requests, it simply fetches pre-computed recommendations from cache. For seed-based recommendations ("songs similar to X"), it may compute results on the fly using the feature store.

### The Recommendation Flow in Action

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

Feature StoreRedisRecommendation ServiceAPI GatewayClientFeature StoreRedisRecommendation ServiceAPI GatewayClient#mermaid-69554a658d8c4b01b6e1e093-1772709258515{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .actor-line{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 #sequencenumber{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .labelText,#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .loopText,#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .noteText,#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .actorPopupMenu{position:absolute;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 .actor-man circle,#mermaid-69554a658d8c4b01b6e1e093-1772709258515 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554a658d8c4b01b6e1e093-1772709258515 :root{--mermaid-font-family:inherit;}Rank candidatesby relevancealt\[Cache Hit (common case)\]\[Cache Miss\]GET /recommendations (home page)Get personalized recommendationsCheck for pre-computed recsReturn recommendationsGet user taste profileReturn profile + candidate songsStore resultsReturn personalized songs200 OK with recommendations

The key insight is that most recommendations are pre-computed. "Discover Weekly" is generated once per week for each user. When a user opens the app, we simply fetch their pre-computed playlist from cache. This approach allows us to use sophisticated ML models that would be too slow to run in real-time.

## 4.5 Putting It All Together

Now that we have designed each requirement, let's step back and see the complete architecture:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554a658d8c4b01b6e1e094-1772709258515{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .error-icon{fill:#000000;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .marker.cross{stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 svg{font-family:inherit;font-size:16px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 p{margin:0;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .cluster-label text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .cluster-label span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .cluster-label span p{background-color:transparent;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .label text,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node rect,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node circle,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node ellipse,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node polygon,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .rough-node .label text,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node .label text,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .icon-shape .label{text-anchor:middle;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .rough-node .label,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node .label,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .image-shape .label,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .icon-shape .label{text-align:center;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node.clickable{cursor:pointer;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .cluster text{fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .cluster span{color:#fafafa;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 rect.text{fill:none;stroke-width:0;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .icon-shape,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .icon-shape p,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .icon-shape rect,#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 :root{--mermaid-font-family:inherit;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .primary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .secondary tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .orange tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .purple tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .rose tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .green tspan{fill:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .lightblue>\*{fill:#3bc9db!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .lightblue span{fill:#3bc9db!important;stroke:#000!important;color:#000!important;}#mermaid-69554a658d8c4b01b6e1e094-1772709258515 .lightblue tspan{fill:#000!important;}

ML Infrastructure

Storage Layer

Data Layer

Cache Layer

Application Layer

Gateway Layer

Edge Layer

Client Layer

Mobile App

Web Browser

Desktop App

CDN  
Audio Delivery

Load Balancer

API Gateway

Playback  
Service

Search  
Service

Playlist  
Service

Recommendation  
Service

User  
Service

Redis Cluster

Elasticsearch

Metadata DB

Playlist DB

User DB

Object Storage  
Audio Files

ML Pipeline

Feature Store

The architecture follows a layered approach, with each layer having a specific responsibility:

**Client Layer:** Users access the service through mobile apps, web browsers, or desktop applications. From our perspective, they all look the same: HTTP requests with authentication tokens.

**Edge Layer:** The CDN handles audio delivery at the edge, close to users geographically. The load balancer distributes API traffic across gateway instances.

**Gateway Layer:** The API Gateway handles authentication, rate limiting, and request routing. It is the single entry point for all API traffic.

**Application Layer:** Stateless services implement the business logic. Each service is independently deployable and horizontally scalable.

**Cache Layer:** Redis provides low-latency access to frequently requested data: song metadata, user sessions, search results, and pre-computed recommendations.

**Data Layer:** Different databases for different access patterns: Elasticsearch for search, relational databases for metadata and playlists, and potentially Cassandra for high-write-volume data like listening history.

**ML Infrastructure:** Offline pipelines train models and generate recommendations. The feature store provides fast access to user and song features.

### Component Responsibilities

Component

Primary Responsibility

Scaling Strategy

CDN

Audio delivery, edge caching

Managed service (auto-scales)

Load Balancer

Traffic distribution

Managed service

API Gateway

Auth, rate limiting, routing

Horizontal (stateless)

Playback Service

Stream authorization, URL signing

Horizontal (stateless)

Search Service

Query parsing, result ranking

Horizontal (stateless)

Playlist Service

Playlist CRUD operations

Horizontal (stateless)

Recommendation Service

Serve personalized content

Horizontal (stateless)

Elasticsearch

Full-text search

Add nodes to cluster

Redis Cluster

Hot data caching

Add nodes, shard by key

Databases

Persistent storage

Read replicas, sharding

Object Storage

Audio files

Managed (infinite scale)

This architecture handles our requirements well: the CDN absorbs audio streaming traffic, the cache layer handles most read traffic, and the stateless services scale horizontally for everything else.

# 5\. Database Design

With the high-level architecture in place, let's zoom into the data layer. Choosing the right database and designing an efficient schema are critical decisions that affect performance, scalability, and operational complexity.

## 5.1 Choosing the Right Databases

Music streaming has diverse data with very different access patterns. Song metadata needs complex queries and relationships. Playlists need fast reads by user. Listening history is append-heavy with billions of writes. No single database excels at all of these.

This is where polyglot persistence shines: using different databases for different data types, each optimized for its specific access pattern.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554acb8d8c4b01b6e1e096-1772709258516{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .error-icon{fill:#000000;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .marker.cross{stroke:#22c55e;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 svg{font-family:inherit;font-size:16px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 p{margin:0;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .cluster-label text{fill:#fafafa;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .cluster-label span{color:#fafafa;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .cluster-label span p{background-color:transparent;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .label text,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node rect,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node circle,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node ellipse,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node polygon,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .rough-node .label text,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node .label text,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .image-shape .label,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .icon-shape .label{text-anchor:middle;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .rough-node .label,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node .label,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .image-shape .label,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .icon-shape .label{text-align:center;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node.clickable{cursor:pointer;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .cluster text{fill:#fafafa;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .cluster span{color:#fafafa;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 rect.text{fill:none;stroke-width:0;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .icon-shape,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .icon-shape p,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .icon-shape rect,#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 :root{--mermaid-font-family:inherit;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .primary tspan{fill:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .purple tspan{fill:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .orange tspan{fill:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554acb8d8c4b01b6e1e096-1772709258516 .green tspan{fill:#000!important;}

Data Types and Their Databases

Song Metadata  
PostgreSQL

Search Index  
Elasticsearch

Playlists  
Cassandra

User Sessions  
Redis

Listening History  
Cassandra

Recommendations  
Redis

Let's think through why each data type maps to a specific database:

#### **Song Metadata: PostgreSQL**

Song, artist, and album data has natural relationships: songs belong to albums, albums belong to artists, artists can collaborate on songs. A relational database handles these relationships well with foreign keys and joins.

We need complex queries: find all songs by this artist, find albums released in this year, get the top 50 songs in this genre. PostgreSQL's rich query language handles this naturally.

The catalog (100 million songs) changes slowly and fits comfortably in a single database with read replicas. No need for the complexity of sharding.

#### **Search Index: Elasticsearch**

We already discussed this: full-text search, fuzzy matching, relevance scoring. Elasticsearch is purpose-built for these requirements. It sits alongside PostgreSQL, receiving updates when the catalog changes.

#### **Playlists: Cassandra**

Playlist access patterns are user-centric: show me all my playlists, load this specific playlist, add a song to this playlist. These queries always include a user\_id, making it a perfect partition key.

Cassandra excels here because:

*   It partitions data by user, so all of a user's playlists are on the same node
*   Reads and writes within a partition are fast
*   It scales horizontally as user count grows
*   It handles high write throughput for active playlist editing

#### **User Sessions and Recommendations: Redis**

Session data (is this user logged in?) and pre-computed recommendations need sub-millisecond reads. Redis keeps this data in memory and handles millions of reads per second.

Redis also supports TTLs natively, which is perfect for session expiration and recommendation refresh cycles.

#### **Listening History: Cassandra**

This is the highest-write-volume data in the system. With 1 billion streams per day, we are writing 11,500+ events per second. Cassandra handles this write throughput while still supporting efficient reads by user (show me my recent listening history).

The partition key is user\_id, and the clustering key is listened\_at timestamp (descending). This means we can efficiently query "last 100 songs this user played" without scanning the entire table.

### Database Choice Summary

Data Type

Database

Key Reasoning

Song Metadata

PostgreSQL

Complex relationships, rich queries, stable catalog

Search Index

Elasticsearch

Full-text search, fuzzy matching, relevance scoring

Playlists

Cassandra

User-partitioned, high read/write throughput

User Sessions

Redis

Sub-millisecond reads, TTL support

Listening History

Cassandra

High write volume, time-series access pattern

Recommendations

Redis

Pre-computed, needs instant reads

## 5.2 Database Schema

Now let's design the schema for each data store.

### Songs Table (PostgreSQL)

This is the heart of our catalog. Each row represents one song.

Field

Type

Description

`song_id`

UUID (PK)

Unique identifier for the song

`title`

VARCHAR(255)

Song title

`artist_id`

UUID (FK)

Reference to artists table

`album_id`

UUID (FK)

Reference to albums table

`duration_ms`

INTEGER

Song duration in milliseconds

`release_date`

DATE

When the song was released

`genres`

VARCHAR\[\]

Array of genre tags

`audio_path`

VARCHAR(500)

Path to audio in object storage (e.g., "songs/abc123/")

`play_count`

BIGINT

Total play count (updated periodically)

`created_at`

TIMESTAMP

When the record was created

**Indexes:**

Sql

```sql
1-- Primary lookup
2PRIMARY KEY (song_id)
3
4-- Find songs by artist
5CREATE INDEX idx_songs_artist ON songs(artist_id);
6
7-- Find songs by album
8CREATE INDEX idx_songs_album ON songs(album_id);
9
10-- Search by title (for exact match, fuzzy search uses Elasticsearch)
11CREATE INDEX idx_songs_title ON songs(title);
```

### Artists Table (PostgreSQL)

Field

Type

Description

`artist_id`

UUID (PK)

Unique identifier for the artist

`name`

VARCHAR(255)

Artist name

`bio`

TEXT

Artist biography

`image_url`

VARCHAR(500)

Profile image URL on CDN

`monthly_listeners`

INTEGER

Current monthly listener count (updated daily)

`verified`

BOOLEAN

Whether artist is verified

`created_at`

TIMESTAMP

When the record was created

### Playlists Table (Cassandra)

Cassandra tables are designed around query patterns. Our primary queries are:

*   Get all playlists for a user
*   Get a specific playlist by ID
*   Get songs in a playlist

Sql

```sql
1-- Playlists by user
2CREATE TABLE playlists_by_user (
3    user_id       UUID,
4    playlist_id   UUID,
5    name          TEXT,
6    description   TEXT,
7    is_public     BOOLEAN,
8    song_count    INT,
9    created_at    TIMESTAMP,
10    updated_at    TIMESTAMP,
11    PRIMARY KEY (user_id, created_at, playlist_id)
12) WITH CLUSTERING ORDER BY (created_at DESC, playlist_id ASC);
```

The partition key is `user_id`, so all of a user's playlists are on the same node. The clustering key orders playlists by creation date (newest first).

### Playlist Songs Table (Cassandra)

Sql

```sql
1-- Songs in a playlist
2CREATE TABLE playlist_songs (
3    playlist_id   UUID,
4    position      INT,
5    song_id       UUID,
6    added_at      TIMESTAMP,
7    added_by      UUID,
8    PRIMARY KEY (playlist_id, position)
9) WITH CLUSTERING ORDER BY (position ASC);
```

The partition key is `playlist_id`, and songs are ordered by position. This makes loading a playlist efficient: one query returns all songs in order.

### User Listening History Table (Cassandra)

Sql

```sql
1-- Listening history by user
2CREATE TABLE listening_history (
3    user_id           UUID,
4    listened_at       TIMESTAMP,
5    song_id           UUID,
6    duration_played   INT,
7    context_type      TEXT,
8    context_id        UUID,
9    PRIMARY KEY (user_id, listened_at)
10) WITH CLUSTERING ORDER BY (listened_at DESC);
```

With this schema, we can efficiently query "last 50 songs user X played" since data is partitioned by user and ordered by timestamp.

**Why Cassandra handles the write volume:** With 200 million DAU and an average of 5 songs per session, we are writing 1 billion events per day. Cassandra distributes this across nodes and handles writes without locks, achieving the throughput we need.

# 6\. Design Deep Dive

The high-level architecture gives us a solid foundation, but system design interviews often go deeper into specific components. In this section, we will explore the trickiest parts of our design: audio streaming architecture, search infrastructure, personalization, scaling strategies, and offline playback.

These are the topics that distinguish a good system design answer from a great one.

## 6.1 Audio Streaming Architecture

Delivering audio with low latency and high quality is the core technical challenge. A user clicks play and expects music within 200ms. Once playing, there should be no buffering even when network conditions change. Let's explore how to achieve this at scale.

### Audio File Preparation

Before a song can be streamed, it goes through an ingestion pipeline that prepares it for delivery:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .label text,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .purple tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a0-1772709258516 .rose tspan{fill:#000!important;}

Original Audio  
WAV/FLAC

Transcoding  
Service

Quality Variants

Chunking

Encryption  
DRM

Object Storage

#### **Step 1: Transcoding**

The original high-quality audio (often WAV or FLAC from the label) is converted to multiple quality levels:

Quality

Bitrate

File Size (4 min song)

Target Users

Very High

320 kbps

~10 MB

Premium users on WiFi

High

160 kbps

~5 MB

Standard quality

Normal

96 kbps

~3 MB

Low bandwidth/data saver

Low

24 kbps

~720 KB

Extreme data saver

Multiple quality levels enable adaptive streaming: if network conditions degrade, the client can switch to a lower quality mid-song rather than buffering.

#### **Step 2: Chunking**

Each quality variant is split into small chunks, typically 5-10 seconds each. A 4-minute song becomes roughly 24-48 chunks per quality level.

Why chunk? Several reasons:

*   **Faster start:** The client only needs the first chunk to start playing, not the entire file
*   **Efficient seeking:** Jumping to 2:30 means fetching just that chunk, not everything before it
*   **Quality switching:** The client can switch quality on chunk boundaries without audible artifacts
*   **Better caching:** Individual chunks can be cached and evicted independently

#### **Step 3: DRM Encryption**

Each chunk is encrypted for digital rights management. The client decrypts on playback using a license key tied to the user's subscription. This prevents users from extracting and redistributing audio files.

### Streaming Protocol Options

There are several ways to deliver audio to clients. Let's compare the approaches:

#### Approach 1: Progressive Download

The simplest approach: the client requests the complete audio file and downloads it sequentially.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

CDNClientCDNClient#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .actor-line{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 #sequencenumber{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .labelText,#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .loopText,#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .noteText,#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .actorPopupMenu{position:absolute;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 .actor-man circle,#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554b2b8d8c4b01b6e1e0a2-1772709258517 :root{--mermaid-font-family:inherit;}Plays as it downloadsGET /song\_123.mp3Stream entire file (5 MB)

**Pros:**

*   Simple to implement with standard HTTP
*   Works everywhere

**Cons:**

*   Cannot adapt quality mid-stream
*   Seeking to the middle requires downloading everything before it (or range requests)
*   No graceful handling of network changes

#### Approach 2: HTTP Live Streaming (HLS) or DASH

The modern standard for adaptive streaming. Audio is pre-chunked, and a manifest file describes available qualities and chunk URLs.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

CDNClientCDNClient#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .actor-line{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 #sequencenumber{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .labelText,#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .loopText,#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .noteText,#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .actorPopupMenu{position:absolute;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 .actor-man circle,#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554b2b8d8c4b01b6e1e0a3-1772709258520 :root{--mermaid-font-family:inherit;}Choose 320kbps based on bandwidthStart playback immediatelyNetwork slows downSwitch to 160kbps seamlesslyGET /song\_123/manifest.m3u8Return manifest (quality levels + chunk URLs)GET /song\_123/320/chunk\_001.tsFirst chunkGET /song\_123/320/chunk\_002.tsGET /song\_123/160/chunk\_003.ts

**How it works:**

1.  Client fetches the manifest file listing all available quality levels and chunk URLs
2.  Based on measured bandwidth, client selects a quality level
3.  Client downloads chunks sequentially, measuring download speed
4.  If bandwidth changes, client switches quality at the next chunk boundary

**Pros:**

*   Adapts to changing network conditions
*   Efficient seeking (jump to any chunk)
*   Works well with CDN caching (chunks are small, static files)
*   Industry standard with wide client support

**Cons:**

*   More complex than progressive download
*   Slight overhead from manifest requests

#### Approach 3: Custom Protocol

Spotify uses a proprietary streaming protocol optimized specifically for music. Key optimizations include:

*   **Predictive buffering:** Pre-fetches the next song while the current one is playing
*   **Gapless playback:** No silence between tracks in an album
*   **Multiple connections:** Uses parallel connections for redundancy
*   **Stutter-free algorithms:** Prioritizes playback continuity over quality

#### **Recommendation for interviews**

Use HLS/DASH as your answer. It's well understood, handles the core requirements (adaptive streaming, CDN compatibility), and is what most new streaming services would choose. Mention that mature services like Spotify have evolved custom protocols for specialized optimizations.

### CDN Caching Strategy

With 5 PB of daily bandwidth, CDN caching is essential for both cost and latency. But not all songs are equal: some are played millions of times per day, while others might be played once per year.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .label text,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .green tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a4-1772709258520 .purple tspan{fill:#000!important;}

Tiered Caching Strategy

miss

miss

Edge Cache  
Top 1% songs  
~99% of traffic

Regional Cache  
Top 10% songs  
Remaining hot content

Origin - S3  
All 100M songs  
Long tail content

#### **The Pareto Effect in Music**

Music consumption follows an extreme power law:

*   The top 1% of songs account for roughly 90% of all streams
*   The top 10% covers 99%+ of streams
*   The remaining 90% of the catalog (the "long tail") is rarely accessed

This distribution makes caching highly effective. Taylor Swift's latest single is requested millions of times per day and should be cached at every edge location. An obscure jazz recording from the 1960s might be requested once per month and can stay at origin.

#### **Cache Warming Strategies:**

1.  **New releases:** When an anticipated album drops (Beyonce, Taylor Swift), pre-push it to all edge locations before the release time
2.  **Trending content:** Monitor stream velocity and proactively cache songs that are gaining momentum
3.  **Predictive caching:** When a user starts a playlist, pre-cache upcoming songs at their nearest edge
4.  **Geographic patterns:** Songs popular in specific regions (K-pop in Korea, Reggaeton in Latin America) are prioritized at regional caches

#### **Cache Headers:**

For audio chunks, we set long cache times since content never changes:

```shell
1Cache-Control: public, max-age=31536000, immutable
```

The `immutable` directive tells browsers and CDNs that the content will never change, eliminating conditional requests.

## 6.2 Search and Discovery

Search is how users find music. They type a few letters and expect to see relevant results instantly, even if they misspell the artist name or only remember part of the song title. Search must be fast (under 100ms), forgiving of errors, and smart about ranking.

### Search Index Architecture

We do not query the primary database for search. Instead, we maintain a dedicated search index using Elasticsearch (or OpenSearch). This separation allows us to optimize each system for its specific workload.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .label text,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .secondary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .purple tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .rose tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a6-1772709258521 .green tspan{fill:#000!important;}

Query Flow

Data Flow

PostgreSQL  
Source of Truth

Change Data  
Capture

Elasticsearch  
Search Index

User Query

Search Service

Ranked Results

#### **What Gets Indexed:**

Field

Source

Notes

Song titles

Song metadata

Primary search target

Artist names

Artist table

Includes aliases and collaborations

Album names

Album table

Including compilation names

Lyrics

Lyrics service

For "search by lyric" feature

Genres and moods

Tagging system

"upbeat pop", "chill electronic"

#### **Index Structure:**

Elasticsearch uses inverted indexes, mapping terms to the documents containing them:

```shell
1"bohemian" -> [song_123, song_456, album_789]
2"queen" -> [artist_001, song_123, song_456, album_789]
3"rhapsody" -> [song_123, song_888]
```

When a user searches "bohemian rhapsody", Elasticsearch finds documents matching both terms and ranks them by relevance.

### Handling Typos and Fuzzy Matching

Users frequently misspell artist and song names. "Ariana Grandi", "Tylor Swift", "bohemain rapsody" should all return correct results.

Elasticsearch provides several mechanisms:

1.  **Fuzzy queries:** Allow for character edits (insertions, deletions, substitutions). "bohemain" with edit distance 1 matches "bohemian".
2.  **Phonetic matching:** "Cue" sounds like "Queue". Phonetic analyzers (Soundex, Metaphone) index words by how they sound.
3.  **N-gram tokenization:** Index partial words for autocomplete. "bohe" matches "bohemian" because we index \["b", "bo", "boh", "bohe", "bohem", ...\].

### Search Ranking

Raw text matching is not enough. When searching "queen", users probably want the legendary rock band, not every song with "queen" in the title. We rank results using multiple signals:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .label text,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .green tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0a9-1772709258521 .purple tspan{fill:#000!important;}

Ranking Signals

Text Relevance  
How well query matches

Popularity  
Stream count, listeners

Personalization  
User's listening history

Recency  
New releases boost

Final  
Score

Signal

Weight

Description

Text relevance

High

Exact matches rank higher than partial matches

Popularity

High

Monthly listeners, total streams, trending velocity

Personalization

Medium

Boost artists the user has listened to before

Recency

Low

New releases get a small boost

The weights are tuned based on user behavior data. If users consistently click the 3rd result, something is wrong with the ranking.

### Autocomplete

As users type, we show suggestions in real-time. This requires extremely low latency (under 50ms) because users are actively typing and waiting.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

ElasticsearchSearch ServiceClientUserElasticsearchSearch ServiceClientUser#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .actor-line{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 #sequencenumber{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .labelText,#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .loopText,#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .noteText,#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .actorPopupMenu{position:absolute;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 .actor-man circle,#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554b2b8d8c4b01b6e1e0ab-1772709258521 :root{--mermaid-font-family:inherit;}Debounce 100msTotal: ~50msTypes "tay"GET /autocomplete?q=tayPrefix query with edge n-grams\[Taylor Swift, Tay Keith, ...\]Top 5 suggestionsShow dropdown

#### **Implementation:**

1.  Index names with edge n-grams: "taylor" becomes \["t", "ta", "tay", "tayl", "taylo", "taylor"\]
2.  Use Elasticsearch's completion suggester, optimized for prefix matching
3.  Return top 5-10 suggestions sorted by popularity
4.  Client-side debouncing (100ms) prevents excessive requests while typing

## 6.3 Personalization and Recommendations

Personalization is what makes Spotify addictive. When you open the app and "Discover Weekly" has exactly the kind of music you love but have never heard, it feels like magic. That magic is the result of sophisticated recommendation systems running at massive scale.

### Understanding User Taste

The recommendation system learns user preferences from multiple signals, each providing different information:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .label text,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .secondary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .green tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ac-1772709258522 .purple tspan{fill:#000!important;}

Context Signals

Implicit Signals (Volume)

Explicit Signals (Strong)

Liked Songs  
User explicitly saved

Added to Playlist  
Deliberate action

Listening History  
What they play

Skip Behavior  
Skipped = dislike

Time Spent  
Full song vs partial

Time of Day  
Morning vs night

Device Type  
Phone, speaker, car

Activity  
Workout, focus, sleep

User Taste  
Model

Signal

Type

Strength

Notes

Liked songs

Explicit

Very strong

User clicked heart, clear preference

Added to playlist

Explicit

Strong

Deliberate curation

Listening history

Implicit

Medium

What they play repeatedly

Skip behavior

Implicit

Medium

Skipping within 30 seconds indicates dislike

Listen duration

Implicit

Weak

Full song = engagement, partial = maybe skip

Time of day

Context

Weak

Morning playlists differ from night

### Recommendation Approaches

There are several approaches to generating recommendations, each with trade-offs:

#### Approach 1: Collaborative Filtering

The core idea: users with similar taste like similar songs. If you and I both love the same 50 songs, and you love a song I have not heard, I will probably like it too.

**How it works:**

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .label text,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .rose tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0ae-1772709258522 .green tspan{fill:#000!important;}

Matrix Factorization

User-Song Matrix

ALS/SVD

ALS/SVD

dot product

Millions of users  
× Millions of songs

User Embeddings  
100-dim vectors

Song Embeddings  
100-dim vectors

Predicted  
Preferences

1.  Build a sparse matrix of user-song interactions (plays, likes, skips)
2.  Use matrix factorization (ALS, SVD) to find latent factors
3.  Each user and song becomes a vector in latent space
4.  Predict preference as the dot product of user and song vectors

**Pros:**

*   Discovers unexpected recommendations ("users like you also like...")
*   No need for content analysis

**Cons:**

*   Cold start problem: new users and new songs have no interaction data
*   Computationally expensive: the matrix has billions of entries

#### Approach 2: Content-Based Filtering

The idea: recommend songs similar to what the user already likes, based on the songs' characteristics.

**How it works:**

1.  Extract audio features from songs: tempo (BPM), energy, acousticness, danceability, valence (happiness)
2.  Convert each song into an embedding (vector representation)
3.  Find songs with similar embeddings to what the user likes

**Pros:**

*   Works for new songs (they have audio features even without play data)
*   Explainable: "we recommend this because it has similar energy to songs you like"

**Cons:**

*   Can create filter bubbles (only recommends similar-sounding music)
*   Requires audio analysis infrastructure

#### Approach 3: Hybrid (What Spotify Actually Uses)

Real systems combine multiple approaches:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .label text,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .secondary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .purple tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0af-1772709258523 .green tspan{fill:#000!important;}

Output

Ensemble

Input Signals

Collaborative  
Filtering

Content-Based  
Filtering

Context  
Model

Ensemble Layer  
Weighted combination

Personalized  
Recommendations

The ensemble layer learns how to weight each model's predictions. For new users, content-based gets more weight. For users with rich history, collaborative filtering dominates.

### Batch vs Real-Time Recommendations

Different recommendation features have different latency requirements:

Feature

Compute Time

Refresh Rate

Infrastructure

Discover Weekly

Hours

Weekly

Spark batch jobs

Daily Mix

Hours

Daily

Spark batch jobs

"Because you listened to..."

<100ms

Per request

Model serving + feature store

Radio (similar to current song)

<100ms

Per request

Nearest neighbor search

**Batch recommendations** (Discover Weekly) run offline using full model training. They are pre-computed for every user and stored in Redis for instant serving.

**Real-time recommendations** use pre-trained models with real-time features. When you finish a song, we query the model with your current session context to suggest the next song.

### Recommendation System Architecture

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .label text,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .secondary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .purple tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .green tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b1-1772709258523 .rose tspan{fill:#000!important;}

Storage

Serving

Processing

Data Collection

User Events  
plays, skips, likes

Kafka

Stream Processing  
Flink/Spark Streaming

Feature Store

Batch Pipeline  
Spark

Train Models

Model Serving  
TensorFlow Serving

Recommendation API

Redis  
Pre-computed recs

1.  **Event collection:** Every play, skip, and like flows through Kafka
2.  **Stream processing:** Real-time features are computed (current session, recent plays)
3.  **Batch processing:** Heavy model training runs on Spark, retraining weekly
4.  **Feature store:** Central repository for all user and song features
5.  **Model serving:** Trained models are deployed for real-time inference
6.  **Caching:** Pre-computed recommendations (Discover Weekly) are stored in Redis

## 6.4 Handling Scale and High Availability

With 200 million daily active users and 1 billion streams per day, the system must be designed for extreme scale. Equally important, it must stay up. Users expect music to be available 24/7, and outages are highly visible on social media.

### Horizontal Scaling

The key to horizontal scaling is keeping services stateless. When a service stores no state locally, you can add or remove instances without coordination.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .label text,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .secondary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .purple tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b2-1772709258524 .orange tspan{fill:#000!important;}

Load Balancer

Playback Service 1

Playback Service 2

Playback Service 3

Playback Service N...

Redis Cluster

Databases

**All our application services are stateless:**

*   Playback Service: stateless, any instance can handle any request
*   Search Service: stateless, queries Elasticsearch
*   Playlist Service: stateless, reads/writes to Cassandra
*   Recommendation Service: stateless, fetches from cache or feature store

#### **Auto-scaling with Kubernetes:**

We use Horizontal Pod Autoscaler (HPA) to automatically add capacity:

Metric

Target

Action

CPU utilization

70%

Add pods when exceeded

Request latency (p99)

100ms

Add pods if latency spikes

Request queue depth

100

Add pods if queue builds up

During peak hours (evening commute, weekends), the system automatically scales up. During low-traffic periods (3 AM), it scales down to save costs.

### Database Scaling

Different databases scale differently:

#### **Cassandra (Playlists, Listening History):**

Cassandra scales horizontally by adding nodes. Data is automatically rebalanced across the cluster using consistent hashing.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .label text,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b4-1772709258524 .secondary tspan{fill:#000!important;}

Cassandra Cluster

Node 1  
Users A-F

Node 2  
Users G-M

Node 3  
Users N-S

Node 4  
Users T-Z

Playlist Service

Each user's data lives on a subset of nodes (replication factor = 3). Reads and writes for a user hit the same nodes, making operations efficient.

#### **PostgreSQL (Song Metadata):**

For the song catalog, we use read replicas rather than sharding:

*   One primary handles writes (song additions, metadata updates)
*   Multiple read replicas handle read traffic
*   Writes are infrequent (new songs added daily, not per-second)
*   100 million songs fits comfortably in a well-indexed PostgreSQL instance

#### **Elasticsearch (Search):**

Elasticsearch scales by adding nodes to the cluster. Indexes are automatically sharded across nodes.

### Multi-Layer Caching

Caching is essential at every layer to handle our traffic:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .label text,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .rose tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .green tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b5-1772709258524 .purple tspan{fill:#000!important;}

Client

Client Cache  
Local Storage

CDN Cache  
Edge Locations

Redis Cache  
Data Center

Database

Layer

What's Cached

TTL

Hit Rate

Client

Recently played, user preferences

1 hour

Very high

CDN

Audio files, album art, static assets

24+ hours

80-90%

Redis

Song metadata, recommendations, sessions

5-15 min

90%+

Database

Query results in buffer pool

Automatic

95%+

With these cache layers, only a tiny fraction of requests reach the primary databases.

### High Availability

#### **Multi-Region Deployment:**

We deploy in multiple geographic regions with active-active configuration:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .label text,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .secondary>\*{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .secondary span{fill:#38d9a9!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .secondary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .purple tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0b7-1772709258525 .orange tspan{fill:#000!important;}

Asia

Europe

US East

replication

replication

Load Balancer

Services

Databases

Load Balancer

Services

Databases

Load Balancer

Services

Databases

DNS/Global  
Load Balancer

*   Users are routed to the nearest region via DNS-based load balancing
*   Each region can handle its traffic independently
*   If one region fails, traffic is automatically routed to remaining regions
*   Data is replicated across regions (eventually consistent for playlists, synchronous for critical user data)

#### **Graceful Degradation:**

When components fail, the system should degrade gracefully rather than crash entirely:

Component

If It Fails

Fallback

Recommendation Service

Home page shows generic playlists

Serve cached "top hits"

Search Service

Search is temporarily unavailable

Show recently played

Playlist Service

Cannot modify playlists

Read from cache (read-only mode)

CDN

Slower audio delivery

Fall back to origin

The most important invariant: **playback should always work**. Users can tolerate degraded recommendations, but not being able to play music is a critical failure.

### Rate Limiting

Protection against abuse and accidental overload:

Endpoint

Limit

Notes

Stream requests

100/min per user

Prevents bot abuse

Search requests

30/min per user

Prevents scraping

Playlist writes

60/min per user

Prevents spam

API (unauthenticated)

10/min per IP

Prevents anonymous abuse

Rate limits are enforced at the API Gateway using Redis-backed counters with sliding window algorithm.

## 6.5 Offline Playback

Premium users can download songs for offline listening. This is essential for users on flights, subways, or in areas with poor connectivity. But it introduces unique challenges: we are giving users permanent copies of copyrighted content that we need to protect and eventually revoke.

### Download Architecture

The download flow is similar to streaming, but the client stores the content locally instead of playing it immediately:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

CDNLicense ServerDownload ServiceClientCDNLicense ServerDownload ServiceClient#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .actor{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 text.actor>tspan{fill:#f0fdf4;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .actor-line{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .innerArc{stroke-width:1.5;stroke-dasharray:none;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 #arrowhead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .sequenceNumber{fill:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 #sequencenumber{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 #crosshead path{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .messageText{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .labelBox{stroke:#22c55e;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .labelText,#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .labelText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .loopText,#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .loopText>tspan{fill:#fafafa;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:#22c55e;fill:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .note{stroke:#f59e0b;fill:#422006;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .noteText,#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .noteText>tspan{fill:#fef3c7;stroke:none;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .activation0{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .activation1{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .activation2{fill:#166534;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .actorPopupMenu{position:absolute;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .actorPopupMenuPanel{position:absolute;fill:transparent;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .actor-man line{stroke:#22c55e;fill:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 .actor-man circle,#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 line{stroke:#22c55e;fill:transparent;stroke-width:2px;}#mermaid-69554b2b8d8c4b01b6e1e0ba-1772709258525 :root{--mermaid-font-family:inherit;}Verify premium subscription,region, device countStore locally with licenseloop\[For each song\]Later, offline playbackCheck license expiryRequest download for playlistGenerate download licensesReturn encrypted license keysDownload URLs + license keysDownload encrypted audioEncrypted audio fileDecrypt using cached license

### The Download Flow in Detail

1.  **User initiates download:** User marks a playlist for offline access
2.  **Entitlement check:** Download Service verifies:

*   User has an active premium subscription
*   Song is available for download in user's region
*   User has not exceeded device limit (typically 5 devices)
*   User has not exceeded download limit (typically 10,000 songs)

4.  **License generation:** For each song, we generate an encrypted license tied to:

*   The user's account
*   The specific device
*   An expiration time (30 days)

6.  **Download:** Client downloads encrypted audio files from CDN
7.  **Local storage:** Audio and licenses are stored in encrypted local storage

### DRM and Content Protection

Downloaded files must be protected from piracy. If users could extract and share downloaded MP3s, the entire licensing model would collapse.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .label text,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .green tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bb-1772709258525 .purple tspan{fill:#000!important;}

Protection Layers

Audio Encryption  
Widevine/FairPlay

License Keys  
User + Device bound

Periodic License Check  
Every 30 days

Device Limits  
Max 5 devices

#### **Encryption:**

Audio files are encrypted using industry-standard DRM systems:

*   **Widevine** (Android, Chrome)
*   **FairPlay** (iOS, Safari)
*   **PlayReady** (Windows)

The decryption keys are stored in secure hardware (when available) and never exposed to the application layer.

#### **License Expiration:**

Downloaded content does not last forever. Licenses expire after 30 days of offline use. When the device comes online, it must check with the License Server to renew. If the user's subscription has lapsed, renewal fails and downloaded content becomes unplayable.

#### **Device Management:**

Limit

Value

Reason

Max devices per account

5

Prevent account sharing abuse

Max downloads per device

10,000 songs

Storage sanity

Offline validity

30 days

Periodic subscription verification

### Storage Management on Device

The client is responsible for managing downloaded content:

*   **Quality selection:** Users choose download quality (affects storage)

*   Very High (320 kbps): ~10 MB per song
*   High (160 kbps): ~5 MB per song
*   Normal (96 kbps): ~3 MB per song

*   **Storage tracking:** Show users how much storage is used
*   **Smart cleanup:** Automatically remove songs that have not been played offline in 60+ days, oldest downloads first when storage is low

## 6.6 Royalty Calculation and Playback Tracking

Every stream must be tracked accurately for royalty payments to artists and labels. This is not just a feature; it's a legal and financial requirement. Billions of dollars flow from Spotify to rights holders based on stream counts.

### What Counts as a Stream?

Not every play counts as a stream for royalty purposes:

Condition

Counts as Stream?

Why

Played 30+ seconds

Yes

Industry standard threshold

Played < 30 seconds

No

Prevents gaming with short plays

Automated/bot playback

No

Detected and filtered

User actively listening

Yes

Normal usage

Background audio with no engagement

Maybe

Complex rules apply

The 30-second threshold is an industry standard. Playing 29 seconds and skipping does not count. Playing 30 seconds and then skipping does count.

### Playback Event Pipeline

We need to capture every play event, process it at scale, and aggregate for royalty calculation:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .label text,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .orange tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .purple>\*{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .purple span{fill:#9775fa!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .purple tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .green tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .red tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .rose>\*{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .rose span{fill:#f783ac!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0be-1772709258526 .rose tspan{fill:#000!important;}

Storage & Analytics

Stream Processing

Event Collection

Client Apps

Playback Events  
start, pause, seek, complete

Event Collector  
API

Kafka  
Durable queue

Stream Processor  
Flink/Spark Streaming

Fraud Detection  
ML Models

Analytics DB  
ClickHouse

Royalty  
Aggregator

Payment  
System

### Event Flow in Detail

1.  **Client emits events:** The app sends events for key playback moments:

*   `play_start`: User pressed play
*   `play_pause`: User paused
*   `play_seek`: User jumped to different position
*   `play_complete`: Song finished naturally
*   `play_skip`: User skipped before completion

3.  **Event collection:** Events are batched and sent to our Event Collector API. We use batching to reduce network overhead and handle intermittent connectivity.
4.  **Kafka for durability:** Events flow into Kafka, providing durability and buffering. If downstream systems are slow, Kafka absorbs the backlog without losing data.
5.  **Stream processing:** A Flink or Spark Streaming job processes events in near-real-time:

*   Reconstructs complete play sessions from individual events
*   Determines which plays qualify as streams (30+ seconds)
*   Enriches with user and song metadata

7.  **Fraud detection:** ML models flag suspicious patterns before counting streams
8.  **Analytics and royalties:** Valid streams are written to analytics databases and fed into the royalty calculation pipeline

### Fraud Detection

Stream manipulation is a real problem. Bad actors try to inflate stream counts to earn royalties fraudulently. We detect and filter these:

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .error-icon{fill:#000000;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-thickness-normal{stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .marker.cross{stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 svg{font-family:inherit;font-size:16px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 p{margin:0;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .label{font-family:inherit;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .cluster-label text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .cluster-label span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .cluster-label span p{background-color:transparent;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .label text,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node rect,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node circle,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node ellipse,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node polygon,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .rough-node .label text,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node .label text,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .icon-shape .label{text-anchor:middle;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .rough-node .label,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node .label,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .image-shape .label,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .icon-shape .label{text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node.clickable{cursor:pointer;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .arrowheadPath{fill:#0b0b0b;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edgeLabel p{background-color:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .cluster text{fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .cluster span{color:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 rect.text{fill:none;stroke-width:0;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .icon-shape,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .icon-shape p,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .icon-shape rect,#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 :root{--mermaid-font-family:inherit;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .primary>\*{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .primary span{fill:#00ceff!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .primary tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .red tspan{fill:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-69554b2b8d8c4b01b6e1e0bf-1772709258527 .green tspan{fill:#000!important;}

Fraud Signals

High

Low

Bot-like Patterns  
Same song on loop

Geographic Anomalies  
Impossible location changes

Device Fingerprinting  
Emulators, VMs

Account Behavior  
No variety, no playlists

ML Fraud  
Classifier

Fraud Score

Block + Investigate

Count as Stream

#### **Detection signals:**

Signal

Description

Indicates

Loop behavior

Same song played 100+ times

Bot or manipulation

Geographic impossibility

User in Tokyo, then NYC 5 minutes later

Account compromise

Device fingerprint

Virtual machine, emulator, automation

Bot farm

No diversity

Only plays one artist, no browsing

Targeted manipulation

Payment anomalies

Many streams but subscription always fails

Stolen credentials

Detected fraud is flagged, excluded from royalty calculations, and investigated. Repeat offenders have accounts suspended.

### Royalty Calculation

Stream data feeds into the royalty system that determines artist payments. The calculation is complex and varies by contract, but the basic model is:

1.  **Pool model:** Total subscription revenue forms a pool
2.  **Stream share:** Each artist's streams as a percentage of total streams
3.  **Payment:** Artist receives their percentage of the revenue pool

This happens monthly, processing billions of stream records to determine millions of payments.

# References

*   [Spotify Engineering Blog](https://engineering.atspotify.com/) - Insights into Spotify's engineering decisions and architecture
*   [How Spotify Uses ML for Personalization](https://engineering.atspotify.com/2021/12/how-spotify-uses-ml-to-create-the-future-of-personalization/) - Deep dive into Spotify's recommendation systems
*   [HTTP Live Streaming Documentation](https://developer.apple.com/documentation/http-live-streaming) - Apple's official HLS specification
*   [Cassandra Data Modeling Guide](https://cassandra.apache.org/doc/latest/cassandra/developing/data-modeling/index.html) - Best practices for designing Cassandra schemas
*   [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) - Search infrastructure fundamentals

# Quiz

## Design Spotify Quiz

1 / 20

Multiple Choice

To meet a “play starts within ~200ms” goal globally, which approach is most directly effective for delivering audio bytes quickly?

AIncrease the replication factor of the metadata databaseBCompute recommendations synchronously before playback beginsCServe audio from a CDN with edge caching close to usersDRoute all traffic through a single global region for consistency

PreviousNext

Launching soon
