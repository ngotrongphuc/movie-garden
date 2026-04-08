import { MovieRailSkeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col gap-14 pb-16">
      <div className="bg-surface h-[75vh] min-h-[520px] w-full animate-pulse" />
      <div className="px-4 sm:px-6 lg:px-10">
        <MovieRailSkeleton />
      </div>
      <div className="px-4 sm:px-6 lg:px-10">
        <MovieRailSkeleton />
      </div>
    </div>
  )
}
