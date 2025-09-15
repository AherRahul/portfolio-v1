<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { downloadQuizAnalysisPDF } from '~/utils/pdfGenerator'

interface QuizQuestion {
  id: string
  type: 'single-choice' | 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer'
  question: string
  options?: string[]
  correctAnswers: string[] | boolean[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface UserAnswer {
  questionId: string
  answers: string[]
  isCorrect: boolean
}

const props = defineProps<{
  topicTitle: string
  content: string
  difficulty?: 'easy' | 'medium' | 'hard'
  questionCount?: number
  preGeneratedQuestions?: QuizQuestion[]
}>()

// Quiz state
const isLoading = ref(false)
const isStarted = ref(false)
const isCompleted = ref(false)
const currentQuestionIndex = ref(0)
const questions = ref<QuizQuestion[]>([])
const userAnswers = ref<UserAnswer[]>([])
const showResults = ref(false)
const error = ref('')

// Current question state
const selectedAnswers = ref<string[]>([])
const fillBlankAnswer = ref('')
const shortAnswer = ref('')

// Computed properties
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.value.length) * 100)
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const canProceed = computed(() => {
  if (!currentQuestion.value) return false
  
  switch (currentQuestion.value.type) {
    case 'single-choice':
    case 'multiple-choice':
    case 'true-false':
      return selectedAnswers.value.length > 0
    case 'fill-blank':
      return fillBlankAnswer.value.trim().length > 0
    case 'short-answer':
      return shortAnswer.value.trim().length > 0
    default:
      return false
  }
})

const score = computed(() => {
  const correct = userAnswers.value.filter(a => a.isCorrect).length
  return Math.round((correct / userAnswers.value.length) * 100)
})

// Methods
async function generateQuiz() {
  // If pre-generated questions are provided, use them
  if (props.preGeneratedQuestions && props.preGeneratedQuestions.length > 0) {
    questions.value = props.preGeneratedQuestions
    isStarted.value = true
    return
  }

  isLoading.value = true
  error.value = ''
  
  try {
    const response = await $fetch('/api/quiz/generate', {
      method: 'POST',
      body: {
        content: props.content,
        topicTitle: props.topicTitle,
        difficulty: props.difficulty || 'medium',
        questionCount: props.questionCount || 10
      }
    })
    
    questions.value = response.questions
    isStarted.value = true
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to generate quiz. Please try again.'
    console.error('Quiz generation failed:', err)
  } finally {
    isLoading.value = false
  }
}

function startQuiz() {
  if (props.preGeneratedQuestions && props.preGeneratedQuestions.length > 0) {
    questions.value = props.preGeneratedQuestions
    isStarted.value = true
  } else if (questions.value.length === 0) {
    generateQuiz()
  } else {
    isStarted.value = true
  }
}

function restartQuiz() {
  isStarted.value = false
  isCompleted.value = false
  showResults.value = false
  currentQuestionIndex.value = 0
  userAnswers.value = []
  resetCurrentAnswers()
}

function resetCurrentAnswers() {
  selectedAnswers.value = []
  fillBlankAnswer.value = ''
  shortAnswer.value = ''
}

function selectAnswer(option: string) {
  if (!currentQuestion.value) return
  
  if (currentQuestion.value.type === 'single-choice' || currentQuestion.value.type === 'true-false') {
    selectedAnswers.value = [option]
  } else if (currentQuestion.value.type === 'multiple-choice') {
    const index = selectedAnswers.value.indexOf(option)
    if (index > -1) {
      selectedAnswers.value.splice(index, 1)
    } else {
      selectedAnswers.value.push(option)
    }
  }
}

