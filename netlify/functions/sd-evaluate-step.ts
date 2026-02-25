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
    // 1. Pre-strip: remove invisible junk and trim
    let cleaned = raw.replace(/[^\x20-\x7E\r\n\t]/g, '').trim()

    // 2. Extract from Markdown blocks if present
    if (cleaned.includes('```json')) {
        const parts = cleaned.split('```json')
        if (parts.length > 1) {
            const afterJson = parts[1].split('```')[0]
            cleaned = afterJson.trim()
        }
    } else if (cleaned.includes('```')) {
        const parts = cleaned.split('```')
        if (parts.length > 1) {
            cleaned = parts[1].trim()
        }
    }

    // 3. Find the absolute first '{'
    const start = cleaned.indexOf('{')
    if (start < 0) return cleaned
    cleaned = cleaned.substring(start)

    // 4. Fix literal control characters inside string values and handle structure
    let fixed = ''
    let inString = false
    let escapeNext = false

    // Pass 1: Handle string escaping and control characters
    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i]
        const code = char.charCodeAt(0)
        if (escapeNext) { fixed += char; escapeNext = false; continue }
        if (char === '\\') { fixed += char; escapeNext = true; continue }
        if (char === '"') { inString = !inString; fixed += char; continue }

        if (inString && code < 32) {
            if (char === '\n') fixed += '\\n'
            else if (char === '\r') fixed += '\\r'
            else if (char === '\t') fixed += '\\t'
            else fixed += '\\u' + code.toString(16).padStart(4, '0')
        } else {
            fixed += char
        }
    }
    cleaned = fixed

    // Pass 2: Check structural integrity (closing braces/brackets)
    let openBraces = 0, openBrackets = 0
    inString = false
    escapeNext = false

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

    if (escapeNext) cleaned = cleaned.substring(0, cleaned.length - 1)

    const removeTrailingComma = () => {
        cleaned = cleaned.trim()
        while (cleaned.endsWith(',')) cleaned = cleaned.substring(0, cleaned.length - 1).trim()
    }

    if (inString) cleaned += '"'
    while (openBrackets > 0) { removeTrailingComma(); cleaned += ']'; openBrackets-- }
    while (openBraces > 0) { removeTrailingComma(); cleaned += '}'; openBraces-- }

    const lastBrace = cleaned.lastIndexOf('}')
    const lastBracket = cleaned.lastIndexOf(']')
    const lastCloser = Math.max(lastBrace, lastBracket)
    if (lastCloser > 0) {
        const beforeCloser = cleaned.substring(0, lastCloser).trim()
        if (beforeCloser.endsWith(',')) {
            cleaned = beforeCloser.replace(/,+$/, '').trim() + cleaned.substring(lastCloser)
        }
    }

    const finalEnd = cleaned.lastIndexOf('}')
    if (finalEnd >= 0) cleaned = cleaned.substring(0, finalEnd + 1)

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

Evaluate ONLY the requirements gathering quality. 
SCORING RUBRIC (Stricter for higher difficulty):
- **Completeness (3pts):** Are all critical functional features captured? Obvious use-cases?
- **Non-functional depth (3pts):** HLD: Scalability, Latency, Consistency. LLD: Thread-safety, Extensibility.
- **Clarity & Specificity (2pts):** Precise metrics (e.g., "99.9% uptime") vs vague statements.
- **Strategic Thinking (2pts):** Trade-offs, constraints, and scope management.

Respond with ONLY valid JSON:
{
  "score": <0-10>,
  "maxScore": 10,
  "passing": <true if score >= 6>,
  "feedback": "<2 sentence summary of requirements quality>",
  "whatWentWell": ["<specific functional req that is good>"],
  "improvements": ["<missing critical functional requirement>", "<missing or vague NFR>"],
  "modelAnswer": "<A high-level engineer's ideal requirements list with justifications. Use clean Markdown sub-headings. NO horizontal lines.>"
}
Return ONLY the JSON object, no markdown, no extra text.`
}

function buildEntitiesPrompt(q: any, data: any): string {
    const entities: { name: string; description: string }[] = Array.isArray(data) ? data : []
    return `You are a world-class engineering interviewer conducting a ${q.designType} system design session.
