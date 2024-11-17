<script setup lang="ts">
const props = withDefaults(defineProps<{
  projectGitHubLink?:string
  projectDemoLink?:string
}>(), {})


</script>

<template>
  <div>
    <p>
      <NuxtLink v-if="projectGitHubLink" :to="projectGitHubLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="uil:github" /> <span
          class="underline group-hover:no-underline">Code</span>
      </NuxtLink>
    </p>
    <p>
      <NuxtLink v-if="projectDemoLink" :to="projectDemoLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="oui:documentation" /> <span
          class="underline group-hover:no-underline">Live Project Link</span>
      </NuxtLink>
    </p>
  </div>
</template>