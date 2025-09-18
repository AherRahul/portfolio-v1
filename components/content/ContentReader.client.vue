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
const isOpen = ref<boolean>(false)

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
  // Average speaking rate varies by speed
  const baseWPM = 150
  return Math.round(baseWPM * rate.value)
})

function collectTextFromContent(el: HTMLElement | null): string {
  if (!el) return ''
  // Prefer readable text content; ignore nav/control elements
  const clone = el.cloneNode(true) as HTMLElement
  // Remove code blocks to avoid noisy reading
  clone.querySelectorAll('pre, code, nav, aside, figure, figcaption, .sr-only').forEach(n => n.remove())
  const text = clone.innerText || ''
  return text.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim()
}

function splitIntoSentences(text: string): string[] {
  if (!text) return []
  // Improved sentence splitting with better punctuation handling
  const parts = text
    .split(/(?<=[.!?])\s+(?=[A-Z])|(?<=\n\n)/)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => s.length > 10) // Filter out very short fragments
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
      // Prefer Google Hindi if available, then any Hindi voice, then English
      const byName = (predicate: (name: string) => boolean) => voices.value.find(v => predicate(v.name))
      const byLang = (regex: RegExp) => voices.value.find(v => regex.test(v.lang))

      const googleHindi = byName(name => /google/i.test(name) && /(हिन्दी|hindi)/i.test(name))
        || byLang(/^(hi([-_][A-Z]{2})?)$/i)
        || byLang(/^hi[-_]IN$/i)
      const anyHindi = googleHindi
        || byName(name => /(हिन्दी|hindi)/i.test(name))
        || byLang(/^hi([-_].*)?$/i)

      const enVoice = byLang(/^en([-_].*)?$/i)

      selectedVoice.value = (anyHindi || enVoice || voices.value[0])?.name || ''
    }
  } catch {}
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

