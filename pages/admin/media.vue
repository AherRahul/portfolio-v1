<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false,
  documentDriven: false
})

const router = useRouter()

async function handleLogout() {
  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' })
    await router.push('/admin/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <nav class="bg-zinc-900 border-b border-zinc-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/admin/dashboard" class="text-zinc-400 hover:text-white">
              <Icon name="heroicons:arrow-left" class="text-xl" />
            </NuxtLink>
            <h1 class="text-xl font-bold">Media Library</h1>
          </div>
          <button @click="handleLogout" class="text-zinc-400 hover:text-white">
            <Icon name="heroicons:arrow-right-on-rectangle" class="text-xl" />
          </button>
        </div>
      </div>
    </nav>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
        <Icon name="heroicons:photo" class="text-6xl text-zinc-700 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-zinc-400 mb-2">Media Library Coming Soon</h3>
        <p class="text-zinc-500">Upload and manage images, videos, and other media files</p>
        <p class="text-zinc-600 text-sm mt-4">For now, use Cloudinary or upload directly to /public/img/</p>
      </div>
    </div>
  </div>
</template>

