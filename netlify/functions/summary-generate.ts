import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

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

interface SummaryResponse {
  summary: string
  keyPoints: string[]
  concepts: string[]
  takeaways: string[]
  estimatedReadTime: number
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
    const { content, topicTitle, summaryType = 'comprehensive' } = body

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
You are an expert educator creating study notes for students. Based on the following topic content, create comprehensive, student-friendly notes.

Topic: ${topicTitle}

Content:
${content}

Create detailed, easy-to-understand notes with the following structure. Return ONLY a valid JSON object:

{
  "summary": "A friendly 2-3 paragraph summary that explains what this topic is about, why it matters, and what students will learn. Use simple, conversational language that any student can understand.",
  "keyPoints": [
    "Detailed explanation of the first important concept with examples (2-3 sentences each)",
    "Second major idea explained in simple terms with real-world connections",
    "Third key concept broken down step-by-step in an easy way",
    "Fourth important point with practical examples students can relate to",
    "Fifth main idea with clear, simple explanations",
    "Sixth concept explained like you're teaching a friend",
    "Seventh point with helpful examples and context"
  ],
  "concepts": [
    "Technical Term 1: Simple definition in plain English with an analogy or example",
    "Important Concept 2: What it means in everyday language, how it works",
    "Key Term 3: Easy explanation with practical use case",
    "Core Idea 4: Break it down simply, relate to something familiar",
    "Definition 5: Explain like teaching a beginner, include why it's important"
  ],
  "takeaways": [
    "Quick action students can take right away to apply this knowledge",
    "Simple tip or trick to remember this topic better",
    "Common mistake to watch out for, explained simply",
    "How this topic connects to other things they might know",
    "One sentence summary of why this topic is useful in real life"
  ],
  "estimatedReadTime": 3
}

CRITICAL REQUIREMENTS:
1. Summary: Write 150-200 words in simple, friendly language. Avoid jargon. Explain like teaching a classmate.
2. Key Points: Create 6-8 detailed points (2-3 sentences each). Focus on main concepts with clear examples.
   - Each point should be detailed and explanatory
   - Use simple words and short sentences
   - Include "how" and "why" explanations
   - Add relatable examples
3. Concepts: List 5-7 important terms/ideas with student-friendly definitions
   - Define in simple, everyday language
   - Avoid technical jargon or explain it clearly
   - Add analogies, examples, or use cases
   - Make it relatable to students' experiences
4. Takeaways: Provide 4-6 practical, actionable insights
   - Different from key points - these are about application and memory
   - Include study tips, practical uses, and connections
   - Keep them short (1-2 sentences) but actionable
5. Use conversational, encouraging tone throughout
6. Avoid complex vocabulary - use high school level English
7. Ensure JSON is valid and properly formatted

Important: Key Points should be DIFFERENT from Takeaways:
- Key Points = detailed content explanations (what to learn)
- Takeaways = practical applications and study tips (how to use/remember it)

Return ONLY the JSON object, no additional text or formatting.
`

    console.log('Making API call to Anthropic...')
    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 3000,
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

    let summaryData: SummaryResponse
    try {
      summaryData = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI summary response:', parseError)
      console.error('Raw response:', responseText)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to generate valid summary format' })
      }
    }

    // Validate the response structure
    if (!summaryData.summary || !Array.isArray(summaryData.keyPoints)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Invalid summary format received from AI' })
      }
    }

    // Ensure all required fields exist with defaults
    summaryData = {
      summary: summaryData.summary || 'Summary not available',
      keyPoints: summaryData.keyPoints || [],
      concepts: summaryData.concepts || [],
      takeaways: summaryData.takeaways || [],
      estimatedReadTime: summaryData.estimatedReadTime || 3
    }

    return {
      statusCode: 200,
      headers: createHeaders(),
      body: JSON.stringify(summaryData)
    }

  } catch (error: any) {
    console.error('Summary generation error:', error)
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
          headers: createHeaders(),
      body: JSON.stringify({ 
        message: 'Failed to generate summary',
        error: error.message,
        errorType: error.name,
        hasApiKey: !!process.env.ANTHROPIC_API_KEY,
        anthropicStatus: error.status || 'unknown'
      })
    }
  }
}
