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
}

export interface QuestionCategory {
    id: string
    name: string
    icon: string
    questions: DesignQuestion[]
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
    {
        id: 'games-puzzles',
        name: 'Games & Puzzles',
        icon: '🎮',
        questions: [
            { slug: 'design-tic-tac-toe', title: 'Design Tic Tac Toe', type: 'LLD', difficulty: 'Easy', category: 'Games & Puzzles', tags: ['OOP', 'Grid', 'Game'], description: 'Design a Tic Tac Toe game supporting 2 players on an NxN board. Handle win detection, draw conditions, and game reset.' },
            { slug: 'design-snake-and-ladder', title: 'Design Snake and Ladder Game', type: 'LLD', difficulty: 'Easy', category: 'Games & Puzzles', tags: ['OOP', 'Board Game'], description: 'Design a Snake and Ladder game. Model the board, players, dice, snakes, and ladders with proper OOP design.' },
            { slug: 'design-minesweeper', title: 'Design Minesweeper Game', type: 'LLD', difficulty: 'Medium', category: 'Games & Puzzles', tags: ['OOP', 'Recursion', 'Grid'], description: 'Design a Minesweeper game with mine placement, cell reveal, flood-fill reveal, and flag toggling logic.' },
        ]
    },
    {
        id: 'data-structures-search',
        name: 'Data Structures & Search',
        icon: '🔍',
        questions: [
            { slug: 'design-lru-cache', title: 'Design LRU Cache', type: 'LLD', difficulty: 'Easy', category: 'Data Structures & Search', tags: ['Cache', 'HashMap', 'LinkedList'], description: 'Design an LRU (Least Recently Used) cache with O(1) get/put. Use a HashMap + doubly-linked list.' },
            { slug: 'design-bloom-filter', title: 'Design Bloom Filter', type: 'LLD', difficulty: 'Easy', category: 'Data Structures & Search', tags: ['Probabilistic', 'Hash'], description: 'Design a Bloom Filter data structure for space-efficient membership testing. Handle false positives correctly.' },
            { slug: 'design-autocomplete', title: 'Design Autocomplete System', type: 'Both', difficulty: 'Medium', category: 'Data Structures & Search', tags: ['Trie', 'Ranking', 'Search'], description: 'Design a real-time autocomplete system. Cover Trie data structure for prefix search and ranking by frequency.' },
            { slug: 'design-search-engine', title: 'Design Simple Search Engine', type: 'HLD', difficulty: 'Medium', category: 'Data Structures & Search', tags: ['Inverted Index', 'Crawling', 'Ranking'], description: 'Design a web search engine covering crawling, indexing (inverted index), query processing, and ranking.' },
        ]
    },
    {
        id: 'managing-states',
        name: 'Managing States',
        icon: '⚙️',
        questions: [
            { slug: 'design-atm', title: 'Design ATM', type: 'LLD', difficulty: 'Medium', category: 'Managing States', tags: ['State Machine', 'OOP', 'Banking'], description: 'Design an ATM machine using State pattern. Model states: Idle, CardInserted, Authenticated, TransactionInProgress.' },
            { slug: 'design-vending-machine', title: 'Design Vending Machine', type: 'LLD', difficulty: 'Medium', category: 'Managing States', tags: ['State Machine', 'OOP'], description: 'Design a Vending Machine with product selection, payment processing, change calculation, and refill using State pattern.' },
            { slug: 'design-elevator', title: 'Design Elevator System', type: 'LLD', difficulty: 'Medium', category: 'Managing States', tags: ['Scheduler', 'OOP', 'State'], description: 'Design an elevator control system for a building. Handle request scheduling (SCAN/LOOK algorithm).' },
            { slug: 'design-traffic-control', title: 'Design Traffic Control System', type: 'LLD', difficulty: 'Medium', category: 'Managing States', tags: ['State Machine', 'Concurrency'], description: 'Design a traffic light control system managing multiple intersections with configurable timing and pedestrian signals.' },
            { slug: 'design-coffee-machine', title: 'Design Coffee Vending Machine', type: 'LLD', difficulty: 'Easy', category: 'Managing States', tags: ['OOP', 'State Machine'], description: 'Design a coffee vending machine. Model ingredients, recipes, payment, and dispensing logic with proper OOP.' },
        ]
    },
    {
        id: 'management-systems',
        name: 'Management Systems',
        icon: '🏢',
        questions: [
            { slug: 'design-parking-lot', title: 'Design Parking Lot', type: 'LLD', difficulty: 'Easy', category: 'Management Systems', tags: ['OOP', 'Factory', 'Strategy'], description: 'Design a multi-floor parking lot system. Model vehicles, spots, floors, tickets, and payment with SOLID principles.' },
            { slug: 'design-task-management', title: 'Design Task Management System', type: 'LLD', difficulty: 'Easy', category: 'Management Systems', tags: ['OOP', 'Observer'], description: 'Design a task management system (Trello-like). Model boards, lists, cards, comments, and user assignments.' },
            { slug: 'design-inventory', title: 'Design Inventory Management System', type: 'Both', difficulty: 'Medium', category: 'Management Systems', tags: ['OOP', 'Database', 'API'], description: 'Design an inventory management system with stock tracking, reorder triggers, multi-warehouse support.' },
            { slug: 'design-library', title: 'Design Library Management System', type: 'LLD', difficulty: 'Medium', category: 'Management Systems', tags: ['OOP', 'Search', 'Reservation'], description: 'Design a library system handling book catalog, member management, checkout, returns, fines, and reservations.' },
            { slug: 'design-hospital', title: 'Design Hospital Management System', type: 'HLD', difficulty: 'Hard', category: 'Management Systems', tags: ['HLD', 'Microservices', 'Database'], description: 'Design a hospital management system covering patient records, appointments, billing, pharmacy, and lab reports.' },
        ]
    },
    {
        id: 'social-content',
        name: 'Social & Content Platforms',
        icon: '📱',
        questions: [
            { slug: 'design-stackoverflow', title: 'Design Stack Overflow', type: 'HLD', difficulty: 'Medium', category: 'Social & Content Platforms', tags: ['HLD', 'Search', 'Voting'], description: 'Design a Q&A platform like Stack Overflow. Cover user reputation, voting, search, tagging, and notifications.' },
            { slug: 'design-social-network', title: 'Design Social Network', type: 'HLD', difficulty: 'Medium', category: 'Social & Content Platforms', tags: ['HLD', 'Graph', 'Feed'], description: 'Design a social network (Facebook-like). Cover user profiles, friend graphs, news feed, and privacy settings.' },
            { slug: 'design-learning-platform', title: 'Design Learning Platform', type: 'HLD', difficulty: 'Medium', category: 'Social & Content Platforms', tags: ['HLD', 'Video', 'Progress'], description: 'Design an online learning platform (Udemy-like). Cover course catalog, video streaming, progress tracking, and certificates.' },
            { slug: 'design-github', title: 'Design GitHub', type: 'HLD', difficulty: 'Hard', category: 'Social & Content Platforms', tags: ['HLD', 'Git', 'Storage'], description: 'Design a code hosting platform like GitHub. Cover repository storage, pull requests, CI/CD pipeline hooks, and access control.' },
            { slug: 'design-linkedin', title: 'Design LinkedIn', type: 'HLD', difficulty: 'Hard', category: 'Social & Content Platforms', tags: ['HLD', 'Graph', 'Search', 'Feed'], description: 'Design a professional network like LinkedIn. Cover profile graph, job search, feed ranking, and connection recommendations.' },
            { slug: 'design-spotify', title: 'Design Spotify', type: 'HLD', difficulty: 'Hard', category: 'Social & Content Platforms', tags: ['HLD', 'Streaming', 'Recommendation'], description: 'Design Spotify — music streaming with playlist management, offline download, recommendation engine, and podcasts.' },
        ]
    },
    {
        id: 'communication-messaging',
        name: 'Communication & Messaging',
        icon: '💬',
        questions: [
            { slug: 'design-notification-system', title: 'Design Notification System', type: 'HLD', difficulty: 'Easy', category: 'Communication & Messaging', tags: ['HLD', 'Kafka', 'Push'], description: 'Design a multi-channel notification system (push, email, SMS) with retries, user preferences, and rate limiting.' },
            { slug: 'design-pub-sub', title: 'Design Pub-Sub System', type: 'HLD', difficulty: 'Medium', category: 'Communication & Messaging', tags: ['HLD', 'Kafka', 'Messaging'], description: 'Design a Publish-Subscribe messaging system like Kafka. Cover topics, partitions, consumer groups, and delivery guarantees.' },
            { slug: 'design-chat-app', title: 'Design Chat Application', type: 'HLD', difficulty: 'Medium', category: 'Communication & Messaging', tags: ['HLD', 'WebSocket', 'Real-time'], description: 'Design a real-time chat application (WhatsApp-like). Cover message delivery, read receipts, group chats, and media sharing.' },
        ]
    },
    {
        id: 'financial-payment',
        name: 'Financial & Payment Systems',
        icon: '💳',
        questions: [
            { slug: 'design-splitwise', title: 'Design Splitwise', type: 'LLD', difficulty: 'Medium', category: 'Financial & Payment Systems', tags: ['OOP', 'Graph', 'Algorithm'], description: 'Design Splitwise — a shared expense tracker. Model groups, expenses, debt simplification, and settlement algorithms.' },
            { slug: 'design-payment-gateway', title: 'Design Payment Gateway', type: 'HLD', difficulty: 'Medium', category: 'Financial & Payment Systems', tags: ['HLD', 'Security', 'Idempotency'], description: 'Design a payment gateway supporting multiple payment methods, fraud detection, retries, and reconciliation.' },
            { slug: 'design-stock-exchange', title: 'Design Online Stock Exchange', type: 'HLD', difficulty: 'Hard', category: 'Financial & Payment Systems', tags: ['HLD', 'Matching Engine', 'Low Latency'], description: 'Design a stock trading platform with order matching engine, real-time price feeds, portfolio tracking, and risk checks.' },
        ]
    },
    {
        id: 'ecommerce-booking',
        name: 'E-commerce & Booking Systems',
        icon: '🛒',
        questions: [
            { slug: 'design-amazon', title: 'Design Amazon', type: 'HLD', difficulty: 'Hard', category: 'E-commerce & Booking Systems', tags: ['HLD', 'Microservices', 'Scale'], description: 'Design an e-commerce platform like Amazon. Cover catalog, cart, checkout, inventory, fulfillment, and recommendations.' },
            { slug: 'design-bookmyshow', title: 'Design BookMyShow', type: 'LLD', difficulty: 'Hard', category: 'E-commerce & Booking Systems', tags: ['LLD', 'Concurrency', 'Booking'], description: 'Design a movie ticket booking system. Handle concurrent seat selection, payment, confirmation, and cancellations.' },
            { slug: 'design-online-auction', title: 'Design Online Auction System', type: 'HLD', difficulty: 'Hard', category: 'E-commerce & Booking Systems', tags: ['HLD', 'Real-time', 'Bidding'], description: 'Design a real-time auction platform. Cover bidding, reserve prices, sniper prevention, and winner notification.' },
            { slug: 'design-food-delivery', title: 'Design Food Delivery Service', type: 'HLD', difficulty: 'Hard', category: 'E-commerce & Booking Systems', tags: ['HLD', 'Geo', 'Matching'], description: 'Design a food delivery platform (Zomato/DoorDash). Cover restaurant listing, order placement, driver matching, and tracking.' },
            { slug: 'design-ride-hailing', title: 'Design Ride Hailing Service', type: 'HLD', difficulty: 'Hard', category: 'E-commerce & Booking Systems', tags: ['HLD', 'Geo', 'Matching', 'Real-time'], description: 'Design Uber/Ola. Cover driver-rider matching, real-time location tracking, surge pricing, and route optimization.' },
        ]
    },
    {
        id: 'developer-tools',
        name: 'Developer Tools & Infrastructure',
        icon: '🛠️',
        questions: [
            { slug: 'design-url-shortener', title: 'Design URL Shortener', type: 'Both', difficulty: 'Medium', category: 'Developer Tools & Infrastructure', tags: ['HLD', 'Cache', 'Base62'], description: 'Design a URL shortening service (bit.ly). Cover short key generation, redirect, analytics, and expiry.' },
            { slug: 'design-logging-framework', title: 'Design Logging Framework', type: 'LLD', difficulty: 'Medium', category: 'Developer Tools & Infrastructure', tags: ['LLD', 'Observer', 'Strategy'], description: 'Design a logging framework with multiple log levels, appenders (console, file, remote), and formatters.' },
            { slug: 'design-rate-limiter', title: 'Design Rate Limiter', type: 'Both', difficulty: 'Medium', category: 'Developer Tools & Infrastructure', tags: ['Both', 'Redis', 'Algorithm'], description: 'Design a distributed rate limiter supporting Token Bucket and Sliding Window algorithms with Redis. Handle 50K req/s.' },
            { slug: 'design-in-memory-db', title: 'Design In-Memory File System', type: 'LLD', difficulty: 'Hard', category: 'Developer Tools & Infrastructure', tags: ['LLD', 'Tree', 'OOP'], description: 'Design an in-memory file system supporting files, directories, create, delete, read, write, and search.' },
            { slug: 'design-version-control', title: 'Design Version Control System', type: 'HLD', difficulty: 'Hard', category: 'Developer Tools & Infrastructure', tags: ['HLD', 'Git', 'Storage'], description: 'Design a distributed version control system like Git. Cover commits, branching, merging, conflict resolution, and remote sync.' },
            { slug: 'design-task-scheduler', title: 'Design Task Scheduler', type: 'Both', difficulty: 'Hard', category: 'Developer Tools & Infrastructure', tags: ['Both', 'Cron', 'Queue'], description: 'Design a distributed task scheduler with cron support, at-least-once delivery, retry policies, and monitoring.' },
        ]
    },
]

export function getQuestionBySlug(slug: string): DesignQuestion | undefined {
    for (const cat of QUESTION_CATEGORIES) {
        const q = cat.questions.find(q => q.slug === slug)
        if (q) return q
    }
    return undefined
}

export const ALL_QUESTIONS: DesignQuestion[] = QUESTION_CATEGORIES.flatMap(c => c.questions)
