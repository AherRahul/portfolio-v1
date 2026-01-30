import Anthropic from '@anthropic-ai/sdk'

interface TranslationResponse {
  translatedContent: string
  translatedTitle: string
  translatedDescription: string
  language: string
}

const LANGUAGE_CODES: Record<string, string> = {
  'en': 'English',
  'hi': 'Hindi',
  'mr': 'Marathi'
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { content, title, description, targetLanguage = 'en' } = body

    if (!content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content is required for translation'
      })
    }

    const anthropicApiKey = useRuntimeConfig().anthropicApiKey
    if (!anthropicApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Anthropic API key not configured'
      })
    }

    const languageName = LANGUAGE_CODES[targetLanguage] || targetLanguage

    // If target language is English, return original content
    if (targetLanguage === 'en') {
      return {
        translatedContent: content,
        translatedTitle: title || '',
        translatedDescription: description || '',
        language: 'en'
      }
    }

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    })

    // Create a comprehensive prompt for translation with Hinglish/English-Mix style
    const languageStyle = languageName === 'Hindi' ? 'Hinglish (Hindi-English mix)' : 'English-Marathi mix'
    
    // Extract and log images from original content
    const imagesInContent = content.match(/!\[.*?\]\(https?:\/\/[^\)]+\)/g) || []
    console.log('📸 Images in original content:', imagesInContent.length)
    if (imagesInContent.length > 0) {
      console.log('First image:', imagesInContent[0])
    }
    
    const sampleImage = imagesInContent[0] || '![image](url)'
    
    const prompt = `Translate to ${languageStyle}. Indian developers understand English + ${languageName}.

⚠️ CRITICAL - DO NOT REMOVE ANYTHING:

1. IMAGES - COPY EXACTLY, DO NOT REMOVE:
   Before: ${sampleImage}
   After: ${sampleImage}  ← EXACT SAME!

2. CODE BLOCKS - Use THREE backticks:
   Before: \`\`\`javascript
           console.log("test");
           \`\`\`
   After: \`\`\`javascript
          console.log("test");
          \`\`\`  ← EXACT SAME!

3. SPACING - Keep double newlines \\n\\n between sections

4. HEADINGS - Keep ##:
   Before: ## How JavaScript Works?
   After: ## JavaScript ${languageName === 'Hindi' ? 'Kaise Kaam Karta Hai' : 'Kase Kaam Karte'}?

TRANSLATION:
- Keep technical terms in ENGLISH: JavaScript, function, browser, API, engine, etc.
- Translate explanations to ${languageName}

CONTENT:
${content}

JSON OUTPUT (escape \\n, \\"):
{"translatedTitle":"...","translatedDescription":"...","translatedContent":"..."}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Using stable Sonnet version
      max_tokens: 4096,
      temperature: 0, // Zero temperature for maximum consistency
      system: `You MUST preserve ALL markdown syntax EXACTLY. DO NOT remove images, code blocks, or any formatting. Only translate text content to ${languageStyle}. Keep ALL technical terms in English.`,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Clean and parse the response
    let cleanedResponse = responseText.trim()
    
    // Remove any prefixes like "JSON OUTPUT:"
    if (cleanedResponse.startsWith('JSON OUTPUT:')) {
      cleanedResponse = cleanedResponse.replace(/^JSON OUTPUT:\s*/, '')
    }
    
    // Remove any markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    // Fix common JSON issues: escape control characters in strings
    function fixJsonString(jsonStr: string): string {
      // First, try to find the JSON object boundaries
      const jsonStart = jsonStr.indexOf('{')
      if (jsonStart === -1) return jsonStr
      
      let fixed = jsonStr.substring(jsonStart)
      
      // First pass: fix escaped single quotes (\') which are invalid in JSON
      // Single quotes don't need escaping in JSON strings
      fixed = fixed.replace(/\\'/g, "'")
      
      // More robust approach: find string values and escape control characters
      // This handles multiline strings properly
      let result = ''
      let inString = false
      let escapeNext = false
      
      for (let i = 0; i < fixed.length; i++) {
        const char = fixed[i]
        const prevChar = i > 0 ? fixed[i - 1] : ''
        
        if (escapeNext) {
          // If we're escaping, add the character as-is
          result += char
          escapeNext = false
          continue
        }
        
        if (char === '\\') {
          result += char
          escapeNext = true
          continue
        }
        
        if (char === '"' && prevChar !== '\\') {
          inString = !inString
          result += char
          continue
        }
        
        if (inString) {
          // Escape control characters inside strings
          if (char === '\n') {
            result += '\\n'
          } else if (char === '\r') {
            result += '\\r'
          } else if (char === '\t') {
            result += '\\t'
          } else if (char === '\f') {
            result += '\\f'
          } else if (char === '\b') {
            result += '\\b'
          } else {
            result += char
          }
        } else {
          result += char
        }
      }
      
      return result
    }

    // Log what we received from AI
    console.log('📥 Received from AI:', {
      responseLength: responseText.length,
      cleanedLength: cleanedResponse.length,
      startsWithBrace: cleanedResponse.startsWith('{'),
      firstChars: cleanedResponse.substring(0, 100),
      lastChars: cleanedResponse.substring(cleanedResponse.length - 100)
    })

    let translationData: TranslationResponse
    try {
      // Try parsing directly first
      translationData = JSON.parse(cleanedResponse)
    } catch (parseError: any) {
      console.log('Initial parse failed, attempting to fix JSON...')
      
      try {
        // Try fixing the JSON
        const fixedJson = fixJsonString(cleanedResponse)
        translationData = JSON.parse(fixedJson)
        console.log('Successfully parsed after fixing JSON')
      } catch (secondError: any) {
        console.error('Failed to parse translation response after fixes:', secondError)
        console.error('Error position:', secondError.message?.match(/position (\d+)/)?.[1])
        console.error('Raw response (first 1000 chars):', responseText.substring(0, 1000))
        
        // Try to extract JSON manually using a more robust approach
        try {
          // Find the content between quotes for each field, handling multiline content
          const titleRegex = /"translatedTitle"\s*:\s*"((?:[^"\\]|\\.|\\n)*)"/
          const descRegex = /"translatedDescription"\s*:\s*"((?:[^"\\]|\\.|\\n)*)"/
          const contentRegex = /"translatedContent"\s*:\s*"((?:[^"\\]|\\.|\\n)*)"/
          
          // Alternative: find content between quotes, including newlines until closing quote
          const titleMatch = cleanedResponse.match(/"translatedTitle"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/)
          const descMatch = cleanedResponse.match(/"translatedDescription"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/)
          
          // For content, we need to handle multiline - manually parse the string value
          const contentStart = cleanedResponse.indexOf('"translatedContent"')
          let contentValue = ''
          if (contentStart !== -1) {
            // Find the opening quote after "translatedContent":
            const valueStart = cleanedResponse.indexOf('"', contentStart + 18)
            if (valueStart !== -1) {
              // Manually parse the string value, handling escaped characters
              let i = valueStart + 1
              let escaped = false
              while (i < cleanedResponse.length) {
                const char = cleanedResponse[i]
                if (escaped) {
                  if (char === 'n') {
                    contentValue += '\n'
                  } else if (char === 'r') {
                    contentValue += '\r'
                  } else if (char === 't') {
                    contentValue += '\t'
                  } else if (char === '"') {
                    contentValue += '"'
                  } else if (char === '\\') {
                    contentValue += '\\'
                  } else {
                    contentValue += char
                  }
                  escaped = false
                } else if (char === '\\') {
                  escaped = true
                } else if (char === '"') {
                  // Found closing quote
                  break
                } else {
                  contentValue += char
                }
                i++
              }
            }
          }
          
          translationData = {
            translatedTitle: titleMatch ? titleMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\') : title || '',
            translatedDescription: descMatch ? descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\') : description || '',
            translatedContent: contentValue || cleanedResponse.replace(/^[\s\S]*?"translatedContent"\s*:\s*"/, '').replace(/"\s*\}[\s\S]*$/, ''),
            language: targetLanguage
          }
          
          console.log('Extracted translation data using regex fallback')
        } catch (extractError) {
          console.error('All parsing methods failed, using raw response')
          // Last resort: use the cleaned response as content
          translationData = {
            translatedContent: cleanedResponse,
            translatedTitle: title || '',
            translatedDescription: description || '',
            language: targetLanguage
          }
        }
      }
    }

    // Validate the response
    if (!translationData.translatedContent) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid translation format received from AI'
      })
    }

    // Log what we're returning
    console.log('✅ Translation successful!')
    console.log('📊 Content stats:', {
      contentLength: translationData.translatedContent.length,
      hasImages: translationData.translatedContent.includes('!['),
      imageCount: (translationData.translatedContent.match(/!\[/g) || []).length,
      hasCodeBlocks: translationData.translatedContent.includes('```'),
      codeBlockCount: (translationData.translatedContent.match(/```/g) || []).length / 2,
      hasNewlines: translationData.translatedContent.includes('\n'),
      newlineCount: (translationData.translatedContent.match(/\n/g) || []).length,
      hasDoubleNewlines: translationData.translatedContent.includes('\n\n'),
      firstImage: translationData.translatedContent.match(/!\[.*?\]\(.*?\)/)?.[0],
      first300Chars: translationData.translatedContent.substring(0, 300),
      last300Chars: translationData.translatedContent.substring(translationData.translatedContent.length - 300)
    })
    console.log('📝 Sample of translated content (first 500 chars):')
    console.log(translationData.translatedContent.substring(0, 500))

    return {
      translatedContent: translationData.translatedContent || content,
      translatedTitle: translationData.translatedTitle || title || '',
      translatedDescription: translationData.translatedDescription || description || '',
      language: targetLanguage
    }

  } catch (error: any) {
    console.error('❌ Translation error:', error)
    console.error('Error message:', error.message)
    console.error('Error name:', error.name)
    console.error('Error stack:', error.stack)
    
    // Log Anthropic-specific errors
    if (error.status) {
      console.error('Anthropic API Status:', error.status)
      console.error('Anthropic API Error:', error.error)
    }
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to translate content',
      message: error.message || 'Failed to translate content'
    })
  }
})

