<script setup lang="ts">
import { shallowRef, type Component } from 'vue'
import { getQuestionBySlug } from '~/data/system-design-questions'
import { renderMarkdown } from '~/utils/markdownRenderer'

definePageMeta({ documentDriven: false })

const route = useRoute()
const slug = route.params.slug as string
const questionRaw = getQuestionBySlug(slug)

if (!questionRaw) {
  throw createError({ statusCode: 404, statusMessage: 'Question not found' })
}

const question = questionRaw // narrowed, never undefined past this line

useSeoMeta({
  title: `${question.title} – System Design Practice`,
  description: question.description,
})

useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', defer: true }
  ]
})

// ── Difficulty Modal ─────────────────────────────────────────────────────────
const showDifficultyModal = ref(true)
const selectedDifficulty = ref<'Junior' | 'Senior' | 'Staff'>('Junior')
const difficultyOptions = [
  { id: 'Junior', label: 'Junior', desc: 'Guided hints, relaxed scoring', color: 'border-green-500 bg-green-500/10', time: 30 },
  { id: 'Senior', label: 'Senior', desc: 'Standard interview, full scoring', color: 'border-amber-500 bg-amber-500/10', time: 45 },
  { id: 'Staff', label: 'Staff / Principal', desc: 'Strict rubric, deep dives expected', color: 'border-red-500 bg-red-500/10', time: 60 },
]

// ── Timer ────────────────────────────────────────────────────────────────────
const timeLeft = ref(0)
const timerRunning = ref(false)
let timerInterval: ReturnType<typeof setInterval> | null = null

function startInterview() {
  const opt = difficultyOptions.find(o => o.id === selectedDifficulty.value)!
  timeLeft.value = opt.time * 60
  showDifficultyModal.value = false
  resumeTimer()
}

function pauseTimer() {
  timerRunning.value = false
  if (timerInterval) clearInterval(timerInterval)
}

function resumeTimer() {
  timerRunning.value = true
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else { timerRunning.value = false; clearInterval(timerInterval!) }
  }, 1000)
}

function toggleTimer() {
  if (timerRunning.value) pauseTimer()
  else resumeTimer()
}

onUnmounted(() => { if (timerInterval) clearInterval(timerInterval) })

const timerDisplay = computed(() => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
  const s = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})
const timerWarning = computed(() => timeLeft.value < 300)

// ── Active Step & Left Panel Tab ─────────────────────────────────────────────
const mode = route.query.mode as string || (question.type === 'HLD' ? 'HLD' : 'LLD')
const isLLD = computed(() => mode === 'LLD')
const leftTab = ref<'guidelines' | 'description'>('guidelines')

interface Step { id: string; label: string; subtitle: string; locked: boolean; skipped: boolean }

const steps = ref<Step[]>(
  isLLD.value ? [
    { id: 'requirements', label: 'Requirements Gathering', subtitle: 'Identify functional and non-functional requirements', locked: false, skipped: false },
    { id: 'entities',     label: 'Identifying Core Entities', subtitle: 'List the main classes and objects', locked: true, skipped: false },
    { id: 'classes',      label: 'Designing Classes & Relationships', subtitle: 'Define attributes, methods, and relationships', locked: true, skipped: false },
    { id: 'code',         label: 'Code Implementation', subtitle: 'Implement your design following OOP principles', locked: true, skipped: false },
  ] : [
    { id: 'requirements', label: '1. Requirements Gathering', subtitle: 'Identify the functional and non-functional requirements', locked: false, skipped: false },
    { id: 'api',          label: '2. API Design', subtitle: 'Define the API endpoints, methods, and request/response formats', locked: true, skipped: false },
    { id: 'architecture', label: '3. High-Level Design', subtitle: 'Design the system architecture with components, services, and data flow', locked: true, skipped: false },
    { id: 'database',      label: '4. Database Design', subtitle: 'Design the database schema, tables, and relationships for data storage', locked: true, skipped: false },
    { id: 'deep-dive',    label: '5. Deep Dive 1 - Caching Strategy', subtitle: 'Design the caching layer to handle high read traffic', locked: true, skipped: false },
    { id: 'analytics',    label: '6. Deep Dive 2 - Click Count Analytics', subtitle: 'Design a system for real-time click/event tracking and analytics', locked: true, skipped: false },
  ]
)

const activeStepId = ref('requirements')
const activeStep = computed(() => steps.value.find(s => s.id === activeStepId.value)!)
const activeStepIndex = computed(() => steps.value.findIndex(s => s.id === activeStepId.value))

function goToStep(id: string) {
  const idx = steps.value.findIndex(s => s.id === id)
  if (steps.value[idx].locked) return
  activeStepId.value = id
}

// ── Sidebar & Whiteboard State ───────────────────────────────────────────────
const isSidebarCollapsed = ref(false)
const isWhiteboardFullscreen = ref<string | null>(null) // stepId of fullscreen whiteboard
const showStorageDropdown = ref(false)

function toggleSidebar() { isSidebarCollapsed.value = !isSidebarCollapsed.value }
function toggleWhiteboardFullscreen(stepId: string) {
  if (isWhiteboardFullscreen.value === stepId) isWhiteboardFullscreen.value = null
  else isWhiteboardFullscreen.value = stepId
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isWhiteboardFullscreen.value) {
      isWhiteboardFullscreen.value = null
    }
  })

  // Close dropdown on click outside
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.storage-dropdown-container')) {
      showStorageDropdown.value = false
    }
  })
})

function unlockNext() {
  const idx = activeStepIndex.value
  if (idx < steps.value.length - 1) {
    steps.value[idx + 1].locked = false
  }
}

// ── Per-step evaluation state ────────────────────────────────────────────────
interface Metric {
  label: string; score: number; maxScore: number; feedback: string; strengths: string[]; gaps: string[]
}
interface StepResult {
  score: number; maxScore: number; passing: boolean
  feedback: string; whatWentWell: string[]; improvements: string[]; modelAnswer: string
  metrics?: Metric[]
}
const stepResults = ref<Record<string, StepResult | null>>({})
const stepEvaluating = ref<Record<string, boolean>>({})
const stepError = ref<Record<string, string>>({})
const showAnalysisHub = ref(false)
const showQuitModal = ref(false)

// ── File System Modal State ──
const showNewFSModal = ref(false)
const fsModalType = ref<'file' | 'folder'>('file')
const fsModalName = ref('')
const fsModalError = ref('')
const fsNameInputRef = ref<HTMLInputElement | null>(null)

const stepEvalCounts = ref<Record<string, number>>({})
const MAX_STEP_EVALS = 3

// ── IDE UI State ──
const isTerminalOpen = ref(false)
const isEditorFullscreen = ref(false)

// ── Guidelines Modal ──────────────────────────────────────────────────────────
const showGuidelinesModal = ref(false)

// ── Simulation Modal – real interactive components per question ───────────────
const showSimulationModal = ref(false)

// Lazy-load the correct simulation component based on the question slug
const simulationComponent = shallowRef<Component | null>(null)

async function openSimulationModal() {
  showSimulationModal.value = true
  if (simulationComponent.value) return // already loaded
  const map: Record<string, () => Promise<{ default: Component }>> = {
    'design-tic-tac-toe':         () => import('~/components/SystemDesign/Simulations/TicTacToe.vue'),
    'design-url-shortener':       () => import('~/components/SystemDesign/Simulations/UrlShortener.vue'),
    'design-rate-limiter':        () => import('~/components/SystemDesign/Simulations/RateLimiter.vue'),
    'design-lru-cache':           () => import('~/components/SystemDesign/Simulations/LruCache.vue'),
    'design-parking-lot':         () => import('~/components/SystemDesign/Simulations/ParkingLot.vue'),
    'design-chat-application':    () => import('~/components/SystemDesign/Simulations/ChatApp.vue'),
    'design-snake-and-ladder':    () => import('~/components/SystemDesign/Simulations/SnakeAndLadder.vue'),
    'design-minesweeper':         () => import('~/components/SystemDesign/Simulations/Minesweeper.vue'),
    'design-bloom-filter':        () => import('~/components/SystemDesign/Simulations/BloomFilter.vue'),
    'design-autocomplete':        () => import('~/components/SystemDesign/Simulations/Autocomplete.vue'),
    'design-search-engine':       () => import('~/components/SystemDesign/Simulations/SearchEngine.vue'),
    'design-atm':                 () => import('~/components/SystemDesign/Simulations/AtmMachine.vue'),
    'design-vending-machine':     () => import('~/components/SystemDesign/Simulations/VendingMachine.vue'),
    'design-elevator':            () => import('~/components/SystemDesign/Simulations/Elevator.vue'),
    'design-traffic-control':     () => import('~/components/SystemDesign/Simulations/TrafficControl.vue'),
    'design-coffee-machine':      () => import('~/components/SystemDesign/Simulations/CoffeeMachine.vue'),
    'design-pub-sub':             () => import('~/components/SystemDesign/Simulations/PubSub.vue'),
    'design-notification-system': () => import('~/components/SystemDesign/Simulations/NotificationSystem.vue'),
  }
  const loader = map[slug]
  if (loader) {
    const mod = await loader()
    simulationComponent.value = mod.default
  } else {
    simulationComponent.value = null // question has no simulation
  }
}

// ── Stage Tooltip State – Teleport-based to escape overflow clipping ──────────
const activeTooltipStep = ref<string | null>(null)
const tooltipPos = ref({ top: 0, left: 0 })

function toggleTooltip(e: MouseEvent, id: string) {
  if (activeTooltipStep.value === id) {
    activeTooltipStep.value = null
    return
  }
  const btn = (e.currentTarget as HTMLElement)
  const rect = btn.getBoundingClientRect()
  // Position the tooltip below the pill, aligned left, but clamped to viewport
  const left = Math.min(rect.left, window.innerWidth - 336)
  tooltipPos.value = { top: rect.bottom + 8 + window.scrollY, left: Math.max(8, left) }
  activeTooltipStep.value = id
}

// Close tooltip when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.step-pill-wrapper')) {
      activeTooltipStep.value = null
    }
  })
}


// ── Stage Info Data ───────────────────────────────────────────────────────────
interface StageInfo {
  icon: string; color: string; duration: string
  what: string; expected: string[]; tips: string[]; scoringFocus: string
}

const lldStageInfo: Record<string, StageInfo> = {
  requirements: {
    icon: 'heroicons:clipboard-document-list', color: 'text-green-400',
    duration: '~5 min',
    what: 'Identify what the system must do (functional) and quality attributes it must meet (non-functional).',
    expected: [
      '4–6 functional requirements (core user actions)',
      '3–4 non-functional requirements (thread safety, modularity, extensibility)',
      'Mention constraints: in-memory vs persistent, concurrent access',
    ],
    tips: [
      'Nouns in the problem → data models; verbs → operations',
      'Ask: who are the actors? what are the key use cases?',
      'State assumptions explicitly — interviewers reward clarity',
    ],
    scoringFocus: 'Completeness of FR/NFR coverage and clarity of constraints',
  },
  entities: {
    icon: 'heroicons:rectangle-group', color: 'text-blue-400',
    duration: '~5 min',
    what: 'Identify the core domain objects and interfaces that will form your class hierarchy.',
    expected: [
      '4–8 core entities with names and 1-line descriptions',
      'Distinguish value objects, domain entities, services, repositories',
      'Avoid a "God object" — each entity should have one clear responsibility',
    ],
    tips: [
      'Extract nouns from requirements — these are candidate entities',
      'Group by domain layer: model, service, repository, factory',
      'If unsure, lean toward more fine-grained entities (easier to merge later)',
    ],
    scoringFocus: 'Entity cohesion, correct abstraction level, SRP adherence',
  },
  classes: {
    icon: 'heroicons:code-bracket-square', color: 'text-purple-400',
    duration: '~10–15 min',
    what: 'Design the full class hierarchy, attributes, methods, and relationships including design patterns.',
    expected: [
      'Classes with typed attributes and method signatures',
      'Explicit relationships: inheritance, composition, aggregation, dependency',
      'At least one design pattern (Strategy, Observer, Factory, Builder…)',
      'Interfaces to enforce contracts (key for OCP and DIP)',
    ],
    tips: [
      'Favour composition over inheritance unless true IS-A relationship',
      'Each class should have a single, named responsibility',
      'Use interfaces at every cross-cutting boundary (storage, encoding, validation)',
    ],
    scoringFocus: 'SOLID adherence, pattern appropriateness, interface design quality',
  },
  code: {
    icon: 'heroicons:command-line', color: 'text-orange-400',
    duration: '~15–20 min',
    what: 'Implement the core classes with real, compilable code following OOP best practices.',
    expected: [
      'Complete, production-quality implementation of 3–5 key classes',
      'Constructor-injected dependencies (DI pattern)',
      'Guard clauses and domain-specific exceptions',
      'Thread safety where relevant (volatile, synchronized, ConcurrentHashMap)',
    ],
    tips: [
      'Start with the domain model, then services, then factories',
      'Favour immutability for value objects — use final fields',
      'Add a brief main() or test block to show usage',
    ],
    scoringFocus: 'Code correctness, exception handling, immutability, concurrency awareness',
  },
}

const hldStageInfo: Record<string, StageInfo> = {
  requirements: {
    icon: 'heroicons:clipboard-document-list', color: 'text-green-400',
    duration: '~5 min',
    what: 'Define what the system must do at scale: user-facing features and system quality targets.',
    expected: [
      '4–6 functional requirements (core API actions, user journeys)',
      '4–5 non-functional requirements with concrete numbers: 100M DAU, p99 < 100ms, 99.99% uptime',
      'Explicit scope decisions: what\'s out of scope?',
      'Capacity estimation: storage per day, peak RPS, bandwidth',
    ],
    tips: [
      'Always anchor NFRs to numbers — "fast" is not an NFR, "p99 < 50ms" is',
      'Estimate scale early: it drives every architectural decision below',
      'State assumed read:write ratio (e.g., 100:1 for this system)',
    ],
    scoringFocus: 'Concreteness of NFRs, scale estimation accuracy, scope clarity',
  },
  api: {
    icon: 'heroicons:arrows-right-left', color: 'text-cyan-400',
    duration: '~7 min',
    what: 'Define the RESTful API contract: endpoints, methods, request/response shapes, auth, and versioning.',
    expected: [
      '4–6 endpoints covering all core functional requirements',
      'Correct HTTP semantics (GET/POST/PUT/DELETE), versioned paths (/v1/…)',
      'Request body fields and response field names',
      'Authentication strategy: JWT Bearer token / API Key in header',
      'Rate limiting: X-RateLimit-Limit / X-RateLimit-Remaining headers',
    ],
    tips: [
      'Use nouns for resources (/urls/:id), not verbs (/getUrl)',
      'Mention idempotency for write operations (PUT/DELETE)',
      'Call out pagination strategy for list endpoints (cursor vs offset)',
    ],
    scoringFocus: 'REST correctness, completeness vs requirements, versioning and auth strategy',
  },
  architecture: {
    icon: 'heroicons:server-stack', color: 'text-indigo-400',
    duration: '~10 min',
    what: 'Design the high-level component diagram and justify every architectural decision.',
    expected: [
      'Full component flow: Client → CDN → Load Balancer → API Gateway → Services → DB/Cache',
      'Service decomposition rationale (monolith vs microservices)',
      'CAP theorem positioning: which guarantee do you sacrifice and why?',
      'Fault tolerance: circuit breaker, retry with exponential backoff, health checks',
      'Async processing: where do you use a message queue?',
    ],
    tips: [
      'Draw the data-path first (read), then the write path',
      'For URL shortener, explain redirect flow specifically (301 vs 302)',
      'Mention stateless application servers (horizontal scaling)',
    ],
    scoringFocus: 'Component completeness, data flow clarity, trade-off justification, fault tolerance',
  },
  database: {
    icon: 'heroicons:circle-stack', color: 'text-amber-400',
    duration: '~7 min',
    what: 'Choose and justify primary + secondary storage, schema design, and data access patterns.',
    expected: [
      'Primary DB choice with SQL vs NoSQL justification tied to access patterns',
      'Key schema fields and their data types',
      'Indexing strategy: which columns get indexes and why',
      'Sharding key choice with justification',
      'Read replica count for the expected read:write ratio',
      'Secondary stores: object store (S3) for large blobs, search index if needed',
    ],
    tips: [
      'For write-heavy: Cassandra/DynamoDB; for complex queries: PostgreSQL',
      'Always justify sharding key — hotspot vs even distribution',
      'Mention write-ahead log (WAL) for data durability',
    ],
    scoringFocus: 'DB choice justification, schema quality, index strategy, sharding approach',
  },
  'deep-dive': {
    icon: 'heroicons:bolt', color: 'text-yellow-400',
    duration: '~8 min',
    what: 'Design the multi-layer caching strategy to handle high read traffic efficiently.',
    expected: [
      'Cache layers: CDN edge cache → Nginx reverse proxy cache → Redis application cache',
      'Eviction policy choice: LRU or LFU with justification',
      'TTL values for each cache tier',
      'Invalidation strategy: write-through, write-behind, or cache-aside — justify which',
      'Thundering herd prevention: distributed mutex lock or probabilistic early expiry',
    ],
    tips: [
      'Cache-aside is most flexible but risks stale reads — state your mitigation',
      'For URL shortener: cache popular short codes in Redis with 24h TTL',
      'Mention cache warming for newly deployed instances',
    ],
    scoringFocus: 'Cache topology, invalidation correctness, thundering herd handling',
  },
  analytics: {
    icon: 'heroicons:chart-bar', color: 'text-pink-400',
    duration: '~8 min',
    what: 'Design a real-time click-count analytics pipeline from event ingestion to dashboard query API.',
    expected: [
      'Event ingestion: Kafka topics partitioned by URL hash for ordered fan-out',
      'Real-time aggregation: count-min sketch (approximate) or exact Redis INCR for hot URLs',
      'Batch layer: Spark/Flink jobs for hourly/daily rollups stored in ClickHouse or Apache Druid',
      'Cold storage strategy for historical data (S3 + Parquet)',
      'Query API design for dashboards: time-windowed aggregation endpoints',
    ],
    tips: [
      'Mention Lambda architecture (speed layer + batch layer) for reconciliation',
      'HyperLogLog for unique visitor counts (memory-efficient)',
      'Druid over Cassandra for OLAP-style time-series queries',
    ],
    scoringFocus: 'Ingestion scalability, counting accuracy vs cost trade-off, query efficiency',
  },
}

const currentStageInfo = computed<StageInfo | null>(() => {
  const map = isLLD.value ? lldStageInfo : hldStageInfo
  return map[activeStepId.value] || null
})



async function callStepEval(stepId: string, stepData: unknown): Promise<boolean> {
  const currentCount = stepEvalCounts.value[stepId] || 0
  if (currentCount >= MAX_STEP_EVALS) {
    stepError.value[stepId] = `Maximum evaluation attempts (${MAX_STEP_EVALS}) reached for this step to control API usage.`
    return false
  }

  stepEvaluating.value[stepId] = true
  stepError.value[stepId] = ''
  showGlobalLoader('Evaluating your step response...')
  try {
    const result = await $fetch<StepResult>('/api/system-design/evaluate-step', {
      method: 'POST',
      body: {
        questionTitle: question.title,
        questionDescription: question.description,
        // Use effective session type so step prompts match the interview mode
        designType: isLLD.value ? 'LLD' : 'HLD',
        difficulty: selectedDifficulty.value,
        language: codeLanguage.value,
        stepId,
        stepData: stepData,
      }
    })
    stepResults.value[stepId] = result
    stepEvalCounts.value[stepId] = currentCount + 1
    // Persist step result to localStorage so it survives page refresh
    if (typeof window !== 'undefined') {
      const stepKey = `sd_step_${slug}_${isLLD.value ? 'lld' : 'hld'}`
      const saved = JSON.parse(localStorage.getItem(stepKey) || '{}')
      saved[stepId] = result
      localStorage.setItem(stepKey, JSON.stringify(saved))
    }
    showAnalysisHub.value = true
    return true
  } catch (err: any) {
    // Handle both Nuxt server errors (statusMessage) and Netlify function errors (message)
    stepError.value[stepId] = err?.data?.statusMessage || err?.data?.message || err?.message || 'Evaluation failed. Please try again.'
    return false
  } finally {
    stepEvaluating.value[stepId] = false
    hideGlobalLoader()
  }
}

