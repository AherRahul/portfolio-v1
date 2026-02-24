<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface TrieNode {
  char: string
  children: Record<string, TrieNode>
  isEnd: boolean
  frequency: number
  word?: string
}

const root = ref<TrieNode>({ char: '', children: {}, isEnd: false, frequency: 0 })
const searchInput = ref('')
const newWordInput = ref('')
const logs = ref<string[]>(['Trie index mounted.', 'Waiting for prefix input...'])
const dictionary = ref<{ word: string, freq: number }[]>([
  { word: 'apple', freq: 150 },
  { word: 'app', freq: 120 },
  { word: 'appendix', freq: 80 },
  { word: 'application', freq: 200 },
  { word: 'banana', freq: 90 },
  { word: 'ball', freq: 60 },
  { word: 'cat', freq: 110 },
  { word: 'camera', freq: 45 }
])

function insertWord(word: string, freq: number) {
  let curr = root.value
  for (const char of word) {
    if (!curr.children[char]) {
      curr.children[char] = { char, children: {}, isEnd: false, frequency: 0 }
    }
    curr = curr.children[char]
  }
  curr.isEnd = true
  curr.frequency = freq
  curr.word = word
}

function handleAddWord() {
  const word = newWordInput.value.trim().toLowerCase()
  if (!word) return
  
  const existing = dictionary.value.find(item => item.word === word)
  if (existing) {
    existing.freq += 10
    insertWord(word, existing.freq)
    logs.value.unshift(`UPDATE: Increased frequency for "${word.toUpperCase()}".`)
  } else {
    const newItem = { word, freq: 10 }
    dictionary.value.push(newItem)
    insertWord(word, 10)
    logs.value.unshift(`COMMIT: New node "${word.toUpperCase()}" indexed into shard.`)
  }
  newWordInput.value = ''
}

function resetTrie() {
  root.value = { char: '', children: {}, isEnd: false, frequency: 0 }
  dictionary.value = []
  searchInput.value = ''
  logs.value = ['Re-initializing Trie structure...', 'Memory buffers cleared.']
}

// Initial Build
onMounted(() => {
  dictionary.value.forEach(item => insertWord(item.word, item.freq))
  logs.value.unshift(`BOOT: ${dictionary.value.length} words detected in primary partition.`)
})

function getSuggestions(prefix: string): { word: string, freq: number }[] {
  if (!prefix) return []
  let curr = root.value
  for (const char of prefix) {
    if (!curr.children[char]) return []
    curr = curr.children[char]
  }
  
  const results: { word: string, freq: number }[] = []
  function dfs(node: TrieNode) {
    if (node.isEnd && node.word) results.push({ word: node.word, freq: node.frequency })
    for (const child in node.children) {
      dfs(node.children[child])
    }
  }
  dfs(curr)
  return results.sort((a, b) => b.freq - a.freq).slice(0, 5)
}

const suggestions = computed(() => getSuggestions(searchInput.value.toLowerCase()))

const systemStats = [
  { label: 'Trie Depth', value: '12 Levels', icon: 'heroicons:bars-3-bottom-left', color: 'text-blue-500' },
  { label: 'Search Latency', value: '4ms', icon: 'heroicons:bolt', color: 'text-amber-500' },
  { label: 'Hash Partition', value: 'Node_A12', icon: 'heroicons:cpu-chip', color: 'text-purple-500' },
  { label: 'Cache Hit Rate', value: '94%', icon: 'heroicons:shield-check', color: 'text-emerald-500' }
]

const insights = [
  { title: 'Trie Data Structure', desc: 'Allows O(L) search where L is line length, independent of dataset size.' },
  { title: 'Frequency Ranking', desc: 'Nodes store metadata for Top-K ranking, reducing computation at query time.' },
  { title: 'Prefix Sharding', desc: 'Real-world systems shard Tries by first 2 chars for horizontal scalability.' }
]

