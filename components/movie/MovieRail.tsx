'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { ArchiveMovie } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MovieCard } from './MovieCard'

interface MovieRailProps {
  title: string
  description?: string
  movies: ArchiveMovie[]
  href?: string
}

/**
 * Horizontal scrollable rail of movie cards with arrow buttons and
 * a "view more" link in the header.
 */
export function MovieRail({ title, description, movies, href }: MovieRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [movies.length])

  if (movies.length === 0) return null

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <section className="group/rail relative flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-1">
          <h2 className="serif text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          {description && (
            <p className="text-foreground-muted text-sm">{description}</p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="text-foreground-muted hover:text-accent flex shrink-0 items-center gap-1 text-sm font-medium transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className={cn(
            'absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/70 p-2 text-foreground backdrop-blur-sm transition-all duration-200 md:block',
            'hover:bg-accent hover:text-background',
            canScrollLeft
              ? 'opacity-0 group-hover/rail:opacity-100'
              : 'pointer-events-none opacity-0',
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className={cn(
            'absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/70 p-2 text-foreground backdrop-blur-sm transition-all duration-200 md:block',
            'hover:bg-accent hover:text-background',
            canScrollRight
              ? 'opacity-0 group-hover/rail:opacity-100'
              : 'pointer-events-none opacity-0',
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-10"
        >
          {movies.map((movie, i) => (
            <div
              key={movie.identifier}
              className="w-[44vw] shrink-0 snap-start sm:w-[30vw] md:w-[22vw] lg:w-[16vw] xl:w-[14vw]"
            >
              <MovieCard movie={movie} priority={i < 4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