// ── LLD – Requirements Step ──────────────────────────────────────────────────
const functionalReqs = ref<string[]>(['', '', '', ''])
const nonFunctionalReqs = ref<string[]>(['', '', ''])

const MIN_FUNC_REQS = 4
const MIN_NON_FUNC_REQS = 3
const MIN_REQ_CHARS = 10

const validFuncReqs = computed(() => functionalReqs.value.filter(r => r.trim().length >= MIN_REQ_CHARS))
const validNonFuncReqs = computed(() => nonFunctionalReqs.value.filter(r => r.trim().length >= MIN_REQ_CHARS))
const canEvaluateReqs = computed(() =>
  validFuncReqs.value.length >= MIN_FUNC_REQS &&
  validNonFuncReqs.value.length >= MIN_NON_FUNC_REQS
)

function addReq(arr: string[]) { arr.push('') }
function removeReq(arr: string[], i: number) { if (arr.length > 1) arr.splice(i, 1) }

async function submitRequirements() {
  if (!canEvaluateReqs.value) {
    stepError.value['requirements'] = `Need ${MIN_FUNC_REQS} functional (${validFuncReqs.value.length}/${MIN_FUNC_REQS}) and ${MIN_NON_FUNC_REQS} non-functional (${validNonFuncReqs.value.length}/${MIN_NON_FUNC_REQS}) requirements, each at least ${MIN_REQ_CHARS} characters.`
    return
  }
  stepError.value['requirements'] = ''

  const ok = await callStepEval('requirements', {
    functional: validFuncReqs.value,
    nonFunctional: validNonFuncReqs.value,
  })
  if (ok) {
    steps.value[activeStepIndex.value].skipped = false
    unlockNext()
  }
}

function skipStep() {
  stepResults.value[activeStepId.value] = null
  stepError.value[activeStepId.value] = ''
  steps.value[activeStepIndex.value].skipped = true
  unlockNext()
  goToStep(steps.value[activeStepIndex.value + 1]?.id)
}

// ── LLD – Entities Step ──────────────────────────────────────────────────────
const entities = ref<{ name: string; description: string }[]>([
  { name: '', description: '' },
  { name: '', description: '' },
  { name: '', description: '' },
])
const MIN_ENTITIES = 3
const MIN_ENTITY_DESC_CHARS = 10

function isEntityValid(e: { name: string; description: string }) {
  return e.name.trim().length >= 2 && e.description.trim().length >= MIN_ENTITY_DESC_CHARS
}
const validEntities = computed(() => entities.value.filter(isEntityValid))
const canEvaluateEntities = computed(() => validEntities.value.length >= MIN_ENTITIES)

function addEntity() { entities.value.push({ name: '', description: '' }) }
function removeEntity(i: number) { if (entities.value.length > 1) entities.value.splice(i, 1) }
async function submitEntities() {
  if (!canEvaluateEntities.value) {
    stepError.value['entities'] = `Add at least ${MIN_ENTITIES} entities with a name (≥2 chars) and description (≥${MIN_ENTITY_DESC_CHARS} chars) each.`
    return
  }
  stepError.value['entities'] = ''
  const ok = await callStepEval('entities', validEntities.value)
  if (ok) { unlockNext() }
}

// ── LLD – Classes Step ───────────────────────────────────────────────────────
const classesTab = ref<'classes' | 'relationships' | 'patterns'>('classes')
const classDefs = ref<{ type: string; name: string }[]>([
  { type: 'Class', name: '' },
  { type: 'Class', name: '' },
  { type: 'Class', name: '' },
])
const relationships = ref<{ from: string; to: string; relType: string }[]>([
  { from: '', to: '', relType: 'extends' },
  { from: '', to: '', relType: 'uses (dependency)' },
])
const selectedPatterns = ref<string[]>([])
const OOP_PATTERNS = ['Singleton','Factory','Builder','Observer','Strategy','Decorator','Adapter','Command','Composite','Proxy','Template Method','Iterator']
const REL_TYPES = ['extends','implements','has-a (composition)','uses (dependency)','association']

const MIN_CLASSES = 3
const MIN_RELATIONSHIPS = 2
const MIN_PATTERNS = 1

const validClasses = computed(() => classDefs.value.filter(c => c.name.trim().length >= 2))
const validRelationships = computed(() => relationships.value.filter(r => r.from.trim() && r.to.trim()))
const canEvaluateClasses = computed(() => 
  validClasses.value.length >= MIN_CLASSES && 
  validRelationships.value.length >= MIN_RELATIONSHIPS &&
  selectedPatterns.value.length >= MIN_PATTERNS
)

function addClassDef() { classDefs.value.push({ type: 'Class', name: '' }) }
function removeClassDef(i: number) { if (classDefs.value.length > 1) classDefs.value.splice(i, 1) }
function addRelationship() { relationships.value.push({ from: '', to: '', relType: 'association' }) }
function removeRelationship(i: number) { if (relationships.value.length > 1) relationships.value.splice(i, 1) }

function togglePattern(p: string) {
  const idx = selectedPatterns.value.indexOf(p)
  if (idx === -1) selectedPatterns.value.push(p)
  else selectedPatterns.value.splice(idx, 1)
}

async function submitClasses() {
  if (!canEvaluateClasses.value) {
    stepError.value['classes'] = `Required: ${MIN_CLASSES} classes (${validClasses.value.length}/${MIN_CLASSES}), ${MIN_RELATIONSHIPS} relationships (${validRelationships.value.length}/${MIN_RELATIONSHIPS}), and ${MIN_PATTERNS} pattern (${selectedPatterns.value.length}/${MIN_PATTERNS}).`
    return
  }
  stepError.value['classes'] = ''
  
  const ok = await callStepEval('classes', {
    classes: validClasses.value,
    relationships: validRelationships.value,
    patterns: selectedPatterns.value,
  })
  if (ok) { unlockNext() }
}

// ── Code Step (IDE Environment) ────────────────────────────────────────────────
const codeLanguage = ref('java')
const activeFilePath = ref('Main.java')
const openTabs = ref<string[]>(['Main.java'])
const codeFiles = ref([
  { path: 'Main.java', content: `/**\n * ${question.title}\n * Implement your solution here.\n */\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Initializing ${question.title}...");\n    }\n}` }
])

const expandedFolders = ref<Set<string>>(new Set(['src']))
const activeFile = computed(() => codeFiles.value.find(f => f.path === activeFilePath.value) || codeFiles.value[0])

// Sync tabs with active file
watch(activeFilePath, (newPath) => {
  if (newPath && !newPath.endsWith('.keep') && !openTabs.value.includes(newPath)) {
    openTabs.value.push(newPath)
  }
}, { immediate: true })

function closeTab(path: string) {
  openTabs.value = openTabs.value.filter(t => t !== path)
  if (activeFilePath.value === path) {
    activeFilePath.value = openTabs.value[openTabs.value.length - 1] || codeFiles.value[0]?.path || ''
  }
}

const breadcrumbs = computed(() => {
  if (!activeFilePath.value) return []
  return activeFilePath.value.split('/')
})

const LANGUAGES = [
  { id: 'java', label: 'Java', ext: '.java', icon: 'logos:java' },
  { id: 'python', label: 'Python', ext: '.py', icon: 'logos:python' },
  { id: 'javascript', label: 'JavaScript', ext: '.js', icon: 'logos:javascript' },
  { id: 'typescript', label: 'TypeScript', ext: '.ts', icon: 'logos:typescript-icon' },
  { id: 'cpp', label: 'C++', ext: '.cpp', icon: 'logos:c-plusplus' },
]

function getFileIcon(path: string) {
  if (path.endsWith('.java')) return 'logos:java'
  if (path.endsWith('.py')) return 'logos:python'
  if (path.endsWith('.js')) return 'logos:javascript'
  if (path.endsWith('.ts')) return 'logos:typescript-icon'
  if (path.endsWith('.cpp')) return 'logos:c-plusplus'
  return 'heroicons:document-text'
}

const fsModalParentPath = ref('')

function openNSModal(type: 'file' | 'folder', parentPath: string = '') {
  fsModalType.value = type
  fsModalName.value = ''
  fsModalError.value = ''
  fsModalParentPath.value = parentPath
  showNewFSModal.value = true
  // Focus after animation
  setTimeout(() => fsNameInputRef.value?.focus(), 100)
}

function addFile(parentPath: string = '') { 
  if (typeof parentPath !== 'string') parentPath = ''
  openNSModal('file', parentPath) 
}
function addFolder(parentPath: string = '') { 
  if (typeof parentPath !== 'string') parentPath = ''
  openNSModal('folder', parentPath) 
}

function confirmFSAction() {
  const name = fsModalName.value.trim()
  if (!name) {
    fsModalError.value = 'Name is required'
    return
  }

  const prefix = fsModalParentPath.value ? `${fsModalParentPath.value}/` : ''
  const fullPath = `${prefix}${name}`

  if (fsModalType.value === 'file') {
    // Ensure extension
    let finalPath = fullPath
    const ext = LANGUAGES.find(l => l.id === codeLanguage.value)?.ext || ''
    if (!name.includes('.')) finalPath += ext

    if (codeFiles.value.some(f => f.path === finalPath)) {
      fsModalError.value = 'File already exists!'
      return
    }
    
    codeFiles.value.push({ path: finalPath, content: `// Source code for ${name}\n` })
    activeFilePath.value = finalPath
    
    // Expand parent folders
    const parts = finalPath.split('/')
    if (parts.length > 1) {
      let currentPath = ''
      for (let i = 0; i < parts.length - 1; i++) {
          currentPath += (currentPath ? '/' : '') + parts[i]
          expandedFolders.value.add(currentPath)
      }
    }
  } else {
    // Folder action - Create a hidden .keep file instead of README
    const keepFile = `${fullPath}/.keep`
    
    if (codeFiles.value.some(f => f.path.startsWith(fullPath + '/'))) {
      fsModalError.value = 'Folder already exists!'
      return
    }

    codeFiles.value.push({ path: keepFile, content: '' })
    
    // Expand all levels
    const parts = fullPath.split('/')
    let currentPath = ''
    for (const part of parts) {
      currentPath += (currentPath ? '/' : '') + part
      expandedFolders.value.add(currentPath)
    }
  }

  showNewFSModal.value = false
}

function deleteFile(path: string) {
  if (codeFiles.value.length <= 1) return
  const idx = codeFiles.value.findIndex(f => f.path === path)
  codeFiles.value.splice(idx, 1)
  if (activeFilePath.value === path) {
    activeFilePath.value = codeFiles.value[0].path
  }
}

function toggleFolder(path: string) {
  if (expandedFolders.value.has(path)) expandedFolders.value.delete(path)
  else expandedFolders.value.add(path)
}

function changeLang(id: string) {
  codeLanguage.value = id
  const ext = LANGUAGES.find(l => l.id === id)?.ext || '.txt'
  codeFiles.value = [
    { path: `Main${ext}`, content: `// Start implementing ${question.title} in ${id}\n` }
  ]
  activeFilePath.value = `Main${ext}`
}

async function exportProject() {
  const JSZip = (window as any).JSZip
  if (!JSZip) {
    alert('Export engine is initializing. Please try again in a few seconds.')
    return
  }

  const zip = new JSZip()
  codeFiles.value.forEach(file => {
    // Only export real files (skip .keep placeholders)
    if (!file.path.endsWith('.keep')) {
      zip.file(file.path, file.content)
    }
  });

  // Include project metadata for seamless re-import
  const meta = {
    projectName: question.title,
    slug: question.slug,
    language: codeLanguage.value,
    files: codeFiles.value,
    version: '1.0.0'
  }
  zip.file('.design-config.json', JSON.stringify(meta, null, 2))

  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = `${question.slug}-architecture.zip`
  a.click()
  URL.revokeObjectURL(url)
}

function triggerImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,.zip'
  input.onchange = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.name.endsWith('.json')) {
      const reader = new FileReader()
      reader.onload = (re: any) => {
        try {
          const data = JSON.parse(re.target.result)
          if (data.files && Array.isArray(data.files)) {
            codeFiles.value = data.files
            if (data.language) codeLanguage.value = data.language
            activeFilePath.value = codeFiles.value[0].path
            refreshExpandedFolders()
          }
        } catch (err) { alert('Invalid JSON architecture file.') }
      }
      reader.readAsText(file)
    } else if (file.name.endsWith('.zip')) {
      const JSZip = (window as any).JSZip
      if (!JSZip) { alert('ZIP engine not ready.'); return }
      
      try {
        const zip = await JSZip.loadAsync(file)
        const newFiles: any[] = []
        
        const configFile = zip.file('.design-config.json')
        if (configFile) {
          const data = JSON.parse(await configFile.async('string'))
          codeFiles.value = data.files
          codeLanguage.value = data.language || codeLanguage.value
          activeFilePath.value = codeFiles.value[0].path
        } else {
          for (const [path, f] of Object.entries(zip.files) as [string, any][]) {
            if (!f.dir && !path.startsWith('__MACOSX')) {
              newFiles.push({ path, content: await f.async('string') })
            }
          }
          if (newFiles.length > 0) {
            codeFiles.value = newFiles
            activeFilePath.value = newFiles[0].path
          }
        }
        refreshExpandedFolders()
      } catch (err) { alert('Failed to parse ZIP architecture.') }
    }
  }
  input.click()
}

function triggerFolderImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.setAttribute('webkitdirectory', '')
  input.setAttribute('directory', '')
  input.onchange = async (e: any) => {
    const files = Array.from(e.target.files) as File[]
    if (files.length === 0) return

    const newFiles: any[] = []
    for (const f of files) {
      // Remove root folder from path
      const path = f.webkitRelativePath.split('/').slice(1).join('/')
      if (!path) continue
      newFiles.push({ path, content: await f.text() })
    }

    if (newFiles.length > 0) {
      codeFiles.value = newFiles
      activeFilePath.value = newFiles[0].path
      refreshExpandedFolders()
    }
  }
  input.click()
}

function refreshExpandedFolders() {
  codeFiles.value.forEach(f => {
    const parts = f.path.split('/')
    let curr = ''
    for(let i=0; i<parts.length-1; i++) {
        curr += (curr ? '/' : '') + parts[i]
        expandedFolders.value.add(curr)
    }
  })
}

// ── File Tree Generation ─────────────────────────────────────────────────────
const fileTree = computed(() => {
  const root: any[] = []
  
  codeFiles.value.forEach(file => {
    const parts = file.path.split('/')
    let currentLevel = root
    let currentPath = ''
    
    parts.forEach((part, i) => {
      currentPath += (currentPath ? '/' : '') + part
      const isLast = i === parts.length - 1
      
      let existing = currentLevel.find(item => item.name === part)
      
      if (!existing) {
        existing = {
          name: part,
          path: currentPath,
          type: isLast ? 'file' : 'folder',
          children: isLast ? undefined : []
        }
        currentLevel.push(existing)
        // Sort: folders first, then files alphabetically
        currentLevel.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
          return a.name.localeCompare(b.name)
        })
      }
      
      if (!isLast) {
        currentLevel = existing.children
      }
    })
  })
  
  return root
})

const canEvaluateCode = computed(() => {
  const totalLength = codeFiles.value.reduce((acc, f) => acc + f.content.trim().length, 0)
  return totalLength > 100 && codeFiles.value.length >= 1
})

async function submitCode() {
  if (!canEvaluateCode.value) {
    stepError.value['code'] = 'Your implementation seems too incomplete. Create at least 1-2 files and write some meaningful logic (100+ chars).'
    return
  }
  stepError.value['code'] = ''
  
  // Combine all files for AI context
  const combinedCode = codeFiles.value.map(f => `// --- FILE: ${f.path} ---\n${f.content}`).join('\n\n')
  
  const ok = await callStepEval('code', { language: codeLanguage.value, code: combinedCode })
  if (ok) { 
    currentStepResult.value = stepResults.value['code']
    // showStepResultModal.value = true // Removed in favor of in-situ scorecard
    unlockNext() 
  }
}

// ── HLD – Steps ──────────────────────────────────────────────────────────────
const hldApiEndpoints = ref<{ method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; path: string; description: string }[]>([
  { method: 'GET', path: '/api/v1/resource', description: '' }
])
const hldArchitecture = ref('')

function addEndpoint() { hldApiEndpoints.value.push({ method: 'GET', path: '', description: '' }) }
function removeEndpoint(i: number) { if (hldApiEndpoints.value.length > 1) hldApiEndpoints.value.splice(i, 1) }

// --- Rich Database Storage System ---
interface DBColumn { name: string; type: string; isPrimary: boolean; isNullable: boolean; isIndexed: boolean }
interface DBTable { name: string; columns: DBColumn[] }
interface DBStorage { id: string; type: string; tech: string; icon: string; category: string; tables: DBTable[] }

const hldDatabaseStorage = ref<DBStorage[]>([])
const activeStorageIdx = ref(0)
const hldDeepDive = ref('')
const hldAnalytics = ref('')

const STORAGE_CATALOG = [
  { group: 'SQL Database', items: [
    { name: 'PostgreSQL', icon: 'logos:postgresql', type: 'SQL' },
    { name: 'MySQL', icon: 'logos:mysql', type: 'SQL' },
    { name: 'Oracle', icon: 'logos:oracle', type: 'SQL' }
  ]},
  { group: 'NoSQL Database', items: [
    { name: 'MongoDB', icon: 'logos:mongodb-icon', type: 'Document' },
    { name: 'Cassandra', icon: 'logos:cassandra', type: 'Wide-Column' },
    { name: 'DynamoDB', icon: 'logos:aws-dynamodb', type: 'Key-Value' },
    { name: 'ScyllaDB', icon: 'logos:scylladb', type: 'Wide-Column' }
  ]},
  { group: 'Cache', items: [
    { name: 'Redis', icon: 'logos:redis', type: 'In-Memory' },
    { name: 'Memcached', icon: 'logos:memcached', type: 'In-Memory' },
    { name: 'Dragonfly', icon: 'heroicons:bolt-solid', type: 'In-Memory' }
  ]},
  { group: 'Search Engine', items: [
    { name: 'ElasticSearch', icon: 'logos:elasticsearch', type: 'Search' },
    { name: 'OpenSearch', icon: 'logos:opensearch', type: 'Search' },
    { name: 'Meilisearch', icon: 'heroicons:magnifying-glass-circle', type: 'Search' }
  ]},
  { group: 'Object Storage', items: [
    { name: 'AWS S3', icon: 'logos:aws-s3', type: 'Object' },
    { name: 'Google Cloud Storage', icon: 'logos:google-cloud', type: 'Object' },
    { name: 'MinIO', icon: 'heroicons:square-3-stack-3d', type: 'Object' }
  ]},
  { group: 'Message Queue', items: [
    { name: 'Kafka', icon: 'logos:kafka-icon', type: 'Stream' },
    { name: 'RabbitMQ', icon: 'logos:rabbitmq-icon', type: 'Queue' },
    { name: 'Pulsar', icon: 'heroicons:signal', type: 'Stream' }
  ]}
]

const COLUMN_TYPES = ['VARCHAR(255)', 'TEXT', 'INT', 'SERIAL', 'BOOLEAN', 'TIMESTAMP', 'JSONB', 'UUID', 'FLOAT', 'DECIMAL']

function addStorage(tech: string, icon: string, category: string, type: string) {
  hldDatabaseStorage.value.push({
    id: Math.random().toString(36).substr(2, 9),
    tech, icon, category, type,
    tables: []
  })
  activeStorageIdx.value = hldDatabaseStorage.value.length - 1
  showStorageDropdown.value = false
}

function removeStorage(i: number) { 
  hldDatabaseStorage.value.splice(i, 1)
  if (activeStorageIdx.value >= hldDatabaseStorage.value.length) {
    activeStorageIdx.value = Math.max(0, hldDatabaseStorage.value.length - 1)
  }
}

function addTable(storageIdx: number) {
  hldDatabaseStorage.value[storageIdx].tables.push({
    name: 'new_table',
    columns: [{ name: 'id', type: 'SERIAL', isPrimary: true, isNullable: false, isIndexed: true }]
  })
}

function addColumn(storageIdx: number, tableIdx: number) {
  hldDatabaseStorage.value[storageIdx].tables[tableIdx].columns.push({
    name: 'new_column', type: 'VARCHAR(255)', isPrimary: false, isNullable: true, isIndexed: false
  })
}

