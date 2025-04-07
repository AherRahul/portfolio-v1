<script setup lang="ts">
import type { ArticlePreview, TalkPreview } from '~/types.js';

definePageMeta({
  documentDriven: false,
  open: false,
})

const title = 'About'
const description = 'Find out or about me as a person, my personal history, my business and open source contributions.'

useSeoMeta({
  title,
  description,
})

defineOgImageComponent('General')

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

const { data: projects } = useAsyncData('latest-projects', () => queryContent('/projects/').sort({
  onStartPage: 1
}).without(['body', 'excerpt']).limit(3).find())
</script>

<template>
  <div>
    <AppSection>
      <ParagraphDecoration />
      <AppParagraph look="heading" class="mt-4" tag="h1">About me</AppParagraph>
      <div class="lg:grid grid-cols-2 lg:items-end mt-16 lg:mt-0">
        <div class="lg:hidden">
          <img class="w-48 h-48 rounded-full mx-auto" width="192" height="192" src="/img/me@2x.png"
            alt="Photo of Rahul Aher">
        </div>
        <div class="-mt-16 lg:mt-0">
          <div class="prose lg:prose-lg lg:mt-8">
            <h2 style="color: var(--tw-prose-links);"><b>Hey! I'm Rahul Aher.</b></h2>
            <p>
              I am a results-driven technologist with an unwavering focus on optimization and innovation. My background includes 
              a Bachelor’s degree in Computer Engineering and a Postgraduate Diploma in Advanced Computing, providing a solid 
              foundation. Currently, I am pursuing a Master of Science in Software Engineering, which keeps me at the forefront 
              of the field. I thrive in dynamic environments where I can push boundaries and deliver transformative solutions 
              that surpass expectations.
            </p>
            <p>
              I consistently exceed role expectations by addressing root-cause challenges, driving 
              sustainable improvements, and achieving exceptional results. My passion for technology fuels my commitment to 
              staying updated with the latest trends and tools, enabling me to craft clean, concise, and efficient code.
            </p>
            <ul>
              <li>
                  Over 5 years of experience in software engineering, specializing in product development within the tech industry.
              </li>
              <li>
                  Currently excelling as a Software Engineer at Morningstar, Navi Mumbai, where I focus on developing and designing 
                  REST APIs using Spring MVC, Hibernate, and JPA.
              </li>
              <li>
                  Possess a strong foundation in Java technologies, including Core Java, Spring, Spring Boot, and Spring MVC, ensuring 
                  the development and enhancement of software products.
              </li>
              <li>
                  Successfully automated critical tasks, reducing manual intervention by 90% with Quartz Job Scheduler, and achieved 
                  a remarkable 75% client satisfaction rate through responsive support.
              </li>
              <li>
                  Proficient in front-end technologies such as HTML, CSS, JavaScript, jQuery, AJAX, JSON, XML, Node.js, Vue.js, Vuex, 
                  Vue Router, and RabbitMQ.
              </li>
              <li>
                  Recognized for leading the seamless migration of a legacy project to Vue.js, enhancing user interface functionality 
                  and implementing robust security measures against vulnerabilities.
              </li>
            </ul>

            <p>
              With a strong commitment to excellence and a proactive approach to problem-solving, I am dedicated to driving innovation 
              and delivering high-quality software solutions that make a meaningful impact.
            </p>
            
            <h2 class="mb-0">Tech Stack</h2>
            <ParagraphDecoration class="mb-0" />

            <p>Various frameworks and libraries are a joy to work with! If I had to choose my dream tech stack though,
              I'd pick the following:</p>

            <ul class="ml-auto not-prose flex my-8 md:filter text-3xl md:text-4xl gap-4 md:gap-8 justify-center">
              <li>
                <AppLink to="/topics/vue" class="flex flex-col items-center group">
                  <Icon class="md:grayscale md:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    name="logos:vue" />
                  <p
                    class="text-sm md:text-base mt-2 text-zinc-200 md:text-gray-200/50 group-hover:text-white transition-all">
                    Vue.js</p>
                </AppLink>
              </li>
              <li>
                <AppLink to="/topics/nodejs" class="flex flex-col items-center group">
                  <Icon class="md:grayscale md:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    name="logos:nodejs-icon" />
                  <p
                    class="text-sm md:text-base mt-2 text-zinc-200 md:text-gray-200/50 group-hover:text-white transition-all">
                    NodeJs
                  </p>
                </AppLink>
              </li>
              <li>
                <AppLink to="/topics/spring" class="flex flex-col items-center group">
                  <Icon class="md:grayscale md:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    name="logos:spring-icon" />
                  <p
                    class="text-sm md:text-base mt-2 text-zinc-200 md:text-gray-200/50 group-hover:text-white transition-all">
                    Spring
                  </p>
                </AppLink>
              </li>
              <li>
                <AppLink to="/topics/mysql" class="flex flex-col items-center group">
                  <Icon class="md:grayscale md:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    name="logos:mysql" />
                  <p
                    class="text-sm md:text-base mt-2 text-zinc-200 md:text-gray-200/50 group-hover:text-white transition-all">
                    MySQL</p>
                </AppLink>
              </li>
              <li>
                <AppLink to="/topics/aws" class="flex flex-col items-center group">
                  <Icon class="md:grayscale md:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    name="logos:aws" />
                  <p
                    class="text-sm md:text-base mt-2 text-zinc-200 md:text-gray-200/50 group-hover:text-white transition-all">
                    aws</p>
                </AppLink>
              </li>
            </ul>
            
            <p>
              But of course, not all projects are greenfield projects, and often enough you have to work with legacy code.
              This is no problem at all! I'm proficient in handling (and migrating) Vue 2, any kind of
              component library, plain JavaScript, jQuery, and others!
            </p>

            <h2 class="mb-0">Skills</h2>
            <ParagraphDecoration class="mb-0" />

            <p class="mb-1">Programming Languages:</p>

            <div class="flex flex-col gap-0 sm:gap-2 sm:flex-row my-0">
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> JavaScript </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> TypeScript </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> HTML </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> CSS </rds-badge>
              </div>
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Sass </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> PHP </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> GraphQL </rds-badge>
              </div>
            </div>

            <p class="mb-1 mt-2">Libraries & Frameworks:</p>

            <div class="flex flex-col gap-0 sm:gap-2 sm:flex-row my-0">
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> React </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Next.js </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Gatsby </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Eleventy </rds-badge>
              </div>
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Node.js </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> React Native </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Tailwind CSS </rds-badge>
              </div>
            </div>
            <div class="flex flex-col gap-0 sm:gap-2 sm:flex-row my-0">
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Styled Components </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Framer Motion </rds-badge>
              </div>
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Anime.js </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Timber for WordPress </rds-badge>
              </div>
            </div>

            
            <p class="mb-1 mt-2">Tools & Platforms:</p>

            <div class="flex flex-col gap-0 sm:gap-2 sm:flex-row my-0">
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Git </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  GitHub </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Netlify </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Vercel </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Heroku </rds-badge>
              </div>
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> WordPress </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Contentful </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Algolia </rds-badge>
              </div>
            </div>
            <div class="flex flex-col gap-0 sm:gap-2 sm:flex-row my-0">
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Firebase </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Storybook </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Docker </rds-badge>
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1">  Webpack </rds-badge>
              </div>
              <div class="flex gap-2 sm:gap-2">
                <rds-badge variant="red" size="md" class="my-0 hover:animate-bg-shift mt-1"> Figma </rds-badge>
              </div>
            </div>
          </div>
        </div>
        <div class="hidden sticky bottom-0 lg:block">
          <NuxtPicture width="608" height="931" format="avif,webp,png" densities="x1 x2" placeholder
            :img-attrs="{ class: 'z-20 ml-24 -mb-24' }" src="/img/rahul-main.png" alt=""
            aria-hidden />
          </div>
        </div>
        <ContentDivider anchor="right" class="mt-14 hidden lg:block" />
    </AppSection>

    <AppSection class="bg-zinc-900">
      <LazyParagraphDecoration class="mt-16" />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading"> 
        Education & Experience
      </AppParagraph>
        <div class="lg:grid lg:items-end">
          <div class="lg:mt-0">
            <div class="prose lg:prose-lg lg:mt-8">
              <rds-grid style="margin-top: 0px;">
                <rds-row>
                  <rds-col cols="12" offset="0" colsAtS="12" colsAtM="12" colsAtL="12" colsAtXl="12">
                    <p>
                      With a strong foundation in software development and a comprehensive understanding of modern 
                      technologies, I have successfully combined academic knowledge with hands-on experience to deliver 
                      impactful solutions. My education has provided me with a solid grasp of advanced software development 
                      practices, system design, and data analysis. Over the course of my career, I have honed my skills in 
                      full stack development, leveraging technologies such as Java, Angular, Node.js, and AWS to build 
                      scalable applications. My experience extends to designing REST APIs, implementing Microservices 
                      architecture, and automating critical tasks. I am adept at migrating legacy systems, ensuring robust
                       security, and maintaining high client satisfaction. This blend of formal education and practical 
                       experience has equipped me to tackle complex technical challenges and contribute effectively to 
                       innovative projects.
                    </p>
                  </rds-col>
                </rds-row>
                <rds-row>
                  <rds-col cols="6" offset="0" colsAtS="12" colsAtM="12" colsAtL="6" colsAtXl="6"  class="mt-16">
                    <div>
                      <div data-v-1e303c13 class="rds-timeline-item mb-0 flex">
                        <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 25%; margin-top: 1.5rem !important;"> Oct 2021 - Present </div>
                        <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                          <Icon class="text-sm md:text-base" name="vaadin:workplace" style="font-size: 1.5rem;" />
                          <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                          <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                        </div>
                        <div data-v-1e303c13 class="rds-timeline-item__content-container" style="width: 90%;  margin-top: 1.5rem !important;">
                          <div data-v-1e303c13 class="rds-timeline-item__title"> Morningstar </div>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Full Time • 2yrs 10 mos </span><br/>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Navi Mumbai, Maharastra, India </span>

                          <div class="rds-timeline pl-0" style="--e7dc6904: column; --8a08cf80: 49.25px;">
                            <div data-v-1e303c13="" class="rds-timeline-item">
                              <div data-v-1e303c13="" class="rds-timeline-item__timeline-container">
                                <span data-v-1e303c13 class="rds-timeline-item__pin--white z-10"></span>
                                <div data-v-1e303c13 class="tail--dashed w-1.5 h-20 z-10"></div>
                              </div>
                              <div data-v-1e303c13="" class="rds-timeline-item__content-container">
                                <div data-v-1e303c13="" class="rds-timeline-item__title"> Senior Software Engineer<br>
                                  <span data-v-1e303c13="" class="rds-timeline-item__text"> Jan 2023 - Present </span>
                                </div>
                                
                                <rds-collapsible-container
                                  :modelValue="true"
                                  title="Responsibility"
                                  style="color: white;"
                                >
                                  <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                                    <ul>
                                      <li>Creating REST APIs with Spring MVC, Hibernate, and JPA, ensuring compliance with coding standards and best practices.</li>
                                      <li>Implementing Microservices architecture to enhance modularity, scalability, and performance.</li>
                                      <li>Automating tasks with Quartz Job Scheduler, reducing manual intervention by 90% for improved efficiency.</li>
                                      <li>Maintaining a 75% client satisfaction rate through responsive support and strong relationships.</li>
                                      <li>Orchestrating legacy project migrations to Vue.js for modernized user interfaces and improved functionality.</li>
                                      <li>Enforcing security measures against SQL Injection and XSS vulnerabilities to protect data and application integrity.</li>
                                    </ul>
                                  </p>
                                </rds-collapsible-container>
                              </div>
                            </div>
                            <div data-v-1e303c13="" class="rds-timeline-item -mt-5">
                              <div data-v-1e303c13="" class="rds-timeline-item__timeline-container">
                                <span data-v-1e303c13 class="rds-timeline-item__pin--white z-10"></span>
                                <div data-v-1e303c13 class="tail--dashed w-1.5 h-20 z-10" ></div>
                              </div>
                              <div data-v-1e303c13="" class="rds-timeline-item__content-container">
                                <div data-v-1e303c13="" class="rds-timeline-item__title"> Software Engineer<br>
                                  <span data-v-1e303c13="" class="rds-timeline-item__text"> Oct 2021 - Dec - 2022 </span>
                                </div>
                                <rds-collapsible-container
                                  :modelValue="false"
                                  title="Responsibility"
                                  style="color: white;"
                                >
                                  <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                                    <ul>
                                      <li>Improved product stability and scalability through autoscaling and worker optimization.</li>
                                      <li>Enhanced development efficiency with a generic pipeline for Java applications.</li>
                                      <li>Increased system observability and proactive issue identification with New Relic.</li>
                                      <li>Successfully migrated critical infrastructure and data with zero downtime.</li>
                                      <li>Effectively led team through major production incidents and proposed innovative solutions.</li>
                                    </ul>
                                  </p>
                                </rds-collapsible-container>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-v-1e303c13 class="rds-timeline-item mb-0 -mt-5 flex">
                        <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 25%;"> Sep 2019 - Oct 2021 </div>
                        <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                          <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                          <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                        </div>
                        <div data-v-1e303c13 class="rds-timeline-item__content-container" style="width: 90%;">
                          <div data-v-1e303c13 class="rds-timeline-item__title"> BTS </div>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Full Time • 2yrs 2 mos </span><br/>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Mumbai, Maharastra, India </span>

                          <div class="rds-timeline pl-0" style="--e7dc6904: column; --8a08cf80: 49.25px;">
                            <div data-v-1e303c13="" class="rds-timeline-item">
                              <div data-v-1e303c13="" class="rds-timeline-item__timeline-container">
                                <span data-v-1e303c13 class="rds-timeline-item__pin--white z-10"></span>
                                <div data-v-1e303c13 class="tail--dashed w-1.5 h-20 z-10"></div>
                              </div>
                              <div data-v-1e303c13="" class="rds-timeline-item__content-container">
                                <div data-v-1e303c13="" class="rds-timeline-item__title"> Software Engineer<br>
                                  <span data-v-1e303c13="" class="rds-timeline-item__text"> Sept 2020 - Oct 2021 </span>
                                </div>
                                <rds-collapsible-container
                                  :modelValue="false"
                                  title="Responsibility"
                                  style="color: white;"
                                >
                                  <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                                    <ul>
                                      <li>Honed skills in essential technologies and methodologies as an associate developer.</li>
                                      <li>Deep understanding of SQL for designing efficient databases and data-driven applications.</li>
                                      <li>Adept at using Microsoft Excel for insights and workflow optimization.</li>
                                      <li>Expertise in front-end technologies (Angular, HTML5, CSS) for building user-friendly, responsive interfaces.</li>
                                      <li>Experienced in client requirements gathering to meet client needs effectively.</li>
                                    </ul>
                                  </p>
                                </rds-collapsible-container>
                                
                              </div>
                            </div>
                            <div data-v-1e303c13="" class="rds-timeline-item -mt-5">
                              <div data-v-1e303c13="" class="rds-timeline-item__timeline-container">
                                <span data-v-1e303c13 class="rds-timeline-item__pin--white z-10"></span>
                                <div data-v-1e303c13 class="tail--dashed w-1.5 h-20 z-10" ></div>
                              </div>
                              <div data-v-1e303c13="" class="rds-timeline-item__content-container">
                                <div data-v-1e303c13="" class="rds-timeline-item__title"> Associate Software Engineer<br>
                                  <span data-v-1e303c13="" class="rds-timeline-item__text"> Sept 2020 - Sept 2020 </span>
                                </div>
                                <rds-collapsible-container
                                  :modelValue="false"
                                  title="Responsibility"
                                  style="color: white;"
                                >
                                  <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                                    <ul>
                                      <li>Full Stack Developer skilled in Java, Angular, Node.js, and AWS services.</li>
                                      <li>Track record of delivering standardized code for products and applications, blending technical and business knowledge.</li>
                                      <li>Experienced in building complex, time-critical applications from scratch using Agile methodologies and resolving critical production bugs.</li>
                                    </ul>
                                  </p>
                                </rds-collapsible-container>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div data-v-1e303c13 class="rds-timeline-item -mt-5 flex">
                        <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 25%;"> Feb 2018 - Feb 2019 </div>
                        <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                          <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                          <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                        </div>
                        <div data-v-1e303c13 class="rds-timeline-item__content-container" style="margin-bottom: 0px !important; width: 90%;">
                          <div data-v-1e303c13 class="rds-timeline-item__title"> CONTEXiO </div>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Full Time • 1yrs 1 mos </span><br/>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Navi Mumbai, Maharastra, India </span>

                          <div class="rds-timeline pl-0" style="--e7dc6904: column; --8a08cf80: 49.25px; padding-bottom: 0px;">
                            <div data-v-1e303c13="" class="rds-timeline-item">
                              <div data-v-1e303c13="" class="rds-timeline-item__timeline-container">
                                <span data-v-1e303c13 class="rds-timeline-item__pin--white z-10"></span>
                                <div data-v-1e303c13 class="tail--dashed w-1.5 h-20 z-10"></div>
                              </div>
                              <div data-v-1e303c13="" class="rds-timeline-item__content-container" style="margin-top: 10px; margin-bottom: 0px !important;">
                                <div data-v-1e303c13="" class="rds-timeline-item__title"> Analyst<br>
                                  <span data-v-1e303c13="" class="rds-timeline-item__text"> Feb 2018 - Feb 2019 </span>
                                </div>
                                <rds-collapsible-container
                                  :modelValue="false"
                                  title="Responsibility"
                                  style="color: white;"
                                >
                                  <p data-v-1e303c13="" class="rds-timeline-item__text" style="margin-bottom: 0px !important;"> 
                                    <ul>
                                      <li>Capturing and structuring data to create product content for e-commerce organizations.</li>
                                      <li>Upon request or as specified by Supervisor, update client on project deliverables and schedules.</li>
                                      <li>Follow work allocation, schedule, and project plan.</li>
                                      <li>Prioritize project tasks and seek assistance from Supervisor as applicable.</li>
                                      <li>As part of the Tata Cliq electronics category, handle product data and manage the inventories of products.</li>
                                    </ul>
                                  </p>
                                </rds-collapsible-container>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </rds-col>
                  <rds-col cols="6" offset="0" colsAtS="12" colsAtM="12" colsAtL="6" colsAtXl="6"  class="mt-16">
                    <div>
                      <div data-v-1e303c13 class="rds-timeline-item mb-0 flex">
                        <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 25%; margin-top: 1.5rem !important;"> Feb 2023 - Feb 2025 </div>
                        <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                          <Icon class="text-sm md:text-base" name="vaadin:academy-cap"  style="font-size: 1.5rem;" />
                          <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                          <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                        </div>
                        <div data-v-1e303c13 class="rds-timeline-item__content-container"  style="width: 90%;  margin-top: 1.5rem !important;">
                          <div data-v-1e303c13 class="rds-timeline-item__title"> Scaler </div>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Master of Science - MS</span><br/>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Computer & Software Engineering </span>

                          <div class="rds-timeline pl-0" style="--e7dc6904: column; --8a08cf80: 49.25px;">
                            <rds-collapsible-container
                              :modelValue="true"
                              title="Objective"
                              style="color: white;"
                            >
                              <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                                I am currently pursuing a Master of Science in Software Engineering at Scaler. This advanced program is designed to 
                                deepen my understanding of software development principles, enhance my technical skills, and prepare me for leadership
                                  roles in the tech industry. Throughout my coursework, I am engaging with cutting-edge technologies and methodologies,
                                  including:
                                  <ul>
                                    <li>Advanced Software Development: Mastering modern practices and tools.</li>
                                    <li>System Design and Architecture: Learning to design scalable and efficient systems.</li>
                                    <li>Data Structures and Algorithms: Strengthening problem-solving skills through rigorous analysis.</li>
                                    <li>High-Level and Low-Level Design: Gaining expertise in robust system design at both high and detailed levels.</li>
                                    <li>Cloud Computing and DevOps: Understanding cloud infrastructure, deployment strategies, and CI/CD pipelines.</li>
                                  </ul>
                              </p>
                            </rds-collapsible-container>
                          </div>
                        </div>
                      </div>
                      <div data-v-1e303c13 class="rds-timeline-item mb-0 -mt-5 flex">
                        <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 25%;"> Sep 2019 - Oct 2021 </div>
                        <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                          <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                          <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                        </div>
                        <div data-v-1e303c13 class="rds-timeline-item__content-container" style="width: 90%;">
                          <div data-v-1e303c13 class="rds-timeline-item__title"> USM's Shriram Mantri Vidyanidhi Info Tech Academy <br/> CDAC Center </div>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> PG Diploma In Advanced Computing (PG-DAC) </span><br/>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Software Engineering </span>

                          <div class="rds-timeline pl-0" style="--e7dc6904: column; --8a08cf80: 49.25px;">
                            <rds-collapsible-container
                              :modelValue="false"
                              title="Objective"
                              style="color: white;"
                            >
                              <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                                PG-DAC is the most popular PG Diploma course of C-DAC. The course is targeted towards Engineering Graduates and MCA/MSc 
                                who wish to venture into the domain of advanced computing. The course aims to groom the students to enable them to work 
                                on current technology scenarios as well as prepare them to keep pace with the changing face of technology and the requirements 
                                of the growing IT industry. 
                                <ul>
                                  <li>Use technologies to access and interpret information effectively.</li>
                                  <li>Apply analytical skills to investigate unfamiliar problems using web technologies such as HTML 5.0, CSS, JavaScript, 
                                    jQuery, and AngularJS.</li>
                                  <li>Use quantitative data confidently and competently.</li>
                                  <li>Utilize communication technologies competently.</li>
                                  <li>Understand the multi-tier architecture of web-based enterprise applications, integrating Enterprise JavaBeans (EJB) 
                                    with Servlets, JSPs, and databases in J2EE applications.</li>
                                  <li>Understand .NET architecture, and develop and maintain applications within this framework.</li>
                                </ul>
                              </p>
                            </rds-collapsible-container>
                          </div>
                        </div>
                      </div>
                      <div data-v-1e303c13 class="rds-timeline-item -mt-5 flex ">
                        <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 25%;"> Jun 2013 - Jun 2017 </div>
                        <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                          <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                          <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                        </div>
                        <div data-v-1e303c13 class="rds-timeline-item__content-container" style="margin-bottom: 0px !important; width: 90%;">
                          <div data-v-1e303c13 class="rds-timeline-item__title"> University of Mumbai </div>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Bachelor of Engineering </span><br/>
                          <span data-v-1e303c13 class="rds-timeline-item__text"> Electronics Engineering </span>

                          <div class="rds-timeline pl-0" style="--e7dc6904: column; --8a08cf80: 49.25px;">
                            <rds-collapsible-container
                              :modelValue="false"
                              title="Objective"
                              style="color: white;"
                            >
                              <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                                PG-DAC is the most popular PG Diploma course of C-DAC. The course is targeted towards Engineering Graduates and MCA/MSc 
                                who wish to venture into the domain of advanced computing. The course aims to groom the students to enable them to work 
                                on current technology scenarios as well as prepare them to keep pace with the changing face of technology and the requirements 
                                of the growing IT industry. 
                                <ul>
                                  <li>Use technologies to access and interpret information effectively.</li>
                                  <li>Apply analytical skills to investigate unfamiliar problems using web technologies such as HTML 5.0, CSS, JavaScript, 
                                    jQuery, and AngularJS.</li>
                                  <li>Use quantitative data confidently and competently.</li>
                                  <li>Utilize communication technologies competently.</li>
                                  <li>Understand the multi-tier architecture of web-based enterprise applications, integrating Enterprise JavaBeans (EJB) 
                                    with Servlets, JSPs, and databases in J2EE applications.</li>
                                  <li>Understand .NET architecture, and develop and maintain applications within this framework.</li>
                                </ul>
                              </p>
                            </rds-collapsible-container>
                          </div>
                        </div>
                      </div>
                    </div>
                  </rds-col>
                </rds-row>
              </rds-grid>

            </div>
          </div>
        </div>
        <ContentDivider anchor="left" class="mt-14" />
      </AppSection>

    
      <AppSection style="padding-top: 2.5rem;">
        <LazyParagraphDecoration />
        <AppParagraph class="mr-8 mt-4" tag="h2" look="heading">
          Projects
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
        <ContentDivider anchor="right" class="mt-14 hidden lg:block" />
      </AppSection>

      <AppSection class="bg-zinc-900">
        <LazyParagraphDecoration class="mt-16" />
        <AppParagraph class="mr-8 mt-4" tag="h2" look="heading"> 
          Recent Article's
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
          <ArticlePreview v-for="article in articles" :key="article._id" :article="article" />
        </div>
        <div class="flex md:justify-end mt-8">
          <AppButton to="/articles" look="secondary" secondary-after-bg="bg-zinc-900">View all articles</AppButton>
        </div>
      </AppSection>
    </div>
  </template>



<style lang="css">
  @import '@aherrahul/design-system/dist/style.css';
  
  .badge--md {
    padding: 0px 8px !important;
  }
  .badge--red {
    background-image: linear-gradient(to right, #da4889, #ee6363);
    color: white !important;
  }
  .rds-timeline-item__pin--red {
    min-height: 1.375rem !important;
    min-width: 1.375rem !important;
    position: relative !important;
    top: 0.375rem !important;
  }
  .rds-timeline-item .tail {
    width: 0.375rem !important;
  }
  .rds-timeline-item__opposite {
    color: white !important;
    margin: 0px !important;
  }
  .rds-timeline-item__title {
    color: white !important;    
  }
  .rds-timeline-item__text {
    color: white !important;
  }
  .rds-timeline-item__content-container{
    margin: -4px 0 30px 10px !important;
  }
  .collapsible-container__item {
    color: white !important;
  }
  .collapsible-container__content {
    padding: 0px !important;
  }
</style>