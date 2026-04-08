'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark } from 'lucide-react'
import { useWatchlistStore } from '@/stores/watchlistStore'
import type { ArchiveMovie } from '@/lib/types'
import { MovieGrid } from '@/components/movie/MovieGrid'
import { MovieCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

export default function WatchlistPage() {
  const items = useWatchlistStore((s) => s.items)
  const clear = useWatchlistStore((s) => s.clear)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const movies: ArchiveMovie[] = items.map((it) => ({
    identifier: it.identifier,
    title: it.title,
    year: it.year,
    downloads: it.downloads,
  }))

  return (
    <div className="mx-auto flex max-w-[1800px] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <header className="flex flex-col gap-3">
        <div className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
          Your collection
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="serif text-4xl font-bold sm:text-5xl">Watchlist</h1>
            <p className="text-foreground-muted mt-2 text-base">
              Films you&apos;ve saved for later.{' '}
              {mounted && items.length > 0 && (
                <span>
                  {items.length} {items.length === 1 ? 'movie' : 'movies'}.
                </span>
              )}
            </p>
          </div>
          {mounted && items.length > 0 && (
            <Button variant="ghost" onClick={clear}>
              Clear all
            </Button>
          )}
        </div>
      </header>

      {!mounted ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="border-border bg-surface/40 flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed text-center">
          <Bookmark className="text-foreground-dim h-12 w-12" />
          <div className="flex flex-col gap-1">
            <h2 className="serif text-2xl font-bold">No films yet</h2>
            <p className="text-foreground-muted max-w-sm">
              Save movies to your watchlist by tapping the bookmark icon on any film.
            </p>
          </div>
          <Link href="/browse">
            <Button variant="primary">Browse films</Button>
          </Link>
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  )
}
