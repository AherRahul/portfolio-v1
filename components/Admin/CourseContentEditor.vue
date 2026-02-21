<script setup lang="ts">
import { parse, stringify } from 'yaml'
import { Icon } from '#components'

interface Topic {
  id: number
  topic_name: string
  sub_topic: string
  publish_date: string
  description: string
  topics: string[]
  duration: string
  photo_url: string
  auther_name: string
  is_on_youtube: boolean
  _path: string
  published?: boolean
}

interface Module {
  module_id: number
  module_name: string
  module_duration: string
  topics_count: number
  tutor: number
  expanded: boolean
  topics: Topic[]
  published?: boolean
}

const props = defineProps<{
  modelValue: string // Full markdown content with frontmatter
  courseSlug: string // Course file name without .md extension
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'save': []
}>()

const showEditor = ref(false)
const modules = ref<Module[]>([])
const showModuleModal = ref(false)
const showTopicModal = ref(false)
const editingModuleIndex = ref<number | null>(null)
const editingTopicIndex = ref<{ moduleIndex: number; topicIndex: number } | null>(null)
const publishLoading = ref<string>('') // tracks which item is being published
const newModule = ref<Partial<Module>>({
  module_name: '',
  module_duration: '',
  tutor: 1,
  expanded: false,
  topics: []
})
const newTopic = ref<Partial<Topic>>({
  topic_name: '',
  sub_topic: '',
  publish_date: new Date().toISOString().split('T')[0],
  description: '',
  topics: ['javascript'],
  duration: '10:00 mins read',
  photo_url: '',
  auther_name: 'Rahul Aher',
  is_on_youtube: false
})

// Computed: is the overall course published?
const courseIsPublished = computed(() => !!parsedFrontmatter.value?.published)

// Fetch available topics for topic selection
const { data: topicsData } = await useAsyncData(
  'admin-topics-list-course-editor',
  () => $fetch('/api/admin/topics/list').catch(() => ({ topics: [] }))
)

const availableTopics = computed(() => topicsData.value?.topics || [])

// Helper function to remove priority number from course slug
// e.g., "08-test-course" -> "test-course"
function removePriorityFromSlug(slug: string): string {
  // Match pattern like "08-" at the start
  return slug.replace(/^\d+-/, '')
}

// Parse frontmatter
const parsedFrontmatter = computed(() => {
  const match = props.modelValue.match(/^---\s*\n([\s\S]*?)\n\s*---/)
  if (match && match[1]) {
    try {
      return parse(match[1].trim())
    } catch (e) {
      console.warn('Failed to parse frontmatter:', e)
      return {}
    }
  }
  return {}
})

// Get content body
const contentBody = computed(() => {
  const match = props.modelValue.match(/^---\s*\n[\s\S]*?\n\s*---\n([\s\S]*)/)
  return match ? match[1] : props.modelValue
})

// Initialize modules from frontmatter
watch([showEditor, () => props.modelValue], ([isOpen]) => {
  if (isOpen) {
    const content = parsedFrontmatter.value.content || []
    modules.value = content.map((mod: any) => ({
      ...mod,
      topics: (mod.topics || []).map((topic: any) => ({
        ...topic,
        id: typeof topic.id === 'number' && topic.id > 0 ? topic.id : 0
      })).filter((topic: any) => topic.id > 0) // Remove any topics with invalid IDs
    }))
  }
}, { immediate: false })

function openEditor() {
  showEditor.value = true
}

function closeEditor() {
  showEditor.value = false
}

function openAddModule() {
  editingModuleIndex.value = null
  newModule.value = {
    module_name: '',
    module_duration: '',
    tutor: 1,
    expanded: false,
    topics: []
  }
  showModuleModal.value = true
}

function openEditModule(index: number) {
  editingModuleIndex.value = index
  newModule.value = { ...modules.value[index] }
  showModuleModal.value = true
}

