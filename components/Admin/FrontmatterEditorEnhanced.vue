<script setup lang="ts">
import { parse, stringify } from 'yaml'

const props = defineProps<{
  modelValue: string
  contentType: string
  filePath?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'save': []
}>()

const showEditor = ref(false)
const frontmatterFields = ref<Record<string, any>>({})
const showNewTopicModal = ref(false)
const newTopicData = ref({
  slug: '',
  name: '',
  description: '',
  color: '#ef4444',
  category: 'general'
})

// Fetch available topics
const { data: topicsData, refresh: refreshTopics } = await useAsyncData(
  'admin-topics-list',
  () => $fetch('/api/admin/topics/list')
)

const availableTopics = computed(() => topicsData.value?.topics || [])

// Parse frontmatter from content (more robust parsing)
const parsedFrontmatter = computed(() => {
  // Match frontmatter with flexible whitespace handling
  const match = props.modelValue.match(/^---\s*\n([\s\S]*?)\n\s*---/)
  if (match && match[1]) {
    try {
      // Trim the frontmatter content to remove extra whitespace
      const frontmatterContent = match[1].trim()
      return parse(frontmatterContent)
    } catch (e) {
      console.warn('Failed to parse frontmatter:', e)
      return {}
    }
  }
  return {}
})

// Get content body without frontmatter (more robust extraction)
const contentBody = computed(() => {
  const match = props.modelValue.match(/^---\s*\n[\s\S]*?\n\s*---\n([\s\S]*)/)
  return match ? match[1] : props.modelValue
})

// Standardized field definitions for all content types
const fieldDefinitions = computed(() => {
  const baseFields = [
    { key: 'title', label: 'Title', type: 'text', required: true, help: 'The main title of the content' },
    { key: 'description', label: 'Description', type: 'textarea', required: true, help: 'SEO-friendly description (150-160 characters)' }
  ]

  const dateFields = [
    { key: 'datePublished', label: 'Date Published', type: 'date', required: true, help: 'Publication date' },
    { key: 'dateModified', label: 'Date Modified', type: 'date', required: true, help: 'Last modification date' }
  ]

  const imageFields = [
    { key: 'imageSrc', label: 'Image URL', type: 'text', required: false, help: 'Featured image URL (use Cloudinary upload)' },
    { key: 'imageAlt', label: 'Image Alt Text', type: 'text', required: false, help: 'Accessibility description for the image' }
  ]

  const topicsField = { 
    key: 'topics', 
    label: 'Topics', 
    type: 'topics-multi-select', 
    required: true, 
    help: 'Select or create topics for categorization' 
  }

  switch (props.contentType) {
    case 'articles':
      return [
        ...baseFields,
        ...dateFields,
        ...imageFields,
        topicsField,
        { key: 'courseName', label: 'Course Name (if part of a course)', type: 'text', required: false, help: 'Leave empty for standalone articles' },
        { key: 'showOnArticles', label: 'Show on Articles Page', type: 'boolean', required: false, help: 'Display in main articles listing' },
        { key: 'featured', label: 'Featured Article', type: 'boolean', required: false, help: 'Highlight in featured section' },
        { key: 'resources', label: 'Resources', type: 'resources', required: false, help: 'External resources like PDFs, articles, documentation, etc.' }
      ]
    
    case 'courses':
      return [
        ...baseFields,
        { key: 'tutor', label: 'Tutor ID', type: 'number', required: true, help: 'Instructor identifier' },
        { key: 'time', label: 'Duration', type: 'text', required: true, help: 'e.g., "10hr 30mins"' },
        { key: 'video', label: 'Has Video Content', type: 'boolean', required: false, help: 'Course includes video lessons' },
        topicsField,
        { key: 'level', label: 'Difficulty Level', type: 'select', required: false, options: ['beginner', 'intermediate', 'advanced'], help: 'Course difficulty' }
        // Note: 'content' field is complex nested structure, managed automatically via course articles
      ]
    
    case 'projects':
      return [
        ...baseFields,
        { key: 'datePublished', label: 'Date Published', type: 'date', required: false, help: 'Project completion/publication date' },
        ...imageFields,
        topicsField,
        { key: 'url', label: 'Live URL', type: 'url', required: false, help: 'Link to live project' },
        { key: 'github', label: 'GitHub URL', type: 'url', required: false, help: 'Source code repository' },
        { key: 'status', label: 'Project Status', type: 'select', required: false, options: ['active', 'completed', 'archived'], help: 'Current project status' },
        { key: 'featured', label: 'Featured Project', type: 'boolean', required: false, help: 'Highlight in portfolio' }
      ]
    
    case 'learning':
      return [
        ...baseFields,
        ...dateFields,
        topicsField,
        { key: 'source', label: 'Learning Source', type: 'text', required: false, help: 'Book, course, or resource name' },
        { key: 'type', label: 'Type', type: 'select', required: false, options: ['book', 'course', 'article', 'video', 'other'], help: 'Type of learning resource' }
      ]
    
    case 'npmpackages':
      return [
        ...baseFields,
        { key: 'packageName', label: 'Package Name', type: 'text', required: true, help: 'NPM package name' },
        { key: 'version', label: 'Latest Version', type: 'text', required: false, help: 'Current package version' },
        { key: 'url', label: 'NPM URL', type: 'url', required: false, help: 'Link to NPM registry' },
        { key: 'github', label: 'GitHub URL', type: 'url', required: false, help: 'Source code repository' },
        topicsField,
        { key: 'downloads', label: 'Weekly Downloads', type: 'number', required: false, help: 'NPM weekly download count' }
      ]
    
    case 'topics':
      return [
        { key: 'name', label: 'Topic Name', type: 'text', required: true, help: 'Display name' },
        { key: 'description', label: 'Description', type: 'textarea', required: true, help: 'Topic description' },
        { key: 'color', label: 'Color', type: 'color', required: false, help: 'Hex color for UI' },
        { key: 'icon', label: 'Icon Name', type: 'text', required: false, help: 'Icon identifier' },
        { key: 'category', label: 'Category', type: 'select', required: false, options: ['programming', 'design', 'devops', 'database', 'framework', 'tool', 'general'], help: 'Topic category' }
      ]
    
    default:
      return baseFields
  }
})

