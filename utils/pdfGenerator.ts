import jsPDF from 'jspdf'

interface SummaryData {
  summary: string
  keyPoints: string[]
  concepts: string[]
  takeaways: string[]
  estimatedReadTime: number
}

interface QuizResult {
  questionId: string
  answers: string[]
  isCorrect: boolean
}

interface QuizQuestion {
  id: string
  type: string
  question: string
  options?: string[]
  correctAnswers: string[] | boolean[]
  explanation: string
  difficulty: string
}

export interface SystemDesignEval {
  grade: string
  totalScore: number
  maxScore: number
  summary: string
  designType?: 'LLD' | 'HLD' | 'Both'   // passed through from caller
  breakdown: Array<{
    section: string
    score: number
    maxScore: number
    feedback: string
    improvements?: string[]
  }>
  keyTakeaways: string[]
  modelSolution?: {
    sections: Array<{ heading: string; content: string }>
  }
}

interface BrandConfig {
  primaryColor: [number, number, number]
  secondaryColor: [number, number, number]
  accentColor: [number, number, number]
  logoText: string
  website: string
  logoUrl: string
}

const brandConfig: BrandConfig = {
  primaryColor: [239, 68, 68], // red-500
  secondaryColor: [236, 72, 153], // pink-500  
  accentColor: [75, 85, 99], // zinc-600
  logoText: 'Rahul Aher',
  website: 'rahulaher.netlify.app',
  logoUrl: '/img/logo/glyph-and-word-black-colored.svg' // Your profile image as logo
}

class PDFGenerator {
  private doc: jsPDF
  private currentY: number = 20
  private pageWidth: number
  private pageHeight: number
  private margin: number = 20
  private logoDataUrl: string = ''

  constructor() {
    this.doc = new jsPDF()
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
  }