${getDifficultyContext(q.difficulty)}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Identifying Core Entities / Domain Model

**Candidate's Entities (${entities.length}):**
${entities.map((e: any, i: number) => `${i + 1}. ${e.name}: ${e.description}`).join('\n') || '(none provided)'}

Evaluate ONLY the entity identification quality.
SCORING RUBRIC (Stricter for higher difficulty):
- **Core entity coverage (4pts):** Primary domain objects? Missing obvious ones is fatal for Lead/Senior.
- **Single Responsibility (2pts):** Each entity represents ONE concept—no "God objects".
- **Naming quality (2pts):** Clear, noun-based, industry-appropriate.
- **Description/Attribution (2pts):** Does each description imply the right state/data isolation?

Respond with ONLY valid JSON:
{
  "score": <0-10>,
  "maxScore": 10,
  "passing": <true if score >= 6>,
  "feedback": "<2 sentence summary of entity identification>",
  "whatWentWell": ["<specific well-identified entity and why>"],
  "improvements": ["<specific missing entity that is critical>", "<entity with poor naming or description>"],
  "modelAnswer": "<The ideal domain entities a high-level engineer would identify. Use clean Markdown sub-headings. NO horizontal lines.>"
}
Return ONLY the JSON object, no markdown, no extra text.`
}

function buildClassesPrompt(q: any, data: any): string {
    const classes = data.classes || []
    const relationships = data.relationships || []
    const patterns = data.patterns || []
    return `You are a world-class engineering interviewer conducting an LLD session.
${getDifficultyContext(q.difficulty)}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Designing Classes & Relationships (OOP Design)

**Candidate's Classes/Interfaces (${classes.length}):**
${classes.map((c: any, i: number) => `${i + 1}. [${c.type}] ${c.name}`).join('\n') || '(none)'}

**Relationships defined (${relationships.length}):**
${relationships.map((r: any, i: number) => `${i + 1}. ${r.from} ${r.relType} ${r.to}`).join('\n') || '(none)'}

**Design Patterns used (${patterns.length}):**
${patterns.length ? patterns.join(', ') : '(none selected)'}

Evaluate ONLY the class design quality.
SCORING RUBRIC (Stricter for higher difficulty):
- **Class completeness (3pts):** Necessary classes/interfaces? Abstract classes/interfaces used well?
- **OOP principles (3pts):** SOLID adherence. Lead candidates MUST avoid tight coupling.
- **Model Accuracy (2pts):** Correct use of Inheritance vs Composition.
- **Pattern Maturity (2pts):** Not just choosing a pattern, but the RIGHT pattern for the problem.

Respond with ONLY valid JSON:
{
  "score": <0-10>,
  "maxScore": 10,
  "passing": <true if score >= 6>,
  "feedback": "<2 sentence summary of class design quality>",
  "whatWentWell": ["<well-designed class or interface>"],
  "improvements": ["<missing class>", "<SOLID violation>", "<better pattern choice>"],
  "modelAnswer": "<The ideal class hierarchy and patterns. Use clean Markdown sub-headings. NO horizontal lines.>"
}
Return ONLY the JSON object, no markdown, no extra text.`
}

function buildCodePrompt(q: any, data: any): string {
    const language = data.language || 'unknown'
    const code = data.code || ''
    return `You are a world-class engineering reviewer conducting a code implementation audit.
${getDifficultyContext(q.difficulty)}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Language:** ${language}
**Step:** Code Implementation

