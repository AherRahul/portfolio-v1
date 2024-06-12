<script setup lang="ts">
import { onContentNotFound } from '~/utils/content.js';

const { page: project } = useContent()

useSeoMeta({
  title: () => project.value.title,
  description: () => project.value.description,  
  ogTitle: () => project.value.title,
  ogDescription: () => project.value.description,
})

onContentNotFound(project)

const requestQuoteLink = computed(() => {
  const prefix = 'mailto:rahulvijayaher@gmail.com?subject=Project collabration request: '
  const title = project.value.title
  const suffix = `&body=Hi Rahul,%0D%0A%0D%0Awe would like to collabrate with you for the ${title} project.%0D%0A%0D%0A

  Desired/Possible time for contribution per week: %0D%0A

  Location: %0D%0A

  Your skill-set: %0D%0A

  linkedin Profile: %0D%0A

  Github Profile:  %0D%0A%0D%0A

  Further comments or info:%0D%0A
  `
  return prefix + title + suffix
})

defineOgImageComponent('Project', {
  title: project.value.title,
  time: project.value.time,
  attendees: project.value.attendees ?? 20,
  languages: project.value.languages ?? ['English', 'Indian'],
  projectGitHubLink: project.value.projectGitHubLink,
})

</script>

<template>
  <div>
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 !pb-4">
      <AppLinkBack to="/projects/">All Projects</AppLinkBack>
      <ParagraphDecoration class="mt-4" />
      <AppParagraph class="mt-4" look="heading" tag="h1">
        {{ project.title }}
      </AppParagraph>
      <ProjectDetails :time="project.time" class="mt-8 space-y-2 md:space-y-0 md:flex gap-8" />
    </AppSection>
    <AppSection class="bg-zinc-900 !pb-0" inner-class="border-b border-zinc-800">
      <div class="justify-center gap-8 pb-16">
        <div>
          <div class="prose md:prose-lg lg:prose-xl pt-0.5">
            <ContentDoc />
          </div>
          <AppButton :to="requestQuoteLink" class="hidden md:block mt-8 text-xl">Do you want to collabrate.?</AppButton>
        </div>
        <!-- <div>
          <div class="flex flex-col items-center mt-12">
            <div>
              <img id="trainer" class="w-48 h-48 rounded-full mx-auto" width="192" height="192" src="/img/me@2x.jpg"
                alt="Photo of Rahul Aher">
              <AppLink to="/about/" class="underline hover:no-underline">
                <AppParagraph class="mt-4 text-2xl text-center">
                  Rahul Aher
                </AppParagraph>
              </AppLink>
              <AppParagraph class="mt-2 text-center">
                <b>Nuxt team member</b> &bull; Consultant &bull; Trainer
              </AppParagraph>
            </div>
            <AppButton :to="requestQuoteLink" class="mt-8 text-xl">Request quote</AppButton>
          </div>
        </div> -->
      </div>
    </AppSection>
  </div>
</template>