<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Document {
  id: number
  title: string
  content: string
  score?: number
}

const documents = ref<Document[]>([
  { id: 1, title: 'Distributed Systems', content: 'Distributed systems are collections of independent computers.' },
  { id: 2, title: 'Load Balancing', content: 'Load balancing distributes network traffic across multiple servers.' },
  { id: 3, title: 'Database Indexing', content: 'Indexing improves the speed of data retrieval operations.' },
  { id: 4, title: 'Scalable Architecture', content: 'Scalability is the ability to handle growth in users and data.' },
  { id: 5, title: 'Microservices vs Monolith', content: 'Microservices architectural style structures an app as a collection of services.' }
])

const invertedIndex = ref<Record<string, number[]>>({})
const searchInput = ref('')
const logs = ref<string[]>(['Search Engine kernel initialized.', 'Spider waiting for crawl authorization.'])
const showIndex = ref(false)

function updateInvertedIndex() {
  const index: Record<string, number[]> = {}
  documents.value.forEach(doc => {
    const words = doc.content.toLowerCase().split(/\W+/).filter(w => w.length > 2)
    words.forEach(word => {
      if (!index[word]) index[word] = []
      if (!index[word].includes(doc.id)) index[word].push(doc.id)
    })
  })
  invertedIndex.value = index
}

onMounted(() => {
  updateInvertedIndex()
  logs.value.unshift(`COMMIT: ${documents.value.length} documents indexed. Index size: ${Object.keys(invertedIndex.value).length} terms.`)
})

const results = computed(() => {
  if (!searchInput.value.trim()) return []
  const terms = searchInput.value.toLowerCase().split(/\W+/).filter(t => t.length > 0)
  
  if (terms.length === 0) return []
  
  const scores: Record<number, number> = {}
  
  terms.forEach(term => {
    // Exact match
    if (invertedIndex.value[term]) {
      invertedIndex.value[term].forEach(did => {
        scores[did] = (scores[did] || 0) + 10
      })
    }
    // Partial match (simulating fuzziness)
    Object.keys(invertedIndex.value).forEach(idxTerm => {
      if (idxTerm.includes(term) && idxTerm !== term) {
        invertedIndex.value[idxTerm].forEach(did => {
          scores[did] = (scores[did] || 0) + 2
        })
      }
    })
  })
  
  return Object.entries(scores)
    .map(([did, score]) => {
      const doc = documents.value.find(d => d.id === Number(did))!
      return { ...doc, score }
    })
    .sort((a, b) => b.score! - a.score!)
})

function crawlDocument() {
  const titles = ['Kafka Clusters', 'Zookeeper Sharding', 'Redis Caching', 'NoSQL Design', 'Event-Driven Arch', 'API Gateway']
  const contents = [
    'Kafka is used for high-throughput event processing.',
    'Zookeeper manages configuration and coordination in sharded clusters.',
    'Redis is an in-memory data store used as a database and cache.',
    'NoSQL databases are designed for scalable high-performance workloads.',
    'Event-driven architecture uses events to trigger and communicate between services.',
    'API gateway acts as a reverse proxy to accept all API calls and aggregate services.'
  ]
  const idx = Math.floor(Math.random() * titles.length)
  const newDoc: Document = {
    id: documents.value.length + 1,
    title: titles[idx],
    content: contents[idx]
  }
  
  documents.value.push(newDoc)
  updateInvertedIndex()
  logs.value.unshift(`SPIDER: Crawled "${newDoc.title}". Updated inverted index.`)
}

function resetEngine() {
  documents.value = documents.value.slice(0, 5)
  updateInvertedIndex()
  searchInput.value = ''
  logs.value = ['Engine reset performed.', 'Inverted index re-initialized.']
}

const systemStats = [
  { label: 'Index Size', value: Object.keys(invertedIndex.value).length + ' words', icon: 'heroicons:document-magnifying-glass', color: 'text-amber-500' },
  { label: 'Query Latency', value: '18ms', icon: 'heroicons:bolt', color: 'text-blue-500' },
  { label: 'Documents', value: documents.value.length, icon: 'heroicons:archive-box', color: 'text-purple-500' },
  { label: 'Disk Load', value: 'Minimal', icon: 'heroicons:cpu-chip', color: 'text-emerald-500' }
]

