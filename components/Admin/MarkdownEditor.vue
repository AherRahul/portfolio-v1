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
const frontmatterEditorEnhanced = ref()

// Floating toolbar state
const toolbarPosition = ref({ x: 20, y: 20 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const toolbarRef = ref<HTMLElement | null>(null)
const isToolbarFloating = ref(false)

// Load toolbar position from localStorage
onMounted(() => {
  const savedPosition = localStorage.getItem('markdown-editor-toolbar-position')
  const savedFloating = localStorage.getItem('markdown-editor-toolbar-floating')
  if (savedPosition) {
    try {
      toolbarPosition.value = JSON.parse(savedPosition)
    } catch (e) {
      console.error('Failed to parse toolbar position:', e)
    }
  }
  if (savedFloating === 'true') {
    isToolbarFloating.value = true
  }
})

// Save toolbar position to localStorage
function saveToolbarPosition() {
  localStorage.setItem('markdown-editor-toolbar-position', JSON.stringify(toolbarPosition.value))
  localStorage.setItem('markdown-editor-toolbar-floating', String(isToolbarFloating.value))
}

// Toggle floating toolbar
function toggleFloatingToolbar() {
  isToolbarFloating.value = !isToolbarFloating.value
  saveToolbarPosition()
}

// Drag handlers
function startDrag(e: MouseEvent) {
  if (!isToolbarFloating.value) return
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - toolbarPosition.value.x,
    y: e.clientY - toolbarPosition.value.y
  }
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

function handleDrag(e: MouseEvent) {
  if (!isDragging.value) return
  
  const newX = e.clientX - dragStart.value.x
  const newY = e.clientY - dragStart.value.y
  
  // Constrain to viewport
  const maxX = window.innerWidth - (toolbarRef.value?.offsetWidth || 400)
  const maxY = window.innerHeight - (toolbarRef.value?.offsetHeight || 60)
  
  toolbarPosition.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  saveToolbarPosition()
}

// Parse markdown for preview - completely strip frontmatter
const parsedContent = computed(() => {
  if (!content.value) return { frontmatter: {}, body: '' }
  
  let body = content.value
  let frontmatter: any = {}
  
  // More robust frontmatter parser - strip everything between --- delimiters
  // Try multiple patterns to catch edge cases
  const frontmatterPatterns = [
    /^---\s*\r?\n([\s\S]*?)\r?\n\s*---\s*\r?\n?/,  // Standard with optional \r
    /^---\s*\n([\s\S]*?)\n\s*---\s*\n?/,           // Standard Unix
    /^---\s*\r\n([\s\S]*?)\r\n\s*---\s*\r\n?/,     // Windows style
  ]
  
  let match: RegExpMatchArray | null = null
  for (const pattern of frontmatterPatterns) {
    match = content.value.match(pattern)
    if (match) break
  }
  
  if (match) {
    // Extract frontmatter content
    const frontmatterContent = match[1].trim()
    
    // Parse frontmatter (simple YAML-like parsing)
    frontmatterContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine || trimmedLine.startsWith('#')) return
      
      const colonIndex = trimmedLine.indexOf(':')
      if (colonIndex > -1) {
        const key = trimmedLine.substring(0, colonIndex).trim()
        let value = trimmedLine.substring(colonIndex + 1).trim()
        // Remove quotes
        value = value.replace(/^["']|["']$/g, '')
        frontmatter[key] = value
      }
    })
    
    // Remove frontmatter block completely from body
    body = content.value.replace(match[0], '').trim()
  } else {
    // Fallback: if no frontmatter delimiters found, check if content starts with YAML-like structure
    // and remove it manually
    const lines = content.value.split('\n')
    if (lines.length > 0 && lines[0].trim() === '---') {
      // Find closing ---
      let endIndex = -1
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
          endIndex = i
          break
        }
      }
      if (endIndex > -1) {
        // Remove frontmatter lines (including the --- delimiters)
        body = lines.slice(endIndex + 1).join('\n').trim()
      }
    }
  }
  
  // Final safety check: remove any remaining frontmatter-like patterns
  body = body.replace(/^---[\s\S]*?---\s*\n?/m, '')
  
  return {
    frontmatter,
    body: body.trim()
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
  html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)*)/g, (match: string, header: string, rows: string) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean)
    const rowData = rows.trim().split('\n').map((row: string) => 
      row.split('|').map((cell: string) => cell.trim()).filter(Boolean)
    )
    
    let table = '<table class="w-full border-collapse my-6"><thead><tr>'
    headers.forEach((h: string) => {
      table += `<th class="border border-zinc-700 bg-zinc-800 px-4 py-2 text-left font-semibold">${h}</th>`
    })
    table += '</tr></thead><tbody>'
    
    rowData.forEach((row: string[]) => {
      table += '<tr>'
      row.forEach((cell: string) => {
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

let draftTimeout: ReturnType<typeof setTimeout> | null = null
watch(content, (newValue) => {
  if (draftKey.value) {
    if (draftTimeout) clearTimeout(draftTimeout)
    draftTimeout = setTimeout(() => {
      localStorage.setItem(draftKey.value!, newValue)
    }, 1000)
  }
})

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
  <div class="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative">
    <!-- Floating Toolbar Toggle Button -->
    <button
      @click="toggleFloatingToolbar"
      class="absolute top-2 right-2 z-30 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md p-1.5 transition-colors"
      :title="isToolbarFloating ? 'Dock Toolbar' : 'Float Toolbar'"
    >
      <Icon :name="isToolbarFloating ? 'heroicons:arrows-pointing-in' : 'heroicons:arrows-pointing-out'" class="text-zinc-300 text-sm" />
    </button>

    <!-- Toolbar - Can be fixed or floating -->
    <div
      ref="toolbarRef"
      :class="[
        isToolbarFloating 
          ? 'fixed rounded-lg shadow-2xl border-2 border-zinc-600' 
          : 'flex-shrink-0 border-b',
        'z-20 bg-zinc-800 border-zinc-700 p-2 flex items-center gap-1 flex-wrap',
        isDragging ? 'cursor-move select-none' : ''
      ]"
      :style="isToolbarFloating ? {
        left: `${toolbarPosition.x}px`,
        top: `${toolbarPosition.y}px`,
        maxWidth: '90vw'
      } : {}"
    >
      <!-- Drag Handle (only visible when floating) -->
      <div
        v-if="isToolbarFloating"
        @mousedown="startDrag"
        class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-zinc-600 rounded-full cursor-move hover:bg-zinc-500 transition-colors"
        title="Drag to move"
      ></div>
      
      <!-- Toolbar Content -->
      <div class="flex items-center gap-1 flex-wrap w-full">
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
    </div>
    
    <!-- Spacer when toolbar is floating -->
    <div v-if="isToolbarFloating" class="h-2"></div>
    
    <!-- Editor/Preview Area - Scrollable content -->
    <div class="flex-1 flex overflow-hidden min-h-0">
      <!-- Editor -->
      <div :class="showPreview ? 'w-1/2 border-r border-zinc-700' : 'w-full'" >
        <textarea
          v-model="content"
          @keydown="handleKeyDown"
          class="w-full min-h-full p-6 bg-zinc-900 text-zinc-100 font-mono text-sm resize-none focus:outline-none leading-relaxed"
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
        <div class="p-4 max-w-4xl mx-auto" style="min-height: 600px; height: 600px;">
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

h4 {
  margin-bottom: 0.5rem !important
}
</style>

