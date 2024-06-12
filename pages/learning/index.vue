<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import type { Talk } from '~/types.js';


definePageMeta({
  documentDriven: false
})

const title = 'Learnings'
const description = `I'm deeply committed to continuous learning and hold hands-on experience in high regard. 
      Actively pursuing new concepts, I delve into each topic for a comprehensive understanding. 
      This proactive stance not only fuels my growth mindset but also nurtures ongoing professional 
      development. Below, you'll find a curated list of my learnings and preparation strategies. 
      If you seek more than just summaries and titles, click on each entry to delve into the content!`

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Learning', {
  title: 'Learnings'
})

const query: QueryBuilderParams = { path: '/learning', sort: [{ date: -1 }], without: ['body', 'excerpt'] }
</script>

<template>
  <AppSection>
    <ParagraphDecoration class="mt-16" />
    <AppParagraph class="mt-4" tag="h1" look="heading">Learning</AppParagraph>
    <AppParagraph class="max-w-3xl mt-8" look="subParagraph">
      I'm deeply committed to continuous learning and hold hands-on experience in high regard. 
      Actively pursuing new concepts, I delve into each topic for a comprehensive understanding. 
      This proactive stance not only fuels my growth mindset but also nurtures ongoing professional 
      development. Below, you'll find a curated list of my learnings and preparation strategies. 
      If you seek more than just summaries and titles, click on each entry to delve into the content!
    </AppParagraph>
    <div class="space-y-8 mt-8">
      <ContentList :query="query" v-slot="{ list }">
        <LearningPreview v-for="entry in list" :key="entry._path" :talk="(entry as Talk)" />
      </ContentList>
    </div>
  </AppSection>
</template>