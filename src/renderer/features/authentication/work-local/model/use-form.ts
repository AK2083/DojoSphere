import { computed, onMounted, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { displayNameRules, type WorkLocalErrorCode } from './validators'

const workLocalErrorTranslationMap: Record<WorkLocalErrorCode, string> = {
  required: translationKeys.displayName.validation.required,
  minLetters: translationKeys.displayName.validation.minLetters
}

function mapWorkLocalRule(
  rule: (value: string) => true | WorkLocalErrorCode,
  t: (key: string) => string
) {
  return (value: unknown) => {
    if (typeof value !== 'string') return false

    const result = rule(value)

    if (result === true) return true

    return t(workLocalErrorTranslationMap[result])
  }
}

/**
 * Composable for the local-work form (continue without registration).
 *
 * Handles:
 * - pre-filling the display name from the operating system username
 * - translated validation rules for the display name field
 * - form validation and local user creation on submit
 *
 * @returns Object containing form validation state, display name field, translated rules, submit function, and loading state
 */
export function useLocalWorkForm() {
  const { t } = useTranslation()

  const form = ref<VForm | null>(null)
  const isFormValid = ref(false)
  const displayName = ref('')
  const loading = ref(false)

  const translatedDisplayNameRules = displayNameRules.map((rule) => mapWorkLocalRule(rule, t))
  const isSubmitDisabled = computed(() => {
    if (loading.value) {
      return true
    }

    return !isFormValid.value && !displayName.value
  })

  function setFormRef(value: unknown) {
    form.value = value as VForm | null
  }

  async function loadOsUsername() {
    try {
      displayName.value = await globalThis.window.api.getOsUsername()
    } catch {
      displayName.value = ''
    }
  }

  async function submit() {
    if (loading.value || !form.value) {
      return
    }

    const result = await form.value.validate()

    if (!result.valid) {
      return
    }

    loading.value = true

    try {
      await globalThis.window.api.addUser({
        displayName: displayName.value.trim(),
        userType: 'local'
      })
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void loadOsUsername()
  })

  return {
    isFormValid,
    displayName,
    translatedDisplayNameRules,
    isSubmitDisabled,
    loading,
    setFormRef,
    submit
  }
}
