<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types/index.js';
import { joinURL } from 'ufo'
import { onContentNotFound } from '~/utils/content.js';

const { page: article, next, prev } = useContent()

onContentNotFound(article)

// TODO: Do we need this here?
useSeoMeta({
  title: () => article.value.title,
  description: () => article.value.description,
})

useSchemaOrg([
  defineArticle({
    description: article.value.description,
    datePublished: article.value.datePublished,
    dateModified: article.value.dateModified,
  })
])

const isOlderThanOneYear = computed(() => {
  const dateModified = new Date(article.value.dateModified)

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  return dateModified < oneYearAgo
})

const formattedUpdateAt = computed(() => formatDateStringToHumanReadable(article.value.dateModified))
const formattedCreatedAt = computed(() => formatDateStringToHumanReadable(article.value.datePublished))

const route = useRoute()
const linkToCurrentPage = withSiteUrl(route.path)

const links = computed(() => {
  const rawShareOnTwitter = `https://twitter.com/intent/tweet?text=I just read "${article.value.title}". Check it out!&url=${linkToCurrentPage.value}&via=rahulvijayaher`
  const shareOnTwitter = encodeURI(rawShareOnTwitter.replace(/#/g, 'No. '))

  const rawDiscussOnTwitter = `https://twitter.com/search?q=${linkToCurrentPage.value}`

  const editOnGitHub = `https://github.com/aherrahul/portfolio-v1/edit/main/content/${article.value._file}`
  return {
    shareOnTwitter,
    discussOnTwitter: encodeURI(rawDiscussOnTwitter),
    editOnGitHub
  }
})


const { addNotification } = useNotifications()
async function copyLinkToClipboard(): Promise<void> {
  await navigator.clipboard.writeText(linkToCurrentPage.value);
  addNotification({
    heading: 'Link copied to clipboard',
    body: 'You can now paste the link anywhere you want.',
    iconName: 'heroicons:check-badge',
    iconClass: 'text-green-500',
    durationInMs: 2000,
  })
}

// TODO: This should not be necessary. `surround` is buggy?
function isArticle(entry?: ParsedContent): Boolean {
  return Boolean(entry?._path?.startsWith('/articles/'))
}

defineOgImageComponent('Article', {
  title: article.value.title,
  topics: article.value.topics,
  readingTime: article.value.readingTime.text,
  datePublished: formattedUpdateAt.value
})
</script>
<template>
  <div>
    <AppSection class="bg-gradient-to-b from-black to-zinc-900 !pb-4">
      <AppLinkBack v-if="!article.showOnArticles" :to="`/courses/${article.courseName}`">Back to course</AppLinkBack>
      <AppLinkBack v-else to="/articles/">All articles</AppLinkBack>
      <ParagraphDecoration class="mt-4" />
      <AppParagraph class="mt-4" look="heading" tag="h1">
        {{ article.title }}
      </AppParagraph>
      <div class="flex flex-col md:flex-row gap-4 md:gap-0 justify-between mt-8">
        <div class="flex gap-3">
          <p class="mr-2">Updated at {{ formattedUpdateAt }}</p>
          <p class="mr-2"><Icon name="heroicons:clock" /> {{ article.readingTime.text }}</p>
          <p v-if="article.slidesUrl">
            <AppLink class="border-b-4 border-white/75 hover:border-white transition-all pr-1 pb-1" :to="article.slidesUrl">
              <Icon name="heroicons:bookmark" /> Want to edit 
            </AppLink>
          </p>
        </div>
        <ul class="flex gap-8">
          <li v-for="topic in article.topics" class="bg-zinc-800 text-sm px-3 py-1 rounded-md border border-gray-700">
            <AppLink class="hover:underline" :to="`/topics/${topic}`">#{{ topic }}</AppLink>
          </li>
        </ul>
      </div>
    </AppSection>
    <AppSection class="justify-center bg-zinc-900 pb-8">
      <div>
        <ArticleAgeWarning v-if="isOlderThanOneYear" />
        <ContentDoc class="prose md:prose-lg lg:prose-xl" :class="isOlderThanOneYear ? 'pt-8' : 'pt-4'" />
      </div>
      <div class="mt-16 md:mt-32">
        <div class="flex flex-col md:flex-row justify-between items-center gap-y-2 md:gap-0 mt-2">
          <div class="order-1">
            <AppLink
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              :to="links.shareOnTwitter">
              Tweet this article
            </AppLink> &bull;
            <button
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              @click="copyLinkToClipboard">
              Copy link
            </button>
          </div>
          <p v-if="article.datePublished !== article.dateModified"
            class="order-4 md:order-2 text-sm md:inline text-zinc-300">
            Originally published at {{ formattedCreatedAt }}
          </p>
          <div class="order-3">
            <AppLink
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              :to="links.discussOnTwitter">
              Discuss on <span class="line-through">Twitter</span> X
            </AppLink> &bull;
            <AppLink
              class="text-red-400 underline decoration-red-400/30 font-semibold transition-all duration-150 hover:decoration-red-400 inline-block"
              :to="links.editOnGitHub">
              Edit on GitHub
            </AppLink>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row gap-8 justify-center md:justify-start items-center mt-4 pt-8 md:pt-16 border-t border-t-gray-500/50">
        <div class="shrink-0">
          <img class="rounded-full mx-auto" width="192" height="192" src="/img/me@2x.png"
            alt="Photo of Rahul Aher">
        </div>
        <div class="col-span-4 text-center md:text-left">
          <h4 class="font-medium text-lg">Written by Rahul Aher</h4>
          <p class="max-w-xl text-lg mt-4 text-gray-400">
            I'm Rahul, <b>Sr. Software Engineer (SDE II)</b> and passionate content creator. 
            Sharing my expertise in software development to assist learners.
          </p>
          <AppLink to="/about/" class="underline hover:no-underline mt-2 inline-block">More about me</AppLink>
        </div>
      </div>
    </AppSection>
    <AppSection>
      <div class="flex flex-col gap-8 justify-between mt-16 md:flex-row md:gap-32 md:mt-24">
        <LazyArticlePreview v-if="isArticle(prev)" :article="prev" />
        <LazyArticlePreview v-if="isArticle(next)" :article="next" />
      </div>
    </AppSection>
  </div>
</template>
