import type {
  ArchiveFile,
  ArchiveMovie,
  ArchiveMovieDetail,
  SearchResult,
  SortOption,
} from './types'
import {
  coerceArray,
  coerceNumber,
  coerceString,
  parseRuntimeToSeconds,
  parseYear,
  stripHtml,
} from './utils'

const BASE = 'https://archive.org'
const REVALIDATE_SHORT = 60 * 15 // 15 min
const REVALIDATE_LONG = 60 * 60 * 6 // 6 hours

/**
 * Raw doc shape returned by archive.org advancedsearch.php.
 * Fields are permissive — any of them may be missing or different types.
 */
interface RawSearchDoc {
  identifier: string
  title?: string
  description?: string | string[]
  year?: string | number
  creator?: string | string[]
  runtime?: string
  downloads?: number | string
  collection?: string | string[]
}

interface RawSearchResponse {
  response?: {
    numFound?: number
    start?: number
    docs?: RawSearchDoc[]
  }
}

interface RawMetadataResponse {
  metadata?: Record<string, unknown>
  files?: Array<{
    name?: string
    format?: string
    size?: string
    length?: string
  }>
  is_dark?: boolean
}

/**
 * Convert a raw search doc into our typed ArchiveMovie shape.
 */
function normalizeMovie(doc: RawSearchDoc): ArchiveMovie {
  const description = Array.isArray(doc.description)
    ? doc.description.join(' ')
    : doc.description
  return {
    identifier: doc.identifier,
    title: doc.title ?? doc.identifier,
    description: stripHtml(description).slice(0, 400) || undefined,
    year: parseYear(doc.year) ?? undefined,
    creator: coerceString(doc.creator),
    runtime: doc.runtime,
    downloads: coerceNumber(doc.downloads),
    collection: coerceArray(doc.collection),
  }
}

/**
 * Build the URL for archive.org advancedsearch.
 */
function buildSearchUrl(params: {
  query: string
  rows: number
  page: number
  sort?: SortOption
}): string {
  const u = new URL(`${BASE}/advancedsearch.php`)
  u.searchParams.set('q', params.query)
  const fields = [
    'identifier',
    'title',
    'description',
    'year',
    'creator',
    'runtime',
    'downloads',
    'collection',
  ]
  for (const f of fields) u.searchParams.append('fl[]', f)
  if (params.sort) u.searchParams.append('sort[]', params.sort)
  u.searchParams.set('rows', String(params.rows))
  u.searchParams.set('page', String(params.page))
  u.searchParams.set('output', 'json')
  return u.toString()
}

/**
 * Low-level search against archive.org.
 */
async function search(
  query: string,
  options: {
    rows?: number
    page?: number
    sort?: SortOption
    revalidate?: number
    tag?: string
  } = {},
): Promise<SearchResult> {
  const { rows = 20, page = 1, sort = 'downloads desc', revalidate = REVALIDATE_LONG, tag } = options
  const url = buildSearchUrl({ query, rows, page, sort })
  try {
    const res = await fetch(url, {
      next: { revalidate, tags: tag ? ['archive', tag] : ['archive'] },
    })
    if (!res.ok) {
      return { movies: [], total: 0, page }
    }
    const data = (await res.json()) as RawSearchResponse
    const docs = data.response?.docs ?? []
    return {
      movies: docs.filter((d) => d.identifier).map(normalizeMovie),
      total: data.response?.numFound ?? 0,
      page,
    }
  } catch {
    return { movies: [], total: 0, page }
  }
}

/**
 * List movies from a specific archive.org collection, sorted by popularity.
 */
export async function getMoviesByCollection(
  collectionQuery: string,
  options: { rows?: number; page?: number; sort?: SortOption } = {},
): Promise<ArchiveMovie[]> {
  const result = await search(collectionQuery, {
    rows: options.rows ?? 20,
    page: options.page ?? 1,
    sort: options.sort ?? 'downloads desc',
    tag: `collection:${collectionQuery}`,
  })
  return result.movies
}

/**
 * Paginated browse with full result metadata.
 */
export async function browseMovies(params: {
  collectionQuery: string
  page?: number
  rows?: number
  sort?: SortOption
}): Promise<SearchResult> {
  return search(params.collectionQuery, {
    rows: params.rows ?? 30,
    page: params.page ?? 1,
    sort: params.sort ?? 'downloads desc',
    tag: `browse:${params.collectionQuery}:${params.sort ?? 'downloads desc'}`,
  })
}

/**
 * Search movies by free-text query, scoped to the movies mediatype.
 */
export async function searchMovies(
  query: string,
  options: { page?: number; rows?: number } = {},
): Promise<SearchResult> {
  const safe = query.trim()
  if (!safe) return { movies: [], total: 0, page: 1 }
  const escaped = safe.replace(/[()]/g, ' ')
  const q = `(title:(${escaped}) OR description:(${escaped})) AND mediatype:movies`
  return search(q, {
    rows: options.rows ?? 30,
    page: options.page ?? 1,
    sort: 'downloads desc',
    revalidate: REVALIDATE_SHORT,
    tag: `search:${safe.toLowerCase()}`,
  })
}

