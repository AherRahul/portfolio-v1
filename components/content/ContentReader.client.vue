<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

const props = defineProps<{ docClass?: string; prepend?: string; contentSelector?: string }>()

const contentRoot = ref<HTMLElement | null>(null)
const isSupported = ref<boolean>(false)
const isPlaying = ref<boolean>(false)
const isPaused = ref<boolean>(false)
const rate = ref<number>(1)
const rateOptions = [0.75, 1, 1.25, 1.5, 1.75, 2]
const selectedRate = ref<string>('1')
const voices = ref<SpeechSynthesisVoice[]>([])
const selectedVoice = ref<string>('')
const isContentReady = ref<boolean>(false)

// Enhanced features
const currentSentence = ref<number>(0)
const progress = ref<number>(0)
const estimatedTime = ref<string>('0:00')
const remainingTime = ref<string>('0:00')
const isHighlighting = ref<boolean>(true)
const autoScroll = ref<boolean>(true)
const currentWordIndex = ref<number>(0)
const highlightedElements: HTMLElement[] = []
const wordMap = ref<Array<{ element: HTMLElement; globalIndex: number; text: string }>>([])
const globalCharIndex = ref<number>(0)

let sentences: string[] = []
let currentIndex = 0
let isInitializing = false
let mutationObserver: MutationObserver | null = null
let refreshTimer: number | null = null
let utterance: SpeechSynthesisUtterance | null = null
let isCleaningUp = false

// Event handlers for cleanup (defined at module level for proper cleanup)
const handlePageUnload = (event: Event) => {
  stopAllPlayback()
}

const handleVisibilityChange = () => {
  if (document.hidden && isPlaying.value) {
    stopAllPlayback()
  }
}

// Progress tracking
const progressPercentage = computed(() => {
  if (!sentences.length) return 0
  return Math.round((currentSentence.value / sentences.length) * 100)
})

// Word count and time estimation
const wordCount = computed(() => {
  return sentences.join(' ').split(/\s+/).length
})

const averageWPM = computed(() => {
  const baseWPM = 150
  return Math.round(baseWPM * rate.value)
})

function collectTextFromContent(el: HTMLElement | null): string {
  if (!el) return ''
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('pre, code, nav, aside, figure, figcaption, .sr-only').forEach(n => n.remove())
  const text = clone.innerText || ''
  return text.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim()
}

function splitIntoSentences(text: string): string[] {
  if (!text) return []
  const parts = text
    .split(/(?<=[.!?])\s+(?=[A-Z])|(?<=\n\n)/)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => s.length > 10)
  return parts
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function updateTimeEstimates() {
  if (!sentences.length) {
    estimatedTime.value = '0:00'
    remainingTime.value = '0:00'
    return
  }
  
  const totalWords = wordCount.value
  const wordsPerMinute = averageWPM.value
  const totalMinutes = totalWords / wordsPerMinute
  
  estimatedTime.value = formatTime(totalMinutes * 60)
  
  const remainingWords = sentences.slice(currentSentence.value).join(' ').split(/\s+/).length
  const remainingMinutes = remainingWords / wordsPerMinute
  remainingTime.value = formatTime(remainingMinutes * 60)
}

function loadVoices() {
  try {
    voices.value = window.speechSynthesis.getVoices()
    if (!selectedVoice.value && voices.value.length) {
      const byName = (predicate: (name: string) => boolean) => voices.value.find(v => predicate(v.name))
      const byLang = (regex: RegExp) => voices.value.find(v => regex.test(v.lang))
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isIOS) {
        const iosHindi = byName(name => /lekha|kanya/i.test(name))
          || byLang(/^hi[-_]IN$/i)
          || byName(name => /(hindi|हिन्दी)/i.test(name))
        
        const iosEnglish = byName(name => /samantha|alex|victoria|karen|daniel/i.test(name))
          || byLang(/^en[-_]US$/i)
          || byLang(/^en[-_]GB$/i)
        
        selectedVoice.value = (iosHindi || iosEnglish || voices.value[0])?.name || ''
      }
      else if (isMobile && /Android/i.test(navigator.userAgent)) {
        const androidHindi = byName(name => /google/i.test(name) && /(hindi|हिन्दी)/i.test(name))
          || byLang(/^hi[-_]IN$/i)
          || byName(name => /(hindi|हिन्दी)/i.test(name))
        
        const androidEnglish = byName(name => /google/i.test(name) && /english/i.test(name))
          || byLang(/^en[-_]US$/i)
          || byLang(/^en[-_]GB$/i)
        
        selectedVoice.value = (androidHindi || androidEnglish || voices.value[0])?.name || ''
      }
      else {
        const googleHindi = byName(name => /google/i.test(name) && /(हिन्दी|hindi)/i.test(name))
          || byLang(/^hi[-_]IN$/i)
        const anyHindi = googleHindi
          || byName(name => /(हिन्दी|hindi)/i.test(name))
          || byLang(/^hi([-_].*)?$/i)
        const enVoice = byLang(/^en([-_].*)?$/i)

        selectedVoice.value = (anyHindi || enVoice || voices.value[0])?.name || ''
      }

      if (isMobile) {
        console.log('Available voices on mobile:', voices.value.map(v => ({
          name: v.name,
          lang: v.lang,
          localService: v.localService,
          default: v.default
        })))
      }
    }
  } catch (e) {
    console.warn('Voice loading failed:', e)
  }
}

