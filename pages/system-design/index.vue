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
    <AppSection class="mb-0 pb-0 overflow-hidden relative">
      <!-- Premium Background elements -->
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] -z-10 animate-pulse" style="animation-duration: 8s" />
      <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] -z-10 animate-pulse" style="animation-duration: 12s" />
      
      <div class="relative group">
        <!-- Glow effect behind hero -->
        <div class="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-none blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
        
        <div class="relative overflow-hidden rounded-none bg-zinc-900/40 backdrop-blur-3xl border border-white/10 px-8 py-16 md:px-20 md:py-24 mb-12 shadow-2xl">
          <!-- bg grid decoration -->
          <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px;" />
          
          <div class="relative z-10 text-center md:text-left">
            <div class="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-8 scale-in">
              <span class="px-4 py-1.5 text-[10px] font-black bg-white/5 text-red-400 border border-red-500/20 rounded-none uppercase tracking-[0.2em] backdrop-blur-sm">Interview Forge</span>
              <span class="px-4 py-1.5 text-[10px] font-black bg-white/5 text-zinc-400 border border-white/10 rounded-none uppercase tracking-[0.2em] backdrop-blur-sm">HLD + LLD Mastery</span>
            </div>
            
            <h1 class="text-4xl md:text-7xl font-black uppercase text-white leading-[1.1] mb-8 tracking-tighter">
              Master the Art of<br/>
              <span class="bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">System Design</span>
            </h1>
            
            <p class="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 font-medium mx-auto md:mx-0">
              A comprehensive blueprint for cracking top-tier architecture interviews. 
              From <span class="text-white border-b border-red-500/50">distributed systems</span> to <span class="text-white border-b border-pink-500/50">pattern-perfect code</span>.
            </p>
            
            <!-- CTA buttons -->
            <div class="flex flex-wrap justify-center md:justify-start gap-4 mb-12">
              <NuxtLink to="/system-design/practice"
                class="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-none hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-red-500/20 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <Icon name="heroicons:bolt-20-solid" class="text-xl relative z-10 group-hover/btn:text-white transition-colors" />
                <span class="relative z-10 group-hover/btn:text-white transition-colors uppercase tracking-widest text-sm">Start Practicing</span>
              </NuxtLink>
              
              <a href="#tabs"
                class="inline-flex items-center gap-3 px-8 py-4 bg-zinc-800/50 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 hover:border-white/20 font-bold rounded-none transition-all duration-300 uppercase tracking-widest text-sm text-[12px]">
                <Icon name="heroicons:academic-cap" class="text-xl" />
                Curriculum
              </a>
            </div>
            
            <!-- Floating stats -->
            <div class="flex flex-wrap justify-center md:justify-start gap-x-12 gap-y-6 pt-10 border-t border-white/5">
              <div v-for="stat in [
                { v: '40+', l: 'Scenarios', icon: 'heroicons:squares-2x2' },
                { v: '18', l: 'Patterns', icon: 'heroicons:puzzle-piece' },
                { v: 'JSON', l: 'Structures', icon: 'heroicons:code-bracket' },
                { v: '∞', l: 'Readiness', icon: 'heroicons:check-badge' },
              ]" :key="stat.l" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon :name="stat.icon" class="text-red-400 text-lg" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xl font-black text-white leading-none">{{ stat.v }}</span>
                  <span class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ stat.l }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ ESTIMATION FLOATING HUB ══ -->
    <AppSection class="mb-0 pb-0">
      <div class="relative -mt-20 z-20 group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-none blur opacity-20" />
        <div class="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-none p-8 shadow-2xl">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-none flex items-center justify-center">
                <Icon name="heroicons:beaker" class="text-red-400 text-2xl" />
              </div>
              <div>
                <h2 class="text-lg font-black text-white uppercase tracking-tighter">Capacity Cheat Sheet</h2>
                <p class="text-xs text-zinc-500 font-medium">Quick math for back-of-the-envelope estimations</p>
              </div>
            </div>
            <div class="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-none">
              <div class="w-2 h-2 rounded-none bg-red-500 animate-pulse" />
              <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Real-time reference active</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="tip in mathTips" :key="tip.label"
              class="group/math relative overflow-hidden bg-white/5 border border-white/10 rounded-none p-4 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
              <div class="absolute bottom-0 right-0 p-1 opacity-0 group-hover/math:opacity-10 transition-opacity">
                <Icon name="heroicons:calculator" class="text-4xl" />
              </div>
              <span class="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em] mb-1 group-hover/math:text-red-400/70 transition-colors">{{ tip.label }}</span>
              <span class="text-base font-black text-zinc-100 tabular-nums">{{ tip.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- ══ TAB NAV ══ -->
    <AppSection id="tabs" class="mb-0 pb-0 sticky top-0 z-40">
      <div class="px-2 py-4">
        <div class="flex p-1.5 gap-1.5 overflow-x-auto bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-none scrollbar-hide" style="scrollbar-width:none">
          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id as any"
            :class="[
              'flex items-center gap-2.5 px-6 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-white text-black shadow-lg shadow-white/10'
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            ]"
          >
            <Icon :name="tab.icon" class="text-sm" />
            {{ tab.label }}
          </button>
        </div>
      </div>
    </AppSection>

    <div class="">
      <!-- ══ HLD GUIDE ══ -->
      <AppSection v-if="activeTab === 'hld'" class="mb-16">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div class="max-w-2xl">
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tighter">High-Level Design<span class="text-red-500">.</span></h2>
            <p class="text-zinc-400 text-lg leading-relaxed">A strategic blueprint for scaling systems to millions. Focus on components, interactions, and data flow.</p>
          </div>
          <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 bg-white/5 border border-white/10 px-4 py-2 rounded-none">
            <span class="w-2 h-2 rounded-none bg-red-500" />
            Strategic Phase
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="step in hldSteps" :key="step.step"
            class="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-none p-8 hover:border-red-500/30 transition-all duration-500">
            <div class="absolute top-0 right-0 p-8 text-6xl font-black text-white/[0.03] group-hover:text-red-500/[0.05] transition-colors">
              {{ step.step }}
            </div>
            
            <div class="relative z-10">
              <div :class="`bg-gradient-to-br ${step.color} w-14 h-14 rounded-none flex items-center justify-center mb-8 shadow-lg shadow-white/5`">
                <Icon :name="step.icon" class="text-2xl text-white" />
              </div>
              
              <h3 class="text-xl font-black uppercase text-white mb-6 tracking-tighter group-hover:text-red-400 transition-colors">{{ step.title }}</h3>
              
              <ul class="space-y-4">
                <li v-for="tip in step.tips" :key="tip" class="flex items-start gap-3 group/li">
                  <div class="mt-1.5 w-1.5 h-1.5 rounded-none bg-zinc-700 group-hover/li:bg-red-500 transition-colors" />
                  <span class="text-sm text-zinc-500 leading-relaxed font-medium group-hover/li:text-zinc-300 transition-colors">{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- HLD Tips box -->
        <div class="mt-16 group">
          <div class="relative overflow-hidden rounded-none bg-gradient-to-br from-red-600/10 to-pink-600/10 border border-red-500/20 p-8 md:p-12">
            <div class="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] -z-10" />
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-red-500 rounded-none flex items-center justify-center shadow-lg shadow-red-500/20">
                <Icon name="heroicons:bolt-solid" class="text-white text-2xl" />
              </div>
              <h3 class="text-2xl font-black text-white tracking-tighter uppercase px-2">Interview Mastery</h3>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div v-for="tip in hldProTips" :key="tip"
                class="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/5 rounded-none px-6 py-4 hover:bg-black/60 transition-colors">
                <Icon name="heroicons:check-badge" class="text-red-500 text-xl shrink-0" />
                <span class="text-sm font-bold text-zinc-300 leading-tight">{{ tip }}</span>
              </div>
            </div>
          </div>
        </div>
      </AppSection>

      <!-- ══ LLD GUIDE ══ -->
      <AppSection v-if="activeTab === 'lld'" class="mb-16">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div class="max-w-2xl">
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tighter">Low-Level Design<span class="text-purple-500">.</span></h2>
            <p class="text-zinc-400 text-lg leading-relaxed">Turning concepts into executable reality. Focus on SOLID principles, clean code, and design patterns.</p>
          </div>
          <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 bg-white/5 border border-white/10 px-4 py-2 rounded-none">
            <span class="w-2 h-2 rounded-none bg-purple-500" />
            Tactical Phase
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="step in lldSteps" :key="step.step"
            class="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-none p-8 hover:border-purple-500/30 transition-all duration-500">
            <div class="absolute top-0 right-0 p-8 text-6xl font-black text-white/[0.03] group-hover:text-purple-500/[0.05] transition-colors">
              {{ step.step }}
            </div>
            
            <div class="relative z-10">
              <div :class="`bg-gradient-to-br ${step.color} w-14 h-14 rounded-none flex items-center justify-center mb-8 shadow-lg shadow-white/5`">
                <Icon :name="step.icon" class="text-2xl text-white" />
              </div>
              
              <h3 class="text-xl font-black uppercase text-white mb-6 tracking-tighter group-hover:text-purple-400 transition-colors">{{ step.title }}</h3>
              
              <ul class="space-y-4">
                <li v-for="tip in step.tips" :key="tip" class="flex items-start gap-3 group/li">
                  <div class="mt-1.5 w-1.5 h-1.5 rounded-none bg-zinc-700 group-hover/li:bg-purple-500 transition-colors" />
                  <span class="text-sm text-zinc-500 leading-relaxed font-medium group-hover/li:text-zinc-300 transition-colors">{{ tip }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- SOLID Principles card -->
        <div class="mt-16 group">
          <div class="relative overflow-hidden rounded-none bg-zinc-900 border border-white/10 p-1">
            <div class="bg-zinc-900/40 backdrop-blur-3xl rounded-none p-8 md:p-12">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-purple-500 rounded-none flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Icon name="heroicons:cube-transparent-solid" class="text-white text-2xl" />
                  </div>
                  <h3 class="text-2xl font-black text-white tracking-tighter uppercase">The SOLID Manifesto</h3>
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                <div v-for="s in [
                  { letter:'S', name:'Single Responsibility', desc:'One reason to change' },
                  { letter:'O', name:'Open / Closed', desc:'Extend, don\'t modify' },
                  { letter:'L', name:'Liskov Substitution', desc:'Safe subtype swaps' },
                  { letter:'I', name:'Interface Segregation', desc:'Focused protocols' },
                  { letter:'D', name:'Dependency Inversion', desc:'Trust abstractions' },
                ]" :key="s.letter"
                class="group/solid relative bg-white/5 border border-white/5 rounded-none p-6 transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-500/30">
                  <span class="block text-4xl font-black text-purple-500 mb-2 transition-transform group-hover/solid:scale-110">{{ s.letter }}</span>
                  <span class="block text-xs font-black text-white uppercase tracking-tighter mb-1">{{ s.name }}</span>
                  <span class="block text-[10px] font-bold text-zinc-500 uppercase leading-snug">{{ s.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppSection>
    </div>

      <!-- ══ PATTERNS ══ -->
      <AppSection v-if="activeTab === 'patterns'" class="mb-16">
        <div class="mb-12">
          <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tighter">Architecture Patterns<span class="text-blue-500">.</span></h2>
          <p class="text-zinc-400 text-lg leading-relaxed">The reusable solutions to common system design challenges. Speak this language fluently.</p>
        </div>
        
        <div class="flex flex-col gap-12">
          <div v-for="group in designPatterns" :key="group.category"
            class="relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-none p-8">
            <div class="flex items-center gap-4 mb-10">
              <span :class="`px-4 py-1.5 text-[10px] font-black rounded-none uppercase tracking-widest ${group.badge} border border-white/5 shadow-sm`">
                {{ group.category }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="item in group.items" :key="item.name"
                class="group/pattern bg-white/5 border border-white/5 rounded-none p-6 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                  <div class="font-black text-white text-base tracking-tight group-hover/pattern:text-blue-400 transition-colors uppercase">{{ item.name }}</div>
                  <Icon name="heroicons:arrow-up-right" class="text-zinc-600 transition-transform group-hover/pattern:translate-x-0.5 group-hover/pattern:-translate-y-0.5" />
                </div>
                <div class="text-sm text-zinc-500 leading-relaxed font-medium group-hover/pattern:text-zinc-400 transition-colors">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </AppSection>

      <!-- ══ CASE STUDIES ══ -->
      <AppSection v-if="activeTab === 'cases'" class="mb-16">
        <div class="mb-12">
          <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tighter">Real-World Cases<span class="text-emerald-500">.</span></h2>
          <p class="text-zinc-400 text-lg leading-relaxed">Reverse-engineering the world's most scalable platforms. Identify the core bottlenecks first.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="cs in caseStudies" :key="cs.title"
            class="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-none p-8 hover:border-emerald-500/30 transition-all duration-500">
            <div class="flex items-start justify-between mb-8">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-zinc-800 rounded-none flex items-center justify-center border border-white/5 shadow-xl transition-transform group-hover:scale-110">
                  <Icon :name="cs.icon" class="text-white text-2xl" />
                </div>
                <div>
                  <h3 class="text-xl font-black uppercase text-white tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors">{{ cs.title }}</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span :class="`text-[8px] px-2 py-0.5 rounded-none font-black uppercase tracking-widest ${cs.diffColor}`">{{ cs.difficulty }}</span>
                    <span class="text-[8px] text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-none font-black uppercase tracking-widest">{{ cs.tag }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4 mb-10">
              <div v-for="kp in cs.keyPoints" :key="kp" class="flex items-start gap-3 group/li">
                <div class="mt-1.5 w-1.5 h-1.5 rounded-none bg-zinc-700 group-hover/li:bg-emerald-500 transition-colors shrink-0" />
                <span class="text-sm text-zinc-500 leading-relaxed font-medium group-hover/li:text-zinc-300 transition-colors">{{ kp }}</span>
              </div>
            </div>

            <div class="flex gap-8 pt-6 border-t border-white/5">
              <div class="flex flex-col gap-1">
                <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Read Peak</span>
                <span class="text-xs font-black text-emerald-400/80">{{ cs.qps }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Storage Scale</span>
                <span class="text-xs font-black text-emerald-400/80">{{ cs.storage }}</span>
              </div>
            </div>
          </div>
        </div>
      </AppSection>

      <!-- ══ CHECKLIST ══ -->
      <AppSection v-if="activeTab === 'checklist'" class="mb-16">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16">
          <div class="max-w-2xl">
            <h2 class="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tighter">Readiness Metrics<span class="text-amber-500">.</span></h2>
            <p class="text-zinc-400 text-lg leading-relaxed">Quantify your interview readiness. Aim for 80%+ across all categories before your first mock.</p>
          </div>
          
          <!-- Premium Progress Tracker -->
          <div class="relative group shrink-0">
            <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-none blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div class="relative bg-zinc-900 border border-white/10 rounded-none p-8 min-w-[240px]">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">System Health</span>
                <span class="text-lg font-black text-white tabular-nums">{{ progress }}%</span>
              </div>
              <div class="h-4 bg-zinc-800 rounded-none overflow-hidden p-1 shadow-inner">
                <div
                  class="h-full rounded-none bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-1000 ease-out shadow-lg shadow-amber-500/20"
                  :style="`width: ${progress}%`"
                />
              </div>
              <div class="flex justify-between mt-4">
                <span class="text-[9px] font-bold text-zinc-600 uppercase">Input: {{ totalItems }} items</span>
                <span class="text-[9px] font-bold text-amber-500 uppercase">Processed: {{ doneItems }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div v-for="(group, gi) in checkGroups" :key="group.title"
            class="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-none p-8 hover:border-white/20 transition-all">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-10 h-10 rounded-none bg-white/5 border border-white/5 flex items-center justify-center">
                <Icon :name="group.icon" :class="`text-xl ${group.color}`" />
              </div>
              <div>
                <h3 class="text-base font-black text-white tracking-tighter uppercase leading-none mb-1">{{ group.title }}</h3>
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {{ group.items.filter(i => i.done).length }} of {{ group.items.length }} bitwise complete
                </span>
              </div>
            </div>
            
            <div class="space-y-3">
              <label
                v-for="item in group.items" :key="item.id"
                :for="`chk-${item.id}`"
                class="flex items-center gap-4 cursor-pointer group/label select-none"
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
                    'w-6 h-6 rounded-none border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300',
                    item.done ? 'bg-amber-500 border-amber-500 scale-110 shadow-lg shadow-amber-500/20' : 'border-zinc-800 bg-white/5 group-hover/label:border-zinc-600 group-hover/label:scale-105'
                  ]"
                >
                  <Icon v-if="item.done" name="heroicons:check-16-solid" class="text-black text-xs" />
                </div>
                <span :class="['text-xs font-bold transition-all duration-300', item.done ? 'text-zinc-600 line-through' : 'text-zinc-400 group-hover/label:text-white']">
                  {{ item.text }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </AppSection>


  </div>
</template>

<style scoped>
.scale-in {
  animation: scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scale-in {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 8s infinite ease-in-out;
}
</style>
