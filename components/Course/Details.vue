<script setup lang="ts">
const props = withDefaults(defineProps<{
  time?: string
  tutor?: number
  languages?: string[]
}>(), {
  time: '2 days',
  tutor: 1,
  languages: () => ['English']
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
  <div>
    <p>
      <Icon class="text-2xl mr-2" name="heroicons:clock" /> {{ time }}
    </p>
    <p>
      <Icon class="text-2xl mr-2" name="heroicons:user-group" /> {{ tutor }} tutor
    </p>
    <p>
      <Icon class="text-2xl mr-2" name="heroicons:language" /> {{ formattedLanguages }}
    </p>
  </div>
</template>