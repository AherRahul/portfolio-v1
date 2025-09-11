<script setup lang="ts">
import { onContentNotFound } from '~/utils/content.js';

const { page: project } = useContent()

// useSeoMeta({
//   title: () => project.value.title,
//   description: () => project.value.description,  
//   ogTitle: () => project.value.title,
//   ogDescription: () => project.value.description,
// })

onContentNotFound(project)

try {
  defineOgImageComponent('Project', {
    title: project.value.title,
    time: project.value.time,
    attendees: project.value.attendees ?? 20,
    languages: project.value.languages ?? ['English'],
    projectGitHubLink: project.value.projectGitHubLink,
  })
} catch {}

</script>

<template>
  <div>
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 !pb-4">
      <AppLinkBack to="/projects/">All Projects</AppLinkBack>
      <ParagraphDecoration class="mt-4" />
      <AppParagraph class="mt-4" look="heading" tag="h1">
        {{ project.title }}
      </AppParagraph>
      <ProjectDetails 
        :time="project?.time"
        :projectGitHubLink="project?.projectGitHubLink"
        :nodePackageLink="project?.nodePackageLink"
        :projectDemoLink="project?.projectDemoLink"
        class="mt-8 space-y-2 md:space-y-0 md:flex gap-8"
      />
    </AppSection>
    <AppSection class="bg-zinc-900 !pb-0" inner-class="border-b border-zinc-800">
      <div class="justify-center gap-8 pb-16">
        <div>
          <div class="prose md:prose-lg lg:prose-xl pt-0.5">
            <ContentDoc />
          </div>
        </div>
      </div>
    </AppSection>
  </div>
</template>