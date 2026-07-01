import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'
import { logError, useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import { mapParticipantFormRule } from '../lib/participant-form-error-manager'
import {
  birthDateRule,
  COMPETITOR_COACH_MAX_LENGTH,
  COMPETITOR_NAME_MAX_LENGTH,
  createWeightClassRule,
  genderRule,
  nationalityRule,
  optionalLicenseNumberRule,
  optionalMaxLengthRule,
  optionalPhoneRule,
  passNumberRule,
  requiredFieldRule
} from '../lib/participant-form-rules'
import { createParticipant } from '../service/save-participant'
import { createEmptyParticipantForm } from './participant-form-state'
import { getWeightClassSeedsForAgeClass, useParticipantFormOptions } from './use-form-options'

/**
 * Composable for participant form state, validation, and reference options.
 *
 * @returns Form fields, translated validation rules, select options, and submit/reset handlers.
 */
export function useParticipantForm() {
  const { t } = useTranslation()
  const router = useRouter()

  const formRef = ref<VForm | null>(null)
  const isFormValid = ref(false)
  const isSaving = ref(false)
  const saveErrorMessage = ref('')
  const fields = ref(createEmptyParticipantForm())

  const {
    genderOptions,
    clubOptions,
    nationalityOptions,
    ageClassOptions,
    gradeOptions,
    weightClassOptions,
    isWeightClassRequired,
    selectedAgeClass
  } = useParticipantFormOptions(computed(() => fields.value.ageClassId))

  const mapRule = (rule: Parameters<typeof mapParticipantFormRule>[0]) =>
    mapParticipantFormRule(rule, t)

  const givenNameRules = [
    mapRule(requiredFieldRule),
    mapRule(optionalMaxLengthRule(COMPETITOR_NAME_MAX_LENGTH))
  ]
  const familyNameRules = [
    mapRule(requiredFieldRule),
    mapRule(optionalMaxLengthRule(COMPETITOR_NAME_MAX_LENGTH))
  ]
  const genderRules = [mapRule(genderRule)]
  const birthDateRules = [mapRule(birthDateRule)]
  const clubRules = [mapRule(requiredFieldRule)]
  const nationalityRules = [mapRule(nationalityRule)]
  const ageClassRules = [mapRule(requiredFieldRule)]
  const passNumberRules = [mapRule(passNumberRule)]
  const licenseNumberRules = [mapRule(optionalLicenseNumberRule)]
  const contactPhoneRules = [mapRule(optionalPhoneRule)]
  const coachRules = [mapRule(optionalMaxLengthRule(COMPETITOR_COACH_MAX_LENGTH))]

  const weightClassRules = computed(() => [
    mapRule(
      createWeightClassRule(
        () => fields.value.ageClassId,
        () => getWeightClassSeedsForAgeClass(fields.value.ageClassId)
      )
    )
  ])

  const isSubmitDisabled = computed(() => !isFormValid.value || isSaving.value)

  function setFormRef(value: unknown) {
    formRef.value = value as VForm | null
  }

  watch(
    () => fields.value.ageClassId,
    () => {
      fields.value.weightClassId = ''
    }
  )

  watch(
    () => fields.value.gradeId,
    (gradeId) => {
      if (gradeId == null) {
        fields.value.gradeId = ''
      }
    }
  )

  async function submit(): Promise<void> {
    if (!formRef.value || isSaving.value) {
      return
    }

    isSaving.value = true
    saveErrorMessage.value = ''

    try {
      const result = await formRef.value.validate()

      if (!result.valid) {
        return
      }

      await createParticipant(fields.value)
      await router?.push({ name: 'participants' })
    } catch (error) {
      saveErrorMessage.value = t(translationKeys.form.saveError)
      logError(error as Error, 'competitors', 'save-participant')
    } finally {
      isSaving.value = false
    }
  }

  function reset(): void {
    fields.value = createEmptyParticipantForm()
    saveErrorMessage.value = ''
    formRef.value?.resetValidation()
  }

  return {
    fields,
    isFormValid,
    isSaving,
    saveErrorMessage,
    isSubmitDisabled,
    isWeightClassRequired,
    selectedAgeClass,
    genderOptions,
    clubOptions,
    nationalityOptions,
    ageClassOptions,
    gradeOptions,
    weightClassOptions,
    givenNameRules,
    familyNameRules,
    genderRules,
    birthDateRules,
    clubRules,
    nationalityRules,
    ageClassRules,
    weightClassRules,
    passNumberRules,
    licenseNumberRules,
    contactPhoneRules,
    coachRules,
    setFormRef,
    submit,
    reset
  }
}
