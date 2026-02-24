<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'

interface User {
  id: string
  name: string
  avatar: string
  online: boolean
  lastSeen?: string
  lastMessage?: string
  time?: string
  typing: boolean
  unread: number
}

interface Message {
  senderId: string
  text: string
  timestamp: string
  status: 'SENT' | 'DELIVERED' | 'READ'
  liked?: boolean
}

const currentUser = { id: 'me', name: 'Rahul Aher' }
const searchQuery = ref('')
const selectedUserId = ref('john')
const logs = ref<string[]>(['WebSocket cluster synchronized.', 'Push Notification shard active.'])
const messageContainer = ref<HTMLElement | null>(null)

const users = ref<User[]>([
  { id: 'john', name: 'John Doe', avatar: 'JD', online: true, lastMessage: 'See you there! Let me know if you reach.', time: '12:45 PM', typing: false, unread: 0 },
  { id: 'alice', name: 'Alice Smith', avatar: 'AS', online: false, lastSeen: '2m ago', lastMessage: 'Does it handle backpressure?', time: '11:20 AM', typing: false, unread: 2 },
  { id: 'bob', name: 'Bob Wilson', avatar: 'BW', online: true, lastMessage: 'WebSocket is stable now.', time: 'Monday', typing: true, unread: 0 },
  { id: 'charlie', name: 'Charlie Day', avatar: 'CD', online: false, lastSeen: '1h ago', lastMessage: 'Check the LLD again.', time: 'Sunday', typing: false, unread: 0 },
])

const messagesMap = ref<Record<string, Message[]>>({
  john: [
    { senderId: 'john', text: 'Hey, did you finish the LLD for the system?', timestamp: '12:01 PM', status: 'READ' },
    { senderId: 'me', text: 'Almost! Just working on the connection pool simulation.', timestamp: '12:05 PM', status: 'READ' },
    { senderId: 'john', text: 'See you there! Let me know if you reach.', timestamp: '12:10 PM', status: 'READ' },
  ],
  alice: [
    { senderId: 'alice', text: 'Does it handle backpressure?', timestamp: '11:20 AM', status: 'READ' },
  ]
})

const currentMessages = computed(() => messagesMap.value[selectedUserId.value] || [])
const activeUser = computed(() => users.value.find(u => u.id === selectedUserId.value))
const filteredUsers = computed(() => users.value.filter(u => u.name.toLowerCase().includes(searchQuery.value.toLowerCase())))

