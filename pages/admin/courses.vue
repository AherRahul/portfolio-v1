<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false,
  documentDriven: false
})

const router = useRouter()
const currentPath = ref('')
const selectedFile = ref('')
const fileContent = ref('')
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const creating = ref(false)
const newCourseData = ref({
  fileName: '',
  title: '',
  description: ''
})

const fileBrowser = ref()
const markdownEditor = ref()
const courseContentEditor = ref()

const contentType = 'courses'

// No additional watchers needed for courses-only view

// Fetch file content when selected
watch(selectedFile, async (newPath) => {
  if (!newPath) {
    fileContent.value = ''
    isEditing.value = false
    return
  }
  
  try {
    const response = await $fetch('/api/admin/content/file', {
      query: {
        type: contentType,
        path: newPath
      }
    })
    fileContent.value = response.content
    isEditing.value = true
  } catch (err: any) {
    console.error('Error loading file:', err)
    const errorMsg = err.data?.message || err.message || 'Failed to load file'
    alert(`Error: ${errorMsg}`)
  }
})

async function handleSave() {
  if (!selectedFile.value) return
  
  saving.value = true
  try {
    await $fetch('/api/admin/content/file', {
      method: 'POST',
      body: {
        type: contentType,
        path: selectedFile.value,
        content: fileContent.value
      }
    })
    
    // Clear draft
    markdownEditor.value?.clearDraft()
    
    alert('File saved successfully!')
  } catch (err: any) {
    console.error('Error saving file:', err)
    const errorMsg = err.data?.message || err.message || 'Failed to save file'
    alert(`Error: ${errorMsg}`)
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!selectedFile.value) return
  
  const confirmed = confirm(`Are you sure you want to delete "${selectedFile.value}" and its associated articles folder? This action cannot be undone.`)
  if (!confirmed) return
  
  deleting.value = true
  try {
    // Extract course slug from file path
    const courseSlug = selectedFile.value.split('/').pop() || selectedFile.value
    
    // Use course-specific delete endpoint that also deletes articles folder
    await $fetch('/api/admin/courses/delete', {
      method: 'POST',
      body: {
        courseSlug: courseSlug
      }
    })
    
    alert('Course and associated articles folder deleted successfully!')
    selectedFile.value = ''
    fileContent.value = ''
    isEditing.value = false
    fileBrowser.value?.refresh()
  } catch (err: any) {
    console.error('Error deleting course:', err)
    const errorMsg = err.data?.message || err.message || 'Failed to delete course'
    alert(`Error: ${errorMsg}`)
  } finally {
    deleting.value = false
  }
}

function handleNewFile() {
  creating.value = true
  // Reset form
  newCourseData.value = {
    fileName: '',
    title: '',
    description: ''
  }
}

async function createNewCourse() {
  if (!newCourseData.value.fileName.trim()) {
    alert('Please enter a file name')
    return
  }
  
  if (!newCourseData.value.title.trim()) {
    alert('Please enter a course title')
    return
  }
  
  if (!newCourseData.value.description.trim()) {
    alert('Please enter a course description')
    return
  }
  
  try {
    const response = await $fetch('/api/admin/courses/create', {
      method: 'POST',
      body: {
        fileName: newCourseData.value.fileName.trim(),
        title: newCourseData.value.title.trim(),
        description: newCourseData.value.description.trim()
      }
    })
    
    // Reset form
    newCourseData.value = {
      fileName: '',
      title: '',
      description: ''
    }
    creating.value = false
    
    // Select the newly created course file
    if (response.course && (response.course as any).fileName) {
      selectedFile.value = (response.course as any).fileName
      
      // Load the file content without full page refresh
      try {
        const fileResponse = await $fetch('/api/admin/content/file', {
          query: {
            type: contentType,
            path: selectedFile.value
          }
        })
        fileContent.value = fileResponse.content
        isEditing.value = true
      } catch (err: any) {
        console.error('Error loading file:', err)
      }
    }
    
    // Refresh file browser without page reload
    await nextTick()
    fileBrowser.value?.refresh()
    
    alert('Course created successfully! Course file, articles folder, and first topic have been created.')
  } catch (err: any) {
    console.error('Error creating course:', err)
    const errorMsg = err.data?.message || err.message || 'Failed to create course'
    alert(`Error: ${errorMsg}`)
  }
}

function handleDirectoryOpen(path: string) {
  currentPath.value = path
}

function handleFileSelect(path: string) {
  selectedFile.value = path
}

