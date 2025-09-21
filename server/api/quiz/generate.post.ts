import Anthropic from '@anthropic-ai/sdk'

interface QuizQuestion {
  id: string
  type: 'single-choice' | 'multiple-choice' | 'true-false' | 'fill-blank' // Only UI-supported types
  question: string
  options?: string[]
  correctAnswers: string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface QuizResponse {
  questions: QuizQuestion[]
  totalQuestions: number
  estimatedTime: number
}

// Helper function to fix common JSON issues
function fixJsonResponse(jsonStr: string): string {
  // First, try to find and extract just the JSON part
  const jsonStart = jsonStr.indexOf('{')
  if (jsonStart > 0) {
    // Remove everything before the first {
    jsonStr = jsonStr.substring(jsonStart)
    console.log(`Removed ${jsonStart} characters of prefix text`)
  }
  
  // Remove any trailing comma before closing braces/brackets
  jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1')
  
  // Ensure the response ends properly
  if (!jsonStr.trim().endsWith('}')) {
    // Find the last complete question and truncate there
    const lastCompleteQuestion = jsonStr.lastIndexOf('},')
    if (lastCompleteQuestion > 0) {
      jsonStr = jsonStr.substring(0, lastCompleteQuestion + 1) + '\n  ],\n  "totalQuestions": 0,\n  "estimatedTime": 0\n}'
    }
  }
  
  return jsonStr
}

// Helper function to salvage partial JSON responses
function salvagePartialJson(jsonStr: string): string | null {
  try {
    // First, find the JSON start if there's prefix text
    const jsonStart = jsonStr.indexOf('{')
    if (jsonStart > 0) {
      jsonStr = jsonStr.substring(jsonStart)
    }
    
    // Try to find the start of the questions array
    const questionsStart = jsonStr.indexOf('"questions":')
    if (questionsStart === -1) return null
    
    // Extract everything from questions onwards
    const questionsSection = jsonStr.substring(questionsStart)
    
    // Find complete question objects using a more robust approach
    const questions: string[] = []
    let braceCount = 0
    let inString = false
    let escape = false
    let currentQuestion = ''
    let questionStart = -1
    
    for (let i = 0; i < questionsSection.length; i++) {
      const char = questionsSection[i]
      
      if (escape) {
        escape = false
        continue
      }
      
      if (char === '\\') {
        escape = true
        continue
      }
      
      if (char === '"') {
        inString = !inString
        continue
      }
      
      if (inString) continue
      
      if (char === '{') {
        if (braceCount === 0) {
          questionStart = i
          currentQuestion = ''
        }
        braceCount++
        currentQuestion += char
      } else if (char === '}') {
        currentQuestion += char
        braceCount--
        if (braceCount === 0 && questionStart !== -1) {
          // Try to parse the question to validate it
          try {
            const parsed = JSON.parse(currentQuestion)
            if (parsed.id && parsed.type && parsed.question && parsed.correctAnswers && parsed.explanation) {
              questions.push(currentQuestion)
            }
          } catch {
            // Invalid question, skip it
          }
        }
      } else if (braceCount > 0) {
        currentQuestion += char
      }
    }
    
    if (questions.length === 0) return null
    
    // Construct a valid response with the salvaged questions
    return `{
  "questions": [${questions.join(',')}],
  "totalQuestions": ${questions.length},
  "estimatedTime": ${Math.ceil(questions.length * 1.5)}
}`
  } catch (err) {
    console.error('Error in salvagePartialJson:', err)
    return null
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { content, topicTitle, difficulty = 'medium', questionCount = 10 } = body

    if (!content || !topicTitle) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content and topic title are required'
      })
    }

    // Limit content length to prevent token overflow
    const maxContentLength = 8000 // Approximate character limit
    const truncatedContent = content.length > maxContentLength 
      ? content.substring(0, maxContentLength) + '...[content truncated]'
      : content

    // Initial question count - let token calculation handle the limits
    // Claude 3 Haiku can handle ~17 questions max with current token allocation
    let adjustedQuestionCount = Math.min(questionCount, 17)
    console.log(`Quiz generation: Requested ${questionCount}, Initial adjusted to ${adjustedQuestionCount}`)

    const anthropicApiKey = useRuntimeConfig().anthropicApiKey
    if (!anthropicApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Anthropic API key not configured'
      })
    }

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    })

    const prompt = `Generate ${adjustedQuestionCount} quiz questions in JSON format.

Topic: ${topicTitle}
Content: ${truncatedContent}

Return valid JSON only. No text before or after. Format:

{
  "questions": [
    {
      "id": "q1", 
      "type": "single-choice",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswers": ["A"],
      "explanation": "Brief explanation.",
      "difficulty": "${difficulty}"
    },
    {
      "id": "q2", 
      "type": "true-false",
      "question": "Statement to evaluate?",
      "options": ["True", "False"],
      "correctAnswers": ["True"],
      "explanation": "Brief explanation.",
      "difficulty": "${difficulty}"
    }
  ],
  "totalQuestions": ${adjustedQuestionCount},
  "estimatedTime": ${Math.ceil(adjustedQuestionCount * 1.5)}
}

IMPORTANT: Generate exactly ${adjustedQuestionCount} questions using ONLY these 4 types:
1. "single-choice" - one correct answer from multiple options
2. "multiple-choice" - multiple correct answers from options  
3. "true-false" - boolean statement with options ["True", "False"]
4. "fill-blank" - fill in missing word/phrase (no options array)

DO NOT generate any other question types. Use ONLY: single-choice, multiple-choice, true-false, fill-blank.
For true-false questions, always use options: ["True", "False"] and correctAnswers as ["True"] or ["False"].
For fill-blank questions, use type: "fill-blank" with no options array.
`

    // Adjust max_tokens based on question count to prevent truncation
    // Claude 3 Haiku has a maximum of 4096 output tokens
    const CLAUDE_HAIKU_MAX_TOKENS = 4096
    const tokensPerQuestion = 200  // Reduced from 250 to fit more questions
    const baseTokens = 500         // Reduced base tokens
    // Calculate final token allocation
    let finalMaxTokens = baseTokens + (adjustedQuestionCount * tokensPerQuestion)
    
    // If calculated tokens exceed limit, further reduce question count
    if (finalMaxTokens > CLAUDE_HAIKU_MAX_TOKENS) {
      const maxQuestionsForModel = Math.floor((CLAUDE_HAIKU_MAX_TOKENS - baseTokens) / tokensPerQuestion)
      const previousCount = adjustedQuestionCount
      adjustedQuestionCount = Math.min(adjustedQuestionCount, maxQuestionsForModel)
      finalMaxTokens = baseTokens + (adjustedQuestionCount * tokensPerQuestion)
      console.log(`Token limit exceeded: Reduced from ${previousCount} to ${adjustedQuestionCount} questions (${finalMaxTokens}/${CLAUDE_HAIKU_MAX_TOKENS} tokens)`)
    } else {
      console.log(`Token allocation OK: ${adjustedQuestionCount} questions using ${finalMaxTokens}/${CLAUDE_HAIKU_MAX_TOKENS} tokens`)
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: Math.min(finalMaxTokens, CLAUDE_HAIKU_MAX_TOKENS),
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Debug logging
    console.log(`Raw response starts with: "${responseText.substring(0, 100)}..."`)
    console.log(`Raw response ends with: "...${responseText.slice(-100)}"`)
    
    // Clean and parse the response
    let cleanedResponse = responseText.trim()
    
    // Remove any markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    // Try to fix common JSON issues
    const beforeCleanup = cleanedResponse.length
    cleanedResponse = fixJsonResponse(cleanedResponse)
    const afterCleanup = cleanedResponse.length
    
    if (beforeCleanup !== afterCleanup) {
      console.log(`Cleanup removed ${beforeCleanup - afterCleanup} characters`)
      console.log(`Cleaned response now starts with: "${cleanedResponse.substring(0, 50)}..."`)
    }

    let quizData: QuizResponse
    try {
      quizData = JSON.parse(cleanedResponse)
      console.log('✅ Successfully parsed JSON response')
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      console.error('Raw response length:', responseText.length)
      console.error('Cleaned response starts with:', cleanedResponse.substring(0, 100))
      console.error('Cleaned response ends with:', cleanedResponse.slice(-200))
      
      // Try to salvage partial response
      console.log('🔄 Attempting to salvage partial JSON...')
      const salvaged = salvagePartialJson(cleanedResponse)
      if (salvaged) {
        try {
          quizData = JSON.parse(salvaged)
          console.log('✅ Successfully salvaged partial response')
        } catch (salvageError) {
          console.error('❌ Salvage attempt also failed:', salvageError)
          throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate valid quiz format. Please try with fewer questions.'
          })
        }
      } else {
        console.error('❌ Could not salvage any valid JSON')
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to generate valid quiz format. Please try with fewer questions.'
        })
      }
    }

    // Validate the response structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid quiz format received from AI'
      })
    }

    // Define supported question types - must match frontend UI
    const SUPPORTED_QUESTION_TYPES = ['single-choice', 'multiple-choice', 'true-false', 'fill-blank']
    
    // Filter out incomplete questions and ensure all questions have required fields
    const originalCount = quizData.questions.length
    console.log(`Raw AI response contained ${originalCount} questions`)
    
    quizData.questions = quizData.questions
      .filter(q => {
        // Remove incomplete questions
        if (!q.question || !q.correctAnswers || !q.explanation) {
          console.log(`⚠️ Filtered out incomplete question: ${q.question || 'No question text'}`)
          return false
        }
        
        // Normalize and validate question type
        let normalizedType = (q as any).type || 'single-choice'
        if (normalizedType === 'fill-in-blank') {
          normalizedType = 'fill-blank'
        }
        
        // Remove questions with unsupported types
        if (!SUPPORTED_QUESTION_TYPES.includes(normalizedType)) {
          console.log(`⚠️ Filtered out unsupported question type "${(q as any).type}" (normalized: "${normalizedType}")`)
          console.log(`   Question: ${q.question?.substring(0, 50)}...`)
          return false
        }
        
        return true
      })
      .map((q, index) => {
        let options = q.options || []
        let correctAnswers = Array.isArray(q.correctAnswers) ? q.correctAnswers : [String(q.correctAnswers)]
        
        // Normalize question type (AI sometimes returns 'fill-in-blank' instead of 'fill-blank')
        let normalizedType = (q as any).type || 'single-choice'
        if (normalizedType === 'fill-in-blank') {
          normalizedType = 'fill-blank'
        }
        
        // Ensure true-false questions have proper options
        if (normalizedType === 'true-false') {
          options = ['True', 'False']
          // Normalize the correct answer for true-false questions
          if (correctAnswers.length > 0) {
            const answer = String(correctAnswers[0]).toLowerCase()
            correctAnswers = [answer === 'true' || answer === '1' ? 'True' : 'False']
          }
        }
        
        return {
          id: q.id || `q${index + 1}`,
          type: normalizedType,
          question: q.question,
          options,
          correctAnswers,
          explanation: q.explanation,
          difficulty: q.difficulty || difficulty
        }
      })
    
    const filteredCount = quizData.questions.length
    if (filteredCount < originalCount) {
      console.log(`Filtered out ${originalCount - filteredCount} incomplete/unsupported questions, ${filteredCount} remain`)
    }

    // Ensure we have at least some questions
    if (quizData.questions.length < 3) {
      throw createError({
        statusCode: 500,
        statusMessage: `Only ${quizData.questions.length} valid questions generated. Please try again with simpler content or fewer questions.`
      })
    }

    // Set metadata
    quizData.totalQuestions = quizData.questions.length
    quizData.estimatedTime = Math.ceil(quizData.questions.length * 1.5) // 1.5 minutes per question

    // Add notification if question count was automatically reduced
    const finalQuestionCount = quizData.questions.length
    console.log(`Successfully generated ${finalQuestionCount} quiz questions (requested: ${questionCount})`)
    
    // Include metadata about adjustments made
    const result = {
      ...quizData,
      metadata: {
        requestedQuestions: questionCount,
        actualQuestions: finalQuestionCount,
        contentTruncated: content.length > maxContentLength,
        questionCountAdjusted: finalQuestionCount !== questionCount
      }
    }
    
    return result

  } catch (error: any) {
    console.error('Quiz generation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate quiz'
    })
  }
})
