<script setup lang="ts">
definePageMeta({ documentDriven: false })

useSeoMeta({
  title: 'System Design Interview Prep – HLD & LLD',
  description: 'Master High-Level Design (HLD) and Low-Level Design (LLD) interviews with structured guides, templates, common patterns, real-world case studies, and interactive checklists.',
})

// ── Active Tab ──────────────────────────────────────────────────────────────
const activeTab = ref<'hld' | 'lld' | 'patterns' | 'cases' | 'checklist'>('hld')
const tabs = [
  { id: 'hld',       label: 'HLD Guide',    icon: 'heroicons:squares-2x2' },
  { id: 'lld',       label: 'LLD Guide',    icon: 'heroicons:code-bracket-square' },
  { id: 'patterns',  label: 'Patterns',     icon: 'heroicons:puzzle-piece' },
  { id: 'cases',     label: 'Case Studies', icon: 'heroicons:building-office-2' },
  { id: 'checklist', label: 'Checklist',    icon: 'heroicons:clipboard-document-check' },
]

// ── HLD Framework Steps ──────────────────────────────────────────────────────
const hldSteps = [
  {
    step: '01', title: 'Clarify Requirements',
    icon: 'heroicons:question-mark-circle',
    color: 'from-red-500 to-pink-600',
    tips: [
      'Functional requirements: what the system must do',
      'Non-functional: scale, latency, availability, consistency',
      'Ask about DAU/MAU, peak QPS, data size, read:write ratio',
      'Clarify out-of-scope features upfront',
    ]
  },
  {
    step: '02', title: 'Capacity Estimation',
    icon: 'heroicons:calculator',
    color: 'from-orange-500 to-red-500',
    tips: [
      '1M users × 1 req/day = ~12 QPS (reads)',
      'Storage: avg payload size × writes per day × retention',
      'Bandwidth = QPS × avg response size',
      'Memory for cache = hot 20% of data (80/20 rule)',
    ]
  },
  {
    step: '03', title: 'High-Level Architecture',
    icon: 'heroicons:cpu-chip',
    color: 'from-violet-500 to-purple-600',
    tips: [
      'Draw client → LB → API servers → DB/Cache',
      'Identify stateless vs stateful components',
      'Choose SQL vs NoSQL based on access patterns',
      'Define CDN strategy for static content',
    ]
  },
  {
    step: '04', title: 'Deep Dive Key Components',
    icon: 'heroicons:magnifying-glass',
    color: 'from-blue-500 to-cyan-500',
    tips: [
      'Dig into the most critical/risky component first',
      'Explain trade-offs for every major choice',
      'Cover failure modes and recovery strategies',
      'Discuss consistency models (strong vs eventual)',
    ]
  },
  {
    step: '05', title: 'Scale & Optimize',
    icon: 'heroicons:arrow-trending-up',
    color: 'from-green-500 to-emerald-600',
    tips: [
      'Horizontal scaling: stateless services + LB',
      'DB sharding strategies: range, hash, geo-based',
      'Read replicas for read-heavy workloads',
      'Add caching layers: CDN → application → DB query',
    ]
  },
  {
    step: '06', title: 'Identify Bottlenecks',
    icon: 'heroicons:exclamation-triangle',
    color: 'from-amber-500 to-yellow-500',
    tips: [
      'Single points of failure → redundancy/failover',
      'Hot partitions in DB → consistent hashing',
      'Thundering herd → cache warming + jitter',
      'Network latency → co-location, edge nodes',
    ]
  },
]

