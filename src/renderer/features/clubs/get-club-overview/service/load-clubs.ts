import { CLUB_MOCK_DATA } from '../model/club-mock-data'
import type { ClubOverviewRow } from '../model/club-row'

type ClubsLoader = () => Promise<ClubOverviewRow[]>

let clubsLoader: ClubsLoader = async () => structuredClone(CLUB_MOCK_DATA)

/**
 * Loads clubs for the overview.
 *
 * Currently returns mock fixtures. Replace with IPC/SQLite in a later issue.
 *
 * @returns Club rows for the overview cards.
 */
export async function loadClubs(): Promise<ClubOverviewRow[]> {
  return clubsLoader()
}

/**
 * Overrides the clubs loader for Storybook section stories.
 *
 * @param loader - Async loader used by subsequent `loadClubs` calls.
 */
export function setClubsLoaderForStorybook(loader: ClubsLoader): void {
  clubsLoader = loader
}

/** Restores the default mock clubs loader after Storybook stories. */
export function resetClubsLoaderForStorybook(): void {
  clubsLoader = async () => structuredClone(CLUB_MOCK_DATA)
}
