<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import { onContentNotFound } from '~/utils/content.js'

const { page } = useContent()

onContentNotFound(page)

const route = useRoute()

const baseQuery = {
  where: [{ topics: { $contains: route.params.slug } }]
}

const articleQuery: QueryBuilderParams = {
  ...baseQuery,
  path: '/articles/',
  sort: [{
    dateModified: -1,
    datePublished: -1
  }]
}

const learningQuery: QueryBuilderParams = {
  ...baseQuery,
  path: '/learning/',
  sort: [{
    date: -1,
  }]
}

const projectQuery: QueryBuilderParams = {
  ...baseQuery,
  path: '/projects/'
}


const npmpackageQuery: QueryBuilderParams = {
  ...baseQuery,
  path: '/npmpackages/'
}


const courseQuery: QueryBuilderParams = {
  ...baseQuery,
  path: '/courses/'
}
const title = `Topic: ${page.value.title}`
const description = `Being it talks, projects, panels, podcasts or blog posts, here you can find all my content sorted by topic.`

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('Learning')
</script>
<template>
  <div>
    <AppSection class="bg-gradient-to-b !pb-4">
      <AppLinkBack to="/topics/">To topic selection</AppLinkBack>
      <ParagraphDecoration class="mt-4" />
      <AppParagraph class="mt-4" look="heading" tag="h1">
        Topic: {{ page.title }}
      </AppParagraph>
    </AppSection>
    <AppSection class="justify-center pb-8">
      <ContentList :query="projectQuery">
        <template #default="{ list }">
          <AppParagraph class="pt-16 !text-4xl" look="heading" tag="h2">
            Projects
          </AppParagraph>
          <div class="space-y-8 md:space-y-0 md:grid grid-cols-2 gap-12 justify-around my-8">
            <ProjectPreview v-for="entry in list" :key="entry._path" :project="entry" />
          </div>
        </template>
        <template #not-found></template>
      </ContentList>

      <ContentList :query="articleQuery">
        <template #default="{ list }">
          <AppParagraph class="pt-16 !text-4xl" look="heading" tag="h2">
            Articles
          </AppParagraph>
          <div class="grid md:grid-cols-2 gap-y-16 md:gap-8 my-8">
            <ArticlePreview v-for="entry in list" :key="entry._path" :article="entry" />
          </div>
        </template>
        <template #not-found></template>
      </ContentList>

      <ContentList :query="learningQuery">
        <template #default="{ list }">
          <AppParagraph class="pt-16 !text-4xl" look="heading" tag="h2">
            Talks & Podcasts
          </AppParagraph>
          <div class="space-y-8 my-8">
            <LearningPreview v-for="entry in list" :key="entry._path" :talk="entry" />
          </div>
        </template>
        <template #not-found></template>
      </ContentList>

      
      <ContentList :query="courseQuery">
        <template #default="{ list }">
          <AppParagraph class="pt-16 !text-4xl" look="heading" tag="h2">
            Courses
          </AppParagraph>
          <div class="space-y-8 my-8">
            <CoursePreview v-for="entry in list" :key="entry._path" :course="entry" />
          </div>
        </template>
        <template #not-found></template>
      </ContentList>

      
      <ContentList :query="npmpackageQuery">
        <template #default="{ list }">
          <AppParagraph class="pt-16 !text-4xl" look="heading" tag="h2">
            Npm Packages
          </AppParagraph>
          <div class="space-y-8 my-8">
            <NpmpackagePreview v-for="entry in list" :key="entry._path" :npmpackage="entry" />
          </div>
        </template>
        <template #not-found></template>
      </ContentList>
    </AppSection>
  </div>
</template>