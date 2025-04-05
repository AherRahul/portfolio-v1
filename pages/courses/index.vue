<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types';
import type { Course } from '~/types.js';
// import courseContent from '../../content/courses/content-list/courses-list.json';

definePageMeta({
  documentDriven: false
})

const title = 'Courses'
const description = 'Want to upgrade your team\'s skills? I offer various courses on NodeJS, JAVA, Spring, Spring-boot, JavaScript, Web Development, Performance, Clean Code and more. Take a look at the list below or contact me for a custom course!'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Course')

const query: QueryBuilderParams = { path: '/courses', without: ['body', 'excerpt'] }
console.log(query);
</script>
<template>
  <AppSection>
    <AppLinkBack class="mt-16" to="/services/">Go back to services</AppLinkBack>
    <ParagraphDecoration class="mt-2" />
    <AppParagraph class="mt-1"  tag="h1" look="heading">Courses</AppParagraph>
    <AppParagraph class="max-w-3xl mt-8" look="subParagraph">
      I am deeply committed to the ethos of perpetual learning, recognizing it as the cornerstone of personal and 
      professional growth. In my journey, I embrace an immersive approach to knowledge acquisition, where I not only
       absorb new concepts but actively integrate them into tangible, real-world courses. This dynamic fusion between 
       theory and practice serves as the crucible where my understanding is honed and fortified. 
    </AppParagraph>
    <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-16 md:gap-8 mt-8">
      <ContentList :query="query" v-slot="{ list }">
        <CoursePreview v-for="entry in list" :key="entry._path" :course="(entry as Course)" />
      </ContentList>
    </div>
  </AppSection>
</template>
