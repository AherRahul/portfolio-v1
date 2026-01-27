<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false,
  documentDriven: false
})

// Toggle between course content and standalone articles
const viewMode = ref<'course-articles' | 'articles'>('course-articles')
const selectedCourse = ref('')

const router = useRouter()
const currentPath = ref('')
const selectedFile = ref('')
const fileContent = ref('')
const isEditing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const creating = ref(false)
const newFileName = ref('')

const fileBrowser = ref()
const markdownEditor = ref()
const frontmatterEditor = ref()
const bulkManager = ref()

const contentType = 'articles'

// Fetch available courses
const { data: coursesData } = await useAsyncData('course-list', () => 
  $fetch('/api/admin/content/course-slugs')
)
const availableCourses = computed(() => coursesData.value?.slugs || [])

// Watch for view mode changes
watch(viewMode, () => {
  currentPath.value = ''
  selectedFile.value = ''
  fileContent.value = ''
  isEditing.value = false
  selectedCourse.value = ''
  fileBrowser.value?.refresh()
})

// Watch for course selection
watch(selectedCourse, (newCourse) => {
  if (newCourse && viewMode.value === 'course-articles') {
    currentPath.value = newCourse
  }
})

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
  } catch (err) {
    console.error('Error loading file:', err)
    alert('Failed to load file')
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
    
    markdownEditor.value?.clearDraft()
    alert('File saved successfully!')
  } catch (err) {
    console.error('Error saving file:', err)
    alert('Failed to save file')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!selectedFile.value) return
  
  const confirmed = confirm(`Are you sure you want to delete "${selectedFile.value}"? This action cannot be undone.`)
  if (!confirmed) return
  
  deleting.value = true
  try {
    // If this is a course article, remove from parent course modules
    if (viewMode.value === 'course-articles' && selectedCourse.value) {
      try {
        const pathParts = selectedFile.value.split('/')
        const articleSlug = pathParts[pathParts.length - 1].replace('.md', '')
        await $fetch('/api/admin/courses/update-modules', {
          method: 'POST',
          body: {
            courseSlug: selectedCourse.value,
            articleSlug: articleSlug,
            action: 'remove'
          }
        })
        console.log(`Removed ${articleSlug} from course ${selectedCourse.value}`)
      } catch (err) {
        console.error('Failed to update course modules:', err)
        // Continue with deletion even if module update fails
      }
    }
    
    await $fetch('/api/admin/content/file', {
      method: 'DELETE',
      body: {
        type: contentType,
        path: selectedFile.value
      }
    })
    
    alert('File deleted successfully!')
    selectedFile.value = ''
    fileContent.value = ''
    isEditing.value = false
    fileBrowser.value?.refresh()
  } catch (err) {
    console.error('Error deleting file:', err)
    alert('Failed to delete file')
  } finally {
    deleting.value = false
  }
}

function handleNewFile() {
  creating.value = true
}

async function createNewFile() {
  if (!newFileName.value.trim()) {
    alert('Please enter a file name')
    return
  }
  
  let fileName = newFileName.value.trim()
  if (!fileName.endsWith('.md')) {
    fileName += '.md'
  }
  
  const filePath = currentPath.value ? `${currentPath.value}/${fileName}` : fileName
  
  // Create different templates based on view mode
  let template = ''
  if (viewMode.value === 'course-articles') {
    template = `---
title: "New Course Article"
datePublished: ${new Date().toISOString().split('T')[0]}
dateModified: ${new Date().toISOString().split('T')[0]}
courseName: ${selectedCourse.value || 'course-name'}
showOnArticles: false
topics:
  - javascript
---

# New Course Article

Start writing your course content here...`
  } else {
    template = `---
title: "New Article"
datePublished: ${new Date().toISOString().split('T')[0]}
dateModified: ${new Date().toISOString().split('T')[0]}
showOnArticles: true
topics:
  - javascript
---

# New Article

Start writing your article content here...`
  }
  
  try {
    await $fetch('/api/admin/content/file', {
      method: 'POST',
      body: {
        type: contentType,
        path: filePath,
        content: template
      }
    })
    
    // If this is a course article, update the parent course modules
    if (viewMode.value === 'course-articles' && selectedCourse.value) {
      try {
        const articleSlug = fileName.replace('.md', '')
        await $fetch('/api/admin/courses/update-modules', {
          method: 'POST',
          body: {
            courseSlug: selectedCourse.value,
            articleSlug: articleSlug,
            action: 'add'
          }
        })
        console.log(`Added ${articleSlug} to course ${selectedCourse.value}`)
      } catch (err) {
        console.error('Failed to update course modules:', err)
        alert('Article created but failed to update course modules. Please add it manually.')
      }
    }
    
    newFileName.value = ''
    creating.value = false
    fileBrowser.value?.refresh()
    selectedFile.value = filePath
  } catch (err) {
    console.error('Error creating file:', err)
    alert('Failed to create file')
  }
}

function handleDirectoryOpen(path: string) {
  currentPath.value = path
}

function handleFileSelect(path: string) {
  selectedFile.value = path
}

