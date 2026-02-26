<script setup lang="ts">
import type { ArticlePreview } from '~/types'

const props = defineProps<{
  article: ArticlePreview
}>()

const formattedCreatedAt = computed(() => formatDateStringToHumanReadable(props.article.datePublished))
</script>

<template>
  <AppLink 
    :style="!article.showOnArticles ? 'display: none' : ''" 
    :to="article._path"
    class="relative flex flex-col justify-between p-1 group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/20"
  >
    <!-- Background Gradient and Blur -->
    <div class="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 group-hover:border-red-500/50 transition-colors duration-500" />
    
    <!-- Animated Border Glow (only on hover) 
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
      <div class="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent,rgba(239,68,68,0.2),transparent_90deg)] animate-[spin_4s_linear_infinite]" />
    </div>
    -->

    <div class="relative z-10 flex flex-col h-full bg-zinc-700/40 p-6 md:p-8 transition-all duration-500 group-hover:bg-zinc-900/20">
      <div class="flex justify-between items-start mb-6">
        <span class="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-red-400 transition-colors duration-300">
          {{ formattedCreatedAt }}
        </span>
        <div class="h-1 w-8 bg-red-600/30 group-hover:w-16 group-hover:bg-red-500 transition-all duration-500" />
      </div>

      <AppParagraph tag="h3" class="text-2xl md:text-3xl font-bold leading-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-red-400 transition-all duration-300">
        {{ article.title }}
      </AppParagraph>

      <AppParagraph v-if="article.description" look="subParagraph"
        class="mt-6 !font-medium text-zinc-400 line-clamp-3 group-hover:text-zinc-300 transition-colors duration-300">
        {{ article.description }}
      </AppParagraph>

      <div class="mt-8 pt-6 border-t border-zinc-800/50 flex flex-wrap gap-2">
        <span v-for="topic in article.topics" :key="topic" 
          class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50 group-hover:border-red-500/30 group-hover:text-white transition-all duration-300">
          #{{ topic }}
        </span>
      </div>
      
      <!-- Read More Link (Decorative) -->
      <div class="mt-6 flex items-center text-xs font-bold text-red-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
        READ ARTICLE 
        <Icon name="heroicons:arrow-right-20-solid" class="ml-2 w-4 h-4" />
      </div>
    </div>
  </AppLink>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
