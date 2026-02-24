<script setup lang="ts">
import { ref, computed } from 'vue'

interface Topic {
  id: string
  name: string
  color: string // 'blue' | 'purple' | 'emerald' | 'orange' | 'amber'
  subCount: number
}

interface Message {
  id: number
  topicId: string
  content: string
  timestamp: string
}

interface Subscriber {
  id: string
  name: string
  initial: string
  colorClass: string // For neon accents
  glowClass: string
  subscriptions: string[] // topic IDs
  messages: Message[]
}

const topics = ref<Topic[]>([
  { id: 'orders', name: 'orders', color: 'blue', subCount: 2 },
  { id: 'notifications', name: 'notifications', color: 'purple', subCount: 2 },
  { id: 'analytics', name: 'analytics', color: 'emerald', subCount: 1 },
])

const subscribers = ref<Subscriber[]>([
  { 
    id: 'order-service', 
    name: 'Order Service', 
    initial: 'O', 
    colorClass: 'text-amber-500 border-amber-500/20 bg-amber-500/5', 
    glowClass: 'shadow-amber-500/10',
    subscriptions: ['orders'], 
    messages: [] 
  },
  { 
    id: 'email-service', 
    name: 'Email Service', 
    initial: 'E', 
    colorClass: 'text-purple-500 border-purple-500/20 bg-purple-500/5', 
    glowClass: 'shadow-purple-500/10',
    subscriptions: ['orders', 'notifications'], 
    messages: [] 
  },
  { 
    id: 'dashboard', 
    name: 'Dashboard Controller', 
    initial: 'D', 
    colorClass: 'text-blue-500 border-blue-500/20 bg-blue-500/5', 
    glowClass: 'shadow-blue-500/10',
    subscriptions: ['notifications', 'analytics'], 
    messages: [] 
  },
])

const logs = ref<string[]>(['Pub/Sub Broker Mesh v2.8 active.', 'Syncing partition offsets...'])
const selectedTopicId = ref(topics.value[0].id)
const newMessageContent = ref('')
const totalMessagesCount = ref(0)
let nextMessageId = 1

const isBroadcasting = ref(false)
const scanningNodeId = ref<string | null>(null)
const highlightingNodeIds = ref<string[]>([])

const hardwareStats = [
  { label: 'Throughput', value: '2.4 GB/s', icon: 'heroicons:bolt', color: 'text-amber-500' },
  { label: 'Latency', value: '0.8ms', icon: 'heroicons:clock', color: 'text-emerald-500' },
  { label: 'Offset', value: '1,042,901', icon: 'heroicons:variable', color: 'text-blue-500' },
  { label: 'Uptime', value: '45d 12h', icon: 'heroicons:shield-check', color: 'text-purple-500' },
]

