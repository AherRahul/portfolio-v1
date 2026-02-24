<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

interface Cell {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborCount: number
}

const ROWS = 10
const COLS = 10
const MINE_COUNT = 15

const board = ref<Cell[][]>([])
const gameState = ref<'idle' | 'playing' | 'won' | 'lost'>('idle')
const flagsUsed = ref(0)
const timeElapsed = ref(0)
const logs = ref<string[]>(['Minesweeper kernel initialized.', 'Waiting for sector scan...'])
const firstClick = ref(true)

const { pause, resume, isActive } = useIntervalFn(() => {
  timeElapsed.value++
}, 1000, { immediate: false })

function initBoard() {
  gameState.value = 'idle'
  timeElapsed.value = 0
  flagsUsed.value = 0
  firstClick.value = true
  pause()
  
  const newBoard: Cell[][] = []
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = []
    for (let c = 0; c < COLS; c++) {
      row.push({ isMine: false, isRevealed: false, isFlagged: false, neighborCount: 0 })
    }
    newBoard.push(row)
  }
  board.value = newBoard
  logs.value = ['Sector re-hydrated. Scan authorized.']
}

function placeMines(initialR: number, initialC: number) {
  let placed = 0
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    
    // Don't place on initial click or on an existing mine
    if ((r !== initialR || c !== initialC) && !board.value[r][c].isMine) {
      board.value[r][c].isMine = true
      placed++
    }
  }

  // Calculate neighbors
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board.value[r][c].isMine) continue
      let count = 0
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr
          const nc = c + dc
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board.value[nr][nc].isMine) {
            count++
          }
        }
      }
      board.value[r][c].neighborCount = count
    }
  }
  logs.value.unshift(`KERNEL: ${MINE_COUNT} mines distributed across grid.`)
}

function revealCell(r: number, c: number) {
  if (gameState.value === 'won' || gameState.value === 'lost' || board.value[r][c].isRevealed || board.value[r][c].isFlagged) return

  if (firstClick.value) {
    firstClick.value = false
    placeMines(r, c)
    gameState.value = 'playing'
    resume()
  }

  board.value[r][c].isRevealed = true

  if (board.value[r][c].isMine) {
    gameState.value = 'lost'
    pause()
    revealAllMines()
    logs.value.unshift('ALARM: Mine detonation at sector (' + r + ',' + c + '). Simulation halted.')
    return
  }

  logs.value.unshift(`SCAN: Sector (${r},${c}) cleared. Neighbors: ${board.value[r][c].neighborCount}`)

  if (board.value[r][c].neighborCount === 0) {
    // Flood fill
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          revealCell(nr, nc)
        }
      }
    }
  }

  checkWin()
}

function toggleFlag(r: number, c: number, e: Event) {
  e.preventDefault()
  if (gameState.value !== 'playing' && gameState.value !== 'idle') return
  if (board.value[r][c].isRevealed) return

  board.value[r][c].isFlagged = !board.value[r][c].isFlagged
  flagsUsed.value += board.value[r][c].isFlagged ? 1 : -1
  logs.value.unshift(`SIGNAL: Sector (${r},${c}) ${board.value[r][c].isFlagged ? 'flagged' : 'unflagged'}.`)
}

function revealAllMines() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board.value[r][c].isMine) board.value[r][c].isRevealed = true
    }
  }
}

function checkWin() {
  let revealedCount = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board.value[r][c].isRevealed && !board.value[r][c].isMine) revealedCount++
    }
  }

  if (revealedCount === (ROWS * COLS) - MINE_COUNT) {
    gameState.value = 'won'
    pause()
    logs.value.unshift('SYSTEM: All clean sectors verified. Victory detected.')
  }
}

const systemStats = [
  { label: 'State Sync', value: 'Active', icon: 'heroicons:arrow-path', color: 'text-blue-500' },
  { label: 'Logic Latency', value: '12ms', icon: 'heroicons:bolt', color: 'text-emerald-500' },
  { label: 'Memory Load', value: 'Minimal', icon: 'heroicons:cpu-chip', color: 'text-red-500' },
  { label: 'Safety Mode', value: 'On', icon: 'heroicons:shield-check', color: 'text-purple-500' }
]

const insights = [
  { title: 'Flood Fill Logic', desc: 'Uses recursive DFS to clear zero-neighbor areas in O(N*M) time complexity.' },
  { title: 'Probability Map', desc: 'Sector clearing probability increases as neighbors are revealed and edges are calculated.' },
  { title: 'First Click Shard', desc: 'Mines are distributed only after the first move to ensure a safe initial segment.' }
]

