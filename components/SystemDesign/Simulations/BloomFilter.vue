<script setup lang="ts">
import { ref, computed } from 'vue'

const BIT_ARRAY_SIZE = 16
const HASH_COUNT = 3

const bitArray = ref(new Array(BIT_ARRAY_SIZE).fill(0))
const inputToken = ref('')
const logs = ref<string[]>(['Bloom kernel initialized.', 'Ready for probabilistic insertion.'])
const history = ref<string[]>([])

// Simple hash functions for simulation
function hash1(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return Math.abs(h) % BIT_ARRAY_SIZE
}

function hash2(str: string) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i)
  return Math.abs(h) % BIT_ARRAY_SIZE
}

function hash3(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31) + str.charCodeAt(i)
  return Math.abs(h) % BIT_ARRAY_SIZE
}

const getIndices = (val: string) => [hash1(val), hash2(val), hash3(val)]

const lastHashedIndices = ref<number[]>([])
const activeOp = ref<'none' | 'add' | 'check'>('none')
const checkResult = ref<'positive' | 'negative' | null>(null)

function addToFilter() {
  if (!inputToken.value.trim()) return
  const val = inputToken.value.trim().toLowerCase()
  const indices = getIndices(val)
  lastHashedIndices.value = indices
  activeOp.value = 'add'
  
  indices.forEach(idx => {
    bitArray.value[idx] = 1
  })
  
  if (!history.value.includes(val)) history.value.push(val)
  logs.value.unshift(`COMMIT: "${val}" mapped to nodes [${indices.join(', ')}].`)
  inputToken.value = ''
}

function checkFilter() {
  if (!inputToken.value.trim()) return
  const val = inputToken.value.trim().toLowerCase()
  const indices = getIndices(val)
  lastHashedIndices.value = indices
  activeOp.value = 'check'
  
  const allSet = indices.every(idx => bitArray.value[idx] === 1)
  
  if (allSet) {
    checkResult.value = 'positive'
    const isFalsePositive = !history.value.includes(val)
    logs.value.unshift(`QUERY: "${val}" -> PROBABLY PRESENT. ${isFalsePositive ? '!!! FALSE POSITIVE DETECTED !!!' : 'Verified hit.'}`)
  } else {
    checkResult.value = 'negative'
    logs.value.unshift(`QUERY: "${val}" -> DEFINITELY NOT PRESENT. (At least one node zero)`)
  }
}

function resetFilter() {
  bitArray.value = new Array(BIT_ARRAY_SIZE).fill(0)
  history.value = []
  logs.value = ['Filter cleared. Re-initializing bit field.']
  lastHashedIndices.value = []
  activeOp.value = 'none'
  checkResult.value = null
}

const falsePositiveRate = computed(() => {
  const n = history.value.length
  if (n === 0) return '0.00'
  const m = BIT_ARRAY_SIZE
  const k = HASH_COUNT
  // Standard FP formula: (1 - e^(-kn/m))^k
  const rate = Math.pow(1 - Math.exp(-k * n / m), k)
  return (rate * 100).toFixed(2)
})

const systemStats = [
  { label: 'Space Comp.', value: BIT_ARRAY_SIZE + ' bits', icon: 'heroicons:cpu-chip', color: 'text-blue-500' },
  { label: 'Hash Func.', value: HASH_COUNT, icon: 'heroicons:variable', color: 'text-purple-500' },
  { label: 'Time Comp.', value: 'O(k)', icon: 'heroicons:bolt', color: 'text-amber-500' },
  { label: 'False Pos.', value: falsePositiveRate.value + '%', icon: 'heroicons:sparkles', color: 'text-emerald-500' }
]