function saveModule() {
  if (!newModule.value.module_name?.trim()) {
    alert('Module name is required')
    return
  }

  const moduleData: Module = {
    module_id: editingModuleIndex.value !== null 
      ? modules.value[editingModuleIndex.value].module_id
      : Math.max(...modules.value.map(m => m.module_id), 0) + 1,
    module_name: newModule.value.module_name.trim(),
    module_duration: newModule.value.module_duration?.trim() || '10 mins read',
    topics_count: newModule.value.topics?.length || 0,
    tutor: newModule.value.tutor || 1,
    expanded: newModule.value.expanded || false,
    topics: newModule.value.topics || []
  }

  if (editingModuleIndex.value !== null) {
    modules.value[editingModuleIndex.value] = moduleData
  } else {
    modules.value.push(moduleData)
  }

  updateCourseContent()
  showModuleModal.value = false
}

async function deleteModule(index: number) {
  const module = modules.value[index]
  const topicCount = module.topics?.length || 0
  
  if (!confirm(`Are you sure you want to delete module "${module.module_name}"? This will delete ${topicCount} topic file(s) and cannot be undone.`)) {
    return
  }
  
  // Delete all topic files for this module
  if (module.topics && module.topics.length > 0) {
    const deletePromises = module.topics.map(async (topic) => {
      try {
        // Construct the file path: articles/{courseSlug}/{topic._path}.md
        const topicFilePath = `${props.courseSlug}/${topic._path}.md`
        await $fetch('/api/admin/content/file', {
          method: 'DELETE',
          body: {
            type: 'articles',
            path: topicFilePath
          }
        })
      } catch (err: any) {
        console.error(`Error deleting topic file ${topic._path}:`, err)
        // Continue deleting other files even if one fails
      }
    })
    
    // Wait for all deletions to complete
    await Promise.all(deletePromises)
  }
  
  // Remove module from array
  modules.value.splice(index, 1)
  updateCourseContent()
}

function moveModule(index: number, direction: 'up' | 'down') {
  if (direction === 'up' && index > 0) {
    const item = modules.value.splice(index, 1)[0]
    modules.value.splice(index - 1, 0, item)
  } else if (direction === 'down' && index < modules.value.length - 1) {
    const item = modules.value.splice(index, 1)[0]
    modules.value.splice(index + 1, 0, item)
  }
  updateCourseContent()
}

function openAddTopic(moduleIndex: number) {
  editingTopicIndex.value = null
  newTopic.value = {
    topic_name: '',
    sub_topic: parsedFrontmatter.value.title || '',
    publish_date: new Date().toISOString().split('T')[0],
    description: '',
    topics: ['javascript'],
    duration: '10:00 mins read',
    photo_url: '',
    auther_name: 'Rahul Aher',
    is_on_youtube: false
  }
  editingModuleIndex.value = moduleIndex
  showTopicModal.value = true
}

function openEditTopic(moduleIndex: number, topicIndex: number) {
  editingTopicIndex.value = { moduleIndex, topicIndex }
  newTopic.value = { ...modules.value[moduleIndex].topics[topicIndex] }
  editingModuleIndex.value = moduleIndex
  showTopicModal.value = true
}

async function saveTopic() {
  if (!newTopic.value.topic_name?.trim()) {
    alert('Topic name is required')
    return
  }

  if (editingModuleIndex.value === null) return

  const module = modules.value[editingModuleIndex.value]
  
  // Calculate next topic ID - should be sequential within the module (not global)
  // Module 1: topics 1, 2, 3... Module 2: topics 1, 2, 3...
  let topicId: number
  if (editingTopicIndex.value !== null) {
    // Editing existing topic - keep its ID
    topicId = module.topics[editingTopicIndex.value.topicIndex].id
  } else {
    // New topic - find the next available ID within this module only
    const moduleTopicIds = (module.topics || [])
      .map(t => t.id)
      .filter(id => typeof id === 'number' && id > 0)
    
    if (moduleTopicIds.length === 0) {
      // No topics in this module yet, start with ID 1
      topicId = 1
    } else {
      // Find the maximum ID in this module and add 1
      const maxId = Math.max(...moduleTopicIds)
      topicId = maxId + 1
    }
  }

  // Remove priority number from course slug for topic file naming
  const cleanCourseSlug = removePriorityFromSlug(props.courseSlug)
  const topicPath = `${cleanCourseSlug}-${module.module_id}-${topicId}`
  
  const topicData: Topic = {
    id: topicId,
    topic_name: newTopic.value.topic_name.trim(),
    sub_topic: newTopic.value.sub_topic?.trim() || parsedFrontmatter.value.title || '',
    publish_date: newTopic.value.publish_date || new Date().toISOString().split('T')[0],
    description: newTopic.value.description?.trim() || '',
    topics: newTopic.value.topics || ['javascript'],
    duration: newTopic.value.duration || '10:00 mins read',
    photo_url: newTopic.value.photo_url || '',
    auther_name: newTopic.value.auther_name || 'Rahul Aher',
    is_on_youtube: newTopic.value.is_on_youtube || false,
    _path: editingTopicIndex.value !== null
      ? module.topics[editingTopicIndex.value.topicIndex]._path
      : topicPath
  }

  // If it's a new topic, create the article file
  if (editingTopicIndex.value === null) {
    try {
      await $fetch('/api/admin/courses/create-topic', {
        method: 'POST',
        body: {
          courseSlug: props.courseSlug,
          moduleId: module.module_id,
          topicId: topicId,
          topic: topicData
        }
      })
    } catch (err: any) {
      console.error('Error creating topic file:', err)
      alert(`Error creating topic file: ${err.data?.message || err.message}`)
      return
    }
  }

  if (editingTopicIndex.value !== null) {
    module.topics[editingTopicIndex.value.topicIndex] = topicData
  } else {
    module.topics.push(topicData)
  }

  module.topics_count = module.topics.length
  updateCourseContent()
  showTopicModal.value = false
}

