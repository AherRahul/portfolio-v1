<script setup lang="ts">

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
</script>

<template>
  <div>
    <AppSection>
      <ParagraphDecoration />
      <AppParagraph look="heading" class="mt-4" tag="h1">About me</AppParagraph>
      <div class="lg:grid grid-cols-2 lg:items-end mt-16 lg:mt-0">
        <div class="lg:hidden">
          <img class="w-48 h-48 rounded-full mx-auto" width="192" height="192" src="/img/me@2x.jpg"
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

        <div class="lg:grid lg:items-end mt-10" style="margin-top: 10rem;">
          <div class="mt-16 lg:mt-0">
            <div class="prose lg:prose-lg lg:mt-8">
              <h2 class="mb-0">Experience</h2>
              <ParagraphDecoration class="mb-0" />

              <div data-v-1e303c13 class="rds-timeline-item mb-0">
                <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 20%;"> Oct 2021 - Present </div>
                <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                  <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                  <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                </div>
                <div data-v-1e303c13 class="rds-timeline-item__content-container">
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
                        <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                          <ul>
                            <li>Creating REST APIs with Spring MVC, Hibernate, and JPA while ensuring compliance with coding standards and industry best practices to deliver robust and scalable solutions.</li>
                            <li>Implementing Microservices architecture to enhance modularity and scalability of systems, improving overall application performance and maintainability.</li>
                            <li>Automating critical tasks through the implementation of job scheduling, reducing manual intervention by 90% with Quartz Job Scheduler for improved operational efficiency.</li>
                            <li>Maintaining a remarkable 75% client satisfaction rate by providing responsive support and cultivating strong working relationships, fostering trust and loyalty.</li>
                            <li>Orchestrating the seamless migration of legacy projects to Vue.js, delivering modernized user interfaces with enhanced functionality and user experience.</li>
                            <li>Enforcing robust security measures against SQL Injection and XSS vulnerabilities, safeguarding sensitive data and preserving application integrity, ensuring compliance with industry security standards.</li>
                          </ul>
                        </p>
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
                        <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                          <ul>
                            <li>Improved product stability and scalability through autoscaling and worker optimization.</li>
                            <li>Enhanced development efficiency with a generic pipeline for Java applications.</li>
                            <li>Increased system observability and proactive issue identification with New Relic.</li>
                            <li>Successfully migrated critical infrastructure and data with zero downtime.</li>
                            <li>Effectively led team through major production incidents and proposed innovative solutions.</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-v-1e303c13 class="rds-timeline-item -mt-5  mb-0">
                <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 31%;"> Sep 2019 - Oct 2021 </div>
                <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                  <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                  <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                </div>
                <div data-v-1e303c13 class="rds-timeline-item__content-container">
                  <div data-v-1e303c13 class="rds-timeline-item__title"> BTS</div>
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
                        <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                          <ul>
                            <li>As an associate developer, I have honed my skills in a variety of essential technologies and methodologies. I possess a deep understanding of SQL, allowing me to design and develop efficient databases and data-driven applications.</li>
                            <li>In addition to my database skills, I am also adept at utilizing Microsoft Excel to drive insights and optimize workflows. My expertise in front-end technologies such as Angular, HTML5, and Cascading Style Sheets (CSS) enables me to build user-friendly, responsive interfaces that deliver an outstanding user experience.</li>
                            <li>Furthermore, I have experience in client requirements gathering, a critical skill in the development process that allows me to understand and meet client needs effectively.</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                    <div data-v-1e303c13="" class="rds-timeline-item -mt-5">
                      <div data-v-1e303c13="" class="rds-timeline-item__timeline-container">
                        <span data-v-1e303c13 class="rds-timeline-item__pin--white z-10"></span>
                        <div data-v-1e303c13 class="tail--dashed w-1.5 h-20 z-10"></div>
                      </div>
                      <div data-v-1e303c13="" class="rds-timeline-item__content-container">
                        <div data-v-1e303c13="" class="rds-timeline-item__title"> Associate Software Engineer<br>
                          <span data-v-1e303c13="" class="rds-timeline-item__text"> Sept 2020 - Sept 2020 </span>
                        </div>
                        <p data-v-1e303c13="" class="rds-timeline-item__text"> 
                          <ul>
                            <li>Full Stack Developer, proficient in Java, Angular, Node.js, and various AWS services.</li>
                            <li>Proven track record of delivering optimal, standardized code for various products and applications, combining technical and business knowledge.</li>
                            <li>Successfully delivered complex and time-critical applications from scratch while following Agile methodologies, and resolved critical production bugs to ensure seamless product functionality as well.</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-v-1e303c13 class="rds-timeline-item -mt-5 ">
                <div data-v-1e303c13 class="rds-timeline-item__opposite" style="width: 15%;"> Feb 2018 - Feb 2019 </div>
                <div data-v-1e303c13 class="rds-timeline-item__timeline-container">
                  <span data-v-1e303c13 class="rds-timeline-item__pin--red bg-gradient-to-b from-red-600 to-pink-700 z-10" style="min-height: 1.375rem !important; min-width: 1.375rem !important; position: relative !important; top: 0.375rem !important;"></span>
                  <div data-v-1e303c13 class="tail w-1.5 h-20 bg-gradient-to-b from-red-600 to-pink-700 z-10" style="width: 5px !important;"></div>
                </div>
                <div data-v-1e303c13 class="rds-timeline-item__content-container" style="margin-bottom: 0px !important;">
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
                        <p data-v-1e303c13="" class="rds-timeline-item__text" style="margin-bottom: 0px !important;"> 
                          <ul>
                            <li>Capturing and structuring data to create product content for e-commerce organizations.</li>
                            <li>Upon request or as specified by Supervisor, update client on project deliverables and schedules.</li>
                            <li>Follow work allocation, schedule, and project plan.</li>
                            <li>Prioritize project tasks and seek assistance from Supervisor as applicable.</li>
                            <li>As part of the Tata Cliq electronics category, handle product data and manage the inventories of products.</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h2>Open Source</h2>

              <p>
                I'm a big fan of open source software and I try to contribute to it as much as my spare time allows.
                Since my <AppLink to="https://firstcommit.is/mannil">initial commit back in 2012</AppLink>
                I have been actively contributing to open source projects.
              </p>
              <p>
                Eventually, I joined the <AppLink to="https://github.com/nuxt">Nuxt.js</AppLink> team in 2018, been a
                steady
                contributor and maintainer since then.
                I'm also quite active in <AppLink to="https://discord.gg/nuxt">their Discord</AppLink>, so feel free to
                write
                me a message there too!
                In 2022, I also joined the <AppLink to="https://github.com/unjs">UnJS</AppLink> organization as a member.
              </p>
              <p>
                In the past, I also contributed to other open source projects, including
                <AppLink to="https://dev.bukkit.org/">Bukkit</AppLink>,
                <AppLink to="https://github.com/tailwindlabs/tailwindcss">TailwindCSS</AppLink>,
                <AppLink to="https://github.com/vuejs/vue">Vue.js</AppLink>,
                <AppLink to="https://github.com/laravel/framework/">Laravel</AppLink> and more.
                Check out my <AppLink class="inline-block" :to="SOCIALS.github">
                  <Icon name="mdi:github" class="mb-1 -mr-0.5" /> GitHub profile
                </AppLink> for more information and consider <AppLink to="/sponsors">supporting me</AppLink>.
              </p>
            </div>
          </div>
        </div>
        
    </AppSection>
  </div>
</template>



<style lang="css">
  @import '@aherrahul/design-system/dist/style.css';

  .mb-0 {
    margin-bottom: 0px;
  }
  .mb-1 {
    margin-bottom: 10px !important;
  }
  .badge--md {
    padding: 0px 8px !important;
  }
  .badge--red {
    background-image: linear-gradient(to right, #da4889, #ee6363);
    color: white !important;
  }
  .my-0 {
    margin-bottom: 0px !important;
    margin-bottom: 0px !important;
  }
  .mt-1 {
    margin-top: 10px !important;
  } 
  .mt-2 {
    margin-top: 20px !important;
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
  .rds-timeline-item {
    /* margin-left: 2rem !important; */
  }
  .rds-timeline-item__opposite {
    color: white !important;
  }
  .rds-timeline-item__title {
    color: white !important;    
  }
  .rds-timeline-item__text {
    color: white !important;
  }
  .rds-timeline-item__content-container{
    margin: -4px 0 30px 24px !important;
  }
  .pl-0 {
    padding-left: 0px !important;
  }
</style>