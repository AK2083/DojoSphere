import type { ClubOverviewRow } from '../../get-club-overview/model/club-row'
import { useClubsStore } from '../../store/use-clubs-store'

/**
 * Loads a single club from the in-memory store.
 *
 * @param id - Club id.
 * @returns Club row when found.
 */
export async function loadClub(id: string): Promise<ClubOverviewRow> {
  const club = useClubsStore().getClubById(id)

  if (!club) {
    throw new Error(`Club not found: ${id}`)
  }

  return club
}

/**
 * Creates a club in the in-memory store.
 *
 * @param club - Club row to insert.
 */
export async function createClub(club: ClubOverviewRow): Promise<void> {
  useClubsStore().createClub(club)
}

/**
 * Updates a club in the in-memory store.
 *
 * @param club - Club row to replace.
 */
export async function updateClub(club: ClubOverviewRow): Promise<void> {
  const updated = useClubsStore().updateClub(club)

  if (!updated) {
    throw new Error(`Club not found: ${club.id}`)
  }
}
