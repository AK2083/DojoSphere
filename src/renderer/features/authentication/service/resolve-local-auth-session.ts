import type { LocalSession } from '@shared/types/electron-api'

import { clearLocalSessionToken, getLocalSessionToken } from './local-session-storage'
import { mapLocalSessionToAuthSession } from './map-local-session-to-auth-session'

/**
 * Resolves the current local session from storage and validates it via IPC.
 *
 * @returns Mapped auth session or `null` when no valid local session exists.
 */
export async function resolveLocalAuthSession() {
  const token = getLocalSessionToken()

  if (!token || !globalThis.window.api?.getLocalSession) {
    return null
  }

  let localSession: LocalSession | null

  try {
    localSession = await globalThis.window.api.getLocalSession(token)
  } catch {
    clearLocalSessionToken()
    return null
  }

  if (!localSession) {
    clearLocalSessionToken()
    return null
  }

  return mapLocalSessionToAuthSession(localSession)
}

/**
 * Revokes the current local session in SQLite and clears persisted storage.
 */
export async function revokeLocalAuthSession() {
  const token = getLocalSessionToken()

  if (!token || !globalThis.window.api?.revokeLocalSession) {
    clearLocalSessionToken()
    return
  }

  try {
    await globalThis.window.api.revokeLocalSession(token)
  } finally {
    clearLocalSessionToken()
  }
}
