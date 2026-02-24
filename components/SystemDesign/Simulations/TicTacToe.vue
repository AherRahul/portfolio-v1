<script setup lang="ts">
const board = ref(Array(9).fill(null))
const currentPlayer = ref<'X' | 'O'>('X')
const winner = ref<'X' | 'O' | 'Draw' | null>(null)
const winningLine = ref<number[] | null>(null)
const logs = ref<string[]>(['Game Engine Standby.', 'Waiting for Player X auth.'])

const scores = ref({ X: 0, O: 0, Draw: 0 })
const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]

const systemStats = [
  { label: 'State Sync', value: 'Active', icon: 'heroicons:arrow-path', color: 'text-blue-500' },
  { label: 'Decision Latency', value: '18ms', icon: 'heroicons:bolt', color: 'text-emerald-500' },
  { label: 'Cluster Load', value: 'Low', icon: 'heroicons:cpu-chip', color: 'text-red-500' },
  { label: 'Entropy Pool', value: '94.2%', icon: 'heroicons:command-line', color: 'text-purple-500' }
]

function makeMove(index: number) {
  if (board.value[index] || winner.value) return
  board.value[index] = currentPlayer.value
  logs.value.unshift(`EVENT: Player ${currentPlayer.value} move at index ${index}`)

  const win = checkWinner()
  if (win) {
    winner.value = currentPlayer.value
    winningLine.value = win
    scores.value[currentPlayer.value]++
    logs.value.unshift(`SYSTEM: Win condition detected for sharding node ${currentPlayer.value}`)
    triggerCelebration()
  } else if (board.value.every(cell => cell)) {
    winner.value = 'Draw'
    scores.value.Draw++
    logs.value.unshift(`SYSTEM: Deadlock detected. Tie.`)
  } else {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X'
  }
}

function checkWinner() {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    if (board.value[a] && board.value[a] === board.value[b] && board.value[a] === board.value[c]) return line
  }
  return null
}

function resetGame() {
  board.value = Array(9).fill(null)
  currentPlayer.value = 'X'
  winner.value = null
  winningLine.value = null
  isCelebrating.value = false
  logs.value.unshift('RESET: Shard re-hydrated.')
}

const isCelebrating = ref(false)
function triggerCelebration() { isCelebrating.value = true }

const getLineStyle = computed(() => {
  if (!winningLine.value) return {}
  const [a, , c] = winningLine.value
  const positions = [{x:16.6,y:16.6},{x:50,y:16.6},{x:83.3,y:16.6},{x:16.6,y:50},{x:50,y:50},{x:83.3,y:50},{x:16.6,y:83.3},{x:50,y:83.3},{x:83.3,y:83.3}]
  const start = positions[a]; const end = positions[c]
  const dx = end.x - start.x; const dy = end.y - start.y
  const distance = Math.sqrt(dx*dx + dy*dy)
  const angle = Math.atan2(dy, dx) * (180/Math.PI)
  return { width: `${distance}%`, left: `${start.x}%`, top: `${start.y}%`, transform: `rotate(${angle}deg)`, transformOrigin: '0 50%' }
})

