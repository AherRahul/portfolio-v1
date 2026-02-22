/**
 * Attempts to heal truncated JSON strings from AI responses.
 * Handles unclosed strings, brackets, and braces.
 */
export function healJson(raw: string): string {
    let cleaned = raw.trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')

    if (start >= 0 && end >= 0) {
        cleaned = cleaned.substring(start, end + 1)
        // Basic check: try to parse it. If it fails, it might still have unclosed strings inside
        // even if it has a closing brace (e.g. if the AI added extra text after the JSON)
        try {
            JSON.parse(cleaned)
            return cleaned
        } catch (e) {
            // If it fails, continue to healing logic below
        }
    }

    if (start >= 0) {
        cleaned = cleaned.substring(start)

        // Count unclosed characters
        let openBraces = 0
        let openBrackets = 0
        let inString = false
        let escapeNext = false

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

        if (inString) cleaned += '"'
        while (openBrackets > 0) {
            cleaned += ']'
            openBrackets--
        }
        while (openBraces > 0) {
            cleaned += '}'
            openBraces--
        }

        // Final attempt to find a valid JSON sub-structure if healing added too many closing braces
        // or if there's trailing garbage
        try {
            JSON.parse(cleaned)
        } catch (e) {
            // If still failing, try to find the last valid structure by stripping one char at a time
            // Though the above logic should handle most truncation cases.
        }
    }

    return cleaned
}
