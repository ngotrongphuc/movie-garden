import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Play, Calendar, Clock, Download, Film, User } from 'lucide-react'
import { getMovieById, getSimilarMovies } from '@/lib/archive'
import { formatCompactNumber, formatDuration } from '@/lib/utils'
import { VideoPlayer } from '@/components/movie/VideoPlayer'
import { MovieRail } from '@/components/movie/MovieRail'
import { WatchlistButton } from '@/components/movie/WatchlistButton'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Button } from '@/components/ui/Button'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieById(decodeURIComponent(id))
  if (!movie) {
    return { title: 'Movie not found' }
  }
  return {
    title: movie.title,
    description: movie.description?.slice(0, 160),
    openGraph: {
      title: movie.title,
      description: movie.description?.slice(0, 160),
      images: [movie.posterUrl],
      type: 'video.movie',
    },
  }
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params
  const identifier = decodeURIComponent(id)
  const movie = await getMovieById(identifier)
  if (!movie) notFound()

  const similar = await getSimilarMovies(movie.identifier, movie.collection, 12)

  return (
    <div className="flex flex-col gap-12 pb-20">
      <section className="relative">
        <div className="absolute inset-0 h-[70vh] min-h-[500px] overflow-hidden">
          <ImageWithFallback
            src={movie.posterUrl}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover blur-lg"
            fallbackClassName="absolute inset-0"
          />
          <div className="from-background/60 to-background absolute inset-0 bg-gradient-to-b" />
          <div className="from-background/80 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
            <div className="relative mx-auto aspect-[2/3] w-56 shrink-0 overflow-hidden rounded-2xl shadow-2xl sm:w-64 lg:mx-0 lg:w-72">
              <ImageWithFallback
                src={movie.posterUrl}
                alt={movie.title}
                fill
                sizes="(max-width: 1024px) 256px, 288px"
                className="object-cover"
                fallbackClassName="absolute inset-0"
              />
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
                  {movie.collection?.[0]?.replace(/_/g, ' ') ?? 'Classic Cinema'}
                </div>
                <h1 className="serif text-balance text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
                  {movie.title}
                </h1>
                <div className="text-foreground-muted flex flex-wrap items-center gap-4 text-sm">
                  {movie.year && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {movie.year}
                    </span>
                  )}
                  {movie.runtimeSeconds && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {formatDuration(movie.runtimeSeconds)}
                    </span>
                  )}
                  {movie.downloads !== undefined && movie.downloads > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Download className="h-4 w-4" />
                      {formatCompactNumber(movie.downloads)} views
                    </span>
                  )}
                  {movie.creator && (
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {movie.creator}
                    </span>
                  )}
                </div>
              </div>

              {movie.description && (
                <p className="text-foreground-muted text-pretty max-w-3xl text-base leading-relaxed sm:text-lg">
                  {movie.description.slice(0, 500)}
                  {movie.description.length > 500 ? '…' : ''}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {movie.videoUrl ? (
                  <a href="#player">
                    <Button variant="primary" size="lg">
                      <Play className="h-5 w-5 fill-current" />
                      Watch Now
                    </Button>
                  </a>
                ) : (
                  <Button variant="secondary" size="lg" disabled>
                    <Film className="h-5 w-5" />
                    No video available
                  </Button>
                )}
                <WatchlistButton movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {movie.videoUrl && (
        <section id="player" className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-4 sm:px-6 lg:px-10">
          <VideoPlayer
            src={movie.videoUrl}
            poster={movie.posterUrl}
            title={movie.title}
          />
          <p className="text-foreground-dim mt-3 text-xs">
            Video streamed from archive.org · Format: {movie.videoFormat ?? 'MP4'}
          </p>
        </section>
      )}

      {movie.subject && movie.subject.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap gap-2">
            {movie.subject.slice(0, 8).map((subject) => (
              <Link
                key={subject}
                href={`/search?q=${encodeURIComponent(subject)}`}
                className="border-border bg-surface-elevated text-foreground-muted hover:border-accent hover:text-accent rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
              >
                {subject}
              </Link>
            ))}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <div className="mx-auto w-full max-w-[1800px]">
          <MovieRail title="You might also like" movies={similar} />
        </div>
      )}
    </div>
  )
}