onMounted(initBoard)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-full min-h-[750px] overflow-hidden">
    
    <!-- LEFT: MINE GRID (Takes 7 cols) -->
    <div class="lg:col-span-7 p-8 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden">
       <!-- Local Header -->
       <div class="w-full flex items-center justify-between mb-8 overflow-hidden">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <Icon name="heroicons:sparkles" class="text-xl" />
             </div>
             <div>
                <h4 class="text-white font-black uppercase tracking-tighter text-sm">Mine Scanner v2.1</h4>
                <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Sector Visualization Hub</p>
             </div>
          </div>
          <div class="flex items-center gap-3">
             <div class="flex gap-2">
                <div class="bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg text-center min-w-[60px]">
                   <p class="text-[6px] font-black text-zinc-600 uppercase mb-0.5">Mines</p>
                   <p class="text-[10px] font-black text-white tabular-nums">{{ MINE_COUNT - flagsUsed }}</p>
                </div>
                <div class="bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg text-center min-w-[60px]">
                   <p class="text-[6px] font-black text-zinc-600 uppercase mb-0.5">Time</p>
                   <p class="text-[10px] font-black text-white tabular-nums">{{ timeElapsed }}s</p>
                </div>
             </div>
             <button @click="initBoard" class="p-2.5 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-black/20">
                <Icon name="heroicons:arrow-path" class="text-lg" />
             </button>
          </div>
       </div>

       <!-- TURN / WIN INDICATOR (Moved to top-center area) -->
       <div class="mb-10 w-full flex justify-center">
          <transition name="pop" mode="out-in">
             <div v-if="gameState === 'won' || gameState === 'lost'" 
                class="flex flex-col items-center gap-4 py-6 px-12 rounded-2xl border shadow-lg w-full max-w-[400px]"
                :class="gameState === 'won' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]'">
                <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                      :class="gameState === 'won' ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-red-600 shadow-red-500/30'">
                      <Icon :name="gameState === 'won' ? 'heroicons:trophy' : 'heroicons:bolt'" class="text-xl" />
                   </div>
                   <div class="text-left">
                      <h5 class="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1">
                         {{ gameState === 'won' ? 'MISSION SUCCESS' : 'SYSTEM FAILURE' }}
                      </h5>
                      <p class="text-[9px] font-black uppercase tracking-widest" :class="gameState === 'won' ? 'text-emerald-500/60' : 'text-red-500/60'">
                         {{ gameState === 'won' ? 'All Clear verified' : 'Mine detonation identified' }}
                      </p>
                   </div>
                </div>
                <button @click="initBoard" class="w-full py-3 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 shadow-lg"
                   :class="gameState === 'won' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-red-600 shadow-red-500/20'">
                   Start New Scan Run
                </button>
             </div>
             <div v-else class="flex items-center gap-4 py-4 px-8 bg-zinc-900 border border-white/5 rounded-2xl shadow-lg w-full max-w-[300px] justify-center text-center">
                <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white shadow-emerald-500/20 shadow-lg flex items-center justify-center">
                   <Icon name="heroicons:magnifying-glass" class="text-sm" />
                </div>
                <div class="text-left">
                   <p class="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Scanner Active</p>
                   <h5 class="text-xs font-black text-white uppercase tracking-widest leading-none">Scanning Sectors...</h5>
                </div>
             </div>
          </transition>
       </div>

       <!-- THE GRID -->
       <div class="relative bg-zinc-900/50 p-3 rounded-3xl border border-white/10 shadow-2xl mb-auto transition-transform hover:scale-[1.01]">
          <div class="grid grid-cols-10 gap-1.5">
             <template v-for="(row, r) in board" :key="r">
                <button 
                  v-for="(cell, c) in row" :key="c"
                  @click="revealCell(r, c)"
                  @contextmenu="toggleFlag(r, c, $event)"
                  :disabled="gameState === 'won' || gameState === 'lost'"
                  class="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black transition-all border border-white/0 relative group overflow-hidden"
                  :class="[
                    cell.isRevealed 
                      ? 'bg-black text-white border-white/5 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]' 
                      : 'bg-zinc-800 hover:bg-zinc-700 hover:border-white/10 shadow-lg active:scale-90',
                    cell.isRevealed && cell.isMine ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : '',
                    cell.neighborCount === 1 ? 'text-blue-400' : 
                    cell.neighborCount === 2 ? 'text-emerald-400' :
                    cell.neighborCount === 3 ? 'text-red-400' : 
                    cell.neighborCount >= 4 ? 'text-purple-400' : ''
                  ]"
                >
                   <div v-if="!cell.isRevealed" class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   
                   <template v-if="cell.isRevealed">
                      <Icon v-if="cell.isMine" name="heroicons:no-symbol" class="text-red-500 text-sm" />
                      <span v-else-if="cell.neighborCount > 0">{{ cell.neighborCount }}</span>
                   </template>
                   <Icon v-else-if="cell.isFlagged" name="heroicons:flag" class="text-red-500 text-xs shadow-red-500/50" />
                </button>
             </template>
          </div>
       </div>

    </div>

    <!-- RIGHT: ANALYTICS (Takes 5 cols) -->
    <div class="lg:col-span-12 xl:col-span-5 flex flex-col border-l border-white/5 bg-zinc-900/40 p-8 space-y-6 overflow-y-auto scrollbar-hide">
       
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
             Kernel Resource Log
             <p class="text-[7px] font-mono opacity-30">PID 9283 // REALTIME</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3 text-zinc-600">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span class="opacity-40">>></span>
                   <span :class="log.includes('Verified') || log.includes('Success') ? 'text-emerald-400' : log.includes('ALARM') ? 'text-red-400' : 'text-zinc-300'">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- INSIGHTS -->
       <div class="space-y-3">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                <Icon name="heroicons:cpu-chip" class="text-red-500 text-sm" />
             </div>
             <div>
                <p class="text-[10px] font-black text-white uppercase tracking-tight mb-1">{{ ins.title }}</p>
                <p class="text-[8px] text-zinc-500 leading-relaxed font-bold uppercase">{{ ins.desc }}</p>
             </div>
          </div>
       </div>

       <!-- SYSTEM ACTIONS -->
       <button @click="initBoard" class="w-full py-4 bg-zinc-950 border border-white/5 rounded-xl text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all active:scale-95 shadow-inner">
          REBOOT_SCANNER_CLUSTER
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
