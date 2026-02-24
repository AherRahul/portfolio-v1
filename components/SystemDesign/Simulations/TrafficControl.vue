<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

type Direction = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'
type LightState = 'GREEN' | 'YELLOW' | 'RED'

interface Car {
  id: number
  x: number // 0-100 percentage
  y: number // 0-100 percentage
  direction: Direction
  speed: number
  color: string
}

const isPaused = ref(false)
const simulationSpeed = ref(1)
const timer = ref(8)
const currentPhase = ref<'NS' | 'EW'>('NS')

const nsLight = ref<LightState>('GREEN')
const ewLight = ref<LightState>('RED')

const cars = ref<Car[]>([])
let nextCarId = 0
let simulationInterval: any = null
let timerInterval: any = null

const logs = ref<string[]>(['Intersection Controller v1.4 initialized.', 'Phase sequence loaded: N-S -> E-W.'])

const hardwareStats = [
  { label: 'Voltage', value: '110V AC', icon: 'heroicons:bolt', color: 'text-amber-500' },
  { label: 'Network', value: '4G/LTE', icon: 'heroicons:signal', color: 'text-emerald-500' },
  { label: 'Sensor', value: 'Active', icon: 'heroicons:eye', color: 'text-blue-500' },
  { label: 'Uptime', value: '14d 2h', icon: 'heroicons:clock', color: 'text-purple-500' },
]

const phaseLabel = computed(() => currentPhase.value === 'NS' ? 'N-S' : 'E-W')

const stats = computed(() => [
  { label: 'NORTH', state: nsLight.value, color: nsLight.value === 'GREEN' ? 'text-emerald-500' : nsLight.value === 'YELLOW' ? 'text-amber-500' : 'text-red-500', bg: nsLight.value === 'GREEN' ? 'bg-emerald-500/10' : nsLight.value === 'YELLOW' ? 'bg-amber-500/10' : 'bg-red-500/10', border: nsLight.value === 'GREEN' ? 'border-emerald-500/20' : nsLight.value === 'YELLOW' ? 'border-amber-500/20' : 'border-red-500/20' },
  { label: 'SOUTH', state: nsLight.value, color: nsLight.value === 'GREEN' ? 'text-emerald-500' : nsLight.value === 'YELLOW' ? 'text-amber-500' : 'text-red-500', bg: nsLight.value === 'GREEN' ? 'bg-emerald-500/10' : nsLight.value === 'YELLOW' ? 'bg-amber-500/10' : 'bg-red-500/10', border: nsLight.value === 'GREEN' ? 'border-emerald-500/20' : nsLight.value === 'YELLOW' ? 'border-amber-500/20' : 'border-red-500/20' },
  { label: 'EAST', state: ewLight.value, color: ewLight.value === 'GREEN' ? 'text-emerald-500' : ewLight.value === 'YELLOW' ? 'text-amber-500' : 'text-red-500', bg: ewLight.value === 'GREEN' ? 'bg-emerald-500/10' : ewLight.value === 'YELLOW' ? 'bg-amber-500/10' : 'bg-red-500/10', border: ewLight.value === 'GREEN' ? 'border-emerald-500/20' : ewLight.value === 'YELLOW' ? 'border-amber-500/20' : 'border-red-500/20' },
  { label: 'WEST', state: ewLight.value, color: ewLight.value === 'GREEN' ? 'text-emerald-500' : ewLight.value === 'YELLOW' ? 'text-amber-500' : 'text-red-500', bg: ewLight.value === 'GREEN' ? 'bg-emerald-500/10' : ewLight.value === 'YELLOW' ? 'bg-amber-500/10' : 'bg-red-500/10', border: ewLight.value === 'GREEN' ? 'border-emerald-500/20' : ewLight.value === 'YELLOW' ? 'border-amber-500/20' : 'border-red-500/20' }
])

function spawnCar() {
  if (isPaused.value) return
  
  const directions: Direction[] = ['NORTH', 'SOUTH', 'EAST', 'WEST']
  const dir = directions[Math.floor(Math.random() * directions.length)]
  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6']
  
  let x = 0, y = 0
  if (dir === 'NORTH') { x = 46; y = -10 }
  if (dir === 'SOUTH') { x = 52; y = 110 }
  if (dir === 'EAST') { x = -10; y = 52 }
  if (dir === 'WEST') { x = 110; y = 46 }

  cars.value.push({
    id: nextCarId++,
    x, y,
    direction: dir,
    speed: 0.4 + Math.random() * 0.3,
    color: colors[Math.floor(Math.random() * colors.length)]
  })
  
  if (cars.value.length % 5 === 0) {
    logs.value.unshift(`[SENSOR] Vehicle detected approaching from ${dir}`)
    if (logs.value.length > 15) logs.value.pop()
  }
}

