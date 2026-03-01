export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type DesignType = 'LLD' | 'HLD' | 'Both'

export interface DesignQuestion {
    slug: string
    title: string
    type: DesignType
    difficulty: Difficulty
    category: string
    tags: string[]
    description: string
    hldSteps?: string[]
    lldSteps?: string[]
    hasSimulation?: boolean
}

export interface QuestionCategory {
    id: string
    name: string
    icon: string
    questions: DesignQuestion[]
    tab: 'LLD' | 'HLD'
}

// --- SHARED QUESTIONS DEFINITIONS ---
const Q_AUTOCOMPLETE: DesignQuestion = { slug: 'design-autocomplete', title: 'Design Autocomplete System', type: 'Both', difficulty: 'Easy', category: 'Search', tags: ['Trie', 'Top-K', 'Real-time'], description: 'Design a real-time search suggestion system with frequency ranking.', hasSimulation: true }
const Q_SEARCH_ENGINE: DesignQuestion = { slug: 'design-search-engine', title: 'Design Simple Search Engine', type: 'Both', difficulty: 'Medium', category: 'Search', tags: ['Index', 'Search'], description: 'Design a simple search engine indexer and ranker.', hasSimulation: true }
const Q_SPOTIFY: DesignQuestion = { slug: 'design-spotify', title: 'Design Spotify', type: 'Both', difficulty: 'Hard', category: 'Media', tags: ['Streaming', 'CDN'], description: 'Design a music streaming platform with playlist management and recommendation engine.' }
const Q_LINKEDIN: DesignQuestion = { slug: 'design-linkedin', title: 'Design LinkedIn', type: 'Both', difficulty: 'Hard', category: 'Social', tags: ['Graph', 'Feed'], description: 'Design a professional network with profile graph and job search.' }
const Q_NOTIFICATION: DesignQuestion = { slug: 'design-notification-system', title: 'Design Notification System', type: 'Both', difficulty: 'Easy', category: 'Messaging', tags: ['Multi-channel', 'Kafka', 'Retry'], description: 'Design a persistent notification engine across Push, Email, and SMS.', hasSimulation: true }
const Q_PUBSUB: DesignQuestion = { slug: 'design-pub-sub', title: 'Design Pub-Sub System', type: 'Both', difficulty: 'Medium', category: 'Messaging', tags: ['Kafka', 'Message-Broker'], description: 'Design a scalable message broker with topic partitions.', hasSimulation: true }
const Q_CHAT_APP: DesignQuestion = { slug: 'design-chat-application', title: 'Design Chat Application', type: 'Both', difficulty: 'Medium', category: 'Messaging', tags: ['WebSocket', 'Real-time'], description: 'Design a real-time chat application with message delivery and group chat.', hasSimulation: true }
const Q_STOCK_EXCHANGE: DesignQuestion = { slug: 'design-stock-exchange', title: 'Design Online Stock Exchange', type: 'Both', difficulty: 'Hard', category: 'Finance', tags: ['Matching-Engine', 'Low-Latency'], description: 'Design a high-frequency trading platform with order matching engine.' }
const Q_MOVIE_BOOKING: DesignQuestion = { slug: 'design-movie-booking', title: 'Design Movie Booking System', type: 'Both', difficulty: 'Hard', category: 'Ecommerce', tags: ['Locking', 'Concurrency'], description: 'Design concurrent cinema seat booking system with payment integration.' }
const Q_AUCTION_SYSTEM: DesignQuestion = { slug: 'design-auction-system', title: 'Design Online Auction System', type: 'Both', difficulty: 'Hard', category: 'Ecommerce', tags: ['Real-time', 'Bidding'], description: 'Design a real-time auction platform with bid collision handling.' }
const Q_URL_SHORTENER: DesignQuestion = { slug: 'design-url-shortener', title: 'Design URL Shortener', type: 'Both', difficulty: 'Medium', category: 'Infra', tags: ['Hashing', 'Base62'], description: 'Design a high-scale URL shortening service like Bit.ly.', hasSimulation: true }
const Q_RATE_LIMITER: DesignQuestion = { slug: 'design-rate-limiter', title: 'Design Rate Limiter', type: 'Both', difficulty: 'Medium', category: 'Infra', tags: ['Token Bucket', 'Distributed'], description: 'Design a distributed rate limiter for high-traffic APIs.', hasSimulation: true }
const Q_TASK_SCHEDULER: DesignQuestion = { slug: 'design-task-scheduler', title: 'Design Task Scheduler', type: 'Both', difficulty: 'Hard', category: 'Infra', tags: ['Cron', 'Distributed'], description: 'Design a distributed task scheduler handling delayed and recurring jobs.' }
const Q_AMAZON: DesignQuestion = { slug: 'design-amazon', title: 'Design Amazon', type: 'Both', difficulty: 'Hard', category: 'Ecommerce', tags: ['Microservices', 'Scale'], description: 'Design a full-scale e-commerce platform covering catalog, cart, and checkout.' }
const Q_LIKES_COUNTING: DesignQuestion = { slug: 'design-likes-counting', title: 'Design Likes Counting System', type: 'Both', difficulty: 'Medium', category: 'Social', tags: ['Atomic', 'Redis'], description: 'Design a system to handle billions of likes on viral posts.' }
const Q_TINDER: DesignQuestion = { slug: 'design-tinder', title: 'Design Tinder', type: 'Both', difficulty: 'Medium', category: 'Social', tags: ['Geo-Sharding', 'Matching'], description: 'Design a location-based matching and swiping system.' }
const Q_AIRBNB: DesignQuestion = { slug: 'design-airbnb', title: 'Design Airbnb', type: 'Both', difficulty: 'Medium', category: 'Ecommerce', tags: ['Geo-Search', 'Booking'], description: 'Design a vacation rental marketplace with spatial search.' }