/**
 * Get several movies in parallel by their identifiers.
 * Used for the home hero carousel and watchlist hydration.
 */
export async function getMoviesByIds(ids: string[]): Promise<ArchiveMovie[]> {
  if (ids.length === 0) return []
  const q = `(${ids.map((id) => `identifier:${id}`).join(' OR ')}) AND mediatype:movies`
  const result = await search(q, {
    rows: ids.length,
    page: 1,
    tag: `ids:${ids.join(',')}`,
  })
  // preserve the requested order
  const byId = new Map(result.movies.map((m) => [m.identifier, m]))
  return ids.map((id) => byId.get(id)).filter((m): m is ArchiveMovie => Boolean(m))
}

/**
 * Pick the best MP4 video file from an archive.org metadata response.
 * Preference order:
 * 1. 512Kb MPEG4 (smaller, streams faster)
 * 2. h.264
 * 3. MPEG4
 * 4. any .mp4 by extension
 */
function pickBestVideoFile(files: ArchiveFile[]): ArchiveFile | null {
  if (files.length === 0) return null
  const byFormat = (fmts: string[]) =>
    files.find(
      (f) => f.format && fmts.some((fmt) => f.format?.toLowerCase().includes(fmt.toLowerCase())),
    )
  return (
    byFormat(['512kb mpeg4']) ??
    byFormat(['h.264']) ??
    byFormat(['mpeg4']) ??
    files.find((f) => f.name?.toLowerCase().endsWith('.mp4')) ??
    null
  )
}

/**
 * Fetch a single movie's full metadata + resolve its streaming URL.
 * Returns null if the identifier isn't a playable movie.
 */
export async function getMovieById(identifier: string): Promise<ArchiveMovieDetail | null> {
  try {
    const res = await fetch(`${BASE}/metadata/${encodeURIComponent(identifier)}`, {
      next: { revalidate: REVALIDATE_LONG, tags: ['archive', `movie:${identifier}`] },
    })
    if (!res.ok) return null
    const data = (await res.json()) as RawMetadataResponse
    if (data.is_dark || !data.metadata) return null

    const m = data.metadata
    const mediatype = coerceString(m.mediatype)
    if (mediatype && mediatype !== 'movies') return null

    const files: ArchiveFile[] = (data.files ?? [])
      .filter((f): f is ArchiveFile => Boolean(f.name))
      .map((f) => ({
        name: f.name!,
        format: f.format,
        size: f.size,
        length: f.length,
      }))

    const best = pickBestVideoFile(files)
    const videoUrl = best
      ? `${BASE}/download/${encodeURIComponent(identifier)}/${encodeURIComponent(best.name)}`
      : null

    const title = coerceString(m.title) ?? identifier
    const rawDescription = coerceString(m.description)
    const description = stripHtml(rawDescription)

    const runtimeStr = coerceString(m.runtime)
    const bestLengthStr = best?.length
    const runtimeSeconds =
      parseRuntimeToSeconds(runtimeStr) ??
      parseRuntimeToSeconds(bestLengthStr) ??
      undefined

    const yearValue =
      parseYear(coerceString(m.year)) ??
      parseYear(coerceString(m.date)) ??
      parseYear(coerceString(m.publicdate)) ??
      undefined

    const downloads = coerceNumber(m.downloads)

    return {
      identifier,
      title,
      description: description || undefined,
      year: yearValue,
      creator: coerceString(m.creator),
      director: coerceString(m.director),
      subject: coerceArray(m.subject),
      collection: coerceArray(m.collection),
      licenseurl: coerceString(m.licenseurl),
      publicdate: coerceString(m.publicdate),
      runtime: runtimeStr,
      runtimeSeconds: runtimeSeconds ?? undefined,
      downloads,
      videoUrl,
      videoFormat: best?.format ?? null,
      posterUrl: getPosterUrl(identifier),
      files,
    }
  } catch {
    return null
  }
}

/**
 * Fetch similar movies from the same collection as a given movie.
 */
export async function getSimilarMovies(
  identifier: string,
  collections: string[] | undefined,
  limit = 12,
): Promise<ArchiveMovie[]> {
  const pick = collections?.find((c) => c && !c.startsWith('opensource'))
  if (!pick) return []
  const q = `collection:${pick} AND mediatype:movies AND NOT identifier:${identifier}`
  const result = await search(q, {
    rows: limit,
    page: 1,
    tag: `similar:${pick}`,
  })
  return result.movies
}

/**
 * Absolute URL to an item's poster image.
 */
export function getPosterUrl(identifier: string): string {
  return `${BASE}/services/img/${encodeURIComponent(identifier)}`
}
