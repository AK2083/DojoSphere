import { ref } from 'vue'

import { loginUserAccount } from './login-user-account'

/**
 * Runs sign-in via {@link loginUserAccount}.
 *
 * @param email - User email address
 * @param password - User password
 * @returns `true` if sign-in succeeded, otherwise `false` (see `errorCode`)
 */
export function useLogin() {
  const errorCode = ref<string | null>(null)
  const loading = ref(false)

  async function execute(email: string, password: string) {
    loading.value = true

    const response = await loginUserAccount(email, password)

    loading.value = false

    if (!response.success) {
      errorCode.value = response.error.code
      return false
    }

    errorCode.value = null
    return true
  }

  return { execute, errorCode, loading }
}
