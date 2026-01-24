<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  filePath?: string
  contentType?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'save': []
  'view-on-site': []
}>()

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showPreview = ref(false)
const saving = ref(false)
const showMediaUploader = ref(false)
const frontmatterEditorEnhanced = ref()

// Parse markdown for preview
const parsedContent = computed(() => {
  if (!content.value) return { frontmatter: {}, body: '' }
  
  // Simple frontmatter parser
  const lines = content.value.split('\n')
  let inFrontmatter = false
  let frontmatterLines: string[] = []
  let bodyLines: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (i === 0 && line.trim() === '---') {
      inFrontmatter = true
      continue
    }
    
    if (inFrontmatter && line.trim() === '---') {
      inFrontmatter = false
      continue
    }
    
    if (inFrontmatter) {
      frontmatterLines.push(line)
    } else {
      bodyLines.push(line)
    }
  }
  
  // Parse frontmatter
  const frontmatter: any = {}
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '')
      frontmatter[key] = value
    }
  })
  
  return {
    frontmatter,
    body: bodyLines.join('\n')
  }
})

// Render markdown to HTML (enhanced rendering)
const renderedHTML = computed(() => {
  let html = parsedContent.value.body
  
  // Escape HTML entities first
  const tempDiv = document.createElement('div')
  
  // Process in order of precedence
  
  // 1. Code blocks (process before other replacements)
  // Match code blocks with optional language identifier
  // Format: ```language (optional) followed by code content and closing ```
  html = html.replace(/```(\w+)?[ \t]*\r?\n([\s\S]*?)```/gm, (match, lang, code) => {
    // Trim trailing newlines from code content
    const trimmedCode = code.replace(/\n$/, '')
    const escaped = trimmedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const langLabel = lang ? `<span class="text-xs text-zinc-400 mb-2 block">${lang}</span>` : ''
    return `<pre class="not-prose bg-zinc-800 p-4 rounded my-4 overflow-x-auto border border-zinc-700">${langLabel}<code class="text-sm text-zinc-100">${escaped}</code></pre>`
  })
  
  // 2. Images (must be before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-6 w-full" loading="lazy" />')
  
  // 3. Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-red-500 hover:text-red-600 underline decoration-red-500/30 hover:decoration-red-500 transition-colors">$1</a>')
  
  // 4. Headers (with proper spacing)
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-lg font-semibold mt-6 mb-3">$1</h5>')
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold mt-8 mb-4">$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-10 mb-4">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-12 mb-6">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-8 mb-6">$1</h1>')
  
  // 5. Bold (before italic to handle ***)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold"><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
  
  // 6. Italic
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  
  // 7. Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="not-prose bg-zinc-800 px-2 py-0.5 rounded text-sm text-red-400 font-mono">$1</code>')
  
  // 8. Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-8 border-zinc-700" />')
  
  // 9. Blockquotes
  html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-red-500 pl-4 italic text-zinc-400 my-4">$1</blockquote>')
  
  // 9.5. Tables (basic support)
  html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
    const headers = header.split('|').map(h => h.trim()).filter(Boolean)
    const rowData = rows.trim().split('\n').map(row => 
      row.split('|').map(cell => cell.trim()).filter(Boolean)
    )
    
    let table = '<table class="w-full border-collapse my-6"><thead><tr>'
    headers.forEach(h => {
      table += `<th class="border border-zinc-700 bg-zinc-800 px-4 py-2 text-left font-semibold">${h}</th>`
    })
    table += '</tr></thead><tbody>'
    
    rowData.forEach(row => {
      table += '<tr>'
      row.forEach(cell => {
        table += `<td class="border border-zinc-700 px-4 py-2">${cell}</td>`
      })
      table += '</tr>'
    })
    
    table += '</tbody></table>'
    return table
  })
  
  // 10. Lists - handle multi-line lists properly
  const lines = html.split('\n')
  let inList = false
  let listType = null
  let processedLines = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const isUnordered = line.match(/^[-*+] (.+)$/)
    const isOrdered = line.match(/^\d+\. (.+)$/)
    
    if (isUnordered) {
      if (!inList) {
        processedLines.push('<ul class="list-disc list-inside space-y-2 my-4 ml-4">')
        inList = true
        listType = 'ul'
      } else if (listType === 'ol') {
        processedLines.push('</ol>')
        processedLines.push('<ul class="list-disc list-inside space-y-2 my-4 ml-4">')
        listType = 'ul'
      }
      processedLines.push(`<li class="text-zinc-200">${isUnordered[1]}</li>`)
    } else if (isOrdered) {
      if (!inList) {
        processedLines.push('<ol class="list-decimal list-inside space-y-2 my-4 ml-4">')
        inList = true
        listType = 'ol'
      } else if (listType === 'ul') {
        processedLines.push('</ul>')
        processedLines.push('<ol class="list-decimal list-inside space-y-2 my-4 ml-4">')
        listType = 'ol'
      }
      processedLines.push(`<li class="text-zinc-200">${isOrdered[1]}</li>`)
    } else {
      if (inList) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>')
        inList = false
        listType = null
      }
      processedLines.push(line)
    }
  }
  
  if (inList) {
    processedLines.push(listType === 'ul' ? '</ul>' : '</ol>')
  }
  
  html = processedLines.join('\n')
  
  // 11. Paragraphs (split by double newlines, but not in code blocks or lists)
  html = html.replace(/\n\n+/g, '</p><p class="mb-4 leading-relaxed text-zinc-200">')
  
  // Wrap in paragraph if not already wrapped
  if (!html.trim().startsWith('<')) {
    html = '<p class="mb-4 leading-relaxed text-zinc-200">' + html + '</p>'
  }
  
  // Clean up empty paragraphs
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '')
  
  return html
})

