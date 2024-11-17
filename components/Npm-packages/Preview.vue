<script setup lang="ts">
defineProps<{
  npm_package: any
}>()
</script>

<template>
  <AppLink :to="npm_package._path"
    class="group flex flex-col justify-between hover:bg-gradient-to-r hover:-translate-y-2 transition-all duration-500 from-red-500/60 to-pink-600/60 px-4 py-8 bg-zinc-800">
    <AppParagraph tag="h3" class="text-2xl font-semibold">{{ npm_package.title }}</AppParagraph>
    <AppParagraph look="paragraph" class="mt-8 group-hover:text-gray-200">{{ npm_package.description }}</AppParagraph>
    <NpmPackagesDetails
      class="mt-8 space-y-2"
      :time="npm_package.time"
      :projectGitHubLink="npm_package.projectGitHubLink"
      :nodePackageLink="npm_package.nodePackageLink"
      :projectDemoLink="npm_package.projectDemoLink"
    />
  </AppLink>
</template>