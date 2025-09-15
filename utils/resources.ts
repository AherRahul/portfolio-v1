export interface ResourceItem {
  title: string
  type: 'video' | 'article' | 'documentation' | 'tool' | 'book' | 'course'
  url: string
  description?: string
  duration?: string
  author?: string
}

export function parseResourcesFromContent(content: string): ResourceItem[] {
  const resources: ResourceItem[] = []
  
  // Look for the resources section in markdown
  const resourcesMatch = content.match(/## 🔗 Learning Resources\s*([\s\S]*?)(?=\n##|$)/i)
  if (!resourcesMatch) return resources

  const resourcesContent = resourcesMatch[1]
  
  // Parse different sections
  const sections = resourcesContent.split(/### ([^#\n]+)/g)
  
  for (let i = 1; i < sections.length; i += 2) {
    const sectionTitle = sections[i].trim()
    const sectionContent = sections[i + 1]
    
    // Extract links from markdown format
    const linkRegex = /- \*\*\[([^\]]+)\]\(([^)]+)\)\*\* - ([^\n]+)/g
    let match
    
    while ((match = linkRegex.exec(sectionContent)) !== null) {
      const [, title, url, description] = match
      
      // Determine type based on section
      let type: ResourceItem['type'] = 'article'
      const sectionLower = sectionTitle.toLowerCase()
      
      if (sectionLower.includes('video')) type = 'video'
      else if (sectionLower.includes('documentation')) type = 'documentation'
      else if (sectionLower.includes('tool')) type = 'tool'
      else if (sectionLower.includes('book')) type = 'book'
      else if (sectionLower.includes('course') || sectionLower.includes('interactive')) type = 'course'
      
      // Extract duration if present
      const durationMatch = description.match(/(\d+\.?\d*\s*(?:hour|hr|min|minute)s?)/i)
      const duration = durationMatch ? durationMatch[1] : undefined
      
      // Extract author if present
      const authorMatch = description.match(/by\s+([^-]+)/i)
      const author = authorMatch ? authorMatch[1].trim() : undefined
      
      resources.push({
        title: title.trim(),
        type,
        url: url.trim(),
        description: description.trim(),
        duration,
        author
      })
    }
  }
  
  return resources
}