// Editor toolbar actions
function insertMarkdown(before: string, after: string = '') {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  
  const newText = content.value.substring(0, start) + before + selectedText + after + content.value.substring(end)
  content.value = newText
  
  // Set cursor position
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, end + before.length)
  })
}

function insertHeading(level: number) {
  insertMarkdown('#'.repeat(level) + ' ', '\n')
}

function insertBold() {
  insertMarkdown('**', '**')
}

function insertItalic() {
  insertMarkdown('*', '*')
}

function insertCode() {
  insertMarkdown('`', '`')
}

function handleMediaUpload(url: string, type: string) {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return
  
  const start = textarea.selectionStart
  
  let markdown = ''
  if (type === 'image') {
    markdown = `![Image](${url})`
  } else if (type === 'pdf') {
    markdown = `[Download PDF](${url})`
  } else {
    markdown = `[Resource](${url})`
  }
  
  const newText = content.value.substring(0, start) + markdown + content.value.substring(start)
  content.value = newText
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + markdown.length, start + markdown.length)
  })
}

function openMediaUploader() {
  showMediaUploader.value = true
}

function openFrontmatterEditor() {
  frontmatterEditorEnhanced.value?.openEditor()
}

function insertCodeBlock() {
  insertMarkdown('```javascript\n', '\n```\n')
}

function insertLink() {
  insertMarkdown('[', '](url)')
}

function insertImage() {
  insertMarkdown('![alt text](', ')')
}

function insertList() {
  insertMarkdown('- ', '\n')
}

function insertTable() {
  const table = `| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
`
  insertMarkdown(table, '')
}

// Keyboard shortcuts
function handleKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key.toLowerCase()) {
      case 's':
        event.preventDefault()
        emit('save')
        break
      case 'b':
        event.preventDefault()
        insertBold()
        break
      case 'i':
        event.preventDefault()
        insertItalic()
        break
    }
  }
}

// Auto-save draft to localStorage
const draftKey = computed(() => props.filePath ? `admin-draft-${props.filePath}` : null)

watch(content, (newValue) => {
  if (draftKey.value) {
    localStorage.setItem(draftKey.value, newValue)
  }
}, { debounce: 1000 })

onMounted(() => {
  // Restore draft if exists
  if (draftKey.value) {
    const draft = localStorage.getItem(draftKey.value)
    if (draft && draft !== content.value) {
      const restore = confirm('A draft was found. Would you like to restore it?')
      if (restore) {
        content.value = draft
      }
    }
  }
})

function clearDraft() {
  if (draftKey.value) {
    localStorage.removeItem(draftKey.value)
  }
}

defineExpose({ clearDraft })
</script>

