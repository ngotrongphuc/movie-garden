'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  initialQuery?: string
  className?: string
  autoFocus?: boolean
}

/**
 * Search input that navigates to /search?q=... on submit.
 * Client-side for focus/state management.
 */
export function SearchBar({ initialQuery = '', className, autoFocus = false }: SearchBarProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState(initialQuery)

  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const clear = () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        'border-border bg-surface hover:border-border-strong focus-within:border-accent focus-within:bg-surface-hover relative flex w-full items-center gap-2 rounded-full border pl-4 pr-2 transition-colors',
        className,
      )}
    >
      <Search className="text-foreground-dim h-4 w-4 shrink-0" />
      <input
        ref={inputRef}
        type="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search classic cinema..."
        className="placeholder:text-foreground-dim h-10 flex-1 border-none bg-transparent text-sm text-foreground outline-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="text-foreground-dim hover:text-foreground cursor-pointer p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
