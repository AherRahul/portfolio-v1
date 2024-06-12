<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import type { Article } from '~/types.js';

definePageMeta({
  documentDriven: false
})

const query: QueryBuilderParams = { path: '/articles', sort: [{ dateModified: -1, datePublished: -1 }] }

const title = 'Articles'
const description = 'I am regularly writing articles about web development, JavaScript, TypeScript, Vue.js, Nuxt.js, and other topics. From introductions to deep dives and tutorials, you can find a wide range of content.'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Article')
</script>

<template>
  <AppSection>
    <ParagraphDecoration class="mt-16" />
    <AppParagraph class="mt-4" tag="h1" look="heading">Articles</AppParagraph>
    <AppParagraph class="max-w-3xl mt-8" look="subParagraph">
      I'm passionate about contributing my knowledge and experience to the community.
       I thrive on collaborating to solve problems, exploring optimal abstractions, 
       and refining architectures for successful outcomes. Below, you'll discover a 
       compilation of my articles and insights on various topics. For deeper engagement 
       beyond summaries and titles, click on each entry to access the content!
    </AppParagraph>
    <div class="space-y-8 md:space-y-0 md:grid grid-cols-2 gap-12 justify-around mt-8">
      <ContentList :query="query" v-slot="{ list }">
        <ArticlePreview v-for="entry in list" :key="entry._path" :article="(entry as Article)" />
      </ContentList>
    </div>
  </AppSection>
</template>