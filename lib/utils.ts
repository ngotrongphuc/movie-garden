import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names, resolving Tailwind conflicts.
 * Accepts anything clsx does.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a number of downloads as a short, readable string.
 * 1234567 -> "1.2M", 12345 -> "12.3K", 42 -> "42"
 */
export function formatCompactNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '0'
  if (value < 1000) return String(value)
  if (value < 1_000_000) return `${(value / 1000).toFixed(1).replace('.0', '')}K`
  if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(1).replace('.0', '')}M`
  return `${(value / 1_000_000_000).toFixed(1).replace('.0', '')}B`
}

/**
 * Parse an Internet Archive runtime string into seconds.
 * Accepts "1:17:26", "20:33", "45 min", "2700".
 * Returns null if unparseable.
 */
export function parseRuntimeToSeconds(runtime: string | undefined): number | null {
  if (!runtime) return null
  const trimmed = runtime.trim()
  if (/^\d+$/.test(trimmed)) return Number(trimmed)
  const colonMatch = trimmed.match(/^(\d+):(\d+)(?::(\d+))?$/)
  if (colonMatch) {
    const [, a, b, c] = colonMatch
    if (c !== undefined) {
      return Number(a) * 3600 + Number(b) * 60 + Number(c)
    }
    return Number(a) * 60 + Number(b)
  }
  const minMatch = trimmed.match(/(\d+)\s*min/i)
  if (minMatch) return Number(minMatch[1]) * 60
  return null
}

/**
 * Format a duration in seconds as "1h 23m" or "45m".
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return ''
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours === 0) return `${mins}m`
  return `${hours}h ${mins}m`
}

/**
 * Extract a 4-digit year from a year string or a full ISO date.
 * Returns null if no plausible year is found.
 */
export function parseYear(value: string | number | undefined | null): number | null {
  if (value === undefined || value === null) return null
  const str = String(value)
  const match = str.match(/\d{4}/)
  if (!match) return null
  const n = Number(match[0])
  if (n < 1800 || n > 2100) return null
  return n
}

/**
 * Clean description text — strip HTML tags and normalize whitespace.
 */
export function stripHtml(html: string | undefined): string {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Coerce a value that might be a string, number, or array (from archive.org
 * loose JSON) into a safe single string.
 */
export function coerceString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  if (Array.isArray(value)) return value.length > 0 ? String(value[0]) : undefined
  return String(value)
}

/**
 * Coerce a value that might come as number or string (e.g. downloads).
 */
export function coerceNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Coerce a value that might be a string or string[] (e.g. collection, subject).
 */
export function coerceArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null) return undefined
  if (Array.isArray(value)) return value.map(String)
  return [String(value)]
}
