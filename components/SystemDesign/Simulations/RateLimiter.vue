<script setup lang="ts">
type Algorithm = 'token-bucket' | 'fixed-window'

const algorithm = ref<Algorithm>('token-bucket')
const isPaused = ref(false)
const logs = ref<string[]>(['Rate Limiter initialized.', 'Distributed Redis sync active.'])
const requests = ref<{ id: number, status: 'ALLOWED' | 'BLOCKED', timestamp: string }[]>([])
let requestCounter = 40

// --- TOKEN BUCKET STATE ---
const capacity = 5
const tokens = ref(5)
const refillRate = 1 // token per sec

// --- FIXED WINDOW STATE ---
const windowSize = 10 // seconds
const windowLimit = 5
const windowRequests = ref(0)
const timeLeftInWindow = ref(10.0)

// Refill / Window Timer
let coreInterval: any
onMounted(() => {
  coreInterval = setInterval(() => {
    if (isPaused.value) return

    // Token Bucket Logic
    if (tokens.value < capacity) {
      tokens.value = Math.min(capacity, tokens.value + (refillRate / 10))
    }

    // Fixed Window Logic
    timeLeftInWindow.value -= 0.1
    if (timeLeftInWindow.value <= 0) {
      timeLeftInWindow.value = windowSize
      windowRequests.value = 0
      logs.value.unshift(`WINDOW: Time boundary reached. Resetting counter for next ${windowSize}s shard.`)
    }
  }, 100)
})

onUnmounted(() => {
  clearInterval(coreInterval)
})

function sendRequest() {
  const id = requestCounter--
  const now = new Date().toLocaleTimeString('en-GB')
  let allowed = false

  if (algorithm.value === 'token-bucket') {
    if (tokens.value >= 1) {
      tokens.value -= 1
      allowed = true
    }
  } else {
    // Fixed Window
    if (windowRequests.value < windowLimit) {
      windowRequests.value++
      allowed = true
    }
  }

  const status = allowed ? 'ALLOWED' : 'BLOCKED'
  requests.value.unshift({ id, status, timestamp: now })
  logs.value.unshift(`REQ: #${id} - ${status}. Metadata: { algo: "${algorithm.value}", ts: ${Date.now()} }`)
  
  if (!allowed) {
    logs.value.unshift(`ALARM: 429 Too Many Requests detected on node cluster 02.`)
  }
}

function reset() {
  tokens.value = 5
  windowRequests.value = 0
  timeLeftInWindow.value = 10
  requests.value = []
  logs.value = ['System re-hydrated. Shards cleared.']
}

