<script setup lang="ts">
import type { ArticlePreview, TalkPreview, CoursePreview, ProjectPreview } from '~/types.js';
// import courseContent from '../content/courses/content-list/courses-list.json';

definePageMeta({
  documentDriven: false
})

const description = `I am Rahul, a Software Engineer (SDE II) based in India. I help companies to build better web applications and to improve their knowledge, workflows, and culture. My expertise in JavaScript, TypeScript, Vue.js, and Nuxt.js is highly valued by clients all around the world`

useSeoMeta({
  title: '',
  ogTitle: 'Rahul Aher - Web Engineering Consultant',
  description,
})

defineOgImageComponent('Main')

const { data: articles } = useAsyncData('latest-articles', () =>
  queryContent<ArticlePreview>('/articles')
    .where({ showOnArticles: true }) // Filter only those with showOnArticles = true
    .sort({
      dateModified: -1,
      datePublished: -1
    })
    .without(['body', 'excerpt'])
    .limit(4)
    .find()
)

const { data: talks } = useAsyncData('latest-learning', () => queryContent<TalkPreview>('/learning/').sort({
  date: -1
}).without(['body', 'excerpt']).limit(5).find())

const { data: projects } = useAsyncData('latest-projects', () => queryContent('/projects/').sort({
  onStartPage: 1
}).without(['body', 'excerpt']).limit(3).find())


const { data: courses } = useAsyncData('latest-courses', () => queryContent('/courses/').sort({
  onStartPage: 1
}).without(['body', 'excerpt']).limit(3).find())
</script>