export const QUESTION_CATEGORIES: QuestionCategory[] = [
    // =========================================================================
    // LLD TABS (9 Sections, 40 Questions)
    // =========================================================================

    {
        id: 'lld-games',
        name: 'Games & Puzzles',
        icon: '🎮',
        tab: 'LLD',
        questions: [
            { slug: 'design-tic-tac-toe', title: 'Design Tic Tac Toe', type: 'LLD', difficulty: 'Easy', category: 'Games', tags: ['OOP', 'Grid'], description: 'Design a Tic Tac Toe game supporting 2 players on an NxN board.', hasSimulation: true },
            { slug: 'design-snake-and-ladder', title: 'Design Snake and Ladder Game', type: 'LLD', difficulty: 'Easy', category: 'Games', tags: ['OOP', 'Board'], description: 'Design a Snake and Ladder game with snakes, ladders, and dice.', hasSimulation: true },
            { slug: 'design-minesweeper', title: 'Design Minesweeper Game', type: 'LLD', difficulty: 'Medium', category: 'Games', tags: ['OOP', 'Recursion'], description: 'Design Minesweeper with cell reveal, flood-fill, and mine placement.', hasSimulation: true },
        ]
    },
    {
        id: 'lld-ds-search',
        name: 'Data Structures & Search',
        icon: '🔍',
        tab: 'LLD',
        questions: [
            { slug: 'design-lru-cache', title: 'Design LRU Cache', type: 'LLD', difficulty: 'Easy', category: 'DS', tags: ['Cache', 'HashMap'], description: 'Design an LRU cache with O(1) get/put operations.', hasSimulation: true },
            { slug: 'design-bloom-filter', title: 'Design Bloom Filter', type: 'LLD', difficulty: 'Easy', category: 'DS', tags: ['Hash', 'Probabilistic'], description: 'Design a space-efficient membership testing structure.', hasSimulation: true },
            Q_AUTOCOMPLETE,
            Q_SEARCH_ENGINE,
        ]
    },
    {
        id: 'lld-states',
        name: 'Managing States',
        icon: '⚙️',
        tab: 'LLD',
        questions: [
            { slug: 'design-atm', title: 'Design ATM', type: 'LLD', difficulty: 'Medium', category: 'State', tags: ['State-Pattern', 'OOP'], description: 'Design an ATM machine using the State pattern.', hasSimulation: true },
            { slug: 'design-vending-machine', title: 'Design Vending Machine', type: 'LLD', difficulty: 'Medium', category: 'State', tags: ['State-Pattern', 'OOP'], description: 'Design a vending machine with product selection and payment.', hasSimulation: true },
            { slug: 'design-elevator', title: 'Design Elevator System', type: 'LLD', difficulty: 'Medium', category: 'State', tags: ['Scheduler', 'SCAN'], description: 'Design an elevator controller for a building.', hasSimulation: true },
            { slug: 'design-traffic-control', title: 'Design Traffic Control System', type: 'LLD', difficulty: 'Medium', category: 'State', tags: ['Concurrency', 'State'], description: 'Design a traffic light control system managed by a state machine.', hasSimulation: true },
            { slug: 'design-coffee-machine', title: 'Design Coffee Vending Machine', type: 'LLD', difficulty: 'Hard', category: 'State', tags: ['OOP', 'Recipe'], description: 'Design a coffee vending machine with ingredient management.', hasSimulation: true },
        ]
    },
    {
        id: 'lld-management',
        name: 'Management Systems',
        icon: '🏢',
        tab: 'LLD',
        questions: [
            { slug: 'design-parking-lot', title: 'Design Parking Lot', type: 'LLD', difficulty: 'Easy', category: 'Management', tags: ['OOP', 'Strategy'], description: 'Design a multi-floor parking lot system.', hasSimulation: true },
            { slug: 'design-task-manager', title: 'Design Task Management System', type: 'LLD', difficulty: 'Easy', category: 'Management', tags: ['OOP', 'Observer'], description: 'Design a Trello-like task management board.', hasSimulation: true },
            { slug: 'design-inventory', title: 'Design Inventory Management System', type: 'LLD', difficulty: 'Medium', category: 'Management', tags: ['OOP', 'Stock-Tracking'], description: 'Design a system to track stock levels and reorder triggers.' },
            { slug: 'design-library', title: 'Design Library Management System', type: 'LLD', difficulty: 'Medium', category: 'Management', tags: ['OOP', 'Library'], description: 'Design a library handling book catalog and reservations.' },
            { slug: 'design-restaurant', title: 'Design Restaurant Management System', type: 'LLD', difficulty: 'Hard', category: 'Management', tags: ['OOP', 'Order-Processing'], description: 'Design a restaurant system for table booking and order management.' },
        ]
    },
    {
        id: 'lld-social',
        name: 'Social & Content Platforms',
        icon: '📱',
        tab: 'LLD',
        questions: [
            { slug: 'design-stackoverflow', title: 'Design Stack Overflow', type: 'Both', difficulty: 'Medium', category: 'Social', tags: ['OOP', 'Search'], description: 'Design a Q&A platform with reputation and voting.' },
            { slug: 'design-social-network', title: 'Design a Social Network', type: 'Both', difficulty: 'Medium', category: 'Social', tags: ['Graph', 'Feed'], description: 'Design a social networking platform for connection and feeds.' },
            { slug: 'design-learning-platform', title: 'Design Learning Platform', type: 'Both', difficulty: 'Medium', category: 'Social', tags: ['Course', 'Video'], description: 'Design an online learning platform with progress tracking.' },
            { slug: 'design-cricinfo', title: 'Design Cricinfo', type: 'LLD', difficulty: 'Hard', category: 'Social', tags: ['Real-time', 'Scoreboard'], description: 'Design a real-time sports score prediction and update system.' },
            Q_LINKEDIN,
            Q_SPOTIFY,
        ]
    },
    {
        id: 'lld-comm',
        name: 'Communication & Messaging',
        icon: '💬',
        tab: 'LLD',
        questions: [
            Q_NOTIFICATION,
            Q_PUBSUB,
            Q_CHAT_APP,
        ]
    },
    {
        id: 'lld-financial',
        name: 'Financial & Payment Systems',
        icon: '💳',
        tab: 'LLD',
        questions: [
            { slug: 'design-splitwise', title: 'Design Splitwise', type: 'LLD', difficulty: 'Medium', category: 'Finance', tags: ['Algorithm', 'Graph'], description: 'Design an expense sharing app with debt simplification.' },
            { slug: 'design-payment-gateway', title: 'Design Payment Gateway', type: 'Both', difficulty: 'Medium', category: 'Finance', tags: ['API', 'Idempotency'], description: 'Design a payment gateway supporting multiple methods and retries.' },
            Q_STOCK_EXCHANGE,
        ]
    },
    {
        id: 'lld-ecommerce',
        name: 'E-commerce & Booking Systems',
        icon: '🛒',
        tab: 'LLD',
        questions: [
            Q_AMAZON,
            Q_MOVIE_BOOKING,
            Q_AUCTION_SYSTEM,
            { slug: 'design-food-delivery', title: 'Design Online Food Delivery Service', type: 'Both', difficulty: 'Hard', category: 'Ecommerce', tags: ['Geo', 'Order-Flow'], description: 'Design the LLD for a food delivery platform.' },
            { slug: 'design-ride-hailing', title: 'Design Ride Hailing Service', type: 'Both', difficulty: 'Hard', category: 'Ecommerce', tags: ['Matching', 'Geo'], description: 'Design real-time driver matching and location tracking.' },
        ]
    },
    {
        id: 'lld-infra',
        name: 'Developer Tools & Infrastructure',
        icon: '🛠️',
        tab: 'LLD',
        questions: [
            Q_URL_SHORTENER,
            { slug: 'design-logging', title: 'Design Logging Framework', type: 'LLD', difficulty: 'Medium', category: 'Infra', tags: ['Observer', 'Strategy'], description: 'Design a logging framework with levels and appenders.' },
            Q_RATE_LIMITER,
            { slug: 'design-in-memory-fs', title: 'Design In Memory File System', type: 'LLD', difficulty: 'Hard', category: 'Infra', tags: ['Tree', 'OOP'], description: 'Design an in-memory file system with file and directory support.' },
            { slug: 'design-vcs', title: 'Design Version Control System', type: 'Both', difficulty: 'Hard', category: 'Infra', tags: ['Storage', 'Hashing'], description: 'Design the core logic for a git-like version control system.' },
            Q_TASK_SCHEDULER,
        ]
    },

    // =========================================================================
    // HLD TABS (12 Sections, 55 Questions)
    // =========================================================================

    {
        id: 'hld-basic',
        name: 'Basic Questions',
        icon: '🧊',
        tab: 'HLD',
        questions: [
            Q_URL_SHORTENER,
            { slug: 'hld-pastebin', title: 'Design Pastebin', type: 'HLD', difficulty: 'Easy', category: 'Basic', tags: ['NoSQL', 'S3'], description: 'Design a high-scale text storage service.' },
            Q_RATE_LIMITER,
        ]
    },
    {
        id: 'hld-rtc',
        name: 'Real-Time Communication',
        icon: '💬',
        tab: 'HLD',
        questions: [
            { slug: 'hld-whatsapp', title: 'Design WhatsApp', type: 'HLD', difficulty: 'Medium', category: 'RTC', tags: ['WebSockets', 'XMPP'], description: 'Design an end-to-end encrypted messaging service.' },
            { slug: 'hld-slack', title: 'Design Slack', type: 'HLD', difficulty: 'Medium', category: 'RTC', tags: ['Presence', 'Channels'], description: 'Design a professional collaboration platform.' },
            { slug: 'hld-live-comments', title: 'Design Live Comments', type: 'HLD', difficulty: 'Medium', category: 'RTC', tags: ['Redis', 'Fan-out'], description: 'Design a system to handle high-traffic live stream comments.' },
            { slug: 'hld-google-docs', title: 'Design Google Docs', type: 'HLD', difficulty: 'Hard', category: 'RTC', tags: ['OT', 'CRDT'], description: 'Design a collaborative real-time document editor.' },
            { slug: 'hld-zoom', title: 'Design Zoom', type: 'HLD', difficulty: 'Hard', category: 'RTC', tags: ['WebRTC', 'UDP'], description: 'Design a video conferencing tool for millions.' },
        ]
    },
    {
        id: 'hld-social',
        name: 'Social Media Systems',
        icon: '📱',
        tab: 'HLD',
        questions: [
            { slug: 'hld-instagram', title: 'Design Instagram', type: 'HLD', difficulty: 'Medium', category: 'Social', tags: ['Storage', 'Ranking'], description: 'Design a photo-sharing app with feed generation.' },
            { slug: 'hld-facebook-feed', title: 'Design Facebook News Feed', type: 'HLD', difficulty: 'Medium', category: 'Social', tags: ['Graph', 'Feed'], description: 'Design a high-scale news feed ranking system.' },
            { slug: 'hld-tiktok', title: 'Design TikTok', type: 'HLD', difficulty: 'Medium', category: 'Social', tags: ['Video', 'Discovery'], description: 'Design a video discovery recommendation engine.' },
            { slug: 'hld-reddit', title: 'Design Reddit', type: 'HLD', difficulty: 'Medium', category: 'Social', tags: ['Voting', 'Cache'], description: 'Design Reddit with subreddit management and voting.' },
            Q_TINDER,
            Q_LIKES_COUNTING,
        ]
    },
    {
        id: 'hld-streaming',
        name: 'Media Streaming & Delivery',
        icon: '🎥',
        tab: 'HLD',
        questions: [
            Q_SPOTIFY,
            { slug: 'hld-youtube', title: 'Design YouTube', type: 'HLD', difficulty: 'Medium', category: 'Streaming', tags: ['Encoding', 'CDN'], description: 'Design a video hosting platform with transcoding.' },
            { slug: 'hld-netflix', title: 'Design Netflix', type: 'HLD', difficulty: 'Medium', category: 'Streaming', tags: ['OpenConnect', 'Quality'], description: 'Design a global content delivery network for movies.' },
            { slug: 'hld-google-drive', title: 'Design Google Drive', type: 'HLD', difficulty: 'Medium', category: 'Streaming', tags: ['Sync', 'Storage'], description: 'Design a cloud storage and sync service.' },
            { slug: 'hld-gmail', title: 'Design Gmail', type: 'HLD', difficulty: 'Hard', category: 'Streaming', tags: ['Email', 'Search'], description: 'Design a multi-petabyte email hosting system.' },
            { slug: 'hld-twitch', title: 'Design Twitch', type: 'HLD', difficulty: 'Hard', category: 'Streaming', tags: ['RTMP', 'Live'], description: 'Design sub-second latency live broadcasting.' },
        ]
    },
    {
        id: 'hld-geo',
        name: 'Location-Based Services',
        icon: '📍',
        tab: 'HLD',
        questions: [
            Q_AIRBNB,
            { slug: 'hld-doordash', title: 'Design DoorDash/Swiggy', type: 'HLD', difficulty: 'Medium', category: 'Geo', tags: ['Matching', 'Tracking'], description: 'Design a food delivery system orchestration.' },
            Q_TINDER,
            { slug: 'hld-uber', title: 'Design Uber', type: 'HLD', difficulty: 'Hard', category: 'Geo', tags: ['Surge', 'Geo-Sharding'], description: 'Design high-concurrency driver matching.' },
            { slug: 'hld-google-maps', title: 'Design Google Maps', type: 'HLD', difficulty: 'Hard', category: 'Geo', tags: ['Graphs', 'Tiles'], description: 'Design a web-scale mapping and routing service.' },
        ]
    },
    {
        id: 'hld-search-agg',
        name: 'Search & Aggregation Systems',
        icon: '🔎',
        tab: 'HLD',
        questions: [
            Q_AUTOCOMPLETE,
            { slug: 'hld-news-aggregator', title: 'Design News Aggregator', type: 'HLD', difficulty: 'Medium', category: 'Search', tags: ['Crawler', 'Flink'], description: 'Design a personalized news aggregator.' },
            { slug: 'hld-web-crawler', title: 'Design a Web Crawler', type: 'HLD', difficulty: 'Medium', category: 'Search', tags: ['Distributed', 'BFS'], description: 'Design a crawler to index billions of pages.' },
            { slug: 'hld-google-search', title: 'Design Google Search', type: 'HLD', difficulty: 'Hard', category: 'Search', tags: ['Index', 'PageRank'], description: 'Design the largest search engine in the world.' },
            { slug: 'hld-ad-click', title: 'Design Ad Click Aggregator', type: 'HLD', difficulty: 'Hard', category: 'Search', tags: ['Real-time', 'Billing'], description: 'Design ad-click analytics for real-time reporting.' },
        ]
    },
    {
        id: 'hld-ecommerce',
        name: 'E-commerce & Marketplace',
        icon: '🛒',
        tab: 'HLD',
        questions: [
            { slug: 'hld-amazon-eco', title: 'Design Amazon E-commerce', type: 'HLD', difficulty: 'Medium', category: 'Ecommerce', tags: ['Scale', 'Microservices'], description: 'Design high-availability ecommerce architecture.' },
            { slug: 'hld-shopify', title: 'Design Shopify', type: 'HLD', difficulty: 'Medium', category: 'Ecommerce', tags: ['Multi-tenant', 'Stores'], description: 'Design an ecommerce builder for merchants.' },
            Q_AIRBNB,
            { slug: 'hld-flash-sale', title: 'Design Flash Sale System', type: 'HLD', difficulty: 'Hard', category: 'Ecommerce', tags: ['Burst', 'Lua'], description: 'Design for peak traffic during shopping sales.' },
            { slug: 'hld-auction-eco', title: 'Design Online Auction System', type: 'HLD', difficulty: 'Hard', category: 'Ecommerce', tags: ['Bidding', 'Latency'], description: 'Design real-time bid processing.' },
            Q_MOVIE_BOOKING,
        ]
    },
    {
        id: 'hld-payments',
        name: 'Payment & Financial Systems',
        icon: '💳',
        tab: 'HLD',
        questions: [
            { slug: 'hld-payment-system', title: 'Design Payment System', type: 'HLD', difficulty: 'Medium', category: 'Finance', tags: ['Atomic', 'Idempotency'], description: 'Design fault-tolerant payment flows.' },
            { slug: 'hld-digital-wallet', title: 'Design Digital Wallet', type: 'HLD', difficulty: 'Hard', category: 'Finance', tags: ['Ledger', 'Consistency'], description: 'Design internal balance and ledger tracking.' },
            Q_STOCK_EXCHANGE,
        ]
    },
    {
        id: 'hld-infra',
        name: 'Distributed Infrastructure',
        icon: '🧱',
        tab: 'HLD',
        questions: [
            { slug: 'hld-load-balancer', title: 'Design Load Balancer', type: 'HLD', difficulty: 'Medium', category: 'Infra', tags: ['L4/L7', 'Balancing'], description: 'Design request distribution for clusters.' },
            { slug: 'hld-api-gateway', title: 'Design API Gateway', type: 'HLD', difficulty: 'Medium', category: 'Infra', tags: ['Auth', 'Gateway'], description: 'Design a unified entry for microservices.' },
            Q_RATE_LIMITER,
            Q_NOTIFICATION,
            { slug: 'hld-kv-store', title: 'Design Key-Value Store', type: 'HLD', difficulty: 'Hard', category: 'Infra', tags: ['Paxos', 'Consistency'], description: 'Design distributed storage like Cassandra.' },
            { slug: 'hld-dist-cache', title: 'Design Distributed Cache', type: 'HLD', difficulty: 'Hard', category: 'Infra', tags: ['Redis', 'Scaling'], description: 'Design multi-node cache systems.' },
            { slug: 'hld-cdn', title: 'Design a CDN', type: 'HLD', difficulty: 'Hard', category: 'Infra', tags: ['Edge', 'Anycast'], description: 'Design a content delivery network edge.' },
            { slug: 'hld-obj-storage', title: 'Design Object Storage (S3)', type: 'HLD', difficulty: 'Hard', category: 'Infra', tags: ['Erasure', 'Storage'], description: 'Design petabyte-scale binary storage.' },
            { slug: 'hld-msg-queue', title: 'Design Message Queue', type: 'HLD', difficulty: 'Hard', category: 'Infra', tags: ['Kafka', 'Logs'], description: 'Design high-throughput persistent queues.' },
            { slug: 'hld-tsdb', title: 'Design Time Series Database', type: 'HLD', difficulty: 'Hard', category: 'Infra', tags: ['Time-series', 'Compression'], description: 'Design storage for high-frequency metrics.' },
            { slug: 'hld-locking-svc', title: 'Design Distributed Locking Service', type: 'HLD', difficulty: 'Hard', category: 'Infra', tags: ['Consensus', 'Zookeeper'], description: 'Design coordination for shared resources.' },
        ]
    },
    {
        id: 'hld-ranking',
        name: 'Counting & Ranking Systems',
        icon: '🏆',
        tab: 'HLD',
        questions: [
            Q_LIKES_COUNTING,
            { slug: 'hld-leaderboard', title: 'Design Real-time Leaderboard', type: 'HLD', difficulty: 'Medium', category: 'Analytics', tags: ['Redis', 'SortedSet'], description: 'Design real-time ranking at massive scale.' },
            { slug: 'hld-top-k', title: 'Design Top K System', type: 'HLD', difficulty: 'Hard', category: 'Analytics', tags: ['CMS', 'Heavy-Hitters'], description: 'Identify top trending items in real-time streams.' },
        ]
    },
    {
        id: 'hld-async',
        name: 'Asynchronous Systems',
        icon: '⚡',
        tab: 'HLD',
        questions: [
            Q_NOTIFICATION,
            { slug: 'hld-job-scheduler', title: 'Design Job Scheduler', type: 'HLD', difficulty: 'Medium', category: 'Async', tags: ['Cron', 'Delayed'], description: 'Design distributed task scheduling.' },
            { slug: 'hld-cicd', title: 'Design CI/CD Pipeline', type: 'HLD', difficulty: 'Medium', category: 'Async', tags: ['Automation', 'Workflows'], description: 'Design an automated build and deploy system.' },
            { slug: 'hld-monitoring', title: 'Design Monitoring & Alerting System', type: 'HLD', difficulty: 'Medium', category: 'Async', tags: ['TSDB', 'Prometheus'], description: 'Design real-time observability for infrastructure.' },
        ]
    },
    {
        id: 'hld-specialized',
        name: 'Specialized Systems',
        icon: '🎯',
        tab: 'HLD',
        questions: [
            { slug: 'hld-leetcode-special', title: 'Design LeetCode', type: 'HLD', difficulty: 'Medium', category: 'Specialized', tags: ['Execution', 'Sandbox'], description: 'Design online code execution judges.' },
            { slug: 'hld-calendar', title: 'Design Calendar System', type: 'HLD', difficulty: 'Hard', category: 'Specialized', tags: ['Recurring', 'Availability'], description: 'Design Google Calendar with complex routing.' },
            { slug: 'hld-chess', title: 'Design Online Chess', type: 'HLD', difficulty: 'Hard', category: 'Specialized', tags: ['Real-time', 'FSM'], description: 'Design a real-time multiplayer chess platform.' },
        ]
    }
]

export function getQuestionBySlug(slug: string): DesignQuestion | undefined {
    for (const cat of QUESTION_CATEGORIES) {
        const q = cat.questions.find(q => q.slug === slug)
        if (q) return q
    }
    return undefined
}

export const ALL_QUESTIONS: DesignQuestion[] = QUESTION_CATEGORIES.flatMap(c => c.questions)
