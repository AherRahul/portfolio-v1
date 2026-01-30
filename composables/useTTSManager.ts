// Global TTS Manager to ensure cleanup across all components and navigation
class TTSManager {
  private static instance: TTSManager
  private activeReaders = new Set<() => void>()
  private isInitialized = false

  static getInstance(): TTSManager {
    if (!TTSManager.instance) {
      TTSManager.instance = new TTSManager()
    }
    return TTSManager.instance
  }

  private constructor() {
    if (process.client) {
      this.initializeCleanupListeners()
    }
  }

  private initializeCleanupListeners() {
    if (this.isInitialized) return
    this.isInitialized = true

    const cleanup = () => {
      // console.log('Global TTS cleanup triggered')
      this.stopAllReaders()
    }

    // Page navigation and refresh events
    window.addEventListener('beforeunload', cleanup, { capture: true })
    window.addEventListener('unload', cleanup, { capture: true })
    window.addEventListener('pagehide', cleanup, { capture: true })
    
    // Browser navigation
    window.addEventListener('popstate', cleanup)
    window.addEventListener('hashchange', cleanup)
    
    // Tab/window changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cleanup()
    })

    // Nuxt integration will be handled by the plugin
    // console.log('Global TTS Manager initialized')
  }

  registerReader(stopFunction: () => void): () => void {
    this.activeReaders.add(stopFunction)
    
    // Return unregister function
    return () => {
      this.activeReaders.delete(stopFunction)
    }
  }

  stopAllReaders() {
    // console.log(`Stopping ${this.activeReaders.size} active TTS readers`)
    
    // Stop all registered readers
    this.activeReaders.forEach(stopFn => {
      try {
        stopFn()
      } catch (error) {
        console.warn('Error stopping TTS reader:', error)
      }
    })
    this.activeReaders.clear()
    
    // Aggressive cleanup - stop all browser TTS regardless of registration
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
        // console.log('Forced browser TTS cancellation')
      }
    } catch (error) {
      console.warn('Error forcing browser TTS stop:', error)
    }
    
    // Stop all HTML audio elements
    try {
      const audioElements = document.querySelectorAll('audio')
      audioElements.forEach(audio => {
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = 0
          // console.log('Stopped orphaned audio element')
        }
      })
    } catch (error) {
      console.warn('Error stopping audio elements:', error)
    }
  }

  getActiveReadersCount(): number {
    return this.activeReaders.size
  }
}

export const useTTSManager = () => {
  const manager = TTSManager.getInstance()
  
  return {
    registerReader: manager.registerReader.bind(manager),
    stopAllReaders: manager.stopAllReaders.bind(manager),
    getActiveReadersCount: manager.getActiveReadersCount.bind(manager)
  }
}
