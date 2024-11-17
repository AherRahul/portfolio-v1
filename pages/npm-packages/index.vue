<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types';
import type { NpmPackage } from '~/types.js';

definePageMeta({
  documentDriven: false
})

const title = 'NPM Package'
const description = 'Want to upgrade your team\'s skills? I offer various npm_packages on NodeJS, JAVA, Spring, Spring-boot, JavaScript, Web Development, Performance, Clean Code and more. Take a look at the list below or contact me for a custom npm_package!'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Npm_package')

const query: QueryBuilderParams = { path: '/npm-packages', without: ['body', 'excerpt'] }
</script>

<template>
  <AppSection>
    <ParagraphDecoration class="mt-16" />
    <AppParagraph class="mt-4" tag="h1" look="heading">NPM Packages</AppParagraph>
    <AppParagraph class="max-w-3xl mt-8" look="subParagraph">
      I am deeply committed to the ethos of perpetual learning, recognizing it as the cornerstone of personal and 
      professional growth. In my journey, I embrace an immersive approach to knowledge acquisition, where I not only
       absorb new concepts but actively integrate them into tangible, real-world npm_packages. This dynamic fusion between 
       theory and practice serves as the crucible where my understanding is honed and fortified. 
    </AppParagraph>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 mt-8">
      <ContentList :query="query" v-slot="{ list }">
        <NpmPackagesPreview v-for="entry in list" :key="entry._path" :npm_package="(entry as NpmPackage)" />
      </ContentList>
    </div>
  </AppSection>
</template>
