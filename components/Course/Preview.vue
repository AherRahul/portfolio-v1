<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
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
          <li v-for="topic in course.topics.slice(0, 3)" :key="topic" class="bg-zinc-800 text-sm px-3 py-1 rounded-md border border-gray-1000">
            <AppLink class="hover:underline" :to="`/topics/${topic}`">#{{ topic }}</AppLink>
          </li>
        </ul>
      </div>
      <p class="mt-8 prose md:mt-0">
        {{ course.description }}
      </p>
    </div>
    <AppButton class="mt-10 mr-4" :to="course._path" >
      Explore the course
      <Icon name="material-symbols:double-arrow" style="margin-bottom: 2px;" />
    </AppButton>
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