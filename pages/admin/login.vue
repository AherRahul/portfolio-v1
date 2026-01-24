<script setup lang="ts">
definePageMeta({
  layout: false,
  documentDriven: false
})

const email = ref('admin@rahulaher.com')
const password = ref('R@hu95heR')
const error = ref('')
const loading = ref(false)

const router = useRouter()

async function handleLogin() {
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
    
    console.log('Login response:', response)
    
    if (response.success) {
      // Cookie is set by server
      console.log('Login successful, redirecting to dashboard...')
      
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
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <!-- Error Message -->
          <div v-if="error" class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm">
            {{ error }}
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-colors duration-200"
          >
            <span v-if="loading">Signing in...</span>
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

