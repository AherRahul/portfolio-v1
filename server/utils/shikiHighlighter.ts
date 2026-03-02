import { createHighlighter, type Highlighter } from 'shiki'

// Singleton highlighter — created once per server process lifetime
let highlighterInstance: Highlighter | null = null

const SUPPORTED_LANGS = [
    'javascript', 'typescript', 'java', 'python', 'cpp', 'c', 'go', 'rust',
    'bash', 'sh', 'json', 'yaml', 'html', 'css', 'sql', 'kotlin', 'swift',
    'ruby', 'php', 'scala', 'r', 'dart', 'plaintext', 'text', 'txt'
]

async function getHighlighter(): Promise<Highlighter> {
    if (!highlighterInstance) {
        highlighterInstance = await createHighlighter({
            themes: ['vitesse-dark'],
            langs: SUPPORTED_LANGS,
        })
    }
    return highlighterInstance
}

/**
 * Scan the input markdown string for fenced code blocks (``` ... ```)
 * and replace them with Shiki-highlighted HTML.
 * Non-code text is left untouched.
 */
export async function highlightCodeBlocks(markdown: string): Promise<string> {
    const highlighter = await getHighlighter()

    // Matches: ``` optionalLang\n code \n```
    const codeFenceRegex = /```([\w+-]*)[ \t]*\n([\s\S]*?)```/g

    const promises: Promise<void>[] = []
    const replacements = new Map<string, string>()

    let match: RegExpExecArray | null
    while ((match = codeFenceRegex.exec(markdown)) !== null) {
        const full = match[0]
        const lang = (match[1] || 'plaintext').toLowerCase().trim()
        const code = match[2]

        // Normalise the language — fallback to plaintext if unsupported
        const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'plaintext'

        // Avoid duplicate work for identical blocks
        if (!replacements.has(full)) {
            replacements.set(full, '') // placeholder
            const p = (async () => {
                try {
                    const html = highlighter.codeToHtml(code, {
                        lang: resolvedLang,
                        theme: 'vitesse-dark',
                    })
                    // Wrap in a div so renderMarkdown won't wrap it in <p>
                    replacements.set(
                        full,
                        `<div class="shiki-code-block not-prose" data-lang="${lang}">${html}</div>`
                    )
                } catch {
                    // Fallback: escaped plain pre/code
                    const escaped = code
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                    replacements.set(
                        full,
                        `<div class="code-block-wrapper"><pre class="not-prose"><span class="code-lang-label">${lang}</span><code>${escaped}</code></pre></div>`
                    )
                }
            })()
            promises.push(p)
        }
    }

    await Promise.all(promises)

    // Replace all code fences with their highlighted equivalents
    return markdown.replace(codeFenceRegex, (full) => replacements.get(full) ?? full)
}
