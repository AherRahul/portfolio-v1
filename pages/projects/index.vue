<script setup lang="ts">
import { type QueryBuilderParams } from '@nuxt/content/dist/runtime/types/index.js';

definePageMeta({
  documentDriven: false
})

const title = 'Projects'
const description = 'Want to upgrade your team\'s skills? I offer various projects on Vue.js, Nuxt.js, TypeScript, JavaScript, Web Development, Performance, Clean Code and more. Take a look at the list below or contact me for a custom project!'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Project')

const query: QueryBuilderParams = { path: '/projects', without: ['body', 'excerpt'] }
</script>

<template>
  <AppSection>
    <ParagraphDecoration class="mt-16" />
    <AppParagraph class="mt-4" tag="h1" look="heading">Projects</AppParagraph>
    <AppParagraph class="max-w-3xl mt-8" look="subParagraph">
      Here I've listed various projects I am offering. It is no problem to tailor them to your needs or create a
      completely custom project for you and your team.
      Just <AppLink to="/contact/" class="underline hover:no-underline">contact me</AppLink> and we'll figure it out!
    </AppParagraph>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 mt-8">
      <ContentList :query="query" v-slot="{ list }">
        <ProjectPreview v-for="entry in list" :key="entry._path" :project="entry" />
      </ContentList>
    </div>
  </AppSection>
</template>
