import { writeFileSync, mkdirSync } from 'fs'
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
    const { courseSlug, moduleId, topicId, topic } = body
    
    if (!courseSlug || !moduleId || !topicId || !topic) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Course slug, module ID, topic ID, and topic data are required'
      })
    }
    
    // Build paths
    const contentDir = normalize(join(process.cwd(), 'content'))
    const articlesDir = normalize(join(contentDir, 'articles'))
    const courseArticlesDir = normalize(join(articlesDir, courseSlug))
    
    // Topic file path
    const topicFileName = `${topic._path}.md`
    const topicFilePath = normalize(join(courseArticlesDir, topicFileName))
    
    // Security check
    if (!topicFilePath.startsWith(articlesDir)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
    
    // Ensure directory exists
    mkdirSync(courseArticlesDir, { recursive: true })
    
    // Check if file already exists
    try {
      const { readFileSync } = await import('fs')
      readFileSync(topicFilePath, 'utf-8')
      // File exists, don't overwrite
      return {
        success: true,
        message: 'Topic file already exists',
        path: topicFilePath
      }
    } catch {
      // File doesn't exist, create it
    }
    
    // Get course title for default content
    let courseTitle = 'Course'
    try {
      const coursesDir = normalize(join(contentDir, 'courses'))
      const courseFilePath = normalize(join(coursesDir, `${courseSlug}.md`))
      const { readFileSync } = await import('fs')
      const courseContent = readFileSync(courseFilePath, 'utf-8')
      const frontmatterMatch = courseContent.match(/^---\s*\n([\s\S]*?)\n\s*---/)
      if (frontmatterMatch) {
        const { parse } = await import('yaml')
        const frontmatter = parse(frontmatterMatch[1].trim())
        courseTitle = frontmatter.title || courseTitle
      }
    } catch {
      // Use default course title
    }
    
    // Generate topic article file content
    const topicContent = `---
title: ${topic.topic_name ? `"${topic.topic_name.replace(/"/g, '\\"')}"` : '""'}
description: ${topic.description ? `"${topic.description.replace(/"/g, '\\"')}"` : '""'}
datePublished: ${topic.publish_date || new Date().toISOString().split('T')[0]}
dateModified: ${topic.publish_date || new Date().toISOString().split('T')[0]}
topics:
${(topic.topics || ['javascript']).map((t: string) => `  - ${t}`).join('\n')}
courseName: ${courseSlug}
showOnArticles: false
featured: false
---

# ${topic.topic_name || 'Topic'}

${topic.description || `Welcome to ${topic.topic_name || 'this topic'}.`}

## Overview

${topic.description || `This lesson covers the fundamentals of ${topic.topic_name || 'this topic'}.`}

## Learning Objectives

By the end of this lesson, you will:

- Understand the key concepts
- Be familiar with the terminology
- Have a foundation for advanced topics

## Getting Started

Let's begin our exploration of ${topic.topic_name || 'this topic'}.

## Key Concepts

### Concept 1

Explain the first key concept here.

### Concept 2

Explain the second key concept here.

## Examples

### Example 1

Provide practical examples here.

## Summary

In this lesson, we've covered the basics of ${topic.topic_name || 'this topic'}. 

## Next Steps

- Review the concepts covered
- Complete any exercises
- Move on to the next lesson
`
    
    // Write topic article file
    writeFileSync(topicFilePath, topicContent, 'utf-8')
    
    return {
      success: true,
      message: 'Topic file created successfully',
      path: topicFileName,
      fullPath: topicFilePath
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Topic creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create topic file'
    })
  }
})

