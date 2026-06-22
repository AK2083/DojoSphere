import { getCurrentSession as getSupabaseSession, mapSupabaseError, signOut } from '@shared/api'
import { captureException, clearUserContext } from '@shared/lib'
import type { AuthActionResult } from '@shared/types'

import { clearRegisterStorage } from '../../register-user/service/register-storage'
import { notifyLocalAuthStateChanged } from '../../service/local-auth-state'
import { revokeLocalAuthSession } from '../../service/resolve-local-auth-session'
import { MONITORING_EVENTS, monitorWarning } from '../monitoring/monitoring'

/**
 * Executes the sign-out use-case for the authentication feature.
 *
 * On success, this clears user context and stale register progress from storage.
 * On failure, Supabase errors are mapped to app-level errors for UI consumption.
 *
 * @returns Authentication action result indicating success or mapped failure.
 */
export async function signOutUser(): Promise<AuthActionResult> {
  const supabaseSession = await getSupabaseSession()

  await revokeLocalAuthSession()
  notifyLocalAuthStateChanged(null)

  if (supabaseSession) {
    const { error } = await signOut()

    if (error) {
      const mapped = mapSupabaseError(error)

      if (mapped.code !== 'shared.error.retry') {
        captureException(mapped, 'auth', 'signOutUser')
      }

      monitorWarning(MONITORING_EVENTS.SIGN_OUT_FAILED, {
        errorCode: mapped.code
      })

      return {
        success: false,
        error: mapped
      }
    }
  }

  clearUserContext()
  clearRegisterStorage()

  return { success: true }
}
