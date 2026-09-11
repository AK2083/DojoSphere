import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import type { Association } from '@shared/types/electron-api'

type AssociationsLoader = () => Promise<Association[]>

let associationsLoaderOverride: AssociationsLoader | null = null

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
 * Loads associations for the overview from SQLite via IPC.
 *
 * @returns Association rows for the overview cards.
 */
export async function loadAssociations(): Promise<Association[]> {
  if (associationsLoaderOverride) {
    return associationsLoaderOverride()
  }

  const { api, token } = requireApi()

  return api.getAssociations(token)
}

/**
 * Deletes an association via IPC using the current local session.
 *
 * @param id - Association id to remove.
 */
export async function deleteAssociation(id: string): Promise<void> {
  const { api, token } = requireApi()

  await api.deleteAssociation(token, id)
}

/**
 * Overrides the associations loader for Storybook section stories.
 *
 * @param loader - Async loader used by subsequent `loadAssociations` calls.
 */
export function setAssociationsLoaderForStorybook(loader: AssociationsLoader): void {
  associationsLoaderOverride = loader
}

/** Restores the default IPC-backed associations loader after Storybook stories. */
export function resetAssociationsLoaderForStorybook(): void {
  associationsLoaderOverride = null
}
