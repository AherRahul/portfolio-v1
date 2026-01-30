import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, resolve } from 'path'
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
    const { type, updates, filters } = body

    if (!type || !updates) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Type and updates are required'
      })
    }

    const validTypes = ['articles', 'courses', 'projects', 'learning', 'npmpackages', 'topics']
    if (!validTypes.includes(type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid content type'
      })
    }

    const contentRoot = resolve(process.cwd(), 'content')
    const contentDir = resolve(contentRoot, type)

    // Get all markdown files recursively
    const getAllFiles = (dir: string, fileList: string[] = []): string[] => {
      const entries = readdirSync(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        if (entry.isDirectory()) {
          getAllFiles(fullPath, fileList)
        } else if (entry.name.endsWith('.md')) {
          fileList.push(fullPath)
        }
      }
      
      return fileList
    }

    const files = getAllFiles(contentDir)
    let updatedCount = 0
    let filteredCount = 0
    const errors: Array<{ file: string; error: string }> = []
    
    // console.log(`[Bulk Update] Processing ${files.length} files in ${type}`)
    // console.log(`[Bulk Update] Filters:`, filters)
    // console.log(`[Bulk Update] Updates:`, updates)

    let debugLogCount = 0
    let filesWithoutFrontmatter = 0
    let filesWithParseError = 0
    
    for (const filePath of files) {
      try {
        const content = readFileSync(filePath, 'utf-8')
        
        // Parse frontmatter with flexible whitespace handling
        // Use \r?\n to handle both Windows (\r\n) and Unix (\n) line endings
        const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)/)
        if (!match) {
          filesWithoutFrontmatter++
          if (filesWithoutFrontmatter === 1) {
            // console.log('[Bulk Update Debug] First file without frontmatter:', filePath)
            // console.log('[Bulk Update Debug] First 200 chars:', content.substring(0, 200))
          }
          continue
        }

        const frontmatterText = match[1].trim()
        const body = match[2]
        
        let frontmatter: any = {}
        try {
          frontmatter = parse(frontmatterText)
        } catch (e) {
          filesWithParseError++
          if (filesWithParseError === 1) {
            // console.log('[Bulk Update Debug] First file with parse error:', filePath)
            // console.log('[Bulk Update Debug] Error:', e)
          }
          continue
        }

        // Debug: Log first file to see structure
        if (debugLogCount === 0) {
          // console.log('[Bulk Update Debug] First successfully parsed file:')
          // console.log('  - Path:', filePath)
          // console.log('  - Filters object:', JSON.stringify(filters))
          // console.log('  - Filters.courseName:', filters?.courseName)
          // console.log('  - Frontmatter courseName:', frontmatter.courseName)
          debugLogCount++
        }

        // Apply filters if specified
        if (filters) {
          let shouldUpdate = true
          
          // Filter by topic
          if (filters.topic) {
            const topics = frontmatter.topics || []
            if (!topics.includes(filters.topic)) {
              shouldUpdate = false
            }
          }
          
          // Filter by courseName (check folder path, frontmatter, and filename)
          if (filters.courseName) {
            if (debugLogCount === 1) {
              // console.log('[Bulk Update Debug] Entering courseName filter')
              // console.log('  - Looking for course:', filters.courseName)
              // console.log('  - Type:', type)
              debugLogCount++
            }
            
            const hasCourseName = frontmatter.courseName === filters.courseName
            
            // Check if file is in the course folder (e.g., articles/00-understand-javascript-complete/)
            const inCourseFolder = filePath.includes(`${type}/${filters.courseName}/`) || 
                                   filePath.includes(`${type}\\${filters.courseName}\\`)
            
            // Extract course name without index prefix (e.g., '00-understand-javascript-complete' -> 'understand-javascript-complete')
            const courseNameWithoutIndex = filters.courseName.replace(/^\d+-/, '')
            
            // Check if filename starts with the course name (with or without index)
            const fileName = filePath.split(/[/\\]/).pop() || ''
            const fileMatchesCourse = fileName.startsWith(courseNameWithoutIndex) || 
                                      fileName.startsWith(filters.courseName)
            
            // Debug logging for first 3 matching files
            if (filteredCount < 3 && (hasCourseName || inCourseFolder || fileMatchesCourse)) {
              // console.log(`[Bulk Update Debug] Matching File #${filteredCount + 1}: ${fileName}`)
              // console.log(`  - hasCourseName: ${hasCourseName} (frontmatter.courseName="${frontmatter.courseName}")`)
              // console.log(`  - inCourseFolder: ${inCourseFolder}`)
              // console.log(`  - courseNameWithoutIndex: "${courseNameWithoutIndex}"`)
              // console.log(`  - fileMatchesCourse: ${fileMatchesCourse}`)
              // console.log(`  - Full path: ${filePath}`)
            }
            
            // File must be in course folder OR have matching courseName OR match filename pattern
            if (!hasCourseName && !inCourseFolder && !fileMatchesCourse) {
              shouldUpdate = false
            } else {
              // If any condition matches, increment filtered count
              filteredCount++
            }
          }
          
          // Filter by date range
          if (filters.dateFrom && frontmatter.datePublished) {
            if (new Date(frontmatter.datePublished) < new Date(filters.dateFrom)) {
              shouldUpdate = false
            }
          }
          
          if (filters.dateTo && frontmatter.datePublished) {
            if (new Date(frontmatter.datePublished) > new Date(filters.dateTo)) {
              shouldUpdate = false
            }
          }
          
          if (!shouldUpdate) continue
        }

        // Apply updates
        let modified = false
        
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === undefined) continue
          
          // Special handling for topics (add or remove)
          if (key === 'addTopics' && Array.isArray(value)) {
            const currentTopics = frontmatter.topics || []
            const newTopics = [...new Set([...currentTopics, ...value])]
            if (newTopics.length !== currentTopics.length) {
              frontmatter.topics = newTopics
              modified = true
            }
          } else if (key === 'removeTopics' && Array.isArray(value)) {
            const currentTopics = frontmatter.topics || []
            const newTopics = currentTopics.filter((t: string) => !value.includes(t))
            if (newTopics.length !== currentTopics.length) {
              frontmatter.topics = newTopics
              modified = true
            }
          } else {
            // Direct field update
            if (frontmatter[key] !== value) {
              frontmatter[key] = value
              modified = true
            }
          }
        }

        if (modified) {
          // Write back to file - replace existing frontmatter with Windows line ending support
          const newFrontmatter = stringify(frontmatter)
          const newContent = content.replace(
            /^---\r?\n[\s\S]*?\r?\n---\r?\n/,
            `---\n${newFrontmatter}---\n`
          )
          writeFileSync(filePath, newContent, 'utf-8')
          updatedCount++
        }

      } catch (error: any) {
        errors.push({
          file: filePath.replace(contentDir, ''),
          error: error.message
        })
      }
    }

    // console.log(`[Bulk Update] Result: ${updatedCount} updated, ${filteredCount} matched filters, ${files.length} total`)
    // console.log(`[Bulk Update] Files without frontmatter: ${filesWithoutFrontmatter}`)
    // console.log(`[Bulk Update] Files with parse errors: ${filesWithParseError}`)
    // console.log(`[Bulk Update] Files successfully parsed: ${files.length - filesWithoutFrontmatter - filesWithParseError}`)
    
    return {
      success: true,
      message: `Updated ${updatedCount} file(s)`,
      updatedCount,
      totalFiles: files.length,
      filteredCount,
      errors: errors.length > 0 ? errors : undefined
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Bulk update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to perform bulk update'
    })
  }
})

