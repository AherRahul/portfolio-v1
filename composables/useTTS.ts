interface TTSVoice {
  name?: string
  languageCode?: string
  ssmlGender?: string
  naturalSampleRateHertz?: number
  displayName?: string
}

interface TTSResponse {
  success: boolean
  audio?: string
  contentType?: string
  error?: string
}

interface VoicesResponse {
  success: boolean
  voices: {
    hindi: TTSVoice[]
    english: TTSVoice[]
    others: TTSVoice[]
    all: TTSVoice[]
  }
  recommended: {
    hindi?: TTSVoice
    english?: TTSVoice
  }
  error?: string
}

export const useTTS = () => {
  const isGoogleTTSAvailable = ref(false)
  const googleVoices = ref<TTSVoice[]>([])
  const audioCache = new Map<string, string>()

  // Check if Google Cloud TTS is available
  const checkGoogleTTSAvailability = async () => {
    try {
      // console.log('🔍 Checking Google TTS availability...')
      const response = await $fetch<VoicesResponse>('/api/tts/voices')
      // console.log('📡 Google TTS API Response:', { success: response.success, voiceCount: response.voices?.all?.length })
      
      isGoogleTTSAvailable.value = response.success
      if (response.success) {
        googleVoices.value = response.voices.all
        // console.log('✅ Google TTS is available with', response.voices.all.length, 'voices')
        // console.log('🎯 Recommended voices:', response.recommended)
      } else {
        console.warn('❌ Google TTS API returned success=false:', response.error)
      }
      return response.success
    } catch (error) {
      console.warn('❌ Google TTS not available:', error)
      isGoogleTTSAvailable.value = false
      return false
    }
  }

  // Generate cache key for audio
  const getCacheKey = (text: string, voice: string, rate: number) => {
    return `${voice}-${rate}-${btoa(text).slice(0, 20)}`
  }

  // Synthesize speech using Google Cloud TTS
  const synthesizeWithGoogle = async (
    text: string, 
    voice: string = 'hi-IN-Wavenet-A',
    rate: number = 1.0
  ): Promise<string | null> => {
    try {
      const cacheKey = getCacheKey(text, voice, rate)
      
      // Check cache first
      if (audioCache.has(cacheKey)) {
        return audioCache.get(cacheKey)!
      }

      const response = await $fetch<TTSResponse>('/api/tts/synthesize', {
        method: 'POST',
        body: {
          text,
          voice,
          languageCode: voice.split('-').slice(0, 2).join('-'),
          ssmlGender: voice.includes('Wavenet-A') || voice.includes('Wavenet-C') ? 'FEMALE' : 'MALE'
        }
      })

      if (response.success && response.audio) {
        const audioUrl = `data:${response.contentType};base64,${response.audio}`
        
        // Cache the result
        audioCache.set(cacheKey, audioUrl)
        
        return audioUrl
      }

      return null
    } catch (error) {
      console.error('Google TTS synthesis failed:', error)
      return null
    }
  }

  // Note: Audio playback is now handled directly in ContentReader for better control

  // Get recommended voice based on content language
  const getRecommendedVoice = async (text: string): Promise<string> => {
    // Simple language detection based on script
    const hasDevanagari = /[\u0900-\u097F]/.test(text)
    const hasHindiWords = /(है|का|के|में|और|यह|वह|से|को|पर|तक|लिए|साथ|बाद|पहले|अब|यहाँ|वहाँ)/i.test(text)
    
    if (hasDevanagari || hasHindiWords) {
      return 'hi-IN-Wavenet-A' // Female Hindi voice
    }
    
    return 'en-US-Wavenet-F' // Female English voice
  }

  // Clear audio cache
  const clearCache = () => {
    audioCache.clear()
  }

  return {
    isGoogleTTSAvailable: readonly(isGoogleTTSAvailable),
    googleVoices: readonly(googleVoices),
    checkGoogleTTSAvailability,
    synthesizeWithGoogle,
    getRecommendedVoice,
    clearCache
  }
}
