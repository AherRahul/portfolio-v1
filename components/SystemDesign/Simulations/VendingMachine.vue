<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  maxStock: number
  icon: string
  color: string
}

type VendingState = 'IDLE' | 'SELECTING' | 'WAITING_PAYMENT' | 'DISPENSING' | 'COLLECT'

const currentState = ref<VendingState>('IDLE')
const products = ref<Product[]>([
  { id: 'A1', name: 'Original Cola', price: 1.75, stock: 5, maxStock: 8, icon: 'heroicons:beaker', color: 'bg-red-500' },
  { id: 'A2', name: 'Lemon Soda', price: 1.50, stock: 3, maxStock: 8, icon: 'heroicons:sparkles', color: 'bg-amber-400' },
  { id: 'A3', name: 'Pure Water', price: 1.00, stock: 8, maxStock: 8, icon: 'heroicons:variable', color: 'bg-blue-400' },
  { id: 'B1', name: 'Potato Chips', price: 1.50, stock: 6, maxStock: 8, icon: 'heroicons:gift', color: 'bg-yellow-500' },
  { id: 'B2', name: 'Pretzels', price: 1.25, stock: 4, maxStock: 8, icon: 'heroicons:command-line', color: 'bg-orange-500' },
  { id: 'B3', name: 'Choco Cookies', price: 2.00, stock: 5, maxStock: 8, icon: 'heroicons:circle-stack', color: 'bg-amber-800' },
  { id: 'C1', name: 'Dark Chocolate', price: 2.25, stock: 7, maxStock: 8, icon: 'heroicons:puzzle-piece', color: 'bg-orange-950' },
  { id: 'C2', name: 'Gummy Bears', price: 1.50, stock: 5, maxStock: 8, icon: 'heroicons:heart', color: 'bg-pink-500' },
  { id: 'C3', name: 'Breath Mints', price: 0.75, stock: 8, maxStock: 8, icon: 'heroicons:star', color: 'bg-teal-500' },
])

const credit = ref(0)
const selectionCode = ref('')
const dispensedItem = ref<Product | null>(null)
const logs = ref<string[]>(['Vending Interface Initialized.', 'Awaiting Code Selection...'])
const ledMessage = ref('')

const currentSelectedProduct = computed(() => {
  if (selectionCode.value.length < 2) return null
  return products.value.find(p => p.id === selectionCode.value)
})

function handleKeypad(key: string) {
  if (currentState.value === 'DISPENSING' || currentState.value === 'COLLECT') return

  if (key === 'CLR') {
    selectionCode.value = ''
    currentState.value = 'IDLE'
    ledMessage.value = ''
  } else if (key === 'OK') {
    if (selectionCode.value.length === 2) validateSelection()
  } else if (selectionCode.value.length < 2) {
    selectionCode.value += key
    currentState.value = 'SELECTING'
    if (selectionCode.value.length === 2) {
      validateSelection()
    }
  }
}

function validateSelection() {
  const product = currentSelectedProduct.value
  if (!product) {
    ledMessage.value = 'INVALID CODE'
    selectionCode.value = ''
    setTimeout(() => { ledMessage.value = ''; currentState.value = 'IDLE' }, 2000)
    return
  }

  if (product.stock <= 0) {
    ledMessage.value = 'SOLD OUT'
    selectionCode.value = ''
    setTimeout(() => { ledMessage.value = ''; currentState.value = 'IDLE' }, 2000)
    return
  }

  currentState.value = 'WAITING_PAYMENT'
  updateLedMessage()
  
  if (credit.value >= product.price) {
    dispenseSequence()
  }
}

function updateLedMessage() {
  const product = currentSelectedProduct.value
  if (product) {
    if (credit.value < product.price) {
      const remaining = product.price - credit.value
      ledMessage.value = `INSERT $${remaining.toFixed(2)}`
    } else {
      ledMessage.value = 'THANK YOU'
    }
  }
}