// Initialize fields when editor opens
watch(showEditor, (isOpen) => {
  if (isOpen) {
    // console.log('Opening editor with frontmatter:', parsedFrontmatter.value)
    // console.log('Content type:', props.contentType)
    // console.log('File path:', props.filePath)
    
    // Pre-fill with existing values or defaults
    const defaults: Record<string, any> = {}
    
    fieldDefinitions.value.forEach(field => {
      const existingValue = parsedFrontmatter.value[field.key]
      
      if (existingValue !== undefined && existingValue !== null && existingValue !== '') {
        // Handle different field types
        if (field.type === 'tags' && Array.isArray(existingValue)) {
          // Convert arrays to comma-separated strings for tags
          defaults[field.key] = existingValue.join(', ')
        } else if (field.type === 'topics-multi-select' && Array.isArray(existingValue)) {
          // Keep as array for multi-select
          defaults[field.key] = [...existingValue]
          // console.log('Topics loaded:', existingValue)
        } else if (field.type === 'resources' && Array.isArray(existingValue)) {
          // Keep resources as array
          defaults[field.key] = [...existingValue]
          // console.log('Resources loaded:', existingValue)
        } else if (field.type === 'boolean') {
          // Ensure boolean values
          defaults[field.key] = !!existingValue
        } else if (field.type === 'number') {
          // Ensure numeric values
          defaults[field.key] = Number(existingValue) || 0
        } else if (typeof existingValue === 'string') {
          // Remove any wrapping quotes from strings
          defaults[field.key] = existingValue.replace(/^["']|["']$/g, '')
        } else {
          // Keep the value as-is
          defaults[field.key] = existingValue
        }
      } else {
        // Set smart defaults for empty values
        if (field.key === 'datePublished' || field.key === 'dateModified') {
          defaults[field.key] = new Date().toISOString().split('T')[0]
        } else if (field.type === 'boolean') {
          defaults[field.key] = false
        } else if (field.type === 'topics-multi-select' || field.type === 'resources') {
          defaults[field.key] = []
        } else if (field.type === 'number') {
          defaults[field.key] = 0
        } else {
          defaults[field.key] = ''
        }
      }
    })
    
    // Auto-fill courseName if part of a course path
    if (props.contentType === 'articles' && props.filePath) {
      const pathParts = props.filePath.split('/')
      if (pathParts.length > 1 && !defaults['courseName']) {
        defaults['courseName'] = pathParts[0]
        defaults['showOnArticles'] = false
      }
    }
    
    // console.log('Initialized fields:', defaults)
    frontmatterFields.value = defaults
  }
})

function openEditor() {
  showEditor.value = true
}

function closeEditor() {
  showEditor.value = false
}

function validateFields(): string | null {
  for (const field of fieldDefinitions.value) {
    if (field.required) {
      const value = frontmatterFields.value[field.key]
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return `${field.label} is required`
      }
    }
  }
  return null
}

async function handleSave() {
  // Validate required fields
  const validationError = validateFields()
  if (validationError) {
    alert(validationError)
    return
  }
  
  try {
    // Process fields
    const processedFields = { ...frontmatterFields.value }
    
    fieldDefinitions.value.forEach(field => {
      // Convert tags back to arrays
      if (field.type === 'tags' && typeof processedFields[field.key] === 'string') {
        processedFields[field.key] = processedFields[field.key]
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      }
      
      // Keep resources as array (already handled)
      if (field.type === 'resources' && Array.isArray(processedFields[field.key])) {
        // Ensure resources array is properly formatted
        if (processedFields[field.key].length === 0) {
          delete processedFields[field.key]
        } else {
          // Clean up resources - remove empty url/description fields for cleaner YAML
          processedFields[field.key] = processedFields[field.key].map((r: any) => {
            const cleaned: any = {
              title: r.title,
              type: r.type
            }
            if (r.url && r.url.trim()) {
              cleaned.url = r.url.trim()
            }
            if (r.description && r.description.trim()) {
              cleaned.description = r.description.trim()
            }
            return cleaned
          })
        }
      }
      
      // Remove empty values
      if (processedFields[field.key] === '' || processedFields[field.key] === null) {
        delete processedFields[field.key]
      }
    })
    
    // For courses, preserve the complex 'content' field if it exists in original
    if (props.contentType === 'courses' && parsedFrontmatter.value.content) {
      processedFields.content = parsedFrontmatter.value.content
    }
    
    // Generate new frontmatter with proper YAML formatting
    const newFrontmatter = stringify(processedFields)
    
    // Ensure we're replacing the entire frontmatter block, not duplicating
    // Support both Windows (\r\n) and Unix (\n) line endings
    let newContent = ''
    
    // More robust frontmatter matching - match from start of file
    // Pattern: --- (optional whitespace, newline) content --- (optional whitespace, optional newline)
    // Use non-greedy match but ensure we match the closing --- that's on its own line
    const frontmatterPattern = /^---\s*\r?\n([\s\S]*?)\r?\n\s*---\s*(\r?\n|$)/
    const frontmatterMatch = props.modelValue.match(frontmatterPattern)
    
    if (frontmatterMatch) {
      // Get everything after the frontmatter block
      const frontmatterEndIndex = frontmatterMatch.index! + frontmatterMatch[0].length
      const afterFrontmatter = props.modelValue.substring(frontmatterEndIndex)
      
      // Preserve the newline structure - if there was content after frontmatter, ensure newline
      let newlineAfter = ''
      if (afterFrontmatter.trim()) {
        // If content follows and doesn't start with newline, add one
        if (!afterFrontmatter.startsWith('\n') && !afterFrontmatter.startsWith('\r\n')) {
          newlineAfter = '\n'
        }
      }
      
      // Replace the entire frontmatter block
      newContent = `---\n${newFrontmatter}---${newlineAfter}${afterFrontmatter}`
    } else {
      // No frontmatter found, add it to the beginning
      newContent = `---\n${newFrontmatter}---\n${props.modelValue}`
    }
    
    emit('update:modelValue', newContent)
    
    // Emit a save event so parent can save to file
    emit('save')
    
    showEditor.value = false
    alert('Metadata saved successfully!')
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

function toggleTopic(topicSlug: string) {
  const currentTopics = frontmatterFields.value['topics'] || []
  const index = currentTopics.indexOf(topicSlug)
  
  if (index > -1) {
    currentTopics.splice(index, 1)
  } else {
    currentTopics.push(topicSlug)
  }
  
  frontmatterFields.value['topics'] = [...currentTopics]
}

function isTopicSelected(topicSlug: string): boolean {
  const currentTopics = frontmatterFields.value['topics'] || []
  return currentTopics.includes(topicSlug)
}

async function handleCreateTopic() {
  if (!newTopicData.value.slug || !newTopicData.value.name) {
    alert('Slug and name are required')
    return
  }
  
  try {
    const response: any = await $fetch('/api/admin/topics/create', {
      method: 'POST',
      body: newTopicData.value
    })
    
    // Refresh topics list
    await refreshTopics()
    
    // Select the newly created topic
    const currentTopics = frontmatterFields.value['topics'] || []
    if (response?.topic?.slug && !currentTopics.includes(response.topic.slug)) {
      currentTopics.push(response.topic.slug)
      frontmatterFields.value['topics'] = [...currentTopics]
    }
    
    // Reset and close modal
    newTopicData.value = {
      slug: '',
      name: '',
      description: '',
      color: '#ef4444',
      category: 'general'
    }
    showNewTopicModal.value = false
    
    alert('Topic created successfully!')
  } catch (error: any) {
    console.error('Failed to create topic:', error)
    alert(error.data?.message || 'Failed to create topic')
  }
}

defineExpose({ openEditor })
</script>

<template>
  <div>
    <!-- Editor Modal -->
    <Teleport to="body">
      <div
        v-if="showEditor"
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 overflow-y-auto"
        @click.self="closeEditor"
      >
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-4xl w-full my-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-semibold">Edit Metadata</h3>
              <p class="text-sm text-zinc-500 mt-1">{{ contentType }} • {{ filePath || 'New File' }}</p>
            </div>
            <button
              @click="closeEditor"
              class="text-zinc-400 hover:text-white transition-colors"
            >
              <Icon name="heroicons:x-mark" class="text-2xl" />
            </button>
          </div>

          <!-- Form Fields -->
          <div class="space-y-5 max-h-[65vh] overflow-y-auto pr-2">
            <div
              v-for="field in fieldDefinitions"
              :key="field.key"
              class="space-y-2"
            >
              <label class="block text-sm font-medium text-zinc-300">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500 ml-1">*</span>
              </label>
              <p v-if="field.help" class="text-xs text-zinc-500 -mt-1 mb-2">{{ field.help }}</p>

              <!-- Text Input -->
              <input
                v-if="field.type === 'text'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                type="text"
                class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="field.label"
                :required="field.required"
              />

              <!-- URL Input -->
              <input
                v-else-if="field.type === 'url'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                type="url"
                class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="'https://example.com'"
              />

              <!-- Color Input -->
              <div v-else-if="field.type === 'color'" class="flex gap-3">
                <input
                  :value="getFieldValue(field.key)"
                  @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                  type="color"
                  class="w-16 h-10 bg-zinc-800 border border-zinc-700 rounded-md cursor-pointer"
                />
                <input
                  :value="getFieldValue(field.key)"
                  @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                  type="text"
                  class="flex-1 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#ef4444"
                />
              </div>

              <!-- Textarea -->
              <textarea
                v-else-if="field.type === 'textarea'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLTextAreaElement).value)"
                rows="3"
                class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :placeholder="field.label"
                :required="field.required"
              ></textarea>

              <!-- Date Input -->
              <input
                v-else-if="field.type === 'date'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                type="date"
                class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :required="field.required"
              />

              <!-- Number Input -->
              <input
                v-else-if="field.type === 'number'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, parseInt(($event.target as HTMLInputElement).value))"
                type="number"
                class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :required="field.required"
              />

              <!-- Select Dropdown -->
              <select
                v-else-if="field.type === 'select'"
                :value="getFieldValue(field.key)"
                @change="setFieldValue(field.key, ($event.target as HTMLSelectElement).value)"
                class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select --</option>
                <option v-for="option in (field as any).options" :key="option" :value="option">
                  {{ option.charAt(0).toUpperCase() + option.slice(1) }}
                </option>
              </select>

              <!-- Boolean Checkbox -->
              <label
                v-else-if="field.type === 'boolean'"
                class="flex items-center gap-3 cursor-pointer bg-zinc-800 border border-zinc-700 rounded-md px-4 py-3 hover:bg-zinc-750 transition-colors"
              >
                <input
                  :checked="getFieldValue(field.key)"
                  @change="setFieldValue(field.key, ($event.target as HTMLInputElement).checked)"
                  type="checkbox"
                  class="w-5 h-5 bg-zinc-700 border border-zinc-600 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-sm text-zinc-300">Enable {{ field.label }}</span>
              </label>

              <!-- Topics Multi-Select -->
              <div v-else-if="field.type === 'topics-multi-select'" class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-zinc-400">{{ (frontmatterFields['topics'] || []).length }} selected</span>
                  <button
                    @click="showNewTopicModal = true"
                    class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <Icon name="heroicons:plus" class="text-sm" />
                    New Topic
                  </button>
                </div>
                <div class="bg-zinc-800 border border-zinc-700 rounded-md p-3 max-h-60 overflow-y-auto">
                  <div class="grid grid-cols-2 gap-2">
                    <label
                      v-for="topic in availableTopics"
                      :key="topic.slug"
                      class="flex items-center gap-2 p-2 rounded hover:bg-zinc-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        :checked="isTopicSelected(topic.slug)"
                        @change="toggleTopic(topic.slug)"
                        class="w-4 h-4 bg-zinc-700 border border-zinc-600 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span
                        class="w-3 h-3 rounded-full flex-shrink-0"
                        :style="{ backgroundColor: (topic as any).color }"
                      ></span>
                      <span class="text-sm text-zinc-300 truncate">{{ (topic as any).name }}</span>
                    </label>
                  </div>
                  <p v-if="availableTopics.length === 0" class="text-center text-zinc-500 text-sm py-4">
                    No topics available. Create one!
                  </p>
                </div>
              </div>

              <!-- Tags Input -->
              <input
                v-else-if="field.type === 'tags'"
                :value="getFieldValue(field.key)"
                @input="setFieldValue(field.key, ($event.target as HTMLInputElement).value)"
                type="text"
                class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tag1, tag2, tag3"
              />

              <!-- Resources Editor -->
              <AdminResourcesEditor
                v-else-if="field.type === 'resources'"
                :model-value="frontmatterFields[field.key] || []"
                @update:model-value="setFieldValue(field.key, $event)"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              @click="handleSave"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <Icon name="heroicons:check" />
              Save Metadata
            </button>
            <button
              @click="closeEditor"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:x-mark" />
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- New Topic Modal -->
      <div
        v-if="showNewTopicModal"
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-[110] p-4"
        @click.self="showNewTopicModal = false"
      >
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-lg w-full">
          <h4 class="text-xl font-semibold mb-4">Create New Topic</h4>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">Slug (URL-friendly) *</label>
              <input
                v-model="newTopicData.slug"
                type="text"
                placeholder="my-topic-slug"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">Display Name *</label>
              <input
                v-model="newTopicData.name"
                type="text"
                placeholder="My Topic"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea
                v-model="newTopicData.description"
                rows="2"
                placeholder="Brief description of the topic"
                class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">Color</label>
                <div class="flex gap-2">
                  <input
                    v-model="newTopicData.color"
                    type="color"
                    class="w-12 h-10 bg-zinc-800 border border-zinc-700 rounded cursor-pointer"
                  />
                  <input
                    v-model="newTopicData.color"
                    type="text"
                    class="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                <select
                  v-model="newTopicData.category"
                  class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="devops">DevOps</option>
                  <option value="database">Database</option>
                  <option value="framework">Framework</option>
                  <option value="tool">Tool</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button
              @click="handleCreateTopic"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Create Topic
            </button>
            <button
              @click="showNewTopicModal = false"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

