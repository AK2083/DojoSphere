import { getAuthSessionStorageKey } from '@shared/api/supabase/model/auth-storage'

/**
 * Indicates whether Supabase has persisted an auth session in browser storage.
 *
 * @returns `true` when the Supabase auth storage key contains an access token.
 */
export function hasSupabaseAuthSessionInStorage(): boolean {
  const raw = globalThis.localStorage?.getItem(getAuthSessionStorageKey())

  if (!raw) {
    return false
  }

  try {
    const parsed = JSON.parse(raw) as { access_token?: string }
    return Boolean(parsed.access_token)
  } catch {
    return false
  }
}
