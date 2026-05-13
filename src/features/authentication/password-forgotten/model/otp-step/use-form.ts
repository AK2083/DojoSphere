import { type Ref, watch } from 'vue'

import { monitorInformation, MONITORING_EVENTS } from '../../monitoring/monitoring'
import { useOtpStep } from './use-otp-step'

type UseOtpStepFormOptions = {
  emailModel: Ref<string>
  validModel: Ref<boolean>
  loadingModel: Ref<boolean>
  onSuccess: (token: string) => void
}

/**
 * Handles form orchestration for the OTP step.
 * @param options - The options for the OTP step
 * @returns OTP state and submit handler for UI bindings.
 */
export function useOtpStepForm(options: UseOtpStepFormOptions) {
  const { email, token, error, loading, execute } = useOtpStep()

  watch(
    () => options.emailModel.value,
    (value: string) => {
      email.value = value
    },
    { immediate: true }
  )

  watch(
    () => token.value,
    (value: string) => {
      options.validModel.value = value.length === 6
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
    monitorInformation(MONITORING_EVENTS.OTP_FORM_SUBMITTED)

    if (token.value.length !== 6) {
      monitorInformation(MONITORING_EVENTS.OTP_FORM_INVALID, {
        tokenLength: token.value.length
      })

      return false
    }

    const submittedToken = token.value
    const success = await execute()

    if (!success) {
      monitorInformation(MONITORING_EVENTS.OTP_FORM_EXECUTE_FAILED)
      return false
    }

    monitorInformation(MONITORING_EVENTS.OTP_FORM_SUCCEEDED)

    options.onSuccess(submittedToken)
    return true
  }

  return {
    email,
    token,
    error,
    loading,
    submit
  }
}
