import { newStore } from '@shared/lib/pinia/store-define'

import { CLUB_MOCK_DATA } from '../get-club-overview/model/club-mock-data'
import type { ClubOverviewRow } from '../get-club-overview/model/club-row'

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** Pinia store for clubs until SQLite/IPC persistence is wired. */
export const useClubsStore = newStore('clubs', {
  state: () => ({
    clubs: cloneValue(CLUB_MOCK_DATA) as ClubOverviewRow[]
  }),
  getters: {
    /**
     * Returns clubs sorted newest-first for overview rendering.
     *
     * @param state
     * @returns Club rows ordered by `createdAt` descending.
     */
    clubsNewestFirst(state): ClubOverviewRow[] {
      return [...state.clubs].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    }
  },
  actions: {
    /**
     * Returns a deep clone of all clubs.
     *
     * @returns Club rows currently held in the store.
     */
    listClubs(): ClubOverviewRow[] {
      return cloneValue(this.clubs)
    },

    /**
     * Finds a club by id.
     *
     * @param id - Club id.
     * @returns Matching club clone, or `undefined` when missing.
     */
    getClubById(id: string): ClubOverviewRow | undefined {
      const club = this.clubs.find((entry) => entry.id === id)

      return club ? cloneValue(club) : undefined
    },

    /**
     * Inserts a new club at the start of the store list.
     *
     * @param club - Club row to persist in memory.
     */
    createClub(club: ClubOverviewRow): void {
      this.clubs = [cloneValue(club), ...this.clubs]
    },

    /**
     * Replaces an existing club by id.
     *
     * @param club - Updated club row.
     * @returns `true` when a club was updated.
     */
    updateClub(club: ClubOverviewRow): boolean {
      const index = this.clubs.findIndex((entry) => entry.id === club.id)

      if (index < 0) {
        return false
      }

      const nextClubs = [...this.clubs]
      nextClubs[index] = cloneValue(club)
      this.clubs = nextClubs

      return true
    },

    /**
     * Removes a club by id.
     *
     * @param id - Club id to remove.
     * @returns `true` when a club was removed.
     */
    deleteClub(id: string): boolean {
      const previousLength = this.clubs.length
      this.clubs = this.clubs.filter((entry) => entry.id !== id)

      return this.clubs.length < previousLength
    },

    /** Restores the seeded mock clubs (tests / Storybook helpers). */
    resetClubs(): void {
      this.clubs = cloneValue(CLUB_MOCK_DATA)
    }
  }
})
