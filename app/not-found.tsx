import Link from 'next/link'
import { Film } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <Film className="text-accent h-16 w-16 opacity-60" />
      <div className="flex flex-col gap-2">
        <h1 className="serif text-6xl font-bold">404</h1>
        <h2 className="serif text-2xl">Film not found</h2>
        <p className="text-foreground-muted max-w-md">
          We couldn&apos;t find what you were looking for. Try browsing our collections
          instead.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="primary">Go home</Button>
        </Link>
        <Link href="/browse">
          <Button variant="secondary">Browse films</Button>
        </Link>
      </div>
    </div>
  )
}
