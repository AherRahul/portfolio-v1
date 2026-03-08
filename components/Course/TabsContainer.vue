<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { downloadSummaryPDF } from '~/utils/pdfGenerator'
import { renderMarkdown } from '~/utils/markdownRenderer'
import { 
  getCachedSummary, 
  setCachedSummary, 
  getCachedQuiz, 
  setCachedQuiz, 
  updateQuizCompletion,
  hasExistingSummary,
  hasExistingQuiz,
  getCachedHinglish,
  setCachedHinglish,
  type CachedSummary,
  type CachedQuiz
} from '~/utils/aiContentCache'
// Import components that are now used in this container
const ArticleAgeWarning = resolveComponent('ArticleAgeWarning')
const ContentDoc = resolveComponent('ContentDoc')

interface ResourceItem {
  title: string
  type: 'video' | 'article' | 'documentation' | 'tool' | 'book' | 'course'
  url: string
  description?: string
  duration?: string
  author?: string
}

interface SummaryData {
  summary: string
  keyPoints: string[]
  concepts: string[]
  takeaways: string[]
  estimatedReadTime: number
}

interface QuizQuestion {
  id: string
  type: 'single-choice' | 'multiple-choice' | 'true-false' | 'fill-blank' | 'fill-in-blank'
  question: string
  options?: string[]
  correctAnswers: string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

const props = defineProps<{
  topicTitle: string
  content: string
  rawBody?: string
  resources?: ResourceItem[]
  difficulty?: 'easy' | 'medium' | 'hard'
  isOlderThanOneYear?: boolean
  enableAiNotes?: boolean
  enableAiQuiz?: boolean
  contentTheme?: 'dark' | 'light'
  enableResourcesTab?: boolean
  hideTabHeaders?: boolean
}>()

// Computed theme — falls back to 'dark' if parent didn't pass the prop
const theme = computed(() => props.contentTheme ?? 'dark')
const isLight = computed(() => theme.value === 'light')

// Setup image modal for course topic content
const { setupContentImages } = useContentImages()

// Tab state
const activeTab = ref('content')

const tabs = computed(() => {
  const allTabs = [
    { id: 'content', title: 'Content', icon: 'heroicons:document-text' },
    // hinglish tab intentionally hidden — accessible via Ctrl+H shortcut only
    { id: 'notes', title: 'AI Notes', icon: 'heroicons:light-bulb' },
    { id: 'quiz', title: 'Quiz', icon: 'heroicons:academic-cap' },
    { id: 'resources', title: 'Resources', icon: 'heroicons:link' }
  ]
  
  // Filter tabs based on AI flags (default to true if not specified)
  return allTabs.filter(tab => {
    if (tab.id === 'notes' && props.enableAiNotes === false) return false
    if (tab.id === 'quiz' && props.enableAiQuiz === false) return false
    if (tab.id === 'resources' && props.enableResourcesTab === false) return false
    return true
  })
})

// ── Hidden Hinglish overlay (Ctrl+H on desktop, long-press Content tab on mobile) ────────
const isHinglishOverlayOpen = ref(false)

function openHinglishOverlay() {
  isHinglishOverlayOpen.value = true
  if (!hinglishHtml.value && !hinglishLoading.value) {
    convertToHinglish()
  }
}

function closeHinglishOverlay() {
  isHinglishOverlayOpen.value = false
}

function handleCtrlH(e: KeyboardEvent) {
  // Only trigger if no input/textarea is focused
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
    e.preventDefault()
    if (isHinglishOverlayOpen.value) {
      closeHinglishOverlay()
    } else {
      openHinglishOverlay()
    }
  }
}

// ── Long-press on Content tab (mobile hidden trigger) ─────────────────────
let longPressTimer: ReturnType<typeof setTimeout> | null = null
const LONG_PRESS_MS = 1500

function onContentTabTouchStart(e: TouchEvent) {
  // Must be the Content tab
  longPressTimer = setTimeout(() => {
    longPressTimer = null
    // Prevent the normal click from also firing
    e.preventDefault()
    if (isHinglishOverlayOpen.value) {
      closeHinglishOverlay()
    } else {
      openHinglishOverlay()
    }
  }, LONG_PRESS_MS)
}

function onContentTabTouchEnd() {
  if (longPressTimer !== null) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function onContentTabTouchMove() {
  // Cancel long-press if the user scrolls
  if (longPressTimer !== null) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

// AI Summary state
const summaryData = ref<SummaryData | null>(null)
const summaryLoading = ref(false)
const summaryError = ref('')
const downloadingPdf = ref(false)

// Hinglish state
const hinglishHtml = ref<string | null>(null)
const hinglishLoading = ref(false)
const hinglishError = ref('')
const hinglishFromCache = ref(false)

// Quiz state
const quizData = ref<QuizQuestion[]>([])
const quizLoading = ref(false)
const quizError = ref('')
const quizDifficulty = ref<'easy' | 'medium' | 'hard'>('medium')
const quizQuestionCount = ref(10)
const cachedQuiz = ref<CachedQuiz | null>(null)
const isQuizFromCache = ref(false)
const downloadingResults = ref(false)

// Methods
function setActiveTab(tabId: string) {
  activeTab.value = tabId
  
  // Load data when tab is activated
  if (tabId === 'notes' && !summaryData.value && !summaryLoading.value) {
    generateSummary()
  }
  
  if (tabId === 'hinglish' && !hinglishHtml.value && !hinglishLoading.value) {
    convertToHinglish()
  }
  
  // Setup image modal when content tab is activated
  if (tabId === 'content') {
    // Small delay to ensure content is rendered
    setTimeout(() => {
      setupContentImages('.prose', true)
    }, 100)
  }
  
  if (tabId === 'quiz' && !quizData.value.length && !quizLoading.value) {
    // Auto-load existing quiz if it exists
    const cached = getCachedQuiz(props.content, props.topicTitle)
    if (cached) {
      quizData.value = cached.questions
      cachedQuiz.value = cached
      isQuizFromCache.value = true
      // Update UI to show actual quiz settings from cache
      quizDifficulty.value = cached.metadata.difficulty as 'easy' | 'medium' | 'hard'
      quizQuestionCount.value = cached.metadata.questionCount
      // console.log('🎯 Auto-loaded existing quiz on tab activation')
    }
  }
}

async function generateSummary() {
  // Check for cached summary first
  const cached = getCachedSummary(props.content, props.topicTitle)
  if (cached) {
    summaryData.value = cached.data
    // console.log('📋 Using cached summary from:', cached.metadata.createdAt)
    return
  }

  // Prevent generation if summary already exists
  if (hasExistingSummary(props.content, props.topicTitle)) {
    // console.log('📋 Summary already exists, skipping generation')
    return
  }

  summaryLoading.value = true
  summaryError.value = ''
  
  const { makeApiCall } = useApiEndpoints()
  
  try {
    const response = await makeApiCall('/api/summary/generate', {
      method: 'POST',
      body: {
        content: props.content,
        topicTitle: props.topicTitle,
        summaryType: 'comprehensive'
      }
    })
    
    const responseData = response as SummaryData
    summaryData.value = responseData
    
    // Cache the new summary
    setCachedSummary(props.content, props.topicTitle, responseData, props.difficulty)
    // console.log('💾 Generated and cached new summary')
    
  } catch (err: any) {
    summaryError.value = err.data?.message || 'Failed to generate summary. Please try again.'
    console.error('Summary generation failed:', err)
  } finally {
    summaryLoading.value = false
  }
}

/**
 * Replace HTML blocks and code fences with unique placeholder tokens so
 * the translate API only receives text content. After translation, restoreBlocks()
 * puts the originals back in the exact same positions.
 */
function extractBlocksWithPlaceholders(raw: string): { cleaned: string; blocks: string[] } {
  const blocks: string[] = []

  let text = raw

  // 1. Protect code fences (``` ... ```) — they must not be translated
  text = text.replace(/(`{3,}[\s\S]*?`{3,})/g, (match) => {
    const idx = blocks.length
    blocks.push(match)
    return `[[BLOCK_${idx}]]`
  })

  // 2. Protect multi-line HTML block elements (<div>, <table>, etc.)
  //    Articles have single-line massive <div> visualizations — the regex handles both.
  text = text.replace(/(<(?:div|table|figure|section|article|aside|header|footer|nav|main|ul|ol)[^>]*>[\s\S]*?<\/(?:div|table|figure|section|article|aside|header|footer|nav|main|ul|ol)>)/gi, (match) => {
    const idx = blocks.length
    blocks.push(match)
    return `[[BLOCK_${idx}]]`
  })

  // 3. Protect markdown images ![alt](url)
  text = text.replace(/(!\[[^\]]*\]\([^)]+\))/g, (match) => {
    const idx = blocks.length
    blocks.push(match)
    return `[[BLOCK_${idx}]]`
  })

  // Collapse extra blank lines
  text = text.replace(/\n{3,}/g, '\n\n')

  return { cleaned: text.trim(), blocks }
}