async function publishMessage() {
  if (!newMessageContent.value.trim() || isBroadcasting.value) return

  const targetTopic = selectedTopicId.value
  const content = newMessageContent.value
  newMessageContent.value = ''
  isBroadcasting.value = true
  highlightingNodeIds.value = []
  
  logs.value.unshift(`[BROKER] Discovery phase started for #${targetTopic}...`)
  
  // Step 1: Sequential Node Discovery
  for (const sub of subscribers.value) {
    scanningNodeId.value = sub.id
    await new Promise(r => setTimeout(r, 150)) // Scan duration per node
    
    if (sub.subscriptions.includes(targetTopic)) {
      highlightingNodeIds.value.push(sub.id)
      logs.value.unshift(`[BROKER] Endpoint match: ${sub.name}`)
    }
  }
  
  scanningNodeId.value = null
  await new Promise(r => setTimeout(r, 300)) // Pause before delivery

  // Step 2: Push Payload
  const message: Message = {
    id: nextMessageId++,
    topicId: targetTopic,
    content: content,
    timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  subscribers.value.forEach(sub => {
    if (sub.subscriptions.includes(targetTopic)) {
      sub.messages.unshift(message)
      if (sub.messages.length > 5) sub.messages.pop()
    }
  })

  totalMessagesCount.value++
  logs.value.unshift(`[BROKER] Push complete. ACK received from ${highlightingNodeIds.value.length} nodes.`)
  if (logs.value.length > 20) logs.value.pop()

  // Step 3: Persistence Highlight
  await new Promise(r => setTimeout(r, 1200))
  highlightingNodeIds.value = []
  isBroadcasting.value = false
}

function toggleSubscription(subscriber: Subscriber, topicId: string) {
  const index = subscriber.subscriptions.indexOf(topicId)
  if (index > -1) {
    subscriber.subscriptions.splice(index, 1)
    logs.value.unshift(`[SUBSCRIPTION] ${subscriber.name} detached from #${topicId}`)
  } else {
    subscriber.subscriptions.push(topicId)
    logs.value.unshift(`[SUBSCRIPTION] ${subscriber.name} listening on #${topicId}`)
  }
  
  // Update subCounts
  topics.value.forEach(t => {
    t.subCount = subscribers.value.filter(s => s.subscriptions.includes(t.id)).length
  })
}

function addTopic() {
  const name = prompt('Enter topic name (without #):')
  if (name && !topics.value.find(t => t.name === name)) {
    topics.value.push({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name.toLowerCase(),
      color: ['blue', 'purple', 'emerald', 'orange', 'amber'][Math.floor(Math.random() * 5)],
      subCount: 0
    })
    logs.value.unshift(`[BROKER] Partition created for #${name}`)
  }
}

function addSubscriber() {
  const name = prompt('Enter service name:')
  if (name) {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    subscribers.value.push({
      id,
      name,
      initial: name.charAt(0).toUpperCase(),
      colorClass: 'text-zinc-400 border-zinc-500/10 bg-zinc-500/5',
      glowClass: 'shadow-zinc-500/5',
      subscriptions: [],
      messages: []
    })
    logs.value.unshift(`[NODE] Service registered: ${name}`)
  }
}

function deleteSubscriber(id: string) {
  const sub = subscribers.value.find(s => s.id === id)
  if (sub) {
    subscribers.value = subscribers.value.filter(s => s.id !== id)
    logs.value.unshift(`[NODE] Service decommissioned: ${sub.name}`)
    // Update subCounts
    topics.value.forEach(t => {
      t.subCount = subscribers.value.filter(s => s.subscriptions.includes(t.id)).length
    })
  }
}

function deleteTopic(id: string) {
  const topic = topics.value.find(t => t.id === id)
  if (topic) {
    topics.value = topics.value.filter(t => t.id !== id)
    // Remove from subscribers
    subscribers.value.forEach(s => {
      s.subscriptions = s.subscriptions.filter(tid => tid !== id)
    })
    logs.value.unshift(`[BROKER] Topic deleted: #${topic.name}`)
  }
}

function resetSimulation() {
  subscribers.value.forEach(s => s.messages = [])
  totalMessagesCount.value = 0
  logs.value = ['Pub/Sub Broker mesh reset.', 'Offsets zeroed. Ready.']
}

// Technical Color Mapping for Dark Mode
const technicalColors: Record<string, { text: string, border: string, bg: string, glow: string }> = {
  blue: { text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20' },
  purple: { text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/20' },
  emerald: { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
  orange: { text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20' },
  amber: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' },
}

function getTechnicalStyle(color: string) {
  const style = technicalColors[color] || technicalColors.blue
  return `${style.text} ${style.border} ${style.bg} ${style.glow}`
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#050505] rounded-2xl border border-white/5 relative h-full min-h-[850px] overflow-hidden shadow-2xl">
    
    <!-- LEFT: THE CONTROL HUB (75%) -->
    <div class="lg:col-span-12 xl:col-span-9 p-10 flex flex-col h-full bg-black/40 relative overflow-hidden">
       
       <!-- AMBIENT BG -->
       <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]"></div>

       <!-- HEADER -->
       <div class="flex items-center justify-between mb-10 relative z-10">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 border border-white/10 shadow-lg shadow-blue-500/5">
                <Icon name="heroicons:radio" class="text-2xl" />
             </div>
             <div>
                <h2 class="text-white font-black text-xl tracking-tight uppercase leading-tight">Pub/Sub Mesh</h2>
                <p class="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">Enterprise Message Bus v2.8</p>
             </div>
          </div>
          <button @click="resetSimulation" class="w-10 h-10 hover:bg-white/5 flex items-center justify-center rounded-xl transition-all border border-transparent hover:border-white/10 group">
             <Icon name="heroicons:arrow-path" class="text-zinc-600 group-hover:text-white group-hover:rotate-180 transition-all duration-500 text-lg" />
          </button>
       </div>

       <!-- PUBLISH ACTION -->
       <div class="space-y-4 mb-10 relative z-10">
          <div class="flex items-center gap-2 text-zinc-600 px-1">
             <Icon name="heroicons:paper-airplane" class="text-[10px]" />
             <span class="text-[9px] font-black uppercase tracking-[0.2em]">Broadcast Payload</span>
          </div>
          <div class="bg-white/[0.03] border border-white/5 rounded-2xl p-2 flex gap-2 shadow-2xl overflow-hidden backdrop-blur-sm">
             <div class="relative min-w-[160px]">
                <select v-model="selectedTopicId" 
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none uppercase tracking-widest cursor-pointer"
                >
                   <option v-for="topic in topics" :key="topic.id" :value="topic.id" class="bg-zinc-900 border-none"># {{ topic.name }}</option>
                </select>
                <Icon name="heroicons:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-xs pointer-events-none" />
             </div>
             <input v-model="newMessageContent" 
               @keyup.enter="publishMessage"
               :disabled="isBroadcasting"
               type="text" placeholder="HEX/JSON/PLAIN-TEXT PAYLOAD..." 
               class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs font-mono text-blue-400 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all uppercase disabled:opacity-50"
             />
             <button @click="publishMessage" 
               :disabled="isBroadcasting"
               class="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 flex items-center justify-center transition-all shadow-lg shadow-blue-600/20 active:scale-95 group disabled:bg-zinc-800 disabled:shadow-none"
             >
                <Icon v-if="isBroadcasting" name="heroicons:arrow-path" class="text-lg animate-spin" />
                <Icon v-else name="heroicons:bolt-solid" class="text-lg group-hover:scale-125 transition-transform" />
             </button>
          </div>
       </div>

       <!-- TOPICS REGISTRY -->
       <div class="space-y-4 mb-10 relative z-10">
          <div class="flex items-center justify-between px-1">
             <div class="flex items-center gap-2 text-zinc-600">
                <Icon name="heroicons:hashtag" class="text-[10px]" />
                <span class="text-[9px] font-black uppercase tracking-[0.2em]">Topology</span>
             </div>
             <button @click="addTopic" class="text-[9px] font-black text-zinc-500 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-all">
                <Icon name="heroicons:plus-circle" class="text-xs" /> New Partition
             </button>
          </div>
          <div class="flex flex-wrap gap-4">
             <div v-for="topic in topics" :key="topic.id" 
                class="group flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all cursor-default shadow-lg relative pr-10"
                :class="getTechnicalStyle(topic.color)"
             >
                <span class="font-black text-xs uppercase tracking-tighter"># {{ topic.name }}</span>
                <div class="w-px h-4 bg-current opacity-20"></div>
                <div class="flex items-center gap-1.5">
                   <span class="text-[10px] font-black tabular-nums">{{ topic.subCount }}</span>
                   <Icon name="heroicons:cpu-chip" class="text-[10px] opacity-40 group-hover:rotate-180 transition-transform duration-1000" />
                </div>
                <!-- Delete Topic -->
                <button 
                  @click.stop="deleteTopic(topic.id)"
                  class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1"
                >
                   <Icon name="heroicons:trash" class="text-xs" />
                </button>
             </div>
          </div>
       </div>

       <!-- NETWORK NODES -->
       <div class="flex-1 flex flex-col min-h-0 relative z-10">
          <div class="flex items-center justify-between mb-5 px-1">
             <div class="flex items-center gap-2 text-zinc-600">
                <Icon name="heroicons:user-group" class="text-[10px]" />
                <span class="text-[9px] font-black uppercase tracking-[0.2em]">Consumer Nodes</span>
             </div>
             <button @click="addSubscriber" class="text-[9px] font-black text-zinc-500 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-all">
                <Icon name="heroicons:plus-circle" class="text-xs" /> Register Node
             </button>
          </div>
          
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-3">
             <div v-for="sub in subscribers" :key="sub.id" 
               class="group rounded-2xl border transition-all p-6 min-h-[240px] flex flex-col relative overflow-hidden"
               :class="[
                 sub.colorClass, 
                 sub.glowClass,
                 scanningNodeId === sub.id ? 'ring-4 ring-white/20 scale-[1.02] bg-white/10 translate-y-[-4px]' : '',
                 highlightingNodeIds.includes(sub.id) ? 'ring-4 ring-emerald-500/40 brightness-125 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''
               ]"
             >
                <!-- BROADCAST OVERLAY -->
                <div v-if="scanningNodeId === sub.id" class="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-20 flex items-center justify-center">
                   <div class="px-3 py-1 bg-white/20 rounded-full border border-white/40 flex items-center gap-2">
                      <div class="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                      <span class="text-[8px] font-black uppercase text-white tracking-widest">Scanning</span>
                   </div>
                </div>

                <!-- NODE HEADER -->
                <div class="flex items-center justify-between mb-4">
                   <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-white/5 border border-current flex items-center justify-center font-black text-xs text-white">
                         {{ sub.initial }}
                      </div>
                      <h4 class="font-black text-[11px] uppercase tracking-widest text-white">{{ sub.name }}</h4>
                   </div>
                   <div class="flex items-center gap-3">
                      <button 
                        @click="deleteSubscriber(sub.id)"
                        class="text-zinc-700 hover:text-red-500 transition-colors"
                        title="Decommission Node"
                      >
                         <Icon name="heroicons:trash" class="text-xs" />
                      </button>
                      <div :class="[sub.subscriptions.length > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-zinc-800', 'w-1.5 h-1.5 rounded-full ring-4 ring-black/20']"></div>
                   </div>
                </div>

                <!-- SUB CONTROL -->
                <div class="flex flex-wrap gap-1.5 mb-6">
                   <button v-for="topic in topics" :key="topic.id" 
                     @click="toggleSubscription(sub, topic.id)"
                     class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tight transition-all border group/btn shadow-inner"
                     :class="sub.subscriptions.includes(topic.id) ? 
                        'bg-white/10 text-white border-white/20' : 
                        'bg-transparent text-zinc-700 border-white/5 hover:border-white/10 hover:text-zinc-500'"
                   >
                      <Icon :name="sub.subscriptions.includes(topic.id) ? 'heroicons:signal-solid' : 'heroicons:signal-slash-solid'" 
                        :class="[sub.subscriptions.includes(topic.id) ? 'text-blue-400' : 'text-zinc-800', 'text-[10px]']" />
                      {{ topic.name }}
                   </button>
                </div>

                <!-- STREAM INGEST -->
                <div class="flex-1 bg-black/40 rounded-xl p-3 font-mono text-[9px] border border-white/5 overflow-y-auto custom-scrollbar-mini shadow-inner">
                   <div v-if="sub.messages.length === 0" class="h-full flex items-center justify-center italic text-[8px] text-zinc-800 uppercase tracking-widest">
                      Listening for frames...
                   </div>
                   <div v-else class="space-y-2">
                      <div v-for="msg in sub.messages" :key="msg.id" class="bg-white/[0.02] p-2 rounded border border-white/5 flex flex-col gap-1 group/msg hover:bg-white/5 transition-colors">
                         <div class="flex items-center justify-between opacity-30 group-hover/msg:opacity-60 transition-opacity">
                            <span class="text-[7px] font-black uppercase tracking-widest">CHUNK://{{ msg.topicId.toUpperCase() }}</span>
                            <span class="text-zinc-500 text-[6px]">{{ msg.timestamp }}</span>
                         </div>
                         <p class="text-zinc-400 leading-tight truncate">{{ msg.content }}</p>
                      </div>
                   </div>
                </div>
                
                <!-- AMBIENT ACCENT -->
                <div class="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity" :class="sub.colorClass"></div>
             </div>
          </div>
       </div>

    </div>

    <!-- RIGHT: ANALYTICS MESH (25%) -->
    <div class="lg:col-span-12 xl:col-span-3 flex flex-col bg-zinc-950 border-l border-white/5 p-8 h-full overflow-hidden shadow-2xl relative z-20">
       
       <!-- HUD STAT GRID -->
       <div class="grid grid-cols-2 gap-3 mb-8 shrink-0">
          <div v-for="stat in hardwareStats" :key="stat.label" class="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-start gap-2 group hover:bg-white/[0.05] transition-all">
             <Icon :name="stat.icon" :class="['text-xs', stat.color]" />
             <div>
                <p class="text-[7px] font-black text-zinc-600 uppercase leading-none mb-1 tracking-widest">{{ stat.label }}</p>
                <p class="text-[11px] font-black text-white tabular-nums tracking-tighter">{{ stat.value }}</p>
             </div>
          </div>
       </div>

       <!-- CONTROL LOG -->
       <div class="flex-1 flex flex-col min-h-0 mb-8 overflow-hidden">
          <div class="flex items-center justify-between px-1 mb-4">
             <h4 class="text-white font-black uppercase text-[10px] tracking-widest">Broker Mesh Log</h4>
             <div class="flex gap-1">
                <div class="w-1 h-1 rounded-full bg-blue-500 animate-ping"></div>
                <div class="w-1 h-1 rounded-full bg-emerald-500 animate-ping [animation-delay:200ms]"></div>
             </div>
          </div>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-5 overflow-y-auto custom-scrollbar font-mono text-[9px] shadow-inner relative">
             <div v-for="(log, i) in logs" :key="i" class="mb-3 flex gap-4 opacity-40 hover:opacity-100 transition-opacity border-l border-white/5 pl-3">
                <span class="text-zinc-800 shrink-0 select-none">[{{ new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) }}]</span>
                <span :class="log.includes('BROKER') ? 'text-blue-400' : log.includes('node') ? 'text-emerald-400' : 'text-zinc-600'">{{ log }}</span>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHT -->
       <div class="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4 shrink-0 mt-auto shadow-inner relative overflow-hidden group">
          <Icon name="heroicons:cpu-chip" class="text-blue-500 text-2xl shrink-0 group-hover:rotate-90 transition-transform duration-700" />
          <div class="relative z-10">
             <p class="text-[11px] font-black text-white uppercase tracking-tight mb-1">Fan-out Topology</p>
             <p class="text-[9px] text-zinc-600 leading-relaxed font-medium uppercase">Atomic delivery shards ensure message isolation and idempotent frame ingestion across nodes.</p>
          </div>
          <!-- DECORATIVE CIRCUIT -->
          <div class="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rotate-45 translate-x-8 -translate-y-8"></div>
       </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

.custom-scrollbar-mini::-webkit-scrollbar { width: 2px; }
.custom-scrollbar-mini::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar-mini::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }

@keyframes slide-in {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-in { animation: slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }

select option { background: #000 !important; color: #fff !important; }
</style>
