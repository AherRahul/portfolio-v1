<script setup lang="ts">
import { onContentNotFound } from '~/utils/content.js';

const { page: npmPackage } = useContent()

useSeoMeta({
  title: () => npmPackage.value.title,
  description: () => npmPackage.value.description,  
  ogTitle: () => npmPackage.value.title,
  ogDescription: () => npmPackage.value.description,
})

onContentNotFound(npmPackage)

const requestQuoteLink = computed(() => {
  const prefix = 'mailto:rahulvijayaher@gmail.com?subject=Npm_package collabration request: '
  const title = npmPackage.value.title
  const suffix = `&body=Hi Rahul,%0D%0A%0D%0Awe would like to collabrate with you for the ${title} npm_package.%0D%0A%0D%0A

  Desired/Possible time for contribution per week: %0D%0A

  Location: %0D%0A

  Your skill-set: %0D%0A

  linkedin Profile: %0D%0A

  Github Profile:  %0D%0A%0D%0A

  Further comments or info:%0D%0A
  `
  return prefix + title + suffix
})

defineOgImageComponent('Package', {
  title: npmPackage.value.title,
  projectGitHubLink: npmPackage.value.projectGitHubLink,
})

</script>

<template>
  <div>
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 !pb-4">
      <AppLinkBack to="/packages/">All Npm Packages</AppLinkBack>
      <ParagraphDecoration class="mt-4" />
      <AppParagraph class="mt-4" look="heading" tag="h1">
        {{ npmPackage.title }}
      </AppParagraph>
      <PackageDetails 
        :projectGitHubLink="npmPackage.projectGitHubLink"
        :nodePackageLink="npmPackage.nodePackageLink"
        :projectDemoLink="npmPackage.projectDemoLink"
        class="mt-8 space-y-2 md:space-y-0 md:flex gap-8"
      />
    </AppSection>
    <AppSection class="bg-zinc-900 !pb-0" inner-class="border-b border-zinc-800">
      <div class="justify-center gap-8 pb-16">
        <div>
          <div class="prose md:prose-lg lg:prose-xl pt-0.5">
            <ContentDoc />
          </div>
          <AppButton :to="requestQuoteLink" class="hidden md:block mt-8 text-xl">Do you want to collabrate?</AppButton>
        </div>
      </div>
    </AppSection>
  </div>
</template>