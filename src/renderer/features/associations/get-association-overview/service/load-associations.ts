import { useAssociationsStore } from '../../store/use-associations-store'
import type { AssociationOverviewRow } from '../model/association-row'

type AssociationsLoader = () => Promise<AssociationOverviewRow[]>

let associationsLoaderOverride: AssociationsLoader | null = null

/**
 * Loads associations for the overview from the in-memory associations store.
 *
 * @returns Association rows for the overview cards.
 */
export async function loadAssociations(): Promise<AssociationOverviewRow[]> {
  if (associationsLoaderOverride) {
    return associationsLoaderOverride()
  }

  return useAssociationsStore().listAssociations()
}

/**
 * Deletes a association from the in-memory associations store.
 *
 * @param id - Association id to remove.
 */
export async function deleteAssociation(id: string): Promise<void> {
  const removed = useAssociationsStore().deleteAssociation(id)

  if (!removed) {
    throw new Error(`Association not found: ${id}`)
  }
}

/**
 * Overrides the associations loader for Storybook section stories.
 *
 * @param loader - Async loader used by subsequent `loadAssociations` calls.
 */
export function setAssociationsLoaderForStorybook(loader: AssociationsLoader): void {
  associationsLoaderOverride = loader
}

/** Restores the default store-backed associations loader after Storybook stories. */
export function resetAssociationsLoaderForStorybook(): void {
  associationsLoaderOverride = null
}
