/**
 * Internet Archive data types — a subset of what the archive.org APIs return.
 * Only the fields we actually use in the UI are modeled.
 */

export interface ArchiveMovie {
  identifier: string
  title: string
  description?: string
  year?: number
  creator?: string
  runtime?: string
  downloads?: number
  collection?: string[]
}

export interface ArchiveFile {
  name: string
  format?: string
  size?: string
  length?: string
}

export interface ArchiveMovieDetail extends ArchiveMovie {
  videoUrl: string | null
  videoFormat: string | null
  posterUrl: string
  files: ArchiveFile[]
  director?: string
  subject?: string[]
  licenseurl?: string
  publicdate?: string
  runtimeSeconds?: number
}

export interface SearchResult {
  movies: ArchiveMovie[]
  total: number
  page: number
}

export type SortOption = 'downloads desc' | 'downloads asc' | 'year desc' | 'year asc' | 'titleSorter asc'

export interface CollectionConfig {
  slug: string
  label: string
  description: string
  query: string
}