// ── LLD Framework Steps ──────────────────────────────────────────────────────
const lldSteps = [
  {
    step: '01', title: 'Understand the Problem',
    icon: 'heroicons:light-bulb',
    color: 'from-red-500 to-pink-600',
    tips: [
      'Re-read the problem; identify entities and actions',
      'Ask: what operations are needed? (CRUD, search, etc.)',
      'Identify flows: user creates → system validates → stores',
      'Clarify concurrency requirements upfront',
    ]
  },
  {
    step: '02', title: 'Identify Entities & Classes',
    icon: 'heroicons:rectangle-group',
    color: 'from-purple-500 to-violet-600',
    tips: [
      'Nouns in requirements → candidate classes',
      'Focus on 4–7 core classes; avoid over-engineering',
      'Separate data models from service/business logic',
      'Define relationships: HAS-A, IS-A, USES',
    ]
  },
  {
    step: '03', title: 'Define Interfaces & Contracts',
    icon: 'heroicons:document-text',
    color: 'from-blue-500 to-indigo-600',
    tips: [
      'Program to interfaces, not implementations',
      'Define public APIs before internal details',
      'Apply SOLID principles (especially SRP & OCP)',
      'Use abstract classes for shared behaviour',
    ]
  },
  {
    step: '04', title: 'Choose Design Patterns',
    icon: 'heroicons:puzzle-piece',
    color: 'from-green-500 to-teal-600',
    tips: [
      'Creational: Singleton (config), Factory, Builder',
      'Structural: Adapter, Decorator, Composite',
      'Behavioral: Observer, Strategy, Command',
      'Always justify why you chose a pattern',
    ]
  },
  {
    step: '05', title: 'Database Schema',
    icon: 'heroicons:circle-stack',
    color: 'from-amber-500 to-orange-500',
    tips: [
      'Define tables/collections with PK, FK, indexes',
      'Normalize to 3NF, then denormalize for performance',
      'Composite indexes for common query patterns',
      'Use enum columns for known finite values',
    ]
  },
  {
    step: '06', title: 'Concurrency & Edge Cases',
    icon: 'heroicons:shield-check',
    color: 'from-rose-500 to-red-600',
    tips: [
      'Race conditions → locks, optimistic concurrency',
      'Idempotency: same request → same result',
      'Pagination for large result sets',
      'Validation at multiple layers (input, business, DB)',
    ]
  },
]

// ── Design Patterns ──────────────────────────────────────────────────────────
const designPatterns = [
  {
    category: 'HLD Patterns',
    color: 'border-red-500',
    badge: 'bg-red-500/20 text-red-400',
    items: [
      { name: 'CQRS', desc: 'Separate read and write models for scalability and clarity.' },
      { name: 'Event Sourcing', desc: 'Store events instead of state; replay to reconstruct.' },
      { name: 'Saga Pattern', desc: 'Manage distributed transactions via choreography or orchestration.' },
      { name: 'Circuit Breaker', desc: 'Fail fast when a dependency is down; recover gracefully.' },
      { name: 'Sidecar', desc: 'Attach cross-cutting concerns (logging, auth) as a co-process.' },
      { name: 'BFF', desc: 'Backend-for-Frontend: tailor APIs per client type.' },
    ]
  },
  {
    category: 'LLD Patterns',
    color: 'border-purple-500',
    badge: 'bg-purple-500/20 text-purple-400',
    items: [
      { name: 'Singleton', desc: 'Ensure only one instance of a class (config, connection pool).' },
      { name: 'Factory Method', desc: 'Delegate object creation to subclasses.' },
      { name: 'Builder', desc: 'Construct complex objects step-by-step fluently.' },
      { name: 'Observer', desc: 'Notify multiple objects when state changes (event system).' },
      { name: 'Strategy', desc: 'Swap algorithms at runtime without changing the client.' },
      { name: 'Decorator', desc: 'Add behaviour to objects without modifying their class.' },
    ]
  },
  {
    category: 'DB & Storage Patterns',
    color: 'border-blue-500',
    badge: 'bg-blue-500/20 text-blue-400',
    items: [
      { name: 'Read Replica', desc: 'Direct reads to replicas; writes to primary only.' },
      { name: 'Sharding', desc: 'Partition data by key to distribute across nodes.' },
      { name: 'Write-Through Cache', desc: 'Write to cache and DB atomically; strong consistency.' },
      { name: 'Cache-Aside', desc: 'App loads cache on miss; evicts on write (Lazy Loading).' },
      { name: 'Two-Phase Commit', desc: 'Coordinate distributed transactions with prepare + commit.' },
      { name: 'Materialized View', desc: 'Pre-compute and store expensive query results.' },
    ]
  },
]