function checkAnswer(): boolean {
  if (!currentQuestion.value) return false
  
  let userAnswer: string[] = []
  let isCorrect = false
  
  switch (currentQuestion.value.type) {
    case 'single-choice':
    case 'multiple-choice':
      userAnswer = [...selectedAnswers.value]
      isCorrect = arraysEqual(userAnswer.sort(), (currentQuestion.value.correctAnswers as string[]).sort())
      break
      
    case 'true-false':
      userAnswer = [...selectedAnswers.value]
      const boolAnswer = userAnswer[0] === 'True'
      isCorrect = boolAnswer === (currentQuestion.value.correctAnswers as boolean[])[0]
      break
      
    case 'fill-blank':
      userAnswer = [fillBlankAnswer.value.trim()]
      const expectedAnswers = currentQuestion.value.correctAnswers as string[]
      isCorrect = expectedAnswers.some(expected => 
        userAnswer[0].toLowerCase().includes(expected.toLowerCase()) ||
        expected.toLowerCase().includes(userAnswer[0].toLowerCase())
      )
      break
      
    case 'short-answer':
      userAnswer = [shortAnswer.value.trim()]
      // For short answers, we'll be more lenient and check for key terms
      const keyTerms = (currentQuestion.value.correctAnswers as string[])[0].toLowerCase().split(' ')
      const userText = userAnswer[0].toLowerCase()
      isCorrect = keyTerms.some(term => userText.includes(term) && term.length > 2)
      break
  }
  
  return isCorrect
}

function nextQuestion() {
  if (!currentQuestion.value) return
  
  const isCorrect = checkAnswer()
  
  // Store user answer
  let userAnswerValue: string[] = []
  switch (currentQuestion.value.type) {
    case 'single-choice':
    case 'multiple-choice':
    case 'true-false':
      userAnswerValue = [...selectedAnswers.value]
      break
    case 'fill-blank':
      userAnswerValue = [fillBlankAnswer.value.trim()]
      break
    case 'short-answer':
      userAnswerValue = [shortAnswer.value.trim()]
      break
  }
  
  userAnswers.value.push({
    questionId: currentQuestion.value.id,
    answers: userAnswerValue,
    isCorrect
  })
  
  if (isLastQuestion.value) {
    isCompleted.value = true
    showResults.value = true
  } else {
    currentQuestionIndex.value++
    resetCurrentAnswers()
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    // Remove the answer for the current question
    userAnswers.value = userAnswers.value.filter(a => a.questionId !== currentQuestion.value?.id)
    resetCurrentAnswers()
  }
}

function goToQuestion(index: number) {
  if (index >= 0 && index < questions.value.length) {
    currentQuestionIndex.value = index
    resetCurrentAnswers()
  }
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i])
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'text-green-400'
    case 'medium': return 'text-yellow-400'
    case 'hard': return 'text-red-400'
    default: return 'text-zinc-400'
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

