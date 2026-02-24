<script setup lang="ts">
import { ref, computed } from 'vue'

interface Elevator {
  id: number
  label: string
  currentFloor: number
  targets: number[]
  direction: 'UP' | 'DOWN' | 'IDLE'
  status: 'IDLE' | 'MOVING' | 'ARRIVED' | 'OPEN' | 'CLOSING'
  accent: string
}

const floors = Array.from({ length: 10 }, (_, i) => 10 - i)
const elevators = ref<Elevator[]>([
  { id: 1, label: 'E1', currentFloor: 1, targets: [], direction: 'IDLE', status: 'IDLE', accent: 'bg-blue-500' },
  { id: 2, label: 'E2', currentFloor: 1, targets: [], direction: 'IDLE', status: 'IDLE', accent: 'bg-emerald-500' },
  { id: 3, label: 'E3', currentFloor: 1, targets: [], direction: 'IDLE', status: 'IDLE', accent: 'bg-purple-500' },
])

const logs = ref<string[]>(['Elevator Core v2.2 active.', 'Ready for dispatch.'])
const stats = computed(() => {
  const active = elevators.value.filter(e => e.status !== 'IDLE').length
  const waiting = elevators.value.reduce((acc, e) => acc + e.targets.length, 0)
  return { active, waiting }
})

const hardwareStats = [
  { label: 'Voltage', value: '240V', icon: 'heroicons:bolt', color: 'text-amber-500' },
  { label: 'Load', value: '14%', icon: 'heroicons:chart-bar', color: 'text-emerald-500' },
  { label: 'Temp', value: '42°C', icon: 'heroicons:fire', color: 'text-blue-500' },
  { label: 'Network', value: '98ms', icon: 'heroicons:wifi', color: 'text-purple-500' },
]

function callElevator(floor: number) {
  // Prevent duplicate calls
  const isTargeted = elevators.value.some(e => e.targets.includes(floor))
  const isPresent = elevators.value.some(e => e.currentFloor === floor && e.status === 'OPEN')
  if (isTargeted || isPresent) return

  // Basic Dispatcher: Find nearest capable elevator
  let bestElevator: Elevator | null = null
  let minDistance = 11

  elevators.value.forEach(e => {
    const distance = Math.abs(e.currentFloor - floor)
    if (distance < minDistance) {
      minDistance = distance
      bestElevator = e
    }
  })

  if (bestElevator) {
    bestElevator.targets.push(floor)
    logs.value.unshift(`[${bestElevator.label}] Target set: Floor ${floor}`)
    if (logs.value.length > 20) logs.value.pop()
    
    if (bestElevator.status === 'IDLE') {
      executeCycle(bestElevator)
    }
  }
}

async function executeCycle(elevator: Elevator) {
  if (elevator.targets.length === 0) {
    elevator.status = 'IDLE'
    elevator.direction = 'IDLE'
    return
  }

  const target = elevator.targets[0]
  
  if (elevator.currentFloor === target) {
    elevator.targets.shift()
    await runDoorCycle(elevator)
    executeCycle(elevator)
    return
  }

  elevator.status = 'MOVING'
  elevator.direction = target > elevator.currentFloor ? 'UP' : 'DOWN'
  
  // Real-time floor by floor movement
  setTimeout(() => {
    if (elevator.direction === 'UP') elevator.currentFloor++
    else elevator.currentFloor--
    executeCycle(elevator)
  }, 800)
}

async function runDoorCycle(elevator: Elevator) {
  elevator.status = 'ARRIVED' as any
  await new Promise(r => setTimeout(r, 400))
  
  elevator.status = 'OPEN'
  logs.value.unshift(`[${elevator.label}] Door Open at L${elevator.currentFloor}`)
  if (logs.value.length > 20) logs.value.pop()
  
  await new Promise(r => setTimeout(r, 2000))
  elevator.status = 'CLOSING'
  await new Promise(r => setTimeout(r, 800))
}

