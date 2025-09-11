import { format } from 'date-fns'

export function formatDateStringToHumanReadable(date?: string) {
  try {
    if (!date) return ''
    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) return ''
    return format(parsed, 'MMMM d, yyyy')
  } catch {
    return ''
  }
}