<template>
  <div class="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="bg-zinc-800 border-b border-zinc-700 p-2 flex items-center gap-1 flex-wrap">
      <!-- Headings -->
      <div class="flex gap-1 border-r border-zinc-700 pr-2 mr-2">
        <button
          v-for="level in [1, 2, 3]"
          :key="level"
          @click="insertHeading(level)"
          class="px-2 py-1 hover:bg-zinc-700 rounded text-sm font-semibold"
          :title="`Heading ${level}`"
        >
          H{{ level }}
        </button>
      </div>
      
      <!-- Formatting -->
      <button
        @click="insertBold"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Bold (Ctrl+B)"
      >
        <Icon name="heroicons:bold" />
      </button>
      <button
        @click="insertItalic"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Italic (Ctrl+I)"
      >
        <Icon name="heroicons:italic" />
      </button>
      <button
        @click="insertCode"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Inline Code"
      >
        <Icon name="heroicons:code-bracket" />
      </button>
      
      <div class="border-l border-zinc-700 h-6 mx-2"></div>
      
      <!-- Inserts -->
      <button
        @click="insertCodeBlock"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Code Block"
      >
        <Icon name="heroicons:code-bracket-square" />
      </button>
      <button
        @click="insertLink"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Link"
      >
        <Icon name="heroicons:link" />
      </button>
      <button
        @click="insertImage"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Image"
      >
        <Icon name="heroicons:photo" />
      </button>
      <button
        @click="insertList"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="List"
      >
        <Icon name="heroicons:list-bullet" />
      </button>
      <button
        @click="insertTable"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Table"
      >
        <Icon name="heroicons:table-cells" />
      </button>
      
      <div class="border-l border-zinc-700 h-6 mx-2"></div>
      
      <!-- Media Upload -->
      <button
        @click="openMediaUploader"
        class="px-2 py-1 hover:bg-zinc-700 rounded"
        title="Upload Image/PDF to Cloudinary"
      >
        <Icon name="heroicons:cloud-arrow-up" />
      </button>
      
      <div class="border-l border-zinc-700 h-6 mx-2"></div>
      
      <!-- Preview Toggle -->
      <button
        @click="showPreview = !showPreview"
        :class="showPreview ? 'bg-zinc-700' : 'hover:bg-zinc-700'"
        class="px-2 py-1 rounded"
        title="Toggle Preview"
      >
        <Icon name="heroicons:eye" />
      </button>
    </div>
    
    <!-- Editor/Preview Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Editor -->
      <div :class="showPreview ? 'w-1/2 border-r border-zinc-700' : 'w-full'" style="min-height: 500px;">
        <textarea
          v-model="content"
          @keydown="handleKeyDown"
          class="w-full h-full p-6 bg-zinc-900 text-zinc-100 font-mono text-sm resize-none focus:outline-none leading-relaxed"
          placeholder="Start writing your markdown content..."
          spellcheck="false"
        ></textarea>
      </div>
      
      <!-- Preview -->
      <div v-if="showPreview" class="w-1/2 overflow-y-auto bg-zinc-900">
        <!-- Preview Header -->
        <div class="sticky top-0 bg-zinc-800 border-b border-zinc-700 px-4 py-2 z-10">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-zinc-400">PREVIEW</span>
            <span class="text-xs text-zinc-500">Live render</span>
          </div>
        </div>
        
        <!-- Rendered Content (Matches live site styling) -->
        <div class="p-8 max-w-4xl mx-auto">
          <article class="prose prose-lg prose-invert prose-zinc max-w-none">
            <div v-html="renderedHTML" class="text-zinc-100"></div>
          </article>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="bg-zinc-800 border-t border-zinc-700 px-4 py-2 flex items-center justify-between text-sm text-zinc-400">
      <div class="flex items-center gap-4">
        <span>{{ content.split('\n').length }} lines</span>
        <span>{{ content.length }} characters</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs">Ctrl+S to save</span>
      </div>
    </div>
    
    <!-- Media Uploader Modal -->
    <AdminMediaUploader
      v-model="showMediaUploader"
      @upload-complete="handleMediaUpload"
    />
    
    <!-- Frontmatter Editor Enhanced -->
    <AdminFrontmatterEditorEnhanced
      ref="frontmatterEditorEnhanced"
      v-model="content"
      :content-type="contentType || 'articles'"
      :file-path="filePath"
      @save="emit('save')"
    />
  </div>
</template>

<style scoped>
textarea {
  tab-size: 2;
}

/* Enhanced preview styling */
:deep(.prose) {
  color: #e4e4e7; /* zinc-200 */
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  color: #fafafa; /* zinc-50 */
  font-weight: 700;
}

:deep(.prose a) {
  text-decoration: underline;
  text-decoration-color: rgba(239, 68, 68, 0.3);
  transition: all 0.2s;
}

:deep(.prose a:hover) {
  text-decoration-color: rgba(239, 68, 68, 1);
}

:deep(.prose code) {
  background: #27272a; /* zinc-800 */
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: #f87171; /* red-400 */
}

:deep(.prose pre) {
  background: #18181b !important; /* zinc-900 */
  border: 1px solid #3f3f46; /* zinc-700 */
  border-radius: 0.5rem;
  padding: 1rem;
}

:deep(.prose pre code) {
  background: transparent;
  padding: 0;
  color: #e4e4e7;
}

:deep(.prose img) {
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

:deep(.prose ul),
:deep(.prose ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

:deep(.prose li) {
  margin: 0.5rem 0;
  color: #e4e4e7;
}

:deep(.prose blockquote) {
  border-left: 4px solid #ef4444; /* red-500 */
  padding-left: 1rem;
  font-style: italic;
  color: #a1a1aa; /* zinc-400 */
  margin: 1rem 0;
}

:deep(.prose hr) {
  border-color: #3f3f46; /* zinc-700 */
  margin: 2rem 0;
}

:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

:deep(.prose th),
:deep(.prose td) {
  border: 1px solid #3f3f46;
  padding: 0.75rem;
  text-align: left;
}

:deep(.prose th) {
  background: #27272a;
  font-weight: 600;
}

:deep(.prose strong) {
  color: #fafafa;
  font-weight: 600;
}

:deep(.prose em) {
  color: #d4d4d8;
}
</style>