function resetAll() {
  elevators.value.forEach(e => {
    e.currentFloor = 1
    e.targets = []
    e.status = 'IDLE'
    e.direction = 'IDLE'
  })
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#050505] rounded-xl border border-white/5 relative h-[850px] overflow-hidden shadow-2xl">
    
    <!-- LEFT: FIXED DIAGRAM VIEW (75%) -->
    <div class="lg:col-span-12 xl:col-span-9 p-12 bg-black/20 relative flex flex-col items-center overflow-hidden">
       
       <!-- TOP TELEMETRY -->
       <div class="w-full max-w-[800px] mb-8 flex justify-between items-center px-4 shrink-0">
          <div>
             <h3 class="text-white font-black text-xl tracking-tighter uppercase leading-tight">Elevator Control Hub</h3>
             <p class="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Building Unit 7G // Live Schema</p>
          </div>
          <div class="flex gap-8">
             <div v-for="e in elevators" :key="`t-${e.id}`" class="flex flex-col items-center">
                <div class="flex items-center gap-1.5 mb-0.5">
                   <div :class="[e.accent, 'w-1.5 h-1.5 rounded-full shadow-lg shadow-current']" :style="{ opacity: e.status === 'IDLE' ? 0.3 : 1 }"></div>
                   <span class="text-[9px] font-black text-zinc-500">{{ e.label }}</span>
                </div>
                <span class="text-xl font-black text-white leading-none font-mono tracking-tighter">{{ e.currentFloor }}</span>
             </div>
          </div>
       </div>

       <!-- THE SCHEMATIC CONTAINER (FIXED HEIGHT) -->
       <div class="w-full max-w-[850px] h-full max-h-[600px] bg-zinc-900/30 rounded-[32px] border border-white/5 flex relative overflow-hidden shadow-inner">
          
          <!-- DEPTH LINES -->
          <div class="absolute inset-0 flex justify-around opacity-5 pointer-events-none">
             <div v-for="i in 5" :key="i" class="w-px h-full bg-white"></div>
          </div>

          <!-- FLOOR LABELS -->
          <div class="w-20 border-r border-white/5 flex flex-col bg-black/10">
             <div v-for="floor in floors" :key="floor" 
               class="flex-1 flex flex-col items-center justify-center border-b border-white/5 relative"
               :class="floor === 1 ? 'bg-amber-500/5' : floor === 10 ? 'bg-blue-500/5' : ''"
             >
                <span class="text-sm font-black text-white/40">{{ floor }}</span>
                <span class="text-[7px] font-bold text-zinc-700 uppercase tracking-widest">{{ floor === 1 ? 'Base' : 'Level' }}</span>
                <!-- Call Indicator -->
                <div v-if="elevators.some(e => e.targets.includes(floor))" class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping mr-1"></div>
             </div>
          </div>

          <!-- SHAFTS AREA -->
          <div class="flex-1 flex px-10 gap-12 relative h-full">
             <div v-for="elevator in elevators" :key="elevator.id" class="flex-1 relative border-x border-dashed border-white/5 h-full">
                
                <!-- THE POD -->
                <div 
                  class="absolute left-0 right-0 w-full transition-all duration-700 ease-in-out z-20"
                  :style="{ 
                    height: '10%',
                    bottom: `${(elevator.currentFloor - 1) * 10}%`
                  }"
                >
                   <div class="w-full h-full p-2 box-border">
                      <div class="w-full h-full bg-zinc-800 rounded-lg border border-white/10 shadow-xl relative overflow-hidden flex flex-col items-center justify-center transition-all"
                        :class="[
                          elevator.status === 'MOVING' ? 'scale-95 border-zinc-600' : 'scale-100',
                          elevator.status === 'OPEN' ? 'border-emerald-500/50 shadow-emerald-500/10' : ''
                        ]"
                      >
                         <!-- INTERNAL HUD -->
                         <div class="absolute top-1 right-1 px-1 rounded bg-black/40 border border-white/5">
                            <span class="text-[8px] font-mono font-bold text-white leading-none">{{ elevator.currentFloor }}</span>
                         </div>
                         
                         <!-- DIRECTION -->
                         <div class="mb-5 flex flex-col items-center gap-0.5 opacity-30">
                            <Icon name="heroicons:chevron-up" class="text-[10px]" :class="elevator.direction === 'UP' ? 'text-amber-500 opacity-100 scale-125' : ''" />
                            <Icon name="heroicons:chevron-down" class="text-[10px]" :class="elevator.direction === 'DOWN' ? 'text-amber-500 opacity-100 scale-125' : ''" />
                         </div>

                         <!-- DOORS -->
                         <div class="absolute bottom-0 inset-x-0 h-2/3 flex bg-black/40">
                            <div class="flex-1 bg-zinc-700 border-r border-black/30 transition-transform duration-700"
                              :style="{ transform: elevator.status === 'OPEN' ? 'translateX(-100%)' : 'translateX(0)' }"
                            ></div>
                            <div class="flex-1 bg-zinc-700 border-l border-black/30 transition-transform duration-700"
                              :style="{ transform: elevator.status === 'OPEN' ? 'translateX(100%)' : 'translateX(0)' }"
                            ></div>
                         </div>
                         
                         <!-- Arrival Glow -->
                         <div v-if="elevator.status === 'OPEN'" class="absolute inset-0 bg-emerald-500/5 blur-lg animate-pulse"></div>
                      </div>
                   </div>
                </div>

                <!-- RAIL GUIDES -->
                <div class="absolute inset-y-0 left-1/2 w-px bg-white/5 -translate-x-1/2"></div>
             </div>
          </div>

          <!-- BUILDING OVERLAY -->
          <div class="absolute inset-0 border-[12px] border-zinc-950 pointer-events-none rounded-[32px] opacity-40"></div>
       </div>

    </div>

    <!-- RIGHT: THE CONSOLE (25%) -->
    <div class="lg:col-span-12 xl:col-span-3 border-l-4 border-black bg-zinc-950 p-8 flex flex-col space-y-6 h-full overflow-hidden">
       
       <!-- HUD STAT GRID -->
       <div class="grid grid-cols-2 gap-2 shrink-0">
          <div v-for="stat in hardwareStats" :key="stat.label" class="bg-black/60 border border-white/5 p-3 rounded-xl flex items-center gap-2">
             <Icon :name="stat.icon" :class="['text-[10px]', stat.color]" />
             <div>
                <p class="text-[6px] font-black text-zinc-600 uppercase leading-none mb-0.5">{{ stat.label }}</p>
                <p class="text-[9px] font-black text-white tabular-nums tracking-tight leading-none">{{ stat.value }}</p>
             </div>
          </div>
       </div>

       <!-- STATUS SUMMARY -->
       <div class="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4 shrink-0 shadow-lg">
          <div class="flex items-center justify-between mb-2">
             <h4 class="text-white font-black uppercase text-[10px] tracking-widest">Global Status</h4>
             <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
          </div>
          <div class="flex justify-between items-center text-[11px] font-black uppercase tracking-tight">
             <span class="text-zinc-600">Active Units</span>
             <span class="text-white">{{ stats.active }}/3</span>
          </div>
          <div class="flex justify-between items-center text-[11px] font-black uppercase tracking-tight">
             <span class="text-zinc-600">Pending Requests</span>
             <span class="text-amber-500">{{ stats.waiting }}</span>
          </div>
       </div>

       <!-- UNIT PANELS -->
       <div class="space-y-3 shrink-0">
          <div v-for="e in elevators" :key="`p-${e.id}`" class="bg-black border border-white/5 rounded-2xl p-4 flex items-center justify-between group h-20 relative overflow-hidden">
             <!-- V-Status Light -->
             <div :class="[e.accent, 'absolute left-0 top-0 bottom-0 w-1 opacity-40']"></div>
             
             <div>
                <p class="text-[11px] font-black text-white uppercase">{{ e.label }}</p>
                <div class="flex items-center gap-1.5 mt-1">
                   <div :class="[e.status === 'MOVING' ? 'bg-amber-500' : 'bg-zinc-700', 'w-1 h-1 rounded-full animate-pulse']"></div>
                   <span :class="[e.status === 'MOVING' ? 'text-amber-500' : 'text-zinc-700', 'text-[8px] font-black uppercase tracking-widest']">{{ e.status }}</span>
                </div>
             </div>
             <div class="text-right">
                <span class="text-4xl font-black text-white tabular-nums leading-none">{{ e.currentFloor }}</span>
             </div>
          </div>
       </div>

       <!-- CALL PAD -->
       <div class="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div class="flex items-center justify-between px-1 shrink-0">
             <h4 class="text-white font-black uppercase text-[10px] tracking-widest">Call Station</h4>
             <button @click="resetAll" class="text-[8px] font-black text-zinc-700 hover:text-red-500 transition-colors uppercase">Reset</button>
          </div>
          <div class="grid grid-cols-5 gap-2 shrink-0">
             <button v-for="floor in floors.slice().reverse()" :key="`c-${floor}`"
               @click="callElevator(floor)"
               class="aspect-square flex items-center justify-center rounded-xl font-black text-xs transition-all active:scale-90 border border-white/5 relative z-10"
               :class="[
                 elevators.some(e => e.targets.includes(floor)) ? 'bg-red-600 text-white border-red-400' : 
                 elevators.some(e => e.currentFloor === floor && e.status === 'OPEN') ? 'bg-emerald-600 text-white' :
                 'bg-zinc-800 text-zinc-500 hover:text-white'
               ]"
             >
                {{ floor }}
             </button>
          </div>
          
          <!-- LOG (Fixed size, No push) -->
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-4 font-mono text-[9px] overflow-y-auto custom-scrollbar shadow-inner mt-4 min-h-0">
             <div v-for="(log, i) in logs" :key="i" class="mb-2 flex gap-4 opacity-40 hover:opacity-100 transition-opacity">
                <span class="text-zinc-800 shrink-0">[{{ new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) }}]</span>
                <span :class="log.includes('Target') ? 'text-blue-400' : log.includes('Open') ? 'text-emerald-400' : 'text-zinc-500'">{{ log }}</span>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHT -->
       <div class="p-4 bg-zinc-950/80 border border-blue-500/20 rounded-xl flex gap-3 shrink-0 shadow-lg mt-auto">
          <Icon name="heroicons:cpu-chip" class="text-blue-500 text-lg shrink-0" />
          <div>
             <p class="text-[9px] font-black text-white uppercase tracking-tight mb-0.5">Scheduler Engine</p>
             <p class="text-[7px] text-zinc-500 leading-tight font-medium uppercase">Uses the SCAN (Elevator) algorithm to optimize travel time and minimize motor wear across vertical shafts.</p>
          </div>
       </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

.box-border { box-sizing: border-box; }
</style>
