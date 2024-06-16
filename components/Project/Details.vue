<script setup lang="ts">
const props = withDefaults(defineProps<{
  time?: string
  attendees?: number
  languages?: string[]
  projectGitHubLink?:string
  prjectDemoLink?:string
  nodePackageLink?:string
}>(), {
  time: '2 days',
  attendees: 20,
  languages: () => ['English', 'Indian']
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
      <Icon class="text-2xl mr-2" name="heroicons:user-group" /> max. {{ attendees }} collabrators
    </p>
    <p>
      <Icon class="text-2xl mr-2" name="heroicons:language" /> {{ formattedLanguages }}
    </p>
    <p>
      <NuxtLink v-if="projectGitHubLink" :to="projectGitHubLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="uil:github" /> <span
          class="underline group-hover:no-underline">Code</span>
      </NuxtLink>
    </p>
    <p>
      <NuxtLink v-if="prjectDemoLink" :to="prjectDemoLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="oui:documentation" /> <span
          class="underline group-hover:no-underline">Documentaion</span>
      </NuxtLink>
    </p>
    <p>
      <NuxtLink v-if="nodePackageLink" :to="nodePackageLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="teenyicons:npm-solid" /> <span
          class="underline group-hover:no-underline">Npm Package</span>
      </NuxtLink>
    </p>
  </div>
</template>