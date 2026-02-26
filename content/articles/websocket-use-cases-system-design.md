---
title: "Top 10 WebSocket Use Cases in System Design"
description: "Real-time features are everywhere—chat apps, live dashboards, collaborative editors, multiplayer games. Behind the scenes, one technology powers these seamless interactions: WebSockets."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/websocket-use-cases-system-design.md"
dateModified: "2025-05-29"
datePublished: "2025-05-29"
showOnArticles: true
topics:
  - system-design
---

Real-time features are everywhere—chat apps, live dashboards, collaborative editors, multiplayer games. Behind the scenes, one technology powers these seamless interactions:  **WebSockets** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/4945e2ea-3cc4-4a23-9c48-023591961da5_1116x378.png)](https://substackcdn.com/image/fetch/$s_!cLht!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4945e2ea-3cc4-4a23-9c48-023591961da5_1116x378.png)

Unlike traditional request-response models, WebSockets enable  **full-duplex, low-latency communication**  over a single persistent connection. This makes them the ideal choice when both the client and server need to exchange data continuously and without delay.

In this article, we’ll explore the  **top 10 real-world use cases of WebSockets** , many of which are also relevant for  **system design interviews** .

> **Note:**  Each use case includes a simplified system design overview. To stay focused on WebSockets, we'll cover only the components involved in enabling real-time features rather than the full end-to-end system.

# 1. Real-time Chat Applications

In real-time chat applications, users expect  **instant updates** —whether it's new messages, typing indicators, delivery receipts, or presence status.

But delivering this seamless experience at scale is  **challenging** , especially with  **millions of users**  and  **thousands of concurrent group chats** .

**Polling**  the server every few seconds to check for new messages isn’t efficient due to:

- Delayed message delivery
- Wasted bandwidth when no new data is available
- Server overload, as every client repeatedly hits the backend

**WebSockets**  solve this by maintaining a  **persistent, full-duplex connection**  between client and server, enabling:

- Instant message delivery
- Real-time typing and presence updates
- A single connection for sending and receiving, eliminating repeated HTTP overhead

## System Design Overview

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e33b27c9-ae04-4477-9a02-7fed7d627f7d_2146x1674.png)](https://substackcdn.com/image/fetch/$s_!5OoX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe33b27c9-ae04-4477-9a02-7fed7d627f7d_2146x1674.png)

- **WebSocket Chat Servers** : Maintains persistent connections with clients, handles incoming events and messages, and delivers real-time updates to users.
- **Connection Registry** : Keeps track of active WebSocket sessions and maps users to their current connections.
- **Message Queue** : Temporarily buffers incoming messages for asynchronous processing, enabling system decoupling and ensuring reliable persistence.
- **Message Storage Service** : Consumes messages from the queue, attaches relevant metadata, and stores them in the message database.
- **Message Store** : A durable and scalable database that holds all messages, metadata, and conversation history.

## How It Works

#### 1. Client Establishes WebSocket Connection

When a user opens the app:

- The client authenticates with the backend using a  **JWT or session token**
- Then establishes a  **WebSocket connection**  to a chat server:

```
{
  "action": "connect",
  "userId": "user-123",
  "device": "ios"
}
```
- This connection remains open for the entire session

#### 2. Sending Messages

When the user sends a message:

- The client sends it over the WebSocket connection:

```
{
  "type": "message",
  "conversationId": "conv-456",
  "from": "user-123",
  "to": "user-789",
  "text": "Hey! How’s it going?",
  "timestamp": 1716601000
}
```
- The chat server:Validates the messagePushes it to a  **message queue**
- Validates the message
- Pushes it to a  **message queue**

#### 3. Receiving Messages

For each recipient:

- The chat server checks the  **Connection Registry**  to find active WebSocket sessions
- If the user is online, the message is pushed instantly:

```
{
  "type": "incoming_message",
  "conversationId": "conv-456",
  "from": "user-123",
  "text": "Hey! How’s it going?",
  "timestamp": 1716601000
}
```

- If the user is offline:The message is stored for delivery upon reconnectOr sent as a  **push notification**
- The message is stored for delivery upon reconnect
- Or sent as a  **push notification**

#### 4. Typing Indicators

The  **same WebSocket connection**  used for messaging can also be leveraged to send  **ephemeral events**  like typing indicators and presence status.

When a user begins typing in a conversation:

- The client sends a lightweight event over the open WebSocket connection:

```
{
  "type": "typing",
  "conversationId": "conv-456",
  "userId": "user-123"
}
```
- The server receives the event and checks the  **Connection Registry**  to determine if the recipient(s) are currently online.
- If they are online, the typing event is  **immediately pushed**  to their active WebSocket sessions.
- If they are offline, the event is discarded (not stored), since it's ephemeral and has no long-term value.

Typing events are typically throttled (e.g., once every few seconds) to avoid flooding the system.

# 2. Online Multiplayer Gaming

In fast-paced online multiplayer games,  **every millisecond matters.**

Modern games require:

- **Low latency (<50ms)**
- **Consistent state sync**  across all players

If you rely on HTTP polling where clients keep asking the server for updates, you introduce:

- **Lag** : Updates arrive late.
- **Unfairness** : One player sees a different state than another.
- **Scalability issues** : Too many requests = stressed servers.

**WebSockets**  allow game clients and servers to send frequent updates (player positions, moves, game events) in both directions. This keeps all players’ views in sync during gameplay.

## System Design Overview

[![image](https://substack-post-media.s3.amazonaws.com/public/images/5634c993-d806-4857-881d-59efe68fb5e7_1616x1432.png)](https://substackcdn.com/image/fetch/$s_!NkA-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5634c993-d806-4857-881d-59efe68fb5e7_1616x1432.png)

- **WebSocket Servers:** Maintain persistent, low-latency connections with players to send and receive real-time game events.
- **Connection Registry:** Tracks which players are connected, which match they belong to, and which WebSocket server is managing their session.
- **Game Match Server:** Runs the core game logic including input processing, physics, and rules. Ensures a consistent, authoritative game state.
- **In-Memory Game State:** Holds the live, up-to-date snapshot of all game entities (e.g., players, objects, projectiles) for a specific match, updated on every game tick.

## How It Works

#### 1. Session Modeling

Each active game instance (e.g., match, room, arena) is represented as a  **unique session**  identified by a session ID.

**Examples:**

- game:arena:1234
- game:world:zone5

#### 2. Client Input Streaming

Once the game starts:

- The client establishes a  **persistent WebSocket connection**  to one of the WebSocket servers.
- Sends a join message with its playerId and session info:

```
{
  "action": "join",
  "playerId": "p789",
  "session": "arena:1234"
}
```
- From that point on, the client  **streams user input events**  (movement, actions, abilities) every  **50–100ms** :

```
{
  "type": "input",
  "playerId": "p789",
  "input": {
    "moveX": 1,
    "moveY": 0,
    "shoot": true
  },
  "timestamp": 1716600000
}
```

This approach ensures the server receives a continuous stream of player actions in real-time.

#### 3. Game Match Server and State Propagation

Each session is managed by an  **authoritative Game Match Server**  that runs a  **main game loop**  at a fixed tick rate—typically  **30–60 ticks per second** .

**On each tick, the server:**

- Collects and queues all input events received from connected players
- Processes core game logic, including:Movement and velocity updatesHealth and damage calculations
- Movement and velocity updates
- Health and damage calculations
- Applies physics and collision detection
- Updates the in-memory game state
- Computes a  **state delta**  and sends it to all WebSocket servers managing players in that session:

```
{
  "type": "stateUpdate",
  "tick": 1441,
  "players": [
    { "id": "p789", "x": 55, "y": 89, "health": 92 },
    { "id": "p231", "x": 52, "y": 91, "health": 80 }
  ],
  "bullets": [...],
  "timestamp": 1716600012
}
```

WebSocket nodes forward these updates to the connected clients.

Clients use these updates to  **render the game world**  and  **predict motion** .

With efficient engineering practices such as:

- **Event loops**  and  **non-blocking I/O**  (e.g., Node.js, Netty)
- **Spatial partitioning**  (e.g., quadtrees or grid-based zoning) to broadcast updates only to nearby players
- **Delta encoding**  to reduce payload size

...a single WebSocket server can support  **thousands of concurrent players**  across multiple game sessions with  **sub-100ms latency** .

# 3. Real-Time Social Media Feeds

On modern social media platforms, users expect to see  **new posts, likes, comments, and alerts the moment they happen** .

But without a real-time mechanism, the client must constantly  **poll the server every few seconds**  to check for updates. This results in:

- High latency for the user (delayed updates)
- Unnecessary load on servers and wasted bandwidth

**WebSockets**  enable servers to push these updates instantaneously to connected clients, creating a live feed experience.

To support  **millions of concurrent users** , platforms implement:

- **Dedicated WebSocket Servers**  to manage persistent connections
- **Sticky sessions**  via load balancers (ensuring a user reconnects to the same server)

## System Design Overview

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e1ef0718-3f7c-467d-93c7-8f5a433dee07_2134x1212.png)](https://substackcdn.com/image/fetch/$s_!72PC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe1ef0718-3f7c-467d-93c7-8f5a433dee07_2134x1212.png)

- **Event Source (Like/Comment):** Captures user interactions (e.g., likes, comments, follows) and generates structured events.
- **Message Queue:** Buffers and routes events asynchronously to downstream services for processing (e.g., Kafka, Redis Streams).
- **Event Broadcaster:** Consumes events from the queue, determines target users, and routes updates to the appropriate WebSocket servers.
- **WebSocket Servers:** Maintain persistent client connections and deliver real-time feed updates to online users.
- **Connection Registry:** Tracks which users are connected and maps them to their corresponding WebSocket server nodes.

## How It Works

#### 1. Feed Channel Modeling

Each user is assigned a  **dedicated feed and notification channel** , enabling personalized real-time updates.

**Examples:**

- feed:user:alice – main activity feed
- notifications:user:alice – direct notifications (likes, comments, follows)

The system may also support  **shared or topic-based channels** :

- feed:topic:ai – AI-related posts
- feed:hashtag:tech – tech hashtag activity
- group:12345:activity – group or community feed

#### 2. WebSocket Connection & Subscription Flow

When a user opens the app:

- The client establishes a  **WebSocket connection**  to the WebSocket Gateway.
- After authentication, it sends a subscribe message to specify its feed channels:

```
{
  "action": "subscribe",
  "channels": [
    "feed:user:alice",
    "notifications:user:alice"
  ]
}
```
- The WebSocket server registers these channel subscriptions in a  **connection registry** , typically in an in-memory registry or  **a distributed cache (e.g., Redis).**

#### 3. Event Generation & Push

When a new event occurs such as a comment on a user’s post:

- The backend service (e.g., CommentService) emits the event:

```
{
  "event": "new_comment",
  "postId": "abc123",
  "commentId": "xyz789",
  "byUser": "alice",
  "toUser": "bob"
}
```

- The event is  **published to a message broker**  (e.g., Kafka, Redis Pub/Sub).
- The Event broadcaster service  **consumes the event**  and:Looks up the WebSocket server holding the user’s connectionRoutes the event to that server, which pushes it to the correct client over the live WebSocket connection
- Looks up the WebSocket server holding the user’s connection
- Routes the event to that server, which pushes it to the correct client over the live WebSocket connection

The client receives the message and updates the UI immediately (e.g., displaying a toast notification or updating the comment count in real time).

# 4. Collaborative Editing Tools

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
