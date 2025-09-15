<script setup lang="ts">
import { ref, computed } from 'vue'

interface TabItem {
  id: string
  title: string
  content: string
  description?: string
  icon?: string
}

const props = defineProps<{
  tabs: TabItem[]
  defaultTab?: string
}>()

const activeTab = ref(props.defaultTab || props.tabs[0]?.id || '')

const activeTabData = computed(() => 
  props.tabs.find(tab => tab.id === activeTab.value)
)

function setActiveTab(tabId: string) {
  activeTab.value = tabId
}

function onKeydownTabs(e: KeyboardEvent) {
  const currentIndex = props.tabs.findIndex(t => t.id === activeTab.value)
  if (currentIndex === -1) return
  // Arrow navigation for accessibility
  if (e.key === 'ArrowRight') {
    const next = (currentIndex + 1) % props.tabs.length
    activeTab.value = props.tabs[next].id
    e.preventDefault()
  } else if (e.key === 'ArrowLeft') {
    const prev = (currentIndex - 1 + props.tabs.length) % props.tabs.length
    activeTab.value = props.tabs[prev].id
    e.preventDefault()
  } else if (e.key === 'Home') {
    activeTab.value = props.tabs[0]?.id || activeTab.value
    e.preventDefault()
  } else if (e.key === 'End') {
    activeTab.value = props.tabs[props.tabs.length - 1]?.id || activeTab.value
    e.preventDefault()
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Outer card background -->
    <div class="border border-zinc-800 bg-zinc-900 ">
      <!-- Tab Navigation -->
      <div
        class="relative bg-zinc-700 px-2"
        role="tablist"
        aria-orientation="horizontal"
      >
        <div
            class="flex gap-1 sm:gap-2 p-1 sm:p-2 overflow-x-auto sm:overflow-visible whitespace-nowrap sm:whitespace-normal snap-x sm:snap-none -mx-3 sm:mx-0 px-4 sm:px-0"
            @keydown="onKeydownTabs"
        >
        <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            :class="[
            'snap-start rounded-none bg-zinc-800 px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500',
            activeTab === tab.id
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
            ]"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            :id="`tab-${tab.id}`"
        >
            <Icon v-if="tab.icon" :name="tab.icon" class="text-base" />
            {{ tab.title }}
        </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="bg-zinc-800 border-t border-zinc-800 p-4 sm:p-6 min-h-[220px] sm:min-h-[300px]">
      <div v-if="activeTabData" class="space-y-3 sm:space-y-4" :id="`panel-${activeTabData.id}`" role="tabpanel" :aria-labelledby="`tab-${activeTabData.id}`">
        <div class="flex items-start gap-3 sm:gap-4">
          <div v-if="activeTabData.icon" class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white">
            <Icon :name="activeTabData.icon" class="text-lg sm:text-xl" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 mt-0">
              {{ activeTabData.title }}
            </h3>
            <p v-if="activeTabData.description" class="text-zinc-300 mb-3 sm:mb-4">
              {{ activeTabData.description }}
            </p>
          </div>
        </div>
        
        <div class="prose prose-invert prose-zinc max-w-none">
          <div v-html="activeTabData.content"></div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
