export function renderMarkdown(markdown: string): string {
    if (!markdown) return ''

    let html = markdown

    // 1. Code blocks (High priority)
    html = html.replace(/```(\w+)?[ \t]*\r?\n([\s\S]*?)```/gm, (match, lang, code) => {
        const trimmedCode = code.replace(/\n$/, '')
        const escaped = trimmedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const langLabel = lang ? `<span class="text-[10px] text-zinc-500 mb-1 block uppercase font-bold">${lang}</span>` : ''
        return `<div class="my-4"><pre class="not-prose bg-zinc-950 p-4 rounded-xl border border-zinc-800 overflow-x-auto">${langLabel}<code class="text-[11px] font-mono text-zinc-300">${escaped}</code></pre></div>`
    })

    // 2. Tables (High priority, before list/paragraph processing)
    // Resilient to various newline styles and trailing content
    html = html.replace(/\|(.+)\|\r?\n\|([\s\-|:]+)\|\r?\n((?:\|.+\|\r?\n?)*)/g, (match, header, divider, rows) => {
        const headers = header.split('|').map(h => h.trim()).filter(Boolean)
        const rowData = rows.trim().split(/\r?\n/).map(row =>
            row.split('|').map(cell => cell.trim()).filter(Boolean)
        ).filter(r => r.length > 0)

        if (headers.length === 0) return match

        let table = '<div class="overflow-x-auto my-6 border border-zinc-800 rounded-xl bg-zinc-950/50 shadow-2xl"><table class="w-full border-collapse text-[11px]"><thead><tr class="bg-zinc-900/80">'
        headers.forEach(h => {
            table += `<th class="border-b border-zinc-800 px-4 py-3 text-left font-black text-white uppercase tracking-wider">${h}</th>`
        })
        table += '</tr></thead><tbody>'

        rowData.forEach((row, idx) => {
            table += `<tr class="border-b border-zinc-900/30 hover:bg-zinc-800/40 transition-colors ${idx === rowData.length - 1 ? 'border-b-0' : ''}">`
            row.forEach(cell => {
                table += `<td class="px-4 py-3 text-zinc-300 font-medium">${cell}</td>`
            })
            table += '</tr>'
        })

        table += '</tbody></table></div>'
        return table
    })

    // 3. Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-6 w-full border border-zinc-800" loading="lazy" />')

    // 4. Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 hover:decoration-blue-500 transition-colors">$1</a>')

    // 5. Headers
    html = html.replace(/^##### (.*$)/gim, '<h5 class="text-sm font-bold text-zinc-200 mt-6 mb-2">$1</h5>')
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-bold text-white mt-8 mb-3">$1</h4>')
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-10 mb-4">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-12 mb-6 border-b border-zinc-800 pb-2">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-8 mb-6">$1</h1>')

    // 6. Bold & Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-zinc-100">$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em class="italic text-zinc-300">$1</em>')

    // 7. Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-[11px] text-blue-400 font-mono border border-zinc-700/50">$1</code>')

    // 8. Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-zinc-400 my-4 bg-blue-500/5 py-2 pr-4 rounded-r-lg">$1</blockquote>')

    // 9. Lists
    const lines = html.split(/\r?\n/)
    let inList = false
    let listType = null
    let processedLines = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const isUnordered = line.match(/^[-*+] (.+)$/)
        const isOrdered = line.match(/^\d+\. (.+)$/)

        if (isUnordered) {
            if (!inList) {
                processedLines.push('<ul class="list-disc list-inside space-y-1.5 my-4 ml-2">')
                inList = true
                listType = 'ul'
            } else if (listType === 'ol') {
                processedLines.push('</ol>')
                processedLines.push('<ul class="list-disc list-inside space-y-1.5 my-4 ml-2">')
                listType = 'ul'
            }
            processedLines.push(`<li class="text-zinc-300 text-xs">${isUnordered[1]}</li>`)
        } else if (isOrdered) {
            if (!inList) {
                processedLines.push('<ol class="list-decimal list-inside space-y-1.5 my-4 ml-2">')
                inList = true
                listType = 'ol'
            } else if (listType === 'ul') {
                processedLines.push('</ul>')
                processedLines.push('<ol class="list-decimal list-inside space-y-1.5 my-4 ml-2">')
                listType = 'ol'
            }
            processedLines.push(`<li class="text-zinc-300 text-xs">${isOrdered[1]}</li>`)
        } else {
            if (inList) {
                processedLines.push(listType === 'ul' ? '</ul>' : '</ol>')
                inList = false
                listType = null
            }
            if (line.trim().startsWith('<div') || line.trim().startsWith('<table') || line.trim().startsWith('<h')) {
                processedLines.push(line)
            } else if (line.trim()) {
                processedLines.push(line)
            } else {
                processedLines.push('')
            }
        }
    }

    if (inList) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>')
    }

    html = processedLines.join('\n')

    // 10. Paragraphs (only wrap text that isn't already in a tag)
    html = html.split('\n').map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        if (trimmed.startsWith('<')) return line
        return `<p class="mb-4 leading-relaxed text-zinc-300 text-[11px]">${line}</p>`
    }).join('\n')

    return html
}
