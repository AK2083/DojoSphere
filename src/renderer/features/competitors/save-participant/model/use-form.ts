import { computed, type MaybeRefOrGetter, nextTick, ref, toValue, watch } from 'vue'
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
import { createParticipant, loadParticipant, updateParticipant } from '../service/save-participant'
import { mapCompetitorToFormState } from './map-competitor-to-form-state'
import { createEmptyParticipantForm, type ParticipantFormState } from './participant-form-state'
import { GRADE_SEEDS } from './static-reference-data'
import { getWeightClassSeedsForAgeClass, useParticipantFormOptions } from './use-form-options'

type UseParticipantFormOptions = {
  participantId?: MaybeRefOrGetter<string | undefined>
}

/**
 * Composable for participant form state, validation, and reference options.
 *
 * @param options - Optional participant id for edit mode.
 * @returns Form fields, translated validation rules, select options, and submit/reset handlers.
 */
export function useParticipantForm(options: UseParticipantFormOptions = {}) {
  const { t } = useTranslation()
  const router = useRouter()

  const formRef = ref<VForm | null>(null)
  const isFormValid = ref(false)
  const isSaving = ref(false)
  const isLoading = ref(false)
  const saveErrorMessage = ref('')
  const loadErrorMessage = ref('')
  const fields = ref(createEmptyParticipantForm())
  const initialFields = ref<ParticipantFormState | null>(null)
  const skipWeightClassReset = ref(false)
  const skipGradeReset = ref(false)

  const participantId = computed(() => toValue(options.participantId))
  const isEditMode = computed(() => Boolean(participantId.value))

  const {
    genderOptions,
    clubOptions,
    nationalityOptions,
    ageClassOptions,
    gradingSystemOptions,
    gradeOptions,
    weightClassOptions,
    isWeightClassRequired,
    selectedAgeClass
  } = useParticipantFormOptions(
    computed(() => fields.value.ageClassId),
    computed(() => fields.value.gradingSystemId)
  )

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

  const isSubmitDisabled = computed(
    () => !isFormValid.value || isSaving.value || isLoading.value || Boolean(loadErrorMessage.value)
  )

  function setFormRef(value: unknown) {
    formRef.value = value as VForm | null
  }

  async function applyFields(nextFields: ParticipantFormState): Promise<void> {
    skipWeightClassReset.value = true
    skipGradeReset.value = true
    fields.value = { ...nextFields }
    await nextTick()
    skipWeightClassReset.value = false
    skipGradeReset.value = false
  }

  watch(
    () => fields.value.ageClassId,
    (nextAgeClassId, previousAgeClassId) => {
      if (skipWeightClassReset.value || nextAgeClassId === previousAgeClassId) {
        return
      }

      fields.value.weightClassId = ''
    }
  )

  watch(
    () => fields.value.gradingSystemId,
    (nextGradingSystemId, previousGradingSystemId) => {
      if (skipGradeReset.value || nextGradingSystemId === previousGradingSystemId) {
        return
      }

      const gradeBelongsToSystem = GRADE_SEEDS.some(
        (grade) =>
          grade.id === fields.value.gradeId && grade.gradingSystemId === nextGradingSystemId
      )

      if (!gradeBelongsToSystem) {
        fields.value.gradeId = ''
      }
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

  watch(
    participantId,
    async (id) => {
      saveErrorMessage.value = ''
      loadErrorMessage.value = ''

      if (!id) {
        initialFields.value = null
        fields.value = createEmptyParticipantForm()
        isLoading.value = false
        return
      }

      isLoading.value = true

      try {
        const competitor = await loadParticipant(id)
        const nextFields = mapCompetitorToFormState(competitor)

        initialFields.value = { ...nextFields }
        await applyFields(nextFields)
        formRef.value?.resetValidation()
      } catch (error) {
        loadErrorMessage.value = t(translationKeys.form.loadError)
        logError(error as Error, 'competitors', 'load-participant')
      } finally {
        isLoading.value = false
      }
    },
    { immediate: true }
  )

  async function submit(): Promise<void> {
    if (!formRef.value || isSaving.value || isLoading.value || loadErrorMessage.value) {
      return
    }

    isSaving.value = true
    saveErrorMessage.value = ''

    try {
      const result = await formRef.value.validate()

      if (!result.valid) {
        return
      }

      if (participantId.value) {
        await updateParticipant(participantId.value, fields.value)
      } else {
        await createParticipant(fields.value)
      }

      await router?.push({ name: 'participants' })
    } catch (error) {
      saveErrorMessage.value = t(translationKeys.form.saveError)
      logError(error as Error, 'competitors', 'save-participant')
    } finally {
      isSaving.value = false
    }
  }

  async function reset(): Promise<void> {
    if (initialFields.value) {
      await applyFields(initialFields.value)
    } else {
      fields.value = createEmptyParticipantForm()
    }

    saveErrorMessage.value = ''
    formRef.value?.resetValidation()
  }

  return {
    fields,
    isFormValid,
    isSaving,
    isLoading,
    isEditMode,
    saveErrorMessage,
    loadErrorMessage,
    isSubmitDisabled,
    isWeightClassRequired,
    selectedAgeClass,
    genderOptions,
    clubOptions,
    nationalityOptions,
    ageClassOptions,
    gradingSystemOptions,
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
