"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
// Helper function to create consistent response headers
function createHeaders(additionalHeaders = {}) {
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        ...additionalHeaders
    };
}
const handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: createHeaders(),
            body: JSON.stringify({ message: 'Method Not Allowed' })
        };
    }
    try {
        const body = JSON.parse(event.body || '{}');
        const { content, topicTitle, summaryType = 'comprehensive' } = body;
        if (!content || !topicTitle) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Content and topic title are required' })
            };
        }
        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        if (!anthropicApiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Anthropic API key not configured' })
            };
        }
        const anthropic = new sdk_1.default({
            apiKey: anthropicApiKey,
        });
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
`;
        // console.log('Making API call to Anthropic...');
        const message = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 3000,
            temperature: 0.7,
            messages: [{
                    role: 'user',
                    content: prompt
                }]
        });
        // console.log('API call successful, processing response...');
        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        // Clean and parse the response
        let cleanedResponse = responseText.trim();
        // Remove any markdown code blocks if present
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        }
        else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        let summaryData;
        try {
            summaryData = JSON.parse(cleanedResponse);
        }
        catch (parseError) {
            console.error('Failed to parse AI summary response:', parseError);
            console.error('Raw response:', responseText);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Failed to generate valid summary format' })
            };
        }
        // Validate the response structure
        if (!summaryData.summary || !Array.isArray(summaryData.keyPoints)) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Invalid summary format received from AI' })
            };
        }
        // Ensure all required fields exist with defaults
        summaryData = {
            summary: summaryData.summary || 'Summary not available',
            keyPoints: summaryData.keyPoints || [],
            concepts: summaryData.concepts || [],
            takeaways: summaryData.takeaways || [],
            estimatedReadTime: summaryData.estimatedReadTime || 3
        };
        return {
            statusCode: 200,
            headers: createHeaders(),
            body: JSON.stringify(summaryData)
        };
    }
    catch (error) {
        console.error('Summary generation error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            status: error.status,
            statusCode: error.statusCode
        });
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
            };
        }
        if (error.status === 401 || error.message?.includes('authentication') || error.message?.includes('API key')) {
            return {
                statusCode: 500,
                headers: createHeaders(),
                body: JSON.stringify({
                    message: 'Authentication failed - API key may be invalid',
                    error: error.message
                })
            };
        }
        if (error.status === 429) {
            return {
                statusCode: 429,
                headers: createHeaders(),
                body: JSON.stringify({
                    message: 'Rate limit exceeded - please try again later',
                    error: error.message
                })
            };
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
        };
    }
};
exports.handler = handler;