function getTargetElement(): HTMLElement | null {
  if (props.contentSelector) {
    try { return document.querySelector(props.contentSelector) as HTMLElement } catch { return null }
  }
  return contentRoot.value as HTMLElement
}

function refreshContentSentences() {
  const bodyText = collectTextFromContent(getTargetElement())
  const joined = [props.prepend || '', bodyText].filter(Boolean).join('\n\n')
  sentences = splitIntoSentences(joined)
  isContentReady.value = sentences.length > 0
  updateTimeEstimates()
}

function clearHighlights() {
  highlightedElements.forEach(el => {
    el.classList.remove('reading-word-highlight', 'reading-word-read')
    el.style.backgroundColor = ''
    el.style.color = ''
  })
  highlightedElements.length = 0
  wordMap.value = []
  globalCharIndex.value = 0
}

function stopAllPlayback() {
  if (isCleaningUp) return
  isCleaningUp = true
  
  try {
    // Stop browser TTS aggressively
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause()
        window.speechSynthesis.cancel()
      }
    }
    
    // Clear utterance reference and its events
    if (utterance) {
      utterance.onend = null
      utterance.onerror = null
      utterance.onboundary = null
      utterance = null
    }
    
    // Reset all state immediately
    isPlaying.value = false
    isPaused.value = false
    progress.value = 0
    currentSentence.value = 0
    currentIndex = 0
    
    // Clear highlights
    clearHighlights()
  } catch (error) {
    console.warn('Error during TTS cleanup:', error)
  } finally {
    isCleaningUp = false
  }
}

function prepareTextForHighlighting() {
  if (!isHighlighting.value || !props.contentSelector) return
  
  try {
    const target = getTargetElement()
    if (!target) return
    
    clearHighlights()
    
    const completeText = sentences.join(' ')
    let globalCharPosition = 0
    
    const walker = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT
          if (['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT
          if (parent.classList.contains('reading-word')) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        }
      }
    )
    
    const textNodes: Text[] = []
    let node
    while (node = walker.nextNode()) {
      if (node.textContent?.trim()) {
        textNodes.push(node as Text)
      }
    }
    
    textNodes.forEach(textNode => {
      const text = textNode.textContent || ''
      const words = text.split(/(\s+)/)
      
      if (words.length > 1) {
        const fragment = document.createDocumentFragment()
        
        words.forEach(word => {
          if (word.trim()) {
            const span = document.createElement('span')
            span.className = 'reading-word'
            span.textContent = word
            span.style.transition = 'all 0.2s ease'
            fragment.appendChild(span)
            
            const wordInCompleteText = completeText.toLowerCase().indexOf(word.toLowerCase(), globalCharPosition)
            if (wordInCompleteText !== -1) {
              wordMap.value.push({
                element: span,
                globalIndex: wordInCompleteText,
                text: word
              })
              globalCharPosition = wordInCompleteText + word.length
            }
            
            highlightedElements.push(span)
          } else {
            fragment.appendChild(document.createTextNode(word))
          }
        })
        
        textNode.parentNode?.replaceChild(fragment, textNode)
      }
    })
    
    wordMap.value.sort((a, b) => a.globalIndex - b.globalIndex)
  } catch (e) {
    console.warn('Text preparation failed:', e)
  }
}

