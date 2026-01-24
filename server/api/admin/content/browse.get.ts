import { readdirSync, statSync } from 'fs'
import { join, normalize, basename } from 'path'

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
    
    const query = getQuery(event)
    const path = String(query.path || '')
    const type = String(query.type || 'articles') // articles, courses, projects, learning, npmpackages
    const filterCourseFolders = query.filterCourseFolders === 'true' // Filter out course folders from articles
    
    // Validate type to prevent directory traversal
    const validTypes = ['articles', 'courses', 'projects', 'learning', 'npmpackages', 'topics']
    if (!validTypes.includes(type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid content type'
      })
    }
    
    // Build safe path - normalize to handle cross-platform paths
    const contentDir = normalize(join(process.cwd(), 'content', type))
    // Normalize the path parameter (handle both / and \ separators)
    const normalizedPath = path ? path.split(/[/\\]/).filter(Boolean).join('/') : ''
    const targetDir = normalizedPath ? normalize(join(contentDir, normalizedPath)) : contentDir
    
    // Security check - normalize both paths for comparison
    const normalizedContentDir = normalize(contentDir)
    const normalizedTargetDir = normalize(targetDir)
    
    if (!normalizedTargetDir.startsWith(normalizedContentDir)) {
      console.error('Path security check failed:', {
        contentDir: normalizedContentDir,
        targetDir: normalizedTargetDir,
        path: normalizedPath
      })
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
    
    // Get course slugs if we need to filter
    let courseSlugs: string[] = []
    if (filterCourseFolders && type === 'articles' && !path) {
      // Only filter at root level of articles
      try {
        const coursesDir = join(process.cwd(), 'content', 'courses')
        const courseFiles = readdirSync(coursesDir, { withFileTypes: true })
        courseSlugs = courseFiles
          .filter(f => f.isFile() && f.name.endsWith('.md'))
          .map(f => basename(f.name, '.md'))
      } catch (err) {
        // Courses directory might not exist, continue without filtering
      }
    }
    
    // Read directory
    const entries = readdirSync(targetDir, { withFileTypes: true })
    
    let items = entries.map(entry => {
      const fullPath = join(targetDir, entry.name)
      const stats = statSync(fullPath)
      const relativePath = path ? `${path}/${entry.name}` : entry.name
      
      return {
        name: entry.name,
        path: relativePath,
        type: entry.isDirectory() ? 'directory' : 'file',
        isMarkdown: entry.name.endsWith('.md'),
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime
      }
    })
    
    // Filter out course folders from articles if requested
    if (filterCourseFolders && courseSlugs.length > 0) {
      items = items.filter(item => {
        if (item.type === 'directory') {
          return !courseSlugs.includes(item.name)
        }
        return true
      })
    }
    
    // Sort: directories first, then files
    items.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name)
      }
      return a.type === 'directory' ? -1 : 1
    })
    
    return {
      currentPath: path,
      items
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Browse error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to browse directory'
    })
  }
})

