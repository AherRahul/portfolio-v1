import type { Handler, HandlerEvent } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

// ── Helpers ───────────────────────────────────────────────────────────────────
function createHeaders() {
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    }
}

function healJson(raw: string): string {
    let cleaned = raw.trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start >= 0 && end >= 0) {
        cleaned = cleaned.substring(start, end + 1)
        try { JSON.parse(cleaned); return cleaned } catch (e) { }
    }
    if (start >= 0) {
        cleaned = cleaned.substring(start)
        let openBraces = 0, openBrackets = 0
        let inString = false, escapeNext = false
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i]
            if (escapeNext) { escapeNext = false; continue }
            if (char === '\\') { escapeNext = true }
            else if (char === '"') { inString = !inString }
            else if (!inString) {
                if (char === '{') openBraces++
                else if (char === '}') openBraces--
                else if (char === '[') openBrackets++
                else if (char === ']') openBrackets--
            }
        }
        if (inString) cleaned += '"'
        while (openBrackets > 0) { cleaned += ']'; openBrackets-- }
        while (openBraces > 0) { cleaned += '}'; openBraces-- }
    }
    return cleaned
}

// ── Prompt Builders (mirrored from server/utils/systemDesignPrompts.ts) ───────
function getDifficultyContext(difficulty: string): string {
    const d = difficulty.toLowerCase()
    if (d.includes('junior')) return `EVALUATION LEVEL: JUNIOR. Focus on basic functional correctness, clear naming, and simple logic. Be encouraging but ensure core concepts are understood. A score of 6/10 requires functional coverage and basic structure.`
    if (d.includes('senior')) return `EVALUATION LEVEL: SENIOR. Expect strong modularity, consideration of edge cases, non-functional requirements (scalability, performance), and design patterns. Penalize heavily for "God objects" or lack of extensibility. A score of 6/10 requires strong LLD/HLD fundamentals.`
    if (d.includes('lead') || d.includes('architect')) return `EVALUATION LEVEL: LEAD/ARCHITECT. Expect deep trade-off analysis, distributed systems awareness (for HLD), high-scale considerations, cost-efficiency, and operational excellence. Candidates must demonstrate not just 'how' but 'why'. A 6/10 score is hard to achieve and requires expert-level architecture and implementation.`
    return ''
}

const GLOBAL_FORMATTING_RULES = `
**FORMATTING RULES:**
1. DO NOT use horizontal lines (---, ***, ___) anywhere.
2. If providing code, use clear sub-headings like "### Class: Name" followed by the code block.
3. Use clean Markdown for all content.`

function buildRequirementsPrompt(q: any, data: any): string {
    const functional: string[] = data.functional || []
    const nonFunctional: string[] = data.nonFunctional || []
    return `You are a world-class engineering interviewer conducting a ${q.designType} system design session.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}
**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Requirements Gathering
**Candidate's Functional Requirements (${functional.length}):**
${functional.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n') || '(none provided)'}
**Candidate's Non-Functional Requirements (${nonFunctional.length}):**
${nonFunctional.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n') || '(none provided)'}
Evaluate ONLY the requirements gathering quality. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer). Return ONLY the JSON object.`
}

function buildEntitiesPrompt(q: any, data: any): string {
    const entities: any[] = Array.isArray(data) ? data : []
    return `You are a world-class engineering interviewer conducting a ${q.designType} system design session.
${getDifficultyContext(q.difficulty)}
**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Step:** Identifying Core Entities
**Candidate's Entities (${entities.length}):**
${entities.map((e: any, i: number) => `${i + 1}. ${e.name}: ${e.description}`).join('\n') || '(none provided)'}
Evaluate ONLY the entity identification quality. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer). Return ONLY the JSON.`
}

