export function renderMarkdown(markdown: string): string {
    if (!markdown) return ''

    let html = markdown

    // Pre-processing: Standardize newlines
    html = html.replace(/\r\n/g, '\n')

    // 1. Code blocks (High priority)
    // Perfectly closed blocks
    html = html.replace(/```(\w+)?[ \t]*\n([\s\S]*?)```/gm, (match, lang, code) => {
        const trimmedCode = code.trim()
        const escaped = trimmedCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const langLabel = lang ? `<span class="code-lang-label">${lang}</span>` : ''
        return `<div class="code-block-wrapper"><pre class="not-prose">${langLabel}<code>${escaped}</code></pre></div>`
    })

    // Unclosed blocks
    html = html.replace(/```(\w+)?[ \t]*\n([\s\S]*?)$/gm, (match, lang, code) => {
        const trimmedCode = code.trim()
        const escaped = trimmedCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const langLabel = lang ? `<span class="code-lang-label">${lang}</span>` : ''
        return `<div class="code-block-wrapper"><pre class="not-prose">${langLabel}<code>${escaped}</code></pre></div>`
    })

    // 2. Tables
    html = html.replace(/\|(.+)\|\n\|([\s\-|:]+)\|\n((?:\|.+\|\n?)*)/g, (match, header, divider, rows) => {
        const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean)
        const rowData = rows.trim().split('\n').map((row: string) =>
            row.split('|').map((cell: string) => cell.trim()).filter(Boolean)
        ).filter((r: string[]) => r.length > 0)

        if (headers.length === 0) return match

        let table = '<div class="table-wrapper"><table><thead><tr>'
        headers.forEach((h: string) => {
            table += `<th>${h}</th>`
        })
        table += '</tr></thead><tbody>'

        rowData.forEach((row: string[]) => {
            table += '<tr>'
            row.forEach((cell: string) => {
                table += `<td>${cell}</td>`
            })
            table += '</tr>'
        })

        table += '</tbody></table></div>'
        return table
    })

    // 3. Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')

    // 4. Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')

    // 5. Headers
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // 6. Bold & Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

    // 7. Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // 8. Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>')

    // 9. Lists (Unordered and Ordered)
    const lines = html.split('\n')
    let processedLines = []
    let listStack: ('ul' | 'ol')[] = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const ulMatch = line.match(/^[-*+] (.+)$/)
        const olMatch = line.match(/^\d+\. (.+)$/)

        if (ulMatch) {
            if (listStack[listStack.length - 1] !== 'ul') {
                if (listStack.length > 0) processedLines.push(`</${listStack.pop()}>`)
                processedLines.push('<ul>')
                listStack.push('ul')
            }
            processedLines.push(`<li>${ulMatch[1]}</li>`)
        } else if (olMatch) {
            if (listStack[listStack.length - 1] !== 'ol') {
                if (listStack.length > 0) processedLines.push(`</${listStack.pop()}>`)
                processedLines.push('<ol>')
                listStack.push('ol')
            }
            processedLines.push(`<li>${olMatch[1]}</li>`)
        } else {
            while (listStack.length > 0) {
                processedLines.push(`</${listStack.pop()}>`)
            }
            processedLines.push(line)
        }
    }
    while (listStack.length > 0) {
        processedLines.push(`</${listStack.pop()}>`)
    }

    // 10. Paragraph wrapping - more selective to avoid wrapping tags and already wrapped lines
    html = processedLines.join('\n')
    const finalLines = html.split('\n').map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        // Don't wrap if it already starts with a common block tag
        const blockTags = ['<div', '<table', '<h1', '<h2', '<h3', '<h4', '<h5', '<h6', '<ul', '<ol', '<li', '<pre', '<blockquote', '<img', '<p', '</ul', '</ol', '</tr>', '</td>']
        if (blockTags.some(tag => trimmed.toLowerCase().startsWith(tag))) return line
        return `<p>${line}</p>`
    })

    return finalLines.join('\n')
}
