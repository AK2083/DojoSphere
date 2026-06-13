import { useRoute, useRouter } from 'vue-router'

import { navigateToDashboard } from '../../service/navigate-to-dashboard'

/**
 * Composable that encapsulates login related navigation flows.
 *
 * @returns Navigation helpers for login success and password reset.
 */
export function useLoginRouting() {
  const route = useRoute()
  const router = useRouter()

  async function navigateAfterLoginSuccess() {
    await navigateToDashboard(router, route)
  }

  async function goToPasswordReset(email?: string) {
    if (!email) {
      await router.push({ name: 'passwordreset' })
      return
    }

    await router.push({ name: 'passwordreset', query: { email } })
  }

  return { navigateAfterLoginSuccess, goToPasswordReset }
}