function updateSimulation() {
  if (isPaused.value) return

  const stopLineOffset = 12
  const intersectionSize = 25
  const center = 50

  cars.value.forEach((car, index) => {
    let shouldStop = false
    const currentSpeed = car.speed * simulationSpeed.value

    // Collision detection (very basic)
    const otherCars = cars.value.filter(c => c.id !== car.id)
    const hasCarInFront = otherCars.some(other => {
      if (car.direction === 'NORTH' && other.direction === 'NORTH' && other.y > car.y && other.y < car.y + 8) return true
      if (car.direction === 'SOUTH' && other.direction === 'SOUTH' && other.y < car.y && other.y > car.y - 8) return true
      if (car.direction === 'EAST' && other.direction === 'EAST' && other.x > car.x && other.x < car.x + 8) return true
      if (car.direction === 'WEST' && other.direction === 'WEST' && other.x < car.x && other.x > car.x - 8) return true
      return false
    })

    if (hasCarInFront) shouldStop = true

    // Traffic light detection
    if (car.direction === 'NORTH') {
      if (nsLight.value === 'RED' && car.y < 35 && car.y > 30) shouldStop = true
      if (nsLight.value === 'YELLOW' && car.y < 30 && car.y > 25) shouldStop = true
    } else if (car.direction === 'SOUTH') {
      if (nsLight.value === 'RED' && car.y > 65 && car.y < 70) shouldStop = true
      if (nsLight.value === 'YELLOW' && car.y > 70 && car.y < 75) shouldStop = true
    } else if (car.direction === 'EAST') {
      if (ewLight.value === 'RED' && car.x < 35 && car.x > 30) shouldStop = true
      if (ewLight.value === 'YELLOW' && car.x < 30 && car.x > 25) shouldStop = true
    } else if (car.direction === 'WEST') {
      if (ewLight.value === 'RED' && car.x > 65 && car.x < 70) shouldStop = true
      if (ewLight.value === 'YELLOW' && car.x > 70 && car.x < 75) shouldStop = true
    }

    if (!shouldStop) {
      if (car.direction === 'NORTH') car.y += currentSpeed
      if (car.direction === 'SOUTH') car.y -= currentSpeed
      if (car.direction === 'EAST') car.x += currentSpeed
      if (car.direction === 'WEST') car.x -= currentSpeed
    }

    // Remove off-screen cars
    if (car.x < -20 || car.x > 120 || car.y < -20 || car.y > 120) {
      cars.value.splice(index, 1)
    }
  })
}

function handleTimer() {
  if (isPaused.value) return
  
  timer.value -= 1
  if (timer.value <= 0) {
    switchPhase()
  }
}

function switchPhase() {
  if (currentPhase.value === 'NS') {
    if (nsLight.value === 'GREEN') {
      nsLight.value = 'YELLOW'
      timer.value = 3
    } else {
      nsLight.value = 'RED'
      ewLight.value = 'GREEN'
      currentPhase.value = 'EW'
      timer.value = 8
    }
  } else {
    if (ewLight.value === 'GREEN') {
      ewLight.value = 'YELLOW'
      timer.value = 3
    } else {
      ewLight.value = 'RED'
      nsLight.value = 'GREEN'
      currentPhase.value = 'NS'
      timer.value = 8
    }
  }
  logs.value.unshift(`[SIGNAL] Phase Switch: North-South is now ${nsLight.value}`)
  if (logs.value.length > 15) logs.value.pop()
}

function resetSimulation() {
  cars.value = []
  timer.value = 8
  currentPhase.value = 'NS'
  nsLight.value = 'GREEN'
  ewLight.value = 'RED'
  isPaused.value = false
  simulationSpeed.value = 1
}

onMounted(() => {
  simulationInterval = setInterval(updateSimulation, 30)
  timerInterval = setInterval(handleTimer, 1000)
  // Initially spawn some cars
  for(let i=0; i<5; i++) spawnCar()
  // Spawn car every 2 seconds
  setInterval(spawnCar, 2000)
})

onUnmounted(() => {
  clearInterval(simulationInterval)
  clearInterval(timerInterval)
})

