/**
 * Attempts to heal truncated or malformed JSON strings from AI responses.
 */
export function healJson(raw: string): string {
    // 1. Pre-strip: remove invisible junk and trim
    // This removes non-printable characters that can cause position-based parse errors
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

        if (escapeNext) {
            fixed += char
            escapeNext = false
            continue
        }

        if (char === '\\') {
            fixed += char
            escapeNext = true
            continue
        }

        if (char === '"') {
            inString = !inString
            fixed += char
            continue
        }

        if (inString && code < 32) {
            // Control character inside a string! Escape it.
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
    let openBraces = 0
    let openBrackets = 0
    inString = false
    escapeNext = false

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i]
        if (escapeNext) {
            escapeNext = false
            continue
        }
        if (char === '\\') {
            escapeNext = true
        } else if (char === '"') {
            inString = !inString
        } else if (!inString) {
            if (char === '{') openBraces++
            else if (char === '}') openBraces--
            else if (char === '[') openBrackets++
            else if (char === ']') openBrackets--
        }
    }

    // If we're stuck in an escape state at the very end, drop the backslash
    if (escapeNext) {
        cleaned = cleaned.substring(0, cleaned.length - 1)
    }

    const removeTrailingComma = () => {
        cleaned = cleaned.trim()
        while (cleaned.endsWith(',')) {
            cleaned = cleaned.substring(0, cleaned.length - 1).trim()
        }
    }

    // Close open string
    if (inString) {
        cleaned += '"'
    }

    // Close open brackets
    while (openBrackets > 0) {
        removeTrailingComma()
        cleaned += ']'
        openBrackets--
    }

    // Close open braces
    while (openBraces > 0) {
        removeTrailingComma()
        cleaned += '}'
        openBraces--
    }

    // Final safety: ensure no dangling comma before the last structurally valid closer
    const lastBrace = cleaned.lastIndexOf('}')
    const lastBracket = cleaned.lastIndexOf(']')
    const lastCloser = Math.max(lastBrace, lastBracket)

    if (lastCloser > 0) {
        const beforeCloser = cleaned.substring(0, lastCloser).trim()
        if (beforeCloser.endsWith(',')) {
            cleaned = beforeCloser.replace(/,+$/, '').trim() + cleaned.substring(lastCloser)
        }
    }

    // Strip trailing garbage after the final object
    const finalEnd = cleaned.lastIndexOf('}')
    if (finalEnd >= 0) {
        cleaned = cleaned.substring(0, finalEnd + 1)
    }

    return cleaned
}
