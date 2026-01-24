<script setup lang="ts">
const props = defineProps<{
  contentType: string
}>()

const emit = defineEmits<{
  'update-complete': []
}>()

const showManager = ref(false)
const processing = ref(false)

// Filter options
const filters = ref({
  topic: '',
  courseName: '',
  dateFrom: '',
  dateTo: ''
})

// Update options
const updates = ref({
  dateModified: '',
  addTopics: [] as string[],
  removeTopics: [] as string[],
  showOnArticles: null as boolean | null,
  featured: null as boolean | null
})

const updateResult = ref<any>(null)

// Fetch available topics
const { data: topicsData } = await useAsyncData(
  'admin-topics-bulk',
  () => $fetch('/api/admin/topics/list')
)

const availableTopics = computed(() => topicsData.value?.topics || [])

// Fetch available courses for dropdown
const { data: coursesData } = await useAsyncData(
  'admin-courses-bulk',
  () => $fetch('/api/admin/content/course-slugs')
)

const availableCourses = computed(() => coursesData.value?.slugs || [])

function openManager() {
  showManager.value = true
  resetForm()
}

function closeManager() {
  showManager.value = false
  updateResult.value = null
}

function resetForm() {
  filters.value = {
    topic: '',
    courseName: '',
    dateFrom: '',
    dateTo: ''
  }
  
  updates.value = {
    dateModified: '',
    addTopics: [],
    removeTopics: [],
    showOnArticles: null,
    featured: null
  }
  
  updateResult.value = null
}

function toggleAddTopic(topicSlug: string) {
  const index = updates.value.addTopics.indexOf(topicSlug)
  if (index > -1) {
    updates.value.addTopics.splice(index, 1)
  } else {
    updates.value.addTopics.push(topicSlug)
    // Remove from removeTopics if present
    const removeIndex = updates.value.removeTopics.indexOf(topicSlug)
    if (removeIndex > -1) {
      updates.value.removeTopics.splice(removeIndex, 1)
    }
  }
}

function toggleRemoveTopic(topicSlug: string) {
  const index = updates.value.removeTopics.indexOf(topicSlug)
  if (index > -1) {
    updates.value.removeTopics.splice(index, 1)
  } else {
    updates.value.removeTopics.push(topicSlug)
    // Remove from addTopics if present
    const addIndex = updates.value.addTopics.indexOf(topicSlug)
    if (addIndex > -1) {
      updates.value.addTopics.splice(addIndex, 1)
    }
  }
}

async function handleBulkUpdate() {
  if (!confirm('Are you sure you want to apply these changes? This will update multiple files.')) {
    return
  }
  
  processing.value = true
  updateResult.value = null
  
  try {
    // Build updates object (only include non-empty values)
    const updatePayload: any = {}
    
    if (updates.value.dateModified) {
      updatePayload.dateModified = updates.value.dateModified
    }
    
    if (updates.value.addTopics.length > 0) {
      updatePayload.addTopics = updates.value.addTopics
    }
    
    if (updates.value.removeTopics.length > 0) {
      updatePayload.removeTopics = updates.value.removeTopics
    }
    
    if (updates.value.showOnArticles !== null) {
      updatePayload.showOnArticles = updates.value.showOnArticles
    }
    
    if (updates.value.featured !== null) {
      updatePayload.featured = updates.value.featured
    }
    
    if (Object.keys(updatePayload).length === 0) {
      alert('Please specify at least one update to apply')
      return
    }
    
    // Build filters object (only include non-empty values)
    const filterPayload: any = {}
    
    if (filters.value.topic) {
      filterPayload.topic = filters.value.topic
    }
    
    if (filters.value.courseName) {
      filterPayload.courseName = filters.value.courseName
    }
    
    if (filters.value.dateFrom) {
      filterPayload.dateFrom = filters.value.dateFrom
    }
    
    if (filters.value.dateTo) {
      filterPayload.dateTo = filters.value.dateTo
    }
    
    const response = await $fetch('/api/admin/content/bulk-update', {
      method: 'POST',
      body: {
        type: props.contentType,
        updates: updatePayload,
        filters: Object.keys(filterPayload).length > 0 ? filterPayload : undefined
      }
    })
    
    updateResult.value = response
    emit('update-complete')
    
  } catch (error: any) {
    console.error('Bulk update failed:', error)
    alert(error.data?.message || 'Failed to perform bulk update')
  } finally {
    processing.value = false
  }
}

defineExpose({ openManager })
</script>