  private async loadLogo(): Promise<void> {
    try {
      // Create a temporary image element to load the logo
      const img = new Image()
      img.crossOrigin = 'anonymous'

      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Create canvas to convert image to data URL
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Set canvas size
          canvas.width = img.width
          canvas.height = img.height

          // Draw image on canvas
          ctx?.drawImage(img, 0, 0)

          // Get data URL
          this.logoDataUrl = canvas.toDataURL('image/png')
          resolve()
        }

        img.onerror = () => {
          console.warn('Could not load logo image')
          resolve() // Continue without logo
        }

        // Load the logo from your public directory
        img.src = brandConfig.logoUrl
      })
    } catch (error) {
      console.warn('Error loading logo:', error)
    }
  }

  private addWatermark() {
    if (!this.logoDataUrl) return

    // Add logo as watermark in center background
    const logoSize = 80
    const centerX = this.pageWidth / 2 - logoSize / 2
    const centerY = this.pageHeight / 2 - logoSize / 2

    // Set transparency for watermark
    this.doc.setGState(this.doc.GState({ opacity: 0.04 }))

    try {
      this.doc.addImage(
        this.logoDataUrl,
        'PNG',
        centerX,
        centerY,
        logoSize,
        logoSize
      )
    } catch (error) {
      console.warn('Error adding watermark:', error)
    }

    // Reset opacity
    this.doc.setGState(this.doc.GState({ opacity: 1 }))
  }

  private addHeader(title: string, subtitle?: string) {
    // Add watermark first (behind everything)
    this.addWatermark()

    // Brand banner
    this.doc.setFillColor(...brandConfig.primaryColor)
    this.doc.rect(0, 0, this.pageWidth, 30, 'F')

    // Add logo in header if available
    if (this.logoDataUrl) {
      try {
        this.doc.addImage(
          this.logoDataUrl,
          'PNG',
          this.margin,
          5,
          20,
          20
        )
      } catch (error) {
        console.warn('Error adding header logo:', error)
      }
    }

    // Logo/Brand text (moved right to accommodate logo)
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(16)
    this.doc.text(brandConfig.logoText, this.logoDataUrl ? this.margin + 25 : this.margin, 18)

    // Website
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.doc.text(brandConfig.website, this.pageWidth - this.margin - 50, 18)

    // Title
    this.currentY = 45
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(20)
    this.doc.text(title, this.margin, this.currentY)

    if (subtitle) {
      this.currentY += 10
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(12)
      this.doc.setTextColor(100, 100, 100)
      this.doc.text(subtitle, this.margin, this.currentY)
    }

    this.currentY += 20
  }

  private addSection(title: string, content: string | string[], isListItems = false) {
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 60) {
      this.doc.addPage()
      // Add watermark to new page
      this.addWatermark()
      this.currentY = 20
    }

    // Section title
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(14)
    this.doc.setTextColor(...brandConfig.primaryColor)
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += 15

    // Section content
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(11)
    this.doc.setTextColor(0, 0, 0)

    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        if (this.currentY > this.pageHeight - 30) {
          this.doc.addPage()
          this.addWatermark()
          this.currentY = 20
        }

        const prefix = isListItems ? `${index + 1}. ` : '• '
        const lines = this.doc.splitTextToSize(`${prefix}${item}`, this.pageWidth - 2 * this.margin)

        lines.forEach((line: string) => {
          this.doc.text(line, this.margin, this.currentY)
          this.currentY += 6
        })
        this.currentY += 2
      })
    } else {
      // Standardize newlines and remove excessive gaps
      const cleanedContent = content.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n')
      const lines = cleanedContent.split('\n')
      let inTable = false
      let tableRows: string[][] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Skip horizontal lines or strictly dashed lines
        if (/^[-*_]{3,}$/.test(line)) continue
        if (!line && !inTable) {
          this.currentY += 2
          continue
        }

        // Detect Table Start
        if (line.startsWith('|') && line.endsWith('|')) {
          if (!inTable) {
            inTable = true
            tableRows = []
          }
          // Skip divider rows like |---|---|
          if (!line.includes('---')) {
            const cells = line.split('|').map(c => c.trim()).filter(c => c !== '')
            tableRows.push(cells)
          }

          // If next line is not a table line, or it's the last line, render the table
          const nextLine = lines[i + 1]?.trim()
          if (!nextLine || !nextLine.startsWith('|')) {
            this.renderTable(tableRows)
            inTable = false
          }
          continue
        }

        if (inTable) continue

        // Detect Code Block
        if (line.startsWith('```')) {
          let codeBlockContent = []
          i++ // skip opening ```
          while (i < lines.length && !lines[i].trim().startsWith('```')) {
            codeBlockContent.push(lines[i])
            i++
          }
          this.renderCodeBlock(codeBlockContent.join('\n'))
          continue
        }

        // Regular Text with Markdown bold awareness (**text**)
        this.renderFormattedText(line)
      }
    }

    this.currentY += 10
  }

  private renderTable(rows: string[][]) {
    if (rows.length === 0) return

    const colWidth = (this.pageWidth - 2 * this.margin) / rows[0].length
    const rowHeight = 8

    rows.forEach((row, rowIndex) => {
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.addWatermark()
        this.currentY = 20
      }

      // Background for header
      if (rowIndex === 0) {
        this.doc.setFillColor(245, 245, 245)
        this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, rowHeight, 'F')
        this.doc.setFont('helvetica', 'bold')
      } else {
        this.doc.setFont('helvetica', 'normal')
      }

      this.doc.setDrawColor(230, 230, 230)
      this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, rowHeight, 'D')

      row.forEach((cell, colIndex) => {
        const x = this.margin + (colIndex * colWidth) + 2
        this.doc.text(this.doc.splitTextToSize(cell, colWidth - 4)[0] || '', x, this.currentY)
      })

      this.currentY += rowHeight
    })

    this.currentY += 5
  }

  private renderCodeBlock(code: string) {
    const trimmedCode = code.trim()
    const codeLines = trimmedCode.split('\n')
    this.doc.setFont('courier', 'normal')
    this.doc.setFontSize(8.5)
    this.doc.setTextColor(230, 230, 230)

    const lineHeight = 4.5

    // If we are at the bottom of a page, move to next
    if (this.currentY > this.pageHeight - 30) {
      this.doc.addPage()
      this.addWatermark()
      this.currentY = 20
    }

    // Process each line. We'll draw background line-by-line to handle page breaks perfectly.
    codeLines.forEach(line => {
      const splitLines = this.doc.splitTextToSize(line, this.pageWidth - 2 * this.margin - 10)

      splitLines.forEach((sl: string) => {
        // Page break check
        if (this.currentY > this.pageHeight - 15) {
          this.doc.addPage()
          this.addWatermark()
          this.currentY = 20
        }

        // Draw background for this specific line
        this.doc.setFillColor(28, 28, 28)
        // Draw slightly taller rect to avoid gaps between lines
        this.doc.rect(this.margin - 1, this.currentY - 4, this.pageWidth - 2 * this.margin + 2, lineHeight + 0.5, 'F')

        // Render text
        this.doc.text(sl, this.margin + 2, this.currentY)
        this.currentY += lineHeight
      })
    })

    // Cleanup formatting
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(11)
    this.currentY += 8
  }

  private renderFormattedText(text: string) {
    let trimmed = text.trim()
    if (!trimmed) {
      this.currentY += 4
      return
    }

    // Capture initial formatting
    let isBold = false
    let isHeader = false
    let isBullet = false
    let fontSize = 10.5
    let textColor = [0, 0, 0]
    let bulletChar = ''

    // 1. Detect Markdown Structure
    if (trimmed.startsWith('###')) {
      isBold = true
      isHeader = true
      fontSize = 11.5
      textColor = brandConfig.primaryColor
      trimmed = trimmed.replace(/^###\s*/, '')
    } else if (trimmed.startsWith('##')) {
      isBold = true
      isHeader = true
      fontSize = 13.5
      textColor = brandConfig.primaryColor
      trimmed = trimmed.replace(/^##\s*/, '')
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      isBullet = true
      bulletChar = '•'
      trimmed = trimmed.replace(/^[-*]\s*/, '')
    } else if (trimmed.match(/^\d+\.\s/)) {
      isBullet = true
      const match = trimmed.match(/^(\d+\.)\s/)
      bulletChar = match ? match[1] : '•'
      trimmed = trimmed.replace(/^\d+\.\s*/, '')
    }

    // 2. Secondary Style Application (Inline Bold for the whole line)
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      isBold = true
      trimmed = trimmed.replace(/\*\*/g, '')
    } else {
      // Clean up any other inline bold marks for the PDF
      trimmed = trimmed.replace(/\*\*/g, '')
    }

    // 3. Render
    this.doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    this.doc.setFontSize(fontSize)
    this.doc.setTextColor(textColor[0], textColor[1], textColor[2])

    const xOffset = isBullet ? 6 : 0
    const lines = this.doc.splitTextToSize(trimmed, this.pageWidth - 2 * this.margin - xOffset)

    lines.forEach((line: string, index: number) => {
      // Page break check
      if (this.currentY > this.pageHeight - 20) {
        this.doc.addPage()
        this.addWatermark()
        this.currentY = 20
      }

      // Draw bullet if needed
      if (isBullet && index === 0) {
        this.doc.setFont('helvetica', 'bold')
        this.doc.text(bulletChar, this.margin + 2, this.currentY)
        this.doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      }

      this.doc.text(line, this.margin + xOffset, this.currentY)
      this.currentY += isHeader ? 7 : 6
    })

    // Spacing between paragraphs/elements
    this.currentY += 2

    // Reset properties for next call
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(11)
    this.doc.setTextColor(0, 0, 0)
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)

      // Add watermark to each page if not already added
      if (i > 1) {
        this.addWatermark()
      }

      // Footer line
      this.doc.setDrawColor(...brandConfig.accentColor)
      this.doc.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15)

      // Generated timestamp
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(8)
      this.doc.setTextColor(100, 100, 100)
      const timestamp = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      this.doc.text(`Generated on ${timestamp}`, this.margin, this.pageHeight - 8)

      // Page number
      this.doc.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin - 20, this.pageHeight - 8)
    }
  }

  async generateSummaryPDF(topicTitle: string, summaryData: SummaryData): Promise<string> {
    // Load logo first
    await this.loadLogo()

    this.addHeader('AI Generated Summary', topicTitle)

    // Reading time info
    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(10)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`Estimated reading time: ${summaryData.estimatedReadTime} minutes`, this.margin, this.currentY)
    this.currentY += 15

    // Summary
    this.addSection('Executive Summary', summaryData.summary)

    // Key Points
    this.addSection('Key Points', summaryData.keyPoints, true)

    // Core Concepts
    this.addSection('Core Concepts', summaryData.concepts)

    // Key Takeaways
    this.addSection('Key Takeaways', summaryData.takeaways)

    // Add footer
    this.addFooter()

    return this.doc.output('datauristring')
  }

  async generateQuizAnalysisPDF(
    topicTitle: string,
    questions: QuizQuestion[],
    userAnswers: QuizResult[],
    score: number
  ): Promise<string> {
    // Load logo first
    await this.loadLogo()

    this.addHeader('Quiz Analysis Report', topicTitle)

    // Score summary
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length
    const totalQuestions = userAnswers.length

    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(16)
    this.doc.setTextColor(...brandConfig.primaryColor)
    this.doc.text(`Final Score: ${score}%`, this.margin, this.currentY)

    this.currentY += 10
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(12)
    this.doc.setTextColor(0, 0, 0)
    this.doc.text(`${correctAnswers} out of ${totalQuestions} questions answered correctly`, this.margin, this.currentY)
    this.currentY += 20

    // Performance analysis
    let performanceText = ''
    if (score >= 90) performanceText = 'Excellent! You have mastered this topic.'
    else if (score >= 80) performanceText = 'Great job! You have a strong understanding of this topic.'
    else if (score >= 70) performanceText = 'Good work! Consider reviewing some concepts for better understanding.'
    else if (score >= 60) performanceText = 'Fair performance. We recommend reviewing the material again.'
    else performanceText = 'Consider spending more time with the material before retaking the quiz.'

    this.addSection('Performance Analysis', performanceText)

    // Question breakdown
    questions.forEach((question, index) => {
      if (this.currentY > this.pageHeight - 80) {
        this.doc.addPage()
        // Add watermark to new page
        this.addWatermark()
        this.currentY = 20
      }

      const userAnswer = userAnswers[index]
      const isCorrect = userAnswer?.isCorrect || false

      // Question header
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(12)
      this.doc.setTextColor(0, 0, 0)
      this.doc.text(`Question ${index + 1} (${question.difficulty}) - ${isCorrect ? 'Correct' : 'Incorrect'}`, this.margin, this.currentY)
      this.currentY += 10

      // Question text
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(11)
      const questionLines = this.doc.splitTextToSize(question.question, this.pageWidth - 2 * this.margin)
      questionLines.forEach((line: string) => {
        this.doc.text(line, this.margin, this.currentY)
        this.currentY += 6
      })
      this.currentY += 5

      // User's answer
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.doc.setTextColor(isCorrect ? 0 : 200, isCorrect ? 150 : 0, 0)
      this.doc.text('Your Answer:', this.margin, this.currentY)
      this.currentY += 5

      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(0, 0, 0)
      const userAnswerText = userAnswer?.answers.join(', ') || 'No answer provided'
      this.doc.text(userAnswerText, this.margin + 5, this.currentY)
      this.currentY += 8

      // Correct answer
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.doc.setTextColor(0, 150, 0)
      this.doc.text('Correct Answer:', this.margin, this.currentY)
      this.currentY += 5

      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(0, 0, 0)
      const correctAnswerText = Array.isArray(question.correctAnswers)
        ? question.correctAnswers.join(', ')
        : String(question.correctAnswers)
      this.doc.text(correctAnswerText, this.margin + 5, this.currentY)
      this.currentY += 8

      // Explanation
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(10)
      this.doc.setTextColor(...brandConfig.primaryColor)
      this.doc.text('Explanation:', this.margin, this.currentY)
      this.currentY += 5

      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(10)
      this.doc.setTextColor(0, 0, 0)
      const explanationLines = this.doc.splitTextToSize(question.explanation, this.pageWidth - 2 * this.margin)
      explanationLines.forEach((line: string) => {
        if (this.currentY > this.pageHeight - 20) {
          this.doc.addPage()
          // Add watermark to new page
          this.addWatermark()
          this.currentY = 20
        }
        this.doc.text(line, this.margin + 5, this.currentY)
        this.currentY += 5
      })
      this.currentY += 15
    })

    // Add footer
    this.addFooter()

    return this.doc.output('datauristring')
  }

  // ── LLD Report ────────────────────────────────────────────────────────────
  async generateLLDReportPDF(title: string, evaluation: SystemDesignEval): Promise<string> {
    await this.loadLogo()
    this.addHeader('LLD Engineering Audit', title)

    // Grade + Score banner
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(24)
    this.doc.setTextColor(...brandConfig.primaryColor)
    this.doc.text(evaluation.grade, this.margin, this.currentY)
    this.doc.setFontSize(16)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`${evaluation.totalScore} / ${evaluation.maxScore}`, this.margin + 22, this.currentY)
    this.currentY += 8

    // Interview type tag
    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(10)
    this.doc.setTextColor(120, 120, 120)
    this.doc.text('Low-Level Design (LLD) Interview Report', this.margin, this.currentY)
    this.currentY += 14

    // Overall Summary
    this.addSection('Overall Summary', evaluation.summary)

    // Stage-by-stage breakdown with rich descriptions
    const stageDescriptions: Record<string, string> = {
      'Requirements Gathering': 'Evaluates the candidate\'s ability to extract precise functional and non-functional requirements, define scope, and articulate constraints for the low-level system.',
      'Core Entity Identification': 'Assesses the candidate\'s domain modeling skills — identifying the right domain objects, their responsibilities, and ensuring single-responsibility principles.',
      'Class Design & OOP': 'Reviews the class hierarchy, OOP principle adherence (SOLID), use of design patterns, and the quality of relationships (inheritance vs composition).',
      'Code Implementation': 'Audits the actual implementation for correctness, clean code practices, enterprise-grade error handling, testability, and alignment with the class design.',
    }

    // LLD expected stage order
    const lldOrder = ['Requirements Gathering', 'Core Entity Identification', 'Class Design & OOP', 'Code Implementation']
    const sortedBreakdown = [...evaluation.breakdown].sort((a, b) => {
      const ai = lldOrder.findIndex(s => a.section.includes(s.replace('1. ', '').replace('2. ', '').replace('3. ', '').replace('4. ', '')))
      const bi = lldOrder.findIndex(s => b.section.includes(s.replace('1. ', '').replace('2. ', '').replace('3. ', '').replace('4. ', '')))
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

    this.addSection('Stage-by-Stage Evaluation', '')
    sortedBreakdown.forEach((section, idx) => {
      const descKey = Object.keys(stageDescriptions).find(k => section.section.includes(k)) || ''
      const desc = stageDescriptions[descKey] || ''
      const lines = [
        `Stage ${idx + 1}: ${section.section}`,
        `Score: ${section.score} / ${section.maxScore}`,
        desc ? `About: ${desc}` : '',
        `Feedback: ${section.feedback}`,
        ...(section.improvements?.length ? ['Areas to Improve:', ...section.improvements.map(i => `  • ${i}`)] : []),
      ].filter(Boolean)
      this.addSection(section.section, lines)
    })

    // Key Takeaways
    if (evaluation.keyTakeaways?.length) {
      this.addSection('Key Takeaways & Learning Points', evaluation.keyTakeaways)
    }

    // Model Solution
    if (evaluation.modelSolution?.sections?.length) {
      this.addSection('Masterpiece Model Solution', 'The following is an expert-level reference solution showing how a senior/staff engineer would approach this LLD problem:')
      evaluation.modelSolution.sections.forEach(sec => {
        this.addSection(sec.heading, sec.content)
      })
    }

    this.addFooter()
    return this.doc.output('datauristring')
  }

  // ── HLD Report ────────────────────────────────────────────────────────────
  async generateHLDReportPDF(title: string, evaluation: SystemDesignEval): Promise<string> {
    await this.loadLogo()
    this.addHeader('HLD Engineering Audit', title)

    // Grade + Score banner
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(24)
    this.doc.setTextColor(...brandConfig.primaryColor)
    this.doc.text(evaluation.grade, this.margin, this.currentY)
    this.doc.setFontSize(16)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`${evaluation.totalScore} / ${evaluation.maxScore}`, this.margin + 22, this.currentY)
    this.currentY += 8

    // Interview type tag
    this.doc.setFont('helvetica', 'italic')
    this.doc.setFontSize(10)
    this.doc.setTextColor(120, 120, 120)
    this.doc.text('High-Level Design (HLD) Interview Report', this.margin, this.currentY)
    this.currentY += 14

    // Overall Summary
    this.addSection('Overall Summary', evaluation.summary)

    // Stage descriptions specific to HLD
    const hldStageDescriptions: Record<string, string> = {
      '1. Requirements Gathering': 'Evaluates the candidate\'s ability to define functional features (user flows, APIs) and non-functional requirements (scalability, availability, latency targets) for a distributed system at scale.',
      '2. API Design': 'Assesses RESTful API design quality — endpoint naming, HTTP method usage, versioning, request/response contract clarity, and alignment with the system\'s functional requirements.',
      '3. High-Level Design': 'Reviews the overall system blueprint — presence of critical components (Load Balancer, API Gateway, Services, Cache, DB, Message Queue), data flow correctness, and CAP theorem trade-off decisions.',
      '4. Database Design': 'Audits the storage strategy — SQL vs NoSQL justification, schema design, indexing strategy, sharding/replication approach, and alignment with read/write access patterns.',
      '5. Deep Dive 1 - Caching Strategy': 'Evaluates the caching layer design — cache topology (CDN, reverse proxy, application cache), eviction policies, cache invalidation strategies, and handling of cache stampedes or cold starts.',
      '6. Deep Dive 2 - Click Count Analytics': 'Assesses the real-time analytics pipeline design — event ingestion strategy, aggregation approaches (count-min sketch, HyperLogLog, batch vs stream), storage choices, and query efficiency at scale.',
    }

    // HLD expected stage order — must match labels returned by the API exactly
    const hldOrder = [
      '1. Requirements Gathering',
      '2. API Design',
      '3. High-Level Design',
      '4. Database Design',
      '5. Deep Dive 1 - Caching Strategy',
      '6. Deep Dive 2 - Click Count Analytics',
    ]

    const sortedBreakdown = [...evaluation.breakdown].sort((a, b) => {
      const ai = hldOrder.findIndex(s => a.section.toLowerCase().includes(s.toLowerCase().replace(/^\d+\.\s*/, '').substring(0, 12)))
      const bi = hldOrder.findIndex(s => b.section.toLowerCase().includes(s.toLowerCase().replace(/^\d+\.\s*/, '').substring(0, 12)))
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })

    this.addSection('Stage-by-Stage Evaluation', '')
    sortedBreakdown.forEach((section) => {
      const descKey = Object.keys(hldStageDescriptions).find(k =>
        section.section.toLowerCase().includes(k.toLowerCase().replace(/^\d+\.\s*/, '').substring(0, 12))
      ) || ''
      const desc = hldStageDescriptions[descKey] || ''
      const lines = [
        `Score: ${section.score} / ${section.maxScore}`,
        desc ? `Stage Overview: ${desc}` : '',
        `Interviewer Feedback: ${section.feedback}`,
        ...(section.improvements?.length ? ['Improvement Areas:', ...section.improvements.map(i => `  • ${i}`)] : []),
      ].filter(Boolean)
      this.addSection(section.section, lines)
    })

    // Key Takeaways
    if (evaluation.keyTakeaways?.length) {
      this.addSection('Key Takeaways & Learning Points', evaluation.keyTakeaways)
    }

    // Model Solution
    if (evaluation.modelSolution?.sections?.length) {
      this.addSection('Reference Architecture — Model Solution', 'The following is a senior engineer\'s reference solution demonstrating ideal HLD decisions, trade-offs, and component choices for this problem:')
      evaluation.modelSolution.sections.forEach(sec => {
        this.addSection(sec.heading, sec.content)
      })
    }

    this.addFooter()
    return this.doc.output('datauristring')
  }
} // end PDFGenerator class