function addMoney(amount: number) {
  if (currentState.value !== 'WAITING_PAYMENT') {
    ledMessage.value = 'SELECT CODE FIRST'
    setTimeout(() => { if (currentState.value === 'IDLE') ledMessage.value = '' }, 2000)
    return
  }

  credit.value += amount
  logs.value.unshift(`PAYMENT: +$${amount.toFixed(2)}. Total: $${credit.value.toFixed(2)}`)
  updateLedMessage()
  
  if (currentSelectedProduct.value && credit.value >= currentSelectedProduct.value.price) {
    dispenseSequence()
  }
}

function dispenseSequence() {
  const product = currentSelectedProduct.value
  if (!product) return

  currentState.value = 'DISPENSING'
  ledMessage.value = 'RELEASING ITEM...'
  logs.value.unshift(`ENGINE: Dispensing slot ${product.id} (${product.name})`)

  setTimeout(() => {
    product.stock--
    credit.value -= product.price
    dispensedItem.value = JSON.parse(JSON.stringify(product))
    currentState.value = 'COLLECT'
    ledMessage.value = 'READY'
    logs.value.unshift(`SUCCESS: Item dispensed. Remaining Credit: $${credit.value.toFixed(2)}`)
    selectionCode.value = ''
  }, 1200)
}

function collectItem() {
  dispensedItem.value = null
  currentState.value = 'IDLE'
  ledMessage.value = credit.value > 0 ? `CREDIT: $${credit.value.toFixed(2)}` : 'THANK YOU'
  setTimeout(() => {
    if (currentState.value === 'IDLE') ledMessage.value = ''
  }, 2500)
}

function resetSession() {
  if (credit.value > 0) {
    logs.value.unshift(`REFUND: Returned $${credit.value.toFixed(2)} change.`)
    credit.value = 0
  }
  selectionCode.value = ''
  currentState.value = 'IDLE'
  ledMessage.value = 'SESSION RESET'
  setTimeout(() => ledMessage.value = '', 1500)
}

