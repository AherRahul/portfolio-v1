import Anthropic from '@anthropic-ai/sdk'
import {
    buildRequirementsPrompt,
    buildEntitiesPrompt,
    buildClassesPrompt,
    buildCodePrompt,
    buildArchitecturePrompt,
    buildDeepDivePrompt,
    buildScalingPrompt,
    buildApiDesignPrompt,
    buildDatabaseDesignPrompt,
    buildAnalyticsPrompt
} from '../../utils/systemDesignPrompts'
import { healJson } from '../../utils/jsonHealer'

export interface StepEvalRequest {
    questionTitle: string
    questionDescription: string
    designType: 'LLD' | 'HLD' | 'Both'
    difficulty: string
    language?: string
    stepId: string
    stepData: unknown
}

export interface Metric {
    label: string
    score: number
    maxScore: number
    feedback: string
    strengths: string[]
    gaps: string[]
}

export interface StepEvalResponse {
    score: number          // 0–10
    maxScore: number       // always 10
    passing: boolean       // score >= 6
    feedback: string       // brief summary feedback
    whatWentWell: string[]
    improvements: string[]
    modelAnswer: string
    metrics?: Metric[]
}

// ── Route handler ─────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event) as StepEvalRequest

        if (!body.questionTitle || !body.stepId || body.stepData === undefined) {
            throw createError({ statusCode: 400, statusMessage: 'questionTitle, stepId, and stepData are required' })
        }

        const anthropicApiKey = useRuntimeConfig().anthropicApiKey
        if (!anthropicApiKey) {
            throw createError({ statusCode: 500, statusMessage: 'AI service not configured' })
        }

        const anthropic = new Anthropic({ apiKey: anthropicApiKey })

        // Pick the right prompt for this specific step
        let prompt: string
        const d = body.stepData as any
        switch (body.stepId) {
            case 'requirements': prompt = buildRequirementsPrompt(body, d); break
            case 'entities': prompt = buildEntitiesPrompt(body, d); break
            case 'classes': prompt = buildClassesPrompt(body, d); break
            case 'code': prompt = buildCodePrompt(body, d); break
            case 'architecture': prompt = buildArchitecturePrompt(body, d as string); break
            case 'deep-dive': prompt = buildDeepDivePrompt(body, d as string); break
            case 'scaling': prompt = buildScalingPrompt(body, d as string); break
            case 'api': prompt = buildApiDesignPrompt(body, d); break
            case 'database': prompt = buildDatabaseDesignPrompt(body, d); break
            case 'analytics': prompt = buildAnalyticsPrompt(body, d as string); break
            default:
                throw createError({ statusCode: 400, statusMessage: `Unknown stepId: ${body.stepId}` })
        }

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No preamble, no explanation.' }]
        })

        const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

        let result: StepEvalResponse
        try {
            if (!rawText || rawText.trim().length === 0) {
                throw new Error('AI returned an empty response')
            }
            const cleaned = healJson(rawText)
            try {
                result = JSON.parse(cleaned)
            } catch (innerError) {
                // If standard parse fails, try one last ultra-aggressive fix: 
                // Sometimes AI returns escaped quotes for no reason
                const unescaped = cleaned.replace(/\\"/g, '"').replace(/\\n/g, '\n')
                if (unescaped.includes('"score"')) {
                    result = JSON.parse(healJson(unescaped))
                } else {
                    throw innerError
                }
            }
        } catch (e: any) {
            console.error('Step Eval JSON parse failed:', e, rawText)
            const snippet = rawText.length > 200 ? rawText.substring(0, 200) + '...' : rawText
            throw createError({
                statusCode: 500,
                statusMessage: `Failed to parse AI response: ${e.message}. Status: Please try again or check the requirements complexity.`
            })
        }

        return result

    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, statusMessage: 'Step evaluation failed: ' + (error.message || 'Unknown error') })
    }
})
