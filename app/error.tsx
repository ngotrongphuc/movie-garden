'use client'

import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <TriangleAlert className="text-danger h-16 w-16 opacity-80" />
      <div className="flex flex-col gap-2">
        <h1 className="serif text-4xl font-bold">Something went wrong</h1>
        <p className="text-foreground-muted max-w-md">
          We couldn&apos;t load this page. It might be a temporary issue with
          archive.org. Try again in a moment.
        </p>
      </div>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