const stats = [
  { label: 'Voltage', value: '230VAC', icon: 'heroicons:bolt', color: 'text-amber-500' },
  { label: 'Credit', value: computed(() => `$${credit.value.toFixed(2)}`), icon: 'heroicons:banknotes', color: 'text-emerald-500' },
  { label: 'Status', value: computed(() => currentState.value), icon: 'heroicons:cpu-chip', color: 'text-purple-500' },
  { label: 'Temp', value: '4°C', icon: 'heroicons:swatch', color: 'text-blue-500' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-2xl border border-white/5 relative h-full min-h-[850px] overflow-hidden">
    
    <!-- LEFT: THE VENDING HARDWARE FRONT (75%) -->
    <div class="lg:col-span-12 xl:col-span-9 p-10 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden h-full">
       
       <!-- THE MACHINE SHELL -->
       <div class="w-full max-w-[850px] bg-[#1a2233] border-8 border-[#0f172a] rounded-[30px] p-6 shadow-2xl relative flex flex-col h-full space-y-6">
          
          <!-- BRAND BAR -->
          <div class="w-full bg-[#10b981] rounded-2xl py-3 px-6 flex items-center justify-between shadow-lg">
             <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white">
                   <Icon name="heroicons:shopping-cart" class="text-xl" />
                </div>
                <div>
                   <h2 class="text-white font-black text-lg tracking-tighter uppercase leading-none mb-0.5">Rahul aher Vending</h2>
                   <p class="text-[9px] text-white/70 font-bold uppercase tracking-widest">Premium Refreshments 24/7</p>
                </div>
             </div>
             <button @click="resetSession" class="w-8 h-8 bg-black/20 rounded-lg flex items-center justify-center text-white hover:bg-black/30 transition-all active:scale-95">
                <Icon name="heroicons:arrow-path" class="text-sm" />
             </button>
          </div>

          <!-- CORE FACE: PRODUCTS + CONTROLS -->
          <div class="flex flex-1 gap-8 overflow-hidden min-h-0">
             
             <!-- PRODUCT VAULT (Glass window) -->
             <div class="flex-1 bg-black/60 rounded-2xl border-4 border-[#0d1117] p-4 grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar shadow-inner relative">
                <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-white/5 pointer-events-none"></div>
                
                <div v-for="product in products" :key="product.id" 
                  class="bg-white rounded-xl p-3 flex flex-col items-center relative transition-all border-2 group aspect-[4/5]"
                  :class="[
                    selectionCode === product.id ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-[1.02]' : 'border-transparent',
                    product.stock <= 0 ? 'opacity-30 grayscale' : 'hover:scale-[1.01]'
                  ]"
                >
                   <div class="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-900 border border-zinc-200 uppercase">{{ product.id }}</div>
                   <div :class="[product.color, 'w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2 shadow-lg transition-transform group-hover:scale-110']">
                      <Icon :name="product.icon" class="text-2xl" />
                   </div>
                   <h4 class="text-[10px] font-black text-zinc-900 uppercase tracking-tight mb-1 text-center truncate w-full">{{ product.name }}</h4>
                   <div class="w-full flex justify-between items-end mt-auto pt-2 border-t border-zinc-50">
                      <span class="text-sm font-black text-emerald-600 tabular-nums">${{ product.price.toFixed(2) }}</span>
                      <span class="text-[8px] font-black text-zinc-400">{{ product.stock }}/8</span>
                   </div>
                </div>
             </div>

             <!-- CONTROL PANEL -->
             <div class="w-64 flex flex-col space-y-6">
                <!-- LED CONSOLE -->
                <div class="w-full h-36 bg-[#0a0f1d] border-4 border-[#1e293b] rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shrink-0">
                   <div class="absolute inset-0 bg-emerald-500/5"></div>
                   <div v-if="ledMessage" class="text-center z-10">
                      <p class="text-[11px] font-black text-emerald-400 uppercase tracking-widest animate-blink leading-tight">{{ ledMessage }}</p>
                   </div>
                   <div v-else-if="currentSelectedProduct" class="text-center z-10">
                      <p class="text-[10px] font-black text-blue-400 uppercase mb-0.5">{{ currentSelectedProduct.id }}</p>
                      <p class="text-xs font-black text-white uppercase">${{ currentSelectedProduct.price.toFixed(2) }}</p>
                   </div>
                   <div v-else class="text-center z-10">
                      <p class="text-4xl font-mono font-black text-emerald-500/20 tabular-nums">{{ selectionCode || '--' }}</p>
                   </div>
                   <div class="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
                </div>

                <!-- KEYPAD -->
                <div class="grid grid-cols-3 gap-2 bg-[#0f172a] p-3 rounded-xl border-b-4 border-black shrink-0">
                   <button v-for="key in ['A', 'B', 'C', 'D', '1', '2', '3', 'CLR', 'OK']" :key="key" 
                     @click="handleKeypad(key)"
                     class="aspect-square flex items-center justify-center rounded-lg font-black text-sm transition-all active:scale-90 active:translate-y-1 shadow-[0_3px_0_0_rgba(0,0,0,0.6)] border border-white/5"
                     :class="[
                       key === 'CLR' ? 'bg-red-500/80 text-white' : 
                       key === 'OK' ? 'bg-emerald-600/80 text-white' : 
                       'bg-zinc-800 text-white'
                     ]"
                   >
                      {{ key }}
                   </button>
                </div>

                <!-- PAYMENT SYSTEM -->
                <div class="flex-1 bg-black/40 border border-white/5 rounded-xl p-4 space-y-3 min-h-0 flex flex-col justify-center">
                   <div class="flex justify-between items-center mb-1">
                      <p class="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Credit</p>
                      <p class="text-lg font-black text-emerald-400 tabular-nums">${{ credit.toFixed(2) }}</p>
                   </div>
                   <div class="grid grid-cols-2 gap-2">
                      <button @click="addMoney(0.25)" class="py-2 bg-zinc-800 border border-white/5 rounded-lg text-[9px] font-black text-white/50 hover:text-white uppercase transition-all active:scale-95">Add 25¢</button>
                      <button @click="addMoney(1.00)" class="py-2 bg-zinc-800 border border-white/5 rounded-lg text-[9px] font-black text-white/50 hover:text-white uppercase transition-all active:scale-95">Add $1</button>
                   </div>
                   <button @click="resetSession" class="w-full py-2 bg-zinc-900 border border-white/5 rounded-lg text-[8px] font-black text-zinc-500 uppercase flex items-center justify-center gap-2 hover:text-red-400 transition-colors">
                      <Icon name="heroicons:arrow-uturn-left" class="text-xs" />
                      Refund / Reset
                   </button>
                </div>
             </div>
          </div>

          <!-- DISPENSE BIN (Bottom) -->
          <div class="w-full h-28 bg-[#0d1117] border-4 border-black rounded-2xl relative flex items-center justify-center overflow-hidden shadow-[inset_0_8px_24px_rgba(0,0,0,0.8)] mt-auto shrink-0">
             <div v-if="dispensedItem" class="animate-drop-in flex items-center">
                <button @click="collectItem" class="group flex items-center gap-4 px-8 py-4 bg-emerald-500 border-b-4 border-emerald-700 rounded-xl text-white shadow-2xl hover:scale-105 active:translate-y-1 active:border-b-0 transition-all">
                   <Icon :name="dispensedItem.icon" class="text-3xl group-hover:rotate-12 transition-transform" />
                   <span class="text-sm font-black uppercase tracking-tight">Collect Item</span>
                </button>
             </div>
             <div v-else-if="currentState === 'DISPENSING'" class="flex items-center gap-3 text-blue-500 animate-pulse">
                <Icon name="heroicons:arrow-path" class="text-xl animate-spin" />
                <span class="text-[10px] font-black uppercase tracking-widest">Releasing...</span>
             </div>
             <div v-else class="text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">Dispense Bin</div>
          </div>
       </div>
    </div>

    <!-- RIGHT: ANALYTICS HUD (25%) -->
    <div class="lg:col-span-12 xl:col-span-3 flex flex-col border-l-4 border-[#0f172a] bg-zinc-900/40 p-8 space-y-6 overflow-y-auto custom-scrollbar h-full">
       <!-- HUD STAT GRID -->
       <div class="grid grid-cols-2 gap-3 shrink-0">
          <div v-for="stat in stats" :key="stat.label" class="bg-black/60 border border-white/5 p-4 rounded-xl flex items-center gap-3">
             <Icon :name="stat.icon" :class="['text-xs', stat.color]" />
             <div>
                <p class="text-[7px] font-black text-zinc-500 uppercase leading-none mb-1">{{ stat.label }}</p>
                <p class="text-[10px] font-black text-white tabular-nums tracking-tight">{{ typeof stat.value === 'string' ? stat.value : stat.value.value }}</p>
             </div>
          </div>
       </div>

       <!-- SYSTEM LOG -->
       <div class="flex-1 flex flex-col min-h-[300px] overflow-hidden">
          <h4 class="text-zinc-600 font-black uppercase tracking-[0.1em] text-[8px] mb-3 flex items-center justify-between">
             Controller Log
             <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          </h4>
          <div class="flex-1 bg-black rounded-xl p-4 font-mono text-[9px] overflow-y-auto custom-scrollbar border border-white/5 shadow-inner">
             <div v-for="(log, i) in logs" :key="i" class="mb-2 flex gap-2 opacity-60">
                <span class="text-zinc-800 shrink-0">{{ new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) }}</span>
                <span :class="log.includes('PAYMENT') ? 'text-emerald-500' : log.includes('SUCCESS') ? 'text-blue-400' : 'text-zinc-500'">{{ log }}</span>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHT -->
       <div class="p-4 bg-zinc-950/80 border border-emerald-500/20 rounded-xl flex gap-4 shrink-0 shadow-lg">
          <Icon name="heroicons:cpu-chip" class="text-emerald-500 text-lg shrink-0" />
          <div>
             <p class="text-[9px] font-black text-white uppercase tracking-tight mb-0.5">State Control</p>
             <p class="text-[8px] text-zinc-500 leading-tight font-medium uppercase">Atomic release sequence protects inventory data shards during power-off events.</p>
          </div>
       </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

.animate-drop-in { animation: drop-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
@keyframes drop-in {
  0% { transform: translateY(-150px) rotate(-15deg) scale(0.5); opacity: 0; }
  60% { transform: translateY(10px) rotate(5deg) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) rotate(0) scale(1); }
}

.animate-blink { animation: blink 1.2s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