// ── Case Studies ──────────────────────────────────────────────────────────────
const caseStudies = [
  {
    title: 'Design URL Shortener', difficulty: 'Easy', tag: 'HLD',
    icon: 'heroicons:link',
    color: 'border-green-500',
    diffColor: 'bg-green-500/20 text-green-400',
    keyPoints: ['Base62 encoding for short keys', 'Bloom filter to detect duplicates fast', 'Redis for hot URLs (cache-aside)', 'DB: rows (id, short, long, expiry, clicks)'],
    qps: '10K reads / 100 writes',
    storage: '100 bytes × 100M URLs = 10 GB',
  },
  {
    title: 'Design Rate Limiter', difficulty: 'Medium', tag: 'LLD+HLD',
    icon: 'heroicons:funnel',
    color: 'border-yellow-500',
    diffColor: 'bg-yellow-500/20 text-yellow-400',
    keyPoints: ['Token Bucket vs Sliding Window Log', 'Redis INCR + EXPIRE for distributed limit', 'Return 429 with Retry-After header', 'Configurable rules per user/IP/route'],
    qps: '50K req/s across clients',
    storage: 'O(user_count) in Redis',
  },
  {
    title: 'Design Netflix / Video Streaming', difficulty: 'Hard', tag: 'HLD',
    icon: 'heroicons:play-circle',
    color: 'border-red-500',
    diffColor: 'bg-red-500/20 text-red-400',
    keyPoints: ['Adaptive Bitrate Streaming (ABR / HLS)', 'CDN edge nodes for video chunks', 'Transcoding pipeline (FFmpeg workers)', 'Separate metadata DB from video blobs'],
    qps: '1M concurrent streams',
    storage: '1 video = 10 GB × 5 qualities = 50 GB',
  },
  {
    title: 'Design Notification System', difficulty: 'Medium', tag: 'HLD',
    icon: 'heroicons:bell-alert',
    color: 'border-blue-500',
    diffColor: 'bg-blue-500/20 text-blue-400',
    keyPoints: ['Message queue (Kafka) per channel type', 'Workers: push/email/SMS handlers', 'Retry with exponential backoff', 'User preference + opt-out tables'],
    qps: '1M notifications/day',
    storage: 'Notification log: 30-day retention',
  },
  {
    title: 'Design Parking Lot System', difficulty: 'Easy', tag: 'LLD',
    icon: 'heroicons:truck',
    color: 'border-teal-500',
    diffColor: 'bg-teal-500/20 text-teal-400',
    keyPoints: ['Classes: ParkingLot, Floor, Spot, Ticket, Vehicle', 'Strategy pattern for spot allocation', 'Factory for Vehicle types (Bike/Car/Truck)', 'Singleton for ParkingLot instance'],
    qps: 'N/A – local system',
    storage: 'In-memory + DB for tickets',
  },
  {
    title: 'Design Twitter / Feed System', difficulty: 'Hard', tag: 'HLD',
    icon: 'heroicons:chat-bubble-left-right',
    color: 'border-pink-500',
    diffColor: 'bg-pink-500/20 text-pink-400',
    keyPoints: ['Fan-out on write (push) vs fan-out on read (pull)', 'Celebrity users: hybrid approach', 'Timeline: Redis sorted set by tweet timestamp', 'Graph DB or adjacency list for follows'],
    qps: '300K tweets/day, 28B timeline reads',
    storage: '280 chars × 500M tweets = 140 GB/day',
  },
]

