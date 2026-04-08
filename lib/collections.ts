import type { CollectionConfig } from './types'

/**
 * Curated list of Internet Archive collections surfaced in the UI as rails
 * and as the filter options on the Browse page.
 */
export const COLLECTIONS: CollectionConfig[] = [
  {
    slug: 'feature_films',
    label: 'Feature Films',
    description: 'Full-length films from cinema’s golden age and beyond.',
    query: 'collection:feature_films AND mediatype:movies',
  },
  {
    slug: 'classic_cartoons',
    label: 'Classic Cartoons',
    description: 'Hand-drawn animation from the early 20th century.',
    query: 'collection:classic_cartoons AND mediatype:movies',
  },
  {
    slug: 'scifi_horror',
    label: 'Sci-Fi & Horror',
    description: 'Atomic-age thrillers, creature features, and cult horror.',
    query: 'collection:SciFi_Horror AND mediatype:movies',
  },
  {
    slug: 'film_noir',
    label: 'Film Noir',
    description: 'Shadowy detectives, femme fatales, rain-slick streets.',
    query: 'collection:Film_Noir AND mediatype:movies',
  },
  {
    slug: 'silent_films',
    label: 'Silent Films',
    description: 'The birth of cinema — before sound came to the movies.',
    query: 'collection:silent_films AND mediatype:movies',
  },
  {
    slug: 'moviesandfilms',
    label: 'Movies & Films',
    description: 'A broad selection from the archive’s movies section.',
    query: 'collection:moviesandfilms AND mediatype:movies',
  },
]

export const DEFAULT_COLLECTION = COLLECTIONS[0]

/**
 * Hand-picked feature identifiers for the home page hero carousel.
 * These are well-known, high-quality public domain films with reliable playback.
 */
export const FEATURED_IDS: string[] = [
  'night_of_the_living_dead',
  'CC_1916_07_10_TheVagabond',
  'charlie_chaplin_film_fest',
  'PlanetOutercwdvd10',
  'TheGeneralbyBusterKeaton',
  'Metropolis1927',
  'DetourUlmer',
  'TheKidwithCharlieChaplin',
  'DOADetectiveStory',
  'HisGirlFriday_201404',
]

export function findCollection(slug: string): CollectionConfig | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}