async function downloadQuizAnalysis() {
  if (!questions.value.length || !userAnswers.value.length) return
  try {
    await downloadQuizAnalysisPDF(props.topicTitle, questions.value, userAnswers.value, score.value)
  } catch (error) {
    console.error('Error downloading quiz analysis PDF:', error)
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <!-- Quiz Header -->
    <div class="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 border-l-4 border-red-500 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-3">
            <Icon name="heroicons:academic-cap" class="text-red-400" />
            AI Generated Quiz
          </h2>
          <p class="text-zinc-300 mt-1">{{ topicTitle }}</p>
        </div>
        <div v-if="isStarted && !showResults" class="text-right">
          <div class="text-sm text-zinc-400">Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</div>
          <div class="w-32 bg-zinc-700 h-2 mt-1">
            <div 
              class="bg-gradient-to-r from-red-500 to-pink-600 h-2 transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-zinc-800 p-8 text-center">
      <Icon name="heroicons:arrow-path" class="animate-spin text-4xl text-red-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white mb-2">Generating Quiz...</h3>
      <p class="text-zinc-400">Our AI is analyzing the content to create personalized questions for you.</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-500/50 p-6">
      <div class="flex items-center gap-3 mb-3">
        <Icon name="heroicons:exclamation-triangle" class="text-red-400 text-2xl" />
        <h3 class="text-xl font-semibold text-red-400">Error</h3>
      </div>
      <p class="text-red-300 mb-4">{{ error }}</p>
      <AppButton @click="generateQuiz" :disabled="isLoading">
        <Icon name="heroicons:arrow-path" class="mr-2" />
        Try Again
      </AppButton>
    </div>

    <!-- Start Quiz -->
    <div v-else-if="!isStarted" class="bg-zinc-800 p-8 text-center">
      <Icon name="heroicons:play" class="text-6xl text-red-400 mx-auto mb-6" />
      <h3 class="text-2xl font-bold text-white mb-4">Ready to Test Your Knowledge?</h3>
      <p class="text-zinc-300 mb-6 max-w-2xl mx-auto">
        Take this AI-generated quiz based on the content you just read. The quiz includes various question types 
        to thoroughly test your understanding of the topic.
      </p>
      <div class="flex flex-wrap gap-4 justify-center mb-6 text-sm">
        <div class="flex items-center gap-2 text-zinc-400">
          <Icon name="heroicons:clock" />
          <span>{{ questionCount || 10 }} Questions</span>
        </div>
        <div class="flex items-center gap-2 text-zinc-400">
          <Icon name="heroicons:chart-bar" />
          <span class="capitalize" :class="getDifficultyColor(difficulty || 'medium')">{{ difficulty || 'medium' }} Level</span>
        </div>
        <div class="flex items-center gap-2 text-zinc-400">
          <Icon name="heroicons:light-bulb" />
          <span>AI Generated</span>
        </div>
      </div>
      <AppButton @click="startQuiz" :disabled="isLoading" class="px-8 py-3">
        <Icon name="heroicons:play" class="mr-2" />
        Start Quiz
      </AppButton>
    </div>

    <!-- Quiz Questions -->
    <div v-else-if="isStarted && !showResults && currentQuestion" class="space-y-6">
      <!-- Question -->
      <div class="bg-zinc-800 p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <span class="w-8 h-8 bg-red-500 text-white font-bold flex items-center justify-center text-sm">
                {{ currentQuestionIndex + 1 }}
              </span>
              <span class="text-sm uppercase tracking-wide text-zinc-400">{{ currentQuestion.type.replace('-', ' ') }}</span>
              <span class="text-sm" :class="getDifficultyColor(currentQuestion.difficulty)">{{ currentQuestion.difficulty }}</span>
            </div>
            <h3 class="text-xl font-semibold text-white leading-relaxed">{{ currentQuestion.question }}</h3>
          </div>
        </div>

        <!-- Single Choice / Multiple Choice / True-False -->
        <div v-if="['single-choice', 'multiple-choice', 'true-false'].includes(currentQuestion.type)" class="space-y-3 mt-6">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(option)"
            class="w-full text-left p-4 border transition-all duration-200 hover:border-red-500/50"
            :class="[
              selectedAnswers.includes(option)
                ? 'bg-red-500/20 border-red-500 text-white'
                : 'bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600'
            ]"
          >
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 border-2 flex items-center justify-center transition-colors"
                :class="[
                  selectedAnswers.includes(option) 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-zinc-500',
                  currentQuestion.type === 'single-choice' || currentQuestion.type === 'true-false' 
                    ? '' : ''
                ]">
                <Icon v-if="selectedAnswers.includes(option)" name="heroicons:check" class="text-white text-xs" />
              </div>
              <span>{{ option }}</span>
            </div>
          </button>
        </div>

        <!-- Fill in the Blank -->
        <div v-else-if="currentQuestion.type === 'fill-blank'" class="mt-6">
          <input
            v-model="fillBlankAnswer"
            type="text"
            placeholder="Type your answer here..."
            class="w-full p-4 bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none transition-colors"
          />
        </div>

        <!-- Short Answer -->
        <div v-else-if="currentQuestion.type === 'short-answer'" class="mt-6">
          <textarea
            v-model="shortAnswer"
            placeholder="Write your answer here..."
            rows="4"
            class="w-full p-4 bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none transition-colors resize-none"
          ></textarea>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-zinc-700">
          <AppButton 
            v-if="currentQuestionIndex > 0"
            look="secondary" 
            @click="previousQuestion"
          >
            <Icon name="heroicons:chevron-left" class="mr-1" />
            Previous
          </AppButton>
          <div v-else></div>

          <AppButton 
            @click="nextQuestion" 
            :disabled="!canProceed"
            class="ml-auto"
          >
            {{ isLastQuestion ? 'Finish Quiz' : 'Next' }}
            <Icon v-if="!isLastQuestion" name="heroicons:chevron-right" class="ml-1" />
            <Icon v-else name="heroicons:check" class="ml-1" />
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="showResults" class="space-y-6">
      <!-- Score Summary -->
      <div class="bg-gradient-to-r from-zinc-800 to-zinc-900 p-8 text-center">
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto mb-4 rounded-full border-4 flex items-center justify-center text-3xl font-bold"
            :class="[
              score >= 80 ? 'border-green-400 text-green-400' :
              score >= 60 ? 'border-yellow-400 text-yellow-400' :
              'border-red-400 text-red-400'
            ]">
            {{ score }}%
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
          <p class="text-zinc-300">
            You scored {{ userAnswers.filter(a => a.isCorrect).length }} out of {{ userAnswers.length }} questions correctly.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <AppButton @click="restartQuiz" look="secondary" class="text-sm sm:text-base">
            <Icon name="heroicons:arrow-path" class="mr-2" />
            Retake Quiz
          </AppButton>
          <AppButton @click="showResults = false" class="text-sm sm:text-base">
            <Icon name="heroicons:eye" class="mr-2" />
            Review Answers
          </AppButton>
          <AppButton @click="downloadQuizAnalysis" look="secondary" class="text-sm sm:text-base">
            <Icon name="heroicons:arrow-down-tray" class="mr-2" />
            Download Analysis
          </AppButton>
        </div>
      </div>

      <!-- Detailed Results -->
      <div class="space-y-4">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="bg-zinc-800 p-6"
        >
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 flex items-center justify-center text-sm font-bold"
              :class="[
                userAnswers[index]?.isCorrect 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              ]">
              {{ index + 1 }}
            </div>
            
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-white mb-3">{{ question.question }}</h4>
              
              <!-- User's Answer -->
              <div class="mb-4">
                <div class="text-sm text-zinc-400 mb-1">Your Answer:</div>
                <div class="p-3 bg-zinc-700 border-l-4"
                  :class="userAnswers[index]?.isCorrect ? 'border-green-500' : 'border-red-500'">
                  <span class="text-white">{{ userAnswers[index]?.answers.join(', ') || 'No answer' }}</span>
                </div>
              </div>
              
              <!-- Correct Answer -->
              <div class="mb-4">
                <div class="text-sm text-zinc-400 mb-1">Correct Answer:</div>
                <div class="p-3 bg-green-900/20 border-l-4 border-green-500">
                  <span class="text-green-300">{{ 
                    Array.isArray(question.correctAnswers) 
                      ? question.correctAnswers.join(', ') 
                      : question.correctAnswers 
                  }}</span>
                </div>
              </div>
              
              <!-- Explanation -->
              <div class="bg-zinc-700/50 p-4">
                <div class="text-sm text-zinc-400 mb-2 flex items-center gap-2">
                  <Icon name="heroicons:light-bulb" />
                  Explanation
                </div>
                <p class="text-zinc-300 leading-relaxed">{{ question.explanation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Results -->
      <div class="text-center">
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <AppButton @click="showResults = true" look="secondary" class="text-sm sm:text-base">
            <Icon name="heroicons:chart-bar" class="mr-2" />
            Back to Summary
          </AppButton>
          <AppButton @click="downloadQuizAnalysis" class="text-sm sm:text-base">
            <Icon name="heroicons:arrow-down-tray" class="mr-2" />
            Download Analysis
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
