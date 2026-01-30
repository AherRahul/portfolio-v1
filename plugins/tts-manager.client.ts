export default defineNuxtPlugin(() => {
  // Initialize global TTS manager early
  const { stopAllReaders, getActiveReadersCount } = useTTSManager()
  
  // Immediate cleanup function
  const immediateCleanup = (reason: string) => {
    // console.log(`🔴 IMMEDIATE TTS CLEANUP: ${reason}`)
    stopAllReaders()
    
    // Double-check cleanup worked
    setTimeout(() => {
      const remaining = getActiveReadersCount()
      if (remaining > 0) {
        console.warn(`⚠️ ${remaining} TTS readers still active after cleanup`)
        stopAllReaders() // Try again
      }
    }, 100)
  }
  
  // Hook into Nuxt router for cleanup
  const router = useRouter()
  
  router.beforeEach((to, from) => {
    if (from.path !== to.path) {
      immediateCleanup(`Route change: ${from.path} → ${to.path}`)
    }
    return true // Allow navigation to continue
  })
  
  router.afterEach((to, from) => {
    if (from.path !== to.path) {
      // Additional cleanup after route change
      setTimeout(() => immediateCleanup(`Post-navigation cleanup: ${to.path}`), 50)
    }
  })
  
  // Additional cleanup on app lifecycle
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('page:start', () => {
    immediateCleanup('Page start')
  })
  
  nuxtApp.hook('page:finish', () => {
    immediateCleanup('Page finish')
  })
  
  nuxtApp.hook('app:beforeMount', () => {
    immediateCleanup('App before mount')
  })
  
  nuxtApp.hook('app:mounted', () => {
    immediateCleanup('App mounted')
  })
  
  // Browser-level cleanup events
  if (process.client) {
    const cleanup = () => immediateCleanup('Browser event')
    
    window.addEventListener('beforeunload', cleanup, { capture: true, passive: false })
    window.addEventListener('pagehide', cleanup, { capture: true, passive: false })
    window.addEventListener('popstate', cleanup, { capture: true })
    
    // Periodic cleanup check (every 5 seconds)
    setInterval(() => {
      const activeCount = getActiveReadersCount()
      if (activeCount > 1) {
        console.warn(`⚠️ Multiple TTS readers detected (${activeCount}), cleaning up`)
        immediateCleanup('Periodic cleanup - multiple readers')
      }
    }, 5000)
  }
})
