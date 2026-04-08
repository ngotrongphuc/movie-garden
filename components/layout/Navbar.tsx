'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bookmark, Menu, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/movie/SearchBar'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse' },
  { href: '/watchlist', label: 'Watchlist' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-border bg-background/80 border-b backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1800px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <Sparkles className="text-accent h-6 w-6 transition-transform group-hover:scale-110" />
            </div>
            <span className="serif text-xl font-bold tracking-tight sm:text-2xl">
              Movie <span className="text-accent">Garden</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-surface-elevated text-accent'
                      : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="hidden max-w-sm flex-1 md:block">
          <SearchBar />
        </div>

        <button
          type="button"
          className="text-foreground hover:bg-surface-hover flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link
          href="/watchlist"
          className="text-foreground hover:bg-surface-hover hidden h-10 w-10 items-center justify-center rounded-full transition-colors md:flex lg:hidden"
          aria-label="Watchlist"
        >
          <Bookmark className="h-5 w-5" />
        </Link>
      </nav>

      {menuOpen && (
        <div className="border-border bg-background/95 border-t backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3 px-4 py-4">
            <SearchBar autoFocus />
            <div className="flex flex-col gap-1 pt-2">
              {LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      active
                        ? 'bg-surface-elevated text-accent'
                        : 'text-foreground-muted hover:bg-surface-hover',
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
