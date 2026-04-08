# Movie Garden

Free movie streaming site built on the Internet Archive. Watch thousands of
classic films, silent movies, cult cartoons, and public-domain cinema — every
movie actually plays in the browser.

## Stack

- **Next.js 16** App Router · React 19 · TypeScript strict
- **Tailwind CSS v4** with custom design tokens (cinematic dark theme)
- **Zustand** + persist (localStorage watchlist)
- **Framer Motion** for the hero carousel
- **lucide-react** for icons
- **Internet Archive** advancedsearch + metadata APIs (no key required)

## Run

```bash
yarn install
yarn dev
```

Open http://localhost:3000

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Start dev server with Turbopack |
| `yarn build` | Production build |
| `yarn start` | Run the production build |
| `yarn lint` | ESLint |

## Pages

- `/` — home with hero carousel + 6 collection rails
- `/browse?collection=…` — filterable grid (Feature Films, Cartoons, Sci-Fi, Noir, Silent, Movies)
- `/movie/[id]` — detail page with SSR metadata + custom video player
- `/search?q=…` — full-text search across the archive
- `/watchlist` — your saved films (localStorage)

## Data source

All movies are streamed directly from [archive.org](https://archive.org).
Movie Garden makes no claims to any film and stores no video content. The
archive’s collection of public-domain cinema is what makes this project legal,
free, and zero-config.
