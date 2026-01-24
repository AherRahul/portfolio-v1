<script setup lang="ts">
import { parse, stringify } from 'yaml'

const props = defineProps<{
  modelValue: string
  contentType: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showEditor = ref(false)
const frontmatterFields = ref<Record<string, any>>({})

// Parse frontmatter from content
const parsedFrontmatter = computed(() => {
  const match = props.modelValue.match(/^---\n([\s\S]*?)\n---/)
  if (match && match[1]) {
    try {
      return parse(match[1])
    } catch (e) {
      console.warn('Failed to parse frontmatter:', e)
      return {}
    }
  }
  return {}
})

// Get content body without frontmatter
const contentBody = computed(() => {
  const match = props.modelValue.match(/^---\n[\s\S]*?\n---\n([\s\S]*)/)
  return match ? match[1] : props.modelValue
})

// Field definitions for different content types
const fieldDefinitions = computed(() => {
  const commonFields = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea', required: false }
  ]

  switch (props.contentType) {
    case 'articles':
      return [
        ...commonFields,
        { key: 'datePublished', label: 'Date Published', type: 'date', required: true },
        { key: 'dateModified', label: 'Date Modified', type: 'date', required: true },
        { key: 'imageSrc', label: 'Image URL', type: 'text', required: false },
        { key: 'imageAlt', label: 'Image Alt Text', type: 'text', required: false },
        { key: 'topics', label: 'Topics (comma-separated)', type: 'tags', required: false },
        { key: 'courseName', label: 'Course Name', type: 'text', required: false },
        { key: 'showOnArticles', label: 'Show on Articles Page', type: 'boolean', required: false }
      ]
    
    case 'courses':
      return [
        ...commonFields,
        { key: 'tutor', label: 'Tutor ID', type: 'number', required: false },
        { key: 'time', label: 'Duration', type: 'text', required: false },
        { key: 'video', label: 'Has Video', type: 'boolean', required: false },
        { key: 'topics', label: 'Topics (comma-separated)', type: 'tags', required: false },
        { key: 'content', label: 'Content Items (comma-separated)', type: 'tags', required: false }
      ]
    
    case 'projects':
      return [
        ...commonFields,
        { key: 'datePublished', label: 'Date Published', type: 'date', required: false },
        { key: 'imageSrc', label: 'Image URL', type: 'text', required: false },
        { key: 'imageAlt', label: 'Image Alt Text', type: 'text', required: false },
        { key: 'topics', label: 'Topics (comma-separated)', type: 'tags', required: false },
        { key: 'url', label: 'Project URL', type: 'text', required: false },
        { key: 'github', label: 'GitHub URL', type: 'text', required: false }
      ]
    
    case 'learning':
      return [
        ...commonFields,
        { key: 'datePublished', label: 'Date Published', type: 'date', required: false },
        { key: 'topics', label: 'Topics (comma-separated)', type: 'tags', required: false }
      ]
    
    case 'npmpackages':
      return [
        ...commonFields,
        { key: 'packageName', label: 'Package Name', type: 'text', required: true },
        { key: 'version', label: 'Version', type: 'text', required: false },
        { key: 'url', label: 'NPM URL', type: 'text', required: false },
        { key: 'github', label: 'GitHub URL', type: 'text', required: false },
        { key: 'topics', label: 'Topics (comma-separated)', type: 'tags', required: false }
      ]
    
    default:
      return commonFields
  }
})

// Initialize fields when editor opens
watch(showEditor, (isOpen) => {
  if (isOpen) {
    frontmatterFields.value = { ...parsedFrontmatter.value }
  }
})

function openEditor() {
  showEditor.value = true
}

function closeEditor() {
  showEditor.value = false
}

function handleSave() {
  try {
    // Convert tags back to arrays
    const processedFields = { ...frontmatterFields.value }
    
    fieldDefinitions.value.forEach(field => {
      if (field.type === 'tags' && typeof processedFields[field.key] === 'string') {
        processedFields[field.key] = processedFields[field.key]
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      }
    })
    
    // Generate new frontmatter
    const newFrontmatter = stringify(processedFields)
    
    // Combine with body
    const newContent = `---\n${newFrontmatter}---\n${contentBody.value}`
    
    emit('update:modelValue', newContent)
    showEditor.value = false
  } catch (error) {
    console.error('Failed to save frontmatter:', error)
    alert('Failed to save frontmatter. Please check your inputs.')
  }
}

function getFieldValue(key: string) {
  const value = frontmatterFields.value[key]
  
  // Convert arrays to comma-separated strings for tags
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  
  return value ?? ''
}

function setFieldValue(key: string, value: any) {
  frontmatterFields.value[key] = value
}

defineExpose({ openEditor })
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <button
      @click="openEditor"
      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors text-sm"
      title="Edit Frontmatter"
    >
      <Icon name="heroicons:document-text" />
      Edit Metadata
    </button>

    <!-- Editor Modal -->
    <Teleport to="body">
      <div
        v-if="showEditor"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 overflow-y-auto"
        @click.self="closeEditor"
      >
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-3xl w-full my-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-semibold">Edit Frontmatter</h3>
              <p class="text-sm text-zinc-500 mt-1">Configure metadata for {{ contentType }}</p>
            </div>
            <button
              @click="closeEditor"
              class="text-zinc-400 hover:text-white"
            >
              <Icon name="heroicons:x-mark" class="text-2xl" />
            </button>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div
              v-for="field in fieldDefinitions"
              :key="field.key"
              class="space-y-2"
            >
              <label class="block text-sm font-medium text-zinc-300">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>

              <!-- Text Input -->
              <input
                v-if="field.type === 'text'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                type="text"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="field.label"
              />

              <!-- Textarea -->
              <textarea
                v-else-if="field.type === 'textarea'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLTextAreaElement).value)"
                rows="3"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="field.label"
              ></textarea>

              <!-- Date Input -->
              <input
                v-else-if="field.type === 'date'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                type="date"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <!-- Number Input -->
              <input
                v-else-if="field.type === 'number'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, parseInt(($event.target as HTMLInputElement).value))"
                type="number"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <!-- Boolean Checkbox -->
              <label
                v-else-if="field.type === 'boolean'"
                class="flex items-center gap-2 cursor-pointer"
              >
                <input
                  :checked="getFieldValue(field.key)"
                  @change="setFieldValue(field.key, ($event.target as HTMLInputElement).checked)"
                  type="checkbox"
                  class="w-5 h-5 bg-zinc-800 border border-zinc-700 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-sm text-zinc-400">Enable</span>
              </label>

              <!-- Tags Input -->
              <input
                v-else-if="field.type === 'tags'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                type="text"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="'e.g., javascript, vue, nuxt'"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              @click="handleSave"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:check" />
              Save Changes
            </button>
            <button
              @click="closeEditor"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:x-mark" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

