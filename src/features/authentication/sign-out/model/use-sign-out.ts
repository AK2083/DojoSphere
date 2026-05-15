import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { signOutUser } from '../service/sign-out'

/**
 * Composable that exposes logout state and action for UI layers.
 *
 * @returns Logout action, loading state, and mapped error state helpers.
 */
export function useSignOut() {
  const router = useRouter()
  const loading = ref(false)
  const errorCode = ref<string | null>(null)

  function clearError() {
    errorCode.value = null
  }

  async function logout() {
    if (loading.value) return false

    loading.value = true
    clearError()

    try {
      const result = await signOutUser()

      if (!result.success) {
        errorCode.value = result.error.code
        return false
      }

      await router.push({ name: 'datasource' })
      return true
    } finally {
      loading.value = false
    }
  }

  return {
    logout,
    clearError,
    errorCode,
    loading
  }
}