function handleOpenMetadataEditor() {
  nextTick(() => {
    if (frontmatterEditor.value && typeof frontmatterEditor.value.openEditor === 'function') {
      frontmatterEditor.value.openEditor()
    } else {
      console.error('Frontmatter editor not available')
    }
  })
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
  
  let url = ''
  const parts = selectedFile.value.split('/')
  
  if (parts.length >= 2) {
    // Nested article: /articles/[folder]/[slug]
    const fileName = parts[parts.length - 1].replace('.md', '')
    const folder = parts[0]
    url = `/articles/${folder}/${fileName}`
  } else {
    // Root article: /articles/[slug]
    const fileName = selectedFile.value.replace('.md', '')
    url = `/articles/${fileName}`
  }
  
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <nav class="bg-zinc-900 border-b border-zinc-800">
      <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/admin/dashboard" class="text-zinc-400 hover:text-white">
              <Icon name="heroicons:arrow-left" class="text-xl" />
            </NuxtLink>
            <h1 class="text-xl font-bold">Manage Articles</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <button
              @click="bulkManager?.openManager()"
              class="text-zinc-400 hover:text-white flex items-center gap-2 text-sm"
              title="Bulk Update"
            >
              <Icon name="heroicons:bolt" class="text-xl" />
              <span class="hidden md:inline">Bulk Update</span>
            </button>
            <NuxtLink to="/articles/" target="_blank" class="text-zinc-400 hover:text-white">
              <Icon name="heroicons:arrow-top-right-on-square" class="text-xl" />
            </NuxtLink>
            <button @click="handleLogout" class="text-zinc-400 hover:text-white">
              <Icon name="heroicons:arrow-right-on-rectangle" class="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-3">
          <!-- View Mode Toggle -->
          <div class="mb-4 bg-zinc-900 border border-zinc-800 rounded-lg p-2">
            <div class="flex gap-2 mb-2">
              <button
                @click="viewMode = 'course-articles'"
                :class="viewMode === 'course-articles' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'"
                class="flex-1 px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Icon name="heroicons:folder" />
                Course Content
              </button>
              <button
                @click="viewMode = 'articles'"
                :class="viewMode === 'articles' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'"
                class="flex-1 px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Icon name="heroicons:document-text" />
                Standalone
              </button>
            </div>
            
            <!-- Course Selector (shown when in course-articles mode) -->
            <div v-if="viewMode === 'course-articles'" class="mt-2">
              <label class="block text-xs font-medium text-zinc-400 mb-1">Select Course:</label>
              <select 
                v-model="selectedCourse"
                class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Choose a course...</option>
                <option v-for="course in availableCourses" :key="course" :value="course">
                  {{ course }}
                </option>
              </select>
            </div>
          </div>
          
          <div v-if="viewMode === 'articles'" class="mb-4">
            <button
              @click="handleNewFile"
              class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="heroicons:plus" />
              New Article
            </button>
          </div>
          
          <AdminFileBrowser
            ref="fileBrowser"
            :type="contentType"
            :current-path="currentPath"
            :filter-course-folders="viewMode === 'articles'"
            @file-select="handleFileSelect"
            @directory-open="handleDirectoryOpen"
          />
        </div>
        
        <div class="col-span-12 lg:col-span-9">
          <div v-if="!isEditing" class="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
            <Icon name="heroicons:document-text" class="text-6xl text-zinc-700 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-zinc-400 mb-2">No file selected</h3>
            <p class="text-zinc-500">Select a file from the sidebar to start editing</p>
          </div>
          
          <div v-else class="space-y-4">
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon name="heroicons:document-text" class="text-purple-500 text-2xl" />
                <div>
                  <h3 class="font-semibold">{{ selectedFile }}</h3>
                  <p class="text-sm text-zinc-500">{{ contentType }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button
                  @click="handleOpenMetadataEditor"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  title="Edit Metadata"
                >
                  <Icon name="heroicons:document-text" />
                  Metadata
                </button>
                <button
                  @click="handleViewOnSite"
                  class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  title="View on Live Site"
                >
                  <Icon name="heroicons:arrow-top-right-on-square" />
                  Live
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
            
            <AdminMarkdownEditor
              ref="markdownEditor"
              v-model="fileContent"
              :file-path="selectedFile"
              :content-type="contentType"
              @save="handleSave"
              @view-on-site="handleViewOnSite"
              class="h-[calc(100vh-280px)]"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Standalone Frontmatter Editor (always rendered, visibility controlled internally) -->
    <AdminFrontmatterEditorEnhanced
      v-if="fileContent"
      ref="frontmatterEditor"
      v-model="fileContent"
      :content-type="contentType"
      :file-path="selectedFile"
      @save="handleSave"
    />
    
    <div
      v-if="creating"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="creating = false"
    >
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">
          Create New {{ viewMode === 'course-articles' ? 'Course Article' : 'Article' }}
        </h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-zinc-300 mb-2">
            File Name
          </label>
          <input
            v-model="newFileName"
            type="text"
            :placeholder="viewMode === 'course-articles' ? 'article-1-1.md' : 'my-article.md'"
            class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            @keyup.enter="createNewFile"
          />
          <p class="text-xs text-zinc-500 mt-1">
            Will be created in: articles/{{ currentPath || '' }}
          </p>
          <p v-if="viewMode === 'course-articles' && selectedCourse" class="text-xs text-zinc-400 mt-1">
            Course folder: {{ selectedCourse }}
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="createNewFile"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create
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
    
    <!-- Bulk Change Manager -->
    <AdminBulkChangeManager
      ref="bulkManager"
      :content-type="contentType"
      @update-complete="fileBrowser?.refresh()"
    />
  </div>
</template>

