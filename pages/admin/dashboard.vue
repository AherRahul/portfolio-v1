<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false,
  documentDriven: false
})

const router = useRouter()

// console.log('Dashboard component loading...')

// Fetch content statistics with error handling
const { data: stats, error: statsError } = await useAsyncData('admin-stats', () => 
  $fetch('/api/admin/content/stats').catch(err => {
    console.error('Error fetching stats:', err)
    return { courses: 0, articles: 0, projects: 0, learning: 0, npmpackages: 0, topics: 0 }
  })
)

if (statsError.value) {
  console.error('Stats error:', statsError.value)
}

onMounted(() => {
  // console.log('Dashboard mounted successfully')
  // console.log('Stats:', stats.value)
})

async function handleLogout() {
  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' })
    await router.push('/admin/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}

const quickActions = [
  {
    title: 'Manage Courses',
    description: 'Add, edit, or delete courses and their modules',
    icon: 'heroicons:academic-cap',
    to: '/admin/courses',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Manage Articles',
    description: 'Create and manage technical articles',
    icon: 'heroicons:document-text',
    to: '/admin/articles',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Manage Projects',
    description: 'Showcase your projects and work',
    icon: 'heroicons:code-bracket',
    to: '/admin/projects',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Manage Learning',
    description: 'Add talks, podcasts, and learning resources',
    icon: 'heroicons:light-bulb',
    to: '/admin/learning',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'NPM Packages',
    description: 'Manage your NPM package documentation',
    icon: 'heroicons:cube',
    to: '/admin/npmpackages',
    color: 'from-red-500 to-rose-500'
  }
]
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Header/Navbar -->
    <nav class="bg-zinc-900 border-b border-zinc-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="text-xl font-bold text-red-500">
              Rahul Aher
            </NuxtLink>
            <span class="text-zinc-600">|</span>
            <span class="text-zinc-400">Admin Portal</span>
          </div>
          
          <div class="flex items-center gap-4">
            <NuxtLink 
              to="/"
              target="_blank"
              class="text-zinc-400 hover:text-white transition-colors"
            >
              <Icon name="heroicons:arrow-top-right-on-square" class="text-xl" />
              View Site
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p class="text-zinc-400">Manage your content, courses, and portfolio from here</p>
      </div>
      
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-zinc-400 text-sm font-medium">Total Courses</h3>
            <Icon name="heroicons:academic-cap" class="text-blue-500 text-xl" />
          </div>
          <p class="text-3xl font-bold">{{ stats?.courses || 0 }}</p>
        </div>
        
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-zinc-400 text-sm font-medium">Total Articles</h3>
            <Icon name="heroicons:document-text" class="text-purple-500 text-xl" />
          </div>
          <p class="text-3xl font-bold">{{ stats?.articles || 0 }}</p>
        </div>
        
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-zinc-400 text-sm font-medium">Total Projects</h3>
            <Icon name="heroicons:code-bracket" class="text-green-500 text-xl" />
          </div>
          <p class="text-3xl font-bold">{{ stats?.projects || 0 }}</p>
        </div>
        
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-zinc-400 text-sm font-medium">Learning Resources</h3>
            <Icon name="heroicons:light-bulb" class="text-yellow-500 text-xl" />
          </div>
          <p class="text-3xl font-bold">{{ stats?.learning || 0 }}</p>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-6">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.title"
            :to="action.to"
            class="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-zinc-900/50"
          >
            <div class="flex items-start gap-4">
              <div :class="`bg-gradient-to-br ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`">
                <Icon :name="action.icon" class="text-white text-2xl" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold mb-1 group-hover:text-red-500 transition-colors">
                  {{ action.title }}
                </h3>
                <p class="text-sm text-zinc-400">{{ action.description }}</p>
              </div>
              <Icon 
                name="heroicons:arrow-right" 
                class="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" 
              />
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Recent Activity (Placeholder) -->
      <div>
        <h2 class="text-2xl font-bold mb-6">Recent Activity</h2>
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p class="text-zinc-400 text-center py-8">
            Activity tracking coming soon...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

