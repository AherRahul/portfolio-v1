<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: string
  name: string
  description: string
  price: number
  icon: string
  color: string
  recipe: {
    beans: number
    water: number
    milk: number
  }
}

const products: Product[] = [
  { id: 'espresso', name: 'Espresso', description: 'Strong & bold', price: 2.50, icon: 'heroicons:beaker', color: 'bg-orange-950', recipe: { beans: 18, water: 30, milk: 0 } },
  { id: 'americano', name: 'Americano', description: 'Smooth & rich', price: 3.00, icon: 'heroicons:variable', color: 'bg-stone-800', recipe: { beans: 18, water: 120, milk: 0 } },
  { id: 'latte', name: 'Latte', description: 'Creamy & mild', price: 4.00, icon: 'heroicons:sparkles', color: 'bg-orange-200', recipe: { beans: 18, water: 30, milk: 150 } },
  { id: 'cappuccino', name: 'Cappuccino', description: 'Frothy & balanced', price: 4.00, icon: 'heroicons:cloud', color: 'bg-orange-300', recipe: { beans: 18, water: 30, milk: 120 } },
  { id: 'mocha', name: 'Mocha', description: 'Chocolatey delight', price: 4.50, icon: 'heroicons:sparkles', color: 'bg-amber-900', recipe: { beans: 18, water: 30, milk: 100 } },
  { id: 'hot-chocolate', name: 'Hot Chocolate', description: 'Sweet & warming', price: 3.50, icon: 'heroicons:heart', color: 'bg-amber-800', recipe: { beans: 0, water: 30, milk: 180 } },
]

const selectedProductId = ref<string | null>(null)
const selectedProduct = computed(() => products.find(p => p.id === selectedProductId.value))

const sugarLevel = ref(0) // 0 to 3
const milkType = ref('Regular')
const isBrewing = ref(false)
const brewProgress = ref(0)
const isReady = ref(false)

const ingredients = ref({
  beans: 500, // grams
  water: 2000, // ml
  milk: 1000, // ml
})

const maxIngredients = {
  beans: 1000,
  water: 3000,
  milk: 2000,
}

const logs = ref<string[]>(['Thermal system stabilized.', 'Coffee Core v2.2 ready.'])

const hardwareStats = [
  { label: 'Voltage', value: '230V', icon: 'heroicons:bolt', color: 'text-amber-500' },
  { label: 'Pressure', value: '9.2 Bar', icon: 'heroicons:variable', color: 'text-emerald-500' },
  { label: 'Temp', value: '92.5°C', icon: 'heroicons:fire', color: 'text-blue-500' },
  { label: 'Uptime', value: '18h 12m', icon: 'heroicons:clock', color: 'text-purple-500' },
]

const hasMilk = computed(() => {
  if (!selectedProduct.value) return true // Default to enabled if nothing selected or handles customization before selection
  return selectedProduct.value.recipe.milk > 0
})

function selectProduct(id: string) {
  if (isBrewing.value || isReady.value) return
  selectedProductId.value = id
  
  // If new product doesn't have milk, we can reset or just let the disabled state handle it
  if (!products.find(p => p.id === id)?.recipe.milk) {
    // Optional: milkType.value = 'None' if you have a none type, but here we just disable selection
  }
}

async function startBrew() {
  if (!selectedProduct.value || isBrewing.value || isReady.value) return
  
  const recipe = selectedProduct.value.recipe
  if (ingredients.value.beans < recipe.beans || ingredients.value.water < recipe.water || (recipe.milk > 0 && ingredients.value.milk < recipe.milk)) {
    alert('Insufficient ingredients!')
    return
  }

  isBrewing.value = true
  brewProgress.value = 0
  
  // Deduced ingredients
  ingredients.value.beans -= recipe.beans
  ingredients.value.water -= recipe.water
  if (recipe.milk > 0) ingredients.value.milk -= recipe.milk

  logs.value.unshift(`[MACHINE] Starting brew: ${selectedProduct.value.name}`)
  if (logs.value.length > 15) logs.value.pop()

  const interval = setInterval(() => {
    brewProgress.value += 5
    if (brewProgress.value >= 100) {
      clearInterval(interval)
      isBrewing.value = false
      isReady.value = true
      logs.value.unshift(`[MACHINE] Brew complete. Ready for collection.`)
    }
  }, 200)
}

