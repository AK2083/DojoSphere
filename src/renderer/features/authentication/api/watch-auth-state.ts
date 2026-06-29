import { onAuthStateChange } from '@shared/api'
import { logError } from '@shared/lib'
import type { AuthEvent, AuthState, LowLevelAuthEvent } from '@shared/types'

/**
 * Monitors authentication state changes with mapped events and error tracking.
 *
 * @param callback - Function received (event, session)
 * @returns Subscription object with an unsubscribe method
 */
export function watchAuthState(callback: (state: AuthState) => void) {
  const subscription = onAuthStateChange((supabaseEvent, session) => {
    const eventMap: Partial<Record<LowLevelAuthEvent, AuthEvent>> = {
      SIGNED_IN: 'SIGNED_IN',
      SIGNED_OUT: 'SIGNED_OUT',
      USER_UPDATED: 'USER_UPDATED',
      TOKEN_REFRESHED: 'TOKEN_REFRESHED',
      INITIAL_SESSION: 'INITIAL_SESSION'
    }

    const mappedEvent: AuthEvent = eventMap[supabaseEvent] ?? 'UNKNOWN'

    if (mappedEvent === 'UNKNOWN') {
      logError(new Error(`Unexpected Auth Event: ${supabaseEvent}`), 'auth', 'watchAuthState')
    }

    if (supabaseEvent === 'TOKEN_REFRESHED' && !session) {
      logError(
        new Error('Token refresh event received but session is null'),
        'auth',
        'watchAuthState'
      )
    }

    callback({
      event: mappedEvent,
      session: session
    })
  })

  return subscription
}
