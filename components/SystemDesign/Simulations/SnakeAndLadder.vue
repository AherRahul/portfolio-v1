<script setup lang="ts">
interface Player {
  id: number
  name: string
  color: string
  borderColor: string
  position: number // 1 to 100
  totalRolls: number
  maxJump: number
  snakesHit: number
  laddersClimbed: number
}

const players = ref<Player[]>([
  { id: 1, name: 'ALPHA_NODE', color: 'bg-red-500', borderColor: 'border-red-500', position: 1, totalRolls: 0, maxJump: 0, snakesHit: 0, laddersClimbed: 0 },
  { id: 2, name: 'BETA_NODE', color: 'bg-blue-500', borderColor: 'border-blue-500', position: 1, totalRolls: 0, maxJump: 0, snakesHit: 0, laddersClimbed: 0 }
])

const currentPlayerIndex = ref(0)
const diceValue = ref(1)
const isRolling = ref(false)
const winner = ref<Player | null>(null)
const logMessage = ref('SYSTEM_READY')
const logs = ref<string[]>(['Game kernel cluster active.', 'Entropy source: Hardware Random Generator.'])

const currentActivePlayer = computed(() => players.value[currentPlayerIndex.value])

const SNAKES: Record<number, number> = {
  17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78
}

const LADDERS: Record<number, number> = {
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 51: 67, 71: 91, 80: 100
}

function getCoords(n: number) {
  const row = Math.floor((n - 1) / 10)
  const colInRow = (n - 1) % 10
  const col = row % 2 === 0 ? colInRow : 9 - colInRow
  return {
    x: col * 10 + 5,
    y: (9 - row) * 10 + 5
  }
}

function rollDice() {
  if (winner.value || isRolling.value) return
  
  isRolling.value = true
  logMessage.value = 'GENERATING_ENTROPY'
  const rollInterval = setInterval(() => {
    diceValue.value = Math.floor(Math.random() * 6) + 1
  }, 100)

  setTimeout(() => {
    clearInterval(rollInterval)
    const roll = Math.floor(Math.random() * 6) + 1
    diceValue.value = roll
    isRolling.value = false
    movePlayer(roll)
  }, 800)
}

function movePlayer(roll: number) {
  const player = players.value[currentPlayerIndex.value]
  player.totalRolls++
  let newPos = player.position + roll

  if (newPos > 100) {
    logMessage.value = 'OUT_OF_BOUNDS'
    logs.value.unshift(`REQ: ${player.name} +${roll} would exceed limit. Hold at ${player.position}.`)
    nextTurn()
    return
  }

  logMessage.value = `EXECUTING_MV_${roll}`
  logs.value.unshift(`BUS: [${player.name}] jumping to address ${newPos}.`)
  player.position = newPos

  setTimeout(() => {
    if (SNAKES[newPos]) {
      const dist = newPos - SNAKES[newPos]
      player.position = SNAKES[newPos]
      player.snakesHit++
      logMessage.value = 'COLLISION_DETECTED'
      logs.value.unshift(`ALARM: Snake at ${newPos}. Downward jump: -${dist}.`)
    } else if (LADDERS[newPos]) {
      const dist = LADDERS[newPos] - newPos
      if (dist > player.maxJump) player.maxJump = dist
      player.position = LADDERS[newPos]
      player.laddersClimbed++
      logMessage.value = 'BOOST_SIGNAL_READY'
      logs.value.unshift(`SIGNAL: Ladder at ${newPos}. Upward jump: +${dist}.`)
    }

    if (player.position === 100) {
      winner.value = player
      logMessage.value = 'TARGET_LOCKED'
      logs.value.unshift(`SYSTEM: ${player.name} reached termination point.`)
    } else {
      nextTurn()
    }
  }, 400)
}

function nextTurn() {
  currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length
}

function resetGame() {
  players.value.forEach(p => {
    p.position = 1
    p.totalRolls = 0
    p.maxJump = 0
    p.snakesHit = 0
    p.laddersClimbed = 0
  })
  currentPlayerIndex.value = 0
  diceValue.value = 1
  winner.value = null
  isRolling.value = false
  logMessage.value = 'REBOOT_SUCCESS'
  logs.value = ['Memory shards re-aligned.', 'Initial state (0x01) restored.']
}

const boardNumbers = computed(() => {
  const res = []
  for (let r = 9; r >= 0; r--) {
    const row = []
    for (let c = 0; c < 10; c++) { row.push(r * 10 + c + 1) }
    if (r % 2 === 1) row.reverse()
    res.push(...row)
  }
  return res
})

