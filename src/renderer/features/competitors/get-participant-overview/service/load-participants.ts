import { getLocalSessionToken } from '@features/authentication/service/local-session-storage'
import type { Competitor } from '@shared/types/electron-api'

/**
 * Loads all competitors via IPC using the current local session.
 *
 * @returns Persisted competitor records ordered by creation time.
 */
export async function loadParticipants(): Promise<Competitor[]> {
  const api = globalThis.window.api

  if (!api) {
    throw new Error('Electron API is not available')
  }

  const token = getLocalSessionToken()

  if (!token) {
    throw new Error('No local session')
  }

  return api.getCompetitors(token)
}

/**
 * Deletes a competitor via IPC using the current local session.
 *
 * @param id - Competitor identifier to delete.
 */
export async function deleteParticipant(id: string): Promise<void> {
  const api = globalThis.window.api

  if (!api) {
    throw new Error('Electron API is not available')
  }

  const token = getLocalSessionToken()

  if (!token) {
    throw new Error('No local session')
  }

  await api.deleteCompetitor(token, id)
}
