import { readdirSync, statSync } from 'fs'
import { join } from 'path'

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

// Helper to count files in a directory
function countFiles(dirPath: string): number {
  try {
    const files = readdirSync(dirPath, { withFileTypes: true })
    let count = 0
    
    for (const file of files) {
      if (file.isDirectory()) {
        count += countFiles(join(dirPath, file.name))
      } else if (file.isFile() && file.name.endsWith('.md')) {
        count++
      }
    }
    
    return count
  } catch {
    return 0
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Verify admin access
    verifyAdmin(event)
    
    const contentDir = join(process.cwd(), 'content')
    
    const stats = {
      courses: countFiles(join(contentDir, 'courses')),
      articles: countFiles(join(contentDir, 'articles')),
      projects: countFiles(join(contentDir, 'projects')),
      learning: countFiles(join(contentDir, 'learning')),
      npmpackages: countFiles(join(contentDir, 'npmpackages')),
      topics: countFiles(join(contentDir, 'topics'))
    }
    
    return stats
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics'
    })
  }
})

