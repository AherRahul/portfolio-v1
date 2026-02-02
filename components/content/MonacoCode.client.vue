<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  code: string
  language?: string
}>()

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
    text: 'plaintext'
  }
  return map[value] || value || 'plaintext'
}

function updateHeight() {
  if (!editor || !container.value || !monaco) return
  const model = editor.getModel()
  const lineCount = model ? model.getLineCount() : 1
  const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
  const padding = editor.getOption(monaco.editor.EditorOption.padding)
  const paddingTop = padding?.top || 0
  const paddingBottom = padding?.bottom || 0
  const height = lineCount * lineHeight + paddingTop + paddingBottom + 8
  container.value.style.height = `${height}px`
  editor.layout()
}

onMounted(async () => {
  if (!container.value) return
  const loader = (await import('@monaco-editor/loader')).default
  loader.config({
    paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs' }
  })
  monaco = await loader.init()
  editor = monaco.editor.create(container.value, {
    value: props.code,
    language: normalizeLanguage(props.language),
    readOnly: true,
    theme: 'vs-dark',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    wordWrap: 'on',
    wordWrapMinified: true,
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'auto',
      alwaysConsumeMouseWheel: false
    },
    lineNumbers: 'on',
    renderLineHighlight: 'none',
    renderValidationDecorations: 'off',
    padding: { top: 12, bottom: 12 }
  })
  updateHeight()
})

watch(
  () => props.code,
  (value) => {
    if (!editor) return
    editor.setValue(value || '')
    updateHeight()
  }
)

watch(
  () => props.language,
  (value) => {
    if (!editor || !monaco) return
    const model = editor.getModel()
    if (model) monaco.editor.setModelLanguage(model, normalizeLanguage(value))
  }
)

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
})
</script>

<template>
  <div ref="container" class="monaco-editor-container" />
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>

