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

const { data: courses } = useAsyncData('latest-courses', () =>
  queryContent('/courses/')
    .sort({ onStartPage: 1 })
    .without(['body', 'excerpt'])
    .limit(4)
    .find()
)

// Certificates & Awards data
type Certificate = {
  title: string
  issuer: string
  date: string
  credentialId?: string
  description: string
  link?: string
  skills?: string[]
}

type Award = {
  title: string
  by: string
  date: string
  description: string
  link?: string
}

const certificates: Certificate[] = [
  {
    title: 'Master of Science – Computer & Software Engineering',
    issuer: 'Scaler School of Technology',
    date: '2023 – Ongoing',
    description: 'Graduate program focused on system design, advanced algorithms, distributed systems, and leadership for senior engineering roles.',
    skills: ['System Design', 'Distributed Systems', 'Algorithms', 'Cloud & DevOps']
  },
  {
    title: 'PG-DAC – Post Graduate Diploma in Advanced Computing',
    issuer: 'CDAC Mumbai',
    date: '2019 – 2020',
    description: 'Intensive certification covering enterprise Java, web technologies, databases, and multi-tier architectures for scalable applications.',
    skills: ['Java', 'J2EE', 'Web Technologies', 'Databases']
  }
]

const awards: Award[] = [
  {
    title: 'Promotion – Senior Software Engineer',
    by: 'Morningstar',
    date: '2023',
    description: 'Recognized for technical leadership, architectural contributions to microservices, and impactful automation reducing manual effort by 90%.'
  },
  {
    title: 'Client Delight Recognition',
    by: 'BTS',
    date: '2021',
    description: 'Appreciated for consistently delivering high-quality features on time and maintaining clear communication with stakeholders.'
  }
]

// Unified showcase items (awards + certificates) with images for carousel
type ShowcaseItem = {
  kind: 'award' | 'certificate'
  title: string
  org: string
  date: string
  description: string
  images?: string[]
  link?: string
  skills?: string[]
}

const showcaseItems = ref<ShowcaseItem[]>([
  {
    kind: 'award',
    title: 'Promotion – Senior Software Engineer',
    org: 'Morningstar',
    date: '2023',
    description: 'Recognized for technical leadership, architectural contributions to microservices, and impactful automation reducing manual effort by 90%.',
    images: ['/img/awards/promotion-1.jpg'],
  },
  {
    kind: 'certificate',
    title: 'Master of Science – Computer & Software Engineering',
    org: 'Scaler School of Technology',
    date: '2023 – Ongoing',
    description: 'Graduate program focused on system design, advanced algorithms, distributed systems, and leadership for senior engineering roles.',
    images: ['/img/certificates/ms-scaler-1.jpg', '/img/certificates/ms-scaler-2.jpg'],
    skills: ['System Design', 'Distributed Systems', 'Algorithms']
  },
  {
    kind: 'certificate',
    title: 'PG-DAC – Post Graduate Diploma in Advanced Computing',
    org: 'CDAC Mumbai',
    date: '2019 – 2020',
    description: 'Intensive certification covering enterprise Java, web technologies, databases, and multi-tier architectures for scalable applications.',
    images: ['/img/certificates/pg-dac-1.jpg'],
    skills: ['Java', 'J2EE', 'Databases']
  },
  {
    kind: 'award',
    title: 'Client Delight Recognition',
    org: 'BTS',
    date: '2021',
    description: 'Consistently delivered high-quality features on time and maintained clear communication with stakeholders.',
    images: ['/img/awards/client-delight-1.jpg']
  }
])

// Carousel state and controls
const currentShowcaseIndex = ref(0)
let showcaseTimer: number | null = null

const totalShowcase = computed(() => showcaseItems.value.length)

const nextShowcase = () => {
  currentShowcaseIndex.value = (currentShowcaseIndex.value + 1) % totalShowcase.value
}

const prevShowcase = () => {
  currentShowcaseIndex.value = (currentShowcaseIndex.value - 1 + totalShowcase.value) % totalShowcase.value
}

const goToShowcase = (idx: number) => {
  if (idx >= 0 && idx < totalShowcase.value) currentShowcaseIndex.value = idx
}

const startAutoScroll = () => {
  stopAutoScroll()
  showcaseTimer = window.setInterval(() => {
    nextShowcase()
  }, 5000)
}

const stopAutoScroll = () => {
  if (showcaseTimer) {
    clearInterval(showcaseTimer)
    showcaseTimer = null
  }
}

// Image helpers
const PLACEHOLDER_IMAGE = '/img/placeholder-cert.jpg'
const resolveImages = (item: ShowcaseItem): string[] => {
  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : []
  return images.length ? images : [PLACEHOLDER_IMAGE]
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img && !img.src.includes(PLACEHOLDER_IMAGE)) {
    img.src = PLACEHOLDER_IMAGE
  }
}

// Modal gallery state
const isGalleryOpen = ref(false)
const galleryImages = ref<string[]>([])
const galleryIndex = ref(0)

const openGallery = (item: ShowcaseItem, startIndex = 0) => {
  galleryImages.value = resolveImages(item)
  galleryIndex.value = Math.min(Math.max(startIndex, 0), galleryImages.value.length - 1)
  isGalleryOpen.value = true
  stopAutoScroll()
}

const closeGallery = () => {
  isGalleryOpen.value = false
  startAutoScroll()
}

const nextGallery = () => {
  if (!galleryImages.value.length) return
  galleryIndex.value = (galleryIndex.value + 1) % galleryImages.value.length
}

const prevGallery = () => {
  if (!galleryImages.value.length) return
  galleryIndex.value = (galleryIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isGalleryOpen.value) {
    closeGallery()
  }
}

// Animation and interaction states
const isVisible = ref(false)
const heroRef = ref(null)
const statsRef = ref(null)

// Stats for the animated counters
const stats = [
  { label: 'Years of Experience', value: 7, suffix: '+' },
  { label: 'Projects Completed', value: 50, suffix: '+' },
  { label: 'Client Satisfaction', value: 75, suffix: '%' },
  { label: 'Technologies Mastered', value: 20, suffix: '+' }
]

// Core technical skills (focused & compact)
const skillCategories = [
  {
    title: 'Backend & APIs',
    icon: 'heroicons:server',
    skills: [
      { name: 'Java & Spring Boot', level: 95, years: '7+' },
      { name: 'Node.js & Express', level: 90, years: '6+' },
      { name: 'REST API Design', level: 95, years: '7+' }
    ]
  },
  {
    title: 'Frontend & Platforms', 
    icon: 'heroicons:computer-desktop',
    skills: [
      { name: 'Vue.js (2 & 3)', level: 92, years: '6+' },
      { name: 'React.js', level: 85, years: '5+' },
      { name: 'TypeScript', level: 93, years: '7+' }
    ]
  }
]

// Helper function for category icons
const getCategoryIcon = (title: string) => {
  const iconMap: Record<string, string> = {
    'Backend Development': 'heroicons:server',
    'Frontend Development': 'heroicons:computer-desktop',
    'DevOps & Cloud': 'heroicons:cloud',
    'Databases': 'heroicons:circle-stack'
  }
  return iconMap[title] || 'heroicons:code-bracket'
}

