import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, normalize } from 'path'
import { parse, stringify } from 'yaml'

// Helper to verify admin authentication
function verifyAdmin(event: any) {
  const token = getCookie(event, 'admin-token')
  if (!token || !global.adminTokens || !global.adminTokens.has(token)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

function parseMarkdownFile(filePath: string): { frontmatter: any; body: string } {
  const raw = readFileSync(filePath, 'utf-8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: raw }
  try {
    return { frontmatter: parse(match[1]) || {}, body: match[2] }
  } catch {
    return { frontmatter: {}, body: raw }
  }
}

function writeMarkdownFile(filePath: string, frontmatter: any, body: string) {
  const yamlStr = stringify(frontmatter)
  writeFileSync(filePath, `---\n${yamlStr}---\n${body}`, 'utf-8')
}

export default defineEventHandler(async (event) => {
  try {
    verifyAdmin(event)

    const body = await readBody(event)
    const {
      courseSlug,       // e.g. "00-understand-javascript-complete"
      action,           // "publish" | "unpublish"
      target,           // "course" | "module" | "topic"
      moduleId,         // number (for module/topic targets)
      topicPath,        // string _path of topic (for topic target only)
    } = body

    if (!courseSlug || !action || !target) {
      throw createError({ statusCode: 400, statusMessage: 'courseSlug, action, and target are required' })
    }
    if (!['publish', 'unpublish'].includes(action)) {
      throw createError({ statusCode: 400, statusMessage: 'action must be "publish" or "unpublish"' })
    }
    if (!['course', 'module', 'topic'].includes(target)) {
      throw createError({ statusCode: 400, statusMessage: 'target must be "course", "module", or "topic"' })
    }

    const isPublishing = action === 'publish'
    const today = new Date().toISOString().split('T')[0]

    const contentDir = normalize(join(process.cwd(), 'content'))
    const coursesDir = normalize(join(contentDir, 'courses'))
    const articlesDir = normalize(join(contentDir, 'articles'))

    const courseFileName = courseSlug.endsWith('.md') ? courseSlug : `${courseSlug}.md`
    const courseFilePath = normalize(join(coursesDir, courseFileName))

    if (!courseFilePath.startsWith(coursesDir)) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }
    if (!existsSync(courseFilePath)) {
      throw createError({ statusCode: 404, statusMessage: 'Course file not found' })
    }

    // Read course file
    const { frontmatter: courseFm, body: courseBody } = parseMarkdownFile(courseFilePath)

    // Remove priority number from slug for article folder name
    // e.g. "00-understand-javascript-complete" -> "00-understand-javascript-complete" (folders use the full slug)
    const courseArticlesFolder = normalize(join(articlesDir, courseSlug))

    const updatedFiles: string[] = []
    const errors: string[] = []

    // ─── TOPIC TARGET ────────────────────────────────────────────────────────────
    if (target === 'topic') {
      if (!topicPath || moduleId === undefined) {
        throw createError({ statusCode: 400, statusMessage: 'moduleId and topicPath are required for topic target' })
      }

      // Update published flag in the course frontmatter for this specific topic
      const content: any[] = courseFm.content || []
      const mod = content.find((m: any) => m.module_id === moduleId)
      if (mod) {
        const topic = mod.topics?.find((t: any) => t._path === topicPath)
        if (topic) {
          topic.published = isPublishing
          if (isPublishing) topic.publish_date = today
          courseFm.content = content
          writeMarkdownFile(courseFilePath, courseFm, courseBody)
          updatedFiles.push(courseFileName)
        }
      }

      // Update the actual article file
      const articleFilePath = normalize(join(courseArticlesFolder, `${topicPath}.md`))
      if (articleFilePath.startsWith(articlesDir) && existsSync(articleFilePath)) {
        try {
          const { frontmatter: artFm, body: artBody } = parseMarkdownFile(articleFilePath)
          artFm.published = isPublishing
          if (isPublishing) {
            artFm.datePublished = today
            artFm.dateModified = today
          }
          writeMarkdownFile(articleFilePath, artFm, artBody)
          updatedFiles.push(`articles/${courseSlug}/${topicPath}.md`)
        } catch (err: any) {
          errors.push(`${topicPath}.md: ${err.message}`)
        }
      }
    }

    // ─── MODULE TARGET ───────────────────────────────────────────────────────────
    else if (target === 'module') {
      if (moduleId === undefined) {
        throw createError({ statusCode: 400, statusMessage: 'moduleId is required for module target' })
      }

      const content: any[] = courseFm.content || []
      const mod = content.find((m: any) => m.module_id === moduleId)
      if (!mod) {
        throw createError({ statusCode: 404, statusMessage: `Module ${moduleId} not found` })
      }

      // Update module published flag
      mod.published = isPublishing

      // Update all topics in this module
      for (const topic of (mod.topics || [])) {
        topic.published = isPublishing
        if (isPublishing) topic.publish_date = today

        // Update article file
        if (topic._path) {
          const articleFilePath = normalize(join(courseArticlesFolder, `${topic._path}.md`))
          if (articleFilePath.startsWith(articlesDir) && existsSync(articleFilePath)) {
            try {
              const { frontmatter: artFm, body: artBody } = parseMarkdownFile(articleFilePath)
              artFm.published = isPublishing
              if (isPublishing) {
                artFm.datePublished = today
                artFm.dateModified = today
              }
              writeMarkdownFile(articleFilePath, artFm, artBody)
              updatedFiles.push(`articles/${courseSlug}/${topic._path}.md`)
            } catch (err: any) {
              errors.push(`${topic._path}.md: ${err.message}`)
            }
          }
        }
      }

      courseFm.content = content
      writeMarkdownFile(courseFilePath, courseFm, courseBody)
      updatedFiles.push(courseFileName)
    }

    // ─── COURSE TARGET ───────────────────────────────────────────────────────────
    else if (target === 'course') {
      // Update course-level published flag
      courseFm.published = isPublishing
      if (isPublishing) courseFm.datePublished = today

      // Update all modules and their topics
      const content: any[] = courseFm.content || []
      for (const mod of content) {
        mod.published = isPublishing
        for (const topic of (mod.topics || [])) {
          topic.published = isPublishing
          if (isPublishing) topic.publish_date = today

          // Update article file
          if (topic._path) {
            const articleFilePath = normalize(join(courseArticlesFolder, `${topic._path}.md`))
            if (articleFilePath.startsWith(articlesDir) && existsSync(articleFilePath)) {
              try {
                const { frontmatter: artFm, body: artBody } = parseMarkdownFile(articleFilePath)
                artFm.published = isPublishing
                if (isPublishing) {
                  artFm.datePublished = today
                  artFm.dateModified = today
                }
                writeMarkdownFile(articleFilePath, artFm, artBody)
                updatedFiles.push(`articles/${courseSlug}/${topic._path}.md`)
              } catch (err: any) {
                errors.push(`${topic._path}.md: ${err.message}`)
              }
            }
          }
        }
      }

      courseFm.content = content
      writeMarkdownFile(courseFilePath, courseFm, courseBody)
      updatedFiles.push(courseFileName)
    }

    return {
      success: true,
      message: `${isPublishing ? 'Published' : 'Unpublished'} ${target} successfully`,
      target,
      action,
      updatedFiles,
      errors: errors.length ? errors : undefined,
      date: today
    }

  } catch (error: any) {
    if (error.statusCode) throw error
    console.error('Publish error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to update publish status' })
  }
})
