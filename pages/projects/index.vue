<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types';
import type { Project } from '~/types.js';

definePageMeta({
  documentDriven: false
})

const title = 'Projects'
const description = 'Want to upgrade your team\'s skills? I offer various projects on NodeJS, JAVA, Spring, Spring-boot, JavaScript, Web Development, Performance, Clean Code and more. Take a look at the list below or contact me for a custom project!'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Project')

const query: QueryBuilderParams = { path: '/projects', without: ['body', 'excerpt'] }
// console.log(query)
</script>

<template>
  <AppSection>
    <AppLinkBack class="mt-16" to="/services/">Go back to services</AppLinkBack>
    <ParagraphDecoration class="mt-4" />
    <AppParagraph class="mt-1" tag="h1" look="heading">Projects</AppParagraph>
    <AppParagraph class="max-w-3xl mt-8" look="subParagraph">
      I am deeply committed to the ethos of perpetual learning, recognizing it as the cornerstone of personal and 
      professional growth. In my journey, I embrace an immersive approach to knowledge acquisition, where I not only
       absorb new concepts but actively integrate them into tangible, real-world projects. This dynamic fusion between 
       theory and practice serves as the crucible where my understanding is honed and fortified. 
    </AppParagraph>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 mt-8">
      <ContentList :query="query" v-slot="{ list }">
        <ProjectPreview v-for="entry in list" :key="entry._path" :project="(entry as Project)" />
      </ContentList>
    </div>
  </AppSection>
</template>
