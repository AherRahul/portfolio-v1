<script setup lang="ts">
import { QUESTION_CATEGORIES, ALL_QUESTIONS } from '~/data/system-design-questions'
import type { Difficulty, DesignType } from '~/data/system-design-questions'
import SystemDesignSimulationsTicTacToe from '~/components/SystemDesign/Simulations/TicTacToe.vue'
import SystemDesignSimulationsUrlShortener from '~/components/SystemDesign/Simulations/UrlShortener.vue'
import SystemDesignSimulationsRateLimiter from '~/components/SystemDesign/Simulations/RateLimiter.vue'
import SystemDesignSimulationsLruCache from '~/components/SystemDesign/Simulations/LruCache.vue'
import SystemDesignSimulationsParkingLot from '~/components/SystemDesign/Simulations/ParkingLot.vue'
import SystemDesignSimulationsChatApp from '~/components/SystemDesign/Simulations/ChatApp.vue'
import SystemDesignSimulationsSnakeAndLadder from '~/components/SystemDesign/Simulations/SnakeAndLadder.vue'
import SystemDesignSimulationsMinesweeper from '~/components/SystemDesign/Simulations/Minesweeper.vue'
import SystemDesignSimulationsBloomFilter from '~/components/SystemDesign/Simulations/BloomFilter.vue'
import SystemDesignSimulationsAutocomplete from '~/components/SystemDesign/Simulations/Autocomplete.vue'
import SystemDesignSimulationsSearchEngine from '~/components/SystemDesign/Simulations/SearchEngine.vue'
import SystemDesignSimulationsAtmMachine from '~/components/SystemDesign/Simulations/AtmMachine.vue'
import SystemDesignSimulationsVendingMachine from '~/components/SystemDesign/Simulations/VendingMachine.vue'
import SystemDesignSimulationsElevator from '~/components/SystemDesign/Simulations/Elevator.vue'
import SystemDesignSimulationsTrafficControl from '~/components/SystemDesign/Simulations/TrafficControl.vue'
import SystemDesignSimulationsCoffeeMachine from '~/components/SystemDesign/Simulations/CoffeeMachine.vue'
import SystemDesignSimulationsPubSub from '~/components/SystemDesign/Simulations/PubSub.vue'
import SystemDesignSimulationsNotificationSystem from '~/components/SystemDesign/Simulations/NotificationSystem.vue'
import SystemDesignSimulationsTaskManager from '~/components/SystemDesign/Simulations/TaskManager.vue'

definePageMeta({ documentDriven: false })
useSeoMeta({
  title: 'System Design Studio – 95+ HLD & LLD Challenges',
  description: `Master system design with our comprehensive curriculum: 40 LLD simulations and 55+ HLD architectural challenges. Featuring AI-powered evaluations and interactive environments.`,
})

const searchQuery = ref('')
const activeTab = ref<'LLD' | 'HLD'>('LLD')
const filterDifficulty = ref<'All' | Difficulty>('All')

const filteredCategories = computed(() => {
  return QUESTION_CATEGORIES
    .filter(cat => cat.tab === activeTab.value)
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(q => {
        const matchSearch = !searchQuery.value || q.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
        const matchTab = q.type === activeTab.value || q.type === 'Both'
        const matchDiff = filterDifficulty.value === 'All' || q.difficulty === filterDifficulty.value
        return matchSearch && matchTab && matchDiff
      })
    })).filter(cat => cat.questions.length > 0)
})

const totalVisible = computed(() => filteredCategories.value.reduce((s, c) => s + c.questions.length, 0))

const difficultyClass: Record<Difficulty, string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/30',
}
const typeClass: Record<string, string> = {
  LLD: 'text-purple-400 bg-purple-500/10',
  HLD: 'text-blue-400 bg-blue-500/10',
  Both: 'text-teal-400 bg-teal-500/10',
}

const showSimulationModal = ref(false)
const activeSimulationSlug = ref('')