function highlightWordByWord(sentenceIndex: number, charIndexInSentence: number) {
  if (!isHighlighting.value || !wordMap.value.length) return
  
  try {
    let globalCharPosition = 0
    
    for (let i = 0; i < sentenceIndex; i++) {
      globalCharPosition += sentences[i].length + 1
    }
    
    globalCharPosition += charIndexInSentence
    
    let targetWordIndex = -1
    for (let i = 0; i < wordMap.value.length; i++) {
      const wordData = wordMap.value[i]
      const wordEnd = wordData.globalIndex + wordData.text.length
      
      if (globalCharPosition >= wordData.globalIndex && globalCharPosition < wordEnd) {
        targetWordIndex = i
        break
      }
    }
    
    if (targetWordIndex >= 0) {
      wordMap.value.forEach((wordData, index) => {
        const el = wordData.element
        el.classList.remove('reading-word-highlight', 'reading-word-read')
        el.style.backgroundColor = ''
        el.style.color = ''
        
        if (index < targetWordIndex) {
          el.classList.add('reading-word-read')
          el.style.backgroundColor = 'rgba(34, 197, 94, 0.1)'
          el.style.color = 'rgb(134, 239, 172)'
        } else if (index === targetWordIndex) {
          el.classList.add('reading-word-highlight')
          el.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'
          el.style.color = 'rgb(254, 226, 226)'
          
          if (autoScroll.value) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
          }
        }
      })
      
      currentWordIndex.value = targetWordIndex
    }
  } catch (e) {
    console.warn('Word highlighting failed:', e)
  }
}

function buildAndSpeak(fromIndex = 0) {
  if (typeof window === 'undefined') return
  const synth = window.speechSynthesis
  if (!synth) return

  synth.cancel()

  currentIndex = fromIndex
  currentSentence.value = fromIndex
  
  if (!sentences.length) {
    isPlaying.value = false
    isPaused.value = false
    return
  }

  const speakNext = () => {
    if (currentIndex >= sentences.length) {
      isPlaying.value = false
      isPaused.value = false
      currentSentence.value = 0
      progress.value = 100
      clearHighlights()
      return
    }
    
    currentSentence.value = currentIndex
    progress.value = (currentIndex / sentences.length) * 100
    updateTimeEstimates()
    
    utterance = new SpeechSynthesisUtterance(sentences[currentIndex])
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    utterance.rate = rate.value
    utterance.pitch = 1
    utterance.volume = 1
    
    const voice = voices.value.find(v => v.name === selectedVoice.value)
    if (voice) {
      utterance.voice = voice
      
      if (isIOS) {
        utterance.rate = Math.min(rate.value, 1.5)
        utterance.lang = voice.lang || (/(hindi|हिन्दी)/i.test(selectedVoice.value) ? 'hi-IN' : 'en-US')
      }
      else if (isMobile && /Android/i.test(navigator.userAgent)) {
        utterance.rate = rate.value
        utterance.lang = voice.lang || 'en-US'
      }
    } else if (isMobile) {
      utterance.lang = 'en-US'
    }
    
    utterance.onend = () => {
      currentIndex += 1
      if (isMobile) {
        setTimeout(() => speakNext(), 50)
      } else {
        speakNext()
      }
    }
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      
      if (isMobile) {
        setTimeout(() => {
          loadVoices()
          currentIndex += 1
          speakNext()
        }, 1000)
      } else {
        currentIndex += 1
        speakNext()
      }
    }
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const wordProgress = (event.charIndex / sentences[currentIndex].length) * (1 / sentences.length) * 100
        progress.value = ((currentIndex / sentences.length) * 100) + wordProgress
        
        highlightWordByWord(currentIndex, event.charIndex)
      }
    }
    
    if (isIOS && synth.paused) {
      synth.resume()
    }
    
    synth.speak(utterance)
  }

  isPlaying.value = true
  isPaused.value = false
  speakNext()
}

function playPause() {
  if (!isSupported.value) return
  const synth = window.speechSynthesis
  
  if (!sentences.length) {
    refreshContentSentences()
  }
  if (!sentences.length) {
    setTimeout(() => {
      refreshContentSentences()
      if (!isPlaying.value && sentences.length) {
        prepareTextForHighlighting()
        buildAndSpeak(0)
      }
    }, 100)
    return
  }
  
  if (isPaused.value) {
    synth.resume()
    isPaused.value = false
    isPlaying.value = true
    return
  }
  if (isPlaying.value) {
    synth.pause()
    isPaused.value = true
    return
  }
  
  prepareTextForHighlighting()
  buildAndSpeak(currentSentence.value)
}

function resetReading() {
  if (!isSupported.value) return
  stopAllPlayback()
  updateTimeEstimates()
}

