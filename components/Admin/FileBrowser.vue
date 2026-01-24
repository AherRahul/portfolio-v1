<script setup lang="ts">
const props = defineProps<{
  type: string
  currentPath?: string
  filterCourseFolders?: boolean
}>()

const emit = defineEmits<{
  'file-select': [path: string]
  'directory-open': [path: string]
}>()

const { data: browserData, refresh } = await useFetch('/api/admin/content/browse', {
  query: computed(() => ({
    type: props.type,
    path: props.currentPath || '',
    filterCourseFolders: props.filterCourseFolders ? 'true' : 'false'
  }))
})

const items = computed(() => browserData.value?.items || [])

// Refresh when type, path, or filter changes
watch([() => props.type, () => props.currentPath, () => props.filterCourseFolders], () => {
  refresh()
})

function handleItemClick(item: any) {
  if (item.type === 'directory') {
    emit('directory-open', item.path)
  } else if (item.isMarkdown) {
    emit('file-select', item.path)
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Navigate up one directory
function navigateUp() {
  if (!props.currentPath) return
  const parts = props.currentPath.split('/').filter(Boolean)
  parts.pop()
  emit('directory-open', parts.join('/'))
}

defineExpose({ refresh })
</script>

<template>
  <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-zinc-800 border-b border-zinc-700 px-4 py-3">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:folder" class="text-yellow-500" />
          <span class="text-sm font-medium text-white">
            {{ type }}
          </span>
        </div>
        <button
          v-if="currentPath"
          @click="navigateUp"
          class="text-zinc-400 hover:text-white transition-colors"
          title="Go up"
        >
          <Icon name="heroicons:arrow-up" />
        </button>
      </div>
      <!-- Breadcrumb -->
      <div v-if="currentPath" class="flex items-center gap-1 text-xs text-zinc-400">
        <button @click="emit('directory-open', '')" class="hover:text-white transition-colors">
          {{ type }}
        </button>
        <template v-for="(part, index) in currentPath.split('/').filter(Boolean)" :key="index">
          <Icon name="heroicons:chevron-right" class="text-zinc-600 text-xs" />
          <button 
            @click="emit('directory-open', currentPath.split('/').slice(0, index + 1).join('/'))"
            class="hover:text-white transition-colors"
          >
            {{ part }}
          </button>
        </template>
      </div>
    </div>
    
    <!-- File List -->
    <div class="divide-y divide-zinc-800 max-h-[600px] overflow-y-auto">
      <div v-if="items.length === 0" class="p-8 text-center text-zinc-500">
        No files found
      </div>
      
      <button
        v-for="item in items"
        :key="item.path"
        @click="handleItemClick(item)"
        class="w-full px-4 py-3 hover:bg-zinc-800 transition-colors flex items-center gap-3 text-left"
      >
        <!-- Icon -->
        <Icon
          :name="item.type === 'directory' ? 'heroicons:folder' : 'heroicons:document-text'"
          :class="item.type === 'directory' ? 'text-yellow-500' : 'text-blue-500'"
          class="text-xl flex-shrink-0"
        />
        
        <!-- Name -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-white truncate">
            {{ item.name }}
          </div>
          <div class="text-xs text-zinc-500">
            {{ formatDate(item.modified) }}
            <span v-if="item.type === 'file'" class="ml-2">{{ formatSize(item.size) }}</span>
          </div>
        </div>
        
        <!-- Action Icon -->
        <Icon
          :name="item.type === 'directory' ? 'heroicons:chevron-right' : 'heroicons:pencil'"
          class="text-zinc-600 flex-shrink-0"
        />
      </button>
    </div>
  </div>
</template>

