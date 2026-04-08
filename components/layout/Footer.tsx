import Link from 'next/link'
import { Sparkles, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-border border-t bg-surface/40 mt-20">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-8 px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent h-6 w-6" />
            <span className="serif text-2xl font-bold">
              Movie <span className="text-accent">Garden</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/watchlist"
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              Watchlist
            </Link>
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Internet Archive
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        <div className="border-border/60 flex flex-col items-start justify-between gap-4 border-t pt-8 text-sm md:flex-row md:items-center">
          <p className="text-foreground-dim text-pretty max-w-2xl">
            Movie Garden is a catalog of classic public-domain cinema. All films
            are streamed directly from{' '}
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              archive.org
            </a>{' '}
            and remain property of their original owners.
          </p>
          <p className="text-foreground-dim shrink-0">
            Built with Next.js · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
