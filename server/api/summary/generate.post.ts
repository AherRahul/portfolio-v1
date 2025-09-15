import Anthropic from '@anthropic-ai/sdk'

interface SummaryResponse {
  summary: string
  keyPoints: string[]
  concepts: string[]
  takeaways: string[]
  estimatedReadTime: number
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { content, topicTitle, summaryType = 'comprehensive' } = body

    if (!content || !topicTitle) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content and topic title are required'
      })
    }

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

    const prompt = `
You are an expert educational content analyst. Based on the following topic content, create a comprehensive summary with structured notes.

Topic: ${topicTitle}

Content:
${content}

Create a detailed summary with the following structure. Return ONLY a valid JSON object:

{
  "summary": "A comprehensive 2-3 paragraph summary that captures the main essence of the topic and its importance",
  "keyPoints": [
    "First key point explained in detail",
    "Second key point with practical implications",
    "Third key point with real-world applications",
    "Fourth key point covering important concepts",
    "Fifth key point about best practices"
  ],
  "concepts": [
    "Core concept 1 with brief explanation",
    "Core concept 2 with definition",
    "Core concept 3 with context",
    "Core concept 4 with examples"
  ],
  "takeaways": [
    "Practical takeaway for immediate application",
    "Strategic insight for long-term understanding",
    "Common pitfall to avoid",
    "Best practice recommendation"
  ],
  "estimatedReadTime": 3
}

Requirements:
1. Summary should be engaging and comprehensive (150-200 words)
2. Key points should be detailed and actionable (5-7 points)
3. Concepts should cover technical terms and definitions (4-6 items)
4. Takeaways should be practical and implementable (3-5 items)
5. Estimate reading time in minutes
6. Focus on practical understanding and application
7. Use clear, professional language
8. Ensure JSON is valid and properly formatted

Important: Return ONLY the JSON object, no additional text or formatting.
`

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 3000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

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
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to generate valid summary format'
      })
    }

    // Validate the response structure
    if (!summaryData.summary || !Array.isArray(summaryData.keyPoints)) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid summary format received from AI'
      })
    }

    // Ensure all required fields exist with defaults
    summaryData = {
      summary: summaryData.summary || 'Summary not available',
      keyPoints: summaryData.keyPoints || [],
      concepts: summaryData.concepts || [],
      takeaways: summaryData.takeaways || [],
      estimatedReadTime: summaryData.estimatedReadTime || 3
    }

    return summaryData

  } catch (error: any) {
    console.error('Summary generation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate summary'
    })
  }
})
