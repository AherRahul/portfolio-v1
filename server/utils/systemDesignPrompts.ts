import type { StepEvalRequest } from '../api/system-design/evaluate-step.post'
// ── Difficulty Specific Rubrics ──────────────────────────────────────────────
function getDifficultyContext(difficulty: string): string {
  const d = difficulty.toLowerCase()
  if (d.includes('junior')) {
    return `EVALUATION LEVEL: JUNIOR. Focus on basic functional correctness, clear naming, and simple logic. Be encouraging but ensure core concepts are understood. A score of 6/10 requires functional coverage and basic structure.`
  } else if (d.includes('senior')) {
    return `EVALUATION LEVEL: SENIOR. Expect strong modularity, consideration of edge cases, non-functional requirements (scalability, performance), and design patterns. Penalize heavily for "God objects" or lack of extensibility. A score of 6/10 requires strong LLD/HLD fundamentals.`
  } else if (d.includes('lead') || d.includes('architect')) {
    return `EVALUATION LEVEL: LEAD/ARCHITECT. Expect deep trade-off analysis, distributed systems awareness (for HLD), high-scale considerations, cost-efficiency, and operational excellence. Candidates must demonstrate not just 'how' but 'why'. A 6/10 score is hard to achieve and requires expert-level architecture and implementation.`
  }
  return ''
}

const GLOBAL_FORMATTING_RULES = `
**FORMATTING RULES:**
1. DO NOT use horizontal lines (---, ***, ___) anywhere.
2. If providing code, use clear sub-headings like "### Class: Name" followed by the code block.
3. Use clean Markdown for all content.`

export function buildRequirementsPrompt(q: StepEvalRequest, data: any): string {
  const functional: string[] = data.functional || []
  const nonFunctional: string[] = data.nonFunctional || []
  return `You are a world-class engineering interviewer conducting a ${q.designType} system design session.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Requirements Gathering

**Candidate's Functional Requirements (${functional.length}):**
${functional.map((r, i) => `${i + 1}. ${r}`).join('\n') || '(none provided)'}

**Candidate's Non-Functional Requirements (${nonFunctional.length}):**
${nonFunctional.map((r, i) => `${i + 1}. ${r}`).join('\n') || '(none provided)'}

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

export function buildEntitiesPrompt(q: StepEvalRequest, data: any): string {
  const entities: { name: string; description: string }[] = Array.isArray(data) ? data : []
  return `You are a world-class engineering interviewer conducting a ${q.designType} system design session.
${getDifficultyContext(q.difficulty)}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Identifying Core Entities / Domain Model

**Candidate's Entities (${entities.length}):**
${entities.map((e, i) => `${i + 1}. ${e.name}: ${e.description}`).join('\n') || '(none provided)'}

Evaluate ONLY the entity identification quality. 
SCORING RUBRIC (Stricter for higher difficulty):
- **Core entity coverage (4pts):** Primary domain objects? Missing obvious ones is fatal for Lead/Senior.
- **Single Responsibility (2pts):** Each entity represents ONE concept—no "God objects".
- **Naming quality (2pts):):** Clear, noun-based, industry-appropriate.
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

export function buildClassesPrompt(q: StepEvalRequest, data: any): string {
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

export function buildCodePrompt(q: StepEvalRequest, data: any): string {
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

export function buildArchitecturePrompt(q: StepEvalRequest, data: string): string {
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

export function buildDeepDivePrompt(q: StepEvalRequest, data: string): string {
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

export function buildScalingPrompt(q: StepEvalRequest, data: string): string {
  return `You are a world-class distributed systems architect reviewing scaling strategy.
${getDifficultyContext(q.difficulty)}
${GLOBAL_FORMATTING_RULES}

**Problem:** "${q.questionTitle}" — ${q.questionDescription}
**Difficulty:** ${q.difficulty}
**Step:** Scaling & Bottleneck Analysis

**Candidate's Scaling Answer:**
${data || '(empty)'}

Evaluate ONLY the scaling strategy. 
SCORING RUBRIC (Stricter for higher difficulty):
- **Accurate Bottleneck identification (3pts):** Identifying hot partitions, N+1s, IOPS limits.
- **Scaling concrete solutions (3pts):** Sharding, Consistent Hashing, Replication lag management.
- **SPOF Awareness (2pts):** Network, AZ failure, Quorum issues.
- **Pragmatic trade-offs (2pts):** Complexity vs Gains. Lead candidates MUST handle this.

Respond with ONLY valid JSON:
{
  "score": <0-10>,
  "maxScore": 10,
  "passing": <true if score >= 6>,
  "feedback": "<2 sentence scaling audit summary>",
  "whatWentWell": ["<specific bottleneck or strategy correctly identified>"],
  "improvements": ["<major scaling gap>", "<SPOF missed>"],
  "modelAnswer": "<Top bottlenecks and scaling strategies according to a high-level architect. Use clean Markdown sub-headings. NO horizontal lines.>"
}
Return ONLY the JSON object, no markdown, no extra text.`
}
