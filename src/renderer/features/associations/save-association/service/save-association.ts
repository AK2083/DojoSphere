import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import type { Association, CreateAssociationInput } from '@shared/types/electron-api'

import type { AssociationFormState } from '../model/association-form-state'
import { mapFormStateToAssociation } from '../model/map-association-form-state'

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
 * Maps association form state to the IPC create/update input shape.
 *
 * @param fields - Current association form values.
 * @returns Association input payload for the main process.
 */
export function mapFormStateToInput(fields: AssociationFormState): CreateAssociationInput {
  const mapped = mapFormStateToAssociation(fields, {
    id: 'pending',
    source: 'manual',
    createdAt: new Date(0).toISOString()
  })

  return {
    name: mapped.name,
    shortName: mapped.shortName,
    city: mapped.city,
    website: mapped.website,
    isActive: mapped.isActive,
    source: mapped.source,
    districtName: mapped.districtName,
    districtShortName: mapped.districtShortName,
    identifiers: mapped.identifiers,
    addresses: mapped.addresses,
    contacts: mapped.contacts
  }
}

/**
 * Loads a single association via IPC using the current local session.
 *
 * @param id - Association identifier to load.
 * @returns The association record from the main process.
 */
export async function loadAssociation(id: string): Promise<Association> {
  const { api, token } = requireApi()

  return api.getAssociation(token, id)
}

/**
 * Persists a new association via IPC using the current local session.
 *
 * @param fields - Validated association form values.
 * @returns The created association record from the main process.
 */
export async function createAssociation(fields: AssociationFormState): Promise<Association> {
  const { api, token } = requireApi()

  return api.addAssociation(token, mapFormStateToInput(fields))
}

/**
 * Updates an existing association via IPC using the current local session.
 *
 * @param id - Association identifier to update.
 * @param fields - Validated association form values.
 * @returns The updated association record from the main process.
 */
export async function updateAssociation(
  id: string,
  fields: AssociationFormState
): Promise<Association> {
  const { api, token } = requireApi()

  return api.updateAssociation(token, id, mapFormStateToInput(fields))
}
