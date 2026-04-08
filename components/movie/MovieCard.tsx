import Link from 'next/link'
import { Download } from 'lucide-react'
import type { ArchiveMovie } from '@/lib/types'
import { formatCompactNumber } from '@/lib/utils'
import { MoviePoster } from './MoviePoster'

interface MovieCardProps {
  movie: ArchiveMovie
  priority?: boolean
}

/**
 * A movie card with a poster, title, year, and download count.
 * Links to the movie detail page.
 */
export function MovieCard({ movie, priority = false }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${encodeURIComponent(movie.identifier)}`}
      className="group card-glow flex flex-col gap-2 focus:outline-none"
    >
      <MoviePoster identifier={movie.identifier} title={movie.title} priority={priority} />
      <div className="flex flex-col gap-1 px-0.5">
        <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-medium transition-colors group-hover:text-accent">
          {movie.title}
        </h3>
        <div className="text-foreground-dim flex items-center gap-3 text-xs">
          {movie.year && <span>{movie.year}</span>}
          {movie.downloads !== undefined && movie.downloads > 0 && (
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatCompactNumber(movie.downloads)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
