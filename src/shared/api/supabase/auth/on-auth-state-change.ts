import { captureException } from '@shared/lib'

import type { AuthEvent, AuthState } from '../types/auth-user'
import { onAuthStateChange } from './auth'

/**
 * Monitors authentication state changes with mapped events and error tracking.
 * * This intermediate layer abstracts the Supabase-specific event types and
 * provides a consistent interface for the feature layer.
 *
 * @param callback - Function received (event, session)
 * @returns Subscription object with an unsubscribe method
 */
export function watchAuthState(callback: (state: AuthState) => void) {
  const subscription = onAuthStateChange((supabaseEvent, session) => {
    const eventMap: Record<string, AuthEvent> = {
      SIGNED_IN: 'SIGNED_IN',
      SIGNED_OUT: 'SIGNED_OUT',
      USER_UPDATED: 'USER_UPDATED',
      TOKEN_REFRESHED: 'TOKEN_REFRESHED',
      INITIAL_SESSION: 'INITIAL_SESSION'
    }

    const mappedEvent: AuthEvent = eventMap[supabaseEvent] || 'UNKNOWN'

    if (mappedEvent === 'UNKNOWN') {
      captureException(
        new Error(`Unexpected Auth Event: ${supabaseEvent}`),
        'auth',
        'watchAuthState'
      )
    }

    if (supabaseEvent === 'TOKEN_REFRESHED' && !session) {
      captureException(
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