const insights = [
  { title: 'State Pattern', desc: 'Transitions managed via a centralized finite state machine to prevent board collisions.' },
  { title: 'Winning Strategy', desc: 'O(1) win detection achieved via scanning pre-computed adjacency matrices of win lines.' },
  { title: 'Game Theory', desc: 'Tic Tac Toe is a zero-sum game where perfect play by both nodes results in a terminal deadlock.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-full">
    <div v-if="isCelebrating" class="absolute inset-0 pointer-events-none z-50 overflow-hidden">
       <div v-for="i in 30" :key="i" class="confetti" :style="{ left: Math.random()*100+'%', backgroundColor: ['#ef4444','#3b82f6','#10b981'][i%3], animationDelay: Math.random()*2+'s' }"></div>
    </div>

    <!-- LEFT: GAME BOARD (Takes 7 cols) -->
    <div class="lg:col-span-7 p-8 bg-black/20 flex flex-col items-center justify-start relative min-h-[550px] lg:h-auto">
       <!-- Local Header -->
       <div class="w-full flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <Icon name="heroicons:view-columns" class="text-xl" />
             </div>
             <div>
                <h4 class="text-white font-black uppercase tracking-tighter text-sm">Tic Tac Toe Shard</h4>
                <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Distributed Node Grid</p>
             </div>
          </div>
          <div class="flex items-center gap-3">
             <div class="flex gap-2">
                <div v-for="p in (['X', 'O', 'Draw'] as const)" :key="p" class="bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg text-center min-w-[50px]">
                   <p class="text-[6px] font-black text-zinc-600 uppercase mb-0.5">{{ p }}</p>
                   <p class="text-[10px] font-black text-white tabular-nums">{{ scores[p] }}</p>
                </div>
             </div>
             <button @click="resetGame" class="p-2.5 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-black/20">
                <Icon name="heroicons:arrow-path" class="text-lg" />
             </button>
          </div>
       </div>

       <!-- TURN / WIN INDICATOR (Pinned to top-center area) -->
       <div class="mb-10 w-full flex justify-center">
          <transition name="pop" mode="out-in">
             <div v-if="winner" class="flex flex-col items-center gap-4 py-6 px-12 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.05)] w-full max-w-[400px]">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <Icon :name="winner === 'Draw' ? 'heroicons:no-symbol' : 'heroicons:trophy'" class="text-xl" />
                   </div>
                   <div class="text-left">
                      <h5 class="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1">{{ winner === 'Draw' ? 'IO DEADLOCK' : 'NODE ' + winner + ' TRIUMPHED' }}</h5>
                      <p class="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Execution Complete</p>
                   </div>
                </div>
                <button @click="resetGame" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                   Start New Run
                </button>
             </div>
             <div v-else class="flex items-center gap-4 py-4 px-8 bg-zinc-900 border border-white/5 rounded-2xl shadow-lg w-full max-w-[300px] justify-center">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-all', currentPlayer === 'X' ? 'bg-red-600 text-white shadow-red-500/20 shadow-lg' : 'bg-blue-600 text-white shadow-blue-500/20 shadow-lg']">
                   <span class="font-black">{{ currentPlayer }}</span>
                </div>
                <div class="text-left flex flex-col justify-center">
                   <p class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Active Thread</p>
                   <h5 class="text-xs font-black text-white uppercase tracking-widest leading-none">Node {{ currentPlayer }} Turn</h5>
                </div>
             </div>
          </transition>
       </div>

       <!-- THE BOARD -->
       <div class="relative w-full max-w-[340px] aspect-square transition-transform hover:scale-[1.01] mb-auto">
          <div class="grid grid-cols-3 gap-3 bg-zinc-900 p-3 rounded-3xl border border-white/5 shadow-2xl relative z-10">
             <button v-for="(cell, i) in board" :key="i" @click="makeMove(i)" :disabled="cell || winner"
                class="aspect-square bg-black rounded-2xl flex items-center justify-center text-4xl font-black transition-all border border-white/0 hover:border-white/10 active:scale-95 group relative overflow-hidden"
                :class="cell === 'X' ? 'text-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]' : 'text-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]'">
                <div v-if="!cell && !winner" class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {{ cell }}
             </button>
          </div>
          <!-- WIN LINE STROKE -->
          <div v-if="winningLine" class="absolute h-1.5 bg-emerald-500 rounded-full z-20 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-700 pointer-events-none" :style="getLineStyle"></div>
       </div>

    </div>

    <!-- RIGHT: ANALYTICS (Takes 5 cols) -->
    <div class="lg:col-span-12 xl:col-span-5 flex flex-col border-l border-white/5 bg-zinc-900/40 p-8 space-y-6">
       
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
       <div class="flex-1 flex flex-col min-h-[250px]">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[8px] mb-3 flex items-center justify-between">
             Kernel Log Stream
             <p class="text-[7px] font-mono opacity-30">PID 8821 // REALTIME</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3 text-zinc-600">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span class="opacity-40">>></span>
                   <span :class="log.includes('Win') ? 'text-emerald-400' : log.includes('move') ? 'text-zinc-300' : ''">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- INSIGHTS -->
       <div class="space-y-3">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                <Icon name="heroicons:sparkles" class="text-red-500 text-sm" />
             </div>
             <div>
                <p class="text-[10px] font-black text-white uppercase tracking-tight mb-1">{{ ins.title }}</p>
                <p class="text-[8px] text-zinc-500 leading-relaxed font-bold uppercase">{{ ins.desc }}</p>
             </div>
          </div>
       </div>

       <!-- SYSTEM ACTIONS -->
       <button @click="resetGame" class="w-full py-4 bg-red-600/5 hover:bg-red-600/10 border border-red-500/20 text-red-500 font-black text-[9px] uppercase tracking-[0.3em] rounded-xl transition-all active:scale-95 shadow-inner">
          EMERGENCY_SYSTEM_RESET
       </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.confetti { position: absolute; width: 6px; height: 6px; top: -10px; opacity: 0; animation: fall 3s linear infinite; }
@keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

.pop-enter-active { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { animation: pop-in 0.4s reverse cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
</style>