// ── Checklist ────────────────────────────────────────────────────────────────
interface CheckItem { id: string; text: string; done: boolean }
interface CheckGroup { title: string; icon: string; color: string; items: CheckItem[] }

const checkGroups = ref<CheckGroup[]>([
  {
    title: 'Before the Interview', icon: 'heroicons:academic-cap', color: 'text-amber-400',
    items: [
      { id: 'c1', text: 'Practiced capacity estimation (QPS, storage, bandwidth)', done: false },
      { id: 'c2', text: 'Know SQL vs NoSQL trade-offs by heart', done: false },
      { id: 'c3', text: 'Memorized CAP theorem + consistency models', done: false },
      { id: 'c4', text: 'Reviewed at least 10 HLD case studies', done: false },
      { id: 'c5', text: 'Done 5+ LLD problems (Parking Lot, BookMyShow, etc.)', done: false },
      { id: 'c6', text: 'Practiced drawing architecture diagrams in 5 min', done: false },
    ]
  },
  {
    title: 'HLD Interview Checklist', icon: 'heroicons:squares-2x2', color: 'text-red-400',
    items: [
      { id: 'h1', text: 'Clarified functional & non-functional requirements', done: false },
      { id: 'h2', text: 'Did back-of-envelope capacity estimation', done: false },
      { id: 'h3', text: 'Drew high-level component diagram', done: false },
      { id: 'h4', text: 'Explained database choice with justification', done: false },
      { id: 'h5', text: 'Covered caching strategy', done: false },
      { id: 'h6', text: 'Identified & addressed single points of failure', done: false },
      { id: 'h7', text: 'Discussed horizontal vs vertical scaling', done: false },
      { id: 'h8', text: 'Mentioned monitoring, alerting, and logging', done: false },
    ]
  },
  {
    title: 'LLD Interview Checklist', icon: 'heroicons:code-bracket-square', color: 'text-purple-400',
    items: [
      { id: 'l1', text: 'Identified core entities / classes from requirements', done: false },
      { id: 'l2', text: 'Defined clear interfaces and contracts', done: false },
      { id: 'l3', text: 'Applied at least one relevant design pattern', done: false },
      { id: 'l4', text: 'Designed DB schema with indexes', done: false },
      { id: 'l5', text: 'Handled concurrency & thread safety', done: false },
      { id: 'l6', text: 'Covered edge cases & validation logic', done: false },
      { id: 'l7', text: 'Wrote clean, readable code / pseudocode', done: false },
    ]
  },
])

function toggleCheck(groupIdx: number, itemId: string) {
  const group = checkGroups.value[groupIdx]
  const item = group.items.find(i => i.id === itemId)
  if (item) item.done = !item.done
}

const totalItems = computed(() => checkGroups.value.reduce((s, g) => s + g.items.length, 0))
const doneItems  = computed(() => checkGroups.value.reduce((s, g) => s + g.items.filter(i => i.done).length, 0))
const progress   = computed(() => Math.round((doneItems.value / totalItems.value) * 100))

// ── HLD Pro Tips ────────────────────────────────────────────────────────────
const hldProTips = [
  'Always think out loud — silence kills HLD interviews',
  'Do rough math before choosing a DB or cache strategy',
  'State trade-offs explicitly: "I chose X over Y because..."',
  'Start simple, then evolve: MVP → scale → optimize',
  'Address availability before optimization questions',
  'Spend ~5 min on requirements, do not skip this step',
]

// ── Math tips ─────────────────────────────────────────────────────────────────
const mathTips = [
  { label: '1 million requests/day', value: '≈ 12 QPS' },
  { label: '1 billion requests/day', value: '≈ 11,574 QPS' },
  { label: '1 KB × 1M users', value: '≈ 1 GB' },
  { label: 'Char (UTF-8)', value: '1–4 bytes' },
  { label: '1 image (avg)', value: '≈ 300 KB' },
  { label: '1 min video (1080p)', value: '≈ 150 MB' },
  { label: '1 hr video (1080p)', value: '≈ 8 GB' },
  { label: '1 day seconds', value: '86,400 s' },
]
</script>