function skipToSentence(index: number) {
  if (index >= 0 && index < sentences.length) {
    currentSentence.value = index
    if (isPlaying.value) {
      buildAndSpeak(index)
    }
  }
}

function skipForward() {
  skipToSentence(Math.min(currentSentence.value + 5, sentences.length - 1))
}

function skipBackward() {
  skipToSentence(Math.max(currentSentence.value - 5, 0))
}

function onRateSelect(e: Event) {
  const val = Number((e.target as HTMLSelectElement).value)
  selectedRate.value = String(val)
  rate.value = Math.min(2, Math.max(0.5, val || 1))
  updateTimeEstimates()
  if (isPlaying.value && !isPaused.value) buildAndSpeak(currentIndex)
}

function getRateLabel(r: number): string {
  if (r === 1) return 'Normal'
  if (r < 1) return 'Slow'
  if (r >= 2) return 'Max'
  return 'Fast'
}

function onVoiceChange(e: Event) {
  selectedVoice.value = (e.target as HTMLSelectElement).value
  if (isPlaying.value && !isPaused.value) {
    buildAndSpeak(currentIndex)
  }
}

// Keyboard shortcuts
function onKeydown(e: KeyboardEvent) {
  const activeElement = document.activeElement
  if (activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) return
  
  switch (e.key) {
    case ' ':
      e.preventDefault()
      playPause()
      break
    case 'Escape':
      e.preventDefault()
      resetReading()
      break
    case 'ArrowRight':
      e.preventDefault()
      skipForward()
      break
    case 'ArrowLeft':
      e.preventDefault()
      skipBackward()
      break
  }
}

onMounted(async () => {
  isSupported.value = typeof window !== 'undefined' && 'speechSynthesis' in window
  if (!isSupported.value) return

  loadVoices()
  try { window.speechSynthesis.onvoiceschanged = loadVoices } catch {}

  isInitializing = true
  setTimeout(() => {
    refreshContentSentences()
    isInitializing = false
  }, 0)
  selectedRate.value = String(rate.value)

  window.addEventListener('keydown', onKeydown)
  
  window.addEventListener('beforeunload', handlePageUnload, { capture: true })
  window.addEventListener('unload', handlePageUnload, { capture: true })
  window.addEventListener('pagehide', handlePageUnload, { capture: true })
  window.addEventListener('blur', handlePageUnload, { capture: true })
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  window.addEventListener('popstate', handlePageUnload)
  window.addEventListener('hashchange', handlePageUnload)

  try {
    mutationObserver = new MutationObserver(() => {
      if (refreshTimer) window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => {
        refreshContentSentences()
      }, 100)
    })
    const target = getTargetElement()
    if (target) {
      mutationObserver.observe(target, {
        childList: true,
        subtree: true,
        characterData: true
      })
    }
  } catch {}
})

onBeforeUnmount(() => {
  stopAllPlayback()
  
  try { window.speechSynthesis.onvoiceschanged = null as any } catch {}
  try { window.removeEventListener('keydown', onKeydown) } catch {}
  try { window.removeEventListener('beforeunload', handlePageUnload) } catch {}
  try { window.removeEventListener('unload', handlePageUnload) } catch {}
  try { window.removeEventListener('pagehide', handlePageUnload) } catch {}
  try { window.removeEventListener('blur', handlePageUnload) } catch {}
  try { window.removeEventListener('popstate', handlePageUnload) } catch {}
  try { window.removeEventListener('hashchange', handlePageUnload) } catch {}
  try { document.removeEventListener('visibilitychange', handleVisibilityChange) } catch {}
  
  try { mutationObserver?.disconnect() } catch {}
  try { if (refreshTimer) window.clearTimeout(refreshTimer) } catch {}
})

watch(() => contentRoot.value, (el) => {
  if (isPlaying.value) {
    stopAllPlayback()
  }
  
  if (!el && !props.contentSelector) return
  refreshContentSentences()
}, { flush: 'post' })

if (process.client) {
  const route = useRoute()
  
  watch(() => route.path, (newPath, oldPath) => {
    if (oldPath && newPath !== oldPath) {
      stopAllPlayback()
    }
  }, { immediate: false })
}
</script>

<template>
  <div class="w-full">
   
    <!-- Content Wrapper (only when not using external selector) -->
    <div v-if="!props.contentSelector" ref="contentRoot">
      <ContentDoc :class="props.docClass" />
    </div>
    
    <!-- Hidden ref for external content targeting -->
    <div v-else ref="contentRoot" style="display: none;"></div>
  </div>
  
</template>