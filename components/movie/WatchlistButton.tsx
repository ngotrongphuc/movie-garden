'use client'

import { useEffect, useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { ArchiveMovie } from '@/lib/types'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { cn } from '@/lib/utils'

interface WatchlistButtonProps {
  movie: ArchiveMovie
  variant?: 'pill' | 'icon'
  className?: string
}

/**
 * Toggle a movie in the user's local watchlist.
 * Hydration-safe: renders an inert placeholder on the server.
 */
export function WatchlistButton({
  movie,
  variant = 'pill',
  className,
}: WatchlistButtonProps) {
  const [mounted, setMounted] = useState(false)
  const add = useWatchlistStore((s) => s.add)
  const remove = useWatchlistStore((s) => s.remove)
  const has = useWatchlistStore((s) => s.has)

  useEffect(() => setMounted(true), [])

  const saved = mounted && has(movie.identifier)

  const toggle = () => {
    if (saved) {
      remove(movie.identifier)
    } else {
      add({
        identifier: movie.identifier,
        title: movie.title,
        year: movie.year,
        downloads: movie.downloads,
      })
    }
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        className={cn(
          'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground transition-all hover:border-border-strong hover:bg-surface-hover',
          saved && 'border-accent text-accent',
          className,
        )}
      >
        {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full border border-border bg-surface-elevated px-7 text-base font-medium text-foreground transition-all hover:border-border-strong hover:bg-surface-hover active:scale-[0.98]',
        saved && 'border-accent text-accent',
        className,
      )}
    >
      {saved ? (
        <>
          <BookmarkCheck className="h-5 w-5" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark className="h-5 w-5" />
          Add to Watchlist
        </>
      )}
    </button>
  )
}
