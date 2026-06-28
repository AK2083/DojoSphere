import { getCurrentSession as getSupabaseSession } from '@shared/api'
import type { AuthActionResult } from '@shared/types'

import { clearRegisterStorage } from '../../register-user/service/register-storage'
import { notifyLocalAuthStateChanged } from '../../service/local-auth-state'
import { revokeLocalAuthSession } from '../../service/resolve-local-auth-session'
import { signOutFromSupabase } from '../api/sign-out'

/**
 * Executes the sign-out use-case for the authentication feature.
 *
 * @returns Authentication action result indicating success or mapped failure.
 */
export async function signOutUser(): Promise<AuthActionResult> {
  const supabaseSession = await getSupabaseSession()

  await revokeLocalAuthSession()
  notifyLocalAuthStateChanged(null)

  if (supabaseSession) {
    const result = await signOutFromSupabase()

    if (!result.success) {
      return result
    }
  }

  clearRegisterStorage()

  return { success: true }
}
