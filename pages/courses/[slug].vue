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
  <div cla>
    <!-- Hero Section -->
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 text-white pb-12">
      <div class="container mx-auto">
        <AppLinkBack to="/courses/" class="text-gray-300 hover:text-white">
          All Courses
        </AppLinkBack>
        <ParagraphDecoration class="mt-2" />
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
    <AppSection class="bg-zinc-900 pb-8 text-white">
      <div class="container mx-auto">
        <h2 class="text-3xl font-semibold mb-6">Course Content</h2>
        <div>
          <div
            v-for="(module, index) in course.content"
            :key="module.id"
            class="bg-zinc-800  shadow-md p-6 mb-4 transition-all hover:shadow-lg border-l-4 border-red-500"
          >
            <rds-collapsible-container
              :modelValue="module.expanded"
              :title="(index + 1) + '. ' + module.module_name + ' (' + module.module_duration + ')'"
            >
              <div class="mt-4">
                <div
                  v-for="(lecture, l_index) in module.topics"
                  :key="lecture.id"
                  class="md:grid md:grid-cols-2 gap-8 bg-zinc-700 p-4 mt-4"
                >
                  <!-- Video Section -->
                  <div v-if="lecture.videoUrl" class="video-container overflow-hidden shadow-sm">
                    <iframe
                      :src="lecture.videoUrl"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div v-else class="overflow-hidden shadow-sm">
                    <img
                      :blackAndWhite="false"
                      :dimmed="false"
                      :roundedCorners="false"
                      :opacity="1"
                      :src="lecture.photo_url"
                      :fallbackSrc="lecture.photo_url"
                      alt="Example image from rds-image"
                    />
                  </div>
                  <!-- Lecture Details -->
                  <div>
                    <h3 class="text-xl font-semibold">{{ (index + 1) + '. ' + (l_index + 1) + '. ' + lecture.topic_name }}</h3>
                    <p v-if="lecture.sub_topic" class="text-gray-400 mt-2">
                      <Icon class="text-xl ml-1" name="heroicons:book-open" /> {{ lecture.sub_topic }} <Icon class="text-xl ml-1" name="heroicons:clock" /> {{ lecture.duration }}
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
                    
                    <div class="md:grid md:grid-cols-2 gap-10 flex justify-end justify-items-end content-end items-end" v-if="lecture._path">
                      <div></div>
                      <div>
                        <AppButton :to="`/articles/${lecture._path}`" class="mt-5" >
                          View Learning
                          <Icon name="material-symbols:double-arrow" style="margin-bottom: 2px;" />
                        </AppButton>
                      </div>
                    </div>
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