watch(searchInput, (val) => {
  if (val) logs.value.unshift(`QUERY: Searching prefix "${val.toUpperCase()}"... Found ${suggestions.value.length} matches.`)
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-full min-h-[850px] overflow-hidden">
    
    <!-- LEFT: SEARCH INTERFACE -->
    <div class="lg:col-span-12 xl:col-span-7 p-10 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden h-full">
       <!-- Local Header -->
       <div class="w-full flex items-center justify-between mb-8 shrink-0">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Icon name="heroicons:magnifying-glass" class="text-xl" />
             </div>
             <div>
                <h4 class="text-white font-black uppercase tracking-tighter text-sm">Design Search Autocomplete</h4>
                <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{{ dictionary.length }} words in dictionary</p>
             </div>
          </div>
          <div class="flex items-center gap-2">
             <div class="flex gap-2 mr-4">
                <input v-model="newWordInput" @keyup.enter="handleAddWord" placeholder="+ New word" class="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-black text-white focus:outline-none focus:border-emerald-500/50 uppercase w-24" />
                <button @click="handleAddWord" class="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg hover:bg-emerald-600/20 transition-all active:scale-95 border border-emerald-500/20">
                   <Icon name="heroicons:plus" class="text-xs" />
                </button>
             </div>
             <button @click="resetTrie" class="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-95">
                <Icon name="heroicons:arrow-path" class="text-lg" />
             </button>
          </div>
       </div>

       <!-- SEARCH BOX -->
       <div class="w-full max-w-[600px] mb-8 shrink-0">
          <div class="relative group">
             <Icon name="heroicons:magnifying-glass" class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" />
             <input 
               v-model="searchInput" 
               placeholder="Start typing to search..." 
               class="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-14 pr-8 py-5 text-sm font-black text-white focus:outline-none focus:border-emerald-500/50 uppercase tracking-[0.1em] placeholder:text-zinc-700 shadow-2xl transition-all"
             />
          </div>
       </div>

       <!-- DICTIONARY TAGS (From reference image) -->
       <div class="w-full max-w-[600px] mb-8 shrink-0">
          <h5 class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-3">Active Partition Dictionary</h5>
          <div class="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
             <div v-for="item in dictionary" :key="item.word" class="px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-[9px] font-black text-zinc-400 uppercase tracking-tighter hover:border-emerald-500/30 transition-all cursor-default">
                {{ item.word }}
                <span class="ml-1 opacity-30 text-[7px]">{{ item.freq }}</span>
             </div>
          </div>
       </div>

       <!-- VISUAL TRIE REPRESENTATION -->
       <div class="relative w-full max-w-[600px] bg-zinc-900/50 p-8 rounded-3xl border border-white/5 flex flex-col items-center flex-1 min-h-[300px] overflow-hidden">
          <h5 class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-6 w-full text-center shrink-0">Shard Match Results</h5>
          
          <div v-if="suggestions.length > 0" class="w-full space-y-3 overflow-y-auto custom-scrollbar pr-1">
             <transition-group name="list">
                <div v-for="item in suggestions" :key="item.word" 
                   class="flex items-center justify-between p-4 bg-zinc-800 border border-white/5 rounded-2xl group hover:bg-zinc-700 transition-all cursor-pointer">
                   <div class="flex items-center gap-4">
                      <div class="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-[10px] font-black text-emerald-500">
                         {{ item.word.charAt(0).toUpperCase() }}
                      </div>
                      <span class="text-xs font-black text-white uppercase tracking-wider">
                         <span class="text-emerald-500">{{ searchInput }}</span>{{ item.word.slice(searchInput.length) }}
                      </span>
                   </div>
                   <div class="flex items-center gap-3">
                      <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{{ item.freq }} ACCESSES</p>
                      <Icon name="heroicons:chevron-right" class="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                   </div>
                </div>
             </transition-group>
          </div>
          
          <div v-else-if="searchInput" class="flex-1 flex flex-col items-center justify-center text-center py-10">
             <Icon name="heroicons:square-3-stack-3d" class="text-4xl text-zinc-800 mb-4 animate-pulse" />
             <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Zero Node Matches in Current Shard</p>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-30">
             <Icon name="heroicons:command-line" class="text-4xl text-zinc-600 mb-4" />
             <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Scanner Initialized // Awaiting Input</p>
          </div>
       </div>

    </div>

    <!-- RIGHT: ANALYTICS -->
    <div class="lg:col-span-12 xl:col-span-5 flex flex-col border-l border-white/5 bg-zinc-900/40 p-8 space-y-6 overflow-y-auto custom-scrollbar h-full">
       
       <!-- HARDWARE STATS -->
       <div class="grid grid-cols-2 gap-3 shrink-0">
          <div v-for="stat in systemStats" :key="stat.label" class="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-3 transition-colors hover:border-white/10">
             <div class="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center border border-white/5">
                <Icon :name="stat.icon" :class="['text-xs', stat.color]" />
             </div>
             <div>
                <p class="text-[8px] font-black text-zinc-600 uppercase leading-none mb-1">{{ stat.label }}</p>
                <p class="text-[10px] font-black text-white tabular-nums">{{ stat.value }}</p>
             </div>
          </div>
       </div>

       <!-- LOGS -->
       <div class="flex-1 flex flex-col min-h-[300px] overflow-hidden">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[8px] mb-3 flex items-center justify-between shrink-0">
             Prefix Search Engine Log
             <p class="text-[7px] font-mono opacity-30">PID 8820 // SYNCED</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto custom-scrollbar text-zinc-500 pr-1">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span :class="log.includes('COMMIT') ? 'text-emerald-400' : 'text-zinc-400'">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHTS -->
       <div class="space-y-3 shrink-0">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 shadow-lg">
                <Icon name="heroicons:cpu-chip" class="text-emerald-500 text-sm" />
             </div>
             <div>
                <p class="text-[10px] font-black text-white uppercase tracking-tight mb-1">{{ ins.title }}</p>
                <p class="text-[8px] text-zinc-500 leading-tight font-bold uppercase">{{ ins.desc }}</p>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(10px); }
</style>
