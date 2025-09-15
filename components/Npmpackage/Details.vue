<script setup lang="ts">
const props = withDefaults(defineProps<{
  projectGitHubLink?:string
  projectDemoLink?:string
  nodePackageLink?:string
}>(), {})

</script>

<template>
  <div>
    <p>
      <NuxtLink v-if="nodePackageLink" :to="nodePackageLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="teenyicons:npm-solid" /> <span
          class="underline group-hover:no-underline">Npm Package</span>
      </NuxtLink>
    </p>
    <p>
      <NuxtLink v-if="projectDemoLink" :to="projectDemoLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="oui:documentation" /> <span
          class="underline group-hover:no-underline">Documentation</span>
      </NuxtLink>
    </p>
    <p>
      <NuxtLink v-if="projectGitHubLink" :to="projectGitHubLink" class="group" target="_blank">
        <Icon class="text-2xl mr-2" name="uil:github" /> <span
          class="underline group-hover:no-underline">Code</span>
      </NuxtLink>
    </p>
  </div>
</template>