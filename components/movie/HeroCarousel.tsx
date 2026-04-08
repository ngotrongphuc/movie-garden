'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Info } from 'lucide-react'
import type { ArchiveMovie } from '@/lib/types'
import { getPosterUrl } from '@/lib/archive'
import { Button } from '@/components/ui/Button'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

interface HeroCarouselProps {
  movies: ArchiveMovie[]
}

const AUTO_ADVANCE_MS = 7000

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (movies.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % movies.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [movies.length])

  if (movies.length === 0) return null
  const current = movies[index]

  return (
    <div className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.identifier}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={getPosterUrl(current.identifier)}
            alt={current.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            fallbackClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="from-background absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-end px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.identifier + '-content'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex max-w-2xl flex-col gap-5"
          >
            <div className="text-accent font-sans text-sm font-semibold tracking-[0.25em] uppercase">
              Now streaming
            </div>
            <h1 className="serif text-balance text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
              {current.title}
            </h1>
            {current.description && (
              <p className="text-foreground-muted text-pretty line-clamp-3 text-base sm:text-lg">
                {current.description}
              </p>
            )}
            <div className="flex items-center gap-3 pt-2">
              <Link href={`/movie/${encodeURIComponent(current.identifier)}`}>
                <Button variant="primary" size="lg">
                  <Play className="h-5 w-5 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Link href={`/movie/${encodeURIComponent(current.identifier)}`}>
                <Button variant="secondary" size="lg">
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:left-auto sm:right-10 sm:translate-x-0">
          {movies.map((m, i) => (
            <button
              key={m.identifier}
              type="button"
              aria-label={`Show ${m.title}`}
              onClick={() => setIndex(i)}
              className={
                i === index
                  ? 'bg-accent h-1 w-10 rounded-full transition-all'
                  : 'bg-foreground/30 hover:bg-foreground/50 h-1 w-6 cursor-pointer rounded-full transition-all'
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
