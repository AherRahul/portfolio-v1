import type { ParsedContent } from "@nuxt/content/dist/runtime/types/index.js"

type ParsedContentPreview = Omit<ParsedContent, 'body' | 'excerpt'>

type TalkBase = {
  title: string
  eventName?: string
  location?: string
  date: string
  eventUrl?: string
  slidesUrl?: string
  videoUrl?: string
  podcastUrl?: string
  type: 'talk' | 'podcast'
  topics: string[]
}
export type Talk = TalkBase & ParsedContent
export type TalkPreview = TalkBase & ParsedContentPreview

type ArticleBase = {
  title: string
  dateModified: string,
  datePublished: string,
  imageSrc?: string,
  imageAlt?: string,
  topics: string[]
} 

export type Article = ArticleBase & ParsedContent
export type ArticlePreview = ArticleBase & ParsedContentPreview


type ProjectBase = {
  title: string
  time: string
  topics: string[]
}
export type Project = ProjectBase & ParsedContent
export type ProjectPreview = ProjectBase & ParsedContentPreview

type CourseBase = {
  title: string
  time: string
  topics: string[]
  id: Number
  topic_name: string
  sub_topic: string
  publish_date: string
  duration: string
  video_url: string
  auther_name: string
  is_on_youtube: Number
  _path: string
}
export type Course = CourseBase & ParsedContent
export type CoursePreview = CourseBase & ParsedContentPreview

type NpmPackageBase = {
  title: string
  time: string
  topics: string[]
}
export type NpmPackage = NpmPackageBase & ParsedContent
export type NpmPackagePreview = NpmPackageBase & ParsedContentPreview

type BodyBlockLink = {
  type: 'link',
  href: string,
  text?: string
}

type BodyBlockText = {
  type: 'text',
  text: string
}

type BodyBlock = BodyBlockLink | BodyBlockText

export type AppNotification = {
  id: string
  heading: string
  body: string | BodyBlock[],
  /** Set it to 0 to always show */
  durationInMs?: number,
  iconName?: string
  iconClass?: string,
  onRemove?: () => void
}