<script setup lang="ts">
defineProps<{
  npmpackage: any
}>()
</script>

<template>
  <AppLink :to="npmpackage._path"
    class="group flex flex-col justify-between hover:bg-gradient-to-r hover:-translate-y-2 transition-all duration-500 from-red-500/60 to-pink-600/60 px-4 py-8 bg-zinc-800">
    <AppParagraph tag="h3" class="text-2xl font-semibold">{{ npmpackage.title }}</AppParagraph>
    <AppParagraph look="paragraph" class="mt-8 group-hover:text-gray-200">{{ npmpackage.description }}</AppParagraph>
    <NpmpackageDetails
      class="mt-8 space-y-2"
      :time="npmpackage.time"
      :projectGitHubLink="npmpackage.projectGitHubLink"
      :nodePackageLink="npmpackage.nodePackageLink"
      :projectDemoLink="npmpackage.projectDemoLink"
    />
  </AppLink>
</template>