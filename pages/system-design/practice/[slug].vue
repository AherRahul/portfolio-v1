<script setup lang="ts">
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
const isLLD = computed(() => question.type === 'LLD' || question.type === 'Both')
const leftTab = ref<'guidelines' | 'description'>('guidelines')

interface Step { id: string; label: string; subtitle: string; locked: boolean; skipped: boolean }

const steps = ref<Step[]>(
  isLLD.value ? [
    { id: 'requirements', label: 'Requirements Gathering', subtitle: 'Identify functional and non-functional requirements', locked: false, skipped: false },
    { id: 'entities',     label: 'Identifying Core Entities', subtitle: 'List the main classes and objects', locked: true, skipped: false },
    { id: 'classes',      label: 'Designing Classes & Relationships', subtitle: 'Define attributes, methods, and relationships', locked: true, skipped: false },
    { id: 'code',         label: 'Code Implementation', subtitle: 'Implement your design following OOP principles', locked: true, skipped: false },
  ] : [
    { id: 'requirements', label: 'Requirements & Estimation', subtitle: 'Clarify scope and do capacity estimation', locked: false, skipped: false },
    { id: 'architecture', label: 'High-Level Architecture', subtitle: 'Draw the system components and data flow', locked: true, skipped: false },
    { id: 'deep-dive',    label: 'Deep Dive Key Components', subtitle: 'Explain the critical components in detail', locked: true, skipped: false },
    { id: 'scaling',      label: 'Scaling & Bottlenecks', subtitle: 'Address failure points and scaling strategies', locked: true, skipped: false },
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

const stepEvalCounts = ref<Record<string, number>>({})
const MAX_STEP_EVALS = 3

async function callStepEval(stepId: string, stepData: unknown): Promise<boolean> {
  const currentCount = stepEvalCounts.value[stepId] || 0
  if (currentCount >= MAX_STEP_EVALS) {
    stepError.value[stepId] = `Maximum evaluation attempts (${MAX_STEP_EVALS}) reached for this step to control API usage.`
    return false
  }

  stepEvaluating.value[stepId] = true
  stepError.value[stepId] = ''
  try {
    const result = await $fetch<StepResult>('/api/system-design/evaluate-step', {
      method: 'POST',
      body: {
        questionTitle: question.title,
        questionDescription: question.description,
        designType: question.type,
        difficulty: selectedDifficulty.value,
        language: codeLanguage.value,
        stepId,
        stepData: stepData,
      }
    })
    stepResults.value[stepId] = result
    stepEvalCounts.value[stepId] = currentCount + 1
    showAnalysisHub.value = true
    return true
  } catch (err: any) {
    stepError.value[stepId] = err?.data?.statusMessage || 'Evaluation failed. Please try again.'
    return false
  } finally {
    stepEvaluating.value[stepId] = false
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

// ── Code Step (Multi-file) ───────────────────────────────────────────────────
const codeLanguage = ref('java')
const activeFilePath = ref('Main.java')
const codeFiles = ref([
  { path: 'Main.java', content: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}` }
])

const activeFile = computed(() => codeFiles.value.find(f => f.path === activeFilePath.value) || codeFiles.value[0])

const LANGUAGES = [
  { id: 'java', label: 'Java', ext: '.java' },
  { id: 'python', label: 'Python', ext: '.py' },
  { id: 'javascript', label: 'JavaScript', ext: '.js' },
  { id: 'typescript', label: 'TypeScript', ext: '.ts' },
  { id: 'cpp', label: 'C++', ext: '.cpp' },
]

function addFile() {
  const ext = LANGUAGES.find(l => l.id === codeLanguage.value)?.ext || '.txt'
  const newName = `NewFile${codeFiles.value.length + 1}${ext}`
  codeFiles.value.push({ path: newName, content: '// New file logic...' })
  activeFilePath.value = newName
}

function deleteFile(path: string) {
  if (codeFiles.value.length <= 1) return
  const idx = codeFiles.value.findIndex(f => f.path === path)
  codeFiles.value.splice(idx, 1)
  if (activeFilePath.value === path) {
    activeFilePath.value = codeFiles.value[0].path
  }
}

function addFolder() {
  const folderName = prompt('Enter folder name:', 'utils')
  if (!folderName) return
  const ext = LANGUAGES.find(l => l.id === codeLanguage.value)?.ext || '.txt'
  const newPath = `${folderName}/NewFile${ext}`
  codeFiles.value.push({ path: newPath, content: '// New folder file...' })
  activeFilePath.value = newPath
}

function changeLang(id: string) {
  codeLanguage.value = id
  const ext = LANGUAGES.find(l => l.id === id)?.ext || '.txt'
  // Rename existing files extensions if they make sense or just reset
  codeFiles.value = [
    { path: `Main${ext}`, content: `// Start implementing ${question.title} in ${id}\n` }
  ]
  activeFilePath.value = `Main${ext}`
}

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
const hldRequirements = ref('')
const hldArchitecture = ref('')
const hldDeepDive = ref('')
const hldScaling = ref('')

async function submitHldStep(stepId: string, content: string, minLength = 50) {
  if (!content.trim() || content.trim().length < minLength) {
    stepError.value[stepId] = `Please write at least ${minLength} characters for a meaningful answer.`
    return
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

  if (!allStepsCompleted.value) {
    showRestrictionModal.value = true
    return
  }
  
  evaluating.value = true
  evalError.value = ''
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
      requirements: { functional: [hldRequirements.value], nonFunctional: [] },
      architecture: hldArchitecture.value,
      deepDive: hldDeepDive.value,
      scaling: hldScaling.value,
    }

    const result = await $fetch('/api/system-design/evaluate', {
      method: 'POST',
      body: {
        questionTitle: question.title,
        questionDescription: question.description,
        designType: question.type,
        difficulty: selectedDifficulty.value,
        language: codeLanguage.value,
        answers,
      }
    })
    evaluation.value = result
    
    // Persist to local storage
    if (typeof window !== 'undefined') {
      const storageKey = `sd_eval_${slug}`
      localStorage.setItem(storageKey, JSON.stringify({
        evaluation: result,
        timestamp: new Date().toISOString(),
        difficulty: selectedDifficulty.value,
        language: codeLanguage.value
      }))
    }

    showEvalModal.value = true
    pauseTimer() // Stop the clock when evaluation is shown
  } catch (err: any) {
    evalError.value = err?.data?.statusMessage || 'Evaluation failed. Please try again.'
  } finally {
    evaluating.value = false
  }
}

const savedReportData = ref<{ timestamp: string } | null>(null)

// Load saved evaluation on mount
onMounted(() => {
  if (typeof window !== 'undefined') {
    const storageKey = `sd_eval_${slug}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        evaluation.value = parsed.evaluation
        savedReportData.value = { timestamp: parsed.timestamp }
      } catch (e) {
        console.error('Failed to parse saved evaluation')
      }
    }
  }
})

async function downloadReport() {
  if (!evaluation.value) return
  try {
    const { downloadSystemDesignPDF } = await import('~/utils/pdfGenerator')
    await downloadSystemDesignPDF(question.title, evaluation.value as any)
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
// ── Run Simulation ───────────────────────────────────────────────────────────
const runningSimulation = ref(false)
const simulationOutput = ref<string[]>([])

async function runSimulation() {
  runningSimulation.value = true
  simulationOutput.value = ['> Building system architecture...', '> Initializing domain models...', '> Running design pattern validation...']
  
  setTimeout(() => {
    simulationOutput.value.push('> All modules integrated.')
    simulationOutput.value.push('> System simulation started successfully.')
    simulationOutput.value.push('> Latency: 42ms | Throughput: 12k req/s')
    runningSimulation.value = false
  }, 2000)
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-zinc-950">

    <!-- ── DIFFICULTY MODAL ── -->
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
    <div class="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-700 px-4 py-2 flex items-center gap-3 flex-wrap">
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

        <!-- Final Evaluate -->
        <div class="relative flex items-center group">
          <div v-if="!allStepsCompleted && !evaluation" class="absolute bottom-full right-0 mb-3 w-64 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[11px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl z-[100] backdrop-blur-xl">
             <div class="flex items-center gap-2 mb-2 text-zinc-100 font-black uppercase tracking-widest">
               <Icon name="heroicons:lock-closed" class="text-amber-500" />
               Audit Locked
             </div>
             <p class="mb-2 text-zinc-500 leading-tight">{{ evalRestrictionReason }}</p>
             <div class="flex items-center gap-2 text-[10px]">
                <div class="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                   <div :class="['h-full transition-all', averageScore >= 5 ? 'bg-emerald-500' : 'bg-amber-500']" :style="{ width: `${(averageScore / 10) * 100}%` }"></div>
                </div>
                <span :class="['font-black', averageScore >= 5 ? 'text-emerald-400' : 'text-zinc-500']">{{ averageScore.toFixed(1) }} <span class="opacity-50">/ 10</span></span>
             </div>

             <div class="absolute w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700 rotate-45 bottom-[-5px] right-4"></div>
          </div>
          <button
            @click="evaluate"
            :disabled="evaluating"
            class="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-30 flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
            <Icon v-if="evaluating" name="heroicons:arrow-path" class="animate-spin text-sm" />
            <Icon v-else name="heroicons:trophy" class="text-sm" />
            {{ evaluating ? 'Evaluating...' : (evaluation ? 'View Final Report' : 'Generate Final Eval') }}
          </button>
        </div>

        <!-- Saved Badge -->
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

        <button @click="showQuitModal = true"
          class="px-4 py-1.5 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg transition-colors">
          Quit
        </button>
      </div>
    </div>

    <!-- ── MAIN CONTENT ── -->
    <div v-if="!showDifficultyModal" class="relative flex flex-1 min-h-0 overflow-hidden">
      
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
        <button @click="leftTab = 'description'" :class="['p-2 rounded-lg transition-all', leftTab === 'description' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-300']">
          <Icon name="heroicons:document-text" class="text-lg" />
        </button>
        <!-- <div class="mt-auto flex flex-col items-center gap-4">
          <button class="p-2 text-zinc-600 hover:text-zinc-300"><Icon name="heroicons:cpu-chip" class="text-lg" /></button>
          <button class="p-2 text-zinc-600 hover:text-zinc-300"><Icon name="heroicons:chat-bubble-left-right" class="text-lg" /></button>
        </div> -->
      </div>

      <!-- LEFT PANEL – content -->
      <div class="w-64 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 overflow-y-auto hidden md:flex flex-col">
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

      <!-- RIGHT PANEL – steps workspace -->
      <div :class="['flex-1 flex flex-col bg-zinc-950 min-h-0', activeStepId === 'code' ? 'overflow-hidden' : '']">
        <!-- Step progress breadcrumb -->
        <div :class="['flex-shrink-0 flex items-center gap-2 flex-wrap border-zinc-800', activeStepId === 'code' ? 'p-4 border-b bg-zinc-900/10' : 'p-4 md:p-6 pb-0 mb-6']">
          <button v-for="(step, i) in steps" :key="step.id"
            @click="goToStep(step.id)"
            :class="[
              'flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all',
              step.id === activeStepId ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/10' :
              step.locked ? 'border-zinc-700 text-zinc-600 cursor-not-allowed opacity-50' :
              step.skipped ? 'border-zinc-600 text-zinc-500 line-through' :
              'border-zinc-600 text-zinc-400 hover:border-zinc-400 cursor-pointer'
            ]">
            <span :class="['w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black', step.id === activeStepId ? 'bg-white text-red-500' : 'bg-zinc-700 text-zinc-400']">{{ i + 1 }}</span>
            <span class="hidden sm:inline">{{ step.label }}</span>
            <span v-if="step.skipped" class="text-[10px] text-zinc-500">(Skipped)</span>
          </button>
        </div>

        <div :class="['flex-1 min-h-0', activeStepId === 'code' ? 'overflow-hidden' : 'overflow-y-auto p-4 md:p-6 pt-0']">

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

          <div class="flex items-center gap-3 mt-4">
            <button @click="submitRequirements" :disabled="!canEvaluateReqs || stepEvaluating['requirements']"
              class="px-5 py-2 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-1.5">
              <svg v-if="stepEvaluating['requirements']" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <Icon v-else name="heroicons:sparkles" class="text-sm" />
              {{ stepEvaluating['requirements'] ? 'Evaluating...' : 'Evaluate Requirements' }}
            </button>
            <button @click="skipStep" :disabled="stepEvaluating['requirements']" class="px-5 py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors disabled:opacity-50">Skip →</button>
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

          <div class="flex items-center gap-3 mt-4">
            <button @click="submitEntities" :disabled="!canEvaluateEntities || stepEvaluating['entities']"
              class="px-5 py-2 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-1.5">
              <svg v-if="stepEvaluating['entities']" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <Icon v-else name="heroicons:sparkles" class="text-sm" />
              {{ stepEvaluating['entities'] ? 'Evaluating...' : 'Evaluate Entities' }}
            </button>
            <button @click="skipStep" :disabled="stepEvaluating['entities']" class="px-5 py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors disabled:opacity-50">Skip →</button>
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

          <div class="flex items-center gap-3 mt-4">
            <button @click="submitClasses" :disabled="!canEvaluateClasses || stepEvaluating['classes']"
              class="px-5 py-2 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-1.5">
              <svg v-if="stepEvaluating['classes']" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <Icon v-else name="heroicons:sparkles" class="text-sm" />
              {{ stepEvaluating['classes'] ? 'Evaluating...' : 'Evaluate Design' }}
            </button>
            <button @click="skipStep" :disabled="stepEvaluating['classes']" class="px-5 py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors disabled:opacity-50">Skip →</button>
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
        <div v-else-if="activeStepId === 'code'" class="flex flex-col h-full bg-zinc-950">
          <!-- Inner Layout -->
          <div class="flex flex-1 min-h-0">
            <!-- File Explorer Sidebar -->
            <div class="w-64 bg-zinc-900/40 border-r border-zinc-800 flex flex-col">
              <div class="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/20">
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:folder-open" class="text-zinc-400" />
                  <span class="text-[11px] font-black uppercase tracking-widest text-zinc-400">Files</span>
                  <span class="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded-md">{{ codeFiles.length }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <button @click="addFile" class="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all" title="New File">
                    <Icon name="heroicons:document-plus" class="text-xs" />
                  </button>
                  <button @click="addFolder" class="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all" title="New Folder">
                    <Icon name="heroicons:folder-plus" class="text-xs" />
                  </button>
                </div>
              </div>
              
              <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
                <div v-for="file in codeFiles" :key="file.path"
                  @click="activeFilePath = file.path"
                  :class="['group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all border', 
                    activeFilePath === file.path ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300']">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <Icon :name="file.path.endsWith('.java') ? 'logos:java' : file.path.endsWith('.py') ? 'logos:python' : file.path.endsWith('.js') ? 'logos:javascript' : file.path.endsWith('.ts') ? 'logos:typescript-icon' : 'heroicons:document-text'" class="text-xs flex-shrink-0" />
                    <span class="text-[11px] font-semibold truncate">{{ file.path }}</span>
                  </div>
                  <button v-if="codeFiles.length > 1" @click.stop="deleteFile(file.path)" 
                    class="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-1">
                    <Icon name="heroicons:x-mark" class="text-xs" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Editor Area -->
            <div class="flex-1 flex flex-col min-w-0">
              <!-- Tabs -->
              <div class="flex bg-zinc-900/40 border-b border-zinc-800 items-center overflow-x-auto no-scrollbar">
                <div v-for="file in codeFiles" :key="file.path"
                  @click="activeFilePath = file.path"
                  :class="['px-4 py-2.5 text-[11px] font-bold border-r border-zinc-800 flex items-center gap-2 cursor-pointer transition-all min-w-[120px] max-w-[200px]', 
                    activeFilePath === file.path ? 'bg-zinc-950 text-white border-t-2 border-t-blue-500' : 'bg-transparent text-zinc-500 hover:text-zinc-300']">
                  <Icon :name="file.path.endsWith('.java') ? 'logos:java' : file.path.endsWith('.py') ? 'logos:python' : file.path.endsWith('.js') ? 'logos:javascript' : 'heroicons:document-text'" class="text-[10px]" />
                  <span class="truncate">{{ file.path }}</span>
                  <button v-if="codeFiles.length > 1 && activeFilePath === file.path" @click.stop="deleteFile(file.path)" class="ml-auto hover:text-red-400">
                    <Icon name="heroicons:x-mark" class="text-[10px]" />
                  </button>
                </div>
                
                <button @click="addFile" class="px-4 text-zinc-600 hover:text-zinc-300 transition-colors">
                  <Icon name="heroicons:plus" class="text-xs" />
                </button>

                <!-- Language Selector -->
                <div class="ml-auto px-4 flex items-center gap-2">
                  <span class="text-[10px] text-zinc-600 uppercase font-black">Language</span>
                  <select v-model="codeLanguage" @change="changeLang(codeLanguage)"
                    class="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-[10px] font-bold text-white focus:outline-none focus:border-blue-500">
                    <option v-for="l in LANGUAGES" :key="l.id" :value="l.id">{{ l.label }}</option>
                  </select>
                </div>
              </div>

              <!-- Main Editor -->
              <div class="flex-1 relative">
                <SystemDesignEditor 
                  v-if="activeFile"
                  v-model="activeFile.content" 
                  :language="codeLanguage" 
                  :path="activeFile.path"
                />
              </div>

              <!-- Analysis & Output Area -->
              <div class="h-48 border-t border-zinc-800 bg-zinc-900/10 flex flex-col overflow-hidden">
                <!-- Console Output Panel -->
                <div class="flex-1 flex flex-col min-h-0 bg-zinc-900/20">
                  <div class="px-4 py-1.5 border-b border-zinc-800 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span class="flex items-center gap-2"><Icon name="heroicons:command-line" /> Terminal</span>
                    <div class="flex gap-2">
                      <button @click="simulationOutput = []" class="hover:text-zinc-300" title="Clear"><Icon name="heroicons:trash" /></button>
                      <button class="hover:text-zinc-300"><Icon name="heroicons:chevron-down" /></button>
                    </div>
                  </div>
                  <div class="flex-1 p-4 font-mono text-[11px] text-zinc-500 overflow-y-auto space-y-1 no-scrollbar">
                    <p v-if="!stepEvaluating['code'] && simulationOutput.length === 0">$ system simulation ready...</p>
                    <p v-else-if="stepEvaluating['code']" class="text-blue-500/70 animate-pulse">> Evaluate Implementation: Analyzing architectural integrity...</p>
                    <template v-else>
                       <p v-for="(line, i) in simulationOutput" :key="i" :class="i === simulationOutput.length - 1 && runningSimulation ? 'text-zinc-300 animate-pulse' : 'text-zinc-500'">
                         {{ line }}
                       </p>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-3">
                <div :class="['w-1.5 h-1.5 rounded-full', canEvaluateCode ? 'bg-green-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]']"></div>
                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Compilation Ready</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Usage:</span>
                <div class="flex gap-1.5">
                   <div v-for="i in 3" :key="i" class="w-3 h-1 rounded-full bg-blue-500/20" :class="{'bg-blue-500': i === 1}"></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <button @click="runSimulation" :disabled="runningSimulation"
                class="px-5 py-2 text-[11px] font-black border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all flex items-center gap-2">
                <Icon :name="runningSimulation ? 'heroicons:arrow-path' : 'heroicons:play'" :class="['text-xs', { 'animate-spin': runningSimulation }]" /> 
                {{ runningSimulation ? 'Simulating...' : 'Run Solution' }}
              </button>
              <button @click="submitCode" :disabled="!canEvaluateCode || stepEvaluating['code']"
                :class="['px-6 py-2 text-[11px] font-black rounded-xl transition-all flex items-center gap-2 shadow-xl', 
                  canEvaluateCode ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/20' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed']">
                <Icon name="heroicons:sparkles" class="text-xs" />
                {{ stepEvaluating['code'] ? 'Evaluating...' : 'Evaluate Implementation' }}
              </button>
            </div>
          </div>
        </div>

        <!-- ─ HLD STEPS ─ -->
        <div v-else-if="activeStepId === 'architecture'">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-black flex items-center justify-center">2</span>
            <h2 class="text-base font-bold text-white">High-Level Architecture</h2>
          </div>
          <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <p class="text-xs text-zinc-400 mb-2">Describe the main components and data flow (client → LB → services → DB/cache):</p>
            <textarea v-model="hldArchitecture" placeholder="e.g., Client sends requests to Load Balancer → API Servers → reads from Redis cache, writes to PostgreSQL primary → read from replicas..."
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 resize-none"
              style="min-height: 200px;" />
          </div>
          <p v-if="stepError['architecture']" class="mt-3 text-xs text-red-400 flex items-center gap-1.5">
            <Icon name="heroicons:exclamation-circle" class="text-sm" /> {{ stepError['architecture'] }}
          </p>

          <!-- Live progress hint -->
          <div v-if="hldArchitecture.trim().length < 50" class="mt-3">
             <span class="px-2.5 py-1 rounded-full font-semibold bg-zinc-800 text-zinc-500 text-xs">
              ✓ Need at least 50 characters: {{ hldArchitecture.trim().length }}/50
             </span>
          </div>

          <div class="flex gap-3 mt-4">
            <button @click="submitHldStep('architecture', hldArchitecture)" :disabled="hldArchitecture.trim().length < 50 || stepEvaluating['architecture']"
              class="px-5 py-2 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-1.5">
              <svg v-if="stepEvaluating['architecture']" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <Icon v-else name="heroicons:sparkles" class="text-sm" />
              {{ stepEvaluating['architecture'] ? 'Evaluating...' : 'Evaluate Architecture' }}
            </button>
            <button @click="skipStep" :disabled="stepEvaluating['architecture']" class="px-5 py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors disabled:opacity-50">Skip →</button>
          </div>
          <div v-if="stepResults['architecture']" class="mt-5 rounded-xl border overflow-hidden"
            :class="stepResults['architecture'].passing ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5'">
            <div class="flex items-center gap-3 px-4 py-3" :class="stepResults['architecture'].passing ? 'border-green-500/30' : 'border-amber-500/30'">
              <span class="text-lg font-black" :class="stepResults['architecture'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['architecture'].score }}/10</span>
              <span class="text-xs font-bold" :class="stepResults['architecture'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['architecture'].passing ? '✓ Passing' : '⚠ Needs work' }}</span>
              <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">View Details in Hub</button>
              <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-red-500/10">Continue → Next Step</button>
            </div>
          </div>
        </div>

        <div v-else-if="activeStepId === 'deep-dive'">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center">3</span>
            <h2 class="text-base font-bold text-white">Deep Dive Key Components</h2>
          </div>
          <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <p class="text-xs text-zinc-400 mb-2">Explain the most critical component in detail (DB schema, API design, caching strategy, etc.):</p>
            <textarea v-model="hldDeepDive" placeholder="e.g., Database: PostgreSQL with users table (id, email, created_at), cached lookup by email in Redis with TTL 5min..."
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none"
              style="min-height: 200px;" />
          </div>
          <p v-if="stepError['deep-dive']" class="mt-3 text-xs text-red-400 flex items-center gap-1.5">
            <Icon name="heroicons:exclamation-circle" class="text-sm" /> {{ stepError['deep-dive'] }}
          </p>

          <!-- Live progress hint -->
          <div v-if="hldDeepDive.trim().length < 50" class="mt-3">
             <span class="px-2.5 py-1 rounded-full font-semibold bg-zinc-800 text-zinc-500 text-xs">
              ✓ Need at least 50 characters: {{ hldDeepDive.trim().length }}/50
             </span>
          </div>

          <div class="flex gap-3 mt-4">
            <button @click="submitHldStep('deep-dive', hldDeepDive)" :disabled="hldDeepDive.trim().length < 50 || stepEvaluating['deep-dive']"
              class="px-5 py-2 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-1.5">
              <svg v-if="stepEvaluating['deep-dive']" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <Icon v-else name="heroicons:sparkles" class="text-sm" />
              {{ stepEvaluating['deep-dive'] ? 'Evaluating...' : 'Evaluate Deep Dive' }}
            </button>
            <button @click="skipStep" :disabled="stepEvaluating['deep-dive']" class="px-5 py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors disabled:opacity-50">Skip →</button>
          </div>
          <div v-if="stepResults['deep-dive']" class="mt-5 rounded-xl border overflow-hidden"
            :class="stepResults['deep-dive'].passing ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5'">
            <div class="flex items-center gap-3 px-4 py-3" :class="stepResults['deep-dive'].passing ? 'border-green-500/30' : 'border-amber-500/30'">
              <span class="text-lg font-black" :class="stepResults['deep-dive'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['deep-dive'].score }}/10</span>
              <span class="text-xs font-bold" :class="stepResults['deep-dive'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['deep-dive'].passing ? '✓ Passing' : '⚠ Needs work' }}</span>
              <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">View Details in Hub</button>
              <button @click="goToStep(steps[activeStepIndex + 1]?.id)" class="ml-auto px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-red-500/10">Continue → Next Step</button>
            </div>
          </div>
        </div>

        <div v-else-if="activeStepId === 'scaling'">
          <div class="flex items-center gap-2 mb-4">
            <span class="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center">4</span>
            <h2 class="text-base font-bold text-white">Scaling & Bottlenecks</h2>
          </div>
          <div class="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <p class="text-xs text-zinc-400 mb-2">Identify single points of failure and how you would scale the system:</p>
            <textarea v-model="hldScaling" placeholder="e.g., SPOF: Single DB → add read replicas + failover. Hot keys in Redis → consistent hashing. Peak load → auto-scaling groups..."
              class="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none"
              style="min-height: 200px;" />
          </div>
          <p v-if="stepError['scaling']" class="mt-3 text-xs text-red-400 flex items-center gap-1.5">
            <Icon name="heroicons:exclamation-circle" class="text-sm" /> {{ stepError['scaling'] }}
          </p>

          <!-- Live progress hint -->
          <div v-if="hldScaling.trim().length < 50" class="mt-3">
             <span class="px-2.5 py-1 rounded-full font-semibold bg-zinc-800 text-zinc-500 text-xs">
              ✓ Need at least 50 characters: {{ hldScaling.trim().length }}/50
             </span>
          </div>

          <div class="flex gap-3 mt-4">
            <button @click="submitHldStep('scaling', hldScaling)" :disabled="hldScaling.trim().length < 50 || stepEvaluating['scaling']"
              class="px-5 py-2 text-xs font-bold bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-1.5">
              <svg v-if="stepEvaluating['scaling']" class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <Icon v-else name="heroicons:sparkles" class="text-sm" />
              {{ stepEvaluating['scaling'] ? 'Evaluating...' : 'Evaluate Scaling' }}
            </button>
            <button @click="skipStep" :disabled="stepEvaluating['scaling']" class="px-5 py-2 text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 rounded-lg transition-colors disabled:opacity-50">Skip →</button>
            <button @click="evaluate" class="ml-auto px-5 py-2 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity" title="Generate Final Performance Report">View Full Report 🏆</button>
          </div>
          <div v-if="stepResults['scaling']" class="mt-5 rounded-xl border overflow-hidden"
            :class="stepResults['scaling'].passing ? 'border-green-500/40 bg-green-500/5' : 'border-amber-500/40 bg-amber-500/5'">
            <div class="flex items-center gap-3 px-4 py-3" :class="stepResults['scaling'].passing ? 'border-green-500/30' : 'border-amber-500/30'">
              <span class="text-lg font-black" :class="stepResults['scaling'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['scaling'].score }}/10</span>
              <span class="text-xs font-bold" :class="stepResults['scaling'].passing ? 'text-green-400' : 'text-amber-400'">{{ stepResults['scaling'].passing ? '✓ Passing' : '⚠ Needs work' }}</span>
              <button @click="showAnalysisHub = true" class="ml-4 text-[10px] font-bold text-blue-400 hover:underline uppercase tracking-widest">View Details in Hub</button>
              <button @click="evaluate" class="ml-auto px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-red-500/10">View Full Report 🏆</button>
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

    <!-- ── STATUS BAR ── -->
    <div class="h-8 flex-shrink-0 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 justify-between select-none">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
           <div :class="['w-2 h-2 rounded-full animate-pulse', stepResults[activeStepId]?.passing ? 'bg-green-500' : 'bg-blue-500 font-bold']"></div>
           <span class="text-[10px] font-black uppercase tracking-tighter text-zinc-400">
             {{ stepResults[activeStepId] ? `${stepResults[activeStepId]!.score}/10 - ${stepResults[activeStepId]!.passing ? 'Passing' : 'Needs Work'}` : 'Evaluation Pending' }}
           </span>
        </div>
        <div class="h-3 w-px bg-zinc-800"></div>
        <span class="text-[10px] text-zinc-600 font-medium">Auto-save: enabled</span>
      </div>
      
      <div class="flex items-center gap-3">
        <span class="text-[10px] text-zinc-600 uppercase font-black tracking-widest">UTF-8</span>
        <span class="text-[10px] text-zinc-600 uppercase font-black tracking-widest">{{ activeStepId }} MODE</span>
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
  </div>
</template>

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
</style>