async function deleteTopic(moduleIndex: number, topicIndex: number) {
  const topic = modules.value[moduleIndex].topics[topicIndex]
  if (!confirm(`Are you sure you want to delete topic "${topic.topic_name}"? This will delete the topic file and cannot be undone.`)) {
    return
  }
  
  // Delete the topic file
  try {
    const topicFilePath = `${props.courseSlug}/${topic._path}.md`
    await $fetch('/api/admin/content/file', {
      method: 'DELETE',
      body: {
        type: 'articles',
        path: topicFilePath
      }
    })
  } catch (err: any) {
    console.error(`Error deleting topic file ${topic._path}:`, err)
    // Continue with removing from module even if file deletion fails
  }
  
  // Remove topic from module
  modules.value[moduleIndex].topics.splice(topicIndex, 1)
  modules.value[moduleIndex].topics_count = modules.value[moduleIndex].topics.length
  updateCourseContent()
}

function moveTopic(moduleIndex: number, topicIndex: number, direction: 'up' | 'down') {
  const module = modules.value[moduleIndex]
  if (direction === 'up' && topicIndex > 0) {
    const item = module.topics.splice(topicIndex, 1)[0]
    module.topics.splice(topicIndex - 1, 0, item)
  } else if (direction === 'down' && topicIndex < module.topics.length - 1) {
    const item = module.topics.splice(topicIndex, 1)[0]
    module.topics.splice(topicIndex + 1, 0, item)
  }
  updateCourseContent()
}

function updateCourseContent() {
  // Update frontmatter with new modules
  const frontmatter = { ...parsedFrontmatter.value }
  frontmatter.content = modules.value.map(mod => ({
    ...mod,
    topics_count: mod.topics.length
  }))

  // Regenerate YAML
  const newFrontmatter = stringify(frontmatter)
  
  // Reconstruct content
  const newContent = `---\n${newFrontmatter}---\n${contentBody.value}`
  
  emit('update:modelValue', newContent)
}

async function handlePublishCourse(action: 'publish' | 'unpublish') {
  const key = `course-${action}`
  publishLoading.value = key
  try {
    const res = await $fetch('/api/admin/courses/publish', {
      method: 'POST',
      body: { courseSlug: props.courseSlug, action, target: 'course' }
    })
    // Re-read the file so our local state reflects what was written
    const fileResponse = await $fetch('/api/admin/content/file', {
      query: { type: 'courses', path: `${props.courseSlug}.md` }
    })
    emit('update:modelValue', fileResponse.content)
    // Re-init modules from updated content
    const updated = fileResponse.content.match(/^---\s*\n([\s\S]*?)\n\s*---/)
    if (updated) {
      try {
        const { parse: yamlParse } = await import('yaml')
        const fm = yamlParse(updated[1].trim())
        modules.value = (fm.content || []).map((mod: any) => ({ ...mod }))
      } catch {}
    }
  } catch (err: any) {
    alert(`Error: ${err.data?.message || err.message}`)
  } finally {
    publishLoading.value = ''
  }
}

