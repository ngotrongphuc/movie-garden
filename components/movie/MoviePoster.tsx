import { getPosterUrl } from '@/lib/archive'
import { cn } from '@/lib/utils'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface MoviePosterProps {
  identifier: string
  title: string
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * Poster image for a movie. Uses archive.org's services/img endpoint which
 * returns an arbitrary aspect; we enforce a 2:3 movie-poster aspect via
 * container classes.
 */
export function MoviePoster({
  identifier,
  title,
  className,
  sizes = '(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 15vw',
  priority = false,
}: MoviePosterProps) {
  return (
    <div className={cn('bg-surface relative aspect-[2/3] overflow-hidden rounded-xl', className)}>
      <ImageWithFallback
        src={getPosterUrl(identifier)}
        alt={title}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        fallbackClassName="absolute inset-0 flex items-center justify-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  )
}
