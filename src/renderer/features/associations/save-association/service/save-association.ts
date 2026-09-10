import type { AssociationOverviewRow } from '../../get-association-overview/model/association-row'
import { useAssociationsStore } from '../../store/use-associations-store'

/**
 * Loads a single association from the in-memory store.
 *
 * @param id - Association id.
 * @returns Association row when found.
 */
export async function loadAssociation(id: string): Promise<AssociationOverviewRow> {
  const association = useAssociationsStore().getAssociationById(id)

  if (!association) {
    throw new Error(`Association not found: ${id}`)
  }

  return association
}

/**
 * Creates a association in the in-memory store.
 *
 * @param association - Association row to insert.
 */
export async function createAssociation(association: AssociationOverviewRow): Promise<void> {
  useAssociationsStore().createAssociation(association)
}

/**
 * Updates a association in the in-memory store.
 *
 * @param association - Association row to replace.
 */
export async function updateAssociation(association: AssociationOverviewRow): Promise<void> {
  const updated = useAssociationsStore().updateAssociation(association)

  if (!updated) {
    throw new Error(`Association not found: ${association.id}`)
  }
}
