<script setup lang="ts">
const props = withDefaults(defineProps<{
  time?: string
  tutor?: number
  languages?: string[]
  video?: boolean
}>(), {
  time: '2 days',
  tutor: 1,
  languages: () => ['English'],
  video: false
})

const formattedLanguages = computed(() => {
  const languages = props.languages
  if (languages.length === 1) {
    return languages[0]
  }
  return `${languages.slice(0, -1).join(', ')} or ${languages.slice(-1)}`
})
</script>

<template>
  <div class="flex flex-col md:flex-row gap-5 mt-2">
    <p>
      <Icon class="text-2xl mr-2" name="heroicons:clock" /> {{ time }}
    </p>
    <p>
      <Icon class="text-2xl mr-2" name="heroicons:user-group" /> {{ tutor }} tutor
    </p>
    <p>
      <Icon class="text-2xl mr-2" name="heroicons:language" /> {{ formattedLanguages }}
    </p>
    <p v-if="video">
      <Icon class="text-2xl" name="heroicons:video-camera" /> Video Tutorials
    </p>
    <p  v-else>
      <Icon class="text-2xl" name="heroicons:book-open" /> Reading Tutorials
    </p>
  </div>
</template>