function restoreBlocks(translated: string, blocks: string[]): string {
  return translated.replace(/\[\[BLOCK_(\d+)\]\]/g, (_match, idx) => {
    return blocks[parseInt(idx)] ?? _match
  })
}

async function convertToHinglish() {
  // Check cache first
  const cached = getCachedHinglish(props.content, props.topicTitle)
  if (cached) {
    hinglishHtml.value = cached
    hinglishFromCache.value = true
    return
  }

  const source = props.rawBody || props.content
  if (!source) {
    hinglishError.value = 'No content available to convert.'
    return
  }

  // Extract HTML/code blocks into placeholders — only translatable text is sent to the API
  const { cleaned, blocks } = extractBlocksWithPlaceholders(source)

  if (!cleaned) {
    hinglishError.value = 'No translatable content found in this article.'
    return
  }

  hinglishLoading.value = true
  hinglishError.value = ''
  hinglishFromCache.value = false

  const { makeApiCall } = useApiEndpoints()

  try {
    const response = await makeApiCall('/api/translate', {
      method: 'POST',
      body: {
        content: cleaned,
        title: props.topicTitle,
        description: '',
        targetLanguage: 'hi'
      }
    }) as { translatedContent: string; translatedTitle: string; translatedDescription: string; language: string }

    const translatedMarkdown = response.translatedContent
    if (!translatedMarkdown || translatedMarkdown.trim().length < 10) {
      throw new Error('Empty translation received. Please try again.')
    }

    // Restore the original HTML blocks, code fences, and images at their exact positions
    const restored = restoreBlocks(translatedMarkdown, blocks)

    // Render the fully-restored markdown+HTML to display HTML
    const html = renderMarkdown(restored)
    hinglishHtml.value = html

    // Cache result to avoid re-translating on switching tabs
    setCachedHinglish(props.content, props.topicTitle, html)
  } catch (err: any) {
    hinglishError.value = err.data?.message || err.message || 'Failed to convert content to Hinglish. Please try again.'
    console.error('Hinglish conversion failed:', err)
  } finally {
    hinglishLoading.value = false
  }
}

async function downloadSummary() {
  if (!summaryData.value) return
  downloadingPdf.value = true
  try {
    await downloadSummaryPDF(props.topicTitle, summaryData.value)
    // Show success feedback on mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator?.userAgent || '')) {
      // For mobile, show a brief success message
      setTimeout(() => {
        // You could implement a toast notification here
        // console.log('PDF download initiated for mobile device')
      }, 500)
    }
  } catch (error) {
    console.error('Error downloading PDF:', error)
    summaryError.value = 'Failed to download PDF. Please try again.'
    setTimeout(() => {
      summaryError.value = ''
    }, 3000)
  } finally {
    downloadingPdf.value = false
  }
}

async function generateQuiz() {
  // Check for any existing quiz first (ignore difficulty/questionCount parameters)
  const cached = getCachedQuiz(props.content, props.topicTitle)
  if (cached) {
    quizData.value = cached.questions
    cachedQuiz.value = cached
    isQuizFromCache.value = true
    // Update UI to show actual quiz settings from cache
    quizDifficulty.value = cached.metadata.difficulty as 'easy' | 'medium' | 'hard'
    quizQuestionCount.value = cached.metadata.questionCount
    // console.log('🎯 Using cached quiz from:', cached.metadata.createdAt)
    return
  }

  // If no quiz exists, generate new one
  quizLoading.value = true
  quizError.value = ''
  isQuizFromCache.value = false
  
  const { makeApiCall } = useApiEndpoints()
  
  try {
    const response = await makeApiCall('/api/quiz/generate', {
      method: 'POST',
      body: {
        content: props.content,
        topicTitle: props.topicTitle,
        difficulty: quizDifficulty.value,
        questionCount: quizQuestionCount.value
      }
    })
    
    const responseData = response as any
    quizData.value = responseData.questions
    
    // Cache the new quiz
    setCachedQuiz(
      props.content, 
      props.topicTitle, 
      responseData.questions, 
      quizDifficulty.value, 
      quizQuestionCount.value,
      responseData.metadata?.requestedQuestions || quizQuestionCount.value
    )
    // console.log('💾 Generated and cached new quiz')
    
    // Show notification if question count was adjusted
    if (responseData.metadata?.questionCountAdjusted) {
      // console.log(`Quiz generated with ${responseData.metadata.actualQuestions} questions (requested ${responseData.metadata.requestedQuestions})`)
      
      // Store the adjustment info for user notification
      if (responseData.metadata.actualQuestions < responseData.metadata.requestedQuestions) {
        const reduction = responseData.metadata.requestedQuestions - responseData.metadata.actualQuestions
        console.warn(`Note: Question count reduced by ${reduction} due to AI model constraints or content complexity`)
      }
    }
  } catch (err: any) {
    quizError.value = err.data?.message || 'Failed to generate quiz. Please try again.'
    console.error('Quiz generation failed:', err)
  } finally {
    quizLoading.value = false
  }
}

function resetQuiz() {
  quizData.value = []
  quizError.value = ''
  cachedQuiz.value = null
  isQuizFromCache.value = false
}

// Helper functions for quiz results
function getQuestionById(questionId: string): QuizQuestion | undefined {
  return quizData.value.find(q => q.id === questionId)
}

function formatAnswers(answers: string[]): string {
  if (!answers || answers.length === 0) return 'No answer provided'
  if (answers.length === 1) return answers[0]
  return answers.join(', ')
}

