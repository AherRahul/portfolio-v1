import { writeFileSync, mkdirSync } from 'fs'
import { join, resolve } from 'path'

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
    const { slug, name, description, color, icon, category } = body

    if (!slug || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug and name are required'
      })
    }

    // Validate slug format (lowercase, hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug must contain only lowercase letters, numbers, and hyphens'
      })
    }

    const topicsDir = resolve(process.cwd(), 'content', 'topics')
    
    // Ensure topics directory exists
    mkdirSync(topicsDir, { recursive: true })

    const filePath = join(topicsDir, `${slug}.md`)
    
    // Create topic file content
    const content = `---
name: "${name}"
description: "${description || ''}"
color: "${color || '#ef4444'}"
icon: "${icon || ''}"
category: "${category || 'general'}"
---

# ${name}

${description || 'Topic description goes here.'}
`

    writeFileSync(filePath, content, 'utf-8')

    return {
      success: true,
      message: 'Topic created successfully',
      topic: {
        slug,
        name,
        description,
        color,
        icon,
        category
      }
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Topic creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create topic'
    })
  }
})

