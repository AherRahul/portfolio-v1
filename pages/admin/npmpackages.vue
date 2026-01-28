<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false,
  documentDriven: false
})

const contentType = 'npmpackages'
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

watch(selectedFile, async (newPath) => {
  if (!newPath) {
    fileContent.value = ''
    isEditing.value = false
    return
  }
  
  try {
    const response = await $fetch('/api/admin/content/file', {
      query: { type: contentType, path: newPath }
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
      body: { type: contentType, path: selectedFile.value, content: fileContent.value }
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
  if (!confirm(`Delete "${selectedFile.value}"?`)) return
  deleting.value = true
  try {
    await $fetch('/api/admin/content/file', {
      method: 'DELETE',
      body: { type: contentType, path: selectedFile.value }
    })
    alert('File deleted!')
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

async function createNewFile() {
  if (!newFileName.value.trim()) return
  let fileName = newFileName.value.trim()
  if (!fileName.endsWith('.md')) fileName += '.md'
  const filePath = currentPath.value ? `${currentPath.value}/${fileName}` : fileName
  
  try {
    await $fetch('/api/admin/content/file', {
      method: 'POST',
      body: {
        type: contentType,
        path: filePath,
        content: `---\ntitle: "New NPM Package"\ntime: "2024"\ntopics:\n  - javascript\n---\n\n# New NPM Package\n\nPackage documentation here...`
      }
    })
    newFileName.value = ''
    creating.value = false
    fileBrowser.value?.refresh()
    selectedFile.value = filePath
  } catch (err) {
    console.error('Error creating file:', err)
    alert('Failed to create file')
  }
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
  window.open(`/npmpackages/${fileName}`, '_blank')
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
            <h1 class="text-xl font-bold">Manage NPM Packages</h1>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink to="/npmpackages/" target="_blank" class="text-zinc-400 hover:text-white">
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
          <button @click="creating = true" class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 mb-4">
            <Icon name="heroicons:plus" />New Package
          </button>
          <AdminFileBrowser ref="fileBrowser" :type="contentType" :current-path="currentPath" @file-select="selectedFile = $event" @directory-open="currentPath = $event" />
        </div>
        
        <div class="col-span-12 lg:col-span-9">
          <div v-if="!isEditing" class="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
            <Icon name="heroicons:cube" class="text-6xl text-zinc-700 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-zinc-400 mb-2">No file selected</h3>
            <p class="text-zinc-500">Select a file to start editing</p>
          </div>
          
          <div v-else class="space-y-4">
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Icon name="heroicons:cube" class="text-red-500 text-2xl" />
                <div>
                  <h3 class="font-semibold">{{ selectedFile }}</h3>
                  <p class="text-sm text-zinc-500">{{ contentType }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="handleSave" :disabled="saving" class="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Icon name="heroicons:check" />{{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button @click="handleDelete" :disabled="deleting" class="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Icon name="heroicons:trash" />{{ deleting ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </div>
            <AdminMarkdownEditor ref="markdownEditor" v-model="fileContent" :file-path="selectedFile" :content-type="contentType" @save="handleSave" @view-on-site="handleViewOnSite" class="h-[calc(100vh-280px)]" style="min-height: 600px; height: 600px;" />
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="creating" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="creating = false">
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">Create New NPM Package</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-zinc-300 mb-2">File Name</label>
          <input v-model="newFileName" type="text" placeholder="my-package.md" class="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500" @keyup.enter="createNewFile" />
          <p class="text-xs text-zinc-500 mt-1">Will be created in: {{ currentPath || 'npmpackages/' }}</p>
        </div>
        <div class="flex gap-3">
          <button @click="createNewFile" class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Create</button>
          <button @click="creating = false" class="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