// Timeline data for education and experience
const timelineData = [
  {
    id: 'zema',
    type: 'work',
    company: 'ZEMA Global Data Corporation',
    period: 'Oct 2024 - Present',
    duration: '1+ years',
    location: 'Mumbai, Maharashtra, India',
    positions: [
      {
        title: 'Senior Software Engineer',
        period: 'Oct 2024 - Present',
        responsibilities: [
          'Led end-to-end development as sole full-stack developer delivering production-ready apps on schedule',
          'Collaborated cross-functionally to ensure smooth execution and coding excellence',
          'Performed code reviews to improve maintainability and accelerate delivery timelines',
          'Conducted interviews for entry to mid-level candidates (0–4 years)',
          'Partnered with founders to align technical decisions with business goals',
          'Specialized in requirement analysis and solution design for scalable admin portals and enterprise apps'
        ]
      }
    ]
  },
  {
    id: 'morningstar',
    type: 'work',
    company: 'Morningstar',
    period: 'Oct 2021 - Oct 2024',
    duration: '3 years',
    location: 'Navi Mumbai, India',
    positions: [
      {
        title: 'Senior Software Engineer',
        period: 'Jan 2023 - Oct 2024',
        responsibilities: [
          'Creating REST APIs with Spring MVC, Hibernate, and JPA, ensuring compliance with coding standards and best practices',
          'Implementing Microservices architecture to enhance modularity, scalability, and performance',
          'Automating tasks with Quartz Job Scheduler, reducing manual intervention by 90% for improved efficiency',
          'Maintaining a 75% client satisfaction rate through responsive support and strong relationships',
          'Orchestrating legacy project migrations to Vue.js for modernized user interfaces and improved functionality',
          'Enforcing security measures against SQL Injection and XSS vulnerabilities to protect data and application integrity'
        ]
      },
      {
        title: 'Software Engineer',
        period: 'Oct 2021 - Dec 2022',
        responsibilities: [
          'Improved product stability and scalability through autoscaling and worker optimization',
          'Enhanced development efficiency with a generic pipeline for Java applications',
          'Increased system observability and proactive issue identification with New Relic',
          'Successfully migrated critical infrastructure and data with zero downtime',
          'Effectively led team through major production incidents and proposed innovative solutions'
        ]
      }
    ]
  },
  {
    id: 'bts',
    type: 'work',
    company: 'BTS',
    period: 'Sep 2019 - Oct 2021',
    duration: '2+ years',
    location: 'Mumbai, India',
    positions: [
      {
        title: 'Software Developer',
        period: 'Sep 2020 - Oct 2021',
        responsibilities: [
          'Full-stack development of end-to-end components for Microsoft Advisor Workstation',
          'Built features for a financial research and reporting platform used by ~180,000 advisors',
          'Delivered performant, maintainable code within Agile sprints across frontend and backend',
          'Collaborated with stakeholders to refine requirements and ensure timely delivery'
        ]
      },
      {
        title: 'Associate Software Developer',
        period: 'Sep 2019 - Sep 2020',
        responsibilities: [
          'Full Stack Developer skilled in Java, Angular, Node.js, and AWS services',
          'Track record of delivering standardized code for products and applications, blending technical and business knowledge',
          'Experienced in building complex, time-critical applications from scratch using Agile methodologies and resolving critical production bugs'
        ]
      }
    ]
  },
  {
    id: 'contexio',
    type: 'work',
    company: 'CONTEXiO',
    period: 'Feb 2018 - Feb 2019',
    duration: '1 year',
    location: 'Navi Mumbai, India',
    positions: [
      {
        title: 'Analyst',
        period: 'Feb 2018 - Feb 2019',
        responsibilities: [
          'Capturing and structuring data to create product content for e-commerce organizations',
          'Upon request or as specified by Supervisor, update client on project deliverables and schedules',
          'Follow work allocation, schedule, and project plan',
          'Prioritize project tasks and seek assistance from Supervisor as applicable',
          'As part of the Tata Cliq electronics category, handle product data and manage the inventories of products'
        ]
      }
    ]
  },
  {
    id: 'scaler',
    type: 'education',
    company: 'Scaler School of Technology',
    period: 'Feb 2023 - Feb 2025',
    duration: '2 years',
    location: 'Online',
    degree: 'Master of Science - MS',
    field: 'Computer & Software Engineering',
    description: 'Advanced program designed to deepen understanding of software development principles, enhance technical skills, and prepare for leadership roles in the tech industry.',
    highlights: [
      'Advanced Software Development: Mastering modern practices and tools',
      'System Design and Architecture: Learning to design scalable and efficient systems',
      'Data Structures and Algorithms: Strengthening problem-solving skills through rigorous analysis',
      'High-Level and Low-Level Design: Gaining expertise in robust system design at both high and detailed levels',
      'Cloud Computing and DevOps: Understanding cloud infrastructure, deployment strategies, and CI/CD pipelines'
    ]
  },
  {
    id: 'cdac',
    type: 'education',
    company: 'CDAC Mumbai',
    period: 'Feb 2019 - Aug 2019',
    duration: '6 months',
    location: 'Mumbai, India',
    degree: 'PG Diploma In Advanced Computing (PG-DAC)',
    field: 'Software Engineering',
    description: 'Comprehensive program for Engineering Graduates venturing into advanced computing domain.',
    highlights: [
      'Web technologies: HTML 5.0, CSS, JavaScript, jQuery, and AngularJS',
      'Multi-tier architecture of web-based enterprise applications',
      'Enterprise JavaBeans (EJB) with Servlets, JSPs, and databases in J2EE applications',
      '.NET architecture and application development',
      'Modern software development practices and methodologies'
    ]
  },
  {
    id: 'mumbai-uni',
    type: 'education',
    company: 'University of Mumbai',
    period: 'Jun 2013 - Jun 2017',
    duration: '4 years',
    location: 'Mumbai, India',
    degree: 'Bachelor of Engineering',
    field: 'Electronics Engineering',
    description: 'Comprehensive engineering education with focus on electronics, communication systems, and foundational computer science concepts.'
  }
]

