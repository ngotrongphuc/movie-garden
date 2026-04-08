import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface WatchlistItem {
  identifier: string
  title: string
  year?: number
  downloads?: number
  addedAt?: number
}

interface WatchlistState {
  items: WatchlistItem[]
  add: (item: WatchlistItem) => void
  remove: (identifier: string) => void
  has: (identifier: string) => boolean
  clear: () => void
}

/**
 * Persistent local watchlist backed by localStorage.
 * Exposes stable selectors for read access and atomic mutation actions.
 */
export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          if (state.items.some((it) => it.identifier === item.identifier)) return state
          return {
            items: [{ ...item, addedAt: Date.now() }, ...state.items],
          }
        }),
      remove: (identifier) =>
        set((state) => ({
          items: state.items.filter((it) => it.identifier !== identifier),
        })),
      has: (identifier) => get().items.some((it) => it.identifier === identifier),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'movie-garden-watchlist',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
