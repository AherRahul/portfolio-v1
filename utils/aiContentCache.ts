// AI Content Caching Utilities - Single Course Progress Key
export interface CourseProgressStorage {
  courses: {
    [topicTitle: string]: {
      courseId: string
      contentHash: string
      topicTitle: string
      lastUpdated: string
      
      summary?: {
        data: {
          summary: string
          keyPoints: string[]
          concepts: string[]
          takeaways: string[]
          estimatedReadTime: number
        }
        metadata: {
          createdAt: string
          difficulty?: string
        }
      }
      
      quiz?: {
        questions: any[]
        metadata: {
          createdAt: string
          difficulty: string
          questionCount: number
          requestedQuestions: number
          actualQuestions: number
        }
        completion?: {
          completed: boolean
          completedAt?: string
          score?: number
          userAnswers?: any[]
          totalQuestions?: number
        }
      }
    }
  }
}

export interface CourseData {
  courseId: string
  contentHash: string
  topicTitle: string
  lastUpdated: string
  
  summary?: {
    data: {
      summary: string
      keyPoints: string[]
      concepts: string[]
      takeaways: string[]
      estimatedReadTime: number
    }
    metadata: {
      createdAt: string
      difficulty?: string
    }
  }
  
  quiz?: {
    questions: any[]
    metadata: {
      createdAt: string
      difficulty: string
      questionCount: number
      requestedQuestions: number
      actualQuestions: number
    }
    completion?: {
      completed: boolean
      completedAt?: string
      score?: number
      userAnswers?: any[]
      totalQuestions?: number
    }
  }
}

// Legacy interfaces for backward compatibility
export interface CachedSummary {
  data: {
    summary: string
    keyPoints: string[]
    concepts: string[]
    takeaways: string[]
    estimatedReadTime: number
  }
  metadata: {
    contentHash: string
    createdAt: string
    topicTitle: string
    difficulty?: string
  }
}

export interface CachedQuiz {
  questions: any[]
  metadata: {
    contentHash: string
    createdAt: string
    topicTitle: string
    difficulty: string
    questionCount: number
    requestedQuestions: number
    actualQuestions: number
  }
  completion?: {
    completed: boolean
    completedAt?: string
    score?: number
    userAnswers?: any[]
    totalQuestions?: number
  }
}

// Generate a simple hash for content to detect changes
function generateContentHash(content: string, topicTitle: string): string {
  const combined = content + topicTitle
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// SINGLE CACHE KEY for all courses
const COURSE_PROGRESS_KEY = 'course-progress'

// Get the global course progress storage
function getCourseProgressStorage(): CourseProgressStorage {
  try {
    const existing = localStorage.getItem(COURSE_PROGRESS_KEY)
    if (existing) {
      return JSON.parse(existing)
    }
  } catch (error) {
    console.error('Error reading course progress storage:', error)
  }
  
  return { courses: {} }
}

// Save the global course progress storage
function saveCourseProgressStorage(storage: CourseProgressStorage): void {
  try {
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(storage))
    console.log('💾 Saved course progress storage')
  } catch (error) {
    console.error('Error saving course progress storage:', error)
  }
}

// Get or create course data for specific topic
function getCourseData(content: string, topicTitle: string): CourseData {
  const storage = getCourseProgressStorage()
  const currentHash = generateContentHash(content, topicTitle)
  
  if (storage.courses[topicTitle]) {
    const existing = storage.courses[topicTitle]
    
    // Check if content has changed
    if (existing.contentHash !== currentHash) {
      console.log('🔄 Content changed, clearing old progress for:', topicTitle)
      // Content changed, start fresh
      const newCourse: CourseData = {
        courseId: topicTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        contentHash: currentHash,
        topicTitle,
        lastUpdated: new Date().toISOString()
      }
      
      storage.courses[topicTitle] = newCourse
      saveCourseProgressStorage(storage)
      return newCourse
    }
    
    return existing
  }
  
  // Create new course data
  const newCourse: CourseData = {
    courseId: topicTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
    contentHash: currentHash,
    topicTitle,
    lastUpdated: new Date().toISOString()
  }
  
  storage.courses[topicTitle] = newCourse
  saveCourseProgressStorage(storage)
  return newCourse
}

// Save course data for specific topic
function saveCourseData(courseData: CourseData): void {
  const storage = getCourseProgressStorage()
  courseData.lastUpdated = new Date().toISOString()
  storage.courses[courseData.topicTitle] = courseData
  saveCourseProgressStorage(storage)
  console.log('💾 Saved course data for:', courseData.topicTitle)
}

// Summary caching functions (updated to use single storage)
export function getCachedSummary(content: string, topicTitle: string): CachedSummary | null {
  try {
    const courseData = getCourseData(content, topicTitle)
    
    if (!courseData.summary) return null
    
    console.log('📋 Found cached summary:', courseData.summary.metadata.createdAt)
    
    // Convert to legacy format for compatibility
    return {
      data: courseData.summary.data,
      metadata: {
        contentHash: courseData.contentHash,
        createdAt: courseData.summary.metadata.createdAt,
        topicTitle: courseData.topicTitle,
        difficulty: courseData.summary.metadata.difficulty
      }
    }
  } catch (error) {
    console.error('Error reading cached summary:', error)
    return null
  }
}