const insights = [
  { title: 'Inverted Index', desc: 'Maps keywords to document locations for ultra-fast lookup at O(1) complexity.' },
  { title: 'TF-IDF Scoring', desc: 'Simulated ranking based on keyword density and document relevance scores.' },
  { title: 'Web Crawling', desc: 'Automated "Spiders" traverse indices to discover and update the content shard.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-full min-h-[850px] overflow-hidden">
    
    <!-- LEFT: SEARCH INTERFACE -->
    <div class="lg:col-span-12 xl:col-span-7 p-10 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden h-full">
       <!-- Local Header -->
       <div class="w-full flex items-center justify-between mb-8 shrink-0">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <Icon name="heroicons:server-stack" class="text-xl" />
             </div>
             <div>
                <h4 class="text-white font-black uppercase tracking-tighter text-sm">Design Search Engine</h4>
                <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{{ documents.length }} Documents in Shard</p>
             </div>
          </div>
          <div class="flex items-center gap-2">
             <button @click="showIndex = !showIndex" :class="showIndex ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-zinc-900 text-zinc-500 border-white/5'" class="p-2 border rounded-lg transition-all active:scale-95">
                <Icon name="heroicons:list-bullet" class="text-lg" />
             </button>
             <button @click="crawlDocument" class="flex gap-2 items-center px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black text-white hover:bg-zinc-800 transition-all uppercase tracking-widest shadow-lg active:scale-95">
                <Icon name="heroicons:bug-ant" class="text-xs text-red-500" />
                Trigger Crawler
             </button>
             <button @click="resetEngine" class="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-95">
                <Icon name="heroicons:arrow-path" class="text-lg" />
             </button>
          </div>
       </div>

       <!-- SEARCH BOX -->
       <div class="w-full max-w-[600px] mb-8 shrink-0">
          <div class="relative group">
             <Icon name="heroicons:sparkles" class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" />
             <input 
               v-model="searchInput" 
               placeholder="binary search engine query..." 
               class="w-full bg-zinc-900 border border-white/10 rounded-2xl pl-14 pr-24 py-5 text-sm font-black text-white focus:outline-none focus:border-red-500/50 uppercase tracking-[0.1em] placeholder:text-zinc-700 shadow-2xl transition-all"
             />
             <button class="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all active:scale-95">Search</button>
          </div>
          <div class="mt-4 flex items-center justify-between px-2">
             <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{{ results.length }} of {{ documents.length }} results • 303ms</p>
          </div>
       </div>

       <!-- CONTENT AREA -->
       <div class="w-full max-w-[600px] flex-1 min-h-0 relative overflow-hidden flex flex-col">
          
          <!-- RESULTS VIEW -->
          <div v-if="!showIndex" class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
             <div v-if="results.length > 0" class="space-y-4">
                <div v-for="res in results" :key="res.id" class="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl group hover:border-red-500/30 transition-all shadow-sm">
                   <div class="flex justify-between items-start mb-2">
                      <div>
                         <p class="text-[8px] font-bold text-red-500/50 uppercase tracking-widest mb-1">https://rahulaher.netlify.app/design/{{ res.title.toLowerCase().replace(/ /g, '-') }}</p>
                         <h5 class="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">{{ res.title }}</h5>
                      </div>
                      <div class="px-2 py-1 bg-white/[0.02] border border-white/5 rounded text-[8px] font-black text-red-500/50 uppercase">Score: {{ res.score }}</div>
                   </div>
                   <p class="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase">{{ res.content }}</p>
                   <div class="mt-4 flex gap-4 opacity-50">
                      <div class="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                         <div class="h-full bg-red-600" :style="{ width: Math.min(res.score || 0, 100) + '%' }"></div>
                      </div>
                   </div>
                </div>
             </div>
             <div v-else-if="searchInput" class="flex flex-col items-center justify-center py-20 opacity-40">
                <Icon name="heroicons:beaker" class="text-4xl text-zinc-600 mb-4" />
                <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Zero documents matched query fingerprint</p>
             </div>
             <div v-else class="space-y-4 opacity-20">
                <div v-for="i in 3" :key="i" class="p-6 border border-dashed border-white/10 rounded-2xl h-32" />
             </div>
          </div>

          <!-- INVERTED INDEX VIEW -->
          <div v-else class="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
             <div class="flex items-center gap-2 mb-4">
                <Icon name="heroicons:circle-stack" class="text-red-500" />
                <h5 class="text-[10px] font-black text-white uppercase tracking-widest">Inverted Index Mappings</h5>
             </div>
             <div v-for="(ids, term) in invertedIndex" :key="term" class="p-4 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between group hover:border-red-500/30 transition-all">
                <div class="flex flex-col">
                   <span class="text-xs font-black text-white uppercase tracking-wider group-hover:text-red-400 transition-colors">{{ term }}</span>
                   <span class="text-[8px] font-bold text-zinc-600 uppercase">{{ ids.length }} Documents</span>
                </div>
                <div class="flex gap-1.5 shadow-inner">
                   <div v-for="id in ids" :key="id" class="px-2 py-1 bg-black border border-white/5 rounded text-[9px] font-black text-red-500">
                      #{{ id }}
                   </div>
                </div>
             </div>
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
             Search Cluster Resource Log
             <p class="text-[7px] font-mono opacity-30">PID 9912 // LIVE</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto custom-scrollbar text-zinc-500 pr-1">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span :class="log.includes('SPIDER') ? 'text-red-400' : 'text-zinc-400'">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHTS -->
       <div class="space-y-3 shrink-0">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 shadow-lg">
                <Icon name="heroicons:cpu-chip" class="text-red-500 text-sm" />
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
</style>
