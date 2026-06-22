import { computed, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { emailRules, mapRule, passwordRules, useTranslation } from '@shared/lib'
import { useNetworkStatusState } from '@shared/model'

import { MONITORING_EVENTS, monitorWarning } from '../monitoring/monitoring'
import { useRegister } from './use-register'
import { useRegisterRouting } from './use-routing'

/**
 * Composable for registering a new user account.
 *
 * Handles:
 * - form validation
 * - error state for UI consumption
 * - navigation after successful registration
 *
 * @returns Object containing form validation state, email and password fields, translated rules, submit function, error code and loading state
 *
 * @example
 * const { setFormRef, isFormValid, email, password, showPassword, translatedEmailRules, translatedPasswordRules, submit, errorCode, loading } = useRegisterForm()
 */
export function useRegisterForm() {
  const { t } = useTranslation()
  const { execute, clearError, errorCode, loading } = useRegister()
  const { navigateAfterRegisterSuccess } = useRegisterRouting()
  const { isOnline, isCloudUsed } = useNetworkStatusState()

  const form = ref<VForm | null>(null)
  const isFormValid = ref(false)
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)

  const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))
  const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))
  const registerUnavailableHintCode = computed<string | null>(() => {
    if (!isCloudUsed.value) {
      return 'auth.registerUser.unavailable.cloud'
    }

    if (!isOnline.value) {
      return 'auth.registerUser.unavailable.offline'
    }

    return null
  })
  const isRegistrationDisabled = computed(() => Boolean(registerUnavailableHintCode.value))
  const isSubmitDisabled = computed(() => {
    if (isRegistrationDisabled.value || loading.value) {
      return true
    }

    // Keep initial disabled state, but avoid a stale "invalid" lock after mode switches.
    return !isFormValid.value && !email.value && !password.value
  })

  function setFormRef(value: unknown) {
    form.value = value as VForm | null
  }

  watch([email, password], () => {
    if (!errorCode.value) return
    clearError()
  })

  async function submit() {
    if (isRegistrationDisabled.value || loading.value || !form.value) {
      return
    }

    const result = await form.value.validate()

    if (!result.valid) {
      monitorWarning(MONITORING_EVENTS.REGISTER_FORM_INVALID)
      return
    }

    const submittedEmail = email.value
    const success = await execute(submittedEmail, password.value)

    if (!success) {
      monitorWarning(MONITORING_EVENTS.REGISTER_FORM_EXECUTE_FAILED)
      return
    }

    await navigateAfterRegisterSuccess(submittedEmail)
  }

  return {
    isFormValid,
    email,
    password,
    showPassword,
    translatedEmailRules,
    translatedPasswordRules,
    registerUnavailableHintCode,
    isRegistrationDisabled,
    isSubmitDisabled,
    errorCode,
    loading,
    setFormRef,
    submit
  }
}
