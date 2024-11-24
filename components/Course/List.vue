<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  course: any
}>();

// Make isCheck reactive
const isCheck = ref(false);

const onClick = () => {
  isCheck.value = !isCheck.value; // Update the reactive value
};
</script>

<template>
  <div class="bg-zinc-800 p-8 transition-all border border-transparent">
    <div class="md:grid md:grid-cols-2 gap-8">
      <div>
        <header class="flex-grow">
          <AppParagraph tag="h3" class="inline text-2xl font-semibold">
            {{ course.title }}
          </AppParagraph>
        </header>
        <ul class="flex flex-col md:flex-row mt-4">
          <li v-if="course.eventName">
            <AppLink v-if="course.eventUrl" rel="noindex nofollow"
              class="inline-block underline decoration-white hover:decoration-transparent transition-all mr-1"
              :to="course.eventUrl">
              {{ course.eventName }}
            </AppLink>
            <span v-else class="mr-1">{{ course.eventName }}</span>
            <span v-if="course.location || course.date" class="hidden md:inline-block" aria-hidden>&bull;&nbsp;</span>
          </li>
          <li class="text-sm md:text-base mt-4 md:mt-0" v-if="course.location">
            {{ course.location }}
            <span v-if="course.date" class="hidden md:inline-block" aria-hidden>&bull;&nbsp;</span>
          </li>
          <li class="text-sm md:text-base" v-if="course.date">{{ course.date }}</li>
        </ul>
        <ul class="flex flex-wrap md:flex-nowrap gap-8 mt-4">
          <li v-for="topic in course.topics.slice(0, 3)" :key="topic">
            <AppLink class="hover:underline" :to="`/topics/${topic}`">#{{ topic }}</AppLink>
          </li>
        </ul>
      </div>
      <p class="mt-8 prose md:mt-0">
        {{ course.description }}
      </p>
    </div>
    <AppButton class="mt-10 mr-4" @click="onClick">
      Explore the course
      <Icon name="material-symbols:double-arrow" style="margin-bottom: 2px;" />
    </AppButton>
    <div v-if="isCheck" class="mt-8">
      <div class="p-5 mt-1 gap-8 bg-zinc-700 transition-all flex flex-col" 
        v-for="(module, index) in course.content" :key="module.id" >
        <rds-collapsible-container :value="module.expanded" :title='(index + 1) + ". " + module.module_name + " (" + module.module_duration + ")"' >
          <div class="mt-8">
            <div class="mt-1 md:grid md:grid-cols-2 gap-8 bg-zinc-800 p-8 transition-all border border-transparent"
              v-for="(lecture, l_index) in module.videos" :key="lecture.id">
              <div>
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
              </div>
              <p class="mt-8 prose md:mt-0">
                {{ lecture.description }}
              </p>
              <div class="mt-8 md:mt-0 md:col-span-2 flex flex-col md:flex-row md:justify-between">
                <ul class="flex gap-4 md:gap-8">
                  <li v-if="lecture.slidesUrl">
                    <AppLink class="border-b-4 border-white/75 hover:border-white transition-all pr-1 pb-1" :to="lecture.slidesUrl">
                      <Icon name="heroicons:bookmark" /> Improve
                    </AppLink>
                  </li>
                  <li v-if="lecture.videoUrl">
                    <AppLink class="border-b-4 border-white/75 hover:border-white transition-all pr-1 pb-1" :to="lecture.videoUrl">
                      <Icon name="heroicons:play" /> Watch
                    </AppLink>
                  </li>
                  <li v-if="lecture.podcastUrl">
                    <AppLink class="border-b-4 border-white/75 hover:border-white transition-all pr-1 pb-1" :to="lecture.podcastUrl">
                      <Icon name="heroicons:microphone" /> Listen
                    </AppLink>
                  </li>
                </ul>
                <AppButton :to="lecture._path" class="custom-button bg-zinc-800" look="secondary">
                  View lecture <Icon name="heroicons:chevron-double-right-20-solid" />
                </AppButton>
              </div>
            </div>
          </div>
        </rds-collapsible-container>
      </div>
    </div>
  </div>
</template>

<style>
.collapsible-container__title {
  cursor: pointer;
}

.custom-button .bg-black {
  background-color: #27272a;
}
</style>