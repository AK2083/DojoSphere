import { computed } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { DE_DJB_SYSTEM_ID, KODOKAN_SYSTEM_ID } from './grade-reference-data'
import { getWeightClassSeedsForAgeClass, useParticipantFormOptions } from './use-form-options'

vi.mock('@shared/lib', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) =>
      params ? `${key}:${JSON.stringify(params)}` : key
  })
}))

function createFormOptions(ageClassId: string, gradingSystemId = DE_DJB_SYSTEM_ID) {
  return useParticipantFormOptions(
    computed(() => ageClassId),
    computed(() => gradingSystemId)
  )
}

describe('useParticipantFormOptions', () => {
  it('builds localized select options', () => {
    const options = createFormOptions('c2000000-0000-4000-8000-000000000003')

    expect(options.genderOptions.value).toHaveLength(3)
    expect(options.clubOptions.value[0]?.value).toBe('00000000-0000-0000-0000-000000000000')
    expect(options.nationalityOptions.value.map((entry) => entry.value)).toEqual(['DE', 'AT', 'CH'])
    expect(options.ageClassOptions.value).toHaveLength(18)
    expect(options.gradingSystemOptions.value).toHaveLength(3)
    expect(options.isWeightClassRequired.value).toBe(true)
    expect(options.weightClassOptions.value.some((entry) => entry.title.includes('60'))).toBe(true)
  })

  it('filters grade options by grading system', () => {
    const deOptions = createFormOptions('c2000000-0000-4000-8000-000000000003', DE_DJB_SYSTEM_ID)
    const kodokanOptions = createFormOptions(
      'c2000000-0000-4000-8000-000000000003',
      KODOKAN_SYSTEM_ID
    )

    expect(deOptions.gradeOptions.value).toHaveLength(21)
    expect(kodokanOptions.gradeOptions.value).toHaveLength(21)
    expect(deOptions.gradeOptions.value[1]?.value.startsWith('a1')).toBe(true)
    expect(kodokanOptions.gradeOptions.value[1]?.value.startsWith('a3')).toBe(true)
  })

  it('marks flexible age classes as not requiring weight classes', () => {
    const options = createFormOptions('c2000000-0000-4000-8000-000000000001')

    expect(options.isWeightClassRequired.value).toBe(false)
    expect(options.weightClassOptions.value).toEqual([])
  })

  it('returns empty weight class options without a selected age class', () => {
    const options = createFormOptions('')

    expect(options.weightClassOptions.value).toEqual([])
    expect(options.selectedAgeClass.value).toBeUndefined()
  })

  it('formats plus weight classes for display', () => {
    const options = createFormOptions('c2000000-0000-4000-8000-000000000003')

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
