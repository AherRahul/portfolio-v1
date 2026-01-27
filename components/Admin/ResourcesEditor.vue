<script setup lang="ts">
interface Resource {
  title: string
  type: string
  url?: string
  description?: string
}

const props = defineProps<{
  modelValue: Resource[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Resource[]]
}>()

// Resource types found in content - sorted alphabetically
const resourceTypes = [
  'article',
  'book',
  'course',
  'documentation',
  'PDF',
  'practice',
  'reference',
  'specification',
  'tool',
  'tutorial',
  'video'
]

const resources = computed<Resource[]>({
  get: () => props.modelValue || [],
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const editingIndex = ref<number | null>(null)
const showPreview = ref(false)
const draggedIndex = ref<number | null>(null)

// New resource form
const newResource = ref({
  title: '',
  type: 'article',
  url: '',
  description: ''
})

function addResource() {
  if (!newResource.value.title.trim()) {
    alert('Title is required')
    return
  }
  
  const resourceToAdd = {
    title: newResource.value.title.trim(),
    type: newResource.value.type,
    url: newResource.value.url || '',
    description: newResource.value.description || ''
  }
  
  resources.value = [...resources.value, resourceToAdd]
  
  // Reset form
  newResource.value = {
    title: '',
    type: 'article',
    url: '',
    description: ''
  }
}

function editResource(index: number) {
  editingIndex.value = index
  const resource = resources.value[index]
  newResource.value = {
    title: resource.title || '',
    type: resource.type || 'article',
    url: resource.url || '',
    description: resource.description || ''
  }
}

function updateResource() {
  if (editingIndex.value === null) return
  if (!newResource.value.title.trim()) {
    alert('Title is required')
    return
  }
  
  const resourceToUpdate = {
    title: newResource.value.title.trim(),
    type: newResource.value.type,
    url: newResource.value.url || '',
    description: newResource.value.description || ''
  }
  
  const updated = [...resources.value]
  updated[editingIndex.value] = resourceToUpdate
  resources.value = updated
  
  // Reset
  editingIndex.value = null
  newResource.value = {
    title: '',
    type: 'article',
    url: '',
    description: ''
  }
}

function deleteResource(index: number) {
  if (confirm('Are you sure you want to delete this resource?')) {
    resources.value = resources.value.filter((_, i) => i !== index)
  }
}

function cancelEdit() {
  editingIndex.value = null
  newResource.value = {
    title: '',
    type: 'article',
    url: '',
    description: ''
  }
}

// Drag and drop for reordering
function handleDragStart(index: number) {
  draggedIndex.value = index
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(event: DragEvent, dropIndex: number) {
  event.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    draggedIndex.value = null
    return
  }
  
  const items = [...resources.value]
  const draggedItem = items[draggedIndex.value]
  
  items.splice(draggedIndex.value, 1)
  items.splice(dropIndex, 0, draggedItem)
  
  resources.value = items
  draggedIndex.value = null
}

function moveUp(index: number) {
  if (index === 0) return
  const items = [...resources.value]
  const temp = items[index]
  items[index] = items[index - 1]
  items[index - 1] = temp
  resources.value = items
}

function moveDown(index: number) {
  if (index === resources.value.length - 1) return
  const items = [...resources.value]
  const temp = items[index]
  items[index] = items[index + 1]
  items[index + 1] = temp
  resources.value = items
}

function togglePreview() {
  showPreview.value = !showPreview.value
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <label class="block text-sm font-medium text-zinc-300">
          Resources
          <span class="text-xs text-zinc-500 ml-2">({{ resources.length }} items)</span>
        </label>
        <p class="text-xs text-zinc-500 mt-1">
          Add external resources like PDFs, articles, documentation, etc.
        </p>
      </div>
      <button
        @click="togglePreview"
        class="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
      >
        <Icon :name="showPreview ? 'heroicons:eye-slash' : 'heroicons:eye'" class="text-sm" />
        {{ showPreview ? 'Hide' : 'Show' }} Preview
      </button>
    </div>

    <!-- Preview Mode -->
    <div v-if="showPreview" class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
      <h4 class="text-sm font-semibold text-zinc-300 mb-3">Resources Preview</h4>
      <div v-if="resources.length === 0" class="text-center text-zinc-500 text-sm py-4">
        No resources added yet
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="(resource, index) in resources"
          :key="index"
          class="bg-zinc-900 border border-zinc-700 rounded-md p-3 hover:border-zinc-600 transition-colors"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                  {{ resource.type }}
                </span>
                <h5 class="font-medium text-zinc-200 truncate">{{ resource.title }}</h5>
              </div>
              <p v-if="resource.description" class="text-sm text-zinc-400 mb-2">
                {{ resource.description }}
              </p>
              <a
                v-if="resource.url"
                :href="resource.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
              >
                <Icon name="heroicons:arrow-top-right-on-square" class="text-xs" />
                {{ resource.url }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources List -->
    <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
      <div v-if="resources.length === 0" class="text-center text-zinc-500 text-sm py-4">
        No resources added yet. Add your first resource below.
      </div>
      
      <div v-else class="space-y-2">
        <div
          v-for="(resource, index) in resources"
          :key="index"
          :draggable="true"
          @dragstart="handleDragStart(index)"
          @dragover="handleDragOver"
          @drop="handleDrop($event, index)"
          class="bg-zinc-900 border border-zinc-700 rounded-md p-3 hover:border-zinc-600 transition-colors cursor-move"
        >
          <div class="flex items-start gap-3">
            <!-- Drag Handle -->
            <div class="flex flex-col gap-1 pt-1">
              <button
                @click="moveUp(index)"
                :disabled="index === 0"
                class="text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move up"
              >
                <Icon name="heroicons:chevron-up" class="text-sm" />
              </button>
              <button
                @click="moveDown(index)"
                :disabled="index === resources.length - 1"
                class="text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move down"
              >
                <Icon name="heroicons:chevron-down" class="text-sm" />
              </button>
            </div>
            
            <!-- Resource Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">
                  {{ resource.type }}
                </span>
                <span class="font-medium text-zinc-200">{{ resource.title }}</span>
              </div>
              <p v-if="resource.description" class="text-xs text-zinc-400 mb-1">
                {{ resource.description }}
              </p>
              <a
                v-if="resource.url"
                :href="resource.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-red-500 hover:text-red-400 flex items-center gap-1"
              >
                <Icon name="heroicons:arrow-top-right-on-square" class="text-xs" />
                {{ resource.url.length > 50 ? resource.url.substring(0, 50) + '...' : resource.url }}
              </a>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-1">
              <button
                @click="editResource(index)"
                class="text-blue-500 hover:text-blue-400 p-1"
                title="Edit"
              >
                <Icon name="heroicons:pencil" class="text-sm" />
              </button>
              <button
                @click="deleteResource(index)"
                class="text-red-500 hover:text-red-400 p-1"
                title="Delete"
              >
                <Icon name="heroicons:trash" class="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Form -->
    <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
      <h4 class="text-sm font-semibold text-zinc-300">
        {{ editingIndex !== null ? 'Edit Resource' : 'Add New Resource' }}
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- Title -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-zinc-400 mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="newResource.title"
            type="text"
            placeholder="Resource title"
            class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <!-- Type -->
        <div>
          <label class="block text-xs font-medium text-zinc-400 mb-1">
            Type <span class="text-red-500">*</span>
          </label>
          <select
            v-model="newResource.type"
            class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="type in resourceTypes" :key="type" :value="type">
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </option>
          </select>
        </div>
        
        <!-- URL -->
        <div>
          <label class="block text-xs font-medium text-zinc-400 mb-1">
            URL
          </label>
          <input
            v-model="newResource.url"
            type="url"
            placeholder="https://example.com"
            class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <!-- Description -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-zinc-400 mb-1">
            Description
          </label>
          <textarea
            v-model="newResource.description"
            rows="2"
            placeholder="Brief description of the resource"
            class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>
      
      <!-- Form Actions -->
      <div class="flex gap-2 pt-2">
        <button
          @click="editingIndex !== null ? updateResource() : addResource()"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="heroicons:check" class="text-sm" />
          {{ editingIndex !== null ? 'Update' : 'Add' }} Resource
        </button>
        <button
          v-if="editingIndex !== null"
          @click="cancelEdit"
          class="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