const EXCALIDRAW_URL_BASE = "https://excalidraw.com?theme=dark&zoom=0.7"
function getWhiteboardUrl(stepId: string) {
  // Excalidraw needs a specific hash format for isolation: #room=ID,KEY
  // - ID must be stable and unique to the step
  // - KEY must be exactly 22 characters
  const cleanSlug = slug.replace(/[^a-z0-9]/gi, '').toLowerCase()
  const cleanStep = stepId.replace(/[^a-z0-9]/gi, '').toLowerCase()
  
  // Ensure stepId is at the front so it's never cut off by the substring
  const roomId = `${cleanStep}_${cleanSlug}`.substring(0, 20).padEnd(20, '0')
  const key = `${cleanStep}${cleanSlug}boardsecret`.substring(0, 22).padEnd(22, 'x')
  
  return `${EXCALIDRAW_URL_BASE}#room=${roomId},${key}`
}
const EXCALIDRAW_LIBRARIES = `https://libraries.excalidraw.com/?target=_blank&referrer=https%3A%2F%2Frahulaher.netlify.app%2Fsystem-design%2Fpractice%2F${slug}&useHash=true&token=_GiFZuhUvGZYG2NBOXls2&theme=light&version=2&sort=default`

async function submitHldStep(stepId: string, content: any, minLength = 50) {
  if (typeof content === 'string') {
    if (!content.trim() || content.trim().length < minLength) {
      stepError.value[stepId] = `Please write at least ${minLength} characters for a meaningful answer.`
      return
    }
  } else if (Array.isArray(content)) {
    if (content.length === 0) {
       stepError.value[stepId] = `Please add at least one entry.`
       return
    }
  }
  
  stepError.value[stepId] = ''
  
  // For requirements, we want to structure it for the AI
  const data = stepId === 'requirements' ? { functional: [content], nonFunctional: [] } : content
  
  const ok = await callStepEval(stepId, data)
  if (ok) { unlockNext() }
}

// ── Evaluation ───────────────────────────────────────────────────────────────
const evaluating = ref(false)
const evaluation = ref<any>(null)
const evalError = ref('')
const showEvalModal = ref(false)
const showStepResultModal = ref(false)
const currentStepResult = ref<StepResult | null>(null)
const showRestrictionModal = ref(false)

// ── Global Loading Overlay ─────────────────────────────────────────────────
const globalLoading = ref(false)
const loadingMessage = ref('Analysing your solution...')

function showGlobalLoader(msg = 'Analysing your solution...') {
  loadingMessage.value = msg
  globalLoading.value = true
}
function hideGlobalLoader() {
  globalLoading.value = false
}

// ── Read-Only Mode (already attempted) ────────────────────────────────────
const isReadOnly = ref(false)

const averageScore = computed(() => {
  const evaluatedSteps = steps.value.filter(s => stepResults.value[s.id])
  if (evaluatedSteps.length === 0) return 0
  const sum = evaluatedSteps.reduce((acc, s) => acc + (stepResults.value[s.id]?.score || 0), 0)
  return sum / evaluatedSteps.length
})

const allStepsCompleted = computed(() => {
  // 1. All steps must have a result or be skipped
  const allTouched = steps.value.every(s => stepResults.value[s.id] !== undefined || s.skipped)
  if (!allTouched) return false

  // 2. Must not have too many skipped steps (e.g., at least 75% steps must be evaluated)
  const skippedCount = steps.value.filter(s => s.skipped).length
  if (skippedCount > steps.value.length / 2) return false

  // 3. Average score must be >= 5 (half marks)
  if (averageScore.value < 5) return false

  return true
})

const evalRestrictionReason = computed(() => {
  const evaluatedSteps = steps.value.filter(s => stepResults.value[s.id] !== undefined || s.skipped)
  if (evaluatedSteps.length < steps.value.length) {
    return `Complete ${steps.value.length - evaluatedSteps.length} more step(s).`
  }
  const skippedCount = steps.value.filter(s => s.skipped).length
  if (skippedCount > steps.value.length / 2) {
    return `Too many skipped steps. Evaluate at least ${Math.ceil(steps.value.length / 2)} phases.`
  }
  if (averageScore.value < 5) {
    return `Average score too low (${averageScore.value.toFixed(1)}/10). Aim for at least 5.0 to generate report.`
  }
  return ''
})

async function evaluate() {
  if (evaluation.value) {
    showEvalModal.value = true
    return
  }

  // ⚠️ TESTING ONLY — restrictions bypassed. Restore the block below when done.
  if (!allStepsCompleted.value) {
    showRestrictionModal.value = true
    return
  }

  evaluating.value = true
  evalError.value = ''
  showGlobalLoader('Generating your full evaluation report...')
  try {
    const answers = isLLD.value ? {
      requirements: {
        functional: functionalReqs.value.filter(r => r.trim()),
        nonFunctional: nonFunctionalReqs.value.filter(r => r.trim()),
      },
      entities: entities.value.filter(e => e.name.trim()),
      classes: {
        classes: classDefs.value.filter(c => c.name.trim()),
        relationships: relationships.value.filter(r => r.from.trim() && r.to.trim()),
        patterns: selectedPatterns.value,
      },
      code: codeFiles.value.map(f => `// File: ${f.path}\n${f.content}`).join('\n\n'),
    } : {
      requirements: {
        functional: functionalReqs.value.filter(r => r.trim().length >= MIN_REQ_CHARS),
        nonFunctional: nonFunctionalReqs.value.filter(r => r.trim().length >= MIN_REQ_CHARS)
      },
      api: hldApiEndpoints.value,
      architecture: hldArchitecture.value,
      database: hldDatabaseStorage.value,
      deepDive: hldDeepDive.value,
      analytics: hldAnalytics.value,
    }

    const result = await $fetch('/api/system-design/evaluate', {
      method: 'POST',
      body: {
        questionTitle: question.title,
        questionDescription: question.description,
        // Send the effective interview type, NOT question.type ('Both' would wrongly trigger LLD)
        designType: isLLD.value ? 'LLD' : 'HLD',
        difficulty: selectedDifficulty.value,
        language: codeLanguage.value,
        answers,
      }
    })
    evaluation.value = result

    // Persist full evaluation + user answers to localStorage
    if (typeof window !== 'undefined') {
      const storageKey = `sd_eval_${slug}_${isLLD.value ? 'lld' : 'hld'}`
      localStorage.setItem(storageKey, JSON.stringify({
        evaluation: result,
        answers,
        timestamp: new Date().toISOString(),
        difficulty: selectedDifficulty.value,
        language: codeLanguage.value,
        designType: isLLD.value ? 'LLD' : 'HLD',
      }))
    }

    isReadOnly.value = true
    showEvalModal.value = true
    pauseTimer()
  } catch (err: any) {
    evalError.value = err?.data?.statusMessage || err?.data?.message || err?.message || 'Evaluation failed. Please try again.'
  } finally {
    evaluating.value = false
    hideGlobalLoader()
  }
}

const savedReportData = ref<{ timestamp: string; difficulty: string; language: string } | null>(null)

// ── Restore cached session on mount ────────────────────────────────────────
onMounted(() => {
  if (typeof window === 'undefined') return

  const effectiveMode = isLLD.value ? 'lld' : 'hld'
  const evalKey  = `sd_eval_${slug}_${effectiveMode}`
  const stepKey  = `sd_step_${slug}_${effectiveMode}`

  // 1. Restore final evaluation (marks question as attempted / read-only)
  const savedEval = localStorage.getItem(evalKey)
  if (savedEval) {
    try {
      const parsed = JSON.parse(savedEval)
      evaluation.value    = parsed.evaluation
      savedReportData.value = {
        timestamp:  parsed.timestamp,
        difficulty: parsed.difficulty || '',
        language:   parsed.language   || '',
      }
      isReadOnly.value = true

      // 2. Restore user answers so they can view (but not edit) their submission
      if (parsed.answers) {
        const a = parsed.answers
        if (isLLD.value) {
          functionalReqs.value    = a.requirements?.functional    || []
          nonFunctionalReqs.value = a.requirements?.nonFunctional || []
          entities.value          = a.entities  || []
          if (a.classes) {
            classDefs.value      = a.classes.classes       || []
            relationships.value  = a.classes.relationships || []
            selectedPatterns.value = a.classes.patterns    || []
          }
          // Code is restored read-only via the codeFiles ref
          if (a.code) {
            // The code was joined; restore it as a single visible file
            if (codeFiles.value.length > 0) codeFiles.value[0].content = a.code
          }
        } else {
          functionalReqs.value    = a.requirements?.functional    || []
          nonFunctionalReqs.value = a.requirements?.nonFunctional || []
          hldApiEndpoints.value   = a.api          || []
          hldArchitecture.value   = a.architecture || ''
          hldDatabaseStorage.value= a.database     || []
          hldDeepDive.value       = a.deepDive     || ''
          hldAnalytics.value      = a.analytics    || ''
        }
      }
    } catch (e) {
      console.error('Failed to parse saved evaluation:', e)
    }
  }

  // 3. Restore individual step AI results (even if final eval isn't done yet)
  const savedSteps = localStorage.getItem(stepKey)
  if (savedSteps) {
    try {
      const parsed = JSON.parse(savedSteps)
      Object.entries(parsed).forEach(([id, result]) => {
        stepResults.value[id] = result as StepResult
      })
    } catch (e) {
      console.error('Failed to parse saved step results:', e)
    }
  }

  // 4. Unlock steps that already have cached results so user can view previous work
  steps.value.forEach(step => {
    if (stepResults.value[step.id] !== undefined) {
      step.locked = false
    }
  })
})

async function downloadReport() {
  if (!evaluation.value) return
  try {
    const { downloadSystemDesignPDF } = await import('~/utils/pdfGenerator')
    // Use the effective session type so LLD/HLD PDF templates are always correct
    const effectiveType = isLLD.value ? 'LLD' : 'HLD'
    await downloadSystemDesignPDF(question.title, evaluation.value as any, effectiveType)
  } catch (err) {
    console.error('Download failed:', err)
  }
}



