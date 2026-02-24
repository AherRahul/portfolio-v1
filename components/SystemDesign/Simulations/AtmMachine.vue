<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type AtmState = 'IDLE' | 'PIN_ENTRY' | 'MAIN_MENU' | 'BALANCE' | 'WITHDRAW' | 'DEPOSIT' | 'HISTORY' | 'SUCCESS'

const currentState = ref<AtmState>('IDLE')
const cardInserted = ref(false)
const pinBuffer = ref('')
const amountBuffer = ref('')
const balance = ref(2547.83)
const userPin = '1234'
const userName = 'John Smith'
const cardNumber = '**** **** **** 4582'
const logs = ref<string[]>(['ATM Kernel initialized.', 'Waiting for card insertion...'])
const history = ref<{ type: string, amount: number, date: string, balance: number }[]>([
  { type: 'Withdrawal', amount: 40, date: 'Feb 22, 10:15 AM', balance: 2587.83 },
  { type: 'Deposit', amount: 500, date: 'Feb 20, 02:45 PM', balance: 2627.83 }
])

interface Receipt {
  date: string
  type: string
  amount: number
  balance: number
}
const lastReceipt = ref<Receipt | null>(null)
const showReceipt = ref(false)

function insertCard() {
  cardInserted.value = true
  currentState.value = 'PIN_ENTRY'
  logs.value.unshift('CARD_READER: Card detected. Initiating AUTH...')
}

function handleKeypad(key: string) {
  if (currentState.value === 'PIN_ENTRY') {
    if (key === 'CLR') {
      pinBuffer.value = ''
    } else if (key === 'ESC') {
      resetATM()
    } else if (pinBuffer.value.length < 4) {
      pinBuffer.value += key
      if (pinBuffer.value.length === 4) {
        setTimeout(authenticate, 500)
      }
    }
  } else if (currentState.value === 'WITHDRAW' || currentState.value === 'DEPOSIT') {
    if (key === 'CLR') {
      amountBuffer.value = ''
    } else if (key === 'ESC') {
      currentState.value = 'MAIN_MENU'
      amountBuffer.value = ''
    } else {
      amountBuffer.value += key
    }
  }
}

function authenticate() {
  if (pinBuffer.value === userPin) {
    currentState.value = 'MAIN_MENU'
    logs.value.unshift(`AUTH: Identity verified for ${userName.toUpperCase()}.`)
    pinBuffer.value = ''
  } else {
    logs.value.unshift('AUTH_ERROR: Invalid PIN. Security alert logged.')
    pinBuffer.value = ''
  }
}

function selectAction(action: AtmState) {
  currentState.value = action
  amountBuffer.value = ''
}

function processTransaction() {
  const amount = parseFloat(amountBuffer.value)
  if (isNaN(amount) || amount <= 0) return

  if (currentState.value === 'WITHDRAW') {
    if (amount > balance.value) {
      logs.value.unshift('TRANS_ERROR: Insufficient funds.')
      return
    }
    balance.value -= amount
    history.value.unshift({ type: 'Withdrawal', amount, date: new Date().toLocaleString(), balance: balance.value })
    logs.value.unshift(`COMMIT: Dispensed $${amount.toFixed(2)}. Vault capacity updated.`)
  } else if (currentState.value === 'DEPOSIT') {
    balance.value += amount
    history.value.unshift({ type: 'Deposit', amount, date: new Date().toLocaleString(), balance: balance.value })
    logs.value.unshift(`COMMIT: Received $${amount.toFixed(2)}. Electronic ledger updated.`)
  }

  lastReceipt.value = {
    date: new Date().toLocaleString(),
    type: currentState.value === 'WITHDRAW' ? 'Withdrawal' : 'Deposit',
    amount: amount,
    balance: balance.value
  }
  currentState.value = 'SUCCESS'
}

function resetATM() {
  cardInserted.value = false
  currentState.value = 'IDLE'
  pinBuffer.value = ''
  amountBuffer.value = ''
  showReceipt.value = false
  logs.value.unshift('SESSION: Card ejected. Terminal reset to IDLE.')
}

