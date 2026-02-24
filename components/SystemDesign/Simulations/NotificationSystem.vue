<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  avatar: string
  color: string
  allowedChannels: ('Email' | 'SMS' | 'Push')[]
}

interface Notification {
  id: number
  channel: 'Email' | 'SMS' | 'Push'
  subject?: string
  content: string
  userId: string
  timestamp: string
  status: 'PENDING' | 'SENT' | 'FAILED'
}

const users: User[] = [
  { id: 'alice', name: 'Alice Johnson', avatar: 'A', color: 'bg-emerald-500', allowedChannels: ['Email', 'SMS', 'Push'] },
  { id: 'bob', name: 'Bob Smith', avatar: 'B', color: 'bg-blue-500', allowedChannels: ['Email'] }, // Email only
  { id: 'carol', name: 'Carol Williams', avatar: 'C', color: 'bg-purple-500', allowedChannels: ['Push'] }, // Push only
  { id: 'david', name: 'David Brown', avatar: 'D', color: 'bg-amber-500', allowedChannels: ['SMS', 'Push'] },
]

const channels = [
  { name: 'Email', icon: 'heroicons:envelope', activeColor: 'bg-blue-600' },
  { name: 'SMS', icon: 'heroicons:chat-bubble-left-ellipsis', activeColor: 'bg-emerald-600' },
  { name: 'Push', icon: 'heroicons:bell', activeColor: 'bg-amber-600' },
]

const selectedChannel = ref<'Email' | 'SMS' | 'Push'>('Email')
const selectedUserId = ref(users[0].id)
const viewUserId = ref(users[0].id)
const subject = ref('')
const message = ref('')
const isDispatching = ref(false)
const notifications = ref<Notification[]>([])
const logs = ref<string[]>(['Messaging Hub v1.0.4 active.', 'Ready to dispatch.'])
const lastDispatchTime = ref<Record<string, number>>({})

const smsCharLimit = 160
const messageCharCount = computed(() => message.value.length)
const isMessageTooLong = computed(() => selectedChannel.value === 'SMS' && messageCharCount.value > smsCharLimit)

const stats = computed(() => {
  const sent = notifications.value.filter(n => n.status === 'SENT').length
  const failed = notifications.value.filter(n => n.status === 'FAILED').length
  return [
    { label: 'Throughput', value: '42/min', icon: 'heroicons:bolt', color: 'text-amber-500' },
    { label: 'Latency', value: '1.2ms', icon: 'heroicons:clock', color: 'text-emerald-500' },
    { label: 'Success', value: `${sent > 0 ? 100 : 0}%`, icon: 'heroicons:check-circle', color: 'text-blue-500' },
    { label: 'Queue', value: isDispatching.value ? '1' : '0', icon: 'heroicons:queue-list', color: 'text-purple-500' },
  ]
})

const currentUserInbox = computed(() => 
  notifications.value.filter(n => n.userId === viewUserId.value)
)

async function sendNotification() {
  if (!message.value.trim() || isDispatching.value || isMessageTooLong.value) return

  const targetUser = users.find(u => u.id === selectedUserId.value)!
  
  // CORNER CASE 1: Rate Limiting (Cooldowm of 5s per user)
  const now = Date.now()
  if (lastDispatchTime.value[targetUser.id] && now - lastDispatchTime.value[targetUser.id] < 5000) {
    logs.value.unshift(`[REJECTED] Rate limit reached for ${targetUser.name}. Try again in 5s.`)
    return
  }

  // CORNER CASE 2: User Channel Preferences
  if (!targetUser.allowedChannels.includes(selectedChannel.value)) {
    logs.value.unshift(`[FAILED] User ${targetUser.name} has opted out of ${selectedChannel.value}.`)
    return
  }

  isDispatching.value = true
  lastDispatchTime.value[targetUser.id] = now
  
  logs.value.unshift(`[GATEWAY] Routing ${selectedChannel.value} payload for ${targetUser.name}...`)
  
  // Simulate network flight
  await new Promise(r => setTimeout(r, 1200))

  // CORNER CASE 3: Random Network Failure (10% chance)
  const isFailure = Math.random() < 0.1
  
  if (isFailure) {
    logs.value.unshift(`[FATAL] Provider timeout during ${selectedChannel.value} delivery to ${targetUser.name}.`)
  } else {
    const newNotify: Notification = {
      id: Date.now(),
      channel: selectedChannel.value,
      subject: selectedChannel.value === 'Email' ? (subject.value || '(NO SUBJECT)') : undefined,
      content: message.value,
      userId: selectedUserId.value,
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: 'SENT'
    }
    notifications.value.unshift(newNotify)
    logs.value.unshift(`[SUCCESS] ${selectedChannel.value} delivered to ${targetUser.name}. ACK received.`)
  }
  
  if (logs.value.length > 20) logs.value.pop()
  
  message.value = ''
  subject.value = ''
  isDispatching.value = false
}

