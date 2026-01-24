import { readdirSync } from 'fs'
import { join, basename } from 'path'

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
    
    // Get all course files from content/courses/
    const coursesDir = join(process.cwd(), 'content', 'courses')
    
    try {
      const files = readdirSync(coursesDir, { withFileTypes: true })
      
      // Extract slugs from .md files
      const slugs = files
        .filter(f => f.isFile() && f.name.endsWith('.md'))
        .map(f => basename(f.name, '.md'))
      
      return {
        slugs
      }
    } catch (err) {
      // If courses directory doesn't exist, return empty array
      return {
        slugs: []
      }
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Course slugs error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch course slugs'
    })
  }
})

