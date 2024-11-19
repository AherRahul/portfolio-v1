<script setup lang="ts">


defineProps<{
  npmPackage: any
}>()
</script>

<template>
  <AppLink :to="npmPackage._path"
    class="group flex flex-col justify-between hover:bg-gradient-to-r hover:-translate-y-2 transition-all duration-500 from-red-500/60 to-pink-600/60 px-4 py-8 bg-zinc-800">
    <AppParagraph tag="h3" class="text-2xl font-semibold">{{ npmPackage.title }}</AppParagraph>
    <AppParagraph look="paragraph" class="mt-8 group-hover:text-gray-200">{{ npmPackage.description }}</AppParagraph>
    <PackageDetails
      class="mt-8 space-y-2"
      :time="npmPackage.time"
      :projectGitHubLink="npmPackage.projectGitHubLink"
      :nodePackageLink="npmPackage.nodePackageLink"
      :projectDemoLink="npmPackage.projectDemoLink"
    />
  </AppLink>
</template>