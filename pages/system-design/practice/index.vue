<script setup lang="ts">
import { QUESTION_CATEGORIES, ALL_QUESTIONS } from '~/data/system-design-questions'
import type { Difficulty, DesignType } from '~/data/system-design-questions'

definePageMeta({ documentDriven: false })
useSeoMeta({
  title: 'System Design Practice – HLD & LLD Problems',
  description: 'Practice system design interviews with 40+ real-world problems. Get AI-powered evaluation and scoring after each attempt.',
})

const searchQuery = ref('')
const filterType = ref<'All' | DesignType>('All')
const filterDifficulty = ref<'All' | Difficulty>('All')

const filteredCategories = computed(() => {
  return QUESTION_CATEGORIES.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => {
      const matchSearch = !searchQuery.value || q.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
      const matchType = filterType.value === 'All' || q.type === filterType.value || (filterType.value !== 'All' && q.type === 'Both')
      const matchDiff = filterDifficulty.value === 'All' || q.difficulty === filterDifficulty.value
      return matchSearch && matchType && matchDiff
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
</script>

<template>
  <div class="min-h-screen">
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
          <h1 class="text-3xl font-extrabold text-white mb-2">Low / High Level Design Practice</h1>
          <p class="text-zinc-400">Practice system design step-by-step with AI-powered evaluation and feedback</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-zinc-400">
          <Icon name="heroicons:document-text" class="text-red-400" />
          {{ ALL_QUESTIONS.length }} problems
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <!-- Search -->
        <div class="relative flex-1">
          <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search problems..."
            class="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <!-- Type filter -->
        <select v-model="filterType"
          class="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer">
          <option value="All">All Problems</option>
          <option value="LLD">LLD Only</option>
          <option value="HLD">HLD Only</option>
        </select>

        <!-- Difficulty filter -->
        <select v-model="filterDifficulty"
          class="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer">
          <option value="All">Difficulty: All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div class="text-xs text-zinc-500 mb-4">Showing {{ totalVisible }} problem{{ totalVisible !== 1 ? 's' : '' }}</div>
    </AppSection>

    <!-- QUESTION TABLE -->
    <AppSection class="mb-16">
      <div v-if="filteredCategories.length === 0" class="text-center py-20 text-zinc-500">
        <Icon name="heroicons:face-frown" class="text-4xl mb-3" />
        <div>No problems match your filters.</div>
      </div>

      <div v-else class="flex flex-col gap-6">
        <div v-for="(cat, ci) in filteredCategories" :key="cat.id"
          class="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
          <!-- Category Header -->
          <div class="flex items-center gap-3 px-5 py-3 bg-zinc-800/80 border-b border-zinc-700">
            <span class="text-xl">{{ cat.icon }}</span>
            <span class="font-bold text-white text-sm">{{ cat.name }}</span>
            <span class="ml-auto text-xs text-zinc-400">{{ cat.questions.length }} problem{{ cat.questions.length !== 1 ? 's' : '' }}</span>
          </div>

          <!-- Question Rows -->
          <div class="divide-y divide-zinc-800">
            <div v-for="(q, qi) in cat.questions" :key="q.slug"
              class="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/50 transition-colors group">

              <!-- Row number -->
              <span class="text-xs text-zinc-600 w-5 flex-shrink-0 font-mono">{{ qi + 1 }}</span>

              <!-- Title & Tags -->
              <div class="flex-1 min-w-0">
                <NuxtLink
                  :to="`/system-design/practice/${q.slug}`"
                  class="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors hover:text-red-400"
                >
                  {{ q.title }}
                </NuxtLink>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span v-for="tag in q.tags.slice(0, 3)" :key="tag"
                    class="text-[10px] px-1.5 py-0.5 rounded bg-zinc-700 text-zinc-400">{{ tag }}</span>
                </div>
              </div>

              <!-- Difficulty -->
              <span :class="['hidden sm:flex text-xs font-semibold px-2 py-1 rounded border', difficultyClass[q.difficulty]]">
                {{ q.difficulty }}
              </span>

              <!-- Type badge -->
              <span :class="['hidden md:flex text-xs font-bold px-2 py-1 rounded', typeClass[q.type]]">{{ q.type }}</span>

              <!-- Solve button -->
              <NuxtLink
                :to="`/system-design/practice/${q.slug}`"
                class="flex-shrink-0 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Solve →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </AppSection>
  </div>
</template>
