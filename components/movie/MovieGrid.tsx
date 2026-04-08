import type { ArchiveMovie } from '@/lib/types'
import { MovieCard } from './MovieCard'

interface MovieGridProps {
  movies: ArchiveMovie[]
  emptyMessage?: string
}

/**
 * Responsive grid of movie cards.
 */
export function MovieGrid({
  movies,
  emptyMessage = 'No movies found.',
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-foreground-muted flex min-h-[40vh] items-center justify-center text-center text-lg">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:gap-5 lg:gap-6">
      {movies.map((movie, i) => (
        <MovieCard key={movie.identifier} movie={movie} priority={i < 6} />
      ))}
    </div>
  )
}
