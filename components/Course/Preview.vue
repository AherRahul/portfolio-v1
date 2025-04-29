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

const formattedLanguages = computed(() => {
  const languages = props.course.languages ? props.course.languages : ['English'];
  if (languages.length === 1) {
    return languages[0]
  }
  return `${languages.slice(0, -1).join(', ')} or ${languages.slice(-1)}`
})

</script>

<template>
  <div class="inline-block group border-l-4 border-red-500 relative flex flex-col justify-between hover:bg-gradient-to-r hover:-translate-y-2 hover:border-zinc-300 transition-all duration-500 from-red-500/60 to-pink-600/60 p-8 bg-zinc-800">
    <div class="">
      <div>
        <header class="flex-grow">
          <AppParagraph tag="h3" class="inline text-2xl font-semibold ">
            {{ course.title }}
          </AppParagraph>
        </header>
        <div class="flex flex-col md:flex-row gap-5 mt-2">
          <p>
            <Icon class="text-2xl" name="heroicons:clock" /> {{ course.time }}
          </p>
          <p>
            <Icon class="text-2xl" name="heroicons:user-group" /> {{ course.tutor }} tutor
          </p>
          <p>
            <Icon class="text-2xl" v-if="formattedLanguages" name="heroicons:language" /> {{ formattedLanguages }}
          </p>
          <p v-if="course.video">
            <Icon class="text-2xl" name="heroicons:video-camera" /> Video Tutorials
          </p>
          <p  v-else>
            <Icon class="text-2xl" name="heroicons:book-open" /> Reading Tutorials
          </p>
        </div>
      </div>
      <p class="mt-8 prose md:mt-4">
        {{ course.description }}
      </p>
    </div>
    <div class="md:grid md:grid-cols-2 gap-10 flex justify-end justify-items-end content-end items-end">
      <div></div>
      <div>
        <AppButton class="mt-10 mr-4 " :to="course._path" >
          Explore the course
          <Icon name="material-symbols:double-arrow" style="margin-bottom: 2px;" />
        </AppButton>
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