import Anthropic from '@anthropic-ai/sdk'
import {
    buildRequirementsPrompt,
    buildEntitiesPrompt,
    buildClassesPrompt,
    buildCodePrompt,
    buildArchitecturePrompt,
    buildDeepDivePrompt,
    buildScalingPrompt
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
            default:
                throw createError({ statusCode: 400, statusMessage: `Unknown stepId: ${body.stepId}` })
        }

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 8192,
            messages: [{ role: 'user', content: prompt }]
        })

        const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

        let result: StepEvalResponse
        try {
            const cleaned = healJson(rawText)
            result = JSON.parse(cleaned)
        } catch (e) {
            console.error('Step Eval JSON parse failed:', e, rawText)
            throw createError({ statusCode: 500, statusMessage: 'Failed to parse AI step evaluation response' })
        }

        return result

    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, statusMessage: 'Step evaluation failed: ' + (error.message || 'Unknown error') })
    }
})
