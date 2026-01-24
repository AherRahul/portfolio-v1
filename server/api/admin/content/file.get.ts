import { readFileSync } from 'fs'
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
    
    const query = getQuery(event)
    const path = String(query.path || '')
    const type = String(query.type || 'articles')
    
    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File path is required'
      })
    }
    
    // Validate type
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
    const normalizedPath = path.split(/[/\\]/).filter(Boolean).join('/')
    const filePath = normalize(join(contentDir, normalizedPath))
    
    // Security check - normalize both paths for comparison
    const normalizedContentDir = normalize(contentDir)
    const normalizedFilePath = normalize(filePath)
    
    if (!normalizedFilePath.startsWith(normalizedContentDir) || !normalizedFilePath.endsWith('.md')) {
      console.error('Path security check failed:', {
        contentDir: normalizedContentDir,
        filePath: normalizedFilePath,
        path: normalizedPath
      })
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
    
    // Read file
    const content = readFileSync(filePath, 'utf-8')
    
    return {
      path,
      type,
      content
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    if (error.code === 'ENOENT') {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }
    
    console.error('Read file error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read file'
    })
  }
})

