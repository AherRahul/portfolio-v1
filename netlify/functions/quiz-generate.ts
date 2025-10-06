import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

interface QuizQuestion {
  id: string
  type: 'single-choice' | 'multiple-choice' | 'true-false' | 'fill-blank' // Only supported types
  question: string
  options?: string[]
  correctAnswers: string[] | boolean[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface QuizResponse {
  questions: QuizQuestion[]
  totalQuestions: number
  estimatedTime: number
}

// Helper function to create consistent response headers
function createHeaders(additionalHeaders: Record<string, string> = {}) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...additionalHeaders
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: createHeaders(),
      body: JSON.stringify({ message: 'Method Not Allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { content, topicTitle, difficulty = 'medium', questionCount = 10 } = body

    if (!content || !topicTitle) {
      return {
        statusCode: 400,
        headers: createHeaders(),
        body: JSON.stringify({ message: 'Content and topic title are required' })
      }
    }

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return {
        statusCode: 500,
        headers: createHeaders(),
        body: JSON.stringify({ message: 'Anthropic API key not configured' })
      }
    }

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    })

    const prompt = `
You are an expert educational content creator. Based on the following topic content, create ${questionCount} diverse quiz questions.

Topic: ${topicTitle}

Content:
${content}

CRITICAL REQUIREMENTS:
1. Create exactly ${questionCount} questions
2. Use ONLY these 4 question types:
   - "single-choice": One correct answer from multiple options
   - "multiple-choice": Multiple correct answers from options
   - "true-false": Boolean statement with ["True", "False"] options
   - "fill-blank": Fill in missing word/phrase (no options array)
3. DO NOT use any other question types (NO short-answer, essay, or other types)
4. Difficulty level: ${difficulty}
5. Include clear, simple explanations for each answer
6. Ensure questions test understanding, not just memorization

Return ONLY a valid JSON object with this exact structure:
{
  "questions": [
    {
      "id": "q1",
      "type": "single-choice",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswers": ["Option A"],
      "explanation": "Detailed explanation of why this is correct...",
      "difficulty": "${difficulty}"
    },
    {
      "id": "q2", 
      "type": "true-false",
      "question": "Statement to evaluate",
      "options": ["True", "False"],
      "correctAnswers": ["True"],
      "explanation": "Explanation...",
      "difficulty": "${difficulty}"
    },
    {
      "id": "q3",
      "type": "multiple-choice",
      "question": "Question allowing multiple correct answers?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswers": ["Option A", "Option C"],
      "explanation": "Explanation...",
      "difficulty": "${difficulty}"
    },
    {
      "id": "q4",
      "type": "fill-blank", 
      "question": "Complete this sentence: The main concept is ______.",
      "correctAnswers": ["expected answer"],
      "explanation": "Explanation...",
      "difficulty": "${difficulty}"
    }
  ],
  "totalQuestions": ${questionCount},
  "estimatedTime": ${Math.ceil(questionCount * 1.5)}
}

Important formatting rules: 
- For single-choice: correctAnswers array must contain exactly one option from the options array
- For multiple-choice: correctAnswers array must contain 2+ options from the options array
- For true-false: options must be ["True", "False"] and correctAnswers must be ["True"] or ["False"]
- For fill-blank: NO options array, only correctAnswers with expected text answers
- All questions must be directly related to the provided content
- Ensure JSON is valid and properly formatted
- Mix question types evenly across the quiz
`

    console.log('Making API call to Anthropic...')
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
    console.log('API call successful, processing response...')

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Clean and parse the response
    let cleanedResponse = responseText.trim()
    
    // Remove any markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    let quizData: QuizResponse
    try {
      quizData = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw response:', responseText)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to generate valid quiz format' })
      }
    }

    // Validate the response structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Invalid quiz format received from AI' })
      }
    }

    // Define supported question types - must match frontend UI
    const SUPPORTED_QUESTION_TYPES = ['single-choice', 'multiple-choice', 'true-false', 'fill-blank']
    
    // Filter out unsupported question types and ensure all questions have required fields
    const originalCount = quizData.questions.length
    quizData.questions = quizData.questions
      .filter(q => {
        // Normalize question type
        let normalizedType = (q as any).type || 'single-choice'
        if (normalizedType === 'fill-in-blank') {
          normalizedType = 'fill-blank'
        }
        
        // Remove questions with unsupported types (like short-answer)
        if (!SUPPORTED_QUESTION_TYPES.includes(normalizedType)) {
          console.log(`⚠️ Filtered out unsupported question type: ${(q as any).type}`)
          return false
        }
        
        // Remove incomplete questions
        if (!q.question || !q.correctAnswers || !q.explanation) {
          console.log(`⚠️ Filtered out incomplete question`)
          return false
        }
        
        return true
      })
      .map((q, index) => {
        // Normalize question type
        let normalizedType = (q as any).type || 'single-choice'
        if (normalizedType === 'fill-in-blank') {
          normalizedType = 'fill-blank'
        }
        
        return {
          id: q.id || `q${index + 1}`,
          type: normalizedType,
          question: q.question || 'Question not provided',
          options: q.options || [],
          correctAnswers: q.correctAnswers || [],
          explanation: q.explanation || 'No explanation provided',
          difficulty: q.difficulty || difficulty
        }
      })
    
    const filteredCount = quizData.questions.length
    if (filteredCount < originalCount) {
      console.log(`Filtered out ${originalCount - filteredCount} unsupported/incomplete questions, ${filteredCount} remain`)
    }

    // Set metadata
    quizData.totalQuestions = quizData.questions.length
    quizData.estimatedTime = Math.ceil(quizData.questions.length * 2) // 2 minutes per question

    return {
      statusCode: 200,
      headers: createHeaders(),
      body: JSON.stringify(quizData)
    }

  } catch (error: any) {
    console.error('Quiz generation error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      status: error.status,
      statusCode: error.statusCode
    })
    
    // Handle specific Anthropic API errors
    if (error.status === 400) {
      return {
        statusCode: 400,
        headers: createHeaders(),
        body: JSON.stringify({ 
          message: 'Bad request to Anthropic API',
          error: error.message,
          details: 'The request format or content may be invalid'
        })
      }
    }
    
    if (error.status === 401 || error.message?.includes('authentication') || error.message?.includes('API key')) {
      return {
        statusCode: 500,
        headers: createHeaders(),
        body: JSON.stringify({ 
          message: 'Authentication failed - API key may be invalid',
          error: error.message 
        })
      }
    }
    
    if (error.status === 429) {
      return {
        statusCode: 429,
        headers: createHeaders(),
        body: JSON.stringify({ 
          message: 'Rate limit exceeded - please try again later',
          error: error.message 
        })
      }
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: 'Failed to generate quiz',
        error: error.message,
        errorType: error.name,
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        anthropicStatus: error.status || 'unknown'
      })
    }
  }
}
