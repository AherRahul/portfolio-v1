<script setup lang="ts">
interface CacheNode {
  key: string
  value: string
}

const capacity = ref(6)
const cache = ref<CacheNode[]>([])
const searchOutput = ref<string | null>(null)
const lastOperation = ref<string>('// System Standby')
const inputKey = ref('')
const inputValue = ref('')
const activeTab = ref<'put' | 'get'>('put')
const logs = ref<string[]>(['LRU Cache cluster initialized.', 'Global state synchronization active.'])

function put(key: string, value: string) {
  if (!key) return
  
  const existingIndex = cache.value.findIndex(n => n.key === key)
  
  if (existingIndex !== -1) {
    cache.value.splice(existingIndex, 1)
    cache.value.unshift({ key, value })
    logs.value.unshift(`WRITE: Updated key ${key}. Moved to MRU position.`)
    lastOperation.value = `cache.put("${key}", "${value}")`
  } else {
    if (cache.value.length >= capacity.value) {
      const evicted = cache.value.pop()
      logs.value.unshift(`EVICT: Capacity full. Purged LRU node: ${evicted?.key}`)
    }
    cache.value.unshift({ key, value })
    logs.value.unshift(`WRITE: Inserted new key ${key}. Current load: ${cache.value.length}/${capacity.value}`)
    lastOperation.value = `cache.put("${key}", "${value}")`
  }
  
  inputKey.value = ''
  inputValue.value = ''
}

function get(key: string) {
  if (!key) return
  
  const index = cache.value.findIndex(n => n.key === key)
  
  if (index !== -1) {
    const node = cache.value[index]
    cache.value.splice(index, 1)
    cache.value.unshift(node)
    
    searchOutput.value = node.value
    logs.value.unshift(`READ: Cache HIT for ${key}. Re-indexed to MRU.`)
    lastOperation.value = `cache.get("${key}") // returned "${node.value}"`
  } else {
    searchOutput.value = 'NULL'
    logs.value.unshift(`READ: Cache MISS for ${key}. Logic: Fallback to DB.`)
    lastOperation.value = `cache.get("${key}") // returned null`
  }
  
  inputKey.value = ''
}

function reset() {
  cache.value = []
  logs.value = ['System reset triggered.', 'Cache memory purged.']
  lastOperation.value = '// Cache cleared'
  searchOutput.value = null
}

const quickAdds = [
  { k: 'user1', v: 'Alice' },
  { k: 'user2', v: 'Bob' },
  { k: 'user3', v: 'Charlie' },
  { k: 'user4', v: 'Diana' },
]

const insights = [
  { title: 'Temporal Locality', desc: 'Recently accessed data is likely to be accessed again soon.' },
  { title: 'O(1) Access', desc: 'Real-world implementations use a HashMap + Doubly Linked List.' },
  { title: 'Write-Back', desc: 'Updates can be delayed to disk to optimize for cache throughput.' }
]

