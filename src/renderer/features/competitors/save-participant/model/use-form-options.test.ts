import { computed } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { getWeightClassSeedsForAgeClass, useParticipantFormOptions } from './use-form-options'

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) =>
      params ? `${key}:${JSON.stringify(params)}` : key
  })
}))

describe('useParticipantFormOptions', () => {
  it('builds localized select options', () => {
    const ageClassId = computed(() => 'c2000000-0000-4000-8000-000000000003')
    const options = useParticipantFormOptions(ageClassId)

    expect(options.genderOptions.value).toHaveLength(3)
    expect(options.clubOptions.value[0]?.value).toBe('00000000-0000-0000-0000-000000000000')
    expect(options.nationalityOptions.value.map((entry) => entry.value)).toEqual(['DE', 'AT', 'CH'])
    expect(options.ageClassOptions.value).toHaveLength(18)
    expect(options.isWeightClassRequired.value).toBe(true)
    expect(options.weightClassOptions.value.some((entry) => entry.title.includes('60'))).toBe(true)
  })

  it('marks flexible age classes as not requiring weight classes', () => {
    const ageClassId = computed(() => 'c2000000-0000-4000-8000-000000000001')
    const options = useParticipantFormOptions(ageClassId)

    expect(options.isWeightClassRequired.value).toBe(false)
    expect(options.weightClassOptions.value).toEqual([])
  })

  it('returns empty weight class options without a selected age class', () => {
    const ageClassId = computed(() => '')
    const options = useParticipantFormOptions(ageClassId)

    expect(options.weightClassOptions.value).toEqual([])
    expect(options.selectedAgeClass.value).toBeUndefined()
  })

  it('formats plus weight classes for display', () => {
    const ageClassId = computed(() => 'c2000000-0000-4000-8000-000000000003')
    const options = useParticipantFormOptions(ageClassId)

    expect(
      options.weightClassOptions.value.some((entry) =>
        entry.title.includes('competitors.saveParticipant.reference.weightClass.plus')
      )
    ).toBe(true)
  })

  it('returns weight classes for a fixed age class', () => {
    const weightClasses = getWeightClassSeedsForAgeClass('c2000000-0000-4000-8000-000000000003')

    expect(weightClasses.length).toBeGreaterThan(0)
    expect(weightClasses.every((weightClass) => weightClass.ageClassId.includes('000003'))).toBe(
      true
    )
  })

  it('returns no weight classes for flexible age classes', () => {
    expect(getWeightClassSeedsForAgeClass('c2000000-0000-4000-8000-000000000001')).toEqual([])
  })
})
