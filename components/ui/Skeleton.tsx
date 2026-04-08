import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/**
 * Animated shimmer placeholder. Use while loading content.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('shimmer rounded-md', className)} />
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function MovieRailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-48" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-44 shrink-0">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
