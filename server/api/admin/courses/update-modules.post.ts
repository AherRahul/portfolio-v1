import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { parse, stringify } from 'yaml'

// Helper to verify admin authentication
function verifyAdmin(event: any) {
  const token = getCookie(event, 'admin-token')

  if (!token || !global.adminTokens || !global.adminTokens.has(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
}

export default defineEventHandler(async (event) => {
  try {
    verifyAdmin(event)

    const body = await readBody(event)
    const { courseSlug, articleSlug, action } = body

    if (!courseSlug || !articleSlug || !action) {
      throw createError({
        statusCode: 400,
        statusMessage: 'courseSlug, articleSlug, and action are required'
      })
    }

    if (!['add', 'remove'].includes(action)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Action must be "add" or "remove"'
      })
    }

    const coursesDir = resolve(process.cwd(), 'content', 'courses')
    const courseFilePath = resolve(coursesDir, `${courseSlug}.md`)

    // Read course file
    let courseContent: string
    try {
      courseContent = readFileSync(courseFilePath, 'utf-8')
    } catch (err) {
      throw createError({
        statusCode: 404,
        statusMessage: `Course file not found: ${courseSlug}.md`
      })
    }

    // Parse frontmatter
    const match = courseContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/)
    if (!match) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid course file format'
      })
    }

    const frontmatterText = match[1]
    const body_content = match[2]

    let frontmatter: any = {}
    try {
      frontmatter = parse(frontmatterText)
    } catch (e) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to parse course frontmatter'
      })
    }

    // Get current content array
    let content = frontmatter.content || []
    if (!Array.isArray(content)) {
      content = []
    }

    // Perform action
    if (action === 'add') {
      if (!content.includes(articleSlug)) {
        content.push(articleSlug)
      }
    } else if (action === 'remove') {
      content = content.filter((slug: string) => slug !== articleSlug)
    }

    // Update frontmatter
    frontmatter.content = content

    // Write back to file
    const newFrontmatter = stringify(frontmatter)
    const newContent = `---\n${newFrontmatter}---\n${body_content}`
    writeFileSync(courseFilePath, newContent, 'utf-8')

    return {
      success: true,
      message: `Course module ${action === 'add' ? 'added' : 'removed'} successfully`,
      courseSlug,
      articleSlug,
      modules: content
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Course module update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update course modules'
    })
  }
})

