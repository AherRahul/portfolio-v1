import { appendHeader } from 'h3'
import { generateBlogFeed } from '~/server/utils/feed.js'

export default defineEventHandler(async (event) => {
  try {
    const feed = await generateBlogFeed(event)
    appendHeader(event, 'Content-Type', 'application/xml')
    return feed.rss2()
  } catch (error) {
    // Return minimal empty feed to avoid build failure
    appendHeader(event, 'Content-Type', 'application/xml')
    return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Rahul Aher | Blog</title></channel></rss>'
  }
})