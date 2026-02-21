<script setup lang="ts">
import loader from '@monaco-editor/loader'

const props = defineProps<{
  modelValue: string
  language: string
  path: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const editorRef = ref<HTMLElement | null>(null)
let editor: any = null

onMounted(async () => {
  if (process.client) {
    const monaco = await loader.init()
    
    // Set theme
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#09090b', // zinc-950
      }
    })

    editor = monaco.editor.create(editorRef.value!, {
      value: props.modelValue,
      language: props.language === 'python' ? 'python' : props.language === 'cpp' ? 'cpp' : props.language,
      theme: 'custom-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
      lineHeight: 20,
      padding: { top: 16, bottom: 16 },
      roundedSelection: true,
      scrollBeyondLastLine: false,
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
    })

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue()
      emit('update:modelValue', value)
      emit('change', value)
    })
  }
})

// Update editor when modelValue changes externally (e.g. switching files)
watch(() => props.modelValue, (newVal) => {
  if (editor && newVal !== editor.getValue()) {
    editor.setValue(newVal)
  }
})

// Update language when props change
watch(() => props.language, (newLang) => {
  if (editor) {
    const monaco = (window as any).monaco
    if (monaco) {
      monaco.editor.setModelLanguage(editor.getModel(), newLang === 'python' ? 'python' : newLang === 'cpp' ? 'cpp' : newLang)
    }
  }
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>

<template>
  <div ref="editorRef" class="w-full h-full" />
</template>

<style scoped>
:deep(.monaco-editor) {
  padding-top: 8px;
}
</style>
