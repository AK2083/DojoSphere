/**
 * Storage key used for persisting the Supabase auth session.
 */
const SESSIONKEY = 'dojosphere.auth.session'

/**
 * Returns the storage key used by Supabase auth persistence.
 * @returns The storage key used by Supabase auth persistence.
 */
export function getAuthSessionStorageKey() {
  return SESSIONKEY
}
