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

interface EvaluationRequest {
    questionTitle: string
    questionDescription: string
    designType: 'LLD' | 'HLD' | 'Both'
    difficulty: string
    language?: string
    answers: {
        requirements?: { functional: string[]; nonFunctional: string[] }
        entities?: { name: string; description: string }[]
        classes?: {
            classes: { type: string; name: string }[]
            relationships: { from: string; to: string; relType: string }[]
            patterns: string[]
        }
        code?: string
        architecture?: string
        deepDive?: string
        scaling?: string
    }
}

interface ScoreBreakdown {
    section: string
    score: number
    maxScore: number
    feedback: string
    improvements: string[]
}

interface EvaluationResponse {
    totalScore: number
    maxScore: number
    grade: string
    summary: string
    breakdown: ScoreBreakdown[]
    modelSolution: {
        title: string
        sections: { heading: string; content: string }[]
    }
    keyTakeaways: string[]
}

function gradeFromPct(pct: number): string {
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B'
    if (pct >= 60) return 'C'
    if (pct >= 50) return 'D'
    return 'F'
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event) as EvaluationRequest

        if (!body.questionTitle || !body.answers) {
            throw createError({ statusCode: 400, statusMessage: 'Question and answers are required' })
        }

        const anthropicApiKey = useRuntimeConfig().anthropicApiKey
        if (!anthropicApiKey) {
            throw createError({ statusCode: 500, statusMessage: 'AI service not configured' })
        }

        const anthropic = new Anthropic({ apiKey: anthropicApiKey })
        const isLLD = body.designType === 'LLD' || body.designType === 'Both'
        const { answers: a } = body

        type SectionCfg = {
            key: string
            label: string
            data: unknown
            skip: boolean
        }

        const sections: SectionCfg[] = isLLD
            ? [
                { key: 'requirements', label: 'Requirements Gathering', data: a.requirements || {}, skip: !a.requirements || (!a.requirements.functional?.length && !a.requirements.nonFunctional?.length) },
                { key: 'entities', label: 'Core Entity Identification', data: a.entities || [], skip: !a.entities?.length },
                { key: 'classes', label: 'Class Design & OOP', data: a.classes || {}, skip: !a.classes?.classes?.length },
                { key: 'code', label: 'Code Implementation', data: { language: body.language || 'Code', code: a.code || '' }, skip: !a.code || a.code.includes('Implement your') || a.code.split('\n').length < 5 },
            ]
            : [
                { key: 'requirements', label: 'Requirements & Scope', data: a.requirements || {}, skip: !a.requirements || (!a.requirements.functional?.length && !a.requirements.nonFunctional?.length) },
                { key: 'architecture', label: 'High-Level Architecture', data: a.architecture || '', skip: !a.architecture?.trim() },
                { key: 'deep-dive', label: 'Deep Dive Key Components', data: a.deepDive || '', skip: !a.deepDive?.trim() },
                { key: 'scaling', label: 'Scaling & Bottlenecks', data: a.scaling || '', skip: !a.scaling?.trim() },
            ]

        const sectionResults = await Promise.all(
            sections.map(async (sec): Promise<ScoreBreakdown> => {
                if (sec.skip) {
                    return { section: sec.label, score: 0, maxScore: 10, feedback: 'Section was skipped or left empty.', improvements: ['Complete this section to earn points.'] }
                }

                // Call the specific step evaluator prompt
                let prompt = ''
                const qBody = { ...body, stepId: sec.key, stepData: sec.data } as any
                switch (sec.key) {
                    case 'requirements': prompt = buildRequirementsPrompt(qBody, sec.data); break
                    case 'entities': prompt = buildEntitiesPrompt(qBody, sec.data); break
                    case 'classes': prompt = buildClassesPrompt(qBody, sec.data); break
                    case 'code': prompt = buildCodePrompt(qBody, sec.data); break
                    case 'architecture': prompt = buildArchitecturePrompt(qBody, sec.data as string); break
                    case 'deep-dive': prompt = buildDeepDivePrompt(qBody, sec.data as string); break
                    case 'scaling': prompt = buildScalingPrompt(qBody, sec.data as string); break
                }

                try {
                    const msg = await anthropic.messages.create({
                        model: 'claude-sonnet-4-6',
                        max_tokens: 4096,
                        messages: [{ role: 'user', content: prompt }],
                    })

                    const raw = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
                    const cleaned = healJson(raw)
                    const parsed = JSON.parse(cleaned)
                    return {
                        section: sec.label,
                        score: Number(parsed.score) || 0,
                        maxScore: 10,
                        feedback: parsed.feedback || '',
                        improvements: parsed.improvements || [],
                    }
                } catch (e) {
                    console.error('Final Eval Section Error:', sec.key, e)
                    return { section: sec.label, score: 0, maxScore: 10, feedback: 'Evaluation failed for this section.', improvements: [] }
                }
            })
        )

        const totalMax = sectionResults.length * 10
        const totalScore = sectionResults.reduce((s, r) => s + r.score, 0)
        const grade = gradeFromPct((totalScore / totalMax) * 100)

        // ── Final holistic summary + model solution via single prompt ─────────
        const summaryPrompt = `You are a world-class engineering interviewer. Summarize this candidate's overall performance and provide a MASTERPIECE model solution.

**Problem:** "${body.questionTitle}" (${body.designType}, ${body.difficulty})

**Section Scores:**
${sectionResults.map(r => `- ${r.section}: ${r.score}/${r.maxScore} — ${r.feedback}`).join('\n')}

**Overall Assessment:** ${totalScore}/${totalMax} (${grade})

**Requirements for Model Solution:**
1. ${isLLD ? `Provide a COMPLETE, production-ready implementation. 
   - **MANDATORY**: Group code by class/interface.
   - For EACH class, provide a markdown sub-heading (e.g., "### Class: ParkingManager") followed immediately by its code block. 
   - DO NOT concatenate all code into one block.
   - DO NOT use horizontal lines (---) anywhere in the report.` : `Provide a comprehensive architecture breakdown. 
   - Use clear markdown sub-headings for different components.
   - DO NOT use horizontal lines (---) anywhere in the report.`}
2. Use the ${body.language || 'specified'} programming language for all code.
3. Include brief justifications for key design patterns or technology choices.
4. Ensure all content is formatted in clean Markdown.

Respond with ONLY valid JSON:
{
  "summary": "<3-sentence holistic assessment of the candidate's solution strength and biggest gap>",
  "modelSolution": {
    "title": "Masterpiece Solution: ${body.questionTitle}",
    "sections": [
      { "heading": "${isLLD ? 'Architectural Patterns' : 'High-Level Architecture'}", "content": "..." },
      { "heading": "${isLLD ? 'Detailed Implementation' : 'Data Schema & API Design'}", "content": "..." },
      { "heading": "Critical Design Considerations", "content": "..." }
    ]
  },
  "keyTakeaways": ["<top learning 1>", "<top learning 2>", "<top learning 3>"]
}
Return ONLY the JSON object, no markdown.`

        const summaryMsg = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 8192,
            messages: [{ role: 'user', content: summaryPrompt }],
        })

        const summaryRaw = summaryMsg.content[0].type === 'text' ? summaryMsg.content[0].text : '{}'

        let summaryParsed: any
        try {
            const cleaned = healJson(summaryRaw)
            summaryParsed = JSON.parse(cleaned)
        } catch (e) {
            console.error('Final Summary JSON parse failed:', e, summaryRaw)

            // Fallback: Attempt a more aggressive regex match for specifically truncated arrays
            try {
                const partialMatch = summaryRaw.match(/"summary":\s*"([^"]*)"/)
                summaryParsed = {
                    summary: partialMatch ? partialMatch[1] : `Evaluation complete for ${body.questionTitle}.`,
                    modelSolution: {
                        title: `Masterpiece Solution: ${body.questionTitle}`,
                        sections: [{ heading: 'Architecture Preview', content: 'Detailed solution was too large to parse fully. Please refer to individual step feedback.' }]
                    },
                    keyTakeaways: ['Focus on core entity abstractions.', 'Ensure SRP in board management.']
                }
            } catch (inner) {
                summaryParsed = {
                    summary: `Overall performance evaluation for ${body.questionTitle}.`,
                    modelSolution: { title: `Masterpiece Solution: ${body.questionTitle}`, sections: [] },
                    keyTakeaways: []
                }
            }
        }

        const result: EvaluationResponse = {
            totalScore,
            maxScore: totalMax,
            grade,
            summary: summaryParsed.summary || `Overall performance evaluation for ${body.questionTitle}.`,
            breakdown: sectionResults,
            modelSolution: summaryParsed.modelSolution || {
                title: `Masterpiece Solution: ${body.questionTitle}`,
                sections: []
            },
            keyTakeaways: summaryParsed.keyTakeaways || [],
        }

        return result

    } catch (error: any) {
        if (error.statusCode) throw error
        throw createError({ statusCode: 500, statusMessage: 'Evaluation failed: ' + (error.message || 'Unknown error') })
    }
})