export async function downloadSummaryPDF(topicTitle: string, summaryData: SummaryData) {
  try {
    const generator = new PDFGenerator()
    const pdfDataUri = await generator.generateSummaryPDF(topicTitle, summaryData)

    const fileName = `${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}_AI_Summary.pdf`

    // Better mobile browser support
    if (typeof window !== 'undefined') {
      // For mobile devices - try different approaches
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        // For mobile: Try to open in new tab if download doesn't work
        const blob = dataURItoBlob(pdfDataUri)
        const url = URL.createObjectURL(blob)

        // Try programmatic download first
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)

        // Add event listeners to handle success/failure
        const cleanup = () => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }

        try {
          link.click()
          setTimeout(cleanup, 1000)
        } catch (e) {
          // Fallback: Open in new tab
          window.open(url, '_blank')
          cleanup()
        }
      } else {
        // Desktop: Standard approach
        const link = document.createElement('a')
        link.href = pdfDataUri
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  } catch (error) {
    console.error('Error downloading PDF:', error)
    throw error
  }
}

// Helper function to convert data URI to blob
function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type: mimeString })
}

export async function downloadQuizAnalysisPDF(
  topicTitle: string,
  questions: QuizQuestion[],
  userAnswers: QuizResult[],
  score: number
) {
  try {
    const generator = new PDFGenerator()
    const pdfDataUri = await generator.generateQuizAnalysisPDF(topicTitle, questions, userAnswers, score)

    const fileName = `${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Quiz_Analysis.pdf`

    // Better mobile browser support
    if (typeof window !== 'undefined') {
      // For mobile devices - try different approaches
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        // For mobile: Try to open in new tab if download doesn't work
        const blob = dataURItoBlob(pdfDataUri)
        const url = URL.createObjectURL(blob)

        // Try programmatic download first
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)

        // Add event listeners to handle success/failure
        const cleanup = () => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }

        try {
          link.click()
          setTimeout(cleanup, 1000)
        } catch (e) {
          // Fallback: Open in new tab
          window.open(url, '_blank')
          cleanup()
        }
      } else {
        // Desktop: Standard approach
        const link = document.createElement('a')
        link.href = pdfDataUri
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  } catch (error) {
    console.error('Error downloading quiz analysis PDF:', error)
    throw error
  }
}

export async function downloadSystemDesignPDF(
  title: string,
  evaluation: SystemDesignEval,
  designType: 'LLD' | 'HLD' | 'Both' = 'LLD'
) {
  try {
    const generator = new PDFGenerator()
    const isHLD = designType === 'HLD' || designType === 'Both'
    const pdfDataUri = isHLD
      ? await generator.generateHLDReportPDF(title, evaluation)
      : await generator.generateLLDReportPDF(title, evaluation)

    const reportLabel = isHLD ? 'HLD_Audit' : 'LLD_Audit'
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${reportLabel}.pdf`

    if (typeof window !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobile) {
        const blob = dataURItoBlob(pdfDataUri)
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        try {
          link.click()
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 1000)
        } catch (e) {
          window.open(url, '_blank')
        }
      } else {
        const link = document.createElement('a')
        link.href = pdfDataUri
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  } catch (error) {
    console.error('Error downloading system design PDF:', error)
    throw error
  }
}
