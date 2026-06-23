import { useNetworkStatusState } from '@shared/model/connectivity-state'
import type { AuthError } from '@supabase/supabase-js'

/**
 * Creates a retryable auth error when Supabase requests are blocked by connectivity gates.
 *
 * @returns Auth error compatible with {@link mapSupabaseError}.
 */
export function createSupabaseUnreachableAuthError(): AuthError {
  return {
    name: 'AuthRetryableFetchError',
    message: 'Failed to fetch',
    status: 0,
    code: 'network_error',
    __isAuthError: true,
    toJSON: () => ({})
  } as unknown as AuthError
}

/**
 * Indicates whether Supabase API calls are allowed based on heartbeat reachability.
 *
 * @returns True when the heartbeat gate reports Supabase as reachable.
 */
export function isSupabaseRequestAllowed(): boolean {
  return useNetworkStatusState().isSupabaseReachable.value
}