function prepareTextForHighlighting() {
  if (!isHighlighting.value || !props.contentSelector) return
  
  try {
    const target = getTargetElement()
    if (!target) return
    
    // Clear any existing highlights
    clearHighlights()
    
    // Build a complete text mapping that matches our speech synthesis input
    const completeText = sentences.join(' ')
    let globalCharPosition = 0
    
    // Wrap each word in a span for individual highlighting
    const walker = document.createTreeWalker(
      target,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script, style, and already processed nodes
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
            
            // Map this word to its position in the complete speech text
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
    
    // Sort word map by global index to ensure proper order
    wordMap.value.sort((a, b) => a.globalIndex - b.globalIndex)
  } catch (e) {
    console.warn('Text preparation failed:', e)
  }
}

function highlightWordByWord(sentenceIndex: number, charIndexInSentence: number) {
  if (!isHighlighting.value || !wordMap.value.length) return
  
  try {
    // Calculate the global character position across all sentences
    let globalCharPosition = 0
    
    // Add character counts from previous sentences
    for (let i = 0; i < sentenceIndex; i++) {
      globalCharPosition += sentences[i].length + 1 // +1 for space between sentences
    }
    
    // Add current position within the current sentence
    globalCharPosition += charIndexInSentence
    
    // Find the word that corresponds to this global position
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
      // Clear all highlights first
      wordMap.value.forEach((wordData, index) => {
        const el = wordData.element
        el.classList.remove('reading-word-highlight', 'reading-word-read')
        el.style.backgroundColor = ''
        el.style.color = ''
        
        if (index < targetWordIndex) {
          // Mark as read
          el.classList.add('reading-word-read')
          el.style.backgroundColor = 'rgba(34, 197, 94, 0.1)' // green tint
          el.style.color = 'rgb(134, 239, 172)' // light green text
        } else if (index === targetWordIndex) {
          // Current word
          el.classList.add('reading-word-highlight')
          el.style.backgroundColor = 'rgba(239, 68, 68, 0.3)' // red highlight
          el.style.color = 'rgb(254, 226, 226)' // light red text
          
          // Auto-scroll to current word
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

  // Cancel any current speech before starting fresh
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
    utterance.rate = rate.value
    const voice = voices.value.find(v => v.name === selectedVoice.value)
    if (voice) utterance.voice = voice
    
    utterance.onend = () => {
      currentIndex += 1
      speakNext()
    }
    utterance.onerror = () => {
      // Skip problematic segment
      currentIndex += 1
      speakNext()
    }
    utterance.onboundary = (event) => {
      // Real-time word highlighting and progress
      if (event.name === 'word') {
        const wordProgress = (event.charIndex / sentences[currentIndex].length) * (1 / sentences.length) * 100
        progress.value = ((currentIndex / sentences.length) * 100) + wordProgress
        
        // Highlight current word being spoken with proper sentence tracking
        highlightWordByWord(currentIndex, event.charIndex)
      }
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
  
  // Ensure we have content before starting
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
  
  // Prepare text for word-by-word highlighting
  prepareTextForHighlighting()
  
  // Start reading from current position or beginning
  buildAndSpeak(currentSentence.value)
}

function resetReading() {
  if (!isSupported.value) return
  try { 
    window.speechSynthesis.cancel() 
    utterance = null
  } catch {}
  isPlaying.value = false
  isPaused.value = false
  currentSentence.value = 0
  progress.value = 0
  currentWordIndex.value = 0
  clearHighlights()
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
  if (!isOpen.value) return
  
  // Only handle if reader is focused or no other input is focused
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

onMounted(() => {
  isSupported.value = typeof window !== 'undefined' && 'speechSynthesis' in window
  if (!isSupported.value) return

  // Load voices
  loadVoices()
  try { window.speechSynthesis.onvoiceschanged = loadVoices } catch {}

  // Initialize content
  isInitializing = true
  setTimeout(() => {
    refreshContentSentences()
    isInitializing = false
  }, 0)
  selectedRate.value = String(rate.value)

  // Keyboard shortcuts
  window.addEventListener('keydown', onKeydown)

  // Observe content changes
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
  try { window.speechSynthesis.onvoiceschanged = null as any } catch {}
  window.removeEventListener('keydown', onKeydown)
  resetReading()
  try { mutationObserver?.disconnect() } catch {}
})

watch(() => contentRoot.value, (el) => {
  if (!el && !props.contentSelector) return
  refreshContentSentences()
}, { flush: 'post' })
</script>

<template>
  <div class="w-full">
    <!-- Compact Trigger Bar -->
    <div class="flex items-center justify-between p-3 sm:p-2 mb-2 border border-red-500/30 bg-zinc-900/70 rounded-lg sm:rounded-sm">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <Icon name="heroicons:speaker-wave" class="text-red-400 text-base sm:text-sm flex-shrink-0" />
        <span class="text-sm sm:text-xs text-zinc-300 font-medium">Content Reader</span>
        <span class="text-xs sm:text-[10px] text-zinc-500 truncate">
          {{ isPlaying ? (isPaused ? 'Paused' : `Reading ${progressPercentage}%`) : (isContentReady ? `${wordCount} words • ${estimatedTime}` : 'Loading') }}
        </span>
      </div>
      <button
        class="px-3 py-2 sm:px-2 sm:py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm sm:text-xs disabled:opacity-50 rounded-md sm:rounded-sm flex-shrink-0 min-w-[60px] sm:min-w-0"
        :disabled="!isSupported"
        @click="isOpen = !isOpen"
        :aria-expanded="isOpen"
        aria-controls="reader-controls"
      >
        <Icon :name="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="mr-1" />
        <span class="sm:hidden">{{ isOpen ? 'Hide' : 'Read' }}</span>
        <span class="hidden sm:inline">{{ isOpen ? 'Hide' : 'Read' }}</span>
      </button>
    </div>

    <!-- Enhanced Reader Controls -->
    <Transition name="slide-y">
    <div v-show="isOpen" id="reader-controls" class="border border-zinc-800 bg-zinc-900 rounded-lg sm:rounded-sm mb-2">
      <!-- Progress Bar -->
      <div v-if="isContentReady" class="px-3 sm:px-2 py-2 sm:py-1 border-b border-zinc-800">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-zinc-400 mb-2 sm:mb-1">
          <span class="text-sm sm:text-xs font-medium">{{ currentSentence + 1 }} / {{ sentences.length }} sentences</span>
          <span class="text-xs sm:text-xs">{{ remainingTime }} remaining</span>
        </div>
        <div class="w-full bg-zinc-800 h-2 sm:h-1 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-red-500 to-pink-600 transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Main Controls -->
      <div class="flex flex-col gap-3 p-3 sm:p-2">
        <!-- Mobile: Playback Controls (Full Width) -->
        <div class="flex sm:hidden items-center gap-2 w-full">
          <button
            class="px-3 py-3 bg-zinc-700 text-white text-sm border border-zinc-600 disabled:opacity-50 rounded-lg min-w-[48px]"
            :disabled="!isSupported || currentSentence <= 0"
            @click="skipBackward"
            aria-label="Skip backward 5 sentences"
          >
            <Icon name="heroicons:backward" class="mx-auto" />
          </button>
          <button
            class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm disabled:opacity-50 rounded-lg font-medium"
            :disabled="!isSupported"
            @click="playPause"
            aria-label="Play or pause content reading"
          >
            <div class="flex items-center justify-center gap-2">
              <Icon :name="isPlaying && !isPaused ? 'heroicons:pause' : 'heroicons:play'" />
              <span>{{ isPlaying && !isPaused ? 'Pause' : 'Play' }}</span>
            </div>
          </button>
          <button
            class="px-3 py-3 bg-zinc-700 text-white text-sm border border-zinc-600 disabled:opacity-50 rounded-lg min-w-[48px]"
            :disabled="!isSupported || currentSentence >= sentences.length - 1"
            @click="skipForward"
            aria-label="Skip forward 5 sentences"
          >
            <Icon name="heroicons:forward" class="mx-auto" />
          </button>
          <button
            class="px-3 py-3 bg-zinc-700 text-white text-sm border border-zinc-600 disabled:opacity-50 rounded-lg min-w-[48px]"
            :disabled="!isSupported"
            @click="resetReading"
            aria-label="Reset to beginning"
          >
            <Icon name="heroicons:arrow-path" class="mx-auto" />
          </button>
        </div>

        <!-- Desktop: Compact Playback Controls -->
        <div class="hidden sm:flex items-center gap-1">
          <button
            class="px-2 py-1 bg-zinc-700 text-white text-xs border border-zinc-600 disabled:opacity-50"
            :disabled="!isSupported || currentSentence <= 0"
            @click="skipBackward"
            aria-label="Skip backward 5 sentences"
            title="Skip backward (←)"
          >
            <Icon name="heroicons:backward" />
          </button>
          <button
            class="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs disabled:opacity-50"
            :disabled="!isSupported"
            @click="playPause"
            aria-label="Play or pause content reading"
            title="Play/Pause (Space)"
          >
            <Icon :name="isPlaying && !isPaused ? 'heroicons:pause' : 'heroicons:play'" class="mr-1" />
            <span>{{ isPlaying && !isPaused ? 'Pause' : 'Play' }}</span>
          </button>
          <button
            class="px-2 py-1 bg-zinc-700 text-white text-xs border border-zinc-600 disabled:opacity-50"
            :disabled="!isSupported || currentSentence >= sentences.length - 1"
            @click="skipForward"
            aria-label="Skip forward 5 sentences"
            title="Skip forward (→)"
          >
            <Icon name="heroicons:forward" />
          </button>
          <button
            class="px-2 py-1 bg-zinc-700 text-white text-xs border border-zinc-600 disabled:opacity-50"
            :disabled="!isSupported"
            @click="resetReading"
            aria-label="Reset to beginning"
            title="Reset (Esc)"
          >
            <Icon name="heroicons:arrow-path" />
          </button>
        </div>

        <!-- Mobile: Controls Row -->
        <div class="flex sm:hidden flex-col gap-3">
          <!-- Speed & Voice Row -->
          <div class="grid grid-cols-1 gap-3">
            <div class="flex items-center gap-3">
              <label class="text-xs font-medium text-zinc-400 min-w-[50px]">Speed</label>
              <select
                class="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm px-3 py-2 rounded-lg flex-1"
                :value="selectedRate"
                @change="onRateSelect"
                aria-label="Reading speed"
              >
                <option v-for="r in rateOptions" :key="r" :value="r">
                  {{ r.toFixed(2).replace(/0+$/,'').replace(/\.$/,'') }}× • {{ getRateLabel(r) }}
                </option>
              </select>
            </div>
            
            <div v-if="voices.length" class="flex items-center gap-3">
              <label class="text-xs font-medium text-zinc-400 min-w-[50px]">Voice</label>
              <select
                class="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm px-3 py-2 rounded-lg flex-1 min-w-0"
                :value="selectedVoice"
                @change="onVoiceChange"
                aria-label="Select reading voice"
              >
                <option v-for="v in voices" :key="v.name" :value="v.name">
                  {{ v.name.split(' ')[0] }}
                </option>
              </select>
            </div>
          </div>

          <!-- Settings Row -->
          <div class="flex items-center justify-center gap-6">
            <label class="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                v-model="isHighlighting"
                class="w-4 h-4 text-red-500 bg-zinc-900 border-zinc-700 rounded focus:ring-red-500"
              />
              <span>Highlight Words</span>
            </label>
            <label class="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                v-model="autoScroll"
                class="w-4 h-4 text-red-500 bg-zinc-900 border-zinc-700 rounded focus:ring-red-500"
              />
              <span>Auto Scroll</span>
            </label>
          </div>
        </div>

        <!-- Desktop: Compact Controls Row -->
        <div class="hidden sm:flex items-center gap-2">
          <!-- Speed Control -->
          <div class="flex items-center gap-2">
            <label class="text-[10px] uppercase tracking-wide text-zinc-400">Speed</label>
            <select
              class="bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs px-2 py-1"
              :value="selectedRate"
              @change="onRateSelect"
              aria-label="Reading speed"
            >
              <option v-for="r in rateOptions" :key="r" :value="r">
                {{ r.toFixed(2).replace(/0+$/,'').replace(/\.$/,'') }}× • {{ getRateLabel(r) }}
              </option>
            </select>
          </div>

          <!-- Voice Control -->
          <div v-if="voices.length" class="flex items-center gap-2 min-w-[140px]">
            <label class="text-[10px] uppercase tracking-wide text-zinc-400">Voice</label>
            <select
              class="bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs px-2 py-1 w-full"
              :value="selectedVoice"
              @change="onVoiceChange"
              aria-label="Select reading voice"
            >
              <option v-for="v in voices" :key="v.name" :value="v.name">
                {{ v.name.split(' ')[0] }} ({{ v.lang }})
              </option>
            </select>
          </div>

          <!-- Settings -->
          <div class="flex items-center gap-2 ml-auto">
            <label class="flex items-center gap-1 text-xs text-zinc-400">
              <input
                type="checkbox"
                v-model="isHighlighting"
                class="w-3 h-3 text-red-500 bg-zinc-900 border-zinc-700 rounded focus:ring-red-500"
              />
              <span>Highlight</span>
            </label>
            <label class="flex items-center gap-1 text-xs text-zinc-400">
              <input
                type="checkbox"
                v-model="autoScroll"
                class="w-3 h-3 text-red-500 bg-zinc-900 border-zinc-700 rounded focus:ring-red-500"
              />
              <span>Scroll</span>
            </label>
          </div>
        </div>

        <!-- Status -->
        <div v-if="!isSupported" class="text-sm sm:text-xs text-zinc-400 text-center sm:text-left">
          Text-to-speech not supported in this browser.
        </div>
      </div>

      <!-- Keyboard Shortcuts Help -->
      <div class="px-3 sm:px-2 py-2 sm:py-1 border-t border-zinc-800 text-xs sm:text-[10px] text-zinc-500 text-center sm:text-left">
        <span class="hidden md:inline">Shortcuts: Space (play/pause) • Esc (reset) • ← → (skip) • </span>
        <span class="block sm:inline">{{ wordCount }} words • {{ averageWPM }} WPM</span>
      </div>
    </div>
    </Transition>

    <!-- Content Wrapper (only when not using external selector) -->
    <div v-if="!props.contentSelector" ref="contentRoot">
      <ContentDoc :class="props.docClass" />
    </div>
    
    <!-- Hidden ref for external content targeting -->
    <div v-else ref="contentRoot" style="display: none;"></div>
  </div>
  
</template>