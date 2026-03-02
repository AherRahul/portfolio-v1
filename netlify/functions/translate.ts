import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'
import { createHash } from 'node:crypto'

// ── Helpers ─────────────────────────────────────────────────────────────────

function createHeaders(extra: Record<string, string> = {}) {
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        ...extra
    }
}

interface TranslationResponse {
    translatedContent: string
    translatedTitle: string
    translatedDescription: string
    language: string
}

// ── In-memory cache (shared across warm Lambda invocations) ──────────────────
const translationCache = new Map<string, TranslationResponse>()

function cacheKey(content: string, lang: string): string {
    return createHash('md5').update(content + lang).digest('hex')
}

// ── Placeholder strategy ─────────────────────────────────────────────────────
// Extract code fences, HTML blocks, and images before sending to AI.
// After translation, restore them at the exact same positions.

function extractBlocks(raw: string): { cleaned: string; blocks: string[] } {
    const blocks: string[] = []
    let text = raw

    // 1. Code fences (``` ... ```)
    text = text.replace(/(`{3,}[\s\S]*?`{3,})/g, (match) => {
        const idx = blocks.length
        blocks.push(match)
        return `[[BLOCK_${idx}]]`
    })

    // 2. Block-level HTML elements (interactive visualizations, tables, etc.)
    text = text.replace(
        /(<(?:div|table|figure|section|article|aside|header|footer|nav|main|ul|ol)[^>]*>[\s\S]*?<\/(?:div|table|figure|section|article|aside|header|footer|nav|main|ul|ol)>)/gi,
        (match) => {
            const idx = blocks.length
            blocks.push(match)
            return `[[BLOCK_${idx}]]`
        }
    )

    // 3. Markdown images  ![alt](url)
    text = text.replace(/(!\[[^\]]*\]\([^)]+\))/g, (match) => {
        const idx = blocks.length
        blocks.push(match)
        return `[[BLOCK_${idx}]]`
    })

    text = text.replace(/\n{3,}/g, '\n\n')
    return { cleaned: text.trim(), blocks }
}

function restoreBlocks(translated: string, blocks: string[]): string {
    return translated.replace(/\[\[BLOCK_(\d+)\]\]/g, (_m, idx) => blocks[parseInt(idx)] ?? _m)
}

// ── Handler ──────────────────────────────────────────────────────────────────