function buildClassesPrompt(q: any, data: any): string {
    const classes = data.classes || []
    const relationships = data.relationships || []
    const patterns = data.patterns || []
    return `You are a world-class engineering interviewer conducting an LLD session.
${getDifficultyContext(q.difficulty)}
**Problem:** "${q.questionTitle}"
**Classes (${classes.length}):** ${classes.map((c: any, i: number) => `${i + 1}. [${c.type}] ${c.name}`).join(', ') || '(none)'}
**Relationships (${relationships.length}):** ${relationships.map((r: any) => `${r.from} ${r.relType} ${r.to}`).join(', ') || '(none)'}
**Patterns:** ${patterns.join(', ') || '(none)'}
Evaluate ONLY the class design quality. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildCodePrompt(q: any, data: any): string {
    const language = data.language || 'unknown'
    const code = data.code || ''
    return `You are a world-class engineering reviewer conducting a code implementation audit.
${getDifficultyContext(q.difficulty)}
**Problem:** "${q.questionTitle}"
**Language:** ${language}
**Candidate's Code:**
\`\`\`${language}
${code.substring(0, 2000)}${code.length > 2000 ? '\n... (truncated)' : ''}
\`\`\`
Evaluate the code quality. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildArchitecturePrompt(q: any, data: string): string {
    return `You are a world-class distributed systems engineer reviewing HLD architecture.
${getDifficultyContext(q.difficulty)}
**Problem:** "${q.questionTitle}"
**Candidate's Architecture:** ${data || '(empty)'}
Evaluate ONLY the architecture quality. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildDeepDivePrompt(q: any, data: string): string {
    return `You are a world-class systems researcher reviewing a deep-dive analysis.
${getDifficultyContext(q.difficulty)}
**Problem:** "${q.questionTitle}"
**Candidate's Deep Dive:** ${data || '(empty)'}
Evaluate ONLY the deep dive depth. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildScalingPrompt(q: any, data: string): string {
    return `You are a world-class distributed systems architect reviewing scaling strategy.
${getDifficultyContext(q.difficulty)}
**Problem:** "${q.questionTitle}"
**Candidate's Scaling Answer:** ${data || '(empty)'}
Evaluate ONLY the scaling strategy. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildApiDesignPrompt(q: any, data: any[]): string {
    return `You are a world-class API architect reviewing API design.
**Problem:** "${q.questionTitle}"
**Candidate's Endpoints:** ${data.map((e: any) => `${e.method} ${e.path}: ${e.description}`).join(', ')}
Evaluate the API design. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildDatabaseDesignPrompt(q: any, data: any[]): string {
    return `You are a world-class Database Architect reviewing database design.
**Problem:** "${q.questionTitle}"
**Candidate's Storage Choices:** ${data.map((s: any) => `${s.type} (${s.technology}): ${s.schema}`).join(', ')}
Evaluate the storage choices and schema design. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildAnalyticsPrompt(q: any, data: string): string {
    return `You are a world-class Data Engineer reviewing click-count analytics design.
**Problem:** "${q.questionTitle}"
**Candidate's Design:** ${data}
Evaluate the design. Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function gradeFromPct(pct: number): string {
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B'
    if (pct >= 60) return 'C'
    if (pct >= 50) return 'D'
    return 'F'
}

// ── Handler ───────────────────────────────────────────────────────────────────
export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: createHeaders(), body: '' }
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: createHeaders(), body: JSON.stringify({ message: 'Method Not Allowed' }) }
    }

    try {
        const body = JSON.parse(event.body || '{}')
        const { questionTitle, questionDescription, designType, difficulty, language, answers } = body

        if (!questionTitle || !answers) {
            return { statusCode: 400, headers: createHeaders(), body: JSON.stringify({ message: 'Question and answers are required' }) }
        }

        const anthropicApiKey = process.env.ANTHROPIC_API_KEY
        if (!anthropicApiKey) {
            return { statusCode: 500, headers: createHeaders(), body: JSON.stringify({ message: 'AI service not configured' }) }
        }

        const anthropic = new Anthropic({ apiKey: anthropicApiKey })
        const isLLD = designType === 'LLD' || designType === 'Both'
        const a = answers
        const q = { questionTitle, questionDescription, designType, difficulty, language }

        type SectionCfg = { key: string; label: string; data: unknown; skip: boolean }

        const sections: SectionCfg[] = isLLD
            ? [
                { key: 'requirements', label: 'Requirements Gathering', data: a.requirements || {}, skip: !a.requirements || (!a.requirements.functional?.length && !a.requirements.nonFunctional?.length) },
                { key: 'entities', label: 'Core Entity Identification', data: a.entities || [], skip: !a.entities?.length },
                { key: 'classes', label: 'Class Design & OOP', data: a.classes || {}, skip: !a.classes?.classes?.length },
                { key: 'code', label: 'Code Implementation', data: { language: language || 'Code', code: a.code || '' }, skip: !a.code || a.code.includes('Implement your') || a.code.split('\n').length < 5 },
            ]
            : [
                { key: 'requirements', label: '1. Requirements Gathering', data: a.requirements || {}, skip: !a.requirements || (!a.requirements.functional?.length && !a.requirements.nonFunctional?.length) },
                { key: 'api', label: '2. API Design', data: a.api || [], skip: !a.api?.length },
                { key: 'architecture', label: '3. High-Level Design', data: a.architecture || '', skip: !a.architecture?.trim() },
                { key: 'database', label: '4. Database Design', data: a.database || [], skip: !a.database?.length },
                { key: 'deep-dive', label: '5. Deep Dive 1 - Caching Strategy', data: a.deepDive || '', skip: !a.deepDive?.trim() },
                { key: 'analytics', label: '6. Deep Dive 2 - Click Count Analytics', data: a.analytics || '', skip: !a.analytics?.trim() },
            ]

        interface ScoreBreakdown { section: string; score: number; maxScore: number; feedback: string; improvements: string[] }

        const sectionResults: ScoreBreakdown[] = await Promise.all(
            sections.map(async (sec): Promise<ScoreBreakdown> => {
                if (sec.skip) {
                    return { section: sec.label, score: 0, maxScore: 10, feedback: 'Section was skipped or left empty.', improvements: ['Complete this section to earn points.'] }
                }

                const qBody = { ...q, stepId: sec.key, stepData: sec.data } as any
                let prompt = ''
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
                        model: 'claude-sonnet-4-6',
                        max_tokens: 4096,
                        messages: [{ role: 'user', content: prompt }],
                    })
                    const raw = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
                    const parsed = JSON.parse(healJson(raw))
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
        const totalScore = sectionResults.reduce((s: number, r: ScoreBreakdown) => s + r.score, 0)
        const grade = gradeFromPct((totalScore / totalMax) * 100)

        // ── Two separate prompts: one for LLD, one for HLD ─────────────────

        const lldSummaryPrompt = `You are a world-class Low-Level Design (LLD) interviewer and code auditor.
Your job is to summarize this candidate's LLD interview performance and generate a REFERENCE implementation.

**Problem:** "${questionTitle}" (LLD Interview, ${difficulty})

**Stage Scores:**
${sectionResults.map((r: ScoreBreakdown) => `- ${r.section}: ${r.score}/${r.maxScore} — ${r.feedback}`).join('\n')}

**Overall:** ${totalScore}/${totalMax} (${grade})

**STRICT RULES FOR YOUR RESPONSE — LLD REPORT:**
1. Write a 3-sentence holistic assessment focusing on: OOP design quality, class responsibility separation, SOLID adherence, and implementation completeness.
2. The model solution MUST be a complete, production-ready code implementation.
3. Group code BY CLASS — each class/interface gets its own markdown sub-heading: "### Class: ClassName" followed immediately by its code block.
4. DO NOT write architecture diagrams, system components, load balancers, databases, caches, or any distributed systems concepts.
5. DO NOT concatenate all code into one block.
6. DO NOT use horizontal lines (---) anywhere.
7. Use the ${language || 'Java'} programming language exclusively.
8. Cover: class hierarchy, design patterns used, key method logic, and edge case handling.

Respond with ONLY valid JSON — no markdown, no extra text:
{
  "summary": "<3-sentence LLD assessment: OOP quality, class design, implementation strength, biggest gap>",
  "modelSolution": {
    "title": "Reference LLD Implementation: ${questionTitle}",
    "sections": [
      { "heading": "Design Patterns & Class Architecture", "content": "<Markdown: which patterns, why, class hierarchy overview. NO code here.>" },
      { "heading": "Core Class Implementations", "content": "<Markdown: ### Class: X\n\`\`\`${language || 'java'}\n...code...\n\`\`\`\n### Class: Y\n\`\`\`${language || 'java'}\n...code...\n\`\`\`>" },
      { "heading": "SOLID Principles & OOP Best Practices", "content": "<Markdown: how SRP, OCP, LSP, ISP, DIP are demonstrated in the reference solution>" },
      { "heading": "Testing & Edge Case Strategy", "content": "<Markdown: key test cases, error handling patterns, concurrency considerations if applicable>" }
    ]
  },
  "keyTakeaways": ["<LLD lesson 1>", "<LLD lesson 2>", "<LLD lesson 3>", "<LLD lesson 4>"]
}
Return ONLY the JSON object.`

        const hldSummaryPrompt = `You are a world-class High-Level Design (HLD) / System Design interviewer and distributed systems architect.
Your job is to summarize this candidate's HLD interview performance and generate a REFERENCE system architecture.

**Problem:** "${questionTitle}" (HLD Interview, ${difficulty})

**Stage Scores (6 HLD Stages):**
${sectionResults.map((r: ScoreBreakdown) => `- ${r.section}: ${r.score}/${r.maxScore} — ${r.feedback}`).join('\n')}

**Overall:** ${totalScore}/${totalMax} (${grade})

**STRICT RULES FOR YOUR RESPONSE — HLD REPORT:**
1. Write a 3-sentence holistic assessment focusing on: system scalability, API quality, storage strategy, caching design, analytics pipeline, and trade-off analysis.
2. The model solution MUST be a complete architectural reference — NOT code.
3. DO NOT write any source code, class definitions, method bodies, or programming language syntax.
4. DO NOT use horizontal lines (---) anywhere.
5. Use distributed systems terminology: Load Balancers, API Gateways, Microservices, Message Queues (Kafka/RabbitMQ), CDN, Redis/Memcached, Consistent Hashing, CAP Theorem, Sharding, Replication, Rate Limiting, Circuit Breakers, Service Discovery, etc.
6. Each section MUST map to one of the 6 HLD interview stages below.

Respond with ONLY valid JSON — no markdown, no extra text:
{
  "summary": "<3-sentence HLD assessment: scalability decisions, API design quality, storage strategy, biggest architectural gap>",
  "modelSolution": {
    "title": "Reference System Architecture: ${questionTitle}",
    "sections": [
      {
        "heading": "1. Requirements & Scale Targets",
        "content": "<Markdown: Functional requirements, NFRs with concrete numbers (e.g., 100M DAU, p99 latency < 100ms, 99.99% uptime), capacity estimation, and scope decisions. NO code.>"
      },
      {
        "heading": "2. API Design & Contract",
        "content": "<Markdown: RESTful endpoints listed as METHOD /path descriptions, request/response field names, versioning strategy (/v1/), rate limiting headers, authentication (JWT/OAuth2). NO code blocks.>"
      },
      {
        "heading": "3. High-Level Design",
        "content": "<Markdown: Text component diagram (Client → CDN → Load Balancer → API Gateway → Services → DB/Cache), data flow narrative, service decomposition rationale, CAP theorem trade-off chosen, fault tolerance (circuit breaker, retry, health checks). NO code.>"
      },
      {
        "heading": "4. Database Design",
        "content": "<Markdown: Primary DB choice with justification (e.g., PostgreSQL for ACID vs Cassandra for write throughput), schema key fields, indexing columns, read replica count, sharding key choice, secondary stores (S3, Elasticsearch). NO code.>"
      },
      {
        "heading": "5. Deep Dive 1 - Caching Strategy",
        "content": "<Markdown: Cache layers (CDN, Nginx reverse proxy, Redis application cache), eviction policy (LRU/LFU with justification), TTL values, cache invalidation pattern (write-through/write-behind/cache-aside chosen + why), thundering herd prevention (mutex lock, probabilistic early expiry). NO code.>"
      },
      {
        "heading": "6. Deep Dive 2 - Click Count Analytics",
        "content": "<Markdown: Event ingestion via Kafka (topic partitioning by URL hash), consumer groups for real-time aggregation, probabilistic counting (count-min sketch for approximate, exact Redis INCR for hot URLs), batch layer (Spark/Flink jobs for hourly rollups), cold storage (ClickHouse or Apache Druid for OLAP queries), dashboard query API. NO code.>"
      }
    ]
  },
  "keyTakeaways": ["<HLD lesson 1>", "<HLD lesson 2>", "<HLD lesson 3>", "<HLD lesson 4>"]
}
Return ONLY the JSON object.`

        const summaryPrompt = isLLD ? lldSummaryPrompt : hldSummaryPrompt


        const summaryMsg = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 8192,
            messages: [{ role: 'user', content: summaryPrompt }],
        })

        const summaryRaw = summaryMsg.content[0].type === 'text' ? summaryMsg.content[0].text : '{}'
        let summaryParsed: any

        try {
            summaryParsed = JSON.parse(healJson(summaryRaw))
        } catch (e) {
            console.error('Final Summary JSON parse failed:', e)
            try {
                const partialMatch = summaryRaw.match(/"summary":\s*"([^"]*)"/)
                const fallbackTitle = isLLD
                    ? `Reference LLD Implementation: ${questionTitle}`
                    : `Reference System Architecture: ${questionTitle}`
                summaryParsed = {
                    summary: partialMatch ? partialMatch[1] : `Evaluation complete for ${questionTitle}.`,
                    modelSolution: {
                        title: fallbackTitle,
                        sections: [{ heading: isLLD ? 'Implementation Preview' : 'Architecture Preview', content: 'Detailed solution was too large to parse fully. Please refer to individual step feedback.' }]
                    },
                    keyTakeaways: isLLD
                        ? ['Focus on clear class responsibilities.', 'Apply SOLID principles throughout.']
                        : ['Prioritise scalability decisions early.', 'Ensure proper fault tolerance at every tier.']
                }
            } catch (inner) {
                summaryParsed = {
                    summary: `Overall performance evaluation for ${questionTitle}.`,
                    modelSolution: { title: isLLD ? `Reference LLD Implementation: ${questionTitle}` : `Reference System Architecture: ${questionTitle}`, sections: [] },
                    keyTakeaways: []
                }
            }
        }


        const result = {
            totalScore,
            maxScore: totalMax,
            grade,
            summary: summaryParsed.summary || `Overall performance evaluation for ${questionTitle}.`,
            breakdown: sectionResults,
            modelSolution: summaryParsed.modelSolution || { title: `Masterpiece Solution: ${questionTitle}`, sections: [] },
            keyTakeaways: summaryParsed.keyTakeaways || [],
        }

        return { statusCode: 200, headers: createHeaders(), body: JSON.stringify(result) }

    } catch (error: any) {
        console.error('SD Full Eval error:', error)
        if (error.status === 429) {
            return { statusCode: 429, headers: createHeaders(), body: JSON.stringify({ message: 'Rate limit exceeded. Please try again later.' }) }
        }
        return {
            statusCode: 500,
            headers: createHeaders(),
            body: JSON.stringify({ message: 'Evaluation failed', error: error.message, hasApiKey: !!process.env.ANTHROPIC_API_KEY })
        }
    }
}
