import type { MetadataRoute } from 'next'
import { COLLECTIONS } from '@/lib/collections'

const BASE_URL = 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/browse`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${BASE_URL}/watchlist`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
  ]
  const collectionRoutes = COLLECTIONS.map((c) => ({
    url: `${BASE_URL}/browse?collection=${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))
  return [...staticRoutes, ...collectionRoutes]
}
