<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { downloadSummaryPDF } from '~/utils/pdfGenerator'
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
  type: 'single-choice' | 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer'
  question: string
  options?: string[]
  correctAnswers: string[] | boolean[]
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

// Quiz state
const quizData = ref<QuizQuestion[]>([])
const quizLoading = ref(false)
const quizError = ref('')

// Methods
function setActiveTab(tabId: string) {
  activeTab.value = tabId
  
  // Load data when tab is activated
  if (tabId === 'notes' && !summaryData.value && !summaryLoading.value) {
    generateSummary()
  } else if (tabId === 'quiz' && quizData.value.length === 0 && !quizLoading.value) {
    generateQuiz()
  }
}

async function generateSummary() {
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
    
    summaryData.value = response
  } catch (err: any) {
    summaryError.value = err.data?.message || 'Failed to generate summary. Please try again.'
    console.error('Summary generation failed:', err)
  } finally {
    summaryLoading.value = false
  }
}

async function downloadSummary() {
  if (!summaryData.value) return
  try {
    await downloadSummaryPDF(props.topicTitle, summaryData.value)
  } catch (error) {
    console.error('Error downloading PDF:', error)
  }
}

async function generateQuiz() {
  quizLoading.value = true
  quizError.value = ''
  
  const { makeApiCall } = useApiEndpoints()
  
  try {
    const response = await makeApiCall('/api/quiz/generate', {
      method: 'POST',
      body: {
        content: props.content,
        topicTitle: props.topicTitle,
        difficulty: props.difficulty || 'medium',
        questionCount: 10 // Increased from 5 to 10
      }
    })
    
    quizData.value = response.questions
  } catch (err: any) {
    quizError.value = err.data?.message || 'Failed to generate quiz. Please try again.'
    console.error('Quiz generation failed:', err)
  } finally {
    quizLoading.value = false
  }
}

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
            <ContentDoc class="prose md:prose-lg lg:prose-xl" :class="isOlderThanOneYear ? 'pt-8' : 'pt-4'" />
          </div>
        </div>

        <!-- AI Notes Tab -->
        <div v-else-if="activeTab === 'notes'" :id="'panel-notes'" role="tabpanel" aria-labelledby="tab-notes">
          <div class="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
              <Icon name="heroicons:light-bulb" class="text-lg sm:text-xl" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 mt-0">
                AI Generated Notes
              </h3>
              <p class="text-zinc-300 mb-3 sm:mb-4">
                Smart summary and key insights powered by AI
              </p>
            </div>
            <!-- Download button for mobile/desktop -->
            <div v-if="summaryData" class="flex-shrink-0">
              <AppButton 
                @click="downloadSummary" 
                look="secondary" 
                class="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                <Icon name="heroicons:arrow-down-tray" class="text-sm mr-1 sm:mr-2" />
                <span class="hidden sm:inline">Download PDF</span>
                <span class="sm:hidden">PDF</span>
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
          <div v-else-if="summaryError" class="bg-red-900/20 border border-red-500/50 p-6">
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
          <div v-else class="text-center py-8">
            <Icon name="heroicons:light-bulb" class="text-6xl text-zinc-600 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-white mb-2">Generate AI Notes</h4>
            <p class="text-zinc-400 mb-4">Get smart summary and insights for this topic</p>
            <AppButton @click="generateSummary" :disabled="summaryLoading">
              <Icon name="heroicons:sparkles" class="mr-2" />
              Generate Notes
            </AppButton>
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
            <LazyQuizContainer 
              :topic-title="topicTitle"
              :content="content"
              :difficulty="difficulty || 'medium'"
              :question-count="10"
              :pre-generated-questions="quizData"
            />
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
              <h4 class="text-xl font-semibold text-red-400">Error</h4>
            </div>
            <p class="text-red-300 mb-4">{{ quizError }}</p>
            <AppButton @click="generateQuiz" :disabled="quizLoading">
              <Icon name="heroicons:arrow-path" class="mr-2" />
              Try Again
            </AppButton>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <Icon name="heroicons:academic-cap" class="text-6xl text-zinc-600 mx-auto mb-4" />
            <h4 class="text-lg font-semibold text-white mb-2">Take Interactive Quiz</h4>
            <p class="text-zinc-400 mb-4">Test your understanding with 10 AI-generated questions</p>
            <AppButton @click="generateQuiz" :disabled="quizLoading">
              <Icon name="heroicons:play" class="mr-2" />
              Start Quiz
            </AppButton>
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