const insights = [
  { title: 'Probabilistic Nature', desc: 'Can confirm "Definitely Not Present" but only "Probably Present".' },
  { title: 'Space vs Accuracy', desc: 'Fewer bits increase False Positive rates as bit density grows.' },
  { title: 'No Deletions', desc: 'Standard Bloom filters do not support deletion without risking data integrity.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-full min-h-[750px] overflow-hidden">
    
    <!-- LEFT: VISUALIZATION -->
    <div class="lg:col-span-7 p-8 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden">
       <!-- Local Header -->
       <div class="w-full flex items-center justify-between mb-12">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Icon name="heroicons:circle-stack" class="text-xl" />
             </div>
             <div>
                <h4 class="text-white font-black uppercase tracking-tighter text-sm">Bloom Filter Core</h4>
                <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Probabilistic Set Membership</p>
             </div>
          </div>
          <button @click="resetFilter" class="p-2.5 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-95">
             <Icon name="heroicons:arrow-path" class="text-lg" />
          </button>
       </div>

       <!-- CONTROL CLUSTER -->
       <div class="w-full max-w-[500px] mb-12 space-y-4">
          <div class="relative group">
             <input 
               v-model="inputToken" 
               @keyup.enter="activeOp === 'check' ? checkFilter() : addToFilter()"
               placeholder="Enter unique token for hashing..." 
               class="w-full bg-zinc-900/50 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black text-white focus:outline-none focus:border-indigo-500/50 uppercase tracking-widest placeholder:text-zinc-700"
             />
             <div class="absolute right-2 top-2 flex gap-2">
                <button @click="checkFilter" class="px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Check</button>
                <button @click="addToFilter" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95">Add</button>
             </div>
          </div>
       </div>

       <!-- BIT ARRAY VISUAL -->
       <div class="relative w-full max-w-[600px] bg-zinc-900/30 p-10 rounded-3xl border border-white/5 flex flex-col items-center gap-12">
          
          <!-- Selected Indices Visualization (The path) -->
          <div class="flex gap-4 items-center justify-center">
             <div v-for="i in [1, 2, 3]" :key="i" 
               class="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500"
               :class="lastHashedIndices.length > 0 ? 'border-indigo-500/50 bg-indigo-500/5 scale-110' : 'border-white/5 bg-zinc-800 text-zinc-700'"
             >
                <span class="text-[10px] font-black" :class="lastHashedIndices.length > 0 ? 'text-indigo-400' : ''">H{{ i }}</span>
             </div>
          </div>

          <!-- The Bits -->
          <div class="grid grid-cols-8 gap-3 w-full">
             <div v-for="(bit, idx) in bitArray" :key="idx"
               class="aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all duration-500 group"
               :class="[
                 bit === 1 ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-zinc-900 border-white/5',
                 lastHashedIndices.includes(idx) ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-zinc-950 z-20 scale-110' : ''
               ]"
             >
                <span class="text-[8px] font-mono text-zinc-700 absolute top-1 left-2">{{ idx }}</span>
                <span class="text-lg font-black" :class="bit === 1 ? 'text-indigo-400' : 'text-zinc-800'">{{ bit }}</span>
                <div v-if="bit === 1" class="absolute inset-0 bg-indigo-500/10 animate-pulse rounded-xl"></div>
             </div>
          </div>

          <!-- Result Overlay -->
          <transition name="pop">
             <div v-if="activeOp !== 'none' && checkResult" class="absolute -bottom-6 flex items-center gap-3 px-8 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl"
               :class="checkResult === 'positive' ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-zinc-900/50 border-white/10'">
                <Icon :name="checkResult === 'positive' ? 'heroicons:check-circle' : 'heroicons:x-circle'" 
                  :class="checkResult === 'positive' ? 'text-indigo-500' : 'text-zinc-500'" class="text-xl" />
                <div class="text-left">
                   <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Filter Result</p>
                   <p class="text-[11px] font-black text-white uppercase tracking-tighter">
                      {{ checkResult === 'positive' ? 'Probably Present in Set' : 'Definitely Not Present' }}
                   </p>
                </div>
             </div>
          </transition>
       </div>

    </div>

    <!-- RIGHT: ANALYTICS -->
    <div class="lg:col-span-5 flex flex-col border-l border-white/5 bg-zinc-900/40 p-8 space-y-6 overflow-y-auto scrollbar-hide">
       
       <!-- HARDWARE STATS -->
       <div class="grid grid-cols-2 gap-3">
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
       <div class="flex-1 flex flex-col min-h-[300px]">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[8px] mb-3 flex items-center justify-between">
             Hash Translation Log
             <p class="text-[7px] font-mono opacity-30">CRC32 // SHA1 // MD5</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide text-zinc-500">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span :class="log.includes('!!!') ? 'text-red-400' : log.includes('Verified') ? 'text-emerald-400' : 'text-zinc-400'">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHTS -->
       <div class="space-y-3">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 shadow-lg">
                <Icon name="heroicons:cpu-chip" class="text-indigo-500 text-sm" />
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
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.pop-enter-active { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
</style>
