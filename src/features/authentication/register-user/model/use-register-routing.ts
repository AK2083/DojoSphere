import { useRouter } from 'vue-router'

/**
 * Composable that encapsulates register navigation flows.
 *
 * @returns Navigation helpers for register success.
 */
export function useRegisterRouting() {
  const router = useRouter()

  async function navigateAfterRegisterSuccess(email: string) {
    await router.push({
      name: 'emailverification',
      query: { email }
    })
  }

  return { navigateAfterRegisterSuccess }
}
