import { readdirSync, readFileSync, statSync } from 'fs'
import { join, resolve } from 'path'
import { parse } from 'yaml'

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

    const topicsDir = resolve(process.cwd(), 'content', 'topics')
    
    // Check if topics directory exists
    try {
      statSync(topicsDir)
    } catch (err) {
      // Topics directory doesn't exist yet
      return { topics: [] }
    }

    const entries = readdirSync(topicsDir, { withFileTypes: true })
    
    const topics = entries
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .map(entry => {
        const filePath = join(topicsDir, entry.name)
        const content = readFileSync(filePath, 'utf-8')
        
        // Parse frontmatter
        const match = content.match(/^---\n([\s\S]*?)\n---/)
        let frontmatter: any = {}
        
        if (match && match[1]) {
          try {
            frontmatter = parse(match[1])
          } catch (e) {
            console.warn(`Failed to parse frontmatter for ${entry.name}:`, e)
          }
        }
        
        const slug = entry.name.replace('.md', '')
        
        return {
          slug,
          name: frontmatter.name || frontmatter.title || slug,
          description: frontmatter.description || '',
          color: frontmatter.color || '#ef4444',
          icon: frontmatter.icon || '',
          category: frontmatter.category || 'general'
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    return { topics }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Topics list error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch topics'
    })
  }
})

