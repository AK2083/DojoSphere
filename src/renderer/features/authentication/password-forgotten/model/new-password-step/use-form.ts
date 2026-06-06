import { computed, type Ref, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { mapRule, passwordRules, useTranslation } from '@shared/lib'

import translationKeys from '../../i18n/keys'
import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { useNewPasswordStep } from './use-new-password-step'

type UseNewPasswordStepFormOptions = {
  validModel: Ref<boolean>
  loadingModel: Ref<boolean>
}

/**
 * Handles form orchestration for the new-password step.
 *
 * @param options
 * @returns New-password form state and submit handler for UI bindings.
 */
export function useNewPasswordStepForm(options: UseNewPasswordStepFormOptions) {
  const { t } = useTranslation()
  const { password, error, loading, execute } = useNewPasswordStep()

  const form = ref<VForm | null>(null)
  const showPassword = ref(false)
  const showRepeatedPassword = ref(false)
  const isFormValid = ref(false)
  const repeatedPassword = ref('')

  const translatedPasswordRules = passwordRules.map((rule) => mapRule(rule, t))
  const passwordsMatch = computed<boolean>(
    () => password.value === repeatedPassword.value && !!password.value
  )
  const repeatPasswordRules = computed(() => [
    ...translatedPasswordRules,
    (value: string) =>
      value === password.value || t(translationKeys.steps.newPassword.error.mismatch)
  ])

  function setFormRef(value: unknown) {
    form.value = value as VForm | null
  }

  watch(
    [isFormValid, passwordsMatch],
    ([formValid, match]) => {
      options.validModel.value = formValid && match
    },
    { immediate: true }
  )

  watch(
    () => loading.value,
    (value: boolean) => {
      options.loadingModel.value = value
    },
    { immediate: true }
  )

  async function submit(): Promise<boolean> {
    monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_FORM_SUBMITTED)

    if (!form.value) {
      monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_FORM_MISSING)
      return false
    }

    const result = await form.value.validate()

    if (!result.valid) {
      monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_FORM_INVALID)
      return false
    }

    if (!passwordsMatch.value) {
      monitorInformation(MONITORING_EVENTS.NEW_PASSWORD_FORM_PASSWORDS_MISMATCH)
      return false
    }

    return execute()
  }

  return {
    password,
    error,
    loading,
    showPassword,
    showRepeatedPassword,
    repeatedPassword,
    isFormValid,
    repeatPasswordRules,
    setFormRef,
    submit
  }
}
