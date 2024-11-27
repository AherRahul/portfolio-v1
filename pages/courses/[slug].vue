<script setup lang="ts">
import { onContentNotFound } from '~/utils/content.js';

const { page: course } = useContent();

useSeoMeta({
  title: () => course.value.title,
  description: () => course.value.description,
  ogTitle: () => course.value.title,
  ogDescription: () => course.value.description,
});

onContentNotFound(course);

defineOgImageComponent('Course', {
  title: course.value.title,
  time: course.value.time,
  tutor: course.value.tutor ?? 1,
  languages: course.value.languages ?? ['English'],
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 text-white pb-12">
      <div class="container mx-auto">
        <AppLinkBack to="/courses/" class="text-gray-300 hover:text-white">
          All Courses
        </AppLinkBack>
        <AppParagraph class="mt-4" look="heading" tag="h1">
          {{ course.title }}
        </AppParagraph>
        <CourseDetails
          :time="course.time"
          :tutor="course.tutor"
          :languages="course.languages"
          class="mt-6 flex flex-wrap gap-8"
        />
      </div>
    </AppSection>

    <!-- Course Content Section -->
    <AppSection class="bg-zinc-900 py-8 text-white">
      <div class="container mx-auto">
        <h2 class="text-3xl font-semibold mb-6">Course Content</h2>
        <div>
          <div
            v-for="(module, index) in course.content"
            :key="module.id"
            class="bg-zinc-800 rounded-lg shadow-md p-6 mb-4 transition-all hover:shadow-lg"
          >
            <rds-collapsible-container
              :modelValue="module.expanded"
              :title="(index + 1) + '. ' + module.module_name + ' (' + module.module_duration + ')'"
            >
              <div class="mt-4">
                <div
                  v-for="(lecture, l_index) in module.videos"
                  :key="lecture.id"
                  class="md:grid md:grid-cols-2 gap-8 bg-zinc-700 p-4 rounded-lg mt-4"
                >
                  <!-- Video Section -->
                  <div class="video-container rounded-lg overflow-hidden shadow-sm">
                    <iframe
                      :src="lecture.video_url"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <!-- Lecture Details -->
                  <div>
                    <h3 class="text-xl font-semibold">{{ (index + 1) + '. ' + (l_index + 1) + '. ' + lecture.topic_name }}</h3>
                    <p v-if="lecture.sub_topic" class="text-gray-400 mt-2">
                      {{ lecture.sub_topic }}
                    </p>
                    <ul class="flex flex-wrap gap-2 mt-4">
                      <li
                        v-for="topic in lecture.topics.slice(0, 3)"
                        :key="topic"
                        class="bg-zinc-800 text-sm px-3 py-1 rounded-md border border-gray-700"
                      >
                        <AppLink :to="`/topics/${topic}`" class="hover:underline">
                          #{{ topic }}
                        </AppLink>
                      </li>
                    </ul>
                    <p class="mt-4 text-gray-300">{{ lecture.description }}</p>
                  </div>
                </div>
              </div>
            </rds-collapsible-container>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- Additional Information Section -->
    <AppSection class="bg-zinc-900 pb-8 border-t border-gray-700">
      <div class="container mx-auto prose md:prose-lg lg:prose-xl text-gray-300">
        <ContentDoc />
      </div>
    </AppSection>
  </div>
</template>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
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