function openSimulation(slug: string) {
  activeSimulationSlug.value = slug
  showSimulationModal.value = true
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Simulation Modal -->
    <div v-if="showSimulationModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="showSimulationModal = false" />
       <div class="relative w-full max-w-7xl bg-zinc-900 border border-white/5 rounded-none shadow-2xl flex flex-col max-h-[95vh] overflow-hidden scale-in">
          <div class="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-red-500/10 rounded-none flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                   <Icon name="heroicons:command-line" class="text-red-500 text-2xl" />
                </div>
                <div>
                  <h3 class="text-xl font-black text-white tracking-tighter uppercase leading-none mb-1.5">Design {{ activeSimulationSlug.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-none bg-red-500 animate-pulse" />
                    <span class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Simulation Engine v1.0.8 // Terminal Active</span>
                  </div>
                </div>
             </div>
             <button @click="showSimulationModal = false" class="p-2 text-zinc-500 hover:text-white transition-colors">
                <Icon name="heroicons:x-mark" class="text-3xl" />
             </button>
          </div>
          
          <div class="flex-1 overflow-y-auto bg-[#0a0a0a]">
             <ClientOnly>
                <SystemDesignSimulationsTicTacToe v-if="activeSimulationSlug === 'design-tic-tac-toe'" />
                <SystemDesignSimulationsUrlShortener v-else-if="activeSimulationSlug === 'design-url-shortener'" />
                <SystemDesignSimulationsRateLimiter v-else-if="activeSimulationSlug === 'design-rate-limiter'" />
                <SystemDesignSimulationsLruCache v-else-if="activeSimulationSlug === 'design-lru-cache'" />
                <SystemDesignSimulationsParkingLot v-else-if="activeSimulationSlug === 'design-parking-lot'" />
                <SystemDesignSimulationsChatApp v-else-if="activeSimulationSlug === 'design-chat-application'" />
                <SystemDesignSimulationsSnakeAndLadder v-else-if="activeSimulationSlug === 'design-snake-and-ladder'" />
                <SystemDesignSimulationsMinesweeper v-else-if="activeSimulationSlug === 'design-minesweeper'" />
                <SystemDesignSimulationsBloomFilter v-else-if="activeSimulationSlug === 'design-bloom-filter'" />
                <SystemDesignSimulationsAutocomplete v-else-if="activeSimulationSlug === 'design-autocomplete'" />
                <SystemDesignSimulationsSearchEngine v-else-if="activeSimulationSlug === 'design-search-engine'" />
                <SystemDesignSimulationsAtmMachine v-else-if="activeSimulationSlug === 'design-atm'" />
                <SystemDesignSimulationsVendingMachine v-else-if="activeSimulationSlug === 'design-vending-machine'" />
                <SystemDesignSimulationsElevator v-else-if="activeSimulationSlug === 'design-elevator'" />
                <SystemDesignSimulationsTrafficControl v-else-if="activeSimulationSlug === 'design-traffic-control'" />
                <SystemDesignSimulationsCoffeeMachine v-else-if="activeSimulationSlug === 'design-coffee-machine'" />
                <SystemDesignSimulationsPubSub v-else-if="activeSimulationSlug === 'design-pub-sub'" />
                <SystemDesignSimulationsNotificationSystem v-else-if="activeSimulationSlug === 'design-notification-system'" />
                <SystemDesignSimulationsTaskManager v-else-if="activeSimulationSlug === 'design-task-manager'" />
                <div v-else class="text-center py-20 text-zinc-500">
                   <Icon name="heroicons:bolt-slash" class="text-4xl mb-4" />
                   <p>Simulation module for this system is under development.</p>
                </div>
             </ClientOnly>
          </div>
       </div>
    </div>

    <!-- HEADER -->
    <AppSection class="mb-0 pb-4">
      <div class="flex items-center gap-3 mb-2">
        <NuxtLink to="/system-design" class="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1">
          <Icon name="heroicons:arrow-left" class="text-sm" /> System Design
        </NuxtLink>
        <Icon name="heroicons:chevron-right" class="text-zinc-600 text-xs" />
        <span class="text-zinc-300 text-sm">Practice Problems</span>
      </div>

      <div class="flex flex-col md:flex-row md:items-end gap-6 mb-8">
        <div class="flex-1">
          <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tighter uppercase">System Design Studio</h1>
          <p class="text-zinc-400 leading-relaxed max-w-2xl">Master HLD & LLD with interactive simulations and AI-powered evaluation. Practice real-world scenarios designed by industry experts.</p>
        </div>
        <div class="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-none">
          <Icon name="heroicons:command-line" class="text-red-500" />
          <span class="text-xs font-black text-zinc-300 uppercase tracking-widest">{{ ALL_QUESTIONS.length }} Modules</span>
        </div>
      </div>

      <!-- Tabs & Filters -->
      <div class="flex flex-col gap-6 mb-8">
        <!-- Tab Switcher -->
        <div class="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-none w-fit self-center md:self-start">
          <button 
            @click="activeTab = 'LLD'"
            class="px-8 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition-all relative overflow-hidden"
            :class="activeTab === 'LLD' ? 'text-white shadow-2xl' : 'text-zinc-500 hover:text-zinc-300'"
          >
            <div v-if="activeTab === 'LLD'" class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600" />
            <span class="relative z-10">Low-Level (40)</span>
          </button>
          <button 
            @click="activeTab = 'HLD'"
            class="px-8 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition-all relative overflow-hidden"
            :class="activeTab === 'HLD' ? 'text-white shadow-2xl' : 'text-zinc-500 hover:text-zinc-300'"
          >
            <div v-if="activeTab === 'HLD'" class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <span class="relative z-10">High-Level (55+)</span>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search problems by name or technology..."
              class="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 rounded-none pl-9 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition-all shadow-inner"
            />
          </div>

          <!-- Difficulty filter -->
          <select v-model="filterDifficulty"
            class="bg-zinc-900/50 border border-zinc-700 rounded-none px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all cursor-pointer min-w-[180px]">
            <option value="All">Difficulty: Any</option>
            <option value="Easy">Beginner</option>
            <option value="Medium">Intermediate</option>
            <option value="Hard">Advanced</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-2 mb-6">
         <div class="h-px flex-1 bg-zinc-800" />
         <div class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">Found {{ totalVisible }} result{{ totalVisible !== 1 ? 's' : '' }}</div>
         <div class="h-px flex-1 bg-zinc-800" />
      </div>
    </AppSection>

    <!-- QUESTION TABLE -->
    <AppSection class="mb-16">
      <div v-if="filteredCategories.length === 0" class="text-center py-20 bg-zinc-900/40 border border-zinc-700 border-dashed rounded-none">
        <Icon name="heroicons:circle-stack" class="text-4xl mb-4 text-zinc-700" />
        <div class="text-zinc-500 font-bold uppercase tracking-widest text-xs">No matching system modules found</div>
      </div>

      <div v-else class="flex flex-col gap-10">
        <div v-for="(cat, ci) in filteredCategories" :key="cat.id"
          class="relative group">
          <!-- Category Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xl shadow-lg">
               {{ cat.icon }}
            </div>
            <div>
               <span class="font-black text-white text-base tracking-tighter uppercase">{{ cat.name }}</span>
               <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{{ cat.questions.length }} Challenge{{ cat.questions.length !== 1 ? 's' : '' }}</p>
            </div>
          </div>

          <!-- Question Rows -->
          <div class="grid grid-cols-1 gap-3">
            <div v-for="(q, qi) in cat.questions" :key="q.slug"
              class="relative overflow-hidden flex flex-col md:flex-row md:items-center gap-4 px-6 py-5 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-none hover:border-red-500/30 transition-all group/row hover:-translate-y-1 shadow-sm">
              
              <!-- Subtle glow background -->
              <div class="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/[0.02] to-red-500/0 opacity-0 group-hover/row:opacity-100 transition-opacity pointer-events-none" />

              <!-- Row number & Title -->
              <div class="flex items-center gap-4 flex-1">
                <span class="text-xs text-zinc-700 font-mono w-4 shrink-0">{{ (qi + 1).toString().padStart(2, '0') }}</span>
                <div class="min-w-0">
                  <NuxtLink
                    :to="`/system-design/practice/${q.slug}`"
                    class="block text-sm font-black text-zinc-200 group-hover/row:text-white transition-colors hover:text-red-400 truncate tracking-tighter uppercase"
                  >
                    {{ q.title }}
                  </NuxtLink>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span v-for="tag in q.tags" :key="tag"
                      class="text-[9px] font-black px-2 py-0.5 rounded-none bg-white/5 text-zinc-500 uppercase tracking-widest border border-white/5 group-hover/row:border-white/10 transition-colors">{{ tag }}</span>
                  </div>
                </div>
              </div>

              <!-- Metrics -->
              <div class="hidden lg:flex items-center gap-8 px-8 border-x border-white/5">
                 <div class="flex flex-col gap-1">
                    <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Complexity</span>
                    <span :class="['text-[10px] font-black uppercase tracking-tighter', q.difficulty === 'Easy' ? 'text-emerald-500' : q.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500']">
                      {{ q.difficulty }}
                    </span>
                 </div>
                 <div class="flex flex-col gap-1">
                    <span class="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Type</span>
                    <span class="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{{ q.type }}</span>
                 </div>
              </div>

              <!-- Action button group -->
              <div class="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
                <!-- Simulation Trigger -->
                <button
                  v-if="q.hasSimulation"
                  @click="openSimulation(q.slug)"
                  class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 rounded-none transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  <Icon name="heroicons:play-solid" class="text-red-500" />
                  Simulate
                </button>
                
                <NuxtLink
                  :to="`/system-design/practice/${q.slug}?mode=${activeTab}`"
                  class="relative group/btn overflow-hidden flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-800 text-white rounded-none transition-all shadow-lg hover:shadow-red-500/20 active:scale-95 border border-white/5"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <span class="relative z-10 text-[10px] font-black uppercase tracking-widest">Build System</span>
                  <Icon name="heroicons:arrow-right" class="relative z-10 text-xs" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppSection>

  </div>
</template>
