<script setup lang="ts">
type VehicleType = 'Motorcycle' | 'Car' | 'Truck'
type SlotType = 'Compact' | 'Regular' | 'Large'

interface Slot {
  id: string
  type: SlotType
  occupied: boolean
  vehicleHeader?: VehicleType
}

interface Floor {
  name: string
  slots: Slot[]
  activity: string[]
  earnings: number
}

const selectedVehicle = ref<VehicleType>('Car')
const logs = ref<string[]>(['Parking Control System v2.4 initialized.', 'Gate sensor A1 online.'])

const floors = ref<Floor[]>([
  {
    name: 'Basement-01',
    earnings: 0,
    activity: [],
    slots: Array.from({ length: 12 }, (_, i) => ({
      id: `B1-${i + 1}`,
      type: i < 4 ? 'Compact' : i < 10 ? 'Regular' : 'Large',
      occupied: false
    }))
  },
  {
    name: 'Floor-01',
    earnings: 0,
    activity: [],
    slots: Array.from({ length: 12 }, (_, i) => ({
      id: `F1-${i + 1}`,
      type: i < 4 ? 'Compact' : i < 10 ? 'Regular' : 'Large',
      occupied: false
    }))
  }
])

function canFit(vehicle: VehicleType, slotType: SlotType) {
  if (vehicle === 'Motorcycle') return true
  if (vehicle === 'Car') return slotType !== 'Compact'
  if (vehicle === 'Truck') return slotType === 'Large'
  return false
}

function handleSlotClick(floorIndex: number, slotIndex: number) {
  const floor = floors.value[floorIndex]
  const slot = floor.slots[slotIndex]
  
  if (slot.occupied) {
    floor.earnings += 15
    slot.occupied = false
    slot.vehicleHeader = undefined
    logs.value.unshift(`GATE: Slot ${slot.id} cleared. Revenue collected: $15.`)
  } else {
    if (canFit(selectedVehicle.value, slot.type)) {
      slot.occupied = true
      slot.vehicleHeader = selectedVehicle.value
      logs.value.unshift(`GATE: ${selectedVehicle.value} allocated to ${slot.id}.`)
    } else {
      logs.value.unshift(`ERROR: ${selectedVehicle.value} too large for ${slot.type} slot ${slot.id}.`)
    }
  }
}

const totalEarnings = computed(() => floors.value.reduce((acc, f) => acc + f.earnings, 0))
const totalFree = computed(() => floors.value.reduce((acc, f) => acc + f.slots.filter(s => !s.occupied).length, 0))

