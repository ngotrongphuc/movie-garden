import { searchMovies } from '@/lib/archive'
import { MovieGrid } from '@/components/movie/MovieGrid'
import { SearchBar } from '@/components/movie/SearchBar'

export const revalidate = 600

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams
  return {
    title: q ? `Search: ${q}` : 'Search',
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const result = query ? await searchMovies(query, { rows: 48 }) : null

  return (
    <div className="mx-auto flex max-w-[1800px] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <header className="flex flex-col gap-4">
        <div className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
          Search
        </div>
        <h1 className="serif text-4xl font-bold sm:text-5xl">
          {query ? (
            <>
              Results for <span className="text-accent">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            'Find a film'
          )}
        </h1>
        <div className="max-w-xl">
          <SearchBar initialQuery={query} autoFocus={!query} />
        </div>
        {result && (
          <p className="text-foreground-muted text-sm">
            {result.total === 0
              ? 'No matches found.'
              : `Found ${result.total.toLocaleString()} results · showing ${result.movies.length}`}
          </p>
        )}
      </header>

      {query ? (
        <MovieGrid
          movies={result?.movies ?? []}
          emptyMessage="No films matched your search. Try a broader term."
        />
      ) : (
        <div className="text-foreground-muted flex min-h-[30vh] items-center justify-center text-center">
          Type above to search thousands of public domain films.
        </div>
      )}
    </div>
  )
}