**Candidate's Code:**
\`\`\`${language}
${code.substring(0, 2000)}${code.length > 2000 ? '\n... (truncated)' : ''}
\`\`\`

Evaluate the code quality.
SCORING RUBRIC (Stricter for higher difficulty):
- **Implementation Fidelity (2pts):** Does code reflect the design?
- **Logic & Correctness (3pts):** Bug-free, handles edge cases. Lead candidates MUST handle concurrency/exceptions.
- **Clean Code (2pts):** Naming, readability, idiomatic usage.
- **Enterprise Best Practices (3pts):** Error handling, testability, security, and performance.

Respond with ONLY valid JSON:
{
  "score": <0-10>,
  "maxScore": 10,
  "passing": <true if score >= 6>,
  "feedback": "<2 sentence logic audit summary>",
  "whatWentWell": ["<specific logic strength>"],
  "improvements": ["<specific logic gap or best practice violation>"],
  "metrics": [
    { "label": "Implementation Fidelity", "score": <0-10>, "maxScore": 10, "feedback": "...", "strengths": [], "gaps": [] },
    { "label": "Logic & Correctness", "score": <0-10>, "maxScore": 10, "feedback": "...", "strengths": [], "gaps": [] },
    { "label": "Clean Code", "score": <0-10>, "maxScore": 10, "feedback": "...", "strengths": [], "gaps": [] },
    { "label": "SOLID & Patterns", "score": <0-10>, "maxScore": 10, "feedback": "...", "strengths": [], "gaps": [] },
    { "label": "Best Practices", "score": <0-10>, "maxScore": 10, "feedback": "...", "strengths": [], "gaps": [] },
    { "label": "Error/Edge Cases", "score": <0-10>, "maxScore": 10, "feedback": "...", "strengths": [], "gaps": [] }
  ],
  "modelAnswer": "<The ideal code implementation. MANDATORY: Group code by class. Use '### Class: Name' headings. NO horizontal lines.>"
}
Return ONLY the JSON object, no markdown, no extra text.`
}

function buildArchitecturePrompt(q: any, data: string): string {
    return `You are a world-class distributed systems engineer reviewing an HLD architecture.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** High-Level Architecture Design

**Candidate's Architecture Answer:**
${data || '(empty)'}

Evaluate ONLY the high-level architecture quality.
SCORING RUBRIC (Stricter for higher difficulty):
- **Component identification (3pts):** LB, API, DB, Cache, Messaging. Lead candidates MUST justify why each is needed.
- **Data flow clarity (3pts):** Request lifecycle. Is the flow logical?
- **System Properties (2pts):** Availability vs Consistency (CAP). Lead candidates MUST identify the right trade-off.
- **Scalability fundamentals (2pts):** Statelessness, Horizontal vs Vertical.

Respond with ONLY valid JSON:
{
  "score": <0-10>,
  "maxScore": 10,
  "passing": <true if score >= 6>,
  "feedback": "<2 sentence architecture audit summary>",
  "whatWentWell": ["<specific component correctly identified>"],
  "improvements": ["<missing critical component>", "<wrong trade-off for this scale>"],
  "modelAnswer": "<Ideal HLD components and flow. Use clean Markdown sub-headings. NO horizontal lines.>"
}
Return ONLY the JSON object, no markdown, no extra text.`
}

function buildDeepDivePrompt(q: any, data: string): string {
    return `You are a world-class systems researcher reviewing a deep-dive analysis.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Deep Dive into Key Components

**Candidate's Deep Dive Answer:**
${data || '(empty)'}

Evaluate ONLY the depth of this deep dive.
SCORING RUBRIC (Stricter for higher difficulty):
- **Technical granularity (4pts):** DB internals, Indexing, API design specifics, Concurrency models.
- **Component selection (2pts):** Did they dive into the bottleneck?
- **Trade-off Deep Analysis (2pts):** Pros/Cons of subtle choices (e.g. LSM vs B-Tree, At-least-once vs Exactly-once). Lead candidates MUST analyze this.
- **Specificity (2pts):** Concrete metrics, algorithms, or schema snippets.

Respond with ONLY valid JSON:
{
  "score": <0-10>,
  "maxScore": 10,
  "passing": <true if score >= 6>,
  "feedback": "<2 sentence technical depth summary>",
  "whatWentWell": ["<specific deep technical detail>"],
  "improvements": ["<area that needed more depth>", "<missing trade-off analysis>"],
  "modelAnswer": "<The detailed technical deep-dive a high-level engineer would provide. Use clean Markdown sub-headings. NO horizontal lines.>"
}
Return ONLY the JSON object, no markdown, no extra text.`
}

function buildScalingPrompt(q: any, data: string): string {
    return `You are a world-class distributed systems architect reviewing scaling strategy.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Scaling & Bottleneck Analysis

**Candidate's Scaling Answer:**
${data || '(empty)'}

Evaluate ONLY the scaling strategy.
SCORING RUBRIC:
- **Accurate Bottleneck identification (3pts)**
- **Scaling concrete solutions (3pts)**
- **SPOF Awareness (2pts)**
- **Pragmatic trade-offs (2pts)**

Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildApiDesignPrompt(q: any, data: any[]): string {
    return `You are a world-class API architect.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}"