const insights = [
  { title: 'Allocation Logic', desc: 'Strategy patterns determine optimal slot based on vehicle dimensions.' },
  { title: 'Scalable Sharding', desc: 'Floors can be distributed across different data nodes for massive lots.' },
  { title: 'Event Bus', desc: 'Sensors emit events to a central bus for real-time dashboard sync.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden">
    
    <!-- LEFT: THE LOT VISual -->
    <div class="space-y-6 relative z-10 flex flex-col min-h-0">
      
      <!-- Legend & Stats -->
      <div class="flex items-center justify-between pb-4 border-b border-white/5">
         <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <Icon name="heroicons:map-pin" class="text-xl" />
            </div>
            <div>
               <h4 class="text-white font-black uppercase tracking-tighter text-sm">Parking Cluster</h4>
               <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Multi-Floor Hub</p>
            </div>
         </div>
         <div class="flex items-center gap-4">
            <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-blue-500"></div><span class="text-[8px] font-black text-zinc-500 uppercase">C</span></div>
            <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-emerald-500"></div><span class="text-[8px] font-black text-zinc-500 uppercase">R</span></div>
            <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-amber-500"></div><span class="text-[8px] font-black text-zinc-500 uppercase">L</span></div>
         </div>
      </div>

      <!-- Floor Grids -->
      <div class="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-2">
         <div v-for="(floor, fi) in floors" :key="floor.name" class="bg-zinc-900/40 border border-white/5 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
               <div class="flex items-center gap-2">
                  <span class="text-[10px] font-black text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 uppercase">{{ floor.name }}</span>
                  <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{{ floor.slots.filter(s => !s.occupied).length }} Free</span>
               </div>
               <span class="text-[10px] font-black text-zinc-500 uppercase tabular-nums">Rev: ${{ floor.earnings }}</span>
            </div>

            <div class="grid grid-cols-6 gap-2">
               <button 
                 v-for="(slot, si) in floor.slots" :key="slot.id"
                 @click="handleSlotClick(fi, si)"
                 class="h-14 rounded-lg border border-white/5 flex flex-col items-center justify-center relative group transition-all"
                 :class="[
                    slot.occupied ? 'bg-zinc-800 border-zinc-700' : 
                    slot.type === 'Compact' ? 'bg-blue-500/5 hover:bg-blue-500/10' :
                    slot.type === 'Regular' ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-amber-500/5 hover:bg-amber-500/10'
                 ]"
               >
                  <span class="absolute top-1 left-1.5 text-[6px] font-black text-zinc-700">{{ slot.id }}</span>
                  <Icon v-if="slot.occupied" :name="slot.vehicleHeader === 'Motorcycle' ? 'mdi:motorbike' : slot.vehicleHeader === 'Car' ? 'mdi:car' : 'mdi:truck'" 
                    :class="['text-lg', slot.vehicleHeader === 'Motorcycle' ? 'text-blue-500' : slot.vehicleHeader === 'Car' ? 'text-emerald-500' : 'text-amber-500']" />
               </button>
            </div>
         </div>
      </div>

      <!-- Summary -->
      <div class="flex items-center justify-between pt-4 border-t border-white/5">
         <div class="flex gap-4">
            <div class="text-center">
               <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Total Free</p>
               <p class="text-sm font-black text-white tabular-nums">{{ totalFree }}</p>
            </div>
            <div class="text-center">
               <p class="text-[8px] font-black text-zinc-600 uppercase mb-1">Active Rev</p>
               <p class="text-sm font-black text-emerald-500 tabular-nums">${{ totalEarnings }}</p>
            </div>
         </div>
         <div class="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
            <span class="text-[9px] font-black text-blue-500 uppercase tracking-wider">Rate: $15/hr</span>
         </div>
      </div>
    </div>

    <!-- RIGHT: THE ANALYTICS HUB -->
    <div class="flex flex-col gap-6 relative z-10">
       
       <!-- VEHICLE SELECTION -->
       <div class="bg-zinc-900 border border-white/5 rounded-2xl p-6">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[9px] mb-4">Request Vehicle Shard</h4>
          <div class="grid grid-cols-3 gap-3">
             <button v-for="v in (['Motorcycle', 'Car', 'Truck'] as const)" :key="v" 
               @click="selectedVehicle = v"
               class="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all"
               :class="selectedVehicle === v ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-lg' : 'bg-white/5 border-white/10 text-zinc-500'"
             >
                <Icon :name="v === 'Motorcycle' ? 'mdi:motorbike' : v === 'Car' ? 'mdi:car' : 'mdi:truck'" class="text-xl" />
                <span class="text-[8px] font-black uppercase tracking-tighter">{{ v }}</span>
             </button>
          </div>
       </div>

       <!-- SYSTEM LOGS (TERMINAL) -->
       <div class="flex-1 flex flex-col min-h-0">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[9px] mb-3 flex items-center justify-between">
             Hardware Interaction Stream
             <span class="text-[8px] opacity-40 font-mono animate-pulse">● LOADED</span>
          </h4>
          <div class="flex-1 bg-black/80 border border-white/5 rounded-2xl p-6 font-mono text-[10px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                <div v-for="(log, i) in logs" :key="i" :class="['flex gap-3', log.includes('GATE') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-red-400' : 'text-zinc-600']">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span class="opacity-40">>></span>
                   <span>{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- SPECS -->
       <div class="grid grid-cols-1 gap-2">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-3 p-3 bg-zinc-900/50 border border-white/5 rounded-xl">
             <div class="shrink-0 w-6 h-6 bg-zinc-800 rounded flex items-center justify-center border border-white/10">
                <Icon name="heroicons:bolt" class="text-emerald-500 text-xs" />
             </div>
             <div>
                <p class="text-[10px] font-black text-white uppercase mb-0.5">{{ ins.title }}</p>
                <p class="text-[8px] text-zinc-500 font-bold uppercase leading-tight">{{ ins.desc }}</p>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
