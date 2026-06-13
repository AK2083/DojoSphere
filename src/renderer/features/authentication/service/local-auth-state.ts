import type { AuthSession } from '@shared/types'

type LocalAuthStateListener = (session: AuthSession | null) => void

const listeners = new Set<LocalAuthStateListener>()

/**
 * Notifies subscribers about local auth session changes.
 *
 * @param session - Updated local auth session or `null` after sign-out.
 */
export function notifyLocalAuthStateChanged(session: AuthSession | null) {
  listeners.forEach((listener) => {
    listener(session)
  })
}

/**
 * Subscribes to local auth session changes.
 *
 * @param listener - Callback invoked when the local session changes.
 * @returns Unsubscribe function.
 */
export function onLocalAuthStateChanged(listener: LocalAuthStateListener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}
