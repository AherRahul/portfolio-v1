<script setup lang="ts">
defineProps<{
  project: any
}>()
</script>

<template>
  <AppLink :to="project._path"
    class="group flex flex-col justify-between hover:bg-gradient-to-r hover:-translate-y-2 transition-all duration-500 from-red-500/60 to-pink-600/60 px-4 py-8 bg-zinc-800">
    <AppParagraph tag="h3" class="text-2xl font-semibold">{{ project.title }}</AppParagraph>
    <AppParagraph look="paragraph" class="mt-8 group-hover:text-gray-200">{{ project.description }}</AppParagraph>
    <ProjectDetails
      class="mt-8 space-y-2"
      :projectGitHubLink="project.projectGitHubLink"
      :projectDemoLink="project.projectDemoLink"
    />
  </AppLink>
</template>