async function downloadQuizResults() {
  if (!quizCompletionData.value || !quizData.value.length) return
  
  downloadingResults.value = true
  
  try {
    const { downloadQuizAnalysisPDF } = await import('~/utils/pdfGenerator')
    await downloadQuizAnalysisPDF(
      props.topicTitle,
      quizData.value as any,
      (quizCompletionData.value.userAnswers || []) as any,
      quizCompletionData.value.score || 0
    )
    // console.log('📄 Quiz results PDF downloaded')
  } catch (error) {
    console.error('Error downloading quiz results PDF:', error)
  } finally {
    downloadingResults.value = false
  }
}

function handleQuizCompletion(completionData: { score: number, userAnswers: any[], totalQuestions: number }) {
  if (cachedQuiz.value) {
    // Update completion status in cache
    updateQuizCompletion(
      props.content,
      props.topicTitle,
      quizDifficulty.value,
      quizQuestionCount.value,
      completionData
    )
    
    // Update local state
    cachedQuiz.value.completion = {
      completed: true,
      completedAt: new Date().toISOString(),
      ...completionData
    }
    
    // console.log('✅ Quiz completion recorded:', `${completionData.score}%`)
  }
}

function resetQuizForRetake() {
  if (cachedQuiz.value && cachedQuiz.value.completion) {
    // Remove completion status to allow retaking
    delete cachedQuiz.value.completion
    
    // Update cache
    updateQuizCompletion(
      props.content,
      props.topicTitle, 
      quizDifficulty.value,
      quizQuestionCount.value,
      { score: 0, userAnswers: [], totalQuestions: 0 } // Reset completion
    )
    
    // console.log('🔄 Quiz reset for retaking')
  }
}

// Computed properties
const isQuizCompleted = computed(() => {
  return cachedQuiz.value?.completion?.completed || false
})

const quizCompletionData = computed(() => {
  return cachedQuiz.value?.completion || null
})

const canGenerateQuiz = computed(() => {
  return !hasExistingQuiz(props.content, props.topicTitle)
})

const canGenerateSummary = computed(() => {
  return !hasExistingSummary(props.content, props.topicTitle)
})

function onKeydownTabs(e: KeyboardEvent) {
  const currentIndex = tabs.value.findIndex((t: { id: string }) => t.id === activeTab.value)
  if (currentIndex === -1) return
  
  if (e.key === 'ArrowRight') {
    const next = (currentIndex + 1) % tabs.value.length
    setActiveTab(tabs.value[next].id)
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') {
    const prev = (currentIndex - 1 + tabs.value.length) % tabs.value.length
    setActiveTab(tabs.value[prev].id)
    e.preventDefault()
  } else if (e.key === 'Home') {
    setActiveTab(tabs.value[0].id)
    e.preventDefault()
  } else if (e.key === 'End') {
    setActiveTab(tabs.value[tabs.value.length - 1].id)
    e.preventDefault()
  }
}

function getResourceIcon(type: string): string {
  const icons = {
    video: 'heroicons:play',
    article: 'heroicons:document-text',
    documentation: 'heroicons:book-open',
    tool: 'heroicons:wrench-screwdriver',
    book: 'heroicons:academic-cap',
    course: 'heroicons:presentation-chart-line'
  }
  return icons[type as keyof typeof icons] || 'heroicons:link'
}

function getResourceColor(type: string): string {
  const colors = {
    video: 'text-red-400',
    article: 'text-blue-400',
    documentation: 'text-green-400',
    tool: 'text-purple-400',
    book: 'text-yellow-400',
    course: 'text-pink-400'
  }
  return colors[type as keyof typeof colors] || 'text-zinc-400'
}

// Load summary by default if content tab is not active initially
onMounted(() => {
  if (activeTab.value === 'notes') {
    generateSummary()
  }
  
  // Setup image modal for course topic content - with retry for lazy-loaded content
  const cleanup = setupContentImages('.prose', true)
  
  // Retry setup after a delay to catch lazy-loaded content
  setTimeout(() => {
    setupContentImages('.prose', true)
  }, 1000)
  
  setTimeout(() => {
    setupContentImages('.prose', true)
  }, 3000)

  // Register hidden Ctrl+H shortcut for Hinglish translation
  window.addEventListener('keydown', handleCtrlH)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleCtrlH)
})
</script>