function collectDrink() {
  isReady.value = false
  selectedProductId.value = null
  brewProgress.value = 0
  sugarLevel.value = 0
  milkType.value = 'Regular'
}

function resetMachine() {
  ingredients.value = { beans: 500, water: 2000, milk: 1000 }
  selectedProductId.value = null
  isBrewing.value = false
  isReady.value = false
  brewProgress.value = 0
  sugarLevel.value = 0
  milkType.value = 'Regular'
}

const sugarLevels = [
  { icon: 'heroicons:minus', label: 'None' },
  { icon: 'heroicons:sparkles', label: 'Low' },
  { icon: 'heroicons:sparkles', label: 'Medium' },
  { icon: 'heroicons:fire', label: 'High' },
]

const milkOptions = ['Regular', 'Skim', 'Oat', 'Soy']
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-full min-h-[850px] overflow-hidden">
    
    <!-- LEFT: THE MACHINE FACE (75%) -->
    <div class="lg:col-span-12 xl:col-span-9 p-10 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden h-full">
       
       <!-- COFFEE MACHINE BODY -->
       <div class="w-full max-w-[850px] bg-[#1e1e1e] border-[12px] border-[#2a2a2a] rounded-[40px] p-0 shadow-2xl relative flex flex-col h-full overflow-hidden">
          
          <!-- MACHINE HEADER -->
          <div class="w-full bg-[#8b4513] py-4 px-8 flex items-center justify-between shadow-lg">
             <div class="flex-1 text-center">
                <h2 class="text-white font-black text-2xl tracking-[0.2em] uppercase">Café Express</h2>
             </div>
             <button @click="resetMachine" class="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-all active:scale-90">
                <Icon name="heroicons:arrow-path" class="text-lg" />
             </button>
          </div>

          <!-- SELECTION AREA -->
          <div class="p-8 flex-1 flex flex-col overflow-hidden min-h-0">
             <div class="text-center mb-6">
                <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Select Your Drink</p>
             </div>

             <div class="grid grid-cols-3 gap-6 overflow-y-auto custom-scrollbar p-1">
                <div v-for="product in products" :key="product.id"
                  @click="selectProduct(product.id)"
                  class="bg-[#2a2a2a] rounded-3xl p-6 flex flex-col items-center border-4 transition-all cursor-pointer group aspect-[4/5] relative"
                  :class="[
                    selectedProductId === product.id ? 'border-amber-600 ring-4 ring-amber-600/20' : 'border-transparent hover:bg-[#333333]',
                    (isBrewing || isReady) && selectedProductId !== product.id ? 'opacity-40 grayscale pointer-events-none' : ''
                  ]"
                >
                   <div v-if="selectedProductId === product.id" class="absolute top-4 right-4 text-amber-600">
                      <Icon name="heroicons:check-circle-solid" class="text-xl" />
                   </div>
                   
                   <div :class="[product.color, 'w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl group-hover:scale-110 transition-transform']">
                      <Icon :name="product.icon" class="text-3xl" />
                   </div>
                   
                   <h4 class="text-md font-black text-white uppercase tracking-tight mb-1">{{ product.name }}</h4>
                   <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">{{ product.description }}</p>
                   
                   <div class="mt-auto px-4 py-1.5 bg-black/40 rounded-full border border-white/5">
                      <span class="text-sm font-black text-amber-500 tabular-nums">${{ product.price.toFixed(2) }}</span>
                   </div>
                </div>
             </div>

             <!-- BREWING DISPLAY (Bottom) -->
             <div class="mt-8 bg-black/40 border-4 border-[#1a1a1a] rounded-[30px] p-8 flex flex-col items-center justify-center relative min-h-[220px] shadow-inner">
                
                <!-- COFFEE DISPENSER NOZZLE -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-zinc-700 rounded-b-xl border-x-2 border-b-2 border-zinc-900 shadow-lg"></div>

                <!-- THE CUP -->
                <div class="relative w-24 h-28 mt-4 overflow-hidden">
                   <!-- CUP EXTERIOR -->
                   <div class="absolute inset-0 bg-white rounded-b-lg border-2 border-zinc-200"></div>
                   <div class="absolute -right-4 top-1/4 w-8 h-12 border-[6px] border-white bg-transparent rounded-[50%]"></div>
                   
                   <!-- COFFEE LIQUID -->
                   <div class="absolute bottom-0 inset-x-0 bg-[#3d2b1f] transition-all duration-300"
                        :style="{ height: isReady ? '85%' : isBrewing ? `${brewProgress * 0.85}%` : '0%' }">
                      <div v-if="isBrewing" class="absolute top-0 inset-x-0 h-1 bg-[#5d4037] animate-pulse"></div>
                   </div>
                </div>

                <!-- BREWING INDICATORS -->
                <div v-if="isBrewing" class="absolute bottom-6 left-6 right-6 flex flex-col items-center gap-2">
                   <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div class="h-full bg-amber-600 transition-all duration-300" :style="{ width: `${brewProgress}%` }"></div>
                   </div>
                   <div class="flex items-center gap-2">
                      <p class="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] animate-pulse">Brewing...</p>
                      <span class="text-[9px] font-black text-white tabular-nums">{{ brewProgress }}%</span>
                   </div>
                </div>

                <!-- COLLECT ACTION -->
                <div v-if="isReady" class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 rounded-[24px]">
                   <button @click="collectDrink" class="px-8 py-4 bg-emerald-600 border-b-4 border-emerald-800 rounded-2xl text-white font-black uppercase text-sm flex items-center gap-3 hover:scale-105 active:translate-y-1 active:border-b-0 transition-all shadow-2xl">
                      <Icon name="heroicons:beaker" class="text-xl" />
                      Collect Your Drink
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- RIGHT: THE CONTROL PANEL (25%) -->
    <div class="lg:col-span-12 xl:col-span-3 border-l-4 border-[#2a2a2a] bg-zinc-950 p-8 flex flex-col space-y-6 overflow-y-auto custom-scrollbar h-full">
       
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

       <!-- STATUS DISPLAY -->
       <div class="w-full bg-[#0a0f05] border-2 border-[#1a2d1a] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[120px] shadow-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-emerald-500/5 group-hover:opacity-10 transition-opacity"></div>
          <div class="text-center z-10">
             <template v-if="isReady">
                <p class="text-emerald-500 font-black text-xl uppercase tracking-widest animate-pulse">Ready!</p>
             </template>
             <template v-else-if="isBrewing">
                <Icon name="heroicons:arrow-path" class="text-amber-500 text-3xl animate-spin mb-2" />
                <p class="text-amber-500 font-black text-xs uppercase tracking-widest">Brewing...</p>
             </template>
             <template v-else-if="selectedProduct">
                <p class="text-amber-500 font-black text-xs uppercase tracking-widest mb-1">{{ selectedProduct.name }}</p>
                <p class="text-white font-black text-2xl tabular-nums">${{ selectedProduct.price.toFixed(2) }}</p>
             </template>
             <template v-else>
                <p class="text-emerald-500 font-black text-xs uppercase tracking-widest animate-blink">Select Drink</p>
             </template>
          </div>
          <!-- CRT SCANLINE EFFECT -->
          <div class="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
       </div>

       <!-- INGREDIENTS STATUS -->
       <div class="space-y-4">
          <div class="flex items-center justify-between">
             <h4 class="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Ingredients</h4>
             <button @click="resetMachine" class="text-zinc-700 hover:text-white transition-colors">
                <Icon name="heroicons:arrow-path" class="text-sm" />
             </button>
          </div>
          
          <div class="space-y-3">
             <div v-for="(val, key) in ingredients" :key="key" class="space-y-1.5">
                <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                   <span class="text-zinc-500 flex items-center gap-2">
                      <Icon :name="key === 'beans' ? 'heroicons:variable' : key === 'water' ? 'heroicons:beaker' : 'heroicons:sparkles'" class="text-xs" />
                      {{ key === 'beans' ? 'Coffee Beans' : key.charAt(0).toUpperCase() + key.slice(1) }}
                   </span>
                   <span class="text-white tabular-nums">{{ val }}{{ key === 'beans' ? 'g' : 'ml' }}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <div class="h-full transition-all duration-500" 
                        :class="val < 50 ? 'bg-red-500' : 'bg-amber-600'"
                        :style="{ width: `${(val / maxIngredients[key]) * 100}%` }"></div>
                </div>
             </div>
          </div>
       </div>

       <!-- CUSTOMIZATION -->
       <div class="space-y-6 pt-4 border-t border-white/5">
          <!-- Sugar Level -->
          <div class="space-y-3">
             <h4 class="text-center text-zinc-500 font-black uppercase text-[10px] tracking-widest">Sugar Level</h4>
             <div class="flex gap-2">
                <button v-for="(level, idx) in sugarLevels" :key="idx"
                  @click="sugarLevel = idx"
                  class="flex-1 aspect-square rounded-xl border-2 flex items-center justify-center transition-all group"
                  :class="[sugarLevel === idx ? 'border-amber-600 bg-amber-600/10' : 'border-white/5 bg-white/5 hover:border-white/10']"
                >
                   <Icon :name="level.icon" class="text-lg" :class="sugarLevel === idx ? 'text-amber-500' : 'text-zinc-700'" />
                </button>
             </div>
          </div>

          <!-- Milk Type -->
          <div class="space-y-3" :class="{'opacity-30 grayscale pointer-events-none select-none': !hasMilk}">
             <h4 class="text-center text-zinc-500 font-black uppercase text-[10px] tracking-widest">
                Milk Type <span v-if="!hasMilk" class="text-[7px] text-red-500 opacity-100">(Disabled)</span>
             </h4>
             <div class="grid grid-cols-2 gap-2">
                <button v-for="option in milkOptions" :key="option"
                  @click="milkType = option"
                  class="py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all"
                  :class="[milkType === option ? 'border-amber-600 bg-amber-600/10 text-white' : 'border-white/5 bg-white/5 text-zinc-600 hover:text-white']"
                >
                   {{ option }}
                </button>
             </div>
          </div>
       </div>

       <!-- ACTIONS -->
       <div class="pt-6 space-y-3 mt-auto">
          <button @click="startBrew"
             class="w-full py-4 bg-emerald-600 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
             :disabled="!selectedProductId || isBrewing || isReady"
          >
             <Icon name="heroicons:beaker" class="text-lg" />
             Brew
          </button>
          <button @click="selectedProductId = null"
             class="w-full py-3 bg-zinc-900 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:text-red-400 font-black uppercase text-[10px] tracking-widest transition-all"
             :disabled="isBrewing || isReady"
          >
             <Icon name="heroicons:x-mark" class="text-xs" />
             Cancel
          </button>
       </div>

       <!-- SYSTEM LOG -->
       <div class="flex-1 flex flex-col min-h-[200px] overflow-hidden">
          <h4 class="text-zinc-600 font-black uppercase tracking-[0.1em] text-[8px] mb-3 flex items-center justify-between px-1">
             Process Log
             <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          </h4>
          <div class="flex-1 bg-black rounded-xl p-4 font-mono text-[9px] overflow-y-auto custom-scrollbar border border-white/5 shadow-inner">
             <div v-for="(log, i) in logs" :key="i" class="mb-2 flex gap-2 opacity-50">
                <span class="text-zinc-800 shrink-0">{{ new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) }}</span>
                <span :class="log.includes('MACHINE') ? 'text-blue-400' : 'text-zinc-500'">{{ log }}</span>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHT -->
       <div class="p-4 bg-zinc-950/80 border border-blue-500/20 rounded-xl flex gap-3 shrink-0 shadow-lg mt-auto">
          <Icon name="heroicons:cpu-chip" class="text-blue-500 text-lg shrink-0" />
          <div>
             <p class="text-[9px] font-black text-white uppercase tracking-tight mb-0.5">Hydraulics Control</p>
             <p class="text-[7px] text-zinc-500 leading-tight font-medium uppercase">Uses PID controllers to maintain constant 9-bar extraction pressure for perfect crema development.</p>
          </div>
       </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

.animate-blink { animation: blink 1.2s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
