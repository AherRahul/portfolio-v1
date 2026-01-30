<script setup lang="ts">
definePageMeta({
  layout: false,
  documentDriven: false
})

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const isProduction = ref(false)

const router = useRouter()

onMounted(() => {
  // Check if running in production (Netlify)
  if (window.location.hostname.includes('netlify.app') || window.location.hostname === 'rahulaher.netlify.app') {
    isProduction.value = true
    error.value = 'Admin portal is only available in local development environment. Please run locally to manage content.'
  }
})

async function handleLogin() {
  if (isProduction.value) {
    error.value = 'Admin portal is not available in production. Please run locally.'
    return
  }
  
  error.value = ''
  loading.value = true
  
  try {
    const response = await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    // console.log('Login response:', response)
    
    if (response.success) {
      // Cookie is set by server
      // console.log('Login successful, redirecting to dashboard...')
      
      // Force a full page reload to ensure cookie is properly set
      window.location.href = '/admin/dashboard'
    } else {
      error.value = 'Login failed. Please try again.'
    }
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.data?.message || err.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Logo/Branding -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Admin Portal</h1>
        <p class="text-zinc-400">Rahul Aher - Content Management System</p>
      </div>
      
      <!-- Login Card -->
      <div class="bg-zinc-800 border border-zinc-700 rounded-lg p-8 shadow-2xl">
        <h2 class="text-2xl font-semibold text-white mb-6">Sign In</h2>
        
        <!-- Production Warning -->
        <div v-if="isProduction" class="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-md text-sm mb-6">
          <div class="flex items-start gap-3">
            <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold mb-1">Production Environment Detected</p>
              <p class="text-xs text-yellow-400">The admin portal is only available in local development. Clone the repository and run <code class="bg-yellow-500/20 px-1 py-0.5 rounded">npm run dev</code> locally to manage content.</p>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="isProduction"
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="admin@example.com"
            />
          </div>
          
          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-zinc-300 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              :disabled="isProduction"
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>
          
          <!-- Error Message -->
          <div v-if="error && !isProduction" class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
            {{ error }}
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || isProduction"
            class="w-full bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-colors duration-200"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else-if="isProduction">Not Available in Production</span>
            <span v-else>Sign In</span>
          </button>
        </form>
        
        <!-- Security Note -->
        <div class="mt-6 text-center text-xs text-zinc-500">
          <Icon name="heroicons:lock-closed" class="inline-block mr-1" />
          Secure admin access only
        </div>
      </div>
      
      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-zinc-500">
        <p>Protected area. Authorized personnel only.</p>
      </div>
    </div>
  </div>
</template>

