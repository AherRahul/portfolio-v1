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
        api?: any[]
        database?: any[]
        deepDive?: string
        analytics?: string
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
                { key: 'requirements', label: '1. Requirements Gathering', data: a.requirements || {}, skip: !a.requirements || (!a.requirements.functional?.length && !a.requirements.nonFunctional?.length) },
                { key: 'api', label: '2. API Design', data: a.api || [], skip: !a.api?.length },
                { key: 'architecture', label: '3. High-Level Design', data: a.architecture || '', skip: !a.architecture?.trim() },
                { key: 'database', label: '4. Database Design', data: a.database || [], skip: !a.database?.length },
                { key: 'deep-dive', label: '5. Deep Dive 1 - Caching Strategy', data: a.deepDive || '', skip: !a.deepDive?.trim() },
                { key: 'analytics', label: '6. Deep Dive 2 - Click Count Analytics', data: a.analytics || '', skip: !a.analytics?.trim() },
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
                    case 'api': prompt = buildApiDesignPrompt(qBody, sec.data as any[]); break
                    case 'database': prompt = buildDatabaseDesignPrompt(qBody, sec.data as any[]); break
                    case 'analytics': prompt = buildAnalyticsPrompt(qBody, sec.data as string); break
                }

                try {
                    const msg = await anthropic.messages.create({
                        model: 'claude-3-haiku-20240307',
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

        // ── Two separate prompts: one for LLD, one for HLD ─────────────────

        const lldSummaryPrompt = `You are a world-class Low-Level Design (LLD) interviewer and code auditor.
Your job is to summarize this candidate's LLD interview performance and generate a REFERENCE implementation.

**Problem:** "${body.questionTitle}" (LLD Interview, ${body.difficulty})

**Stage Scores:**
${sectionResults.map(r => `- ${r.section}: ${r.score}/${r.maxScore} — ${r.feedback}`).join('\n')}

**Overall:** ${totalScore}/${totalMax} (${grade})

**STRICT RULES FOR YOUR RESPONSE — LLD REPORT:**
1. Write a 3-sentence holistic assessment focusing on: OOP design quality, class responsibility separation, SOLID adherence, and implementation completeness.
2. The model solution MUST be a complete, production-ready code implementation.
3. Group code BY CLASS — each class/interface gets its own markdown sub-heading: "### Class: ClassName" followed immediately by its code block.
4. DO NOT write architecture diagrams, system components, load balancers, databases, caches, or any distributed systems concepts.
5. DO NOT concatenate all code into one block.
6. DO NOT use horizontal lines (---) anywhere.
7. Use the ${body.language || 'Java'} programming language exclusively.
8. Cover: class hierarchy, design patterns used, key method logic, and edge case handling.

Respond with ONLY valid JSON — no markdown, no extra text:
{
  "summary": "<3-sentence LLD assessment: OOP quality, class design, implementation strength, biggest gap>",
  "modelSolution": {
    "title": "Reference LLD Implementation: ${body.questionTitle}",
    "sections": [
      { "heading": "Design Patterns & Class Architecture", "content": "<Markdown: which patterns, why, class hierarchy overview. NO code here.>" },
      { "heading": "Core Class Implementations", "content": "<Markdown: ### Class: X\n\`\`\`${body.language || 'java'}\n...code...\n\`\`\`\n### Class: Y\n\`\`\`${body.language || 'java'}\n...code...\n\`\`\`>" },
      { "heading": "SOLID Principles & OOP Best Practices", "content": "<Markdown: how SRP, OCP, LSP, ISP, DIP are demonstrated in the reference solution>" },
      { "heading": "Testing & Edge Case Strategy", "content": "<Markdown: key test cases, error handling patterns, concurrency considerations if applicable>" }
    ]
  },
  "keyTakeaways": ["<LLD lesson 1>", "<LLD lesson 2>", "<LLD lesson 3>", "<LLD lesson 4>"]
}
Return ONLY the JSON object.`

        const hldSummaryPrompt = `You are a world-class High-Level Design (HLD) / System Design interviewer and distributed systems architect.
Your job is to summarize this candidate's HLD interview performance and generate a REFERENCE system architecture.

**Problem:** "${body.questionTitle}" (HLD Interview, ${body.difficulty})

**Stage Scores (6 HLD Stages):**
${sectionResults.map(r => `- ${r.section}: ${r.score}/${r.maxScore} — ${r.feedback}`).join('\n')}

**Overall:** ${totalScore}/${totalMax} (${grade})

**STRICT RULES FOR YOUR RESPONSE — HLD REPORT:**
1. Write a 3-sentence holistic assessment focusing on: system scalability, API quality, storage strategy, caching design, analytics pipeline, and trade-off analysis.
2. The model solution MUST be a complete architectural reference — NOT code.
3. DO NOT write any source code, class definitions, method bodies, or programming language syntax.
4. DO NOT use horizontal lines (---) anywhere.
5. Use distributed systems terminology: Load Balancers, API Gateways, Microservices, Message Queues (Kafka/RabbitMQ), CDN, Redis/Memcached, Consistent Hashing, CAP Theorem, Sharding, Replication, Rate Limiting, Circuit Breakers, Service Discovery, etc.
6. Each section must map to one of the 6 HLD interview stages.

Respond with ONLY valid JSON — no markdown, no extra text:
{
  "summary": "<3-sentence HLD assessment: scalability decisions, API design quality, storage strategy, biggest architectural gap>",
  "modelSolution": {
    "title": "Reference System Architecture: ${body.questionTitle}",
    "sections": [
      {
        "heading": "1. Requirements Gathering",
        "content": "<Markdown: Functional requirements, NFRs with concrete numbers (e.g., 100M DAU, p99 latency < 100ms, 99.99% uptime), capacity estimation, and scope decisions. NO code.>"
      },
      {
        "heading": "2. API Design",
        "content": "<Markdown: RESTful endpoints, HTTP methods, request/response schemas, versioning strategy, rate limiting, authentication approach. Use tables or lists — NO code blocks.>"
      },
      {
        "heading": "3. High-Level Design",
        "content": "<Markdown: Component diagram in text (Client → CDN → LB → API Gateway → Services → DB/Cache), data flow narrative, service decomposition rationale, CAP theorem positioning, fault tolerance strategy. NO code.>"
      },
      {
        "heading": "4. Database Design",
        "content": "<Markdown: Primary DB choice + justification (SQL/NoSQL), schema design, indexing strategy, read replicas, sharding approach, secondary storage choices (object store, search index). NO code.>"
      },
      {
        "heading": "5. Deep Dive 1 - Caching Strategy",
        "content": "<Markdown: Cache topology (CDN, reverse proxy, app-level), Redis/Memcached usage, eviction policies (LRU/LFU), TTL decisions, cache invalidation strategy (write-through/write-behind/cache-aside), thundering herd prevention. NO code.>"
      },
      {
        "heading": "6. Deep Dive 2 - Click Count Analytics",
        "content": "<Markdown: Event ingestion (Kafka topics, partitioning strategy), real-time aggregation (count-min sketch or HyperLogLog), batch processing (Spark/Flink), storage (ClickHouse/Cassandra), query API design for dashboards. NO code.>"
      }
    ]
  },
  "keyTakeaways": ["<HLD lesson 1>", "<HLD lesson 2>", "<HLD lesson 3>", "<HLD lesson 4>"]
}
Return ONLY the JSON object.`

        const summaryPrompt = isLLD ? lldSummaryPrompt : hldSummaryPrompt


        const summaryMsg = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            messages: [{ role: 'user', content: summaryPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No preamble, no explanation.' }],
        })

        const summaryRaw = summaryMsg.content[0].type === 'text' ? summaryMsg.content[0].text : '{}'

        let summaryParsed: any
        try {
            const cleaned = healJson(summaryRaw)
            try {
                summaryParsed = JSON.parse(cleaned)
            } catch (innerError) {
                // If standard parse fails, try the unescape fallback
                const unescaped = cleaned.replace(/\\"/g, '"').replace(/\\n/g, '\n')
                if (unescaped.includes('"summary"')) {
                    summaryParsed = JSON.parse(healJson(unescaped))
                } else {
                    throw innerError
                }
            }
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