// Combined timeline events for vertical timeline (Latest to Oldest)
const timelineEvents = [
  {
    id: 'zema-global',
    year: '2024',
    date: 'October 2024',
    title: 'Senior Software Engineer',
    subtitle: 'Full-Stack • Architecture & Delivery',
    org: 'ZEMA Global Data Corporation',
    period: 'Oct 2024 - Present',
    location: 'Mumbai, Maharashtra, India',
    type: 'work',
    category: 'Full-Stack • Architecture & Delivery',
    description: 'Leading end-to-end development as sole full-stack developer, delivering production-ready applications while partnering directly with founders to align technical strategy with business goals.',
    details: [
      'Leading end-to-end development of multiple projects as the sole full-stack developer, delivering high-quality, production-ready applications on schedule',
      'Collaborating with cross-functional teams to ensure smooth execution, maintain coding excellence, and achieve consistent project success',
      'Serving as code reviewer, upholding best practices, improving code maintainability, and accelerating delivery timelines through constructive feedback',
      'Conducting technical interviews for candidates from entry-level to mid-level (up to 4 years of experience), helping build a strong and capable engineering team',
      'Partnering directly with company founders to align technical decisions with business goals, driving efficiency and innovation across multiple projects',
      'Excelling in requirement analysis and solution design for complex admin portals and enterprise applications, delivering scalable and intuitive user experiences'
    ],
    skills: ['Vue.js', 'React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'AWS', 'Microservices', 'REST APIs', 'Full-Stack Architecture'],
    icon: 'heroicons:rocket-launch',
    color: 'primary'
  },
  {
    id: 'senior-engineer',
    year: '2023',
    date: 'January 2023',
    title: 'Senior Software Engineer',
    subtitle: 'Mentor',
    org: 'Morningstar',
    period: 'Jan 2023 - Oct 2024',
    location: 'Mumbai, Maharashtra, India',
    type: 'work',
    category: 'Senior Developer • Mentor',
    description: 'Promoted to senior role after demonstrating exceptional technical leadership. Led microservices architecture, automation initiatives reducing manual work by 90%, and maintained 75% client satisfaction through responsive support and innovation.',
    details: [
      'Creating REST APIs with Spring MVC, Hibernate, and JPA while ensuring compliance with coding standards and industry best practices to deliver robust and scalable solutions',
      'Implementing Microservices architecture to enhance modularity and scalability of systems, improving overall application performance and maintainability',
      'Automating critical tasks through the implementation of job scheduling, reducing manual intervention by 90% with Quartz Job Scheduler for improved operational efficiency',
      'Maintaining a remarkable 75% client satisfaction rate by providing responsive support and cultivating strong working relationships, fostering trust and loyalty',
      'Orchestrating the seamless migration of legacy projects to Vue.js, delivering modernized user interfaces with enhanced functionality and user experience',
      'Enforcing robust security measures against SQL Injection and XSS vulnerabilities, safeguarding sensitive data and preserving application integrity, ensuring compliance with industry security standards',
      'Mentoring junior developers and conducting thorough code reviews to maintain high-quality standards across the team'
    ],
    skills: ['Spring Boot', 'Microservices', 'REST APIs', 'Vue.js', 'Hibernate', 'JPA', 'Quartz Scheduler', 'Security', 'Technical Leadership', 'Mentoring'],
    icon: 'heroicons:trophy',
    color: 'primary'
  },
  {
    id: 'ms-program',
    year: '2023',
    date: 'February 2023',
    title: 'Master of Science (MS)',
    subtitle: 'Computer & Software Engineering',
    org: 'Scaler School of Technology',
    period: 'Feb 2023 - Feb 2025',
    location: 'Online',
    type: 'education',
    category: 'MS in Computer & Software Engineering',
    description: 'Pursuing Master of Science in Software Engineering at Scaler to deepen understanding of software development principles, enhance technical skills, and prepare for leadership roles in the tech industry.',
    details: [
      'Advanced Software Development: Mastering modern software development practices and tools',
      'System Design and Architecture: Learning to design scalable and efficient software systems',
      'Data Structures and Algorithms: Strengthening problem-solving skills through rigorous analysis and application',
      'High-Level Design and Low-Level Design: Gaining expertise in designing robust, scalable systems at both high and detailed levels',
      'Cloud Computing and DevOps: Understanding cloud infrastructure, deployment strategies, and continuous integration/continuous deployment (CI/CD) pipelines',
      'Leadership development and preparation for senior technical roles in the industry'
    ],
    skills: ['System Design', 'Advanced Algorithms', 'HLD & LLD', 'Cloud Computing', 'DevOps', 'CI/CD', 'Distributed Systems', 'Technical Leadership'],
    icon: 'heroicons:academic-cap',
    color: 'secondary'
  },
  {
    id: 'promotion-milestone',
    year: '2023',
    date: 'January 2023',
    title: 'Career Milestone: Promotion',
    subtitle: 'Software Engineer → Senior Software Engineer',
    org: 'Morningstar',
    period: 'Jan 2023',
    location: 'Mumbai, Maharashtra, India',
    type: 'work',
    category: 'Career Advancement • Morningstar',
    description: 'Promoted to Senior Software Engineer after 15 months of exceptional performance, recognized for technical leadership, architectural contributions to microservices, and impactful automation reducing manual effort by 90%.',
    details: [
      'Recognized for outstanding performance in microservices architecture and automation solutions that transformed operational efficiency',
      'Successfully led critical projects implementing Quartz Job Scheduler that reduced manual intervention by 90%',
      'Demonstrated strong mentoring capabilities and code review excellence, elevating team standards',
      'Consistently delivered high-quality solutions achieving 75% client satisfaction rate through responsive support',
      'Showed exceptional initiative in legacy system modernization, security implementation, and Vue.js migration projects',
      'Earned promotion within 15 months of joining, showcasing rapid growth and impact'
    ],
    skills: ['Performance Excellence', 'Project Leadership', 'Technical Innovation', 'Client Satisfaction', 'Team Collaboration', 'Mentoring'],
    icon: 'heroicons:arrow-trending-up',
    color: 'primary'
  },
  {
    id: 'morningstar',
    year: '2021',
    date: 'October 2021',
    title: 'Software Engineer',
    subtitle: 'API Development & Microservices',
    org: 'Morningstar',
    period: 'Oct 2021 - Dec 2022',
    location: 'Mumbai, Maharashtra, India',
    type: 'work',
    category: 'Software Engineer • API Development & Microservices',
    description: 'Joined leading financial services company Morningstar, focusing on building scalable REST APIs, implementing microservices architecture, and driving system optimization initiatives.',
    details: [
      'Improved product stability and scalability through autoscaling and worker optimization techniques',
      'Enhanced development efficiency with a generic CI/CD pipeline for Java applications, streamlining deployment processes',
      'Increased system observability and proactive issue identification by integrating New Relic monitoring solutions',
      'Successfully migrated critical infrastructure and data with zero downtime, ensuring business continuity',
      'Effectively led team through major production incidents, proposed innovative solutions, and implemented preventive measures',
      'Designed and developed REST APIs using Spring MVC, Hibernate, and JPA following industry best practices'
    ],
    skills: ['Spring Boot', 'Java', 'Microservices', 'REST APIs', 'Hibernate', 'JPA', 'New Relic', 'CI/CD', 'Autoscaling', 'System Design'],
    icon: 'heroicons:building-office',
    color: 'primary'
  },
  {
    id: 'bts-software-developer',
    year: '2020',
    date: 'September 2020',
    title: 'Career Milestone: Promotion - Software Developer',
    subtitle: 'Full Stack Developer • Enterprise Applications',
    org: 'BTS',
    period: 'Sep 2020 - Oct 2021',
    location: 'Mumbai, India',
    type: 'work',
    category: 'Full Stack Developer • Enterprise Applications',
    description: 'Promoted to Software Developer, working as full-stack developer to develop end-to-end components for Microsoft Advisor Workstation—a financial research, management, and reporting application serving approximately 180,000 advisors.',
    details: [
      'Working as full-stack developer to develop end-to-end components for Microsoft Advisor Workstation, a financial research, management, and reporting application',
      'Contributing to a large-scale platform serving approximately 180,000 financial advisors with high reliability and performance',
      'Developed complex, time-critical applications from scratch using Agile methodologies, ensuring timely delivery',
      'Resolved critical production bugs to ensure seamless product functionality and minimize downtime',
      'Collaborated with product managers and stakeholders to refine requirements and ship features on schedule',
      'Delivered optimal, standardized code combining technical expertise with business knowledge'
    ],
    skills: ['Java', 'Angular', 'Node.js', 'AWS', 'Agile Development', 'Full Stack Development', 'SQL', 'HTML5', 'CSS'],
    icon: 'heroicons:computer-desktop',
    color: 'primary'
  },
  {
    id: 'bts-associate',
    year: '2019',
    date: 'September 2019',
    title: 'Associate Software Developer',
    subtitle: 'Entry Level • Full Stack Development',
    org: 'BTS',
    period: 'Sep 2019 - Sep 2020',
    location: 'Mumbai, India',
    type: 'work',
    category: 'Associate Software Developer • Full Stack',
    description: 'Placed directly from CDAC as Associate Software Developer at BTS. Started professional software development journey working with Angular, Node.js, Java, and AWS services to build scalable enterprise applications.',
    details: [
      'Full Stack Developer proficient in Angular, Node.js, Java, and various AWS Services',
      'Proven track record of delivering optimal, standardized code for various products and applications, combining technical and business knowledge',
      'Successfully delivered complex and time-critical applications from scratch while following Agile methodologies',
      'Resolved critical production bugs to ensure seamless product functionality',
      'Honed skills in essential technologies and methodologies as an associate developer',
      'Gained deep understanding of SQL for designing efficient databases and data-driven applications',
      'Developed expertise in front-end technologies (Angular, HTML5, CSS) for building user-friendly, responsive interfaces',
      'Experienced in client requirements gathering to meet client needs effectively'
    ],
    skills: ['Java', 'Angular', 'Node.js', 'AWS', 'SQL', 'HTML5', 'CSS', 'Agile', 'REST APIs', 'Full Stack Development'],
    icon: 'heroicons:code-bracket-square',
    color: 'primary'
  },
  {
    id: 'pg-dac',
    year: '2019',
    date: 'February 2019',
    title: 'PG Diploma in Advanced Computing',
    subtitle: 'PG-DAC • Software Engineering',
    org: 'CDAC Mumbai (Vidyanidhi InfoTech)',
    period: 'Feb 2019 - Aug 2019',
    location: 'Mumbai, India',
    type: 'education',
    category: 'PG-DAC • Software Engineering',
    description: 'Completed PG-DAC professional diploma course for full-stack development under ACTS flagship programme. Intensive 6-month program covering modern software development technologies and enterprise application architecture. Achieved Grade A+.',
    details: [
      'PG-DAC is a professional PG Diploma course for Full-stack development under the flagship programme of ACTS',
      'Intensive program covering Data Structures, Java, JavaScript, PHP, HTML, CSS, C++, C#, .NET and many more technologies',
      'Learned multi-tier architecture for web-based enterprise applications with J2EE',
      'Gained hands-on experience with databases, servlets, JSPs, and Enterprise JavaBeans (EJB)',
      'Comprehensive training in web technologies: HTML 5.0, CSS, JavaScript, jQuery, and AngularJS',
      'Developed practical skills in .NET architecture and modern software development methodologies',
      'Completed multiple projects demonstrating full-stack development capabilities',
      'Successfully placed at BTS as Associate Software Developer upon course completion with Grade A+'
    ],
    skills: ['Data Structures', 'Java', 'JavaScript', 'Angular', 'C++', 'C#', '.NET', 'Spring Boot', 'MySQL', 'Oracle Database', 'HTML5', 'CSS', 'PHP'],
    icon: 'heroicons:academic-cap',
    color: 'secondary'
  },
  {
    id: 'first-job',
    year: '2018',
    date: 'February 2018',
    title: 'Research Analyst',
    subtitle: 'Data Management Specialist',
    org: 'CONTEXiO',
    period: 'Feb 2018 - Feb 2019',
    location: 'Mumbai Area, India',
    type: 'work',
    category: 'Research Analyst • Data Management',
    description: 'Started professional career as Research Analyst at CONTEXiO, managing data operations for leading e-commerce platforms. Handled product content creation, data structuring, and inventory management for Tatacliq electronics category.',
    details: [
      'Capturing and structuring of data to create product content for e-commerce organizations',
      'Upon request or as specified by Supervisor, update client on project deliverables and schedules',
      'Follow work allocation, schedule and project plan to ensure timely delivery',
      'Prioritize project tasks and seek assistance from Supervisor as applicable',
      'As a part of Tatacliq electronics category, handled product data and managed the inventories of products',
      'Collaborated with cross-functional teams to ensure data accuracy and consistency',
      'Developed expertise in data analysis, workflow optimization, and client communication',
      'Gained valuable experience in project management and meeting client requirements under tight deadlines'
    ],
    skills: ['Data Analysis', 'Excel', 'Product Data Management', 'Inventory Management', 'Project Coordination', 'Client Communication', 'Process Optimization'],
    icon: 'heroicons:chart-bar',
    color: 'primary'
  },
  {
    id: 'graduation',
    year: '2017',
    date: 'June 2017',
    title: 'Bachelor of Engineering (BE)',
    subtitle: 'Electrical and Electronics Engineering',
    org: 'University of Mumbai',
    period: 'Jun 2013 - Jun 2017',
    location: 'Mumbai, India',
    type: 'education',
    category: 'Bachelor of Engineering • Electrical & Electronics',
    description: 'Completed Bachelor of Engineering in Electrical and Electronics Engineering from University of Mumbai. Built strong foundation in technical problem-solving, engineering principles, and analytical thinking.',
    details: [
      'Comprehensive engineering education with focus on Electrical and Electronics Engineering',
      'Gained knowledge in electronics, communication systems, circuit design, and foundational computer science concepts',
      'Developed strong analytical thinking and problem-solving skills through complex engineering projects',
      'Built solid foundation in mathematics, physics, and core engineering principles',
      'Participated in various technical workshops and seminars to enhance practical knowledge',
      'Completed 4-year intensive program covering theoretical and practical aspects of electrical and electronics systems',
      'Graduated with engineering degree, laying the groundwork for transition into software development'
    ],
    skills: ['Electronics Design', 'Circuit Analysis', 'Signal Processing', 'Mathematical Modeling', 'Technical Documentation', 'Problem Solving'],
    icon: 'heroicons:academic-cap',
    color: 'secondary'
  }
]

// Interactive state for vertical timeline
const selectedEvent = ref<any>(null)
const hoveredEvent = ref<any>(null)
// While a tooltip is selected, ignore hovers on other events
const activeEventId = computed(() => selectedEvent.value?.id ?? hoveredEvent.value?.id ?? null)

onMounted(() => {
  isVisible.value = true
  
  // Intersection Observer for animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp')
          
          // Animate counters
          if (entry.target.classList.contains('counter')) {
            animateCounter(entry.target as HTMLElement)
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  // Observe elements for scroll animations
  const elements = document.querySelectorAll('.scroll-animate')
  elements.forEach((el) => observer.observe(el))
  // start carousel auto-scroll after mount
  startAutoScroll()
  // Close gallery on ESC
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  stopAutoScroll()
  window.removeEventListener('keydown', onKeydown)
})

// Counter animation function
const animateCounter = (element: HTMLElement) => {
  const target = parseInt(element.dataset.target || '0')
  const suffix = element.textContent?.replace(/[0-9]/g, '') || ''
  let current = 0
  const increment = target / 50
  
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + suffix
  }, 30)
}
</script>