<template>
  <div>
    <AppSection>
      <div class="md:flex md:flex-row items-center">
        <div class="mt-8 md:mt-0 md:w-3/5 md:flex-1">
          <div class="flex gap-8 -mx-4 md:mx-0">
            <div class="flex w-1/2 md:w-full items-center">
              <AppParagraph tag="h1" look="superHeading"
                class="flex flex-col sm:justify-start font-mono mt-8 md:mt-0 ml-4 md:ml-0">
                <span>Learn <span class="hidden md:inline md:ml-5 pl-8">//</span></span>
                <span>Build <span class="hidden md:inline md:ml-5 pl-4">//</span></span>
                <span>Share</span>
              </AppParagraph>
            </div>
            <div class="md:hidden w-1/2">
              <NuxtPicture format="avif,webp,png" width="358" height="468" densities="x1 x2" placeholder :img-attrs="{ class: 'z-20 relative' }"
                src="/img/rahul-main.png" alt="Photo of Rahul Aher" />
            </div>
          </div>
          <AppParagraph look="subParagraph" class="mt-8 ">
            Hello! I'm Rahul Aher, a seasoned Sr. Software Engineer at
            <AppLink to="https://www.morningstar.com/" style="color: #dc2626 var(--tw-gradient-from-position);"><b>Morningstar</b></AppLink>, 
            passionate about architecting transformative software solutions. With a results-oriented mindset, I pursue complex 
            challenges in Software and Product Development.
          </AppParagraph>
          <AppParagraph look="subParagraph" class="mt-6">
            I excel in web development, mastering Java, JS, and cloud technologies. Committed to innovation, I leverage expertise to
             boost team performance in dynamic environments.
          </AppParagraph>
          <div class="mt-8 flex">
            <AppButton to="https://asset.cloudinary.com/duojkrgue/a10e4a933b02a109d8d638d906054e5e" class="mr-4">Resume <Icon name="icons8:file" style="margin-bottom: 2px;" /></AppButton>
            <AppButton to="/about/" look="secondary">About <span class="hidden sm:inline">me</span></AppButton>
          </div>
          <div class="hidden md:flex mt-4 filter text-4xl gap-8">
            <AppLink title="To the Vue topic page" to="/topics/vue">
              <Icon class="" name="logos:vue" />
            </AppLink>
            <!-- <AppLink title="To the javascript topic page" to="/topics/javascript">
              <Icon class="" name="logos:javascript" />
            </AppLink> -->
            <AppLink title="To the NodeJs topic page" to="/topics/nodejs">
              <Icon class="" name="logos:nodejs-icon" />
            </AppLink>
            <!-- <AppLink title="To the java topic page" to="/topics/java">
              <Icon class="" name="logos:java" />
            </AppLink> -->
            <AppLink title="To the javascript topic page" to="/topics/spring">
              <Icon class="" name="logos:spring-icon" />
            </AppLink>  
            <AppLink title="To the aws topic page" to="/topics/aws">
              <Icon class="" name="logos:aws" />
            </AppLink>
            <!-- <AppLink title="To the java topic page" to="/topics/mysql">
              <Icon class="" name="logos:mysql" />
            </AppLink> -->
            <AppLink title="To the aws topic page" to="/topics/mongodb">
              <Icon class="" name="logos:mongodb-icon" />
            </AppLink>
          </div>
          <!-- <div class="hidden md:flex filter text-4xl gap-8">
            <AppLink title="To the Vue topic page" to="/topics/vue">
              <Icon class="" name="logos:vue" />
            </AppLink>
            <AppLink title="To the javascript topic page" to="/topics/javascript">
              <Icon class="" name="logos:javascript" />
            </AppLink>
            <AppLink title="To the java topic page" to="/topics/java">
              <Icon class="" name="logos:java" />
            </AppLink>
            <AppLink title="To the aws topic page" to="/topics/aws">
              <Icon class="" name="logos:aws" />
            </AppLink>
            <AppLink title="To the Vue topic page" to="/topics/vue">
              <Icon class="" name="logos:vue" />
            </AppLink>
            <AppLink title="To the javascript topic page" to="/topics/javascript">
              <Icon class="" name="logos:javascript" />
            </AppLink>
            <AppLink title="To the java topic page" to="/topics/java">
              <Icon class="" name="logos:java" />
            </AppLink>
            <AppLink title="To the aws topic page" to="/topics/aws">
              <Icon class="" name="logos:aws" />
            </AppLink>
          </div> -->
        </div>
        <div class="w-1/2 md:w-2/5 md:flex-1 h-full hidden md:flex justify-end items-center md:ml-32 md:mt-8">
          <NuxtPicture format="avif,webp,png" width="544" height="710" densities="x1 x2" placeholder :img-attrs="{ class: 'z-20 relative' }"
            src="/img/rahul-main.png" alt="Photo of Rahul Aher" />
        </div>
      </div>
      <ContentDivider class="mt-16 md:-mt-10" />
    </AppSection>

    <AppSection class="my-32" style="margin-bottom: 4.5rem;" >
      <div class="flex flex-col gap-16 md:gap-8 md:flex-row justify-around ">
        <LazyServicePreview class="max-w-xl bg-zinc-900 p-8" icon="eos-icons:machine-learning-outlined" title="Learn" to="/learning">
          I'm passionate about continuous learning and believe in the value of hands-on experience. I actively 
          learn new concepts, ensuring a deeper understanding of each topic. This proactive approach fuels my 
          growth mindset and fosters ongoing professional development.
        </LazyServicePreview>
        <LazyServicePreview class="max-w-xl bg-zinc-900 p-8" icon="ph:chalkboard-teacher-light" title="Build" to="/projects">
          I am dedicated to continuous learning, and I reinforce my understanding of new concepts by applying them
           to real-world projects. This approach not only enhances my skills but also allows me to delve 
           deeper into each concept, ensuring a comprehensive understanding.
        </LazyServicePreview>
        <LazyServicePreview class="max-w-xl bg-zinc-900 p-8" icon="mdi:lightbulb-on-outline" title="Share" to="/articles">
          I love to share my knowledge and experience with the community. I mentor CDAC students, guiding them into 
          the software world. I enjoy collaborating on problem-solving, discussing optimal abstractions, and refining 
          architecture to ensure successful outcomes.
        </LazyServicePreview>
      </div>
      <ContentDivider class="mt-32" anchor="left" />
    </AppSection>

    <AppSection class="bg-zinc-900">
      <LazyParagraphDecoration class="mt-16" />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading">
        Concepts - Learning
      </AppParagraph>
      <div class="flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
        <AppParagraph look="subParagraph" class="mt-8 max-w-xl">
          <span style="font-style: italic;">“I am always ready to learn although I do not always like being taught.”</span> — Winston Churchill
        </AppParagraph>
        <div>
          <AppButton to="/learning/" look="secondary">View all Learning's</AppButton>
        </div>
      </div>
      <div class="flex flex-col space-y-8 mt-8">
        <LazyLearningPreview v-for="talk in talks" :key="talk._id" :talk="talk" />
      </div>
      <div class="flex md:justify-end mt-16">
        <AppButton to="/learning/" look="secondary">View all Learning's</AppButton>
      </div>
      <ContentDivider class="mt-14" />
    </AppSection>

    <AppSection style="padding-top: 2.5rem;">
      <LazyParagraphDecoration />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading">
        Projects - Building
      </AppParagraph>
      <div class="flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
        <AppParagraph look="subParagraph" class="mt-8 max-w-xl">
          <span style="font-style: italic;">“Offline-first is not just a feature, it’s a mindset. It’s about 
            building resilient systems that empower users, no matter their connection status.”</span> — Akshat Paul
         </AppParagraph>
        <div>
          <AppButton to="/projects/" look="secondary">Discover all Projects</AppButton>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-16 md:gap-8 justify-around mt-8">
        <LazyProjectPreview class="flex-1" v-for="project in projects" :project="project" />
      </div> 
      <ContentDivider anchor="left" class="mt-14" />
    </AppSection>

    <AppSection class="bg-zinc-900">
      <LazyParagraphDecoration class="mt-16" />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading"> 
        Knowledge - Sharing
      </AppParagraph>
      <div class="flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
        <AppParagraph look="subParagraph" class="mt-8 max-w-xl">
          <span style="font-style: italic;">“You might not think that programmers are artists, but programming 
            is an extremely creative profession. It’s logic-based creativity.”</span> — Alex Litcher
          
        </AppParagraph>
        <div>
          <AppButton to="/articles" look="secondary" secondary-after-bg="bg-zinc-900">View all articles</AppButton>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-12 justify-around mt-8">
        <LazyArticlePreview v-for="article in articles" :key="article._id" :article="article" />
      </div>
      <div class="flex md:justify-end mt-8">
        <AppButton to="/articles" look="secondary" secondary-after-bg="bg-zinc-900">View all articles</AppButton>
      </div>
      
      <ContentDivider anchor="right" class="mt-14" />
    </AppSection>

    <AppSection style="padding-top: 2.5rem;">
      <LazyParagraphDecoration />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading">
        Courses
      </AppParagraph>
      <div class="flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
        <AppParagraph look="subParagraph" class="mt-8 max-w-xl">
          <span style="font-style: italic;">“Offline-first is not just a feature, it’s a mindset. It’s about 
            building resilient systems that empower users, no matter their connection status.”</span> — Akshat Paul
         </AppParagraph>
        <div>
          <AppButton to="/courses/" look="secondary">Discover all courses</AppButton>
        </div>
      </div>
      <div class="flex flex-col space-y-8 mt-8">
        <LazyCoursePreview class="flex-1" v-for="course in courses"  :course="course" />
      </div> 
      <ContentDivider anchor="left" class="mt-14" />
    </AppSection>
   
  </div>
</template>

<!-- https://icones.js.org/ -->