<script setup lang="ts">
const longUrl = ref('')
const customAlias = ref('')
const expirationDays = ref(365)
const showAdvanced = ref(false)
const isGenerating = ref(false)

const shortUrls = ref<{ 
  short: string, 
  long: string, 
  clicks: number, 
  timestamp: string, 
  custom?: boolean,
  expires?: string
}[]>([
  { 
    short: 'short.ly/z7DVGB', 
    long: 'https://www.linkedin.com/in/rahul-aher/edit/forms/summary...', 
    clicks: 0, 
    timestamp: 'just now' 
  },
  { 
    short: 'short.ly/a1b2c3', 
    long: 'https://www.example.com/very/long/path/to/some/resource/page...', 
    clicks: 127, 
    timestamp: '3d ago' 
  },
  { 
    short: 'short.ly/gh-repo', 
    long: 'https://github.com/user/repository/blob/main/src/components...', 
    clicks: 45, 
    timestamp: '7d ago',
    custom: true,
    expires: 'Mar 28, 2026'
  }
])

const logs = ref<string[]>(['System Ready. Global redirection engine active.', 'Shard 04 loaded into memory.'])
const totalClicks = computed(() => shortUrls.value.reduce((acc, curr) => acc + curr.clicks, 0))

function generateShort() {
  if (!longUrl.value) return
  isGenerating.value = true
  
  setTimeout(() => {
    const hash = customAlias.value || Math.random().toString(36).substring(2, 8)
    const newEntry = {
      short: `short.ly/${hash}`,
      long: longUrl.value,
      clicks: 0,
      timestamp: 'just now',
      custom: !!customAlias.value,
      expires: expirationDays.value ? new Date(Date.now() + expirationDays.value * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined
    }
    shortUrls.value.unshift(newEntry)
    logs.value.unshift(`WRITE: Generated alias ${hash}. Cache ID: ${Math.random().toString(16).slice(2, 6)}`)
    longUrl.value = ''
    customAlias.value = ''
    isGenerating.value = false
  }, 800)
}

function deleteLink(index: number) {
  const entry = shortUrls.value[index]
  logs.value.unshift(`DELETE: Purging alias ${entry.short} from TTL index.`)
  shortUrls.value.splice(index, 1)
}

function simulateClick(index: number) {
  const entry = shortUrls.value[index]
  entry.clicks++
  logs.value.unshift(`READ: Redirecting ${entry.short} -> 302 Found`)
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  logs.value.unshift(`UI: Copied ${text} to buffer.`)
}

const insights = [
  { title: 'Base62 Encoding', desc: 'Transforming 64-bit IDs into standard [a-zA-Z0-9] short strings.' },
  { title: 'Bloom Filters', desc: 'Probabilistic check for URL existence before querying the DB cluster.' },
  { title: 'Write-Through', desc: 'Consistency guaranteed via simultaneous DB and Cache updates.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden">
    
    <!-- LEFT: GENERATOR & LIST -->
    <div class="space-y-6 relative z-10 flex flex-col min-h-0">
      <!-- Top Summary Bar -->
      <div class="flex items-center justify-between pb-4 border-b border-white/5">
         <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
               <Icon name="heroicons:link" class="text-xl" />
            </div>
            <div>
               <h4 class="text-white font-black uppercase tracking-tighter text-sm">short.ly engine</h4>
               <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Shard-04 Redirection</p>
            </div>
         </div>
         <div class="flex items-center gap-6">
            <div class="text-center"><p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Total</p><p class="text-[11px] font-black text-white">{{ shortUrls.length }} L</p></div>
            <div class="text-center"><p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Clicks</p><p class="text-[11px] font-black text-blue-500">{{ totalClicks }}</p></div>
         </div>
      </div>

      <!-- Input Area -->
      <div class="bg-zinc-900/40 border border-white/5 rounded-2xl p-6">
         <div class="flex gap-2">
            <div class="relative flex-1">
               <Icon name="heroicons:globe-americas" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-lg" />
               <input v-model="longUrl" placeholder="Paste your long URL..." class="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[10px] text-white focus:outline-none focus:border-blue-500/50 uppercase font-black" />
            </div>
            <button @click="generateShort" :disabled="isGenerating || !longUrl" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase rounded-xl transition-all disabled:opacity-30">
               {{ isGenerating ? '...' : 'Shorten' }}
            </button>
         </div>
         <button @click="showAdvanced = !showAdvanced" class="mt-4 text-[8px] font-black text-zinc-600 uppercase tracking-widest hover:text-white flex items-center gap-1">
            <Icon name="heroicons:cog-8-tooth" /> Advanced Configuration
         </button>
         <transition name="expand">
            <div v-if="showAdvanced" class="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
               <div class="space-y-1"><label class="text-[7px] font-black text-zinc-500 uppercase">Custom Alias</label><input v-model="customAlias" class="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-[9px] text-white focus:outline-none" /></div>
               <div class="space-y-1"><label class="text-[7px] font-black text-zinc-500 uppercase">TTL Days</label><input v-model="expirationDays" type="number" class="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-[9px] text-white focus:outline-none" /></div>
            </div>
         </transition>
      </div>

      <!-- Links List -->
      <div class="flex-1 overflow-y-auto space-y-3 min-h-[300px] scrollbar-hide pr-2">
         <div v-for="(entry, i) in shortUrls" :key="i" class="group/link bg-zinc-900/40 border border-white/5 rounded-2xl p-4 hover:bg-zinc-900 border-l-2 hover:border-l-blue-500 transition-all flex items-center gap-4">
            <div class="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 shrink-0"><Icon name="heroicons:link" /></div>
            <div class="flex-1 min-w-0">
               <div class="flex items-center gap-2 mb-1">
                  <span @click="simulateClick(i)" class="text-[10px] font-black text-blue-500 hover:underline cursor-pointer">{{ entry.short }}</span>
                  <span v-if="entry.custom" class="text-[7px] font-black px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded uppercase">Custom</span>
               </div>
               <p class="text-[9px] text-zinc-600 font-bold truncate uppercase tracking-tighter">{{ entry.long }}</p>
            </div>
            <div class="flex items-center gap-3 opacity-0 group-hover/link:opacity-100 transition-opacity">
               <button @click="copyToClipboard(entry.short)" class="p-2 text-zinc-600 hover:text-white"><Icon name="heroicons:document-duplicate" /></button>
               <button @click="deleteLink(i)" class="p-2 text-zinc-600 hover:text-red-500"><Icon name="heroicons:trash" /></button>
            </div>
         </div>
      </div>
    </div>

    <!-- RIGHT: ANALYTICS -->
    <div class="flex flex-col gap-6 relative z-10">
       <div class="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group/metrics">
          <h4 class="text-zinc-500 font-black uppercase tracking-widest text-[9px] mb-4">Cache Throughput</h4>
          <div class="grid grid-cols-2 gap-6 relative">
             <div class="text-center"><p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Hit Rate</p><p class="text-xl font-black text-white">96.8%</p></div>
             <div class="text-center"><p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Latency</p><p class="text-xl font-black text-blue-500">1.4ms</p></div>
          </div>
       </div>

       <div class="flex-1 flex flex-col min-h-0">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[9px] mb-3">Event logs</h4>
          <div class="flex-1 bg-black/80 border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3 text-zinc-600">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span class="opacity-40">>></span>
                   <span :class="log.includes('WRITE') ? 'text-blue-400' : ''">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <div class="space-y-3">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
             <Icon name="heroicons:bolt" class="text-blue-500 text-sm shrink-0" />
             <div>
                <p class="text-[10px] font-black text-white uppercase mb-1">{{ ins.title }}</p>
                <p class="text-[8px] text-zinc-600 border-l border-zinc-800 pl-3 leading-relaxed font-bold uppercase">{{ ins.desc }}</p>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 100px; opacity: 1; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; overflow: hidden; }
</style>