<template>
  <div>
    <AppSection>
      <ParagraphDecoration />
      <AppParagraph look="heading" class="mt-4" tag="h1">About me</AppParagraph>
      <div class="lg:grid grid-cols-2 lg:items-end mt-16 lg:mt-0">
        <div class="lg:hidden col-span-12 scroll-animate opacity-0 mb-24">
          <div class="relative w-48 h-48 mx-auto">
            <img 
              class="w-full h-full rounded-full object-cover border-4 border-gradient-to-r from-red-600 to-pink-700 shadow-2xl" 
              width="192" 
              height="192" 
              src="/img/me@2x.jpg"
              alt="Photo of Rahul Aher"
            />
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/20 to-pink-700/20 animate-pulse"></div>
          </div>
        </div>
        <div class="-mt-16 lg:mt-0">
          <div class="prose lg:prose-lg lg:mt-8">
            <!-- Animated Title -->
            <div class="space-y-4">
              <div class="animated-text">
                <h1 class="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-red-400 bg-clip-text text-transparent">
                  Hey! I'm 
                  <span class="text-gradient-animation bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text">
                    Rahul Aher
                  </span>
                </h1>
              </div>
              
              <div class="flex items-center space-x-3 text-lg text-gray-300">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Available for new opportunities</span>
              </div>
            </div>

            <!-- Enhanced Description -->
            <div class="prose lg:prose-lg lg:mt-8 max-w-none">
              <div class="space-y-6 text-gray-300 leading-relaxed">
                <p class="text-xl text-gray-200 font-medium">
                  Results-driven <span class="text-red-400 font-semibold">Senior Software Engineer</span> with an unwavering focus on optimization and innovation.
                </p>
                
                <p class="text-lg">
                  I bring <span class="text-red-400 font-semibold">7+ years</span> of experience in software engineering, specializing in product development within the tech industry. Currently excelling at <span class="text-red-400 font-semibold">ZEMA Global</span>, where I architect scalable solutions and drive technological innovation.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <div class="space-y-4">
                    <h3 class="text-red-400 font-semibold text-lg flex items-center">
                      <Icon name="heroicons:code-bracket" class="mr-2" />
                      Technical Excellence
                    </h3>
                    <ul class="space-y-2 text-gray-300">
                      <li class="flex items-start">
                        <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Expert in Java, Spring Boot, and microservices architecture
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Proficient in Vue.js, Node.js, and modern frontend technologies
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Experienced with AWS, Docker, and CI/CD pipelines
                      </li>
                    </ul>
                  </div>

                  <div class="space-y-4">
                    <h3 class="text-red-400 font-semibold text-lg flex items-center">
                      <Icon name="heroicons:trophy" class="mr-2" />
                      Key Achievements
                    </h3>
                    <ul class="space-y-2 text-gray-300">
                      <li class="flex items-start">
                        <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Reduced manual intervention by 90% through automation
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Achieved 75% client satisfaction rate
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        Led successful legacy system migrations
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Animated Stats -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 my-12 p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
                  <div 
                    v-for="(stat, index) in stats" 
                    :key="index"
                    class=" scroll-animate opacity-0"
                    :style="{ animationDelay: `${index * 100}ms` }"
                  >
                    <div class="text-2xl lg:text-3xl font-bold text-red-400 counter" :data-target="stat.value">
                      {{stat.value}}{{ stat.suffix }}
                    </div>
                    <div class="text-sm text-gray-400 mt-1">{{ stat.label }}</div>
                  </div>
                </div>

                <p class="text-lg text-gray-200 font-medium">
                  With a strong commitment to excellence and a proactive approach to problem-solving, I am dedicated to driving innovation and delivering high-quality software solutions that make a meaningful impact.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="hidden sticky bottom-0 lg:block">
          <img 
            src="/img/rahul-main-1.png" 
            alt="" 
            aria-hidden
            class="z-20 ml-24 -mb-24 w-full h-auto object-cover"
            style="min-height: 700px; max-height: 700px; min-width: 400px;"
            loading="lazy"
          />
        </div>
      </div>
      <ContentDivider anchor="right" class="mt-14 hidden lg:block" />
    </AppSection>
    

    <!-- Enhanced Skills & Expertise Section -->
    <AppSection class="py-20 bg-zinc-900">
      <div class="scroll-animate opacity-0">
        <ParagraphDecoration />
        <AppParagraph class="mt-4 mb-8" tag="h2" look="heading">Technical Expertise</AppParagraph>
        
        <p class="text-gray-300 text-lg mb-12  max-w-3xl mx-aut">
          7+ years of full-stack development experience with <span class="text-red-400 font-semibold">MERN Stack</span>, 
          <span class="text-red-400 font-semibold">Java Spring Boot</span>, and <span class="text-red-400 font-semibold">Vue.js</span>. 
          Specialized in building scalable web applications and enterprise solutions.
        </p>
        
        <!-- Interactive Skills Grid (compact) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div 
            v-for="(category, categoryIndex) in skillCategories" 
            :key="categoryIndex"
            class="group scroll-animate opacity-0 relative"
            :style="{ animationDelay: `${categoryIndex * 150}ms` }"
          >
            <!-- Card with hover effects -->
            <div class="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2">
              
              <!-- Category Header -->
              <div class="flex items-center mb-6">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div class="relative bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl">
                    <Icon :name="category.icon" class="text-2xl text-white" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                    {{ category.title }}
                  </h3>
                  <p class="text-gray-400 text-sm">{{ category.skills.length }} core technologies</p>
                </div>
              </div>
              
              <!-- Skills List -->
              <div class="space-y-4">
                <div 
                  v-for="(skill, skillIndex) in category.skills" 
                  :key="skillIndex"
                  class="group/skill"
                >
                  <!-- Skill Header -->
                  <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center space-x-3">
                      <span class="text-gray-200 font-medium group-hover/skill:text-white transition-colors">
                        {{ skill.name }}
                      </span>
                      <span class="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30">
                        {{ skill.years }}
                      </span>
                    </div>
                    <span class="text-red-400 text-sm font-bold">{{ skill.level }}%</span>
                  </div>
                  
                  <!-- Animated Progress Bar -->
                  <div class="relative">
                    <div class="w-full bg-gray-700/50  h-1 overflow-hidden">
                      <div 
                        class="skill-bar-enhanced h-1  relative overflow-hidden"
                        :style="{ 
                          width: `${skill.level}%`, 
                          animationDelay: `${(categoryIndex * 5 + skillIndex) * 200}ms`,
                          background: `linear-gradient(90deg, #ef4444 0%, #ec4899 ${skill.level}%, #f97316 100%)`
                        }"
                      >
                        <!-- Shimmer effect -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                      </div>
                    </div>
                    <!-- Skill level indicator -->
                    <div 
                      class="absolute top-0 w-1 h-1 bg-white  transition-all duration-1000"
                      :style="{ left: `calc(${skill.level}% - 2px)`, animationDelay: `${(categoryIndex * 5 + skillIndex) * 200 + 1000}ms` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Decorative elements -->
              <div class="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Icon :name="category.icon" class="text-4xl text-red-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Experience Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div class="scroll-animate opacity-0 bg-gradient-to-br from-red-500/10 to-pink-600/10 rounded-xl p-6 border border-red-500/20  hover:scale-105 transition-transform duration-300">
            <div class="text-3xl font-bold text-red-400 mb-2">7+</div>
            <div class="text-gray-300">Years Experience</div>
            <div class="text-sm text-gray-400 mt-1">Full Stack Development</div>
          </div>
          <div class="scroll-animate opacity-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20  hover:scale-105 transition-transform duration-300" style="animation-delay: 100ms">
            <div class="text-3xl font-bold text-blue-400 mb-2">MERN</div>
            <div class="text-gray-300">Stack Expert</div>
            <div class="text-sm text-gray-400 mt-1">MongoDB, Express, React, Node.js</div>
          </div>
          <div class="scroll-animate opacity-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/20  hover:scale-105 transition-transform duration-300" style="animation-delay: 200ms">
            <div class="text-3xl font-bold text-green-400 mb-2">Java</div>
            <div class="text-gray-300">Enterprise Solutions</div>
            <div class="text-sm text-gray-400 mt-1">Spring Boot, Microservices</div>
          </div>
        </div>
        <!-- What I Bring to Your Team -->
        <div class="scroll-animate opacity-0">
          <h2 class="text-3xl font-bold text-red-400 mb-6 flex items-center">
            <Icon name="heroicons:user-plus" class="mr-3" />
            What I Bring to Your Team
          </h2>
          <p class="text-gray-300 text-lg mb-8  max-w-4xl">
            Beyond technical expertise, I bring proven leadership, problem-solving abilities, and a passion for building exceptional software that drives business value.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:rocket-launch" class="text-xl text-white" />
                </div>
                <h3 class="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                  Performance Optimization
                </h3>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                Reduced manual processes by 90% through automation and improved system efficiency. Specialized in optimizing application performance and scalability.
              </p>
            </div>

            <div class="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:users" class="text-xl text-white" />
                </div>
                <h3 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Team Leadership
                </h3>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                Led successful legacy system migrations and mentored junior developers. Strong collaboration skills with cross-functional teams and stakeholders.
              </p>
            </div>

            <div class="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:shield-check" class="text-xl text-white" />
                </div>
                <h3 class="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                  Security & Quality
                </h3>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                Implemented robust security measures against vulnerabilities. Focus on clean, maintainable code and comprehensive testing practices.
              </p>
            </div>

            <div class="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:light-bulb" class="text-xl text-white" />
                </div>
                <h3 class="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  Innovation & Problem Solving
                </h3>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                Proactive approach to identifying and solving complex technical challenges. Always exploring new technologies and best practices.
              </p>
            </div>

            <div class="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:heart" class="text-xl text-white" />
                </div>
                <h3 class="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  Client Satisfaction
                </h3>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                Achieved 75% client satisfaction rate through responsive support and clear communication. Dedicated to delivering solutions that exceed expectations.
              </p>
            </div>

            <div class="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center mb-4">
                <div class="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg mr-4">
                  <Icon name="heroicons:academic-cap" class="text-xl text-white" />
                </div>
                <h3 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  Continuous Learning
                </h3>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                Currently pursuing MS in Software Engineering. Always staying updated with latest technology trends and industry best practices.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ContentDivider anchor="left" class="mt-14 hidden lg:block" />
    </AppSection>


    <!-- Career & Education Milestones Section -->
    <AppSection>
      <LazyParagraphDecoration class="mt-16" />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading"> 
        Career & Education Journey
      </AppParagraph>
      
      <p class="text-gray-300 text-lg mt-8 mb-6 max-w-4xl">
        A comprehensive timeline showcasing my professional growth and educational achievements from engineering graduate to senior software engineer.
      </p>
      <p class="text-sm text-gray-400 mb-10 flex items-center justify-center gap-2">
        <Icon name="heroicons:cursor-arrow-rays" class="w-4 h-4 text-red-400" />
        Tip: Hover or click the timeline dots to view full details.
      </p>

      <!-- Vertical Timeline -->
      <div class="relative max-w-4xl mx-auto">
        <!-- Timeline Line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-pink-600 transform -translate-x-1/2 hidden md:block"></div>
        
        <!-- Mobile Timeline Line -->
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-pink-600 transform -translate-x-1/2 md:hidden"></div>
        
        <!-- Timeline Events -->
        <div class="space-y-8 md:space-y-24">
          <div 
            v-for="(event, index) in timelineEvents" 
            :key="event.id"
            class="relative"
            
          >
            <!-- Desktop Layout with Alternating Sides -->
            <div class="hidden md:block">
              <div class="flex items-center justify-center">
                <!-- Timeline Center Dot with Hover Popup -->
                <div class="relative z-20">
                  <div 
                    class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all duration-300 cursor-pointer group relative"
                    :class="{
                      'bg-gradient-to-r from-red-500 to-pink-600': event.type === 'work',
                      'bg-gradient-to-r from-blue-600 to-indigo-700': event.type === 'education',
                      'ring-4 ring-white/30 scale-110': hoveredEvent?.id === event.id || selectedEvent?.id === event.id
                    }"
                    @click="selectedEvent = selectedEvent?.id === event.id ? null : event"
                    @mouseenter="!selectedEvent && (hoveredEvent = event)"
                    @mouseleave="!selectedEvent && (hoveredEvent = null)"
                  >
                    <span 
                      class="absolute inset-0 rounded-full opacity-40 animate-ping"
                      :class="event.type === 'work' ? 'bg-red-500' : 'bg-blue-500'"
                      aria-hidden
                    ></span>
                    <Icon :name="event.icon" class="text-white text-2xl" />
                  </div>
                  
                  <!-- Year and Title - Left Side for Right Popup (Odd indices) -->
                  <div v-if="index % 2 === 1 && (!activeEventId || activeEventId === event.id)" class="absolute right-full mr-6 top-1/2 transform -translate-y-1/2 text-right">
                    <div class="bg-zinc-900 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50">
                      <span class="text-lg font-bold text-red-400 block">{{ event.org }}</span>
                      <span class="text-base text-gray-300 mt-1 block leading-tight truncate max-w-[12rem]">{{ event.title }}</span>
                      <span class="text-sm text-gray-300 mt-1 block leading-tight truncate max-w-[12rem]">{{ event.period }}</span>
                    </div>
                  </div>
                  
                  <!-- Year and Title - Right Side for Left Popup (Even indices) -->
                  <div v-if="index % 2 === 0 && (!activeEventId || activeEventId === event.id)" class="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 text-left">
                    <div class="bg-zinc-900 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50">
                      <span class="text-lg font-bold text-red-400 block">{{ event.org }}</span>
                      <span class="text-base text-gray-300 mt-1 block leading-tight truncate max-w-[12rem]">{{ event.title }}</span>
                      <span class="text-sm text-gray-300 mt-1 block leading-tight truncate max-w-[12rem]">{{ event.period }}</span>
                    </div>
                  </div>

                  <!-- Hover Popup - Left Side for Even indices -->
                  <Transition
                    enter-active-class="transition ease-out duration-300"
                    enter-from-class="transform opacity-0 scale-95 translate-x-4"
                    enter-to-class="transform opacity-100 scale-100 translate-x-0"
                    leave-active-class="transition ease-in duration-200"
                    leave-from-class="transform opacity-100 scale-100 translate-x-0"
                    leave-to-class="transform opacity-0 scale-95 translate-x-4"
                  >
                    <div 
                      v-if="(activeEventId === event.id) && index % 2 === 0"
                      class="absolute right-full mr-6 top-1/2 transform -translate-y-1/2 z-40 w-96"
                    >
                      <div 
                        class="bg-zinc-900 backdrop-blur-md rounded-sm p-6 border shadow-2xl"
                        :class="event.type === 'work' ? 'border-red-500/70 shadow-red-500/20' : 'border-blue-500/70 shadow-blue-500/20'"
                      >
                        <!-- Popup Arrow -->
                        <div 
                          class="absolute left-full top-1/2 transform -translate-y-1/2 -ml-1 w-4 h-4 rotate-45 border-r border-b bg-gray-900/95"
                          :class="event.type === 'work' ? 'border-red-500/70' : 'border-blue-500/70'"
                        ></div>
                        
                        <!-- Card Header -->
                        <div class="flex items-start justify-between mb-4 ">
                          <div class="flex items-center space-x-3">
                            <div 
                              class="w-12 h-12 rounded-full flex items-center justify-center"
                              :class="event.type === 'work' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-indigo-700'"
                            >
                              <Icon :name="event.icon" class="text-white text-lg" />
                            </div>
                            <div>
                              <h3 class="text-lg font-bold text-white">{{ event.title }}</h3>
                              <p class="text-sm font-semibold" :class="event.type === 'work' ? 'text-red-400' : 'text-blue-400'">{{ event.org }}</p>
                              <div class="text-sm" :class="event.type === 'work' ? 'text-red-400' : 'text-blue-400'">{{ event.period }}</div>
                              <p v-if="event.org || event.period" class="text-xs text-gray-400 mt-1">
                                <span v-if="(event.org || event.period) && event.location"> • </span>
                                <span v-if="event.location">{{ event.location }}</span>
                              </p>
                            </div>
                          </div>
                          <div class="text-right">
                            
                          </div>
                        </div>
                        
                        <!-- Category Badge -->
                        <div class="mb-3">
                          <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                            :class="event.type === 'work' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'">
                            {{ event.category }}
                          </span>
                        </div>
                        
                        <!-- Description -->
                        <p class="text-gray-300 text-sm leading-relaxed mb-3">{{ event.description }}</p>
                        
                        <!-- Skills Tags -->
                        <div class="flex flex-wrap gap-1 mb-3">
                          <span v-for="skill in event.skills" :key="skill" class="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded border border-gray-600/50">
                            {{ skill }}
                          </span>
                        </div>

                        <!-- Key Highlights -->
                        <div>
                          <h4 class="text-sm font-semibold text-white mb-2">Key Highlights:</h4>
                          <ul class="space-y-1">
                            <li v-for="detail in event.details" :key="detail" class="text-gray-300 text-xs flex items-start">
                              <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-0.5 flex-shrink-0 w-3 h-3" />
                              {{ detail }}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Transition>

                  <!-- Hover Popup - Right Side for Odd indices -->
                  <Transition
                    enter-active-class="transition ease-out duration-300"
                    enter-from-class="transform opacity-0 scale-95 -translate-x-4"
                    enter-to-class="transform opacity-100 scale-100 translate-x-0"
                    leave-active-class="transition ease-in duration-200"
                    leave-from-class="transform opacity-100 scale-100 translate-x-0"
                    leave-to-class="transform opacity-0 scale-95 -translate-x-4"
                  >
                    <div 
                      v-if="(activeEventId === event.id) && index % 2 === 1"
                      class="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 z-40 w-96"
                    >
                      <div 
                        class="bg-zinc-900 backdrop-blur-md rounded-sm p-6 border shadow-2xl"
                        :class="event.type === 'work' ? 'border-red-500/70 shadow-red-500/20' : 'border-blue-500/70 shadow-blue-500/20'"
                      >
                        <!-- Popup Arrow -->
                        <div 
                          class="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 w-4 h-4 rotate-45 border-l border-b bg-gray-900/95"
                          :class="event.type === 'work' ? 'border-red-500/70' : 'border-blue-500/70'"
                        ></div>
                        
                        <!-- Same content as left side -->
                        <div class="flex items-start justify-between mb-4">
                          <div class="flex items-center space-x-3">
                            <div 
                              class="w-12 h-12 rounded-full flex items-center justify-center"
                              :class="event.type === 'work' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-indigo-700'"
                            >
                              <Icon :name="event.icon" class="text-white text-lg" />
                            </div>
                            <div>
                              <h3 class="text-lg font-bold text-white">{{ event.title }}</h3>
                              <p class="text-sm font-semibold" :class="event.type === 'work' ? 'text-red-400' : 'text-blue-400'">{{ event.org }}</p>
                              <div class="text-sm" :class="event.type === 'work' ? 'text-red-400' : 'text-blue-400'">{{ event.period }}</div>
                              <p v-if="event.org || event.period" class="text-xs text-gray-400 mt-1">
                                <span v-if="(event.org || event.period) && event.location"> • </span>
                                <span v-if="event.location">{{ event.location }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                            :class="event.type === 'work' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'">
                            {{ event.category }}
                          </span>
                        </div>
                        
                        <p class="text-gray-300 text-sm leading-relaxed mb-3">{{ event.description }}</p>
                        
                        <div class="flex flex-wrap gap-1 mb-3">
                          <span v-for="skill in event.skills" :key="skill" class="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded border border-gray-600/50">
                            {{ skill }}
                          </span>
                        </div>

                        <div>
                          <h4 class="text-sm font-semibold text-white mb-2">Key Highlights:</h4>
                          <ul class="space-y-1">
                            <li v-for="detail in event.details" :key="detail" class="text-gray-300 text-xs flex items-start">
                              <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-0.5 flex-shrink-0 w-3 h-3" />
                              {{ detail }}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Mobile Layout -->
            <div class="md:hidden">
              <div class="flex items-start space-x-4 relative">
                <!-- Timeline Dot -->
                <div class="flex-shrink-0 mt-2 relative z-10">
                  <div 
                    class="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center relative"
                    :class="event.type === 'work' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-blue-600 to-indigo-700'"
                  >
                    <span 
                      class="absolute inset-0 rounded-full opacity-40 animate-ping"
                      :class="event.type === 'work' ? 'bg-red-500' : 'bg-blue-500'"
                      aria-hidden
                    ></span>
                    <Icon :name="event.icon" class="text-white text-lg" />
                  </div>
                </div>
                
                <!-- Mobile Card -->
                <div 
                  class="flex-1 cursor-pointer"
                  @click="selectedEvent = selectedEvent?.id === event.id ? null : event"
                >
                  <div 
                    class="bg-gradient-to-br backdrop-blur-sm rounded-xl p-5 border transition-all duration-300"
                    :class="event.type === 'work' ? 'from-red-900/20 to-pink-900/30 border-red-500/30' : 'from-blue-900/20 to-indigo-900/30 border-blue-500/30'"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex-1">
                        <h3 class="text-lg font-bold text-white mb-1">{{ event.title }}</h3>
                        <p class="text-sm mb-2" :class="event.type === 'work' ? 'text-red-400' : 'text-blue-400'">{{ event.subtitle }}</p>
                        <p class="text-xs text-gray-500">{{ event.date }}</p>
                        <p v-if="event.org || event.period" class="text-xs text-gray-400 mt-1">
                          <span v-if="event.org">{{ event.org }}</span>
                          <span v-if="event.org && event.period"> • </span>
                          <span v-if="event.period">{{ event.period }}</span>
                          <span v-if="(event.org || event.period) && event.location"> • </span>
                          <span v-if="event.location">{{ event.location }}</span>
                        </p>
                      </div>
                      <span class="text-sm font-semibold" :class="event.type === 'work' ? 'text-red-400' : 'text-blue-400'">{{ event.year }}</span>
                    </div>
                    
                    <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
                      :class="event.type === 'work' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'">
                      {{ event.category }}
                    </span>
                    
                    <p class="text-gray-300 text-sm leading-relaxed mb-4">{{ event.description }}</p>
                    
                    <!-- Key Highlights for Mobile -->
                    <div class="mb-4">
                      <h4 class="text-sm font-semibold text-white mb-2">Key Highlights:</h4>
                      <ul class="space-y-1">
                        <li v-for="detail in event.details" :key="detail" class="text-gray-300 text-xs flex items-start">
                          <Icon name="heroicons:check-circle" class="text-green-500 mr-2 mt-0.5 flex-shrink-0 w-3 h-3" />
                          {{ detail }}
                        </li>
                      </ul>
                    </div>
                    
                    <!-- Skills for Mobile -->
                    <div>
                      <h4 class="text-sm font-semibold text-white mb-2">Skills & Technologies:</h4>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="skill in event.skills" :key="skill" class="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded border border-gray-600/50">
                          {{ skill }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <ContentDivider anchor="right" class="mt-14 hidden lg:block" />
    </AppSection>

    
    <AppSection class="bg-zinc-900" style="padding-top: 2.5rem;">
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
      <ContentDivider anchor="left" class="mt-14 hidden lg:block" />
    </AppSection>

    
    <!-- Courses Section -->
    <AppSection style="padding-top: 2.5rem;">
      <LazyParagraphDecoration />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading">
        Courses
      </AppParagraph>
      <div class="flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
        <AppParagraph look="subParagraph" class="mt-8 max-w-xl">
          <span style="font-style: italic;">“Learning never exhausts the mind.”</span> — Leonardo da Vinci
        </AppParagraph>
        <div>
          <AppButton to="/courses/" look="secondary">Discover all courses</AppButton>
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-12 mt-8">
        <LazyCoursePreview class="flex-1" v-for="course in courses" :course="course" />
      </div>
      <ContentDivider anchor="right" class="mt-14 hidden lg:block" />
    </AppSection>

    <AppSection  class="bg-zinc-900">
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
        <ArticlePreview v-for="article in articles" :key="article._id" :article="article as any" />
      </div>
      <div class="flex md:justify-end mt-8">
        <AppButton to="/articles" look="secondary" secondary-after-bg="bg-zinc-900">View all articles</AppButton>
      </div>
      <ContentDivider anchor="left" class="mt-14 hidden lg:block" />
    </AppSection>

    <!-- Awards & Certificates Carousel Section -->
    <AppSection>
      <LazyParagraphDecoration class="mt-16" />
      <AppParagraph class="mr-8 mt-4" tag="h2" look="heading"> 
        Awards & Certificates
      </AppParagraph>
      <div class="mt-6 text-gray-400">A curated selection of recognitions and certifications. Use arrows to navigate or let it autoplay.</div>

      <!-- Carousel Container -->
      <div class="relative mt-8 overflow-hidden bg-zinc-800 border border-red-500/20 bg-gradient-to-br from-zinc-900/40 to-zinc-900/70 shadow-[0_10px_40px_-10px_rgba(239,68,68,0.25)]">
        <!-- Slides track -->
        <div class="whitespace-nowrap transition-transform duration-500" :style="{ transform: `translateX(-${currentShowcaseIndex * 100}%)` }" @mouseenter="stopAutoScroll" @mouseleave="startAutoScroll">
          <div 
            v-for="(item, idx) in showcaseItems" 
            :key="item.title + idx"
            class="inline-block align-top w-full p-6 md:p-8"
          >
            <div class="grid md:grid-cols-5 gap-6 items-start">
              <!-- Main Image (single) with +count overlay -->
              <div class="md:col-span-3">
                <div class="relative rounded-sm overflow-hidden border border-gray-700/50 bg-black/20 aspect-[16/9]">
                  <img :src="resolveImages(item)[0]" :alt="item.title + ' image'" class="w-full h-full object-cover" loading="lazy" @error="onImageError" />
                  <button 
                    v-if="resolveImages(item).length > 1"
                    @click="openGallery(item, 0)"
                    class="absolute bottom-3 right-3 bg-gradient-to-r from-red-500/70 to-pink-600/70 hover:from-red-500/80 hover:to-pink-600/80 text-white rounded-full px-3 py-1.5 text-sm flex items-center gap-1 border border-white/10 backdrop-blur-sm"
                    aria-label="Open gallery"
                  >
                    <Icon name="heroicons:plus" class="w-4 h-4" />
                    <span>+{{ resolveImages(item).length - 1 }}</span>
                  </button>
                </div>
              </div>

              <!-- Details -->
              <div class="md:col-span-2">
                <div class="flex items-center gap-3 mb-2">
                  <div 
                    class="p-2 rounded-lg"
                    :class="item.kind === 'award' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-zinc-600 to-zinc-700'"
                  >
                    <Icon :name="item.kind === 'award' ? 'heroicons:trophy' : 'heroicons:academic-cap'" class="text-white" />
                  </div>
                  <span class="text-sm text-gray-400">{{ item.kind === 'award' ? 'Award' : 'Certificate' }}</span>
                </div>
                <h3 class="text-2xl font-bold text-white  text-wrap">{{ item.title }}</h3>
                <p class="text-sm text-red-300 mt-1  text-wrap">{{ item.org }} • {{ item.date }}</p>
                <p class="text-gray-300 mt-4 leading-relaxed text-wrap">{{ item.description }}</p>
                <div v-if="item.skills?.length" class="flex flex-wrap gap-2 mt-4">
                  <span v-for="s in item.skills" :key="s" class="px-2 py-1 text-xs bg-red-500/10 text-red-300 rounded border border-red-500/30">{{ s }}</span>
                </div>
                <div v-if="item.link" class="mt-4">
                  <AppLink :to="item.link" look="secondary">View details</AppLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <button aria-label="Previous" @click="prevShowcase" class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 border border-white/10 backdrop-blur-sm">
          <Icon name="heroicons:chevron-left" />
        </button>
        <button aria-label="Next" @click="nextShowcase" class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 border border-white/10 backdrop-blur-sm">
          <Icon name="heroicons:chevron-right" />
        </button>

        <!-- Dots -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          <button 
            v-for="(item, i) in showcaseItems" :key="'dot-' + i"
            @click="goToShowcase(i)"
            class="w-2.5 h-2.5 rounded-full border border-white/20 transition-colors"
            :class="i === currentShowcaseIndex ? 'bg-white/80' : 'bg-white/20 hover:bg-white/40'"
            aria-label="Go to slide"
          />
        </div>
      </div>

      <ContentDivider anchor="left" class="mt-14 hidden lg:block" />
    </AppSection>

    <!-- Modal: Image Gallery -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isGalleryOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.self="closeGallery">
        <div class="relative w-full h-full md:w-[90vw] md:h-[85vh] p-4 md:p-6">
          <button class="absolute top-4 right-4 text-white/90 hover:text-white bg-gradient-to-r from-red-500/30 to-pink-600/30 rounded-full p-2 border border-white/20 backdrop-blur" @click="closeGallery" aria-label="Close gallery">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>

          <div class="relative w-full h-full rounded-xl overflow-hidden border border-red-500/20 bg-black/80">
            <img :src="galleryImages[galleryIndex]" alt="Gallery image" class="w-full h-full object-contain" @error="onImageError" />

            <button class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 border border-white/10 backdrop-blur" @click="prevGallery" aria-label="Previous image">
              <Icon name="heroicons:chevron-left" />
            </button>
            <button class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 border border-white/10 backdrop-blur" @click="nextGallery" aria-label="Next image">
              <Icon name="heroicons:chevron-right" />
            </button>

            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full border border-red-500/30">
              {{ galleryIndex + 1 }} / {{ galleryImages.length }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>



<style lang="css">
  @import '@aherrahul/design-system/dist/style.css';
  
  /* Custom animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes skillBarGrow {
    from {
      width: 0%;
    }
    to {
      width: var(--target-width);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Animation classes */
  .animate-fadeInUp {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .text-gradient-animation {
    background-size: 200% 200%;
    animation: gradientShift 3s ease-in-out infinite;
  }

  .skill-bar {
    width: 0%;
    animation: skillBarGrow 1.5s ease-out forwards;
  }

  .skill-bar-enhanced {
    width: 0%;
    animation: skillBarGrow 2s ease-out forwards;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  .scroll-animate {
    transition: all 0.6s ease-out;
  }

  .counter {
    font-variant-numeric: tabular-nums;
  }

  /* Hover effects */
  .hover-float:hover {
    animation: float 2s ease-in-out infinite;
  }

  /* Glass morphism effect */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Existing RDS styles */
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

  /* Enhanced timeline styles */
  .rds-timeline-item {
    transition: all 0.3s ease;
  }

  .rds-timeline-item:hover {
    transform: translateX(5px);
  }

  /* Responsive improvements */
  @media (max-width: 768px) {
    .skill-bar {
      animation-duration: 1s;
    }
    
    .animate-fadeInUp {
      animation-duration: 0.6s;
    }

    /* Mobile horizontal timeline adjustments */
    .horizontal-timeline-mobile {
      flex-direction: column;
      gap: 2rem;
    }
    
    .horizontal-timeline-mobile .timeline-line {
      display: none;
    }
  }
</style>