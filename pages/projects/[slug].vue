<script setup lang="ts">
import { onContentNotFound } from '~/utils/content.js';

const { page: project } = useContent()
const { setupContentImages } = useContentImages()

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

// Setup image modal for content images
onMounted(() => {
  setupContentImages('.project-content')
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
      <ProjectDetails 
        :time="project?.time"
        :projectGitHubLink="project?.projectGitHubLink"
        :nodePackageLink="project?.nodePackageLink"
        :projectDemoLink="project?.projectDemoLink"
        class="mt-8 space-y-2 md:space-y-0 md:flex gap-8"
      />
      
      <!-- Content Reader positioned below heading -->
      <div class="mt-8">
        <ClientOnly>
          <LazyContentReader :prepend="project.title" content-selector=".project-content" />
        </ClientOnly>
      </div>
    </AppSection>
    <AppSection class="bg-zinc-900 !pb-0" inner-class="border-b border-zinc-800">
      <div class="justify-center gap-4 md:gap-6 lg:gap-8 pb-8 md:pb-12 lg:pb-16">
        <div>
          <div class="prose md:prose-lg lg:prose-xl pt-2 md:pt-3 lg:pt-4 project-content">
            <ContentDoc />
          </div>
        </div>
      </div>
    </AppSection>
  </div>
</template>