<template>
  <div class="w-full">
    <!-- Outer card background -->
    <div
      class="border transition-colors duration-500"
      :class="isLight ? 'border-stone-300 bg-stone-50' : 'border-zinc-800 bg-zinc-900'"
    >
      <!-- Tab Navigation -->
      <div
        v-if="!(hideTabHeaders && tabs.length === 1)"
        class="relative transition-colors duration-500"
        :class="isLight ? 'bg-stone-300' : 'bg-zinc-700'"
        role="tablist"
        aria-orientation="horizontal"
      >
        <!-- Mobile/Tablet: Scrollable tabs -->
        <div class="block md:hidden">
          <div
            class="flex gap-1 p-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            @keydown="onKeydownTabs"
            style="scrollbar-width: none; -ms-overflow-style: none;"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="setActiveTab(tab.id)"
              @touchstart="tab.id === 'content' ? onContentTabTouchStart($event) : undefined"
              @touchend="tab.id === 'content' ? onContentTabTouchEnd() : undefined"
              @touchmove="tab.id === 'content' ? onContentTabTouchMove() : undefined"
              @touchcancel="tab.id === 'content' ? onContentTabTouchEnd() : undefined"
              :class="[
                'snap-start rounded-none px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 flex-shrink-0 min-w-max',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                  : isLight
                    ? 'bg-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100 border-b-2 border-transparent'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
              ]"
              role="tab"
              :aria-selected="activeTab === tab.id"
              :aria-controls="`panel-${tab.id}`"
              :id="`tab-${tab.id}`"
            >
              <Icon :name="tab.icon" class="text-base flex-shrink-0" />
              <span class="whitespace-nowrap">{{ tab.title }}</span>
            </button>
          </div>
        </div>

        <!-- Desktop: Full width tabs -->
        <div class="hidden md:block px-2">
          <div
            class="flex gap-2 p-2"
            @keydown="onKeydownTabs"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="setActiveTab(tab.id)"
              @touchstart="tab.id === 'content' ? onContentTabTouchStart($event) : undefined"
              @touchend="tab.id === 'content' ? onContentTabTouchEnd() : undefined"
              @touchmove="tab.id === 'content' ? onContentTabTouchMove() : undefined"
              @touchcancel="tab.id === 'content' ? onContentTabTouchEnd() : undefined"
              :class="[
                'rounded-none px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 flex-1 justify-center',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md'
                  : isLight
                    ? 'bg-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
              ]"
              role="tab"
              :aria-selected="activeTab === tab.id"
              :aria-controls="`panel-${tab.id}`"
              :id="`tab-${tab.id}`"
            >
              <Icon :name="tab.icon" class="text-base" />
              {{ tab.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div
        class="border-t transition-colors duration-500 p-3 sm:p-4 md:p-6 min-h-[350px] sm:min-h-[400px]"
        :class="isLight ? 'bg-stone-100 border-stone-300 theme-light' : 'bg-zinc-800 border-zinc-800'"
      >
        
        <!-- Content Tab -->
        <div v-if="activeTab === 'content'" :id="'panel-content'" role="tabpanel" aria-labelledby="tab-content">
          <div>
            <ArticleAgeWarning v-if="isOlderThanOneYear" />
            <ClientOnly>
              <LazyContentReader
                :prepend="topicTitle"
                :doc-class="[
                  'prose md:prose-lg lg:prose-xl',
                  isOlderThanOneYear ? 'pt-8' : 'pt-4',
                  isLight ? 'prose-stone' : 'prose-invert'
                ].filter(Boolean).join(' ')"
              />
            </ClientOnly>
          </div>
        </div>

        <!-- Hinglish content is now shown via the hidden Ctrl+H overlay only -->

        <!-- AI Notes Tab -->
        <div v-else-if="activeTab === 'notes'" :id="'panel-notes'" role="tabpanel" aria-labelledby="tab-notes">
          <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
              <Icon name="heroicons:light-bulb" class="text-lg sm:text-xl" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 mt-0 flex items-center gap-2">
                AI Generated Notes
                <span v-if="summaryData" class="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded">
                  <Icon name="heroicons:cloud-arrow-down" class="inline mr-1 text-xs" />
                  Cached
                </span>
              </h3>
              <p class="text-zinc-300 mb-3 sm:mb-4">
                Smart summary and key insights powered by AI
              </p>
              <p v-if="summaryData" class="text-xs text-zinc-500 sm:hidden">
                Tap PDF to download or view in browser
              </p>
            </div>
            <!-- Download button for mobile/desktop -->
            <div v-if="summaryData" class="flex-shrink-0">
              <AppButton 
                @click="downloadSummary" 
                :disabled="downloadingPdf"
                look="secondary" 
                class="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 min-w-[80px] sm:min-w-[120px]"
              >
                <Icon 
                  :name="downloadingPdf ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" 
                  :class="[
                    'text-sm mr-1 sm:mr-2',
                    downloadingPdf ? 'animate-spin' : ''
                  ]" 
                />
                <span class="hidden sm:inline">{{ downloadingPdf ? 'Downloading...' : 'Download PDF' }}</span>
                <span class="sm:hidden">{{ downloadingPdf ? '...' : 'PDF' }}</span>
              </AppButton>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="summaryLoading" class="text-center py-8">
            <Icon name="heroicons:arrow-path" class="animate-spin text-4xl text-red-400 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-white mb-2">Generating Smart Notes...</h4>
            <p class="text-zinc-400">AI is analyzing the content to create comprehensive notes for you.</p>
          </div>

          <!-- Error State -->
          <div v-else-if="summaryError && canGenerateSummary" class="bg-red-900/20 border border-red-500/50 p-6">
            <div class="flex items-center gap-3 mb-3">
              <Icon name="heroicons:exclamation-triangle" class="text-red-400 text-2xl" />
              <h4 class="text-xl font-semibold text-red-400">Error</h4>
            </div>
            <p class="text-red-300 mb-4">{{ summaryError }}</p>
            <AppButton @click="generateSummary" :disabled="summaryLoading">
              <Icon name="heroicons:arrow-path" class="mr-2" />
              Try Again
            </AppButton>
          </div>

          <!-- Summary Content -->
          <div v-else-if="summaryData" class="space-y-6">
            <!-- Main Summary -->
            <div class="bg-zinc-700/50 p-4 sm:p-6">
              <h4 class="text-base sm:text-lg font-semibold text-white mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <div class="flex items-center gap-2">
                  <Icon name="heroicons:document-text" class="text-red-400" />
                  Summary
                </div>
                <span class="text-xs sm:text-sm text-zinc-400 sm:ml-auto">{{ summaryData.estimatedReadTime }} min read</span>
              </h4>
              <p class="text-sm sm:text-base text-zinc-300 leading-relaxed">{{ summaryData.summary }}</p>
            </div>

            <!-- Key Points -->
            <div class="bg-zinc-700/50 p-4 sm:p-6">
              <h4 class="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="heroicons:key" class="text-red-400" />
                Key Points
              </h4>
              <ul class="space-y-3">
                <li v-for="(point, index) in summaryData.keyPoints" :key="index" class="flex items-start gap-3">
                  <span class="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {{ index + 1 }}
                  </span>
                  <span class="text-sm sm:text-base text-zinc-300">{{ point }}</span>
                </li>
              </ul>
            </div>

            <!-- Core Concepts -->
            <div class="bg-zinc-700/50 p-4 sm:p-6">
              <h4 class="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="heroicons:puzzle-piece" class="text-red-400" />
                Core Concepts
              </h4>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div v-for="(concept, index) in summaryData.concepts" :key="index" 
                  class="bg-zinc-600/50 p-3 border-l-4 border-red-500">
                  <span class="text-sm sm:text-base text-zinc-300">{{ concept }}</span>
                </div>
              </div>
            </div>

            <!-- Key Takeaways -->
            <div class="bg-zinc-700/50 p-4 sm:p-6">
              <h4 class="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon name="heroicons:check-badge" class="text-red-400" />
                Key Takeaways
              </h4>
              <ul class="space-y-2">
                <li v-for="(takeaway, index) in summaryData.takeaways" :key="index" 
                  class="flex items-start gap-3 text-sm sm:text-base text-zinc-300">
                  <Icon name="heroicons:arrow-right" class="text-red-400 mt-1 flex-shrink-0" />
                  {{ takeaway }}
                </li>
              </ul>
            </div>
            
          </div>

          <!-- Empty State -->
          <div v-else-if="canGenerateSummary" class="text-center py-8">
            <Icon name="heroicons:light-bulb" class="text-6xl text-zinc-600 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-white mb-2">Generate AI Notes</h4>
            <p class="text-zinc-400 mb-4">Get smart summary and insights for this topic</p>
            <AppButton @click="generateSummary" :disabled="summaryLoading">
              <Icon name="heroicons:sparkles" class="mr-2" />
              Generate Notes
            </AppButton>
          </div>
          
          <!-- Already Generated State -->
          <div v-else class="text-center py-8">
            <Icon name="heroicons:check-circle" class="text-6xl text-green-400 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-white mb-2">AI Notes Already Generated</h4>
            <p class="text-zinc-400 mb-4">Your AI-generated notes are already available. One-time generation policy.</p>
          </div>
        </div>

        <!-- Quiz Tab -->
        <div v-else-if="activeTab === 'quiz'" :id="'panel-quiz'" role="tabpanel" aria-labelledby="tab-quiz">
          <div class="flex items-start gap-3 sm:gap-4 mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white">
              <Icon name="heroicons:academic-cap" class="text-lg sm:text-xl" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 mt-0">
                Interactive Quiz
              </h3>
              <p class="text-zinc-300 mb-3 sm:mb-4">
                Test your knowledge with AI-generated questions
              </p>
            </div>
          </div>

          <!-- Quiz Component Integration -->
          <div v-if="quizData.length > 0">
            <!-- Quiz Results Summary (if completed) -->
            <div v-if="isQuizCompleted && quizCompletionData" class="space-y-6">
              <!-- Score Header -->
              <div class="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/30 p-6 text-center">
                <div class="flex items-center justify-center gap-3 mb-4">
                  <Icon name="heroicons:check-circle" class="text-green-400 text-3xl" />
                  <div>
                    <h4 class="text-2xl font-bold text-white">Quiz Completed!</h4>
                    <p class="text-zinc-300">{{ new Date(quizCompletionData.completedAt!).toLocaleDateString() }} at {{ new Date(quizCompletionData.completedAt!).toLocaleTimeString() }}</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div class="bg-zinc-800/50 p-4 rounded-lg">
                    <div class="text-3xl font-bold mb-1" :class="[
                      (quizCompletionData?.score ?? 0) >= 80 ? 'text-green-400' :
                      (quizCompletionData?.score ?? 0) >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    ]">{{ quizCompletionData?.score ?? 0 }}%</div>
                    <div class="text-sm text-zinc-400">Final Score</div>
                  </div>
                  <div class="bg-zinc-800/50 p-4 rounded-lg">
                    <div class="text-3xl font-bold text-blue-400 mb-1">{{ quizCompletionData.userAnswers?.filter(a => a.isCorrect).length || 0 }}/{{ quizCompletionData.userAnswers?.length || 0 }}</div>
                    <div class="text-sm text-zinc-400">Correct Answers</div>
                  </div>
                  <div class="bg-zinc-800/50 p-4 rounded-lg">
                    <div class="text-3xl font-bold text-purple-400 mb-1 capitalize">{{ quizDifficulty }}</div>
                    <div class="text-sm text-zinc-400">Difficulty Level</div>
                  </div>
                </div>
                
                <div class="flex items-center justify-center gap-4">
                  <AppButton @click="downloadQuizResults" :disabled="downloadingResults">
                    <Icon :name="downloadingResults ? 'heroicons:arrow-path' : 'heroicons:arrow-down-tray'" :class="downloadingResults ? 'animate-spin mr-2' : 'mr-2'" />
                    {{ downloadingResults ? 'Generating...' : 'Download Results PDF' }}
                  </AppButton>
                  <AppButton look="secondary" @click="resetQuizForRetake">
                    <Icon name="heroicons:arrow-path" class="mr-2" />
                    Retake Quiz
                  </AppButton>
                </div>
              </div>
              
              <!-- Detailed Question Results -->
              <div class="space-y-4">
                <h5 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Icon name="heroicons:document-text" class="text-red-400" />
                  Detailed Results
                </h5>
                
                <div 
                  v-for="(userAnswer, index) in quizCompletionData.userAnswers" 
                  :key="userAnswer.questionId"
                  class="bg-zinc-800/50 border-l-4 p-4 rounded-r-lg"
                  :class="userAnswer.isCorrect ? 'border-green-500' : 'border-red-500'"
                >
                  <div class="flex items-start gap-3 mb-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                         :class="userAnswer.isCorrect ? 'bg-green-500' : 'bg-red-500'">
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1">
                      <h6 class="text-white font-medium mb-2">{{ getQuestionById(userAnswer.questionId)?.question }}</h6>
                      
                      <!-- Question Type Badge -->
                      <span class="inline-block px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded mb-3 capitalize">
                        {{ getQuestionById(userAnswer.questionId)?.type?.replace('-', ' ') }}
                      </span>
                      
                      <!-- User's Answer -->
                      <div class="mb-3">
                        <p class="text-sm font-medium text-zinc-300 mb-1">Your Answer:</p>
                        <div class="bg-zinc-700/50 p-3 rounded">
                          <span class="text-zinc-200">{{ formatAnswers(userAnswer.answers) }}</span>
                          <Icon :name="userAnswer.isCorrect ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                                :class="userAnswer.isCorrect ? 'text-green-400 ml-2' : 'text-red-400 ml-2'" />
                        </div>
                      </div>
                      
                      <!-- Correct Answer (if user was wrong) -->
                      <div v-if="!userAnswer.isCorrect" class="mb-3">
                        <p class="text-sm font-medium text-green-300 mb-1">Correct Answer:</p>
                        <div class="bg-green-900/20 border border-green-500/30 p-3 rounded">
                          <span class="text-green-200">{{ formatAnswers(getQuestionById(userAnswer.questionId)?.correctAnswers || []) }}</span>
                          <Icon name="heroicons:check-circle" class="text-green-400 ml-2" />
                        </div>
                      </div>
                      
                      <!-- Explanation -->
                      <div>
                        <p class="text-sm font-medium text-blue-300 mb-1">Explanation:</p>
                        <div class="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
                          <p class="text-blue-200 text-sm">{{ getQuestionById(userAnswer.questionId)?.explanation }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quiz Info -->
            <div class="flex items-center justify-center mb-4 p-4 bg-zinc-800 border border-zinc-700">
              <div class="flex items-center gap-4 text-sm">
                <span class="text-zinc-400">Quiz:</span>
                <span class="text-zinc-300 font-semibold">{{ quizData.length }} Questions</span>
                <span class="capitalize font-semibold" :class="[
                  quizDifficulty === 'easy' ? 'text-green-400' :
                  quizDifficulty === 'medium' ? 'text-yellow-400' :
                  'text-red-400'
                ]">{{ quizDifficulty }} Level</span>
                <span class="text-blue-400 text-xs bg-blue-500/20 px-2 py-1 rounded">
                  <Icon name="heroicons:lock-closed" class="inline mr-1 text-xs" />
                  One-Time Generation
                </span>
              </div>
            </div>
            
            <!-- Quiz Component (hidden if completed to prevent re-taking) -->
            <div v-if="!isQuizCompleted">
              <LazyQuizContainer 
                :topic-title="topicTitle"
                :content="content"
                :difficulty="quizDifficulty"
                :pre-generated-questions="quizData"
                @quiz-completed="handleQuizCompletion"
              />
            </div>
          </div>

          <!-- Loading State -->
          <div v-else-if="quizLoading" class="text-center py-8">
            <Icon name="heroicons:arrow-path" class="animate-spin text-4xl text-red-400 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-white mb-2">Generating Quiz...</h4>
            <p class="text-zinc-400">AI is creating personalized questions for you.</p>
          </div>

          <!-- Error State -->
          <div v-else-if="quizError" class="bg-red-900/20 border border-red-500/50 p-6">
            <div class="flex items-center gap-3 mb-3">
              <Icon name="heroicons:exclamation-triangle" class="text-red-400 text-2xl" />
              <h4 class="text-xl font-semibold text-red-400">Quiz Generation Failed</h4>
            </div>
            <p class="text-red-300 mb-4">{{ quizError }}</p>
            <div class="flex flex-col sm:flex-row gap-3">
              <AppButton @click="generateQuiz" :disabled="quizLoading">
                <Icon name="heroicons:arrow-path" class="mr-2" />
                Try Again
              </AppButton>
              <AppButton 
                look="secondary" 
                @click="() => { quizQuestionCount = Math.max(5, quizQuestionCount - 5); generateQuiz() }" 
                :disabled="quizLoading || quizQuestionCount <= 5"
              >
                <Icon name="heroicons:minus" class="mr-2" />
                Try with {{ Math.max(5, quizQuestionCount - 5) }} Questions
              </AppButton>
            </div>
            <p class="text-xs text-zinc-400 mt-3">
              <Icon name="heroicons:light-bulb" class="inline mr-1" />
              Tip: Try reducing the number of questions or difficulty level if generation fails.
            </p>
          </div>

          <!-- Quiz Configuration (Only if quiz can be generated) -->
          <div v-else-if="canGenerateQuiz" class="max-w-2xl mx-auto">
            <div class="text-center mb-8">
              <Icon name="heroicons:academic-cap" class="text-6xl text-red-400 mx-auto mb-4" />
              <h4 class="text-2xl font-bold text-white mb-2">Ready to Test Your Knowledge?</h4>
              <p class="text-zinc-300 mb-6">
                Configure your personalized AI-generated quiz based on the content you just read
              </p>
            </div>

            <!-- Quiz Configuration Options -->
            <div class="bg-zinc-800 p-6 border border-zinc-700 mb-6 space-y-6">
              <!-- Difficulty Selection -->
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-3">Difficulty Level</label>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="diff in (['easy', 'medium', 'hard'] as const)"
                    :key="diff"
                    @click="quizDifficulty = diff"
                    :class="[
                      'px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 capitalize',
                      quizDifficulty === diff
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-zinc-600 bg-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-600'
                    ]"
                  >
                    <Icon 
                      :name="diff === 'easy' ? 'heroicons:face-smile' : diff === 'medium' ? 'heroicons:face-frown' : 'heroicons:fire'"
                      class="text-lg mb-1"
                    />
                    <div>{{ diff }}</div>
                  </button>
                </div>
              </div>

              <!-- Question Count Selection -->
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-3">Number of Questions</label>
                <div class="grid grid-cols-4 gap-3">
                  <button
                    v-for="count in [5, 10, 15, 17]"
                    :key="count"
                    @click="quizQuestionCount = count"
                    :class="[
                      'px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200',
                      quizQuestionCount === count
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-zinc-600 bg-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-600'
                    ]"
                  >
                    <Icon name="heroicons:question-mark-circle" class="text-lg mb-1" />
                    <div>{{ count }}</div>
                  </button>
                </div>
                <p class="text-xs text-zinc-400 mt-2">
                  <Icon name="heroicons:information-circle" class="inline mr-1" />
                  Maximum 17 questions due to AI model limits. Count may be reduced for very large content.
                </p>
              </div>
            </div>

            <!-- Quiz Summary -->
            <div class="flex flex-wrap gap-4 justify-center mb-6 text-sm">
              <div class="flex items-center gap-2 text-zinc-400">
                <Icon name="heroicons:clock" />
                <span>~{{ Math.ceil(quizQuestionCount * 1.5) }} minutes</span>
              </div>
              <div class="flex items-center gap-2 text-zinc-400">
                <Icon name="heroicons:chart-bar" />
                <span class="capitalize" :class="[
                  quizDifficulty === 'easy' ? 'text-green-400' :
                  quizDifficulty === 'medium' ? 'text-yellow-400' :
                  'text-red-400'
                ]">{{ quizDifficulty }} Level</span>
              </div>
              <div class="flex items-center gap-2 text-zinc-400">
                <Icon name="heroicons:light-bulb" />
                <span>AI Generated</span>
              </div>
            </div>

            <!-- Generate Quiz Button -->
            <div class="text-center">
              <AppButton @click="generateQuiz" :disabled="quizLoading" class="px-8 py-3 text-lg">
                <Icon name="heroicons:sparkles" class="mr-2" />
                Generate Quiz
              </AppButton>
            </div>
          </div>
          
          <!-- Load Existing Quiz State -->
          <div v-else class="max-w-2xl mx-auto">
            <!-- Load existing quiz and show it -->
            <div class="text-center py-4">
              <h4 class="text-xl font-bold text-white mb-2">Loading Your Quiz...</h4>
              <p class="text-zinc-400">Loading your previously generated quiz</p>
            </div>
          </div>
        </div>

        <!-- Resources Tab -->
        <div v-else-if="activeTab === 'resources'" :id="'panel-resources'" role="tabpanel" aria-labelledby="tab-resources">
          <div class="flex items-start gap-3 sm:gap-4 mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white">
              <Icon name="heroicons:link" class="text-lg sm:text-xl" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 mt-0">
                Learning Resources
              </h3>
              <p class="text-zinc-300 mb-3 sm:mb-4">
                Additional materials to deepen your understanding
              </p>
            </div>
          </div>

          <!-- Resources Content -->
          <div v-if="resources && resources.length > 0" class="space-y-4">
            <div
              v-for="(resource, index) in resources"
              :key="index"
              class="bg-zinc-700/50 p-4 border-l-4 border-red-500 hover:bg-zinc-700/70 transition-colors"
            >
              <div class="flex items-start gap-4">
                <div class="flex items-center justify-center w-10 h-10 bg-zinc-600 text-white">
                  <Icon :name="getResourceIcon(resource.type)" :class="getResourceColor(resource.type)" class="text-lg" />
                </div>
                <div class="flex-1">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-white mb-1">
                        <AppLink :to="resource.url" target="_blank" class="hover:text-red-400 transition-colors">
                          {{ resource.title }}
                        </AppLink>
                      </h4>
                      <div class="flex items-center gap-3 text-sm text-zinc-400 mb-2">
                        <span class="uppercase font-medium" :class="getResourceColor(resource.type)">{{ resource.type }}</span>
                        <span v-if="resource.duration">{{ resource.duration }}</span>
                        <span v-if="resource.author">by {{ resource.author }}</span>
                      </div>
                      <p v-if="resource.description" class="text-zinc-300 text-sm">{{ resource.description }}</p>
                    </div>
                    <Icon name="heroicons:arrow-top-right-on-square" class="text-zinc-500 ml-4 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <Icon name="heroicons:link" class="text-6xl text-zinc-600 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-white mb-2">No Resources Available</h4>
            <p class="text-zinc-400">Additional learning resources will be added here</p>
          </div>
        </div>

      </div>
      
    </div>
  </div>
    <!-- ── Hidden Hinglish Overlay (Ctrl+H) — not visible to regular users ── -->
    <Teleport to="body">
      <Transition name="hinglish-overlay">
        <div
          v-if="isHinglishOverlayOpen"
          class="fixed inset-0 z-[9999] flex flex-col"
          style="background: rgba(9,9,11,0.97); backdrop-filter: blur(2px);"
          @keydown.esc="closeHinglishOverlay"
          tabindex="-1"
        >
          <!-- Header bar -->
          <div class="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-zinc-800 flex-shrink-0">
            <div class="flex items-center gap-3">
              <span class="text-xl">&#127470;&#127475;</span>
              <span class="text-base font-semibold text-zinc-100 tracking-wide">Hinglish</span>
              <span v-if="hinglishFromCache" class="text-[10px] text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded">
                cached
              </span>
            </div>
            <button
              @click="closeHinglishOverlay"
              class="text-zinc-500 hover:text-white transition-colors p-1 focus:outline-none"
              aria-label="Close (Escape)"
              title="Close (Esc)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>
          </div>

          <!-- Scrollable content area -->
          <div class="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8">

            <!-- Loading -->
            <div v-if="hinglishLoading" class="text-center py-20">
              <div class="relative inline-flex mb-6">
                <svg class="animate-spin w-12 h-12 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <span class="absolute inset-0 flex items-center justify-center text-lg">&#127470;&#127475;</span>
              </div>
              <h4 class="text-lg font-semibold text-white mb-2">Converting...</h4>
              <p class="text-zinc-400 text-sm">AI text translate kar raha hai — images aur code safe hain.</p>
            </div>

            <!-- Error -->
            <div v-else-if="hinglishError" class="max-w-xl mx-auto bg-red-900/20 border border-red-500/40 p-6 rounded-lg">
              <p class="text-red-300 mb-4 text-sm">{{ hinglishError }}</p>
              <button
                @click="convertToHinglish"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
              >
                Try Again
              </button>
            </div>

            <!-- Translated content -->
            <div
              v-else-if="hinglishHtml"
              class="prose md:prose-lg lg:prose-xl prose-invert hinglish-content max-w-none"
              v-html="hinglishHtml"
            />

          </div>
        </div>
      </Transition>
    </Teleport>

