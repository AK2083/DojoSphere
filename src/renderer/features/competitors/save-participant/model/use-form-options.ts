import { computed, type MaybeRef, unref } from 'vue'
import { useTranslation } from '@shared/lib'

import translationKeys from '../i18n/keys'
import {
  AGE_CLASS_SEEDS,
  CLUB_SEEDS,
  GRADE_SEEDS,
  NATIONALITY_CODES,
  WEIGHT_CLASS_SEEDS
} from '../model/static-reference-data'

function formatWeightKg(value: number): string {
  return String(value)
}

function resolveReferenceLabelKey(labelKey: string): string {
  return `competitors.saveParticipant.reference.${labelKey}`
}

/**
 * Builds select options and labels for the participant form.
 *
 * @param ageClassId - Currently selected age class id.
 * @returns Localized select options and derived form state.
 */
export function useParticipantFormOptions(ageClassId: MaybeRef<string>) {
  const { t } = useTranslation()

  const genderOptions = computed(() => [
    { title: t(translationKeys.gender.female), value: 'f' as const },
    { title: t(translationKeys.gender.male), value: 'm' as const },
    { title: t(translationKeys.gender.diverse), value: 'd' as const }
  ])

  const clubOptions = computed(() =>
    CLUB_SEEDS.map((club) => ({
      title: t(
        translationKeys.reference.clubs[
          club.nameKey as keyof typeof translationKeys.reference.clubs
        ]
      ),
      value: club.id
    }))
  )

  const nationalityOptions = computed(() =>
    NATIONALITY_CODES.map((code) => ({
      title: t(translationKeys.reference.nationalities[code]),
      value: code
    }))
  )

  const ageClassOptions = computed(() =>
    AGE_CLASS_SEEDS.map((ageClass) => ({
      title: t(resolveReferenceLabelKey(ageClass.labelKey)),
      value: ageClass.id
    }))
  )

  const gradeOptions = computed(() => [
    { title: t(translationKeys.reference.gradeNone), value: '' },
    ...GRADE_SEEDS.map((grade) => ({
      title: t(resolveReferenceLabelKey(grade.labelKey)),
      value: grade.id
    }))
  ])

  const selectedAgeClass = computed(() =>
    AGE_CLASS_SEEDS.find((ageClass) => ageClass.id === unref(ageClassId))
  )

  const isWeightClassRequired = computed(() => selectedAgeClass.value?.weightMode === 'fixed')

  const weightClassOptions = computed(() => {
    const currentAgeClassId = unref(ageClassId)

    if (!currentAgeClassId) {
      return []
    }

    return WEIGHT_CLASS_SEEDS.filter(
      (weightClass) => weightClass.ageClassId === currentAgeClassId
    ).map((weightClass) => ({
      title:
        weightClass.maxWeightKg !== null
          ? t(translationKeys.reference.weightClass.minus, {
              weight: formatWeightKg(weightClass.maxWeightKg)
            })
          : t(translationKeys.reference.weightClass.plus, {
              weight: formatWeightKg(weightClass.minWeightKg!)
            }),
      value: weightClass.id
    }))
  })

  return {
    genderOptions,
    clubOptions,
    nationalityOptions,
    ageClassOptions,
    gradeOptions,
    weightClassOptions,
    isWeightClassRequired,
    selectedAgeClass
  }
}

/**
 * Returns weight class seeds for the given age class id.
 *
 * @param ageClassId - Age class id from the reference data.
 * @returns Matching weight class seed rows.
 */
export function getWeightClassSeedsForAgeClass(ageClassId: string) {
  return WEIGHT_CLASS_SEEDS.filter((weightClass) => weightClass.ageClassId === ageClassId)
}
