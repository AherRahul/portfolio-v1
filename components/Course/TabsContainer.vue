<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { downloadSummaryPDF } from '~/utils/pdfGenerator'
import { 
  getCachedSummary, 
  setCachedSummary, 
  getCachedQuiz, 
  setCachedQuiz, 
  updateQuizCompletion,
  hasExistingSummary,
  hasExistingQuiz,
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
  resources?: ResourceItem[]
  difficulty?: 'easy' | 'medium' | 'hard'
  isOlderThanOneYear?: boolean
}>()

// Tab state
const activeTab = ref('content')
const tabs = [
  { id: 'content', title: 'Content', icon: 'heroicons:document-text' },
  { id: 'notes', title: 'AI Notes', icon: 'heroicons:light-bulb' },
  { id: 'quiz', title: 'Quiz', icon: 'heroicons:academic-cap' },
  { id: 'resources', title: 'Resources', icon: 'heroicons:link' }
]

// AI Summary state
const summaryData = ref<SummaryData | null>(null)
const summaryLoading = ref(false)
const summaryError = ref('')
const downloadingPdf = ref(false)

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
      console.log('🎯 Auto-loaded existing quiz on tab activation')
    }
  }
}

async function generateSummary() {
  // Check for cached summary first
  const cached = getCachedSummary(props.content, props.topicTitle)
  if (cached) {
    summaryData.value = cached.data
    console.log('📋 Using cached summary from:', cached.metadata.createdAt)
    return
  }

  // Prevent generation if summary already exists
  if (hasExistingSummary(props.content, props.topicTitle)) {
    console.log('📋 Summary already exists, skipping generation')
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
    console.log('💾 Generated and cached new summary')
    
  } catch (err: any) {
    summaryError.value = err.data?.message || 'Failed to generate summary. Please try again.'
    console.error('Summary generation failed:', err)
  } finally {
    summaryLoading.value = false
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
        console.log('PDF download initiated for mobile device')
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
    console.log('🎯 Using cached quiz from:', cached.metadata.createdAt)
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
    console.log('💾 Generated and cached new quiz')
    
    // Show notification if question count was adjusted
    if (responseData.metadata?.questionCountAdjusted) {
      console.log(`Quiz generated with ${responseData.metadata.actualQuestions} questions (requested ${responseData.metadata.requestedQuestions})`)
      
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
    console.log('📄 Quiz results PDF downloaded')
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
    
    console.log('✅ Quiz completion recorded:', `${completionData.score}%`)
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
    
    console.log('🔄 Quiz reset for retaking')
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
  const currentIndex = tabs.findIndex(t => t.id === activeTab.value)
  if (currentIndex === -1) return
  
  if (e.key === 'ArrowRight') {
    const next = (currentIndex + 1) % tabs.length
    setActiveTab(tabs[next].id)
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') {
    const prev = (currentIndex - 1 + tabs.length) % tabs.length
    setActiveTab(tabs[prev].id)
    e.preventDefault()
  } else if (e.key === 'Home') {
    setActiveTab(tabs[0].id)
    e.preventDefault()
  } else if (e.key === 'End') {
    setActiveTab(tabs[tabs.length - 1].id)
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
})
</script>

<template>
  <div class="w-full">
    <!-- Outer card background -->
    <div class="border border-zinc-800 bg-zinc-900">
      <!-- Tab Navigation -->
      <div
        class="relative bg-zinc-700"
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
              :class="[
                'snap-start rounded-none bg-zinc-800 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 flex-shrink-0 min-w-max',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
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
              :class="[
                'rounded-none bg-zinc-800 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 flex-1 justify-center',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
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
      <div class="bg-zinc-800 border-t border-zinc-800 p-3 sm:p-4 md:p-6 min-h-[350px] sm:min-h-[400px]">
        
        <!-- Content Tab -->
        <div v-if="activeTab === 'content'" :id="'panel-content'" role="tabpanel" aria-labelledby="tab-content">
          <div>
            <ArticleAgeWarning v-if="isOlderThanOneYear" />
            <ClientOnly>
              <LazyContentReader :prepend="topicTitle" :doc-class="'prose md:prose-lg lg:prose-xl ' + (isOlderThanOneYear ? 'pt-8' : 'pt-4')" />
            </ClientOnly>
          </div>
        </div>

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
</template>
