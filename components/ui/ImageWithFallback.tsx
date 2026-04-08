'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { Film } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src'> {
  src: string
  fallbackClassName?: string
}

/**
 * A next/image wrapper that gracefully degrades to a film icon when the
 * remote image (archive.org thumbnail) fails to load.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        className={cn(
          'from-surface to-surface-elevated text-foreground-dim flex items-center justify-center bg-gradient-to-br',
          fallbackClassName ?? className,
        )}
      >
        <Film className="h-10 w-10 opacity-40" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      unoptimized
      {...props}
    />
  )
}
