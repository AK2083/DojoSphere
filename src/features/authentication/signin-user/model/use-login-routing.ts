import { useRoute, useRouter } from 'vue-router'

/**
 * Composable that encapsulates login related navigation flows.
 *
 * @returns Navigation helpers for login success and password reset.
 */
export function useLoginRouting() {
  const route = useRoute()
  const router = useRouter()

  async function navigateAfterLoginSuccess() {
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
      await router.push(redirect)
      return
    }

    await router.push('/')
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