watch(capacity, (newVal) => {
  if (cache.value.length > newVal) {
    const diff = cache.value.length - newVal
    for(let i=0; i<diff; i++) cache.value.pop()
    logs.value.unshift(`CONFIG: Capacity reduced to ${newVal}. Purged ${diff} stale nodes.`)
  }
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden">
    
    <!-- LEFT: THE CORE LOGIC -->
    <div class="space-y-6 relative z-10 flex flex-col min-h-0">
      
      <!-- Top Bar -->
      <div class="flex items-center justify-between pb-4 border-b border-white/5">
         <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
               <Icon name="heroicons:cpu-chip" class="text-xl" />
            </div>
            <div>
               <h4 class="text-white font-black uppercase tracking-tighter text-sm">LRU Processor</h4>
               <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Shard-01 Active</p>
            </div>
         </div>
         <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
               <span class="text-[9px] font-black text-zinc-500 uppercase">Capacity:</span>
               <select v-model="capacity" class="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] font-black text-purple-400 focus:outline-none uppercase">
                  <option v-for="i in [4, 6, 8, 10, 12]" :key="i" :value="i">{{ i }}</option>
               </select>
            </div>
            <button @click="reset" class="text-zinc-500 hover:text-white transition-colors">
               <Icon name="heroicons:arrow-path" class="text-lg" />
            </button>
         </div>
      </div>

      <!-- Visualization Canvas -->
      <div class="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 relative min-h-[240px] flex items-center justify-center overflow-x-auto scrollbar-hide">
         <div class="absolute top-3 left-4 text-[8px] font-black text-zinc-600 uppercase tracking-widest">MRU (Head)</div>
         <div class="absolute top-3 right-4 text-[8px] font-black text-zinc-600 uppercase tracking-widest">LRU (Tail)</div>

         <div class="flex items-center gap-3">
            <transition-group name="node-list">
               <div v-for="(node, i) in cache" :key="node.key" class="flex items-center gap-3">
                  <div class="bg-black border border-white/5 rounded-xl p-3 w-28 flex flex-col items-center group hover:border-purple-500/40 transition-all shadow-xl">
                     <div class="w-full text-center pb-1 border-b border-white/5">
                        <p class="text-[7px] font-black text-zinc-600 uppercase mb-0.5">key</p>
                        <p class="text-[10px] font-black text-white truncate">{{ node.key }}</p>
                     </div>
                     <div class="w-full text-center pt-1">
                        <p class="text-[7px] font-black text-zinc-600 uppercase mb-0.5">value</p>
                        <p class="text-[10px] font-black text-purple-400 truncate">{{ node.value }}</p>
                     </div>
                  </div>
                  <Icon v-if="i < cache.length - 1" name="heroicons:arrow-long-right" class="text-zinc-800" />
               </div>
            </transition-group>
            
            <div v-if="cache.length === 0" class="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
               Cache cluster empty
            </div>
         </div>
      </div>

      <!-- Controls -->
      <div class="space-y-4">
         <div class="flex items-center gap-3">
            <div class="flex bg-white/5 p-1 rounded-xl">
               <button @click="activeTab = 'put'" :class="['px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'put' ? 'bg-purple-600 text-white' : 'text-zinc-500']">Put</button>
               <button @click="activeTab = 'get'" :class="['px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all', activeTab === 'get' ? 'bg-blue-600 text-white' : 'text-zinc-500']">Get</button>
            </div>
            
            <div class="flex-1 flex gap-2">
               <input v-model="inputKey" placeholder="Key" class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none focus:border-purple-500/50" />
               <input v-if="activeTab === 'put'" v-model="inputValue" placeholder="Value" class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none focus:border-purple-500/50" />
               <button @click="activeTab === 'put' ? put(inputKey, inputValue) : get(inputKey)" :class="['px-6 py-2 rounded-xl text-white font-black text-[10px] uppercase tracking-widest', activeTab === 'put' ? 'bg-purple-600' : 'bg-blue-600']">
                  {{ activeTab === 'put' ? 'Put' : 'Search' }}
               </button>
            </div>
         </div>

         <!-- Console Output -->
         <div class="bg-black/80 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-zinc-500">
            <span class="text-purple-500 mr-2">>>></span>
            <span class="text-zinc-300">{{ lastOperation }}</span>
            <span v-if="searchOutput" class="ml-4 text-emerald-500 font-black">// DATA: "{{ searchOutput }}"</span>
         </div>

         <!-- Quick Add Labels -->
         <div class="flex items-center gap-3">
            <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Presets:</span>
            <div class="flex gap-2">
               <button v-for="q in quickAdds" :key="q.k" @click="put(q.k, q.v)" class="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-black text-zinc-500 hover:text-white transition-all uppercase">
                  {{ q.k }}:{{ q.v }}
               </button>
            </div>
         </div>
      </div>
    </div>

    <!-- RIGHT: ANALYTICS HUB -->
    <div class="flex flex-col gap-6 relative z-10">
       <!-- METRICS -->
       <div class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 p-6 rounded-2xl relative overflow-hidden group/metrics">
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full" />
          <h4 class="text-zinc-500 font-black uppercase tracking-widest text-[9px] mb-4">Cache Performance Index</h4>
          <div class="grid grid-cols-3 gap-6 relative">
             <div class="text-center">
                <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Evictions</p>
                <p class="text-xl font-black text-white">{{ logs.filter(l => l.includes('EVICT')).length }}</p>
             </div>
             <div class="text-center">
                <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Latency</p>
                <p class="text-xl font-black text-purple-500">0.05ms</p>
             </div>
             <div class="text-center">
                <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Utilization</p>
                <p class="text-xl font-black text-white">{{ Math.round((cache.length/capacity)*100) }}%</p>
             </div>
          </div>
       </div>

       <!-- SYSTEM LOGS (TERMINAL) -->
       <div class="flex-1 flex flex-col min-h-0">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[9px] mb-3 flex items-center justify-between">
             Kernel Resource Stream
             <span class="text-[8px] opacity-40 font-mono animate-pulse">● SYNCING</span>
          </h4>
          <div class="flex-1 bg-black/80 border border-white/5 rounded-2xl p-6 font-mono text-[10px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                <div v-for="(log, i) in logs" :key="i" :class="['flex gap-3', log.includes('WRITE') ? 'text-purple-400' : log.includes('EVICT') ? 'text-red-400' : 'text-zinc-600']">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span class="opacity-40">>></span>
                   <span>{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- ARCHITECTURE -->
       <div class="space-y-3">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                <Icon name="heroicons:bolt" class="text-purple-500 text-sm" />
             </div>
             <div>
                <p class="text-xs font-black text-white uppercase tracking-tighter mb-1">{{ ins.title }}</p>
                <p class="text-[9px] text-zinc-500 leading-relaxed font-bold uppercase">{{ ins.desc }}</p>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.node-list-enter-active, .node-list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.node-list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
.node-list-leave-to {
  opacity: 0;
  transform: scale(0.5);
  width: 0;
  margin: 0;
}
.node-list-move {
  transition: transform 0.4s ease;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