const newMessageText = ref('')

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTo({
      top: messageContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

// Watchers for scrolling
watch(currentMessages, () => { scrollToBottom() }, { deep: true })
watch(selectedUserId, () => { scrollToBottom() })
watch(() => activeUser.value?.typing, (isTyping) => {
  if (isTyping) scrollToBottom()
})

function sendMessage() {
  if (!newMessageText.value.trim()) return
  
  if (!messagesMap.value[selectedUserId.value]) {
    messagesMap.value[selectedUserId.value] = []
  }
  
  const msg: Message = {
    senderId: 'me',
    text: newMessageText.value,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'SENT'
  }
  
  messagesMap.value[selectedUserId.value].push(msg)
  logs.value.unshift(`WS_PUB: Outgoing payload to client ${selectedUserId.value}`)
  const text = newMessageText.value
  newMessageText.value = ''
  
  setTimeout(() => {
    msg.status = 'DELIVERED'
    if (activeUser.value) {
      activeUser.value.typing = true
      setTimeout(() => {
        if (activeUser.value) {
          activeUser.value.typing = false
          const reply: Message = {
            senderId: selectedUserId.value,
            text: `Re: ${text}. That sounds efficient. Let's sync the Kafka logs.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'READ'
          }
          messagesMap.value[selectedUserId.value].push(reply)
          logs.value.unshift(`WS_SUB: Incoming payload from peer ${selectedUserId.value}`)
          activeUser.value.lastMessage = reply.text
          activeUser.value.time = reply.timestamp
        }
      }, 2000)
    }
  }, 1000)
}

function handleDoubleClick(index: number) {
  const msg = currentMessages.value[index]
  msg.liked = !msg.liked
}

function selectUser(id: string) {
  selectedUserId.value = id
  if (activeUser.value) activeUser.value.unread = 0
}

const systemStats = [
  { label: 'Latency', value: '22ms', icon: 'heroicons:bolt', color: 'text-blue-500' },
  { label: 'Uptime', value: '99.9%', icon: 'heroicons:arrow-path', color: 'text-emerald-500' },
  { label: 'WS Conn', value: '1,242', icon: 'heroicons:cpu-chip', color: 'text-purple-500' },
  { label: 'SLA Status', value: 'Optimal', icon: 'heroicons:shield-check', color: 'text-blue-500' }
]

const insights = [
  { title: 'WebSocket Cluster', desc: 'Managed via sticky sessions and shared Redis state.' },
  { title: 'Message Latency', desc: 'Fan-out logic ensures <50ms delivery to online peers.' },
  { title: 'Binary Protocols', desc: 'Protobuf used for mobile bandwidth efficiency.' }
]

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden h-[700px]">
    
    <!-- LEFT: USER LIST -->
    <div class="lg:col-span-3 border-r border-white/5 flex flex-col bg-zinc-900/40 h-full overflow-hidden">
       <div class="p-6 border-b border-white/5 shrink-0">
          <h4 class="text-white font-black uppercase tracking-tighter text-xs mb-4">Peer Network</h4>
          <div class="relative">
             <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
             <input v-model="searchQuery" placeholder="Search peers..." class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-[10px] font-black text-white focus:outline-none focus:border-blue-500/50 uppercase" />
          </div>
       </div>
       <div class="flex-1 overflow-y-auto custom-scrollbar">
          <button v-for="user in filteredUsers" :key="user.id" @click="selectUser(user.id)" 
            :class="['w-full flex items-center gap-4 p-5 transition-all text-left border-b border-white/[0.02]', selectedUserId === user.id ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : '']">
             <div class="relative shrink-0">
                <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400 border border-white/5 uppercase">{{ user.avatar }}</div>
                <div v-if="user.online" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full"></div>
             </div>
             <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-0.5">
                   <h5 class="text-[10px] font-black text-white uppercase">{{ user.name }}</h5>
                   <span class="text-[8px] font-bold text-zinc-600">{{ user.time }}</span>
                </div>
                <p class="text-[9px] font-bold text-zinc-500 truncate uppercase">
                   <span v-if="user.typing" class="text-blue-500 animate-pulse">Typing...</span>
                   <span v-else>{{ user.lastMessage }}</span>
                </p>
             </div>
          </button>
       </div>
    </div>

    <!-- MIDDLE: CONVERSATION -->
    <div class="lg:col-span-6 flex flex-col bg-black/40 h-full overflow-hidden">
       <!-- Conversation Header -->
       <div v-if="activeUser" class="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/20 shrink-0">
          <div class="flex items-center gap-3">
             <div class="w-2 h-2 rounded-full" :class="activeUser.online ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'"></div>
             <h4 class="text-[10px] font-black text-white uppercase tracking-widest">{{ activeUser.name }}</h4>
          </div>
          <div class="flex gap-4">
             <Icon name="heroicons:phone" class="text-zinc-500 text-sm cursor-pointer hover:text-white" />
             <Icon name="heroicons:video-camera" class="text-zinc-500 text-sm cursor-pointer hover:text-white" />
          </div>
       </div>

       <!-- Message Area (Scrollable) -->
       <div ref="messageContainer" class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <div v-for="(msg, i) in currentMessages" :key="i" :class="['flex flex-col', msg.senderId === 'me' ? 'items-end' : 'items-start']">
             <div class="relative max-w-[85%]">
                <div @dblclick="handleDoubleClick(i)" :class="['px-4 py-2.5 rounded-2xl text-[11px] font-bold transition-all select-none', msg.senderId === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-none']">
                   {{ msg.text }}
                </div>
                <transition name="pop"><Icon v-if="msg.liked" name="heroicons:heart-solid" class="absolute -bottom-2 -left-2 text-xs text-red-500 bg-black rounded-full shadow-lg shadow-red-500/20" /></transition>
             </div>
             <div class="flex items-center gap-2 mt-1 px-1">
                <span class="text-[8px] font-bold text-zinc-600 uppercase">{{ msg.timestamp }}</span>
                <div v-if="msg.senderId === 'me'" class="flex -space-x-1">
                   <Icon name="heroicons:check" :class="['text-[10px]', msg.status === 'READ' ? 'text-blue-500' : 'text-zinc-700']" />
                   <Icon v-if="msg.status !== 'SENT'" name="heroicons:check" :class="['text-[10px]', msg.status === 'READ' ? 'text-blue-500' : 'text-zinc-700']" />
                </div>
             </div>
          </div>
          
          <!-- Typing Indicator in flow -->
          <div v-if="activeUser?.typing" class="flex flex-col items-start pt-2">
             <div class="px-5 py-2.5 bg-zinc-900/50 border border-white/5 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span class="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span class="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span class="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
             </div>
             <p class="text-[8px] font-black text-blue-500/60 uppercase tracking-widest mt-1 px-1">Encrypted Shard Incoming...</p>
          </div>
       </div>

       <!-- Input Bar (Pinned) -->
       <div class="p-6 border-t border-white/5 bg-zinc-950/80 shrink-0">
          <div class="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-1 border border-white/5 shadow-inner transition-all focus-within:border-blue-500/30">
             <Icon name="heroicons:face-smile" class="text-zinc-500 cursor-pointer hover:text-white transition-colors" />
             <input v-model="newMessageText" @keyup.enter="sendMessage" placeholder="Broadcast Message to Peer..." class="flex-1 bg-transparent border-none py-4 text-[10px] font-black text-white focus:outline-none uppercase placeholder:text-zinc-700" />
             <button @click="sendMessage" :disabled="!newMessageText.trim()" class="text-blue-500 hover:text-blue-400 transition-all disabled:opacity-20 active:scale-90 flex items-center justify-center">
                <Icon name="heroicons:paper-airplane" class="text-xl" />
             </button>
          </div>
       </div>
    </div>

    <!-- RIGHT: ANALYTICS -->
    <div class="lg:col-span-3 border-l border-white/5 flex flex-col p-8 space-y-6 bg-zinc-900/40 h-full overflow-y-auto custom-scrollbar">
       <!-- Hardware Stats -->
       <div class="grid grid-cols-2 gap-3 shrink-0">
          <div v-for="stat in systemStats" :key="stat.label" class="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center gap-3 transition-colors hover:border-white/10">
             <div class="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center border border-white/5">
                <Icon :name="stat.icon" :class="['text-[10px]', stat.color]" />
             </div>
             <div>
                <p class="text-[8px] font-black text-zinc-600 uppercase leading-none mb-1">{{ stat.label }}</p>
                <p class="text-[10px] font-black text-white tabular-nums">{{ stat.value }}</p>
             </div>
          </div>
       </div>

       <!-- Event Stream -->
       <div class="flex-1 flex flex-col min-h-[250px] overflow-hidden">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[8px] mb-3 flex items-center justify-between shrink-0">
             Event stream
             <p class="text-[7px] font-mono opacity-30">PID 7741 // REALTIME</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-y-auto custom-scrollbar shadow-inner">
             <div class="space-y-2">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-2 text-zinc-600">
                   <span class="opacity-20">>></span>
                   <span :class="log.includes('SUB') ? 'text-emerald-500/60' : log.includes('PUB') ? 'text-blue-500/60' : ''">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- System Insights -->
       <div class="space-y-3 shrink-0">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900 border border-white/5 rounded-xl transition-all hover:bg-zinc-800">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 shadow-lg">
                <Icon name="heroicons:cpu-chip" class="text-red-500 text-xs" />
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
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }

.pop-enter-active { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
</style>
