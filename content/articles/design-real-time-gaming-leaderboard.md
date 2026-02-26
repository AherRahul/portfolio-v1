---
title: "Design a Real-Time Gaming Leaderboard - System Design Interview"
description: "A Gaming Leaderboard is a ranked list of players, typically sorted by a specific metric such as score, points or level."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-real-time-gaming-leaderboard.md"
dateModified: "2025-02-06"
datePublished: "2025-02-06"
showOnArticles: true
topics:
  - system-design
---

A  **Gaming**   **Leaderboard**  is a ranked list of players, typically sorted by a specific metric such as score, points or level.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/66c2d2fb-3d73-4d00-9b35-a8b940b09f4a_1058x760.png)](https://substackcdn.com/image/fetch/$s_!19pU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F66c2d2fb-3d73-4d00-9b35-a8b940b09f4a_1058x760.png)

In a  **real-time**  leaderboard, updates happen almost instantly:

1. A player’s score changes (e.g., after scoring a point or defeating an opponent).
2. The system updates that player’s rank immediately.
3. Other players can see the updated position without waiting or refreshing.

This real-time aspect makes the user experience more dynamic and engaging.

However, it also introduces significant  **technical challenges** , such as:

- Efficiently retrieving Top-N players (e.g., Top 10 or Top 100).
- Allowing players to quickly find their own rank without scanning the entire leaderboard.

In this article, we will explore how to design a  **scalable** ,  **low-latency** , and  **real-time leaderboard**  that can support above queries and enhance the user experience.

# 1. Requirements

Before diving into the design, lets clearly define the functional and non-functional requirements of our real-time gaming leaderboard..

### Functional Requirements

- **Top-N Queries** : Display top N players (e.g., top 10, top 100) on the leaderboard and update it in real-time.
- **Player’s Own Rank** : Allow a player to query their current rank without scanning the entire leaderboard.
- **Nearby Rank Queries:**  Provide the ability to retrieve a “slice” of the leaderboard around a specific player (e.g., ranks 45 to 55 if the player is rank 50).
- **History Tracking:**  Players can view past game scores and historical leaderboards for previous matches.

### Non-Functional Requirements

- **Real-time updates:**  Score changes should reflect immediately in the leaderboard.
- **Low latency** : Leaderboard queries should return the results in milliseconds.
- **High Concurrency** : System should support thousands of concurrent players submitting scores and fetching rankings.

### Approach to Designing the System

The most challenging aspects of building a real-time leaderboard is  **database design** . Choosing the right storage system is critical to ensuring that queries can be executed efficiently without performance bottlenecks.

To simplify the design process, we will follow below approach:

1. **Start with API Design:** Clearly define the input/output structure of leaderboard queries and updates.
2. **Define the High-Level Architecture:** Identify core system components and their interactions.
3. **Database Design:** Choose the appropriate storage model optimized for fast leaderboard lookups and real-time updates.

# 2. API Design

To support real-time leaderboard operations, we define a set of  **RESTful APIs**  that allow players to update scores, retrieve rankings, and query nearby ranks efficiently.

### 2.1 Score Update

Updates a player's score incrementally **.**

**Endpoint** : POST /leaderboard/score/update

**Request Body**  (JSON):

```
{
  "playerId": "player123",
  "scoreDelta": 50
}
```

> **Assumption:** We will use relative score updates (scoreDelta) rather than absolute updates.

**Response**  (JSON):

```
{
  "playerId": "player123",
  "updatedScore": 1000,
  "currentRank": 10
}
```

### 2.2 Get Top-N Players

Retrieves the top-N players from the leaderboard, ranked by their scores.

**Endpoint** : GET /leaderboard/top?n=10

**Query Parameter** : n = number of top players to fetch (default 10, max 100, etc.)

**Response**  (JSON):

```
{
  "leaderboardId": "global",
  "topPlayers": [
    { "playerId": "playerA", "score": 1500, "rank": 1 },
    { "playerId": "playerB", "score": 1490, "rank": 2 },
    // ...
  ]
}
```

### 2.3 Get Player Rank

Allows a player to retrieve their current rank without scanning the entire leaderboard.

**Endpoint** : GET /leaderboard/rank/{playerId}

**Response**  (JSON):

```
{
  "playerId": "player123",
  "score": 1000,
  "rank": 10
}
```

### 2.4 Get Nearby Ranks

Retrieves players ranked around a given player, allowing for comparison with competitors of similar skill levels.

**Endpoint** : GET /leaderboard/nearby/{playerId}?range=5

**Query Param** : range indicates how many ranks above and below to fetch (e.g., 5 above, 5 below).

**Response**  (JSON):

```
{
  "playerId": "player123",
  "startRank": 45,
  "endRank": 55,
  "players": [
    { "playerId": "playerX", "score": 1020, "rank": 44 },
    { "playerId": "player123", "score": 1000, "rank": 45 },
    { "playerId": "playerZ", "score": 995,  "rank": 46 },
    // ...
  ]
}
```

**Example:**  If a player is ranked 50th, this API allows them to see players ranked 45-55 for a competitive comparison.

### 2.5 WebSockets for Real-Time Updates

While REST APIs are good for on-demand queries, WebSockets or Server-Sent Events (SSEs) can push real-time leaderboard updates to subscribed users.

Players would subscribe to leaderboard updates, and receive updates instantly without polling.

# 3. High Level Design

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
