<script setup lang="ts">
import { onContentNotFound } from '~/utils/content.js';

const { page: course } = useContent()


useSeoMeta({
  title: () => course.value.title,
  description: () => course.value.description,  
  ogTitle: () => course.value.title,
  ogDescription: () => course.value.description,
})

onContentNotFound(course)

defineOgImageComponent('Course', {
  title: course.value.title,
  time: course.value.time,
  tutor: course.value.tutor ?? 1,
  languages: course.value.languages ?? ['English'],
})

</script>

<template>
  <div>
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 !pb-4">
      <AppLinkBack to="/courses/">All Courses</AppLinkBack>
      <ParagraphDecoration class="mt-4" />
      <AppParagraph class="mt-4" look="heading" tag="h1">
        {{ course.title }}
      </AppParagraph>
      <CourseDetails 
        :time="course.time"
        :tutor="course.tutor"
        :languages="course.languages"
        class="mt-8 space-y-2 md:space-y-0 md:flex gap-8"
      />
    </AppSection>
    <AppSection class="bg-zinc-900 !pb-0">
      <div class="video-container">
        <iframe
          :src="course.video_url"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </AppSection>
    <AppSection class="bg-zinc-900 !pb-0" inner-class="border-b border-zinc-800">
      <div class="justify-center gap-8 pb-16">
        <div>
          <div class="prose md:prose-lg lg:prose-xl pt-0.5">
            <ContentDoc />
          </div>
        </div>
      </div>
    </AppSection>
  </div>
</template>

<style scoped>
.video-container {
  display: flex; /* Enables Flexbox */
  justify-content: center; /* Horizontally center */
  align-items: center; /* Vertically center */
  width: 100%;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio (9/16 * 100) */
  height: 0;
  overflow: hidden;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
