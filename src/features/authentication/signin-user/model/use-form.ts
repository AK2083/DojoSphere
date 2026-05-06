import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'

import { useLogin } from './use-login'
import { useLoginRouting } from './use-routing'

/**
 * Composable for handling login form state and submission flow.
 *
 * Handles:
 * - form state and validation
 * - error reset on input changes
 * - submit flow and success navigation
 * - password reset navigation
 *
 * @returns Object containing form validation state, email and password fields, translated rules, submit function, error code and loading state
 *
 * @example
 * const { setFormRef, isFormValid, email, password, showPassword, translatedEmailRules, translatedPasswordRules, submit, navigateToPasswordReset, errorCode, loading } = useLoginForm()
 */
export function useLoginForm() {
  const { t } = useTranslation()
  const { execute, clearError, errorCode, loading } = useLogin()
  const { navigateAfterLoginSuccess, goToPasswordReset } = useLoginRouting()

  const form = ref<VForm | null>(null)
  const isFormValid = ref(false)
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)

  const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))
  const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))

  function setFormRef(value: unknown) {
    form.value = value as VForm | null
  }

  watch([email, password], () => {
    if (!errorCode.value) return
    clearError()
  })

  async function submit() {
    if (loading.value || !form.value) return

    const result = await form.value.validate()
    if (!result.valid) return

    const success = await execute(email.value, password.value)
    if (!success) return

    await navigateAfterLoginSuccess()
  }

  async function navigateToPasswordReset() {
    await goToPasswordReset(email.value)
  }

  return {
    isFormValid,
    email,
    password,
    showPassword,
    translatedEmailRules,
    translatedPasswordRules,
    errorCode,
    loading,
    setFormRef,
    submit,
    navigateToPasswordReset
  }
}
