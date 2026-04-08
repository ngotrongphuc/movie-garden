import Link from 'next/link'
import { browseMovies } from '@/lib/archive'
import { COLLECTIONS, findCollection, DEFAULT_COLLECTION } from '@/lib/collections'
import type { SortOption } from '@/lib/types'
import { MovieGrid } from '@/components/movie/MovieGrid'
import { cn } from '@/lib/utils'

export const revalidate = 1800

interface PageProps {
  searchParams: Promise<{ collection?: string; sort?: string; page?: string }>
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'downloads desc', label: 'Most popular' },
  { value: 'year desc', label: 'Newest' },
  { value: 'year asc', label: 'Oldest' },
  { value: 'titleSorter asc', label: 'A → Z' },
]

function buildHref(params: {
  collection: string
  sort?: string
  page?: number
}): string {
  const sp = new URLSearchParams()
  sp.set('collection', params.collection)
  if (params.sort) sp.set('sort', params.sort)
  if (params.page && params.page > 1) sp.set('page', String(params.page))
  return `/browse?${sp.toString()}`
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const sp = await searchParams
  const slug = sp.collection ?? DEFAULT_COLLECTION.slug
  const collection = findCollection(slug) ?? DEFAULT_COLLECTION
  const sort = (sp.sort ?? 'downloads desc') as SortOption
  const page = Math.max(1, Number(sp.page ?? 1))

  const result = await browseMovies({
    collectionQuery: collection.query,
    sort,
    page,
    rows: 30,
  })

  const totalPages = Math.min(20, Math.ceil(result.total / 30))

  return (
    <div className="mx-auto flex max-w-[1800px] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
            Browse
          </div>
          <h1 className="serif text-4xl font-bold sm:text-5xl">{collection.label}</h1>
          <p className="text-foreground-muted max-w-2xl text-base">
            {collection.description}
          </p>
          <p className="text-foreground-dim text-sm">
            {formatTotal(result.total)} films available
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {COLLECTIONS.map((c) => {
            const active = c.slug === slug
            return (
              <Link
                key={c.slug}
                href={buildHref({ collection: c.slug, sort })}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-surface text-foreground-muted hover:border-border-strong hover:text-foreground',
                )}
              >
                {c.label}
              </Link>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-foreground-dim text-xs tracking-wide uppercase">Sort:</span>
          {SORT_OPTIONS.map((opt) => {
            const active = opt.value === sort
            return (
              <Link
                key={opt.value}
                href={buildHref({ collection: slug, sort: opt.value })}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-surface-elevated text-foreground'
                    : 'text-foreground-dim hover:text-foreground',
                )}
              >
                {opt.label}
              </Link>
            )
          })}
        </div>
      </header>

      <MovieGrid movies={result.movies} />

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && (
            <Link
              href={buildHref({ collection: slug, sort, page: page - 1 })}
              className="border-border bg-surface hover:border-border-strong rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="text-foreground-muted px-3 text-sm">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildHref({ collection: slug, sort, page: page + 1 })}
              className="border-border bg-surface hover:border-border-strong rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}

function formatTotal(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}K`
  return String(n)
}