export const handler: Handler = async (event: HandlerEvent, _ctx: HandlerContext) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: createHeaders() }
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: createHeaders(),
            body: JSON.stringify({ message: 'Method Not Allowed' })
        }
    }

    try {
        const body = JSON.parse(event.body || '{}')
        const { content, title = '', description = '', targetLanguage = 'hi' } = body

        if (!content) {
            return {
                statusCode: 400,
                headers: createHeaders(),
                body: JSON.stringify({ message: 'content is required' })
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

        // Passthrough for English
        if (targetLanguage === 'en') {
            const res: TranslationResponse = {
                translatedContent: content,
                translatedTitle: title,
                translatedDescription: description,
                language: 'en'
            }
            return { statusCode: 200, headers: createHeaders(), body: JSON.stringify(res) }
        }

        // ── Cache check ──────────────────────────────────────────────────────────
        const key = cacheKey(content, targetLanguage)
        const cached = translationCache.get(key)
        if (cached) {
            console.log(`[translate] Cache HIT ${key.slice(-8)} (${targetLanguage})`)
            return { statusCode: 200, headers: createHeaders(), body: JSON.stringify(cached) }
        }
        console.log(`[translate] Cache MISS ${key.slice(-8)} — calling AI`)

        // ── Placeholder extraction ───────────────────────────────────────────────
        const { cleaned, blocks } = extractBlocks(content)
        if (!cleaned) {
            return {
                statusCode: 400,
                headers: createHeaders(),
                body: JSON.stringify({ message: 'No translatable content after preprocessing' })
            }
        }

        // ── Build prompt ─────────────────────────────────────────────────────────
        const languageStyle = targetLanguage === 'hi'
            ? 'Hinglish (Hindi-English mix)'
            : 'English-Marathi mix'

        const prompt = `Translate to ${languageStyle}. Indian developers understand English + local language.

⚠️ CRITICAL RULES:
1. ONLY translate plain text content. Keep all markdown syntax EXACTLY as-is.
2. Keep all technical terms in English (array, function, pointer, Big-O, etc.).
3. ANY token like [[BLOCK_0]], [[BLOCK_1]] etc. — copy EXACTLY, never translate or remove.
4. Keep ALL markdown headings (##, ###), bold (**), italic (*), lists (-, 1.) unchanged.
5. Do NOT add or remove any lines.

CONTENT TO TRANSLATE:
Title: ${title}
Description: ${description}

Content:
${cleaned}

Return ONLY valid JSON:
{"translatedTitle":"...","translatedDescription":"...","translatedContent":"..."}`

        // ── Anthropic API call ────────────────────────────────────────────────────
        const anthropic = new Anthropic({ apiKey: anthropicApiKey })

        const message = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 4096,
            temperature: 0,
            system: `You MUST preserve ALL markdown syntax EXACTLY. NEVER remove or modify [[BLOCK_N]] tokens. Only translate plain text to ${languageStyle}. Keep ALL technical terms in English.`,
            messages: [{ role: 'user', content: prompt }]
        })

        const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

        // ── Parse response ────────────────────────────────────────────────────────
        let translationData: TranslationResponse
        try {
            let cleaned2 = responseText.trim()
            if (cleaned2.startsWith('```json')) cleaned2 = cleaned2.replace(/^```json\s*/, '').replace(/\s*```$/, '')
            else if (cleaned2.startsWith('```')) cleaned2 = cleaned2.replace(/^```\s*/, '').replace(/\s*```$/, '')

            const parsed = JSON.parse(cleaned2)
            translationData = {
                translatedTitle: parsed.translatedTitle || title,
                translatedDescription: parsed.translatedDescription || description,
                translatedContent: parsed.translatedContent || cleaned2,
                language: targetLanguage
            }
        } catch {
            // Fallback: try regex extraction for translatedContent
            const contentMatch = responseText.match(/"translatedContent"\s*:\s*"([\s\S]*?)"(?:\s*[},])/)
            translationData = {
                translatedContent: contentMatch ? contentMatch[1].replace(/\\n/g, '\n') : responseText,
                translatedTitle: title,
                translatedDescription: description,
                language: targetLanguage
            }
        }

        if (!translationData.translatedContent || translationData.translatedContent.trim().length < 10) {
            return {
                statusCode: 500,
                headers: createHeaders(),
                body: JSON.stringify({ message: 'Empty or invalid translation received, please try again.' })
            }
        }

        // ── Restore preserved blocks ──────────────────────────────────────────────
        translationData.translatedContent = restoreBlocks(translationData.translatedContent, blocks)

        // ── Store in cache ────────────────────────────────────────────────────────
        translationCache.set(key, translationData)
        console.log(`[translate] Cached result ${key.slice(-8)}`)

        return {
            statusCode: 200,
            headers: createHeaders(),
            body: JSON.stringify(translationData)
        }

    } catch (error: any) {
        console.error('Translation error:', error.message)

        if (error.status === 400) {
            return {
                statusCode: 400,
                headers: createHeaders(),
                body: JSON.stringify({ message: 'Bad request to Anthropic API', error: error.message })
            }
        }
        if (error.status === 401 || error.message?.includes('API key')) {
            return {
                statusCode: 500,
                headers: createHeaders(),
                body: JSON.stringify({ message: 'Authentication failed — check ANTHROPIC_API_KEY', error: error.message })
            }
        }
        if (error.status === 429) {
            return {
                statusCode: 429,
                headers: createHeaders(),
                body: JSON.stringify({ message: 'Rate limit exceeded — please try again later', error: error.message })
            }
        }

        return {
            statusCode: 500,
            headers: createHeaders(),
            body: JSON.stringify({
                message: 'Failed to translate content',
                error: error.message,
                anthropicStatus: error.status || 'unknown'
            })
        }
    }
}