const systemStats = [
  { label: 'Bank API Latency', value: '42ms', icon: 'heroicons:signal', color: 'text-emerald-500' },
  { label: 'Vault Level', value: '$84,200', icon: 'heroicons:banknotes', color: 'text-blue-500' },
  { label: 'Thermal', value: '34°C', icon: 'heroicons:fire', color: 'text-amber-500' },
  { label: 'Encryption', value: 'AES-256', icon: 'heroicons:shield-check', color: 'text-purple-500' }
]

const insights = [
  { title: 'State Pattern', desc: 'Encapsulates behavior within state objects (Idle, Auth, Withdrawal) to avoid complex conditionals.' },
  { title: 'Transaction Atomicity', desc: 'Uses DB transactions to ensure money is only deducted if cash is successfully dispensed.' },
  { title: 'HSM Integration', desc: 'Hardware Security Modules handle PIN encryption isolated from the main logic processor.' }
]
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950 rounded-1xl border border-white/5 relative h-full min-h-[850px] overflow-hidden">
    
    <!-- LEFT: ATM MACHINE HARDWARE -->
    <div class="lg:col-span-12 xl:col-span-9 p-10 bg-black/20 flex flex-col items-center justify-start relative overflow-hidden h-full">
       
       <!-- THE ATM BOX -->
       <div class="w-full max-w-[650px] bg-[#1a2233] border-4 border-[#0f172a] rounded-[10px] p-6 shadow-2xl relative flex flex-col items-center">
          
          <!-- BANK BRANDING -->
          <div class="w-full bg-[#10b981] rounded-1xl py-6 px-10 flex items-center justify-between shadow-lg mb-8">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                   <Icon name="heroicons:building-library" class="text-2xl" />
                </div>
                <div>
                   <h2 class="text-white font-black text-2xl tracking-tighter uppercase leading-none mb-1">Rahul aher Bank</h2>
                   <p class="text-[10px] text-white/70 font-bold uppercase tracking-widest">Secure Banking 24/7</p>
                </div>
             </div>
             <button @click="resetATM" class="w-10 h-10 bg-white/10 rounded-1xl flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95">
                <Icon name="heroicons:arrow-path" class="text-xl" />
             </button>
          </div>

          <!-- MAIN SCREEN AREA -->
          <div class="flex w-full gap-6">
             <!-- THE DIGITAL DISPLAY -->
             <div class="flex-1 aspect-[4/3] bg-[#0a0f1d] rounded-1xl border-2 border-white/5 shadow-inner p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent animate-pulse"></div>

                <!-- STATE: IDLE -->
                <div v-if="currentState === 'IDLE'" class="flex flex-col items-center text-center">
                   <div class="w-20 h-20 bg-emerald-500/10 rounded-1xl flex items-center justify-center mb-6 animate-bounce">
                      <Icon name="heroicons:building-library" class="text-4xl text-emerald-500" />
                   </div>
                   <h3 class="text-2xl font-black text-white uppercase tracking-tighter mb-2">Welcome</h3>
                   <p class="text-sm text-zinc-500 font-bold uppercase tracking-widest">Please insert your card to begin</p>
                   <div class="mt-8 w-24 h-1 bg-emerald-500/20 rounded-2xl overflow-hidden">
                      <div class="h-full bg-emerald-500 animate-loading-bar"></div>
                   </div>
                </div>

                <!-- STATE: PIN_ENTRY -->
                <div v-if="currentState === 'PIN_ENTRY'" class="w-full space-y-6 text-center">
                   <div class="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                      Welcome, John Smith
                      <p class="text-[9px] mt-1">{{ cardNumber }}</p>
                   </div>
                   <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Enter your PIN</h3>
                   <div class="flex gap-4 justify-center py-4">
                      <div v-for="i in 4" :key="i" class="w-4 h-4 rounded-1xl border-2 transition-all duration-300"
                        :class="pinBuffer.length >= i ? 'bg-emerald-500 border-emerald-500 scale-125' : 'border-zinc-700 bg-zinc-900'">
                      </div>
                   </div>
                   <p class="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">Demo PIN: <span class="bg-emerald-500/10 px-2 py-1 rounded">1234</span></p>
                </div>

                <!-- STATE: MAIN_MENU -->
                <div v-if="currentState === 'MAIN_MENU'" class="w-full h-full flex flex-col">
                   <div class="text-center mb-6 shrink-0">
                      <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Welcome back,</p>
                      <h4 class="text-xl font-black text-white uppercase tracking-tight">John Smith</h4>
                   </div>
                   <div class="grid grid-cols-2 gap-4 flex-1">
                      <button @click="selectAction('BALANCE')" class="bg-blue-600/10 border border-blue-500/20 rounded-1xl flex flex-col items-center justify-center gap-2 hover:bg-blue-600/20 transition-all group">
                         <Icon name="heroicons:currency-dollar" class="text-2xl text-blue-500 group-hover:scale-110 transition-transform" />
                         <span class="text-[10px] font-black text-white uppercase tracking-widest">Balance</span>
                      </button>
                      <button @click="selectAction('WITHDRAW')" class="bg-emerald-600/10 border border-emerald-500/20 rounded-1xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-600/20 transition-all group">
                         <Icon name="heroicons:arrow-down-tray" class="text-2xl text-emerald-500 group-hover:scale-110 transition-transform" />
                         <span class="text-[10px] font-black text-white uppercase tracking-widest">Withdraw</span>
                      </button>
                      <button @click="selectAction('DEPOSIT')" class="bg-purple-600/10 border border-purple-500/20 rounded-1xl flex flex-col items-center justify-center gap-2 hover:bg-purple-600/20 transition-all group">
                         <Icon name="heroicons:arrow-up-tray" class="text-2xl text-purple-500 group-hover:scale-110 transition-transform" />
                         <span class="text-[10px] font-black text-white uppercase tracking-widest">Deposit</span>
                      </button>
                      <button @click="selectAction('HISTORY')" class="bg-zinc-800/10 border border-zinc-700/20 rounded-1xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-800/20 transition-all group">
                         <Icon name="heroicons:clock" class="text-2xl text-zinc-500 group-hover:scale-110 transition-transform" />
                         <span class="text-[10px] font-black text-white uppercase tracking-widest">History</span>
                      </button>
                      <button @click="resetATM" class="col-span-2 bg-red-600/10 border border-red-500/20 rounded-1xl py-3 flex items-center justify-center gap-3 hover:bg-red-600/20 transition-all group">
                         <Icon name="heroicons:arrow-left-on-rectangle" class="text-xl text-red-500 group-hover:-translateX-1 transition-transform" />
                         <span class="text-[10px] font-black text-white uppercase tracking-widest">Exit Session</span>
                      </button>
                   </div>
                </div>

                <!-- STATE: BALANCE -->
                <div v-if="currentState === 'BALANCE'" class="w-full text-center space-y-6">
                   <h3 class="text-zinc-500 font-bold uppercase tracking-widest text-xs">Current Account Balance</h3>
                   <div class="text-5xl font-black text-white tabular-nums tracking-tighter">
                      ${{ balance.toFixed(2) }}
                   </div>
                   <div class="flex flex-col gap-3 max-w-[200px] mx-auto">
                      <button @click="currentState = 'MAIN_MENU'" class="w-full py-4 bg-emerald-600 text-white rounded-1xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95">Continue</button>
                   </div>
                </div>

                <!-- STATE: WITHDRAW / DEPOSIT -->
                <div v-if="currentState === 'WITHDRAW' || currentState === 'DEPOSIT'" class="w-full text-center space-y-6">
                   <h3 class="text-zinc-500 font-bold uppercase tracking-widest text-xs">{{ currentState === 'WITHDRAW' ? 'Withdrawal' : 'Deposit' }} Amount</h3>
                   <div class="flex items-center justify-center gap-2">
                      <span class="text-4xl font-black text-emerald-500 opacity-50">$</span>
                      <div class="text-5xl font-black text-white tabular-nums tracking-tighter">
                         {{ amountBuffer || '0' }}.00
                      </div>
                   </div>
                   <div class="grid grid-cols-2 gap-3 max-w-[300px] mx-auto">
                      <button @click="currentState = 'MAIN_MENU'" class="py-4 bg-zinc-900 border border-white/5 rounded-1xl text-[10px] font-black text-zinc-500 uppercase tracking-widest active:scale-95">Cancel</button>
                      <button @click="processTransaction" class="py-4 bg-emerald-600 text-white rounded-1xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95">Confirm</button>
                   </div>
                </div>

                <!-- STATE: HISTORY -->
                <div v-if="currentState === 'HISTORY'" class="w-full h-full flex flex-col">
                   <h4 class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Icon name="heroicons:clock" class="text-emerald-500" />
                      Recent Transactions
                   </h4>
                   <div class="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                      <div v-for="(tx, i) in history" :key="i" class="p-4 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-between">
                         <div>
                            <p class="text-[10px] font-black text-white uppercase">{{ tx.type }}</p>
                            <p class="text-[8px] font-bold text-zinc-500 uppercase">{{ tx.date }}</p>
                         </div>
                         <div class="text-right">
                            <p class="text-[10px] font-black" :class="tx.type === 'Withdrawal' ? 'text-red-500' : 'text-emerald-500'">
                               {{ tx.type === 'Withdrawal' ? '-' : '+' }}${{ tx.amount.toFixed(2) }}
                            </p>
                            <p class="text-[8px] font-bold text-zinc-700 uppercase">BAL: ${{ tx.balance.toFixed(2) }}</p>
                         </div>
                      </div>
                   </div>
                   <button @click="currentState = 'MAIN_MENU'" class="mt-4 w-full py-3 bg-zinc-900 border border-white/5 rounded-xl text-[9px] font-black text-zinc-500 uppercase active:scale-95">Back to Menu</button>
                </div>

                <!-- STATE: SUCCESS -->
                <div v-if="currentState === 'SUCCESS'" class="w-full text-center space-y-6">
                   <div class="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500 shadow-2xl animate-pop text-emerald-500">
                      <Icon name="heroicons:check" class="text-4xl" />
                   </div>
                   <div class="space-y-1">
                      <h3 class="text-3xl font-black text-white uppercase tracking-tighter">Success!</h3>
                      <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Transaction Processed Atomically</p>
                   </div>
                   <div class="bg-black/40 border border-white/5 rounded-1xl p-6 space-y-2">
                      <div class="flex justify-between text-[11px] font-black uppercase">
                         <span class="text-zinc-600">{{ lastReceipt?.type }}</span>
                         <span class="text-white">${{ lastReceipt?.amount.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between text-[11px] font-black uppercase">
                         <span class="text-zinc-600">New Balance</span>
                         <span class="text-emerald-500">${{ balance.toFixed(2) }}</span>
                      </div>
                   </div>
                   <div class="grid grid-cols-2 gap-3">
                      <button @click="showReceipt = true" class="py-4 bg-zinc-900 border border-white/5 rounded-1xl text-[10px] font-black text-white uppercase tracking-widest active:scale-95 flex items-center justify-center gap-2">
                         <Icon name="heroicons:banknotes" class="text-lg text-zinc-500" />
                         Print Receipt
                      </button>
                      <button @click="currentState = 'MAIN_MENU'" class="py-4 bg-emerald-600 text-white rounded-1xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95">Continue</button>
                   </div>
                </div>

             </div>

             <!-- THE SIDE HARDWARE (Keypad & Slots) -->
             <div class="w-56 space-y-6">
                <!-- KEYPAD -->
                <div class="grid grid-cols-3 gap-2 bg-[#0f172a] p-3 rounded-1xl border-b-4 border-black shadow-lg">
                   <button v-for="key in ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'ESC']" :key="key" 
                     @click="handleKeypad(key)"
                     class="aspect-square flex items-center justify-center rounded-1xl font-black text-lg transition-all active:scale-90 active:translate-y-1 shadow-[0_4px_0_0_rgba(0,0,0,0.5)] border-t border-white/10"
                     :class="[
                       key === 'CLR' ? 'bg-amber-600 text-amber-100 text-xs' : 
                       key === 'ESC' ? 'bg-red-600 text-red-100 text-xs' : 
                       'bg-zinc-800 text-white hover:bg-zinc-700'
                     ]"
                   >
                      {{ key }}
                   </button>
                </div>

                <!-- CARD SLOT -->
                <div class="space-y-2 text-center">
                   <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Card Slot</p>
                   <div @click="!cardInserted && insertCard()" 
                     class="w-full h-16 bg-zinc-900 border-2 border-[#121926] rounded-1xl flex items-center justify-center cursor-pointer group relative overflow-hidden transition-all"
                     :class="cardInserted ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'hover:border-emerald-500/50 hover:bg-zinc-800'">
                      <div v-if="!cardInserted" class="flex flex-col items-center">
                         <Icon name="heroicons:credit-card" class="text-2xl text-emerald-500 group-hover:scale-110 transition-transform" />
                         <p class="text-[7px] font-black text-emerald-500 uppercase mt-1 animate-pulse">Click here</p>
                      </div>
                      <div v-else class="w-full h-full flex items-center justify-center bg-emerald-500 animate-slide-in">
                         <Icon name="heroicons:credit-card" class="text-3xl text-white" />
                      </div>
                   </div>
                </div>

                <!-- RECEIPT SLOT -->
                <div class="space-y-2 text-center">
                   <p class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Receipt</p>
                   <div class="w-full h-10 bg-zinc-900 border-2 border-black rounded-lg flex items-center justify-center relative shadow-inner">
                      <div class="w-3/4 h-1 bg-black/40 rounded-full"></div>
                      <transition name="receipt">
                         <div v-if="lastReceipt && showReceipt" class="absolute bottom-full left-1/2 -translate-x-1/2 w-48 bg-white p-5 shadow-2xl border-t-8 border-dashed border-zinc-300 z-50 rounded-b-lg">
                            <button @click="showReceipt = false" class="absolute -top-4 -right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white z-[60]">
                               <Icon name="heroicons:x-mark" class="text-sm" />
                            </button>
                            <div class="text-center mb-4 border-b-2 border-dashed border-zinc-200 pb-3">
                               <p class="text-[10px] font-black tracking-tighter text-zinc-900">RAHUL AHER BANK</p>
                               <p class="text-[7px] tracking-[0.2em] font-black text-zinc-400">ATM RECEIPT</p>
                            </div>
                            <div class="space-y-2.5">
                               <div class="flex justify-between text-[8px] font-black uppercase text-zinc-900">
                                  <span class="text-zinc-400">Date:</span>
                                  <span>{{ lastReceipt.date.split(',')[0] }}</span>
                                </div>
                               <div class="flex justify-between text-[8px] font-black uppercase text-zinc-900">
                                  <span class="text-zinc-400">Type:</span>
                                  <span>{{ lastReceipt.type }}</span>
                                </div>
                               <div class="flex justify-between text-[8px] font-black uppercase text-zinc-900">
                                  <span class="text-zinc-400">Amount:</span>
                                  <span class="text-emerald-600">${{ lastReceipt.amount.toFixed(2) }}</span>
                                </div>
                               <div class="flex justify-between text-[9px] font-black uppercase pt-3 border-t-2 border-dashed border-zinc-100 text-zinc-900">
                                  <span>Balance:</span>
                                  <span class="text-black">${{ lastReceipt.balance.toFixed(2) }}</span>
                                </div>
                            </div>
                            <p class="text-[7px] text-center mt-5 opacity-40 font-black text-black">***** THANK YOU *****</p>
                            <div class="mt-2 text-[6px] text-center font-mono text-zinc-400 uppercase">TX: {{ Math.random().toString(36).substr(2, 9).toUpperCase() }}</div>
                         </div>
                      </transition>
                   </div>
                </div>
             </div>
          </div>

          <!-- CASH DISPENSER -->
          <div class="w-full mt-10 space-y-2 text-center">
             <p class="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Cash Dispenser</p>
             <div class="w-full h-16 bg-[#0f172a] border-4 border-black rounded-1xl relative flex items-center justify-center overflow-hidden shadow-inner">
                <div class="w-full h-2 bg-black/80 mx-10 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"></div>
                
                <!-- CASH ANIMATION -->
                <transition name="cash">
                   <div v-if="currentState === 'SUCCESS' && lastReceipt?.type === 'Withdrawal'" 
                     class="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-[-10%] w-40 h-12 bg-emerald-500 rounded-lg flex flex-col items-center justify-center border-4 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] z-20">
                      <div class="flex items-center gap-2">
                        <Icon name="heroicons:banknotes" class="text-3xl text-white" />
                        <span class="text-[14px] font-black text-white tabular-nums tracking-tighter">${{ lastReceipt?.amount }}</span>
                      </div>
                      <div class="w-16 h-1 bg-white/20 rounded-full mt-1"></div>
                   </div>
                </transition>

                <!-- SLOT GLOW EFFECT -->
                <div v-if="currentState === 'SUCCESS' && lastReceipt?.type === 'Withdrawal'" class="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none"></div>
             </div>
          </div>

       </div>

    </div>

    <!-- RIGHT: ANALYTICS -->
    <div class="lg:col-span-12 xl:col-span-3 flex flex-col border-l border-white/5 bg-zinc-900/40 p-8 space-y-6 overflow-y-auto custom-scrollbar h-full">
       
       <!-- HARDWARE STATS -->
       <div class="grid grid-cols-2 gap-3 shrink-0">
          <div v-for="stat in systemStats" :key="stat.label" class="bg-black/40 border border-white/5 p-4 rounded-1xl flex items-center gap-3 transition-colors hover:border-white/10">
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
       <div class="flex-1 flex flex-col min-h-[300px] overflow-hidden">
          <h4 class="text-zinc-600 font-black uppercase tracking-widest text-[8px] mb-3 flex items-center justify-between shrink-0">
             Terminal Control Log
             <p class="text-[7px] font-mono opacity-30">UUID_ATM_9982 // SECURE_CHANNEL</p>
          </h4>
          <div class="flex-1 bg-black border border-white/5 rounded-2xl p-6 font-mono text-[9px] overflow-hidden flex flex-col shadow-inner">
             <div class="flex-1 space-y-2 overflow-y-auto custom-scrollbar text-zinc-500 pr-1">
                <div v-for="(log, i) in logs" :key="i" class="flex gap-3">
                   <span class="opacity-20">{{ new Date().toLocaleTimeString() }}</span>
                   <span :class="log.includes('AUTH') ? 'text-blue-400' : log.includes('ERROR') ? 'text-red-400' : log.includes('COMMIT') ? 'text-emerald-400' : 'text-zinc-400'">{{ log }}</span>
                </div>
             </div>
          </div>
       </div>

       <!-- SYSTEM INSIGHTS -->
       <div class="space-y-3 shrink-0">
          <div v-for="ins in insights" :key="ins.title" class="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl transition-all hover:bg-zinc-900">
             <div class="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 shadow-lg">
                <Icon name="heroicons:cpu-chip" class="text-emerald-500 text-sm" />
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

@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}
.animate-loading-bar { animation: loading-bar 2s infinite ease-in-out; }

.animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-slide-in { animation: slide-in 0.3s ease-out; }
@keyframes slide-in {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.receipt-enter-active { animation: receipt-in 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
.receipt-leave-active { animation: receipt-in 0.3s reverse ease-in; }
@keyframes receipt-in {
  from { transform: translate(-50%, 100%) scaleY(0); opacity: 0; }
  to { transform: translate(-50%, 0) scaleY(1); opacity: 1; }
}

.cash-enter-active { animation: cash-out 1s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes cash-out {
  0% { transform: translate(-50%, 50%) scale(0.8); opacity: 0; }
  50% { transform: translate(-50%, -80%) scale(1.1); opacity: 1; }
  100% { transform: translate(-50%, -80%) scale(1); opacity: 1; }
}

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(10px); }
</style>