function resetSimulation() {
  notifications.value = []
  logs.value = ['System reset.', 'Dispatchers re-initialized.']
  isDispatching.value = false
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#050505] rounded-xl border border-white/5 relative h-[850px] overflow-hidden shadow-2xl">
    
    <!-- LEFT: DISPATCH HUB (75%) -->
    <div class="lg:col-span-12 xl:col-span-9 p-10 bg-black/20 relative flex flex-col items-center">
       
       <!-- HEADER -->
       <div class="w-full max-w-[900px] mb-10 flex justify-between items-center px-4 shrink-0">
          <div>
             <h3 class="text-white font-black text-xl tracking-tighter uppercase leading-tight">Notification Engine</h3>
             <p class="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Multi-Channel Delivery Protocol</p>
          </div>
          <button @click="resetSimulation" class="w-10 h-10 hover:bg-white/5 flex items-center justify-center rounded-xl transition-all border border-transparent hover:border-white/10 group">
             <Icon name="heroicons:arrow-path" class="text-zinc-600 group-hover:text-white group-hover:rotate-180 transition-all duration-500 text-lg" />
          </button>
       </div>

       <!-- MAIN INTERFACE -->
       <div class="w-full max-w-[900px] flex-1 flex gap-8 min-h-0">
          
          <!-- SENDER PANEL -->
          <div class="flex-1 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 flex flex-col space-y-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
             <!-- Card Accent -->
             <div class="absolute top-0 left-0 right-0 h-1" :class="channels.find(c => c.name === selectedChannel)?.activeColor"></div>

             <div class="space-y-4">
                <div class="flex items-center gap-2 text-zinc-500 px-1">
                   <Icon name="heroicons:paper-airplane" class="text-[10px]" />
                   <span class="text-[9px] font-black uppercase tracking-[0.2em]">Send Notification</span>
                </div>

                <!-- CHANNEL SELECTOR -->
                <div class="grid grid-cols-3 gap-3">
                   <button v-for="channel in channels" :key="channel.name"
                      @click="selectedChannel = channel.name as any"
                      class="flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 group relative overflow-hidden"
                      :class="[
                        selectedChannel === channel.name 
                        ? `${channel.activeColor} border-transparent text-white shadow-xl` 
                        : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:text-white'
                      ]"
                   >
                      <Icon :name="channel.icon" class="text-xl group-hover:scale-110 transition-transform" />
                      <span class="text-[10px] font-black uppercase tracking-widest">{{ channel.name }}</span>
                   </button>
                </div>
             </div>

             <!-- FORM -->
             <div class="space-y-6 flex-1 min-h-0">
                <div class="space-y-2">
                   <label class="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Recipient Node</label>
                   <select v-model="selectedUserId" class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-zinc-500/20 appearance-none cursor-pointer">
                      <option v-for="user in users" :key="user.id" :value="user.id" class="bg-zinc-900 border-none">{{ user.name }}</option>
                   </select>
                </div>

                <div v-if="selectedChannel === 'Email'" class="space-y-2 animate-slide-in">
                   <label class="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-1">Subject</label>
                   <input v-model="subject" type="text" placeholder="ENTER SUBJECT..." class="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-blue-400 placeholder:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase" />
                </div>

                <div class="space-y-2">
                   <div class="flex justify-between items-center px-1">
                      <label class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Payload / Message</label>
                      <span v-if="selectedChannel === 'SMS'" 
                            class="text-[8px] font-bold" 
                            :class="isMessageTooLong ? 'text-red-500 animate-pulse' : 'text-zinc-600'"
                      >
                         {{ messageCharCount }}/{{ smsCharLimit }}
                      </span>
                   </div>
                   <textarea v-model="message" placeholder="TYPE SYSTEM MESSAGE..." 
                     class="w-full h-32 bg-white/5 border rounded-2xl px-5 py-4 text-xs font-mono placeholder:text-zinc-800 focus:outline-none focus:ring-2 uppercase resize-none custom-scrollbar transition-all"
                     :class="[
                        isMessageTooLong ? 'border-red-500/50 text-red-400 focus:ring-red-500/20' : 'border-white/10 text-emerald-400 focus:ring-emerald-500/20'
                     ]"
                   ></textarea>
                </div>
             </div>

             <!-- DISPATCH BUTTON -->
             <button @click="sendNotification" 
               :disabled="!message.trim() || isDispatching || isMessageTooLong"
               class="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-2xl relative overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed"
               :class="channels.find(c => c.name === selectedChannel)?.activeColor"
             >
                <div v-if="isDispatching" class="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                   <div class="h-full bg-white animate-progress"></div>
                </div>
                <template v-if="isDispatching">
                   <Icon name="heroicons:arrow-path" class="text-xl animate-spin" />
                   Dispatching...
                </template>
                <template v-else>
                   <Icon name="heroicons:paper-airplane" class="text-xl group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                   Push Notification
                </template>
             </button>
          </div>

          <!-- INBOX PANEL -->
          <div class="flex-1 bg-zinc-900/40 border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl transition-all"
               :class="isDispatching ? 'scale-[0.98]' : ''"
          >
             <!-- INBOX HEADER -->
             <div class="bg-indigo-600 p-6 flex flex-col gap-4">
                <div class="flex items-center justify-between">
                   <div class="flex items-center gap-3">
                      <Icon name="heroicons:inbox-stack" class="text-white text-xl" />
                      <h4 class="text-white font-black uppercase text-xs tracking-widest">Inbox System</h4>
                   </div>
                   <div class="flex items-center gap-2">
                      <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span class="text-[8px] font-black text-white/60 uppercase tracking-widest">Live Node</span>
                   </div>
                </div>

                <!-- USER SWITCHER DROPDOWN -->
                <div class="relative">
                   <select v-model="viewUserId" 
                     class="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 text-[10px] font-black text-white focus:outline-none appearance-none cursor-pointer transition-all uppercase tracking-widest"
                   >
                      <option v-for="user in users" :key="user.id" :value="user.id" class="bg-zinc-900">
                         VIEWING: {{ user.name }}
                      </option>
                   </select>
                   <Icon name="heroicons:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-[10px] pointer-events-none" />
                </div>
             </div>

             <!-- INBOX CONTENT -->
             <div class="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                <div v-if="currentUserInbox.length === 0 && !isDispatching" class="flex-1 flex flex-col items-center justify-center opacity-10 gap-4">
                   <Icon name="heroicons:chat-bubble-bottom-center-text" class="text-7xl" />
                   <p class="font-black uppercase tracking-[0.4em] text-sm">Waiting for incoming data</p>
                </div>

                <!-- NOTIFICATION CARD -->
                <TransitionGroup name="list">
                   <div v-for="notify in currentUserInbox" :key="notify.id" 
                     class="bg-white/5 border border-white/5 rounded-2xl p-5 flex gap-4 hover:bg-white/[0.08] transition-all group animate-slide-in cursor-default"
                   >
                      <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                         <Icon :name="channels.find(c => c.name === notify.channel)?.icon || ''" class="text-indigo-500 text-lg" />
                      </div>
                      <div class="flex-1 min-w-0">
                         <div class="flex justify-between items-start mb-1">
                            <span class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{{ notify.channel }}</span>
                            <span class="text-[8px] font-black text-zinc-600 uppercase">{{ notify.timestamp }}</span>
                         </div>
                         <h5 v-if="notify.subject" class="text-white font-black text-[11px] uppercase tracking-tight mb-1 truncate">{{ notify.subject }}</h5>
                         <p class="text-[10px] text-zinc-500 leading-relaxed font-medium line-clamp-2 uppercase group-hover:text-zinc-300 transition-colors">{{ notify.content }}</p>
                      </div>
                      <div class="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 animate-pulse"></div>
                   </div>
                </TransitionGroup>

                <!-- DISPATCHING ANIMATION -->
                <div v-if="isDispatching" class="p-6 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 opacity-30 animate-pulse bg-white/[0.02]">
                   <Icon name="heroicons:radio" class="text-3xl" />
                   <span class="text-[9px] font-black uppercase tracking-[0.4em]">Intercepting Stream...</span>
                </div>
             </div>

             <!-- DECORATIVE PHONE BASE -->
             <div class="h-8 bg-zinc-950 flex items-center justify-center shrink-0 border-t border-white/5">
                <div class="w-12 h-1 bg-white/10 rounded-full"></div>
             </div>
          </div>
       </div>

    </div>

    <!-- RIGHT: ANALYTICS HUB (25%) -->
    <div class="lg:col-span-12 xl:col-span-3 border-l-4 border-black bg-zinc-950 p-8 flex flex-col h-full overflow-hidden relative z-20">
       
       <!-- HUD STAT GRID -->
       <div class="grid grid-cols-2 gap-3 mb-8 shrink-0">
          <div v-for="stat in stats" :key="stat.label" class="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col items-start gap-2 group hover:bg-white/[0.05] transition-all">
             <Icon :name="stat.icon" :class="['text-xs', stat.color]" />
             <div>
                <p class="text-[7px] font-black text-zinc-600 uppercase leading-none mb-1 tracking-widest">{{ stat.label }}</p>
                <p class="text-[11px] font-black text-white tabular-nums tracking-tighter">{{ stat.value }}</p>
             </div>
          </div>
       </div>

       <!-- DISPATCHER LOG -->
       <div class="flex-1 flex flex-col min-h-0 mb-8 overflow-hidden">
          <div class="flex items-center justify-between px-1 mb-4">
             <h4 class="text-white font-black uppercase text-[10px] tracking-widest">Gateway Log</h4>
             <div class="flex gap-1">
                <div class="w-1 h-1 rounded-full bg-blue-500 animate-ping"></div>
                <div class="w-1 h-1 rounded-full bg-emerald-500 animate-ping [animation-delay:200ms]"></div>
             </div>
          </div>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-5 overflow-y-auto custom-scrollbar font-mono text-[9px] shadow-inner border-l-2 border-l-blue-900/50">
             <div v-for="(log, i) in logs" :key="i" class="mb-3 flex gap-4 opacity-40 hover:opacity-100 transition-opacity border-l border-white/5 pl-3">
                <span class="text-zinc-800 shrink-0 select-none">[{{ new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) }}]</span>
                <span :class="[
                  log.includes('SUCCESS') ? 'text-emerald-400' : 
                  log.includes('GATEWAY') ? 'text-blue-400' : 
                  log.includes('REJECTED') || log.includes('FAILED') || log.includes('FATAL') ? 'text-red-400 font-bold' : 
                  'text-zinc-600'
                ]">{{ log }}</span>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHT -->
       <div class="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4 shrink-0 mt-auto shadow-inner relative overflow-hidden group">
          <Icon name="heroicons:cpu-chip" class="text-blue-500 text-2xl shrink-0 group-hover:rotate-90 transition-transform duration-700" />
          <div class="relative z-10">
             <p class="text-[11px] font-black text-white uppercase tracking-tight mb-1">Retry Polling</p>
             <p class="text-[9px] text-zinc-600 leading-relaxed font-medium uppercase">Exponential backoff strategy handles provider downtime with 99.9% at-least-once delivery.</p>
          </div>
          <!-- DECORATIVE DECOR -->
          <div class="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rotate-45 translate-x-8 -translate-y-8"></div>
       </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

@keyframes slide-in {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-in { animation: slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }

@keyframes progress {
  0% { width: 0; }
  100% { width: 100%; }
}
.animate-progress { animation: progress 1.2s linear forwards; }

.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from { opacity: 0; transform: translateX(30px); }
.list-leave-to { opacity: 0; transform: translateX(-30px); }

select option { background: #000 !important; color: #fff !important; }
</style>
