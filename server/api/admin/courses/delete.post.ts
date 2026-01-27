import { unlinkSync, rmSync, existsSync } from 'fs'
import { join, normalize } from 'path'

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
    // Verify admin access
    verifyAdmin(event)
    
    const body = await readBody(event)
    const { courseSlug } = body
    
    if (!courseSlug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Course slug is required'
      })
    }
    
    // Build paths
    const contentDir = normalize(join(process.cwd(), 'content'))
    const coursesDir = normalize(join(contentDir, 'courses'))
    const articlesDir = normalize(join(contentDir, 'articles'))
    
    // Course file path (with .md extension)
    const courseFileName = courseSlug.endsWith('.md') ? courseSlug : `${courseSlug}.md`
    const courseFilePath = normalize(join(coursesDir, courseFileName))
    
    // Articles folder path (use original slug with priority number if present)
    const articlesFolderPath = normalize(join(articlesDir, courseSlug.replace('.md', '')))
    
    // Security check
    if (!courseFilePath.startsWith(coursesDir) || !articlesFolderPath.startsWith(articlesDir)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
    
    // Delete course file
    if (existsSync(courseFilePath)) {
      unlinkSync(courseFilePath)
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Course file not found'
      })
    }
    
    // Delete articles folder if it exists
    if (existsSync(articlesFolderPath)) {
      rmSync(articlesFolderPath, { recursive: true, force: true })
    }
    
    return {
      success: true,
      message: 'Course and associated articles folder deleted successfully',
      deletedCourse: courseFileName,
      deletedFolder: courseSlug.replace('.md', '')
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Course deletion error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to delete course'
    })
  }
})