// ── Score helpers ────────────────────────────────────────────────────────────
function gradeColor(grade: string) {
  const map: Record<string, string> = { 'A+': 'text-emerald-400', A: 'text-green-400', B: 'text-blue-400', C: 'text-amber-400', D: 'text-orange-400', F: 'text-red-400' }
  return map[grade] || 'text-zinc-400'
}
function scoreBarWidth(score: number, max: number) { return Math.round((score / max) * 100) + '%' }
function scoreBarColor(pct: number) {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-zinc-950">

    <!-- ── GLOBAL LOADING OVERLAY ── -->
    <Transition name="fade-overlay">
      <div
        v-if="globalLoading"
        class="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex flex-col items-center justify-center gap-6 select-none"
        style="pointer-events: all;"
      >
        <!-- Animated ring + spinner -->
        <div class="relative w-24 h-24">
          <div class="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-ping" />
          <div class="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div class="absolute inset-2 rounded-full border-4 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" style="animation-duration: 0.6s; animation-direction: reverse;" />
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          </div>
        </div>
        <!-- Message -->
        <div class="text-center space-y-1">
          <p class="text-white font-semibold text-lg tracking-wide">{{ loadingMessage }}</p>
          <p class="text-zinc-400 text-sm">This may take 20–40 seconds. Please wait…</p>
        </div>
        <!-- Animated dots -->
        <div class="flex gap-2">
          <div class="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style="animation-delay: 0ms" />
          <div class="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style="animation-delay: 150ms" />
          <div class="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style="animation-delay: 300ms" />
        </div>
      </div>
    </Transition>

    <!-- ── READ-ONLY BANNER (question already attempted) ── -->
    <div
      v-if="isReadOnly"
      class="fixed top-0 inset-x-0 z-[200] bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-sm px-4 py-2 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-2 text-amber-400 text-sm font-medium">
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <span>
          <strong>Read-Only Mode</strong> — You have already submitted this question.
          <template v-if="savedReportData?.timestamp">
            Submitted {{ new Date(savedReportData.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}.
          </template>
          Your answers are displayed for review only.
        </span>
      </div>
      <button
        @click="showEvalModal = true"
        class="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
      >
        View Report →
      </button>
    </div>


    <div v-if="showDifficultyModal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <div class="flex items-start justify-between mb-6">
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-xs font-bold text-zinc-400 uppercase">{{ question.type }}</span>
              <span :class="['text-xs font-bold px-2 py-0.5 rounded', question.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10' : question.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10']">
                {{ question.difficulty }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-white">{{ question.title }}</h2>
            <p class="text-zinc-400 text-sm mt-1">{{ question.description }}</p>
          </div>
        </div>

        <div class="mb-6">
          <p class="text-sm font-semibold text-zinc-300 mb-3">Select your experience level:</p>
          <div class="flex flex-col gap-3">
            <label v-for="opt in difficultyOptions" :key="opt.id"
              :class="['border-2 rounded-xl p-4 cursor-pointer transition-all', selectedDifficulty === opt.id ? opt.color : 'border-zinc-700 hover:border-zinc-500']">
              <input type="radio" :value="opt.id" v-model="selectedDifficulty" class="sr-only" />
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold text-white text-sm">{{ opt.label }}</div>
                  <div class="text-xs text-zinc-400 mt-0.5">{{ opt.desc }}</div>
                </div>
                <div class="text-xs text-zinc-500 flex items-center gap-1">
                  <Icon name="heroicons:clock" class="text-xs" />
                  {{ opt.time }} min
                </div>
              </div>
            </label>
          </div>
        </div>

        <button @click="startInterview"
          class="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
          Start Interview
        </button>
        <NuxtLink to="/system-design/practice"
          class="block text-center mt-3 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Back to problems
        </NuxtLink>
      </div>
    </div>

    <!-- ── TOP BAR ── -->
    <div :class="['sticky z-40 bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center gap-3 flex-wrap', isReadOnly ? 'top-[36px]' : 'top-0']">
      <NuxtLink to="/system-design/practice"
        class="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1 flex-shrink-0">
        <Icon name="heroicons:arrow-left" class="text-sm" /> Back
      </NuxtLink>
      <div class="h-4 w-px bg-zinc-700 hidden sm:block" />
      <span class="font-bold text-white text-sm truncate">{{ question.title }}</span>
      <div class="flex items-center gap-1.5 ml-4">
        <!-- <button v-for="s in ['Guidelines', 'Ask AI']" :key="s"
          class="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-zinc-500 hover:text-white transition-colors">
          <Icon :name="s === 'Guidelines' ? 'heroicons:book-open' : 'heroicons:sparkles'" class="text-[10px]" />
          {{ s }}
        </button> -->
      </div>

      <div class="ml-auto flex items-center gap-2 flex-shrink-0">
        <!-- Difficulty Dropdown -->
        <div class="relative group">
           <button class="px-3 py-1.5 text-[10px] font-black uppercase text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center gap-2 hover:bg-zinc-700 transition-colors">
             <div :class="['w-1.5 h-1.5 rounded-full', selectedDifficulty === 'Junior' ? 'bg-green-400' : selectedDifficulty === 'Senior' ? 'bg-amber-400' : 'bg-red-400']"></div>
             {{ selectedDifficulty }}
             <Icon name="heroicons:chevron-down" class="text-zinc-600" />
           </button>
        </div>

        <!-- Timer Control -->
        <button @click="toggleTimer" :class="['flex items-center gap-1.5 text-sm font-mono px-3 py-1.5 rounded-lg border transition-all', timerRunning ? (timerWarning ? 'text-red-400 border-red-500/50 bg-red-500/10 animate-pulse' : 'text-zinc-300 border-zinc-700 bg-zinc-800') : 'text-amber-400 border-amber-500/40 bg-amber-500/10']">
          <Icon :name="timerRunning ? 'heroicons:pause' : 'heroicons:play'" class="text-sm" />
          {{ timerDisplay }}
        </button>

        <!-- Saved Badge / History -->
        <div v-if="savedReportData" @click="showEvalModal = true" class="cursor-pointer group relative">
          <div class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all">
            <Icon name="heroicons:cloud-arrow-down" class="text-xs" />
            History
          </div>
          <div class="absolute top-full right-0 mt-2 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-[60]">
             Last Audit: {{ new Date(savedReportData.timestamp).toLocaleString() }}
          </div>
        </div>

        <!-- Audit Hub Toggle -->
        <button v-if="Object.keys(stepResults).length > 0"
          @click="showAnalysisHub = true"
          class="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-all shadow-lg shadow-blue-500/5 mr-2">
          <Icon name="heroicons:cpu-chip" class="text-xs" />
          Audit Hub
        </button>

        <!-- Quit -->
        <button @click="showQuitModal = true"
          class="px-4 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg transition-colors">Quit</button>

        <!-- Guidelines button -->
        <button @click="showGuidelinesModal = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all">
          <Icon name="heroicons:book-open" class="text-xs" />
          Guidelines
        </button>

        <!-- Simulation button -->
        <button @click="openSimulationModal()"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded-lg hover:bg-violet-500/20 transition-all">
          <Icon name="heroicons:play-circle" class="text-xs" />
          Simulation
        </button>
      </div>
    </div>

    <!-- ── MAIN CONTENT ── -->
    <div v-if="!showDifficultyModal" :class="['relative flex flex-1 min-h-0 overflow-hidden', isReadOnly ? 'readonly-mask' : '']">
      
      <!-- Paused Overlay -->
      <transition name="fade">
        <div v-if="!timerRunning && timeLeft > 0"
          class="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div class="bg-zinc-900/50 border border-zinc-700 p-8 rounded-3xl shadow-2xl max-w-sm">
            <div class="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:pause" class="text-3xl text-amber-500" />
            </div>
            <h2 class="text-2xl font-black text-white mb-2">Interview Paused</h2>
            <p class="text-zinc-400 mb-6 text-sm">Take a breath. Review the problem description or guidelines. Your timer is stopped.</p>
            <button @click="resumeTimer" 
              class="w-full py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-500 transition-colors shadow-lg">
              Resume Interview
            </button>
          </div>
        </div>
      </transition>

      <!-- FAR LEFT ICON BAR -->
      <div class="w-12 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4 gap-4">
        <button @click="leftTab = 'guidelines'" :class="['p-2 rounded-lg transition-all', leftTab === 'guidelines' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-300']">
          <Icon name="heroicons:book-open" class="text-lg" />
        </button>
        <button @click="leftTab = 'description'" :class="['p-2 rounded-lg transition-all', leftTab === 'description' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-300']" title="Problem Description">
          <Icon name="heroicons:document-text" class="text-lg" />
        </button>
        <div class="mt-auto border-t border-zinc-900 pt-4 w-full flex flex-col items-center gap-4">
          <button @click="toggleSidebar" class="p-2 text-zinc-500 hover:text-white transition-colors" :title="isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'">
            <Icon :name="isSidebarCollapsed ? 'heroicons:chevron-double-right' : 'heroicons:chevron-double-left'" class="text-sm" />
          </button>
        </div>
      </div>

      <!-- LEFT PANEL – content -->
      <transition name="sidebar-slide">
        <div v-if="!isSidebarCollapsed" class="w-64 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 overflow-y-auto hidden md:flex flex-col">
        <div class="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/10">
           <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">{{ leftTab }}</span>
           <button @click="leftTab = leftTab === 'guidelines' ? 'description' : 'guidelines'" class="text-zinc-600 hover:text-zinc-400 italic text-[10px]">Switch</button>
        </div>

        <!-- Guidelines content -->
        <div v-if="leftTab === 'guidelines'" class="p-4">
          <div v-if="isLLD">
            <div class="mb-4">
              <h3 class="text-xs font-bold text-white mb-2">{{ activeStep.label }}</h3>
              <p class="text-xs text-zinc-400 leading-relaxed">{{ activeStep.subtitle }}</p>
            </div>
            <div v-if="activeStepId === 'requirements'" class="space-y-3 text-xs text-zinc-400">
              <div class="flex gap-2"><Icon name="heroicons:clock" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Spend ~5 minutes on this section</span></div>
              <div class="flex gap-2"><Icon name="heroicons:users" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Identify actors and use cases</span></div>
              <div class="flex gap-2"><Icon name="heroicons:cog-8-tooth" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Define constraints and data limits</span></div>
              <div class="flex gap-2"><Icon name="heroicons:exclamation-circle" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Consider edge cases and error scenarios</span></div>
              <div class="flex gap-2"><Icon name="heroicons:question-mark-circle" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Clarify ambiguities before designing</span></div>
            </div>
            <div v-else-if="activeStepId === 'entities'" class="space-y-3 text-xs text-zinc-400">
              <div class="flex gap-2"><Icon name="heroicons:light-bulb" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Nouns in requirements → candidate classes</span></div>
              <div class="flex gap-2"><Icon name="heroicons:rectangle-group" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Focus on 4–7 core entities only</span></div>
              <div class="flex gap-2"><Icon name="heroicons:circle-stack" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Separate data models from services</span></div>
            </div>
            <div v-else-if="activeStepId === 'classes'" class="space-y-3 text-xs text-zinc-400">
              <div class="flex gap-2"><Icon name="heroicons:clock" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Spend ~10–15 minutes here</span></div>
              <div class="flex gap-2"><Icon name="heroicons:code-bracket" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Define attributes and methods per class</span></div>
              <div class="flex gap-2"><Icon name="heroicons:arrows-pointing-in" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Use interfaces for contracts (SRP, OCP)</span></div>
              <div class="flex gap-2"><Icon name="heroicons:puzzle-piece" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Apply design patterns where appropriate</span></div>
            </div>
            <div v-else-if="activeStepId === 'code'" class="space-y-3 text-xs text-zinc-400">
              <div class="flex gap-2"><Icon name="heroicons:code-bracket-square" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Implement core classes and methods</span></div>
              <div class="flex gap-2"><Icon name="heroicons:shield-check" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Handle edge cases and null checks</span></div>
              <div class="flex gap-2"><Icon name="heroicons:beaker" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Add a simple test in main()</span></div>
            </div>
          </div>
          <div v-else class="space-y-3 text-xs text-zinc-400">
            <p class="text-xs font-bold text-white mb-2">{{ activeStep.label }}</p>
            <div class="flex gap-2"><Icon name="heroicons:clock" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Think out loud throughout</span></div>
            <div class="flex gap-2"><Icon name="heroicons:calculator" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Do back-of-envelope math</span></div>
            <div class="flex gap-2"><Icon name="heroicons:scale" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>State all trade-offs explicitly</span></div>
            <div class="flex gap-2"><Icon name="heroicons:arrow-trending-up" class="text-zinc-500 flex-shrink-0 mt-0.5" /><span>Start simple, then scale up</span></div>
          </div>
        </div>

        <!-- Problem description -->
        <div v-else class="p-4">
          <h3 class="text-xs font-bold text-white mb-2">Problem Statement</h3>
          <p class="text-xs text-zinc-400 leading-relaxed mb-3">{{ question.description }}</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="tag in question.tags" :key="tag" class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{{ tag }}</span>
          </div>
        </div>
      </div>
    </transition>

      <!-- RIGHT PANEL – steps workspace -->
      <div :class="['flex-1 flex flex-col bg-zinc-950 min-h-0', !isWhiteboardFullscreen ? 'transition-all duration-300' : '', activeStepId === 'code' ? 'overflow-hidden' : '']">
        <!-- Step progress breadcrumb WITH tooltip -->
        <div :class="['flex-shrink-0 flex items-center gap-1.5 overflow-x-auto custom-scrollbar border-b border-zinc-800/50 scroll-smooth px-4 py-2.5 bg-zinc-900/10']" style="flex-wrap: nowrap;">
          <div v-for="(step, i) in steps" :key="step.id" class="relative flex-shrink-0 step-pill-wrapper">
            <!-- Pill button -->
            <button
              @click="goToStep(step.id)"
              :class="[
                'flex items-center gap-2 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all whitespace-nowrap',
                step.id === activeStepId ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/10' :
                step.locked ? 'border-zinc-800 text-zinc-700 cursor-not-allowed opacity-50' :
                step.skipped ? 'border-zinc-700 text-zinc-500 line-through' :
                'border-zinc-800 text-zinc-500 hover:border-zinc-600 cursor-pointer'
              ]">
              <span :class="['w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]', step.id === activeStepId ? 'bg-white text-red-500' : 'bg-zinc-800 text-zinc-500']">{{ i + 1 }}</span>
              <span>{{ step.label }}</span>
            </button>
            <!-- Tooltip trigger (? icon) -->
            <button
              @click.stop="toggleTooltip($event, step.id)"
              class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-zinc-700 hover:bg-blue-500 text-white text-[8px] font-black flex items-center justify-center z-10 transition-colors"
              title="Stage info"
            >?</button>
            <!-- Tooltip popover (Teleported to body to avoid overflow clipping) -->
            <Teleport to="body">
              <Transition name="tooltip-pop">
                <div
                  v-if="activeTooltipStep === step.id"
                  class="fixed z-[9999] w-80 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-4 text-xs pointer-events-auto"
                  :style="{ top: tooltipPos.top + 'px', left: tooltipPos.left + 'px' }"
                >
                  <!-- Header -->
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <Icon :name="(isLLD ? lldStageInfo : hldStageInfo)[step.id]?.icon || 'heroicons:information-circle'" :class="[(isLLD ? lldStageInfo : hldStageInfo)[step.id]?.color || 'text-zinc-400', 'text-base']" />
                      <div>
                        <p class="font-black text-white leading-tight">{{ step.label }}</p>
                        <p class="text-zinc-500 text-[10px]">{{ (isLLD ? lldStageInfo : hldStageInfo)[step.id]?.duration }}</p>
                      </div>
                    </div>
                    <button @click.stop="activeTooltipStep = null" class="text-zinc-600 hover:text-white text-lg leading-none">&times;</button>
                  </div>
                  <!-- What is this stage -->
                  <p class="text-zinc-300 mb-3 leading-relaxed">{{ (isLLD ? lldStageInfo : hldStageInfo)[step.id]?.what }}</p>
                  <!-- Expected -->
                  <div class="mb-3">
                    <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">✅ What's Expected</p>
                    <ul class="space-y-1">
                      <li v-for="e in (isLLD ? lldStageInfo : hldStageInfo)[step.id]?.expected" :key="e" class="flex items-start gap-1.5 text-zinc-400">
                        <span class="text-green-400 mt-0.5 flex-shrink-0">›</span> {{ e }}
                      </li>
                    </ul>
                  </div>
                  <!-- Pro Tips -->
                  <div class="mb-3">
                    <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">💡 Pro Tips</p>
                    <ul class="space-y-1">
                      <li v-for="t in (isLLD ? lldStageInfo : hldStageInfo)[step.id]?.tips" :key="t" class="flex items-start gap-1.5 text-zinc-400">
                        <span class="text-amber-400 mt-0.5 flex-shrink-0">›</span> {{ t }}
                      </li>
                    </ul>
                  </div>
                  <!-- Scoring Focus -->
                  <div class="bg-zinc-800/60 rounded-xl p-2.5">
                    <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">🎯 Scoring Focus</p>
                    <p class="text-zinc-300">{{ (isLLD ? lldStageInfo : hldStageInfo)[step.id]?.scoringFocus }}</p>
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>
        </div>

        <div :class="['flex-1 min-h-0 flex flex-col', activeStepId === 'code' ? 'overflow-hidden' : 'overflow-y-auto p-4 pt-0']">

        <!-- ─ REQUIREMENTS STEP ─ -->
        <div v-if="activeStepId === 'requirements'">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">1</span>
            <h2 class="text-base font-bold text-white">{{ steps[0].label }}</h2>
          </div>
          <p class="text-xs text-zinc-500 ml-8 mb-5">{{ steps[0].subtitle }}</p>

          <div class="grid md:grid-cols-2 gap-4">
            <!-- Functional -->
            <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon name="heroicons:user-circle" class="text-green-400 text-sm" />
                <span class="text-xs font-bold text-white">Functional Requirements</span>
              </div>
              <div v-for="(req, i) in functionalReqs" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="functionalReqs[i]" placeholder="What should the system do?"
                  class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                <button @click="addReq(functionalReqs)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-red-500 text-white text-sm flex items-center justify-center transition-colors">+</button>
                <button v-if="functionalReqs.length > 1" @click="removeReq(functionalReqs, i)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-red-700 text-white text-sm flex items-center justify-center transition-colors">−</button>
              </div>
              <p class="text-[10px] text-zinc-600 mt-2">Examples: Support multiple players, Handle N×N board size</p>
            </div>

            <!-- Non-Functional -->
            <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <Icon name="heroicons:cog-6-tooth" class="text-blue-400 text-sm" />
                <span class="text-xs font-bold text-white">Non-Functional Requirements</span>
              </div>
              <div v-for="(req, i) in nonFunctionalReqs" :key="i" class="flex items-center gap-2 mb-2">
                <input v-model="nonFunctionalReqs[i]" placeholder="Modular, thread-safe, maintainable..."
                  class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500" />
                <button @click="addReq(nonFunctionalReqs)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-red-500 text-white text-sm flex items-center justify-center transition-colors">+</button>
                <button v-if="nonFunctionalReqs.length > 1" @click="removeReq(nonFunctionalReqs, i)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-red-700 text-white text-sm flex items-center justify-center transition-colors">−</button>
              </div>
              <p class="text-[10px] text-zinc-600 mt-2">Examples: Design should be modular and extensible</p>
            </div>
          </div>

          <!-- Validation error -->
          <p v-if="stepError['requirements']" class="mt-3 text-xs text-red-400 flex items-center gap-1.5">
            <Icon name="heroicons:exclamation-circle" class="text-sm" /> {{ stepError['requirements'] }}
          </p>

          <!-- Live progress hint -->
          <div v-if="!canEvaluateReqs" class="mt-3 flex flex-wrap gap-2 text-xs">
            <span :class="['px-2.5 py-1 rounded-full font-semibold', validFuncReqs.length >= MIN_FUNC_REQS ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-400']">
              ✦ Functional: {{ validFuncReqs.length }}/{{ MIN_FUNC_REQS }}
            </span>
            <span :class="['px-2.5 py-1 rounded-full font-semibold', validNonFuncReqs.length >= MIN_NON_FUNC_REQS ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-400']">
              ✦ Non-Functional: {{ validNonFuncReqs.length }}/{{ MIN_NON_FUNC_REQS }}
            </span>
            <span class="px-2.5 py-1 rounded-full font-semibold bg-zinc-800 text-zinc-500">Each must be ≥ {{ MIN_REQ_CHARS }} characters</span>
          </div>

          <div class="flex flex-col gap-3 pt-6 border-t border-zinc-900 mt-6">
            <p v-if="stepError['requirements']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['requirements'] }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button @click="submitRequirements" :disabled="!canEvaluateReqs || stepEvaluating['requirements']"
                  class="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Icon v-if="stepEvaluating['requirements']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['requirements'] ? 'Checking...' : 'Evaluate Requirements' }}
                </button>
              </div>
              <button @click="skipStep" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl transition-colors">Skip →</button>
            </div>
          </div>

          <!-- Inline step result -->
          <div v-if="stepResults['requirements']" class="mt-5 rounded-xl border overflow-hidden"
            :class="stepResults['requirements'].passing ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5'">
            <div class="flex items-center gap-3 px-4 py-3" :class="stepResults['requirements'].passing ? 'border-green-500/30' : 'border-amber-500/30'">
              <span class="text-lg font-black" :class="stepResults['requirements'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['requirements'].score }}/10</span>
              <span class="text-xs font-bold" :class="stepResults['requirements'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['requirements'].passing ? '✓ Passing' : '⚠ Needs work' }}</span>
              <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">View Details in Hub</button>
              <button @click="goToStep(steps[activeStepIndex + 1]?.id)"
                class="ml-auto px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-red-500/10">
                Continue → Next Step
              </button>
            </div>
          </div>
        </div>

        <!-- ─ ENTITIES STEP ─ -->
        <div v-else-if="activeStepId === 'entities'">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-black flex items-center justify-center">2</span>
            <h2 class="text-base font-bold text-white">{{ steps[1].label }}</h2>
            <span v-if="steps[1].skipped" class="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">Skipped</span>
          </div>
          <p class="text-xs text-zinc-500 ml-8 mb-5">{{ steps[1].subtitle }}</p>

          <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-white">Classes / Entities</span>
              <span class="text-xs text-zinc-500">{{ validEntities.length }} / {{ MIN_ENTITIES }} valid</span>
            </div>
            <!-- Header row -->
            <div class="flex items-center gap-2 mb-2 px-1">
              <span class="w-40 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Class Name <span class="text-zinc-600">(≥2 chars)</span></span>
              <span class="flex-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Description <span class="text-zinc-600">(≥10 chars)</span></span>
            </div>
            <div v-for="(ent, i) in entities" :key="i" class="flex items-center gap-2 mb-2">
              <input v-model="entities[i].name" placeholder="e.g., ParkingLot"
                :class="['w-40 bg-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none border transition-colors',
                  entities[i].name.trim().length >= 2 ? 'border-green-600/50 focus:border-green-500'
                  : entities[i].name.trim().length > 0 ? 'border-amber-600/50 focus:border-amber-500'
                  : 'border-zinc-700 focus:border-purple-500'
                ]" />
              <input v-model="entities[i].description" placeholder="Brief description of what this entity represents..."
                :class="['flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none border transition-colors',
                  entities[i].description.trim().length >= MIN_ENTITY_DESC_CHARS ? 'border-green-600/50 focus:border-green-500'
                  : entities[i].description.trim().length > 0 ? 'border-amber-600/50 focus:border-amber-500'
                  : 'border-zinc-700 focus:border-purple-500'
                ]" />
              <button @click="addEntity" class="w-6 h-6 rounded bg-zinc-700 hover:bg-purple-500 text-white text-sm flex items-center justify-center transition-colors">+</button>
              <button v-if="entities.length > 1" @click="removeEntity(i)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-red-700 text-white text-sm flex items-center justify-center transition-colors">−</button>
            </div>
          </div>

          <p v-if="stepError['entities']" class="mt-3 text-xs text-red-400 flex items-center gap-1.5">
            <Icon name="heroicons:exclamation-circle" class="text-sm" /> {{ stepError['entities'] }}
          </p>

          <!-- Live progress hint -->
          <div v-if="!canEvaluateEntities" class="mt-3 flex flex-wrap gap-2 text-xs">
            <span :class="['px-2.5 py-1 rounded-full font-semibold', validEntities.length >= MIN_ENTITIES ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-400']">
              ✓ Valid entities: {{ validEntities.length }}/{{ MIN_ENTITIES }}
            </span>
            <span class="px-2.5 py-1 rounded-full font-semibold bg-zinc-800 text-zinc-500">Name ≥2 chars &amp; Description ≥10 chars</span>
          </div>

          <div class="flex flex-col gap-3 pt-6 border-t border-zinc-900 mt-6">
            <p v-if="stepError['entities']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['entities'] }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button @click="submitEntities" :disabled="!canEvaluateEntities || stepEvaluating['entities']"
                  class="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Icon v-if="stepEvaluating['entities']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['entities'] ? 'Checking...' : 'Evaluate Entities' }}
                </button>
              </div>
              <button @click="skipStep" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl transition-colors">Skip →</button>
            </div>
          </div>

          <div v-if="stepResults['entities']" class="mt-5 rounded-xl border overflow-hidden"
            :class="stepResults['entities'].passing ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5'">
            <div class="flex items-center gap-3 px-4 py-3" :class="stepResults['entities'].passing ? 'border-green-500/30' : 'border-amber-500/30'">
              <span class="text-lg font-black" :class="stepResults['entities'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['entities'].score }}/10</span>
              <span class="text-xs font-bold" :class="stepResults['entities'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['entities'].passing ? '✓ Passing' : '⚠ Needs work' }}</span>
              <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">View Details in Hub</button>
              <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-red-500/10">Continue → Next Step</button>
            </div>
          </div>
        </div>

        <!-- ─ CLASSES STEP ─ -->
        <div v-else-if="activeStepId === 'classes'">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center">3</span>
            <h2 class="text-base font-bold text-white">{{ steps[2].label }}</h2>
            <span v-if="steps[2].skipped" class="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full">Skipped</span>
          </div>
          <p class="text-xs text-zinc-500 ml-8 mb-5">{{ steps[2].subtitle }}</p>

          <!-- Sub-tabs -->
          <div class="flex gap-1 mb-4">
            <button v-for="t in ['classes','relationships','patterns']" :key="t"
              @click="classesTab = t as any"
              :class="['px-4 py-2 text-xs font-semibold rounded-lg transition-colors capitalize', classesTab === t ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white']">
              {{ t === 'classes' ? `⬡ Classes ${classDefs.filter(c => c.name.trim()).length}` : t === 'relationships' ? `⇋ Relationships ${relationships.filter(r => r.from.trim()).length}` : `✦ Patterns ${selectedPatterns.length}` }}
            </button>
          </div>

          <!-- Classes sub-tab -->
          <div v-if="classesTab === 'classes'" class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-1">
              <button @click="addClassDef"
                class="text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-300 hover:text-white hover:border-blue-500 transition-colors">
                + Add New Class / Interface / Enum
              </button>
            </div>
            <div v-for="(cls, i) in classDefs" :key="i" class="flex items-center gap-2 mt-3">
              <select v-model="classDefs[i].type"
                class="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500 w-28">
                <option>Class</option><option>Interface</option><option>Abstract Class</option><option>Enum</option>
              </select>
              <input v-model="classDefs[i].name" :placeholder="`Name (e.g., ParkingLot${i === 0 ? '' : i === 1 ? ', IPaymentStrategy' : ''})`"
                class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500" />
              <button v-if="classDefs.length > 1" @click="removeClassDef(i)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-red-700 text-white text-sm flex items-center justify-center transition-colors">−</button>
            </div>
            <p v-if="classDefs.filter(c => c.name.trim()).length === 0" class="text-xs text-zinc-600 mt-4 text-center">No classes defined yet. Add classes using the button above.</p>
          </div>

          <!-- Relationships sub-tab -->
          <div v-else-if="classesTab === 'relationships'" class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div v-for="(rel, i) in relationships" :key="i" class="flex items-center gap-2 mb-2">
              <input v-model="relationships[i].from" placeholder="Class A"
                class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500" />
              <select v-model="relationships[i].relType"
                class="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-white focus:outline-none w-40">
                <option v-for="rt in REL_TYPES" :key="rt" :value="rt">{{ rt }}</option>
              </select>
              <input v-model="relationships[i].to" placeholder="Class B"
                class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500" />
              <button @click="relationships.push({ from: '', to: '', relType: 'extends' })" class="w-6 h-6 rounded bg-zinc-700 hover:bg-blue-500 text-white text-sm flex items-center justify-center transition-colors">+</button>
              <button v-if="relationships.length > 1" @click="relationships.splice(i, 1)" class="w-6 h-6 rounded bg-zinc-700 hover:bg-red-700 text-white text-sm flex items-center justify-center transition-colors">−</button>
            </div>
          </div>

          <!-- Patterns sub-tab -->
          <div v-else-if="classesTab === 'patterns'" class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-1">Common Design Patterns</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <button v-for="p in OOP_PATTERNS" :key="p"
                @click="togglePattern(p)"
                :class="['px-3 py-2 text-xs font-medium rounded-xl border transition-all text-left flex items-center gap-2',
                  selectedPatterns.includes(p) ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                ]">
                <div :class="['w-1.5 h-1.5 rounded-full transition-colors', selectedPatterns.includes(p) ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-zinc-600']"></div>
                {{ p }}
              </button>
            </div>
          </div>

          <p v-if="stepError['classes']" class="mt-3 text-xs text-red-400 flex items-center gap-1.5">
            <Icon name="heroicons:exclamation-circle" class="text-sm" /> {{ stepError['classes'] }}
          </p>

          <!-- Live progress hint -->
          <div v-if="!canEvaluateClasses" class="mt-3 flex flex-wrap gap-2 text-xs">
            <span :class="['px-2.5 py-1 rounded-full font-semibold', validClasses.length >= MIN_CLASSES ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-400']">
              ✓ Classes: {{ validClasses.length }}/{{ MIN_CLASSES }}
            </span>
            <span :class="['px-2.5 py-1 rounded-full font-semibold', validRelationships.length >= MIN_RELATIONSHIPS ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-400']">
              ✓ Connections: {{ validRelationships.length }}/{{ MIN_RELATIONSHIPS }}
            </span>
            <span :class="['px-2.5 py-1 rounded-full font-semibold', selectedPatterns.length >= MIN_PATTERNS ? 'bg-green-500/15 text-green-400' : 'bg-zinc-800 text-zinc-400']">
              ✓ Patterns: {{ selectedPatterns.length }}/{{ MIN_PATTERNS }}
            </span>
          </div>

          <div class="flex flex-col gap-3 pt-6 border-t border-zinc-900 mt-6">
            <p v-if="stepError['classes']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['classes'] }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button @click="submitClasses" :disabled="!canEvaluateClasses || stepEvaluating['classes']"
                  class="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Icon v-if="stepEvaluating['classes']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['classes'] ? 'Checking...' : 'Evaluate Design' }}
                </button>
              </div>
              <button @click="skipStep" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl transition-colors">Skip →</button>
            </div>
          </div>

          <div v-if="stepResults['classes']" class="mt-5 rounded-xl border overflow-hidden"
            :class="stepResults['classes'].passing ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5'">
            <div class="flex items-center gap-3 px-4 py-3" :class="stepResults['classes'].passing ? 'border-green-500/30' : 'border-amber-500/30'">
              <span class="text-lg font-black" :class="stepResults['classes'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['classes'].score }}/10</span>
              <span class="text-xs font-bold" :class="stepResults['classes'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['classes'].passing ? '✓ Passing' : '⚠ Needs work' }}</span>
              <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">View Details in Hub</button>
              <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-red-500/10">Continue → Next Step</button>
            </div>
          </div>
        </div>

        <!-- ─ CODE STEP (IDE EXPERIENCE) ─ -->
        <div v-else-if="activeStepId === 'code'" class="flex-1 flex flex-col min-h-0">
          <!-- IDE Header / Toolbar -->
          <div class="bg-zinc-950 border border-zinc-800 px-6 py-3 flex items-center justify-between shadow-sm shrink-0">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2.5">
                <div class="w-2.5 h-2.5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <div class="w-1 h-1 rounded-full bg-red-500"></div>
                </div>
                <h3 class="text-[10px] font-black text-white uppercase tracking-widest">Workspace</h3>
              </div>
              <div class="h-4 w-px bg-zinc-800"></div>
              <div class="flex items-center gap-2">
                <button @click="() => addFile()" class="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-blue-400 transition-all group" title="New File">
                  <Icon name="heroicons:document-plus" class="text-xs group-hover:scale-110" />
                </button>
                <button @click="() => addFolder()" class="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-amber-400 transition-all group" title="New Folder">
                  <Icon name="heroicons:folder-plus" class="text-xs group-hover:scale-110" />
                </button>
              </div>
              <div class="h-4 w-px bg-zinc-800"></div>
              <button @click="isEditorFullscreen = !isEditorFullscreen" 
                :class="['p-1.5 rounded-lg transition-all', isEditorFullscreen ? 'text-blue-400 bg-blue-500/10' : 'text-zinc-500 hover:text-white hover:bg-zinc-800']"
                :title="isEditorFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'">
                <Icon :name="isEditorFullscreen ? 'heroicons:arrows-pointing-in' : 'heroicons:arrows-pointing-out'" class="text-xs" />
              </button>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                <button @click="triggerImport" class="px-3 py-1 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5" title="Import JSON or ZIP">
                  <Icon name="heroicons:arrow-up-tray" /> Import
                </button>
                <div class="w-px h-3 bg-zinc-800"></div>
                <button @click="triggerFolderImport" class="px-3 py-1 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5" title="Import Local Folder">
                  <Icon name="heroicons:folder-arrow-down" /> Folder
                </button>
                <div class="w-px h-3 bg-zinc-800"></div>
                <button @click="exportProject" class="px-3 py-1 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5" title="Export as ZIP">
                  <Icon name="heroicons:arrow-down-tray" /> Export (ZIP)
                </button>
              </div>
              <div class="h-4 w-px bg-zinc-800"></div>
              <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg pr-2">
                  <div class="w-8 h-8 rounded-l-lg bg-zinc-800 flex items-center justify-center">
                    <Icon :name="getFileIcon(activeFilePath)" class="text-xs" />
                  </div>
                  <select v-model="codeLanguage" @change="changeLang(codeLanguage)"
                    class="bg-transparent border-none py-1 text-[10px] font-black text-zinc-300 focus:ring-0 cursor-pointer uppercase">
                    <option v-for="l in LANGUAGES" :key="l.id" :value="l.id">{{ l.label }}</option>
                  </select>
              </div>
            </div>
          </div>

          <!-- IDE Main Layout -->
          <div class="flex-1 flex min-h-0 bg-[#0c0c0e] border-x border-zinc-800 relative">
            <!-- Sidebar / File Explorer -->
            <div class="w-64 border-r border-zinc-800/50 flex flex-col bg-zinc-950/50 backdrop-blur-3xl shrink-0 overflow-hidden">
              <div class="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between shrink-0 drop-shadow-sm">
                <span class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">File Explorer</span>
                <span class="text-[9px] font-mono text-zinc-700 bg-zinc-900 px-1.5 py-0.5 rounded">{{ codeFiles.length }} Entrie{{ codeFiles.length !== 1 ? 's' : '' }}</span>
              </div>
              
              <div class="flex-1 overflow-y-auto p-2 pt-4 space-y-0.5 custom-scrollbar">
                <!-- Recursive Tree Style Rendering -->
                <template v-for="item in fileTree" :key="item.path">
                  <!-- Folder Template -->
                  <div v-if="item.type === 'folder'" class="space-y-0.5">
                    <div @click="toggleFolder(item.path)"
                      class="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition-all group">
                      <Icon :name="expandedFolders.has(item.path) ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" class="text-[10px]" />
                      <Icon :name="expandedFolders.has(item.path) ? 'heroicons:folder-open' : 'heroicons:folder'" class="text-xs text-amber-500/70" />
                      <span class="text-[11px] font-bold truncate uppercase tracking-tight flex-1">{{ item.name }}</span>
                      <!-- Folder Action Icons -->
                      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button @click.stop="addFile(item.path)" class="p-1 hover:text-blue-400" title="New File in this folder">
                          <Icon name="heroicons:document-plus" class="text-[10px]" />
                        </button>
                        <button @click.stop="addFolder(item.path)" class="p-1 hover:text-amber-500" title="New Folder in this folder">
                          <Icon name="heroicons:folder-plus" class="text-[10px]" />
                        </button>
                      </div>
                    </div>
                    
                    <!-- Folder Children -->
                    <div v-if="expandedFolders.has(item.path)" class="ml-4 border-l border-zinc-800/50 space-y-0.5">
                      <template v-for="child in item.children" :key="child.path">
                        <div v-if="!child.name.startsWith('.')"
                          @click="child.type === 'file' ? activeFilePath = child.path : toggleFolder(child.path)"
                          :class="['flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all border shadow-sm group/child', 
                            activeFilePath === child.path ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'text-zinc-500 border-transparent hover:bg-zinc-800/30 hover:text-zinc-300']">
                          <Icon v-if="child.type === 'folder'" :name="expandedFolders.has(child.path) ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" class="text-[9px]" />
                          <Icon :name="child.type === 'file' ? getFileIcon(child.name) : (expandedFolders.has(child.path) ? 'heroicons:folder-open' : 'heroicons:folder')" 
                            :class="['text-[10px]', child.type === 'folder' ? 'text-amber-500/60' : '']" />
                          <span class="text-[11px] font-semibold truncate tracking-tight flex-1">{{ child.name }}</span>
                          
                          <!-- Inline Actions for Child Folders -->
                          <div v-if="child.type === 'folder'" class="flex items-center gap-1 opacity-0 group-hover/child:opacity-100 transition-opacity">
                            <button @click.stop="addFile(child.path)" class="p-1 hover:text-blue-400">
                              <Icon name="heroicons:document-plus" class="text-[10px]" />
                            </button>
                            <button @click.stop="addFolder(child.path)" class="p-1 hover:text-amber-500">
                              <Icon name="heroicons:folder-plus" class="text-[10px]" />
                            </button>
                          </div>

                          <button v-if="child.type === 'file' && codeFiles.length > 1" @click.stop="deleteFile(child.path)" class="opacity-0 group-hover/child:opacity-100 hover:text-red-500 transition-opacity">
                            <Icon name="heroicons:trash" class="text-[10px]" />
                          </button>
                        </div>
                      </template>
                    </div>
                  </div>
                  
                  <!-- File Template (Root Level) -->
                  <div v-else-if="!item.name.startsWith('.')" @click="activeFilePath = item.path"
                    :class="['flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all border shadow-sm group', 
                      activeFilePath === item.path ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'text-zinc-500 border-transparent hover:bg-zinc-800/30 hover:text-zinc-300']">
                    <Icon :name="getFileIcon(item.name)" class="text-[10px]" />
                    <span class="text-[11px] font-semibold truncate tracking-tight">{{ item.name }}</span>
                    <button v-if="codeFiles.length > 1" @click.stop="deleteFile(item.path)" class="ml-auto opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                      <Icon name="heroicons:trash" class="text-[10px]" />
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <!-- Editor Workspace -->
            <div class="flex-1 flex flex-col min-w-0">
              <!-- Advanced Tab Bar -->
              <div class="flex bg-zinc-950 border-b border-zinc-900/50 items-center overflow-x-auto no-scrollbar shrink-0">
                <div v-for="tabPath in openTabs" :key="tabPath"
                  @click="activeFilePath = tabPath"
                  @click.middle="closeTab(tabPath)"
                  :class="['flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-all border-r border-zinc-900 group/tab relative', 
                    activeFilePath === tabPath ? 'bg-zinc-900/50 text-blue-400 font-bold' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/30']">
                  
                  <div v-if="activeFilePath === tabPath" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                  
                  <Icon :name="getFileIcon(tabPath)" class="text-[10px]" />
                  <span :class="['text-[11px] font-black uppercase tracking-widest whitespace-nowrap', activeFilePath === tabPath ? 'opacity-100' : 'opacity-60']">
                    {{ tabPath.split('/').pop() }}
                  </span>
                  
                  <button @click.stop="closeTab(tabPath)" class="ml-1 p-0.5 rounded-md hover:bg-zinc-800 opacity-0 group-hover/tab:opacity-100 transition-opacity">
                    <Icon name="heroicons:x-mark" class="text-[10px]" />
                  </button>
                </div>
                
                <div class="flex-1 min-w-[50px]"></div>
                
                <div class="px-4 flex items-center gap-3 border-l border-zinc-900 h-full">
                   <span class="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{{ codeLanguage }} project</span>
                </div>
              </div>

              <!-- Breadcrumbs -->
              <div v-if="activeFilePath" class="px-6 py-2 bg-zinc-950/40 border-b border-zinc-900/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <Icon name="heroicons:folder-open" class="text-[10px] text-zinc-700" />
                <template v-for="(part, i) in breadcrumbs" :key="i">
                  <span class="text-[10px] font-bold text-zinc-500 hover:text-blue-400 cursor-default transition-colors">{{ part }}</span>
                  <Icon v-if="i < breadcrumbs.length - 1" name="heroicons:chevron-right" class="text-[8px] text-zinc-800" />
                </template>
              </div>

              <!-- Content Area -->
              <div class="flex-1 relative bg-zinc-950 overflow-hidden">
                <SystemDesignEditor 
                  v-if="activeFile"
                  v-model="activeFile.content" 
                  :language="codeLanguage" 
                  :path="activeFile.path"
                />
                
                <!-- Floating Path Indicator - Removed in favor of Breadcrumbs -->
              </div>

              <!-- Terminal Area -->
              <div :class="['border-t border-zinc-800/50 bg-black/40 flex flex-col overflow-hidden shrink-0 transition-all duration-300', isTerminalOpen ? 'h-48' : 'h-10']">
                <div @click="isTerminalOpen = !isTerminalOpen" class="px-5 py-2.5 border-b border-zinc-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 bg-zinc-950/50 cursor-pointer hover:bg-zinc-900/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <Icon name="heroicons:command-line" :class="isTerminalOpen ? 'text-blue-500' : 'text-zinc-500'" /> 
                    <span>Console Log</span>
                  </div>
                  <div class="flex items-center gap-4">
                    <div v-if="simulationOutput.length > 0 && !isTerminalOpen" class="flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <span class="text-[9px] normal-case font-mono text-zinc-500 tracking-normal">{{ simulationOutput[simulationOutput.length - 1] }}</span>
                    </div>
                    <div class="flex gap-4" @click.stop="">
                        <button @click="simulationOutput = []" class="hover:text-white transition-colors flex items-center gap-1.5"><Icon name="heroicons:trash" /> Clear</button>
                        <Icon :name="isTerminalOpen ? 'heroicons:chevron-down' : 'heroicons:chevron-up'" class="text-xs" />
                    </div>
                  </div>
                </div>
                <div v-show="isTerminalOpen" class="flex-1 p-6 font-mono text-[11px] text-zinc-500 overflow-y-auto space-y-2 custom-scrollbar bg-black/20">
                  <div class="flex gap-3 px-2">
                    <span class="text-zinc-700 select-none">$</span>
                    <p v-if="!stepEvaluating['code'] && simulationOutput.length === 0" class="text-zinc-600">system kernel cluster initialized. ready for simulation sequence...</p>
                    <p v-else-if="stepEvaluating['code']" class="text-blue-500/80 animate-pulse">analyzing solution architecture and oop integrity...</p>
                  </div>
                  <template v-for="(line, i) in simulationOutput" :key="i">
                     <div class="flex gap-3 px-2">
                       <span class="text-zinc-700 select-none">></span>
                       <p :class="[i === simulationOutput.length - 1 && runningSimulation ? 'text-zinc-200 animate-pulse' : 'text-zinc-500']">
                         {{ line }}
                       </p>
                     </div>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Status Bar -->
          <div class="bg-zinc-950 border border-zinc-800 border-t-0 px-6 py-4 flex items-center justify-between shadow-2xl">
            <div class="flex items-center gap-8">
              <div class="flex items-center gap-4 group">
                <div :class="['w-2 h-2 rounded-full transition-all duration-500', canEvaluateCode ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]']"></div>
                <span class="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">System Ready State</span>
              </div>
              <div class="h-4 w-px bg-zinc-800"></div>
              <div class="flex items-center gap-4">
                <span class="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Buffer Usage</span>
                <div class="flex gap-1.5">
                   <div v-for="i in 5" :key="i" :class="['w-4 h-1 rounded-full transition-colors', i <= (codeFiles.length) ? 'bg-blue-500' : 'bg-zinc-800']"></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <button @click="runSimulation" :disabled="runningSimulation"
                class="group px-6 py-2.5 text-[10px] font-black border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50">
                <Icon :name="runningSimulation ? 'heroicons:arrow-path' : 'heroicons:play-solid'" :class="['text-sm transition-transform group-hover:scale-110', { 'animate-spin': runningSimulation, 'text-blue-500': !runningSimulation }]" /> 
                <span class="uppercase tracking-widest">{{ runningSimulation ? 'Simulating...' : 'Run Simulation' }}</span>
              </button>
              <button @click="submitCode" :disabled="!canEvaluateCode || stepEvaluating['code']"
                :class="['relative overflow-hidden group px-8 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center gap-3 shadow-2xl active:scale-95', 
                  canEvaluateCode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800']">
                <Icon name="heroicons:sparkles-solid" :class="['text-sm', canEvaluateCode ? 'text-blue-600' : '']" />
                <span class="uppercase tracking-widest">{{ stepEvaluating['code'] ? 'Calculating...' : 'Evaluate Implementation' }}</span>
              </button>
            </div>
          </div>

          <!-- LLD Code Step Result scorecard -->
          <div v-if="stepResults['code']" class="mt-4 mx-6 mb-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div class="flex items-center gap-6 px-8 py-5">
               <div class="flex items-center gap-4">
                 <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <span class="text-xl font-black text-emerald-400">{{ stepResults['code'].score }}</span>
                 </div>
                 <div class="flex flex-col">
                   <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-tight">Implementation Integrity</span>
                   <button @click="showAnalysisHub = true" class="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest text-left">View Detailed Technical Audit</button>
                 </div>
               </div>
               
               <div class="h-10 w-px bg-zinc-800 hidden sm:block"></div>
               
               <p class="hidden lg:block text-[11px] text-zinc-500 font-medium max-w-sm leading-relaxed">
                 Architectural evaluation complete. All OOP patterns and structural constraints have been analyzed by the system kernel.
               </p>

               <button @click="evaluate" 
                 class="ml-auto px-8 py-3 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-xl shadow-xl shadow-red-500/10 hover:shadow-red-500/20 transition-all flex items-center gap-3 group/btn">
                 Generate Master Report
                 <Icon name="heroicons:chevron-right" class="text-sm group-hover/btn:translate-x-1 transition-transform" />
               </button>
             </div>
          </div>
        </div>

        <!-- ─ HLD – REQUIREMENTS ─ -->
        <!-- Handled by the generic 'requirements' div at line 798, now enabled for HLD too -->

        <!-- ─ HLD – API DESIGN ─ -->
        <div v-else-if="activeStepId === 'api'">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs font-black flex items-center justify-center">2</span>
            <h2 class="text-base font-bold text-white">{{ steps[1].label }}</h2>
          </div>
          <p class="text-xs text-zinc-500 ml-8 mb-4">{{ steps[1].subtitle }}</p>

          <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-black uppercase tracking-widest text-zinc-400">API Endpoints</span>
              <button @click="addEndpoint" class="text-[10px] font-black uppercase bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-lg text-zinc-300 transition-all">+ Add Endpoint</button>
            </div>

            <div class="space-y-3">
              <div v-for="(ep, i) in hldApiEndpoints" :key="i" class="flex gap-3">
                <select v-model="ep.method" class="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-[10px] font-bold text-white focus:border-indigo-500 w-24">
                  <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
                </select>
                <input v-model="ep.path" placeholder="/api/v1/resource" class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500" />
                <input v-model="ep.description" placeholder="Description (optional)" class="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500" />
                <button v-if="hldApiEndpoints.length > 1" @click="removeEndpoint(i)" class="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all flex items-center justify-center border border-zinc-700">
                  <Icon name="heroicons:trash" class="text-xs" />
                </button>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-zinc-800">
               <p class="text-[10px] text-zinc-500 font-bold uppercase mb-2">Examples:</p>
               <div class="space-y-1 font-mono text-[10px] text-zinc-600">
                 <p><span class="text-green-500">POST</span> /api/v1/urls → Create short URL</p>
                 <p><span class="text-blue-500">GET</span> /api/v1/urls/:id → Get URL details</p>
               </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-6 border-t border-zinc-900 mt-6">
            <p v-if="stepError['api']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['api'] }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button @click="submitHldStep('api', hldApiEndpoints)" :disabled="stepEvaluating['api']"
                  class="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Icon v-if="stepEvaluating['api']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['api'] ? 'Checking...' : 'Evaluate API Design' }}
                </button>
              </div>
              <button @click="skipStep" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl transition-colors">Skip →</button>
            </div>
          </div>

          <div v-if="stepResults['api']" class="mt-5 rounded-xl border border-blue-500/30 bg-blue-500/5 overflow-hidden">
             <div class="flex items-center gap-3 px-4 py-3">
               <span class="text-lg font-black text-blue-400">{{ stepResults['api'].score }}/10</span>
               <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">Audit Details</button>
               <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-4 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg">Next Step →</button>
             </div>
          </div>
        </div>

        <!-- ─ HLD – ARCHITECTURE ─ -->
        <div v-else-if="activeStepId === 'architecture'" class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-xl bg-purple-500 text-white text-xs font-black flex items-center justify-center shadow-lg shadow-purple-500/20">3</span>
              <div>
                <h2 class="text-sm font-black text-white uppercase tracking-tight">{{ steps[2].label }}</h2>
                <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ steps[2].subtitle }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
               <button v-if="!isWhiteboardFullscreen" @click="toggleWhiteboardFullscreen('architecture')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-[9px] font-black uppercase tracking-wider text-zinc-300 transition-all flex items-center gap-2">
                  <Icon name="heroicons:arrows-pointing-out" class="text-purple-400" /> Fullscreen
               </button>
               <a v-if="!isWhiteboardFullscreen" :href="EXCALIDRAW_LIBRARIES" target="_blank" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[9px] font-black uppercase tracking-wider text-white transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10">
                  <Icon name="heroicons:command-line" /> Libraries
               </a>
            </div>
          </div>

          <div :class="['grid transition-all duration-300', isWhiteboardFullscreen === 'architecture' ? 'opacity-0' : 'grid lg:grid-cols-[1fr_300px] h-[520px] gap-4']">
             <!-- Whiteboard Integration -->
             <div class="bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden relative group">
                <iframe :key="`board_arch_${slug}`" :src="getWhiteboardUrl('architecture')" class="w-full h-full border-0" allow="clipboard-read; clipboard-write; check-visibility" />
             </div>

             <!-- Teleport Fullscreen for Architecture -->
             <Teleport to="body">
               <div v-if="isWhiteboardFullscreen === 'architecture'" class="fixed inset-0 z-[9999] bg-zinc-950 p-4 flex flex-col">
                  <!-- Fullscreen Exit Overlay -->
                  <div class="absolute top-6 right-6 z-[10000] flex gap-3">
                     <a :href="EXCALIDRAW_LIBRARIES" target="_blank" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-2xl flex items-center gap-2">
                        <Icon name="heroicons:command-line" /> Load Libraries
                     </a>
                     <button @click="isWhiteboardFullscreen = null" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-2xl flex items-center gap-2 border border-white/10">
                        <Icon name="heroicons:arrows-pointing-in" /> Exit Fullscreen
                     </button>
                  </div>
                  <iframe :key="`board_arch_full_${slug}`" :src="getWhiteboardUrl('architecture')" class="flex-1 w-full border-0 rounded-2xl" allow="clipboard-read; clipboard-write; check-visibility" />
               </div>
             </Teleport>

             <!-- Explanation Box -->
             <div v-if="!isWhiteboardFullscreen" class="bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col overflow-hidden">
                <div class="px-4 py-3 border-b border-zinc-800 bg-zinc-800/10 flex items-center gap-2">
                   <Icon name="heroicons:chat-bubble-bottom-center-text" class="text-purple-400" />
                   <span class="text-[10px] font-black uppercase tracking-widest text-zinc-300">Explain Design</span>
                </div>
                <textarea v-model="hldArchitecture" placeholder="Describe component flow (Client → LB → API → DB)..."
                  class="flex-1 w-full bg-zinc-950 border-0 p-4 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none leading-relaxed" />
             </div>
          </div>

          <div class="flex flex-col gap-3 pt-4 border-t border-zinc-900">
            <p v-if="stepError['architecture']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['architecture'] }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button @click="submitHldStep('architecture', hldArchitecture)" :disabled="stepEvaluating['architecture']"
                  class="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Icon v-if="stepEvaluating['architecture']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['architecture'] ? 'Checking...' : 'Evaluate' }}
                </button>
                <span v-if="hldArchitecture.length < 50" class="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Min 50 chars: {{ hldArchitecture.length }}/50</span>
              </div>
              <button @click="skipStep" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl transition-colors">Skip →</button>
            </div>
          </div>

          <div v-if="stepResults['architecture']" class="mt-5 rounded-xl border border-purple-500/30 bg-purple-500/5 overflow-hidden">
             <div class="flex items-center gap-3 px-4 py-3">
               <span class="text-lg font-black text-purple-400">{{ stepResults['architecture'].score }}/10</span>
               <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-purple-400 hover:underline uppercase tracking-widest">Audit Details</button>
               <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-4 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg">Next Step →</button>
             </div>
          </div>
        </div>

        <!-- ─ HLD – DATABASE ─ -->
        <div v-else-if="activeStepId === 'database'" class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="w-7 h-7 rounded-xl bg-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-lg shadow-emerald-500/20">4</span>
            <div>
              <h2 class="text-sm font-black text-white uppercase tracking-tight">{{ steps[3].label }}</h2>
              <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ steps[3].subtitle }}</p>
            </div>
          </div>

          <div class="grid lg:grid-cols-[280px_1fr] gap-6">
            <!-- Sidebar: Storage List -->
            <div class="space-y-4">
              <div class="relative storage-dropdown-container">
                <button @click.stop="showStorageDropdown = !showStorageDropdown" 
                  :class="['w-full text-[10px] font-black uppercase border p-3 rounded-xl transition-all flex items-center justify-between',
                    showStorageDropdown ? 'bg-zinc-700 border-emerald-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700']">
                   <div class="flex items-center gap-2"><Icon name="heroicons:plus" class="text-emerald-500" /> Add Storage</div>
                   <Icon name="heroicons:chevron-down" :class="['text-zinc-600 transition-transform duration-300', showStorageDropdown ? 'rotate-180' : '']" />
                </button>
                
                <!-- Luxury Categorized Dropdown -->
                <transition name="dropdown">
                  <div v-if="showStorageDropdown" class="absolute top-full left-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 w-72 z-[60] overflow-hidden ring-1 ring-white/5">
                    <div v-for="cat in STORAGE_CATALOG" :key="cat.group" class="mb-2 last:mb-0">
                        <div class="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-800/30">{{ cat.group }}</div>
                        <button v-for="item in cat.items" :key="item.name" @click="addStorage(item.name, item.icon, cat.group, item.type)"
                          class="w-full px-4 py-2 text-left text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-3">
                          <Icon :name="item.icon" class="text-sm" /> {{ item.name }}
                        </button>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Added Storages List -->
              <div class="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 <div v-for="(s, i) in hldDatabaseStorage" :key="s.id" 
                   @click="activeStorageIdx = i"
                   class="group/item flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden"
                   :class="activeStorageIdx === i ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'">
                    <div v-if="activeStorageIdx === i" class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                    <Icon :name="s.icon" class="text-lg shrink-0" />
                    <div class="min-w-0 flex-1">
                       <p class="text-[10px] font-black uppercase text-white truncate">{{ s.tech }}</p>
                       <p class="text-[9px] text-zinc-500 font-bold uppercase truncate">{{ s.category }} • {{ s.tables.length }} Tables</p>
                    </div>
                    <button @click.stop="removeStorage(i)" class="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-600 hover:text-red-400 transition-all">
                       <Icon name="heroicons:trash" />
                    </button>
                 </div>
                 <div v-if="hldDatabaseStorage.length === 0" class="py-12 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center opacity-40">
                    <Icon name="heroicons:circle-stack" class="text-2xl mb-2" />
                    <p class="text-[10px] font-black uppercase">No storage selected</p>
                 </div>
              </div>
            </div>

            <!-- Content: Table Editor -->
            <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
               <div v-if="hldDatabaseStorage[activeStorageIdx]" class="flex-1 flex flex-col">
                  <!-- Storage Header -->
                  <div class="px-6 py-4 border-b border-zinc-800 bg-zinc-800/10 flex items-center justify-between">
                     <div class="flex items-center gap-3">
                        <Icon :name="hldDatabaseStorage[activeStorageIdx].icon" class="text-2xl" />
                        <div>
                           <h3 class="text-xs font-black uppercase text-white tracking-widest">{{ hldDatabaseStorage[activeStorageIdx].tech }}</h3>
                           <p class="text-[9px] font-black uppercase text-emerald-500">{{ hldDatabaseStorage[activeStorageIdx].type }} SCHEMA</p>
                        </div>
                     </div>
                     <button @click="addTable(activeStorageIdx)" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2">
                        <Icon name="heroicons:plus" /> Add Table
                     </button>
                  </div>

                  <!-- Tables List -->
                  <div class="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                     <div v-for="(table, ti) in hldDatabaseStorage[activeStorageIdx].tables" :key="ti" class="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                        <div class="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                           <input v-model="table.name" class="bg-transparent border-0 text-xs font-black text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-2 py-1 uppercase tracking-widest w-64" placeholder="TABLE_NAME" />
                           <div class="flex items-center gap-2">
                              <button @click="addColumn(activeStorageIdx, ti)" class="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-all" title="Add Column"><Icon name="heroicons:plus-circle" /></button>
                              <button @click="hldDatabaseStorage[activeStorageIdx].tables.splice(ti, 1)" class="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"><Icon name="heroicons:trash" /></button>
                           </div>
                        </div>

                        <!-- Columns Table -->
                        <div class="p-4 overflow-x-auto">
                           <table class="w-full text-[10px] border-separate border-spacing-y-1.5">
                              <thead>
                                 <tr class="text-zinc-500 font-black uppercase tracking-widest text-left">
                                    <th class="px-3 py-1 pb-2">Column</th>
                                    <th class="px-3 py-1 pb-2">Type</th>
                                    <th class="px-3 py-1 pb-2 text-center">PK</th>
                                    <th class="px-3 py-1 pb-2 text-center">Null</th>
                                    <th class="px-3 py-1 pb-2 text-center">Idx</th>
                                    <th></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr v-for="(col, ci) in table.columns" :key="ci" class="group/col">
                                    <td class="px-1"><input v-model="col.name" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-white focus:border-emerald-500 transition-all font-mono" /></td>
                                    <td class="px-1">
                                       <select v-model="col.type" class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-white focus:border-emerald-500 transition-all font-mono">
                                          <option v-for="t in COLUMN_TYPES" :key="t" :value="t">{{ t }}</option>
                                       </select>
                                    </td>
                                    <td class="text-center px-1">
                                       <input type="checkbox" v-model="col.isPrimary" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950" />
                                    </td>
                                    <td class="text-center px-1">
                                       <input type="checkbox" v-model="col.isNullable" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950" />
                                    </td>
                                    <td class="text-center px-1">
                                       <input type="checkbox" v-model="col.isIndexed" class="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950" />
                                    </td>
                                    <td class="text-right px-1">
                                       <button @click="table.columns.splice(ci, 1)" class="opacity-0 group-hover/col:opacity-100 p-1.5 text-zinc-600 hover:text-red-400"><Icon name="heroicons:x-mark" /></button>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     </div>
                     <div v-if="hldDatabaseStorage[activeStorageIdx].tables.length === 0" class="py-20 flex flex-col items-center justify-center opacity-30">
                        <Icon name="heroicons:table-cells" class="text-4xl mb-3" />
                        <p class="text-xs font-black uppercase tracking-widest">Click "Add Table" to define your schema</p>
                     </div>
                  </div>
               </div>
               <div v-else class="flex-1 flex flex-col items-center justify-center opacity-20">
                  <Icon name="heroicons:arrow-left" class="text-4xl mb-4" />
                  <p class="text-sm font-black uppercase tracking-widest">Select a storage from the left to edit schema</p>
               </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 mt-8 border-t border-zinc-900 pt-4">
            <p v-if="stepError['database']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['database'] }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button @click="submitHldStep('database', hldDatabaseStorage)" :disabled="stepEvaluating['database'] || hldDatabaseStorage.length === 0"
                  class="px-6 py-2.5 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-30 text-white rounded-lg transition-all flex items-center gap-2 shadow-xl shadow-green-500/10">
                  <Icon v-if="stepEvaluating['database']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['database'] ? 'Evaluating Catalog...' : 'Evaluate Database Design' }}
                </button>
              </div>
              <button @click="skipStep" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl transition-colors">Skip →</button>
            </div>
          </div>

          <div v-if="stepResults['database']" class="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden shadow-2xl">
             <div class="flex items-center gap-3 px-6 py-4">
               <span class="text-xl font-black text-emerald-400">{{ stepResults['database'].score }}/10</span>
               <div class="w-px h-6 bg-zinc-800 mx-2"></div>
               <button @click="showAnalysisHub = true" class="text-[10px] font-black text-emerald-400 hover:underline uppercase tracking-widest">Audit Analytics</button>
               <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-6 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/20">Proceed → Next Step</button>
             </div>
          </div>
        </div>

        <!-- ─ HLD – DEEP DIVE 1 – CACHING ─ -->
        <div v-else-if="activeStepId === 'deep-dive'" class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-xl bg-blue-500 text-white text-xs font-black flex items-center justify-center shadow-lg shadow-blue-500/20">5</span>
              <div>
                <h2 class="text-sm font-black text-white uppercase tracking-tight">{{ steps[4].label }}</h2>
                <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ steps[4].subtitle }}</p>
              </div>
            </div>
            <button v-if="!isWhiteboardFullscreen" @click="toggleWhiteboardFullscreen('deep-dive')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-[9px] font-black uppercase tracking-wider text-zinc-300 transition-all flex items-center gap-2">
               <Icon name="heroicons:arrows-pointing-out" class="text-blue-400" /> Fullscreen
            </button>
          </div>

          <div :class="['grid transition-all duration-300', isWhiteboardFullscreen === 'deep-dive' ? 'opacity-0' : 'grid lg:grid-cols-[1fr_300px] h-[520px] gap-4']">
             <div class="bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden relative">
                <iframe :key="`board_deep_${slug}`" :src="getWhiteboardUrl('deep-dive')" class="w-full h-full border-0" allow="clipboard-read; clipboard-write; check-visibility" />
             </div>

             <!-- Teleport Fullscreen for Deep Dive -->
             <Teleport to="body">
               <div v-if="isWhiteboardFullscreen === 'deep-dive'" class="fixed inset-0 z-[9999] bg-zinc-950 p-4 flex flex-col">
                  <!-- Fullscreen Exit Overlay -->
                  <div class="absolute top-6 right-6 z-[10000]">
                     <button @click="isWhiteboardFullscreen = null" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-2xl flex items-center gap-2 border border-white/10">
                        <Icon name="heroicons:arrows-pointing-in" /> Exit Fullscreen
                     </button>
                  </div>
                  <iframe :key="`board_deep_full_${slug}`" :src="getWhiteboardUrl('deep-dive')" class="flex-1 w-full border-0 rounded-2xl" allow="clipboard-read; clipboard-write; check-visibility" />
               </div>
             </Teleport>
             <div v-if="!isWhiteboardFullscreen" class="bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col overflow-hidden">
                <div class="px-4 py-3 border-b border-zinc-800 bg-zinc-800/10 flex items-center gap-2">
                   <Icon name="heroicons:chat-bubble-bottom-center-text" class="text-blue-400" />
                   <span class="text-[10px] font-black uppercase tracking-widest text-zinc-300">Explain Design</span>
                </div>
                <textarea v-model="hldDeepDive" placeholder="Describe logic..."
                  class="flex-1 w-full bg-zinc-950 border-0 p-4 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none leading-relaxed" />
             </div>
          </div>

          <div class="flex flex-col gap-3 pt-4 border-t border-zinc-900">
            <p v-if="stepError['deep-dive']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['deep-dive'] }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <button @click="submitHldStep('deep-dive', hldDeepDive)" :disabled="stepEvaluating['deep-dive']"
                  class="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Icon v-if="stepEvaluating['deep-dive']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['deep-dive'] ? 'Checking...' : 'Evaluate' }}
                </button>
                <span v-if="hldDeepDive.length < 50" class="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Min 50 chars: {{ hldDeepDive.length }}/50</span>
              </div>
              <button @click="skipStep" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-zinc-800 rounded-xl transition-colors">Skip →</button>
            </div>
          </div>

          <div v-if="stepResults['deep-dive']" class="mt-5 rounded-xl border border-blue-500/30 bg-blue-500/5 overflow-hidden">
             <div class="flex items-center gap-3 px-4 py-3">
               <span class="text-lg font-black text-blue-400">{{ stepResults['deep-dive'].score }}/10</span>
               <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">Audit Details</button>
               <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-4 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg">Next Step →</button>
             </div>
          </div>
        </div>

        <!-- ─ HLD – DEEP DIVE 2 – ANALYTICS ─ -->
        <div v-else-if="activeStepId === 'analytics'" class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-xl bg-pink-500 text-white text-xs font-black flex items-center justify-center shadow-lg shadow-pink-500/20">6</span>
              <div>
                <h2 class="text-sm font-black text-white uppercase tracking-tight">{{ steps[5].label }}</h2>
                <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ steps[5].subtitle }}</p>
              </div>
            </div>
            <button v-if="!isWhiteboardFullscreen" @click="toggleWhiteboardFullscreen('analytics')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-[9px] font-black uppercase tracking-wider text-zinc-300 transition-all flex items-center gap-2">
               <Icon name="heroicons:arrows-pointing-out" class="text-pink-400" /> Fullscreen
            </button>
          </div>

          <div :class="['grid transition-all duration-300 mb-4', isWhiteboardFullscreen === 'analytics' ? 'opacity-0' : 'grid lg:grid-cols-[1fr_300px] h-[520px] gap-4']">
             <div class="bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden relative">
                <iframe :key="`board_analytics_${slug}`" :src="getWhiteboardUrl('analytics')" class="w-full h-full border-0" allow="clipboard-read; clipboard-write; check-visibility" />
             </div>

             <!-- Teleport Fullscreen for Analytics -->
             <Teleport to="body">
               <div v-if="isWhiteboardFullscreen === 'analytics'" class="fixed inset-0 z-[9999] bg-zinc-950 p-4 flex flex-col">
                  <!-- Fullscreen Exit Overlay -->
                  <div class="absolute top-6 right-6 z-[10000]">
                     <button @click="isWhiteboardFullscreen = null" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-2xl flex items-center gap-2 border border-white/10">
                        <Icon name="heroicons:arrows-pointing-in" /> Exit Fullscreen
                     </button>
                  </div>
                  <iframe :key="`board_analytics_full_${slug}`" :src="getWhiteboardUrl('analytics')" class="flex-1 w-full border-0 rounded-2xl" allow="clipboard-read; clipboard-write; check-visibility" />
               </div>
             </Teleport>
             <div v-if="!isWhiteboardFullscreen" class="bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col overflow-hidden">
                <div class="px-4 py-3 border-b border-zinc-800 bg-zinc-800/10 flex items-center gap-2">
                   <Icon name="heroicons:chat-bubble-bottom-center-text" class="text-pink-400" />
                   <span class="text-[10px] font-black uppercase tracking-widest text-zinc-300">Explain Pipeline</span>
                </div>
                <textarea v-model="hldAnalytics" placeholder="Describe data flow..."
                  class="flex-1 w-full bg-zinc-950 border-0 p-4 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none resize-none leading-relaxed" />
             </div>
          </div>

          <div class="flex flex-col gap-3 pt-4 border-t border-zinc-900">
            <p v-if="stepError['analytics']" class="text-[10px] text-red-400 font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
               <Icon name="heroicons:exclamation-circle" /> {{ stepError['analytics'] }}
            </p>
            <div class="flex items-center">
              <div class="flex items-center gap-4">
                <button @click="submitHldStep('analytics', hldAnalytics)" :disabled="stepEvaluating['analytics']"
                  class="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                  <Icon v-if="stepEvaluating['analytics']" name="heroicons:arrow-path" class="animate-spin" />
                  <Icon v-else name="heroicons:sparkles" />
                  {{ stepEvaluating['analytics'] ? 'Checking...' : 'Evaluate' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="stepResults['analytics']" class="mt-5 rounded-xl border border-pink-500/30 bg-pink-500/5 overflow-hidden">
             <div class="flex items-center gap-3 px-4 py-3">
               <span class="text-lg font-black text-pink-400">{{ stepResults['analytics'].score }}/10</span>
               <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-pink-400 hover:underline uppercase tracking-widest">Audit Details</button>
               <button @click="evaluate" class="ml-auto px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg">View Full Report 🏆</button>
             </div>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="evalError" class="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-xs text-red-400">
          {{ evalError }}
        </div>
      </div>
    </div>
  </div>

  <!-- ── GLOBAL STATUS BAR ── -->
  <div v-if="!showDifficultyModal && activeStepId !== 'code' && !isEditorFullscreen" class="h-8 flex-shrink-0 bg-zinc-900 border-t border-zinc-800 flex items-center px-6 justify-between select-none z-50">
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2.5">
         <div :class="['w-2 h-2 rounded-full animate-pulse', stepResults[activeStepId]?.passing ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]']"></div>
         <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">
           {{ stepResults[activeStepId] ? `${stepResults[activeStepId]!.score}/10 - ${stepResults[activeStepId]!.passing ? 'Passing' : 'Needs Work'}` : 'Evaluation Pending' }}
         </span>
      </div>
      <div class="h-3 w-px bg-zinc-800"></div>
      <span class="text-[9px] text-zinc-600 font-bold uppercase tracking-tight">Auto-save: enabled</span>
      <div class="h-3 w-px bg-zinc-800"></div>
      <span class="text-[9px] text-zinc-600 font-bold uppercase tracking-tight">Sync Status: Online</span>
    </div>
    
    <div class="flex items-center gap-5">
      <div class="flex items-center gap-2">
         <span class="text-[9px] text-zinc-700 font-black uppercase tracking-widest">UTF-8</span>
         <div class="w-1 h-1 rounded-full bg-zinc-800"></div>
         <span class="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{{ activeStepId }} MODE</span>
      </div>
    </div>
  </div>


    <!-- ── EVALUATION RESULT MODAL ── -->
    <div v-if="showEvalModal && evaluation"
      class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md overflow-y-auto p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-zinc-700/50">
          <!-- Premium Header -->
          <div class="relative bg-zinc-900 px-8 py-10 border-b border-zinc-800">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500"></div>
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 bg-red-500/10 px-3 py-1 rounded-full">Engineering Audit Report</span>
                </div>
                <h2 class="text-3xl font-black text-white tracking-tight">{{ question.title }}</h2>
                <p class="text-zinc-400 text-sm font-medium">Session Evaluation & Backend Architectural Integrity Audit</p>
              </div>
              
              <div class="flex items-center gap-6 bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/50 shadow-inner">
                <div class="text-center group">
                  <div :class="['text-5xl font-black transition-transform group-hover:scale-110 duration-500', gradeColor(evaluation.grade)]">{{ evaluation.grade }}</div>
                  <div class="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">Final Grade</div>
                </div>
                <div class="w-px h-12 bg-zinc-800"></div>
                <div class="text-center">
                  <div class="text-3xl font-black text-white">{{ evaluation.totalScore }}<span class="text-lg text-zinc-500">/{{ evaluation.maxScore }}</span></div>
                  <div class="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">Score</div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-8 space-y-10">
            <!-- Executive Summary Card -->
            <section class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="heroicons:bolt" class="text-amber-500 text-lg" />
                <h3 class="text-sm font-black uppercase tracking-widest text-zinc-400">Executive Summary</h3>
              </div>
              <div class="bg-zinc-950 p-8 rounded-3xl border border-zinc-800/50 relative overflow-hidden group">
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors duration-700"></div>
                <div class="markdown-container prose prose-invert max-w-none" v-html="renderMarkdown(evaluation.summary)"></div>
              </div>
            </section>

            <!-- Detailed Breakdown Grid -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="heroicons:chart-bar" class="text-blue-500 text-lg" />
                <h3 class="text-sm font-black uppercase tracking-widest text-zinc-400">Architectural Breakdown</h3>
              </div>
              <div class="grid md:grid-cols-2 gap-6">
                <div v-for="section in evaluation.breakdown" :key="section.section"
                  class="bg-zinc-800/40 border border-zinc-800/50 rounded-3xl p-6 hover:border-zinc-700 transition-all group">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-black uppercase tracking-widest text-white">{{ section.section }}</span>
                    <span class="text-sm font-black text-blue-400">{{ section.score }} / {{ section.maxScore }}</span>
                  </div>
                  <div class="h-1 bg-zinc-900 rounded-full mb-4 overflow-hidden">
                    <div :class="['h-full rounded-full transition-all duration-1000', scoreBarColor(Math.round(section.score / section.maxScore * 100))]"
                      :style="{ width: scoreBarWidth(section.score, section.maxScore) }" />
                  </div>
                  <div class="markdown-container prose prose-sm prose-invert max-w-none mb-4 opacity-80" v-html="renderMarkdown(section.feedback)"></div>
                  
                  <div v-if="section.improvements?.length" class="mt-4 pt-4 border-t border-zinc-800">
                    <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Critical Improvements</p>
                    <ul class="space-y-2">
                      <li v-for="imp in section.improvements" :key="imp" class="text-xs text-amber-500/80 flex items-start gap-2 group-hover:text-amber-400 transition-colors">
                        <Icon name="heroicons:arrow-trending-up" class="text-[10px] flex-shrink-0 mt-1" />
                        <span v-html="renderMarkdown(imp)"></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- Masterpiece Solution Tabbed -->
            <section class="space-y-6">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="heroicons:sparkles" class="text-purple-500 text-lg" />
                <h3 class="text-sm font-black uppercase tracking-widest text-zinc-400">Masterpiece Solution</h3>
              </div>
              <div class="bg-zinc-950 rounded-[2rem] border border-zinc-800/50 overflow-hidden">
                <div class="space-y-px">
                  <div v-for="sec in evaluation.modelSolution?.sections" :key="sec.heading" 
                       class="border-b border-zinc-900 last:border-0">
                    <div class="px-8 py-5 flex items-center gap-3 bg-zinc-900/10">
                       <div class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                       <h4 class="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">{{ sec.heading }}</h4>
                    </div>
                    <div class="px-8 py-8 markdown-container prose prose-invert max-w-none bg-zinc-950/30" v-html="renderMarkdown(sec.content)"></div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Strategic Takeaways -->
            <section class="space-y-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="heroicons:light-bulb" class="text-emerald-500 text-lg" />
                <h3 class="text-sm font-black uppercase tracking-widest text-zinc-400">Strategic Takeaways</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="kp in evaluation.keyTakeaways" :key="kp"
                  class="flex items-start gap-4 text-xs text-zinc-400 bg-zinc-900/50 hover:bg-zinc-900 hover:text-zinc-200 transition-all rounded-2xl px-5 py-4 border border-zinc-800/50 shadow-sm">
                  <Icon name="heroicons:check-badge" class="text-emerald-500 text-lg flex-shrink-0" />
                  <span v-html="renderMarkdown(kp)"></span>
                </div>
              </div>
            </section>

            <!-- Actions -->
            <div class="flex flex-col md:flex-row gap-4 pt-10 border-t border-zinc-800">
              <button @click="showEvalModal = false"
                class="flex-1 py-4 text-xs font-black uppercase tracking-widest border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-2xl transition-all">
                Continue Refining Design
              </button>
              
              <button @click="downloadReport" 
                class="flex-1 py-4 text-xs font-black uppercase tracking-widest bg-zinc-800 border border-zinc-700 text-white rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-3 shadow-xl">
                <Icon name="heroicons:arrow-down-tray" class="text-base" />
                Download PDF Report
              </button>

              <NuxtLink to="/system-design/practice"
                class="flex-[1.5] py-4 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-2xl hover:shadow-[0_0_40px_rgba(239,68,68,0.2)] transition-all text-center flex items-center justify-center gap-2">
                Finish Problem Interview
                <Icon name="heroicons:chevron-right" />
              </NuxtLink>
            </div>
          </div>
          
          <!-- Modal Footer Decor -->
          <div class="px-8 py-6 bg-zinc-950 flex items-center justify-center border-t border-zinc-900/50">
             <div class="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">
                 <Icon name="heroicons:cpu-chip" />
                 Synchronized Architectural Integrity Audit v2.4
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── STEP RESULT MODAL (Mainly for Code) ── -->
    <div v-if="showStepResultModal && currentStepResult" 
      class="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:sparkles" class="text-blue-500" />
            <h2 class="text-sm font-black uppercase tracking-widest text-white">Evaluation Results</h2>
          </div>
          <button @click="showStepResultModal = false" class="text-zinc-500 hover:text-white transition-colors">
            <Icon name="heroicons:x-mark" />
          </button>
        </div>
        
        <div class="p-6">
          <div class="flex items-center gap-4 mb-6">
            <div :class="['w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2', currentStepResult.passing ? 'border-green-500 bg-green-500/10' : 'border-amber-500 bg-amber-500/10']">
              <span :class="['text-2xl font-black', currentStepResult.passing ? 'text-green-400' : 'text-amber-400']">{{ currentStepResult.score }}</span>
              <span class="text-[8px] font-bold uppercase tracking-tighter opacity-60">Score</span>
            </div>
            <div>
              <h3 :class="['text-lg font-black', currentStepResult.passing ? 'text-green-400' : 'text-amber-400']">
                {{ currentStepResult.passing ? 'Solid Implementation!' : 'Needs Improvement' }}
              </h3>
              <p class="text-xs text-zinc-400">{{ currentStepResult.feedback }}</p>
            </div>
          </div>

          <div class="space-y-4 mb-6 text-center">
             <p class="text-xs text-zinc-500">All detailed architectural feedback, code patterns, and model answers have been synchronized with your central report.</p>
             <button @click="showAnalysisHub = true" class="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                <Icon name="heroicons:cpu-chip" class="mr-1" /> Open Engineering Audit Hub
             </button>
          </div>

          <button @click="showStepResultModal = false" 
            class="w-full py-3 bg-zinc-800 border border-zinc-700 text-white text-xs font-black rounded-xl hover:bg-zinc-700 transition-all uppercase tracking-widest">
            Got it, Continue
          </button>
        </div>
      </div>
    </div>



    <!-- ── ANALYSIS HUB MODAL ── -->
    <div v-if="showAnalysisHub" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-xl" @click="showAnalysisHub = false"></div>
      <div class="relative bg-zinc-950 border border-zinc-800 w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden border-zinc-800/50">
        <!-- Header -->
        <div class="px-10 py-8 border-b border-zinc-900 bg-zinc-900/10 flex items-center justify-between">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
              <Icon name="heroicons:cpu-chip" class="text-3xl text-blue-500" />
            </div>
            <div>
              <h2 class="text-2xl font-black text-white tracking-tight uppercase">Engineering Audit Hub</h2>
              <p class="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-1 opacity-60">Phase-by-Phase Architectural Analysis</p>
            </div>
          </div>
          <button @click="showAnalysisHub = false" class="p-3 hover:bg-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all border border-transparent hover:border-zinc-700">
            <Icon name="heroicons:x-mark" class="text-2xl" />
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto no-scrollbar p-10 pt-6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.03)_0,transparent_50%)]">
          <div class="space-y-16">
            <!-- Step Results Loop -->
            <div v-for="step in steps" :key="step.id" class="relative pl-10 border-l-2 border-zinc-900">
               <div :class="['absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-zinc-950 z-10', stepResults[step.id] ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-800']"></div>
               
               <div class="flex items-start justify-between mb-6">
                  <div class="space-y-1">
                     <span class="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-600 block mb-1">Phase {{ steps.indexOf(step) + 1 }}</span>
                     <h3 class="text-lg font-black text-white">{{ step.label }}</h3>
                   </div>
                   <div v-if="stepResults[step.id]" class="flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-800/50">
                      <div :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', stepResults[step.id]?.passing ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400']">
                         {{ stepResults[step.id]?.passing ? 'Passed' : 'Needs Optimization' }}
                      </div>
                      <div class="w-px h-4 bg-zinc-800"></div>
                      <div class="text-2xl font-black text-white leading-none">{{ stepResults[step.id]?.score }}<span class="text-xs text-zinc-600 font-bold ml-1">/10</span></div>
                   </div>
               </div>

                <div v-if="stepResults[step.id]" class="bg-zinc-900/30 border border-zinc-800/40 rounded-[2rem] p-8 shadow-inner backdrop-blur-sm group hover:border-zinc-700/50 transition-colors">
                  <!-- Metrics if Code -->
                  <div v-if="step.id === 'code' && stepResults[step.id]?.metrics" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10 pb-8 border-b border-zinc-800/50">
                     <div v-for="m in stepResults[step.id]?.metrics" :key="m.label" class="space-y-3">
                        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-zinc-500">
                           <span class="truncate">{{ m.label }}</span>
                           <span :class="m.score >= 8 ? 'text-green-400' : 'text-amber-400'">{{ m.score }}</span>
                        </div>
                        <div class="h-1.5 bg-zinc-950 rounded-full overflow-hidden shadow-inner">
                           <div :class="['h-full transition-all duration-1000', m.score >= 8 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]']" :style="{ width: `${m.score * 10}%` }"></div>
                        </div>
                     </div>
                  </div>

                  <div class="grid lg:grid-cols-3 gap-12">
                     <!-- Strengths -->
                     <div class="space-y-5">
                        <div class="flex items-center gap-3">
                           <div class="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                              <Icon name="heroicons:check-badge" class="text-green-500" />
                           </div>
                           <h4 class="text-[10px] font-black uppercase tracking-widest text-zinc-300">Key Strengths</h4>
                        </div>
                        <ul class="space-y-4">
                           <li v-for="w in stepResults[step.id]?.whatWentWell" :key="w" class="text-xs text-zinc-400 leading-relaxed flex items-start gap-4 p-4 bg-zinc-950/20 rounded-2xl border border-zinc-800/10">
                              <span class="text-green-500 font-black">•</span> {{ w }}
                           </li>
                        </ul>
                     </div>

                     <!-- Improvements -->
                     <div class="space-y-5">
                        <div class="flex items-center gap-3">
                           <div class="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                              <Icon name="heroicons:bolt-slash" class="text-amber-500" />
                           </div>
                           <h4 class="text-[10px] font-black uppercase tracking-widest text-zinc-300">Target Improvements</h4>
                        </div>
                        <ul class="space-y-4">
                           <li v-for="imp in stepResults[step.id]?.improvements" :key="imp" class="text-xs text-zinc-400 leading-relaxed flex items-start gap-4 p-4 bg-zinc-950/20 rounded-2xl border border-zinc-800/10">
                              <span class="text-amber-600 font-black">•</span> {{ imp }}
                           </li>
                        </ul>
                     </div>

                     <!-- Model Solution -->
                     <div class="space-y-5">
                        <div class="flex items-center gap-3">
                           <div class="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                              <Icon name="heroicons:light-bulb" class="text-blue-500" />
                           </div>
                           <h4 class="text-[10px] font-black uppercase tracking-widest text-zinc-300">Best Practice Patterns</h4>
                        </div>
                        <div class="markdown-container prose prose-invert max-w-none bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/30 overflow-hidden shadow-2xl" 
                             v-html="renderMarkdown(stepResults[step.id]?.modelAnswer || '')">
                        </div>
                     </div>
                  </div>
                </div>
                <div v-else class="bg-zinc-900/10 border-2 border-zinc-900 border-dashed rounded-[2rem] p-12 text-center group hover:bg-zinc-900/20 transition-all">
                  <Icon name="heroicons:lock-closed" class="text-4xl text-zinc-800 mb-4 group-hover:text-zinc-700 transition-colors" />
                  <p class="text-xs text-zinc-600 font-black uppercase tracking-widest">Phase Evaluation Pending</p>
                  <p class="text-[10px] text-zinc-700 mt-2">Submit this phase to unlock deep architectural analysis.</p>
                </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-10 py-8 bg-zinc-900/30 border-t border-zinc-900 flex items-center justify-between">
           <div class="flex items-center gap-4">
              <div class="flex -space-x-3">
                 <div v-for="i in 3" :key="i" class="w-8 h-8 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center">
                    <Icon name="heroicons:sparkles" class="text-[10px] text-zinc-600" />
                 </div>
              </div>
              <p class="text-[10px] font-bold text-zinc-500 max-w-xs">AI audit uses senior engineering rubrics to evaluate your architectural decision making.</p>
           </div>
           <button @click="showAnalysisHub = false" class="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95">
              Confirm & Return to Workspace
           </button>
        </div>
      </div>
    </div>
    <!-- ── RESTRICTION MODAL ── -->
    <div v-if="showRestrictionModal" class="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showRestrictionModal = false"></div>
      <div class="relative bg-zinc-950 border border-zinc-800 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl text-center border-amber-500/20">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Icon name="heroicons:lock-closed" class="text-3xl text-amber-500" />
        </div>
        <h2 class="text-2xl font-black text-white mb-2 tracking-tight">Audit Requirements Not Met</h2>
        <p class="text-zinc-500 text-xs mb-8 leading-relaxed font-bold uppercase tracking-widest opacity-60">
          Unlock your final engineering audit and masterpiece solution
        </p>

        <div class="space-y-3 mb-8 text-left">
           <div class="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div :class="['w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', steps.filter(s => stepResults[s.id] !== undefined || s.skipped).length >= steps.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/10 text-red-400']">
                 <Icon :name="steps.filter(s => stepResults[s.id] !== undefined || s.skipped).length >= steps.length ? 'heroicons:check-circle' : 'heroicons:x-circle'" class="text-sm" />
              </div>
              <div class="flex-1">
                 <p class="text-[11px] font-black text-white uppercase tracking-wider">Phase Competition</p>
                 <p class="text-[10px] text-zinc-500">{{ steps.filter(s => stepResults[s.id] !== undefined || s.skipped).length }}/{{ steps.length }} phases touched</p>
              </div>
           </div>

           <div class="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div :class="['w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', steps.filter(s => s.skipped).length <= steps.length / 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/10 text-red-400']">
                 <Icon :name="steps.filter(s => s.skipped).length <= steps.length / 2 ? 'heroicons:check-circle' : 'heroicons:x-circle'" class="text-sm" />
              </div>
              <div class="flex-1">
                 <p class="text-[11px] font-black text-white uppercase tracking-wider">Fidelity Requirement</p>
                 <p class="text-[10px] text-zinc-500">Maximum 50% phases can be skipped (Current: {{ steps.filter(s => s.skipped).length }})</p>
              </div>
           </div>

           <div class="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div :class="['w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', averageScore >= 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/10 text-red-400']">
                 <Icon :name="averageScore >= 5 ? 'heroicons:check-circle' : 'heroicons:x-circle'" class="text-sm" />
              </div>
              <div class="flex-1">
                 <p class="text-[11px] font-black text-white uppercase tracking-wider">Engineering Score</p>
                 <p class="text-[10px] text-zinc-500">Minimum 5.0/10 avg score needed (Current: {{ averageScore.toFixed(1) }})</p>
              </div>
           </div>
        </div>

        <button @click="showRestrictionModal = false" 
          class="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black rounded-2xl transition-all uppercase tracking-widest border border-zinc-700">
          Continue Refining Design
        </button>
      </div>
    </div>
    <div v-if="showQuitModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showQuitModal = false"></div>
      <div class="relative bg-zinc-900 border border-zinc-800 w-full max-w-md p-8 rounded-3xl shadow-2xl text-center">
        <div class="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:exclamation-triangle" class="text-3xl text-red-500" />
        </div>
        <h2 class="text-xl font-black text-white mb-2">Abandon Interview?</h2>
        <p class="text-zinc-400 text-sm mb-8 leading-relaxed">
          Your progress for this problem will not be saved. Are you sure you want to quit the session?
        </p>
        <div class="flex flex-col gap-3">
          <button @click="showQuitModal = false" 
            class="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[11px]">
            Keep Designing
          </button>
          <NuxtLink to="/system-design/practice"
            class="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all uppercase tracking-widest text-[11px] text-center">
            Quit Interview
          </NuxtLink>
        </div>
      </div>
    </div>
    <!-- ── DEVICE RESTRICTION OVERLAY (Desktop Only) ── -->
    <div class="lg:hidden fixed inset-0 z-[1000] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1)_0,transparent_70%)]"></div>
      
      <div class="relative max-w-sm">
        <div class="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 transform transition-transform hover:rotate-0">
          <Icon name="heroicons:computer-desktop" class="text-4xl text-red-500" />
        </div>
        
        <h2 class="text-2xl font-black text-white mb-4 tracking-tight">Desktop Required</h2>
        <p class="text-zinc-400 text-sm leading-relaxed mb-8">
          The Engineering Design Simulator requires a larger workspace to handle complex architectural diagrams, multi-file code editors, and deep-dive technical audits.
        </p>
        
        <div class="space-y-4">
          <div class="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-3 text-left">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="heroicons:check-circle" class="text-lg text-emerald-500" />
            </div>
            <p class="text-[11px] text-zinc-300 font-medium">Please switch to a Laptop or Desktop (min 1024px width) to continue.</p>
          </div>
          
          <NuxtLink to="/system-design/practice" 
            class="block w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-black rounded-xl transition-all uppercase tracking-widest border border-zinc-700">
            Back to Problem List
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ── NEW FILE/FOLDER MODAL ── -->
    <transition name="fade">
      <div v-if="showNewFSModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="showNewFSModal = false"></div>
        <div class="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/50">
              <div class="flex items-center gap-3">
                  <Icon :name="fsModalType === 'file' ? 'heroicons:document-plus' : 'heroicons:folder-plus'" 
                    :class="['text-lg', fsModalType === 'file' ? 'text-blue-500' : 'text-amber-500']" />
                  <div class="flex flex-col">
                    <h3 class="text-xs font-black text-white uppercase tracking-widest">
                       New {{ fsModalType === 'file' ? 'File' : 'Folder' }}
                    </h3>
                    <span v-if="fsModalParentPath" class="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">In: {{ fsModalParentPath }}</span>
                  </div>
              </div>
              <button @click="showNewFSModal = false" class="text-zinc-500 hover:text-white transition-colors">
                  <Icon name="heroicons:x-mark" class="text-sm" />
              </button>
          </div>
          <div class="p-6">
              <p class="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest">Name</p>
              <div class="relative group">
                  <input ref="fsNameInputRef" v-model="fsModalName" @keyup.enter="confirmFSAction"
                    :placeholder="fsModalType === 'file' ? 'e.g. Main.java' : 'e.g. src/models'"
                    class="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <p v-if="fsModalError" class="mt-2 text-[10px] text-red-500 font-bold flex items-center gap-1.5 animate-pulse">
                  <Icon name="heroicons:exclamation-triangle" /> {{ fsModalError }}
              </p>
              <div class="mt-6 flex gap-3">
                  <button @click="showNewFSModal = false" class="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all">Cancel</button>
                  <button @click="confirmFSAction" class="flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg active:scale-95">Create</button>
              </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── IDE FULLSCREEN OVERLAY ── -->
    <transition name="fade">
      <div v-if="isEditorFullscreen" class="fixed inset-0 z-[150] bg-[#0c0c0e] flex flex-col overflow-hidden">
        <!-- Fullscreen Header with full controls -->
        <div class="px-6 py-3 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-md flex items-center justify-between shrink-0">
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                  <span class="text-[9px] font-black text-white uppercase tracking-[0.3em] bg-blue-600 px-2 py-1 rounded">IDE Fullscreen</span>
                  <div class="h-4 w-px bg-zinc-800"></div>
                  <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{{ question.title }}</span>
                </div>

                <!-- Action Toolbar replicated in Fullscreen -->
                <div class="flex items-center gap-3 border-l border-zinc-800 pl-6">
                    <div class="flex items-center gap-1 bg-zinc-950 border border-white/5 rounded-lg p-0.5 shadow-xl">
                      <button @click="addFile('')" class="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-blue-400 transition-all group" title="New File">
                        <Icon name="heroicons:document-plus" />
                      </button>
                      <button @click="addFolder('')" class="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-amber-400 transition-all group" title="New Folder">
                        <Icon name="heroicons:folder-plus" />
                      </button>
                      <div class="w-px h-3 bg-zinc-800 mx-1"></div>
                      <button @click="triggerImport" class="px-3 py-1 text-[9px] font-black uppercase text-zinc-500 hover:text-white flex items-center gap-1.5">
                        <Icon name="heroicons:arrow-up-tray" /> Import
                      </button>
                      <button @click="triggerFolderImport" class="px-3 py-1 text-[9px] font-black uppercase text-zinc-500 hover:text-white flex items-center gap-1.5">
                        <Icon name="heroicons:folder-arrow-down" /> Folder
                      </button>
                      <button @click="exportProject" class="px-3 py-1 text-[9px] font-black uppercase text-zinc-500 hover:text-white flex items-center gap-1.5">
                        <Icon name="heroicons:arrow-down-tray" /> Export
                      </button>
                    </div>
                </div>
            </div>
            
            <button @click="isEditorFullscreen = false" class="flex items-center gap-2 px-5 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-[10px] font-black uppercase rounded-lg transition-all border border-red-500/20 active:scale-95 shadow-lg shadow-red-500/5">
                <Icon name="heroicons:x-mark" class="text-xs" /> Exit Workspace
            </button>
        </div>

        <div class="flex-1 flex min-h-0 relative">
            <!-- Reuse Sidebar Component Style -->
            <div class="w-72 border-r border-zinc-800 flex flex-col bg-zinc-950/50 backdrop-blur-xl shrink-0 overflow-hidden">
                <div class="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between shrink-0">
                  <span class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Structure</span>
                  <span class="text-[8px] font-mono text-zinc-700 bg-zinc-900/50 px-2 py-0.5 rounded border border-white/5">{{ codeFiles.length }} Entrie{{ codeFiles.length !== 1 ? 's' : '' }}</span>
                </div>
                
                <div class="flex-1 overflow-y-auto p-4 space-y-0.5 custom-scrollbar">
                  <template v-for="item in fileTree" :key="item.path">
                    <!-- Recursive rendering logic should be simplified or components should be used. 
                         For now, I'll replicate the core UI style to avoid huge diff complexity. -->
                    <div v-if="item.type === 'folder'" class="space-y-0.5 mb-1">
                      <div @click="toggleFolder(item.path)"
                        class="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/[0.03] text-zinc-500 hover:text-zinc-300 transition-all group">
                        <Icon :name="expandedFolders.has(item.path) ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" class="text-[10px]" />
                        <Icon :name="expandedFolders.has(item.path) ? 'heroicons:folder-open' : 'heroicons:folder'" class="text-sm text-amber-500/70" />
                        <span class="text-[11px] font-black uppercase tracking-tight flex-1">{{ item.name }}</span>
                        <!-- Inline Folder Actions -->
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click.stop="addFile(item.path)" class="p-1 hover:text-blue-400"><Icon name="heroicons:document-plus" class="text-[10px]" /></button>
                            <button @click.stop="addFolder(item.path)" class="p-1 hover:text-amber-500"><Icon name="heroicons:folder-plus" class="text-[10px]" /></button>
                        </div>
                      </div>
                      <!-- Sub-items -->
                      <div v-if="expandedFolders.has(item.path)" class="ml-4 pl-2 border-l border-white/5 space-y-0.5">
                        <div v-for="child in item.children" :key="child.path"
                          v-show="!child.name.startsWith('.')"
                          @click="child.type === 'file' ? activeFilePath = child.path : toggleFolder(child.path)"
                          :class="['flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all border shadow-sm group/child', 
                            activeFilePath === child.path ? 'bg-blue-600/5 border-blue-500/20 text-blue-400' : 'text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300']">
                          <Icon :name="child.type === 'file' ? getFileIcon(child.name) : (expandedFolders.has(child.path) ? 'heroicons:folder-open' : 'heroicons:folder')" 
                            :class="['text-sm', child.type === 'folder' ? 'text-amber-500/60' : '']" />
                          <span class="text-[11px] font-bold truncate tracking-tight flex-1">{{ child.name }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="!item.name.startsWith('.')" @click="activeFilePath = item.path"
                      :class="['flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all border shadow-sm group mb-0.5', 
                        activeFilePath === item.path ? 'bg-blue-600/5 border-blue-500/20 text-blue-400 shadow-xl' : 'text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300']">
                      <Icon :name="getFileIcon(item.name)" class="text-sm" />
                      <span class="text-[11px] font-bold truncate tracking-tight">{{ item.name }}</span>
                    </div>
                  </template>
                </div>
            </div>

            <!-- Content Area Replicated -->
            <div class="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
                <!-- Tabs in Fullscreen -->
                <div class="flex bg-zinc-950 border-b border-zinc-800/50 items-center overflow-x-auto no-scrollbar shrink-0">
                  <div v-for="tabPath in openTabs" :key="tabPath"
                    @click="activeFilePath = tabPath"
                    :class="['flex items-center gap-3 px-6 py-3 cursor-pointer transition-all border-r border-zinc-900 group/tab relative', 
                      activeFilePath === tabPath ? 'bg-zinc-900/50 text-blue-400 shadow-inner' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/30']">
                    <div v-if="activeFilePath === tabPath" class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-lg"></div>
                    <Icon :name="getFileIcon(tabPath)" class="text-sm" />
                    <span class="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{{ tabPath.split('/').pop() }}</span>
                    <button @click.stop="closeTab(tabPath)" class="ml-2 p-1 rounded-md hover:bg-zinc-800 opacity-0 group-hover/tab:opacity-100 transition-opacity">
                      <Icon name="heroicons:x-mark" class="text-[10px]" />
                    </button>
                  </div>
                </div>

                <!-- Breadcrumbs in Fullscreen -->
                <div v-if="activeFilePath" class="px-8 py-3 bg-zinc-950/20 border-b border-zinc-900/50 flex items-center gap-3">
                  <Icon name="heroicons:home-modern" class="text-[10px] text-zinc-700" />
                  <template v-for="(part, i) in breadcrumbs" :key="i">
                    <span class="text-[10px] font-black text-zinc-600">{{ part }}</span>
                    <Icon v-if="i < breadcrumbs.length - 1" name="heroicons:chevron-right" class="text-[8px] text-zinc-800" />
                  </template>
                </div>

                <div class="flex-1 relative overflow-hidden">
                    <SystemDesignEditor v-if="activeFile" v-model="activeFile.content" :language="codeLanguage" :path="activeFile.path" />
                </div>
            </div>
        </div>
      </div>
    </transition>
    <!-- ── GUIDELINES MODAL ── -->
    <Transition name="fade-overlay">
      <div v-if="showGuidelinesModal" class="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
        <div class="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl w-full max-w-3xl my-8">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-zinc-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Icon name="heroicons:book-open" class="text-emerald-400 text-xl" />
              </div>
              <div>
                <h2 class="text-lg font-black text-white">Interview Guidelines</h2>
                <p class="text-xs text-zinc-400">{{ isLLD ? 'Low-Level Design' : 'High-Level Design' }} · {{ question.title }}</p>
              </div>
            </div>
            <button @click="showGuidelinesModal = false" class="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
              <Icon name="heroicons:x-mark" class="text-lg" />
            </button>
          </div>

          <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">

            <!-- General Interview Tips -->
            <div class="bg-zinc-800/40 rounded-2xl p-5 border border-zinc-700/50">
              <h3 class="text-sm font-black text-white mb-3 flex items-center gap-2">
                <Icon name="heroicons:light-bulb" class="text-amber-400" /> General Interview Tips
              </h3>
              <div class="grid sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                <div class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">›</span> Think out loud — silence is your enemy</div>
                <div class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">›</span> Ask clarifying questions before diving in</div>
                <div class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">›</span> State trade-offs explicitly — both sides</div>
                <div class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">›</span> Validate assumptions with data/numbers</div>
                <div class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">›</span> Start simple, then iterate toward scale</div>
                <div class="flex items-start gap-2"><span class="text-amber-400 mt-0.5">›</span> Each Audit step unlocks the next — don't skip</div>
              </div>
            </div>

            <!-- Stage-by-stage guide -->
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              <Icon name="heroicons:list-bullet" class="text-blue-400" /> Stage-by-Stage Breakdown
            </h3>

            <!-- LLD stages -->
            <template v-if="isLLD">
              <div v-for="(info, id) in lldStageInfo" :key="id" class="bg-zinc-800/30 rounded-2xl border border-zinc-800 overflow-hidden">
                <div class="flex items-center gap-3 p-4 border-b border-zinc-800/60">
                  <Icon :name="info.icon" :class="[info.color, 'text-lg']" />
                  <div class="flex-1">
                    <p class="font-black text-white text-sm">{{ steps.find(s => s.id === id)?.label }}</p>
                    <p class="text-[10px] text-zinc-500">{{ info.duration }}</p>
                  </div>
                  <span class="text-[10px] px-2 py-1 rounded-full bg-zinc-700 text-zinc-400">{{ info.duration }}</span>
                </div>
                <div class="p-4 space-y-3 text-xs">
                  <p class="text-zinc-300 leading-relaxed">{{ info.what }}</p>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">✅ Expected Deliverables</p>
                    <ul class="space-y-1">
                      <li v-for="e in info.expected" :key="e" class="flex items-start gap-1.5 text-zinc-400">
                        <span class="text-green-400 flex-shrink-0 mt-0.5">›</span> {{ e }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">💡 Pro Tips</p>
                    <ul class="space-y-1">
                      <li v-for="t in info.tips" :key="t" class="flex items-start gap-1.5 text-zinc-400">
                        <span class="text-amber-400 flex-shrink-0 mt-0.5">›</span> {{ t }}
                      </li>
                    </ul>
                  </div>
                  <div class="bg-zinc-800/60 rounded-xl p-2.5">
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🎯 Scoring Focus</p>
                    <p class="text-zinc-300">{{ info.scoringFocus }}</p>
                  </div>
                </div>
              </div>
            </template>

            <!-- HLD stages -->
            <template v-else>
              <div v-for="(info, id) in hldStageInfo" :key="id" class="bg-zinc-800/30 rounded-2xl border border-zinc-800 overflow-hidden">
                <div class="flex items-center gap-3 p-4 border-b border-zinc-800/60">
                  <Icon :name="info.icon" :class="[info.color, 'text-lg']" />
                  <div class="flex-1">
                    <p class="font-black text-white text-sm">{{ steps.find(s => s.id === id)?.label }}</p>
                  </div>
                  <span class="text-[10px] px-2 py-1 rounded-full bg-zinc-700 text-zinc-400">{{ info.duration }}</span>
                </div>
                <div class="p-4 space-y-3 text-xs">
                  <p class="text-zinc-300 leading-relaxed">{{ info.what }}</p>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">✅ Expected Deliverables</p>
                    <ul class="space-y-1">
                      <li v-for="e in info.expected" :key="e" class="flex items-start gap-1.5 text-zinc-400">
                        <span class="text-green-400 flex-shrink-0 mt-0.5">›</span> {{ e }}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">💡 Pro Tips</p>
                    <ul class="space-y-1">
                      <li v-for="t in info.tips" :key="t" class="flex items-start gap-1.5 text-zinc-400">
                        <span class="text-amber-400 flex-shrink-0 mt-0.5">›</span> {{ t }}
                      </li>
                    </ul>
                  </div>
                  <div class="bg-zinc-800/60 rounded-xl p-2.5">
                    <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">🎯 Scoring Focus</p>
                    <p class="text-zinc-300">{{ info.scoringFocus }}</p>
                  </div>
                </div>
              </div>
            </template>

            <!-- Scoring overview -->
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-5">
              <h3 class="text-sm font-black text-white mb-3 flex items-center gap-2">
                <Icon name="heroicons:trophy" class="text-yellow-400" /> How You're Scored
              </h3>
              <div class="grid sm:grid-cols-2 gap-3 text-xs">
                <div class="bg-zinc-900/50 rounded-xl p-3">
                  <p class="font-bold text-white mb-1">Per-Step Audit</p>
                  <p class="text-zinc-400">Each step is scored 0–10. The AI evaluates completeness, depth, and correctness against a model answer.</p>
                </div>
                <div class="bg-zinc-900/50 rounded-xl p-3">
                  <p class="font-bold text-white mb-1">Final Report</p>
                  <p class="text-zinc-400">Requires an average ≥ 5.0 across all evaluated steps. Generates a full PDF report with AI model answers.</p>
                </div>
                <div class="bg-zinc-900/50 rounded-xl p-3">
                  <p class="font-bold text-white mb-1">Grades</p>
                  <p class="text-zinc-400">A+ ≥ 90% · A ≥ 80% · B ≥ 70% · C ≥ 60% · D ≥ 50% · F below 50%</p>
                </div>
                <div class="bg-zinc-900/50 rounded-xl p-3">
                  <p class="font-bold text-white mb-1">Attempts</p>
                  <p class="text-zinc-400">Max 3 Audit attempts per step. Final report locks the question in read-only mode after submission.</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-zinc-800 flex justify-end">
            <button @click="showGuidelinesModal = false"
              class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-colors text-sm">
              Got it, let's go!
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── SIMULATION MODAL ── -->
    <Transition name="fade-overlay">
      <div v-if="showSimulationModal" class="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Icon name="heroicons:play-circle" class="text-violet-400 text-lg" />
              </div>
              <div>
                <h2 class="font-black text-white">System Simulation</h2>
                <p class="text-[10px] text-zinc-400">Interactive design validation for {{ question.title }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="showSimulationModal = false" class="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                <Icon name="heroicons:x-mark" class="text-lg" />
              </button>
            </div>
          </div>
          
          <!-- Simulation Component Area -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-zinc-950">
            <template v-if="simulationComponent">
              <component :is="simulationComponent" />
            </template>
            <div v-else class="flex flex-col items-center justify-center py-20 text-center">
              <div class="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
                <Icon name="heroicons:command-line" class="text-3xl text-zinc-700" />
              </div>
              <p class="text-white font-bold tracking-tight">Simulation Engine Not Found</p>
              <p class="text-xs text-zinc-500 max-w-xs mt-1">
                The interactive simulation for this specific design challenge is currently under development or not available for your current tier.
              </p>
            </div>
          </div>

          <!-- Footer/Status -->
          <div class="px-5 py-3 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Engine Active</span>
              </div>
              <div class="text-[10px] text-zinc-600 font-mono">v1.0.8-stable</div>
            </div>
            <button @click="showSimulationModal = false" class="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg border border-zinc-700 transition-colors">
              Close Simulation
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>



<style>
/* Global Custom Scrollbar for IDE */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>

<style scoped>
.markdown-container :deep(h1), 
.markdown-container :deep(h2), 
.markdown-container :deep(h3), 
.markdown-container :deep(h4), 
.markdown-container :deep(h5) {
  @apply font-black text-white tracking-tight leading-tight;
}

.markdown-container :deep(h1) { @apply text-2xl mb-6 mt-8; }
.markdown-container :deep(h2) { @apply text-xl mb-4 mt-8 pt-4 border-t border-zinc-800/50; }
.markdown-container :deep(h3) { @apply text-lg mb-3 mt-6 text-zinc-200; }

.markdown-container :deep(p) {
  @apply text-zinc-400 leading-relaxed mb-4 text-[13px] md:text-sm;
}

.markdown-container :deep(ul), 
.markdown-container :deep(ol) {
  @apply my-4 ml-4 space-y-2 list-outside;
}

.markdown-container :deep(ul) { @apply list-disc; }
.markdown-container :deep(ol) { @apply list-decimal; }

.markdown-container :deep(li) {
  @apply pl-2 text-zinc-400 text-[13px] md:text-sm leading-relaxed;
}

.markdown-container :deep(code) {
  @apply bg-zinc-800/50 px-1.5 py-0.5 rounded text-[11px] text-blue-400 font-mono border border-zinc-700/50;
}

.markdown-container :deep(.code-block-wrapper) {
  @apply my-6 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl;
}

.markdown-container :deep(pre) {
  @apply bg-zinc-950 p-6 m-0 overflow-x-auto;
}

.markdown-container :deep(pre code) {
  @apply block p-0 bg-transparent border-0 text-[12px] leading-[1.8] text-zinc-300 font-mono;
}

.markdown-container :deep(.code-lang-label) {
  @apply block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4 border-b border-zinc-900 pb-2;
}

.markdown-container :deep(blockquote) {
  @apply border-l-4 border-red-500/50 pl-6 my-6 italic text-zinc-400 bg-red-500/5 py-4 rounded-r-3xl;
}

.markdown-container :deep(.table-wrapper) {
  @apply my-8 rounded-3xl overflow-hidden border border-zinc-800 shadow-inner;
}

.markdown-container :deep(table) {
  @apply w-full border-collapse text-xs;
}

.markdown-container :deep(th) {
  @apply bg-zinc-900 px-4 py-3 text-left font-black text-white uppercase tracking-widest border-b border-zinc-800;
}

.markdown-container :deep(td) {
  @apply px-4 py-3 text-zinc-400 border-b border-zinc-800/50;
}

.markdown-container :deep(tr:last-child td) {
  @apply border-b-0;
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.sidebar-slide-enter-active, .sidebar-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-slide-enter-from, .sidebar-slide-leave-to {
  width: 0;
  opacity: 0;
  transform: translateX(-20px);
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #18181b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #27272a;
}

/* ── Global Loading Overlay Transition ──────────────────────────────────── */
.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.25s ease, backdrop-filter 0.25s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

/* ── Stage Tooltip Transition ───────────────────────────────────────────── */
.tooltip-pop-enter-active { transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1); }
.tooltip-pop-leave-active  { transition: all 0.12s ease; }
.tooltip-pop-enter-from    { opacity: 0; transform: translateY(-6px) scale(0.96); }
.tooltip-pop-leave-to      { opacity: 0; transform: translateY(-4px) scale(0.97); }

/* ── Read-Only mask: dims interactive areas when question is already done ─ */
.readonly-mask {
  position: relative;
  pointer-events: none;
  user-select: none;
  opacity: 0.65;
}
.readonly-mask::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  cursor: not-allowed;
}
</style>