export function setCachedSummary(content: string, topicTitle: string, summaryData: any, difficulty?: string): void {
  try {
    const courseData = getCourseData(content, topicTitle)
    
    courseData.summary = {
      data: summaryData,
      metadata: {
        createdAt: new Date().toISOString(),
        difficulty
      }
    }
    
    saveCourseData(courseData)
    console.log('💾 Cached summary for:', topicTitle)
  } catch (error) {
    console.error('Error caching summary:', error)
  }
}

// Quiz caching functions (updated to use single storage, ONE quiz per course)
export function getCachedQuiz(content: string, topicTitle: string, difficulty?: string, questionCount?: number): CachedQuiz | null {
  try {
    const courseData = getCourseData(content, topicTitle)
    
    if (!courseData.quiz) return null
    
    console.log('🎯 Found cached quiz:', courseData.quiz.metadata.createdAt, 
                courseData.quiz.completion ? '(completed)' : '(not attempted)')
    
    // Convert to legacy format for compatibility
    return {
      questions: courseData.quiz.questions,
      metadata: {
        contentHash: courseData.contentHash,
        createdAt: courseData.quiz.metadata.createdAt,
        topicTitle: courseData.topicTitle,
        difficulty: courseData.quiz.metadata.difficulty,
        questionCount: courseData.quiz.metadata.questionCount,
        requestedQuestions: courseData.quiz.metadata.requestedQuestions,
        actualQuestions: courseData.quiz.metadata.actualQuestions
      },
      completion: courseData.quiz.completion
    }
  } catch (error) {
    console.error('Error reading cached quiz:', error)
    return null
  }
}

export function setCachedQuiz(content: string, topicTitle: string, quizData: any, difficulty: string, questionCount: number, requestedQuestions: number): void {
  try {
    const courseData = getCourseData(content, topicTitle)
    
    courseData.quiz = {
      questions: quizData,
      metadata: {
        createdAt: new Date().toISOString(),
        difficulty,
        questionCount,
        requestedQuestions,
        actualQuestions: quizData.length
      }
    }
    
    saveCourseData(courseData)
    console.log('💾 Cached quiz for:', topicTitle, `(${quizData.length} questions)`)
  } catch (error) {
    console.error('Error caching quiz:', error)
  }
}

export function updateQuizCompletion(content: string, topicTitle: string, difficulty: string, questionCount: number, completionData: {
  score: number
  userAnswers: any[]
  totalQuestions: number
}): void {
  try {
    const courseData = getCourseData(content, topicTitle)
    
    if (!courseData.quiz) return
    
    // If score is 0 and no answers, remove completion (for retaking)
    if (completionData.score === 0 && completionData.userAnswers.length === 0) {
      delete courseData.quiz.completion
      console.log('🔄 Reset quiz completion for retaking:', topicTitle)
    } else {
      courseData.quiz.completion = {
        completed: true,
        completedAt: new Date().toISOString(),
        ...completionData
      }
      console.log('✅ Updated quiz completion:', topicTitle, `${completionData.score}%`)
    }
    
    saveCourseData(courseData)
  } catch (error) {
    console.error('Error updating quiz completion:', error)
  }
}

// Cache management functions (updated to use single storage)
export function clearContentCache(content: string, topicTitle: string): void {
  try {
    const storage = getCourseProgressStorage()
    
    // Remove course from storage
    delete storage.courses[topicTitle]
    saveCourseProgressStorage(storage)
    
    // Clean up any old separate cache keys (migration cleanup)
    const hash = generateContentHash(content, topicTitle)
    const oldSummaryKey = `ai-summary-${hash}`
    localStorage.removeItem(oldSummaryKey)
    
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(`ai-quiz-${hash}`) || key.startsWith(`course-`) && key !== COURSE_PROGRESS_KEY) {
        localStorage.removeItem(key)
      }
    })
    
    console.log('🗑️ Cleared all caches for:', topicTitle)
  } catch (error) {
    console.error('Error clearing content cache:', error)
  }
}

export function getCacheInfo(content: string, topicTitle: string): {
  summary: boolean
  quizzes: Array<{difficulty: string, questionCount: number, completed: boolean}>
} {
  try {
    const courseData = getCourseData(content, topicTitle)
    
    const quizzes: Array<{difficulty: string, questionCount: number, completed: boolean}> = []
    
    if (courseData.quiz) {
      quizzes.push({
        difficulty: courseData.quiz.metadata.difficulty,
        questionCount: courseData.quiz.metadata.questionCount,
        completed: courseData.quiz.completion?.completed || false
      })
    }
    
    return { 
      summary: !!courseData.summary, 
      quizzes 
    }
  } catch (error) {
    console.error('Error getting cache info:', error)
    return { summary: false, quizzes: [] }
  }
}

// Helper functions to check if content exists (to prevent re-generation)
export function hasExistingSummary(content: string, topicTitle: string): boolean {
  try {
    const courseData = getCourseData(content, topicTitle)
    return !!courseData.summary
  } catch {
    return false
  }
}

export function hasExistingQuiz(content: string, topicTitle: string): boolean {
  try {
    const courseData = getCourseData(content, topicTitle)
    return !!courseData.quiz
  } catch {
    return false
  }
}