async function handlePublishModule(moduleIndex: number, action: 'publish' | 'unpublish') {
  const mod = modules.value[moduleIndex]
  const key = `module-${mod.module_id}-${action}`
  publishLoading.value = key
  try {
    await $fetch('/api/admin/courses/publish', {
      method: 'POST',
      body: { courseSlug: props.courseSlug, action, target: 'module', moduleId: mod.module_id }
    })
    // Update local module published state
    mod.published = action === 'publish'
    if (action === 'publish') {
      const today = new Date().toISOString().split('T')[0]
      mod.topics.forEach(t => { t.published = true; t.publish_date = today })
    } else {
      mod.topics.forEach(t => { t.published = false })
    }
    updateCourseContent()
  } catch (err: any) {
    alert(`Error: ${err.data?.message || err.message}`)
  } finally {
    publishLoading.value = ''
  }
}

async function handlePublishTopic(moduleIndex: number, topicIndex: number, action: 'publish' | 'unpublish') {
  const mod = modules.value[moduleIndex]
  const topic = mod.topics[topicIndex]
  const key = `topic-${topic._path}-${action}`
  publishLoading.value = key
  try {
    await $fetch('/api/admin/courses/publish', {
      method: 'POST',
      body: { courseSlug: props.courseSlug, action, target: 'topic', moduleId: mod.module_id, topicPath: topic._path }
    })
    // Update local state
    topic.published = action === 'publish'
    if (action === 'publish') topic.publish_date = new Date().toISOString().split('T')[0]
    updateCourseContent()
  } catch (err: any) {
    alert(`Error: ${err.data?.message || err.message}`)
  } finally {
    publishLoading.value = ''
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
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-6xl w-full my-8 max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between mb-6 flex-shrink-0">
            <div>
              <h3 class="text-2xl font-semibold text-white">Manage Course Content</h3>
              <p class="text-sm text-zinc-500 mt-1">Modules and Topics • {{ courseSlug }}</p>
            </div>
            <div class="flex items-center gap-3">
              <!-- Course-level publish toggle -->
              <div class="flex items-center gap-2">
                <span :class="courseIsPublished ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-zinc-700 text-zinc-400 border-zinc-600'" class="text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5">
                  <span :class="courseIsPublished ? 'bg-green-400' : 'bg-zinc-500'" class="w-1.5 h-1.5 rounded-full inline-block"></span>
                  {{ courseIsPublished ? 'Published' : 'Draft' }}
                </span>
                <button
                  v-if="!courseIsPublished"
                  @click="handlePublishCourse('publish')"
                  :disabled="publishLoading !== ''"
                  class="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Icon name="heroicons:rocket-launch" class="text-sm" />
                  {{ publishLoading === 'course-publish' ? 'Publishing...' : 'Publish Course' }}
                </button>
                <button
                  v-else
                  @click="handlePublishCourse('unpublish')"
                  :disabled="publishLoading !== ''"
                  class="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-300 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Icon name="heroicons:eye-slash" class="text-sm" />
                  {{ publishLoading === 'course-unpublish' ? 'Unpublishing...' : 'Unpublish' }}
                </button>
              </div>
              <button
                @click="closeEditor"
                class="text-zinc-400 hover:text-white transition-colors"
              >
                <Icon name="heroicons:x-mark" class="text-2xl" />
              </button>
            </div>
          </div>

          <!-- Modules List -->
          <div class="flex-1 overflow-y-auto pr-2 space-y-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold text-zinc-200">Modules ({{ modules.length }})</h4>
              <button
                @click="openAddModule"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1 transition-colors"
              >
                <Icon name="heroicons:plus" class="text-base" />
                Add Module
              </button>
            </div>

            <div v-if="modules.length === 0" class="text-zinc-500 text-sm text-center py-8 border border-zinc-800 rounded-md">
              No modules yet. Add your first module!
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(module, moduleIndex) in modules"
                :key="moduleIndex"
                :class="module.published ? 'border-green-700/50' : 'border-zinc-700'"
                class="bg-zinc-800 border rounded-md p-4"
              >
                <!-- Module Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 flex-wrap">
                      <span class="text-xs font-medium text-zinc-400 bg-zinc-700 px-2 py-1 rounded">Module {{ module.module_id }}</span>
                      <h5 class="font-semibold text-zinc-200">{{ module.module_name }}</h5>
                      <span class="text-xs text-zinc-500">{{ module.module_duration }}</span>
                      <span class="text-xs text-zinc-500">{{ module.topics_count }} topics</span>
                      <!-- Module publish badge -->
                      <span :class="module.published ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-amber-900/30 text-amber-400 border-amber-700/40'" class="text-xs px-2 py-0.5 rounded-full border flex items-center gap-1">
                        <span :class="module.published ? 'bg-green-400' : 'bg-amber-500'" class="w-1.5 h-1.5 rounded-full"></span>
                        {{ module.published ? 'Published' : 'Draft' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <!-- Module publish/unpublish -->
                    <button
                      v-if="!module.published"
                      @click="handlePublishModule(moduleIndex, 'publish')"
                      :disabled="publishLoading !== ''"
                      title="Publish module & all its topics"
                      class="p-1.5 rounded-md hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon name="heroicons:rocket-launch" class="text-green-400 text-lg" />
                    </button>
                    <button
                      v-else
                      @click="handlePublishModule(moduleIndex, 'unpublish')"
                      :disabled="publishLoading !== ''"
                      title="Unpublish module & all its topics"
                      class="p-1.5 rounded-md hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icon name="heroicons:eye-slash" class="text-zinc-400 text-lg" />
                    </button>
                    <button @click="moveModule(moduleIndex, 'up')" :disabled="moduleIndex === 0" class="p-1.5 rounded-md hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <Icon name="heroicons:arrow-up" class="text-zinc-400 text-lg" />
                    </button>
                    <button @click="moveModule(moduleIndex, 'down')" :disabled="moduleIndex === modules.length - 1" class="p-1.5 rounded-md hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      <Icon name="heroicons:arrow-down" class="text-zinc-400 text-lg" />
                    </button>
                    <button @click="openEditModule(moduleIndex)" class="p-1.5 rounded-md hover:bg-blue-700 transition-colors">
                      <Icon name="heroicons:pencil" class="text-blue-400 text-lg" />
                    </button>
                    <button @click="deleteModule(moduleIndex)" class="p-1.5 rounded-md hover:bg-red-700 transition-colors">
                      <Icon name="heroicons:trash" class="text-red-400 text-lg" />
                    </button>
                  </div>
                </div>

                <!-- Topics List -->
                <div class="ml-6 space-y-2">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-zinc-400">Topics</span>
                    <button
                      @click="openAddTopic(moduleIndex)"
                      class="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                      <Icon name="heroicons:plus" class="text-xs" />
                      Add Topic
                    </button>
                  </div>
                  
                  <div v-if="module.topics.length === 0" class="text-xs text-zinc-600 text-center py-2 border border-zinc-800 rounded">
                    No topics in this module
                  </div>
                  
                  <div v-else class="space-y-2">
                    <div
                      v-for="(topic, topicIndex) in module.topics"
                      :key="topicIndex"
                      :class="topic.published ? 'border-green-800/40 bg-zinc-900' : 'border-zinc-700 bg-zinc-900'"
                      class="border rounded p-2 flex items-center justify-between"
                    >
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs text-zinc-500">#{{ topic.id }}</span>
                          <span class="text-sm font-medium text-zinc-300">{{ topic.topic_name }}</span>
                          <span class="text-xs text-zinc-500">{{ topic.duration }}</span>
                          <!-- Topic publish badge -->
                          <span :class="topic.published ? 'bg-green-500/15 text-green-400 border-green-600/30' : 'bg-amber-900/20 text-amber-500 border-amber-700/30'" class="text-xs px-1.5 py-0.5 rounded-full border flex items-center gap-1">
                            <span :class="topic.published ? 'bg-green-400' : 'bg-amber-500'" class="w-1 h-1 rounded-full"></span>
                            {{ topic.published ? 'Live' : 'Draft' }}
                          </span>
                        </div>
                        <div class="text-xs text-zinc-600 mt-1">{{ topic._path }}</div>
                      </div>
                      <div class="flex items-center gap-1">
                        <!-- Topic publish/unpublish -->
                        <button
                          v-if="!topic.published"
                          @click="handlePublishTopic(moduleIndex, topicIndex, 'publish')"
                          :disabled="publishLoading !== ''"
                          title="Publish this topic"
                          class="p-1 rounded-md hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Icon name="heroicons:eye" class="text-green-400 text-sm" />
                        </button>
                        <button
                          v-else
                          @click="handlePublishTopic(moduleIndex, topicIndex, 'unpublish')"
                          :disabled="publishLoading !== ''"
                          title="Unpublish this topic"
                          class="p-1 rounded-md hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <Icon name="heroicons:eye-slash" class="text-zinc-400 text-sm" />
                        </button>
                        <button @click="moveTopic(moduleIndex, topicIndex, 'up')" :disabled="topicIndex === 0" class="p-1 rounded-md hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                          <Icon name="heroicons:arrow-up" class="text-zinc-400 text-sm" />
                        </button>
                        <button @click="moveTopic(moduleIndex, topicIndex, 'down')" :disabled="topicIndex === module.topics.length - 1" class="p-1 rounded-md hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                          <Icon name="heroicons:arrow-down" class="text-zinc-400 text-sm" />
                        </button>
                        <button @click="openEditTopic(moduleIndex, topicIndex)" class="p-1 rounded-md hover:bg-blue-700 transition-colors">
                          <Icon name="heroicons:pencil" class="text-blue-400 text-sm" />
                        </button>
                        <button @click="deleteTopic(moduleIndex, topicIndex)" class="p-1 rounded-md hover:bg-red-700 transition-colors">
                          <Icon name="heroicons:trash" class="text-red-400 text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-6 border-t border-zinc-800 flex-shrink-0">
            <button
              @click="emit('save'); closeEditor()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <Icon name="heroicons:check" />
              Save Changes
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

        <!-- Module Modal -->
        <Teleport to="body">
          <div
            v-if="showModuleModal"
            class="fixed inset-0 bg-black/90 flex items-center justify-center z-[110] p-4"
            @click.self="showModuleModal = false"
          >
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-lg w-full">
              <h4 class="text-xl font-semibold mb-4 text-white">{{ editingModuleIndex !== null ? 'Edit Module' : 'Add New Module' }}</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Module Name *</label>
                  <input
                    v-model="newModule.module_name"
                    type="text"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Get Started"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Duration</label>
                  <input
                    v-model="newModule.module_duration"
                    type="text"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10 mins read"
                  />
                </div>
              </div>
              
              <div class="flex gap-3 mt-6">
                <button
                  @click="saveModule"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {{ editingModuleIndex !== null ? 'Update Module' : 'Add Module' }}
                </button>
                <button
                  @click="showModuleModal = false"
                  class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Topic Modal -->
        <Teleport to="body">
          <div
            v-if="showTopicModal"
            class="fixed inset-0 bg-black/90 flex items-center justify-center z-[110] p-4 overflow-y-auto"
            @click.self="showTopicModal = false"
          >
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-lg w-full my-8">
              <h4 class="text-xl font-semibold mb-4 text-white">{{ editingTopicIndex !== null ? 'Edit Topic' : 'Add New Topic' }}</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Topic Name *</label>
                  <input
                    v-model="newTopic.topic_name"
                    type="text"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Introduction"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Sub Topic</label>
                  <input
                    v-model="newTopic.sub_topic"
                    type="text"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Publish Date</label>
                  <input
                    v-model="newTopic.publish_date"
                    type="date"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                  <textarea
                    v-model="newTopic.description"
                    rows="3"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Topic description..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Duration</label>
                  <input
                    v-model="newTopic.duration"
                    type="text"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10:00 mins read"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-zinc-300 mb-2">Photo URL</label>
                  <input
                    v-model="newTopic.photo_url"
                    type="url"
                    class="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>

                <div class="flex items-center gap-3">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      v-model="newTopic.is_on_youtube"
                      type="checkbox"
                      class="w-5 h-5 bg-zinc-700 border border-zinc-600 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="text-sm text-zinc-300">Available on YouTube</span>
                  </label>
                </div>
              </div>
              
              <div class="flex gap-3 mt-6">
                <button
                  @click="saveTopic"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {{ editingTopicIndex !== null ? 'Update Topic' : 'Create Topic' }}
                </button>
                <button
                  @click="showTopicModal = false"
                  class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </Teleport>
  </div>
</template>

