import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import type { Association } from '@shared/types/electron-api'

import { ASSOCIATION_SEEDS } from '../model/static-reference-data'

/** Seeded Unknown association id — excluded from the IPC list and prepended in the form. */
const UNKNOWN_ASSOCIATION_ID = ASSOCIATION_SEEDS[0]!.id

/**
 * Select option for the participant association field (`value` is `associations.id`).
 */
export type AssociationSelectOption = {
  id: string
  name: string
}

function requireApi() {
  const api = globalThis.window.api

  if (!api) {
    throw new Error('Electron API is not available')
  }

  const token = getLocalSessionToken()

  if (!token) {
    throw new Error('No local session')
  }

  return { api, token }
}

/**
 * Loads association options for the participant form from SQLite via IPC.
 *
 * Returns persisted associations (excluding the seeded Unknown row, which the form
 * prepends separately with a translated label).
 *
 * @returns Association id/name pairs sorted by name.
 */
export async function loadAssociationSelectOptions(): Promise<AssociationSelectOption[]> {
  const { api, token } = requireApi()
  const associations = await api.getAssociations(token)

  return associations
    .filter((association: Association) => association.id !== UNKNOWN_ASSOCIATION_ID)
    .map((association) => ({
      id: association.id,
      name: association.name
    }))
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { sensitivity: 'base' }))
}
