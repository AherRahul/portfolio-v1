<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'upload-complete': [url: string, type: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const folder = ref('portfolio')
const previewUrl = ref<string | null>(null)

const fileType = computed(() => {
  if (!selectedFile.value) return null
  
  const name = selectedFile.value.name.toLowerCase()
  if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image'
  if (name.match(/\.(pdf)$/)) return 'pdf'
  return 'other'
})

const resourceType = computed(() => {
  if (fileType.value === 'image') return 'image'
  if (fileType.value === 'pdf') return 'raw'
  return 'auto'
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    selectedFile.value = file
    
    // Create preview for images
    if (fileType.value === 'image') {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      previewUrl.value = null
    }
  }
}

function triggerFileSelect() {
  fileInput.value?.click()
}

async function handleUpload() {
  if (!selectedFile.value) return
  
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('folder', folder.value)
    formData.append('resourceType', resourceType.value)
    
    // Simulate progress (since fetch doesn't provide upload progress easily)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)
    
    const response = await $fetch('/api/admin/media/upload', {
      method: 'POST',
      body: formData
    })
    
    clearInterval(progressInterval)
    uploadProgress.value = 100
    
    // Emit the uploaded URL
    emit('upload-complete', response.url, fileType.value || 'file')
    
    // Reset and close
    setTimeout(() => {
      selectedFile.value = null
      previewUrl.value = null
      uploadProgress.value = 0
      emit('update:modelValue', false)
    }, 500)
    
  } catch (error: any) {
    console.error('Upload failed:', error)
    alert(error.data?.message || 'Failed to upload file')
  } finally {
    uploading.value = false
  }
}

function handleClose() {
  if (!uploading.value) {
    selectedFile.value = null
    previewUrl.value = null
    emit('update:modelValue', false)
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
      @click.self="handleClose"
    >
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-2xl w-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold">Upload Media</h3>
          <button
            @click="handleClose"
            :disabled="uploading"
            class="text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="heroicons:x-mark" class="text-2xl" />
          </button>
        </div>

        <!-- Folder Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            Cloudinary Folder
          </label>
          <select
            v-model="folder"
            :disabled="uploading"
            class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="portfolio">Portfolio</option>
            <option value="portfolio/articles">Articles</option>
            <option value="portfolio/courses">Courses</option>
            <option value="portfolio/projects">Projects</option>
            <option value="portfolio/resources">Resources</option>
          </select>
        </div>

        <!-- File Input (Hidden) -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*,.pdf"
          class="hidden"
          @change="handleFileSelect"
        />

        <!-- Upload Area -->
        <div
          v-if="!selectedFile"
          @click="triggerFileSelect"
          class="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center cursor-pointer hover:border-red-500 transition-colors"
        >
          <Icon name="heroicons:cloud-arrow-up" class="text-6xl text-zinc-600 mx-auto mb-4" />
          <p class="text-zinc-400 mb-2">Click to select a file</p>
          <p class="text-xs text-zinc-500">Supported: Images (JPG, PNG, GIF, WebP, SVG) and PDF</p>
        </div>

        <!-- Selected File Preview -->
        <div v-else class="space-y-4">
          <!-- Preview -->
          <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <div v-if="previewUrl" class="mb-4">
              <img :src="previewUrl" alt="Preview" class="max-h-64 mx-auto rounded" />
            </div>
            <div class="flex items-center gap-3">
              <Icon
                :name="fileType === 'image' ? 'heroicons:photo' : 'heroicons:document'"
                class="text-3xl text-blue-500"
              />
              <div class="flex-1">
                <p class="font-medium text-white">{{ selectedFile.name }}</p>
                <p class="text-sm text-zinc-500">
                  {{ formatFileSize(selectedFile.size) }} • {{ fileType?.toUpperCase() }}
                </p>
              </div>
              <button
                v-if="!uploading"
                @click="selectedFile = null; previewUrl = null"
                class="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Icon name="heroicons:trash" class="text-xl" />
              </button>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-zinc-400">Uploading...</span>
              <span class="text-zinc-300">{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                class="bg-red-500 h-full transition-all duration-300"
                :style="{ width: `${uploadProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="handleUpload"
              :disabled="uploading"
              class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:cloud-arrow-up" />
              {{ uploading ? 'Uploading...' : 'Upload' }}
            </button>
            <button
              @click="triggerFileSelect"
              :disabled="uploading"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:arrow-path" />
              Change File
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