</template>

<style>
/* ── Hidden Hinglish overlay transition ─────────────────────────────────── */
.hinglish-overlay-enter-active,
.hinglish-overlay-leave-active {
  transition: opacity 0.2s ease;
}
.hinglish-overlay-enter-from,
.hinglish-overlay-leave-to {
  opacity: 0;
}

/* ── Light mode prose overrides ─────────────────────────────────────────────
   Applied globally to all tabs when the user toggles to light mode.
   Uses warm stone/paper tones instead of pure white for less eye strain.
   Overrides the dark‐mode CSS custom properties defined in typography.ts.
──────────────────────────────────────────────────────────────────────────── */
.prose-light-theme {
  --tw-prose-body:            #1c1917;  /* stone-900  — warm near-black */
  --tw-prose-headings:        #0c0a09;  /* stone-950  */
  --tw-prose-links:           #dc2626;  /* red-600    — keep brand accent */
  --tw-prose-links-hover:     #b91c1c;  /* red-700    */
  --tw-prose-underline:       #fca5a5;  /* red-300    */
  --tw-prose-underline-hover: #dc2626;
  --tw-prose-bold:            #171717;  /* neutral-900 */
  --tw-prose-counters:        #44403c;  /* stone-700  */
  --tw-prose-bullets:         #44403c;
  --tw-prose-hr:              #d6d3d1;  /* stone-300  */
  --tw-prose-quote-borders:   #a8a29e;  /* stone-400  */
  --tw-prose-captions:        #78716c;  /* stone-500  */
  --tw-prose-code:            #0f172a;  /* slate-900  */
  --tw-prose-code-bg:         rgba(0,0,0,0.06);
  --tw-prose-pre-code:        #f1f5f9;  /* slate-100  */
  --tw-prose-pre-bg:          #1e293b;  /* slate-800  — keep code blocks dark */
  --tw-prose-pre-border:      rgba(0,0,0,0.10);
  --tw-prose-th-borders:      #d6d3d1;  /* stone-300  */
  --tw-prose-td-borders:      #e7e5e4;  /* stone-200  */

  color: var(--tw-prose-body);
}