const insights = [
  { title: 'Token Bucket', desc: 'Handles traffic bursts up to bucket capacity. Ideal for smoothing output rates.' },
  { title: 'Fixed Window', desc: 'Resets at discrete time boundaries. Simple but prone to edge-case bursts.' },
  { title: 'Atomic Counters', desc: 'Redis INCR is used to ensure thread-safety across distributed nodes.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden">
    
    <!-- LEFT: THE CONTROLLER -->
    <div class="space-y-6 relative z-10 flex flex-col min-h-0">
      
      <!-- Top Bar -->
      <div class="flex items-center justify-between pb-4 border-b border-white/5">
         <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <Icon name="heroicons:shield-check" class="text-xl" />
            </div>
            <div>
               <h4 class="text-white font-black uppercase tracking-tighter text-sm">Rate Limiter</h4>
               <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Gateway Traffic Control</p>
            </div>
         </div>
         <button @click="reset" class="text-zinc-500 hover:text-white transition-colors">
            <Icon name="heroicons:arrow-path" class="text-lg" />
         </button>
      </div>

      <!-- Algorithm Switcher -->
      <div class="bg-zinc-900 border border-white/5 rounded-xl p-1 flex">
         <button 
           @click="algorithm = 'fixed-window'"
           :class="['flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all', algorithm === 'fixed-window' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-white']"
         >
            <Icon name="heroicons:clock" />
            Fixed Window
         </button>
         <button 
           @click="algorithm = 'token-bucket'"
           :class="['flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all', algorithm === 'token-bucket' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-white']"
         >
            <Icon name="heroicons:bolt" />
            Token Bucket
         </button>
      </div>

      <!-- Explanation Card -->
      <div class="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
         <p class="text-[9px] font-bold text-zinc-400 leading-relaxed uppercase tracking-tight">
            <span class="text-white font-black">{{ algorithm === 'token-bucket' ? 'Token Bucket:' : 'Fixed Window:' }}</span>
            {{ algorithm === 'token-bucket' 
               ? 'Bucket holds max 5 tokens. Each request consumes 1 token. Tokens refill at 1/sec.' 
               : 'Allows 5 requests per 10s window. Counter resets at the start of each window.' 
            }}
         </p>
      </div>

      <!-- Visualization Area -->
      <div class="bg-zinc-900/40 border border-white/5 rounded-2xl p-8 relative min-h-[220px] flex flex-col justify-center">
         
         <!-- TOKEN BUCKET VIEW -->
         <div v-if="algorithm === 'token-bucket'" class="flex flex-col items-center">
            <div class="w-full flex justify-between items-center mb-6">
               <span class="text-[9px] font-black text-zinc-600 uppercase">Token Bucket</span>
               <span class="text-xs font-black text-white tabular-nums">{{ tokens.toFixed(1) }} / {{ capacity }} tokens</span>
            </div>
            
            <div class="relative w-32 h-40 bg-zinc-800 rounded-b-3xl border-x-4 border-b-4 border-zinc-700 overflow-hidden flex flex-col justify-end mb-6">
               <div 
                 class="bg-blue-500/80 w-full transition-all duration-300 relative"
                 :style="{ height: `${(tokens / capacity) * 100}%` }"
               >
                  <div class="absolute top-0 left-0 w-full h-2 bg-white/20 animate-pulse" />
               </div>
               <div v-if="tokens < 1" class="absolute inset-0 flex items-center justify-center">
                  <span class="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Depleted</span>
               </div>
            </div>

            <div class="flex gap-2 mb-4">
               <div v-for="i in 5" :key="i" :class="['w-6 h-6 rounded-full flex items-center justify-center border', i <= tokens ? 'bg-blue-500/20 border-blue-500/40 text-blue-500' : 'bg-transparent border-white/5 text-zinc-800']">
                  <Icon name="heroicons:bolt" class="text-xs" />
               </div>
            </div>
            <div class="flex items-center gap-2">
               <span class="text-[8px] font-black text-blue-500 px-1.5 py-0.5 bg-blue-500/10 rounded uppercase">Refill</span>
               <span class="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Rate: 1 token/sec</span>
            </div>
         </div>

         <!-- FIXED WINDOW VIEW -->
         <div v-else class="space-y-6">
            <div class="flex justify-between items-center">
               <span class="text-[9px] font-black text-zinc-600 uppercase">Window Progress</span>
               <span class="text-[10px] font-black text-white tabular-nums uppercase">{{ timeLeftInWindow.toFixed(1) }}s remaining</span>
            </div>
            
            <div class="h-8 bg-zinc-800 rounded-lg overflow-hidden relative border border-white/5">
                <div 
                   class="h-full bg-blue-600 transition-all duration-100 flex items-center justify-center"
                   :style="{ width: `${(timeLeftInWindow / windowSize) * 100}%` }"
                >
                   <span class="text-[8px] font-black text-white uppercase whitespace-nowrap px-4">Window: {{ (windowSize - timeLeftInWindow).toFixed(1) }}s / 10s</span>
                </div>
            </div>

            <div class="space-y-4">
               <div class="flex justify-between items-center">
                  <span class="text-[9px] font-black text-zinc-600 uppercase">Requests in window</span>
                  <div class="flex gap-2">
                     <span v-for="i in 5" :key="i" :class="['w-5 h-5 rounded flex items-center justify-center text-[8px] font-black', i <= windowRequests ? 'bg-white text-zinc-900' : 'bg-zinc-800 text-zinc-600']">{{ i }}</span>
                  </div>
               </div>
               <div class="text-center">
                  <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{{ windowRequests }}/{{ windowLimit }} requests used</p>
               </div>
            </div>
         </div>
      </div>

      <!-- Primary Actions -->
      <div class="grid grid-cols-2 gap-3">
         <button 
           @click="isPaused = !isPaused"
           class="py-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black text-zinc-300 uppercase tracking-widest hover:text-white transition-all active:scale-95"
         >
            <Icon :name="isPaused ? 'heroicons:play' : 'heroicons:pause'" />
            {{ isPaused ? 'Resume' : 'Pause' }}
         </button>
         <button 
           @click="sendRequest"
           class="py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
         >
            <Icon name="heroicons:paper-airplane" />
            Send Request
         </button>
      </div>

      <!-- Requests List -->
      <div class="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
         <h5 class="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Recent Network Events</h5>
         <div v-for="req in requests.slice(0, 10)" :key="req.id" 
           :class="['flex items-center justify-between p-3 rounded-lg border', req.status === 'ALLOWED' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10']">
            <div class="flex items-center gap-3">
               <div :class="['w-1.5 h-1.5 rounded-full', req.status === 'ALLOWED' ? 'bg-emerald-500' : 'bg-red-500']" />
               <span class="text-[9px] font-black text-zinc-300 uppercase">Request #{{ req.id }}</span>
            </div>
            <span class="text-[8px] font-bold text-zinc-600 tabular-nums">{{ req.timestamp }}</span>
         </div>
         <div v-if="requests.length === 0" class="h-20 flex items-center justify-center border border-dashed border-white/5 rounded-xl">
            <span class="text-[8px] font-black text-zinc-700 uppercase tracking-widest">No traffic detected</span>
         </div>
      </div>
    </div>

    <!-- RIGHT: THE ANALYTICS HUB -->
    <div class="flex flex-col gap-6 relative z-10">
       
       <!-- METRICS -->
       <div class="grid grid-cols-2 gap-4">
          <div class="bg-zinc-900/50 border border-white/5 p-4 rounded-xl relative overflow-hidden group/m">
             <div class="absolute -top-4 -right-4 w-12 h-12 bg-white/5 blur-xl rounded-full" />
             <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Throughput</p>
             <p class="text-xl font-black text-white">{{ requests.filter(r => r.status === 'ALLOWED').length }}</p>
          </div>
          <div class="bg-zinc-900/50 border border-white/5 p-4 rounded-xl relative overflow-hidden group/m">
             <div class="absolute -top-4 -right-4 w-12 h-12 bg-red-500/5 blur-xl rounded-full" />
             <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Dropped</p>
             <p class="text-xl font-black text-red-500">{{ requests.filter(r => r.status === 'BLOCKED').length }}</p>
          </div>
       </div>

       <!-- REDIS LOGS (TERMINAL) -->
       <div class="flex-1 flex flex-col min-h-0">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[8px] mb-3 flex items-center justify-between">
             Distributed State Stream
             <span class="text-[7px] text-emerald-500 font-mono animate-pulse">● SYNC_OK</span>
          </h4>
          <div class="flex-1 bg-black/80 border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3 text-zinc-600">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span class="opacity-40">>></span>
                   <span :class="log.includes('ALLOWED') ? 'text-emerald-500/60' : log.includes('BLOCKED') ? 'text-red-500/60' : ''">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- SPECS -->
       <div class="space-y-3">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
                <Icon name="heroicons:cpu-chip" class="text-emerald-500 text-sm" />
             </div>
             <div>
                <p class="text-[10px] font-black text-white uppercase tracking-tight mb-1">{{ ins.title }}</p>
                <p class="text-[8px] text-zinc-500 leading-relaxed font-bold uppercase">{{ ins.desc }}</p>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
