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
    const { fileName, title, description } = body
    
    if (!fileName || !title || !description) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File name, title, and description are required'
      })
    }
    
    // Validate and sanitize file name (slug)
    const slug = fileName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file name'
      })
    }
    
    // Remove priority number from slug for topic file naming
    const cleanSlug = slug.replace(/^\d+-/, '')
    
    const courseFileName = slug.endsWith('.md') ? slug : `${slug}.md`
    const today = new Date().toISOString().split('T')[0]
    
    // Build paths
    const contentDir = normalize(join(process.cwd(), 'content'))
    const coursesDir = normalize(join(contentDir, 'courses'))
    const articlesDir = normalize(join(contentDir, 'articles'))
    
    // Course file path
    const courseFilePath = normalize(join(coursesDir, courseFileName))
    
    // Articles folder path
    const articlesFolderPath = normalize(join(articlesDir, slug))
    
    // Security check - ensure paths are within content directory
    if (!courseFilePath.startsWith(coursesDir) || !articlesFolderPath.startsWith(articlesDir)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
    
    // Create articles folder
    mkdirSync(articlesFolderPath, { recursive: true })
    
    // Generate course file content
    const courseContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
tutor: 1
time: "1hr"
video: false
topics:
  - javascript
content:
  - module_id: 1
    module_name: Get Started
    module_duration: "10 mins read"
    topics_count: 1
    tutor: 1
    expanded: false
    topics:
      - id: 1
        topic_name: Introduction
        sub_topic: "${title.replace(/"/g, '\\"')}"
        publish_date: ${today}
        description: >
          ${description.replace(/"/g, '\\"')}
        topics:
          - javascript
        duration: "10:00 mins read"
        photo_url: ""
        auther_name: Rahul Aher
        is_on_youtube: false
        _path: ${cleanSlug}-1-1
---
# ${title}

${description}

## Course Overview

This course will guide you through the fundamentals and advanced concepts.

## What You'll Learn

- Core concepts and principles
- Practical examples and exercises
- Best practices and patterns

## Prerequisites

- Basic programming knowledge
- Willingness to learn

## Course Structure

This course is organized into modules, each building upon the previous one.

Let's get started!
`
    
    // Generate first topic article file (without priority number)
    const topicFileName = `${cleanSlug}-1-1.md`
    const topicFilePath = normalize(join(articlesFolderPath, topicFileName))
    
    const topicContent = `---
title: Introduction
description: ${description.replace(/"/g, '\\"')}
datePublished: ${today}
dateModified: ${today}
topics:
  - javascript
courseName: ${slug}
showOnArticles: false
featured: false
---

# Introduction

${description}

## Overview

Welcome to the first lesson of ${title}. In this module, we'll cover the fundamental concepts you need to get started.

## Learning Objectives

By the end of this lesson, you will:

- Understand the basic concepts
- Be familiar with the key terminology
- Have a foundation for the rest of the course

## Getting Started

Let's begin our journey into ${title}.

## Key Concepts

### Concept 1

Explain the first key concept here.

### Concept 2

Explain the second key concept here.

## Summary

In this lesson, we've covered the basics. In the next lesson, we'll dive deeper into the advanced topics.

## Next Steps

- Review the concepts covered
- Complete any exercises
- Move on to the next lesson
`
    
    // Write course file
    writeFileSync(courseFilePath, courseContent, 'utf-8')
    
    // Write topic article file
    writeFileSync(topicFilePath, topicContent, 'utf-8')
    
    return {
      success: true,
      message: 'Course created successfully',
      course: {
        fileName: courseFileName,
        title,
        description,
        slug,
        topicFile: topicFileName
      }
    }
    
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Course creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create course'
    })
  }
})