<template>
  <div>
    <!-- Bulk Manager Modal -->
    <Teleport to="body">
      <div
        v-if="showManager"
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 overflow-y-auto"
        @click.self="closeManager"
      >
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-5xl w-full my-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-semibold">Bulk Update Manager</h3>
              <p class="text-sm text-zinc-500 mt-1">Apply changes to multiple {{ contentType }} files at once</p>
            </div>
            <button
              @click="closeManager"
              :disabled="processing"
              class="text-zinc-400 hover:text-white disabled:opacity-50"
            >
              <Icon name="heroicons:x-mark" class="text-2xl" />
            </button>
          </div>

          <div v-if="!updateResult" class="grid grid-cols-2 gap-6">
            <!-- Filters Section -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-zinc-300 flex items-center gap-2">
                <Icon name="heroicons:funnel" />
                Filters (Optional)
              </h4>
              <p class="text-xs text-zinc-500 -mt-2">Limit which files get updated</p>
              
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">Filter by Topic</label>
                <select
                  v-model="filters.topic"
                  class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="processing"
                >
                  <option value="">All topics</option>
                  <option v-for="topic in availableTopics" :key="topic.slug" :value="topic.slug">
                    {{ topic.name }}
                  </option>
                </select>
              </div>
              
              <div v-if="contentType === 'articles'">
                <label class="block text-sm font-medium text-zinc-300 mb-2">Filter by Course</label>
                <select
                  v-model="filters.courseName"
                  class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="processing"
                >
                  <option value="">All courses</option>
                  <option v-for="course in availableCourses" :key="course" :value="course">
                    {{ course }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">Date Range</label>
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="filters.dateFrom"
                    type="date"
                    placeholder="From"
                    class="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :disabled="processing"
                  />
                  <input
                    v-model="filters.dateTo"
                    type="date"
                    placeholder="To"
                    class="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :disabled="processing"
                  />
                </div>
              </div>
            </div>

            <!-- Updates Section -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-zinc-300 flex items-center gap-2">
                <Icon name="heroicons:pencil-square" />
                Updates to Apply
              </h4>
              <p class="text-xs text-zinc-500 -mt-2">Changes to apply to filtered files</p>
              
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">Update Modified Date</label>
                <input
                  v-model="updates.dateModified"
                  type="date"
                  class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  :disabled="processing"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">Add Topics</label>
                <div class="bg-zinc-800 border border-zinc-700 rounded-md p-3 max-h-40 overflow-y-auto">
                  <div class="grid grid-cols-2 gap-2">
                    <label
                      v-for="topic in availableTopics"
                      :key="topic.slug"
                      class="flex items-center gap-2 p-1.5 rounded hover:bg-zinc-700 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        :checked="updates.addTopics.includes(topic.slug)"
                        @change="toggleAddTopic(topic.slug)"
                        :disabled="processing"
                        class="w-4 h-4 bg-zinc-700 border border-zinc-600 rounded text-green-600"
                      />
                      <span class="text-zinc-300 truncate">{{ topic.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-zinc-300 mb-2">Remove Topics</label>
                <div class="bg-zinc-800 border border-zinc-700 rounded-md p-3 max-h-32 overflow-y-auto">
                  <div class="grid grid-cols-2 gap-2">
                    <label
                      v-for="topic in availableTopics"
                      :key="topic.slug"
                      class="flex items-center gap-2 p-1.5 rounded hover:bg-zinc-700 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        :checked="updates.removeTopics.includes(topic.slug)"
                        @change="toggleRemoveTopic(topic.slug)"
                        :disabled="processing"
                        class="w-4 h-4 bg-zinc-700 border border-zinc-600 rounded text-red-600"
                      />
                      <span class="text-zinc-300 truncate">{{ topic.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div v-if="contentType === 'articles' || contentType === 'projects'">
                <label class="block text-sm font-medium text-zinc-300 mb-2">Boolean Flags</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 cursor-pointer">
                    <input
                      v-model="updates.showOnArticles"
                      type="checkbox"
                      :disabled="processing"
                      class="w-5 h-5 bg-zinc-700 border border-zinc-600 rounded text-green-600"
                    />
                    <span class="text-sm text-zinc-300">Show on Articles Page</span>
                  </label>
                  <label class="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 cursor-pointer">
                    <input
                      v-model="updates.featured"
                      type="checkbox"
                      :disabled="processing"
                      class="w-5 h-5 bg-zinc-700 border border-zinc-600 rounded text-green-600"
                    />
                    <span class="text-sm text-zinc-300">Featured</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Result Section -->
          <div v-else class="space-y-4">
            <div class="bg-green-900/20 border border-green-700 rounded-lg p-6 text-center">
              <Icon name="heroicons:check-circle" class="text-6xl text-green-500 mx-auto mb-4" />
              <h4 class="text-xl font-semibold text-green-400 mb-2">Bulk Update Complete!</h4>
              <p class="text-zinc-300">
                Updated <strong>{{ updateResult.updatedCount }}</strong> out of <strong>{{ updateResult.totalFiles }}</strong> files
              </p>
              
              <div v-if="updateResult.errors && updateResult.errors.length > 0" class="mt-4 bg-red-900/20 border border-red-700 rounded p-4 text-left">
                <h5 class="text-sm font-semibold text-red-400 mb-2">Errors ({{ updateResult.errors.length }}):</h5>
                <ul class="text-xs text-zinc-400 space-y-1 max-h-40 overflow-y-auto">
                  <li v-for="(error, index) in updateResult.errors" :key="index">
                    {{ error.file }}: {{ error.error }}
                  </li>
                </ul>
              </div>
            </div>
            
            <button
              @click="resetForm"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Perform Another Update
            </button>
          </div>

          <!-- Actions -->
          <div v-if="!updateResult" class="flex gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              @click="handleBulkUpdate"
              :disabled="processing"
              class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors font-medium"
            >
              <Icon v-if="!processing" name="heroicons:bolt" />
              <Icon v-else name="heroicons:arrow-path" class="animate-spin" />
              {{ processing ? 'Processing...' : 'Apply Bulk Changes' }}
            </button>
            <button
              @click="closeManager"
              :disabled="processing"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:x-mark" />
              Cancel
            </button>
          </div>
          <div v-else class="flex gap-3 mt-6 pt-6 border-t border-zinc-800">
            <button
              @click="closeManager"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:x-mark" />
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

