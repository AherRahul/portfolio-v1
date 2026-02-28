<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'

const props = defineProps<{
  code?: string
  language?: string
  readOnly?: boolean
  height?: string | number
}>()

const emit = defineEmits(['update:code', 'change'])

const container = ref<HTMLDivElement | null>(null)
let editor: any = null
let monaco: any = null

function normalizeLanguage(lang?: string): string {
  const value = (lang || '').toLowerCase()
  const map: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    jsx: 'javascript',
    md: 'markdown',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    shell: 'shell',
    text: 'plaintext',
    py: 'python',
    python: 'python',
    cpp: 'cpp',
    c: 'c',
    java: 'java',
    go: 'go',
    rust: 'rust'
  }
  return map[value] || value || 'plaintext'
}

onMounted(async () => {
  if (!container.value) return
  const loader = (await import('@monaco-editor/loader')).default
  
  // Custom path loading to ensure vs-dark etc work properly
  loader.config({
    paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs' }
  })
  
  monaco = await loader.init()

  // Set up theme
  monaco.editor.defineTheme('custom-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#09090b', // zinc-950, matches the rest of the dark mode UI
    }
  })

  editor = monaco.editor.create(container.value, {
    value: props.code || '',
    language: normalizeLanguage(props.language),
    readOnly: props.readOnly === undefined ? false : props.readOnly,
    theme: 'custom-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
    lineHeight: 22,
    padding: { top: 16, bottom: 16 },
    roundedSelection: true,
    scrollBeyondLastLine: false,
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    wordWrap: 'on'
  })
  
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    emit('update:code', value)
    emit('change', value)
  })
})

watch(
  () => props.code,
  (value) => {
    if (!editor) return
    if (value !== editor.getValue()) {
      editor.setValue(value || '')
    }
  }
)

watch(
  () => props.language,
  (value) => {
    if (!editor || !monaco) return
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, normalizeLanguage(value))
    }
  }
)

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
})

const editorHeight = computed(() => {
  if (props.height) {
    return typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return '400px' // Default interactive editor height
})
</script>

<template>
  <div class="monaco-interactive-wrapper relative border border-zinc-800 rounded-lg overflow-hidden my-4">
    <!-- Header/Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
      <div class="flex items-center gap-2">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
        </div>
        <span v-if="language" class="ml-2 text-xs font-mono text-zinc-400 uppercase">{{ language }}</span>
      </div>
    </div>
    
    <!-- Editor Container -->
    <div ref="container" class="monaco-editor-container w-full" :style="{ height: editorHeight }" />
  </div>
</template>

<style scoped>
.monaco-interactive-wrapper {
  background-color: #09090b;
}

:deep(.monaco-editor) {
  padding-top: 8px;
}
</style>
