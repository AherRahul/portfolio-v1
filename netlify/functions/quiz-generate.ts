import type { Handler } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

interface QuizQuestion {
  id: string
  type: 'single-choice' | 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer'
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

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { content, topicTitle, difficulty = 'medium', questionCount = 10 } = body

    if (!content || !topicTitle) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Content and topic title are required' })
      }
    }

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return {
        statusCode: 500,
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

Requirements:
1. Create exactly ${questionCount} questions
2. Mix different question types: single-choice, multiple-choice, true-false, fill-blank, and short-answer
3. Difficulty level: ${difficulty}
4. Include clear explanations for each answer
5. Ensure questions test understanding, not just memorization

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
      "difficulty": "medium"
    },
    {
      "id": "q2", 
      "type": "true-false",
      "question": "Statement to evaluate",
      "options": ["True", "False"],
      "correctAnswers": [true],
      "explanation": "Explanation...",
      "difficulty": "medium"
    },
    {
      "id": "q3",
      "type": "multiple-choice",
      "question": "Question allowing multiple correct answers?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswers": ["Option A", "Option C"],
      "explanation": "Explanation...",
      "difficulty": "medium"
    },
    {
      "id": "q4",
      "type": "fill-blank", 
      "question": "Complete this sentence: The main concept is ______.",
      "correctAnswers": ["expected answer"],
      "explanation": "Explanation...",
      "difficulty": "medium"
    },
    {
      "id": "q5",
      "type": "short-answer",
      "question": "Explain the key concept in 2-3 sentences.",
      "correctAnswers": ["Sample expected answer focusing on key points"],
      "explanation": "Explanation...",
      "difficulty": "medium"
    }
  ],
  "totalQuestions": ${questionCount},
  "estimatedTime": 10
}

Important: 
- For single-choice: correctAnswers array should contain exactly one option
- For multiple-choice: correctAnswers array can contain multiple options
- For true-false: correctAnswers should be [true] or [false]
- For fill-blank and short-answer: correctAnswers should contain expected answers
- All questions must be directly related to the provided content
- Ensure JSON is valid and properly formatted
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

    // Ensure all questions have required fields
    quizData.questions = quizData.questions.map((q, index) => ({
      id: q.id || `q${index + 1}`,
      type: q.type || 'single-choice',
      question: q.question || 'Question not provided',
      options: q.options || [],
      correctAnswers: q.correctAnswers || [],
      explanation: q.explanation || 'No explanation provided',
      difficulty: q.difficulty || difficulty
    }))

    // Set metadata
    quizData.totalQuestions = quizData.questions.length
    quizData.estimatedTime = Math.ceil(quizData.questions.length * 2) // 2 minutes per question

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          message: 'Authentication failed - API key may be invalid',
          error: error.message 
        })
      }
    }
    
    if (error.status === 429) {
      return {
        statusCode: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