**Step:** API Design

**Candidate's Endpoints:**
${data.map((e: any) => `- ${e.method} ${e.path}: ${e.description}`).join('\n')}

Evaluate the API design for RESTful best practices, naming consistency, and completeness for the problem requirements.

Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildDatabaseDesignPrompt(q: any, data: any[]): string {
    return `You are a world-class Database Architect.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}"
**Step:** Database Design

**Candidate's Storage Choices:**
${data.map((s: any) => `- ${s.type} (${s.technology}): ${s.schema}`).join('\n')}

Evaluate the storage choices (SQL vs NoSQL) and the schema design.

Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
}

function buildAnalyticsPrompt(q: any, data: string): string {
    return `You are a world-class Data Engineer.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}"
**Step:** Click Count Analytics / Event Tracking

**Candidate's Design:**
${data}

Evaluate the design for real-time tracking, aggregation strategies (count-min sketch, hyperloglog, or batch processing), and storage efficiency.

Respond with ONLY valid JSON (score, maxScore, passing, feedback, whatWentWell, improvements, modelAnswer).`
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
        const { questionTitle, questionDescription, designType, difficulty, language, stepId, stepData } = body

        if (!questionTitle || !stepId || stepData === undefined) {
            return { statusCode: 400, headers: createHeaders(), body: JSON.stringify({ message: 'questionTitle, stepId, and stepData are required' }) }
        }

        const anthropicApiKey = process.env.ANTHROPIC_API_KEY
        if (!anthropicApiKey) {
            return { statusCode: 500, headers: createHeaders(), body: JSON.stringify({ message: 'AI service not configured' }) }
        }

        const anthropic = new Anthropic({ apiKey: anthropicApiKey })

        const q = { questionTitle, questionDescription, designType, difficulty, language }
        const d = stepData as any

        let prompt: string
        switch (stepId) {
            case 'requirements': prompt = buildRequirementsPrompt(q, d); break
            case 'entities': prompt = buildEntitiesPrompt(q, d); break
            case 'classes': prompt = buildClassesPrompt(q, d); break
            case 'code': prompt = buildCodePrompt(q, d); break
            case 'architecture': prompt = buildArchitecturePrompt(q, d as string); break
            case 'deep-dive': prompt = buildDeepDivePrompt(q, d as string); break
            case 'scaling': prompt = buildScalingPrompt(q, d as string); break
            case 'api': prompt = buildApiDesignPrompt(q, d); break
            case 'database': prompt = buildDatabaseDesignPrompt(q, d); break
            case 'analytics': prompt = buildAnalyticsPrompt(q, d as string); break
            default:
                return { statusCode: 400, headers: createHeaders(), body: JSON.stringify({ message: `Unknown stepId: ${stepId}` }) }
        }

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No preamble, no explanation.' }]
        })

        const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

        let result: any
        try {
            const cleaned = healJson(rawText)
            try {
                result = JSON.parse(cleaned)
            } catch (innerError) {
                const unescaped = cleaned.replace(/\\"/g, '"').replace(/\\n/g, '\n')
                if (unescaped.includes('"score"')) {
                    result = JSON.parse(healJson(unescaped))
                } else {
                    throw innerError
                }
            }
        } catch (e: any) {
            console.error('Netlify Step Eval JSON parse failed:', e, rawText)
            throw new Error(`Failed to parse AI response: ${e.message}`)
        }

        return { statusCode: 200, headers: createHeaders(), body: JSON.stringify(result) }

    } catch (error: any) {
        console.error('SD Step Eval error:', error)
        if (error.status === 429) {
            return { statusCode: 429, headers: createHeaders(), body: JSON.stringify({ message: 'Rate limit exceeded. Please try again later.' }) }
        }
        return {
            statusCode: 500,
            headers: createHeaders(),
            body: JSON.stringify({ message: 'Step evaluation failed', error: error.message, hasApiKey: !!process.env.ANTHROPIC_API_KEY })
        }
    }
}
