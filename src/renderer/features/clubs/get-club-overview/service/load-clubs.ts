import { useClubsStore } from '../../store/use-clubs-store'
import type { ClubOverviewRow } from '../model/club-row'

type ClubsLoader = () => Promise<ClubOverviewRow[]>

let clubsLoaderOverride: ClubsLoader | null = null

/**
 * Loads clubs for the overview from the in-memory clubs store.
 *
 * @returns Club rows for the overview cards.
 */
export async function loadClubs(): Promise<ClubOverviewRow[]> {
  if (clubsLoaderOverride) {
    return clubsLoaderOverride()
  }

  return useClubsStore().listClubs()
}

/**
 * Deletes a club from the in-memory clubs store.
 *
 * @param id - Club id to remove.
 */
export async function deleteClub(id: string): Promise<void> {
  const removed = useClubsStore().deleteClub(id)

  if (!removed) {
    throw new Error(`Club not found: ${id}`)
  }
}

/**
 * Overrides the clubs loader for Storybook section stories.
 *
 * @param loader - Async loader used by subsequent `loadClubs` calls.
 */
export function setClubsLoaderForStorybook(loader: ClubsLoader): void {
  clubsLoaderOverride = loader
}

/** Restores the default store-backed clubs loader after Storybook stories. */
export function resetClubsLoaderForStorybook(): void {
  clubsLoaderOverride = null
}