async function handleLogout() {
  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' })
    await router.push('/admin/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}

function handleViewOnSite() {
  if (!selectedFile.value) return
  const fileName = selectedFile.value.replace('.md', '')
  window.open(`/courses/${fileName}`, '_blank')
}

function handleOpenContentEditor() {
  nextTick(() => {
    if (courseContentEditor.value && typeof courseContentEditor.value.openEditor === 'function') {
      courseContentEditor.value.openEditor()
    } else {
      console.error('CourseContentEditor ref not available')
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Header -->
    <nav class="bg-zinc-900 border-b border-zinc-800">
      <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/admin/dashboard" class="text-zinc-400 hover:text-white">
              <Icon name="heroicons:arrow-left" class="text-xl" />
            </NuxtLink>
            <div>
              <h1 class="text-xl font-bold">Manage Courses</h1>
              <p class="text-xs text-zinc-500">Course definitions from content/courses/</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <NuxtLink to="/courses/" target="_blank" class="text-zinc-400 hover:text-white">
              <Icon name="heroicons:arrow-top-right-on-square" class="text-xl" />
            </NuxtLink>
            <button @click="handleLogout" class="text-zinc-400 hover:text-white">
              <Icon name="heroicons:arrow-right-on-rectangle" class="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-12 gap-6">
        <!-- File Browser Sidebar -->
        <div class="col-span-12 lg:col-span-3">
          <div class="mb-4">
            <button
              @click="handleNewFile"
              class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:plus" />
              New Course
            </button>
          </div>
          
          <AdminFileBrowser
            ref="fileBrowser"
            :type="contentType"
            :current-path="currentPath"
            @file-select="handleFileSelect"
            @directory-open="handleDirectoryOpen"
          />
        </div>
        
        <!-- Editor Area -->
        <div class="col-span-12 lg:col-span-9">
          <div v-if="!isEditing" class="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
            <Icon name="heroicons:document-text" class="text-6xl text-zinc-700 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-zinc-400 mb-2">No file selected</h3>
            <p class="text-zinc-500">Select a file from the sidebar to start editing</p>
          </div>
          
          <div v-else class="space-y-4">
            <!-- File Info -->
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon name="heroicons:document-text" class="text-blue-500 text-2xl" />
                <div>
                  <h3 class="font-semibold">{{ selectedFile }}</h3>
                  <p class="text-sm text-zinc-500">{{ contentType }} / {{ currentPath || 'root' }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button
                  @click="handleOpenContentEditor"
                  class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <Icon name="heroicons:squares-2x2" />
                  Manage Content
                </button>
                <button
                  @click="handleSave"
                  :disabled="saving"
                  class="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <Icon name="heroicons:check" />
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button
                  @click="handleDelete"
                  :disabled="deleting"
                  class="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <Icon name="heroicons:trash" />
                  {{ deleting ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </div>
            
            <!-- Editor -->
            <AdminMarkdownEditor
              ref="markdownEditor"
              v-model="fileContent"
              :file-path="selectedFile"
              :content-type="contentType"
              @save="handleSave"
              @view-on-site="handleViewOnSite"
              class="h-[calc(100vh-280px)]"
              style="min-height: 600px; height: 600px;"
            />
          </div>
        </div>
      </div>
      
      <!-- Course Content Editor - Always rendered but hidden -->
      <AdminCourseContentEditor
        v-if="isEditing"
        ref="courseContentEditor"
        v-model="fileContent"
        :course-slug="selectedFile.split('/').pop()?.replace('.md', '') || ''"
        @save="handleSave"
      />
    </div>
    
    <!-- Create Course Modal -->
    <div
      v-if="creating"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
      @click.self="creating = false"
    >
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-lg w-full my-8">
        <h3 class="text-xl font-semibold mb-6">Create New Course</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">
              File Name (Slug) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newCourseData.fileName"
              type="text"
              placeholder="my-course-name"
              class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              @keyup.enter="createNewCourse"
            />
            <p class="text-xs text-zinc-500 mt-1">
              URL-friendly name (lowercase, hyphens only). Will create: courses/my-course-name.md
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">
              Course Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newCourseData.title"
              type="text"
              placeholder="My Awesome Course"
              class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              @keyup.enter="createNewCourse"
            />
            <p class="text-xs text-zinc-500 mt-1">
              Display name for the course
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">
              Course Description <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="newCourseData.description"
              rows="4"
              placeholder="A comprehensive course that covers..."
              class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            ></textarea>
            <p class="text-xs text-zinc-500 mt-1">
              Brief description of what the course covers
            </p>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-zinc-800">
          <p class="text-xs text-zinc-400 mb-4">
            This will create:
            <br />• Course file: <code class="text-zinc-500">courses/{{ newCourseData.fileName || 'filename' }}.md</code>
            <br />• Articles folder: <code class="text-zinc-500">articles/{{ newCourseData.fileName || 'filename' }}/</code>
            <br />• First topic: <code class="text-zinc-500">articles/{{ newCourseData.fileName || 'filename' }}/{{ newCourseData.fileName || 'filename' }}-1-1.md</code>
          </p>
          
          <div class="flex gap-3">
            <button
              @click="createNewCourse"
              class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Create Course
            </button>
            <button
              @click="creating = false"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

