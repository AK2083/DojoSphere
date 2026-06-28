import { type Ref, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { emailRules, mapRule, useTranslation } from '@shared/lib'

import { useEmailStep } from './use-email-step'

type UseEmailStepFormOptions = {
  onSuccess: (email: string) => void
  loadingModel: Ref<boolean>
}

/**
 * Handles form orchestration for the email step.
 * @param options - The options for the email step
 * @returns The email step composable
 */
export function useEmailStepForm(options: UseEmailStepFormOptions) {
  const { t } = useTranslation()
  const { email, error, loading, execute } = useEmailStep()

  const form = ref<VForm | null>(null)
  const translatedEmailRules = emailRules.map((rule) => mapRule(rule, t))

  function setFormRef(value: unknown) {
    form.value = value as VForm | null
  }

  watch(
    () => loading.value,
    (value: boolean) => {
      options.loadingModel.value = value
    },
    { immediate: true }
  )

  async function submit(): Promise<boolean> {
    if (!form.value) {
      return false
    }

    const result = await form.value.validate()

    if (!result.valid) {
      return false
    }

    const submittedEmail = email.value
    const success = await execute()

    if (!success) {
      return false
    }

    options.onSuccess(submittedEmail)
    return true
  }

  return {
    email,
    error,
    loading,
    translatedEmailRules,
    setFormRef,
    submit
  }
}