<template>
  <div class="min-h-screen">

    <!-- ══ HERO ══ -->
    <AppSection class="mb-0 pb-0">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700 px-6 py-12 md:px-14 md:py-16 mb-10">
        <!-- bg grid decoration -->
        <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 32px 32px;" />
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div class="relative z-10 max-w-3xl">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-3 py-1 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 rounded-full uppercase tracking-wider">Interview Prep</span>
            <span class="px-3 py-1 text-xs font-bold bg-zinc-700 text-zinc-300 border border-zinc-600 rounded-full uppercase tracking-wider">HLD + LLD</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            System Design<br/>
            <span class="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">Interview Platform</span>
          </h1>
          <p class="text-zinc-300 text-lg max-w-2xl leading-relaxed mb-6">
            Everything you need to crack HLD &amp; LLD interviews — structured frameworks, real-world case studies,
            design patterns, capacity estimation math, and an interactive readiness checklist.
          </p>
          <!-- CTA buttons -->
          <div class="flex flex-wrap gap-3 mb-8">
            <NuxtLink to="/system-design/practice"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-lg shadow-red-500/25">
              <Icon name="heroicons:play-circle" class="text-base" />
              Start Practicing
            </NuxtLink>
            <a href="#tabs"
              class="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-zinc-600 text-zinc-300 hover:text-white font-semibold rounded-xl transition-colors text-sm">
              <Icon name="heroicons:book-open" class="text-base" />
              Study Guides
            </a>
          </div>
          <!-- Quick stats -->
          <div class="flex flex-wrap gap-6">
            <div v-for="stat in [
              { v: '40+', l: 'Practice Problems' },
              { v: '18', l: 'Design Patterns' },
              { v: '2', l: 'Complete Frameworks' },
              { v: '20+', l: 'Checklist Items' },
            ]" :key="stat.l" class="flex flex-col">
              <span class="text-2xl font-bold text-white">{{ stat.v }}</span>
              <span class="text-xs text-zinc-400 uppercase tracking-wide">{{ stat.l }}</span>
            </div>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ ESTIMATION CHEAT SHEET ══ -->
    <AppSection class="mb-0 pb-0">
      <div class="mb-8 bg-zinc-900 border border-zinc-700 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-4">
          <Icon name="heroicons:calculator" class="text-amber-400 text-xl" />
          <h2 class="text-base font-bold text-white uppercase tracking-widest">Quick Estimation Cheat Sheet</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div v-for="tip in mathTips" :key="tip.label"
            class="bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex flex-col gap-1">
            <span class="text-xs text-zinc-400">{{ tip.label }}</span>
            <span class="text-sm font-bold text-amber-400">{{ tip.value }}</span>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ TAB NAV ══ -->
    <AppSection id="tabs" class="mb-0 pb-0">
      <div class="flex gap-1 overflow-x-auto pb-1 scrollbar-hide mb-6" style="scrollbar-width:none">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id as any"
          :class="[
            'flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0',
            activeTab === tab.id
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25'
              : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700'
          ]"
        >
          <Icon :name="tab.icon" class="text-base" />
          {{ tab.label }}
        </button>
      </div>
    </AppSection>

    <!-- ══ HLD GUIDE ══ -->
    <AppSection v-if="activeTab === 'hld'" class="mb-16">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">High-Level Design Framework</h2>
        <p class="text-zinc-400">Follow this 6-step framework during every HLD interview. Walk the interviewer through each step explicitly.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="step in hldSteps" :key="step.step"
          class="bg-zinc-900 border border-zinc-700 rounded-xl p-6 hover:border-zinc-500 transition-all duration-200 group">
          <div class="flex items-start gap-4 mb-4">
            <div :class="`bg-gradient-to-br ${step.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white`">
              <Icon :name="step.icon" class="text-lg" />
            </div>
            <div>
              <span class="text-xs text-zinc-500 font-mono">Step {{ step.step }}</span>
              <h3 class="text-white font-bold text-base">{{ step.title }}</h3>
            </div>
          </div>
          <ul class="space-y-2">
            <li v-for="tip in step.tips" :key="tip" class="flex items-start gap-2 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <Icon name="heroicons:chevron-right" class="text-red-400 text-xs mt-0.5 flex-shrink-0" />
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- HLD Tips box -->
      <div class="mt-10 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-xl p-6">
        <div class="flex items-center gap-2 mb-3">
          <Icon name="heroicons:fire" class="text-red-400 text-xl" />
          <h3 class="text-white font-bold">Pro Tips for HLD Interviews</h3>
        </div>
        <div class="grid md:grid-cols-2 gap-3 text-sm text-zinc-300">
          <div v-for="tip in hldProTips" :key="tip"
            class="bg-zinc-900/60 rounded-lg px-4 py-2.5 border border-zinc-800">
            {{ tip }}
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ LLD GUIDE ══ -->
    <AppSection v-if="activeTab === 'lld'" class="mb-16">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">Low-Level Design Framework</h2>
        <p class="text-zinc-400">Structure your LLD interviews using this 6-step approach. Focus on clean abstractions and justifying every design decision.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="step in lldSteps" :key="step.step"
          class="bg-zinc-900 border border-zinc-700 rounded-xl p-6 hover:border-zinc-500 transition-all duration-200 group">
          <div class="flex items-start gap-4 mb-4">
            <div :class="`bg-gradient-to-br ${step.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white`">
              <Icon :name="step.icon" class="text-lg" />
            </div>
            <div>
              <span class="text-xs text-zinc-500 font-mono">Step {{ step.step }}</span>
              <h3 class="text-white font-bold text-base">{{ step.title }}</h3>
            </div>
          </div>
          <ul class="space-y-2">
            <li v-for="tip in step.tips" :key="tip" class="flex items-start gap-2 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <Icon name="heroicons:chevron-right" class="text-purple-400 text-xs mt-0.5 flex-shrink-0" />
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- SOLID Principles card -->
      <div class="mt-10 bg-zinc-900 border border-zinc-700 rounded-xl p-6">
        <div class="flex items-center gap-2 mb-4">
          <Icon name="heroicons:cube-transparent" class="text-purple-400 text-xl" />
          <h3 class="text-white font-bold">SOLID Principles — Quick Reference</h3>
        </div>
        <div class="grid md:grid-cols-5 gap-3">
          <div v-for="s in [
            { letter:'S', name:'Single Responsibility', desc:'One reason to change per class' },
            { letter:'O', name:'Open / Closed', desc:'Open for extension, closed for modification' },
            { letter:'L', name:'Liskov Substitution', desc:'Subtypes replaceable for their base types' },
            { letter:'I', name:'Interface Segregation', desc:'Small focused interfaces over fat ones' },
            { letter:'D', name:'Dependency Inversion', desc:'Depend on abstractions, not concretions' },
          ]" :key="s.letter"
          class="bg-zinc-800 rounded-lg p-4 border border-zinc-700 flex flex-col gap-2">
            <span class="text-2xl font-black text-purple-400">{{ s.letter }}</span>
            <span class="text-xs font-bold text-white">{{ s.name }}</span>
            <span class="text-xs text-zinc-400">{{ s.desc }}</span>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ PATTERNS ══ -->
    <AppSection v-if="activeTab === 'patterns'" class="mb-16">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">Design Patterns Reference</h2>
        <p class="text-zinc-400">Master these patterns — interviewers expect you to name, explain, and justify them on the spot.</p>
      </div>
      <div class="flex flex-col gap-8">
        <div v-for="group in designPatterns" :key="group.category"
          :class="`bg-zinc-900 border-l-4 ${group.color} border border-zinc-700 rounded-xl p-6`">
          <div class="flex items-center gap-2 mb-5">
            <span :class="`px-3 py-1 text-xs font-bold rounded-full ${group.badge}`">{{ group.category }}</span>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in group.items" :key="item.name"
              class="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-500 transition-all">
              <div class="font-bold text-white text-sm mb-1">{{ item.name }}</div>
              <div class="text-xs text-zinc-400 leading-relaxed">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ CASE STUDIES ══ -->
    <AppSection v-if="activeTab === 'cases'" class="mb-16">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">Real-World Case Studies</h2>
        <p class="text-zinc-400">Practice these popular interview questions. Use the key points and numbers as mental anchors.</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="cs in caseStudies" :key="cs.title"
          :class="`bg-zinc-900 border border-zinc-700 border-l-4 ${cs.color} rounded-xl p-6 hover:border-zinc-500 transition-all group`">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                <Icon :name="cs.icon" class="text-white text-base" />
              </div>
              <h3 class="text-white font-bold text-base">{{ cs.title }}</h3>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span :class="`text-xs px-2 py-0.5 rounded-full font-semibold ${cs.diffColor}`">{{ cs.difficulty }}</span>
              <span class="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{{ cs.tag }}</span>
            </div>
          </div>
          <ul class="space-y-1.5 mb-4">
            <li v-for="kp in cs.keyPoints" :key="kp" class="flex items-start gap-2 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <Icon name="heroicons:check-circle" class="text-green-400 text-sm mt-0.5 flex-shrink-0" />
              <span>{{ kp }}</span>
            </li>
          </ul>
          <div class="flex gap-4 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
            <span>⚡ <b class="text-zinc-400">QPS:</b> {{ cs.qps }}</span>
            <span>💾 <b class="text-zinc-400">Storage:</b> {{ cs.storage }}</span>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ CHECKLIST ══ -->
    <AppSection v-if="activeTab === 'checklist'" class="mb-16">
      <div class="mb-8">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">Interview Readiness Checklist</h2>
            <p class="text-zinc-400">Track what you've covered. Check off items as you prepare.</p>
          </div>
          <!-- Progress -->
          <div class="bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 min-w-[180px]">
            <div class="text-center">
              <div class="text-3xl font-black text-white">{{ progress }}%</div>
              <div class="text-xs text-zinc-400 mb-2">Ready</div>
              <div class="h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                  :style="`width: ${progress}%`"
                />
              </div>
              <div class="text-xs text-zinc-400 mt-1">{{ doneItems }} / {{ totalItems }} done</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-8">
        <div v-for="(group, gi) in checkGroups" :key="group.title"
          class="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
          <div class="flex items-center gap-2 mb-5">
            <Icon :name="group.icon" :class="`text-xl ${group.color}`" />
            <h3 class="text-white font-bold text-lg">{{ group.title }}</h3>
            <span class="ml-auto text-xs text-zinc-500">
              {{ group.items.filter(i => i.done).length }} / {{ group.items.length }}
            </span>
          </div>
          <div class="space-y-3">
            <label
              v-for="item in group.items" :key="item.id"
              :for="`chk-${item.id}`"
              class="flex items-center gap-3 cursor-pointer group"
            >
              <input
                :id="`chk-${item.id}`"
                type="checkbox"
                :checked="item.done"
                @change="toggleCheck(gi, item.id)"
                class="sr-only"
              />
              <div
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
                  item.done ? 'bg-green-500 border-green-500' : 'border-zinc-600 group-hover:border-zinc-400'
                ]"
              >
                <Icon v-if="item.done" name="heroicons:check" class="text-white text-xs" />
              </div>
              <span :class="['text-sm transition-colors', item.done ? 'text-zinc-500 line-through' : 'text-zinc-300 group-hover:text-white']">
                {{ item.text }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </AppSection>

  </div>
</template>