watch(simulationSpeed, (newSpeed) => {
  clearInterval(timerInterval)
  timerInterval = setInterval(handleTimer, 1000 / newSpeed)
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-[850px] overflow-hidden shadow-2xl">
    
    <!-- LEFT: TRAFFIC MAP (75%) -->
    <div class="lg:col-span-12 xl:col-span-9 bg-[#2d3436] relative overflow-hidden flex items-center justify-center p-8">
       
       <!-- GRASS BACKGROUND -->
       <div class="absolute inset-0 bg-[#27ae60] opacity-90"></div>
       <div class="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

       <!-- THE INTERSECTION -->
       <div class="relative w-full aspect-square max-w-[700px] bg-[#2d3436] shadow-2xl overflow-hidden rounded-lg">
          
          <!-- ROADS -->
          <!-- Vertical Road -->
          <div class="absolute inset-x-0 top-0 bottom-0 left-1/2 -translate-x-1/2 w-32 bg-[#34495e] flex flex-col items-center">
             <div class="w-1 h-full border-r-2 border-dashed border-amber-400 opacity-60"></div>
             <!-- Stop lines -->
             <div class="absolute top-[35%] w-full h-1 bg-white"></div>
             <div class="absolute bottom-[35%] w-full h-1 bg-white"></div>
          </div>
          <!-- Horizontal Road -->
          <div class="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-32 bg-[#34495e] flex items-center justify-center">
             <div class="h-1 w-full border-b-2 border-dashed border-amber-400 opacity-60"></div>
             <!-- Stop lines -->
             <div class="absolute left-[35%] h-full w-1 bg-white"></div>
             <div class="absolute right-[35%] h-full w-1 bg-white"></div>
          </div>

          <!-- INTERSECTION SQUARE -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#34495e] z-10 border border-white/10"></div>

          <!-- TRAFFIC LIGHTS -->
          <!-- North Signal -->
          <div class="absolute top-[30%] left-[40%] -translate-x-full z-20 flex flex-col items-center gap-1 bg-black/80 p-1.5 rounded-lg border border-white/10 shadow-xl">
             <div class="w-4 h-4 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]" :class="nsLight === 'RED' ? 'bg-red-500 scale-110' : 'bg-red-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]" :class="nsLight === 'YELLOW' ? 'bg-amber-500 scale-110' : 'bg-amber-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]" :class="nsLight === 'GREEN' ? 'bg-emerald-500 scale-110' : 'bg-emerald-950'"></div>
          </div>
          <!-- South Signal -->
          <div class="absolute bottom-[30%] right-[40%] translate-x-full z-20 flex flex-col items-center gap-1 bg-black/80 p-1.5 rounded-lg border border-white/10 shadow-xl">
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="nsLight === 'RED' ? 'bg-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-red-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="nsLight === 'YELLOW' ? 'bg-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-amber-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="nsLight === 'GREEN' ? 'bg-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-emerald-950'"></div>
          </div>
          <!-- East Signal -->
          <div class="absolute right-[30%] top-[40%] -translate-y-full z-20 flex flex-row items-center gap-1 bg-black/80 p-1.5 rounded-lg border border-white/10 shadow-xl">
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="ewLight === 'RED' ? 'bg-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-red-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="ewLight === 'YELLOW' ? 'bg-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-amber-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="ewLight === 'GREEN' ? 'bg-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-emerald-950'"></div>
          </div>
          <!-- West Signal -->
          <div class="absolute left-[30%] bottom-[40%] translate-y-full z-20 flex flex-row items-center gap-1 bg-black/80 p-1.5 rounded-lg border border-white/10 shadow-xl">
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="ewLight === 'RED' ? 'bg-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-red-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="ewLight === 'YELLOW' ? 'bg-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-amber-950'"></div>
             <div class="w-4 h-4 rounded-full transition-all duration-300" :class="ewLight === 'GREEN' ? 'bg-emerald-500 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-emerald-950'"></div>
          </div>

          <!-- CARS -->
          <div v-for="car in cars" :key="car.id" 
            class="absolute w-6 h-10 rounded shadow-lg transition-all duration-150 z-30"
            :style="{ 
              left: `${car.x}%`, 
              top: `${car.y}%`, 
              backgroundColor: car.color,
              transform: `translate(-50%, -50%) rotate(${car.direction === 'NORTH' ? 180 : car.direction === 'SOUTH' ? 0 : car.direction === 'EAST' ? 90 : -90}deg)`,
              border: '2px solid rgba(0,0,0,0.2)'
            }"
          >
             <!-- Headlights -->
             <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-yellow-100 rounded-full opacity-60"></div>
             <div class="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-100 rounded-full opacity-60"></div>
          </div>

          <!-- OVERLAYS (Phase Info) -->
          <div class="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-40 flex items-center gap-4">
             <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="nsLight === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'"></div>
                <span class="text-[10px] font-black text-white uppercase tracking-widest">N-S</span>
             </div>
             <div class="w-px h-4 bg-white/10"></div>
             <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="ewLight === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'"></div>
                <span class="text-[10px] font-black text-white uppercase tracking-widest">E-W</span>
             </div>
          </div>

          <div class="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-40 flex items-center gap-3">
             <Icon name="heroicons:clock" class="text-zinc-400 text-sm" />
             <span class="text-lg font-black text-white tabular-nums tracking-tighter">{{ timer }}s</span>
          </div>

       </div>
    </div>

    <!-- RIGHT: CONTROLS (25%) -->
    <div class="lg:col-span-12 xl:col-span-3 bg-zinc-950 border-l border-white/5 flex flex-col p-8 space-y-6 overflow-y-auto custom-scrollbar">
       
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

       <!-- SIGNAL STATUS -->
       <div class="space-y-4">
          <h4 class="text-zinc-500 font-extrabold uppercase text-[11px] tracking-widest">Signal Status</h4>
          <div class="grid grid-cols-2 gap-3">
             <div v-for="stat in stats" :key="stat.label" 
               class="p-4 rounded-xl border transition-all flex flex-col gap-1 items-center"
               :class="[stat.bg, stat.border]"
             >
                <div class="flex items-center gap-2">
                   <div class="w-2 h-2 rounded-full shadow-lg" :class="[stat.state === 'GREEN' ? 'bg-emerald-500' : stat.state === 'YELLOW' ? 'bg-amber-500' : 'bg-red-500']"></div>
                   <span class="text-[10px] font-black text-white uppercase tracking-tighter">{{ stat.label }}</span>
                </div>
                <span :class="[stat.color, 'text-[8px] font-bold uppercase tracking-widest']">{{ stat.state }}</span>
             </div>
          </div>
       </div>

       <!-- CONTROLS -->
       <div class="space-y-6 bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
          <div class="flex items-center justify-between">
             <h4 class="text-zinc-500 font-extrabold uppercase text-[11px] tracking-widest">Controls</h4>
             <Icon name="heroicons:cog-6-tooth" class="text-zinc-700 text-sm" />
          </div>

          <button 
            @click="isPaused = !isPaused"
            class="w-full py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/5"
          >
             <Icon :name="isPaused ? 'heroicons:play-solid' : 'heroicons:pause-solid'" class="text-sm" />
             {{ isPaused ? 'Resume' : 'Pause' }}
          </button>

          <div class="space-y-3">
             <div class="flex justify-between items-center px-1">
                <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Simulation Speed</span>
                <span class="text-[10px] font-black text-white">{{ simulationSpeed }}x</span>
             </div>
             <div class="flex gap-2">
                <button v-for="s in [0.5, 1, 1.5, 2]" :key="s" 
                  @click="simulationSpeed = s"
                  class="flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all border border-white/5"
                  :class="simulationSpeed === s ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-900 text-zinc-600 hover:text-white'"
                >
                   {{ s }}x
                </button>
             </div>
          </div>

          <button 
            @click="resetSimulation"
            class="w-full py-3 bg-zinc-900 text-zinc-400 border border-white/5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:text-white transition-all active:scale-95"
          >
             <Icon name="heroicons:arrow-path" class="text-xs" />
             Reset Simulation
          </button>
       </div>

       <!-- SYSTEM LOG -->
       <div class="flex-1 flex flex-col min-h-[200px] overflow-hidden">
          <h4 class="text-zinc-600 font-black uppercase tracking-[0.1em] text-[8px] mb-3 flex items-center justify-between px-1">
             Traffic Log
             <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          </h4>
          <div class="flex-1 bg-black rounded-xl p-4 font-mono text-[9px] overflow-y-auto custom-scrollbar border border-white/5 shadow-inner">
             <div v-for="(log, i) in logs" :key="i" class="mb-2 flex gap-2 opacity-50">
                <span class="text-zinc-800 shrink-0">{{ new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) }}</span>
                <span :class="log.includes('SIGNAL') ? 'text-blue-400' : 'text-zinc-500'">{{ log }}</span>
             </div>
          </div>
       </div>

       <!-- TECHNICAL INSIGHT -->
       <div class="p-4 bg-zinc-950/80 border border-blue-500/20 rounded-xl flex gap-3 shrink-0 shadow-lg mt-auto">
          <Icon name="heroicons:cpu-chip" class="text-blue-500 text-lg shrink-0" />
          <div>
             <p class="text-[9px] font-black text-white uppercase tracking-tight mb-0.5">State Logic</p>
             <p class="text-[7px] text-zinc-500 leading-tight font-medium uppercase uppercase">Deterministic FSM prevents intersection deadlock by enforcing phase exclusivity.</p>
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