/* h1 border accent keeps brand red on light bg */
.prose-light-theme h1 {
  border-left-color: #dc2626;
}

/* image wrapper — warm stone shadow on paper bg */
.prose-light-theme .content-img-wrapper {
  border-color: rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.10) !important;
  background: #e7e5e4 !important;  /* stone-200 — slightly darker than bg for contrast */
}

/* ══════════════════════════════════════════════════════════════════════════
   LIGHT THEME — ALL-TAB CASCADE
   .theme-light is applied to the tab content wrapper when isLight is true.
   Rules cascade to every sub-element across Content, AI Notes, Quiz,
   and Resources panels without touching each element individually.

   Colour palette used:
     stone-950 #0c0a09   headings
     stone-900 #1c1917   primary text
     stone-800 #292524   slightly lighter text
     stone-700 #44403c   secondary text
     stone-600 #57534e   muted text
     stone-500 #78716c   placeholder / captions
     stone-400 #a8a29e   icons, dividers
     stone-300 #d6d3d1   card borders
     stone-200 #e7e5e4   card backgrounds
     stone-100 #f5f5f4   section backgrounds (matches outer bg-stone-100)
══════════════════════════════════════════════════════════════════════════ */

/* ── Generic text overrides ── */
/* NOTE: exclude elements that carry a red gradient bg so button text stays white */
.theme-light .text-white:not([class*="from-red-"]):not([class*="from-pink-"]) {
  color: #1c1917 !important;   /* stone-900 */
}
.theme-light .text-zinc-200 { color: #292524 !important; }   /* stone-800 */
.theme-light .text-zinc-300 { color: #57534e !important; }   /* stone-600 */
.theme-light .text-zinc-400 { color: #78716c !important; }   /* stone-500 */
.theme-light .text-zinc-500 { color: #a8a29e !important; }   /* stone-400 */
.theme-light .text-zinc-600 { color: #d6d3d1 !important; }   /* stone-300 — empty-state icons */

/* ── AppButton PRIMARY: keep gradient vivid, always white text ── */
/* The gradient lives on the button element itself; force text-white even
   though .text-white above would otherwise darken it. */
.theme-light [class*="from-red-5"],
.theme-light [class*="from-red-6"],
.theme-light [class*="from-pink-"] {
  color: #ffffff !important;
}
/* Also ensure children (icon text etc.) inside gradient elements stay white */
.theme-light [class*="from-red-5"] *,
.theme-light [class*="from-red-6"] *,
.theme-light [class*="from-pink-"] * {
  color: #ffffff !important;
}

/* ── Card / panel backgrounds ── */
/* bg-zinc-700/50 — main content cards (Summary, Key Points, etc.) */
.theme-light [class*="bg-zinc-700"][class*="50"],
.theme-light [class*="bg-zinc-700"][class*="70"] {
  background-color: rgba(231, 229, 228, 0.7) !important;   /* stone-200/70 */
}
/* bg-zinc-600/50 — inner concept chips */
.theme-light [class*="bg-zinc-600"][class*="50"] {
  background-color: rgba(214, 211, 209, 0.65) !important;  /* stone-300/65 */
}
/* bg-zinc-800, bg-zinc-800/50 — quiz config box, score cards, answer blocks */
.theme-light [class*="bg-zinc-800"]:not([class*="rounded-full"]) {
  background-color: rgba(231, 229, 228, 0.8) !important;   /* stone-200/80 */
}
/* Solid bg-zinc-700 — resource icon box */
.theme-light .bg-zinc-700:not([class*="/"]) {
  background-color: #e7e5e4 !important;   /* stone-200 */
}
/* Solid bg-zinc-600 — resource icon bg */
.theme-light .bg-zinc-600:not([class*="/"]) {
  background-color: #d6d3d1 !important;   /* stone-300 */
}

/* ── Borders ── */
.theme-light .border-zinc-700 { border-color: #d6d3d1 !important; }  /* stone-300 */
.theme-light .border-zinc-600 { border-color: #a8a29e !important; }  /* stone-400 */

/* ── Quiz config: inactive difficulty / question-count buttons ── */
.theme-light .border-zinc-600.bg-zinc-700 {
  background-color: #ede8e4 !important;   /* warm cream */
  border-color: #a8a29e !important;
  color: #44403c !important;
}
.theme-light .border-zinc-600.bg-zinc-700:hover {
  background-color: #d6d3d1 !important;
  border-color: #78716c !important;
}

/* ── Question-type badge (bg-zinc-700 text-zinc-300 in dark) ── */
.theme-light .bg-zinc-700.text-zinc-300 {
  background-color: #d6d3d1 !important;
  color: #44403c !important;
}


/* ── Quiz explanation boxes override — keep tinted but lighter ── */
.theme-light .bg-green-900\/20  { background-color: rgba(187, 247, 208, 0.3)  !important; }
.theme-light .bg-blue-900\/20   { background-color: rgba(191, 219, 254, 0.3)  !important; }
.theme-light .bg-red-900\/20    { background-color: rgba(254, 202, 202, 0.35) !important; }

/* Keep tinted explanation text readable on light bg */
.theme-light .text-green-200 { color: #14532d !important; }  /* green-900 */
.theme-light .text-blue-200  { color: #1e3a5f !important; }  /* blue-950 */
.theme-light .text-red-300   { color: #991b1b !important; }  /* red-800  */

/* One-time generation badge */
.theme-light .bg-blue-500\/20 { background-color: rgba(191, 219, 254, 0.4) !important; }

/* ── Resource hover ── */
.theme-light [class*="hover:bg-zinc-700"] {
  --tw-hover-bg: #d6d3d1;
}

/* ── Tab sub-header descriptions ── */
.theme-light p.text-zinc-300 { color: #57534e !important; }

/* ── Quiz meta info bar at bottom ── */
.theme-light .bg-zinc-800.border.border-zinc-700 {
  background-color: #ede8e4 !important;
  border-color: #d6d3d1 !important;
}

/* ── Label text for quiz config ── */
.theme-light label.text-zinc-300 { color: #44403c !important; }

/* ── Quiz tip / hint text ── */
.theme-light p.text-xs.text-zinc-400 { color: #78716c !important; }

/* ── Quiz meta small text ── */
.theme-light .text-sm.text-zinc-400 { color: #78716c !important; }

/* ── Font colour safety net — ensure no text disappears into the bg ── */
.theme-light h1, .theme-light h2, .theme-light h3,
.theme-light h4, .theme-light h5, .theme-light h6 {
  color: #1c1917 !important;   /* stone-900 */
}
.theme-light p   { color: #44403c; }   /* stone-700 — readable body text */
.theme-light li  { color: #44403c; }
.theme-light span:not([class*="text-"])  { color: inherit; }

/* AppButton SECONDARY — the pseudo after-element uses bg-black which looks
   broken on a cream background. Swap it to stone-100. */
.theme-light .bg-black {
  background-color: #f5f5f4 !important;  /* stone-100 — matches panel bg */
}

/* ── QuizContainer — quiz answer option buttons ── */
/* Unselected option:  dark bg-zinc-700 border-zinc-600 text-zinc-300 */
.theme-light .bg-zinc-700.border-zinc-600.text-zinc-300 {
  background-color: #f0ede9 !important;  /* off-white warm */
  border-color: #c4bfba !important;      /* stone-350 approx */
  color: #292524 !important;             /* stone-800 */
}
.theme-light .bg-zinc-700.border-zinc-600:hover {
  background-color: #e7e1d9 !important;
}

/* Selected option:  bg-red-500/20 border-red-500 text-white */
.theme-light .bg-red-500\/20.border-red-500 {
  background-color: rgba(239, 68, 68, 0.12) !important;
  border-color: #dc2626 !important;
  color: #7f1d1d !important;  /* red-900 — dark enough on light bg */
}

/* ── Fill-in-blank input ── */
.theme-light input.bg-zinc-700,
.theme-light input[class*="bg-zinc-"] {
  background-color: #faf9f7 !important;   /* near white warm */
  border-color: #d6d3d1 !important;       /* stone-300 */
  color: #1c1917 !important;              /* stone-900 */
}
.theme-light input::placeholder { color: #a8a29e !important; }  /* stone-400 */
.theme-light input:focus {
  border-color: #dc2626 !important;       /* keep brand red focus ring */
}

/* ── Quiz border-t divider ── */
.theme-light .border-t.border-zinc-700 {
  border-color: #d6d3d1 !important;
}

/* ── QuizContainer gradient header (from-zinc-800 to-zinc-900) ── */
/* Use attribute selectors so we ONLY match the zinc header, never red gradients */
.theme-light [class*="from-zinc-800"] {
  background: linear-gradient(to right, #e7e5e4, #ede9e5) !important;
  border-left-color: #dc2626 !important;
}
.theme-light [class*="from-zinc-800"] h2,
.theme-light [class*="from-zinc-800"] h3 {
  color: #1c1917 !important;
}
.theme-light [class*="from-zinc-800"] .text-white  { color: #1c1917 !important; }
.theme-light [class*="from-zinc-800"] .text-zinc-300 { color: #57534e !important; }
.theme-light [class*="from-zinc-800"] .text-zinc-400 { color: #78716c !important; }
.theme-light [class*="from-zinc-800"] .bg-zinc-700  { background-color: #d6d3d1 !important; }

/* ── Quiz results score header (from-green-900/30 to-blue-900/30) ── */
.theme-light [class*="from-green-900"] {
  background: linear-gradient(to right,
    rgba(187, 247, 208, 0.25),
    rgba(191, 219, 254, 0.25)) !important;
  border-color: rgba(34, 197, 94, 0.25) !important;
}

/* ── Correct/wrong answer border-l-4 blocks in review ── */
.theme-light .bg-zinc-700.border-l-4 {
  background-color: #f0ede9 !important;
  color: #1c1917 !important;
}
.theme-light .bg-zinc-700.border-l-4 span.text-white { color: #1c1917 !important; }

/* ── Explanation block in review (bg-zinc-700/50) ── */
.theme-light .bg-zinc-700\/50.p-4 {
  background-color: rgba(231, 229, 228, 0.6) !important;
}

/* ── Score circle in quiz results ── */
.theme-light .w-24.h-24.border-4 {
  background-color: transparent !important;
}

/* ── Hinglish tab: Shiki-highlighted code blocks ── */
.hinglish-content :deep(.shiki-code-block) {
  position: relative;
  margin: 1.25rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

/* Language badge */
.hinglish-content :deep(.shiki-code-block[data-lang])::before {
  content: attr(data-lang);
  display: block;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.06);
  color: #a0a0b0;
  font-size: 11px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Shiki pre/code styles */
.hinglish-content :deep(.shiki-code-block .shiki) {
  margin: 0 !important;
  border-radius: 0 !important;
  background: #121212 !important;
  padding: 1rem 1.25rem !important;
  overflow-x: auto;
}

.hinglish-content :deep(.shiki-code-block code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.82rem;
  line-height: 1.65;
}

/* Fallback plain code blocks inside Hinglish content */
.hinglish-content :deep(.code-block-wrapper) {
  margin: 1.25rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #121212;
}

.hinglish-content :deep(.code-block-wrapper pre) {
  padding: 1rem 1.25rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  line-height: 1.65;
  color: #d4d4d4;
}

.hinglish-content :deep(.code-lang-label) {
  display: block;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.06);
  color: #a0a0b0;
  font-size: 11px;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
</style>

