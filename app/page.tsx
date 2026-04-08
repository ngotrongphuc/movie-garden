import { Suspense } from 'react'
import { getMoviesByCollection, getMoviesByIds } from '@/lib/archive'
import { COLLECTIONS, FEATURED_IDS } from '@/lib/collections'
import { HeroCarousel } from '@/components/movie/HeroCarousel'
import { MovieRail } from '@/components/movie/MovieRail'
import { MovieRailSkeleton } from '@/components/ui/Skeleton'

export const revalidate = 3600

async function FeaturedHero() {
  const featured = await getMoviesByIds(FEATURED_IDS.slice(0, 6))
  if (featured.length === 0) {
    // Fallback: use most popular feature films
    const fallback = await getMoviesByCollection(
      'collection:feature_films AND mediatype:movies',
      { rows: 6 },
    )
    return <HeroCarousel movies={fallback} />
  }
  return <HeroCarousel movies={featured} />
}

async function CollectionRail({
  slug,
  label,
  description,
  query,
}: {
  slug: string
  label: string
  description: string
  query: string
}) {
  const movies = await getMoviesByCollection(query, { rows: 16 })
  return (
    <MovieRail
      title={label}
      description={description}
      movies={movies}
      href={`/browse?collection=${slug}`}
    />
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14 pb-16">
      <Suspense
        fallback={
          <div className="bg-surface h-[75vh] min-h-[520px] w-full animate-pulse" />
        }
      >
        <FeaturedHero />
      </Suspense>

      {COLLECTIONS.map((collection) => (
        <Suspense key={collection.slug} fallback={<MovieRailSkeleton />}>
          <CollectionRail
            slug={collection.slug}
            label={collection.label}
            description={collection.description}
            query={collection.query}
          />
        </Suspense>
      ))}
    </div>
  )
}
