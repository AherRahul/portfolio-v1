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
    <AppSection class="bg-gradient-to-b from-black to-zinc-700 ">
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
      <div>
        <div  >
          <div class=" p-5 gap-8 bg-zinc-700 transition-all flex flex-col mt-1"  v-for="(module, index) in course.content" :key="module.id" >
            <rds-collapsible-container :value="module.expanded" :title='(index + 1) + ". " + module.module_name + " (" + module.module_duration + ")"' >
              <div class="mt-8">
                <div class="mt-1 md:grid md:grid-cols-2 gap-8 bg-zinc-800 p-3 transition-all border border-transparent" v-for="(lecture, l_index) in module.videos" :key="lecture.id">
                  <div>
                    <div class="video-container">
                      <iframe
                        :src="lecture.video_url"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                  <div class="mt-1 gap-8 bg-zinc-800 p-3 transition-all border border-transparent" 
                    >
                    <header class="flex-grow">
                      <AppParagraph tag="h3" class="inline text-2xl font-semibold">
                        {{ (l_index + 1) + ". " + lecture.topic_name }}
                      </AppParagraph>
                    </header>
                    <AppParagraph v-if="lecture.sub_topic" tag="h6" class="inline font-semibold">
                        {{ lecture.sub_topic }}
                      </AppParagraph>
                    <ul class="flex flex-wrap md:flex-nowrap gap-8 mt-4">
                      <li v-for="topic in lecture.topics.slice(0, 3)" :key="topic">
                        <AppLink class="hover:underline" :to="`/topics/${topic}`">#{{ topic }}</AppLink>
                      </li>
                    </ul>
                    <p class="mt-8 prose md:mt-8" >
                      {{ lecture.description }}
                    </p>
                  </div>
                </div>
              </div>
            </rds-collapsible-container>
          </div>
        </div>
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