const insights = [
  { title: 'Directed Graph Flow', desc: 'Board modeled as a DAG (Directed Acyclic Graph) with shortcut edges for ladders and back-edges for snakes.' },
  { title: 'Probability & Bias', desc: 'Uniform distribution of dice ensures no bias across long-running player sharding.' },
  { title: 'Concurrency Control', desc: 'Atomic turn transitions prevent state collision in multi-player execution clusters.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-1xl border border-white/5 relative h-full min-h-[750px] overflow-hidden">
    
    <!-- LEFT: THE VISUAL SHARD -->
    <div class="lg:col-span-7 p-8 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden">
       <!-- Local Header -->
       <div class="w-full flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <Icon name="heroicons:view-columns" class="text-xl" />
             </div>
             <div>
                <h4 class="text-white font-black uppercase tracking-tighter text-sm">Game Processor Shard</h4>
                <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Board Segment 01-100</p>
             </div>
          </div>
          <div class="flex items-center gap-3">
             <div class="text-right mr-4">
                <p class="text-[8px] font-black text-zinc-600 uppercase mb-0.5">Global Status</p>
                <div class="flex items-center gap-2">
                   <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span class="text-[10px] font-black text-emerald-500 uppercase">Synced</span>
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
             <div v-if="winner" 
                class="flex flex-col items-center gap-4 py-6 px-12 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.05)] w-full max-w-[400px]">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                      <Icon name="heroicons:trophy" class="text-xl" />
                   </div>
                   <div class="text-left">
                      <h5 class="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1">NODE {{ winner.id === 1 ? 'A' : 'B' }} TRIUMPHED</h5>
                      <p class="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Target Locked // 100% Reach</p>
                   </div>
                </div>
                <button @click="resetGame" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                   Start New Run
                </button>
             </div>
             <div v-else class="flex items-center gap-4 py-4 px-8 bg-zinc-900 border border-white/5 rounded-2xl shadow-lg w-full max-w-[300px] justify-center text-center">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-all', currentPlayerIndex === 0 ? 'bg-red-600 text-white shadow-red-500/20 shadow-lg' : 'bg-blue-600 text-white shadow-blue-500/20 shadow-lg']">
                   <span class="font-black">{{ players[currentPlayerIndex].id === 1 ? 'A' : 'B' }}</span>
                </div>
                <div class="text-left">
                   <p class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Active Thread</p>
                   <h5 class="text-xs font-black text-white uppercase tracking-widest leading-none">Node {{ players[currentPlayerIndex].id === 1 ? 'A' : 'B' }} Access</h5>
                </div>
             </div>
          </transition>
       </div>

       <!-- The Board Grid -->
       <div class="relative w-full max-w-[480px] aspect-square bg-zinc-900/50 rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl transition-transform hover:scale-[1.01] mb-auto">
          <!-- Cells -->
          <div class="grid grid-cols-10 grid-rows-10 h-full w-full">
             <div v-for="num in boardNumbers" :key="num" 
               class="relative flex items-center justify-center border border-white/[0.03] text-[9px] font-black"
               :class="num % 2 === 0 ? 'bg-white/[0.01] text-zinc-700' : 'text-zinc-800'"
             >
                {{ num }}
             </div>
          </div>

          <!-- SVG Elements -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
             <!-- Ladders -->
             <g v-for="(end, start) in LADDERS" :key="'L'+start" class="opacity-40">
                <line 
                  :x1="getCoords(Number(start)).x" :y1="getCoords(Number(start)).y"
                  :x2="getCoords(end).x" :y2="getCoords(end).y"
                  stroke="#5c3b28" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="0.5, 3" />
             </g>
             <!-- Snakes -->
             <g v-for="(end, start) in SNAKES" :key="'S'+start" class="opacity-60">
                <path 
                   :d="`M ${getCoords(Number(start)).x} ${getCoords(Number(start)).y} 
                       Q ${(getCoords(Number(start)).x + getCoords(end).x)/2 + 4} ${(getCoords(Number(start)).y + getCoords(end).y)/2} 
                         ${getCoords(end).x} ${getCoords(end).y}`"
                   fill="none" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="2, 2"
                />
             </g>
          </svg>

          <!-- Markers -->
          <div v-for="p in players" :key="p.id" 
            class="absolute w-[6.5%] h-[6.5%] rounded-full border border-black shadow-2xl transition-all duration-500 ease-in-out z-20 flex items-center justify-center font-black text-[9px] text-white"
            :class="p.color"
            :style="{ 
               left: `calc(${getCoords(p.position).x}% - 3.25%)`, 
               top: `calc(${getCoords(p.position).y}% - 3.25%)`,
               transform: p.id === 2 ? 'translate(4px, 4px)' : 'none'
            }"
          >
             {{ p.id === 1 ? 'A' : 'B' }}
          </div>
       </div>
    </div>

    <!-- RIGHT: THE ANALYTICS HUB -->
    <div class="lg:col-span-5 flex flex-col border-l border-white/5 bg-zinc-900/40 p-8 space-y-6 overflow-y-auto scrollbar-hide">
       
       <!-- Current Executive -->
       <div :class="['p-6 border-2 rounded-2xl relative transition-all duration-300', currentPlayerIndex === 0 ? 'bg-red-500/5 border-red-500/30' : 'bg-blue-500/5 border-blue-500/30']">
          <div class="flex items-center justify-between">
             <div class="flex items-center gap-4">
                <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg', currentPlayerIndex === 0 ? 'bg-red-600' : 'bg-blue-600']">
                   <span class="text-white font-black text-2xl">{{ players[currentPlayerIndex].id === 1 ? 'A' : 'B' }}</span>
                </div>
                <div>
                   <h4 class="text-white font-black uppercase text-base tracking-tighter leading-none mb-1">{{ players[currentPlayerIndex].name }}</h4>
                   <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Current Access Token</p>
                </div>
             </div>
             <div class="text-right">
                <p class="text-[9px] font-black text-zinc-600 uppercase mb-1">Position</p>
                <p class="text-3xl font-black text-white tabular-nums">{{ players[currentPlayerIndex].position }}</p>
             </div>
          </div>
       </div>

       <!-- CONTROL CLUSTER -->
       <div class="bg-black border border-white/5 rounded-2xl p-8 flex flex-col items-center relative">
          <div class="w-full flex justify-between items-center mb-6">
             <p class="text-[9px] font-black text-zinc-600 uppercase">Entropy Generator</p>
             <p class="text-[10px] font-mono text-emerald-500">{{ logMessage }}</p>
          </div>
          <div 
             @click="rollDice"
             :class="['w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl transition-all cursor-pointer active:scale-95 mb-8 group', isRolling ? 'animate-bounce' : 'rotate-6 hover:rotate-0']"
          >
             <span class="text-6xl font-black text-zinc-900">{{ diceValue }}</span>
          </div>
          <button 
             @click="rollDice"
             :disabled="isRolling || !!winner"
             class="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg"
          >
             {{ isRolling ? 'Requesting IO...' : 'Execute Shard Roll' }}
          </button>
       </div>

       <!-- DEEP ANALYTICS -->
       <div class="grid grid-cols-2 gap-4">
          <div class="bg-black/60 border border-white/5 p-5 rounded-2xl">
             <p class="text-[8px] font-black text-zinc-600 uppercase mb-2">Total Syscalls</p>
             <p class="text-xl font-black text-white">{{ players[0].totalRolls + players[1].totalRolls }}</p>
          </div>
          <div class="bg-black/60 border border-white/5 p-5 rounded-2xl">
             <p class="text-[8px] font-black text-zinc-600 uppercase mb-2">Max Boost</p>
             <p class="text-xl font-black text-emerald-500">{{ Math.max(players[0].maxJump, players[1].maxJump) }}u</p>
          </div>
          <div class="bg-black/60 border border-white/5 p-4 rounded-xl">
             <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Nodes Visited</p>
             <div class="flex items-center gap-1">
                <span class="text-xs font-black text-zinc-400 capitalize">Ladders: {{ players[0].laddersClimbed + players[1].laddersClimbed }}</span>
             </div>
          </div>
          <div class="bg-black/60 border border-white/5 p-4 rounded-xl">
             <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Trap Detection</p>
             <p class="text-xs font-black text-red-400 capitalize">Snakes: {{ players[0].snakesHit + players[1].snakesHit }}</p>
          </div>
       </div>

       <!-- EVENT STREAM -->
       <div class="flex-1 flex flex-col min-h-[150px]">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[8px] mb-3 flex items-center justify-between">
             Kernel Interaction Stream
             <p class="text-[7px] font-mono opacity-30">PID 4501 // REALTIME</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3 text-zinc-600">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span class="opacity-40">>></span>
                   <span :class="{'text-emerald-400': log.includes('SIGNAL'), 'text-red-400': log.includes('ALARM'), 'text-white': log.includes('BUS')}">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- SYSTEM SPECS -->
       <div class="space-y-3">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
                <Icon name="heroicons:cpu-chip" class="text-red-500 text-sm" />
             </div>
             <div>
                <p class="text-[10px] font-black text-white uppercase tracking-tight mb-1">{{ ins.title }}</p>
                <p class="text-[8px] text-zinc-500 leading-relaxed font-bold uppercase">{{ ins.desc }}</p>
             </div>
          </div>
       </div>

       <!-- ACTION BUTTONS -->
       <button @click="resetGame" class="w-full py-4 bg-zinc-950 border border-white/5 rounded-xl text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-inner flex items-center justify-center gap-2">
          <Icon name="heroicons:bolt" />
          Purge Board State
       </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.pop-enter-active { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
</style>
