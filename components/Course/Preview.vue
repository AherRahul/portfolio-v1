<script setup lang="ts">
defineProps<{
  course: any
}>()
</script>

<template>
  <AppLink
    class="group flex flex-col justify-between hover:bg-gradient-to-r hover:-translate-y-2 transition-all duration-500 from-red-500/60 to-pink-600/60 px-4 py-8 bg-zinc-800">
    <AppParagraph tag="h3" class="text-2xl font-semibold">{{ course.title }}</AppParagraph>
    <AppParagraph look="paragraph" class="mt-8 group-hover:text-gray-200">{{ course.description }}</AppParagraph>
    <CourseDetails
      class="mt-8 space-y-2"
      :time="course.time"
      :tutor="course.tutor"
      :languages="course.languages"
    />
  </AppLink>
</template>