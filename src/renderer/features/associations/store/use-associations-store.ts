import { newStore } from '@shared/lib/pinia/store-define'

import { ASSOCIATION_MOCK_DATA } from '../get-association-overview/model/association-mock-data'
import type { AssociationOverviewRow } from '../get-association-overview/model/association-row'

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** Pinia store for associations until SQLite/IPC persistence is wired. */
export const useAssociationsStore = newStore('associations', {
  state: () => ({
    associations: cloneValue(ASSOCIATION_MOCK_DATA) as AssociationOverviewRow[]
  }),
  getters: {
    /**
     * Returns associations sorted newest-first for overview rendering.
     *
     * @param state
     * @returns Association rows ordered by `createdAt` descending.
     */
    associationsNewestFirst(state): AssociationOverviewRow[] {
      return [...state.associations].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt)
      )
    }
  },
  actions: {
    /**
     * Returns a deep clone of all associations.
     *
     * @returns Association rows currently held in the store.
     */
    listAssociations(): AssociationOverviewRow[] {
      return cloneValue(this.associations)
    },

    /**
     * Finds a association by id.
     *
     * @param id - Association id.
     * @returns Matching association clone, or `undefined` when missing.
     */
    getAssociationById(id: string): AssociationOverviewRow | undefined {
      const association = this.associations.find((entry) => entry.id === id)

      return association ? cloneValue(association) : undefined
    },

    /**
     * Inserts a new association at the start of the store list.
     *
     * @param association - Association row to persist in memory.
     */
    createAssociation(association: AssociationOverviewRow): void {
      this.associations = [cloneValue(association), ...this.associations]
    },

    /**
     * Replaces an existing association by id.
     *
     * @param association - Updated association row.
     * @returns `true` when a association was updated.
     */
    updateAssociation(association: AssociationOverviewRow): boolean {
      const index = this.associations.findIndex((entry) => entry.id === association.id)

      if (index < 0) {
        return false
      }

      const nextAssociations = [...this.associations]
      nextAssociations[index] = cloneValue(association)
      this.associations = nextAssociations

      return true
    },

    /**
     * Removes a association by id.
     *
     * @param id - Association id to remove.
     * @returns `true` when a association was removed.
     */
    deleteAssociation(id: string): boolean {
      const previousLength = this.associations.length
      this.associations = this.associations.filter((entry) => entry.id !== id)

      return this.associations.length < previousLength
    },

    /** Restores the seeded mock associations (tests / Storybook helpers). */
    resetAssociations(): void {
      this.associations = cloneValue(ASSOCIATION_MOCK_DATA)
    }
  }
})
